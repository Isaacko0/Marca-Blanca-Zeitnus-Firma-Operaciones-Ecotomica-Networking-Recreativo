// arm-sensorica/src/types.ts - Core Domain Entities
// Sensorica OVN primitives for ARM

export type Brand<T, B> = T & { __brand: B };

export type ContributionId = Brand<string, 'ContributionId'>;
export type AffiliateId = Brand<string, 'AffiliateId'>;
export type ProjectId = Brand<string, 'ProjectId'>;
export type ResourcePoolId = Brand<string, 'ResourcePoolId'>;
export type DistributionId = Brand<string, 'DistributionId'>;
export type EventId = Brand<string, 'EventId'>;
export type ProposalId = Brand<string, 'ProposalId'>;
export type ExchangeFirmId = Brand<string, 'ExchangeFirmId'>;
export type LegalEntityId = Brand<string, 'LegalEntityId'>;
export type GovernmentId = Brand<string, 'GovernmentId'>;
export type TrustId = Brand<string, 'TrustId'>;
export type SpaceId = Brand<string, 'SpaceId'>;
export type OVNId = Brand<string, 'OVNId'>;
export type ContributionType = 'time' | 'materials' | 'capital' | 'knowledge' | 'space';
export type VerificationStatus = 'pending' | 'verified' | 'disputed';
export type ProjectStatus = 'forming' | 'active' | 'completed' | 'archived';
export type PropertyRegimeType = 'private' | 'public' | 'commons' | 'non-dominium';
export type GovernanceRole = 'affiliate' | 'placeKeeper' | 'exchangeFirmRep';
export type DistributionFormula = 'proportional' | 'logarithmic' | 'hybrid';
export type AuthMethod = 'pki' | 'biometric' | 'smartphone' | 'hardware-token';
export type AuthzModel = 'rbac' | 'abac' | 'capability-based';
export type TrustModel = 'local' | 'federated' | 'p2p-reputation';
export type PrivacyLevel = 'public' | 'pseudonymous' | 'encrypted' | 'zero-knowledge';
export type MonetaryMode = 'postmonetario' | 'conectado';

export interface Quantity {
  value: bigint;
  unit: string; // 'hours', 'units', 'USD', 'ZNU', etc.
}

export interface Timestamp {
  value: number; // Unix ms
  timezone: string; // IANA tz
}

export interface Hash {
  algorithm: 'sha256' | 'blake3';
  value: string; // hex
}

export interface Signature {
  algorithm: 'ed25519' | 'secp256k1';
  value: string; // hex
  publicKey: string; // hex
}

export interface Weight {
  value: number; // 0.0 - 1.0+
  description: string;
}

export interface Percentage {
  value: number; // 0-100
}

