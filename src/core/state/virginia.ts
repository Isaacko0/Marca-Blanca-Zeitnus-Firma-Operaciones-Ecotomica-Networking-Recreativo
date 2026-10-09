// HSCSG v15 OS — Virginia Network State Slice
// Estado del árbol de distribución Virginia (Prototipo IE v2)

import type { VirginiaTreeState, VirginiaConfig } from '@core/lib/virginiaNetwork'

export interface VirginiaState {
  tree: VirginiaTreeState | null
  config: VirginiaConfig
  lastRebuild: number
}

export function makeVirginiaState(): VirginiaState {
  return {
    tree: null,
    config: {
      rcePlena: 1000,
      nodeMode: 'postmonetario',
      priceParity: 10,
    },
    lastRebuild: 0,
  }
}