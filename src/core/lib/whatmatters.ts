// WhatMatters — Lógica Pura de Compensación Multilateral
// Cycle Finding, Atomic Confirmation, Shadow Mapping, Hyperbolic Growth

import type { Obligation, ClearingCycle, Participant, ShadowMappingResult, HyperbolicGrowthMetrics, WhatMattersState } from '@core/state/whatmatters'

const uid = () => Math.random().toString(36).slice(2, 9)
const now = () => Date.now()

// ============================================
// GRAFO DIRIGIDO PONDERADO — ESTRUCTURA BASE
// ============================================

interface GraphEdge {
  from: string      // debtorId
  to: string        // creditorId
  obligationId: string
  amount: number
  currency: string
}

interface GraphNode {
  id: string
  participantId: string
  outgoing: GraphEdge[]
  incoming: GraphEdge[]
}

function buildGraph(obligations: Obligation[], participants: Participant[]): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>()
  
  // Inicializar nodos
  for (const p of participants) {
    graph.set(p.id, {
      id: p.id,
      participantId: p.id,
      outgoing: [],
      incoming: [],
    })
  }
  
  // Agregar aristas solo de obligaciones ACTIVE
  for (const obl of obligations) {
    if (obl.status !== 'ACTIVE') continue
    if (!graph.has(obl.debtorId) || !graph.has(obl.creditorId)) continue
    
    const edge: GraphEdge = {
      from: obl.debtorId,
      to: obl.creditorId,
      obligationId: obl.id,
      amount: obl.amount,
      currency: obl.currency,
    }
    
    graph.get(obl.debtorId)!.outgoing.push(edge)
    graph.get(obl.creditorId)!.incoming.push(edge)
  }
  
  return graph
}

// ============================================
// CYCLE FINDING — ALGORITMO JOHNSON OPTIMIZADO (k=3..5)
// ============================================

interface FoundCycle {
  path: string[]        // obligationIds en orden
  nodes: string[]       // participantIds en orden
  clearingAmount: number
  edges: GraphEdge[]
}

function findCycles(
  graph: Map<string, GraphNode>,
  maxDepth: number = 5,
  minClearingAmount: number = 1
): FoundCycle[] {
  const cycles: FoundCycle[] = []
  const visited = new Set<string>()
  const path: GraphEdge[] = []
  const nodePath: string[] = []
  
  function dfs(startNode: string, currentNode: string, depth: number, minWeight: number): void {
    if (depth >= maxDepth) return
    
    const current = graph.get(currentNode)
    if (!current) return
    
    for (const edge of current.outgoing) {
      const nextNode = edge.to
      const newMinWeight = Math.min(minWeight, edge.amount)
      
      // Ciclo cerrado: volvimos al inicio
      if (nextNode === startNode && depth >= 2) { // mínimo 3 nodos (2 aristas + retorno)
        if (newMinWeight >= minClearingAmount) {
          cycles.push({
            path: [...path.map(e => e.obligationId), edge.obligationId],
            nodes: [...nodePath, currentNode, startNode],
            clearingAmount: newMinWeight,
            edges: [...path, edge],
          })
        }
        continue
      }
      
      // Evitar ciclos simples que repiten nodos (excepto retorno al inicio)
      if (nodePath.includes(nextNode)) continue
      
      path.push(edge)
      nodePath.push(currentNode)
      dfs(startNode, nextNode, depth + 1, newMinWeight)
      path.pop()
      nodePath.pop()
    }
  }
  
  // Lanzar DFS desde cada nodo
  for (const [nodeId] of graph) {
    dfs(nodeId, nodeId, 0, Infinity)
  }
  
  // Deduplicar ciclos (mismo conjunto de obligaciones)
  const uniqueCycles = deduplicateCycles(cycles)
  
  // Ordenar por clearingAmount descendente (mayor impacto primero)
  return uniqueCycles.sort((a, b) => b.clearingAmount - a.clearingAmount)
}

