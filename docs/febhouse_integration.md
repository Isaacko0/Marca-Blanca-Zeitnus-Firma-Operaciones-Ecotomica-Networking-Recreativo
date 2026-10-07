# Integración: Febhouse Studio + ArchiDiagram Tools → HSCSG v15 OS / ALRAC

**Fecha:** 2026-10-06  
**Fuente:** `docs/febhouse_backup.md` (extracción web completa: febhouse.com, sundiagram.com, dynamicsymbols.com, archidiagram.com/shadow-slice/)  
**Entidad:** Febhouse Studio (Hanoi, Vietnam) — Nam Nguyen (Arquitecto, Verified SketchUp Developer)  
**Metodología:** HSCSG v15 OS — Flujo 4 fases + Principio Anfibio + Triple Perspectiva

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo

> **Objetivo:** Arquitectos y estudiantes que necesitan herramientas potentes, intuitivas y accesibles para análisis solar, diagramas arquitectónicos y visualización — sin fricción técnica, sin vendor lock-in, con soberanía sobre sus archivos y workflows.

### Necesidades Explícitas del Usuario Final (Arquitectos/Estudiantes)
- **Análisis solar preciso:** Sun paths 3D, sombras estacionales, DST automático
- **Diagramas profesionales:** Símbolos animados, colores, estilos visuales, export 4K/vertical
- **Sección interior realista:** Cortes que mantienen sombras físicas correctas
- **Workflow acelerado:** One-click operations, batch export, templates listos
- **Acceso libre/barato:** Free tier real + premium asequible (estudiantes)
- **Offline capability:** Trabajar en sitios remotos, aviones, sin internet
- **Interoperabilidad:** Archivos SKP portables, no lock-in formato propietario

### Dolores No Resueltos (Oportunidades HSCSG)
- **Vendor lock-in SketchUp/Trimble:** Plugins atados a Extension Warehouse, Trimble accounts, versiones SketchUp
- **Centralización distribución:** Extension Warehouse = single point of failure/control
- **Formato propietario RBZ:** Solo corre en SketchUp, no portable a Blender/Revit/Rhino/Web
- **SaaS extractivo:** Freemium → upsell subscription/lifetime, no modelo postmonetario
- **Sin gobernanza comunitaria:** Top-down, sin CEL/jurados sorteados para curación recursos
- **Dependencia cloud:** Studio tier requiere Trimble account online, activación SSL
- **Sin soberanía datos:** Archivos, preferencias, licenses en servidores ajenos
- **No mesh/DTN:** Colaboración offline entre estudios imposibles

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ASIMILAR (Lógica Pura → Módulos HSCSG)

| Componente Febhouse | Módulo HSCSG | Lógica Extraíble |
|---------------------|--------------|------------------|
| **Sun Diagram Engine** | `sunDiagramEngine.ts` / `solarAnalysis.ts` | Algoritmos: sunpath 3D (lat/long → azimut/altitud), DST engine, shadow simulation, solstice/equinox calc |
| **Dynamic Symbols Engine** | `dynamicSymbolsEngine.ts` / `diagramAnimation.ts` | Lógica: symbol swap (position/size/rotation preservation), color palette, animation scene generation (3-frame) |
| **Shadow Slice Engine** | `shadowSliceEngine.ts` / `sectionAnalysis.ts` | Non-destructive slicing, shadow compensation algorithm, multi-slice dashboard, section fill styles |
| **Diagram Style System** | `diagramStyleEngine.ts` / `visualVocabulary.ts` | Style definitions: edge settings, layer/tag management, compass designs, color schemes |
| **Coordinate/Location System** | `geoLocationEngine.ts` | Lat/Long parsing, UTC offset, timezone detection, DST rules database |
| **Export Pipeline** | `diagramExportPipeline.ts` | Batch export: resolutions (FullHD/2K/4K/9:16), HUD overlay, frame sequencing, video assembly hints |
| **SketchUp API Abstraction** | `sketchupAbstractionLayer.ts` | Wrapper: entities, groups, components, tags/layers, scenes, shadows, camera, export |
| **ArchiMate/Diagram Taxonomy** | `architecturalDiagramTaxonomy.ts` | Tipología diagramas: site analysis, context, climatic, residential, light study, circulation, zoning |
| **Tutorial/Resource Pedagogy** | `diagramPedagogy.ts` | Progressive disclosure, pattern recognition, workflow templates, critique framework |

