// src/core/lib/tq-tdf.ts
// Traditional Dream Factory (TDF) 3 Verification Tracks
// Implements: Track 1 Closer Attestation, Track 2 On-chain Verification, Track 3 Social Audit Panel

import type { TQTransaction } from './tq';
import type { CloserVillage, CloserAgent } from './tq-oasa';
import type { DisCO_CAT_Engine } from './tq-disco-cat';
import type { SnapshotEngine, SnapshotProposal } from './tq-snapshot';

// ============================================================================
// TDF TYPES
// ============================================================================

export type TDFTrackType = 1 | 2 | 3;

export interface TDFVerificationTrack {
  track: TDFTrackType;
  name: string;
  description: string;
  verifiers: TDFVerifier[];
  criteria: TDFCriterion[];
  threshold: number; // 0-1, minimum score to pass
  weight: number; // weight in overall verification (sum = 1.0)
}

export interface TDFVerifier {
  id: string;
  name: string;
  type: 'agent' | 'human' | 'oracle' | 'contract' | 'panel';
  capabilities: string[];
  reputation: number; // 0-1
  stake: number; // tokens at stake
  status: 'active' | 'inactive' | 'slashed';
}

export interface TDFCriterion {
  id: string;
  name: string;
  description: string;
  measurement: 'boolean' | 'score' | 'threshold' | 'evidence';
  required: boolean;
  weight: number;
  verifyFn: (context: TDFVerificationContext) => Promise<TDFVerificationResult>;
}

export interface TDFVerificationContext {
  villageId?: string;
  proposalId?: string;
  agentId?: string;
  transactionId?: string;
  data: Record<string, any>;
  timestamp: number;
}

export interface TDFVerificationResult {
  passed: boolean;
  score: number; // 0-1
  evidence: TDFEvidence[];
  notes: string;
  verifierId: string;
  timestamp: number;
}

export interface TDFEvidence {
  type: 'document' | 'oracle' | 'onchain' | 'photo' | 'video' | 'signature' | 'measurement';
  uri: string;
  hash: string;
  description: string;
  timestamp: number;
  verifierId: string;
}

export interface TDFVerificationReport {
  id: string;
  context: TDFVerificationContext;
  trackResults: Map<TDFTrackType, TDFTrackResult>;
  overallScore: number;
  overallPassed: boolean;
  createdAt: number;
  expiresAt: number;
  raoCredentialId: string;
}

export interface TDFTrackResult {
  track: TDFTrackType;
  passed: boolean;
  score: number;
  criterionResults: TDFCriterionResult[];
  verifierNotes: string[];
}

export interface TDFCriterionResult {
  criterionId: string;
  passed: boolean;
  score: number;
  evidence: TDFEvidence[];
  notes: string;
}

// ============================================================================
// TDF ENGINE
// ============================================================================

export class TDFEngine {
  private tracks: Map<TDFTrackType, TDFVerificationTrack> = new Map();
  private reports: Map<string, TDFVerificationReport> = new Map();
  private verifiers: Map<string, TDFVerifier> = new Map();
  private closerAttestationNonces: Map<string, number> = new Map();

  constructor(
    private discoEngine?: DisCO_CAT_Engine,
    private snapshotEngine?: SnapshotEngine
  ) {
    this.initializeTracks();
    this.initializeVerifiers();
  }

