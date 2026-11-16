// HSCSG v15 OS — TQ (Transducción Quántica) State
// Capa 1: Autonomía/Regeneración/Continuidad — Contabilidad energética base
// 1 TQ = 1 kWh (fijo, sin tasa de cambio, no se compra/vende por fiat/cripto)
// Incompatibilidades con Gaia codificadas como límites duros (boundaries)

import type { BaseMaterial, CACVectors } from '@core/state/types'

// ============================================
// TQ TYPES
// ============================================

export interface TQState {
  // Catálogo de bienes/servicios con precio TQ fijo
  catalog: TQCatalogEntry[]
  // Cuentas TQ: todas empiezan en CERO (sin capital externo)
  accounts: Map<string, TQAccount>
  // Transacciones procesadas (sin comisiones no autorizadas)
  transactions: TQTransaction[]
  // Gobernanza: una persona = un voto (no ponderado por tokens)
  governance: TQGovernance
  // Configuración inmutable
  config: TQConfig
  // Historial de auditoría
  auditLog: TQAuditEntry[]
}

export interface TQConfig {
  // 1 TQ = 1 kWh (INMUTABLE)
  tqPerKWh: 1
  // Precio = energía incorporada + materiales + horas (Manual 2.2 C)
  pricingFormula: 'embodied_energy + materials + labor_hours'
  // Precios fijos en catálogo, NUNCA se negocian al vender
  fixedPrices: true
  // Sin comisiones sobre transacciones (Reglamento art. 10e)
  zeroCommissions: true
  // Sin capital externo: cuentas empiezan en 0 (Libro 8.1)
  noExternalCapital: true
  // Gobernanza: 1 persona = 1 voto (Manual 13.3)
  onePersonOneVote: true
  // Sin tasa de cambio con fiat/cripto (Libro 7.4)
  noExchangeRate: true
  // No compra/venta de TQ por dinero fiduciario/cripto
  noBuySellForFiatOrCrypto: true
}

export interface TQCatalogEntry {
  id: string
  name: string
  description: string
  // Precio TQ calculado: energía incorporada (kWh) + materiales (TQ) + horas (TQ)
  priceTQ: number
  priceBreakdown: TQPriceBreakdown
  // Unidad de medida
  unit: string
  // Proveedor/creador
  providerId: string
  // Categoría
  category: 'goods' | 'services' | 'energy' | 'materials' | 'labor' | 'knowledge'
  // Disponible
  available: boolean
  // Fecha creación
  createdAt: number
  // Inmutable una vez publicado
  immutable: boolean
}

export interface TQPriceBreakdown {
  // Energía incorporada en kWh = TQ
  embodiedEnergyKWh: number
  // Materiales en TQ (precio TQ de insumos)
  materialsTQ: number
  // Horas de trabajo en TQ (1 hora = X TQ según tabla de referencia)
  laborHoursTQ: number
  // Total = suma de los tres (sin markup, sin negociación)
  totalTQ: number
  // Referencia a tabla de equivalencia horas-TQ
  laborReferenceTable: string
}

export interface TQAccount {
  agentId: string
  // Balance TQ (empieza en 0, sin capital externo)
  balance: number
  // Historial de movimientos
  movements: TQMovement[]
  // Votos en gobernanza (1 por persona)
  voteWeight: 1
  // Miembro desde
  memberSince: number
  // Estado
  status: 'active' | 'frozen' | 'closed'
}

export interface TQMovement {
  id: string
  type: 'credit' | 'debit' | 'transfer_in' | 'transfer_out' | 'production' | 'consumption'
  amount: number
  counterparty?: string
  transactionId?: string
  description: string
  timestamp: number
}

export interface TQTransaction {
  id: string
  from: string
  to: string
  catalogEntryId: string
  quantity: number
  totalTQ: number
  // SIN COMISIÓN (Reglamento art. 10e)
  commission: 0
  // Estado
  status: 'pending' | 'completed' | 'cancelled' | 'disputed'
  // Timestamps
  createdAt: number
  completedAt?: number
  // Verificación
  verifiedBy: 'buyer' | 'seller' | 'mutual' | 'arbitration'
}

