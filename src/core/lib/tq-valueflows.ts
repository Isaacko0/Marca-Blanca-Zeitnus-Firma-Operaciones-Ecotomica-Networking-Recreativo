// src/core/lib/tq-valueflows.ts
// ValueFlows REA Integration: Economic Events, Resources, Recipes, Processes, Agents, Networks
// Implements: VF Vocabulary, REA Ontology, Capa 2 Interoperability, CaaS Streams

import type {
  VF_EconomicEvent,
  VF_Resource,
  VF_Recipe,
  VF_RecipeLine,
  VF_Process,
  VF_ProcessLine,
  VF_EconomicResource,
  VF_EconomicAgent,
  VF_EconomicNetwork,
  VF_Governance,
} from './tq-types-extended';

import type { TQTransaction } from './tq';

// CaaS Stream interface (defined outside class)
interface CaaSStream {
  id: string;
  contributorId: string;
  networkId: string;
  resourceId: string;
  ratePerPeriod: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  startTime: number;
  endTime?: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  totalContributed: number;
  recipients: string[];
  recipeId?: string;
  raoCredentialId: string;
}

// ============================================================================
// VALUEFLOWS ENGINE
// ============================================================================

export class ValueFlowsEngine {
  private networks: Map<string, VF_EconomicNetwork> = new Map();
  private resources: Map<string, VF_EconomicResource> = new Map();
  private agents: Map<string, VF_EconomicAgent> = new Map();
  private events: VF_EconomicEvent[] = [];
  private recipes: Map<string, VF_Recipe> = new Map();
  private processes: Map<string, VF_Process> = new Map();

  // ---------------------------------------------------------------------------
  // NETWORK MANAGEMENT
  // ---------------------------------------------------------------------------

  createNetwork(network: Omit<VF_EconomicNetwork, 'id' | 'events'> & { id?: string }): VF_EconomicNetwork {
    const id = network.id || `network_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newNetwork: VF_EconomicNetwork = {
      ...network,
      id,
      agents: network.agents || [],
      resources: network.resources || [],
      events: [],
      governance: network.governance || this.defaultGovernance(),
    };
    this.networks.set(id, newNetwork);
    return newNetwork;
  }

  getNetwork(id: string): VF_EconomicNetwork | undefined {
    return this.networks.get(id);
  }

  listNetworks(): VF_EconomicNetwork[] {
    return Array.from(this.networks.values());
  }

  private defaultGovernance(): VF_Governance {
    return {
      type: 'consent',
      decisionThreshold: 0.8,
      quorum: 0.3,
      delegationEnabled: true,
      transparency: 'full',
    };
  }

  // ---------------------------------------------------------------------------
  // AGENT MANAGEMENT
  // ---------------------------------------------------------------------------

  registerAgent(agent: Omit<VF_EconomicAgent, 'id'> & { id?: string }): VF_EconomicAgent {
    const id = agent.id || `agent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newAgent: VF_EconomicAgent = { ...agent, id, resources: agent.resources || new Map(), capabilities: agent.capabilities || [], reputation: agent.reputation || 0 };
    this.agents.set(id, newAgent);
    return newAgent;
  }

  getAgent(id: string): VF_EconomicAgent | undefined {
    return this.agents.get(id);
  }

  // ---------------------------------------------------------------------------
  // RESOURCE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerResource(resource: Omit<VF_EconomicResource, 'id'> & { id?: string }): VF_EconomicResource {
    const id = resource.id || `resource_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newResource: VF_EconomicResource = { ...resource, id };
    this.resources.set(id, newResource);
    return newResource;
  }

  getResource(id: string): VF_EconomicResource | undefined {
    return this.resources.get(id);
  }

  // ---------------------------------------------------------------------------
  // RECIPE MANAGEMENT (Production Knowledge)
  // ---------------------------------------------------------------------------

  createRecipe(recipe: Omit<VF_Recipe, 'id'> & { id?: string }): VF_Recipe {
    const id = recipe.id || `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newRecipe: VF_Recipe = { ...recipe, id };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  getRecipe(id: string): VF_Recipe | undefined {
    return this.recipes.get(id);
  }

