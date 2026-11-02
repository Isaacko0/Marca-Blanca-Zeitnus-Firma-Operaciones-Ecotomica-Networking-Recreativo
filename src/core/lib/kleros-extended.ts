// Kleros Extended — Courts, Price Discovery, Appeals, Sortition (lógica pura, anfibio)
import type {
  LocalCourt,
  PriceEstimate,
  PriceDiscoveryResult,
  Juror,
  JurorVerdict,
} from '@core/state/poh'
import type { PohState, PohChallenge, PoHIdentity } from '@core/state/poh'
import type { EvidenceRecord } from '@core/lib/evidence'

// ===== COURTS CONFIGURATION =====
export interface CourtConfig {
  id: string
  name: string
  description: string
  minStake: number                    // ZNU mínimo
  jurorCount: number                  // impar: 3, 5, 9, 15, 21...
  hiddenVotes: boolean                // votos ocultos hasta fin
  appealCostBase: number              // ZNU base
  maxAppeals: number
  evidencePeriodDays: number          // días para presentar evidencia
  votingPeriodDays: number            // días para votar
  appealPeriodDays: number            // días para apelar
  requiredCoherence: number           // % votos coherentes para no decay (default 66%)
}

// Courts predefinidos (isomorfos a Kleros V1/V2 courts)
export const DEFAULT_COURTS: CourtConfig[] = [
  {
    id: 'court-general',
    name: 'General Court',
    description: 'Disputas generales de identidad y registro',
    minStake: 100,
    jurorCount: 3,
    hiddenVotes: false,
    appealCostBase: 50,
    maxAppeals: 3,
    evidencePeriodDays: 3,
    votingPeriodDays: 3,
    appealPeriodDays: 2,
    requiredCoherence: 66,
  },
  {
    id: 'court-identity',
    name: 'Identity Court',
    description: 'Específico para disputas Proof of Humanity',
    minStake: 200,
    jurorCount: 5,
    hiddenVotes: true,  // como Spanish General Court en Kleros
    appealCostBase: 100,
    maxAppeals: 3,
    evidencePeriodDays: 5,
    votingPeriodDays: 5,
    appealPeriodDays: 3,
    requiredCoherence: 60,
  },
  {
    id: 'court-governance',
    name: 'Governance Court',
    description: 'Disputas de gobernanza DAO/CDS',
    minStake: 500,
    jurorCount: 9,
    hiddenVotes: false,
    appealCostBase: 200,
    maxAppeals: 2,
    evidencePeriodDays: 7,
    votingPeriodDays: 7,
    appealPeriodDays: 5,
    requiredCoherence: 70,
  },
  {
    id: 'court-economic',
    name: 'Economic Court',
    description: 'Disputas de valor, precios, payouts CaaS/UBI',
    minStake: 1000,
    jurorCount: 9,
    hiddenVotes: false,
    appealCostBase: 500,
    maxAppeals: 2,
    evidencePeriodDays: 7,
    votingPeriodDays: 5,
    appealPeriodDays: 3,
    requiredCoherence: 66,
  },
]

// ===== PRICE DISCOVERY (Schelling Game) =====
// Isomorfo a Symbiosky score Schelling + iambrainstorming merit voting
export interface PriceDiscoveryConfig {
  tolerancePct: number          // default 10%
  minEstimates: number          // default 3
  maxOutlierStdDev: number      // default 1.0 (1 SD)
  rewardMultiplier: number      // bonus por coherencia (default 1.1)
  penaltyMultiplier: number     // decay por outlier (default 0.9)
}

export const DEFAULT_PRICE_DISCOVERY_CONFIG: PriceDiscoveryConfig = {
  tolerancePct: 10,
  minEstimates: 3,
  maxOutlierStdDev: 1.0,
  rewardMultiplier: 1.1,
  penaltyMultiplier: 0.9,
}

/**
 * Calcula la mediana de estimaciones (resistente a manipulación)
 * Isomorfo a: medianEstimate en poh.ts + scoreSchelling en evidence.ts
 */
export function medianEstimate(estimates: PriceEstimate[]): number {
  if (estimates.length === 0) return 0
  const vals = estimates.map(e => e.value).sort((a, b) => a - b)
  const mid = Math.floor(vals.length / 2)
  return vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2
}

/**
 * Calcula media y desviación estándar
 */
