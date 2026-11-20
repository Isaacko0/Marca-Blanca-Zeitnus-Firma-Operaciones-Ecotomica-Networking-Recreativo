# Integración RegenTribe Organización y Tech-Stack

**Fuente asimilada:** `docs/regen-tribe-org_backup.md` — Organización GitHub regentribes + tech-stack regentribe.co/tech-stack. Extensión directa del RNMD ya asimilado (`docs/regenerative-neighborhood-rnmd_*`). Todos los derechos de autor permanecen con RegenTribe.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). Esta integración conecta el marco modular RNMD ya asimilado con el ecosistema operativo de RegenTribe: knowledge graph, AI agent Genesis, affinity mapping Mythogen AME, 3D visualization Regen Vision, y el stack Myconet (11 módulos). Se asimila como lógica de dominio pura; no se copia código ni assets de RegenTribe.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un knowledge graph semántico de su barrio**: transformar documentos comunitarios en grafo tipado y recorrible con LLM extraction, vector embeddings, epistemic truth values (Regen Knowledge Graph).
- **Un agente AI que guíe la creación del barrio**: Genesis en Telegram, recorre la Community Alchemy Guide (11 pasos), captura ideas y las convierte en specs de desarrollo.
- **Mapeo de afinidad y confianza**: Mythogen AME con Tri-Layered System (BODY / FIELD / SEED), Living Seed Patterns, Fields of Trust.
- **Visualización 3D del conocimiento**: force-directed graph para explorar ideas, personas y conexiones del ecosistema regenerativo.
- **Un stack modular de internet/intranet para el barrio**: Myconet con 11 módulos (Community Network, Neighborhood Directory, Resources & Tools, Blueprint, Join, Agreements, Operations, Contribution Tracking, Governance, AI Personal Assistant, Hive).
- **Un playbook unificado**: Regen Neighborhood Framework sintetiza Community Alchemy Guide, 5-Spiral development model, field insights.
- **Red entre barrios (Hive)**: inter-community layer para compartir recursos, conocimiento, excedentes, personas.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto RegenTribe | Módulo Zeitnus/ALRAC destino | Observación |
|---------------------|------------------------------|-------------|
| Knowledge graph semántico (LLM extraction, vector embeddings, epistemic truth values) | `src/core/lib/regen-knowledge-graph.ts` (NUEVO) | Grafo tipado de conceptos y relaciones |
| Genesis AI Agent (Community Alchemy Guide, 11 pasos) | `src/core/lib/genesis-agent.ts` (NUEVO) | Orquestador de specs de desarrollo |
| Mythogen AME (Tri-Layered BODY/FIELD/SEED, Fields of Trust) | `src/core/lib/mythogen-ame.ts` (NUEVO) | Affinity mapping y detección de campos de confianza |
| Regen Vision (3D force-directed graph) | `src/core/lib/regen-vision.ts` (NUEVO) | Visualización de estructuras de conocimiento |
| Myconet: 11 módulos (Community Network, Directory, Blueprint, Governance, etc.) | `src/core/lib/myconet-*.ts` (NUEVO) | Lógica pura de cada módulo, sin UI de Tribes Platform |
| 5 pilares (Ecology, Social, Economy, Hardware, Governance) | `rnmd-*.ts` existentes + `tq-land.ts`, `caas.ts`, `tq-tdf.ts` | Mapeo a capas del RNMD |
| Community Alchemy Guide (11 pasos) | `genesis-agent.ts` + `registrySystem.ts` | Proceso de creación de barrio |
| Tribes Platform (1,400 usuarios, red social) | `registrySystem.ts` + `currentSeeSystem.ts` | Registro de usuarios y nodos, no dependencia de plataforma |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Tribes Platform (app específica, 1,400 usuarios) | Infra de red social ajena | Lógica pura en TS; UI propia de HSCSG |
| Stripe (payment rails en Agreements) | Infra financiera externa | ZNU/CaaS como moneda nativa; Stripe solo como referencia externa |
| Telegram (Genesis agent) | Plataforma de mensajería externa | Lógica del agent como función TS pura; Telegram como canal de entrada opcional |
| Supabase / Cloudflare Workers (MyCoNet ADRs) | Infra de backend ajena | Lógica pura en TS; despliegue propio de HSCSG |
| Next.js (MyCoNet frontend) | Infra de frontend ajena | No se asimila; UI propia |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de RegenTribe tech-stack |
|--------|--------------------------------|
| `src/core/lib/regen-knowledge-graph.ts` | (NUEVO) Knowledge graph semántico con epistemic truth values |
| `src/core/lib/genesis-agent.ts` | (NUEVO) Agente AI que guía Community Alchemy Guide (11 pasos) |
| `src/core/lib/mythogen-ame.ts` | (NUEVO) Affinity mapping, Fields of Trust, Tri-Layered System |
| `src/core/lib/regen-vision.ts` | (NUEVO) Visualización 3D de conocimiento |
| `src/core/lib/myconet-community-network.ts` | (NUEVO) Discovery y AI matching de miembros |
| `src/core/lib/myconet-neighborhood-directory.ts` | (NUEVO) Directorio en mapa vivo de barrios |
| `src/core/lib/myconet-blueprint.ts` | (NUEVO) Regenerative Neighborhood Wizard |
| `src/core/lib/myconet-agreements.ts` | (NUEVO) Digital agreements, contribuciones recurrentes |
| `src/core/lib/myconet-operations.ts` | (NUEVO) Project boards, task assignment, budget tracking |
| `src/core/lib/myconet-contribution-tracking.ts` | (NUEVO) Points, badges, reputation portable |
| `src/core/lib/myconet-governance.ts` | (NUEVO) AI-facilitated governance, conflictos, propuestas, votación |
| `src/core/lib/myconet-ai-assistant.ts` | (NUEVO) AI Personal Assistant para residentes |
| `src/core/lib/myconet-hive.ts` | (NUEVO) Inter-community layer, red entre barrios |
| `src/core/state/regen-tribe.ts` | (NUEVO) Estado del ecosistema RegenTribe |
| `rnmd-*.ts` existentes | Extender: 5 pilares, arquetipos, sistemas de recursos |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- RegenTribe: economía justa, contribución local, sostenibilidad financiera; no especulación; conocimiento abierto.
- HSCSG: MJ Gate bloquea acciones que degraden base; `boundaries.ts` DENY contra especulación.
- **Resonancia:** la economía de contribución justa se mapea a límites duros de no extracción.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- RegenTribe: fair contribution, local exchange, reputation tracking (points, badges, reputation portable); acceso por contribución.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** la reputación y contribución generan acceso y rol en la red de barrios.

