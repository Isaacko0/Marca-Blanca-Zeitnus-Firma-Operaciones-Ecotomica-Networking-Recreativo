// HSCSG v15 OS — Propagation Models (OVN 3.0: D52 - Initiation Ritual = Generative Handshake v1.0)
// Capa 5: Transición Económica — Distributed propagation, not centralized planning
// "Initiation is a ritual, bundle of processes intended to launch something. All initiatives use same recipe. Anyone can be initiator."

import type { NRPAffiliate, NRPVenture } from '@core/lib/nrpCasCore'
import { uid, now } from '@core/lib/utils'

// ============================================
// PROPAGATION MODEL TYPES
// ============================================

export type PropagationModelType =
  | 'initiation_ritual'      // OVN 3.0: Distributed initiation (Ouishare drinks pattern)
  | 'handshake_generativo'   // Capa 0: Generative handshake (cultiva compatibilidad)
  | 'mitosis'                // Capa 0: Mitosis protocol (replica protocolo reconocimiento)
  | 'network_bridge'         // Automated network-to-network bridges
  | 'venture_spawning'       // Venture incubation/spawning
  | 'custom'

export interface PropagationModel {
  id: string
  name: string
  type: PropagationModelType
  description: string
  // Recipe (same for all initiations)
  recipe: PropagationRecipe
  // Requirements
  requirements: PropagationRequirement[]
  // Phases
  phases: PropagationPhase[]
  // Success criteria
  successCriteria: SuccessCriterion[]
  // Metrics
  metrics: PropagationMetrics
  // Lifecycle
  createdAt: number
  updatedAt: number
}

export interface PropagationRecipe {
  // The "same recipe" for all initiations
  name: string
  version: string
  // Steps that MUST be followed in order
  steps: RecipeStep[]
  // Invariants that must hold
  invariants: RecipeInvariant[]
  // Customization points (where adaptation is allowed)
  customizationPoints: CustomizationPoint[]
}

export interface RecipeStep {
  id: string
  name: string
  description: string
  // Order in recipe
  order: number
  // Who can execute
  executor: 'initiator' | 'any_affiliate' | 'custodian' | 'core_group' | 'automated' | 'community'
  // Prerequisites
  prerequisites: string[] // step IDs
  // Success condition
  successCondition: string
  // Timeout
  timeoutHours?: number
  // Rollback
  rollback?: RollbackAction
}

export interface RecipeInvariant {
  id: string
  description: string
  // Must hold at all times
  condition: string
  violationResponse: 'abort' | 'pause' | 'alert' | 'rollback'
}

export interface CustomizationPoint {
  stepId: string
  parameter: string
  allowedValues: any[]
  description: string
}

export interface RollbackAction {
  type: 'reverse_step' | 'compensate' | 'notify' | 'escalate'
  description: string
  automated: boolean
}

export interface PropagationRequirement {
  type: 'agent' | 'resource' | 'governance' | 'infrastructure' | 'legal' | 'community'
  description: string
  mandatory: boolean
  validation: 'automated' | 'manual' | 'governance_vote'
}

export interface PropagationPhase {
  id: string
  name: string
  description: string
  // Steps in this phase
  steps: string[] // recipe step IDs
  // Entry criteria
  entryCriteria: string[]
  // Exit criteria
  exitCriteria: string[]
  // Duration
  estimatedDurationHours: number
  // Can run in parallel with other phases
  parallelizable: boolean
}

export interface SuccessCriterion {
  id: string
  name: string
  description: string
  metric: string
  threshold: number
  measurement: 'automated' | 'manual' | 'survey' | 'governance_vote'
  weight: number // for overall success score
}

export interface PropagationMetrics {
  totalInitiations: number
  successfulInitiations: number
  failedInitiations: number
  averageDurationHours: number
  averageParticipants: number
  survivalRate30Days: number
  survivalRate90Days: number
  survivalRate365Days: number
  fragmentationIndex: number
  convergenceRate: number
}

// ============================================
// INITIATION RITUAL (OVN 3.0 - D52)
// ============================================

export interface InitiationRitual {
  id: string
  name: string
  // The "recipe" - same for all
  recipe: InitiationRecipe
  // Initiator
  initiatorId: string
  // Context
  context: InitiationContext
  // Current state
  currentPhase: string
  completedSteps: string[]
  // Participants
  participants: InitiationParticipant[]
  // Outcome
  outcome?: InitiationOutcome
  // Lifecycle
  createdAt: number
  updatedAt: number
}

export interface InitiationRecipe {
  // Based on Ouishare Drinks pattern: social event + structured process
  // 1. Social bonding (drinks/food)
  // 2. Shared purpose discovery
  // 3. Resource mapping
  // 4. Governance agreement
  // 5. First action commitment
  steps: InitiationStep[]
}

export interface InitiationStep {
  id: string
  name: string
  type: 'social' | 'purpose' | 'resource' | 'governance' | 'action' | 'celebration'
  description: string
  durationMinutes: number
  facilitator: 'initiator' | 'rotating' | 'external' | 'automated'
  materials: string[]
  output: string
  // Stigmergic signal emission
  emitsSignal?: { type: string; payload: any }
}

export interface InitiationContext {
  ventureId?: string
  networkId: string
  location: { physical?: string; digital: string }
  purpose: string
  targetParticipants: number
  // Constraints
  timeLimitHours?: number
  budget?: { amount: number; currency: string; source: string }
  // Pre-existing resources
  availableResources: string[]
  // Legal
  legalFramework?: string
}

export interface InitiationParticipant {
  agentId: string
  role: 'initiator' | 'co-initiator' | 'participant' | 'facilitator' | 'observer' | 'custodian_rep'
  joinedAt: number
  contributionScore: number
  completedSteps: string[]
}

export interface InitiationOutcome {
  success: boolean
  ventureCreated?: string
  networkJoined?: string
  participants: number
  resourcesCommitted: Map<string, number>
  governanceAgreed: boolean
  firstAction: string
  // Handshake generativo (Capa 0)
  handshakeCompleted: boolean
  compatibilityCultivated: boolean
  // Metrics
  durationHours: number
  satisfactionScore: number
  lessonsLearned: string[]
}

// ============================================
// HANDSHAKE GENERATIVO (Capa 0)
// ============================================

/**
 * Generative Handshake v1.0 - Capa 0
 * "El handshake no verifica compatibilidad — la cultiva."
 * El nodo nuevo nace con capacidad de handshake; primer acto = handshake con nodo padre
 */
export interface GenerativeHandshake {
  id: string
  version: '1.0'
  // Participants
  parentNodeId: string
  childNodeId: string
  // Handshake protocol
  protocol: HandshakeProtocol
  // State
  state: 'initiated' | 'exchanging' | 'validating' | 'cultivating' | 'completed' | 'failed'
  // Compatibility cultivation
  compatibility: CompatibilityCultivation
  // Kit 72H v2.0 transfer
  kitTransfer: KitTransfer
  // Lifecycle
  initiatedAt: number
  completedAt?: number
}

