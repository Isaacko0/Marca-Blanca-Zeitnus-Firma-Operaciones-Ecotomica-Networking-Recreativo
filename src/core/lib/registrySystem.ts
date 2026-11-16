// HSCSG v15 OS — Registry System (OVNi 3.0: Affiliates, Events, Ventures, Resources)
// Registros dinámicos, basados en consenso, historia inmutable, estado actual del sistema
// Capa 3: Operación Productiva

import type { NRPAffiliate, NRPEvent, NRPVenture, NRPResource } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// REGISTRY CORE TYPES
// ============================================

export type RegistryType = 'affiliates' | 'events' | 'ventures' | 'resources'

export interface RegistryEntry<T> {
  id: string
  data: T
  version: number
  createdAt: number
  updatedAt: number
  createdBy: string
  updatedBy: string
  // Consensus metadata
  consensusStatus: 'proposed' | 'validated' | 'rejected' | 'contested'
  consensusVotes: ConsensusVote[]
  consensusThreshold: number
  // History
  history: RegistryHistoryEntry[]
}

export interface ConsensusVote {
  voterId: string
  vote: 'approve' | 'reject' | 'abstain'
  timestamp: number
  stake?: number // proof-of-stake weight
  reason?: string
}

export interface RegistryHistoryEntry {
  version: number
  action: 'created' | 'updated' | 'status_changed' | 'consensus_achieved' | 'consensus_failed' | 'forked'
  actorId: string
  timestamp: number
  changes: Record<string, { from: any; to: any }>
  consensusVotes?: ConsensusVote[]
}

export interface InclusionRule {
  registryType: RegistryType
  ruleId: string
  name: string
  description: string
  // Predicate function (serialized or reference)
  predicate: string // TypeScript expression evaluating to boolean
  parameters: InclusionRuleParameter[]
  enforcement: 'automatic' | 'manual' | 'governance_equation'
  createdAt: number
  updatedAt: number
}

export interface InclusionRuleParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  description: string
  required: boolean
  defaultValue?: any
}

export interface ExclusionRule {
  registryType: RegistryType
  ruleId: string
  name: string
  description: string
  predicate: string
  parameters: InclusionRuleParameter[]
  enforcement: 'automatic' | 'manual' | 'governance_equation'
  gracePeriodDays: number // time before exclusion takes effect
  appealable: boolean
  createdAt: number
  updatedAt: number
}

// ============================================
// REGISTRY ENGINE (Generic)
// ============================================

export class RegistryEngine<T> {
  private entries: Map<string, RegistryEntry<T>> = new Map()
  private inclusionRules: InclusionRule[] = []
  private exclusionRules: ExclusionRule[] = []
  private consensusThreshold: number = 0.67 // 2/3 majority
  private registryType: RegistryType
  private onConsensusAchieved?: (entry: RegistryEntry<T>) => void
  private onConsensusFailed?: (entry: RegistryEntry<T>) => void

  constructor(registryType: RegistryType) {
    this.registryType = registryType
    this.initializeDefaultRules()
  }

