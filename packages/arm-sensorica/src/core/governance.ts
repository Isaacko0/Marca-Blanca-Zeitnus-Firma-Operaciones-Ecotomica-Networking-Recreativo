// arm-sensorica/src/core/governance.ts - OVN Governance
import { 
  Proposal, 
  ProposalId, 
  ProjectId, 
  AffiliateId, 
  ProposalType, 
  Vote, 
  GovernanceConfig,
  GovernanceRole,
  Percentage,
  Duration,
  Timestamp,
  Vote as VoteType,
  Signature
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// GOVERNANCE REPOSITORY
// ============================================

export interface GovernanceRepository {
  saveProposal(proposal: Proposal): Promise<Proposal>;
  findProposalById(id: ProposalId): Promise<Proposal | null>;
  findProposalsByProject(projectId: ProjectId): Promise<Proposal[]>;
  findProposalsByStatus(status: Proposal['status']): Promise<Proposal[]>;
  updateProposal(proposal: Proposal): Promise<Proposal>;
  saveVote(vote: Vote): Promise<Vote>;
  findVotesByProposal(proposalId: ProposalId): Promise<Vote[]>;
}

export class InMemoryGovernanceRepository implements GovernanceRepository {
  private proposals: Map<ProposalId, Proposal> = new Map();
  private votes: Map<ProposalId, Vote[]> = new Map();
  private byProject: Map<ProjectId, Set<ProposalId>> = new Map();
  private byStatus: Map<Proposal['status'], Set<ProposalId>> = new Map();

  async saveProposal(proposal: Proposal): Promise<Proposal> {
    this.proposals.set(proposal.id, proposal);
    this.addToIndex(this.byProject, proposal.projectId, proposal.id);
    this.addToIndex(this.byStatus, proposal.status, proposal.id);
    this.votes.set(proposal.id, []);
    return proposal;
  }

  async findProposalById(id: ProposalId): Promise<Proposal | null> {
    return this.proposals.get(id) || null;
  }

  async findProposalsByProject(projectId: ProjectId): Promise<Proposal[]> {
    const ids = this.byProject.get(projectId) || new Set();
    return Array.from(ids).map(id => this.proposals.get(id)!).filter(Boolean);
  }

  async findProposalsByStatus(status: Proposal['status']): Promise<Proposal[]> {
    const ids = this.byStatus.get(status) || new Set();
    return Array.from(ids).map(id => this.proposals.get(id)!).filter(Boolean);
  }

  async updateProposal(proposal: Proposal): Promise<Proposal> {
    const existing = this.proposals.get(proposal.id);
    if (!existing) throw new Error('Proposal not found');
    
    if (existing.status !== proposal.status) {
      this.removeFromIndex(this.byStatus, existing.status, proposal.id);
      this.addToIndex(this.byStatus, proposal.status, proposal.id);
    }
    
    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  async saveVote(vote: Vote): Promise<Vote> {
    const votes = this.votes.get(vote.proposalId) || [];
    votes.push(vote);
    this.votes.set(vote.proposalId, votes);
    return vote;
  }

  async findVotesByProposal(proposalId: ProposalId): Promise<Vote[]> {
    return this.votes.get(proposalId) || [];
  }

  private addToIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(value);
  }

  private removeFromIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    const set = map.get(key);
    if (set) {
      set.delete(value);
      if (set.size === 0) map.delete(key);
    }
  }
}

// ============================================
// GOVERNANCE SERVICE
// ============================================

export interface GovernanceService {
  createProposal(input: CreateProposalInput): Promise<Proposal>;
  voteOnProposal(input: VoteInput): Promise<Vote>;
  checkProposalStatus(proposalId: ProposalId): Promise<ProposalStatusResult>;
  executeProposal(proposalId: ProposalId): Promise<ExecutionResult>;
  getProposalStatus(proposalId: ProposalId): Promise<ProposalStatusResult>;
}

export interface CreateProposalInput {
  projectId: string;
  type: ProposalType;
  title: string;
  description: string;
  proposedBy: string;
  executionPayload?: unknown;
}

