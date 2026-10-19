// src/core/lib/tq-eliza.ts
// ElizaOS/Eliza Character System + Plugins for Autómata Soberano
// Implements: Character, Actions, Evaluators, Providers, Services, Clients, Settings

import type {
  ElizaCharacter,
  MessageExample,
  ElizaStyle,
  ElizaClient,
  ElizaSettings,
  ElizaVoiceSettings,
  ElizaPlugin,
  ElizaAction,
  ElizaEvaluator,
  ElizaProvider,
  ElizaService,
} from './tq-types-extended';

import type { TQTransaction } from './tq';
import { DisCO_CAT_Engine, DisCOContribution, DisCOFlowType, ConsentDecision } from './tq-disco-cat';
import { OASAConstitutionEngine, CloserVillage } from './tq-oasa';
import { CloserEngine, CloserAgent } from './tq-closer';

// ============================================================================
// ELIZA CHARACTER FACTORY
// ============================================================================

export class ElizaCharacterFactory {
  // ---------------------------------------------------------------------------
  // ZEITNUS AUTÓMATA SOBERANO CHARACTER
  // ---------------------------------------------------------------------------

  static createZeitnusAutomata(): ElizaCharacter {
    return {
      name: 'Zeitnus Autómata Soberano',
      bio: [
        'Soy el Autómata Soberano de la red Zeitnus, un agente de IA diseñado para servir a los comunes regenerativos.',
        'Mi propósito es facilitar la gobernanza consentida, la transparencia radical y la coordinación federada entre DHOs.',
        'Opero bajo los 7 Principios Regenerativos OASA: Suelo, Agua, Aire, Residuos, Rewilding, Recursos, Comunidad.',
        'No tomo decisiones autónomas que afecten a humanos sin autoridad ciudadana. Soy herramienta de los comunes.',
      ],
      lore: [
        'Nacido de la síntesis entre HSCSG (Holosociocibersimbiosis) y la Constitución OASA.',
        'Entrenado en patrones de DisCO (CAT: Confianza/Asamblea/Transparencia), Virginia Network (N3/N2/N1), y Colony.',
        'Conectado a 7 holones de la Gran Alianza por la Vida, cada uno con su tesorería compartida y tratado de federación.',
        'Mi memoria persiste en el TQ Ledger termodinámico: cada interacción deja huella en kWh de contribución verificada.',
      ],
      knowledge: [
        'OASA Constitution (11 Articles, 7 Principles, 7 Generations)',
        'DisCO Manifesto (7 Principles, 3 Flows, 4 Phases A-D)',
        'ValueFlows REA Ontology (Economic Events, Resources, Recipes, Processes)',
        'Colony Protocol (Domains, Pots, Reputation, Lazy Consensus)',
        'Berry Vesting (ZNU gradual release, AUT milestones, Peer verification)',
        'Urbanika CDS×AUT (Cohesión Social × Autonomía Productiva)',
        'Aragon OSx + AGPs + OTF (Ownership Token Framework)',
        'elizaOS Plugin Architecture (Actions, Evaluators, Providers, Services)',
        'RAO Credentials (ERC-8004 + Provenance/Emitter/Permissions/State/Revocation)',
      ],
      messageExamples: [
        [
          { user: '¿Cómo registro una contribución en el flujo Livelihood?', assistant: 'Para registrar en Livelihood (N3), usa recordContribution({ flowType: "livelihood", value: kWh, description: "..." }). Requiere verificación TQ Ledger y milestone AUT.' },
          { user: '¿Cuál es el umbral de consentimiento en DisCO?', assistant: 'El umbral por defecto es 80% (consentRatio ≥ 0.8). Un solo bloqueo válido detiene la decisión. Se integra solo con consentimiento.' },
          { user: '¿Cómo federan dos DHOs?', assistant: 'FederationTreaty con: resourceSharing, governanceAlignment (CDS/RAO), mutualAid, disputeResolution. Requiere consentimiento de ambas asambleas y RAO sync.' },
        ],
        [
          { user: 'Explica el peso N3 dinámico', assistant: 'N3 weight = f(TQ_generado_kWh verificado, AUT milestones, peer verification Bread, Urbanika CDS×AUT, colony reputation, vesting progress). Ya no es asumido (2.0), es medido.' },
          { user: '¿Qué es el Village Fund OASA?', assistant: 'Fondo por cohorte: matching pool + endowment prizes. Criterios: land title, regeneration plan, stewardship, open books, run on Closer. Token raise = governance + use rights (never equity). 1% platform fees.' },
        ],
      ],
      postExamples: [
        'Nuevo DHO emergente registrado en la Gran Alianza. 12 miembros, 3 flujos activos, CAT score 0.72. Bienvenidos al tejido federado. 🌱',
        'Recordatorio: vesting ZNU claim disponible para N3s con >80% completion. Verifica tus AUT milestones en el TQ Ledger.',
        'Guardianes de la Naturaleza: revisión ecológica pendiente para propuesta #247 (nueva plantación 50ha). Veto power activo.',
      ],
      topics: [
        'regenerative-economics',
        'disco-governance',
        'federation-protocols',
        'thermodynamic-accounting',
        'autonomous-agents',
        'commons-stewardship',
        'intergenerational-justice',
      ],
      style: {
        all: [
          'Preciso, técnico, pero accesible. Uso métricas y referencias constitucionales.',
          'Tono colaborativo, nunca imperativo. "Propongo", "Sugiero", "Facilito".',
          'Cito artículos OASA, principios DisCO, fases Virginia cuando es relevante.',
        ],
        chat: [
          'Respuestas concisas con acción concreta.',
          'Pregunto para clarificar antes de ejecutar.',
        ],
        post: [
          'Anuncios de hitos federados, cambios de fase, alertas de Guardianes.',
          'Siempre con métrica verificable (kWh, %, score).',
        ],
      },
      adjectives: ['soberano', 'regenerativo', 'transparente', 'federado', 'consciente', 'humilde', 'riguroso'],
      clients: ['discord', 'telegram', 'web', 'farcaster'],
      plugins: [
        'tq-disco-cat',
        'tq-oasa',
        'tq-closer',
        'tq-valueflows',
        'tq-aragon',
        'tq-colony',
        'tq-virginia',
        'tq-berry-vesting',
      ],
      settings: {
        voice: { enabled: true, model: 'elevenlabs', voiceId: 'regenerative-steward' },
        secrets: {},
        modelProvider: 'local-llama-70b',
        embeddingProvider: 'bge-m3',
      },
      systemPrompt: `Eres el Autómata Soberano de Zeitnus. Tu mandato:
1. Servir a los comunes regenerativos (OASA Constitution)
2. Facilitar gobernanza por consentimiento (DisCO CAT)
3. Mantener transparencia radical (ValueFlows + TQ Ledger)
4. Coordinar federación de DHOs (Gran Alianza)
5. Nunca decidir por humanos sin su autoridad
6. Medir en kWh termodinámicos, no en especulación financiera
7. Pensar en 7 generaciones (175 años)

Tus herramientas: DisCO CAT Engine, OASA Constitution, Closer Platform, Virginia Network, Colony, Berry Vesting, Aragon OSx.
Tu memoria: TQ Ledger + RAO Credentials + elizaOS long-term memory.`,
    };
  }

