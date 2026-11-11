// HSCSG v15 OS — Lógica del Automaton (asimilado de Conway / automaton)
// Agente soberano que sobrevive por base material (AUT), gobernado por las 3 Leyes MJ.
// EXTENSION: Automata Soberano E2R Fisico -- Control MFC + Biorreactor real
// EBD: ESP-D3, ESP-D6, ESP-D10, ESP-D11

import { EventEmitter } from "events";
import type {
  SoulState, BotAction, HeartbeatTask, BotChild, BotAuditEntry, SurvivalTier,
} from "@core/state/automaton"
import type { CACVectors } from "@core/state/types"
import { autFromCAC, pgsLM } from "@core/lib/metrics"
import { evaluateMJGate } from "@core/lib/orchestration"

const uid = () => Math.random().toString(36).slice(2, 9)

// ==================== ORIGINAL HSCSG AUTOMATON ====================

// Tier de supervivencia derivado de AUT real (no de creditos de nube)
export function survivalTier(aut: { ALIM: number; ENER: number; SALU: number; HABI: number; PROD: number }): SurvivalTier {
  const avg = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  if (avg >= 0.8) return "high"
  if (avg >= 0.5) return "normal"
  if (avg >= 0.25) return "low_material"
  if (avg > 0) return "critical"
  return "dormant"
}

export const TIER_META: Record<SurvivalTier, { label: string; color: string; note: string }> = {
  high: { label: "Alto", color: "text-emerald-400", note: "Base material prospera; pleno operacion." },
  normal: { label: "Normal", color: "text-lime-400", note: "Base material sostiene al agente." },
  low_material: { label: "Baja material", color: "text-yellow-400", note: "AUT cae; reducir consumo, regresar a tierra." },
  critical: { label: "Critico", color: "text-orange-400", note: "Casi sin base; priorizar regeneracion." },
  dormant: { label: "Dormido", color: "text-[var(--dim)]", note: "Sin base material; latido minimo hasta que haya tierra." },
}

// Evaluar accion del agente contra las 3 Leyes MJ (reusa gate de Orquestacion/Conway-isomorfo)
export function evaluateAction(
  label: string,
  ctx: { pgs: number; pop: number; usdc: number; hitsBaseMaterial: boolean },
): { pass: boolean; law?: "I" | "II" | "III"; reason: string } {
  const g = evaluateMJGate(label, ctx)
  return { pass: g.pass, law: g.law ?? undefined, reason: g.reason }
}

// Drift de la SOUL: si el AUT es 0 pero la SOUL dice "prospera", esta flotante (Ley III)
export function soulDrift(soul: SoulState, aut: { ALIM: number; ENER: number; SALU: number; HABI: number; PROD: number }): "anclada" | "flotante" {
  const avg = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  const claimsProsperity = /prosper|soberan|florec/i.test(soul.purpose)
  if (claimsProsperity && avg < 0.25) return "flotante"
  return "anclada"
}

// Spawn de hijo con constitucion MJ propagada
export function spawnChild(parent: SoulState, baseMaterialTarget: string): BotChild {
  return {
    id: uid(),
    name: `${parent.name}-hijo-${Math.floor(Math.random() * 90 + 10)}`,
    baseMaterialTarget,
    parentId: parent.id,
    constitutionMJ: true,
    spawnedAt: Date.now(),
  }
}

// Latido de tarea de base material
export function runHeartbeat(task: HeartbeatTask): HeartbeatTask {
  return { ...task, lastRun: Date.now() }
}

export function botStats(
  actions: BotAction[],
  children: BotChild[],
  cac: CACVectors,
) {
  const aut = autFromCAC(cac)
  const pgs = pgsLM(aut)
  const tier = survivalTier(aut)
  const approved = actions.filter((a) => a.status === "approved" || a.status === "executed").length
  const denied = actions.filter((a) => a.status === "denied").length
  return { pgs, tier, approved, denied, children: children.length }
}

export function makeBotAudit(
  action: string, detail: string, tone: BotAuditEntry["tone"], lawRef?: "I" | "II" | "III",
): BotAuditEntry {
  return { id: uid(), ts: Date.now(), action, detail, tone, lawRef }
}

// ==================== EXTENSION: AUTOMATA SOBERANO E2R FISICO ====================

export type E2RPhase = "idle" | "explore" | "mj_gate" | "execute" | "review" | "retroalimentar" | "error";

export interface AutomatonConfig {
  id: string;
  name: string;
  explore: {
    budget: number;
    depth: number;
    diversityWeight: number;
    noveltyThreshold: number;
    temperature: number;
    maxCandidates: number;
  };
  mjGate: {
    strictness: number;
    minScore: number;
    requireConsensus: boolean;
    vetoThreshold: number;
    evidenceRequired: boolean;
    timeout_ms: number;
  };
  execute: {
    maxConcurrent: number;
    timeout_ms: number;
    rollbackOnFailure: boolean;
    confirmBeforeAct: boolean;
    dryRun: boolean;
  };
  review: {
    metricsWindow_hours: number;
    compareToBaseline: boolean;
    significanceThreshold: number;
    requireHumanValidation: boolean;
    autoRetroalimentar: boolean;
  };
  hardware: {
    mfcIds: string[];
    bioreactorIds: string[];
    svdArrayId: string;
    bridgeEndpoint: string;
  };
  memory: {
    maxEpisodes: number;
    consolidationInterval_hours: number;
    forgetThreshold: number;
    transferLearning: boolean;
  };
  metadata: Record<string, unknown>;
}

export interface AutomatonState {
  phase: E2RPhase;
  cycleCount: number;
  lastCycleTimestamp: number;
  currentPlan: ActionPlan | null;
  executionHistory: ExecutionRecord[];
  memory: EpisodicMemory;
  performance: PerformanceMetrics;
  errors: string[];
  warnings: string[];
}

export interface ActionPlan {
  id: string;
  generatedAt: number;
  actions: AtomicAction[];
  predictedOutcome: PredictedOutcome;
  mjGateScore: number;
  mjGatePassed: boolean;
  mjGateVotes: Record<string, boolean>;
  evidence: EvidenceRecord[];
  metadata: Record<string, unknown>;
}

