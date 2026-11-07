// HSCSG v15 OS — REA Integration (Resources, Events, Agents)
// Modelo contable REA evolucionado de Bill McCarthy → base para NRP-CAS + ValueFlows
// REA: Resources (qué), Events (qué pasó), Agents (quién) — triple entry accounting

import type { VFResource, VFProcess, VFEvent, VFAgent, VFCommitment, VFAgreement } from '@core/lib/valueFlowsIntegration'
import { uid } from '@core/lib/utils'

// ============================================
// REA CORE ONTOLOGY
// ============================================

/**
 * REA Resource — algo de valor económico que puede ser contabilizado
 * Extiende VFResource con campos REA específicos
 */
export interface REAResource extends VFResource {
  // REA-specific
  resourceCategory: 'tangible' | 'intangible' | 'financial' | 'human' | 'ecological'
  economicStatus: 'available' | 'committed' | 'consumed' | 'produced' | 'transferred'
  valuationMethod: 'historical_cost' | 'market_value' | 'replacement_cost' | 'embodied_energy' | 'labor_time'
  embodiedEnergyKWh?: number // para TQ-anchored valuation
  laborTimeHours?: number
  ecologicalFootprint?: EcologicalFootprint
}

export interface EcologicalFootprint {
  carbonKgCO2e: number
  waterLiters: number
  landM2: number
  biodiversityImpact: number // 0-1
  circularityIndex: number // 0-1 (0 = linear, 1 = fully circular)
}

/**
 * REA Event — evento económico que cambia el estado de recursos
 * Triple entry: Resource + Event + Agent = completa trazabilidad
 */
export interface REAEvent extends VFEvent {
  // REA-specific
  eventClassification: 'economic_duality' | 'economic_increment' | 'economic_decrement' | 'internal_transfer'
  dualEventId?: string // paired event (every economic event has a dual)

  // Resource impacts
  resourceImpacts: ResourceImpact[]

  // Agent roles in this event
  agentRoles: AgentRole[]

  // Accounting
  accountingEntries: AccountingEntry[]
  isReconciled: boolean
  reconciliationDate?: number
}

export interface ResourceImpact {
  resourceId: string
  quantityChange: number // positive = increment, negative = decrement
  unit: string
  valuationAtEvent: number
  valuationCurrency: string
}

export interface AgentRole {
  agentId: string
  roleType: 'provider' | 'receiver' | 'authorizer' | 'witness' | 'beneficiary'
  economicRole: 'source' | 'destination' | 'both' | 'neither'
}

export interface AccountingEntry {
  id: string
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' | 'TQ_ledger'
  debit: number
  credit: number
  currency: string // TQ, ZNU, USDC, etc.
  description: string
}

/**
 * REA Agent — entidad con agencia económica
 * Extiende VFAgent con capacidades económicas REA
 */
export interface REAAgent extends VFAgent {
  // Economic capabilities
  economicPowers: EconomicPower[]
  // Legal standing
  legalStatus: 'natural_person' | 'legal_entity' | 'dao' | 'custodian' | 'exchange_firm' | 'network'
  // Contractual capacity
  canEnterContracts: boolean
  contractLimits?: ContractLimit[]
  // Custodianship
  custodianships: Custodianship[]
}

export interface EconomicPower {
  powerType: 'create_resource' | 'transform_resource' | 'transfer_resource' | 'commit_resource' | 'govern_resource'
  scope: 'personal' | 'project' | 'network' | 'federation'
  constraints: string[]
}

export interface ContractLimit {
  maxValue: number
  currency: string
  requiresCoSigners: number
  allowedCounterparties: string[]
}

export interface Custodianship {
  resourceId: string
  regime: 'private' | 'shared' | 'commons' | 'nondominium'
  responsibilities: CustodianResponsibility[]
  startDate: number
  endDate?: number
  recallable: boolean
}

export type CustodianResponsibility =
  | 'maintenance'
  | 'access_management'
  | 'valuation'
  | 'regeneration'
  | 'distribution'
  | 'audit'
  | 'dispute_resolution'

/**
 * REA Agreement — contrato económico entre agentes
 * Base para smart contracts y governance equations
 */
