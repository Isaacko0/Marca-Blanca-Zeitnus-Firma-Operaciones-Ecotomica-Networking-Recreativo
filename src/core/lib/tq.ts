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
// UTILITIES
// ============================================================================

function generateId(): string {
  return Math.random().toString(36).slice(2, 15) + Date.now().toString(36);
}

function hashData(data: string): string {
  // TODO: SHA-256 real
  return '0'.repeat(64);
}

function signData(data: string): string {
  // TODO: Firmar con clave privada DID
  return 'signature';
}