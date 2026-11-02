/**
 * Control Laws in Aging and Longevity — Types
 * HSCSG v15 OS — Type definitions for aging-control module
 * Re-exports from lib/aging-control.ts (no duplication)
 */

import type {
  ViabilitySet,
  StateBounds,
  VectorField,
  ControlCost,
  ControlCostParams,
  Intervention,
  CaseStudyResult,
  AgingControlConfig,
} from './aging-control';

/** Re-export all core types */
export type {
  ViabilitySet,
  StateBounds,
  VectorField,
  ControlCost,
  ControlCostParams,
  Intervention,
  CaseStudyResult,
  AgingControlConfig,
};

/** Amphibious mode type */
export type AgingControlMode = 'postmonetario' | 'conectado';

/** Intervention type enum */
export type InterventionType =
  | 'pharmacological'
  | 'lifestyle'
  | 'gene'
  | 'senolytic'
  | 'metabolic'
  | 'combination';

/** Feasibility assessment */
export interface FeasibilityFlags {
  economic: boolean;
  biological: boolean;
  entropic: boolean;
}

/** Lifespan/healthspan metrics */
export interface LifespanMetrics {
  lifespan: number;
  healthspan: number;
  lifespanGain: number;
  healthspanGain: number;
}

/** State vector indices for readability */
export enum StateIndex {
  Age = 0,
  BioAge = 1,
  HealthCapital = 2,
  DamageLoad = 3,
  InterventionCapacity = 4,
}

/** Default viability bounds (re-export for convenience) */
export const DEFAULT_STATE_BOUNDS: StateBounds = {
  age: [0, 120],
  bioAge: [0, 150],
  healthCapital: [0, 1],
  damageLoad: [0, 100],
  interventionCapacity: [0, 1],
};

/** Canonical intervention IDs */
export const INTERVENTION_IDS = [
  'metformin',
  'rapamycin',
  'senolytic',
  'exercise',
  'caloric_restriction',
  'combo_standard',
  'combo_aggressive',
] as const;

export type InterventionId = typeof INTERVENTION_IDS[number];

/** Case study IDs */
export const CASE_STUDY_IDS = [
  'case1_healthy_40',
  'case2_prefrail_60',
  'case3_preventive_30',
] as const;

export type CaseStudyId = typeof CASE_STUDY_IDS[number];

/** Configuration presets */
export const AGING_CONTROL_PRESETS: Record<string, AgingControlConfig> = {
  conservative: {
    horizon: 20,
    discountRate: 0.05,
    viabilityTol: 0.01,
    liePrecision: 1e-5,
    mode: 'postmonetario',
  },
  aggressive: {
    horizon: 40,
    discountRate: 0.03,
    viabilityTol: 0.02,
    liePrecision: 1e-6,
    mode: 'postmonetario',
  },
  conectado: {
    horizon: 30,
    discountRate: 0.04,
    viabilityTol: 0.01,
    liePrecision: 1e-5,
    mode: 'conectado',
    priceParity: 100, // 100 ZNU per USD
  },
};

/** Validation schemas for runtime checks */
export const AGING_CONTROL_VALIDATORS = {
  isValidState: (x: number[]): boolean => x.length === 5 && x.every(v => Number.isFinite(v)),
  isValidControl: (u: number[], intervention: Intervention): boolean =>
    u >= intervention.minIntensity && u <= intervention.maxIntensity,
  isViableState: (x: number[], bounds: StateBounds = DEFAULT_STATE_BOUNDS): boolean => {
    return (
      x[StateIndex.Age] >= bounds.age[0] && x[StateIndex.Age] <= bounds.age[1] &&
      x[StateIndex.BioAge] >= bounds.bioAge[0] && x[StateIndex.BioAge] <= bounds.bioAge[1] &&
      x[StateIndex.HealthCapital] >= bounds.healthCapital[0] && x[StateIndex.HealthCapital] <= bounds.healthCapital[1] &&
      x[StateIndex.DamageLoad] >= bounds.damageLoad[0] && x[StateIndex.DamageLoad] <= bounds.damageLoad[1] &&
      x[StateIndex.InterventionCapacity] >= bounds.interventionCapacity[0] && x[StateIndex.InterventionCapacity] <= bounds.interventionCapacity[1]
    );
  },
};

/** OpenSpec integration types */
export interface AgingControlOpenSpec {
  module: 'aging-control';
  version: string;
  specVersion: '1.0.0';
  endpoints: {
    viability: { method: 'GET'; path: '/viability' };
    trajectory: { method: 'POST'; path: '/trajectory' };
    optimize: { method: 'POST'; path: '/optimize' };
    caseStudies: { method: 'GET'; path: '/case-studies' };
    cost: { method: 'POST'; path: '/cost' };
  };
  types: {
    ViabilitySet: ViabilitySet;
    ControlCost: ControlCost;
    Intervention: Intervention;
    CaseStudyResult: CaseStudyResult;
  };
}

/** Default export for convenience */
export const agingControlTypes = {
  DEFAULT_STATE_BOUNDS,
  INTERVENTION_IDS,
  CASE_STUDY_IDS,
  AGING_CONTROL_PRESETS,
  AGING_CONTROL_VALIDATORS,
  StateIndex,
};

/** Aging Control State Shape */
export interface AgingControlState {
  config: AgingControlConfig;
  interventions: Intervention[];
  selectedInterventionIds: InterventionId[];
  initialState: number[];
  trajectory: { state: number[]; controls: number[] }[] | null;
  optimalControls: number[][] | null;
  caseStudies: CaseStudyResult[] | null;
  lastCost: ControlCost | null;
  lifespanMetrics: LifespanMetrics | null;
}

/** Factory for initial aging control state */
export function makeAgingControlState(): AgingControlState {
  return {
    config: AGING_CONTROL_PRESETS.conservative,
    interventions: [],
    selectedInterventionIds: ['combo_standard'],
    initialState: [40, 38, 0.85, 10, 0.9],
    trajectory: null,
    optimalControls: null,
    caseStudies: null,
    lastCost: null,
    lifespanMetrics: null,
  };
}