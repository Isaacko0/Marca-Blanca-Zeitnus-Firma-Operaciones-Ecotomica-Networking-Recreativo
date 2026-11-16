// arm-sensorica/src/core/contributionAccounting.ts - Contribution Tracking
import { 
  Contribution, 
  ContributionId, 
  AffiliateId, 
  ProjectId, 
  ContributionType, 
  VerificationStatus,
  Quantity,
  Timestamp,
  EvidenceRef,
  ContributionMetadata,
  Contribution as ContributionTypeDef
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// CONTRIBUTION REPOSITORY
// ============================================

export interface ContributionRepository {
  save(contribution: Contribution): Promise<Contribution>;
  findById(id: ContributionId): Promise<Contribution | null>;
  findByProject(projectId: ProjectId): Promise<Contribution[]>;
  findByAffiliate(affiliateId: AffiliateId): Promise<Contribution[]>;
  findByStatus(status: VerificationStatus): Promise<Contribution[]>;
  findByType(type: ContributionType): Promise<Contribution[]>;
  findByProjectAndType(projectId: ProjectId, type: ContributionType): Promise<Contribution[]>;
  update(contribution: Contribution): Promise<Contribution>;
  delete(id: ContributionId): Promise<boolean>;
}

export class InMemoryContributionRepository implements ContributionRepository {
  private contributions: Map<ContributionId, Contribution> = new Map();
  private byProject: Map<ProjectId, Set<ContributionId>> = new Map();
  private byAffiliate: Map<AffiliateId, Set<ContributionId>> = new Map();
  private byStatus: Map<VerificationStatus, Set<ContributionId>> = new Map();
  private byType: Map<ContributionType, Set<ContributionId>> = new Map();

  async save(contribution: Contribution): Promise<Contribution> {
    this.contributions.set(contribution.id, contribution);
    this.addToIndex(this.byProject, contribution.projectId, contribution.id);
    this.addToIndex(this.byAffiliate, contribution.affiliateId, contribution.id);
    this.addToIndex(this.byStatus, contribution.verificationStatus, contribution.id);
    this.addToIndex(this.byType, contribution.type, contribution.id);
    return contribution;
  }

  async findById(id: ContributionId): Promise<Contribution | null> {
    return this.contributions.get(id) || null;
  }

  async findByProject(projectId: ProjectId): Promise<Contribution[]> {
    const ids = this.byProject.get(projectId) || new Set();
    return Array.from(ids).map(id => this.contributions.get(id)!).filter(Boolean);
  }

  async findByAffiliate(affiliateId: AffiliateId): Promise<Contribution[]> {
    const ids = this.byAffiliate.get(affiliateId) || new Set();
    return Array.from(ids).map(id => this.contributions.get(id)!).filter(Boolean);
  }

  async findByStatus(status: VerificationStatus): Promise<Contribution[]> {
    const ids = this.byStatus.get(status) || new Set();
    return Array.from(ids).map(id => this.contributions.get(id)!).filter(Boolean);
  }

  async findByType(type: ContributionType): Promise<Contribution[]> {
    const ids = this.byType.get(type) || new Set();
    return Array.from(ids).map(id => this.contributions.get(id)!).filter(Boolean);
  }

  async findByProjectAndType(projectId: ProjectId, type: ContributionType): Promise<Contribution[]> {
    const projectIds = this.byProject.get(projectId) || new Set();
    const typeIds = this.byType.get(type) || new Set();
    const intersection = new Set([...projectIds].filter(x => typeIds.has(x)));
    return Array.from(intersection).map(id => this.contributions.get(id)!).filter(Boolean);
  }

  async update(contribution: Contribution): Promise<Contribution> {
    const existing = this.contributions.get(contribution.id);
    if (!existing) throw new Error('Contribution not found');
    
    // Update indexes if status changed
    if (existing.verificationStatus !== contribution.verificationStatus) {
      this.removeFromIndex(this.byStatus, existing.verificationStatus, contribution.id);
      this.addToIndex(this.byStatus, contribution.verificationStatus, contribution.id);
    }
    
    this.contributions.set(contribution.id, contribution);
    return contribution;
  }

  async delete(id: ContributionId): Promise<boolean> {
    const contribution = this.contributions.get(id);
    if (!contribution) return false;
    
    this.contributions.delete(id);
    this.removeFromIndex(this.byProject, contribution.projectId, id);
    this.removeFromIndex(this.byAffiliate, contribution.affiliateId, id);
    this.removeFromIndex(this.byStatus, contribution.verificationStatus, id);
    this.removeFromIndex(this.byType, contribution.type, id);
    
    return true;
  }

  private addToIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(value);
  }

  private removeFromIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    const set = map.get(key);
    if (set) {
      set.delete(value);
      if (set.size === 0) map.delete(key);
    }
  }
}

// ============================================
// CONTRIBUTION FACTORY
// ============================================

export interface CreateContributionInput {
  affiliateId: string;
  projectId: string;
  type: 'time' | 'materials' | 'capital' | 'knowledge' | 'space';
  quantity: { value: bigint; unit: string };
  evidence?: Array<{
    type: 'document' | 'photo' | 'timestamp' | 'witness' | 'sensor';
    uri: string;
    hash?: string;
    timestamp: { value: number; timezone: string };
  }>;
  metadata?: {
    description?: string;
    tags?: string[];
    projectPhase?: string;
    relatedContributions?: string[];
    customFields?: Record<string, unknown>;
  };
}

