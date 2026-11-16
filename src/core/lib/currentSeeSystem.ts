// HSCSG v15 OS — Current-See System (OVN 3.0 / Arthur Brock)
// Universal Flow Language: grades, credits, ratings, certifications, TQ, CaaS credits unified
// D39: Current-sees = Universal Flow Language — unifica TQ, CaaS, ratings, certifications
// Capa 3: Operación Productiva

import type { CurrentSee, ConversionContext, MarketConditions, FlowType } from '@core/lib/valueTheory'
import { uid, now } from '@core/lib/utils'

// ============================================
// CURRENT-SEE REGISTRY (Extended from ValueTheory)
// ============================================

/**
 * Extended Current-See with full metadata for system integration
 */
export interface ExtendedCurrentSee extends CurrentSee {
  // Registry metadata
  category: 'energy' | 'financial' | 'utility' | 'reputation' | 'care' | 'knowledge' | 'social' | 'governance' | 'custom'
  // Issuance
  issuer: 'system' | 'network' | 'venture' | 'custodian' | 'external' | 'peer'
  issuancePolicy: IssuancePolicy
  // Redemption
  redeemable: boolean
  redemptionOptions: RedemptionOption[]
  // Demurrage (anti-acumulación, Ley II MJ)
  demurrage: DemurrageConfig
  // Governance
  governanceEquationId?: string
  // Interoperability
  valueFlowsCompatible: boolean
  semanticWebURI?: string // RDF/OWL URI
}

export interface IssuancePolicy {
  type: 'automatic' | 'manual' | 'algorithmic' | 'peer_review' | 'sensor_verified'
  criteria: string[] // human-readable criteria
  maxSupply?: number
  issuanceRate?: number // per period
  period?: number // days
}

export interface RedemptionOption {
  targetCurrentSee: string
  rate: number // 1 source = rate target
  conditions: string[]
  fee?: number
  feeCurrency?: string
}

export interface DemurrageConfig {
  enabled: boolean
  threshold: number // amount before demurrage applies
  rate: number // per period (e.g., 0.05 = 5% per period)
  period: number // days
  gracePeriod: number // days before demurrage starts
}

// ============================================
// CURRENT-SEE SYSTEM ENGINE
// ============================================

export class CurrentSeeSystemEngine {
  private currentSees: Map<string, ExtendedCurrentSee> = new Map()
  private balances: Map<string, Map<string, number>> = new Map() // currentSeeId -> affiliateId -> balance
  private transactions: CurrentSeeTransaction[] = []
  private priceParityOracle: PriceParityOracle
  private demurrageEngine: DemurrageEngine

  constructor() {
    this.priceParityOracle = new PriceParityOracle()
    this.demurrageEngine = new DemurrageEngine(this)
    this.initializeBaseCurrentSees()
  }

