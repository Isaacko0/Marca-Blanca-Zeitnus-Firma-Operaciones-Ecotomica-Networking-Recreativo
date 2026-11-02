/**
 * Renta Básica Exponencial (RBE) — React Hooks
 * HSCSG v15 OS — Zustand selectors for RBE state
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  RBEConfig,
  RBEState,
  LayerAState,
  LayerBState,
  LayerCState,
  LayerDState,
  LayerEState,
  ThreeBudgetsState,
  GrowthState,
  TQState,
  DividendBreakdown,
  CapacityContribution,
  VerifiedContribution,
  GovernanceActivity,
  InnovationProject,
  BudgetTransaction,
  RBEMode,
  RBE_PRESETS,
  RBE_VALIDATORS,
} from './rbe';
import type { PohState } from './poh';

/** Slice state */
export interface RBESlice {
  // Config
  config: RBEConfig;
  setConfig: (config: Partial<RBEConfig>) => void;
  setMode: (mode: RBEMode, priceParity?: number) => void;
  applyPreset: (preset: keyof typeof RBE_PRESETS) => void;

  // State
  rbe: RBEState;
  setRBEState: (state: Partial<RBEState>) => void;
  resetRBE: () => void;

  // PoH integration
  pohVerifiedMap: Map<string, boolean>;
  setPohVerified: (memberId: string, verified: boolean) => void;

  // Computed
  memberDividends: Map<string, { total: number; breakdown: DividendBreakdown }>;
  lastPayoutResults: Map<string, { total: number; breakdown: DividendBreakdown }> | null;

  // Actions
  calculateDividend: (memberId: string) => { total: number; breakdown: DividendBreakdown };
  processMonthlyPayout: (members: string[]) => Promise<void>;
  updateGrowthController: (capacityIndex: number) => void;
  addCapacityContribution: (contribution: CapacityContribution) => void;
  addVerifiedContribution: (contribution: VerifiedContribution) => void;
  addGovernanceActivity: (activity: GovernanceActivity) => void;
  proposeInnovationProject: (project: Omit<InnovationProject, 'id' | 'status' | 'allocatedAmount'>) => void;
  fundInnovationProject: (projectId: string, amount: number, contributor: string) => void;
  transferBetweenBudgets: (
    fromLayer: 'A' | 'B' | 'C' | 'D' | 'E',
    toBudget: 'monetary' | 'real' | 'ecological',
    amount: number,
    description: string
  ) => void;
  applyDemurrage: () => void;
  convertAmount: (
    amount: number,
    fromMode: RBEMode,
    toMode: RBEMode
  ) => number;

  // Validation
  validateDividendBreakdown: (breakdown: DividendBreakdown) => boolean;
  validateCapacityIndex: (idx: number) => boolean;
  validateGrowthRate: (rate: number) => boolean;
  validateBudgetState: (budgetId: 'monetary' | 'real' | 'ecological') => boolean;
}

/** Default config */
const DEFAULT_CONFIG = RBE_PRESETS.standard;

/** Create the slice */
export const createRBESlice = (set: any, get: any): RBESlice => ({
  // Config
  config: DEFAULT_CONFIG,
  setConfig: (partial) => set((state: any) => ({
    config: { ...state.config, ...partial },
  })),
  setMode: (mode, priceParity) => set((state: any) => ({
    config: { ...state.config, mode, priceParity },
  })),
  applyPreset: (preset) => {
    const presetConfig = RBE_PRESETS[preset];
    if (presetConfig) {
      set({ config: presetConfig });
    }
  },

  // State
  rbe: INITIAL_RBE_STATE,
  setRBEState: (partial) => set((state: any) => ({
    rbe: { ...state.rbe, ...partial },
  })),
  resetRBE: () => set({ rbe: INITIAL_RBE_STATE }),

  // PoH integration
  pohVerifiedMap: new Map(),
  setPohVerified: (memberId, verified) => set((state: any) => {
    const newMap = new Map(state.pohVerifiedMap);
    newMap.set(memberId, verified);
    return { pohVerifiedMap: newMap };
  }),

  // Computed
  memberDividends: new Map(),
  lastPayoutResults: null,

  // Actions
  calculateDividend: (memberId) => {
    const { rbe, pohVerifiedMap } = get();
    const { calculateTotalDividend } = require('../../lib/rbe');
    const verified = pohVerifiedMap.get(memberId) || false;
    return calculateTotalDividend(rbe, memberId, verified);
  },

  processMonthlyPayout: async (members) => {
    const { processMonthlyPayout } = require('../../lib/rbe');
    const { rbe, config, pohVerifiedMap } = get();
    const result = processMonthlyPayout(rbe, members, pohVerifiedMap, config);
    set({
      rbe: result.newState,
      lastPayoutResults: result.payouts,
    });
    // Update member dividends cache
    const newDividends = new Map();
    for (const [memberId, payout] of result.payouts) {
      newDividends.set(memberId, payout);
    }
    set({ memberDividends: newDividends });
  },

  updateGrowthController: (capacityIndex) => {
    const { updateGrowthController } = require('../../lib/rbe');
    const { rbe, config } = get();
    const newRBE = updateGrowthController(rbe, capacityIndex, config);
    set({ rbe: newRBE });
  },

  addCapacityContribution: (contribution) => {
    const { addCapacityContribution } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: addCapacityContribution(rbe, contribution) });
  },

  addVerifiedContribution: (contribution) => {
    const { addVerifiedContribution } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: addVerifiedContribution(rbe, contribution) });
  },

  addGovernanceActivity: (activity) => {
    const { addGovernanceActivity } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: addGovernanceActivity(rbe, activity) });
  },

  proposeInnovationProject: (project) => {
    const { proposeInnovationProject } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: proposeInnovationProject(rbe, project) });
  },

  fundInnovationProject: (projectId, amount, contributor) => {
    const { fundInnovationProject } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: fundInnovationProject(rbe, projectId, amount, contributor) });
  },

  transferBetweenBudgets: (fromLayer, toBudget, amount, description) => {
    const { transferBetweenBudgets } = require('../../lib/rbe');
    const { rbe } = get();
    set({ rbe: transferBetweenBudgets(rbe, fromLayer, toBudget, amount, description) });
  },

  applyDemurrage: () => {
    const { applyDemurrage } = require('../../lib/rbe');
    const { rbe, config } = get();
    set({ rbe: applyDemurrage(rbe, config) });
  },

  convertAmount: (amount, fromMode, toMode) => {
    const { convertAmount } = require('../../lib/rbe');
    const { config } = get();
    return convertAmount(amount, fromMode, toMode, config.priceParity || 100);
  },

  // Validation
  validateDividendBreakdown: (breakdown) => RBE_VALIDATORS.isValidDividendBreakdown(breakdown),
  validateCapacityIndex: (idx) => RBE_VALIDATORS.isValidCapacityIndex(idx),
  validateGrowthRate: (rate) => RBE_VALIDATORS.isValidGrowthRate(rate),
  validateBudgetState: (budgetId) => RBE_VALIDATORS.isValidBudgetState(get().rbe.budgets[budgetId]),
});

