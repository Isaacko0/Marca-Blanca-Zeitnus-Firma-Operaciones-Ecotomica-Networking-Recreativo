// HSCSG v15 OS — OVN Organizational Model (OVN 3.0: Network + Custodian + Interfaces)
// Capa 3: Operación Productiva — estructura 3 entidades core con responsabilidades definidas
// Subordinada a Capas 1-2 (Autonomía/Regeneración, Gobernanza/Conocimiento)

import type { NRPAffiliate, NRPVenture, NRPResource } from '@core/lib/nrpCasCore'
import type { PropertyRegime } from '@core/lib/propertyRegimeSystem'
import { uid, now } from '@core/lib/utils'

// ============================================
// OVN ORGANIZATIONAL STRUCTURE
// ============================================

export interface OVNNetwork {
  id: string
  name: string
  description: string
  mission: string
  values: string[] // 5 universal values: care, honesty, responsibility, respect, fairness
  createdAt: number
  updatedAt: number

  // Core entities (OVNi 3.0)
  custodian: CustodianEntity
  exchangeFirms: ExchangeFirmEntity[]
  interfaces: NetworkInterface[]

  // Affiliates (agents)
  affiliates: Map<string, NRPAffiliate>

  // Ventures (projects)
  ventures: Map<string, NRPVenture>

  // Resources
  resources: Map<string, NRPResource>

  // Governance
  governanceEquations: Map<string, string> // equationId -> logic
  accessToBenefitsAlgorithm: AccessToBenefitsConfig

  // Federation
  federatedNetworks: Map<string, FederatedNetwork>
  networkId: string // globally unique
}

export interface CustodianEntity {
  id: string
  name: string
  legalEntityId: string // traditional legal representation
  type: 'dao' | 'legal_entity' | 'hybrid'
  responsibilities: CustodianResponsibility[]
  // D7: Fiduciary/Temporal/Auditable/Recall
  fiduciaryDuties: FiduciaryDuty[]
  termStart: number
  termEnd?: number
  recallable: boolean
  auditSchedule: number // days
  // Assets under custody
  physicalAssets: string[] // resource IDs
  digitalAssets: string[] // resource IDs
  // Governance
  arbitrationRole: boolean
  multisigSigners: string[] // affiliate IDs
}

export type CustodianResponsibility =
  | 'legal_representation'
  | 'physical_asset_custody'
  | 'digital_asset_custody'
  | 'nondominium_implementation'
  | 'infrastructure_development'
  | 'infrastructure_maintenance'
  | 'community_facilitation'
  | 'arbitration'
  | 'governance_execution'

export type FiduciaryDuty =
  | 'loyalty'
  | 'care'
  | 'transparency'
  | 'accountability'
  | 'no_self_dealing'
  | 'regeneration_first'

export interface ExchangeFirmEntity {
  id: string
  name: string
  legalEntityId: string
  type: 'dao' | 'legal_entity' | 'hybrid'
  marketInterface: MarketInterfaceConfig
  // Can be absorbed by DAO (especially digital services)
  daoAbsorbable: boolean
  // Revenue streams
  revenueStreams: ExchangeRevenueStream[]
  // Mandate
  mandateStart: number
  mandateEnd?: number
  revocable: boolean
  revocationThreshold: number // % of core group
}

export interface MarketInterfaceConfig {
  markets: string[] // e.g., 'local', 'regional', 'global', 'digital'
  currenciesAccepted: string[] // 'USDC', 'EUR', 'ZNU', 'TQ'
  paymentProcessors: string[]
  compliance: ComplianceConfig
  ethicalGate: EthicalGateConfig
}

export interface ComplianceConfig {
  kycRequired: boolean
  amlRequired: boolean
  taxReporting: boolean
  jurisdictions: string[]
}

export interface EthicalGateConfig {
  enabled: boolean
  criteria: EthicalCriterion[]
  vetoPower: 'custodian' | 'core_group' | 'federation'
}

export interface EthicalCriterion {
  id: string
  name: string
  description: string
  weight: number
  threshold: number
  checkMethod: 'automated' | 'manual' | 'oracle'
}

export interface ExchangeRevenueStream {
  id: string
  name: string
  type: 'product_sales' | 'service_fees' | 'commission' | 'subscription' | 'license'
  enabled: boolean
  revenueShare: number // % to network
  touchesBaseMaterial: boolean
}