export function meanAndStdDev(values: number[]): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 }
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return { mean, stdDev: Math.sqrt(variance) }
}

/**
 * Score Schelling con outlier removal (isomorfo a evidence.ts:scoreSchelling)
 * Retorna nueva media de valores dentro de 1 SD + lista kept/removed
 */
export function scoreSchelling(values: number[]): {
  newMean: number
  kept: number[]
  removed: number[]
  outliers: number[]
} {
  if (values.length < 2) return { newMean: values[0] ?? 0, kept: values, removed: [], outliers: [] }

  const { mean, stdDev } = meanAndStdDev(values)
  const threshold = stdDev * 1.0  // 1 SD

  const kept = values.filter(v => Math.abs(v - mean) <= threshold)
  const removed = values.filter(v => Math.abs(v - mean) > threshold)
  const newMean = kept.length > 0
    ? kept.reduce((a, b) => a + b, 0) / kept.length
    : mean

  return { newMean, kept, removed, outliers: removed }
}

/**
 * Price Discovery completo con recompensas/penalizaciones
 * Isomorfo a: priceDiscovery en poh.ts + Symbiosky conviction voting
 */
export function priceDiscovery(
  estimates: PriceEstimate[],
  config: Partial<PriceDiscoveryConfig> = {}
): PriceDiscoveryResult & { rewards: Record<string, number>; penalties: Record<string, number> } {
  const cfg = { ...DEFAULT_PRICE_DISCOVERY_CONFIG, ...config }

  if (estimates.length < cfg.minEstimates) {
    return {
      median: 0,
      rewarded: [],
      penalized: [],
      tolerancePct: cfg.tolerancePct,
      rewards: {},
      penalties: {},
    }
  }

  const median = medianEstimate(estimates)
  const rewarded: string[] = []
  const penalized: string[] = []
  const rewards: Record<string, number> = {}
  const penalties: Record<string, number> = {}

  for (const e of estimates) {
    const dev = median === 0 ? 0 : Math.abs(e.value - median) / median * 100
    if (dev <= cfg.tolerancePct) {
      rewarded.push(e.juror)
      // Reward: stake * multiplier
      rewards[e.juror] = Math.round(e.stake * (cfg.rewardMultiplier - 1))
    } else {
      penalized.push(e.juror)
      // Penalty: stake * (1 - penaltyMultiplier)
      penalties[e.juror] = Math.round(e.stake * (1 - cfg.penaltyMultiplier))
    }
  }

  return { median, rewarded, penalized, tolerancePct: cfg.tolerancePct, rewards, penalties }
}

// ===== APPEALS SYSTEM =====
export interface AppealConfig {
  baseCost: number
  exponent: number          // default 2 (cost = base * 2^round)
  maxRounds: number
  crowdfundingEnabled: boolean
  crowdfundRewardPct: number   // % reward para crowdfunders del lado ganador
}

export const DEFAULT_APPEAL_CONFIG: AppealConfig = {
  baseCost: 50,
  exponent: 2,
  maxRounds: 3,
  crowdfundingEnabled: true,
  crowdfundRewardPct: 10,
}

/**
 * Calcula coste de apelación exponencial
 * Isomorfo a Kleros: cada ronda cuesta exponencialmente más
 */
export function calculateAppealCost(round: number, config: Partial<AppealConfig> = {}): number {
  const cfg = { ...DEFAULT_APPEAL_CONFIG, ...config }
  return cfg.baseCost * Math.pow(cfg.exponent, round)
}

/**
 * Verifica si se puede apelar
 */
export function canAppeal(
  challenge: PohChallenge,
  appellant: string,
  config: Partial<AppealConfig> = {}
): { ok: boolean; reason?: string; cost?: number } {
  const cfg = { ...DEFAULT_APPEAL_CONFIG, ...config }

  if (challenge.status !== 'resolved' && challenge.status !== 'appealed') {
    return { ok: false, reason: 'Challenge not in appealable state' }
  }
  if (challenge.appealRound >= cfg.maxRounds) {
    return { ok: false, reason: `Max appeal rounds (${cfg.maxRounds}) reached` }
  }
  const cost = calculateAppealCost(challenge.appealRound, cfg)
  return { ok: true, cost }
}

/**
 * Procesa apelación: nueva ronda, nuevos jurados, coste pagado
 */
