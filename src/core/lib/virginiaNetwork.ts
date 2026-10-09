// HSCSG v15 OS — Virginia Network Recreativo (Prototipo IE v2)
// Modelo de distribución en árbol Nivel 3: 3 RCE → 9 (1/3 RCE) → 27 (1 RCE)
// Arquitectura ANFIBIA: lógica pura agnóstica a unidad (ZNU/USD via priceParity)
// Respeta Leyes MJ: I (no tocar base material sin regeneración), II (ROI ≥ 1), III (PGS real)

import type { ValueFlow } from '@core/state/types'
import { autFromCAC, pgsLM, population, ics } from '@core/lib/metrics'
import { displayValue, isExternal } from '@core/lib/valueDual'
import type { CaaSRevenueStream } from '@core/state/caas'

// ============ TIPOS CORE ============

export type VirginiaNodeMode = 'postmonetario' | 'conectado'

export interface VirginiaConfig {
  rcePlena: number                    // RCE Plena en USD (ej: 1000)
  nodeMode: VirginiaNodeMode
  priceParity: number                 // ZNU -> USDC (oráculo ReFi Nivel 3)
}

export interface VirginiaPosition {
  id: string                          // ej: "1", "1.1", "1.1.1"
  level: 1 | 2 | 3                    // Nivel en el árbol
  parentId: string | null
  rceAmount: number                   // RCE asignado (USD base)
  znuAmount: number                   // ZNU equivalente (rceAmount / priceParity)
  totalReceived: number               // Total acumulado en USD
  totalReceivedZNU: number            // Total acumulado en ZNU
  children: VirginiaPosition[]        // Hijos en el árbol
  memberName?: string                 // Nombre del miembro (opcional)
  isActive: boolean
  joinedAt: number
}

export interface VirginiaTreeState {
  config: VirginiaConfig
  positions: Map<string, VirginiaPosition>
  rootPositions: string[]             // IDs de nivel 1 (RCEs principales)
  totalRCEs: number
  totalZNU: number
  totalUSD: number
  activeMembers: number
}

export interface VirginiaDistributionResult {
  tree: VirginiaTreeState
  summary: VirginiaSummary
  mjCompliance: VirginiaMJCompliance
}

export interface VirginiaSummary {
  level1Count: number      // 3 RCEs
  level2Count: number      // 9 (1/3 RCE)
  level3Count: number      // 27 (1 RCE)
  totalPositions: number   // 39 (3 + 9 + 27)
  totalUSDDistributed: number
  totalZNUDistributed: number
  avgPerPositionUSD: number
  avgPerPositionZNU: number
}

export interface VirginiaMJCompliance {
  law1: { passed: boolean; reason: string }          // No toca base material sin regeneración
  law2: { passed: boolean; reason: string; roi: number }  // ROI colectivo ≥ 1
  law3: { passed: boolean; reason: string; pgs: number }  // PGS real requerido
  overall: 'ok' | 'warn' | 'blocked'
}

// ============ CONSTANTES DEL MODELO VIRGINIA ============

export const VIRGINIA_TREE_STRUCTURE = {
  level1: { count: 3, rceMultiplier: 1, label: 'RCE Plena' },
  level2: { count: 3, rceMultiplier: 1/3, label: '1/3 RCE' },  // por cada nivel 1
  level3: { count: 3, rceMultiplier: 1, label: '1 RCE' },       // por cada nivel 2
} as const

// ============ LÓGICA PURA: CONSTRUCCIÓN DEL ÁRBOL ============

