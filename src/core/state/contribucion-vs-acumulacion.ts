// src/core/state/contribucion-vs-acumulacion.ts
// Estado del módulo Contribución vs Acumulación — ALRAC/Zeitnus.

import type { AporteProductivo, AcumulacionRiqueza, DesconexionMeritoRecompensa } from '../lib/contribucion-vs-acumulacion';

export interface ContribucionVsAcumulacionState {
  aportes: Map<string, AporteProductivo>;
  acumulaciones: Map<string, AcumulacionRiqueza>;
  desconexiones: Map<string, DesconexionMeritoRecompensa>;
}

export function makeContribucionVsAcumulacionState(): ContribucionVsAcumulacionState {
  return {
    aportes: new Map(),
    acumulaciones: new Map(),
    desconexiones: new Map(),
  };
}