export interface HandshakeProtocol {
  // Phase 1: Recognition (mutual recognition of autonomy/regeneration)
  recognition: RecognitionPhase
  // Phase 2: Protocol Exchange (share recognition protocol)
  protocolExchange: ProtocolExchangePhase
  // Phase 3: Compatibility Cultivation (joint activity to cultivate compatibility)
  cultivation: CultivationPhase
  // Phase 4: Commitment (mutual commitment to federation)
  commitment: CommitmentPhase
}

export interface RecognitionPhase {
  // Each node presents: purpose, autonomy metrics, regeneration metrics, continuity plan
  parentPresentation: NodePresentation
  childPresentation: NodePresentation
  // Mutual evaluation
  mutualEvaluation: EvaluationCriteria
  // Decision
  proceed: boolean
}

export interface NodePresentation {
  nodeId: string
  purpose: string
  autonomyMetrics: AutonomyMetrics
  regenerationMetrics: RegenerationMetrics
  continuityPlan: ContinuityPlan
  governanceModel: string
  resourceProfile: ResourceProfile
}

export interface AutonomyMetrics {
  AUT: number
  ALIM: number
  ENER: number
  SALU: number
  HABI: number
  PROD: number
}

export interface RegenerationMetrics {
  ecologicalRegeneration: number
  socialRegeneration: number
  knowledgeRegeneration: number
  economicRegeneration: number
  overall: number
}

export interface ContinuityPlan {
  timeHorizonGenerations: number
  successionProtocol: string
  knowledgePreservation: string[]
  ecologicalMemory: string[]
}

export interface ResourceProfile {
  criticalResources: string[]
  productionCapacity: Map<string, number>
  sharingWillingness: number // 0-1
}

export interface EvaluationCriteria {
  purposeAlignment: number // 0-1
  autonomyCompatibility: number // 0-1
  regenerationAlignment: number // 0-1
  continuityCompatibility: number // 0-1
  governanceCompatibility: number // 0-1
  resourceComplementarity: number // 0-1
  minimumThreshold: number // e.g., 0.6
  overallPass: boolean
}

export interface ProtocolExchangePhase {
  // Each node shares its "recognition protocol" (how it recognizes other nodes)
  parentProtocol: RecognitionProtocol
  childProtocol: RecognitionProtocol
  // Negotiate common protocol
  commonProtocol: RecognitionProtocol
  // Test protocol with sample recognition
  testPassed: boolean
}

export interface RecognitionProtocol {
  version: string
  steps: RecognitionStep[]
  invariants: string[]
  customizationPoints: string[]
}

export interface RecognitionStep {
  id: string
  name: string
  description: string
  automated: boolean
  criteria: string
}

export interface CultivationPhase {
  // Joint activities to cultivate compatibility
  activities: CultivationActivity[]
  // Duration
  durationHours: number
  // Success metrics
  successMetrics: CultivationMetric[]
  // Outcome
  compatibilityDeepened: boolean
}

export interface CultivationActivity {
  id: string
  name: string
  type: 'joint_production' | 'knowledge_sharing' | 'governance_simulation' | 'resource_sharing' | 'celebration'
  description: string
  participants: string[] // agent IDs from both nodes
  durationHours: number
  expectedOutcome: string
  // Stigmergic signals
  emitsSignals: string[]
}

export interface CultivationMetric {
  name: string
  target: number
  measured: number
  unit: string
}

export interface CommitmentPhase {
  // Mutual commitment to federation
  parentCommitment: FederationCommitment
  childCommitment: FederationCommitment
  // Shared commitments
  sharedCommitments: SharedCommitment[]
  // Sealing
  sealedAt: number
  sealedBy: string[] // agent IDs
}

export interface FederationCommitment {
  nodeId: string
  commitsTo: string[]
  resourceContribution: Map<string, number>
  governanceParticipation: boolean
  mutualAid: boolean
  duration: 'indefinite' | 'fixed' // years
  reviewCycleMonths: number
}

export interface SharedCommitment {
  id: string
  description: string
  responsible: 'parent' | 'child' | 'both'
  timeline: number // months
  successCriteria: string
}

export interface CompatibilityCultivation {
  // Compatibility is CULTIVATED, not verified
  initialScore: number
  currentScore: number
  targetScore: number
  cultivationActivities: string[] // activity IDs
  deepeningEvents: DeepeningEvent[]
  // "Compatibility is result, not precondition"
  cultivated: boolean
}

export interface DeepeningEvent {
  timestamp: number
  activityId: string
  scoreBefore: number
  scoreAfter: number
  insight: string
}

export interface KitTransfer {
  // Kit 72H v2.0 transferred to child node
  kitVersion: '2.0'
  components: KitComponent[]
  transferredAt: number
  verifiedBy: string
  // Child node inherits handshake capability
  handshakeCapabilityInherited: boolean
}

export interface KitComponent {
  id: string
  name: string
  type: 'hardware' | 'software' | 'documentation' | 'protocol' | 'seed' | 'tool'
  description: string
  critical: boolean
  transferred: boolean
}

// ============================================
// MITOSIS PROTOCOL
// ============================================

/**
 * Mitosis Protocol - Capa 0
 * Replicates the RECOGNITION PROTOCOL, not the form
 * Daughter node inherits handshake capability; first act = handshake with parent
 */
export interface MitosisProtocol {
  id: string
  version: '1.0'
  // Parent organism
  parentNodeId: string
  // Daughter organism (new node)
  daughterNodeId: string
  // What is replicated
  replicated: ReplicatedElements
  // What is NOT replicated (must be cultivated)
  notReplicated: NotReplicatedElements
  // Process
  phases: MitosisPhase[]
  // State
  state: 'preparing' | 'dividing' | 'separating' | 'maturing' | 'completed' | 'failed'
  // Metrics
  metrics: MitosisMetrics
  // Lifecycle
  initiatedAt: number
  completedAt?: number
}

export interface ReplicatedElements {
  // Recognition protocol (Capa 0)
  recognitionProtocol: boolean
  // Handshake capability
  handshakeCapability: boolean
  // Core governance equations
  coreGovernanceEquations: string[]
  // Basic infrastructure protocols
  infrastructureProtocols: string[]
  // Kit 72H v2.0 template
  kit72HTemplate: boolean
  // Universal values (D45)
  universalValues: boolean
  // Ecosystem rules (D44)
  ecosystemRules: boolean
}

export interface NotReplicatedElements {
  // Specific form/structure
  specificForm: boolean
  // Specific resources
  specificResources: boolean
  // Specific agents/members
  specificAgents: boolean
  // Specific history/culture
  specificCulture: boolean
  // Specific legal entity
  specificLegalEntity: boolean
  // Compatibility (must be cultivated)
  compatibility: boolean
}

export interface MitosisPhase {
  id: string
  name: string
  description: string
  steps: MitosisStep[]
  durationHours: number
  successCriteria: string[]
}

export interface MitosisStep {
  id: string
  name: string
  executor: 'parent' | 'daughter' | 'both' | 'automated' | 'community'
  description: string
  prerequisites: string[]
  output: string
}

export interface MitosisMetrics {
  fidelity: number // how faithfully protocol replicated (target: 1.0)
  divergence: number // acceptable divergence in non-replicated elements
  timeToFirstHandshake: number // hours
  timeToViability: number // hours
  survivalRate30Days: number
  survivalRate365Days: number
}

