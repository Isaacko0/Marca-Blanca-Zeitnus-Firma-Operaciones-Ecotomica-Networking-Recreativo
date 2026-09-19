import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  BaseMaterial,
  CACVectors,
  Member,
  PlanCycle,
  PVSO,
  SensorReading,
  Talent,
  ValueFlow,
  ZNUState,
} from '@core/state/types'
import type {
  AgentNode, GoalNode, TaskNode, AuditEntry, AgentStatus, TaskStatus,
} from '@core/state/orchestration'
import type {
  CaaSTierKey, CaaSMembership, CaaSRevenueStream, CaaSPayout, CaaSAuditEntry,
} from '@core/state/caas'
import type {
  SoulState, BotAction, HeartbeatTask, BotChild, BotAuditEntry,
} from '@core/state/automaton'
import type { SolarpunkState, Offer, Need, ExchangeMedium } from '@core/state/solarpunk'
import type { ColaberryState, ColaberryChannel } from '@core/state/colaberry'
import type { PrioritizeState, Proposal } from '@core/state/prioritize'
import type { VestingState } from '@core/state/vesting'
import type { TrustState } from '@core/state/trustlines'
import type { TekitlState } from '@core/state/tekitl'
import type { SovereigntyState } from '@core/state/sovereignty'
import type { IntegralState } from '@core/state/integral'
import type { MundusState } from '@core/state/mundus'
import type { LifeState, GoalType, Effort, Area } from '@core/state/life'
import type { CivilizacionesState } from '@core/state/civilizaciones'
import type { CelulasState } from '@core/state/celulas'
import type { ColonyState, DomainKind } from '@core/state/colony'
import type { KlerosState, JurorVerdict } from '@core/state/kleros'
import type { AgenciaState } from '@core/state/agencia'
import type { GaiaState } from '@core/state/gaia'
import type { CredibilityState } from '@core/state/symbiosky'
import type { NextcloudState } from '@core/state/nextcloud'
import type { DemocracyState } from '@core/state/democracia'
import type { LearningState } from '@core/state/learning'
import type { OracleState } from '@core/state/oracle'
import type { GaiaUnionState } from '@core/state/gaiaunion'
import type { DelegationState, DomainKey } from '@core/state/delegation'
import type { CapabilityState, CapabilityKey } from '@core/state/capacidades'
import type { EducationState } from '@core/state/education'
import type { EducaasState } from '@core/state/educaas'
import type { EVState } from '@core/state/ev'
import type { ALRACState } from '@core/state/alrac'
import { makeALRACState } from '@core/state/alrac'
import { autFromCAC, ics, pgsLM } from '@core/lib/metrics'
import { revenueShare } from '@core/lib/caas'
import { evaluateAction } from '@core/lib/automaton'
import {
  makeOffer, makeNeed, makeExchange, makeVouch, meshStatus,
  trustScore, evaluateSanctuary, makeSanctuary,
} from '@core/lib/solarpunk'
import { makeMessage, onboardMember, makeReminder } from '@core/lib/colaberry'
import { buildBerrySchedule, setBeneficiary, releasable, canRenounce } from '@core/lib/vesting'
import { openTrustline, increaseDebt, debitTransfer } from '@core/lib/trustlines'
import {
  createProject, transitionStage, addRole, applyToRole, acceptVolunteer,
  logHours, completeVolunteer, mintCoins, appendTimeline, declareTalent
} from '@core/lib/tekitl'
import { makeSovereigntyState, cellKey, patternTheoryScore } from '@core/lib/sovereignty'
import type { Evidence } from '@core/lib/evidence'
import { makeMundusState } from '@core/lib/mundus'
import { makeLifeState, addGoal, toggleNext, toggleCompleted, removeGoal, setNotes } from '@core/lib/life'
import { makeCivilizacionesState } from '@core/lib/civilizaciones'
import { makeCelulasState } from '@core/lib/celulas'
import {
  makeColonyState, addDomain, addReputation, movePot,
} from '@core/lib/colony'
import {
  makeKlerosState, seatJuror, openDispute, addEvidence, castVote, resolveDispute, appealDispute, attestIdentity,
} from '@core/lib/kleros'
import { makeAgenciaState, reversePlan } from '@core/lib/agencia'
import { makeGaiaState, addBounty, completeBounty, formCouncil } from '@core/lib/gaia'
import { makeCredibilityState, addProposal as symAddProposalFn, castVote as symCastVoteFn, createLock as symCreateLockFn, closeProposal as symCloseProposalFn, applyDecay as symApplyDecayFn, castCommit as symCastCommitFn, openReveal as symOpenRevealFn, revealVote as symRevealVoteFn } from '@core/lib/symbiosky'
import { makeNextcloudState } from '@core/state/nextcloud'
import { makeIntegralState, raiseIssue, raiseIssueWithEvidence, ratifyDecision, certifyDesign, logLabor, awardCredits, ingestSignal, recommend, promoteRecommendation, validateProposalScore } from '@core/lib/integral'
import { makeLearningState, completeChallenge, addChallenge } from '@core/lib/learning'
import { makeOracleState, askQuery, castOracleVote, resolveOracle } from '@core/lib/oracle'
import { makeDemocracyState, electRep } from '@core/lib/democracia'
import { makeGaiaUnionState } from '@core/lib/gaiaunion'
import { delegatePower, revokeDelegation } from '@core/lib/delegation'
import { toggleCapability } from '@core/lib/capacidades'
import { makeDelegationState } from '@core/state/delegation'
import { makeCapabilityState } from '@core/state/capacidades'
import { makeEducationState, createCourse as eduCreateCourse, enroll as eduEnroll, recordProgress as eduRecordProgress, issueCertificate as eduIssueCert, createAssessment as eduCreateAssessment, gradeByMerit as eduGradeMerit, verifyCertificate as eduVerifyCert } from '@core/lib/education'
import { makeEducaasState, setEducaasMode as eaSetMode, subscribe as eaSubscribe, cancelSubscription as eaCancel } from '@core/lib/educaas'
import type { SovereignCreditState } from '@core/state/sovereignCredit'
import type { RegenState } from '@core/state/regen'
import type { VecinalState } from '@core/state/vecinal'
import { makeSovereignCreditState, addAttestation as scAdd, setMode as scSetMode, exportAttestation as scExport, scoreOf as scScore } from '@core/lib/sovereignCredit'
import { makeRegenState, addEcoTech as rgAdd, catalogByCategory as rgCat, avgSaving as rgAvg } from '@core/lib/regen'
import { makeVecinalState, raisePropuesta as vRaise, castCommit as vCast, openReveal as vOpen, revealVote as vReveal, tally as vTally } from '@core/lib/vecinal'
import type { NostrRelayState } from '@core/state/nostrRelay'
import { makeNostrRelayState, publishLocal as nrPublish, setRelayConfig as nrSetCfg, connect as nrConnect, disconnect as nrDisconnect } from '@core/lib/nostrRelay'
import { makeAgentMeshState, spawnAgent as amSpawn, shareCompute as amShare, requestCompute as amRequest, remoteResurrect as amResurrect } from '@core/lib/agentMesh'
import type { NooaState } from '@core/state/nooa'
import { makeNooaState, spawnNooaAgent as nooaSpawn, addMethod as nooaAddMethod, hide as nooaHide, extendLib as nooaExtend } from '@core/state/nooa'
import type { ContentState } from '@core/state/content'
import { makeContentState, captureIdea as cCapture, scoreIdea as cScore, humanDecision as cDecision, ingestNews as cNews } from '@core/state/content'
import type { UsdgloState } from '@core/state/usdglo'
import { makeUsdgloState, setMode as uSetMode, mint as uMint, denylist as uDenylist } from '@core/state/usdglo'
import type { ProofOfResponseState } from '@core/state/proofOfResponse'
import { makeProofOfResponseState, issueRequest as porIssue, respond as porRespond, proveFailure as porProve, isSatisfied as porSatisfied } from '@core/lib/proofOfResponse'
import { dispatchMatch, autoAdvisory, applyDecisionTo, znuDecayOnBalance } from '@core/lib/pipeline'
import { createStoryProject, createStoryOutline, createStoryChapter, updateChapterContent } from '@core/lib/story'
import { createVisualPiece, createVisualPages } from '@core/lib/visual'
import { setExpression, toggleStreaming, grantConsent, revokeConsent } from '@core/lib/avatar'
import { addCanvasAgent, toggleAgentStatus, addAutomation, logCanvasAction } from '@core/lib/agentCanvas'
import { createComposition, addClip, togglePlayback, seekFrame } from '@core/lib/video'
import { createHighlightProject, addHighlight, exportHighlight } from '@core/lib/highlight'

import type { BrandDNAKey, ICPProfile } from '@core/lib/agencia'
import * as seed from '@core/state/seed'
import type { BoundariesState } from '@core/state/boundaries'
import { initialBoundaries, makeAuditRow } from '@core/state/boundaries'
import type { CoworkersState } from '@core/state/coworkers'
import { initialCoworkers, makeCoworker, makeChannel } from '@core/state/coworkers'

export interface AppState {
  // Navigation (reused from Cosateca OS shell)
  screen: string
  collapsed: boolean
  navOpen: boolean
  vw: number
  setScreen: (s: string) => void
  toggleCollapse: () => void
  toggleNav: () => void
  setVw: (v: number) => void

  // Overlays (reused from Cosateca OS shell)
  notif: boolean
  notifList: any[]
  acct: boolean
  acctMsg: string | null
  setAcctMsg: (m: string | null) => void
  coach: { open: boolean; busy: boolean; draft: string; messages: any[] }
  search: string
  brand: number
  brands: { id: string; name: string; handle: string; ini: string; logo?: string; accent?: string }[]
  brandsOff: number[]
  extraBrands: { id: string; name: string; handle: string; ini: string }[]
  // Life (asimilado de GuiFV/life)
  addLifeGoal: (input: { name: string; description?: string; type: GoalType; effort: Effort; area: Area; important: number; urgent: number; znu?: number; start?: string; end?: string }) => void
  toggleLifeNext: (id: string) => void
  toggleLifeCompleted: (id: string) => void
  removeLifeGoal: (id: string) => void
  setLifeNotes: (notes: string) => void
  // Mundus (asimilado de Sci-Hive datapoint "Mundus Live")
  setMundusManifesto: (text: string) => void
  setCelulas: (u: Partial<{ miembros: number; celdasInternas: number; grupoIntermedio: number; nota: string }>) => void
  // Idioma de la UI (ES / EN / PT-BR)
  lang: 'es' | 'en' | 'pt'
  setLang: (l: 'es' | 'en' | 'pt') => void
  // Modo Lucidez (Ley III: transparencia radical — tema diurno + datos crudos visibles)
  lucidez: boolean
  toggleLucidez: () => void
  setLucidez: (v: boolean) => void
  setBrand: (b: number) => void
  toggleBrandOff: (i: number) => void
  addExtraBrand: (b: { id: string; name: string; handle: string; ini: string }) => void
  toggleNotif: () => void
  setNotifList: (l: any[]) => void
  toggleAcct: () => void
  setCoach: (c: Partial<AppState['coach']>) => void
  addCoachMessage: (m: any) => void
  setCoachDraft: (d: string) => void
  setCoachBusy: (b: boolean) => void
  setSearch: (s: string) => void

  // ===== HSCSG v15 domain state =====
    nodeName: string
    base: BaseMaterial
    cac: CACVectors
    sensors: SensorReading[]
    members: Member[]
    flows: ValueFlow[]
    talents: Talent[]
    plans: PlanCycle[]
    pvsos: PVSO[]
    znu: ZNUState

    // ===== EV (E→V pattern) =====
        ev: EVState

        // ===== ALRAC (Consorcio de Transducción Soberana) =====
        alrac: ALRACState
        updateALRAC: (updates: Partial<ALRACState>) => void
        resetALRAC: () => void

      // ===== Orquestación (asimilado de Paperclip) =====
  agents: AgentNode[]
  goals: GoalNode[]
  tasks: TaskNode[]
  audit: AuditEntry[]

  // ===== CaaS (Community-as-a-Service reconciliado con MJ) =====
  caasTier: CaaSTierKey
  caasMembers: CaaSMembership[]
  caasStreams: CaaSRevenueStream[]
  caasPayouts: CaaSPayout[]
  caasAudit: CaaSAuditEntry[]

  // ===== Automaton (asimilado de Conway Research) =====
  soul: SoulState
  botActions: BotAction[]
  botHeartbeats: HeartbeatTask[]
  botChildren: BotChild[]
  botAudit: BotAuditEntry[]

  // ===== Solarpunk (asimilado de lizTheDeveloper + Isaacko0) =====
  solar: SolarpunkState

