// HSCSG v15 OS — Benefit Redistribution (Integración con 4 Registros D4)
// Capa 3: Operación Productiva — motor de redistribución continua + FR Feedback Loop
// D3: Continuous Redistribution + FR Feedback Loop
// D4: 4 Registros Separados (Contribución, Responsabilidad, Uso Recursos, Beneficios Económicos)

import type { NRPAffiliate, NRPVenture, BenefitRedistributionRecord, BenefitDistribution } from '@core/lib/nrpCasCore'
import type { ValueEquationInstance } from '@core/lib/valueEquation'
import { uid, now } from '@core/lib/utils'

// ============================================
// FOUR REGISTRIES (D4) — Core Data Structures
// ============================================

/**
 * Registro 1: Contribución — ValueFlows logged
 * Tracks all validated contributions per affiliate per venture
 */
export interface ContributionRegistryEntry {
  id: string
  ventureId: string
  affiliateId: string
  periodStart: number
  periodEnd: number
  // ValueFlows dimensions
  flows: Map<string, number> // VFType -> count
  hours: number
  deliverables: string[]
  // Quality metrics
  qualityScore: number // 0-1 average
  validationCount: number
  // Timestamps
  firstContribution: number
  lastContribution: number
  // Status
  status: 'active' | 'archived'
}

export interface ContributionRegistry {
  entries: Map<string, ContributionRegistryEntry> // key: `${ventureId}:${affiliateId}:${period}`
  ventureIndex: Map<string, Set<string>> // ventureId -> entry IDs
  affiliateIndex: Map<string, Set<string>> // affiliateId -> entry IDs
}

/**
 * Registro 2: Responsabilidad — Custodianship, risk taken
 * Tracks custodial duties, risk exposure, governance participation
 */
export interface ResponsibilityRegistryEntry {
  id: string
  ventureId: string
  affiliateId: string
  periodStart: number
  periodEnd: number
  // Custodianship
  custodialRoles: CustodialRole[]
  custodialHours: number
  assetsUnderCustody: string[] // resource IDs
  // Risk
  riskExposure: RiskExposure[]
  // Governance
  governanceParticipation: GovernanceParticipation
  // Metrics
  responsibilityScore: number // 0-1
  lastUpdated: number
}

export interface CustodialRole {
  resourceId: string
  role: 'primary' | 'secondary' | 'auditor' | 'regenerator'
  responsibilities: string[]
  startDate: number
  endDate?: number
  fiduciaryCompliant: boolean
}

export interface RiskExposure {
  id: string
  type: 'financial' | 'legal' | 'operational' | 'ecological' | 'reputational'
  description: string
  magnitude: number // 0-1
  mitigated: boolean
  mitigationActions: string[]
  assumedAt: number
}

export interface GovernanceParticipation {
  votesCast: number
  proposalsCreated: number
  reviewsCompleted: number
  consensusParticipation: number // 0-1
  leadershipRoles: string[]
}

export interface ResponsibilityRegistry {
  entries: Map<string, ResponsibilityRegistryEntry> // key: `${ventureId}:${affiliateId}`
  ventureIndex: Map<string, Set<string>>
  affiliateIndex: Map<string, Set<string>>
}

/**
 * Registro 3: Uso de Recursos — Access to commons/tools
 * Tracks resource bookings, utilization, maintenance contributions
 */
export interface ResourceUsageRegistryEntry {
  id: string
  ventureId: string
  affiliateId: string
  periodStart: number
  periodEnd: number
  // Bookings
  bookings: ResourceBooking[]
  totalHoursBooked: number
  totalHoursUsed: number
  utilizationRate: number
  // Maintenance contributions
  maintenanceContributions: MaintenanceContribution[]
  // Shared resource access
  commonsAccess: CommonsAccess[]
  // Metrics
  usageScore: number // 0-1
  lastUpdated: number
}

export interface ResourceBooking {
  resourceId: string
  resourceName: string
  startTime: number
  endTime: number
  duration: number
  purpose: string
  completed: boolean
}

export interface MaintenanceContribution {
  resourceId: string
  type: 'preventive' | 'corrective' | 'calibration' | 'upgrade'
  hours: number
  cost?: number
  verified: boolean
}

export interface CommonsAccess {
  resourceId: string
  resourceName: string
  accessType: 'read' | 'write' | 'admin'
  hoursUsed: number
  contributionBack: boolean // contributed improvements back to commons
}

