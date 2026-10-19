// src/core/lib/tq-closer.ts
// Closer Agent + Village + OASA Integration
// Implements: Village onboarding, Agent capabilities, Village Fund, 7 Principles compliance

import type {
  CloserVillage,
  CloserAgent,
  CloserAgentCapability,
  CloserAgentMemory,
  OASAVillageFund,
  OASAFundCriteria,
  OASATokenRaise,
  OASAPrinciples,
  OASAPrincipleDetail,
  OASAMetric,
} from './tq-types-extended';

import type { TQTransaction } from './tq';
import { OASA_PRINCIPLE_TO_URBANIKA } from './tq-types-extended';

// ============================================================================
// CLOSER ENGINE
// ============================================================================

export class CloserEngine {
  private villages: Map<string, CloserVillage> = new Map();
  private agents: Map<string, CloserAgent> = new Map();
  private funds: Map<string, OASAVillageFund> = new Map();
  private principlesCompliance: Map<string, Record<string, number>> = new Map(); // villageId -> principle -> score

  // ---------------------------------------------------------------------------
  // VILLAGE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerVillage(village: CloserVillage): { success: boolean; errors: string[]; villageId?: string } {
    const errors: string[] = [];

    // Validate required fields
    if (!village.name || village.name.trim().length < 2) {
      errors.push('Village name required (min 2 chars)');
    }
    if (!village.location || typeof village.location.lat !== 'number' || typeof village.location.lng !== 'number') {
      errors.push('Valid location (lat/lng) required');
    }
    if (!village.landHectares || village.landHectares < 0.5) {
      errors.push('Minimum 0.5 hectares required');
    }
    if (!['ecovillage', 'cohousing', 'regenerative-hub', 'retreat-center'].includes(village.type)) {
      errors.push('Invalid village type');
    }
    if (!village.domain || !village.domain.includes('.')) {
      errors.push('Valid domain required (e.g., village.closer.earth)');
    }

    // OASA Fund criteria check
    if (village.waterTableDepth && village.waterTableDepth > 50) {
      errors.push('Water table >50m: regeneration plan required for Fund eligibility');
    }

