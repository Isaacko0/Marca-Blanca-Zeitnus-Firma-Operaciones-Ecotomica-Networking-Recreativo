// Proof of Humanity — Hook Tipado (re-export desde store)
import type {
  PohState,
  PoHProfile,
  VouchRecord,
  PohChallenge,
  PoHIdentity,
  Juror,
  LocalCourt,
  CrossChainProof,
  PohConfig,
  SubmitProfileInput,
  VouchInput,
  OpenChallengeInput,
  SeatJurorInput,
} from '@core/state/poh'
import type { EvidenceRecord } from '@core/lib/evidence'
import type { JurorVerdict } from '@core/state/kleros'
import type { PohAdapter } from '@core/lib/amphibious/poh-adapters'

// Tipos re-exportados para componentes
export type {
  PohState,
  PoHProfile,
  VouchRecord,
  PohChallenge,
  PoHIdentity,
  Juror,
  LocalCourt,
  CrossChainProof,
  PohConfig,
  SubmitProfileInput,
  VouchInput,
  OpenChallengeInput,
  SeatJurorInput,
  EvidenceRecord,
  JurorVerdict,
  PohAdapter,
}

// Selectores tipados para uso en componentes
export const selectPohProfiles = (state: PohState) => state.profiles
export const selectPohChallenges = (state: PohState) => state.challenges
export const selectPohJurors = (state: PohState) => state.jurors
export const selectPohCourts = (state: PohState) => state.courts
export const selectPohIdentities = (state: PohState) => state.identities
export const selectPohConfig = (state: PohState) => state.config
export const selectPohStats = (state: PohState) => state.stats

export const selectPendingProfiles = (state: PohState) =>
  state.profiles.filter(p => p.status === 'pending' || p.status === 'vouched')

export const selectActiveChallenges = (state: PohState) =>
  state.challenges.filter(c => c.status === 'open' || c.status === 'in_court')

export const selectIncludedIdentities = (state: PohState) =>
  state.identities.filter(i => i.isActive)

export const selectProfileById = (state: PohState, id: string) =>
  state.profiles.find(p => p.id === id)

export const selectIdentityByName = (state: PohState, name: string) =>
  state.identities.find(i => i.name === name && i.isActive)

export const selectIdentityById = (state: PohState, id: string) =>
  state.identities.find(i => i.id === id)

export const selectVouchesForProfile = (state: PohState, profileId: string) => {
  const profile = state.profiles.find(p => p.id === profileId)
  return profile?.vouchedBy ?? []
}

export const selectChallengeById = (state: PohState, id: string) =>
  state.challenges.find(c => c.id === id)

export const selectJurorById = (state: PohState, id: string) =>
  state.jurors.find(j => j.id === id)

export const selectCourtById = (state: PohState, id: string) =>
  state.courts.find(c => c.id === id)

export const selectEligibleJurors = (state: PohState, courtId: string, minStake: number) =>
  state.jurors.filter(j =>
    j.courtIds.includes(courtId) &&
    j.stake >= minStake &&
    j.reputation > 0
  )

// Helpers para componentes
export function formatPohStatus(status: PoHProfile['status']): string {
  const labels: Record<PoHProfile['status'], string> = {
    pending: 'Pendiente Vouch',
    vouched: 'Vouchado → Challenge Period',
    challenged: 'Desafiado',
    in_court: 'En Juicio',
    included: 'Incluido ✓',
    rejected: 'Rechazado ✗',
    expired: 'Expirado',
    renewing: 'Renovando...',
  }
  return labels[status] ?? status
}

export function formatChallengeStatus(status: PohChallenge['status']): string {
  const labels: Record<PohChallenge['status'], string> = {
    open: 'Abierto',
    in_court: 'En Court',
    resolved: 'Resuelto',
    appealed: 'Apelado',
    final: 'Final',
  }
  return labels[status] ?? status
}

export function formatVerdict(verdict: JurorVerdict): string {
  const labels: Record<JurorVerdict, string> = {
    a_favor: 'A Favor',
    en_contra: 'En Contra',
    abstencion: 'Abstención',
  }
  return labels[verdict] ?? verdict
}

export function isProfileInChallengePeriod(profile: PoHProfile, config: PohConfig): boolean {
  if (profile.status !== 'vouched') return false
  const challengeWindowEnd = profile.submittedAt + config.challengePeriodDays * 86400000
  return Date.now() < challengeWindowEnd
}

export function getDaysUntilExpiry(identity: PoHIdentity): number {
  const diff = identity.expiresAt - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

export function getIdentityStatus(identity: PoHIdentity): 'active' | 'expiring' | 'expired' {
  const days = getDaysUntilExpiry(identity)
  if (days <= 0) return 'expired'
  if (days <= 30) return 'expiring'
  return 'active'
}