export interface Duration {
  value: number; // milliseconds
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface ContributionMetadata {
  description?: string;
  tags?: string[];
  projectPhase?: string;
  relatedContributions?: ContributionId[];
  customFields?: Record<string, unknown>;
}

export interface EvidenceRef {
  type: 'document' | 'photo' | 'timestamp' | 'witness' | 'sensor';
  uri: string;
  hash?: Hash;
  timestamp: Timestamp;
}

export interface Contribution {
  id: ContributionId;
  affiliateId: AffiliateId;
  projectId: ProjectId;
  type: ContributionType;
  quantity: Quantity;
  timestamp: Timestamp;
  verificationStatus: VerificationStatus;
  evidence?: EvidenceRef[];
  metadata: ContributionMetadata;
}

export interface AffiliateProfile {
  displayName: string;
  skills: string[];
  bio?: string;
  avatarUri?: string;
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  email?: string;
  matrix?: string;
  nostr?: string;
  website?: string;
}

export interface EarningsRecord {
  distributionId: DistributionId;
  amount: DualValue;
  timestamp: Timestamp;
  contributionIds: ContributionId[];
}

export interface TrustScore {
  value: number; // 0.0 - 1.0
  lastUpdated: Timestamp;
  source: 'placeKeeper' | 'peerReport' | 'compliance' | 'composite';
  breakdown?: TrustBreakdown;
}

export interface TrustBreakdown {
  directObservation: number;
  peerReports: number;
  historicalCompliance: number;
  other?: Record<string, number>;
}

export interface GovernanceConfig {
  quorumThreshold: Percentage; // e.g., 0.6 for 60%
  votingPeriod: Duration;
  proposalTypes: ProposalType[];
  requiredApprovers: Map<ProposalType, number>;
  autoApproveTimeout?: Duration;
}

export type ProposalType = 
  | 'valueEquationChange'
  | 'governanceChange'
  | 'resourceAllocation'
  | 'exchangeFirmContract'
  | 'projectCreation'
  | 'affiliateRemoval'
  | 'custom';

export interface Proposal {
  id: ProposalId;
  projectId: ProjectId;
  type: ProposalType;
  title: string;
  description: string;
  proposedBy: AffiliateId;
  createdAt: Timestamp;
  votingEndsAt: Timestamp;
  status: 'pending' | 'voting' | 'passed' | 'rejected' | 'executed';
  votes: Vote[];
  requiredApprovers: number;
  executionPayload?: unknown;
}

export interface Vote {
  affiliateId: AffiliateId;
  proposalId: ProposalId;
  choice: 'yes' | 'no' | 'abstain';
  weight: number;
  timestamp: Timestamp;
  signature: Signature;
}

export interface DistributionFormulaConfig {
  type: DistributionFormula;
  parameters?: Record<string, number>; // e.g., { base: 1.5 } for logarithmic
}

export interface DistributionRule {
  contributionType: ContributionType;
  weight: Weight;
  valuationFormula: ValuationFormula;
}

export type ValuationFormula = 
  | { type: 'linear'; multiplier: number }
  | { type: 'logarithmic'; base: number; multiplier: number }
  | { type: 'step'; thresholds: Array<{ min: number; value: number }> }
  | { type: 'custom'; functionName: string; parameters: Record<string, number> };

export interface ValueEquationConfig {
  projectId: ProjectId;
  contributionWeights: Map<ContributionType, Weight>;
  distributionFormula: DistributionFormulaConfig;
  minimumThreshold?: Quantity;
  reservePercentage: Percentage;
  exchangeFirmConfig?: ExchangeFirmConfig;
  monetaryMode: MonetaryMode;
  priceOracle?: PriceParityOracle;
  contributionValuation: Map<ContributionType, DualValuationRule>;
  distributionOutput: DualDistributionConfig;
}

export interface DualValuationRule {
  postmonetario: ValuationFormula;
  conectado: ValuationFormula;
}

export interface DualDistributionConfig {
  postmonetario: {
    unit: 'ZNU' | 'CaaS';
    format: (amount: bigint) => string;
  };
  conectado: {
    unit: 'USD' | 'USDC';
    format: (amount: bigint) => string;
    oracle: PriceParityOracle;
  };
}

export interface PriceParityOracle {
  getRate: (from: 'ZNU' | 'CaaS', to: 'USD' | 'USDC') => Promise<number>;
  lastUpdate: Timestamp;
  source: string;
}

export interface ExchangeFirmConfig {
  exchangeFirmId: ExchangeFirmId;
  revenueSplit: Percentage; // % to OVN value equation
  complianceRequirements: string[];
  reportingPeriod: Duration;
}

export interface ExchangeFirm {
  id: ExchangeFirmId;
  legalEntity: LegalEntityRef;
  representedOVN: OVNId;
  contracts: Contract[];
  revenueFlow: RevenueFlowConfig;
  compliance: ComplianceConfig;
}

export interface LegalEntityRef {
  id: LegalEntityId;
  name: string;
  jurisdiction: string;
  registrationNumber: string;
}

export interface Contract {
  id: string;
  clientId: string;
  value: DualValue;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: Timestamp;
  endDate?: Timestamp;
  deliverables: Deliverable[];
}

export interface Deliverable {
  id: string;
  description: string;
  dueDate: Timestamp;
  status: 'pending' | 'in-progress' | 'delivered' | 'accepted';
}

export interface RevenueFlowConfig {
  externalRevenueAccount: string;
  ovnAllocation: Percentage;
  exchangeFirmFee: Percentage;
  distributionTrigger: 'on-receipt' | 'periodic' | 'manual';
}

export interface ComplianceConfig {
  kycRequired: boolean;
  amlRequired: boolean;
  reportingStandards: string[];
  auditFrequency: Duration;
}

export interface LegalEntity {
  id: LegalEntityId;
  name: string;
  type: 'corporation' | 'cooperative' | 'nonprofit' | 'llc';
  jurisdiction: string;
  registrationNumber: string;
  directors: string[];
}

export interface OVN {
  id: OVNId;
  name: string;
  description: string;
  projects: ProjectId[];
  affiliates: AffiliateId[];
  exchangeFirms: ExchangeFirmId[];
  governance: GovernanceConfig;
  createdAt: Timestamp;
}

export interface Project {
  id: ProjectId;
  name: string;
  description: string;
  valueEquation: ValueEquationConfig;
  resourcePool: ResourcePoolId;
  affiliates: AffiliateId[];
  status: ProjectStatus;
  propertyRegime: PropertyRegime;
  governance: GovernanceConfig;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Affiliate {
  id: AffiliateId;
  profile: AffiliateProfile;
  contributions: ContributionId[];
  earnings: EarningsRecord[];
  trustScore: TrustScore;
  governanceRole: GovernanceRole;
  joinedAt: Timestamp;
  projects: ProjectId[];
}

export interface ResourcePool {
  id: ResourcePoolId;
  resources: Resource[];
  accessRules: AccessRule[];
  propertyRegime: PropertyRegime;
  location?: GeoLocation;
  stewardId?: AffiliateId;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description: string;
  location?: GeoLocation;
  capacity: Quantity;
  currentUsage: Quantity;
  ownerId?: AffiliateId; // if privately owned but shared
  metadata: ResourceMetadata;
}

export type ResourceType = 
  | 'equipment' 
  | 'space' 
  | 'materials' 
  | 'digital' 
  | 'vehicle' 
  | 'tool' 
  | 'infrastructure'
  | 'other';

export interface ResourceMetadata {
  maintenanceSchedule?: string;
  calibrationRequired?: boolean;
  safetyCertifications?: string[];
  accessRestrictions?: string[];
  customFields?: Record<string, unknown>;
}

export interface AccessRule {
  id: string;
  resourceId: string;
  allowedRoles: GovernanceRole[];
  allowedAffiliates?: AffiliateId[];
  conditions?: AccessCondition[];
  timeRestrictions?: TimeRestriction[];
  maxDuration?: Duration;
  requiresApproval: boolean;
  approverRoles?: GovernanceRole[];
}

export interface AccessCondition {
  type: 'trust-score' | 'skill' | 'certification' | 'project-membership' | 'custom';
  parameters: Record<string, unknown>;
}

export interface TimeRestriction {
  daysOfWeek?: number[]; // 0-6
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  timezone: string;
}

export interface ResourceAccessRequest {
  id: string;
  resourceId: string;
  affiliateId: AffiliateId;
  requestedAt: Timestamp;
  startTime: Timestamp;
  endTime: Timestamp;
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled' | 'completed';
  approvedBy?: AffiliateId;
  approvedAt?: Timestamp;
}

export interface PropertyRegime {
  type: PropertyRegimeType;
  // Private
  owner?: LegalEntityId;
  // Public
  authority?: GovernmentId;
  // Commons
  stewards?: AffiliateId[];
  commonsRules?: CommonsRules;
  // Non-dominium
  trust?: TrustId;
  community?: AffiliateId[];
}

export interface CommonsRules {
  accessPolicy: 'open' | 'member-only' | 'steward-approval';
  usageLimits?: UsageLimit[];
  maintenanceResponsibility: 'collective' | 'steward' | 'rotating';
  conflictResolution: ConflictResolutionProcess;
  amendmentProcess: AmendmentProcess;
}

export interface UsageLimit {
  resourceType: ResourceType;
  maxPerAffiliate: Quantity;
  period: Duration;
}

export interface ConflictResolutionProcess {
  steps: Array<{
    type: 'mediation' | 'arbitration' | 'vote' | 'steward-decision';
    timeout: Duration;
  }>;
}

export interface AmendmentProcess {
  proposalThreshold: Percentage;
  approvalThreshold: Percentage;
  coolingOffPeriod: Duration;
}

export interface DualValue {
  postmonetario: bigint; // ZNU/CaaS units
  conectado: bigint;    // USD/USDC cents
}

export interface DistributionResult {
  id: DistributionId;
  projectId: ProjectId;
  mode: MonetaryMode;
  distributions: AffiliateDistribution[];
  totalDistributed: DualValue;
  timestamp: Timestamp;
  auditTrail: AuditEntry[];
}

export interface AffiliateDistribution {
  affiliateId: AffiliateId;
  amount: DualValue;
  contributionScore: number;
  contributions: ContributionId[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: AffiliateId;
  timestamp: Timestamp;
  details: Record<string, unknown>;
  previousHash: Hash;
  currentHash: Hash;
}

export interface TrustScoreUpdate {
  affiliateId: AffiliateId;
  newScore: number;
  reason: string;
  updatedBy: AffiliateId; // place keeper
  timestamp: Timestamp;
  evidence?: EvidenceRef[];
}

export interface PlaceKeeper {
  affiliateId: AffiliateId;
  spaceId: SpaceId;
  permissions: Permission[];
  accountability: AccountabilityConfig;
  observations: Map<AffiliateId, number>; // direct observation scores
}

export type Permission = 
  | 'grant-access'
  | 'deny-access'
  | 'update-trust'
  | 'manage-resources'
  | 'resolve-conflicts'
  | 'amend-rules';

export interface AccountabilityConfig {
  auditTrailRequired: boolean;
  reviewPeriod: Duration;
  escalationPath: AffiliateId[];
}

export interface AccessContext {
  spaceId: SpaceId;
  resourceId?: string;
  timeOfAccess: Timestamp;
  purpose: string;
  affiliateId: AffiliateId;
}

export interface SensoricaEvent {
  id: EventId;
  type: SensoricaOp['type'];
  payload: SensoricaOp['payload'];
  author: AffiliateId;
  timestamp: Timestamp;
  previousStateHash: Hash;
  signature: Signature;
}

export type SensoricaOp =
  | { type: 'contribution.submit'; payload: SubmitContribution }
  | { type: 'contribution.verify'; payload: VerifyContribution }
  | { type: 'project.create'; payload: CreateProject }
  | { type: 'project.join'; payload: JoinProject }
  | { type: 'valueEquation.configure'; payload: ConfigureValueEquation }
  | { type: 'distribution.execute'; payload: ExecuteDistribution }
  | { type: 'resourcePool.add'; payload: AddResource }
  | { type: 'resourcePool.access'; payload: RequestResourceAccess }
  | { type: 'governance.propose'; payload: ProposeGovernanceChange }
  | { type: 'governance.vote'; payload: VoteOnProposal }
  | { type: 'affiliate.register'; payload: RegisterAffiliate }
  | { type: 'trust.update'; payload: UpdateTrustScore }
  | { type: 'exchangeFirm.revenueReceived'; payload: RecordExternalRevenue };

export interface SubmitContribution {
  projectId: ProjectId;
  type: ContributionType;
  quantity: Quantity;
  evidence?: EvidenceRef[];
  metadata?: ContributionMetadata;
}

export interface VerifyContribution {
  contributionId: ContributionId;
  approve: boolean;
  reason?: string;
}

export interface CreateProject {
  name: string;
  description: string;
  valueEquation: ValueEquationConfig;
  resourcePoolId: ResourcePoolId;
  propertyRegime: PropertyRegime;
  governance: GovernanceConfig;
}

export interface JoinProject {
  projectId: ProjectId;
  affiliateId: AffiliateId;
}

export interface ConfigureValueEquation {
  projectId: ProjectId;
  config: ValueEquationConfig;
}

export interface ExecuteDistribution {
  projectId: ProjectId;
  mode: MonetaryMode;
  revenue: DualValue;
}

export interface AddResource {
  resourcePoolId: ResourcePoolId;
  resource: Resource;
}

export interface RequestResourceAccess {
  resourceId: string;
  affiliateId: AffiliateId;
  startTime: Timestamp;
  endTime: Timestamp;
  purpose: string;
}

export interface ProposeGovernanceChange {
  projectId: ProjectId;
  type: ProposalType;
  title: string;
  description: string;
  executionPayload?: unknown;
}

export interface VoteOnProposal {
  proposalId: ProposalId;
  choice: 'yes' | 'no' | 'abstain';
}

export interface RegisterAffiliate {
  profile: AffiliateProfile;
  initialTrustScore?: number;
}

export interface UpdateTrustScore {
  affiliateId: AffiliateId;
  newScore: number;
  reason: string;
  evidence?: EvidenceRef[];
}

export interface RecordExternalRevenue {
  exchangeFirmId: ExchangeFirmId;
  amount: DualValue;
  contractId: string;
  description: string;
}

export interface DistributionOutput {
  postmonetario: { unit: 'ZNU' | 'CaaS'; format: (amount: bigint) => string };
  conectado: { unit: 'USD' | 'USDC'; format: (amount: bigint) => string; oracle: PriceParityOracle };
}

export interface SensoricaState {
  contributions: Map<ContributionId, Contribution>;
  projects: Map<ProjectId, Project>;
  affiliates: Map<AffiliateId, Affiliate>;
  valueEquations: Map<ProjectId, ValueEquationConfig>;
  distributions: Map<DistributionId, DistributionResult>;
  resourcePools: Map<ResourcePoolId, ResourcePool>;
  trustScores: Map<AffiliateId, TrustScore>;
  governanceProposals: Map<ProposalId, Proposal>;
  exchangeFirms: Map<ExchangeFirmId, ExchangeFirm>;
  events: SensoricaEvent[];
}

export interface PatternMatch {
  patternId: string;
  patternName: string;
  detectedAt: Timestamp;
  affectedEntities: string[];
  severity: 'info' | 'warning' | 'critical';
  details: Record<string, unknown>;
}

export interface SensoricaPattern {
  id: string;
  name: string;
  description: string;
  detector: (events: SensoricaEvent[], state: SensoricaState) => PatternMatch[];
}

export interface ReviewGate {
  id: string;
  trigger: SensoricaOp['type'];
  requiredApprovers: number;
  approvers: AffiliateId[];
  timeout: Duration;
  autoApproveIfTimeout?: boolean;
}

export interface AmphibiousProjection<T> {
  postmonetario: T;
  conectado: T;
  mode: MonetaryMode;
}