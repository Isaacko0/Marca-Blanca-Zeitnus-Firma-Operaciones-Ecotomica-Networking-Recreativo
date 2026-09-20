import type { CaaSRevenueStream } from '@core/state/caas';
import type { CredoRelation } from '@core/state/alrac';

// ALRAC TQ (Transducción Quántica) Ledger - Capa 1 Contable-Física
// 1 TQ = 1 kWh, límite ±500, catálogo ICE/Ecoinvent, NFC offline
// Prohibición cambiaria: TQ ≠ fiat/cripto NUNCA (arquitectura)

export interface TQAccount {
  id: string;
  nodeId: string;
  balance: number;              // -500 a +500
  memberId: string;             // DID miembro
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'frozen' | 'closed';
}

export interface TQTransaction {
  id: string;
  from: string;                 // accountId
  to: string;                   // accountId
  type: 'reciprocity' | 'production' | 'regeneration';
  amount: number;               // TQ (1 TQ = 1 kWh)
  productId?: string;           // Si production/regeneration
  timestamp: number;
  raoCredentialId: string;      // Anclaje termodinámico
  fromCurrency: 'TQ';
  toCurrency: 'TQ';
  // NO exchangeRate, NO fiatValue (prohibido)
}

export interface TQNodeState {
  nodeId: string;
  accounts: Map<string, TQAccount>;
  transactions: TQTransaction[];
  catalog: ProductFederationEntry[];
  pools: CrossNodePool[];
  lands: LandRegistryEntry[];
  assemblies: TQNodeAssembly;
  communityFund: CommunityFund;
  autonomyMetrics: AutonomyMetrics;
}

// ============================================================================
// EXCHANGE GUARD - Prohibición cambiaria TQ ≠ fiat/cripto
// ============================================================================

export function verifyTQProhibition(tx: TQTransaction): boolean {
  return (
    tx.fromCurrency === 'TQ' &&
    tx.toCurrency === 'TQ' &&
    ['reciprocity', 'production', 'regeneration'].includes(tx.type) &&
    !('exchangeRate' in tx) &&
    !('fiatValue' in tx) &&
    isValidTQAccount(tx.from) &&
    isValidTQAccount(tx.to)
  );
}

export function blockArbitrageAttempt(attempt: {
  from: TQAccount;
  to: { id: string; currency: 'USD' | 'MXN' | 'BTC' | 'ETH' | 'ZNU' };
  amount: number;
  proposedRate: number;
}): {
  blocked: true;
  reason: string;
  code: 'TQ_EXCHANGE_GUARD_BLOCKED';
  timestamp: number;
  attempt: { from: string; to: string; amount: number; proposedRate: number };
} {
  return {
    blocked: true,
    reason: 'TQ_PROHIBITION: Transducción Quántica no es intercambiable por fiat/cripto',
    code: 'TQ_EXCHANGE_GUARD_BLOCKED',
    timestamp: Date.now(),
    attempt: {
      from: attempt.from.id,
      to: attempt.to.id,
      amount: attempt.amount,
      proposedRate: attempt.proposedRate
    }
  };
}

function isValidTQAccount(_accountId: string): boolean {
  // Implementación: verificar en estado del nodo
  return true; // placeholder
}

// ============================================================================
// CONVERSION FACTOR - FC = canasta_TQ(500) / canasta_Fiat
// ============================================================================

export interface ConversionFactor {
  factor: number;
  basketTQ: number;
  basketFiat: number;
  timestamp: number;
  region: string;
  source: 'ICE' | 'Ecoinvent' | 'local' | 'manual';
}

export function conversionFactor(
  basketTQ: number,
  basketFiat: number,
  region: string = 'MX',
  source: 'ICE' | 'Ecoinvent' | 'local' | 'manual' = 'local'
): ConversionFactor {
  if (basketFiat <= 0) throw new Error('Basket fiat must be > 0');
  if (basketTQ !== 500) throw new Error('TQ basket must be 500 (max account limit)');
  
  return {
    factor: basketTQ / basketFiat,
    basketTQ,
    basketFiat,
    timestamp: Date.now(),
    region,
    source
  };
}

export async function updateConversionFactor(region: string): Promise<ConversionFactor> {
  const basketFiat = await fetchBasketPrice(region);
  return conversionFactor(500, basketFiat, region, 'ICE');
}

async function fetchBasketPrice(region: string): Promise<number> {
  // TODO: Integrar API ICE/Ecoinvent regionalizada
  // Placeholder: valores ejemplo por región
  const prices: Record<string, number> = {
    'MX': 10000,
    'AR': 500000,
    'CO': 540000,
    'CL': 450000
  };
  return prices[region] || 10000;
}

// ============================================================================
// PRODUCT FEDERATION - Catálogo ICE/Ecoinvent regionalizado
// ============================================================================

export type ProductCategory = 
  | 'food' | 'energy' | 'water' | 'housing' | 'transport' 
  | 'tools' | 'textiles' | 'health' | 'education' | 'other';

export interface EnergyBreakdown {
  extraction: number;
  manufacturing: number;
  transport: number;
  use: number;
  endOfLife: number;
  total: number;
}