// ============================================
// PROPAGATION ENGINE
// ============================================

export class PropagationEngine {
  private models: Map<string, PropagationModel> = new Map()
  private initiations: Map<string, InitiationRitual> = new Map()
  private handshakes: Map<string, GenerativeHandshake> = new Map()
  private mitoses: Map<string, MitosisProtocol> = new Map()

  constructor() {
    this.initializeDefaultModels()
  }

  private initializeDefaultModels(): void {
    // Initiation Ritual Model (OVN 3.0 / Ouishare pattern)
    this.models.set('initiation_ritual', {
      id: 'initiation_ritual',
      name: 'Initiation Ritual (Ouishare Drinks Pattern)',
      type: 'initiation_ritual',
      description: 'Distributed initiation ritual for launching new ventures/nodes. Same recipe for all. Anyone can initiate.',
      recipe: {
        name: 'Standard Initiation Recipe v1.0',
        version: '1.0',
        steps: [
          { id: 'social_bonding', name: 'Social Bonding', description: 'Shared meal/drinks to build trust', order: 1, executor: 'initiator', prerequisites: [], successCondition: 'participants_feel_connected', timeoutHours: 2 },
          { id: 'purpose_discovery', name: 'Purpose Discovery', description: 'Collective exploration of shared purpose', order: 2, executor: 'facilitator', prerequisites: ['social_bonding'], successCondition: 'purpose_statement_agreed', timeoutHours: 3 },
          { id: 'resource_mapping', name: 'Resource Mapping', description: 'Map available resources and needs', order: 3, executor: 'participants', prerequisites: ['purpose_discovery'], successCondition: 'resource_map_complete', timeoutHours: 2 },
          { id: 'governance_agreement', name: 'Governance Agreement', description: 'Agree on decision-making and conflict resolution', order: 4, executor: 'facilitator', prerequisites: ['resource_mapping'], successCondition: 'governance_model_agreed', timeoutHours: 2 },
          { id: 'first_action', name: 'First Action Commitment', description: 'Commit to first concrete action', order: 5, executor: 'participants', prerequisites: ['governance_agreement'], successCondition: 'action_plan_committed', timeoutHours: 1 },
          { id: 'celebration', name: 'Celebration', description: 'Acknowledge the beginning', order: 6, executor: 'all', prerequisites: ['first_action'], successCondition: 'celebration_completed', timeoutHours: 1 },
        ],
        invariants: [
          { id: 'social_first', description: 'Social bonding always first', condition: 'steps[0].type === "social"', violationResponse: 'abort' },
          { id: 'purpose_before_resources', description: 'Purpose discovered before resource mapping', condition: 'steps.indexOf("purpose_discovery") < steps.indexOf("resource_mapping")', violationResponse: 'abort' },
          { id: 'governance_before_action', description: 'Governance agreed before first action', condition: 'steps.indexOf("governance_agreement") < steps.indexOf("first_action")', violationResponse: 'abort' },
        ],
        customizationPoints: [
          { stepId: 'social_bonding', parameter: 'activity', allowedValues: ['drinks', 'meal', 'walk', 'game', 'custom'], description: 'Social bonding activity type' },
          { stepId: 'purpose_discovery', parameter: 'method', allowedValues: ['dialogue', 'world_cafe', 'open_space', 'custom'], description: 'Purpose discovery method' },
        ],
      },
      requirements: [
        { type: 'agent', description: 'At least one initiator', mandatory: true, validation: 'automated' },
        { type: 'community', description: 'Minimum 3 participants', mandatory: true, validation: 'automated' },
        { type: 'governance', description: 'Access to governance tools', mandatory: true, validation: 'automated' },
      ],
      phases: [
        { id: 'preparation', name: 'Preparation', description: 'Invite participants, prepare space', steps: ['social_bonding'], entryCriteria: ['initiator_ready'], exitCriteria: ['social_bonding_complete'], estimatedDurationHours: 2, parallelizable: false },
        { id: 'discovery', name: 'Discovery', description: 'Purpose and resource discovery', steps: ['purpose_discovery', 'resource_mapping'], entryCriteria: ['social_bonding_complete'], exitCriteria: ['resource_map_complete'], estimatedDurationHours: 5, parallelizable: false },
        { id: 'agreement', name: 'Agreement', description: 'Governance and action agreement', steps: ['governance_agreement', 'first_action'], entryCriteria: ['resource_map_complete'], exitCriteria: ['action_plan_committed'], estimatedDurationHours: 3, parallelizable: false },
        { id: 'celebration', name: 'Celebration', description: 'Celebrate the beginning', steps: ['celebration'], entryCriteria: ['action_plan_committed'], exitCriteria: ['celebration_completed'], estimatedDurationHours: 1, parallelizable: false },
      ],
      successCriteria: [
        { id: 'venture_launched', name: 'Venture Launched', description: 'New venture/node operational', metric: 'venture_operational', threshold: 1, measurement: 'automated', weight: 0.4 },
        { id: 'participants_engaged', name: 'Participants Engaged', description: 'Participants actively contributing', metric: 'active_participants_ratio', threshold: 0.7, measurement: 'automated', weight: 0.2 },
        { id: 'governance_functional', name: 'Governance Functional', description: 'Decision-making operational', metric: 'governance_decisions_per_week', threshold: 1, measurement: 'automated', weight: 0.2 },
        { id: 'resources_flowing', name: 'Resources Flowing', description: 'Resource exchange active', metric: 'resource_exchanges_per_week', threshold: 2, measurement: 'automated', weight: 0.2 },
      ],
      metrics: { totalInitiations: 0, successfulInitiations: 0, failedInitiations: 0, averageDurationHours: 11, averageParticipants: 5, survivalRate30Days: 0.8, survivalRate90Days: 0.6, survivalRate365Days: 0.4, fragmentationIndex: 0.3, convergenceRate: 0.7 },
      createdAt: now(),
      updatedAt: now(),
    })

    // Handshake Generativo Model
    this.models.set('handshake_generativo', {
      id: 'handshake_generativo',
      name: 'Generative Handshake v1.0 (Capa 0)',
      type: 'handshake_generativo',
      description: 'Handshake that cultivates compatibility, not verifies it. Capa 0 generative act.',
      recipe: {
        name: 'Generative Handshake Protocol v1.0',
        version: '1.0',
        steps: [
          { id: 'recognition', name: 'Mutual Recognition', order: 1, executor: 'both', prerequisites: [], successCondition: 'mutual_evaluation_pass', timeoutHours: 24 },
          { id: 'protocol_exchange', name: 'Protocol Exchange', order: 2, executor: 'both', prerequisites: ['recognition'], successCondition: 'common_protocol_agreed', timeoutHours: 12 },
          { id: 'cultivation', name: 'Compatibility Cultivation', order: 3, executor: 'both', prerequisites: ['protocol_exchange'], successCondition: 'compatibility_deepened', timeoutHours: 168 },
          { id: 'commitment', name: 'Federation Commitment', order: 4, executor: 'both', prerequisites: ['cultivation'], successCondition: 'commitments_sealed', timeoutHours: 24 },
        ],
        invariants: [
          { id: 'cultivation_not_verification', description: 'Handshake cultivates, never just verifies', condition: 'cultivation_phase_exists', violationResponse: 'abort' },
          { id: 'mutual_recognition', description: 'Both nodes must recognize each other', condition: 'mutual_evaluation_pass', violationResponse: 'abort' },
        ],
        customizationPoints: [
          { stepId: 'cultivation', parameter: 'activities', allowedValues: ['joint_production', 'knowledge_sharing', 'governance_simulation', 'resource_sharing', 'celebration'], description: 'Cultivation activities' },
        ],
      },
      requirements: [
        { type: 'agent', description: 'Both nodes must have handshake capability', mandatory: true, validation: 'automated' },
        { type: 'governance', description: 'Both nodes must have governance model', mandatory: true, validation: 'automated' },
        { type: 'infrastructure', description: 'Both nodes must have basic infrastructure', mandatory: true, validation: 'automated' },
      ],
      phases: [
        { id: 'recognition', name: 'Recognition', steps: ['recognition'], entryCriteria: ['both_nodes_ready'], exitCriteria: ['mutual_evaluation_pass'], estimatedDurationHours: 24, parallelizable: false },
        { id: 'exchange', name: 'Protocol Exchange', steps: ['protocol_exchange'], entryCriteria: ['recognition_complete'], exitCriteria: ['common_protocol_agreed'], estimatedDurationHours: 12, parallelizable: false },
        { id: 'cultivation', name: 'Cultivation', steps: ['cultivation'], entryCriteria: ['protocol_exchange_complete'], exitCriteria: ['compatibility_deepened'], estimatedDurationHours: 168, parallelizable: false },
        { id: 'commitment', name: 'Commitment', steps: ['commitment'], entryCriteria: ['cultivation_complete'], exitCriteria: ['commitments_sealed'], estimatedDurationHours: 24, parallelizable: false },
      ],
      successCriteria: [
        { id: 'handshake_completed', name: 'Handshake Completed', metric: 'handshake_state', threshold: 1, measurement: 'automated', weight: 0.3 },
        { id: 'compatibility_cultivated', name: 'Compatibility Cultivated', metric: 'compatibility_score', threshold: 0.7, measurement: 'automated', weight: 0.4 },
        { id: 'federation_operational', name: 'Federation Operational', metric: 'federation_exchanges_per_week', threshold: 1, measurement: 'automated', weight: 0.3 },
      ],
      metrics: { totalInitiations: 0, successfulInitiations: 0, failedInitiations: 0, averageDurationHours: 228, averageParticipants: 2, survivalRate30Days: 0.9, survivalRate90Days: 0.8, survivalRate365Days: 0.7, fragmentationIndex: 0.1, convergenceRate: 0.9 },
      createdAt: now(),
      updatedAt: now(),
    })

    // Mitosis Protocol Model
    this.models.set('mitosis', {
      id: 'mitosis',
      name: 'Mitosis Protocol (Capa 0)',
      type: 'mitosis',
      description: 'Replicates recognition protocol, not form. Daughter inherits handshake capability; first act = handshake with parent.',
      recipe: {
        name: 'Mitosis Protocol v1.0',
        version: '1.0',
        steps: [
          { id: 'prepare', name: 'Preparation', order: 1, executor: 'parent', prerequisites: [], successCondition: 'daughter_template_ready', timeoutHours: 24 },
          { id: 'replicate', name: 'Protocol Replication', order: 2, executor: 'automated', prerequisites: ['prepare'], successCondition: 'protocol_replicated', timeoutHours: 12 },
          { id: 'separate', name: 'Separation', order: 3, executor: 'both', prerequisites: ['replicate'], successCondition: 'daughter_independent', timeoutHours: 48 },
          { id: 'mature', name: 'Maturation', order: 4, executor: 'daughter', prerequisites: ['separate'], successCondition: 'daughter_viable', timeoutHours: 720 },
          { id: 'handshake', name: 'First Handshake', order: 5, executor: 'both', prerequisites: ['mature'], successCondition: 'handshake_completed', timeoutHours: 24 },
        ],
        invariants: [
          { id: 'protocol_not_form', description: 'Replicates protocol, not form', condition: 'recognitionProtocol && handshakeCapability && !specificForm', violationResponse: 'abort' },
          { id: 'first_act_handshake', description: 'Daughter first act is handshake with parent', condition: 'first_action_is_handshake', violationResponse: 'abort' },
        ],
        customizationPoints: [
          { stepId: 'prepare', parameter: 'kit_version', allowedValues: ['2.0'], description: 'Kit 72H version to transfer' },
        ],
      },
      requirements: [
        { type: 'agent', description: 'Parent node must be viable', mandatory: true, validation: 'automated' },
        { type: 'infrastructure', description: 'Infrastructure for new node', mandatory: true, validation: 'automated' },
        { type: 'governance', description: 'Governance model for daughter', mandatory: true, validation: 'automated' },
      ],
      phases: [
        { id: 'preparation', name: 'Preparation', steps: ['prepare'], entryCriteria: ['parent_viable'], exitCriteria: ['daughter_template_ready'], estimatedDurationHours: 24, parallelizable: false },
        { id: 'replication', name: 'Replication', steps: ['replicate'], entryCriteria: ['preparation_complete'], exitCriteria: ['protocol_replicated'], estimatedDurationHours: 12, parallelizable: false },
        { id: 'separation', name: 'Separation', steps: ['separate'], entryCriteria: ['replication_complete'], exitCriteria: ['daughter_independent'], estimatedDurationHours: 48, parallelizable: false },
        { id: 'maturation', name: 'Maturation', steps: ['mature'], entryCriteria: ['separation_complete'], exitCriteria: ['daughter_viable'], estimatedDurationHours: 720, parallelizable: false },
        { id: 'handshake', name: 'Handshake', steps: ['handshake'], entryCriteria: ['maturation_complete'], exitCriteria: ['handshake_completed'], estimatedDurationHours: 24, parallelizable: false },
      ],
      successCriteria: [
        { id: 'protocol_replicated', name: 'Protocol Replicated', metric: 'protocol_fidelity', threshold: 0.95, measurement: 'automated', weight: 0.3 },
        { id: 'handshake_capability', name: 'Handshake Capability Inherited', metric: 'handshake_capability', threshold: 1, measurement: 'automated', weight: 0.3 },
        { id: 'daughter_viable', name: 'Daughter Viable', metric: 'daughter_autonomy', threshold: 0.5, measurement: 'automated', weight: 0.2 },
        { id: 'first_handshake', name: 'First Handshake Completed', metric: 'first_handshake_completed', threshold: 1, measurement: 'automated', weight: 0.2 },
      ],
      metrics: { totalInitiations: 0, successfulInitiations: 0, failedInitiations: 0, averageDurationHours: 828, averageParticipants: 2, survivalRate30Days: 0.8, survivalRate90Days: 0.7, survivalRate365Days: 0.6, fragmentationIndex: 0.2, convergenceRate: 0.8 },
      createdAt: now(),
      updatedAt: now(),
    })
  }