### EXTIRPAR (Infra Ajena — Solo docs local `~/docs/febhouse_*_local.md`)

- **SketchUp Extension Warehouse** — Distribución centralizada, review process, Trimble account
- **RBZ/Ruby plugin binaries** — Código propietario, solo corre en SketchUp
- **Gumroad/SketchUcation marketplaces** — Pagos, license keys, DRM
- **Stripe/Payments integration** — Subscription billing, lifetime keys
- **SSL activation / license verification** — Online check, firewall issues
- **Analytics/Tracking** — Google Analytics, usage telemetry
- **Email capture / marketing funnel** — Lead gen, upsell flows
- **Instagram/YouTube embeds** — Social media dependency
- **Branding visual propietario** — Logos, colors, UI Febhouse/ArchiDiagram
- **AI support chatbot** — Propietario, trained on their docs
- **PII data collection** — Emails, license keys, usage data

---

## 3. Perspectiva HSCSG+CaaS — Isomorfismo con Leyes MJ + CaaS + ALRAC + GNAP + ZNU + EV_CORE + MINIAGI + SOLARPUNK

### Mapeo a Arquitectura ALRAC 5 Capas

| Capa ALRAC | Febhouse Manifestación | Gap / Oportunidad HSCSG |
|------------|------------------------|-------------------------|
| **0 Epistémica** | *Ausente* — no hay marco diagnóstico | **Oportunidad:** γ-CARMIS para detectar incoherencias diagrama vs realidad construida |
| **0.5 Normativa** | *Parcial* — mejores prácticas, workflows | **Gap:** Falta CEL (jurados sorteados) para curación templates/styles/symbols |
| **1 Contable-Física** | *Ausente* — no hay contabilidad recursos | **Implementar:** TQ ledger para tiempo diseño, energía render, catálogo LEF |
| **2 Interoperabilidad** | *Parcial* — SKP files + ArchiMate exchange | **Implementar:** CPP pools templates/symbols/styles cross-studio + NDO federation |
| **3 Membrana Fiat** | **Freemium/SaaS centralizado** | **Estructurar:** Cooperativa arquitectos + ZNU credit 2-3% + priceParity oráculo |

### Mapeo a 7 Holones Gran Alianza

| Holón | Rol en Febhouse | Línea ALRAC | KPI |
|-------|-----------------|-------------|-----|
| **GAIA** (Articulación) | Diagram taxonomy = articulación tipos/vistas | A: Diagnóstico encaje | % diagramas validados taxonomy |
| **MYCELIUM** (Matching/Infra) | Templates/symbols/styles library = infra compartida | B: Kit simulación / C: Prototipado | Matches template-necesidad |
| **PROJECT WEAVE** (Credenciales) | RAO para arquitectos/estudios + plugins | A, C | % credenciales verificadas |
| **PHI** (Educación) | Tutorials gratuitos + sample files = PHI nativo | B: Kit simulación | # tutorials, completion rate |
| **HIVE IA** (Matching IA) | AI-assisted diagramming (futuro) | D: γ-CARMIS training | # diagrams AI-assisted |
| **GAIA NETWORK** (Mercado) | Marketplace plugins/templates/assets | C: Prototipado vía | Revenue + TQ medido |
| **DATA TRUST + COMMONS** (Gobernanza) | Datos usuarios, diagrams, plugins, licenses | E: Nodos TQ | % datos soberanos, decisiones 1a1v |

---

## 4. Plan de Conversión Progresiva a Nodo HSCSG v15 OS

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# 1. Identificar decisores clave
- Nam Nguyen (Fundador, Arquitecto, Developer) — visión técnica/producto
- Febhouse Studio team — operaciones, arquitectura, plugins

# 2. Cartas individuales ALRAC Master §10 (x2-3)
# 3. γ-CARMIS Preview gratuito (5 casos) → detectar incoherencias
# 4. RAO Verification Lite en Febhouse Studio (Hanoi)
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

## 5. Integración Técnica Inmediata (HSCSG v15 OS)

### 5.1 Archivos a Crear/Extender

