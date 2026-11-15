// arm-loomio/src/ops.ts
// Single Write Path Operations for Loomio Decision-Making Domain
// Following ARM Invariant: "One Write Path"

import { 
  LoomioProposal, 
  LoomioVote, 
  LoomioAnonymousVote, 
  LoomioThreadItem, 
  LoomioThread,
  LoomioGroup,
  LoomioMembership,
  LoomioOutcome,
  ProposalTemplate,
  CreateProposalInput,
  CastVoteInput,
  CastAnonymousVoteInput,
  AddThreadItemInput,
  CreateGroupInput,
  InviteMemberInput,
  LegalComplianceCheck,
} from './types';

import { 
  ProposalType, 
  ProposalTypeConfig, 
  STVResult,
  AnonymousBallot,
} from '../lib/loomio';

import { Operation, OperationResult } from '@hscsg/arm-core/src/ops';

/**
 * Operation Types for Loomio Domain
 */
export enum LoomioOperationType {
  // Proposals
  CREATE_PROPOSAL = 'loomio.create_proposal',
  UPDATE_PROPOSAL = 'loomio.update_proposal',
  CLOSE_PROPOSAL = 'loomio.close_proposal',
  RECORD_OUTCOME = 'loomio.record_outcome',
  
  // Voting
  CAST_VOTE = 'loomio.cast_vote',
  UPDATE_VOTE = 'loomio.update_vote',
  CAST_ANONYMOUS_VOTE = 'loomio.cast_anonymous_vote',
  
  // Threads
  CREATE_THREAD = 'loomio.create_thread',
  ADD_THREAD_ITEM = 'loomio.add_thread_item',
  LOCK_THREAD = 'loomio.lock_thread',
  UNLOCK_THREAD = 'loomio.unlock_thread',
  REORDER_THREAD_ITEMS = 'loomio.reorder_thread_items',
  
  // Groups
  CREATE_GROUP = 'loomio.create_group',
  UPDATE_GROUP = 'loomio.update_group',
  ARCHIVE_GROUP = 'loomio.archive_group',
  UPDATE_GROUP_PERMISSIONS = 'loomio.update_group_permissions',
  
  // Memberships
  INVITE_MEMBER = 'loomio.invite_member',
  ACCEPT_INVITATION = 'loomio.accept_invitation',
  REVOKE_MEMBERSHIP = 'loomio.revoke_membership',
  UPDATE_MEMBER_ROLE = 'loomio.update_member_role',
  UPDATE_VOTE_WEIGHT = 'loomio.update_vote_weight',
  BULK_UPDATE_VOTE_WEIGHTS = 'loomio.bulk_update_vote_weights',
  
  // Templates
  CREATE_PROPOSAL_TEMPLATE = 'loomio.create_proposal_template',
  UPDATE_PROPOSAL_TEMPLATE = 'loomio.update_proposal_template',
  PUBLISH_PROPOSAL_TEMPLATE = 'loomio.publish_proposal_template',
  DISCARD_PROPOSAL_TEMPLATE = 'loomio.discard_proposal_template',
  
  // Legal
  ACCEPT_LEGAL_TERMS = 'loomio.accept_legal_terms',
  CHECK_LEGAL_COMPLIANCE = 'loomio.check_legal_compliance',
}

// Base Operation Interface
export interface LoomioOperation extends Operation {
  domain: 'loomio';
  timestamp: number;
  source: 'user' | 'agent' | 'system';
  correlationId?: string;
}

// Proposal Operations
export interface CreateProposalOperation extends LoomioOperation {
  type: LoomioOperationType.CREATE_PROPOSAL;
  payload: CreateProposalInput;
}

export interface UpdateProposalOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_PROPOSAL;
  payload: {
    proposalId: string;
    updates: Partial<CreateProposalInput>;
    // Config freeze validation for anonymous proposals
    skipConfigValidation?: boolean;
  };
}

export interface CloseProposalOperation extends LoomioOperation {
  type: LoomioOperationType.CLOSE_PROPOSAL;
  payload: {
    proposalId: string;
    closedBy: string;
    reason?: string;
  };
}

