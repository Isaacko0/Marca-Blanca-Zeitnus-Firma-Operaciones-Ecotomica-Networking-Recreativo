// src/core/state/seis-cifras-trabajo.ts
// Estado del módulo Seis Cifras — Trabajo, Tiempo y Riqueza — ALRAC/Zeitnus.

import type {
  SeisCifrasDiagnostico,
  HorasTrabajo,
  ParticipacionLaboral,
  ConcentracionRiqueza,
  RespuestaALRAC,
} from '../lib/seis-cifras-trabajo';

export interface SeisCifrasTrabajoState {
  diagnostico: SeisCifrasDiagnostico | null;
  cargasRegistradas: Array<{
    id: string;
    pagadas: number;
    cuidadosNoRemunerados: number;
    desplazamientos: number;
    total: number;
    fecha: number;
    reconocido: boolean;
  }>;
  concentracionesRegistradas: Array<{
    id: string;
    patrimonioPromedio: number;
    medianaGlobal: number;
    ratio: number;
    fecha: number;
  }>;
  respuestasALRAC: Array<{
    id: string;
    respuesta: RespuestaALRAC;
    fecha: number;
  }>;
}

export function makeSeisCifrasTrabajoState(): SeisCifrasTrabajoState {
  return {
    diagnostico: null,
    cargasRegistradas: [],
    concentracionesRegistradas: [],
    respuestasALRAC: [],
  };
}