    if (errors.length === 0) {
      const villageId = village.id || `village_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const newVillage: CloserVillage = {
        ...village,
        id: villageId,
        oasaPrinciplesCompliance: 0, // Will be calculated
        onCloserSince: village.onCloserSince || Date.now(),
        raoCredentialId: village.raoCredentialId || '',
      };
      this.villages.set(villageId, newVillage);
      this.principlesCompliance.set(villageId, {});
      return { success: true, errors: [], villageId };
    }
    return { success: false, errors };
  }

  getVillage(id: string): CloserVillage | undefined {
    return this.villages.get(id);
  }

  listVillages(): CloserVillage[] {
    return Array.from(this.villages.values());
  }

  updateVillageMetrics(villageId: string, metrics: Record<string, number>): number {
    const village = this.villages.get(villageId);
    if (!village) return 0;

    const compliance = this.calculatePrinciplesCompliance(metrics);
    village.oasaPrinciplesCompliance = compliance;
    this.principlesCompliance.set(villageId, this.mapMetricsToPrinciples(metrics));
    this.villages.set(villageId, village);

    return compliance;
  }

  private calculatePrinciplesCompliance(metrics: Record<string, number>): number {
    let totalScore = 0;
    let count = 0;

    for (const [principleKey, metricKey] of Object.entries(OASA_PRINCIPLE_TO_URBANIKA)) {
      const actual = metrics[metricKey];
      if (actual !== undefined) {
        // Target values per principle (from OASA Constitution)
        const targets: Record<string, number> = {
          soilRegenerationKwh: 3.0,      // tC/ha
          waterRetentionKwh: 5.0,        // meters (inverted: lower is better)
          carbonSequestrationKwh: 10,    // tCO2e/ha/yr
          wasteReductionKwh: 99,         // %
          biodiversityIndex: 3.5,        // Shannon Index
          renewableEnergyKwh: 100,       // %
          socialCohesionIndex: 70,       // %
        };
        const target = targets[metricKey] || 100;
        const score = metricKey === 'waterRetentionKwh' 
          ? Math.min(1, target / Math.max(0.1, actual)) // inverted for water table
          : Math.min(1, actual / target);
        totalScore += score;
        count++;
      }
    }

    return count > 0 ? totalScore / count : 0;
  }

  private mapMetricsToPrinciples(metrics: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [principleKey, metricKey] of Object.entries(OASA_PRINCIPLE_TO_URBANIKA)) {
      const actual = metrics[metricKey];
      if (actual !== undefined) {
        const targets: Record<string, number> = {
          soilRegenerationKwh: 3.0,
          waterRetentionKwh: 5.0,
          carbonSequestrationKwh: 10,
          wasteReductionKwh: 99,
          biodiversityIndex: 3.5,
          renewableEnergyKwh: 100,
          socialCohesionIndex: 70,
        };
        const target = targets[metricKey] || 100;
        const score = metricKey === 'waterRetentionKwh'
          ? Math.min(1, target / Math.max(0.1, actual))
          : Math.min(1, actual / target);
        result[principleKey] = score;
      }
    }
    return result;
  }

  getPrinciplesCompliance(villageId: string): Record<string, number> {
    return this.principlesCompliance.get(villageId) || {};
  }

  // ---------------------------------------------------------------------------
  // AGENT MANAGEMENT
  // ---------------------------------------------------------------------------

  registerAgent(agent: CloserAgent): { success: boolean; errors: string[]; agentId?: string } {
    const village = this.villages.get(agent.villageId);
    if (!village) {
      return { success: false, errors: ['Village not registered'] };
    }

    const validCapabilities: CloserAgentCapability[] = [
      'bookings', 'events', 'memberships', 'governance', 'tokens',
      'learning', 'spaces', 'ai-mediation', 'resource-tracking',
    ];

    const invalid = agent.capabilities.filter(c => !validCapabilities.includes(c));
    if (invalid.length > 0) {
      return { success: false, errors: [`Invalid capabilities: ${invalid.join(', ')}`] };
    }

    if (!['local', 'cloud', 'hybrid'].includes(agent.infrastructure)) {
      return { success: false, errors: ['Invalid infrastructure type'] };
    }

    if (!['full', 'shared', 'hosted'].includes(agent.sovereignty)) {
      return { success: false, errors: ['Invalid sovereignty type'] };
    }

    const agentId = agent.id || `agent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newAgent: CloserAgent = {
      ...agent,
      id: agentId,
      memory: agent.memory || { longTerm: true, rag: true, contextWindow: 8192, persistentStorage: true },
      raoCredentialId: agent.raoCredentialId || '',
    };

    this.agents.set(agentId, newAgent);
    return { success: true, errors: [], agentId };
  }

  getAgent(id: string): CloserAgent | undefined {
    return this.agents.get(id);
  }

  listAgentsByVillage(villageId: string): CloserAgent[] {
    return Array.from(this.agents.values()).filter(a => a.villageId === villageId);
  }

  // ---------------------------------------------------------------------------
  // AGENT OPERATIONS
  // ---------------------------------------------------------------------------

  async executeAgentAction(
    agentId: string,
    action: CloserAgentCapability,
    params: Record<string, any>
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const agent = this.agents.get(agentId);
    if (!agent) return { success: false, error: 'Agent not found' };

    if (!agent.capabilities.includes(action)) {
      return { success: false, error: `Agent lacks capability: ${action}` };
    }

    // Simulate agent action execution
    switch (action) {
      case 'bookings':
        return this.handleBooking(agent, params);
      case 'events':
        return this.handleEvent(agent, params);
      case 'memberships':
        return this.handleMembership(agent, params);
      case 'governance':
        return this.handleGovernance(agent, params);
      case 'tokens':
        return this.handleTokens(agent, params);
      case 'learning':
        return this.handleLearning(agent, params);
      case 'spaces':
        return this.handleSpaces(agent, params);
      case 'ai-mediation':
        return this.handleAIMediation(agent, params);
      case 'resource-tracking':
        return this.handleResourceTracking(agent, params);
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  }

  private handleBooking(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { bookingId: `book_${Date.now()}`, status: 'confirmed', ...params } };
  }

