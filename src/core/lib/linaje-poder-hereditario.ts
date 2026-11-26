// src/core/lib/linaje-poder-hereditario.ts
// Linaje y Poder Hereditario — ALRAC/Zeitnus.
// Rechaza la transmisión de poder por linaje sanguíneo (Cuello de Botella
// del Cromosoma Y, Tumba de Varna). El poder no se hereda; se ejerce por
// contribución y aprobación colectiva.
// NO permite poder hereditario.

export interface Linaje {
  id: string;
  personaId: string;
  ancestroPoderoso: string;
  tipoPoder: 'monarquia' | 'patriarcado' | 'clase_elite' | 'otro';
  transmitidoPorSangre: boolean;
  fecha: number;
}

export interface PoderHereditario {
  id: string;
  linajeId: string;
  rechazo: boolean;              // siempre true
  motivo: string;                // "invento cultural, no biológico"
  fecha: number;
}

let linajeCounter = 0;
let poderCounter = 0;

function nextLinajeId(): string {
  linajeCounter += 1;
  return `linaje-${Date.now()}-${linajeCounter}`;
}

function nextPoderId(): string {
  poderCounter += 1;
  return `poder-hered-${Date.now()}-${poderCounter}`;
}

/**
 * Registra un linaje. Si se transmite por sangre, se marca para rechazo.
 */
export function registrarLinaje(
  datos: Omit<Linaje, 'id' | 'fecha'>,
): Linaje {
  return {
    ...datos,
    id: nextLinajeId(),
    fecha: Date.now(),
  };
}

/**
 * Rechaza el poder hereditario. Siempre rechaza (rechazo = true).
 * El poder no se transmite por linaje; es un invento cultural, no biológico.
 */
export function rechazarTransmisionSangre(
  linajeId: string,
  motivo: string = 'invento cultural, no biológico',
): PoderHereditario {
  return {
    id: nextPoderId(),
    linajeId,
    rechazo: true,
    motivo,
    fecha: Date.now(),
  };
}

/**
 * Verifica si un linaje transmite poder por sangre.
 */
export function transmitePorSangre(linaje: Linaje): boolean {
  return linaje.transmitidoPorSangre === true;
}

/**
 * Verifica si el poder hereditario está rechazado.
 */
export function esPoderHereditarioRechazado(poder: PoderHereditario): boolean {
  return poder.rechazo === true;
}
