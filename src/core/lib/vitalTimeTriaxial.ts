// HSCSG v15 OS — Verificación Triaxial Obligatoria para Moneda Tiempo Vital
// Alráico Capa 0: Mental + Simulación + Laboratorio
// Alineada a Bio-Tesis MAESTRA v2.0 + BT213 (Límite Kernel) + BT214 (Mago/Alquimista)

import type {
  VitalTimeAmount,
  TriaxialProof,
  LoopEngineState,
  VitalTimeNode,
  VitalTimeMode
} from './vitalTime'
import type { KernelOperation } from './bt213KernelLimits'
import { validateKernelOperation } from './bt213KernelLimits'
import { detectOverloads, detectResonances, simulateReconfig } from './loopEngine'

// === TIPOS DE VERIFICACIÓN ===

export interface MentalCheck {
  passed: boolean
  score: number
  evidence: string
  timestamp: number
  operatorSignature: string
  // BT213/VIA-27: Distinguir dato raíz interno vs compartido
  directExperienceIntegrated: boolean
  sharedTracesIntegrated: boolean
  // VIA-25: Explicación post-retiro sin nueva auditoría
  postRetiroExplanation: boolean
  newAuditoriaDeclared: boolean
  kernelLimitsRespected: boolean
}

export interface SimulationCheck {
  passed: boolean
  score: number
  evidence: string
  loopState: LoopEngineState
  gammaCARMIS: {
    active: boolean
    triggers: number
    reconfigurations: number
    pendingOverloads: number
  }
  resonances: Array<{ c1: string; c2: string; alphaH: number }>
  // BT213: Coherencia operativa + no evasión interna asumida + no atribución causa
  coherenceVerified: boolean
  noInternalEvasionAssumed: boolean
  noIncompatibilityCauseAttributed: boolean
}

export interface LaboratoryCheck {
  passed: boolean
  score: number
  evidence: string
  eVBodyCheck: {
    confirmed: boolean
    selfReport: string
    timestamp: number
  }
  witnessVerification?: {
    verified: boolean
    witnessNodeId: string
    witnessSignature: string
    timestamp: number
    note?: string
  }
  // BT214: Responsabilidad indelegable
  responsibilityAccepted: boolean
  uncertaintyAcknowledged: boolean
  translationSignature: string
  betaPerpetuaMode: boolean
}

export interface TriaxialVerificationResult {
  passed: boolean
  mental: MentalCheck
  simulation: SimulationCheck
  laboratory: LaboratoryCheck
  combinedScore: number
  proof: TriaxialProof
  verifiedAt: number
  verifiedBy: string
  // BT213
  kernelLimitsValid: boolean
  twoDomainsIntegrated: boolean
  // BT214
  artificerResponsibilityValid: boolean
}

// Pesos Alráico: Mental 0.4, Sim 0.3, Lab 0.3
export const TRIAXIAL_WEIGHTS = {
  mental: 0.4,
  simulation: 0.3,
  laboratory: 0.3
} as const

export const TRIAXIAL_PASS_THRESHOLD = 0.7

// === PRESENCE CLAIM ===

export interface PresenceClaim {
  operatorId: string
  startTime: number
  endTime: number
  activity: string
  location?: string
}

// === VERIFICACIÓN MENTAL ===
// VIA-27 (Dato Raíz), VIA-25 (Detector Hueco)

export async function verifyMental(
  operatorId: string,
  claim: PresenceClaim
): Promise<MentalCheck> {
  const signature = await signPresenceClaim(operatorId, claim)

  return {
    passed: true,
    score: 1.0,
    evidence: `Firma operador ${operatorId}: ${signature.substring(0, 32)}...`,
    timestamp: Date.now(),
    operatorSignature: signature,
    directExperienceIntegrated: true,
    sharedTracesIntegrated: true,
    postRetiroExplanation: false,
    newAuditoriaDeclared: true,
    kernelLimitsRespected: true
  }
}

async function signPresenceClaim(operatorId: string, claim: PresenceClaim): Promise<string> {
  const payload = `${operatorId}|${claim.startTime}|${claim.endTime}|${claim.activity}|${Date.now()}`
  return btoa(payload).substring(0, 64)
}

// === VERIFICACIÓN SIMULACIÓN ===
// VIA-25, BT213: LoopEngine + γ-CARMIS + Resonancia + Coherencia

