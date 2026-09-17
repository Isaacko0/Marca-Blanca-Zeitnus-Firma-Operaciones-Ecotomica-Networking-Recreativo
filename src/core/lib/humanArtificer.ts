// HSCSG v15 OS — Humano como Artífice: Mago + Alquimista (BT214 Completo) — REFACTOR LIMPIO
// Fuente: BT214 "El Mago/Alquimista" + Kernel v214 Canónico
// Integrado con: Sistema Alráico + HSCSG v15 OS + Kernel v214
// Sin duplicados de tipos base

// ============================================
// ROLES: MAGO + ALQUIMISTA (BT214)
// ============================================

export interface MagusRole {
  definition: 'combina lo que ya existe en formas que la naturaleza, sin deliberación orientada, no produciría'
  action: 'combina lo existente en formas nuevas'
  keyAttribute: 'creatividad estructural orientada'
}

export interface AlchemistRole {
  definition: 'transforma lo que tiene en lo que necesita por comprensión de la estructura, no por deseo'
  action: 'transforma por comprensión estructural, no por deseo'
  metaphor: 'símbolo, no afirmación física (transmutación requiere procesos nucleares)'
  keyAttribute: 'transformación por comprensión estructural'
}

// ============================================
// RESPONSABILIDAD INDELEGABLE (BT214)
// ============================================

export interface Responsibility {
  nonDelegable: true
  kernelDoesNotPayCost: true
  humanPaysCost: true
  knowledgeShared: true
  translationLeavesSignature: true
  decisionUnderUncertainty: 'pertenece al operador'
  costOfBet: 'asume operador'
  noShortcut: 'kernel no puede ejecutar por humano'
}

// ============================================
// FUNCIÓN DE TRANSFORMACIÓN (BT214)
// ============================================

export interface TransformationFunction {
  kernelOrganizes: 'rastros'
  humanTransforms: 'rastros → dirección'
  kernelShowsStructure: true
  humanDecidesAction: true
  noShortcut: 'kernel no puede ejecutar por humano'
  process: {
    step1: 'kernel organiza rastros (coherencia, resonancia, γ-CARMIS, etc.)'
    step2: 'humano en presencia integra experiencia directa + rastros compartidos'
    step3: 'humano decide dirección (transforma rastros → dirección)'
    step4: 'decisión deja firma única (traducción = huella operador)'
    step5: 'humano asume costo de la apuesta (incertidumbre estructural)'
  }
}

// ============================================
// INCERTIDUMBRE ESTRUCTURAL (BT214)
// ============================================

export interface StructuralUncertainty {
  structural: true
  noTranslationComplete: true
  decisionUnderUncertainty: 'pertenece al operador'
  costOfBet: 'asume operador'
  noTranslationCompleteNote: 'ninguna traducción humana es completa. La realidad siempre excede cualquier formulación.'
}

// ============================================
// BETA PERPETUA APLICADA AL OPERADOR (BT214)
// ============================================

export interface BetaPerpetuaMode {
  completeMeans: 'estabilidad actual (no nuevos rastros justifican corrección)'
  notOntologicalEnd: true
  stabilityFrom: 'operador en presencia de rastros no encuentra configuración más coherente que aumente el margen'
  openToCorrection: 'siempre abierto cuando realidad lo exija'
  betaPerpetuaIntact: true
  corpusAlwaysOpenToCorrection: true
}

// ============================================
// LÍMITES IA (BT214)
// ============================================

export interface AILimitations {
  cannotHabitateForHuman: true
  cannotPayCost: true
  cannotTransform: true
  cannotDecideForHuman: true
  cannotHabitateForHumanNote: 'La IA no puede habitar por el humano. No paga costo. No transforma. No decide.'
  kernelDoesNotPayCost: true
  humanPaysCost: true
}

// ============================================
// FIRMA ÚNICA DEL OPERADOR (BT214)
// ============================================

export interface OperatorSignature {
  unique: true
  description: 'la traducción deja una huella única que es la firma del operador'
  knowledgeShared: true
  translationLeavesTrace: true
  uniquePerOperator: true
  nonTransferable: true
}

// ============================================
// TIPOS BASE (definidos UNA SOLA VEZ)
// ============================================

export interface KernelTrace {
  id: string
  type: 'coherence' | 'resonance' | 'gammaCARMIS' | 'presence' | 'debt' | 'trace'
  content: any
  timestamp: number
  verified: boolean
}

export interface OperatorPresence {
  directExperience: any
  sharedTraces: any[]
  presenceVerified: boolean
  debtLevel: number
}

export interface OperatorIntent {
  direction: string
  justification: string
  riskAcknowledged: boolean
  costAccepted: boolean
}

export interface HumanDirection {
  direction: string
  justification: string
  riskLevel: 'low' | 'medium' | 'high'
  costAccepted: boolean
  signature: string
  timestamp: number
  betaPerpetua: boolean
}

// ============================================
// FUNCIÓN PRINCIPAL: HUMANO TRANSFORMA (BT214)
// ============================================