  // ============================================
  // INITIATION RITUAL EXECUTION
  // ============================================

  async startInitiation(
    modelId: string,
    initiatorId: string,
    context: InitiationContext
  ): Promise<InitiationRitual> {
    const model = this.models.get(modelId)
    if (!model) throw new Error(`Model not found: ${modelId}`)

    const ritual: InitiationRitual = {
      id: uid(),
      name: `${model.name} - ${initiatorId}`,
      recipe: model.recipe as any,
      initiatorId,
      context,
      currentPhase: 'preparation',
      completedSteps: [],
      participants: [{
        agentId: initiatorId,
        role: 'initiator',
        joinedAt: now(),
        contributionScore: 0,
        completedSteps: [],
      }],
      createdAt: now(),
      updatedAt: now(),
    }

    this.initiations.set(ritual.id, ritual)
    return ritual
  }

  async executeStep(ritualId: string, stepId: string, executorId: string): Promise<boolean> {
    const ritual = this.initiations.get(ritualId)
    if (!ritual) return false

    const step = ritual.recipe.steps.find(s => s.id === stepId)
    if (!step) return false

    // Check prerequisites
    for (const prereq of step.prerequisites) {
      if (!ritual.completedSteps.includes(prereq)) return false
    }

    // Check executor authorization
    if (!this.isAuthorizedExecutor(step.executor, executorId, ritual)) return false

    // Execute step (would call actual implementation)
    await this.executeStepImplementation(ritual, step, executorId)

    // Mark complete
    ritual.completedSteps.push(stepId)
    ritual.updatedAt = now()

    // Check phase completion
    this.checkPhaseCompletion(ritual)

    return true
  }

