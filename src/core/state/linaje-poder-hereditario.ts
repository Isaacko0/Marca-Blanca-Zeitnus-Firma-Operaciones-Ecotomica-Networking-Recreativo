// src/core/state/linaje-poder-hereditario.ts
// Estado del módulo Linaje y Poder Hereditario — ALRAC/Zeitnus.

import type { Linaje, PoderHereditario } from '../lib/linaje-poder-hereditario';

export interface LinajePoderHereditarioState {
  linajes: Map<string, Linaje>;
  poderesHereditarios: Map<string, PoderHereditario>;
}

export function makeLinajePoderHereditarioState(): LinajePoderHereditarioState {
  return {
    linajes: new Map(),
    poderesHereditarios: new Map(),
  };
}
