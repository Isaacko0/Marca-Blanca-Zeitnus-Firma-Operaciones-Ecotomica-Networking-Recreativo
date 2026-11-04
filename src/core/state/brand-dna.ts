// Brand DNA — Types & State
// BranDNA: 70 signos + Villano (3 caras) + Signature + Brain
// Isomorfo a happpy.mba Brand Brain (52/70 signos completados)

export type SignCategory = 'core' | 'voice' | 'visual' | 'method' | 'offer' | 'execution' | 'system';

export interface BrandSign {
  id: string;
  category: SignCategory;
  key: string;
  label: string;
  value: string;
  confidence: number; // 0-1
  source: 'interview' | 'paste' | 'import' | 'inferred';
  ts: number;
  verified: boolean;
}

export interface VillainFace {
  id: 'external' | 'internal' | 'philosophical';
  label: string;
  description: string;
  riskIfRepeated: string[]; // Lo que arriesga: Fun, Focus, Flow, Family, Friends, Fulfillment, Fit, Faith, Fortune
}

export interface BrandSignature {
  text: string; // "Take the BUSY out of BUSINESS"
  shortText: string; // "BUSY"
  lang: 'es' | 'en';
}

export interface BrainSign {
  id: string;
  category: SignCategory;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  version: string;
  description: string;
  dependencies: string[];
  lastUpdated: number;
}

export interface BrandDNAState {
  // Identidad
  projectName: string;
  brandHandle: string;
  brandIni: string;
  startDate: string; // ISO

  // Villano (3 caras)
  villain: {
    external: VillainFace;
    internal: VillainFace;
    philosophical: VillainFace;
  };

  // Firma
  signature: BrandSignature;

  // Categoría y Diferenciador
  category: string; // "Storyselling y worldbuilding"
  differentiator: string; // "IA × IE"

  // 70 Signos del Brand Brain
  signs: BrandSign[];
  brainSigns: BrainSign[];

  // Métricas
  totalSigns: number;
  completedSigns: number;
  brainScore: number; // 0-100

  // Acciones
  setProjectMeta: (meta: Partial<Pick<BrandDNAState, 'projectName' | 'brandHandle' | 'brandIni' | 'startDate'>>) => void;
  setVillainFace: (face: keyof BrandDNAState['villain'], faceData: VillainFace) => void;
  setSignature: (sig: BrandSignature) => void;
  setCategory: (cat: string) => void;
  setDifferentiator: (diff: string) => void;
  addSign: (sign: Omit<BrandSign, 'id' | 'ts'>) => void;
  updateSign: (id: string, updates: Partial<BrandSign>) => void;
  removeSign: (id: string) => void;
  verifySign: (id: string) => void;
  addBrainSign: (sign: Omit<BrainSign, 'id' | 'lastUpdated'>) => void;
  updateBrainSign: (id: string, updates: Partial<BrainSign>) => void;
  computeMetrics: () => void;
}

export const DEFAULT_VILLAIN: BrandDNAState['villain'] = {
  external: {
    id: 'external',
    label: 'El Sacrificio Externo',
    description: 'El negocio que no se siente tuyo — construyes para otros, sigues playbooks ajenos, alquilas tu talento.',
    riskIfRepeated: ['Fun', 'Focus', 'Flow', 'Family', 'Friends', 'Fulfillment', 'Fit', 'Faith', 'Fortune'],
  },
  internal: {
    id: 'internal',
    label: 'El Sacrificio Interno',
    description: 'Agotamiento, salud, tiempo — pagas el precio con tu cuerpo y mente para construir algo que no es tuyo.',
    riskIfRepeated: ['Fun', 'Focus', 'Flow', 'Family', 'Friends', 'Fulfillment', 'Fit', 'Faith', 'Fortune'],
  },
  philosophical: {
    id: 'philosophical',
    label: 'El Sacrificio Filosófico',
    description: 'Nadie debería tener que quemarse para construir algo propio. El patrón es evitable, no inevitable.',
    riskIfRepeated: ['Fun', 'Focus', 'Flow', 'Family', 'Friends', 'Fulfillment', 'Fit', 'Faith', 'Fortune'],
  },
};

