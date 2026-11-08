// HSCSG v15 OS — ZNU (Zeitnus Native Unit) State
// Capa 5: Economía Transicional — Unidad anfibia postmonetario/conectado
// Principio Anfibio: valueDual.ts + nodeMode/priceParity
// Postmonetario: ZNU/CaaS (default offline) | Conectado: USD/USDC via oracle ReFi Nivel 3

import type { BaseMaterial, CACVectors } from '@core/state/types'

// ============================================
// ZNU TYPES
// ============================================

export interface ZNUState {
  // Configuración anfibia
  config: ZNUConfig
  // Cuentas ZNU por miembro
  accounts: Map<string, ZNUAccount>
  // Transacciones
  transactions: ZNUTransaction[]
  // Price parity oracle (ZNU -> USDC)
  priceParity: ZNUPriceParity
  // Demurrage (anti-acumulación)
  demurrage: ZNUDemurrage
  // CaaS integration
  caasIntegration: ZNUCaaSIntegration
  // Auditoría
  auditLog: ZNUAuditEntry[]
}

export interface ZNUConfig {
  // Modo anfibio
  nodeMode: 'postmonetario' | 'conectado'
  // 1 ZNU = X USDC (oráculo ReFi Nivel 3, actualizable)
  priceParity: number
  // Demurrage threshold (ZNU por encima del cual aplica)
  demurrageThreshold: number
  // Demurrage rate (% por período)
  demurrageRate: number
  // Período demurrage (ms)
  demurragePeriod: number
  // ZNU por miembro base (UBI-like)
  basePerMember: number
  // Permitir conversión ZNU <-> USDC (solo modo conectado)
  allowConversion: boolean
  // Límite conversión por período
  conversionLimitPerPeriod: number
}

export interface ZNUAccount {
  memberId: string
  balance: number
  // ZNU ganados por contribución (no comprados)
  earned: number
  // ZNU gastados
  spent: number
  // ZNU bajo demurrage
  demurraged: number
  // Historial
  movements: ZNUMovement[]
  // Estado
  status: 'active' | 'frozen' | 'closed'
  // Última actualización demurrage
  lastDemurrageAt: number
}

export interface ZNUMovement {
  id: string
  type: 'earned' | 'spent' | 'transfer_in' | 'transfer_out' | 'demurrage' | 'conversion' | 'caas_payout'
  amount: number
  counterparty?: string
  description: string
  timestamp: number
  // Para conversiones
  usdcAmount?: number
  priceParityAtTime?: number
}

export interface ZNUTransaction {
  id: string
  from: string
  to: string
  amount: number
  type: 'transfer' | 'payment' | 'caas_payout' | 'conversion' | 'demurrage'
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  completedAt?: number
  // Metadatos
  metadata?: Record<string, any>
}

export interface ZNUPriceParity {
  // Valor actual ZNU -> USDC
  current: number
  // Fuente del oráculo
  source: 'refi_oracle_nivel3' | 'manual' | 'fixed'
  // Última actualización
  lastUpdated: number
  // Historial
  history: ZNUPricePoint[]
  // Desviación máxima permitida antes de alerta
  maxDeviation: number
}

export interface ZNUPricePoint {
  price: number
  timestamp: number
  source: string
}

export interface ZNUDemurrage {
  enabled: boolean
  threshold: number
  rate: number
  period: number
  lastApplied: number
  totalDemurraged: number
  // Cuentas afectadas en última aplicación
  lastAffectedAccounts: string[]
}

export interface ZNUCaaSIntegration {
  // Streams de ingresos CaaS que generan ZNU
  revenueStreams: ZNUCaaSRevenueStream[]
  // Pagos realizados
  payouts: ZNUCaaSPayout[]
}

export interface ZNUCaaSRevenueStream {
  key: string
  name: string
  enabled: boolean
  // ZNU generados por unidad de ingreso
  znuPerUnit: number
  // Unidad de medida
  unit: string
  // Último cálculo
  lastCalculated: number
}

export interface ZNUCaaSPayout {
  id: string
  memberId: string
  amount: number
  streamKey: string
  timestamp: number
  transactionId: string
}

export interface ZNUAuditEntry {
  id: string
  type: 'transaction' | 'demurrage' | 'conversion' | 'config_change' | 'caas_payout' | 'price_parity_update'
  actorId: string
  description: string
  details: Record<string, any>
  timestamp: number
  severity: 'info' | 'warning' | 'critical'
}

