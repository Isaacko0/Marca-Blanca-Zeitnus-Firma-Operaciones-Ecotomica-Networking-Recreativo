// HSCSG v15 OS — Network Openness (OVN 3.0: D43 - Open Network, Bitcoin-style Minimal Identity)
// Capa 1: Propósito/Límites — "It is the network that is open" not agents
// D59: Identity = Access (not Control), D9: Universal Access = Incondicional

import type { NRPAffiliate, NRPVenture, NRPResource, AccessCredential } from '@core/lib/digitalIdentitySystem'
import { uid, now } from '@core/lib/utils'

// ============================================
// NETWORK OPENNESS TYPES
// ============================================

export interface NetworkOpennessConfig {
  // Core principle: Network is open, agents can be anonymous
  networkOpen: boolean
  // Bitcoin-style: minimal information for participation
  minimalIdentity: boolean
  // Permissionless entry
  permissionlessEntry: boolean
  // Anonymous participation allowed
  anonymousParticipation: boolean
  // Access = credentials from contributions (D60)
  credentialBasedAccess: boolean
  // No gatekeeping by identity
  noIdentityGatekeeping: boolean
  // Universal access to necessities (D9)
  universalAccess: UniversalAccessConfig
  // Boundaries (what is NOT open)
  boundaries: OpennessBoundary[]
}

export interface UniversalAccessConfig {
  // D9: Access Universal = Incondicional (Derecho ≠ Contribución)
  enabled: boolean
  // Necessities guaranteed regardless of contribution
  guaranteedNeeds: GuaranteedNeed[]
  // No contribution requirement for basic access
  noContributionRequirement: boolean
  // Emergency access protocol
  emergencyAccess: EmergencyAccessConfig
}

export interface GuaranteedNeed {
  needType: 'water' | 'energy' | 'food' | 'shelter' | 'health' | 'knowledge' | 'tools' | 'social'
  description: string
  minimumLevel: string
  provisionMethod: 'direct' | 'credits' | 'community_pool' | 'custodian_managed'
  fundingSource: 'regeneration_fund' | 'care_work_pool' | 'community_reserve' | 'external_aid'
}

export interface EmergencyAccessConfig {
  enabled: boolean
  triggerConditions: string[]
  accessLevel: 'full' | 'basic_needs_only' | 'communication_only'
  duration: number // hours
  autoRevoke: boolean
  reviewRequired: boolean
}

export interface OpennessBoundary {
  id: string
  name: string
  description: string
  // What is restricted
  restrictionType: 'governance' | 'custodianship' | 'resource_dangerous' | 'legal_compliance' | 'immune_rights' | 'custom'
  // Who can access
  accessCondition: string
  // Enforcement
  enforcement: 'automated' | 'governance' | 'custodian' | 'social'
  // Transparency
  transparent: boolean
  auditTrail: boolean
}

// ============================================
// ACCESS MODEL (Bitcoin-style)
// ============================================

export interface AccessModel {
  // Bitcoin-style: no identity needed, just proof of work/stake
  type: 'bitcoin_style' | 'credential_based' | 'hybrid' | 'custom'
  // For bitcoin_style: proof of contribution (work) = access
  proofOfContribution: ProofOfContributionConfig
  // For credential_based: VCs from contributions
  credentialBased: CredentialBasedConfig
  // No KYC/AML for network participation
  noKYCForParticipation: boolean
  // Pseudonymous by default
  pseudonymousByDefault: boolean
}

export interface ProofOfContributionConfig {
  // Contribution hours = access credits
  enabled: boolean
  // Minimum hours for basic access
  minimumHours: number
  // Access tier based on contribution
  accessTiers: AccessTier[]
  // Verification
  verification: 'automated' | 'peer_review' | 'custodian' | 'smart_contract'
}

export interface AccessTier {
  name: string
  minimumHours: number
  minimumReputation: Record<string, number> // dimension -> threshold
  grantsAccessTo: string[] // resource types, governance, etc.
  duration: number // days
  renewable: boolean
}

