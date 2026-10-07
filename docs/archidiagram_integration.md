# Integración: ArchiDiagram → HSCSG v15 OS / ALRAC

**Fecha:** 2026-10-06  
**Fuente:** `docs/archidiagram_backup.md` (extracción web archidiagram.com)  
**Entidad:** ArchiDiagram / Febhouse Studio — Nam Nguyen  
**Metodología:** HSCSG v15 OS — Flujo 4 fases + Principio Anfibio + Triple Perspectiva

---

## 1. Perspectiva USUARIO — Qué quiere lograr en su nodo

> **Objetivo:** Crear diagramas arquitectónicos claros, profesionales y comunicativos sin fricción técnica, accesible para estudiantes y profesionales por igual.

### Necesidades Explícitas del Usuario Final
- **Aprender a diagramar:** Tutoriales paso a paso para diagramas arquitectónicos
- **Acelerar workflow:** Templates, symbols, assets listos para usar
- **Automatizar en SketchUp:** Plugins que aceleran creación de diagramas
- **Comunicar ideas claramente:** Diagramas que venden/explican conceptos arquitectónicos
- **Acceso libre/barato:** Recursos gratuitos + premium asequible (estudiantes)

### Dolores No Resueltos (Oportunidades HSCSG)
- **Dependencia SaaS centralizado:** Web app propietaria, no offline-first
- **Vendor lock-in SketchUp:** Plugins atados a ecosistema Trimble/SketchUp
- **Centralización contenido:** Tutorials/assets en servidor central (punto único fallo)
- **No interoperabilidad:** Formatos propietarios, sin estándares abiertos (ArchiMate/XML)
- **Monetización extractiva:** Freemium → upsell, no modelo postmonetario
- **Sin gobernanza comunitaria:** Top-down, sin CEL/jurados sorteados
- **Dependencia cloud:** Requiere conectividad, no offline-first (Principio Anfibio violado)

---

## 2. Perspectiva LLM — Qué asimilar (lógica pura) y qué extirpar (infra ajena)

### ASIMILAR (Lógica Pura → Módulos HSCSG)

| Componente ArchiDiagram | Módulo HSCSG | Lógica Extraíble |
|-------------------------|--------------|------------------|
| **Templates diagramas** | `diagramTemplates.ts` / `archimateTemplates.ts` | Patrones visuales reutilizables: capas, vistas, notación ArchiMate |
| **Symbols/Assets library** | `diagramSymbols.ts` / `visualVocabulary.ts` | Vocabulario visual estandarizado: capas, elementos, relaciones, colores |
| **Workflow tools** | `diagramWorkflow.ts` / `architecturalProcess.ts` | Proceso paso a paso: concepto → esquema → diagrama → presentación |
| **ArchiMate notation** | `archimateEngine.ts` | Motor notación ArchiMate 3.2: capas (Business, Application, Technology), aspectos (Active, Behavior, Passive), relaciones |
| **Diagram types taxonomy** | `diagramTaxonomy.ts` | Taxonomía: Viewpoints, Viewpoints, View, Viewpoint Catalogue (ISO/IEC 42010) |
| **Presentation templates** | `presentationEngine.ts` | Motor presentaciones: storytelling visual, narrative flow, export formats |
| **SketchUp integration logic** | `sketchupBridge.ts` | Lógica bridge: export/import SKP, layout 2D→3D, component mapping |
| **Tutorial pedagogy** | `diagramPedagogy.ts` | Metodología enseñanza: progressive disclosure, pattern recognition, critique framework |

### EXTIRPAR (Infra Ajena — Solo docs local `~/docs/archidiagram_*_local.md`)

- Web app React/Next.js propietaria (frontend)
- Backend API centralizada (auth, payments, CDN)
- SketchUp Extension Warehouse deployment (vendor lock-in)
- Stripe/payments integration
- User accounts/auth centralizado (Firebase/Auth0)
- Analytics/tracking (Google Analytics, Mixpanel)
- Branding visual: logos, colors, UI proprietary
- Marketing funnel: email capture, upsell flows
- YouTube/Instagram/TikTok embeds
- PII data collection (emails, usage tracking)

---

## 3. Perspectiva HSCSG+CaaS — Isomorfismo con Leyes MJ + CaaS + ALRAC + GNAP + ZNU + EV_CORE + MINIAGI + SOLARPUNK

### Mapeo a Arquitectura ALRAC 5 Capas

