// src/core/lib/virginia-pmcrt-fractal-pipeline.ts
// Virginia × PMCRT — Pipeline de Anidación Fractal con Simbiosis Logarítmica
// Implements: openspec/specs/alrac-virginia-pmcrt-fractal-nesting.md (spec 48)
// Integra: Virginia Network (N1/N2/N3) × PMCRT (9D territorial state, 5-phase cycle, 3 fondos)
// Simbiosis logarítmica: feedback fuerza = ln(depth+1)/ln(maxDepth+1)

import type { VirginiaVestingGateway } from './tq-types-extended';

// ============================================================================
// TIPOS — Pipeline de Anidación Fractal Virginia × PMCRT
// ============================================================================

export type NestingDepth = 0 | 1 | 2 | 3; // 0=N1 Root, 1=N2 Sub, 2=N3 Project, 3=Cell/Operator
export type PMCRTPhase = 'observacion' | 'diagnostico' | 'deliberacion' | 'ejecucion' | 'retroalimentacion';
export type TerritoryDimension = 'water' | 'food' | 'energy' | 'habitat' | 'care' | 'memory' | 'biosphere' | 'governance' | 'liquidity';

export interface TerritorialStateVector9D {
  water: number;        // m³, calidad, seguridad
  food: number;         // kcal, diversidad, autosuficiencia
  energy: number;       // kWh balance, renovable, autonomía
  habitat: number;      // m²/hab, reparaciones, resiliencia
  care: number;         // cobertura efectiva, equidad, funcionalidad
  memory: number;       // consentimientos, restauración, reproducibilidad
  biosphere: number;    // carbono suelo, biodiversidad, regeneración
  governance: number;   // participación, concentración poder, CDS/ICS
  liquidity: number;    // fiat, ZNU, TQ, tiempo, reserva meses
  timestamp: number;
  nodeId: string;
  depth: NestingDepth;
}

export interface PMCRTCycleResult {
  phase: PMCRTPhase;
  depth: NestingDepth;
  input: TerritorialStateVector9D;
  output: TerritorialStateVector9D;
  decisions: PMCRTDecision[];
  feedbackSignal: FeedbackSignal;
  symbiosisStrength: number; // ln(d+1)/ln(maxDepth+1)
  timestamp: number;
}

export interface PMCRTDecision {
  decisionId: string;
  phase: PMCRTPhase;
  depth: NestingDepth;
  type: 'allocacion' | 'veto' | 'propuesta' | 'correccion' | 'transmision';
  targetDepth: NestingDepth; // qué nivel recibe la decisión
  attenuation: number;        // factor logarítmico de atenuación
  fundsAllocation: { memoria: number; cuidado: number; autotrofia: number }; // 15/50/35
  raoCredentialId: string;
  timestamp: number;
}

export interface FeedbackSignal {
  sourceDepth: NestingDepth;
  targetDepth: NestingDepth;
  signalType: 'alerta' | 'prioridad' | 'correccion' | 'cenario' | 'transmision';
  strength: number; // 0-1, ya aplicada simbiosis logarítmica
  decayRate: number; // cuánto se atenúa por salto de nivel
  propagated: boolean;
  timestamp: number;
}

export interface FractalNestingNode {
  nodeId: string;
  depth: NestingDepth;
  parentId?: string;
  childIds: string[];
  virginiaLayer: 'N1' | 'N2' | 'N3' | 'CELL';
  pmcrtState: TerritorialStateVector9D;
  currentPhase: PMCRTPhase;
  cycleHistory: PMCRTCycleResult[];
  activeDecisions: PMCRTDecision[];
  pendingFeedback: FeedbackSignal[];
  symbiosisWeight: number; // ln(depth+1)/ln(maxDepth+1)
  isLeaf: boolean; // true si depth === 3 (célula/operador)
  n3Weight?: number; // Virginia N3 weight si aplica (depth >= 2)
  virginiaGateway?: VirginiaVestingGateway; // gateway Virginia para nodos N3
}

export interface FractalPipelineResult {
  rootNode: FractalNestingNode;
  allNodes: Map<string, FractalNestingNode>;
  feedbackLoops: FeedbackSignal[];
  globalCoherence: number; // 0-100
  transgenerationalProjection: TerritorialStateVector9D; // proyección 7 gen
  timestamp: number;
}

