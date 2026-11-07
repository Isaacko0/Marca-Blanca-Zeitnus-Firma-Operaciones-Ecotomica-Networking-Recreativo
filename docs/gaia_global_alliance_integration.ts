// HSCSG v15 OS — GI3CF Integration: Marco de Alianza Global de Impacto, Innovación y Abundancia v1.2
// Integración arquitectónica con HSCSG/Zeitnus - Capa 2 Gobernanza/Conocimiento + Capa 5 Economía Transicional
// Principio Anfibio: valueDual.ts + nodeMode/priceParity — misma lógica postmonetario (ZNU/CaaS) o conectado (USD/USDC via oracle)

import type { PurposeBasedOrganization } from '@core/lib/purposeBasedOrg'
import type { NetworkOpennessConfig, AccessTier } from '@core/lib/networkOpenness'
import type { DigitalEnvironment, AgentPresence } from '@core/lib/digitalEnvironment'
import type { PropagationModel, InitiationRitual, GenerativeHandshake, MitosisProtocol } from '@core/lib/propagationModels'

// ============================================
// MAPEO GI3CF → HSCSG/ZEITNUS
// ============================================

/**
 * MAPEO DE CAPAS: GI3CF → ARQUITECTURA 5 CAPAS ZEITNUS
 * 
 * GI3CF Componentes          → Zeitnus Capa
 * ─────────────────────────────────────────────────────────────
 * Gaia Network               → Capa 2: Gobernanza/Conocimiento (tejido relacional)
 * Gaia Alliance Network Agency → Capa 3: Operación Productiva (capacidad profesional)
 * Gaia OS / Digital Layer    → Capa 4: Infraestructura Metabólica (infraestructura conectiva)
 * Gaia Commons               → Capa 1: Autonomía/Regeneración/Continuidad (custodia bienes comunes)
 * Gaia Global Alliance Fund  → Capa 5: Economía Transicional (circulación recursos)
 * Gaia Impact & Innovation Hub → Capa 3: Operación Productiva (desarrollo iniciativas)
 * Gaia Market                → Capa 5: Economía Transicional (intercambio)
 * Gaia Academy               → Capa 2: Gobernanza/Conocimiento (aprendizaje)
 * Gaia EcoHabitats Network   → Capa 1: Autonomía/Regeneración (materialización territorial)
 * Gaia BioHubs               → Capa 4: Infraestructura Metabólica (centros conexión)
 * Gaia BioSchools/Studios/Labs → Capa 4: Infraestructura Metabólica (Living Labs)
 * Gaia Dashboards & Passport → Capa 2: Gobernanza/Conocimiento (identidad/trayectoria)
 * 
 * GI3CF 5 Funciones          → Implementación HSCSG
 * ─────────────────────────────────────────────────────────────
 * Taxonomía (7×16)           → Tipos en @core/state/types.ts + registrySystem.ts
 * Impacto (GI3)              → Métricas en integral.ts + alrac.ts + PVSO
 * Evidencia (E0-E4, Trust Tiers) → boundaries.ts + governanceTriad.ts + whatmatters.ts
 * Reconocimiento (Passport/Badges) → brandDNA.ts + brandCollateral.ts + sovereignty.ts
 * Retribuciones (CoRe/Commonomics) → valueFlowsIntegration.ts + caas.ts + whatmatters.ts
 */

// ============================================
// TIPOS DE INTEGRACIÓN
// ============================================

export interface GI3CFIntegrationConfig {
  // Mapeo de taxonomía Gaia (7×16) a categorías HSCSG
  taxonomyMapping: TaxonomyMapping[]
  // Configuración GI3 para nodos HSCSG
  gi3NodeConfig: GI3NodeConfig
  // Integración Trust Tiers con sistema de credenciales HSCSG
  trustTiersIntegration: TrustTiersIntegration
  // CoRe/Commonomics con ValueFlows + CaaS + WhatMatters
  coreCommonomicsIntegration: CoreCommonomicsIntegration
  // Gaia OS / Digital Layer con Digital Environment HSCSG
  digitalLayerIntegration: DigitalLayerIntegration
  // Principios fundamentales Gaia → Leyes MJ / HSCSG
  principlesMapping: PrinciplesMapping[]
}

export interface TaxonomyMapping {
  gaiaCategory: string // D1-D7
  gaiaSubcategory: string // 1.1-7.2
  hscsgModule: string // Módulo HSCSG correspondiente
  hscsgTalent: string // Talento HSCSG (food, aqua, energy, micro, hydro, repair, sensor, bio, health, tele, mesh, quant, zcs, fondo, onto, ethical, rao)
  hscsgVector: 'ALIM' | 'ENER' | 'SALU' | 'HABI' | 'PROD' | 'COMU' | 'REDES' | 'FINA' | 'TRANSVERSAL'
}

export interface GI3NodeConfig {
  // Cada nodo HSCSG puede calcular su GI3
  enabled: boolean
  // Pesos GI3 (pilotaje) - pueden variar por tipo de nodo
  weights: {
    I: number // Impacto y resultados (default 0.50)
    Q: number // Calidad, coherencia, integridad (default 0.25)
    V: number // Verificación y evidencia (default 0.15)
    C: number // Contribución y colaboración en red (default 0.10)
  }
  // Umbral mínimo de cobertura para publicación
  minCoverageThreshold: number // default: 0.7 (70%)
  // Targets aplicables por defecto según tipo de nodo
  defaultTargetsByNodeType: Record<string, string[]> // nodeType -> target IDs (T01-T16)
}

export interface TrustTiersIntegration {
  // Mapeo Trust Tiers Gaia → Sistema credenciales HSCSG (VC System + ZK Proofs)
  tierMapping: TrustTierMapping[]
  // Verificación proporcional según riesgo/escala
  proportionalVerification: ProportionalVerificationConfig
  // Integración con Gaia Passport → brandDNA + brandCollateral + sovereignty
  passportIntegration: PassportIntegrationConfig
}