| Capa ALRAC | ArchiDiagram Manifestación | Gap / Oportunidad HSCSG |
|------------|---------------------------|-------------------------|
| **0 Epistémica** | *Ausente* — no hay marco diagnóstico | **Oportunidad:** γ-CARMIS para detectar incoherencias diagrama vs realidad |
| **0.5 Normativa** | *Parcial* — mejores prácticas, standards ArchiMate | **Gap:** Falta gobernanza comunitaria (CEL), 7 Principios Javier aplicados a diagramas |
| **1 Contable-Física** | *Ausente* — no hay contabilidad recursos | **Implementar:** TQ ledger para tiempo/diseño, catálogo energético (LEF) para render |
| **2 Interoperabilidad** | *Parcial* — ArchiMate exchange format | **Implementar:** CPP pools para intercambio templates/assets cross-studio |
| **3 Membrana Fiat** | **Freemium/SaaS centralizado** | **Estructurar:** Cooperativa diseñadores + ZNU credit + priceParity oráculo |

### Mapeo a 7 Holones Gran Alianza

| Holón | Rol en ArchiDiagram | Línea ALRAC | KPI |
|-------|---------------------|-------------|-----|
| **GAIA** (Articulación) | ArchiMate framework = articulación capas | A: Diagnóstico encaje | % diagramas validados ArchiMate |
| **MYCELIUM** (Matching/Infra) | Templates/symbols library = infra compartida | B: Kit simulación / C: Prototipado | Matches template-necesidad |
| **PROJECT WEAVE** (Credenciales) | RAO para diseñadores/estudios | A, C | % credenciales verificadas |
| **PHI** (Educación) | Tutorials gratuitos = PHI nativo | B: Kit simulación | # tutorials, completion rate |
| **HIVE IA** (Matching IA) | AI-assisted diagramming (futuro) | D: γ-CARMIS training | # diagrams AI-assisted |
| **GAIA NETWORK** (Mercado) | Marketplace templates/assets | C: Prototipado vía | Revenue + TQ medido |
| **DATA TRUST + COMMONS** (Gobernanza) | Datos usuarios, diagramas, templates | E: Nodos TQ | % datos soberanos, decisiones 1a1v |

---

## 4. Plan de Conversión Progresiva a Nodo HSCSG v15 OS

### Fase 0: Contacto y Diagnóstico (Semana 1-2)
```bash
# 1. Identificar decisores clave
- Nam Nguyen (Fundador) — visión producto/educación
- Febhouse Studio team — operaciones técnicas

# 2. Carta individual ALRAC Master §10 (plantilla)
# 3. γ-CARMIS Preview gratuito (5 casos) → detectar incoherencias
# 4. RAO Verification Lite en Febhouse Studio
```

### Fase 1: Piloto Mínimo Viable (Semana 3-6)

| Piloto | Módulo HSCSG | Entregable | Métrica |
|--------|--------------|------------|---------|
| **ArchiMate Engine Offline** | `archimateEngine.ts` + `diagramEngine.ts` | Motor ArchiMate 3.2 offline (WASM/Rust) | 100+ diagramas validados |
| **Template Library CPP Pool** | `cpp.ts` + `cppBridge` | Pool templates compartido cross-studio | 50+ templates, 10 estudios |
| **Symbol Library ZNU Credit** | `ZNU` vesting + `ALRAC` Capa 3 | Financiamiento symbols library 2-3% | 500+ symbols, 5 estudios |
| **Diagram Pedagogy γ-CARMIS** | `kernelProtocol` + `ev.ts` | 50 estudiantes entrenados protocolo | αʰ post-entreno > 0.8 |
| **SketchUp Bridge Offline** | `meshProtocol` + `dtnBundle` | Bridge SKP↔ArchiMate offline-first | 5 plugins portados |

### Fase 2: Escalamiento y Federación (Semana 7-12)
- **Nodo ArchiDiagram en HSCSG v15 OS** → registro `.gnap` + `RAO` + `DID`
- **Federación con estudios arquitectura** → CPP pools templates/assets cross-border
- **Federación con universidades** → PHI pipeline estudiantes → profesionales
- **Constitución legal cooperativa trabajo asociado** (diseñadores + desarrolladores)
- **Despliegue primer nodo diagrama offline** (WASM ArchiMate engine + mesh DTN)

### Fase 3: Autonomía Plena (Mes 4-12)
- **ALRAC = vehículo comercial ArchiDiagram** (decisión Paso 0 con Nam)
- **Red nodos diagramas federados**: Estudios + Universidades + ArchiDiagram core
- **Gobernanza 1a1v real** → asambleas diseñadores + GAIA COMMONS
- **Economía mixta operativa**: TQ interno (tiempo diseño) + ZNU puente fiat + USD sponsors

