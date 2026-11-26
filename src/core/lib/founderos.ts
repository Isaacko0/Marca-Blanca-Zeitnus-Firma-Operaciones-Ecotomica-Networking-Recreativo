// src/core/lib/founderos.ts
// FounderOS Business Command Center — ALRAC/Zeitnus.
// Command center para operador único: departamentos IA-asistidos (comms, funnel,
// social, finances, agents, knowledge graph), dashboard único en vivo,
// crons/skills/workflows, operador único con contraseña.
// Demo mode + modo real. Licencia MIT (permisiva, verificar).
// NO copia código fuente Next.js/TypeScript del repositorio original.
// NO accede a founderos.sh.

export type NombreDepartamento =
  | 'comms'
  | 'funnel'
  | 'social'
  | 'finances'
  | 'agents'
  | 'knowledge_graph';

export type ModoDashboard = 'demo' | 'real';

export interface Departamento {
  id: string;
  nombre: NombreDepartamento;
  activo: boolean;
  agentes: string[];
  tareas: string[];
  runs: string[];
  fechaUltimaActividad: number;
}

export interface Agente {
  id: string;
  departamentoId: string;
  nombre: string;
  tipo: NombreDepartamento;
  estado: 'activo' | 'inactivo' | 'ocupado';
  ultimaTarea?: string;
}

export interface Tarea {
  id: string;
  departamentoId: string;
  agenteId?: string;
  nombre: string;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'fallida';
  tqCosto: number;     // kWh consumidos (unidad contable TQ)
  fechaCreacion: number;
  fechaCompletado?: number;
}

export interface Run {
  id: string;
  tareaId: string;
  estado: 'ejecutando' | 'completado' | 'fallido';
  resultado?: string;
  fechaInicio: number;
  fechaFin?: number;
}

export interface Cron {
  id: string;
  nombre: string;
  expresionCron: string;
  departamentoId: string;
  activo: boolean;
  ultimaEjecucion?: number;
}

export interface Skill {
  id: string;
  nombre: string;
  departamentoId: string;
  descripcion: string;
  version: string;
  activo: boolean;
}

export interface Workflow {
  id: string;
  nombre: string;
  departamentoId: string;
  pasos: string[];     // IDs de tareas en secuencia
  estado: 'borrador' | 'activo' | 'pausado';
  activo: boolean;
}

export interface Deal {
  id: string;
  nombre: string;
  departamentoId: string; // finances
  valor: number;
  moneda: string;         // 'TQ' o 'ZNU'
  estado: 'abierto' | 'cerrado_ganado' | 'cerrado_perdido';
  fechaCreacion: number;
}

export interface Campaign {
  id: string;
  nombre: string;
  departamentoId: string; // social
  objetivo: string;
  estado: 'planificada' | 'activa' | 'completada';
  fechaInicio: number;
  fechaFin?: number;
}

export interface Drift {
  id: string;
  departamentoId: string;
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta';
  detectadoEn: number;
  resuelto: boolean;
}

export interface KnowledgeGraph {
  id: string;
  nombre: string;
  notasMarkdown: string[];   // rutas de notas importadas (gbrain)
  embedded: boolean;         // gbrain --no-embed o con embeddings
  ultimaActualizacion: number;
}

export interface Operador {
  id: string;
  nombre: string;
  contraseñaHash: string;    // nunca almacenar en texto plano
  accesoAutorizado: boolean;
  fechaUltimoAcceso?: number;
}

export interface Dashboard {
  id: string;
  operadorId: string;
  departamentos: string[];   // IDs de departamentos visibles
  widgets: string[];           // IDs de widgets activos
  modo: ModoDashboard;
  fechaCreacion: number;
}

export interface EstadoFounderos {
  departamentos: Departamento[];
  agentes: Agente[];
  tareas: Tarea[];
  runs: Run[];
  crons: Cron[];
  skills: Skill[];
  workflows: Workflow[];
  deals: Deal[];
  campaigns: Campaign[];
  drifts: Drift[];
  knowledgeGraphs: KnowledgeGraph[];
  operador: Operador | null;
  dashboard: Dashboard | null;
}

