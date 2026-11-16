// HSCSG v15 OS — Contribution Accounting Pipeline
// Pipeline: Log Claim → Peer Review (Proof-of-Stake) → Validation → Immutable Contribution
// Capa 3: Operación Productiva — integra con ValueFlows + REA + NRP-CAS Core

import type { ContributionLog, PeerReview, RedFlag, ValueFlow, VFType, NRPAffiliate } from '@core/lib/nrpCasCore'
import type { NRPEvent } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// CONTRIBUTION ACCOUNTING STATE
// ============================================

export interface ContributionAccountingState {
  logs: Map<string, ContributionLog>
  reviewAssignments: Map<string, ReviewAssignment>
  validationQueue: string[] // log IDs pending validation
  immutableLogs: Set<string> // log IDs made immutable by redistribution
  statistics: ContributionStatistics
}

export interface ReviewAssignment {
  logId: string
  reviewerIds: string[]
  assignedAt: number
  requiredReviews: number
  minConfidence: number
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  completedReviews: number
}

export interface ContributionStatistics {
  totalLogs: number
  draftLogs: number
  claimedLogs: number
  underReviewLogs: number
  validatedLogs: number
  rejectedLogs: number
  disputedLogs: number
  immutableLogs: number
  totalValueTQ: number
  totalValueZNU: number
  averageValidationTimeHours: number
  peerReviewParticipationRate: number
}

// ============================================
// CONTRIBUTION ACCOUNTING ENGINE
// ============================================

export class ContributionAccountingEngine {
  private state: ContributionAccountingState
  private nrpCasCore: any // NRPCASCore instance (circular dep avoided)
  private config: ContributionAccountingConfig

  constructor(config: Partial<ContributionAccountingConfig> = {}) {
    this.config = {
      minPeerReviews: config.minPeerReviews ?? 2,
      minConfidence: config.minConfidence ?? 0.6,
      reviewTimeoutHours: config.reviewTimeoutHours ?? 72,
      autoAssignReviewers: config.autoAssignReviewers ?? true,
      stakeReputationAmount: config.stakeReputationAmount ?? 10,
      allowAppeals: config.allowAppeals ?? true,
      appealTimeoutHours: config.appealTimeoutHours ?? 168, // 1 week
    }
    this.state = this.initializeState()
  }

  private initializeState(): ContributionAccountingState {
    return {
      logs: new Map(),
      reviewAssignments: new Map(),
      validationQueue: [],
      immutableLogs: new Set(),
      statistics: {
        totalLogs: 0,
        draftLogs: 0,
        claimedLogs: 0,
        underReviewLogs: 0,
        validatedLogs: 0,
        rejectedLogs: 0,
        disputedLogs: 0,
        immutableLogs: 0,
        totalValueTQ: 0,
        totalValueZNU: 0,
        averageValidationTimeHours: 0,
        peerReviewParticipationRate: 0,
      }
    }
  }

  setNRPCASCore(core: any): void {
    this.nrpCasCore = core
  }

  // ============================================
  // LOG LIFECYCLE MANAGEMENT
  // ============================================

  /**
   * Crea un nuevo log de contribución (borrador → claim)
   */
  createLog(draftLog: Omit<ContributionLog, 'id' | 'claimedAt' | 'status' | 'peerReview' | 'redFlags' | 'immutable' | 'validatedAt' | 'validatedBy' | 'acceptedValueTQ' | 'acceptedValueZNU' | 'benefitRedistributionId'>): ContributionLog {
    const log: ContributionLog = {
      ...draftLog,
      id: uid(),
      claimedAt: now(),
      status: 'claimed',
      peerReview: [],
      redFlags: [],
      immutable: false,
    }

    this.state.logs.set(log.id, log)
    this.state.validationQueue.push(log.id)
    this.updateStatistics()
    return log
  }

  /**
   * Inicia revisión por pares con asignación automática (proof-of-stake)
   */
  async initiatePeerReview(logId: string): Promise<boolean> {
    const log = this.state.logs.get(logId)
    if (!log || log.status !== 'claimed') return false

    // Auto-assign reviewers based on reputation dimensions relevant to activity type
    const reviewerIds = await this.selectReviewers(log)
    if (reviewerIds.length < this.config.minPeerReviews) {
      log.redFlags.push({
        id: uid(),
        type: 'policy_violation',
        description: `Insufficient qualified reviewers available (${reviewerIds.length}/${this.config.minPeerReviews})`,
        raisedBy: 'system',
        raisedAt: now(),
        status: 'open',
      })
    }

    const assignment: ReviewAssignment = {
      logId,
      reviewerIds,
      assignedAt: now(),
      requiredReviews: this.config.minPeerReviews,
      minConfidence: this.config.minConfidence,
      status: 'in_progress',
      completedReviews: 0,
    }

    log.status = 'under_review'
    log.peerReview = reviewerIds.map(id => ({
      reviewerId: id,
      reviewedAt: 0,
      verdict: 'approve',
      comments: '',
      confidence: 0,
      stakedReputation: this.config.stakeReputationAmount,
    }))

    this.state.reviewAssignments.set(logId, assignment)
    this.updateStatistics()
    return true
  }

