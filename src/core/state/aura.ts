// Aura State — Zustand slice for Proof of Aura (HSCSG v15 OS / ALRAC)
// Offline-first, amphibious, integrates with TQ/EV/Symbiosky/γ-CARMIS

import type { AuraCredential, CredentialLifecycleState } from '@core/lib/aura-credential';
import type { AuraComponents, AuraTier } from '@core/lib/aura';
import type { AuraFarmingReport } from '@core/lib/aura-farming-detection';

// ============================================================================
// AURA STATE INTERFACE
// ============================================================================

export interface AuraState {
  // Current aura snapshot
  components: AuraComponents | null;
  score: number;
  tier: AuraTier;
  lastComputed: number;
  
  // Credential lifecycle
  lifecycle: CredentialLifecycleState;
  
  // Farming detection
  lastFarmingCheck: AuraFarmingReport | null;
  farmingMonitoring: boolean;          // Continuous monitoring enabled
  farmingCheckInterval: number;        // ms between checks (default: 1 hour)
  
  // History
  scoreHistory: Array<{ score: number; tier: AuraTier; timestamp: number }>;
  credentialHistory: AuraCredential[]; // Past credentials (revoked/expired)
  farmingHistory: AuraFarmingReport[]; // Past farming checks
  
  // Configuration
  autoCompute: boolean;                // Auto-recompute on relevant state changes
  computeInterval: number;             // ms (default: 5 minutes)
  alertOnFarming: boolean;             // Notify when farming detected
}

export function makeAuraState(): AuraState {
  return {
    components: null,
    score: 0,
    tier: 'dormant',
    lastComputed: 0,
    lifecycle: {
      credential: null,
      renewalCount: 0,
      lastRenewalAt: null,
      revoked: false,
      suspended: false,
      lastVerificationAt: null,
    },
    lastFarmingCheck: null,
    farmingMonitoring: true,
    farmingCheckInterval: 60 * 60 * 1000, // 1 hour
    scoreHistory: [],
    credentialHistory: [],
    farmingHistory: [],
    autoCompute: true,
    computeInterval: 5 * 60 * 1000, // 5 minutes
    alertOnFarming: true,
  };
}

// ============================================================================
// STATE ACTIONS (for Zustand store integration)
// ============================================================================

export interface AuraActions {
  // Computation
  computeAura: (state: any) => void;           // state = AppState
  setAutoCompute: (enabled: boolean) => void;
  setComputeInterval: (ms: number) => void;
  
  // Credential lifecycle
  setCredential: (credential: AuraCredential) => void;
  renewCredential: (newCredential: AuraCredential) => void;
  revokeCredential: (reason: string) => void;
  suspendCredential: (reason: string) => void;
  verifyCredential: (credential: AuraCredential) => { valid: boolean; errors: string[] };
  
  // Farming detection
  runFarmingCheck: (state: any) => void;       // state = AppState
  setFarmingMonitoring: (enabled: boolean) => void;
  setFarmingCheckInterval: (ms: number) => void;
  setAlertOnFarming: (enabled: boolean) => void;
  
  // History
  addScoreToHistory: (score: number, tier: string) => void;
  addFarmingReport: (report: any) => void;
  
  // Reset
  resetAura: () => void;
}