let deptoCounter = 0;
let agenteCounter = 0;
let tareaCounter = 0;
let runCounter = 0;
let cronCounter = 0;
let skillCounter = 0;
let workflowCounter = 0;
let dealCounter = 0;
let campaignCounter = 0;
let driftCounter = 0;
let kgCounter = 0;
let operadorCounter = 0;
let dashboardCounter = 0;

function nextDeptoId(): string {
  deptoCounter += 1;
  return `depto-${Date.now()}-${deptoCounter}`;
}

function nextAgenteId(): string {
  agenteCounter += 1;
  return `agente-${Date.now()}-${agenteCounter}`;
}

function nextTareaId(): string {
  tareaCounter += 1;
  return `tarea-${Date.now()}-${tareaCounter}`;
}

function nextRunId(): string {
  runCounter += 1;
  return `run-${Date.now()}-${runCounter}`;
}

function nextCronId(): string {
  cronCounter += 1;
  return `cron-${Date.now()}-${cronCounter}`;
}

function nextSkillId(): string {
  skillCounter += 1;
  return `skill-${Date.now()}-${skillCounter}`;
}

function nextWorkflowId(): string {
  workflowCounter += 1;
  return `workflow-${Date.now()}-${workflowCounter}`;
}

function nextDealId(): string {
  dealCounter += 1;
  return `deal-${Date.now()}-${dealCounter}`;
}

function nextCampaignId(): string {
  campaignCounter += 1;
  return `campaign-${Date.now()}-${campaignCounter}`;
}

function nextDriftId(): string {
  driftCounter += 1;
  return `drift-${Date.now()}-${driftCounter}`;
}

function nextKGId(): string {
  kgCounter += 1;
  return `kg-${Date.now()}-${kgCounter}`;
}

function nextOperadorId(): string {
  operadorCounter += 1;
  return `operador-${Date.now()}-${operadorCounter}`;
}

function nextDashboardId(): string {
  dashboardCounter += 1;
  return `dashboard-${Date.now()}-${dashboardCounter}`;
}

/**
 * Crea una instancia del Business Command Center con un operador único
 * y contraseña. Modo demo o real.
 */
export function crearCommandCenter(
  operadorNombre: string,
  contraseña: string,
  modo: ModoDashboard = 'demo',
): EstadoFounderos {
  const operador: Operador = {
    id: nextOperadorId(),
    nombre: operadorNombre,
    contraseñaHash: hashContraseña(contraseña), // placeholder: en producción usar bcrypt/argon2
    accesoAutorizado: true,
    fechaUltimoAcceso: Date.now(),
  };

  const dashboard: Dashboard = {
    id: nextDashboardId(),
    operadorId: operador.id,
    departamentos: [],
    widgets: [],
    modo,
    fechaCreacion: Date.now(),
  };

  return {
    departamentos: [],
    agentes: [],
    tareas: [],
    runs: [],
    crons: [],
    skills: [],
    workflows: [],
    deals: [],
    campaigns: [],
    drifts: [],
    knowledgeGraphs: [],
    operador,
    dashboard,
  };
}

/**
 * Registra un departamento IA-asistido.
 */
export function registrarDepartamento(
  estado: EstadoFounderos,
  nombre: Departamento['nombre'],
): Departamento {
  const depto: Departamento = {
    id: nextDeptoId(),
    nombre,
    activo: true,
    agentes: [],
    tareas: [],
    runs: [],
    fechaUltimaActividad: Date.now(),
  };
  return {
    ...estado,
    departamentos: [...estado.departamentos, depto],
  };
}

/**
 * Crea un agente asignado a un departamento.
 */
export function crearAgente(
  estado: EstadoFounderos,
  departamentoId: string,
  nombre: string,
  tipo: NombreDepartamento,
): Agente {
  const depto = estado.departamentos.find((d) => d.id === departamentoId);
  if (!depto) {
    throw new Error('founderos: departamento no encontrado');
  }
  const agente: Agente = {
    id: nextAgenteId(),
    departamentoId,
    nombre,
    tipo,
    estado: 'activo',
  };
  return {
    ...estado,
    agentes: [...estado.agentes, agente],
    departamentos: estado.departamentos.map((d) =>
      d.id === departamentoId ? { ...d, agentes: [...d.agentes, agente.id] } : d,
    ),
  };
}

