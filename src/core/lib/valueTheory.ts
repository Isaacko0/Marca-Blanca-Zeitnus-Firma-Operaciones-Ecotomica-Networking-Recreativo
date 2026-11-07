// HSCSG v15 OS — Value Theory (OVN 3.0: Value Sovereignty, Relational Theory, Current-sees)
// Capa 3: Operación Productiva — teoría del valor para coordinación productiva
// Subordinada a Capas 1-2 (Autonomía/Regeneración, Gobernanza/Conocimiento)

import type { ValueFlow, VFType } from '@core/state/types'
import { uid, now } from '@core/lib/utils'

// ============================================
// VALUE THEORY CORE TYPES
// ============================================

/**
 * Value Sovereignty (OVN 3.0): "Autonomous agents collectively decide in context
 * how to link individual participation with distribution of benefits"
 * D38: Value Sovereignty = Affiliates Decide Participation↔Distribution
 */
export interface ValueSovereigntyContext {
  networkId: string
  ventureId?: string
  projectId?: string
  // The collective decision context
  participants: string[] // affiliate IDs
  decisionProcess: 'consensus' | 'majority' | 'weighted' | 'algorithmic'
  governanceEquationId: string
  // Constraints from Capas 1-2
  autonomyConstraints: AutonomyConstraint[]
  regenerationConstraints: RegenerationConstraint[]
  continuityConstraints: ContinuityConstraint[]
}

export interface AutonomyConstraint {
  id: string
  description: string
  metric: string
  threshold: number
  enforcement: 'hard' | 'soft' | 'advisory'
}

export interface RegenerationConstraint {
  id: string
  ecologicalIndicator: string
  target: number
  current: number
  enforcement: 'hard' | 'soft' | 'advisory'
}

export interface ContinuityConstraint {
  id: string
  description: string
  timeHorizon: number // generations (7 generations = ~200 years)
  enforcement: 'hard' | 'soft' | 'advisory'
}

/**
 * Relational Theory of Value (OVN 3.0 / Deep Dive: Re-imagining Value)
 * Value is not intrinsic to objects but emerges from relationships
 */
export interface RelationalValue {
  id: string
  name: string
  description: string
  // Relational aspects
  subjects: string[] // agents involved
  object: string // resource, process, outcome
  relationshipType: 'production' | 'care' | 'exchange' | 'governance' | 'learning' | 'regeneration'
  // Value dimensions (multi-value, not reducible to single metric)
  dimensions: ValueDimension[]
  // Context
  context: ValueSovereigntyContext
  timestamp: number
}

export interface ValueDimension {
  name: string
  type: 'material' | 'ecological' | 'social' | 'cognitive' | 'economic' | 'cultural'
  metric: string
  value: number
  unit: string
  weight: number // in this context
  reversible: boolean
}

/**
 * Working Definition of Value (OVN 3.0): "Value is what moves human beings into action"
 * Current-sees: any symbolic system that organizes flows
 */
export interface CurrentSee {
  id: string
  name: string
  symbol: string
  description: string
  // What flows it organizes
  flowTypes: FlowType[]
  // Conversion
  toTQ: (amount: number, context: ConversionContext) => number
  fromTQ: (tq: number, context: ConversionContext) => number
  // Properties
  antiRival: boolean // gains value through sharing (D50)
  reversible: boolean
  contextDependent: boolean
}

export type FlowType =
  | 'energy'       // kWh, TQ
  | 'material'     // kg, m3
  | 'labor'        // hours, TQ
  | 'knowledge'    // bits, insights
  | 'care'         // care-hours
  | 'attention'    // attention-minutes
  | 'reputation'   // dimensional scores
  | 'governance'   // voting weight
  | 'financial'    // USDC, EUR, ZNU
  | 'social'       // trust, relationships

export interface ConversionContext {
  fromCurrentSee: string
  toCurrentSee: string
  timestamp: number
  networkId: string
  ventureId?: string
  marketConditions?: MarketConditions
}

export interface MarketConditions {
  priceParity: Map<string, number> // currentSee -> USDC
  liquidity: Map<string, number>
  volatility: Map<string, number>
}

/**
 * Value Equation — links participation to distribution (project-level, local fairness)
 * OVNi 3.0: "evaluation and redistribution of benefits decided at project level, not network level"
 */
export interface ValueEquation {
  id: string
  name: string
  description: string
  ventureId: string
  // Input: participation vectors
  participationVectors: ParticipationVector[]
  // Output: distribution weights
  distributionLogic: DistributionLogic
  // Constraints
  constraints: EquationConstraint[]
  // Governance
  governedBy: string[] // affiliate IDs
  version: string
  createdAt: number
  updatedAt: number
}

