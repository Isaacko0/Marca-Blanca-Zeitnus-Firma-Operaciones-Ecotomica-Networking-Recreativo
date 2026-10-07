# Spec: Febhouse Studio + ArchiDiagram Tools Integration — Nodo Piloto ALRAC Capa 0-3

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Para implementación inmediata  
**Entidad:** Febhouse Studio (Hanoi, Vietnam) — Nam Nguyen (Arquitecto, Verified SketchUp Developer)  
**Ecosistema:** 3 Plugins SketchUp (Sun Diagram, Dynamic Symbols, Shadow Slice) + ArchiDiagram.com (60k+ usuarios)

---

## 1. CONTEXTO

### 1.1 Perfil Febhouse Studio

| Métrica | Valor | Validación ALRAC |
|---------|-------|------------------|
| **Studio Arquitectura** | **9 proyectos** construidos/en construcción (Vietnam) | Casos de uso reales validados |
| **Desarrollo Software** | **3 plugins SketchUp** publicados | Verified SketchUp Extension Vendor |
| **Comunidad** | **60,000+ usuarios** (claim) | Base real, no teórica |
| **Herramientas Core** | Sun Diagram, Dynamic Symbols, Shadow Slice | 3 engines distintos, complementarios |
| **Educación** | Tutorials + Sample SKP files free | PHI nativo validado |
| **Fundador** | Nam Nguyen (Arquitecto + Developer) | Credibilidad técnica dual |

### 1.2 Stack Técnico Validado

| Componente | Tecnología | Validación |
|------------|------------|------------|
| **Solar Analysis** | Algoritmos NOAA/SPA + DST rules | Precisión científica |
| **Coordinate System** | GPS (lat/long) + UTC offsets | Standard global |
| **3D Geometry** | SketchUp Ruby API (entities, groups, components, tags) | Native SketchUp |
| **Export Pipeline** | SketchUp native export (images, animation, PDF) | 4K, 9:16 vertical |
| **Distribution** | Extension Warehouse + Gumroad + SketchUcation | 3 canales |
| **Offline Capable** | Standard/Pro tiers operan offline | Confirmado FAQ |

### 1.3 Gap Crítico: SaaS Centralizado + Vendor Lock-in → HSCSG/ALRAC

Febhouse opera con **lock-ins críticos**:
- **SketchUp/Trimble Ecosystem** — RBZ format, Extension Warehouse, Trimble accounts
- **Centralized Distribution** — Extension Warehouse review process (semanas), single point of control
- **Cloud Activation** — Studio tier requiere Trimble account + SSL verification
- **Proprietary Marketplaces** — Gumroad/SketchUcation para Pro licenses
- **Freemium Extractivo** — Upsell subscription/lifetime, no postmonetario
- **No Governance** — Top-down curación, sin CEL/community curation

**HSCSG/ALRAC aporta exactamente lo que falta:**
- **Principio Anfibio:** WASM engines nativos + mesh/DTN (offline-first)
- **Federación CPP:** Template/Symbol/Style pools cross-studio
- **ZNU Credit:** Soberanía financiera arquitectos (2-3%)
- **Gobernanza 1a1v:** CEL (jurados sorteados) para curación recursos
- **Mesh/DTN:** Colaboración offline sitios/estudios remotos

---

## 2. ARQUITECTURA TÉCNICA (HSCSG v15 OS / Zeitnus)

### 2.1 Archivos Core a Crear/Extender

| Archivo | Estado | Propósito |
|---------|--------|-----------|
| `src/core/lib/febhouse.ts` | 📋 **NUEVO** | Lógica pura dominio: tipos, equivalencias, factory |
| `src/core/lib/sunDiagramEngine.ts` | 📋 **NUEVO** | Motor solar: sunpath 3D, DST, shadows, solstice/equinox |
| `src/core/lib/dynamicSymbolsEngine.ts` | 📋 **NUEVO** | Motor símbolos: swap, color, animation, library |
| `src/core/lib/shadowSliceEngine.ts` | 📋 **NUEVO" | Motor sección: non-destructive slicing, shadow compensation |
| `src/core/lib/diagramStyleEngine.ts` | 📋 **NUEVO** | Styles: edge settings, layers, compass, color schemes |
| `src/core/lib/architecturalDiagramTaxonomy.ts` | 📋 **NUEVO** | Tipología diagramas: site/context/climatic/light/circulation |
| `src/core/lib/sketchupAbstractionLayer.ts` | 📋 **NUEVO** | Bridge SKP ↔ WASM: import/export, round-trip fidelity |
| `src/core/lib/geoLocationEngine.ts` | 📋 **NUEVO** | Lat/Long parsing, timezone, DST rules database |
| `src/core/lib/diagramExportPipeline.ts` | 📋 **NUEVO** | Batch export: resolutions, HUD, frame sequencing |
| `src/core/lib/diagramPedagogy.ts` | 📋 **NUEVO** | Progressive disclosure, pattern recognition, workflow |
| `src/core/state/febhouse.ts` | 📋 **NUEVO** | Tipos estado React/Svelte para UI |
| `src/app/screens/Febhouse.tsx` | 📋 **NUEVO** | Pantalla + tabs + nav Aside + i18n |
| `openspec/specs/febhouse-integration.md` | ✅ **Base creada** | Spec OpenSpec canónica |

