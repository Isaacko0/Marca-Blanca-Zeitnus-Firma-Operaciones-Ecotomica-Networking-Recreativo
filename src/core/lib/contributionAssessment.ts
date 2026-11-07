// HSCSG v15 OS — Contribution Assessment Protocol
// Hybrid: Automated (risk-based confidence) + Subjective (proof-of-stake peer validation)
// Capa 3: Operación Productiva — OVNi 3.0 IT: "Distinction between subjective evaluation component and automated component"

import type { ContributionLog, NRPEvent, NRPAffiliate, VFType } from '@core/lib/nrpCasCore'
import type { REAResource } from '@core/lib/reaIntegration'
import { uid, now } from '@core/lib/utils'

// ============================================
// ASSESSMENT TYPES
// ============================================

export type AssessmentDimension =
  | 'hardware_usage'      // use of physical equipment (validated by sensors/logs)
  | 'documentation'       // docs, specs, designs (validated by peer review)
  | 'code_contribution'   // software (validated by CI/tests/git history)
  | 'peer_contribution'   // others contributed to same process (validated by cross-ref)
  | 'reputation'          // agent's historical reliability (validated by reputation dims)
  | 'deliverable_quality' // quality of outputs (validated by expert review)
  | 'process_compliance'  // followed methodology (validated by template adherence)

export interface DimensionAssessment {
  dimension: AssessmentDimension
  automatedScore: number     // 0-1 from automated validation
  subjectiveScore: number    // 0-1 from peer review
  weight: number             // dimension weight in total confidence
  evidence: AssessmentEvidence[]
  riskLevel: 'low' | 'medium' | 'high'
  validated: boolean
}

export interface AssessmentEvidence {
  type: 'sensor_log' | 'git_commit' | 'document' | 'peer_testimony' | 'test_result' | 'template_compliance'
  source: string             // identifier of evidence source
  timestamp: number
  verified: boolean
  verificationMethod: 'automated' | 'manual' | 'consensus'
  confidence: number         // 0-1
}

export interface AssessmentResult {
  logId: string
  overallConfidence: number           // 0-1 combined confidence
  dimensionAssessments: DimensionAssessment[]
  recommendedVerdict: 'approve' | 'request_changes' | 'reject'
  riskFlags: RiskFlag[]
  assessedAt: number
  assessedBy: 'automated' | 'hybrid' | 'manual'
}

export interface RiskFlag {
  id: string
  type: 'high_risk_dimension' | 'insufficient_evidence' | 'reputation_mismatch' | 'duplicate_claim' | 'policy_violation'
  dimension?: AssessmentDimension
  description: string
  severity: 'info' | 'warning' | 'critical'
  mitigation?: string
}

export interface PeerValidator {
  id: string
  stakeAmount: number
  reputationDimensions: Map<string, number>
  validationHistory: ValidationRecord[]
}

export interface ValidationRecord {
  logId: string
  verdict: 'approve' | 'request_changes' | 'reject'
  confidence: number
  accuracy: number          // how close to final outcome (updated later)
  timestamp: number
  stakeAtRisk: number
  stakeOutcome: 'kept' | 'slashed' | 'rewarded'
}

// ============================================
// AUTOMATED ASSESSMENT ENGINE
// ============================================

export class AutomatedAssessmentEngine {
  private dimensionValidators: Map<AssessmentDimension, DimensionValidator> = new Map()
  private sensorDataSources: Map<string, SensorDataSource> = new Map()
  private gitRepositories: Map<string, GitRepository> = new Map()
  private templateRegistry: Map<string, ProcessTemplate> = new Map()

  constructor() {
    this.registerDefaultValidators()
  }

  private registerDefaultValidators(): void {
    // Hardware usage validator (sensor logs)
    this.dimensionValidators.set('hardware_usage', {
      dimension: 'hardware_usage',
      validate: async (log: ContributionLog, resources: REAResource[]) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        // Check for sensor logs matching claimed hours
        for (const resourceId of log.deliverables) {
          const sensorData = this.sensorDataSources.get(resourceId)
          if (sensorData) {
            const usage = await sensorData.getUsage(log.affiliateId, log.claimedAt, log.claimedAt + log.hoursClaimed * 3600000)
            if (usage > 0) {
              score += 0.3
              evidence.push({
                type: 'sensor_log',
                source: resourceId,
                timestamp: now(),
                verified: true,
                verificationMethod: 'automated',
                confidence: Math.min(usage / (log.hoursClaimed * 3600), 1),
              })
            }
          }
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0.5 ? 'low' : 'medium' }
      },
      weight: 0.25,
    })