export interface ParticipationVector {
  affiliateId: string
  // Multi-dimensional participation
  flows: Map<VFType, number>
  hours: number
  reputationDimensions: Map<string, number> // quality, commitment, regularity, collaboration, innovation
  resourceUsage: Map<string, number> // resourceId -> usage
  responsibility: number // custodianship, risk taken
  careWork: number // care hours
}

export interface DistributionLogic {
  type: 'weighted' | 'threshold' | 'formula' | 'algorithmic'
  formula?: string // TypeScript expression
  weights?: Map<string, number>
  algorithm?: string // reference to governance equation
}

export interface EquationConstraint {
  id: string
  type: 'minimum_share' | 'maximum_share' | 'floor' | 'ceiling' | 'proportionality' | 'regeneration'
  parameter: string
  value: number
  enforcement: 'hard' | 'soft'
}

/**
 * Multi-Value Incentive System (OVN 3.0: 5 models coexisting)
 * D40: Revenue/Equity/Utility/Reputation/Gift — user chooses per contribution
 */
export type IncentiveModelType =
  | 'revenue_based'     // immediate benefits (low risk)
  | 'equity_based'      // future benefits (higher risk)
  | 'utility_based'     // access to assets (medium risk)
  | 'reputation_based'  // recognition, governance access (low risk)
  | 'gift'              // altruistic, purpose-driven (irrelevant risk)

export interface IncentiveModel {
  type: IncentiveModelType
  name: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  // How participation translates to this incentive
  translationLogic: string
  // Current-sees this model uses
  currentSees: string[]
  // Eligibility
  eligibility: (affiliateId: string, context: ValueSovereigntyContext) => boolean
}

export const INCENTIVE_MODELS: Record<IncentiveModelType, IncentiveModel> = {
  revenue_based: {
    type: 'revenue_based',
    name: 'Revenue-Based',
    description: 'Contribute expecting immediate benefits from participation. Project already generating benefits.',
    riskLevel: 'low',
    translationLogic: 'Direct share of revenue streams proportional to contribution flows',
    currentSees: ['USDC', 'ZNU', 'TQ'],
    eligibility: (affiliateId, context) => true, // all eligible
  },
  equity_based: {
    type: 'equity_based',
    name: 'Equity-Based',
    description: 'Contribute without immediate reward, expecting future benefits.',
    riskLevel: 'high',
    translationLogic: 'Fluid equity (contribution → investment → equity) with dynamic valuation',
    currentSees: ['TQ', 'ZNU', 'fluid_equity'],
    eligibility: (affiliateId, context) => true,
  },
  utility_based: {
    type: 'utility_based',
    name: 'Utility-Based',
    description: 'Contribute to gain access to usable assets (workspaces, equipment, tools).',
    riskLevel: 'medium',
    translationLogic: 'Credits for resource access (CaaS credits, booking priority)',
    currentSees: ['CaaS_credits', 'booking_priority', 'access_tokens'],
    eligibility: (affiliateId, context) => true,
  },
  reputation_based: {
    type: 'reputation_based',
    name: 'Reputation-Based',
    description: 'Contribute for recognition, appreciation, visibility, relations, governance access.',
    riskLevel: 'low',
    translationLogic: 'Dimensional reputation scores (quality, commitment, regularity, collaboration, innovation)',
    currentSees: ['reputation_dimensions', 'badges', 'governance_weight'],
    eligibility: (affiliateId, context) => true,
  },
  gift: {
    type: 'gift',
    name: 'Gift',
    description: 'Altruistic contributions for sense of purpose.',
    riskLevel: 'low',
    translationLogic: 'No direct return; contributes to commons regeneration, community wellbeing',
    currentSees: ['care_flow', 'love_flow', 'social_capital'],
    eligibility: (affiliateId, context) => true,
  },
}

/**
 * Fluid Equity (OVN 3.0): "Any contribution as form of investment translated into fluid equity"
 * D41: Contribution → investment → equity fluida
 */
export interface FluidEquity {
  affiliateId: string
  ventureId: string
  // Equity as dynamic, not static shares
  equityVectors: EquityVector[]
  totalEquityTQ: number
  lastValuation: number
  valuationMethod: 'contribution_based' | 'revenue_based' | 'asset_based' | 'hybrid'
}

export interface EquityVector {
  id: string
  source: 'contribution' | 'investment' | 'custodianship' | 'care_work' | 'resource_provision'
  amountTQ: number
  timestamp: number
  // Dynamic: can be diluted, converted, redeemed
  status: 'active' | 'vesting' | 'redeemed' | 'diluted'
  vestingSchedule?: VestingSchedule
}

