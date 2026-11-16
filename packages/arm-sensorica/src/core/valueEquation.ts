// arm-sensorica/src/core/valueEquation.ts - Dual-mode Value Equation
import { 
  ValueEquationConfig, 
  ValueEquationDualConfig,
  Contribution, 
  DualValue, 
  MonetaryMode, 
  AffiliateDistribution, 
  DistributionResult,
  AuditEntry,
  DualValuationRule,
  ValuationFormula,
  DualDistributionConfig,
  PriceParityOracle,
  ContributionType,
  Weight
} from '../types';

import { evaluateValuationFormula, generateAuditTrail, generateId, now } from '../utils';

// ============================================
// DUAL-MODE DISTRIBUTION EXECUTION
// ============================================

export interface DistributionExecutionResult {
  distributions: AffiliateDistribution[];
  totalDistributed: DualValue;
  auditTrail: AuditEntry[];
}

export function executeDistributionDual(
  config: ValueEquationDualConfig,
  contributions: Contribution[],
  revenue: DualValue,
  mode: MonetaryMode = config.monetaryMode
): DistributionExecutionResult {
  
  // Validate contributions have valuation rules
  for (const c of contributions) {
    if (!config.contributionValuation.has(c.type)) {
      throw new Error(`No valuation rule for contribution type: ${c.type}`);
    }
  }
  
  // Calculate scores per contribution using mode-specific formula
  const scored = contributions.map(c => {
    const rule = config.contributionValuation.get(c.type)!;
    const formula = mode === 'postmonetario' ? rule.postmonetario : rule.conectado;
    const score = evaluateValuationFormula(formula, c.quantity.value);
    return { contribution: c, score };
  });
  
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  if (totalScore === 0) throw new Error('Total contribution score is zero');
  
  // Apply reserve percentage
  const revenueAmount = revenue[mode];
  const reserveAmount = (revenueAmount * config.reservePercentage.value) / 100n;
  const distributableAmount = revenueAmount - reserveAmount;
  
  // Calculate proportional distributions
  const distributions: AffiliateDistribution[] = scored.map(s => {
    const share = (distributableAmount * s.score) / totalScore;
    return {
      affiliateId: s.contribution.affiliateId,
      amount: { 
        postmonetario: mode === 'postmonetario' ? share : 0n, 
        conectado: mode === 'conectado' ? share : 0n 
      },
      contributionScore: s.score,
      contributions: [s.contribution.id]
    };
  });
  
  // Combine distributions for same affiliate
  const combined = combineDistributions(distributions);
  
  const auditTrail = generateAuditTrail(
    scored.map(s => s.contribution), 
    scored.map(s => s.score), 
    combined
  );
  
  return {
    distributions: combined,
    totalDistributed: { 
      postmonetario: mode === 'postmonetario' ? distributableAmount : 0n, 
      conectado: mode === 'conectado' ? distributableAmount : 0n 
    },
    auditTrail
  };
}

function combineDistributions(dists: AffiliateDistribution[]): AffiliateDistribution[] {
  const map = new Map<string, AffiliateDistribution>();
  
  for (const d of dists) {
    const existing = map.get(d.affiliateId);
    if (existing) {
      map.set(d.affiliateId, {
        ...existing,
        amount: {
          postmonetario: existing.amount.postmonetario + d.amount.postmonetario,
          conectado: existing.amount.conectado + d.amount.conectado
        },
        contributionScore: existing.contributionScore + d.contributionScore,
        contributions: [...existing.contributions, ...d.contributions]
      });
    } else {
      map.set(d.affiliateId, { ...d });
    }
  }
  
  return Array.from(map.values());
}

// ============================================
// VALUE EQUATION CONFIGURATION HELPERS
// ============================================

export function createDefaultValueEquationConfig(
  projectId: string,
  mode: MonetaryMode = 'postmonetario',
  priceOracle?: PriceParityOracle
): ValueEquationConfig {
  
  return {
    projectId: projectId as any,
    contributionWeights: new Map([
      ['time', { value: 1.0, description: 'Hour of work' }],
      ['materials', { value: 0.8, description: 'Materials provided' }],
      ['capital', { value: 1.2, description: 'Financial capital invested' }],
      ['knowledge', { value: 1.0, description: 'Knowledge/IP contributed' }],
      ['space', { value: 0.9, description: 'Physical space provided' }]
    ]),
    distributionFormula: { type: 'proportional' },
    reservePercentage: { value: 10 },
    exchangeFirmConfig: {
      exchangeFirmId: '' as any,
      revenueSplit: { value: 80 },
      complianceRequirements: ['KYC', 'AML'],
      reportingPeriod: { value: 30 * 24 * 60 * 60 * 1000 } // 30 days
    },
    monetaryMode: mode,
    priceOracle,
    contributionValuation: createDefaultDualValuation(),
    distributionOutput: createDefaultDualDistributionOutput()
  };
}