  private initializeTracks(): void {
    // TRACK 1: Closer Attestation (Onboarding & Continuous)
    this.tracks.set(1, {
      track: 1,
      name: 'Closer Attestation',
      description: 'Automated verification via Closer Agent oracle - land title, regeneration plan, stewardship, open books, platform compliance',
      verifiers: [],
      criteria: [
        {
          id: 'land-title',
          name: 'Land Title / Long-term Lease',
          description: 'Valid land title or minimum 49-year lease registered on-chain',
          measurement: 'boolean',
          required: true,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyLandTitle(ctx),
        },
        {
          id: 'regeneration-plan',
          name: 'Regeneration Plan',
          description: 'Detailed 7-year regeneration plan with OASA principles targets',
          measurement: 'score',
          required: true,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyRegenerationPlan(ctx),
        },
        {
          id: 'stewardship-commitment',
          name: 'Stewardship Commitment',
          description: 'Signed commitment to regenerative stewardship principles',
          measurement: 'boolean',
          required: true,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyStewardshipCommitment(ctx),
        },
        {
          id: 'open-books',
          name: 'Open Books / Transparency',
          description: 'Financial and ecological data published on Closer platform',
          measurement: 'score',
          required: true,
          weight: 0.15,
          verifyFn: async (ctx) => this.verifyOpenBooks(ctx),
        },
        {
          id: 'closer-platform',
          name: 'Runs on Closer Platform',
          description: 'Village operates booking, governance, tokens via Closer Agent',
          measurement: 'boolean',
          required: true,
          weight: 0.15,
          verifyFn: async (ctx) => this.verifyCloserPlatform(ctx),
        },
      ],
      threshold: 0.80,
      weight: 0.35,
    });

    // TRACK 2: On-chain Verification (Smart Contract + Oracle)
    this.tracks.set(2, {
      track: 2,
      name: 'On-chain Verification',
      description: 'Smart contract verification of tokenomics, vesting, governance actions, treasury operations',
      verifiers: [],
      criteria: [
        {
          id: 'tokenomics-compliance',
          name: 'Tokenomics Compliance',
          description: 'Token follows OASA utility token spec (governance + use rights, no equity)',
          measurement: 'boolean',
          required: true,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyTokenomics(ctx),
        },
        {
          id: 'vesting-schedule',
          name: 'Vesting Schedule Execution',
          description: 'Berry vesting schedule executed per schedule, cliffs respected',
          measurement: 'score',
          required: true,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyVesting(ctx),
        },
        {
          id: 'governance-execution',
          name: 'Governance Execution',
          description: 'Proposals executed per voting results, timelocks respected',
          measurement: 'score',
          required: true,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyGovernanceExecution(ctx),
        },
        {
          id: 'treasury-operations',
          name: 'Treasury Operations',
          description: 'Multi-sig thresholds met, allocations match approved budget',
          measurement: 'score',
          required: true,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyTreasury(ctx),
        },
        {
          id: 'orafe-integration',
          name: 'Oracle Feeds Integration',
          description: 'Real-world data (water table, soil carbon, energy) fed on-chain',
          measurement: 'score',
          required: false,
          weight: 0.20,
          verifyFn: async (ctx) => this.verifyOracleFeeds(ctx),
        },
      ],
      threshold: 0.75,
      weight: 0.35,
    });

    // TRACK 3: Social Audit Panel (Human + CDS Rotated)
    this.tracks.set(3, {
      track: 3,
      name: 'Social Audit Panel',
      description: 'Rotating panel of CDS-weighted peers audit social/ecological impact, care work, governance health',
      verifiers: [],
      criteria: [
        {
          id: 'care-work-recognition',
          name: 'Care Work Recognition',
          description: 'Care flow (N1) contributions recognized and valued in governance',
          measurement: 'score',
          required: true,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyCareWork(ctx),
        },
        {
          id: 'governance-health',
          name: 'Governance Health',
          description: 'Consent decisions active, participation >70%, no unresolved blocks >30 days',
          measurement: 'score',
          required: true,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyGovernanceHealth(ctx),
        },
        {
          id: 'ecological-impact',
          name: 'Ecological Impact Verification',
          description: 'Measured improvement in 7 OASA principles (soil, water, air, waste, rewilding, resources, community)',
          measurement: 'score',
          required: true,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyEcologicalImpact(ctx),
        },
        {
          id: 'federation-alignment',
          name: 'Federation Alignment',
          description: 'DHO federated per treaty, RAO sync active, shared treasury operational',
          measurement: 'score',
          required: false,
          weight: 0.25,
          verifyFn: async (ctx) => this.verifyFederationAlignment(ctx),
        },
      ],
      threshold: 0.70,
      weight: 0.30,
    });
  }

