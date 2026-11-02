/**
 * Renta Básica Exponencial (RBE) — Types
 * HSCSG v15 OS — Type definitions for RBE module
 * Re-exports from lib/rbe.ts (no duplication)
 */

import type {
  RBEConfig,
  RBEState,
  LayerAState,
  LayerBState,
  LayerCState,
  LayerDState,
  LayerEState,
  ThreeBudgetsState,
  BudgetState,
  BudgetTransaction,
  GrowthState,
  GrowthHistoryEntry,
  TQState,
  DemurrageEntry,
  TQTransaction,
  ICEEntry,
  CapacityContribution,
  VerifiedContribution,
  GovernanceActivity,
  InnovationProject,
  GrowthConfig,
  TQConfig,
  DividendBreakdown,
} from './rbe';

/** Re-export all core types */
export type {
  RBEConfig,
  RBEState,
  LayerAState,
  LayerBState,
  LayerCState,
  LayerDState,
  LayerEState,
  ThreeBudgetsState,
  BudgetState,
  BudgetTransaction,
  GrowthState,
  GrowthHistoryEntry,
  TQState,
  DemurrageEntry,
  TQTransaction,
  ICEEntry,
  CapacityContribution,
  VerifiedContribution,
  GovernanceActivity,
  InnovationProject,
  GrowthConfig,
  TQConfig,
  DividendBreakdown,
};

/** Amphibious mode type */
export type RBEMode = 'postmonetario' | 'conectado';

/** Layer identifiers */
export type LayerId = 'A' | 'B' | 'C' | 'D' | 'E';

/** Budget identifiers */
export type BudgetId = 'monetary' | 'real' | 'ecological';

/** Contribution types */
export type CapacityContributionType = 'ecological' | 'energy' | 'productive' | 'cooperative' | 'knowledge';
export type VerifiedContributionType = 'labor' | 'capital' | 'knowledge' | 'care' | 'governance';
export type GovernanceActivityType = 'vote' | 'proposal' | 'jury' | 'delegation' | 'audit';
export type InnovationProjectStatus = 'proposed' | 'funded' | 'active' | 'completed' | 'failed';

/** Transaction types */
export type TQTransactionType = 'transfer' | 'payout' | 'demurrage' | 'mint' | 'burn';

/** Default config (re-export for convenience) */
export const DEFAULT_RBE_CONFIG = {
  mode: 'postmonetario' as RBEMode,
  priceParity: 100,
  growth: {
    baseRate: 0.05,
    maxRate: 0.20,
    minRate: 0.01,
    capacityThreshold: 0.6,
  },
  tq: {
    initialBalance: 1000,
    demurrageThreshold: 30,
    demurrageRate: 0.05,
    iceCatalog: true,
    nfcOffline: true,
  },
  validation: 'strict' as const,
};

/** Default initial state (re-export for convenience) */
export const INITIAL_RBE_STATE = {
  layerA: {
    floor: 100,
    eligibility: 'all_verified_humans' as const,
    frequency: 'monthly' as const,
    lastPayout: 0,
    distributed: 0,
  },
  layerB: {
    baseAmount: 50,
    capacityMultiplier: 1.0,
    capacityIndex: 0.5,
    contributions: [] as CapacityContribution[],
    lastCalculation: 0,
  },
  layerC: {
    baseAmount: 30,
    contributionIndex: 0,
    contributions: [] as VerifiedContribution[],
    minThreshold: 10,
  },
  layerD: {
    baseAmount: 20,
    participationScore: 0,
    activities: [] as GovernanceActivity[],
    minParticipation: 5,
  },
  layerE: {
    pool: 1000,
    projects: [] as InnovationProject[],
    allocation: 'hybrid' as const,
  },
  budgets: {
    monetary: { allocated: 0, spent: 0, remaining: 0, unit: 'ZNU' as const, transactions: [] as BudgetTransaction[] },
    real: { allocated: 0, spent: 0, remaining: 0, unit: 'kWh' as const, transactions: [] as BudgetTransaction[] },
    ecological: { allocated: 0, spent: 0, remaining: 0, unit: 'kgCO2' as const, transactions: [] as BudgetTransaction[] },
  },
  growth: {
    currentRate: 0.05,
    targetRate: 0.05,
    capacityIndex: 0.5,
    verified: false,
    lastAdjustment: 0,
    history: [] as GrowthHistoryEntry[],
  },
  tq: {
    balances: new Map<string, number>(),
    demurrageSchedule: [] as DemurrageEntry[],
    transactions: [] as TQTransaction[],
    iceCache: new Map<string, ICEEntry>(),
  },
};

