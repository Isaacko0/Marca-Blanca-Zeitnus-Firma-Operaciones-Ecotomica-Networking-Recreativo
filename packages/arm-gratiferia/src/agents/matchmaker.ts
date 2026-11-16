/**
 * Gratifieria Matchmaker Agent
 * 
 * Ported from solarpunk_utopia's MutualAidMatchmaker
 * Adapted for ARM architecture with:
 * - arm-core integration (types, ops, memory, valueDual)
 * - Configurable weights per gratifieria
 * - Algorithmic transparency (audit trail, explanations)
 * - Amphibious karma integration
 * - Proposal-based (requires approval from both parties)
 */

import type {
  Listing,
  Match,
  MatchData,
  MatchExplanation,
  MatchingAuditLog,
  MatchWeights,
  MatchmakerConfig,
  CategoryMatchType,
  ListingType,
} from "../types.js";
import { 
  toDualValue, 
  createDualConfig, 
  detectModeFromEnv,
  DualValueConfig,
  PriceParityOracle,
} from "./valueDual.js";

export interface MatchmakerDeps {
  /** Repository for listings */
  listingRepo: ListingRepository;
  /** Repository for matches */
  matchRepo: MatchRepository;
  /** Repository for transparency (weights, audit, explanations) */
  transparencyRepo: TransparencyRepository;
  /** Karma system for amphibious rewards */
  karmaSystem?: KarmaSystem;
  /** Oracle for conectado mode */
  oracle?: PriceParityOracle;
}

export interface ListingRepository {
  getActiveOffers(filter?: ListingFilter): Promise<Listing[]>;
  getActiveNeeds(filter?: ListingFilter): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
  updateStatus(id: string, status: Listing["status"]): Promise<void>;
}

export interface MatchRepository {
  create(match: Match): Promise<void>;
  getById(id: string): Promise<Match | null>;
  updateStatus(id: string, status: Match["status"], resolvedBy?: string): Promise<void>;
  getByOfferId(offerId: string): Promise<Match[]>;
  getByNeedId(needId: string): Promise<Match[]>;
}

export interface TransparencyRepository {
  getActiveWeights(communityId?: string): Promise<MatchWeights>;
  createAuditLog(log: MatchingAuditLog): Promise<void>;
  createMatchExplanation(explanation: MatchExplanation): Promise<void>;
  getExplanation(matchId: string): Promise<MatchExplanation | null>;
}

export interface KarmaSystem {
  creditKarma(userId: string, amount: number, note: string): Promise<void>;
  debitKarma(userId: string, amount: number, note: string): Promise<void>;
  getBalance(userId: string): Promise<number>;
  transfer(from: string, to: string, amount: number, note: string): Promise<void>;
}

export interface ListingFilter {
  community_id?: string;
  location_zone?: string;
  max_distance_km?: number;
  category?: string;
}

const AGENT_VERSION = "1.0.0-arm-gratiferia";

export class GratifieriaMatchmaker {
  private listingRepo: ListingRepository;
  private matchRepo: MatchRepository;
  private transparencyRepo: TransparencyRepository;
  private karmaSystem?: KarmaSystem;
  private oracle?: PriceParityOracle;
  private config: MatchmakerConfig;
  private weights?: MatchWeights;
  private dualConfig: DualValueConfig;

  constructor(deps: MatchmakerDeps, config: MatchmakerConfig = {}) {
    this.listingRepo = deps.listingRepo;
    this.matchRepo = deps.matchRepo;
    this.transparencyRepo = deps.transparencyRepo;
    this.karmaSystem = deps.karmaSystem;
    this.oracle = deps.oracle;
    this.config = {
      min_match_score: 0.6,
      max_proposals_per_run: 50,
      enable_audit_logging: true,
      enable_explanations: true,
      ...config,
    };
    
    // Initialize amphibious monetary mode
    const mode = detectModeFromEnv();
    this.dualConfig = createDualConfig(mode, this.oracle);
  }

