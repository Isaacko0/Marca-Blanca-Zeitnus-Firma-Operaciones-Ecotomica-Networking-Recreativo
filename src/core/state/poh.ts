// Proof of Humanity / Kleros — Tipos de Dominio + Estado Inicial (offline-first, anfibio)
import type { EvidenceRecord, EvidenceKind, FactBand } from '@core/lib/evidence'
import type { JurorVerdict } from '@core/state/kleros'

// ===== Configuración PoH =====
export interface PohConfig {
  challengePeriodDays: number        // default 7
  minVouchesRequired: number         // default 1
  renewalPeriodDays: number          // default 365
  minJurorStake: number              // ZNU mínimo para ser jurado
  reputationDecay: number            // penalty por votar minoría (default 10)
  maxJurorsPerDispute: number        // default 9 (impar)
  appealCostBase: number             // ZNU base para apelar
  maxAppeals: number                 // default 3
}

// ===== Perfil PoH (offline-first) =====
export interface PoHProfile {
  id: string                         // Soulbound ID local (uuid)
  name: string
  videoHash: string                  // CID IPFS o hash local (SHA-256)
  photoHash: string
  walletAddress: string              // EVM address (0x...)
  submittedBy: string                // miembro que presentó
  submittedAt: number
  vouchedBy: VouchRecord[]           // vouchers recibidos
  status: PoHStatus
  currentChallengeId?: string
  includedAt?: number
  expiresAt?: number                 // timestamp expiración
  crossChainProof?: CrossChainProof  // si sincronizado con PoH global
  metadata?: Record<string, unknown> // extensible
}

export type PoHStatus =
  | 'pending'        // enviado, esperando vouch
  | 'vouched'        // vouch recibido, en challenge period
  | 'challenged'     // desafío activo
  | 'in_court'       // en juicio Kleros local
  | 'included'       // verificado, activo
  | 'rejected'       // rechazado
  | 'expired'        // expiración sin renovar
  | 'renewing'       // en proceso de renovación

// ===== Vouching Comunitario =====
export interface VouchRecord {
  id: string
  profileId: string
  voucher: string                    // nombre miembro nodo (firmó Social DNA)
  weight: number                     // peso reputacional (basado en AUT/CDS)
  timestamp: number
  note?: string                      // comentario opcional
}

// ===== Challenge / Disputa Local (estilo Kleros) =====
export interface PohChallenge {
  id: string
  profileId: string
  challenger: string
  reason: string
  evidence: EvidenceRecord[]         // reusa EvidenceModel de @core/lib/evidence
  status: ChallengeStatus
  createdAt: number
  courtId?: string                   // si escalado a court local
  jurors: JurorVote[]
  resolution?: string                // RAO text
  resolvedAt?: number
  appealed: boolean
  appealRound: number
  appealCostPaid: number             // ZNU pagado
}

export type ChallengeStatus =
  | 'open'           // periodo de challenge abierto
  | 'in_court'       // jurados seleccionados, votación en curso
  | 'resolved'       // veredicto emitido
  | 'appealed'       // apelado, esperando siguiente ronda
  | 'final'          // resuelto definitivamente (sin más apelaciones)

// ===== Jurado Local (stake ZNU, no PNK) =====
export interface Juror {
  id: string
  name: string
  stake: number                      // ZNU staked
  reputation: number                 // reputación (decay si minoría)
  totalVotes: number
  coherentVotes: number
  seated: boolean                    // si está en court activa
  courtIds: string[]                 // courts donde participa
}

export interface JurorVote {
  jurorId: string
  verdict: JurorVerdict
  stake: number
  reputation: number                 // snapshot al votar
  timestamp: number
}

// ===== Court Local (configuración) =====
export interface LocalCourt {
  id: string
  name: string
  minStake: number
  jurorCount: number                 // 3, 5, 9, 15... (impar)
  hiddenVotes: boolean
  appealCost: number
  maxAppeals: number
  activeDisputeIds: string[]
}

// ===== Soulbound ID Cross-Chain (read-only interface) =====
export interface CrossChainProof {
  chain: 'gnosis' | 'ethereum' | 'arbitrum' | 'local'
  contractAddress: string
  humanityId: string                 // bytes20 hex
  isClaimed: boolean
  claimedAt?: number
  blockNumber?: number
  txHash?: string
}

