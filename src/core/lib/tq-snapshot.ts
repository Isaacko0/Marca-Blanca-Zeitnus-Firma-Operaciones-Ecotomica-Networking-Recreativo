// src/core/lib/tq-snapshot.ts
// Snapshot Parallel Voting: Strategies, Spaces, Off-chain Governance
// Implements: Snapshot.js strategies, Space configuration, Voting power, Proposal lifecycle

import type { TQTransaction } from './tq';
import type { DisCO_CAT_Engine } from './tq-disco-cat';
import type { OASAConstitutionEngine } from './tq-oasa';

// ============================================================================
// SNAPSHOT TYPES
// ============================================================================

export interface SnapshotSpace {
  id: string;
  name: string;
  network: 'mainnet' | 'polygon' | 'gnosis' | 'arbitrum' | 'optimism' | 'base' | 'testnet';
  symbol: string;
  domain: string;
  about: string;
  avatar: string;
  skin: string;
  filters: SnapshotFilter[];
  plugins: string[];
  members: string[]; // DIDs
  admins: string[]; // DIDs
  validators: SnapshotValidator[];
  strategies: SnapshotStrategyConfig[];
  createdAt: number;
  updatedAt: number;
}

export interface SnapshotFilter {
  key: string;
  values: string[];
}

export interface SnapshotValidator {
  name: string;
  address: string;
  type: 'erc20' | 'erc721' | 'erc1155' | 'custom' | 'tq-ledger' | 'disco-cat';
}

export interface SnapshotStrategyConfig {
  name: string;
  params: Record<string, any>;
  network: string;
}

export interface SnapshotProposal {
  id: string;
  spaceId: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: number; // block number or timestamp
  state: 'pending' | 'active' | 'closed' | 'executed' | 'cancelled';
  author: string;
  votes: Map<string, SnapshotVote>;
  scores: number[]; // per choice
  totalVotes: number;
  totalVoters: number;
  quorum: number;
  threshold: number;
  executionPayloads: SnapshotExecutionPayload[];
  raoCredentialId: string;
  linkedOASAArticle?: number;
  linkedDisCOPrinciple?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SnapshotVote {
  voter: string;
  choice: number; // index in choices array
  weight: number;
  vp: number; // voting power
  vpByStrategy: Record<string, number>;
  reason?: string;
  timestamp: number;
  signature: string;
}

export interface SnapshotExecutionPayload {
  target: string;
  value: string;
  callData: string;
  description: string;
}

// ============================================================================
// STRATEGY IMPLEMENTATIONS
// ============================================================================

export abstract class SnapshotStrategy {
  abstract name: string;
  abstract calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number>;
}

export class ERC20BalanceOfStrategy extends SnapshotStrategy {
  name = 'erc20-balance-of';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    // Simulated - would call blockchain RPC in production
    const { address, decimals = 18, symbol } = params;
    // return balanceOf(voter) / 10^decimals
    return Math.random() * 10000; // placeholder
  }
}

export class ERC20WithBalanceOfStrategy extends SnapshotStrategy {
  name = 'erc20-with-balance-of';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    const { address, symbol, decimals = 18 } = params;
    return Math.random() * 5000;
  }
}

export class TQLedgerStrategy extends SnapshotStrategy {
  name = 'tq-ledger';
  private tqTransactions: TQTransaction[];

  constructor(tqTransactions: TQTransaction[]) {
    super();
    this.tqTransactions = tqTransactions;
  }

  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    // VP = sum of TQ produced (kWh) by voter up to snapshot
    const relevantTxs = this.tqTransactions.filter(tx => 
      tx.nodeId === voter && tx.timestamp <= snapshot && tx.type === 'production'
    );
    const totalKwh = relevantTxs.reduce((sum, tx) => sum + tx.quantity, 0);
    
    // Apply square root to reduce whale dominance
    return Math.sqrt(totalKwh) * 10;
  }
}

export class DisCOCATStrategy extends SnapshotStrategy {
  name = 'disco-cat';
  private discoEngine: DisCO_CAT_Engine;

  constructor(discoEngine: DisCO_CAT_Engine) {
    super();
    this.discoEngine = discoEngine;
  }

  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    const cat = this.discoEngine.getCAT();
    
    // VP = Trust Score × Transparency Score × Consent Participation
    const trustScore = cat.trust.trustScore;
    const transparencyScore = cat.transparency.auditTrail.length > 0 ? 1 : 0;
    
    // Count consent decisions participated in
    const participated = cat.assembly.consentDecisions.filter(d => 
      d.consents.has(voter) && d.integratedAt <= snapshot
    ).length;
    
    const participationBonus = Math.min(1, participated / 10); // cap at 10 decisions
    
    return (trustScore * 0.4 + transparencyScore * 0.3 + participationBonus * 0.3) * 1000;
  }
}

