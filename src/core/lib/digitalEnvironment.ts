// HSCSG v15 OS — Digital Environment (OVN 3.0 / OVNi 3.0: UX/UI for Stigmergic Coordination)
// Capa 4: Infraestructura Metabólica — Shared environment for stigmergic signals
// "Work must be done in same environment... stigmergic coordination using volatile signals deposited in space discoverable by peers"

import { uid, now } from '@core/lib/utils'

// ============================================
// DIGITAL ENVIRONMENT TYPES
// ============================================

export interface DigitalEnvironment {
  id: string
  name: string
  description: string
  // Layers (OVNi: resource_registry, venture_space, governance_forum, learning_space, social_space)
  layers: EnvironmentLayer[]
  // Shared spaces for stigmergic coordination
  sharedSpaces: SharedSpace[]
  // Agent presence
  agentPresences: Map<string, AgentPresence>
  // Signal propagation
  signalPropagation: SignalPropagationConfig
  // Access control
  accessControl: EnvironmentAccessControl
  // Metrics
  metrics: EnvironmentMetrics
  // Lifecycle
  createdAt: number
  updatedAt: number
}

export interface EnvironmentLayer {
  id: string
  name: string
  type: 'resource_registry' | 'venture_space' | 'governance_forum' | 'learning_space' | 'social_space' | 'custom'
  description: string
  // Signals in this layer
  signalTypes: string[]
  // UI components
  components: LayerComponent[]
  // Access policy
  accessPolicy: 'open' | 'affiliates' | 'core_group' | 'custodian' | 'custom'
  // Custom access rules
  customAccessRules?: AccessRule[]
}

export interface LayerComponent {
  id: string
  name: string
  type: 'registry' | 'canvas' | 'forum' | 'dashboard' | 'editor' | 'visualization' | 'chat' | 'notification' | 'custom'
  config: Record<string, any>
  position: { x: number; y: number; width: number; height: number }
  zIndex: number
  visible: boolean
}

export interface SharedSpace {
  id: string
  name: string
  type: 'collaborative_canvas' | 'document_editor' | 'resource_map' | 'governance_forum' | 'learning_circle' | 'social_hub'
  // Participants
  participants: Map<string, SpaceParticipant>
  // Shared state
  state: SharedState
  // Stigmergic signals in this space
  signals: string[] // signal IDs
  // Access
  accessPolicy: 'open' | 'invite' | 'venture' | 'core_group' | 'custom'
  // Persistence
  persistence: 'ephemeral' | 'session' | 'persistent' | 'versioned'
}

export interface SpaceParticipant {
  agentId: string
  role: 'owner' | 'editor' | 'commenter' | 'viewer' | 'facilitator'
  joinedAt: number
  lastActiveAt: number
  cursor?: { x: number; y: number; color: string }
  selection?: string[]
}

export interface SharedState {
  // Collaborative state (CRDT-based)
  data: Record<string, any>
  version: number
  lastModified: number
  modifiedBy: string
  // CRDT metadata
  crdtType: 'yjs' | 'automerge' | 'custom'
  crdtDocId: string
}

export interface SignalPropagationConfig {
  // How signals propagate through environment
  propagationModel: 'gossip' | 'flood' | 'targeted' | 'layered' | 'hybrid'
  // Speed
  propagationSpeed: 'instant' | 'fast' | 'normal' | 'slow'
  // Persistence
  signalPersistence: 'ephemeral' | 'short_term' | 'long_term' | 'permanent'
  // Discovery
  discoveryRadius: number // layers
  // Filtering
  filtering: SignalFilterConfig
}

export interface SignalFilterConfig {
  // Agent-controlled filtering
  agentControlled: boolean
  // AI-assisted
  aiAssisted: boolean
  // Community moderation
  communityModeration: boolean
  // Relevance scoring
  relevanceScoring: RelevanceScoringConfig
}

export interface RelevanceScoringConfig {
  enabled: boolean
  factors: RelevanceFactor[]
  threshold: number
  personalized: boolean
}

export interface RelevanceFactor {
  name: string
  weight: number
  type: 'signal_type' | 'emitter_reputation' | 'location_proximity' | 'topic_similarity' | 'agent_interest' | 'urgency' | 'custom'
  config: Record<string, any>
}

export interface EnvironmentAccessControl {
  // Default policies per layer
  defaultPolicies: Map<string, AccessPolicy>
  // Agent-specific overrides
  agentOverrides: Map<string, AccessPolicy>
  // Role-based
  roleBased: Map<string, AccessPolicy>
  // Time-based
  timeBased: TimeBasedAccessRule[]
}

