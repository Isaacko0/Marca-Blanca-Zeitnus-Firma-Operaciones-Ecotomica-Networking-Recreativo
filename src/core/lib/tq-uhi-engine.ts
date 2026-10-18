// src/core/lib/tq-uhi-engine.ts
// UHI Simulator → TQ Parameter Mapping Engine
// Fase 1: Mapeo determinístico de 9 income streams UHI → 9 TQ DividendPolicies

import type {
  TQDividendPolicy,
  TQEquityAccount,
  TQShare,
  ProductiveAsset,
  OwnershipStructure,
  RegionalDividendFund,
  EquityPool,
  EquityPoolMember,
  EquityPoolGovernance,
  DividendCalculation,
  DividendDistribution,
  DividendExecutionResult,
  UHIParameters,
  UHIYearlyResult,
  UHIResult,
  ValidationResult,
} from './tq-types-extended';

// ============================================================================
// UHI PARAMETER TYPES (from UniversalHighIncome/simulations/uhi_simulator.jsx)
// ============================================================================

export interface UHIParameters {
  // Simulation horizon
  endYear: number;                    // default: 2060
  
  // Automation dynamics
  automationPace: number;             // %/yr, default: 2.5
  baseGdpGrowth: number;              // % real, default: 2.0
  
  // SWF (Sovereign Wealth Fund)
  swfSeed: number;                    // $B, default: 100
  swfContribRate: number;             // % GDP, default: 1.5
  swfReturnRate: number;              // % nominal, default: 7.0
  swfSpendRule: number;               // % balance/yr, default: 3.0
  
  // UBI (Universal Basic Income)
  ubiMonthly: number;                 // $/adult/mo, default: 2000
  ubiRampYears: number;               // years, default: 12
  
  // Baby Bonds
  babyBondSeed: number;               // $, default: 5000
  babyBondReturn: number;             // %/yr, default: 7.0
  babyBondMaturity: number;           // years, default: 18
  
  // ESOP / Cooperative
  esopGrowth: number;                 // %/yr coverage expansion, default: 7.0
  
  // Data / AI Royalty
  dataRoyaltyMax: number;             // $/HH at full automation, default: 12000
  
  // Carbon / Commons Dividend
  carbonBase: number;                 // $/HH/yr, default: 900
  carbonGrowth: number;               // %/yr, default: 4.0
  
  // Private Investment
  privateInvBase: number;             // $/HH/yr, default: 4185
  privateInvGrowth: number;           // %/yr, default: 3.5
  
  // Demonetization / Deflation Gain
  demonetRate: number;                // % max cost reduction, default: 35
  
  // Revenue Source Toggles
  enableVAT: boolean;                 // +0.15 revenue factor
  enableAutomationLevy: boolean;      // +0.10 revenue factor
  enableWealthTax: boolean;           // +0.08 revenue factor
  
  // Intervention Toggles
  enableSWF: boolean;
  enableUBI: boolean;
  enableBabyBonds: boolean;
  enableESOP: boolean;
  enableDataRoyalty: boolean;
  enableCarbon: boolean;
  enableDemonetization: boolean;
  
  // TQ-specific target mode
  targetMode: 'postmonetario' | 'conectado';
}

// ============================================================================
// UHI RESULT TYPES
// ============================================================================

export interface UHIYearlyResult {
  year: number;
  automationLevel: number;
  gdp: number;
  revenueFactor: number;
  
  // 9 Income Streams (nominal $)
  wages: number;
  socialInsurance: number;
  swfDividend: number;
  ubi: number;
  esop: number;
  babyBonds: number;
  dataRoyalty: number;
  carbonDividend: number;
  privateInvestment: number;
  demonetizationGain: number;
  
  nominalTotal: number;
  effectiveTotal: number;  // nominal + demonetizationGain
}