export interface RecordOutcomeOperation extends LoomioOperation {
  type: LoomioOperationType.RECORD_OUTCOME;
  payload: {
    proposalId: string;
    decision: 'approved' | 'rejected' | 'blocked' | 'consensus' | 'deferred';
    summary: string;
    details?: string;
    recordedBy: string;
  };
}

// Voting Operations
export interface CastVoteOperation extends LoomioOperation {
  type: LoomioOperationType.CAST_VOTE;
  payload: CastVoteInput;
}

export interface UpdateVoteOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_VOTE;
  payload: {
    voteId: string;
    affiliateId: string;
    choices: { optionId: string; score?: number; rank?: number }[];
    reason?: string;
  };
}

export interface CastAnonymousVoteOperation extends LoomioOperation {
  type: LoomioOperationType.CAST_ANONYMOUS_VOTE;
  payload: CastAnonymousVoteInput;
}

// Thread Operations
export interface CreateThreadOperation extends LoomioOperation {
  type: LoomioOperationType.CREATE_THREAD;
  payload: {
    groupId: string;
    title: string;
    description?: string;
    private?: boolean;
    allowComments?: boolean;
    allowReactions?: boolean;
    attachmentsAdminOnly?: boolean;
    tags?: string[];
    authorId: string;
  };
}

export interface AddThreadItemOperation extends LoomioOperation {
  type: LoomioOperationType.ADD_THREAD_ITEM;
  payload: AddThreadItemInput;
}

export interface LockThreadOperation extends LoomioOperation {
  type: LoomioOperationType.LOCK_THREAD;
  payload: {
    threadId: string;
    lockedBy: string;
    reason?: string;
  };
}

export interface UnlockThreadOperation extends LoomioOperation {
  type: LoomioOperationType.UNLOCK_THREAD;
  payload: {
    threadId: string;
    unlockedBy: string;
  };
}

export interface ReorderThreadItemsOperation extends LoomioOperation {
  type: LoomioOperationType.REORDER_THREAD_ITEMS;
  payload: {
    threadId: string;
    newOrder: number[]; // sequenceIds in new order
    reorderedBy: string;
  };
}

// Group Operations
export interface CreateGroupOperation extends LoomioOperation {
  type: LoomioOperationType.CREATE_GROUP;
  payload: CreateGroupInput;
}

export interface UpdateGroupOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_GROUP;
  payload: {
    groupId: string;
    updates: Partial<CreateGroupInput>;
    updatedBy: string;
  };
}

export interface ArchiveGroupOperation extends LoomioOperation {
  type: LoomioOperationType.ARCHIVE_GROUP;
  payload: {
    groupId: string;
    archivedBy: string;
    reason?: string;
  };
}

export interface UpdateGroupPermissionsOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_GROUP_PERMISSIONS;
  payload: {
    groupId: string;
    permissions: Partial<import('../lib/loomio').GroupPermissions>;
    updatedBy: string;
  };
}

// Membership Operations
export interface InviteMemberOperation extends LoomioOperation {
  type: LoomioOperationType.INVITE_MEMBER;
  payload: InviteMemberInput;
}

export interface AcceptInvitationOperation extends LoomioOperation {
  type: LoomioOperationType.ACCEPT_INVITATION;
  payload: {
    invitationId: string;
    affiliateId: string;
  };
}

export interface RevokeMembershipOperation extends LoomioOperation {
  type: LoomioOperationType.REVOKE_MEMBERSHIP;
  payload: {
    membershipId: string;
    revokedBy: string;
    reason?: string;
  };
}

export interface UpdateMemberRoleOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_MEMBER_ROLE;
  payload: {
    membershipId: string;
    role: 'member' | 'admin' | 'delegate' | 'guest';
    updatedBy: string;
  };
}

export interface UpdateVoteWeightOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_VOTE_WEIGHT;
  payload: {
    groupId: string;
    affiliateId: string;
    weight: number;
    setBy: string;
    reason?: string;
  };
}

export interface BulkUpdateVoteWeightsOperation extends LoomioOperation {
  type: LoomioOperationType.BULK_UPDATE_VOTE_WEIGHTS;
  payload: {
    groupId: string;
    weights: { affiliateId: string; weight: number }[];
    setBy: string;
  };
}

