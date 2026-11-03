// ie-protocol.ts — Estado inicial, achievements y storage keys
// HSCSG v15 OS — Zustand store para Protocolo IE

import { IEProtocolState, IEGlobalMetrics, IEUIState, IEToast, IEChallenge, IEPosition, IEMilestone, IEAttestation, IMImpactCert, IEGiveAllocation, IELevel, IEWeightClass } from './ie-types';
import { IE_ACHIEVEMENTS, IE_STORAGE_KEY, IE_STORAGE_VERSION } from './ie-constants';

// ============================================================================
// ESTADO INICIAL
// ============================================================================

export const INITIAL_IE_STATE: IEProtocolState = {
  challenges: {},
  positions: {},
  challengePositions: {},
  milestones: {},
  attestations: {},
  receivedAttestations: {},
  impactCerts: [],
  certsOfChallenge: {},
  giveAllocations: {},
  giveReceived: {},
  giveUsed: {},
  claimable: {},
  globalMetrics: {
    totalActiveChallenges: 0,
    totalParticipants: 0,
    totalFunded: 0n,
    totalReleased: 0n,
    totalRCEDistributed: 0n,
    avgNetworkDepth: 0,
    coordinatorRatio: 0,
    consensusRate: 0,
    attestationCount: 0,
    impactCertCount: 0,
  },
  ui: {
    screen: 'dashboard',
    toasts: [],
  },
};

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export { IE_ACHIEVEMENTS } from './ie-constants';

// ============================================================================
// STORAGE
// ============================================================================

export { IE_STORAGE_KEY, IE_STORAGE_VERSION } from './ie-constants';

// ============================================================================
// HELPERS PARA MIGRACIÓN V1→V2
// ============================================================================

export function ieDetectV1Data(stored: any): boolean {
  if (!stored) return false;
  // Detectar si es estructura v1 (sin version o version < 2)
  return !stored.version || stored.version < 2;
}

export function ieMigrateV1ToV2(v1State: any): IEProtocolState {
  // Migración futura: v1 → v2
  // Por ahora retorna estado inicial limpio
  return INITIAL_IE_STATE;
}

// ============================================================================
// SELECTORS PUROS (para uso en hooks)
// ============================================================================

export function ieSelectChallenge(state: IEProtocolState, challengeId: string): IEChallenge | undefined {
  return state.challenges[challengeId];
}

export function ieSelectPosition(state: IEProtocolState, positionId: string): IEPosition | undefined {
  return state.positions[positionId];
}

export function ieSelectMilestone(state: IEProtocolState, milestoneId: string): IEMilestone | undefined {
  return state.milestones[milestoneId];
}

export function ieSelectPositionsOfChallenge(state: IEProtocolState, challengeId: string): IEPosition[] {
  const ids = state.challengePositions[challengeId] || [];
  return ids.map(id => state.positions[id]).filter(Boolean);
}

export function ieSelectMilestonesOfChallenge(state: IEProtocolState, challengeId: string): IEMilestone[] {
  const challenge = state.challenges[challengeId];
  return challenge?.milestones || [];
}

export function ieSelectClaimable(state: IEProtocolState, challengeId: string, holder: string): bigint {
  return state.claimable[challengeId]?.[holder] || 0n;
}

export function ieSelectReputationScore(state: IEProtocolState, holder: string): number {
  const uids = state.receivedAttestations[holder] || [];
  return uids.filter(uid => {
    const att = state.attestations[uid];
    return att && !att.revoked;
  }).length;
}

export function ieSelectGiveRemaining(state: IEProtocolState, challengeId: string, holder: string): bigint {
  const used = state.giveUsed[challengeId]?.[holder] || 0n;
  return used >= 100n ? 0n : 100n - used;
}

export function ieSelectCurrentA3(state: IEProtocolState, challengeId: string): bigint {
  const positions = ieSelectPositionsOfChallenge(state, challengeId);
  let a3 = 0n;
  for (const pos of positions) a3 += pos.effectiveWeight;
  return a3;
}

