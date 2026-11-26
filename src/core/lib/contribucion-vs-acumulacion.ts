// src/core/lib/contribucion-vs-acumulacion.ts
// Contribución vs Acumulación — ALRAC/Zeitnus.
// Separación estricta entre mérito (aporte a la sociedad) y recompensa
// (acumulación de riqueza). Una acumulación solo es válida si proviene de
// aporte productivo verificable.
// Rechaza la desvinculación mérito-recompensa institucionalizada por el
// poder monárquico y hereditario.

export type TipoAporte = 'trabajo' | 'conocimiento' | 'cuidado' | 'infraestructura' | 'otro';
export type OrigenAcumulacion =
  | 'aporte_productivo'
  | 'herencia'
  | 'posicion_sanguinea'
  | 'excedente_controlado'
  | 'otro';

export interface AporteProductivo {
  id: string;
  contribuyenteId: string;
  tipo: TipoAporte;
  descripcion: string;
  verificable: boolean;
  fecha: number;
}

export interface AcumulacionRiqueza {
  id: string;
  beneficiarioId: string;
  cantidad: number;
  unidad: string;
  origen: OrigenAcumulacion;
  esValida: boolean;   // true solo si origen === 'aporte_productivo' y verificable
  fecha: number;
}

export interface DesconexionMeritoRecompensa {
  id: string;
  caso: string;
  descripcion: string;
  corregido: boolean;
  fecha: number;
}

let aporteCounter = 0;
let acumulacionCounter = 0;
let desconexionCounter = 0;

function nextAporteId(): string {
  aporteCounter += 1;
  return `aporte-${Date.now()}-${aporteCounter}`;
}

function nextAcumulacionId(): string {
  acumulacionCounter += 1;
  return `acum-riqueza-${Date.now()}-${acumulacionCounter}`;
}

function nextDesconexionId(): string {
  desconexionCounter += 1;
  return `desconexion-${Date.now()}-${desconexionCounter}`;
}

/**
 * Registra un aporte productivo verificable.
 */
export function registrarAporteProductivo(
  datos: Omit<AporteProductivo, 'id' | 'fecha'>,
): AporteProductivo {
  return {
    ...datos,
    id: nextAporteId(),
    fecha: Date.now(),
  };
}

/**
 * Registra una acumulación de riqueza. Es válida solo si el origen es
 * aporte productivo y es verificable. Cualquier otro origen marca
 * desconexión mérito-recompensa.
 */
export function registrarAcumulacionRiqueza(
  beneficiarioId: string,
  cantidad: number,
  unidad: string,
  origen: OrigenAcumulacion,
  verificable: boolean = false,
): { acumulacion: AcumulacionRiqueza; desconexion?: DesconexionMeritoRecompensa } {
  if (cantidad < 0) {
    throw new Error('contribucion-vs-acumulacion: cantidad no puede ser negativa');
  }
  const esValida = origen === 'aporte_productivo' && verificable === true;

  const acumulacion: AcumulacionRiqueza = {
    id: nextAcumulacionId(),
    beneficiarioId,
    cantidad,
    unidad,
    origen,
    esValida,
    fecha: Date.now(),
  };

  let desconexion: DesconexionMeritoRecompensa | undefined;
  if (!esValida) {
    desconexion = {
      id: nextDesconexionId(),
      caso: 'acumulacion_sin_aporte',
      descripcion: `Acumulación de ${cantidad} ${unidad} con origen '${origen}' sin aporte productivo verificable`,
      corregido: false,
      fecha: Date.now(),
    };
  }

  return { acumulacion, desconexion };
}

/**
 * Verifica si una acumulación de riqueza es válida (aporte productivo verificable).
 */
export function esAcumulacionValida(acumulacion: AcumulacionRiqueza): boolean {
  return acumulacion.esValida;
}

/**
 * Marca una desconexión mérito-recompensa como corregida.
 */
export function corregirDesconexion(
  desconexion: DesconexionMeritoRecompensa,
): DesconexionMeritoRecompensa {
  return { ...desconexion, corregido: true };
}

/**
 * Verifica si una acumulación representa desconexión mérito-recompensa.
 */
export function esDesconexionMeritoRecompensa(acumulacion: AcumulacionRiqueza): boolean {
  return !acumulacion.esValida;
}