  /** Main analysis entry point - finds and proposes matches */
  async analyze(): Promise<Match[]> {
    const proposals: Match[] = [];

    // Load weights configuration for this community
    this.weights = await this.transparencyRepo.getActiveWeights(this.config.community_id);
    
    console.log(`[Matchmaker] Using weights: category=${this.weights.category_weight}, location=${this.weights.location_weight}, time=${this.weights.time_weight}, quantity=${this.weights.quantity_weight}`);

    // Get active offers and needs
    const offers = await this.listingRepo.getActiveOffers({ community_id: this.config.community_id });
    const needs = await this.listingRepo.getActiveNeeds({ community_id: this.config.community_id });

    console.log(`[Matchmaker] Analyzing ${offers.length} offers and ${needs.length} needs`);

    // Find matches
    const matches = await this.findMatches(offers, needs);

    // Get threshold from config or weights
    const thresholdScore = this.config.min_match_score ?? this.weights?.min_match_score ?? 0.6;

    // Create proposals for high-scoring matches AND log all decisions
    let proposalCount = 0;
    for (const match of matches) {
      // Log to audit trail (whether matched or not)
      if (this.config.enable_audit_logging) {
        await this.logAuditTrail(match, match.score >= thresholdScore, thresholdScore);
      }

      if (match.score >= thresholdScore) {
        const proposal = await this.createMatchProposal(match);
        if (proposal) {
          await this.matchRepo.create(proposal);
          proposals.push(proposal);
          proposalCount++;
          
          if (proposalCount >= (this.config.max_proposals_per_run ?? 50)) {
            break;
          }
        }
      }
    }

    console.log(`[Matchmaker] Created ${proposals.length} match proposals`);
    return proposals;
  }

