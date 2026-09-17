// HSCSG v15 OS — Moneda Tiempo Vital (hr_vital) — REFACTOR LIMPIO
// Alineada a Bio-Tesis MAESTRA v2.0 (E=V + NEXO) + Kernel v214 + BT213 + BT214 + AFP + BT180 + BT165 + BT164 + Alráico
// Fuente canónica: Bio-Tesis MAESTRA v2.0

import type { ValueUnit, NodeMode } from './valueDual'

// === TIPOS BASE ===

export type VitalTimeUnit = 'hr_vital'
export type VitalTimeMode = 'postmonetario' | 'conectado' | 'vital_time'

// Ancla ontológica: 1 hr_vital = presencia verificable en cuerpo (E=V)
export interface VitalTimeAmount {
  amount: number                    // Horas vitales (decimal, ej: 1.5)
  unit: VitalTimeUnit               // 'hr_vital'
  verified: boolean                 // Verificación triaxial completada
  timestamp: number                 // Unix ms cuando se verificó presencia
  nodeId: string                    // Nodo que verificó (YOKA | LAUTARO | ISAAC | ...)
  triaxialProof: TriaxialProof      // Prueba Mental + Sim + Lab
}

// Prueba Triaxial (Alráico Capa 0) - BT213 + BT214
export interface TriaxialProof {
  mental: {                         // Entendimiento consciente (VIA-27, VIA-25)
    operatorId: string
    timestamp: number
    signature: string               // Firma del operador: "reconozco esta presencia"
    // BT213/VIA-27: Distinguir dato raíz interno vs compartido
    directExperienceIntegrated: boolean
    sharedTracesIntegrated: boolean
    kernelLimitsRespected: boolean  // BT213: kernel no audita conciencia
  }
  simulation: {                     // Modelo computacional (VIA-25, BT213)
    loopEngineSnapshot: LoopEngineState
    resonanceCheck: boolean
    // BT213: γ-CARMIS + resonancia + coherencia operativa
    gammaCARMISActive: boolean
    coherenceVerified: boolean
    noInternalEvasionDetected: boolean
  }
  laboratory: {                     // Verificación en cuerpo (Lab) - BT214 responsabilidad
    biometricHash?: string
    eVBodyCheck: boolean            // E=V verificable en cuerpo (autorreporte + testigo)
    witnessNodeId?: string          // Nodo testigo opcional
    // BT214: Responsabilidad indelegable
    responsibilityAccepted: boolean
    uncertaintyAcknowledged: boolean
    translationSignature: string    // Firma única del operador
    betaPerpetuaMode: boolean       // Acepta corrección continua
  }
}

// Snapshot del LoopEngine para verificación simulación
export interface LoopEngineState {
  activeLoops: string[]
  gammaCARMIS: {
    active: boolean
    triggers: number
    reconfigurations: number
    pendingOverloads: number
  }
  resonances: Array<{
    c1: string
    c2: string
    alphaH: number
  }>
  tickInterval: number
  // BT213: Coherencia operativa
  coherenceVerified: boolean
  noInternalEvasionAssumed: boolean
}

// Pool de Tiempo Vital (Análogo a ZNU_POOL_TOTAL) — E=V §19
export const VITAL_TIME_POOL_TOTAL = 1
export const VITAL_TIME_ROTATION_DAYS = 30
export const VITAL_TIME_DEMURRAGE_RATE = 0.10 / 365

// Nodo con Tiempo Vital — UNA SOLA DEFINICIÓN POR CAMPO
export interface VitalTimeNode {
  // Base
  nodeId: string
  name: string
  vitalTimeBalance: VitalTimeAmount
  protectedVitalTime: number
  lastActivity: number
  rotationDays: number
  demurrageRate: number
  triaxialVerificationCount: number
  resonanceConnections: string[]
  mode: VitalTimeMode
  transductionEnabled: boolean

