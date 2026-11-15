// arm-loomio/src/lib/loomio/voteWeights.ts
// Vote Weight Validation & Management - Ported from Loomio's vote_weight.rb

export interface VoteWeight {
  affiliateId: string;
  groupId: string;
  weight: number;        // 3 decimal places, non-negative
  setBy: string;         // Affiliate ID who set the weight
  setAt: number;         // Timestamp
  reason?: string;       // Audit reason
}

export interface VoteWeightInput {
  affiliateId: string;
  weight: number;
}

export interface VoteWeightValidationResult {
  valid: boolean;
  errors: string[];
  normalizedWeight?: number;
}

export interface BulkVoteWeightResult {
  success: boolean;
  updated: VoteWeight[];
  failed: { affiliateId: string; error: string }[];
}

// Constants
const WEIGHT_DECIMALS = 3;
const WEIGHT_MULTIPLIER = Math.pow(10, WEIGHT_DECIMALS);
const MAX_WEIGHT = 999.999;
const MIN_WEIGHT = 0;

/**
 * Parse and normalize vote weight to 3 decimal places
 * Matches Loomio's client-side parsing rule
 */
export function parseVoteWeight(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  
  if (isNaN(num)) {
    throw new Error('Vote weight must be a valid number');
  }
  
  if (num < MIN_WEIGHT) {
    throw new Error('Vote weight cannot be negative');
  }
  
  if (num > MAX_WEIGHT) {
    throw new Error(`Vote weight cannot exceed ${MAX_WEIGHT}`);
  }
  
  // Round to 3 decimal places (banker's rounding)
  return Math.round(num * WEIGHT_MULTIPLIER) / WEIGHT_MULTIPLIER;
}

/**
 * Validate vote weight input
 */
export function validateVoteWeight(input: string | number): VoteWeightValidationResult {
  try {
    const normalized = parseVoteWeight(input);
    return {
      valid: true,
      errors: [],
      normalizedWeight: normalized,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Invalid vote weight'],
    };
  }
}

/**
 * Validate bulk vote weights - rejects entire batch if any invalid
 * Matches Loomio's bulk update behavior
 */
export function validateBulkVoteWeights(inputs: VoteWeightInput[]): BulkVoteWeightResult {
  const errors: { affiliateId: string; error: string }[] = [];
  const validWeights: VoteWeightInput[] = [];
  
  for (const input of inputs) {
    const result = validateVoteWeight(input.weight);
    if (result.valid && result.normalizedWeight !== undefined) {
      validWeights.push({ ...input, weight: result.normalizedWeight });
    } else {
      errors.push({ 
        affiliateId: input.affiliateId, 
        error: result.errors.join(', ') 
      });
    }
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      updated: [],
      failed: errors,
    };
  }
  
  return {
    success: true,
    updated: validWeights.map((v, i) => ({
      affiliateId: v.affiliateId,
      groupId: '', // Set by caller
      weight: v.weight,
      setBy: '', // Set by caller
      setAt: Date.now(),
    })),
    failed: [],
  };
}

/**
 * Check if weighted voting is available for a proposal type
 * Ported from Loomio's Poll.weighted_voting_available?
 */
export function isWeightedVotingAvailable(
  proposalType: string, 
  anonymous: boolean
): boolean {
  // Import locally to avoid circular dependency
  const { PROPOSAL_TYPES } = require('./proposalTypes');
  
  const config = PROPOSAL_TYPES[proposalType as any];
  if (!config) return false;
  
  if (anonymous) return false;
  if (config.constraints.preventWeightedVoting) return false;
  
  return config.constraints.supportsWeightedVoting;
}

/**
 * Vote Weight Audit Entry
 */
export interface VoteWeightAuditEntry {
  id: string;
  affiliateId: string;
  groupId: string;
  previousWeight: number | null;
  newWeight: number;
  changedBy: string;
  changedAt: number;
  reason?: string;
  event: 'created' | 'updated' | 'deleted' | 'bulk_updated';
}

/**
 * Vote Weight Repository Interface
 */
export interface VoteWeightRepository {
  getWeight(affiliateId: string, groupId: string): Promise<VoteWeight | null>;
  setWeight(weight: VoteWeight): Promise<VoteWeight>;
  deleteWeight(affiliateId: string, groupId: string): Promise<void>;
  getGroupWeights(groupId: string): Promise<VoteWeight[]>;
  getAffiliateWeights(affiliateId: string): Promise<VoteWeight[]>;
  bulkSetWeights(groupId: string, weights: VoteWeight[]): Promise<BulkVoteWeightResult>;
  getAuditTrail(groupId: string, affiliateId?: string): Promise<VoteWeightAuditEntry[]>;
}

/**
 * In-Memory Vote Weight Repository (for testing)
 */
export class InMemoryVoteWeightRepository implements VoteWeightRepository {
  private weights = new Map<string, VoteWeight>(); // key: `${groupId}:${affiliateId}`
  private auditTrail: VoteWeightAuditEntry[] = [];
  private idCounter = 0;

  private makeKey(groupId: string, affiliateId: string): string {
    return `${groupId}:${affiliateId}`;
  }

  async getWeight(affiliateId: string, groupId: string): Promise<VoteWeight | null> {
    return this.weights.get(this.makeKey(groupId, affiliateId)) ?? null;
  }