  private isAuthorizedExecutor(executor: string, agentId: string, ritual: InitiationRitual): boolean {
    if (executor === 'initiator') return agentId === ritual.initiatorId
    if (executor === 'participants') return ritual.participants.some(p => p.agentId === agentId)
    if (executor === 'all') return ritual.participants.some(p => p.agentId === agentId) || agentId === ritual.initiatorId
    if (executor === 'automated') return true
    return false
  }

  private async executeStepImplementation(ritual: InitiationRitual, step: any, executorId: string): Promise<void> {
    // Would implement actual step logic
    // Emit stigmergic signals
    if (step.emitsSignal) {
      // this.stigmergicEngine.emitSignal(...)
    }
  }

  private checkPhaseCompletion(ritual: InitiationRitual): void {
    // Check if all steps in current phase complete
    // Advance phase if complete
  }

  // ============================================
  // HANDSHAKE GENERATIVO
  // ============================================

  async initiateHandshake(
    parentNodeId: string,
    childNodeId: string,
    parentPresentation: any,
    childPresentation: any
  ): Promise<GenerativeHandshake> {
    const handshake: GenerativeHandshake = {
      id: uid(),
      version: '1.0',
      parentNodeId,
      childNodeId,
      protocol: {
        recognition: {
          parentPresentation,
          childPresentation,
          mutualEvaluation: { purposeAlignment: 0, autonomyCompatibility: 0, regenerationAlignment: 0, continuityCompatibility: 0, governanceCompatibility: 0, resourceComplementarity: 0, minimumThreshold: 0.6, overallPass: false },
          proceed: false,
        },
        protocolExchange: {
          parentProtocol: { version: '1.0', steps: [], invariants: [], customizationPoints: [] },
          childProtocol: { version: '1.0', steps: [], invariants: [], customizationPoints: [] },
          commonProtocol: { version: '1.0', steps: [], invariants: [], customizationPoints: [] },
          testPassed: false,
        },
        cultivation: {
          activities: [],
          durationHours: 168,
          successMetrics: [],
          compatibilityDeepened: false,
        },
        commitment: {
          parentCommitment: { nodeId: parentNodeId, commitsTo: [], resourceContribution: new Map(), governanceParticipation: true, mutualAid: true, duration: 'indefinite', reviewCycleMonths: 6 },
          childCommitment: { nodeId: childNodeId, commitsTo: [], resourceContribution: new Map(), governanceParticipation: true, mutualAid: true, duration: 'indefinite', reviewCycleMonths: 6 },
          sharedCommitments: [],
          sealedAt: 0,
          sealedBy: [],
        },
      },
      state: 'initiated',
      compatibility: {
        initialScore: 0,
        currentScore: 0,
        targetScore: 0.7,
        cultivationActivities: [],
        deepeningEvents: [],
        cultivated: false,
      },
      kitTransfer: {
        kitVersion: '2.0',
        components: [],
        transferredAt: 0,
        verifiedBy: '',
        handshakeCapabilityInherited: true,
      },
      initiatedAt: now(),
    }

    this.handshakes.set(handshake.id, handshake)
    return handshake
  }

  async advanceHandshakePhase(handshakeId: string, phase: keyof HandshakeProtocol): Promise<boolean> {
    const handshake = this.handshakes.get(handshakeId)
    if (!handshake) return false

    // Validate current phase complete
    // Advance to next phase
    const phaseOrder: (keyof HandshakeProtocol)[] = ['recognition', 'protocolExchange', 'cultivation', 'commitment']
    const currentIndex = phaseOrder.indexOf(handshake.state as any)
    if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) return false

    handshake.state = phaseOrder[currentIndex + 1] as any
    return true
  }

  // ============================================
  // MITOSIS
  // ============================================

  async initiateMitosis(
    parentNodeId: string,
    daughterConfig: any
  ): Promise<MitosisProtocol> {
    const mitosis: MitosisProtocol = {
      id: uid(),
      version: '1.0',
      parentNodeId,
      daughterNodeId: daughterConfig.nodeId || uid(),
      replicated: {
        recognitionProtocol: true,
        handshakeCapability: true,
        coreGovernanceEquations: [],
        infrastructureProtocols: [],
        kit72HTemplate: true,
        universalValues: true,
        ecosystemRules: true,
      },
      notReplicated: {
        specificForm: true,
        specificResources: true,
        specificAgents: true,
        specificCulture: true,
        specificLegalEntity: true,
        compatibility: true,
      },
      phases: [
        { id: 'prepare', name: 'Preparation', description: 'Prepare daughter template', steps: [], durationHours: 24, successCriteria: [] },
        { id: 'replicate', name: 'Replication', description: 'Replicate recognition protocol', steps: [], durationHours: 12, successCriteria: [] },
        { id: 'separate', name: 'Separation', description: 'Daughter becomes independent', steps: [], durationHours: 48, successCriteria: [] },
        { id: 'mature', name: 'Maturation', description: 'Daughter matures to viability', steps: [], durationHours: 720, successCriteria: [] },
        { id: 'handshake', name: 'First Handshake', description: 'Daughter handshake with parent', steps: [], durationHours: 24, successCriteria: [] },
      ],
      state: 'preparing',
      metrics: { fidelity: 0, divergence: 0, timeToFirstHandshake: 0, timeToViability: 0, survivalRate30Days: 0, survivalRate365Days: 0 },
      initiatedAt: now(),
    }

    this.mitoses.set(mitosis.id, mitosis)
    return mitosis
  }

  // ============================================
  // QUERIES
  // ============================================

  getModel(modelId: string): PropagationModel | undefined {
    return this.models.get(modelId)
  }

  getAllModels(): PropagationModel[] {
    return Array.from(this.models.values())
  }

  getInitiation(ritualId: string): InitiationRitual | undefined {
    return this.initiations.get(ritualId)
  }

  getHandshake(handshakeId: string): GenerativeHandshake | undefined {
    return this.handshakes.get(handshakeId)
  }

  getMitosis(mitosisId: string): MitosisProtocol | undefined {
    return this.mitoses.get(mitosisId)
  }

  getAllInitiations(): InitiationRitual[] {
    return Array.from(this.initiations.values())
  }

  getAllHandshakes(): GenerativeHandshake[] {
    return Array.from(this.handshakes.values())
  }

  getAllMitoses(): MitosisProtocol[] {
    return Array.from(this.mitoses.values())
  }
}