  private initializeDefaultRules(): void {
    // Default inclusion rules per registry type
    switch (this.registryType) {
      case 'affiliates':
        this.inclusionRules.push({
          registryType: 'affiliates',
          ruleId: 'affiliate_min_contribution',
          name: 'Minimum Contribution Threshold',
          description: 'Affiliate must have minimum contributed flows to be included',
          predicate: 'entry.data.contributedFlows >= params.minFlows',
          parameters: [{ name: 'minFlows', type: 'number', description: 'Minimum flows', required: true, defaultValue: 1 }],
          enforcement: 'automatic',
          createdAt: now(),
          updatedAt: now(),
        })
        break

      case 'ventures':
        this.inclusionRules.push({
          registryType: 'ventures',
          ruleId: 'venture_core_group',
          name: 'Core Group Requirement',
          description: 'Venture must have core group (filtered by Access to Benefits Algorithm)',
          predicate: 'entry.data.coreGroup.length >= params.minCoreSize',
          parameters: [{ name: 'minCoreSize', type: 'number', description: 'Minimum core group size', required: true, defaultValue: 3 }],
          enforcement: 'governance_equation',
          createdAt: now(),
          updatedAt: now(),
        })
        break

      case 'resources':
        this.inclusionRules.push({
          registryType: 'resources',
          ruleId: 'resource_property_regime',
          name: 'Valid Property Regime',
          description: 'Resource must have valid property regime',
          predicate: '["private","shared","commons","nondominium"].includes(entry.data.propertyRegime)',
          parameters: [],
          enforcement: 'automatic',
          createdAt: now(),
          updatedAt: now(),
        })
        break
    }
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  proposeEntry(data: T, actorId: string): RegistryEntry<T> {
    const entry: RegistryEntry<T> = {
      id: uid(),
      data,
      version: 1,
      createdAt: now(),
      updatedAt: now(),
      createdBy: actorId,
      updatedBy: actorId,
      consensusStatus: 'proposed',
      consensusVotes: [],
      consensusThreshold: this.consensusThreshold,
      history: [{
        version: 1,
        action: 'created',
        actorId,
        timestamp: now(),
        changes: {},
      }],
    }

    this.entries.set(entry.id, entry)
    return entry
  }

  getEntry(id: string): RegistryEntry<T> | undefined {
    return this.entries.get(id)
  }

  getAllEntries(): RegistryEntry<T>[] {
    return Array.from(this.entries.values())
  }

  getValidatedEntries(): RegistryEntry<T>[] {
    return Array.from(this.entries.values()).filter(e => e.consensusStatus === 'validated')
  }

  updateEntry(id: string, updates: Partial<T>, actorId: string): RegistryEntry<T> | null {
    const entry = this.entries.get(id)
    if (!entry) return null

    const oldData = { ...entry.data }
    entry.data = { ...entry.data, ...updates }
    entry.version++
    entry.updatedAt = now()
    entry.updatedBy = actorId

    // Record changes
    const changes: Record<string, { from: any; to: any }> = {}
    for (const key of Object.keys(updates)) {
      changes[key] = { from: oldData[key], to: entry.data[key] }
    }

    entry.history.push({
      version: entry.version,
      action: 'updated',
      actorId,
      timestamp: now(),
      changes,
    })

    // Re-validate inclusion rules
    this.validateInclusion(entry)

    return entry
  }

  // ============================================
  // CONSENSUS MECHANISM
  // ============================================

  vote(entryId: string, voterId: string, vote: 'approve' | 'reject' | 'abstain', stake?: number, reason?: string): boolean {
    const entry = this.entries.get(entryId)
    if (!entry || entry.consensusStatus !== 'proposed') return false

    // Check if already voted
    if (entry.consensusVotes.some(v => v.voterId === voterId)) return false

    entry.consensusVotes.push({ voterId, vote, timestamp: now(), stake, reason })
    this.checkConsensus(entry)
    return true
  }

  private checkConsensus(entry: RegistryEntry<T>): void {
    const totalVotes = entry.consensusVotes.length
    if (totalVotes === 0) return

    // Weighted by stake if available
    let totalWeight = 0
    let approveWeight = 0

    for (const vote of entry.consensusVotes) {
      const weight = vote.stake || 1
      totalWeight += weight
      if (vote.vote === 'approve') approveWeight += weight
    }

    const approvalRatio = approveWeight / totalWeight

    if (approvalRatio >= entry.consensusThreshold) {
      entry.consensusStatus = 'validated'
      entry.history.push({
        version: entry.version,
        action: 'consensus_achieved',
        actorId: 'consensus',
        timestamp: now(),
        changes: { consensusStatus: { from: 'proposed', to: 'validated' } },
        consensusVotes: [...entry.consensusVotes],
      })
      this.onConsensusAchieved?.(entry)
    } else if (totalVotes >= 3) { // minimum votes to fail
      // Could fail early if mathematically impossible to reach threshold
      const remainingPossible = 1 // simplified
      if ((approveWeight + remainingPossible) / (totalWeight + 1) < entry.consensusThreshold) {
        entry.consensusStatus = 'rejected'
        entry.history.push({
          version: entry.version,
          action: 'consensus_failed',
          actorId: 'consensus',
          timestamp: now(),
          changes: { consensusStatus: { from: 'proposed', to: 'rejected' } },
          consensusVotes: [...entry.consensusVotes],
        })
        this.onConsensusFailed?.(entry)
      }
    }
  }

  // ============================================
  // INCLUSION/EXCLUSION RULES
  // ============================================

  private validateInclusion(entry: RegistryEntry<T>): void {
    for (const rule of this.inclusionRules) {
      if (rule.registryType !== this.registryType) continue

      try {
        // In real implementation: evaluate predicate safely
        // For now: simplified check
        const passes = this.evaluatePredicate(rule.predicate, entry.data, rule.parameters)
        if (!passes && rule.enforcement === 'automatic') {
          this.proposeExclusion(entry.id, rule.ruleId)
        }
      } catch (e) {
        console.warn(`Rule evaluation failed: ${rule.ruleId}`, e)
      }
    }

    for (const rule of this.exclusionRules) {
      if (rule.registryType !== this.registryType) continue
      try {
        const shouldExclude = this.evaluatePredicate(rule.predicate, entry.data, rule.parameters)
        if (shouldExclude && rule.enforcement === 'automatic') {
          this.proposeExclusion(entry.id, rule.ruleId)
        }
      } catch (e) {
        console.warn(`Exclusion rule evaluation failed: ${rule.ruleId}`, e)
      }
    }
  }

  private evaluatePredicate(predicate: string, data: T, parameters: InclusionRuleParameter[]): boolean {
    // Simplified: would use a safe expression evaluator in production
    // For now, return true to allow manual governance
    return true
  }

  private proposeExclusion(entryId: string, ruleId: string): void {
    const entry = this.entries.get(entryId)
    if (!entry) return

    entry.consensusStatus = 'contested'
    entry.history.push({
      version: entry.version,
      action: 'updated',
      actorId: 'system',
      timestamp: now(),
      changes: { consensusStatus: { from: entry.consensusStatus, to: 'contested' } },
    })
  }

  addInclusionRule(rule: InclusionRule): void {
    this.inclusionRules.push(rule)
  }

  addExclusionRule(rule: ExclusionRule): void {
    this.exclusionRules.push(rule)
  }

  setConsensusThreshold(threshold: number): void {
    this.consensusThreshold = Math.max(0.51, Math.min(1, threshold))
  }

  setConsensusCallbacks(
    onAchieved: (entry: RegistryEntry<T>) => void,
    onFailed: (entry: RegistryEntry<T>) => void
  ): void {
    this.onConsensusAchieved = onAchieved
    this.onConsensusFailed = onFailed
  }

  // ============================================
  // FORK SUPPORT (OVNi: horizontal proliferation → mitosis)
  // ============================================

  forkEntry(entryId: string, actorId: string, modifications: Partial<T>): RegistryEntry<T> | null {
    const original = this.entries.get(entryId)
    if (!original) return null

    const forkedData = { ...original.data, ...modifications }
    const forkedEntry = this.proposeEntry(forkedData, actorId)

    // Link to original
    ;(forkedEntry.data as any).forkedFrom = entryId
    ;(forkedEntry.data as any).forkedAt = now()

    original.history.push({
      version: original.version,
      action: 'forked',
      actorId,
      timestamp: now(),
      changes: { forkedTo: { from: undefined, to: forkedEntry.id } },
    })

    return forkedEntry
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      entries: Array.from(this.entries.entries()),
      inclusionRules: this.inclusionRules,
      exclusionRules: this.exclusionRules,
      consensusThreshold: this.consensusThreshold,
      registryType: this.registryType,
    }, null, 2)
  }

  static fromJSON<T>(json: string): RegistryEngine<T> {
    const data = JSON.parse(json)
    const engine = new RegistryEngine<T>(data.registryType)
    engine.entries = new Map(data.entries)
    engine.inclusionRules = data.inclusionRules
    engine.exclusionRules = data.exclusionRules
    engine.consensusThreshold = data.consensusThreshold
    return engine
  }
}

