/**
 * Gratifieria Repository Interface
 * 
 * Defines the data access layer for gratifieria domain.
 * Implementations can be SQLite, PostgreSQL, in-memory, etc.
 */

import type {
  Listing,
  Match,
  MatchExplanation,
  MatchingAuditLog,
  MatchWeights,
  Gratiferia,
  KarmaAccount,
  KarmaTransaction,
  SwipeRecord,
  GratiferiaEvent,
  ListingFilter,
  ListingType,
  MatchStatus,
} from "../types.js";

/** Repository for Listing (Offer/Need) operations */
export interface ListingRepository {
  /** Create a new listing */
  create(listing: Listing): Promise<void>;
  
  /** Get listing by ID */
  getById(id: string): Promise<Listing | null>;
  
  /** Update listing */
  update(listing: Listing): Promise<void>;
  
  /** Update listing status */
  updateStatus(id: string, status: Listing["status"]): Promise<void>;
  
  /** Get active offers */
  getActiveOffers(filter?: ListingFilter): Promise<Listing[]>;
  
  /** Get active needs */
  getActiveNeeds(filter?: ListingFilter): Promise<Listing[]>;
  
  /** Get listings by agent */
  getByAgent(agentId: string, filter?: ListingFilter): Promise<Listing[]>;
  
  /** Get listings by community */
  getByCommunity(communityId: string, filter?: ListingFilter): Promise<Listing[]>;
  
  /** Search listings */
  search(filter: ListingFilter): Promise<Listing[]>;
  
  /** Count listings */
  count(filter?: ListingFilter): Promise<number>;
  
  /** Delete listing */
  delete(id: string): Promise<void>;
}

/** Repository for Match operations */
export interface MatchRepository {
  /** Create a new match */
  create(match: Match): Promise<void>;
  
  /** Get match by ID */
  getById(id: string): Promise<Match | null>;
  
  /** Update match */
  update(match: Match): Promise<void>;
  
  /** Update match status */
  updateStatus(id: string, status: MatchStatus, resolvedBy?: string): Promise<void>;
  
  /** Get matches by offer */
  getByOfferId(offerId: string): Promise<Match[]>;
  
  /** Get matches by need */
  getByNeedId(needId: string): Promise<Match[]>;
  
  /** Get matches by agent (both offers and needs) */
  getByAgent(agentId: string): Promise<Match[]>;
  
  /** Get matches by status */
  getByStatus(status: MatchStatus): Promise<Match[]>;
  
  /** Get pending matches for agent */
  getPendingForAgent(agentId: string): Promise<Match[]>;
  
  /** Count matches */
  count(filter?: { status?: MatchStatus; agentId?: string }): Promise<number>;
}

/** Repository for transparency (audit trail, explanations, weights) */
export interface TransparencyRepository {
  /** Get active weights for community */
  getActiveWeights(communityId?: string): Promise<MatchWeights>;
  
  /** Create or update weights */
  upsertWeights(weights: MatchWeights): Promise<void>;
  
  /** Create audit log entry */
  createAuditLog(log: MatchingAuditLog): Promise<void>;
  
  /** Get audit logs for analysis */
  getAuditLogs(filter?: { 
    communityId?: string; 
    startDate?: string; 
    endDate?: string; 
    matched?: boolean;
    limit?: number;
  }): Promise<MatchingAuditLog[]>;
  
  /** Create match explanation */
  createMatchExplanation(explanation: MatchExplanation): Promise<void>;
  
  /** Get explanation for match */
  getExplanation(matchId: string): Promise<MatchExplanation | null>;
  
  /** Get all explanations for match */
  getExplanations(matchId: string): Promise<MatchExplanation[]>;
}

/** Repository for Gratiferia communities */
export interface GratiferiaRepository {
  create(gratiferia: Gratiferia): Promise<void>;
  getById(id: string): Promise<Gratiferia | null>;
  update(gratiferia: Gratiferia): Promise<void>;
  getByAdmin(adminId: string): Promise<Gratiferia[]>;
  getAll(): Promise<Gratiferia[]>;
}

/** Repository for Karma accounts and transactions */
export interface KarmaRepository {
  getAccount(userId: string): Promise<KarmaAccount | null>;
  createAccount(userId: string): Promise<KarmaAccount>;
  updateAccount(account: KarmaAccount): Promise<void>;
  createTransaction(tx: KarmaTransaction): Promise<void>;
  getTransactions(userId: string, limit?: number): Promise<KarmaTransaction[]>;
  getBalance(userId: string): Promise<number>;
}