export interface ResourceUsageRegistry {
  entries: Map<string, ResourceUsageRegistryEntry> // key: `${ventureId}:${affiliateId}`
  ventureIndex: Map<string, Set<string>>
  affiliateIndex: Map<string, Set<string>>
}

/**
 * Registro 4: Beneficios Económicos — Revenue share
 * Tracks all economic distributions received
 */
export interface EconomicBenefitRegistryEntry {
  id: string
  ventureId: string
  affiliateId: string
  periodStart: number
  periodEnd: number
  // Distributions received
  distributions: ReceivedDistribution[]
  // Totals
  totalTQReceived: number
  totalZNUReceived: number
  totalUSDCReceived: number
  // Demurrage
  totalDemurragePaid: number
  // Net position
  netPositionTQ: number
  netPositionZNU: number
  netPositionUSDC: number
  lastUpdated: number
}

export interface ReceivedDistribution {
  redistributionId: string
  date: number
  amountTQ: number
  amountZNU: number
  amountUSDC: number
  basis: string
  demurrageApplied: number
}

export interface EconomicBenefitRegistry {
  entries: Map<string, EconomicBenefitRegistryEntry> // key: `${ventureId}:${affiliateId}`
  ventureIndex: Map<string, Set<string>>
  affiliateIndex: Map<string, Set<string>>
}

// ============================================
// FOUR REGISTRIES ENGINE
// ============================================

export class FourRegistriesEngine {
  contributionRegistry: ContributionRegistry
  responsibilityRegistry: ResponsibilityRegistry
  resourceUsageRegistry: ResourceUsageRegistry
  economicBenefitRegistry: EconomicBenefitRegistry

  constructor() {
    this.contributionRegistry = {
      entries: new Map(),
      ventureIndex: new Map(),
      affiliateIndex: new Map(),
    }
    this.responsibilityRegistry = {
      entries: new Map(),
      ventureIndex: new Map(),
      affiliateIndex: new Map(),
    }
    this.resourceUsageRegistry = {
      entries: new Map(),
      ventureIndex: new Map(),
      affiliateIndex: new Map(),
    }
    this.economicBenefitRegistry = {
      entries: new Map(),
      ventureIndex: new Map(),
      affiliateIndex: new Map(),
    }
  }

  // ============================================
  // REGISTRY 1: CONTRIBUTION
  // ============================================