function createDefaultDualValuation(): Map<ContributionType, DualValuationRule> {
  const map = new Map<ContributionType, DualValuationRule>();
  
  map.set('time', {
    postmonetario: { type: 'linear', multiplier: 1 },
    conectado: { type: 'linear', multiplier: 25 } // $25/hour baseline
  });
  
  map.set('materials', {
    postmonetario: { type: 'linear', multiplier: 0.8 },
    conectado: { type: 'linear', multiplier: 1 } // $1 per unit value
  });
  
  map.set('capital', {
    postmonetario: { type: 'linear', multiplier: 1.2 },
    conectado: { type: 'linear', multiplier: 1.1 } // 10% return
  });
  
  map.set('knowledge', {
    postmonetario: { type: 'linear', multiplier: 1 },
    conectado: { type: 'linear', multiplier: 50 } // $50 per knowledge unit
  });
  
  map.set('space', {
    postmonetario: { type: 'linear', multiplier: 0.9 },
    conectado: { type: 'linear', multiplier: 15 } // $15 per space unit
  });
  
  return map;
}

function createDefaultDualDistributionOutput(): DualDistributionConfig {
  return {
    postmonetario: {
      unit: 'ZNU',
      format: (amount: bigint) => `${amount} ZNU`
    },
    conectado: {
      unit: 'USD',
      format: (amount: bigint) => `$${(Number(amount) / 100).toFixed(2)}`,
      oracle: {
        getRate: async () => 1.0, // 1 ZNU = 1 USD placeholder
        lastUpdate: { value: Date.now(), timezone: 'UTC' },
        source: 'placeholder'
      }
    }
  };
}

// ============================================
// VALUATION FORMULA EVALUATION
// ============================================

export function evaluateValuationFormula(formula: ValuationFormula, quantity: bigint): number {
  const q = Number(quantity);
  
  switch (formula.type) {
    case 'linear':
      return q * formula.multiplier;
      
    case 'logarithmic':
      return Math.log(q + 1) / Math.log(formula.base) * formula.multiplier;
      
    case 'step':
      for (const threshold of formula.thresholds) {
        if (q >= threshold.min) return threshold.value;
      }
      return 0;
      
    case 'custom':
      // Would call registered function from registry
      return q; // placeholder
      
    default:
      return q;
  }
}

// ============================================
// CONFIGURATION VALIDATION
// ============================================

export function validateValueEquationConfig(config: ValueEquationConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check all contribution types have valuation rules
  for (const type of ['time', 'materials', 'capital', 'knowledge', 'space'] as const) {
    if (!config.contributionValuation.has(type)) {
      warnings.push(`No valuation rule for ${type}, will use default`);
    }
  }
  
  // Check weights are non-negative
  for (const [type, weight] of config.contributionWeights) {
    if (weight.value < 0) {
      errors.push(`Weight for ${type} cannot be negative`);
    }
  }
  
  // Check reserve percentage
  if (config.reservePercentage.value < 0 || config.reservePercentage.value > 100) {
    errors.push('Reserve percentage must be 0-100');
  }
  
  // Check price oracle for conectado mode
  if (config.monetaryMode === 'conectado' && !config.priceOracle) {
    errors.push('Price oracle required for conectado mode');
  }
  
  // Check distribution formula validity
  if (config.distributionFormula.type === 'logarithmic' && config.distributionFormula.parameters) {
    if (config.distributionFormula.parameters.base <= 1) {
      errors.push('Logarithmic base must be > 1');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================
// MODE SWITCHING (Anfibio)
// ============================================

export function switchMonetaryMode(
  config: ValueEquationConfig, 
  newMode: MonetaryMode,
  priceOracle?: PriceParityOracle
): ValueEquationConfig {
  
  if (newMode === 'conectado' && !priceOracle && !config.priceOracle) {
    throw new Error('Price oracle required for conectado mode');
  }
  
  return {
    ...config,
    monetaryMode: newMode,
    priceOracle: priceOracle || config.priceOracle,
    // Valuation rules already dual-mode, no change needed
  };
}

export function getActiveValuationRules(config: ValueEquationConfig): Map<ContributionType, ValuationFormula> {
  const mode = config.monetaryMode;
  const activeRules = new Map<ContributionType, ValuationFormula>();
  
  for (const [type, rule] of config.contributionValuation) {
    activeRules.set(type, mode === 'postmonetario' ? rule.postmonetario : rule.conectado);
  }
  
  return activeRules;
}

// ============================================
// EXPORT ALL
// ============================================

export * from '../types';
export { evaluateValuationFormula } from '../utils';