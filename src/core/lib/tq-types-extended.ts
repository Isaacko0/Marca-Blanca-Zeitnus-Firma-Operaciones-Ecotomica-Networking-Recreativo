// src/core/lib/tq-types-extended.ts
// Extended TQ types for UHI Engine, Equity, Dividends, Pools, Regional Funds
// Re-exports from tq.ts + new types for Phase 1-2

import type { TQTransaction, ProductCategory } from './tq';

// ============================================================================
// TQ EQUITY (Stock Layer) - from TQ_POSTLABOR_PROPOSAL.md
// ============================================================================

export interface TQEquityAccount {
  id: string;
  holderId: string;              // DID persona/nodo/entidad
  nodeId: string;
  shares: TQShare[];             // Participaciones en activos productivos
  totalEquityKwhYear: number;    // Capacidad total poseída (kWh/año)
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'frozen' | 'inherited' | 'transferred';
}

export interface TQShare {
  id: string;
  assetId: string;               // LandRegistryEntry.id | ProductiveAsset.id
  assetType: 'land' | 'solar' | 'wind' | 'hydro' | 'robotics' | 'compute' | 'data' | 'water';
  fraction: number;              // 0.0 - 1.0 (fracción poseída)
  annualKwhCapacity: number;     // kWh/año que genera esta fracción
  acquisitionDate: number;
  acquisitionType: 'purchase' | 'inheritance' | 'grant' | 'labor-contribution' | 'community-allocation';
  raoCredentialId: string;       // Anclaje RAO: procedencia, emisor, permisos, estado, revocación
  transferable: boolean;         // true = heredable/ventable (con restricciones)
  governanceRights: GovernanceRights;
}

export interface GovernanceRights {
  voteWeight: number;            // φʰ = 0.95^k * (1 + αʰ/10) * fraction
  dividendRight: boolean;        // Derecho a dividendo TQ
  vetoPower: boolean;            // Solo para activos críticos (agua, tierra comunal)
}

export interface ProductiveAsset {
  id: string;
  name: string;
  type: TQShare['assetType'];
  totalAnnualKwh: number;        // Capacidad total kWh/año
  location: { nodeId: string; geometry?: any };
  stewards: string[];            // DIDs gestores
  ownership: OwnershipStructure;
  iceCode: string;
  ecoinventVersion: string;
  raoCredentialId: string;
  registeredAt: number;
}

export interface OwnershipStructure {
  personal: Record<string, number>;      // holderId → fraction
  collective: Record<string, number>;    // poolId → fraction
  municipal: Record<string, number>;     // municipalityId → fraction
  state: Record<string, number>;         // regionId → fraction
  federal: number;                       // fraction federal
  unallocated: number;                   // fraction disponible
  // Suma = 1.0
}

// ============================================================================
// TQ DIVIDEND ENGINE (Stock → Flow)
// ============================================================================

export interface TQDividendPolicy {
  nodeId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'annual';
  distributionRule: 'pro-rata-equity' | 'per-capita' | 'hybrid' | 'needs-weighted';
  reserveRatio: number;          // % capacidad retenida para reinversión/mantenimiento
  minDividendTQ: number;         // Piso garantizado
  maxDividendTQ: number;         // Techo anti-acaparamiento (β_crit aplicado a dividendos)
  metadata?: Record<string, any>; // Stream-specific params (UHI mapping)
}

export interface DividendCalculation {
  period: { start: number; end: number };
  totalCapacityKwh: number;
  reservedKwh: number;
  distributableKwh: number;
  distributions: DividendDistribution[];
  policy: TQDividendPolicy;
  timestamp: number;
}

export interface DividendDistribution {
  recipientId: string;
  recipientType: 'personal' | 'collective' | 'municipal' | 'state' | 'federal';
  equityKwh: number;
  dividendTQ: number;
  flowAccountId: string;
  timestamp: number;
}

export interface DividendExecutionResult {
  success: boolean;
  distributionsExecuted: number;
  totalTQDistributed: number;
  blocked: DividendDistribution[];
  errors: string[];
  timestamp: number;
}

// ============================================================================
// EQUITY POOLS (Collective/Municipal/State/Federal/Commons)
// ============================================================================

export type EquityPoolType = 
  | 'cooperative' 
  | 'municipal' 
  | 'regional' 
  | 'federal' 
  | 'commons';

export interface EquityPool {
  id: string;
  name: string;
  type: EquityPoolType;
  nodeId: string;
  totalEquityKwhYear: number;
  assetShares: Record<string, number>; // assetId → fraction poseída por pool
  members: EquityPoolMember[];
  dividendPolicy: TQDividendPolicy;
  governance: EquityPoolGovernance;
  status: 'active' | 'paused' | 'closed';
  createdAt: number;
  updatedAt: number;
}

export interface EquityPoolMember {
  accountId: string;
  shareFraction: number;
  contributionType: 'capital' | 'labor' | 'land' | 'governance' | 'mixed';
  joinedAt: number;
  votingWeight: number;
}