#### `src/core/lib/febhouse.ts` — Lógica Pura Dominio Febhouse
```typescript
// Tipos dominio Febhouse
interface FebhouseNode {
  did: DID;                           // did:key:febhouse-core
  name: 'Febhouse Studio';
  founder: 'Nam Nguyen';
  location: 'Hanoi, Vietnam';
  sketchupVendorId: '582b09fa-9fe2-4248-b9e8-80dc7af69a76';
  pillars: FebhousePillar[];
  tools: FebhouseTool[];
  projects: ArchitecturalProject[];
  communitySize: 60000;
  pedagogy: DiagramPedagogyConfig;
  cppPools: CPPPoolConfig[];
}

interface FebhousePillar {
  id: 'solar_analysis' | 'dynamic_symbols' | 'shadow_slice' | 'diagram_styles' | 'templates' | 'education' | 'architecture_projects';
  name: string;
  description: string;
  wasmEngine: boolean;
  tqAccounting: boolean;
  cppPoolId?: PoolId;
  znuCreditEligible: boolean;
  sketchupDependency: 'hard' | 'soft' | 'none';  // hard=RBZ only, soft=WASM+SKP, none=fully portable
}

interface FebhouseTool {
  id: 'sun_diagram' | 'dynamic_symbols' | 'shadow_slice';
  name: string;
  version: string;
  wasmCompiled: boolean;
  features: ToolFeature[];
  tiers: ToolTier[];
  offlineCapable: boolean;
}

interface ToolTier {
  name: 'standard' | 'studio' | 'pro';
  price: { amount: number; currency: 'USD' | 'ZNU'; period?: 'year' | 'lifetime' };
  distribution: 'extension_warehouse' | 'gumroad' | 'sketchucation' | 'mesh_dtn' | 'local';
  features: string[];
  znuCreditEligible: boolean;
}
```

#### `src/core/lib/sunDiagramEngine.ts` — Motor Solar (WASM Target)
```typescript
// Core Solar Analysis Types (portados de Sun Diagram logic)

interface SunPathConfig {
  latitude: number;
  longitude: number;
  utcOffset: number;           // horas desde UTC
  dstEnabled: boolean;
  dstRules?: DSTRule[];        // reglas DST por país/región
  dateRange: { start: Date; end: Date };
  timeRange: { start: number; end: number };  // horas 0-23
}

interface DSTRule {
  region: string;              // ej: 'US', 'EU', 'AU', 'custom'
  startMonth: number;          // 1-12
  startWeek: number;           // 1-5 (week of month)
  startDay: number;            // 0=Sun...6=Sat
  endMonth: number;
  endWeek: number;
  endDay: number;
  offsetHours: number;         // típicamente 1
}

interface SolarPosition {
  azimuth: number;             // grados 0-360 (Norte=0)
  altitude: number;            // grados -90 a +90
  date: Date;
  time: number;                // hora local 0-24
  utcTime: Date;
  isDST: boolean;
}

interface ShadowSimulation {
  sunPositions: SolarPosition[];
  shadowGeometries: ShadowGeometry[];  // para cada sun position
  buildingGeometry: BuildingGeometry;
  groundPlane: Plane;
}

interface ShadowGeometry {
  polygons: Polygon3D[];       // sombras proyectadas
  sunPosition: SolarPosition;
  buildingElements: string[];  // IDs elementos que proyectan sombra
}

// Engine Functions (puras, WASM-compilable)
function calculateSunPath(config: SunPathConfig): SolarPosition[];
function simulateShadows(config: SunPathConfig, building: BuildingGeometry): ShadowSimulation;
function calculateSolsticeEquinox(lat: number, long: number, year: number): SolarEvent[];
function parseCoordinates(input: string): { lat: number; long: number } | null;  // "26.2649, -81.6255"
function detectDSTRequirements(lat: number, long: number, date: Date): boolean;
```