export interface TQGovernance {
  // Propuestas activas
  proposals: TQProposal[]
  // Historial de votaciones
  voteHistory: TQVote[]
  // Próximo ID de propuesta
  nextProposalId: number
}

export interface TQProposal {
  id: number
  title: string
  description: string
  proposerId: string
  type: 'parameter_change' | 'catalog_addition' | 'governance_rule' | 'emergency' | 'other'
  status: 'draft' | 'voting' | 'passed' | 'rejected' | 'executed'
  // Votos: 1 persona = 1 voto (no ponderado por balance TQ)
  votes: Map<string, 'yes' | 'no' | 'abstain'>
  // Umbral: mayoría simple de miembros activos
  threshold: number
  createdAt: number
  votingEndsAt: number
  executedAt?: number
}

export interface TQVote {
  proposalId: number
  voterId: string
  vote: 'yes' | 'no' | 'abstain'
  timestamp: number
}

export interface TQAuditEntry {
  id: string
  type: 'transaction' | 'governance' | 'config_change' | 'boundary_violation_attempt'
  actorId: string
  description: string
  details: Record<string, any>
  timestamp: number
  severity: 'info' | 'warning' | 'critical'
}

// ============================================
// TQ ENGINE - Lógica de negocio con límites duros
// ============================================

export class TQEngine {
  private state: TQState
  private boundaries: any // BoundariesEngine

  constructor(boundariesEngine?: any) {
    this.boundaries = boundariesEngine
    this.state = this.createInitialState()
  }

  private createInitialState(): TQState {
    return {
      catalog: [],
      accounts: new Map(),
      transactions: [],
      governance: {
        proposals: [],
        voteHistory: [],
        nextProposalId: 1
      },
      config: {
        tqPerKWh: 1,
        pricingFormula: 'embodied_energy + materials + labor_hours',
        fixedPrices: true,
        zeroCommissions: true,
        noExternalCapital: true,
        onePersonOneVote: true,
        noExchangeRate: true,
        noBuySellForFiatOrCrypto: true
      },
      auditLog: []
    }
  }

  // ============================================
  // CATÁLOGO - Precios fijos, inmutables
  // ============================================