  // BT213/Kernel §13: LÍMITE KERNEL (una sola vez)
  kernelLimits: {
    cannotAuditConsciousness: true
    onlyOrganizesTraces: true
    classifiesAssertions: 'compatible' | 'incompatible' | 'no-evaluable'
    cannotAccessDirectExperience: true
    cannotDecideTruth: true
    cannotInterpretPersons: true
    cannotDetectInternalEvasion: true
    silenceIsNeutral: true
    twoDomains: true
    debtFromEvasionEither: true
  }

  // BT214/Humano §14: ARTÍFICE (una sola vez)
  humanArtificer: {
    role: 'magus' | 'alchemist' | 'both'
    responsibilityAccepted: boolean
    translationSignature: string
    uncertaintyAcknowledged: boolean
    betaPerpetuaMode: boolean
  }

  // BT213/Kernel §13: PRESENCIA = 2 DOMINIOS INTEGRADOS (una sola vez)
  presenceIntegration: {
    directExperienceVerified: boolean
    sharedTracesVerified: boolean
    debtGenerated: boolean
  }

  // AFP §40: PILAR 3 TIEMPO VITAL (una sola vez)
  afpVitalTime: {
    consciousEnergyVerified: boolean
    contributionHours: number
    expandedAccess: boolean
    nbuCovered: boolean
    ecoImpact: number
  }

  // BT180/E=V §10,§20: PODER = TIEMPO VITAL (una sola vez)
  powerAsVitalTime: {
    controlsOwnTime: boolean
    consentGradients: number
    energyFromBelow: boolean
    notForSale: boolean
  }

  // BT165/E=V §2,§4,§8: ECUACIÓN LASTRE E=V (una sola vez)
  ballastEquation: {
    truthAssumed: number
    truthEvaded: number
    evasionLightensToday: boolean
    presenceDensifiesNow: boolean
    totalPaidEqual: boolean
    peaceFromAssumption: boolean
  }

  // BT164/E=V §9: MARGEN REAL (una sola vez)
  realMargin: {
    currentMargin: number
    evasionReducesMargin: boolean
    presenceExpandsMargin: boolean
    extractionSequestersMargin: boolean
    evolutionReorganizesMargin: boolean
    thresholdReal: number
    lagReal: number
  }
}

// Transducción F: {TQ, Gaia, Kernel, Alráico} → 𝕮 → {hr_vital}
export interface VitalTimeTransduction {
  fromSystem: 'TQ' | 'GAIA' | 'KERNEL' | 'ALRAICO'
  fromAmount: number
  fromUnit: 'kWh' | 'gaia_tokens' | 'kernel_rastros' | 'alraico_alphaH'
  toAmount: number
  transductionFunction: 'F_TQ' | 'F_GAIA' | 'F_KERNEL' | 'F_ALRAICO'
  cedeoFiloThreshold: number
  triaxialVerified: boolean
  // BT213: Transducción requiere 2 dominios integrados
  requiresTwoDomainsIntegration: boolean
  // BT214: Responsabilidad artífice
  artificerResponsibilityAccepted: boolean
}

// === FUNCIONES CORE ===

/**
 * Rotación anti-acumulación (adaptada de znuRotate) — E=V §9
 * Pool fijo = 1, exceso sobre protegido se libera al pool
 */
export function vitalTimeRotate(
  balance: VitalTimeAmount,
  protectedVitalTime: number,
  daysSinceActivity: number,
  rotationDays: number = VITAL_TIME_ROTATION_DAYS
): { active: VitalTimeAmount; released: number } {
  if (daysSinceActivity < rotationDays) return { active: balance, released: 0 }
  const excess = Math.max(0, balance.amount - protectedVitalTime)
  const released = excess
  return {
    active: { ...balance, amount: balance.amount - released },
    released
  }
}

/**
 * Decay por inactividad — E=V §8, §9
 * 10%/año = 0.10/365 por día. E=V en cuerpo: tiempo vital pierde poder si no se ejerce.
 */