#### `src/core/lib/dynamicSymbolsEngine.ts` — Motor Símbolos Animados
```typescript
// Dynamic Symbols Types

interface DynamicSymbol {
  id: string;
  name: string;
  category: SymbolCategory;
  baseGeometry: Geometry2D;      // SVG/path data
  animatedStates: SymbolState[]; // F1, F2, F3 para animación
  defaultColor: Color;
  metadata: SymbolMetadata;
}

type SymbolCategory = 
  | 'circulation'      // peatones, vehículos, bicicletas
  | 'environmental'    // viento, sol, agua, vegetación
  | 'zoning'           // usos, densidades, programas
  | 'section'          // annotations, cut lines, hatches
  | 'custom';

interface SymbolState {
  frame: 1 | 2 | 3;
  geometry: Geometry2D;        // variante geométrica
  transform: Transform2D;      // posición, rotación, escala (preservados)
  color: Color;
}

interface SymbolLibrary {
  symbols: Map<string, DynamicSymbol>;
  categories: Map<SymbolCategory, string[]>;
  colorPalette: ColorPalette;
  lastUsedColors: Color[];     // memoria 5 colores
}

// Engine Functions
function swapSymbol(current: DynamicSymbol, targetId: string, library: SymbolLibrary): DynamicSymbol;
function changeColor(symbol: DynamicSymbol, color: Color): DynamicSymbol;
function createAnimation(symbols: DynamicSymbol[], frames: 3): AnimationScene[];
function exportAnimation(scenes: AnimationScene[], config: ExportConfig): ExportResult;
```

#### `src/core/lib/shadowSliceEngine.ts` — Motor Sección Interior
```typescript
// Shadow Slice Types

interface ShadowSlice {
  id: string;
  name: string;
  plane: SlicePlane;           // posición, orientación
  targetElements: string[];    // Group/Component IDs a cortar
  visible: boolean;
  style: SliceStyle;
  shadowCompensation: boolean; // mantiene sombras físicas
}

interface SlicePlane {
  origin: Point3D;
  normal: Vector3D;
  offset: number;              // distancia desde origen
}

interface SliceStyle {
  lineWeight: number;
  lineColor: Color;
  fillColor: Color;
  fillOpacity: number;
  edgeStyle: 'solid' | 'dashed' | 'dotted';
}

interface ShadowSliceDashboard {
  slices: ShadowSlice[];
  activeSliceId?: string;
  globalStyle: SliceStyle;
  sceneManager: SceneManager;  // auto scene creation
}

// Engine Functions (non-destructive)
function createSlice(targetId: string, plane: SlicePlane): ShadowSlice;
function toggleSlice(sliceId: string, dashboard: ShadowSliceDashboard): ShadowSliceDashboard;
function adjustSlice(sliceId: string, newPlane: SlicePlane, dashboard: ShadowSliceDashboard): ShadowSliceDashboard;
function compensateShadows(slice: ShadowSlice, building: BuildingGeometry, sun: SolarPosition): ShadowGeometry;
function applyStyle(sliceId: string, style: SliceStyle, dashboard: ShadowSliceDashboard): ShadowSliceDashboard;
function createSectionScenes(dashboard: ShadowSliceDashboard, sunPositions: SolarPosition[]): Scene[];
```

#### `src/core/lib/architecturalDiagramTaxonomy.ts` — Taxonomía Diagramas
```typescript
// Tipología diagramas arquitectónicos (basada en recursos ArchiDiagram)

interface DiagramType {
  id: string;
  name: string;
  category: DiagramCategory;
  requiredTools: FebhouseToolId[];
  typicalLayers: DiagramLayer[];
  workflow: WorkflowStep[];
  sampleFiles: SampleFile[];
}

type DiagramCategory = 
  | 'site_analysis'      // environmental, climatic, residential, urban
  | 'context_analysis'   // urban massing, surrounding buildings, traffic
  | 'light_study'        // solar orientation, shadow analysis, daylighting
  | 'circulation'        // pedestrian, vehicle, flow diagrams
  | 'zoning'             // functional, programmatic, density
  | 'section'            // perspective cutaway, longitudinal, transverse
  | 'presentation';      // boards, reels, animations

interface DiagramLayer {
  name: string;
  sketchupTag: string;       // ej: 'Feb_SunPath', 'Feb_Dome', 'Feb_Slice_1'
  visible: boolean;
  castsShadows: boolean;
  style?: DiagramStyle;
}

interface WorkflowStep {
  order: number;
  tool: FebhouseToolId;
  action: string;
  description: string;
  output: string;            // qué se genera
}

// Catálogo diagramas ArchiDiagram (extraído de /diagrams/)
const ARCHIDIAGRAM_DIAGRAM_CATALOG: DiagramType[] = [
  { id: 'environmental_site_analysis', name: 'Environmental Site Analysis', category: 'site_analysis', requiredTools: ['sun_diagram', 'dynamic_symbols'], typicalLayers: [...], workflow: [...], sampleFiles: [...] },
  { id: 'context_analysis', name: 'Context Analysis Diagram', category: 'context_analysis', requiredTools: ['sun_diagram', 'dynamic_symbols'], ... },
  { id: 'surrounding_buildings', name: 'Surrounding Buildings Diagram', category: 'context_analysis', requiredTools: ['sun_diagram'], ... },
  { id: 'light_location_study', name: 'Light & Location Study', category: 'light_study', requiredTools: ['sun_diagram', 'dynamic_symbols'], ... },
  { id: 'urban_site_analysis', name: 'Urban Site Analysis', category: 'site_analysis', requiredTools: ['sun_diagram', 'dynamic_symbols'], ... },
  { id: 'residential_site_analysis', name: 'Residential Site Analysis', category: 'site_analysis', requiredTools: ['sun_diagram', 'dynamic_symbols'], ... },
  { id: 'climatic_site_analysis', name: 'Climatic Site Analysis', category: 'site_analysis', requiredTools: ['sun_diagram', 'dynamic_symbols'], ... },
];
```

