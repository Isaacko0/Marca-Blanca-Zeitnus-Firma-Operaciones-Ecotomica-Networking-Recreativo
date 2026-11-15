// arm-loomio/src/agentHuman.ts
// Agent-Human Review Gates for Loomio Decision-Making
// ARM Invariant: "Nothing Lands Unapproved"

import { 
  LoomioProposal, 
  LoomioVote, 
  LoomioThread, 
  LoomioGroup,
  LoomioMembership,
  LoomioProposalTemplate,
} from './types';

import { 
  LoomioOperationType, 
  AnyLoomioOperation,
  LOOMIO_OPERATION_RULES,
} from './ops';

/**
 * Review Gate Types for Loomio
 */
export enum LoomioReviewGate {
  // Proposal gates
  PROPOSAL_CREATION = 'loomio.proposal.creation',
  PROPOSAL_CONFIG_FREEZE = 'loomio.proposal.config_freeze',
  PROPOSAL_CLOSURE = 'loomio.proposal.closure',
  PROPOSAL_OUTCOME = 'loomio.proposal.outcome',
  
  // Voting gates
  VOTE_CASTING = 'loomio.vote.casting',
  ANONYMOUS_VOTE_CASTING = 'loomio.vote.anonymous_casting',
  VOTE_WEIGHT_ASSIGNMENT = 'loomio.vote.weight_assignment',
  
  // Thread gates
  THREAD_CREATION = 'loomio.thread.creation',
  THREAD_LOCK = 'loomio.thread.lock',
  THREAD_UNLOCK = 'loomio.thread.unlock',
  THREAD_ITEM_ADDITION = 'loomio.thread.item_addition',
  
  // Group gates
  GROUP_CREATION = 'loomio.group.creation',
  GROUP_PERMISSIONS = 'loomio.group.permissions',
  GROUP_ARCHIVE = 'loomio.group.archive',
  
  // Membership gates
  MEMBERSHIP_INVITATION = 'loomio.membership.invitation',
  MEMBERSHIP_APPROVAL = 'loomio.membership.approval',
  MEMBERSHIP_REVOCATION = 'loomio.membership.revocation',
  MEMBER_ROLE_CHANGE = 'loomio.member.role_change',
  
  // Template gates
  TEMPLATE_CREATION = 'loomio.template.creation',
  TEMPLATE_PUBLICATION = 'loomio.template.publication',
  
  // Legal gates
  LEGAL_ACCEPTANCE = 'loomio.legal.acceptance',
}

/**
 * Review Gate Configuration
 */
export interface ReviewGateConfig {
  gate: LoomioReviewGate;
  description: string;
  autoApproveTimeoutMs: number; // 0 = no auto-approve
  requiredReviewers: number;
  reviewerRoles: string[]; // Roles that can review
  escalationPath: string[]; // Roles to escalate to
  conditions: GateCondition[];
}

export interface GateCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'matches';
  value: any;
}

/**
 * Review Request
 */
export interface ReviewRequest {
  id: string;
  gate: LoomioReviewGate;
  operationId: string;
  operationType: string;
  payload: any;
  requesterId: string;
  groupId: string;
  threadId?: string;
  proposalId?: string;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'auto_approved' | 'expired';
  reviewers: ReviewAssignment[];
  decision?: ReviewDecision;
}

export interface ReviewAssignment {
  reviewerId: string;
  role: string;
  assignedAt: number;
  respondedAt?: number;
  decision?: 'approve' | 'reject';
  comment?: string;
}

export interface ReviewDecision {
  approved: boolean;
  decidedBy: string;
  decidedAt: number;
  comment?: string;
  conditions?: string[];
}

/**
 * Review Gate Service
 */
export class LoomioReviewGateService {
  private gates = new Map<LoomioReviewGate, ReviewGateConfig>();
  private requests = new Map<string, ReviewRequest>();
  private operationToGate = new Map<string, LoomioReviewGate>();

  constructor() {
    this.initializeDefaultGates();
    this.mapOperationsToGates();
  }

