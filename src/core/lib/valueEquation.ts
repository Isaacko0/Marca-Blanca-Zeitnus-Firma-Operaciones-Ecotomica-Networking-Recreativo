// HSCSG v15 OS — Value Equation (Benefit Redistribution Algorithm)
// Capa 3: Operación Productiva — algoritmo de redistribución a nivel de proyecto (fairness local)
// D3: Continuous Redistribution + FR Feedback Loop
// D4: 4 Registros Separados (Contribución, Responsabilidad, Uso Recursos, Beneficios Económicos)
// OVNi 3.0: "evaluation and redistribution of benefits are decided at the project level, not network level"

import type { NRPAffiliate, NRPVenture, BenefitRedistributionRecord, BenefitDistribution } from '@core/lib/nrpCasCore'
import type { ParticipationVector, ValueEquation as ValueEquationType } from '@core/lib/valueTheory'
import { uid, now } from '@core/lib/utils'

// ============================================
// VALUE EQUATION ENGINE
// ============================================

export class ValueEquationEngine {
  private equations: Map<string, ValueEquationInstance> = new Map()
  private redistributionHistory: Map<string, BenefitRedistributionRecord[]> = new Map() // ventureId -> records

  constructor() {
    this.initializeDefaultEquations()
  }

  private initializeDefaultEquations(): void {
    // Standard Benefit Redistribution Equation (OVNi 3.0 + D4 4-registries)
    this.registerEquation({
      id: 'gea-benefit-redist-v1',
      name: 'Standard Benefit Redistribution (4 Registries)',
      description: 'Distributes venture revenue based on 4 registries: Contribution, Responsibility, Resource Usage, Economic Benefit',
      ventureId: '', // template
      participationVectors: [],
      distributionLogic: {
        type: 'formula',
        formula: `
          // 4-Registry Weights (D4):
          // R1_Contribution: flows * quality * commitment (40%)
          // R2_Responsibility: custodianship + risk taken (20%)
          // R3_ResourceUsage: access to commons/tools * utilization (20%)
          // R4_EconomicBenefit: revenue share * AUT * CDS (20%)
          
          weight = (R1 * 0.4) + (R2 * 0.2) + (R3 * 0.2) + (R4 * 0.2)
          
          // Demurrage anti-acumulación (Ley II MJ)
          if (znuBalance > 300) weight *= (1 - 0.05)
        `,
      },
      constraints: [
        { id: 'min_share', type: 'minimum_share', parameter: 'venture_floor', value: 0.01, enforcement: 'hard' },
        { id: 'max_share', type: 'maximum_share', parameter: 'venture_cap', value: 0.5, enforcement: 'hard' },
        { id: 'regeneration', type: 'regeneration', parameter: 'ecological_floor', value: 0.1, enforcement: 'hard' },
      ],
      version: '1.0.0',
    })

    // CaaS Credit Redistribution Equation
    this.registerEquation({
      id: 'gea-caas-redist-v1',
      name: 'CaaS Credit Redistribution',
      description: 'Redistributes CaaS credit pool based on contribution flows and service utilization',
      ventureId: '',
      participationVectors: [],
      distributionLogic: {
        type: 'formula',
        formula: `
          // CaaS-specific weights:
          // Contribution flows (40%)
          // Service utilization (30%)
          // Governance participation (20%)
          // Care work (10%)
        `,
      },
      constraints: [],
      version: '1.0.0',
    })

    // Care Economy Redistribution Equation (D10: Care Economy → Infrastructure Continuidad)
    this.registerEquation({
      id: 'gea-care-redist-v1',
      name: 'Care Economy Redistribution',
      description: 'Redistributes resources to care workers (childcare, eldercare, food, maintenance, accompaniment, education, transmission)',
      ventureId: '',
      participationVectors: [],
      distributionLogic: {
        type: 'formula',
        formula: `
          // Care work recognition:
          // Care hours * dependency factor * vulnerability index
          // Prioritizes unpaid/underpaid care work
        `,
      },
      constraints: [
        { id: 'care_floor', type: 'minimum_share', parameter: 'care_floor', value: 0.15, enforcement: 'hard' },
      ],
      version: '1.0.0',
    })
  }

  registerEquation(equation: Omit<ValueEquationInstance, 'id' | 'createdAt' | 'updatedAt'>): ValueEquationInstance {
    const instance: ValueEquationInstance = {
      ...equation,
      id: equation.id || uid(),
      createdAt: now(),
      updatedAt: now(),
    }
    this.equations.set(instance.id, instance)
    return instance
  }

  getEquation(id: string): ValueEquationInstance | undefined {
    return this.equations.get(id)
  }

  getAllEquations(): ValueEquationInstance[] {
    return Array.from(this.equations.values())
  }

  // ============================================
  // EXECUTION
  // ============================================