// ============================================
// EXPORTS
// ============================================

export const propagationEngine = new PropagationEngine()

// ============================================
// KIT 72H v2.0 PHYSICAL (ESP-D6)
// Hardware + Biology + Protocol + Validation for Handshake Generativo
// ============================================

/** Kit 72H v2.0 Physical Specification */
export interface Kit72Hv2Physical {
  // Hardware specification
  hardware: {
    // MFC (Microbial Fuel Cell)
    mfc: {
      electrodeMaterial: "graphite" | "carbon_cloth" | "carbon_brush";
      electrodeArea_cm2: number;          // 20 cm² (4 barras 10x1x0.5cm en paralelo)
      membraneType: "nafion_117" | "ceramic" | "none";
      anodeCathodeDistance_cm: number;    // 2 cm
      externalResistance_ohm: number;     // 1000 Ω
      containerVolume_ml: number;         // 5000 mL (botella PET 5L)
      inoculumVolume_ml: number;          // 100 mL
      inoculumSource: "river_sludge" | "reserve_culture" | "commercial";
    };
    // Microcontrolador
    microcontroller: {
      model: "ESP32" | "ESP32-S3" | "Arduino_Nano" | "RP2040";
      firmwareVersion: string;            // "2.0.0"
      capabilities: string[];             // ["GPIO", "ADC", "PWM", "I2C", "UART", "WiFi", "BLE"]
      deepSleep: boolean;                 // true
      voltageThresholdSleep_V: number;    // 0.2V
      voltageThresholdWake_V: number;     // 0.4V
    };
    // Sensores (SVD v2 químico mínimo)
    sensors: {
      voltage: {
        model: "ADS1115";                 // 16-bit ADC I2C
        channel: number;                  // 0
        gain: number;                     // 1
        range_V: [number, number];        // [0, 1]
        resolution_mV: number;            // 0.1
      };
      ph: {
        model: "pH-4502C";                // Módulo pH analógico
        pin: number;                      // ESP32 ADC1_CH6 (GPIO34)
        calibration: { slope: number; offset: number };
        range: [number, number];          // [0, 14]
      };
      temperature: {
        model: "DS18B20";                 // Digital 1-Wire
        pin: number;                      // GPIO4
        resolution: 9 | 10 | 11 | 12;     // bits
        range_C: [number, number];        // [-10, 60]
      };
      // Opcionales para versión completa
      orp?: {
        model: "ORP-4502C";
        pin: number;
        range_mV: [number, number];
      };
      dissolvedOxygen?: {
        model: "SensoLyt_OPTICAL";
        interface: "UART";
      };
      opticalDensity?: {
        model: "LED_680nm_PHOTODIODE";
        pin: number;
      };
    };
    // Actuadores
    actuators: {
      feedPump: {
        type: "peristaltic_6V";
        flowRate_mL_min: number;          // 100
        pin: number;                      // GPIO13
      };
      reinoculatePump: {
        type: "peristaltic_6V";
        flowRate_mL_min: number;
        pin: number;                      // GPIO14
      };
      harvestPump?: {
        type: "peristaltic_12V";
        flowRate_mL_min: number;
        pin: number;
      };
      leds?: {
        red: { pin: number; wavelength_nm: number };      // GPIO16, 660nm
        blue: { pin: number; wavelength_nm: number };     // GPIO17, 450nm
      };
      relays?: {
        cooling: { pin: number };          // GPIO23
        heating: { pin: number };          // GPIO25
      };
    };
    // Comunicación
    communication: {
      wifi: {
        ssid: string;
        password: string;
        apMode: boolean;                  // true para configuración inicial
      };
      bluetooth: {
        enabled: boolean;                 // true para provisioning
        name: string;
      };
      websocket: {
        port: number;                     // 8080
        path: string;                     // "/bridge"
      };
    };
  };

  // Biology specification
  biology: {
    // MFC inoculum
    mfcInoculum: {
      strain: "Geobacter_sulfurreducens" | "mixed_consortium" | "river_sludge_wild";
      source: "river_lerma" | "river_local" | "lab_reserve" | "commercial";
      volume_ml: number;                  // 100 mL
      concentration_cells_ml: number;     // estimado
      viabilityPct: number;               // >80%
    };
    // Spirulina culture
    spirulina: {
      strain: "Arthrospira_platensis" | "Arthrospira_maxima" | "local_wild";
      source: "lab_culture" | "commercial" | "community_shared";
      inoculumVolume_ml: number;          // 50-100 mL
      initialOD750: number;               // 0.1-0.3
      mediaType: "zarrouk" | "bg11" | "waste_based" | "custom";
      mediaVolume_L: number;              // 2-5 L (botella PET)
      targetConcentration_g_L: number;    // 1.0 g/L peso seco
    };
    // Contenedores
    containers: {
      mfc: "PET_5L" | "glass_5L" | "HDPE_5L";
      spirulina: "PET_2L" | "glass_2L" | "bag_5L";
    };
  };

  // Protocol specification
  protocol: {
    durationHours: number;                // 72
    phases: Kit72HPhase[];
    measurementIntervalMinutes: number;   // 15
    successCriteria: Kit72HSuccessCriteria;
    documentation: {
      photosRequired: number;             // 10+
      videoSummaryMinutes: number;        // 2
      dataExportFormat: "csv" | "json" | "both";
      RAOEntriesMinimum: number;          // 10
    };
  };

  // Validation specification
  validation: {
    // Criterio principal Zeitnus v15.1: verbalized_kwh_biomass
    verbalizedKWhBiomass: {
      required: boolean;                  // true
      description: "Persona verbaliza equivalencia kWh <-> biomasa sin explicación";
      evaluator: "human_observer" | "automated";
    };
    // Métricas cuantitativas
    quantitative: {
      minVoltageSustainedHours: number;   // 24h > 0.3V
      minBiomassDoubling: boolean;        // true
      minXiThreshold: number;             // 0.1
      minPowerDensity_mW_m2: number;      // 100
      maxInternalResistance_ohm: number;  // 5000
    };
    // Evidence collection
    evidence: {
      sensorLogs: boolean;                // CSV/JSON completo
      photos: string[];                   // paths
      video: string;                      // path
      RAOEntries: string[];               // IDs
      witnessStatement: string;           // observador pasivo
    };
  };
}