export interface REAAgreement extends VFAgreement {
  // REA-specific
  agreementType: 'exchange' | 'commitment' | 'governance' | 'custodianship' | 'partnership' | 'federation'
  economicTerms: EconomicTerm[]
  enforcementMechanism: 'social' | 'smart_contract' | 'legal' | 'hybrid'
  governanceEquationId?: string
  // REA duality: every agreement creates reciprocal commitments
  dualAgreementId?: string
}

export interface EconomicTerm {
  termType: 'quantity' | 'quality' | 'timing' | 'valuation' | 'penalty' | 'incentive'
  resourceId: string
  specification: string
  measurable: boolean
  verificationMethod: 'self_report' | 'peer_review' | 'sensor' | 'oracle' | 'consensus'
  consequence: 'none' | 'reputation_impact' | 'financial_penalty' | 'access_revocation' | 'contract_termination'
}

// ============================================
// REA ECONOMIC DUALITY (Core Principle)
// ============================================

/**
 * Every economic event has a dual aspect:
 * - Source agent gives up something (resource outflow)
 * - Destination agent receives something (resource inflow)
 * - Value is conserved in the duality (TQ-anchored)
 */
export interface EconomicDuality {
  sourceEvent: REAEvent // outflow event
  destinationEvent: REAEvent // inflow event
  conservationCheck: boolean // TQ value conserved?
  valueTransferred: number
  valueCurrency: 'TQ' | 'ZNU' | 'USDC'
  timestamp: number
}

/**
 * Crea la dualidad económica para un intercambio
 * Valida conservación de TQ (1 TQ = 1 kWh universal denominator)
 */
export function createEconomicDuality(
  sourceAgentId: string,
  destinationAgentId: string,
  resourceId: string,
  quantity: number,
  unit: string,
  tqValue: number,
  agreementId?: string
): EconomicDuality {
  const timestamp = Date.now()
  const eventId = uid()

  const sourceEvent: REAEvent = {
    id: `${eventId}_out`,
    eventType: 'ResourceOutflow',
    ts: timestamp,
    agentId: sourceAgentId,
    resourceId,
    quantity: -quantity,
    unit,
    economicEventType: 'expense',
    value: tqValue,
    currency: 'TQ',
    eventClassification: 'economic_decrement',
    dualEventId: `${eventId}_in`,
    resourceImpacts: [{
      resourceId,
      quantityChange: -quantity,
      unit,
      valuationAtEvent: tqValue,
      valuationCurrency: 'TQ',
    }],
    agentRoles: [{
      agentId: sourceAgentId,
      roleType: 'provider',
      economicRole: 'source',
    }],
    accountingEntries: [{
      id: uid(),
      accountType: 'asset',
      debit: 0,
      credit: tqValue,
      currency: 'TQ',
      description: `Outflow ${quantity} ${unit} of ${resourceId}`,
    }],
    isReconciled: false,
  }

  const destinationEvent: REAEvent = {
    id: `${eventId}_in`,
    eventType: 'ResourceInflow',
    ts: timestamp,
    agentId: destinationAgentId,
    resourceId,
    quantity,
    unit,
    economicEventType: 'income',
    value: tqValue,
    currency: 'TQ',
    eventClassification: 'economic_increment',
    dualEventId: `${eventId}_out`,
    resourceImpacts: [{
      resourceId,
      quantityChange: quantity,
      unit,
      valuationAtEvent: tqValue,
      valuationCurrency: 'TQ',
    }],
    agentRoles: [{
      agentId: destinationAgentId,
      roleType: 'receiver',
      economicRole: 'destination',
    }],
    accountingEntries: [{
      id: uid(),
      accountType: 'asset',
      debit: tqValue,
      credit: 0,
      currency: 'TQ',
      description: `Inflow ${quantity} ${unit} of ${resourceId}`,
    }],
    isReconciled: false,
  }

  return {
    sourceEvent,
    destinationEvent,
    conservationCheck: true, // TQ conserved by construction
    valueTransferred: tqValue,
    valueCurrency: 'TQ',
    timestamp,
  }
}