  /** Find and score potential matches between offers and needs */
  async findMatches(offers: Listing[], needs: Listing[]): Promise<Array<{ score: number; offer: Listing; need: Listing; match_data: MatchData }>> {
    const matches: Array<{ score: number; offer: Listing; need: Listing; match_data: MatchData }> = [];

    for (const offer of offers) {
      for (const need of needs) {
        const scoreResult = await this.scoreMatch(offer, need);
        if (scoreResult.score > 0) {
          matches.push({
            score: scoreResult.score,
            offer,
            need,
            match_data: scoreResult.match_data,
          });
        }
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    return matches;
  }

  /** Score a potential match between offer and need */
  async scoreMatch(offer: Listing, need: Listing): Promise<{ score: number; match_data: MatchData }> {
    if (!this.weights) {
      throw new Error("Weights not loaded. Call analyze() first or load weights manually.");
    }

    let score = 0.0;
    const match_data: MatchData = {
      category_score: 0,
      category_weight: this.weights.category_weight,
      location_score: 0,
      location_weight: this.weights.location_weight,
      time_score: 0,
      time_weight: this.weights.time_weight,
      quantity_score: 0,
      quantity_weight: this.weights.quantity_weight,
    };

    // Category match
    const categoryResult = this.scoreCategoryMatch(
      offer.resource_spec_id, // Using resource_spec_id as category proxy
      need.resource_spec_id
    );
    score += categoryResult.score * this.weights.category_weight;
    match_data.category_score = categoryResult.score;
    match_data.category_match_type = categoryResult.match_type;

    // Location proximity (if both have location)
    const locationResult = await this.scoreLocationProximity(offer, need);
    score += locationResult.score * this.weights.location_weight;
    match_data.location_score = locationResult.score;
    if (locationResult.distance_km !== undefined) {
      match_data.distance_km = locationResult.distance_km;
      match_data.distance_description = locationResult.description;
    }

    // Time overlap
    const timeResult = this.scoreTimeOverlap(offer, need);
    score += timeResult.score * this.weights.time_weight;
    match_data.time_score = timeResult.score;
    if (timeResult.time_buffer_hours !== undefined) {
      match_data.time_buffer_hours = timeResult.time_buffer_hours;
    }

    // Quantity fit
    const quantityResult = this.scoreQuantityFit(offer, need);
    score += quantityResult.score * this.weights.quantity_weight;
    match_data.quantity_score = quantityResult.score;
    if (quantityResult.quantity_ratio !== undefined) {
      match_data.quantity_ratio = quantityResult.quantity_ratio;
    }

    return { score, match_data };
  }

  /** Score category match (exact, parent, semantic, none) */
  private scoreCategoryMatch(offerCat: string, needCat: string): { score: number; match_type: CategoryMatchType } {
    if (!offerCat || !needCat) {
      return { score: 0.0, match_type: "none" };
    }

    // Exact match
    if (offerCat === needCat) {
      return { score: 1.0, match_type: "exact" };
    }

    // Parent category match (e.g., "food:produce" matches "food:*")
    const offerParts = offerCat.split(":");
    const needParts = needCat.split(":");

    if (offerParts[0] === needParts[0]) {
      return { score: 0.7, match_type: "parent" };
    }

    // Semantic similarity (keyword overlap)
    const offerKeywords = new Set(offerCat.toLowerCase().split(":"));
    const needKeywords = new Set(needCat.toLowerCase().split(":"));
    const overlap = [...offerKeywords].filter(k => needKeywords.has(k)).length;
    
    if (overlap > 0) {
      return { score: 0.5, match_type: "semantic" };
    }

    return { score: 0.0, match_type: "none" };
  }

  /** Score location proximity using coordinates */
  private async scoreLocationProximity(offer: Listing, need: Listing): Promise<{ score: number; distance_km?: number; description: string }> {
    // In a real implementation, fetch Location objects by location_id
    // For now, return default if no coordinates
    // TODO: Integrate with Location repository
    
    // Placeholder: check if same location_id
    if (offer.location_id && need.location_id && offer.location_id === need.location_id) {
      return { score: 1.0, distance_km: 0, description: "Same location" };
    }

    // If no coordinates available, return neutral
    return { score: 0.5, distance_km: undefined, description: "Distance unknown" };
  }

  /** Score time overlap between offer availability and need urgency */
  private scoreTimeOverlap(offer: Listing, need: Listing): { score: number; time_buffer_hours?: number } {
    const offerStart = offer.available_from ? new Date(offer.available_from) : null;
    const offerEnd = offer.available_until ? new Date(offer.available_until) : null;
    const needBy = need.available_until ? new Date(need.available_until) : null; // Using available_until as "needed by"

    if (!offerStart || !offerEnd || !needBy) {
      return { score: 0.5, time_buffer_hours: undefined };
    }

    // Check if need can be fulfilled within offer window
    if (offerStart <= needBy && needBy <= offerEnd) {
      const bufferHours = (offerEnd.getTime() - needBy.getTime()) / (1000 * 60 * 60);
      if (bufferHours > 24) return { score: 1.0, time_buffer_hours: bufferHours };
      if (bufferHours > 6) return { score: 0.8, time_buffer_hours: bufferHours };
      return { score: 0.5, time_buffer_hours: bufferHours };
    }

    return { score: 0.0, time_buffer_hours: 0 };
  }

  /** Score quantity fit (offer meets or exceeds need) */
  private scoreQuantityFit(offer: Listing, need: Listing): { score: number; quantity_ratio?: number } {
    const offerQty = offer.quantity;
    const needQty = need.quantity;
    const offerUnit = offer.unit;
    const needUnit = need.unit;

    if (!offerQty || !needQty || offerUnit !== needUnit) {
      return { score: 0.5, quantity_ratio: undefined };
    }

    const ratio = offerQty / needQty;

    if (offerQty >= needQty) {
      // Exact match or slight overage is ideal
      if (ratio <= 1.5) return { score: 1.0, quantity_ratio: ratio };
      return { score: 0.7, quantity_ratio: ratio };
    } else {
      // Partial fulfillment
      return { score: ratio * 0.6, quantity_ratio: ratio };
    }
  }

  /** Create a match proposal from scored match */
  async createMatchProposal(matchResult: { score: number; offer: Listing; need: Listing; match_data: MatchData }): Promise<Match | null> {
    const { offer, need, score, match_data } = matchResult;

    // Build human-readable explanation
    const explanation = this.buildExplanation(offer, need, match_data);

    // Collect constraints from both parties
    const constraints: string[] = [];
    if (offer.description) constraints.push(`Offer: ${offer.description}`);
    if (need.description) constraints.push(`Need: ${need.description}`);

    const matchId = `mtch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const suggestedQty = Math.min(offer.quantity, need.quantity);
    const suggestedUnit = offer.unit;

    const match: Match = {
      id: matchId,
      offer_id: offer.id,
      need_id: need.id,
      score,
      match_data,
      status: "proposed",
      created_at: new Date().toISOString(),
      suggested_quantity: suggestedQty,
      suggested_unit: suggestedUnit,
      suggested_handoff_time: this.suggestHandoffTime(offer, need),
      suggested_handoff_location: this.suggestHandoffLocation(offer, need),
    };

    // Create detailed explanation for transparency
    if (this.config.enable_explanations) {
      await this.createMatchExplanation(matchId, { offer, need, score, match_data });
    }

    return match;
  }

  /** Build human-readable explanation */
  private buildExplanation(offer: Listing, need: Listing, match_data: MatchData): string {
    const parts: string[] = [];
    
    parts.push(`${offer.title || offer.resource_spec_id} (${offer.quantity} ${offer.unit}) available`);
    parts.push(`${need.title || need.resource_spec_id} needed by ${need.agent_id || "someone"}`);
    
    if (match_data.distance_description) {
      parts.push(match_data.distance_description);
    }
    
    if (match_data.category_match_type === "exact") {
      parts.push("Exact category match");
    } else if (match_data.category_match_type === "parent") {
      parts.push("Compatible category");
    }

    if (match_data.time_buffer_hours && match_data.time_buffer_hours > 24) {
      parts.push("Plenty of time available");
    }

    return parts.join(". ") + ".";
  }

  /** Suggest optimal handoff time */
  private suggestHandoffTime(offer: Listing, need: Listing): string {
    const offerStart = offer.available_from ? new Date(offer.available_from) : null;
    const needBy = need.available_until ? new Date(need.available_until) : null;

    if (offerStart && needBy) {
      const bufferHours = (needBy.getTime() - offerStart.getTime()) / (1000 * 60 * 60);
      if (bufferHours > 24) {
        return "Tomorrow morning (9-10am)";
      }
      return "As soon as convenient";
    }
    return "Coordinate directly";
  }

  /** Suggest optimal handoff location */
  private suggestHandoffLocation(offer: Listing, need: Listing): string {
    // Prefer community commons spaces
    if (offer.location_id?.includes("community") || need.location_id?.includes("community")) {
      return "Community Kitchen or Garden";
    }
    return `${offer.location_id || "Offer location"} (or ${need.location_id || "Need location"})`;
  }

  /** Log matching decision to audit trail for bias detection */
  async logAuditTrail(
    matchResult: { score: number; offer: Listing; need: Listing },
    matched: boolean,
    thresholdScore: number
  ): Promise<void> {
    const auditLog: MatchingAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      match_id: matched ? `mtch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` : undefined,
      offer_id: matchResult.offer.id,
      need_id: matchResult.need.id,
      match_score: matchResult.score,
      threshold_score: thresholdScore,
      matched,
      weights_config_id: this.weights?.id || "weights:system:default",
      provider_zone: matchResult.offer.location_id,
      receiver_zone: matchResult.need.location_id,
      offer_category: matchResult.offer.resource_spec_id,
      need_category: matchResult.need.resource_spec_id,
      agent_version: AGENT_VERSION,
      created_at: new Date().toISOString(),
    };

    try {
      await this.transparencyRepo.createAuditLog(auditLog);
    } catch (error) {
      console.error(`[Matchmaker] Failed to create audit log: ${error}`);
    }
  }

  /** Create detailed explanation for a match */
  async createMatchExplanation(
    matchId: string,
    matchResult: { offer: Listing; need: Listing; score: number; match_data: MatchData }
  ): Promise<MatchExplanation | null> {
    if (!this.weights) return null;

    const { offer, need, score, match_data } = matchResult;

    const explanationParts: string[] = [];
    explanationParts.push(`${offer.title || offer.resource_spec_id} matches ${need.title || need.resource_spec_id}`);

    if (match_data.distance_description) {
      explanationParts.push(match_data.distance_description);
    }

    if (match_data.category_match_type === "exact") {
      explanationParts.push("Exact category match");
    }

    if (match_data.time_buffer_hours && match_data.time_buffer_hours > 24) {
      explanationParts.push("Plenty of time available");
    }

    const explanationText = explanationParts.join(". ") + ".";

    const explanation: MatchExplanation = {
      id: `expl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      match_id: matchId,
      category_score: match_data.category_score,
      location_score: match_data.location_score,
      time_score: match_data.time_score,
      quantity_score: match_data.quantity_score,
      total_score: score,
      category_weight: match_data.category_weight,
      location_weight: match_data.location_weight,
      time_weight: match_data.time_weight,
      quantity_weight: match_data.quantity_weight,
      explanation_text: explanationText,
      distance_km: match_data.distance_km,
      distance_description: match_data.distance_description,
      category_match_type: match_data.category_match_type,
      time_buffer_hours: match_data.time_buffer_hours,
      quantity_ratio: match_data.quantity_ratio,
      created_at: new Date().toISOString(),
    };

    try {
      await this.transparencyRepo.createMatchExplanation(explanation);
    } catch (error) {
      console.error(`[Matchmaker] Failed to create match explanation: ${error}`);
    }

    return explanation;
  }

  /** Get current weights */
  getWeights(): MatchWeights | undefined {
    return this.weights;
  }

  /** Update weights (for community governance) */
  async updateWeights(newWeights: Partial<MatchWeights>): Promise<MatchWeights> {
    if (!this.weights) {
      throw new Error("No weights loaded");
    }
    this.weights = { ...this.weights, ...newWeights, updated_at: new Date().toISOString() };
    // In real implementation, persist to transparencyRepo
    return this.weights;
  }
}

/** Factory function for easy instantiation */
export function createMatchmaker(
  deps: MatchmakerDeps,
  config: MatchmakerConfig = {}
): GratifieriaMatchmaker {
  return new GratifieriaMatchmaker(deps, config);
}