# Spec: memegen Integration — Nodo Piloto Cultural ALRAC Capa 0-3

**Versión:** 0.1.0  
**Fecha:** 2026-10-07  
**Estado:** Draft — Para implementación inmediata  
**Entidad:** memegen.link — Jace Browning (mantenedor único, 20+ contributors)  
**Licencia:** MIT — Compatible, asimilación inmediata  
**Métricas:** 2,054 commits | v11.2 | 1.8k ⭐ | 249 forks | 8+ años

---

## 1. CONTEXTO

### 1.1 Perfil memegen

| Métrica | Valor | Validación ALRAC |
|---------|-------|------------------|
| **API Madura** | **2,054 commits, 8+ años, v11.2** | Código probado en producción |
| **Arquitectura** | **Stateless, URL-based** | Inherentemente federable, cacheable |
| **Templates** | **200+ plantillas culturales** | Vocabulario cultural compartido global |
| **Licencia** | **MIT** | Sin fricción legal, asimilación inmediata |
| **Stack** | Python 3.13, Sanic, Pillow, Poetry | Portable a WASM/FastAPI/Rust |
| **Deploy** | Heroku (Containerfile) | Portable a K8s/VM/Mesh |

### 1.2 Gap Crítico: Centralizado + Fiat-Dependent → HSCSG/ALRAC

memegen opera con **lock-ins y gaps**:
- **Heroku/Sanic/Pillow** — Vendor lock-in plataforma, framework, lib imagen
- **Single Maintainer** — Bus factor 1 (Jace Browning)
- **Fiat Revenue** — GitHub Sponsors + Buy Me Coffee = dependencia fiat
- **Benevolent Dictator** — Sin gobernanza comunitaria, no CEL, no 1a1v
- **Templates Estáticos** — 200+ hardcoded, sin federación user-generated
- **Centralized Ops** — Logs, analytics, costs en Heroku/GitHub
- **No Mesh/DTN** — Requiere internet, no offline-first

**HSCSG/ALRAC aporta exactamente lo que falta:**
- **Principio Anfibio:** WASM pipeline + mesh/DTN (offline-first)
- **Federación CPP:** Template pools cross-cultural + NDO user templates
- **ZNU Credit:** Soberanía financiera (2-3%) + CaaS streams
- **Gobernanza 1a1v:** CEL curation + CDS + γ-CARMIS
- **Mesh/DTN:** Edge rendering offline + Solarpunk mesh

---

## 2. ARQUITECTURA TÉCNICA (HSCSG v15 OS / Zeitnus)

### 2.1 Archivos Core a Crear/Extender

| Archivo | Estado | Propósito |
|---------|--------|-----------|
| `src/core/lib/memegen.ts` | 📋 **NUEVO** | Lógica pura dominio: tipos, equivalencias, factory |
| `src/core/lib/memeTemplateEngine.ts` | 📋 **NUEVO** | Motor templates: config-driven, positions, fonts, styles |
| `src/core/lib/memeCompositionPipeline.ts` | 📋 **NUEVO** | Pipeline imagen: load → text → overlay → composite → encode |
| `src/core/lib/memeAnimationEngine.ts` | 📋 **NUEVO** | Motor animación: text animate, GIF/WebP generation |
| `src/core/lib/memeFontRegistry.ts` | 📋 **NUEVO** | Font registry: families, aliases, licensing, ZNU assets |
| `src/core/lib/memeFormatNegotiation.ts` | 📋 **NUEVO** | Format negotiation: ext + Accept header → encoder |
| `src/core/lib/memeUrlEncoding.ts` | 📋 **NUEVO** | Special char encoding: bijective URL-safe encoding |
| `src/core/lib/memeDimensionEngine.ts` | 📋 **NUEVO** | Dimension scaling: width/height/pad preserving aspect |
| `src/core/lib/memeAssetFederation.ts` | 📋 **NUEVO** | External assets: fetch, cache, transform, composite |
| `src/core/lib/memeTemplateCatalog.ts` | 📋 **NUEVO** | Catalog federado: discovery, search, CPP pools |
| `src/core/lib/memePedagogy.ts` | 📋 **NUEVO** | Meme pedagogy: γ-CARMIS communication effectiveness |
| `src/core/state/memegen.ts` | 📋 **NUEVO** | Tipos estado React/Svelte para UI |
| `src/app/screens/Memegen.tsx` | 📋 **NUEVO** | Pantalla + tabs + nav Aside + i18n |
| `openspec/specs/memegen-integration.md` | ✅ **Base creada** | Spec OpenSpec canónica |

### 2.2 Configuración Nodo memegen (`alrac.ts: createMemegenNode()`)

```typescript
// DID: did:key:memegen-core
// 200+ Templates → CPP Pool federado
// 7 Fuentes → ZNU Credit assets (2-3%)
// Pipeline WASM: Pillow → ImageMagick/WASM
// API: Stateless URL-based → GNAP federated endpoints
// Community: Open API → PHI pipeline "Meme Communicators"
```