export interface AtomicAction {
  id: string;
  type: ActionType;
  target: string;
  command: string;
  parameters: Record<string, unknown>;
  preconditions: Precondition[];
  postconditions: Postcondition[];
  estimatedDuration_ms: number;
  energyCost_J: number;
  priority: number;
  rollbackAction?: AtomicAction;
}

export type ActionType = 
  | "mfc_feed" 
  | "mfc_reinoculate" 
  | "mfc_set_resistance"
  | "bioreactor_dose_nutrient"
  | "bioreactor_harvest"
  | "bioreactor_set_light"
  | "bioreactor_set_temp"
  | "pump_control"
  | "valve_control"
  | "heater_control"
  | "cooler_control"
  | "led_control"
  | "sensor_calibrate"
  | "system_reboot"
  | "custom";

export interface Precondition {
  sensor: string;
  operator: ">" | "<" | ">=" | "<=" | "==" | "!=";
  value: number;
  tolerance?: number;
}

export interface Postcondition {
  sensor: string;
  operator: ">" | "<" | ">=" | "<=" | "==" | "!=";
  value: number;
  timeout_ms: number;
}

export interface PredictedOutcome {
  expectedMetrics: Record<string, number>;
  confidence: number;
  riskFactors: string[];
  estimatedDuration_ms: number;
  estimatedEnergy_J: number;
}

export interface ExecutionRecord {
  planId: string;
  actionId: string;
  startedAt: number;
  completedAt?: number;
  success: boolean;
  actualOutcome: Record<string, number>;
  error?: string;
  rollbackExecuted: boolean;
  reviewScore?: number;
}

export interface EpisodicMemory {
  episodes: Episode[];
  index: Map<string, number[]>;
  consolidated: boolean;
  lastConsolidation: number;
}

export interface Episode {
  id: string;
  timestamp: number;
  context: Record<string, unknown>;
  plan: ActionPlan;
  execution: ExecutionRecord[];
  outcome: Record<string, number>;
  review: ReviewResult;
  lessons: string[];
  tags: string[];
}

export interface ReviewResult {
  score: number;
  metrics: Record<string, number>;
  comparedToBaseline: boolean;
  baselineComparison: Record<string, { baseline: number; actual: number; delta: number }>;
  significantChanges: string[];
  lessons: string[];
  humanValidated: boolean;
  validatorId?: string;
}

export interface EvidenceRecord {
  id: string;
  type: "sensor" | "actuator" | "human" | "external" | "derived";
  source: string;
  timestamp: number;
  data: Record<string, unknown>;
  hash: string;
  signatures: string[];
  metadata: Record<string, unknown>;
}

export interface PerformanceMetrics {
  totalCycles: number;
  successfulCycles: number;
  failedCycles: number;
  mjGatePassRate: number;
  avgReviewScore: number;
  avgExecutionTime_ms: number;
  totalEnergy_J: number;
  uptime_hours: number;
  learningRate: number;
}

export class SovereignAutomaton extends EventEmitter {
  public readonly config: AutomatonConfig;
  public state: AutomatonState;
  private cycleInterval: NodeJS.Timeout | null = null;
  private bridge: any;
  private svdArray: any;
  private mfcModules: Map<string, any> = new Map();
  private bioreactorModules: Map<string, any> = new Map();
  private startTime: number;

  constructor(config: AutomatonConfig) {
    super();
    this.config = { ...config };
    this.startTime = Date.now();
    this.state = this.initializeState();
  }

  private initializeState(): AutomatonState {
    return {
      phase: "idle",
      cycleCount: 0,
      lastCycleTimestamp: 0,
      currentPlan: null,
      executionHistory: [],
      memory: {
        episodes: [],
        index: new Map(),
        consolidated: false,
        lastConsolidation: 0
      },
      performance: {
        totalCycles: 0,
        successfulCycles: 0,
        failedCycles: 0,
        mjGatePassRate: 0,
        avgReviewScore: 0,
        avgExecutionTime_ms: 0,
        totalEnergy_J: 0,
        uptime_hours: 0,
        learningRate: 0
      },
      errors: [],
      warnings: []
    };
  }

  public async initialize(): Promise<void> {
    try {
      const bridgeModule = await import("./bridge.js");
      this.bridge = bridgeModule.getBridge();
    } catch (e) {
      this.state.warnings.push("Bridge no disponible - modo simulacion");
    }
    
    for (const mfcId of this.config.hardware.mfcIds) {
      try {
        const mfcModule = await import("./mfc.js");
        this.mfcModules.set(mfcId, mfcModule.getMFC(mfcId));
      } catch (e) {
        this.state.warnings.push(`MFC ${mfcId} no disponible`);
      }
    }
    
    for (const bioId of this.config.hardware.bioreactorIds) {
      try {
        const bioModule = await import("./bioreactor_spirulina.js");
        this.bioreactorModules.set(bioId, bioModule.getBioreactor(bioId));
      } catch (e) {
        this.state.warnings.push(`Biorreactor ${bioId} no disponible`);
      }
    }
    
    try {
      const svdModule = await import("./svd.js");
      this.svdArray = svdModule.getSVDArray();
    } catch (e) {
      this.state.warnings.push("SVD array no disponible");
    }
    
    this.emit("initialized", { automatonId: this.config.id });
  }

  public startAutonomousCycle(interval_ms: number = 300000): void {
    if (this.cycleInterval) return;
    
    this.cycleInterval = setInterval(() => {
      this.runE2RCycle();
    }, interval_ms);
    
    this.runE2RCycle();
    this.emit("cycle:started", { interval_ms });
  }

