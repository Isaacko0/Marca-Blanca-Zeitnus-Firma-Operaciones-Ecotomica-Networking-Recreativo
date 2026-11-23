// src/core/lib/hscsg-salud-laboral.ts
// HSCSG Salud Laboral — las seis cifras como diagnóstico de condición humana en el trabajo.
// 5 ejes estratégicos: diagnóstico de carga real, prevención y descanso,
// salarios y productividad, desigualdad patrimonial, visibilización del cuidado.
// NO crea nueva moneda. NO permite rankings absolutos. NO mercantiliza el cuidado.
// NO permite vigilancia laboral. NO trata salud solo como accidente/enfermedad profesional.

import type {
  SeisCifrasDiagnostico,
  HorasTrabajo,
  ParticipacionLaboral,
  ConcentracionRiqueza,
} from './seis-cifras-trabajo';

export interface CargaTrabajo {
  pagadas: number;
  cuidadosNoRemunerados: number;
  desplazamientos: number;
  total: number;
  porcentajeVidaConsciente: number; // ~30%
}

export interface BrechaSalarial {
  productividadHora: number;   // 15-20 USD
  salarioEfectivo: number;     // 8-10 USD
  participacionIngreso: number;// 0.53-0.54
  margenMejora: boolean;       // productividad > salario efectivo
}

export interface ConcentracionRiquezaHSCSG {
  patrimonioPromedioPaisRico: number;   // 300.000-500.000 USD
  medianaGlobalAdulto: number;          // 8.000-10.000 USD
  ratio: number;                        // ~10x
  desigualdadEstructural: boolean;      // ratio > 5
}

export interface RespuestaPoliticaHSCSG {
  limitesJornadaFundadosEnSueno: boolean;
  evaluacionCargaGlobal: boolean;
  negociacionSalarialConBaseProductividad: boolean;
  proteccionPatrimonialVinculadaSalud: boolean;
  cuidadosVisibilizadosPerspectivoGenero: boolean;
  accesoCaaSSinSalario: boolean;
}

export interface EjeEstrategico {
  id: string;
  nombre: string;
  datos: string[];
  usoConcreto: string;
  activo: boolean;
}

export interface DiagnosticoHSCSG {
  suenoAnios: { min: number; max: number };      // 20-25
  ventanaLaboralAnios: number;                    // 42 (20-63)
  cargaTrabajo: CargaTrabajo;
  brechaSalarial: BrechaSalarial;
  concentracionRiqueza: ConcentracionRiquezaHSCSG;
  ejesEstrategicos: EjeEstrategico[];
  respuestaPolitica: RespuestaPoliticaHSCSG;
  fechaDiagnostico: number;
}

/*──────────────────────────────────────────────
  Valores por defecto del texto fuente (seis cifras)
──────────────────────────────────────────────*/

const SUENO_DEFECTO = { min: 20, max: 25 };
const VENTANA_LABORAL_DEFECTO = 42;

const CARGA_DEFECTO: CargaTrabajo = {
  pagadas: 65000,
  cuidadosNoRemunerados: 52500,
  desplazamientos: 9500,
  total: 127000,
  porcentajeVidaConsciente: 30,
};

const BRECHA_DEFECTO: BrechaSalarial = {
  productividadHora: 17.5,
  salarioEfectivo: 9.0,
  participacionIngreso: 0.535,
  margenMejora: true,
};

const CONCENTRACION_DEFECTO: ConcentracionRiquezaHSCSG = {
  patrimonioPromedioPaisRico: 400000,
  medianaGlobalAdulto: 9000,
  ratio: 44.44,
  desigualdadEstructural: true,
};

const RESPUESTA_DEFECTO: RespuestaPoliticaHSCSG = {
  limitesJornadaFundadosEnSueno: true,
  evaluacionCargaGlobal: true,
  negociacionSalarialConBaseProductividad: true,
  proteccionPatrimonialVinculadaSalud: true,
  cuidadosVisibilizadosPerspectivoGenero: true,
  accesoCaaSSinSalario: true,
};

const EJES_DEFECTO: EjeEstrategico[] = [
  {
    id: 'eje-1',
    nombre: 'Diagnóstico de carga real',
    datos: ['65.000 h remuneradas', '50.000–55.000 h no remuneradas', '9.500 h desplazamiento', '~130.000 h total'],
    usoConcreto: 'Evaluaciones de riesgo que incluyan la jornada ampliada, no solo el puesto de trabajo',
    activo: true,
  },
  {
    id: 'eje-2',
    nombre: 'Prevención y descanso',
    datos: ['20–25 años de sueño', 'Ventana laboral de 42 años'],
    usoConcreto: 'Límites de jornada, pausas y políticas de desconexión como inversión en salud',
    activo: true,
  },
  {
    id: 'eje-3',
    nombre: 'Salarios y productividad',
    datos: ['Productividad 15–20 USD/h', 'Salario efectivo 8–10 USD/h', 'Participación del trabajo 53–54%'],
    usoConcreto: 'Base cuantitativa para mejorar salarios y financiar bienestar laboral',
    activo: true,
  },
  {
    id: 'eje-4',
    nombre: 'Desigualdad patrimonial',
    datos: ['Mediana global 8.000–10.000 USD', 'Promedio países ricos 300.000–500.000 USD'],
    usoConcreto: 'Vincular salud laboral con protección social y redistribución',
    activo: true,
  },
  {
    id: 'eje-5',
    nombre: 'Visibilización del cuidado',
    datos: ['~50.000–55.000 h trabajo doméstico y de cuidados no remunerado'],
    usoConcreto: 'Perspectiva de género y doble presencia en políticas de salud laboral',
    activo: true,
  },
];

