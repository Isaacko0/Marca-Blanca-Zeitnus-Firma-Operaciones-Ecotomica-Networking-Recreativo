// src/core/lib/genesis-agent.ts
// Genesis AI Agent — Community Alchemy Guide (11 pasos).
// Guía a vision holders, captura ideas y las convierte en specs de desarrollo.
// Lógica pura en TypeScript. Telegram es solo canal de entrada opcional.
// No copia código de RegenTribe.

export interface AlchemyStep {
  stepNumber: number;              // 1-11
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  artifacts: string[];             // IDs de specs generadas
  completedAt?: number;
}

export interface DevelopmentSpec {
  id: string;
  projectId: string;
  stepOrigin: number;              // paso de la guía que generó esta spec
  title: string;
  content: string;
  raoCredentialId: string;         // procedencia de la idea
  version: number;
  createdAt: number;
}

export interface ProjectAlchemyState {
  projectId: string;
  steps: Map<number, AlchemyStep>;
  specs: DevelopmentSpec[];
  currentStep: number;
}

const ALCHEMY_GUIDE: AlchemyStep[] = [
  { stepNumber: 1, title: 'Hone Your Community Vision', description: 'Define la visión clara del barrio regenerativo', status: 'pending', artifacts: [] },
  { stepNumber: 2, title: 'Recruit Your Ideal Members', description: 'Recluta miembros arquetípicos alineados', status: 'pending', artifacts: [] },
  { stepNumber: 3, title: 'Align on Agreements & Governance', description: 'Alinea acuerdos y gobernanza', status: 'pending', artifacts: [] },
  { stepNumber: 4, title: 'Plan Business Models & Infrastructure', description: 'Planea modelos de negocio e infraestructura', status: 'pending', artifacts: [] },
  { stepNumber: 5, title: 'Acquire the Best Land', description: 'Adquiere la tierra adecuada', status: 'pending', artifacts: [] },
  { stepNumber: 6, title: 'Identify Your Funding Needs', description: 'Identifica necesidades de financiamiento', status: 'pending', artifacts: [] },
  { stepNumber: 7, title: 'Strategize Your Marketing', description: 'Estrategia de marketing y divulgación', status: 'pending', artifacts: [] },
  { stepNumber: 8, title: 'Master Plan Sustainable Systems', description: 'Plan maestro de sistemas sostenibles', status: 'pending', artifacts: [] },
  { stepNumber: 9, title: 'Construct Physical Infrastructure', description: 'Construye infraestructura física', status: 'pending', artifacts: [] },
  { stepNumber: 10, title: 'Activate Community Operations', description: 'Activa operaciones comunitarias', status: 'pending', artifacts: [] },
  { stepNumber: 11, title: 'Evaluate & Iterate', description: 'Evalúa e itera', status: 'pending', artifacts: [] },
] as const;

let specIdCounter = 0;
function nextSpecId(): string {
  specIdCounter += 1;
  return `spec-${Date.now()}-${specIdCounter}`;
}

/**
 * Crea un estado de alquimia vacío para un proyecto.
 */
export function createProjectAlchemyState(projectId: string): ProjectAlchemyState {
  const steps = new Map<number, AlchemyStep>();
  for (const step of ALCHEMY_GUIDE) {
    steps.set(step.stepNumber, { ...step });
  }
  return { projectId, steps, specs: [], currentStep: 1 };
}

/**
 * Ejecuta un paso de la Community Alchemy Guide.
 * Valida que el paso sea 1-11 y que los pasos previos estén completos o en progreso.
 */
export function runAlchemyStep(
  state: ProjectAlchemyState,
  stepNumber: number,
  input: unknown,
): { step: AlchemyStep; state: ProjectAlchemyState } {
  if (stepNumber < 1 || stepNumber > 11) {
    throw new Error('genesis-agent: stepNumber debe estar entre 1 y 11');
  }

  const prevStep = state.steps.get(stepNumber - 1);
  if (stepNumber > 1 && prevStep && prevStep.status === 'pending') {
    throw new Error(`genesis-agent: el paso ${stepNumber - 1} debe completarse antes que el ${stepNumber}`);
  }

  const current = { ...state.steps.get(stepNumber) };
  current.status = 'in-progress';
  state.steps.set(stepNumber, current);
  state.currentStep = stepNumber;

  return { step: current, state };
}

/**
 * Completa un paso de la guía.
 */
export function completeAlchemyStep(
  state: ProjectAlchemyState,
  stepNumber: number,
  artifactIds: string[] = [],
): { step: AlchemyStep; state: ProjectAlchemyState } {
  const current = state.steps.get(stepNumber);
  if (!current) {
    throw new Error(`genesis-agent: paso ${stepNumber} no encontrado`);
  }

  const completed: AlchemyStep = {
    ...current,
    status: 'completed',
    artifacts: [...current.artifacts, ...artifactIds],
    completedAt: Date.now(),
  };
  state.steps.set(stepNumber, completed);

  // Avanzar al siguiente paso pendiente
  let next = stepNumber + 1;
  while (next <= 11) {
    const s = state.steps.get(next);
    if (s && s.status === 'pending') {
      state.currentStep = next;
      break;
    }
    next += 1;
  }
  if (next > 11) state.currentStep = 11;

  return { step: completed, state };
}

/**
 * Captura una idea y la convierte en una especificación de desarrollo.
 */
export function captureIdea(
  state: ProjectAlchemyState,
  projectId: string,
  idea: string,
  raoCredentialId: string,
  stepOrigin: number = state.currentStep,
): { spec: DevelopmentSpec; state: ProjectAlchemyState } {
  if (!raoCredentialId) {
    throw new Error('genesis-agent: raoCredentialId requerido');
  }

  const spec: DevelopmentSpec = {
    id: nextSpecId(),
    projectId,
    stepOrigin,
    title: idea.slice(0, 80),
    content: idea,
    raoCredentialId,
    version: 1,
    createdAt: Date.now(),
  };
  state.specs.push(spec);

  return { spec, state };
}

/**
 * Genera una especificación de desarrollo completa a partir de una idea capturada.
 */
export function generateDevelopmentSpec(
  state: ProjectAlchemyState,
  specId: string,
): { spec: DevelopmentSpec; state: ProjectAlchemyState } {
  const specIndex = state.specs.findIndex((s) => s.id === specId);
  if (specIndex === -1) {
    throw new Error(`genesis-agent: spec no encontrada: ${specId}`);
  }

  const spec = { ...state.specs[specIndex], version: spec.version + 1 };
  state.specs[specIndex] = spec;

  return { spec, state };
}

/**
 * Obtiene el progreso general del proyecto (porcentaje de pasos completados).
 */
export function getAlchemyProgress(state: ProjectAlchemyState): { completed: number; total: number; pct: number } {
  let completed = 0;
  for (const step of state.steps.values()) {
    if (step.status === 'completed') completed += 1;
  }
  return { completed, total: 11, pct: Math.round((completed / 11) * 100) };
}