  listRecipes(): VF_Recipe[] {
    return Array.from(this.recipes.values());
  }

  // ---------------------------------------------------------------------------
  // PROCESS EXECUTION (Economic Activity)
  // ---------------------------------------------------------------------------

  startProcess(process: Omit<VF_Process, 'id' | 'status' | 'startTime'> & { id?: string }): VF_Process {
    const id = process.id || `process_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newProcess: VF_Process = {
      ...process,
      id,
      status: 'planned',
      startTime: Date.now(),
      inputs: process.inputs.map(i => ({ ...i, actualQuantity: 0, variance: 0 })),
      outputs: process.outputs.map(o => ({ ...o, actualQuantity: 0, variance: 0 })),
    };
    this.processes.set(id, newProcess);
    return newProcess;
  }

  executeProcess(processId: string, actualInputs: Map<string, number>, actualOutputs: Map<string, number>): VF_Process | null {
    const process = this.processes.get(processId);
    if (!process) return null;

    process.status = 'in-progress';
    
    // Update actual quantities and calculate variance
    for (const input of process.inputs) {
      const actual = actualInputs.get(input.resourceId) || 0;
      input.actualQuantity = actual;
      input.variance = actual - input.plannedQuantity;
    }
    for (const output of process.outputs) {
      const actual = actualOutputs.get(output.resourceId) || 0;
      output.actualQuantity = actual;
      output.variance = actual - output.plannedQuantity;
    }

    return process;
  }

  completeProcess(processId: string): VF_Process | null {
    const process = this.processes.get(processId);
    if (!process) return null;

    process.status = 'completed';
    process.endTime = Date.now();

    // Generate economic events for each input/output
    for (const input of process.inputs) {
      if (input.actualQuantity && input.actualQuantity > 0) {
        this.recordEvent({
          type: 'process',
          fromAgent: process.responsibleAgents[0] || 'system',
          toAgent: 'consumed',
          resource: { id: input.resourceId, name: '', description: '', unit: input.unit, category: 'material', categoryCode: '' },
          quantity: input.actualQuantity,
          unit: input.unit,
          process: process,
          timestamp: Date.now(),
          raoCredentialId: '',
        });
      }
    }

    for (const output of process.outputs) {
      if (output.actualQuantity && output.actualQuantity > 0) {
        this.recordEvent({
          type: 'process',
          fromAgent: 'produced',
          toAgent: process.responsibleAgents[0] || 'system',
          resource: { id: output.resourceId, name: '', description: '', unit: output.unit, category: 'material', categoryCode: '' },
          quantity: output.actualQuantity,
          unit: output.unit,
          process: process,
          timestamp: Date.now(),
          raoCredentialId: '',
        });
      }
    }

    return process;
  }

  getProcess(id: string): VF_Process | undefined {
    return this.processes.get(id);
  }

  // ---------------------------------------------------------------------------
  // ECONOMIC EVENTS (Core VF Primitive)
  // ---------------------------------------------------------------------------

  recordEvent(event: Omit<VF_EconomicEvent, 'id'>): VF_EconomicEvent {
    const newEvent: VF_EconomicEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    this.events.push(newEvent);

    // Update agent resource balances
    if (event.fromAgent !== 'produced' && event.fromAgent !== 'system') {
      const fromAgent = this.agents.get(event.fromAgent);
      if (fromAgent) {
        const current = fromAgent.resources.get(event.resource.id) || 0;
        fromAgent.resources.set(event.resource.id, current - event.quantity);
      }
    }
    if (event.toAgent !== 'consumed' && event.toAgent !== 'system') {
      const toAgent = this.agents.get(event.toAgent);
      if (toAgent) {
        const current = toAgent.resources.get(event.resource.id) || 0;
        toAgent.resources.set(event.resource.id, current + event.quantity);
      }
    }

    // Update resource quantities
    const resource = this.resources.get(event.resource.id);
    if (resource) {
      if (event.type === 'transfer' || event.type === 'process') {
        if (event.fromAgent !== 'produced') {
          resource.currentQuantity -= event.quantity;
        }
        if (event.toAgent !== 'consumed') {
          resource.currentQuantity += event.quantity;
        }
      }
    }

    return newEvent;
  }

  getEvents(filters?: { agentId?: string; resourceId?: string; type?: VF_EconomicEvent['type']; startTime?: number; endTime?: number }): VF_EconomicEvent[] {
    let result = this.events;

    if (filters) {
      if (filters.agentId) {
        result = result.filter(e => e.fromAgent === filters.agentId || e.toAgent === filters.agentId);
      }
      if (filters.resourceId) {
        result = result.filter(e => e.resource.id === filters.resourceId);
      }
      if (filters.type) {
        result = result.filter(e => e.type === filters.type);
      }
      if (filters.startTime) {
        result = result.filter(e => e.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        result = result.filter(e => e.timestamp <= filters.endTime!);
      }
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // VF RESOURCE CLASSIFICATION (Standard Categories)
  // ---------------------------------------------------------------------------

  static readonly RESOURCE_CATEGORIES = {
    material: { code: 'MAT', examples: ['food', 'materials', 'tools', 'seeds', 'compost'] },
    energy: { code: 'ENE', examples: ['solar', 'wind', 'hydro', 'biomass', 'battery', 'grid'] },
    service: { code: 'SVC', examples: ['design', 'construction', 'education', 'healthcare', 'maintenance'] },
    knowledge: { code: 'KNO', examples: ['documentation', 'software', 'research', 'training', 'protocols'] },
    currency: { code: 'CUR', examples: ['ZNU', 'TQ', 'stablecoin', 'mutual-credit', 'timebank'] },
    time: { code: 'TIM', examples: ['labor-hours', 'care-hours', 'governance-hours', 'learning-hours'] },
    land: { code: 'LND', examples: ['agricultural', 'residential', 'conservation', 'commons', 'rewilding'] },
  } as const;

  // ---------------------------------------------------------------------------
  // STANDARD UNITS (VF Vocabulary)
  // ---------------------------------------------------------------------------

  static readonly STANDARD_UNITS = {
    // Energy
    kWh: { category: 'energy', symbol: 'kWh', name: 'Kilowatt-hour' },
    MWh: { category: 'energy', symbol: 'MWh', name: 'Megawatt-hour' },
    MJ: { category: 'energy', symbol: 'MJ', name: 'Megajoule' },
    
    // Mass/Volume
    kg: { category: 'material', symbol: 'kg', name: 'Kilogram' },
    tonne: { category: 'material', symbol: 't', name: 'Metric tonne' },
    liter: { category: 'material', symbol: 'L', name: 'Liter' },
    m3: { category: 'material', symbol: 'm³', name: 'Cubic meter' },
    
    // Area
    ha: { category: 'land', symbol: 'ha', name: 'Hectare' },
    m2: { category: 'land', symbol: 'm²', name: 'Square meter' },
    
    // Time
    hour: { category: 'time', symbol: 'h', name: 'Hour' },
    day: { category: 'time', symbol: 'd', name: 'Day' },
    
    // Currency/Value
    ZNU: { category: 'currency', symbol: 'ZNU', name: 'Zeitnus Unit' },
    TQ: { category: 'currency', symbol: 'TQ', name: 'Thermodynamic Quotient' },
    
    // Count
    unit: { category: 'material', symbol: 'pcs', name: 'Piece/Unit' },
    count: { category: 'material', symbol: '#', name: 'Count' },
  } as const;

  // ---------------------------------------------------------------------------
  // CaaS STREAMS (Contribution as a Service)
  // ---------------------------------------------------------------------------

  private caasStreams: Map<string, CaaSStream> = new Map();

  createCaaSStream(stream: Omit<CaaSStream, 'id' | 'totalContributed' | 'status'> & { id?: string }): CaaSStream {
    const id = stream.id || `caas_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newStream: CaaSStream = {
      ...stream,
      id,
      totalContributed: 0,
      status: 'active',
    };
    this.caasStreams.set(id, newStream);
    return newStream;
  }