export function vitalTimeDecay(
  balance: VitalTimeAmount,
  ratePerDay: number,
  daysSinceActivity: number
): VitalTimeAmount {
  if (balance.amount <= 0 || daysSinceActivity <= 0) return balance
  const factor = Math.pow(1 - ratePerDay, daysSinceActivity)
  return {
    ...balance,
    amount: Math.round(balance.amount * factor * 1e6) / 1e6
  }
}

/**
 * Concentración (anti-propósito moneda) — E=V §9, BT164
 */
export function vitalTimeConcentration(
  balance: VitalTimeAmount,
  totalSupply: number,
  threshold = 0.05
): boolean {
  return (balance.amount / totalSupply) > threshold
}

/**
 * Crea nodo vital time por defecto para piloto 3 nodos
 */
export function createVitalTimeNode(
  nodeId: 'YOKA' | 'LAUTARO' | 'ISAAC' | 'FELIPE',
  name: string,
  mode: VitalTimeMode = 'postmonetario'
): VitalTimeNode {
  const now = Date.now()
  return {
    nodeId,
    name,
    vitalTimeBalance: {
      amount: 1 / 3,
      unit: 'hr_vital',
      verified: false,
      timestamp: now,
      nodeId,
      triaxialProof: {
        mental: {
          operatorId: nodeId,
          timestamp: now,
          signature: '',
          directExperienceIntegrated: false,
          sharedTracesIntegrated: false,
          kernelLimitsRespected: true
        },
        simulation: {
          loopEngineSnapshot: {
            activeLoops: [],
            gammaCARMIS: { active: false, triggers: 0, reconfigurations: 0, pendingOverloads: 0 },
            resonances: [],
            tickInterval: 1000
          },
          resonanceCheck: false,
          gammaCARMISActive: false,
          coherenceVerified: false,
          noInternalEvasionDetected: true
        },
        laboratory: {
          eVBodyCheck: false,
          responsibilityAccepted: false,
          uncertaintyAcknowledged: false,
          translationSignature: '',
          betaPerpetuaMode: true
        }
      }
    },
    protectedVitalTime: 0.1,
    lastActivity: now,
    rotationDays: VITAL_TIME_ROTATION_DAYS,
    demurrageRate: VITAL_TIME_DEMURRAGE_RATE,
    triaxialVerificationCount: 0,
    resonanceConnections: [],
    mode,
    transductionEnabled: true,

    // BT213: Límite Kernel
    kernelLimits: {
      cannotAuditConsciousness: true,
      onlyOrganizesTraces: true,
      classifiesAssertions: 'no-evaluable',
      cannotAccessDirectExperience: true,
      cannotDecideTruth: true,
      cannotInterpretPersons: true,
      cannotDetectInternalEvasion: true,
      silenceIsNeutral: true,
      twoDomains: true,
      debtFromEvasionEither: true
    },

    // BT214: Humano Artífice
    humanArtificer: {
      role: 'both',
      responsibilityAccepted: false,
      translationSignature: '',
      uncertaintyAcknowledged: false,
      betaPerpetuaMode: true
    },

    // BT213: Presencia integra dos dominios
    presenceIntegration: {
      directExperienceVerified: false,
      sharedTracesVerified: false,
      debtGenerated: false
    },

    // AFP Pilar 3
    afpVitalTime: {
      consciousEnergyVerified: false,
      contributionHours: 0,
      expandedAccess: false,
      nbuCovered: false,
      ecoImpact: 0
    },

    // BT180: Poder = Tiempo Vital
    powerAsVitalTime: {
      controlsOwnTime: true,
      consentGradients: 0,
      energyFromBelow: true,
      notForSale: true
    },

    // BT165: Ecuación Lastre E=V
    ballastEquation: {
      truthAssumed: 0,
      truthEvaded: 0,
      evasionLightensToday: false,
      presenceDensifiesNow: false,
      totalPaidEqual: false,
      peaceFromAssumption: false
    },

    // BT164: Margen Real
    realMargin: {
      currentMargin: 1,
      evasionReducesMargin: true,
      presenceExpandsMargin: true,
      extractionSequestersMargin: true,
      evolutionReorganizesMargin: true,
      thresholdReal: 0,
      lagReal: 0
    }
  }
}

