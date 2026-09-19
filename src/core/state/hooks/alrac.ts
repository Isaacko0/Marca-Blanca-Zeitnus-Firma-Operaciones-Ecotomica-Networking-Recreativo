// ALRAC Hooks - Selectors and actions for ALRAC Consorcio

import { useAppStore } from '@core/state/store';

export const useALRAC = () => useAppStore((state) => state.alrac);
export const useALRACActions = () => useAppStore((state) => ({
  updateALRAC: state.updateALRAC as any,
  resetALRAC: state.resetALRAC as any,
}));

export const useEpistemicLayer = () => useAppStore((state) => state.alrac?.epistemicLayer);
export const useAccountingLayer = () => useAppStore((state) => state.alrac?.accountingLayer);
export const useInteropLayer = () => useAppStore((state) => state.alrac?.interopLayer);
export const useFiatLayer = () => useAppStore((state) => state.alrac?.fiatLayer);
export const useGovernance = () => useAppStore((state) => state.alrac?.governance);
export const useRevenueSplit = () => useAppStore((state) => state.alrac?.revenueSplit);
export const useProductLines = () => useAppStore((state) => state.alrac?.productLines);
export const useConsortiumStatus = () => useAppStore((state) => state.alrac?.status);