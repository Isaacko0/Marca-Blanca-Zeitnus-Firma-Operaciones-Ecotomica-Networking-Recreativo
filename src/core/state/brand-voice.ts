// Brand Voice — Types & State
// Voz: Arquetipo + 5 rasgos + Vocabulario estricto + Do/Dont + Frases de firma
// Isomorfo a Soul.MBA Voice (Decano que no le teme a incomodar)

export type VoiceTrait = 'contraintuitivo' | 'afirma' | 'cercano' | 'filoso' | 'generoso';

export interface VoiceTraitDetail {
  id: VoiceTrait;
  label: string;
  description: string;
  example: string;
  antiExample: string;
}

export interface VocabularyRule {
  forbidden: string;      // "encuentra tu pasión"
  replacement: string;    // "propósito"
  context: string;        // "copy de marca, headlines, CTAs"
  severity: 'error' | 'warning' | 'info';
}

export interface VoiceQuote {
  id: string;
  text: string;
  tag: string; // "Hook", "La octava capa", "Creencia contraintuitiva", etc.
  source: 'decan' | 'happpy' | 'soulmba' | 'contento';
  views?: string; // "100k+ orgánicos"
}

export interface DoDontPair {
  do: string;
  dont: string;
  category: 'hook' | 'structure' | 'vocab' | 'tone' | 'cta';
}

export interface AudienceProfile {
  name: string; // "Recovering Sacrificer"
  description: string; // "Ya sacrificó demasiado para crecer..."
  painPoints: string[]; // ["Construyó algo ajeno", "Se quemó", "Probó cursos hustle", "MBA $200k"]
  desiredOutcomes: string[]; // ["Saber si el negocio es suyo", "Dinero real en 27 días", "No sacrificar Fun/Focus/Flow/Family"]
}

export interface VoiceArchetype {
  name: string; // "El Decano que no le teme a incomodar"
  backstory: string; // "30+ empresas, 1000+ conferencias, 4 TEDx, cert. Business Made Simple"
  personality: string; // "Contraintuitivo, provocador, con evidencia"
  authority: string[]; // ["Happpy 200+ grads", "4 TEDx", "1000+ conferencias 8 países", "Cert. Business Made Simple"]
  empathy: string; // "Ya vivió el mismo sacrificio 30+ veces"
}

export interface BrandVoiceState {
  // Arquetipo
  archetype: VoiceArchetype;

  // Audiencia
  audience: AudienceProfile;

  // 5 Rasgos tonales
  traits: Record<VoiceTrait, VoiceTraitDetail>;

  // Vocabulario estricto
  vocabulary: VocabularyRule[];

  // Do / Don't
  doDont: DoDontPair[];

  // Frases de firma (6 canon)
  quotes: VoiceQuote[];

  // Vocabulario de audiencia
  audienceVocab: {
    hero: string;       // "soulpreneur"
    notHero: string[];  // ["emprendedor", "empresario"]
    problem: string;    // "Sacrificio"
    villain: string;    // "El Sacrificio"
    guide: string;      // "El Decano"
    plan: string;       // "Blueprint 27 días"
    success: string;    // "Dueño de su negocio"
    failure: string;    // "Gerente del de otro"
  };

  // Acciones
  setArchetype: (arch: Partial<VoiceArchetype>) => void;
  setAudience: (aud: Partial<AudienceProfile>) => void;
  updateTrait: (trait: VoiceTrait, updates: Partial<VoiceTraitDetail>) => void;
  addVocabularyRule: (rule: VocabularyRule) => void;
  removeVocabularyRule: (forbidden: string) => void;
  addDoDont: (pair: DoDontPair) => void;
  removeDoDont: (index: number) => void;
  addQuote: (quote: VoiceQuote) => void;
  updateQuote: (id: string, updates: Partial<VoiceQuote>) => void;
  filterVocabulary: (text: string) => { clean: string; flags: Array<{ forbidden: string; replacement: string; index: number }> };
  checkTone: (text: string) => { score: number; flags: string[] };
}

export const DEFAULT_VOICE_ARCHETYPE: VoiceArchetype = {
  name: 'El Decano que no le teme a incomodar',
  backstory: '30+ empresas construidas hasta encontrar la primera que no le costó el alma, 1000+ conferencias en 8 países, 4 TEDx, certificación Business Made Simple de Donald Miller. Personalidad: contraintuitiva y provocadora — pero siempre con evidencia detrás, nunca solo opinión.',
  backstoryShort: '30+ empresas, 1000+ conferencias, 4 TEDx, cert. Business Made Simple. Habla como quien ya sacrificó todo y encontró otra forma.',
  personality: 'Contraintuitivo, provocador, con evidencia — nunca solo opinión. Habla como quien ya pasó por lo mismo.',
  authority: ['Happpy: 200+ graduados en <1 año, negocio millonario', '4 TEDx', '1000+ conferencias en 8 países', 'Certificación Business Made Simple (Donald Miller)'],
  empathy: 'Ya vivió el mismo sacrificio 30+ veces. No le explica al lector como si fuera nuevo en esto.',
  personalityShort: 'Contraintuitivo, provocador, con evidencia. Habla como quien ya pasó por lo mismo.',
};