---

## 5. Integración Técnica Inmediata (HSCSG v15 OS)

### Archivos a Crear/Extender

#### 1. `src/core/lib/archidiagram.ts` — Lógica Pura ArchiDiagram
```typescript
// Tipos dominio ArchiDiagram
interface ArchiDiagramNode {
  did: DID;                           // did:key:archidiagram-core
  name: 'ArchiDiagram';
  founder: 'Nam Nguyen';
  studio: 'Febhouse Studio';
  archimateVersion: '3.2';
  communitySize: 60000;
  pillars: ArchiDiagramPillar[];
  sketchupBridge: SketchUpBridgeConfig;
  pedagogy: DiagramPedagogyConfig;
  templates: TemplateLibrary;
  symbols: SymbolLibrary;
}

interface ArchiDiagramPillar {
  id: 'templates' | 'symbols' | 'workflows' | 'education' | 'sketchup' | 'archimate';
  name: string;
  description: string;
  tqAccounting: boolean;
  cppPoolId?: PoolId;
  znuCreditEligible: boolean;
}

// Archimate 3.2 Engine Types
interface ArchiMateModel {
  layers: ['Business', 'Application', 'Technology', 'Physical', 'Motivation', 'Strategy', 'Implementation'];
  aspects: ['Active', 'Behavior', 'Passive'];
  elements: ArchiMateElement[];
  relationships: ArchiMateRelationship[];
  views: ArchiMateView[];
  viewpoints: ArchiMateViewpoint[];
}

// SketchUp Bridge (offline-first)
interface SketchUpBridgeConfig {
  enabled: boolean;
  wasmEngine: boolean;           // ArchiMate engine en WASM
  sketchupVersion: string;       // Compatibilidad versión
  componentMapping: MappingRule[]; // 2D diagram ↔ 3D component
  offlineSync: boolean;          // DTN/NATS sync
}
```

#### 2. `openspec/specs/archidiagram-integration.md` — Spec OpenSpec
```markdown
# Spec: ArchiDiagram Integration (Capa 0-3 ALRAC)

## Contexto
Plataforma 60k+ arquitectos, templates, symbols, ArchiMate 3.2, SketchUp plugins.
Validación empírica: 60k users, 3+ años operación, Verified SketchUp Developer.

## Objetivo
Integrar ArchiDiagram como nodo piloto HSCSG v15 OS con:
- ArchiMate Engine offline (WASM)
- Template/Symbol CPP pools federados
- ZNU credit para symbols library
- GNAP cross-repo con HSCSG, universidades, estudios
- SketchUp Bridge offline-first (mesh/DTN)
```

#### 3. `src/app/screens/ArchiDiagram.tsx` — Pantalla (Icono: `Blueprint` o `Layout`)
```tsx
// Tabs: ArchiMate Engine | Templates | Symbols | Workflows | Education | SketchUp Bridge | Federación
// i18n keys: nav.archidiagram, tabs.archimate, tabs.templates...
// Lucide icon: Blueprint (válido) o Layout
```

#### 4. Nav + i18n
```typescript
// Aside.tsx: añadir { key: 'archidiagram', label: 'ArchiDiagram', icon: Blueprint, color: 'indigo', path: '/archidiagram' }
// i18n.ts: nav.archidiagram (ES: 'ArchiDiagram', EN: 'ArchiDiagram', PT: 'ArchiDiagrama')
```

---

## 6. Sinergias Críticas con Proyectos Ya Asimilados

| Proyecto HSCSG | Sinergia con ArchiDiagram | Acción Concreta |
|----------------|---------------------------|-----------------|
| **Solarpunk Utopia** | Mesh/DTN/NATS para diagrama offline colaborativo | Desplegar `meshNode` + `dtnBundle` en estudios arquitectura |
| **Nondominium (Sensorica)** | NDO para diagramas = recurso compartido federado | `NdoHardLink` diagramas ↔ templates ↔ symbols |
| **Ruddick/GEF (Economía Raíces)** | Diagramas para mapeo territorial (mweria/kaya) | `trustBasket.ts` + `archimateEngine.ts` |
| **Samay Permacultura** | Diagramas hidrológicos/territoriales (SAMAY OS) | `waterDesign.ts` + `archimateEngine.ts` |
| **+Colonia** | Masterplan diagrams (Gómez Platero) → ArchiMate | `colonya.ts` + `archimateTemplates.ts` |
| **Feria Conuquera** | Diagramas territorio/comunidad (mweria visual) | `feria.ts` + `diagramPedagogy.ts` |
| **Soulpreneurs (70k)** | Pipeline diseñadores conscientes → estudios arquitectura | Cohorte "Soulpreneurs Architecture" en PHI/Mycelium |