export interface CredentialBasedConfig {
  // D60: Credentials auto-constructed from contributions
  enabled: boolean
  // Credential types that grant access
  credentialTypes: AccessCredential['type'][]
  // ZK-proof verification
  zkProofVerification: boolean
  // Portable across networks
  portableCredentials: boolean
}

// ============================================
// NETWORK OPENNESS ENGINE
// ============================================

export class NetworkOpennessEngine {
  private config: NetworkOpennessConfig
  private accessModel: AccessModel
  private universalAccess: UniversalAccessConfig
  private accessTiers: AccessTier[]
  private universalNeeds: Map<string, GuaranteedNeed>

  constructor(config?: Partial<NetworkOpennessConfig>) {
    this.config = {
      networkOpen: config?.networkOpen ?? true,
      minimalIdentity: config?.minimalIdentity ?? true,
      permissionlessEntry: config?.permissionlessEntry ?? true,
      anonymousParticipation: config?.anonymousParticipation ?? true,
      credentialBasedAccess: config?.credentialBasedAccess ?? true,
      noIdentityGatekeeping: config?.noIdentityGatekeeping ?? true,
      universalAccess: config?.universalAccess ?? this.createDefaultUniversalAccess(),
      boundaries: config?.boundaries ?? this.createDefaultBoundaries(),
    }
    this.accessModel = this.createDefaultAccessModel()
    this.universalAccess = this.config.universalAccess
    this.accessTiers = this.createDefaultAccessTiers()
    this.universalNeeds = new Map()
    this.initializeUniversalNeeds()
  }

  private createDefaultUniversalAccess(): UniversalAccessConfig {
    return {
      enabled: true,
      guaranteedNeeds: [
        { needType: 'water', description: 'Clean drinking water', minimumLevel: '50L/person/day', provisionMethod: 'community_pool', fundingSource: 'regeneration_fund' },
        { needType: 'energy', description: 'Electricity for basic needs', minimumLevel: '2kWh/person/day', provisionMethod: 'community_pool', fundingSource: 'regeneration_fund' },
        { needType: 'food', description: 'Nutritious food', minimumLevel: '2000kcal/person/day', provisionMethod: 'community_pool', fundingSource: 'care_work_pool' },
        { needType: 'shelter', description: 'Safe housing', minimumLevel: '10m2/person', provisionMethod: 'custodian_managed', fundingSource: 'community_reserve' },
        { needType: 'health', description: 'Basic healthcare', minimumLevel: 'primary_care', provisionMethod: 'community_pool', fundingSource: 'care_work_pool' },
        { needType: 'knowledge', description: 'Education and information', minimumLevel: 'literacy_and_internet', provisionMethod: 'direct', fundingSource: 'regeneration_fund' },
        { needType: 'tools', description: 'Tools for production', minimumLevel: 'basic_toolkit', provisionMethod: 'community_pool', fundingSource: 'regeneration_fund' },
        { needType: 'social', description: 'Community belonging', minimumLevel: 'participation_rights', provisionMethod: 'direct', fundingSource: 'care_work_pool' },
      ],
      noContributionRequirement: true,
      emergencyAccess: {
        enabled: true,
        triggerConditions: ['displacement', 'disaster', 'health_emergency', 'persecution'],
        accessLevel: 'full',
        duration: 72,
        autoRevoke: false,
        reviewRequired: true,
      },
    }
  }