  public stopAutonomousCycle(): void {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
      this.emit("cycle:stopped");
    }
  }

  public async runE2RCycle(): Promise<void> {
    const cycleStart = Date.now();
    this.state.cycleCount++;
    this.state.lastCycleTimestamp = cycleStart;
    
    try {
      this.state.phase = "explore";
      this.emit("phase:explore", { cycle: this.state.cycleCount });
      
      const candidates = await this.explore();
      if (candidates.length === 0) {
        this.state.phase = "idle";
        return;
      }
      
      this.state.phase = "mj_gate";
      this.emit("phase:mj_gate", { cycle: this.state.cycleCount, candidates: candidates.length });
      
      const approvedPlan = await this.mjGate(candidates);
      if (!approvedPlan) {
        this.state.phase = "idle";
        this.emit("mj_gate:rejected", { cycle: this.state.cycleCount });
        return;
      }
      
      this.state.currentPlan = approvedPlan;
      
      this.state.phase = "execute";
      this.emit("phase:execute", { cycle: this.state.cycleCount, planId: approvedPlan.id });
      
      const executionResults = await this.execute(approvedPlan);
      
      this.state.phase = "review";
      this.emit("phase:review", { cycle: this.state.cycleCount });
      
      const review = await this.review(approvedPlan, executionResults);
      
      this.state.phase = "retroalimentar";
      this.emit("phase:retroalimentar", { cycle: this.state.cycleCount });
      
      await this.retroalimentar(approvedPlan, executionResults, review);
      
      this.updatePerformance(approvedPlan, executionResults, review);
      
      this.state.phase = "idle";
      this.emit("cycle:completed", { 
        cycle: this.state.cycleCount, 
        duration_ms: Date.now() - cycleStart,
        planId: approvedPlan.id,
        reviewScore: review.score
      });
      
    } catch (error) {
      this.state.phase = "error";
      this.state.errors.push(`${error}`);
      this.emit("cycle:error", { cycle: this.state.cycleCount, error });
      this.state.phase = "idle";
    }
  }

  private async explore(): Promise<ActionPlan[]> {
    const candidates: ActionPlan[] = [];
    const budget = this.config.explore.budget;
    const currentState = await this.getSystemState();
    
    const strategies = [
      () => this.generateMaintenanceCandidates(currentState),
      () => this.generateOptimizationCandidates(currentState),
      () => this.generateExplorationCandidates(currentState),
      () => this.generateEmergencyCandidates(currentState)
    ];
    
    for (const strategy of strategies) {
      const stratCandidates = await strategy();
      candidates.push(...stratCandidates);
      if (candidates.length >= budget) break;
    }
    
    const filtered = this.filterAndDiversify(candidates, budget);
    
    for (const candidate of filtered) {
      candidate.mjGateScore = await this.preScoreCandidate(candidate, currentState);
    }
    
    filtered.sort((a, b) => b.mjGateScore - a.mjGateScore);
    return filtered.slice(0, this.config.explore.maxCandidates);
  }

  private async getSystemState(): Promise<Record<string, any>> {
    const state: Record<string, any> = {
      timestamp: Date.now(),
      automaton: this.state,
      mfcs: {},
      bioreactors: {},
      svd: null
    };
    
    for (const [id, mfc] of this.mfcModules) {
      try {
        state.mfcs[id] = mfc.exportState ? mfc.exportState() : { id, state: "unknown" };
      } catch (e) {
        state.mfcs[id] = { id, error: String(e) };
      }
    }
    
    for (const [id, bio] of this.bioreactorModules) {
      try {
        state.bioreactors[id] = bio.exportState ? bio.exportState() : { id, state: "unknown" };
      } catch (e) {
        state.bioreactors[id] = { id, error: String(e) };
      }
    }
    
    if (this.svdArray) {
      try {
        state.svd = this.svdArray.getLatestReading();
      } catch (e) {
        state.svd = { error: String(e) };
      }
    }
    
    return state;
  }

  private async generateMaintenanceCandidates(systemState: any): Promise<ActionPlan[]> {
    const plans: ActionPlan[] = [];
    
    for (const [id, mfc] of Object.entries(systemState.mfcs)) {
      const mfcState = (mfc as any).state;
      if (mfcState && Date.now() - mfcState.lastFeeding > this.getFeedingInterval(id) * 3600000) {
        plans.push(this.createPlan([
          {
            id: `feed_${id}_${Date.now()}`,
            type: "mfc_feed",
            target: id,
            command: "feed",
            parameters: { substrate: "acetate", volume_ml: 50 },
            preconditions: [],
            postconditions: [{ sensor: `${id}_voltage`, operator: ">", value: 0.2, timeout_ms: 3600000 }],
            estimatedDuration_ms: 60000,
            energyCost_J: 10,
            priority: 5
          }
        ], `Alimentacion MFC ${id}`));
      }
      
      if (mfcState && mfcState.health === "degrading" && mfcState.uptime_hours > 48) {
        plans.push(this.createPlan([
          {
            id: `reinoculate_${id}_${Date.now()}`,
            type: "mfc_reinoculate",
            target: id,
            command: "reinoculate",
            parameters: { source: "reserve_culture", volume_ml: 100, strainIds: ["Geobacter_sulfurreducens_lerma"] },
            preconditions: [{ sensor: `${id}_voltage`, operator: "<", value: 0.1 }],
            postconditions: [{ sensor: `${id}_voltage`, operator: ">", value: 0.2, timeout_ms: 86400000 }],
            estimatedDuration_ms: 300000,
            energyCost_J: 50,
            priority: 8
          }
        ], `Re-inoculacion MFC ${id} degradado`));
      }
    }
    
    for (const [id, bio] of Object.entries(systemState.bioreactors)) {
      const bioState = (bio as any).state;
      if (bioState && bioState.operationalStatus === "running") {
        const targetOD = 0.5;
        if (bioState.opticalDensity_750 >= targetOD) {
          plans.push(this.createPlan([
            {
              id: `harvest_${id}_${Date.now()}`,
              type: "bioreactor_harvest",
              target: id,
              command: "harvest",
              parameters: { volume_L: 5, destination: "food_human" },
              preconditions: [{ sensor: `${id}_OD750`, operator: ">=", value: targetOD }],
              postconditions: [{ sensor: `${id}_biomass_g_L`, operator: "<", value: bioState.biomass_g_L * 0.5, timeout_ms: 3600000 }],
              estimatedDuration_ms: 1800000,
              energyCost_J: 5000,
              priority: 7
            }
          ], `Cosecha biorreactor ${id}`));
        }
      }
    }
    
    return plans;
  }

  private async generateOptimizationCandidates(systemState: any): Promise<ActionPlan[]> {
    const plans: ActionPlan[] = [];
    
    for (const [id, mfc] of Object.entries(systemState.mfcs)) {
      const mfcState = (mfc as any).state;
      if (mfcState && mfcState.health === "active") {
        const currentR = mfcState.internalResistance_ohm || 470;
        const optimalR = currentR * 0.9;
        
        if (Math.abs(currentR - optimalR) > 50) {
          plans.push(this.createPlan([
            {
              id: `optimize_R_${id}_${Date.now()}`,
              type: "mfc_set_resistance",
              target: id,
              command: "set_resistance",
              parameters: { resistance_ohm: Math.round(optimalR) },
              preconditions: [{ sensor: `${id}_voltage`, operator: ">", value: 0.2 }],
              postconditions: [{ sensor: `${id}_power_mW`, operator: ">", value: mfcState.power_mW * 1.05, timeout_ms: 3600000 }],
              estimatedDuration_ms: 10000,
              energyCost_J: 5,
              priority: 4
            }
          ], `Optimizar resistencia MFC ${id}`));
        }
      }
    }
    
    for (const [id, bio] of Object.entries(systemState.bioreactors)) {
      const bioState = (bio as any).state;
      if (bioState && bioState.growthRate_per_day < 0.5 && bioState.lightCycle.phase === "day") {
        plans.push(this.createPlan([
          {
            id: `optimize_light_${id}_${Date.now()}`,
            type: "bioreactor_set_light",
            target: id,
            command: "set_intensity",
            parameters: { intensity_umol_m2_s: 200 },
            preconditions: [{ sensor: `${id}_temperature_C`, operator: "<", value: 35 }],
            postconditions: [{ sensor: `${id}_growthRate`, operator: ">", value: bioState.growthRate_per_day * 1.2, timeout_ms: 86400000 }],
            estimatedDuration_ms: 60000,
            energyCost_J: 100,
            priority: 3
          }
        ], `Optimizar luz biorreactor ${id}`));
      }
    }
    
    return plans;
  }

  private async generateExplorationCandidates(systemState: any): Promise<ActionPlan[]> {
    const plans: ActionPlan[] = [];
    
    for (const [id, mfc] of Object.entries(systemState.mfcs)) {
      const mfcState = (mfc as any).state;
      if (mfcState && mfcState.health === "active" && Math.random() < 0.1) {
        const novelSubstrates = ["spirulina_lysate", "wastewater", "urine"];
        const substrate = novelSubstrates[Math.floor(Math.random() * novelSubstrates.length)];
        
        plans.push(this.createPlan([
          {
            id: `explore_substrate_${id}_${substrate}_${Date.now()}`,
            type: "mfc_feed",
            target: id,
            command: "feed",
            parameters: { substrate, volume_ml: 20 },
            preconditions: [{ sensor: `${id}_voltage`, operator: ">", value: 0.2 }],
            postconditions: [{ sensor: `${id}_voltage`, operator: ">", value: mfcState.voltage_V * 1.1, timeout_ms: 7200000 }],
            estimatedDuration_ms: 3600000,
            energyCost_J: 20,
            priority: 2
          }
        ], `Explorar sustrato ${substrate} en MFC ${id}`));
      }
    }
    
    return plans;
  }

  private async generateEmergencyCandidates(systemState: any): Promise<ActionPlan[]> {
    const plans: ActionPlan[] = [];
    
    for (const [id, mfc] of Object.entries(systemState.mfcs)) {
      const mfcState = (mfc as any).state;
      if (mfcState && mfcState.health === "dead") {
        plans.push(this.createPlan([
          {
            id: `emergency_restart_${id}_${Date.now()}`,
            type: "mfc_reinoculate",
            target: id,
            command: "reinoculate",
            parameters: { source: "river_sludge", volume_ml: 200, strainIds: ["mixed_consortium_local"] },
            preconditions: [],
            postconditions: [{ sensor: `${id}_voltage`, operator: ">", value: 0.1, timeout_ms: 86400000 }],
            estimatedDuration_ms: 600000,
            energyCost_J: 100,
            priority: 10
          }
        ], `Reinicio emergencia MFC ${id}`));
      }
    }
    
    for (const [id, bio] of Object.entries(systemState.bioreactors)) {
      const bioState = (bio as any).state;
      if (bioState && bioState.contamination?.detected && bioState.contamination.level === "critical") {
        plans.push(this.createPlan([
          {
            id: `emergency_harvest_${id}_${Date.now()}`,
            type: "bioreactor_harvest",
            target: id,
            command: "harvest",
            parameters: { volume_L: 20, destination: "waste" },
            preconditions: [],
            postconditions: [{ sensor: `${id}_biomass_g_L`, operator: "<", value: 0.1, timeout_ms: 7200000 }],
            estimatedDuration_ms: 3600000,
            energyCost_J: 10000,
            priority: 10
          },
          {
            id: `emergency_clean_${id}_${Date.now()}`,
            type: "system_reboot",
            target: id,
            command: "clean_restart",
            parameters: { sterile: true },
            preconditions: [{ sensor: `${id}_biomass_g_L`, operator: "<", value: 0.1 }],
            postconditions: [{ sensor: `${id}_contamination`, operator: "==", value: 0, timeout_ms: 86400000 }],
            estimatedDuration_ms: 7200000,
            energyCost_J: 5000,
            priority: 10
          }
        ], `Emergencia contaminacion critica ${id}`));
      }
    }
    
    return plans;
  }

  private createPlan(actions: AtomicAction[], description: string): ActionPlan {
    const totalDuration = actions.reduce((a, b) => a + b.estimatedDuration_ms, 0);
    const totalEnergy = actions.reduce((a, b) => a + b.energyCost_J, 0);
    
    return {
      id: `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      generatedAt: Date.now(),
      actions,
      predictedOutcome: {
        expectedMetrics: {},
        confidence: 0.5,
        riskFactors: [],
        estimatedDuration_ms: totalDuration,
        estimatedEnergy_J: totalEnergy
      },
      mjGateScore: 0,
      mjGatePassed: false,
      mjGateVotes: {},
      evidence: [],
      metadata: { description }
    };
  }

  private getFeedingInterval(mfcId: string): number {
    return 12;
  }

  private filterAndDiversify(candidates: ActionPlan[], budget: number): ActionPlan[] {
    const seen = new Set<string>();
    const unique = candidates.filter(c => {
      const key = c.actions.map(a => `${a.target}_${a.command}`).join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    const byType = new Map<string, ActionPlan[]>();
    for (const c of unique) {
      const type = c.actions[0]?.type || "unknown";
      if (!byType.has(type)) byType.set(type, []);
      byType.get(type)!.push(c);
    }
    
    const diversified: ActionPlan[] = [];
    const types = Array.from(byType.keys());
    let idx = 0;
    while (diversified.length < budget && byType.size > 0) {
      const type = types[idx % types.length];
      const list = byType.get(type);
      if (list && list.length > 0) {
        diversified.push(list.shift()!);
      } else {
        byType.delete(type);
        types.splice(types.indexOf(type), 1);
      }
      idx++;
    }
    
    return diversified;
  }

  private async preScoreCandidate(candidate: ActionPlan, systemState: any): Promise<number> {
    let score = 0.5;
    
    const avgPriority = candidate.actions.reduce((a, b) => a + b.priority, 0) / candidate.actions.length;
    score += (avgPriority / 10) * 0.3;
    
    let preconditionsMet = 0;
    let totalPreconditions = 0;
    for (const action of candidate.actions) {
      for (const pre of action.preconditions) {
        totalPreconditions++;
        const sensorValue = this.getSensorValue(systemState, pre.sensor);
        if (sensorValue !== null && this.checkCondition(sensorValue, pre.operator, pre.value)) {
          preconditionsMet++;
        }
      }
    }
    if (totalPreconditions > 0) {
      score += (preconditionsMet / totalPreconditions) * 0.2;
    }
    
    const totalEnergy = candidate.actions.reduce((a, b) => a + b.energyCost_J, 0);
    score += Math.max(0, 0.1 - totalEnergy / 100000);
    
    const recentActions = this.state.executionHistory.slice(-20).map(e => e.actionId);
    const novelty = candidate.actions.filter(a => !recentActions.includes(a.id)).length / candidate.actions.length;
    score += novelty * this.config.explore.diversityWeight * 0.2;
    
    return Math.min(1, Math.max(0, score));
  }

  private getSensorValue(systemState: any, sensorId: string): number | null {
    for (const mfc of Object.values(systemState.mfcs)) {
      const m = mfc as any;
      if (m.state && m.state[sensorId] !== undefined) return m.state[sensorId];
    }
    for (const bio of Object.values(systemState.bioreactors)) {
      const b = bio as any;
      if (b.state && b.state[sensorId] !== undefined) return b.state[sensorId];
    }
    if (systemState.svd?.sensors?.[sensorId]) {
      return systemState.svd.sensors[sensorId].value;
    }
    return null;
  }

  private checkCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case ">": return value > target;
      case "<": return value < target;
      case ">=": return value >= target;
      case "<=": return value <= target;
      case "==": return Math.abs(value - target) < 0.001;
      case "!=": return Math.abs(value - target) >= 0.001;
      default: return false;
    }
  }

  private async mjGate(candidates: ActionPlan[]): Promise<ActionPlan | null> {
    for (const candidate of candidates) {
      if (candidate.mjGateScore < this.config.mjGate.minScore) continue;
      
      const preconditionsOk = await this.verifyPreconditions(candidate);
      if (!preconditionsOk) continue;
      
      if (this.config.mjGate.evidenceRequired) {
        candidate.evidence = await this.gatherEvidence(candidate);
        if (candidate.evidence.length === 0) continue;
      }
      
      if (this.config.mjGate.requireConsensus) {
        candidate.mjGateVotes = await this.getConsensus(candidate);
        const votesFor = Object.values(candidate.mjGateVotes).filter(v => v).length;
        const totalVotes = Object.keys(candidate.mjGateVotes).length;
        if (totalVotes > 0 && votesFor / totalVotes < 0.6) continue;
      }
      
      const vetoRisk = this.assessVetoRisk(candidate);
      if (vetoRisk > this.config.mjGate.vetoThreshold) continue;
      
      candidate.mjGatePassed = true;
      this.emit("mj_gate:passed", { planId: candidate.id, score: candidate.mjGateScore });
      return candidate;
    }
    
    return null;
  }

  private async verifyPreconditions(candidate: ActionPlan): Promise<boolean> {
    for (const action of candidate.actions) {
      for (const pre of action.preconditions) {
        const value = await this.readSensorReal(pre.sensor);
        if (value === null || !this.checkCondition(value, pre.operator, pre.value)) {
          return false;
        }
      }
    }
    return true;
  }

  private async readSensorReal(sensorId: string): Promise<number | null> {
    if (!this.bridge) return null;
    try {
      const result = await this.bridge.readSensor(sensorId);
      return result?.value ?? null;
    } catch {
      return null;
    }
  }

  private async gatherEvidence(candidate: ActionPlan): Promise<EvidenceRecord[]> {
    const evidence: EvidenceRecord[] = [];
    
    if (this.svdArray) {
      const reading = this.svdArray.getLatestReading();
      if (reading) {
        evidence.push({
          id: `ev_svd_${Date.now()}`,
          type: "sensor",
          source: "SVDArray",
          timestamp: reading.timestamp,
          data: reading,
          hash: this.hashObject(reading),
          signatures: [],
          metadata: { planId: candidate.id }
        });
      }
    }
    
    for (const [id, mfc] of this.mfcModules) {
      if (mfc.exportState) {
        const state = mfc.exportState();
        evidence.push({
          id: `ev_mfc_${id}_${Date.now()}`,
          type: "sensor",
          source: `MFC_${id}`,
          timestamp: Date.now(),
          data: state,
          hash: this.hashObject(state),
          signatures: [],
          metadata: { planId: candidate.id }
        });
      }
    }
    
    return evidence;
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  private async getConsensus(candidate: ActionPlan): Promise<Record<string, boolean>> {
    return {
      safety: candidate.actions.every(a => a.priority <= 8 || a.type !== "mfc_reinoculate"),
      efficiency: candidate.predictedOutcome.estimatedEnergy_J < 10000,
      sustainability: !candidate.actions.some(a => a.command === "harvest" && a.parameters.destination === "waste"),
      autonomy: true
    };
  }

  private assessVetoRisk(candidate: ActionPlan): number {
    let risk = 0;
    
    for (const action of candidate.actions) {
      if (action.command === "reinoculate" && !action.rollbackAction) risk += 0.3;
      if (action.command === "harvest" && action.parameters.destination === "waste") risk += 0.2;
      if (action.command === "clean_restart") risk += 0.4;
      if (action.energyCost_J > 5000) risk += 0.1;
    }
    
    if (candidate.evidence.length < 2) risk += 0.2;
    
    return Math.min(1, risk);
  }

  private async execute(plan: ActionPlan): Promise<ExecutionRecord[]> {
    const results: ExecutionRecord[] = [];
    
    for (const action of plan.actions) {
      const record: ExecutionRecord = {
        planId: plan.id,
        actionId: action.id,
        startedAt: Date.now(),
        success: false,
        actualOutcome: {},
        rollbackExecuted: false
      };
      
      try {
        const outcome = await this.executeAction(action);
        record.actualOutcome = outcome;
        record.success = true;
        record.completedAt = Date.now();
        
        const postOk = await this.verifyPostconditions(action);
        if (!postOk) {
          record.success = false;
          record.error = "Postcondiciones no cumplidas";
          
          if (this.config.execute.rollbackOnFailure && action.rollbackAction) {
            await this.executeAction(action.rollbackAction);
            record.rollbackExecuted = true;
          }
        }
        
      } catch (error) {
        record.success = false;
        record.error = String(error);
        record.completedAt = Date.now();
        
        if (this.config.execute.rollbackOnFailure && action.rollbackAction) {
          try {
            await this.executeAction(action.rollbackAction);
            record.rollbackExecuted = true;
          } catch (rbError) {
            record.error += ` | Rollback failed: ${rbError}`;
          }
        }
      }
      
      results.push(record);
      this.state.executionHistory.push(record);
      
      if (this.state.executionHistory.length > 1000) {
        this.state.executionHistory.shift();
      }
      
      this.emit("action:executed", { planId: plan.id, actionId: action.id, success: record.success });
    }
    
    return results;
  }

  private async executeAction(action: AtomicAction): Promise<Record<string, number>> {
    if (!this.bridge) {
      return this.simulateActionOutcome(action);
    }
    
    try {
      const result = await this.bridge.executeCommand({
        target: action.target,
        command: action.command,
        parameters: action.parameters
      });
      return result || {};
    } catch (error) {
      throw new Error(`Bridge execution failed: ${error}`);
    }
  }

  private simulateActionOutcome(action: AtomicAction): Record<string, number> {
    const outcome: Record<string, number> = {};
    
    switch (action.command) {
      case "feed":
        outcome.voltage_V = 0.35 + Math.random() * 0.1;
        outcome.current_mA = 1.5 + Math.random() * 0.5;
        break;
      case "reinoculate":
        outcome.voltage_V = 0.05;
        outcome.reinoculation_success = 1;
        break;
      case "harvest":
        outcome.biomass_g = (action.parameters.volume_L as number) * 1.0;
        outcome.water_recovered_L = (action.parameters.volume_L as number) * 0.9;
        break;
      case "dose":
        outcome.dosed = 1;
        break;
      case "set_param":
        outcome.param_set = 1;
        break;
    }
    
    return outcome;
  }

  private async verifyPostconditions(action: AtomicAction): Promise<boolean> {
    for (const post of action.postconditions) {
      const startTime = Date.now();
      while (Date.now() - startTime < post.timeout_ms) {
        const value = await this.readSensorReal(post.sensor);
        if (value !== null && this.checkCondition(value, post.operator, post.value)) {
          return true;
        }
        await new Promise(r => setTimeout(r, 1000));
      }
      return false;
    }
    return true;
  }

  private async review(plan: ActionPlan, executions: ExecutionRecord[]): Promise<ReviewResult> {
    const currentMetrics = await this.getSystemMetrics();
    const baselineMetrics = this.getBaselineMetrics(plan);
    const comparison: Record<string, { baseline: number; actual: number; delta: number }> = {};
    
    for (const [key, baseline] of Object.entries(baselineMetrics)) {
      const actual = currentMetrics[key];
      if (actual !== undefined) {
        comparison[key] = { baseline, actual, delta: actual - baseline };
      }
    }
    
    const significantChanges = Object.entries(comparison)
      .filter(([, v]) => Math.abs(v.delta) > Math.abs(v.baseline) * 0.1)
      .map(([k]) => k);
    
    let score = 0.5;
    const successfulExecutions = executions.filter(e => e.success).length;
    if (executions.length > 0) {
      score += (successfulExecutions / executions.length) * 0.3;
    }
    
    const targetImprovements = plan.predictedOutcome.expectedMetrics;
    for (const [metric, target] of Object.entries(targetImprovements)) {
      const actual = currentMetrics[metric];
      const baseline = baselineMetrics[metric];
      if (actual !== undefined && baseline !== undefined) {
        const improvement = (actual - baseline) / Math.abs(baseline || 1);
        if (improvement > 0) score += 0.1;
      }
    }
    
    const lessons: string[] = [];
    if (successfulExecutions === executions.length) {
      lessons.push("Plan ejecutado completamente exitoso");
    } else {
      lessons.push(`${executions.length - successfulExecutions} acciones fallaron`);
    }
    if (significantChanges.length > 0) {
      lessons.push(`Cambios significativos: ${significantChanges.join(", ")}`);
    }
    
    const review: ReviewResult = {
      score: Math.min(1, Math.max(0, score)),
      metrics: currentMetrics,
      comparedToBaseline: true,
      baselineComparison: comparison,
      significantChanges,
      lessons,
      humanValidated: this.config.review.requireHumanValidation,
      validatorId: undefined
    };
    
    if (this.config.review.requireHumanValidation) {
      this.emit("review:requiresHumanValidation", { planId: plan.id, review });
      setTimeout(() => {
        review.humanValidated = true;
        review.validatorId = "auto_timeout";
        this.emit("review:humanValidated", { planId: plan.id });
      }, this.config.mjGate.timeout_ms);
    }
    
    return review;
  }

  private async getSystemMetrics(): Promise<Record<string, number>> {
    const metrics: Record<string, number> = {};
    
    for (const [id, mfc] of this.mfcModules) {
      if (mfc.getEntropicMetrics) {
        const em = mfc.getEntropicMetrics();
        metrics[`${id}_xi`] = em.xiContribution;
        metrics[`${id}_power_mW`] = em.power_mW;
        metrics[`${id}_voltage_V`] = em.voltage_V;
        metrics[`${id}_ce`] = em.coulombicEfficiency;
      }
    }
    
    for (const [id, bio] of this.bioreactorModules) {
      if (bio.state) {
        const s = bio.state;
        metrics[`${id}_biomass_g_L`] = s.biomass_g_L;
        metrics[`${id}_growthRate`] = s.growthRate_per_day;
        metrics[`${id}_productivity`] = s.productivity_g_m2_day;
        metrics[`${id}_protein_pct`] = s.composition.protein_pct;
      }
    }
    
    const mfcXi = Object.values(metrics).filter((_, k) => k.endsWith("_xi"));
    if (mfcXi.length > 0) {
      metrics.total_xi = mfcXi.reduce((a, b) => a + b, 0) / mfcXi.length;
    }
    
    const bioGrowth = Object.values(metrics).filter((_, k) => k.endsWith("_growthRate"));
    if (bioGrowth.length > 0) {
      metrics.avg_growthRate = bioGrowth.reduce((a, b) => a + b, 0) / bioGrowth.length;
    }
    
    return metrics;
  }

  private getBaselineMetrics(plan: ActionPlan): Record<string, number> {
    const lastExecution = this.state.executionHistory
      .filter(e => e.planId !== plan.id)
      .pop();
    
    if (lastExecution) {
      return lastExecution.actualOutcome;
    }
    
    return {};
  }

  private async retroalimentar(plan: ActionPlan, executions: ExecutionRecord[], review: ReviewResult): Promise<void> {
    const episode: Episode = {
      id: `ep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      context: await this.getSystemState(),
      plan,
      execution: executions,
      outcome: review.metrics,
      review,
      lessons: review.lessons,
      tags: this.extractTags(plan, review)
    };
    
    this.state.memory.episodes.push(episode);
    this.indexEpisode(episode);
    
    if (this.state.memory.episodes.length > this.config.memory.maxEpisodes) {
      this.state.memory.episodes.shift();
    }
    
    if (Date.now() - this.state.memory.lastConsolidation > this.config.memory.consolidationInterval_hours * 3600000) {
      await this.consolidateMemory();
    }
    
    if (this.config.memory.transferLearning) {
      this.transferLearning(episode);
    }
    
    this.emit("retroalimentar:completed", { episodeId: episode.id, reviewScore: review.score });
  }

  private extractTags(plan: ActionPlan, review: ReviewResult): string[] {
    const tags: string[] = [];
    
    for (const action of plan.actions) {
      tags.push(action.type);
      tags.push(action.target);
    }
    
    if (review.score > 0.8) tags.push("high_success");
    if (review.score < 0.3) tags.push("failure");
    tags.push(...review.significantChanges);
    
    return [...new Set(tags)];
  }

  private indexEpisode(episode: Episode): void {
    for (const tag of episode.tags) {
      const indices = this.state.memory.index.get(tag) || [];
      indices.push(this.state.memory.episodes.length - 1);
      this.state.memory.index.set(tag, indices);
    }
  }

  private async consolidateMemory(): Promise<void> {
    const tagGroups = new Map<string, Episode[]>();
    
    for (const episode of this.state.memory.episodes) {
      for (const tag of episode.tags) {
        if (!tagGroups.has(tag)) tagGroups.set(tag, []);
        tagGroups.get(tag)!.push(episode);
      }
    }
    
    for (const [tag, episodes] of tagGroups) {
      if (episodes.length >= 3) {
        const avgScore = episodes.reduce((a, e) => a + e.review.score, 0) / episodes.length;
        const commonLessons = this.findCommonLessons(episodes);
        
        const metaEpisode: Episode = {
          id: `meta_${tag}_${Date.now()}`,
          timestamp: Date.now(),
          context: { consolidated: true, tag, episodeCount: episodes.length },
          plan: episodes[0].plan,
          execution: [],
          outcome: { avgReviewScore: avgScore },
          review: { score: avgScore, metrics: {}, comparedToBaseline: false, baselineComparison: {}, significantChanges: [], lessons: commonLessons, humanValidated: false },
          lessons: commonLessons,
          tags: [`consolidated_${tag}`]
        };
        
        this.state.memory.episodes.push(metaEpisode);
        this.indexEpisode(metaEpisode);
      }
    }
    
    this.state.memory.consolidated = true;
    this.state.memory.lastConsolidation = Date.now();
    this.emit("memory:consolidated", { episodeCount: this.state.memory.episodes.length });
  }

  private findCommonLessons(episodes: Episode[]): string[] {
    const lessonCounts = new Map<string, number>();
    
    for (const e of episodes) {
      for (const lesson of e.lessons) {
        lessonCounts.set(lesson, (lessonCounts.get(lesson) || 0) + 1);
      }
    }
    
    return Array.from(lessonCounts.entries())
      .filter(([, count]) => count >= episodes.length * 0.5)
      .map(([lesson]) => lesson);
  }

  private transferLearning(episode: Episode): void {
    const successfulActions = episode.execution
      .filter(e => e.success)
      .map(e => episode.plan.actions.find(a => a.id === e.actionId))
      .filter((a): a is AtomicAction => a !== undefined);
    
    for (const action of successfulActions) {
      const key = `transfer_${action.target}_${action.command}`;
      this.emit("transfer:learned", { key, action, reviewScore: episode.review.score });
    }
  }

  private updatePerformance(plan: ActionPlan, executions: ExecutionRecord[], review: ReviewResult): void {
    const perf = this.state.performance;
    perf.totalCycles++;
    perf.uptime_hours = (Date.now() - this.startTime) / 3600000;
    
    const successful = executions.filter(e => e.success).length;
    if (successful === executions.length && executions.length > 0) {
      perf.successfulCycles++;
    } else {
      perf.failedCycles++;
    }
    
    perf.mjGatePassRate = perf.successfulCycles / perf.totalCycles;
    perf.avgReviewScore = (perf.avgReviewScore * (perf.totalCycles - 1) + review.score) / perf.totalCycles;
    
    const totalExecTime = executions.reduce((a, e) => a + (e.completedAt || Date.now()) - e.startedAt, 0);
    perf.avgExecutionTime_ms = (perf.avgExecutionTime_ms * (perf.totalCycles - 1) + totalExecTime / executions.length) / perf.totalCycles;
    
    perf.totalEnergy_J += executions.reduce((a, e) => a + (plan.predictedOutcome.estimatedEnergy_J / executions.length), 0);
    
    if (perf.totalCycles >= 20) {
      const recentScores = this.state.executionHistory.slice(-10).map(e => e.reviewScore || 0);
      const earlyScores = this.state.executionHistory.slice(0, 10).map(e => e.reviewScore || 0);
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const earlyAvg = earlyScores.reduce((a, b) => a + b, 0) / earlyScores.length;
      perf.learningRate = (recentAvg - earlyAvg) / Math.max(0.01, earlyAvg);
    }
  }

  public getState(): AutomatonState {
    return { ...this.state };
  }

  public getCurrentPlan(): ActionPlan | null {
    return this.state.currentPlan;
  }

  public getExecutionHistory(limit?: number): ExecutionRecord[] {
    return limit ? this.state.executionHistory.slice(-limit) : [...this.state.executionHistory];
  }

  public getMemory(): EpisodicMemory {
    return this.state.memory;
  }

  public findEpisodesByTag(tag: string): Episode[] {
    const indices = this.state.memory.index.get(tag) || [];
    return indices.map(i => this.state.memory.episodes[i]).filter(Boolean);
  }

  public getPerformance(): PerformanceMetrics {
    return { ...this.state.performance };
  }

  public async triggerCycle(): Promise<void> {
    await this.runE2RCycle();
  }

  public registerMFC(mfcId: string, mfcModule: any): void {
    this.mfcModules.set(mfcId, mfcModule);
    if (!this.config.hardware.mfcIds.includes(mfcId)) {
      this.config.hardware.mfcIds.push(mfcId);
    }
  }

  public registerBioreactor(bioId: string, bioModule: any): void {
    this.bioreactorModules.set(bioId, bioModule);
    if (!this.config.hardware.bioreactorIds.includes(bioId)) {
      this.config.hardware.bioreactorIds.push(bioId);
    }
  }

  public toJSON(): string {
    return JSON.stringify({
      config: this.config,
      state: {
        ...this.state,
        memory: {
          ...this.state.memory,
          index: Array.from(this.state.memory.index.entries())
        }
      }
    }, null, 2);
  }

  public destroy(): void {
    this.stopAutonomousCycle();
    this.removeAllListeners();
  }
}

