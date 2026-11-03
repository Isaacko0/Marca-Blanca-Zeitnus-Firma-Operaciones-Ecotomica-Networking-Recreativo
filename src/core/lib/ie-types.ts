// ie-types.ts — Tipos completos del Protocolo IE (WhatMatters)
// Offline-first, anfibio, compatible con HSCSG v15 OS

import { IEWeightClass, IE_MAX_LEVEL, IEFundingMode } from './ie-constants';

export type IELevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
export type IEChallengeStatus = 'forming' | 'active' | 'completed' | 'closed';
export type IEMilestoneStatus = 'pending' | 'released';
export type IEApprovalStatus = 'pending' | 'approved' | 'rejected';
export type IESchemaKey = 'contribution' | 'consensus' | 'role' | 'impact';

// ============================================================================
// CHALLENGE
// ============================================================================

export interface IEChallenge {
  id: string;                           // UUID o challengeId como string
  funder: string;                       // DID Poh del financiador
  token: string;                        // 'ZNU' | 'USDC' | token address
  metaURI: string;                      // IPFS/URL descripción del desafío
  funded: bigint;                       // Fondos netos en escrow (base units)
  released: bigint;                     // Fondos ya liberados (base units)
  level: IELevel;                       // Profundidad actual de la red
  seedCount: number;                    // 0-3 semillas registradas
  milestones: IEMilestone[];
  status: IEChallengeStatus;
  fundingConfig: IEFundingConfig;
  createdAt: number;
  updatedAt: number;
}

export interface IEFundingConfig {
  mode: IEFundingMode;
  token: 'ZNU' | 'USDC' | string;
  priceParity?: number;                 // ZNU/USD oráculo (modo conectado)
  caasStreams?: string[];               // ['suscripcion', 'revenue_share', 'b2b', 'afiliados_verdes', 'educacion']
}

export interface CreateChallengeInput {
  funder: string;
  token: string;
  metaURI: string;
  milestones: CreateMilestoneInput[];
  fundingConfig: IEFundingConfig;
}

export interface CreateMilestoneInput {
  title: string;
  amount: bigint;                       // Tramo a liberar (neto, base units)
  approvalsRequired: number;            // Umbral consenso (1-N)
}

// ============================================================================
// MILESTONE
// ============================================================================

export interface IEMilestone {
  id: string;                           // milestoneId como string
  title: string;
  amount: bigint;                       // Tramo a liberar (neto)
  approvalsRequired: number;            // Umbral consenso
  approvals: number;                    // Consenso actual
  released: boolean;
  releasedAt?: number;
  a3AtRelease?: bigint;                 // Snapshot A3 para distribución lazy futura
  approvalsDetail?: MilestoneApproval[]; // Detalle por votante
}

export interface MilestoneApproval {
  voter: string;                        // DID del votante
  positionId: string;                   // PositionId del votante
  approvedAt: number;
  attestationUid?: string;              // UID atestación CONSENSUS
}

// ============================================================================
// POSITION (Árbol Triádico)
// ============================================================================

export interface IEPosition {
  id: string;                           // PositionId (uint256 como string)
  challengeId: string;
  holder: string;                       // DID Poh del titular
  parentId: string;                     // '0' para seeds
  depth: IELevel;                       // 1 = seeds
  childCount: number;                   // 0-3 hijos
  isCoordinator: boolean;               // Marcado por financiador
  stake: bigint;                        // Tokens staked (base units)
  giveReceived: bigint;                 // GIVE points recibidos totales
  weightClass: IEWeightClass;           // Derivada: full/low/mid
  effectiveWeight: bigint;              // class + stakeBonus + giveBonus
  createdAt: number;
  updatedAt: number;
}

// Cálculo de clase de peso por regla WhatMatters
export function ieCalculateWeightClass(position: IEPosition): IEWeightClass {
  if (position.depth === 1 || position.isCoordinator) return 'full';
  if (position.childCount === 0) return 'low';
  return 'mid';
}

// ============================================================================
// ATTESTATION (Soulbound, EAS-compatible)
// ============================================================================

export interface IEAttestation {
  uid: string;                          // keccak256 hash único
  schema: IESchemaKey;                  // Tipo de atestación
  attester: string;                     // DID del atestador
  recipient: string;                    // DID del sujeto (dueño reputación)
  time: number;                         // Unix timestamp
  revoked: boolean;
  data: string;                         // JSON stringified payload schema-specific
}

export interface AttestationPayloads {
  contribution: { workURI: string; challengeId: string; positionId: string };
  consensus: { challengeId: string; milestoneId: string; milestoneTitle: string };
  role: { challengeId: string; positionId: string; role: 'coordinator' | 'seed' | 'participant' };
  impact: { challengeId: string; milestoneId: string; certId: string; impact: bigint };
}

// ============================================================================
// IMPACT CERTIFICATE (Hypercert-style)
// ============================================================================

export interface IMImpactCert {
  id: string;                           // certId
  challengeId: string;
  milestoneId: string;
  uri: string;                          // Qué se logró (IPFS/URL)
  impact: bigint;                       // Fondos liberados (proxy magnitud)
  contributors: number;                 // Posiciones en red al mintear
  time: number;                         // Unix timestamp
  attestationUid?: string;              // UID atestación IMPACT
}

