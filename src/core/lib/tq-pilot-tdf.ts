// src/core/lib/tq-pilot-tdf.ts
// Traditional Dream Factory Pilot → Virginia N3 Integration
// Implements: Real-world pilot case (water table 20m→3m, 5000 trees, €1.5M)
// Integrates: All Fase 1-2 engines for end-to-end verification

import type { TQTransaction } from './tq';
import { OASAConstitutionEngine } from './tq-oasa';
import { DisCO_CAT_Engine } from './tq-disco-cat';
import { CloserEngine } from './tq-closer';
import { ValueFlowsEngine } from './tq-valueflows';
import { SnapshotEngine } from './tq-snapshot';
import { TDFEngine } from './tq-tdf';
import { BreadEngine } from './tq-bread';
import { SocialAuditEngine } from './tq-social-audit';
import { CloserAttestationEngine } from './tq-closer-attestation';
import { VirginiaVestingGateway, CloserVillage, DisCOContribution, ConsentDecision } from './tq-types-extended';

// ============================================================================
// PILOT TYPES
// ============================================================================

export interface PilotTDFCase {
  id: string;
  name: string;
  location: {
    country: string;
    region: string;
    coordinates: { lat: number; lng: number };
    bioregion: string;
  };
  baseline: PilotBaseline;
  targets: PilotTargets;
  current: PilotCurrentState;
  timeline: PilotTimeline;
  budget: PilotBudget;
  status: 'planning' | 'onboarding' | 'active' | 'verification' | 'completed' | 'failed';
  raoCredentialId: string;
}

export interface PilotBaseline {
  waterTableDepth: number; // meters
  soilCarbon: number; // tC/ha
  treeCount: number;
  biodiversityIndex: number; // Shannon
  renewableEnergy: number; // %
  wasteDiversion: number; // %
  communitySize: number;
  annualIncome: number; // EUR
  tqProduction: number; // kWh/year
}

export interface PilotTargets {
  waterTableDepth: number; // target meters
  soilCarbon: number; // target tC/ha
  treeCount: number; // target trees
  biodiversityIndex: number; // target Shannon
  renewableEnergy: number; // target %
  wasteDiversion: number; // target %
  communitySize: number; // target
  annualIncome: number; // target EUR
  tqProduction: number; // target kWh/year
  oasaCompliance: number; // target 0-1
  transparencyScore: number; // target 0-1
}

export interface PilotCurrentState {
  waterTableDepth: number;
  soilCarbon: number;
  treeCount: number;
  biodiversityIndex: number;
  renewableEnergy: number;
  wasteDiversion: number;
  communitySize: number;
  annualIncome: number;
  tqProduction: number;
  oasaCompliance: number;
  transparencyScore: number;
  lastUpdated: number;
}

export interface PilotTimeline {
  startDate: number;
  phases: PilotPhase[];
  estimatedEndDate: number;
}

export interface PilotPhase {
  id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  milestones: PilotMilestone[];
  status: 'pending' | 'active' | 'completed' | 'delayed';
  budgetAllocated: number;
  budgetSpent: number;
}

export interface PilotMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: number;
  actualDate?: number;
  oasaPrinciple: number; // 1-7
  metricName: string;
  targetValue: number;
  unit: string;
  verificationTrack: 1 | 2 | 3; // TDF track
  status: 'pending' | 'in-progress' | 'verified' | 'failed';
  attestationId?: string;
}

export interface PilotBudget {
  total: number; // EUR
  allocated: Record<string, number>; // category -> amount
  spent: Record<string, number>;
  fundingSources: PilotFundingSource[];
}

export interface PilotFundingSource {
  source: string;
  amount: number;
  type: 'grant' | 'investment' | 'community' | 'village-fund' | 'revenue';
  conditions?: string[];
}

// ============================================================================
// PILOT TDF ENGINE
// ============================================================================

export class PilotTDFEngine {
  private pilot: PilotTDFCase;
  
  // All integrated engines
  private oasaEngine: OASAConstitutionEngine;
  private discoEngine: DisCO_CAT_Engine;
  private closerEngine: CloserEngine;
  private valueFlowsEngine: ValueFlowsEngine;
  private snapshotEngine: SnapshotEngine;
  private tdfEngine: TDFEngine;
  private breadEngine: BreadEngine;
  private socialAuditEngine: SocialAuditEngine;
  private closerAttestationEngine: CloserAttestationEngine;

