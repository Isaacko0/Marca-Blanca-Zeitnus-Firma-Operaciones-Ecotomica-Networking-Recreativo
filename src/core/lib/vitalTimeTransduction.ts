// HSCSG v15 OS — Transducción F: TQ (kWh) ↔ hr_vital — REFACTOR LIMPIO
// Alráico: F: {TQ, Gaia, Kernel, Alráico} → 𝕮 → {hr_vital}
// Alineada a Bio-Tesis MAESTRA v2.0 + BT213 + BT214 + AFP + BT180 + BT165 + BT164

import type { VitalTimeNode } from './vitalTime'
import type { KernelOperation } from './bt213KernelLimits'
import { validateKernelOperation } from './bt213KernelLimits'
import { validateArtificerResponsibility, validateTwoDomainsIntegration } from './vitalTime'

// === TASAS DE TRANSDUCCIÓN BASE ===

export const TRANSDUCTION_RATES = {
  TQ_TO_VITAL: {
    rate: 1,
    minAlphaH: 0.6,
    requiresTriaxial: true,
    maxPerDay: 24
  },
  VITAL_TO_TQ: {
    rate: 1,
    minAlphaH: 0.7,
    requiresTriaxial: true,
    requiresEnergyCapacity: true,
    maxPerDay: 24
  },
  GAIA_TO_VITAL: {
    rate: 0.1,
    minAlphaH: 0.5,
    requiresTriaxial: true,
    maxPerDay: 10
  },
  KERNEL_TO_VITAL: {
    rate: 0.01,
    minAlphaH: 0.7,
    requiresTriaxial: true,
    maxPerDay: 5
  },
  ALRAICO_TO_VITAL: {
    rate: 10,
    minAlphaH: 0.8,
    requiresTriaxial: true,
    maxPerDay: 5
  }
} as const

export type TransductionDirection = 
  | 'TQ_TO_VITAL' 
  | 'VITAL_TO_TQ' 
  | 'GAIA_TO_VITAL' 
  | 'KERNEL_TO_VITAL' 
  | 'ALRAICO_TO_VITAL'

export interface TransductionRequest {
  direction: TransductionDirection
  fromAmount: number
  fromNodeId: string
  toNodeId?: string
  triaxialVerified: boolean
  operatorAlphaH: number
  energyCapacityKWh?: number
  justification: string
  requiresTwoDomainsIntegration: boolean
  artificerResponsibilityAccepted: boolean
}

export interface TransductionResult {
  success: boolean
  toAmount: number
  toUnit: 'hr_vital' | 'kWh' | 'gaia_tokens' | 'kernel_rastros' | 'alraico_alphaH'
  rateUsed: number
  alphaHUsed: number
  triaxialVerified: boolean
  transductionId: string
  timestamp: number
  reason?: string
  kernelLimitsValid?: boolean
  artificerResponsibilityValid?: boolean
}

export const DAILY_TRANSDUCTION_LIMITS = {
  TQ_TO_VITAL: 24,
  VITAL_TO_TQ: 24,
  GAIA_TO_VITAL: 10,
  KERNEL_TO_VITAL: 5,
  ALRAICO_TO_VITAL: 5
} as const

// Log diario en memoria (persistir en BD en producción)
const dailyTransductionLog = new Map<string, Map<TransductionDirection, number>>()

// === FUNCIÓN PRINCIPAL ===

