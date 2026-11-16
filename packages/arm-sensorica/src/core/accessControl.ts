// arm-sensorica/src/core/accessControl.ts - Access Control & Property Regimes
import { 
  PropertyRegime, 
  PropertyRegimeType,
  AccessRule,
  AccessCondition,
  TimeRestriction,
  CommonsRules,
  PlaceKeeper,
  Permission,
  AccountabilityConfig,
  AccessContext,
  TrustScore,
  AffiliateId,
  SpaceId,
  EvidenceRef,
  Affiliate,
  ResourcePool,
  PropertyRegime as PropertyRegimeTypeDef,
  GovernanceRole
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// ACCESS CONTROL SERVICE
// ============================================

export interface AccessControlService {
  checkAccess(context: AccessContext): Promise<AccessDecision>;
  grantAccess(placeKeeperId: AffiliateId, affiliateId: AffiliateId, spaceId: SpaceId, duration: number): Promise<AccessGrant>;
  denyAccess(placeKeeperId: AffiliateId, affiliateId: AffiliateId, spaceId: SpaceId, reason: string): Promise<AccessDenial>;
  updateTrust(placeKeeperId: AffiliateId, affiliateId: AffiliateId, score: number, reason: string): Promise<TrustScore>;
  getPlaceKeepers(spaceId: SpaceId): Promise<PlaceKeeper[]>;
}

export interface AccessDecision {
  granted: boolean;
  reason: string;
  conditions?: AccessCondition[];
  expiresAt?: Date;
  requiredApprovals?: string[];
}

export interface AccessGrant {
  id: string;
  affiliateId: string;
  spaceId: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt: Date;
  conditions: AccessCondition[];
}

export interface AccessDenial {
  id: string;
  affiliateId: string;
  spaceId: string;
  deniedBy: string;
  deniedAt: Date;
  reason: string;
}

export class AccessControlServiceImpl implements AccessControlService {
  constructor(
    private placeKeepers: Map<SpaceId, PlaceKeeper[]>,
    private trustScores: Map<string, TrustScore>,
    private resourcePools: Map<string, ResourcePool>
  ) {}

  async checkAccess(context: AccessContext): Promise<AccessDecision> {
    const pool = this.resourcePools.get(context.spaceId as string);
    if (!pool) {
      return { granted: false, reason: 'Space not found' };
    }

    // Check property regime
    const regime = pool.propertyRegime;
    const decision = await this.evaluateByRegime(regime, context);
    
    // Apply place keeper local trust
    const trustScore = await this.getLocalTrust(context.spaceId, context.affiliateId);
    if (trustScore.value < 0.3) {
      return { granted: false, reason: 'Insufficient trust score', conditions: [{ type: 'trust-score', parameters: { min: 0.3 } }] };
    }

    return decision;
  }

  private async evaluateByRegime(regime: PropertyRegime, context: AccessContext): Promise<AccessDecision> {
    switch (regime.type) {
      case 'private':
        return this.evaluatePrivate(regime, context);
      case 'public':
        return this.evaluatePublic(regime, context);
      case 'commons':
        return this.evaluateCommons(regime, context);
      case 'non-dominium':
        return this.evaluateNonDominium(regime, context);
    }
  }

  private async evaluatePrivate(regime: PropertyRegime, context: AccessContext): Promise<AccessDecision> {
    // Private: owner or explicitly granted
    // In real impl, would check ownership/grants
    return { granted: true, reason: 'Private regime - access granted' };
  }

  private async evaluatePublic(regime: PropertyRegime, context: AccessContext): Promise<AccessDecision> {
    // Public: generally open, subject to public rules
    return { granted: true, reason: 'Public regime - open access' };
  }

  private async evaluateCommons(regime: PropertyRegime, context: AccessContext): Promise<AccessDecision> {
    if (!regime.commonsRules) {
      return { granted: false, reason: 'Commons rules not defined' };
    }

    const { accessPolicy } = regime.commonsRules;
    
    switch (accessPolicy) {
      case 'open':
        return { granted: true, reason: 'Commons open access' };
      case 'member-only':
        // Would check if affiliate is member
        return { granted: true, reason: 'Commons member access' };
      case 'steward-approval':
        return { 
          granted: false, 
          reason: 'Requires steward approval',
          requiredApprovals: regime.stewards?.map(s => s as string) || []
        };
    }
  }

  private async evaluateNonDominium(regime: PropertyRegime, context: AccessContext): Promise<AccessDecision> {
    // Non-dominium: community governed
    if (!regime.community?.includes(context.affiliateId)) {
      return { granted: false, reason: 'Not a community member' };
    }
    return { granted: true, reason: 'Non-dominium community access' };
  }

  async grantAccess(placeKeeperId: AffiliateId, affiliateId: AffiliateId, spaceId: SpaceId, duration: number): Promise<AccessGrant> {
    const grant: AccessGrant = {
      id: generateId('grant'),
      affiliateId: affiliateId as string,
      spaceId: spaceId as string,
      grantedBy: placeKeeperId as string,
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + duration),
      conditions: []
    };
    return grant;
  }

  async denyAccess(placeKeeperId: AffiliateId, affiliateId: AffiliateId, spaceId: SpaceId, reason: string): Promise<AccessDenial> {
    const denial: AccessDenial = {
      id: generateId('deny'),
      affiliateId: affiliateId as string,
      spaceId: spaceId as string,
      deniedBy: placeKeeperId as string,
      deniedAt: new Date(),
      reason
    };
    return denial;
  }

  async updateTrust(placeKeeperId: AffiliateId, affiliateId: AffiliateId, score: number, reason: string): Promise<TrustScore> {
    // Verify place keeper authorization
    const pk = await this.verifyPlaceKeeper(placeKeeperId);
    if (!pk) throw new Error('Not authorized as place keeper');

    const newScore: TrustScore = {
      value: Math.max(0, Math.min(1, score)),
      lastUpdated: { value: Date.now(), timezone: 'UTC' },
      source: 'placeKeeper',
      breakdown: {
        directObservation: score,
        peerReports: 0,
        historicalCompliance: 0
      }
    };

    // In real impl, would persist
    return newScore;
  }

  async getPlaceKeepers(spaceId: SpaceId): Promise<PlaceKeeper[]> {
    return this.placeKeepers.get(spaceId) || [];
  }

  private async getLocalTrust(spaceId: SpaceId, affiliateId: AffiliateId): Promise<TrustScore> {
    const key = `${spaceId}:${affiliateId}`;
    return this.trustScores.get(key) || { value: 0.5, lastUpdated: { value: Date.now(), timezone: 'UTC' }, source: 'composite' };
  }

  private async verifyPlaceKeeper(affiliateId: AffiliateId): Promise<PlaceKeeper | null> {
    // Would check if affiliate is a place keeper in any space
    for (const pks of this.placeKeepers.values()) {
      const pk = pks.find(p => p.affiliateId === affiliateId);
      if (pk) return pk;
    }
    return null;
  }
}

