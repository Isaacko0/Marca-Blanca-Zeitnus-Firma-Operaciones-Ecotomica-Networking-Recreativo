// src/core/lib/contabilidad-poder.ts
// Contabilidad de Poder — ALRAC/Zeitnus.
// Trazabilidad de deudas a templos/palacios (Sumeria, Egipto).
// La escritura se inventó para la contabilidad de poder, no para la poesía.
// Toda deuda debe estar registrada con deudor, acreedor, cantidad y motivo.
// NO permite deudas ocultas ni por "estatus".

export interface DeudaTemploPalacio {
  id: string;
  deudorId: string;
  acreedorId: string;            // templo, palacio, o elite
  cantidad: number;
  unidad: string;
  motivo: string;
  fecha: number;
  pagada: boolean;
}

export interface RegistroQuienDebeAQuien {
  id: string;
  deudas: DeudaTemploPalacio[];
  totalPorAcreedor: Map<string, number>;
  fechaActualizacion: number;
}

let deudaCounter = 0;
let registroCounter = 0;

function nextDeudaId(): string {
  deudaCounter += 1;
  return `deuda-${Date.now()}-${deudaCounter}`;
}

function nextRegistroId(): string {
  registroCounter += 1;
  return `registro-deuda-${Date.now()}-${registroCounter}`;
}

/**
 * Registra una deuda entre deudor y acreedor. Requiere motivo explícito.
 */
export function registrarDeuda(
  datos: Omit<DeudaTemploPalacio, 'id' | 'fecha'>,
): DeudaTemploPalacio {
  if (datos.cantidad <= 0) {
    throw new Error('contabilidad-poder: cantidad debe ser > 0');
  }
  if (!datos.deudorId || !datos.acreedorId || !datos.motivo) {
    throw new Error('contabilidad-poder: deudor, acreedor y motivo son obligatorios');
  }
  return {
    ...datos,
    id: nextDeudaId(),
    fecha: Date.now(),
    pagada: false,
  };
}

/**
 * Crea un registro de quién debe qué a quién, calculando totales por acreedor.
 */
export function crearRegistroDeudas(
  deudas: DeudaTemploPalacio[],
): RegistroQuienDebeAQuien {
  const totalPorAcreedor = new Map<string, number>();
  for (const d of deudas) {
    const previo = totalPorAcreedor.get(d.acreedorId) ?? 0;
    totalPorAcreedor.set(d.acreedorId, previo + d.cantidad);
  }
  return {
    id: nextRegistroId(),
    deudas: [...deudas],
    totalPorAcreedor,
    fechaActualizacion: Date.now(),
  };
}

/**
 * Marca una deuda como pagada.
 */
export function pagarDeuda(deuda: DeudaTemploPalacio): DeudaTemploPalacio {
  return { ...deuda, pagada: true };
}

/**
 * Verifica si una deuda está pagada.
 */
export function esDeudaPagada(d: DeudaTemploPalacio): boolean {
  return d.pagada === true;
}