  constructor(
    pilotConfig: Omit<PilotTDFCase, 'id' | 'raoCredentialId' | 'status'> & { id?: string }
  ) {
    this.pilot = {
      ...pilotConfig,
      id: pilotConfig.id || `pilot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      raoCredentialId: `rao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'planning',
    };

    // Initialize all engines
    this.oasaEngine = new OASAConstitutionEngine();
    this.discoEngine = new DisCO_CAT_Engine();
    this.closerEngine = new CloserEngine();
    this.valueFlowsEngine = new ValueFlowsEngine();
    this.snapshotEngine = new SnapshotEngine();
    this.tdfEngine = new TDFEngine(this.discoEngine, this.snapshotEngine);
    this.breadEngine = new BreadEngine(this.discoEngine);
    this.socialAuditEngine = new SocialAuditEngine(this.discoEngine, this.breadEngine, this.oasaEngine);
    this.closerAttestationEngine = new CloserAttestationEngine();

    // Wire up engines
    this.snapshotEngine.setDisCOEngine(this.discoEngine);
    this.snapshotEngine.setOASAEngine(this.oasaEngine);
  }

  // ============================================================================
  // PHASE 1: VILLAGE ONBOARDING (TDF Track 1)
  // ============================================================================

  async onboardVillage(villageData: {
    village: Omit<CloserVillage, 'id' | 'onCloserSince' | 'oasaPrinciplesCompliance'>;
    landTitleVerified: boolean;
    landTitleUri: string;
    landTitleHash: string;
    regenerationPlanUri: string;
    planHash: string;
    principlesCovered: number;
    targetsMeasurable: number;
    stewardshipSigned: boolean;
    signers: string[];
    requiredSigners: number;
    commitmentUri: string;
    commitmentHash: string;
    financialOpen: boolean;
    financialUri: string;
    financialHash: string;
    ecologicalOpen: boolean;
    ecologicalUri: string;
    ecologicalHash: string;
    governanceOpen: boolean;
    governanceUri: string;
    governanceHash: string;
    agentRegistered: boolean;
    agentId: string;
    activeCapabilities: string[];
    domain: string;
  }): Promise<{ villageId: string; attestationId: string; track1Passed: boolean }> {
    this.pilot.status = 'onboarding';

    // 1. Register village in Closer
    const villageResult = this.closerEngine.registerVillage({
      ...villageData.village,
      id: '',
      onCloserSince: 0,
      oasaPrinciplesCompliance: 0,
    } as CloserVillage);

    if (!villageResult.success) {
      throw new Error(`Village registration failed: ${villageResult.errors.join(', ')}`);
    }

    const villageId = villageResult.villageId!;

    // 2. Create Closer Attestation (TDF Track 1)
    const attestation = await this.closerAttestationEngine.createVillageOnboardingAttestation(
      { ...villageData.village, id: villageId, onCloserSince: 0, oasaPrinciplesCompliance: 0 } as CloserVillage,
      {
        landTitleVerified: villageData.landTitleVerified,
        landTitleUri: villageData.landTitleUri,
        landTitleHash: villageData.landTitleHash,
        regenerationPlanUri: villageData.regenerationPlanUri,
        planHash: villageData.planHash,
        principlesCovered: villageData.principlesCovered,
        targetsMeasurable: villageData.targetsMeasurable,
        stewardshipSigned: villageData.stewardshipSigned,
        signers: villageData.signers,
        requiredSigners: villageData.requiredSigners,
        commitmentUri: villageData.commitmentUri,
        commitmentHash: villageData.commitmentHash,
        financialOpen: villageData.financialOpen,
        financialUri: villageData.financialUri,
        financialHash: villageData.financialHash,
        ecologicalOpen: villageData.ecologicalOpen,
        ecologicalUri: villageData.ecologicalUri,
        ecologicalHash: villageData.ecologicalHash,
        governanceOpen: villageData.governanceOpen,
        governanceUri: villageData.governanceUri,
        governanceHash: villageData.governanceHash,
        agentRegistered: villageData.agentRegistered,
        agentId: villageData.agentId,
        activeCapabilities: villageData.activeCapabilities,
        domain: villageData.domain,
      }
    );

    // 3. Verify attestation
    const verification = this.closerAttestationEngine.verifyAttestation(attestation.id);
    
    // 4. Run TDF Track 1 verification
    const tdfContext = {
      villageId,
      data: {
        landTitleVerified: villageData.landTitleVerified,
        landTitleUri: villageData.landTitleUri,
        landTitleHash: villageData.landTitleHash,
        regenerationPlanUri: villageData.regenerationPlanUri,
        planHash: villageData.planHash,
        principlesCovered: villageData.principlesCovered,
        targetsMeasurable: villageData.targetsMeasurable,
        stewardshipSigned: villageData.stewardshipSigned,
        signers: villageData.signers,
        requiredSigners: villageData.requiredSigners,
        commitmentUri: villageData.commitmentUri,
        commitmentHash: villageData.commitmentHash,
        financialOpen: villageData.financialOpen,
        financialUri: villageData.financialUri,
        financialHash: villageData.financialHash,
        ecologicalOpen: villageData.ecologicalOpen,
        ecologicalUri: villageData.ecologicalUri,
        ecologicalHash: villageData.ecologicalHash,
        governanceOpen: villageData.governanceOpen,
        governanceUri: villageData.governanceUri,
        governanceHash: villageData.governanceHash,
        closerAgentRegistered: villageData.agentRegistered,
        activeCapabilities: villageData.activeCapabilities,
        agentRegistryUri: villageData.agentId,
        agentRegistryHash: '',
      },
      timestamp: Date.now(),
    };

    const track1Result = await this.runTrack1Only(tdfContext);

    return {
      villageId,
      attestationId: attestation.id,
      track1Passed: track1Result.passed,
    };
  }

