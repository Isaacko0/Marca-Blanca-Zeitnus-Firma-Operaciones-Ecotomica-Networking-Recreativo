// arm-sensorica/src/ops.ts - Single Write Path (ARM pattern)
import { 
  SensoricaOp,
  SensoricaEvent,
  SensoricaState,
  SubmitContribution,
  VerifyContribution,
  CreateProject,
  JoinProject,
  ConfigureValueEquation,
  ExecuteDistribution,
  AddResource,
  RequestResourceAccess,
  ProposeGovernanceChange,
  VoteOnProposal,
  RegisterAffiliate,
  UpdateTrustScore,
  RecordExternalRevenue,
  Contribution,
  Project,
  Affiliate,
  ValueEquationConfig,
  DistributionResult,
  ResourcePool,
  Resource,
  GovernanceConfig,
  PropertyRegime,
  Proposal,
  Vote,
  AffiliateProfile,
  TrustScore,
  DualValue,
  ContributionType,
  GovernanceRole,
  ContributionId,
  ProjectId,
  AffiliateId,
  ResourcePoolId,
  DistributionId,
  EventId,
  ProposalId,
  ExchangeFirmId,
  Timestamp,
  Hash,
  Signature,
  DualValuationRule,
  ValuationFormula,
  Weight,
  DualValue,
  MonetaryMode,
  AuditEntry,
  AffiliateDistribution,
  ResourceAccessRequest,
  EvidenceRef
} from './types';

import { 
  generateId, 
  now, 
  hashEvent, 
  verifySignature, 
  calculateVoteWeight,
  evaluateValuationFormula,
  generateAuditTrail
} from './utils';

// ============================================
// OPERATION IMPLEMENTATIONS (Pure Functions)
// ============================================

export function applyOp(state: SensoricaState, op: SensoricaOp): SensoricaState {
  const newState = { ...state };
  
  switch (op.type) {
    case 'contribution.submit':
      return applyContributionSubmit(newState, op.payload);
    case 'contribution.verify':
      return applyContributionVerify(newState, op.payload);
    case 'project.create':
      return applyProjectCreate(newState, op.payload);
    case 'project.join':
      return applyProjectJoin(newState, op.payload);
    case 'valueEquation.configure':
      return applyValueEquationConfigure(newState, op.payload);
    case 'distribution.execute':
      return applyDistributionExecute(newState, op.payload);
    case 'resourcePool.add':
      return applyResourcePoolAdd(newState, op.payload);
    case 'resourcePool.access':
      return applyResourcePoolAccess(newState, op.payload);
    case 'governance.propose':
      return applyGovernancePropose(newState, op.payload);
    case 'governance.vote':
      return applyGovernanceVote(newState, op.payload);
    case 'affiliate.register':
      return applyAffiliateRegister(newState, op.payload);
    case 'trust.update':
      return applyTrustUpdate(newState, op.payload);
    case 'exchangeFirm.revenueReceived':
      return applyExchangeFirmRevenueReceived(newState, op.payload);
    default:
      // exhaustive check
      const _exhaustive: never = op;
      return newState;
  }
}

function applyContributionSubmit(state: SensoricaState, payload: SubmitContribution): SensoricaState {
  const contributionId = generateId('contrib');
  const contribution: Contribution = {
    id: contributionId,
    affiliateId: payload.affiliateId, // from op author
    projectId: payload.projectId,
    type: payload.type,
    quantity: payload.quantity,
    timestamp: now(),
    verificationStatus: 'pending',
    evidence: payload.evidence,
    metadata: payload.metadata || {}
  };
  
  const newContributions = new Map(state.contributions);
  newContributions.set(contributionId, contribution);
  
  const affiliate = state.affiliates.get(payload.affiliateId);
  if (affiliate) {
    const newAffiliates = new Map(state.affiliates);
    newAffiliates.set(payload.affiliateId, {
      ...affiliate,
      contributions: [...affiliate.contributions, contributionId]
    });
    newState.affiliates = newAffiliates;
  }
  
  return { ...state, contributions: newContributions };
}

function applyContributionVerify(state: SensoricaState, payload: VerifyContribution): SensoricaState {
  const contribution = state.contributions.get(payload.contributionId);
  if (!contribution) throw new Error('Contribution not found');
  
  const newContribution: Contribution = {
    ...contribution,
    verificationStatus: payload.approve ? 'verified' : 'disputed'
  };
  
  const newContributions = new Map(state.contributions);
  newContributions.set(payload.contributionId, newContribution);
  
  return { ...state, contributions: newContributions };
}