export interface EquityPoolGovernance {
  minNodes: number;
  maxNodes: number;
  rebalanceThreshold: number;
  exitNoticePeriod: number;
  decisionRule: 'consensus' | 'majority' | 'harmony-weighted' | 'one-member-one-vote';
  admissionRule: 'consensus' | 'majority' | 'harmony-weighted' | 'one-member-one-vote';
  exitRule: 'notice-period' | 'buyback-formula' | 'community-approval';
  dividendReinvestmentRatio: number;
  assetAcquisitionThreshold: number;
}

// ============================================================================
// REGIONAL DIVIDEND FUND (Alaska Model)
// ============================================================================

export interface RegionalDividendFund {
  id: string;
  regionId: string;
  name: string;
  type: 'state' | 'federal';
  sourceAssets: string[];
  totalCapacityKwhYear: number;
  policy: RegionalDividendPolicy;
  recipients: RegionalRecipient[];
  raoCredentialId: string;
  establishedAt: number;
}

export interface RegionalDividendPolicy {
  frequency: 'annual' | 'quarterly';
  distributionRule: 'per-capita';
  residencyRequirementMonths: number;
  ageThreshold: number;
  reserveRatio: number;
  inflationAdjustment: boolean;
}

export interface RegionalRecipient {
  did: string;
  regionId: string;
  residencySince: number;
  isEligible: boolean;
  lastDividendAt: number;
}

// ============================================================================
// LAND REGISTRY EXTENSION (Dividend History)
// ============================================================================

export interface LandDividendEntry {
  period: { start: number; end: number };
  totalKwhProduced: number;
  distributions: {
    recipientId: string;
    recipientType: 'personal' | 'collective' | 'municipal' | 'state' | 'federal';
    fraction: number;
    tqAmount: number;
  }[];
  reserveKwh: number;
  timestamp: number;
}

// ============================================================================
// EXTENDED AUTONOMY METRICS (EAI Integration)
// ============================================================================

export interface ExtendedAutonomyMetrics {
  nodeId: string;
  period: { start: number; end: number };
  localDecisions: number;
  federatedDecisions: number;
  autonomyRatio: number;
  decisionsByType: Record<string, { total: number; local: number; federated: number; autonomyRatio: number }>;
  resourceControl: {
    land: number;
    energy: number;
    water: number;
    compute: number;
    data: number;
    robotics: number;
  };
  equityControl: {
    land: number;
    energy: number;
    compute: number;
    water: number;
    robotics: number;
    compositeScore: number;
  };
  transferDependence: number;  // CommunityFund received / total TQ flow
  tqEconomicAgencyIndex: number; // (earnedShare + propertyShare - transferShare) / √3
  computedAt: number;
}

// ============================================================================
// UHI ENGINE TYPES
// ============================================================================

export interface UHIParameters {
  endYear: number;
  automationPace: number;
  baseGdpGrowth: number;
  swfSeed: number;
  swfContribRate: number;
  swfReturnRate: number;
  swfSpendRule: number;
  ubiMonthly: number;
  ubiRampYears: number;
  babyBondSeed: number;
  babyBondReturn: number;
  babyBondMaturity: number;
  esopGrowth: number;
  dataRoyaltyMax: number;
  carbonBase: number;
  carbonGrowth: number;
  privateInvBase: number;
  privateInvGrowth: number;
  demonetRate: number;
  enableVAT: boolean;
  enableAutomationLevy: boolean;
  enableWealthTax: boolean;
  enableSWF: boolean;
  enableUBI: boolean;
  enableBabyBonds: boolean;
  enableESOP: boolean;
  enableDataRoyalty: boolean;
  enableCarbon: boolean;
  enableDemonetization: boolean;
  targetMode: 'postmonetario' | 'conectado';
}

export interface UHIYearlyResult {
  year: number;
  automationLevel: number;
  gdp: number;
  revenueFactor: number;
  wages: number;
  socialInsurance: number;
  swfDividend: number;
  ubi: number;
  esop: number;
  babyBonds: number;
  dataRoyalty: number;
  carbonDividend: number;
  privateInvestment: number;
  demonetizationGain: number;
  nominalTotal: number;
  effectiveTotal: number;
}

export interface UHIResult {
  parameters: UHIParameters;
  yearly: UHIYearlyResult[];
  summary: {
    medianHHIncome2060: number;
    medianHHIncome2060Effective: number;
    swfBalance2060: number;
    totalTQEquityGenerated: number;
    tqDividendPolicies: TQDividendPolicy[];
  };
}

export interface ValidationResult {
  preset: string;
  median2060Nominal: number;
  median2060Effective: number;
  expectedNominal: number;
  expectedEffective: number;
  nominalDiffPct: number;
  effectiveDiffPct: number;
  passed: boolean;
}

// ============================================================================
// OASA CONSTITUTION TYPES (from oasa.earth)
// ============================================================================

export interface OASAConstitution {
  preamble: string;
  articles: OASAArticle[];
  regenerativePrinciples: OASAPrinciple[];
  governance: OASAGovernance;
  technology: OASATechnology;
  economy: OASAEconomy;
  disputeResolution: OASADisputeResolution;
  amendments: OASAAmendments;
  futureGenerations: OASAFutureGenerations;
  sovereignty: OASASovereignty;
}

export interface OASAArticle {
  number: number;
  title: string;
  sections: OASASection[];
}

