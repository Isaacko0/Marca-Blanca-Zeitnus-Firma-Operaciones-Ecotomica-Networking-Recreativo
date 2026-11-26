// src/core/lib/narrativa-poder.ts
// Narrativa de Poder (Mandato Divino) — ALRAC/Zeitnus.
// Rechazo de justificaciones ideológicas del poder sin aporte
// (Faraón como dios viviente, Derecho Divino de los Reyes).
// NO permite narrativas que naturalicen la desigualdad.

export interface NarrativaIdeologica {
  id: string;
  nombre: string;
  tipo: 'divino' | 'sangre' | 'tradicion' | 'otro';
  justificaPoderSinAporte: boolean;
  rechazada: boolean;            // true si justificaPoderSinAporte === true
  fecha: number;
}

let narrativaCounter = 0;

function nextNarrativaId(): string {
  narrativaCounter += 1;
  return `narrativa-${Date.now()}-${narrativaCounter}`;
}

/**
 * Registra una narrativa ideológica. Si justifica poder sin aporte,
 * se rechaza.
 */
export function registrarNarrativa(
  datos: Omit<NarrativaIdeologica, 'id' | 'rechazada' | 'fecha'>,
): NarrativaIdeologica {
  return {
    ...datos,
    id: nextNarrativaId(),
    rechazada: datos.justificaPoderSinAporte === true,
    fecha: Date.now(),
  };
}

/**
 * Verifica si una narrativa justifica poder sin aporte.
 */
export function justificaPoderSinAporte(n: NarrativaIdeologica): boolean {
  return n.justificaPoderSinAporte === true;
}

/**
 * Verifica si una narrativa está rechazada.
 */
export function esNarrativaRechazada(n: NarrativaIdeologica): boolean {
  return n.rechazada === true;
}