// ============================================
// SPECIALIZED REGISTRIES
// ============================================

export const affiliateRegistry = new RegistryEngine<NRPAffiliate>('affiliates')
export const eventRegistry = new RegistryEngine<NRPEvent>('events')
export const ventureRegistry = new RegistryEngine<NRPVenture>('ventures')
export const resourceRegistry = new RegistryEngine<NRPResource>('resources')

// ============================================
// REGISTRY COORDINATOR (Cross-registry operations)
// ============================================

export class RegistryCoordinator {
  private registries: Map<RegistryType, RegistryEngine<any>> = new Map()

  constructor() {
    this.registries.set('affiliates', affiliateRegistry)
    this.registries.set('events', eventRegistry)
    this.registries.set('ventures', ventureRegistry)
    this.registries.set('resources', resourceRegistry)
  }

  getRegistry<T>(type: RegistryType): RegistryEngine<T> {
    return this.registries.get(type) as RegistryEngine<T>
  }

  /**
   * Validación cruzada: venture must have valid affiliates, resources, etc.
   */
  validateCrossReferences(): CrossValidationResult {
    const errors: CrossValidationError[] = []
    const warnings: CrossValidationWarning[] = []

    const affiliates = this.getRegistry('affiliates').getValidatedEntries()
    const ventures = this.getRegistry('ventures').getValidatedEntries()
    const resources = this.getRegistry('resources').getValidatedEntries()
    const events = this.getRegistry('events').getValidatedEntries()

    // Ventures reference valid affiliates
    for (const venture of ventures) {
      for (const affiliateId of venture.data.coreGroup) {
        if (!affiliates.some(a => a.id === affiliateId)) {
          errors.push({
            type: 'invalid_reference',
            sourceRegistry: 'ventures',
            sourceId: venture.id,
            targetRegistry: 'affiliates',
            targetId: affiliateId,
            message: `Venture ${venture.data.name} references non-existent affiliate ${affiliateId}`,
          })
        }
      }
    }

    // Resources reference valid ventures
    for (const resource of resources) {
      for (const ventureId of resource.data.ventureIds) {
        if (!ventures.some(v => v.id === ventureId)) {
          warnings.push({
            type: 'orphan_reference',
            sourceRegistry: 'resources',
            sourceId: resource.id,
            targetRegistry: 'ventures',
            targetId: ventureId,
            message: `Resource ${resource.data.name} references venture ${ventureId} not in registry`,
          })
        }
      }
    }

    // Events reference valid entities
    for (const event of events) {
      if (event.data.ventureId && !ventures.some(v => v.id === event.data.ventureId)) {
        warnings.push({
          type: 'orphan_reference',
          sourceRegistry: 'events',
          sourceId: event.id,
          targetRegistry: 'ventures',
          targetId: event.data.ventureId,
          message: `Event ${event.id} references unknown venture`,
        })
      }
    }

    return { valid: errors.length === 0, errors, warnings }
  }