export interface TrustTierMapping {
  gaiaTier: 1 | 2 | 3 | 4
  gaiaName: string
  hscsgEquivalent: string // ej: 'VC System (Self-Attested)', 'VC System (Community Attested)', 'ZK Proof + Ambassador Verified', 'Third-Party Certified (Kleros)'
  verificationMethod: 'self_attestation' | 'peer_review' | 'ambassador_verified' | 'third_party_certified'
  evidenceLevels: ('E0' | 'E1' | 'E2' | 'E3' | 'E4')[]
}

export interface ProportionalVerificationConfig {
  // Rigor proporcional a impacto, riesgo, escala, afirmaciones y uso previsto
  factors: {
    impactScale: number // 0-1
    riskLevel: number // 0-1
    claimScope: number // 0-1
    intendedUse: number // 0-1
  }
  minimumTierByRisk: Record<string, 1 | 2 | 3 | 4>
}

export interface PassportIntegrationConfig {
  // Gaia Passport ↔ HSCSG Identity System
  identityMapping: {
    gaiaProfile: string // → digitalIdentitySystem.ts AgentProfile
    credentials: string // → vcSystem.ts VerifiableCredential
    verifications: string // → zkProofSystem.ts ZKProof
    badges: string // → brandCollateral.ts Asset (badge type)
    endorsements: string // → trustlines.ts Trustline / governanceTriad.ts Triad validation
    contributions: string // → valueFlowsIntegration.ts ValueFlow
    trajectory: string // → sovereignty.ts + integral.ts pattern score
  }
  visasIntegration: {
    // Visas descentralizadas = derechos comunitarios/acceso acordados localmente
    // → networkOpenness.ts UniversalAccess + accessControlSystem.ts
    localAccessRights: boolean
    communityGovernance: boolean
    notStateDocuments: boolean // NO sustituyen docs identidad/permisos migratorios estatales
  }
}

export interface CoreCommonomicsIntegration {
  // CoRe (Colaboración, Contribución, Compensación) ↔ ValueFlows + CaaS + WhatMatters
  coreRecording: {
    timeTasks: string // → contributionLogs.ts + tekitl.ts volunteer hours
    knowledgeContributions: string // → credentialSystem.ts auto-constructed from contributions
    resourceExchanges: string // → valueFlowsIntegration.ts ValueFlow (LaborFlow, ResourceFlow, etc.)
    compensationAgreements: string // → whatmatters.ts Obligation + caas.ts payouts
    multicapitalLedger: string // → integral.ts credits + sovereignty.ts pattern score + alrac.ts RAO
  }
  // Commonomics: intercambio económico fortalece infraestructura común
  commonomicsFlows: {
    gaiaMarketPortionToCommons: number // % acordado de transacciones → Tesoro de los Comunes
    operationalSurplusToMainFund: number // % excedentes operativos → Fondo Principal Gaia
    transparentRules: boolean // reglas aprobadas y transparentes
    validatedCommercially: boolean // validado comercial, financiera y jurídicamente
  }
  // 9 Capitales Operativos ↔ HSCSG Value Types
  capitalMapping: CapitalMapping[]
}

export interface CapitalMapping {
  gaiaCapital: string // Uno de los 9 capitales operativos
  hscsgValueType: string // TQ, ZNU, USDC, CARE, REP_*, CAAS, CERT_*, etc.
  hscsgModule: string // Módulo HSCSG que registra este capital
  currentSeeEquivalent?: string // currentSeeSystem.ts equivalent
}

export interface DigitalLayerIntegration {
  // Gaia OS / Digital Layer ↔ Digital Environment HSCSG + P2P Infrastructure
  gaiaHub: {
    // MetaPlataforma ↔ digitalEnvironment.ts layers + p2pInfrastructureStack.ts
    metaPlatformLayers: string[] // resource_registry, venture_space, governance_forum, learning_space, social_space
    orchestration: string // → stigmergicCoordination.ts + signalDesign.ts
    interoperability: boolean // API-first connectors
  }
  components: DigitalComponentIntegration[]
}

export interface DigitalComponentIntegration {
  gaiaComponent: string
  hscsgEquivalent: string
  integrationNotes: string
}

export interface PrinciplesMapping {
  gaiaPrinciple: string
  hscsgEquivalent: string // Ley MJ / Principio HSCSG / Capa Zeitnus
  implementationNotes: string
}

// ============================================
// MAPEOS CONCRETOS
// ============================================