// ============================================
// ZNU ENGINE
// ============================================

export class ZNUEngine {
  private state: ZNUState

  constructor() {
    this.state = this.createInitialState()
  }

  private createInitialState(): ZNUState {
    return {
      config: {
        nodeMode: 'postmonetario',
        priceParity: 0.02, // 1 ZNU ~ 0.02 USDC (oráculo ReFi referencia)
        demurrageThreshold: 300,
        demurrageRate: 0.05, // 5% por período
        demurragePeriod: 30 * 24 * 60 * 60 * 1000, // 30 días
        basePerMember: 100,
        allowConversion: false, // solo en modo conectado
        conversionLimitPerPeriod: 1000
      },
      accounts: new Map(),
      transactions: [],
      priceParity: {
        current: 0.02,
        source: 'refi_oracle_nivel3',
        lastUpdated: Date.now(),
        history: [],
        maxDeviation: 0.1 // 10%
      },
      demurrage: {
        enabled: true,
        threshold: 300,
        rate: 0.05,
        period: 30 * 24 * 60 * 60 * 1000,
        lastApplied: 0,
        totalDemurraged: 0,
        lastAffectedAccounts: []
      },
      caasIntegration: {
        revenueStreams: [
          { key: 'suscripcion', name: 'Suscripción pertenencia (stake ZNU)', enabled: true, znuPerUnit: 1, unit: 'member/month', lastCalculated: 0 },
          { key: 'revenue_share', name: 'Revenue share por AUT', enabled: true, znuPerUnit: 10, unit: 'AUT_point', lastCalculated: 0 },
          { key: 'b2b', name: 'Servicios entre pares (ValueFlows)', enabled: true, znuPerUnit: 1, unit: 'transaction', lastCalculated: 0 },
          { key: 'afiliados_verdes', name: 'Afiliados verdes (elevan AUT)', enabled: false, znuPerUnit: 50, unit: 'referral', lastCalculated: 0 },
          { key: 'educacion', name: 'Educación regenerativa (ZNU)', enabled: false, znuPerUnit: 100, unit: 'course', lastCalculated: 0 }
        ],
        payouts: []
      },
      auditLog: []
    }
  }

  // ============================================
  // CUENTAS
  // ============================================

  createAccount(memberId: string): ZNUAccount {
    if (this.state.accounts.has(memberId)) {
      throw new Error(`Cuenta ZNU ya existe para ${memberId}`)
    }

    const account: ZNUAccount = {
      memberId,
      balance: 0,
      earned: 0,
      spent: 0,
      demurraged: 0,
      movements: [],
      status: 'active',
      lastDemurrageAt: Date.now()
    }

    this.state.accounts.set(memberId, account)
    this.audit('account_creation', memberId, 'Cuenta ZNU creada', { memberId })
    return account
  }

  getAccount(memberId: string): ZNUAccount | undefined {
    return this.state.accounts.get(memberId)
  }

  getAllAccounts(): ZNUAccount[] {
    return Array.from(this.state.accounts.values())
  }

  // ============================================
  // MOVIMIENTOS / TRANSACCIONES
  // ============================================

  addMovement(memberId: string, movement: Omit<ZNUMovement, 'id'>): ZNUMovement {
    const account = this.state.accounts.get(memberId)
    if (!account) throw new Error(`Cuenta no encontrada: ${memberId}`)
    if (account.status !== 'active') throw new Error(`Cuenta no activa`)

    const fullMovement: ZNUMovement = {
      ...movement,
      id: `znu_mov_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    }

    account.movements.push(fullMovement)
    account.balance += movement.amount

    if (movement.amount > 0) account.earned += movement.amount
    else account.spent += Math.abs(movement.amount)

    return fullMovement
  }

  transfer(from: string, to: string, amount: number, description: string): ZNUTransaction {
    const fromAccount = this.state.accounts.get(from)
    const toAccount = this.state.accounts.get(to)
    if (!fromAccount || !toAccount) throw new Error('Cuenta no encontrada')
    if (fromAccount.balance < amount) throw new Error('Saldo insuficiente')
    if (amount <= 0) throw new Error('Monto inválido')

    this.addMovement(from, { type: 'transfer_out', amount: -amount, counterparty: to, description, timestamp: Date.now() })
    this.addMovement(to, { type: 'transfer_in', amount, counterparty: from, description, timestamp: Date.now() })

    const tx: ZNUTransaction = {
      id: `znu_tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      from,
      to,
      amount,
      type: 'transfer',
      status: 'completed',
      timestamp: Date.now(),
      completedAt: Date.now()
    }

    this.state.transactions.push(tx)
    this.audit('transaction', from, `Transferencia ZNU: ${amount}`, { txId: tx.id, from, to, amount })
    return tx
  }