function deduplicateCycles(cycles: FoundCycle[]): FoundCycle[] {
  const seen = new Set<string>()
  const unique: FoundCycle[] = []
  
  for (const c of cycles) {
    // Normalizar: ordenar obligationIds para comparación
    const key = [...c.path].sort().join(',')
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(c)
    }
  }
  
  return unique
}

// ============================================
// SHADOW MAPPING — PRE-COMPENSACIÓN EN SOMBRA
// ============================================

export function runShadowMapping(state: WhatMattersState): ShadowMappingResult[] {
  const graph = buildGraph(state.obligations, state.participants)
  const cycles = findCycles(graph, state.maxCycleDepth, state.minClearingAmount)
  
  const results: ShadowMappingResult[] = cycles.map(c => ({
    cycleId: `shadow_${uid()}`,
    path: c.path,
    clearingAmount: c.clearingAmount,
    participants: c.nodes.slice(0, -1), // sin duplicar inicio/fin
    estimatedLiquidityFreed: c.clearingAmount * c.path.length,
    detectionTs: now(),
  }))
  
  return results
}

// ============================================
// CONFIRMACIÓN ATÓMICA — MÁQUINA DE ESTADOS
// ============================================

export function proposeClearingCycle(
  state: WhatMattersState,
  cycle: FoundCycle
): ClearingCycle {
  const expiresAt = now() + state.confirmationWindowHours * 60 * 60 * 1000
  
  return {
    id: `cycle_${uid()}`,
    path: cycle.path,
    clearingAmount: cycle.clearingAmount,
    status: 'PROPOSED',
    expiresAt,
    createdAt: now(),
  }
}

export function confirmCycleParticipation(
  state: WhatMattersState,
  cycleId: string,
  participantId: string,
  accept: boolean,
  reason?: string
): { success: boolean; cycle?: ClearingCycle; error?: string } {
  const cycle = state.clearingCycles.find(c => c.id === cycleId)
  if (!cycle) return { success: false, error: 'Ciclo no encontrado' }
  if (cycle.status !== 'PROPOSED') return { success: false, error: 'Ciclo no está en estado PROPOSED' }
  if (now() > cycle.expiresAt) return { success: false, error: 'Ventana de confirmación expirada' }
  
  // Verificar que el participante es parte del ciclo
  const participantInCycle = cycle.path.some(oblId => {
    const obl = state.obligations.find(o => o.id === oblId)
    return obl && (obl.debtorId === participantId || obl.creditorId === participantId)
  })
  if (!participantInCycle) return { success: false, error: 'Participante no pertenece a este ciclo' }
  
  if (!accept) {
    // Rechazo: ciclo se cancela para todos
    return { 
      success: true, 
      cycle: { ...cycle, status: 'CANCELLED', rejectedBy: participantId, rejectionReason: reason } 
    }
  }
  
  // En implementación real: trackear confirmaciones por participante
  // Por simplicidad: si es el último en confirmar, ejecutar
  // Aquí asumimos confirmación atómica simplificada
  return { success: true, cycle: { ...cycle, status: 'CONFIRMED', confirmedAt: now() } }
}

export function executeClearingCycle(
  state: WhatMattersState,
  cycleId: string
): { success: boolean; extinguishedObligations: string[]; residualUpdates: Array<{ obligationId: string; newAmount: number }>; error?: string } {
  const cycle = state.clearingCycles.find(c => c.id === cycleId)
  if (!cycle) return { success: false, extinguishedObligations: [], residualUpdates: [], error: 'Ciclo no encontrado' }
  if (cycle.status !== 'CONFIRMED') return { success: false, extinguishedObligations: [], residualUpdates: [], error: 'Ciclo no confirmado' }
  
  const extinguished: string[] = []
  const residuals: Array<{ obligationId: string; newAmount: number }> = []
  
  for (const oblId of cycle.path) {
    const obl = state.obligations.find(o => o.id === oblId)
    if (!obl) continue
    
    if (obl.amount <= cycle.clearingAmount) {
      // Se extingue completamente
      extinguished.push(oblId)
    } else {
      // Saldo residual
      residuals.push({ obligationId: oblId, newAmount: obl.amount - cycle.clearingAmount })
    }
  }
  
  return { success: true, extinguishedObligations: extinguished, residualUpdates: residuals }
}