---

## 7. Riesgos y Mitigaciones Específicos ArchiDiagram

| Riesgo | Probabilidad | Impacto | Mitigación HSCSG |
|--------|--------------|---------|------------------|
| **Vendor lock-in SketchUp/Trimble** | Alta | Crítico | Principio Anfibio: ArchiMate engine WASM nativo + mesh/DTN, plugins SketchUp como *opcional* |
| **SaaS centralizado → vendor lock-in usuarios** | Alta | Crítico | Principio Anfibio: WASM offline-first + mesh/DTN + localStorage/IndexedDB |
| **ArchiMate standard vs extensiones propietarias** | Media | Alto | `archimateEngine.ts` estricto ArchiMate 3.2 + extensiones via CPP pools |
| **Monetización freemium extractiva** | Media | Alto | ZNU credit 2-3% + cooperativa diseñadores = soberanía financiera |
| **Centralización contenido (templates/assets)** | Alta | Crítico | CPP pools federados + NDO federation + GNAP cross-repo |
| **Dependencia cloud/CDN para assets** | Alta | Crítico | Mesh/DTN + IPFS/Filecoin para assets + meshProtocol Solarpunk |
| **Falta gobernanza comunitaria** | Media | Alto | CEL (jurados sorteados) para curación templates/symbols |

---

## 8. Métricas de Éxito (Alignadas ALRAC Master)

| Categoría | KPI | Target 90 días | Target 1 año |
|-----------|-----|----------------|--------------|
| **Técnicos** | ArchiMate Engine WASM operativo | 1 diagrama válido | 1000+ diagramas/mes |
| | Template CPP pool operativo | 50 templates | 500+ templates federados |
| | Symbol library ZNU credit | 100 symbols | 1000+ symbols |
| | SketchUp Bridge offline | 1 plugin portado | 5 plugins nativos |
| **Documentales** | `archidiagram_integration.md` triple perspectiva | Completa | Actualizada v2 |
| | `openspec/specs/archidiagram-integration.md` | Creada | Compliant PVL |
| | Cartas individuales (Nam + team) | 2 enviadas | Respuestas documentadas |
| **Operativos** | Agente `archidiagram-node` en GNAP | Registrado | Heartbeat activo |
| | Cohorte PHI "ArchiDiagram" | 50 inscritos | 200 + facilitadores γ-CARMIS |
| | Facilitadores γ-CARMIS certificados | 5 | 25 |
| **Estratégicos** | Decisión ALRAC = vehículo ArchiDiagram | Definida (Paso 0) | Ejecutada |
| | Federación 5+ estudios arquitectura | Piloto CPP | 20+ nodos federados |
| | Velocity ZNU > 0 | Medible | Autosustentable |

---

## 9. Próximos Pasos Inmediatos (Esta Semana)

### Día 1-2: Fundación
- [ ] **Ejecutar backup Fase 0** HSCSG_v15_OS
- [ ] **Crear `docs/archidiagram_backup.md`** ✅ (hecho)
- [ ] **Crear `docs/archidiagram_integration.md`** (este documento — triple perspectiva completa)
- [ ] **Registrar contactos clave** en `caasOutreach` board (GNAP task chain)

### Día 3-4: Contacto Estratégico
- [ ] **Enviar 2 cartas individuales** (plantilla ALRAC Master §10) a: Nam Nguyen, Febhouse Studio lead
- [ ] **Solicitar reunión γ-CARMIS Preview** (5 casos gratis) con equipo
- [ ] **RAO Verification Lite** en Febhouse Studio

### Día 5-7: Técnico
- [ ] **Crear `openspec/specs/archidiagram-integration.md`** (este archivo como base)
- [ ] **Implementar `src/core/lib/archidiagram.ts`** + tipos estado
- [ ] **Crear `src/core/lib/archimateEngine.ts`** (core types ArchiMate 3.2)
- [ ] **Registrar agente `archidiagram-node` en `.gnap/agents.json`**

---

## 10. Referencias Cruzadas Repositorio

