/**
 * Control Laws in Aging and Longevity — React Hooks
 * HSCSG v15 OS — Zustand selectors for aging-control state
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AgingControlConfig,
  Intervention,
  CaseStudyResult,
  ControlCost,
  LifespanMetrics,
  StateBounds,
  InterventionId,
  CaseStudyId,
  AgingControlMode,
  AGING_CONTROL_PRESETS,
  AGING_CONTROL_VALIDATORS,
} from './aging-control';

/** Slice state */
export interface AgingControlSlice {
  // Config
  config: AgingControlConfig;
  setConfig: (config: Partial<AgingControlConfig>) => void;
  setMode: (mode: AgingControlMode, priceParity?: number) => void;

  // Interventions
  interventions: Intervention[];
  selectedInterventionIds: InterventionId[];
  setSelectedInterventions: (ids: InterventionId[]) => void;
  addCustomIntervention: (intervention: Intervention) => void;

  // Initial state
  initialState: number[]; // [age, bioAge, healthCapital, damageLoad, interventionCapacity]
  setInitialState: (state: number[]) => void;

  // Computed results
  trajectory: { state: number[]; controls: number[] }[] | null;
  optimalControls: number[][] | null;
  caseStudies: CaseStudyResult[] | null;
  lastCost: ControlCost | null;
  lifespanMetrics: LifespanMetrics | null;

  // Actions
  computeTrajectory: (controls?: number[][]) => Promise<void>;
  computeOptimal: () => Promise<void>;
  runCaseStudies: () => Promise<void>;
  computeCost: (trajectory: { state: number[]; controls: number[] }[]) => ControlCost;
  reset: () => void;

  // Validation
  isStateViable: (state: number[]) => boolean;
  validateControl: (control: number, interventionId: InterventionId) => boolean;

  // Presets
  applyPreset: (preset: keyof typeof AGING_CONTROL_PRESETS) => void;
}

/** Default initial state */
const DEFAULT_INITIAL_STATE: number[] = [40, 38, 0.85, 10, 0.9];

/** Default config */
const DEFAULT_CONFIG: AgingControlConfig = AGING_CONTROL_PRESETS.conservative;

