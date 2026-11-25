// src/core/lib/znu-espirulina-anchor.ts
// Ancla ZNU en Espirulina — ALRAC/Zeitnus.
// Redefine el ancla del ZNU (Capa 3) a capacidad verificada de espirulina (g PSE).
// NO es redimible en biomasa física. TQ se mantiene en 1 kWh.
// Factor de canata solo como puente en modo conectado.
// Espirulina = nutrición proteica/biotecnológica, no dieta total.
// Borrador v0.1: parámetros provisionales, no implementar como definitivos.

export type MetodoFiltracion = 'malla_50um' | 'malla_100um' | 'centrifugacion' | 'otro';
export type MetodoSecado = 'baja_temperatura' | 'lyophilizado' | 'aire_libre' | 'otro';
export type ControlCalidad = 'ficocianina' | 'clorofila' | 'ambos' | 'ninguno';

export interface ProtocoloPSE {
  metodoFiltracion: MetodoFiltracion;
  porcentajeMateriaSeca: number;   // 0-100
  metodoSecado: MetodoSecado;
  controlCalidad: ControlCalidad;
  aprobadoPorAsamblea: boolean;
  version: string;
}

export interface Terrario {
  id: string;
  nodoId: string;
  diasMaduracion: number;      // 30-45
  cultivoContinuo: boolean;    // verificado
  metalesPesados: boolean;     // control pasado
  cianotoxinas: boolean;       // control pasado
  contaminacionCianobacterias: boolean; // control pasado
  derechoDeUso: boolean;       // true si cumple
  fechaRegistro: number;
}

export interface LoteEspirulina {
  id: string;
  terrarioId: string;
  gPSE: number;                // gramos de peso seco equivalente
  fechaCosecha: number;
  resultadoCalidad: string;
  loteOrigen: string;
}

export interface AnclaZNU {
  id: string;
  unidad: 'g_PSE';
  protocoloPSE: ProtocoloPSE;
  terrarios: string[];         // IDs de terrarios válidos
  lotes: string[];             // IDs de lotes
  expiracionDias: number;      // 90
  noRedimibleEnBiomasa: boolean; // siempre true
  factorCanataModoConectado: boolean; // true
  fechaCreacion: number;
}

let anclaIdCounter = 0;
let terrarioIdCounter = 0;
let loteIdCounter = 0;

function nextAnclaId(): string {
  anclaIdCounter += 1;
  return `znu-ancla-${Date.now()}-${anclaIdCounter}`;
}

function nextTerrarioId(): string {
  terrarioIdCounter += 1;
  return `terrario-${Date.now()}-${terrarioIdCounter}`;
}

function nextLoteId(): string {
  loteIdCounter += 1;
  return `lote-${Date.now()}-${loteIdCounter}`;
}

/**
 * Crea una ancla ZNU basada en capacidad verificada de espirulina (g PSE).
 * El ZNU no es redimible en biomasa física.
 */
export function crearAnclaZNU(
  protocoloPSE: Omit<ProtocoloPSE, 'aprobadoPorAsamblea'>,
  expiracionDias: number = 90,
): AnclaZNU {
  if (expiracionDias <= 0) {
    throw new Error('znu-espirulina-anchor: expiracionDias debe ser > 0');
  }
  return {
    id: nextAnclaId(),
    unidad: 'g_PSE',
    protocoloPSE: { ...protocoloPSE, aprobadoPorAsamblea: false },
    terrarios: [],
    lotes: [],
    expiracionDias,
    noRedimibleEnBiomasa: true,
    factorCanataModoConectado: true,
    fechaCreacion: Date.now(),
  };
}

/**
 * Registra un terrario como válido para el ancla ZNU.
 * Requiere maduración 30-45 días y control de calidad aprobado.
 */
export function registrarTerrario(
  ancla: AnclaZNU,
  nodoId: string,
  diasMaduracion: number,
  cultivoContinuo: boolean,
  metalesPesados: boolean,
  cianotoxinas: boolean,
  contaminacionCianobacterias: boolean,
): Terrario {
  if (diasMaduracion < 30 || diasMaduracion > 45) {
    throw new Error('znu-espirulina-anchor: maduración debe estar entre 30 y 45 días');
  }
  const derechoDeUso =
    cultivoContinuo && metalesPesados && !cianotoxinas && !contaminacionCianobacterias;

  const terrario: Terrario = {
    id: nextTerrarioId(),
    nodoId,
    diasMaduracion,
    cultivoContinuo,
    metalesPesados,
    cianotoxinas,
    contaminacionCianobacterias,
    derechoDeUso,
    fechaRegistro: Date.now(),
  };

  if (derechoDeUso) {
    ancla.terrarios.push(terrario.id);
  }
  return terrario;
}

/**
 * Registra un lote de espirulina con su g PSE y resultado de calidad.
 */
export function registrarLote(
  ancla: AnclaZNU,
  terrarioId: string,
  gPSE: number,
  resultadoCalidad: string,
): LoteEspirulina {
  if (gPSE < 0) {
    throw new Error('znu-espirulina-anchor: gPSE no puede ser negativo');
  }
  if (!ancla.terrarios.includes(terrarioId)) {
    throw new Error('znu-espirulina-anchor: terrario no registrado o no válido');
  }

  const lote: LoteEspirulina = {
    id: nextLoteId(),
    terrarioId,
    gPSE,
    fechaCosecha: Date.now(),
    resultadoCalidad,
    loteOrigen: terrarioId,
  };
  ancla.lotes.push(lote.id);
  return lote;
}

/**
 * Verifica si el ZNU es redimible en biomasa física.
 * Regla del ancla: nunca es redimible.
 */
export function esZNURedimibleEnBiomasa(): boolean {
  return false;
}

/**
 * Verifica si una ancla ZNU está expirada.
 */
export function estaExpirado(ancla: AnclaZNU, fechaActual: number): boolean {
  const diasTranscurridos = (fechaActual - ancla.fechaCreacion) / (1000 * 60 * 60 * 24);
  return diasTranscurridos > ancla.expiracionDias;
}

/**
 * Verifica si el factor de canata opera solo en modo conectado.
 */
export function esFactorCanataSoloModoConectado(ancla: AnclaZNU): boolean {
  return ancla.factorCanataModoConectado === true;
}

/**
 * Verifica si el protocolo PSE está aprobado por la asamblea.
 */
export function protocoloPSEAprobado(ancla: AnclaZNU): boolean {
  return ancla.protocoloPSE.aprobadoPorAsamblea === true;
}

/**
 * Aprueba el protocolo PSE por la asamblea.
 */
export function aprobarProtocoloPSE(ancla: AnclaZNU): AnclaZNU {
  return {
    ...ancla,
    protocoloPSE: { ...ancla.protocoloPSE, aprobadoPorAsamblea: true },
  };
}
