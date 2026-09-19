// E→V Hooks - Selectors and actions for E→V pattern
// E→V describes the passage of energy to efficiency through experience
// Life → Truth → Virtue (anfibio: postmonetario ZNU/CaaS o conectado USD/USDC vía priceParity)

import { useAppStore } from '@core/state/store'
import type { EVState, EVAction, EVLib } from '@core/state/ev'

// ===== Selectors =====
export const useEVState = () => useAppStore((state) => state.ev)
export const useEVActions = () => useAppStore((state) => ({
  setEV: (ev: Partial<EVState>) => state.setEV(ev),
  addPattern: (pattern: typeof state.ev.patterns[0]) => state.addEVPattern(pattern),
  removePattern: (id: string) => state.removeEVPattern(id),
  updatePulse: (pulse: EVState['pulse']) => state.updateEVPulse(pulse),
  setMode: (mode: EVState['mode']) => state.setEVMode(mode),
  syncPriceParity: () => state.syncEVPriceParity(),
  runVerval: (input: string) => state.runVerval(input),
  recordVerval: (result: any) => state.recordVervalResult(result),
  setCoherence: (value: number) => state.setEVCoherence(value),
  recordHuella: (huella: any) => state.recordEVHuella(huella),
  recordRastro: (rastro: any) => state.recordEVRastro(rastro),
  reset: () => state.resetEV(),
}))

export const useEVLib = () => useAppStore((state) => state.evLib)

export const useEV = () => {
  const state = useEVState()
  const actions = useEVActions()
  const lib = useEVLib()
  return { state, actions, lib }
}

export const useEVMode = () => useAppStore((state) => state.ev.mode)
export const useEVPulse = () => useAppStore((state) => state.ev.pulse)
export const useEVPatterns = () => useAppStore((state) => state.ev.patterns)
export const useEVCoherence = () => useAppStore((state) => state.ev.coherence)
export const useEVModePostmonetario = () => useAppStore((state) => state.ev.mode === 'postmonetario')
export const useEVModeConectado = () => useAppStore((state) => state.ev.mode === 'conectado')
export const usePriceParity = () => useAppStore((state) => state.ev.priceParity)
export const useVervalHistory = () => useAppStore((state) => state.ev.vervalHistory)
export const useEVHuellas = () => useAppStore((state) => state.ev.huellas)
export const useEVRastros = () => useAppStore((state) => state.ev.rastros)
export const useEVCoherenceScore = () => useAppStore((state) => state.ev.coherenceScore)
export const useEVTriggers = () => useAppStore((state) => state.ev.triggers)