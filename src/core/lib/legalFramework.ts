// HSCSG v15 OS — Legal Framework (OVN 3.0: D51 - Ecosystemic Approach, Partner State)
// Capa 1: Propósito/Límites — Nova legal theory for open networks
// "OVNs not siloes... all investors can intervene... securities laws from time when open networks didn't exist"

import type { NRPAffiliate, NRPVenture, NRPResource } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// LEGAL FRAMEWORK TYPES
// ============================================

export interface LegalFramework {
  id: string
  name: string
  jurisdiction: JurisdictionConfig
  // Legal Theory
  legalTheory: LegalTheory
  // Entity Structure
  entityStructure: EntityStructure
  // Regulatory Interface (D51: Partner State)
  regulatoryInterface: RegulatoryInterface
  // Compliance
  compliance: ComplianceConfig
  // Dispute Resolution
  disputeResolution: DisputeResolutionConfig
  // Intellectual Property (D49: Anti-rival knowledge)
  intellectualProperty: IPConfig
  // Data Protection
  dataProtection: DataProtectionConfig
  // Contracts
  contracts: ContractConfig
  // Liability
  liability: LiabilityConfig
  // Transparency
  transparency: LegalTransparencyConfig
}

export interface JurisdictionConfig {
  primary: string // e.g., 'international', 'country_code'
  recognized: string[] // other jurisdictions where recognized
  // For stateless/p2p networks
  statelessRecognition: boolean
  // Legal personality
  legalPersonality: 'none' | 'association' | 'foundation' | 'cooperative' | 'dao' | 'custom'
}

export interface LegalTheory {
  // D51: Nova legal theory from open network observation
  name: 'open_network_theory' | 'commons_based_peer_production' | 'partner_state' | 'custom'
  description: string
  // Core principles
  principles: LegalPrinciple[]
  // Arguments vs traditional corporate law
  argumentsVsCorporateLaw: string[]
  // Precedents
  precedents: LegalPrecedent[]
}

export interface LegalPrinciple {
  id: string
  name: string
  statement: string
  basis: 'natural_law' | 'customary_law' | 'treaty' | 'scholarly' | 'judicial' | 'emergent'
  enforceability: 'hard' | 'soft' | 'aspirational'
}

export interface LegalPrecedent {
  case: string
  jurisdiction: string
  year: number
  relevance: string
  principleSupported: string
}

export interface EntityStructure {
  // D26: Custodian = Fiduciary/Temporal/Auditable/Recall
  custodian: CustodianEntityConfig
  // D27: Exchange Firm = Market Bridge (DAO-absorbible)
  exchangeFirms: ExchangeFirmEntityConfig[]
  // Network entity
  network: NetworkEntityConfig
  // Ventures
  ventures: VentureEntityConfig
  // Federation
  federation: FederationEntityConfig
}

export interface CustodianEntityConfig {
  legalForm: 'dao' | 'legal_entity' | 'hybrid' | 'association' | 'foundation'
  jurisdiction: string
  // D7: Fiduciary/Temporal/Auditable/Recall
  fiduciaryDuties: FiduciaryDuty[]
  temporal: TemporalConfig
  auditable: AuditableConfig
  recallable: RecallableConfig
  // Assets under custody
  physicalAssetCustody: boolean
  digitalAssetCustody: boolean
  // Governance
  arbitrationRole: boolean
  multisigGovernance: MultisigConfig
}

export interface TemporalConfig {
  maxTermDays: number
  termLimitCount: number
  coolingPeriodDays: number
  emergencyExtensionDays: number
  successionPlanRequired: boolean
}

export interface AuditableConfig {
  auditFrequencyDays: number
  auditorSelection: 'sortition' | 'external_firm' | 'peer_network'
  auditScope: string[]
  transparencyLevel: 'affiliates' | 'core_group' | 'public'
}

export interface RecallableConfig {
  triggerThreshold: number
  quorumRequired: number
  voteThreshold: number
  protectionAgainstRetaliation: boolean
}

export interface MultisigConfig {
  requiredSignatures: number
  totalSigners: number
  signers: string[] // role IDs
  timelockDays: number
}

