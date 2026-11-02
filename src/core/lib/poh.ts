// Proof of Humanity / Kleros — Lógica Pura (sin infra blockchain, anfibio)
import type {
  PohState,
  PoHProfile,
  VouchRecord,
  PohChallenge,
  Juror,
  JurorVote,
  PoHIdentity,
  LocalCourt,
  CrossChainProof,
  PohConfig,
  PoHStatus,
  ChallengeStatus,
  PriceEstimate,
  PriceDiscoveryResult,
  PohStats,
} from '@core/state/poh'
import type { EvidenceRecord, EvidenceKind } from '@core/lib/evidence'
import type { JurorVerdict } from '@core/state/kleros'
import { scoreEvidence } from '@core/lib/evidence'

const uid = () => Math.random().toString(36).slice(2, 9)
const now = () => Date.now()

// ===== Catálogos Inmutables =====
export const POH_STATUSES: PoHStatus[] = [
  'pending', 'vouched', 'challenged', 'in_court', 'included', 'rejected', 'expired', 'renewing'
]

export const CHALLENGE_STATUSES: ChallengeStatus[] = [
  'open', 'in_court', 'resolved', 'appealed', 'final'
]

export const VERDICTS: { key: JurorVerdict; label: string }[] = [
  { key: 'a_favor', label: 'A Favor' },
  { key: 'en_contra', label: 'En Contra' },
  { key: 'abstencion', label: 'Abstención' },
]

// ===== Factory =====
export { makePohState } from '@core/state/poh'

// ===== Utilidades Internas =====
function recalcStats(st: PohState): PohStats {
  const totalZNUStaked = st.jurors.reduce((sum, j) => sum + j.stake, 0)
  const avgReputation = st.jurors.length > 0
    ? st.jurors.reduce((sum, j) => sum + j.reputation, 0) / st.jurors.length
    : 0

  return {
    totalProfiles: st.profiles.length,
    pendingVouch: st.profiles.filter(p => p.status === 'pending' || p.status === 'vouched').length,
    activeChallenges: st.challenges.filter(c => c.status === 'open' || c.status === 'in_court').length,
    includedHumans: st.identities.filter(i => i.isActive).length,
    expiredIdentities: st.identities.filter(i => !i.isActive).length,
    totalZNUStaked,
    avgReputation: Math.round(avgReputation),
  }
}

function computeReputationScore(identity: PoHIdentity): number {
  // Score compuesto: vouches * 10 + antigüedad(días) * 0.1 + disputes ganadas * 20 - perdidas * 15
  const ageDays = (now() - identity.includedAt) / 86400000
  return Math.round(
    identity.vouchesCount * 10 +
    ageDays * 0.1 +
    identity.challengesWon * 20 -
    identity.challengesLost * 15 +
    identity.renewalCount * 5
  )
}

function isChallengePeriodActive(profile: PoHProfile, config: PohConfig): boolean {
  if (profile.status !== 'vouched') return false
  const challengeWindowEnd = profile.submittedAt + config.challengePeriodDays * 86400000
  return now() < challengeWindowEnd
}

// ===== REGISTRO DE PERFIL =====
export interface SubmitProfileInput {
  name: string
  videoHash: string
  photoHash: string
  walletAddress: string
  submittedBy: string
  metadata?: Record<string, unknown>
}

export function submitProfile(st: PohState, input: SubmitProfileInput): PoHProfile {
  const profile: PoHProfile = {
    id: uid(),
    name: input.name,
    videoHash: input.videoHash,
    photoHash: input.photoHash,
    walletAddress: input.walletAddress.toLowerCase(),
    submittedBy: input.submittedBy,
    submittedAt: now(),
    vouchedBy: [],
    status: 'pending',
    metadata: input.metadata,
  }
  return {
    ...st,
    profiles: [...st.profiles, profile],
    stats: recalcStats({ ...st, profiles: [...st.profiles, profile] }),
  }
}

export function getProfile(st: PohState, id: string): PoHProfile | undefined {
  return st.profiles.find(p => p.id === id)
}

export function getProfilesByStatus(st: PohState, status: PoHStatus): PoHProfile[] {
  return st.profiles.filter(p => p.status === status)
}

export function getPendingProfiles(st: PohState): PoHProfile[] {
  return st.profiles.filter(p => p.status === 'pending' || p.status === 'vouched')
}