    // Documentation validator (cross-ref with knowledge commons)
    this.dimensionValidators.set('documentation', {
      dimension: 'documentation',
      validate: async (log: ContributionLog) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        // Check for linked documents in deliverables
        const docDeliverables = log.deliverables.filter(d => d.endsWith('.md') || d.endsWith('.pdf') || d.includes('doc'))
        if (docDeliverables.length > 0) {
          score += 0.4
          for (const doc of docDeliverables) {
            evidence.push({
              type: 'document',
              source: doc,
              timestamp: now(),
              verified: true, // would check existence in commons
              verificationMethod: 'automated',
              confidence: 0.8,
            })
          }
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0 ? 'low' : 'medium' }
      },
      weight: 0.15,
    })

    // Code contribution validator (git history)
    this.dimensionValidators.set('code_contribution', {
      dimension: 'code_contribution',
      validate: async (log: ContributionLog) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        const codeDeliverables = log.deliverables.filter(d => d.includes('github.com') || d.includes('gitlab') || d.endsWith('.ts') || d.endsWith('.js'))
        if (codeDeliverables.length > 0) {
          score += 0.5
          for (const repo of codeDeliverables) {
            const gitRepo = this.gitRepositories.get(repo)
            if (gitRepo) {
              const commits = await gitRepo.getCommitsByAuthor(log.affiliateId, log.claimedAt, log.claimedAt + log.hoursClaimed * 3600000)
              if (commits.length > 0) {
                score += 0.3
                evidence.push({
                  type: 'git_commit',
                  source: repo,
                  timestamp: now(),
                  verified: true,
                  verificationMethod: 'automated',
                  confidence: Math.min(commits.length / 5, 1),
                })
              }
            }
          }
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0.3 ? 'low' : 'medium' }
      },
      weight: 0.2,
    })

    // Peer contribution validator (cross-reference other logs)
    this.dimensionValidators.set('peer_contribution', {
      dimension: 'peer_contribution',
      validate: async (log: ContributionLog, allLogs: ContributionLog[]) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        // Find other logs referencing same venture/project/process
        const relatedLogs = allLogs.filter(l =>
          l.id !== log.id &&
          l.ventureId === log.ventureId &&
          l.status === 'validated' &&
          Math.abs(l.claimedAt - log.claimedAt) < 86400000 // within 24h
        )

        if (relatedLogs.length > 0) {
          score += 0.3
          evidence.push({
            type: 'peer_testimony',
            source: `cross_ref_${relatedLogs.map(l => l.id).join(',')}`,
            timestamp: now(),
            verified: true,
            verificationMethod: 'automated',
            confidence: Math.min(relatedLogs.length / 3, 1),
          })
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0 ? 'low' : 'medium' }
      },
      weight: 0.15,
    })

    // Reputation validator (historical reliability)
    this.dimensionValidators.set('reputation', {
      dimension: 'reputation',
      validate: async (log: ContributionLog, affiliate: NRPAffiliate) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        const qualityRep = affiliate.reputationDimensions.find(r => r.dimension === 'quality')
        const commitmentRep = affiliate.reputationDimensions.find(r => r.dimension === 'commitment')
        const regularityRep = affiliate.reputationDimensions.find(r => r.dimension === 'regularity')

        if (qualityRep) {
          score += qualityRep.score * 0.4
          evidence.push({
            type: 'peer_testimony',
            source: `reputation_quality_${qualityRep.score}`,
            timestamp: now(),
            verified: true,
            verificationMethod: 'automated',
            confidence: qualityRep.score,
          })
        }
        if (commitmentRep) {
          score += commitmentRep.score * 0.3
        }
        if (regularityRep) {
          score += regularityRep.score * 0.3
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0.5 ? 'low' : 'medium' }
      },
      weight: 0.15,
    })

    // Deliverable quality (requires expert review - low automation)
    this.dimensionValidators.set('deliverable_quality', {
      dimension: 'deliverable_quality',
      validate: async () => {
        return { score: 0.3, evidence: [], riskLevel: 'high' } // requires subjective review
      },
      weight: 0.05,
    })

    // Process compliance (template adherence)
    this.dimensionValidators.set('process_compliance', {
      dimension: 'process_compliance',
      validate: async (log: ContributionLog) => {
        const evidence: AssessmentEvidence[] = []
        let score = 0

        // Check if log follows template structure
        if (log.activityDescription.length > 50 && log.deliverables.length > 0) {
          score += 0.5
          evidence.push({
            type: 'template_compliance',
            source: 'standard_contribution_template',
            timestamp: now(),
            verified: true,
            verificationMethod: 'automated',
            confidence: 0.7,
          })
        }

        return { score: Math.min(score, 1), evidence, riskLevel: score > 0.3 ? 'low' : 'medium' }
      },
      weight: 0.05,
    })
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Ejecuta evaluación automatizada completa
   * Retorna confidence level 0-1 y desglose por dimensiones
   */
  async assess(log: ContributionLog, context: AssessmentContext): Promise<AssessmentResult> {
    const dimensionResults: DimensionAssessment[] = []
    const riskFlags: RiskFlag[] = []

    for (const [dimension, validator] of this.dimensionValidators.entries()) {
      const result = await validator.validate(log, context)
      const assessment: DimensionAssessment = {
        dimension,
        automatedScore: result.score,
        subjectiveScore: 0, // filled by peer review
        weight: validator.weight,
        evidence: result.evidence,
        riskLevel: result.riskLevel,
        validated: result.score > 0.3,
      }

      dimensionResults.push(assessment)

      // Generate risk flags for low-confidence dimensions
      if (result.score < 0.3 && validator.weight > 0.1) {
        riskFlags.push({
          id: uid(),
          type: 'high_risk_dimension',
          dimension,
          description: `Low automated confidence in ${dimension} (${(result.score * 100).toFixed(0)}%)`,
          severity: result.riskLevel === 'high' ? 'critical' : 'warning',
          mitigation: 'Requires peer reviewer focus on this dimension',
        })
      }
    }

    // Calculate overall confidence (weighted average of automated scores)
    let weightedSum = 0
    let totalWeight = 0
    for (const dim of dimensionResults) {
      weightedSum += dim.automatedScore * dim.weight
      totalWeight += dim.weight
    }
    const overallConfidence = totalWeight > 0 ? weightedSum / totalWeight : 0

    // Determine recommended verdict based on confidence thresholds
    let recommendedVerdict: AssessmentResult['recommendedVerdict'] = 'request_changes'
    if (overallConfidence >= 0.8 && riskFlags.filter(f => f.severity === 'critical').length === 0) {
      recommendedVerdict = 'approve'
    } else if (overallConfidence < 0.4 || riskFlags.some(f => f.severity === 'critical')) {
      recommendedVerdict = 'reject'
    }

    return {
      logId: log.id,
      overallConfidence,
      dimensionAssessments: dimensionResults,
      recommendedVerdict,
      riskFlags,
      assessedAt: now(),
      assessedBy: 'automated',
    }
  }

  /**
   * Validador específico para hardware prototype (ejemplo OVNi: "look at hardware prototype")
   * Puede aumentar confidence de 60% → 90% solo validando este componente
   */
  async validateHighRiskComponent(log: ContributionLog, componentType: 'hardware_prototype' | 'safety_critical' | 'financial'): Promise<Partial<AssessmentResult>> {
    const riskFlags: RiskFlag[] = []

    switch (componentType) {
      case 'hardware_prototype':
        // Check for hardware test results, photos, sensor data
        const hwEvidence = log.deliverables.filter(d =>
          d.includes('prototype') || d.includes('hardware') || d.includes('schematic') || d.includes('bom')
        )
        if (hwEvidence.length === 0) {
          riskFlags.push({
            id: uid(),
            type: 'high_risk_dimension',
            dimension: 'hardware_usage',
            description: 'Hardware prototype claimed but no schematic/BOM/test results provided',
            severity: 'critical',
            mitigation: 'Reviewer must physically inspect or request hardware evidence',
          })
        }
        break

      case 'safety_critical':
        // Require safety review, certifications
        riskFlags.push({
          id: uid(),
          type: 'high_risk_dimension',
          dimension: 'process_compliance',
          description: 'Safety-critical contribution requires certified review',
          severity: 'critical',
          mitigation: 'Mandatory expert safety reviewer assignment',
        })
        break

      case 'financial':
        // Require audit trail, dual-control
        riskFlags.push({
          id: uid(),
          type: 'high_risk_dimension',
          dimension: 'process_compliance',
          description: 'Financial contribution requires dual-authorization audit trail',
          severity: 'critical',
          mitigation: 'Assign financial governance reviewer',
        })
        break
    }

    return { riskFlags }
  }

  // ============================================
  // EXTERNAL INTEGRATIONS (to be implemented)
  // ============================================

  registerSensorDataSource(resourceId: string, source: SensorDataSource): void {
    this.sensorDataSources.set(resourceId, source)
  }

  registerGitRepository(repoUrl: string, repo: GitRepository): void {
    this.gitRepositories.set(repoUrl, repo)
  }

  registerProcessTemplate(templateId: string, template: ProcessTemplate): void {
    this.templateRegistry.set(templateId, template)
  }
}

