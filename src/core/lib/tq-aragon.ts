// src/core/lib/tq-aragon.ts
// Aragon OSx Integration: Governance, Tokenomics, AGPs, OTF Framework
// Implements: OSx Modules, Governance, Tokenomics (bonding curves, vesting, emissions), Plugins, AGP Process, OTF

import type {
  AragonOSx,
  AragonModule,
  AragonPermission,
  AragonGovernance,
  AragonTokenomics,
  AragonBondingCurve,
  AragonVesting,
  AragonVestingTranche,
  AragonEmissions,
  AragonUtility,
  AragonPlugin,
  AGP_Process,
  AGP_Vote,
  AGP_EditorialReview,
  AGP_BoardReview,
  AragonOTF,
  OTFEvaluationFramework,
  OTFOwnershipRight,
  OTFValueAccrual,
  OTFEvidenceStandard,
  CoopDAO,
  CoopMember,
  CoopGovernance,
  CoopTreasury,
  CoopAsset,
  CoopBudget,
  CoopIncome,
  CoopExpense,
  CoopAllocation,
  CoopLegalStructure,
} from './tq-types-extended';

import type { TQTransaction } from './tq';
import { OASAConstitutionEngine } from './tq-oasa';

// ============================================================================
// ARAGON OSX ENGINE
// ============================================================================

export class AragonOSxEngine {
  private osx: AragonOSx;
  private agps: Map<string, AGP_Process> = new Map();
  private otf: AragonOTF | null = null;
  private coopDaos: Map<string, CoopDAO> = new Map();

  constructor() {
    this.osx = this.createDefaultOSx();
  }

  private createDefaultOSx(): AragonOSx {
    return {
      version: '1.0.0',
      modules: this.createCoreModules(),
      governance: this.createDefaultGovernance(),
      tokenomics: this.createDefaultTokenomics(),
      plugins: this.createCorePlugins(),
    };
  }

  private createCoreModules(): AragonModule[] {
    return [
      {
        name: 'token-manager',
        version: '1.0.0',
        permissions: [
          { role: 'token-holder', action: 'vote', resource: 'governance' },
          { role: 'token-holder', action: 'stake', resource: 'token' },
          { role: 'admin', action: 'mint', resource: 'token', conditions: { maxSupply: 1_000_000_000 } },
          { role: 'admin', action: 'burn', resource: 'token' },
        ],
        dependencies: ['voting', 'treasury'],
      },
      {
        name: 'voting',
        version: '1.0.0',
        permissions: [
          { role: 'token-holder', action: 'create-proposal', resource: 'governance', conditions: { minTokens: 1000 } },
          { role: 'token-holder', action: 'vote', resource: 'proposal' },
          { role: 'guardian', action: 'veto', resource: 'proposal', conditions: { category: 'ecological' } },
        ],
        dependencies: ['token-manager'],
      },
      {
        name: 'treasury',
        version: '1.0.0',
        permissions: [
          { role: 'multisig-signer', action: 'execute', resource: 'payment', conditions: { threshold: 3, maxAmount: 100000 } },
          { role: 'governance', action: 'allocate', resource: 'budget' },
        ],
        dependencies: ['token-manager', 'voting'],
      },
      {
        name: 'vesting',
        version: '1.0.0',
        permissions: [
          { role: 'beneficiary', action: 'claim', resource: 'vesting' },
          { role: 'admin', action: 'create-schedule', resource: 'vesting' },
        ],
        dependencies: ['token-manager'],
      },
      {
        name: 'reputation',
        version: '1.0.0',
        permissions: [
          { role: 'member', action: 'claim', resource: 'reputation' },
          { role: 'evaluator', action: 'verify', resource: 'reputation' },
        ],
        dependencies: ['token-manager'],
      },
      {
        name: 'dispute-resolution',
        version: '1.0.0',
        permissions: [
          { role: 'party', action: 'raise', resource: 'dispute' },
          { role: 'mediator', action: 'mediate', resource: 'dispute' },
          { role: 'arbitrator', action: 'decide', resource: 'dispute' },
        ],
        dependencies: ['governance', 'treasury'],
      },
    ];
  }

