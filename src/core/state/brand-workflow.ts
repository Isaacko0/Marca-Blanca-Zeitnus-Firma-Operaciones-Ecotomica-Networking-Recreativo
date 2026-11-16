// Brand Workflow — Types & State
// Estado del workflow de marca: checkpoints, ACP, globalContext, stageSeeds
// Isomorfo a Contento workflow + ACP Protocol

export interface BrandWorkflowState {
  // Workflow principal
  workflowId: string | null;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  currentStage: string | null;
  startedAt: number | null;
  completedAt: number | null;

  // Contexto global compartido entre agentes
  globalContext: Record<string, any>;

  // Checkpoints persistentes
  checkpoints: BrandCheckpoint[];

  // Log ACP (Agent Communication Protocol)
  acpLog: ACPLogEntry[];

  // Stage seeds (conector de flujo entre pantallas)
  stageSeeds: Record<string, Record<string, unknown>>;

  // Métricas
  metrics: WorkflowMetrics;

  // Acciones
  startWorkflow: (workflowId: string, initialContext: Record<string, any>) => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  completeWorkflow: () => void;
  failWorkflow: (error: string) => void;
  saveCheckpoint: (stage: string, context: Record<string, any>) => void;
  loadCheckpoint: (checkpointId: string) => BrandCheckpoint | null;
  emitACP: (entry: Omit<ACPLogEntry, 'id' | 'timestamp'>) => void;
  setGlobalContext: (key: string, value: any) => void;
  setStageSeed: (target: string, params: Record<string, unknown>) => void;
  getStageSeed: (target: string) => Record<string, unknown> | undefined;
  clearStageSeed: (target: string) => void;
  updateMetrics: (metrics: Partial<WorkflowMetrics>) => void;
}

export interface BrandCheckpoint {
  id: string;
  stage: string;
  timestamp: number;
  context: Record<string, any>;
  agentOutputs: Record<string, any>;
  globalContextSnapshot: Record<string, any>;
}

export interface ACPLogEntry {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  type: 'input_request' | 'output_delivery' | 'checkpoint_save' | 'workflow_pause' | 'workflow_resume' | 'error' | 'stage_transition';
  payload: Record<string, any>;
  correlationId: string;
}

export interface WorkflowMetrics {
  totalDuration: number; // ms
  stagesCompleted: number;
  stagesTotal: number;
  checkpointsSaved: number;
  acpMessages: number;
  errors: number;
  retries: number;
}

export function makeBrandWorkflowState() {
  return {
    workflowId: null,
    status: 'idle' as const,
    currentStage: null,
    startedAt: null,
    completedAt: null,
    globalContext: {},
    checkpoints: [],
    acpLog: [],
    stageSeeds: {},
    metrics: {
      totalDuration: 0,
      stagesCompleted: 0,
      stagesTotal: 5, // entrevista, brandna, offerstack, mensaje, campaignmap
      checkpointsSaved: 0,
      acpMessages: 0,
      errors: 0,
      retries: 0,
    },

    startWorkflow: (workflowId, initialContext) => {},
    pauseWorkflow: () => {},
    resumeWorkflow: () => {},
    completeWorkflow: () => {},
    failWorkflow: (error) => {},
    saveCheckpoint: (stage, context) => {},
    loadCheckpoint: (checkpointId) => null,
    emitACP: (entry) => {},
    setGlobalContext: (key, value) => {},
    setStageSeed: (target, params) => {},
    getStageSeed: (target) => undefined,
    clearStageSeed: (target) => {},
    updateMetrics: (metrics) => {},
  };
}