| Documento | Sección | Actualización Requerida |
|-----------|---------|------------------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §12 Colaboraciones | Añadir ArchiDiagram como colaboración explícita |
| `docs/GRANALLIANZA_MAPPING.md` | Línea B/C/D/E | Añadir ArchiDiagram nodo real holón PHI/MYCELIUM/GAIA NETWORK |
| `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Mapping Samay | Añadir ArchiDiagram como herramienta diagrama territorio |
| `openspec/specs/SPEC_INDEXER.md` | Índice specs | Añadir `archidiagram-integration.md` |
| `src/core/lib/alrac.ts` | Tipos core | Extender con `ArchiDiagramNode`, `ArchiMateModel` |
| `Solarpunk_Utopia_Mapping.md` | Mesh/DTN | Añadir ArchiDiagram como caso uso mesh colaborativo |

---

## 11. Citas Clave para Documentos Futuros

> **"Architectural diagrams should be easy, intuitive, and accessible for everyone—whether you're working on a school project or professional presentation."** — Nam Nguyen

> **"Most architects struggled with diagram presentation, even when their ideas were strong."** — Problema central validado

> **"ArchiDiagram was born from a simple idea: a place where anyone can learn, download templates, and improve their design communication skills in a practical way."** — Origin story

> **"At ArchiDiagram, our mission is to help architects communicate their ideas more clearly."** — Mission statement

---

## 12. Conclusión: ArchiDiagram como Nodo Piloto Estratégico HSCSG

**ArchiDiagram cumple condiciones únicas:**

1. **Comunidad real validada** — 60k+ arquitectos, 3+ años, caso de uso real
2. **Standard abierto nativo** — ArchiMate 3.2 = protocolo abierto (The Open Group)
3. **Herramienta puente** — 2D diagrams ↔ 3D SketchUp = caso uso `meshProtocol` + `sketchupBridge`
4. **Educación nativa (PHI)** — Tutorials gratuitos = pedagogía nativa
5. **Gap crítico exacto** — SaaS centralizado, vendor lock-in SketchUp, cloud-only → **HSCSG/ALRAC aporta exactamente: offline-first, mesh/DTN, federación CPP, ZNU credit, gobernanza 1a1v**

**Conversión progresiva:** No "vender" HSCSG, sino **demostrar valor operativo** via piloto ArchiMate Engine WASM + Template Pool CPP + Symbol Library ZNU que resuelvan dolores reales ArchiDiagram: vendor lock-in, offline access, federación templates, soberanía financiera diseñadores.

---

## 13. Próximos Hitos Arquitectónicos

| Hito | Descripción | Dependencias |
|------|-------------|--------------|
| **H1: ArchiMate Engine WASM** | `archimateEngine.ts` compilado a WASM, 100+ diagramas válidos | Día 5-7 |
| **H2: Template/Symbol CPP Pools** | 2 pools federados (templates + symbols) con exchangeRules | H1 + Día 8-10 |
| **H3: SketchUp Bridge Offline** | WASM component mapping 2D↔3D + DTN sync | H1 + H2 |
| **H4: Nodo GNAP + Federación** | Agente registrado + 3 task chains cross-border | H2 + H3 |
| **H5: ALRAC = Vehículo ArchiDiagram** | Decisión Paso 0 con Nam + ejecución | H4 |

---

## 14. Citas Ancla

> **"ArchiDiagram is an online platform that provides architecture students, designers, and professionals with practical resources for creating clear, impactful architectural diagrams."** — Web oficial

> **"Empowering Architects Visually: At ArchiDiagram, our mission is to help architects communicate their ideas more clearly."** — Mission statement

> **"Architectural diagrams should be easy, intuitive, and accessible for everyone."** — Nam Nguyen

> **"Most architects struggled with diagram presentation, even when their ideas were strong."** — Problema validado 60k+ usuarios

> **"ArchiDiagram was born from a simple idea: a place where anyone can learn, download templates, and improve their design communication skills in a practical way."** — Origin story

---

> **Nota de asimilación:** Este documento sigue metodología HSCSG v15 OS rigurosa: Fase 0 backup → Fase 1 extracción exhaustiva → Fase 2 triple perspectiva → Fase 3 módulo técnico + spec OpenSpec → Fase 4 verificación. El **Principio Anfibio** se aplica desde diseño: misma lógica opera en modo **Triaxial** (offline, postmonetario, TQ/ZNU) y **TypeSafe** (conectado, USD/USDC via priceParity, Nivel 3 ReFi).
>
> **La pala y el teclado están en tus manos. E=V.**