  private createDefaultGovernance(): AragonGovernance {
    return {
      type: 'holographic', // Holographic Consensus (DAO + off-chain signaling)
      parameters: {
        proposalThreshold: 1000, // min tokens to propose
        votingPeriod: 604800000, // 7 days in ms
        quorum: 0.10, // 10% token supply
        majorityThreshold: 0.51,
        holographicConsensus: {
          predictorStake: 10000,
          predictorReward: 0.1,
          challengerStake: 50000,
        },
        consentThreshold: 0.80, // For OASA-aligned decisions
        guardianVeto: true,
      },
      plugins: ['voting', 'holographic-consensus', 'dispute-resolution'],
    };
  }

  private createDefaultTokenomics(): AragonTokenomics {
    return {
      tokenAddress: '0x0000000000000000000000000000000000000000', // To be deployed
      bondingCurve: {
        type: 'sigmoid',
        parameters: { reserveRatio: 0.1, steepness: 10, midpoint: 0.5 },
        reserveToken: 'USDC',
      },
      vesting: {
        schedule: [],
        beneficiary: '',
        cliff: 86400000 * 365, // 1 year
        revocable: false,
      },
      emissions: {
        rate: 0.05, // 5% annual
        schedule: 'continuous',
        recipients: ['ecosystem-fund', 'staking-rewards', 'development'],
      },
      utility: {
        governance: true,
        staking: true,
        fees: true,
        access: true,
        payments: true,
      },
    };
  }

  private createCorePlugins(): AragonPlugin[] {
    return [
      { name: 'holographic-consensus', type: 'governance', config: { enabled: true }, dependencies: ['voting'] },
      { name: 'conviction-voting', type: 'governance', config: { enabled: true, decay: 0.95 }, dependencies: ['voting'] },
      { name: 'multisig-treasury', type: 'treasury', config: { signers: [], threshold: 3 }, dependencies: ['treasury'] },
      { name: 'token-vesting', type: 'tokenomics', config: { schedules: [] }, dependencies: ['token-manager', 'vesting'] },
      { name: 'reputation-weighted', type: 'governance', config: { enabled: true }, dependencies: ['reputation', 'voting'] },
      { name: 'oasa-compliance', type: 'custom', config: { principles: 7, guardians: true }, dependencies: ['governance', 'dispute-resolution'] },
    ];
  }

  // ---------------------------------------------------------------------------
  // AGP PROCESS (Aragon Governance Proposals)
  // ---------------------------------------------------------------------------