export function ieSelectProjectedPayout(
  state: IEProtocolState,
  challengeId: string,
  positionId: string,
  milestoneId: string
): bigint {
  const challenge = state.challenges[challengeId];
  const position = state.positions[positionId];
  const milestone = challenge?.milestones.find(m => m.id === milestoneId);
  
  if (!challenge || !position || !milestone || milestone.released) return 0n;
  
  const a3 = ieSelectCurrentA3(state, challengeId);
  if (a3 === 0n) return 0n;
  
  return (milestone.amount * position.effectiveWeight) / a3;
}

export function ieSelectChallengesSummary(state: IEProtocolState): Array<{
  id: string;
  title: string;
  funder: string;
  funded: bigint;
  released: bigint;
  level: IELevel;
  participantCount: number;
  milestoneCount: number;
  releasedMilestoneCount: number;
  status: string;
  createdAt: number;
}> {
  return Object.values(state.challenges).map(c => ({
    id: c.id,
    title: c.metaURI.slice(0, 80),
    funder: c.funder,
    funded: c.funded,
    released: c.released,
    level: c.level,
    participantCount: (state.challengePositions[c.id] || []).length,
    milestoneCount: c.milestones.length,
    releasedMilestoneCount: c.milestones.filter(m => m.released).length,
    status: c.status,
    createdAt: c.createdAt,
  }));
}

export function ieSelectAttestationsBySchema(state: IEProtocolState, holder: string, schema: string) {
  const uids = state.receivedAttestations[holder] || [];
  return uids
    .map(uid => state.attestations[uid])
    .filter((a): a is IEAttestation => !!a && a.schema === schema && !a.revoked);
}

export function ieSelectImpactCertsOfChallenge(state: IEProtocolState, challengeId: string): IMImpactCert[] {
  const certIds = state.certsOfChallenge[challengeId] || [];
  return certIds.map(id => state.impactCerts.find(c => c.id === id)).filter(Boolean) as IMImpactCert[];
}

// ============================================================================
// TOAST HELPERS
// ============================================================================

export function ieCreateToast(
  type: IEToast['type'],
  title: string,
  message: string
): IEToast {
  return {
    id: `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    message,
    createdAt: Date.now(),
  };
}

export function ieAddToast(state: IEProtocolState, toast: IEToast): IEProtocolState {
  return {
    ...state,
    ui: {
      ...state.ui,
      toasts: [...state.ui.toasts, toast].slice(-10), // max 10 toasts
    },
  };
}

export function ieRemoveToast(state: IEProtocolState, toastId: string): IEProtocolState {
  return {
    ...state,
    ui: {
      ...state.ui,
      toasts: state.ui.toasts.filter(t => t.id !== toastId),
    },
  };
}

// ============================================================================
// METRICS CALCULATORS
// ============================================================================

export function ieRecalculateGlobalMetrics(state: IEProtocolState): IEGlobalMetrics {
  const activeChallenges = Object.values(state.challenges).filter(c => c.status === 'active' || c.status === 'forming');
  const allPositions = Object.values(state.positions);
  const allAttestations = Object.values(state.attestations).filter(a => !a.revoked);
  const coordinators = allPositions.filter(p => p.isCoordinator).length;
  
  let totalApprovals = 0;
  let totalRequired = 0;
  for (const c of activeChallenges) {
    for (const m of c.milestones) {
      totalApprovals += m.approvals;
      totalRequired += m.approvalsRequired;
    }
  }
  
  return {
    totalActiveChallenges: activeChallenges.length,
    totalParticipants: new Set(allPositions.map(p => p.holder)).size,
    totalFunded: activeChallenges.reduce((sum, c) => sum + c.funded, 0n),
    totalReleased: activeChallenges.reduce((sum, c) => sum + c.released, 0n),
    totalRCEDistributed: Object.values(state.claimable).flatMap(c => Object.values(c)).reduce((sum, v) => sum + v, 0n),
    avgNetworkDepth: allPositions.length > 0 
      ? allPositions.reduce((sum, p) => sum + p.depth, 0) / allPositions.length 
      : 0,
    coordinatorRatio: allPositions.length > 0 ? coordinators / allPositions.length : 0,
    consensusRate: totalRequired > 0 ? totalApprovals / totalRequired : 0,
    attestationCount: allAttestations.length,
    impactCertCount: state.impactCerts.length,
  };
}