export interface OASASection {
  number: string;
  title: string;
  content: string;
  subsections?: OASASection[];
}

export interface OASAPrinciple {
  number: number;
  title: string;
  description: string;
  requirements: string[];
  metrics: OASAMetric[];
}

export interface OASAMetric {
  name: string;
  unit: string;
  target: number;
  measurementMethod: string;
  frequency: 'annual' | 'quarterly' | 'monthly';
}

export interface OASAGovernance {
  generalMeeting: OASAGeneralMeeting;
  projectAssembly: OASAProjectAssembly;
  executiveTeams: OASAExecutiveTeams;
  guardiansOfNature: OASAGuardiansOfNature;
  decisionCategories: OASADecisionCategory[];
  tokenVoting: OASATokenVoting;
}

export interface OASAGeneralMeeting {
  composition: string;
  responsibilities: string[];
  thresholds: { constitutional: number; legislative: number; executive: number };
}

export interface OASAProjectAssembly {
  composition: string;
  responsibilities: string[];
  quorum: number;
  consentThreshold: number;
}

export interface OASAExecutiveTeams {
  accountability: string;
  responsibilities: string[];
}

export interface OASAGuardiansOfNature {
  mandate: string;
  vetoPower: boolean;
  selectionProcess: string;
}

export interface OASADecisionCategory {
  category: 'constitutional' | 'legislative' | 'executive' | 'reserved';
  threshold: number;
  guardiansConsent: boolean;
}

export interface OASATokenVoting {
  governanceWeight: string;
  participationModulation: boolean;
  constitutionalAmendmentThreshold: number;
}

export interface OASATechnology {
  digitizedCommonsPhilosophy: string;
  utilityTokenSystem: OASATokenSystem;
  dataSovereignty: OASADataSovereignty;
  aiRightsAndDuties: OASAAIRights;
}

export interface OASATokenSystem {
  utilityToken: boolean;
  useRights: string[];
  bondingCurve: boolean;
  parametersAdjustable: boolean;
  assemblyApproval: boolean;
}

export interface OASADataSovereignty {
  personalDataControl: boolean;
  privacyByDesign: boolean;
  openSource: boolean;
  surveillanceProhibited: boolean;
}

export interface OASAAIRights {
  toolsOfCommons: boolean;
  noAutonomousDecisions: boolean;
  citizenAuthority: boolean;
  emergentIntelligenceFramework: boolean;
}

export interface OASAEconomy {
  regenerativePrinciples: OASAPrinciple[];
  utilityTokenUseRights: string[];
  bondingCurveParameters: Record<string, any>;
  commonsBasedLegalStructures: string[];
}

export interface OASADisputeResolution {
  internalResolution: string;
  associationMediation: string;
  gmArbitration: string;
  lastResort: string;
}

export interface OASAAmendments {
  proposalProcess: string;
  commentPeriod: number;
  guardiansReview: boolean;
  adoptionThresholds: {
    constitutional: number;
    principles: number;
  };
}

export interface OASAFutureGenerations {
  impactAssessmentHorizon: number;
  guardiansOfNatureRole: string;
  intergenerationalJustice: boolean;
}

export interface OASASovereignty {
  commonsSovereignty: boolean;
  localAutonomy: boolean;
  dataSovereignty: boolean;
  aiRightsAndDuties: OASAAIRights;
  expressionAndInquiry: boolean;
  safetyAndIntegrity: boolean;
  ecologicalReciprocity: boolean;
}

// ============================================================================
// DISCO TYPES (from manifesto.disco.coop, elements.disco.coop, ball.disco.coop)
// ============================================================================

export type DisCOFlowType = 'livelihood' | 'love' | 'care';

export interface DisCOContribution {
  id: string;
  memberId: string;           // DID miembro
  flowType: DisCOFlowType;
  value: number;              // Valor en ZNU/TQ
  description: string;
  timestamp: number;
  verified: boolean;
  raoCredentialId: string;
}

export interface DisCO_CAT {
  // C - Confianza (Trust)
  trust: {
    raoCredentials: string[];        // ERC-8004 + RAO
    cdsScore: number;                       // CDS score histórico
    peerEndorsements: PeerEndorsement[];    // Bread verification
    trustScore: number;                     // 0-1 compuesto
  };
  
  // A - Asamblea (Governance)
  assembly: {
    consentDecisions: ConsentDecision[];    // Decisiones por consentimiento
    onePersonOneVote: boolean;              // 1a1v
    domainVotes: Map<string, VoteResult>;   // Colony domain voting
    consentThreshold: number;               // Umbral consentimiento (default: 0.8)
  };
  
  // T - Transparencia (Transparency)
  transparency: {
    valueFlows: ValueFlowRecord[];          // ValueFlows accounting (VF types)
    vestingSchedules: Map<string, VestingTranche[]>; // Por miembro
    potBalances: Map<string, number>;       // Colony pots
    tqLedger: TQTransaction[];              // TQ Ledger público
    auditTrail: AuditEntry[];               // Trail completa
  };
}