---

## 3. ESPECIFICACIONES TÉCNICAS DETALLADAS

### 3.1 Meme Template Engine — Especificación Completa

#### 3.1.1 Tipos Core (Portados de memegen `config.json` schema)

```typescript
// En memeTemplateEngine.ts

interface MemeTemplate {
  id: string;                         // 'buzz', 'ds', 'pigeon', 'rollsafe', etc.
  name: string;
  background: BackgroundConfig;
  textPositions: TextPosition[];
  defaultFont: FontConfig;
  defaultColor: ColorConfig;
  lineSpacing: number;
  maxLines: number;
  styles: Map<string, TemplateStyle>; // variant styles (ej: ds.maga)
  metadata: TemplateMetadata;
}

interface BackgroundConfig {
  type: 'static' | 'animated';
  path: string;                       // local path o URL
  format: 'png' | 'jpg' | 'gif' | 'webp';
  dimensions: { width: number; height: number };
  frames?: number;                    // si animated
  frameDelay?: number;                // ms per frame (gif/webp)
}

interface TextPosition {
  line: number;                       // 0 = top, 1 = bottom, 2+ = additional
  x: number;                          // % from left (0-100)
  y: number;                          // % from top (0-100)
  anchor: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  maxWidth: number;                   // % of image width (0-100)
  maxHeight: number;                  // % of image height (0-100)
  rotation?: number;                  // degrees, default 0
}

interface FontConfig {
  family: string;                     // 'Titillium Web', 'Kalam', 'Impact', etc.
  weight: 'normal' | 'bold' | 'black' | number;
  style: 'normal' | 'italic';
  size: number;                       // pt or px
  color: string;                      // hex o named color
  stroke?: StrokeConfig;
  shadow?: ShadowConfig;
}

interface StrokeConfig {
  width: number;
  color: string;
}

interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

interface ColorConfig {
  primary: string;                    // main text color
  secondary?: string;                 // optional second color for multi-line
}

interface TemplateStyle {
  name: string;
  background?: BackgroundConfig;      // override
  textPositions?: TextPosition[];     // override
  font?: FontConfig;                  // override
  color?: ColorConfig;                // override
  lineSpacing?: number;               // override
}

interface TemplateMetadata {
  category: string;                   // 'reaction', 'advice', 'cultural', 'format', etc.
  tags: string[];                     // searchable tags
  culturalContext: string[];          // ['global', 'us', 'es', 'tech', 'academic', etc.]
  nsfw: boolean;
  creator?: string;                   // original creator if known
  license: 'MIT' | 'CC0' | 'custom' | 'unknown';
  addedDate: string;                  // ISO date
  popularity: number;                 // relative usage score
}
```

#### 3.1.2 Catálogo de Templates Representativo (200+)

```typescript
// Categorías principales (basadas en memegen/templates/ directory)

const TEMPLATE_CATEGORIES = {
  'reaction': ['buzz', 'rollsafe', 'awkward', 'cheems', 'pigeon', 'facepalm', 'mind-blown'],
  'advice': ['badchoice', 'trade-offer', 'both', 'expanding-brain', 'drake', 'distracted'],
  'format': ['ds', 'oprah', 'custom', 'caption', 'top-bottom', 'multi-panel'],
  'cultural': ['futurama', 'simpsons', 'star-wars', 'lotr', 'harry-potter', 'marvel', 'anime'],
  'tech': ['programmer', 'stackoverflow', 'git', 'docker', 'kubernetes', 'linux', 'windows'],
  'academic': ['phd', 'research', 'peer-review', 'grant', 'thesis', 'publication'],
  'business': ['startup', 'investor', 'meeting', 'deadline', 'agile', 'scrum', 'kanban'],
  'social': ['protest', 'activism', 'community', 'mutual-aid', 'cooperative', 'commons'],
  'nature': ['animals', 'plants', 'climate', 'ecology', 'permaculture', 'regeneration'],
  'abstract': ['surreal', 'philosophical', 'meta', 'recursive', 'self-referential'],
};
```

#### 3.1.3 Funciones Motor

```typescript
// Core Engine Functions

// 1. Cargar template por ID
function loadTemplate(templateId: string, catalog: TemplateCatalog): MemeTemplate | null;

// 2. Listar todos los templates
function listTemplates(catalog: TemplateCatalog): MemeTemplate[];

// 3. Buscar templates por query
function searchTemplates(catalog: TemplateCatalog, query: string): MemeTemplate[];

// 4. Obtener estilos de un template
function getTemplateStyles(templateId: string, catalog: TemplateCatalog): TemplateStyle[];

// 5. Renderizar template (delega a composition pipeline)
function renderTemplate(
  template: MemeTemplate,
  texts: string[],
  options: RenderOptions,
  pipeline: CompositionPipeline
): ImageBuffer;

// 6. Validar template config
function validateTemplate(template: MemeTemplate): ValidationResult;

// 7. Crear template desde user input (para NDO)
function createUserTemplate(
  background: ImageBuffer,
  textPositions: TextPosition[],
  font: FontConfig,
  metadata: TemplateMetadata
): MemeTemplate;
```

