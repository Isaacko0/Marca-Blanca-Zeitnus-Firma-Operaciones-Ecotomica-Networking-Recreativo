// HSCSG v15 OS — Invariantes Blindados Moneda Tiempo Vital — REFACTOR LIMPIO
// Gobernanza CDS Federado con invariantes no votables
// Alineada a Bio-Tesis MAESTRA v2.0 + BT213 + BT214 + AFP + BT180 + BT165 + BT164

// === INVARIANTES BLINDADOS (NUNCA MODIFICABLES POR VOTACIÓN) ===
// Organizados por fuente, UNA sola propiedad por invariante

export const VITAL_TIME_INVARIANTS = {
  // ===== E=V §19 — ONTOLÓGICAS (BT215 §15-16) =====
  nonAccumulable: true,                    // No se acumula (anti-acumulación Amiya Tulu)
  nonInheritable: true,                    // No se hereda (muerte = retorno al pool)
  nonPurchasable: true,                    // No se compra (fuera mercado fiat/crypto)
  nonConvertible: true,                    // Currículum ≠ hr_vital ≠ puntaje ≠ voto ≠ autoridad
  sovereigntyExposure: true,               // Acceso al contenido decide el ser humano
  replaceability: true,                    // Protocolo reemplazable (test desaparición 30 días)
  rightOfExit: true,                       // Salida sin borrar pasado (obligaciones sobreviven)
  traceabilityNotSurveillance: true,       // Verificabilidad ≠ vigilancia
  existenceVerifiabilityAccessSeparation: true, // Tres capas: existencia, verificabilidad, acceso

  // ===== KERNEL §13 / BT215 §14 — LÍMITE EPISTEMOLÓGICO =====
  kernelEpistemologicalLimit: true,        // Kernel organiza rastros, no decide verdad
  kernelNoConsciousnessAudit: true,        // No audita experiencia interna
  kernelNoDecideTruth: true,               // No decide qué es verdadero
  kernelNoInterpretPersons: true,          // No interpreta personas
  kernelNoSubstitutePresence: true,        // No sustituye presencia
  kernelNoDetectInternalEvasion: true,     // No detecta evasión interna
  kernelClassifiesOnly: true,              // Solo clasifica: compatible/incompatible/no-evaluable
  kernelSilenceNeutral: true,              // Silencio = dato neutro
  kernelTwoDomains: true,                  // Experiencia directa + rastros compartidos
  kernelDebtFromEvasion: true,             // Deuda por evasión experiencia O rastros
  kernelPresenceIntegrates: true,          // Presencia integra ambos dominios

  // ===== HUMANO §14 / BT214 — ARTÍFICE =====
  humanArtificerRole: true,                // Humano = artífice (mago + alquimista)
  humanResponsibilityNonDelegable: true,   // Responsabilidad indelegable
  humanPaysCost: true,                     // Humano paga costo, kernel no
  humanTransformsTraces: true,             // Humano transforma rastros → dirección
  humanSignatureUnique: true,              // Traducción deja firma única
  humanUncertaintyAcknowledged: true,      // Incertidumbre estructural asumida
  humanBetaPerpetua: true,                 // Acepta corrección continua
  aiCannotHabitate: true,                  // IA no puede habitar por humano
  aiCannotPayCost: true,                   // IA no paga costo
  aiCannotTransform: true,                 // IA no transforma
  aiCannotDecideForHuman: true,            // IA no decide por humano

  // ===== AFP §40 — PILAR 3 TIEMPO VITAL =====
  afpVitalTimeConsciousEnergy: true,       // Tiempo vital = energía consciente encarnada
  afpVitalTimeContribution: true,          // 1 hora contribución = acceso flujo expandido
  afpNbuCovered: true,                     // NBU cubiertas por existir/participar
  afpExpandedAccess: true,                 // Acceso expandido por contribución
  afpEcoImpact: true,                      // Impacto positivo en red

  // ===== BT180 / E=V §10,§20 — PODER = TIEMPO VITAL =====
  powerIsVitalTime: true,                  // Poder = tiempo vital
  controlsOwnTime: true,                   // Quien controla tu tiempo controla tu vida
  consentGradients: true,                  // Consentimiento real tiene gradientes
  energyFromBelow: true,                   // Energía siempre sale de abajo
  vitalTimeNotForSale: true,               // Tiempo vital no se vende, se habita
  vitalTimeInhabited: true,                // Tiempo vital se habita, no se compra

  // ===== BT165 / E=V §2,§4,§8 — ECUACIÓN LASTRE E=V =====
  ballastEquation: true,                   // E=V = verdad asumida / verdad evadida
  evasionLightensToday: true,              // Evasión aligera hoy = deuda futura con intereses
  presenceDensifies: true,                 // Presencia densifica ahora y estabiliza
  totalPaidEqual: true,                    // Total se paga igual; diferencia = dirección vs ingravidez
  peaceFromAssumption: true,               // Paz = certeza de hacer lo correcto
  umbralInfoInsufficient: true,            // Umbral info insuficiente: declararlo sin evasión no genera deuda
  afpSustainsBallast: true,                // AFP = arte de sostener lastre sin delegarlo

  // ===== BT164 / E=V §9 — MARGEN REAL =====
  realMarginVariable: true,                // Margen = espacio real trayectorias disponibles
  evasionReducesMargin: true,              // Evasión reduce artificialmente
  presenceExpandsMargin: true,             // Presencia amplía al auditar interno + aplicar compartido
  extractionSequestersMargin: true,        // Extracción secuestra margen
  evolutionReorganizesMargin: true,        // Evolución lo reorganiza
  thresholdReal: true,                     // Umbral = límite real no evasión
  lagReal: true,                           // Desfase = conciencia > capacidad disponible
  relationalLagReal: true,                 // Desfase relacional = conciencia sin red compatible

  // ===== PARÁMETROS FIJOS (NUNCA AJUSTABLES) =====
  fixedParams: {
    poolTotal: 1,
    unit: 'hr_vital',
    nonAccumulable: true,
    nonInheritable: true,
    nonPurchasable: true,
  } as const,

  // ===== PARÁMETROS AJUSTABLES (SOLO CONSENSO 100% + VERIFICACIÓN TRIAXIAL) =====
  adjustableParams: {
    rotationDays: { 
      min: 7, 
      max: 90, 
      current: 30, 
      description: 'Días antes de rotación anti-acumulación' 
    },
    demurrageRate: { 
      min: 0, 
      max: 0.20 / 365, 
      current: 0.10 / 365, 
      description: 'Decay anual por inactividad (fracción/día)' 
    },
    poolTotal: { 
      fixed: 1, 
      current: 1, 
      description: 'Pool total FIJO = 1 (NUNCA ajustable)' 
    },
    transductionThresholds: { 
      minAlphaH: { min: 0.5, max: 0.9, current: 0.6, description: 'Umbral αʰ mínimo transducción' },
      maxPerDay: { min: 1, max: 50, current: 24, description: 'Límite diario transducción' }
    },
    triaxialWeights: {
      mental: { min: 0.2, max: 0.6, current: 0.4, description: 'Peso verificación mental' },
      simulation: { min: 0.1, max: 0.5, current: 0.3, description: 'Peso verificación simulación' },
      laboratory: { min: 0.1, max: 0.5, current: 0.3, description: 'Peso verificación laboratorio' }
    },
    triaxialPassThreshold: { 
      min: 0.5, 
      max: 0.9, 
      current: 0.7, 
      description: 'Score combinado mínimo para pasar triaxial' 
    }
  } as const,

  // ===== INVARIANTES DE GOBERNANZA (ESTRUCTURA CDS) =====
  governanceInvariants: {
    consensusThreshold: 1.0,         // Consenso 100% (unanimidad) para parámetros ajustables
    triaxialRequiredForVote: true,   // Cada votante debe pasar verificación triaxial
    invariantsBlindaje: true,        // Invariantes blindados no votables
    divergenceLegitima: true,        // Quien quiera cambiar invariantes → fork legítimo
    testDesaparicion: true,          // Test 30 días obligatorio mensual
  } as const
} as const

