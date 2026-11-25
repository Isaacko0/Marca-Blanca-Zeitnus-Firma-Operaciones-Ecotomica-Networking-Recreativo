// src/core/state/znu-espirulina-anchor.ts
// Estado del módulo Ancla ZNU en Espirulina — ALRAC/Zeitnus.

import type {
  AnclaZNU,
  ProtocoloPSE,
  Terrario,
  LoteEspirulina,
} from '../lib/znu-espirulina-anchor';

export interface ZnuEspirulinaAnchorState {
  anclas: Map<string, AnclaZNU>;
  protocolosPSE: Map<string, ProtocoloPSE>;
  terrarios: Map<string, Terrario>;
  lotes: Map<string, LoteEspirulina>;
  anclaActivaId: string | null;
}

export function makeZnuEspirulinaAnchorState(): ZnuEspirulinaAnchorState {
  return {
    anclas: new Map(),
    protocolosPSE: new Map(),
    terrarios: new Map(),
    lotes: new Map(),
    anclaActivaId: null,
  };
}
