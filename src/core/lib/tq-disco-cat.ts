// src/core/lib/tq-disco-cat.ts
// DisCO CAT (Confianza/Asamblea/Transparencia) Engine
// Implements: Trust (C), Assembly (A), Transparency (T) + 3 Flows + Phases A-D

import type {
  DisCOFlowType,
  DisCOContribution,
  DisCO_CAT,
  ConsentDecision,
  PeerEndorsement,
  VoteResult,
  ValueFlowRecord,
  AuditEntry,
  DisCOPrinciple,
  DisCOValue,
  DisCOElement,
  DisCOPhase,
  DISCO_PHASES,
  DisCOPrincipleNumber,
} from './tq-types-extended';

import type { TQTransaction } from './tq';

// ============================================================================
// DISCO CAT ENGINE
// ============================================================================

export class DisCO_CAT_Engine {
  private cat: DisCO_CAT;
  private phase: keyof typeof DISCO_PHASES = 'emergent';
  private members: Map<string, { did: string; cdsScore: number; joinedAt: number }> = new Map();
  private flowContributions: Map<DisCOFlowType, DisCOContribution[]> = new Map([
    ['livelihood', []],
    ['love', []],
    ['care', []],
  ]);
  private principles: DisCOPrinciple[] = this.createDefaultPrinciples();
  private values: DisCOValue[] = this.createDefaultValues();
  private elements: DisCOElement[] = this.createDefaultElements();

  constructor() {
    this.cat = this.createEmptyCAT();
  }

  private createEmptyCAT(): DisCO_CAT {
    return {
      trust: {
        raoCredentials: [],
        cdsScore: 0,
        peerEndorsements: [],
        trustScore: 0,
      },
      assembly: {
        consentDecisions: [],
        onePersonOneVote: true,
        domainVotes: new Map(),
        consentThreshold: 0.8,
      },
      transparency: {
        valueFlows: [],
        vestingSchedules: new Map(),
        potBalances: new Map(),
        tqLedger: [],
        auditTrail: [],
      },
    };
  }

  private createDefaultPrinciples(): DisCOPrinciple[] {
    return [
      {
        number: 1,
        title: 'Relationships Over Transactions',
        description: 'Prioritize human relationships and care over extractive transactions. Value is co-created through mutual aid.',
        examples: ['Peer support networks', 'Skill shares without monetary exchange', 'Conflict resolution through dialogue'],
        relatedPrinciples: [2, 3, 7],
      },
      {
        number: 2,
        title: 'Care Before Code',
        description: 'Care work (reproductive, emotional, community) is recognized, valued, and compensated before technical production.',
        examples: ['Care flow tracking', 'Child/elder care rotation', 'Emotional labor recognition'],
        relatedPrinciples: [1, 3, 5],
      },
      {
        number: 3,
        title: 'DIWO (Do It With Others)',
        description: 'Collaboration over competition. Shared ownership of means of production. Collective intelligence.',
        examples: ['Co-owned tools/platforms', 'Pair programming', 'Collective decision making'],
        relatedPrinciples: [1, 4, 6],
      },
      {
        number: 4,
        title: 'Transparency & Open Culture',
        description: 'Radical transparency in governance, economics, and operations. Open source by default.',
        examples: ['Open books', 'Public meeting notes', 'Open source code', 'Transparent pay'],
        relatedPrinciples: [3, 5, 7],
      },
      {
        number: 5,
        title: 'Diversity & Inclusion',
        description: 'Neurodiversity, cultural diversity, gender diversity as strength. Inclusive design from start.',
        examples: ['Accessible tech', 'Multilingual docs', 'Inclusive hiring', 'Safe space policies'],
        relatedPrinciples: [2, 4, 6],
      },
      {
        number: 6,
        title: 'Federation Over Scale',
        description: 'Grow through federation of autonomous units, not centralization. Subsidiarity principle.',
        examples: ['Nested DHOs', 'Inter-DHO treaties', 'Shared treasury federations', 'Protocol interoperability'],
        relatedPrinciples: [3, 5, 7],
      },
      {
        number: 7,
        title: 'Regenerative & Just',
        description: 'Ecological regeneration and social justice as core metrics. Not extractive, not exploitative.',
        examples: ['Carbon negative ops', 'Living wages', 'Community land trusts', 'Reparative economics'],
        relatedPrinciples: [1, 2, 6],
      },
    ];
  }

