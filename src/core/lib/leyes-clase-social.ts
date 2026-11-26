// src/core/lib/leyes-clase-social.ts
// Leyes de Clase Social — ALRAC/Zeitnus.
// Rechazo de leyes que protegen a una clase elite (Código de Hammurabi:
// penas según clase social del ofendido y el ofensor).
// NO permite leyes que institucionalicen desigualdad por clase.

export interface LeyClase {
  id: string;
  nombre: string;
  protegeA: 'elite' | 'clase_media' | 'clase_baja' | 'todas';
  penalizaA: 'elite' | 'clase_media' | 'clase_baja' | 'todas';
  esIgualitaria: boolean;        // true solo si protegeA === todas && penalizaA === todas
  rechazada: boolean;            // true si !esIgualitaria
  fecha: number;
}

let leyCounter = 0;

function nextLeyId(): string {
  leyCounter += 1;
  return `ley-${Date.now()}-${leyCounter}`;
}

/**
 * Registra una ley. Es igualitaria solo si protege y penaliza a "todas" las clases.
 * Cualquier ley que no sea igualitaria se rechaza.
 */
export function registrarLeyClase(
  datos: Omit<LeyClase, 'id' | 'esIgualitaria' | 'rechazada' | 'fecha'>,
): LeyClase {
  const esIgualitaria =
    datos.protegeA === 'todas' && datos.penalizaA === 'todas';
  return {
    ...datos,
    id: nextLeyId(),
    esIgualitaria,
    rechazada: !esIgualitaria,
    fecha: Date.now(),
  };
}

/**
 * Verifica si una ley es igualitaria.
 */
export function esLeyIgualitaria(l: LeyClase): boolean {
  return l.esIgualitaria === true;
}

/**
 * Verifica si una ley está rechazada (no igualitaria).
 */
export function esLeyRechazada(l: LeyClase): boolean {
  return l.rechazada === true;
}