/*──────────────────────────────────────────────
  Funciones públicas
──────────────────────────────────────────────*/

/**
 * Retorna el diagnóstico completo de condición humana con los 5 ejes
 * estratégicos de HSCSG salud laboral.
 */
export function diagnosticarCondicionHumana(): DiagnosticoHSCSG {
  return {
    suenoAnios: { ...SUENO_DEFECTO },
    ventanaLaboralAnios: VENTANA_LABORAL_DEFECTO,
    cargaTrabajo: { ...CARGA_DEFECTO },
    brechaSalarial: { ...BRECHA_DEFECTO },
    concentracionRiqueza: { ...CONCENTRACION_DEFECTO },
    ejesEstrategicos: [...EJES_DEFECTO],
    respuestaPolitica: { ...RESPUESTA_DEFECTO },
    fechaDiagnostico: Date.now(),
  };
}

/**
 * Calcula la carga total de trabajo en sentido amplio.
 */
export function calcularCargaTotal(
  pagadas: number,
  cuidadosNoRemunerados: number,
  desplazamientos: number,
): CargaTrabajo {
  if (pagadas < 0 || cuidadosNoRemunerados < 0 || desplazamientos < 0) {
    throw new Error('hscsg-salud-laboral: las horas no pueden ser negativas');
  }
  const total = pagadas + cuidadosNoRemunerados + desplazamientos;
  return {
    pagadas,
    cuidadosNoRemunerados,
    desplazamientos,
    total,
    porcentajeVidaConsciente: Math.round((total / 130000) * 30),
  };
}

/**
 * Calcula la brecha entre productividad y salario efectivo.
 * Detecta si existe margen real para mejorar remuneraciones.
 */
export function calcularBrechaProductividadSalarial(
  productividadHora: number,
  salarioEfectivo: number,
  participacionIngreso: number,
): BrechaSalarial {
  if (productividadHora < 0 || salarioEfectivo < 0) {
    throw new Error('hscsg-salud-laboral: productividad y salario no pueden ser negativos');
  }
  if (participacionIngreso < 0 || participacionIngreso > 1) {
    throw new Error('hscsg-salud-laboral: participación debe estar en [0,1]');
  }
  return {
    productividadHora,
    salarioEfectivo,
    participacionIngreso,
    margenMejora: productividadHora > salarioEfectivo,
  };
}

/**
 * Calcula el ratio de concentración de riqueza y detecta desigualdad estructural.
 */
export function calcularRatioConcentracionRiqueza(
  patrimonioPromedio: number,
  medianaGlobal: number,
): ConcentracionRiquezaHSCSG {
  if (patrimonioPromedio < 0) {
    throw new Error('hscsg-salud-laboral: patrimonio no puede ser negativo');
  }
  if (medianaGlobal <= 0) {
    throw new Error('hscsg-salud-laboral: mediana global debe ser > 0');
  }
  const ratio = patrimonioPromedio / medianaGlobal;
  return {
    patrimonioPromedioPaisRico: patrimonioPromedio,
    medianaGlobalAdulto: medianaGlobal,
    ratio,
    desigualdadEstructural: ratio > 5,
  };
}

/**
 * Valida si el sueño opera como base biológica ineludible (~1/3 de la existencia).
 * Esperanza de vida global ~73 años; sueño 7-8h nocturnas → 20-25 años.
 */
export function esSueñoBaseBiologica(
  horasSueñoDiarias: number,
  esperanzaVida: number,
): boolean {
  if (horasSueñoDiarias < 0 || horasSueñoDiarias > 24) {
    throw new Error('hscsg-salud-laboral: horas de sueño deben estar en [0,24]');
  }
  if (esperanzaVida <= 0) {
    throw new Error('hscsg-salud-laboral: esperanza de vida debe ser > 0');
  }
  const añosDurmidos = (horasSueñoDiarias / 24) * esperanzaVida;
  return añosDurmidos >= esperanzaVida / 3 && añosDurmidos <= esperanzaVida / 2;
}

/**
 * Genera la respuesta de política HSCSG ante el diagnóstico.
 * Siempre afirma los 6 compromisos: límites de jornada, carga global,
 * negociación con base productividad, protección patrimonial, cuidados con
 * perspectiva de género, acceso CaaS sin salario.
 */
export function respuestaPoliticaHSCSG(): RespuestaPoliticaHSCSG {
  return { ...RESPUESTA_DEFECTO };
}

/**
 * Verifica si una jornada respeta el sueño como base biológica.
 * Asume 8h de sueño, dejando 16h de vida consciente; jornada máxima razonable 8h.
 */
export function jornadaRespetuosaDelSueno(horasJornada: number): boolean {
  if (horasJornada < 0 || horasJornada > 24) {
    throw new Error('hscsg-salud-laboral: jornada debe estar en [0,24]');
  }
  return horasJornada <= 8;
}

/**
 * Verifica si el ratio de concentración indica desigualdad estructural alta.
 */
export function esDesigualdadEstructural(ratio: number): boolean {
  return ratio > 5;
}