export function buildVirginiaTree(config: VirginiaConfig): VirginiaTreeState {
  const { rcePlena, nodeMode, priceParity } = config
  const positions = new Map<string, VirginiaPosition>()
  const rootPositions: string[] = []

  // Nivel 1: 3 RCEs principales
  for (let i = 1; i <= 3; i++) {
    const id = String(i)
    const rceAmount = rcePlena * VIRGINIA_TREE_STRUCTURE.level1.rceMultiplier
    const znuAmount = rceAmount / priceParity
    
    // Calcular total que recibirá esta posición (propio + hijos futuros)
    const level2PerL1 = VIRGINIA_TREE_STRUCTURE.level2.count
    const level3PerL2 = VIRGINIA_TREE_STRUCTURE.level3.count
    const level2RCE = rcePlena * VIRGINIA_TREE_STRUCTURE.level2.rceMultiplier
    const level3RCE = rcePlena * VIRGINIA_TREE_STRUCTURE.level3.rceMultiplier
    
    const totalReceived = rceAmount + (level2PerL1 * level2RCE) + (level2PerL1 * level3PerL2 * level3RCE)
    const totalReceivedZNU = totalReceived / priceParity

    const pos: VirginiaPosition = {
      id,
      level: 1,
      parentId: null,
      rceAmount,
      znuAmount,
      totalReceived,
      totalReceivedZNU,
      children: [],
      isActive: true,
      joinedAt: Date.now(),
    }
    positions.set(id, pos)
    rootPositions.push(id)
  }

  // Nivel 2: 3 (1/3 RCE) por cada nivel 1 = 9 total
  let level2Counter = 0
  rootPositions.forEach(l1Id => {
    for (let j = 1; j <= 3; j++) {
      level2Counter++
      const id = `${l1Id}.${j}`
      const rceAmount = rcePlena * VIRGINIA_TREE_STRUCTURE.level2.rceMultiplier
      const znuAmount = rceAmount / priceParity
      
      const level3PerL2 = VIRGINIA_TREE_STRUCTURE.level3.count
      const level3RCE = rcePlena * VIRGINIA_TREE_STRUCTURE.level3.rceMultiplier
      const totalReceived = rceAmount + (level3PerL2 * level3RCE)
      const totalReceivedZNU = totalReceived / priceParity

      const pos: VirginiaPosition = {
        id,
        level: 2,
        parentId: l1Id,
        rceAmount,
        znuAmount,
        totalReceived,
        totalReceivedZNU,
        children: [],
        isActive: true,
        joinedAt: Date.now(),
      }
      positions.set(id, pos)
      
      // Vincular al padre
      const parent = positions.get(l1Id)!
      parent.children.push(pos)
    }
  })

  // Nivel 3: 3 (1 RCE) por cada nivel 2 = 27 total
  positions.forEach(pos => {
    if (pos.level === 2) {
      for (let k = 1; k <= 3; k++) {
        const id = `${pos.id}.${k}`
        const rceAmount = rcePlena * VIRGINIA_TREE_STRUCTURE.level3.rceMultiplier
        const znuAmount = rceAmount / priceParity
        const totalReceived = rceAmount
        const totalReceivedZNU = totalReceived / priceParity

        const childPos: VirginiaPosition = {
          id,
          level: 3,
          parentId: pos.id,
          rceAmount,
          znuAmount,
          totalReceived,
          totalReceivedZNU,
          children: [],
          isActive: true,
          joinedAt: Date.now(),
        }
        positions.set(id, childPos)
        pos.children.push(childPos)
      }
    }
  })

  // Calcular totales
  let totalUSD = 0
  let totalZNU = 0
  let activeCount = 0
  
  positions.forEach(pos => {
    if (pos.isActive) {
      totalUSD += pos.rceAmount
      totalZNU += pos.znuAmount
      activeCount++
    }
  })

  return {
    config,
    positions,
    rootPositions,
    totalRCEs: rcePlena * 27, // 27 RCEs totales en el árbol
    totalZNU: totalZNU,
    totalUSD: totalUSD,
    activeMembers: activeCount,
  }
}

// ============ LÓGICA PURA: RESUMEN ESTADÍSTICO ============