/**
 * Registra una tarea con su costo en TQ (unidad contable).
 */
export function registrarTarea(
  estado: EstadoFounderos,
  departamentoId: string,
  nombre: string,
  tqCosto: number,
): Tarea {
  if (tqCosto < 0) {
    throw new Error('founderos: tqCosto no puede ser negativo');
  }
  const depto = estado.departamentos.find((d) => d.id === departamentoId);
  if (!depto) {
    throw new Error('founderos: departamento no encontrado');
  }
  const tarea: Tarea = {
    id: nextTareaId(),
    departamentoId,
    nombre,
    estado: 'pendiente',
    tqCosto,
    fechaCreacion: Date.now(),
  };
  return {
    ...estado,
    tareas: [...estado.tareas, tarea],
    departamentos: estado.departamentos.map((d) =>
      d.id === departamentoId ? { ...d, tareas: [...d.tareas, tarea.id] } : d,
    ),
  };
}

/**
 * Ejecuta una tarea y registra el run con resultado.
 */
export function ejecutarRun(
  estado: EstadoFounderos,
  tareaId: string,
  resultado?: string,
): Run {
  const tarea = estado.tareas.find((t) => t.id === tareaId);
  if (!tarea) {
    throw new Error('founderos: tarea no encontrada');
  }
  const run: Run = {
    id: nextRunId(),
    tareaId,
    estado: 'completado',
    resultado,
    fechaInicio: Date.now(),
    fechaFin: Date.now(),
  };
  return {
    ...estado,
    runs: [...estado.runs, run],
    tareas: estado.tareas.map((t) =>
      t.id === tareaId
        ? { ...t, estado: 'completada', fechaCompletado: Date.now() }
        : t,
    ),
  };
}

/**
 * Registra una tarea programada (cron).
 */
export function registrarCron(
  estado: EstadoFounderos,
  nombre: string,
  expresionCron: string,
  departamentoId: string,
): Cron {
  const depto = estado.departamentos.find((d) => d.id === departamentoId);
  if (!depto) {
    throw new Error('founderos: departamento no encontrado');
  }
  const cron: Cron = {
    id: nextCronId(),
    nombre,
    expresionCron,
    departamentoId,
    activo: true,
  };
  return {
    ...estado,
    crons: [...stateCrons(estado), cron],
  };
}

/**
 * Registra una habilidad de agente.
 */
export function registrarSkill(
  estado: EstadoFounderos,
  nombre: string,
  departamentoId: string,
  descripcion: string,
  version: string,
): Skill {
  const depto = estado.departamentos.find((d) => d.id === departamentoId);
  if (!depto) {
    throw new Error('founderos: departamento no encontrado');
  }
  const skill: Skill = {
    id: nextSkillId(),
    nombre,
    departamentoId,
    descripcion,
    version,
    activo: true,
  };
  return {
    ...estado,
    skills: [...estado.skills, skill],
  };
}

/**
 * Registra un flujo de trabajo con secuencia de tareas.
 */
export function registrarWorkflow(
  estado: EstadoFounderos,
  nombre: string,
  departamentoId: string,
  pasos: string[],
): Workflow {
  const depto = estado.departamentos.find((d) => d.id === departamentoId);
  if (!depto) {
    throw new Error('founderos: departamento no encontrado');
  }
  const workflow: Workflow = {
    id: nextWorkflowId(),
    nombre,
    departamentoId,
    pasos,
    estado: 'borrador',
    activo: true,
  };
  return {
    ...estado,
    workflows: [...estado.workflows, workflow],
  };
}

/**
 * Activa el modo demo: datos de demo, no escriben en data/.
 */
export function activarModoDemo(
  estado: EstadoFounderos,
): EstadoFounderos {
  if (!estado.dashboard) {
    throw new Error('founderos: dashboard no encontrado');
  }
  return {
    ...estado,
    dashboard: { ...estado.dashboard, modo: 'demo' },
  };
}

/**
 * Activa el modo real: instalación en blanco.
 */
