// HSCSG v15 OS — Property Regime System (OVNi 3.0: 4 regímenes de propiedad)
// Private, Shared/Communal, Commons, Non-Dominium (default para red OVN)
// Capa 3: Operación Productiva — integra con NRP-CAS + Custodian Pattern

import type { NRPResource } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// PROPERTY REGIME TYPES
// ============================================

export type PropertyRegime = 'private' | 'shared' | 'commons' | 'nondominium'

export interface PropertyRegimeDefinition {
  regime: PropertyRegime
  name: string
  description: string
  // Bundle of rights (OVNi: ownership = bundle of rights with few duties)
  rights: PropertyRight[]
  duties: PropertyDuty[]
  // Governance
  governanceModel: 'owner' | 'custodian' | 'community' | 'federation'
  transferable: boolean
  inheritable: boolean
  // Economic
  canGenerateRevenue: boolean
  revenueDistribution: 'owner' | 'custodian' | 'community' | 'federation' | 'redistribution_algorithm'
  // OVNi specific
  nondominiumPrinciples?: NondominiumPrinciple[]
}

export type PropertyRight =
  | 'use'           // right to use the resource
  | 'control'       // right to make decisions about resource
  | 'transfer'      // right to transfer ownership/access
  | 'exclude'       // right to exclude others
  | 'benefit'       // right to economic benefits
  | 'modify'        // right to modify/transform
  | 'destroy'       // right to destroy (rare, usually restricted)

export type PropertyDuty =
  | 'maintain'      // duty to maintain resource
  | 'regenerate'    // duty to regenerate (ecological)
  | 'share_access'  // duty to provide access under conditions
  | 'report'        // duty to report status/usage
  | 'insure'        // duty to insure against loss
  | 'audit'         // duty to submit to audit

export type NondominiumPrinciple =
  | 'no_one_owns'           // nobody owns it
  | 'anyone_access'         // anyone has access respecting rules
  | 'rules_based'           // governed by agreed rules
  | 'custodial_stewardship' // custodians steward, don't own
  | 'regenerative'          // must regenerate base material
  | 'equitable_access'      // access based on need/contribution, not capital
  | 'forkable'              // can be forked/remixed by community

export interface PropertyRegimeAssignment {
  resourceId: string
  regime: PropertyRegime
  assignedAt: number
  assignedBy: string
  // Regime-specific config
  config: PrivateConfig | SharedConfig | CommonsConfig | NonDominiumConfig
  // Custodians (for shared, commons, nondominium)
  custodians: CustodianAssignment[]
  // History
  history: RegimeChange[]
}

export interface RegimeChange {
  fromRegime: PropertyRegime
  toRegime: PropertyRegime
  changedAt: number
  changedBy: string
  reason: string
  consensusAchieved: boolean
}

export interface CustodianAssignment {
  affiliateId: string
  role: 'primary' | 'secondary' | 'auditor' | 'regenerator'
  responsibilities: CustodianResponsibility[]
  assignedAt: number
  expiresAt?: number
  recallable: boolean
  // Fiduciary duties (D7)
  fiduciaryDuties: FiduciaryDuty[]
}

export type CustodianResponsibility =
  | 'maintenance'
  | 'access_management'
  | 'valuation'
  | 'regeneration'
  | 'distribution'
  | 'audit'
  | 'dispute_resolution'

export type FiduciaryDuty =
  | 'loyalty'           // act in best interest of resource/community
  | 'care'              // exercise due diligence
  | 'transparency'      // full disclosure of actions
  | 'accountability'    // answerable to community
  | 'no_self_dealing'   // no personal benefit from custodial position
  | 'regeneration_first' // prioritize ecological regeneration

// ============================================
// REGIME-SPECIFIC CONFIGURATIONS
// ============================================

export interface PrivateConfig {
  ownerId: string
  coOwners?: string[]
  condominiumRules?: CondominiumRule[]
  // Private property can be: donated, invested, lent, sold at discount
  contributionMode: 'donation' | 'investment' | 'loan' | 'discounted_sale'
}

export interface CondominiumRule {
  resourceShare: number // percentage
  decisionThreshold: number // percentage for decisions
  expenseSharing: 'proportional' | 'equal' | 'usage_based'
}

export interface SharedConfig {
  // Shared/communal property: pool of shareables
  poolId: string
  members: string[] // affiliate IDs with access
  accessRules: SharedAccessRule[]
  governance: 'consensus' | 'majority' | 'custodian_led'
  maintenanceFund: MaintenanceFund
}

