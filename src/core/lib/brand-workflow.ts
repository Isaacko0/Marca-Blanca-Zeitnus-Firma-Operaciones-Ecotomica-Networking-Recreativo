// Brand Workflow — Lógica Pura
// Checkpoints, ACP, Stage Seeds, Métricas

import type {
  BrandWorkflowState,
  BrandCheckpoint,
  ACPLogEntry,
  WorkflowMetrics,
} from '@core/state/brand-workflow';

/**
 * Genera ID único
 */
function generateId(prefix: string = 'cp'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Genera workflow ID
 */
export function generateWorkflowId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Inicia workflow
 */
export function startWorkflow(
  state: BrandWorkflowState,
  workflowId: string,
  initialContext: Record<string, any>
): BrandWorkflowState {
  return {
    ...state,
    workflowId,
    status: 'running',
    currentStage: 'entrevista',
    startedAt: Date.now(),
    completedAt: null,
    globalContext: { ...initialContext },
    checkpoints: [],
    acpLog: [],
    stageSeeds: {},
    metrics: {
      totalDuration: 0,
      stagesCompleted: 0,
      stagesTotal: 5,
      checkpointsSaved: 0,
      acpMessages: 0,
      errors: 0,
      retries: 0,
    },
  };
}

/**
 * Pausa workflow
 */
export function pauseWorkflow(state: BrandWorkflowState): BrandWorkflowState {
  if (state.status !== 'running') return state;

  return {
    ...state,
    status: 'paused',
    acpLog: [...state.acpLog, createACPEntry('system', 'orchestrator', 'workflow_pause', { reason: 'user_paused' })],
  };
}

/**
 * Reanuda workflow
 */
export function resumeWorkflow(state: BrandWorkflowState): BrandWorkflowState {
  if (state.status !== 'paused') return state;

  return {
    ...state,
    status: 'running',
    acpLog: [...state.acpLog, createACPEntry('system', 'orchestrator', 'workflow_resume', {})],
  };
}

/**
 * Completa workflow
 */
export function completeWorkflow(state: BrandWorkflowState): BrandWorkflowState {
  if (state.status !== 'running') return state;

  const duration = Date.now() - (state.startedAt || Date.now());

  return {
    ...state,
    status: 'completed',
    currentStage: null,
    completedAt: Date.now(),
    metrics: {
      ...state.metrics,
      totalDuration: duration,
      stagesCompleted: state.metrics.stagesTotal,
    },
    acpLog: [...state.acpLog, createACPEntry('system', 'orchestrator', 'stage_transition', { to: 'completed' })],
  };
}

/**
 * Falla workflow
 */
export function failWorkflow(state: BrandWorkflowState, error: string): BrandWorkflowState {
  return {
    ...state,
    status: 'failed',
    currentStage: null,
    completedAt: Date.now(),
    metrics: {
      ...state.metrics,
      errors: state.metrics.errors + 1,
      totalDuration: Date.now() - (state.startedAt || Date.now()),
    },
    acpLog: [...state.acpLog, createACPEntry('system', 'orchestrator', 'error', { error })],
  };
}

/**
 * Guarda checkpoint
 */
export function saveCheckpoint(
  state: BrandWorkflowState,
  stage: string,
  context: Record<string, any>
): BrandWorkflowState {
  const agentOutputs: Record<string, any> = {};
  // En implementación real: recopila outputs de agentes activos

  const checkpoint: BrandCheckpoint = {
    id: `cp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    stage,
    timestamp: Date.now(),
    context,
    agentOutputs,
    globalContextSnapshot: { ...state.globalContext },
  };

  return {
    ...state,
    checkpoints: [...state.checkpoints, checkpoint],
    metrics: {
      ...state.metrics,
      checkpointsSaved: state.metrics.checkpointsSaved + 1,
    },
    acpLog: [...state.acpLog, createACPEntry('orchestrator', 'system', 'checkpoint_save', { checkpointId: checkpoint.id, stage })],
  };
}

/**
 * Carga checkpoint
 */
export function loadCheckpoint(state: BrandWorkflowState, checkpointId: string): BrandCheckpoint | null {
  return state.checkpoints.find(c => c.id === checkpointId) || null;
}

/**
 * Emite mensaje ACP
 */
export function emitACP(
  state: BrandWorkflowState,
  entry: Omit<ACPLogEntry, 'id' | 'timestamp'>
): BrandWorkflowState {
  const acpEntry: ACPLogEntry = {
    id: `acp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    ...entry,
  };

  return {
    ...state,
    acpLog: [...state.acpLog, acpEntry],
    metrics: {
      ...state.metrics,
      acpMessages: state.metrics.acpMessages + 1,
    },
  };
}

/**
 * Crea entrada ACP
 */
function createACPEntry(
  from: string,
  to: string,
  type: ACPLogEntry['type'],
  payload: Record<string, any>
): ACPLogEntry {
  return {
    id: `acp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    from,
    to,
    type,
    payload,
    correlationId: `corr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  };
}

/**
 * Establece contexto global
 */
export function setGlobalContext(
  state: BrandWorkflowState,
  key: string,
  value: any
): BrandWorkflowState {
  return {
    ...state,
    globalContext: { ...state.globalContext, [key]: value },
  };
}

/**
 * Establece stage seed (conector de flujo)
 */
export function setStageSeed(
  state: BrandWorkflowState,
  target: string,
  params: Record<string, unknown>
): BrandWorkflowState {
  return {
    ...state,
    stageSeeds: { ...state.stageSeeds, [target]: params },
  };
}

/**
 * Obtiene stage seed
 */
export function getStageSeed(state: BrandWorkflowState, target: string): Record<string, unknown> | undefined {
  return state.stageSeeds[target];
}

/**
 * Limpia stage seed
 */
export function clearStageSeed(state: BrandWorkflowState, target: string): BrandWorkflowState {
  const { [target]: _, ...rest } = state.stageSeeds;
  return { ...state, stageSeeds: rest };
}

/**
 * Actualiza métricas
 */
export function updateMetrics(state: BrandWorkflowState, metrics: Partial<WorkflowMetrics>): BrandWorkflowState {
  return {
    ...state,
    metrics: { ...state.metrics, ...metrics },
  };
}

/**
 * Obtiene resumen de workflow
 */
export function getWorkflowSummary(state: BrandWorkflowState): string {
  const duration = state.startedAt ? Date.now() - state.startedAt : 0;
  const durationMin = Math.round(duration / 60000);

  return `
Workflow: ${state.workflowId || 'N/A'}
Status: ${state.status}
Current Stage: ${state.currentStage || 'N/A'}
Duration: ${durationMin} min
Stages: ${state.metrics.stagesCompleted}/${state.metrics.stagesTotal}
Checkpoints: ${state.metrics.checkpointsSaved}
ACP Messages: ${state.metrics.acpMessages}
Errors: ${state.metrics.errors}
Retries: ${state.metrics.retries}
Global Context Keys: ${Object.keys(state.globalContext).length}
Stage Seeds: ${Object.keys(state.stageSeeds).length}
Checkpoints: ${state.checkpoints.length}
`.trim();
}

/**
 * Exporta workflow a JSON
 */
export function exportWorkflowToJSON(state: BrandWorkflowState): string {
  return JSON.stringify({
    workflowId: state.workflowId,
    status: state.status,
    currentStage: state.currentStage,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    globalContext: state.globalContext,
    checkpoints: state.checkpoints,
    acpLog: state.acpLog,
    stageSeeds: state.stageSeeds,
    metrics: state.metrics,
  }, null, 2);
}

/**
 * Importa workflow desde JSON
 */
export function importWorkflowFromJSON(json: string): BrandWorkflowState | null {
  try {
    const data = JSON.parse(json);
    return {
      workflowId: data.workflowId,
      status: data.status,
      currentStage: data.currentStage,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      globalContext: data.globalContext || {},
      checkpoints: data.checkpoints || [],
      acpLog: data.acpLog || [],
      stageSeeds: data.stageSeeds || {},
      metrics: data.metrics || {
        totalDuration: 0,
        stagesCompleted: 0,
        stagesTotal: 5,
        checkpointsSaved: 0,
        acpMessages: 0,
        errors: 0,
        retries: 0,
      },
    };
  } catch {
    return null;
  }
}