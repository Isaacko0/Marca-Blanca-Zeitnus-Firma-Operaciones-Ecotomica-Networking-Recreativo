// arm-sensorica/src/core/affiliate.ts - Affiliate Management (extends arm-gratiferia)
import { 
  Affiliate, 
  AffiliateId, 
  AffiliateProfile, 
  ContributionId, 
  ProjectId, 
  TrustScore,
  GovernanceRole,
  Timestamp,
  ContactInfo,
  EarningsRecord,
  DistributionId,
  ContributionType,
  Quantity
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// AFFILIATE REPOSITORY
// ============================================

export interface AffiliateRepository {
  save(affiliate: Affiliate): Promise<Affiliate>;
  findById(id: AffiliateId): Promise<Affiliate | null>;
  findAll(): Promise<Affiliate[]>;
  findByRole(role: GovernanceRole): Promise<Affiliate[]>;
  findByProject(projectId: ProjectId): Promise<Affiliate[]>;
  update(affiliate: Affiliate): Promise<Affiliate>;
  delete(id: AffiliateId): Promise<boolean>;
}

export class InMemoryAffiliateRepository implements AffiliateRepository {
  private affiliates: Map<string, Affiliate> = new Map();
  private byRole: Map<GovernanceRole, Set<string>> = new Map();
  private byProject: Map<string, Set<string>> = new Map();

  async save(affiliate: Affiliate): Promise<Affiliate> {
    this.affiliates.set(affiliate.id as string, affiliate);
    this.addToIndex(this.byRole, affiliate.governanceRole, affiliate.id);
    for (const projectId of affiliate.projects) {
      this.addToIndex(this.byProject, projectId, affiliate.id);
    }
    return affiliate;
  }

  async findById(id: AffiliateId): Promise<Affiliate | null> {
    return this.affiliates.get(id as string) || null;
  }

  async findAll(): Promise<Affiliate[]> {
    return Array.from(this.affiliates.values());
  }

  async findByRole(role: GovernanceRole): Promise<Affiliate[]> {
    const ids = this.byRole.get(role) || new Set();
    return Array.from(ids).map(id => this.affiliates.get(id)!).filter(Boolean);
  }

  async findByProject(projectId: ProjectId): Promise<Affiliate[]> {
    const ids = this.byProject.get(projectId as string) || new Set();
    return Array.from(ids).map(id => this.affiliates.get(id)!).filter(Boolean);
  }

  async update(affiliate: Affiliate): Promise<Affiliate> {
    const existing = this.affiliates.get(affiliate.id as string);
    if (!existing) throw new Error('Affiliate not found');
    
    if (existing.governanceRole !== affiliate.governanceRole) {
      this.removeFromIndex(this.byRole, existing.governanceRole, affiliate.id);
      this.addToIndex(this.byRole, affiliate.governanceRole, affiliate.id);
    }
    
    // Update project indexes
    const oldProjects = new Set(existing.projects.map(p => p as string));
    const newProjects = new Set(affiliate.projects.map(p => p as string));
    
    for (const p of oldProjects) {
      if (!newProjects.has(p)) {
        this.removeFromIndex(this.byProject, p, affiliate.id);
      }
    }
    for (const p of newProjects) {
      if (!oldProjects.has(p)) {
        this.addToIndex(this.byProject, p, affiliate.id);
      }
    }
    
    this.affiliates.set(affiliate.id as string, affiliate);
    return affiliate;
  }

  async delete(id: AffiliateId): Promise<boolean> {
    const affiliate = this.affiliates.get(id as string);
    if (!affiliate) return false;
    
    this.affiliates.delete(id as string);
    this.removeFromIndex(this.byRole, affiliate.governanceRole, affiliate.id);
    for (const p of affiliate.projects) {
      this.removeFromIndex(this.byProject, p as string, affiliate.id);
    }
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
// AFFILIATE SERVICE
// ============================================

export interface AffiliateService {
  register(input: RegisterAffiliateInput): Promise<Affiliate>;
  updateProfile(affiliateId: AffiliateId, profile: Partial<AffiliateProfile>): Promise<Affiliate>;
  updateRole(affiliateId: AffiliateId, role: GovernanceRole): Promise<Affiliate>;
  addToProject(affiliateId: AffiliateId, projectId: ProjectId): Promise<Affiliate>;
  removeFromProject(affiliateId: AffiliateId, projectId: ProjectId): Promise<Affiliate>;
  recordEarnings(affiliateId: AffiliateId, distributionId: DistributionId, amount: { postmonetario: bigint; conectado: bigint }, contributionIds: ContributionId[]): Promise<Affiliate>;
  getEarningsHistory(affiliateId: AffiliateId): Promise<Array<{ distributionId: DistributionId; amount: { postmonetario: bigint; conectado: bigint }; timestamp: any; contributionIds: ContributionId[] }>>;
  getContributionStats(affiliateId: AffiliateId): Promise<ContributionStats>;
}

export interface RegisterAffiliateInput {
  profile: AffiliateProfile;
  initialTrustScore?: number;
  initialRole?: GovernanceRole;
}

export interface ContributionStats {
  totalContributions: number;
  verifiedContributions: number;
  totalQuantityByType: Record<string, number>;
  totalEarnings: { postmonetario: bigint; conectado: bigint };
  projectsParticipated: number;
  averageTrustScore: number;
}

export class AffiliateServiceImpl implements AffiliateService {
  constructor(private repo: AffiliateRepository) {}

  async register(input: RegisterAffiliateInput): Promise<Affiliate> {
    const affiliate: Affiliate = {
      id: generateId('aff') as any,
      profile: input.profile,
      contributions: [],
      earnings: [],
      trustScore: {
        value: input.initialTrustScore || 0.5,
        lastUpdated: { value: Date.now(), timezone: 'UTC' },
        source: 'composite'
      },
      governanceRole: input.initialRole || 'affiliate',
      joinedAt: { value: Date.now(), timezone: 'UTC' },
      projects: []
    };
    return this.repo.save(affiliate);
  }

  async updateProfile(affiliateId: AffiliateId, profile: Partial<AffiliateProfile>): Promise<Affiliate> {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    
    const updated = { ...affiliate, profile: { ...affiliate.profile, ...profile } };
    return this.repo.update(updated);
  }

  async updateRole(affiliateId: AffiliateId, role: GovernanceRole): Promise<Affiliate> {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    
    const updated = { ...affiliate, governanceRole: role };
    return this.repo.update(updated);
  }

  async addToProject(affiliateId: AffiliateId, projectId: ProjectId): Promise<Affiliate> {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    if (affiliate.projects.includes(projectId)) return affiliate;
    
    const updated = { 
      ...affiliate, 
      projects: [...affiliate.projects, projectId] 
    };
    return this.repo.update(updated);
  }

  async removeFromProject(affiliateId: AffiliateId, projectId: ProjectId): Promise<Affiliate> {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    
    const updated = { 
      ...affiliate, 
      projects: affiliate.projects.filter(p => p !== projectId) 
    };
    return this.repo.update(updated);
  }

  async recordEarnings(
    affiliateId: AffiliateId, 
    distributionId: DistributionId, 
    amount: { postmonetario: bigint; conectado: bigint },
    contributionIds: ContributionId[]
  ): Promise<Affiliate> {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    
    const earning = {
      distributionId,
      amount: { postmonetario: amount.postmonetario, conectado: amount.conectado },
      timestamp: { value: Date.now(), timezone: 'UTC' },
      contributionIds
    };
    
    const updated = {
      ...affiliate,
      earnings: [...affiliate.earnings, earning]
    };
    return this.repo.update(updated);
  }

  async getEarningsHistory(affiliateId: AffiliateId) {
    const affiliate = await this.repo.findById(affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');
    return affiliate.earnings;
  }

  async getContributionStats(affiliateId: AffiliateId): Promise<{
    totalContributions: number;
    verifiedContributions: number;
    totalQuantityByType: Record<string, number>;
    totalEarnings: { postmonetario: bigint; conectado: bigint };
    projectsParticipated: number;
    averageTrustScore: number;
  }> {
    // In real impl, would query contributions repository
    return {
      totalContributions: 0,
      verifiedContributions: 0,
      totalQuantityByType: {},
      totalEarnings: { postmonetario: 0n, conectado: 0n },
      projectsParticipated: 0,
      averageTrustScore: 0.5
    };
  }
}

// ============================================
// AFFILIATE FACTORY
// ============================================

export interface CreateAffiliateInput {
  displayName: string;
  skills?: string[];
  bio?: string;
  email?: string;
  matrix?: string;
  nostr?: string;
  website?: string;
  initialTrustScore?: number;
  initialRole?: GovernanceRole;
}

export function createAffiliate(input: CreateAffiliateInput): Affiliate {
  return {
    id: generateId('aff') as any,
    profile: {
      displayName: input.displayName,
      skills: input.skills || [],
      bio: input.bio,
      avatarUri: undefined,
      contactInfo: {
        email: input.email,
        matrix: input.matrix,
        nostr: input.nostr,
        website: input.website
      }
    },
    contributions: [],
    earnings: [],
    trustScore: {
      value: input.initialTrustScore || 0.5,
      lastUpdated: { value: Date.now(), timezone: 'UTC' },
      source: 'composite'
    },
    governanceRole: input.initialRole || 'affiliate',
    joinedAt: { value: Date.now(), timezone: 'UTC' },
    projects: []
  };
}

// ============================================
// AFFILIATE ANALYTICS
// ============================================

export interface AffiliateAnalytics {
  totalAffiliates: number;
  byRole: Record<string, number>;
  byProject: Record<string, number>;
  averageTrustScore: number;
  topContributors: Array<{ affiliateId: AffiliateId; contributions: number }>;
  recentJoiners: number; // last 30 days
}

export function analyzeAffiliates(affiliates: Affiliate[]): AffiliateAnalytics {
  const byRole: Record<string, number> = {};
  const byProject: Record<string, number> = {};
  let totalTrust = 0;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let recentJoiners = 0;

  for (const a of affiliates) {
    // By role
    byRole[a.governanceRole] = (byRole[a.governanceRole] || 0) + 1;
    
    // By project
    for (const p of a.projects) {
      byProject[p as string] = (byProject[p as string] || 0) + 1;
    }
    
    // Trust score
    totalTrust += a.trustScore.value;
    
    // Recent joiners
    if (a.joinedAt.value > thirtyDaysAgo) recentJoiners++;
  }

  // Top contributors would need contributions data
  const topContributors = affiliates
    .map(a => ({ affiliateId: a.id, contributions: a.contributions.length }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10);

  return {
    totalAffiliates: affiliates.length,
    byRole,
    byProject,
    averageTrustScore: affiliates.length > 0 ? totalTrust / affiliates.length : 0.5,
    topContributors,
    recentJoiners
  };
}

// ============================================
// AFFILIATE SEARCH & FILTERING
// ============================================

export interface AffiliateFilter {
  role?: GovernanceRole;
  projectId?: string;
  minTrustScore?: number;
  maxTrustScore?: number;
  joinedAfter?: number;
  joinedBefore?: number;
  skills?: string[];
}

export function filterAffiliates(affiliates: Affiliate[], filter: AffiliateFilter): Affiliate[] {
  return affiliates.filter(a => {
    if (filter.role && a.governanceRole !== filter.role) return false;
    if (filter.projectId && !a.projects.includes(filter.projectId as any)) return false;
    if (filter.minTrustScore !== undefined && a.trustScore.value < filter.minTrustScore) return false;
    if (filter.maxTrustScore !== undefined && a.trustScore.value > filter.maxTrustScore) return false;
    if (filter.joinedAfter && a.joinedAt.value < filter.joinedAfter) return false;
    if (filter.joinedBefore && a.joinedAt.value > filter.joinedBefore) return false;
    if (filter.skills && filter.skills.length > 0) {
      const hasSkill = filter.skills.some(s => a.profile.skills.includes(s));
      if (!hasSkill) return false;
    }
    return true;
  });
}

export function sortAffiliates(
  affiliates: Affiliate[], 
  sortBy: 'trustScore' | 'joinedAt' | 'contributions' | 'earnings',
  order: 'asc' | 'desc' = 'desc'
): Affiliate[] {
  return [...affiliates].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'trustScore':
        comparison = a.trustScore.value - b.trustScore.value;
        break;
      case 'joinedAt':
        comparison = a.joinedAt.value - b.joinedAt.value;
        break;
      case 'contributions':
        comparison = a.contributions.length - b.contributions.length;
        break;
      case 'earnings':
        const aEarnings = a.earnings.reduce((sum, e) => sum + e.amount.postmonetario + e.amount.conectado, 0n);
        const bEarnings = b.earnings.reduce((sum, e) => sum + e.amount.postmonetario + e.amount.conectado, 0n);
        comparison = Number(aEarnings - bEarnings);
        break;
    }
    return order === 'desc' ? -comparison : comparison;
  });
}

import { generateId } from '../utils';