# Spec: ArchiDiagram Integration — Nodo Piloto ALRAC Capa 0-3

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Para implementación inmediata  
**Entidad:** ArchiDiagram / Febhouse Studio — Nam Nguyen (Arquitecto, Verified SketchUp Developer)  
**Comunidad:** 60,000+ arquitectos | 3+ años operación | ArchiMate 3.2 native

---

## 1. CONTEXTO

### 1.1 Perfil ArchiDiagram

| Métrica | Valor | Validación ALRAC |
|---------|-------|------------------|
| **Comunidad** | **60,000+ arquitectos** | Base real, no teórica |
| **Experiencia** | **3+ años** (desde 2021) | Operación validada |
| **Standard nativo** | **ArchiMate 3.2** (The Open Group) | Protocolo abierto global |
| **Herramienta puente** | **SketchUp plugins** (2D↔3D) | Caso uso `meshProtocol` + `sketchupBridge` |
| **Educación** | **Tutorials gratuitos** = PHI nativo | Pipeline diseñadores |
| **Fundador** | Nam Nguyen (Arquitecto, Verified SketchUp Dev) | Credibilidad técnica |

### 1.2 Gap Crítico: SaaS Centralizado → HSCSG/ALRAC

ArchiDiagram opera como **SaaS centralizado** con:
- Web app propietaria (React/Next.js + cloud backend)
- Vendor lock-in SketchUp/Trimble (plugins atados a Extension Warehouse)
- Freemium extractivo (upsell templates/assets)
- Cloud-only (no offline-first)
- Contenido centralizado (templates/assets en servidor único)
- Gobernanza top-down (sin CEL, sin 1a1v)

**HSCSG/ALRAC aporta exactamente lo que falta:**
- **Principio Anfibio:** WASM offline-first + mesh/DTN
- **Federación CPP:** Template/Symbol pools cross-studio
- **ZNU Credit:** Soberanía financiera diseñadores (2-3%)
- **Gobernanza 1a1v:** CEL (jurados sorteados) para curación
- **Mesh/DTN:** Colaboración offline en sitios/estudios remotos

---

## 2. ARQUITECTURA TÉCNICA (HSCSG v15 OS / Zeitnus)

### 2.1 Archivos Core a Crear/Extender

| Archivo | Estado | Propósito |
|---------|--------|-----------|
| `src/core/lib/archidiagram.ts` | 📋 **NUEVO** | Lógica pura dominio: tipos, equivalencias, factory |
| `src/core/lib/archimateEngine.ts` | 📋 **NUEVO** | Motor ArchiMate 3.2: capas, aspectos, elementos, relaciones, vistas |
| `src/core/lib/archimateTemplates.ts` | 📋 **NUEVO** | Templates library: viewpoints, patterns, best practices |
| `src/core/lib/diagramSymbols.ts` | 📋 **NUEVO** | Symbol library: elementos, relaciones, colores, estilos |
| `src/core/lib/diagramPedagogy.ts` | 📋 **NUEVO" | Metodología enseñanza: progressive disclosure, pattern recognition |
| `src/core/lib/sketchupBridge.ts` | 📋 **NUEVO** | Bridge 2D↔3D: component mapping, WASM export, DTN sync |
| `src/core/lib/archidiagram.ts` | 📋 **NUEVO** | Integración completa: node, pillars, factory functions |
| `src/core/state/archidiagram.ts` | 📋 **NUEVO** | Tipos estado React/Svelte para UI |
| `src/app/screens/ArchiDiagram.tsx` | 📋 **NUEVO** | Pantalla + tabs + nav Aside + i18n |
| `openspec/specs/archidiagram-integration.md` | ✅ **Base creada** | Spec OpenSpec canónica |

### 2.2 Configuración Nodo ArchiDiagram (`alrac.ts: createArchiDiagramNode()`)

```typescript
// DID: did:key:archidiagram-core
// ArchiMate Engine: WASM compilado (Rust→WASM)
// 4 CPP Pools por defecto: templates, symbols, viewpoints, patterns
// SketchUp Bridge: WASM component mapping + DTN sync
// ArchiMate 3.2: 7 capas, 3 aspectos, 50+ elementos, 20+ relaciones
// Community: 60k+ architects → PHI pipeline
```

### 2.3 ArchiMate 3.2 Engine Types (Core Innovation)