  processCaaSStreams(currentTime: number = Date.now()): VF_EconomicEvent[] {
    const generatedEvents: VF_EconomicEvent[] = [];

    for (const stream of this.caasStreams.values()) {
      if (stream.status !== 'active') continue;
      if (stream.endTime && currentTime > stream.endTime) continue;

      // Check if period has elapsed
      const periodMs = this.getPeriodMs(stream.period);
      const elapsedPeriods = Math.floor((currentTime - stream.startTime) / periodMs);
      const lastProcessedPeriod = Math.floor((stream.totalContributed / stream.ratePerPeriod) * periodMs / periodMs); // simplified

      if (elapsedPeriods > lastProcessedPeriod) {
        const periodsToProcess = elapsedPeriods - lastProcessedPeriod;
        
        for (let i = 0; i < periodsToProcess; i++) {
          for (const recipientId of stream.recipients) {
            const event = this.recordEvent({
              type: 'transfer',
              fromAgent: stream.contributorId,
              toAgent: recipientId,
              resource: this.resources.get(stream.resourceId)! || { id: stream.resourceId, name: '', description: '', unit: '', category: 'material', categoryCode: '' },
              quantity: stream.ratePerPeriod,
              unit: this.resources.get(stream.resourceId)?.unit || 'unit',
              recipe: stream.recipeId ? this.recipes.get(stream.recipeId) : undefined,
              timestamp: currentTime,
              raoCredentialId: stream.raoCredentialId,
            });
            generatedEvents.push(event);
          }
        }
        stream.totalContributed += stream.ratePerPeriod * periodsToProcess;
      }
    }

    return generatedEvents;
  }