export interface AccessPolicy {
  id: string
  name: string
  permissions: Permission[]
  conditions: AccessCondition[]
  priority: number
}

export interface Permission {
  resource: string
  actions: string[]
  scope: 'own' | 'venture' | 'network' | 'global'
}

export interface AccessCondition {
  type: 'role' | 'credential' | 'reputation' | 'affiliation' | 'time' | 'custom'
  parameters: Record<string, any>
}

export interface TimeBasedAccessRule {
  id: string
  layerId: string
  startTime: number // hour 0-23
  endTime: number
  days: number[] // 0-6
  timezone: string
  permissions: Permission[]
  override: boolean
}

export interface AgentPresence {
  agentId: string
  currentLayer: string
  currentSpace?: string
  status: 'active' | 'idle' | 'away' | 'offline'
  lastActiveAt: number
  // Stigmergic sensitivity
  signalSensitivity: Map<string, number> // signalType -> 0-1
  // Following
  followingSignals: string[]
  followingSpaces: string[]
  // Emitting
  emittedSignals: string[]
  // UI state
  uiState: AgentUIState
}

export interface AgentUIState {
  viewport: { x: number; y: number; zoom: number }
  openPanels: string[]
  activeTools: string[]
  notifications: Notification[]
  preferences: UIPreferences
}

export interface Notification {
  id: string
  type: 'signal' | 'mention' | 'invitation' | 'alert' | 'system' | 'governance'
  title: string
  message: string
  timestamp: number
  read: boolean
  actionable: boolean
  actionUrl?: string
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'system' | 'high_contrast'
  language: string
  compactMode: boolean
  reducedMotion: boolean
  signalVisibility: Map<string, boolean> // signalType -> visible
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  signalReceived: boolean
  mention: boolean
  invitation: boolean
  alert: boolean
  governance: boolean
  email: boolean
  push: boolean
}

export interface EnvironmentMetrics {
  // Activity
  activeAgents: number
  totalAgents: number
  signalsPerHour: number
  spacesActive: number
  // Collaboration
  concurrentEdits: number
  crossLayerInteractions: number
  stigmergicEfficiency: number
  // Health
  signalToNoiseRatio: number
  averageResponseTime: number
  agentSatisfaction: number
  // Growth
  newAgentsPerWeek: number
  retentionRate: number
}

// ============================================
// DIGITAL ENVIRONMENT ENGINE
// ============================================

export class DigitalEnvironmentEngine {
  private environments: Map<string, DigitalEnvironment> = new Map()
  private stigmergicEngine: any // StigmergicCoordinationEngine

  constructor(stigmergicEngine?: any) {
    this.stigmergicEngine = stigmergicEngine
    this.initializeDefaultEnvironment()
  }

