// StoryBrand Engine — Types & State
// BrandScript 7 pasos (StoryBrand) + Alternativas + One-liners + Roadmap
// Isomorfo a Soul.MBA Strategy (April Dunford + Donald Miller)

export type StoryBrandStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface StoryBrandStepData {
  step: StoryBrandStep;
  title: string;
  name: string;
  description: string;
  // Datos específicos por paso
  characterWants?: string;        // Paso 1
  problemExternal?: string;       // Paso 2
  problemInternal?: string;
  problemPhilosophical?: string;
  guideEmpathy?: string;          // Paso 3
  guideAuthority?: string;
  planSteps?: string[];           // Paso 4
  ctaPrimary?: string;            // Paso 5
  ctaSecondary?: string;
  failureAvoided?: string;        // Paso 6
  successAchieved?: string;       // Paso 7
}

export interface Alternative {
  id: string;
  name: string;
  description: string;
  category: 'hustle_course' | 'spiritual_community' | 'traditional_mba' | 'trial_error';
  price: string;
  duration: string;
  promise: string;
  reality: string;
}

export interface DistinctiveCapability {
  id: string;
  name: string;
  description: string;
  evidence: string; // Cómo se demuestra
}

export interface OneLiner {
  id: string;
  text: string;
  tag: string; // "candidato 1", "candidato 2", etc.
  score: number; // 0-100 internal rating
}

export interface RoadmapAsset {
  id: string;
  name: string;
  done: boolean;
  priority: number; // 1 = primero
  deadline?: string; // ISO date
  assignee?: string;
  notes?: string;
}

export interface CompetitorIntel {
  id: string;
  name: string;
  price: string;
  messaging: string; // Qué prometen
  language: string;  // Cómo hablan
  archetype: string; // Qué arquetipo proyectan
  buyerJourney: string; // Cómo llevan de desconocido a cliente
  experience: string; // Qué se siente comprarles
  strengths: string[];
  weaknesses: string[];
}

export interface BuyerJourneyStage {
  stage: 'discovery' | 'trust' | 'consideration' | 'conversion' | 'retention';
  description: string;
  touchpoints: string[];
  frictionPoints: string[];
  conversionRate?: number;
}

export interface CredibilityCase {
  id: string;
  graduateName: string;
  result: string; // Resultado concreto
  quote?: string;   // Cita textual
  metrics?: Record<string, number>;
  verified: boolean;
}

export interface StoryBrandState {
  // BrandScript 7 pasos
  script: Record<StoryBrandStep, StoryBrandStepData>;

  // Big Idea
  bigIdea: {
    title: string;
    description: string;
    backstory: string;
    personality: string;
    authority: string[];
    empathy: string;
  };

  // BrandScript estructurado
  brandScript: {
    character: string;
    problem: { external: string; internal: string; philosophical: string };
    guide: { empathy: string; authority: string };
    plan: string[];
    cta: { primary: string; secondary: string };
    failure: string;
    success: string;
  };

  // Alternativas reales
  alternatives: Alternative[];

  // Capacidades distintivas
  capabilities: DistinctiveCapability[];

  // One-liners candidatos
  oneLiners: OneLiner[];

  // Roadmap de assets (18 items)
  roadmap: RoadmapAsset[];

  // Competencia real
  competitors: CompetitorIntel[];

  // Buyer journey
  buyerJourney: BuyerJourneyStage[];

  // Credibility Bank
  credibilityCases: CredibilityCase[];

  // Lo que falta (quiz editable)
  missing: {
    competitors: string;
    buyerJourney: string;
    credibilityCases: string;
  };