function applyProjectCreate(state: SensoricaState, payload: CreateProject): SensoricaState {
  const projectId = generateId('proj');
  const project: Project = {
    id: projectId,
    name: payload.name,
    description: payload.description,
    valueEquation: payload.valueEquation,
    resourcePool: payload.resourcePoolId,
    affiliates: [payload.affiliateId], // creator
    status: 'forming',
    propertyRegime: payload.propertyRegime,
    governance: payload.governance,
    createdAt: now(),
    updatedAt: now()
  };
  
  const newProjects = new Map(state.projects);
  newProjects.set(projectId, project);
  
  const affiliate = state.affiliates.get(payload.affiliateId);
  if (affiliate) {
    const newAffiliates = new Map(state.affiliates);
    newAffiliates.set(payload.affiliateId, {
      ...affiliate,
      projects: [...affiliate.projects, projectId]
    });
    newState.affiliates = newAffiliates;
  }
  
  return { ...state, projects: newProjects };
}

function applyProjectJoin(state: SensoricaState, payload: JoinProject): SensoricaState {
  const project = state.projects.get(payload.projectId);
  if (!project) throw new Error('Project not found');
  if (project.affiliates.includes(payload.affiliateId)) return state;
  
  const newProject = {
    ...project,
    affiliates: [...project.affiliates, payload.affiliateId],
    updatedAt: now()
  };
  
  const newProjects = new Map(state.projects);
  newProjects.set(payload.projectId, newProject);
  
  const affiliate = state.affiliates.get(payload.affiliateId);
  if (affiliate) {
    const newAffiliates = new Map(state.affiliates);
    newAffiliates.set(payload.affiliateId, {
      ...affiliate,
      projects: [...affiliate.projects, payload.projectId]
    });
    newState.affiliates = newAffiliates;
  }
  
  return { ...state, projects: newProjects };
}

function applyValueEquationConfigure(state: SensoricaState, payload: ConfigureValueEquation): SensoricaState {
  const project = state.projects.get(payload.projectId);
  if (!project) throw new Error('Project not found');
  
  const newValueEquations = new Map(state.valueEquations);
  newValueEquations.set(payload.projectId, payload.config);
  
  const newProject = {
    ...project,
    valueEquation: payload.config,
    updatedAt: now()
  };
  
  const newProjects = new Map(state.projects);
  newProjects.set(payload.projectId, newProject);
  
  return { 
    ...state, 
    valueEquations: newValueEquations,
    projects: newProjects
  };
}

function applyDistributionExecute(state: SensoricaState, payload: ExecuteDistribution): SensoricaState {
  const project = state.projects.get(payload.projectId);
  if (!project) throw new Error('Project not found');
  if (project.status !== 'active') throw new Error('Project not active');
  
  const valueEquation = state.valueEquations.get(payload.projectId);
  if (!valueEquation) throw new Error('Value equation not configured');
  
  // Get verified contributions for this project
  const contributions = Array.from(state.contributions.values())
    .filter(c => c.projectId === payload.projectId && c.verificationStatus === 'verified');
  
  if (contributions.length === 0) throw new Error('No verified contributions');
  
  // Execute dual-mode distribution
  const result = executeDistributionDual(valueEquation, contributions, payload.revenue, payload.mode);
  
  const distributionId = generateId('dist');
  const distribution: DistributionResult = {
    id: distributionId,
    projectId: payload.projectId,
    mode: payload.mode,
    distributions: result.distributions,
    totalDistributed: result.totalDistributed,
    timestamp: now(),
    auditTrail: result.auditTrail
  };
  
  const newDistributions = new Map(state.distributions);
  newDistributions.set(distributionId, distribution);
  
  // Update affiliate earnings
  const newAffiliates = new Map(state.affiliates);
  for (const dist of result.distributions) {
    const affiliate = state.affiliates.get(dist.affiliateId);
    if (affiliate) {
      const newEarnings = {
        distributionId,
        amount: dist.amount,
        timestamp: now(),
        contributionIds: dist.contributions
      };
      newAffiliates.set(dist.affiliateId, {
        ...affiliate,
        earnings: [...affiliate.earnings, newEarnings]
      });
    }
  }
  
  return { 
    ...state, 
    distributions: newDistributions,
    affiliates: newAffiliates
  };
}