export class OASAComplianceStrategy extends SnapshotStrategy {
  name = 'oasa-compliance';
  private oasaEngine: OASAConstitutionEngine;

  constructor(oasaEngine: OASAConstitutionEngine) {
    super();
    this.oasaEngine = oasaEngine;
  }

  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    // Find voter's village
    const villages = this.oasaEngine.listVillages();
    const village = villages.find(v => v.domain === voter || v.id === voter);
    
    if (!village) return 100; // base VP for non-village voters
    
    const compliance = village.oasaPrinciplesCompliance;
    
    // VP scales with compliance (0.5x to 2x)
    return (0.5 + compliance) * 1000;
  }
}

export class QuadraticVotingStrategy extends SnapshotStrategy {
  name = 'quadratic-voting';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    const { baseStrategy, maxVP } = params;
    // In quadratic voting, VP is the budget of voice credits
    // This strategy wraps another strategy and applies quadratic cost
    return maxVP || 100;
  }
}

export class ConvictionVotingStrategy extends SnapshotStrategy {
  name = 'conviction-voting';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    const { decay = 0.95, minConviction = 0.1 } = params;
    // Conviction grows over time as tokens are staked
    // VP = stake * (1 - decay^time)
    return Math.random() * 1000;
  }
}

export class HolographicConsensusStrategy extends SnapshotStrategy {
  name = 'holographic-consensus';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    const { predictorStake, predictionAccuracy } = params;
    // Predictors earn reputation for accurate predictions
    // VP = base VP + predictor bonus
    return 1000 + (predictionAccuracy || 0) * 500;
  }
}

export class OnePersonOneVoteStrategy extends SnapshotStrategy {
  name = 'one-person-one-vote';
  async calculateVP(space: SnapshotSpace, voter: string, snapshot: number, params: Record<string, any>): Promise<number> {
    // Pure 1a1v - each registered member gets 1 VP
    return space.members.includes(voter) ? 1 : 0;
  }
}

// ============================================================================
// STRATEGY REGISTRY
// ============================================================================

export const SNAPSHOT_STRATEGIES: Map<string, SnapshotStrategy> = new Map([
  ['erc20-balance-of', new ERC20BalanceOfStrategy()],
  ['erc20-with-balance-of', new ERC20WithBalanceOfStrategy()],
  ['tq-ledger', new TQLedgerStrategy([])],
  ['disco-cat', new DisCOCATStrategy(null as any)],
  ['oasa-compliance', new OASAComplianceStrategy(null as any)],
  ['quadratic-voting', new QuadraticVotingStrategy()],
  ['conviction-voting', new ConvictionVotingStrategy()],
  ['holographic-consensus', new HolographicConsensusStrategy()],
  ['one-person-one-vote', new OnePersonOneVoteStrategy()],
]);

// ============================================================================
// SNAPSHOT ENGINE
// ============================================================================

export class SnapshotEngine {
  private spaces: Map<string, SnapshotSpace> = new Map();
  private proposals: Map<string, SnapshotProposal> = new Map();
  private strategies: Map<string, SnapshotStrategy> = new Map(SNAPSHOT_STRATEGIES);

  // ---------------------------------------------------------------------------
  // SPACE MANAGEMENT
  // ---------------------------------------------------------------------------