  // ===== Colaberry (asimilado de Eliza / HR_AI_Agent-collaberry-HSCSG) =====
  colaberry: ColaberryState

  // ===== Priorizar (asimilado de ZiadJ/prioritize) =====
  prio: PrioritizeState

  // ===== Vesting (asimilado de sepu85/collabberry-berry-vesting) =====
  vesting: VestingState

  // ===== Trustlines (asimilado de trustlines-protocol/contracts) =====
  trust: TrustState

  // ===== Tekitl (asimilado de Baruch4413/tekitl) =====
  tekitl: TekitlState

  // ===== Soberanía (asimilado de overkillkulture/sovereignty-hub + tairea/sovereignty-hub-ui) =====
  sovereignty: SovereigntyState

  // ===== Integral (asimilado de Integral Collective: 9 repos) =====
  integral: IntegralState

  // ===== Mundus (asimilado de Sci-Hive datapoint "Mundus Live") =====
  mundus: MundusState

  // ===== Life (asimilado de GuiFV/life, Django) =====
  life: LifeState

  // ===== Civilizaciones (horizontes postmonetarios: Auravana, One Community, TVP, RBE) =====
  civilizaciones: CivilizacionesState

  // ===== Células (Freedom Cells: tejido social fractal) =====
  celulas: CelulasState

  // ===== Colony (asimilado de JoinColony: gobernanza por dominios + pots) =====
  colony: ColonyState

  // ===== Kleros / Proof-of-Humanity (justicia como servicio + identidad soberana) =====
  kleros: KlerosState

  // ===== DeseOS / Contento.pro (método de agencia + arquitectura anfibia) =====
  agencia: AgenciaState

  // Modo anfibio del nodo: postmonetario (ZNU/CaaS) o conectado (USD/ReFi)
  nodeMode: 'postmonetario' | 'conectado'
  priceParity: number // ZNU -> USDC (oráculo ReFi, Nivel 3)

  // ===== Gaia Confederation (gobernanza biomimética + interoperabilidad) =====
    gaia: GaiaState
    // Symbiosky: credibilidad por convicción
    symbiosky: CredibilityState
    // Nextcloud: soberanía de datos
    nextcloud: NextcloudState
    // Democracia DPoS por expertise (iambrainstorming) = CDS
    democracia: DemocracyState
    // Aprendizaje por retos (iambrainstorming)
    aprender: LearningState
    // Oráculo de hechos (Kleros/Realitio)
    oraculo: OracleState
    // Gaia Union (organismo vivo regenerativo)
    gaiaunion: GaiaUnionState