// ============================================
// MÉTRICAS DE CRECIMIENTO HIPERBÓLICO
// ============================================

export function calculateHyperbolicMetrics(state: WhatMattersState): HyperbolicGrowthMetrics {
  const N = state.participants.filter(p => p.status === 'ACTIVE').length
  const totalObligations = state.obligations.filter(o => o.status === 'ACTIVE').length
  const extinguishedCount = state.obligations.filter(o => o.status === 'EXTINGUISHED').length
  const confirmedCycles = state.clearingCycles.filter(c => c.status === 'EXTINGUISHED').length
  
  // Combinatoria: C(N,3) = N*(N-1)*(N-2)/6
  const potentialTriads = N >= 3 ? (N * (N - 1) * (N - 2)) / 6 : 0
  
  // Umbral de percolación aproximado para grafo aleatorio dirigido
  // p_c ≈ 1/N para componente gigante en grafo Erdős–Rényi dirigido
  const percolationThreshold = N > 0 ? Math.log(N) / N : 0
  
  // Coeficiente viral K: promedio de acreedores invitados por deudor
  // Estimación: cada obligación registrada invita a 1 acreedor
  const viralCoefficient = totalObligations > 0 ? state.participants.reduce((sum, p) => sum + p.cyclesParticipated, 0) / totalObligations : 0
  
  // Tasa de compensación
  const compensationRate = totalObligations > 0 ? extinguishedCount / totalObligations : 0
  
  // Longitud promedio de ciclo
  const cyclesWithLength = state.clearingCycles.filter(c => c.status === 'EXTINGUISHED')
  const avgCycleLength = cyclesWithLength.length > 0
    ? cyclesWithLength.reduce((sum, c) => sum + c.path.length, 0) / cyclesWithLength.length
    : 0
  
  // Velocidad de liquidez: clearingAmount total / tiempo
  const totalCleared = state.clearingCycles
    .filter(c => c.status === 'EXTINGUISHED')
    .reduce((sum, c) => sum + c.clearingAmount, 0)
  const timeSpan = state.clearingCycles.length > 0
    ? (Math.max(...state.clearingCycles.map(c => c.createdAt)) - Math.min(...state.clearingCycles.map(c => c.createdAt))) / (1000 * 60 * 60) // horas
    : 1
  const liquidityVelocity = timeSpan > 0 ? totalCleared / timeSpan : 0
  
  return {
    totalParticipants: N,
    totalObligations,
    potentialTriads,
    activeCycles: state.clearingCycles.filter(c => c.status === 'PROPOSED' || c.status === 'CONFIRMED').length,
    percolationThreshold,
    viralCoefficient,
    compensationRate,
    avgCycleLength,
    liquidityVelocity,
  }
}

// ============================================
// REGISTRO DE OBLIGACIONES — ENTRADA MÍNIMA
// ============================================