  private initializeBaseCurrentSees(): void {
    // TQ = 1 kWh universal denominator (D1, D39)
    this.registerCurrentSee({
      id: 'TQ',
      name: 'Time-Quantum',
      symbol: 'TQ',
      description: 'Universal energy denominator: 1 TQ = 1 kWh. Base unit for all valuations.',
      flowTypes: ['energy', 'labor'],
      toTQ: (amount) => amount,
      fromTQ: (tq) => tq,
      antiRival: false,
      reversible: true,
      contextDependent: false,
      category: 'energy',
      issuer: 'system',
      issuancePolicy: {
        type: 'algorithmic',
        criteria: ['Energy production measured by sensors', 'Labor hours verified by peer review'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'ZNU', rate: 1, conditions: ['Internal exchange'] },
        { targetCurrentSee: 'USDC', rate: 0.001, conditions: ['Market bridge via Exchange Firm'] },
      ],
      demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
      governanceEquationId: 'gea_tq_issuance',
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#TQ',
    })

    // ZNU - Community currency / CaaS credits
    this.registerCurrentSee({
      id: 'ZNU',
      name: 'ZNU Credit',
      symbol: 'ZNU',
      description: 'Community currency for CaaS access, internal exchange, and benefit redistribution.',
      flowTypes: ['financial', 'utility'],
      toTQ: (amount, ctx) => amount * (ctx.marketConditions?.priceParity?.get('ZNU') || 1),
      fromTQ: (tq, ctx) => tq / (ctx.marketConditions?.priceParity?.get('ZNU') || 1),
      antiRival: false,
      reversible: true,
      contextDependent: true,
      category: 'financial',
      issuer: 'network',
      issuancePolicy: {
        type: 'algorithmic',
        criteria: ['Benefit redistribution algorithm', 'CaaS credit pool rewards', 'Governance participation'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'TQ', rate: 1, conditions: ['Internal valuation'] },
        { targetCurrentSee: 'USDC', rate: 0.001, conditions: ['Market bridge', 'Exchange Firm approval'] },
        { targetCurrentSee: 'CARE', rate: 10, conditions: ['Care work exchange'] },
      ],
      demurrage: { enabled: true, threshold: 300, rate: 0.05, period: 30, gracePeriod: 7 },
      governanceEquationId: 'gea_znu_issuance',
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#ZNU',
    })

    // USDC - External market bridge
    this.registerCurrentSee({
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      description: 'Stablecoin for market interface via Exchange Firm (D27).',
      flowTypes: ['financial'],
      toTQ: (amount, ctx) => amount * (ctx.marketConditions?.priceParity?.get('USDC') || 0.001),
      fromTQ: (tq, ctx) => tq / (ctx.marketConditions?.priceParity?.get('USDC') || 0.001),
      antiRival: false,
      reversible: true,
      contextDependent: true,
      category: 'financial',
      issuer: 'external',
      issuancePolicy: { type: 'manual', criteria: ['Market purchase', 'Revenue from Exchange Firm'] },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'TQ', rate: 1000, conditions: ['TQ valuation'] },
        { targetCurrentSee: 'ZNU', rate: 1000, conditions: ['Internal exchange'] },
      ],
      demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#USDC',
    })

    // CARE - Care Flow (anti-rival, D50)
    this.registerCurrentSee({
      id: 'CARE',
      name: 'Care Flow',
      symbol: 'CARE',
      description: 'Care work hours - anti-rival, gains value through sharing (D50).',
      flowTypes: ['care'],
      toTQ: (amount) => amount * 0.08,
      fromTQ: (tq) => tq / 0.08,
      antiRival: true,
      reversible: false,
      contextDependent: true,
      category: 'care',
      issuer: 'peer',
      issuancePolicy: {
        type: 'peer_review',
        criteria: ['Care hours verified by recipient', 'Community acknowledgment'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'ZNU', rate: 0.1, conditions: ['Care credit exchange'] },
        { targetCurrentSee: 'TQ', rate: 12.5, conditions: ['Energy equivalent'] },
      ],
      demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#CARE',
    })

    // Reputation Dimensions (D5: Informative only, no global score)
    const repDimensions = [
      { id: 'REP_QUALITY', name: 'Reputation Quality', symbol: 'REP_Q', desc: 'Quality of work (0-1)', intensity: 10 },
      { id: 'REP_COMMITMENT', name: 'Reputation Commitment', symbol: 'REP_C', desc: 'Commitment reliability (0-1)', intensity: 8 },
      { id: 'REP_REGULARITY', name: 'Reputation Regularity', symbol: 'REP_R', desc: 'Consistency over time (0-1)', intensity: 6 },
      { id: 'REP_COLLABORATION', name: 'Reputation Collaboration', symbol: 'REP_L', desc: 'Collaborative behavior (0-1)', intensity: 7 },
      { id: 'REP_INNOVATION', name: 'Reputation Innovation', symbol: 'REP_I', desc: 'Innovative contributions (0-1)', intensity: 12 },
    ]

    for (const dim of repDimensions) {
      this.registerCurrentSee({
        id: dim.id,
        name: dim.name,
        symbol: dim.symbol,
        description: dim.desc,
        flowTypes: ['reputation'],
        toTQ: (amount) => amount * dim.intensity,
        fromTQ: (tq) => tq / dim.intensity,
        antiRival: false,
        reversible: true,
        contextDependent: true,
        category: 'reputation',
        issuer: 'network',
        issuancePolicy: {
          type: 'algorithmic',
          criteria: [`${dim.name} dimension calculated from validated contributions`],
        },
        redeemable: false, // not redeemable, only informative
        redemptionOptions: [],
        demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
        valueFlowsCompatible: true,
        semanticWebURI: `http://hscsg.org/ontology#${dim.id}`,
      })
    }

    // CaaS Credits (D2: Hybrid earning/spending)
    this.registerCurrentSee({
      id: 'CAAS_BASIC',
      name: 'CaaS Basic Credit',
      symbol: 'CAAS_B',
      description: 'Basic CaaS service access credit (DIY Kit, Component, Calibration, Education, Ecosystem Service, Trust Framework).',
      flowTypes: ['utility'],
      toTQ: (amount, ctx) => amount * (ctx.marketConditions?.priceParity?.get('CAAS_BASIC') || 0.5),
      fromTQ: (tq, ctx) => tq / (ctx.marketConditions?.priceParity?.get('CAAS_BASIC') || 0.5),
      antiRival: false,
      reversible: true,
      contextDependent: true,
      category: 'utility',
      issuer: 'network',
      issuancePolicy: {
        type: 'algorithmic',
        criteria: ['CaaS credit pool rewards', 'Contribution flows', 'Governance participation'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'TQ', rate: 2, conditions: ['CaaS service redemption'] },
        { targetCurrentSee: 'ZNU', rate: 1, conditions: ['Internal exchange'] },
      ],
      demurrage: { enabled: true, threshold: 100, rate: 0.03, period: 30, gracePeriod: 7 },
      governanceEquationId: 'gea_caas_issuance',
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#CAAS_BASIC',
    })

    // Certification Current-Sees (grades, degrees, certifications)
    this.registerCurrentSee({
      id: 'CERT_FABSHIP',
      name: 'FABSHIP Certification',
      symbol: 'CERT_FS',
      description: 'FABSHIP component certification - verifies critical component production capability.',
      flowTypes: ['knowledge'],
      toTQ: (amount) => amount * 50, // high value certification
      fromTQ: (tq) => tq / 50,
      antiRival: false,
      reversible: false,
      contextDependent: true,
      category: 'knowledge',
      issuer: 'custodian',
      issuancePolicy: {
        type: 'sensor_verified',
        criteria: ['Physical component tested', 'Meets FABSHIP specs', 'Registered in resource registry'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'REP_QUALITY', rate: 0.02, conditions: ['Quality reputation boost'] },
        { targetCurrentSee: 'CAAS_BASIC', rate: 5, conditions: ['CaaS credit for certified production'] },
      ],
      demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#CERT_FABSHIP',
    })

    this.registerCurrentSee({
      id: 'CERT_ORGANIC',
      name: 'Organic Certification',
      symbol: 'CERT_ORG',
      description: 'Ecological/organic production certification (USDA Organic equivalent).',
      flowTypes: ['knowledge'],
      toTQ: (amount) => amount * 30,
      fromTQ: (tq) => tq / 30,
      antiRival: false,
      reversible: false,
      contextDependent: true,
      category: 'knowledge',
      issuer: 'external',
      issuancePolicy: {
        type: 'manual',
        criteria: ['Third-party audit', 'Regenerative practices verified', 'Soil health metrics met'],
      },
      redeemable: true,
      redemptionOptions: [
        { targetCurrentSee: 'REP_QUALITY', rate: 0.01, conditions: ['Ecological quality reputation'] },
      ],
      demurrage: { enabled: false, threshold: 0, rate: 0, period: 0, gracePeriod: 0 },
      valueFlowsCompatible: true,
      semanticWebURI: 'http://hscsg.org/ontology#CERT_ORGANIC',
    })
  }

  // ============================================
  // REGISTRY
  // ============================================

  registerCurrentSee(currentSee: ExtendedCurrentSee): void {
    this.currentSees.set(currentSee.id, currentSee)
    // Initialize balance map
    if (!this.balances.has(currentSee.id)) {
      this.balances.set(currentSee.id, new Map())
    }
  }

  getCurrentSee(id: string): ExtendedCurrentSee | undefined {
    return this.currentSees.get(id)
  }

  getAllCurrentSees(): ExtendedCurrentSee[] {
    return Array.from(this.currentSees.values())
  }

  getCurrentSeesByCategory(category: ExtendedCurrentSee['category']): ExtendedCurrentSee[] {
    return Array.from(this.currentSees.values()).filter(cs => cs.category === category)
  }

  // ============================================
  // BALANCE MANAGEMENT
  // ============================================

  getBalance(currentSeeId: string, affiliateId: string): number {
    return this.balances.get(currentSeeId)?.get(affiliateId) || 0
  }

  getAllBalances(affiliateId: string): Map<string, number> {
    const result = new Map<string, number>()
    for (const [seeId, balances] of this.balances) {
      const balance = balances.get(affiliateId)
      if (balance && balance > 0) {
        result.set(seeId, balance)
      }
    }
    return result
  }

  credit(currentSeeId: string, affiliateId: string, amount: number, reason: string, referenceId?: string): CurrentSeeTransaction {
    const balances = this.balances.get(currentSeeId) || new Map()
    const currentBalance = balances.get(affiliateId) || 0
    balances.set(affiliateId, currentBalance + amount)
    this.balances.set(currentSeeId, balances)

    const tx: CurrentSeeTransaction = {
      id: uid(),
      currentSeeId,
      affiliateId,
      type: 'credit',
      amount,
      balanceAfter: currentBalance + amount,
      reason,
      referenceId,
      timestamp: now(),
    }
    this.transactions.push(tx)
    return tx
  }

  debit(currentSeeId: string, affiliateId: string, amount: number, reason: string, referenceId?: string): CurrentSeeTransaction | null {
    const balances = this.balances.get(currentSeeId)
    if (!balances) return null

    const currentBalance = balances.get(affiliateId) || 0
    if (currentBalance < amount) return null

    balances.set(affiliateId, currentBalance - amount)

    const tx: CurrentSeeTransaction = {
      id: uid(),
      currentSeeId,
      affiliateId,
      type: 'debit',
      amount,
      balanceAfter: currentBalance - amount,
      reason,
      referenceId,
      timestamp: now(),
    }
    this.transactions.push(tx)
    return tx
  }

  transfer(fromAffiliateId: string, toAffiliateId: string, currentSeeId: string, amount: number, reason: string): { debit: CurrentSeeTransaction; credit: CurrentSeeTransaction } | null {
    const debitTx = this.debit(currentSeeId, fromAffiliateId, amount, `Transfer to ${toAffiliateId}: ${reason}`)
    if (!debitTx) return null

    const creditTx = this.credit(currentSeeId, toAffiliateId, amount, `Transfer from ${fromAffiliateId}: ${reason}`, debitTx.id)
    return { debit: debitTx, credit: creditTx }
  }

  // ============================================
  // CONVERSION (via TQ)
  // ============================================

  convert(amount: number, from: string, to: string, context: ConversionContext): number {
    const fromSee = this.currentSees.get(from)
    const toSee = this.currentSees.get(to)
    if (!fromSee || !toSee) throw new Error(`Unknown current-see: ${from} or ${to}`)

    const tq = fromSee.toTQ(amount, context)
    return toSee.fromTQ(tq, context)
  }

  // ============================================
  // DEMURRAGE (Ley II MJ: anti-acumulación)
  // ============================================

  applyDemurrage(currentSeeId: string): DemurrageResult[] {
    const see = this.currentSees.get(currentSeeId)
    if (!see || !see.demurrage.enabled) return []

    return this.demurrageEngine.applyDemurrage(currentSeeId)
  }

  runAllDemurrage(): DemurrageResult[] {
    const results: DemurrageResult[] = []
    for (const [seeId, see] of this.currentSees) {
      if (see.demurrage.enabled) {
        results.push(...this.demurrageEngine.applyDemurrage(seeId))
      }
    }
    return results
  }

  // ============================================
  // TRANSACTION HISTORY
  // ============================================

  getTransactions(currentSeeId?: string, affiliateId?: string, limit = 100): CurrentSeeTransaction[] {
    let filtered = this.transactions
    if (currentSeeId) filtered = filtered.filter(t => t.currentSeeId === currentSeeId)
    if (affiliateId) filtered = filtered.filter(t => t.affiliateId === affiliateId)
    return filtered.slice(-limit).reverse()
  }

  // ============================================
  // PRICE PARITY ORACLE
  // ============================================

  getPriceParityOracle(): PriceParityOracle {
    return this.priceParityOracle
  }

  updateMarketConditions(conditions: MarketConditions): void {
    this.priceParityOracle.updateConditions(conditions)
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      currentSees: Array.from(this.currentSees.entries()),
      balances: Array.from(this.balances.entries()).map(([k, v]) => [k, Array.from(v.entries())]),
      transactions: this.transactions,
    }, null, 2)
  }

  static fromJSON(json: string): CurrentSeeSystemEngine {
    const data = JSON.parse(json)
    const engine = new CurrentSeeSystemEngine()
    engine.currentSees = new Map(data.currentSees)
    engine.balances = new Map(data.balances.map(([k, v]: [string, [string, number][]]) => [k, new Map(v)]))
    engine.transactions = data.transactions
    return engine
  }
}