export interface DimensionValidator {
  dimension: AssessmentDimension
  validate: (log: ContributionLog, context: any) => Promise<{ score: number; evidence: AssessmentEvidence[]; riskLevel: 'low' | 'medium' | 'high' }>
  weight: number
}

export interface AssessmentContext {
  affiliate: NRPAffiliate
  ventureResources: REAResource[]
  allLogs: ContributionLog[]
  nrpEvents: NRPEvent[]
}

export interface SensorDataSource {
  getUsage(agentId: string, startTime: number, endTime: number): Promise<number>
}

export interface GitRepository {
  getCommitsByAuthor(authorId: string, startTime: number, endTime: number): Promise<Array<{ hash: string; message: string; timestamp: number }>>
}

export interface ProcessTemplate {
  id: string
  name: string
  requiredFields: string[]
  requiredDeliverables: string[]
  validationRules: string[]
}

// ============================================
// SUBJECTIVE ASSESSMENT (Proof-of-Stake Peer Review)
// ============================================

export class SubjectiveAssessmentEngine {
  private validators: Map<string, PeerValidator> = new Map()
  private stakePool: Map<string, number> = new Map() // validatorId -> staked amount

  registerValidator(validator: PeerValidator): void {
    this.validators.set(validator.id, validator)
    this.stakePool.set(validator.id, validator.stakeAmount)
  }