/** Selector hooks */
export const useRBEConfig = (state: any) => state.config;
export const useRBEMode = (state: any) => state.config.mode;
export const useRBEState = (state: any) => state.rbe;
export const useLayerA = (state: any) => state.rbe.layerA;
export const useLayerB = (state: any) => state.rbe.layerB;
export const useLayerC = (state: any) => state.rbe.layerC;
export const useLayerD = (state: any) => state.rbe.layerD;
export const useLayerE = (state: any) => state.rbe.layerE;
export const useBudgets = (state: any) => state.rbe.budgets;
export const useGrowth = (state: any) => state.rbe.growth;
export const useTQ = (state: any) => state.rbe.tq;
export const usePohVerifiedMap = (state: any) => state.pohVerifiedMap;
export const useMemberDividends = (state: any) => state.memberDividends;
export const useLastPayoutResults = (state: any) => state.lastPayoutResults;

export const useDividend = (memberId: string) => (state: any) => {
  const cached = state.memberDividends.get(memberId);
  if (cached) return cached;
  const { calculateTotalDividend } = require('../../lib/rbe');
  const verified = state.pohVerifiedMap.get(memberId) || false;
  return calculateTotalDividend(state.rbe, memberId, verified);
};

export const useRBEActions = (state: any) => ({
  calculateDividend: state.calculateDividend,
  processMonthlyPayout: state.processMonthlyPayout,
  updateGrowthController: state.updateGrowthController,
  addCapacityContribution: state.addCapacityContribution,
  addVerifiedContribution: state.addVerifiedContribution,
  addGovernanceActivity: state.addGovernanceActivity,
  proposeInnovationProject: state.proposeInnovationProject,
  fundInnovationProject: state.fundInnovationProject,
  transferBetweenBudgets: state.transferBetweenBudgets,
  applyDemurrage: state.applyDemurrage,
  convertAmount: state.convertAmount,
  setConfig: state.setConfig,
  setMode: state.setMode,
  applyPreset: state.applyPreset,
  setRBEState: state.setRBEState,
  resetRBE: state.resetRBE,
  setPohVerified: state.setPohVerified,
  validateDividendBreakdown: state.validateDividendBreakdown,
  validateCapacityIndex: state.validateCapacityIndex,
  validateGrowthRate: state.validateGrowthRate,
  validateBudgetState: state.validateBudgetState,
});

/** Combined hook for convenience */
export const useRBE = () => {
  return {
    useConfig: useRBEConfig,
    useMode: useRBEMode,
    useState: useRBEState,
    useLayerA: useLayerA,
    useLayerB: useLayerB,
    useLayerC: useLayerC,
    useLayerD: useLayerD,
    useLayerE: useLayerE,
    useBudgets: useBudgets,
    useGrowth: useGrowth,
    useTQ: useTQ,
    usePohVerified: usePohVerifiedMap,
    useMemberDividends: useMemberDividends,
    useLastPayout: useLastPayoutResults,
    useDividend: useDividend,
    useActions: useRBEActions,
  };
};