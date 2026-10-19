// src/core/lib/tq-berry-vesting.ts
// Berry Vesting Schedule: ZNU Gradual Release, AUT Milestones, Peer Verification
// Implements: 7-tranche schedule, 7 AUT milestones, Bread peer verification, N3 weight integration

import type {
  TQTransaction,
} from './tq';

import type {
  VestingState,
  VestingTranche,
  AUTMilestone,
  PeerVerification,
  ClaimResult,
  N3DynamicWeight,
  VirginiaVestingGateway,
} from './tq-types-extended';

import { DisCO_CAT_Engine } from './tq-disco-cat';
import { BreadEngine } from './tq-bread';
import { ValueFlowsEngine } from './tq-valueflows';
import { VirginiaGateway } from './tq-virginia';
import { ColonyEngine } from './tq-colony';

// ============================================================================
// BERRY VESTING ENGINE
// ============================================================================

export class BerryVestingEngine implements VirginiaVestingGateway {
  public n3NodeId: string;
  public vestingState: VestingState;
  public vestingSchedule: VestingTranche[];
  public claimedZNU: number;
  public autMilestones: AUTMilestone[];
  public peerVerification: PeerVerification;
  public urbanikaFactor: { cds: number; aut: number; composite: number };

  // Integrated engines
  private discoEngine: DisCO_CAT_Engine;
  private breadEngine: BreadEngine;
  private valueFlowsEngine: ValueFlowsEngine;
  private virginiaGateway: VirginiaGateway;
  private colonyEngine: ColonyEngine;

  // Configuration
  private config: {
    totalZNU: number;
    trancheCount: number;
    trancheDelaysMonths: number[];
    tranchePercentages: number[];
    requiredMilestonesPerTranche: number[];
    beneficiarySetDeadlineDays: number;
    claimWindowDays: number;
  };

  constructor(
    n3NodeId: string,
    config: Partial<{
      totalZNU: number;
      trancheCount: number;
      trancheDelaysMonths: number[];
      tranchePercentages: number[];
      requiredMilestonesPerTranche: number[];
      beneficiarySetDeadlineDays: number;
      claimWindowDays: number;
    }> = {},
    engines: {
      disco: DisCO_CAT_Engine;
      bread: BreadEngine;
      valueFlows: ValueFlowsEngine;
      virginia: VirginiaGateway;
      colony: ColonyEngine;
    }
  ) {
    this.n3NodeId = n3NodeId;
    this.discoEngine = engines.disco;
    this.breadEngine = engines.bread;
    this.valueFlowsEngine = engines.valueFlows;
    this.virginiaGateway = engines.virginia;
    this.colonyEngine = engines.colony;

    this.config = {
      totalZNU: config.totalZNU || 100000,
      trancheCount: config.trancheCount || 7,
      trancheDelaysMonths: config.trancheDelaysMonths || [6, 12, 18, 24, 30, 36, 42],
      tranchePercentages: config.tranchePercentages || [0.10, 0.15, 0.15, 0.20, 0.15, 0.15, 0.10],
      requiredMilestonesPerTranche: config.requiredMilestonesPerTranche || [1, 2, 3, 4, 5, 6, 7],
      beneficiarySetDeadlineDays: config.beneficiarySetDeadlineDays || 30,
      claimWindowDays: config.claimWindowDays || 90,
    };

    // Initialize state
    this.vestingState = {
      schedule: [],
      beneficiary: null,
      claimed: 0,
      beneficiarySetDeadline: Date.now() + this.config.beneficiarySetDeadlineDays * 86400000,
      ownerRenounced: false,
    };
    this.vestingSchedule = [];
    this.claimedZNU = 0;
    this.autMilestones = [];
    this.peerVerification = {
      votingN2Nodes: [],
      positiveVotes: 0,
      totalVotes: 0,
      consensusWeight: 0,
      quorumMet: false,
    };
    this.urbanikaFactor = { cds: 0, aut: 0, composite: 0 };

    // Initialize vesting schedule
    this.initializeVestingSchedule();

    // Initialize standard AUT milestones
    this.initializeAUTMilestones();
  }

  // ---------------------------------------------------------------------------
  // VESTING SCHEDULE INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeVestingSchedule(): void {
    const startTime = Date.now();

    this.vestingSchedule = this.config.trancheDelaysMonths.map((delayMonths, i) => ({
      id: `tranche_${i + 1}`,
      ts: startTime + delayMonths * 30 * 86400000,
      amountZNU: Math.floor(this.config.totalZNU * this.config.tranchePercentages[i]),
      claimed: false,
    }));