```typescript
// En archimateEngine.ts: Tipos completos ArchiMate 3.2 (The Open Group)

export type ArchiMateLayer = 
  | 'Business' | 'Application' | 'Technology' 
  | 'Physical' | 'Motivation' | 'Strategy' | 'Implementation';

export type ArchiMateAspect = 'Active' | 'Behavior' | 'Passive';

export interface ArchiMateElement {
  id: string;
  type: ArchiMateElementType;
  layer: ArchiMateLayer;
  aspect: ArchiMateAspect;
  name: string;
  documentation?: string;
  properties: Record<string, unknown>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export type ArchiMateElementType = 
  // Business Layer
  | 'BusinessActor' | 'BusinessRole' | 'BusinessCollaboration' | 'BusinessInterface'
  | 'BusinessProcess' | 'BusinessFunction' | 'BusinessInteraction' | 'BusinessEvent'
  | 'BusinessService' | 'BusinessObject' | 'Contract' | 'Representation' | 'Product'
  // Application Layer
  | 'ApplicationComponent' | 'ApplicationCollaboration' | 'ApplicationInterface'
  | 'ApplicationFunction' | 'ApplicationInteraction' | 'ApplicationProcess' | 'ApplicationEvent'
  | 'ApplicationService' | 'DataObject' | 'ApplicationEvent'
  // Technology Layer
  | 'Node' | 'Device' | 'SystemSoftware' | 'TechnologyCollaboration' | 'TechnologyInterface'
  | 'Path' | 'CommunicationNetwork' | 'TechnologyService' | 'Artifact'
  // Physical Layer
  | 'Equipment' | 'Facility' | 'DistributionNetwork' | 'Material'
  // Motivation Layer
  | 'Stakeholder' | 'Driver' | 'Assessment' | 'Goal' | 'Outcome' | 'Principle' | 'Requirement' | 'Constraint'
  // Strategy Layer
  | 'Resource' | 'Capability' | 'CourseOfAction' | 'Value' | 'ValueStream'
  // Implementation Layer
  | 'WorkPackage' | 'Deliverable' | 'ImplementationEvent' | 'Plateau' | 'Gap';

export type ArchiMateRelationshipType = 
  | 'Composition' | 'Aggregation' | 'Assignment' | 'Realization' | 'Serving' | 'Access'
  | 'Influence' | 'Association' | 'Triggering' | 'Flow' | 'Specialization' | 'UsedBy';

export interface ArchiMateRelationship {
  id: string;
  type: ArchiMateRelationshipType;
  source: string;  // element id
  target: string;  // element id
  documentation?: string;
}

export interface ArchiMateView {
  id: string;
  name: string;
  viewpoint: string;  // viewpoint id
  elements: string[];  // element ids
  relationships: string[];  // relationship ids
}

export interface ArchiMateViewpoint {
  id: string;
  name: string;
  layer: ArchiMateLayer;
  allowedElements: ArchiMateElementType[];
  allowedRelationships: ArchiMateRelationshipType[];
  stakeholderConcerns: string[];
}
```

### 2.4 CPP Pools Específicos ArchiDiagram

```typescript
// En archidiagram.ts: ARCHIDIAGRAM_DEFAULT_CPP_POOLS

const pools = [
  {
    id: 'pool_templates',
    name: 'ArchiMate Templates Library',
    authority: { type: 'dao', daoAddress: 'archidiagram_templates.eth' },
    exchangeRules: [
      { fromPool: 'pool_templates', toPool: 'clc_market_pool', rate: { numerator: 1n, denominator: 1n }, curated: true, maxAmountPerPeriod: 1000n, periodDays: 30 }
    ],
    boundaryCuration: [
      { id: 'template_export', sourcePool: 'pool_templates', targetSystem: 'cpp_pool', targetId: 'external_studio', allowedCommitmentTypes: ['archimate_viewpoint', 'archimate_view', 'archimate_model'], requiresCuratorApproval: true, maxVolumePerPeriod: 100n, periodDays: 7 }
    ],
  },
  {
    id: 'pool_symbols',
    name: 'ArchiMate Symbols & Visual Vocabulary',
    authority: { type: 'consensus', curators: [], threshold: 0.66 },
    exchangeRules: [
      { fromPool: 'pool_symbols', toPool: 'clc_market_pool', rate: { numerator: 1n, denominator: 1n }, curated: true, maxAmountPerPeriod: 5000n, periodDays: 30 }
    ],
  },
  {
    id: 'pool_viewpoints',
    name: 'ArchiMate Viewpoints Library (ISO/IEC 42010)',
    authority: { type: 'consensus', curators: [], threshold: 0.75 },
  },
  {
    id: 'pool_patterns',
    name: 'Architecture Patterns Library',
    authority: { type: 'algorithmic', curators: [], algorithmConfig: { categorization: 'archimate_layer', quality: 'peer_reviewed' } },
  },
];
```