### Ley III — Lucidez, nunca engañar
- RegenTribe: epistemic truth values en knowledge graph; conocimiento abierto; AI-facilitated governance transparente.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** todo flujo de conocimiento y gobernanza es trazable con valores de verdad epistémica.

### CaaS (Comunidad como Servicio)
- RegenTribe: red opt-in de apoyo mutuo (Hive); AI matching para encontrar tu tribu; contribución tracking portable entre comunidades.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; 4 registros separados.
- **Resonancia:** el acceso a la red se gana con contribución real; la reputación es portable.

---

## 4. Tabla de mapeo isomórfico (RegenTribe tech-stack → Zeitnus/ALRAC)

| Concepto RegenTribe | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|---------------------|----------------------|------|----------|--------|
| Knowledge graph semántico (epistemic truth values) | `regen-knowledge-graph.ts` | Capa 4 | Ley III | **Pendiente** |
| Genesis AI Agent (Community Alchemy Guide, 11 pasos) | `genesis-agent.ts` | Capa 4 | Ley II | **Pendiente** |
| Mythogen AME (Tri-Layered BODY/FIELD/SEED) | `mythogen-ame.ts` | Capa 4 | Ley II/III | **Pendiente** |
| Regen Vision (3D force-directed graph) | `regen-vision.ts` | Capa 4 | Ley III | **Pendiente** |
| Myconet Community Network (AI matching) | `myconet-community-network.ts` | Capa 4 | CaaS | **Pendiente** |
| Myconet Neighborhood Directory (mapa vivo) | `myconet-neighborhood-directory.ts` | Capa 4 | Ley III | **Pendiente** |
| Myconet Blueprint (Neighborhood Wizard) | `myconet-blueprint.ts` | Capa 4 | Ley II | **Pendiente** |
| Myconet Agreements (digital agreements, Stripe) | `myconet-agreements.ts` | Capa 5 | Ley II | **Pendiente** |
| Myconet Operations (project boards, budget) | `myconet-operations.ts` | Capa 4 | Ley II | **Pendiente** |
| Myconet Contribution Tracking (points, badges, reputation) | `myconet-contribution-tracking.ts` | Capa 5 | Ley II | **Pendiente** |
| Myconet Governance (AI-facilitated, conflictos, votación) | `myconet-governance.ts` | Capa 5 | Ley III | **Pendiente** |
| Myconet AI Personal Assistant | `myconet-ai-assistant.ts` | Capa 4 | Ley III | **Pendiente** |
| Myconet Hive (inter-community layer) | `myconet-hive.ts` | Capa 4 | CaaS | **Pendiente** |
| 5 pilares (Ecology, Social, Economy, Hardware, Governance) | `rnmd-*.ts` + `tq-land.ts`, `caas.ts`, `tq-tdf.ts` | Capas 1-5 | Todas | Implementado (partial) |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|-----------------------------------|
| Knowledge graph con epistemic truth values | Neo4j u otra base de datos de grafos externa |
| Genesis agent que recorre 11 pasos de alquimia | Telegram como motor de ejecución |
| Mythogen AME Tri-Layered System | Infra de mapeo visual específica |
| Regen Vision 3D force-directed graph | Librería de visualización 3D como dependencia crítica |
| Myconet 11 módulos (lógica pura) | Tribes Platform app, Supabase, Cloudflare Workers, Stripe como motor |
| Community Alchemy Guide (11 pasos) | Proceso cerrado o propietario |
| Contribution tracking portable entre comunidades | Reputación atada a una sola plataforma |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión RegenTribe | Vaso comunicante |
|----------------|---------------------|------------------|
| `regen-knowledge-graph.ts` | Knowledge graph semántico | RAO de conceptos, `currentSeeSystem.ts` corrientes unificadas |
| `genesis-agent.ts` | Community Alchemy Guide (11 pasos) | `registrySystem.ts` specs de desarrollo generadas |
| `mythogen-ame.ts` | Fields of Trust, Tri-Layered System | `propertyRegimeSystem.ts` roles y confianza |
| `regen-vision.ts` | Visualización 3D de conocimiento | `currentSeeSystem.ts` para renderizado |
| `myconet-*.ts` | 11 módulos del stack Myconet | `caas.ts`, `tq-tdf.ts`, `boundaries.ts` |
| `rnmd-*.ts` existentes | 5 pilares, arquetipos, hardware/humanware/economy/software | Mapeo directo a capas Zeitnus |
| `registrySystem.ts` | Usuarios, barrios, nodos de red | 4 registros separados |
| `boundaries.ts` | No especulación, no Stripe como motor, no Telegram autónomo | DENY rules |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D44