export const TAXONOMY_MAPPING_GAIA_TO_HSCSG: TaxonomyMapping[] = [
  // D1: Salud y Bienestar → Vector ALIM + SALU
  { gaiaCategory: 'D1', gaiaSubcategory: '1.1 Medicine & Nutrition', hscsgModule: 'talent:food + talent:aqua + talent:health', hscsgTalent: 'food', hscsgVector: 'ALIM' },
  { gaiaCategory: 'D1', gaiaSubcategory: '1.2 Sports, Exercise & Manual Therapy', hscsgModule: 'talent:health + talent:bio', hscsgTalent: 'health', hscsgVector: 'SALU' },
  { gaiaCategory: 'D1', gaiaSubcategory: '1.3 Psycho-Emotional Health & Self development', hscsgModule: 'talent:health + talent:tele', hscsgTalent: 'health', hscsgVector: 'SALU' },
  
  // D2: Artes y Actividades Recreativas → Vector PROD + TRANSVERSAL
  { gaiaCategory: 'D2', gaiaSubcategory: '2.1 Art & Crafts', hscsgModule: 'talent:bio + talent:repair', hscsgTalent: 'bio', hscsgVector: 'PROD' },
  { gaiaCategory: 'D2', gaiaSubcategory: '2.2 Recreational Activities & Tourism', hscsgModule: 'talent:mesh + talent:tele', hscsgTalent: 'mesh', hscsgVector: 'COMU' },
  
  // D3: Sistemas Productivos y Finanzas → Vector PROD + FINA
  { gaiaCategory: 'D3', gaiaSubcategory: '3.1 Production & Logistics', hscsgModule: 'talent:repair + talent:sensor + talent:bio', hscsgTalent: 'repair', hscsgVector: 'PROD' },
  { gaiaCategory: 'D3', gaiaSubcategory: '3.2 Exchange & Financial Systems', hscsgModule: 'talent:zcs + talent:fondo', hscsgTalent: 'zcs', hscsgVector: 'FINA' },
  
  // D4: Gobernanza y Relaciones Humanas → Vector TRANSVERSAL
  { gaiaCategory: 'D4', gaiaSubcategory: '4.1 Governance, Political Advocacy & Justice', hscsgModule: 'talent:onto + talent:ethical + talent:rao', hscsgTalent: 'onto', hscsgVector: 'TRANSVERSAL' },
  { gaiaCategory: 'D4', gaiaSubcategory: '4.2 Social Care & Welfare', hscsgModule: 'talent:health + talent:tele', hscsgTalent: 'health', hscsgVector: 'SALU' },
  
  // D5: Información y Educación → Vector REDES + TRANSVERSAL
  { gaiaCategory: 'D5', gaiaSubcategory: '5.1 Education, Learning & Research', hscsgModule: 'talent:onto + talent:quant', hscsgTalent: 'onto', hscsgVector: 'TRANSVERSAL' },
  { gaiaCategory: 'D5', gaiaSubcategory: '5.2 Media & Communications, ICT', hscsgModule: 'talent:mesh + talent:quant', hscsgTalent: 'mesh', hscsgVector: 'REDES' },
  
  // D6: Planificación y Gestión del Hábitat → Vector HABI + ALIM + ENER
  { gaiaCategory: 'D6', gaiaSubcategory: '6.1 Infrastructure & Housing', hscsgModule: 'talent:repair + talent:energy + talent:hydro', hscsgTalent: 'repair', hscsgVector: 'HABI' },
  { gaiaCategory: 'D6', gaiaSubcategory: '6.2 Agriculture & Natural Resources', hscsgModule: 'talent:food + talent:aqua + talent:season', hscsgTalent: 'food', hscsgVector: 'ALIM' },
  { gaiaCategory: 'D6', gaiaSubcategory: '6.3 Nature Restoration & Conservation', hscsgModule: 'talent:bio + talent:season + talent:quant', hscsgTalent: 'bio', hscsgVector: 'ALIM' },
  
  // D7: Espiritualidad y Autorrealización → Vector TRANSVERSAL
  { gaiaCategory: 'D7', gaiaSubcategory: '7.1 Self-Realisation', hscsgModule: 'talent:onto + talent:ethical', hscsgTalent: 'onto', hscsgVector: 'TRANSVERSAL' },
  { gaiaCategory: 'D7', gaiaSubcategory: '7.2 Subtle Realms & Cosmic/Universal Laws', hscsgModule: 'talent:onto + talent:quant', hscsgTalent: 'quant', hscsgVector: 'TRANSVERSAL' }
]

export const GI3_NODE_CONFIG_DEFAULT: GI3NodeConfig = {
  enabled: true,
  weights: { I: 0.50, Q: 0.25, V: 0.15, C: 0.10 },
  minCoverageThreshold: 0.7,
  defaultTargetsByNodeType: {
    'Nodo-Proyecto': ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16'], // todos según actividad
    'Nodo-Comunitario': ['T01', 'T02', 'T03', 'T05', 'T09', 'T10', 'T12', 'T15'],
    'BioHabitat': ['T06', 'T12', 'T13', 'T14', 'T16'],
    'BioHub': ['T01', 'T02', 'T03', 'T04', 'T05', 'T08', 'T09', 'T10', 'T11', 'T15'],
    'Nodo Bioregional': ['T13', 'T14', 'T16'],
    'Nodo Nacional': ['T07', 'T08', 'T11'],
    'Nodo Continental': ['T07', 'T08', 'T11', 'T16'],
    'Nodo Lingüístico': ['T05', 'T10', 'T11', 'T15', 'T16'],
    'Nodo Global': ['T07', 'T08', 'T11', 'T16']
  }
}

export const TRUST_TIERS_MAPPING: TrustTierMapping[] = [
  {
    gaiaTier: 1,
    gaiaName: 'Auto-atestiguado (Self-Attested)',
    hscsgEquivalent: 'VC System (Self-Attested) + digitalIdentitySystem.ts (pseudonymous entry)',
    verificationMethod: 'self_attestation',
    evidenceLevels: ['E0', 'E1']
  },
  {
    gaiaTier: 2,
    gaiaName: 'Atestiguado por la Comunidad (Community Attested)',
    hscsgEquivalent: 'VC System (Community Attested) + stigmergicCoordination.ts (peer signals) + governanceTriad.ts (peer validation)',
    verificationMethod: 'peer_review',
    evidenceLevels: ['E1', 'E2', 'E3']
  },
  {
    gaiaTier: 3,
    gaiaName: 'Verificado por Embajador/a de Confianza Gaia (Ambassador Verified)',
    hscsgEquivalent: 'ZK Proof (zkProofSystem.ts) + Ambassador Verified credential (vcSystem.ts) + custodian arbitration (legalFramework.ts)',
    verificationMethod: 'ambassador_verified',
    evidenceLevels: ['E2', 'E3', 'E4']
  },
  {
    gaiaTier: 4,
    gaiaName: 'Certificado por Terceros (Third-Party Certified)',
    hscsgEquivalent: 'Kleros Dispute Resolution (kleros.ts) + Third-Party Certified VC + legalFramework.ts (external audit)',
    verificationMethod: 'third_party_certified',
    evidenceLevels: ['E3', 'E4']
  }
]

