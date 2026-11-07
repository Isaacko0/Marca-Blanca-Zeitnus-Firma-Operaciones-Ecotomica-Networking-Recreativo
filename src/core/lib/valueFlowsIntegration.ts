// HSCSG v15 OS — ValueFlows Integration (evolved from REA + NRP)
// ValueFlows ontology para interoperabilidad cross-network NRP-CAS
// GitHub: valueflows/valueflows — schemas en vf-schemas/vf-graphql

import type { ValueFlow, VFType, Member } from '@core/state/types'
import { uid } from '@core/lib/utils'

// ============================================
// VALUEFLOWS CORE TYPES (aligned with VF ontology)
// ============================================

export type VFResourceType =
  | 'PhysicalResource'
  | 'DigitalResource'
  | 'HumanResource'
  | 'FinancialResource'
  | 'ServiceResource'
  | 'KnowledgeResource'

export type VFProcessType =
  | 'Production'
  | 'Transformation'
  | 'Transportation'
  | 'Storage'
  | 'Maintenance'
  | 'Research'
  | 'Education'
  | 'Governance'

export type VFEventType =
  | 'ResourceInflow'
  | 'ResourceOutflow'
  | 'ProcessExecution'
  | 'Commitment'
  | 'Intent'
  | 'Agreement'
  | 'Transfer'
  | 'Observation'

export interface VFResource {
  id: string
  name: string
  resourceType: VFResourceType
  unit: string
  quantity: number
  location?: string
  tags: string[]
  createdAt: number
  updatedAt: number
  // Property regime (OVNi): private, shared, commons, nondominium
  propertyRegime: 'private' | 'shared' | 'commons' | 'nondominium'
}

export interface VFProcess {
  id: string
  name: string
  processType: VFProcessType
  inputResources: VFResourceReference[]
  outputResources: VFResourceReference[]
  agents: string[] // agent IDs
  startedAt?: number
  completedAt?: number
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  recipe?: string // reference to process template
}

export interface VFResourceReference {
  resourceId: string
  quantity: number
  role: 'input' | 'output' | 'catalyst' | 'tool'
}

export interface VFEvent {
  id: string
  eventType: VFEventType
  ts: number
  agentId: string
  processId?: string
  resourceId?: string
  quantity?: number
  unit?: string
  note?: string
  // Economic events (REA)
  economicEventType?: 'income' | 'expense' | 'transfer' | 'commitment'
  value?: number
  currency?: string
}

export interface VFAgent {
  id: string
  name: string
  agentType: 'Person' | 'Organization' | 'Group' | 'Bot' | 'AI'
  affiliations: string[] // network/project IDs
  reputationDimensions?: ReputationDimension[]
  capabilities: string[]
  createdAt: number
}

export interface ReputationDimension {
  dimension: 'quality' | 'commitment' | 'regularity' | 'collaboration' | 'innovation'
  score: number // 0-1, not global reputation
  evidence: string[] // references to VFEvents
  lastUpdated: number
}

export interface VFCommitment {
  id: string
  fromAgent: string
  toAgent: string
  resourceId: string
  quantity: number
  unit: string
  dueDate: number
  status: 'pending' | 'fulfilled' | 'breached' | 'cancelled'
  agreementId?: string
}

export interface VFAgreement {
  id: string
  parties: string[] // agent IDs
  terms: AgreementTerm[]
  startDate: number
  endDate?: number
  status: 'draft' | 'active' | 'completed' | 'terminated'
  governanceEquationId?: string
}

export interface AgreementTerm {
  resourceId: string
  quantity: number
  unit: string
  obligationType: 'provide' | 'receive' | 'transform' | 'maintain'
  conditions?: string[]
}

// ============================================
// VALUEFLOWS → HSCSG TYPES MAPPING
// ============================================

/**
 * Mapea un VFEvent a ValueFlow interno (ZNU-anchored)
 * 1 TQ = 1 kWh = denominador universal
 */
export function vfEventToValueFlow(event: VFEvent, agent: VFAgent): ValueFlow {
  const vfTypeMap: Record<string, VFType> = {
    Production: 'ManufactureFlow',
    Transformation: 'ManufactureFlow',
    Maintenance: 'RepairFlow',
    Research: 'LoveFlow',
    Education: 'LoveFlow',
    Governance: 'CareFlow',
  }

  const processType = event.processId // would lookup process
  const flowType = vfTypeMap[processType] || 'LaborFlow'

  // TQ calculation: 1 TQ = 1 kWh equivalent
  // For labor: hours * energy intensity factor
  // For materials: embodied energy
  const tqEquivalent = calculateTQEquivalent(event, flowType)

  return {
    id: event.id,
    ts: event.ts,
    type: flowType,
    actor: agent.name,
    znu: tqEquivalent,
    note: event.note,
  }
}