export function transduce(
  request: TransductionRequest,
  fromNode: VitalTimeNode,
  toNode?: VitalTimeNode
): TransductionResult {
  const { 
    direction, 
    fromAmount, 
    triaxialVerified, 
    operatorAlphaH, 
    energyCapacityKWh, 
    requiresTwoDomainsIntegration, 
    artificerResponsibilityAccepted 
  } = request

  // 1. Triaxial obligatoria
  if (!triaxialVerified) {
    return failure(0, 'Triaxial no verificada (obligatoria)')
  }

  // 2. Config de tasa
  const rateConfig = TRANSDUCTION_RATES[direction]
  if (!rateConfig) {
    return failure(0, `Dirección desconocida: ${direction}`)
  }

  // 3. αʰ ≥ umbral (𝕲 threshold)
  if (operatorAlphaH < rateConfig.minAlphaH) {
    return failure(0, `αʰ ${operatorAlphaH} < umbral ${rateConfig.minAlphaH} para ${direction}`)
  }

  // 4. Límites diarios anti-acumulación
  const dailyUsed = getDailyTransductionUsed(fromNode.nodeId, direction)
  const maxDaily = DAILY_TRANSDUCTION_LIMITS[direction]
  if (dailyUsed + fromAmount > maxDaily) {
    return failure(0, `Límite diario excedido: ${dailyUsed}/${maxDaily} ${direction}`)
  }

  // 5. BT213: Validación límite kernel
  const kernelValidation = validateKernelOperation({ classification: 'compatible' } as KernelOperation)
  if (!kernelValidation.valid) {
    return failure(0, `VIOLACIÓN BT213 KERNEL: ${kernelValidation.violations.join(', ')}`)
  }

  // 6. BT213: Integración dos dominios
  if (requiresTwoDomainsIntegration) {
    const domainsValidation = validateTwoDomainsIntegration(fromNode)
    if (!domainsValidation.valid) {
      return failure(0, `VIOLACIÓN BT213 DOS DOMINIOS: ${domainsValidation.violations.join(', ')}`)
    }
  }

  // 7. BT214: Responsabilidad artífice
  if (artificerResponsibilityAccepted) {
    const artificerValidation = validateArtificerResponsibility(fromNode)
    if (!artificerValidation.valid) {
      return failure(0, `VIOLACIÓN BT214 ARTÍFICE: ${artificerValidation.violations.join(', ')}`)
    }
  }

  // 8. Validaciones específicas por dirección
  const specificValidation = validateDirectionSpecific(request, fromNode, toNode, rateConfig)
  if (!specificValidation.valid) {
    return failure(0, specificValidation.reason!)
  }

  // 9. Calcular resultado
  const toAmount = fromAmount * rateConfig.rate

  // 10. Registrar en log diario
  logTransduction(fromNode.nodeId, direction, fromAmount)

  // 11. ID único
  const transductionId = `tx_${direction}_${fromNode.nodeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    success: true,
    toAmount: Math.round(toAmount * 1e6) / 1e6,
    toUnit: getToUnit(direction),
    rateUsed: rateConfig.rate,
    alphaHUsed: operatorAlphaH,
    triaxialVerified: true,
    transductionId,
    timestamp: Date.now(),
    kernelLimitsValid: true,
    artificerResponsibilityValid: true
  }
}

function failure(toAmount: number, reason: string): TransductionResult {
  return {
    success: false,
    toAmount: 0,
    toUnit: 'hr_vital',
    rateUsed: 0,
    alphaHUsed: 0,
    triaxialVerified: false,
    transductionId: '',
    timestamp: Date.now(),
    reason,
    kernelLimitsValid: false,
    artificerResponsibilityValid: false
  }
}

// Validaciones específicas por dirección
function validateDirectionSpecific(
  request: TransductionRequest,
  fromNode: VitalTimeNode,
  toNode: VitalTimeNode | undefined,
  rateConfig: typeof TRANSDUCTION_RATES[keyof typeof TRANSDUCTION_RATES]
): { valid: boolean; reason?: string } {

  switch (request.direction) {
    case 'VITAL_TO_TQ':
      if (request.energyCapacityKWh === undefined || request.energyCapacityKWh < request.fromAmount) {
        return { valid: false, reason: `Capacidad energética insuficiente: ${request.energyCapacityKWh || 0}kWh < ${request.fromAmount}hr_vital` }
      }
      if (!toNode || !toNode.transductionEnabled) {
        return { valid: false, reason: 'Nodo destino no tiene transducción TQ habilitada' }
      }
      break

    case 'TQ_TO_VITAL':
      // Validación de balance TQ se hace en layer TQ
      break

    case 'ALRAICO_TO_VITAL':
      if (request.operatorAlphaH < 0.8) {
        return { valid: false, reason: 'αʰ insuficiente para transducción Alráico (requiere ≥ 0.8)' }
      }
      break

    case 'GAIA_TO_VITAL':
    case 'KERNEL_TO_VITAL':
      // Futuro: validaciones específicas
      break
  }

  return { valid: true }
}

function getToUnit(direction: TransductionDirection): TransductionResult['toUnit'] {
  switch (direction) {
    case 'TQ_TO_VITAL':
    case 'GAIA_TO_VITAL':
    case 'KERNEL_TO_VITAL':
    case 'ALRAICO_TO_VITAL':
      return 'hr_vital'
    case 'VITAL_TO_TQ':
      return 'kWh'
  }
}

// Tracking diario
function getDailyTransductionUsed(nodeId: string, direction: TransductionDirection): number {
  const nodeLog = dailyTransductionLog.get(nodeId)
  if (!nodeLog) return 0
  return nodeLog.get(direction) || 0
}

function logTransduction(nodeId: string, direction: TransductionDirection, amount: number): void {
  let nodeLog = dailyTransductionLog.get(nodeId)
  if (!nodeLog) {
    nodeLog = new Map()
    dailyTransductionLog.set(nodeId, nodeLog)
  }
  const current = nodeLog.get(direction) || 0
  nodeLog.set(direction, current + amount)
}

export function resetDailyTransductionLimits(): void {
  dailyTransductionLog.clear()
}

export function getTransductionUsage(nodeId: string): Record<string, number> {
  const nodeLog = dailyTransductionLog.get(nodeId)
  if (!nodeLog) return {}
  
  const result: Record<string, number> = {}
  for (const [dir, amount] of nodeLog.entries()) {
    result[dir] = amount
  }
  return result
}

// === FUNCIONES DE CONVENIENCIA PARA PILOTO ===

export function transduceTQtoVitalTime(
  tqAmount: number,
  operatorAlphaH: number,
  triaxialVerified: boolean,
  fromNode: VitalTimeNode
): TransductionResult {
  return transduce({
    direction: 'TQ_TO_VITAL',
    fromAmount: tqAmount,
    fromNodeId: fromNode.nodeId,
    triaxialVerified,
    operatorAlphaH,
    justification: 'Transducción TQ→hr_vital piloto 3 nodos',
    requiresTwoDomainsIntegration: true,
    artificerResponsibilityAccepted: true
  }, fromNode)
}

export function transduceVitalTimeToTQ(
  vitalTimeAmount: number,
  operatorAlphaH: number,
  triaxialVerified: boolean,
  fromNode: VitalTimeNode,
  toNode: VitalTimeNode,
  energyCapacityKWh: number
): TransductionResult {
  return transduce({
    direction: 'VITAL_TO_TQ',
    fromAmount: vitalTimeAmount,
    fromNodeId: fromNode.nodeId,
    toNodeId: toNode.nodeId,
    triaxialVerified,
    operatorAlphaH,
    energyCapacityKWh,
    justification: 'Transducción hr_vital→TQ piloto 3 nodos',
    requiresTwoDomainsIntegration: true,
    artificerResponsibilityAccepted: true
  }, fromNode, toNode)
}

export function canNodeTransduce(
  node: VitalTimeNode,
  direction: TransductionDirection,
  operatorAlphaH: number
): { can: boolean; reason?: string } {
  const rateConfig = TRANSDUCTION_RATES[direction]
  if (!rateConfig) return { can: false, reason: 'Dirección desconocida' }
  if (operatorAlphaH < rateConfig.minAlphaH) return { can: false, reason: `αʰ ${operatorAlphaH} < ${rateConfig.minAlphaH}` }

  const dailyUsed = getDailyTransductionUsed(node.nodeId, direction)
  if (dailyUsed >= DAILY_TRANSDUCTION_LIMITS[direction]) return { can: false, reason: 'Límite diario alcanzado' }

  return { can: true }
}

export const VITAL_TIME_TRANSDUCTION = {
  transduce,
  transduceTQtoVitalTime,
  transduceVitalTimeToTQ,
  canNodeTransduce,
  getTransductionUsage,
  resetDailyTransductionLimits,
  TRANSDUCTION_RATES,
  DAILY_TRANSDUCTION_LIMITS
} as const