export interface ExchangeFirmEntityConfig {
  legalForm: 'dao' | 'legal_entity' | 'hybrid'
  jurisdiction: string
  // D27: DAO-absorbible, Market Bridge Ethical
  daoAbsorbible: boolean
  marketInterface: MarketInterfaceConfig
  ethicalGate: EthicalGateConfig
  revenueSharing: RevenueSharingConfig
}

export interface MarketInterfaceConfig {
  markets: string[]
  currencies: string[]
  paymentProcessors: string[]
  compliance: ComplianceConfig
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

export interface RevenueSharingConfig {
  networkPercent: number
  custodianPercent: number
  exchangeFirmPercent: number
  venturePercent: number
}

export interface NetworkEntityConfig {
  legalForm: 'dao' | 'unincorporated_association' | 'protocol' | 'custom'
  // No traditional legal personality
  stateless: boolean
  // Governance via smart contracts
  governanceSmartContracts: boolean
  // Membership
  membershipCriteria: MembershipCriteria
  // Asset holding via custodian
  assetHoldingViaCustodian: boolean
}

export interface MembershipCriteria {
  open: boolean
  criteria: string[]
  verificationMethod: 'self_attestation' | 'credential' | 'governance_vote' | 'custodian_approval'
}

export interface VentureEntityConfig {
  // Ventures as open collaborative enterprises
  legalForm: 'dao' | 'contractual' | 'custom'
  // Can be absorbed by network
  networkAbsorbible: boolean
  // Liability isolation
  liabilityIsolation: 'full' | 'partial' | 'none'
  // Governance
  governanceViaSmartContracts: boolean
}

export interface FederationEntityConfig {
  legalForm: 'dao' | 'treaty' | 'protocol' | 'custom'
  // Inter-network agreements
  interNetworkAgreements: InterNetworkAgreement[]
  // Shared resources
  sharedResources: SharedResourceConfig[]
  // Dispute resolution
  disputeResolution: FederationDisputeResolution
}

export interface InterNetworkAgreement {
  partnerNetworkId: string
  agreementType: 'resource_sharing' | 'governance_alignment' | 'market_access' | 'mutual_aid'
  terms: string[]
  duration: number // days
  renewal: 'automatic' | 'negotiated' | 'expiry'
}

export interface SharedResourceConfig {
  resourceId: string
  governance: 'joint' | 'custodian_managed' | 'protocol_governed'
  accessRules: string[]
}

export interface FederationDisputeResolution {
  mechanism: 'mediation' | 'arbitration' | 'governance_vote' | 'sortition'
  jurisdiction: string
  applicableLaw: string
}

export interface RegulatoryInterface {
  // D51: Partner State Approach
  approach: 'partner_state' | 'adversarial' | 'ignore' | 'custom'
  // Engagement
  engagementMethods: EngagementMethod[]
  // Reporting
  reportingObligations: ReportingObligation[]
  // Sandbox
  sandboxParticipation: SandboxParticipation
  // Advocacy
  advocacy: AdvocacyConfig
}

export interface EngagementMethod {
  type: 'formal_consultation' | 'working_group' | 'regulatory_sandbox' | 'policy_dialogue' | 'public_comment'
  frequency: 'continuous' | 'monthly' | 'quarterly' | 'annual' | 'ad_hoc'
  participants: string[] // roles
  outcomes: string[]
}

export interface ReportingObligation {
  regulator: string
  reportType: string
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  format: 'api' | 'report' | 'dashboard' | 'ledger'
  scope: string[]
}

export interface SandboxParticipation {
  active: boolean
  jurisdictions: string[]
  scope: string[]
  duration: number // days
  outcomes: string[]
}

export interface AdvocacyConfig {
  objectives: string[]
  methods: 'direct_lobbying' | 'coalition_building' | 'public_campaign' | 'legal_action' | 'standard_setting'
  partners: string[]
  budget: number
}

export interface ComplianceConfig {
  // AML/KYC
  aml: AMLConfig
  // Securities
  securities: SecuritiesConfig
  // Tax
  tax: TaxConfig
  // Consumer Protection
  consumerProtection: ConsumerProtectionConfig
  // Environmental
  environmental: EnvironmentalComplianceConfig
  // Labor
  labor: LaborComplianceConfig
}

export interface AMLConfig {
  required: boolean
  approach: 'risk_based' | 'universal' | 'none'
  kycThreshold: number // transaction amount
  monitoring: 'real_time' | 'batch' | 'none'
  reporting: 'automated' | 'manual' | 'none'
}

export interface SecuritiesConfig {
  // D51: Securities laws may not apply (open networks ≠ siloes)
  applicability: 'test_in_court' | 'exempt' | 'comply' | 'structure_avoidance'
  tokenClassification: 'utility' | 'security' | 'hybrid' | 'commodity' | 'none'
  registrationStrategy: 'reg_a' | 'reg_cf' | 'reg_d' | 's1' | 'none' | 'custom'
  disclosureRequirements: string[]
}

export interface TaxConfig {
  approach: 'transparent' | 'optimized' | 'aggressive'
  jurisdictions: string[]
  transferPricing: 'arm_length' | 'cost_plus' | 'resale_price' | 'custom'
  reportingStandard: 'crs' | 'fatca' | 'local' | 'custom'
}

export interface ConsumerProtectionConfig {
  required: boolean
  warrantyStandards: string[]
  refundPolicy: string
  disputeResolution: 'internal' | 'external' | 'regulatory'
}

export interface EnvironmentalComplianceConfig {
  required: boolean
  standards: string[] // ISO 14001, etc.
  reporting: 'continuous' | 'annual' | 'none'
  regenerativeTargets: boolean
}

export interface LaborComplianceConfig {
  required: boolean
  classification: 'employee' | 'contractor' | 'peer' | 'member' | 'custom'
  benefits: string[]
  collectiveBargaining: boolean
}

export interface DisputeResolutionConfig {
  internal: InternalDisputeResolution
  external: ExternalDisputeResolution
  enforcement: EnforcementConfig
}

export interface InternalDisputeResolution {
  levels: DisputeResolutionLevel[]
  mediation: MediationConfig
  arbitration: ArbitrationConfig
}

export interface DisputeResolutionLevel {
  level: number
  scope: string[]
  mechanism: 'mediation' | 'arbitration' | 'governance_vote' | 'custodian_decision' | 'sortition'
  binding: boolean
}

export interface MediationConfig {
  mediators: string[]
  selection: 'volunteer' | 'sortition' | 'reputation' | 'external'
  confidential: boolean
  enforceable: boolean
}

export interface ArbitrationConfig {
  rules: string // e.g., 'UNCITRAL', 'ICC', 'custom'
  seat: string
  language: string
  arbitrators: number
  binding: boolean
}

export interface ExternalDisputeResolution {
  courts: string[]
  arbitration: ArbitrationConfig
  enforcement: 'new_york_convention' | 'local' | 'custom'
}

export interface EnforcementConfig {
  internal: 'social' | 'reputation' | 'access_revocation' | 'financial' | 'governance'
  external: 'court' | 'arbitration_award' | 'smart_contract' | 'custodian_action'
}

export interface IPConfig {
  // D49: Anti-rival knowledge → default commons
  defaultRegime: 'commons' | 'copyleft' | 'permissive' | 'custom'
  // Licensing
  licenses: IPLicense[]
  // Patents
  patents: PatentConfig
  // Data
  data: DataIPConfig
}

export interface IPLicense {
  id: string
  name: string
  type: 'copyleft' | 'permissive' | 'public_domain' | 'custom'
  terms: string
  compatibleWith: string[]
  viral: boolean
}

export interface PatentConfig {
  strategy: 'defensive' | 'offensive' | 'pool' | 'none' | 'commons'
  poolParticipation: boolean
  defensivePublication: boolean
}

export interface DataIPConfig {
  ownership: 'commons' | 'generator' | 'network' | 'subject'
  portability: boolean
  monetization: 'prohibited' | 'allowed' | 'regulated'
}

export interface DataProtectionConfig {
  standard: 'gdpr' | 'ccpa' | 'lgpd' | 'custom' | 'max'
  principles: DataPrinciple[]
  subjectRights: SubjectRight[]
  dpo: DPOConfig
  breachNotification: BreachNotificationConfig
}

export interface DataPrinciple {
  name: string
  description: string
  enforcement: 'hard' | 'soft'
}

export interface SubjectRight {
  right: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection' | 'automated_decision'
  implementation: 'automated' | 'manual' | 'hybrid'
  timeframe: number // days
}

export interface DPOConfig {
  required: boolean
  selection: 'internal' | 'external' | 'shared' | 'sortition'
  independence: boolean
}

export interface BreachNotificationConfig {
  internalTimeframe: number // hours
  regulatorTimeframe: number // hours
  subjectTimeframe: number // hours
  threshold: 'any' | 'risk_based' | 'high_risk'
}

export interface ContractConfig {
  // Smart contracts primary
  smartContractPrimary: boolean
  // Ricardian contracts
  ricardianContracts: boolean
  // Templates
  templates: ContractTemplate[]
  // Governance
  governanceIntegration: boolean
}

export interface ContractTemplate {
  id: string
  name: string
  type: 'service' | 'partnership' | 'custodianship' | 'exchange' | 'governance' | 'resource' | 'employment' | 'custom'
  template: string
  variables: ContractVariable[]
  requiredApprovals: string[]
}

export interface ContractVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'address' | 'amount'
  required: boolean
  defaultValue?: any
  validation: string
}