// ============================================
// TRUST CALCULATION (Local - Tiberius Principle)
// ============================================

export interface TrustCalculationInput {
  placeKeeper: PlaceKeeper;
  subject: AffiliateId;
  context: AccessContext;
}

export function calculateLocalTrust(input: TrustCalculationInput): TrustScore {
  const { placeKeeper, subject, context } = input;
  
  // Direct observation by place keeper (highest weight)
  const directObs = placeKeeper.observations.get(subject) ?? 0;
  
  // Peer reports from same space
  const peerReports = getPeerReports(placeKeeper.spaceId, subject);
  
  // Historical access compliance
  const compliance = getAccessCompliance(placeKeeper.spaceId, subject);
  
  // Weighted combination (Tiberius: trust emanates locally)
  const weights = {
    directObservation: 0.5,
    peerReports: 0.3,
    historicalCompliance: 0.2
  };

  const compositeScore = 
    directObs * weights.directObservation +
    peerReports * weights.peerReports +
    compliance * weights.historicalCompliance;

  return {
    value: Math.max(0, Math.min(1, compositeScore)),
    lastUpdated: { value: Date.now(), timezone: 'UTC' },
    source: 'composite',
    breakdown: {
      directObservation,
      peerReports,
      historicalCompliance: compliance
    }
  };
}

function getPeerReports(spaceId: SpaceId, subject: string): number {
  // Would aggregate reports from other affiliates in same space
  return 0.5; // placeholder
}

function getAccessCompliance(spaceId: SpaceId, subject: string): number {
  // Would check historical access compliance
  return 0.7; // placeholder
}

// ============================================
// PLACE KEEPER MANAGEMENT
// ============================================

export interface PlaceKeeperManager {
  appointPlaceKeeper(spaceId: SpaceId, affiliateId: string, permissions: Permission[]): Promise<PlaceKeeper>;
  revokePlaceKeeper(spaceId: SpaceId, affiliateId: string): Promise<void>;
  getPlaceKeepers(spaceId: string): Promise<PlaceKeeper[]>;
  updatePermissions(spaceId: SpaceId, affiliateId: string, permissions: Permission[]): Promise<PlaceKeeper>;
}

export class PlaceKeeperManagerImpl implements PlaceKeeperManager {
  private placeKeepers: Map<string, PlaceKeeper[]> = new Map();

  async appointPlaceKeeper(spaceId: string, affiliateId: string, permissions: Permission[]): Promise<PlaceKeeper> {
    const spaceKeepers = this.placeKeepers.get(spaceId) || [];
    const pk: PlaceKeeper = {
      affiliateId: affiliateId as any,
      spaceId: spaceId as any,
      permissions,
      accountability: {
        auditTrailRequired: true,
        reviewPeriod: { value: 90 * 24 * 60 * 60 * 1000 }, // 90 days
        escalationPath: []
      },
      observations: new Map()
    };
    
    const existing = this.placeKeepers.get(spaceId) || [];
    this.placeKeepers.set(spaceId, [...existing, pk]);
    return pk;
  }

  async revokePlaceKeeper(spaceId: string, affiliateId: string): Promise<void> {
    const pks = this.placeKeepers.get(spaceId) || [];
    this.placeKeepers.set(spaceId, pks.filter(p => p.affiliateId !== affiliateId));
  }

  async getPlaceKeepers(spaceId: string): Promise<PlaceKeeper[]> {
    return this.placeKeepers.get(spaceId) || [];
  }

  async updatePermissions(spaceId: string, affiliateId: string, permissions: Permission[]): Promise<PlaceKeeper> {
    const pks = this.placeKeepers.get(spaceId) || [];
    const idx = pks.findIndex(p => p.affiliateId === affiliateId);
    if (idx === -1) throw new Error('Place keeper not found');
    
    pks[idx] = { ...pks[idx], permissions };
    this.placeKeepers.set(spaceId, pks);
    return pks[idx];
  }
}

// ============================================
// ACCESS CONDITION EVALUATION
// ============================================

export function evaluateAccessCondition(
  condition: any, // AccessCondition
  context: any // AccessContext
): boolean {
  switch (condition.type) {
    case 'trust-score':
      // Would check trust score
      return true;
    case 'skill':
      // Would check affiliate skills
      return true;
    case 'certification':
      // Would check certifications
      return true;
    case 'project-membership':
      // Would check project membership
      return true;
    case 'custom':
      // Custom evaluation
      return true;
    default:
      return false;
  }
}

import { generateId } from '../utils';