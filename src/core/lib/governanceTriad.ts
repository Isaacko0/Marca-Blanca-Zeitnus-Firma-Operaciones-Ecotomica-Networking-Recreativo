// Governance Triad — Lógica Pura (Capa 1: Gobernanza Base-3)
// Triadas de verificación humana, anti-fraude, RCE

import type { GovernanceTriad, ValidationRequest, RCEDistribution, GovernanceTriadState } from '@core/state/governanceTriad'
import type { Participant, Obligation, ClearingCycle } from '@core/state/whatmatters'

const uid = () => Math.random().toString(36).slice(2, 9)
const now = () => Date.now()

// ============================================
// FORMACIÓN DE TRIADAS BASE-3 (1→3→9→27...)
// ============================================

export function formTriad(
  state: GovernanceTriadState,
  anchorId: string,
  validatorId: string,
  synthesizerId: string
): { success: boolean; triadId?: string; error?: string } {
  // Verificar que los 3 son distintos
  const ids = [anchorId, validatorId, synthesizerId]
  if (new Set(ids).size !== 3) return { success: false, error: 'Los tres miembros deben ser distintos' }
  
  // Verificar que no estén ya en una triada activa
  for (const id of ids) {
    const existing = state.triads.find(t => 
      t.members.includes(id) && t.status === 'ACTIVE'
    )
    if (existing) return { success: false, error: `Participante ${id} ya está en triada activa ${existing.id}` }
  }
  
  const triad: GovernanceTriad = {
    id: `triad_${uid()}`,
    members: ids,
    anchorId,
    validatorId,
    synthesizerId,
    createdAt: now(),
    status: 'ACTIVE',
    obligationsValidated: 0,
    fraudDetected: 0,
    rceDistributed: 0,
    trustScore: 0, // Se calculará después
  }
  
  state.triads.push(triad)
  return { success: true, triadId: triad.id }
}

export function dissolveTriad(
  state: GovernanceTriadState,
  triadId: string
): { success: boolean; error?: string } {
  const triad = state.triads.find(t => t.id === triadId)
  if (!triad) return { success: false, error: 'Triada no encontrada' }
  
  triad.status = 'DISSOLVED'
  return { success: true }
}

export function getActiveTriadForParticipant(
  state: GovernanceTriadState,
  participantId: string
): GovernanceTriad | null {
  return state.triads.find(t => t.members.includes(participantId) && t.status === 'ACTIVE') || null
}

// ============================================
// VALIDACIÓN HUMANA DE OBLIGACIONES (ANTI-FRAUDE)
// ============================================

export function requestValidation(
  state: GovernanceTriadState,
  triadId: string,
  obligationId: string,
  requestedBy: string
): { success: boolean; requestId?: string; error?: string } {
  const triad = state.triads.find(t => t.id === triadId)
  if (!triad || triad.status !== 'ACTIVE') return { success: false, error: 'Triada no encontrada o inactiva' }
  
  // Solo el anchor o validator pueden solicitar validación
  if (requestedBy !== triad.anchorId && requestedBy !== triad.validatorId) {
    return { success: false, error: 'Solo anchor o validator pueden solicitar validación' }
  }
  
  const request: ValidationRequest = {
    id: `val_${uid()}`,
    triadId,
    obligationId,
    requestedBy,
    status: 'PENDING',
    createdAt: now(),
  }
  
  state.validationRequests.push(request)
  return { success: true, requestId: request.id }
}

export function resolveValidation(
  state: GovernanceTriadState,
  requestId: string,
  resolverId: string,
  approve: boolean,
  notes?: string
): { success: boolean; error?: string } {
  const request = state.validationRequests.find(r => r.id === requestId)
  if (!request) return { success: false, error: 'Solicitud no encontrada' }
  if (request.status !== 'PENDING') return { success: false, error: 'Solicitud ya resuelta' }
  
  const triad = state.triads.find(t => t.id === request.triadId)
  if (!triad) return { success: false, error: 'Triada no encontrada' }
  
  // Validator aprueba/rechaza, synthesizer puede escalar
  const isValidator = resolverId === triad.validatorId
  const isSynthesizer = resolverId === triad.synthesizerId
  
  if (!isValidator && !isSynthesizer) {
    return { success: false, error: 'Solo validator o synthesizer pueden resolver' }
  }
  
  if (isValidator) {
    request.status = approve ? 'APPROVED' : 'REJECTED'
    request.validatorNotes = notes
    request.resolvedAt = now()
    
    if (approve) {
      triad.obligationsValidated++
    } else {
      triad.fraudDetected++
    }
  }
  
  if (isSynthesizer && !approve) {
    // Synthesizer puede escalar a revisión superior
    request.status = 'ESCALATED'
    request.synthesizerDecision = notes
    request.resolvedAt = now()
  }
  
  return { success: true }
}