export interface SharedAccessRule {
  id: string
  condition: 'open_to_members' | 'credential_required' | 'time_based' | 'purpose_based'
  parameters: Record<string, any>
  priority: number
}

export interface MaintenanceFund {
  balance: number
  currency: string
  contributionRule: 'per_use' | 'per_member' | 'percentage_revenue'
  contributionAmount: number
}

export interface CommonsConfig {
  // Commons: available to anyone (open access)
  scope: 'network' | 'federation' | 'global'
  accessRules: CommonsAccessRule[]
  governance: 'ostrom' | 'community' | 'federation'
  regenerationPlan: RegenerationPlan
  // Anti-rival: gains value through sharing (D50)
  antiRival: boolean
}

export interface CommonsAccessRule {
  id: string
  condition: 'open' | 'respect_rules' | 'contribute_back' | 'no_commercial_enclosure'
  parameters: Record<string, any>
}

export interface RegenerationPlan {
  ecologicalIndicators: EcologicalIndicator[]
  regenerationActions: RegenerationAction[]
  monitoringFrequency: number // days
  responsibleCustodians: string[]
}

export interface EcologicalIndicator {
  indicator: 'soil_health' | 'water_quality' | 'biodiversity' | 'carbon_sequestration' | 'circularity'
  target: number
  current: number
  unit: string
}

export interface RegenerationAction {
  id: string
  action: string
  frequency: number // days
  responsible: string
  resourcesNeeded: string[]
}

export interface NonDominiumConfig {
  // Non-Dominium: OVN default (network + ventures)
  // "No one owns it but anyone has access respecting rules"
  networkId: string
  governingBody: 'network_core_group' | 'federation_council' | 'custodian_council'
  rules: NonDominiumRule[]
  // Forking allowed (horizontal proliferation) but with convergence mechanisms (D48)
  forkable: boolean
  convergenceMechanisms: ConvergenceMechanism[]
  // Immutable principles
  immutablePrinciples: NondominiumPrinciple[]
}

export interface NonDominiumRule {
  id: string
  ruleType: 'access' | 'usage' | 'contribution' | 'governance' | 'regeneration'
  description: string
  enforcement: 'embedded' | 'social' | 'smart_contract' | 'custodian'
  parameters: Record<string, any>
}

export interface ConvergenceMechanism {
  id: string
  type: 'feedback_maps' | 'incentive_bias' | 'purpose_communication' | 'community_aspect'
  description: string
  implementation: string // reference to module
  active: boolean
}

// ============================================
// PROPERTY REGIME DEFINITIONS (OVNi 3.0 Standard)
// ============================================

export const PROPERTY_REGIMES: Record<PropertyRegime, PropertyRegimeDefinition> = {
  private: {
    regime: 'private',
    name: 'Private Property',
    description: 'Traditional private ownership with full bundle of rights. Can be contributed as donation, investment, loan, or discounted sale.',
    rights: ['use', 'control', 'transfer', 'exclude', 'benefit', 'modify', 'destroy'],
    duties: ['maintain'],
    governanceModel: 'owner',
    transferable: true,
    inheritable: true,
    canGenerateRevenue: true,
    revenueDistribution: 'owner',
  },
  shared: {
    regime: 'shared',
    name: 'Shared/Communal Property',
    description: 'Pool of shareables held in trust by custodians. Members have access per rules. Maintenance funded collectively.',
    rights: ['use', 'benefit', 'modify'], // no transfer, exclude, destroy
    duties: ['maintain', 'share_access', 'report'],
    governanceModel: 'custodian',
    transferable: false,
    inheritable: false,
    canGenerateRevenue: true,
    revenueDistribution: 'community',
  },
  commons: {
    regime: 'commons',
    name: 'Commons',
    description: 'Open access resources governed by Ostrom principles. Anti-rival: gains value through sharing. Regeneration mandatory.',
    rights: ['use', 'benefit', 'modify'], // no control, transfer, exclude, destroy
    duties: ['maintain', 'regenerate', 'share_access', 'report'],
    governanceModel: 'community',
    transferable: false,
    inheritable: false,
    canGenerateRevenue: true,
    revenueDistribution: 'redistribution_algorithm',
    nondominiumPrinciples: ['anti_rival', 'regenerative', 'equitable_access'],
  },
  nondominium: {
    regime: 'nondominium',
    name: 'Non-Dominium',
    description: 'OVN default regime. No one owns it but anyone has access respecting rules. Custodial stewardship. Forkable with convergence.',
    rights: ['use', 'benefit', 'modify', 'fork'],
    duties: ['maintain', 'regenerate', 'share_access', 'report', 'audit'],
    governanceModel: 'federation',
    transferable: false,
    inheritable: false,
    canGenerateRevenue: true,
    revenueDistribution: 'redistribution_algorithm',
    nondominiumPrinciples: ['no_one_owns', 'anyone_access', 'rules_based', 'custodial_stewardship', 'regenerative', 'equitable_access', 'forkable'],
  },
}

