// src/core/state/hscsg-salud-laboral.ts
// Estado del módulo HSCSG Salud Laboral — ALRAC/Zeitnus.

import type {
  DiagnosticoHSCSG,
  CargaTrabajo,
  BrechaSalarial,
  ConcentracionRiquezaHSCSG,
  RespuestaPoliticaHSCSG,
  EjeEstrategico,
} from '../lib/hscsg-salud-laboral';

export interface HscsgSaludLaboralState {
  diagnostico: DiagnosticoHSCSG | null;
  cargasRegistradas: Array<{
    id: string;
    pagadas: number;
    cuidadosNoRemunerados: number;
    desplazamientos: number;
    total: number;
    porcentajeVidaConsciente: number;
    fecha: number;
  }>;
  brechasRegistradas: Array<{
    id: string;
    productividadHora: number;
    salarioEfectivo: number;
    participacionIngreso: number;
    margenMejora: boolean;
    fecha: number;
  }>;
  concentracionesRegistradas: Array<{
    id: string;
    patrimonioPromedio: number;
    medianaGlobal: number;
    ratio: number;
    desigualdadEstructural: boolean;
    fecha: number;
  }>;
  respuestasPolitica: Array<{
    id: string;
    respuesta: RespuestaPoliticaHSCSG;
    fecha: number;
  }>;
  ejesActivos: string[];
}

export function makeHscsgSaludLaboralState(): HscsgSaludLaboralState {
  return {
    diagnostico: null,
    cargasRegistradas: [],
    brechasRegistradas: [],
    concentracionesRegistradas: [],
    respuestasPolitica: [],
    ejesActivos: [
      'eje-1', // Diagnóstico de carga real
      'eje-2', // Prevención y descanso
      'eje-3', // Salarios y productividad
      'eje-4', // Desigualdad patrimonial
      'eje-5', // Visibilización del cuidado
    ],
  };
}