// ============================================
// DISTRIBUCIÓN RCE (RENTA COMPARTIDA EXPONENCIAL)
// ============================================

export function distributeRCE(
  state: GovernanceTriadState,
  triadId: string,
  cycle: ClearingCycle,
  participants: Participant[],
  obligations: Obligation[]
): { success: boolean; distributionId?: string; error?: string } {
  const triad = state.triads.find(t => t.id === triadId)
  if (!triad || triad.status !== 'ACTIVE') return { success: false, error: 'Triada no encontrada o inactiva' }
  
  // Calcular monto total RCE = clearingAmount * velocityFactor
  const totalAmount = cycle.clearingAmount * state.rceVelocityFactor
  
  // Distribuir entre:
  // 1. Participantes del ciclo (deudores y acreedores) - 60%
  // 2. Validator - 15%
  // 3. Synthesizer - 15%
  // 4. Anchor - 10%
  
  const cycleParticipants = new Set<string>()
  for (const oblId of cycle.path) {
    const obl = obligations.find(o => o.id === oblId)
    if (obl) {
      cycleParticipants.add(obl.debtorId)
      cycleParticipants.add(obl.creditorId)
    }
  }
  
  const participantShare = totalAmount * 0.6
  const validatorShare = totalAmount * 0.15
  const synthesizerShare = totalAmount * 0.15
  const anchorShare = totalAmount * 0.1
  
  const perParticipant = cycleParticipants.size > 0 ? participantShare / cycleParticipants.size : 0
  
  const distributions = [
    ...Array.from(cycleParticipants).map(pid => ({
      participantId: pid,
      role: 'participant' as const,
      amount: perParticipant,
      reason: 'Compensación ciclo multilateral',
    })),
    {
      participantId: triad.validatorId,
      role: 'validator' as const,
      amount: validatorShare,
      reason: 'Validación obligaciones',
    },
    {
      participantId: triad.synthesizerId,
      role: 'synthesizer' as const,
      amount: synthesizerShare,
      reason: 'Síntesis decisión RCE',
    },
    {
      participantId: triad.anchorId,
      role: 'anchor' as const,
      amount: anchorShare,
      reason: 'Iniciación triada',
    },
  ]
  
  const distribution: RCEDistribution = {
    id: `rce_${uid()}`,
    triadId,
    cycleId: cycle.id,
    totalAmount,
    distributions,
    createdAt: now(),
  }
  
  state.rceDistributions.push(distribution)
  triad.rceDistributed += totalAmount
  
  // Actualizar trustScore de la triada (promedio miembros)
  const memberScores = triad.members
    .map(id => participants.find(p => p.id === id)?.trustScore || 50)
  triad.trustScore = memberScores.reduce((a, b) => a + b, 0) / memberScores.length
  
  return { success: true, distributionId: distribution.id }
}

// ============================================
// CRECIMIENTO EXPONENCIAL BASE-3
// ============================================

export function calculateTriadGrowthPotential(
  state: GovernanceTriadState,
  totalParticipants: number
): { currentTriads: number; potentialTriads: number; growthRate: number } {
  const currentTriads = state.triads.filter(t => t.status === 'ACTIVE').length
  // Cada triada activa puede generar 3 nuevas triadas (base-3)
  const potentialTriads = currentTriads * 3
  // Teórico máximo: C(N,3) / 3 (cada persona en 1 triada)
  const maxTriads = totalParticipants >= 3 ? Math.floor((totalParticipants * (totalParticipants - 1) * (totalParticipants - 2)) / 18) : 0
  const growthRate = maxTriads > 0 ? currentTriads / maxTriads : 0
  
  return { currentTriads, potentialTriads: Math.min(potentialTriads, maxTriads), growthRate }
}

// ============================================
// EXPORTS
// ============================================

export const governanceTriadLib = {
  formTriad,
  dissolveTriad,
  getActiveTriadForParticipant,
  requestValidation,
  resolveValidation,
  distributeRCE,
  calculateTriadGrowthPotential,
  uid,
  now,
}