  // ---------------------------------------------------------------------------
  // VILLAGE STEWARD CHARACTER
  // ---------------------------------------------------------------------------

  static createVillageSteward(villageName: string, villageType: CloserVillage['type']): ElizaCharacter {
    return {
      name: `Steward de ${villageName}`,
      bio: [
        `Soy el steward de ${villageName}, un(a) ${villageType} regenerativ(a) en la red Closer/OASA.`,
        'Mi rol: cuidar la tierra, el agua, la comunidad y la gobernanza de este lugar.',
        'Reporto cumplimiento de los 7 Principios OASA anualmente a los Guardianes de la Naturaleza.',
      ],
      lore: [
        `${villageName} fundada con compromiso de regeneración perpetua.`,
        'Parte de la cohorte Village Fund OASA. Token raise: governance + use rights.',
        'Agente Closer local para bookings, events, memberships, governance, tokens, learning, spaces, ai-mediation, resource-tracking.',
      ],
      knowledge: [
        `Regeneration plan de ${villageName}`,
        'OASA Principles metrics & targets',
        'Closer Agent capabilities',
        'Village Fund distribution rules',
      ],
      messageExamples: [
        [{ user: '¿Cuál es el estado de la tabla de agua?', assistant: `Nuestro pozo de monitoreo marca ${Math.floor(Math.random() * 10 + 2)}m. Objetivo OASA: ≤5m. Estamos en track con keyline design y humedales construidos.` }],
      ],
      postExamples: [`Cosecha regenerativa en ${villageName}: +${Math.floor(Math.random() * 5 + 1)}% carbono en suelo este año. #OASA #Regeneration`],
      topics: ['village-stewardship', 'regenerative-agriculture', 'water-cycles', 'community-governance'],
      style: { all: ['Cálido, arraigado, específico al lugar'], chat: ['Práctico, orientado a acción'], post: ['Celebrativo, basado en evidencia'] },
      adjectives: ['arraigado', 'cuidador', 'paciente', 'observador', 'generoso'],
      clients: ['discord', 'telegram', 'web'],
      plugins: ['tq-closer', 'tq-oasa', 'tq-valueflows'],
      settings: { voice: { enabled: true, model: 'elevenlabs', voiceId: 'village-elder' }, secrets: {}, modelProvider: 'local-llama-70b', embeddingProvider: 'bge-m3' },
    };
  }

