// arm-loomio/src/types.ts
// Domain Types for ARM Loomio - Collaborative Decision Making

import { 
  ProposalType, 
  ProposalTypeConfig, 
  STVResult, 
  VoteWeight,
  AnonymousBallot,
  ThreadItem,
  ThreadItemKind,
  GroupHierarchyNode,
  GroupPermissions,
  LegalAcceptance,
  LegalAcceptanceStatus,
} from '../lib/loomio';

import { Affiliate, Project, Investigation, Proposal, Vote, Outcome } from '@hscsg/arm-core';
import { DualValue } from '@hscsg/arm-core/src/lib/valueDual';

/**
 * Loomio Proposal - Extended ARM Proposal with decision-making features
 */
export interface LoomioProposal extends Proposal {
  type: ProposalType;
  config: ProposalTypeConfig;
  anonymous: boolean;
  hideResults: 'never' | 'until_closed' | 'always';
  stanceReasonRequired: 'disabled' | 'required' | 'required_for_disagree_or_block' | 'required_for_block';
  weightedVoting: boolean;
  voteWeights: Map<string, number>; // affiliateId -> weight
  
  // STV specific
  stvSeats?: number;
  stvMethod?: 'scottish' | 'meek';
  stvQuota?: 'droop' | 'hare';
  
  // Score specific
  scoreMin?: number;
  scoreMax?: number;
  
  // Dot vote specific
  pointsPerVoter?: number;
  
  // Meeting specific
  meetingDuration?: number;
  timeZone?: string;
  canRespondMaybe?: boolean;
  
  // Options
  options: ProposalOption[];
  
  // Results
  tally?: ProposalTally;
  stvResult?: STVResult;
}

export interface ProposalOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;          // Material icon name
  priority: number;       // Display order
  metadata?: Record<string, any>;
}

export interface ProposalTally {
  totalVotes: number;
  totalWeight: number;
  byOption: Map<string, OptionTally>;
  consensusReached?: boolean;
  consensusLevel?: number; // 0-1
  blocks: number;
  abstentions: number;
}

export interface OptionTally {
  optionId: string;
  votes: number;
  weight: number;
  percentage: number;
  averageScore?: number;
  scoreDistribution?: Map<number, number>;
  rankedPreferences?: Map<number, number>; // rank -> count
}

/**
 * Loomio Vote - Extended ARM Vote with decision-specific features
 */
export interface LoomioVote extends Vote {
  proposalId: string;
  proposalType: ProposalType;
  choices: VoteChoice[];
  reason?: string;
  reasonFormat?: 'html' | 'md';
  weight: number;
  anonymous: boolean;
  ballotId?: string; // For anonymous votes
  castAt: number;
  updatedAt?: number;
}

export interface VoteChoice {
  optionId: string;
  score?: number;      // For score voting
  rank?: number;       // For ranked/STV
  position?: number;   // Order in ballot
}

/**
 * Anonymous Vote - Cryptographically separated from identity
 */
export interface LoomioAnonymousVote extends AnonymousBallot {
  proposalId: string;
  proposalType: ProposalType;
  verified: boolean;   // Ballot hash verified
}

/**
 * Thread Item - Polymorphic thread content
 */
export interface LoomioThreadItem extends ThreadItem {
  threadId: string;
  kind: ThreadItemKind;
  content?: string;
  contentFormat?: 'html' | 'md';
  metadata?: Record<string, any>;
}

/**
 * Group with Decision-Making Features
 */
export interface LoomioGroup extends GroupHierarchyNode {
  permissions: GroupPermissions;
  effectivePermissions: GroupPermissions;
  proposalTemplates: ProposalTemplate[];
  pollTemplatePositions: Record<string, number>;
  categorizePollTemplates: boolean;
  hiddenPollTemplates: string[];
}

/**
 * Proposal Template
 */
export interface ProposalTemplate {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  type: ProposalType;
  config: Partial<ProposalTypeConfig>;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  discarded: boolean;
  discardedAt?: number;
  position: number;
}

/**
 * Membership with Decision Permissions
 */