export const CAPITAL_MAPPING_GAIA_TO_HSCSG: CapitalMapping[] = [
  { gaiaCapital: 'Financiero', hscsgValueType: 'USDC / ZNU (anfíbico)', hscsgModule: 'caas.ts + whatmatters.ts + valueFlowsIntegration.ts', currentSeeEquivalent: 'USDC / ZNU' },
  { gaiaCapital: 'Material / Manufacturado', hscsgValueType: 'ResourceFlow (ValueFlows)', hscsgModule: 'resourceRegistry.ts + valueFlowsIntegration.ts', currentSeeEquivalent: 'Resource units' },
  { gaiaCapital: 'Natural', hscsgValueType: 'CARE / Ecological credits', hscsgModule: 'samay.ts + regen.ts + integral.ts (OAD)', currentSeeEquivalent: 'CARE' },
  { gaiaCapital: 'Humano', hscsgValueType: 'LaborFlow (hours) / REP_*', hscsgModule: 'contributionLogs.ts + tekitl.ts + valueFlowsIntegration.ts', currentSeeEquivalent: 'TQ (hours)' },
  { gaiaCapital: 'Intelectual', hscsgValueType: 'KnowledgeFlow / CERT_*', hscsgModule: 'credentialSystem.ts + integral.ts (ITC) + brandCollateral.ts', currentSeeEquivalent: 'CERT_*' },
  { gaiaCapital: 'Incidencia / Advocacy', hscsgValueType: 'GovernanceFlow / REP_gov', hscsgModule: 'governanceTriad.ts + democracia.ts + integral.ts (CDS)', currentSeeEquivalent: 'REP_gov' },
  { gaiaCapital: 'Cultural', hscsgValueType: 'CulturalFlow / REP_cult', hscsgModule: 'brandDNA.ts + storyBrand.ts + integral.ts (COS)', currentSeeEquivalent: 'REP_cult' },
  { gaiaCapital: 'Ético (incluye confianza)', hscsgValueType: 'TrustFlow / REP_trust', hscsgModule: 'trustlines.ts + symbiosky.ts + boundaries.ts + legalFramework.ts', currentSeeEquivalent: 'REP_trust' },
  { gaiaCapital: 'Energético / Espiritual', hscsgValueType: 'EnergyFlow / Spiritual credits', hscsgModule: 'samay.ts + sovereignty.ts (pilar Energy/Spirit) + integral.ts (FRS)', currentSeeEquivalent: 'ENER / Spiritual units' }
]

export const DIGITAL_COMPONENT_INTEGRATIONS: DigitalComponentIntegration[] = [
  { gaiaComponent: 'QCORE and BeHolder Navigation', hscsgEquivalent: 'stigmergicCoordination.ts (distributed coordination) + digitalEnvironment.ts (agent presence + navigation)', integrationNotes: 'QCORE = capacidad distribuida NO intermediario central; BeHolder = agent-centric UI en digitalEnvironment' },
  { gaiaComponent: 'EVA — Privacy-focused AI Chief of Staff', hscsgEquivalent: 'agentProfile.ts (AI agency) + nooa.ts (NVIDIA OO-Agents) + boundaries.ts (policy gateway)', integrationNotes: 'EVA = asistente IA pay-per-action; integrar con agentMesh.ts + credit system CaaS' },
  { gaiaComponent: 'Holopedia Knowledge Infrastructure', hscsgEquivalent: 'integral.ts (signals/decisions) + brandCollateral.ts (RAO) + sovreignCredit.ts (attestations)', integrationNotes: 'Holopedia = fuentes, evidencia, síntesis, historial, bitácoras; mapear a Integral Loop (CDS→OAD→COS→ITC→FRS)' },
  { gaiaComponent: 'Gaia GPS & AI Matching', hscsgEquivalent: 'p2pInfrastructureStack.ts (DHT) + stigmergicCoordination.ts (signal discovery) + credentialSystem.ts (matchmaking)', integrationNotes: 'Matchmaking habilidades/necesidades/proyectos → signalTypes.ts (priming/tracing) + convergenceMechanisms.ts' },
  { gaiaComponent: 'Gaia Hub (MetaPlataforma)', hscsgEquivalent: 'digitalEnvironment.ts (5 layers) + p2pInfrastructureStack.ts (Holochain) + networkOpenness.ts (permissionless)', integrationNotes: 'Gaia Hub = orquestación; NO monolito; federación abierta de apps; capas: registry, venture, governance, learning, social' },
  { gaiaComponent: 'Gaia Commons', hscsgEquivalent: 'propertyRegimeSystem.ts (Non-Dominium) + custodian (legalFramework.ts) + caas.ts (commons stewardship)', integrationNotes: 'Custodia bienes comunes → propertyRegimeSystem.ts (4 regímenes) + custodian fiduciario/temporal/auditable/recall' },
  { gaiaComponent: 'Gaia Global Alliance Fund', hscsgEquivalent: 'whatmatters.ts (multilateral clearing) + caas.ts (revenue streams) + valueEquation.ts (benefit redistribution)', integrationNotes: 'Fondo paraguas + ventanas (Impact & Innovation Fund, Commons Fund) → mantienen mandatos/contabilidad/gobernanza diferenciados' },
  { gaiaComponent: 'Gaia Impact & Innovation Hub', hscsgEquivalent: 'propagationModels.ts (Initiation Ritual) + digitalEnvironment.ts (venture_space) + incentiveModels.ts', integrationNotes: 'Incubación/aceleración → Initiation Ritual (recipe) + venture_space layer + 5 incentive models paralelos' },
  { gaiaComponent: 'Gaia Market', hscsgEquivalent: 'valueFlowsIntegration.ts (ExchangeFlow) + networkOpenness.ts (credential access) + incentiveModels.ts', integrationNotes: 'Intercambio abierto → ExchangeFlow (ValueFlows) + credential-based access + user-chosen incentive model per contribution' },
  { gaiaComponent: 'Gaia Academy', hscsgEquivalent: 'learningLayers.ts + education.ts + brandWorkflow.ts (courses)', integrationNotes: '16 Facultades ↔ learningLayers.ts (requisite variety, single/double loop) + education.ts (Didacta) + Educaas (anfibio)' },
  { gaiaComponent: 'Gaia EcoHabitats Network', hscsgEquivalent: 'samay.ts (permacultura) + feria.ts (conuquera) + virginia.ts (IE v2) + propagationModels.ts (Mitosis)', integrationNotes: 'BioHabitats/BioHubs → samay/feria/virginia (territorio) + Mitosis (replicación protocolo reconocimiento)' },
  { gaiaComponent: 'Gaia BioHubs', hscsgEquivalent: 'digitalEnvironment.ts (shared spaces) + propagationModels.ts (handshake generativo)', integrationNotes: 'Centros conexión comunitaria → sharedSpaces (CRDT) + handshake generativo (Capa 0) para federación' },
  { gaiaComponent: 'Gaia BioSchools/Studios/Labs', hscsgEquivalent: 'learningLayers.ts (Living Labs) + digitalEnvironment.ts (venture_space + learning_space)', integrationNotes: 'Living Labs → learningLayers (requisite variety) + venture_space (prototyping) + learning_space (mentorship)' },
  { gaiaComponent: 'Gaia Dashboards & Passport', hscsgEquivalent: 'brandDNA.ts + brandCollateral.ts + sovereignty.ts + digitalIdentitySystem.ts', integrationNotes: 'Passport = identidad soberana + credenciales + badges + trajectory → brandDNA (70 signos) + brandCollateral (RAO) + sovereignty (13 pilares) + DID/VC/ZK' }
]

