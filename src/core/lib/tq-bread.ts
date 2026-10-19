// src/core/lib/tq-bread.ts
// Bread Verification + Peer Endorsement Engine
// Implements: Peer verification, Reputation scoring, Endorsement networks, Quorum management

import type { TQTransaction } from './tq';
import type { DisCO_CAT_Engine, PeerEndorsement, DisCOContribution } from './tq-disco-cat';
import type { VirginiaVestingGateway, PeerVerification, ClaimResult } from './tq-types-extended';

// ============================================================================
// BREAD TYPES
// ============================================================================

export interface BreadEndorsement {
  id: string;
  endorserDid: string;
  endorseeDid: string;
  type: 'skill' | 'contribution' | 'trust' | 'governance' | 'care' | 'technical';
  weight: number; // 0-1, based on endorser's CDS score
  evidence: BreadEvidence[];
  status: 'pending' | 'confirmed' | 'disputed' | 'revoked';
  timestamp: number;
  raoCredentialId: string;
}

export interface BreadEvidence {
  type: 'observation' | 'delivery' | 'review' | 'measurement' | 'testimony';
  description: string;
  uri?: string; // IPFS/Arweave link
  hash?: string;
  verified: boolean;
}

export interface BreadProfile {
  did: string;
  displayName: string;
  cdsScore: number; // 0-1+ (Cohesion/Trust score)
  endorsementsReceived: BreadEndorsement[];
  endorsementsGiven: BreadEndorsement[];
  skills: BreadSkill[];
  governanceHistory: BreadGovernanceEvent[];
  contributionHistory: BreadContribution[];
  reputation: number; // composite 0-1
  lastActive: number;
}

export interface BreadSkill {
  id: string;
  name: string;
  category: 'technical' | 'governance' | 'care' | 'ecological' | 'economic' | 'social';
  level: number; // 1-5
  endorsedBy: string[]; // DIDs
  verified: boolean;
  lastUpdated: number;
}

export interface BreadGovernanceEvent {
  id: string;
  type: 'proposal' | 'vote' | 'consent' | 'block' | 'integration';
  proposalId: string;
  choice?: 'consent' | 'concern' | 'block';
  weight: number;
  timestamp: number;
  outcome?: 'passed' | 'failed' | 'blocked';
}

export interface BreadContribution {
  id: string;
  flowType: 'livelihood' | 'love' | 'care';
  value: number; // ZNU/TQ
  description: string;
  verified: boolean;
  verifiers: string[]; // DIDs
  timestamp: number;
  raoCredentialId: string;
}

export interface BreadQuorumConfig {
  minVerifiers: number; // minimum 3 for Virginia N3
  cdsThreshold: number; // minimum CDS score to verify
  diversityRequired: boolean; // require verifiers from different domains
  maxVerifiersPerDomain: number;
  timeWindow: number; // ms
}

export interface BreadVerificationRequest {
  id: string;
  requesterDid: string;
  targetDid: string;
  type: 'vesting-claim' | 'contribution' | 'skill' | 'governance-participation' | 'n3-weight';
  data: Record<string, any>;
  status: 'open' | 'in-progress' | 'completed' | 'rejected' | 'expired';
  verifiers: string[];
  endorsements: BreadEndorsement[];
  requiredWeight: number;
  currentWeight: number;
  createdAt: number;
  expiresAt: number;
  result?: BreadVerificationResult;
}

export interface BreadVerificationResult {
  passed: boolean;
  finalWeight: number;
  endorsements: BreadEndorsement[];
  notes: string;
  completedAt: number;
}

// ============================================================================
// BREAD ENGINE
// ============================================================================

export class BreadEngine {
  private profiles: Map<string, BreadProfile> = new Map();
  private endorsements: Map<string, BreadEndorsement> = new Map(); // key: endorsementId
  private verificationRequests: Map<string, BreadVerificationRequest> = new Map();
  private quorumConfig: BreadQuorumConfig = {
    minVerifiers: 3,
    cdsThreshold: 0.5,
    diversityRequired: true,
    maxVerifiersPerDomain: 2,
    timeWindow: 86400000 * 7, // 7 days
  };

  constructor(
    private discoEngine?: DisCO_CAT_Engine,
    private virginiaGateway?: VirginiaVestingGateway
  ) {}

  // ---------------------------------------------------------------------------
  // PROFILE MANAGEMENT
  // ---------------------------------------------------------------------------

