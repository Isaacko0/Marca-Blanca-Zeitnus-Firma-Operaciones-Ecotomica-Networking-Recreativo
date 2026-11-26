// src/core/lib/trina-ax.ts
// trina-ax — Self-hosted Claude Code/Codex para equipos — ALRAC/Zeitnus.
// Auto-hospedaje de IA empresarial con skills de equipo, MCP, sesiones
// compartidas y permisos granulares por carpeta.
// NO copia código fuente AGPL-3.0-only del repositorio original.
// Módulo de dominio puro en TypeScript.

export type Idioma = 'ko' | 'en' | 'ja' | 'es' | 'zh' | 'fr' | string;

export type TipoSkill =
  | 'ui-polish'
  | 'document-management'
  | 'mcp'
  | 'otro';

export type TipoSesion = 'individual' | 'compartida';

export type EstadoSesion = 'activa' | 'pausada' | 'finalizada';

export type TipoPermiso = 'leer' | 'escribir' | 'administrar';

export type TipoDocumento = 'texto' | 'hwp' | 'markdown' | 'otro';

export type TipoDespliegue = 'docker' | 'cloudformation' | 'ses';

export type EstadoDespliegue = 'planificado' | 'en_progreso' | 'completado' | 'fallido';

export interface SkillEquipo {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoSkill;
  idioma: Idioma;
  matrizAntesDespues: boolean;
  activo: boolean;
  fechaCreacion: number;
  fechaUltimaActualizacion: number;
}

export interface ServidorMCP {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
  activo: boolean;
  sesionesConectadas: string[];
  fechaRegistro: number;
}

export interface SesionIA {
  id: string;
  nombre: string;
  tipo: TipoSesion;
  participantes: string[];
  skillIds: string[];
  mcpServerIds: string[];
  estado: EstadoSesion;
  fechaInicio: number;
  fechaFin?: number;
  tqCosto: number;     // kWh consumidos (unidad contable TQ)
}

export interface PermisoCarpeta {
  id: string;
  carpeta: string;
  usuarioId: string;
  permiso: TipoPermiso;
  otorgadoPor: string;
  fechaOtorgamiento: number;
}

export interface Documento {
  id: string;
  nombre: string;
  carpeta: string;
  tipo: TipoDocumento;
  contenidoHash: string;
  propietarioId: string;
  fechaCreacion: number;
  fechaModificacion: number;
}

export interface Despliegue {
  id: string;
  tipo: TipoDespliegue;
  nombre: string;
  estado: EstadoDespliegue;
  fechaInicio: number;
  fechaFin?: number;
}

export interface SesionCompartida {
  id: string;
  sesionId: string;
  anfitrionId: string;
  invitados: string[];
  permisos: Map<string, TipoPermiso>;
  activa: boolean;
}

export interface EstadoTrinaAx {
  skillsEquipo: SkillEquipo[];
  servidoresMCP: ServidorMCP[];
  sesionesIA: SesionIA[];
  permisosCarpeta: PermisoCarpeta[];
  documentos: Documento[];
  despliegues: Despliegue[];
  sesionesCompartidas: SesionCompartida[];
}

let skillCounter = 0;
let mcpCounter = 0;
let sesionCounter = 0;
let permisoCounter = 0;
let documentoCounter = 0;
let despliegueCounter = 0;
let sesionCompartidaCounter = 0;

function nextSkillId(): string {
  skillCounter += 1;
  return `skill-${Date.now()}-${skillCounter}`;
}

function nextMcpId(): string {
  mcpCounter += 1;
  return `mcp-${Date.now()}-${mcpCounter}`;
}

function nextSesionId(): string {
  sesionCounter += 1;
  return `sesion-${Date.now()}-${sesionCounter}`;
}

function nextPermisoId(): string {
  permisoCounter += 1;
  return `permiso-${Date.now()}-${permisoCounter}`;
}

function nextDocumentoId(): string {
  documentoCounter += 1;
  return `documento-${Date.now()}-${documentoCounter}`;
}

function nextDespliegueId(): string {
  despliegueCounter += 1;
  return `despliegue-${Date.now()}-${despliegueCounter}`;
}

function nextSesionCompartidaId(): string {
  sesionCompartidaCounter += 1;
  return `sesion-compartida-${Date.now()}-${sesionCompartidaCounter}`;
}

/**
 * Crea una instancia del sistema de IA auto-hospedado para un equipo.
 */
export function crearSistemaIAEquipo(nombreEquipo: string): EstadoTrinaAx {
  return {
    skillsEquipo: [],
    servidoresMCP: [],
    sesionesIA: [],
    permisosCarpeta: [],
    documentos: [],
    despliegues: [],
    sesionesCompartidas: [],
  };
}

/**
 * Registra una habilidad de equipo compartida.
 */
export function registrarSkillEquipo(
  estado: EstadoTrinaAx,
  nombre: string,
  tipo: TipoSkill,
  idioma: Idioma,
  matrizAntesDespues: boolean,
): SkillEquipo {
  const skill: SkillEquipo = {
    id: nextSkillId(),
    nombre,
    descripcion: '',
    tipo,
    idioma,
    matrizAntesDespues,
    activo: true,
    fechaCreacion: Date.now(),
    fechaUltimaActualizacion: Date.now(),
  };
  return {
    ...estado,
    skillsEquipo: [...estado.skillsEquipo, skill],
  };
}