export function createContribution(input: CreateContributionInput): Contribution {
  return {
    id: generateId('contrib') as any,
    affiliateId: input.affiliateId as any,
    projectId: input.projectId as any,
    type: input.type,
    quantity: input.quantity,
    timestamp: { value: Date.now(), timezone: 'UTC' },
    verificationStatus: 'pending',
    evidence: input.evidence?.map(e => ({
      type: e.type,
      uri: e.uri,
      hash: e.hash ? { algorithm: 'sha256', value: e.hash } : undefined,
      timestamp: e.timestamp
    })) || [],
    metadata: input.metadata || {}
  };
}

// ============================================
// CONTRIBUTION ANALYTICS
// ============================================

export interface ContributionSummary {
  totalContributions: number;
  totalVerified: number;
  totalPending: number;
  totalDisputed: number;
  byType: Record<string, { count: number; totalQuantity: number }>;
  byAffiliate: Record<string, { count: number; totalQuantity: number }>;
  totalQuantityByType: Record<string, number>;
}

export function summarizeContributions(contributions: Contribution[]): ContributionSummary {
  const summary: ContributionSummary = {
    totalContributions: contributions.length,
    totalVerified: 0,
    totalPending: 0,
    totalDisputed: 0,
    byType: {},
    byAffiliate: {},
    totalQuantityByType: {}
  };

  for (const c of contributions) {
    // By status
    switch (c.verificationStatus) {
      case 'verified': summary.totalVerified++; break;
      case 'pending': summary.totalPending++; break;
      case 'disputed': summary.totalDisputed++; break;
    }

    // By type
    const typeKey = c.type;
    if (!summary.byType[typeKey]) {
      summary.byType[typeKey] = { count: 0, totalQuantity: 0 };
    }
    summary.byType[typeKey].count++;
    summary.byType[typeKey].totalQuantity += Number(c.quantity.value);

    // By affiliate
    const affKey = c.affiliateId as string;
    if (!summary.byAffiliate[affKey]) {
      summary.byAffiliate[affKey] = { count: 0, totalQuantity: 0 };
    }
    summary.byAffiliate[affKey].count++;
    summary.byAffiliate[affKey].totalQuantity += Number(c.quantity.value);

    // Total quantity by type
    summary.totalQuantityByType[typeKey] = (summary.totalQuantityByType[typeKey] || 0) + Number(c.quantity.value);
  }

  return summary;
}

// ============================================
// CONTRIBUTION VALIDATION
// ============================================

export interface ValidationRule {
  type: ContributionType;
  maxQuantity?: number;
  minQuantity?: number;
  requiredEvidenceTypes?: string[];
  customValidator?: (contribution: Contribution) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateContribution(
  contribution: Contribution,
  rules: ValidationRule[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rule = rules.find(r => r.type === contribution.type);
  if (!rule) {
    warnings.push(`No validation rule for contribution type: ${contribution.type}`);
    return { valid: true, errors, warnings };
  }

  const qty = Number(contribution.quantity.value);

  if (rule.maxQuantity !== undefined && qty > rule.maxQuantity) {
    errors.push(`Quantity ${qty} exceeds maximum ${rule.maxQuantity} for ${contribution.type}`);
  }

  if (rule.minQuantity !== undefined && qty < rule.minQuantity) {
    errors.push(`Quantity ${qty} below minimum ${rule.minQuantity} for ${contribution.type}`);
  }

  if (rule.requiredEvidenceTypes) {
    const evidenceTypes = contribution.evidence?.map(e => e.type) || [];
    for (const required of rule.requiredEvidenceTypes) {
      if (!evidenceTypes.includes(required)) {
        errors.push(`Missing required evidence type: ${required}`);
      }
    }
  }

  if (rule.customValidator && !rule.customValidator(contribution)) {
    errors.push(`Custom validation failed for ${contribution.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================
// DEFAULT VALIDATION RULES
// ============================================

export const DEFAULT_VALIDATION_RULES: ValidationRule[] = [
  {
    type: 'time',
    maxQuantity: 168, // max hours per week
    minQuantity: 0.25, // 15 minutes minimum
    requiredEvidenceTypes: ['timestamp']
  },
  {
    type: 'materials',
    maxQuantity: 10000,
    minQuantity: 1,
    requiredEvidenceTypes: ['document', 'photo']
  },
  {
    type: 'capital',
    maxQuantity: 1000000,
    minQuantity: 1,
    requiredEvidenceTypes: ['document']
  },
  {
    type: 'knowledge',
    maxQuantity: 100,
    minQuantity: 1,
    requiredEvidenceTypes: ['document']
  },
  {
    type: 'space',
    maxQuantity: 1000,
    minQuantity: 1,
    requiredEvidenceTypes: ['document', 'timestamp']
  }
];

// ============================================
// CONTRIBUTION SEQUENCE (for event sourcing)
// ============================================

export interface ContributionSequence {
  projectId: string;
  sequence: number;
  lastContributionId: string;
  lastTimestamp: number;
}

export class InMemoryContributionSequenceStore {
  private sequences: Map<string, ContributionSequence> = new Map();

  async getNextSequence(projectId: string): Promise<number> {
    const seq = this.sequences.get(projectId) || { projectId, sequence: 0, lastContributionId: '', lastTimestamp: 0 };
    seq.sequence++;
    seq.lastTimestamp = Date.now();
    this.sequences.set(projectId, seq);
    return seq.sequence;
  }

  async setLastContribution(projectId: string, contributionId: string): Promise<void> {
    const seq = this.sequences.get(projectId) || { projectId, sequence: 0, lastContributionId: '', lastTimestamp: 0 };
    seq.lastContributionId = contributionId;
    seq.lastTimestamp = Date.now();
    this.sequences.set(projectId, seq);
  }

  async getSequence(projectId: string): Promise<ContributionSequence | null> {
    return this.sequences.get(projectId) || null;
  }
}