  /**
   * Ejecuta ecuación de valor para una venture
   * Retorna distribuciones por afiliado
   */
  executeEquation(
    equationId: string,
    venture: NRPVenture,
    affiliates: Map<string, NRPAffiliate>,
    periodStart: number,
    periodEnd: number,
    totalRevenue: { TQ: number; ZNU: number; USDC: number }
  ): BenefitRedistributionRecord {
    const equation = this.equations.get(equationId)
    if (!equation) throw new Error(`Equation not found: ${equationId}`)

    // Build participation vectors for all affiliates in venture
    const participations = this.buildParticipationVectors(venture, affiliates, periodStart, periodEnd)

    // Calculate distribution weights
    const weights = this.calculateWeights(equation, participations, affiliates)

    // Apply constraints
    const constrainedWeights = this.applyConstraints(equation, weights, affiliates)

    // Normalize
    const totalWeight = Array.from(constrainedWeights.values()).reduce((a, b) => a + b, 0)
    const distribution = new Map<string, number>()
    for (const [affiliateId, weight] of constrainedWeights) {
      distribution.set(affiliateId, totalWeight > 0 ? weight / totalWeight : 0)
    }

    // Calculate amounts
    const distributions: BenefitDistribution[] = []
    for (const [affiliateId, share] of distribution) {
      const affiliate = affiliates.get(affiliateId)!
      const amountTQ = totalRevenue.TQ * share
      const amountZNU = totalRevenue.ZNU * share
      const amountUSDC = totalRevenue.USDC * share

      // Demurrage anti-acumulación (Ley II MJ)
      let demurrageApplied = 0
      if (affiliate.znuBalance > 300) {
        demurrageApplied = (affiliate.znuBalance - 300) * 0.05
      }

      distributions.push({
        affiliateId,
        amountTQ: +(amountTQ - demurrageApplied).toFixed(2),
        amountZNU: +(amountZNU - demurrageApplied).toFixed(2),
        amountUSDC: +(amountUSDC - demurrageApplied).toFixed(2),
        basis: `R1:${this.getR1Basis(participations.get(affiliateId))} R2:${this.getR2Basis(venture, affiliateId)} R3:${this.getR3Basis(affiliate)} R4:${this.getR4Basis(affiliate)}`,
        tier: affiliate.coreGroupMember ? 'core' : 'contributor',
      })

      // Update balances (would be done by NRP-CAS Core)
    }

    const record: BenefitRedistributionRecord = {
      id: uid(),
      ventureId: venture.id,
      periodStart,
      periodEnd,
      executedAt: now(),
      totalRevenueTQ: totalRevenue.TQ,
      totalRevenueZNU: totalRevenue.ZNU,
      totalRevenueUSDC: totalRevenue.USDC,
      distributions,
      algorithmVersion: equation.version,
      governanceEquationId: equationId,
    }

    // Store history
    const history = this.redistributionHistory.get(venture.id) || []
    history.push(record)
    this.redistributionHistory.set(venture.id, history)

    return record
  }

  private buildParticipationVectors(
    venture: NRPVenture,
    affiliates: Map<string, NRPAffiliate>,
    periodStart: number,
    periodEnd: number
  ): Map<string, ParticipationVector> {
    const vectors = new Map<string, ParticipationVector>()

    for (const affiliateId of venture.contributors) {
      const affiliate = affiliates.get(affiliateId)
      if (!affiliate) continue

      // Get flows in period (would query NRP-CAS events)
      const flows = new Map<VFType, number>()
      // Simplified: would aggregate from contribution logs

      vectors.set(affiliateId, {
        affiliateId,
        flows,
        hours: 0, // would calculate from logs
        reputationDimensions: new Map(Object.entries(
          Object.fromEntries(affiliate.reputationDimensions.map(r => [r.dimension, r.score]))
        )),
        resourceUsage: new Map(), // would calculate from bookings
        responsibility: this.calculateResponsibility(venture, affiliateId),
        careWork: 0, // would calculate from care flow logs
      })
    }

    return vectors
  }

  private calculateResponsibility(venture: NRPVenture, affiliateId: string): number {
    let responsibility = 0
    if (venture.custodians.includes(affiliateId)) responsibility += 0.5
    if (venture.coreGroup.includes(affiliateId)) responsibility += 0.3
    // Add risk taken, etc.
    return Math.min(responsibility, 1)
  }

  private calculateWeights(
    equation: ValueEquationInstance,
    participations: Map<string, ParticipationVector>,
    affiliates: Map<string, NRPAffiliate>
  ): Map<string, number> {
    const weights = new Map<string, number>()

    for (const [affiliateId, p] of participations) {
      const affiliate = affiliates.get(affiliateId)!
      if (!affiliate) continue

      // R1: Contribution (40%)
      const totalFlows = Array.from(p.flows.values()).reduce((a, b) => a + b, 0)
      const quality = p.reputationDimensions.get('quality') || 0
      const commitment = p.reputationDimensions.get('commitment') || 0
      const R1 = totalFlows * (0.5 + quality * 0.3 + commitment * 0.2)

      // R2: Responsibility (20%)
      const R2 = p.responsibility * 100

      // R3: Resource Usage (20%)
      const resourceUsage = Array.from(p.resourceUsage.values()).reduce((a, b) => a + b, 0)
      const R3 = resourceUsage * 10

      // R4: Economic Benefit (20%) - based on AUT/CDS
      // Would get from state
      const aut = 0.5 // placeholder
      const cds = 0.5 // placeholder
      const R4 = (aut + cds) * 50

      const weight = R1 * 0.4 + R2 * 0.2 + R3 * 0.2 + R4 * 0.2
      weights.set(affiliateId, weight)
    }

    return weights
  }