### 2.2 Configuración Nodo Febhouse (`alrac.ts: createFebhouseNode()`)

```typescript
// DID: did:key:febhouse-core
// 4 Engines WASM: Solar, Symbols, ShadowSlice, Style
// 3 CPP Pools: templates, symbols, styles (+ styles as sub-pool)
// 9 Proyectos arquitectura Vietnam → NDO resources
// Community: 60k+ architects → PHI pipeline
// SketchUp Bridge: WASM abstraction layer + DTN sync
```

---

## 3. ESPECIFICACIONES TÉCNICAS DETALLADAS

### 3.1 Sun Diagram Engine — Especificación Completa

#### 3.1.1 Tipos Core (WASM Target)

```typescript
// En sunDiagramEngine.ts

// Configuración entrada
interface SunPathConfig {
  // Ubicación
  latitude: number;              // -90 a +90
  longitude: number;             // -180 a +180
  utcOffset: number;             // horas desde UTC (-12 a +14)
  dstEnabled: boolean;           // Daylight Saving Time
  dstRules?: DSTRule[];          // Reglas DST custom
  
  // Rango temporal
  dateRange: { start: Date; end: Date };
  timeRange: { start: number; end: number };  // 0-23 horas locales
  
  // Opciones visuales
  showSunPath: boolean;
  showSkyDome: boolean;
  showHourLabels: boolean;
  labelFormat: '12h' | '24h';
}

// Reglas DST por región
interface DSTRule {
  regionCode: string;            // 'US', 'EU', 'AU', 'BR', 'CL', 'custom'
  name: string;
  start: DSTTransition;          // cuándo inicia DST
  end: DSTTransition;            // cuándo termina DST
  offsetHours: number;           // típicamente 1
}

interface DSTTransition {
  month: number;                 // 1-12
  week: number;                  // 1-5 (week of month)
  dayOfWeek: number;             // 0=Dom...6=Sáb
  hour: number;                  // hora local transición
}

// Posición solar calculada
interface SolarPosition {
  // Coordenadas horizontales
  azimuth: number;               // 0-360° (Norte=0, Este=90)
  altitude: number;              // -90 a +90° (horizonte=0)
  
  // Temporal
  date: Date;                    // fecha local
  time: number;                  // hora local 0-24
  utcTime: Date;                 // UTC correspondiente
  isDST: boolean;                // si DST activo
  
  // Metadata
  declination: number;           // declinación solar
  equationOfTime: number;        // ecuación del tiempo (minutos)
  hourAngle: number;             // ángulo horario
}

// Eventos solares clave
interface SolarEvent {
  name: 'summer_solstice' | 'winter_solstice' | 'spring_equinox' | 'autumn_equinox';
  date: Date;
  sunrise: SolarPosition;
  solarNoon: SolarPosition;
  sunset: SolarPosition;
  dayLength: number;             // horas luz
}

// Geometría edificio para shadow simulation
interface BuildingGeometry {
  elements: BuildingElement[];
  groundPlane: Plane;
  northAngle: number;            // ángulo Norte SketchUp (grados)
}

interface BuildingElement {
  id: string;
  name: string;
  geometry: Mesh3D;              // vértices, caras
  material: Material;
  castsShadows: boolean;
  receivesShadows: boolean;
  tags: string[];                // SketchUp tags
}

// Resultado simulación sombras
interface ShadowSimulation {
  sunPositions: SolarPosition[];
  shadowFrames: ShadowFrame[];
  metadata: SimulationMetadata;
}

interface ShadowFrame {
  sunPosition: SolarPosition;
  shadows: ShadowPolygon[];
  timestamp: Date;
}

interface ShadowPolygon {
  elementId: string;
  polygon: Polygon3D;            // sombra proyectada en ground plane
  area: number;                  // m²
}

interface SimulationMetadata {
  config: SunPathConfig;
  buildingHash: string;          // hash geometría para cache
  computedAt: Date;
  durationMs: number;
  wasmModule: 'sunDiagramEngine';
}
```

#### 3.1.2 Funciones Motor (Puras, WASM-Compilable)

