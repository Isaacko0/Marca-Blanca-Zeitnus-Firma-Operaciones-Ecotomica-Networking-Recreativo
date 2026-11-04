// Social Asset Specs — Types & State
// Specs exactas: Deck, Carrusel IG, Post IG, Stories, Diplomas, Papelería, Campaña
// Isomorfo a Soul.MBA Applications (specs extraídas del manual real)

export type AssetType = 'deck' | 'carousel' | 'post' | 'stories' | 'diploma' | 'stationery' | 'campaign';

export interface AssetSpec {
  id: string;
  type: AssetType;
  name: string;
  description: string;
  dimensions: { width: number; height: number };
  rules: string[];
  components: string[];
  lockupUsage: 'full' | 'minimal' | 'none';
  rhythm?: 'alternating' | 'clustered';
  safeZone?: { top: number; bottom: number; left: number; right: number }; // px or %
  template?: string; // SVG template string
}

export interface DeckSpec extends AssetSpec {
  type: 'deck';
  slides: Array<{
    id: string;
    name: string;
    layout: 'cover' | 'section' | 'content' | 'cifra' | 'cita' | 'cierre';
    rules: string[];
  }>;
  rhythm: 'alternating';
  lockupUsage: 'minimal'; // Solo en última lámina
}

export interface CarouselSpec extends AssetSpec {
  type: 'carousel';
  cards: number; // 5 fixed
  flow: string[]; // ['gancho', 'tension', 'idea', 'prueba', 'cierre']
  registerChanges: boolean;
  lockupUsage: 'minimal'; // Solo última tarjeta
}

export interface PostSpec extends AssetSpec {
  type: 'post';
  format: 'feed' | 'carousel';
  safeZone: { top: number; bottom: number };
  captionRules: string[];
  lockupUsage: 'none'; // Nunca en el post
}

export interface StoriesSpec extends AssetSpec {
  type: 'stories';
  safeZonePercent: number; // 70% central
  safeZonePx: { top: number; bottom: number };
  maxDuration: number; // seconds per story
  lockupUsage: 'minimal';
}

export interface DiplomaSpec extends AssetSpec {
  type: 'diploma';
  orientation: 'landscape';
  paper: 'cotton' | 'premium';
  lockupUsage: 'none'; // Triqueta completa en tinta
  elements: {
    name: { font: 'serif'; size: string; style: 'italic' };
    rule: { color: 'lime'; width: string; position: 'under-name' };
    sub: { font: 'label'; size: string; case: 'uppercase' };
  };
}

export interface StationerySpec extends AssetSpec {
  type: 'stationery';
  items: ('business_card' | 'letterhead' | 'envelope' | 'email_signature')[];
  businessCard: {
    front: 'black_bg + lockup';
    back: 'lime_bg + black_dot';
  };
  emailSignature: {
    format: 'plain_text';
    maxLines: 4;
    noBanner: true;
  };
}

export interface CampaignSpec extends AssetSpec {
  type: 'campaign';
  pieces: Array<{
    id: string;
    name: string;
    type: 'announcement' | 'landing' | 'diagnostic' | 'email' | 'call' | 'welcome' | 'certificate';
    register: 'shadow' | 'light';
    visualAsset?: boolean;
    isConversation?: boolean; // "Llamada" = conversación real
  }>;
  rhythm: 'alternating'; // sombra/luz/sombra/luz...
  rules: string[];
}

export interface AssetLibraryState {
  specs: Record<AssetType, AssetSpec>;
  generatedAssets: GeneratedAsset[];
  selectedSpec: AssetType | null;

  // Acciones
  getSpec: (type: AssetType) => AssetSpec | undefined;
  generateAsset: (type: AssetType, params: Record<string, any>) => GeneratedAsset;
  exportAsset: (assetId: string, format: 'svg' | 'png' | 'pdf' | 'zip') => Promise<Blob>;
  exportAll: (format: 'zip') => Promise<Blob>;
  setSelectedSpec: (type: AssetType | null) => void;
}

export interface GeneratedAsset {
  id: string;
  type: AssetType;
  name: string;
  params: Record<string, any>;
  svg: string;
  css: string;
  markdown: string;
  createdAt: number;
  brandDNAHash: string;
  voiceHash: string;
}