export interface VestingSchedule {
  startDate: number
  cliffDate?: number
  endDate: number
  schedule: 'linear' | 'graded' | 'milestone'
  milestones?: VestingMilestone[]
}

export interface VestingMilestone {
  date: number
  percentage: number
  condition: string
}

/**
 * Value Theory Engine — integrates all value concepts
 */
export class ValueTheoryEngine {
  private currentSees: Map<string, CurrentSee> = new Map()
  private valueEquations: Map<string, ValueEquation> = new Map()
  private fluidEquities: Map<string, FluidEquity> = new Map() // key: `${affiliateId}:${ventureId}`
  private priceParityOracle: PriceParityOracle

  constructor() {
    this.priceParityOracle = new PriceParityOracle()
    this.initializeBaseCurrentSees()
  }

  private initializeBaseCurrentSees(): void {
    // TQ = 1 kWh universal denominator (D1, D39)
    this.registerCurrentSee({
      id: 'TQ',
      name: 'Time-Quantum',
      symbol: 'TQ',
      description: 'Universal energy denominator: 1 TQ = 1 kWh',
      flowTypes: ['energy', 'labor'],
      toTQ: (amount) => amount,
      fromTQ: (tq) => tq,
      antiRival: false,
      reversible: true,
      contextDependent: false,
    })

    // ZNU - community currency (CaaS credits)
    this.registerCurrentSee({
      id: 'ZNU',
      name: 'ZNU Credit',
      symbol: 'ZNU',
      description: 'Community currency for CaaS access and internal exchange',
      flowTypes: ['financial', 'utility'],
      toTQ: (amount, ctx) => amount * (ctx.marketConditions?.priceParity?.get('ZNU') || 1),
      fromTQ: (tq, ctx) => tq / (ctx.marketConditions?.priceParity?.get('ZNU') || 1),
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    // USDC - external market bridge
    this.registerCurrentSee({
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      description: 'Stablecoin for market interface (Exchange Firm)',
      flowTypes: ['financial'],
      toTQ: (amount, ctx) => amount * (ctx.marketConditions?.priceParity?.get('USDC') || 0.001),
      fromTQ: (tq, ctx) => tq / (ctx.marketConditions?.priceParity?.get('USDC') || 0.001),
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    // Care Flow - anti-rival (gains value through sharing)
    this.registerCurrentSee({
      id: 'CARE',
      name: 'Care Flow',
      symbol: 'CARE',
      description: 'Care work hours - anti-rival, gains value through sharing',
      flowTypes: ['care'],
      toTQ: (amount) => amount * 0.08, // CareFlow base intensity
      fromTQ: (tq) => tq / 0.08,
      antiRival: true,
      reversible: false,
      contextDependent: true,
    })

    // Reputation dimensions (not global score - D5)
    this.registerCurrentSee({
      id: 'REP_QUALITY',
      name: 'Reputation Quality',
      symbol: 'REP_Q',
      description: 'Quality dimension of reputation (0-1)',
      flowTypes: ['reputation'],
      toTQ: (amount) => amount * 10, // 1.0 quality = 10 TQ equivalent
      fromTQ: (tq) => tq / 10,
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    this.registerCurrentSee({
      id: 'REP_COMMITMENT',
      name: 'Reputation Commitment',
      symbol: 'REP_C',
      description: 'Commitment dimension of reputation (0-1)',
      flowTypes: ['reputation'],
      toTQ: (amount) => amount * 8,
      fromTQ: (tq) => tq / 8,
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    this.registerCurrentSee({
      id: 'REP_REGULARITY',
      name: 'Reputation Regularity',
      symbol: 'REP_R',
      description: 'Regularity dimension of reputation (0-1)',
      flowTypes: ['reputation'],
      toTQ: (amount) => amount * 6,
      fromTQ: (tq) => tq / 6,
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    this.registerCurrentSee({
      id: 'REP_COLLABORATION',
      name: 'Reputation Collaboration',
      symbol: 'REP_L',
      description: 'Collaboration dimension of reputation (0-1)',
      flowTypes: ['reputation'],
      toTQ: (amount) => amount * 7,
      fromTQ: (tq) => tq / 7,
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })

    this.registerCurrentSee({
      id: 'REP_INNOVATION',
      name: 'Reputation Innovation',
      symbol: 'REP_I',
      description: 'Innovation dimension of reputation (0-1)',
      flowTypes: ['reputation'],
      toTQ: (amount) => amount * 12,
      fromTQ: (tq) => tq / 12,
      antiRival: false,
      reversible: true,
      contextDependent: true,
    })
  }

  // ============================================
  // CURRENT-SEE REGISTRY
  // ============================================

  registerCurrentSee(currentSee: CurrentSee): void {
    this.currentSees.set(currentSee.id, currentSee)
  }

  getCurrentSee(id: string): CurrentSee | undefined {
    return this.currentSees.get(id)
  }

  getAllCurrentSees(): CurrentSee[] {
    return Array.from(this.currentSees.values())
  }

  // ============================================
  // CONVERSION (TQ as universal denominator)
  // ============================================

  convert(amount: number, from: string, to: string, context: ConversionContext): number {
    const fromSee = this.currentSees.get(from)
    const toSee = this.currentSees.get(to)
    if (!fromSee || !toSee) throw new Error(`Unknown current-see: ${from} or ${to}`)

    // Convert via TQ
    const tq = fromSee.toTQ(amount, context)
    return toSee.fromTQ(tq, context)
  }

  // ============================================
  // VALUE EQUATIONS
  // ============================================

  registerValueEquation(equation: ValueEquation): void {
    this.valueEquations.set(equation.id, equation)
  }

  getValueEquation(id: string): ValueEquation | undefined {
    return this.valueEquations.get(id)
  }

  calculateDistribution(equationId: string, participations: ParticipationVector[]): Map<string, number> {
    const equation = this.valueEquations.get(equationId)
    if (!equation) throw new Error(`Value equation not found: ${equationId}`)

    // Execute distribution logic
    if (equation.distributionLogic.type === 'weighted' && equation.distributionLogic.weights) {
      const weights = equation.distributionLogic.weights
      const scores = new Map<string, number>()

      for (const p of participations) {
        let score = 0
        for (const [key, weight] of weights) {
          const value = this.getParticipationValue(p, key)
          score += value * weight
        }
        scores.set(p.affiliateId, score)
      }

      // Normalize
      const total = Array.from(scores.values()).reduce((a, b) => a + b, 0)
      const distribution = new Map<string, number>()
      for (const [affiliateId, score] of scores) {
        distribution.set(affiliateId, total > 0 ? score / total : 0)
      }
      return distribution
    }

    // Fallback: equal distribution
    const equal = 1 / participations.length
    const dist = new Map<string, number>()
    for (const p of participations) dist.set(p.affiliateId, equal)
    return dist
  }

  private getParticipationValue(p: ParticipationVector, key: string): number {
    switch (key) {
      case 'flows': return Array.from(p.flows.values()).reduce((a, b) => a + b, 0)
      case 'hours': return p.hours
      case 'quality': return p.reputationDimensions.get('quality') || 0
      case 'commitment': return p.reputationDimensions.get('commitment') || 0
      case 'regularity': return p.reputationDimensions.get('regularity') || 0
      case 'collaboration': return p.reputationDimensions.get('collaboration') || 0
      case 'innovation': return p.reputationDimensions.get('innovation') || 0
      case 'resourceUsage': return Array.from(p.resourceUsage.values()).reduce((a, b) => a + b, 0)
      case 'responsibility': return p.responsibility
      case 'careWork': return p.careWork
      default: return 0
    }
  }

  // ============================================
  // FLUID EQUITY
  // ============================================

  getFluidEquity(affiliateId: string, ventureId: string): FluidEquity | undefined {
    return this.fluidEquities.get(`${affiliateId}:${ventureId}`)
  }

  addEquityVector(affiliateId: string, ventureId: string, vector: EquityVector): void {
    const key = `${affiliateId}:${ventureId}`
    let equity = this.fluidEquities.get(key)
    if (!equity) {
      equity = {
        affiliateId,
        ventureId,
        equityVectors: [],
        totalEquityTQ: 0,
        lastValuation: now(),
        valuationMethod: 'hybrid',
      }
      this.fluidEquities.set(key, equity)
    }
    equity.equityVectors.push(vector)
    equity.totalEquityTQ += vector.amountTQ
    equity.lastValuation = now()
  }

  // ============================================
  // INCENTIVE MODEL SELECTION
  // ============================================

  getIncentiveModel(type: IncentiveModelType): IncentiveModel {
    return INCENTIVE_MODELS[type]
  }

  getApplicableIncentiveModels(affiliateId: string, context: ValueSovereigntyContext): IncentiveModel[] {
    return Object.values(INCENTIVE_MODELS).filter(m => m.eligibility(affiliateId, context))
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
}

class PriceParityOracle {
  private conditions: MarketConditions = {
    priceParity: new Map([
      ['ZNU', 1],      // 1 ZNU = 1 TQ baseline
      ['USDC', 0.001], // 1 USDC = 0.001 TQ (approx)
      ['EUR', 0.0009],
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

export const valueTheoryEngine = new ValueTheoryEngine()