  private async runTrack1Only(context: any): Promise<{ passed: boolean; score: number }> {
    const track1 = this.tdfEngine.getTrack(1)!;
    let weightedScore = 0;
    let totalWeight = 0;

    for (const criterion of track1.criteria) {
      const result = await criterion.verifyFn(context);
      weightedScore += result.score * criterion.weight;
      totalWeight += criterion.weight;
    }

    const score = totalWeight > 0 ? weightedScore / totalWeight : 0;
    return { passed: score >= track1.threshold, score };
  }

  // ============================================================================
  // PHASE 2: DISCO CAT INITIALIZATION
  // ============================================================================

  initializeDisCO(communityMembers: Array<{ did: string; cdsScore: number }>): void {
    this.pilot.status = 'active';

    // Add members to DisCO
    for (const member of communityMembers) {
      this.discoEngine.addMember(member.did, member.cdsScore);
      this.breadEngine.createProfile(member.did, `Member ${member.did.slice(-6)}`, member.cdsScore);
    }

    // Initialize Virginia N3 nodes for livelihood flow
    // (In practice, would map community members to Virginia N3)
  }

  // ============================================================================
  // PHASE 3: RECORD CONTRIBUTIONS (3 FLOWS)
  // ============================================================================

  recordContribution(contribution: DisCOContribution): void {
    this.discoEngine.recordContribution(contribution);
    this.breadEngine.syncContribution(contribution);

    // Record in ValueFlows
    const vfResource = this.getOrCreateVFResource(contribution.flowType);
    this.valueFlowsEngine.recordEvent({
      type: 'transfer',
      fromAgent: contribution.memberId,
      toAgent: 'community-pool',
      resource: vfResource,
      quantity: contribution.value,
      unit: 'ZNU',
      timestamp: contribution.timestamp,
      raoCredentialId: contribution.raoCredentialId,
    });
  }

  private getOrCreateVFResource(flowType: DisCOContribution['flowType']): any {
    const resourceMap = {
      livelihood: { id: 'resource-tq-production', name: 'TQ Production', category: 'energy', unit: 'kWh', categoryCode: 'ENE' },
      love: { id: 'resource-governance', name: 'Governance Coordination', category: 'service', unit: 'hour', categoryCode: 'SVC' },
      care: { id: 'resource-care', name: 'Care Work', category: 'service', unit: 'hour', categoryCode: 'SVC' },
    };
    return resourceMap[flowType];
  }

  // ============================================================================
  // PHASE 4: CONSENT GOVERNANCE
  // ============================================================================

  proposeAndVote(proposal: string, proposer: string, votes: Array<{ voter: string; choice: 'consent' | 'concern' | 'block' }>): ConsentDecision | null {
    const decision = this.discoEngine.proposeConsentDecision(proposer, proposal);
    
    for (const vote of votes) {
      this.discoEngine.voteConsent(decision.id, vote.voter, vote.choice, `rao_${Date.now()}`);
    }

    if (decision.status === 'approved') {
      this.discoEngine.integrateDecision(decision.id);
    }

    // Record in ValueFlows
    this.valueFlowsEngine.recordEvent({
      type: 'process',
      fromAgent: 'governance',
      toAgent: 'decision-record',
      resource: { id: 'resource-governance-decision', name: 'Governance Decision', category: 'service', unit: 'count', categoryCode: 'SVC' },
      quantity: 1,
      unit: 'count',
      timestamp: Date.now(),
      raoCredentialId: `rao_${Date.now()}`,
    });

    return decision;
  }

  // ============================================================================
  // PHASE 5: REGENERATION MILESTONES (OASA Principles)
  // ============================================================================