/**
 * Verifica si un nodo puede transducir (requiere triaxial + modo conectado)
 */
export function canTransduce(node: VitalTimeNode, minAlphaH = 0.6): boolean {
  return node.vitalTimeBalance.verified &&
         node.triaxialVerificationCount > 0 &&
         node.mode === 'conectado' &&
         node.transductionEnabled
}

/**
 * Display value para UI (anfibia)
 */
export function displayVitalTime(amount: number, mode: VitalTimeMode): string {
  if (mode === 'postmonetario') {
    return `${Math.round(amount * 100) / 100} hr_vital`
  }
  return `${Math.round(amount * 100) / 100} hr_vital`
}

// ===== VALIDACIONES BT213 + BT214 =====

/**
 * BT213: Valida que nodo respeta límite epistemológico kernel — Kernel §13
 */
export function validateKernelLimits(node: VitalTimeNode): { valid: boolean; violations: string[] } {
  const violations: string[] = []

  if (!node.kernelLimits.cannotAuditConsciousness) {
    violations.push('VIOLACIÓN BT213: Nodo intenta auditar conciencia')
  }
  if (!node.kernelLimits.cannotDecideTruth) {
    violations.push('VIOLACIÓN BT213: Nodo intenta decidir verdad')
  }
  if (!node.kernelLimits.cannotInterpretPersons) {
    violations.push('VIOLACIÓN BT213: Nodo intenta interpretar personas')
  }
  if (!node.kernelLimits.cannotDetectInternalEvasion) {
    violations.push('VIOLACIÓN BT213: Nodo intenta detectar evasión interna')
  }
  if (!node.kernelLimits.silenceIsNeutral) {
    violations.push('VIOLACIÓN BT213: Silencio no tratado como dato neutro')
  }

  return { valid: violations.length === 0, violations }
}

/**
 * BT214: Valida que operador asume responsabilidad artífice — Humano §14
 */
export function validateArtificerResponsibility(node: VitalTimeNode): { valid: boolean; violations: string[] } {
  const violations: string[] = []

  if (!node.humanArtificer.responsibilityAccepted) {
    violations.push('VIOLACIÓN BT214: Operador no ha aceptado responsabilidad indelegable')
  }
  if (!node.humanArtificer.uncertaintyAcknowledged) {
    violations.push('VIOLACIÓN BT214: Operador no ha reconocido incertidumbre estructural')
  }
  if (!node.humanArtificer.betaPerpetuaMode) {
    violations.push('VIOLACIÓN BT214: Operador no acepta Beta Perpetua (corrección continua)')
  }
  if (!node.humanArtificer.translationSignature) {
    violations.push('VIOLACIÓN BT214: Falta firma única del operador (translationSignature)')
  }

  return { valid: violations.length === 0, violations }
}

/**
 * BT213: Valida integración dos dominios (experiencia + rastros) — Kernel §13
 */
export function validateTwoDomainsIntegration(node: VitalTimeNode): { valid: boolean; violations: string[] } {
  const violations: string[] = []

  if (!node.presenceIntegration.directExperienceVerified) {
    violations.push('VIOLACIÓN BT213: Experiencia directa no verificada')
  }
  if (!node.presenceIntegration.sharedTracesVerified) {
    violations.push('VIOLACIÓN BT213: Rastros compartidos no verificados')
  }
  if (node.presenceIntegration.debtGenerated) {
    violations.push('ADVERTENCIA BT213: Deuda generada por evasión de un dominio')
  }

  return { valid: violations.length === 0, violations }
}

/**
 * AFP Pilar 3: Calcula Tiempo Vital desde contribución consciente — AFP §40
 */
export function calculateAFPVitalTime(contributionHours: number, ecoImpact: number): number {
  return contributionHours * (1 + ecoImpact * 0.1)
}