export interface ProductFederationEntry {
  id: string;
  name: string;
  category: ProductCategory;
  energyFootprint: number;
  energyBreakdown: EnergyBreakdown;
  region: string;
  iceCode: string;
  ecoinventVersion: string;
  lastUpdated: number;
  verified: boolean;
  raoCredentialId?: string;
}

export interface RegistrationResult {
  success: boolean;
  productId?: string;
  timestamp: number;
  warnings: string[];
}

export function registerProductFederation(entry: ProductFederationEntry): RegistrationResult {
  const warnings: string[] = [];
  
  if (entry.energyFootprint !== entry.energyBreakdown.total) {
    warnings.push('energyFootprint !== energyBreakdown.total');
  }
  
  // TODO: Verificar iceCode en catálogo ICE/Ecoinvent
  
  return {
    success: warnings.length === 0,
    productId: entry.id,
    timestamp: Date.now(),
    warnings
  };
}

export interface ProductFilters {
  category?: ProductCategory;
  region?: string;
  maxEnergyFootprint?: number;
  verifiedOnly?: boolean;
  iceCode?: string;
}

export function queryProductFederation(_filters: ProductFilters): ProductFederationEntry[] {
  // TODO: Implementar consulta catálogo federado cross-nodo
  return [];
}

export interface NetRegenerationResult {
  netEnergy: number;
  isRegenerative: boolean;
  ratio: number;
  timestamp: number;
}

export function validateNetRegeneration(
  production: ProductFederationEntry[],
  consumption: ProductFederationEntry[]
): NetRegenerationResult {
  const produced = production.reduce((sum, p) => sum + p.energyFootprint, 0);
  const consumed = consumption.reduce((sum, c) => sum + c.energyFootprint, 0);
  
  return {
    netEnergy: produced - consumed,
    isRegenerative: produced > consumed,
    ratio: consumed > 0 ? produced / consumed : Infinity,
    timestamp: Date.now()
  };
}

// ============================================================================
// CROSS-NODE POOLS - Pools liquidez cross-nodo
// ============================================================================

export interface PoolGovernance {
  minNodes: number;
  maxNodes: number;
  rebalanceThreshold: number;
  exitNoticePeriod: number;
  decisionRule: 'consensus' | 'majority' | 'harmony-weighted';
}

export interface CrossNodePool {
  id: string;
  name: string;
  nodes: string[];
  category: ProductCategory;
  totalLiquidity: number;
  nodeContributions: Record<string, number>;
  governance: PoolGovernance;
  status: 'active' | 'paused' | 'closed';
  createdAt: number;
  updatedAt: number;
}

export interface PoolConfig {
  name: string;
  nodes: string[];
  category: ProductCategory;
  initialContributions: Record<string, number>;
  governance?: Partial<PoolGovernance>;
}

export interface PoolResult {
  success: boolean;
  poolId?: string;
  totalLiquidity?: number;
  timestamp: number;
}

export function createCrossNodePool(_config: PoolConfig): PoolResult {
  const gov: PoolGovernance = {
    minNodes: _config.governance?.minNodes ?? 3,
    maxNodes: _config.governance?.maxNodes ?? 10,
    rebalanceThreshold: _config.governance?.rebalanceThreshold ?? 0.20,
    exitNoticePeriod: _config.governance?.exitNoticePeriod ?? 30,
    decisionRule: _config.governance?.decisionRule ?? 'harmony-weighted'
  };
  
  if (_config.nodes.length < gov.minNodes) {
    return { success: false, timestamp: Date.now() };
  }
  if (_config.nodes.length > gov.maxNodes) {
    return { success: false, timestamp: Date.now() };
  }
  
  const total = Object.values(_config.initialContributions).reduce((a, b) => a + b, 0);
  if (total <= 0) {
    return { success: false, timestamp: Date.now() };
  }
  
  // TODO: Verificar saldo TQ >= contribution y αʰ > κ por nodo
  
  return {
    success: true,
    poolId: generateId(),
    totalLiquidity: total,
    timestamp: Date.now()
  };
}

export interface CrossNodeTx {
  fromNode: string;
  toNode: string;
  productId: string;
  quantity: number;
  tqAmount: number;
}

export interface TxResult {
  success: boolean;
  transactionId?: string;
  timestamp: number;
}

export function executeCrossNodeTransaction(_poolId: string, _tx: CrossNodeTx): TxResult {
  // TODO: Implementar validaciones y ejecución atómica
  return { success: true, transactionId: generateId(), timestamp: Date.now() };
}

export interface RebalanceResult {
  success: boolean;
  newContributions: Record<string, number>;
  timestamp: number;
}

export function rebalancePool(_poolId: string): RebalanceResult {
  // TODO: Rebalanceo ponderado por armonía φʰ = 0.95^k * (1 + αʰ/10)
  return { success: true, newContributions: {}, timestamp: Date.now() };
}

// ============================================================================
// GOVERNANCE - Asamblea nodo TQ + γ-CARMIS
// ============================================================================

export interface AssemblyMember {
  accountId: string;
  memberId: string;
  harmony: number;              // αʰ
  joinedAt: number;
}