---

### 3.2 Meme Composition Pipeline — Especificación Completa (WASM Target)

#### 3.2.1 Tipos Core

```typescript
// En memeCompositionPipeline.ts

interface RenderOptions {
  // Dimensiones
  width?: number;                     // target width (px)
  height?: number;                    // target height (px)
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  
  // Layout
  layout?: 'default' | 'top' | 'bottom' | 'center';
  
  // Fuente
  font?: string;                      // font ID o alias ('thick', 'comic', 'he', 'jp')
  fontSize?: number;                  // override default
  
  // Color
  color?: string[];                   // per-line colors (hex o named)
  stroke?: StrokeConfig;              // override
  shadow?: ShadowConfig;              // override
  
  // Background custom
  background?: string;                // custom background URL
  
  // Overlay
  overlay?: OverlayConfig;
  
  // Output
  format: 'png' | 'jpg' | 'gif' | 'webp';
  quality?: number;                   // 1-100 (jpg/webp)
  progressive?: boolean;              // progressive jpeg
  
  // Animation
  animation?: AnimationConfig;
}

interface OverlayConfig {
  url: string;                        // external image URL
  center: [number, number];           // 0-1 relative to top-left
  scale: number;                      // ratio of background dimensions
  opacity?: number;                   // 0-1, default 1
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

interface AnimationConfig {
  type: 'text_animate' | 'background_animate';
  frames: number;                     // default: 15
  frameDelay: number;                 // ms per frame, default 100
  loop: boolean;                      // default: true
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  textAnimation?: TextAnimation;
}

interface TextAnimation {
  lines: TextLineAnimation[];
}

interface TextLineAnimation {
  lineIndex: number;
  animation: 'fade_in' | 'slide_up' | 'slide_down' | 'typewriter' | 'shake' | 'pulse' | 'zoom';
  duration: number;                   // frames
  delay: number;                      // frames before start
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface ImageBuffer {
  data: Uint8Array;
  format: string;
  width: number;
  height: number;
  metadata: ImageMetadata;
}

interface ImageMetadata {
  templateId?: string;
  texts?: string[];
  renderTimeMs: number;
  wasmModule?: string;
  cacheKey?: string;
}
```

#### 3.2.2 Pipeline Stages (Funciones Puras, Componibles, WASM-Compilables)

