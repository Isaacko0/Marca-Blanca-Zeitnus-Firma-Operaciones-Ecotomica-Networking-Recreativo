// Aura State Factory — Pure factory for AuraState (HSCSG v15 OS / ALRAC)

import type { AuraState, CredentialLifecycleState, AuraComponents, AuraTier } from '@core/state/aura';

// ============================================================================
// INITIAL STATE VALUES
// ============================================================================

const INITIAL_COMPONENTS: AuraComponents = {
  energyCoherence: 0,
  experienceIntegrity: 0,
  convictionWeight: 0,
  gammaCarmisHealth: 1,
  autonomyFactor: 0,
};

const INITIAL_LIFECYCLE: CredentialLifecycleState = {
  credential: null,
  renewalCount: 0,
  lastRenewalAt: null,
  revoked: false,
  suspended: false,
  lastVerificationAt: null,
};

const INITIAL_HISTORY_LIMITS = {
  scoreHistory: 1000,
  credentialHistory: 50,
  farmingHistory: 100,
};

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function makeAuraState(): AuraState {
  return {
    // Current aura snapshot
    components: INITIAL_COMPONENTS,
    score: 0,
    tier: 'dormant',
    lastComputed: 0,
    
    // Credential lifecycle
    lifecycle: INITIAL_LIFECYCLE,
    
    // Farming detection
    lastFarmingCheck: null,
    farmingMonitoring: true,
    farmingCheckInterval: 60 * 60 * 1000, // 1 hour
    
    // History
    scoreHistory: [],
    credentialHistory: [],
    farmingHistory: [],
    
    // Configuration
    autoCompute: true,
    computeInterval: 5 * 60 * 1000, // 5 minutes
    alertOnFarming: true,
  };
}

// ============================================================================
// HELPER FUNCTIONS FOR STATE UPDATES
// ============================================================================

export function updateAuraScore(
  state: AuraState,
  components: AuraComponents,
  score: number,
  tier: AuraTier
): AuraState {
  return {
    ...state,
    components,
    score,
    tier,
    lastComputed: Date.now(),
    scoreHistory: [
      ...state.scoreHistory,
      { score, tier, timestamp: Date.now() },
    ].slice(-1000),
  };
}

export function setAuraCredential(
  state: AuraState,
  credential: any // AuraCredential
): AuraState {
  const oldCredential = state.lifecycle.credential;
  return {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      credential,
      lastVerificationAt: Date.now(),
    },
    credentialHistory: oldCredential
      ? [...state.credentialHistory, oldCredential].slice(-50)
      : state.credentialHistory,
  };
}

export function renewAuraCredential(
  state: AuraState,
  newCredential: any // AuraCredential
): AuraState {
  const oldCredential = state.lifecycle.credential;
  return {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      credential: newCredential,
      renewalCount: state.lifecycle.renewalCount + 1,
      lastRenewalAt: Date.now(),
    },
    credentialHistory: oldCredential
      ? [...state.credentialHistory, oldCredential].slice(-50)
      : state.credentialHistory,
  };
}

export function revokeAuraCredential(
  state: AuraState,
  reason: string
): AuraState {
  return {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      revoked: true,
      revocationReason: reason,
      credential: null,
    },
  };
}

export function suspendAuraCredential(
  state: AuraState,
  reason: string
): AuraState {
  return {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      suspended: true,
      suspensionReason: reason,
    },
  };
}

export function addFarmingReport(
  state: AuraState,
  report: any // AuraFarmingReport
): AuraState {
  return {
    ...state,
    lastFarmingCheck: report,
    farmingHistory: [...state.farmingHistory, report].slice(-100),
  };
}

export function addScoreToHistory(
  state: AuraState,
  score: number,
  tier: AuraTier
): AuraState {
  return {
    ...state,
    scoreHistory: [
      ...state.scoreHistory,
      { score, tier, timestamp: Date.now() },
    ].slice(-1000),
  };
}

export function setAuraConfig(
  state: AuraState,
  config: Partial<Pick<AuraState, 'autoCompute' | 'computeInterval' | 'farmingMonitoring' | 'farmingCheckInterval' | 'alertOnFarming'>>
): AuraState {
  return {
    ...state,
    ...config,
  };
}

export function resetAuraState(): AuraState {
  return makeAuraState();
}