```typescript
// Core Engine Functions

// 1. Cálculo Sunpath principal
function calculateSunPath(config: SunPathConfig): SolarPosition[];

// 2. Simulación sombras completa
function simulateShadows(config: SunPathConfig, building: BuildingGeometry): ShadowSimulation;

// 3. Eventos solares clave (solsticios/equinoccios)
function calculateSolarEvents(lat: number, long: number, year: number, utcOffset: number): SolarEvent[];

// 4. Parsing coordenadas (múltiples formatos)
function parseCoordinates(input: string): { lat: number; long: number } | null;
// Soporta: "26.2649, -81.6255" | "26°15'53.6"N 81°37'31.8"W" | "26.2649 -81.6255"

// 5. Detección DST automática
function detectDSTRequirements(lat: number, long: number, date: Date, regionCode?: string): { required: boolean; rule?: DSTRule };

// 6. Batch export frames
function generateExportFrames(simulation: ShadowSimulation, config: ExportConfig): ExportFrame[];

interface ExportConfig {
  resolutions: ('1080p' | '2K' | '4K' | '9:16')[];
  includeHUD: boolean;
  hudConfig: HUDConfig;
  format: 'png' | 'jpg' | 'webp';
  namingPattern: string;         // ej: "shadow_{{date}}_{{time}}_{{res}}"
}

interface HUDConfig {
  showLocation: boolean;
  showDate: boolean;
  showTime: boolean;
  showUTC: boolean;
  showNorth: boolean;
  fontSize: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  backgroundColor: Color;
  textColor: Color;
}

interface ExportFrame {
  filename: string;
  resolution: string;
  blob: Blob;                    // o ArrayBuffer para WASM
  metadata: FrameMetadata;
}
```

#### 3.1.3 Diagram Styles (Feature 4 Sun Diagram)

```typescript
interface DiagramStyle {
  id: string;
  name: string;
  category: 'presentation' | 'analysis' | 'concept' | 'technical';
  
  // SketchUp Graphics Settings
  edgeSettings: EdgeSettings;
  faceSettings: FaceSettings;
  shadowSettings: ShadowSettings;
  
  // Layer/Tag Management
  tagVisibility: Map<string, boolean>;      // ej: 'Feb_SunPath', 'Feb_Dome'
  tagColors: Map<string, Color>;
  
  // Compass
  compassStyle: CompassStyle;
  
  // Sunpath
  sunpathStyle: SunpathStyle;
}

interface EdgeSettings {
  profiles: boolean;
  depthCue: boolean;
  extension: number;
  jitter: boolean;
  colorByAxis: boolean;
  backEdges: boolean;
}

interface ShadowSettings {
  displayShadows: boolean;
  shadowDarkness: number;        // 0-100
  useSunForShading: boolean;
  timeZoneOffset: number;
}
```

---

### 3.2 Dynamic Symbols Engine — Especificación Completa

#### 3.2.1 Tipos Core

```typescript
// En dynamicSymbolsEngine.ts

interface DynamicSymbol {
  id: string;
  name: string;
  category: SymbolCategory;
  
  // Geometría base (SVG path data para portabilidad)
  baseGeometry: SVGPathData;
  viewBox: ViewBox;              // ej: "0 0 100 100"
  
  // Estados animados (3 frames para animación suave)
  animatedStates: SymbolState[];
  
  // Estilo por defecto
  defaultStyle: SymbolStyle;
  
  // Metadata
  metadata: SymbolMetadata;
}

type SymbolCategory = 
  | 'circulation_pedestrian'
  | 'circulation_vehicle' 
  | 'circulation_bicycle'
  | 'environmental_wind'
  | 'environmental_sun'
  | 'environmental_water'
  | 'environmental_vegetation'
  | 'zoning_residential'
  | 'zoning_commercial'
  | 'zoning_industrial'
  | 'zoning_mixed'
  | 'zoning_public'
  | 'section_cut'
  | 'section_hatch'
  | 'section_annotation'
  | 'custom';

interface SymbolState {
  frame: 1 | 2 | 3;
  geometry: SVGPathData;         // variante para frame
  transform: Transform2D;        // posición, rotación, escala (PRESERVADOS)
  style: SymbolStyle;
}

interface Transform2D {
  x: number;
  y: number;
  rotation: number;              // radianes
  scaleX: number;
  scaleY: number;
}

interface SymbolStyle {
  fillColor: Color;
  strokeColor: Color;
  strokeWidth: number;
  opacity: number;
  dashArray?: number[];
}

interface SymbolMetadata {
  author: string;
  version: string;
  tags: string[];
  description: string;
  sketchupComponentName?: string;  // para SKP round-trip
}

// Biblioteca símbolos
interface SymbolLibrary {
  symbols: Map<string, DynamicSymbol>;
  categories: Map<SymbolCategory, string[]>;
  colorPalette: ColorPalette;
  recentColors: Color[];         // últimos 5 usados
  customSymbols: Map<string, DynamicSymbol>;  // user-imported
}

interface ColorPalette {
  name: string;
  colors: Color[];
  categoryColors: Map<SymbolCategory, Color>;
}
```