```typescript
// Pipeline Stage Definitions

type PipelineStageName = 
  | 'load_background'
  | 'prepare_text'
  | 'render_text'
  | 'apply_overlay'
  | 'apply_animation'
  | 'resize'
  | 'encode';

interface PipelineContext {
  template: MemeTemplate;
  texts: string[];
  options: RenderOptions;
  intermediate: Map<string, ImageBuffer>;
  metrics: PipelineMetrics;
}

interface PipelineMetrics {
  stageTimings: Map<PipelineStageName, number>;
  totalTimeMs: number;
  cacheHits: number;
  cacheMisses: number;
  wasmCalls: number;
}

// Stage 1: Load Background
async function stageLoadBackground(ctx: PipelineContext): Promise<ImageBuffer> {
  const { template, options } = ctx;
  
  // Resolve background: custom > template > default
  const bgSource = options.background || template.background.path;
  const bgBuffer = await loadImage(bgSource);  // local cache + mesh/DTN fetch
  
  // Handle animated backgrounds
  if (template.background.type === 'animated' && !options.background) {
    return loadAnimatedBackground(template.background);
  }
  
  return bgBuffer;
}

// Stage 2: Prepare Text (layout calculation)
function stagePrepareText(ctx: PipelineContext): PositionedText[] {
  const { template, texts, options } = ctx;
  
  return texts.map((text, lineIndex) => {
    const position = template.textPositions[lineIndex] || getDefaultPosition(lineIndex, template);
    const font = resolveFont(options.font || template.defaultFont.family, fontRegistry);
    const color = options.color?.[lineIndex] || template.defaultColor.primary;
    
    return {
      text: decodeMemeText(text),  // Apply special char decoding
      position,
      font: { ...template.defaultFont, ...font, size: options.fontSize || font.size },
      color,
      stroke: options.stroke || template.defaultFont.stroke,
      shadow: options.shadow || template.defaultFont.shadow,
      layout: options.layout,
      maxLines: template.maxLines,
    };
  });
}

// Stage 3: Render Text on Image
async function stageRenderText(
  background: ImageBuffer,
  positionedTexts: PositionedText[],
  fontRegistry: FontRegistry
): Promise<ImageBuffer> {
  // WASM: ImageMagick/WASM text rendering
  // Fallback: Pillow (Python) or Canvas (Node)
  return renderTextWASM(background, positionedTexts, fontRegistry);
}

// Stage 4: Apply Overlay
async function stageApplyOverlay(
  base: ImageBuffer,
  overlayConfig: OverlayConfig
): Promise<ImageBuffer> {
  const overlayBuffer = await fetchAndCacheImage(overlayConfig.url);
  return compositeImages(base, overlayBuffer, overlayConfig);
}

// Stage 5: Apply Animation (if configured)
async function stageApplyAnimation(
  base: ImageBuffer,
  animationConfig: AnimationConfig,
  positionedTexts: PositionedText[]
): Promise<ImageBuffer[]> {
  if (animationConfig.type === 'text_animate') {
    return generateTextAnimationFrames(base, positionedTexts, animationConfig);
  } else {
    return generateBackgroundAnimationFrames(base, animationConfig);
  }
}

// Stage 6: Resize/Pad
function stageResize(image: ImageBuffer, options: RenderOptions): ImageBuffer {
  if (!options.width && !options.height) return image;
  
  return resizeAndPad(image, {
    width: options.width,
    height: options.height,
    fit: options.fit || 'contain',
    backgroundColor: 'transparent',
  });
}

// Stage 7: Encode
async function stageEncode(
  image: ImageBuffer | ImageBuffer[],
  format: string,
  quality?: number
): Promise<ImageBuffer> {
  const frames = Array.isArray(image) ? image : [image];
  
  switch (format) {
    case 'png': return encodePNG(frames[0]);
    case 'jpg': case 'jpeg': return encodeJPEG(frames[0], quality || 90);
    case 'gif': return encodeGIF(frames, frames[0].metadata.frameDelay || 100);
    case 'webp': return encodeWebP(frames, quality || 80);
    default: throw new Error(`Unsupported format: ${format}`);
  }
}

// Main Pipeline Orchestrator
async function composeMeme(
  template: MemeTemplate,
  texts: string[],
  options: RenderOptions,
  fontRegistry: FontRegistry
): Promise<ImageBuffer> {
  
  const ctx: PipelineContext = {
    template,
    texts,
    options,
    intermediate: new Map(),
    metrics: { stageTimings: new Map(), totalTimeMs: 0, cacheHits: 0, cacheMisses: 0, wasmCalls: 0 },
  };
  
  const startTime = performance.now();
  
  // Stage 1: Load Background
  const bg = await stageLoadBackground(ctx);
  ctx.intermediate.set('background', bg);
  
  // Stage 2: Prepare Text
  const positionedTexts = stagePrepareText(ctx);
  
  // Stage 3: Render Text
  const withText = await stageRenderText(bg, positionedTexts, fontRegistry);
  ctx.intermediate.set('with_text', withText);
  
  // Stage 4: Overlay (if configured)
  let current = withText;
  if (options.overlay) {
    current = await stageApplyOverlay(current, options.overlay);
    ctx.intermediate.set('with_overlay', current);
  }
  
  // Stage 5: Animation (if configured)
  let frames: ImageBuffer[] = [current];
  if (options.animation) {
    frames = await stageApplyAnimation(current, options.animation, positionedTexts);
  }
  
  // Stage 6: Resize (applied to all frames)
  frames = frames.map(f => stageResize(f, options));
  
  // Stage 7: Encode
  const result = await stageEncode(frames, options.format, options.quality);
  
  ctx.metrics.totalTimeMs = performance.now() - startTime;
  result.metadata.renderTimeMs = ctx.metrics.totalTimeMs;
  result.metadata.wasmModule = 'memeCompositionPipeline';
  
  return result;
}
```

---

### 3.3 Special Character Encoding — Especificación Exacta