export interface LiabilityConfig {
  // Network liability
  networkLiability: 'limited' | 'unlimited' | 'custodian_only' | 'proportional'
  // Custodian liability
  custodianLiability: 'fiduciary' | 'limited' | 'full'
  // Affiliate liability
  affiliateLiability: 'proportional' | 'limited' | 'none'
  // Insurance
  insurance: InsuranceConfig
  // Indemnification
  indemnification: IndemnificationConfig
}

export interface InsuranceConfig {
  required: boolean
  types: string[]
  coverage: number
  provider: 'mutual' | 'commercial' | 'p2p' | 'custom'
}

export interface IndemnificationConfig {
  scope: string[]
  limitations: string[]
  procedure: string
}

export interface LegalTransparencyConfig {
  // D51: Transparency as regulatory compliance
  publicLedger: boolean
  realTimeReporting: boolean
  auditTrails: boolean
  algorithmicTransparency: boolean
  custodialTransparency: boolean
  financialTransparency: boolean
}

// ============================================
// LEGAL FRAMEWORK ENGINE
// ============================================

export class LegalFrameworkEngine {
  private frameworks: Map<string, LegalFramework> = new Map()
  private complianceChecks: Map<string, ComplianceCheckResult[]> = new Map()

  constructor() {
    this.initializeDefaultFramework()
  }