  /**
   * Selecciona revisores calificados usando proof-of-stake
   * Prioriza: alta reputación en dimensión relevante + stake disponible
   */
  private async selectReviewers(log: ContributionLog): Promise<string[]> {
    if (!this.nrpCasCore) return []

    const affiliates = this.nrpCasCore.getActiveAffiliates()
    const relevantDimension = this.mapActivityToReputationDimension(log.activityType)

    // Filter: active, not the contributor, has reputation in relevant dimension
    const candidates = affiliates.filter(a =>
      a.id !== log.affiliateId &&
      a.status === 'active' &&
      a.reputationDimensions.some(r => r.dimension === relevantDimension && r.score >= 0.5)
    )

    // Sort by: reputation score * stake (proof-of-stake)
    candidates.sort((a, b) => {
      const repA = a.reputationDimensions.find(r => r.dimension === relevantDimension)?.score || 0
      const repB = b.reputationDimensions.find(r => r.dimension === relevantDimension)?.score || 0
      const stakeA = a.tqBalance // using TQ balance as stake proxy
      const stakeB = b.tqBalance
      return (repB * stakeB) - (repA * stakeA)
    })

    return candidates.slice(0, this.config.minPeerReviews * 2).map(a => a.id) // 2x pool for availability
  }

  private mapActivityToReputationDimension(activityType: VFType): ReputationDimension['dimension'] {
    const map: Record<VFType, ReputationDimension['dimension']> = {
      LaborFlow: 'commitment',
      LoveFlow: 'collaboration',
      CareFlow: 'quality',
      RepairFlow: 'quality',
      ManufactureFlow: 'quality',
    }
    return map[activityType] || 'quality'
  }

  /**
   * Procesa envío de revisión por pares
   */
  submitPeerReview(logId: string, reviewerId: string, review: Omit<PeerReview, 'reviewerId' | 'reviewedAt'>): boolean {
    const log = this.state.logs.get(logId)
    const assignment = this.state.reviewAssignments.get(logId)
    if (!log || !assignment || log.status !== 'under_review') return false

    const existingReview = log.peerReview.find(r => r.reviewerId === reviewerId)
    if (!existingReview) return false

    existingReview.reviewedAt = now()
    existingReview.verdict = review.verdict
    existingReview.comments = review.comments
    existingReview.confidence = review.confidence
    existingReview.stakedReputation = review.stakedReputation

    assignment.completedReviews++

    // Check if all required reviews complete
    if (assignment.completedReviews >= assignment.requiredReviews) {
      assignment.status = 'completed'
      this.finalizeValidation(logId)
    }

    this.updateStatistics()
    return true
  }

  /**
   * Finaliza validación basada en revisiones completadas
   * Hybrid: automated confidence + subjective proof-of-stake
   */
  private finalizeValidation(logId: string): void {
    const log = this.state.logs.get(logId)
    const assignment = this.state.reviewAssignments.get(logId)
    if (!log || !assignment) return

    const reviews = log.peerReview.filter(r => r.reviewedAt > 0)
    const approvals = reviews.filter(r => r.verdict === 'approve')
    const rejections = reviews.filter(r => r.verdict === 'reject')
    const changesRequested = reviews.filter(r => r.verdict === 'request_changes')

    const avgConfidence = reviews.reduce((sum, r) => sum + r.confidence, 0) / reviews.length

    // Automated component: confidence threshold
    const automatedPass = avgConfidence >= this.config.minConfidence

    // Subjective component: majority approval, no rejections
    const subjectivePass = approvals.length >= assignment.requiredReviews && rejections.length === 0

    if (automatedPass && subjectivePass) {
      log.status = 'validated'
      log.validatedAt = now()
      log.validatedBy = 'peer_consensus'

      // Calculate TQ value (automated assessment)
      log.acceptedValueTQ = this.calculateAutomatedTQValue(log)
      log.acceptedValueZNU = log.acceptedValueTQ * this.getPriceParity()

      // Update affiliate balances (delegated to NRP-CAS Core)
      if (this.nrpCasCore) {
        this.nrpCasCore.updateAffiliateBalances(log.affiliateId, log.acceptedValueTQ, log.acceptedValueZNU)
      }

      // Create NRP event for audit trail
      this.createValidationEvent(log)

    } else if (rejections.length > 0 || changesRequested.length > 0) {
      log.status = changesRequested.length > 0 ? 'claimed' : 'rejected'
      if (changesRequested.length > 0) {
        log.redFlags.push({
          id: uid(),
          type: 'quality_concern',
          description: 'Reviewers requested changes',
          raisedBy: 'peer_review',
          raisedAt: now(),
          status: 'open',
        })
      }
    } else {
      log.status = 'rejected'
    }

    // Remove from validation queue
    this.state.validationQueue = this.state.validationQueue.filter(id => id !== logId)
    this.updateStatistics()
  }