function calculateTQEquivalent(event: VFEvent, flowType: VFType): number {
  // Simplified: map event to TQ (1 TQ = 1 kWh)
  // Real implementation would use embodied energy database
  const baseEnergyByType: Record<VFType, number> = {
    LaborFlow: 0.1, // 100W human * 1h = 0.1 kWh
    LoveFlow: 0.05,
    CareFlow: 0.08,
    RepairFlow: 0.15,
    ManufactureFlow: 0.5,
  }

  const hours = event.quantity || 1
  return hours * (baseEnergyByType[flowType] || 0.1)
}

/**
 * Convierte ValueFlow interno a VFEvent para intercambio cross-network
 */
export function valueFlowToVFEvent(flow: ValueFlow, agentId: string, processId?: string): VFEvent {
  return {
    id: flow.id,
    eventType: 'ResourceInflow',
    ts: flow.ts,
    agentId,
    processId,
    quantity: flow.znu,
    unit: 'TQ',
    note: flow.note,
    economicEventType: 'income',
    value: flow.znu,
    currency: 'TQ',
  }
}

// ============================================
// INTEROPERABILITY: CROSS-NETWORK RESOURCE TYPES
// ============================================

export interface CrossNetworkResourceType {
  // Local type definition
  localTypeId: string
  localName: string
  localProperties: Record<string, any>

  // Converged/shared type (if networks agree)
  convergedTypeId?: string
  convergedName?: string

  // Synonyms from other networks
  synonyms: NetworkResourceSynonym[]

  // Unit conversion
  baseUnit: string
  conversionFactors: UnitConversion[]
}

export interface NetworkResourceSynonym {
  networkId: string
  networkName: string
  theirTypeId: string
  theirName: string
  equivalenceConfidence: number // 0-1
  conversionFactor?: number
}

export interface UnitConversion {
  fromUnit: string
  toUnit: string
  factor: number
  bidirectional: boolean
}

// ============================================
// VALUEFLOWS SCHEMA REGISTRY
// ============================================

/**
 * Registro de tipos de recursos ValueFlows para interoperabilidad
 * Basado en vf-schemas/vf-graphql (holo-REA + CommonsPub boundary)
 */
export class ValueFlowsSchemaRegistry {
  private resourceTypes: Map<string, CrossNetworkResourceType> = new Map()
  private processTypes: Map<string, VFProcessType> = new Map()
  private unitDefinitions: Map<string, UnitDefinition> = new Map()

  registerResourceType(type: CrossNetworkResourceType): void {
    this.resourceTypes.set(type.localTypeId, type)
  }

  getResourceType(localTypeId: string): CrossNetworkResourceType | undefined {
    return this.resourceTypes.get(localTypeId)
  }

  findConvergedType(localTypeId: string): CrossNetworkResourceType | undefined {
    const type = this.resourceTypes.get(localTypeId)
    if (type?.convergedTypeId) {
      return this.resourceTypes.get(type.convergedTypeId)
    }
    return undefined
  }

  registerUnit(unit: UnitDefinition): void {
    this.unitDefinitions.set(unit.unitId, unit)
  }

  convertUnits(value: number, fromUnit: string, toUnit: string): number | null {
    const fromDef = this.unitDefinitions.get(fromUnit)
    const toDef = this.unitDefinitions.get(toUnit)
    if (!fromDef || !toDef) return null

    // Convert to base unit first, then to target
    const baseValue = value * fromDef.toBaseFactor
    return baseValue / toDef.toBaseFactor
  }
}

export interface UnitDefinition {
  unitId: string
  name: string
  symbol: string
  dimension: 'energy' | 'mass' | 'volume' | 'time' | 'count' | 'information' | 'currency'
  toBaseFactor: number // factor to convert to base unit (e.g., kWh for energy)
  baseUnit: string
}

// ============================================
// EXPORTS
// ============================================

export const valueFlowsSchemaRegistry = new ValueFlowsSchemaRegistry()

// Initialize base units (TQ = kWh as universal denominator)
valueFlowsSchemaRegistry.registerUnit({
  unitId: 'TQ',
  name: 'Time-Quantum',
  symbol: 'TQ',
  dimension: 'energy',
  toBaseFactor: 1, // 1 TQ = 1 kWh (base)
  baseUnit: 'kWh',
})

valueFlowsSchemaRegistry.registerUnit({
  unitId: 'kWh',
  name: 'Kilowatt-hour',
  symbol: 'kWh',
  dimension: 'energy',
  toBaseFactor: 1,
  baseUnit: 'kWh',
})

valueFlowsSchemaRegistry.registerUnit({
  unitId: 'h',
  name: 'Hour',
  symbol: 'h',
  dimension: 'time',
  toBaseFactor: 0.1, // 1h human labor ≈ 0.1 kWh (100W)
  baseUnit: 'kWh',
})

valueFlowsSchemaRegistry.registerUnit({
  unitId: 'kg',
  name: 'Kilogram',
  symbol: 'kg',
  dimension: 'mass',
  toBaseFactor: 1,
  baseUnit: 'kg',
})