// ===== VOUCHING COMUNITARIO =====
export interface VouchInput {
  profileId: string
  voucher: string
  weight?: number          // default: 1 (se puede calcular por AUT/CDS del voucher)
  note?: string
}

export function vouch(st: PohState, input: VouchInput): { state: PohState; vouch: VouchRecord } {
  const profile = st.profiles.find(p => p.id === input.profileId)
  if (!profile) throw new Error('Profile not found')
  if (profile.status !== 'pending' && profile.status !== 'vouched') {
    throw new Error(`Cannot vouch profile in status: ${profile.status}`)
  }
  if (profile.vouchedBy.some(v => v.voucher === input.voucher)) {
    throw new Error('Already vouched by this member')
  }

  const weight = input.weight ?? 1
  const vouchRecord: VouchRecord = {
    id: uid(),
    profileId: input.profileId,
    voucher: input.voucher,
    weight,
    timestamp: now(),
    note: input.note,
  }

  const updatedProfile: PoHProfile = {
    ...profile,
    vouchedBy: [...profile.vouchedBy, vouchRecord],
    status: 'vouched',  // entra en challenge period
  }

  const newState = {
    ...st,
    profiles: st.profiles.map(p => p.id === input.profileId ? updatedProfile : p),
  }

  return {
    state: { ...newState, stats: recalcStats(newState) },
    vouch: vouchRecord,
  }
}

export function getVouchesFor(st: PohState, profileId: string): VouchRecord[] {
  const profile = st.profiles.find(p => p.id === profileId)
  return profile?.vouchedBy ?? []
}

export function canEnterChallengePeriod(st: PohState, profile: PoHProfile): boolean {
  return (
    profile.status === 'vouched' &&
    profile.vouchedBy.length >= st.config.minVouchesRequired &&
    isChallengePeriodActive(profile, st.config)
  )
}

// ===== CHALLENGE PERIOD =====
export interface OpenChallengeInput {
  profileId: string
  challenger: string
  reason: string
  initialEvidence?: EvidenceRecord[]
}

export function openChallenge(st: PohState, input: OpenChallengeInput): { state: PohState; challenge: PohChallenge } {
  const profile = st.profiles.find(p => p.id === input.profileId)
  if (!profile) throw new Error('Profile not found')
  if (!canEnterChallengePeriod(st, profile)) {
    throw new Error('Challenge period not active or min vouches not met')
  }
  if (profile.currentChallengeId) {
    throw new Error('Challenge already exists for this profile')
  }

  const challenge: PohChallenge = {
    id: uid(),
    profileId: input.profileId,
    challenger: input.challenger,
    reason: input.reason,
    evidence: input.initialEvidence ?? [],
    status: 'open',
    createdAt: now(),
    jurors: [],
    appealed: false,
    appealRound: 0,
    appealCostPaid: 0,
  }

  const updatedProfile: PoHProfile = {
    ...profile,
    status: 'challenged',
    currentChallengeId: challenge.id,
  }

  const newState = {
    ...st,
    profiles: st.profiles.map(p => p.id === input.profileId ? updatedProfile : p),
    challenges: [...st.challenges, challenge],
  }

  return {
    state: { ...newState, stats: recalcStats(newState) },
    challenge,
  }
}

export function addChallengeEvidence(
  st: PohState,
  challengeId: string,
  evidence: EvidenceRecord
): PohState {
  return {
    ...st,
    challenges: st.challenges.map(c =>
      c.id === challengeId
        ? { ...c, evidence: [...c.evidence, evidence] }
        : c
    ),
  }
}

export function getActiveChallenges(st: PohState): PohChallenge[] {
  return st.challenges.filter(c => c.status === 'open' || c.status === 'in_court')
}

export function getChallenge(st: PohState, id: string): PohChallenge | undefined {
  return st.challenges.find(c => c.id === id)
}

// ===== JURADOS LOCALES (Stake ZNU) =====
export interface SeatJurorInput {
  name: string
  stake: number
  courtId?: string
}