  private createDefaultBoundaries(): OpennessBoundary[] {
    return [
      {
        id: 'governance_core',
        name: 'Core Governance Decisions',
        description: 'Decisions affecting purpose, immune rights, boundaries',
        restrictionType: 'governance',
        accessCondition: 'core_group_member AND conviction_voting_threshold',
        enforcement: 'governance',
        transparent: true,
        auditTrail: true,
      },
      {
        id: 'custodianship',
        name: 'Custodial Functions',
        description: 'Legal representation, asset custody, arbitration',
        restrictionType: 'custodianship',
        accessCondition: 'custodian_credential_valid',
        enforcement: 'custodian',
        transparent: true,
        auditTrail: true,
      },
      {
        id: 'dangerous_resources',
        name: 'Dangerous Materials/Tools',
        description: 'Materials requiring safety training',
        restrictionType: 'resource_dangerous',
        accessCondition: 'safety_credential_valid',
        enforcement: 'automated',
        transparent: true,
        auditTrail: true,
      },
      {
        id: 'immune_rights',
        name: 'Immune Rights Protection',
        description: 'Actions violating non-derogable rights',
        restrictionType: 'immune_rights',
        accessCondition: 'never',
        enforcement: 'automated',
        transparent: true,
        auditTrail: true,
      },
    ]
  }

  private createDefaultAccessModel(): AccessModel {
    return {
      type: 'bitcoin_style',
      minimalIdentity: true,
      proofOfContribution: {
        enabled: true,
        minimumHours: 1,
        accessTiers: [],
        verification: 'automated',
      },
      credentialBased: {
        enabled: true,
        credentialTypes: ['resource_access', 'governance_participation', 'benefit_redistribution', 'custodianship'],
        zkProofVerification: true,
        portableCredentials: true,
      },
      noKYCForParticipation: true,
      pseudonymousByDefault: true,
    }
  }

  private createDefaultAccessTiers(): AccessTier[] {
    return [
      {
        name: 'Visitor',
        minimumHours: 0,
        minimumReputation: {},
        grantsAccessTo: ['public_information', 'network_observation'],
        duration: 7,
        renewable: true,
      },
      {
        name: 'Participant',
        minimumHours: 10,
        minimumReputation: { commitment: 0.2 },
        grantsAccessTo: ['resource_booking', 'contribution_logging', 'basic_governance'],
        duration: 30,
        renewable: true,
      },
      {
        name: 'Contributor',
        minimumHours: 50,
        minimumReputation: { quality: 0.3, commitment: 0.3, regularity: 0.3 },
        grantsAccessTo: ['governance_voting', 'resource_custodianship', 'benefit_redistribution'],
        duration: 90,
        renewable: true,
      },
      {
        name: 'Core Member',
        minimumHours: 200,
        minimumReputation: { quality: 0.5, commitment: 0.5, regularity: 0.5, collaboration: 0.4 },
        grantsAccessTo: ['core_governance', 'custodian_eligibility', 'network_representation'],
        duration: 180,
        renewable: true,
      },
    ]
  }

  private initializeUniversalNeeds(): void {
    for (const need of this.config.universalAccess.guaranteedNeeds) {
      this.universalNeeds.set(need.needType, need)
    }
  }

  // ============================================
  // NETWORK ENTRY
  // ============================================

  /**
   * Anyone can join the network (permissionless)
   * Bitcoin-style: minimal information, no KYC for participation
   */
  joinNetwork(agentId: string, profile?: { displayName?: string; pseudonymous?: boolean }): NetworkEntryResult {
    if (!this.config.permissionlessEntry) {
      return { success: false, reason: 'Network entry not permissionless' }
    }

    // No identity verification required
    // Agent gets pseudonymous ID
    const pseudonym = profile?.pseudonymous !== false // default true

    return {
      success: true,
      agentId,
      pseudonym,
      accessLevel: 'visitor',
      message: 'Welcome to the open network. No identity required. Access through contribution.',
    }
  }

  // ============================================
  // UNIVERSAL ACCESS (D9)
  // ============================================

