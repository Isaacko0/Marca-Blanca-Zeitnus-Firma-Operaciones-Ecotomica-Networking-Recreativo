// src/core/lib/bookchin-seis-tesis-municipalismo-libertario.ts
// Murray Bookchin — Seis tesis sobre municipalismo libertario — ALRAC/Zeitnus.
// Documento teórico/político. No copia código fuente.
// Módulo de dominio puro en TypeScript.

export type TesisNumero = 1 | 2 | 3 | 4 | 5 | 6;

export interface BookchinTesis {
  id: string;
  numero: TesisNumero;
  titulo: string;
  descripcion: string;
  implicacionZeitnus: string;
}

export interface BookchinAnalisis {
  id: string;
  tesisId: string;
  aplicacionNodo: string; // ej. "Asamblea del nodo, gobernanza holónica 1a1v"
  fecha: number;
}

let bookchinCounter = 0;
function nextBookchinId(): string {
  bookchinCounter += 1;
  return `bookchin-${Date.now()}-${bookchinCounter}`;
}

const TESIS_BASE: BookchinTesis[] = [
  {
    id: 'bookchin-tesis-1',
    numero: 1,
    titulo: 'Municipalismo libertario',
    descripcion: 'Democracia directa a nivel municipal como base de la organización social, frente al centralismo estatal.',
    implicacionZeitnus: 'Gobernanza local holónica, asambleas del nodo como unidad de decisión.',
  },
  {
    id: 'bookchin-tesis-2',
    numero: 2,
    titulo: 'Confederalismo municipal',
    descripcion: 'Coordinación horizontal entre municipios sin jerarquía vertical, mediante consejos y asambleas confederadas.',
    implicacionZeitnus: 'Red de Intercambio Federada: nodos confederados sin autoridad central.',
  },
  {
    id: 'bookchin-tesis-3',
    numero: 3,
    titulo: 'Ecología social',
    descripcion: 'La crisis ecológica es consecuencia de la jerarquía social; superar la dominación de la naturaleza requiere superar la dominación humana sobre humana.',
    implicacionZeitnus: 'Ley I: no degradar la base material; límites duros en boundaries.ts.',
  },
  {
    id: 'bookchin-tesis-4',
    numero: 4,
    titulo: 'Asamblea popular',
    descripcion: 'Espacio de decisión directa donde los ciudadanos ejercen poder legislativo y ejecutivo sin intermediarios profesionales.',
    implicacionZeitnus: 'Asamblea del nodo (Capa 5): define umbrales, canasta de cuidado, reinversión.',
  },
  {
    id: 'bookchin-tesis-5',
    numero: 5,
    titulo: 'Ética complementaria',
    descripcion: 'Valores de solidaridad, ayuda mutua y responsabilidad colectiva como base del municipio libre.',
    implicacionZeitnus: 'CaaS: acceso por contribución, membresía por nivel de contribución real.',
  },
  {
    id: 'bookchin-tesis-6',
    numero: 6,
    titulo: 'Dual poder',
    descripcion: 'Construcción de instituciones municipales paralelas al estado para desplazarlos gradualmente mediante la práctica.',
    implicacionZeitnus: 'CaaS como estructura paralela al estado-nación, soberanía del nodo.',
  },
];

export function listarTesisBookchin(): BookchinTesis[] {
  return [...TESIS_BASE];
}

export function obtenerTesisPorNumero(numero: TesisNumero): BookchinTesis | undefined {
  return TESIS_BASE.find((t) => t.numero === numero);
}

export function crearAnalisisBookchin(
  tesisId: string,
  aplicacionNodo: string,
): BookchinAnalisis {
  const tesis = TESIS_BASE.find((t) => t.id === tesisId);
  if (!tesis) {
    throw new Error('bookchin: tesis no encontrada');
  }
  return {
    id: nextBookchinId(),
    tesisId,
    aplicacionNodo,
    fecha: Date.now(),
  };
}

/**
 * Síntesis: municipalismo libertario como escala humana adecuada para democracia directa
 * y organización ecológica.
 */
export function tesisCentralBookchin(): string {
  return 'El municipalismo libertario es la escala humana adecuada para la democracia directa y la organización ecológica, mediante confederalismo municipal y asambleas populares.';
}