  /**
   * Cálculo automático de valor TQ (componente automatizado de assessment)
   * Basado en: tipo actividad, horas, deliverables, reputación del contribuyente
   */
  private calculateAutomatedTQValue(log: ContributionLog): number {
    const baseIntensity: Record<VFType, number> = {
      LaborFlow: 0.1,
      LoveFlow: 0.05,
      CareFlow: 0.08,
      RepairFlow: 0.15,
      ManufactureFlow: 0.5,
    }

    const intensity = baseIntensity[log.activityType] || 0.1
    let tq = log.hoursClaimed * intensity

    // Deliverable bonus (evidence of value creation)
    tq += log.deliverables.length * 0.5

    // Quality multiplier based on contributor's reputation
    if (this.nrpCasCore) {
      const affiliate = this.nrpCasCore.getAffiliate(log.affiliateId)
      if (affiliate) {
        const qualityRep = affiliate.reputationDimensions.find(r => r.dimension === 'quality')
        if (qualityRep) {
          tq *= (0.8 + qualityRep.score * 0.4) // 0.8x to 1.2x multiplier
        }
      }
    }

    return Math.round(tq * 100) / 100
  }

  private getPriceParity(): number {
    // From valueDual.ts oracle
    return 1 // 1 TQ = 1 ZNU baseline
  }

  private createValidationEvent(log: ContributionLog): void {
    if (!this.nrpCasCore) return

    this.nrpCasCore.recordEvent({
      eventType: 'Observation',
      agentId: log.affiliateId,
      resourceId: log.id,
      quantity: log.acceptedValueTQ,
      unit: 'TQ',
      note: `Contribution validated: ${log.activityDescription}`,
      ventureId: log.ventureId,
      projectId: log.projectId,
      logId: log.id,
    } as any)
  }

  // ============================================
  // RED FLAG MANAGEMENT
  // ============================================

  raiseRedFlag(logId: string, flag: Omit<RedFlag, 'id' | 'raisedAt' | 'status'>): RedFlag {
    const log = this.state.logs.get(logId)
    if (!log) throw new Error('Log not found')

    const redFlag: RedFlag = {
      ...flag,
      id: uid(),
      raisedAt: now(),
      status: 'open',
    }

    log.redFlags.push(redFlag)
    this.updateStatistics()
    return redFlag
  }

  resolveRedFlag(logId: string, flagId: string, resolution: string): boolean {
    const log = this.state.logs.get(logId)
    if (!log) return false

    const flag = log.redFlags.find(f => f.id === flagId)
    if (!flag) return false

    flag.status = 'resolved'
    flag.resolution = resolution
    this.updateStatistics()
    return true
  }

  // ============================================
  // IMMUTABILITY (Post-Redistribution)
  // ============================================

  makeImmutable(logId: string, benefitRedistributionId: string): boolean {
    const log = this.state.logs.get(logId)
    if (!log || log.status !== 'validated') return false

    log.immutable = true
    log.benefitRedistributionId = benefitRedistributionId
    this.state.immutableLogs.add(logId)
    this.updateStatistics()
    return true
  }

  isImmutable(logId: string): boolean {
    return this.state.immutableLogs.has(logId)
  }

  // ============================================
  // QUERIES & STATISTICS
  // ============================================

  getLog(logId: string): ContributionLog | undefined {
    return this.state.logs.get(logId)
  }

  getLogsByAffiliate(affiliateId: string): ContributionLog[] {
    return Array.from(this.state.logs.values()).filter(l => l.affiliateId === affiliateId)
  }

  getLogsByVenture(ventureId: string): ContributionLog[] {
    return Array.from(this.state.logs.values()).filter(l => l.ventureId === ventureId)
  }