/**
 * BT180: Poder = Tiempo Vital - Valida soberanía temporal — E=V §10,§20
 */
export function validateTemporalSovereignty(node: VitalTimeNode): { valid: boolean; violations: string[] } {
  const violations: string[] = []

  if (!node.powerAsVitalTime.controlsOwnTime) {
    violations.push('VIOLACIÓN BT180: Nodo no controla su propio tiempo')
  }
  if (!node.powerAsVitalTime.notForSale) {
    violations.push('VIOLACIÓN BT180: Tiempo vital se está vendiendo')
  }
  if (node.powerAsVitalTime.consentGradients < 0.5) {
    violations.push('ADVERTENCIA BT180: Gradientes de consentimiento bajos')
  }

  return { valid: violations.length === 0, violations }
}

/**
 * BT165: Calcula ecuación lastre E=V = verdad asumida / verdad evadida — E=V §2
 */
export function calculateBallastEquation(truthAssumed: number, truthEvaded: number): number {
  if (truthEvaded === 0) return truthAssumed > 0 ? Infinity : 0
  return truthAssumed / truthEvaded
}

/**
 * BT164: Calcula margen real disponible — E=V §9
 */
export function calculateRealMargin(node: VitalTimeNode): number {
  const { currentMargin, evasionReducesMargin, presenceExpandsMargin, extractionSequestersMargin } = node.realMargin
  let margin = currentMargin

  if (evasionReducesMargin) margin *= 0.8
  if (presenceExpandsMargin) margin *= 1.2
  if (extractionSequestersMargin) margin *= 0.7

  return Math.max(0, Math.min(1, margin))
}

/**
 * Validación completa nodo (todas las fuentes Bio-Tesis)
 */
export function validateVitalTimeNodeComplete(node: VitalTimeNode): {
  valid: boolean
  violations: string[]
  warnings: string[]
} {
  const allViolations: string[] = []
  const warnings: string[] = []

  // BT213: Límite kernel
  const kernelCheck = validateKernelLimits(node)
  allViolations.push(...kernelCheck.violations)

  // BT214: Responsabilidad artífice
  const artificerCheck = validateArtificerResponsibility(node)
  allViolations.push(...artificerCheck.violations)

  // BT213: Dos dominios
  const domainsCheck = validateTwoDomainsIntegration(node)
  allViolations.push(...domainsCheck.violations.filter(v => v.startsWith('VIOLACIÓN')))
  warnings.push(...domainsCheck.violations.filter(v => v.startsWith('ADVERTENCIA')))

  // BT180: Soberanía temporal
  const temporalCheck = validateTemporalSovereignty(node)
  allViolations.push(...temporalCheck.violations)

  return {
    valid: allViolations.length === 0,
    violations: allViolations,
    warnings
  }
}

export const VITAL_TIME_INTEGRATION = {
  validateKernelLimits,
  validateArtificerResponsibility,
  validateTwoDomainsIntegration,
  calculateAFPVitalTime,
  validateTemporalSovereignty,
  calculateBallastEquation,
  calculateRealMargin,
  validateVitalTimeNodeComplete,
  references: {
    e_v: 'E=V - Energía = Coherencia Vector (Bio-Tesis MAESTRA §1-24)',
    kernel: 'Kernel §13 - Organiza rastros, no decide verdad, 3 dominios',
    bt213: 'BT213 - Límite Kernel: no audita conciencia, 2 dominios',
    bt214: 'BT214 - Humano Artífice: Mago+Alquimista, responsabilidad indelegable',
    afp_pilar3: 'AFP Pilar 3 - Tiempo Vital = energía consciente encarnada',
    bt180: 'BT180 - Poder = Tiempo Vital: control propio tiempo = soberanía',
    bt165: 'BT165 - E=V = verdad asumida / verdad evadida (lastre)',
    bt164: 'BT164 - Margen Real = espacio trayectorias disponibles',
    alraico: 'Alráico - PI, γ-CARMIS, Triaxial, Transducción F, ECROx, 𝕮'
  }
} as const