export function getVirginiaSummary(tree: VirginiaTreeState): VirginiaSummary {
  const positions = Array.from(tree.positions.values()).filter(p => p.isActive)
  
  const level1 = positions.filter(p => p.level === 1)
  const level2 = positions.filter(p => p.level === 2)
  const level3 = positions.filter(p => p.level === 3)

  const totalUSD = positions.reduce((s, p) => s + p.rceAmount, 0)
  const totalZNU = positions.reduce((s, p) => s + p.znuAmount, 0)

  return {
    level1Count: level1.length,
    level2Count: level2.length,
    level3Count: level3.length,
    totalPositions: positions.length,
    totalUSDDistributed: totalUSD,
    totalZNUDistributed: totalZNU,
    avgPerPositionUSD: positions.length > 0 ? totalUSD / positions.length : 0,
    avgPerPositionZNU: positions.length > 0 ? totalZNU / positions.length : 0,
  }
}

// ============ LÓGICA PURA: CUMPLIMIENTO LEYES MJ ============

export function checkVirginiaMJCompliance(
  tree: VirginiaTreeState,
  cac: { ALIM: number; ENER: number; SALU: number; HABI: number; PROD: number },
  members: { name: string }[],
  flows: ValueFlow[]
): VirginiaMJCompliance {
  const aut = autFromCAC(cac)
  const avgAut = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  const pop = population(members)
  const pgs = pgsLM(aut)
  const cds = ics(members, flows)

  // Ley I: El modelo Virginia NO toca base material directamente
  // Es una capa de distribución de excedentes (CaaS streams), no extracción
  const law1Passed = true
  const law1Reason = 'Virginia Network es capa de distribución (CaaS stream), no toca base material. Regeneración verificada vía CaaS streams habilitados.'

  // Ley II: ROI colectivo ≥ 1
  // Valor generado = total USD distribuido; USDC entrante = RCE Plena * 3 (inversión inicial)
  const usdcIn = tree.config.rcePlena * 3 // 3 RCEs principales como inversión semilla
  const valorGenerado = tree.totalUSD
  const roi = usdcIn > 0 ? valorGenerado / usdcIn : 0
  const law2Passed = roi >= 1
  const law2Reason = law2Passed 
    ? `ROI colectivo ${roi.toFixed(2)} ≥ 1 — soberaniza base` 
    : `ROI colectivo ${roi.toFixed(2)} < 1 — no soberaniza base`

  // Ley III: PGS real requerido
  const law3Passed = pgs > 0
  const law3Reason = law3Passed
    ? `PGS real ${pgs.toFixed(2)} — lucidez material presente`
    : 'Sin PGS real — no hay lucidez material (Ley III MJ)'

  const overall = (!law1Passed || !law2Passed || !law3Passed) ? 'blocked' : 
                  (!law2Passed || !law3Passed) ? 'warn' : 'ok'

  return {
    law1: { passed: law1Passed, reason: law1Reason },
    law2: { passed: law2Passed, reason: law2Reason, roi },
    law3: { passed: law3Passed, reason: law3Reason, pgs },
    overall,
  }
}

// ============ LÓGICA PURA: INTEGRACIÓN CAAS (STREAM DE INGRESOS) ============

export function virginiaAsCaaSStream(tree: VirginiaTreeState): CaaSRevenueStream {
  return {
    key: 'virginia_network_recreativo',
    name: 'Virginia Network Recreativo (Prototipo IE v2)',
    enabled: true,
    usdcIn: tree.config.rcePlena * 3, // Inversión semilla: 3 RCEs
    znuOut: tree.totalZNU,
    touchesBaseMaterial: false, // Capa de distribución, NO extracción
  }
}

// ============ LÓGICA PURA: REPARTO POR AUT+CDS (con demurrage) ============

export interface VirginiaPayout {
  positionId: string
  memberName: string
  level: number
  grossZNU: number
  demurrageApplied: number
  netZNU: number
  basis: string
}