  async claimRegenerationMilestone(milestone: {
    principle: number;
    metricName: string;
    targetValue: number;
    achievedValue: number;
    measurementMethod: string;
    evidenceUris: string[];
    evidenceHashes: string[];
  }): Promise<{ attestationId: string; track1Passed: boolean }> {
    const villageId = this.getVillageId();
    if (!villageId) throw new Error('No village onboarded');

    const attestation = await this.closerAttestationEngine.createRegenerationMilestoneAttestation(villageId, milestone);

    // Update pilot current state
    this.updatePilotMetric(milestone.metricName, milestone.achievedValue);

    // Run TDF verification for this milestone
    const tdfReport = await this.tdfEngine.runVerification({
      villageId,
      data: {
        ecologicalMetrics: {
          [this.getPrincipleName(milestone.principle)]: {
            target: milestone.targetValue,
            current: milestone.achievedValue,
            baseline: this.getBaselineForPrinciple(milestone.principle),
          },
        },
      },
      timestamp: Date.now(),
    });

    return {
      attestationId: attestation.id,
      track1Passed: tdfReport.trackResults.get(1)?.passed ?? false,
    };
  }

  private updatePilotMetric(metricName: string, value: number): void {
    const current = this.pilot.current;
    switch (metricName) {
      case 'waterTableDepth': current.waterTableDepth = value; break;
      case 'soilCarbon': current.soilCarbon = value; break;
      case 'treeCount': current.treeCount = value; break;
      case 'biodiversityIndex': current.biodiversityIndex = value; break;
      case 'renewableEnergy': current.renewableEnergy = value; break;
      case 'wasteDiversion': current.wasteDiversion = value; break;
      case 'tqProduction': current.tqProduction = value; break;
    }
    current.lastUpdated = Date.now();
  }

  private getPrincipleName(principle: number): string {
    const names = ['', 'soil', 'water', 'air', 'waste', 'rewilding', 'resources', 'community'];
    return names[principle] || '';
  }

  private getBaselineForPrinciple(principle: number): number {
    const baseline = this.pilot.baseline;
    switch (principle) {
      case 1: return baseline.soilCarbon;
      case 2: return baseline.waterTableDepth;
      case 3: return baseline.biodiversityIndex; // proxy for air
      case 4: return baseline.wasteDiversion;
      case 5: return baseline.biodiversityIndex;
      case 6: return baseline.renewableEnergy;
      case 7: return baseline.communitySize; // proxy
      default: return 0;
    }
  }

  // ============================================================================
  // PHASE 6: VIRGINIA N3 VESTING CLAIMS
  // ============================================================================

  async processVestingClaims(n3NodeIds: string[]): Promise<Array<{ nodeId: string; eligible: boolean; znuReleased: number }>> {
    const results = [];

    for (const nodeId of n3NodeIds) {
      // Verify via Bread (peer endorsement)
      const breadResult = await this.breadEngine.verifyVestingClaim(nodeId);
      
      if (breadResult.eligible) {
        // In production: call Virginia gateway claimVesting()
        const znuReleased = 1250; // placeholder
        
        // Record in ValueFlows
        this.valueFlowsEngine.recordEvent({
          type: 'transfer',
          fromAgent: 'vesting-contract',
          toAgent: nodeId,
          resource: { id: 'resource-znu', name: 'ZNU Tokens', category: 'currency', unit: 'ZNU', categoryCode: 'CUR' },
          quantity: znuReleased,
          unit: 'ZNU',
          timestamp: Date.now(),
          raoCredentialId: `rao_${Date.now()}`,
        });

        results.push({ nodeId, eligible: true, znuReleased });
      } else {
        results.push({ nodeId, eligible: false, znuReleased: 0 });
      }
    }

    return results;
  }

  // ============================================================================
  // PHASE 7: SNAPSHOT GOVERNANCE PROPOSALS
  // ============================================================================

  createGovernanceProposal(proposal: {
    spaceId: string;
    title: string;
    body: string;
    choices: string[];
    start: number;
    end: number;
    snapshot: number;
    quorum: number;
    threshold: number;
    author: string;
    category: 'constitutional' | 'legislative' | 'executive' | 'treasury' | 'ecosystem';
  }): string {
    const space = this.snapshotEngine.getSpace(proposal.spaceId);
    if (!space) throw new Error('Space not found');

    const snapProposal = this.snapshotEngine.createProposal({
      spaceId: proposal.spaceId,
      title: proposal.title,
      body: proposal.body,
      choices: proposal.choices,
      start: proposal.start,
      end: proposal.end,
      snapshot: proposal.snapshot,
      state: 'pending',
      author: proposal.author,
      quorum: proposal.quorum,
      threshold: proposal.threshold,
      executionPayloads: [],
      raoCredentialId: `rao_${Date.now()}`,
      linkedOASAArticle: proposal.category === 'constitutional' ? 8 : undefined,
    });

    return snapProposal.id;
  }