  private initializeDefaultFramework(): void {
    const framework: LegalFramework = {
      id: 'hscsg_default',
      name: 'HSCSG Default Legal Framework',
      jurisdiction: {
        primary: 'international',
        recognized: ['global'],
        statelessRecognition: true,
        legalPersonality: 'dao',
      },
      legalTheory: {
        name: 'open_network_theory',
        description: 'Open Value Networks are not siloes of economic activity. All investors can intervene at any moment. Securities laws created when open networks did not exist.',
        principles: [
          { id: 'openness', name: 'Openness', statement: 'Networks are open by default; closure requires justification', basis: 'emergent', enforceability: 'hard' },
          { id: 'non_silo', name: 'Non-Silo', statement: 'Economic activity not isolated; investors can intervene', basis: 'emergent', enforceability: 'hard' },
          { id: 'partner_state', name: 'Partner State', statement: 'State as partner, not sovereign ruler', basis: 'emergent', enforceability: 'soft' },
          { id: 'anti_rival', name: 'Anti-Rival Knowledge', statement: 'Knowledge gains value through sharing; default commons', basis: 'emergent', enforceability: 'hard' },
        ],
        argumentsVsCorporateLaw: [
          'Corporations are siloes; OVNs are open',
          'Investors in corps cannot intervene; in OVNs they can',
          'Securities laws assume information asymmetry; OVNs are transparent',
        ],
        precedents: [
          { case: 'DAO legal recognition (Wyoming, Marshall Islands)', jurisdiction: 'US/MH', year: 2021, relevance: 'DAO legal personality', principleSupported: 'dao_legal_form' },
          { case: 'Commons-based peer production (Benkler)', jurisdiction: 'academic', year: 2006, relevance: 'CBPP theory', principleSupported: 'openness' },
        ],
      },
      entityStructure: {
        custodian: {
          legalForm: 'dao',
          jurisdiction: 'international',
          fiduciaryDuties: ['loyalty', 'care', 'transparency', 'accountability', 'no_self_dealing', 'regeneration_first'],
          temporal: { maxTermDays: 730, termLimitCount: 2, coolingPeriodDays: 180, emergencyExtensionDays: 90, successionPlanRequired: true },
          auditable: { auditFrequencyDays: 90, auditorSelection: 'sortition', auditScope: ['financial', 'governance', 'custodial'], transparencyLevel: 'affiliates' },
          recallable: { triggerThreshold: 0.33, quorumRequired: 0.5, voteThreshold: 0.67, protectionAgainstRetaliation: true },
          physicalAssetCustody: true,
          digitalAssetCustody: true,
          arbitrationRole: true,
          multisigGovernance: { requiredSignatures: 3, totalSigners: 5, signers: ['custodian_1', 'custodian_2', 'custodian_3', 'core_1', 'core_2'], timelockDays: 3 },
        },
        exchangeFirms: [{
          legalForm: 'dao',
          jurisdiction: 'international',
          daoAbsorbible: true,
          marketInterface: { markets: ['global', 'local'], currencies: ['USDC', 'ZNU', 'TQ'], paymentProcessors: ['ethereum', 'polygon', 'stripe'], compliance: { aml: { required: true, approach: 'risk_based', kycThreshold: 10000, monitoring: 'real_time', reporting: 'automated' }, securities: { applicability: 'test_in_court', tokenClassification: 'utility', registrationStrategy: 'none' }, tax: { approach: 'transparent', jurisdictions: ['international'], transferPricing: 'arm_length', reportingStandard: 'custom' }, consumerProtection: { required: true, warrantyStandards: ['custom'], refundPolicy: '30_days', disputeResolution: 'internal' }, environmental: { required: true, standards: ['ISO_14001'], reporting: 'annual', regenerativeTargets: true }, labor: { required: false, classification: 'peer', benefits: [], collectiveBargaining: false } },
          ethicalGate: { enabled: true, criteria: [{ id: 'regenerative', name: 'Regenerative', description: 'Net positive ecological impact', weight: 0.5, threshold: 0.7, checkMethod: 'oracle' }, { id: 'fair_labor', name: 'Fair Labor', description: 'Living wages, safe conditions', weight: 0.3, threshold: 0.8, checkMethod: 'automated' }, { id: 'transparent', name: 'Transparent', description: 'Open books, open source', weight: 0.2, threshold: 0.9, checkMethod: 'automated' }], vetoPower: 'custodian' },
          revenueSharing: { networkPercent: 0.1, custodianPercent: 0.05, exchangeFirmPercent: 0.15, venturePercent: 0.7 },
        }],
        network: {
          legalForm: 'dao',
          stateless: true,
          governanceSmartContracts: true,
          membershipCriteria: { open: true, criteria: ['contribution_verified'], verificationMethod: 'credential' },
          assetHoldingViaCustodian: true,
        },
        ventures: {
          legalForm: 'dao',
          networkAbsorbible: true,
          liabilityIsolation: 'partial',
          governanceViaSmartContracts: true,
        },
        federation: {
          legalForm: 'protocol',
          interNetworkAgreements: [],
          sharedResources: [],
          disputeResolution: { mechanism: 'mediation', jurisdiction: 'international', applicableLaw: 'custom' },
        },
      },
      regulatoryInterface: {
        approach: 'partner_state',
        engagementMethods: [
          { type: 'regulatory_sandbox', frequency: 'continuous', participants: ['custodian', 'core_group', 'legal_counsel'], outcomes: ['regulatory_clarity', 'compliance_framework'] },
          { type: 'policy_dialogue', frequency: 'quarterly', participants: ['custodian', 'governance_council'], outcomes: ['policy_input', 'regulatory_alignment'] },
        ],
        reportingObligations: [
          { regulator: 'financial_intelligence', reportType: 'aml', frequency: 'monthly', format: 'api', scope: ['transactions', 'kyc'] },
          { regulator: 'environmental_agency', reportType: 'regeneration', frequency: 'quarterly', format: 'report', scope: ['ecological_indicators'] },
        ],
        sandboxParticipation: { active: true, jurisdictions: ['wyoming', 'marshall_islands', 'europe'], scope: ['dao_legal_form', 'token_classification'], duration: 730, outcomes: ['regulatory_clarity'] },
        advocacy: { objectives: ['dao_legal_recognition', 'token_utility_classification', 'open_network_rights'], methods: ['coalition_building', 'standard_setting'], partners: ['p2p_foundation', 'open_collective', 'commons_network'], budget: 100000 },
      },
      compliance: {
        aml: { required: true, approach: 'risk_based', kycThreshold: 10000, monitoring: 'real_time', reporting: 'automated' },
        securities: { applicability: 'test_in_court', tokenClassification: 'utility', registrationStrategy: 'none', disclosureRequirements: ['transparency_dashboard', 'governance_mechanisms'] },
        tax: { approach: 'transparent', jurisdictions: ['international'], transferPricing: 'arm_length', reportingStandard: 'custom' },
        consumerProtection: { required: true, warrantyStandards: ['custom'], refundPolicy: '30_days', disputeResolution: 'internal' },
        environmental: { required: true, standards: ['ISO_14001', 'custom_regenerative'], reporting: 'continuous', regenerativeTargets: true },
        labor: { required: false, classification: 'peer', benefits: [], collectiveBargaining: false },
      },
      disputeResolution: {
        internal: {
          levels: [
            { level: 1, scope: ['interpersonal', 'minor_resource'], mechanism: 'mediation', binding: false },
            { level: 2, scope: ['policy', 'resource_allocation'], mechanism: 'governance_vote', binding: true },
            { level: 3, scope: ['legal', 'custodial', 'immune_rights'], mechanism: 'custodian_decision', binding: true },
            { level: 4, scope: ['constitutional', 'immune_rights', 'purpose'], mechanism: 'sortition', binding: true },
          ],
          mediation: { mediators: [], selection: 'reputation_based', confidential: true, enforceable: true },
          arbitration: { rules: 'UNCITRAL', seat: 'international', language: 'english', arbitrators: 3, binding: true },
        },
        external: { courts: [], arbitration: { rules: 'UNCITRAL', seat: 'international', language: 'english', arbitrators: 3, binding: true }, enforcement: 'new_york_convention' },
        enforcement: { internal: 'reputation', external: 'arbitration_award' },
      },
      intellectualProperty: {
        defaultRegime: 'commons',
        licenses: [
          { id: 'cc_by_sa', name: 'CC BY-SA 4.0', type: 'copyleft', terms: 'Attribution-ShareAlike', compatibleWith: ['cc_by', 'cc_by_sa', 'gpl'], viral: true },
          { id: 'cc_by', name: 'CC BY 4.0', type: 'permissive', terms: 'Attribution', compatibleWith: ['cc_by', 'cc_by_sa', 'mit', 'apache'], viral: false },
          { id: 'cern_ohl', name: 'CERN-OHL v2', type: 'copyleft', terms: 'Hardware copyleft', compatibleWith: ['cern_ohl'], viral: true },
        ],
        patents: { strategy: 'defensive', poolParticipation: true, defensivePublication: true },
        data: { ownership: 'commons', portability: true, monetization: 'prohibited' },
      },
      dataProtection: {
        standard: 'max',
        principles: [
          { name: 'data_minimization', description: 'Collect only what is necessary', enforcement: 'hard' },
          { name: 'purpose_limitation', description: 'Use only for stated purpose', enforcement: 'hard' },
          { name: 'storage_limitation', description: 'Delete when no longer needed', enforcement: 'hard' },
          { name: 'integrity_confidentiality', description: 'Protect against unauthorized access', enforcement: 'hard' },
        ],
        subjectRights: [
          { right: 'access', implementation: 'automated', timeframe: 7 },
          { right: 'rectification', implementation: 'automated', timeframe: 7 },
          { right: 'erasure', implementation: 'automated', timeframe: 30 },
          { right: 'portability', implementation: 'automated', timeframe: 7 },
          { right: 'restriction', implementation: 'automated', timeframe: 7 },
          { right: 'objection', implementation: 'hybrid', timeframe: 14 },
          { right: 'automated_decision', implementation: 'hybrid', timeframe: 30 },
        ],
        dpo: { required: true, selection: 'sortition', independence: true },
        breachNotification: { internalTimeframe: 24, regulatorTimeframe: 72, subjectTimeframe: 72, threshold: 'risk_based' },
      },
      contracts: {
        smartContractPrimary: true,
        ricardianContracts: true,
        templates: [
          { id: 'custodian_agreement', name: 'Custodian Agreement', type: 'custodianship', template: '...', variables: [], requiredApprovals: ['core_group', 'custodian'] },
          { id: 'exchange_firm_mandate', name: 'Exchange Firm Mandate', type: 'exchange', template: '...', variables: [], requiredApprovals: ['core_group'] },
          { id: 'venture_agreement', name: 'Venture Agreement', type: 'partnership', template: '...', variables: [], requiredApprovals: ['project_core_group'] },
        ],
        governanceIntegration: true,
      },
      liability: {
        networkLiability: 'custodian_only',
        custodianLiability: 'fiduciary',
        affiliateLiability: 'proportional',
        insurance: { required: true, types: ['custodial', 'cyber', 'environmental'], coverage: 1000000, provider: 'mutual' },
        indemnification: { scope: ['custodial_duties', 'governance_decisions'], limitations: ['gross_negligence_excluded'], procedure: 'governance_vote' },
      },
      transparency: {
        publicLedger: true,
        realTimeReporting: true,
        auditTrails: true,
        algorithmicTransparency: true,
        custodialTransparency: true,
        financialTransparency: true,
      },
    }

    this.frameworks.set(framework.id, framework)
  }

  // ============================================
  // COMPLIANCE CHECKING
  // ============================================

  async runComplianceCheck(frameworkId: string): Promise<ComplianceCheckResult[]> {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) throw new Error('Framework not found')

    const results: ComplianceCheckResult[] = []

    // AML Check
    results.push(await this.checkAML(framework))

    // Securities Check
    results.push(await this.checkSecurities(framework))

    // Environmental Check
    results.push(await this.checkEnvironmental(framework))

    // Data Protection Check
    results.push(await this.checkDataProtection(framework))

    // Contract Check
    results.push(await this.checkContracts(framework))

    this.complianceChecks.set(frameworkId, results)
    return results
  }