```typescript
// En memeUrlEncoding.ts — Bijective encoding rules (exactos de memegen)

interface EncodingRule {
  pattern: string;
  replacement: string;
  description: string;
}

const MEME_ENCODING_RULES: EncodingRule[] = [
  // Spaces
  { pattern: '_', replacement: ' ', description: 'underscore to space' },
  { pattern: '-', replacement: ' ', description: 'dash to space' },
  { pattern: '__', replacement: '_', description: 'double underscore to underscore' },
  { pattern: '--', replacement: '-', description: 'double dash to dash' },
  
  // Special chars
  { pattern: '~n', replacement: '\n', description: 'tilde-n to newline' },
  { pattern: '~q', replacement: '?', description: 'tilde-q to question mark' },
  { pattern: '~a', replacement: '&', description: 'tilde-a to ampersand' },
  { pattern: '~p', replacement: '%', description: 'tilde-p to percent' },
  { pattern: '~h', replacement: '#', description: 'tilde-h to hash/pound' },
  { pattern: '~s', replacement: '/', description: 'tilde-s to slash' },
  { pattern: '~b', replacement: '\\', description: 'tilde-b to backslash' },
  { pattern: '~l', replacement: '<', description: 'tilde-l to less-than' },
  { pattern: '~g', replacement: '>', description: 'tilde-g to greater-than' },
  { pattern: "''", replacement: '"', description: 'double single quote to double quote' },
];

// Emoji support (aliases :thumbsup: → 👍)
const EMOJI_ALIASES: Map<string, string> = new Map([
  ['thumbsup', '👍'], ['thumbsdown', '👎'], ['heart', '❤️'], ['fire', '🔥'],
  ['star', '⭐'], ['sparkles', '✨'], ['rocket', '🚀'], ['eyes', '👀'],
  ['brain', '🧠'], ['exploding_head', '🤯'], ['clown', '🤡'], ['skull', '💀'],
  // ... 100+ aliases
]);

// Encoding function (URL → display text)
function decodeMemeText(encoded: string): string {
  let decoded = encoded;
  
  // Apply rules in order (longer patterns first to avoid double replacement)
  const sortedRules = [...MEME_ENCODING_RULES].sort((a, b) => b.pattern.length - a.pattern.length);
  
  for (const rule of sortedRules) {
    decoded = decoded.replaceAll(rule.pattern, rule.replacement);
  }
  
  // Replace emoji aliases
  for (const [alias, emoji] of EMOJI_ALIASES) {
    decoded = decoded.replaceAll(`:${alias}:`, emoji);
  }
  
  return decoded;
}

// Decoding function (display text → URL) — for generating share URLs
function encodeMemeText(text: string): string {
  let encoded = text;
  
  // Replace emoji with aliases first
  for (const [alias, emoji] of EMOJI_ALIASES) {
    encoded = encoded.replaceAll(emoji, `:${alias}:`);
  }
  
  // Apply reverse rules (order matters!)
  encoded = encoded.replaceAll('\\', '~b');
  encoded = encoded.replaceAll('/', '~s');
  encoded = encoded.replaceAll('>', '~g');
  encoded = encoded.replaceAll('<', '~l');
  encoded = encoded.replaceAll('#', '~h');
  encoded = encoded.replaceAll('%', '~p');
  encoded = encoded.replaceAll('&', '~a');
  encoded = encoded.replaceAll('?', '~q');
  encoded = encoded.replaceAll('\n', '~n');
  encoded = encoded.replaceAll('"', "''");
  encoded = encoded.replaceAll('-', '--');
  encoded = encoded.replaceAll('_', '__');
  encoded = encoded.replaceAll(' ', '-');  // or '_' - memegen accepts both
  
  return encoded;
}
```

---

### 3.4 CPP Pools Específicos memegen

```typescript
// En memegen.ts: MEMEGEN_DEFAULT_CPP_POOLS

const MEMEGEN_DEFAULT_CPP_POOLS: CPPPoolConfig[] = [
  {
    id: 'pool_meme_templates_core',
    name: 'Memegen Core Templates (200+)',
    description: 'Curated cultural templates from memegen.link — global recognition',
    authority: { type: 'dao', daoAddress: 'memegen_templates.eth' },
    commitmentTypes: [
      'meme_template',
      'template_style', 
      'template_variant'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_meme_templates_core', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 1000n, 
        periodDays: 30 
      },
      {
        fromPool: 'pool_meme_templates_core',
        toPool: 'solapunk_culture_pool',
        rate: { numerator: 1n, denominator: 1n },
        curated: true,
        maxAmountPerPeriod: 200n,
        periodDays: 7
      }
    ],
    boundaryCuration: [
      {
        id: 'template_cultural_sensitivity',
        sourcePool: 'pool_meme_templates_core',
        targetSystem: 'cpp_pool',
        targetId: 'external_community',
        allowedCommitmentTypes: ['meme_template'],
        requiresCuratorApproval: true,
        minQualityScore: 0.7,
        culturalSensitivityCheck: true,
        nsfwFilter: true,
        maxVolumePerPeriod: 100n,
        periodDays: 7
      }
    ],
    exposureLimit: {
      maxTotalExposure: 10000n,
      maxPerCounterparty: 500n,
      maxPerCommitmentType: 2000n,
      riskWeight: { 'meme_template': 1.0, 'template_style': 0.5 }
    },
  },
  {
    id: 'pool_meme_templates_community',
    name: 'Community Contributed Templates',
    description: 'User-generated templates federated via NDO Layer 1',
    authority: { type: 'consensus', curators: [], threshold: 0.66 },
    commitmentTypes: [
      'meme_template',
      'template_style',
      'font_asset'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_meme_templates_community', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 500n, 
        periodDays: 30 
      }
    ],
    exposureLimit: {
      maxTotalExposure: 5000n,
      maxPerCounterparty: 200n,
      riskWeight: { 'meme_template': 1.0, 'font_asset': 1.5 }
    },
  },
  {
    id: 'pool_meme_fonts',
    name: 'Meme Font Assets',
    description: 'Licensed fonts for meme generation — Titillium, Kalam, Impact, Noto, HG Mincho',
    authority: { type: 'algorithmic', curators: [], algorithmConfig: { categorization: 'font_family', quality: 'license_verified' } },
    commitmentTypes: [
      'font_asset'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_meme_fonts', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 100n, 
        periodDays: 30 
      }
    ],
  },
  {
    id: 'pool_meme_pedagogy',
    name: 'Meme Pedagogy & Communication Protocols',
    description: 'γ-CARMIS validated meme communication patterns for education/organizing',
    authority: { type: 'dao', daoAddress: 'memegen_pedagogy.eth' },
    commitmentTypes: [
      'communication_pattern',
      'pedagogical_template',
      'cultural_protocol'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_meme_pedagogy', 
        toPool: 'phi_education_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 200n, 
        periodDays: 30 
      }
    ],
  },
];
```