  createProfile(did: string, displayName: string, initialCdsScore: number = 0): BreadProfile {
    const profile: BreadProfile = {
      did,
      displayName,
      cdsScore: Math.max(0, Math.min(2, initialCdsScore)), // allow >1 for exceptional
      endorsementsReceived: [],
      endorsementsGiven: [],
      skills: [],
      governanceHistory: [],
      contributionHistory: [],
      reputation: 0,
      lastActive: Date.now(),
    };
    this.profiles.set(did, profile);
    return profile;
  }

  getProfile(did: string): BreadProfile | undefined {
    return this.profiles.get(did);
  }

  updateProfile(did: string, updates: Partial<BreadProfile>): boolean {
    const profile = this.profiles.get(did);
    if (!profile) return false;
    this.profiles.set(did, { ...profile, ...updates, lastActive: Date.now() });
    return true;
  }

  updateCDSScore(did: string, score: number): void {
    const profile = this.profiles.get(did);
    if (profile) {
      profile.cdsScore = Math.max(0, Math.min(2, score));
      this.recalculateReputation(did);
    }
  }

  // ---------------------------------------------------------------------------
  // REPUTATION CALCULATION
  // ---------------------------------------------------------------------------

  private recalculateReputation(did: string): number {
    const profile = this.profiles.get(did);
    if (!profile) return 0;

    // Reputation = weighted combination of:
    // - CDS score (30%)
    // - Endorsements received weight (25%)
    // - Governance participation (20%)
    // - Contribution value (15%)
    // - Skills verified (10%)

    const cdsComponent = Math.min(1, profile.cdsScore) * 0.3;

    const endorsementWeight = profile.endorsementsReceived.reduce((sum, e) => sum + e.weight, 0);
    const maxPossibleEndorsements = 20; // soft cap
    const endorsementComponent = Math.min(1, endorsementWeight / maxPossibleEndorsements) * 0.25;

    const governanceEvents = profile.governanceHistory.length;
    const governanceComponent = Math.min(1, governanceEvents / 50) * 0.2;

    const totalContribution = profile.contributionHistory.reduce((sum, c) => sum + c.value, 0);
    const contributionComponent = Math.min(1, totalContribution / 10000) * 0.15; // 10k ZNU = max

    const verifiedSkills = profile.skills.filter(s => s.verified).length;
    const skillsComponent = Math.min(1, verifiedSkills / 10) * 0.1;

    const reputation = cdsComponent + endorsementComponent + governanceComponent + contributionComponent + skillsComponent;
    profile.reputation = Math.max(0, Math.min(1, reputation));

    return profile.reputation;
  }

  getReputation(did: string): number {
    const profile = this.profiles.get(did);
    return profile ? profile.reputation : 0;
  }

  // ---------------------------------------------------------------------------
  // ENDORSEMENT SYSTEM
  // ---------------------------------------------------------------------------

