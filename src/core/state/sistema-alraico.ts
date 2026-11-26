// src/core/state/sistema-alraico.ts
// Estado del módulo Sistema Alráico — ALRAC/Zeitnus.

import type {
  ReglaALRAC,
  NodoALRAC,
  AristaALRAC,
  SimboloModoCompacto,
  SesionVerificacionTriaxial,
  SesionTransduccion,
  SesionReconfiguracion,
  LimiteCognitivo,
} from '../lib/sistema-alraico';

export interface SistemaAlraicoState {
  reglas: ReglaALRAC[];
  nodos: NodoALRAC[];
  aristas: AristaALRAC[];
  simbolosModoCompacto: SimboloModoCompacto[];
  sesionesVerificacion: SesionVerificacionTriaxial[];
  sesionesTransduccion: SesionTransduccion[];
  sesionesReconfiguracion: SesionReconfiguracion[];
  limitesCognitivos: LimiteCognitivo[];
}

export function makeSistemaAlraicoState(): SistemaAlraicoState {
  return {
    reglas: [],
    nodos: [],
    aristas: [],
    simbolosModoCompacto: [],
    sesionesVerificacion: [],
    sesionesTransduccion: [],
    sesionesReconfiguracion: [],
    limitesCognitivos: [],
  };
}