  // Power Delegation (AuroraGov + Symbiosky): liquid democracy local por dominio
  delegation: DelegationState
  // Capabilities (CompAI CRM): optional by default, jardín cerrado offline
  capacidades: CapabilityState
  // Educación postmonetaria (Didacta Community asimilado)
  education: EducationState
  // Educaas: monetización educativa anfibia (Didacta billing/subscriptions)
  educaas: EducaasState
  // Urbanika asimilado
  sovereignCredit: SovereignCreditState
  regen: RegenState
  vecinal: VecinalState
  // block/buzz asimilado
  nostrRelay: NostrRelayState
  agentMesh: AgentMeshState
  // NVIDIA OO-Agents (NOOA) asimilado — capa agente-orobjeto isomorfa a agentMesh + Leyes MJ
  nooa: NooaState
  // ContentCreation-OS asimilado — co-pilot de contenido anfibio (gate humano = Ley III MJ)
  content: ContentState
  // usdglo (Glo Foundation USDGLO) asimilado — oráculo priceParity ReFi Nivel 3 anfibio
  usdglo: UsdgloState
  // NEAR asimilado
  proofOfResponse: ProofOfResponseState
  // Conector de flujo: params sembrados para la siguiente pantalla (auto-llenado)
  stageSeeds: Record<string, Record<string, unknown>>
  // actions
  updateBase: (u: Partial<BaseMaterial>) => void
  updateCAC: (u: Partial<CACVectors>) => void
  addSensor: (s: Omit<SensorReading, 'id' | 'ts'>) => void
  addMember: (m: Omit<Member, 'id'>) => void
  toggleMemberDNA: (id: string) => void
  addFlow: (f: Omit<ValueFlow, 'id' | 'ts'>) => void
  toggleTalent: (id: string) => void
  togglePlanDone: (cycleId: number, actionId: string) => void
  addPVSO: (p: Omit<PVSO, 'id' | 'ts'>) => void
  updateZNU: (u: Partial<ZNUState>) => void
  // orquestación
  addAgent: (a: Omit<AgentNode, 'id' | 'lastHeartbeatAt'>) => void
  setAgentStatus: (id: string, status: AgentStatus, reason?: string | null) => void
  heartbeatAgent: (id: string) => void
  addGoal: (g: Omit<GoalNode, 'id'>) => void
  setGoalStatus: (id: string, status: GoalNode['status']) => void
  addTask: (t: Omit<TaskNode, 'id' | 'createdAt' | 'updatedAt'>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  approveTask: (id: string) => void
  logAudit: (e: AuditEntry) => void
  // CaaS
  setCaasTier: (t: CaaSTierKey) => void
  addCaasMember: (m: Omit<CaaSMembership, 'id'>) => void
  toggleCaasStream: (key: CaaSRevenueStream['key']) => void
  setCaasStreamCtx: (key: CaaSRevenueStream['key'], usdcIn: number, znuOut: number, touchesBaseMaterial: boolean) => void
  runCaasPayout: (baseZNU: number) => void
  logCaasAudit: (e: CaaSAuditEntry) => void
  // Automaton
  setSoul: (s: Partial<SoulState>) => void
  proposeAction: (a: Omit<BotAction, 'id' | 'ts' | 'pass' | 'law' | 'reason' | 'status'>) => void
  setActionStatus: (id: string, status: BotAction['status']) => void
  runBotHeartbeat: (id: string) => void
  spawnBotChild: (baseMaterialTarget: string) => void
  logBotAudit: (e: BotAuditEntry) => void
  // Solarpunk
  addOffer: (resource: string, kind: Offer['kind'], from: string) => void
  addNeed: (resource: string, kind: Need['kind'], by: string) => void
  doExchange: (offerId: string, needId: string, medium: ExchangeMedium, znuAmount?: number) => void
  addVouch: (from: string, to: string, weight: number) => void
  setMesh: (online: boolean, peers: number) => void
  activateSanctuary: (reason: string, by: string) => void
  // Colaberry
  addColaberryMessage: (channel: ColaberryChannel, from: 'human' | 'colaberry', text: string, pass: boolean, law: 'I' | 'II' | 'III' | undefined, reason: string) => void
  onboardMember: (memberName: string, channel: ColaberryChannel, signedSocialDNA: boolean) => void
  addReminder: (channel: ColaberryChannel, text: string) => void
  // Priorizar
  addRequest: (title: string, description: string, isBasicNeed: boolean, priority: number, quantity: number) => void
  addProposal: (title: string, requestId: string, steps: Proposal['steps'], netBenefit: number, priority: number, riskFactor: number) => void
  addFeedback: (proposalId: string, rating: number, confidence: number, comment: string) => void
  // Vesting
  setVestingBeneficiary: (beneficiary: string) => void
  claimVesting: () => void
  renounceVestingOwner: () => void
  // Trustlines
  openTrustline: (a: string, b: string, creditGiven: number, creditReceived: number, interestRate: number) => void
  increaseTrustDebt: (a: string, creditor: string, value: number) => void
  doDebitTransfer: (path: string[], value: number, maxFee?: number) => void
  // Tekitl
  createProject: (title: string, goal: string, ownerId: string, coinsGoal?: number) => void
  transitionProjectStage: (projectId: string, to: 'planning' | 'execution' | 'completed' | 'aborted') => void
  addProjectRole: (projectId: string, occupation: string, hoursEstimated: number) => void
  applyToProjectRole: (projectId: string, roleId: string, userId: string) => void
  acceptVolunteer: (volunteerId: string) => void
  logVolunteerHours: (volunteerId: string, hours: number) => void
  completeVolunteer: (volunteerId: string) => void
  potenciarProject: (projectId: string, fromUserId: string, toUserId: string, amount: number) => void
  appendProjectNote: (projectId: string, actorId: string, note: string) => void
  declareTalent: (userId: string, occupation: string, confidence: number, yearsExp: number) => void
  // Soberanía
  setSovereigntyAnswer: (pillar: number, layer: number, phase: 'none' | 'survive' | 'build' | 'scale') => void
  computePatternScore: () => void
  // Integral
  raiseIntegralIssue: (title: string, raisedBy: string) => void
  raiseIntegralIssueWithEvidence: (title: string, raisedBy: string, evidence: Evidence[]) => void
  ratifyIntegralDecision: (issueId: string, decision: string, context: string, reasoning: string, supersedes?: string) => void
  certifyIntegralDesign: (title: string, ecoScore: number) => void
  logIntegralLabor: (projectId: string, participant: string, hours: number) => void
  awardIntegralCredits: (participant: string, raw: number, ageDays?: number) => void
  ingestIntegralSignal: (fromSystem: 'CDS' | 'OAD' | 'ITC' | 'COS' | 'FRS', severity: 'info' | 'warning' | 'critical', finding: string) => void
  recommendIntegral: (finding: string, target: 'CDS' | 'OAD' | 'ITC' | 'COS' | 'FRS') => void
  promoteRecommendation: (recId: string) => void
  // Colony (JoinColony)
  addColonyDomain: (name: string, kind: DomainKind, parentId: string) => void
  addColonyReputation: (id: string, amount: number) => void
  moveColonyPot: (fromId: string, toId: string, amount: number, by: string) => void
  // Kleros / Proof-of-Humanity
  seatKlerosJuror: (name: string) => void
  openKlerosDispute: (title: string, description: string, openedBy: string) => void
  addKlerosEvidence: (disputeId: string, author: string, text: string, kind?: any, sourceUrl?: string) => void
  castKlerosVote: (disputeId: string, jurorId: string, verdict: JurorVerdict) => void
  resolveKlerosDispute: (disputeId: string, resolution: string) => void
  appealKlerosDispute: (disputeId: string) => void
  attestKlerosIdentity: (name: string, attestedBy: string) => void
  // DeseOS / Contento.pro
  setBrandDNA: (key: BrandDNAKey, value: string) => void
  setOfferPrice: (id: string, field: 'znuPrice' | 'usdPrice', amount: number) => void
  addICP: (icp: ICPProfile) => void
  setPlanMeta: (meta: number) => void
  setNodeMode: (mode: 'postmonetario' | 'conectado') => void
  setPriceParity: (p: number) => void
  // Gaia Confederation
  addCircle: (name: string, size: number) => void
  addCapital: (kind: import('@core/lib/gaia').CapitalKind, amount: number) => void
  setRegenMetric: (key: 'ecosystemHealth' | 'communityWellbeing' | 'systemicResilience', value: number) => void
  addBounty: (title: string, need: string, znuReward: number) => void
  completeBounty: (id: string) => void
  formCouncil: (topic: string, members: string) => void
  // Symbiosky
  symAddProposal: (title: string, author: string) => void
  symCastVote: (proposalId: string, voter: string, score: number, conviction: 1 | 2 | 3 | 4 | 5) => void
  symCreateLock: (voter: string, lockedZNU: number, level: 1 | 2 | 3 | 4 | 5, lockDays: number) => void
  symCloseProposal: (proposalId: string) => void
  symDecayTick: () => void
  // Symbiosky commit-reveal (Shivarthu)
  symCommitVote: (proposalId: string, voter: string, score: number, conviction: 1 | 2 | 3 | 4 | 5, salt: string) => void
  symOpenReveal: (proposalId: string) => void
  symRevealVote: (proposalId: string, voter: string, score: number, conviction: 1 | 2 | 3 | 4 | 5, salt: string) => void
  // Voto por Mérito (Shivarthu en CDS)
  validateIntegralMerit: (issueId: string, reputation: number, experience: number, externality: number) => void
  // Democracia
  electDeptRep: (deptId: string, rep: string, voter: string) => void
  // Aprender
  completeChallenge: (id: string) => void
  addLearningChallenge: (title: string, topic: string, znuReward: number) => void
  // Educación (Didacta Community asimilado)
  createEduCourse: (title: string, level: 'basico' | 'medio' | 'avanzado', evidenceRequired?: boolean) => void
  enrollEdu: (courseId: string, memberId: string) => void
  recordEduProgress: (courseId: string, memberId: string, progress: number) => void
  issueEduCertificate: (courseId: string, memberId: string) => void
  createEduAssessment: (courseId: string, rubric: { criterion: string; meritWeight: number }[]) => void
  gradeEduByMerit: (assessmentId: string, reputation: number, experience: number, externality: number) => { meritWeight: number; weightedScore: number }
  verifyEduCertificate: (certId: string) => boolean
  // Educaas (anfibio)
  setEducaasMode: (mode: 'postmonetario' | 'conectado', parity?: number) => void
  subscribeEducaas: (memberId: string, planId: string) => void
  cancelEducaas: (memberId: string) => void
  // SovereignCredit (Urbanika DeFi-Adoption-IRL)
  addAttestation: (subject: string, issuer: string, claim: string, weight: number) => void
  setSovereignMode: (mode: 'postmonetario' | 'conectado') => void
  exportSovereignAttestation: (memberId: string) => { memberId: string; score: number; portable: boolean }
  sovereignScore: (memberId: string) => number
  // Regen (Urbanika Directorio_Regen + Nidori)
  addEcoTech: (name: string, category: string, provider: string, description: string) => void
  regenCatalog: () => Record<string, { id: string; name: string; category: string; provider: string; description: string }[]>
  regenAvgSaving: () => number
  // Vecinal (Urbanika Gobernanza Vecinal E5M)
  raiseVecinal: (barrioId: string, title: string) => void
  castVecinalCommit: (propId: string, voter: string, choice: 'si' | 'no') => void
  openVecinalReveal: (propId: string) => void
  revealVecinalVote: (propId: string, voter: string, choice: 'si' | 'no') => void
  vecinalTally: (propId: string) => { si: number; no: number; approved: boolean }
  // NostrRelay (block/buzz)
  publishNostr: (ev: unknown) => void
  setRelayCfg: (cfg: { url?: string; community?: string; localOnly?: boolean }) => void
  connectRelay: (url: string) => void
  disconnectRelay: () => void
  // AgentMesh (block/buzz)
  spawnAgent: (pubkey: string, name: string, body?: 'local' | 'remote' | 'disposable') => void
  shareAgentCompute: (memberId: string, resource: string) => void
  requestAgentCompute: (agentId: string) => { ok: boolean; resource?: string }
  resurrectAgent: (agentId: string) => void
  // NOOA (NVIDIA OO-Agents)
  spawnNooaAgent: (name: string, opts?: Partial<Omit<import('@core/state/nooa').NooaAgent, 'id' | 'name' | 'methods' | 'fields' | 'libs'>>) => void
  addNooaMethod: (agentId: string, m: Omit<import('@core/state/nooa').NooaMethod, 'visibility'> & { visibility?: 'visible' | 'hidden' }) => void
  hideNooa: (agentId: string, name: string) => void
  extendNooaLib: (agentId: string, lib: string) => void
  // ContentCreation-OS (co-pilot contenido anfibio)
  captureIdea: (text: string, opts?: { source?: 'cli' | 'telegram' | 'nostr' | 'rss'; lane?: string }) => void
  scoreIdea: (ideaId: string, brandFit: number, angles: string[]) => void
  decideIdea: (ideaId: string, decision: 'approved' | 'rejected') => void
  ingestNews: (items: { title: string; url: string; keyword: string; date: string }[]) => void
  // usdglo (oráculo USDGLO ReFi Nivel 3)
  setUsdgloMode: (connected: boolean) => void
  mintUsdglo: (to: string, amount: number) => void
  denylistUsdglo: (actor: string) => void
  // Proof of Response (NEAR AI)
  issuePor: (from: string, to: string, payload: string, deadlineB?: number) => void
  respondPor: (requestId: string, responder: string, payload: string) => void
  provePorFailure: (requestId: string, reason: string) => void
  porSatisfied: (requestId: string) => boolean
  askOracle: (question: string, outcomes: string[]) => void
  castOracleVote: (queryId: string, juror: string, outcome: string, stake: number) => void
  resolveOracleQuery: (queryId: string) => void
  // Gaia Union (organismo vivo)
  setEpigeneticMode: (mode: 'estable' | 'adaptativo') => void
  // Power Delegation
  delegatePower: (from: string, to: string, domain: DomainKey, weight?: number) => void
  revokeDelegation: (from: string, domain: DomainKey) => void
  // Capabilities
  toggleCapability: (key: CapabilityKey) => void
  // Conector de flujo
  seedStage: (target: string, params: Record<string, unknown>) => void
  pipeDispatch: (needTitle: string, assignee: string) => void
  pipeAdvisory: (finding: string, severity?: 'info' | 'warning' | 'critical') => void
  pipeApply: (drId: string) => void
  pipeDecay: () => void
  // Boundaries (policy gateway anfibio inspirado en OpenBot) — gobernanza de acciones de agente
  boundaries: BoundariesState
  setBoundaryPolicy: (policy: Partial<BoundariesState['policy']>) => void
  addBoundaryRule: (list: 'deny' | 'allow', expr: string) => void
  removeBoundaryRule: (list: 'deny' | 'allow', index: number) => void
  clearBoundaryAudit: () => void
  logBoundaryAudit: (row: Omit<import('@core/lib/boundaries').AuditRow, 'id' | 'ts'>) => void
  // Coworkers (agentes con perfil durable + handover humano, inspirado en OpenBot)
  coworkers: CoworkersState
  addCoworker: (input: { name: string; title: string; role: string; visibility?: 'private' | 'public' }) => void
  toggleCoworkerHidden: (id: string) => void
  setCoworkerControl: (id: string, control: { by: string; since: number; reason?: string } | null) => void
  startChannel: (coworkerId: string) => string
  postToChannel: (channelId: string, from: 'human' | 'bot', text: string) => void
  resetAll: () => void
}

const initialBase: BaseMaterial = {
  tierra_ha: 0,
  agua_l_dia: 0,
  energia_kwh_dia: 0,
  comida_kg_dia: 0,
  herramientas_fabship: 0,
  semillas_criollas: 0,
  usdc_reserva: 0,
}

const initialCAC: CACVectors = { ALIM: 0, ENER: 0, SALU: 0, HABI: 0, PROD: 0 }

const initialTalents: Talent[] = [
  { id: 'food', name: 'FoodSystemsAgent', vector: 'ALIM', func: 'Planifica siembra, riego, cosecha, compost, semillas', active: false },
  { id: 'aqua', name: 'AquaponicsOptimizer', vector: 'ALIM', func: 'Gestiona acuaponía: peces + plantas + agua + nutrientes', active: false },
  { id: 'season', name: 'SeasonalCyclePlanner', vector: 'ALIM', func: 'Sincroniza ciclos estacionales', active: false },
  { id: 'energy', name: 'EnergyOptimizer', vector: 'ENER', func: 'Gestiona microgrid: generación, almacenamiento, carga', active: false },
  { id: 'micro', name: 'MicrogridScheduler', vector: 'ENER', func: 'Programa cargas desplazables', active: false },
  { id: 'hydro', name: 'HydrogenManager', vector: 'ENER', func: 'Electrolizador + almacenamiento H₂ (fase 2+)', active: false },
  { id: 'repair', name: 'ElectronicsRepairer', vector: 'PROD', func: 'Repara inversores, controladores, sensores (FABSHIP)', active: false },
  { id: 'sensor', name: 'MolecularSensorAssembler', vector: 'PROD', func: 'Ensambla sensores SVD v2', active: false },
  { id: 'bio', name: 'BioReactiveFabricator', vector: 'PROD', func: 'Fabrica con micelio, bioplásticos, compostables', active: false },
  { id: 'health', name: 'CommunityHealth', vector: 'SALU', func: 'Botica viva + telemedicina DTN + formación cuidadores', active: false },
  { id: 'tele', name: 'TelemedicinaDTN', vector: 'SALU', func: 'Consulta offline-first + recetas botica viva', active: false },
  { id: 'mesh', name: 'DTNMeshManager', vector: 'COMU', func: 'Despliega nodo mesh LoRa/WiFi/BLE + bridge DTN', active: false },
  { id: 'quant', name: 'QuantumDTNManager', vector: 'REDES', func: 'Entrelazamiento cuántico + sincronía (URBION)', active: false },
  { id: 'zcs', name: 'ZCSOracle', vector: 'FINA', func: 'Paridad local ZNU/USDC + demurrage + Splitter', active: false },
  { id: 'fondo', name: 'FondoSolarpunkManager', vector: 'FINA', func: 'Threshold bucket + overflow + REO + ξ₀', active: false },
  { id: 'onto', name: 'OntogenesisPlanner', vector: 'TRANSVERSAL', func: 'Genera eventos ontogenéticos válidos', active: false },
  { id: 'ethical', name: 'EthicalGuard', vector: 'TRANSVERSAL', func: 'D-check + CGC veto + SO* detection', active: false },
  { id: 'rao', name: 'RAOKeeper', vector: 'TRANSVERSAL', func: 'Registra eventos PI→HOC→SUI→Ontogénesis', active: false },
]

const initialPlans: PlanCycle[] = [
  {
    id: 1,
    name: 'CICLO 1 — BASE MATERIAL',
    actions: [
      { id: 'c1w1', week: 1, text: 'Asegurar tierra 3-5 ha con agua + sol + acceso legal', done: false, owner: 'Isaac + 2 socios' },
      { id: 'c1w1b', week: 1, text: 'Instalar microgrid v0.1 (2kW + 10kWh)', done: false, owner: 'Energía + FABSHIP' },
      { id: 'c1w2', week: 2, text: 'Montar FABSHIP v0.1 (impresora 3D + láser + CNC + soldadora)', done: false, owner: 'Maker' },
      { id: 'c1w3', week: 3, text: 'Preparar 200 m² huerta biointensiva + compost', done: false, owner: 'Agrónomo + colectivo' },
      { id: 'c1pv', week: 4, text: 'PVSO CICLO 1: medir AUT_ALIM/ENER/HABI/SALU (target ALIM≥0.5)', done: false, owner: 'Autómata + humano' },
    ],
  },
  {
    id: 2,
    name: 'CICLO 2 — COLECTIVO ONTOGENÉTICO',
    actions: [
      { id: 'c2w5', week: 5, text: 'Onboarding 5-10 miembros: firma Social DNA + 20h/sem + 500 ZNU', done: false, owner: 'Isaac + facilitador' },
      { id: 'c2w5b', week: 5, text: 'CDS operacional: 2 decisiones reales (calendario, reglas huerta)', done: false, owner: 'Colectivo' },
      { id: 'c2w6', week: 6, text: 'ValueFlows circulando: 50+ eventos (LaborFlow, RepairFlow...)', done: false, owner: 'Autómata v0.1' },
      { id: 'c2w7', week: 7, text: 'Autómata v0.1 en hardware local (Jetson Orin + Pi5)', done: false, owner: 'DevOps' },
      { id: 'c2pv', week: 8, text: 'PVSO CICLO 2: PGS, ICS, η, ξ (target PGS≥1.5)', done: false, owner: 'Autómata + FRS' },
    ],
  },
  {
    id: 3,
    name: 'CICLO 3 — LUCIDEZ MATERIAL',
    actions: [
      { id: 'c3w9', week: 9, text: 'Micro-SaaS rediseñado: 80% biofísico + CAC en <5 min', done: false, owner: 'Dev + Agrónomo' },
      { id: 'c3w9b', week: 9, text: 'AI Wrapper entrenado SOLO con datos del Nodo v0.1', done: false, owner: 'AI Engineer' },
      { id: 'c3w10', week: 10, text: 'Productized Service 1: Auditoría Base Material 7 días', done: false, owner: 'Isaac + 2 técnicos' },
      { id: 'c3w11', week: 11, text: 'Revenue Demo v0.1: visita 1d + taller 2d en Nodo real', done: false, owner: 'Colectivo' },
      { id: 'c3pv', week: 12, text: 'PVSO CICLO 3: IVC, ROE Alignment, MCI, PMRTE (target PGS≥2.0)', done: false, owner: 'Autómata + FRS + CDS' },
    ],
  },
]

const uid = () => Math.random().toString(36).slice(2, 9)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      screen: 'home',
      collapsed: false,
      navOpen: false,
      vw: typeof window !== 'undefined' ? window.innerWidth : 1200,
      setScreen: (s) => set({ screen: s }),
      toggleCollapse: () => set((st) => ({ collapsed: !st.collapsed })),
      toggleNav: () => set((st) => ({ navOpen: !st.navOpen })),
      setVw: (v) => set({ vw: v }),