// ============================================================================
// GIVE ALLOCATION (Peer Scoring Coordinape-style)
// ============================================================================

export interface IEGiveAllocation {
  challengeId: string;
  fromPositionId: string;               // Dador
  toPositionId: string;                 // Receptor
  amount: bigint;                       // GIVE points (1-100 presupuesto)
  allocatedAt: number;
}

// ============================================================================
// STATE GLOBAL
// ============================================================================

export interface IEProtocolState {
  // Entidades principales
  challenges: Record<string, IEChallenge>;
  positions: Record<string, IEPosition>;           // indexado por positionId
  challengePositions: Record<string, string[]>;    // challengeId -> positionIds[]
  milestones: Record<string, IEMilestone>;         // milestoneId -> milestone
  
  // Atestaciones y reputación
  attestations: Record<string, IEAttestation>;     // indexado por uid
  receivedAttestations: Record<string, string[]>;  // recipient DID -> uids[]
  
  // Certificados impacto
  impactCerts: IMImpactCert[];
  certsOfChallenge: Record<string, string[]>;      // challengeId -> certIds[]
  
  // GIVE allocations
  giveAllocations: Record<string, IEGiveAllocation[]>; // challengeId -> allocations[]
  giveReceived: Record<string, bigint>;               // positionId -> total GIVE received
  giveUsed: Record<string, bigint>;                   // challengeId+allocator -> GIVE spent
  
  // Claims RCE
  claimable: Record<string, Record<string, bigint>>;  // challengeId -> holder -> amount
  
  // Métricas globales
  globalMetrics: IEGlobalMetrics;
  
  // UI State
  ui: IEUIState;
}

export interface IEGlobalMetrics {
  totalActiveChallenges: number;
  totalParticipants: number;
  totalFunded: bigint;
  totalReleased: bigint;
  totalRCEDistributed: bigint;
  avgNetworkDepth: number;
  coordinatorRatio: number;
  consensusRate: number;
  attestationCount: number;
  impactCertCount: number;
}

export interface IEUIState {
  selectedChallengeId?: string;
  selectedPositionId?: string;
  screen: 'dashboard' | 'workspace' | 'calculator' | 'certificates' | 'simulation';
  toasts: IEToast[];
}

export interface IEToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: number;
}

// ============================================================================
// VIEW TYPES (Para UI)
// ============================================================================

export interface IEChallengeSummary {
  id: string;
  title: string;                        // metaURI truncado
  funder: string;
  funded: bigint;
  released: bigint;
  level: IELevel;
  participantCount: number;
  milestoneCount: number;
  releasedMilestoneCount: number;
  status: IEChallengeStatus;
  createdAt: number;
}

export interface IEPositionView extends IEPosition {
  // Campos derivados para UI
  projectedPayout?: bigint;             // Próximo hito: (tramo * effectiveWeight) / A3
  children?: IEPositionView[];          // Para árbol recursivo
  giveBonus?: bigint;
  stakeBonus?: bigint;
}

export interface IETreeLayout {
  positions: IEPositionView[];
  edges: IETreeEdge[];
  width: number;
  height: number;
  maxDepth: number;
}

export interface IETreeEdge {
  from: string;    // parent positionId
  to: string;      // child positionId
}

export interface IEGiveFlow {
  from: string;           // holder address (lowercase)
  toPositionId: string;
  amount: bigint;
}

// ============================================================================
// AI AGENT TYPES
// ============================================================================

export interface IESynthesisInput {
  challengeTitle: string;
  milestoneTitle: string;
  contributions: string;                // Aportes/discusión del grupo
}

export interface IESynthesisResult {
  summary: string;
  recommendation: 'approve' | 'revise' | 'reject';
  rationale: string;
  openQuestions: string[];
  stub?: boolean;                       // true si modo stub (sin API key)
}

export interface IEReportInput {
  challengeTitle: string;
  milestones: IEMilestone[];
  contributions: string;
}

export interface IEReportResult {
  report: string;                       // Markdown
  stub?: boolean;
}

// ============================================================================
// SIMULATION TYPES
// ============================================================================

export interface IEGrowthProjection {
  level: IELevel;
  newPositions: bigint;
  cumulativePositions: bigint;
  coordinators: bigint;
  estimatedTimeDays?: number;           // Estimación opcional
}

export interface IERCEProjection {
  level: IELevel;
  fund: bigint;
  oneRCE: bigint;
  fullRCE: bigint;
  lowRCE: bigint;
  midRCE: bigint;
  totalParticipants: bigint;
}

export interface IESimulationInput {
  initialSeeds: number;                 // 1-3
  maxLevel: IELevel;
  estimatedFund: bigint;
  recruitmentFactor?: number;           // 1.5-2.5 (factor realista vs teórico 3)
}

export interface IESimulationResult {
  growth: IEGrowthProjection[];
  rceProjection: IERCEProjection[];
  totalParticipantsAtMax: bigint;
  estimatedCostPerRCE: bigint;
}