---

### 3.5 Font Registry con ZNU Credit

```typescript
// En memeFontRegistry.ts

interface FontAsset {
  id: string;                         // 'titilliumweb', 'kalam', 'impact', etc.
  family: string;                     // Display name
  aliases: string[];                  // ['thick'], ['comic'], etc.
  path: string;                       // local path en fonts/
  license: FontLicense;
  formats: ('ttf' | 'otf' | 'woff' | 'woff2')[];
  weights: number[];                  // [400, 700, 900]
  styles: ('normal' | 'italic')[];
  subsets: string[];                  // ['latin', 'latin-ext', 'cyrillic', 'hebrew', 'japanese']
  znuConfig: ZNUFontConfig;
}

interface FontLicense {
  type: 'SIL-OFL' | 'MIT' | 'Apache-2.0' | 'Custom' | 'Unknown';
  url: string;
  commercialUse: boolean;
  modification: boolean;
  redistribution: boolean;
  attributionRequired: boolean;
}

interface ZNUFontConfig {
  creditEligible: boolean;            // true para fonts con license compatible
  creditRate: number;                 // 2-3% por uso comercial
  vestingPeriodDays: number;          // 365 días default
  creatorDID?: DID;                   // font creator si conocido
  foundryDID?: DID;                   // foundry/publisher
}

// Font Registry por defecto (basado en memegen/fonts/)
const DEFAULT_FONT_REGISTRY: FontAsset[] = [
  {
    id: 'titilliumweb',
    family: 'Titillium Web',
    aliases: ['thick'],
    path: 'fonts/TitilliumWeb-Black.ttf',
    license: { type: 'SIL-OFL', url: 'https://scripts.sil.org/OFL', commercialUse: true, modification: true, redistribution: true, attributionRequired: true },
    formats: ['ttf', 'woff2'],
    weights: [900],
    styles: ['normal'],
    subsets: ['latin', 'latin-ext'],
    znuConfig: { creditEligible: true, creditRate: 0.025, vestingPeriodDays: 365 },
  },
  {
    id: 'kalam',
    family: 'Kalam',
    aliases: ['comic'],
    path: 'fonts/Kalam-Regular.ttf',
    license: { type: 'SIL-OFL', url: 'https://scripts.sil.org/OFL', commercialUse: true, modification: true, redistribution: true, attributionRequired: true },
    formats: ['ttf', 'woff2'],
    weights: [400],
    styles: ['normal'],
    subsets: ['latin', 'latin-ext', 'devanagari'],
    znuConfig: { creditEligible: true, creditRate: 0.025, vestingPeriodDays: 365 },
  },
  {
    id: 'impact',
    family: 'Impact',
    aliases: [],
    path: 'fonts/Impact.ttf',
    license: { type: 'Custom', url: 'https://www.dafontfree.io/impact-font/', commercialUse: true, modification: false, redistribution: false, attributionRequired: false },
    formats: ['ttf'],
    weights: [400],
    styles: ['normal'],
    subsets: ['latin'],
    znuConfig: { creditEligible: false, creditRate: 0, vestingPeriodDays: 0 },  // License restrictiva
  },
  {
    id: 'notosans',
    family: 'Noto Sans',
    aliases: [],
    path: 'fonts/NotoSans-Bold.ttf',
    license: { type: 'SIL-OFL', url: 'https://scripts.sil.org/OFL', commercialUse: true, modification: true, redistribution: true, attributionRequired: true },
    formats: ['ttf', 'woff2'],
    weights: [700],
    styles: ['normal'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'],
    znuConfig: { creditEligible: true, creditRate: 0.025, vestingPeriodDays: 365 },
  },
  {
    id: 'notosanshebrew',
    family: 'Noto Sans Hebrew',
    aliases: ['he'],
    path: 'fonts/NotoSansHebrew-Bold.ttf',
    license: { type: 'SIL-OFL', url: 'https://scripts.sil.org/OFL', commercialUse: true, modification: true, redistribution: true, attributionRequired: true },
    formats: ['ttf', 'woff2'],
    weights: [700],
    styles: ['normal'],
    subsets: ['hebrew'],
    znuConfig: { creditEligible: true, creditRate: 0.025, vestingPeriodDays: 365 },
  },
  {
    id: 'hgminchob',
    family: 'HG Mincho B',
    aliases: ['jp'],
    path: 'fonts/HGMinchoB.ttf',
    license: { type: 'Custom', url: 'https://japanesefonts.org/hg-mincho-b.html', commercialUse: true, modification: false, redistribution: false, attributionRequired: true },
    formats: ['ttf'],
    weights: [700],
    styles: ['normal'],
    subsets: ['japanese', 'latin'],
    znuConfig: { creditEligible: false, creditRate: 0, vestingPeriodDays: 0 },
  },
];
```