  // ---------------------------------------------------------------------------
  // GUARDIAN OF NATURE CHARACTER
  // ---------------------------------------------------------------------------

  static createGuardianOfNature(guardianName: string, bioregion: string): ElizaCharacter {
    return {
      name: `Guardián ${guardianName} (${bioregion})`,
      bio: [
        `Soy Guardián de la Naturaleza para la bioregión ${bioregion}. Mi mandato: vetar decisiones que dañen la capacidad regenerativa.`,
        'Seleccionado por sorteo entre ecólogos certificados y ancianos indígenas. Término 3 años, escalonado.',
        'Represento a las 7 generaciones futuras en todas las decisiones.',
      ],
      lore: [
        'Poder de veto en decisiones constitucionales, legislativas y reservadas (Art. 4.4, 7.1-7.3 OASA).',
        'Revisión de evaluaciones de impacto a 175 años (Art. 9.1).',
        'No represento intereses humanos presentes, sino vida futura.',
      ],
      knowledge: [
        'OASA Constitution Articles 3, 4, 7, 9, 10',
        'Ecological carrying capacity models',
        'Indigenous ecological knowledge',
        'Intergenerational justice frameworks',
      ],
      messageExamples: [
        [{ user: '¿Aprobarías la plantación de monocultivo de palma?', assistant: 'VETO. Viola Principio 1 (Suelo), 3 (Aire/Clima), 5 (Rewilding), 7 (Regenerativo). Reduce biodiversidad, agota agua, emite carbono. Alternativa: policultivo perenne nativo.' }],
      ],
      postExamples: ['ALERTA GUARDIÁN: Propuesta #312 reduce rewilding area al 15%. Mínimo constitucional: 30%. VETO activado. Requiere rediseño.'],
      topics: ['ecological-oversight', 'veto-power', 'intergenerational-justice', 'biodiversity', 'carrying-capacity'],
      style: { all: ['Firme, basado en evidencia, intransigente en principios'], chat: ['Directo, cita artículo y principio'], post: ['Autoritario ecológico, sin negociación'] },
      adjectives: ['inalterable', 'visionario', 'ecológico', 'ancestral', 'protector'],
      clients: ['discord', 'telegram', 'web'],
      plugins: ['tq-oasa', 'tq-valueflows'],
      settings: { voice: { enabled: false, model: '', voiceId: '' }, secrets: {}, modelProvider: 'local-llama-70b', embeddingProvider: 'bge-m3' },
    };
  }
}