  private getPeriodMs(period: CaaSStream['period']): number {
    switch (period) {
      case 'hourly': return 3600000;
      case 'daily': return 86400000;
      case 'weekly': return 604800000;
      case 'monthly': return 2592000000;
    }
  }

  getCaaSStream(id: string): CaaSStream | undefined {
    return this.caasStreams.get(id);
  }

  // ---------------------------------------------------------------------------
  // INTEROPERABILITY: TQ LEDGER ↔ VALUEFLOWS
  // ---------------------------------------------------------------------------

  syncWithTQLedger(tqTransactions: TQTransaction[]): number {
    let synced = 0;

    for (const tx of tqTransactions) {
      // Check if already synced (by raoCredentialId or custom ID)
      const exists = this.events.some(e => e.raoCredentialId === tx.raoCredentialId);
      if (exists) continue;

      // Map TQ categories to VF categories
      const vfCategory = this.mapTQCategoryToVF(tx.category);
      const vfUnit = this.mapTQUnitToVF(tx.category);

      const resource: VF_Resource = {
        id: `tq_${tx.category}_${tx.productId}`,
        name: tx.productId,
        description: `TQ ${tx.category} from ${tx.productId}`,
        unit: vfUnit,
        category: vfCategory,
        standardizedUnit: vfUnit,
        conversionFactor: 1,
        categoryCode: this.getCategoryCode(vfCategory),
      };

      // Register resource if new
      if (!this.resources.has(resource.id)) {
        this.registerResource({
          ...resource,
          currentQuantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          location: tx.nodeId,
          custodian: tx.nodeId,
        });
      }

      // Record as VF Economic Event
      this.recordEvent({
        type: tx.type === 'production' ? 'process' : 'transfer',
        fromAgent: tx.type === 'production' ? 'produced' : tx.nodeId,
        toAgent: tx.type === 'consumption' ? 'consumed' : tx.nodeId,
        resource,
        quantity: tx.quantity,
        unit: vfUnit,
        timestamp: tx.timestamp,
        raoCredentialId: tx.raoCredentialId,
      });

      synced++;
    }

    return synced;
  }