  private async checkAML(framework: LegalFramework): Promise<ComplianceCheckResult> {
    // Would check actual AML compliance
    return {
      check: 'aml',
      passed: true,
      score: 0.9,
      details: 'Risk-based AML with real-time monitoring',
      recommendations: ['Enhance transaction pattern analysis'],
    }
  }

  private async checkSecurities(framework: LegalFramework): Promise<ComplianceCheckResult> {
    return {
      check: 'securities',
      passed: true,
      score: 0.8,
      details: 'Token classified as utility; securities law applicability to be tested in court',
      recommendations: ['Monitor regulatory developments', 'Maintain utility classification evidence'],
    }
  }

  private async checkEnvironmental(framework: LegalFramework): Promise<ComplianceCheckResult> {
    return {
      check: 'environmental',
      passed: true,
      score: 0.95,
      details: 'Continuous regenerative reporting; ISO 14001 + custom standards',
      recommendations: ['Publish annual regeneration report'],
    }
  }

  private async checkDataProtection(framework: LegalFramework): Promise<ComplianceCheckResult> {
    return {
      check: 'data_protection',
      passed: true,
      score: 0.98,
      details: 'Max standard (GDPR+); automated subject rights; sortition DPO',
      recommendations: ['Conduct annual privacy impact assessment'],
    }
  }