function executeDistributionDual(
  config: ValueEquationConfig,
  contributions: Contribution[],
  revenue: DualValue,
  mode: MonetaryMode
): { distributions: AffiliateDistribution[]; totalDistributed: DualValue; auditTrail: AuditEntry[] } {
  
  // Calculate scores per contribution
  const scored = contributions.map(c => {
    const rule = config.contributionValuation.get(c.type);
    if (!rule) throw new Error(`No valuation rule for ${c.type}`);
    const formula = mode === 'postmonetario' ? rule.postmonetario : rule.conectado;
    const score = evaluateValuationFormula(formula, c.quantity.value);
    return { contribution: c, score };
  });
  
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  if (totalScore === 0) throw new Error('Total score is zero');
  
  const revenueAmount = revenue[mode];
  const reserveAmount = (revenueAmount * config.reservePercentage.value) / 100n;
  const distributableAmount = revenueAmount - reserveAmount;
  
  const distributions: AffiliateDistribution[] = scored.map(s => {
    const share = (distributableAmount * s.score) / totalScore;
    return {
      affiliateId: s.contribution.affiliateId,
      amount: { postmonetario: mode === 'postmonetario' ? share : 0n, conectado: mode === 'conectado' ? share : 0n },
      contributionScore: s.score,
      contributions: [s.contribution.id]
    };
  });
  
  const auditTrail = generateAuditTrail(contributions, scored.map(s => s.score), distributions);
  
  return {
    distributions,
    totalDistributed: { postmonetario: mode === 'postmonetario' ? distributableAmount : 0n, conectado: mode === 'conectado' ? distributableAmount : 0n },
    auditTrail
  };
}

function applyResourcePoolAdd(state: SensoricaState, payload: AddResource): SensoricaState {
  const pool = state.resourcePools.get(payload.resourcePoolId);
  if (!pool) throw new Error('Resource pool not found');
  
  const newPool = {
    ...pool,
    resources: [...pool.resources, payload.resource]
  };
  
  const newPools = new Map(state.resourcePools);
  newPools.set(payload.resourcePoolId, newPool);
  
  return { ...state, resourcePools: newPools };
}

function applyResourcePoolAccess(state: SensoricaState, payload: RequestResourceAccess): SensoricaState {
  // Find resource and pool
  let targetPool: ResourcePool | undefined;
  let targetResource: Resource | undefined;
  
  for (const pool of state.resourcePools.values()) {
    const resource = pool.resources.find(r => r.id === payload.resourceId);
    if (resource) {
      targetPool = pool;
      targetResource = resource;
      break;
    }
  }
  
  if (!targetPool || !targetResource) throw new Error('Resource not found');
  
  // Check access rules
  const applicableRules = targetPool.accessRules.filter(r => r.resourceId === payload.resourceId);
  if (applicableRules.length === 0) throw new Error('No access rules for resource');
  
  // Check if requires approval
  const requiresApproval = applicableRules.some(r => r.requiresApproval);
  
  const request: ResourceAccessRequest = {
    id: generateId('access'),
    resourceId: payload.resourceId,
    affiliateId: payload.affiliateId,
    requestedAt: now(),
    startTime: payload.startTime,
    endTime: payload.endTime,
    purpose: payload.purpose,
    status: requiresApproval ? 'pending' : 'approved',
    approvedBy: requiresApproval ? undefined : 'auto',
    approvedAt: requiresApproval ? undefined : now()
  };
  
  // In real implementation, would store requests separately
  // For now, just return state (real impl would have accessRequests map)
  return state;
}

function applyGovernancePropose(state: SensoricaState, payload: ProposeGovernanceChange): SensoricaState {
  const project = state.projects.get(payload.projectId);
  if (!project) throw new Error('Project not found');
  
  const proposalId = generateId('prop');
  const proposal: Proposal = {
    id: proposalId,
    projectId: payload.projectId,
    type: payload.type,
    title: payload.title,
    description: payload.description,
    proposedBy: payload.affiliateId, // from op author
    createdAt: now(),
    votingEndsAt: { value: now().value + project.governance.votingPeriod.value, timezone: 'UTC' },
    status: 'voting',
    votes: [],
    requiredApprovers: project.governance.requiredApprovers.get(payload.type) || 1,
    executionPayload: payload.executionPayload
  };
  
  const newProposals = new Map(state.governanceProposals);
  newProposals.set(proposalId, proposal);
  
  return { ...state, governanceProposals: newProposals };
}

function applyGovernanceVote(state: SensoricaState, payload: VoteOnProposal): SensoricaState {
  const proposal = state.governanceProposals.get(payload.proposalId);
  if (!proposal) throw new Error('Proposal not found');
  if (proposal.status !== 'voting') throw new Error('Proposal not in voting state');
  if (proposal.votes.some(v => v.affiliateId === payload.affiliateId)) throw new Error('Already voted');
  
  const vote: Vote = {
    affiliateId: payload.affiliateId, // from op author
    proposalId: payload.proposalId,
    choice: payload.choice,
    weight: 1, // Could be weighted by trust score
    timestamp: now(),
    signature: { algorithm: 'ed25519', value: '', publicKey: '' } // placeholder
  };
  
  const newProposal = {
    ...proposal,
    votes: [...proposal.votes, vote]
  };
  
  // Check if passed
  const yesVotes = newProposal.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
  const totalWeight = newProposal.votes.reduce((sum, v) => sum + v.weight, 0);
  const quorum = proposal.requiredApprovers;
  
  if (yesVotes >= quorum && totalWeight > 0) {
    newProposal.status = 'passed';
  }
  
  const newProposals = new Map(state.governanceProposals);
  newProposals.set(payload.proposalId, newProposal);
  
  return { ...state, governanceProposals: newProposals };
}