// ============================================
// PROPERTY REGIME ENGINE
// ============================================

export class PropertyRegimeEngine {
  private assignments: Map<string, PropertyRegimeAssignment> = new Map()
  private regimeDefinitions: Map<PropertyRegime, PropertyRegimeDefinition> = new Map()

  constructor() {
    for (const [regime, def] of Object.entries(PROPERTY_REGIMES)) {
      this.regimeDefinitions.set(regime as PropertyRegime, def)
    }
  }

  // ============================================
  // ASSIGNMENT MANAGEMENT
  // ============================================

  assignRegime(
    resourceId: string,
    regime: PropertyRegime,
    actorId: string,
    config: PropertyRegimeAssignment['config'],
    custodians: CustodianAssignment[] = []
  ): PropertyRegimeAssignment {
    const existing = this.assignments.get(resourceId)
    const fromRegime = existing?.regime

    const assignment: PropertyRegimeAssignment = {
      resourceId,
      regime,
      assignedAt: now(),
      assignedBy: actorId,
      config,
      custodians,
      history: existing ? [{
        fromRegime: fromRegime!,
        toRegime: regime,
        changedAt: now(),
        changedBy: actorId,
        reason: `Regime changed from ${fromRegime} to ${regime}`,
        consensusAchieved: true, // would check governance
      }] : [],
    }

    this.assignments.set(resourceId, assignment)
    return assignment
  }

  getAssignment(resourceId: string): PropertyRegimeAssignment | undefined {
    return this.assignments.get(resourceId)
  }

  getResourcesByRegime(regime: PropertyRegime): PropertyRegimeAssignment[] {
    return Array.from(this.assignments.values()).filter(a => a.regime === regime)
  }

  // ============================================
  // CUSTODIAN MANAGEMENT (D7: Fiduciary/Temporal/Auditable/Recall)
  // ============================================

  assignCustodian(
    resourceId: string,
    affiliateId: string,
    role: CustodianAssignment['role'],
    responsibilities: CustodianResponsibility[],
    actorId: string,
    expiresAt?: number
  ): boolean {
    const assignment = this.assignments.get(resourceId)
    if (!assignment) return false

    // Check if already custodian
    if (assignment.custodians.some(c => c.affiliateId === affiliateId)) return false

    // Validate fiduciary duties acceptance
    const fiduciaryDuties: FiduciaryDuty[] = [
      'loyalty', 'care', 'transparency', 'accountability', 'no_self_dealing', 'regeneration_first'
    ]

    const custodian: CustodianAssignment = {
      affiliateId,
      role,
      responsibilities,
      assignedAt: now(),
      expiresAt,
      recallable: true, // D7: recall comunitario
      fiduciaryDuties,
    }

    assignment.custodians.push(custodian)
    return true
  }

  recallCustodian(resourceId: string, affiliateId: string, actorId: string, reason: string): boolean {
    const assignment = this.assignments.get(resourceId)
    if (!assignment) return false

    const index = assignment.custodians.findIndex(c => c.affiliateId === affiliateId && c.recallable)
    if (index === -1) return false

    const recalled = assignment.custodians.splice(index, 1)[0]
    assignment.history.push({
      fromRegime: assignment.regime,
      toRegime: assignment.regime,
      changedAt: now(),
      changedBy: actorId,
      reason: `Custodian ${affiliateId} recalled: ${reason}`,
      consensusAchieved: true, // community recall
    })

    return true
  }

  getCustodians(resourceId: string): CustodianAssignment[] {
    return this.assignments.get(resourceId)?.custodians || []
  }

  // ============================================
  // ACCESS CONTROL BY REGIME
  // ============================================