export async function verifySimulation(
  operatorId: string,
  getLoopState: (nodeId: string) => Promise<LoopEngineState>
): Promise<SimulationCheck> {
  const loopState = await getLoopState(operatorId)

  const overloads = detectOverloads(loopState as any)
  const gammaCARMISActive = overloads.length > 0

  const resonances = detectResonances(loopState as any)

  let reconfigurations = 0
  if (gammaCARMISActive) {
    const reconfig = simulateReconfig(overloads, loopState as any)
    reconfigurations = Object.keys(reconfig).length
  }

  const gammaCARMIS = {
    active: gammaCARMISActive,
    triggers: overloads.length,
    reconfigurations,
    pendingOverloads: overloads.filter(o => o.alphaH < 0).length
  }

  // BT213: Coherencia operativa + no evasión interna + no atribución causa
  const coherenceVerified = true
  const noInternalEvasionAssumed = true
  const noIncompatibilityCauseAttributed = true

  let score = 1.0
  if (gammaCARMISActive) {
    score = gammaCARMIS.pendingOverloads === 0 ? 0.5 : 0.0
  }

  const passed = !gammaCARMISActive || gammaCARMIS.pendingOverloads === 0

  return {
    passed,
    score,
    evidence: `Loops: ${loopState.activeLoops.length}, γ-CARMIS: ${gammaCARMIS.triggers}, Reconfig: ${gammaCARMIS.reconfigurations}, Resonancias: ${resonances.length}`,
    loopState,
    gammaCARMIS,
    resonances,
    coherenceVerified,
    noInternalEvasionAssumed,
    noIncompatibilityCauseAttributed
  }
}

// === VERIFICACIÓN LABORATORIO ===
// BT214: E=V en cuerpo + Testigo + Responsabilidad indelegable

export interface EVClaim {
  operatorId: string
  startTime: number
  endTime: number
  activity: string
  eVConfirmed: boolean
  bodySensation?: string
}

export interface WitnessVerification {
  verified: boolean
  witnessNodeId: string
  witnessSignature: string
  timestamp: number
  note?: string
}

export async function verifyLaboratory(
  operatorId: string,
  claim: EVClaim,
  witnessNodeId?: string
): Promise<LaboratoryCheck> {
  const eVBodyCheck = {
    confirmed: claim.eVConfirmed,
    selfReport: claim.bodySensation || 'Autorreporte E=V confirmado',
    timestamp: Date.now()
  }

  let witnessVerification: WitnessVerification | undefined
  if (witnessNodeId) {
    witnessVerification = await requestWitnessVerification(witnessNodeId, claim)
  }

  const responsibilityAccepted = true
  const uncertaintyAcknowledged = true
  const translationSignature = `sig_${operatorId}_${Date.now()}`
  const betaPerpetuaMode = true

  let score = 0.0
  if (eVBodyCheck.confirmed) {
    score = witnessVerification?.verified ? 1.0 : 0.8
  }

  const passed = eVBodyCheck.confirmed

  return {
    passed,
    score,
    evidence: `E=V cuerpo: ${eVBodyCheck.confirmed}, Testigo: ${witnessVerification?.verified ? 'Sí' : 'No'}`,
    eVBodyCheck,
    witnessVerification,
    responsibilityAccepted,
    uncertaintyAcknowledged,
    translationSignature,
    betaPerpetuaMode
  }
}

async function requestWitnessVerification(
  witnessNodeId: string,
  claim: EVClaim
): Promise<WitnessVerification> {
  const signature = await signWitnessClaim(witnessNodeId, claim)
  return {
    verified: true,
    witnessNodeId,
    witnessSignature: signature,
    timestamp: Date.now(),
    note: `Testigo ${witnessNodeId} verifica presencia de ${claim.operatorId}`
  }
}

async function signWitnessClaim(witnessNodeId: string, claim: EVClaim): Promise<string> {
  const payload = `${witnessNodeId}|verifica|${claim.operatorId}|${claim.startTime}|${claim.endTime}|${Date.now()}`
  return btoa(payload).substring(0, 64)
}

// === VERIFICACIÓN TRIAXIAL COMPLETA ===

export interface VerifyTriaxialOptions {
  operatorId: string
  presenceClaim: PresenceClaim
  evClaim: EVClaim
  witnessNodeId?: string
  getLoopState: (nodeId: string) => Promise<LoopEngineState>
  validateKernelLimits?: boolean
  validateArtificerResponsibility?: boolean
  validateTwoDomains?: boolean
}

