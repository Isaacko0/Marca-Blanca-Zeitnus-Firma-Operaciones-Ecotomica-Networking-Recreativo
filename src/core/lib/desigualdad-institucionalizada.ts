// src/core/lib/desigualdad-institucionalizada.ts
// Desigualdad Institucionalizada y Hereditaria — ALRAC/Zeitnus.
// Detecta acumulación por estatus, no por mérito (Tumba de Varna, ~4500 a.C.).
// Cualquier caso de desigualdad hereditaria se marca como rechazada.
// NO permite desigualdad institucionalizada.

export interface DesigualdadHereditaria {
  id: string;
  caso: string;
  periodo: string;               // ej. "4500 a.C."
  evidencias: string[];          // hallazgos arqueológicos/genéticos
  tipoDesigualdad: 'institucionalizada' | 'hereditaria' | 'ambas';
  rechazada: boolean;            // siempre true
  fecha: number;
}

let desigualdadCounter = 0;

function nextDesigualdadId(): string {
  desigualdadCounter += 1;
  return `desigualdad-${Date.now()}-${desigualdadCounter}`;
}

/**
 * Registra un caso de desigualdad institucionalizada/hereditaria.
 * Siempre se marca como rechazada.
 */
export function detectarAcumulacionEstatus(
  datos: Omit<DesigualdadHereditaria, 'id' | 'rechazada' | 'fecha'>,
): DesigualdadHereditaria {
  return {
    ...datos,
    id: nextDesigualdadId(),
    rechazada: true,
    fecha: Date.now(),
  };
}

/**
 * Verifica si una desigualdad está rechazada.
 */
export function esDesigualdadRechazada(d: DesigualdadHereditaria): boolean {
  return d.rechazada === true;
}

/**
 * Verifica si el tipo de desigualdad es hereditaria.
 */
export function esDesigualdadHereditaria(tipo: DesigualdadHereditaria['tipoDesigualdad']): boolean {
  return tipo === 'hereditaria' || tipo === 'ambas';
}