export const PRINCIPLES_MAPPING_GAIA_TO_HSCSG: PrinciplesMapping[] = [
  {
    gaiaPrinciple: 'Simbiosis entre el Servicio a la Vida y al Ser y la Unicidad Indivisible',
    hscsgEquivalent: 'Ley MJ I: No dañar base material ni personas + Capa 1 (Autonomía/Regeneración/Continuidad) + valueTheory.ts (Value Sovereignty)',
    implementationNotes: 'Bienestar individual/colectivo interdependientes → CAC vectors (ALIM/ENER/SALU/HABI/PROD) + AUT coefficient'
  },
  {
    gaiaPrinciple: 'Inteligencia Descentralizada y Distribuida',
    hscsgEquivalent: 'p2pInfrastructureStack.ts (Holochain, agent-centric) + stigmergicCoordination.ts (Capa 2) + networkOpenness.ts (permissionless)',
    implementationNotes: 'Sin puntos únicos de control/fallo → Holochain DHT + señal estigmergica + Bitcoin-style minimal identity'
  },
  {
    gaiaPrinciple: 'Inteligencia Cósmica y Colectiva',
    hscsgEquivalent: 'integral.ts (Loop CDS→OAD→COS→ITC→FRS) + governanceTriad.ts (Base-3) + alrac.ts (Consorcio Transducción)',
    implementationNotes: 'Conocimiento colectivo + sabiduría ancestral → Integral Loop (5 sistemas) + Triad validation + RAO provenance'
  },
  {
    gaiaPrinciple: 'Autonomía, Interdependencia y Propósito Compartido',
    hscsgEquivalent: 'purposeBasedOrg.ts (propósito inmutable) + networkOpenness.ts (autonomy floor) + propagationModels.ts (handshake generativo)',
    implementationNotes: 'Consenso emergente desde bases → Propósito inmutable (90% consenso) + AUT ≥ 0.4 + Handshake cultiva compatibilidad'
  },
  {
    gaiaPrinciple: 'Eutopía: el mejor presente y futuro posibles',
    hscsgEquivalent: 'sovereignty.ts (7 generaciones) + samay.ts (permacultura) + propagationModels.ts (Mitosis 7 gen)',
    implementationNotes: 'Construcción realista mejor mundo posible → Soberanía 7 gen + Mitosis replica protocolo (no forma) + time horizon 7 generaciones'
  },
  {
    gaiaPrinciple: 'Valor Anclado en la Vitalidad',
    hscsgEquivalent: 'currentSeeSystem.ts (TQ, ZNU, CARE, REP_*) + valueEquation.ts (redistribución 4 registros) + regen.ts',
    implementationNotes: 'Progreso = vitalidad restaurada → Current-sees multidimensionales + redistribución beneficios + regeneración ecológica'
  },
  {
    gaiaPrinciple: 'Economía Regenerativa',
    hscsgEquivalent: 'valueTheory.ts (money as means) + caas.ts (CaaS anfibio) + whatmatters.ts (compensación multilateral) + propagationModels.ts (Commonomics)',
    implementationNotes: 'Modelos económicos recompensan restauración → Money as means (no fin) + demurrage + CoRe multicapital + Commonomics ciclo regenerativo'
  },
  {
    gaiaPrinciple: 'Eficiencia Orgánica y Plenitud',
    hscsgEquivalent: 'stigmergicCoordination.ts (señales volátiles) + signalDesign.ts (simplicidad/especificidad/predictibilidad/automatismo) + automaton.ts',
    implementationNotes: 'Menor resistencia = menor fricción interna → Estigmergia (coordinación sin fricción) + Autómata (Leyes MJ) + signal design 4 propiedades'
  },
  {
    gaiaPrinciple: 'Cuidado de la Vida a través de las Generaciones',
    hscsgEquivalent: 'purposeBasedOrg.ts (timeHorizon 7 generaciones) + sovereignty.ts (13 pilares × 7 capas × 3 fases) + propagationModels.ts (Mitosis 7 gen)',
    implementationNotes: 'Decisiones guiadas por impacto generaciones futuras → Propósito inmutable 7 gen + Soberanía diagnóstico base material + Mitosis time horizon'
  },
  {
    gaiaPrinciple: 'Infraestructura y Comunidades Resilientes',
    hscsgEquivalent: 'samay.ts (permacultura) + feria.ts (conuquera) + virginia.ts (IE v2) + p2pInfrastructureStack.ts (offline-first/DTN)',
    implementationNotes: 'Sistemas modulares, cero residuos, off-grid → Samay/Feria/Virginia (territorio) + p2p stack (DTN mesh LoRa/WiFi/BLE + bridge DTN)'
  },
  {
    gaiaPrinciple: 'Flujo Abierto, Inclusividad y Renovación Continua',
    hscsgEquivalent: 'networkOpenness.ts (permissionless + anonymous + universal access) + propagationModels.ts (Initiation Ritual + Mitosis) + learningLayers.ts',
    implementationNotes: 'Sistema abierto rechaza estancamiento → Permissionless entry + anonymous participation + universal access incondicional + Initiation Ritual (cualquiera puede iniciar) + Mitosis (replicación) + learningLayers (requisite variety)'
  }
]