/** Create the slice */
export const createAgingControlSlice = (set: any, get: any): AgingControlSlice => ({
  // Config
  config: DEFAULT_CONFIG,
  setConfig: (partial) => set((state: any) => ({
    config: { ...state.config, ...partial },
  })),
  setMode: (mode, priceParity) => set((state: any) => ({
    config: { ...state.config, mode, priceParity },
  })),

  // Interventions
  interventions: [],
  selectedInterventionIds: ['combo_standard'],
  setSelectedInterventions: (ids) => set({ selectedInterventionIds: ids }),
  addCustomIntervention: (intervention) => set((state: any) => ({
    interventions: [...state.interventions, intervention],
  })),

  // Initial state
  initialState: DEFAULT_INITIAL_STATE,
  setInitialState: (state) => set({ initialState: state }),

  // Computed
  trajectory: null,
  optimalControls: null,
  caseStudies: null,
  lastCost: null,
  lifespanMetrics: null,

  // Actions
  computeTrajectory: async (controls) => {
    const { simulateTrajectory } = await import('../../lib/aging-control');
    const { initialState, config, interventions, selectedInterventionIds } = get();
    const activeInterventions = interventions.length > 0
      ? interventions.filter(i => selectedInterventionIds.includes(i.id as InterventionId))
      : (await import('../../lib/aging-control')).CANONICAL_INTERVENTIONS.filter(i =>
          selectedInterventionIds.includes(i.id as InterventionId)
        );

    const ctrl = controls || activeInterventionIds.map(() =>
      Array.from({ length: Math.round(config.horizon / 0.1) }, () => 0.5)
    );

    const trajectory = simulateTrajectory(initialState, ctrl, activeInterventions, 0.1, config.horizon);
    const { computeLifespanMetrics } = await import('../../lib/aging-control');
    const lifespanMetrics = computeLifespanMetrics(trajectory);
    const cost = get().computeCost(trajectory);

    set({ trajectory, lifespanMetrics, lastCost: cost });
  },

  computeOptimal: async () => {
    const { computeOptimalControl } = await import('../../lib/aging-control');
    const { initialState, config, interventions, selectedInterventionIds } = get();
    const activeInterventions = interventions.length > 0
      ? interventions.filter(i => selectedInterventionIds.includes(i.id as InterventionId))
      : (await import('../../lib/aging-control')).CANONICAL_INTERVENTIONS.filter(i =>
          selectedInterventionIds.includes(i.id as InterventionId)
        );

    const result = computeOptimalControl(initialState, activeInterventions, config);
    const { computeLifespanMetrics } = await import('../../lib/aging-control');
    const lifespanMetrics = computeLifespanMetrics(result.trajectory);

    set({
      optimalControls: result.controls,
      trajectory: result.trajectory,
      lastCost: result.cost,
      lifespanMetrics,
    });
  },

  runCaseStudies: async () => {
    const { runCaseStudies } = await import('../../lib/aging-control');
    const { config } = get();
    const studies = runCaseStudies(config);
    set({ caseStudies: studies });
  },

  computeCost: (trajectory) => {
    const { computeTotalControlCost } = require('../../lib/aging-control');
    const { interventions, selectedInterventionIds, config } = get();
    const activeInterventions = interventions.length > 0
      ? interventions.filter(i => selectedInterventionIds.includes(i.id as InterventionId))
      : require('../../lib/aging-control').CANONICAL_INTERVENTIONS.filter((i: any) =>
          selectedInterventionIds.includes(i.id)
        );
    return computeTotalControlCost(trajectory, activeInterventions, config);
  },

  reset: () => set({
    trajectory: null,
    optimalControls: null,
    caseStudies: null,
    lastCost: null,
    lifespanMetrics: null,
    initialState: DEFAULT_INITIAL_STATE,
  }),

  // Validation
  isStateViable: (state) => {
    const { isViable } = require('../../lib/aging-control');
    const { config } = get();
    return isViable(state, {
      age: [0, 120],
      bioAge: [0, 150],
      healthCapital: [0, 1],
      damageLoad: [0, 100],
      interventionCapacity: [0, 1],
    }, config.viabilityTol);
  },

  validateControl: (control, interventionId) => {
    const { interventions } = get();
    const intervention = interventions.find(i => i.id === interventionId);
    if (!intervention) return false;
    return control >= intervention.minIntensity && control <= intervention.maxIntensity;
  },

  // Presets
  applyPreset: (preset) => {
    const presetConfig = AGING_CONTROL_PRESETS[preset];
    if (presetConfig) {
      set({ config: presetConfig });
    }
  },
});

/** Selector hooks */
export const useAgingControlConfig = (state: any) => state.config;
export const useAgingControlMode = (state: any) => state.config.mode;
export const useInterventions = (state: any) => state.interventions;
export const useSelectedInterventions = (state: any) =>
  state.selectedInterventionIds.map((id: string) =>
    state.interventions.find((i: any) => i.id === id) ||
    require('../../lib/aging-control').CANONICAL_INTERVENTIONS.find((i: any) => i.id === id)
  );
export const useInitialState = (state: any) => state.initialState;
export const useTrajectory = (state: any) => state.trajectory;
export const useOptimalControls = (state: any) => state.optimalControls;
export const useCaseStudies = (state: any) => state.caseStudies;
export const useLastCost = (state: any) => state.lastCost;
export const useLifespanMetrics = (state: any) => state.lifespanMetrics;
export const useAgingControlActions = (state: any) => ({
  computeTrajectory: state.computeTrajectory,
  computeOptimal: state.computeOptimal,
  runCaseStudies: state.runCaseStudies,
  computeCost: state.computeCost,
  reset: state.reset,
  setConfig: state.setConfig,
  setMode: state.setMode,
  setSelectedInterventions: state.setSelectedInterventions,
  setInitialState: state.setInitialState,
  addCustomIntervention: state.addCustomIntervention,
  isStateViable: state.isStateViable,
  validateControl: state.validateControl,
  applyPreset: state.applyPreset,
});

/** Combined hook for convenience */
export const useAgingControl = () => {
  // This would be used with the main store
  // For now, return the selector functions
  return {
    useConfig: useAgingControlConfig,
    useMode: useAgingControlMode,
    useInterventions: useInterventions,
    useSelectedInterventions: useSelectedInterventions,
    useInitialState: useInitialState,
    useTrajectory: useTrajectory,
    useOptimalControls: useOptimalControls,
    useCaseStudies: useCaseStudies,
    useLastCost: useLastCost,
    useLifespanMetrics: useLifespanMetrics,
    useActions: useAgingControlActions,
  };
};