export const DECK_SPEC: DeckSpec = {
  id: 'deck',
  type: 'deck',
  name: 'Deck de Marca',
  description: '6 láminas fijas, ritmo alternado sombra/luz, lockup solo en cierre',
  dimensions: { width: 1920, height: 1080 },
  rules: [
    'Margen 8% en los cuatro lados',
    'Texto nunca < 24px',
    'Ritmo: sombra → luz → sombra, nunca 3 seguidas del mismo registro',
    'Una palabra en lime por lámina, no en todas',
    'Nunca viñetas ni lámina de "gracias"',
  ],
  components: ['Portada', 'Sección', 'Contenido', 'Cifra', 'Cita', 'Cierre'],
  lockupUsage: 'minimal',
  rhythm: 'alternating',
  slides: [
    { id: 's1', name: 'Portada', layout: 'cover', rules: ['North Star + Brand Signature', 'Fondo sombra', 'Lockup NO'] },
    { id: 's2', name: 'Sección', layout: 'section', rules: ['Título sección + una frase', 'Fondo luz', 'Lockup NO'] },
    { id: 's3', name: 'Contenido', layout: 'content', rules: ['Cuerpo + una cifra', 'Fondo sombra', 'Lockup NO'] },
    { id: 's4', name: 'Cifra', layout: 'cifra', rules: ['Un solo número grande', 'Fondo luz', 'Lockup NO'] },
    { id: 's5', name: 'Cita', layout: 'quote', rules: ['Una frase de firma', 'Fondo sombra', 'Lockup NO'] },
    { id: 's6', name: 'Cierre', layout: 'closing', rules: ['Triqueta + handle', 'Fondo luz', 'Lockup SÍ (minimal)'] },
  ],
};

export const CAROUSEL_SPEC: CarouselSpec = {
  id: 'carousel',
  type: 'carousel',
  name: 'Carrusel Instagram',
  description: '5 tarjetas, ritmo Gancho→Tensión→Idea→Prueba→Cierre, lockup solo en última',
  dimensions: { width: 1080, height: 1080 },
  rules: [
    '5 tarjetas, no 7',
    'Gancho → Tensión → Idea → Prueba → Cierre',
    'El registro cambia a la mitad',
    'Lockup solo en la última tarjeta',
    '5 rayas de progreso, única decoración',
  ],
  components: ['Card 1: Gancho', 'Card 2: Tensión', 'Card 3: Idea', 'Card 4: Prueba', 'Card 5: Cierre + Lockup'],
  lockupUsage: 'minimal',
  cards: 5,
  flow: ['gancho', 'tension', 'idea', 'prueba', 'cierre'],
  registerChanges: true,
};

export const POST_SPEC: PostSpec = {
  id: 'post',
  type: 'post',
  name: 'Post Instagram',
  description: '1080x1080, feed (no carrusel), fondo sombra + triqueta',
  dimensions: { width: 1080, height: 1080 },
  rules: [
    'Una sola cita o afirmación, nunca dos ideas en un post',
    'Fondo sombra + triqueta, nunca foto de stock',
    'Caption lleva el gancho completo, el post solo la frase',
  ],
  components: ['Imagen (1080x1080)', 'Caption'],
  lockupUsage: 'none',
  format: 'feed',
  safeZone: { top: 0, bottom: 0 },
  captionRules: [
    'Gancho completo en caption',
    'Post solo lleva la frase',
    'Hashtags mínimos (3-5)',
  ],
};

export const STORIES_SPEC: StoriesSpec = {
  id: 'stories',
  type: 'stories',
  name: 'Instagram Stories',
  description: 'Zona segura 70% central, 250px libres arriba/abajo',
  dimensions: { width: 1080, height: 1920 },
  rules: [
    '250px libres arriba y abajo (zona segura 70% central)',
    'Una story, una sola acción',
    'Nunca sticker, GIF ni música de moda',
  ],
  components: ['Story única', 'Acción única'],
  lockupUsage: 'minimal',
  safeZonePercent: 70,
  safeZonePx: { top: 250, bottom: 250 },
  maxDuration: 15,
};