/**
 * Valida que un par de eventos mantiene dualidad económica
 */
export function validateEconomicDuality(duality: EconomicDuality): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check value conservation
  const sourceValue = Math.abs(duality.sourceEvent.value || 0)
  const destValue = Math.abs(duality.destinationEvent.value || 0)

  if (Math.abs(sourceValue - destValue) > 0.001) {
    errors.push(`Value not conserved: source ${sourceValue} != dest ${destValue} ${duality.valueCurrency}`)
  }

  // Check opposite quantities
  const sourceQty = duality.sourceEvent.resourceImpacts[0]?.quantityChange || 0
  const destQty = duality.destinationEvent.resourceImpacts[0]?.quantityChange || 0

  if (Math.abs(sourceQty + destQty) > 0.001) {
    errors.push(`Quantity not balanced: source ${sourceQty} + dest ${destQty} != 0`)
  }

  // Check dual event IDs match
  if (duality.sourceEvent.dualEventId !== duality.destinationEvent.id ||
      duality.destinationEvent.dualEventId !== duality.sourceEvent.id) {
    errors.push('Dual event IDs do not match')
  }

  return { valid: errors.length === 0, errors }
}

// ============================================
// REA → VALUEFLOWS MAPPING
// ============================================

/**
 * Convierte REA Resource a VFResource
 */
export function reaResourceToVF(rea: REAResource): VFResource {
  return {
    id: rea.id,
    name: rea.name,
    resourceType: mapResourceCategoryToVF(rea.resourceCategory),
    unit: rea.unit,
    quantity: rea.quantity,
    location: rea.location,
    tags: [rea.resourceCategory, rea.valuationMethod, ...(rea.tags || [])],
    createdAt: rea.createdAt,
    updatedAt: rea.updatedAt,
    propertyRegime: rea.propertyRegime,
  }
}

function mapResourceCategoryToVF(category: REAResource['resourceCategory']): VFResource['resourceType'] {
  const map: Record<REAResource['resourceCategory'], VFResource['resourceType']> = {
    tangible: 'PhysicalResource',
    intangible: 'KnowledgeResource',
    financial: 'FinancialResource',
    human: 'HumanResource',
    ecological: 'PhysicalResource', // ecological resources are physical
  }
  return map[category]
}

/**
 * Convierte REA Event a VFEvent
 */
export function reaEventToVF(rea: REAEvent): VFEvent {
  return {
    id: rea.id,
    eventType: rea.eventType,
    ts: rea.ts,
    agentId: rea.agentId,
    processId: rea.processId,
    resourceId: rea.resourceId,
    quantity: rea.quantity,
    unit: rea.unit,
    note: rea.note,
    economicEventType: rea.economicEventType,
    value: rea.value,
    currency: rea.currency,
  }
}

/**
 * Convierte REA Agent a VFAgent
 */
export function reaAgentToVF(rea: REAAgent): VFAgent {
  return {
    id: rea.id,
    name: rea.name,
    agentType: rea.agentType,
    affiliations: rea.affiliations,
    reputationDimensions: rea.reputationDimensions,
    capabilities: rea.economicPowers.map(p => p.powerType),
    createdAt: rea.createdAt,
  }
}

// ============================================
// TQ-ANCHORED VALUATION (Ley I MJ: Base Material)
// ============================================

/**
 * Valuation engine usando TQ (1 TQ = 1 kWh) como denominador universal
 * Implementa: Embodied Energy + Labor Time + Ecological Cost
 */
export class TQValuationEngine {
  private embodiedEnergyDB: Map<string, number> = new Map() // resourceId -> kWh/unit
  private laborIntensityDB: Map<string, number> = new Map() // processId -> kWh/hour
  private ecologicalCostDB: Map<string, EcologicalFootprint> = new Map()

  registerEmbodiedEnergy(resourceId: string, kWhPerUnit: number): void {
    this.embodiedEnergyDB.set(resourceId, kWhPerUnit)
  }

  registerLaborIntensity(processId: string, kWhPerHour: number): void {
    this.laborIntensityDB.set(processId, kWhPerHour)
  }