// ============================================
// INTEGRACIÓN GI3 EN NODO HSCSG
// ============================================

export class GI3CFNodeIntegration {
  private config: GI3CFIntegrationConfig

  constructor(config?: Partial<GI3CFIntegrationConfig>) {
    this.config = {
      taxonomyMapping: config?.taxonomyMapping || TAXONOMY_MAPPING_GAIA_TO_HSCSG,
      gi3NodeConfig: config?.gi3NodeConfig || GI3_NODE_CONFIG_DEFAULT,
      trustTiersIntegration: config?.trustTiersIntegration || {
        tierMapping: TRUST_TIERS_MAPPING,
        proportionalVerification: {
          factors: { impactScale: 0.3, riskLevel: 0.3, claimScope: 0.2, intendedUse: 0.2 },
          minimumTierByRisk: { low: 1, medium: 2, high: 3, critical: 4 }
        },
        passportIntegration: {
          identityMapping: {
            gaiaProfile: 'AgentProfile (digitalIdentitySystem.ts)',
            credentials: 'VerifiableCredential (vcSystem.ts)',
            verifications: 'ZKProof (zkProofSystem.ts)',
            badges: 'Asset type badge (brandCollateral.ts)',
            endorsements: 'Trustline (trustlines.ts) / Triad validation (governanceTriad.ts)',
            contributions: 'ValueFlow (valueFlowsIntegration.ts)',
            trajectory: 'pattern score (sovereignty.ts) + Integral Loop (integral.ts)'
          },
          visasIntegration: {
            localAccessRights: true,
            communityGovernance: true,
            notStateDocuments: true
          }
        }
      },
      coreCommonomicsIntegration: config?.coreCommonomicsIntegration || {
        coreRecording: {
          timeTasks: 'contributionLogs.ts + tekitl.ts',
          knowledgeContributions: 'credentialSystem.ts (auto-constructed)',
          resourceExchanges: 'ValueFlow (valueFlowsIntegration.ts)',
          compensationAgreements: 'Obligation (whatmatters.ts) + payouts (caas.ts)',
          multicapitalLedger: 'credits (integral.ts) + pattern score (sovereignty.ts) + RAO (alrac.ts)'
        },
        commonomicsFlows: {
          gaiaMarketPortionToCommons: 0.1, // 10% orientativo, debe validarse
          operationalSurplusToMainFund: 0.05, // 5% orientativo
          transparentRules: true,
          validatedCommercially: false // pendiente pilotaje
        },
        capitalMapping: CAPITAL_MAPPING_GAIA_TO_HSCSG
      },
      digitalLayerIntegration: config?.digitalLayerIntegration || {
        gaiaHub: {
          metaPlatformLayers: ['resource_registry', 'venture_space', 'governance_forum', 'learning_space', 'social_space'],
          orchestration: 'stigmergicCoordination.ts + signalDesign.ts',
          interoperability: true
        },
        components: DIGITAL_COMPONENT_INTEGRATIONS
      },
      principlesMapping: config?.principlesMapping || PRINCIPLES_MAPPING_GAIA_TO_HSCSG
    }
  }

  // ============================================
  // CÁLCULO GI3 PARA NODO HSCSG
  // ============================================

  /**
   * Calcula el GI3 para un nodo HSCSG basado en sus métricas reales
   * Integra: PVSO (alrac.ts), Integral Loop (integral.ts), Soberanía (sovereignty.ts), CoRe (whatmatters.ts)
   */
  calculateGI3ForNode(nodeId: string, nodeData: {
    // Métricas de impacto (I)
    targetScores: Record<string, number> // targetId -> score 0-100
    targetWeights: Record<string, number> // targetId -> weight (sum = 1)
    // Métricas de calidad (Q)
    coherenceScore: number // 0-100
    transparencyScore: number // 0-100
    inclusionScore: number // 0-100
    ethicsScore: number // 0-100
    sustainabilityScore: number // 0-100
    // Métricas de verificación (V)
    evidenceLevel: 'E0' | 'E1' | 'E2' | 'E3' | 'E4'
    evidenceCoverage: number // 0-1
    // Métricas de contribución (C)
    collaborationScore: number // 0-100
    knowledgeSharingScore: number // 0-100
    allianceBuildingScore: number // 0-100
    gaiaParticipationScore: number // 0-100
    commonsContributionScore: number // 0-100
  }): { GI3: number; I: number; Q: number; V: number; C: number; coverage: number; details: any } {
    const weights = this.config.gi3NodeConfig.weights

    // I = Impacto y resultados (50%)
    let I = 0
    let totalWeight = 0
    for (const [targetId, score] of Object.entries(nodeData.targetScores)) {
      const weight = nodeData.targetWeights[targetId] || 0
      I += weight * score
      totalWeight += weight
    }
    if (totalWeight > 0) I = I / totalWeight

    // Q = Calidad, coherencia e integridad (25%)
    const Q = (
      0.20 * nodeData.coherenceScore +
      0.20 * nodeData.transparencyScore +
      0.20 * nodeData.inclusionScore +
      0.20 * nodeData.ethicsScore +
      0.20 * nodeData.sustainabilityScore
    )

    // V = Verificación y evidencia (15%)
    const evidenceScores = { E0: 20, E1: 40, E2: 60, E3: 80, E4: 100 }
    const V = evidenceScores[nodeData.evidenceLevel] * nodeData.evidenceCoverage

    // C = Contribución y colaboración en red (10%)
    const C = (
      0.25 * nodeData.collaborationScore +
      0.20 * nodeData.knowledgeSharingScore +
      0.20 * nodeData.allianceBuildingScore +
      0.20 * nodeData.gaiaParticipationScore +
      0.15 * nodeData.commonsContributionScore
    )

    // GI3 compuesto
    const GI3 = weights.I * I + weights.Q * Q + weights.V * V + weights.C * C

    // Cobertura de datos
    const coverage = nodeData.evidenceCoverage // simplificado; en producción calcular según GI3_COBERTURA

    return {
      GI3: Math.round(GI3 * 100) / 100,
      I: Math.round(I * 100) / 100,
      Q: Math.round(Q * 100) / 100,
      V: Math.round(V * 100) / 100,
      C: Math.round(C * 100) / 100,
      coverage: Math.round(coverage * 100) / 100,
      details: {
        nodeId,
        timestamp: Date.now(),
        weights,
        minCoverageThreshold: this.config.gi3NodeConfig.minCoverageThreshold,
        publishable: coverage >= this.config.gi3NodeConfig.minCoverageThreshold,
        evidenceLevel: nodeData.evidenceLevel
      }
    }
  }