  private initializeDefaultEnvironment(): void {
    const env: DigitalEnvironment = {
      id: 'main',
      name: 'HSCSG Digital Environment',
      description: 'Primary digital environment for stigmergic coordination',
      layers: [
        {
          id: 'resource_registry',
          name: 'Resource Registry',
          type: 'resource_registry',
          description: 'Browse, book, and manage physical/digital resources',
          signalTypes: ['tracing', 'alarm'],
          components: [
            { id: 'resource_grid', name: 'Resource Grid', type: 'registry', config: { view: 'grid', filters: ['type', 'location', 'availability'] }, position: { x: 0, y: 0, width: 12, height: 8 }, zIndex: 1, visible: true },
            { id: 'resource_map', name: 'Resource Map', type: 'visualization', config: { type: 'map', clustering: true }, position: { x: 0, y: 8, width: 12, height: 4 }, zIndex: 1, visible: true },
            { id: 'booking_calendar', name: 'Booking Calendar', type: 'dashboard', config: { view: 'week', resources: 'all' }, position: { x: 12, y: 0, width: 12, height: 6 }, zIndex: 2, visible: true },
          ],
          accessPolicy: 'affiliates',
        },
        {
          id: 'venture_space',
          name: 'Venture Spaces',
          type: 'venture_space',
          description: 'Collaborative workspaces for ventures',
          signalTypes: ['tracing', 'priming', 'free'],
          components: [
            { id: 'venture_list', name: 'Venture List', type: 'registry', config: { filters: ['status', 'type'] }, position: { x: 0, y: 0, width: 4, height: 12 }, zIndex: 1, visible: true },
            { id: 'venture_canvas', name: 'Venture Canvas', type: 'canvas', config: { tools: ['sticky', 'drawing', 'link', 'signal'] }, position: { x: 4, y: 0, width: 12, height: 8 }, zIndex: 1, visible: true },
            { id: 'venture_chat', name: 'Venture Chat', type: 'chat', config: { threaded: true, signals: true }, position: { x: 4, y: 8, width: 12, height: 4 }, zIndex: 2, visible: true },
          ],
          accessPolicy: 'affiliates',
        },
        {
          id: 'governance_forum',
          name: 'Governance Forum',
          type: 'governance_forum',
          description: 'Decision-making, proposals, voting',
          signalTypes: ['alarm', 'free'],
          components: [
            { id: 'proposal_list', name: 'Proposals', type: 'registry', config: { status: ['active', 'voting'] }, position: { x: 0, y: 0, width: 8, height: 12 }, zIndex: 1, visible: true },
            { id: 'voting_interface', name: 'Voting', type: 'dashboard', config: { mechanisms: ['conviction', 'quadratic', 'liquid'] }, position: { x: 8, y: 0, width: 8, height: 6 }, zIndex: 1, visible: true },
            { id: 'governance_chat', name: 'Governance Discussion', type: 'chat', config: { threaded: true, structured: true }, position: { x: 8, y: 6, width: 8, height: 6 }, zIndex: 2, visible: true },
          ],
          accessPolicy: 'core_group',
        },
        {
          id: 'learning_space',
          name: 'Learning Space',
          type: 'learning_space',
          description: 'Skill sharing, documentation, mentorship',
          signalTypes: ['priming', 'free'],
          components: [
            { id: 'skill_directory', name: 'Skill Directory', type: 'registry', config: { categories: ['technical', 'governance', 'care', 'production'] }, position: { x: 0, y: 0, width: 6, height: 12 }, zIndex: 1, visible: true },
            { id: 'mentorship_board', name: 'Mentorship Board', type: 'canvas', config: { matching: true }, position: { x: 6, y: 0, width: 6, height: 6 }, zIndex: 1, visible: true },
            { id: 'documentation_wiki', name: 'Documentation Wiki', type: 'editor', config: { collaborative: true, versioning: true }, position: { x: 6, y: 6, width: 12, height: 6 }, zIndex: 2, visible: true },
          ],
          accessPolicy: 'affiliates',
        },
        {
          id: 'social_space',
          name: 'Social Space',
          type: 'social_space',
          description: 'Community building, celebration, informal coordination',
          signalTypes: ['free', 'alarm'],
          components: [
            { id: 'activity_feed', name: 'Activity Feed', type: 'dashboard', config: { signals: ['free', 'celebration', 'recruitment'] }, position: { x: 0, y: 0, width: 12, height: 6 }, zIndex: 1, visible: true },
            { id: 'celebration_wall', name: 'Celebration Wall', type: 'canvas', config: { media: true }, position: { x: 0, y: 6, width: 12, height: 6 }, zIndex: 1, visible: true },
            { id: 'social_chat', name: 'Social Chat', type: 'chat', config: { casual: true }, position: { x: 12, y: 0, width: 12, height: 12 }, zIndex: 2, visible: true },
          ],
          accessPolicy: 'open',
        },
      ],
      sharedSpaces: [],
      agentPresences: new Map(),
      signalPropagation: {
        propagationModel: 'layered',
        propagationSpeed: 'instant',
        signalPersistence: 'short_term',
        discoveryRadius: 2,
        filtering: {
          agentControlled: true,
          aiAssisted: true,
          communityModeration: true,
          relevanceScoring: {
            enabled: true,
            factors: [
              { name: 'signal_type_match', weight: 0.3, type: 'signal_type', config: {} },
              { name: 'emitter_reputation', weight: 0.2, type: 'emitter_reputation', config: {} },
              { name: 'location_proximity', weight: 0.2, type: 'location_proximity', config: { layers: 1 } },
              { name: 'topic_similarity', weight: 0.15, type: 'topic_similarity', config: {} },
              { name: 'agent_interest', weight: 0.15, type: 'agent_interest', config: {} },
            ],
            threshold: 0.3,
            personalized: true,
          },
        },
      },
      accessControl: {
        defaultPolicies: new Map(),
        agentOverrides: new Map(),
        roleBased: new Map(),
        timeBased: [],
      },
      agentPresences: new Map(),
      metrics: {
        activeAgents: 0,
        totalAgents: 0,
        signalsPerHour: 0,
        spacesActive: 0,
        concurrentEdits: 0,
        crossLayerInteractions: 0,
        stigmergicEfficiency: 0,
        signalToNoiseRatio: 0,
        averageResponseTime: 0,
        agentSatisfaction: 0,
        newAgentsPerWeek: 0,
        retentionRate: 0,
      },
      createdAt: now(),
      updatedAt: now(),
    }

    this.environments.set(env.id, env)
  }

