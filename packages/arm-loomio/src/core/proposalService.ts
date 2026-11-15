// arm-loomio/src/core/proposalService.ts
// Proposal Service - Business Logic for Proposals

import { 
  LoomioProposal, 
  CreateProposalInput,
  ProposalType,
  ProposalTemplate,
} from '../../types';

import { 
  PROPOSAL_TYPES, 
  getProposalTypeConfig,
  mergeConfig,
  validateProposalConfig,
} from '../../lib/loomio/proposalTypes';

import { generateId, now } from '../utils';

export class LoomioProposalService {
  private proposals = new Map<string, LoomioProposal>();

  /**
   * Create a new proposal
   */
  async create(input: CreateProposalInput): Promise<LoomioProposal> {
    const typeConfig = PROPOSAL_TYPES[input.type];
    const mergedConfig = mergeConfig(input.type, input.config || {});
    const configErrors = validateProposalConfig(input.type, mergedConfig);
    if (configErrors.length > 0) {
      throw new Error(`Config validation failed: ${configErrors.join(', ')}`);
    }

    const proposal: LoomioProposal = {
      id: generateId('proposal'),
      groupId: input.groupId,
      threadId: input.threadId,
      type: input.type,
      title: input.title,
      description: input.description,
      descriptionFormat: input.descriptionFormat || 'html',
      config: mergedConfig,
      anonymous: input.anonymous || false,
      hideResults: input.hideResults || typeConfig.defaults.hideResults || 'until_closed',
      stanceReasonRequired: input.stanceReasonRequired || typeConfig.defaults.stanceReasonRequired || 'disabled',
      weightedVoting: input.weightedVoting ?? typeConfig.constraints.supportsWeightedVoting,
      voteWeights: new Map(),
      options: input.options.map((opt, index) => ({
        id: generateId('option'),
        name: opt.name,
        description: opt.description,
        icon: opt.icon,
        priority: index,
      })),
      authorId: input.authorId,
      createdAt: now(),
      updatedAt: now(),
      status: 'open',
    };

    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  /**
   * Get proposal by ID
   */
  get(proposalId: string): LoomioProposal | null {
    return this.proposals.get(proposalId) ?? null;
  }

  /**
   * List proposals for group
   */
  listByGroup(groupId: string, options: { status?: string; type?: ProposalType } = {}): LoomioProposal[] {
    return Array.from(this.proposals.values()).filter(p => {
      if (p.groupId !== groupId) return false;
      if (options.status && p.status !== options.status) return false;
      if (options.type && p.type !== options.type) return false;
      return true;
    });
  }

  /**
   * Update proposal
   */
  update(proposalId: string, updates: Partial<CreateProposalInput>): LoomioProposal {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.closedAt) throw new Error('Cannot update closed proposal');

    // Config freeze check for anonymous proposals
    if (proposal.anonymous && updates.config) {
      // Would check frozen config here
    }

    Object.assign(proposal, updates);
    proposal.updatedAt = now();
    this.proposals.set(proposalId, proposal);
    return proposal;
  }

  /**
   * Close proposal
   */
  close(proposalId: string, closedBy: string, reason?: string): LoomioProposal {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.closedAt) throw new Error('Proposal already closed');

    proposal.closedAt = now();
    proposal.closedBy = closedBy;
    proposal.closeReason = reason;
    proposal.status = 'closed';
    proposal.updatedAt = now();

    this.proposals.set(proposalId, proposal);
    return proposal;
  }

  /**
   * Delete proposal (soft delete)
   */
  delete(proposalId: string): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    proposal.discardedAt = now();
    proposal.status = 'discarded';
    this.proposals.set(proposalId, proposal);
  }

  /**
   * Get all proposal types
   */
  getProposalTypes(): ProposalType[] {
    return Object.values(PROPOSAL_TYPES).map(t => t.key);
  }

  /**
   * Get proposal type config
   */
  getProposalTypeConfig(type: ProposalType) {
    return getProposalTypeConfig(type);
  }

  /**
   * Get all proposal types with full config
   */
  getAllProposalTypeConfigs() {
    return Object.values(PROPOSAL_TYPES);
  }
}