  // ============================================
  // MAPEO TAXONOMÍA → TALENTOS HSCSG
  // ============================================

  /**
   * Obtiene los talentos HSCSG relevantes para una categoría/subcategoría Gaia
   */
  getHSCSGTalentsForGaiaCategory(category: string, subcategory?: string): string[] {
    const mappings = this.config.taxonomyMapping.filter(m => 
      m.gaiaCategory === category && (!subcategory || m.gaiaSubcategory === subcategory)
    )
    return [...new Set(mappings.flatMap(m => m.hscsgTalent.split(' + ')))]
  }

  /**
   * Obtiene los vectores CAC (ALIM/ENER/SALU/HABI/PROD) para una categoría Gaia
   */
  getCACVectorsForGaiaCategory(category: string): ('ALIM' | 'ENER' | 'SALU' | 'HABI' | 'PROD')[] {
    const mappings = this.config.taxonomyMapping.filter(m => m.gaiaCategory === category)
    const vectors = mappings.map(m => m.hscsgVector).filter(v => 
      ['ALIM', 'ENER', 'SALU', 'HABI', 'PROD'].includes(v)
    ) as ('ALIM' | 'ENER' | 'SALU' | 'HABI' | 'PROD')[]
    return [...new Set(vectors)]
  }

  // ============================================
  // TRUST TIERS → CREDENCIALES HSCSG
  // ============================================

  /**
   * Determina el método de verificación HSCSG para un Trust Tier Gaia
   */
  getHSCSGVerificationMethod(gaiaTier: 1 | 2 | 3 | 4): TrustTierMapping | undefined {
    return this.config.trustTiersIntegration.tierMapping.find(m => m.gaiaTier === gaiaTier)
  }

  /**
   * Verifica si una credencial HSCSG cumple con un Trust Tier Gaia requerido
   */
  verifyCredentialMeetsTier(credential: { type: string; verificationMethod: string; evidenceLevel: string }, requiredTier: 1 | 2 | 3 | 4): boolean {
    const tierMapping = this.getHSCSGVerificationMethod(requiredTier)
    if (!tierMapping) return false
    
    // Verificar método de verificación
    if (credential.verificationMethod !== tierMapping.verificationMethod) return false
    
    // Verificar nivel de evidencia
    if (!tierMapping.evidenceLevels.includes(credential.evidenceLevel as any)) return false
    
    return true
  }

  // ============================================
  // CORE/COMMONOMICS → VALUEFLOWS + CAAS + WHATMATTERS
  // ============================================

  /**
   * Registra una contribución CoRe en el sistema HSCSG
   */
  recordCoreContribution(contribution: {
    agentId: string
    capitalType: string // uno de los 9 capitales
    amount: number
    unit: string
    description: string
    evidenceLevel: 'E0' | 'E1' | 'E2' | 'E3' | 'E4'
    verificationMethod: 'self_attestation' | 'peer_review' | 'ambassador_verified' | 'third_party_certified'
  }): { valueFlowId: string; obligationId?: string; creditAmount: number } {
    // Mapear capital Gaia → Current-see HSCSG
    const capitalMapping = this.config.coreCommonomicsIntegration.capitalMapping.find(
      c => c.gaiaCapital === contribution.capitalType
    )
    const currentSeeType = capitalMapping?.currentSeeEquivalent || 'CERT_*'
    const hscsgModule = capitalMapping?.hscsgModule || 'integral.ts'

    // Crear ValueFlow (valueFlowsIntegration.ts)
    const valueFlowId = `vf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    
    // Si es compensación monetaria, crear Obligación WhatMatters
    let obligationId: string | undefined
    if (['Financiero', 'Material / Manufacturado'].includes(contribution.capitalType)) {
      obligationId = `obl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    }

    // Calcular créditos Integral (integral.ts)
    const creditAmount = contribution.amount * (contribution.evidenceLevel === 'E4' ? 1.0 : contribution.evidenceLevel === 'E3' ? 0.8 : contribution.evidenceLevel === 'E2' ? 0.6 : contribution.evidenceLevel === 'E1' ? 0.4 : 0.2)