  // ============================================
  // ENVIRONMENT MANAGEMENT
  // ============================================

  getEnvironment(envId: string): DigitalEnvironment | undefined {
    return this.environments.get(envId)
  }

  getMainEnvironment(): DigitalEnvironment {
    return this.environments.get('main')!
  }

  createEnvironment(config: Partial<DigitalEnvironment>): DigitalEnvironment {
    const env: DigitalEnvironment = {
      id: uid(),
      name: config.name || 'New Environment',
      description: config.description || '',
      layers: config.layers || [],
      sharedSpaces: config.sharedSpaces || [],
      agentPresences: new Map(),
      signalPropagation: config.signalPropagation || this.getMainEnvironment().signalPropagation,
      accessControl: config.accessControl || this.getMainEnvironment().accessControl,
      agentPresences: new Map(),
      metrics: {
        activeAgents: 0,
        totalAgents: 0,
        signalsPerHour: 0,
        spacesActive: 0,
        concurrentEdits: 0,
        crossLayerInteractions: 0,
        stigmergicEfficiency: 0,
        signalToNoiseRatio: 0,
        averageResponseTime: 0,
        agentSatisfaction: 0,
        newAgentsPerWeek: 0,
        retentionRate: 0,
      },
      createdAt: now(),
      updatedAt: now(),
    }

    this.environments.set(env.id, env)
    return env
  }

  // ============================================
  // AGENT PRESENCE
  // ============================================