  /**
   * Asigna validadores usando proof-of-stake
   * Probabilidad de selección ∝ stake * reputation
   */
  selectValidators(log: ContributionLog, count: number, context: AssessmentContext): PeerValidator[] {
    const candidates = Array.from(this.validators.values()).filter(v =>
      v.reputationDimensions.has('quality') && v.reputationDimensions.get('quality')! >= 0.5
    )

    // Weight by stake * quality reputation
    const weighted = candidates.map(v => ({
      validator: v,
      weight: v.stakeAmount * (v.reputationDimensions.get('quality') || 0.5),
    }))

    weighted.sort((a, b) => b.weight - a.weight)
    return weighted.slice(0, count).map(w => w.validator)
  }

  /**
   * Procesa veredicto del validador
   * Actualiza stake: slashed si verdict incorrecto, rewarded si correcto
   */
  async processVerdict(
    validatorId: string,
    logId: string,
    verdict: 'approve' | 'request_changes' | 'reject',
    confidence: number,
    finalOutcome: 'approved' | 'rejected' | 'changes_requested'
  ): Promise<void> {
    const validator = this.validators.get(validatorId)
    if (!validator) return

    const stakeAtRisk = validator.stakeAmount * 0.1 // 10% at risk per validation
    let stakeOutcome: ValidationRecord['stakeOutcome'] = 'kept'

    // Determine accuracy
    const isAccurate = (
      (verdict === 'approve' && finalOutcome === 'approved') ||
      (verdict === 'reject' && finalOutcome === 'rejected') ||
      (verdict === 'request_changes' && finalOutcome === 'changes_requested')
    )

    if (isAccurate) {
      stakeOutcome = 'rewarded'
      this.stakePool.set(validatorId, (this.stakePool.get(validatorId) || 0) + stakeAtRisk * 0.05) // 5% reward
    } else {
      stakeOutcome = 'slashed'
      this.stakePool.set(validatorId, (this.stakePool.get(validatorId) || 0) - stakeAtRisk)
    }

    validator.validationHistory.push({
      logId,
      verdict,
      confidence,
      accuracy: isAccurate ? 1 : 0,
      timestamp: now(),
      stakeAtRisk,
      stakeOutcome,
    })

    // Update reputation dimensions based on validation accuracy
    this.updateValidatorReputation(validatorId, isAccurate)
  }