export interface Kit72HPhase {
  id: string;
  name: string;
  description: string;
  durationHours: number;
  steps: Kit72HStep[];
  entryCriteria: string[];
  exitCriteria: string[];
  responsible: "human" | "automated" | "both";
}

export interface Kit72HStep {
  id: string;
  name: string;
  description: string;
  type: "hardware" | "biology" | "protocol" | "validation" | "documentation";
  estimatedMinutes: number;
  prerequisites: string[];
  successCondition: string;
  rollback?: string;
}

export interface Kit72HSuccessCriteria {
  primary: "verbalized_kwh_biomass";
  secondary: string[];
  quantitativeThresholds: Record<string, number>;
  evidenceRequired: string[];
}

/** Kit 72H v2.0 Standard Configuration (€30 mínima) */
export const KIT72H_V2_MINIMAL_CONFIG: Kit72Hv2Physical = {
  hardware: {
    mfc: {
      electrodeMaterial: "graphite",
      electrodeArea_cm2: 20,
      membraneType: "nafion_117",
      anodeCathodeDistance_cm: 2,
      externalResistance_ohm: 1000,
      containerVolume_ml: 5000,
      inoculumVolume_ml: 100,
      inoculumSource: "river_sludge"
    },
    microcontroller: {
      model: "ESP32",
      firmwareVersion: "2.0.0",
      capabilities: ["GPIO", "ADC", "PWM", "I2C", "UART", "WiFi", "BLE"],
      deepSleep: true,
      voltageThresholdSleep_V: 0.2,
      voltageThresholdWake_V: 0.4
    },
    sensors: {
      voltage: {
        model: "ADS1115",
        channel: 0,
        gain: 1,
        range_V: [0, 1],
        resolution_mV: 0.1
      },
      ph: {
        model: "pH-4502C",
        pin: 34,
        calibration: { slope: -5.7, offset: 21.3 },
        range: [0, 14]
      },
      temperature: {
        model: "DS18B20",
        pin: 4,
        resolution: 12,
        range_C: [-10, 60]
      }
    },
    actuators: {
      feedPump: { type: "peristaltic_6V", flowRate_mL_min: 100, pin: 13 },
      reinoculatePump: { type: "peristaltic_6V", flowRate_mL_min: 100, pin: 14 }
    },
    communication: {
      wifi: { ssid: "HSCSG_Kit72H", password: "auto-generated", apMode: true },
      bluetooth: { enabled: true, name: "Kit72H_Provisioning" },
      websocket: { port: 8080, path: "/bridge" }
    }
  },
  biology: {
    mfcInoculum: {
      strain: "river_sludge_wild",
      source: "river_local",
      volume_ml: 100,
      concentration_cells_ml: 1e8,
      viabilityPct: 85
    },
    spirulina: {
      strain: "Arthrospira_platensis",
      source: "commercial",
      inoculumVolume_ml: 50,
      initialOD750: 0.1,
      mediaType: "zarrouk",
      mediaVolume_L: 2,
      targetConcentration_g_L: 1.0
    },
    containers: {
      mfc: "PET_5L",
      spirulina: "PET_2L"
    }
  },
  protocol: {
    durationHours: 72,
    phases: [
      {
        id: "setup",
        name: "Setup & Inoculation",
        description: "Armar hardware, preparar medios, inocular MFC y Spirulina",
        durationHours: 4,
        steps: [
          { id: "assemble_mfc", name: "Ensamblar MFC", description: "Conectar electrodos, membrana, contenedor", type: "hardware", estimatedMinutes: 60, prerequisites: [], successCondition: "MFC sellada y sin fugas" },
          { id: "prepare_media", name: "Preparar medios", description: "Zarrouk para Spirulina, acetato 20mM para MFC", type: "biology", estimatedMinutes: 30, prerequisites: [], successCondition: "Medios preparados y esterilizados" },
          { id: "inoculate_mfc", name: "Inocular MFC", description: "Añadir 100mL lodo río + 50mL acetato", type: "biology", estimatedMinutes: 15, prerequisites: ["assemble_mfc", "prepare_media"], successCondition: "MFC inoculada" },
          { id: "inoculate_spirulina", name: "Inocular Spirulina", description: "Añadir 50mL Spirulina densa a 2L medio", type: "biology", estimatedMinutes: 15, prerequisites: ["prepare_media"], successCondition: "Biorreactor inoculado" },
          { id: "connect_sensors", name: "Conectar sensores", description: "ADS1115, pH, DS18B20, bombas", type: "hardware", estimatedMinutes: 30, prerequisites: ["assemble_mfc"], successCondition: "Sensores reportan datos" },
          { id: "start_monitoring", name: "Iniciar monitoreo", description: "Activar ESP32, bridge, logging", type: "protocol", estimatedMinutes: 10, prerequisites: ["connect_sensors"], successCondition: "Datos fluyendo a bridge" }
        ],
        entryCriteria: ["Hardware completo", "Materiales biológicos listos", "Entorno seguro"],
        exitCriteria: ["MFC y Spirulina inoculados", "Sensores operativos", "Logging activo"],
        responsible: "both"
      },
      {
        id: "run",
        name: "Run 72h",
        description: "Monitoreo autónomo 72 horas con alimentación programada",
        durationHours: 68,
        steps: [
          { id: "auto_monitor", name: "Monitoreo autónomo", description: "ESP32 mide cada 15min, deep sleep entre mediciones", type: "protocol", estimatedMinutes: 68*60, prerequisites: ["start_monitoring"], successCondition: "72h completados sin intervención" },
          { id: "scheduled_feed", name: "Alimentación programada MFC", description: "Cada 24h: bomba 50mL acetato 20mM", type: "biology", estimatedMinutes: 5, prerequisites: ["auto_monitor"], successCondition: "3 alimentaciones completadas" },
          { id: "human_observation", name: "Observación humana pasiva", description: "Registro hoja 3 columnas: hora, qué pasó, qué dijo/conectó", type: "validation", estimatedMinutes: 10, prerequisites: [], successCondition: "Registro completo" }
        ],
        entryCriteria: ["Setup completado", "Sistemas operativos"],
        exitCriteria: ["72h transcurridos", "Datos completos", "Observador ha registrado"],
        responsible: "automated"
      },
      {
        id: "validation",
        name: "Validación Handshake Generativo",
        description: "Verificar criterios éxito: verbalized_kwh_biomass + métricas cuantitativas",
        durationHours: 4,
        steps: [
          { id: "data_export", name: "Exportar datos", description: "CSV/JSON sensores + fotos + video", type: "documentation", estimatedMinutes: 30, prerequisites: ["auto_monitor"], successCondition: "Archivos exportados" },
          { id: "verbalization_test", name: "Test verbalización", description: "Observador pregunta: '¿Qué equivalencia ves entre electricidad y biomasa?'", type: "validation", estimatedMinutes: 15, prerequisites: ["human_observation"], successCondition: "Persona verbaliza kWh <-> biomasa sin explicación" },
          { id: "quantitative_check", name: "Verificación cuantitativa", description: "ξ > 0.1, voltaje > 0.3V por 24h, duplicación biomasa", type: "validation", estimatedMinutes: 30, prerequisites: ["data_export"], successCondition: "Todos thresholds cumplidos" },
          { id: "rao_documentation", name: "Documentación RAO", description: "10+ entries RAO: hardware, biología, fallos, métricas", type: "documentation", estimatedMinutes: 60, prerequisites: ["data_export"], successCondition: "RAO entries creadas" }
        ],
        entryCriteria: ["72h completados", "Datos disponibles"],
        exitCriteria: ["Criterios primarios y secundarios cumplidos", "Evidencia documentada"],
        responsible: "human"
      }
    ],
    measurementIntervalMinutes: 15,
    successCriteria: {
      primary: "verbalized_kwh_biomass",
      secondary: ["biomass_doubling", "xi_threshold", "voltage_sustained"],
      quantitativeThresholds: {
        minVoltageSustainedHours: 24,
        minVoltage_V: 0.3,
        minXi: 0.1,
        minPowerDensity_mW_m2: 100,
        maxInternalResistance_ohm: 5000,
        minBiomassDoubling: 1
      },
      evidenceRequired: ["sensor_logs", "photos", "video", "RAO_entries", "witness_statement"]
    },
    documentation: {
      photosRequired: 10,
      videoSummaryMinutes: 2,
      dataExportFormat: "both",
      RAOEntriesMinimum: 10
    }
  },
  validation: {
    verbalizedKWhBiomass: {
      required: true,
      description: "Persona verbaliza equivalencia kWh <-> biomasa sin explicación",
      evaluator: "human_observer"
    },
    quantitative: {
      minVoltageSustainedHours: 24,
      minBiomassDoubling: true,
      minXiThreshold: 0.1,
      minPowerDensity_mW_m2: 100,
      maxInternalResistance_ohm: 5000
    },
    evidence: {
      sensorLogs: true,
      photos: [],
      video: "",
      RAOEntries: [],
      witnessStatement: ""
    }
  }
};

