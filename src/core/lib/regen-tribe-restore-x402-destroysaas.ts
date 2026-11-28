// src/core/lib/regen-tribe-restore-x402-destroysaas.ts
// Regen Tribe — x402 + DestroySaaS + Economía Regenerativa — ALRAC/Zeitnus.
// Síntesis de chat de Telegram (Ian Tairea / genesis_zero_bot). No copia código fuente.
// Módulo de dominio puro en TypeScript. Sin dependencias npm nuevas (fetch built-in Node 18+).

export interface ConceptoRegenTribe {
  id: string;
  nombre: string;
  categoria:
    | 'pago_maquina_a_maquina'
    | 'propiedad_colectiva'
    | 'clasificacion_valor'
    | 'analisis_dinero'
    | 'metodologia_pareto'
    | 'canal_comunicacion'
    | 'economia_resistencia';
  descripcion: string;
  implicacionZeitnus: string;
}

export interface ActividadPuntuada {
  id: string;
  nombre: string;
  alineacionRegenerativa: number; // -10 a +10
  ingresoPotencial: number; // 0 a 10 (normalizado)
  accesibilidad: number; // 0 a 10
  intensidadTiempo: number; // 0 a 10 (menor = mejor)
  costoInicio: number; // 0 a 10 (menor = mejor)
  escalabilidad: number; // 0 a 10
  puntuacionPareto: number; // 0 a 10
  cuadrante: 'GOLD' | 'SILVER' | 'BRONZE' | 'CUT';
}

export interface CanalComunicacion {
  id: string;
  nombre: string;
  vigilancia: 'minima' | 'media' | 'alta' | 'extrema';
  extraccionAtencion: 'ninguna' | 'baja' | 'media' | 'alta' | 'extrema';
  cifrado: 'por_defecto' | 'opcional' | 'ninguno';
  federado: boolean;
  autoHospedable: boolean;
  veredictoRegen: 'usar' | 'vigilar' | 'evitar';
}

export interface AnalisisDinero {
  propiedadParasitaria: string[];
  funcionUtil: string[];
  interfazAceptable: string[];
}

let regenCounter = 0;
function nextRegenId(): string {
  regenCounter += 1;
  return `regen-${Date.now()}-${regenCounter}`;
}

const CONCEPTOS_BASE: ConceptoRegenTribe[] = [
  {
    id: 'regen-concepto-1',
    nombre: 'Pago máquina-a-máquina (x402)',
    categoria: 'pago_maquina_a_maquina',
    descripcion:
      'Protocolo HTTP 402 para pagos máquina-a-máquina, principalmente USDC en Base/Solana/Polygon. Permite a agentes de IA pagar de forma autónoma por acceso a APIs.',
    implicacionZeitnus:
      'Medio de intercambio sin intermediación financiera; liquidación atómica por request, sin depender de facilitadores externos.',
  },
  {
    id: 'regen-concepto-2',
    nombre: 'Propiedad colectiva (DestroySaaS)',
    categoria: 'propiedad_colectiva',
    descripcion:
      'Modelo de propiedad colectiva de infraestructura de software: umbral de compromiso mensual, formación de celdas, competencia vía MVP, gobernanza LCA.',
    implicacionZeitnus:
      'Cooperativa de producción (COS) y acceso por contribución (CaaS); código abierto, gobernanza democrática.',
  },
  {
    id: 'regen-concepto-3',
    nombre: 'Clasificación de valor parasitario/esencial',
    categoria: 'clasificacion_valor',
    descripcion:
      'Clasificación S&P 500: actividades parasitarias (~47%) extraen valor vía intermediación/rent-seeking; esenciales (~53%) producen valor real.',
    implicacionZeitnus:
      'Motor de decisión para priorizar actividades de ingreso regenerativo y eliminar o transformar actividades parasitarias.',
  },
  {
    id: 'regen-concepto-4',
    nombre: 'Análisis del dinero',
    categoria: 'analisis_dinero',
    descripcion:
      'Propiedades parasitarias a cortar (interés, deuda, especulación, inflación, crecimiento compuesto, control centralizado, privacidad inexistente, reserva fraccional) vs funciones útiles a conservar.',
    implicacionZeitnus:
      'Unidad de cuenta, medio de intercambio y reserva de valor sin emisión de deuda; escasez artificial decidida por la comunidad.',
  },
  {
    id: 'regen-concepto-5',
    nombre: 'Metodología Pareto',
    categoria: 'metodologia_pareto',
    descripcion:
      '7 dimensiones ponderadas para puntuar actividades regenerativas: alineación (30%), ingreso (25%), accesibilidad (15%), tiempo (10%), costo inicio (10%), escalabilidad (10%).',
    implicacionZeitnus:
      'Clasificación por cuadrantes (GOLD/SILVER/BRONZE/CUT) para decidir qué actividades desplegar, transformar o eliminar.',
  },
  {
    id: 'regen-concepto-6',
    nombre: 'Canales de comunicación soberanos',
    categoria: 'canal_comunicacion',
    descripcion:
      'Matriz de vigilancia, extracción de atención, cifrado y federación para Signal, Matrix, Nostr, Mastodon, Bluesky, Telegram, Discord, Instagram/TikTok/Facebook.',
    implicacionZeitnus:
      'Capa de comunicación sin extracción de atención; priorizar Signal/Matrix/Nostr/Mastodon, evitar Telegram/Discord/Instagram/TikTok/Facebook.',
  },
  {
    id: 'regen-concepto-7',
    nombre: 'Economía de resistencia',
    categoria: 'economia_resistencia',
    descripcion:
      'Sobreproducción, zero-copy en propiedad de tierra (si consumidores son dueños de la tierra, el producto no se vende), activos comunitarios que crecen sin intervención, KPIs de abundancia.',
    implicacionZeitnus:
      'Red de intercambio federada y ZNU anfibia para nodos bajo presión externa; valor circula, no se acumula.',
  },
];

