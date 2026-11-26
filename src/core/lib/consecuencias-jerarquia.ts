// src/core/lib/consecuencias-jerarquia.ts
// Consecuencias de la Jerarquía — ALRAC/Zeitnus.
// Métricas de impacto de la transición de bandas igualitarias a estados
// jerárquicos: salud, desvinculación mérito-recompensa, psicología social.
// NO normaliza la desigualdad como consecuencia inevitable.

export interface ImpactoSalud {
  id: string;
  grupo: 'elite' | 'sudaditos' | 'cazadores_recolectores';
  estaturaPromedio: number;
  desnutricion: boolean;
  enfermedadesInfecciosas: number;
  fecha: number;
}

export interface DesvinculacionMeritoRecompensa {
  id: string;
  caso: string;
  recompensaSinAporte: boolean;
  aporteSinRecompensa: boolean;
  corregido: boolean;
  fecha: number;
}

export interface PsicologiaSocial {
  id: string;
  sumisionAutoridadArbitraria: boolean;
  desigualdadJustificadaComoNatural: boolean;
  rechazoActivo: boolean;        // true si el grupo rechaza activamente el modelo jerárquico
  fecha: number;
}

let saludCounter = 0;
let desconexionCounter = 0;
let psicologiaCounter = 0;

function nextSaludId(): string {
  saludCounter += 1;
  return `salud-${Date.now()}-${saludCounter}`;
}

function nextDesconexionId(): string {
  desconexionCounter += 1;
  return `desconexion-merito-${Date.now()}-${desconexionCounter}`;
}

function nextPsicologiaId(): string {
  psicologiaCounter += 1;
  return `psicologia-${Date.now()}-${psicologiaCounter}`;
}

/**
 * Registra un impacto de salud por grupo social.
 */
export function registrarImpactoSalud(
  datos: Omit<ImpactoSalud, 'id' | 'fecha'>,
): ImpactoSalud {
  if (datos.estaturaPromedio < 0 || datos.enfermedadesInfecciosas < 0) {
    throw new Error('consecuencias-jerarquia: valores no pueden ser negativos');
  }
  return {
    ...datos,
    id: nextSaludId(),
    fecha: Date.now(),
  };
}

/**
 * Registra una desvinculación mérito-recompensa.
 */
export function registrarDesvinculacionMerito(
  datos: Omit<DesvinculacionMeritoRecompensa, 'id' | 'fecha'>,
): DesvinculacionMeritoRecompensa {
  return {
    ...datos,
    id: nextDesconexionId(),
    fecha: Date.now(),
  };
}

/**
 * Corrige una desvinculación mérito-recompensa.
 */
export function corregirDesvinculacion(
  d: DesvinculacionMeritoRecompensa,
): DesvinculacionMeritoRecompensa {
  return { ...d, corregido: true };
}

/**
 * Registra una evaluación de psicología social.
 */
export function registrarPsicologiaSocial(
  datos: Omit<PsicologiaSocial, 'id' | 'fecha'>,
): PsicologiaSocial {
  return {
    ...datos,
    id: nextPsicologiaId(),
    fecha: Date.now(),
  };
}

/**
 * Verifica si hay rechazo activo del modelo jerárquico.
 */
export function hayRechazoActivo(p: PsicologiaSocial): boolean {
  return p.rechazoActivo === true;
}

/**
 * Verifica si hay desvinculación mérito-recompensa sin corregir.
 */
export function hayDesvinculacionSinCorregir(d: DesvinculacionMeritoRecompensa): boolean {
  return d.corregido === false;
}