#### 3.2.2 Funciones Motor

```typescript
// Core Engine Functions

// 1. Symbol Swap (Feature 1) — Preserva transform
function swapSymbol(
  currentSymbol: DynamicSymbol, 
  targetSymbolId: string, 
  library: SymbolLibrary
): DynamicSymbol;

// 2. Color Change (Feature 2) — Preserva position/orientation
function changeColor(
  symbol: DynamicSymbol, 
  color: Color,
  library: SymbolLibrary
): DynamicSymbol;

// 3. Create Animation (Feature 3) — Genera 3 escenas
function createAnimation(
  symbols: DynamicSymbol[],
  config: AnimationConfig
): AnimationScene[];

interface AnimationConfig {
  duration: number;              // segundos total
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  loop: boolean;
  frameCount: 3;                 // fijo: Feb_F1, Feb_F2, Feb_F3
}

interface AnimationScene {
  name: string;                  // 'Feb_F1', 'Feb_F2', 'Feb_F3'
  symbols: AnimatedSymbolInstance[];
  camera?: CameraPosition;
  shadowConfig?: ShadowConfig;
  style?: DiagramStyle;
}

interface AnimatedSymbolInstance {
  symbolId: string;
  transform: Transform2D;
  frameState: 1 | 2 | 3;
  style: SymbolStyle;
}

// 4. Export Animation → Video frames
function exportAnimationFrames(
  scenes: AnimationScene[],
  config: ExportConfig
): ExportFrame[];

// 5. Library Management
function addCustomSymbol(symbol: DynamicSymbol, library: SymbolLibrary): SymbolLibrary;
function importSymbolFromSKP(skpComponent: SKPComponent): DynamicSymbol | null;
function exportSymbolToSKP(symbol: DynamicSymbol): SKPComponent;
```

---

### 3.3 Shadow Slice Engine — Especificación Completa

#### 3.3.1 Tipos Core

```typescript
// En shadowSliceEngine.ts

interface ShadowSlice {
  id: string;
  name: string;
  
  // Plano de corte
  plane: SlicePlane;
  
  // Elementos objetivo (Group/Component IDs)
  targetElementIds: string[];
  
  // Estado visual
  visible: boolean;
  
  // Estilo
  style: SliceStyle;
  
  // Compensación sombras (KEY FEATURE)
  shadowCompensation: boolean;
  compensationMethod: 'projected' | 'raytraced' | 'hybrid';
}

interface SlicePlane {
  // Definición plano 3D
  origin: Point3D;               // punto en el plano
  normal: Vector3D;              // normal unitario
  offset: number;                // distancia desde origen
  
  // Límites (opcional - para slice bounded)
  bounds?: BoundingBox3D;
}

interface SliceStyle {
  // Línea de corte
  lineWeight: number;
  lineColor: Color;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  
  // Fill sección
  fillColor: Color;
  fillOpacity: number;           // 0-1
  fillPattern: 'solid' | 'hatch' | 'crosshatch' | 'dots';
  
  // Elementos cortados
  cutElementStyle: CutElementStyle;
}

interface CutElementStyle {
  visible: boolean;              // mostrar geometría cortada
  opacity: number;
  colorOverride?: Color;
  castShadows: boolean;          // CRÍTICO: mantener sombras
  receiveShadows: boolean;
}

// Dashboard centralizado
interface ShadowSliceDashboard {
  slices: Map<string, ShadowSlice>;
  activeSliceId?: string;
  
  // Estilo global
  globalStyle: SliceStyle;
  
  // Scene management
  sceneManager: SectionSceneManager;
  
  // Configuración global
  autoCreateScenes: boolean;
  scenePrefix: string;           // 'Feb_Slice_'
}

interface SectionSceneManager {
  scenes: Map<string, SectionScene>;
  createScene(slice: ShadowSlice, sunPosition: SolarPosition): SectionScene;
  updateScene(sceneId: string, updates: Partial<SectionScene>): SectionScene;
  deleteScene(sceneId: string): void;
  exportSceneSequence(sunPositions: SolarPosition[]): SectionScene[];
}

interface SectionScene {
  id: string;
  name: string;
  sliceIds: string[];
  sunPosition: SolarPosition;
  camera: CameraPosition;
  style: DiagramStyle;
  visibleTags: string[];
  hiddenTags: string[];
}
```

#### 3.3.2 Algoritmo Compensación Sombras (Core Innovation)