  async setWeight(weight: VoteWeight): Promise<VoteWeight> {
    const key = this.makeKey(weight.groupId, weight.affiliateId);
    const previous = this.weights.get(key);
    
    this.weights.set(key, weight);
    
    this.auditTrail.push({
      id: `audit_${++this.idCounter}`,
      affiliateId: weight.affiliateId,
      groupId: weight.groupId,
      previousWeight: previous?.weight ?? null,
      newWeight: weight.weight,
      changedBy: weight.setBy,
      changedAt: weight.setAt,
      reason: weight.reason,
      event: previous ? 'updated' : 'created',
    });
    
    return weight;
  }

  async deleteWeight(affiliateId: string, groupId: string): Promise<void> {
    const key = this.makeKey(groupId, affiliateId);
    const previous = this.weights.get(key);
    
    if (previous) {
      this.weights.delete(key);
      this.auditTrail.push({
        id: `audit_${++this.idCounter}`,
        affiliateId,
        groupId,
        previousWeight: previous.weight,
        newWeight: 0,
        changedBy: 'system',
        changedAt: Date.now(),
        event: 'deleted',
      });
    }
  }

  async getGroupWeights(groupId: string): Promise<VoteWeight[]> {
    return Array.from(this.weights.values()).filter(w => w.groupId === groupId);
  }

  async getAffiliateWeights(affiliateId: string): Promise<VoteWeight[]> {
    return Array.from(this.weights.values()).filter(w => w.affiliateId === affiliateId);
  }

  async bulkSetWeights(groupId: string, weights: VoteWeight[]): Promise<BulkVoteWeightResult> {
    const inputs: VoteWeightInput[] = weights.map(w => ({
      affiliateId: w.affiliateId,
      weight: w.weight,
    }));
    
    const validation = validateBulkVoteWeights(inputs);
    if (!validation.success) {
      return validation;
    }
    
    const updated: VoteWeight[] = [];
    for (const weight of validation.updated!) {
      const fullWeight: VoteWeight = {
        ...weight,
        groupId,
        setBy: weights[0]?.setBy ?? 'system',
        setAt: Date.now(),
      };
      await this.setWeight(fullWeight);
      updated.push(fullWeight);
    }
    
    this.auditTrail.push({
      id: `audit_${++this.idCounter}`,
      affiliateId: 'bulk',
      groupId,
      previousWeight: null,
      newWeight: 0,
      changedBy: weights[0]?.setBy ?? 'system',
      changedAt: Date.now(),
      event: 'bulk_updated',
    });
    
    return { success: true, updated, failed: [] };
  }

  async getAuditTrail(groupId: string, affiliateId?: string): Promise<VoteWeightAuditEntry[]> {
    return this.auditTrail.filter(
      entry => entry.groupId === groupId && (!affiliateId || entry.affiliateId === affiliateId)
    );
  }
}

/**
 * Vote Weight Service - Business Logic
 */
export class VoteWeightService {
  constructor(private repository: VoteWeightRepository) {}

  async getWeight(affiliateId: string, groupId: string): Promise<number> {
    const weight = await this.repository.getWeight(affiliateId, groupId);
    return weight?.weight ?? 1; // Default weight is 1
  }

  async setWeight(
    affiliateId: string, 
    groupId: string, 
    weight: number, 
    setBy: string, 
    reason?: string
  ): Promise<VoteWeight> {
    const validation = validateVoteWeight(weight);
    if (!validation.valid || validation.normalizedWeight === undefined) {
      throw new Error(validation.errors.join(', '));
    }

    return this.repository.setWeight({
      affiliateId,
      groupId,
      weight: validation.normalizedWeight,
      setBy,
      setAt: Date.now(),
      reason,
    });
  }

  async bulkSetWeights(
    groupId: string, 
    weights: { affiliateId: string; weight: number }[], 
    setBy: string
  ): Promise<BulkVoteWeightResult> {
    const validation = validateBulkVoteWeights(weights);
    if (!validation.success) {
      throw new Error(`Bulk weight validation failed: ${validation.failed.map(f => `${f.affiliateId}: ${f.error}`).join('; ')}`);
    }

    const fullWeights = validation.updated!.map(w => ({
      ...w,
      groupId,
      setBy,
      setAt: Date.now(),
    }));

    return this.repository.bulkSetWeights(groupId, fullWeights);
  }

  async getGroupWeights(groupId: string): Promise<VoteWeight[]> {
    return this.repository.getGroupWeights(groupId);
  }

  async getAuditTrail(groupId: string, affiliateId?: string): Promise<VoteWeightAuditEntry[]> {
    return this.repository.getAuditTrail(groupId, affiliateId);
  }

  /**
   * Calculate total weight for a group
   */
  async getTotalWeight(groupId: string): Promise<number> {
    const weights = await this.repository.getGroupWeights(groupId);
    return weights.reduce((sum, w) => sum + w.weight, 0);
  }

  /**
   * Check if weights are evenly distributed (fairness metric)
   */
  async getWeightDistribution(groupId: string): Promise<{
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
    giniCoefficient: number;
  }> {
    const weights = await this.repository.getGroupWeights(groupId);
    const values = weights.map(w => w.weight).sort((a, b) => a - b);
    
    if (values.length === 0) {
      return { total: 0, count: 0, average: 0, min: 0, max: 0, giniCoefficient: 0 };
    }
    
    const total = values.reduce((sum, v) => sum + v, 0);
    const average = total / values.length;
    
    // Gini coefficient for inequality measurement
    let giniSum = 0;
    for (let i = 0; i < values.length; i++) {
      giniSum += (2 * (i + 1) - values.length - 1) * values[i];
    }
    const giniCoefficient = giniSum / (values.length * total);
    
    return {
      total,
      count: values.length,
      average,
      min: values[0],
      max: values[values.length - 1],
      giniCoefficient: Math.max(0, giniCoefficient),
    };
  }
}