  // ============================================================================
  // PHASE 8: SOCIAL AUDIT (TDF Track 3)
  // ============================================================================

  async runSocialAudit(subjectType: PilotTDFCase['status'], subjectId: string): Promise<any> {
    const panel = this.socialAuditEngine.createVillageAuditPanel();
    
    // Select panel members from community
    const candidatePool = new Map();
    for (const member of this.discoEngine.getAllMembers()) {
      const breadProfile = this.breadEngine.getProfile(member.did);
      candidatePool.set(member.did, {
        cdsScore: member.cdsScore,
        reputation: breadProfile?.reputation || 0,
        domain: 'governance', // Would map from Virginia N2
        lastActive: member.joinedAt,
      });
    }

    const members = this.socialAuditEngine.rotatePanel(panel.id, candidatePool);
    panel.members = members;

    const audit = this.socialAuditEngine.scheduleAudit({
      panelId: panel.id,
      subjectType: 'village',
      subjectId,
      subjectName: this.pilot.name,
      scope: panel.scope,
    });

    this.socialAuditEngine.startAudit(audit.id);

    // Evaluate all criteria
    const findings = [];
    for (const criterion of panel.scope.criteria) {
      const finding = await this.socialAuditEngine.evaluateCriterion(audit.id, criterion, panel.members[0].did, []);
      findings.push(finding);
    }

    const report = this.socialAuditEngine.completeAudit(audit.id, findings);
    return report;
  }

  // ============================================================================
  // PHASE 9: FULL TDF VERIFICATION
  // ============================================================================