/** Repository for Swipe records */
export interface SwipeRepository {
  create(swipe: SwipeRecord): Promise<void>;
  getByUser(userId: string, limit?: number): Promise<SwipeRecord[]>;
  getByListing(listingId: string): Promise<SwipeRecord[]>;
  hasUserSwiped(userId: string, listingId: string): Promise<SwipeRecord | null>;
  getSwipeSession(userId: string): Promise<SwipeRecord[]>;
}

/** Repository for Gratiferia events/activity feed */
export interface EventRepository {
  create(event: GratiferiaEvent): Promise<void>;
  getByUser(userId: string, limit?: number): Promise<GratiferiaEvent[]>;
  getByCommunity(communityId: string, limit?: number): Promise<GratiferiaEvent[]>;
  getByMatch(matchId: string): Promise<GratiferiaEvent[]>;
  getRecent(limit?: number): Promise<GratiferiaEvent[]>;
}

/** Combined repository interface for dependency injection */
export interface GratiferiaRepositories {
  listings: ListingRepository;
  matches: MatchRepository;
  transparency: TransparencyRepository;
  gratiferia: GratiferiaRepository;
  karma: KarmaRepository;
  swipes: SwipeRepository;
  events: EventRepository;
}

/** In-memory implementation for testing and development */
export class InMemoryRepositories implements GratiferiaRepositories {
  listings = new Map<string, Listing>();
  matches = new Map<string, Match>();
  weights = new Map<string, MatchWeights>();
  auditLogs: MatchingAuditLog[] = [];
  explanations = new Map<string, MatchExplanation>();
  gratiferia = new Map<string, Gratiferia>();
  karmaAccounts = new Map<string, KarmaAccount>();
  karmaTransactions: KarmaTransaction[] = [];
  swipes = new Map<string, SwipeRecord>();
  events: GratiferiaEvent[] = [];

  // ListingRepository
  listingsRepo: ListingRepository = {
    create: async (listing) => { this.listings.set(listing.id, listing); },
    getById: async (id) => this.listings.get(id) || null,
    update: async (listing) => { this.listings.set(listing.id, listing); },
    updateStatus: async (id, status) => { const l = this.listings.get(id); if (l) { l.status = status; l.updated_at = new Date().toISOString(); } },
    getActiveOffers: async (filter) => this.filterListings("offer", filter),
    getActiveNeeds: async (filter) => this.filterListings("need", filter),
    getByAgent: async (agentId, filter) => this.filterListings(undefined, filter).then(ls => ls.filter(l => l.agent_id === agentId)),
    getByCommunity: async (communityId, filter) => this.filterListings(undefined, filter).then(ls => ls.filter(l => l.community_id === communityId)),
    search: async (filter) => this.filterListings(undefined, filter),
    count: async (filter) => this.filterListings(undefined, filter).then(ls => ls.length),
    delete: async (id) => this.listings.delete(id),
  };

  // MatchRepository
  matchesRepo: MatchRepository = {
    create: async (match) => this.matches.set(match.id, match),
    getById: async (id) => this.matches.get(id) || null,
    update: async (match) => this.matches.set(match.id, match),
    updateStatus: async (id, status, resolvedBy) => { const m = this.matches.get(id); if (m) { m.status = status; m.resolved_at = new Date().toISOString(); m.resolved_by = resolvedBy; } },
    getByOfferId: async (offerId) => Array.from(this.matches.values()).filter(m => m.offer_id === offerId),
    getByNeedId: async (needId) => Array.from(this.matches.values()).filter(m => m.need_id === needId),
    getByAgent: async (agentId) => Array.from(this.matches.values()).filter(m => m.offer_id.startsWith(agentId) || m.need_id.startsWith(agentId)),
    getByStatus: async (status) => Array.from(this.matches.values()).filter(m => m.status === status),
    getPendingForAgent: async (agentId) => Array.from(this.matches.values()).filter(m => m.status === "proposed" && (m.offer_id.startsWith(agentId) || m.need_id.startsWith(agentId))),
    count: async (filter) => Array.from(this.matches.values()).filter(m => !filter?.status || m.status === filter.status).length,
  };