  // ============================================
  // DEMURRAGE (Anti-acumulación)
  // ============================================

  applyDemurrage(): { affected: number; totalDemurraged: number } {
    const config = this.state.config
    const demurrage = this.state.demurrage
    const now = Date.now()

    if (!demurrage.enabled) return { affected: 0, totalDemurraged: 0 }
    if (now - demurrage.lastApplied < config.demurragePeriod) return { affected: 0, totalDemurraged: 0 }

    let totalDemurraged = 0
    const affectedAccounts: string[] = []

    for (const [memberId, account] of this.state.accounts) {
      if (account.status !== 'active') continue
      if (account.balance <= config.demurrageThreshold) continue

      const excess = account.balance - config.demurrageThreshold
      const demurrageAmount = excess * config.demurrageRate

      this.addMovement(memberId, {
        type: 'demurrage',
        amount: -demurrageAmount,
        description: `Demurrage aplicado: ${demurrageAmount.toFixed(2)} ZNU`,
        timestamp: now
      })

      account.demurraged += demurrageAmount
      totalDemurraged += demurrageAmount
      affectedAccounts.push(memberId)
    }

    demurrage.lastApplied = now
    demurrage.totalDemurraged += totalDemurraged
    demurrage.lastAffectedAccounts = affectedAccounts

    this.audit('demurrage', 'system', `Demurrage aplicado a ${affectedAccounts.length} cuentas: ${totalDemurraged.toFixed(2)} ZNU`, {
      affected: affectedAccounts.length,
      totalDemurraged,
      accounts: affectedAccounts
    })

    return { affected: affectedAccounts.length, totalDemurraged }
  }

  // ============================================
  // PRICE PARITY (Oráculo ReFi Nivel 3)
  // ============================================

  updatePriceParity(newPrice: number, source: ZNUPriceParity['source'] = 'refi_oracle_nivel3'): void {
    const parity = this.state.priceParity
    const deviation = Math.abs(newPrice - parity.current) / parity.current

    if (deviation > parity.maxDeviation) {
      this.audit('price_parity_update', 'oracle', `ALERTA: Desviación price parity > ${parity.maxDeviation * 100}%`, {
        old: parity.current,
        new: newPrice,
        deviation,
        source
      })
    }

    parity.current = newPrice
    parity.source = source
    parity.lastUpdated = now()
    parity.history.push({ price: newPrice, timestamp: now(), source })

    // Mantener solo últimos 1000 puntos
    if (parity.history.length > 1000) parity.history.shift()

    this.audit('price_parity_update', 'oracle', `Price parity actualizado: 1 ZNU = ${newPrice} USDC`, {
      price: newPrice,
      source
    })
  }

  getPriceParity(): number {
    return this.state.priceParity.current
  }

  // ============================================
  // CONVERSIÓN ZNU <-> USDC (Solo modo conectado)
  // ============================================