| ID | Decisión | Evidencia primaria | Módulo afectado |
|----|----------|-------------------|-----------------|
| D1-D30 | (previas: stack gobernanza TDF/OASA/Closer + manifiesto OASA + RNMD RegenTribe) | `docs/oasa-tdf-governance-stack_integration.md`, `docs/oasa-manifesto_integration.md`, `docs/regenerative-neighborhood-rnmd_integration.md` | Múltiples |
| D31 | Knowledge graph con LLM extraction, vector embeddings, epistemic truth values | Tech-Stack: Regen Knowledge Graph | `regen-knowledge-graph.ts` |
| D32 | Genesis AI Agent guía por Community Alchemy Guide (11 pasos) en Telegram | Tech-Stack: Genesis | `genesis-agent.ts` |
| D33 | Mythogen AME Tri-Layered System (BODY / FIELD / SEED), Fields of Trust | Tech-Stack: Mythogen AME | `mythogen-ame.ts` |
| D34 | Regen Vision 3D force-directed graph de estructuras de conocimiento | Tech-Stack: Regen Vision | `regen-vision.ts` |
| D35 | Myconet: 11 módulos (Community Network, Directory, Resources, Blueprint, Join, Agreements, Operations, Contribution Tracking, Governance, AI Personal Assistant, Hive) | Tech-Stack: Myconet | 11 módulos `myconet-*.ts` |
| D36 | 5 pilares: Ecology, Social, Economy, Hardware, Governance | Org GitHub: Five Pillars | `rnmd-*.ts` existentes |
| D37 | Community Alchemy Guide: 11 pasos de visión a ecosistema vivo | Org GitHub: Community Alchemy Guide | `genesis-agent.ts` |
| D38 | Contribution tracking portable (points, badges, reputation) entre comunidades | Tech-Stack: Myconet Contribution Tracking | `myconet-contribution-tracking.ts` |
| D39 | AI-facilitated governance: conflictos, propuestas, votación transparente | Tech-Stack: Myconet Governance | `myconet-governance.ts` |
| D40 | Hive: inter-community layer para compartir recursos, conocimiento, excedentes, personas | Tech-Stack: Myconet Hive | `myconet-hive.ts` |
| D41 | No Stripe como motor de pagos; ZNU/CaaS como moneda nativa | Tech-Stack: Myconet Agreements menciona Stripe | `boundaries.ts` DENY |
| D42 | No Telegram como motor de ejecución; solo canal de entrada opcional | Tech-Stack: Genesis en Telegram | `genesis-agent.ts` (lógica pura) |
| D43 | No Supabase/Cloudflare Workers como infra de backend | Tech-Stack: MyCoNet ADRs mencionan Supabase/Cloudflare | Lógica pura en TS |
| D44 | Epistemic truth values en knowledge graph: conceptos y relaciones trazables | Tech-Stack: Regen Knowledge Graph | `regen-knowledge-graph.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `regen-knowledge-graph.ts` | Grafo tipado con nodos y aristas; epistemic truth values; búsqueda semántica | `tests/regen-knowledge-graph.test.ts` |
| `genesis-agent.ts` | 11 pasos de Community Alchemy Guide; conversión de ideas a specs | `tests/genesis-agent.test.ts` |
| `mythogen-ame.ts` | Tri-Layered System (BODY/FIELD/SEED); detección de Fields of Trust | `tests/mythogen-ame.test.ts` |
| `regen-vision.ts` | Force-directed graph renderizable; nodos y aristas de conocimiento | `tests/regen-vision.test.ts` |
| `myconet-community-network.ts` | AI matching de miembros; discovery de visión holders | `tests/myconet-community-network.test.ts` |
| `myconet-governance.ts` | Resolución de conflictos; propuestas; votación transparente | `tests/myconet-governance.test.ts` |
| `myconet-contribution-tracking.ts` | Points, badges, reputation portable entre comunidades | `tests/myconet-contribution-tracking.test.ts` |
| `myconet-hive.ts` | Red entre barrios; intercambio de recursos y conocimiento | `tests/myconet-hive.test.ts` |
| `boundaries.ts` | DENY: Stripe como motor, Telegram autónomo, Supabase como backend | `tests/boundaries-regen-tribe.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Specs OpenSpec (nuevas)
1. `openspec/specs/alrac-tq-regen-knowledge-graph.md`
2. `openspec/specs/alrac-tq-genesis-agent.md`
3. `openspec/specs/alrac-tq-mythogen-ame.md`
4. `openspec/specs/alrac-tq-regen-vision.md`
5. `openspec/specs/alrac-tq-myconet-stack.md` (cubre los 11 módulos)

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/regen-tribe.ts`: `KnowledgeNode`, `KnowledgeEdge`, `TruthValue`, `AlchemyStep`, `TrustField`, `CommunityNode`, `ContributionRecord`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `regen-knowledge-graph.ts`: `addKnowledgeNode()`, `addKnowledgeEdge()`, `semanticSearch()`, `assignTruthValue()`
- `genesis-agent.ts`: `runAlchemyStep()`, `captureIdea()`, `generateDevelopmentSpec()`
- `mythogen-ame.ts`: `mapAffinity()`, `detectTrustField()`, `triLayeredAnalysis()`
- `regen-vision.ts`: `buildForceDirectedGraph()`, `renderKnowledgeStructure()`
- `myconet-*.ts`: 11 módulos con lógica pura cada uno
- No importar Neo4j, Telegram API, Stripe SDK, Supabase client

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeRegenTribeState()`.
- Añadir `regenTribe: RegenTribeState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ regenTribe: {...st.regenTribe, ...} }))`.
- Incluir `makeRegenTribeState()` en `resetAll()`.
- Incluir `regenTribe: st.regenTribe` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: ecosistema RegenTribe (knowledge graph, genesis agent, mythogen AME, myconet stack) + docs/specs`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/regen-tribe-org_backup.md` (organización GitHub + tech-stack)
- `docs/regenerative-neighborhood-rnmd_backup.md` + `_integration.md` (RNMD previo, mismo colectivo)
- Regen Tribe GitHub: https://github.com/regentribes
- Tech-Stack: https://www.regentribe.co/tech-stack
- Tribes Platform: https://tribesplatform.app/
- Contacto: hello@regenTribe.org, https://t.me/+fsFL1jIIGM9jOWFh
- Specs existentes: `alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-tq-economia-comunes.md`, `alrac-tq-governance-verification.md`, `alrac-tq-presence-sweat.md`, `alrac-tq-regenerative-agent.md`, `alrac-tq-mel-crm.md`, `alrac-tq-monitoring-mrv.md`, `alrac-tq-rnmd.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