  /**
   * Guarantees access to necessities regardless of contribution
   * D9: "Acceso Universal = Incondicional (Derecho ≠ Contribución)"
   */
  requestUniversalAccess(agentId: string, needType: string): UniversalAccessResult {
    if (!this.config.universalAccess.enabled) {
      return { granted: false, reason: 'Universal access not enabled' }
    }

    const need = this.universalNeeds.get(needType)
    if (!need) {
      return { granted: false, reason: `Need type not recognized: ${needType}` }
    }

    // No contribution requirement check
    if (this.config.universalAccess.noContributionRequirement) {
      return {
        granted: true,
        needType,
        provisionMethod: need.provisionMethod,
        minimumLevel: need.minimumLevel,
        message: 'Access granted unconditionally. This is your right, not earned through contribution.',
      }
    }

    return { granted: false, reason: 'Contribution requirement active (should not happen)' }
  }

  /**
   * Emergency access protocol
   */
  requestEmergencyAccess(agentId: string, trigger: string): EmergencyAccessResult {
    const emergency = this.config.universalAccess.emergencyAccess

    if (!emergency.enabled) {
      return { granted: false, reason: 'Emergency access not enabled' }
    }

    if (!emergency.triggerConditions.includes(trigger)) {
      return { granted: false, reason: `Trigger not recognized: ${trigger}` }
    }

    return {
      granted: true,
      accessLevel: emergency.accessLevel,
      duration: emergency.duration,
      autoRevoke: emergency.autoRevoke,
      reviewRequired: emergency.reviewRequired,
      message: `Emergency access granted for: ${trigger}. Duration: ${emergency.duration}h.`,
    }
  }

  // ============================================
  // ACCESS TIERS (Contribution-based)
  // ============================================

  /**
   * Evaluates agent's access tier based on contribution hours and reputation
   * Not required for universal access, but for governance/custodianship
   */
  evaluateAccessTier(agent: { contributionHours: number; reputation: Record<string, number> }): AccessTierResult {
    let highestTier: AccessTier | null = null

    for (const tier of this.accessTiers) {
      if (agent.contributionHours >= tier.minimumHours) {
        let reputationOk = true
        for (const [dimension, threshold] of Object.entries(tier.minimumReputation)) {
          if ((agent.reputation[dimension] || 0) < threshold) {
            reputationOk = false
            break
          }
        }
        if (reputationOk) {
          highestTier = tier
        }
      }

    return {
      tier: highestTier?.name || 'Visitor',
      grantsAccessTo: highestTier?.grantsAccessTo || ['public_information'],
      duration: highestTier?.duration || 7,
      renewable: highestTier?.renewable ?? true,
    }
  }

  // ============================================
  // CREDENTIAL-BASED ACCESS (D60)
  // ============================================

  /**
   * Checks if agent has valid credential for resource access
   * Credentials auto-constructed from contributions (D60)
   */
  checkCredentialAccess(agentCredentials: AccessCredential[], resourceId: string, requiredScope: AccessCredential['scope']): CredentialCheckResult {
    const matchingCredentials = agentCredentials.filter(c =>
      c.resourceId === resourceId &&
      this.scopeMeetsRequirement(c.scope, requiredScope) &&
      (!c.expiresAt || c.expiresAt > now())
    )

    if (matchingCredentials.length === 0) {
      return { allowed: false, reason: 'No valid credential for this resource/scope' }
    }

    // Verify ZK-proof if available
    for (const cred of matchingCredentials) {
      if (cred.zkProof) {
        // Would verify ZK-proof
      }
    }

    return { allowed: true, credential: matchingCredentials[0] }
  }

  private scopeMeetsRequirement(actual: AccessCredential['scope'], required: AccessCredential['scope']): boolean {
    const hierarchy = { read: 1, write: 2, admin: 3, custodian: 4 }
    return hierarchy[actual] >= hierarchy[required]
  }

  // ============================================
  // BOUNDARIES (What is NOT open)
  // ============================================

  /**
   * Checks if an action crosses openness boundaries
   */
  checkBoundary(action: string, agent: { credentials: AccessCredential[]; coreGroupMember: boolean }): BoundaryCheckResult {
    for (const boundary of this.config.boundaries) {
      // Evaluate access condition
      const allowed = this.evaluateAccessCondition(boundary.accessCondition, agent)

      if (!allowed && boundary.restrictionType !== 'immune_rights') {
        return {
          allowed: false,
          boundary: boundary.id,
          reason: `Access restricted: ${boundary.name}. ${boundary.description}`,
          enforcement: boundary.enforcement,
        }
      }

      // Immune rights are never allowed to be crossed
      if (boundary.restrictionType === 'immune_rights') {
        return {
          allowed: false,
          boundary: boundary.id,
          reason: `Immune right violation: ${boundary.name}. This action can never be permitted.`,
          enforcement: 'automated',
        }
      }
    }

    return { allowed: true, reason: 'No boundaries crossed' }
  }

  private evaluateAccessCondition(condition: string, agent: any): boolean {
    // Simplified condition evaluation
    if (condition === 'core_group_member AND conviction_voting_threshold') {
      return agent.coreGroupMember
    }
    if (condition === 'custodian_credential_valid') {
      return agent.credentials.some(c => c.type === 'custodianship' && (!c.expiresAt || c.expiresAt > now()))
    }
    if (condition === 'safety_credential_valid') {
      return agent.credentials.some(c => c.type === 'resource_access' && c.scope === 'admin')
    }
    if (condition === 'never') return false
    return true
  }

  // ============================================
  // QUERIES
  // ============================================

  getConfig(): NetworkOpennessConfig {
    return { ...this.config }
  }

  getAccessModel(): AccessModel {
    return { ...this.accessModel }
  }

  getUniversalAccessConfig(): UniversalAccessConfig {
    return { ...this.config.universalAccess }
  }

  getAccessTiers(): AccessTier[] {
    return [...this.accessTiers]
  }

  getBoundaries(): OpennessBoundary[] {
    return [...this.config.boundaries]
  }

  getGuaranteedNeed(needType: string): GuaranteedNeed | undefined {
    return this.universalNeeds.get(needType)
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  updateConfig(updates: Partial<NetworkOpennessConfig>): void {
    // Protect core principles
    const protectedFields = ['networkOpen', 'minimalIdentity', 'permissionlessEntry', 'anonymousParticipation', 'noIdentityGatekeeping']
    const allowedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => !protectedFields.includes(k))
    )
    Object.assign(this.config, allowedUpdates)
  }

