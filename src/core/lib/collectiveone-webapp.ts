// src/core/lib/collectiveone-webapp.ts
// Repositorio CollectiveOneWebapp — Estructura de app web colectiva — ALRAC/Zeitnus.
// Backend (Java/Spring Boot 2.0), Frontend (Vue), db-migrations, testing.
// Gobernanza ligera: 3 contributors, 1,420 commits, 35 branches.
// NO copia código fuente del repositorio original. NO asume funcionalidades no documentadas.
// NO accede a www.collectiveone.org. Licencia LICENSE.md por verificar.

export type CapaNombre = 'backend' | 'frontend' | 'db-migrations' | 'testing';

export interface CapaApp {
  nombre: CapaNombre;
  tecnologias: string[];
  porcentaje?: number;
}

export interface Commit {
  hash: string;
  mensaje: string;
  autor: string;
  fecha: number;
  esUltimo: boolean;
}

export interface Branch {
  nombre: string;
  esRamaPrincipal: boolean;
}

export interface Contributor {
  nombre: string;
  usuarioGitHub: string;
  avatarUrl?: string;
}

export interface LicenciaInfo {
  archivo: 'LICENSE.md';
  contenidoLeido: boolean;
  tipo?: string;
  compatibleConALRAC: boolean;
}

interface RespuestaALRAC {
  usarCodigoFuente: boolean;
  reimplementarLogicaPura: boolean;
  verificarLicenciaAntesDeUsar: boolean;
  revisarSeguridadCodigoAbandonado: boolean;
  mapearCapasAAlRAC: boolean;
}

export interface EstadoAppWeb {
  capas: CapaApp[];
  commits: Commit[];
  branches: Branch[];
  contributors: Contributor[];
  licencia: LicenciaInfo;
  esCodigoAbandonado: boolean;
  fechaUltimoCommit: number;
}

const AÑOS_ABANDONO = 2;
const MILESEGUNDOS_POR_AÑO = 365 * 24 * 60 * 60 * 1000;

let commitCounter = 0;
function nextCommitHash(): string {
  commitCounter += 1;
  return `commit-${Date.now()}-${commitCounter}`;
}

let branchCounter = 0;
function nextBranchId(): string {
  branchCounter += 1;
  return `branch-${Date.now()}-${branchCounter}`;
}

let contributorCounter = 0;
function nextContributorId(): string {
  contributorCounter += 1;
  return `contributor-${Date.now()}-${contributorCounter}`;
}

/**
 * Registra una capa de la aplicación con sus tecnologías.
 */
export function registrarCapa(
  capa: Omit<CapaApp, 'porcentaje'>,
): CapaApp {
  return {
    ...capa,
    porcentaje: undefined,
  };
}

/**
 * Registra un commit en el historial del repositorio.
 */
export function registrarCommit(
  mensaje: string,
  autor: string,
  fecha: number,
  esUltimo: boolean = false,
): Commit {
  return {
    hash: nextCommitHash(),
    mensaje,
    autor,
    fecha,
    esUltimo,
  };
}

/**
 * Registra una branch del repositorio.
 */
export function registrarBranch(
  nombre: string,
  esRamaPrincipal: boolean = false,
): Branch {
  return {
    nombre,
    esRamaPrincipal,
  };
}

/**
 * Registra un contribuyente del proyecto.
 */
export function registrarContributor(
  nombre: string,
  usuarioGitHub: string,
  avatarUrl?: string,
): Contributor {
  return {
    nombre,
    usuarioGitHub,
    avatarUrl,
  };
}

/**
 * Valida la licencia LICENSE.md. Si no se ha leído el contenido,
 * marca como no compatible por precaución.
 */
export function validarLicencia(
  contenidoLeido: boolean = false,
  tipo?: string,
): LicenciaInfo {
  return {
    archivo: 'LICENSE.md',
    contenidoLeido,
    tipo,
    compatibleConALRAC: contenidoLeido === true && tipo !== undefined,
  };
}

/**
 * Determina si el código está abandonado (último commit hace más de 2 años).
 */
export function esCodigoAbandonado(fechaUltimoCommit: number): boolean {
  const ahora = Date.now();
  const añosTranscurridos = (ahora - fechaUltimoCommit) / MILESEGUNDOS_POR_AÑO;
  return añosTranscurridos > AÑOS_ABANDONO;
}

/**
 * Genera la respuesta del sistema ALRAC/Zeitnus ante el repositorio.
 * Siempre afirma precaución: no copiar código, reimplementar lógica pura,
 * verificar licencia, revisar seguridad de código abandonado.
 */
export function respuestaALRAC(): RespuestaALRAC {
  return {
    usarCodigoFuente: false,
    reimplementarLogicaPura: true,
    verificarLicenciaAntesDeUsar: true,
    revisarSeguridadCodigoAbandonado: true,
    mapearCapasAAlRAC: true,
  };
}

/**
 * Construye el estado completo de la aplicación web a partir de metadatos.
 */
export function construirEstadoAppWeb(
  capas: CapaApp[],
  commits: Commit[],
  branches: Branch[],
  contributors: Contributor[],
  licencia: LicenciaInfo,
  fechaUltimoCommit: number,
): EstadoAppWeb {
  return {
    capas,
    commits,
    branches,
    contributors,
    licencia,
    esCodigoAbandonado: esCodigoAbandonado(fechaUltimoCommit),
    fechaUltimoCommit,
  };
}