export function seatJuror(st: PohState, input: SeatJurorInput): { state: PohState; juror: Juror } {
  if (input.stake < st.config.minJurorStake) {
    throw new Error(`Min stake required: ${st.config.minJurorStake} ZNU`)
  }

  const courtId = input.courtId ?? 'court-general'
  const court = st.courts.find(c => c.id === courtId)
  if (!court) throw new Error('Court not found')

  const juror: Juror = {
    id: uid(),
    name: input.name,
    stake: input.stake,
    reputation: 100,
    totalVotes: 0,
    coherentVotes: 0,
    seated: true,
    courtIds: [courtId],
  }

  const updatedCourt: LocalCourt = {
    ...court,
    activeDisputeIds: [...court.activeDisputeIds],
  }

  const newState = {
    ...st,
    jurors: [...st.jurors, juror],
    courts: st.courts.map(c => c.id === courtId ? updatedCourt : c),
    stats: recalcStats({ ...st, jurors: [...st.jurors, juror] }),
  }

  return { state: newState, juror }
}

export function getEligibleJurors(st: PohState, courtId: string, count: number): Juror[] {
  const court = st.courts.find(c => c.id === courtId)
  if (!court) return []

  const eligible = st.jurors
    .filter(j => j.courtIds.includes(courtId) && j.stake >= court.minStake && j.reputation > 0)
    .sort((a, b) => b.stake - a.stake)  // ponderado por stake (sortition simplificada)

  return eligible.slice(0, count)
}

// ===== VOTACIÓN KLEROS LOCAL =====
export function castVote(
  st: PohState,
  challengeId: string,
  jurorId: string,
  verdict: JurorVerdict
): PohState {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge) throw new Error('Challenge not found')
  if (challenge.status !== 'in_court') throw new Error('Challenge not in voting phase')

  const juror = st.jurors.find(j => j.id === jurorId)
  if (!juror) throw new Error('Juror not found')
  if (challenge.jurors.some(v => v.jurorId === jurorId)) {
    throw new Error('Juror already voted')
  }

  const vote: JurorVote = {
    jurorId,
    verdict,
    stake: juror.stake,
    reputation: juror.reputation,
    timestamp: now(),
  }

  const updatedChallenge: PohChallenge = {
    ...challenge,
    jurors: [...challenge.jurors, vote],
  }

  const updatedJuror: Juror = {
    ...juror,
    totalVotes: juror.totalVotes + 1,
  }

  return {
    ...st,
    challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
    jurors: st.jurors.map(j => j.id === jurorId ? updatedJuror : j),
  }
}

// ===== RESOLUCIÓN DE DISPUTA (Mayoría Simple + ReputationDecay) =====
export function resolveChallenge(
  st: PohState,
  challengeId: string,
  resolution: string
): PohState {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge) throw new Error('Challenge not found')
  if (challenge.status !== 'in_court') throw new Error('Challenge not in voting phase')

  const votes = challenge.jurors.map(v => v.verdict)
  if (votes.length === 0) throw new Error('No votes cast')

  const tally = { a_favor: 0, en_contra: 0, abstencion: 0 }
  votes.forEach(v => (tally[v] += 1))

  const winner: JurorVerdict = tally.a_favor >= tally.en_contra ? 'a_favor' : 'en_contra'

  // Penalizar jurados en minoría (reputationDecay)
  const decay = st.config.reputationDecay
  const jurorsDecayed = st.jurors.map(j => {
    const vote = challenge.jurors.find(v => v.jurorId === j.id)
    if (vote && vote.verdict !== 'abstencion' && vote.verdict !== winner) {
      return { ...j, reputation: Math.max(0, j.reputation - decay) }
    }
    if (vote && vote.verdict === winner) {
      return { ...j, coherentVotes: j.coherentVotes + 1 }
    }
    return j
  })

  const isIncluded = winner === 'a_favor'
  const updatedProfile = st.profiles.find(p => p.id === challenge.profileId)
  let newIdentities = st.identities
  let updatedProfileResult = updatedProfile

  if (updatedProfile) {
    if (isIncluded) {
      // Incluir humano → generar Soulbound ID
      const identity: PoHIdentity = {
        id: updatedProfile.id,
        name: updatedProfile.name,
        walletAddress: updatedProfile.walletAddress,
        includedAt: now(),
        expiresAt: now() + st.config.renewalPeriodDays * 86400000,
        vouchesCount: updatedProfile.vouchedBy.length,
        challengesWon: 1,
        challengesLost: 0,
        reputationScore: 0,  // se calcula abajo
        crossChainProofs: [],
        renewalCount: 0,
        isActive: true,
      }
      identity.reputationScore = computeReputationScore(identity)
      newIdentities = [...st.identities, identity]
      updatedProfileResult = { ...updatedProfile, status: 'included', includedAt: now() }
    } else {
      updatedProfileResult = { ...updatedProfile, status: 'rejected', currentChallengeId: undefined }
    }
  }

  const updatedChallenge: PohChallenge = {
    ...challenge,
    status: 'resolved',
    resolution,
    resolvedAt: now(),
  }

  const newState = {
    ...st,
    profiles: updatedProfileResult
      ? st.profiles.map(p => p.id === challenge.profileId ? updatedProfileResult! : p)
      : st.profiles,
    challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
    jurors: jurorsDecayed,
    identities: newIdentities,
  }

  return { ...newState, stats: recalcStats(newState) }
}