    return { valueFlowId, obligationId, creditAmount }
  }

  /**
   * Calcula distribución Commonomics para una transacción Gaia Market
   */
  calculateCommonomicsDistribution(transactionAmount: number): {
    toCommonsTreasury: number
    toMainFund: number
    toParticipants: number
    breakdown: Record<string, number>
  } {
    const flows = this.config.coreCommonomicsIntegration.commonomicsFlows
    const toCommonsTreasury = transactionAmount * flows.gaiaMarketPortionToCommons
    const remaining = transactionAmount - toCommonsTreasury
    const toMainFund = remaining * flows.operationalSurplusToMainFund
    const toParticipants = remaining - toMainFund

    return {
      toCommonsTreasury,
      toMainFund,
      toParticipants,
      breakdown: {
        'platform_development': toCommonsTreasury * 0.4,
        'marketing_referrals': toCommonsTreasury * 0.2,
        'contingencies': toCommonsTreasury * 0.15,
        'facilitation': toCommonsTreasury * 0.15,
        'school_of_life': toCommonsTreasury * 0.1,
        'main_fund': toMainFund,
        'participants': toParticipants
      }
    }
  }

  // ============================================
  // DIGITAL LAYER → DIGITAL ENVIRONMENT + P2P
  // ============================================

  /**
   * Configura las capas del Digital Environment HSCSG según Gaia Hub MetaPlataforma
   */
  configureDigitalEnvironmentLayers(): Array<{ layerId: string; gaiaFunction: string; hscsgComponents: string[] }> {
    return [
      { layerId: 'resource_registry', gaiaFunction: 'Gaia GPS + Resource Map + Market discovery', hscsgComponents: ['resourceRegistry.ts', 'valueFlowsIntegration.ts', 'stigmergicCoordination.ts'] },
      { layerId: 'venture_space', gaiaFunction: 'Gaia Impact & Innovation Hub + BioLabs + Prototyping', hscsgComponents: ['propagationModels.ts (Initiation Ritual)', 'digitalEnvironment.ts (venture_space)', 'incentiveModels.ts'] },
      { layerId: 'governance_forum', gaiaFunction: 'Governance Triad + Trust Tiers + Community Attestation', hscsgComponents: ['governanceTriad.ts', 'trustlines.ts', 'legalFramework.ts', 'networkOpenness.ts'] },
      { layerId: 'learning_space', gaiaFunction: 'Gaia Academy / 16 Facultades + UniDiversidad', hscsgComponents: ['learningLayers.ts', 'education.ts', 'brandWorkflow.ts', 'digitalEnvironment.ts (learning_space)'] },
      { layerId: 'social_space', gaiaFunction: 'Gaia Network + BioHubs + Celebration/Connection', hscsgComponents: ['digitalEnvironment.ts (social_space)', 'stigmergicCoordination.ts (free signals)', 'solarpunk.ts'] }
    ]
  }

  // ============================================
  // PRINCIPIOS GAIA → LEYES MJ / HSCSG
  // ============================================

  /**
   * Obtiene la implementación HSCSG para un principio fundamental Gaia
   */
  getHSCSGImplementationForGaiaPrinciple(principleTitle: string): PrinciplesMapping | undefined {
    return this.config.principlesMapping.find(p => p.gaiaPrinciple === principleTitle)
  }

  /**
   * Verifica cumplimiento de principios Gaia en un nodo HSCSG
   */
  auditGaiaPrinciplesCompliance(nodeData: {
    purposeImmutable: boolean
    autonomyFloor: number
    regenerationRate: number
    continuityHorizon: number
    p2pInfrastructure: boolean
    permissionlessEntry: boolean
    universalAccess: boolean
    stigmergicCoordination: boolean
    moneyAsMeans: boolean
    demurrageEnabled: boolean
    sevenGenerationsHorizon: boolean
    offlineFirst: boolean
    initiationRitualEnabled: boolean
    mitosisEnabled: boolean
  }): { principle: string; compliant: boolean; gaps: string[] }[] {
    return this.config.principlesMapping.map(p => {
      const gaps: string[] = []
      let compliant = true

      switch (p.gaiaPrinciple) {
        case 'Simbiosis entre el Servicio a la Vida y al Ser y la Unicidad Indivisible':
          if (!nodeData.purposeImmutable) { compliant = false; gaps.push('Propósito no inmutable (requiere 90% consenso)') }
          break
        case 'Inteligencia Descentralizada y Distribuida':
          if (!nodeData.p2pInfrastructure) { compliant = false; gaps.push('Falta infraestructura p2p (Holochain/DHT)') }
          if (!nodeData.permissionlessEntry) { compliant = false; gaps.push('Entrada no permissionless') }
          break
        case 'Autonomía, Interdependencia y Propósito Compartido':
          if (nodeData.autonomyFloor < 0.4) { compliant = false; gaps.push('AUT floor < 0.4') }
          if (!nodeData.initiationRitualEnabled) { compliant = false; gaps.push('Initiation Ritual no habilitado') }
          break
        case 'Eutopía: el mejor presente y futuro posibles':
          if (!nodeData.sevenGenerationsHorizon) { compliant = false; gaps.push('Horizonte < 7 generaciones') }
          break
        case 'Valor Anclado en la Vitalidad':
          if (!nodeData.moneyAsMeans) { compliant = false; gaps.push('Money as means no activado') }
          if (!nodeData.demurrageEnabled) { compliant = false; gaps.push('Demurrage no activado') }
          break
        case 'Economía Regenerativa':
          if (nodeData.regenerationRate <= 1.0) { compliant = false; gaps.push('Regeneration rate ≤ 1.0 (no net positive)') }
          break
        case 'Eficiencia Orgánica y Plenitud':
          if (!nodeData.stigmergicCoordination) { compliant = false; gaps.push('Coordinación estigmergica no activa') }
          break
        case 'Cuidado de la Vida a través de las Generaciones':
          if (!nodeData.sevenGenerationsHorizon) { compliant = false; gaps.push('Horizonte < 7 generaciones') }
          break
        case 'Infraestructura y Comunidades Resilientes':
          if (!nodeData.offlineFirst) { compliant = false; gaps.push('No offline-first / DTN') }
          break
        case 'Flujo Abierto, Inclusividad y Renovación Continua':
          if (!nodeData.universalAccess) { compliant = false; gaps.push('Acceso universal no incondicional') }
          if (!nodeData.mitosisEnabled) { compliant = false; gaps.push('Mitosis (replicación) no habilitada') }
          break
      }

      return { principle: p.gaiaPrinciple, compliant, gaps }
    })
  }

  // ============================================
  // CONFIGURACIÓN COMPLETA
  // ============================================

  getConfig(): GI3CFIntegrationConfig {
    return this.config
  }
}

// ============================================
// EXPORTS
// ============================================

export const gi3cfIntegration = new GI3CFNodeIntegration()

export default {
  TAXONOMY_MAPPING_GAIA_TO_HSCSG,
  GI3_NODE_CONFIG_DEFAULT,
  TRUST_TIERS_MAPPING,
  CAPITAL_MAPPING_GAIA_TO_HSCSG,
  DIGITAL_COMPONENT_INTEGRATIONS,
  PRINCIPLES_MAPPING_GAIA_TO_HSCSG,
  GI3CFNodeIntegration,
  gi3cfIntegration
}