  /**
   * Agrega entrada al catálogo con precio TQ calculado
   * Precio = energía incorporada + materiales + horas (Manual 2.2 C)
   * UNA VEZ PUBLICADO: inmutable, no negociable
   */
  addCatalogEntry(entry: Omit<TQCatalogEntry, 'id' | 'createdAt' | 'immutable' | 'priceBreakdown' | 'totalTQ'> & {
    priceBreakdown: Omit<TQPriceBreakdown, 'totalTQ' | 'laborReferenceTable'>
  }): TQCatalogEntry {
    // Validar que no hay compra/venta por fiat
    this.assertNoFiatPricing(entry.priceBreakdown)

    const totalTQ = entry.priceBreakdown.embodiedEnergyKWh + entry.priceBreakdown.materialsTQ + entry.priceBreakdown.laborHoursTQ

    const catalogEntry: TQCatalogEntry = {
      ...entry,
      id: `tq_cat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      priceBreakdown: {
        ...entry.priceBreakdown,
        totalTQ,
        laborReferenceTable: 'TQ_Labor_Reference_v1'
      } as TQPriceBreakdown,
      priceTQ: totalTQ,
      createdAt: Date.now(),
      immutable: true
    }

    this.state.catalog.push(catalogEntry)
    this.audit('catalog_addition', entry.providerId, `Catálogo agregado: ${entry.name} = ${totalTQ} TQ`, { entryId: catalogEntry.id })
    return catalogEntry
  }

  /**
   * Obtiene entrada del catálogo (precio FIJO, no negociable)
   */
  getCatalogEntry(entryId: string): TQCatalogEntry | undefined {
    return this.state.catalog.find(e => e.id === entryId)
  }

  /**
   * Lista catálogo disponible
   */
  getAvailableCatalog(): TQCatalogEntry[] {
    return this.state.catalog.filter(e => e.available && e.immutable)
  }

  // ============================================
  // CUENTAS - Empiezan en CERO (Libro 8.1)
  // ============================================

  /**
   * Crea cuenta TQ para agente (balance = 0, sin capital externo)
   */
  createAccount(agentId: string): TQAccount {
    if (this.state.accounts.has(agentId)) {
      throw new Error(`Cuenta ya existe para ${agentId}`)
    }

    const account: TQAccount = {
      agentId,
      balance: 0, // SIEMPRE empieza en 0 (no capital externo)
      movements: [],
      voteWeight: 1, // 1 persona = 1 voto
      memberSince: Date.now(),
      status: 'active'
    }

    this.state.accounts.set(agentId, account)
    this.audit('account_creation', agentId, 'Cuenta TQ creada con balance 0', { agentId })
    return account
  }

  getAccount(agentId: string): TQAccount | undefined {
    return this.state.accounts.get(agentId)
  }

  getAllAccounts(): TQAccount[] {
    return Array.from(this.state.accounts.values())
  }

  // ============================================
  // TRANSACCIONES - SIN COMISIONES (Reglamento art. 10e)
  // ============================================

  /**
   * Ejecuta transacción TQ entre cuentas
   * REGLA DURA: commission = 0 siempre
   * Precio = catálogo (fijo, no negociable)
   */
  executeTransaction(
    fromAgentId: string,
    toAgentId: string,
    catalogEntryId: string,
    quantity: number
  ): TQTransaction {
    const fromAccount = this.state.accounts.get(fromAgentId)
    const toAccount = this.state.accounts.get(toAgentId)
    const catalogEntry = this.state.catalog.find(e => e.id === catalogEntryId)

    if (!fromAccount) throw new Error(`Cuenta origen no existe: ${fromAgentId}`)
    if (!toAccount) throw new Error(`Cuenta destino no existe: ${toAgentId}`)
    if (!catalogEntry) throw new Error(`Entrada catálogo no existe: ${catalogEntryId}`)
    if (!catalogEntry.available) throw new Error(`Entrada no disponible: ${catalogEntryId}`)
    if (fromAccount.status !== 'active') throw new Error(`Cuenta origen no activa`)
    if (toAccount.status !== 'active') throw new Error(`Cuenta destino no activa`)

    const totalTQ = catalogEntry.priceTQ * quantity

    // VERIFICAR LÍMITE DURO: SIN COMISIONES (Reglamento art. 10e)
    if (this.state.config.zeroCommissions !== true) {
      throw new Error('VIOLACIÓN LÍMITE DURO: Configuración de comisiones alterada')
    }

    // Verificar saldo suficiente
    if (fromAccount.balance < totalTQ) {
      throw new Error(`Saldo insuficiente: ${fromAccount.balance} TQ < ${totalTQ} TQ requeridos`)
    }

    // Crear transacción SIN COMISIÓN
    const transaction: TQTransaction = {
      id: `tq_tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      from: fromAgentId,
      to: toAgentId,
      catalogEntryId,
      quantity,
      totalTQ,
      commission: 0, // HARD CODED: SIEMPRE 0
      status: 'pending',
      createdAt: Date.now(),
      verifiedBy: 'mutual'
    }

    // Ejecutar movimientos
    this.addMovement(fromAgentId, {
      type: 'debit',
      amount: -totalTQ,
      counterparty: toAgentId,
      transactionId: transaction.id,
      description: `Compra: ${catalogEntry.name} x${quantity}`,
      timestamp: Date.now()
    })

    this.addMovement(toAgentId, {
      type: 'credit',
      amount: totalTQ,
      counterparty: fromAgentId,
      transactionId: transaction.id,
      description: `Venta: ${catalogEntry.name} x${quantity}`,
      timestamp: Date.now()
    })

    transaction.status = 'completed'
    transaction.completedAt = Date.now()
    this.state.transactions.push(transaction)

    this.audit('transaction', fromAgentId, `Transacción TQ: ${totalTQ} TQ (sin comisión)`, {
      transactionId: transaction.id,
      from: fromAgentId,
      to: toAgentId,
      entry: catalogEntryId,
      quantity,
      totalTQ
    })

    return transaction
  }