export type ProposalType = 
  | 'admission' | 'expulsion' | 'governance_change' 
  | 'joint_project' | 'emergency_gamma_carmis';

export interface AssemblyProposal {
  id: string;
  type: ProposalType;
  proposer: string;
  title: string;
  description: string;
  quorum: number;
  votingRule: 'simple-majority' | 'harmony-weighted' | 'consensus';
  status: 'pending' | 'voting' | 'approved' | 'rejected' | 'executed';
  votes: Record<string, Vote>;
  createdAt: number;
  expiresAt: number;
}

export interface Vote {
  memberId: string;
  weight: number;               // φʰ = 0.95^k * (1 + αʰ/10)
  choice: 'yes' | 'no' | 'abstain';
  timestamp: number;
}

export interface TQNodeAssembly {
  nodeId: string;
  members: AssemblyMember[];
  proposals: AssemblyProposal[];
  decisions: AssemblyDecision[];
  quorum: number;
  votingRule: 'simple-majority' | 'harmony-weighted' | 'consensus';
}

export interface AssemblyDecision {
  proposalId: string;
  approved: boolean;
  executedAt?: number;
  executedBy?: string;
}

export function computeVoteWeight(member: AssemblyMember): number {
  const k = 1; // Capa 1 TQ
  const harmonyBonus = 1 + member.harmony / 10;
  const decay = Math.pow(0.95, k);
  return decay * harmonyBonus;
}

export interface GammaCARMISResult {
  triggered: boolean;
  overload?: number;
  kappa?: number;
  requiredAction?: 'reconfiguration';
  deadline?: number;
}

export function checkGammaCARMISTrigger(_nodeId: string): GammaCARMISResult {
  // TODO: Obtener nodo y calcular overload
  return { triggered: false };
}

// ============================================================================
// LAND REGISTRY - Tierra productiva anclada kWh
// ============================================================================

export type LandType = 
  | 'agriculture' | 'agroforestry' | 'silvopasture' | 'forest'
  | 'wetland' | 'aquaculture' | 'solar' | 'wind' | 'microhydro'
  | 'housing_earth' | 'community_infra' | 'conservation';

export interface ProductiveCapacity {
  food_kWh_year: number;
  energy_kWh_year: number;
  water_kWh_year: number;
  habitat_kWh_year: number;
  total_kWh_year: number;
}

export interface CurrentProduction {
  food_kWh_year: number;
  energy_kWh_year: number;
  water_kWh_year: number;
  habitat_kWh_year: number;
  total_kWh_year: number;
  lastMeasured: number;
}

export interface StewardshipInfo {
  stewards: string[];
  practices: string[];
  certifications: string[];
  communityAgreement: boolean;
}

export interface LandRegistryEntry {
  id: string;
  nodeId: string;
  geometry: any; // GeoJSON.Polygon
  areaHectares: number;
  landType: LandType;
  productiveCapacity: ProductiveCapacity;
  currentProduction: CurrentProduction;
  regenerationIndex: number;
  stewardship: StewardshipInfo;
  raoCredentialId: string;
  registeredAt: number;
  updatedAt: number;
}

export interface LandResult {
  success: boolean;
  landId?: string;
  timestamp: number;
}

export function registerLand(entry: LandRegistryEntry): LandResult {
  // TODO: Validaciones geometría, ICE/Ecoinvent, RAO, stewards
  return { success: true, landId: entry.id, timestamp: Date.now() };
}

export interface UpdateResult {
  success: boolean;
  timestamp: number;
}

export function updateLandProduction(_landId: string, _production: Partial<CurrentProduction>): UpdateResult {
  return { success: true, timestamp: Date.now() };
}

export interface TQYield {
  landId: string;
  tqAmount: number;             // = currentProduction.total_kWh_year
  period: { start: number; end: number };
  timestamp: number;
}

export function computeLandTQYield(landId: string): TQYield {
  // TODO: Obtener currentProduction y retornar TQ = kWh
  return { landId, tqAmount: 0, period: { start: 0, end: 0 }, timestamp: Date.now() };
}

// ============================================================================
// TAX ENGINE - β_crit + fondo comunitario
// ============================================================================