export const DEFAULT_AUDIENCE: AudienceProfile = {
  name: 'El Recovering Sacrificer (soulpreneur que ya sacrificó demasiado)',
  description: 'No es el principiante total, y no busca "pasivo sin esfuerzo". Ya lo intentó: construyó algo que no se sentía suyo, o se quemó sacrificando salud, tiempo o familia para lograrlo. Ya probó cursos "hustle" genéricos, comunidades espirituales o de manifestación sin estructura real, y el MBA tradicional de 2 años y $200,000 — y ninguno le funcionó.',
  painPoints: [
    'Construyó algo que no se sentía suyo',
    'Se quemó sacrificando salud, tiempo o familia',
    'Probó cursos "hustle" genéricos',
    'Comunidades espirituales sin estructura real',
    'MBA tradicional: 2 años, $200,000',
    'Ensayo y error sacrificando lo necesario',
  ],
  desiredOutcomes: [
    'Saber en un día si el negocio es suyo',
    'Dinero real entrando en 27 días',
    'No volver a sacrificar Fun, Focus, Flow, Family',
    'Construir un negocio simple, rentable, con alma',
  ],
};

export const DEFAULT_TRAITS: Record<'contraintuitivo' | 'afirma' | 'cercano' | 'filoso' | 'generoso', VoiceTraitDetail> = {
  contraintuitivo: {
    id: 'contraintuitivo',
    label: 'Contraintuitivo',
    description: 'Dice lo opuesto al gurú promedio, y lo sostiene con evidencia. "La pasión es para perdedores" en vez de "encuentra tu pasión".',
    example: '"La pasión es para perdedores. No se puede descubrir porque no está fuera, está adentro."',
    antiExample: '"Encuentra tu pasión y el dinero llegará solo."',
  },
  afirma: {
    id: 'afirma',
    label: 'Afirma, no promete',
    description: 'Frases cortas y declarativas. Nunca "¡vas a lograrlo!" — siempre un hecho verificable o un límite real: veinte personas, una cohorte al año.',
    example: '"Veinte personas. Una cohorte al año."',
    antiExample: '"¡Transforma tu negocio hoy! La experiencia definitiva de crecimiento."',
  },
  cercano: {
    id: 'cercano',
    label: 'Cercano, no condescendiente',
    description: 'Segunda persona, como quien ya pasó por lo mismo. Nunca le explica al lector como si fuera nuevo en esto.',
    example: '"Tu propósito no se descubre. Se construye."',
    antiExample: '"Déjame explicarte qué es un propósito..."',
  },
  filoso: {
    id: 'filoso',
    label: 'Filoso con humor',
    description: 'El hook de Batman, no el meme genérico. El humor existe para que el punto se quede, no para llenar espacio.',
    example: '"A Batman le valen madre los niños de África. Solo le importan los de Ciudad Gótica."',
    antiExample: '"¡JAJAJA! ¿Sabías que...? 😂"',
  },
  generoso: {
    id: 'generoso',
    label: 'Generoso con la sustancia',
    description: 'Da la información completa gratis — vende la implementación, no el secreto. Regala todo, vende hacerlo junto contigo.',
    example: '"Give away the info, sell the implementation."',
    antiExample: '"El secreto está en mi curso de $2,000."',
  },
};

export const DEFAULT_VOCABULARY: VocabularyRule[] = [
  {
    forbidden: 'encuentra tu pasión',
    replacement: 'propósito',
    context: 'copy de marca, headlines, CTAs',
    severity: 'error',
  },
  {
    forbidden: 'emprendedor',
    replacement: 'soulpreneur',
    context: 'referencia a audiencia',
    severity: 'error',
  },
  {
    forbidden: 'empresario',
    replacement: 'soulpreneur',
    context: 'referencia a audiencia',
    severity: 'error',
  },
  {
    forbidden: 'descubre tu pasión',
    replacement: 'construye tu propósito',
    context: 'headlines, CTAs, copy',
    severity: 'error',
  },
  {
    forbidden: 'pasivo sin esfuerzo',
    replacement: 'implementación guiada',
    context: 'ofertas, pricing',
    severity: 'warning',
  },
  {
    forbidden: 'hustle',
    replacement: 'construcción deliberada',
    context: 'metodología, proceso',
    severity: 'warning',
  },
  {
    forbidden: 'manifestación',
    replacement: 'implementación deliberada',
    context: 'metodología, mentalidad',
    severity: 'warning',
  },
  {
    forbidden: 'mindset',
    replacement: 'metodología / estructura',
    context: 'metodología, proceso',
    severity: 'info',
  },
];