  private updateValidatorReputation(validatorId: string, accurate: boolean): void {
    const validator = this.validators.get(validatorId)
    if (!validator) return

    const currentQuality = validator.reputationDimensions.get('quality') || 0.5
    validator.reputationDimensions.set('quality', Math.max(0, Math.min(1, currentQuality + (accurate ? 0.02 : -0.05))))
  }

  getValidatorStake(validatorId: string): number {
    return this.stakePool.get(validatorId) || 0
  }
}

// ============================================
// HYBRID ASSESSMENT ORCHESTRATOR
// ============================================

export class HybridAssessmentOrchestrator {
  private automated: AutomatedAssessmentEngine
  private subjective: SubjectiveAssessmentEngine

  constructor() {
    this.automated = new AutomatedAssessmentEngine()
    this.subjective = new SubjectiveAssessmentEngine()
  }

  /**
   * Flujo completo de evaluación híbrida:
   * 1. Automated assessment → confidence level + risk flags
   * 2. Peer reviewers assigned (proof-of-stake) focusing on high-risk dimensions
   * 3. Subjective reviews submitted
   * 4. Combined confidence = automated * subjective_weight + subjective * (1-subjective_weight)
   * 5. Final verdict based on combined confidence
   */
  async assess(log: ContributionLog, context: AssessmentContext): Promise<AssessmentResult> {
    // Step 1: Automated assessment
    const automatedResult = await this.automated.assess(log, context)

    // Step 2: Identify high-risk dimensions needing peer focus
    const highRiskDimensions = automatedResult.dimensionAssessments
      .filter(d => d.riskLevel === 'high' || d.automatedScore < 0.5)
      .map(d => d.dimension)

    // Step 3: Select peer validators (proof-of-stake)
    const validators = this.subjective.selectValidators(log, 3, context)

    // Step 4: Notify validators with focus areas
    // (In real implementation: send notifications, create review tasks)

    // Return automated result for now; subjective reviews processed async
    return {
      ...automatedResult,
      assessedBy: 'hybrid',
    }
  }

  /**
   * Combina resultados automatizados + subjetivos
   */
  combineResults(automated: AssessmentResult, subjectiveReviews: PeerReview[]): AssessmentResult {
    // Weight: 60% automated, 40% subjective (configurable)
    const automatedWeight = 0.6
    const subjectiveWeight = 0.4

    const avgSubjectiveConfidence = subjectiveReviews.reduce((sum, r) => sum + r.confidence, 0) / subjectiveReviews.length
    const approvalRate = subjectiveReviews.filter(r => r.verdict === 'approve').length / subjectiveReviews.length

    const combinedConfidence = automated.overallConfidence * automatedWeight + avgSubjectiveConfidence * subjectiveWeight

    let finalVerdict: AssessmentResult['recommendedVerdict'] = 'request_changes'
    if (combinedConfidence >= 0.75 && approvalRate >= 0.67) {
      finalVerdict = 'approve'
    } else if (combinedConfidence < 0.4 || approvalRate < 0.33) {
      finalVerdict = 'reject'
    }

    return {
      ...automated,
      overallConfidence: combinedConfidence,
      recommendedVerdict: finalVerdict,
      assessedBy: 'hybrid',
    }
  }

  getAutomatedEngine(): AutomatedAssessmentEngine {
    return this.automated
  }

  getSubjectiveEngine(): SubjectiveAssessmentEngine {
    return this.subjective
  }
}

export const hybridAssessmentOrchestrator = new HybridAssessmentOrchestrator()