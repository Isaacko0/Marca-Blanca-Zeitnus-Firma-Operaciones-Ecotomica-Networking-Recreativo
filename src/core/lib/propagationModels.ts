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