  // Acciones
  setScriptStep: (step: StoryBrandStep, data: Partial<StoryBrandStepData>) => void;
  setBigIdea: (idea: Partial<StoryBrandState['bigIdea']>) => void;
  setBrandScript: (script: Partial<StoryBrandState['brandScript']>) => void;
  addAlternative: (alt: Alternative) => void;
  removeAlternative: (id: string) => void;
  addCapability: (cap: DistinctiveCapability) => void;
  removeCapability: (id: string) => void;
  addOneLiner: (liner: OneLiner) => void;
  updateOneLiner: (id: string, updates: Partial<OneLiner>) => void;
  removeOneLiner: (id: string) => void;
  updateRoadmapAsset: (id: string, updates: Partial<RoadmapAsset>) => void;
  addCompetitor: (comp: CompetitorIntel) => void;
  removeCompetitor: (id: string) => void;
  addBuyerJourneyStage: (stage: BuyerJourneyStage) => void;
  addCredibilityCase: (caseData: CredibilityCase) => void;
  setMissing: (key: keyof StoryBrandState['missing'], value: string) => void;
  copySummary: () => string;
}

export const DEFAULT_BRAND_SCRIPT: StoryBrandState['brandScript'] = {
  character: 'Saber si el negocio es suyo, antes de gastar en el equivocado',
  problem: {
    external: 'El negocio que no se siente suyo',
    internal: 'Agotamiento, salud, tiempo — sacrificio real',
    philosophical: 'Nadie debería tener que quemarse para construir algo propio',
  },
  guide: {
    empathy: 'Ya vivió el mismo sacrificio 30+ veces',
    authority: 'Happpy 200+ grads, 4 TEDx, 1000+ conferencias 8 países, Cert. Business Made Simple',
  },
  plan: [
    'Día 0: Diagnóstico multi-sistema antes de pedir un peso',
    'Días 1-27: Blueprint 27 pasos (Kaufman + Aulet + TEDx real)',
    'Día 22: Obliga una venta real — no un plan en Google Docs',
  ],
  cta: {
    primary: 'Empieza por Día 0, no por comprar',
    secondary: 'Diagnóstico gratis → Blueprint 27 días',
  },
  failure: 'Construir, otra vez, algo que no se siente suyo. Meses/años en el negocio equivocado. Pagar el precio de siempre: salud, tiempo, paz.',
  success: 'Dueño de su propio negocio, no gerente del de alguien más. Dinero real entrando en 27 días. No vuelve a sacrificar su Fun, Focus, Flow o Family.',
};

export const DEFAULT_ALTERNATIVES: Alternative[] = [
  {
    id: 'alt1',
    name: 'Cursos "hustle" genéricos (Hotmart/Kajabi)',
    description: 'Prometen "pasivo sin esfuerzo", entregan plantillas genéricas sin estructura real',
    category: 'hustle_course',
    price: '$49-$2,000',
    duration: 'Auto-paced',
    promise: 'Libertad financiera en 30 días',
    reality: 'Plantillas genéricas, sin estructura, sin accountability',
  },
  {
    id: 'alt2',
    name: 'Comunidades espirituales / manifestación',
    description: 'Sin estructura real, solo "mentalidad" y "vibración alta"',
    category: 'spiritual_community',
    price: '$0-$500/mes',
    duration: 'Indefinido',
    promise: 'Atrae abundancia con tu mente',
    reality: 'Sin estructura de negocio real, sin ventas reales',
  },
  {
    id: 'alt3',
    name: 'MBA tradicional',
    description: '2 años, $200,000, para subir de puesto en la empresa de otro',
    category: 'traditional_mba',
    price: '$200,000',
    duration: '2 años',
    promise: 'Subir de puesto / networking élite',
    reality: 'No construyes TU negocio, subes en el de otro. 2 años de oportunidad perdida.',
  },
  {
    id: 'alt4',
    name: 'Ensayo y error sacrificando lo necesario',
    description: 'El camino por defecto: prueba y error quemando salud, tiempo, familia',
    category: 'trial_error',
    price: 'Salud + Tiempo + Paz',
    duration: 'Años',
    promise: 'Aprender haciendo',
    reality: 'Mismo precio de siempre: salud, tiempo, paz. Sin garantía de resultado.',
  },
];

