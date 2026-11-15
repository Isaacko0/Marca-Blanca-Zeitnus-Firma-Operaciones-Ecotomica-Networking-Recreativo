// arm-loomio/src/core/decisionEngine.ts
// Loomio Decision Engine - Core orchestration service

import { 
  LoomioProposal, 
  LoomioVote, 
  LoomioThread, 
  LoomioGroup,
  LoomioMembership,
  LoomioOutcome,
  LoomioProposalTemplate,
  CreateProposalInput,
  CastVoteInput,
  CastAnonymousVoteInput,
  AddThreadItemInput,
  CreateGroupInput,
  InviteMemberInput,
  LegalComplianceCheck,
  DecisionAnalytics,
  GroupHealthMetrics,
} from '../../types';

import { 
  ProposalType, 
  PROPOSAL_TYPES, 
  getProposalTypeConfig,
  mergeConfig,
  validateProposalConfig,
} from '../../lib/loomio/proposalTypes';

import { 
  STVCountService, 
  STVConfig,
} from '../../lib/loomio/stv';

import { 
  VoteWeightService, 
  InMemoryVoteWeightRepository,
} from '../../lib/loomio/voteWeights';

import { 
  AnonymousVotingService, 
  InMemoryAnonymousVotingRepository,
} from '../../lib/loomio/anonymousVoting';

import { 
  ThreadSequenceManager, 
  InMemoryThreadSequenceRepository,
  ThreadItemKind,
} from '../../lib/loomio/threadSequence';

import { 
  GroupHierarchyService, 
  InMemoryGroupHierarchyRepository,
} from '../../lib/loomio/groupHierarchy';

import { 
  NotificationService, 
  InMemoryNotificationRepository,
  NotificationType,
} from '../../lib/loomio/notificationRouting';

import { 
  LegalTermsService, 
  InMemoryLegalAcceptanceRepository,
  DEFAULT_LEGAL_CONFIG,
} from '../../lib/loomio/legalAcceptance';

import { 
  LoomioReviewGateService,
  LoomioReviewGate,
  AnyLoomioOperation,
} from '../agentHuman';

import { 
  detectAllPatterns, 
  DetectionContext,
  LoomioSignal,
} from '../patterns';

import { 
  LoomioOperationType, 
  validateLoomioOperation,
  checkLoomioAuthorization,
} from '../ops';

import { 
  LoomioProposal as LoomioProposalType, 
  LoomioVote as LoomioVoteType,
  LoomioThread as LoomioThreadType,
  LoomioGroup as LoomioGroupType,
  LoomioMembership as LoomioMembershipType,
  LoomioOutcome as LoomioOutcomeType,
  LoomioProposalTemplate as LoomioProposalTemplateType,
  LoomioAnonymousVote,
  LoomioThreadItem,
  LegalAcceptanceStatus,
} from '../../types';

import { generateId, now } from '../utils';

/**
 * Loomio Decision Engine - Main orchestration service
 */
export class LoomioDecisionEngine {
  // Repositories
  private proposals = new Map<string, LoomioProposal>();
  private votes = new Map<string, LoomioVote>();
  private anonymousVotes = new Map<string, LoomioAnonymousVote>();
  private threads = new Map<string, LoomioThread>();
  private threadItems = new Map<string, LoomioThreadItem[]>();
  private groups = new Map<string, LoomioGroup>();
  private memberships = new Map<string, LoomioMembership>();
  private outcomes = new Map<string, LoomioOutcome>();
  private templates = new Map<string, LoomioProposalTemplate>();

  // Services
  private voteWeightService: VoteWeightService;
  private anonymousVotingService: AnonymousVotingService;
  private threadSequenceManager: ThreadSequenceManager;
  private groupHierarchyService: GroupHierarchyService;
  private notificationService: NotificationService;
  private legalTermsService: LegalTermsService;
  private reviewGateService: LoomioReviewGateService;

  // STV Counter
  private stvCounter: STVCountService;