export interface ConsentDecision {
  id: string;
  proposal: string;
  proposer: string;
  status: 'proposed' | 'consenting' | 'approved' | 'blocked' | 'integrated';
  consents: Map<string, 'consent' | 'concern' | 'block'>; // memberId → vote
  consentRatio: number;                     // consents / total
  blocked: boolean;                         // Al menos un bloqueo válido
  integratedAt: number;
  raoCredentialId: string;
}

export interface PeerEndorsement {
  from: string;           // DID endorser
  to: string;             // DID endorseado
  type: 'skill' | 'contribution' | 'trust' | 'governance';
  weight: number;         // CDS weight del endorser
  timestamp: number;
  raoCredentialId: string;
}

export interface VoteResult {
  choice: 'consent' | 'concern' | 'block';
  weight: number;
  timestamp: number;
}

export interface ValueFlowRecord {
  id: string;
  type: 'transfer' | 'process' | 'fulfillment';
  from: string;
  to: string;
  resource: string;
  quantity: number;
  unit: string;
  timestamp: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: number;
  details: Record<string, any>;
  raoCredentialId: string;
}

export type DisCOPrincipleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DisCOPrinciple {
  number: DisCOPrincipleNumber;
  title: string;
  description: string;
  examples: string[];
  relatedPrinciples: DisCOPrincipleNumber[];
}

export interface DisCOValue {
  name: string;
  description: string;
  relatedPrinciples: DisCOPrincipleNumber[];
}

export interface DisCOElement {
  id: string;
  name: string;
  description: string;
  chapter: number;
  category: 'governance' | 'economic' | 'care' | 'tech' | 'legal';
  implementation: 'core' | 'optional' | 'experimental';
}

export interface DisCOPhase {
  name: string;
  criteria: {
    minMembers: number;
    minActiveFlows: number;
    minConsentDecisions: number;
    minTransparencyScore: number;
    virginiaN3Count: number;
    avgN3Weight: number;
    vestingCompletionRate: number;
  };
  transitionActions: string[];
  requiresConsent: boolean;
}

// DisCO Phases (from BRIEF_EXHAUSTIVO)
export const DISCO_PHASES: Record<string, DisCOPhase> = {
  emergent: {
    name: 'Emergente (Fase A: CO Emergente 1.0-1.99)',
    criteria: {
      minMembers: 10,
      minActiveFlows: 3,
      minConsentDecisions: 5,
      minTransparencyScore: 0.6,
      virginiaN3Count: 3,
      avgN3Weight: 0.8,
      vestingCompletionRate: 0.2
    },
    transitionActions: [
      'Activar Colony pots completos',
      'Habilitar Vesting Berry schedule completo',
      'Registrar en Gran Alianza como nodo piloto'
    ],
    requiresConsent: true
  },
  consolidated: {
    name: 'Consolidado (Fase B: CO Consolidado 2.0-2.99)',
    criteria: {
      minMembers: 50,
      minActiveFlows: 10,
      minConsentDecisions: 20,
      minTransparencyScore: 0.8,
      virginiaN3Count: 9,
      avgN3Weight: 1.2,
      vestingCompletionRate: 0.5
    },
    transitionActions: [
      'Activar mentoría N3→N3 nuevos',
      'Habilitar emisiones ZNU propias (Capa 3)',
      'Registrar en Gran Alianza como nodo ancla'
    ],
    requiresConsent: true
  },
  mature: {
    name: 'Maduro (Fase C: CO Maduro ≥3.0)',
    criteria: {
      minMembers: 100,
      minActiveFlows: 20,
      minConsentDecisions: 50,
      minTransparencyScore: 0.9,
      virginiaN3Count: 27,
      avgN3Weight: 1.5,
      vestingCompletionRate: 0.8
    },
    transitionActions: [
      'Activar federación multi-DHO',
      'Emisiones ZNU soberanas',
      'Tesorería compartida multi-DHO'
    ],
    requiresConsent: true
  },
  federated: {
    name: 'Federado (Fase D: Federación Ontogenética ≥3.0 + η_fed)',
    criteria: {
      minMembers: 200,
      minActiveFlows: 50,
      minConsentDecisions: 100,
      minTransparencyScore: 0.95,
      virginiaN3Count: 100,
      avgN3Weight: 2.0,
      vestingCompletionRate: 0.9
    },
    transitionActions: [
      'Activar federación multi-DHO',
      'Emisiones ZNU soberanas',
      'Tesorería compartida multi-DHO'
    ],
    requiresConsent: true
  }
};

// ============================================================================
// CLOSER / OASA TYPES (from closer.earth, oasa.earth)
// ============================================================================

export interface CloserVillage {
  id: string;
  name: string;
  location: { lat: number; lng: number; country: string };
  type: 'ecovillage' | 'cohousing' | 'regenerative-hub' | 'retreat-center';
  oasaPrinciplesCompliance: number; // 0-1
  population: number;
  landHectares: number;
  waterTableDepth: number; // meters
  treesPlanted: number;
  tokenHolders: number;
  fundsRaised: number;
  onCloserSince: number;
  domain: string;
  raoCredentialId: string;
}

export interface CloserAgent {
  id: string;
  villageId: string;
  name: string;
  capabilities: CloserAgentCapability[];
  infrastructure: 'local' | 'cloud' | 'hybrid';
  sovereignty: 'full' | 'shared' | 'hosted';
  memory: CloserAgentMemory;
  raoCredentialId: string;
}

