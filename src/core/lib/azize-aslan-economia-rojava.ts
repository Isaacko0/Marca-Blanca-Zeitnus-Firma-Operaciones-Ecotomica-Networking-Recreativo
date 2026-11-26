// src/core/lib/azize-aslan-economia-rojava.ts
// Azize Aslan — Economía anticapitalista en Rojava — ALRAC/Zeitnus.
// Documento teórico/político. Lectura parcial (líneas 1-1163 de 1703). No copia código fuente.
// Módulo de dominio puro en TypeScript.

export interface AzizeConcepto {
  id: string;
  nombre: string;
  categoria: 'cooperativa_comunal' | 'propiedad_social' | 'economia_mujeres' | 'ecologia_social' | 'asamblea_comunal' | 'intercambio_red' | 'economia_resistencia';
  descripcion: string;
  implicacionZeitnus: string;
}

export interface AzizeAnalisis {
  id: string;
  conceptoId: string;
  aplicacionNodo: string;
  fecha: number;
  lecturaParcial: boolean; // true: basado en lectura parcial del PDF
}

let azizeCounter = 0;
function nextAzizeId(): string {
  azizeCounter += 1;
  return `azize-${Date.now()}-${azizeCounter}`;
}

const CONCEPTOS_BASE: AzizeConcepto[] = [
  {
    id: 'azize-concepto-1',
    nombre: 'Economía cooperativa y comunal',
    categoria: 'cooperativa_comunal',
    descripcion: 'Cooperativas, comunas y consejos económicos como unidades productivas básicas.',
    implicacionZeitnus: 'CVNT: valor no transaccional, unidades productivas sin moneda propia.',
  },
  {
    id: 'azize-concepto-2',
    nombre: 'Propiedad social',
    categoria: 'propiedad_social',
    descripcion: 'Medios de producción bajo control de las comunidades, no del estado ni del capital privado.',
    implicacionZeitnus: 'CaaS: acceso por contribución, no propiedad privada de medios de producción.',
  },
  {
    id: 'azize-concepto-3',
    nombre: 'Economía de las mujeres',
    categoria: 'economia_mujeres',
    descripcion: 'Papel central de las mujeres en la reorganización económica; cooperativas femeninas.',
    implicacionZeitnus: 'Inclusión de género en gobernanza holónica 1a1v.',
  },
  {
    id: 'azize-concepto-4',
    nombre: 'Ecología social',
    categoria: 'ecologia_social',
    descripcion: 'Economía vinculada a la ecología social; producción sostenible y justicia ecológica.',
    implicacionZeitnus: 'Ley I: no degradar la base material; producción sostenible.',
  },
  {
    id: 'azize-concepto-5',
    nombre: 'Asambleas comunales',
    categoria: 'asamblea_comunal',
    descripcion: 'Toma de decisiones económicas mediante asambleas comunales y consejos.',
    implicacionZeitnus: 'Asamblea del nodo (Capa 5): define umbrales, canasta de cuidado, reinversión.',
  },
  {
    id: 'azize-concepto-6',
    nombre: 'Redes de intercambio',
    categoria: 'intercambio_red',
    descripcion: 'Redes de intercambio entre comunas sin dependencia del mercado capitalista.',
    implicacionZeitnus: 'Red de Intercambio Federada: nodos con trueque e intercambio sin mercado capitalista.',
  },
  {
    id: 'azize-concepto-7',
    nombre: 'Economía de resistencia',
    categoria: 'economia_resistencia',
    descripcion: 'Economía de guerra y resistencia bajo embargo y conflicto armado.',
    implicacionZeitnus: 'ZNU como moneda anfibia para nodos bajo presión externa.',
  },
];

export function listarConceptosAzize(): AzizeConcepto[] {
  return [...CONCEPTOS_BASE];
}

export function crearAnalisisAzize(
  conceptoId: string,
  aplicacionNodo: string,
): AzizeAnalisis {
  const concepto = CONCEPTOS_BASE.find((c) => c.id === conceptoId);
  if (!concepto) {
    throw new Error('azize: concepto no encontrado');
  }
  return {
    id: nextAzizeId(),
    conceptoId,
    aplicacionNodo,
    fecha: Date.now(),
    lecturaParcial: true,
  };
}

/**
 * Síntesis: economía anticapitalista en Rojava basada en cooperativas, comunas,
 * propiedad social, ecología social y asambleas comunales.
 */
export function sintesisEconomiaRojava(): string {
  return 'Economía anticapitalista en Rojava: cooperativas y comunas como unidades productivas, propiedad social, ecología social, economía de las mujeres, asambleas comunales para decisiones económicas, redes de intercambio sin mercado capitalista, economía de resistencia bajo embargo.';
}

/**
 * Estado de la lectura del documento fuente.
 */
export function estadoLecturaPDF(): { leido: boolean; totalLineas: number; lineasLeidas: number; parcial: boolean } {
  return {
    leido: false,
    totalLineas: 1703,
    lineasLeidas: 1163,
    parcial: true,
  };
}