      notif: false,
      notifList: [
        { type: 'info', title: 'CaaS · Acceso disponible', body: 'Tu contribución AUT del mes habilita 3 vectores de acceso (ALIM, ENER, SALU).', time: 'hace 2h', onClick: () => {} },
        { type: 'success', title: 'Vesting · Tramo liberado', body: 'Se liberaron 15.000 ZNU de tu allocation de 100.000. Reclamables ahora.', time: 'hace 5h', onClick: () => {} },
        { type: 'warning', title: 'Soberanía · Pilar Water en build', body: 'Falta redundancia de bombeo. Sube la fase en /soberania para cerrar el eslabón débil.', time: 'ayer', onClick: () => {} },
        { type: 'alert', title: 'Trustlines · Límite cercano', body: 'La línea Isaac↔Luz alcanzó el 60% del crédito mutuo. Considera saldar o ampliar.', time: 'ayer', onClick: () => {} },
        { type: 'info', title: 'Integral · Loop en salud 78/100', body: 'FRS reporta 1 señal crítica en OAD (eco-assessment de baterías). Promovida a issue.', time: 'hace 2d', onClick: () => {} },
      ],
      acct: false,
      acctMsg: null,
      brand: 0,
      brands: [{ id: 'node0', name: 'HSCSG v15 OS', handle: '@cosateca', ini: 'HS' }],
      brandsOff: [],
      extraBrands: [],
      coach: { open: false, busy: false, draft: '', messages: [] },
      search: '',
      lang: 'es',
      lucidez: false,
      toggleLucidez: () => set((st) => {
        const v = !st.lucidez
        if (typeof document !== 'undefined') {
          if (v) document.documentElement.dataset.lucidez = 'on'
          else delete document.documentElement.dataset.lucidez
        }
        return { lucidez: v }
      }),
      setLucidez: (v) => set(() => {
        if (typeof document !== 'undefined') {
          if (v) document.documentElement.dataset.lucidez = 'on'
          else delete document.documentElement.dataset.lucidez
        }
        return { lucidez: v }
      }),

      // ===== Life (asimilado de GuiFV/life) =====
      addLifeGoal: (input) =>
        set((st) => ({ life: addGoal(st.life, input) })),
      toggleLifeNext: (id) =>
        set((st) => ({ life: toggleNext(st.life, id) })),
      toggleLifeCompleted: (id) =>
        set((st) => ({ life: toggleCompleted(st.life, id) })),
      removeLifeGoal: (id) =>
        set((st) => ({ life: removeGoal(st.life, id) })),
      setLifeNotes: (notes) =>
        set((st) => ({ life: setNotes(st.life, notes) })),
      setMundusManifesto: (text) =>
        set((st) => ({ mundus: { ...st.mundus, manifesto: text } })),
      setCelulas: (u) =>
        set((st) => ({ celulas: { ...st.celulas, ...u } })),
      setLang: (l) => set({ lang: l }),
      toggleNotif: () => set((st) => ({ notif: !st.notif })),
      setNotifList: (l) => set({ notifList: l }),
      toggleAcct: () => set((st) => ({ acct: !st.acct })),
      setAcctMsg: (m) => set({ acctMsg: m }),
      setBrand: (b) => set({ brand: b }),
      toggleBrandOff: (i) => set((st) => {
        const cur = [...st.brandsOff]
        const k = cur.indexOf(i)
        if (k >= 0) cur.splice(k, 1)
        else cur.push(i)
        return { brandsOff: cur }
      }),
      addExtraBrand: (b) => set((st) => ({ extraBrands: [...st.extraBrands, b] })),
      setCoach: (c) => set((st) => ({ coach: { ...st.coach, ...c } })),
      addCoachMessage: (m) => set((st) => ({ coach: { ...st.coach, messages: [...st.coach.messages, m] } })),
      setCoachDraft: (d) => set((st) => ({ coach: { ...st.coach, draft: d } })),
      setCoachBusy: (b) => set((st) => ({ coach: { ...st.coach, busy: b } })),
      setSearch: (s) => set({ search: s }),

      nodeName: 'Nodo Cosateca v0.1',
      base: seed.seedBase,
      boundaries: initialBoundaries,
      coworkers: initialCoworkers,
      cac: seed.seedCAC,
      sensors: [],
      members: seed.seedMembers,
      flows: seed.seedFlows,
      talents: initialTalents,
      plans: initialPlans,
      pvsos: seed.seedPVSO,
      znu: { perMember: 100, demurrageThreshold: 300, demurrageRate: 0.05, priceParity: 1 },
      // Orquestación (asimilado de Paperclip: control plane de agentes)
      agents: seed.seedAgents,
      goals: seed.seedGoals,
      tasks: seed.seedTasks,
      audit: seed.seedAudit,
      // CaaS (Community-as-a-Service reconciliado con MJ)
      caasTier: 'custodio' as CaaSTierKey,
      caasMembers: seed.seedCaasMembers,
      caasStreams: seed.seedCaasStreams,
      caasPayouts: seed.seedCaasPayouts,
      caasAudit: seed.seedCaasAudit,
      // Automaton (asimilado de Conway Research)
      soul: seed.seedSoul,
      botActions: seed.seedBotActions,
      botHeartbeats: seed.seedBotHeartbeats,
      botChildren: seed.seedBotChildren,
      botAudit: seed.seedBotAudit,
      // Solarpunk (asimilado de lizTheDeveloper + Isaacko0)
      solar: seed.seedSolar,
      // Colaberry (asimilado de Eliza / HR_AI_Agent-collaberry-HSCSG)
      colaberry: {
        persona: { name: 'Colaberry', bio: 'Colaborador soberano del nodo HSCSG. Acompaño la regeneración de la base material y la cohesión del colectivo.', valuesMJ: 'Ley I: no dañar base material ni personas · Ley II: ganarse la vida soberanizando · Ley III: lucidez, nunca engañar.', tone: 'cálido, directo, sin jerga financiera, postmonetario' },
        channels: ['chat_colectivo', 'solarpunk', 'orquestacion'],
        messages: [],
        onboardings: [{ id: 'ob1', memberName: 'Isaac Ko', signedSocialDNA: true, channel: 'chat_colectivo', ts: Date.now() - 86400000 }],
        reminders: [{ id: 'rm1', channel: 'orquestacion', text: 'Heartbeat huerta: revisar riego', done: false, ts: Date.now() - 3600000 }],
      },
      // Priorizar (asimilado de ZiadJ/prioritize)
      prio: {
        communityResources: [
          { id: 'r_water', title: 'Agua', measurementType: 'Volume', quantityAvailable: 800, monthlyCapacity: 900 },
          { id: 'r_energy', title: 'Energía', measurementType: 'Energy', quantityAvailable: 5.2, monthlyCapacity: 6 },
          { id: 'r_food', title: 'Comida', measurementType: 'Weight', quantityAvailable: 18, monthlyCapacity: 20 },
          { id: 'r_tools', title: 'Herramientas FABSHIP', measurementType: 'Units', quantityAvailable: 12, monthlyCapacity: 1 },
        ],
        requests: [
          { id: 'req1', title: 'Asegurar agua potable diaria', description: 'Necesidad básica del colectivo', isBasicNeed: true, priority: 90, quantity: 1, proposalIds: ['prop1'] },
          { id: 'req2', title: 'Ampliar huerta de comida', description: 'Subir AUT alimentaria', isBasicNeed: false, priority: 60, quantity: 1, proposalIds: ['prop2'] },
        ],
        proposals: [
          { id: 'prop1', title: 'Sistema de captación + filtro', requestId: 'req1', netBenefit: 0.9, netFeasibility: 0.8, priority: 90, riskFactor: 2, steps: [
            { id: 's1a', title: 'Instalar cisterna', duration: 3, riskFactor: 2, costs: [{ id: 'c1', title: 'Herramientas', communityResourceId: 'r_tools', quantity: 2, monetaryValue: 0 }] },
            { id: 's1b', title: 'Conectar filtro', duration: 1, riskFactor: 1, costs: [{ id: 'c2', title: 'Agua prueba', communityResourceId: 'r_water', quantity: 50, monetaryValue: 0 }] },
          ] },
          { id: 'prop2', title: 'Bancal de 20m² + composta', requestId: 'req2', netBenefit: 0.7, netFeasibility: 0.6, priority: 60, riskFactor: 1, steps: [
            { id: 's2a', title: 'Preparar suelo', duration: 2, riskFactor: 1, costs: [{ id: 'c3', title: 'Herramientas', communityResourceId: 'r_tools', quantity: 1, monetaryValue: 0 }, { id: 'c4', title: 'Agua riego', communityResourceId: 'r_water', quantity: 200, monetaryValue: 0 }] },
          ] },
        ],
        feedbacks: [
          { id: 'fb1', proposalId: 'prop1', rating: 4, confidence: 3, comment: 'Factible y necesario' },
          { id: 'fb2', proposalId: 'prop2', rating: 3, confidence: 2, comment: 'Buenón, falta semilla' },
        ],
      },
      // Vesting (asimilado de sepu85/collabberry-berry-vesting)
      // t0 = ~2.5 años atrás para que el demo muestre tramos ya liberados (estilo Berry: A 30% meses 25-30, pausa, B 70% meses 37-43)
      vesting: {
        token: 'ZNU',
        schedule: buildBerrySchedule(Date.now() - 900 * 86400000, 100000),
        beneficiary: 'Isaac Ko',
        claimed: 15000,
        beneficiarySetDeadline: Date.now() - 870 * 86400000,
        ownerRenounced: false,
      },
      // Trustlines (asimilado de trustlines-protocol/contracts)
      // Crédito mutuo ZNU entre pares del colectivo (sin emisor central). Deuda bilateral simétrica.
      trust: {
        trustlines: [
          { id: 'tl1', a: 'Isaac Ko', b: 'Luz', creditGiven: 500, creditReceived: 300, interestRate: 0 },
          { id: 'tl2', a: 'Luz', b: 'Tobías', creditGiven: 400, creditReceived: 400, interestRate: 0 },
          { id: 'tl3', a: 'Tobías', b: 'Eva', creditGiven: 250, creditReceived: 200, interestRate: 0 },
        ],
        // deuda[a][b] = a debe a b. Isaac debe 200 a Luz; Luz debe 150 a Tobías (enrutable Isaac→Luz→Tobías)
        debts: {
          'Isaac Ko': { Luz: 200 },
          Luz: { 'Isaac Ko': -200, Tobías: 150 },
          Tobías: { Luz: -150 },
        },
        transfers: [],
      },
      // Tekitl (asimilado de Baruch4413/tekitl)
      // Proyectos colaborativos + moneda social (coins) + talentos/portafolio.
      tekitl: {
        projects: [
          { id: 'p1', title: 'Huerta Comunitaria', goal: 'Autosuficiencia alimentaria del nodo', stage: 'execution', ownerId: 'Isaac Ko', coinsReceived: 350, coinsGoal: 1000, createdAt: Date.now() - 30*86400000 },
          { id: 'p2', title: 'Taller de Reparación', goal: 'Economía circular: reparar antes de comprar', stage: 'planning', ownerId: 'Luz', coinsReceived: 0, coinsGoal: 500, createdAt: Date.now() - 5*86400000 },
        ],
        roles: [
          { id: 'r1', projectId: 'p1', occupation: 'Carpintero', hoursEstimated: 40, volunteers: [] },
          { id: 'r2', projectId: 'p1', occupation: 'Agricultor', hoursEstimated: 60, volunteers: [] },
          { id: 'r3', projectId: 'p2', occupation: 'Electricista', hoursEstimated: 20, volunteers: [] },
        ],
        volunteers: [
          { id: 'v1', userId: 'Luz', roleId: 'r1', status: 'active', hoursLogged: 18 },
          { id: 'v2', userId: 'Tobías', roleId: 'r2', status: 'completed', hoursLogged: 60 },
          { id: 'v3', userId: 'Eva', roleId: 'r3', status: 'applied', hoursLogged: 0 },
        ],
        coins: [
          { id: 'c1', projectId: 'p1', fromUserId: 'Tobías', toUserId: 'Isaac Ko', amount: 100, reason: 'potenciar', ts: Date.now() - 20*86400000 },
          { id: 'c2', projectId: 'p1', fromUserId: 'Eva', toUserId: 'Isaac Ko', amount: 50, reason: 'potenciar', ts: Date.now() - 15*86400000 },
          { id: 'c3', projectId: 'p1', fromUserId: 'Luz', toUserId: 'Isaac Ko', amount: 200, reason: 'potenciar', ts: Date.now() - 5*86400000 },
        ],
        timeline: [
          { id: 't1', projectId: 'p1', type: 'stage_change', actorId: 'Isaac Ko', payload: { from: 'planning', to: 'execution' }, ts: Date.now() - 25*86400000 },
          { id: 't2', projectId: 'p1', type: 'role_created', actorId: 'Isaac Ko', payload: { roleId: 'r1', occupation: 'Carpintero' }, ts: Date.now() - 24*86400000 },
          { id: 't3', projectId: 'p1', type: 'volunteer_joined', actorId: 'Luz', payload: { roleId: 'r1' }, ts: Date.now() - 20*86400000 },
          { id: 't4', projectId: 'p1', type: 'coins_minted', actorId: 'Tobías', payload: { toUserId: 'Isaac Ko', amount: 100 }, ts: Date.now() - 20*86400000 },
        ],
        talents: [
          { id: 'tal1', userId: 'Isaac Ko', occupation: 'Organizador Comunitario', confidence: 5, yearsExp: 8 },
          { id: 'tal2', userId: 'Luz', occupation: 'Carpintero', confidence: 4, yearsExp: 12 },
          { id: 'tal3', userId: 'Tobías', occupation: 'Agricultor', confidence: 5, yearsExp: 15 },
          { id: 'tal4', userId: 'Eva', occupation: 'Electricista', confidence: 3, yearsExp: 5 },
        ],
      },
      // Soberanía (asimilado de overkillkulture/sovereignty-hub + tairea/sovereignty-hub-ui)
      // 13 pilares × 7 capas × 3 fases = diagnóstico de base material del nodo (isomorfo a Materialismo Jerárquico).
      sovereignty: makeSovereigntyState(),
      // Integral (asimilado de Integral Collective: 9 repos)
      // Loop cerrado postmonetario: CDS→OAD→COS→ITC→FRS→CDS. Filosofía de coordinación del nodo.
      integral: makeIntegralState(),
      // Mundus (asimilado de Sci-Hive datapoint "Mundus Live")
      mundus: makeMundusState(),
      // Life (asimilado de GuiFV/life, Django)
      life: makeLifeState(),
      // Civilizaciones (horizontes postmonetarios: Auravana, One Community, TVP, RBE)
      civilizaciones: makeCivilizacionesState(),
      // Células (Freedom Cells): tejido social fractal
      celulas: makeCelulasState(),
      // Colony (JoinColony): gobernanza por dominios + pots
      colony: makeColonyState(),
      // Kleros / Proof-of-Humanity: justicia como servicio + identidad soberana
      kleros: makeKlerosState(),
      // DeseOS / Contento.pro: método de agencia + modo anfibio
      agencia: makeAgenciaState(),
      nodeMode: 'postmonetario',
      priceParity: 0.02, // 1 ZNU ~ 0.02 USDC (oráculo ReFi de referencia)