  recordContribution(
    ventureId: string,
    affiliateId: string,
    periodStart: number,
    periodEnd: number,
    data: Partial<ContributionRegistryEntry>
  ): ContributionRegistryEntry {
    const key = `${ventureId}:${affiliateId}:${periodStart}`
    let entry = this.contributionRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart,
        periodEnd,
        flows: new Map(),
        hours: 0,
        deliverables: [],
        qualityScore: 0,
        validationCount: 0,
        firstContribution: now(),
        lastContribution: now(),
        status: 'active',
      }
      this.contributionRegistry.entries.set(key, entry)
      this.indexEntry(this.contributionRegistry, entry)
    }

    // Update with new data
    if (data.flows) {
      for (const [type, count] of data.flows) {
        entry.flows.set(type, (entry.flows.get(type) || 0) + count)
      }
    }
    if (data.hours) entry.hours += data.hours
    if (data.deliverables) entry.deliverables.push(...data.deliverables)
    if (data.qualityScore !== undefined) {
      entry.qualityScore = (entry.qualityScore * entry.validationCount + data.qualityScore) / (entry.validationCount + 1)
    }
    if (data.validationCount) entry.validationCount += data.validationCount
    entry.lastContribution = now()

    return entry
  }

  getContributionEntry(ventureId: string, affiliateId: string, periodStart: number): ContributionRegistryEntry | undefined {
    return this.contributionRegistry.entries.get(`${ventureId}:${affiliateId}:${periodStart}`)
  }

  getVentureContributions(ventureId: string): ContributionRegistryEntry[] {
    const ids = this.contributionRegistry.ventureIndex.get(ventureId) || new Set()
    return Array.from(ids).map(id => this.contributionRegistry.entries.get(id)!).filter(Boolean)
  }

  getAffiliateContributions(affiliateId: string): ContributionRegistryEntry[] {
    const ids = this.contributionRegistry.affiliateIndex.get(affiliateId) || new Set()
    return Array.from(ids).map(id => this.contributionRegistry.entries.get(id)!).filter(Boolean)
  }

  // ============================================
  // REGISTRY 2: RESPONSIBILITY
  // ============================================

  updateResponsibility(
    ventureId: string,
    affiliateId: string,
    updates: Partial<ResponsibilityRegistryEntry>
  ): ResponsibilityRegistryEntry {
    const key = `${ventureId}:${affiliateId}`
    let entry = this.responsibilityRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart: now(),
        periodEnd: now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        custodialRoles: [],
        custodialHours: 0,
        assetsUnderCustody: [],
        riskExposure: [],
        governanceParticipation: {
          votesCast: 0,
          proposalsCreated: 0,
          reviewsCompleted: 0,
          consensusParticipation: 0,
          leadershipRoles: [],
        },
        responsibilityScore: 0,
        lastUpdated: now(),
      }
      this.responsibilityRegistry.entries.set(key, entry)
      this.indexEntry(this.responsibilityRegistry, entry)
    }

    // Apply updates
    Object.assign(entry, updates)
    entry.lastUpdated = now()
    entry.periodEnd = now() + 30 * 24 * 60 * 60 * 1000

    // Recalculate responsibility score
    entry.responsibilityScore = this.calculateResponsibilityScore(entry)

    return entry
  }

  private calculateResponsibilityScore(entry: ResponsibilityRegistryEntry): number {
    let score = 0
    // Custodial roles weight
    score += entry.custodialRoles.length * 0.15
    score += entry.custodialHours * 0.001
    // Risk exposure (taking risk = responsibility)
    score += entry.riskExposure.filter(r => r.mitigated).length * 0.1
    // Governance participation
    const gp = entry.governanceParticipation
    score += (gp.votesCast + gp.proposalsCreated + gp.reviewsCompleted) * 0.01
    score += gp.consensusParticipation * 0.2
    return Math.min(score, 1)
  }

  getResponsibilityEntry(ventureId: string, affiliateId: string): ResponsibilityRegistryEntry | undefined {
    return this.responsibilityRegistry.entries.get(`${ventureId}:${affiliateId}`)
  }

  // ============================================
  // REGISTRY 3: RESOURCE USAGE
  // ============================================

  recordResourceUsage(
    ventureId: string,
    affiliateId: string,
    booking: ResourceBooking
  ): ResourceUsageRegistryEntry {
    const key = `${ventureId}:${affiliateId}`
    let entry = this.resourceUsageRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart: now(),
        periodEnd: now() + 30 * 24 * 60 * 60 * 1000,
        bookings: [],
        totalHoursBooked: 0,
        totalHoursUsed: 0,
        utilizationRate: 0,
        maintenanceContributions: [],
        commonsAccess: [],
        usageScore: 0,
        lastUpdated: now(),
      }
      this.resourceUsageRegistry.entries.set(key, entry)
      this.indexEntry(this.resourceUsageRegistry, entry)
    }

    entry.bookings.push(booking)
    entry.totalHoursBooked += booking.duration
    if (booking.completed) entry.totalHoursUsed += booking.duration
    entry.lastUpdated = now()
    entry.usageScore = this.calculateUsageScore(entry)

    return entry
  }

  recordMaintenanceContribution(
    ventureId: string,
    affiliateId: string,
    contribution: MaintenanceContribution
  ): ResourceUsageRegistryEntry {
    const key = `${ventureId}:${affiliateId}`
    let entry = this.resourceUsageRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart: now(),
        periodEnd: now() + 30 * 24 * 60 * 60 * 1000,
        bookings: [],
        totalHoursBooked: 0,
        totalHoursUsed: 0,
        utilizationRate: 0,
        maintenanceContributions: [],
        commonsAccess: [],
        usageScore: 0,
        lastUpdated: now(),
      }
      this.resourceUsageRegistry.entries.set(key, entry)
      this.indexEntry(this.resourceUsageRegistry, entry)
    }

    entry.maintenanceContributions.push(contribution)
    entry.lastUpdated = now()
    entry.usageScore = this.calculateUsageScore(entry)

    return entry
  }

  recordCommonsAccess(
    ventureId: string,
    affiliateId: string,
    access: CommonsAccess
  ): ResourceUsageRegistryEntry {
    const key = `${ventureId}:${affiliateId}`
    let entry = this.resourceUsageRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart: now(),
        periodEnd: now() + 30 * 24 * 60 * 60 * 1000,
        bookings: [],
        totalHoursBooked: 0,
        totalHoursUsed: 0,
        utilizationRate: 0,
        maintenanceContributions: [],
        commonsAccess: [],
        usageScore: 0,
        lastUpdated: now(),
      }
      this.resourceUsageRegistry.entries.set(key, entry)
      this.indexEntry(this.resourceUsageRegistry, entry)
    }

    entry.commonsAccess.push(access)
    entry.lastUpdated = now()
    entry.usageScore = this.calculateUsageScore(entry)

    return entry
  }

  private calculateUsageScore(entry: ResourceUsageRegistryEntry): number {
    let score = 0
    score += Math.min(entry.totalHoursUsed / 100, 0.3) // up to 30% for usage
    score += entry.maintenanceContributions.length * 0.1
    score += entry.commonsAccess.filter(a => a.contributionBack).length * 0.15
    return Math.min(score, 1)
  }

  getResourceUsageEntry(ventureId: string, affiliateId: string): ResourceUsageRegistryEntry | undefined {
    return this.resourceUsageRegistry.entries.get(`${ventureId}:${affiliateId}`)
  }

  // ============================================
  // REGISTRY 4: ECONOMIC BENEFIT
  // ============================================

  recordDistribution(
    ventureId: string,
    affiliateId: string,
    distribution: ReceivedDistribution
  ): EconomicBenefitRegistryEntry {
    const key = `${ventureId}:${affiliateId}`
    let entry = this.economicBenefitRegistry.entries.get(key)

    if (!entry) {
      entry = {
        id: uid(),
        ventureId,
        affiliateId,
        periodStart: now(),
        periodEnd: now() + 30 * 24 * 60 * 60 * 1000,
        distributions: [],
        totalTQReceived: 0,
        totalZNUReceived: 0,
        totalUSDCReceived: 0,
        totalDemurragePaid: 0,
        netPositionTQ: 0,
        netPositionZNU: 0,
        netPositionUSDC: 0,
        lastUpdated: now(),
      }
      this.economicBenefitRegistry.entries.set(key, entry)
      this.indexEntry(this.economicBenefitRegistry, entry)
    }

    entry.distributions.push(distribution)
    entry.totalTQReceived += distribution.amountTQ
    entry.totalZNUReceived += distribution.amountZNU
    entry.totalUSDCReceived += distribution.amountUSDC
    entry.totalDemurragePaid += distribution.demurrageApplied
    entry.netPositionTQ = entry.totalTQReceived - entry.totalDemurragePaid
    entry.netPositionZNU = entry.totalZNUReceived - entry.totalDemurragePaid
    entry.netPositionUSDC = entry.totalUSDCReceived - entry.totalDemurragePaid
    entry.lastUpdated = now()

    return entry
  }

  getEconomicBenefitEntry(ventureId: string, affiliateId: string): EconomicBenefitRegistryEntry | undefined {
    return this.economicBenefitRegistry.entries.get(`${ventureId}:${affiliateId}`)
  }

  // ============================================
  // INDEXING HELPER
  // ============================================

  private indexEntry<T extends { id: string; ventureId: string; affiliateId: string }>(
    registry: { entries: Map<string, T>; ventureIndex: Map<string, Set<string>>; affiliateIndex: Map<string, Set<string>> },
    entry: T
  ): void {
    const ventureIds = registry.ventureIndex.get(entry.ventureId) || new Set()
    ventureIds.add(entry.id)
    registry.ventureIndex.set(entry.ventureId, ventureIds)

    const affiliateIds = registry.affiliateIndex.get(entry.affiliateId) || new Set()
    affiliateIds.add(entry.id)
    registry.affiliateIndex.set(entry.affiliateId, affiliateIds)
  }

  // ============================================
  // COMPOSITE SCORES FOR REDISTRIBUTION
  // ============================================

  getCompositeScores(ventureId: string, affiliateId: string): CompositeScores {
    const contrib = this.getVentureContributions(ventureId).find(e => e.affiliateId === affiliateId)
    const resp = this.getResponsibilityEntry(ventureId, affiliateId)
    const usage = this.getResourceUsageEntry(ventureId, affiliateId)
    const econ = this.getEconomicBenefitEntry(ventureId, affiliateId)

    return {
      R1_Contribution: contrib ? this.scoreContribution(contrib) : 0,
      R2_Responsibility: resp ? resp.responsibilityScore : 0,
      R3_ResourceUsage: usage ? usage.usageScore : 0,
      R4_EconomicBenefit: econ ? this.scoreEconomicBenefit(econ) : 0,
      // Raw data for transparency
      raw: {
        contribution: contrib,
        responsibility: resp,
        resourceUsage: usage,
        economicBenefit: econ,
      },
    }
  }

  private scoreContribution(entry: ContributionRegistryEntry): number {
    const totalFlows = Array.from(entry.flows.values()).reduce((a, b) => a + b, 0)
    return Math.min((totalFlows * 0.5 + entry.hours * 0.1 + entry.qualityScore * 0.4) / 100, 1)
  }

  private scoreEconomicBenefit(entry: EconomicBenefitRegistryEntry): number {
    // Normalize by venture total (would need venture context)
    return Math.min(entry.netPositionTQ / 1000, 1)
  }

  // ============================================
  // FR FEEDBACK LOOP (D3: Continuous Redistribution + FR Loop)
  // ============================================

  /**
   * Feedback Loop: secesión simulation → liquidation → migration
   * Monitors if any affiliate/venture would exit (FR = Free Rider / Fork Risk)
   */
  runFRFeedbackLoop(ventureId: string): FRFeedbackResult {
    const contributions = this.getVentureContributions(ventureId)
    const alerts: FRAlert[] = []

    for (const entry of contributions) {
      // Check for declining participation
      const daysSinceLastContribution = (now() - entry.lastContribution) / (1000 * 60 * 60 * 24)
      if (daysSinceLastContribution > 60) {
        alerts.push({
          type: 'declining_participation',
          affiliateId: entry.affiliateId,
          severity: daysSinceLastContribution > 120 ? 'critical' : 'warning',
          message: `No contributions for ${Math.round(daysSinceLastContribution)} days`,
          recommendation: 'Engage affiliate or prepare for exit',
        })
      }

      // Check for quality degradation
      if (entry.qualityScore < 0.3 && entry.validationCount > 5) {
        alerts.push({
          type: 'quality_degradation',
          affiliateId: entry.affiliateId,
          severity: 'warning',
          message: `Quality score ${entry.qualityScore.toFixed(2)} below threshold`,
          recommendation: 'Mentoring or role adjustment',
        })
      }
    }

    // Check responsibility gaps
    for (const [key, entry] of this.responsibilityRegistry.entries) {
      if (!key.startsWith(`${ventureId}:`)) continue
      if (entry.responsibilityScore < 0.2 && entry.custodialRoles.length > 0) {
        alerts.push({
          type: 'custodial_neglect',
          affiliateId: entry.affiliateId,
          severity: 'critical',
          message: `Custodian with low responsibility score (${entry.responsibilityScore.toFixed(2)})`,
          recommendation: 'Recall process or reassignment',
        })
      }
    }

    return {
      ventureId,
      timestamp: now(),
      alerts,
      overallRisk: alerts.some(a => a.severity === 'critical') ? 'high' : alerts.length > 0 ? 'medium' : 'low',
      recommendedActions: this.generateRecommendedActions(alerts),
    }
  }

  private generateRecommendedActions(alerts: FRAlert[]): string[] {
    const actions = new Set<string>()
    for (const alert of alerts) {
      switch (alert.type) {
        case 'declining_participation':
          actions.add('Schedule check-in with affiliate')
          actions.add('Review affiliation status')
          break
        case 'quality_degradation':
          actions.add('Assign mentor')
          actions.add('Adjust role expectations')
          break
        case 'custodial_neglect':
          actions.add('Initiate custodian recall process')
          actions.add('Reassign custodial duties')
          break
      }
    }
    return Array.from(actions)
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      contributionRegistry: {
        entries: Array.from(this.contributionRegistry.entries.entries()),
        ventureIndex: Array.from(this.contributionRegistry.ventureIndex.entries()),
        affiliateIndex: Array.from(this.contributionRegistry.affiliateIndex.entries()),
      },
      responsibilityRegistry: {
        entries: Array.from(this.responsibilityRegistry.entries.entries()),
        ventureIndex: Array.from(this.responsibilityRegistry.ventureIndex.entries()),
        affiliateIndex: Array.from(this.responsibilityRegistry.affiliateIndex.entries()),
      },
      resourceUsageRegistry: {
        entries: Array.from(this.resourceUsageRegistry.entries.entries()),
        ventureIndex: Array.from(this.resourceUsageRegistry.ventureIndex.entries()),
        affiliateIndex: Array.from(this.resourceUsageRegistry.affiliateIndex.entries()),
      },
      economicBenefitRegistry: {
        entries: Array.from(this.economicBenefitRegistry.entries.entries()),
        ventureIndex: Array.from(this.economicBenefitRegistry.ventureIndex.entries()),
        affiliateIndex: Array.from(this.economicBenefitRegistry.affiliateIndex.entries()),
      },
    }, null, 2)
  }

  static fromJSON(json: string): FourRegistriesEngine {
    const data = JSON.parse(json)
    const engine = new FourRegistriesEngine()
    engine.contributionRegistry = {
      entries: new Map(data.contributionRegistry.entries),
      ventureIndex: new Map(data.contributionRegistry.ventureIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
      affiliateIndex: new Map(data.contributionRegistry.affiliateIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
    }
    engine.responsibilityRegistry = {
      entries: new Map(data.responsibilityRegistry.entries),
      ventureIndex: new Map(data.responsibilityRegistry.ventureIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
      affiliateIndex: new Map(data.responsibilityRegistry.affiliateIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
    }
    engine.resourceUsageRegistry = {
      entries: new Map(data.resourceUsageRegistry.entries),
      ventureIndex: new Map(data.resourceUsageRegistry.ventureIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
      affiliateIndex: new Map(data.resourceUsageRegistry.affiliateIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
    }
    engine.economicBenefitRegistry = {
      entries: new Map(data.economicBenefitRegistry.entries),
      ventureIndex: new Map(data.economicBenefitRegistry.ventureIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
      affiliateIndex: new Map(data.economicBenefitRegistry.affiliateIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)])),
    }
    return engine
  }
}

// ============================================
// SUPPORTING TYPES
// ============================================

export interface CompositeScores {
  R1_Contribution: number
  R2_Responsibility: number
  R3_ResourceUsage: number
  R4_EconomicBenefit: number
  raw: {
    contribution: ContributionRegistryEntry | undefined
    responsibility: ResponsibilityRegistryEntry | undefined
    resourceUsage: ResourceUsageRegistryEntry | undefined
    economicBenefit: EconomicBenefitRegistryEntry | undefined
  }
}

export interface FRAlert {
  type: 'declining_participation' | 'quality_degradation' | 'custodial_neglect' | 'resource_hoarding' | 'governance_capture'
  affiliateId: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  recommendation: string
}

export interface FRFeedbackResult {
  ventureId: string
  timestamp: number
  alerts: FRAlert[]
  overallRisk: 'low' | 'medium' | 'high'
  recommendedActions: string[]
}

// ============================================
// BENEFIT REDISTRIBUTION ORCHESTRATOR (Integrates ValueEquation + 4 Registries)
// ============================================

export class BenefitRedistributionOrchestrator {
  private fourRegistries: FourRegistriesEngine
  private valueEquationEngine: any // ValueEquationEngine
  private currentSeeSystem: any // CurrentSeeSystemEngine

  constructor(fourRegistries: FourRegistriesEngine) {
    this.fourRegistries = fourRegistries
  }

  setValueEquationEngine(engine: any): void {
    this.valueEquationEngine = engine
  }

  setCurrentSeeSystem(engine: any): void {
    this.currentSeeSystem = engine
  }

  /**
   * Ejecuta redistribución continua para una venture
   * Integra: ValueEquation + 4 Registros + Current-See System
   */
  async executeContinuousRedistribution(
    ventureId: string,
    periodStart: number,
    periodEnd: number,
    equationId: string = 'gea-benefit-redist-v1'
  ): Promise<BenefitRedistributionRecord> {
    // 1. Get composite scores from 4 registries
    const venture = this.getVenture(ventureId)
    if (!venture) throw new Error(`Venture not found: ${ventureId}`)

    const affiliates = this.getVentureAffiliates(ventureId)
    const compositeScores = new Map<string, CompositeScores>()

    for (const affiliateId of venture.contributors) {
      compositeScores.set(affiliateId, this.fourRegistries.getCompositeScores(ventureId, affiliateId))
    }

    // 2. Calculate weights using 4-registry formula (D4)
    const weights = this.calculate4RegistryWeights(compositeScores)

    // 3. Normalize
    const totalWeight = Array.from(weights.values()).reduce((a, b) => a + b, 0)
    const distribution = new Map<string, number>()
    for (const [affiliateId, weight] of weights) {
      distribution.set(affiliateId, totalWeight > 0 ? weight / totalWeight : 0)
    }

    // 4. Get venture revenue (would come from venture revenue streams)
    const totalRevenue = this.getVentureRevenue(ventureId)

    // 5. Calculate distributions
    const distributions: BenefitDistribution[] = []
    for (const [affiliateId, share] of distribution) {
      const affiliate = this.getAffiliate(affiliateId)
      if (!affiliate) continue

      const amountTQ = totalRevenue.TQ * share
      const amountZNU = totalRevenue.ZNU * share
      const amountUSDC = totalRevenue.USDC * share

      // Demurrage anti-acumulación (Ley II MJ)
      let demurrageApplied = 0
      if (affiliate.znuBalance > 300) {
        demurrageApplied = (affiliate.znuBalance - 300) * 0.05
      }

      const scores = compositeScores.get(affiliateId)!
      distributions.push({
        affiliateId,
        amountTQ: +(amountTQ - demurrageApplied).toFixed(2),
        amountZNU: +(amountZNU - demurrageApplied).toFixed(2),
        amountUSDC: +(amountUSDC - demurrageApplied).toFixed(2),
        basis: `R1:${scores.R1_Contribution.toFixed(2)} R2:${scores.R2_Responsibility.toFixed(2)} R3:${scores.R3_ResourceUsage.toFixed(2)} R4:${scores.R4_EconomicBenefit.toFixed(2)}`,
        tier: affiliate.coreGroupMember ? 'core' : 'contributor',
      })

      // 6. Record in Economic Benefit Registry (Registry 4)
      this.fourRegistries.recordDistribution(ventureId, affiliateId, {
        redistributionId: '', // will be set after
        date: now(),
        amountTQ,
        amountZNU,
        amountUSDC,
        basis: `R1:${scores.R1_Contribution.toFixed(2)} R2:${scores.R2_Responsibility.toFixed(2)} R3:${scores.R3_ResourceUsage.toFixed(2)} R4:${scores.R4_EconomicBenefit.toFixed(2)}`,
        demurrageApplied,
      })
    }

    // 7. Run FR Feedback Loop (D3)
    const frResult = this.fourRegistries.runFRFeedbackLoop(ventureId)

    // 8. Create record
    const record: BenefitRedistributionRecord = {
      id: uid(),
      ventureId,
      periodStart,
      periodEnd,
      executedAt: now(),
      totalRevenueTQ: totalRevenue.TQ,
      totalRevenueZNU: totalRevenue.ZNU,
      totalRevenueUSDC: totalRevenue.USDC,
      distributions,
      algorithmVersion: '4-registry-v1',
      governanceEquationId: equationId,
    }

    return record
  }

  private calculate4RegistryWeights(scores: Map<string, CompositeScores>): Map<string, number> {
    const weights = new Map<string, number>()
    for (const [affiliateId, score] of scores) {
      // D4 weights: R1=40%, R2=20%, R3=20%, R4=20%
      const weight = score.R1_Contribution * 0.4 +
                     score.R2_Responsibility * 0.2 +
                     score.R3_ResourceUsage * 0.2 +
                     score.R4_EconomicBenefit * 0.2
      weights.set(affiliateId, weight)
    }
    return weights
  }

  // Placeholder methods (would integrate with actual engines)
  private getVenture(ventureId: string): NRPVenture | null { return null }
  private getVentureAffiliates(ventureId: string): string[] { return [] }
  private getAffiliate(affiliateId: string): NRPAffiliate | null { return null }
  private getVentureRevenue(ventureId: string): { TQ: number; ZNU: number; USDC: number } {
    return { TQ: 1000, ZNU: 500, USDC: 10 } // placeholder
  }
}

// ============================================
// TYPES (re-export from nrpCasCore)
import type { NRPAffiliate, NRPVenture, BenefitRedistributionRecord, BenefitDistribution } from '@core/lib/nrpCasCore'

// ============================================
// EXPORTS
// ============================================

export const fourRegistriesEngine = new FourRegistriesEngine()
export const benefitRedistributionOrchestrator = new BenefitRedistributionOrchestrator(fourRegistriesEngine)