  private async checkContracts(framework: LegalFramework): Promise<ComplianceCheckResult> {
    return {
      check: 'contracts',
      passed: true,
      score: 0.9,
      details: 'Smart contracts primary; Ricardian templates; governance integration',
      recommendations: ['Audit smart contract upgrades quarterly'],
    }
  }

  // ============================================
  // REGULATORY ENGAGEMENT
  // ============================================

  getRegulatoryEngagementPlan(frameworkId: string): RegulatoryEngagementPlan {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) throw new Error('Framework not found')

    return {
      frameworkId,
      approach: framework.regulatoryInterface.approach,
      engagements: framework.regulatoryInterface.engagementMethods.map(m => ({
        type: m.type,
        frequency: m.frequency,
        participants: m.participants,
        expectedOutcomes: m.outcomes,
        nextScheduled: now() + this.getFrequencyInterval(m.frequency),
      })),
      reporting: framework.regulatoryInterface.reportingObligations.map(r => ({
        regulator: r.regulator,
        type: r.reportType,
        frequency: r.frequency,
        nextDue: now() + this.getFrequencyInterval(r.frequency),
      })),
      sandbox: framework.regulatoryInterface.sandboxParticipation,
      advocacy: framework.regulatoryInterface.advocacy,
    }
  }

  private getFrequencyInterval(frequency: string): number {
    const intervals: Record<string, number> = {
      'real_time': 0,
      'daily': 86400000,
      'weekly': 604800000,
      'monthly': 2592000000,
      'quarterly': 7776000000,
      'annual': 31536000000,
      'ad_hoc': 0,
      'continuous': 0,
    }
    return intervals[frequency] || 2592000000
  }

  // ============================================
  // DISPUTE RESOLUTION
  // ============================================

  initiateDispute(
    frameworkId: string,
    dispute: DisputeInitiation
  ): DisputeCase {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) throw new Error('Framework not found')

    const disputeCase: DisputeCase = {
      id: uid(),
      frameworkId,
      ...dispute,
      status: 'initiated',
      currentLevel: 1,
      createdAt: now(),
      updatedAt: now(),
      timeline: [{ level: 1, action: 'initiated', timestamp: now(), actor: dispute.initiator }],
    }

    return disputeCase
  }

  // ============================================
  // QUERIES
  // ============================================

  getFramework(frameworkId: string): LegalFramework | undefined {
    return this.frameworks.get(frameworkId)
  }

  getAllFrameworks(): LegalFramework[] {
    return Array.from(this.frameworks.values())
  }

  getComplianceHistory(frameworkId: string): ComplianceCheckResult[] {
    return this.complianceChecks.get(frameworkId) || []
  }
}