export interface BetaCritConfig {
  threshold: number;
  rate: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface BetaCritResult {
  applied: boolean;
  excess?: number;
  redistributed?: number;
  retained?: number;
  destinations?: RedistributionDestination[];
  timestamp: number;
}

export interface RedistributionDestination {
  type: 'community_fund' | 'cross_node_pool' | 'deficit_node';
  targetId: string;
  amount: number;
}

export function applyBetaCrit(_nodeId: string, _config: BetaCritConfig): BetaCritResult {
  // TODO: Obtener nodo, calcular liquidez total, aplicar β_crit
  return { applied: false, timestamp: Date.now() };
}

// computeRedistributionDestinations removed - unused
// function computeRedistributionDestinations(_amount: number): RedistributionDestination[] {
//   // TODO: Distribuir a fondo comunitario, pools, nodos deficitarios
//   return [];
// }

export interface CommunityFund {
  id: string;
  nodeId: string;
  balance: number;
  allocations: FundAllocation[];
  governance: FundGovernance;
}

export interface FundAllocation {
  id: string;
  purpose: 'soil_regeneration' | 'water_infrastructure' | 'energy_sovereignty' 
         | 'housing_regenerative' | 'health_access' | 'education' | 'emergency';
  amount: number;
  status: 'proposed' | 'approved' | 'executing' | 'completed' | 'audited';
  raoCredentialId: string;
  approvedBy: string[];
  createdAt: number;
  completedAt?: number;
}

export interface FundGovernance {
  proposalThreshold: number;
  approvalQuorum: number;
  auditRequired: boolean;
  maxAllocationPerProposal: number;
}

export function createCommunityFund(nodeId: string): CommunityFund {
  return {
    id: generateId(),
    nodeId,
    balance: 0,
    allocations: [],
    governance: {
      proposalThreshold: 0.05,
      approvalQuorum: 0.60,
      auditRequired: true,
      maxAllocationPerProposal: 0.20
    }
  };
}

// ============================================================================
// NODE ARCHITECTURE - Server API + Terminal Sync
// ============================================================================

// Los handlers de API se implementan en el servidor (Node.js/Bun)
// Aquí solo tipos para TypeScript

export interface TQServerAPI {
  // Ledger
  getAccount(accountId: string): Promise<TQAccount | null>;
  createTransaction(tx: Omit<TQTransaction, 'id' | 'timestamp' | 'raoCredentialId'>): Promise<TQTransaction>;
  getHistory(accountId: string): Promise<TQTransaction[]>;
  
  // Catalog
  getProducts(filters?: ProductFilters): Promise<ProductFederationEntry[]>;
  registerProduct(entry: ProductFederationEntry): Promise<RegistrationResult>;
  
  // Pools
  getPools(): Promise<CrossNodePool[]>;
  createPool(config: PoolConfig): Promise<PoolResult>;
  executePoolTransaction(poolId: string, tx: CrossNodeTx): Promise<TxResult>;
  
  // Governance
  getProposals(): Promise<AssemblyProposal[]>;
  submitProposal(proposal: Omit<AssemblyProposal, 'id' | 'votes' | 'createdAt'>): Promise<AssemblyProposal>;
  voteProposal(proposalId: string, vote: Vote): Promise<void>;
  
  // Land
  getLands(): Promise<LandRegistryEntry[]>;
  registerLand(entry: LandRegistryEntry): Promise<LandResult>;
  updateLandProduction(landId: string, production: Partial<CurrentProduction>): Promise<UpdateResult>;
  
  // Tax
  getBetaCritStatus(): Promise<BetaCritResult>;
  getCommunityFund(): Promise<CommunityFund>;
  proposeAllocation(allocation: Omit<FundAllocation, 'id' | 'status' | 'createdAt'>): Promise<FundAllocation>;
}

// ============================================================================
// DIGITAL SOVEREIGNTY - DID + RAO Log + ACL
// ============================================================================

export interface TQNodeDID {
  did: string;
  controller: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
  keyAgreement: string[];
  service: ServiceEndpoint[];
  createdAt: number;
  updatedAt: number;
}

export interface VerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyMultibase: string;
}

export interface ServiceEndpoint {
  id: string;
  type: 'MTLSAPI' | 'SyncGateway';
  serviceEndpoint: string;
}

export interface RAOLogEntry {
  id: string;
  type: 'transaction' | 'land' | 'catalog' | 'governance' | 'tax' | 'credential';
  payload: any;
  hash: string;
  prevHash: string;
  signature: string;
  timestamp: number;
  raoCredentialId?: string;
}

export class RAOLog {
  private entries: RAOLogEntry[] = [];
  
  addEntry(entry: Omit<RAOLogEntry, 'hash' | 'prevHash' | 'signature'>): RAOLogEntry {
    const prevHash = this.entries.length > 0 ? this.entries[this.entries.length - 1].hash : '0'.repeat(64);
    const payloadHash = hashData(entry.payload + prevHash);
    const signature = signData(payloadHash); // TODO: Firmar con DID del nodo
    
    const fullEntry: RAOLogEntry = {
      ...entry,
      hash: payloadHash,
      prevHash,
      signature
    };
    
    this.entries.push(fullEntry);
    return fullEntry;
  }
  
  getEntry(id: string): RAOLogEntry | undefined {
    return this.entries.find(e => e.id === id);
  }
  
  verifyChain(): boolean {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const prevHash = i === 0 ? '0'.repeat(64) : this.entries[i - 1].hash;
      const computedHash = hashData(entry.payload + prevHash);
      if (entry.hash !== computedHash) return false;
      if (entry.prevHash !== prevHash) return false;
      // TODO: Verificar firma
    }
    return true;
  }
}

export interface DataACL {
  resource: string;
  permissions: Permission[];
}

export interface Permission {
  subject: string;
  actions: ('read' | 'write' | 'verify' | 'delegate')[];
  conditions?: AccessCondition[];
  grantedAt: number;
  grantedBy: string;
  expiresAt?: number;
}

export interface AccessCondition {
  type: 'time' | 'purpose' | 'jurisdiction';
  value: any;
}

// ============================================================================
// AUTONOMY METRICS
// ============================================================================