  addBoundary(boundary: OpennessBoundary): void {
    this.config.boundaries.push(boundary)
  }

  removeBoundary(boundaryId: string): boolean {
    const index = this.config.boundaries.findIndex(b => b.id === boundaryId)
    if (index === -1) return false
    this.config.boundaries.splice(index, 1)
    return true
  }

  addGuaranteedNeed(need: GuaranteedNeed): void {
    this.config.universalAccess.guaranteedNeeds.push(need)
    this.universalNeeds.set(need.needType, need)
  }
}

// ============================================
// SUPPORTING TYPES
// ============================================

export interface NetworkEntryResult {
  success: boolean
  agentId?: string
  pseudonym?: boolean
  accessLevel?: string
  reason?: string
  message?: string
}

export interface UniversalAccessResult {
  granted: boolean
  needType?: string
  provisionMethod?: string
  minimumLevel?: string
  reason?: string
  message?: string
}

export interface EmergencyAccessResult {
  granted: boolean
  accessLevel?: string
  duration?: number
  autoRevoke?: boolean
  reviewRequired?: boolean
  reason?: string
  message?: string
}

export interface AccessTierResult {
  tier: string
  grantsAccessTo: string[]
  duration: number
  renewable: boolean
}

export interface CredentialCheckResult {
  allowed: boolean
  credential?: AccessCredential
  reason?: string
}

export interface BoundaryCheckResult {
  allowed: boolean
  boundary?: string
  reason?: string
  enforcement?: string
}

// ============================================
// EXPORTS
// ============================================

export const networkOpennessEngine = new NetworkOpennessEngine()