// src/core/lib/grid-gi3d.ts
// Tablero de Regeneración Integral Gaia (GRID/GI3D) — ALRAC/Zeitnus.
// Núcleo granular del GI3CF: 10 módulos, 4 estados de información,
// trazabilidad por dato, verificabilidad, temporalidad, contextualización.

export type ModuloGrid = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EstadoInformacion = 'auto_declarado' | 'documentado' | 'verificado' | 'certificacion_oficial';

export interface DatoRegistro {
  id: string;
  moduloId: ModuloGrid;
  actorId: string;
  campo: string;
  valor: unknown;
  estado: EstadoInformacion;
  raoCredentialId?: string;
  nivelConfianza: number;   // 1-4
  nivelEvidencia: number;   // 0-4
  fecha: number;
  periodo?: string;
  responsable?: string;
  verificadorId?: string;
  esPublico: boolean;
}

const MODULOS: Record<ModuloGrid, string> = {
  1: 'Identidad y perfil integral',
  2: 'Clasificación taxonómica',
  3: 'Capacidades y recursos',
  4: 'Necesidades y oportunidades',
  5: 'Objetivos y compromisos',
  6: 'Actividades, resultados e impactos',
  7: 'Evidencias y verificaciones',
  8: 'Tablero de Regeneración Integral (individual y organizacional)',
  9: 'Contribución al Ecosistema',
  10: 'Trayectoria y reconocimientos',
};

let gridIdCounter = 0;
function nextGridId(): string {
  gridIdCounter += 1;
  return `grid-${Date.now()}-${gridIdCounter}`;
}

const VALID_ESTADOS: EstadoInformacion[] = [
  'auto_declarado',
  'documentado',
  'verificado',
  'certificacion_oficial',
];

export function listarModulos(): Record<ModuloGrid, string> {
  return { ...MODULOS };
}

export function obtenerModulo(id: ModuloGrid): string {
  return MODULOS[id];
}

/**
 * Registra un dato en el GRID/GI3D con trazabilidad completa.
 * Estado por defecto: auto_declarado (no se asume verificado).
 */
export function registrarDato(
  dato: Omit<DatoRegistro, 'id'>,
): DatoRegistro {
  if (!VALID_ESTADOS.includes(dato.estado)) {
    throw new Error('grid-gi3d: estado de información inválido');
  }
  if (dato.nivelConfianza < 1 || dato.nivelConfianza > 4) {
    throw new Error('grid-gi3d: nivel de confianza debe estar en [1,4]');
  }
  if (dato.nivelEvidencia < 0 || dato.nivelEvidencia > 4) {
    throw new Error('grid-gi3d: nivel de evidencia debe estar en [0,4]');
  }
  return {
    ...dato,
    id: nextGridId(),
    fecha: Date.now(),
    esPublico: true,
  };
}

/**
 * Marca un dato como verificado/documentado con origen trazable.
 */
export function actualizarEstado(
  id: string,
  estado: EstadoInformacion,
  raoCredentialId?: string,
  nivelConfianza?: number,
  nivelEvidencia?: number,
): DatoRegistro | undefined {
  // Esta función opera sobre un registro pasado por referencia; el llamador
  // debe recuperar, mutar y devolver. Se proporciona la firma para claridad.
  throw new Error('grid-gi3d: use el patrón get-mutar-set sobre el store');
}

/**
 * Rastrear el origen de un dato: quién lo ingresó, cuándo, con qué evidencia.
 */
export function rastrearOrigen(dato: DatoRegistro): {
  datoId: string;
  fecha: number;
  responsable?: string;
  raoCredentialId?: string;
  nivelConfianza: number;
  nivelEvidencia: number;
} {
  return {
    datoId: dato.id,
    fecha: dato.fecha,
    responsable: dato.responsable,
    raoCredentialId: dato.raoCredentialId,
    nivelConfianza: dato.nivelConfianza,
    nivelEvidencia: dato.nivelEvidencia,
  };
}

export function esDatoVerificado(dato: DatoRegistro): boolean {
  return dato.estado === 'verificado' || dato.estado === 'certificacion_oficial';
}

export function esDatoPublico(dato: DatoRegistro): boolean {
  return dato.esPublico;
}
