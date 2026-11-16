// arm-sensorica/src/agentHuman.ts - Agent-Human Loop (Review Gates)
import { 
  SensoricaOp, 
  SensoricaEvent, 
  SensoricaState, 
  ReviewGate,
  AffiliateId,
  ProposalId,
  DistributionId,
  ProjectId,
  TrustScore,
  Duration,
  Timestamp,
  GovernanceRole,
  Affiliate,
  Proposal
} from './types';

import { generateId, now } from './utils';

// ============================================
// REVIEW GATE SYSTEM (ARM-style Human-in-the-loop)
// ============================================

/**
 * Review Gates implement the ARM invariant: "Nothing Lands Unapproved"
 * Every critical operation requires human review before execution.
 * Based on Sensorica OVN governance: place keepers as local trust anchors.
 */

export interface ReviewGateConfig {
  id: string;
  trigger: SensoricaOp['type'];
  requiredApprovers: number;
  approverRoles: GovernanceRole[];
  timeout: Duration;
  autoApproveIfTimeout: boolean;
  escalationPath?: AffiliateId[];
}

export interface ReviewRequest {
  id: string;
  gateId: string;
  op: SensoricaOp;
  requestedAt: Timestamp;
  requestedBy: AffiliateId;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'escalated';
  approvals: ReviewApproval[];
  rejections: ReviewRejection[];
  expiresAt: Timestamp;
  escalatedAt?: Timestamp;
  escalatedTo?: AffiliateId[];
}

export interface ReviewApproval {
  approverId: AffiliateId;
  approvedAt: Timestamp;
  comment?: string;
}

export interface ReviewRejection {
  rejectorId: AffiliateId;
  rejectedAt: Timestamp;
  reason: string;
}

export interface ReviewGateSystem {
  submitForReview(op: SensoricaOp, author: AffiliateId): Promise<ReviewRequest>;
  approve(requestId: string, approverId: AffiliateId, comment?: string): Promise<ReviewRequest>;
  reject(requestId: string, rejectorId: AffiliateId, reason: string): Promise<ReviewRequest>;
  getReviewStatus(requestId: string): Promise<ReviewRequest | null>;
  getPendingReviews(affiliateId: AffiliateId): Promise<ReviewRequest[]>;
  processTimeouts(): Promise<void>;
  escalate(requestId: string): Promise<void>;
}

export class ReviewGateSystemImpl implements ReviewGateSystem {
  private gates: Map<string, ReviewGateConfig> = new Map();
  private requests: Map<string, ReviewRequest> = new Map();
  private byAuthor: Map<string, Set<string>> = new Map(); // affiliateId -> requestIds
  private byApprover: Map<string, Set<string>> = new Map(); // approverId -> requestIds

  constructor(private gatesConfig: ReviewGateConfig[], private state: any) { // SensoricaState
    for (const gate of gatesConfig) {
      this.gates.set(gate.id, gate);
    }
  }

  async submitForReview(op: SensoricaOp, author: AffiliateId): Promise<ReviewRequest> {
    const gate = this.findGateForOp(op.type);
    if (!gate) {
      // No gate required, auto-approve
      return this.createAutoApprovedRequest(op, author);
    }

    const approvers = await this.resolveApprovers(gate);
    if (approvers.length === 0) {
      throw new Error(`No approvers found for gate ${gate.id}`);
    }

    const request: ReviewRequest = {
      id: generateId('rev'),
      gateId: gate.id,
      op,
      requestedAt: now(),
      requestedBy: author,
      status: 'pending',
      approvals: [],
      rejections: [],
      expiresAt: { 
        value: Date.now() + gate.timeout.value, 
        timezone: 'UTC' 
      }
    };

    this.requests.set(request.id, request);
    this.addToIndex(this.byAuthor, author, request.id);
    for (const approver of approvers) {
      this.addToIndex(this.byApprover, approver, request.id);
    }

    return request;
  }

  async approve(requestId: string, approverId: AffiliateId, comment?: string): Promise<ReviewRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error('Review request not found');
    if (request.status !== 'pending') throw new Error('Request not pending');

    const gate = this.gates.get(request.gateId);
    if (!gate) throw new Error('Gate not found');

    // Check if approver is authorized
    if (!gate.approverRoles.includes('affiliate')) { // simplified - would check actual role
      throw new Error('Not authorized to approve');
    }

    if (request.approvals.some(a => a.approverId === approverId)) {
      throw new Error('Already approved by this approver');
    }