/**
 * Registra un servidor MCP para conexión de herramientas externas.
 */
export function registrarServidorMCP(
  estado: EstadoTrinaAx,
  nombre: string,
  url: string,
  tipo: string,
): ServidorMCP {
  const mcp: ServidorMCP = {
    id: nextMcpId(),
    nombre,
    url,
    tipo,
    activo: true,
    sesionesConectadas: [],
    fechaRegistro: Date.now(),
  };
  return {
    ...estado,
    servidoresMCP: [...estado.servidoresMCP, mcp],
  };
}

/**
 * Crea una sesión de IA (individual o compartida).
 */
export function crearSesionIA(
  estado: EstadoTrinaAx,
  nombre: string,
  tipo: TipoSesion,
  participantes: string[],
): SesionIA {
  const sesion: SesionIA = {
    id: nextSesionId(),
    nombre,
    tipo,
    participantes: [...participantes],
    skillIds: [],
    mcpServerIds: [],
    estado: 'activa',
    fechaInicio: Date.now(),
    tqCosto: 0,
  };
  return {
    ...estado,
    sesionesIA: [...estado.sesionesIA, sesion],
  };
}

/**
 * Comparte una sesión de IA con otros usuarios.
 */
export function compartirSesion(
  estado: EstadoTrinaAx,
  sesionId: string,
  anfitrionId: string,
  invitados: string[],
): SesionCompartida {
  const sesion = estado.sesionesIA.find((s) => s.id === sesionId);
  if (!sesion) {
    throw new Error('trina-ax: sesión no encontrada');
  }
  const permisos = new Map<string, TipoPermiso>();
  for (const invitado of invitados) {
    permisos.set(invitado, 'leer');
  }
  const sesionCompartida: SesionCompartida = {
    id: nextSesionCompartidaId(),
    sesionId,
    anfitrionId,
    invitados: [...invitados],
    permisos,
    activa: true,
  };
  return {
    ...estado,
    sesionesCompartidas: [...estado.sesionesCompartidas, sesionCompartida],
  };
}

/**
 * Establece un permiso granular sobre una carpeta para un usuario.
 */
export function establecerPermisoCarpeta(
  estado: EstadoTrinaAx,
  carpeta: string,
  usuarioId: string,
  permiso: TipoPermiso,
  otorgadoPor: string,
): PermisoCarpeta {
  const permisoCarpeta: PermisoCarpeta = {
    id: nextPermisoId(),
    carpeta,
    usuarioId,
    permiso,
    otorgadoPor,
    fechaOtorgamiento: Date.now(),
  };
  return {
    ...estado,
    permisosCarpeta: [...estado.permisosCarpeta, permisoCarpeta],
  };
}

/**
 * Gestiona un documento en el entorno de IA.
 */
export function gestionarDocumento(
  estado: EstadoTrinaAx,
  nombre: string,
  carpeta: string,
  tipo: TipoDocumento,
  propietarioId: string,
  contenidoHash: string,
): Documento {
  const documento: Documento = {
    id: nextDocumentoId(),
    nombre,
    carpeta,
    tipo,
    contenidoHash,
    propietarioId,
    fechaCreacion: Date.now(),
    fechaModificacion: Date.now(),
  };
  return {
    ...estado,
    documentos: [...estado.documentos, documento],
  };
}

/**
 * Registra un despliegue Docker del sistema de IA.
 */
export function desplegarDocker(
  estado: EstadoTrinaAx,
  nombre: string,
): Despliegue {
  const despliegue: Despliegue = {
    id: nextDespliegueId(),
    tipo: 'docker',
    nombre,
    estado: 'planificado',
    fechaInicio: Date.now(),
  };
  return {
    ...estado,
    despliegues: [...estado.despliegues, despliegue],
  };
}

/**
 * Activa soporte para múltiples idiomas.
 */
export function activarI18n(
  estado: EstadoTrinaAx,
  idiomas: Idioma[],
): EstadoTrinaAx {
  // El i18n se refleja en las skills registradas con su idioma.
  // No hay estado adicional que mutar en esta implementación pura.
  return {
    ...estado,
    skillsEquipo: estado.skillsEquipo.map((s) =>
      idiomas.includes(s.idioma) ? { ...s, activo: true } : s,
    ),
  };
}

/**
 * Verifica si un usuario tiene permiso sobre una carpeta.
 */
export function tienePermisoCarpeta(
  estado: EstadoTrinaAx,
  carpeta: string,
  usuarioId: string,
  permisoRequerido: TipoPermiso,
): boolean {
  const permiso = estado.permisosCarpeta.find(
    (p) => p.carpeta === carpeta && p.usuarioId === usuarioId,
  );
  if (!permiso) return false;
  const jerarquia: Record<TipoPermiso, number> = { leer: 1, escribir: 2, administrar: 3 };
  return jerarquia[permiso.permiso] >= jerarquia[permisoRequerido];
}

/**
 * Calcula el costo TQ de una sesión de IA.
 */
export function calcularTQSesion(
  duracionMinutos: number,
  participantes: number,
): number {
  // Estimación simplificada: 0.1 kWh por participante por 10 minutos.
  return Math.ceil((duracionMinutos / 10) * participantes * 0.1);
}
