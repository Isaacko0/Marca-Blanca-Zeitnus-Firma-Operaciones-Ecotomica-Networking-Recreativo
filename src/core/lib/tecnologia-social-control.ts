// src/core/lib/tecnologia-social-control.ts
// Tecnología Social de Control de Recursos — ALRAC/Zeitnus.
// El poder monárquico es una tecnología social de control de recursos
// (~5.000-6.000 años), no el estado natural del ser humano.
// NO permite tecnologías de control basadas en excedente, fuerza militar
// o narrativa religiosa que justifiquen acumulación sin aporte.

export interface TecnologiaControlRecursos {
  id: string;
  nombre: string;
  periodo: string;               // ej. "5000-6000 años atrás"
  mecanismo: 'excedente_agricola' | 'almacenamiento' | 'fuerza_militar' | 'narrativa_religiosa' | 'otro';
  controlaRecursos: boolean;
  rechazada: boolean;            // siempre true
  fecha: number;
}

let tecnologiaCounter = 0;

function nextTecnologiaId(): string {
  tecnologiaCounter += 1;
  return `tecnologia-${Date.now()}-${tecnologiaCounter}`;
}

/**
 * Registra una tecnología social de control de recursos.
 * Siempre se marca como rechazada.
 */
export function esTecnologiaControlRecursos(
  datos: Omit<TecnologiaControlRecursos, 'id' | 'rechazada' | 'fecha'>,
): TecnologiaControlRecursos {
  return {
    ...datos,
    id: nextTecnologiaId(),
    rechazada: true,
    fecha: Date.now(),
  };
}

/**
 * Verifica si una tecnología está rechazada.
 */
export function esTecnologiaRechazada(t: TecnologiaControlRecursos): boolean {
  return t.rechazada === true;
}

/**
 * Verifica si el mecanismo de control es por excedente agrícola.
 */
export function esControlPorExcedente(m: TecnologiaControlRecursos['mecanismo']): boolean {
  return m === 'excedente_agricola';
}