// ============================================
// SUPPORTING CLASSES
// ============================================

export interface CurrentSeeTransaction {
  id: string
  currentSeeId: string
  affiliateId: string
  type: 'credit' | 'debit' | 'transfer' | 'conversion' | 'demurrage'
  amount: number
  balanceAfter: number
  reason: string
  referenceId?: string
  timestamp: number
}

export interface DemurrageResult {
  currentSeeId: string
  affiliateId: string
  amountBefore: number
  demurrageApplied: number
  amountAfter: number
  timestamp: number
}

class DemurrageEngine {
  private system: CurrentSeeSystemEngine

  constructor(system: CurrentSeeSystemEngine) {
    this.system = system
  }

  applyDemurrage(currentSeeId: string): DemurrageResult[] {
    const see = this.system.currentSees.get(currentSeeId)
    if (!see || !see.demurrage.enabled) return []

    const balances = this.system.balances.get(currentSeeId)
    if (!balances) return []

    const results: DemurrageResult[] = []
    const now_ts = now()

    for (const [affiliateId, balance] of balances) {
      if (balance <= see.demurrage.threshold) continue

      // Check grace period (would track last activity per affiliate)
      // Simplified: apply if balance > threshold
      const excess = balance - see.demurrage.threshold
      const demurrageAmount = excess * see.demurrage.rate

      if (demurrageAmount > 0) {
        balances.set(affiliateId, balance - demurrageAmount)
        results.push({
          currentSeeId,
          affiliateId,
          amountBefore: balance,
          demurrageApplied: demurrageAmount,
          amountAfter: balance - demurrageAmount,
          timestamp: now_ts,
        })
      }
    }

    return results
  }
}

class PriceParityOracle {
  private conditions: MarketConditions = {
    priceParity: new Map([
      ['ZNU', 1],
      ['USDC', 0.001],
      ['EUR', 0.0009],
      ['CAAS_BASIC', 0.5],
      ['CARE', 0.08],
    ]),
    liquidity: new Map(),
    volatility: new Map(),
  }

  updateConditions(conditions: MarketConditions): void {
    this.conditions = conditions
  }

  getPriceParity(from: string, to: string): number {
    const fromPrice = this.conditions.priceParity.get(from) || 1
    const toPrice = this.conditions.priceParity.get(to) || 1
    return fromPrice / toPrice
  }
}

// ============================================
// EXPORTS
// ============================================

export const currentSeeSystemEngine = new CurrentSeeSystemEngine()