// Template Operations
export interface CreateProposalTemplateOperation extends LoomioOperation {
  type: LoomioOperationType.CREATE_PROPOSAL_TEMPLATE;
  payload: {
    groupId: string;
    name: string;
    description?: string;
    type: ProposalType;
    config: Partial<ProposalTypeConfig>;
    createdBy: string;
  };
}

export interface UpdateProposalTemplateOperation extends LoomioOperation {
  type: LoomioOperationType.UPDATE_PROPOSAL_TEMPLATE;
  payload: {
    templateId: string;
    updates: Partial<ProposalTemplate>;
    updatedBy: string;
  };
}

export interface PublishProposalTemplateOperation extends LoomioOperation {
  type: LoomioOperationType.PUBLISH_PROPOSAL_TEMPLATE;
  payload: {
    templateId: string;
    publishedBy: string;
  };
}

export interface DiscardProposalTemplateOperation extends LoomioOperation {
  type: LoomioOperationType.DISCARD_PROPOSAL_TEMPLATE;
  payload: {
    templateId: string;
    discardedBy: string;
  };
}

// Legal Operations
export interface AcceptLegalTermsOperation extends LoomioOperation {
  type: LoomioOperationType.ACCEPT_LEGAL_TERMS;
  payload: {
    affiliateId: string;
    version?: string;
    ipAddress?: string;
    userAgent?: string;
    method?: 'explicit' | 'implicit' | 'admin_action';
  };
}

export interface CheckLegalComplianceOperation extends LoomioOperation {
  type: LoomioOperationType.CHECK_LEGAL_COMPLIANCE;
  payload: {
    affiliateId: string;
    action: 'create_proposal' | 'cast_vote' | 'join_group';
  };
}

// Union type for all Loomio operations
export type AnyLoomioOperation =
  | CreateProposalOperation
  | UpdateProposalOperation
  | CloseProposalOperation
  | RecordOutcomeOperation
  | CastVoteOperation
  | UpdateVoteOperation
  | CastAnonymousVoteOperation
  | CreateThreadOperation
  | AddThreadItemOperation
  | LockThreadOperation
  | UnlockThreadOperation
  | ReorderThreadItemsOperation
  | CreateGroupOperation
  | UpdateGroupOperation
  | ArchiveGroupOperation
  | UpdateGroupPermissionsOperation
  | InviteMemberOperation
  | AcceptInvitationOperation
  | RevokeMembershipOperation
  | UpdateMemberRoleOperation
  | UpdateVoteWeightOperation
  | BulkUpdateVoteWeightsOperation
  | CreateProposalTemplateOperation
  | UpdateProposalTemplateOperation
  | PublishProposalTemplateOperation
  | DiscardProposalTemplateOperation
  | AcceptLegalTermsOperation
  | CheckLegalComplianceOperation;

/**
 * Operation Result Types
 */
export interface CreateProposalResult extends OperationResult {
  data: LoomioProposal;
}

export interface CastVoteResult extends OperationResult {
  data: LoomioVote;
}

export interface CastAnonymousVoteResult extends OperationResult {
  data: LoomioAnonymousVote;
}

export interface RecordOutcomeResult extends OperationResult {
  data: LoomioOutcome;
}

export interface CreateThreadResult extends OperationResult {
  data: LoomioThread;
}

export interface AddThreadItemResult extends OperationResult {
  data: LoomioThreadItem;
}

export interface CreateGroupResult extends OperationResult {
  data: LoomioGroup;
}

export interface InviteMemberResult extends OperationResult {
  data: { invitationId: string; membershipId: string };
}

export interface UpdateVoteWeightResult extends OperationResult {
  data: { weight: number; auditEntryId: string };
}

export interface BulkUpdateVoteWeightsResult extends OperationResult {
  data: { 
    updated: { affiliateId: string; weight: number }[];
    failed: { affiliateId: string; error: string }[];
  };
}

export interface CreateProposalTemplateResult extends OperationResult {
  data: ProposalTemplate;
}

export interface AcceptLegalTermsResult extends OperationResult {
  data: import('../lib/loomio').LegalAcceptance;
}