  private addMovement(agentId: string, movement: Omit<TQMovement, 'id'>): void {
    const account = this.state.accounts.get(agentId)
    if (!account) throw new Error(`Cuenta no encontrada: ${agentId}`)

    const fullMovement: TQMovement = {
      ...movement,
      id: `tq_mov_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    }

    account.movements.push(fullMovement)
    account.balance += movement.amount
  }

  // ============================================
  // GOBERNANZA - 1 PERSONA = 1 VOTO (Manual 13.3)
  // ============================================

  /**
   * Crea propuesta de gobernanza
   * Votos NO ponderados por balance TQ
   */
  createProposal(proposal: Omit<TQProposal, 'id' | 'votes' | 'status' | 'createdAt' | 'votingEndsAt' | 'threshold'>): TQProposal {
    const newProposal: TQProposal = {
      ...proposal,
      id: this.state.governance.nextProposalId++,
      votes: new Map(),
      status: 'draft',
      threshold: 0.5, // mayoría simple
      createdAt: Date.now(),
      votingEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 días
    }

    this.state.governance.proposals.push(newProposal)
    this.audit('governance', proposal.proposerId, `Propuesta creada: ${proposal.title}`, { proposalId: newProposal.id })
    return newProposal
  }

  /**
   * Vota en propuesta: 1 persona = 1 voto (independiente de balance TQ)
   */
  vote(proposalId: number, voterId: string, vote: 'yes' | 'no' | 'abstain'): boolean {
    const proposal = this.state.governance.proposals.find(p => p.id === proposalId)
    if (!proposal) throw new Error(`Propuesta no encontrada: ${proposalId}`)
    if (proposal.status !== 'voting') throw new Error(`Propuesta no en votación`)
    if (Date.now() > proposal.votingEndsAt) throw new Error(`Votación cerrada`)

    const voterAccount = this.state.accounts.get(voterId)
    if (!voterAccount) throw new Error(`Votante no tiene cuenta TQ: ${voterId}`)
    if (voterAccount.status !== 'active') throw new Error(`Votante no activo`)

    // REGLA DURA: 1 persona = 1 voto (voteWeight = 1 siempre, no ponderado por TQ)
    if (voterAccount.voteWeight !== 1) {
      throw new Error('VIOLACIÓN LÍMITE DURO: voteWeight alterado (debe ser 1)')
    }

    if (proposal.votes.has(voterId)) {
      throw new Error(`Ya votó: ${voterId}`)
    }

    proposal.votes.set(voterId, vote)

    this.state.governance.voteHistory.push({
      proposalId,
      voterId,
      vote,
      timestamp: Date.now()
    })

    // Verificar si pasó
    this.checkProposalResult(proposal)

    this.audit('governance', voterId, `Voto en propuesta ${proposalId}: ${vote}`, { proposalId, vote })
    return true
  }

  private checkProposalResult(proposal: TQProposal): void {
    const activeMembers = Array.from(this.state.accounts.values()).filter(a => a.status === 'active')
    const totalVotes = proposal.votes.size
    const yesVotes = Array.from(proposal.votes.values()).filter(v => v === 'yes').length
    const participationRate = totalVotes / activeMembers.length

    if (participationRate >= proposal.threshold) {
      if (yesVotes / totalVotes > 0.5) {
        proposal.status = 'passed'
      } else {
        proposal.status = 'rejected'
      }
    }
  }

  // ============================================
  // LÍMITES DUROS - Incompatibilidades con Gaia
  // ============================================

  /**
   * Verifica que no hay intento de precios en fiat/cripto
   */
  private assertNoFiatPricing(breakdown: Omit<TQPriceBreakdown, 'totalTQ' | 'laborReferenceTable'>): void {
    // Verificar que todos los componentes están en TQ/kWh, no en USD/USDC/cripto
    if (breakdown.embodiedEnergyKWh < 0) throw new Error('Energía incorporada no puede ser negativa')
    if (breakdown.materialsTQ < 0) throw new Error('Materiales TQ no puede ser negativo')
    if (breakdown.laborHoursTQ < 0) throw new Error('Horas trabajo TQ no puede ser negativo')
  }

  /**
   * INTENTO DE VIOLACIÓN: Detecta y bloquea intentos de integración incompatible con Gaia
   */
  checkBoundaryViolation(attempt: {
    type: 'gaia_platform_commission' | 'gaia_token_governance' | 'gaia_fiat_exchange' | 'gaia_external_capital' | 'gaia_price_negotiation' | 'gaia_elastic_supply'
    actorId: string
    details: Record<string, any>
  }): { blocked: boolean; reason: string; severity: 'critical' } {
    const violations: Record<string, string> = {
      'gaia_platform_commission': 'VIOLACIÓN REGLAMENTO ART. 10e: Gaia cobra comisiones (50%/30%/10%) sobre transacciones. TQ prohíbe comisiones no autorizadas.',
      'gaia_token_governance': 'VIOLACIÓN MANUAL 13.3: Gaia usa gobernanza por tokens (CORE-G holders). TQ usa 1 persona = 1 voto, sin ponderar por tokens.',
      'gaia_fiat_exchange': 'VIOLACIÓN LIBRO 7.4: Gaia tiene GAIAUSD/CORE-U con tasa de cambio fiat/cripto. TQ = 1 kWh, sin tasa de cambio, no se compra/vende por fiat/cripto.',
      'gaia_external_capital': 'VIOLACIÓN LIBRO 8.1: Gaia depende de capital de inversores/subvenciones. TQ: todas las cuentas empiezan en CERO, sin capital externo.',
      'gaia_price_negotiation': 'VIOLACIÓN MANUAL 2.2 C: Gaia precios variables por proyecto (Panel 2). TQ precios fijos en catálogo = energía + materiales + horas, NUNCA se negocian.',
      'gaia_elastic_supply': 'VIOLACIÓN LIBRO 7.4: Gaia CORE-U oferta elástica según mercado. TQ oferta determinada por producción energética real, no elástica.'
    }

    const reason = violations[attempt.type]
    if (reason) {
      this.audit('boundary_violation_attempt', attempt.actorId, `INTENTO BLOQUEADO: ${attempt.type}`, {
        ...attempt.details,
        reason,
        blocked: true
      })
      return { blocked: true, reason, severity: 'critical' as const }
    }

    return { blocked: false, reason: 'No violation detected', severity: 'critical' as const }
  }

  /**
   * "Enlace visible simple" - Interoperabilidad SIN fusión
   * Permite referenciar catálogo TQ desde Gaia SIN procesar transacciones en Gaia
   */
  generateVisibleLink(catalogEntryId: string): { url: string; type: 'tq_catalog_reference'; entryId: string } {
    const entry = this.state.catalog.find(e => e.id === catalogEntryId)
    if (!entry) throw new Error(`Entrada no encontrada: ${catalogEntryId}`)

    // Enlace que SOLO referencia, NO redirige a plataforma de transacciones Gaia
    return {
      url: `tq://catalog/${catalogEntryId}`,
      type: 'tq_catalog_reference',
      entryId: catalogEntryId
    }
  }