export function processAppeal(
  st: PohState,
  challengeId: string,
  appellant: string,
  config: Partial<AppealConfig> = {}
): PohState {
  const check = canAppeal(st.challenges.find(c => c.id === challengeId)!, appellant, config)
  if (!check.ok) throw new Error(check.reason)

  const challenge = st.challenges.find(c => c.id === challengeId)!
  const cost = check.cost!

  // Nueva ronda: resetear jurados, incrementar ronda, marcar apelado
  const updatedChallenge: PohChallenge = {
    ...challenge,
    status: 'appealed',
    appealed: true,
    appealRound: challenge.appealRound + 1,
    appealCostPaid: challenge.appealCostPaid + cost,
    jurors: [],  // nuevos jurados se seleccionan en assignChallengeToCourt
    resolution: undefined,
    resolvedAt: undefined,
  }

  return {
    ...st,
    challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
  }
}

// ===== SORTITION (Selección Jurados) =====
// Isomorfo a Kleros: sorteo ponderado por stake + verificación Sybil
export interface SortitionConfig {
  minStake: number
  jurorCount: number
  hiddenVotes: boolean
  sybilResistance: 'poh' | 'stake' | 'reputation' | 'hybrid'
  allowSelfSelection: boolean
}

export const DEFAULT_SORTITION_CONFIG: SortitionConfig = {
  minStake: 100,
  jurorCount: 3,
  hiddenVotes: false,
  sybilResistance: 'hybrid',  // PoH + stake + reputation
  allowSelfSelection: true,
}

/**
 * Selecciona jurados por sortition ponderada por stake
 * Requiere PoHIdentity activa (sybil resistance híbrido)
 */
export function selectJurorsBySortition(
  st: PohState,
  courtId: string,
  count: number,
  config: Partial<SortitionConfig> = {}
): Juror[] {
  const cfg = { ...DEFAULT_SORTITION_CONFIG, ...config }
  const court = DEFAULT_COURTS.find(c => c.id === courtId) || DEFAULT_COURTS[0]

  // Pool elegible: jurados registrados + identidades PoH activas con stake mínimo
  const eligibleJurors = st.jurors.filter(j => {
    // Verificar Sybil resistance
    if (cfg.sybilResistance === 'poh' || cfg.sybilResistance === 'hybrid') {
      const hasIdentity = st.identities.some(i => i.name === j.name && i.isActive)
      if (!hasIdentity) return false
    }
    if (cfg.sybilResistance === 'stake' || cfg.sybilResistance === 'hybrid') {
      if (j.stake < cfg.minStake) return false
    }
    if (cfg.sybilResistance === 'reputation' || cfg.sybilResistance === 'hybrid') {
      if (j.reputation < 50) return false
    }
    return j.courtIds.includes(courtId) && j.reputation > 0
  })

  if (eligibleJurors.length < count) {
    console.warn(`[Sortition] Only ${eligibleJurors.length} eligible jurors, need ${count}`)
    return eligibleJurors
  }

  // Weighted random selection por stake (Kleros-style)
  const totalStake = eligibleJurors.reduce((sum, j) => sum + j.stake, 0)
  const selected: Juror[] = []
  const remaining = [...eligibleJurors]

  while (selected.length < count && remaining.length > 0) {
    let rand = Math.random() * totalStake
    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].stake
      if (rand <= 0) {
        selected.push(remaining[i])
        remaining.splice(i, 1)
        totalStake -= selected[selected.length - 1].stake
        break
      }
    }
  }

  return selected
}

// ===== COURT LIFECYCLE MANAGEMENT =====
export interface CourtSession {
  courtId: string
  disputeId: string
  phase: 'evidence' | 'voting' | 'appeal' | 'resolved'
  phaseEndsAt: number
  selectedJurors: Juror[]
  votes: Record<string, JurorVerdict>
  evidence: EvidenceRecord[]
}

/**
 * Inicia sesión de court para una disputa
 */