export interface UHIResult {
  parameters: UHIParameters;
  yearly: UHIYearlyResult[];
  summary: {
    medianHHIncome2060: number;
    medianHHIncome2060Effective: number;
    swfBalance2060: number;
    totalTQEquityGenerated: number;  // kWh/year capacity
    tqDividendPolicies: TQDividendPolicy[];
  };
}

// ============================================================================
// CONSTANTS (from UHI Simulator calibration)
// ============================================================================

const NUM_HH = 131_000_000;           // US households
const BASE_GDP = 29_000_000_000_000;  // $29T
const BASE_YEAR = 2025;
const BASE_MEDIAN = 83_730;           // 2024 real median HH income
const BASE_WAGE_INCOME = 68_660;      // 82% of median
const BASE_SOCIAL_INSURANCE = 10_885; // 13%
const BASE_PRIVATE_INVESTMENT = 4_185; // 5%

// ============================================================================
// UHI → TQ DIVIDEND POLICY MAPPING
// ============================================================================

/**
 * Maps UHI 9 income streams to TQ DividendPolicy configurations.
 * Each stream becomes a dividend policy with specific distribution rules.
 */
export function mapUHIParamsToTQDividendPolicies(uhi: UHIParameters): TQDividendPolicy[] {
  const policies: TQDividendPolicy[] = [];
  
  // Compute revenue factor (same as UHI simulator)
  const revenueFactor = computeRevenueFactor(uhi);
  
  // 1. SWF Dividend → RegionalDividendFund (Federal) + EquityPool (Federal)
  if (uhi.enableSWF) {
    policies.push({
      nodeId: 'federal',
      frequency: 'annual',
      distributionRule: 'pro-rata-equity',
      reserveRatio: 1 - (uhi.swfSpendRule / 100),  // spendRule = distribution, reserve = 1 - spend
      minDividendTQ: 0,
      maxDividendTQ: Infinity,
      // SWF specific params stored in metadata
      metadata: {
        streamType: 'swf',
        swfSeed: uhi.swfSeed * 1e9,
        swfContribRate: uhi.swfContribRate / 100,
        swfReturnRate: uhi.swfReturnRate / 100,
        swfSpendRule: uhi.swfSpendRule / 100,
      }
    });
  }
  
  // 2. UBI → Hybrid (50% per-capita, 50% pro-rata equity) → CommunityFund + RegionalDividendFund
  if (uhi.enableUBI) {
    policies.push({
      nodeId: 'federal',
      frequency: 'monthly',
      distributionRule: 'hybrid',  // 50% pro-rata equity, 50% per-capita
      reserveRatio: 0,
      minDividendTQ: uhi.ubiMonthly * 12 * 1.5 / 500,  // Convert $ to TQ via conversionFactor (approx)
      maxDividendTQ: Infinity,
      metadata: {
        streamType: 'ubi',
        ubiMonthly: uhi.ubiMonthly,
        ubiRampYears: uhi.ubiRampYears,
        adultsPerHH: 1.5,
      }
    });
  }
  
  // 3. ESOP / Cooperative → EquityPool (Cooperative)
  if (uhi.enableESOP) {
    policies.push({
      nodeId: 'cooperative-pool',
      frequency: 'annual',
      distributionRule: 'pro-rata-equity',
      reserveRatio: 0.20,  // 20% reinvestment
      minDividendTQ: 0,
      maxDividendTQ: 30_000 / 500,  // $30K cap → TQ
      metadata: {
        streamType: 'esop',
        esopGrowth: uhi.esopGrowth / 100,
        capPerHH: 30_000,
        rampYears: 5,
      }
    });
  }
  
  // 4. Baby Bonds → TQEquityAccount (Intergenerational, vesting)
  if (uhi.enableBabyBonds) {
    policies.push({
      nodeId: 'federal',
      frequency: 'annual',
      distributionRule: 'pro-rata-equity',  // Only for matured cohorts
      reserveRatio: 0,
      minDividendTQ: 0,
      maxDividendTQ: Infinity,
      metadata: {
        streamType: 'babyBonds',
        babyBondSeed: uhi.babyBondSeed,
        babyBondReturn: uhi.babyBondReturn / 100,
        babyBondMaturity: uhi.babyBondMaturity,
        cohortRampYears: 25,
      }
    });
  }
  
  // 5. Data / AI Royalty → ProductiveAsset (type: 'data') + EquityPool (Commons)
  if (uhi.enableDataRoyalty) {
    policies.push({
      nodeId: 'data-commons-pool',
      frequency: 'annual',
      distributionRule: 'per-capita',  // Data royalty = per capita
      reserveRatio: 0,
      minDividendTQ: 0,
      maxDividendTQ: uhi.dataRoyaltyMax / 500,  // Convert to TQ
      metadata: {
        streamType: 'dataRoyalty',
        dataRoyaltyMax: uhi.dataRoyaltyMax,
        rampYears: 8,
        gdpElasticity: 0.4,
      }
    });
  }
  
  // 6. Carbon / Commons Dividend → ProductiveAsset (type: 'forest'|'water'|'spectrum') + RegionalDividendFund
  if (uhi.enableCarbon) {
    policies.push({
      nodeId: 'commons-pool',
      frequency: 'annual',
      distributionRule: 'per-capita',
      reserveRatio: 0,
      minDividendTQ: 0,
      maxDividendTQ: Infinity,
      metadata: {
        streamType: 'carbon',
        carbonBase: uhi.carbonBase,
        carbonGrowth: uhi.carbonGrowth / 100,
        rampYears: 3,
      }
    });
  }
  
  // 7. Private Investment → TQEquityAccount (Personal shares)
  policies.push({
    nodeId: 'personal',
    frequency: 'annual',
    distributionRule: 'pro-rata-equity',
    reserveRatio: 0,
    minDividendTQ: 0,
    maxDividendTQ: Infinity,
    metadata: {
      streamType: 'privateInvestment',
      privateInvBase: uhi.privateInvBase,
      privateInvGrowth: uhi.privateInvGrowth / 100,
      gdpElasticity: 0.2,
    }
  });
  
  // 8. Social Insurance → CommunityFund (Always-on baseline)
  policies.push({
    nodeId: 'community-fund',
    frequency: 'annual',
    distributionRule: 'per-capita',
    reserveRatio: 0,
    minDividendTQ: BASE_SOCIAL_INSURANCE / 500,
    maxDividendTQ: Infinity,
    metadata: {
      streamType: 'socialInsurance',
      gdpElasticity: 0.25,
      timeTrend: 0.005,
    }
  });
  
  // 9. Demonetization → ConversionFactor adjustment (not a dividend stream per se)
  // Handled separately in conversionFactor dynamics
  
  return policies;
}

