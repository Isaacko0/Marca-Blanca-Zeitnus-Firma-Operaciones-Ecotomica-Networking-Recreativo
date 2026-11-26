// src/core/lib/ocalan-confederalismo-democratico.ts
// Öcalan — Confederalismo Democrático — ALRAC/Zeitnus.
// Documento teórico/político. No copia código fuente.
// Módulo de dominio puro en TypeScript.

export interface OcalanConcepto {
  id: string;
  nombre: string;
  categoria: 'jerarquia_inversa' | 'neolitico_excedente' | 'poder_hereditario' | 'arqueologia_desigualdad';
  descripcion: string;
  periodoHistorico?: string;
  evidencia?: string; // ej. Karmin et al. 2015, Cultura de Varna
}

export interface OcalanAnalisis {
  id: string;
  conceptoId: string;
  tesis: string; // "La jerarquía no es estado natural del Homo sapiens"
  implicacionZeitnus: string; // ej. "Gobernanza sin poder hereditario, ZNU sin jerarquía vertical"
  fecha: number;
}

let ocalanCounter = 0;
function nextOcalanId(): string {
  ocalanCounter += 1;
  return `ocalan-${Date.now()}-${ocalanCounter}`;
}

export function crearConceptoOcalan(
  nombre: string,
  categoria: OcalanConcepto['categoria'],
  descripcion: string,
  periodoHistorico?: string,
  evidencia?: string,
): OcalanConcepto {
  return {
    id: nextOcalanId(),
    nombre,
    categoria,
    descripcion,
    periodoHistorico,
    evidencia,
  };
}

export function crearAnalisisOcalan(
  conceptoId: string,
  tesis: string,
  implicacionZeitnus: string,
): OcalanAnalisis {
  return {
    id: nextOcalanId(),
    conceptoId,
    tesis,
    implicacionZeitnus,
    fecha: Date.now(),
  };
}

/**
 * Síntesis teórica: la jerarquía rígida y el poder hereditario no son estado natural
 * del Homo sapiens, sino invención cultural reciente (Neolítico, excedente, almacenamiento).
 */
export function tesisCentralOcalan(): string {
  return 'La jerarquía rígida y el poder hereditario no son el estado natural del Homo sapiens, sino una invención cultural reciente ligada a la Revolución Neolítica, el excedente y el almacenamiento.';
}

/**
 * Evidencia genética: cuello de botella del cromosoma Y (5.000-7.000 años atrás).
 */
export function evidenciaCromosomaY(): string {
  return 'Desplome drástico de la diversidad genética del cromosoma Y hace 5.000-7.000 años, por monopolio de reproducción y riqueza de un pequeño grupo de hombres poderosos.';
}

/**
 * Evidencia arqueológica: Tumba 43, Cultura de Varna (~4500 a.C.).
 */
export function evidenciaVarna(): string {
  return 'Tumba 43 en la necrópolis de Varna (Bulgaria, ~4500 a.C.) contiene más oro que el resto de la necrópolis combinada.';
}
