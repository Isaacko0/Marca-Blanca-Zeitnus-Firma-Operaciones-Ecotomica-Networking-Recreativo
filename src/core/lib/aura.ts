// Aura Protocol — Core Types & Scoring (HSCSG v15 OS / ALRAC)
// Pure logic, offline-first, amphibious (Triaxial/TypeSafe)

import type { EVState } from '@core/state/ev';
import type { CredibilityState } from '@core/lib/symbiosky';
import type { AppState } from '@core/state/store';

// ============================================================================
// AURA COMPONENTS & SCORE
// ============================================================================

export interface AuraComponents {
  /** 0-1: TQ flow coherence (from detectCoherence) */
  energyCoherence: number;
  /** 0-1: EV record validity + friction ratio (from EV registry + detectFriction) */
  experienceIntegrity: number;
  /** 0-1: Symbiosky weighted conviction (from CredibilityState) */
  convictionWeight: number;
  /** 0-1: No active fracture (from γ-CARMIS) */
  gammaCarmisHealth: number;
  /** 0-1: AUT × CDS (from metrics) */
  autonomyFactor: number;
}

export const AURA_WEIGHTS = {
  energyCoherence: 0.25,
  experienceIntegrity: 0.30,
  convictionWeight: 0.20,
  gammaCarmisHealth: 0.15,
  autonomyFactor: 0.10,
} as const;

export type AuraWeightKey = keyof typeof AURA_WEIGHTS;

export function computeAuraScore(components: AuraComponents): number {
  const score =
    components.energyCoherence * AURA_WEIGHTS.energyCoherence +
    components.experienceIntegrity * AURA_WEIGHTS.experienceIntegrity +
    components.convictionWeight * AURA_WEIGHTS.convictionWeight +
    components.gammaCarmisHealth * AURA_WEIGHTS.gammaCarmisHealth +
    components.autonomyFactor * AURA_WEIGHTS.autonomyFactor;

  return Math.max(0, Math.min(1, score)); // clamp 0-1
}

// ============================================================================
// AURA TIERS & THRESHOLDS
// ============================================================================

export type AuraTier =
  | 'dormant'           // < 0.3
  | 'emerging'          // 0.3 - 0.5
  | 'established'       // 0.5 - 0.7
  | 'guardian'          // 0.7 - 0.85
  | 'sovereign_anchor'; // 0.85 - 1.0

export const AURA_THRESHOLDS = {
  MINIMUM_VIABLE: 0.3,
  COMMUNITY_MEMBER: 0.5,
  COUNCIL_ELIGIBLE: 0.7,
  GUARDIAN_NODE: 0.85,
  SOVEREIGN_ANCHOR: 0.95,
} as const;

export function getAuraTier(score: number): AuraTier {
  if (score >= AURA_THRESHOLDS.SOVEREIGN_ANCHOR) return 'sovereign_anchor';
  if (score >= AURA_THRESHOLDS.GUARDIAN_NODE) return 'guardian';
  if (score >= AURA_THRESHOLDS.COUNCIL_ELIGIBLE) return 'established';
  if (score >= AURA_THRESHOLDS.COMMUNITY_MEMBER) return 'emerging';
  return 'dormant';
}

// ============================================================================
// AURA COMPONENT EXTRACTION (Pure Functions)
// ============================================================================

/** Extract energy coherence from TQ ledger + detectCoherence */
export function extractEnergyCoherence(
  tqFlows: Array<{ amount: number; coherent: boolean }>
): number {
  if (tqFlows.length === 0) return 0;
  const coherent = tqFlows.filter(f => f.coherent).length;
  return coherent / tqFlows.length;
}

/** Extract experience integrity from EV records + detectFriction */
export function extractExperienceIntegrity(
  evRecords: Array<{ valid: boolean; friction?: number }>
): number {
  if (evRecords.length === 0) return 0;
  const valid = evRecords.filter(r => r.valid).length;
  const validityRatio = valid / evRecords.length;
  const avgFriction = evRecords.reduce((sum, r) => sum + (r.friction || 0), 0) / evRecords.length;
  return validityRatio * (1 - Math.min(avgFriction, 1));
}

/** Extract conviction weight from Symbiosky CredibilityState */
export function extractConvictionWeight(credState: CredibilityState): number {
  if (credState.proposals.length === 0) return 0;
  
  let totalWeightedConviction = 0;
  let proposalCount = 0;
  
  for (const p of credState.proposals) {
    let sw = 0, lw = 0;
    for (const v of Object.values(p.votes)) {
      const sc = Math.max(0, Math.min(10, v.score));
      sw += sc * v.conviction;
      lw += v.conviction;
    }
    if (lw > 0) {
      totalWeightedConviction += sw / lw;
      proposalCount++;
    }
  }
  
  return proposalCount > 0 ? totalWeightedConviction / (proposalCount * 10) : 0;
}

/** Extract γ-CARMIS health from system state */
export function extractGammaCarmisHealth(
  fractureActive: boolean,
  reconfiguring: boolean
): number {
  if (fractureActive) return 0;
  if (reconfiguring) return 0.5;
  return 1;
}

/** Extract autonomy factor from AUT/CDS metrics */
export function extractAutonomyFactor(aut: number, cds: number): number {
  // Normalize to 0-1 range (assuming max AUT=100, CDS=100)
  const autNorm = Math.min(aut / 100, 1);
  const cdsNorm = Math.min(cds / 100, 1);
  return (autNorm + cdsNorm) / 2;
}

// ============================================================================
// MAIN EXTRACTION FUNCTION (Aggregates All Components)
// ============================================================================

export interface AuraExtractionInput {
  tqFlows: Array<{ amount: number; coherent: boolean }>;
  evRecords: Array<{ valid: boolean; friction?: number }>;
  credState: CredibilityState;
  gammaCarmis: { fractureActive: boolean; reconfiguring: boolean };
  aut: number;
  cds: number;
}

export function extractAuraComponents(input: AuraExtractionInput): AuraComponents {
  return {
    energyCoherence: extractEnergyCoherence(input.tqFlows),
    experienceIntegrity: extractExperienceIntegrity(input.evRecords),
    convictionWeight: extractConvictionWeight(input.credState),
    gammaCarmisHealth: extractGammaCarmisHealth(
      input.gammaCarmis.fractureActive,
      input.gammaCarmis.reconfiguring
    ),
    autonomyFactor: extractAutonomyFactor(input.aut, input.cds),
  };
}

/** Main function: compute full aura from system state */
export function computeAuraFromState(state: AppState): { components: AuraComponents; score: number; tier: AuraTier } {
  // This would be implemented with actual state selectors
  // For now, return structure showing the flow
  const components: AuraComponents = {
    energyCoherence: 0,
    experienceIntegrity: 0,
    convictionWeight: 0,
    gammaCarmisHealth: 1,
    autonomyFactor: 0,
  };
  
  const score = computeAuraScore(components);
  const tier = getAuraTier(score);
  
  return { components, score, tier };
}

// ============================================================================
// HELPERS
// ============================================================================

function getAuraTier(score: number): AuraTier {
  if (score >= 0.95) return 'sovereign_anchor';
  if (score >= 0.85) return 'guardian';
  if (score >= 0.7) return 'established';
  if (score >= 0.5) return 'emerging';
  if (score >= 0.3) return 'dormant';
  return 'dormant';
}