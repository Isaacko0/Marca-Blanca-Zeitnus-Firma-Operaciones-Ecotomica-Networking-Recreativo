// Multi-Agent Wizard — Types & State
// 4 agentes + Campaign Map + ACP Protocol
// Isomorfo a Contento by Happpy wizard

export type AgentId = 'entrevista' | 'brandna' | 'offerstack' | 'mensaje' | 'campaignmap';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused';

export interface AgentInput {
  agentId: AgentId;
  payload: Record<string, any>;
  context: Record<string, any>;
}

export interface AgentOutput {
  agentId: AgentId;
  result: Record<string, any>;
  confidence: number; // 0-1
  warnings: string[];
  nextAgent?: AgentId;
}

export interface AgentConfig {
  id: AgentId;
  name: string;
  description: string;
  systemPrompt: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  dependencies: AgentId[];
  timeout: number; // ms
  retryable: boolean;
}

export interface WizardState {
  currentAgent: AgentId | null;
  agentStates: Record<AgentId, AgentState>;
  workflowId: string;
  checkpoints: Checkpoint[];
  globalContext: Record<string, any>;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused';
  startedAt: number | null;
  completedAt: number | null;
}

export interface AgentState {
  id: AgentId;
  status: AgentStatus;
  input: AgentInput | null;
  output: AgentOutput | null;
  progress: number; // 0-100
  startedAt: number | null;
  completedAt: number | null;
  error: string | null;
  retries: number;
}

export interface Checkpoint {
  id: string;
  agentId: AgentId;
  timestamp: number;
  input: AgentInput;
  output: AgentOutput;
  globalContextSnapshot: Record<string, any>;
}

export interface CampaignMap {
  id: string;
  pieces: CampaignPiece[];
  rhythm: 'alternating' | 'clustered';
  totalPieces: number;
  createdAt: number;
  updatedAt: number;
}

export interface CampaignPiece {
  id: string;
  name: string;
  type: 'announcement' | 'landing' | 'diagnostic' | 'email' | 'call' | 'welcome' | 'certificate';
  register: 'shadow' | 'light';
  visualAsset: boolean;
  isConversation: boolean;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedAgent?: AgentId;
  dependencies: string[]; // piece IDs
  content?: Record<string, any>;
}

export interface ACPMessage {
  id: string;
  from: AgentId;
  to: AgentId | 'orchestrator';
  type: 'input_request' | 'output_delivery' | 'checkpoint_save' | 'workflow_pause' | 'workflow_resume' | 'error';
  payload: Record<string, any>;
  timestamp: number;
  correlationId: string;
}

export interface MultiAgentWizardState {
  config: Record<AgentId, AgentConfig>;
  wizard: WizardState;
  campaignMap: CampaignMap | null;
  acpLog: ACPMessage[];

  // Acciones
  startWorkflow: (initialInput: AgentInput) => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  runAgent: (agentId: AgentId) => void;
  submitAgentOutput: (agentId: AgentId, output: AgentOutput) => void;
  saveCheckpoint: (agentId: AgentId) => void;
  loadCheckpoint: (checkpointId: string) => void;
  updateCampaignMap: (map: Partial<CampaignMap>) => void;
  emitACP: (msg: ACPMessage) => void;
  getAgentStatus: (agentId: AgentId) => AgentState | undefined;
  getWorkflowProgress: () => number;
}