export type CloserAgentCapability = 
  | 'bookings' 
  | 'events' 
  | 'memberships' 
  | 'governance' 
  | 'tokens' 
  | 'learning' 
  | 'spaces' 
  | 'ai-mediation' 
  | 'resource-tracking';

export interface CloserAgentMemory {
  longTerm: boolean;
  rag: boolean;
  contextWindow: number;
  persistentStorage: boolean;
}

export interface OASAVillageFund {
  id: string;
  name: string;
  cohort: number;
  launchDate: number;
  matchingPool: number;
  endowmentPrizes: number;
  selectedVillages: string[]; // village IDs
  criteria: OASAFundCriteria;
  tokenRaise: OASATokenRaise;
  feeContribution: number; // 1% of platform fees
}

export interface OASAFundCriteria {
  landTitleOrLease: boolean;
  regenerationPlan: boolean;
  stewardshipCommitment: boolean;
  openBooks: boolean;
  runOnCloser: boolean;
}

export interface OASATokenRaise {
  type: 'governance-and-use-rights'; // never equity
  followOnCapital: number; // spring 2027
  governanceRights: boolean;
  useRights: boolean;
}

export interface OASAPrinciples {
  soil: OASAPrincipleDetail;
  water: OASAPrincipleDetail;
  air: OASAPrincipleDetail;
  waste: OASAPrincipleDetail;
  rewilding: OASAPrincipleDetail;
  resources: OASAPrincipleDetail;
  community: OASAPrincipleDetail;
}

export interface OASAPrincipleDetail {
  number: number;
  title: string;
  requirements: string[];
  metrics: OASAMetric[];
}

// ============================================================================
// ELIZAOS / ELIZA TYPES (from github.com/elizaOS/eliza)
// ============================================================================

export interface ElizaCharacter {
  name: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: MessageExample[];
  postExamples: string[];
  topics: string[];
  style: ElizaStyle;
  adjectives: string[];
  clients: ElizaClient[];
  plugins: string[];
  settings: ElizaSettings;
  systemPrompt?: string;
}

export interface MessageExample {
  user: string;
  assistant: string;
}

export interface ElizaStyle {
  all: string[];
  chat: string[];
  post: string[];
}

export type ElizaClient = 'discord' | 'telegram' | 'twitter' | 'farcaster' | 'slack' | 'web';

export interface ElizaSettings {
  voice: ElizaVoiceSettings;
  secrets: Record<string, string>;
  modelProvider: string;
  embeddingProvider: string;
}

export interface ElizaVoiceSettings {
  enabled: boolean;
  model: string;
  voiceId: string;
}

export interface ElizaPlugin {
  name: string;
  description: string;
  actions: ElizaAction[];
  evaluators: ElizaEvaluator[];
  providers: ElizaProvider[];
  services: ElizaService[];
}

export interface ElizaAction {
  name: string;
  description: string;
  handler: (runtime: any, message: any, state: any) => Promise<any>;
  validate: (runtime: any, message: any) => Promise<boolean>;
  examples: MessageExample[][];
}

export interface ElizaEvaluator {
  name: string;
  description: string;
  handler: (runtime: any, message: any, state: any) => Promise<number>;
}

export interface ElizaProvider {
  name: string;
  description: string;
  get: (runtime: any, message: any, state: any) => Promise<any>;
}

export interface ElizaService {
  name: string;
  description: string;
  start: (runtime: any) => Promise<void>;
  stop: (runtime: any) => Promise<void>;
}

// ============================================================================
// VALUEFLOWS TYPES (from valueflows.org)
// ============================================================================

export interface VF_EconomicEvent {
  id: string;
  type: 'transfer' | 'process' | 'fulfillment' | 'observation' | 'claim';
  fromAgent: string;
  toAgent: string;
  resource: VF_Resource;
  quantity: number;
  unit: string;
  recipe?: VF_Recipe;
  process?: VF_Process;
  timestamp: number;
  raoCredentialId: string;
}

export interface VF_Resource {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: 'material' | 'energy' | 'service' | 'knowledge' | 'currency' | 'time' | 'land';
  standardizedUnit?: string;
  conversionFactor?: number;
  categoryCode: string;
}

export interface VF_Recipe {
  id: string;
  name: string;
  description: string;
  inputs: VF_RecipeLine[];
  outputs: VF_RecipeLine[];
  processType: 'production' | 'consumption' | 'transformation' | 'transport' | 'service';
  duration: number; // in seconds
  location?: string;
}

export interface VF_RecipeLine {
  resourceId: string;
  quantity: number;
  unit: string;
  note?: string;
}

export interface VF_Process {
  id: string;
  name: string;
  description: string;
  recipeId: string;
  inputs: VF_ProcessLine[];
  outputs: VF_ProcessLine[];
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  startTime: number;
  endTime?: number;
  location?: string;
  responsibleAgents: string[];
}

export interface VF_ProcessLine {
  resourceId: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  variance?: number;
}

export interface VF_EconomicResource {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  location: string;
  custodian: string;
}