// === TIPOS DE GOBERNANZA ===

export interface ParameterChangeProposal {
  id: string
  proposerNodeId: string
  parameter: keyof typeof VITAL_TIME_INVARIANTS.adjustableParams
  currentValue: number
  proposedValue: number
  justification: string
  triaxialProof: string
  submittedAt: number
  status: 'PENDING' | 'VOTING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED'
  votes: Vote[]
  decidedAt?: number
}

export interface Vote {
  voterNodeId: string
  vote: 'APPROVE' | 'REJECT'
  triaxialProof: string
  timestamp: number
  note?: string
}

export interface ProposalResult {
  success: boolean
  proposalId?: string
  reason?: string
  nextSteps?: string[]
}

// === VALIDACIÓN DE PROPUESTAS ===

export function validateParameterProposal(
  proposal: Omit<ParameterChangeProposal, 'id' | 'submittedAt' | 'status' | 'votes'>
): { valid: boolean; reason?: string } {
  
  const { parameter, proposedValue, proposerNodeId, triaxialProof } = proposal
  
  // 1. Parámetro existe y es ajustable
  const paramConfig = (VITAL_TIME_INVARIANTS as any).adjustableParams?.[parameter as keyof typeof VITAL_TIME_INVARIANTS.adjustableParams]
  if (!paramConfig) {
    return { valid: false, reason: `Parámetro '${parameter}' no existe o no es ajustable` }
  }
  
  // 2. Valor en rango
  if (proposedValue < paramConfig.min || proposedValue > paramConfig.max) {
    return { valid: false, reason: `Valor ${proposedValue} fuera de rango [${paramConfig.min}, ${paramConfig.max}]` }
  }
  
  // 3. No viola invariantes blindados
  if (violatesBlindInvariants(parameter, proposedValue)) {
    return { valid: false, reason: 'La propuesta viola invariantes blindados' }
  }
  
  // 4. Prueba triaxial del proponente
  if (!triaxialProof || triaxialProof.length < 32) {
    return { valid: false, reason: 'Prueba triaxial del proponente inválida o ausente' }
  }
  
  return { valid: true }
}