export type DecisionType = 
  | 'admission' | 'production' | 'transaction' 
  | 'governance' | 'land_use' | 'pool_participation' | 'emergency';

export interface DecisionStats {
  total: number;
  local: number;
  federated: number;
  autonomyRatio: number;
}

export interface ResourceControl {
  land: number;
  energy: number;
  water: number;
  compute: number;
  data: number;
}

export interface AutonomyMetrics {
  nodeId: string;
  period: { start: number; end: number };
  localDecisions: number;
  federatedDecisions: number;
  autonomyRatio: number;
  decisionsByType: Record<DecisionType, DecisionStats>;
  resourceControl: ResourceControl;
  computedAt: number;
}

const DECISION_TYPES: DecisionType[] = [
  'admission', 'production', 'transaction', 
  'governance', 'land_use', 'pool_participation', 'emergency'
];

export function computeAutonomyMetrics(
  nodeId: string, 
  period: { start: number; end: number }
): AutonomyMetrics {
  // TODO: Obtener decisiones del período
  const decisions: any[] = []; // getDecisionsInPeriod(nodeId, period);
  
  const local = decisions.filter(d => !d.requiredFederatedConsensus).length;
  const federated = decisions.filter(d => d.requiredFederatedConsensus).length;
  
  const byType: Record<DecisionType, DecisionStats> = {} as any;
  for (const type of DECISION_TYPES) {
    const typeDecisions = decisions.filter(d => d.type === type);
    const typeLocal = typeDecisions.filter(d => !d.requiredFederatedConsensus).length;
    byType[type] = {
      total: typeDecisions.length,
      local: typeLocal,
      federated: typeDecisions.length - typeLocal,
      autonomyRatio: typeDecisions.length > 0 ? typeLocal / typeDecisions.length : 1
    };
  }
  
  return {
    nodeId,
    period,
    localDecisions: local,
    federatedDecisions: federated,
    autonomyRatio: (local + federated) > 0 ? local / (local + federated) : 1,
    decisionsByType: byType,
    resourceControl: computeResourceControl(nodeId),
    computedAt: Date.now()
  };
}

function computeResourceControl(_nodeId: string): ResourceControl {
  // TODO: Obtener datos del nodo
  return { land: 1, energy: 1, water: 1, compute: 1, data: 1 };
}

// ============================================================================
// ENTERPRISE STAKING + REGENERATIVE TOURISM + CSA + BRAND (Video Samay)
// ============================================================================

export interface EnterpriseStakingStack {
  totalArea: number; // m²
  
  // Rubro 1: Huerta Biointensiva (Motor de Liquidez - Horizonte Corto)
  marketGarden: {
    tqProductionPerM2: number;        // TQ/m²/mes
    cyclesPerYear: number;            // 6-12 ciclos
    znuRevenue: number;               // Ventas directas → ZNU
    biowasteToCompost: number;        // kWh → estiercol
    hectares: number;                 // Hectáreas de huerta
  };
  
  // Rubro 2: Gallinas Pastoreo (Flujo Caja + Fertilidad - Horizonte Corto/Medio)
  pasturedPoultry: {
    tqEggsPerWeek: number;            // TQ/huevo
    manureKwhPerMonth: number;        // kWh estiercol → compost
    pestControlValue: number;         // kWh ahorrados (control biológico)
    znuRevenue: number;               // Huevos + carne
    tqPerBirdPerMonth: number;        // TQ por ave/mes
    birdCount: number;                // Número de aves
  };
  
  // Rubro 3: Policultivo Perenne (Estabilidad - Horizonte Medio)
  perennialPolyculture: {
    avoidedFertilizerKwh: number;     // kWh ahorrados fertilizante
    carbonSequestrationKwh: number;   // kWh secuestrados carbono
    tqPerHectarePerYear: number;      // TQ/ha/año
    hectares: number;                 // Hectáreas
  };
  
  // Rubro 4: Agroforestería (Patrimonio Largo - Horizonte Largo)
  agroforestry: {
    treesPlanted: number;
    biomassKwhPerYear: number;        // Podas → compost + leña
    shadeValue: number;               // kWh ahorrados (riego)
    carbonSequestration: number;      // TQ reserves futuras
    carbonSequestrationKwh: number;   // kWh secuestrados
    timberZnuFuture: number;          // ZNU reserves 10-30 años
    tqPerHectarePerYear: number;      // TQ/ha/año
    hectares: number;                 // Hectáreas
    landValueAppreciation: number;    // Valor tierra apreciación
  };
  
  // Rubro 5: Turismo Regenerativo (Experiencias de Alto Valor - Horizonte Medio)
  regenerativeTourism: {
    visitsPerMonth: number;
    znuPerVisit: number;              // Precio experiencia
    workshopRevenue: number;          // Talleres cocina/siembra
    lodgingRevenue: number;           // Hospedaje rural
    ambassadorConversion: number;     // % visitantes → embajadores CSA
    opexReduction: number;            // kWh ahorrados OPEX
    tqPerVisitor: number;             // TQ generado por visitante
    visitorsPerMonth: number;         // Visitantes/mes
    visitorSatisfaction: number;      // NPS 0-100
    brandCoherence: number;           // Coherencia marca 0-1
    csaConversionRate: number;        // % visitantes → miembros CSA
  };
  