// Helper to create actions bound to Zustand set/get
export function createAuraActions(set: any, get: any) {
  return {
    // Computation
    computeAura: (appState: any) => {
      const { extractAuraComponents, computeAuraScore, getAuraTier } = 
        require('@core/lib/aura').default;
      const { computeAuraFromState } = require('@core/lib/aura').default;
      
      // This would be implemented with actual state selectors
      // For now, placeholder showing the flow
      const components = extractAuraComponents({
        tqFlows: appState.flows?.map((f: any) => ({ amount: f.amount, coherent: f.coherent })) || [],
        evRecords: appState.evRecords || [],
        credState: appState.credibility || { proposals: [], locks: [], balances: {}, lastActive: {}, results: {} },
        gammaCarmis: { fractureActive: false, reconfiguring: false },
        aut: 50,
        cds: 40,
      });
      
      const score = computeAuraScore(components);
      const tier = getAuraTier(score);
      
      set((st: any) => ({
        aura: {
          ...st.aura,
          components,
          score,
          tier,
          lastComputed: Date.now(),
        },
      }));
      
      // Add to history
      get().addScoreToHistory(score, tier);
    },
    
    setAutoCompute: (enabled: boolean) => set((st: any) => ({
      aura: { ...st.aura, autoCompute: enabled },
    })),
    
    setComputeInterval: (ms: number) => set((st: any) => ({
      aura: { ...st.aura, computeInterval: ms },
    })),
    
    // Credential lifecycle
    setCredential: (credential: any) => set((st: any) => ({
      aura: {
        ...st.aura,
        lifecycle: {
          ...st.aura.lifecycle,
          credential,
          lastVerificationAt: Date.now(),
        },
      },
    })),
    
    renewCredential: (newCredential: any) => set((st: any) => ({
      aura: {
        ...st.aura,
        lifecycle: {
          ...st.aura.lifecycle,
          credential: newCredential,
          renewalCount: st.aura.lifecycle.renewalCount + 1,
          lastRenewalAt: Date.now(),
        },
        credentialHistory: [...st.aura.credentialHistory, st.aura.lifecycle.credential].filter(Boolean),
      },
    })),
    
    revokeCredential: (reason: string) => set((st: any) => ({
      aura: {
        ...st.aura,
        lifecycle: {
          ...st.aura.lifecycle,
          revoked: true,
          revocationReason: reason,
          credential: null,
        },
      },
    })),
    
    suspendCredential: (reason: string) => set((st: any) => ({
      aura: {
        ...st.aura,
        lifecycle: {
          ...st.aura.lifecycle,
          suspended: true,
          suspensionReason: reason,
        },
      },
    })),
    
    verifyCredential: (credential: any) => {
      // Would import verifyCredentialOffline from @core/lib/aura-credential
      return { valid: true, errors: [] };
    },
    
    // Farming detection
    runFarmingCheck: (appState: any) => {
      const { detectAuraFarming } = require('@core/lib/aura-farming-detection').default;
      const nodeId = appState.nodeId || 'unknown';
      const report = detectAuraFarming(nodeId, appState, 30);
      
      set((st: any) => ({
        aura: {
          ...st.aura,
          lastFarmingCheck: report,
          farmingHistory: [...st.aura.farmingHistory, report].slice(-100),
        },
      }));
      
      // Alert if farming detected
      if (report.isFarmer && get().aura.alertOnFarming) {
        // Trigger notification (would integrate with notif system)
        console.warn('[AURA] Farming detected:', report);
      }
    },
    
    setFarmingMonitoring: (enabled: boolean) => set((st: any) => ({
      aura: { ...st.aura, farmingMonitoring: enabled },
    })),
    
    setFarmingCheckInterval: (ms: number) => set((st: any) => ({
      aura: { ...st.aura, farmingCheckInterval: ms },
    })),
    
    setAlertOnFarming: (enabled: boolean) => set((st: any) => ({
      aura: { ...st.aura, alertOnFarming: enabled },
    })),
    
    // History
    addScoreToHistory: (score: number, tier: string) => set((st: any) => ({
      aura: {
        ...st.aura,
        scoreHistory: [...st.aura.scoreHistory, { score, tier, timestamp: Date.now() }].slice(-1000),
      },
    })),
    
    addFarmingReport: (report: any) => set((st: any) => ({
      aura: {
        ...st.aura,
        farmingHistory: [...st.aura.farmingHistory, report].slice(-100),
      },
    })),
    
    // Reset
    resetAura: () => set((st: any) => ({
      aura: makeAuraState(),
    })),
  };
}

// Re-export for convenience
export { makeAuraState } from './aura-state-factory';