---

## 6. Sinergias Críticas con Proyectos Ya Asimilados

| Proyecto HSCSG | Sinergia con Febhouse | Acción Concreta |
|----------------|----------------------|-----------------|
| **Solarpunk Utopia** | Mesh/DTN/NATS para análisis solar/ diagrama offline colaborativo | Desplegar `meshNode` + `dtnBundle` en estudios arquitectura |
| **Nondominium (Sensorica)** | NDO para diagrams/templates/symbols = recurso federado | `NdoHardLink` diagrams ↔ templates ↔ symbols ↔ styles |
| **Ruddick/GEF (Economía Raíces)** | Diagramas para mapeo territorial (mweria/kaya visual) | `trustBasket.ts` + `sunDiagramEngine.ts` para análisis solar territorio |
| **Samay Permacultura** | Diagramas hidrológicos/territoriales (SAMAY OS) + análisis solar | `waterDesign.ts` + `sunDiagramEngine.ts` + `shadowSliceEngine.ts` |
| **+Colonia** | Masterplan diagrams (Gómez Platero) → ArchiMate + análisis solar | `colonya.ts` + `archimateEngine.ts` + `sunDiagramEngine.ts` |
| **Feria Conuquera** | Diagramas territorio/comunidad (mweria visual) + análisis solar | `feria.ts` + `diagramPedagogy.ts` + `sunDiagramEngine.ts` |
| **Soulpreneurs (70k)** | Pipeline arquitectos conscientes → estudios regenerativos | Cohorte "Soulpreneurs Architecture" en PHI/Mycelium |
| **ArchiDiagram (nodo previo)** | Mismo ecosistema — Febhouse ES ArchiDiagram | Unificar: `febhouse.ts` extiende `archidiagram.ts` |

---

## 7. Riesgos y Mitigaciones Específicos Febhouse

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| **Vendor lock-in SketchUp/Trimble** | Crítica | Crítico | Principio Anfibio: WASM engines nativos + mesh/DTN, SketchUp como *target opcional* |
| **RBZ format propietario** | Alta | Crítico | `sketchupAbstractionLayer.ts` → export SKP → import WASM engine (round-trip) |
| **Extension Warehouse centralizado** | Alta | Crítico | Mesh/DTN + IPFS para distribución plugins/templates/assets |
| **Studio tier requiere Trimble account online** | Media | Alto | Pro/Lifetime via mesh/DTN offline activation; ZNU credit para licenses |
| **Gumroad/SketchUcation marketplaces** | Media | Alto | CPP pools para distribución federada + ZNU pricing |
| **Monetización freemium extractiva** | Media | Alto | ZNU credit 2-3% + cooperativa arquitectos = soberanía financiera |
| **Centralización contenido (ArchiDiagram.com)** | Alta | Crítico | CPP pools federados + NDO federation + GNAP cross-repo |
| **Dependencia cloud/CDN assets** | Alta | Crítico | Mesh/DTN + IPFS/Filecoin + meshProtocol Solarpunk |
| **Falta gobernanza comunitaria** | Media | Alto | CEL (jurados sorteados) para curación templates/symbols/styles |

---

