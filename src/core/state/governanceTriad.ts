// Governance Triad — Tipos de Estado (Capa 1: Gobernanza Base-3)
// Triadas de verificación humana, anti-fraude y RCE

export interface GovernanceTriad {
  id: string
  members: string[]           // 3 participantIds: [anchor, validator, synthesizer]
  anchorId: string            // Quien inicia/invita a la triada
  validatorId: string         // Verifica obligaciones y facturas
  synthesizerId: string       // Sintetiza decisiones, coordina RCE
  createdAt: number
  status: 'FORMING' | 'ACTIVE' | 'DISSOLVED'
  // Métricas de la triada
  obligationsValidated: number
  fraudDetected: number
  rceDistributed: number      // Renta Compartida Exponencial distribuida
  trustScore: number          // Promedio trustScore de miembros
}

export interface ValidationRequest {
  id: string
  triadId: string
  obligationId: string
  requestedBy: string         // participantId que pide validación
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED'
  validatorNotes?: string
  synthesizerDecision?: string
  createdAt: number
  resolvedAt?: number
}

export interface RCEDistribution {
  id: string
  triadId: string
  cycleId: string             // ClearingCycle que generó valor
  totalAmount: number         // clearingAmount * velocityFactor
  distributions: Array<{
    participantId: string
    role: 'debtor' | 'creditor' | 'validator' | 'synthesizer' | 'anchor'
    amount: number
    reason: string
  }>
  createdAt: number
}

export interface GovernanceTriadState {
  triads: GovernanceTriad[]
  validationRequests: ValidationRequest[]
  rceDistributions: RCEDistribution[]
  // Configuración
  minTrustScoreForAnchor: number      // 70
  minTrustScoreForValidator: number   // 60
  rceVelocityFactor: number           // 1.5 (multiplicador por velocidad circulación)
}

export function makeGovernanceTriadState(): GovernanceTriadState {
  return {
    triads: [],
    validationRequests: [],
    rceDistributions: [],
    minTrustScoreForAnchor: 70,
    minTrustScoreForValidator: 60,
    rceVelocityFactor: 1.5,
  }
}