// src/core/lib/seis-cifras-trabajo.ts
// Seis Cifras — Trabajo, Tiempo y Riqueza — ALRAC/Zeitnus.
// Diagnóstico puro de valor del trabajo (remunerado y no remunerado),
// carga total, salario efectivo y concentración de riqueza.
// NO crea nueva moneda. NO permite rankings absolutos. NO mercantiliza el cuidado.
// NO permite vigilancia laboral.

export interface HorasTrabajo {
  pagadas: number;                 // 65.000 (rango 60k-70k)
  cuidadosNoRemunerados: number;   // 50.000-55.000
  desplazamientos: number;         // 9.500
  total: number;                   // 130.000
  rangoPagadas: { min: number; max: number };
}

export interface ParticipacionLaboral {
  productividadHora: number;   // 15-20 USD
  participacionIngreso: number;// 0.53-0.54
  salarioEfectivo: number;     // 8-10 USD
}

export interface ConcentracionRiqueza {
  patrimonioPromedioPaisRico: number;   // 300.000-500.000 USD
  medianaGlobalAdulto: number;          // 8.000-10.000 USD
  ratio: number;                        // ~10x
}

export interface RespuestaALRAC {
  caasAccesoSinSalario: boolean;
  znuCreditoCompensacion: boolean;
  tqReconocimientoCuidados: boolean;
  cvntValorNoTransaccional: boolean;
  descansoComoContribucion: boolean;
}

export interface SeisCifrasDiagnostico {
  suenoAnios: { min: number; max: number };      // 20-25
  ventanaLaboralAnios: number;                    // 42 (20-63)
  horasTrabajo: HorasTrabajo;
  participacionLaboral: ParticipacionLaboral;
  concentracionRiqueza: ConcentracionRiqueza;
  respuestaALRAC: RespuestaALRAC;
  fechaDiagnostico: number;
}

/*──────────────────────────────────────────────
  Valores por defecto del texto fuente
──────────────────────────────────────────────*/

const VALORES_DEFECTO: SeisCifrasDiagnostico = {
  suenoAnios: { min: 20, max: 25 },
  ventanaLaboralAnios: 42,
  horasTrabajo: {
    pagadas: 65000,
    cuidadosNoRemunerados: 52500,
    desplazamientos: 9500,
    total: 130000,
    rangoPagadas: { min: 60000, max: 70000 },
  },
  participacionLaboral: {
    productividadHora: 17.5,
    participacionIngreso: 0.535,
    salarioEfectivo: 9.0,
  },
  concentracionRiqueza: {
    patrimonioPromedioPaisRico: 400000,
    medianaGlobalAdulto: 9000,
    ratio: 44.44,
  },
  respuestaALRAC: {
    caasAccesoSinSalario: true,
    znuCreditoCompensacion: true,
    tqReconocimientoCuidados: true,
    cvntValorNoTransaccional: true,
    descansoComoContribucion: true,
  },
  fechaDiagnostico: Date.now(),
};

/*──────────────────────────────────────────────
  Funciones públicas
──────────────────────────────────────────────*/

/**
 * Retorna el diagnóstico completo de las seis cifras con los valores
 * del texto fuente (rango honesto para pagadas, punto medio para riqueza).
 */
export function diagnosticarSeisCifras(): SeisCifrasDiagnostico {
  return {
    ...VALORES_DEFECTO,
    fechaDiagnostico: Date.now(),
  };
}

/**
 * Calcula la carga total de trabajo en sentido amplio:
 * pagadas + cuidados no remunerados + desplazamientos.
 */
export function calcularCargaTotal(
  pagadas: number,
  cuidadosNoRemunerados: number,
  desplazamientos: number,
): number {
  if (pagadas < 0 || cuidadosNoRemunerados < 0 || desplazamientos < 0) {
    throw new Error('seis-cifras-trabajo: las horas no pueden ser negativas');
  }
  return pagadas + cuidadosNoRemunerados + desplazamientos;
}

/**
 * Calcula el salario efectivo: productividad × participación del trabajo en el ingreso.
 */
export function calcularSalarioEfectivo(
  productividadHora: number,
  participacionIngreso: number,
): number {
  if (productividadHora < 0) {
    throw new Error('seis-cifras-trabajo: productividad no puede ser negativa');
  }
  if (participacionIngreso < 0 || participacionIngreso > 1) {
    throw new Error('seis-cifras-trabajo: participación debe estar en [0,1]');
  }
  return productividadHora * participacionIngreso;
}

/**
 * Calcula el ratio de concentración de riqueza: patrimonio promedio / mediana global.
 */
export function calcularRatioConcentracion(
  patrimonioPromedio: number,
  medianaGlobal: number,
): number {
  if (patrimonioPromedio < 0) {
    throw new Error('seis-cifras-trabajo: patrimonio no puede ser negativo');
  }
  if (medianaGlobal <= 0) {
    throw new Error('seis-cifras-trabajo: mediana global debe ser > 0');
  }
  return patrimonioPromedio / medianaGlobal;
}

/**
 * Detecta si el trabajo de cuidados es invisible (existe pero no está reconocido).
 * Un cuidado es visible si tiene registro de reconocimiento no transaccional.
 */
export function esCuidadosInvisibles(
  horasCuidados: number,
  cuidadosReconocidos: boolean,
): boolean {
  if (horasCuidados < 0) {
    throw new Error('seis-cifras-trabajo: horas de cuidados no pueden ser negativas');
  }
  return horasCuidados > 0 && !cuidadosReconocidos;
}

/**
 * Genera la respuesta del sistema ALRAC/Zeitnus ante el diagnóstico.
 * Siempre afirma: acceso sin salario, crédito ZNU, reconocimiento TQ,
 * valor no transaccional CVNT, descanso como contribución.
 */
export function respuestaALRAC(): RespuestaALRAC {
  return {
    caasAccesoSinSalario: true,
    znuCreditoCompensacion: true,
    tqReconocimientoCuidados: true,
    cvntValorNoTransaccional: true,
    descansoComoContribucion: true,
  };
}

/**
 * Verifica si las horas pagadas están dentro del rango honesto del texto (60k-70k).
 */
export function estaEnRangoPagadas(horas: number): boolean {
  return horas >= 60000 && horas <= 70000;
}

/**
 * Verifica si el salario efectivo está dentro del rango del texto (8-10 USD).
 */
export function estaEnRangoSalario(salario: number): boolean {
  return salario >= 8 && salario <= 10;
}

/**
 * Verifica si el ratio de concentración indica desigualdad estructural alta (> 5x).
 */
export function esConcentracionAlta(ratio: number): boolean {
  return ratio > 5;
}