  createAGP(
    author: string,
    title: string,
    description: string,
    category: AGP_Process['category']
  ): AGP_Process {
    const agp: AGP_Process = {
      id: `agp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title,
      author,
      status: 'draft',
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      votes: [],
      editorialReview: { reviewer: '', status: 'pending', comments: '', reviewedAt: 0 },
      boardReview: { reviewer: '', status: 'pending', comments: '', reviewedAt: 0 },
    };
    this.agps.set(agp.id, agp);
    return agp;
  }

  submitAGPForReview(agpId: string): boolean {
    const agp = this.agps.get(agpId);
    if (!agp || agp.status !== 'draft') return false;
    agp.status = 'review';
    agp.updatedAt = Date.now();
    return true;
  }

  voteOnAGP(agpId: string, voter: string, choice: 'yes' | 'no' | 'abstain', weight: number, signature: string): boolean {
    const agp = this.agps.get(agpId);
    if (!agp || agp.status !== 'vote') return false;

    agp.votes.push({ voter, choice, weight, timestamp: Date.now(), signature });
    agp.updatedAt = Date.now();
    return true;
  }

  finalizeAGP(agpId: string): { passed: boolean; yesWeight: number; noWeight: number; abstainWeight: number } | null {
    const agp = this.agps.get(agpId);
    if (!agp || agp.status !== 'vote') return null;

    let yesWeight = 0, noWeight = 0, abstainWeight = 0;
    for (const vote of agp.votes) {
      if (vote.choice === 'yes') yesWeight += vote.weight;
      else if (vote.choice === 'no') noWeight += vote.weight;
      else abstainWeight += vote.weight;
    }

    const totalWeight = yesWeight + noWeight + abstainWeight;
    const passed = totalWeight > 0 && (yesWeight / totalWeight) >= this.osx.governance.parameters.majorityThreshold;

    agp.status = passed ? 'approved' : 'rejected';
    agp.updatedAt = Date.now();

    return { passed, yesWeight, noWeight, abstainWeight };
  }

  getAGP(id: string): AGP_Process | undefined {
    return this.agps.get(id);
  }

  listAGPs(filters?: { status?: AGP_Process['status']; category?: AGP_Process['category'] }): AGP_Process[] {
    let result = Array.from(this.agps.values());
    if (filters?.status) result = result.filter(a => a.status === filters.status);
    if (filters?.category) result = result.filter(a => a.category === filters.category);
    return result;
  }

  // ---------------------------------------------------------------------------
  // OTF (OWNERSHIP TOKEN FRAMEWORK)
  // ---------------------------------------------------------------------------

  initializeOTF(): AragonOTF {
    this.otf = {
      version: '1.0.0',
      framework: 'ownership-token-framework',
      criteria: {
        enforceableOwnership: true,
        valueAccrual: true,
        verifiableEvidence: true,
      },
      tokenTypes: {
        ownership: true,
        utility: true,
        governance: true,
        hybrid: true,
      },
      evaluationFramework: this.createOTFEvaluationFramework(),
    };
    return this.otf;
  }

  private createOTFEvaluationFramework(): OTFEvaluationFramework {
    return {
      ownershipRights: [
        { right: 'Governance participation', enforceable: true, jurisdiction: 'on-chain', evidenceRequired: ['token balance', 'vote receipt'] },
        { right: 'Revenue share', enforceable: true, jurisdiction: 'hybrid', evidenceRequired: ['treasury report', 'distribution tx'] },
        { right: 'Asset claim on dissolution', enforceable: true, jurisdiction: 'legal', evidenceRequired: ['legal wrapper', 'court order'] },
        { right: 'Information access', enforceable: true, jurisdiction: 'on-chain', evidenceRequired: ['transparent ledger', 'API access'] },
      ],
      valueAccrualMechanisms: [
        { mechanism: 'Buyback & burn', description: 'Protocol fees used to buy back tokens', measurable: true, metrics: ['buyback volume', 'burn rate'] },
        { mechanism: 'Staking yield', description: 'Token holders stake for protocol revenue share', measurable: true, metrics: ['APY', 'staked ratio'] },
        { mechanism: 'Fee discounts', description: 'Token holders pay reduced protocol fees', measurable: true, metrics: ['fee savings', 'holder count'] },
        { mechanism: 'Governance value', description: 'Token = voting power over protocol direction', measurable: true, metrics: ['proposals passed', 'voter turnout'] },
      ],
      evidenceStandards: [
        { standard: 'On-chain verification', description: 'All token operations verifiable on-chain', verificationMethod: 'onchain', auditorRequired: false },
        { standard: 'Off-chain audit', description: 'Legal/financial audits for real-world assets', verificationMethod: 'offchain', auditorRequired: true },
        { standard: 'Hybrid attestation', description: 'Combined on-chain + off-chain evidence', verificationMethod: 'hybrid', auditorRequired: true },
      ],
    };
  }

  evaluateTokenAgainstOTF(tokenData: {
    tokenType: 'ownership' | 'utility' | 'governance' | 'hybrid';
    enforceableRights: string[];
    valueAccrual: string[];
    evidence: string[];
  }): { compliant: boolean; score: number; gaps: string[] } {
    if (!this.otf) this.initializeOTF();
    const framework = this.otf!.evaluationFramework;
    const gaps: string[] = [];
    let score = 0;
    let maxScore = 0;

    // Check ownership rights
    for (const right of framework.ownershipRights) {
      maxScore++;
      if (tokenData.enforceableRights.includes(right.right)) {
        score++;
      } else {
        gaps.push(`Missing enforceable right: ${right.right}`);
      }
    }

    // Check value accrual
    for (const mechanism of framework.valueAccrualMechanisms) {
      maxScore++;
      if (tokenData.valueAccrual.includes(mechanism.mechanism)) {
        score++;
      } else {
        gaps.push(`Missing value accrual: ${mechanism.mechanism}`);
      }
    }

    // Check evidence
    for (const standard of framework.evidenceStandards) {
      maxScore++;
      const hasEvidence = tokenData.evidence.some(e => 
        standard.verificationMethod === 'onchain' && e.includes('on-chain') ||
        standard.verificationMethod === 'offchain' && e.includes('audit') ||
        standard.verificationMethod === 'hybrid' && (e.includes('on-chain') || e.includes('audit'))
      );
      if (hasEvidence) {
        score++;
      } else {
        gaps.push(`Missing evidence standard: ${standard.standard}`);
      }
    }

    return { compliant: gaps.length === 0, score: maxScore > 0 ? score / maxScore : 0, gaps };
  }

  getOTF(): AragonOTF | null {
    return this.otf;
  }

  // ---------------------------------------------------------------------------
  // COOP DAO INTEGRATION
  // ---------------------------------------------------------------------------

  createCoopDAO(coop: Omit<CoopDAO, 'members' | 'governance' | 'treasury' | 'legalStructure'> & { 
    members?: CoopMember[];
    governance?: CoopGovernance;
    treasury?: CoopTreasury;
    legalStructure?: CoopLegalStructure;
  }): CoopDAO {
    const newCoop: CoopDAO = {
      ...coop,
      members: coop.members || [],
      governance: coop.governance || this.defaultCoopGovernance(),
      treasury: coop.treasury || this.defaultCoopTreasury(),
      legalStructure: coop.legalStructure || this.defaultCoopLegalStructure(),
    };
    this.coopDaos.set(newCoop.name, newCoop);
    return newCoop;
  }

  private defaultCoopGovernance(): CoopGovernance {
    return {
      type: 'general-assembly',
      quorum: 0.30,
      majorityThreshold: 0.66,
      delegationEnabled: true,
      termLimits: true,
    };
  }

  private defaultCoopTreasury(): CoopTreasury {
    return {
      multisig: '',
      signers: [],
      threshold: 3,
      assets: [],
      budget: { period: { start: Date.now(), end: Date.now() + 86400000 * 365 }, income: [], expenses: [], surplus: 0, allocation: [] },
    };
  }

  private defaultCoopLegalStructure(): CoopLegalStructure {
    return {
      entityType: 'cooperative',
      registrationNumber: '',
      registeredAddress: '',
      bylaws: '',
      statutes: '',
    };
  }

  addCoopMember(coopName: string, member: CoopMember): boolean {
    const coop = this.coopDaos.get(coopName);
    if (!coop) return false;
    coop.members.push(member);
    return true;
  }

  createCoopBudget(coopName: string, period: { start: number; end: number }, income: CoopIncome[], expenses: CoopExpense[]): CoopBudget | null {
    const coop = this.coopDaos.get(coopName);
    if (!coop) return null;

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const surplus = totalIncome - totalExpenses;

    const budget: CoopBudget = {
      period,
      income,
      expenses,
      surplus,
      allocation: [],
    };
    coop.treasury.budget = budget;
    return budget;
  }

  allocateCoopFunds(coopName: string, allocations: CoopAllocation[]): boolean {
    const coop = this.coopDaos.get(coopName);
    if (!coop) return false;
    
    const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);
    if (totalAllocated > coop.treasury.budget.surplus) return false;

    coop.treasury.budget.allocation = allocations.map(a => ({ ...a, approved: true }));
    return true;
  }

  getCoopDAO(name: string): CoopDAO | undefined {
    return this.coopDaos.get(name);
  }

  listCoopDAOs(): CoopDAO[] {
    return Array.from(this.coopDaos.values());
  }

  // ---------------------------------------------------------------------------
  // BONDING CURVE CALCULATIONS
  // ---------------------------------------------------------------------------

  calculateBondingCurvePrice(
    supply: number,
    reserve: number,
    curve: AragonBondingCurve
  ): number {
    if (supply === 0) return reserve * curve.parameters.reserveRatio;
    if (curve.type === 'linear') {
      return reserve * curve.parameters.reserveRatio * (1 + supply * (curve.parameters.slope || 0.000001));
    }
    if (curve.type === 'exponential') {
      return reserve * curve.parameters.reserveRatio * Math.exp(supply * (curve.parameters.growthRate || 0.000001));
    }
    if (curve.type === 'logarithmic') {
      return reserve * curve.parameters.reserveRatio * (1 + Math.log(1 + supply) * (curve.parameters.factor || 1));
    }
    if (curve.type === 'sigmoid') {
      const normalized = supply / (curve.parameters.maxSupply || 1_000_000_000);
      const steepness = curve.parameters.steepness || 10;
      const midpoint = curve.parameters.midpoint || 0.5;
      const sigmoid = 1 / (1 + Math.exp(-steepness * (normalized - midpoint)));
      return reserve * curve.parameters.reserveRatio * (1 + sigmoid * 9);
    }
    // Custom - fallback to linear
    return reserve * curve.parameters.reserveRatio * (1 + supply * 0.000001);
  }

  calculateTokensForReserve(reserveAmount: number, currentSupply: number, curve: AragonBondingCurve): number {
    // Binary search for supply that matches reserve amount
    let low = 0;
    let high = curve.parameters.maxSupply || 1_000_000_000;
    const targetPrice = reserveAmount / (reserve * curve.parameters.reserveRatio);

    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      const price = this.calculateBondingCurvePrice(mid, reserve, curve);
      if (price < targetPrice) low = mid;
      else high = mid;
    }
    return Math.floor((low + high) / 2);
  }

  // ---------------------------------------------------------------------------
  // VESTING SCHEDULES
  // ---------------------------------------------------------------------------

  createVestingSchedule(
    beneficiary: string,
    tranches: Omit<AragonVestingTranche, 'timestamp'>[],
    cliff?: number
  ): AragonVesting {
    const schedule: AragonVestingTranche[] = tranches.map((t, i) => ({
      ...t,
      timestamp: (cliff || 0) + Date.now() + i * 86400000 * 30, // Monthly tranches after cliff
    }));

    return {
      schedule,
      beneficiary,
      cliff,
      revocable: false,
    };
  }

  claimVesting(vesting: AragonVesting, currentTime: number): { claimable: number; claimed: number; remaining: number } {
    let claimable = 0;
    let claimed = 0;

    for (const tranche of vesting.schedule) {
      if (tranche.timestamp <= currentTime && !tranche.conditions?.includes('claimed')) {
        claimable += tranche.amount;
      }
      if (tranche.conditions?.includes('claimed')) {
        claimed += tranche.amount;
      }
    }

    const remaining = vesting.schedule.reduce((sum, t) => sum + t.amount, 0) - claimed - claimable;
    return { claimable, claimed, remaining };
  }

  // ---------------------------------------------------------------------------
  // EMISSIONS
  // ---------------------------------------------------------------------------

  calculateEmissions(currentSupply: number, emissions: AragonEmissions): number {
    if (emissions.schedule === 'continuous') {
      return currentSupply * emissions.rate / 365; // Daily emission
    }
    if (emissions.schedule === 'epoch-based') {
      return currentSupply * emissions.rate; // Per epoch
    }
    return 0; // Discrete - manual
  }

  // ---------------------------------------------------------------------------
  // MODULE MANAGEMENT
  // ---------------------------------------------------------------------------

  addModule(module: AragonModule): boolean {
    // Check dependencies
    for (const dep of module.dependencies) {
      if (!this.osx.modules.some(m => m.name === dep)) {
        return false; // Missing dependency
      }
    }
    this.osx.modules.push(module);
    return true;
  }

  removeModule(name: string): boolean {
    // Check if other modules depend on it
    const dependents = this.osx.modules.filter(m => m.dependencies.includes(name));
    if (dependents.length > 0) return false;

    this.osx.modules = this.osx.modules.filter(m => m.name !== name);
    return true;
  }

  getModule(name: string): AragonModule | undefined {
    return this.osx.modules.find(m => m.name === name);
  }

  listModules(): AragonModule[] {
    return this.osx.modules;
  }

  // ---------------------------------------------------------------------------
  // PERMISSION MANAGEMENT
  // ---------------------------------------------------------------------------

  grantPermission(role: string, action: string, resource: string, conditions?: Record<string, any>): void {
    for (const module of this.osx.modules) {
      const existing = module.permissions.find(p => p.role === role && p.action === action && p.resource === resource);
      if (existing) {
        existing.conditions = conditions;
        return;
      }
      module.permissions.push({ role, action, resource, conditions });
    }
  }

  revokePermission(role: string, action: string, resource: string): boolean {
    for (const module of this.osx.modules) {
      const idx = module.permissions.findIndex(p => p.role === role && p.action === action && p.resource === resource);
      if (idx >= 0) {
        module.permissions.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  checkPermission(role: string, action: string, resource: string, context?: Record<string, any>): boolean {
    for (const module of this.osx.modules) {
      const perm = module.permissions.find(p => p.role === role && p.action === action && p.resource === resource);
      if (perm) {
        if (!perm.conditions) return true;
        // Check conditions
        for (const [key, value] of Object.entries(perm.conditions)) {
          if (context?.[key] !== value) return false;
        }
        return true;
      }
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // INTEGRATION WITH OASA
  // ---------------------------------------------------------------------------

  syncWithOASA(oasaEngine: OASAConstitutionEngine): void {
    // Align governance parameters with OASA Constitution
    const oasaGov = oasaEngine.getConstitution().governance;
    
    this.osx.governance.parameters.consentThreshold = oasaGov.projectAssembly.consentThreshold;
    this.osx.governance.parameters.guardianVeto = oasaGov.guardiansOfNature.vetoPower;
    
    // Add OASA compliance plugin if not present
    if (!this.osx.plugins.some(p => p.name === 'oasa-compliance')) {
      this.osx.plugins.push({
        name: 'oasa-compliance',
        type: 'custom',
        config: { principles: 7, guardians: true },
        dependencies: ['governance', 'dispute-resolution'],
      });
    }
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  getOSx(): AragonOSx {
    return this.osx;
  }

  exportState(): {
    osx: AragonOSx;
    agps: AGP_Process[];
    otf: AragonOTF | null;
    coopDaos: CoopDAO[];
  } {
    return {
      osx: this.osx,
      agps: Array.from(this.agps.values()),
      otf: this.otf,
      coopDaos: Array.from(this.coopDaos.values()),
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createAragonOSxEngine(): AragonOSxEngine {
  return new AragonOSxEngine();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const aragonOSxEngine = new AragonOSxEngine();
export default aragonOSxEngine;