// ===== Identidad Incluida (Humano Verificado) =====
export interface PoHIdentity {
  id: string                         // = profile.id (Soulbound ID)
  name: string
  walletAddress: string
  includedAt: number
  expiresAt: number
  vouchesCount: number
  challengesWon: number
  challengesLost: number
  reputationScore: number            // score compuesto (vouches, antigüedad, disputes)
  crossChainProofs: CrossChainProof[]
  lastRenewalAt?: number
  renewalCount: number
  isActive: boolean
}

// ===== Price Discovery (Schelling Game) =====
export interface PriceEstimate {
  juror: string
  value: number                      // utilidad/precio estimado
  stake: number
}

export interface PriceDiscoveryResult {
  median: number
  rewarded: string[]                 // jurors dentro tolerancia
  penalized: string[]                // jurors fuera tolerancia
  tolerancePct: number
}

// ===== Estado Global PoH =====
export interface PohState {
  profiles: PoHProfile[]
  challenges: PohChallenge[]
  jurors: Juror[]
  courts: LocalCourt[]
  identities: PoHIdentity[]
  config: PohConfig
  // Métricas derivadas
  stats: PohStats
}

export interface PohStats {
  totalProfiles: number
  pendingVouch: number
  activeChallenges: number
  includedHumans: number
  expiredIdentities: number
  totalZNUStaked: number
  avgReputation: number
}

// ===== Factory: Estado Inicial =====
export function makePohState(): PohState {
  const defaultConfig: PohConfig = {
    challengePeriodDays: 7,
    minVouchesRequired: 1,
    renewalPeriodDays: 365,
    minJurorStake: 100,
    reputationDecay: 10,
    maxJurorsPerDispute: 9,
    appealCostBase: 50,
    maxAppeals: 3,
  }

  // Court por defecto (General Court local)
  const defaultCourt: LocalCourt = {
    id: 'court-general',
    name: 'General Court (Local)',
    minStake: 100,
    jurorCount: 3,
    hiddenVotes: false,
    appealCost: 50,
    maxAppeals: 3,
    activeDisputeIds: [],
  }

  // Jurado semilla
  const seedJuror: Juror = {
    id: 'juror-seed',
    name: 'Jurado Fundador',
    stake: 1000,
    reputation: 100,
    totalVotes: 0,
    coherentVotes: 0,
    seated: false,
    courtIds: ['court-general'],
  }

  return {
    profiles: [],
    challenges: [],
    jurors: [seedJuror],
    courts: [defaultCourt],
    identities: [],
    config: defaultConfig,
    stats: {
      totalProfiles: 0,
      pendingVouch: 0,
      activeChallenges: 0,
      includedHumans: 0,
      expiredIdentities: 0,
      totalZNUStaked: 1000,
      avgReputation: 100,
    },
  }
}

// ===== Helpers de Tipos =====
export const POH_STATUS_LABELS: Record<PoHStatus, string> = {
  pending: 'Pendiente Vouch',
  vouched: 'Vouchado → Challenge Period',
  challenged: 'Desafiado',
  in_court: 'En Juicio',
  included: 'Incluido ✓',
  rejected: 'Rechazado ✗',
  expired: 'Expirado',
  renewing: 'Renovando...',
}

export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  open: 'Abierto',
  in_court: 'En Court',
  resolved: 'Resuelto',
  appealed: 'Apelado',
  final: 'Final',
}

export const VERDICT_LABELS: Record<JurorVerdict, string> = {
  a_favor: 'A Favor',
  en_contra: 'En Contra',
  abstencion: 'Abstención',
}

export const EVIDENCE_KIND_WEIGHTS: Record<EvidenceKind, number> = {
  'aut.observation': 0.85,
  'cds.consensus': 0.80,
  'crm.signature-block': 0.80,
  'github.account-identity': 0.80,
  'crm.thread-reply': 0.85,
  'crm.meeting-attendance': 0.75,
  'web.cited-claim': 0.40,
  'search.cites-profile': 0.35,
  'profile.email-match': 0.70,
  'linkedin.employer-and-name': 0.65,
  'employer-only': 0.20,
  'handle.name-form': 0.30,
  'contradiction': 0.00,
}