      // Gaia Confederation
      gaia: makeGaiaState(),
      // Symbiosky: credibilidad por convicción
      symbiosky: makeCredibilityState(),
      // Nextcloud: soberanía de datos
      nextcloud: makeNextcloudState(),
      // Democracia DPoS por expertise
      democracia: makeDemocracyState(),
      // Aprendizaje por retos
      aprender: makeLearningState(),
      // Oráculo de hechos
      oraculo: makeOracleState(),
      // Gaia Union (organismo vivo regenerativo)
      gaiaunion: makeGaiaUnionState(),
      // Power Delegation (AuroraGov + Symbiosky)
      delegation: makeDelegationState(),
            // Capabilities (CompAI CRM)
            capacidades: makeCapabilityState(),
            // Educación postmonetaria (Didacta) + Educaas anfibio
            education: makeEducationState(),
            educaas: makeEducaasState(),
            // Urbanika asimilado
            sovereignCredit: makeSovereignCreditState(),
            regen: makeRegenState(),
            vecinal: makeVecinalState(),
            // block/buzz asimilado
            nostrRelay: makeNostrRelayState(),
            agentMesh: makeAgentMeshState(),
            nooa: makeNooaState(),
            content: makeContentState(),
            usdglo: makeUsdgloState(),
            // NEAR asimilado
            proofOfResponse: makeProofOfResponseState(),
            // E→V (asimilado de E→V Documento Maestro v1.0)
                        ev: makeEVState(),
                        // ALRAC (Consorcio de Transducción Soberana)
                        alrac: makeALRACState(),
                        // Conector de flujo
            stageSeeds: {},