export interface NetworkInterface {
  id: string
  name: string
  type: 'api' | 'ui' | 'protocol' | 'bridge' | 'oracle'
  endpoint: string
  specification: string // OpenAPI, GraphQL schema, etc.
  accessControl: 'public' | 'affiliates' | 'core_group' | 'custodian'
  rateLimits: RateLimit[]
  monitoring: MonitoringConfig
}

export interface RateLimit {
  tier: 'anonymous' | 'affiliate' | 'core_group' | 'custodian'
  requestsPerMinute: number
  requestsPerDay: number
}

export interface MonitoringConfig {
  healthCheckEndpoint: string
  metricsEndpoint: string
  alerting: boolean
  slaTargets: SLATarget[]
}

export interface SLATarget {
  metric: 'uptime' | 'latency_p99' | 'error_rate'
  target: number
  window: string
}

export interface AccessToBenefitsConfig {
  minContributedFlows: number
  minHoursPerPeriod: number
  periodDays: number
  minReputationDimensions: Partial<Record<'quality' | 'commitment' | 'regularity' | 'collaboration' | 'innovation', number>>
  minTQBalance: number
  minZNUStake: number
  minGovernanceParticipation: number
  ventureOverrides: Map<string, Partial<AccessToBenefitsConfig>>
  projectOverrides: Map<string, Partial<AccessToBenefitsConfig>>
}

export interface FederatedNetwork {
  networkId: string
  name: string
  connectionType: 'full' | 'partial' | 'bridge_only'
  sharedProtocols: string[]
  sharedResources: string[]
  governanceAlignment: 'aligned' | 'compatible' | 'negotiated'
  connectedAt: number
  lastSyncAt: number
}

// ============================================
// OVN NETWORK ENGINE
// ============================================

export class OVNNetworkEngine {
  private network: OVNNetwork
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(networkId: string, networkName: string, mission: string) {
    this.network = this.initializeNetwork(networkId, networkName, mission)
    this.initializeDefaultGovernance()
  }

  private initializeNetwork(networkId: string, networkName: string, mission: string): OVNNetwork {
    return {
      id: uid(),
      name: networkName,
      description: '',
      mission,
      values: ['care', 'honesty', 'responsibility', 'respect', 'fairness'], // 5 universal values (D45)
      createdAt: now(),
      updatedAt: now(),
      custodian: this.createDefaultCustodian(),
      exchangeFirms: [],
      interfaces: [],
      affiliates: new Map(),
      ventures: new Map(),
      resources: new Map(),
      governanceEquations: new Map(),
      accessToBenefitsAlgorithm: this.defaultAccessToBenefitsConfig(),
      federatedNetworks: new Map(),
      networkId,
    }
  }

  private createDefaultCustodian(): CustodianEntity {
    return {
      id: uid(),
      name: 'Network Custodian',
      legalEntityId: '',
      type: 'dao',
      responsibilities: [
        'legal_representation',
        'physical_asset_custody',
        'digital_asset_custody',
        'nondominium_implementation',
        'infrastructure_development',
        'infrastructure_maintenance',
        'community_facilitation',
        'arbitration',
      ],
      fiduciaryDuties: ['loyalty', 'care', 'transparency', 'accountability', 'no_self_dealing', 'regeneration_first'],
      termStart: now(),
      termEnd: undefined,
      recallable: true,
      auditSchedule: 90, // quarterly
      physicalAssets: [],
      digitalAssets: [],
      arbitrationRole: true,
      multisigSigners: [],
    }
  }

  private defaultAccessToBenefitsConfig(): AccessToBenefitsConfig {
    return {
      minContributedFlows: 5,
      minHoursPerPeriod: 10,
      periodDays: 30,
      minReputationDimensions: {
        quality: 0.3,
        commitment: 0.3,
        regularity: 0.3,
        collaboration: 0.2,
        innovation: 0.1,
      },
      minTQBalance: 10,
      minZNUStake: 50,
      minGovernanceParticipation: 0.2,
      ventureOverrides: new Map(),
      projectOverrides: new Map(),
    }
  }

  private initializeDefaultGovernance(): void {
    // Core governance equations (OVNi 3.0)
    this.network.governanceEquations.set('contribution_accounting', `
      // Validates contribution logs against peer review and red flags
      // Calculates TQ value based on activity type, hours, and deliverables
      // Implements proof-of-stake peer review
    `)

    this.network.governanceEquations.set('benefit_redistribution', `
      // Distributes venture revenue based on contributions, AUT, CDS
      // Implements 4-registries separation (D4):
      // 1. Contribution Registry - ValueFlows logged
      // 2. Responsibility Registry - Custodianship, risk
      // 3. Resource Usage Registry - Access to commons/tools
      // 4. Economic Benefit Registry - Revenue share
      // Weight: flows * AUT * CDS with demurrage
    `)

    this.network.governanceEquations.set('access_control', `
      // Network-level access control for resources, governance, benefits
      // Uses Access to Benefits Algorithm for core group membership
    `)
  }