  createSpace(space: Omit<SnapshotSpace, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): SnapshotSpace {
    const id = space.id || `space_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newSpace: SnapshotSpace = {
      ...space,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.spaces.set(id, newSpace);
    return newSpace;
  }

  getSpace(id: string): SnapshotSpace | undefined {
    return this.spaces.get(id);
  }

  listSpaces(): SnapshotSpace[] {
    return Array.from(this.spaces.values());
  }

  updateSpace(id: string, updates: Partial<SnapshotSpace>): boolean {
    const space = this.spaces.get(id);
    if (!space) return false;
    this.spaces.set(id, { ...space, ...updates, updatedAt: Date.now() });
    return true;
  }

  // ---------------------------------------------------------------------------
  // STRATEGY MANAGEMENT
  // ---------------------------------------------------------------------------

  registerStrategy(strategy: SnapshotStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  getStrategy(name: string): SnapshotStrategy | undefined {
    return this.strategies.get(name);
  }

  async calculateTotalVP(spaceId: string, voter: string, snapshot: number): Promise<{ total: number; byStrategy: Record<string, number> }> {
    const space = this.spaces.get(spaceId);
    if (!space) return { total: 0, byStrategy: {} };

    const byStrategy: Record<string, number> = {};
    let total = 0;

    for (const strategyConfig of space.strategies) {
      const strategy = this.strategies.get(strategyConfig.name);
      if (strategy) {
        const vp = await strategy.calculateVP(space, voter, snapshot, strategyConfig.params);
        byStrategy[strategyConfig.name] = vp;
        total += vp;
      }
    }

    return { total, byStrategy };
  }

  // ---------------------------------------------------------------------------
  // PROPOSAL LIFECYCLE
  // ---------------------------------------------------------------------------

  createProposal(proposal: Omit<SnapshotProposal, 'id' | 'votes' | 'scores' | 'totalVotes' | 'totalVoters' | 'createdAt' | 'updatedAt'> & { id?: string }): SnapshotProposal {
    const id = proposal.id || `prop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newProposal: SnapshotProposal = {
      ...proposal,
      id,
      votes: new Map(),
      scores: new Array(proposal.choices.length).fill(0),
      totalVotes: 0,
      totalVoters: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.proposals.set(id, newProposal);
    return newProposal;
  }

  async vote(proposalId: string, vote: Omit<SnapshotVote, 'vp' | 'vpByStrategy'> & { vp?: number; vpByStrategy?: Record<string, number> }): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return false;
    if (proposal.state !== 'active') return false;
    if (Date.now() < proposal.start || Date.now() > proposal.end) return false;
    if (vote.choice < 0 || vote.choice >= proposal.choices.length) return false;

    // Calculate VP if not provided
    let vp = vote.vp;
    let vpByStrategy = vote.vpByStrategy;
    
    if (vp === undefined) {
      const space = this.spaces.get(proposal.spaceId);
      if (space) {
        const result = await this.calculateTotalVP(proposal.spaceId, vote.voter, proposal.snapshot);
        vp = result.total;
        vpByStrategy = result.byStrategy;
      } else {
        vp = 1;
        vpByStrategy = {};
      }
    }

    const fullVote: SnapshotVote = {
      ...vote,
      vp: vp || 0,
      vpByStrategy: vpByStrategy || {},
      timestamp: Date.now(),
    };

    proposal.votes.set(vote.voter, fullVote);
    proposal.scores[vote.choice] += fullVote.vp;
    proposal.totalVotes += fullVote.vp;
    proposal.totalVoters = proposal.votes.size;
    proposal.updatedAt = Date.now();

    return true;
  }

