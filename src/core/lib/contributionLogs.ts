// HSCSG v15 OS — Contribution Logs (Immutable Claim Status Tracking)
// Pipeline: draft → claimed → under_review → validated/rejected → immutable (post-redistribution)
// OVNi 3.0: "when log becomes contribution... taken into benefit redistribution algorithm... should become immutable"

import type { ContributionLog, NRPEvent, NRPAffiliate } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// LOG STATUS TYPES & TRANSITIONS
// ============================================

export type LogStatus =
  | 'draft'           // being composed, not submitted
  | 'claimed'         // submitted for validation
  | 'under_review'    // peer review in progress
  | 'validated'       // approved by peer consensus
  | 'rejected'        // rejected by peer consensus
  | 'disputed'        // appeal filed
  | 'immutable'       // accepted by redistribution algorithm, cannot be edited

export const LOG_STATUS_TRANSITIONS: Record<LogStatus, LogStatus[]> = {
  draft: ['claimed'],
  claimed: ['under_review', 'rejected'], // can be rejected pre-review if invalid
  under_review: ['validated', 'rejected', 'claimed'], // back to claimed if changes requested
  validated: ['immutable', 'disputed'], // immutable after redistribution, or disputed via appeal
  rejected: ['disputed'], // appeal
  disputed: ['claimed', 'rejected'], // appeal accepted → back to review; denied → rejected
  immutable: [], // terminal state
}

export interface LogStatusTransition {
  logId: string
  fromStatus: LogStatus
  toStatus: LogStatus
  triggeredBy: string
  triggerType: 'user_action' | 'peer_review' | 'redistribution_algorithm' | 'appeal' | 'system'
  timestamp: number
  metadata?: Record<string, any>
}

export interface LogAuditEntry {
  id: string
  logId: string
  action: 'created' | 'submitted' | 'review_started' | 'review_submitted' | 'validated' | 'rejected' | 'appealed' | 'immutabilized' | 'edited'
  actorId: string
  timestamp: number
  details: string
  previousValue?: any
  newValue?: any
}

// ============================================
// CONTRIBUTION LOG REGISTRY
// ============================================

export class ContributionLogRegistry {
  private logs: Map<string, ContributionLog> = new Map()
  private statusHistory: Map<string, LogStatusTransition[]> = new Map()
  private auditTrail: Map<string, LogAuditEntry[]> = new Map()
  private indexes: LogIndexes = {
    byAffiliate: new Map(),
    byVenture: new Map(),
    byProject: new Map(),
    byStatus: new Map(),
    byImmutable: new Set(),
  }

  // ============================================
  // LOG LIFECYCLE
  // ============================================

  createDraft(draft: Omit<ContributionLog, 'id' | 'claimedAt' | 'status' | 'peerReview' | 'redFlags' | 'immutable' | 'validatedAt' | 'validatedBy' | 'acceptedValueTQ' | 'acceptedValueZNU' | 'benefitRedistributionId'>): ContributionLog {
    const log: ContributionLog = {
      ...draft,
      id: uid(),
      claimedAt: 0, // not claimed yet
      status: 'draft',
      peerReview: [],
      redFlags: [],
      immutable: false,
    }

    this.logs.set(log.id, log)
    this.updateIndexes(log)
    this.recordAudit(log.id, 'created', draft.affiliateId, 'Draft created')
    return log
  }

  submitClaim(logId: string, actorId: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'draft') return false