export const DEFAULT_CAPABILITIES: DistinctiveCapability[] = [
  {
    id: 'cap1',
    name: 'Día 0: Diagnóstico multi-sistema',
    description: 'Antes de pedir un peso, diagnóstico multi-sistema del soulpreneur',
    evidence: 'Blueprint input: 7 sistemas diagnosticados antes de Día 1',
  },
  {
    id: 'cap2',
    name: 'Blueprint 27 días (Kaufman + Aulet + TEDx real)',
    description: 'Un solo villano: el Sacrificio. 27 pasos que exigen venta real desde Día 22',
    evidence: 'Día 22 obliga venta real, no plan teórico. Metodología probada en Happpy (200+ grads)',
  },
  {
    id: 'cap3',
    name: 'Día 22 obliga venta real',
    description: 'No un plan en Google Docs — una venta real con dinero real',
    evidence: 'Métrica: % de cohorte con venta real en Día 22 (target >80%)',
  },
  {
    id: 'cap4',
    name: 'Fundador = Caso 0 vivido',
    description: 'Pepe ya escaló Happpy con la misma filosofía. Método 5INCO: el modelo que enseña es el modelo que vende',
    evidence: 'Happpy: 200+ grads en <1 año, negocio millonario, misma filosofía SOUL.MBA',
  },
];

export const DEFAULT_ONE_LINERS: OneLiner[] = [
  { id: 'ol1', text: 'El MBA de 28 días para el soulpreneur que ya sacrificó demasiado para crecer.', tag: 'One-liner · candidato 1', score: 85 },
  { id: 'ol2', text: 'No subas de puesto en la empresa de alguien más. Construye la tuya en 28 días.', tag: 'One-liner · candidato 2', score: 90 },
  { id: 'ol3', text: 'El único MBA que empieza preguntando quién eres, no qué vender.', tag: 'One-liner · candidato 3', score: 88 },
  { id: 'ol4', text: '27 pasos, un solo villano — el Sacrificio.', tag: 'One-liner · candidato 4', score: 92 },
];

export const DEFAULT_ROADMAP: RoadmapAsset[] = [
  { id: 'r1', name: 'StoryBrand BrandScript (ya resuelto arriba, falta pulirlo a copy final)', done: true, priority: 1, deadline: '', assignee: '', notes: '' },
  { id: 'r2', name: 'Taglines de marca y de producto', done: false, priority: 2, deadline: '', assignee: '', notes: '' },
  { id: 'r3', name: 'Nombres de producto / tickets', done: false, priority: 3, deadline: '', assignee: '', notes: '' },
  { id: 'r4', name: 'Descripciones de producto', done: false, priority: 4, deadline: '', assignee: '', notes: '' },
  { id: 'r5', name: 'Copy de empaque (si aplica)', done: false, priority: 5, deadline: '', assignee: '', notes: '' },
  { id: 'r6', name: 'Landing page de marca', done: false, priority: 6, deadline: '', assignee: '', notes: '' },
  { id: 'r7', name: 'Landing pages por producto/ticket', done: false, priority: 7, deadline: '', assignee: '', notes: '' },
  { id: 'r8', name: 'One-liners (candidatos ya arriba, falta elegir uno)', done: false, priority: 8, deadline: '', assignee: '', notes: '' },
  { id: 'r9', name: 'Dominio(s)', done: false, priority: 9, deadline: '', assignee: '', notes: '' },
  { id: 'r10', name: 'Lead generators + landing pages de lead generator', done: false, priority: 10, deadline: '', assignee: '', notes: '' },
  { id: 'r11', name: 'Nurture email campaigns', done: false, priority: 11, deadline: '', assignee: '', notes: '' },
  { id: 'r12', name: 'Sales email campaigns', done: false, priority: 12, deadline: '', assignee: '', notes: '' },
  { id: 'r13', name: 'Sales talking points', done: false, priority: 13, deadline: '', assignee: '', notes: '' },
  { id: 'r14', name: 'Estrategia de video/media', done: false, priority: 14, deadline: '', assignee: '', notes: '' },
  { id: 'r15', name: 'Competencia real — nombres, precios, lo que ya conoces', done: false, priority: 15, deadline: '', assignee: '', notes: 'Pendiente: quiz' },
  { id: 'r16', name: 'Buyer journey — las etapas reales que ves en tus prospectos', done: false, priority: 16, deadline: '', assignee: '', notes: 'Pendiente: quiz' },
  { id: 'r17', name: 'Credibility Bank — casos de clientes reales', done: false, priority: 17, deadline: '', assignee: '', notes: 'Pendiente crítico: quiz' },
  { id: 'r18', name: 'Estrategia de video/media', done: false, priority: 18, deadline: '', assignee: '', notes: '' },
];