    request.approvals.push({
      approverId,
      approvedAt: { value: Date.now(), timezone: 'UTC' },
      comment
    });

    // Check if enough approvals
    if (request.approvals.length >= gate.requiredApprovers) {
      request.status = 'approved';
    }

    return request;
  }

  async reject(requestId: string, rejectorId: AffiliateId, reason: string): Promise<ReviewRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error('Review request not found');
    if (request.status !== 'pending') throw new Error('Request not pending');

    request.rejections.push({
      rejectorId,
      rejectedAt: { value: Date.now(), timezone: 'UTC' },
      reason
    });

    request.status = 'rejected';
    return request;
  }

  async getReviewStatus(requestId: string): Promise<ReviewRequest | null> {
    return this.requests.get(requestId) || null;
  }

  async getPendingReviews(affiliateId: AffiliateId): Promise<ReviewRequest[]> {
    const requestIds = this.byApprover.get(affiliateId as string) || new Set();
    return Array.from(requestIds)
      .map(id => this.requests.get(id))
      .filter((r): r is ReviewRequest => r !== undefined && r.status === 'pending');
  }

  async processTimeouts(): Promise<void> {
    const now_ts = Date.now();
    
    for (const request of this.requests.values()) {
      if (request.status !== 'pending') continue;
      if (request.expiresAt.value <= now_ts) {
        const gate = this.gates.get(request.gateId);
        
        if (gate?.autoApproveIfTimeout) {
          request.status = 'approved';
        } else if (gate?.escalationPath && gate.escalationPath.length > 0) {
          request.status = 'escalated';
          request.escalatedAt = { value: now_ts, timezone: 'UTC' };
          request.escalatedTo = gate.escalationPath;
        } else {
          request.status = 'expired';
        }
      }
    }
  }

  async escalate(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error('Review request not found');
    if (request.status !== 'pending' && request.status !== 'expired') {
      throw new Error('Can only escalate pending or expired requests');
    }

    const gate = this.gates.get(request.gateId);
    if (!gate?.escalationPath || gate.escalationPath.length === 0) {
      throw new Error('No escalation path configured');
    }

    request.status = 'escalated';
    request.escalatedAt = { value: Date.now(), timezone: 'UTC' };
    request.escalatedTo = gate.escalationPath;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private findGateForOp(opType: SensoricaOp['type']): ReviewGateConfig | null {
    for (const gate of this.gates.values()) {
      if (gate.trigger === opType) return gate;
    }
    return null;
  }

  private async resolveApprovers(gate: ReviewGateConfig): Promise<AffiliateId[]> {
    // In real implementation, would query affiliates with matching roles
    // For now, return empty - would be populated from governance system
    return [];
  }

  private createAutoApprovedRequest(op: SensoricaOp, author: AffiliateId): ReviewRequest {
    const request: ReviewRequest = {
      id: generateId('rev'),
      gateId: 'auto',
      op,
      requestedAt: now(),
      requestedBy: author,
      status: 'approved',
      approvals: [{ approverId: 'system' as any, approvedAt: now() }],
      rejections: [],
      expiresAt: { value: Date.now(), timezone: 'UTC' }
    };
    this.requests.set(request.id, request);
    return request;
  }

  private addToIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(value);
  }
}

// ============================================
// DEFAULT REVIEW GATES (Sensorica OVN)
// ============================================

