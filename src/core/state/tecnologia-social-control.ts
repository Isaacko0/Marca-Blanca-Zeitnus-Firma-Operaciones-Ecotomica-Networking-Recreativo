// src/core/state/tecnologia-social-control.ts
// Estado del módulo Tecnología Social de Control — ALRAC/Zeitnus.

import type { TecnologiaControlRecursos } from '../lib/tecnologia-social-control';

export interface TecnologiaSocialControlState {
  tecnologias: Map<string, TecnologiaControlRecursos>;
}

export function makeTecnologiaSocialControlState(): TecnologiaSocialControlState {
  return {
    tecnologias: new Map(),
  };
}