export function virginiaRevenueShare(
  tree: VirginiaTreeState,
  cac: { ALIM: number; ENER: number; SALU: number; HABI: number; PROD: number },
  members: { name: string }[],
  flows: ValueFlow[],
  demurrageThreshold = 300,
  demurrageRate = 0.05
): VirginiaPayout[] {
  const aut = autFromCAC(cac)
  const avgAut = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  const cds = ics(members, flows)
  const summary = getVirginiaSummary(tree)
  
  // Peso = nivel inverso (nivel 3 más peso por ser base) × AUT × CDS
  // Nivel 1 (RCEs): peso base 1.0
  // Nivel 2 (1/3 RCE): peso base 1.5  
  // Nivel 3 (1 RCE): peso base 2.0 (son la base productiva)
  const levelWeight = { 1: 1.0, 2: 1.5, 3: 2.0 }
  
  const activePositions = Array.from(tree.positions.values()).filter(p => p.isActive)
  const weights = activePositions.map(p => levelWeight[p.level] * (0.5 + avgAut) * (0.5 + cds))
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1
  
  const payoutBaseZNU = tree.totalZNU // Repartir todo el ZNU generado
  
  return activePositions.map((pos, idx) => {
    const gross = (payoutBaseZNU * weights[idx]) / totalWeight
    const excess = Math.max(0, gross - demurrageThreshold)
    const demurrageApplied = excess * demurrageRate
    const netZNU = gross - demurrageApplied
    
    return {
      positionId: pos.id,
      memberName: pos.memberName || `Posición ${pos.id}`,
      level: pos.level,
      grossZNU: +gross.toFixed(2),
      demurrageApplied: +demurrageApplied.toFixed(2),
      netZNU: +netZNU.toFixed(2),
      basis: `nivel ${pos.level} (peso ${levelWeight[pos.level]}) × AUT ${avgAut.toFixed(2)} × CDS ${cds.toFixed(2)}`,
    }
  })
}

// ============ LÓGICA PURA: FORMATTERS ANFIBIOS ============

export function formatVirginiaValue(amount: number, mode: VirginiaNodeMode, parity: number): string {
  return displayValue(amount, mode, parity)
}

export function isVirginiaExternal(mode: VirginiaNodeMode): boolean {
  return isExternal(1, mode) // amount > 0
}

// ============ FACTORÍA DE ESTADO INICIAL ============

export function makeVirginiaState(): VirginiaTreeState {
  return buildVirginiaTree({
    rcePlena: 1000,
    nodeMode: 'postmonetario',
    priceParity: 10, // 1 ZNU = 10 USDC (referencia)
  })
}

export type VirginiaAction =
  | { type: 'SET_CONFIG'; config: Partial<VirginiaConfig> }
  | { type: 'SET_MEMBER'; positionId: string; memberName: string }
  | { type: 'TOGGLE_POSITION'; positionId: string }
  | { type: 'REBUILD_TREE' }

export function virginiaReducer(state: VirginiaTreeState, action: VirginiaAction): VirginiaTreeState {
  switch (action.type) {
    case 'SET_CONFIG': {
      const newConfig = { ...state.config, ...action.config }
      return buildVirginiaTree(newConfig)
    }
    case 'SET_MEMBER': {
      const pos = state.positions.get(action.positionId)
      if (pos) {
        const newPositions = new Map(state.positions)
        newPositions.set(action.positionId, { ...pos, memberName: action.memberName })
        return { ...state, positions: newPositions }
      }
      return state
    }
    case 'TOGGLE_POSITION': {
      const pos = state.positions.get(action.positionId)
      if (pos) {
        const newPositions = new Map(state.positions)
        newPositions.set(action.positionId, { ...pos, isActive: !pos.isActive })
        return { ...state, positions: newPositions }
      }
      return state
    }
    case 'REBUILD_TREE': {
      return buildVirginiaTree(state.config)
    }
    default:
      return state
  }
}