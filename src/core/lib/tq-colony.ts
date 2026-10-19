// src/core/lib/tq-colony.ts
// Colony Protocol Integration: Domains, Pots, Reputation, Lazy Consensus
// Implements: Domain hierarchy (N1/N2/N3), 5 Pot types, 4 Reputation types, Lazy consensus, Skills, Virginia mapping

import type {
  TQTransaction,
} from './tq';

import type {
  VirginiaColonyMapping,
  ColonyDomain,
  ColonyPot,
  ColonyReputation,
  ColonySkill,
  ColonyMotion,
  ColonyDispute,
  ColonyReputationClaim,
} from './tq-types-extended';

import { DisCO_CAT_Engine } from './tq-disco-cat';
import { BreadEngine } from './tq-bread';
import { ValueFlowsEngine } from './tq-valueflows';
import { SnapshotEngine } from './tq-snapshot';
import { VirginiaGateway } from './tq-virginia';

// ============================================================================
// COLONY ENGINE
// ============================================================================

export class ColonyEngine {
  private domains: Map<string, ColonyDomain> = new Map();
  private pots: Map<string, ColonyPot> = new Map();
  private reputation: Map<string, Map<string, ColonyReputation>> = new Map(); // domainId -> did -> reputation
  private skills: Map<string, ColonySkill[]> = new Map(); // did -> skills
  private motions: Map<string, ColonyMotion> = new Map();
  private disputes: Map<string, ColonyDispute> = new Map();
  private reputationClaims: Map<string, ColonyReputationClaim> = new Map();

  // Integrated engines
  private discoEngine: DisCO_CAT_Engine;
  private breadEngine: BreadEngine;
  private valueFlowsEngine: ValueFlowsEngine;
  private snapshotEngine: SnapshotEngine;
  private virginiaGateway: VirginiaGateway;

  // Configuration
  private config: {
    n1RootDomainId: string;
    n2SubDomainIds: string[];
    n3ProjectDomainIds: string[];
    n3FundDomainIds: string[];
    reputationToWeightMultiplier: number;
    minReputationForPotAccess: number;
    objectionPeriod: number; // ms
    reputationDecayRates: Record<string, number>; // per year
  };

  constructor(
    config: Partial<{
      n1RootDomainId: string;
      n2SubDomainIds: string[];
      n3ProjectDomainIds: string[];
      n3FundDomainIds: string[];
      reputationToWeightMultiplier: number;
      minReputationForPotAccess: number;
      objectionPeriod: number;
    }> = {},
    engines: {
      disco: DisCO_CAT_Engine;
      bread: BreadEngine;
      valueFlows: ValueFlowsEngine;
      snapshot: SnapshotEngine;
      virginia: VirginiaGateway;
    }
  ) {
    this.discoEngine = engines.disco;
    this.breadEngine = engines.bread;
    this.valueFlowsEngine = engines.valueFlows;
    this.snapshotEngine = engines.snapshot;
    this.virginiaGateway = engines.virginia;

    this.config = {
      n1RootDomainId: config.n1RootDomainId || 'domain-root-zeitnus',
      n2SubDomainIds: config.n2SubDomainIds || ['domain-governance', 'domain-ecosystem', 'domain-tech'],
      n3ProjectDomainIds: config.n3ProjectDomainIds || ['proj-regeneration', 'proj-education', 'proj-infrastructure'],
      n3FundDomainIds: config.n3FundDomainIds || ['fund-ecosystem', 'fund-development', 'fund-emergency'],
      reputationToWeightMultiplier: config.reputationToWeightMultiplier || 0.03,
      minReputationForPotAccess: config.minReputationForPotAccess || 500,
      objectionPeriod: config.objectionPeriod || 86400000 * 7, // 7 days
      reputationDecayRates: {
        governance: 0.05, // 5%/year
        technical: 0.10,  // 10%/year
        ecological: 0.02, // 2%/year
        care: 0.15,       // 15%/year
      },
    };

    // Initialize domain hierarchy
    this.initializeDomainHierarchy();
  }