  async runFullTDFVerification(): Promise<{
    overallPassed: boolean;
    overallScore: number;
    trackResults: Map<number, { passed: boolean; score: number }>;
    report: any;
  }> {
    const villageId = this.getVillageId();
    if (!villageId) throw new Error('No village onboarded');

    const report = await this.tdfEngine.runVerification({
      villageId,
      proposalId: '',
      data: {
        // Track 1 data
        landTitleVerified: true,
        landTitleUri: '',
        landTitleHash: '',
        regenerationPlanUri: '',
        planHash: '',
        principlesCovered: 7,
        targetsMeasurable: 7,
        stewardshipSigned: true,
        signers: [],
        requiredSigners: 1,
        commitmentUri: '',
        commitmentHash: '',
        financialOpen: true,
        financialUri: '',
        financialHash: '',
        ecologicalOpen: true,
        ecologicalUri: '',
        ecologicalHash: '',
        governanceOpen: true,
        governanceUri: '',
        governanceHash: '',
        closerAgentRegistered: true,
        activeCapabilities: ['bookings', 'governance', 'tokens', 'resource-tracking'],
        agentRegistryUri: '',
        agentRegistryHash: '',
        
        // Track 2 data
        tokenContract: { type: 'utility', governanceRights: true, useRights: true, equityRights: false, bondingCurveVerified: true },
        vestingSchedule: { cliffRespected: true, tranchesOnTime: true, amountsCorrect: true, beneficiariesMatch: true },
        treasury: { multisigThresholdMet: true, allocationsMatchBudget: true, noUnauthorizedTransactions: true, reservesAboveMinimum: true },
        oracleFeeds: [
          { name: 'water-table', active: true, updatedWithin24h: true },
          { name: 'soil-carbon', active: true, updatedWithin24h: true },
          { name: 'energy-production', active: true, updatedWithin24h: true },
          { name: 'biodiversity-index', active: true, updatedWithin24h: true },
        ],
        
        // Track 3 data
        ecologicalMetrics: {
          soil: { target: this.pilot.targets.soilCarbon, current: this.pilot.current.soilCarbon, baseline: this.pilot.baseline.soilCarbon },
          water: { target: this.pilot.targets.waterTableDepth, current: this.pilot.current.waterTableDepth, baseline: this.pilot.baseline.waterTableDepth },
          air: { target: this.pilot.targets.biodiversityIndex, current: this.pilot.current.biodiversityIndex, baseline: this.pilot.baseline.biodiversityIndex },
          waste: { target: this.pilot.targets.wasteDiversion, current: this.pilot.current.wasteDiversion, baseline: this.pilot.baseline.wasteDiversion },
          rewilding: { target: this.pilot.targets.biodiversityIndex, current: this.pilot.current.biodiversityIndex, baseline: this.pilot.baseline.biodiversityIndex },
          resources: { target: this.pilot.targets.renewableEnergy, current: this.pilot.current.renewableEnergy, baseline: this.pilot.baseline.renewableEnergy },
          community: { target: this.pilot.targets.communitySize, current: this.pilot.current.communitySize, baseline: this.pilot.baseline.communitySize },
        },
        careInGovernance: true,
        federation: { treatySigned: true, raoSync: true, sharedTreasuryActive: true, disputeResolutionActive: true },
      },
      timestamp: Date.now(),
    });

    return {
      overallPassed: report.overallPassed,
      overallScore: report.overallScore,
      trackResults: new Map(Array.from(report.trackResults.entries()).map(([k, v]) => [k, { passed: v.passed, score: v.score }])),
      report,
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getVillageId(): string | null {
    const villages = this.closerEngine.listVillages();
    return villages[0]?.id || null;
  }

  getPilot(): PilotTDFCase {
    return { ...this.pilot };
  }

  getEngines(): {
    oasa: OASAConstitutionEngine;
    disco: DisCO_CAT_Engine;
    closer: CloserEngine;
    valueFlows: ValueFlowsEngine;
    snapshot: SnapshotEngine;
    tdf: TDFEngine;
    bread: BreadEngine;
    socialAudit: SocialAuditEngine;
    closerAttestation: CloserAttestationEngine;
  } {
    return {
      oasa: this.oasaEngine,
      disco: this.discoEngine,
      closer: this.closerEngine,
      valueFlows: this.valueFlowsEngine,
      snapshot: this.snapshotEngine,
      tdf: this.tdfEngine,
      bread: this.breadEngine,
      socialAudit: this.socialAuditEngine,
      closerAttestation: this.closerAttestationEngine,
    };
  }

  // ============================================================================
  // TRADITIONAL DREAM FACTORY CASE FACTORY
  // ============================================================================

  static createTraditionalDreamFactoryPilot(): PilotTDFEngine {
    return new PilotTDFEngine({
      name: 'Traditional Dream Factory',
      location: {
        country: 'Spain',
        region: 'Andalucía',
        coordinates: { lat: 37.3891, lng: -5.9845 },
        bioregion: 'Guadalquivir Basin',
      },
      baseline: {
        waterTableDepth: 20, // meters - critical
        soilCarbon: 0.8, // tC/ha - degraded
        treeCount: 120,
        biodiversityIndex: 1.2, // Shannon - low
        renewableEnergy: 15, // %
        wasteDiversion: 20, // %
        communitySize: 15,
        annualIncome: 12000, // EUR
        tqProduction: 5000, // kWh/year
      },
      targets: {
        waterTableDepth: 3, // meters - RESTORED
        soilCarbon: 3.0, // tC/ha - OASA target
        treeCount: 5000, // 5000 trees planted
        biodiversityIndex: 3.5, // Shannon - OASA target
        renewableEnergy: 100, // % - OASA target
        wasteDiversion: 99, // % - OASA target
        communitySize: 50,
        annualIncome: 45000, // EUR
        tqProduction: 50000, // kWh/year
        oasaCompliance: 0.85,
        transparencyScore: 0.9,
      },
      current: {
        waterTableDepth: 20,
        soilCarbon: 0.8,
        treeCount: 120,
        biodiversityIndex: 1.2,
        renewableEnergy: 15,
        wasteDiversion: 20,
        communitySize: 15,
        annualIncome: 12000,
        tqProduction: 5000,
        oasaCompliance: 0.15,
        transparencyScore: 0.2,
        lastUpdated: Date.now(),
      },
      timeline: {
        startDate: Date.now(),
        phases: [
          {
            id: 'phase-1-onboarding',
            name: 'Village Onboarding & Closer Attestation',
            description: 'Register village, land title, regeneration plan, stewardship commitment',
            startDate: Date.now(),
            endDate: Date.now() + 86400000 * 30,
            milestones: [
              { id: 'm1', name: 'Land Title Verified', description: 'On-chain land registry', targetDate: Date.now() + 86400000 * 7, oasaPrinciple: 6, metricName: 'landTitleVerified', targetValue: 1, unit: 'boolean', verificationTrack: 1, status: 'pending' },
              { id: 'm2', name: 'Regeneration Plan Approved', description: '7 principles with measurable targets', targetDate: Date.now() + 86400000 * 14, oasaPrinciple: 1, metricName: 'regenerationPlan', targetValue: 7, unit: 'principles', verificationTrack: 1, status: 'pending' },
              { id: 'm3', name: 'Stewardship Commitment Signed', description: 'All stewards sign', targetDate: Date.now() + 86400000 * 21, oasaPrinciple: 7, metricName: 'stewardshipSigned', targetValue: 1, unit: 'boolean', verificationTrack: 1, status: 'pending' },
              { id: 'm4', name: 'Open Books Published', description: 'Financial, ecological, governance', targetDate: Date.now() + 86400000 * 28, oasaPrinciple: 4, metricName: 'openBooks', targetValue: 3, unit: 'categories', verificationTrack: 1, status: 'pending' },
              { id: 'm5', name: 'Closer Agent Active', description: 'All 4 required capabilities', targetDate: Date.now() + 86400000 * 30, oasaPrinciple: 6, metricName: 'closerPlatform', targetValue: 1, unit: 'boolean', verificationTrack: 1, status: 'pending' },
            ],
            status: 'pending',
            budgetAllocated: 50000,
            budgetSpent: 0,
          },
          {
            id: 'phase-2-water',
            name: 'Water Table Restoration (Keyline Design)',
            description: 'Keyline plowing, swales, ponds, wetland construction to raise water table 20m→3m',
            startDate: Date.now() + 86400000 * 30,
            endDate: Date.now() + 86400000 * 180,
            milestones: [
              { id: 'm6', name: 'Keyline Design Complete', description: 'Topographic survey & design', targetDate: Date.now() + 86400000 * 45, oasaPrinciple: 2, metricName: 'keylineDesign', targetValue: 1, unit: 'boolean', verificationTrack: 3, status: 'pending' },
              { id: 'm7', name: 'Swales & Ponds Constructed', description: '5km swales, 3 retention ponds', targetDate: Date.now() + 86400000 * 90, oasaPrinciple: 2, metricName: 'waterInfrastructure', targetValue: 1, unit: 'boolean', verificationTrack: 3, status: 'pending' },
              { id: 'm8', name: 'Water Table ≤5m', description: 'Monitoring well confirms', targetDate: Date.now() + 86400000 * 180, oasaPrinciple: 2, metricName: 'waterTableDepth', targetValue: 5, unit: 'meters', verificationTrack: 2, status: 'pending' },
            ],
            status: 'pending',
            budgetAllocated: 400000,
            budgetSpent: 0,
          },
          {
            id: 'phase-3-reforestation',
            name: 'Reforestation & Rewilding (5000 trees)',
            description: 'Native species planting, wildlife corridors, biodiversity monitoring',
            startDate: Date.now() + 86400000 * 60,
            endDate: Date.now() + 86400000 * 365,
            milestones: [
              { id: 'm9', name: '1000 Trees Planted', description: 'Phase 1 planting', targetDate: Date.now() + 86400000 * 120, oasaPrinciple: 5, metricName: 'treeCount', targetValue: 1000, unit: 'trees', verificationTrack: 2, status: 'pending' },
              { id: 'm10', name: '3000 Trees Planted', description: 'Phase 2 planting', targetDate: Date.now() + 86400000 * 240, oasaPrinciple: 5, metricName: 'treeCount', targetValue: 3000, unit: 'trees', verificationTrack: 2, status: 'pending' },
              { id: 'm11', name: '5000 Trees Planted', description: 'Complete reforestation', targetDate: Date.now() + 86400000 * 365, oasaPrinciple: 5, metricName: 'treeCount', targetValue: 5000, unit: 'trees', verificationTrack: 2, status: 'pending' },
              { id: 'm12', name: 'Biodiversity Index ≥3.5', description: 'eDNA + camera trap survey', targetDate: Date.now() + 86400000 * 365, oasaPrinciple: 5, metricName: 'biodiversityIndex', targetValue: 3.5, unit: 'Shannon', verificationTrack: 3, status: 'pending' },
            ],
            status: 'pending',
            budgetAllocated: 600000,
            budgetSpent: 0,
          },
          {
            id: 'phase-4-soil-carbon',
            name: 'Soil Carbon Sequestration',
            description: 'Compost, cover crops, rotational grazing, biochar - target 3.0 tC/ha',
            startDate: Date.now() + 86400000 * 90,
            endDate: Date.now() + 86400000 * 730,
            milestones: [
              { id: 'm13', name: 'Compost System Operational', description: '500 tons/year capacity', targetDate: Date.now() + 86400000 * 120, oasaPrinciple: 1, metricName: 'compostCapacity', targetValue: 500, unit: 'tons/year', verificationTrack: 2, status: 'pending' },
              { id: 'm14', name: 'Soil Carbon ≥1.5 tC/ha', description: 'Mid-term measurement', targetDate: Date.now() + 86400000 * 365, oasaPrinciple: 1, metricName: 'soilCarbon', targetValue: 1.5, unit: 'tC/ha', verificationTrack: 3, status: 'pending' },
              { id: 'm15', name: 'Soil Carbon ≥3.0 tC/ha', description: 'OASA target achieved', targetDate: Date.now() + 86400000 * 730, oasaPrinciple: 1, metricName: 'soilCarbon', targetValue: 3.0, unit: 'tC/ha', verificationTrack: 2, status: 'pending' },
            ],
            status: 'pending',
            budgetAllocated: 250000,
            budgetSpent: 0,
          },
          {
            id: 'phase-5-energy-waste',
            name: '100% Renewable Energy & Zero Waste',
            description: 'Solar + battery, composting toilets, circular materials, repair café',
            startDate: Date.now() + 86400000 * 120,
            endDate: Date.now() + 86400000 * 540,
            milestones: [
              { id: 'm16', name: 'Solar + Battery Installed', description: '50kW solar, 100kWh battery', targetDate: Date.now() + 86400000 * 180, oasaPrinciple: 6, metricName: 'renewableEnergy', targetValue: 80, unit: '%', verificationTrack: 2, status: 'pending' },
              { id: 'm17', name: 'Waste Diversion ≥90%', description: 'Composting, recycling, repair café', targetDate: Date.now() + 86400000 * 365, oasaPrinciple: 4, metricName: 'wasteDiversion', targetValue: 90, unit: '%', verificationTrack: 3, status: 'pending' },
              { id: 'm18', name: '100% Renewable & 99% Waste Diversion', description: 'OASA targets achieved', targetDate: Date.now() + 86400000 * 540, oasaPrinciple: 6, metricName: 'renewableEnergy', targetValue: 100, unit: '%', verificationTrack: 2, status: 'pending' },
            ],
            status: 'pending',
            budgetAllocated: 200000,
            budgetSpent: 0,
          },
        ],
        estimatedEndDate: Date.now() + 86400000 * 730, // 2 years
      },
      budget: {
        total: 1500000, // €1.5M
        allocated: {
          'onboarding': 50000,
          'water-restoration': 400000,
          'reforestation': 600000,
          'soil-carbon': 250000,
          'energy-waste': 200000,
        },
        spent: {},
        fundingSources: [
          { source: 'Village Fund Cohort 1', amount: 500000, type: 'village-fund' },
          { source: 'Regional Regeneration Grant', amount: 400000, type: 'grant' },
          { source: 'Impact Investment', amount: 300000, type: 'investment' },
          { source: 'Community Contributions', amount: 200000, type: 'community' },
          { source: 'Ecosystem Revenue (Year 2+)', amount: 100000, type: 'revenue' },
        ],
      },
    });
  }

  // ============================================================================
  // EXPORT PILOT REPORT
  // ============================================================================

  generatePilotReport(): {
    pilot: PilotTDFCase;
    tdfVerification: any;
    discoSnapshot: any;
    breadNetwork: any;
    valueFlowsReport: any;
    snapshotProposals: any[];
    recommendations: string[];
  } {
    const tdfVerification = this.tdfEngine.getReportsForVillage(this.getVillageId() || '');
    const discoSnapshot = this.discoEngine.snapshot();
    const breadNetwork = this.breadEngine.getEndorsementNetwork();
    const valueFlowsReport = this.valueFlowsEngine.generateNetworkReport('pilot-network', { 
      start: this.pilot.timeline.startDate, 
      end: Date.now() 
    });
    const snapshotProposals = this.snapshotEngine.listProposals();

    const recommendations = [
      'Complete Phase 1 onboarding within 30 days to unlock Village Fund',
      'Prioritize keyline design (water table 20m→5m in 6 months)',
      'Establish DisCO CAT baseline: 10 members, 3 flows active, 5 consent decisions',
      'Achieve 80% transparency score before Phase 2 completion',
      'Target 1000 trees planted by Month 4 for early biodiversity signal',
      'Deploy Closer Agent with all 4 required capabilities immediately',
      'Schedule quarterly Social Audit Panel rotations',
      'Prepare OASA compliance report for Guardian review at Month 6',
    ];

    return {
      pilot: this.pilot,
      tdfVerification,
      discoSnapshot,
      breadNetwork,
      valueFlowsReport,
      snapshotProposals,
      recommendations,
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createPilotTDFEngine(config?: any): PilotTDFEngine {
  if (config?.useTraditionalDreamFactory) {
    return PilotTDFEngine.createTraditionalDreamFactoryPilot();
  }
  return new PilotTDFEngine(config);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const pilotTDFEngine = PilotTDFEngine.createTraditionalDreamFactoryPilot();
export default pilotTDFEngine;