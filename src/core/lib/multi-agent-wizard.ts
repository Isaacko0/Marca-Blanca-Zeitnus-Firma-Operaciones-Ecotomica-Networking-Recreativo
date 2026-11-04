// Multi-Agent Wizard — Lógica Pura
// Orquestación ACP, checkpoints, coordinación 4 agentes + Campaign Map

import type {
  MultiAgentWizardState,
  AgentConfig,
  AgentState,
  AgentInput,
  AgentOutput,
  AgentId,
  WizardState,
  CampaignMap,
  CampaignPiece,
  Checkpoint,
  ACPMessage,
  WizardState as WizardStateType,
} from '@core/state/multi-agent-wizard';
import { AGENT_CONFIGS } from '@core/state/multi-agent-wizard';

/**
 * Genera ID único
 */
function generateId(prefix: string = 'wf'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Genera workflow ID
 */
function generateWorkflowId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Inicia workflow completo
 */
export function startWorkflow(
  state: MultiAgentWizardState,
  initialInput: AgentInput
): { wizard: WizardState; firstAgent: AgentId } {
  const workflowId = generateWorkflowId();
  const firstAgent: AgentId = 'entrevista';

  const newWizard: WizardState = {
    currentAgent: firstAgent,
    agentStates: {
      entrevista: { id: 'entrevista', status: 'running', input: initialInput, output: null, progress: 0, startedAt: Date.now(), completedAt: null, error: null, retries: 0 },
      brandna: { id: 'brandna', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
      offerstack: { id: 'offerstack', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
      mensaje: { id: 'mensaje', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
      campaignmap: { id: 'campaignmap', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
    },
    workflowId: generateWorkflowId(),
    checkpoints: [],
    globalContext: { initialInput: initialInput.payload },
    status: 'running',
    startedAt: Date.now(),
    completedAt: null,
  };

  return { wizard: newWizard, firstAgent };
}

/**
 * Ejecuta un agente específico
 */
export async function runAgent(
  state: MultiAgentWizardState,
  agentId: AgentId,
  llmCall: (prompt: string, schema: any) => Promise<any>
): Promise<{ wizard: WizardState; output: AgentOutput }> {
  const config = AGENT_CONFIGS[agentId];
  const agentState = state.wizard.agentStates[agentId];

  // Actualiza estado a running
  const updatedAgentState: AgentState = {
    ...agentState,
    status: 'running',
    startedAt: agentState.startedAt || Date.now(),
    progress: 0,
  };

  // Construye prompt completo
  const prompt = buildAgentPrompt(config, state.wizard.globalContext, state.wizard.agentStates);

  try {
    // Simula progreso
    for (let p = 10; p <= 90; p += 20) {
      updatedAgentState.progress = p;
      // En implementación real: actualiza store reactivo
      await new Promise(r => setTimeout(r, 100));
    }

    // Llama LLM real
    const result = await llmCall(buildAgentPrompt(config, state.wizard.globalContext, state.wizard.agentStates), config.outputSchema);

    const output: AgentOutput = {
      agentId,
      result,
      confidence: 0.9,
      warnings: [],
      nextAgent: getNextAgent(agentId),
    };

    updatedAgentState.status = 'completed';
    updatedAgentState.output = output;
    updatedAgentState.completedAt = Date.now();
    updatedAgentState.progress = 100;

    // Guarda checkpoint
    const checkpoint = createCheckpoint(agentId, state.wizard, state.wizard.globalContext);

    const newWizard = {
      ...state.wizard,
      agentStates: {
        ...state.wizard.agentStates,
        [agentId]: updatedAgentState,
      },
      currentAgent: getNextAgent(agentId) || null,
      checkpoints: [...state.wizard.checkpoints, checkpoint],
      globalContext: {
        ...state.wizard.globalContext,
        [`${agentId}Output`]: result,
      },
      status: getNextAgent(agentId) ? 'running' : 'completed',
      completedAt: getNextAgent(agentId) ? null : Date.now(),
    };

    return { wizard: newWizard, output };

  } catch (error) {
    updatedAgentState.status = 'failed';
    updatedAgentState.error = error instanceof Error ? error.message : 'Unknown error';
    updatedAgentState.retries += 1;

    const newWizard = {
      ...state.wizard,
      agentStates: {
        ...state.wizard.agentStates,
        [agentId]: updatedAgentState,
      },
      status: 'failed',
    };

    return { wizard: newWizard, output: { agentId, result: {}, confidence: 0, warnings: [error instanceof Error ? error.message : 'Unknown error'] } };
  }
}

/**
 * Construye prompt para agente
 */
function buildAgentPrompt(config: AgentConfig, globalContext: Record<string, any>, agentStates: Record<string, AgentState>): string {
  let prompt = `${config.systemPrompt}\n\n`;

  // Contexto global
  if (globalContext.initialInput) {
    prompt += `## Material Inicial\n${JSON.stringify(globalContext.initialInput, null, 2)}\n\n`;
  }

  // Outputs de agentes previos
  for (const dep of config.dependencies) {
    const depState = agentStates[dep];
    if (depState?.output) {
      prompt += `## Output de ${dep}\n${JSON.stringify(depState.output.result, null, 2)}\n\n`;
    }
  }

  prompt += `## Tu Tarea\nGenera output válido según el schema:\n${JSON.stringify(config.outputSchema, null, 2)}`;

  return prompt;
}

/**
 * Determina siguiente agente en la cadena
 */
function getNextAgent(currentAgent: AgentId): AgentId | null {
  const order: AgentId[] = ['entrevista', 'brandna', 'offerstack', 'mensaje', 'campaignmap'];
  const idx = order.indexOf(currentAgent);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

/**
 * Crea checkpoint
 */
function createCheckpoint(agentId: AgentId, wizard: WizardState, globalContext: Record<string, any>): Checkpoint {
  return {
    id: `cp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agentId,
    timestamp: Date.now(),
    input: wizard.agentStates[agentId].input!,
    output: wizard.agentStates[agentId].output!,
    globalContextSnapshot: { ...globalContext },
  };
}

/**
 * Pausa workflow
 */
export function pauseWorkflow(state: MultiAgentWizardState): MultiAgentWizardState {
  return {
    ...state,
    wizard: {
      ...state.wizard,
      status: 'paused',
    },
  };
}

/**
 * Reanuda workflow
 */
export function resumeWorkflow(state: MultiAgentWizardState): MultiAgentWizardState {
  return {
    ...state,
    wizard: {
      ...state.wizard,
      status: 'running',
    },
  };
}

/**
 * Carga checkpoint
 */
export function loadCheckpoint(state: MultiAgentWizardState, checkpointId: string): MultiAgentWizardState | null {
  const checkpoint = state.wizard.checkpoints.find(c => c.id === checkpointId);
  if (!checkpoint) return null;

  return {
    ...state,
    wizard: {
      ...state.wizard,
      globalContext: checkpoint.globalContextSnapshot,
      agentStates: {
        ...state.wizard.agentStates,
        [checkpoint.agentId]: {
          ...state.wizard.agentStates[checkpoint.agentId],
          input: checkpoint.input,
          output: checkpoint.output,
          status: 'completed',
          progress: 100,
          completedAt: checkpoint.timestamp,
        },
      },
      currentAgent: checkpoint.agentId,
      status: 'paused',
    },
  };
}

/**
 * Guarda checkpoint
 */
export function saveCheckpoint(state: MultiAgentWizardState, agentId: AgentId): MultiAgentWizardState {
  const checkpoint = createCheckpoint(agentId, state.wizard, state.wizard.globalContext);
  return {
    ...state,
    wizard: {
      ...state.wizard,
      checkpoints: [...state.wizard.checkpoints, checkpoint],
    },
  };
}

/**
 * Emite mensaje ACP
 */
export function emitACP(state: MultiAgentWizardState, msg: ACPMessage): MultiAgentWizardState {
  return {
    ...state,
    acpLog: [...state.acpLog, msg],
  };
}

/**
 * Actualiza Campaign Map
 */
export function updateCampaignMap(state: MultiAgentWizardState, updates: Partial<CampaignMap>): MultiAgentWizardState {
  const currentMap = state.campaignMap || createDefaultCampaignMap();
  return {
    ...state,
    campaignMap: {
      ...currentMap,
      ...updates,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Crea Campaign Map por defecto
 */
function createDefaultCampaignMap(): CampaignMap {
  return {
    id: `cm_${Date.now()}`,
    pieces: [
      { id: 'p1', name: 'Anuncio', type: 'announcement', register: 'shadow', visualAsset: true, isConversation: false, order: 1, status: 'pending', dependencies: [] },
      { id: 'p2', name: 'Landing', type: 'landing', register: 'light', visualAsset: true, order: 2, status: 'pending', dependencies: ['p1'] },
      { id: 'p3', name: 'Diagnóstico', type: 'diagnostic', register: 'shadow', visualAsset: true, order: 3, status: 'pending', dependencies: ['p2'] },
      { id: 'p4', name: 'Correo', type: 'email', register: 'light', visualAsset: true, order: 4, status: 'pending', dependencies: ['p3'] },
      { id: 'p5', name: 'Llamada', type: 'call', register: 'shadow', visualAsset: false, isConversation: true, order: 5, status: 'pending', dependencies: ['p4'] },
      { id: 'p6', name: 'Bienvenida', type: 'welcome', register: 'light', visualAsset: true, order: 6, status: 'pending', dependencies: ['p5'] },
      { id: 'p7', name: 'Certificado', type: 'certificate', register: 'shadow', visualAsset: true, order: 7, status: 'pending', dependencies: ['p6'] },
    ],
    rhythm: 'alternating',
    totalPieces: 13,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Calcula progreso del workflow (0-100)
 */
export function getWorkflowProgress(wizard: WizardState): number {
  const agents: AgentId[] = ['entrevista', 'brandna', 'offerstack', 'mensaje', 'campaignmap'];
  let totalProgress = 0;
  for (const agentId of agents) {
    totalProgress += wizard.agentStates[agentId]?.progress || 0;
  }
  return Math.round(totalProgress / agents.length);
}

/**
 * Emite mensaje ACP
 */
export function emitACP(state: any, msg: any): any {
  return {
    ...state,
    acpLog: [...state.acpLog, msg],
  };
}

/**
 * Obtiene estado de un agente
 */
export function getAgentStatus(state: MultiAgentWizardState, agentId: AgentId): AgentState | undefined {
  return state.wizard.agentStates[agentId];
}

/**
 * Obtiene progreso del workflow
 */
export function getWorkflowProgress(state: MultiAgentWizardState): number {
  return getWorkflowProgress(state.wizard);
}