---

## 3. MAPEO A ARQUITECTURA ALRAC 5 CAPAS

| Capa ALRAC | ArchiDiagram Aporte | Implementación HSCSG |
|------------|---------------------|---------------------|
| **0 Epistémica** | *Ausente* | γ-CARMIS para validar coherencia diagrama vs realidad construida |
| **0.5 Normativa** | ArchiMate 3.2 standard = normativa técnica | 7 Principios Javier + CEL aplicados a curación diagramas |
| **1 Contable-Física** | Tiempo diseño, energía render, assets = recursos medibles | TQ ledger: 1 TQ = 1 min diseño = 1 kWh render |
| **2 Interoperabilidad** | **ArchiMate 3.2 = protocolo abierto nativo** | CPP pools federados + NDO federation + GNAP |
| **3 Membrana Fiat** | Freemium SaaS = modelo extractivo | Coop diseñadores + ZNU credit 2-3% + priceParity |

---

## 4. PLAN DE CONVERSIÓN PROGRESIVA (HSCSG v15 OS)

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# Contactos clave:
- Nam Nguyen (Fundador) — visión producto/educación
- Febhouse Studio team — operaciones técnicas/plugins

# Acciones:
- Carta individual ALRAC Master §10 (x2)
- γ-CARMIS Preview gratuito (5 casos)
- RAO Verification Lite en Febhouse Studio
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **ArchiMate Engine WASM** | `archimateEngine.ts` + WASM compile | Motor ArchiMate 3.2 offline | 100+ diagramas válidos |
| **Template/Symbol CPP Pools** | `cpp.ts` + `cppBridge` | 2 pools federados + exchangeRules | 50 templates, 200 symbols |
| **SketchUp Bridge Offline** | `sketchupBridge.ts` + WASM | Component mapping 2D↔3D + DTN sync | 1 plugin portado nativo |
| **Diagram Pedagogy γ-CARMIS** | `kernelProtocol` + `ev.ts` | 50 estudiantes entrenados | αʰ post > 0.8 |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- Nodo ArchiDiagram en HSCSG v15 OS → `.gnap` + `RAO` + `DID`
- **Federación estudios arquitectura** → CPP pools templates/assets cross-border
- **Federación universidades** → PHI pipeline estudiantes → profesionales
- Constitución cooperativa diseñadores (ALRAC Master §10)
- Despliegue nodo diagrama offline (WASM + mesh DTN)

### Fase 3: Autonomía Plena (Mes 4-12)
- ALRAC = vehículo comercial ArchiDiagram (Paso 0 con Nam)
- **Red nodos diagramas federados**: Estudios + Universidades + ArchiDiagram core
- Gobernanza 1a1v real → GAIA COMMONS
- Economía mixta: TQ interno + ZNU puente fiat + USD sponsors

---

## 5. SINERGIAS CRÍTICAS

| Proyecto HSCSG | Sinergia | Mecanismo Concreto |
|----------------|----------|-------------------|
| **Solarpunk Utopia** | Mesh/DTN para diagrama offline colaborativo | `meshNode` + `dtnBundle` en estudios |
| **Nondominium (Sensorica)** | NDO para diagramas = recurso federado | `NdoHardLink` diagramas ↔ templates ↔ symbols |
| **Ruddick/GEF** | Diagramas mapeo territorial (mweria/kaya) | `trustBasket.ts` + `archimateEngine.ts` |
| **Samay Permacultura** | Diagramas hidrológicos/territoriales (SAMAY OS) | `waterDesign.ts` + `archimateEngine.ts` |
| **+Colonia** | Masterplan diagrams (Gómez Platero) → ArchiMate | `colonya.ts` + `archimateTemplates.ts` |
| **Feria Conuquera** | Diagramas territorio/comunidad (mweria visual) | `feria.ts` + `diagramPedagogy.ts` |
| **Soulpreneurs (70k)** | Pipeline diseñadores conscientes → estudios | Cohorte "Soulpreneurs Architecture" en PHI |

---