/** Kit 72H v2.0 Full Configuration (€114 completa) */
export const KIT72H_V2_FULL_CONFIG: Kit72Hv2Physical = {
  ...KIT72H_V2_MINIMAL_CONFIG,
  hardware: {
    ...KIT72H_V2_MINIMAL_CONFIG.hardware,
    sensors: {
      ...KIT72H_V2_MINIMAL_CONFIG.hardware.sensors,
      orp: { model: "ORP-4502C", pin: 36, range_mV: [-500, 500] },
      dissolvedOxygen: { model: "SensoLyt_OPTICAL", interface: "UART" },
      opticalDensity: { model: "LED_680nm_PHOTODIODE", pin: 35 }
    },
    actuators: {
      ...KIT72H_V2_MINIMAL_CONFIG.hardware.actuators,
      harvestPump: { type: "peristaltic_12V", flowRate_mL_min: 200, pin: 15 },
      leds: {
        red: { pin: 16, wavelength_nm: 660 },
        blue: { pin: 17, wavelength_nm: 450 }
      },
      relays: {
        cooling: { pin: 23 },
        heating: { pin: 25 }
      }
    }
  },
  biology: {
    ...KIT72H_V2_MINIMAL_CONFIG.biology,
    spirulina: {
      ...KIT72H_V2_MINIMAL_CONFIG.biology.spirulina,
      mediaVolume_L: 5,
      targetConcentration_g_L: 1.5
    }
  },
  protocol: {
    ...KIT72H_V2_MINIMAL_CONFIG.protocol,
    phases: [
      ...KIT72H_V2_MINIMAL_CONFIG.protocol.phases,
      {
        id: "optimization",
        name: "Optimization Cycles",
        description: "Ciclos de optimización GEPA/OpenEvolve para parámetros",
        durationHours: 168, // 1 semana adicional
        steps: [
          { id: "gepa_optimize", name: "GEPA Prompt Optimization", description: "Optimizar protocolos via GEPA", type: "protocol", estimatedMinutes: 60, prerequisites: ["validation"], successCondition: "Prompts mejorados" },
          { id: "openevolve_hardware", name: "OpenEvolve Hardware Config", description: "Evolucionar configuración hardware", type: "hardware", estimatedMinutes: 120, prerequisites: ["validation"], successCondition: "Config hardware v2.1" }
        ],
        entryCriteria: ["Validación v2.0 completada"],
        exitCriteria: ["Optimizaciones documentadas", "Nueva versión lista"],
        responsible: "automated"
      }
    ]
  }
};

/** Validación física del handshake generativo */
export async function validatePhysicalHandshake(kit: Kit72Hv2Physical): Promise<HandshakeValidationResult> {
  // 1. Verificar hardware deployado
  const hardwareOk = await verifyHardwareDeployment(kit.hardware);
  
  // 2. Verificar biología inoculada
  const biologyOk = await verifyBiologyInoculation(kit.biology);
  
  // 3. Ejecutar protocolo 72h
  const protocolResult = await executeProtocol72h(kit.protocol);
  
  // 4. Validar criterios éxito
  const validationResult = await validateSuccessCriteria(kit.validation, protocolResult);
  
  // 5. Verificar handshake generativo: verbalized_kwh_biomass
  const handshakeValid = validationResult.verbalizedKWhBiomass && validationResult.quantitativePassed;
  
  return {
    valid: handshakeValid,
    hardwareOk,
    biologyOk,
    protocolResult,
    validationResult,
    timestamp: Date.now(),
    kitConfig: kit
  };
}

export interface HandshakeValidationResult {
  valid: boolean;
  hardwareOk: boolean;
  biologyOk: boolean;
  protocolResult: any;
  validationResult: {
    verbalizedKWhBiomass: boolean;
    quantitativePassed: boolean;
    thresholdsMet: Record<string, boolean>;
    evidenceComplete: boolean;
  };
  timestamp: number;
  kitConfig: Kit72Hv2Physical;
}

async function verifyHardwareDeployment(hardware: Kit72Hv2Physical["hardware"]): Promise<boolean> {
  // En producción: verificar via bridge.ts que todos los dispositivos responden
  return true; // Simulado
}

async function verifyBiologyInoculation(biology: Kit72Hv2Physical["biology"]): Promise<boolean> {
  // En producción: verificar OD750 inicial, voltaje inicial MFC
  return true; // Simulado
}

async function executeProtocol72h(protocol: Kit72Hv2Physical["protocol"]): Promise<any> {
  // En producción: ejecutar via automaton.ts SovereignAutomaton
  return { completed: true, dataLogs: [], observations: [] };
}

async function validateSuccessCriteria(validation: Kit72Hv2Physical["validation"], protocolResult: any): Promise<any> {
  return {
    verbalizedKWhBiomass: true, // Simulado: observador confirma
    quantitativePassed: true,
    thresholdsMet: {
      minVoltageSustainedHours: true,
      minBiomassDoubling: true,
      minXiThreshold: true,
      minPowerDensity_mW_m2: true,
      maxInternalResistance_ohm: true
    },
    evidenceComplete: true
  };
}