export const DEFAULT_DO_DONT: DoDontPair[] = [
  { do: 'Primero el alma.', dont: '¡Transforma tu negocio hoy!', category: 'hook' },
  { do: 'No es un formulario. Es un filtro.', dont: 'La experiencia definitiva de crecimiento', category: 'structure' },
  { do: 'Veinte personas. Una cohorte al año.', dont: 'Descubre el poder de tu potencial', category: 'vocab' },
  { do: 'Tu propósito no se descubre. Se construye.', dont: 'Encuentra tu pasión y el dinero llegará solo', category: 'vocab' },
  { do: 'Cobra tu versión completa, no la reducida.', dont: 'Descuento por vivir en modo Clark Kent', category: 'cta' },
];

export const DEFAULT_QUOTES: VoiceQuote[] = [
  {
    id: 'q1',
    text: '"A Batman le valen madre los niños de África. Solo le importan los de Ciudad Gótica."',
    tag: 'Hook · 100k+ views orgánicos',
    source: 'decan',
    views: '100k+ orgánicos',
  },
  {
    id: 'q2',
    text: '"El tema no solo es qué dices ni cómo lo dices, sino cómo lo dices de forma que nadie más nunca lo pueda decir porque te lo dañaste tú."',
    tag: 'La octava capa',
    source: 'decan',
  },
  {
    id: 'q3',
    text: '"La pasión es para perdedores. No se puede descubrir porque no está fuera, está adentro."',
    tag: 'Creencia contraintuitiva',
    source: 'decan',
  },
  {
    id: 'q4',
    text: '"Con una gran responsabilidad viene un gran poder."',
    tag: 'El flip de Uncle Ben',
    source: 'decan',
  },
  {
    id: 'q5',
    text: '"Entre más vidas cambias, más cambia tu vida."',
    tag: 'Mantra de cierre',
    source: 'decan',
  },
  {
    id: 'q6',
    text: '"Ellos son los héroes de esta historia — yo solo subo al escenario a darles el mensaje que los pone en acción."',
    tag: 'Posicionamiento de escenario',
    source: 'decan',
  },
];

export const DEFAULT_AUDIENCE_VOCAB = {
  hero: 'soulpreneur',
  notHero: ['emprendedor', 'empresario'],
  problem: 'El Sacrificio',
  villain: 'El Sacrificio',
  guide: 'El Decano',
  plan: 'Blueprint 27 días',
  success: 'Dueño de su negocio, no gerente del de otro',
  failure: 'Construir, otra vez, algo que no se siente suyo',
};

export interface BrandVoiceState {
  archetype: VoiceArchetype;
  audience: AudienceProfile;
  traits: Record<'contraintuitivo' | 'afirma' | 'cercano' | 'filoso' | 'generoso', VoiceTraitDetail>;
  vocabulary: VocabularyRule[];
  doDont: DoDontPair[];
  quotes: VoiceQuote[];
  audienceVocab: typeof DEFAULT_AUDIENCE_VOCAB;

  setArchetype: (arch: Partial<VoiceArchetype>) => void;
  setAudience: (aud: Partial<AudienceProfile>) => void;
  updateTrait: (trait: 'contraintuitivo' | 'afirma' | 'cercano' | 'filoso' | 'generoso', updates: Partial<VoiceTraitDetail>) => void;
  addVocabularyRule: (rule: VocabularyRule) => void;
  removeVocabularyRule: (forbidden: string) => void;
  addDoDont: (pair: DoDontPair) => void;
  removeDoDont: (index: number) => void;
  addQuote: (quote: VoiceQuote) => void;
  updateQuote: (id: string, updates: Partial<VoiceQuote>) => void;
  filterVocabulary: (text: string) => { clean: string; flags: Array<{ forbidden: string; replacement: string; index: number }> };
  checkTone: (text: string) => { score: number; flags: string[] };
}

export function makeBrandVoiceState() {
  return {
    archetype: DEFAULT_VOICE_ARCHETYPE,
    audience: DEFAULT_AUDIENCE,
    traits: DEFAULT_TRAITS,
    vocabulary: DEFAULT_VOCABULARY,
    doDont: DEFAULT_DO_DONT,
    quotes: DEFAULT_QUOTES,
    audienceVocab: DEFAULT_AUDIENCE_VOCAB,

    setArchetype: (arch) => {},
    setAudience: (aud) => {},
    updateTrait: (trait, updates) => {},
    addVocabularyRule: (rule) => {},
    removeVocabularyRule: (forbidden) => {},
    addDoDont: (pair) => {},
    removeDoDont: (index) => {},
    addQuote: (quote) => {},
    updateQuote: (id, updates) => {},
    filterVocabulary: (text) => ({ clean: text, flags: [] }),
    checkTone: (text) => ({ score: 100, flags: [] }),
  };
}