export function registerObligation(
  state: WhatMattersState,
  input: {
    debtorId: string
    creditorTaxIdOrEmail: string
    amount: number
    currency: 'ZNU' | 'USD' | 'LOCAL'
    invoiceRef: string
    obligationType?: Obligation['obligationType']
  }
): { success: boolean; obligationId?: string; error?: string } {
  // Buscar o crear acreedor por taxId/email
  let creditor = state.participants.find(p => 
    p.taxId === input.creditorTaxIdOrEmail || p.email === input.creditorTaxIdOrEmail
  )
  
  if (!creditor) {
    // Crear participante placeholder (se completará cuando se registre)
    creditor = {
      id: uid(),
      taxId: input.creditorTaxIdOrEmail.includes('@') ? '' : input.creditorTaxIdOrEmail,
      legalName: 'Pendiente de registro',
      email: input.creditorTaxIdOrEmail.includes('@') ? input.creditorTaxIdOrEmail : '',
      obligationsRegistered: 0,
      cyclesParticipated: 0,
      cyclesConfirmed: 0,
      liquidityFreed: 0,
      trustScore: 50,
      createdAt: now(),
      status: 'UNVERIFIED',
    }
    state.participants.push(creditor)
  }
  
  // Buscar deudor (debe existir)
  const debtor = state.participants.find(p => p.id === input.debtorId)
  if (!debtor) return { success: false, error: 'Deudor no encontrado en participantes' }
  
  // Crear obligación en DRAFT (espera confirmación bilateral)
  const obligation: Obligation = {
    id: `obl_${uid()}`,
    debtorId: input.debtorId,
    creditorId: creditor.id,
    amount: input.amount,
    currency: input.currency,
    invoiceRef: input.invoiceRef,
    status: 'DRAFT',
    createdAt: now(),
    obligationType: input.obligationType || 'commercial',
  }
  
  state.obligations.push(obligation)
  debtor.obligationsRegistered++
  
  return { success: true, obligationId: obligation.id }
}

export function confirmObligationBilateral(
  state: WhatMattersState,
  obligationId: string,
  confirmerId: string,
  isCreditor: boolean
): { success: boolean; error?: string } {
  const obl = state.obligations.find(o => o.id === obligationId)
  if (!obl) return { success: false, error: 'Obligación no encontrada' }
  
  if (isCreditor && obl.creditorId !== confirmerId) return { success: false, error: 'No eres el acreedor de esta obligación' }
  if (!isCreditor && obl.debtorId !== confirmerId) return { success: false, error: 'No eres el deudor de esta obligación' }
  
  // En implementación real: trackear confirmaciones de ambas partes
  // Aquí simplificado: si ya estaba DRAFT, pasa a ACTIVE
  if (obl.status === 'DRAFT') {
    obl.status = 'ACTIVE'
    obl.confirmedAt = now()
  }
  
  return { success: true }
}

// ============================================
// INVITACIÓN VIRAL A ACREEDORES (K > 1)
// ============================================

export function generateCreditorInvitation(
  state: WhatMattersState,
  obligationId: string
): { invitationUrl: string; message: string } | null {
  const obl = state.obligations.find(o => o.id === obligationId)
  if (!obl) return null
  
  const creditor = state.participants.find(p => p.id === obl.creditorId)
  if (!creditor) return null
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://whatmatters.hscsg.org'
  const invitationUrl = `${baseUrl}/join?obl=${obligationId}&creditor=${creditor.id}`
  
  const message = `La empresa ${state.participants.find(p => p.id === obl.debtorId)?.legalName || 'un participante'} ha registrado una obligación pendiente contigo por ${obl.amount} ${obl.currency} (${obl.invoiceRef}) y busca cancelarla a través de la red de compensación WhatMatters. Para recibir esta extinción de deuda, indícanos a qué proveedores les debes tú.`
  
  return { invitationUrl, message }
}

// ============================================
// MODO ANFIBIO — RENDER AGNÓSTICO A UNIDAD
// ============================================

export function renderClearingAmount(
  amount: number,
  nodeMode: 'postmonetario' | 'conectado',
  priceParity: number,
  currency: 'ZNU' | 'USD' | 'LOCAL'
): string {
  if (nodeMode === 'postmonetario' || currency === 'ZNU') {
    return `${amount.toLocaleString()} ZNU`
  }
  if (nodeMode === 'conectado' && currency === 'USD') {
    return `$${(amount * priceParity).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC`
  }
  return `${amount.toLocaleString()} ${currency}`
}

// ============================================
// EXPORTS PRINCIPALES
// ============================================

export const whatmattersLib = {
  buildGraph,
  findCycles,
  runShadowMapping,
  proposeClearingCycle,
  confirmCycleParticipation,
  executeClearingCycle,
  calculateHyperbolicMetrics,
  registerObligation,
  confirmObligationBilateral,
  generateCreditorInvitation,
  renderClearingAmount,
  // Utilidades
  uid,
  now,
}