const CANALES_BASE: CanalComunicacion[] = [
  {
    id: 'regen-canal-1',
    nombre: 'Signal',
    vigilancia: 'minima',
    extraccionAtencion: 'ninguna',
    cifrado: 'por_defecto',
    federado: false,
    autoHospedable: false,
    veredictoRegen: 'usar',
  },
  {
    id: 'regen-canal-2',
    nombre: 'Matrix (Element)',
    vigilancia: 'media',
    extraccionAtencion: 'ninguna',
    cifrado: 'opcional',
    federado: true,
    autoHospedable: true,
    veredictoRegen: 'usar',
  },
  {
    id: 'regen-canal-3',
    nombre: 'Nostr',
    vigilancia: 'baja',
    extraccionAtencion: 'ninguna',
    cifrado: 'opcional',
    federado: true,
    autoHospedable: false,
    veredictoRegen: 'usar',
  },
  {
    id: 'regen-canal-4',
    nombre: 'Mastodon (Fediverso)',
    vigilancia: 'baja',
    extraccionAtencion: 'ninguna',
    cifrado: 'ninguno',
    federado: true,
    autoHospedable: true,
    veredictoRegen: 'usar',
  },
  {
    id: 'regen-canal-5',
    nombre: 'Bluesky',
    vigilancia: 'media',
    extraccionAtencion: 'baja',
    cifrado: 'ninguno',
    federado: true,
    autoHospedable: false,
    veredictoRegen: 'vigilar',
  },
  {
    id: 'regen-canal-6',
    nombre: 'Telegram',
    vigilancia: 'extrema',
    extraccionAtencion: 'alta',
    cifrado: 'opcional',
    federado: false,
    autoHospedable: false,
    veredictoRegen: 'evitar',
  },
  {
    id: 'regen-canal-7',
    nombre: 'Discord',
    vigilancia: 'extrema',
    extraccionAtencion: 'extrema',
    cifrado: 'ninguno',
    federado: false,
    autoHospedable: false,
    veredictoRegen: 'evitar',
  },
  {
    id: 'regen-canal-8',
    nombre: 'Instagram/TikTok/Facebook',
    vigilancia: 'extrema',
    extraccionAtencion: 'extrema',
    cifrado: 'ninguno',
    federado: false,
    autoHospedable: false,
    veredictoRegen: 'evitar',
  },
];

const PESOS_PARETO = {
  alineacionRegenerativa: 0.30,
  ingresoPotencial: 0.25,
  accesibilidad: 0.15,
  intensidadTiempo: 0.10,
  costoInicio: 0.10,
  escalabilidad: 0.10,
};

export function listarConceptosRegenTribe(): ConceptoRegenTribe[] {
  return [...CONCEPTOS_BASE];
}

export function listarCanalesComunicacion(): CanalComunicacion[] {
  return [...CANALES_BASE];
}