export interface CheckLegalComplianceResult extends OperationResult {
  data: LegalComplianceCheck;
}

/**
 * Operation Validation Rules (ARM Invariant: "Nothing Lands Unapproved")
 */
export const LOOMIO_OPERATION_RULES: Record<LoomioOperationType, {
  requiresAuth: boolean;
  requiresGroupMembership: boolean;
  requiresGroupAdmin: boolean;
  requiresThreadAdmin: boolean;
  requiresLegalAcceptance: boolean;
  validation: (payload: any) => string[];
}> = {
  [LoomioOperationType.CREATE_PROPOSAL]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.title?.trim()) errors.push('Title is required');
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.type) errors.push('Proposal type is required');
      if (!payload.authorId) errors.push('Author ID is required');
      if (payload.options && payload.options.length < 2 && payload.type !== 'proposal' && payload.type !== 'consent' && payload.type !== 'consensus') {
        errors.push('At least 2 options required for this proposal type');
      }
      return errors;
    },
  },
  
  [LoomioOperationType.CAST_VOTE]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.proposalId) errors.push('Proposal ID is required');
      if (!payload.affiliateId) errors.push('Affiliate ID is required');
      if (!payload.choices || payload.choices.length === 0) errors.push('At least one choice required');
      return errors;
    },
  },
  
  [LoomioOperationType.CAST_ANONYMOUS_VOTE]: {
    requiresAuth: false, // Token-based
    requiresGroupMembership: false,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: false,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.proposalId) errors.push('Proposal ID is required');
      if (!payload.voterToken) errors.push('Voter token is required');
      if (!payload.choices || payload.choices.length === 0) errors.push('At least one choice required');
      return errors;
    },
  },
  
  [LoomioOperationType.RECORD_OUTCOME]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: true, // Only thread admins
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.proposalId) errors.push('Proposal ID is required');
      if (!payload.decision) errors.push('Decision is required');
      if (!payload.summary?.trim()) errors.push('Summary is required');
      if (!payload.recordedBy) errors.push('Recorded by is required');
      return errors;
    },
  },
  
  [LoomioOperationType.CREATE_THREAD]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.title?.trim()) errors.push('Title is required');
      if (!payload.authorId) errors.push('Author ID is required');
      return errors;
    },
  },
  
  [LoomioOperationType.ADD_THREAD_ITEM]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.threadId) errors.push('Thread ID is required');
      if (!payload.kind) errors.push('Item kind is required');
      if (!payload.authorId) errors.push('Author ID is required');
      return errors;
    },
  },
  
  [LoomioOperationType.LOCK_THREAD]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false,
    requiresThreadAdmin: true,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.threadId) errors.push('Thread ID is required');
      if (!payload.lockedBy) errors.push('Locked by is required');
      return errors;
    },
  },
  
  [LoomioOperationType.CREATE_GROUP]: {
    requiresAuth: true,
    requiresGroupMembership: false,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.name?.trim()) errors.push('Name is required');
      if (!payload.creatorId) errors.push('Creator ID is required');
      if (payload.parentId && payload.handle && !payload.handle.startsWith(payload.parentId + '-')) {
        errors.push('Subgroup handle must start with parent handle');
      }
      return errors;
    },
  },
  
  [LoomioOperationType.INVITE_MEMBER]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: true, // Or membersCanAddMembers permission
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.email?.trim()) errors.push('Email is required');
      if (!payload.invitedBy) errors.push('Invited by is required');
      return errors;
    },
  },
  
  [LoomioOperationType.UPDATE_VOTE_WEIGHT]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: true,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.affiliateId) errors.push('Affiliate ID is required');
      if (payload.weight === undefined || payload.weight === null) errors.push('Weight is required');
      if (payload.weight < 0) errors.push('Weight cannot be negative');
      if (payload.weight > 999.999) errors.push('Weight exceeds maximum');
      if (!payload.setBy) errors.push('Set by is required');
      return errors;
    },
  },
  
  [LoomioOperationType.BULK_UPDATE_VOTE_WEIGHTS]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: true,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.weights || payload.weights.length === 0) errors.push('Weights array required');
      if (!payload.setBy) errors.push('Set by is required');
      for (const w of payload.weights) {
        if (w.weight < 0) errors.push(`Negative weight for ${w.affiliateId}`);
        if (w.weight > 999.999) errors.push(`Weight exceeds maximum for ${w.affiliateId}`);
      }
      return errors;
    },
  },
  
  [LoomioOperationType.CREATE_PROPOSAL_TEMPLATE]: {
    requiresAuth: true,
    requiresGroupMembership: true,
    requiresGroupAdmin: false, // Or membersCanCreateTemplates
    requiresThreadAdmin: false,
    requiresLegalAcceptance: true,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.groupId) errors.push('Group ID is required');
      if (!payload.name?.trim()) errors.push('Name is required');
      if (!payload.type) errors.push('Proposal type is required');
      if (!payload.createdBy) errors.push('Created by is required');
      return errors;
    },
  },
  
  [LoomioOperationType.ACCEPT_LEGAL_TERMS]: {
    requiresAuth: true,
    requiresGroupMembership: false,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: false, // This IS the legal acceptance
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.affiliateId) errors.push('Affiliate ID is required');
      return errors;
    },
  },
  
  [LoomioOperationType.CHECK_LEGAL_COMPLIANCE]: {
    requiresAuth: true,
    requiresGroupMembership: false,
    requiresGroupAdmin: false,
    requiresThreadAdmin: false,
    requiresLegalAcceptance: false,
    validation: (payload) => {
      const errors: string[] = [];
      if (!payload.affiliateId) errors.push('Affiliate ID is required');
      if (!payload.action) errors.push('Action is required');
      return errors;
    },
  },
  
  // Default rules for other operations
  [LoomioOperationType.UPDATE_PROPOSAL]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.CLOSE_PROPOSAL]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UPDATE_VOTE]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.CREATE_THREAD]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UNLOCK_THREAD]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: true, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.REORDER_THREAD_ITEMS]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: true, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UPDATE_GROUP]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.ARCHIVE_GROUP]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UPDATE_GROUP_PERMISSIONS]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.ACCEPT_INVITATION]: { requiresAuth: true, requiresGroupMembership: false, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.REVOKE_MEMBERSHIP]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UPDATE_MEMBER_ROLE]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.UPDATE_PROPOSAL_TEMPLATE]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.PUBLISH_PROPOSAL_TEMPLATE]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: true, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
  [LoomioOperationType.DISCARD_PROPOSAL_TEMPLATE]: { requiresAuth: true, requiresGroupMembership: true, requiresGroupAdmin: false, requiresThreadAdmin: false, requiresLegalAcceptance: true, validation: () => [] },
};