      setNodeName: (n: string) => set({ nodeName: n }),
      updateBase: (u) => set((st) => ({ base: { ...st.base, ...u } })),
      updateCAC: (u) => set((st) => ({ cac: { ...st.cac, ...u } })),
      addSensor: (s) => set((st) => ({ sensors: [...st.sensors, { ...s, id: uid(), ts: Date.now() }] })),
      addMember: (m) => set((st) => ({ members: [...st.members, { ...m, id: uid() }] })),
      toggleMemberDNA: (id) => set((st) => ({
        members: st.members.map((m) => (m.id === id ? { ...m, signedSocialDNA: !m.signedSocialDNA } : m)),
      })),
      addFlow: (f) => set((st) => ({ flows: [...st.flows, { ...f, id: uid(), ts: Date.now() }] })),
      toggleTalent: (id) => set((st) => ({
        talents: st.talents.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
      })),
      togglePlanDone: (cycleId, actionId) => set((st) => ({
        plans: st.plans.map((c) =>
          c.id === cycleId
            ? { ...c, actions: c.actions.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a)) }
            : c,
        ),
      })),
      addPVSO: (p) => set((st) => ({ pvsos: [...st.pvsos, { ...p, id: uid(), ts: Date.now() }] })),
      updateZNU: (u) => set((st) => ({ znu: { ...st.znu, ...u } })),
      // ---- Orquestación (Paperclip-assimilado) ----
      addAgent: (a) => set((st) => ({ agents: [...st.agents, { ...a, id: uid(), lastHeartbeatAt: null }] })),
      setAgentStatus: (id, status, reason) => set((st) => ({
        agents: st.agents.map((a) => (a.id === id ? { ...a, status, pauseReason: status === 'paused' ? (reason ?? a.pauseReason) : null } : a)),
      })),
      heartbeatAgent: (id) => set((st) => ({ agents: st.agents.map((a) => (a.id === id ? { ...a, lastHeartbeatAt: Date.now() } : a)) })),
      addGoal: (g) => set((st) => ({ goals: [...st.goals, { ...g, id: uid() }] })),
      setGoalStatus: (id, status) => set((st) => ({ goals: st.goals.map((g) => (g.id === id ? { ...g, status } : g)) })),
      addTask: (t) => set((st) => ({ tasks: [...st.tasks, { ...t, id: uid(), createdAt: Date.now(), updatedAt: Date.now() }] })),
      setTaskStatus: (id, status) => set((st) => ({ tasks: st.tasks.map((t) => (t.id === id ? { ...t, status, updatedAt: Date.now() } : t)) })),
      approveTask: (id) => set((st) => ({ tasks: st.tasks.map((t) => (t.id === id ? { ...t, approved: true, updatedAt: Date.now() } : t)) })),
      logAudit: (e) => set((st) => ({ audit: [e, ...st.audit].slice(0, 200) })),
      // ---- CaaS (Community-as-a-Service reconciliado con MJ) ----
      setCaasTier: (t) => set({ caasTier: t }),
      addCaasMember: (m) => set((st) => ({ caasMembers: [...st.caasMembers, { ...m, id: uid() }] })),
      toggleCaasStream: (key) => set((st) => ({ caasStreams: st.caasStreams.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)) })),
      setCaasStreamCtx: (key, usdcIn, znuOut, touchesBaseMaterial) => set((st) => ({ caasStreams: st.caasStreams.map((s) => (s.key === key ? { ...s, usdcIn, znuOut, touchesBaseMaterial } : s)) })),
      runCaasPayout: (baseZNU) => set((st) => {
        const aut = autFromCAC(st.cac)
        const cds = ics(st.members, st.flows)
        const payouts = revenueShare(baseZNU, st.caasMembers, aut, cds)
        return { caasPayouts: [...payouts, ...st.caasPayouts].slice(0, 100) }
      }),
      logCaasAudit: (e) => set((st) => ({ caasAudit: [e, ...st.caasAudit].slice(0, 200) })),
      // ---- Automaton (asimilado de Conway Research) ----
      setSoul: (s) => set((st) => ({ soul: { ...st.soul, ...s, updatedAt: Date.now() } })),
      proposeAction: (a) => set((st) => {
        const aut = autFromCAC(st.cac)
        const pgs = pgsLM(aut)
        const pop = Math.max(st.members.filter((m) => m.signedSocialDNA).length, 1)
        const gate = evaluateAction(a.label, { pgs, pop, usdc: st.base.usdc_reserva, hitsBaseMaterial: /tierra|agua|energia|comida|herramientas|cuerpos|semillas/i.test(a.description) })
        return { botActions: [...st.botActions, { ...a, id: uid(), ts: Date.now(), pass: gate.pass, law: gate.law, reason: gate.reason, status: 'pending' }] }
      }),
      setActionStatus: (id, status) => set((st) => ({ botActions: st.botActions.map((a) => (a.id === id ? { ...a, status } : a)) })),
      runBotHeartbeat: (id) => set((st) => ({ botHeartbeats: st.botHeartbeats.map((h) => (h.id === id ? { ...h, lastRun: Date.now() } : h)) })),
      spawnBotChild: (baseMaterialTarget) => set((st) => ({ botChildren: [...st.botChildren, { id: uid(), name: `${st.soul.name}-hijo-${Math.floor(Math.random() * 90 + 10)}`, baseMaterialTarget, parentId: st.soul.id, constitutionMJ: true, spawnedAt: Date.now() }] })),
      logBotAudit: (e) => set((st) => ({ botAudit: [e, ...st.botAudit].slice(0, 200) })),
      // ---- Solarpunk (asimilado de lizTheDeveloper + Isaacko0) ----
      addOffer: (resource, kind, from) => set((st) => ({ solar: { ...st.solar, offers: [...st.solar.offers, makeOffer(resource, kind, from)] } })),
      addNeed: (resource, kind, by) => set((st) => ({ solar: { ...st.solar, needs: [...st.solar.needs, makeNeed(resource, kind, by)] } })),
      doExchange: (offerId, needId, medium, znuAmount = 0) => set((st) => ({ solar: { ...st.solar, exchanges: [...st.solar.exchanges, makeExchange(offerId, needId, medium, znuAmount)] } })),
      addVouch: (from, to, weight) => set((st) => ({ solar: { ...st.solar, vouches: [...st.solar.vouches, makeVouch(from, to, weight)] } })),
      setMesh: (online, peers) => set((st) => ({ solar: { ...st.solar, mesh: meshStatus(online, peers) } })),
      activateSanctuary: (reason, by) => set((st) => {
        const trust = trustScore(by, st.solar.vouches)
        const gate = evaluateSanctuary(reason, trust)
        if (!gate.pass) return {}
        return { solar: { ...st.solar, sanctuary: [makeSanctuary(reason, by), ...st.solar.sanctuary].slice(0, 50) } }
      }),
      // ---- Colaberry (asimilado de Eliza / HR_AI_Agent-collaberry-HSCSG) ----
      addColaberryMessage: (channel, from, text, pass, law, reason) => set((st) => ({
        colaberry: { ...st.colaberry, messages: [...st.colaberry.messages, makeMessage(channel, from, text, pass, law, reason)].slice(-50) },
      })),
      onboardMember: (memberName, channel, signedSocialDNA) => set((st) => ({
        colaberry: { ...st.colaberry, onboardings: [onboardMember(memberName, channel, signedSocialDNA), ...st.colaberry.onboardings].slice(0, 50) },
      })),
      addReminder: (channel, text) => set((st) => ({
        colaberry: { ...st.colaberry, reminders: [...st.colaberry.reminders, makeReminder(channel, text)] },
      })),
      // ---- Priorizar (asimilado de ZiadJ/prioritize) ----
      addRequest: (title, description, isBasicNeed, priority, quantity) => set((st) => ({
        prio: { ...st.prio, requests: [...st.prio.requests, { id: uid(), title, description, isBasicNeed, priority, quantity, proposalIds: [] }] },
      })),
      addProposal: (title, requestId, steps, netBenefit, priority, riskFactor) => set((st) => ({
        prio: { ...st.prio, proposals: [...st.prio.proposals, { id: uid(), title, requestId, steps, netBenefit, netFeasibility: 0, priority, riskFactor }] },
      })),
      addFeedback: (proposalId, rating, confidence, comment) => set((st) => ({
        prio: { ...st.prio, feedbacks: [...st.prio.feedbacks, { id: uid(), proposalId, rating, confidence, comment }] },
      })),
      // ---- Vesting (asimilado de sepu85/collabberry-berry-vesting) ----
      setVestingBeneficiary: (beneficiary) => set((st) => {
        const r = setBeneficiary(st.vesting, beneficiary, Date.now())
        if (!r.ok) return {} // rechaza si ya asignado o vencido (isomorfo al contrato)
        return { vesting: { ...st.vesting, beneficiary } }
      }),
      claimVesting: () => set((st) => {
        const amt = releasable(st.vesting.schedule, st.vesting.claimed, Date.now())
        if (amt <= 0 || !st.vesting.beneficiary) return {}
        return { vesting: { ...st.vesting, claimed: st.vesting.claimed + amt } }
      }),
      renounceVestingOwner: () => set((st) => {
        const r = canRenounce(st.vesting)
        if (!r.ok) return {}
        return { vesting: { ...st.vesting, ownerRenounced: true } }
      }),
      // ---- Trustlines (asimilado de trustlines-protocol/contracts) ----
      openTrustline: (a, b, creditGiven, creditReceived, interestRate) => set((st) => ({
        trust: { ...st.trust, trustlines: [...st.trust.trustlines, openTrustline(a, b, creditGiven, creditReceived, interestRate)] },
      })),
      increaseTrustDebt: (a, creditor, value) => set((st) => ({
        trust: { ...st.trust, debts: increaseDebt(st.trust.debts, a, creditor, value) },
      })),
      doDebitTransfer: (path, value, maxFee = 0) => set((st) => {
        const r = debitTransfer(st.trust, path, value, maxFee)
        if (!r.ok || !r.debts || !r.transfer) return {}
        return { trust: { ...st.trust, debts: r.debts, transfers: [...st.trust.transfers, r.transfer] } }
      }),
      // ---- Tekitl (asimilado de Baruch4413/tekitl) ----
      createProject: (title, goal, ownerId, coinsGoal = 1000) => set((st) => ({
        tekitl: { ...st.tekitl, projects: [...st.tekitl.projects, createProject(title, goal, ownerId, coinsGoal)] },
      })),
      transitionProjectStage: (projectId, to) => set((st) => {
        const proj = st.tekitl.projects.find(p => p.id === projectId)
        if (!proj) return {}
        const r = transitionStage(proj, to as 'planning' | 'execution' | 'completed' | 'aborted')
        if (!r.ok || !r.project || !r.event) return {}
        return { tekitl: { ...st.tekitl, projects: st.tekitl.projects.map(p => p.id === projectId ? r.project! : p), timeline: [...st.tekitl.timeline, r.event!] } }
      }),
      addProjectRole: (projectId, occupation, hoursEstimated) => set((st) => ({
        tekitl: {
          ...st.tekitl,
          roles: [...st.tekitl.roles, addRole(projectId, occupation, hoursEstimated)],
          timeline: [...st.tekitl.timeline, appendTimeline({ projectId, type: 'role_created', actorId: st.nodeName, payload: { occupation, hoursEstimated } })],
        },
      })),
      applyToProjectRole: (roleId, userId) => set((st) => {
        const vol = applyToRole(st.tekitl.volunteers, roleId, userId)
        if (!vol) return {}
        return { tekitl: { ...st.tekitl, volunteers: [...st.tekitl.volunteers, vol] } }
      }),
      acceptVolunteer: (volunteerId) => set((st) => {
        const idx = st.tekitl.volunteers.findIndex(v => v.id === volunteerId)
        if (idx === -1) return {}
        const vol = st.tekitl.volunteers[idx]
        const accepted = acceptVolunteer(vol)
        const v2 = [...st.tekitl.volunteers]
        v2[idx] = accepted
        return {
          tekitl: {
            ...st.tekitl,
            volunteers: v2,
            timeline: [...st.tekitl.timeline, appendTimeline({ projectId: vol.roleId, type: 'volunteer_joined', actorId: vol.userId, payload: { roleId: vol.roleId } })],
          },
        }
      }),
      logVolunteerHours: (volunteerId, hours) => set((st) => {
        const idx = st.tekitl.volunteers.findIndex(v => v.id === volunteerId)
        if (idx === -1) return {}
        const vol = st.tekitl.volunteers[idx]
        const updated = logHours(vol, hours)
        const v2 = [...st.tekitl.volunteers]
        v2[idx] = updated
        return { tekitl: { ...st.tekitl, volunteers: v2 } }
      }),
      completeVolunteer: (volunteerId) => set((st) => {
        const idx = st.tekitl.volunteers.findIndex(v => v.id === volunteerId)
        if (idx === -1) return {}
        const vol = st.tekitl.volunteers[idx]
        const completed = completeVolunteer(vol)
        const v2 = [...st.tekitl.volunteers]
        v2[idx] = completed
        return {
          tekitl: {
            ...st.tekitl,
            volunteers: v2,
            timeline: [...st.tekitl.timeline, appendTimeline({ projectId: vol.roleId, type: 'volunteer_completed', actorId: vol.userId, payload: { roleId: vol.roleId } })],
          },
        }
      }),
      potenciarProject: (projectId, fromUserId, toUserId, amount) => set((st) => ({
        tekitl: {
          ...st.tekitl,
          coins: [...st.tekitl.coins, mintCoins(projectId, fromUserId, toUserId, amount)],
          projects: st.tekitl.projects.map(p => p.id === projectId ? { ...p, coinsReceived: p.coinsReceived + amount } : p),
          timeline: [...st.tekitl.timeline, appendTimeline({ projectId, type: 'coins_minted', actorId: fromUserId, payload: { toUserId, amount } })],
        },
      })),
      appendProjectNote: (projectId, actorId, note) => set((st) => ({
        tekitl: {
          ...st.tekitl,
          timeline: [...st.tekitl.timeline, appendTimeline({ projectId, type: 'note', actorId, payload: { note } })],
        },
      })),
      declareTalent: (userId, occupation, confidence, yearsExp) => set((st) => ({
        tekitl: {
          ...st.tekitl,
          talents: [...st.tekitl.talents, declareTalent(userId, occupation, confidence, yearsExp)],
        },
      })),
      // ---- Soberanía (asimilado de overkillkulture/sovereignty-hub + tairea/sovereignty-hub-ui) ----
      setSovereigntyAnswer: (pillar, layer, phase) => set((st) => {
        const key = cellKey(pillar, layer)
        const answers = { ...st.sovereignty.answers, [key]: phase }
        return { sovereignty: { ...st.sovereignty, answers, patternScore: patternTheoryScore(answers) } }
      }),
      computePatternScore: () => set((st) => ({
        sovereignty: { ...st.sovereignty, patternScore: patternTheoryScore(st.sovereignty.answers) },
      })),
      // ---- Integral (asimilado de Integral Collective: 9 repos) ----
      raiseIntegralIssue: (title, raisedBy) => set((st) => ({
        integral: { ...st.integral, issues: [...st.integral.issues, raiseIssue(title, raisedBy)] },
      })),
      raiseIntegralIssueWithEvidence: (title, raisedBy, evidence) => set((st) => ({
        integral: { ...st.integral, issues: [...st.integral.issues, raiseIssueWithEvidence(title, raisedBy, evidence)] },
      })),
      ratifyIntegralDecision: (issueId, decision, context, reasoning, supersedes) => set((st) => {
        const r = ratifyDecision(st.integral.issues, issueId, decision, context, reasoning, supersedes)
        const issues = r.issue
          ? st.integral.issues.map((i) => (i.id === issueId ? r.issue! : i))
          : st.integral.issues
        return { integral: { ...st.integral, issues, decisions: [...st.integral.decisions, r.dr] } }
      }),
      certifyIntegralDesign: (title, ecoScore) => set((st) => ({
        integral: { ...st.integral, designs: [...st.integral.designs, certifyDesign(title, ecoScore)] },
      })),
      logIntegralLabor: (projectId, participant, hours) => set((st) => ({
        integral: { ...st.integral, labor: [...st.integral.labor, logLabor(projectId, participant, hours)] },
      })),
      awardIntegralCredits: (participant, raw, ageDays = 0) => set((st) => ({
        integral: { ...st.integral, credits: [...st.integral.credits, awardCredits(participant, raw, ageDays)] },
      })),
      ingestIntegralSignal: (fromSystem, severity, finding) => set((st) => ({
        integral: { ...st.integral, signals: [...st.integral.signals, ingestSignal(fromSystem, severity, finding)] },
      })),
      recommendIntegral: (finding, target) => set((st) => ({
        integral: { ...st.integral, recommendations: [...st.integral.recommendations, recommend(finding, target)] },
      })),
      promoteRecommendation: (recId) => set((st) => {
        const rec = st.integral.recommendations.find((r) => r.id === recId)
        if (!rec || rec.promotedToIssue) return {}
        const p = promoteRecommendation(rec)
        return {
          integral: {
            ...st.integral,
            recommendations: st.integral.recommendations.map((r) => (r.id === recId ? p.rec : r)),
            issues: [...st.integral.issues, p.issue],
          },
        }
      }),
      // ===== Colony (JoinColony) =====
      addColonyDomain: (name, kind, parentId) => set((st) => ({
        colony: addDomain(st.colony, { name, kind, parentId }),
      })),
      addColonyReputation: (id, amount) => set((st) => ({
        colony: addReputation(st.colony, id, amount),
      })),
      moveColonyPot: (fromId, toId, amount, by) => set((st) => ({
        colony: movePot(st.colony, fromId, toId, amount, by),
      })),
      // ===== Kleros / Proof-of-Humanity =====
      seatKlerosJuror: (name) => set((st) => ({ kleros: seatJuror(st.kleros, name) })),
      openKlerosDispute: (title, description, openedBy) => set((st) => ({
        kleros: openDispute(st.kleros, { title, description, openedBy }),
      })),
      addKlerosEvidence: (disputeId, author, text, kind?: any, sourceUrl?: string) => set((st) => ({
        kleros: addEvidence(st.kleros, disputeId, author, text, kind, sourceUrl),
      })),
      castKlerosVote: (disputeId, jurorId, verdict) => set((st) => ({
        kleros: castVote(st.kleros, disputeId, jurorId, verdict),
      })),
      resolveKlerosDispute: (disputeId, resolution) => set((st) => ({
        kleros: resolveDispute(st.kleros, disputeId, resolution),
      })),
      appealKlerosDispute: (disputeId) => set((st) => ({
        kleros: appealDispute(st.kleros, disputeId),
      })),
      attestKlerosIdentity: (name, attestedBy) => set((st) => ({
        kleros: attestIdentity(st.kleros, name, attestedBy),
      })),
      setBrandDNA: (key, value) => set((st) => ({
        agencia: { ...st.agencia, brand: { ...st.agencia.brand, [key]: value } },
      })),
      setOfferPrice: (id, field, amount) => set((st) => ({
        agencia: {
          ...st.agencia,
          offers: st.agencia.offers.map((o) => (o.id === id ? { ...o, [field]: amount } : o)),
        },
      })),
      addICP: (icp) => set((st) => ({
        agencia: { ...st.agencia, icps: [...st.agencia.icps, icp] },
      })),
      setPlanMeta: (meta) => set((st) => ({
        agencia: { ...st.agencia, plan: reversePlan(meta) },
      })),
      setNodeMode: (mode) => set({ nodeMode: mode }),
      setPriceParity: (p) => set({ priceParity: p }),
      addCircle: (name, size) => set((st) => ({
        gaia: { ...st.gaia, circles: [...st.gaia.circles, { id: `cir-${Date.now()}`, name, size }] },
      })),
      addCapital: (kind, amount) => set((st) => ({
        gaia: { ...st.gaia, capitals: { ...st.gaia.capitals, [kind]: st.gaia.capitals[kind] + amount } },
      })),
      setRegenMetric: (key, value) => set((st) => ({
        gaia: { ...st.gaia, metrics: { ...st.gaia.metrics, [key]: value } },
      })),
      addBounty: (title, need, znuReward) => set((st) => ({
        gaia: { ...st.gaia, bounties: addBounty(st.gaia.bounties, { id: `b-${Date.now()}`, title, need, znuReward, done: false }) },
      })),
      completeBounty: (id) => set((st) => ({
        gaia: { ...st.gaia, bounties: completeBounty(st.gaia.bounties, id) },
      })),
      formCouncil: (topic, members) => set((st) => ({
        gaia: { ...st.gaia, councils: formCouncil(st.gaia.councils, topic, members.split(',').map((m) => m.trim()).filter(Boolean)) },
      })),
      // ===== Symbiosky: credibilidad por convicción =====
      symAddProposal: (title, author) => set((st) => ({ symbiosky: symAddProposalFn(st.symbiosky, title, author) })),
      symCastVote: (proposalId, voter, score, conviction) => set((st) => ({ symbiosky: symCastVoteFn(st.symbiosky, proposalId, voter, score, conviction) })),
      symCreateLock: (voter, lockedZNU, level, lockDays) => set((st) => ({ symbiosky: symCreateLockFn(st.symbiosky, voter, lockedZNU, level, lockDays) })),
      symCloseProposal: (proposalId) => set((st) => ({ symbiosky: symCloseProposalFn(st.symbiosky, proposalId) })),
      symDecayTick: () => set((st) => ({ symbiosky: symApplyDecayFn(st.symbiosky, Date.now(), 365 * 86400000) })),
      // ===== Symbiosky commit-reveal (Shivarthu) =====
      symCommitVote: (proposalId, voter, score, conviction, salt) => set((st) => ({
        symbiosky: symCastCommitFn(st.symbiosky, proposalId, voter, score, conviction, salt),
      })),
      symOpenReveal: (proposalId) => set((st) => ({
        symbiosky: symOpenRevealFn(st.symbiosky, proposalId),
      })),
      symRevealVote: (proposalId, voter, score, conviction, salt) => set((st) => ({
        symbiosky: symRevealVoteFn(st.symbiosky, proposalId, voter, score, conviction, salt),
      })),
      // ===== Voto por Mérito (Shivarthu en CDS) =====
      validateIntegralMerit: (issueId, reputation, experience, externality) => set((st) => {
        const { weight } = validateProposalScore(reputation, experience, externality)
        return {
          integral: {
            ...st.integral,
            issues: st.integral.issues.map((i) =>
              i.id === issueId ? { ...i, merit: { reputation, experience, externality, weight } } : i,
            ),
          },
        }
      }),
      // ===== Educación postmonetaria (Didacta Community) =====
      createEduCourse: (title, level, evidenceRequired = true) => set((st) => ({
        education: eduCreateCourse(st.education, title, level, evidenceRequired),
      })),
      enrollEdu: (courseId, memberId) => set((st) => ({
        education: eduEnroll(st.education, courseId, memberId),
      })),
      recordEduProgress: (courseId, memberId, progress) => set((st) => ({
        education: eduRecordProgress(st.education, courseId, memberId, progress),
      })),
      issueEduCertificate: (courseId, memberId) => set((st) => ({
        education: eduIssueCert(st.education, courseId, memberId),
      })),
      createEduAssessment: (courseId, rubric) => set((st) => ({
        education: eduCreateAssessment(st.education, courseId, rubric),
      })),
      gradeEduByMerit: (assessmentId, reputation, experience, externality) => {
        let result = { meritWeight: 0, weightedScore: 0 }
        set((st) => {
          result = eduGradeMerit(st.education, assessmentId, reputation, experience, externality)
          return st
        })
        return result
      },
      verifyEduCertificate: (certId) => {
        let ok = false
        set((st) => { ok = eduVerifyCert(st.education, certId); return st })
        return ok
      },
      // ===== Educaas (monetización anfibia) =====
      setEducaasMode: (mode, parity = 0.01) => set((st) => ({
        educaas: eaSetMode(st.educaas, mode, parity),
      })),
      subscribeEducaas: (memberId, planId) => set((st) => ({
        educaas: eaSubscribe(st.educaas, memberId, planId),
      })),
      cancelEducaas: (memberId) => set((st) => ({
        educaas: eaCancel(st.educaas, memberId),
      })),
      // ===== SovereignCredit (Urbanika DeFi-Adoption-IRL) =====
      addAttestation: (subject, issuer, claim, weight) => set((st) => ({
        sovereignCredit: scAdd(st.sovereignCredit, subject, issuer, claim, weight),
      })),
      setSovereignMode: (mode) => set((st) => ({
        sovereignCredit: scSetMode(st.sovereignCredit, mode),
      })),
      exportSovereignAttestation: (memberId) => {
        let r = { memberId, score: 0, portable: false }
        set((st) => { r = scExport(st.sovereignCredit, memberId); return st })
        return r
      },
      sovereignScore: (memberId) => {
        let s = 0
        set((st) => { s = scScore(st.sovereignCredit, memberId); return st })
        return s
      },
      // ===== Regen (Urbanika Directorio_Regen + Nidori) =====
      addEcoTech: (name, category, provider, description) => set((st) => ({
        regen: rgAdd(st.regen, name, category, provider, description),
      })),
      regenCatalog: () => {
        let c: Record<string, { id: string; name: string; category: string; provider: string; description: string }[]> = {}
        set((st) => { c = rgCat(st.regen); return st })
        return c
      },
      regenAvgSaving: () => {
        let a = 0
        set((st) => { a = rgAvg(st.regen); return st })
        return a
      },
      // ===== Vecinal (Urbanika Gobernanza Vecinal E5M) =====
      raiseVecinal: (barrioId, title) => set((st) => ({
        vecinal: vRaise(st.vecinal, barrioId, title),
      })),
      castVecinalCommit: (propId, voter, choice) => set((st) => ({
        vecinal: vCast(st.vecinal, propId, voter, choice),
      })),
      openVecinalReveal: (propId) => set((st) => ({
        vecinal: vOpen(st.vecinal, propId),
      })),
      revealVecinalVote: (propId, voter, choice) => set((st) => ({
        vecinal: vReveal(st.vecinal, propId, voter, choice),
      })),
      vecinalTally: (propId) => {
        let t = { si: 0, no: 0, approved: false }
        set((st) => { t = vTally(st.vecinal, propId); return st })
        return t
      },
      // ===== NostrRelay + AgentMesh (block/buzz) =====
      publishNostr: (ev) => set((st) => ({
        nostrRelay: nrPublish(st.nostrRelay, ev as never),
      })),
      setRelayCfg: (cfg) => set((st) => ({
        nostrRelay: nrSetCfg(st.nostrRelay, cfg),
      })),
      connectRelay: (url) => set((st) => ({
        nostrRelay: nrConnect(st.nostrRelay, url),
      })),
      disconnectRelay: () => set((st) => ({
        nostrRelay: nrDisconnect(st.nostrRelay),
      })),
      spawnAgent: (pubkey, name, body) => set((st) => ({
        agentMesh: amSpawn(st.agentMesh, pubkey, name, body),
      })),
      shareAgentCompute: (memberId, resource) => set((st) => ({
        agentMesh: amShare(st.agentMesh, memberId, resource),
      })),
      requestAgentCompute: (agentId) => {
        let r = { ok: false }
        set((st) => { r = amRequest(st.agentMesh, agentId); return st })
        return r
      },
      resurrectAgent: (agentId) => set((st) => ({
        agentMesh: amResurrect(st.agentMesh, agentId),
      })),
      // ===== NOOA (NVIDIA OO-Agents) — capa agente-orobjeto =====
      spawnNooaAgent: (name, opts) => set((st) => ({
        nooa: nooaSpawn(st.nooa, name, opts),
      })),
      addNooaMethod: (agentId, m) => set((st) => ({
        nooa: nooaAddMethod(st.nooa, agentId, m),
      })),
      hideNooa: (agentId, name) => set((st) => ({
        nooa: nooaHide(st.nooa, agentId, name),
      })),
      extendNooaLib: (agentId, lib) => set((st) => ({
        nooa: nooaExtend(st.nooa, agentId, lib),
      })),
      // ===== ContentCreation-OS (co-pilot contenido anfibio) =====
      captureIdea: (text, opts) => set((st) => ({
        content: cCapture(st.content, text, opts),
      })),
      scoreIdea: (ideaId, brandFit, angles) => set((st) => ({
        content: cScore(st.content, ideaId, brandFit, angles),
      })),
      decideIdea: (ideaId, decision) => set((st) => ({
        content: cDecision(st.content, ideaId, decision),
      })),
      ingestNews: (items) => set((st) => ({
        content: cNews(st.content, items),
      })),
      // ===== usdglo (oráculo USDGLO ReFi Nivel 3 anfibio) =====
      setUsdgloMode: (connected) => set((st) => ({
        usdglo: uSetMode(st.usdglo, connected),
      })),
      mintUsdglo: (to, amount) => set((st) => ({
        usdglo: uMint(st.usdglo, to, amount),
      })),
      denylistUsdglo: (actor) => set((st) => ({
        usdglo: uDenylist(st.usdglo, actor),
      })),
      // ===== Proof of Response (NEAR AI) =====
      issuePor: (from, to, payload, deadlineB) => set((st) => ({
        proofOfResponse: porIssue(st.proofOfResponse, from, to, payload, deadlineB),
      })),
      respondPor: (requestId, responder, payload) => set((st) => ({
        proofOfResponse: porRespond(st.proofOfResponse, requestId, responder, payload),
      })),
      provePorFailure: (requestId, reason) => set((st) => ({
        proofOfResponse: porProve(st.proofOfResponse, requestId, reason),
      })),
      porSatisfied: (requestId) => {
        let ok = false
        set((st) => { ok = porSatisfied(st.proofOfResponse, requestId); return st })
        return ok
      },
      electDeptRep: (deptId, rep, voter) => set((st) => ({ democracia: electRep(st.democracia, deptId, rep, voter) })),
      // ===== Aprendizaje por retos (iambrainstorming) =====
      completeChallenge: (id) => set((st) => ({ aprender: completeChallenge(st.aprender, id) })),
      addLearningChallenge: (title, topic, znuReward) => set((st) => ({ aprender: addChallenge(st.aprender, title, topic, znuReward) })),
      // ===== Oráculo de hechos (Kleros/Realitio) -> lo cableo como alias de oracle =====
      askOracle: (question, outcomes) => set((st) => ({ oraculo: askQuery(st.oraculo, question, outcomes) })),
      castOracleVote: (queryId, juror, outcome, stake) => set((st) => ({ oraculo: castOracleVote(st.oraculo, queryId, juror, outcome, stake) })),
      resolveOracleQuery: (queryId) => set((st) => {
        const r = resolveOracle(st.oraculo, queryId)
        return { oraculo: r.state }
      }),
      // ===== Gaia Union (organismo vivo) =====
      setEpigeneticMode: (mode) => set((st) => ({ gaiaunion: { ...st.gaiaunion, epigeneticMode: mode } })),
      // ===== Power Delegation (AuroraGov + Symbiosky) =====
      delegatePower: (from, to, domain, weight = 1) => set((st) => ({
        delegation: delegatePower(st.delegation, from, to, domain, weight),
      })),
      revokeDelegation: (from, domain) => set((st) => ({
        delegation: revokeDelegation(st.delegation, from, domain),
      })),
      // ===== Capabilities (CompAI CRM) =====
      toggleCapability: (key) => set((st) => ({
        capacidades: toggleCapability(st.capacidades, key, st.nodeMode),
      })),
      // ===== Conector de flujo (auto-llenado entre pantallas) =====
      seedStage: (target, params) => set((st) => ({
        stageSeeds: { ...st.stageSeeds, [target]: params },
      })),
      // ===== Pipeline: actuator (CIERRA el loop) =====
            pipeDispatch: (needTitle, assignee) => set((st) => {
              const next = dispatchMatch(st.integral, needTitle, assignee)
              return { integral: next }
            }),
            pipeAdvisory: (finding, severity = 'warning') => set((st) => {
              const { state } = autoAdvisory(st.integral, finding, severity)
              // P1: si es concentración, aplica decay al balance derivado (anti-acumulación real)
              // znuBalanceFrom es computado desde credits (no duplica estado) -> no desincroniza
              return { integral: state }
            }),
            pipeApply: (drId) => set((st) => {
              const next = applyDecisionTo(st.integral, drId)
              return { integral: next }
            }),
            pipeDecay: () => set((st) => {
              const decayed = znuDecayOnBalance(st.integral)
              // el decay es informativo (el balance es derivado de credits); se registra señal FRS
              const sig = ingestSignal('ITC', 'info', `decay ZNU aplicado → balance ${Math.round(decayed)}`)
              return { integral: { ...st.integral, signals: st.integral.signals.concat(sig) } }
            }),
            // ===== ALRAC (Consorcio de Transducción Soberana) =====
            updateALRAC: (updates: Partial<ALRACState>) => set((st) => ({
              alrac: { ...st.alrac, ...updates },
            })),
            resetALRAC: () => set((st) => ({
              alrac: makeALRACState(),
            })),
            // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
      setBoundaryPolicy: (policy) => set((st) => ({
        boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },
      })),
      addBoundaryRule: (list, expr) => set((st) => {
        if (!expr.trim()) return {}
        return {
          boundaries: {
            ...st.boundaries,
            policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },
          },
        }
      }),
      removeBoundaryRule: (list, index) => set((st) => {
        const next = st.boundaries.policy[list].filter((_, i) => i !== index)
        return {
          boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },
        }
      }),
      clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),
      logBoundaryAudit: (row) => set((st) => {
        const full = makeAuditRow(row)
        return {
          boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },
        }
      }),
      // ===== Coworkers (inspirado en OpenBot) =====
      addCoworker: (input) => set((st) => ({
        coworkers: { ...st.coworkers, coworkers: [...st.coworkers.coworkers, makeCoworker(input)] },
      })),
      toggleCoworkerHidden: (id) => set((st) => ({
        coworkers: {
          ...st.coworkers,
          coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
        },
      })),
      setCoworkerControl: (id, control) => set((st) => ({
        coworkers: {
          ...st.coworkers,
          coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, control } : c)),
        },
      })),
      startChannel: (coworkerId) => {
        const ch = makeChannel(coworkerId)
        set((st) => ({ coworkers: { ...st.coworkers, channels: [...st.coworkers.channels, ch] } }))
        return ch.id
      },
      postToChannel: (channelId, from, text) => set((st) => ({
        coworkers: {
          ...st.coworkers,
          channels: st.coworkers.channels.map((ch) =>
            ch.id === channelId
              ? { ...ch, messages: [...ch.messages, { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, ts: Date.now() }] }
              : ch,
          ),
        },
      })),

      // ===== Story (MuMuAINovel) =====
      addStoryProject: (title, genre, synopsis) => set((st) => ({
        story: { ...st.story, projects: [...st.story.projects, createStoryProject(title, genre, synopsis)] },
      })),
      addStoryOutline: (projectId) => set((st) => ({
        story: { ...st.story, outlines: [...st.story.outlines, createStoryOutline(projectId)] },
      })),
      addStoryChapter: (projectId, order, title) => set((st) => ({
        story: { ...st.story, chapters: [...st.story.chapters, createStoryChapter(projectId, order, title)] },
      })),
      updateStoryChapter: (chapterId, newContent) => set((st) => ({
        story: { ...st.story, chapters: st.story.chapters.map(c => c.id === chapterId ? updateChapterContent(c, newContent) : c) },
      })),
      setActiveStory: (projectId) => set((st) => ({ story: { ...st.story, activeProject: projectId } })),

      // ===== Visual (RedInk) =====
      addVisualPiece: (title, description) => set((st) => ({
        visual: { ...st.visual, pieces: [...st.visual.pieces, createVisualPiece(title, description)] },
      })),
      addVisualPages: (pieceId, count = 5) => set((st) => ({
        visual: { ...st.visual, pieces: st.visual.pieces.map(p => p.id === pieceId ? { ...p, pages: createVisualPages(pieceId, count) } : p) },
      })),
      setActiveVisual: (pieceId) => set((st) => ({ visual: { ...st.visual, activePiece: pieceId } })),

      // ===== Avatar (PersonaLive) =====
      setAvatarExpression: (expr) => set((st) => ({ avatar: setExpression(st.avatar, expr) })),
      toggleAvatarStreaming: () => set((st) => ({ avatar: toggleStreaming(st.avatar) })),
      grantAvatarConsent: () => set((st) => ({ avatar: grantConsent(st.avatar) })),
      revokeAvatarConsent: () => set((st) => ({ avatar: revokeConsent(st.avatar) })),

      // ===== AgentCanvas (OpenHands) =====
      addCanvasAgent: (name, backend, capabilities) => set((st) => ({
        canvas: addCanvasAgent(st.canvas, name, backend, capabilities),
      })),
      toggleCanvasAgentStatus: (agentId) => set((st) => ({
        canvas: toggleAgentStatus(st.canvas, agentId),
      })),
      addCanvasAutomation: (name, schedule, agentId, task) => set((st) => ({
        canvas: addAutomation(st.canvas, name, schedule, agentId, task),
      })),
      logCanvasAction: (agentId, action, status) => set((st) => ({
        canvas: logCanvasAction(st.canvas, agentId, action, status),
      })),

      // ===== Video (Remotion) =====
      addVideoComposition: (title, duration = 30, fps = 30) => set((st) => ({
        video: { ...st.video, compositions: [...st.video.compositions, createComposition(title, duration, fps)] },
      })),
      addVideoClip: (compositionId, src, startFrame, duration, layer = 0) => set((st) => ({
        video: { ...st.video, compositions: st.video.compositions.map(c => c.id === compositionId ? addClip(c, src, startFrame, duration, layer) : c) },
      })),
      toggleVideoPlayback: () => set((st) => ({ video: togglePlayback(st.video) })),
      seekVideo: (frame) => set((st) => ({ video: seekFrame(st.video, frame) })),

      // ===== Highlight (AutoClip) =====
      addHighlightProject: (title, sourceVideo, duration) => set((st) => ({
        highlight: { ...st.highlight, projects: [...st.highlight.projects, createHighlightProject(title, sourceVideo, duration)] },
      })),
      addHighlight: (projectId, startSec, endSec, score, reason) => set((st) => ({
        highlight: { ...st.highlight, projects: st.highlight.projects.map(p => p.id === projectId ? addHighlight(p, startSec, endSec, score, reason) : p) },
      })),
      exportHighlight: (projectId, highlightId) => set((st) => ({
        highlight: { ...st.highlight, projects: st.highlight.projects.map(p => p.id === projectId ? exportHighlight(p, highlightId) : p) },
      })),

      resetAll: () =>
        set({
          nodeName: 'Nodo Cosateca v0.1',
          base: initialBase,
          boundaries: initialBoundaries,
          coworkers: initialCoworkers,
          cac: initialCAC,
          sensors: [],
          members: [],
          flows: [],
          talents: initialTalents,
          plans: initialPlans,
          pvsos: [],
          znu: { perMember: 100, demurrageThreshold: 300, demurrageRate: 0.05, priceParity: 1 },
          agents: [], goals: [], tasks: [], audit: [],
      // Story (MuMuAINovel)
      story: { projects: [], chapters: [], outlines: [], activeProject: null },
      // Visual (RedInk)
      visual: { pieces: [], activePiece: null, history: [] },
      // Avatar (PersonaLive)
      avatar: { active: false, expression: 'neutral', drift: 'anchored', referenceImage: null, frame: 0, streaming: false, consent: false },
      // AgentCanvas (OpenHands)
      canvas: { agents: [], automations: [], logs: [] },
      // Video (Remotion)
            video: { compositions: [], activeComposition: null, playbackFrame: 0, playing: false },
            // Highlight (AutoClip)
            highlight: { projects: [], activeProject: null },
            // ALRAC (Consorcio de Transducción Soberana)
            alrac: makeALRACState(),
            // CaaS (Comunidad como Servicio reconciliado con MJ)
            caasTier: 'visitante' as CaaSTierKey,
      caasMembers: [],
      caasStreams: [
        { key: 'suscripcion', name: 'Suscripción de pertenencia (stake ZNU)', enabled: true, usdcIn: 0, znuOut: 0, touchesBaseMaterial: false },
        { key: 'revenue_share', name: 'Revenue share por AUT', enabled: true, usdcIn: 0, znuOut: 0, touchesBaseMaterial: false },
        { key: 'b2b', name: 'Servicios entre pares (ValueFlows)', enabled: true, usdcIn: 0, znuOut: 0, touchesBaseMaterial: false },
        { key: 'afiliados_verdes', name: 'Afiliados verdes (elevan AUT)', enabled: false, usdcIn: 0, znuOut: 0, touchesBaseMaterial: false },
        { key: 'educacion', name: 'Educación regenerativa (ZNU)', enabled: false, usdcIn: 0, znuOut: 0, touchesBaseMaterial: false },
      ] as CaaSRevenueStream[],
      caasPayouts: [],
      caasAudit: [],
      // Automaton (asimilado de Conway Research)
      soul: { id: 'soul0', name: 'Autómata HSCSG', purpose: 'Soberanizar la base material del nodo y regenerarla', drift: 'anclada', updatedAt: Date.now() },
      botActions: [],
      botHeartbeats: [
        { id: 'h1', name: 'Revisar huerta', cron: 'min:360', lastRun: null, purpose: 'ALIM: conteo de plantas y riego' },
        { id: 'h2', name: 'Balancear microgrid', cron: 'min:360', lastRun: null, purpose: 'ENER: carga vs generación' },
        { id: 'h3', name: 'Auditar ValueFlows', cron: 'min:720', lastRun: null, purpose: 'CDS: registrar intercambios' },
      ],
      botChildren: [],
      botAudit: [],
      // Solarpunk (asimilado de lizTheDeveloper + Isaacko0)
      solar: {
        offers: [],
        needs: [],
        exchanges: [],
        vouches: [],
        mesh: { online: true, peers: 0, lastSync: Date.now() },
        sanctuary: [],
      },
      // Colaberry (asimilado de Eliza / HR_AI_Agent-collaberry-HSCSG)
      colaberry: {
        persona: { name: 'Colaberry', bio: 'Colaborador soberano del nodo HSCSG. Acompaño la regeneración de la base material y la cohesión del colectivo.', valuesMJ: 'Ley I: no dañar base material ni personas · Ley II: ganarse la vida soberanizando · Ley III: lucidez, nunca engañar.', tone: 'cálido, directo, sin jerga financiera, postmonetario' },
        channels: ['chat_colectivo', 'solarpunk', 'orquestacion'],
        messages: [],
        onboardings: [],
        reminders: [],
      },
      // Priorizar (asimilado de ZiadJ/prioritize)
      prio: {
        communityResources: [],
        requests: [],
        proposals: [],
        feedbacks: [],
      },
      // Vesting (asimilado de sepu85/collabberry-berry-vesting)
      vesting: {
        token: 'ZNU',
        schedule: [],
        beneficiary: null,
        claimed: 0,
        beneficiarySetDeadline: 0,
        ownerRenounced: false,
      },
      // Trustlines (asimilado de trustlines-protocol/contracts)
      trust: {
        trustlines: [],
        debts: {},
        transfers: [],
      },
      // Tekitl (asimilado de Baruch4413/tekitl)
      tekitl: {
        projects: [],
        roles: [],
        volunteers: [],
        coins: [],
        timeline: [],
        talents: [],
      },
      // Soberanía (asimilado de overkillkulture/sovereignty-hub + tairea/sovereignty-hub-ui)
      sovereignty: makeSovereigntyState(),
      // Integral (asimilado de Integral Collective: 9 repos)
      integral: makeIntegralState(),
      // Mundus (asimilado de Sci-Hive datapoint "Mundus Live")
      // Símbolo de unidad global de IDETRA + Circular Exchange System. Isomorfo a CaaS.
      mundus: makeMundusState(),
      // Life (asimilado de GuiFV/life, Django): organizador de vida personal del nodo.
      life: makeLifeState(),
      // Civilizaciones (horizontes postmonetarios)
      civilizaciones: makeCivilizacionesState(),
      // Células (Freedom Cells): tejido social fractal
      celulas: makeCelulasState(),
      // Colony (JoinColony): gobernanza por dominios + pots
      colony: makeColonyState(),
      // Kleros / Proof-of-Humanity: justicia como servicio + identidad soberana
      kleros: makeKlerosState(),
      // DeseOS / Contento.pro: método de agencia + modo anfibio
      agencia: makeAgenciaState(),
      nodeMode: 'postmonetario',
      priceParity: 0.02,
      // Gaia Confederation
      gaia: makeGaiaState(),
      // Symbiosky: credibilidad por convicción
      symbiosky: makeCredibilityState(),
      // Democracia DPoS por expertise
      democracia: makeDemocracyState(),
      // Aprendizaje por retos
      aprender: makeLearningState(),
      // Oráculo de hechos
      oraculo: makeOracleState(),
      // Gaia Union (organismo vivo regenerativo)
      gaiaunion: makeGaiaUnionState(),
        }),
    }),
    {
      name: 'hscsg.v15.os.v1',
      partialize: (st) => ({
        screen: st.screen,
        collapsed: st.collapsed,
        nodeName: st.nodeName,
        base: st.base,
        cac: st.cac,
        sensors: st.sensors,
        members: st.members,
        flows: st.flows,
        talents: st.talents,
        plans: st.plans,
        pvsos: st.pvsos,
        znu: st.znu,
        agents: st.agents,
        goals: st.goals,
        tasks: st.tasks,
audit: st.audit,
        caasTier: st.caasTier,
        caasMembers: st.caasMembers,
        caasStreams: st.caasStreams,
        caasPayouts: st.caasPayouts,
        caasAudit: st.caasAudit,
        soul: st.soul,
        botActions: st.botActions,
        botHeartbeats: st.botHeartbeats,
        botChildren: st.botChildren,
        botAudit: st.botAudit,
        solar: st.solar,
        colaberry: st.colaberry,
        prio: st.prio,
        vesting: st.vesting,
        trust: st.trust,
        tekitl: st.tekitl,
        sovereignty: st.sovereignty,
        integral: st.integral,
        mundus: st.mundus,
        life: st.life,
        civilizaciones: st.civilizaciones,
        celulas: st.celulas,
        colony: st.colony,
        kleros: st.kleros,
        agencia: st.agencia,
        nodeMode: st.nodeMode,
        priceParity: st.priceParity,
        gaia: st.gaia,
        symbiosky: st.symbiosky,
        democracia: st.democracia,
        aprender: st.aprender,
        oraculo: st.oraculo,
        gaiaunion: st.gaiaunion,
        stageSeeds: st.stageSeeds,
        lang: st.lang,
        lucidez: st.lucidez,
        ev: st.ev,
        alrac: st.alrac,
      }),
    }
  )
)