  // ============================================
  // AUDITORÍA
  // ============================================

  private audit(type: TQAuditEntry['type'], actorId: string, description: string, details: Record<string, any>): void {
    const entry: TQAuditEntry = {
      id: `tq_audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type,
      actorId,
      description,
      details,
      timestamp: Date.now(),
      severity: type === 'boundary_violation_attempt' ? 'critical' : 'info'
    }
    this.state.auditLog.push(entry)
  }

  getAuditLog(): TQAuditEntry[] {
    return [...this.state.auditLog].sort((a, b) => b.timestamp - a.timestamp)
  }

  // ============================================
  // GETTERS
  // ============================================

  getState(): TQState {
    return this.state
  }

  getConfig(): TQConfig {
    return { ...this.state.config }
  }

  getCatalog(): TQCatalogEntry[] {
    return [...this.state.catalog]
  }

  getTransactions(): TQTransaction[] {
    return [...this.state.transactions]
  }

  getGovernance(): TQGovernance {
    return {
      proposals: [...this.state.governance.proposals],
      voteHistory: [...this.state.governance.voteHistory],
      nextProposalId: this.state.governance.nextProposalId
    }
  }
}

// ============================================
// FACTORY
// ============================================

export function makeTQState(): TQState {
  const engine = new TQEngine()
  return engine.getState()
}

// ============================================
// EXPORTS
// ============================================

export const tqEngine = new TQEngine()
export default { TQEngine, makeTQState, tqEngine }