  private createDefaultValues(): DisCOValue[] {
    return [
      { name: 'Trust', description: 'Foundation of all collaboration. Built through reliability and transparency.', relatedPrinciples: [1, 4] },
      { name: 'Reciprocity', description: 'Mutual exchange without immediate quid pro quo. Generalized reciprocity.', relatedPrinciples: [1, 3] },
      { name: 'Autonomy', description: 'Self-governance at every level. Subsidiarity: decisions at lowest effective level.', relatedPrinciples: [3, 6] },
      { name: 'Care', description: 'Attending to needs of self, others, and planet. Reproductive labor valued.', relatedPrinciples: [2, 7] },
      { name: 'Learning', description: 'Continuous collective learning. Failure as data. Documentation as gift.', relatedPrinciples: [3, 4] },
    ];
  }

  private createDefaultElements(): DisCOElement[] {
    return [
      { id: 'cat-trust', name: 'Trust Layer (C)', description: 'RAO credentials, CDS scores, peer endorsements', chapter: 1, category: 'governance', implementation: 'core' },
      { id: 'cat-assembly', name: 'Assembly Layer (A)', description: 'Consent decisions, 1a1v, domain voting', chapter: 2, category: 'governance', implementation: 'core' },
      { id: 'cat-transparency', name: 'Transparency Layer (T)', description: 'ValueFlows, vesting, pots, TQ ledger, audit trail', chapter: 3, category: 'economic', implementation: 'core' },
      { id: 'three-flows', name: 'Three Flows', description: 'Livelihood (N3), Love (N2), Care (N1)', chapter: 4, category: 'economic', implementation: 'core' },
      { id: 'phases', name: 'DisCO Phases A-D', description: 'Emergent → Consolidated → Mature → Federated', chapter: 5, category: 'governance', implementation: 'core' },
      { id: 'cultural-protocols', name: 'Cultural Protocols', description: 'Conflict resolution, onboarding, celebrations', chapter: 6, category: 'care', implementation: 'core' },
      { id: 'legal-wrapper', name: 'Legal Wrapper', description: 'Cooperative, Association, Purpose LLC, CLT', chapter: 7, category: 'legal', implementation: 'optional' },
      { id: 'ai-2020s', name: 'AI in 2020s', description: 'AI as commons tool, not autonomous agent', chapter: 8, category: 'tech', implementation: 'experimental' },
    ];
  }

  // ---------------------------------------------------------------------------
  // C - CONFIANZA (TRUST)
  // ---------------------------------------------------------------------------

  addRAOCredential(memberDid: string, raoCredentialId: string): void {
    if (!this.cat.trust.raoCredentials.includes(raoCredentialId)) {
      this.cat.trust.raoCredentials.push(raoCredentialId);
    }
    this.recalculateTrustScore();
  }

  updateCDSScore(memberDid: string, score: number): void {
    const member = this.members.get(memberDid);
    if (member) {
      member.cdsScore = Math.max(0, Math.min(1, score));
    }
    this.recalculateTrustScore();
  }

  addPeerEndorsement(endorsement: PeerEndorsement): void {
    this.cat.trust.peerEndorsements.push(endorsement);
    this.recalculateTrustScore();
  }

  private recalculateTrustScore(): void {
    // Trust score = weighted average of RAO presence, CDS avg, peer endorsement weight
    const raoScore = this.cat.trust.raoCredentials.length > 0 ? 0.3 : 0;
    
    const memberScores = Array.from(this.members.values()).map(m => m.cdsScore);
    const avgCDS = memberScores.length > 0 
      ? memberScores.reduce((a, b) => a + b, 0) / memberScores.length 
      : 0;
    const cdsScore = avgCDS * 0.4;

    const endorsementWeight = this.cat.trust.peerEndorsements.reduce((sum, e) => sum + e.weight, 0);
    const maxPossibleEndorsements = this.members.size * 3; // assume max 3 per member
    const endorsementScore = maxPossibleEndorsements > 0 
      ? Math.min(1, endorsementWeight / maxPossibleEndorsements) * 0.3 
      : 0;

    this.cat.trust.trustScore = raoScore + cdsScore + endorsementScore;
    this.cat.trust.cdsScore = avgCDS;
  }