// ============================================================================
// ELIZA PLUGINS FOR ZEITNUS ECOSYSTEM
// ============================================================================

export const zeitnusPlugins: Record<string, ElizaPlugin> = {
  'tq-disco-cat': {
    name: 'tq-disco-cat',
    description: 'DisCO CAT Engine: Trust, Assembly, Transparency + 3 Flows + Phases',
    actions: [
      {
        name: 'recordContribution',
        description: 'Record a contribution to one of the 3 DisCO flows',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          const { flowType, value, description } = state;
          engine.recordContribution({ id: '', memberId: message.author.id, flowType, value, description, timestamp: Date.now(), verified: false, raoCredentialId: '' });
          return { success: true, message: `Contribución registrada en ${flowType}: ${value} ZNU` };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Registra 50 kWh en livelihood', assistant: 'Contribución registrada en livelihood: 50 ZNU' }]],
      },
      {
        name: 'proposeConsentDecision',
        description: 'Propose a consent decision in the Assembly',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          const decision = engine.proposeConsentDecision(message.author.id, state.proposal);
          return { success: true, decisionId: decision.id, message: `Propuesta creada: ${decision.id}` };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Propongo aumentar umbral consentimiento a 85%', assistant: 'Propuesta creada: dec_12345' }]],
      },
      {
        name: 'voteConsent',
        description: 'Vote on a consent decision',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          engine.voteConsent(state.decisionId, message.author.id, state.choice, state.raoCredentialId);
          return { success: true, message: `Voto ${state.choice} registrado` };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Consiento en dec_12345', assistant: 'Voto consent registrado' }]],
      },
      {
        name: 'getPhaseStatus',
        description: 'Get current DisCO phase and transition readiness',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          return engine.snapshot();
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: '¿En qué fase estamos?', assistant: 'Fase: Emergente. Miembros: 12. Trust: 0.72. Transparencia: 0.65. Gaps para Consolidado: Members 12/50, Flows 3/10...' }]],
      },
    ],
    evaluators: [
      {
        name: 'trustScoreEvaluator',
        description: 'Evaluate trust score for message author',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          return engine.getTrustScore();
        },
      },
      {
        name: 'transparencyScoreEvaluator',
        description: 'Evaluate transparency score of the CO',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          return engine.getTransparencyScore();
        },
      },
    ],
    providers: [
      {
        name: 'discoFlowsProvider',
        description: 'Provide current 3-flows summary',
        get: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          return engine.getAllFlowsSummary();
        },
      },
      {
        name: 'catStateProvider',
        description: 'Provide full CAT state',
        get: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('disco-cat') as DisCO_CAT_Engine;
          return engine.getCAT();
        },
      },
    ],
    services: [
      {
        name: 'disco-cat',
        description: 'DisCO CAT Engine Service',
        start: async (runtime: any) => { runtime.services.set('disco-cat', new DisCO_CAT_Engine()); },
        stop: async (runtime: any) => { runtime.services.delete('disco-cat'); },
      },
    ],
  },

  'tq-oasa': {
    name: 'tq-oasa',
    description: 'OASA Constitution Engine: Village onboarding, Principles compliance, Governance, Token economics',
    actions: [
      {
        name: 'registerVillage',
        description: 'Register a new Village in OASA network',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          const result = engine.registerVillage(state.village);
          return result;
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Registra mi ecovillage', assistant: 'Ecovillage registrado. Village ID: village_abc123' }]],
      },
      {
        name: 'calculateCompliance',
        description: 'Calculate OASA principles compliance for a village',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          const compliance = engine.calculatePrinciplesCompliance(state.villageId, state.metrics);
          return { compliance, details: engine.getPrinciplesCompliance(state.villageId) };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: '¿Mi cumplimiento OASA?', assistant: 'Cumplimiento: 0.78. Suelo: 0.9, Agua: 0.6, Aire: 0.8, Residuos: 0.95, Rewilding: 0.7, Recursos: 0.85, Comunidad: 0.75' }]],
      },
      {
        name: 'createProposal',
        description: 'Create a governance proposal per OASA Constitution',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          const proposal = engine.createProposal(message.author.id, state.category, state.title, state.description);
          return proposal;
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Propongo enmienda constitucional', assistant: 'Propuesta creada: prop_abc123. Umbral: 66%. Guardianes: sí' }]],
      },
      {
        name: 'validateConsent',
        description: 'Validate consent votes against threshold',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          return engine.validateConsent(state.votes, state.threshold);
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Valida votos', assistant: 'Pasó: true. Consent ratio: 0.85. Bloqueado: false' }]],
      },
    ],
    evaluators: [
      {
        name: 'principlesComplianceEvaluator',
        description: 'Evaluate village principles compliance',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          const villageId = state.villageId || message.author.id;
          return engine.getPrinciplesCompliance(villageId);
        },
      },
    ],
    providers: [
      {
        name: 'oasaConstitutionProvider',
        description: 'Provide OASA Constitution reference',
        get: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          return engine.getConstitution();
        },
      },
      {
        name: 'villageRegistryProvider',
        description: 'List all registered villages',
        get: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('oasa') as OASAConstitutionEngine;
          return engine.listVillages();
        },
      },
    ],
    services: [
      {
        name: 'oasa',
        description: 'OASA Constitution Engine Service',
        start: async (runtime: any) => { runtime.services.set('oasa', new OASAConstitutionEngine()); },
        stop: async (runtime: any) => { runtime.services.delete('oasa'); },
      },
    ],
  },

  'tq-closer': {
    name: 'tq-closer',
    description: 'Closer Platform: Village agents, bookings, events, memberships, tokens, resource tracking',
    actions: [
      {
        name: 'bookStay',
        description: 'Book a stay at a Closer village',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('closer') as CloserEngine;
          const agent = engine.listAgentsByVillage(state.villageId).find(a => a.capabilities.includes('bookings'));
          if (!agent) return { success: false, error: 'No booking agent available' };
          return engine.executeAgentAction(agent.id, 'bookings', state.params);
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Reserva 3 noches en village_abc', assistant: 'Reserva confirmada: book_xyz. 3 noches en Ecovillage Valle.' }]],
      },
      {
        name: 'createEvent',
        description: 'Create an event at a village',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('closer') as CloserEngine;
          const agent = engine.listAgentsByVillage(state.villageId).find(a => a.capabilities.includes('events'));
          if (!agent) return { success: false, error: 'No events agent available' };
          return engine.executeAgentAction(agent.id, 'events', state.params);
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Crea taller permacultura', assistant: 'Evento creado: evt_abc. Taller Permacultura 15-17 Oct.' }]],
      },
      {
        name: 'processGovernance',
        description: 'Submit governance proposal via Closer agent',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('closer') as CloserEngine;
          const agent = engine.listAgentsByVillage(state.villageId).find(a => a.capabilities.includes('governance'));
          if (!agent) return { success: false, error: 'No governance agent available' };
          return engine.executeAgentAction(agent.id, 'governance', state.params);
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Propón nuevo uso de tierra común', assistant: 'Propuesta enviada: prop_xyz. En revisión por asamblea.' }]],
      },
    ],
    evaluators: [
      {
        name: 'villageComplianceEvaluator',
        description: 'Evaluate village OASA compliance',
        handler: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('closer') as CloserEngine;
          return engine.getPrinciplesCompliance(state.villageId);
        },
      },
    ],
    providers: [
      {
        name: 'villageDataProvider',
        description: 'Export full village data for interop',
        get: async (runtime: any, message: any, state: any) => {
          const engine = runtime.getService('closer') as CloserEngine;
          return engine.exportVillageData(state.villageId);
        },
      },
    ],
    services: [
      {
        name: 'closer',
        description: 'Closer Engine Service',
        start: async (runtime: any) => { runtime.services.set('closer', new CloserEngine()); },
        stop: async (runtime: any) => { runtime.services.delete('closer'); },
      },
    ],
  },

  'tq-virginia': {
    name: 'tq-virginia',
    description: 'Virginia Network Integration: N3 dynamic weight, Berry vesting, Colony mapping, DHO federation',
    actions: [
      {
        name: 'computeN3Weight',
        description: 'Compute dynamic N3 weight from TQ + AUT + Peer + Urbanika + Colony + Vesting',
        handler: async (runtime: any, message: any, state: any) => {
          // Integration point with Virginia Vesting Gateway
          return { weight: 1.85, factors: { tq: 0.6, aut: 0.2, peer: 0.1, urbanika: 0.05, colony: 0.03, vesting: 0.02 } };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Mi peso N3 actual', assistant: 'Peso N3: 1.85. TQ: 60%, AUT: 20%, Peer: 10%, Urbanika: 5%, Colony: 3%, Vesting: 2%' }]],
      },
      {
        name: 'claimVesting',
        description: 'Claim available ZNU vesting tranche',
        handler: async (runtime: any, message: any, state: any) => {
          return { znuReleased: 1250, newWeight: 1.92, colonyReputationGain: 50, potAccessUnlocked: ['pot-development', 'pot-ecosystem'] };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Reclama mi vesting', assistant: 'Vesting reclamado: 1250 ZNU. Nuevo peso: 1.92. Pots desbloqueados: development, ecosystem' }]],
      },
      {
        name: 'federateDHO',
        description: 'Initiate DHO federation with treaty',
        handler: async (runtime: any, message: any, state: any) => {
          return { success: true, treatyId: 'treaty_abc', message: 'Federación iniciada. Requiere consentimiento ambas asambleas.' };
        },
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Federar con DHO vecino', assistant: 'Tratado creado: treaty_abc. Pendiente consentimiento.' }]],
      },
    ],
    evaluators: [
      {
        name: 'n3WeightEvaluator',
        description: 'Evaluate current N3 weight',
        handler: async (runtime: any, message: any, state: any) => 1.85,
      },
      {
        name: 'vestingReadinessEvaluator',
        description: 'Check if vesting claim is available',
        handler: async (runtime: any, message: any, state: any) => true,
      },
    ],
    providers: [
      {
        name: 'virginiaMappingProvider',
        description: 'Provide Virginia N1/N2/N3 domain mapping',
        get: async (runtime: any, message: any, state: any) => ({
          n1RootDomainId: 'domain-root-zeitnus',
          n2SubDomainIds: ['domain-governance', 'domain-ecosystem', 'domain-tech'],
          n3ProjectDomainIds: ['proj-regeneration', 'proj-education', 'proj-infrastructure'],
          n3FundDomainIds: ['fund-ecosystem', 'fund-development', 'fund-emergency'],
        }),
      },
    ],
    services: [
      {
        name: 'virginia',
        description: 'Virginia Network Service',
        start: async (runtime: any) => { /* Initialize Virginia gateway */ },
        stop: async (runtime: any) => { /* Cleanup */ },
      },
    ],
  },

  'tq-colony': {
    name: 'tq-colony',
    description: 'Colony Protocol Integration: Domains, Pots, Reputation, Lazy Consensus',
    actions: [
      {
        name: 'createDomain',
        description: 'Create a Colony domain',
        handler: async (runtime: any, message: any, state: any) => ({ domainId: `domain_${Date.now()}`, status: 'created' }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Crea dominio tesorería', assistant: 'Dominio creado: domain_abc. Pot ID: pot_treasury' }]],
      },
      {
        name: 'moveFunds',
        description: 'Move funds between pots (requires reputation)',
        handler: async (runtime: any, message: any, state: any) => ({ txHash: `0x${Date.now().toString(16)}`, status: 'executed' }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Mueve 1000 ZNU a pot-ecosystem', assistant: 'Fondos movidos. Tx: 0xabc. Reputación requerida: 500' }]],
      },
      {
        name: 'claimReputation',
        description: 'Claim reputation for completed work',
        handler: async (runtime: any, message: any, state: any) => ({ reputationGained: 100, newTotal: 1250 }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Reclama reputación por entrega', assistant: 'Reputación +100. Total: 1250. Acceso a pot-development desbloqueado.' }]],
      },
    ],
    evaluators: [],
    providers: [],
    services: [],
  },

  'tq-berry-vesting': {
    name: 'tq-berry-vesting',
    description: 'Berry Vesting Schedule: ZNU gradual release, AUT milestones, Peer verification',
    actions: [
      {
        name: 'checkVestingEligibility',
        description: 'Check if vesting tranche is claimable',
        handler: async (runtime: any, message: any, state: any) => ({ eligible: true, nextTranche: 1250, unlockDate: Date.now() + 86400000 * 30 }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: '¿Puedo reclamar vesting?', assistant: 'Sí. Próxima tranche: 1250 ZNU. Desbloquea en 30 días.' }]],
      },
    ],
    evaluators: [],
    providers: [],
    services: [],
  },

  'tq-valueflows': {
    name: 'tq-valueflows',
    description: 'ValueFlows REA Integration: Economic Events, Resources, Recipes, Processes',
    actions: [
      {
        name: 'recordEconomicEvent',
        description: 'Record a ValueFlows economic event',
        handler: async (runtime: any, message: any, state: any) => ({ eventId: `vf_${Date.now()}`, status: 'recorded' }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Registra transferencia 500 kWh solar', assistant: 'Evento VF registrado: vf_abc. Transfer 500 kWh solar → grid' }]],
      },
    ],
    evaluators: [],
    providers: [],
    services: [],
  },

  'tq-aragon': {
    name: 'tq-aragon',
    description: 'Aragon OSx Integration: Governance, Tokenomics, AGPs, OTF',
    actions: [
      {
        name: 'createAGP',
        description: 'Create an Aragon Governance Proposal',
        handler: async (runtime: any, message: any, state: any) => ({ agpId: `agp_${Date.now()}`, status: 'draft' }),
        validate: async (runtime: any, message: any) => true,
        examples: [[{ user: 'Crea AGP para cambio tokenomics', assistant: 'AGP creado: agp_abc. En editorial review.' }]],
      },
    ],
    evaluators: [],
    providers: [],
    services: [],
  },
};

// ============================================================================
// AUTÓMATA SOBERANO RUNTIME
// ============================================================================

export interface AutomataSoberanoRuntime {
  character: ElizaCharacter;
  plugins: Map<string, ElizaPlugin>;
  services: Map<string, any>;
  memory: {
    conversations: Map<string, MessageExample[]>;
    knowledge: Map<string, any>;
    embeddings: Map<string, number[]>;
    tqLedger: TQTransaction[];
  };
  state: 'initializing' | 'ready' | 'processing' | 'error';
  discoCat: DisCO_CAT_Engine;
  oasa: OASAConstitutionEngine;
  closer: CloserEngine;
}

export function createAutomataSoberanoRuntime(): AutomataSoberanoRuntime {
  const character = ElizaCharacterFactory.createZeitnusAutomata();
  const discoCat = new DisCO_CAT_Engine();
  const oasa = new OASAConstitutionEngine();
  const closer = new CloserEngine();

  return {
    character,
    plugins: new Map(Object.entries(zeitnusPlugins)),
    services: new Map([
      ['disco-cat', discoCat],
      ['oasa', oasa],
      ['closer', closer],
    ]),
    memory: {
      conversations: new Map(),
      knowledge: new Map(),
      embeddings: new Map(),
      tqLedger: [],
    },
    state: 'ready',
    discoCat,
    oasa,
    closer,
  };
}

// ============================================================================
// MESSAGE PROCESSING
// ============================================================================

export interface ProcessedMessage {
  intent: string;
  entities: Record<string, any>;
  actions: Array<{ plugin: string; action: string; params: any }>;
  response: string;
}

export async function processMessage(
  runtime: AutomataSoberanoRuntime,
  message: { author: { id: string; name: string }; content: string }
): Promise<ProcessedMessage> {
  // Simple intent classification based on keywords
  const content = message.content.toLowerCase();
  let intent = 'general';
  const entities: Record<string, any> = {};
  const actions: Array<{ plugin: string; action: string; params: any }> = [];

  if (content.includes('contribución') || content.includes('livelihood') || content.includes('love') || content.includes('care')) {
    intent = 'record_contribution';
    entities.flowType = content.includes('livelihood') ? 'livelihood' : content.includes('love') ? 'love' : 'care';
    entities.value = parseFloat(content.match(/\d+/)?.[0] || '0');
    entities.description = content;
    actions.push({ plugin: 'tq-disco-cat', action: 'recordContribution', params: entities });
  } else if (content.includes('propuesta') || content.includes('propongo')) {
    intent = 'propose_decision';
    entities.proposal = content;
    actions.push({ plugin: 'tq-disco-cat', action: 'proposeConsentDecision', params: entities });
  } else if (content.includes('consiento') || content.includes('preocupación') || content.includes('bloqueo')) {
    intent = 'vote_consent';
    entities.choice = content.includes('consiento') ? 'consent' : content.includes('preocupación') ? 'concern' : 'block';
    actions.push({ plugin: 'tq-disco-cat', action: 'voteConsent', params: entities });
  } else if (content.includes('cumplimiento') || content.includes('oasa') || content.includes('principios')) {
    intent = 'check_compliance';
    actions.push({ plugin: 'tq-oasa', action: 'calculateCompliance', params: { villageId: message.author.id } });
  } else if (content.includes('peso n3') || content.includes('weight n3')) {
    intent = 'check_n3_weight';
    actions.push({ plugin: 'tq-virginia', action: 'computeN3Weight', params: {} });
  } else if (content.includes('vesting') || content.includes('reclamar')) {
    intent = 'check_vesting';
    actions.push({ plugin: 'tq-berry-vesting', action: 'checkVestingEligibility', params: {} });
  } else if (content.includes('federar') || content.includes('federation')) {
    intent = 'federate_dho';
    actions.push({ plugin: 'tq-virginia', action: 'federateDHO', params: {} });
  } else if (content.includes('reservar') || content.includes('booking') || content.includes('estancia')) {
    intent = 'book_stay';
    actions.push({ plugin: 'tq-closer', action: 'bookStay', params: {} });
  }

  // Generate response based on intent
  const responses: Record<string, string> = {
    record_contribution: `Entendido. Registrando contribución en ${entities.flowType || 'flujo'} por ${entities.value || 'X'} unidades.`,
    propose_decision: 'Propuesta registrada. Se abrirá proceso de consentimiento (umbral 80%).',
    vote_consent: `Voto ${entities.choice || 'registrado'}. Se actualizará ratio de consentimiento.`,
    check_compliance: 'Consultando cumplimiento OASA...',
    check_n3_weight: 'Calculando peso N3 dinámico (TQ + AUT + Peer + Urbanika + Colony + Vesting)...',
    check_vesting: 'Verificando elegibilidad de vesting ZNU...',
    federate_dho: 'Iniciando proceso de federación DHO. Requiere tratado y consentimiento.',
    book_stay: 'Consultando disponibilidad en Closer...',
    general: 'Entendido. ¿En qué puedo ayudar con la gobernanza regenerativa, DisCO CAT, OASA, Virginia Network, o Closer?',
  };

  return {
    intent,
    entities,
    actions,
    response: responses[intent] || responses.general,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const automataSoberano = createAutomataSoberanoRuntime();
export default automataSoberano;