// arm-sensorica/src/core/trustLocal.ts - Local Trust System (Place Keeper Based)
import { 
  TrustScore, 
  AffiliateId, 
  SpaceId, 
  PlaceKeeper, 
  EvidenceRef,
  Timestamp,
  Permission,
  AccountabilityConfig
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// TRUST SYSTEM CORE
// ============================================

/**
 * Local Trust System based on Tiberius Brastaviceanu's principle:
 * "Trust emanates locally, in part through the role of place keepers"
 * 
 * Trust is not global/reputation-based but contextual to spaces/projects
 * and mediated by place keepers who have direct observation.
 */

export interface TrustSystem {
  updateTrust(input: TrustUpdateInput): Promise<TrustScore>;
  getTrust(spaceId: SpaceId, affiliateId: AffiliateId): Promise<TrustScore>;
  getTrustHistory(spaceId: SpaceId, affiliateId: AffiliateId): Promise<TrustScore[]>;
  recordObservation(input: ObservationInput): Promise<void>;
  recordPeerReport(input: PeerReportInput): Promise<void>;
  recordCompliance(input: ComplianceInput): Promise<void>;
  getPlaceKeepers(spaceId: SpaceId): Promise<PlaceKeeper[]>;
}

export interface TrustUpdateInput {
  spaceId: SpaceId;
  subject: AffiliateId;
  updatedBy: AffiliateId; // place keeper
  newScore: number;
  reason: string;
  evidence?: EvidenceRef[];
}

export interface ObservationInput {
  spaceId: SpaceId;
  observer: AffiliateId; // place keeper
  subject: AffiliateId;
  score: number; // 0-1
  context: string;
  evidence?: EvidenceRef[];
}

export interface PeerReportInput {
  spaceId: SpaceId;
  reporter: AffiliateId;
  subject: AffiliateId;
  score: number; // 0-1
  category: 'reliability' | 'skill' | 'communication' | 'cooperation' | 'other';
  details: string;
  evidence?: EvidenceRef[];
}

export interface ComplianceInput {
  spaceId: SpaceId;
  subject: AffiliateId;
  compliant: boolean;
  details: string;
  ruleViolated?: string;
  evidence?: EvidenceRef[];
}

export class LocalTrustSystem implements TrustSystem {
  private trustScores: Map<string, TrustScore> = new Map(); // key: `${spaceId}:${affiliateId}`
  private trustHistory: Map<string, TrustScore[]> = new Map(); // key: `${spaceId}:${affiliateId}`
  private observations: Map<string, ObservationRecord[]> = new Map(); // key: `${spaceId}:${observer}`
  private peerReports: Map<string, PeerReportRecord[]> = new Map(); // key: `${spaceId}:${subject}`
  private complianceRecords: Map<string, ComplianceRecord[]> = new Map(); // key: `${spaceId}:${subject}`
  private placeKeepers: Map<string, PlaceKeeper[]> = new Map(); // key: spaceId

  async updateTrust(input: TrustUpdateInput): Promise<TrustScore> {
    // Verify updater is a place keeper
    const pk = await this.verifyPlaceKeeper(input.spaceId, input.updatedBy);
    if (!pk) throw new Error('Only place keepers can update trust scores');
    
    if (!pk.permissions.includes('update-trust')) {
      throw new Error('Place keeper lacks update-trust permission');
    }

    const key = `${input.spaceId}:${input.subject}`;
    const newScore: TrustScore = {
      value: Math.max(0, Math.min(1, input.newScore)),
      lastUpdated: now(),
      source: 'placeKeeper',
      breakdown: {
        directObservation: input.newScore,
        peerReports: 0,
        historicalCompliance: 0
      }
    };

    this.trustScores.set(`${input.spaceId}:${input.subject}`, newScore);
    this.addToHistory(input.spaceId, input.subject, newScore);

    return newScore;
  }

  async getTrust(spaceId: SpaceId, affiliateId: AffiliateId): Promise<TrustScore> {
    const key = `${spaceId}:${affiliateId}`;
    return this.trustScores.get(key) || { 
      value: 0.5, 
      lastUpdated: now(), 
      source: 'composite',
      breakdown: {
        directObservation: 0.5,
        peerReports: 0.5,
        historicalCompliance: 0.5
      }
    };
  }

  async getTrustHistory(spaceId: SpaceId, affiliateId: AffiliateId): Promise<TrustScore[]> {
    return this.trustHistory.get(`${spaceId}:${affiliateId}`) || [];
  }

  async recordObservation(input: ObservationInput): Promise<void> {
    const pk = await this.verifyPlaceKeeper(input.spaceId, input.observer);
    if (!pk) throw new Error('Only place keepers can record observations');
    if (!pk.permissions.includes('update-trust')) {
      throw new Error('Place keeper lacks update-trust permission');
    }

    const record: ObservationRecord = {
      id: generateId('obs'),
      spaceId: input.spaceId,
      observer: input.observer,
      subject: input.subject,
      score: Math.max(0, Math.min(1, input.score)),
      context: input.context,
      evidence: input.evidence || [],
      timestamp: now()
    };

    const key = `${input.spaceId}:${input.observer}`;
    if (!this.observations.has(key)) this.observations.set(key, []);
    this.observations.get(key)!.push(record);

    // Update trust score based on observation
    await this.recalculateTrustFromObservations(input.spaceId, input.subject);
  }

  async recordPeerReport(input: PeerReportInput): Promise<void> {
    const record: PeerReportRecord = {
      id: generateId('peer'),
      spaceId: input.spaceId,
      reporter: input.reporter,
      subject: input.subject,
      score: Math.max(0, Math.min(1, input.score)),
      category: input.category,
      details: input.details,
      evidence: input.evidence || [],
      timestamp: now()
    };

    const key = `${input.spaceId}:${input.subject}`;
    if (!this.peerReports.has(key)) this.peerReports.set(key, []);
    this.peerReports.get(key)!.push(record);

    await this.recalculateTrustFromPeerReports(input.spaceId, input.subject);
  }

  async recordCompliance(input: ComplianceInput): Promise<void> {
    const record: ComplianceRecord = {
      id: generateId('comp'),
      spaceId: input.spaceId,
      subject: input.subject,
      compliant: input.compliant,
      details: input.details,
      ruleViolated: input.ruleViolated,
      evidence: input.evidence || [],
      timestamp: now()
    };

    const key = `${input.spaceId}:${input.subject}`;
    if (!this.complianceRecords.has(key)) this.complianceRecords.set(key, []);
    this.complianceRecords.get(key)!.push(record);

    await this.recalculateTrustFromCompliance(input.spaceId, input.subject);
  }

  async getPlaceKeepers(spaceId: SpaceId): Promise<PlaceKeeper[]> {
    // In real impl, would query from governance system
    return []; // placeholder
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async verifyPlaceKeeper(spaceId: SpaceId, affiliateId: AffiliateId): Promise<PlaceKeeper | null> {
    // In real impl, would check governance system
    // For now, return a mock place keeper
    return {
      affiliateId: '' as any,
      spaceId,
      permissions: ['update-trust', 'grant-access', 'deny-access', 'manage-resources', 'resolve-conflicts', 'amend-rules'],
      accountability: {
        auditTrailRequired: true,
        reviewPeriod: { value: 90 * 24 * 60 * 60 * 1000 },
        escalationPath: []
      },
      observations: new Map()
    };
  }

  private async recalculateTrustFromObservations(spaceId: SpaceId, subject: AffiliateId): Promise<void> {
    const key = `${spaceId}:${subject}`;
    const observations = this.observations.get(`${spaceId}:`)?.filter(o => o.subject === subject) || [];
    
    if (observations.length === 0) return;
    
    // Weight recent observations more heavily
    const now_ts = Date.now();
    const weightedSum = observations.reduce((sum, obs) => {
      const ageHours = (Date.now() - obs.timestamp.value) / (1000 * 60 * 60);
      const weight = Math.exp(-ageHours / (24 * 7)); // Half-life of 1 week
      return sum + obs.score * weight;
    }, 0);
    
    const totalWeight = observations.reduce((sum, obs) => {
      const ageHours = (Date.now() - obs.timestamp.value) / (1000 * 60 * 60);
      return sum + Math.exp(-ageHours / (24 * 7));
    }, 0);

    const directObs = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    
    await this.updateCompositeTrust(spaceId, subject, { directObs });
  }

  private async recalculateTrustFromPeerReports(spaceId: SpaceId, subject: AffiliateId): Promise<void> {
    const reports = this.peerReports.get(`${spaceId}:${subject}`) || [];
    
    if (reports.length === 0) return;
    
    // Weight by recency and category relevance
    const now_ts = Date.now();
    const weightedSum = reports.reduce((sum, r) => {
      const ageHours = (now_ts - r.timestamp.value) / (1000 * 60 * 60);
      const weight = Math.exp(-ageHours / (24 * 30)); // Half-life of 1 month
      return sum + r.score * weight;
    }, 0);
    
    const totalWeight = reports.reduce((sum, r) => {
      const ageHours = (now_ts - r.timestamp.value) / (1000 * 60 * 60);
      return sum + Math.exp(-ageHours / (24 * 30));
    }, 0);

    const peerScore = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    
    await this.updateCompositeTrust(spaceId, reports[0].subject, { peerReports: peerScore });
  }

  private async recalculateTrustFromCompliance(spaceId: SpaceId, subject: AffiliateId): Promise<void> {
    const records = this.complianceRecords.get(`${spaceId}:${subject}`) || [];
    
    if (records.length === 0) return;
    
    // Compliance rate with recency weighting
    const now_ts = Date.now();
    let weightedCompliant = 0;
    let totalWeight = 0;
    
    for (const r of records) {
      const ageHours = (Date.now() - r.timestamp.value) / (1000 * 60 * 60);
      const weight = Math.exp(-ageHours / (24 * 7)); // Half-life 1 week
      if (r.compliant) weightedCompliant += weight;
      totalWeight += weight;
    }
    
    const complianceScore = totalWeight > 0 ? weightedCompliant / totalWeight : 1.0;
    
    await this.updateCompositeTrust(spaceId, subject, { compliance: complianceScore });
  }

  private async updateCompositeTrust(
    spaceId: SpaceId, 
    subject: AffiliateId, 
    partial: Partial<{ directObs: number; peerReports: number; compliance: number }>
  ): Promise<void> {
    const current = await this.getTrust(spaceId, subject);
    
    const breakdown = {
      directObservation: partial.directObs ?? current.breakdown?.directObservation ?? 0.5,
      peerReports: partial.peerReports ?? current.breakdown?.peerReports ?? 0.5,
      historicalCompliance: partial.compliance ?? current.breakdown?.historicalCompliance ?? 0.5
    };

    // Tiberius weights: trust emanates locally
    const weights = {
      directObservation: 0.5,
      peerReports: 0.3,
      historicalCompliance: 0.2
    };

    const compositeScore = 
      breakdown.directObservation * weights.directObservation +
      breakdown.peerReports * weights.peerReports +
      breakdown.historicalCompliance * weights.historicalCompliance;

    const newScore: TrustScore = {
      value: Math.max(0, Math.min(1, compositeScore)),
      lastUpdated: now(),
      source: 'composite',
      breakdown
    };

    const key = `${subject}:${subject}`; // placeholder
    this.trustScores.set(key, newScore);
    this.addToHistory(spaceId, subject, newScore);
  }

  private addToHistory(spaceId: SpaceId, subject: AffiliateId, score: TrustScore): void {
    const key = `${spaceId}:${subject}`;
    if (!this.trustHistory.has(key)) this.trustHistory.set(key, []);
    this.trustHistory.get(key)!.push(score);
    
    // Keep last 100 entries
    const history = this.trustHistory.get(key)!;
    if (history.length > 100) history.shift();
  }

  // Placeholder for real implementation
  async getTrust(spaceId: string, affiliateId: string) {
    return {
      value: 0.5,
      lastUpdated: { value: Date.now(), timezone: 'UTC' },
      source: 'composite',
      breakdown: {
        directObservation: 0.5,
        peerReports: 0.5,
        historicalCompliance: 0.5
      }
    };
  }
}