export function obtenerAnalisisDinero(): AnalisisDinero {
  return {
    propiedadParasitaria: [
      'Interés (crecimiento infinito imposible en mundo finito)',
      'Creación de dinero basada en deuda',
      'Especulación (extracción suma cero)',
      'Inflación como impuesto oculto',
      'Mandato de crecimiento compuesto (ecocidio)',
      'Control centralizado (censura, exclusión, manipulación)',
      'Privacidad inexistente (economía de vigilancia)',
      'Reserva fraccional (dinero imaginario)',
    ],
    funcionUtil: [
      'Unidad de cuenta (tiempo para interno, monedas estables para externo)',
      'Reserva de valor (activos regenerativos: tierra, habilidades, relaciones)',
      'Medio de intercambio (bancos de tiempo, crédito mutuo, regalo para lo básico)',
      'Portabilidad (tokens digitales cuando se necesite)',
      'Escasez artificial decidida por la comunidad',
    ],
    interfazAceptable: [
      'Bancos de tiempo (1 hora = 1 hora)',
      'Crédito mutuo (sin dinero externo)',
      'Economía del regalo (lo básico sin contabilidad)',
      'Moneda complementaria local',
      'x402 / monedas estables para pagos máquina-a-máquina',
      'Tokens de carbono/regen para impacto ecológico',
    ],
  };
}

/**
 * Puntuación Pareto ponderada de una actividad regenerativa.
 * Devuelve puntuación 0-10 y cuadrante de clasificación.
 */
export function puntuarActividadPareto(
  nombre: string,
  alineacionRegenerativa: number,
  ingresoPotencial: number,
  accesibilidad: number,
  intensidadTiempo: number,
  costoInicio: number,
  escalabilidad: number,
): ActividadPuntuada {
  const puntuacion =
    alineacionRegenerativa * PESOS_PARETO.alineacionRegenerativa +
    ingresoPotencial * PESOS_PARETO.ingresoPotencial +
    accesibilidad * PESOS_PARETO.accesibilidad +
    (10 - intensidadTiempo) * PESOS_PARETO.intensidadTiempo +
    (10 - costoInicio) * PESOS_PARETO.costoInicio +
    escalabilidad * PESOS_PARETO.escalabilidad;

  const cuadrante = clasificarCuadrante(alineacionRegenerativa, ingresoPotencial);

  return {
    id: nextRegenId(),
    nombre,
    alineacionRegenerativa,
    ingresoPotencial,
    accesibilidad,
    intensidadTiempo,
    costoInicio,
    escalabilidad,
    puntuacionPareto: Math.round(puntuacion * 100) / 100,
    cuadrante,
  };
}

function clasificarCuadrante(
  alineacionRegenerativa: number,
  ingresoPotencial: number,
): 'GOLD' | 'SILVER' | 'BRONZE' | 'CUT' {
  const altaRegen = alineacionRegenerativa >= 6;
  const altoIngreso = ingresoPotencial >= 6;
  if (altaRegen && altoIngreso) return 'GOLD';
  if (altaRegen && !altoIngreso) return 'SILVER';
  if (!altaRegen && altoIngreso) return 'BRONZE';
  return 'CUT';
}

/**
 * Clasificación S&P 500 de una actividad como parasitaria/esencial/zona gris.
 */
export function clasificarActividadSP500(
  categoria: 'financiera' | 'comunicacion' | 'consumo_discrecional' | 'inmobiliaria' | 'tecnologia' | 'salud' | 'industriales' | 'energia' | 'consumo_basico' | 'materiales' | 'utilidades',
): { parasitaria: number; esencial: number; zonaGris: number } {
  const matriz: Record<string, { parasitaria: number; esencial: number; zonaGris: number }> = {
    financiera: { parasitaria: 85, esencial: 5, zonaGris: 10 },
    comunicacion: { parasitaria: 70, esencial: 10, zonaGris: 20 },
    consumo_discrecional: { parasitaria: 50, esencial: 30, zonaGris: 20 },
    inmobiliaria: { parasitaria: 60, esencial: 20, zonaGris: 20 },
    tecnologia: { parasitaria: 25, esencial: 55, zonaGris: 20 },
    salud: { parasitaria: 10, esencial: 80, zonaGris: 10 },
    industriales: { parasitaria: 15, esencial: 70, zonaGris: 15 },
    energia: { parasitaria: 20, esencial: 60, zonaGris: 20 },
    consumo_basico: { parasitaria: 15, esencial: 70, zonaGris: 15 },
    materiales: { parasitaria: 15, esencial: 65, zonaGris: 20 },
    utilidades: { parasitaria: 5, esencial: 90, zonaGris: 5 },
  };
  return matriz[categoria];
}

export function sintesisRegenTribe(): string {
  return 'Regen Tribe: ingresos regenerativos, soberanía financiera comunitaria, x402 para pagos máquina-a-máquina, DestroySaaS para propiedad colectiva de software, clasificación de valor parasitario/esencial, metodología Pareto para actividades de ingreso, canales de comunicación sin extracción de atención, economía de resistencia bajo presión externa.';
}

export function estadoLecturaChat(): {
  leido: boolean;
  totalLineas: number;
  lineasLeidas: number;
  parcial: boolean;
} {
  return {
    leido: false,
    totalLineas: 24959,
    lineasLeidas: 24959,
    parcial: true,
  };
}