    this.vestingState.schedule = [...this.vestingSchedule];
  }

  // ---------------------------------------------------------------------------
  // AUT MILESTONES (7 Standard Milestones)
  // ---------------------------------------------------------------------------

  private initializeAUTMilestones(): void {
    const standardMilestones: Array<{
      id: string;
      description: string;
      targetTQKwh: number;
    }> = [
      { id: 'milestone_1', description: 'Basic infrastructure operational', targetTQKwh: 5000 },
      { id: 'milestone_2', description: 'Regenerative systems producing', targetTQKwh: 15000 },
      { id: 'milestone_3', description: 'Energy sovereignty achieved', targetTQKwh: 30000 },
      { id: 'milestone_4', description: 'Food sovereignty achieved', targetTQKwh: 50000 },
      { id: 'milestone_5', description: 'Water sovereignty achieved', targetTQKwh: 75000 },
      { id: 'milestone_6', description: 'Full regenerative capacity', targetTQKwh: 100000 },
      { id: 'milestone_7', description: 'Intergenerational resilience', targetTQKwh: 150000 },
    ];

    this.autMilestones = standardMilestones.map(m => ({
      ...m,
      actualTQKwh: 0,
      verified: false,
      verifiedBy: [],
      verifiedAt: 0,
      raoCredentialId: `rao_${m.id}_${Date.now()}`,
    }));
  }

  // ---------------------------------------------------------------------------
  // AUT MILESTONE MANAGEMENT
  // ---------------------------------------------------------------------------

  addAUTMilestone(milestone: Omit<AUTMilestone, 'actualTQKwh' | 'verified' | 'verifiedBy' | 'verifiedAt' | 'raoCredentialId'>): void {
    const newMilestone: AUTMilestone = {
      ...milestone,
      actualTQKwh: 0,
      verified: false,
      verifiedBy: [],
      verifiedAt: 0,
      raoCredentialId: `rao_${milestone.id}_${Date.now()}`,
    };
    this.autMilestones.push(newMilestone);
  }

  updateAUTMilestoneProgress(milestoneId: string, actualTQKwh: number): boolean {
    const milestone = this.autMilestones.find(m => m.id === milestoneId);
    if (!milestone) return false;

    milestone.actualTQKwh = actualTQKwh;

    // Auto-verify if target reached and peer verification available
    if (actualTQKwh >= milestone.targetTQKwh) {
      return this.verifyAUTMilestone(milestoneId, []);
    }
    return false;
  }

  verifyAUTMilestone(milestoneId: string, verifierDids: string[]): boolean {
    const milestone = this.autMilestones.find(m => m.id === milestoneId);
    if (!milestone) return false;
    if (milestone.actualTQKwh < milestone.targetTQKwh) return false;

    // Request peer verification from Bread
    const breadResult = this.breadEngine.verifyVestingClaim(this.n3NodeId);
    if (!breadResult.eligible) return false;

    milestone.verified = true;
    milestone.verifiedBy = verifierDids.length > 0 ? verifierDids : breadResult.peerVerification.votingN2Nodes;
    milestone.verifiedAt = Date.now();

    // Update peer verification state
    this.peerVerification = breadResult.peerVerification;

    return true;
  }

  getAUTMilestones(): AUTMilestone[] {
    return [...this.autMilestones];
  }

  getVerifiedMilestonesCount(): number {
    return this.autMilestones.filter(m => m.verified).length;
  }

  getNextRequiredMilestone(trancheIndex: number): AUTMilestone | null {
    const requiredMilestoneIndex = this.config.requiredMilestonesPerTranche[trancheIndex] - 1;
    if (requiredMilestoneIndex < 0 || requiredMilestoneIndex >= this.autMilestones.length) return null;
    return this.autMilestones[requiredMilestoneIndex];
  }

  // ---------------------------------------------------------------------------
  // PEER VERIFICATION (Bread Integration)
  // ---------------------------------------------------------------------------

  async requestPeerVerification(): Promise<PeerVerification> {
    const result = await this.breadEngine.verifyVestingClaim(this.n3NodeId);
    this.peerVerification = result.peerVerification;
    return result.peerVerification;
  }

  getPeerVerification(): PeerVerification {
    return { ...this.peerVerification };
  }

  // ---------------------------------------------------------------------------
  // URBANIKA FACTOR
  // ---------------------------------------------------------------------------

  updateUrbanikaFactor(cds: number, aut: number): void {
    this.urbanikaFactor = {
      cds: Math.max(0, Math.min(2, cds)),
      aut: Math.max(0, Math.min(2, aut)),
      composite: Math.max(0, Math.min(2, cds * aut)),
    };
  }

  getUrbanikaFactor(): { cds: number; aut: number; composite: number } {
    return { ...this.urbanikaFactor };
  }

  // ---------------------------------------------------------------------------
  // VESTING CLAIM PROCESS
  // ---------------------------------------------------------------------------

  canClaimVesting(): boolean {
    // Find next unclaimed tranche
    const nextTranche = this.vestingSchedule.find(t => !t.claimed);
    if (!nextTranche) return false;

    // Check time unlock
    if (Date.now() < nextTranche.ts) return false;

    // Check claim window (can claim within window after unlock)
    if (Date.now() > nextTranche.ts + this.config.claimWindowDays * 86400000) {
      // Tranche expired - could implement penalty or rollover
      console.warn(`Tranche ${nextTranche.id} claim window expired`);
    }

    // Check AUT milestone
    const trancheIndex = this.vestingSchedule.indexOf(nextTranche);
    const requiredMilestone = this.getNextRequiredMilestone(trancheIndex);
    if (!requiredMilestone || !requiredMilestone.verified) return false;

    // Check peer verification
    if (!this.peerVerification.quorumMet) return false;

    // Check beneficiary set
    if (!this.vestingState.beneficiary) return false;

    // Check owner renounced (for decentralization)
    if (!this.vestingState.ownerRenounced) {
      // Warning but not blocking in early phases
      console.warn('Owner not yet renounced - vesting claim allowed but decentralization incomplete');
    }

    return true;
  }

  async claimVesting(): Promise<ClaimResult> {
    if (!this.canClaimVesting()) {
      throw new Error('Vesting claim conditions not met. Check: time unlock, AUT milestone, peer verification, beneficiary set.');
    }

    const nextTranche = this.vestingSchedule.find(t => !t.claimed)!;
    nextTranche.claimed = true;
    this.claimedZNU += nextTranche.amountZNU;
    this.vestingState.claimed = this.claimedZNU;

    // Record in ValueFlows
    this.valueFlowsEngine.recordEvent({
      type: 'transfer',
      fromAgent: 'vesting-contract',
      toAgent: this.n3NodeId,
      resource: { id: 'resource_znu', name: 'ZNU', category: 'currency', unit: 'ZNU', categoryCode: 'CUR' },
      quantity: nextTranche.amountZNU,
      unit: 'ZNU',
      timestamp: Date.now(),
      raoCredentialId: `rao_${Date.now()}_${nextTranche.id}`,
    });

    // Grant Colony reputation
    const colonyReputationGain = this.calculateReputationGain(nextTranche);

    // Unlock pot access based on tranche
    const potAccessUnlocked = this.getPotAccessForTranche(this.vestingSchedule.indexOf(nextTranche));

    // Compute new N3 weight
    const newWeight = this.computeN3Weight();

    // Create attestation for vesting claim
    await this.createVestingClaimAttestation(nextTranche, newWeight);

    return {
      znuReleased: nextTranche.amountZNU,
      newWeight,
      colonyReputationGain,
      potAccessUnlocked,
      timestamp: Date.now(),
    };
  }

  private calculateReputationGain(tranche: VestingTranche): number {
    // Base reputation per tranche, increasing with tranche index
    const trancheIndex = this.vestingSchedule.indexOf(tranche);
    const baseGain = 50;
    const indexMultiplier = 1 + trancheIndex * 0.2; // 50, 60, 70, 80, 90, 100, 110
    return Math.floor(baseGain * indexMultiplier);
  }

  private getPotAccessForTranche(trancheIndex: number): string[] {
    const potMap: Record<number, string[]> = {
      0: ['pot-emergency', 'pot-operations'],
      1: ['pot-development'],
      2: ['pot-ecosystem'],
      3: ['pot-governance'],
      4: ['pot-strategic'],
      5: ['pot-sovereign'],
      6: ['pot-legacy'],
    };
    return potMap[trancheIndex] || [];
  }

  private async createVestingClaimAttestation(tranche: VestingTranche, newWeight: number): Promise<void> {
    // Create attestation for vesting claim
    // In production: use CloserAttestationEngine
    console.log(`[ATTESTATION] Vesting claim: ${tranche.id}, ${tranche.amountZNU} ZNU, new N3 weight: ${newWeight.toFixed(2)}`);
  }

  // ---------------------------------------------------------------------------
  // N3 DYNAMIC WEIGHT COMPUTATION
  // ---------------------------------------------------------------------------

  computeN3Weight(): number {
    // 1. TQ Component (60%) - Verified thermodynamic production
    const tqProduced = this.getTotalTQProduced();
    const tqTarget = 50000; // kWh/year target
    const tqComponent = Math.min(1, tqProduced / tqTarget) * 0.60;

    // 2. AUT Component (20%) - Milestone completion rate
    const verifiedMilestones = this.getVerifiedMilestonesCount();
    const autComponent = (verifiedMilestones / 7) * 0.20;

    // 3. Peer Component (10%) - Bread consensus weight
    const peerComponent = this.peerVerification.consensusWeight * 0.10;

    // 4. Urbanika Component (5%) - CDS × AUT composite
    const urbanikaComponent = this.urbanikaFactor.composite * 0.05;

    // 5. Colony Component (3%) - Reputation from Colony engine
    const colonyRep = this.colonyEngine.getN3WeightContribution(this.n3NodeId);
    const colonyComponent = Math.min(1, colonyRep / 1000) * 0.03; // Normalize

    // 6. Vesting Component (2%) - Schedule progress
    const vestingProgress = this.getVestingProgress();
    const vestingComponent = vestingProgress * 0.02;

    const finalWeight = tqComponent + autComponent + peerComponent + urbanikaComponent + colonyComponent + vestingComponent;

    // Record weight history
    const weightRecord: N3DynamicWeight = {
      nodeId: this.n3NodeId,
      period: { start: Date.now() - 86400000 * 30, end: Date.now() },
      tqGeneratedKwh: tqProduced,
      tqGeneratedVerified: tqProduced > 0,
      autMilestones: [...this.autMilestones],
      peerVerification: { ...this.peerVerification },
      urbanikaFactor: { ...this.urbanikaFactor },
      colonyReputation: colonyRep,
      vestingProgress,
      finalWeight,
      previousWeight: 0, // Would track from history
      updatedAt: Date.now(),
    };

    return finalWeight;
  }

  private getTotalTQProduced(): number {
    const events = this.valueFlowsEngine.getEvents({
      resourceId: 'resource_tq_energy',
      startTime: Date.now() - 86400000 * 365,
    });
    return events
      .filter(e => e.type === 'process' && e.toAgent === this.n3NodeId)
      .reduce((sum, e) => sum + e.quantity, 0);
  }

  getVestingProgress(): number {
    const total = this.vestingSchedule.reduce((sum, t) => sum + t.amountZNU, 0);
    return total > 0 ? this.claimedZNU / total : 0;
  }

  // ---------------------------------------------------------------------------
  // BENEFICIARY MANAGEMENT
  // ---------------------------------------------------------------------------

  setBeneficiary(beneficiaryDid: string): boolean {
    if (Date.now() > this.vestingState.beneficiarySetDeadline) {
      return false; // Deadline passed
    }
    if (this.vestingState.beneficiary) {
      return false; // Already set
    }
    this.vestingState.beneficiary = beneficiaryDid;
    return true;
  }

  renounceOwnership(): void {
    this.vestingState.ownerRenounced = true;
  }

  // ---------------------------------------------------------------------------
  // DISCO INTEGRATION (3 Flows → Vesting Progress)
  // ---------------------------------------------------------------------------

  syncDisCOContributions(): void {
    // Livelihood flow contributions increase TQ production tracking
    const livelihoodFlow = this.discoEngine.getFlowContributions('livelihood');
    const totalLivelihood = livelihoodFlow.reduce((sum, c) => sum + c.value, 0);

    // Update AUT milestone progress based on livelihood contributions
    // 1 ZNU ≈ 1 kWh equivalent for milestone tracking
    for (const milestone of this.autMilestones) {
      if (!milestone.verified) {
        milestone.actualTQKwh = totalLivelihood;
        if (milestone.actualTQKwh >= milestone.targetTQKwh) {
          // Trigger verification
          this.verifyAUTMilestone(milestone.id, []);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // VIRGINIA GATEWAY INTERFACE IMPLEMENTATION
  // ---------------------------------------------------------------------------

  // Already implemented: canClaimVesting, claimVesting, computeN3Weight
  // Additional interface methods:

  async recordContribution(flow: 'livelihood' | 'love' | 'care', value: number, description: string): Promise<void> {
    const contribution = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      memberId: this.n3NodeId,
      flowType: flow,
      value,
      description,
      timestamp: Date.now(),
      verified: false,
      raoCredentialId: `rao_${Date.now()}`,
    };
    this.discoEngine.recordContribution(contribution);
    this.breadEngine.syncContribution(contribution);
  }

  async processConsentDecision(decision: any): Promise<void> {
    // Sync with DisCO CAT
    // Already handled by DisCO engine
  }

  async syncTransparency(): Promise<void> {
    // Sync TQ Ledger to DisCO Transparency layer
    const tqEvents = this.valueFlowsEngine.getEvents({
      resourceId: 'resource_tq_energy',
      startTime: Date.now() - 86400000 * 7,
    });
    for (const event of tqEvents) {
      this.discoEngine.recordTQTransaction({
        id: event.id,
        nodeId: event.toAgent,
        type: event.type === 'process' ? 'production' : 'transfer',
        category: 'energy',
        productId: event.resource.id,
        quantity: event.quantity,
        unit: event.unit,
        timestamp: event.timestamp,
        raoCredentialId: event.raoCredentialId,
      });
    }
  }

  async federateWith(otherDHO: any, treaty: any): Promise<void> {
    return this.virginiaGateway.federateWith(otherDHO, treaty);
  }

  async syncRAO(): Promise<void> {
    return this.virginiaGateway.syncRAO();
  }

  async shareTreasury(potId: string, amount: number): Promise<void> {
    return this.virginiaGateway.shareTreasury(potId, amount);
  }

  // ---------------------------------------------------------------------------
  // GETTERS & UTILITIES
  // ---------------------------------------------------------------------------

  getVestingState(): VestingState {
    return { ...this.vestingState };
  }

  getVestingSchedule(): VestingTranche[] {
    return [...this.vestingSchedule];
  }

  getClaimedZNU(): number {
    return this.claimedZNU;
  }

  getTotalZNU(): number {
    return this.config.totalZNU;
  }

  getRemainingZNU(): number {
    return this.config.totalZNU - this.claimedZNU;
  }

  getNextTranche(): VestingTranche | null {
    return this.vestingSchedule.find(t => !t.claimed) || null;
  }

  getTimeToNextTranche(): number {
    const next = this.getNextTranche();
    if (!next) return -1;
    return Math.max(0, next.ts - Date.now());
  }

  getVestingSummary(): {
    totalZNU: number;
    claimedZNU: number;
    remainingZNU: number;
    progress: number;
    nextTranche: VestingTranche | null;
    timeToNextTranche: number;
    verifiedMilestones: number;
    totalMilestones: number;
    peerVerification: PeerVerification;
  } {
    return {
      totalZNU: this.config.totalZNU,
      claimedZNU: this.claimedZNU,
      remainingZNU: this.getRemainingZNU(),
      progress: this.getVestingProgress(),
      nextTranche: this.getNextTranche(),
      timeToNextTranche: this.getTimeToNextTranche(),
      verifiedMilestones: this.getVerifiedMilestonesCount(),
      totalMilestones: this.autMilestones.length,
      peerVerification: this.peerVerification,
    };
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  exportState(): {
    vestingState: VestingState;
    vestingSchedule: VestingTranche[];
    claimedZNU: number;
    autMilestones: AUTMilestone[];
    peerVerification: PeerVerification;
    urbanikaFactor: { cds: number; aut: number; composite: number };
    config: any;
  } {
    return {
      vestingState: this.vestingState,
      vestingSchedule: this.vestingSchedule,
      claimedZNU: this.claimedZNU,
      autMilestones: this.autMilestones,
      peerVerification: this.peerVerification,
      urbanikaFactor: this.urbanikaFactor,
      config: this.config,
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createBerryVestingEngine(
  n3NodeId: string,
  config: any,
  engines: {
    disco: DisCO_CAT_Engine;
    bread: BreadEngine;
    valueFlows: ValueFlowsEngine;
    virginia: VirginiaGateway;
    colony: ColonyEngine;
  }
): BerryVestingEngine {
  return new BerryVestingEngine(n3NodeId, config, engines);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const berryVestingEngine = (n3NodeId: string, config: any, engines: any) => createBerryVestingEngine(n3NodeId, config, engines);
export default BerryVestingEngine;