export interface VF_EconomicAgent {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'network' | 'dao' | 'disco' | 'dho';
  location?: string;
  resources: Map<string, number>; // resourceId -> quantity
  capabilities: string[];
  reputation: number;
}

export interface VF_EconomicNetwork {
  id: string;
  name: string;
  agents: VF_EconomicAgent[];
  resources: VF_EconomicResource[];
  events: VF_EconomicEvent[];
  governance: VF_Governance;
}

export interface VF_Governance {
  type: 'consent' | 'majority' | 'holacracy' | 'sociocracy' | 'custom';
  decisionThreshold: number;
  quorum: number;
  delegationEnabled: boolean;
  transparency: 'full' | 'partial' | 'restricted';
}

// ============================================================================
// ARAGON TYPES (from aragon.org, AGPs, coop-dao-docs)
// ============================================================================

export interface AragonOSx {
  version: string;
  modules: AragonModule[];
  governance: AragonGovernance;
  tokenomics: AragonTokenomics;
  plugins: AragonPlugin[];
}

export interface AragonModule {
  name: string;
  version: string;
  permissions: AragonPermission[];
  dependencies: string[];
}

export interface AragonPermission {
  role: string;
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export interface AragonGovernance {
  type: 'token-voting' | 'conviction-voting' | 'multisig' | 'holographic' | 'custom';
  parameters: Record<string, any>;
  plugins: string[];
}

export interface AragonTokenomics {
  tokenAddress: string;
  bondingCurve?: AragonBondingCurve;
  vesting?: AragonVesting;
  emissions?: AragonEmissions;
  utility: AragonUtility;
}

export interface AragonBondingCurve {
  type: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid' | 'custom';
  parameters: Record<string, number>;
  reserveToken: string;
}

export interface AragonVesting {
  schedule: AragonVestingTranche[];
  beneficiary: string;
  cliff?: number;
  revocable: boolean;
}

export interface AragonVestingTranche {
  timestamp: number;
  amount: number;
  conditions?: string[];
}

export interface AragonEmissions {
  rate: number;
  schedule: 'continuous' | 'discrete' | 'epoch-based';
  recipients: string[];
}

export interface AragonUtility {
  governance: boolean;
  staking: boolean;
  fees: boolean;
  access: boolean;
  payments: boolean;
}

export interface AragonPlugin {
  name: string;
  type: 'governance' | 'treasury' | 'voting' | 'tokenomics' | 'identity' | 'custom';
  config: Record<string, any>;
  dependencies: string[];
}

export interface AGP_Process {
  id: string;
  title: string;
  author: string;
  status: 'draft' | 'review' | 'vote' | 'approved' | 'rejected' | 'implemented' | 'sunset';
  category: 'governance' | 'treasury' | 'technical' | 'ecosystem' | 'meta';
  createdAt: number;
  updatedAt: number;
  votes: AGP_Vote[];
  editorialReview: AGP_EditorialReview;
  boardReview: AGP_BoardReview;
}

export interface AGP_Vote {
  voter: string;
  choice: 'yes' | 'no' | 'abstain';
  weight: number;
  timestamp: number;
  signature: string;
}

export interface AGP_EditorialReview {
  reviewer: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  reviewedAt: number;
}

export interface AGP_BoardReview {
  reviewer: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  reviewedAt: number;
}

export interface AragonOTF {
  version: string;
  framework: 'ownership-token-framework';
  criteria: {
    enforceableOwnership: boolean;
    valueAccrual: boolean;
    verifiableEvidence: boolean;
  };
  tokenTypes: {
    ownership: boolean;
    utility: boolean;
    governance: boolean;
    hybrid: boolean;
  };
  evaluationFramework: OTFEvaluationFramework;
}

export interface OTFEvaluationFramework {
  ownershipRights: OTFOwnershipRight[];
  valueAccrualMechanisms: OTFValueAccrual[];
  evidenceStandards: OTFEvidenceStandard[];
}

export interface OTFOwnershipRight {
  right: string;
  enforceable: boolean;
  jurisdiction: string;
  evidenceRequired: string[];
}

export interface OTFValueAccrual {
  mechanism: string;
  description: string;
  measurable: boolean;
  metrics: string[];
}

export interface OTFEvidenceStandard {
  standard: string;
  description: string;
  verificationMethod: 'onchain' | 'offchain' | 'hybrid';
  auditorRequired: boolean;
}

// ============================================================================
// COOP DAO TYPES (from coop-dao-docs)
// ============================================================================

export interface CoopDAO {
  name: string;
  legalEntity: 'cooperative' | 'association' | 'foundation' | 'gmbh' | 'llc';
  jurisdiction: string;
  members: CoopMember[];
  governance: CoopGovernance;
  treasury: CoopTreasury;
  legalStructure: CoopLegalStructure;
}

export interface CoopMember {
  id: string;
  name: string;
  role: 'founder' | 'worker' | 'consumer' | 'investor' | 'community';
  contribution: number;
  shares: number;
  votingPower: number;
  joinedAt: number;
}

export interface CoopGovernance {
  type: 'general-assembly' | 'board' | 'sociocracy' | 'holacracy' | 'custom';
  quorum: number;
  majorityThreshold: number;
  delegationEnabled: boolean;
  termLimits: boolean;
}

export interface CoopTreasury {
  multisig: string;
  signers: string[];
  threshold: number;
  assets: CoopAsset[];
  budget: CoopBudget;
}

export interface CoopAsset {
  id: string;
  type: 'crypto' | 'fiat' | 'real-estate' | 'equipment' | 'inventory' | 'ip';
  value: number;
  currency: string;
  location?: string;
  custodian: string;
}

export interface CoopBudget {
  period: { start: number; end: number };
  income: CoopIncome[];
  expenses: CoopExpense[];
  surplus: number;
  allocation: CoopAllocation[];
}

export interface CoopIncome {
  source: string;
  amount: number;
  currency: string;
  recurring: boolean;
}

export interface CoopExpense {
  category: string;
  amount: number;
  currency: string;
  approvedBy: string;
  date: number;
}

export interface CoopAllocation {
  project: string;
  amount: number;
  percentage: number;
  approved: boolean;
}

export interface CoopLegalStructure {
  entityType: string;
  registrationNumber: string;
  registeredAddress: string;
  bylaws: string;
  statutes: string;
}

// ============================================================================
// DHO TYPES (from BRIEF_EXHAUSTIVO - DHO phases)
// ============================================================================

export interface DHO_Node {
  id: string;                       // DID del DHO (ERC-8004)
  name: string;
  type: 'emergent' | 'consolidated' | 'mature' | 'federated';
  dhoPhase: 'emergent' | 'consolidated' | 'mature' | 'federated';
  