  // ============================================
  // NETWORK MANAGEMENT
  // ============================================

  getNetwork(): OVNNetwork {
    return this.network
  }

  updateNetwork(updates: Partial<OVNNetwork>): void {
    this.network = { ...this.network, ...updates, updatedAt: now() }
    this.emit('network_updated', this.network)
  }

  // ============================================
  // CUSTODIAN MANAGEMENT (D7: Fiduciary/Temporal/Auditable/Recall)
  // ============================================

  updateCustodian(updates: Partial<CustodianEntity>): void {
    this.network.custodian = { ...this.network.custodian, ...updates }
    this.network.updatedAt = now()
    this.emit('custodian_updated', this.network.custodian)
  }

  addCustodianMultisigSigner(affiliateId: string): boolean {
    if (!this.network.custodian.multisigSigners.includes(affiliateId)) {
      this.network.custodian.multisigSigners.push(affiliateId)
      this.network.updatedAt = now()
      return true
    }
    return false
  }

  removeCustodianMultisigSigner(affiliateId: string): boolean {
    const index = this.network.custodian.multisigSigners.indexOf(affiliateId)
    if (index !== -1) {
      this.network.custodian.multisigSigners.splice(index, 1)
      this.network.updatedAt = now()
      return true
    }
    return false
  }

  initiateCustodianRecall(reason: string, initiatorId: string): CustodianRecallProcess {
    const process: CustodianRecallProcess = {
      id: uid(),
      custodianId: this.network.custodian.id,
      initiatorId,
      reason,
      startedAt: now(),
      status: 'voting',
      votes: [],
      threshold: 0.67, // 2/3 core group
      requiredQuorum: 0.5, // 50% core group participation
    }
    this.emit('custodian_recall_initiated', process)
    return process
  }

  voteCustodianRecall(processId: string, voterId: string, vote: 'recall' | 'keep'): boolean {
    // Would track recall process
    return true
  }

  executeCustodianRecall(processId: string): boolean {
    // Would execute recall, appoint interim custodian
    return true
  }

  // ============================================
  // EXCHANGE FIRM MANAGEMENT (D27: DAO-absorbible, Market Bridge Ethical)
  // ============================================

  createExchangeFirm(firm: Omit<ExchangeFirmEntity, 'id' | 'mandateStart'>): ExchangeFirmEntity {
    const newFirm: ExchangeFirmEntity = {
      ...firm,
      id: uid(),
      mandateStart: now(),
    }
    this.network.exchangeFirms.push(newFirm)
    this.network.updatedAt = now()
    this.emit('exchange_firm_created', newFirm)
    return newFirm
  }

  revokeExchangeFirm(firmId: string, reason: string): boolean {
    const index = this.network.exchangeFirms.findIndex(f => f.id === firmId)
    if (index === -1) return false

    const firm = this.network.exchangeFirms[index]
    if (!firm.revocable) return false

    firm.mandateEnd = now()
    this.emit('exchange_firm_revoked', { firm, reason })
    return true
  }

  absorbExchangeFirmIntoDAO(firmId: string): boolean {
    const firm = this.network.exchangeFirms.find(f => f.id === firmId)
    if (!firm || !firm.daoAbsorbable) return false

    // Transfer functions to DAO (custodian or governance)
    firm.type = 'dao'
    this.emit('exchange_firm_absorbed', firm)
    return true
  }

  // ============================================
  // NETWORK INTERFACES
  // ============================================

  registerInterface(iface: Omit<NetworkInterface, 'id'>): NetworkInterface {
    const newInterface: NetworkInterface = {
      ...iface,
      id: uid(),
    }
    this.network.interfaces.push(newInterface)
    this.network.updatedAt = now()
    return newInterface
  }

  // ============================================
  // AFFILIATE MANAGEMENT
  // ============================================

  registerAffiliate(affiliate: NRPAffiliate): void {
    this.network.affiliates.set(affiliate.id, affiliate)
    this.network.updatedAt = now()
  }

  getAffiliate(id: string): NRPAffiliate | undefined {
    return this.network.affiliates.get(id)
  }

  getActiveAffiliates(): NRPAffiliate[] {
    return Array.from(this.network.affiliates.values()).filter(a => a.status === 'active')
  }