export function activarModoReal(
  estado: EstadoFounderos,
): EstadoFounderos {
  if (!estado.dashboard) {
    throw new Error('founderos: dashboard no encontrado');
  }
  return {
    ...estado,
    dashboard: { ...estado.dashboard, modo: 'real' },
  };
}

/**
 * Establece la contraseña del operador (hash, nunca texto plano).
 */
export function setearContrasenaOperador(
  estado: EstadoFounderos,
  contraseña: string,
): EstadoFounderos {
  if (!estado.operador) {
    throw new Error('founderos: operador no encontrado');
  }
  return {
    ...estado,
    operador: {
      ...estado.operador,
      contraseñaHash: hashContraseña(contraseña),
    },
  };
}

/**
 * Verifica si el operador tiene acceso autorizado con la contraseña dada.
 */
export function esAccesoAutorizado(
  operador: Operador,
  contraseña: string,
): boolean {
  if (!operador.accesoAutorizado) return false;
  return hashContraseña(contraseña) === operador.contraseñaHash;
}

/**
 * Verifica si el dashboard está en modo demo.
 */
export function esModoDemo(dashboard: Dashboard): boolean {
  return dashboard.modo === 'demo';
}

/**
 * Placeholder de hash de contraseña. En producción usar bcrypt/argon2.
 */
function hashContraseña(contraseña: string): string {
  // Nota: implementación simplificada para especificacion.
  // En producción real usar crypto.subtle o bcrypt.
  let hash = 0;
  for (let i = 0; i < contraseña.length; i++) {
    const char = contraseña.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return String(hash);
}

/**
 * Helper interno para obtener crons del estado (inmutabilidad).
 */
function stateCrons(estado: EstadoFounderos): Cron[] {
  return [...estado.crons];
}

/**
 * Registra un knowledge graph (G-Brain / Optimal Engine).
 */
export function registrarKnowledgeGraph(
  estado: EstadoFounderos,
  nombre: string,
  notasMarkdown: string[],
  embedded: boolean = false,
): KnowledgeGraph {
  const kg: KnowledgeGraph = {
    id: nextKGId(),
    nombre,
    notasMarkdown: [...notasMarkdown],
    embedded,
    ultimaActualizacion: Date.now(),
  };
  return {
    ...estado,
    knowledgeGraphs: [...estado.knowledgeGraphs, kg],
  };
}

/**
 * Registra un deal (oportunidad de negocio, departamento finances).
 */
export function registrarDeal(
  estado: EstadoFounderos,
  nombre: string,
  valor: number,
  moneda: 'TQ' | 'ZNU',
): Deal {
  const depto = estado.departamentos.find((d) => d.nombre === 'finances');
  if (!depto) {
    throw new Error('founderos: departamento finances no encontrado');
  }
  const deal: Deal = {
    id: nextDealId(),
    nombre,
    departamentoId: depto.id,
    valor,
    moneda,
    estado: 'abierto',
    fechaCreacion: Date.now(),
  };
  return {
    ...estado,
    deals: [...estado.deals, deal],
  };
}

/**
 * Registra una campaign (departamento social).
 */
export function registrarCampaign(
  estado: EstadoFounderos,
  nombre: string,
  objetivo: string,
): Campaign {
  const depto = estado.departamentos.find((d) => d.nombre === 'social');
  if (!depto) {
    throw new Error('founderos: departamento social no encontrado');
  }
  const campaign: Campaign = {
    id: nextCampaignId(),
    nombre,
    departamentoId: depto.id,
    objetivo,
    estado: 'planificada',
    fechaInicio: Date.now(),
  };
  return {
    ...estado,
    campaigns: [...estado.campaigns, campaign],
  };
}

/**
 * Registra un drift (desviación detectada en un departamento).
 */
export function registrarDrift(
  estado: EstadoFounderos,
  departamentoId: string,
  descripcion: string,
  severidad: Drift['severidad'],
): Drift {
  const drift: Drift = {
    id: nextDriftId(),
    departamentoId,
    descripcion,
    severidad,
    detectadoEn: Date.now(),
    resuelto: false,
  };
  return {
    ...estado,
    drifts: [...estado.drifts, drift],
  };
}