  closeProposal(proposalId: string): { passed: boolean; winningChoice: number; scores: number[] } | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.state !== 'active') return null;

    const space = this.spaces.get(proposal.spaceId);
    if (!space) return null;

    const quorumMet = proposal.totalVotes >= proposal.quorum;
    const winningScore = Math.max(...proposal.scores);
    const winningChoice = proposal.scores.indexOf(winningScore);
    const thresholdMet = proposal.totalVotes > 0 && (winningScore / proposal.totalVotes) >= proposal.threshold;

    const passed = quorumMet && thresholdMet;

    proposal.state = passed ? 'closed' : 'closed';
    proposal.updatedAt = Date.now();

    return { passed, winningChoice, scores: proposal.scores };
  }

  executeProposal(proposalId: string): boolean {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.state !== 'closed') return false;

    const result = this.closeProposal(proposalId);
    if (!result?.passed) return false;

    proposal.state = 'executed';
    proposal.updatedAt = Date.now();
    return true;
  }

  getProposal(id: string): SnapshotProposal | undefined {
    return this.proposals.get(id);
  }

  listProposals(spaceId?: string, state?: SnapshotProposal['state']): SnapshotProposal[] {
    let result = Array.from(this.proposals.values());
    if (spaceId) result = result.filter(p => p.spaceId === spaceId);
    if (state) result = result.filter(p => p.state === state);
    return result;
  }

  // ---------------------------------------------------------------------------
  // PRESET SPACES FOR ZEITNUS ECOSYSTEM
  // ---------------------------------------------------------------------------

  createZeitnusMainSpace(): SnapshotSpace {
    return this.createSpace({
      id: 'zeitnus-main',
      name: 'Zeitnus Governance',
      network: 'polygon',
      symbol: 'ZNU',
      domain: 'gov.zeitnus.org',
      about: 'Main governance space for Zeitnus regenerative network',
      avatar: 'https://ipfs.io/ipfs/QmZeitnusAvatar',
      skin: 'zeitnus',
      filters: [
        { key: 'category', values: ['constitutional', 'legislative', 'executive', 'treasury', 'ecosystem'] },
        { key: 'phase', values: ['emergent', 'consolidated', 'mature', 'federated'] },
      ],
      plugins: ['tq-disco-cat', 'tq-oasa', 'tq-virginia', 'tq-aragon'],
      members: [],
      admins: [],
      validators: [
        { name: 'ZNU Token', address: '0x...', type: 'erc20' },
        { name: 'TQ Ledger', address: '', type: 'tq-ledger' },
        { name: 'DisCO CAT', address: '', type: 'disco-cat' },
      ],
      strategies: [
        { name: 'tq-ledger', params: {}, network: 'polygon' },
        { name: 'disco-cat', params: {}, network: 'polygon' },
        { name: 'oasa-compliance', params: {}, network: 'polygon' },
        { name: 'one-person-one-vote', params: {}, network: 'polygon' },
      ],
    });
  }

  createVillageSpace(villageId: string, villageName: string): SnapshotSpace {
    return this.createSpace({
      id: `village-${villageId}`,
      name: `${villageName} Governance`,
      network: 'gnosis',
      symbol: 'VILLAGE',
      domain: `${villageId}.gov.closer.earth`,
      about: `Local governance for ${villageName} regenerative village`,
      avatar: '',
      skin: 'village',
      filters: [
        { key: 'category', values: ['land-use', 'water', 'energy', 'community', 'events'] },
      ],
      plugins: ['tq-closer', 'tq-oasa'],
      members: [],
      admins: [],
      validators: [
        { name: 'Village Token', address: '0x...', type: 'erc20' },
        { name: 'OASA Compliance', address: '', type: 'oasa-compliance' },
      ],
      strategies: [
        { name: 'erc20-balance-of', params: { address: '0x...', symbol: 'VILLAGE' }, network: 'gnosis' },
        { name: 'oasa-compliance', params: {}, network: 'gnosis' },
        { name: 'one-person-one-vote', params: {}, network: 'gnosis' },
      ],
    });
  }

  createDHOSpace(dhoId: string, dhoName: string): SnapshotSpace {
    return this.createSpace({
      id: `dho-${dhoId}`,
      name: `${dhoName} DHO Governance`,
      network: 'polygon',
      symbol: 'DHO',
      domain: `${dhoId}.dho.zeitnus.org`,
      about: `DisCO/DHO governance for ${dhoName}`,
      avatar: '',
      skin: 'dho',
      filters: [
        { key: 'flow', values: ['livelihood', 'love', 'care'] },
        { key: 'phase', values: ['emergent', 'consolidated', 'mature', 'federated'] },
      ],
      plugins: ['tq-disco-cat', 'tq-virginia', 'tq-berry-vesting'],
      members: [],
      admins: [],
      validators: [
        { name: 'DisCO CAT', address: '', type: 'disco-cat' },
        { name: 'TQ Ledger', address: '', type: 'tq-ledger' },
      ],
      strategies: [
        { name: 'disco-cat', params: {}, network: 'polygon' },
        { name: 'tq-ledger', params: {}, network: 'polygon' },
        { name: 'one-person-one-vote', params: {}, network: 'polygon' },
      ],
    });
  }

  createGranAlianzaSpace(): SnapshotSpace {
    return this.createSpace({
      id: 'gran-alianza',
      name: 'Gran Alianza por la Vida',
      network: 'mainnet',
      symbol: 'GAV',
      domain: 'gov.gran-alianza.vida',
      about: 'Federation governance for 7 holones of Gran Alianza',
      avatar: 'https://ipfs.io/ipfs/QmGranAlianzaAvatar',
      skin: 'gran-alianza',
      filters: [
        { key: 'holon', values: ['holon-1', 'holon-2', 'holon-3', 'holon-4', 'holon-5', 'holon-6', 'holon-7'] },
        { key: 'type', values: ['federation-treaty', 'shared-treasury', 'resource-sharing', 'dispute-resolution'] },
      ],
      plugins: ['tq-oasa', 'tq-aragon', 'tq-virginia'],
      members: [],
      admins: [],
      validators: [
        { name: 'GAV Token', address: '0x...', type: 'erc20' },
        { name: 'OASA Guardians', address: '', type: 'custom' },
      ],
      strategies: [
        { name: 'holographic-consensus', params: { predictorStake: 10000 }, network: 'mainnet' },
        { name: 'oasa-compliance', params: {}, network: 'mainnet' },
        { name: 'conviction-voting', params: { decay: 0.95 }, network: 'mainnet' },
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // INTEGRATION HELPERS
  // ---------------------------------------------------------------------------

  setTQLedgerTransactions(transactions: TQTransaction[]): void {
    const strategy = this.strategies.get('tq-ledger') as TQLedgerStrategy;
    if (strategy) {
      // Re-create with new transactions
      this.strategies.set('tq-ledger', new TQLedgerStrategy(transactions));
    }
  }

  setDisCOEngine(engine: DisCO_CAT_Engine): void {
    this.strategies.set('disco-cat', new DisCOCATStrategy(engine));
  }

  setOASAEngine(engine: OASAConstitutionEngine): void {
    this.strategies.set('oasa-compliance', new OASAComplianceStrategy(engine));
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createSnapshotEngine(): SnapshotEngine {
  return new SnapshotEngine();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const snapshotEngine = new SnapshotEngine();
export default snapshotEngine;