  registerAgentPresence(agentId: string, envId: string = 'main'): AgentPresence {
    const env = this.environments.get(envId)
    if (!env) throw new Error('Environment not found')

    const presence: AgentPresence = {
      agentId,
      currentLayer: 'resource_registry',
      status: 'active',
      lastActiveAt: now(),
      signalSensitivity: new Map([
        ['tracing', 0.8],
        ['alarm', 0.9],
        ['priming', 0.6],
        ['free', 0.5],
      ]),
      followingSignals: [],
      followingSpaces: [],
      emittedSignals: [],
      uiState: {
        viewport: { x: 0, y: 0, zoom: 1 },
        openPanels: [],
        activeTools: [],
        notifications: [],
        preferences: {
          theme: 'system',
          language: 'es',
          compactMode: false,
          reducedMotion: false,
          signalVisibility: new Map([
            ['tracing', true],
            ['alarm', true],
            ['priming', true],
            ['free', true],
          ]),
          notificationSettings: {
            signalReceived: true,
            mention: true,
            invitation: true,
            alert: true,
            governance: true,
            email: false,
            push: true,
          },
        },
      }

    env.agentPresences.set(agentId, presence)
    env.metrics.totalAgents++
    env.metrics.activeAgents++
    return presence
  }

  updateAgentPresence(agentId: string, updates: Partial<AgentPresence>, envId: string = 'main'): AgentPresence | null {
    const env = this.environments.get(envId)
    if (!env) return null

    const presence = env.agentPresences.get(agentId)
    if (!presence) return null

    Object.assign(presence, updates)
    presence.lastActiveAt = now()
    return presence
  }

  setAgentLayer(agentId: string, layerId: string, envId: string = 'main'): boolean {
    const env = this.environments.get(envId)
    if (!env) return false

    const presence = env.agentPresences.get(agentId)
    if (!presence) return false

    const layer = env.layers.find(l => l.id === layerId)
    if (!layer) return false

    // Check access
    if (!this.checkLayerAccess(layer, agentId)) return false

    presence.currentLayer = layerId
    presence.lastActiveAt = now()
    return true
  }

  private checkLayerAccess(layer: EnvironmentLayer, agentId: string): boolean {
    switch (layer.accessPolicy) {
      case 'open':
        return true
      case 'affiliates':
        return true // would check affiliate status
      case 'core_group':
        return true // would check core group membership
      case 'custodian':
        return true // would check custodianship
      default:
        return false
    }
  }

  // ============================================
  // SHARED SPACES (Collaborative)
  // ============================================

  createSharedSpace(
    envId: string,
    config: Omit<SharedSpace, 'id' | 'participants' | 'state' | 'signals'>
  ): SharedSpace {
    const env = this.environments.get(envId)
    if (!env) throw new Error('Environment not found')

    const space: SharedSpace = {
      ...config,
      id: uid(),
      participants: new Map(),
      state: {
        data: {},
        version: 0,
        lastModified: now(),
        modifiedBy: 'system',
        crdtType: 'yjs',
        crdtDocId: uid(),
      },
      signals: [],
    }

    env.sharedSpaces.push(space)
    return space
  }

  joinSpace(spaceId: string, agentId: string, role: SpaceParticipant['role'] = 'editor', envId: string = 'main'): boolean {
    const env = this.environments.get(envId)
    if (!env) return false

    const space = env.sharedSpaces.find(s => s.id === spaceId)
    if (!space) return false

    const presence = env.agentPresences.get(agentId)
    if (!presence) return false

    space.participants.set(agentId, {
      agentId,
      role,
      joinedAt: now(),
      lastActiveAt: now(),
    })

    presence.followingSpaces.push(spaceId)
    presence.currentSpace = spaceId
    return true
  }

  leaveSpace(spaceId: string, agentId: string, envId: string = 'main'): boolean {
    const env = this.environments.get(envId)
    if (!env) return false

    const space = env.sharedSpaces.find(s => s.id === spaceId)
    if (!space) return false

    space.participants.delete(agentId)

    const presence = env.agentPresences.get(agentId)
    if (presence) {
      presence.followingSpaces = presence.followingSpaces.filter(s => s !== spaceId)
      if (presence.currentSpace === spaceId) presence.currentSpace = undefined
    }

    return true
  }

  // ============================================
  // STIGMERGIC SIGNAL INTEGRATION
  // ============================================

  emitEnvironmentSignal(
    emitterId: string,
    type: string,
    payload: any,
    location: { layerId: string; spaceId?: string },
    options: any = {}
  ): any {
    const env = this.environments.get('main')
    if (!env) throw new Error('Main environment not found')

    // Emit via stigmergic engine
    if (this.stigmergicEngine) {
      return this.stigmergicEngine.emitSignal(emitterId, type as any, payload, {
        type: location.spaceId ? 'venture' : 'network',
        ventureId: location.spaceId ? undefined : 'main',
        layer: 'digital',
      }, options)
    }

    // Fallback: create local signal
    return { id: uid(), type, emitterId, payload, location, timestamp: now() }
  }

  // ============================================
  // SIGNAL DISCOVERY & FILTERING
  // ============================================

  discoverSignalsForAgent(agentId: string, envId: string = 'main'): any[] {
    const env = this.environments.get(envId)
    if (!env) return []

    const presence = env.agentPresences.get(agentId)
    if (!presence) return []

    const sensitivity = presence.signalSensitivity
    const signals: any[] = []

    // Would query stigmergic engine for signals in agent's current layer/space
    // Filter by sensitivity, relevance, agent-controlled filters

    return signals
  }

  // ============================================
  // METRICS
  // ============================================

  updateMetrics(envId: string = 'main'): EnvironmentMetrics {
    const env = this.environments.get(envId)
    if (!env) throw new Error('Environment not found')

    const activeAgents = Array.from(env.agentPresences.values()).filter(p => p.status === 'active').length
    const totalAgents = env.agentPresences.size

    env.metrics = {
      activeAgents,
      totalAgents,
      signalsPerHour: 0, // would calculate
      spacesActive: env.sharedSpaces.filter(s => s.participants.size > 0).length,
      concurrentEdits: 0,
      crossLayerInteractions: 0,
      stigmergicEfficiency: 0,
      signalToNoiseRatio: 0,
      averageResponseTime: 0,
      agentSatisfaction: 0,
      newAgentsPerWeek: 0,
      retentionRate: 0,
    }

    return env.metrics
  }

  // ============================================
  // QUERIES
  // ============================================

  getEnvironmentById(envId: string): DigitalEnvironment | undefined {
    return this.environments.get(envId)
  }

  getAllEnvironments(): DigitalEnvironment[] {
    return Array.from(this.environments.values())
  }

  getAgentPresence(agentId: string, envId: string = 'main'): AgentPresence | undefined {
    return this.environments.get(envId)?.agentPresences.get(agentId)
  }

  getSharedSpace(spaceId: string, envId: string = 'main'): SharedSpace | undefined {
    return this.environments.get(envId)?.sharedSpaces.find(s => s.id === spaceId)
  }

  getLayer(layerId: string, envId: string = 'main'): EnvironmentLayer | undefined {
    return this.environments.get(envId)?.layers.find(l => l.id === layerId)
  }
}

// ============================================
// EXPORTS
// ============================================

export const digitalEnvironmentEngine = new DigitalEnvironmentEngine()