    this.transitionStatus(logId, 'claimed', actorId, 'user_action')
    log.claimedAt = now()
    this.recordAudit(logId, 'submitted', actorId, 'Claim submitted for validation')
    return true
  }

  startReview(logId: string, reviewerIds: string[], actorId: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'claimed') return false

    this.transitionStatus(logId, 'under_review', actorId, 'peer_review')
    log.peerReview = reviewerIds.map(id => ({
      reviewerId: id,
      reviewedAt: 0,
      verdict: 'approve',
      comments: '',
      confidence: 0,
      stakedReputation: 10,
    }))
    this.recordAudit(logId, 'review_started', actorId, `Peer review started with ${reviewerIds.length} reviewers`)
    return true
  }

  submitReview(logId: string, reviewerId: string, review: { verdict: 'approve' | 'request_changes' | 'reject'; comments: string; confidence: number; stakedReputation?: number }): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'under_review') return false

    const existingReview = log.peerReview.find(r => r.reviewerId === reviewerId)
    if (!existingReview) return false

    existingReview.reviewedAt = now()
    existingReview.verdict = review.verdict
    existingReview.comments = review.comments
    existingReview.confidence = review.confidence
    existingReview.stakedReputation = review.stakedReputation

    this.recordAudit(logId, 'review_submitted', reviewerId, `Review submitted: ${review.verdict} (confidence: ${review.confidence})`)
    return true
  }

  finalizeValidation(logId: string, accepted: boolean, validatorId: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'under_review') return false

    const newStatus = accepted ? 'validated' : 'rejected'
    this.transitionStatus(logId, newStatus, validatorId, 'peer_review')

    if (accepted) {
      log.validatedAt = now()
      log.validatedBy = validatorId
      this.recordAudit(logId, 'validated', validatorId, 'Contribution validated by peer consensus')
    } else {
      this.recordAudit(logId, 'rejected', validatorId, 'Contribution rejected by peer consensus')
    }

    return true
  }

  fileAppeal(logId: string, appellantId: string, reason: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'rejected') return false

    this.transitionStatus(logId, 'disputed', appellantId, 'appeal')
    log.redFlags.push({
      id: uid(),
      type: 'policy_violation',
      description: `Appeal by ${appellantId}: ${reason}`,
      raisedBy: appellantId,
      raisedAt: now(),
      status: 'open',
    })
    this.recordAudit(logId, 'appealed', appellantId, `Appeal filed: ${reason}`)
    return true
  }

  resolveAppeal(logId: string, accepted: boolean, resolverId: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'disputed') return false

    const newStatus = accepted ? 'claimed' : 'rejected'
    this.transitionStatus(logId, newStatus, resolverId, 'appeal')

    if (accepted) {
      log.redFlags.push({
        id: uid(),
        type: 'policy_violation',
        description: `Appeal accepted by ${resolverId} - returned to review`,
        raisedBy: resolverId,
        raisedAt: now(),
        status: 'resolved',
        resolution: 'Appeal accepted - back to peer review',
      })
      this.recordAudit(logId, 'appealed', resolverId, 'Appeal accepted - returned to review')
    } else {
      log.redFlags.push({
        id: uid(),
        type: 'policy_violation',
        description: `Appeal rejected by ${resolverId}`,
        raisedBy: resolverId,
        raisedAt: now(),
        status: 'resolved',
        resolution: 'Appeal denied',
      })
      this.recordAudit(logId, 'appealed', resolverId, 'Appeal rejected')
    }

    return true
  }

  /**
   * CRITICAL: Make log immutable when accepted by benefit redistribution algorithm
   * This is the key OVNi 3.0 requirement: logs become immutable contributions
   */
  makeImmutable(logId: string, benefitRedistributionId: string, algorithmId: string): boolean {
    const log = this.logs.get(logId)
    if (!log || log.status !== 'validated') return false
    if (log.immutable) return false // already immutable

    this.transitionStatus(logId, 'immutable', 'redistribution_algorithm', 'redistribution_algorithm')
    log.immutable = true
    log.benefitRedistributionId = benefitRedistributionId

    this.indexes.byImmutable.add(logId)
    this.recordAudit(logId, 'immutabilized', algorithmId, `Made immutable by benefit redistribution ${benefitRedistributionId}`)
    return true
  }

  /**
   * Verifica si un log puede ser editado
   * Solo editable en estados: draft, claimed (before review), disputed
   */
  canEdit(logId: string): boolean {
    const log = this.logs.get(logId)
    if (!log) return false
    return ['draft', 'claimed', 'disputed'].includes(log.status) && !log.immutable
  }

  /**
   * Edita un log (solo si canEdit = true)
   */
  editLog(logId: string, actorId: string, updates: Partial<ContributionLog>): boolean {
    const log = this.logs.get(logId)
    if (!log || !this.canEdit(logId)) return false

    // Protect critical fields
    const protectedFields = ['id', 'affiliateId', 'ventureId', 'claimedAt', 'status', 'peerReview', 'redFlags', 'immutable', 'validatedAt', 'validatedBy', 'acceptedValueTQ', 'acceptedValueZNU', 'benefitRedistributionId']
    const allowedUpdates = Object.fromEntries(Object.entries(updates).filter(([k]) => !protectedFields.includes(k)))

    for (const [key, value] of Object.entries(allowedUpdates)) {
      (log as any)[key] = value
    }

    this.recordAudit(logId, 'edited', actorId, `Fields updated: ${Object.keys(allowedUpdates).join(', ')}`)
    return true
  }

  // ============================================
  // QUERIES
  // ============================================

  getLog(logId: string): ContributionLog | undefined {
    return this.logs.get(logId)
  }

  getLogsByAffiliate(affiliateId: string): ContributionLog[] {
    const ids = this.indexes.byAffiliate.get(affiliateId) || []
    return ids.map(id => this.logs.get(id)!).filter(Boolean)
  }

  getLogsByVenture(ventureId: string): ContributionLog[] {
    const ids = this.indexes.byVenture.get(ventureId) || []
    return ids.map(id => this.logs.get(id)!).filter(Boolean)
  }

  getLogsByProject(projectId: string): ContributionLog[] {
    const ids = this.indexes.byProject.get(projectId) || []
    return ids.map(id => this.logs.get(id)!).filter(Boolean)
  }

  getLogsByStatus(status: LogStatus): ContributionLog[] {
    const ids = this.indexes.byStatus.get(status) || []
    return ids.map(id => this.logs.get(id)!).filter(Boolean)
  }

  getImmutableLogs(): ContributionLog[] {
    return Array.from(this.indexes.byImmutable).map(id => this.logs.get(id)!).filter(Boolean)
  }

  getValidationPipeline(): ValidationPipelineSnapshot {
    return {
      draft: this.getLogsByStatus('draft').length,
      claimed: this.getLogsByStatus('claimed').length,
      underReview: this.getLogsByStatus('under_review').length,
      validated: this.getLogsByStatus('validated').length,
      rejected: this.getLogsByStatus('rejected').length,
      disputed: this.getLogsByStatus('disputed').length,
      immutable: this.indexes.byImmutable.size,
      total: this.logs.size,
    }
  }

  getStatusHistory(logId: string): LogStatusTransition[] {
    return this.statusHistory.get(logId) || []
  }

  getAuditTrail(logId: string): LogAuditEntry[] {
    return this.auditTrail.get(logId) || []
  }

  // ============================================
  // INTERNAL
  // ============================================

  private transitionStatus(logId: string, toStatus: LogStatus, triggeredBy: string, triggerType: LogStatusTransition['triggerType']): void {
    const log = this.logs.get(logId)
    if (!log) return

    const fromStatus = log.status
    const allowed = LOG_STATUS_TRANSITIONS[fromStatus] || []
    if (!allowed.includes(toStatus)) {
      throw new Error(`Invalid status transition: ${fromStatus} → ${toStatus}`)
    }

    log.status = toStatus

    const transition: LogStatusTransition = {
      logId,
      fromStatus,
      toStatus,
      triggeredBy,
      triggerType,
      timestamp: now(),
    }

    const history = this.statusHistory.get(logId) || []
    history.push(transition)
    this.statusHistory.set(logId, history)

    this.updateIndexes(log)
  }

  private updateIndexes(log: ContributionLog): void {
    // byAffiliate
    const affIds = this.indexes.byAffiliate.get(log.affiliateId) || []
    if (!affIds.includes(log.id)) affIds.push(log.id)
    this.indexes.byAffiliate.set(log.affiliateId, affIds)

    // byVenture
    const ventIds = this.indexes.byVenture.get(log.ventureId) || []
    if (!ventIds.includes(log.id)) ventIds.push(log.id)
    this.indexes.byVenture.set(log.ventureId, ventIds)

    // byProject
    if (log.projectId) {
      const projIds = this.indexes.byProject.get(log.projectId) || []
      if (!projIds.includes(log.id)) projIds.push(log.id)
      this.indexes.byProject.set(log.projectId, projIds)
    }

    // byStatus
    const statusIds = this.indexes.byStatus.get(log.status) || []
    if (!statusIds.includes(log.id)) statusIds.push(log.id)
    this.indexes.byStatus.set(log.status, statusIds)

    // byImmutable
    if (log.immutable) {
      this.indexes.byImmutable.add(log.id)
    } else {
      this.indexes.byImmutable.delete(log.id)
    }
  }

  private recordAudit(logId: string, action: LogAuditEntry['action'], actorId: string, details: string): void {
    const entry: LogAuditEntry = {
      id: uid(),
      logId,
      action,
      actorId,
      timestamp: now(),
      details,
    }

    const trail = this.auditTrail.get(logId) || []
    trail.push(entry)
    this.auditTrail.set(logId, trail)
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      logs: Array.from(this.logs.entries()),
      statusHistory: Array.from(this.statusHistory.entries()),
      auditTrail: Array.from(this.auditTrail.entries()),
      indexes: {
        byAffiliate: Array.from(this.indexes.byAffiliate.entries()),
        byVenture: Array.from(this.indexes.byVenture.entries()),
        byProject: Array.from(this.indexes.byProject.entries()),
        byStatus: Array.from(this.indexes.byStatus.entries()),
        byImmutable: Array.from(this.indexes.byImmutable),
      },
    }, null, 2)
  }

  static fromJSON(json: string): ContributionLogRegistry {
    const data = JSON.parse(json)
    const registry = new ContributionLogRegistry()
    registry.logs = new Map(data.logs)
    registry.statusHistory = new Map(data.statusHistory)
    registry.auditTrail = new Map(data.auditTrail)
    registry.indexes = {
      byAffiliate: new Map(data.indexes.byAffiliate),
      byVenture: new Map(data.indexes.byVenture),
      byProject: new Map(data.indexes.byProject),
      byStatus: new Map(data.indexes.byStatus),
      byImmutable: new Set(data.indexes.byImmutable),
    }
    return registry
  }
}

export interface ValidationPipelineSnapshot {
  draft: number
  claimed: number
  underReview: number
  validated: number
  rejected: number
  disputed: number
  immutable: number
  total: number
}

export interface LogIndexes {
  byAffiliate: Map<string, string[]>
  byVenture: Map<string, string[]>
  byProject: Map<string, string[]>
  byStatus: Map<LogStatus, string[]>
  byImmutable: Set<string>
}

export const contributionLogRegistry = new ContributionLogRegistry()