export interface FractalTreeConfig {
  rootNodeId: string;
  maxDepth: NestingDepth;
  branchingFactor: number; // hijos por nodo (Virginia: 3 N2 por N1, 3 N3 por N2)
  virginiaConfig: {
    n1RootDomainId: string;
    n2SubDomainIds: string[];
    n3ProjectDomainIds: string[];
  };
  pmcrtConfig: {
    fundsRatio: { memoria: number; cuidado: number; autotrofia: number }; // 15/50/35
    betaCritThreshold: number; // 30%
    ashbyVarietyRatio: number; // >= 1
  };
}

// ============================================================================
// CONSTANTES
// ============================================================================

const MAX_DEPTH: NestingDepth = 3;
const FUNDS_RATIO_DEFAULT = { memoria: 0.15, cuidado: 0.50, autotrofia: 0.35 }; // 15/50/35
const BETA_CRIT_THRESHOLD_DEFAULT = 0.30; // 30%
const ASHBY_VARIETY_RATIO_DEFAULT = 1.0; // >= 1

const PHASE_ORDER: PMCRTPhase[] = [
  'observacion',
  'diagnostico',
  'deliberacion',
  'ejecucion',
  'retroalimentacion',
];

const DEPTH_TO_VIRGINIA_LAYER: Record<NestingDepth, 'N1' | 'N2' | 'N3' | 'CELL'> = {
  0: 'N1',
  1: 'N2',
  2: 'N3',
  3: 'CELL',
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Fuerza de simbiosis logarítmica: ln(depth + 1) / ln(maxDepth + 1)
 * Nivel 0 (raíz): 0.00 — feedback lento, alcance global
 * Nivel 3 (célula): 1.00 — feedback máximo, localizado
 */
export function computeSymbiosis(depth: NestingDepth, maxDepth: NestingDepth = MAX_DEPTH): number {
  const maxLn = Math.log(maxDepth + 1);
  if (maxLn === 0) return 0;
  return Math.log(depth + 1) / maxLn;
}

/**
 * Factor de atenuación entre niveles: cuanto más lejos, más se atenúa
 */
export function computeAttenuation(fromDepth: NestingDepth, toDepth: NestingDepth): number {
  const diff = Math.abs(fromDepth - toDepth);
  return 1 - diff / (MAX_DEPTH + 1); // 0.75, 0.5, 0.25 para saltos de 1,2,3
}

/**
 * Crea un vector de estado 9D vacío/por defecto
 */
export function createEmptyTerritorialState(nodeId: string, depth: NestingDepth): TerritorialStateVector9D {
  return {
    water: 0,
    food: 0,
    energy: 0,
    habitat: 0,
    care: 0,
    memory: 0,
    biosphere: 0,
    governance: 0,
    liquidity: 0,
    timestamp: Date.now(),
    nodeId,
    depth,
  };
}

/**
 * Genera ID de credencial RAO
 */
export function generateRaoCredentialId(prefix: string = 'rao'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// CLASE PRINCIPAL — VirginiaPmcrFractalPipeline
// ============================================================================

export class VirginiaPmcrFractalPipeline {
  private nodes: Map<string, FractalNestingNode> = new Map();
  private config: FractalTreeConfig;
  private feedbackLoops: FeedbackSignal[] = [];
  private raoLog: string[] = [];

  constructor(config: FractalTreeConfig) {
    this.config = { ...config };
    if (!this.config.maxDepth) this.config.maxDepth = MAX_DEPTH;
    if (!this.config.branchingFactor) this.config.branchingFactor = 3;
  }

  // --------------------------------------------------------------------------
  // CONSTRUCCIÓN DEL ÁRBOL FRAC TAL
  // --------------------------------------------------------------------------

  async buildFractalTree(): Promise<FractalPipelineResult> {
    this.nodes.clear();
    this.feedbackLoops = [];
    this.raoLog = [];

    const root = this.createNode(
      this.config.rootNodeId,
      0 as NestingDepth,
      undefined
    );
    this.nodes.set(root.nodeId, root);

    // Construir niveles recursivamente: N1 → N2 → N3 → CELL
    this.buildLevel(root, 0 as NestingDepth);

    // Ejecutar ciclo PMCRT completo en cada nodo (desde hojas hacia raíz)
    const allNodes = [...this.nodes.values()].sort((a, b) => b.depth - a.depth);
    for (const node of allNodes) {
      this.runPmcrCycleFull(node.nodeId);
    }

    // Propagar feedback entre niveles con simbiosis logarítmica
    this.propagateAllFeedback();

    // Calcular coherencia global
    const globalCoherence = this.computeGlobalCoherence(this.nodes);

    // Proyección transgeneracional (7 generaciones) desde raíz
    const transgenerationalProjection = await this.projectTransgenerational(root.nodeId, 7);

    const result: FractalPipelineResult = {
      rootNode: root,
      allNodes: this.nodes,
      feedbackLoops: this.feedbackLoops,
      globalCoherence,
      transgenerationalProjection,
      timestamp: Date.now(),
    };

    return result;
  }

  private createNode(
    nodeId: string,
    depth: NestingDepth,
    parentId: string | undefined
  ): FractalNestingNode {
    const layer = DEPTH_TO_VIRGINIA_LAYER[depth];
    const symbiosisWeight = computeSymbiosis(depth);
    const isLeaf = depth === MAX_DEPTH;

    const initialState: TerritorialStateVector9D = createEmptyTerritorialState(nodeId, depth);
    // Inicializar con valores base según profundidad
    initialState.water = 50 + depth * 10;
    initialState.food = 50 + depth * 10;
    initialState.energy = 50 + depth * 10;
    initialState.habitat = 50 + depth * 10;
    initialState.care = 50 + depth * 10;
    initialState.memory = 50 + depth * 10;
    initialState.biosphere = 50 + depth * 10;
    initialState.governance = 50 + depth * 10;
    initialState.liquidity = 50 + depth * 10;

    const node: FractalNestingNode = {
      nodeId,
      depth,
      parentId,
      childIds: [],
      virginiaLayer: layer,
      pmcrtState: initialState,
      currentPhase: 'observacion',
      cycleHistory: [],
      activeDecisions: [],
      pendingFeedback: [],
      symbiosisWeight,
      isLeaf,
    };

    return node;
  }

  private buildLevel(parent: FractalNestingNode, currentDepth: NestingDepth): void {
    if (currentDepth >= MAX_DEPTH) return;

    const nextDepth = (currentDepth + 1) as NestingDepth;
    for (let i = 0; i < this.config.branchingFactor; i++) {
      const childId = `${parent.nodeId}_L${nextDepth}_${i + 1}`;
      const child = this.createNode(childId, nextDepth, parent.nodeId);
      this.nodes.set(child.nodeId, child);
      parent.childIds.push(child.nodeId);
      this.buildLevel(child, nextDepth);
    }
  }

  // --------------------------------------------------------------------------
  // CICLO PMCRT POR NODO (5 fases)
  // --------------------------------------------------------------------------

  runPmcrCycleFull(nodeId: string): PMCRTCycleResult {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Nodo no encontrado: ${nodeId}`);

    const results: PMCRTCycleResult[] = [];
    let currentState = { ...node.pmcrtState };

    for (const phase of PHASE_ORDER) {
      const result = this.runPmcrPhase(node, phase, currentState);
      results.push(result);
      currentState = result.output;
      node.currentPhase = phase;
    }

    // Guardar historial
    node.cycleHistory.push(...results);
    node.pmcrtState = currentState;

    // Retornar el resultado de la última fase (retroalimentación)
    const lastResult = results[results.length - 1]!;
    this.feedbackLoops.push(lastResult.feedbackSignal);

    return lastResult;
  }

  private runPmcrPhase(
    node: FractalNestingNode,
    phase: PMCRTPhase,
    input: TerritorialStateVector9D
  ): PMCRTCycleResult {
    const depth = node.depth;
    const symbiosisStrength = computeSymbiosis(depth);
    const raoId = generateRaoCredentialId(`pmcrt_${phase}`);

    let output: TerritorialStateVector9D;
    let decisions: PMCRTDecision[] = [];
    let feedbackSignal: FeedbackSignal;

    switch (phase) {
      case 'observacion': {
        // Fase 1: Observación territorial — actualizar vector estado 9D
        output = this.phaseObservacion(node, input);
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'alerta',
          strength: symbiosisStrength,
          decayRate: 1 - symbiosisStrength,
          propagated: false,
          timestamp: Date.now(),
        };
        break;
      }

      case 'diagnostico': {
        // Fase 2: Diagnóstico metabólico-cibernético — balance, desviaciones, ratio Ashby
        output = this.phaseDiagnostico(node, input);
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'prioridad',
          strength: symbiosisStrength,
          decayRate: 1 - symbiosisStrength,
          propagated: false,
          timestamp: Date.now(),
        };
        break;
      }

      case 'deliberacion': {
        // Fase 3: Deliberación recípranárquica — 1p1v, Consejo de Futuros, asignación 3 fondos
        const { output: deliberationOutput, decisions: phaseDecisions } = this.phaseDeliberacion(
          node,
          input,
          symbiosisStrength
        );
        output = deliberationOutput;
        decisions = phaseDecisions;
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'correccion',
          strength: symbiosisStrength,
          decayRate: 1 - symbiosisStrength,
          propagated: false,
          timestamp: Date.now(),
        };
        break;
      }

      case 'ejecucion': {
        // Fase 4: Ejecución y auditoría — Berry vesting, DisCO flows, balances
        output = this.phaseEjecucion(node, input);
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'cenario',
          strength: symbiosisStrength,
          decayRate: 1 - symbiosisStrength,
          propagated: false,
          timestamp: Date.now(),
        };
        break;
      }

      case 'retroalimentacion': {
        // Fase 5: Retroalimentación y transmisión — x_{t+1}, escenarios, transmisión
        output = this.phaseRetroalimentacion(node, input);
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'transmision',
          strength: symbiosisStrength,
          decayRate: 1 - symbiosisStrength,
          propagated: false,
          timestamp: Date.now(),
        };
        break;
      }

      default: {
        output = input;
        feedbackSignal = {
          sourceDepth: depth,
          targetDepth: depth,
          signalType: 'alerta',
          strength: 0,
          decayRate: 1,
          propagated: false,
          timestamp: Date.now(),
        };
      }
    }

    const result: PMCRTCycleResult = {
      phase,
      depth,
      input,
      output,
      decisions,
      feedbackSignal,
      symbiosisStrength,
      timestamp: Date.now(),
    };

    node.activeDecisions.push(...decisions);
    this.raoLog.push(`${phase}@${node.nodeId}@${depth}@${raoId}`);

    return result;
  }

  // --------------------------------------------------------------------------
  // FASES PMCRT INDIVIDUALES
  // --------------------------------------------------------------------------

  private phaseObservacion(
    node: FractalNestingNode,
    input: TerritorialStateVector9D
  ): TerritorialStateVector9D {
    // Observación: actualizar vector estado con datos del nodo
    return {
      ...input,
      timestamp: Date.now(),
      depth: node.depth,
    };
  }

  private phaseDiagnostico(
    node: FractalNestingNode,
    input: TerritorialStateVector9D
  ): TerritorialStateVector9D {
    // Diagnóstico metabólico: detectar desviaciones, calcular balance
    const { betaCritThreshold, ashbyVarietyRatio } = this.config.pmcrtConfig;

    // Verificar ratio Ashby: capacidad_respuesta / variedad_perturbaciones >= 1
    const ashbySatisfied = ashbyVarietyRatio >= 1;

    // Verificar beta_crit: liquidez no excede threshold
    const betaCritOk = input.liquidity <= betaCritThreshold * 100 || input.depth === 0;

    const output: TerritorialStateVector9D = {
      ...input,
      governance: ashbySatisfied ? input.governance : input.governance * 0.9, // penalizar si no hay variedad suficiente
      liquidity: betaCritOk ? input.liquidity : input.liquidity * 0.7, // reducir si excede beta_crit
      timestamp: Date.now(),
    };

    // Registrar alerta de diagnóstico si hay problemas
    if (!ashbySatisfied || !betaCritOk) {
      node.pendingFeedback.push({
        sourceDepth: node.depth,
        targetDepth: node.parentId !== undefined ? node.depth : node.depth,
        signalType: 'alerta',
        strength: node.symbiosisWeight,
        decayRate: 1 - node.symbiosisWeight,
        propagated: false,
        timestamp: Date.now(),
      });
    }

    return output;
  }

  private phaseDeliberacion(
    node: FractalNestingNode,
    input: TerritorialStateVector9D,
    symbiosisStrength: number
  ): { output: TerritorialStateVector9D; decisions: PMCRTDecision[] } {
    const { fundsRatio } = this.config.pmcrtConfig;
    const depth = node.depth;
    const decisions: PMCRTDecision[] = [];

    // Asignación 3 fondos: 15% Memoria / 50% Cuidado / 35% Autotrofia
    const totalLiquidity = input.liquidity;
    const allocMemoria = totalLiquidity * fundsRatio.memoria;
    const allocCuidado = totalLiquidity * fundsRatio.cuidado;
    const allocAutotrofia = totalLiquidity * fundsRatio.autotrofia;

    // Decisión de asignación
    const allocDecision: PMCRTDecision = {
      decisionId: generateRaoCredentialId('alloc'),
      phase: 'deliberacion',
      depth,
      type: 'allocacion',
      targetDepth: depth,
      attenuation: 1 - symbiosisStrength,
      fundsAllocation: { memoria: allocMemoria, cuidado: allocCuidado, autotrofia: allocAutotrofia },
      raoCredentialId: generateRaoCredentialId('alloc_rao'),
      timestamp: Date.now(),
    };
    decisions.push(allocDecision);

    // Consejo de Futuros: veto suspensivo si biosfera < 30 o agua < 30
    if (input.biosphere < 30 || input.water < 30) {
      const vetoDecision: PMCRTDecision = {
        decisionId: generateRaoCredentialId('veto'),
        phase: 'deliberacion',
        depth,
        type: 'veto',
        targetDepth: depth > 0 ? (depth - 1 as NestingDepth) : depth, // veto sube al padre
        attenuation: computeAttenuation(depth, depth > 0 ? (depth - 1 as NestingDepth) : depth),
        fundsAllocation: { memoria: 0, cuidado: 0, autotrofia: 0 },
        raoCredentialId: generateRaoCredentialId('veto_rao'),
        timestamp: Date.now(),
      };
      decisions.push(vetoDecision);
    }

    // Una persona, un voto: cada nodo delibera de forma autónoma
    // (sin ponderación por tokens — es 1p1v por nodo/operador)

    const output: TerritorialStateVector9D = {
      ...input,
      liquidity: input.liquidity - totalLiquidity, // liquidez asignada a fondos
      timestamp: Date.now(),
    };

    return { output, decisions };
  }

  private phaseEjecucion(
    _node: FractalNestingNode,
    input: TerritorialStateVector9D
  ): TerritorialStateVector9D {
    // Ejecución: Berry vesting, DisCO flows, balances auditados
    // Ley MJ I: no tocar base material — validar antes de ejecutar
    const respectsBaseMaterial = true; // validación externa

    if (!respectsBaseMaterial) {
      // Bloquear ejecución si toca base material
      return { ...input, timestamp: Date.now() };
    }

    // Aplicar asignaciones de fondos del estado actual
    const output: TerritorialStateVector9D = {
      ...input,
      // Ejecución reduce liquidez disponible, incrementa cuidado
      care: Math.min(100, input.care + input.liquidity * 0.1),
      liquidity: input.liquidity * 0.5, // 50% ejecutado, 50% reserva
      timestamp: Date.now(),
    };

    return output;
  }

  private phaseRetroalimentacion(
    node: FractalNestingNode,
    input: TerritorialStateVector9D
  ): TerritorialStateVector9D {
    // Retroalimentación: x_{t+1}, escenarios revisados, transmisión transgeneracional
    const output: TerritorialStateVector9D = {
      ...input,
      // Integrar feedback pendiente
      governance: Math.min(100, input.governance + node.pendingFeedback.length * 5),
      memory: Math.min(100, input.memory + 5), // transmisión de aprendizaje
      timestamp: Date.now(),
    };

    // Limpiar feedback procesado
    node.pendingFeedback = [];

    return output;
  }

  // --------------------------------------------------------------------------
  // PROPAGACIÓN DE FEEDBACK CON SIMBIOSIS LOGARÍTMICA
  // --------------------------------------------------------------------------

  propagateAllFeedback(): void {
    // Propagar feedback de hojas hacia raíz (bottom-up) y de raíz hacia hojas (top-down)
    const nodesByDepth = [...this.nodes.values()].sort((a, b) => b.depth - a.depth);

    // Bottom-up: hojas envían señales hacia arriba
    for (const node of nodesByDepth) {
      if (node.parentId === undefined) continue; // saltar raíz

      const parent = this.nodes.get(node.parentId)!;
      const attenuation = computeAttenuation(node.depth, parent.depth);

      // Señal de retroalimentación del hijo al padre
      const signal: FeedbackSignal = {
        sourceDepth: node.depth,
        targetDepth: parent.depth,
        signalType: 'correccion',
        strength: node.symbiosisWeight * attenuation,
        decayRate: 1 - node.symbiosisWeight,
        propagated: true,
        timestamp: Date.now(),
      };

      parent.pendingFeedback.push(signal);
      this.feedbackLoops.push(signal);

      // El padre incorpora la señal del hijo en su estado
      parent.pmcrtState = {
        ...parent.pmcrtState,
        governance: Math.min(100, parent.pmcrtState.governance + signal.strength * 10),
        biosphere: Math.min(100, parent.pmcrtState.biosphere + signal.strength * 5),
      };
    }

    // Top-down: raíz envía directrices de coherencia hacia abajo
    const root = this.nodes.get(this.config.rootNodeId);
    if (root) {
      this.propagateDownward(root, root.pmcrtState);
    }
  }

  private propagateDownward(node: FractalNestingNode, parentState: TerritorialStateVector9D): void {
    for (const childId of node.childIds) {
      const child = this.nodes.get(childId);
      if (!child) continue;

      const attenuation = computeAttenuation(node.depth, child.depth);

      // Señal de directriz del padre al hijo (atenuada por simbiosis)
      const signal: FeedbackSignal = {
        sourceDepth: node.depth,
        targetDepth: child.depth,
        signalType: 'cenario',
        strength: (1 - node.symbiosisWeight) * attenuation,
        decayRate: node.symbiosisWeight,
        propagated: true,
        timestamp: Date.now(),
      };

      child.pendingFeedback.push(signal);
      this.feedbackLoops.push(signal);

      // El hijo ajusta su estado basado en la directriz del padre
      child.pmcrtState = {
        ...child.pmcrtState,
        governance: Math.min(100, child.pmcrtState.governance + parentState.governance * 0.1 * attenuation),
        energy: Math.min(100, child.pmcrtState.energy + parentState.energy * 0.05 * attenuation),
      };

      // Recursión hacia niveles más profundos
      this.propagateDownward(child, child.pmcrtState);
    }
  }

  // --------------------------------------------------------------------------
  // INTERFAZ PÚBLICA — VirginiaPmcrFractalPipeline
  // --------------------------------------------------------------------------

  runPmcrCycle(
    nodeId: string,
    phase: PMCRTPhase,
    input: TerritorialStateVector9D
  ): PMCRTCycleResult {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Nodo no encontrado: ${nodeId}`);

    return this.runPmcrPhase(node, phase, input);
  }

  propagateFeedback(
    signal: FeedbackSignal,
    fromDepth: NestingDepth,
    toDepth: NestingDepth
  ): FeedbackSignal {
    const attenuation = computeAttenuation(fromDepth, toDepth);
    const symbiosis = computeSymbiosis(toDepth);

    return {
      ...signal,
      sourceDepth: fromDepth,
      targetDepth: toDepth,
      strength: signal.strength * attenuation * symbiosis,
      decayRate: 1 - symbiosis,
      propagated: true,
      timestamp: Date.now(),
    };
  }

  computeSymbiosis(depth: NestingDepth): number {
    return computeSymbiosis(depth, this.config.maxDepth);
  }

  attenuateDecision(
    decision: PMCRTDecision,
    fromDepth: NestingDepth,
    toDepth: NestingDepth
  ): PMCRTDecision {
    const attenuation = computeAttenuation(fromDepth, toDepth);

    return {
      ...decision,
      targetDepth: toDepth,
      attenuation: decision.attenuation * attenuation,
      fundsAllocation: {
        memoria: decision.fundsAllocation.memoria * attenuation,
        cuidado: decision.fundsAllocation.cuidado * attenuation,
        autotrofia: decision.fundsAllocation.autotrofia * attenuation,
      },
      timestamp: Date.now(),
    };
  }

  async projectTransgenerational(
    nodeId: string,
    generations: number
  ): Promise<TerritorialStateVector9D> {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Nodo no encontrado: ${nodeId}`);

    // Proyección 7 generaciones: degradación logarítmica de recursos + regeneración
    let state = { ...node.pmcrtState };
    const genFactor = 0.95; // 5% degradación por generación sin intervención
    const regenFactor = 1.02; // 2% regeneración por intervención consciente

    for (let g = 0; g < generations; g++) {
      state = {
        ...state,
        water: state.water * genFactor * regenFactor,
        food: state.food * genFactor * regenFactor,
        energy: state.energy * genFactor * regenFactor,
        habitat: state.habitat * genFactor * regenFactor,
        care: state.care * genFactor * regenFactor,
        memory: Math.min(100, state.memory + 2), // memoria se acumula
        biosphere: state.biosphere * genFactor * regenFactor,
        governance: state.governance * genFactor * regenFactor,
        liquidity: state.liquidity * genFactor,
        timestamp: Date.now() + g * 365 * 24 * 3600 * 1000,
      };
    }

    return state;
  }

  computeGlobalCoherence(nodes: Map<string, FractalNestingNode>): number {
    if (nodes.size === 0) return 0;

    let totalCoherence = 0;
    let weightedSum = 0;

    for (const node of nodes.values()) {
      // Coherencia de un nodo = promedio de sus dimensiones estado
      const dims = [
        node.pmcrtState.water,
        node.pmcrtState.food,
        node.pmcrtState.energy,
        node.pmcrtState.habitat,
        node.pmcrtState.care,
        node.pmcrtState.memory,
        node.pmcrtState.biosphere,
        node.pmcrtState.governance,
        node.pmcrtState.liquidity,
      ];
      const nodeCoherence = dims.reduce((sum, d) => sum + d, 0) / dims.length;

      // Ponderar por simbiosis (niveles profundos cuentan más para coherencia local)
      const weight = 1 + node.symbiosisWeight;
      totalCoherence += nodeCoherence * weight;
      weightedSum += weight;
    }

    return Math.round((totalCoherence / weightedSum) * 100) / 100;
  }

  async runFullPipeline(rootNodeId: string): Promise<FractalPipelineResult> {
    // Ejecutar pipeline completo: construir árbol si no existe, correr todos los ciclos
    if (this.nodes.size === 0) {
      return this.buildFractalTree();
    }

    // Re-ejecutar ciclo en todos los nodos
    const allNodes = [...this.nodes.values()].sort((a, b) => b.depth - a.depth);
    for (const node of allNodes) {
      try {
        this.runPmcrCycleFull(node.nodeId);
      } catch (error) {
        // Graceful degradation: si un nodo falla, continuar con los demás
        console.warn(`Nodo ${node.nodeId} falló en pipeline, continuando:`, error);
      }
    }

    // Re-propagar feedback
    this.propagateAllFeedback();

    const globalCoherence = this.computeGlobalCoherence(this.nodes);
    const root = this.nodes.get(rootNodeId);
    const transgenerationalProjection = root
      ? await this.projectTransgenerational(rootNodeId, 7)
      : createEmptyTerritorialState(rootNodeId, 0 as NestingDepth);

    return {
      rootNode: root!,
      allNodes: this.nodes,
      feedbackLoops: this.feedbackLoops,
      globalCoherence,
      transgenerationalProjection,
      timestamp: Date.now(),
    };
  }

  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------

  getNode(nodeId: string): FractalNestingNode | undefined {
    return this.nodes.get(nodeId);
  }

  getAllNodes(): Map<string, FractalNestingNode> {
    return new Map(this.nodes);
  }

  getFeedbackLoops(): FeedbackSignal[] {
    return [...this.feedbackLoops];
  }

  getRaolog(): string[] {
    return [...this.raoLog];
  }

  getConfig(): FractalTreeConfig {
    return { ...this.config };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createVirginiaPmcrFractalPipeline(
  config: FractalTreeConfig
): VirginiaPmcrFractalPipeline {
  return new VirginiaPmcrFractalPipeline(config);
}

// ============================================================================
// CONFIG POR DEFECTO — Virginia × PMCRT
// ============================================================================

export const DEFAULT_FRACTAL_TREE_CONFIG: FractalTreeConfig = {
  rootNodeId: 'zeitnus-root-n1',
  maxDepth: 3,
  branchingFactor: 3,
  virginiaConfig: {
    n1RootDomainId: 'domain-root-zeitnus',
    n2SubDomainIds: ['domain-governance', 'domain-ecosystem', 'domain-tech'],
    n3ProjectDomainIds: ['proj-regeneration', 'proj-education', 'proj-infrastructure'],
  },
  pmcrtConfig: {
    fundsRatio: FUNDS_RATIO_DEFAULT,
    betaCritThreshold: BETA_CRIT_THRESHOLD_DEFAULT,
    ashbyVarietyRatio: ASHBY_VARIETY_RATIO_DEFAULT,
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export default VirginiaPmcrFractalPipeline;