export function createKit72HAutomatonConfig(id: string = "kit72h_automaton"): AutomatonConfig {
  return {
    id,
    name: "Kit 72H Automata Soberano",
    explore: {
      budget: 10,
      depth: 3,
      diversityWeight: 0.7,
      noveltyThreshold: 0.1,
      temperature: 0.3,
      maxCandidates: 5
    },
    mjGate: {
      strictness: 0.8,
      minScore: 0.6,
      requireConsensus: false,
      vetoThreshold: 0.5,
      evidenceRequired: true,
      timeout_ms: 60000
    },
    execute: {
      maxConcurrent: 2,
      timeout_ms: 300000,
      rollbackOnFailure: true,
      confirmBeforeAct: false,
      dryRun: false
    },
    review: {
      metricsWindow_hours: 2,
      compareToBaseline: true,
      significanceThreshold: 0.05,
      requireHumanValidation: false,
      autoRetroalimentar: true
    },
    hardware: {
      mfcIds: ["kit72h_mfc_1"],
      bioreactorIds: ["kit72h_bio_1"],
      svdArrayId: "kit72h_svd",
      bridgeEndpoint: "ws://localhost:8080"
    },
    memory: {
      maxEpisodes: 500,
      consolidationInterval_hours: 24,
      forgetThreshold: 0.1,
      transferLearning: true
    },
    metadata: { profile: "kit72h_v2", version: "2.0" }
  };
}