  // TransparencyRepository
  transparencyRepo: TransparencyRepository = {
    getActiveWeights: async (communityId) => {
      const key = communityId || "default";
      if (!this.weights.has(key)) {
        this.weights.set(key, {
          id: `weights_${key}`,
          community_id: communityId,
          category_weight: 0.4,
          location_weight: 0.3,
          time_weight: 0.2,
          quantity_weight: 0.1,
          min_match_score: 0.6,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        });
      }
      return this.weights.get(key)!;
    },
    upsertWeights: async (weights) => this.weights.set(weights.id, weights),
    createAuditLog: async (log) => this.auditLogs.push(log),
    getAuditLogs: async (filter) => {
      let logs = [...this.auditLogs];
      if (filter?.communityId) logs = logs.filter(l => l.provider_zone?.includes(filter.communityId!) || l.receiver_zone?.includes(filter.communityId!));
      if (filter?.matched !== undefined) logs = logs.filter(l => l.matched === filter.matched);
      if (filter?.limit) logs = logs.slice(-filter.limit);
      return logs;
    },
    createMatchExplanation: async (explanation) => this.explanations.set(explanation.id, explanation),
    getExplanation: async (matchId) => Array.from(this.explanations.values()).find(e => e.match_id === matchId) || null,
    getExplanations: async (matchId) => Array.from(this.explanations.values()).filter(e => e.match_id === matchId),
  };

  // GratiferiaRepository
  gratiferiaRepo: GratiferiaRepository = {
    create: async (g) => this.gratiferia.set(g.id, g),
    getById: async (id) => this.gratiferia.get(id) || null,
    update: async (g) => this.gratiferia.set(g.id, g),
    getByAdmin: async (adminId) => Array.from(this.gratiferia.values()).filter(g => g.admin_ids.includes(adminId)),
    getAll: async () => Array.from(this.gratiferia.values()),
  };

  // KarmaRepository
  karmaRepo: KarmaRepository = {
    getAccount: async (userId) => this.karmaAccounts.get(userId) || null,
    createAccount: async (userId) => {
      const account: KarmaAccount = {
        user_id: userId,
        znu_balance: 100,
        total_given: 0,
        total_received: 0,
        matches_fulfilled: 0,
        matches_cancelled: 0,
        trust_score: 0.5,
        last_activity: new Date().toISOString(),
      };
      this.karmaAccounts.set(userId, account);
      return account;
    },
    updateAccount: async (account) => this.karmaAccounts.set(account.user_id, account),
    createTransaction: async (tx) => this.karmaTransactions.push(tx),
    getTransactions: async (userId, limit = 50) => this.karmaTransactions.filter(t => t.from_user === userId || t.to_user === userId).slice(-limit),
    getBalance: async (userId) => (await this.karmaRepo.getAccount(userId))?.znu_balance || 0,
  };

  // SwipeRepository
  swipesRepo: SwipeRepository = {
    create: async (swipe) => this.swipes.set(swipe.id, swipe),
    getByUser: async (userId, limit = 50) => Array.from(this.swipes.values()).filter(s => s.user_id === userId).slice(-limit),
    getByListing: async (listingId) => Array.from(this.swipes.values()).filter(s => s.listing_id === listingId),
    hasUserSwiped: async (userId, listingId) => Array.from(this.swipes.values()).find(s => s.user_id === userId && s.listing_id === listingId) || null,
    getSwipeSession: async (userId) => Array.from(this.swipes.values()).filter(s => s.user_id === userId),
  };

  // EventRepository
  eventsRepo: EventRepository = {
    create: async (event) => this.events.push(event),
    getByUser: async (userId, limit = 50) => this.events.filter(e => e.actor_id === userId).slice(-limit),
    getByCommunity: async (communityId, limit = 50) => this.events.filter(e => e.data.community_id === communityId).slice(-limit),
    getByMatch: async (matchId) => this.events.filter(e => e.match_id === matchId),
    getRecent: async (limit = 50) => this.events.slice(-limit),
  };

  private filterListings(type: ListingType | undefined, filter?: ListingFilter): Listing[] {
    let results = Array.from(this.listings.values());
    if (type) results = results.filter(l => l.listing_type === type);
    if (filter?.community_id) results = results.filter(l => l.community_id === filter.community_id);
    if (filter?.status) results = results.filter(l => l.status === filter.status);
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      results = results.filter(l => 
        l.title?.toLowerCase().includes(q) || 
        l.description?.toLowerCase().includes(q) ||
        l.resource_spec_id.toLowerCase().includes(q)
      );
    }
    return results;
  }

  get listingsRepoImpl() { return this.listingsRepo; }
  get matchesRepoImpl() { return this.matchesRepo; }
  get transparencyRepoImpl() { return this.transparencyRepo; }
  get gratiferiaRepoImpl() { return this.gratiferiaRepo; }
  get karmaRepoImpl() { return this.karmaRepo; }
  get swipesRepoImpl() { return this.swipesRepo; }
  get eventsRepoImpl() { return this.eventsRepo; }
}