  getTrustScore(): number {
    return this.cat.trust.trustScore;
  }

  // ---------------------------------------------------------------------------
  // A - ASAMBLEA (GOVERNANCE)
  // ---------------------------------------------------------------------------

  proposeConsentDecision(
    proposer: string,
    proposal: string
  ): ConsentDecision {
    const decision: ConsentDecision = {
      id: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      proposal,
      proposer,
      status: 'proposed',
      consents: new Map(),
      consentRatio: 0,
      blocked: false,
      integratedAt: 0,
      raoCredentialId: '', // to be filled by proposer
    };

    this.cat.assembly.consentDecisions.push(decision);
    return decision;
  }

  voteConsent(decisionId: string, voter: string, choice: 'consent' | 'concern' | 'block', raoCredentialId: string): boolean {
    const decision = this.cat.assembly.consentDecisions.find(d => d.id === decisionId);
    if (!decision || decision.status !== 'proposed' && decision.status !== 'consenting') {
      return false;
    }

    decision.consents.set(voter, choice);
    decision.raoCredentialId = raoCredentialId;

    const totalVotes = decision.consents.size;
    const consentVotes = Array.from(decision.consents.values()).filter(v => v === 'consent').length;
    const blockVotes = Array.from(decision.consents.values()).filter(v => v === 'block').length;

    decision.consentRatio = totalVotes > 0 ? consentVotes / totalVotes : 0;
    decision.blocked = blockVotes > 0;

    if (blockVotes > 0) {
      decision.status = 'blocked';
    } else if (decision.consentRatio >= this.cat.assembly.consentThreshold) {
      decision.status = 'approved';
    } else {
      decision.status = 'consenting';
    }

    return true;
  }

  integrateDecision(decisionId: string): boolean {
    const decision = this.cat.assembly.consentDecisions.find(d => d.id === decisionId);
    if (!decision || decision.status !== 'approved') {
      return false;
    }

    decision.status = 'integrated';
    decision.integratedAt = Date.now();
    return true;
  }

  recordDomainVote(domainId: string, voter: string, choice: 'consent' | 'concern' | 'block', weight: number): void {
    const existing = this.cat.assembly.domainVotes.get(domainId) || { choice: 'consent' as const, weight: 0, timestamp: 0 };
    // For domain voting, we track the latest vote per voter per domain
    // In practice, this would be a Map<voter, VoteResult> per domain
    this.cat.assembly.domainVotes.set(`${domainId}:${voter}`, { choice, weight, timestamp: Date.now() });
  }

  // ---------------------------------------------------------------------------
  // T - TRANSPARENCIA (TRANSPARENCY)
  // ---------------------------------------------------------------------------

  recordValueFlow(flow: ValueFlowRecord): void {
    this.cat.transparency.valueFlows.push(flow);
  }

  recordTQTransaction(tx: TQTransaction): void {
    this.cat.transparency.tqLedger.push(tx);
  }

  updateVestingSchedule(memberDid: string, tranches: Array<{ id: string; ts: number; amountZNU: number; claimed: boolean }>): void {
    this.cat.transparency.vestingSchedules.set(memberDid, tranches);
  }

  updatePotBalance(potId: string, balance: number): void {
    this.cat.transparency.potBalances.set(potId, balance);
  }

  addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'> & { timestamp?: number }): void {
    const auditEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      action: entry.action,
      actor: entry.actor,
      timestamp: entry.timestamp ?? Date.now(),
      details: entry.details,
      raoCredentialId: entry.raoCredentialId,
    };
    this.cat.transparency.auditTrail.push(auditEntry);
  }

  // ---------------------------------------------------------------------------
  // THREE FLOWS (Livelihood/Love/Care)
  // ---------------------------------------------------------------------------

  recordContribution(contribution: DisCOContribution): void {
    const flows = this.flowContributions.get(contribution.flowType);
    if (flows) {
      flows.push(contribution);
    }
  }

  getFlowContributions(flowType: DisCOFlowType): DisCOContribution[] {
    return this.flowContributions.get(flowType) || [];
  }

  getTotalFlowValue(flowType: DisCOFlowType): number {
    return this.flowContributions.get(flowType)?.reduce((sum, c) => sum + c.value, 0) ?? 0;
  }

  getAllFlowsSummary(): Record<DisCOFlowType, { count: number; totalValue: number; verifiedCount: number }> {
    const result: Record<DisCOFlowType, { count: number; totalValue: number; verifiedCount: number }> = {
      livelihood: { count: 0, totalValue: 0, verifiedCount: 0 },
      love: { count: 0, totalValue: 0, verifiedCount: 0 },
      care: { count: 0, totalValue: 0, verifiedCount: 0 },
    };

    for (const [flowType, contributions] of this.flowContributions) {
      result[flowType] = {
        count: contributions.length,
        totalValue: contributions.reduce((sum, c) => sum + c.value, 0),
        verifiedCount: contributions.filter(c => c.verified).length,
      };
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // PHASE MANAGEMENT
  // ---------------------------------------------------------------------------

  getCurrentPhase(): DisCOPhase {
    return DISCO_PHASES[this.phase];
  }

  getPhaseName(): string {
    return this.phase;
  }

  evaluatePhaseTransition(): { canTransition: boolean; nextPhase: keyof typeof DISCO_PHASES | null; gaps: string[] } {
    const currentPhase = DISCO_PHASES[this.phase];
    const phaseOrder: (keyof typeof DISCO_PHASES)[] = ['emergent', 'consolidated', 'mature', 'federated'];
    const currentIndex = phaseOrder.indexOf(this.phase);
    
    if (currentIndex >= phaseOrder.length - 1) {
      return { canTransition: false, nextPhase: null, gaps: ['Already at final phase'] };
    }

    const nextPhase = phaseOrder[currentIndex + 1];
    const nextPhaseData = DISCO_PHASES[nextPhase];
    const criteria = nextPhaseData.criteria;
    const gaps: string[] = [];

    // Check criteria
    if (this.members.size < criteria.minMembers) {
      gaps.push(`Members: ${this.members.size}/${criteria.minMembers}`);
    }

    const activeFlows = Array.from(this.flowContributions.values()).flat().filter(c => c.verified).length;
    if (activeFlows < criteria.minActiveFlows) {
      gaps.push(`Active verified flows: ${activeFlows}/${criteria.minActiveFlows}`);
    }

    const consentDecisions = this.cat.assembly.consentDecisions.filter(d => d.status === 'integrated').length;
    if (consentDecisions < criteria.minConsentDecisions) {
      gaps.push(`Integrated consent decisions: ${consentDecisions}/${criteria.minConsentDecisions}`);
    }

    const transparencyScore = this.calculateTransparencyScore();
    if (transparencyScore < criteria.minTransparencyScore) {
      gaps.push(`Transparency score: ${transparencyScore.toFixed(2)}/${criteria.minTransparencyScore}`);
    }

    // Virginia N3 metrics would come from external integration
    // For now, we simulate
    const virginiaN3Count = 0; // Would be injected
    const avgN3Weight = 0;
    const vestingCompletionRate = 0;

    if (virginiaN3Count < criteria.virginiaN3Count) {
      gaps.push(`Virginia N3 nodes: ${virginiaN3Count}/${criteria.virginiaN3Count}`);
    }
    if (avgN3Weight < criteria.avgN3Weight) {
      gaps.push(`Avg N3 weight: ${avgN3Weight.toFixed(2)}/${criteria.avgN3Weight}`);
    }
    if (vestingCompletionRate < criteria.vestingCompletionRate) {
      gaps.push(`Vesting completion: ${(vestingCompletionRate * 100).toFixed(0)}%/${(criteria.vestingCompletionRate * 100).toFixed(0)}%`);
    }

    const canTransition = gaps.length === 0 && currentPhaseData.requiresConsent === false; // Requires consent check separately

    return { canTransition, nextPhase: gaps.length === 0 ? nextPhase : null, gaps };
  }

  transitionPhase(): boolean {
    const evaluation = this.evaluatePhaseTransition();
    if (evaluation.canTransition && evaluation.nextPhase) {
      this.phase = evaluation.nextPhase;
      this.addAuditEntry({
        action: 'phase_transition',
        actor: 'system',
        details: { from: this.phase, to: evaluation.nextPhase },
        raoCredentialId: '',
      });
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // TRANSPARENCY SCORING
  // ---------------------------------------------------------------------------

  private calculateTransparencyScore(): number {
    let score = 0;
    let factors = 0;

    // Value flows coverage
    const totalContributions = Array.from(this.flowContributions.values()).flat().length;
    const recordedFlows = this.cat.transparency.valueFlows.length;
    if (totalContributions > 0) {
      score += Math.min(1, recordedFlows / totalContributions);
      factors++;
    }

    // Vesting schedules coverage
    const membersWithVesting = this.cat.transparency.vestingSchedules.size;
    if (this.members.size > 0) {
      score += membersWithVesting / this.members.size;
      factors++;
    }

    // Pot balances coverage
    if (this.cat.transparency.potBalances.size > 0) {
      score += 1;
      factors++;
    }

    // TQ ledger sync
    if (this.cat.transparency.tqLedger.length > 0) {
      score += 1;
      factors++;
    }

    // Audit trail completeness
    if (this.cat.transparency.auditTrail.length > 0) {
      score += 1;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  getTransparencyScore(): number {
    return this.calculateTransparencyScore();
  }

  // ---------------------------------------------------------------------------
  // MEMBER MANAGEMENT
  // ---------------------------------------------------------------------------

  addMember(did: string, cdsScore: number = 0): void {
    this.members.set(did, { did, cdsScore, joinedAt: Date.now() });
    this.recalculateTrustScore();
  }

  removeMember(did: string): boolean {
    const result = this.members.delete(did);
    this.recalculateTrustScore();
    return result;
  }

  getMember(did: string): { did: string; cdsScore: number; joinedAt: number } | undefined {
    return this.members.get(did);
  }

  getAllMembers(): Array<{ did: string; cdsScore: number; joinedAt: number }> {
    return Array.from(this.members.values());
  }

  // ---------------------------------------------------------------------------
  // CAT STATE ACCESS
  // ---------------------------------------------------------------------------

  getCAT(): DisCO_CAT {
    return this.cat;
  }

  getPrinciples(): DisCOPrinciple[] {
    return this.principles;
  }

  getValues(): DisCOValue[] {
    return this.values;
  }

  getElements(): DisCOElement[] {
    return this.elements;
  }

  getAllPhases(): Record<string, DisCOPhase> {
    return DISCO_PHASES;
  }

  // ---------------------------------------------------------------------------
  // EXPORT / SNAPSHOT
  // ---------------------------------------------------------------------------

  snapshot(): {
    phase: string;
    members: number;
    trustScore: number;
    transparencyScore: number;
    flows: Record<DisCOFlowType, { count: number; totalValue: number }>;
    consentDecisions: { proposed: number; approved: number; blocked: number; integrated: number };
    auditEntries: number;
  } {
    const flows = this.getAllFlowsSummary();
    const consentDecisions = this.cat.assembly.consentDecisions;

    return {
      phase: this.phase,
      members: this.members.size,
      trustScore: this.cat.trust.trustScore,
      transparencyScore: this.calculateTransparencyScore(),
      flows: {
        livelihood: { count: flows.livelihood.count, totalValue: flows.livelihood.totalValue },
        love: { count: flows.love.count, totalValue: flows.love.totalValue },
        care: { count: flows.care.count, totalValue: flows.care.totalValue },
      },
      consentDecisions: {
        proposed: consentDecisions.filter(d => d.status === 'proposed').length,
        approved: consentDecisions.filter(d => d.status === 'approved').length,
        blocked: consentDecisions.filter(d => d.status === 'blocked').length,
        integrated: consentDecisions.filter(d => d.status === 'integrated').length,
      },
      auditEntries: this.cat.transparency.auditTrail.length,
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createDisCO_CAT_Engine(): DisCO_CAT_Engine {
  return new DisCO_CAT_Engine();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const discoCATEngine = new DisCO_CAT_Engine();
export default discoCATEngine;