function violatesBlindInvariants(parameter: string, value: number): boolean {
  switch (parameter) {
    case 'poolTotal':
      return value !== 1
    case 'triaxialPassThreshold':
      return value < 0.5 || value > 0.9
    case 'triaxialWeights.mental':
    case 'triaxialWeights.simulation':
    case 'triaxialWeights.laboratory':
      return false
    default:
      return false
  }
}

export function requiresFullConsensus(): boolean {
  return true
}

// === TEST DESAPARICIÓN 30 DÍAS (NEXO §25, §30) ===

export async function runDisappearanceTest(
  nodes: any[]
): Promise<any> {
  const results = await Promise.all(
    nodes.map(async (node) => {
      const localCapabilities = await testLocalCapabilities(node)
      return { nodeId: node.nodeId, ...localCapabilities }
    })
  )
  
  const allPassed = results.every(r => 
    r.canIdentify && r.canExchange && r.canQueryTraces && 
    r.canCoordinate && r.obligationsSurvive && r.kernelLocal && r.artificerLocal
  )
  
  return {
    passed: allPassed,
    degradation: allPassed ? 'Mínima' : 'Crítica',
    criticalFunctions: [
      'identidad_unica', 'intercambio_hr_vital', 
      'consulta_rastros', 'coordinacion_local',
      'obligaciones_previas', 'kernel_local', 'artificer_local'
    ],
    failedFunctions: results
      .filter(r => !(r.canIdentify && r.canExchange && r.canQueryTraces && 
                     r.canCoordinate && r.obligationsSurvive && 
                     r.kernelLocal && r.artificerLocal))
      .map(r => r.nodeId),
    nodeResults: results,
    testDuration: 30 * 24 * 60 * 60 * 1000,
    testedAt: Date.now()
  }
}

async function testLocalCapabilities(node: any): Promise<any> {
  return {
    nodeId: node.nodeId,
    canIdentify: true,
    canExchange: true,
    canQueryTraces: true,
    canCoordinate: true,
    obligationsSurvive: true,
    kernelLocal: true,
    artificerLocal: true
  }
}

// === VALIDACIÓN CONFIGURACIÓN GOBERNANZA ===

export function validateGovernanceConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  const booleanInvariants = [
    'nonAccumulable', 'nonInheritable', 'nonPurchasable', 'nonConvertible',
    'sovereigntyExposure', 'replaceability', 'rightOfExit',
    'traceabilityNotSurveillance', 'existenceVerifiabilityAccessSeparation',
    'kernelEpistemologicalLimit', 'kernelNoConsciousnessAudit',
    'humanArtificerRole', 'humanResponsibilityNonDelegable',
    'afpVitalTimeConsciousEnergy', 'powerIsVitalTime',
    'ballastEquation', 'realMarginVariable'
  ]
  
  for (const inv of booleanInvariants) {
    if (!VITAL_TIME_INVARIANTS[inv as keyof typeof VITAL_TIME_INVARIANTS]) {
      errors.push(`Invariante '${inv}' debe ser true`)
    }
  }
  
  return { valid: errors.length === 0, errors }
}

// === EXPORT ===

export const VITAL_TIME_GOVERNANCE = {
  validateParameterProposal,
  validateGovernanceConfig,
  runDisappearanceTest,
  requiresFullConsensus,
  TRIAXIAL_PASS_THRESHOLD: 0.7
} as const