export interface VoteInput {
  proposalId: string;
  affiliateId: string;
  choice: 'yes' | 'no' | 'abstain';
  signature: Signature;
}

export interface ProposalStatusResult {
  proposalId: ProposalId;
  status: Proposal['status'];
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalWeight: number;
  quorumMet: boolean;
  timeRemaining: number; // milliseconds
  requiredApprovers: number;
}

export interface ExecutionResult {
  success: boolean;
  proposalId: ProposalId;
  executedAt: Timestamp;
  error?: string;
}

export class GovernanceServiceImpl implements GovernanceService {
  constructor(
    private repo: GovernanceRepository,
    private configProvider: (projectId: ProjectId) => Promise<GovernanceConfig>
  ) {}

  async createProposal(input: CreateProposalInput): Promise<Proposal> {
    const config = await this.configProvider(input.projectId as any);
    
    const proposal: Proposal = {
      id: generateId('prop') as any,
      projectId: input.projectId as any,
      type: input.type,
      title: input.title,
      description: input.description,
      proposedBy: input.proposedBy as any,
      createdAt: now(),
      votingEndsAt: { 
        value: Date.now() + config.votingPeriod.value, 
        timezone: 'UTC' 
      },
      status: 'voting',
      votes: [],
      requiredApprovers: config.requiredApprovers.get(input.type) || 1,
      executionPayload: input.executionPayload
    };

    return this.repo.saveProposal(proposal);
  }

  async voteOnProposal(input: VoteInput): Promise<Vote> {
    const proposal = await this.repo.findProposalById(input.proposalId as any);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'voting') throw new Error('Proposal not in voting state');
    
    const existingVote = proposal.votes.find(v => v.affiliateId === input.affiliateId);
    if (existingVote) throw new Error('Already voted on this proposal');

    const vote: Vote = {
      affiliateId: input.affiliateId as any,
      proposalId: input.proposalId as any,
      choice: input.choice,
      weight: 1, // Could be weighted by trust score
      timestamp: now(),
      signature: input.signature
    };

    // Verify signature
    if (!verifyVoteSignature(vote, proposal)) {
      throw new Error('Invalid vote signature');
    }

    proposal.votes.push(vote);
    await this.repo.saveVote(vote);
    await this.repo.updateProposal(proposal);

    // Check if proposal passed
    await this.checkAndUpdateProposalStatus(proposal);

