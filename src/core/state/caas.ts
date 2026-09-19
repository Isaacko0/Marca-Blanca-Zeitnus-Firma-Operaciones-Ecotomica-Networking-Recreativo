// HSCSG v15 OS — Tipos de Community-as-a-Service reconciliado con Materialismo Jerárquico
// CaaS-BM: la comunidad sostiene la base material; el acceso se gana por contribución (ValueFlows),
// no se compra. Reparto por AUT+CDS con demurrage anti-acumulación (Ley II/III MJ).

export type CaaSTierKey = 'visitante' | 'aprendiz' | 'contribuyente' | 'ancla' | 'custodio'

export interface CaaSTier {
  key: CaaSTierKey
  name: string
  stakeZNU: number // ZNU bloqueado como compromiso (no pago USDC ciego)
  minAUT: number // AUT promedio mínimo para sostener el tier
  minCDS: number // cohesión mínima del colectivo
  benefit: string
}

export interface CaaSMembership {
  id: string
  memberName: string
  tier: CaaSTierKey
  stakeZNU: number
  contributedFlows: number // nº de ValueFlows verificables aportados
  znuEarned: number
}

export type CaaSStreamKey = 'suscripcion' | 'revenue_share' | 'b2b' | 'afiliados_verdes' | 'educacion' | 'csa_subscription'

export interface CaaSRevenueStream {
  key: CaaSStreamKey
  name: string
  enabled: boolean
  // contexto de ingreso para el gate MJ
  usdcIn: number
  znuOut: number
  touchesBaseMaterial: boolean
  // extensión para streams personalizados (ej: CSA)
  [key: string]: any
}

export interface CaaSPayout {
  id: string
  ts: number
  memberName: string
  amountZNU: number
  basis: string // cómo se calculó (AUT/CDS)
  demurrageApplied: number
}

export interface CaaSAuditEntry {
  id: string
  ts: number
  action: string
  detail: string
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  lawRef?: 'I' | 'II' | 'III'
}