export const DEFAULT_SIGNATURE: BrandSignature = {
  text: 'Take the BUSY out of BUSINESS',
  shortText: 'BUSY',
  lang: 'en',
};

export const DEFAULT_CATEGORY = 'Storyselling y worldbuilding';
export const DEFAULT_DIFFERENTIATOR = 'IA × IE';

export const DEFAULT_BRAIN_SIGNS: BrainSign[] = [
  // Core (1-10)
  { id: 'bs1', category: 'core', name: 'Instrucciones del Project', status: 'pending', version: '1.0', description: 'Instrucciones maestras del proyecto', dependencies: [], lastUpdated: 0 },
  { id: 'bs2', category: 'core', name: 'BranDNA', status: 'completed', version: '1.4', description: 'ADN de marca completo', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs3', category: 'core', name: 'Voz Maestra', status: 'completed', version: '4.1', description: 'Voz de marca definitoria', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs4', category: 'core', name: 'Guías de voz', status: 'completed', version: '1.0', description: 'Guías por canal/formato', dependencies: ['bs3'], lastUpdated: Date.now() },
  { id: 'bs5', category: 'core', name: 'Identidad visual', status: 'completed', version: '5.3', description: 'Sistema visual completo', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs6', category: 'core', name: 'Banco de pruebas', status: 'in_progress', version: '1.0', description: 'Testimonios y casos', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs7', category: 'core', name: 'Guardián y Carrusel', status: 'completed', version: '1.0', description: 'Guardián de marca + carrusel de contenido', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs8', category: 'core', name: 'Plan de 90 días', status: 'completed', version: '1.0', description: 'Plan operacional 90 días', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs9', category: 'core', name: 'Disciplinas y guías de voz', status: 'completed', version: '1.0', description: '15 disciplinas operacionales', dependencies: ['bs4'], lastUpdated: Date.now() },
  { id: 'bs10', category: 'core', name: 'Lock: brand-happpy-mba.md', status: 'completed', version: '5', description: 'Documento canon de marca', dependencies: [], lastUpdated: Date.now() },

  // Voice (11-20)
  { id: 'bs11', category: 'voice', name: 'Arquetipo: Decano', status: 'completed', version: '1.0', description: 'Decano que no teme incomodar', dependencies: ['bs3'], lastUpdated: Date.now() },
  { id: 'bs12', category: 'voice', name: 'Tono: Contraintuitivo', status: 'completed', version: '1.0', description: 'Dice lo opuesto al gurú promedio', dependencies: ['bs11'], lastUpdated: Date.now() },
  { id: 'bs13', category: 'voice', name: 'Tono: Afirma, no promete', status: 'completed', version: '1.0', description: 'Frases declarativas, nunca "vas a lograrlo"', dependencies: ['bs11'], lastUpdated: Date.now() },
  { id: 'bs14', category: 'voice', name: 'Tono: Cercano, no condescendiente', status: 'completed', version: '1.0', description: 'Segunda persona, como par', dependencies: ['bs11'], lastUpdated: Date.now() },
  { id: 'bs15', category: 'voice', name: 'Tono: Filoso con humor', status: 'completed', version: '1.0', description: 'Humor para que el punto se quede', dependencies: ['bs11'], lastUpdated: Date.now() },
  { id: 'bs16', category: 'voice', name: 'Tono: Generoso con sustancia', status: 'completed', version: '1.0', description: 'Regala info, vende implementación', dependencies: ['bs11'], lastUpdated: Date.now() },
  { id: 'bs17', category: 'voice', name: 'Vocabulario: Propósito vs Pasión', status: 'completed', version: '1.0', description: 'Nunca "encuentra tu pasión"', dependencies: ['bs3'], lastUpdated: Date.now() },
  { id: 'bs18', category: 'voice', name: 'Vocabulario: Soulpreneur', status: 'completed', version: '1.0', description: 'No "emprendedor" ni "empresario"', dependencies: ['bs17'], lastUpdated: Date.now() },
  { id: 'bs19', category: 'voice', name: 'Frases de firma (6)', status: 'completed', version: '1.0', description: '6 frases canon de marca', dependencies: ['bs3'], lastUpdated: Date.now() ),
  { id: 'bs20', category: 'voice', name: 'Así / Así no', status: 'completed', version: '1.0', description: 'Grid de ejemplos de voz', dependencies: ['bs11'], lastUpdated: Date.now() ),

  // Visual (21-30)
  { id: 'bs21', category: 'visual', name: 'Trío color: Vacío/Aliento/Chispa', status: 'completed', version: '1.0', description: '#101010 / #f7faff / #afeb00', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs22', category: 'visual', name: 'Semáforo 5 estados', status: 'completed', version: '1.0', description: 'Sprout/Lime/Amber/Ember/Red', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs23', category: 'visual', name: 'Tipografía dual Jost+Manrope', status: 'completed', version: '1.0', description: '8 roles, 4 fuentes', dependencies: [], lastUpdated: Date.now() },
  { id: 'bs23', category: 'visual', name: 'Espacio: escala 2-110', status: 'completed', version: '1.0', description: 'Margen 10%, rejilla 2px', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs24', category: 'visual', name: 'Sombra 4 niveles', status: 'completed', version: '1.0', description: 'Contacto/Pieza/Alta/Dura', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs25', category: 'visual', name: 'Movimiento: 1 curva, 3 números', status: 'completed', version: '1.0', description: '420ms/70ms/140-200ms', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs26', category: 'visual', name: 'Triqueta 34s + 6 variantes', status: 'completed', version: '1.0', description: 'SVG animado, 6 variantes color', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs27', category: 'visual', name: 'Componentes 14 (4 grupos)', status: 'completed', version: '1.0', description: 'Marca/Core/Superficies/Formularios', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs28', category: 'visual', name: 'Lockup + SoulDot + Triqueta', status: 'completed', version: '1.0', description: '3 elementos de marca', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs29', category: 'visual', name: 'Specs sociales exactas', status: 'completed', version: '1.0', description: 'Deck/Carrusel/Post/Stories/Diploma/Papel/Campaña', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs30', category: 'visual', name: 'Campaña 7 piezas ritmo', status: 'completed', version: '1.0', description: 'Ritmo alternado sombra/luz', dependencies: [], lastUpdated: Date.now() ),

  // Method (31-40)
  { id: 'bs31', category: 'method', name: 'Día 0 diagnóstico', status: 'completed', version: '1.0', description: 'Multi-sistema antes de pedir un peso', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs32', category: 'method', name: 'Blueprint 27 días', status: 'completed', version: '1.0', description: 'Kaufman + Aulet + TEDx real', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs33', category: 'method', name: 'Día 22: venta real', status: 'completed', version: '1.0', description: 'Obliga venta real, no plan teórico', dependencies: ['bs32'], lastUpdated: Date.now() ),
  { id: 'bs33', category: 'method', name: 'Fundador = Caso 0', status: 'completed', version: '1.0', description: 'Pepe ya escaló Happpy con misma filosofía', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs34', category: 'method', name: 'Método 5INCO', status: 'completed', version: '1.0', description: 'Modelo que enseña = modelo que vende', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs35', category: 'method', name: 'Disciplinas operativas', status: 'completed', version: '1.0', description: 'Decide · Delega · Desecha', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs36', category: 'method', name: 'VIP = Pepe en persona', status: 'completed', version: '1.0', description: 'No escalable a propósito', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs37', category: 'method', name: 'Cobra tu versión completa', status: 'completed', version: '1.0', description: 'Sin descuento por modo Clark Kent', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs38', category: 'method', name: 'Mantra: Entre más vidas cambias', status: 'completed', version: '1.0', description: 'Más cambia tu vida', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs39', category: 'method', name: '11 Fun-damentos', status: 'completed', version: '1.0', description: 'Fun, Focus, Flow, Family, Friends, Fulfillment, Fit, Faith, Fortune (+2)', dependencies: [], lastUpdated: Date.now() ),

  // Offer (41-50)
  { id: 'bs41', category: 'offer', name: '4 ofertas con precio', status: 'completed', version: '1.0', description: 'Gratis / $333 / $3,333 / $33,333', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs42', category: 'offer', name: 'Escalera de valor', status: 'completed', version: '1.0', description: 'Diagnóstico → Blueprint → PRO → Insignia', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs43', category: 'offer', name: 'Blueprint 27 días', status: 'completed', version: '1.0', description: 'Producto insignia', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs44', category: 'offer', name: 'Happpy $333/mes', status: 'completed', version: '1.0', description: 'Comunidad + templates', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs45', category: 'offer', name: 'Happpier $3,333/mes', status: 'completed', version: '1.0', description: 'Implementación guiada', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs46', category: 'offer', name: 'Happpiest $33,333', status: 'completed', version: '1.0', description: 'Transformación 1:1 con Pepe', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs47', category: 'offer', name: 'Categoría: MBA de 28 días', status: 'completed', version: '1.0', description: 'No "curso online" ni "coaching"', dependencies: ['bs41'], lastUpdated: Date.now() ),
  { id: 'bs48', category: 'offer', name: 'Estrategia: Pez grande, estanque chico', status: 'completed', version: '1.0', description: 'Subsegmento: soulpreneurs recovering sacrificers', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs49', category: 'offer', name: 'Caso 0 vivido = defendible día 1', status: 'completed', version: '1.0', description: 'Pepe = subsegmento exacto', dependencies: ['bs33'], lastUpdated: Date.now() ),
  { id: 'bs50', category: 'offer', name: 'One-liners (4 candidatos)', status: 'completed', version: '1.0', description: '4 one-liners candidatos', dependencies: [], lastUpdated: Date.now() ),

  // Execution (51-60)
  { id: 'bs51', category: 'execution', name: 'Deck 6 láminas fijas', status: 'completed', version: '1.0', description: 'Portada/Sección/Contenido/Cifra/Cita/Cierre', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs52', category: 'execution', name: 'Carrusel IG 5 tarjetas', status: 'completed', version: '1.0', description: 'Gancho/Tensión/Idea/Prueba/Cierre', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs53', category: 'execution', name: 'Post IG 1080x1080', status: 'completed', version: '1.0', description: 'Fondo sombra + triqueta', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs54', category: 'execution', name: 'Stories zona segura 70%', status: 'completed', version: '1.0', description: '250px libres arriba/abajo', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs55', category: 'execution', name: 'Diplomas: triqueta tinta', status: 'completed', version: '1.0', description: 'Única pieza centrada del sistema', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs56', category: 'execution', name: 'Papelería: cara negra/dorso lime', status: 'completed', version: '1.0', description: 'Firma texto plano, sin banner', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs57', category: 'execution', name: 'Campaña 7 piezas ritmo', status: 'completed', version: '1.0', description: 'Ritmo alternado, "Llamada" = conversación real', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs58', category: 'execution', name: 'Multi-agente 4 + Campaign Map', status: 'completed', version: '1.0', description: 'Entrevista → BranDNA → Offer → Mensaje → Campaign Map', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs59', category: 'execution', name: 'ACP Protocol', status: 'completed', version: '1.0', description: 'Agent Communication Protocol', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs60', category: 'execution', name: 'Brand Workbench', status: 'in_progress', version: '1.0', description: 'Editor visual + Campaign Composer + Asset Library', dependencies: [], lastUpdated: Date.now() ),

  // System (61-70)
  { id: 'bs61', category: 'system', name: 'HSCSG isomorfismo', status: 'completed', version: '1.0', description: 'Leyes I/II/III + CaaS + ZNU + CDS', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs62', category: 'system', name: 'Modo anfibio (ZNU/USD)', status: 'completed', version: '1.0', description: 'priceParity 0.02, nodeMode postmonetario', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs63', category: 'system', name: 'CaaS + RAO', status: 'completed', version: '1.0', description: 'Contribuciones verificadas', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs64', category: 'system', name: 'Vasos comunicantes cross-repo', status: 'completed', version: '1.0', description: '6 conexiones obligatorias', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs65', category: 'system', name: 'CaaS Tier: Custodio', status: 'completed', version: '1.0', description: 'Tier base para soulpreneurs', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs66', category: 'system', name: 'ZNU: priceParity 0.02', status: 'completed', version: '1.0', description: 'Oráculo ReFi Nivel 3', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs66', category: 'system', name: 'CaaS + RAO + ZNU integrados', status: 'completed', version: '1.0', description: 'Infraestructura postmonetaria', dependencies: ['bs62', 'bs63', 'bs65'], lastUpdated: Date.now() ),
  { id: 'bs67', category: 'system', name: 'Cross-repo: DNA ↔ IE ↔ Loop → Assets → Export', status: 'completed', version: '1.0', description: 'CDS → OAD → COS → ITC → FRS', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs68', category: 'system', name: 'Categoría prestada: MBA', status: 'completed', version: '1.0', description: 'Redefinido: 28 días vs 2 años/$200k', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs69', category: 'system', name: 'Estrategia: Pez grande, estanque chico', status: 'completed', version: '1.0', description: 'Subsegmento defendingible desde día 1', dependencies: [], lastUpdated: Date.now() ),
  { id: 'bs70', category: 'system', name: 'Brand Workbench v1', status: 'in_progress', version: '1.0', description: 'Editor + Composer + Library + Voice Playground + Export Hub', dependencies: [], lastUpdated: Date.now() ),
];

export interface BrandDNAState {
  projectName: string;
  brandHandle: string;
  brandIni: string;
  startDate: string;

  villain: {
    external: VillainFace;
    internal: VillainFace;
    philosophical: VillainFace;
  };

  signature: BrandSignature;
  category: string;
  differentiator: string;

  signs: BrandSign[];
  brainSigns: BrainSign[];

  totalSigns: number;
  completedSigns: number;
  brainScore: number;

  setProjectMeta: (meta: Partial<Pick<BrandDNAState, 'projectName' | 'brandHandle' | 'brandIni' | 'startDate'>>) => void;
  setVillainFace: (face: keyof BrandDNAState['villain'], faceData: VillainFace) => void;
  setSignature: (sig: BrandSignature) => void;
  setCategory: (cat: string) => void;
  setDifferentiator: (diff: string) => void;
  addSign: (sign: Omit<BrandSign, 'id' | 'ts'>) => void;
  updateSign: (id: string, updates: Partial<BrandSign>) => void;
  removeSign: (id: string) => void;
  verifySign: (id: string) => void;
  addBrainSign: (sign: Omit<BrainSign, 'id' | 'lastUpdated'>) => void;
  updateBrainSign: (id: string, updates: Partial<BrainSign>) => void;
  computeMetrics: () => void;
}

export function makeBrandDNAState(): BrandDNAState {
  return {
    projectName: 'happpy.mba · la marca matriz',
    brandHandle: '@happpy.mba',
    brandIni: 'HM',
    startDate: '2026-11-11',

    villain: DEFAULT_VILLAIN,
    signature: DEFAULT_SIGNATURE,
    category: DEFAULT_CATEGORY,
    differentiator: DEFAULT_DIFFERENTIATOR,

    signs: [],
    brainSigns: DEFAULT_BRAIN_SIGNS,

    totalSigns: 70,
    completedSigns: 52,
    brainScore: 74,

    setProjectMeta: (meta) => {},
    setVillainFace: (face, faceData) => {},
    setSignature: (sig) => {},
    setCategory: (cat) => {},
    setDifferentiator: (diff) => {},
    addSign: (sign) => {},
    updateSign: (id, updates) => {},
    removeSign: (id) => {},
    verifySign: (id) => {},
    addBrainSign: (sign) => {},
    updateBrainSign: (id, updates) => {},
    computeMetrics: () => {},
  };
}