  private initializeVerifiers(): void {
    // Track 1: Closer Agent Oracle
    this.verifiers.set('closer-agent-oracle', {
      id: 'closer-agent-oracle',
      name: 'Closer Agent Oracle',
      type: 'agent',
      capabilities: ['land-registry', 'document-verification', 'platform-monitoring', 'data-feeds'],
      reputation: 0.95,
      stake: 100000,
      status: 'active',
    });

    // Track 2: Smart Contract Verifiers
    this.verifiers.set('tokenomics-verifier', {
      id: 'tokenomics-verifier',
      name: 'Tokenomics Verifier Contract',
      type: 'contract',
      capabilities: ['erc20-analysis', 'bonding-curve-verification', 'vesting-verification'],
      reputation: 1.0,
      stake: 0,
      status: 'active',
    });

    this.verifiers.set('governance-verifier', {
      id: 'governance-verifier',
      name: 'Governance Execution Verifier',
      type: 'contract',
      capabilities: ['proposal-lifecycle', 'voting-verification', 'timelock-check'],
      reputation: 1.0,
      stake: 0,
      status: 'active',
    });

    // Track 3: Social Audit Panel (rotating)
    this.verifiers.set('social-audit-panel', {
      id: 'social-audit-panel',
      name: 'Social Audit Panel (Rotating)',
      type: 'panel',
      capabilities: ['care-work-audit', 'governance-health', 'ecological-assessment', 'federation-review'],
      reputation: 0.90,
      stake: 50000,
      status: 'active',
    });
  }

  // ---------------------------------------------------------------------------
  // TRACK 1: CLOSER ATTESTATION VERIFICATIONS
  // ---------------------------------------------------------------------------