// ===== SISTEMA DE APELACIONES (Costes Exponenciales) =====
export function calculateAppealCost(round: number, baseCost: number): number {
  // Coste exponencial: base * 2^round
  return baseCost * Math.pow(2, round)
}

export function canAppeal(st: PohState, challengeId: string, appellant: string): { ok: boolean; reason?: string } {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge) return { ok: false, reason: 'Challenge not found' }
  if (challenge.status !== 'resolved') return { ok: false, reason: 'Challenge not resolved' }
  if (challenge.appealRound >= st.config.maxAppeals) {
    return { ok: false, reason: `Max appeals (${st.config.maxAppeals}) reached` }
  }
  if (challenge.appealed) return { ok: false, reason: 'Already appealed this round' }
  // Verificar que el apelante tiene ZNU para pagar (simplificado: check en store)
  return { ok: true }
}

export function appealChallenge(st: PohState, challengeId: string, appellant: string): PohState {
  const check = canAppeal(st, challengeId, appellant)
  if (!check.ok) throw new Error(check.reason)

  const challenge = st.challenges.find(c => c.id === challengeId)!
  const appealCost = calculateAppealCost(challenge.appealRound, st.config.appealCostBase)

  const updatedChallenge: PohChallenge = {
    ...challenge,
    status: 'appealed',
    appealed: true,
    appealRound: challenge.appealRound + 1,
    appealCostPaid: challenge.appealCostPaid + appealCost,
    jurors: [],  // nueva ronda, nuevos jurados
  }

  return {
    ...st,
    challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
  }
}

// ===== INCLUSIÓN / IDENTIDAD =====
export function includeHuman(st: PohState, profileId: string): { state: PohState; identity: PoHIdentity } {
  const profile = st.profiles.find(p => p.id === profileId)
  if (!profile) throw new Error('Profile not found')
  if (profile.status !== 'included') throw new Error('Profile not included')

  const identity: PoHIdentity = {
    id: profile.id,
    name: profile.name,
    walletAddress: profile.walletAddress,
    includedAt: profile.includedAt ?? now(),
    expiresAt: now() + st.config.renewalPeriodDays * 86400000,
    vouchesCount: profile.vouchedBy.length,
    challengesWon: 1,
    challengesLost: 0,
    reputationScore: 0,
    crossChainProofs: profile.crossChainProof ? [profile.crossChainProof] : [],
    lastRenewalAt: undefined,
    renewalCount: 0,
    isActive: true,
  }
  identity.reputationScore = computeReputationScore(identity)

  return {
    state: {
      ...st,
      identities: [...st.identities, identity],
      stats: recalcStats({ ...st, identities: [...st.identities, identity] }),
    },
    identity,
  }
}

export function getIdentity(st: PohState, humanName: string): PoHIdentity | undefined {
  return st.identities.find(i => i.name === humanName && i.isActive)
}

export function getIdentityById(st: PohState, id: string): PoHIdentity | undefined {
  return st.identities.find(i => i.id === id)
}

export function renewIdentity(st: PohState, identityId: string): PoHIdentity {
  const identity = st.identities.find(i => i.id === identityId)
  if (!identity) throw new Error('Identity not found')
  if (!identity.isActive) throw new Error('Identity not active')

  const renewed: PoHIdentity = {
    ...identity,
    expiresAt: now() + st.config.renewalPeriodDays * 86400000,
    lastRenewalAt: now(),
    renewalCount: identity.renewalCount + 1,
    reputationScore: computeReputationScore({
      ...identity,
      expiresAt: now() + st.config.renewalPeriodDays * 86400000,
      renewalCount: identity.renewalCount + 1,
    }),
  }

  return {
    ...st,
    identities: st.identities.map(i => i.id === identityId ? renewed : i),
  }
}