export const DEFAULT_MISSING = {
  competitors: '',
  buyerJourney: '',
  credibilityCases: '',
};

export interface StoryBrandState {
  script: Record<number, any>;
  bigIdea: StoryBrandState['bigIdea'];
  brandScript: StoryBrandState['brandScript'];
  alternatives: Alternative[];
  capabilities: DistinctiveCapability[];
  oneLiners: OneLiner[];
  roadmap: RoadmapAsset[];
  competitors: CompetitorIntel[];
  buyerJourney: BuyerJourneyStage[];
  credibilityCases: CredibilityCase[];
  missing: typeof DEFAULT_MISSING;

  setScriptStep: (step: number, data: Partial<any>) => void;
  setBigIdea: (idea: Partial<any>) => void;
  setBrandScript: (script: Partial<any>) => void;
  addAlternative: (alt: Alternative) => void;
  removeAlternative: (id: string) => void;
  addCapability: (cap: DistinctiveCapability) => void;
  removeCapability: (id: string) => void;
  addOneLiner: (liner: OneLiner) => void;
  updateOneLiner: (id: string, updates: Partial<OneLiner>) => void;
  removeOneLiner: (id: string) => void;
  updateRoadmapAsset: (id: string, updates: Partial<RoadmapAsset>) => void;
  addCompetitor: (comp: CompetitorIntel) => void;
  removeCompetitor: (id: string) => void;
  addBuyerJourneyStage: (stage: BuyerJourneyStage) => void;
  addCredibilityCase: (caseData: CredibilityCase) => void;
  setMissing: (key: keyof typeof DEFAULT_MISSING, value: string) => void;
  copySummary: () => string;
}

export function makeStoryBrandState(): StoryBrandState {
  return {
    script: {},
    bigIdea: {
      title: 'Personal Branding Formula — Pepe como Caso 0',
      description: 'Puedes construir un negocio simple, rentable y con alma — sin sacrificarte.',
      backstory: 'Happpy (200+ graduados en menos de 1 año, negocio millonario), 30+ empresas construidas, 1,000+ conferencias en 8 países, 4 TEDx, certificación Business Made Simple de Donald Miller.',
      personality: 'El Decano que no le tiene miedo a incomodar',
      authority: ['Happpy 200+ grads', '4 TEDx', '1000+ conferencias 8 países', 'Cert. Business Made Simple'],
      empathy: 'Ya vivió el mismo sacrificio 30+ veces',
    },
    brandScript: DEFAULT_BRAND_SCRIPT,
    alternatives: DEFAULT_ALTERNATIVES,
    capabilities: DEFAULT_CAPABILITIES,
    oneLiners: DEFAULT_ONE_LINERS,
    roadmap: DEFAULT_ROADMAP,
    competitors: [],
    buyerJourney: [],
    credibilityCases: [],
    missing: DEFAULT_MISSING,

    setScriptStep: (step, data) => {},
    setBigIdea: (idea) => {},
    setBrandScript: (script) => {},
    addAlternative: (alt) => {},
    removeAlternative: (id) => {},
    addCapability: (cap) => {},
    removeCapability: (id) => {},
    addOneLiner: (liner) => {},
    updateOneLiner: (id, updates) => {},
    removeOneLiner: (id) => {},
    updateRoadmapAsset: (id, updates) => {},
    addCompetitor: (comp) => {},
    removeCompetitor: (id) => {},
    addBuyerJourneyStage: (stage) => {},
    addCredibilityCase: (caseData) => {},
    setMissing: (key, value) => {},
    copySummary: () => '',
  };
}