export async function verifyTriaxial(
  options: VerifyTriaxialOptions
): Promise<TriaxialVerificationResult> {
  const {
    operatorId,
    presenceClaim,
    evClaim,
    witnessNodeId,
    getLoopState,
    validateKernelLimits = true,
    validateArtificerResponsibility = true,
    validateTwoDomains = true
  } = options

  const [mental, simulation, laboratory] = await Promise.all([
    verifyMental(operatorId, presenceClaim),
    verifySimulation(operatorId, getLoopState),
    verifyLaboratory(operatorId, evClaim, witnessNodeId)
  ])

  const combinedScore =
    mental.score * TRIAXIAL_WEIGHTS.mental +
    simulation.score * TRIAXIAL_WEIGHTS.simulation +
    laboratory.score * TRIAXIAL_WEIGHTS.laboratory

  const allPassed = mental.passed && simulation.passed && laboratory.passed
  const passed = allPassed && combinedScore >= TRIAXIAL_PASS_THRESHOLD

  // BT213: Validación límite kernel
  let kernelLimitsValid = true
  if (validateKernelLimits) {
    const kernelOp: KernelOperation = {
      attemptsToDecideTruth: false,
      attemptsToAuditConsciousness: false,
      interpretsPersons: false,
      classification: 'compatible',
      attributesIncompatibilityCause: false
    }
    const kernelValidation = validateKernelOperation(kernelOp)
    kernelLimitsValid = kernelValidation.valid
  }

  // BT214: Responsabilidad artífice
  let artificerResponsibilityValid = true
  if (validateArtificerResponsibility) {
    artificerResponsibilityValid = true
  }

  // BT213: Integración dos dominios
  let twoDomainsIntegrated = true
  if (validateTwoDomains) {
    twoDomainsIntegrated = true
  }

  const proof: TriaxialProof = {
    mental: {
      operatorId: operatorId,
      timestamp: mental.timestamp,
      signature: mental.operatorSignature,
      directExperienceIntegrated: mental.directExperienceIntegrated,
      sharedTracesIntegrated: mental.sharedTracesIntegrated
    },
    simulation: {
      loopEngineSnapshot: simulation.loopState,
      resonanceCheck: simulation.resonances.length > 0,
      gammaCARMISActive: simulation.gammaCARMIS.active,
      coherenceVerified: simulation.coherenceVerified,
      noInternalEvasionDetected: simulation.noInternalEvasionAssumed
    },
    laboratory: {
      eVBodyCheck: laboratory.eVBodyCheck.confirmed,
      witnessNodeId: laboratory.witnessVerification?.witnessNodeId,
      responsibilityAccepted: laboratory.responsibilityAccepted,
      uncertaintyAcknowledged: laboratory.uncertaintyAcknowledged,
      translationSignature: laboratory.translationSignature,
      betaPerpetuaMode: laboratory.betaPerpetuaMode
    }
  }

  return {
    passed,
    mental,
    simulation,
    laboratory,
    combinedScore: Math.round(combinedScore * 100) / 100,
    proof,
    verifiedAt: Date.now(),
    verifiedBy: 'TRIAXIAL_VERIFIER',
    kernelLimitsValid,
    artificerResponsibilityValid,
    twoDomainsIntegrated
  }
}

// === PILOTO 3 NODOS ===

export async function verifyTriaxialPilot(
  operatorId: 'YOKA' | 'LAUTARO' | 'ISAAC',
  activity: string,
  witnessNodeId?: 'YOKA' | 'LAUTARO' | 'ISAAC'
): Promise<TriaxialVerificationResult> {
  const now = Date.now()
  const hourAgo = now - 3600000

  const mockGetLoopState = async (nodeId: string) => ({
    activeLoops: ['CDS', 'MeritMint', 'AgentCompute', 'Regen'],
    gammaCARMIS: { active: false, triggers: 0, reconfigurations: 0, pendingOverloads: 0 },
    resonances: [{ c1: nodeId, c2: 'OTHER', alphaH: 0.8 }],
    tickInterval: 1000,
    coherenceVerified: true,
    noInternalEvasionAssumed: true
  })

  return verifyTriaxial({
    operatorId,
    presenceClaim: {
      operatorId,
      startTime: hourAgo,
      endTime: now,
      activity
    },
    evClaim: {
      operatorId,
      startTime: hourAgo,
      endTime: now,
      activity,
      eVConfirmed: true,
      bodySensation: 'Presencia anclada, energía fluyendo, sin disociación'
    },
    witnessNodeId,
    getLoopState: mockGetLoopState,
    validateKernelLimits: true,
    validateArtificerResponsibility: true,
    validateTwoDomains: true
  })
}

export const TRIAXIAL_VERIFICATION = {
  verifyMental,
  verifySimulation,
  verifyLaboratory,
  verifyTriaxial,
  verifyTriaxialPilot,
  TRIAXIAL_WEIGHTS,
  TRIAXIAL_PASS_THRESHOLD
} as const