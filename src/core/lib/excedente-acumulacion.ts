// src/core/lib/excedente-acumulacion.ts
// Excedente y Acumulación sin Trabajo — ALRAC/Zeitnus.
// Detecta excedente no asociado a trabajo productivo y acumulación de
// riqueza sin contraprestación. Fundamentado en la Revolución Neolítica:
// el excedente agrícola permitió que algunos dejaran de trabajar y vivieran
// del trabajo de otros.
// NO permite acumulación sin aporte productivo verificable.

export type TipoExcedente = 'alimento' | 'recurso' | 'capital';

export interface Excedente {
  id: string;
  tipo: TipoExcedente;
  cantidad: number;
  unidad: string;
  asociadoATrabajoProductivo: boolean;
  controladoPor: string;
  fecha: number;
}

export interface AcumulacionSinTrabajo {
  id: string;
  excedenteId: string;
  descripcion: string;
  beneficiarioId: string;
  aporteProductivoVerificado: boolean;   // siempre false para esta categoría
  fecha: number;
}

let excedenteCounter = 0;
let acumulacionCounter = 0;

function nextExcedenteId(): string {
  excedenteCounter += 1;
  return `excedente-${Date.now()}-${excedenteCounter}`;
}

function nextAcumulacionId(): string {
  acumulacionCounter += 1;
  return `acum-${Date.now()}-${acumulacionCounter}`;
}

/**
 * Registra un excedente. Si no está asociado a trabajo productivo, se
 * marca como candidato a acumulación sin trabajo.
 */
export function registrarExcedente(
  datos: Omit<Excedente, 'id' | 'fecha'>,
): Excedente {
  if (datos.cantidad < 0) {
    throw new Error('excedente-acumulacion: cantidad no puede ser negativa');
  }
  return {
    ...datos,
    id: nextExcedenteId(),
    fecha: Date.now(),
  };
}

/**
 * Marca un excedente como acumulación sin trabajo (beneficiario sin aporte
 * productivo verificable).
 */
export function marcarAcumulacionSinTrabajo(
  excedenteId: string,
  descripcion: string,
  beneficiarioId: string,
): AcumulacionSinTrabajo {
  return {
    id: nextAcumulacionId(),
    excedenteId,
    descripcion,
    beneficiarioId,
    aporteProductivoVerificado: false,
    fecha: Date.now(),
  };
}

/**
 * Verifica si un excedente representa acumulación sin trabajo.
 */
export function esAcumulacionSinTrabajo(excedente: Excedente): boolean {
  return !excedente.asociadoATrabajoProductivo;
}

/**
 * Verifica si un beneficiario tiene aporte productivo verificable.
 */
export function tieneAporteProductivo(verificado: boolean): boolean {
  return verificado === true;
}