function applyAffiliateRegister(state: SensoricaState, payload: RegisterAffiliate): SensoricaState {
  const affiliateId = generateId('aff');
  const affiliate: Affiliate = {
    id: affiliateId,
    profile: payload.profile,
    contributions: [],
    earnings: [],
    trustScore: {
      value: payload.initialTrustScore || 0.5,
      lastUpdated: now(),
      source: 'composite'
    },
    governanceRole: 'affiliate',
    joinedAt: now(),
    projects: []
  };
  
  const newAffiliates = new Map(state.affiliates);
  newAffiliates.set(affiliateId, affiliate);
  
  return { ...state, affiliates: newAffiliates };
}

function applyTrustUpdate(state: SensoricaState, payload: UpdateTrustScore): SensoricaState {
  const affiliate = state.affiliates.get(payload.affiliateId);
  if (!affiliate) throw new Error('Affiliate not found');
  
  const newTrustScore: TrustScore = {
    value: payload.newScore,
    lastUpdated: now(),
    source: 'placeKeeper',
    breakdown: {
      directObservation: payload.newScore, // simplified
      peerReports: 0,
      historicalCompliance: 0
    }
  };
  
  const newAffiliates = new Map(state.affiliates);
  newAffiliates.set(payload.affiliateId, {
    ...affiliate,
    trustScore: newTrustScore
  });
  
  const newTrustScores = new Map(state.trustScores);
  newTrustScores.set(payload.affiliateId, newTrustScore);
  
  return { 
    ...state, 
    affiliates: newAffiliates,
    trustScores: newTrustScores
  };
}

function applyExchangeFirmRevenueReceived(state: SensoricaState, payload: RecordExternalRevenue): SensoricaState {
  const firm = state.exchangeFirms.get(payload.exchangeFirmId);
  if (!firm) throw new Error('Exchange firm not found');
  
  // Record the revenue (actual distribution happens via distribution.execute)
  // This op just records the receipt
  return state;
}

// ============================================
// EVENT CREATION
// ============================================

export function createEvent(op: SensoricaOp, author: AffiliateId, previousStateHash: Hash): SensoricaEvent {
  return {
    id: generateId('evt'),
    type: op.type,
    payload: op.payload,
    author,
    timestamp: now(),
    previousStateHash,
    signature: { algorithm: 'ed25519', value: '', publicKey: '' } // would be signed by author's key
  };
}

export function verifyEventSignature(event: SensoricaEvent): boolean {
  // Verify the signature matches the author's public key
  return verifySignature(event.signature, event);
}

// ============================================
// UTILITY FUNCTIONS (in separate file)
// ============================================

// These would be in ./utils.ts
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function now(): Timestamp {
  return { value: Date.now(), timezone: 'UTC' };
}

function hashEvent(event: SensoricaEvent): Hash {
  // Simplified - would use SHA-256 or BLAKE3
  const data = JSON.stringify({ type: event.type, payload: event.payload, author: event.author, timestamp: event.timestamp });
  return { algorithm: 'sha256', value: hashString(data) };
}

function hashString(str: string): string {
  // Simplified hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function verifySignature(signature: Signature, event: SensoricaEvent): boolean {
  // Would verify Ed25519/secp256k1 signature
  return true; // placeholder
}

function calculateVoteWeight(votes: Vote[]): number {
  return votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
}

function evaluateValuationFormula(formula: ValuationFormula, quantity: bigint): number {
  const q = Number(quantity);
  switch (formula.type) {
    case 'linear':
      return q * formula.multiplier;
    case 'logarithmic':
      return Math.log(q + 1) / Math.log(formula.base) * formula.multiplier;
    case 'step':
      for (const threshold of formula.thresholds) {
        if (q >= threshold.min) return threshold.value;
      }
      return 0;
    case 'custom':
      // Would call registered function
      return q; // placeholder
    default:
      return q;
  }
}

function generateAuditTrail(
  contributions: Contribution[], 
  scores: number[], 
  distributions: AffiliateDistribution[]
): AuditEntry[] {
  return contributions.map((c, i) => ({
    id: generateId('audit'),
    action: 'distribution_calculation',
    actor: c.affiliateId,
    timestamp: now(),
    details: {
      contributionId: c.id,
      type: c.type,
      quantity: c.quantity,
      score: scores[i],
      share: distributions[i]?.amount
    },
    previousHash: { algorithm: 'sha256', value: '0' },
    currentHash: { algorithm: 'sha256', value: hashString(`${c.id}-${scores[i]}`) }
  }));
}