  // ---------------------------------------------------------------------------
  // DOMAIN HIERARCHY INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeDomainHierarchy(): void {
    // N1: Root Domain (Network Governance)
    this.createDomain({
      id: this.config.n1RootDomainId,
      name: 'Zeitnus Network Governance',
      parentId: null,
      level: 'N1',
      purpose: 'Network constitution, guardian oversight, protocol upgrades',
      pots: [],
      members: [],
      admins: [],
      createdAt: Date.now(),
    });

    // N2: Sub-Domains (Coordination)
    const n2Configs = [
      { id: 'domain-governance', name: 'Governance Domain', purpose: 'Consent decisions, policy, treasury oversight' },
      { id: 'domain-ecosystem', name: 'Ecosystem Domain', purpose: 'Regeneration projects, grants, ecological monitoring' },
      { id: 'domain-tech', name: 'Technology Domain', purpose: 'Infrastructure, R&D, protocol development' },
    ];

    for (const n2 of n2Configs) {
      this.createDomain({
        id: n2.id,
        name: n2.name,
        parentId: this.config.n1RootDomainId,
        level: 'N2',
        purpose: n2.purpose,
        pots: [],
        members: [],
        admins: [],
        createdAt: Date.now(),
      });
    }

    // N3: Fund Domains (created dynamically, but pre-define IDs)
    for (const fundId of this.config.n3FundDomainIds) {
      this.createDomain({
        id: fundId,
        name: fundId.replace('fund-', 'Fund: ').replace(/-/g, ' '),
        parentId: 'domain-ecosystem',
        level: 'N3-fund',
        purpose: 'Ecosystem fund management',
        pots: [],
        members: [],
        admins: [],
        createdAt: Date.now(),
      });
    }
  }

  // ---------------------------------------------------------------------------
  // DOMAIN MANAGEMENT
  // ---------------------------------------------------------------------------

  createDomain(domain: Omit<ColonyDomain, 'pots' | 'members' | 'admins'> & { pots?: string[]; members?: string[]; admins?: string[] }): ColonyDomain {
    const newDomain: ColonyDomain = {
      ...domain,
      pots: domain.pots || [],
      members: domain.members || [],
      admins: domain.admins || [],
    };
    this.domains.set(newDomain.id, newDomain);
    this.reputation.set(newDomain.id, new Map());
    return newDomain;
  }

  getDomain(id: string): ColonyDomain | undefined {
    return this.domains.get(id);
  }

  listDomains(): ColonyDomain[] {
    return Array.from(this.domains.values());
  }

  getDomainsByLevel(level: ColonyDomain['level']): ColonyDomain[] {
    return Array.from(this.domains.values()).filter(d => d.level === level);
  }

  addDomainMember(domainId: string, memberDid: string, isAdmin: boolean = false): boolean {
    const domain = this.domains.get(domainId);
    if (!domain) return false;
    if (!domain.members.includes(memberDid)) domain.members.push(memberDid);
    if (isAdmin && !domain.admins.includes(memberDid)) domain.admins.push(memberDid);
    return true;
  }

  removeDomainMember(domainId: string, memberDid: string): boolean {
    const domain = this.domains.get(domainId);
    if (!domain) return false;
    domain.members = domain.members.filter(d => d !== memberDid);
    domain.admins = domain.admins.filter(d => d !== memberDid);
    return true;
  }

  // ---------------------------------------------------------------------------
  // POT MANAGEMENT (5 Types)
  // ---------------------------------------------------------------------------

  private potConfigs = [
    {
      id: 'pot-network-treasury',
      name: 'Network Treasury',
      domainId: 'domain-root-zeitnus',
      type: 'treasury' as const,
      token: 'ZNU',
      spendingRule: 'multisig' as const,
      multisigConfig: { signers: [], threshold: 3 },
      recoveryAddress: 'multisig-root',
      timeLock: 86400000 * 30, // 30 days
    },
    {
      id: 'pot-ecosystem-fund',
      name: 'Ecosystem Fund',
      domainId: 'fund-ecosystem',
      type: 'ecosystem' as const,
      token: 'ZNU',
      spendingRule: 'lazy-consensus' as const,
      objectionPeriod: this.config.objectionPeriod,
    },
    {
      id: 'pot-development-fund',
      name: 'Development Fund',
      domainId: 'fund-development',
      type: 'development' as const,
      token: 'ZNU',
      spendingRule: 'lazy-consensus' as const,
      objectionPeriod: this.config.objectionPeriod * 2, // 14 days
    },
    {
      id: 'pot-emergency-fund',
      name: 'Emergency Fund',
      domainId: 'fund-emergency',
      type: 'emergency' as const,
      token: 'ZNU',
      spendingRule: 'guardian-veto' as const,
      multisigConfig: { signers: [], threshold: 2 },
    },
    {
      id: 'pot-project-budget',
      name: 'Project Budget Template',
      domainId: '', // Set per project
      type: 'project' as const,
      token: 'ZNU',
      spendingRule: 'domain-owner+evaluator' as const,
    },
  ];

  createPot(potConfig: Omit<ColonyPot, 'id' | 'balance' | 'createdAt'> & { id?: string }): ColonyPot {
    const id = potConfig.id || `pot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const pot: ColonyPot = {
      ...potConfig,
      id,
      balance: 0,
      createdAt: Date.now(),
    };
    this.pots.set(id, pot);

    // Add pot to domain
    const domain = this.domains.get(potConfig.domainId);
    if (domain && !domain.pots.includes(id)) {
      domain.pots.push(id);
    }

    return pot;
  }

  getPot(id: string): ColonyPot | undefined {
    return this.pots.get(id);
  }

  listPots(): ColonyPot[] {
    return Array.from(this.pots.values());
  }

  getPotsByDomain(domainId: string): ColonyPot[] {
    return Array.from(this.pots.values()).filter(p => p.domainId === domainId);
  }

  // Initialize standard pots
  initializeStandardPots(): void {
    for (const potConfig of this.potConfigs) {
      this.createPot(potConfig);
    }
  }

  // ---------------------------------------------------------------------------
  // POT OPERATIONS
  // ---------------------------------------------------------------------------

  async moveFunds(potId: string, amount: number, recipient: string, requesterDid: string): Promise<{ txHash: string; motionId?: string }> {
    const pot = this.pots.get(potId);
    if (!pot) throw new Error('Pot not found');
    if (pot.balance < amount) throw new Error('Insufficient balance');

    // Check reputation requirement
    const domain = this.domains.get(pot.domainId);
    if (!domain) throw new Error('Domain not found');

    const requesterRep = this.getReputation(requesterDid, pot.domainId);
    if (requesterRep < this.config.minReputationForPotAccess) {
      throw new Error(`Insufficient reputation: ${requesterRep} < ${this.config.minReputationForPotAccess}`);
    }

    // Process based on spending rule
    switch (pot.spendingRule) {
      case 'multisig':
        return this.executeMultisig(pot, amount, recipient, requesterDid);
      case 'lazy-consensus':
        return this.createLazyConsensusMotion(pot, amount, recipient, requesterDid);
      case 'guardian-veto':
        return this.createGuardianVetoMotion(pot, amount, recipient, requesterDid);
      case 'domain-owner+evaluator':
        return this.executeDomainOwnerEvaluator(pot, amount, recipient, requesterDid);
      default:
        throw new Error(`Unknown spending rule: ${pot.spendingRule}`);
    }
  }

  private async executeMultisig(pot: ColonyPot, amount: number, recipient: string, requesterDid: string): Promise<{ txHash: string }> {
    // In production: collect multisig signatures
    // For now: simulate execution
    pot.balance -= amount;
    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
    
    // Record in ValueFlows
    this.valueFlowsEngine.recordEvent({
      type: 'transfer',
      fromAgent: pot.id,
      toAgent: recipient,
      resource: { id: 'resource_znu', name: 'ZNU', category: 'currency', unit: 'ZNU', categoryCode: 'CUR' },
      quantity: amount,
      unit: 'ZNU',
      timestamp: Date.now(),
      raoCredentialId: `rao_${Date.now()}`,
    });

    return { txHash };
  }

  private async createLazyConsensusMotion(pot: ColonyPot, amount: number, recipient: string, requesterDid: string): Promise<{ txHash: string; motionId: string }> {
    const motion = this.createMotion({
      domainId: pot.domainId,
      proposer: requesterDid,
      type: 'move-funds',
      payload: { potId: pot.id, amount, recipient },
      objectionPeriod: pot.objectionPeriod || this.config.objectionPeriod,
    });

    // Schedule auto-execution after objection period
    setTimeout(() => {
      this.checkAndExecuteMotion(motion.id);
    }, pot.objectionPeriod || this.config.objectionPeriod);

    return { txHash: 'pending', motionId: motion.id };
  }

  private async createGuardianVetoMotion(pot: ColonyPot, amount: number, recipient: string, requesterDid: string): Promise<{ txHash: string; motionId: string }> {
    const motion = this.createMotion({
      domainId: pot.domainId,
      proposer: requesterDid,
      type: 'move-funds',
      payload: { potId: pot.id, amount, recipient },
      objectionPeriod: this.config.objectionPeriod,
      requiresGuardianApproval: true,
    });

    return { txHash: 'pending', motionId: motion.id };
  }

  private async executeDomainOwnerEvaluator(pot: ColonyPot, amount: number, recipient: string, requesterDid: string): Promise<{ txHash: string }> {
    const domain = this.domains.get(pot.domainId);
    if (!domain) throw new Error('Domain not found');

    // Check if requester is domain owner or has evaluator skill
    const isOwner = domain.admins.includes(requesterDid);
    const hasEvaluatorSkill = this.hasSkill(requesterDid, 'reputation-evaluation', 3);

    if (!isOwner && !hasEvaluatorSkill) {
      throw new Error('Only domain owner or verified evaluator can execute');
    }

    pot.balance -= amount;
    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

    this.valueFlowsEngine.recordEvent({
      type: 'transfer',
      fromAgent: pot.id,
      toAgent: recipient,
      resource: { id: 'resource_znu', name: 'ZNU', category: 'currency', unit: 'ZNU', categoryCode: 'CUR' },
      quantity: amount,
      unit: 'ZNU',
      timestamp: Date.now(),
      raoCredentialId: `rao_${Date.now()}`,
    });

    return { txHash };
  }

  // ---------------------------------------------------------------------------
  // LAZY CONSENSUS (DisCO Alignment)
  // ---------------------------------------------------------------------------

  createMotion(motion: Omit<ColonyMotion, 'id' | 'status' | 'createdAt' | 'objections' | 'executedAt'> & { id?: string }): ColonyMotion {
    const newMotion: ColonyMotion = {
      ...motion,
      id: motion.id || `motion_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'pending',
      objections: [],
      createdAt: Date.now(),
    };
    this.motions.set(newMotion.id, newMotion);
    return newMotion;
  }

  objectMotion(motionId: string, objectorDid: string, reason: string): boolean {
    const motion = this.motions.get(motionId);
    if (!motion || motion.status !== 'pending') return false;

    // Check objection validity: reputation ≥ 1% domain reputation
    const domainRep = this.getTotalDomainReputation(motion.domainId);
    const objectorRep = this.getReputation(objectorDid, motion.domainId);
    if (objectorRep < domainRep * 0.01) return false;

    motion.objections.push({ objector: objectorDid, reason, timestamp: Date.now() });
    return true;
  }

  private checkAndExecuteMotion(motionId: string): void {
    const motion = this.motions.get(motionId);
    if (!motion || motion.status !== 'pending') return;

    // Check if any valid objection exists
    const validObjections = motion.objections.filter(obj => {
      const domainRep = this.getTotalDomainReputation(motion.domainId);
      const objectorRep = this.getReputation(obj.objector, motion.domainId);
      return objectorRep >= domainRep * 0.01;
    });

    if (validObjections.length === 0) {
      // Auto-execute
      this.executeMotion(motionId);
    } else {
      // Escalate to dispute resolution
      motion.status = 'disputed';
      this.raiseDispute(motionId, validObjections[0].reason);
    }
  }

  executeMotion(motionId: string): boolean {
    const motion = this.motions.get(motionId);
    if (!motion || motion.status !== 'pending') return false;

    // Execute based on type
    if (motion.type === 'move-funds') {
      const { potId, amount, recipient } = motion.payload;
      const pot = this.pots.get(potId);
      if (pot && pot.balance >= amount) {
        pot.balance -= amount;
        motion.status = 'executed';
        motion.executedAt = Date.now();

        this.valueFlowsEngine.recordEvent({
          type: 'transfer',
          fromAgent: pot.id,
          toAgent: recipient,
          resource: { id: 'resource_znu', name: 'ZNU', category: 'currency', unit: 'ZNU', categoryCode: 'CUR' },
          quantity: amount,
          unit: 'ZNU',
          timestamp: Date.now(),
          raoCredentialId: `rao_${Date.now()}`,
        });

        // Mirror to Snapshot
        this.mirrorMotionToSnapshot(motion);
        return true;
      }
    }
    return false;
  }

  private mirrorMotionToSnapshot(motion: ColonyMotion): void {
    // Create corresponding Snapshot proposal
    this.snapshotEngine.createProposal({
      spaceId: 'zeitnus-main',
      title: `Colony Motion: ${motion.type}`,
      body: JSON.stringify(motion.payload, null, 2),
      choices: ['Execute', 'Reject'],
      start: Date.now(),
      end: Date.now() + 86400000,
      snapshot: Date.now(),
      state: 'pending',
      author: motion.proposer,
      quorum: 100,
      threshold: 0.51,
      executionPayloads: [],
      raoCredentialId: `rao_${Date.now()}`,
    });
  }

  // ---------------------------------------------------------------------------
  // REPUTATION SYSTEM (4 Types)
  // ---------------------------------------------------------------------------

  claimReputation(claim: Omit<ColonyReputationClaim, 'id' | 'status' | 'createdAt' | 'verifiers'> & { id?: string }): ColonyReputationClaim {
    const newClaim: ColonyReputationClaim = {
      ...claim,
      id: claim.id || `claim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'pending',
      verifiers: [],
      createdAt: Date.now(),
    };
    this.reputationClaims.set(newClaim.id, newClaim);

    // Auto-verify if Bread verified skill
    if (claim.skillId) {
      const breadProfile = this.breadEngine.getProfile(claim.claimantDid);
      const skill = breadProfile?.skills.find(s => s.id === claim.skillId && s.verified);
      if (skill) {
        this.verifyReputationClaim(newClaim.id, 'bread-auto', true);
      }
    }

    return newClaim;
  }

  verifyReputationClaim(claimId: string, verifierDid: string, approve: boolean): boolean {
    const claim = this.reputationClaims.get(claimId);
    if (!claim || claim.status !== 'pending') return false;

    claim.verifiers.push(verifierDid);
    
    // Check if enough verifiers (3 for Bread, 2 for evaluators)
    const requiredVerifiers = claim.skillId ? 3 : 2;
    if (claim.verifiers.length >= requiredVerifiers) {
      if (approve) {
        this.mintReputation(claim.domainId, claim.claimantDid, claim.skillId || 'general', claim.amount);
        claim.status = 'approved';
      } else {
        claim.status = 'rejected';
      }
    }
    return true;
  }

  private mintReputation(domainId: string, did: string, skillId: string, amount: number): void {
    const domainRep = this.reputation.get(domainId);
    if (!domainRep) return;

    const current = domainRep.get(did);
    if (current) {
      current.amount += amount;
      current.lastUpdated = Date.now();
      if (!current.skills.includes(skillId)) current.skills.push(skillId);
    } else {
      domainRep.set(did, {
        did,
        domainId,
        amount,
        skills: [skillId],
        lastUpdated: Date.now(),
        decayRate: this.config.reputationDecayRates.governance, // default
      });
    }

    // Sync with Virginia N3 weight
    this.virginiaGateway.computeN3Weight();
  }

  getReputation(did: string, domainId: string): number {
    const domainRep = this.reputation.get(domainId);
    if (!domainRep) return 0;
    const rep = domainRep.get(did);
    if (!rep) return 0;
    
    // Apply decay
    const yearsSinceUpdate = (Date.now() - rep.lastUpdated) / (86400000 * 365);
    const decayRate = rep.decayRate || 0.05;
    return Math.max(0, rep.amount * Math.pow(1 - decayRate, yearsSinceUpdate));
  }

  getTotalDomainReputation(domainId: string): number {
    const domainRep = this.reputation.get(domainId);
    if (!domainRep) return 0;
    return Array.from(domainRep.values()).reduce((sum, r) => sum + this.getReputation(r.did, domainId), 0);
  }

  getReputationByType(did: string, domainId: string, type: ColonyReputation['type']): number {
    const domainRep = this.reputation.get(domainId);
    if (!domainRep) return 0;
    const rep = domainRep.get(did);
    if (!rep) return 0;
    // In practice, would track by type separately
    return rep.amount;
  }

  // ---------------------------------------------------------------------------
  // REPUTATION DECAY
  // ---------------------------------------------------------------------------

  applyReputationDecay(): void {
    for (const [domainId, domainRep] of this.reputation) {
      for (const rep of domainRep.values()) {
        const yearsSinceUpdate = (Date.now() - rep.lastUpdated) / (86400000 * 365);
        if (yearsSinceUpdate > 1) {
          const decayRate = rep.decayRate || 0.05;
          rep.amount = Math.max(0, rep.amount * Math.pow(1 - decayRate, yearsSinceUpdate));
          rep.lastUpdated = Date.now();
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SKILLS & VERIFICATION (Bread Integration)
  // ---------------------------------------------------------------------------

  addSkill(did: string, skill: Omit<ColonySkill, 'verified' | 'evaluators'> & { evaluators?: string[] }): ColonySkill {
    const userSkills = this.skills.get(did) || [];
    const newSkill: ColonySkill = {
      ...skill,
      verified: false,
      evaluators: skill.evaluators || [],
    };
    userSkills.push(newSkill);
    this.skills.set(did, userSkills);

    // Auto-verify if Bread verified
    const breadProfile = this.breadEngine.getProfile(did);
    const breadSkill = breadProfile?.skills.find(s => s.name === skill.name && s.verified);
    if (breadSkill) {
      newSkill.verified = true;
      newSkill.evaluators.push('bread-auto');
    }

    return newSkill;
  }

  verifySkill(did: string, skillId: string, evaluatorDid: string): boolean {
    const userSkills = this.skills.get(did);
    if (!userSkills) return false;

    const skill = userSkills.find(s => s.id === skillId);
    if (!skill) return false;

    if (!skill.evaluators.includes(evaluatorDid)) {
      skill.evaluators.push(evaluatorDid);
    }

    // Auto-verify at 3 evaluators with min reputation
    const evaluatorReps = skill.evaluators.map(e => this.getReputation(e, 'domain-governance'));
    const avgRep = evaluatorReps.length > 0 ? evaluatorReps.reduce((a, b) => a + b, 0) / evaluatorReps.length : 0;

    if (skill.evaluators.length >= 3 && avgRep >= 500) {
      skill.verified = true;
    }

    return skill.verified;
  }

  hasSkill(did: string, skillName: string, minLevel: number = 1): boolean {
    const userSkills = this.skills.get(did);
    if (!userSkills) return false;
    return userSkills.some(s => s.name === skillName && s.level >= minLevel && s.verified);
  }

  getSkills(did: string): ColonySkill[] {
    return this.skills.get(did) || [];
  }

  // ---------------------------------------------------------------------------
  // DISPUTE RESOLUTION
  // ---------------------------------------------------------------------------

  raiseDispute(motionId: string, reason: string): ColonyDispute {
    const motion = this.motions.get(motionId);
    if (!motion) throw new Error('Motion not found');

    const dispute: ColonyDispute = {
      id: `dispute_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      motionId,
      domainId: motion.domainId,
      reason,
      status: 'open',
      mediator: null,
      resolution: null,
      createdAt: Date.now(),
      resolvedAt: null,
    };
    this.disputes.set(dispute.id, dispute);
    return dispute;
  }

  resolveDispute(disputeId: string, resolution: string, mediatorDid: string): boolean {
    const dispute = this.disputes.get(disputeId);
    if (!dispute || dispute.status !== 'open') return false;

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.mediator = mediatorDid;
    dispute.resolvedAt = Date.now();

    const motion = this.motions.get(dispute.motionId);
    if (motion) {
      motion.status = resolution === 'execute' ? 'executed' : 'rejected';
      if (resolution === 'execute') this.executeMotion(motion.id);
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // VIRGINIA MAPPING & N3 WEIGHT CONTRIBUTION
  // ---------------------------------------------------------------------------

  getVirginiaMapping(): VirginiaColonyMapping {
    return {
      n1RootDomainId: this.config.n1RootDomainId,
      n2SubDomainIds: this.config.n2SubDomainIds,
      n3ProjectDomainIds: this.config.n3ProjectDomainIds,
      n3FundDomainIds: this.config.n3FundDomainIds,
      reputationToWeightMultiplier: this.config.reputationToWeightMultiplier,
      minReputationForPotAccess: this.config.minReputationForPotAccess,
    };
  }

  getN3WeightContribution(nodeId: string): number {
    // Sum reputation across all domains for this node
    let totalRep = 0;
    for (const [domainId, domainRep] of this.reputation) {
      const rep = domainRep.get(nodeId);
      if (rep) totalRep += this.getReputation(nodeId, domainId);
    }
    return totalRep * this.config.reputationToWeightMultiplier;
  }

  // ---------------------------------------------------------------------------
  // DISCO INTEGRATION
  // ---------------------------------------------------------------------------

  syncDisCOConsentDecisions(): void {
    const cat = this.discoEngine.getCAT();
    for (const decision of cat.assembly.consentDecisions) {
      if (decision.status === 'integrated') {
        // Grant governance reputation to participants
        for (const [voter, choice] of decision.consents) {
          if (choice === 'consent') {
            this.mintReputation('domain-governance', voter, 'governance-participation', 5);
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SNAPSHOT INTEGRATION
  // ---------------------------------------------------------------------------

  createSnapshotProposalForMotion(motion: ColonyMotion): string {
    return this.snapshotEngine.createProposal({
      spaceId: 'zeitnus-main',
      title: `Colony: ${motion.type}`,
      body: JSON.stringify(motion.payload, null, 2),
      choices: ['Execute', 'Reject'],
      start: Date.now(),
      end: Date.now() + 86400000,
      snapshot: Date.now(),
      state: 'pending',
      author: motion.proposer,
      quorum: 100,
      threshold: 0.51,
      executionPayloads: [],
      raoCredentialId: `rao_${Date.now()}`,
    }).id;
  }

  // ---------------------------------------------------------------------------
  // EXPORT / REPORTING
  // ---------------------------------------------------------------------------

  exportState(): {
    domains: ColonyDomain[];
    pots: ColonyPot[];
    reputation: Record<string, Record<string, ColonyReputation>>;
    motions: ColonyMotion[];
    disputes: ColonyDispute[];
    skills: Record<string, ColonySkill[]>;
  } {
    const repExport: Record<string, Record<string, ColonyReputation>> = {};
    for (const [domainId, domainRep] of this.reputation) {
      repExport[domainId] = Object.fromEntries(domainRep);
    }

    return {
      domains: Array.from(this.domains.values()),
      pots: Array.from(this.pots.values()),
      reputation: repExport,
      motions: Array.from(this.motions.values()),
      disputes: Array.from(this.disputes.values()),
      skills: Object.fromEntries(this.skills),
    };
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getMotion(id: string): ColonyMotion | undefined {
    return this.motions.get(id);
  }

  getDispute(id: string): ColonyDispute | undefined {
    return this.disputes.get(id);
  }

  getReputationClaim(id: string): ColonyReputationClaim | undefined {
    return this.reputationClaims.get(id);
  }

  getConfig() {
    return { ...this.config };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createColonyEngine(
  config: any,
  engines: {
    disco: DisCO_CAT_Engine;
    bread: BreadEngine;
    valueFlows: ValueFlowsEngine;
    snapshot: SnapshotEngine;
    virginia: VirginiaGateway;
  }
): ColonyEngine {
  return new ColonyEngine(config, engines);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const colonyEngine = (config: any, engines: any) => createColonyEngine(config, engines);
export default ColonyEngine;