export function startCourtSession(
  st: PohState,
  challengeId: string,
  courtId: string
): { state: PohState; session: CourtSession } {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge) throw new Error('Challenge not found')

  const court = DEFAULT_COURTS.find(c => c.id === courtId) || DEFAULT_COURTS[0]
  const jurors = selectJurorsBySortition(st, courtId, court.jurorCount)

  const session: CourtSession = {
    courtId,
    disputeId: challengeId,
    phase: 'evidence',
    phaseEndsAt: now() + court.evidencePeriodDays * 86400000,
    selectedJurors: jurors,
    votes: {},
    evidence: challenge.evidence,
  }

  const updatedChallenge: PohChallenge = {
    ...challenge,
    status: 'in_court',
    courtId,
    jurors: jurors.map(j => ({
      jurorId: j.id,
      verdict: 'abstencion' as JurorVerdict,
      stake: j.stake,
      reputation: j.reputation,
      timestamp: 0,
    })),
  }

  const updatedJurors = st.jurors.map(j =>
    jurors.some(sj => sj.id === j.id) ? { ...j, seated: true } : j
  )

  const updatedCourt = st.courts.map(c =>
    c.id === courtId ? { ...c, activeDisputeIds: [...c.activeDisputeIds, challengeId] } : c
  )

  return {
    state: {
      ...st,
      challenges: st.challenges.map(c => c.id === challengeId ? updatedChallenge : c),
      jurors: updatedJurors,
      courts: updatedCourt,
    },
    session,
  }
}

/**
 * Avanza fase de court (evidence → voting → appeal → resolved)
 */
export function advanceCourtPhase(
  st: PohState,
  challengeId: string,
  targetPhase: CourtSession['phase']
): PohState {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge || !challenge.courtId) throw new Error('Challenge not in court')

  const court = DEFAULT_COURTS.find(c => c.id === challenge.courtId)!
  let newPhaseEndsAt = 0

  switch (targetPhase) {
    case 'voting':
      newPhaseEndsAt = now() + court.votingPeriodDays * 86400000
      break
    case 'appeal':
      newPhaseEndsAt = now() + court.appealPeriodDays * 86400000
      break
    case 'resolved':
      newPhaseEndsAt = 0
      break
  }

  // La lógica real de transición de fase se manejaría en un scheduler externo
  // Aquí solo actualizamos metadata del challenge
  return {
    ...st,
    challenges: st.challenges.map(c =>
      c.id === challengeId ? { ...c, status: targetPhase === 'resolved' ? 'resolved' : 'in_court' } : c
    ),
  }
}

// ===== JUROR REPUTATION SYSTEM =====
// Isomorfo a Kleros: coherent jurors gain, incoherent lose
export function updateJurorReputation(
  st: PohState,
  challengeId: string,
  resolution: JurorVerdict
): PohState {
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge) return st

  const decay = 10  // base decay
  const bonus = 5   // base bonus

  const updatedJurors = st.jurors.map(j => {
    const vote = challenge.jurors.find(v => v.jurorId === j.id)
    if (!vote) return j

    if (vote.verdict === 'abstencion') return j

    if (vote.verdict === resolution) {
      // Coherente: bonus reputación
      return { ...j, reputation: j.reputation + bonus, coherentVotes: j.coherentVotes + 1 }
    } else {
      // Incoherente: decay reputación
      return { ...j, reputation: Math.max(0, j.reputation - decay) }
    }
  })

  return { ...st, jurors: updatedJurors }
}

// ===== CROWDFUNDING APPEALS (Kleros-style) =====
export interface CrowdfundContribution {
  id: string
  challengeId: string
  contributor: string
  side: 'appellant' | 'defendant'
  amount: number
  timestamp: number
}

export function contributeToAppeal(
  st: PohState,
  challengeId: string,
  contributor: string,
  side: 'appellant' | 'defendant',
  amount: number
): PohState {
  // En implementación completa, esto crearía una entrada en un registro de crowdfunding
  // Por ahora, solo validamos y retornamos estado (el tracking real sería en store)
  const challenge = st.challenges.find(c => c.id === challengeId)
  if (!challenge || challenge.status !== 'appealed') {
    throw new Error('Challenge not in appeal phase')
  }
  return st
}

/**
 * Distribuye recompensas de crowdfunding tras resolución final
 * Quienes aportaron al lado ganador reciben reward (Kleros-style)
 */
export function resolveCrowdfunding(
  st: PohState,
  challengeId: string,
  winningSide: 'appellant' | 'defendant'
): PohState {
  // TODO: Implementar con registro de contribuciones
  return st
}

// ===== HELPER: now =====
const now = () => Date.now()