// ============================================================================
// REVENUE FACTOR COMPUTATION (UHI Simulator §7.3)
// ============================================================================

export function computeRevenueFactor(uhi: UHIParameters): number {
  let factor = 0.60;  // baseline (existing tax base)
  if (uhi.enableVAT) factor += 0.15;
  if (uhi.enableAutomationLevy) factor += 0.10;
  if (uhi.enableWealthTax) factor += 0.08;
  return Math.min(1.0, factor);
}

// ============================================================================
// AUTOMATION LEVEL DYNAMICS (UHI Simulator §7.1)
// ============================================================================

export function computeAutomationLevel(year: number, pace: number): number {
  let level = 0.05;  // 5% in 2025
  for (let y = BASE_YEAR; y < year; y++) {
    level = Math.min(0.95, level + (pace / 100) * (1 + level) * (1 - level));
  }
  return level;
}

export function computeAutoFromBase(automationLevel: number): number {
  return Math.max(0, (automationLevel - 0.05) / 0.95);
}

// ============================================================================
// GDP GROWTH (UHI Simulator §7.2)
// ============================================================================

export function computeGDP(year: number, baseGdpGrowth: number, automationPace: number): number {
  let gdp = BASE_GDP;
  for (let y = BASE_YEAR; y <= year; y++) {
    const autoLevel = computeAutomationLevel(y, automationPace);
    gdp *= (1 + baseGdpGrowth / 100 + autoLevel * 0.025);
  }
  return gdp;
}