    return vote;
  }

  async checkProposalStatus(proposalId: ProposalId): Promise<ProposalStatusResult> {
    const proposal = await this.repo.findProposalById(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    const yesVotes = proposal.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
    const noVotes = proposal.votes.filter(v => v.choice === 'no').reduce((sum, v) => sum + v.weight, 0);
    const abstainVotes = proposal.votes.filter(v => v.choice === 'abstain').reduce((sum, v) => sum + v.weight, 0);
    const totalWeight = proposal.votes.reduce((sum, v) => sum + v.weight, 0);
    
    const timeRemaining = Math.max(0, proposal.votingEndsAt.value - Date.now());
    const quorumMet = yesVotes >= proposal.requiredApprovers && totalWeight > 0;

    return {
      proposalId,
      status: proposal.status,
      yesVotes,
      noVotes,
      abstainVotes,
      totalWeight,
      quorumMet,
      timeRemaining,
      requiredApprovers: proposal.requiredApprovers
    };
  }

  async executeProposal(proposalId: ProposalId): Promise<ExecutionResult> {
    const proposal = await this.repo.findProposalById(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'passed') throw new Error('Proposal not passed');

    try {
      // Execute based on proposal type
      await this.executeProposalPayload(proposal);
      
      proposal.status = 'executed';
      await this.repo.updateProposal(proposal);

      return {
        success: true,
        proposalId,
        executedAt: now()
      };
    } catch (error) {
      return {
        success: false,
        proposalId,
        executedAt: now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getProposalStatus(proposalId: ProposalId): Promise<ProposalStatusResult> {
    return this.checkProposalStatus(proposalId);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async checkAndUpdateProposalStatus(proposal: Proposal): Promise<void> {
    const yesVotes = proposal.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
    const totalWeight = proposal.votes.reduce((sum, v) => sum + v.weight, 0);
    const timeExpired = Date.now() >= proposal.votingEndsAt.value;

    if (proposal.votes.length > 0 && (yesVotes >= proposal.requiredApprovers || timeExpired)) {
      if (yesVotes >= proposal.requiredApprovers && totalWeight > 0) {
        proposal.status = 'passed';
      } else {
        proposal.status = 'rejected';
      }
      await this.repo.updateProposal(proposal);
    }
  }

  private async executeProposalPayload(proposal: Proposal): Promise<void> {
    // In real implementation, this would execute the payload
    // based on proposal type
    switch (proposal.type) {
      case 'valueEquationChange':
        // Would apply new value equation config
        break;
      case 'governanceChange':
        // Would update governance config
        break;
      case 'resourceAllocation':
        // Would allocate resources
        break;
      case 'exchangeFirmContract':
        // Would approve exchange firm contract
        break;
      case 'projectCreation':
        // Would create project
        break;
      case 'affiliateRemoval':
        // Would remove affiliate
        break;
      case 'custom':
        // Custom execution logic
        break;
    }
  }
}

// ============================================
// GOVERNANCE CONFIG HELPERS
// ============================================

export function createDefaultGovernanceConfig(): GovernanceConfig {
  return {
    quorumThreshold: { value: 60 }, // 60%
    votingPeriod: { value: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    proposalTypes: [
      'valueEquationChange',
      'governanceChange', 
      'resourceAllocation',
      'exchangeFirmContract',
      'projectCreation',
      'affiliateRemoval'
    ],
    requiredApprovers: new Map([
      ['valueEquationChange', 3],
      ['governanceChange', 3],
      ['resourceAllocation', 2],
      ['exchangeFirmContract', 1],
      ['projectCreation', 2],
      ['affiliateRemoval', 3]
    ]),
    autoApproveTimeout: { value: 14 * 24 * 60 * 60 * 1000 } // 14 days
  };
}

// ============================================
// QUORUM CALCULATIONS
// ============================================

export interface QuorumResult {
  met: boolean;
  yesVotes: number;
  totalWeight: number;
  requiredApprovers: number;
  participationRate: number; // 0-1
}

export function calculateQuorum(
  proposal: Proposal,
  totalEligibleVoters: number
): QuorumResult {
  const yesVotes = proposal.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
  const totalWeight = proposal.votes.reduce((sum, v) => sum + v.weight, 0);
  const participationRate = totalEligibleVoters > 0 ? totalWeight / totalEligibleVoters : 0;
  
  return {
    met: yesVotes >= proposal.requiredApprovers && totalWeight > 0,
    yesVotes,
    totalWeight,
    requiredApprovers: proposal.requiredApprovers,
    participationRate
  };
}

// ============================================
// PROPOSAL LIFECYCLE HELPERS
// ============================================

export function isProposalExpired(proposal: Proposal): boolean {
  return Date.now() >= proposal.votingEndsAt.value;
}

export function canVoteOnProposal(proposal: Proposal, affiliateId: AffiliateId): boolean {
  if (proposal.status !== 'voting') return false;
  if (isProposalExpired(proposal)) return false;
  if (proposal.votes.some(v => v.affiliateId === affiliateId)) return false;
  return true;
}

export function getProposalResults(proposal: Proposal): {
  yes: number;
  no: number;
  abstain: number;
  passed: boolean;
} {
  const yes = proposal.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.weight, 0);
  const no = proposal.votes.filter(v => v.choice === 'no').reduce((sum, v) => sum + v.weight, 0);
  const abstain = proposal.votes.filter(v => v.choice === 'abstain').reduce((sum, v) => sum + v.weight, 0);
  
  return {
    yes,
    no,
    abstain,
    passed: yes >= proposal.requiredApprovers && (yes + no + abstain) > 0
  };
}

// ============================================
// SIGNATURE VERIFICATION
// ============================================

function verifyVoteSignature(vote: Vote, proposal: Proposal): boolean {
  // In real implementation, would verify Ed25519/secp256k1 signature
  // against affiliate's public key
  return true; // placeholder
}

import { generateId, now } from '../utils';