  getLogsByStatus(status: ContributionLog['status']): ContributionLog[] {
    return Array.from(this.state.logs.values()).filter(l => l.status === status)
  }

  getValidationQueue(): ContributionLog[] {
    return this.state.validationQueue.map(id => this.state.logs.get(id)!).filter(Boolean)
  }

  getStatistics(): ContributionStatistics {
    return { ...this.state.statistics }
  }

  private updateStatistics(): void {
    const logs = Array.from(this.state.logs.values())
    this.state.statistics = {
      totalLogs: logs.length,
      draftLogs: logs.filter(l => l.status === 'draft').length,
      claimedLogs: logs.filter(l => l.status === 'claimed').length,
      underReviewLogs: logs.filter(l => l.status === 'under_review').length,
      validatedLogs: logs.filter(l => l.status === 'validated').length,
      rejectedLogs: logs.filter(l => l.status === 'rejected').length,
      disputedLogs: logs.filter(l => l.status === 'disputed').length,
      immutableLogs: this.state.immutableLogs.size,
      totalValueTQ: logs.filter(l => l.acceptedValueTQ).reduce((sum, l) => sum + (l.acceptedValueTQ || 0), 0),
      totalValueZNU: logs.filter(l => l.acceptedValueZNU).reduce((sum, l) => sum + (l.acceptedValueZNU || 0), 0),
      averageValidationTimeHours: this.calculateAverageValidationTime(logs),
      peerReviewParticipationRate: this.calculateParticipationRate(),
    }
  }

  private calculateAverageValidationTime(logs: ContributionLog[]): number {
    const validated = logs.filter(l => l.validatedAt && l.claimedAt)
    if (validated.length === 0) return 0
    const totalHours = validated.reduce((sum, l) => sum + (l.validatedAt! - l.claimedAt) / (1000 * 60 * 60), 0)
    return totalHours / validated.length
  }

  private calculateParticipationRate(): number {
    const assignments = Array.from(this.state.reviewAssignments.values())
    if (assignments.length === 0) return 0
    const completed = assignments.filter(a => a.status === 'completed').length
    return completed / assignments.length
  }

  // ============================================
  // APPEALS (if enabled)
  // ============================================

  submitAppeal(logId: string, appellantId: string, reason: string): boolean {
    if (!this.config.allowAppeals) return false

    const log = this.state.logs.get(logId)
    if (!log || log.status !== 'rejected') return false

    log.status = 'disputed'
    log.redFlags.push({
      id: uid(),
      type: 'policy_violation',
      description: `Appeal by ${appellantId}: ${reason}`,
      raisedBy: appellantId,
      raisedAt: now(),
      status: 'open',
    })

    this.updateStatistics()
    return true
  }

  resolveAppeal(logId: string, accepted: boolean, resolverId: string): boolean {
    const log = this.state.logs.get(logId)
    if (!log || log.status !== 'disputed') return false

    if (accepted) {
      log.status = 'claimed' // back to peer review
      this.initiatePeerReview(logId)
    } else {
      log.status = 'rejected'
      log.redFlags.push({
        id: uid(),
        type: 'policy_violation',
        description: `Appeal rejected by ${resolverId}`,
        raisedBy: resolverId,
        raisedAt: now(),
        status: 'resolved',
        resolution: 'Appeal denied',
      })
    }

    this.updateStatistics()
    return true
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      logs: Array.from(this.state.logs.entries()),
      reviewAssignments: Array.from(this.state.reviewAssignments.entries()),
      validationQueue: this.state.validationQueue,
      immutableLogs: Array.from(this.state.immutableLogs),
      statistics: this.state.statistics,
      config: this.config,
    }, null, 2)
  }

  static fromJSON(json: string, nrpCasCore?: any): ContributionAccountingEngine {
    const data = JSON.parse(json)
    const engine = new ContributionAccountingEngine(data.config)
    engine.state = {
      logs: new Map(data.logs),
      reviewAssignments: new Map(data.reviewAssignments),
      validationQueue: data.validationQueue,
      immutableLogs: new Set(data.immutableLogs),
      statistics: data.statistics,
    }
    if (nrpCasCore) engine.setNRPCASCore(nrpCasCore)
    return engine
  }
}

export interface ContributionAccountingConfig {
  minPeerReviews: number
  minConfidence: number
  reviewTimeoutHours: number
  autoAssignReviewers: boolean
  stakeReputationAmount: number
  allowAppeals: boolean
  appealTimeoutHours: number
}

export const contributionAccountingEngine = new ContributionAccountingEngine()