// ============================================================================
// 9 INCOME STREAM COMPUTATIONS (UHI Simulator §7.4-7.13)
// ============================================================================

// SWF State for stateful accumulation across years
interface SWFState {
  balance: number;
  lastYear: number;
}

export function computeWages(autoFromBase: number): number {
  const wageMultiplier = Math.max(0.04, 1 - autoFromBase * 0.96);
  const productivityPremium = 1 + autoFromBase * 0.3;
  return Math.max(3000, BASE_WAGE_INCOME * wageMultiplier * productivityPremium);
}

export function computeSocialInsurance(gdp: number, year: number): number {
  return BASE_SOCIAL_INSURANCE * Math.pow(gdp / BASE_GDP, 0.25) * (1 + (year - BASE_YEAR) * 0.005);
}

export function computeSWFDividend(
  year: number,
  gdp: number,
  revenueFactor: number,
  swf: UHIParameters['swfSeed'] & UHIParameters['swfContribRate'] & UHIParameters['swfReturnRate'] & UHIParameters['swfSpendRule'],
  state: SWFState
): { dividend: number; balance: number } {
  // Initialize on first year
  if (year === BASE_YEAR) {
    state.balance = swf.swfSeed * 1e9;
    state.lastYear = year;
  }
  
  // Apply returns since last year
  const yearsElapsed = year - state.lastYear;
  if (yearsElapsed > 0) {
    state.balance *= Math.pow(1 + swf.swfReturnRate / 100, yearsElapsed);
  }
  
  // Add contribution
  const contribution = (swf.swfContribRate / 100) * gdp * revenueFactor;
  state.balance += contribution;
  
  // Distribute
  const distribution = state.balance * (swf.swfSpendRule / 100);
  state.balance -= distribution;
  
  state.lastYear = year;
  
  return {
    dividend: distribution / NUM_HH,
    balance: state.balance,
  };
}

export function computeUBI(year: number, revenueFactor: number, ubi: UHIParameters['ubiMonthly'] & UHIParameters['ubiRampYears']): number {
  const ramp = Math.min(1, (year - BASE_YEAR) / ubi.ubiRampYears);
  return ubi.ubiMonthly * 12 * 1.5 * ramp * revenueFactor;
}

export function computeESOP(year: number, gdp: number, esopGrowth: number): number {
  const ramp = Math.min(1, (year - BASE_YEAR) / 5);
  return Math.min(30000, 800 * Math.pow(1 + esopGrowth, year - BASE_YEAR) * Math.pow(gdp / BASE_GDP, 0.3) * ramp);
}

export function computeBabyBonds(year: number, babyBond: UHIParameters['babyBondSeed'] & UHIParameters['babyBondReturn'] & UHIParameters['babyBondMaturity']): number {
  if (year < BASE_YEAR + babyBond.babyBondMaturity) return 0;
  const maturedValue = babyBond.babyBondSeed * Math.pow(1 + babyBond.babyBondReturn, babyBond.babyBondMaturity);
  const cohortFraction = Math.min(1, (year - (BASE_YEAR + babyBond.babyBondMaturity)) / 25);
  return maturedValue * babyBond.babyBondReturn * cohortFraction;
}

export function computeDataRoyalty(
  year: number,
  gdp: number,
  automationLevel: number,
  revenueFactor: number,
  dataRoyaltyMax: number
): number {
  const ramp = Math.min(1, (year - BASE_YEAR) / 8);
  const autoFromBase = computeAutoFromBase(automationLevel);
  return dataRoyaltyMax * autoFromBase * Math.pow(gdp / BASE_GDP, 0.4) * revenueFactor * ramp;
}