## 6. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| Vendor lock-in SketchUp/Trimble | Alta | Crítico | Principio Anfibio: WASM nativo + mesh/DTN, SketchUp opcional |
| SaaS centralizado → lock-in usuarios | Alta | Crítico | Principio Anfibio: WASM offline-first + mesh/DTN + localStorage |
| ArchiMate standard vs extensiones propietarias | Media | Alto | `archimateEngine.ts` estricto 3.2 + extensiones via CPP pools |
| Monetización freemium extractiva | Media | Alto | ZNU credit 2-3% + cooperativa = soberanía financiera |
| Centralización contenido (templates/assets) | Alta | Crítico | CPP pools federados + NDO federation + GNAP cross-repo |
| Dependencia cloud/CDN para assets | Alta | Crítico | Mesh/DTN + IPFS/Filecoin + meshProtocol Solarpunk |

---

## 7. MÉTRICAS DE ÉXITO (90 días / 1 año)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | ArchiMate Engine WASM operativo | 1 diagrama válido | 1000+/mes |
| | Template/Symbol CPP pools | 2 pools + exchangeRules | 10 pools federados |
| | SketchUp Bridge offline | 1 plugin portado | 5 plugins nativos |
| **Documentales** | `archidiagram_integration.md` | ✅ Completa | v2 actualizada |
| | `openspec/specs/archidiagram-integration.md` | ✅ Creada | PVL compliant |
| | Cartas individuales (2) | 2 enviadas | Respuestas |
| **Operativos** | Agente `archidiagram-node` GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "ArchiDiagram" | 50 inscritos | 200 + facilitadores |
| **Estratégicos** | Decisión ALRAC = vehículo ArchiDiagram | Definida (Paso 0) | Ejecutada |
| | Federación 5+ estudios | Piloto CPP | 20+ nodos |

---

## 8. PRÓXIMOS PASOS INMEDIATOS (Esta Semana)

### Día 1-2: Fundación
- [x] **Backup Fase 0** HSCSG_v15_OS (pendiente)
- [x] **Crear `docs/archidiagram_backup.md`** ✅
- [x] **Crear `docs/archidiagram_integration.md`** ✅
- [ ] **Registrar contactos** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 2 cartas ALRAC Master §10** a: Nam Nguyen, Febhouse Studio lead
- [ ] **Solicitar γ-CARMIS Preview** (5 casos gratis)
- [ ] **RAO Verification Lite** en Febhouse Studio

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/archidiagram-integration.md`** (basado en este doc)
- [ ] **Implementar `src/core/lib/archidiagram.ts`** + tipos
- [ ] **Implementar `src/core/lib/archimateEngine.ts`** (core ArchiMate 3.2)
- [ ] **Registrar agente `archidiagram-node` en `.gnap/agents.json`**

---

## 9. REFERENCIAS CRUZADAS

| Documento | Sección | Actualización |
|-----------|---------|---------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir ArchiDiagram |
| `docs/GRANALLIANZA_MAPPING.md` | 7 holones | PHI/MYCELIUM/GAIA NETWORK |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `archidiagram-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | `ArchiDiagramNode`, `ArchiMateModel` |
| `Solarpunk_Utopia_Mapping.md` | Mesh/DTN | Caso uso colaborativo |

---

## 10. CITAS ANCLA

> **"Architectural diagrams should be easy, intuitive, and accessible for everyone."** — Nam Nguyen

> **"Most architects struggled with diagram presentation, even when their ideas were strong."** — Problema validado 60k+ usuarios

> **"ArchiDiagram was born from a simple idea: a place where anyone can learn, download templates, and improve their design communication skills in a practical way."** — Origin story

---

## 11. CONCLUSIÓN: ARCHIDIAGRAM COMO NODO PILOTO ESTRATÉGICO

**Condiciones únicas:**
1. ✅ **Comunidad real 60k+** — Caso de uso real, no teórico
2. ✅ **Standard abierto nativo** — ArchiMate 3.2 = protocolo abierto
3. ✅ **Herramienta puente 2D↔3D** — Caso uso `meshProtocol` + `sketchupBridge` nativo
4. ✅ **Educación nativa (PHI)** — Tutorials gratuitos = pedagogía válida
5. ✅ **Gap crítico exacto** — SaaS centralizado + vendor lock-in + cloud-only → **HSCSG/ALRAC resuelve exactamente esto**

---

> **Nota de spec:** Este documento sigue OpenSpec PVL. La implementación TypeScript en `src/core/lib/` es la referencia ejecutable. ArchiDiagram + Solarpunk + Ruddick/GEF forman la **triangulación visual/territorial/ancestral** para federación ALRAC.
>
> **La pala y el teclado están en tus manos. E=V.**