```typescript
// El algoritmo KEY que diferencia Shadow Slice de Section Plane nativo

interface ShadowCompensationResult {
  compensatedShadows: ShadowPolygon[];
  removedGeometry: BuildingElement[];    // geometría hecha invisible
  compensationMethod: 'projected' | 'raytraced' | 'hybrid';
  accuracy: number;                      // 0-1 confidence
}

// Algoritmo principal
function compensateShadows(
  slice: ShadowSlice,
  building: BuildingGeometry,
  sunPosition: SolarPosition,
  method: 'projected' | 'raytraced' | 'hybrid' = 'hybrid'
): ShadowCompensationResult {
  
  // 1. Identificar geometría removida por slice
  const removedElements = identifyRemovedGeometry(slice, building);
  
  // 2. Calcular sombras que ESOS elementos habrían proyectado
  const hypotheticalShadows = calculateHypotheticalShadows(
    removedElements, 
    building.groundPlane, 
    sunPosition
  );
  
  // 3. Calcular sombras reales con geometría restante
  const remainingElements = building.elements.filter(e => 
    !removedElements.some(r => r.id === e.id)
  );
  const actualShadows = calculateActualShadows(
    remainingElements,
    building.groundPlane,
    sunPosition
  );
  
  // 4. Combinar: sombras reales + sombras compensadas
  const compensated = mergeShadows(actualShadows, hypotheticalShadows);
  
  return {
    compensatedShadows: compensated,
    removedGeometry: removedElements,
    compensationMethod: method,
    accuracy: calculateAccuracy(compensated, building, sunPosition)
  };
}

// Método 'projected': Proyección plana geometría removida
// Método 'raytraced': Ray tracing desde sol (más preciso, más lento)
// Método 'hybrid': Projected para elementos lejanos, raytraced para cercanos
```

#### 3.3.3 Funciones Motor

```typescript
// Core Engine Functions

// 1. Crear slice (1-click)
function createSlice(
  targetElementId: string,
  plane: SlicePlane,
  dashboard: ShadowSliceDashboard
): ShadowSliceDashboard;

// 2. Toggle slice visibility
function toggleSlice(
  sliceId: string,
  dashboard: ShadowSliceDashboard
): ShadowSliceDashboard;

// 3. Ajustar plano slice
function adjustSlicePlane(
  sliceId: string,
  newPlane: SlicePlane,
  dashboard: ShadowSliceDashboard
): ShadowSliceDashboard;

// 4. Aplicar estilo
function applySliceStyle(
  sliceId: string,
  style: SliceStyle,
  dashboard: ShadowSliceDashboard
): ShadowSliceDashboard;

// 5. Compensar sombras (KEY)
function compensateSliceShadows(
  slice: ShadowSlice,
  building: BuildingGeometry,
  sunPositions: SolarPosition[]
): ShadowCompensationResult[];

// 6. Auto-generar escenas sección
function createSectionScenes(
  dashboard: ShadowSliceDashboard,
  sunPositions: SolarPosition[]
): SectionScene[];

// 7. Export section views
function exportSectionViews(
  scenes: SectionScene[],
  config: ExportConfig
): ExportFrame[];
```

---

### 3.4 CPP Pools Específicos Febhouse