  // ============================================
  // CORE GROUP MEMBERSHIP (Access to Benefits Algorithm)
  // ============================================

  evaluateCoreGroupMembership(affiliateId: string, ventureId?: string): boolean {
    const affiliate = this.network.affiliates.get(affiliateId)
    if (!affiliate || affiliate.status !== 'active') return false

    const config = ventureId
      ? this.network.accessToBenefitsAlgorithm.ventureOverrides.get(ventureId)
      : this.network.accessToBenefitsAlgorithm

    const effectiveConfig = config || this.network.accessToBenefitsAlgorithm

    if (affiliate.contributedFlows < effectiveConfig.minContributedFlows) return false

    for (const [dimension, threshold] of Object.entries(effectiveConfig.minReputationDimensions)) {
      const rep = affiliate.reputationDimensions.find(r => r.dimension === dimension)
      if (!rep || rep.score < threshold) return false
    }

    if (affiliate.tqBalance < effectiveConfig.minTQBalance) return false
    if (affiliate.znuBalance < effectiveConfig.minZNUStake) return false

    return true
  }

  updateCoreGroupMemberships(): void {
    for (const affiliate of this.network.affiliates.values()) {
      affiliate.coreGroupMember = this.evaluateCoreGroupMembership(affiliate.id)
      for (const venture of this.network.ventures.values()) {
        if (this.evaluateCoreGroupMembership(affiliate.id, venture.id)) {
          if (!affiliate.projectCoreGroups.includes(venture.id)) {
            affiliate.projectCoreGroups.push(venture.id)
          }
        } else {
          affiliate.projectCoreGroups = affiliate.projectCoreGroups.filter(v => v !== venture.id)
        }
      }
    }
  }

  // ============================================
  // FEDERATION (D25: Fractal Governance Structure)
  // ============================================

  federateWithNetwork(federated: FederatedNetwork): void {
    this.network.federatedNetworks.set(federated.networkId, {
      ...federated,
      connectedAt: now(),
      lastSyncAt: now(),
    })
    this.network.updatedAt = now()
  }

  syncFederatedNetwork(networkId: string): void {
    const fed = this.network.federatedNetworks.get(networkId)
    if (fed) {
      fed.lastSyncAt = now()
      this.network.updatedAt = now()
    }
  }

  // ============================================
  // GOVERNANCE EQUATIONS
  // ============================================

  registerGovernanceEquation(id: string, logic: string): void {
    this.network.governanceEquations.set(id, logic)
    this.network.updatedAt = now()
  }

  getGovernanceEquation(id: string): string | undefined {
    return this.network.governanceEquations.get(id)
  }

  // ============================================
  // EVENT SYSTEM
  // ============================================

  on(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event) || []
    handlers.push(handler)
    this.eventHandlers.set(event, handlers)
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event) || []
    for (const handler of handlers) {
      try {
        handler(data)
      } catch (e) {
        console.error(`Event handler error for ${event}:`, e)
      }
    }
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  toJSON(): string {
    return JSON.stringify({
      ...this.network,
      affiliates: Array.from(this.network.affiliates.entries()),
      ventures: Array.from(this.network.ventures.entries()),
      resources: Array.from(this.network.resources.entries()),
      governanceEquations: Array.from(this.network.governanceEquations.entries()),
      accessToBenefitsAlgorithm: this.network.accessToBenefitsAlgorithm,
      federatedNetworks: Array.from(this.network.federatedNetworks.entries()),
    }, null, 2)
  }

  static fromJSON(json: string): OVNNetworkEngine {
    const data = JSON.parse(json)
    const engine = new OVNNetworkEngine(data.networkId, data.name, data.mission)
    engine.network = {
      ...data,
      affiliates: new Map(data.affiliates),
      ventures: new Map(data.ventures),
      resources: new Map(data.resources),
      governanceEquations: new Map(data.governanceEquations),
      accessToBenefitsAlgorithm: data.accessToBenefitsAlgorithm,
      federatedNetworks: new Map(data.federatedNetworks),
    }
    return engine
  }
}

export interface CustodianRecallProcess {
  id: string
  custodianId: string
  initiatorId: string
  reason: string
  startedAt: number
  status: 'voting' | 'passed' | 'failed' | 'executed'
  votes: Array<{ voterId: string; vote: 'recall' | 'keep'; timestamp: number }>
  threshold: number
  requiredQuorum: number
}

export const ovnNetworkEngine = new OVNNetworkEngine('main', 'HSCSG Network', 'Autonomía metabólica y abundancia compartida')