export function computeCarbonDividend(year: number, carbonBase: number, carbonGrowth: number): number {
  const ramp = Math.min(1, (year - BASE_YEAR) / 3);
  return carbonBase * Math.pow(1 + carbonGrowth, year - BASE_YEAR) * ramp;
}

export function computePrivateInvestment(year: number, gdp: number, privateInv: UHIParameters['privateInvBase'] & UHIParameters['privateInvGrowth']): number {
  return privateInv.privateInvBase * Math.pow(1 + privateInv.privateInvGrowth, year - BASE_YEAR) * Math.pow(gdp / BASE_GDP, 0.2);
}

export function computeDemonetizationGain(nominalTotal: number, autoFromBase: number, demonetRate: number): number {
  const costReduction = (demonetRate / 100) * autoFromBase;
  if (costReduction <= 0 || costReduction >= 1) return 0;
  const purchasingPowerMultiplier = 1 / (1 - costReduction);
  return nominalTotal * (purchasingPowerMultiplier - 1);
}

// ============================================================================
// MAIN SIMULATION ENGINE
// ============================================================================

export function simulateUHI(params: UHIParameters): UHIResult {
  const yearly: UHIYearlyResult[] = [];
  const swfState: SWFState = { balance: 0, lastYear: BASE_YEAR };
  
  for (let year = BASE_YEAR; year <= params.endYear; year++) {
    const automationLevel = computeAutomationLevel(year, params.automationPace);
    const autoFromBase = computeAutoFromBase(automationLevel);
    const gdp = computeGDP(year, params.baseGdpGrowth, params.automationPace);
    const revenueFactor = computeRevenueFactor(params);
    
    // Compute each stream
    const wages = computeWages(autoFromBase);
    const socialInsurance = computeSocialInsurance(gdp, year);
    const swf = computeSWFDividend(year, gdp, revenueFactor, {
      swfSeed: params.swfSeed,
      swfContribRate: params.swfContribRate,
      swfReturnRate: params.swfReturnRate,
      swfSpendRule: params.swfSpendRule,
    }, swfState);
    
    const ubi = params.enableUBI ? computeUBI(year, revenueFactor, {
      ubiMonthly: params.ubiMonthly,
      ubiRampYears: params.ubiRampYears,
    }) : 0;
    
    const esop = params.enableESOP ? computeESOP(year, gdp, params.esopGrowth / 100) : 0;
    const babyBonds = params.enableBabyBonds ? computeBabyBonds(year, {
      babyBondSeed: params.babyBondSeed,
      babyBondReturn: params.babyBondReturn / 100,
      babyBondMaturity: params.babyBondMaturity,
    }) : 0;
    
    const dataRoyalty = params.enableDataRoyalty ? computeDataRoyalty(
      year, gdp, automationLevel, revenueFactor, params.dataRoyaltyMax
    ) : 0;
    
    const carbonDividend = params.enableCarbon ? computeCarbonDividend(year, params.carbonBase, params.carbonGrowth / 100) : 0;
    const privateInvestment = computePrivateInvestment(year, gdp, {
      privateInvBase: params.privateInvBase,
      privateInvGrowth: params.privateInvGrowth / 100,
    });
    
    const nominalTotal = wages + socialInsurance + swf.dividend + ubi + esop + babyBonds + dataRoyalty + carbonDividend + privateInvestment;
    
    const demonetizationGain = params.enableDemonetization ? computeDemonetizationGain(nominalTotal, autoFromBase, params.demonetRate) : 0;
    const effectiveTotal = nominalTotal + demonetizationGain;
    
    yearly.push({
      year,
      automationLevel,
      gdp,
      revenueFactor,
      wages,
      socialInsurance,
      swfDividend: swf.dividend,
      ubi,
      esop,
      babyBonds,
      dataRoyalty,
      carbonDividend,
      privateInvestment,
      demonetizationGain,
      nominalTotal,
      effectiveTotal,
    });
  }
  
  // Generate TQ DividendPolicies
  const tqDividendPolicies = mapUHIParamsToTQDividendPolicies(params);
  
  // Estimate total TQ equity capacity generated (kWh/year)
  const finalYear = yearly[yearly.length - 1];
  const totalTQEquityGenerated = estimateTQEquityCapacity(finalYear, params);
  
  return {
    parameters: params,
    yearly,
    summary: {
      medianHHIncome2060: yearly.find(y => y.year === 2060)?.nominalTotal ?? 0,
      medianHHIncome2060Effective: yearly.find(y => y.year === 2060)?.effectiveTotal ?? 0,
      swfBalance2060: swfState.balance,
      totalTQEquityGenerated,
      tqDividendPolicies,
    },
  };
}