  registerEcologicalCost(resourceId: string, footprint: EcologicalFootprint): void {
    this.ecologicalCostDB.set(resourceId, footprint)
  }

  /**
   * Calcula valor TQ de un recurso
   * TQ = Embodied Energy + Labor Time + Ecological Cost (internalized)
   */
  calculateResourceTQ(resource: REAResource): number {
    let tq = 0

    // 1. Embodied energy (primary for physical resources)
    const embodied = this.embodiedEnergyDB.get(resource.id)
    if (embodied) {
      tq += embodied * resource.quantity
    } else if (resource.embodiedEnergyKWh) {
      tq += resource.embodiedEnergyKWh * resource.quantity
    }

    // 2. Labor time (for produced resources)
    if (resource.laborTimeHours) {
      tq += resource.laborTimeHours * 0.1 // 100W human baseline
    }

    // 3. Ecological cost internalization (Ley I MJ: regeneración verificada)
    const eco = this.ecologicalCostDB.get(resource.id)
    if (eco) {
      // Carbon cost: 1 kg CO2e ≈ 0.5 kWh equivalent (regeneration energy)
      tq += eco.carbonKgCO2e * 0.5
      // Water: 1 L ≈ 0.001 kWh (pumping/treatment)
      tq += eco.waterLiters * 0.001
      // Land opportunity cost
      tq += eco.landM2 * 0.1
    }

    return tq
  }

  /**
   * Calcula valor TQ de un proceso
   * TQ = Energy inputs + Labor + Tool wear + Ecological impact
   */
  calculateProcessTQ(process: VFProcess, inputResources: REAResource[]): number {
    let tq = 0

    // Energy inputs
    for (const input of inputResources) {
      tq += this.calculateResourceTQ(input)
    }

    // Labor (if process has duration)
    if (process.startedAt && process.completedAt) {
      const hours = (process.completedAt - process.startedAt) / (1000 * 60 * 60)
      const intensity = this.laborIntensityDB.get(process.id) || 0.1
      tq += hours * intensity
    }

    // Tool wear (catalyst resources depreciation)
    for (const ref of process.inputResources) {
      if (ref.role === 'tool' || ref.role === 'catalyst') {
        tq += this.calculateResourceTQ({
          ...inputResources.find(r => r.id === ref.resourceId)!,
          quantity: ref.quantity * 0.01, // 1% wear per use
        } as REAResource)
      }
    }

    return tq
  }
}

export const tqValuationEngine = new TQValuationEngine()

// Initialize with baseline embodied energies (kWh per unit)
tqValuationEngine.registerEmbodiedEnergy('steel_kg', 20)
tqValuationEngine.registerEmbodiedEnergy('aluminum_kg', 50)
tqValuationEngine.registerEmbodiedEnergy('plastic_kg', 30)
tqValuationEngine.registerEmbodiedEnergy('cement_kg', 1.5)
tqValuationEngine.registerEmbodiedEnergy('glass_kg', 10)
tqValuationEngine.registerEmbodiedEnergy('solar_panel_w', 0.5)
tqValuationEngine.registerEmbodiedEnergy('battery_kwh', 150)
tqValuationEngine.registerEmbodiedEnergy('microcontroller_unit', 5)
tqValuationEngine.registerEmbodiedEnergy('sensor_unit', 8)
tqValuationEngine.registerEmbodiedEnergy('3d_printer_filament_kg', 25)
tqValuationEngine.registerEmbodiedEnergy('arduino_unit', 12)
tqValuationEngine.registerEmbodiedEnergy('raspberry_pi_unit', 25)

// Baseline labor intensities (kWh per hour)
tqValuationEngine.registerLaborIntensity('manual_assembly', 0.1)
tqValuationEngine.registerLaborIntensity('cnc_machining', 0.5)
tqValuationEngine.registerLaborIntensity('3d_printing', 0.2)
tqValuationEngine.registerLaborIntensity('pcb_assembly', 0.3)
tqValuationEngine.registerLaborIntensity('coding', 0.1)
tqValuationEngine.registerLaborIntensity('research', 0.1)
tqValuationEngine.registerLaborIntensity('governance', 0.1)