  constructor() {
    // Initialize repositories
    const voteWeightRepo = new InMemoryVoteWeightRepository();
    const anonymousVotingRepo = new InMemoryAnonymousVotingRepository();
    const threadSequenceRepo = new InMemoryThreadSequenceRepository();
    const groupHierarchyRepo = new InMemoryGroupHierarchyRepository();
    const notificationRepo = new InMemoryNotificationRepository();
    const legalAcceptanceRepo = new InMemoryLegalAcceptanceRepository();

    // Initialize services
    this.voteWeightService = new VoteWeightService(voteWeightRepo);
    this.anonymousVotingService = new AnonymousVotingService(anonymousVotingRepo);
    this.threadSequenceManager = new ThreadSequenceManager();
    this.groupHierarchyService = new GroupHierarchyService();
    this.notificationService = new NotificationService(
      notificationRepo,
      new (require('../lib/loomio/notificationRouting').NotificationRouter)(
        async (recipientId, groupId, threadId) => ({
          affiliateId: recipientId,
          groupId,
          threadId,
          emailVolume: 'normal',
          pushVolume: 'normal',
          accountEmailVolume: 'normal',
          accountPushVolume: 'normal',
        }),
        async (event) => {
          // Mock delivery
          console.log(`Delivering ${event.type} to ${event.recipientIds.join(', ')}`);
        }
      )
    );
    this.legalTermsService = new LegalTermsService(DEFAULT_LEGAL_CONFIG);
    this.reviewGateService = new LoomioReviewGateService();
    this.stvCounter = new STVCountService();
  }

  // ============================================
  // PROPOSAL OPERATIONS
  // ============================================

  async createProposal(input: CreateProposalInput): Promise<LoomioProposal> {
    // Validate operation
    const validation = validateLoomioOperation({
      id: generateId('op'),
      type: 'loomio.create_proposal',
      domain: 'loomio',
      timestamp: now(),
      source: 'user',
      payload: input,
    } as any);
    if (validation.length > 0) {
      throw new Error(`Validation failed: ${validation.join(', ')}`);
    }

    // Check legal compliance
    const compliance = await this.checkLegalCompliance(input.authorId, 'create_proposal');
    if (!compliance.allowed) {
      throw new Error(compliance.reason || 'Legal compliance check failed');
    }

    // Validate proposal type config
    const typeConfig = getProposalTypeConfig(input.type);
    const mergedConfig = mergeConfig(input.type, input.config || {});
    const configErrors = validateProposalConfig(input.type, mergedConfig);
    if (configErrors.length > 0) {
      throw new Error(`Config validation failed: ${configErrors.join(', ')}`);
    }

    // Create proposal
    const proposalId = generateId('proposal');
    const proposal: LoomioProposal = {
      id: proposalId,
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

    this.proposals.set(proposalId, proposal);

    // Initialize vote weights if weighted voting enabled
    if (proposal.weightedVoting) {
      // Would initialize from group membership weights
    }

    // Add thread item
    if (input.threadId) {
      await this.addThreadItem({
        threadId: input.threadId,
        kind: 'proposal_created',
        authorId: input.authorId,
        itemableId: proposalId,
        itemableType: 'Proposal',
      });
    }

    // Notify
    await this.notifyProposalCreated(proposal);

    return proposal;
  }

  async getProposal(proposalId: string): Promise<LoomioProposal | null> {
    return this.proposals.get(proposalId) ?? null;
  }

  async closeProposal(proposalId: string, closedBy: string, reason?: string): Promise<LoomioProposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.closedAt) throw new Error('Proposal already closed');

    proposal.closedAt = now();
    proposal.closedBy = closedBy;
    proposal.closeReason = reason;
    proposal.updatedAt = now();

    // Compute tally
    proposal.tally = await this.computeTally(proposal);

    // Check if STV
    if (proposal.type === 'stv') {
      await this.countSTV(proposal);
    }

    this.proposals.set(proposalId, proposal);
    await this.notifyProposalClosed(proposal);