  private applyConstraints(
    equation: ValueEquationInstance,
    weights: Map<string, number>,
    affiliates: Map<string, NRPAffiliate>
  ): Map<string, number> {
    const constrained = new Map(weights)

    for (const constraint of equation.constraints) {
      if (constraint.enforcement !== 'hard') continue

      switch (constraint.type) {
        case 'minimum_share':
          this.applyMinimumShare(constrained, affiliates, constraint.value)
          break
        case 'maximum_share':
          this.applyMaximumShare(constrained, constraint.value)
          break
        case 'regeneration':
          this.applyRegenerationFloor(constrained, affiliates, constraint.value)
          break
      }
    }

    return constrained
  }

  private applyMinimumShare(weights: Map<string, number>, affiliates: Map<string, NRPAffiliate>, minShare: number): void {
    const total = Array.from(weights.values()).reduce((a, b) => a + b, 0)
    if (total === 0) return

    for (const [affiliateId, weight] of weights) {
      const share = weight / total
      if (share < minShare) {
        weights.set(affiliateId, minShare * total)
      }
    }
  }

  private applyMaximumShare(weights: Map<string, number>, maxShare: number): void {
    const total = Array.from(weights.values()).reduce((a, b) => a + b, 0)
    if (total === 0) return

    for (const [affiliateId, weight] of weights) {
      const share = weight / total
      if (share > maxShare) {
        weights.set(affiliateId, maxShare * total)
      }
    }
  }

  private applyRegenerationFloor(weights: Map<string, number>, affiliates: Map<string, NRPAffiliate>, floor: number): void {
    // Reserve portion for ecological regeneration
    // Implemented at venture level: portion of revenue goes to regeneration fund
  }

  private getR1Basis(p: ParticipationVector | undefined): string {
    if (!p) return '0'
    const flows = Array.from(p.flows.values()).reduce((a, b) => a + b, 0)
    const quality = p.reputationDimensions.get('quality') || 0
    return `flows${flows}_q${quality.toFixed(1)}`
  }

  private getR2Basis(venture: NRPVenture, affiliateId: string): string {
    let basis = ''
    if (venture.custodians.includes(affiliateId)) basis += 'custodian'
    if (venture.coreGroup.includes(affiliateId)) basis += (basis ? '+' : '') + 'core'
    return basis || 'member'
  }

  private getR3Basis(affiliate: NRPAffiliate): string {
    return `usage${affiliate.contributedFlows}`
  }

  private getR4Basis(affiliate: NRPAffiliate): string {
    return `AUT${(affiliate.tqBalance / 100).toFixed(1)}_CDS${(affiliate.znuBalance / 100).toFixed(1)}`
  }

  // ============================================
  // HISTORY
  // ============================================

  getRedistributionHistory(ventureId: string): BenefitRedistributionRecord[] {
    return this.redistributionHistory.get(ventureId) || []
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      equations: Array.from(this.equations.entries()),
      redistributionHistory: Array.from(this.redistributionHistory.entries()),
    }, null, 2)
  }

  static fromJSON(json: string): ValueEquationEngine {
    const data = JSON.parse(json)
    const engine = new ValueEquationEngine()
    engine.equations = new Map(data.equations)
    engine.redistributionHistory = new Map(data.redistributionHistory)
    return engine
  }
}

// ============================================
// TYPES
// ============================================

export interface ValueEquationInstance {
  id: string
  name: string
  description: string
  ventureId: string
  participationVectors: ParticipationVector[]
  distributionLogic: DistributionLogic
  constraints: EquationConstraint[]
  version: string
  createdAt: number
  updatedAt: number
}

export interface DistributionLogic {
  type: 'weighted' | 'threshold' | 'formula' | 'algorithmic'
  formula?: string
  weights?: Map<string, number>
  algorithm?: string
}

export interface EquationConstraint {
  id: string
  type: 'minimum_share' | 'maximum_share' | 'floor' | 'ceiling' | 'proportionality' | 'regeneration'
  parameter: string
  value: number
  enforcement: 'hard' | 'soft'
}

import type { VFType } from '@core/state/types'

export interface ParticipationVector {
  affiliateId: string
  flows: Map<VFType, number>
  hours: number
  reputationDimensions: Map<string, number>
  resourceUsage: Map<string, number>
  responsibility: number
  careWork: number
}

// ============================================
// EXPORTS
// ============================================

export const valueEquationEngine = new ValueEquationEngine()