---

## 4. MAPEO A ARQUITECTURA ALRAC 5 CAPAS

| Capa ALRAC | memegen Aporte | Implementación HSCSG |
|------------|----------------|---------------------|
| **0 Epistémica** | *Ausente* | γ-CARMIS: "meme-template mismatch detection" — validar encaje cultural |
| **0.5 Normativa** | *Ausente* | 7 Principios Javier + CEL: curation templates, cultural sensitivity, nsfw filter |
| **1 Contable-Física** | *Ausente* | TQ: 1 meme = 1 TQ (energía comunicación); LEF: render energy catalog |
| **2 Interoperabilidad** | API stateless + URLs | CPP pools templates + NDO user templates + GNAP federated endpoints |
| **3 Membrana Fiat** | Sponsors/Coffee | Coop memers + ZNU 2-3% + priceParity + CaaS revenue streams |

---

## 5. PLAN DE CONVERSIÓN PROGRESIVA (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1)
```bash
# Contacto: Jace Browning (@jacebrowning)
# Canales: GitHub profile email / Twitter / GitHub Sponsors page
# Carta ALRAC Master §10 personalizada
# γ-CARMIS Preview: 5 casos meme-template mismatch
# RAO Verification Lite en repo memegen
```

### Fase 1: Piloto Mínimo Viable (Semana 2-4)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **Meme Pipeline WASM** | `memeCompositionPipeline.ts` + WASM | Pipeline offline 100+ memes | 100% parity con Pillow |
| **Template CPP Pool** | `cpp.ts` + `memeTemplateCatalog.ts` | 2 pools federados + exchangeRules | 50 templates federados, 3 nodos |
| **Font Registry ZNU** | `memeFontRegistry.ts` + ZNU | 7 fuentes como activos ZNU 2-3% | 7 fonts registradas, 2 nodos |
| **Meme Pedagogy γ-CARMIS** | `kernelProtocol` + `memePedagogy.ts` | 50 usuarios entrenados | αʰ post > 0.8 |
| **Custom Template NDO** | `nondominium` NDO Layer 1 | 10 templates NDO creados | 100% provenance tracking |

### Fase 2: Escalamiento (Semana 5-10)
- Nodo memegen en HSCSG v15 OS → `.gnap` + `RAO` + `DID`
- Federación comunidades meméticas globales → CPP pools cross-cultural
- Federación educadores → PHI pipeline meme-based learning
- Constitución cooperativa memers + developers + educators
- Despliegue nodo meme offline (WASM + mesh DTN Solarpunk)

### Fase 3: Autonomía Plena (Mes 3-12)
- ALRAC = vehículo comercial memegen (Paso 0 con Jace)
- Red nodos meme federados: comunidades + educadores + core
- Gobernanza 1a1v → GAIA COMMONS
- Economía mixta: TQ (memes) + ZNU (fonts/assets) + USD sponsors

---

## 6. SINERGIAS CRÍTICAS

| Proyecto HSCSG | Sinergia | Mecanismo |
|----------------|----------|-----------|
| **Solarpunk Utopia** | Mesh/DTN memes offline + edge rendering | `meshNode` + `memeCompositionPipeline.wasm` |
| **Nondominium** | NDO templates = recurso cultural federado | `NdoHardLink` templates ↔ styles ↔ fonts |
| **Ruddick/GEF** | Memes educación económica (mweria/kaya) | `trustBasket.ts` + `memeTemplateEngine.ts` |
| **Samay** | Memes comunicación territorial/agua | `waterDesign.ts` + `memePedagogy.ts` |
| **+Colonia** | Memes comunicación urbana/masterplan | `colonya.ts` + `memeTemplateEngine.ts` |
| **Feria Conuquera** | Memes trueque/comunidad | `feria.ts` + `memePedagogy.ts` |
| **Febhouse** | Memes arquitectura/solar analysis | `sunDiagramEngine.ts` + `memeCompositionPipeline.ts` |
| **Soulpreneurs** | Memes conscious business | Cohorte "Meme Communicators" PHI |
| **Bancassol** | Memes educación financiera | `bancassol.ts` + `memePedagogy.ts` |