```typescript
// En febhouse.ts: FEBHOUSE_DEFAULT_CPP_POOLS

const FEBHOUSE_DEFAULT_CPP_POOLS: CPPPoolConfig[] = [
  {
    id: 'pool_diagram_templates',
    name: 'Architectural Diagram Templates',
    description: 'Professional diagram workflows: site analysis, context, climatic, light studies',
    authority: { type: 'dao', daoAddress: 'febhouse_templates.eth' },
    commitmentTypes: [
      'site_analysis_template',
      'context_analysis_template', 
      'climatic_analysis_template',
      'light_study_template',
      'circulation_template',
      'zoning_template',
      'section_template',
      'presentation_board_template'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_diagram_templates', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 500n, 
        periodDays: 30 
      },
      {
        fromPool: 'pool_diagram_templates',
        toPool: 'samay_design_pool',
        rate: { numerator: 1n, denominator: 1n },
        curated: true,
        maxAmountPerPeriod: 100n,
        periodDays: 7
      }
    ],
    boundaryCuration: [
      {
        id: 'template_quality_gate',
        sourcePool: 'pool_diagram_templates',
        targetSystem: 'cpp_pool',
        targetId: 'external_studio',
        allowedCommitmentTypes: ['*'],
        requiresCuratorApproval: true,
        minQualityScore: 0.7,
        maxVolumePerPeriod: 50n,
        periodDays: 7
      }
    ],
    exposureLimit: {
      maxTotalExposure: 5000n,
      maxPerCounterparty: 500n,
      maxPerCommitmentType: 1000n,
      riskWeight: { 'site_analysis_template': 1.0, 'presentation_board_template': 0.5 }
    },
  },
  {
    id: 'pool_dynamic_symbols',
    name: 'Dynamic Symbols Library',
    description: 'Animated 2D/3D architectural symbols: circulation, environmental, zoning, section',
    authority: { type: 'consensus', curators: [], threshold: 0.66 },
    commitmentTypes: [
      'circulation_symbol',
      'environmental_symbol', 
      'zoning_symbol',
      'section_symbol',
      'custom_symbol'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_dynamic_symbols', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 2000n, 
        periodDays: 30 
      }
    ],
    exposureLimit: {
      maxTotalExposure: 10000n,
      maxPerCounterparty: 1000n,
      riskWeight: { 'circulation_symbol': 1.0, 'custom_symbol': 1.5 }
    },
  },
  {
    id: 'pool_diagram_styles',
    name: 'Diagram Visual Styles',
    description: 'Professional diagram styles: edge settings, face rendering, shadow config, compass designs',
    authority: { type: 'algorithmic', curators: [], algorithmConfig: { categorization: 'diagram_category', quality: 'peer_reviewed' } },
    commitmentTypes: [
      'presentation_style',
      'analysis_style',
      'concept_style', 
      'technical_style',
      'compass_design',
      'color_scheme'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_diagram_styles', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 300n, 
        periodDays: 30 
      }
    ],
  },
  {
    id: 'pool_solar_analysis',
    name: 'Solar Analysis Workflows',
    description: 'Pre-configured solar analysis setups: solstice studies, shadow animations, daylighting reports',
    authority: { type: 'dao', daoAddress: 'febhouse_solar.eth' },
    commitmentTypes: [
      'solstice_study',
      'equinox_study',
      'monthly_shadow_animation',
      'daylighting_report',
      'solar_envelope',
      'custom_date_analysis'
    ],
    exchangeRules: [
      { 
        fromPool: 'pool_solar_analysis', 
        toPool: 'clc_market_pool', 
        rate: { numerator: 1n, denominator: 1n }, 
        curated: true, 
        maxAmountPerPeriod: 200n, 
        periodDays: 30 
      },
      {
        fromPool: 'pool_solar_analysis',
        toPool: 'feria_climate_pool',
        rate: { numerator: 1n, denominator: 1n },
        curated: true,
        maxAmountPerPeriod: 50n,
        periodDays: 7
      }
    ],
  },
];
```

---

## 4. MAPEO A ARQUITECTURA ALRAC 5 CAPAS

| Capa ALRAC | Febhouse Aporte | Implementación HSCSG |
|------------|-----------------|---------------------|
| **0 Epistémica** | *Ausente* | γ-CARMIS para validar coherencia diagrama vs realidad construida |
| **0.5 Normativa** | Workflows diagramas + ArchiMate exchange | 7 Principios Javier + CEL para curación templates/symbols/styles |
| **1 Contable-Física** | Tiempo diseño, energía render, assets = recursos medibles | TQ ledger: 1 TQ = 1 min diseño = 1 kWh render; LEF catalog |
| **2 Interoperabilidad** | SKP files + ArchiMate + algorithms abiertos | CPP pools federados + NDO federation + GNAP + WASM portability |
| **3 Membrana Fiat** | Freemium/SaaS (Studio $15/a, Pro $29-45) | Coop arquitectos + ZNU credit 2-3% + priceParity oráculo |

---

## 5. PLAN DE CONVERSIÓN PROGRESIVA (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# Contactos clave:
- Nam Nguyen (Fundador, Arquitecto, Developer) — visión técnica/producto
- Febhouse Studio team — operaciones, arquitectura, plugins

# Acciones:
- Cartas individuales ALRAC Master §10 (x2-3)
- γ-CARMIS Preview gratuito (5 casos)
- RAO Verification Lite en Febhouse Studio (Hanoi)
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **Solar Analysis Engine WASM** | `sunDiagramEngine.ts` + WASM compile | Motor solar offline (lat/long → sunpath 3D + shadows) | 100+ análisis validados |
| **Dynamic Symbols Engine WASM** | `dynamicSymbolsEngine.ts` + WASM | Symbol swap/color/animation offline | 50+ diagramas animados |
| **Shadow Slice Engine WASM** | `shadowSliceEngine.ts` + WASM | Non-destructive slicing + shadow compensation | 20+ section studies |
| **Template/Symbol/Style CPP Pools** | `cpp.ts` + `cppBridge` | 3 pools federados + exchangeRules | 100 templates, 200 symbols, 20 styles |
| **Diagram Pedagogy γ-CARMIS** | `kernelProtocol` + `ev.ts` | 50 estudiantes/arquitectos entrenados | αʰ post-entreno > 0.8 |
| **SKP ↔ Web/WASM Bridge** | `sketchupAbstractionLayer.ts` | Import/export SKP → WASM engine | 10 archivos round-trip |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- **Nodo Febhouse en HSCSG v15 OS** → registro `.gnap` + `RAO` + `DID`
- **Federación estudios arquitectura Vietnam/Global** → CPP pools templates/assets cross-border
- **Federación universidades arquitectura** → PHI pipeline estudiantes → profesionales
- **Constitución legal cooperativa** (arquitectos + developers) — ALRAC Master §10
- **Despliegue primer nodo diagrama offline** (WASM engines + mesh DTN Solarpunk)