function estimateTQEquityCapacity(finalYear: UHIYearlyResult, params: UHIParameters): number {
  // Convert capital income streams to TQ equity capacity (kWh/year)
  // Using conversionFactor: 500 TQ = 1 canasta básica ≈ $10,000 MXN (example)
  // 1 TQ = 1 kWh, so equity kWh = TQ amount
  const conversionRate = 500 / 10000;  // TQ per $ (Mexico example)
  
  const capitalIncome = finalYear.swfDividend + finalYear.esop + finalYear.babyBonds + 
                        finalYear.dataRoyalty + finalYear.carbonDividend + finalYear.privateInvestment;
  
  return capitalIncome * conversionRate;  // kWh/year capacity
}

// ============================================================================
// PRESET SCENARIOS (UHI Simulator §9)
// ============================================================================

export const UHI_PRESETS: Record<string, Partial<UHIParameters>> = {
  proactive: {
    // All interventions enabled, all revenue sources enabled
    endYear: 2060,
    automationPace: 2.5,
    baseGdpGrowth: 2.0,
    swfSeed: 100,
    swfContribRate: 1.5,
    swfReturnRate: 7.0,
    swfSpendRule: 3.0,
    ubiMonthly: 2000,
    ubiRampYears: 12,
    babyBondSeed: 5000,
    babyBondReturn: 7.0,
    babyBondMaturity: 18,
    esopGrowth: 7.0,
    dataRoyaltyMax: 12000,
    carbonBase: 900,
    carbonGrowth: 4.0,
    privateInvBase: 4185,
    privateInvGrowth: 3.5,
    demonetRate: 35,
    enableVAT: true,
    enableAutomationLevy: true,
    enableWealthTax: true,
    enableSWF: true,
    enableUBI: true,
    enableBabyBonds: true,
    enableESOP: true,
    enableDataRoyalty: true,
    enableCarbon: true,
    enableDemonetization: true,
    targetMode: 'conectado',
  },
  
  reactive: {
    ...{} as Partial<UHIParameters>,
    endYear: 2060,
    automationPace: 2.5,
    baseGdpGrowth: 2.0,
    swfSeed: 0,
    swfContribRate: 0.8,
    swfReturnRate: 7.0,
    swfSpendRule: 3.0,
    ubiMonthly: 2000,
    ubiRampYears: 18,
    babyBondSeed: 2000,
    babyBondReturn: 7.0,
    babyBondMaturity: 18,
    esopGrowth: 7.0,
    dataRoyaltyMax: 12000,
    carbonBase: 900,
    carbonGrowth: 4.0,
    privateInvBase: 4185,
    privateInvGrowth: 3.5,
    demonetRate: 35,
    enableVAT: true,
    enableAutomationLevy: true,
    enableWealthTax: true,
    enableSWF: true,
    enableUBI: true,
    enableBabyBonds: true,
    enableESOP: true,
    enableDataRoyalty: true,
    enableCarbon: true,
    enableDemonetization: true,
    targetMode: 'conectado',
  },
  
  delayed: {
    ...{} as Partial<UHIParameters>,
    endYear: 2060,
    automationPace: 2.5,
    baseGdpGrowth: 2.0,
    swfSeed: 0,
    swfContribRate: 0,
    swfReturnRate: 7.0,
    swfSpendRule: 3.0,
    ubiMonthly: 2000,
    ubiRampYears: 22,
    babyBondSeed: 0,
    babyBondReturn: 7.0,
    babyBondMaturity: 18,
    esopGrowth: 0,
    dataRoyaltyMax: 0,
    carbonBase: 900,
    carbonGrowth: 4.0,
    privateInvBase: 4185,
    privateInvGrowth: 3.5,
    demonetRate: 0,
    enableVAT: false,
    enableAutomationLevy: false,
    enableWealthTax: false,
    enableSWF: false,
    enableUBI: true,
    enableBabyBonds: false,
    enableESOP: false,
    enableDataRoyalty: false,
    enableCarbon: true,
    enableDemonetization: false,
    targetMode: 'conectado',
  },
  
  noAction: {
    ...{} as Partial<UHIParameters>,
    endYear: 2060,
    automationPace: 2.5,
    baseGdpGrowth: 2.0,
    swfSeed: 0,
    swfContribRate: 0,
    swfReturnRate: 7.0,
    swfSpendRule: 3.0,
    ubiMonthly: 0,
    ubiRampYears: 0,
    babyBondSeed: 0,
    babyBondReturn: 7.0,
    babyBondMaturity: 18,
    esopGrowth: 0,
    dataRoyaltyMax: 0,
    carbonBase: 0,
    carbonGrowth: 0,
    privateInvBase: 4185,
    privateInvGrowth: 3.5,
    demonetRate: 0,
    enableVAT: false,
    enableAutomationLevy: false,
    enableWealthTax: false,
    enableSWF: false,
    enableUBI: false,
    enableBabyBonds: false,
    enableESOP: false,
    enableDataRoyalty: false,
    enableCarbon: false,
    enableDemonetization: false,
    targetMode: 'postmonetario',
  },
};