export const DIPLOMA_SPEC: DiplomaSpec = {
  id: 'diploma',
  type: 'diploma',
  name: 'Diplomas',
  description: 'Única pieza centrada del sistema, triqueta completa en tinta',
  dimensions: { width: 297, height: 210 }, // A4 landscape mm
  rules: [
    'Triqueta completa en tinta — nunca el lockup',
    'Regla lime de 2px bajo el nombre, único acento',
    'Papel de algodón, sin marco ornamental',
  ],
  components: ['Nombre (serif, itálica)', 'Regla lime 2px', 'Sub (label, uppercase)'],
  lockupUsage: 'none',
  orientation: 'landscape',
  paper: 'cotton',
  elements: {
    name: { font: 'serif', size: '19px', style: 'italic' },
    rule: { color: 'lime', width: '2px', position: 'under-name' },
    sub: { font: 'label', size: '9.5px', case: 'uppercase' },
  },
};

export const STATIONERY_SPEC: StationerySpec = {
  id: 'stationery',
  type: 'stationery',
  name: 'Papelería',
  description: 'Cara negra + lockup, dorso lime + punto negro, firma texto plano',
  dimensions: { width: 85, height: 55 }, // mm tarjeta
  rules: [
    'Cara negra + lockup, dorso lime + punto negro',
    'Firma de correo: texto plano, sin banner',
    'Documentos: A4, margen 10%',
  ],
  components: ['Tarjeta', 'Firma', 'Documento'],
  lockupUsage: 'full',
  items: ['business_card', 'letterhead', 'envelope', 'email_signature'],
  businessCard: {
    front: 'black_bg + lockup',
    back: 'lime_bg + black_dot',
  },
  emailSignature: {
    format: 'plain_text',
    maxLines: 4,
    noBanner: true,
  },
};

export const CAMPAIGN_SPEC: CampaignSpec = {
  id: 'campaign',
  type: 'campaign',
  name: 'Campaña Completa',
  description: '7 piezas, ritmo de registro alternado, "Llamada" = conversación real',
  dimensions: { width: 0, height: 0 }, // Variable
  rules: [
    'Nunca dos piezas seguidas del mismo registro, salvo donde el manual lo marca a propósito',
    '"Llamada" no lleva pieza visual — es una conversación real, no un asset',
  ],
  components: ['Anuncio', 'Landing', 'Diagnóstico', 'Correo', 'Llamada', 'Bienvenida', 'Certificado'],
  lockupUsage: 'varies',
  rhythm: 'alternating',
  pieces: [
    { id: 'p1', name: 'Anuncio', type: 'announcement', register: 'shadow', visualAsset: true },
    { id: 'p2', name: 'Landing', type: 'landing', register: 'light', visualAsset: true },
    { id: 'p3', name: 'Diagnóstico', type: 'diagnostic', register: 'shadow', visualAsset: true },
    { id: 'p4', name: 'Correo', type: 'email', register: 'light', visualAsset: true },
    { id: 'p5', name: 'Llamada', type: 'call', register: 'shadow', visualAsset: false, isConversation: true },
    { id: 'p6', name: 'Bienvenida', type: 'welcome', register: 'light', visualAsset: true },
    { id: 'p7', name: 'Certificado', type: 'certificate', register: 'shadow', visualAsset: true },
  ],
};

export const ASSET_SPECS: Record<string, any> = {
  deck: DECK_SPEC,
  carousel: CAROUSEL_SPEC,
  post: POST_SPEC,
  stories: STORIES_SPEC,
  diploma: DIPLOMA_SPEC,
  stationery: STATIONERY_SPEC,
  campaign: CAMPAIGN_SPEC,
};

export interface SocialAssetSpecsState {
  specs: typeof ASSET_SPECS;
  generatedAssets: GeneratedAsset[];
  selectedSpec: string | null;

  getSpec: (type: string) => any;
  generateAsset: (type: string, params: Record<string, any>) => GeneratedAsset;
  exportAsset: (assetId: string, format: 'svg' | 'png' | 'pdf' | 'zip') => Promise<Blob>;
  exportAll: (format: 'zip') => Promise<Blob>;
  setSelectedSpec: (type: string | null) => void;
}

export function makeSocialAssetSpecsState() {
  return {
    specs: ASSET_SPECS,
    generatedAssets: [],
    selectedSpec: null,
    getSpec: (type: string) => ASSET_SPECS[type],
    generateAsset: (type: string, params: Record<string, any>) => ({
      id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: type as any,
      name: `${type}_${Date.now()}`,
      params,
      svg: '',
      css: '',
      markdown: '',
      createdAt: Date.now(),
      brandDNAHash: '',
      voiceHash: '',
    }),
    exportAsset: async () => new Blob(),
    exportAll: async () => new Blob(),
    setSelectedSpec: (type) => {},
  };
}