export function getExpiringIdentities(st: PohState, days: number): PoHIdentity[] {
  const threshold = now() + days * 86400000
  return st.identities.filter(i => i.isActive && i.expiresAt < threshold)
}

// ===== CROSS-CHAIN (Read-Only Interface) =====
export async function verifyCrossChain(
  _humanityId: string,
  _chain: 'gnosis' | 'ethereum' | 'arbitrum'
): Promise<CrossChainProof> {
  // TODO: Implementar con viem/ethers en adapter conectado
  // Por ahora retorna mock para modo postmonetario
  return {
    chain: 'local',
    contractAddress: '0x0',
    humanityId: _humanityId,
    isClaimed: false,
  }
}

// ===== PRICE DISCOVERY (Schelling Game) =====
export function medianEstimate(estimates: PriceEstimate[]): number {
  if (estimates.length === 0) return 0
  const vals = estimates.map(e => e.value).sort((a, b) => a - b)
  const mid = Math.floor(vals.length / 2)
  return vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2
}

export function priceDiscovery(
  estimates: PriceEstimate[],
  tolerancePct = 10
): PriceDiscoveryResult {
  const median = medianEstimate(estimates)
  const rewarded: string[] = []
  const penalized: string[] = []

  for (const e of estimates) {
    const dev = median === 0 ? 0 : Math.abs(e.value - median) / median * 100
    if (dev <= tolerancePct) rewarded.push(e.juror)
    else penalized.push(e.juror)
  }
  return { median, rewarded, penalized, tolerancePct }
}

// ===== SORTITION (Selección Jurados Ponderada por Stake) =====
export function selectJurors(pool: Juror[], count: number): Juror[] {
  if (pool.length <= count) return pool

  // Weighted random selection por stake
  const totalStake = pool.reduce((sum, j) => sum + j.stake, 0)
  const selected: Juror[] = []
  const remaining = [...pool]

  while (selected.length < count && remaining.length > 0) {
    let rand = Math.random() * totalStake
    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].stake
      if (rand <= 0) {
        selected.push(remaining[i])
        remaining.splice(i, 1)
        break
      }
    }
  }
  return selected
}

// ===== COURT MANAGEMENT =====
export function createCourt(st: PohState, court: Omit<LocalCourt, 'id' | 'activeDisputeIds'>): LocalCourt {
  const newCourt: LocalCourt = {
    ...court,
    id: `court-${uid()}`,
    activeDisputeIds: [],
  }
  return {
    ...st,
    courts: [...st.courts, newCourt],
  }
}

export function assignChallengeToCourt(st: PohState, challengeId: string, courtId: string): PohState {
  const challenge = st.challenges.find(c => c.id === challengeId)
  const court = st.courts.find(c => c.id === courtId)
  if (!challenge || !court) throw new Error('Challenge or court not found')

  // Seleccionar jurados para esta disputa
  const jurors = selectJurors(
    st.jurors.filter(j => j.courtIds.includes(courtId) && j.stake >= court.minStake),
    court.jurorCount
  )

  const updatedChallenge: PohChallenge = {
    ...challenge,
    status: 'in_court',
    courtId,
    jurors: jurors.map(j => ({
      jurorId: j.id,
      verdict: 'abstencion' as JurorVerdict,  // placeholder
      stake: j.stake,
      reputation: j.reputation,
      timestamp: 0,
    })),
  }

  const updatedCourt: LocalCourt = {
    ...court,
    activeDisputeIds: [...court.activeDisputeIds, challengeId],
  }

  const updatedJurors = st.jurors.map(j =>
    jurors.some(sj => sj.id === j.id) ? { ...j, seated: true } : j
  )

  return {
    ...st,
    challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
    courts: st.courts.map(c => c.id === courtId ? updatedCourt : c),
    jurors: updatedJurors,
  }
}

// ===== CONFIG UPDATE =====
export function updatePohConfig(st: PohState, updates: Partial<PohConfig>): PohState {
  return {
    ...st,
    config: { ...st.config, ...updates },
  }
}