export const DEFAULT_REVIEW_GATES: ReviewGateConfig[] = [
  {
    id: 'distribution-approval',
    trigger: 'distribution.execute',
    requiredApprovers: 3,
    approverRoles: ['placeKeeper', 'exchangeFirmRep'],
    timeout: { value: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    autoApproveIfTimeout: false, // Distributions need explicit approval
    escalationPath: []
  },
  {
    id: 'value-equation-change',
    trigger: 'valueEquation.configure',
    requiredApprovers: 2,
    approverRoles: ['placeKeeper'],
    timeout: { value: 14 * 24 * 60 * 60 * 1000 }, // 14 days
    autoApproveIfTimeout: false,
    escalationPath: []
  },
  {
    id: 'governance-change',
    trigger: 'governance.propose',
    requiredApprovers: 3,
    approverRoles: ['placeKeeper'],
    timeout: { value: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    autoApproveIfTimeout: false,
    escalationPath: []
  },
  {
    id: 'exchange-firm-contract',
    trigger: 'exchangeFirm.revenueReceived',
    requiredApprovers: 1,
    approverRoles: ['exchangeFirmRep'],
    timeout: { value: 3 * 24 * 60 * 60 * 1000 }, // 3 days
    autoApproveIfTimeout: true, // Operational
    escalationPath: []
  },
  {
    id: 'trust-update',
    trigger: 'trust.update',
    requiredApprovers: 1,
    approverRoles: ['placeKeeper'],
    timeout: { value: 24 * 60 * 60 * 1000 }, // 1 day
    autoApproveIfTimeout: false,
    escalationPath: []
  },
  {
    id: 'affiliate-removal',
    trigger: 'governance.propose', // with type 'affiliateRemoval'
    requiredApprovers: 3,
    approverRoles: ['placeKeeper'],
    timeout: { value: 14 * 24 * 60 * 60 * 1000 }, // 14 days
    autoApproveIfTimeout: false,
    escalationPath: []
  }
];

// ============================================
// REVIEW REQUEST HELPERS
// ============================================

export function isRequestExpired(request: ReviewRequest): boolean {
  return request.expiresAt.value <= Date.now();
}

export function getTimeUntilExpiry(request: ReviewRequest): number {
  return Math.max(0, request.expiresAt.value - Date.now());
}

export function getApprovalProgress(request: ReviewRequest): { approved: number; required: number; percentage: number } {
  const approved = request.approvals.length;
  const gate = DEFAULT_REVIEW_GATES.find(g => g.id === request.gateId);
  const required = gate?.requiredApprovers || 1;
  return {
    approved,
    required,
    percentage: required > 0 ? (approved / required) * 100 : 100
  };
}

export function canApprove(request: ReviewRequest, approverId: AffiliateId): boolean {
  if (request.status !== 'pending') return false;
  if (isRequestExpired(request)) return false;
  if (request.approvals.some(a => a.approverId === approverId)) return false;
  // Would check approver role authorization
  return true;
}

export function canReject(request: ReviewRequest, rejectorId: AffiliateId): boolean {
  if (request.status !== 'pending') return false;
  if (isRequestExpired(request)) return false;
  // Any authorized reviewer can reject
  return true;
}

export function formatReviewRequest(request: ReviewRequest): string {
  const gate = DEFAULT_REVIEW_GATES.find(g => g.id === request.gateId);
  const progress = getApprovalProgress(request);
  
  return `
Review Request: ${request.id}
Gate: ${gate?.id || 'auto'}
Operation: ${request.op.type}
Requested by: ${request.requestedBy}
Status: ${request.status}
Approvals: ${progress.approved}/${progress.required} (${progress.percentage.toFixed(0)}%)
Expires: ${new Date(request.expiresAt.value).toISOString()}
Approvals: ${request.approvals.map(a => `${a.approverId} (${new Date(a.approvedAt.value).toISOString()})`).join(', ') || 'none'}
Rejections: ${request.rejections.map(r => `${r.rejectorId}: ${r.reason}`).join('; ') || 'none'}
  `.trim();
}

// ============================================
// AGENT-HUMAN INTERACTION PATTERNS
// ============================================

export interface AgentHumanInteraction {
  id: string;
  agentId: string;
  humanId: AffiliateId;
  type: 'review' | 'clarification' | 'approval' | 'escalation';
  context: Record<string, unknown>;
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  resolution?: 'approved' | 'rejected' | 'clarified' | 'escalated';
}

export class AgentHumanInteractionManager {
  private interactions: Map<string, AgentHumanInteraction> = new Map();

  async createInteraction(input: Omit<AgentHumanInteraction, 'id' | 'createdAt'>): Promise<AgentHumanInteraction> {
    const interaction: AgentHumanInteraction = {
      id: generateId('ahi'),
      ...input,
      createdAt: { value: Date.now(), timezone: 'UTC' }
    };
    this.interactions.set(interaction.id, interaction);
    return interaction;
  }

  async resolveInteraction(id: string, resolution: AgentHumanInteraction['resolution']): Promise<void> {
    const interaction = this.interactions.get(id);
    if (!interaction) throw new Error('Interaction not found');
    interaction.resolvedAt = { value: Date.now(), timezone: 'UTC' };
    interaction.resolution = resolution;
  }

  async getInteraction(id: string): Promise<AgentHumanInteraction | null> {
    return this.interactions.get(id) || null;
  }

  async getPendingInteractions(humanId: AffiliateId): Promise<AgentHumanInteraction[]> {
    return Array.from(this.interactions.values()).filter(
      i => i.humanId === humanId && !i.resolvedAt
    );
  }
}

import { generateId } from './utils';