  canAccess(resourceId: string, affiliateId: string, action: PropertyRight): boolean {
    const assignment = this.assignments.get(resourceId)
    if (!assignment) return false

    const definition = this.regimeDefinitions.get(assignment.regime)
    if (!definition) return false

    // Check if regime grants this right
    if (!definition.rights.includes(action)) return false

    // Check regime-specific access rules
    switch (assignment.regime) {
      case 'private':
        return this.checkPrivateAccess(assignment, affiliateId, action)
      case 'shared':
        return this.checkSharedAccess(assignment, affiliateId, action)
      case 'commons':
        return this.checkCommonsAccess(assignment, affiliateId, action)
      case 'nondominium':
        return this.checkNonDominiumAccess(assignment, affiliateId, action)
    }
  }

  private checkPrivateAccess(assignment: PropertyRegimeAssignment, affiliateId: string, action: PropertyRight): boolean {
    const config = assignment.config as PrivateConfig
    if (config.ownerId === affiliateId) return true
    if (config.coOwners?.includes(affiliateId)) return true
    // Check if contributor with access credential
    return false // simplified
  }

  private checkSharedAccess(assignment: PropertyRegimeAssignment, affiliateId: string, action: PropertyRight): boolean {
    const config = assignment.config as SharedConfig
    if (!config.members.includes(affiliateId)) return false

    // Check access rules
    for (const rule of config.accessRules.sort((a, b) => b.priority - a.priority)) {
      if (this.evaluateAccessRule(rule, affiliateId, action)) return true
    }
    return false
  }

  private checkCommonsAccess(assignment: PropertyRegimeAssignment, affiliateId: string, action: PropertyRight): boolean {
    const config = assignment.config as CommonsConfig
    // Commons: open access respecting rules
    for (const rule of config.accessRules) {
      if (!this.evaluateAccessRule(rule, affiliateId, action)) return false
    }
    return true
  }

  private checkNonDominiumAccess(assignment: PropertyRegimeAssignment, affiliateId: string, action: PropertyRight): boolean {
    const config = assignment.config as NonDominiumConfig
    // Non-Dominium: access based on rules, contribution, need
    for (const rule of config.rules) {
      if (rule.ruleType === 'access' && !this.evaluateNonDominiumRule(rule, affiliateId, action)) {
        return false
      }
    }
    return true
  }

  private evaluateAccessRule(rule: SharedAccessRule, affiliateId: string, action: PropertyRight): boolean {
    switch (rule.condition) {
      case 'open_to_members':
        return true
      case 'credential_required':
        return rule.parameters.requiredCredentials?.includes(affiliateId) || false
      case 'time_based':
        const hour = new Date().getHours()
        return hour >= rule.parameters.startHour && hour <= rule.parameters.endHour
      case 'purpose_based':
        return rule.parameters.allowedPurposes?.includes(action) || false
      default:
        return false
    }
  }

  private evaluateNonDominiumRule(rule: NonDominiumRule, affiliateId: string, action: PropertyRight): boolean {
    // Simplified: would evaluate actual rule logic
    return true
  }

  // ============================================
  // FORK/REMIX SUPPORT (D68: Native UI capability)
  // ============================================

  /**
   * Fork un recurso (crea versión derivada)
   * Non-Dominium y Commons permiten forking nativo
   */
  forkResource(resourceId: string, forkedBy: string, modifications: Partial<NRPResource>): PropertyRegimeAssignment | null {
    const assignment = this.assignments.get(resourceId)
    if (!assignment) return null

    const definition = this.regimeDefinitions.get(assignment.regime)
    if (!definition?.nondominiumPrinciples?.includes('forkable') && assignment.regime !== 'commons') {
      return null // regime doesn't allow forking
    }

    // New resource gets same regime (inherits)
    const newResourceId = uid()
    return this.assignRegime(newResourceId, assignment.regime, forkedBy, assignment.config, assignment.custodians)
  }

  // ============================================
  // REGENERATION TRACKING (Ley I MJ)
  // ============================================

  updateRegenerationStatus(resourceId: string, indicators: EcologicalIndicator[]): boolean {
    const assignment = this.assignments.get(resourceId)
    if (!assignment || assignment.regime !== 'commons' && assignment.regime !== 'nondominium') return false

    const config = assignment.config as CommonsConfig | NonDominiumConfig
    if ('regenerationPlan' in config) {
      config.regenerationPlan.ecologicalIndicators = indicators
      return true
    }
    return false
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      assignments: Array.from(this.assignments.entries()),
    }, null, 2)
  }

  static fromJSON(json: string): PropertyRegimeEngine {
    const data = JSON.parse(json)
    const engine = new PropertyRegimeEngine()
    engine.assignments = new Map(data.assignments)
    return engine
  }
}

export const propertyRegimeEngine = new PropertyRegimeEngine()