  // 3 Flujos DisCO
  flows: {
    livelihood: DisCOContribution[];
    love: DisCOContribution[];
    care: DisCOContribution[];
  };
  
  // CAT (Confianza/Asamblea/Transparencia)
  cat: DisCO_CAT;
  
  // Federación
  federation: {
    parentDHOId?: string;           // DHO padre (si federado)
    childDHOIds: string[];          // DHOs hijos
    federationTreaty?: FederationTreaty;
    sharedTreasury?: SharedTreasury;
    raoSync: boolean;               // RAO sincronizado con federados
  };
  
  // Virginia Network mapping
  virginiaMapping: {
    n1RootDomainId: string;
    n2SubDomainIds: string[];
    n3ProjectDomainIds: string[];
    n3FundDomainIds: string[];
  };
  
  // Métricas DHO
  metrics: {
    totalMembers: number;
    activeFluxs: number;
    consentDecisionsCount: number;
    transparencyScore: number;      // 0-1
    federationHealth: number;       // 0-1
  };
  
  createdAt: number;
  updatedAt: number;
}

export interface FederationTreaty {
  id: string;
  name: string;
  signatories: string[];            // DIDs DHOs firmantes
  terms: {
    resourceSharing: boolean;
    governanceAlignment: boolean;   // CDS/RAO alignment
    mutualAid: boolean;
    disputeResolution: 'consent' | 'mediation' | 'arbitration';
  };
  signedAt: number;
  raoCredentialIds: string[];
}

export interface SharedTreasury {
  id: string;
  pots: Map<string, number>;        // potId → balance ZNU
  governance: {
    signers: string[];              // DIDs firmantes (multisig)
    threshold: number;              // M-of-N
    movePotRequiresConsent: boolean;
  };
  raoCredentialId: string;
}

export interface DHOPhaseTransition {
  fromPhase: DHO_Node['dhoPhase'];
  toPhase: DHO_Node['dhoPhase'];
  criteria: {
    minMembers: number;
    minActiveFlows: number;
    minConsentDecisions: number;
    minTransparencyScore: number;
    virginiaN3Count: number;        // N3s operativos en la red Virginia
    avgN3Weight: number;            // Peso promedio N3s
    vestingCompletionRate: number;  // % N3s con vesting > 80%
  };
  transitionActions: string[];       // Acciones automáticas al transicionar
  requiresConsent: boolean;          // Requiere consentimiento asamblea
}

// ============================================================================
// VIRGINIA GATEWAY EXTENDIDO (DisCO + DHO)
// ============================================================================

export interface VirginiaDisCOGateway extends VirginiaVestingGateway {
  // DisCO Integration
  discoCAT: DisCO_CAT;
  discoFlows: Map<DisCOFlowType, DisCOContribution[]>;
  
  // DHO Integration
  dhoNode: DHO_Node;
  dhoPhase: 'emergent' | 'consolidated' | 'mature' | 'federated';
  
  // Flujo de valor DisCO → Virginia N3
  recordContribution: (flow: DisCOFlowType, value: number, desc: string) => Promise<void>;
  processConsentDecision: (decision: ConsentDecision) => Promise<void>;
  syncTransparency: () => Promise<void>;
  
  // Federación
  federateWith: (otherDHO: DHO_Node, treaty: FederationTreaty) => Promise<void>;
  syncRAO: () => Promise<void>;
  shareTreasury: (potId: string, amount: number) => Promise<void>;
}

// ============================================================================
// VIRGINIA VESTING GATEWAY (base)
// ============================================================================

export interface VirginiaVestingGateway {
  n3NodeId: string;
  vestingState: VestingState;       // Berry schedule ZNU
  vestingSchedule: VestingTranche[];
  claimedZNU: number;
  