  convertZNUtoUSDC(memberId: string, znuAmount: number): { usdcAmount: number; txId: string } | null {
    const config = this.state.config
    if (config.nodeMode !== 'conectado') {
      this.audit('conversion', memberId, 'INTENTO BLOQUEADO: Conversión solo permitida en modo conectado', {
        memberId,
        znuAmount,
        nodeMode: config.nodeMode
      })
      return null
    }

    const account = this.state.accounts.get(memberId)
    if (!account || account.balance < znuAmount) return null

    const priceParity = this.state.priceParity.current
    const usdcAmount = znuAmount * priceParity

    if (usdcAmount > config.conversionLimitPerPeriod) {
      this.audit('conversion', memberId, 'INTENTO BLOQUEADO: Límite conversión excedido', {
        memberId,
        usdcAmount,
        limit: config.conversionLimitPerPeriod
      })
      return null
    }

    this.addMovement(memberId, {
      type: 'conversion',
      amount: -znuAmount,
      usdcAmount,
      priceParityAtTime: priceParity,
      description: `Conversión ZNU -> USDC: ${znuAmount} ZNU = ${usdcAmount} USDC`,
      timestamp: now()
    })

    const tx: ZNUTransaction = {
      id: `znu_conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      from: memberId,
      to: 'external_usdc',
      amount: znuAmount,
      type: 'conversion',
      status: 'completed',
      timestamp: now(),
      completedAt: now(),
      metadata: { usdcAmount, priceParity }
    }

    this.state.transactions.push(tx)
    this.audit('conversion', memberId, `Conversión: ${znuAmount} ZNU -> ${usdcAmount} USDC`, { txId: tx.id })
    return { usdcAmount, txId: tx.id }
  }

  // ============================================
  // CAAS INTEGRATION
  // ============================================

  calculateCaasPayout(memberId: string, autVectors: CACVectors, cdsScore: number): number {
    const config = this.state.config
    const streams = this.state.caasIntegration.revenueStreams.filter(s => s.enabled)
    let totalZNU = 0

    for (const stream of streams) {
      let units = 0
      switch (stream.key) {
        case 'suscripcion':
          units = 1 // por miembro/mes
          break
        case 'revenue_share':
          // Basado en AUT (autFromCAC)
          units = Math.max(autFromCAC(autVectors) * 100, 0)
          break
        case 'b2b':
          // Basado en transacciones ValueFlows - se calcula externamente
          units = 0
          break
      }
      totalZNU += units * stream.znuPerUnit
      stream.lastCalculated = now()
    }

    if (totalZNU > 0) {
      this.addMovement(memberId, {
        type: 'caas_payout',
        amount: totalZNU,
        description: `CaaS payout: ${totalZNU} ZNU`,
        timestamp: now()
      })

      const payout: ZNUCaaSPayout = {
        id: `znu_payout_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        memberId,
        amount: totalZNU,
        streamKey: 'multiple',
        timestamp: now(),
        transactionId: `znu_tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      }

      this.state.caasIntegration.payouts.push(payout)
      this.audit('caas_payout', memberId, `CaaS payout: ${totalZNU} ZNU`, { payoutId: payout.id })
    }

    return totalZNU
  }

  // ============================================
  // CONFIGURACIÓN MODO ANFIBIO
  // ============================================

  setNodeMode(mode: 'postmonetario' | 'conectado'): void {
    const oldMode = this.state.config.nodeMode
    this.state.config.nodeMode = mode
    this.state.config.allowConversion = mode === 'conectado'

    this.audit('config_change', 'system', `Modo anfibio cambiado: ${oldMode} -> ${mode}`, {
      oldMode,
      newMode: mode,
      allowConversion: this.state.config.allowConversion
    })
  }

  getNodeMode(): 'postmonetario' | 'conectado' {
    return this.state.config.nodeMode
  }

  // ============================================
  // AUDITORÍA
  // ============================================

  private audit(type: ZNUAuditEntry['type'], actorId: string, description: string, details: Record<string, any>): void {
    const entry: ZNUAuditEntry = {
      id: `znu_audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type,
      actorId,
      description,
      details,
      timestamp: now(),
      severity: type === 'conversion' && details.blocked ? 'critical' : 'info'
    }
    this.state.auditLog.push(entry)
  }

  getAuditLog(): ZNUAuditEntry[] {
    return [...this.state.auditLog].sort((a, b) => b.timestamp - a.timestamp)
  }

  // ============================================
  // GETTERS
  // ============================================

  getState(): ZNUState {
    return this.state
  }

  getConfig(): ZNUConfig {
    return { ...this.state.config }
  }

  getPriceParityState(): ZNUPriceParity {
    return { ...this.state.priceParity }
  }

  getDemurrageState(): ZNUDemurrage {
    return { ...this.state.demurrage }
  }

  getCaasIntegration(): ZNUCaaSIntegration {
    return {
      revenueStreams: [...this.state.caasIntegration.revenueStreams],
      payouts: [...this.state.caasIntegration.payouts]
    }
  }
}

// ============================================
// HELPERS
// ============================================

function now(): number {
  return Date.now()
}

function autFromCAC(cac: CACVectors): number {
  const values = Object.values(cac).filter(v => v > 0)
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

// ============================================
// FACTORY
// ============================================

export function makeZNUState(): ZNUState {
  const engine = new ZNUEngine()
  return engine.getState()
}

// ============================================
// EXPORTS
// ============================================

export const znuEngine = new ZNUEngine()
export default { ZNUEngine, makeZNUState, znuEngine }