/** Configuration presets */
export const RBE_PRESETS: Record<string, RBEConfig> = {
  conservative: {
    mode: 'postmonetario',
    priceParity: 100,
    growth: { baseRate: 0.03, maxRate: 0.10, minRate: 0.01, capacityThreshold: 0.7 },
    tq: { initialBalance: 500, demurrageThreshold: 30, demurrageRate: 0.03, iceCatalog: true, nfcOffline: true },
    validation: 'strict',
  },
  standard: {
    mode: 'postmonetario',
    priceParity: 100,
    growth: { baseRate: 0.05, maxRate: 0.20, minRate: 0.01, capacityThreshold: 0.6 },
    tq: { initialBalance: 1000, demurrageThreshold: 30, demurrageRate: 0.05, iceCatalog: true, nfcOffline: true },
    validation: 'strict',
  },
  aggressive: {
    mode: 'postmonetario',
    priceParity: 100,
    growth: { baseRate: 0.08, maxRate: 0.30, minRate: 0.02, capacityThreshold: 0.5 },
    tq: { initialBalance: 2000, demurrageThreshold: 60, demurrageRate: 0.08, iceCatalog: true, nfcOffline: true },
    validation: 'lenient',
  },
  conectado: {
    mode: 'conectado',
    priceParity: 100,
    growth: { baseRate: 0.05, maxRate: 0.20, minRate: 0.01, capacityThreshold: 0.6 },
    tq: { initialBalance: 1000, demurrageThreshold: 30, demurrageRate: 0.05, iceCatalog: true, nfcOffline: false },
    validation: 'strict',
  },
};

/** Validation schemas */
export const RBE_VALIDATORS = {
  isValidDividendBreakdown: (b: DividendBreakdown): boolean =>
    b.A >= 0 && b.B >= 0 && b.C >= 0 && b.D >= 0 && b.E >= 0,
  isValidCapacityIndex: (idx: number): boolean => idx >= 0 && idx <= 1,
  isValidGrowthRate: (rate: number): boolean => rate >= 0 && rate <= 1,
  isValidBudgetState: (budget: BudgetState): boolean =>
    budget.allocated >= 0 && budget.spent >= 0 && budget.remaining >= 0,
  isValidTQBalance: (balance: number): boolean => balance >= 0,
};

/** OpenSpec integration types */
export interface RBEOpenSpec {
  module: 'rbe';
  version: string;
  specVersion: '1.0.0';
  endpoints: {
    dividend: { method: 'GET'; path: '/dividend/{memberId}' };
    monthlyPayout: { method: 'POST'; path: '/payout/monthly' };
    growthUpdate: { method: 'POST'; path: '/growth/update' };
    layerBContribution: { method: 'POST'; path: '/layer/B/contribution' };
    layerCContribution: { method: 'POST'; path: '/layer/C/contribution' };
    layerDActivity: { method: 'POST'; path: '/layer/D/activity' };
    layerEProject: { method: 'POST'; path: '/layer/E/project' };
    layerEFund: { method: 'POST'; path: '/layer/E/fund' };
    budgetsTransfer: { method: 'POST'; path: '/budgets/transfer' };
    tqDemurrage: { method: 'POST'; path: '/tq/demurrage' };
    tqBalance: { method: 'GET'; path: '/tq/balance/{memberId}' };
    convert: { method: 'POST'; path: '/convert' };
  };
  types: {
    RBEState: RBEState;
    DividendBreakdown: DividendBreakdown;
    CapacityContribution: CapacityContribution;
    VerifiedContribution: VerifiedContribution;
    GovernanceActivity: GovernanceActivity;
    InnovationProject: InnovationProject;
    GrowthState: GrowthState;
    TQState: TQState;
    ThreeBudgetsState: ThreeBudgetsState;
  };
}

/** Default export for convenience */
export const rbeTypes = {
  DEFAULT_RBE_CONFIG,
  INITIAL_RBE_STATE,
  RBE_PRESETS,
  RBE_VALIDATORS,
};