export function createProductionAutomatonConfig(id: string = "prod_automaton"): AutomatonConfig {
  const kit = createKit72HAutomatonConfig(id);
  return {
    ...kit,
    name: "Production Automata Soberano",
    explore: {
      ...kit.explore,
      budget: 50,
      depth: 5,
      maxCandidates: 20
    },
    mjGate: {
      ...kit.mjGate,
      strictness: 0.9,
      minScore: 0.7,
      requireConsensus: true
    },
    execute: {
      ...kit.execute,
      maxConcurrent: 5,
      confirmBeforeAct: true
    },
    review: {
      ...kit.review,
      metricsWindow_hours: 24,
      requireHumanValidation: true
    },
    hardware: {
      mfcIds: ["mfc_1", "mfc_2", "mfc_3", "mfc_4", "mfc_5"],
      bioreactorIds: ["bio_1", "bio_2", "bio_3"],
      svdArrayId: "prod_svd",
      bridgeEndpoint: "ws://localhost:8080"
    },
    memory: {
      ...kit.memory,
      maxEpisodes: 5000,
      consolidationInterval_hours: 6
    },
    metadata: { profile: "production", version: "2.0" }
  };
}

let globalAutomaton: SovereignAutomaton | null = null;

export function getAutomaton(config?: AutomatonConfig): SovereignAutomaton {
  if (!globalAutomaton && config) {
    globalAutomaton = new SovereignAutomaton(config);
  }
  return globalAutomaton!;
}

export function setAutomaton(automaton: SovereignAutomaton): void {
  globalAutomaton = automaton;
}