### Fase 3: Autonomía Plena (Mes 4-12)
- **ALRAC = vehículo comercial Febhouse** (decisión Paso 0 con Nam)
- **Red nodos arquitectura federados**: Estudios + Universidades + Febhouse core
- **Gobernanza 1a1v real** → asambleas arquitectos + GAIA COMMONS
- **Economía mixta operativa**: TQ interno (tiempo diseño/render) + ZNU puente fiat + USD sponsors

---

## 6. SINERGIAS CRÍTICAS

| Proyecto HSCSG | Sinergia | Mecanismo Concreto |
|----------------|----------|-------------------|
| **Solarpunk Utopia** | Mesh/DTN para análisis solar/ diagrama offline colaborativo | `meshNode` + `dtnBundle` en estudios |
| **Nondominium (Sensorica)** | NDO para diagrams/templates/symbols = recurso federado | `NdoHardLink` diagrams ↔ templates ↔ symbols ↔ styles |
| **Ruddick/GEF (Economía Raíces)** | Diagramas mapeo territorial (mweria/kaya visual) | `trustBasket.ts` + `sunDiagramEngine.ts` análisis solar territorio |
| **Samay Permacultura** | Diagramas hidrológicos/territoriales + análisis solar | `waterDesign.ts` + `sunDiagramEngine.ts` + `shadowSliceEngine.ts` |
| **+Colonia** | Masterplan diagrams (Gómez Platero) → ArchiMate + solar | `colonya.ts` + `archimateEngine.ts` + `sunDiagramEngine.ts` |
| **Feria Conuquera** | Diagramas territorio/comunidad + análisis solar | `feria.ts` + `diagramPedagogy.ts` + `sunDiagramEngine.ts` |
| **Soulpreneurs (70k)** | Pipeline arquitectos conscientes → estudios regenerativos | Cohorte "Soulpreneurs Architecture" en PHI/Mycelium |
| **ArchiDiagram (nodo previo)** | Mismo ecosistema — Febhouse ES ArchiDiagram | Unificar: `febhouse.ts` extiende `archidiagram.ts` |

---

## 7. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| Vendor lock-in SketchUp/Trimble | Crítica | Crítico | Principio Anfibio: WASM engines nativos + mesh/DTN, SketchUp target opcional |
| RBZ format propietario | Alta | Crítico | `sketchupAbstractionLayer.ts` → export SKP → import WASM (round-trip) |
| Extension Warehouse centralizado | Alta | Crítico | Mesh/DTN + IPFS para distribución plugins/templates/assets |
| Studio tier requiere Trimble account | Media | Alto | Pro/Lifetime via mesh/DTN offline activation; ZNU credit licenses |
| Gumroad/SketchUcation marketplaces | Media | Alto | CPP pools distribución federada + ZNU pricing |
| Monetización freemium extractiva | Media | Alto | ZNU credit 2-3% + cooperativa = soberanía financiera |
| Centralización contenido ArchiDiagram | Alta | Crítico | CPP pools federados + NDO federation + GNAP cross-repo |
| Dependencia cloud/CDN assets | Alta | Crítico | Mesh/DTN + IPFS/Filecoin + meshProtocol Solarpunk |

---

## 8. MÉTRICAS DE ÉXITO (90 días / 1 año)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | Solar Engine WASM operativo | 1 análisis válido | 1000+/mes |
| | Symbols Engine WASM | 1 animación | 500+/mes |
| | Shadow Slice Engine WASM | 1 section study | 200+/mes |
| | CPP pools federados | 3 pools + exchangeRules | 15 pools |
| | SKP ↔ WASM round-trip | 1 archivo | 100% fidelity |
| **Documentales** | `febhouse_integration.md` | ✅ Completa | v2 actualizada |
| | `openspec/specs/febhouse-integration.md` | Creada | PVL compliant |
| | Cartas individuales (3) | 3 enviadas | Respuestas |
| **Operativos** | Agente `febhouse-node` GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "Febhouse Architecture" | 50 inscritos | 200 + facilitadores |
| **Estratégicos** | Decisión ALRAC = vehículo Febhouse | Definida (Paso 0) | Ejecutada |
| | Federación 5+ estudios | Piloto CPP | 20+ nodos federados |
| | Velocity ZNU > 0 | Medible | Autosustentable |