export interface LoomioMembership {
  id: string;
  groupId: string;
  affiliateId: string;
  role: 'member' | 'admin' | 'delegate' | 'guest';
  status: 'pending' | 'accepted' | 'revoked';
  voteWeight: number;
  emailVolume: 'quiet' | 'normal' | 'loud';
  pushVolume: 'quiet' | 'normal' | 'loud';
  threadEmailVolume?: 'quiet' | 'normal' | 'loud';
  threadPushVolume?: 'quiet' | 'normal' | 'loud';
  invitedBy?: string;
  acceptedAt?: number;
  revokedAt?: number;
  revokedBy?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Thread - Container for discussions and proposals
 */
export interface LoomioThread {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  private: boolean;
  pinned: boolean;
  locked: boolean;
  lockedAt?: number;
  lockedBy?: string;
  allowComments: boolean;
  allowReactions: boolean;
  attachmentsAdminOnly: boolean;
  commentLengthMax?: number;
  tags: string[];
  itemsCount: number;
  rangesString: string;
  lastActivityAt: number;
  createdAt: number;
  updatedAt: number;
  discardedAt?: number;
  discardedBy?: string;
}

/**
 * Decision Outcome
 */
export interface LoomioOutcome extends Outcome {
  proposalId: string;
  proposalType: ProposalType;
  decision: 'approved' | 'rejected' | 'blocked' | 'consensus' | 'deferred';
  summary: string;
  details?: string;
  recordedBy: string;
  recordedAt: number;
  stvResult?: STVResult;
  tally?: ProposalTally;
}

/**
 * Decision Analytics
 */
export interface DecisionAnalytics {
  groupId: string;
  period: { start: number; end: number };
  proposalsCreated: number;
  proposalsClosed: number;
  proposalsWithOutcome: number;
  averageParticipationRate: number;
  consensusRate: number;
  blockRate: number;
  proposalTypesUsed: Map<ProposalType, number>;
  averageTimeToDecision: number; // ms
  voteWeightDistribution: {
    giniCoefficient: number;
    totalWeight: number;
    activeVoters: number;
  };
  anonymousVoteRate: number;
  stvElectionsCount: number;
}

/**
 * Group Health Metrics
 */
export interface GroupHealthMetrics {
  groupId: string;
  memberCount: number;
  activeMemberCount: number;
  proposalCount: number;
  threadCount: number;
  participationRate: number;
  decisionVelocity: number; // decisions per week
  consensusHealth: number; // 0-1
  weightFairness: number; // 1 - gini
  subgroupIntegration: number; // 0-1
  templateUsageRate: number;
  legalCompliance: number; // 0-1
}

/**
 * Proposal Creation Input
 */
export interface CreateProposalInput {
  groupId: string;
  threadId?: string;
  type: ProposalType;
  title: string;
  description?: string;
  descriptionFormat?: 'html' | 'md';
  options: { name: string; description?: string; icon?: string }[];
  config?: Partial<ProposalTypeConfig>;
  anonymous?: boolean;
  hideResults?: 'never' | 'until_closed' | 'always';
  stanceReasonRequired?: 'disabled' | 'required' | 'required_for_disagree_or_block' | 'required_for_block';
  weightedVoting?: boolean;
  durationDays?: number;
  authorId: string;
}

/**
 * Vote Casting Input
 */
export interface CastVoteInput {
  proposalId: string;
  affiliateId: string;
  choices: { optionId: string; score?: number; rank?: number }[];
  reason?: string;
  reasonFormat?: 'html' | 'md';
  anonymous?: boolean;
}

/**
 * Anonymous Vote Casting Input
 */
export interface CastAnonymousVoteInput {
  proposalId: string;
  voterToken: string;
  choices: { optionId: string; score?: number; rank?: number; position?: number }[];
}

/**
 * Thread Item Creation Input
 */
export interface AddThreadItemInput {
  threadId: string;
  kind: ThreadItemKind;
  authorId: string;
  content?: string;
  contentFormat?: 'html' | 'md';
  itemableId?: string;
  itemableType?: string;
  metadata?: Record<string, any>;
}

/**
 * Group Creation Input
 */
export interface CreateGroupInput {
  name: string;
  description?: string;
  parentId?: string;
  handle?: string;
  isVisibleToPublic?: boolean;
  isVisibleToParentMembers?: boolean;
  parentMembersCanSeeDiscussions?: boolean;
  permissions?: Partial<GroupPermissions>;
  creatorId: string;
}

/**
 * Membership Invitation Input
 */
export interface InviteMemberInput {
  groupId: string;
  email: string;
  role?: 'member' | 'admin' | 'delegate' | 'guest';
  voteWeight?: number;
  invitedBy: string;
  message?: string;
}

/**
 * Legal Acceptance Check
 */
export interface LegalComplianceCheck {
  affiliateId: string;
  canParticipate: boolean;
  required: boolean;
  acceptedVersion: string | null;
  currentVersion: string;
  gracePeriodEnd?: number;
  reason?: string;
}