export const AGENT_CONFIGS: Record<'entrevista' | 'brandna' | 'offerstack' | 'mensaje' | 'campaignmap', AgentConfig> = {
  entrevista: {
    id: 'entrevista',
    name: 'Entrevista (Agente 1)',
    description: 'Extrae Carácter, Offer Stack, Mensaje, Campaign Map del material bruto',
    systemPrompt: `Eres el Entrevistador Principal de Soul.MBA. Tu trabajo es extraer del material bruto (BranDNA, web, llamadas, notas) los 4 pilares fundamentales:
1. CARÁCTER: Arquetipo, audiencia, villano, firma, categoría, diferenciador
2. OFFER STACK: 4 ofertas con precio, escalera de valor, ticket insignia
3. MENSAJE: 8 piezas, vocabulario, do/dont, frases de firma, así/así no
4. CAMPAIGN MAP: 6+ piezas, ritmo alternado, 7 piezas campaña completa

Entrega JSON estructurado. No inventes: si no está en el material, marca como "pendiente".`,
    inputSchema: {
      rawMaterial: { type: 'string', description: 'BranDNA, web, transcripciones, notas' },
      mode: { type: 'string', enum: ['rapid', 'full'] },
    },
    outputSchema: {
      character: { type: 'object' },
      offerStack: { type: 'object' },
      message: { type: 'object' },
      campaignMap: { type: 'object' },
    },
    dependencies: [],
    timeout: 300000, // 5 min
    retryable: true,
  },
  brandna: {
    id: 'brandna',
    name: 'BranDNA (Agente 2)',
    description: 'Genera Brand DNA completo (70 signos + villano 3 caras + firma + brain signs)',
    systemPrompt: `Eres el Arquitecto de Brand DNA. Generas el BranDNA completo (70 signos) a partir de la Entrevista.
Estructura: Villano (3 caras), Firma, Categoría, Diferenciador, 70 Brain Signs (7 categorías x 10).
Valida: firma con texto + shortText, villano 3 caras con riesgos, 70 brain signs con status/version.`,
    inputSchema: {
      interviewOutput: { type: 'object' },
      existingDNA?: { type: 'object' },
    },
    outputSchema: {
      projectName: { type: 'string' },
      brandHandle: { type: 'string' },
      brandIni: { type: 'string' },
      villain: { type: 'object' },
      signature: { type: 'object' },
      category: { type: 'string' },
      differentiator: { type: 'string' },
      brainSigns: { type: 'array' },
    },
    dependencies: ['entrevista'],
    timeout: 180000, // 3 min
    retryable: true,
  },
  offerstack: {
    id: 'offerstack',
    name: 'Offer Stack (Agente 3)',
    description: 'Genera 4 ofertas con precio, escalera de valor, ticket insignia, Blueprint 27 días',
    systemPrompt: `Eres el Arquitecto de Ofertas. Generas el Offer Stack completo (4 ofertas + precios + escalera + Blueprint 27 días).
Estructura: 4 ofertas (Gratis / $333 / $3,333 / $33,333), Escalera de valor, Blueprint 27 días (Kaufman + Aulet + TEDx), Ticket insignia.
Regla: Día 22 OBLIGA venta real, no plan teórico. Fundador = Caso 0 vivido.`,
    inputSchema: {
      brandDNA: { type: 'object' },
      interviewOutput: { type: 'object' },
    },
    outputSchema: {
      offers: { type: 'array' },
      ladder: { type: 'array' },
      blueprint: { type: 'object' },
      flagship: { type: 'object' },
    },
    dependencies: ['brandna'],
    timeout: 180000,
    retryable: true,
  },
  mensaje: {
    id: 'mensaje',
    name: 'Mensaje (Agente 4)',
    description: 'Genera 8 piezas de mensaje + vocabulario + do/dont + frases + así/así no',
    systemPrompt: `Eres el Copywriter Jefe. Generas el Mensaje completo (8 piezas + vocabulario + do/dont + 6 frases + así/así no).
Estructura: Arquetipo (Decano), Audiencia (Recovering Sacrificer), 5 rasgos, Vocabulario estricto, Do/Don't, 6 frases canon, Así/Así no, Vocabulario audiencia.
Regla: "Afirma, no promete", "Contraintuitivo", "Cercano no condescendiente", "Filoso con humor", "Generoso con sustancia".`,
    inputSchema: {
      brandDNA: { type: 'object' },
      offerStack: { type: 'object' },
    },
    outputSchema: {
      archetype: { type: 'object' },
      audience: { type: 'object' },
      traits: { type: 'object' },
      vocabulary: { type: 'array' },
      doDont: { type: 'array' },
      quotes: { type: 'array' },
      audienceVocab: { type: 'object' },
    },
    dependencies: ['offerstack'],
    timeout: 180000,
    retryable: true,
  },
  campaignmap: {
    id: 'campaignmap',
    name: 'Campaign Map (Agente 5)',
    description: 'Genera Campaign Map (6+ piezas, ritmo alternado, 7 piezas campaña completa)',
    systemPrompt: `Eres el Campaign Mapper. Generas el Campaign Map completo (6+ piezas sociales + 7 piezas campaña).
Estructura: Piezas sociales (Deck, Carrusel, Post, Stories, Diploma, Papelería) + Campaña (7 piezas: Anuncio/Landing/Diagnóstico/Correo/Llamada/Bienvenida/Certificado).
Regla: Ritmo alternado sombra/luz, "Llamada" = conversación real (sin asset visual), nunca 2 seguidas mismo registro salvo marcado.`,
    inputSchema: {
      messageKit: { type: 'object' },
      offerStack: { type: 'object' },
    },
    outputSchema: {
      socialPieces: { type: 'array' },
      campaignPieces: { type: 'array' },
      rhythm: { type: 'string' },
      totalPieces: { type: 'number' },
    },
    dependencies: ['mensaje'],
    timeout: 180000,
    retryable: true,
  },
};

export interface MultiAgentWizardState {
  config: typeof AGENT_CONFIGS;
  wizard: WizardState;
  campaignMap: CampaignMap | null;
  acpLog: ACPMessage[];

  startWorkflow: (initialInput: AgentInput) => void;
  pauseWorkflow: () => void;
  resumeWorkflow: () => void;
  runAgent: (agentId: AgentId) => void;
  submitAgentOutput: (agentId: AgentId, output: AgentOutput) => void;
  saveCheckpoint: (agentId: AgentId) => void;
  loadCheckpoint: (checkpointId: string) => void;
  updateCampaignMap: (map: Partial<CampaignMap>) => void;
  emitACP: (msg: ACPMessage) => void;
  getAgentStatus: (agentId: AgentId) => AgentState | undefined;
  getWorkflowProgress: () => number;
}

export function makeMultiAgentWizardState(): MultiAgentWizardState {
  return {
    config: AGENT_CONFIGS,
    wizard: {
      currentAgent: null,
      agentStates: {
        entrevista: { id: 'entrevista', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
        brandna: { id: 'brandna', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
        offerstack: { id: 'offerstack', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
        mensaje: { id: 'mensaje', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
        campaignmap: { id: 'campaignmap', status: 'idle', input: null, output: null, progress: 0, startedAt: null, completedAt: null, error: null, retries: 0 },
      },
      workflowId: '',
      checkpoints: [],
      globalContext: {},
      status: 'idle',
      startedAt: null,
      completedAt: null,
    },
    campaignMap: null,
    acpLog: [],

    startWorkflow: (initialInput) => {},
    pauseWorkflow: () => {},
    resumeWorkflow: () => {},
    runAgent: (agentId) => {},
    submitAgentOutput: (agentId, output) => {},
    saveCheckpoint: (agentId) => {},
    loadCheckpoint: (checkpointId) => {},
    updateCampaignMap: (map) => {},
    emitACP: (msg) => {},
    getAgentStatus: (agentId) => undefined,
    getWorkflowProgress: () => 0,
  };
}