  private initializeDefaultGates(): void {
    const defaultGates: ReviewGateConfig[] = [
      // Proposal Gates
      {
        gate: LoomioReviewGate.PROPOSAL_CREATION,
        description: 'Review new proposal creation (members_can_raise_motions permission)',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0, // Permission-based, not review-based
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [
          { field: 'payload.type', operator: 'equals', value: 'proposal' }, // Only for formal proposals
        ],
      },
      {
        gate: LoomioReviewGate.PROPOSAL_CONFIG_FREEZE,
        description: 'Anonymous ballot configuration frozen after first ballot',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [
          { field: 'payload.anonymous', operator: 'equals', value: true },
          { field: 'existingBallots', operator: 'greater_than', value: 0 },
        ],
      },
      {
        gate: LoomioReviewGate.PROPOSAL_CLOSURE,
        description: 'Proposal closure requires quorum check',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: ['group_admin'],
        conditions: [
          { field: 'quorumMet', operator: 'equals', value: true },
        ],
      },
      {
        gate: LoomioReviewGate.PROPOSAL_OUTCOME,
        description: 'Outcome recording restricted to thread admins',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['thread_admin', 'group_admin'],
        escalationPath: ['group_admin'],
        conditions: [
          { field: 'proposal.closedAt', operator: 'not_equals', value: null },
        ],
      },

      // Voting Gates
      {
        gate: LoomioReviewGate.VOTE_CASTING,
        description: 'Validate vote eligibility and weight',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.ANONYMOUS_VOTE_CASTING,
        description: 'Validate anonymous ballot token and config freeze',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [
          { field: 'proposal.anonymous', operator: 'equals', value: true },
        ],
      },
      {
        gate: LoomioReviewGate.VOTE_WEIGHT_ASSIGNMENT,
        description: 'Vote weight changes require admin approval and audit',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },

      // Thread Gates
      {
        gate: LoomioReviewGate.THREAD_CREATION,
        description: 'Thread creation requires group membership',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.THREAD_LOCK,
        description: 'Thread locking archives discussion - admin only',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['thread_admin', 'group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.THREAD_UNLOCK,
        description: 'Thread unlocking requires admin',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['thread_admin', 'group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.THREAD_ITEM_ADDITION,
        description: 'Thread item addition (comments, proposals) - permission check',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },

      // Group Gates
      {
        gate: LoomioReviewGate.GROUP_CREATION,
        description: 'Group creation - anyone can create, subgroups need parent permission',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.GROUP_PERMISSIONS,
        description: 'Permission changes require group admin',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.GROUP_ARCHIVE,
        description: 'Group archival requires admin',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },

      // Membership Gates
      {
        gate: LoomioReviewGate.MEMBERSHIP_INVITATION,
        description: 'Member invitations - admin or membersCanAddMembers permission',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.MEMBERSHIP_APPROVAL,
        description: 'Membership request approval requires admin',
        autoApproveTimeoutMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.MEMBERSHIP_REVOCATION,
        description: 'Membership revocation requires admin',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.MEMBER_ROLE_CHANGE,
        description: 'Role changes require admin',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },

      // Template Gates
      {
        gate: LoomioReviewGate.TEMPLATE_CREATION,
        description: 'Template creation - membersCanCreateTemplates permission',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
      {
        gate: LoomioReviewGate.TEMPLATE_PUBLICATION,
        description: 'Template publication requires admin review',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 1,
        reviewerRoles: ['group_admin'],
        escalationPath: ['group_admin'],
        conditions: [],
      },

      // Legal Gates
      {
        gate: LoomioReviewGate.LEGAL_ACCEPTANCE,
        description: 'Legal terms acceptance tracking',
        autoApproveTimeoutMs: 0,
        requiredReviewers: 0,
        reviewerRoles: ['system'],
        escalationPath: [],
        conditions: [],
      },
    ];

    for (const gate of defaultGates) {
      this.gates.set(gate.gate, gate);
    }
  }

  private mapOperationsToGates(): void {
    this.operationToGate.set('loomio.create_proposal', LoomioReviewGate.PROPOSAL_CREATION);
    this.operationToGate.set('loomio.close_proposal', LoomioReviewGate.PROPOSAL_CLOSURE);
    this.operationToGate.set('loomio.record_outcome', LoomioReviewGate.PROPOSAL_OUTCOME);
    this.operationToGate.set('loomio.cast_vote', LoomioReviewGate.VOTE_CASTING);
    this.operationToGate.set('loomio.cast_anonymous_vote', LoomioReviewGate.ANONYMOUS_VOTE_CASTING);
    this.operationToGate.set('loomio.update_vote_weight', LoomioReviewGate.VOTE_WEIGHT_ASSIGNMENT);
    this.operationToGate.set('loomio.bulk_update_vote_weights', LoomioReviewGate.VOTE_WEIGHT_ASSIGNMENT);
    this.operationToGate.set('loomio.create_thread', LoomioReviewGate.THREAD_CREATION);
    this.operationToGate.set('loomio.lock_thread', LoomioReviewGate.THREAD_LOCK);
    this.operationToGate.set('loomio.unlock_thread', LoomioReviewGate.THREAD_UNLOCK);
    this.operationToGate.set('loomio.add_thread_item', LoomioReviewGate.THREAD_ITEM_ADDITION);
    this.operationToGate.set('loomio.create_group', LoomioReviewGate.GROUP_CREATION);
    this.operationToGate.set('loomio.update_group_permissions', LoomioReviewGate.GROUP_PERMISSIONS);
    this.operationToGate.set('loomio.archive_group', LoomioReviewGate.GROUP_ARCHIVE);
    this.operationToGate.set('loomio.invite_member', LoomioReviewGate.MEMBERSHIP_INVITATION);
    this.operationToGate.set('loomio.accept_invitation', LoomioReviewGate.MEMBERSHIP_APPROVAL);
    this.operationToGate.set('loomio.revoke_membership', LoomioReviewGate.MEMBERSHIP_REVOCATION);
    this.operationToGate.set('loomio.update_member_role', LoomioReviewGate.MEMBER_ROLE_CHANGE);
    this.operationToGate.set('loomio.create_proposal_template', LoomioReviewGate.TEMPLATE_CREATION);
    this.operationToGate.set('loomio.publish_proposal_template', LoomioReviewGate.TEMPLATE_PUBLICATION);
    this.operationToGate.set('loomio.accept_legal_terms', LoomioReviewGate.LEGAL_ACCEPTANCE);
  }

  /**
   * Get gate for operation
   */
  getGateForOperation(operationType: string): LoomioReviewGate | null {
    return this.operationToGate.get(operationType) ?? null;
  }

  /**
   * Get gate configuration
   */
  getGateConfig(gate: LoomioReviewGate): ReviewGateConfig | null {
    return this.gates.get(gate) ?? null;
  }

  /**
   * Check if operation requires review
   */
  requiresReview(operationType: string): boolean {
    const gate = this.getGateForOperation(operationType);
    if (!gate) return false;
    
    const config = this.gates.get(gate);
    if (!config) return false;
    
    return config.requiredReviewers > 0 || config.autoApproveTimeoutMs > 0;
  }

  /**
   * Create review request for operation
   */
  createReviewRequest(
    operation: AnyLoomioOperation,
    context: {
      requesterId: string;
      groupId: string;
      threadId?: string;
      proposalId?: string;
      existingBallots?: number;
      quorumMet?: boolean;
    }
  ): ReviewRequest | null {
    const gate = this.getGateForOperation(operation.type);
    if (!gate) return null;

    const config = this.gates.get(gate)!;
    if (config.requiredReviewers === 0 && config.autoApproveTimeoutMs === 0) {
      return null; // No review needed
    }

    const now = Date.now();
    const expiresAt = config.autoApproveTimeoutMs > 0 
      ? now + config.autoApproveTimeoutMs 
      : now + (30 * 24 * 60 * 60 * 1000); // Default 30 days

    const request: ReviewRequest = {
      id: `review_${now}_${Math.random().toString(36).substr(2, 9)}`,
      gate,
      operationId: operation.id,
      operationType: operation.type,
      payload: operation.payload,
      requesterId: context.requesterId,
      groupId: context.groupId,
      threadId: context.threadId,
      proposalId: context.proposalId,
      createdAt: now,
      expiresAt,
      status: 'pending',
      reviewers: [],
    };

    // Assign reviewers based on roles
    // In real implementation, would query for users with required roles in group
    // For now, auto-approve if no reviewers needed
    if (config.requiredReviewers === 0 && config.autoApproveTimeoutMs > 0) {
      request.status = 'auto_approved';
      request.decision = {
        approved: true,
        decidedBy: 'system',
        decidedAt: now,
        comment: 'Auto-approved per gate configuration',
      };
    }

    this.requests.set(request.id, request);
    return request;
  }

  /**
   * Get review request by ID
   */
  getReviewRequest(requestId: string): ReviewRequest | null {
    return this.requests.get(requestId) ?? null;
  }

  /**
   * Get pending review requests for reviewer
   */
  getPendingReviewsForReviewer(reviewerId: string, groupId?: string): ReviewRequest[] {
    return Array.from(this.requests.values()).filter(req => 
      req.status === 'pending' &&
      (!groupId || req.groupId === groupId) &&
      req.reviewers.some(r => r.reviewerId === reviewerId)
    );
  }

  /**
   * Submit review decision
   */
  submitReview(
    requestId: string,
    reviewerId: string,
    decision: 'approve' | 'reject',
    comment?: string
  ): { success: boolean; request?: ReviewRequest; error?: string } {
    const request = this.requests.get(requestId);
    if (!request) {
      return { success: false, error: 'Review request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, error: `Request is ${request.status}` };
    }

    if (request.decision) {
      return { success: false, error: 'Already decided' };
    }

    const assignment = request.reviewers.find(r => r.reviewerId === reviewerId);
    if (!assignment) {
      return { success: false, error: 'Not assigned as reviewer' };
    }

    assignment.respondedAt = Date.now();
    assignment.decision = decision;
    assignment.comment = comment;

    // Check if all required reviewers have responded
    const responded = request.reviewers.filter(r => r.decision);
    if (responded.length >= request.reviewers.length) {
      // All reviewers responded
      const allApproved = responded.every(r => r.decision === 'approve');
      request.status = allApproved ? 'approved' : 'rejected';
      request.decision = {
        approved: allApproved,
        decidedBy: reviewerId,
        decidedAt: Date.now(),
        comment: comment,
      };
    }

    return { success: true, request };
  }

  /**
   * Check if operation is approved
   */
  isOperationApproved(operationId: string): boolean {
    for (const request of this.requests.values()) {
      if (request.operationId === operationId) {
        return request.status === 'approved' || request.status === 'auto_approved';
      }
    }
    return false; // No review request found = not reviewed
  }

  /**
   * Auto-approve expired requests
   */
  processExpiredRequests(): ReviewRequest[] {
    const now = Date.now();
    const autoApproved: ReviewRequest[] = [];

    for (const request of this.requests.values()) {
      if (request.status === 'pending' && now >= request.expiresAt) {
        const config = this.gates.get(request.gate);
        if (config && config.autoApproveTimeoutMs > 0) {
          request.status = 'auto_approved';
          request.decision = {
            approved: true,
            decidedBy: 'system',
            decidedAt: now,
            comment: 'Auto-approved after timeout',
          };
          autoApproved.push(request);
        } else {
          request.status = 'expired';
        }
      }
    }

    return autoApproved;
  }

  /**
   * Get review statistics
   */
  getStatistics(groupId?: string): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    autoApproved: number;
    expired: number;
    escalated: number;
  } {
    const requests = groupId 
      ? Array.from(this.requests.values()).filter(r => r.groupId === groupId)
      : Array.from(this.requests.values());

    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      autoApproved: requests.filter(r => r.status === 'auto_approved').length,
      expired: requests.filter(r => r.status === 'expired').length,
      escalated: requests.filter(r => r.status === 'escalated').length,
    };
  }
}

/**
 * Escalation Handler
 */
export class EscalationHandler {
  constructor(private reviewGateService: LoomioReviewGateService) {}

  async handleEscalation(requestId: string): Promise<void> {
    const request = this.reviewGateService.getReviewRequest(requestId);
    if (!request) return;

    const config = this.reviewGateService.getGateConfig(request.gate);
    if (!config || config.escalationPath.length === 0) return;

    // In real implementation, would notify escalation path
    request.status = 'escalated';
    // Notify escalationPath reviewers
  }
}

/**
 * Auto-Approval Rules Engine
 */
export class AutoApprovalEngine {
  private rules: AutoApprovalRule[] = [];

  addRule(rule: AutoApprovalRule): void {
    this.rules.push(rule);
  }

  evaluate(operation: AnyLoomioOperation, context: any): { autoApprove: boolean; reason?: string } {
    for (const rule of this.rules) {
      if (rule.condition(operation, context)) {
        return { autoApprove: true, reason: rule.reason };
      }
    }
    return { autoApprove: false };
  }
}

export interface AutoApprovalRule {
  name: string;
  description: string;
  condition: (operation: AnyLoomioOperation, context: any) => boolean;
  reason: string;
}

/**
 * Default Auto-Approval Rules
 */
export const DEFAULT_AUTO_APPROVAL_RULES: AutoApprovalRule[] = [
  {
    name: 'low_risk_vote_casting',
    description: 'Auto-approve vote casting for non-anonymous proposals',
    condition: (op) => op.type === 'loomio.cast_vote' && !op.payload.anonymous,
    reason: 'Standard vote casting for identified voting',
  },
  {
    name: 'thread_item_addition',
    description: 'Auto-approve thread comments and contributions',
    condition: (op) => op.type === 'loomio.add_thread_item',
    reason: 'Standard thread participation',
  },
  {
    name: 'legal_acceptance',
    description: 'Auto-approve legal terms acceptance',
    condition: (op) => op.type === 'loomio.accept_legal_terms',
    reason: 'User-initiated legal acceptance',
  },
];