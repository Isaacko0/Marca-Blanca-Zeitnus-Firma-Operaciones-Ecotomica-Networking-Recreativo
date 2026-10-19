// src/core/lib/tq-virginia.ts
// Virginia Network Gateway: N3 Dynamic Weight, Berry Vesting, DisCO/DHO Integration
// Implements: N3 weight computation, vesting gateway, DHO federation, DisCO 3-flows mapping

import type {
  TQTransaction,
  ProductCategory,
} from './tq';

import type {
  VirginiaVestingGateway,
  VirginiaDisCOGateway,
  DHO_Node,
  DHOPhase,
  FederationTreaty,
  SharedTreasury,
  DHOPhaseTransition,
  DisCOFlowType,
  DisCOContribution,
  ConsentDecision,
  PeerVerification,
  UrbanikaFactor,
  AUTMilestone,
  VestingState,
  VestingTranche,
  ClaimResult,
  N3DynamicWeight,
  VirginiaColonyMapping,
  DisCO_CAT,
} from './tq-types-extended';

import { DisCO_CAT_Engine } from './tq-disco-cat';
import { BreadEngine } from './tq-bread';
import { ValueFlowsEngine } from './tq-valueflows';
import { OASAConstitutionEngine } from './tq-oasa';
import { CloserEngine } from './tq-closer';
import { CloserAttestationEngine } from './tq-closer-attestation';
import { SocialAuditEngine } from './tq-social-audit';
import { SnapshotEngine } from './tq-snapshot';

// ============================================================================
// VIRGINIA NETWORK GATEWAY
// ============================================================================

export class VirginiaGateway implements VirginiaVestingGateway {
  public n3NodeId: string;
  public vestingState: VestingState;
  public vestingSchedule: VestingTranche[];
  public claimedZNU: number;
  public autMilestones: AUTMilestone[];
  public peerVerification: PeerVerification;
  public urbanikaFactor: UrbanikaFactor;

  // Integrated engines
  private discoEngine: DisCO_CAT_Engine;
  private breadEngine: BreadEngine;
  private valueFlowsEngine: ValueFlowsEngine;
  private oasaEngine: OASAConstitutionEngine;
  private closerEngine: CloserEngine;
  private closerAttestationEngine: CloserAttestationEngine;
  private socialAuditEngine: SocialAuditEngine;
  private snapshotEngine: SnapshotEngine;

  // DHO state
  private dhoNode: DHO_Node | null = null;
  private dhoPhase: DHOPhase = 'emergent';

  // Weight history
  private weightHistory: N3DynamicWeight[] = [];