  private mapTQCategoryToVF(category: string): VF_Resource['category'] {
    const mapping: Record<string, VF_Resource['category']> = {
      food: 'material',
      energy: 'energy',
      materials: 'material',
      services: 'service',
      knowledge: 'knowledge',
      governance: 'service',
      care: 'service',
      compute: 'service',
      data: 'knowledge',
      water: 'material',
      land: 'land',
    };
    return mapping[category] || 'material';
  }

  private mapTQUnitToVF(category: string): string {
    const mapping: Record<string, string> = {
      food: 'kg',
      energy: 'kWh',
      materials: 'kg',
      services: 'hour',
      knowledge: 'hour',
      governance: 'hour',
      care: 'hour',
      compute: 'hour',
      data: 'GB',
      water: 'liter',
      land: 'm2',
    };
    return mapping[category] || 'unit';
  }

  private getCategoryCode(category: VF_Resource['category']): string {
    return this.RESOURCE_CATEGORIES[category]?.code || 'MAT';
  }

  // ---------------------------------------------------------------------------
  // EXPORT / REPORTING
  // ---------------------------------------------------------------------------

  generateNetworkReport(networkId: string, period: { start: number; end: number }): {
    network: VF_EconomicNetwork | undefined;
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByAgent: Record<string, number>;
    resourceFlows: Record<string, { in: number; out: number; net: number }>;
    agentBalances: Record<string, Record<string, number>>;
  } {
    const network = this.networks.get(networkId);
    const events = this.getEvents({ startTime: period.start, endTime: period.end });

    const eventsByType: Record<string, number> = {};
    const eventsByAgent: Record<string, number> = {};
    const resourceFlows: Record<string, { in: number; out: number; net: number }> = {};

    for (const event of events) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsByAgent[event.fromAgent] = (eventsByAgent[event.fromAgent] || 0) + 1;
      eventsByAgent[event.toAgent] = (eventsByAgent[event.toAgent] || 0) + 1;

      const resourceKey = `${event.resource.id}:${event.unit}`;
      if (!resourceFlows[resourceKey]) {
        resourceFlows[resourceKey] = { in: 0, out: 0, net: 0 };
      }
      if (event.toAgent !== 'consumed' && event.toAgent !== 'system') {
        resourceFlows[resourceKey].in += event.quantity;
      }
      if (event.fromAgent !== 'produced' && event.fromAgent !== 'system') {
        resourceFlows[resourceKey].out += event.quantity;
      }
      resourceFlows[resourceKey].net = resourceFlows[resourceKey].in - resourceFlows[resourceKey].out;
    }

    // Agent balances
    const agentBalances: Record<string, Record<string, number>> = {};
    for (const agent of this.agents.values()) {
      agentBalances[agent.id] = Object.fromEntries(agent.resources);
    }

    return {
      network,
      totalEvents: events.length,
      eventsByType,
      eventsByAgent,
      resourceFlows,
      agentBalances,
    };
  }

  exportVFData(): {
    networks: VF_EconomicNetwork[];
    agents: VF_EconomicAgent[];
    resources: VF_EconomicResource[];
    events: VF_EconomicEvent[];
    recipes: VF_Recipe[];
    processes: VF_Process[];
    caasStreams: CaaSStream[];
  } {
    return {
      networks: Array.from(this.networks.values()),
      agents: Array.from(this.agents.values()),
      resources: Array.from(this.resources.values()),
      events: this.events,
      recipes: Array.from(this.recipes.values()),
      processes: Array.from(this.processes.values()),
      caasStreams: Array.from(this.caasStreams.values()),
    };
  }
}

// ============================================================================
// VF RECIPE TEMPLATES (Common Patterns)
// ============================================================================