  // Rubro 6: CSA / Suscripción ZNU (Riesgo Compartido - Horizonte Medio)
  csaSubscription: {
    members: number;
    znuMonthlyPerMember: number;
    tqDeliveryPerMonth: number;       // Canasta TQ (verduras, huevos, frutas)
    riskSharing: boolean;             // Abundancia/escasez compartida
    ambassadorRate: number;           // % → embajadores
  };
  
  // Configuración
  monthlyOpex: number;
  yearlyFixedCosts: number;
  totalInvestment: number;
  
  // Métricas Compuestas (Video → KPIs) - Firma solamente
  computeStackMetrics: () => StackMetrics;
  computeStakingScore: () => number;
}

export interface StackMetrics {
  opexAvoided: number;
  tqGenerated: number;
  znuGenerated: number;
  liquidityRatio: number;
  stabilityRatio: number;
  patrimonyRatio: number;
  regenerationRatio: number;
  ecologicalImpactScore: number;
  visitorSatisfaction: number;
  brandCoherence: number;
  csaMemberGrowth: number;
}

// ============================================================================
// REGENERATIVE TOURISM DESIGN (Video: capacidad de carga, seguridad, coherencia)
// ============================================================================

export interface Trail {
  id: string;
  name: string;
  lengthKm: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  pointsOfInterest: string[];
}

export interface SanitationFacility {
  id: string;
  type: 'dry_compost' | 'biogas' | 'conventional';
  capacity: number; // personas/día
  location: { lat: number; lng: number };
}

export interface EmergencyPlan {
  evacuationRoutes: string[];
  firstAidStations: string[];
  emergencyContacts: string[];
}

export interface Experience {
  id: string;
  name: string;
  type: 'tour' | 'harvest' | 'workshop' | 'planting' | 'lodging' | 'retreat';
  durationHours: number;
  priceZNU: number;
  tqGenerated: number;              // 1 TQ = 1 kWh (educación/trabajo)
  maxParticipants: number;
  ambassadorConversionRate: number; // % → embajadores CSA
  ecologicalImpact: number;         // Negativo = regeneración neta
}

export interface RegenerativeTourismDesign {
  carryingCapacity: {
    maxVisitorsPerDay: number;
    maxVisitorsPerWeek: number;
    recoveryDaysBetweenGroups: number;
    ecologicalCarryingCapacity: number;
  };
  
  safetyAndCoherence: {
    trails: Trail[];
    sanitation: SanitationFacility[];
    emergencyPlan: EmergencyPlan;
    guideRatio: number; // guías por visitante
  };
  
  experiences: Experience[];
  
  metrics: {
    znuRevenuePerMonth: number;
    ambassadorConversionRate: number;    // % → embajadores CSA
    csaSignupsPerVisit: number;
    educationHoursDelivered: number;
    visitorSatisfaction: number;         // NPS
    ecologicalImpactScore: number;       // Negativo = regeneración neta
  };
  
  // Validación (Video: "no destrozar el lugar al nombre del turismo")
    validateCoherence: () => boolean;
  }

// ============================================================================
// CSA SUBSCRIPTION STREAM (Video: riesgo compartido, embajadores, transparencia)
// ============================================================================

export interface CSASubscriptionStream extends CaaSRevenueStream {
  key: 'csa_subscription';
  name: 'Suscripción CSA (Comunidad que Sostiene la Agricultura)';
  enabled: boolean;
  usdcIn: number;
  znuOut: number;
  touchesBaseMaterial: boolean;
  
  riskSharing: {
    abundanceMultiplier: number;      // 1.5x en abundancia
    scarcityBuffer: number;           // 0.7x en escasez
    communicationProtocol: string;    // Transparencia honesta
  };
  
  ambassadorProgram: {
    referralZnuBonus: number;         // ZNU por miembro referido
    ambassadorTier: 'bronze' | 'silver' | 'gold';
    benefits: string[];               // Visitas gratis, talleres, prioridad
  };
  
  transparency: {
    weeklyUpdate: boolean;            // Estado finca (abundancia/escasez)
    soilHealthReport: boolean;        // Métricas suelo (kWh, carbono)
    financialTransparency: boolean;   // OPEX, márgenes, reinversión
  };
}

// ============================================================================
// NODE CREDO BRAND (Video: Marca personal, embajadores, storytelling honesto)
// ============================================================================

export interface WeeklyLogEntry {
  date: number;
  advances: string[];
  difficulties: string[];      // Video: "cada dificultad"
  soilMetrics: {
    kwh: number;
    carbon: number;
    biodiversity: number;
  };
  financials: {
    opex: number;
    margin: number;
    reinvestment: number;
  };
}

export interface SoilMetrics {
  kwh: number;
  carbon: number;
  biodiversity: number;
  timestamp: number;
}

export interface FinancialReport {
  opex: number;
  margin: number;
  reinvestment: number;
  timestamp: number;
}

export interface Ambassador {
  did: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold';
  joinedAt: number;
  referrals: number;
  csaMember: boolean;
  visitsCount: number;
}