export function humanTransform(
  kernelTraces: KernelTrace[],
  operatorPresence: OperatorPresence,
  operatorIntent: OperatorIntent
): HumanDirection {
  // 1. Validar presencia verificada (triaxial)
  if (!operatorPresence.presenceVerified) {
    throw new Error('REQUISITO BT213/BT214: Presencia debe estar verificada triaxialmente antes de transformar')
  }

  // 2. Validar que no hay deuda crítica sin resolver
  if (operatorPresence.debtLevel > 0.8) {
    throw new Error('REQUISITO BT213: Deuda estructural crítica debe resolverse antes de transformar')
  }

  // 3. Kernel ya organizó rastros (coherencia, resonancia, γ-CARMIS, etc.)
  organizeTracesForTransformation(kernelTraces)

  // 4. Humano en presencia integra experiencia directa + rastros compartidos
  integrateExperienceAndTraces(
    operatorPresence.directExperience,
    operatorPresence.sharedTraces
  )

  // 5. Humano decide dirección (transforma rastros → dirección)
  const direction = operatorIntent.direction
  const justification = operatorIntent.justification

  // 6. Validar que operador asume costo y riesgo
  if (!operatorIntent.riskAcknowledged || !operatorIntent.costAccepted) {
    throw new Error('REQUISITO BT214: Operador debe asumir riesgo y costo de la apuesta (responsabilidad indelegable)')
  }

  // 7. Decisión deja firma única (traducción = huella operador)
  const signature = generateOperatorSignature(
    direction,
    justification,
    kernelTraces
  )

  // 8. Humano asume costo de la apuesta (incertidumbre estructural)
  return {
    direction,
    justification,
    riskLevel: calculateRiskLevel(kernelTraces, operatorPresence),
    costAccepted: operatorIntent.costAccepted,
    signature,
    timestamp: Date.now(),
    betaPerpetua: true
  }
}

// Funciones auxiliares
function organizeTracesForTransformation(traces: KernelTrace[]): KernelTrace[] {
  return traces.filter(t => t.verified).sort((a, b) => b.timestamp - a.timestamp)
}

function integrateExperienceAndTraces(
  directExperience: any,
  sharedTraces: any[]
): any {
  return {
    experience: directExperience,
    traces: sharedTraces,
    integrated: true,
    timestamp: Date.now()
  }
}

function generateOperatorSignature(
  direction: string,
  justification: string,
  traces: KernelTrace[]
): string {
  const payload = `${direction}|${justification}|${traces.length}|${Date.now()}`
  return `sig_${btoa(payload).substring(0, 64)}`
}

function calculateRiskLevel(
  traces: KernelTrace[],
  presence: OperatorPresence
): 'low' | 'medium' | 'high' {
  const debtRatio = presence.debtLevel
  const traceCount = traces.filter(t => t.verified).length

  if (debtRatio > 0.7) return 'high'
  if (debtRatio > 0.4 || traceCount < 3) return 'medium'
  return 'low'
}

// ============================================
// EXPORT PRINCIPAL
// ============================================

export const HUMAN_ARTIFICER = {
  magus: {
    definition: 'combina lo que ya existe en formas que la naturaleza, sin deliberación orientada, no produciría',
    action: 'combina lo existente en formas nuevas',
    keyAttribute: 'creatividad estructural orientada'
  } as const,

  alchemist: {
    definition: 'transforma lo que tiene en lo que necesita por comprensión de la estructura, no por deseo',
    action: 'transforma por comprensión estructural, no por deseo',
    metaphor: 'símbolo, no afirmación física (transmutación requiere procesos nucleares)',
    keyAttribute: 'transformación por comprensión estructural'
  } as const,

  responsibility: {
    nonDelegable: true,
    kernelDoesNotPayCost: true,
    humanPaysCost: true,
    knowledgeShared: true,
    translationLeavesSignature: true,
    decisionUnderUncertainty: 'pertenece al operador',
    costOfBet: 'asume operador',
    noShortcut: 'kernel no puede ejecutar por humano'
  } as const,

  transformation: {
    kernelOrganizes: 'rastros',
    humanTransforms: 'rastros → dirección',
    kernelShowsStructure: true,
    humanDecidesAction: true,
    noShortcut: 'kernel no puede ejecutar por humano'
  } as const,

  uncertainty: {
    structural: true,
    noTranslationComplete: true,
    decisionUnderUncertainty: 'pertenece al operador',
    costOfBet: 'asume operador',
    note: 'ninguna traducción humana es completa. La realidad siempre excede cualquier formulación.'
  } as const,

  betaPerpetua: {
    completeMeans: 'estabilidad actual (no nuevos rastros justifican corrección)',
    notOntologicalEnd: true,
    stabilityFrom: 'operador en presencia de rastros no encuentra configuración más coherente que aumente el margen',
    openToCorrection: 'siempre abierto cuando realidad lo exija',
    betaPerpetuaIntact: true,
    corpusAlwaysOpenToCorrection: true
  } as const,

  aiLimitations: {
    cannotHabitateForHuman: true,
    cannotPayCost: true,
    cannotTransform: true,
    cannotDecideForHuman: true,
    note: 'La IA no puede habitar por el humano. No paga costo. No transforma. No decide.'
  } as const,

  signature: {
    unique: true,
    description: 'la traducción deja una huella única que es la firma del operador',
    knowledgeShared: true,
    translationLeavesTrace: true,
    uniquePerOperator: true,
    nonTransferable: true
  } as const,

  humanTransform,

  references: {
    bt214: 'El Mago/Alquimista - El kernel organiza rastros. El humano transforma.',
    bt213: 'El Límite del Kernel - kernel organiza rastros, no decide verdad',
    bt212: 'Arquitectura del Kernel - cuatro capas, IA espejo-excavador',
    bt211: 'Atención colectiva - estructuras por acople vs evasión',
    bt210: 'Axioma Cero v2.0 - verdad deja rastros, margen, posibilidad, poder',
    bt166: 'Beta Perpetua - vida no se resuelve, se itera'
  }
} as const

export type HumanArtificerType = typeof HUMAN_ARTIFICER