---

## 7. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Bus Factor 1 (Jace) | Alta | Crítico | Federación multi-nodo + CPP pools compartidos |
| Heroku lock-in | Media | Alto | Containerfile → K8s/VM + mesh/DTN deployment |
| Pillow CPU bottleneck | Media | Medio | WASM (ImageMagick) + WebGPU acceleration |
| Cultural bias templates | Alta | Medio | CEL curation + CPP pools per cultural context |
| NSFW/Abuse | Media | Alto | CEL moderation + γ-CARMIS detection |
| External URLs (style/background) | Media | Medio | Local cache + mesh/DTN + IPFS/Filecoin |
| No rate limiting | Media | Alto | TQ accounting per request + CPP exposure limits |
| Font licensing | Baja | Medio | Solo fonts SIL-OFL/MIT/Apache en registry |

---

## 8. MÉTRICAS DE ÉXITO (90 días / 1 año)

| KPI | Target 90 días | Target 1 año |
|-----|----------------|--------------|
| Meme Pipeline WASM | 1 meme offline | 10,000+/mes |
| Template CPP Pools | 2 pools + rules | 10 pools culturales |
| Font Registry ZNU | 7 fonts | 20+ fonts federadas |
| Custom Template NDO | 1 NDO template | 100+ NDO templates |
| `memegen_integration.md` | ✅ Completa | v2 |
| `openspec/specs/memegen-integration.md` | Creada | PVL compliant |
| Carta Jace Browning | Enviada | Respuesta |
| Agente `memegen-node` GNAP | Registrado | Heartbeat activo |
| Cohorte PHI "Meme Communicators" | 50 inscritos | 200 + facilitadores |
| Decisión ALRAC = vehículo | Definida | Ejecutada |
| Federación 5+ comunidades | Piloto CPP | 20+ nodos |
| Velocity ZNU > 0 | Medible | Autosustentable |

---

## 9. PRÓXIMOS PASOS INMEDIATOS (Esta Semana)

### Día 1-2: Fundación
- [x] Backup `docs/memegen_backup.md` ✅
- [x] Integration `docs/memegen_integration.md` ✅
- [ ] Registrar contacto Jace Browning en `caasOutreach` board

### Día 3-4: Contacto Estratégico
- [ ] Enviar carta ALRAC Master §10 a Jace Browning
- [ ] Solicitar γ-CARMIS Preview (5 casos)
- [ ] RAO Verification Lite en repo

### Día 5-7: Técnico
- [ ] Crear `openspec/specs/memegen-integration.md`
- [ ] Implementar `src/core/lib/memegen.ts` + tipos
- [ ] Implementar `src/core/lib/memeTemplateEngine.ts`
- [ ] Implementar `src/core/lib/memeCompositionPipeline.ts`
- [ ] Registrar agente `memegen-node` en `.gnap/agents.json`

---

## 10. REFERENCIAS CRUZADAS

| Documento | Actualización |
|-----------|---------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12: Añadir memegen colaboración cultural |
| `docs/GRANALLIANZA_MAPPING.md` | Holones GAIA + MYCELIUM + PHI |
| `openspec/specs/SPEC_INDEXER.md` | Añadir `memegen-integration.md` |
| `src/core/lib/alrac.ts` | Extender `MemegenNode`, `MemeTemplate` |
| `Solarpunk_Utopia_Mapping.md` | Mesh/DTN edge rendering case |

---

## 11. CONCLUSIÓN: memegen COMO NODO PILOTO CULTURAL

**memegen cumple condiciones únicas:**
1. ✅ API madura, stateless, inherentemente federable
2. ✅ 200+ templates = vocabulario cultural global vivo
3. ✅ MIT License = asimilación sin fricción legal
4. ✅ Gap exacto: Centralizado + fiat-dependent + no-gobernanza → **HSCSG/ALRAC resuelve**

**Conversión progresiva** via pilotos que demuestren valor:
- WASM Pipeline → offline/edge deployment
- CPP Pools → diversidad cultural + curation comunitaria
- ZNU Fonts → sostenibilidad licensing + compensación creadores
- Meme Pedagogy → comunicación efectiva + resistencia desinformación
- NDO Templates → soberanía usuario + derechos remix

---

> **Nota de spec:** OpenSpec PVL. Implementación TypeScript en `src/core/lib/` = referencia ejecutable.
> **memegen + Solarpunk + Ruddick/GEF + Febhouse = Cuadratura cultural/visual/territorial/ancestral** para ALRAC.
>
> **La pala y el teclado están en tus manos. E=V.**