export interface NodeCredoBrand {
  credo: CredoSet;                    // αʰ = Ω·s > κ (coherencia)
  purpose: string;                    // "Regenerar suelo y comunidad"
  values: string[];                   // ["Transparencia", "Regeneración", "Soberanía"]
  
  // Storytelling Honesto (Video: "No inventar historia, reconocer lo que vive")
  transparentStorytelling: {
    weeklyLog: WeeklyLogEntry[];      // Avances + Dificultades
    soilMetrics: SoilMetrics[];       // kWh, carbono, biodiversidad
    financialTransparency: FinancialReport[]; // OPEX, márgenes, reinversión
    noManipulation: boolean;          // No manipular emociones (video)
  };
  
  ambassadors: Ambassador[];
}

export interface CredoSet {
  id: string;
  name: string;
  observer: string;
  domain: string;
  elements: any[];
  harmony: number;                    // αʰ = Ω·s
  criticalThreshold: number;          // κ
  isStable: boolean;                  // αʰ > κ
  stability: boolean;
  relations: CredoRelation[];
  timestamp: number;
  
  // Brand extension (Video)
  brand?: NodeCredoBrand;
}

// UTILITIES (ya existentes)
function generateId(): string {
  return Math.random().toString(36).slice(2, 15) + Date.now().toString(36);
}

function hashData(_data: string): string {
  // TODO: SHA-256 real
  return '0'.repeat(64);
}

function signData(_data: string): string {
  // TODO: Firmar con clave privada DID
  return 'signature';
}

// ============================================================================
// CSA SUBSCRIPTION STREAM IMPLEMENTATION
// ============================================================================

export function calculateCSAMemberPrice(
  basePrice: number,
  harvestKwh: number,
  expectedKwh: number,
  config: { abundanceMultiplier: number; scarcityBuffer: number }
): number {
  if (harvestKwh >= expectedKwh * 1.2) {
    return basePrice * config.abundanceMultiplier;
  }
  if (harvestKwh <= expectedKwh * 0.8) {
    return basePrice * config.scarcityBuffer;
  }
  return basePrice;
}

export function calculateCSATQGenerated(harvestKwh: number): number {
  return harvestKwh; // 1 TQ = 1 kWh
}

export function calculateCSAZNUEmitted(memberPrice: number, priceParity: number): number {
  return memberPrice / priceParity;
}

export function validateCSATransparency(stream: CSASubscriptionStream): boolean {
  return stream.transparency.weeklyUpdate &&
         stream.transparency.soilHealthReport &&
         stream.transparency.financialTransparency;
}

export function calculateCSAAmbassadorBonus(
  referrals: number,
  bonusPerReferral: number,
  tier: 'bronze' | 'silver' | 'gold'
): number {
  const tierMultiplier = { bronze: 1, silver: 1.5, gold: 2 };
  return referrals * bonusPerReferral * tierMultiplier[tier];
}

// ============================================================================
// REGENERATIVE TOURISM IMPLEMENTATION
// ============================================================================

export function calculateTourismTQGenerated(experience: Experience): number {
  return experience.tqGenerated;
}

export function validateTourismCoherence(design: RegenerativeTourismDesign): boolean {
  const { carryingCapacity, safetyAndCoherence, experiences, metrics } = design;
  
  // Validar capacidad de carga
  if (carryingCapacity.maxVisitorsPerDay <= 0) return false;
  if (carryingCapacity.recoveryDaysBetweenGroups < 1) return false;
  
  // Validar seguridad
  if (safetyAndCoherence.guideRatio <= 0) return false;
  if (safetyAndCoherence.trails.length === 0) return false;
  if (safetyAndCoherence.emergencyPlan.evacuationRoutes.length === 0) return false;
  
  // Validar experiencias
  if (experiences.length === 0) return false;
  for (const exp of experiences) {
    if (exp.priceZNU <= 0) return false;
    if (exp.tqGenerated < 0) return false;
    if (exp.ecologicalImpact > 0) return false; // Debe ser regeneración neta (negativo)
  }
  
  // Validar métricas
  if (metrics.ecologicalImpactScore >= 0) return false; // Debe ser negativo = regeneración
  if (metrics.visitorSatisfaction < 0 || metrics.visitorSatisfaction > 100) return false;
  
  return true;
}

export function calculateTourismAmbassadorConversion(
  visitors: number,
  conversionRate: number
): number {
  return Math.floor(visitors * conversionRate);
}

export function calculateTourismZNURevenue(
  experiences: Experience[],
  participants: Map<string, number> // experienceId -> participant count
): number {
  let total = 0;
  for (const exp of experiences) {
    const count = participants.get(exp.id) || 0;
    total += exp.priceZNU * count;
  }
  return total;
}

// ============================================================================
// NODE CREDO BRAND IMPLEMENTATION
// ============================================================================

export function calculateBrandCoherence(brand: NodeCredoBrand): number {
  // αʰ del credo base
  const baseCoherence = brand.credo.harmony / brand.credo.criticalThreshold;
  
  // Penalización si no hay transparencia
  const transparencyPenalty = brand.transparentStorytelling.noManipulation ? 0 : 0.3;
  
  // Bonus por métricas de suelo reportadas
  const soilBonus = brand.transparentStorytelling.soilMetrics.length > 0 ? 0.1 : 0;
  
  // Bonus por transparencia financiera
  const financialBonus = brand.transparentStorytelling.financialTransparency.length > 0 ? 0.1 : 0;
  
  return Math.max(0, Math.min(1, baseCoherence - transparencyPenalty + soilBonus + financialBonus));
}