  constructor(
    n3NodeId: string,
    engines: {
      disco: DisCO_CAT_Engine;
      bread: BreadEngine;
      valueFlows: ValueFlowsEngine;
      oasa: OASAConstitutionEngine;
      closer: CloserEngine;
      closerAttestation: CloserAttestationEngine;
      socialAudit: SocialAuditEngine;
      snapshot: SnapshotEngine;
    }
  ) {
    this.n3NodeId = n3NodeId;
    this.discoEngine = engines.disco;
    this.breadEngine = engines.bread;
    this.valueFlowsEngine = engines.valueFlows;
    this.oasaEngine = engines.oasa;
    this.closerEngine = engines.closer;
    this.closerAttestationEngine = engines.closerAttestation;
    this.socialAuditEngine = engines.socialAudit;
    this.snapshotEngine = engines.snapshot;

    // Initialize vesting state
    this.vestingState = {
      schedule: [],
      beneficiary: null,
      claimed: 0,
      beneficiarySetDeadline: Date.now() + 86400000 * 30, // 30 days
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

    // Initialize standard Berry vesting schedule
    this.initializeBerryVestingSchedule();
  }

  // ---------------------------------------------------------------------------
  // BERRY VESTING SCHEDULE (7 tranches over 42 months)
  // ---------------------------------------------------------------------------

  private initializeBerryVestingSchedule(): void {
    const startTime = Date.now();
    const totalZNU = 100000; // Configurable per node

    const tranches: Array<{ delayMonths: number; percent: number; milestone: number }> = [
      { delayMonths: 6, percent: 0.10, milestone: 1 },
      { delayMonths: 12, percent: 0.15, milestone: 2 },
      { delayMonths: 18, percent: 0.15, milestone: 3 },
      { delayMonths: 24, percent: 0.20, milestone: 4 },
      { delayMonths: 30, percent: 0.15, milestone: 5 },
      { delayMonths: 36, percent: 0.15, milestone: 6 },
      { delayMonths: 42, percent: 0.10, milestone: 7 },
    ];

    this.vestingSchedule = tranches.map((t, i) => ({
      id: `tranche_${i + 1}`,
      ts: startTime + t.delayMonths * 30 * 86400000,
      amountZNU: Math.floor(totalZNU * t.percent),
      claimed: false,
    }));

    this.vestingState.schedule = [...this.vestingSchedule];
  }

  // ---------------------------------------------------------------------------
  // AUT MILESTONES (7 milestones)
  // ---------------------------------------------------------------------------

  addAUTMilestone(milestone: Omit<AUTMilestone, 'verified' | 'verifiedBy' | 'verifiedAt' | 'raoCredentialId'>): void {
    const newMilestone: AUTMilestone = {
      ...milestone,
      verified: false,
      verifiedBy: [],
      verifiedAt: 0,
      raoCredentialId: `rao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    this.autMilestones.push(newMilestone);
  }

  verifyAUTMilestone(milestoneId: string, verifierDids: string[]): boolean {
    const milestone = this.autMilestones.find(m => m.id === milestoneId);
    if (!milestone) return false;

    // Verify against TQ Ledger
    const tqProduced = this.getTQProducedForMilestone(milestone.targetTQKwh);
    if (tqProduced < milestone.targetTQKwh) return false;

    // Verify with Bread (peer verification)
    const breadResult = this.breadEngine.verifyVestingClaim(this.n3NodeId);
    if (!breadResult.eligible) return false;

    milestone.verified = true;
    milestone.verifiedBy = verifierDids;
    milestone.verifiedAt = Date.now();
    return true;
  }

  private getTQProducedForMilestone(targetKwh: number): number {
    // Query TQ Ledger via ValueFlows
    const events = this.valueFlowsEngine.getEvents({
      resourceId: 'resource_tq_energy',
      startTime: Date.now() - 86400000 * 365,
    });
    return events
      .filter(e => e.type === 'process' && e.toAgent === this.n3NodeId)
      .reduce((sum, e) => sum + e.quantity, 0);
  }

  getAUTMilestones(): AUTMilestone[] {
    return [...this.autMilestones];
  }

  getVerifiedMilestonesCount(): number {
    return this.autMilestones.filter(m => m.verified).length;
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
  // URBANIKA FACTOR (CDS × AUT)
  // ---------------------------------------------------------------------------

  updateUrbanikaFactor(cds: number, aut: number): void {
    this.urbanikaFactor = {
      cds: Math.max(0, Math.min(2, cds)),
      aut: Math.max(0, Math.min(2, aut)),
      composite: Math.max(0, Math.min(2, cds * aut)),
    };
  }

  getUrbanikaFactor(): UrbanikaFactor {
    return { ...this.urbanikaFactor };
  }

  // ---------------------------------------------------------------------------
  // N3 DYNAMIC WEIGHT COMPUTATION
  // ---------------------------------------------------------------------------

  computeN3Weight(): number {
    // 1. TQ Component (60%) - Verified thermodynamic production
    const tqProduced = this.getTotalTQProduced();
    const tqComponent = Math.min(1, tqProduced / 50000) * 0.60; // Target: 50,000 kWh/year

    // 2. AUT Component (20%) - Milestone completion rate
    const verifiedMilestones = this.getVerifiedMilestonesCount();
    const autComponent = (verifiedMilestones / 7) * 0.20;

    // 3. Peer Component (10%) - Bread consensus weight
    const peerComponent = this.peerVerification.consensusWeight * 0.10;

    // 4. Urbanika Component (5%) - CDS × AUT composite
    const urbanikaComponent = this.urbanikaFactor.composite * 0.05;

    // 5. Colony Component (3%) - Reputation (placeholder)
    const colonyComponent = 0.5 * 0.03; // Would integrate with Colony engine

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
      colonyReputation: 0.5,
      vestingProgress,
      finalWeight,
      previousWeight: this.weightHistory[this.weightHistory.length - 1]?.finalWeight || 0,
      updatedAt: Date.now(),
    };
    this.weightHistory.push(weightRecord);

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

  getWeightHistory(): N3DynamicWeight[] {
    return [...this.weightHistory];
  }

  // ---------------------------------------------------------------------------
  // VESTING CLAIM PROCESS
  // ---------------------------------------------------------------------------

  canClaimVesting(): boolean {
    const nextTranche = this.vestingSchedule.find(t => !t.claimed);
    if (!nextTranche) return false;
    if (Date.now() < nextTranche.ts) return false;

    // Check AUT milestone for this tranche
    const trancheIndex = this.vestingSchedule.indexOf(nextTranche);
    const requiredMilestone = this.autMilestones.find(m => m.id === `milestone_${trancheIndex + 1}`);
    if (!requiredMilestone || !requiredMilestone.verified) return false;

    // Check peer verification
    if (!this.peerVerification.quorumMet) return false;

    // Check beneficiary set
    if (!this.vestingState.beneficiary) return false;

    return true;
  }

  async claimVesting(): Promise<ClaimResult> {
    if (!this.canClaimVesting()) {
      throw new Error('Vesting claim conditions not met');
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
      raoCredentialId: `rao_${Date.now()}`,
    });

    // Grant Colony reputation
    const colonyReputationGain = 50; // Per tranche

    // Unlock pot access based on tranche
    const potAccessUnlocked = this.getPotAccessForTranche(this.vestingSchedule.indexOf(nextTranche));

    const newWeight = this.computeN3Weight();

    return {
      znuReleased: nextTranche.amountZNU,
      newWeight,
      colonyReputationGain,
      potAccessUnlocked,
      timestamp: Date.now(),
    };
  }

  private getPotAccessForTranche(trancheIndex: number): string[] {
    const potMap: Record<number, string[]> = {
      0: ['pot-emergency'],
      1: ['pot-operations'],
      2: ['pot-development'],
      3: ['pot-ecosystem'],
      4: ['pot-governance'],
      5: ['pot-strategic'],
      6: ['pot-sovereign'],
    };
    return potMap[trancheIndex] || [];
  }

  // ---------------------------------------------------------------------------
  // DISCO INTEGRATION (3 Flows → N3/N2/N1)
  // ---------------------------------------------------------------------------

  recordContribution(flow: DisCOFlowType, value: number, description: string): Promise<void> {
    const contribution: DisCOContribution = {
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

    // Record in ValueFlows based on flow type
    const resourceMap: Record<DisCOFlowType, string> = {
      livelihood: 'resource_tq_energy',
      love: 'resource_governance',
      care: 'resource_care',
    };

    this.valueFlowsEngine.recordEvent({
      type: 'transfer',
      fromAgent: this.n3NodeId,
      toAgent: 'community-pool',
      resource: { id: resourceMap[flow], name: flow, category: flow === 'livelihood' ? 'energy' : 'service', unit: flow === 'livelihood' ? 'kWh' : 'hour', categoryCode: flow === 'livelihood' ? 'ENE' : 'SVC' },
      quantity: value,
      unit: flow === 'livelihood' ? 'kWh' : 'hour',
      timestamp: Date.now(),
      raoCredentialId: contribution.raoCredentialId,
    });

    return Promise.resolve();
  }

  processConsentDecision(decision: ConsentDecision): Promise<void> {
    // Sync with DisCO CAT
    return Promise.resolve();
  }

  syncTransparency(): Promise<void> {
    // Sync TQ Ledger to DisCO Transparency layer
    return Promise.resolve();
  }

  // ---------------------------------------------------------------------------
  // DHO FEDERATION
  // ---------------------------------------------------------------------------

  initializeDHO(dhoConfig: Omit<DHO_Node, 'id' | 'flows' | 'cat' | 'federation' | 'virginiaMapping' | 'metrics' | 'createdAt' | 'updatedAt'>): DHO_Node {
    this.dhoNode = {
      ...dhoConfig,
      id: `dho_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      flows: { livelihood: [], love: [], care: [] },
      cat: this.discoEngine.getCAT(),
      federation: {
        childDHOIds: [],
        raoSync: true,
      },
      virginiaMapping: {
        n1RootDomainId: 'domain-root-zeitnus',
        n2SubDomainIds: ['domain-governance', 'domain-ecosystem', 'domain-tech'],
        n3ProjectDomainIds: ['proj-regeneration', 'proj-education', 'proj-infrastructure'],
        n3FundDomainIds: ['fund-ecosystem', 'fund-development', 'fund-emergency'],
      },
      metrics: {
        totalMembers: 0,
        activeFlows: 0,
        consentDecisionsCount: 0,
        transparencyScore: 0,
        federationHealth: 1.0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.dhoNode;
  }

  getDHONode(): DHO_Node | null {
    return this.dhoNode;
  }

  async federateWith(otherDHO: DHO_Node, treaty: FederationTreaty): Promise<void> {
    if (!this.dhoNode) throw new Error('DHO not initialized');

    this.dhoNode.federation.parentDHOId = otherDHO.id;
    this.dhoNode.federation.federationTreaty = treaty;
    this.dhoNode.federation.raoSync = true;
    this.dhoNode.updatedAt = Date.now();

    // Create shared treasury
    const sharedTreasury: SharedTreasury = {
      id: `treasury_${Date.now()}`,
      pots: new Map([
        ['fund-shared-ecosystem', 0],
        ['fund-shared-development', 0],
        ['fund-shared-emergency', 0],
      ]),
      governance: {
        signers: [this.n3NodeId, otherDHO.id],
        threshold: 2,
        movePotRequiresConsent: true,
      },
      raoCredentialId: `rao_${Date.now()}`,
    };
    this.dhoNode.federation.sharedTreasury = sharedTreasury;

    // Record federation treaty attestation
    await this.closerAttestationEngine.createAttestation({
      type: 'federation-treaty',
      subjectType: 'treaty',
      subjectId: treaty.id,
      subjectName: treaty.name,
      data: {
        treatyId: treaty.id,
        signatories: treaty.signatories,
        terms: treaty.terms,
      },
    });
  }

  async syncRAO(): Promise<void> {
    if (!this.dhoNode) return;
    this.dhoNode.federation.raoSync = true;
    this.dhoNode.updatedAt = Date.now();
  }

  async shareTreasury(potId: string, amount: number): Promise<void> {
    if (!this.dhoNode?.federation.sharedTreasury) throw new Error('No shared treasury');
    
    const pot = this.dhoNode.federation.sharedTreasury.pots.get(potId);
    if (pot !== undefined) {
      this.dhoNode.federation.sharedTreasury.pots.set(potId, pot + amount);
    }
  }

  // ---------------------------------------------------------------------------
  // COLONY MAPPING
  // ---------------------------------------------------------------------------

  getColonyMapping(): VirginiaColonyMapping {
    return {
      n1RootDomainId: 'domain-root-zeitnus',
      n2SubDomainIds: ['domain-governance', 'domain-ecosystem', 'domain-tech'],
      n3ProjectDomainIds: ['proj-regeneration', 'proj-education', 'proj-infrastructure'],
      n3FundDomainIds: ['fund-ecosystem', 'fund-development', 'fund-emergency'],
      reputationToWeightMultiplier: 0.03,
      minReputationForPotAccess: 500,
    };
  }

  // ---------------------------------------------------------------------------
  // PHASE TRANSITION
  // ---------------------------------------------------------------------------

  evaluatePhaseTransition(): DHOPhaseTransition | null {
    if (!this.dhoNode) return null;

    const currentPhase = this.dhoPhase;
    const phaseOrder: DHOPhase[] = ['emergent', 'consolidated', 'mature', 'federated'];
    const currentIndex = phaseOrder.indexOf(currentPhase);

    if (currentIndex >= phaseOrder.length - 1) return null;

    const nextPhase = phaseOrder[currentIndex + 1];
    const criteria = this.getPhaseCriteria(nextPhase);
    const gaps: string[] = [];

    // Check criteria
    const metrics = this.dhoNode.metrics;
    if (metrics.totalMembers < criteria.minMembers) gaps.push(`Members: ${metrics.totalMembers}/${criteria.minMembers}`);
    if (metrics.activeFlows < criteria.minActiveFlows) gaps.push(`Active flows: ${metrics.activeFlows}/${criteria.minActiveFlows}`);
    if (metrics.consentDecisionsCount < criteria.minConsentDecisions) gaps.push(`Consent decisions: ${metrics.consentDecisionsCount}/${criteria.minConsentDecisions}`);
    if (metrics.transparencyScore < criteria.minTransparencyScore) gaps.push(`Transparency: ${metrics.transparencyScore.toFixed(2)}/${criteria.minTransparencyScore}`);
    if (metrics.federationHealth < 0.8) gaps.push(`Federation health: ${(metrics.federationHealth*100).toFixed(0)}%`);

    return {
      fromPhase: currentPhase,
      toPhase: nextPhase,
      criteria,
      transitionActions: gaps.length === 0 ? this.getTransitionActions(nextPhase) : [],
      requiresConsent: true,
    };
  }

  private getPhaseCriteria(phase: DHOPhase) {
    const criteriaMap: Record<DHOPhase, DHOPhaseTransition['criteria']> = {
      emergent: { minMembers: 10, minActiveFlows: 3, minConsentDecisions: 5, minTransparencyScore: 0.6, virginiaN3Count: 3, avgN3Weight: 0.8, vestingCompletionRate: 0.2 },
      consolidated: { minMembers: 50, minActiveFlows: 10, minConsentDecisions: 20, minTransparencyScore: 0.8, virginiaN3Count: 9, avgN3Weight: 1.2, vestingCompletionRate: 0.5 },
      mature: { minMembers: 100, minActiveFlows: 20, minConsentDecisions: 50, minTransparencyScore: 0.9, virginiaN3Count: 27, avgN3Weight: 1.5, vestingCompletionRate: 0.8 },
      federated: { minMembers: 200, minActiveFlows: 50, minConsentDecisions: 100, minTransparencyScore: 0.95, virginiaN3Count: 100, avgN3Weight: 2.0, vestingCompletionRate: 0.9 },
    };
    return criteriaMap[phase];
  }

  private getTransitionActions(phase: DHOPhase): string[] {
    const actionsMap: Record<DHOPhase, string[]> = {
      consolidated: ['Activar Colony pots completos', 'Habilitar Vesting Berry schedule completo', 'Registrar en Gran Alianza como nodo ancla'],
      mature: ['Activar federación multi-DHO', 'Emisiones ZNU soberanas', 'Tesorería compartida multi-DHO'],
      federated: ['Federación completa multi-DHO', 'Tratado federación + RAO sync + Treasury compartida', 'Emisiones propias soberanas'],
    };
    return actionsMap[phase] || [];
  }

  transitionPhase(): boolean {
    const transition = this.evaluatePhaseTransition();
    if (transition && transition.transitionActions.length > 0) {
      this.dhoPhase = transition.toPhase;
      if (this.dhoNode) this.dhoNode.dhoPhase = transition.toPhase;
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // DISCO GATEWAY EXTENSION
  // ---------------------------------------------------------------------------

  asDisCOGateway(): VirginiaDisCOGateway {
    return {
      ...this,
      discoCAT: this.discoEngine.getCAT(),
      discoFlows: new Map([
        ['livelihood', this.discoEngine.getFlowContributions('livelihood')],
        ['love', this.discoEngine.getFlowContributions('love')],
        ['care', this.discoEngine.getFlowContributions('care')],
      ]),
      dhoNode: this.dhoNode!,
      dhoPhase: this.dhoPhase,
      federateWith: this.federateWith.bind(this),
      syncRAO: this.syncRAO.bind(this),
      shareTreasury: this.shareTreasury.bind(this),
    };
  }

  // ---------------------------------------------------------------------------
  // SNAPSHOT INTEGRATION
  // ---------------------------------------------------------------------------

  createSnapshotProposal(proposal: {
    title: string;
    body: string;
    choices: string[];
    category: 'constitutional' | 'legislative' | 'executive' | 'treasury' | 'ecosystem';
  }): string {
    const space = this.snapshotEngine.getSpace('zeitnus-main');
    if (!space) throw new Error('Main Snapshot space not found');

    const snapProposal = this.snapshotEngine.createProposal({
      spaceId: space.id,
      title: proposal.title,
      body: proposal.body,
      choices: proposal.choices,
      start: Date.now(),
      end: Date.now() + 86400000 * 7,
      snapshot: Date.now(),
      state: 'pending',
      author: this.n3NodeId,
      quorum: 1000,
      threshold: 0.51,
      executionPayloads: [],
      raoCredentialId: `rao_${Date.now()}`,
      linkedOASAArticle: proposal.category === 'constitutional' ? 8 : undefined,
    });

    return snapProposal.id;
  }

  // ---------------------------------------------------------------------------
  // SOCIAL AUDIT INTEGRATION
  // ---------------------------------------------------------------------------

  async runSocialAudit(): Promise<any> {
    return this.socialAuditEngine.runSocialAudit('village', this.n3NodeId);
  }

  // ---------------------------------------------------------------------------
  // GETTERS
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

  getDHOPhase(): DHOPhase {
    return this.dhoPhase;
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createVirginiaGateway(
  n3NodeId: string,
  engines: {
    disco: DisCO_CAT_Engine;
    bread: BreadEngine;
    valueFlows: ValueFlowsEngine;
    oasa: OASAConstitutionEngine;
    closer: CloserEngine;
    closerAttestation: CloserAttestationEngine;
    socialAudit: SocialAuditEngine;
    snapshot: SnapshotEngine;
  }
): VirginiaGateway {
  return new VirginiaGateway(n3NodeId, engines);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const virginiaGateway = (n3NodeId: string, engines: any) => createVirginiaGateway(n3NodeId, engines);
export default VirginiaGateway;