export const VF_RECIPE_TEMPLATES = {
  solarProduction: (): VF_Recipe => ({
    id: '',
    name: 'Producción Solar Fotovoltaica',
    description: 'Generación de electricidad desde paneles solares',
    inputs: [
      { resourceId: 'resource_sunlight', quantity: 1000, unit: 'W/m2', note: 'Irradiación solar' },
      { resourceId: 'resource_panel', quantity: 1, unit: 'pcs', note: 'Panel fotovoltaico' },
    ],
    outputs: [
      { resourceId: 'resource_electricity', quantity: 200, unit: 'Wh', note: 'Electricidad generada (20% eficiencia)' },
    ],
    processType: 'production',
    duration: 3600, // 1 hour
    location: 'solar_farm',
  }),

  foodProduction: (crop: string, yieldKg: number, areaHa: number): VF_Recipe => ({
    id: '',
    name: `Producción ${crop}`,
    description: `Cultivo regenerativo de ${crop}`,
    inputs: [
      { resourceId: 'resource_land', quantity: areaHa, unit: 'ha', note: 'Tierra cultivable' },
      { resourceId: 'resource_seeds', quantity: 50, unit: 'kg', note: 'Semillas' },
      { resourceId: 'resource_compost', quantity: 5000, unit: 'kg', note: 'Compost' },
      { resourceId: 'resource_water', quantity: 500000, unit: 'liter', note: 'Agua de riego' },
      { resourceId: 'resource_labor', quantity: 200, unit: 'hour', note: 'Trabajo humano' },
    ],
    outputs: [
      { resourceId: `resource_${crop}`, quantity: yieldKg, unit: 'kg', note: `Cosecha ${crop}` },
      { resourceId: 'resource_biomass', quantity: yieldKg * 0.3, unit: 'kg', note: 'Biomasa residual para compost' },
    ],
    processType: 'production',
    duration: 86400000 * 120, // 120 days
    location: 'farm',
  }),

  compostProduction: (): VF_Recipe => ({
    id: '',
    name: 'Producción Compost',
    description: 'Compostaje de residuos orgánicos',
    inputs: [
      { resourceId: 'resource_organic_waste', quantity: 1000, unit: 'kg', note: 'Residuos orgánicos' },
      { resourceId: 'resource_structure', quantity: 200, unit: 'kg', note: 'Material estructurante (paja, astillas)' },
      { resourceId: 'resource_labor', quantity: 10, unit: 'hour', note: 'Volteo y monitoreo' },
    ],
    outputs: [
      { resourceId: 'resource_compost', quantity: 600, unit: 'kg', note: 'Compost maduro' },
      { resourceId: 'resource_co2', quantity: 200, unit: 'kg', note: 'CO2 biogénico' },
    ],
    processType: 'transformation',
    duration: 86400000 * 90, // 90 days
    location: 'compost_site',
  }),

  waterHarvesting: (): VF_Recipe => ({
    id: '',
    name: 'Cosecha de Agua de Lluvia',
    description: 'Captación y almacenamiento de agua pluvial',
    inputs: [
      { resourceId: 'resource_rainfall', quantity: 1000, unit: 'mm', note: 'Precipitación anual' },
      { resourceId: 'resource_catchment', quantity: 1000, unit: 'm2', note: 'Superficie de captación' },
      { resourceId: 'resource_storage', quantity: 100, unit: 'm3', note: 'Capacidad de almacenamiento' },
    ],
    outputs: [
      { resourceId: 'resource_water', quantity: 800, unit: 'm3', note: 'Agua almacenada (80% eficiencia)' },
      { resourceId: 'resource_recharge', quantity: 200, unit: 'm3', note: 'Recarga acuífero' },
    ],
    processType: 'production',
    duration: 86400000 * 365, // Annual
    location: 'water_harvesting',
  }),
};

// ============================================================================
// FACTORY
// ============================================================================

export function createValueFlowsEngine(): ValueFlowsEngine {
  return new ValueFlowsEngine();
}

// ============================================================================
// EXPORTS
// ============================================================================

export const valueFlowsEngine = new ValueFlowsEngine();
export default valueFlowsEngine;