  // Condiciones integradas
  autMilestones: AUTMilestone[];    // Hitos AUT verificados (TQ Ledger)
  peerVerification: PeerVerification; // Bread
  urbanikaFactor: UrbanikaFactor;   // Urbanika CDS×AUT
  
  // Flujo de valor DisCO → Virginia N3
  recordContribution: (flow: DisCOFlowType, value: number, desc: string) => Promise<void>;
  processConsentDecision: (decision: ConsentDecision) => Promise<void>;
  syncTransparency: () => Promise<void>;
  
  // Federación
  federateWith: (otherDHO: DHO_Node, treaty: FederationTreaty) => Promise<void>;
  syncRAO: () => Promise<void>;
  shareTreasury: (potId: string, amount: number) => Promise<void>;
  
  // Métodos
  canClaimVesting: () => boolean;
  claimVesting: () => Promise<ClaimResult>;
  computeN3Weight: () => number;
}

// ============================================================================
// SUPPORTING TYPES (referenced above)
// ============================================================================

export interface VestingState {
  schedule: VestingTranche[];
  beneficiary: string | null;
  claimed: number;
  beneficiarySetDeadline: number;
  ownerRenounced: boolean;
}

export interface VestingTranche {
  id: string;
  ts: number;
  amountZNU: number;
  claimed: boolean;
}

export interface PeerVerification {
  votingN2Nodes: string[];
  positiveVotes: number;
  totalVotes: number;
  consensusWeight: number; // 0-1
  quorumMet: boolean;      // ≥3 N2 voters
}

export interface UrbanikaFactor {
  cds: number;      // Cohesión social (0-1+)
  aut: number;      // Autonomía productiva (0-1+)
  composite: number; // CDS × AUT
}

export interface AUTMilestone {
  id: string;
  description: string;
  targetTQKwh: number;
  actualTQKwh: number;
  verified: boolean;
  verifiedBy: string[];             // N2 peer DIDs
  verifiedAt: number;
  raoCredentialId: string;
}

export interface ClaimResult {
  znuReleased: number;
  newWeight: number;
  colonyReputationGain: number;
  potAccessUnlocked: string[];
  timestamp: number;
}

export interface VirginiaColonyMapping {
  n1RootDomainId: string;
  n2SubDomainIds: string[];
  n3ProjectDomainIds: string[];
  n3FundDomainIds: string[];
  reputationToWeightMultiplier: number;
  minReputationForPotAccess: number;
}

export interface VirginiaVestingGateway {
  n3NodeId: string;
  vestingState: VestingState;
  vestingSchedule: VestingTranche[];
  claimedZNU: number;
  autMilestones: AUTMilestone[];
  peerVerification: PeerVerification;
  urbanikaFactor: UrbanikaFactor;
  recordContribution: (flow: DisCOFlowType, value: number, desc: string) => Promise<void>;
  processConsentDecision: (decision: ConsentDecision) => Promise<void>;
  syncTransparency: () => Promise<void>;
  canClaimVesting: () => boolean;
  claimVesting: () => Promise<ClaimResult>;
  computeN3Weight: () => number;
}

export interface N3DynamicWeight {
  nodeId: string;
  period: { start: number; end: number };
  tqGeneratedKwh: number;
  tqGeneratedVerified: boolean;
  autMilestones: AUTMilestone[];
  peerVerification: PeerVerification;
  urbanikaFactor: UrbanikaFactor;
  colonyReputation: number;
  vestingProgress: number;
  finalWeight: number;
  previousWeight: number;
  updatedAt: number;
}

// ============================================================================
// RE-EXPORTS FROM tq.ts
// ============================================================================

export type { TQTransaction, ProductCategory } from './tq';
export type { TQAccount, TQNodeState } from './tq';

// ============================================================================
// CONSTANTS
// ============================================================================

export const ECOSYSTEM_NORMALIZER = 1.0;
export const DAY = 86400000;
export const ZNU_TO_POT_RATE = 1.0;

// DisCO 3 Flows mapping to Virginia N3/N2/N1
export const DISCO_FLOW_TO_VIRGINIA = {
  livelihood: 'N3',  // TQ/ZNU generation
  love: 'N2',        // Coordination/CDS
  care: 'N1'         // Autogestión/Urbanika
} as const;

// OASA 7 Principles mapping to Urbanika metrics
export const OASA_PRINCIPLE_TO_URBANIKA = {
  soil: 'soilRegenerationKwh',
  water: 'waterRetentionKwh',
  air: 'carbonSequestrationKwh',
  waste: 'wasteReductionKwh',
  rewilding: 'biodiversityIndex',
  resources: 'renewableEnergyKwh',
  community: 'socialCohesionIndex'
} as const;

// DisCO 3 Flows to Virginia N3/N2/N1 weight multipliers
export const DISCO_FLOW_WEIGHTS = {
  livelihood: { N3: 1.0, N2: 0.3, N1: 0.1 },
  love: { N3: 0.2, N2: 1.0, N1: 0.3 },
  care: { N3: 0.1, N2: 0.2, N1: 1.0 }
} as const;

// ============================================================================
// END OF TQ TYPES EXTENDED
// ============================================================================