    return proposal;
  }

  async recordOutcome(
    proposalId: string,
    decision: 'approved' | 'rejected' | 'blocked' | 'consensus' | 'deferred',
    summary: string,
    details: string | undefined,
    recordedBy: string
  ): Promise<LoomioOutcome> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (!proposal.closedAt) throw new Error('Proposal must be closed before recording outcome');
    if (proposal.outcomeRecorded) throw new Error('Outcome already recorded');

    const outcomeId = generateId('outcome');
    const outcome: LoomioOutcome = {
      id: outcomeId,
      proposalId,
      proposalType: proposal.type,
      decision,
      summary,
      details,
      recordedBy,
      recordedAt: now(),
      stvResult: proposal.stvResult,
      tally: proposal.tally,
    };

    this.outcomes.set(outcomeId, outcome);
    proposal.outcomeRecorded = true;
    proposal.outcomeId = outcomeId;

    await this.notifyOutcomeRecorded(outcome);

    return outcome;
  }

  // ============================================
  // VOTING OPERATIONS
  // ============================================

  async castVote(input: CastVoteInput): Promise<LoomioVote> {
    const proposal = this.proposals.get(input.proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.closedAt) throw new Error('Proposal is closed');
    if (proposal.anonymous) throw new Error('Use castAnonymousVote for anonymous proposals');

    // Check eligibility
    const membership = this.getMembership(input.affiliateId, proposal.groupId);
    if (!membership || membership.status !== 'accepted') {
      throw new Error('Not eligible to vote');
    }

    // Check legal compliance
    const compliance = await this.checkLegalCompliance(input.affiliateId, 'cast_vote');
    if (!compliance.allowed) {
      throw new Error(compliance.reason || 'Legal compliance check failed');
    }

    // Validate choices
    this.validateVoteChoices(proposal, input.choices);

    // Get vote weight
    const weight = await this.voteWeightService.getWeight(input.affiliateId, proposal.groupId);

    const voteId = generateId('vote');
    const vote: LoomioVote = {
      id: voteId,
      proposalId: input.proposalId,
      proposalType: proposal.type,
      affiliateId: input.affiliateId,
      choices: input.choices.map((c, index) => ({
        optionId: c.optionId,
        score: c.score,
        rank: c.rank,
        position: index,
      })),
      reason: input.reason,
      reasonFormat: input.reasonFormat || 'html',
      weight,
      anonymous: false,
      castAt: now(),
    };

    // Store vote
    if (!this.votes.has(input.proposalId)) {
      this.votes.set(input.proposalId, []);
    }
    this.votes.get(input.proposalId)!.push(vote);

    // Update proposal tally (real-time)
    proposal.tally = await this.computeTally(proposal);
    this.proposals.set(proposal.id, proposal);

    // Notify
    await this.notifyVoteCast(vote);

    return vote;
  }

  async castAnonymousVote(input: CastAnonymousVoteInput): Promise<LoomioAnonymousVote> {
    const result = await this.anonymousVotingService.submitBallot(input);
    if (!result.valid || !result.ballot) {
      throw new Error(result.error || 'Failed to submit anonymous ballot');
    }

    const proposal = this.proposals.get(input.proposalId);
    if (!proposal) throw new Error('Proposal not found');

    // Store anonymous vote
    if (!this.anonymousVotes.has(input.proposalId)) {
      this.anonymousVotes.set(input.proposalId, []);
    }
    this.anonymousVotes.get(input.proposalId)!.push(result.ballot);

    // Update tally
    proposal.tally = await this.computeTally(proposal);
    this.proposals.set(proposal.id, proposal);

    return result.ballot;
  }

  // ============================================
  // THREAD OPERATIONS
  // ============================================

  async createThread(input: {
    groupId: string;
    title: string;
    description?: string;
    private?: boolean;
    allowComments?: boolean;
    allowReactions?: boolean;
    attachmentsAdminOnly?: boolean;
    tags?: string[];
    authorId: string;
  }): Promise<LoomioThread> {
    const threadId = generateId('thread');
    const thread: LoomioThread = {
      id: threadId,
      groupId: input.groupId,
      title: input.title,
      description: input.description,
      private: input.private ?? false,
      pinned: false,
      locked: false,
      allowComments: input.allowComments ?? true,
      allowReactions: input.allowReactions ?? true,
      attachmentsAdminOnly: input.attachmentsAdminOnly ?? false,
      tags: input.tags ?? [],
      itemsCount: 0,
      rangesString: '',
      lastActivityAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };

    this.threads.set(threadId, thread);
    this.threadItems.set(threadId, []);

    return thread;
  }

  async addThreadItem(input: AddThreadItemInput): Promise<LoomioThreadItem> {
    const thread = this.threads.get(input.threadId);
    if (!thread) throw new Error('Thread not found');
    if (thread.lockedAt) throw new Error('Thread is locked');

    const item = this.threadSequenceManager.addItem({
      ...input,
      threadId: input.threadId,
    });

    // Update thread metadata
    thread.itemsCount = this.threadSequenceManager.getState(input.threadId).itemsCount;
    thread.rangesString = this.threadSequenceManager.getState(input.threadId).rangesString;
    thread.lastActivityAt = input.createdAt;
    thread.updatedAt = now();

    // Store item
    const items = this.threadItems.get(input.threadId) ?? [];
    items.push(item);
    this.threadItems.set(input.threadId, items);

    return item;
  }

  async lockThread(threadId: string, lockedBy: string, reason?: string): Promise<LoomioThread> {
    const thread = this.threads.get(threadId);
    if (!thread) throw new Error('Thread not found');
    if (thread.lockedAt) throw new Error('Thread already locked');

    thread.lockedAt = now();
    thread.lockedBy = lockedBy;
    thread.lockReason = reason;
    thread.updatedAt = now();

    this.threads.set(threadId, thread);
    return thread;
  }

  async unlockThread(threadId: string, unlockedBy: string): Promise<LoomioThread> {
    const thread = this.threads.get(threadId);
    if (!thread) throw new Error('Thread not found');
    if (!thread.lockedAt) throw new Error('Thread not locked');

    thread.lockedAt = undefined;
    thread.lockedBy = undefined;
    thread.lockReason = undefined;
    thread.updatedAt = now();

    this.threads.set(threadId, thread);
    return thread;
  }

  // ============================================
  // GROUP OPERATIONS
  // ============================================

  async createGroup(input: CreateGroupInput): Promise<LoomioGroup> {
    // Validate hierarchy
    if (input.parentId) {
      const error = this.groupHierarchyService.validateMove(input.name, input.parentId);
      if (error) throw new Error(error);
    }

    const groupId = generateId('group');
    const group: LoomioGroup = {
      id: groupId,
      name: input.name,
      description: input.description,
      parentId: input.parentId,
      handle: input.handle,
      isVisibleToPublic: input.isVisibleToPublic ?? true,
      isVisibleToParentMembers: input.isVisibleToParentMembers ?? true,
      parentMembersCanSeeDiscussions: input.parentMembersCanSeeDiscussions ?? false,
      discussionPrivacyOptions: ['private', 'group', 'public'],
      membersCanAddMembers: false,
      membersCanAddGuests: false,
      membersCanVote: true,
      membersCanEditDiscussions: true,
      membersCanEditComments: true,
      membersCanDeleteComments: false,
      membersCanRaiseMotions: true,
      membersCanStartDiscussions: true,
      nonMembersCanStartDiscussions: false,
      membersCanCreateSubgroups: false,
      membersCanCreateTags: true,
      membersCanAnnounce: true,
      membersCanCreateTemplates: false,
      adminsCanEditUserContent: true,
      listedInExplore: true,
      attachmentsAdminOnly: false,
      subscriptionId: null,
      subscriptionActive: false,
      subscriptionMaxThreads: null,
      permissions: { ...input.permissions },
      effectivePermissions: { ...input.permissions },
      proposalTemplates: [],
      pollTemplatePositions: {},
      categorizePollTemplates: true,
      hiddenPollTemplates: [],
      createdAt: now(),
      updatedAt: now(),
      creatorId: input.creatorId,
    };

    this.groups.set(groupId, group);
    this.groupHierarchyService.registerGroup(group);

    // Create creator membership
    await this.createMembership({
      groupId,
      affiliateId: input.creatorId,
      role: 'admin',
      invitedBy: input.creatorId,
    });

    return group;
  }

  async getGroup(groupId: string): Promise<LoomioGroup | null> {
    return this.groups.get(groupId) ?? null;
  }

  // ============================================
  // MEMBERSHIP OPERATIONS
  // ============================================

  async createMembership(input: {
    groupId: string;
    affiliateId: string;
    role: 'member' | 'admin' | 'delegate' | 'guest';
    invitedBy: string;
  }): Promise<LoomioMembership> {
    const membershipId = generateId('membership');
    const membership: LoomioMembership = {
      id: membershipId,
      groupId: input.groupId,
      affiliateId: input.affiliateId,
      role: input.role,
      status: 'accepted',
      voteWeight: 1,
      emailVolume: 'normal',
      pushVolume: 'normal',
      invitedBy: input.invitedBy,
      acceptedAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };

    this.memberships.set(membershipId, membership);

    // Initialize vote weight
    await this.voteWeightService.setWeight(input.affiliateId, input.groupId, 1, input.invitedBy);

    return membership;
  }

  getMembership(affiliateId: string, groupId: string): LoomioMembership | null {
    for (const membership of this.memberships.values()) {
      if (membership.affiliateId === affiliateId && membership.groupId === groupId) {
        return membership;
      }
    }
    return null;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private validateVoteChoices(proposal: LoomioProposal, choices: { optionId: string; score?: number; rank?: number }[]): void {
    const optionIds = new Set(proposal.options.map(o => o.id));
    
    for (const choice of choices) {
      if (!optionIds.has(choice.optionId)) {
        throw new Error(`Invalid option: ${choice.optionId}`);
      }
    }

    // Type-specific validation
    switch (proposal.type) {
      case 'proposal':
      case 'consent':
      case 'consensus':
        // Must choose exactly one of agree/disagree/block
        if (choices.length !== 1) throw new Error('Must choose exactly one option');
        break;
      case 'poll':
        if (proposal.config.choiceCountMin && choices.length < proposal.config.choiceCountMin) {
          throw new Error(`Must choose at least ${proposal.config.choiceCountMin} options`);
        }
        if (proposal.config.choiceCountMax && choices.length > proposal.config.choiceCountMax) {
          throw new Error(`Must choose at most ${proposal.config.choiceCountMax} options`);
        }
        break;
      case 'score':
        for (const choice of choices) {
          if (choice.score === undefined) throw new Error('Score required for all choices');
          if (choice.score < (proposal.scoreMin ?? 0) || choice.score > (proposal.scoreMax ?? 100)) {
            throw new Error(`Score must be between ${proposal.scoreMin} and ${proposal.scoreMax}`);
          }
        }
        break;
      case 'dot_vote':
        const totalPoints = choices.reduce((sum, c) => sum + (c.score ?? 1), 0);
        if (totalPoints > (proposal.pointsPerVoter ?? 10)) {
          throw new Error(`Cannot exceed ${proposal.pointsPerVoter} points`);
        }
        break;
      case 'ranked_choice':
      case 'stv':
        const ranks = choices.map(c => c.rank).filter((r): r is number => r !== undefined);
        if (new Set(ranks).size !== ranks.length) {
          throw new Error('Ranks must be unique');
        }
        break;
    }
  }

  private async computeTally(proposal: LoomioProposal): Promise<any> {
    // Get all votes for proposal
    const votes = this.votes.get(proposal.id) ?? [];
    const anonymousVotes = this.anonymousVotes.get(proposal.id) ?? [];

    // Type-specific tally computation
    // This would be expanded with full tally logic
    return {
      totalVotes: votes.length + anonymousVotes.length,
      totalWeight: votes.reduce((sum, v) => sum + v.weight, 0) + anonymousVotes.length,
      byOption: new Map(),
    };
  }

  private async countSTV(proposal: LoomioProposal): Promise<void> {
    const anonymousVotes = this.anonymousVotes.get(proposal.id) ?? [];
    const votes = this.votes.get(proposal.id) ?? [];

    const stvConfig: any = {
      seats: proposal.stvSeats ?? 1,
      method: proposal.stvMethod ?? 'scottish',
      quotaType: proposal.stvQuota ?? 'droop',
      candidates: proposal.options.map(o => ({
        id: o.id,
        name: o.name,
        elected: false,
        eliminated: false,
        votes: 0,
        keepValue: 1,
      })),
      ballots: [
        ...votes.map(v => ({
          preferences: v.choices
            .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
            .map(c => c.optionId),
          weight: v.weight,
        })),
        ...anonymousVotes.map(v => ({
          preferences: v.choices
            .sort((a, b) => a.position - b.position)
            .map(c => c.proposalOptionId),
          weight: 1,
        })),
      ],
    };

    const result = this.stvCounter.count(stvConfig);
    proposal.stvResult = result;
  }

  private async checkLegalCompliance(affiliateId: string, action: string): Promise<LegalComplianceCheck> {
    return this.legalTermsService.canParticipate(affiliateId);
  }

  private async notifyProposalCreated(proposal: LoomioProposal): Promise<void> {
    // Notification logic
  }

  private async notifyProposalClosed(proposal: LoomioProposal): Promise<void> {
    // Notification logic
  }

  private async notifyVoteCast(vote: LoomioVote): Promise<void> {
    // Notification logic
  }

  private async notifyOutcomeRecorded(outcome: LoomioOutcome): Promise<void> {
    // Notification logic
  }

  // ============================================
  // ANALYTICS
  // ============================================

  async getDecisionAnalytics(groupId: string, period: { start: number; end: number }): Promise<DecisionAnalytics> {
    // Implementation
    return {} as DecisionAnalytics;
  }

  async getGroupHealthMetrics(groupId: string): Promise<GroupHealthMetrics> {
    // Implementation
    return {} as GroupHealthMetrics;
  }

  async detectPatterns(groupId: string): Promise<LoomioSignal[]> {
    const context: DetectionContext = {
      group: this.groups.get(groupId)!,
      proposals: Array.from(this.proposals.values()).filter(p => p.groupId === groupId),
      votes: Array.from(this.votes.values()).flat(),
      memberships: Array.from(this.memberships.values()).filter(m => m.groupId === groupId),
      threads: Array.from(this.threads.values()).filter(t => t.groupId === groupId),
      timeRange: { start: Date.now() - 30 * 24 * 60 * 60 * 1000, end: Date.now() },
    };

    return detectAllPatterns(context);
  }
}