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
// RE-EXPORTS FROM tq.ts
// ============================================================================

export type { TQTransaction, ProductCategory };
export type { TQAccount, TQNodeState } from './tq';