## 8. Métricas de Éxito (Alignadas ALRAC Master)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | Sun Diagram Engine WASM operativo | 1 análisis válido | 1000+/mes |
| | Dynamic Symbols Engine WASM | 1 animación | 500+/mes |
| | Shadow Slice Engine WASM | 1 section study | 200+/mes |
| | Template/Symbol/Style CPP pools | 3 pools + exchangeRules | 15 pools federados |
| | SKP ↔ WASM round-trip | 1 archivo | 100% fidelity |
| **Documentales** | `febhouse_integration.md` triple perspectiva | ✅ Completa | v2 actualizada |
| | `openspec/specs/febhouse-integration.md` | Creada | PVL compliant |
| | Cartas individuales (Nam + team) | 2-3 enviadas | Respuestas |
| **Operativos** | Agente `febhouse-node` en GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "Febhouse Architecture" | 50 inscritos | 200 + facilitadores γ-CARMIS |
| | Facilitadores γ-CARMIS certificados | 5 | 25 |
| **Estratégicos** | Decisión ALRAC = vehículo Febhouse | Definida (Paso 0) | Ejecutada |
| | Federación 5+ estudios arquitectura | Piloto CPP | 20+ nodos federados |
| | Velocity ZNU > 0 | Medible | Autosustentable |

---

## 9. Próximos Pasos Inmediatos (Esta Semana)

### Día 1-2: Fundación
- [x] **Backup Fase 0** HSCSG_v15_OS
- [x] **Crear `docs/febhouse_backup.md`** ✅
- [x] **Crear `docs/febhouse_integration.md`** (este documento)
- [ ] **Registrar contactos** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 2-3 cartas ALRAC Master §10** a: Nam Nguyen, Febhouse Studio leads
- [ ] **Solicitar γ-CARMIS Preview** (5 casos gratis) con equipo
- [ ] **RAO Verification Lite** en Febhouse Studio (Hanoi)

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/febhouse-integration.md`** (basado en este doc)
- [ ] **Implementar `src/core/lib/febhouse.ts`** + tipos dominio
- [ ] **Implementar `src/core/lib/sunDiagramEngine.ts`** (core solar analysis)
- [ ] **Implementar `src/core/lib/dynamicSymbolsEngine.ts`** (core symbols)
- [ ] **Implementar `src/core/lib/shadowSliceEngine.ts`** (core section)
- [ ] **Registrar agente `febhouse-node` en `.gnap/agents.json`**

---

## 10. Referencias Cruzadas Repositorio

| Documento | Sección | Actualización Requerida |
|-----------|---------|------------------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir Febhouse como colaboración explícita |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | Añadir Febhouse nodo real holón PHI/MYCELIUM/GAIA NETWORK |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Mapping Samay | Añadir Febhouse como herramienta análisis solar territorio |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `febhouse-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | Extender con `FebhouseNode`, `SolarPosition`, `DynamicSymbol` |
| `Solarpunk_Utopia_Mapping.md` | Mesh/DTN | Añadir Febhouse como caso uso mesh colaborativo arquitectura |
| `docs/archidiagram_integration.md` | §6 Sinergias | Actualizar: Febhouse ES ArchiDiagram (unificar) |

---

## 11. Citas Clave para Documentos Futuros

> **"We believe architects should spend their time designing, not battling software."** — Nam Nguyen, Febhouse Philosophy

> **"Born from real-world architectural practice, our philosophy is to bridge the gap between complex spatial ideas and clear visual communication."** — Febhouse Philosophy

> **"Sun Diagram features a Smart DST automation engine. If you enable DST once for your project location, the plugin automatically checks the date being analyzed and applies the 1-hour offset only during the summer DST period."** — Sun Diagram FAQ

> **"Shadow Slice makes the cut geometry invisible to your camera while retaining 100% of its shadow casting."** — Shadow Slice FAQ (vs native Section Plane)

> **"Dynamic Symbols lets you instantly switch between different symbol shapes with just one click — while preserving the symbol's exact position, size, and rotation."** — Dynamic Symbols Feature 1

> **"All versions (Free, Studio, and Pro) are fully permitted for commercial architectural work and client projects."** — Sun Diagram FAQ

> **"Can I use the plugin offline? Yes. Both Sun Diagram Standard and Pro can operate completely offline once installed."** — Sun Diagram FAQ

---