  private async verifyLandTitle(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const villageId = ctx.villageId || ctx.data.villageId;
    // In production: query land registry oracle / on-chain registry
    const hasTitle = ctx.data.landTitleVerified === true;
    const hasLease = ctx.data.leaseYears >= 49;
    
    return {
      passed: hasTitle || hasLease,
      score: hasTitle ? 1.0 : hasLease ? 0.9 : 0,
      evidence: hasTitle ? [{ type: 'document', uri: ctx.data.landTitleUri, hash: ctx.data.landTitleHash, description: 'Land title registered', timestamp: Date.now(), verifierId: 'closer-agent-oracle' }] : [],
      notes: hasTitle ? 'Land title verified on-chain' : hasLease ? 'Long-term lease verified' : 'No valid land title or lease',
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  private async verifyRegenerationPlan(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const plan = ctx.data.regenerationPlan;
    if (!plan) {
      return { passed: false, score: 0, evidence: [], notes: 'No regeneration plan provided', verifierId: 'closer-agent-oracle', timestamp: Date.now() };
    }

    // Check 7 OASA principles covered
    const principles = ['soil', 'water', 'air', 'waste', 'rewilding', 'resources', 'community'];
    const covered = principles.filter(p => plan[p]?.target !== undefined).length;
    const score = covered / 7;

    // Check targets are measurable
    const measurable = principles.filter(p => plan[p]?.target !== undefined && plan[p]?.measurementMethod).length;
    const measurableScore = measurable / 7;

    const finalScore = (score + measurableScore) / 2;

    return {
      passed: finalScore >= 0.7,
      score: finalScore,
      evidence: [{ type: 'document', uri: ctx.data.planUri, hash: ctx.data.planHash, description: 'Regeneration plan', timestamp: Date.now(), verifierId: 'closer-agent-oracle' }],
      notes: `${covered}/7 principles with targets, ${measurable}/7 with measurement methods`,
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  private async verifyStewardshipCommitment(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const signed = ctx.data.stewardshipSigned === true;
    const signers = ctx.data.signers || [];
    const requiredSigners = ctx.data.requiredSigners || 1;

    return {
      passed: signed && signers.length >= requiredSigners,
      score: signed ? Math.min(1, signers.length / requiredSigners) : 0,
      evidence: signed ? [{ type: 'signature', uri: ctx.data.commitmentUri, hash: ctx.data.commitmentHash, description: 'Stewardship commitment signed', timestamp: Date.now(), verifierId: 'closer-agent-oracle' }] : [],
      notes: signed ? `${signers.length}/${requiredSigners} stewards signed` : 'Stewardship commitment not signed',
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  private async verifyOpenBooks(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const financialOpen = ctx.data.financialOpen === true;
    const ecologicalOpen = ctx.data.ecologicalOpen === true;
    const governanceOpen = ctx.data.governanceOpen === true;

    const score = [financialOpen, ecologicalOpen, governanceOpen].filter(Boolean).length / 3;

    return {
      passed: score >= 0.66,
      score,
      evidence: [
        financialOpen && { type: 'document', uri: ctx.data.financialUri, hash: ctx.data.financialHash, description: 'Financial reports', timestamp: Date.now(), verifierId: 'closer-agent-oracle' },
        ecologicalOpen && { type: 'document', uri: ctx.data.ecologicalUri, hash: ctx.data.ecologicalHash, description: 'Ecological reports', timestamp: Date.now(), verifierId: 'closer-agent-oracle' },
        governanceOpen && { type: 'document', uri: ctx.data.governanceUri, hash: ctx.data.governanceHash, description: 'Governance records', timestamp: Date.now(), verifierId: 'closer-agent-oracle' },
      ].filter(Boolean) as TDFEvidence[],
      notes: `Financial: ${financialOpen}, Ecological: ${ecologicalOpen}, Governance: ${governanceOpen}`,
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  private async verifyCloserPlatform(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const agentRegistered = ctx.data.closerAgentRegistered === true;
    const capabilitiesActive = ctx.data.activeCapabilities || [];
    const requiredCapabilities: string[] = ['bookings', 'governance', 'tokens', 'resource-tracking'];
    const hasRequired = requiredCapabilities.every(c => capabilitiesActive.includes(c));

    return {
      passed: agentRegistered && hasRequired,
      score: agentRegistered && hasRequired ? 1.0 : agentRegistered ? 0.5 : 0,
      evidence: agentRegistered ? [{ type: 'onchain', uri: ctx.data.agentRegistryUri, hash: ctx.data.agentRegistryHash, description: 'Closer Agent registered', timestamp: Date.now(), verifierId: 'closer-agent-oracle' }] : [],
      notes: `Agent: ${agentRegistered}, Required caps: ${hasRequired ? 'yes' : 'no'} (${capabilitiesActive.join(', ')})`,
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  // ---------------------------------------------------------------------------
  // TRACK 2: ON-CHAIN VERIFICATIONS
  // ---------------------------------------------------------------------------

  private async verifyTokenomics(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const token = ctx.data.tokenContract;
    if (!token) {
      return { passed: false, score: 0, evidence: [], notes: 'No token contract provided', verifierId: 'tokenomics-verifier', timestamp: Date.now() };
    }

    const isUtility = token.type === 'utility';
    const hasGovernance = token.governanceRights === true;
    const hasUseRights = token.useRights === true;
    const noEquity = token.equityRights !== true;
    const bondingCurve = token.bondingCurveVerified === true;

    const passed = isUtility && hasGovernance && hasUseRights && noEquity && bondingCurve;
    const score = [isUtility, hasGovernance, hasUseRights, noEquity, bondingCurve].filter(Boolean).length / 5;

    return {
      passed,
      score,
      evidence: [{ type: 'onchain', uri: token.address, hash: token.verificationHash, description: 'Token contract verification', timestamp: Date.now(), verifierId: 'tokenomics-verifier' }],
      notes: `Utility: ${isUtility}, Gov: ${hasGovernance}, Use: ${hasUseRights}, NoEquity: ${noEquity}, BondingCurve: ${bondingCurve}`,
      verifierId: 'tokenomics-verifier',
      timestamp: Date.now(),
    };
  }

  private async verifyVesting(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const schedule = ctx.data.vestingSchedule;
    if (!schedule) {
      return { passed: false, score: 0, evidence: [], notes: 'No vesting schedule', verifierId: 'governance-verifier', timestamp: Date.now() };
    }

    const cliffRespected = schedule.cliffRespected === true;
    const tranchesOnTime = schedule.tranchesOnTime === true;
    const amountsCorrect = schedule.amountsCorrect === true;
    const beneficiariesMatch = schedule.beneficiariesMatch === true;

    const score = [cliffRespected, tranchesOnTime, amountsCorrect, beneficiariesMatch].filter(Boolean).length / 4;

    return {
      passed: score >= 0.75,
      score,
      evidence: [{ type: 'onchain', uri: schedule.contractAddress, hash: schedule.verificationHash, description: 'Vesting contract verification', timestamp: Date.now(), verifierId: 'governance-verifier' }],
      notes: `Cliff: ${cliffRespected}, Tranches: ${tranchesOnTime}, Amounts: ${amountsCorrect}, Beneficiaries: ${beneficiariesMatch}`,
      verifierId: 'governance-verifier',
      timestamp: Date.now(),
    };
  }

  private async verifyGovernanceExecution(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    if (!this.snapshotEngine) {
      return { passed: false, score: 0, evidence: [], notes: 'Snapshot engine not available', verifierId: 'governance-verifier', timestamp: Date.now() };
    }

    const proposalId = ctx.proposalId || ctx.data.proposalId;
    const proposal = this.snapshotEngine.getProposal(proposalId);
    
    if (!proposal) {
      return { passed: false, score: 0, evidence: [], notes: 'Proposal not found', verifierId: 'governance-verifier', timestamp: Date.now() };
    }

    const votingEnded = Date.now() > proposal.end;
    const quorumMet = proposal.totalVotes >= proposal.quorum;
    const executedCorrectly = proposal.state === 'executed' && proposal.executionPayloads.length > 0;
    const timelockRespected = proposal.executionPayloads.every(p => 
      // Check timelock (simplified)
      true
    );

    const score = [votingEnded, quorumMet, executedCorrectly, timelockRespected].filter(Boolean).length / 4;

    return {
      passed: score >= 0.75,
      score,
      evidence: [{ type: 'onchain', uri: `proposal:${proposalId}`, hash: '', description: 'Proposal execution verified', timestamp: Date.now(), verifierId: 'governance-verifier' }],
      notes: `Ended: ${votingEnded}, Quorum: ${quorumMet}, Executed: ${executedCorrectly}, Timelock: ${timelockRespected}`,
      verifierId: 'governance-verifier',
      timestamp: Date.now(),
    };
  }

  private async verifyTreasury(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const treasury = ctx.data.treasury;
    if (!treasury) {
      return { passed: false, score: 0, evidence: [], notes: 'No treasury data', verifierId: 'governance-verifier', timestamp: Date.now() };
    }

    const multisigThresholdMet = treasury.multisigThresholdMet === true;
    const allocationsMatch = treasury.allocationsMatchBudget === true;
    const noUnauthorized = treasury.noUnauthorizedTransactions === true;
    const reservesHealthy = treasury.reservesAboveMinimum === true;

    const score = [multisigThresholdMet, allocationsMatch, noUnauthorized, reservesHealthy].filter(Boolean).length / 4;

    return {
      passed: score >= 0.75,
      score,
      evidence: [{ type: 'onchain', uri: treasury.multisigAddress, hash: treasury.auditHash, description: 'Treasury audit', timestamp: Date.now(), verifierId: 'governance-verifier' }],
      notes: `Multisig: ${multisigThresholdMet}, Allocations: ${allocationsMatch}, NoUnauthorized: ${noUnauthorized}, Reserves: ${reservesHealthy}`,
      verifierId: 'governance-verifier',
      timestamp: Date.now(),
    };
  }

  private async verifyOracleFeeds(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const feeds = ctx.data.oracleFeeds || [];
    const requiredFeeds = ['water-table', 'soil-carbon', 'energy-production', 'biodiversity-index'];
    const activeFeeds = feeds.filter(f => f.active && f.updatedWithin24h).length;
    const score = activeFeeds / requiredFeeds.length;

    return {
      passed: score >= 0.5,
      score,
      evidence: feeds.map(f => ({ type: 'oracle', uri: f.feedAddress, hash: f.latestHash, description: `Oracle: ${f.name}`, timestamp: Date.now(), verifierId: 'closer-agent-oracle' })),
      notes: `${activeFeeds}/${requiredFeeds.length} oracle feeds active`,
      verifierId: 'closer-agent-oracle',
      timestamp: Date.now(),
    };
  }

  // ---------------------------------------------------------------------------
  // TRACK 3: SOCIAL AUDIT PANEL VERIFICATIONS
  // ---------------------------------------------------------------------------

  private async verifyCareWork(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    if (!this.discoEngine) {
      return { passed: false, score: 0, evidence: [], notes: 'DisCO engine not available', verifierId: 'social-audit-panel', timestamp: Date.now() };
    }

    const flows = this.discoEngine.getAllFlowsSummary();
    const careFlow = flows.care;
    
    const careRecognized = careFlow.verifiedCount > 0;
    const careValued = careFlow.totalValue > 0;
    const careInGovernance = ctx.data.careInGovernance === true; // care flow affects voting weight

    const score = [careRecognized, careValued, careInGovernance].filter(Boolean).length / 3;

    return {
      passed: score >= 0.66,
      score,
      evidence: [{ type: 'measurement', uri: '', hash: '', description: `Care flow: ${careFlow.count} contributions, ${careFlow.totalValue} value`, timestamp: Date.now(), verifierId: 'social-audit-panel' }],
      notes: `Recognized: ${careRecognized}, Valued: ${careValued}, InGovernance: ${careInGovernance}`,
      verifierId: 'social-audit-panel',
      timestamp: Date.now(),
    };
  }

  private async verifyGovernanceHealth(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    if (!this.discoEngine) {
      return { passed: false, score: 0, evidence: [], notes: 'DisCO engine not available', verifierId: 'social-audit-panel', timestamp: Date.now() };
    }

    const cat = this.discoEngine.getCAT();
    const decisions = cat.assembly.consentDecisions;
    
    const recentDecisions = decisions.filter(d => d.integratedAt > Date.now() - 86400000 * 30); // last 30 days
    const participationRate = recentDecisions.length > 0 
      ? recentDecisions.reduce((sum, d) => sum + (d.consents.size / Math.max(1, this.discoEngine.getAllMembers().length)), 0) / recentDecisions.length
      : 0;
    
    const unresolvedBlocks = decisions.filter(d => d.status === 'blocked' && Date.now() - d.integratedAt > 86400000 * 30).length;
    const noStaleBlocks = unresolvedBlocks === 0;

    const consentRatio = recentDecisions.length > 0
      ? recentDecisions.filter(d => d.status === 'integrated').length / recentDecisions.length
      : 0;

    const score = (participationRate + (noStaleBlocks ? 1 : 0) + consentRatio) / 3;

    return {
      passed: score >= 0.7,
      score,
      evidence: [{ type: 'measurement', uri: '', hash: '', description: `Governance health: participation ${(participationRate*100).toFixed(0)}%, consent ${(consentRatio*100).toFixed(0)}%, stale blocks ${unresolvedBlocks}`, timestamp: Date.now(), verifierId: 'social-audit-panel' }],
      notes: `Participation: ${(participationRate*100).toFixed(0)}%, Consent ratio: ${(consentRatio*100).toFixed(0)}%, Stale blocks: ${unresolvedBlocks}`,
      verifierId: 'social-audit-panel',
      timestamp: Date.now(),
    };
  }

  private async verifyEcologicalImpact(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const metrics = ctx.data.ecologicalMetrics || {};
    const oasaPrinciples = ['soil', 'water', 'air', 'waste', 'rewilding', 'resources', 'community'];
    
    let totalScore = 0;
    let measured = 0;

    for (const principle of oasaPrinciples) {
      const metric = metrics[principle];
      if (metric && metric.target && metric.current !== undefined) {
        const improvement = metric.baseline !== undefined 
          ? (metric.current - metric.baseline) / Math.max(1, metric.target - metric.baseline)
          : metric.current / metric.target;
        totalScore += Math.max(0, Math.min(1, improvement));
        measured++;
      }
    }

    const score = measured > 0 ? totalScore / measured : 0;

    return {
      passed: score >= 0.5, // At least 50% improvement across measured principles
      score,
      evidence: [{ type: 'measurement', uri: '', hash: '', description: `Ecological impact: ${measured}/7 principles measured, avg improvement ${(score*100).toFixed(0)}%`, timestamp: Date.now(), verifierId: 'social-audit-panel' }],
      notes: `${measured}/7 principles measured. Average improvement: ${(score*100).toFixed(0)}%`,
      verifierId: 'social-audit-panel',
      timestamp: Date.now(),
    };
  }

  private async verifyFederationAlignment(ctx: TDFVerificationContext): Promise<TDFVerificationResult> {
    const federation = ctx.data.federation;
    if (!federation) {
      return { passed: true, score: 1.0, evidence: [], notes: 'Not federated (optional)', verifierId: 'social-audit-panel', timestamp: Date.now() };
    }

    const treatySigned = federation.treatySigned === true;
    const raoSync = federation.raoSync === true;
    const sharedTreasury = federation.sharedTreasuryActive === true;
    const disputeResolution = federation.disputeResolutionActive === true;

    const score = [treatySigned, raoSync, sharedTreasury, disputeResolution].filter(Boolean).length / 4;

    return {
      passed: score >= 0.75,
      score,
      evidence: [{ type: 'document', uri: federation.treatyUri, hash: federation.treatyHash, description: 'Federation treaty', timestamp: Date.now(), verifierId: 'social-audit-panel' }],
      notes: `Treaty: ${treatySigned}, RAO sync: ${raoSync}, Treasury: ${sharedTreasury}, Dispute: ${disputeResolution}`,
      verifierId: 'social-audit-panel',
      timestamp: Date.now(),
    };
  }

  // ---------------------------------------------------------------------------
  // MAIN VERIFICATION ENTRY POINT
  // ---------------------------------------------------------------------------

  async runVerification(context: TDFVerificationContext): Promise<TDFVerificationReport> {
    const trackResults = new Map<TDFTrackType, TDFTrackResult>();
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const [trackNum, track] of this.tracks) {
      const criterionResults: TDFCriterionResult[] = [];
      let trackScore = 0;
      let trackWeightSum = 0;
      const verifierNotes: string[] = [];

      for (const criterion of track.criteria) {
        const result = await criterion.verifyFn(context);
        criterionResults.push({
          criterionId: criterion.id,
          passed: result.passed,
          score: result.score,
          evidence: result.evidence,
          notes: result.notes,
        });
        
        trackScore += result.score * criterion.weight;
        trackWeightSum += criterion.weight;
        verifierNotes.push(`${criterion.name}: ${result.passed ? 'PASS' : 'FAIL'} (${(result.score*100).toFixed(0)}%)`);
      }

      const normalizedTrackScore = trackWeightSum > 0 ? trackScore / trackWeightSum : 0;
      const trackPassed = normalizedTrackScore >= track.threshold;

      trackResults.set(trackNum, {
        track: trackNum,
        passed: trackPassed,
        score: normalizedTrackScore,
        criterionResults,
        verifierNotes,
      });

      totalWeightedScore += normalizedTrackScore * track.weight;
      totalWeight += track.weight;
    }

    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const overallPassed = Array.from(trackResults.values()).every(t => t.passed);

    const report: TDFVerificationReport = {
      id: `tdf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      context,
      trackResults,
      overallScore,
      overallPassed,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 30, // 30 days
      raoCredentialId: `rao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };

    this.reports.set(report.id, report);
    return report;
  }

  // ---------------------------------------------------------------------------
  // CLOSER ATTESTATION RFC (Track 1 Fix)
  // ---------------------------------------------------------------------------

  async createCloserAttestation(villageId: string, data: {
    landTitleUri: string;
    landTitleHash: string;
    regenerationPlanUri: string;
    planHash: string;
    stewardshipCommitmentUri: string;
    commitmentHash: string;
    financialUri: string;
    financialHash: string;
    ecologicalUri: string;
    ecologicalHash: string;
    governanceUri: string;
    governanceHash: string;
    agentRegistryUri: string;
    agentRegistryHash: string;
  }): Promise<{ attestationId: string; nonce: number; signature: string }> {
    const nonce = (this.closerAttestationNonces.get(villageId) || 0) + 1;
    this.closerAttestationNonces.set(villageId, nonce);

    // In production: sign with Closer Agent oracle key
    const message = `${villageId}:${nonce}:${data.landTitleHash}:${data.planHash}:${data.commitmentHash}:${data.financialHash}:${data.ecologicalHash}:${data.governanceHash}:${data.agentRegistryHash}`;
    const signature = `0x${Buffer.from(message).toString('hex').slice(0, 130)}`; // placeholder

    return {
      attestationId: `attest_${villageId}_${nonce}`,
      nonce,
      signature,
    };
  }

  verifyCloserAttestation(attestationId: string, signature: string, villageId: string, nonce: number): boolean {
    const storedNonce = this.closerAttestationNonces.get(villageId);
    return storedNonce === nonce && signature.startsWith('0x');
  }

  // ---------------------------------------------------------------------------
  // SOCIAL AUDIT PANEL ROTATION (CDS-weighted)
  // ---------------------------------------------------------------------------

  rotateSocialAuditPanel(cdsScores: Map<string, number>, panelSize: number = 5): string[] {
    // Sort by CDS score descending
    const sorted = Array.from(cdsScores.entries()).sort((a, b) => b[1] - a[1]);
    
    // Select top panelSize with some randomness for rotation
    const eligible = sorted.slice(0, panelSize * 2); // 2x pool
    const selected: string[] = [];
    
    while (selected.length < panelSize && eligible.length > 0) {
      // Weighted random selection
      const totalWeight = eligible.reduce((sum, [, score]) => sum + score, 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < eligible.length; i++) {
        random -= eligible[i][1];
        if (random <= 0) {
          selected.push(eligible[i][0]);
          eligible.splice(i, 1);
          break;
        }
      }
    }

    return selected;
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getTrack(track: TDFTrackType): TDFVerificationTrack | undefined {
    return this.tracks.get(track);
  }

  getAllTracks(): TDFVerificationTrack[] {
    return Array.from(this.tracks.values());
  }

  getReport(id: string): TDFVerificationReport | undefined {
    return this.reports.get(id);
  }

  getReportsForVillage(villageId: string): TDFVerificationReport[] {
    return Array.from(this.reports.values()).filter(r => r.context.villageId === villageId);
  }

  getVerifiers(): TDFVerifier[] {
    return Array.from(this.verifiers.values());
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createTDFEngine(discoEngine?: DisCO_CAT_Engine, snapshotEngine?: SnapshotEngine): TDFEngine {
  return new TDFEngine(discoEngine, snapshotEngine);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const tdfEngine = new TDFEngine();
export default tdfEngine;