---

## 9. PRÓXIMOS PASOS INMEDIATOS (Esta Semana)

### Día 1-2: Fundación
- [x] **Backup Fase 0** HSCSG_v15_OS
- [x] **Crear `docs/febhouse_backup.md`** ✅
- [x] **Crear `docs/febhouse_integration.md`** ✅
- [ ] **Registrar contactos** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 3 cartas ALRAC Master §10** a: Nam Nguyen, Febhouse Studio leads
- [ ] **Solicitar γ-CARMIS Preview** (5 casos gratis)
- [ ] **RAO Verification Lite** en Febhouse Studio (Hanoi)

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/febhouse-integration.md`** (este documento)
- [ ] **Implementar `src/core/lib/febhouse.ts`** + tipos dominio
- [ ] **Implementar `src/core/lib/sunDiagramEngine.ts`** (core solar)
- [ ] **Implementar `src/core/lib/dynamicSymbolsEngine.ts`** (core symbols)
- [ ] **Implementar `src/core/lib/shadowSliceEngine.ts`** (core section)
- [ ] **Registrar agente `febhouse-node` en `.gnap/agents.json`**

---

## 10. REFERENCIAS CRUZADAS

| Documento | Sección | Actualización |
|-----------|---------|---------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir Febhouse |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | PHI/MYCELIUM/GAIA NETWORK |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `febhouse-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | `FebhouseNode`, `SolarPosition`, `DynamicSymbol`, `ShadowSlice` |
| `Solarpunk_Utopia_Mapping.md` | Mesh/DTN | Caso uso colaborativo arquitectura |
| `docs/archidiagram_integration.md` | §6 Sinergias | Unificar: Febhouse ES ArchiDiagram |

---

## 11. CITAS ANCLA

> **"We believe architects should spend their time designing, not battling software."** — Nam Nguyen, Febhouse Philosophy

> **"Born from real-world architectural practice, our philosophy is to bridge the gap between complex spatial ideas and clear visual communication."** — Febhouse Philosophy

> **"Sun Diagram features a Smart DST automation engine. If you enable DST once for your project location, the plugin automatically checks the date being analyzed and applies the 1-hour offset only during the summer DST period."** — Sun Diagram FAQ

> **"Shadow Slice makes the cut geometry invisible to your camera while retaining 100% of its shadow casting."** — Shadow Slice FAQ

> **"Dynamic Symbols lets you instantly switch between different symbol shapes with just one click — while preserving the symbol's exact position, size, and rotation."** — Dynamic Symbols Feature 1

> **"All versions (Free, Studio, and Pro) are fully permitted for commercial architectural work and client projects."** — Sun Diagram FAQ

> **"Can I use the plugin offline? Yes. Both Sun Diagram Standard and Pro can operate completely offline once installed."** — Sun Diagram FAQ

---

## 12. CONCLUSIÓN: FEBHOUSE COMO NODO PILOTO ESTRATÉGICO HSCSG

**Febhouse cumple condiciones únicas (incluso superiores a ArchiDiagram solo):**

1. ✅ **Studio arquitectura REAL** — 9 proyectos construidos/en construcción Vietnam
2. ✅ **Desarrollo software REAL** — 3 plugins SketchUp, 60k+ usuarios, Verified Vendor
3. ✅ **Algoritmos abiertos nativos** — Solar (NOAA/SPA), GPS, UTC/DST = protocolos abiertos
4. ✅ **Herramienta puente 2D↔3D** — SketchUp plugins = caso uso `meshProtocol` + `sketchupAbstractionLayer`
5. ✅ **Educación nativa (PHI)** — Tutorials + sample files SKP free = pedagogía validada
6. ✅ **Gap crítico exacto** — SaaS centralizado + vendor lock-in SketchUp + cloud-only + freemium extractivo → **HSCSG/ALRAC resuelve exactamente esto**

**Conversión progresiva:** No "vender" HSCSG, sino **demostrar valor operativo** via piloto que resuelva dolores reales:
- **Solar Engine WASM:** offline sites, DST accuracy, no SketchUp license needed
- **Symbols Engine WASM:** symbol portability, animation export, web viewer
- **Shadow Slice WASM:** interior daylighting accuracy, non-destructive, physically correct
- **CPP Pools:** vendor lock-in, centralización, curación comunitaria
- **ZNU Credit 2-3%:** affordability estudiantes/arquitectos, soberanía financiera

---

> **Nota de spec:** Este documento sigue OpenSpec PVL. La implementación TypeScript en `src/core/lib/` es la referencia ejecutable. Febhouse + Solarpunk + Ruddick/GEF + Samay forman la **triangulación visual/territorial/ancestral/solar** para federación ALRAC.
>
> **La pala y el teclado están en tus manos. E=V.**