## 12. Conclusión: Febhouse como Nodo Piloto Estratégico HSCSG

**Febhouse cumple condiciones únicas (incluso superiores a ArchiDiagram solo):**

1. ✅ **Studio de arquitectura REAL** — 9 proyectos construidos/en construcción Vietnam (resorts, parks, homestays)
2. ✅ **Desarrollo software REAL** — 3 plugins SketchUp publicados, 60k+ usuarios, Verified Vendor
3. ✅ **Standard abierto nativo** — Algoritmos solares (NOAA/SPA), coordenadas GPS, UTC/DST = protocolos abiertos
4. ✅ **Herramienta puente 2D↔3D** — SketchUp plugins = caso uso `meshProtocol` + `sketchupAbstractionLayer`
5. ✅ **Educación nativa (PHI)** — Tutorials + sample files SKP free = pedagogía validada
6. ✅ **Gap crítico exacto** — SaaS centralizado + vendor lock-in SketchUp + cloud-only + freemium extractivo → **HSCSG/ALRAC resuelve exactamente esto**

**Conversión progresiva:** No "vender" HSCSG, sino **demostrar valor operativo** via piloto:
- **Solar Analysis Engine WASM** resuelve: offline sites, DST accuracy, no SketchUp license needed
- **Dynamic Symbols Engine WASM** resuelve: symbol portability, animation export, web viewer
- **Shadow Slice Engine WASM** resuelve: interior daylighting accuracy, non-destructive, physically correct
- **Template/Symbol/Style CPP Pools** resuelve: vendor lock-in, centralización, curación comunitaria
- **ZNU Credit 2-3%** resuelve: student/architect affordability, soberanía financiera

---

## 13. Próximos Hitos Arquitectónicos

| Hito | Descripción | Dependencias |
|------|-------------|--------------|
| **H1: Solar Engine WASM** | `sunDiagramEngine.ts` compilado a WASM, 100+ análisis válidos | Día 5-7 |
| **H2: Symbols Engine WASM** | `dynamicSymbolsEngine.ts` WASM, 50+ animaciones | H1 + Día 8-10 |
| **H3: Shadow Slice WASM** | `shadowSliceEngine.ts` WASM, 20+ section studies | H1 + H2 |
| **H4: CPP Pools Federados** | 3 pools (templates, symbols, styles) + exchangeRules | H1-H3 |
| **H5: SKP Round-trip** | `sketchupAbstractionLayer.ts` import/export SKP fidelity | H4 |
| **H6: Nodo GNAP + Federación** | Agente registrado + 3 task chains cross-border | H5 |
| **H7: ALRAC = Vehículo Febhouse** | Decisión Paso 0 con Nam + ejecución | H6 |

---

## 14. Citas Ancla

> **"Febhouse is an independent architectural studio that develops design projects and professional digital tools to support architects in visualization, analysis, and communication."** — Febhouse About

> **"We work at the intersection of design and innovation, combining architectural expertise with software development to create tools, visual systems, and workflows that enhance how architects design and present."** — Febhouse Mission

> **"Architects should spend their time designing, not battling software."** — Nam Nguyen

> **"Sun Diagram: Smart DST Engine — Automatic Daylight Saving Time adjustment."** — Sun Diagram Feature

> **"Shadow Slice: Makes ceilings and upper walls transparent to the camera while keeping them completely solid to sunlight."** — Shadow Slice Use Case

> **"Dynamic Symbols: One-Click Symbol Swap — Keep Position, Size & Rotation."** — Dynamic Symbols Feature

> **"60,000+ users worldwide"** — Claimed community size

---

> **Nota de asimilación:** Este documento sigue metodología HSCSG v15 OS rigurosa: Fase 0 backup → Fase 1 extracción exhaustiva → Fase 2 triple perspectiva → Fase 3 módulo técnico + spec OpenSpec → Fase 4 verificación. El **Principio Anfibio** se aplica desde diseño: misma lógica opera en modo **Triaxial** (offline, postmonetario, TQ/ZNU) y **TypeSafe** (conectado, USD/USDC via priceParity, Nivel 3 ReFi).
>
> **Febhouse + ArchiDiagram = MISMA ENTIDAD** (Nam Nguyen crea ambos). Unificar en `febhouse.ts` que extiende `archidiagram.ts`.
>
> **La pala y el teclado están en tus manos. E=V.**