  private handleEvent(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { eventId: `evt_${Date.now()}`, status: 'created', ...params } };
  }

  private handleMembership(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { membershipId: `mem_${Date.now()}`, status: 'active', ...params } };
  }

  private handleGovernance(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { proposalId: `prop_${Date.now()}`, status: 'submitted', ...params } };
  }

  private handleTokens(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { txId: `tx_${Date.now()}`, status: 'processed', ...params } };
  }

  private handleLearning(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { courseId: `course_${Date.now()}`, status: 'enrolled', ...params } };
  }

  private handleSpaces(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { spaceId: `space_${Date.now()}`, status: 'reserved', ...params } };
  }

  private handleAIMediation(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { mediationId: `med_${Date.now()}`, status: 'initiated', ...params } };
  }

  private handleResourceTracking(agent: CloserAgent, params: any): { success: boolean; result: any } {
    return { success: true, result: { trackingId: `track_${Date.now()}`, data: params } };
  }

  // ---------------------------------------------------------------------------
  // VILLAGE FUND
  // ---------------------------------------------------------------------------

  createVillageFund(fund: OASAVillageFund): { success: boolean; errors: string[]; fundId?: string } {
    const errors: string[] = [];

    // Validate all criteria
    if (!fund.criteria.landTitleOrLease) errors.push('Land title or lease required');
    if (!fund.criteria.regenerationPlan) errors.push('Regeneration plan required');
    if (!fund.criteria.stewardshipCommitment) errors.push('Stewardship commitment required');
    if (!fund.criteria.openBooks) errors.push('Open books required');
    if (!fund.criteria.runOnCloser) errors.push('Must run on Closer platform');

    // Validate token raise
    if (fund.tokenRaise.type !== 'governance-and-use-rights') {
      errors.push('Token raise must be governance-and-use-rights only (never equity)');
    }

    if (errors.length === 0) {
      const fundId = fund.id || `fund_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const newFund: OASAVillageFund = { ...fund, id: fundId };
      this.funds.set(fundId, newFund);
      return { success: true, errors: [], fundId };
    }
    return { success: false, errors };
  }

  getFund(id: string): OASAVillageFund | undefined {
    return this.funds.get(id);
  }

  listFunds(): OASAVillageFund[] {
    return Array.from(this.funds.values());
  }

  // ---------------------------------------------------------------------------
  // TOKEN ECONOMICS
  // ---------------------------------------------------------------------------

  calculateTokenAllocation(
    villageId: string,
    regenerativeContributionKwh: number,
    complianceScore: number
  ): { governanceTokens: number; useRightTokens: number; total: number } {
    const village = this.villages.get(villageId);
    if (!village) return { governanceTokens: 0, useRightTokens: 0, total: 0 };

    // Base rate: 100 tokens per kWh/year regenerative capacity
    const baseRate = 100;
    
    // Compliance multiplier: 0.5x to 1.5x
    const multiplier = 0.5 + complianceScore;
    
    const totalTokens = Math.floor(regenerativeContributionKwh * baseRate * multiplier);
    
    // 60% governance, 40% use rights (per OASA Constitution)
    const governanceTokens = Math.floor(totalTokens * 0.6);
    const useRightTokens = totalTokens - governanceTokens;

    return { governanceTokens, useRightTokens, total: totalTokens };
  }

  calculateBondingCurvePrice(
    currentSupply: number,
    reserveBalance: number,
    params: { reserveRatio: number; maxSupply: number }
  ): number {
    if (currentSupply >= params.maxSupply) return Infinity;
    if (currentSupply === 0) return reserveBalance * params.reserveRatio;

    // Sigmoid curve for stable price discovery
    const normalized = currentSupply / params.maxSupply;
    const sigmoid = 1 / (1 + Math.exp(-10 * (normalized - 0.5)));
    
    return reserveBalance * params.reserveRatio * (1 + sigmoid * 9);
  }

  // ---------------------------------------------------------------------------
  // VILLAGE FUND DISTRIBUTION
  // ---------------------------------------------------------------------------

  calculateFundDistribution(
    fundId: string,
    platformFeesCollected: number
  ): { matchingPool: number; endowmentPrizes: number; feeContribution: number } {
    const fund = this.funds.get(fundId);
    if (!fund) return { matchingPool: 0, endowmentPrizes: 0, feeContribution: 0 };

    const feeContribution = platformFeesCollected * (fund.feeContribution || 0.01); // 1% default
    const matchingPool = feeContribution * 0.7; // 70% to matching
    const endowmentPrizes = feeContribution * 0.3; // 30% to prizes

    return { matchingPool, endowmentPrizes, feeContribution };
  }

  // ---------------------------------------------------------------------------
  // ONBOARDING FLOW
  // ---------------------------------------------------------------------------

  async onboardVillage(steps: {
    village: Omit<CloserVillage, 'id' | 'onCloserSince' | 'oasaPrinciplesCompliance'>;
    agent?: Omit<CloserAgent, 'id' | 'villageId'>;
    fund?: Omit<OASAVillageFund, 'id'>;
  }): Promise<{ villageId: string; agentId?: string; fundId?: string; errors: string[] }> {
    const errors: string[] = [];

    // 1. Register village
    const villageResult = this.registerVillage({ ...steps.village, id: '', onCloserSince: 0, oasaPrinciplesCompliance: 0 } as CloserVillage);
    if (!villageResult.success) {
      errors.push(...villageResult.errors);
      return { villageId: '', errors };
    }
    const villageId = villageResult.villageId!;

    // 2. Register agent if provided
    let agentId: string | undefined;
    if (steps.agent) {
      const agentResult = this.registerAgent({ ...steps.agent, villageId, id: '' } as CloserAgent);
      if (!agentResult.success) {
        errors.push(...agentResult.errors);
      } else {
        agentId = agentResult.agentId;
      }
    }

    // 3. Create fund if provided
    let fundId: string | undefined;
    if (steps.fund) {
      const fundResult = this.createVillageFund({ ...steps.fund, id: '' } as OASAVillageFund);
      if (!fundResult.success) {
        errors.push(...fundResult.errors);
      } else {
        fundId = fundResult.fundId;
      }
    }

    return { villageId, agentId, fundId, errors };
  }

  // ---------------------------------------------------------------------------
  // INTEROPERABILITY
  // ---------------------------------------------------------------------------

  syncWithOASA(villageId: string, oasaMetrics: Record<string, number>): number {
    return this.updateVillageMetrics(villageId, oasaMetrics);
  }

  exportVillageData(villageId: string): {
    village: CloserVillage | undefined;
    agents: CloserAgent[];
    fund: OASAVillageFund | undefined;
    compliance: Record<string, number>;
  } | null {
    const village = this.villages.get(villageId);
    if (!village) return null;

    return {
      village,
      agents: this.listAgentsByVillage(villageId),
      fund: Array.from(this.funds.values()).find(f => f.selectedVillages.includes(villageId)),
      compliance: this.getPrinciplesCompliance(villageId),
    };
  }
}

// ============================================================================
// CLOSER AGENT RUNTIME (for elizaOS integration)
// ============================================================================

export interface CloserAgentRuntime {
  agent: CloserAgent;
  village: CloserVillage;
  capabilities: Map<CloserAgentCapability, (params: any) => Promise<any>>;
  memory: {
    conversations: Map<string, any[]>;
    knowledge: Map<string, any>;
    embeddings: Map<string, number[]>;
  };
  state: 'idle' | 'processing' | 'error';
}

export function createCloserAgentRuntime(agent: CloserAgent, village: CloserVillage): CloserAgentRuntime {
  return {
    agent,
    village,
    capabilities: new Map(),
    memory: {
      conversations: new Map(),
      knowledge: new Map(),
      embeddings: new Map(),
    },
    state: 'idle',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const closerEngine = new CloserEngine();
export default closerEngine;