  /**
   * Snapshot del estado actual del sistema (OVNi: "establish current state")
   */
  getSystemSnapshot(): SystemSnapshot {
    return {
      timestamp: now(),
      affiliates: this.getRegistry('affiliates').getValidatedEntries().length,
      ventures: this.getRegistry('ventures').getValidatedEntries().length,
      resources: this.getRegistry('resources').getValidatedEntries().length,
      events: this.getRegistry('events').getValidatedEntries().length,
      activeAffiliates: this.getRegistry('affiliates').getValidatedEntries().filter(e => (e.data as any).status === 'active').length,
      activeVentures: this.getRegistry('ventures').getValidatedEntries().filter(e => e.data.status === 'active').length,
      crossValidation: this.validateCrossReferences(),
    }
  }
}

export interface CrossValidationResult {
  valid: boolean
  errors: CrossValidationError[]
  warnings: CrossValidationWarning[]
}

export interface CrossValidationError {
  type: 'invalid_reference' | 'missing_required' | 'consensus_failed'
  sourceRegistry: RegistryType
  sourceId: string
  targetRegistry: RegistryType
  targetId: string
  message: string
}

export interface CrossValidationWarning {
  type: 'orphan_reference' | 'stale_data' | 'low_consensus'
  sourceRegistry: RegistryType
  sourceId: string
  targetRegistry: RegistryType
  targetId: string
  message: string
}

export interface SystemSnapshot {
  timestamp: number
  affiliates: number
  ventures: number
  resources: number
  events: number
  activeAffiliates: number
  activeVentures: number
  crossValidation: CrossValidationResult
}

export const registryCoordinator = new RegistryCoordinator()