  createEndorsement(endorsement: Omit<BreadEndorsement, 'id' | 'status' | 'timestamp'> & { id?: string }): BreadEndorsement {
    const endorser = this.profiles.get(endorsement.endorserDid);
    if (!endorser) throw new Error('Endorser not found');

    const endorsee = this.profiles.get(endorsement.endorseeDid);
    if (!endorsee) throw new Error('Endorsee not found');

    // Weight = endorser's CDS score × endorsement type multiplier
    const typeMultipliers: Record<BreadEndorsement['type'], number> = {
      skill: 1.0,
      contribution: 1.2,
      trust: 1.5,
      governance: 1.0,
      care: 1.3,
      technical: 1.1,
    };

    const weight = Math.min(1, endorser.cdsScore * (typeMultipliers[endorsement.type] || 1.0));

    const newEndorsement: BreadEndorsement = {
      ...endorsement,
      id: endorsement.id || `end_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      weight,
      status: 'pending',
      timestamp: Date.now(),
    };

    this.endorsements.set(newEndorsement.id, newEndorsement);
    endorser.endorsementsGiven.push(newEndorsement);
    endorsee.endorsementsReceived.push(newEndorsement);

    // Auto-confirm if endorser has high reputation
    if (endorser.reputation > 0.8) {
      this.confirmEndorsement(newEndorsement.id);
    }

    this.recalculateReputation(endorsement.endorseeDid);
    return newEndorsement;
  }

  confirmEndorsement(endorsementId: string): boolean {
    const endorsement = this.endorsements.get(endorsementId);
    if (!endorsement || endorsement.status !== 'pending') return false;

    endorsement.status = 'confirmed';
    return true;
  }

  disputeEndorsement(endorsementId: string, disputerDid: string, reason: string): boolean {
    const endorsement = this.endorsements.get(endorsementId);
    if (!endorsement || endorsement.status !== 'confirmed') return false;

    const disputer = this.profiles.get(disputerDid);
    if (!disputer || disputer.cdsScore < 0.7) return false; // Only high-CDS can dispute

    endorsement.status = 'disputed';
    endorsement.evidence.push({
      type: 'testimony',
      description: `Disputed by ${disputerDid}: ${reason}`,
      verified: false,
    });

    return true;
  }

  revokeEndorsement(endorsementId: string, revokerDid: string): boolean {
    const endorsement = this.endorsements.get(endorsementId);
    if (!endorsement) return false;

    // Only endorser or endorsee can revoke
    if (endorsement.endorserDid !== revokerDid && endorsement.endorseeDid !== revokerDid) {
      return false;
    }

    endorsement.status = 'revoked';
    this.recalculateReputation(endorsement.endorseeDid);
    return true;
  }

  getEndorsementsFor(did: string): BreadEndorsement[] {
    return Array.from(this.endorsements.values()).filter(e => e.endorseeDid === did && e.status === 'confirmed');
  }

  getEndorsementsBy(did: string): BreadEndorsement[] {
    return Array.from(this.endorsements.values()).filter(e => e.endorserDid === did);
  }

  // ---------------------------------------------------------------------------
  // SKILL MANAGEMENT
  // ---------------------------------------------------------------------------

  addSkill(did: string, skill: Omit<BreadSkill, 'endorsedBy' | 'verified' | 'lastUpdated'> & { endorsedBy?: string[] }): BreadSkill | null {
    const profile = this.profiles.get(did);
    if (!profile) return null;

    const newSkill: BreadSkill = {
      ...skill,
      endorsedBy: skill.endorsedBy || [],
      verified: false,
      lastUpdated: Date.now(),
    };

    profile.skills.push(newSkill);
    this.recalculateReputation(did);
    return newSkill;
  }

  endorseSkill(did: string, skillId: string, endorserDid: string): boolean {
    const profile = this.profiles.get(did);
    const endorser = this.profiles.get(endorserDid);
    if (!profile || !endorser) return false;

    const skill = profile.skills.find(s => s.id === skillId);
    if (!skill) return false;

    if (!skill.endorsedBy.includes(endorserDid)) {
      skill.endorsedBy.push(endorserDid);
    }

    // Auto-verify if enough high-CDS endorsers
    const endorserScores = skill.endorsedBy.map(eDid => this.profiles.get(eDid)?.cdsScore || 0);
    const avgEndorserScore = endorserScores.length > 0 ? endorserScores.reduce((a, b) => a + b, 0) / endorserScores.length : 0;

    if (avgEndorserScore >= this.quorumConfig.cdsThreshold && skill.endorsedBy.length >= 3) {
      skill.verified = true;
    }

    skill.lastUpdated = Date.now();
    this.recalculateReputation(did);
    return true;
  }

  // ---------------------------------------------------------------------------
  // GOVERNANCE HISTORY
  // ---------------------------------------------------------------------------

  recordGovernanceEvent(event: Omit<BreadGovernanceEvent, 'id'>): void {
    const profile = this.profiles.get(event.type === 'vote' || event.type === 'consent' || event.type === 'block' ? 'voter' : 'proposer');
    // Simplified - in practice would match by proposalId
    // This is a placeholder for the actual implementation
  }

  // ---------------------------------------------------------------------------
  // CONTRIBUTION TRACKING (sync with DisCO)
  // ---------------------------------------------------------------------------

  syncContribution(contribution: DisCOContribution): void {
    const profile = this.profiles.get(contribution.memberId);
    if (!profile) return;

    const breadContribution: BreadContribution = {
      id: contribution.id,
      flowType: contribution.flowType,
      value: contribution.value,
      description: contribution.description,
      verified: contribution.verified,
      verifiers: [], // Would be populated from DisCO CAT
      timestamp: contribution.timestamp,
      raoCredentialId: contribution.raoCredentialId,
    };

    profile.contributionHistory.push(breadContribution);
    this.recalculateReputation(contribution.memberId);
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION REQUESTS (Quorum-based)
  // ---------------------------------------------------------------------------

  createVerificationRequest(request: Omit<BreadVerificationRequest, 'id' | 'status' | 'verifiers' | 'endorsements' | 'currentWeight' | 'createdAt' | 'expiresAt' | 'result'> & { id?: string }): BreadVerificationRequest {
    const target = this.profiles.get(request.targetDid);
    if (!target) throw new Error('Target not found');

    const newRequest: BreadVerificationRequest = {
      ...request,
      id: request.id || `ver_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'open',
      verifiers: [],
      endorsements: [],
      currentWeight: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.quorumConfig.timeWindow,
    };

    // Auto-select eligible verifiers
    newRequest.verifiers = this.selectVerifiers(target.did, newRequest.type);

    this.verificationRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  private selectVerifiers(targetDid: string, type: BreadVerificationRequest['type']): string[] {
    const profiles = Array.from(this.profiles.values());
    const targetProfile = this.profiles.get(targetDid);
    
    // Filter eligible verifiers
    let eligible = profiles.filter(p => 
      p.did !== targetDid &&
      p.cdsScore >= this.quorumConfig.cdsThreshold &&
      p.reputation >= 0.4 &&
      Date.now() - p.lastActive < 86400000 * 30 // active in last 30 days
    );

    // Diversity: prefer different domains (simplified - would check N2 domain)
    if (this.quorumConfig.diversityRequired && targetProfile) {
      // In practice, would check Virginia N2 domain mapping
      // For now, just shuffle
      eligible = eligible.sort(() => Math.random() - 0.5);
    }

    // Limit per domain (simplified)
    const selected = eligible.slice(0, this.quorumConfig.minVerifiers * 2); // 2x pool

    return selected.map(p => p.did);
  }

  submitEndorsementForVerification(requestId: string, endorsement: BreadEndorsement): boolean {
    const request = this.verificationRequests.get(requestId);
    if (!request || request.status !== 'open' && request.status !== 'in-progress') return false;
    if (Date.now() > request.expiresAt) {
      request.status = 'expired';
      return false;
    }

    // Check if endorser is in verifiers list
    if (!request.verifiers.includes(endorsement.endorserDid)) return false;

    // Check if already endorsed
    if (request.endorsements.some(e => e.endorserDid === endorsement.endorserDid)) return false;

    request.endorsements.push(endorsement);
    request.currentWeight += endorsement.weight;

    if (request.status === 'open') request.status = 'in-progress';

    // Check if threshold met
    if (request.currentWeight >= request.requiredWeight && request.endorsements.length >= this.quorumConfig.minVerifiers) {
      this.completeVerification(requestId);
    }

    return true;
  }

  private completeVerification(requestId: string): void {
    const request = this.verificationRequests.get(requestId);
    if (!request) return;

    request.status = 'completed';
    request.result = {
      passed: request.currentWeight >= request.requiredWeight,
      finalWeight: request.currentWeight,
      endorsements: request.endorsements,
      notes: `${request.endorsements.length} verifiers, weight ${request.currentWeight.toFixed(2)}/${request.requiredWeight}`,
      completedAt: Date.now(),
    };

    // Apply result based on type
    this.applyVerificationResult(request);
  }

  private applyVerificationResult(request: BreadVerificationRequest): void {
    const target = this.profiles.get(request.targetDid);
    if (!target) return;

    switch (request.type) {
      case 'vesting-claim':
        // Would trigger Virginia vesting claim
        break;
      case 'contribution':
        // Mark contribution as verified
        break;
      case 'skill':
        // Verify skill
        const skillId = request.data.skillId;
        const skill = target.skills.find(s => s.id === skillId);
        if (skill) skill.verified = true;
        break;
      case 'governance-participation':
        // Record governance weight
        break;
      case 'n3-weight':
        // Update N3 weight
        break;
    }

    this.recalculateReputation(request.targetDid);
  }

  getVerificationRequest(id: string): BreadVerificationRequest | undefined {
    return this.verificationRequests.get(id);
  }

  getPendingVerificationsFor(did: string): BreadVerificationRequest[] {
    return Array.from(this.verificationRequests.values()).filter(
      r => r.verifiers.includes(did) && r.status === 'in-progress'
    );
  }

  // ---------------------------------------------------------------------------
  // VIRGINIA N3 VESTING INTEGRATION
  // ---------------------------------------------------------------------------

  async verifyVestingClaim(n3NodeId: string): Promise<{ eligible: boolean; peerVerification: PeerVerification; weight: number }> {
    // Get N2 verifiers for this N3
    const verifiers = this.selectVerifiers(n3NodeId, 'vesting-claim');
    
    // Create verification request
    const request = this.createVerificationRequest({
      requesterDid: n3NodeId,
      targetDid: n3NodeId,
      type: 'vesting-claim',
      data: { n3NodeId },
      requiredWeight: 2.0, // Need 2.0 weight (e.g., 3 verifiers at 0.7 CDS each)
    });

    // Simulate verifier responses (in production, async)
    let totalWeight = 0;
    const endorsements: BreadEndorsement[] = [];

    for (const verifierDid of verifiers.slice(0, this.quorumConfig.minVerifiers)) {
      const verifier = this.profiles.get(verifierDid);
      if (!verifier) continue;

      const endorsement = this.createEndorsement({
        endorserDid: verifierDid,
        endorseeDid: n3NodeId,
        type: 'contribution',
        weight: verifier.cdsScore,
        evidence: [{ type: 'observation', description: 'Verified AUT milestones and TQ production', verified: true }],
        raoCredentialId: `rao_${Date.now()}`,
      });

      this.submitEndorsementForVerification(request.id, endorsement);
      totalWeight += endorsement.weight;
      endorsements.push(endorsement);
    }

    const passed = totalWeight >= request.requiredWeight && endorsements.length >= this.quorumConfig.minVerifiers;

    // Build PeerVerification for Virginia
    const peerVerification: PeerVerification = {
      votingN2Nodes: endorsements.map(e => e.endorserDid),
      positiveVotes: endorsements.length,
      totalVotes: endorsements.length,
      consensusWeight: totalWeight / Math.max(1, endorsements.length),
      quorumMet: endorsements.length >= this.quorumConfig.minVerifiers,
    };

    return {
      eligible: passed,
      peerVerification,
      weight: totalWeight,
    };
  }

  // ---------------------------------------------------------------------------
  // QUORUM CONFIGURATION
  // ---------------------------------------------------------------------------

  updateQuorumConfig(config: Partial<BreadQuorumConfig>): void {
    this.quorumConfig = { ...this.quorumConfig, ...config };
  }

  getQuorumConfig(): BreadQuorumConfig {
    return { ...this.quorumConfig };
  }

  // ---------------------------------------------------------------------------
  // NETWORK ANALYSIS
  // ---------------------------------------------------------------------------

  getEndorsementNetwork(): {
    nodes: Array<{ did: string; reputation: number; cdsScore: number }>;
    edges: Array<{ from: string; to: string; weight: number; type: string }>;
  } {
    const nodes = Array.from(this.profiles.values()).map(p => ({
      did: p.did,
      reputation: p.reputation,
      cdsScore: p.cdsScore,
    }));

    const edges: Array<{ from: string; to: string; weight: number; type: string }> = [];
    for (const endorsement of this.endorsements.values()) {
      if (endorsement.status === 'confirmed') {
        edges.push({
          from: endorsement.endorserDid,
          to: endorsement.endorseeDid,
          weight: endorsement.weight,
          type: endorsement.type,
        });
      }
    }

    return { nodes, edges };
  }

  calculateCentrality(did: string): { inDegree: number; outDegree: number; pageRank: number } {
    const network = this.getEndorsementNetwork();
    
    const inDegree = network.edges.filter(e => e.to === did).length;
    const outDegree = network.edges.filter(e => e.from === did).length;

    // Simplified PageRank (would use proper algorithm in production)
    const pageRank = network.edges
      .filter(e => e.to === did)
      .reduce((sum, e) => sum + e.weight * (this.profiles.get(e.from)?.reputation || 0), 0);

    return { inDegree, outDegree, pageRank };
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  exportData(): {
    profiles: BreadProfile[];
    endorsements: BreadEndorsement[];
    verificationRequests: BreadVerificationRequest[];
    quorumConfig: BreadQuorumConfig;
  } {
    return {
      profiles: Array.from(this.profiles.values()),
      endorsements: Array.from(this.endorsements.values()),
      verificationRequests: Array.from(this.verificationRequests.values()),
      quorumConfig: this.quorumConfig,
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createBreadEngine(discoEngine?: DisCO_CAT_Engine, virginiaGateway?: VirginiaVestingGateway): BreadEngine {
  return new BreadEngine(discoEngine, virginiaGateway);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const breadEngine = new BreadEngine();
export default breadEngine;