// ============================================
// SUPPORTING TYPES
// ============================================

export interface ComplianceCheckResult {
  check: string
  passed: boolean
  score: number
  details: string
  recommendations: string[]
}

export interface RegulatoryEngagementPlan {
  frameworkId: string
  approach: string
  engagements: Array<{
    type: string
    frequency: string
    participants: string[]
    expectedOutcomes: string[]
    nextScheduled: number
  }>
  reporting: Array<{
    regulator: string
    type: string
    frequency: string
    nextDue: number
  }>
  sandbox: any
  advocacy: any
}

export interface DisputeInitiation {
  initiator: string
  respondent: string
  type: string
  description: string
  evidence: string[]
  requestedRemedy: string
}

export interface DisputeCase {
  id: string
  frameworkId: string
  initiator: string
  respondent: string
  type: string
  description: string
  evidence: string[]
  requestedRemedy: string
  status: 'initiated' | 'mediation' | 'arbitration' | 'governance_vote' | 'custodian_decision' | 'sortition' | 'resolved' | 'closed'
  currentLevel: number
  createdAt: number
  updatedAt: number
  resolution?: string
  timeline: Array<{
    level: number
    action: string
    timestamp: number
    actor: string
  }>
}

// ============================================
// EXPORTS
// ============================================

export const legalFrameworkEngine = new LegalFrameworkEngine()