/**
 * Validate operation before execution
 */
export function validateLoomioOperation(operation: AnyLoomioOperation): string[] {
  const rules = LOOMIO_OPERATION_RULES[operation.type];
  if (!rules) return [];
  return rules.validation(operation.payload);
}

/**
 * Check operation authorization
 */
export function checkLoomioAuthorization(
  operation: AnyLoomioOperation,
  context: {
    affiliateId: string;
    groupId?: string;
    threadId?: string;
    isGroupAdmin: boolean;
    isThreadAdmin: boolean;
    hasLegalAcceptance: boolean;
  }
): { allowed: boolean; reason?: string } {
  const rules = LOOMIO_OPERATION_RULES[operation.type];
  if (!rules) return { allowed: true };
  
  if (rules.requiresAuth && !context.affiliateId) {
    return { allowed: false, reason: 'Authentication required' };
  }
  
  if (rules.requiresGroupMembership && context.groupId) {
    // In real implementation, check membership
  }
  
  if (rules.requiresGroupAdmin && !context.isGroupAdmin) {
    return { allowed: false, reason: 'Group admin required' };
  }
  
  if (rules.requiresThreadAdmin && !context.isThreadAdmin) {
    return { allowed: false, reason: 'Thread admin required' };
  }
  
  if (rules.requiresLegalAcceptance && !context.hasLegalAcceptance) {
    return { allowed: false, reason: 'Legal terms acceptance required' };
  }
  
  return { allowed: true };
}