export function createUHIParams(preset: keyof typeof UHI_PRESETS, overrides: Partial<UHIParameters> = {}): UHIParameters {
  const base = UHI_PRESETS[preset] as UHIParameters;
  return { ...base, ...overrides };
}

// ============================================================================
// VALIDATION: Compare with UHI Simulator documented outputs
// ============================================================================

export interface ValidationResult {
  preset: string;
  median2060Nominal: number;
  median2060Effective: number;
  expectedNominal: number;      // From UHI Simulator docs
  expectedEffective: number;
  nominalDiffPct: number;
  effectiveDiffPct: number;
  passed: boolean;
}

export function validateAgainstUHISimulator(): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // UHI Simulator documented outputs (from simulations/README.md §15):
  const expected: Record<string, { nominal: number; effective: number }> = {
    proactive: { nominal: 142_577, effective: 142_577 * 1.35 },  // ~$142K moderate scenario
    reactive: { nominal: 95_000, effective: 95_000 * 1.25 },
    delayed: { nominal: 55_000, effective: 55_000 },
    noAction: { nominal: 28_000, effective: 28_000 },
  };
  
  for (const preset of ['proactive', 'reactive', 'delayed', 'noAction'] as const) {
    const params = createUHIParams(preset);
    const result = simulateUHI(params);
    const exp = expected[preset];
    
    const nominalDiffPct = Math.abs((result.summary.medianHHIncome2060 - exp.nominal) / exp.nominal) * 100;
    const effectiveDiffPct = Math.abs((result.summary.medianHHIncome2060Effective - exp.effective) / exp.effective) * 100;
    
    results.push({
      preset,
      median2060Nominal: result.summary.medianHHIncome2060,
      median2060Effective: result.summary.medianHHIncome2060Effective,
      expectedNominal: exp.nominal,
      expectedEffective: exp.effective,
      nominalDiffPct,
      effectiveDiffPct,
      passed: nominalDiffPct <= 5 && effectiveDiffPct <= 5,  // ±5% tolerance
    });
  }
  
  return results;
}