export function validateBrandStorytelling(brand: NodeCredoBrand): boolean {
  const { transparentStorytelling } = brand;
  
  // Debe tener log semanal con avances Y dificultades
  if (transparentStorytelling.weeklyLog.length === 0) return false;
  
  const hasAdvances = transparentStorytelling.weeklyLog.some(w => w.advances.length > 0);
  const hasDifficulties = transparentStorytelling.weeklyLog.some(w => w.difficulties.length > 0);
  if (!hasAdvances || !hasDifficulties) return false;
  
  // Debe tener métricas de suelo
  if (transparentStorytelling.soilMetrics.length === 0) return false;
  
  // Debe tener transparencia financiera
  if (transparentStorytelling.financialTransparency.length === 0) return false;
  
  // No manipulación
  if (!transparentStorytelling.noManipulation) return false;
  
  return true;
}

export function calculateAmbassadorEffectiveness(ambassador: Ambassador): number {
  const baseScore = ambassador.referrals * 10;
  const tierBonus = { bronze: 0, silver: 20, gold: 50 }[ambassador.tier];
  const csaBonus = ambassador.csaMember ? 30 : 0;
  const visitBonus = Math.min(ambassador.visitsCount * 5, 50);
  
  return baseScore + tierBonus + csaBonus + visitBonus;
}

export function generateWeeklyLogEntry(
  advances: string[],
  difficulties: string[],
  soilMetrics: { kwh: number; carbon: number; biodiversity: number },
  financials: { opex: number; margin: number; reinvestment: number }
): WeeklyLogEntry {
  return {
    date: Date.now(),
    advances,
    difficulties,
    soilMetrics,
    financials
  };
}

// ============================================================================
// ENTERPRISE STAKING STACK IMPLEMENTATION
// ============================================================================

export function computeStackMetrics(stack: EnterpriseStakingStack): StackMetrics {
  const opexAvoided = 
    stack.marketGarden.biowasteToCompost + 
    stack.pasturedPoultry.manureKwhPerMonth + 
    stack.perennialPolyculture.avoidedFertilizerKwh +
    stack.agroforestry.carbonSequestrationKwh +
    stack.regenerativeTourism.opexReduction;
  
  const tqGenerated = 
    stack.marketGarden.tqProductionPerM2 * stack.marketGarden.hectares * 10000 +
    stack.pasturedPoultry.tqPerBirdPerMonth * stack.pasturedPoultry.birdCount +
    stack.perennialPolyculture.tqPerHectarePerYear * stack.perennialPolyculture.hectares / 12 +
    stack.agroforestry.tqPerHectarePerYear * stack.agroforestry.hectares / 12 +
    stack.regenerativeTourism.tqPerVisitor * stack.regenerativeTourism.visitorsPerMonth;
  
  const znuGenerated = tqGenerated * 0.1; // 10 TQ ≈ 1 ZNU capacity
  
  const liquidityRatio = (stack.marketGarden.znuRevenue + stack.pasturedPoultry.znuRevenue) / (stack.monthlyOpex || 1);
  const stabilityRatio = (stack.csaSubscription.znuMonthlyPerMember * stack.csaSubscription.members) / (stack.yearlyFixedCosts || 1);
  const patrimonyRatio = (stack.agroforestry.landValueAppreciation + stack.regenerativeTourism.lodgingRevenue * 12) / (stack.totalInvestment || 1);
  const regenerationRatio = tqGenerated / (stack.totalArea * 10); // kWh/m² target
  
  return {
    opexAvoided,
    tqGenerated,
    znuGenerated,
    liquidityRatio,
    stabilityRatio,
    patrimonyRatio,
    regenerationRatio,
    ecologicalImpactScore: regenerationRatio * 100,
    visitorSatisfaction: stack.regenerativeTourism.visitorSatisfaction,
    brandCoherence: stack.regenerativeTourism.brandCoherence,
    csaMemberGrowth: stack.regenerativeTourism.csaConversionRate
  };
}

export function computeStakingScore(stack: EnterpriseStakingStack): number {
  const metrics = computeStackMetrics(stack);
  
  const weights = {
    liquidity: 0.25,
    stability: 0.25,
    patrimony: 0.25,
    regeneration: 0.25
  };
  
  const normalizedLiquidity = Math.min(metrics.liquidityRatio / 2, 1);
  const normalizedStability = Math.min(metrics.stabilityRatio / 2, 1);
  const normalizedPatrimony = Math.min(metrics.patrimonyRatio / 2, 1);
  const normalizedRegeneration = Math.min(metrics.regenerationRatio, 1);
  
  return (
    normalizedLiquidity * weights.liquidity +
    normalizedStability * weights.stability +
    normalizedPatrimony * weights.patrimony +
    normalizedRegeneration * weights.regeneration
  ) * 100; // Score 0-100
}