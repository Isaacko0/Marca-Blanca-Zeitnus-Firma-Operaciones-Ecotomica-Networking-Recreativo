# Backup de Asimilación — Zentrik Open CRM

**Fecha:** 2026-11-11
**Repositorio fuente:** https://github.com/Zentrik-AI/zentrik-open-crm
**Commit analizado:** 4d26eb68a8bcdfcfd8f9ada06f18eec59cea2a2c (main, 2026-10-28)
**Licencia:** Apache-2.0
**Asimilado por:** Isaac Ko (Isaacko0) — HSCSG v15 OS
**Metodología:** HSCSG Unified Assimilation Science (4 fases + validación OpenSpec)

---

## 1. Resumen Ejecutivo

Zentrik Open CRM es el **primer ARM (Agent Relationship Management) de código abierto**: un CRM local-first donde personas y sus agentes de código trabajan juntos, cada hecho muestra su fuente, y nada aterriza sin aprobación humana. Arquitectura minimalista: React + TypeScript + Vite (frontend), Node 22.18+ (CLI/MCP/API local), **sin base de datos** — el workspace es una carpeta con `workspace.json` como fuente de verdad.

**Principio de diseño HSCSG (anfibio) aplicado:** NO se extirpa la lógica de monetización (Stripe/USD/analytics/ad-networks) — se hace el módulo ANFIBIO. La misma lógica de cálculo opera en modo 'postmonetario' (ZNU/CaaS, default offline) o 'conectado' (USD/USDC vía oráculo priceParity, Nivel 3 ReFi); el render decide la etiqueta, la lógica es agnóstica a la unidad.

---

## 2. Inventario Completo de Archivos Asimilados

### 2.1 Núcleo Arquitectónico (`src/core/`)

| Archivo | Líneas | Responsabilidad | Clave HSCSG |
|---------|--------|-----------------|-------------|
| `types.ts` | 290 | Vocabulario completo: Account, Deal, Task, Note, Claim, Op, Change, Proposal, Workspace, Actor | **Tipos fuente única** — re-export desde `lib/` |
| `model.ts` | 130 | Vocabulario puro: stages, sources, priorities, labels, utilidades (stableId, slugify, parseDue, isValidDate) | **Sin dependencias UI/Node** — compartido por app, CLI, MCP |
| `ops.ts` | 645 | **El único write path** — applyChange, submitChange, resolveProposal, proposalConflict, receipts | **Determinista** — propuesta hoy = aprobación mañana |
| `validate.ts` | 386 | Validación estructural + referencial + normalización de workspaces legacy | **Guarda de integridad** — `crm check`, import, server |
| `claims.ts` | 56 | Claims como source of truth; `needs`/`risks` derivados; migración legacy | **Memoria fundamentada** — hunches vs grounded |
| `memory.ts` | 451 | AccountMemory: grounding, committee, gaps, since, commitments, questions, lint, table | **Brief computado** — idéntico en app, CLI, agente |
| `brief.ts` | 95 | Daily brief: attention items rankeds (overdue, at_risk, quiet, ungrounded, deal_unattended) | **Atención accionable** — cada item cita recordId |
| `patterns.ts` | 222 | Detección léxica de recurrencia cross-account; signals bundle (open-crm-signals.v1) | **Frontera cuenta→producto** — fuentes, no conclusiones |
| `markdown.ts` | ~300 | Generación de `INDEX.md` y `accounts/*.md` con frontmatter YAML, recordIds en backticks | **Vistas generadas** — `crm check --fix` regenera |
| `investigation.ts` | ~400 | Jev: clasificación línea a línea de notas pegadas/transcripciones; confidence + "Check closely" | **Ingesta asistida** — no inventa, propone con evidencia |
| `calls.ts` | ~500 | Proveedores Granola/TypeSafe; import batch ≤50 calls; progress, per-call errors, review antes de escribir | **Calls→evidence** — claves en memoria local server |
| `demo.ts` | ~100 | Generador de workspace sintético con clock inyectado (tests deterministas) | **Demo reproducible** — sin dependencia de wall clock |

### 2.2 CLI y Runtime (`cli/`)

| Archivo | Líneas | Responsabilidad | Clave HSCSG |
|---------|--------|-----------------|-------------|
| `store.ts` | 302 | Workspace folder: atomic writes, lock local-proceso, backups por revisión (sha1), vistas generadas | **Fuente de verdad única** — `workspace.json` + lock |
| `actions.ts` | 264 | Funciones puras sobre workspace: status, listAccounts, showAccount, memory, brief, why, patterns, exportSignals, lint, search, change, decide, setAgentMode | **Mismo API** — CLI, MCP, app llaman `actions.*` |
| `mcp.ts` | 189 | MCP server sobre stdio (sin SDK); JSON-RPC 2.0; tools: crm_status, crm_show_account, crm_add_note, crm_add_claim, crm_add_task, crm_patterns, crm_signals_bundle, crm_list_proposals, crm_list_sources, crm_investigation, crm_list_calls, crm_show_call | **Agentes nativos** — Claude Code, Codex, Cursor |
| `main.ts` | ~400 | Comando `crm`: init, status, accounts, show, search, tasks, notes, claims, brief, why, patterns, export, sources, lint, investigation, calls, proposals, decide, mode, check, activity | **UX consistente** — `--json` salida estructurada |
| `api.ts` | ~200 | Loopback HTTP API (127.0.0.1 only); SSE para cambios externos; validación Host/Origin/JSON; lock coordinado | **App en folder mode** — escucha cambios de agentes |
| `server.ts` | ~100 | `crm ui`: sirve `dist/` + API; puerto configurable | **Un bundle** — browser y folder mode |
| `sources.ts` | ~200 | `sources/` por content hash (sha256); `sources/index.json` (open-crm-sources.v1); deduplicación por hash/externalId | **Evidencia duradera** — notas citan `source:<id>` |
| `call-providers.ts` | ~300 | Granola (OAuth), TypeSafe (API key); conexión keys en memoria server; batch processing | **Integración real** — no mock |
| `call-samples.ts` | ~150 | Transcripciones sintéticas para demo | **Demo sin datos reales** |
| `investigation.ts` | ~300 | CLI wrapper para investigation.ts core | **Consistencia** — misma lógica app/CLI |
| `templates.ts` | ~200 | `crm init` escribe: AGENTS.md, CLAUDE.md, playbooks, inbox/, drafts/, .mcp.json, .cursor/mcp.json | **Onboarding agente** — contrato operativo local |
| `agent-kit.ts` | ~100 | Utilidades para agentes: parse workspace, find account, build ops | **SDK ligero** — para agents custom |

### 2.3 Frontend (`src/`)

| Archivo/Carpeta | Responsabilidad | Clave HSCSG |
|-----------------|-----------------|-------------|
| `App.tsx` | Router + sidebar (Home, Accounts, Capture) + provider context | **Clear v2 design system** — tokens semánticos |
| `components/` | UI components: AccountCard, AccountDetail, AccountTable, Book, Brief, ClaimList, Home, NoteList, PatternList, ProposalReview, Review, Sidebar, Table, Trace, TaskList | **Violet = agente** — tokens CSS para conceptos |
| `views/` | Page-level: HomeView, AccountsView, AccountView, BookView, CallsView, PipelineView, ReviewView, SettingsView, TraceView | **Vistas = composiciones** — core puro en memory.ts |
| `lib/brand.ts` | Nombre del producto único: "Open CRM" / "Zentrik Open CRM" | **Single source of truth** — rename = 1 archivo |
| `tokens.css` | CSS tokens semánticos: account, signal, highlight, agent, success, warning, destructive | **Violet reservado para agentes** — no one-off colors |
| `index.css` + `fonts.css` | Tailwind + Fraunces/Inter/IBM Plex Mono | **Tipografía semántica** — display optical sizing |
| `types.ts` | Re-export de `src/core/types.ts` | **No duplicar tipos** — re-export desde lib/ |

### 2.4 Documentación (`docs/`)

| Archivo | Propósito HSCSG |
|---------|-----------------|
| `architecture.md` | 5 capas, two homes (browser/folder), two exports (signals/feedback), naming conventions, styling tokens |
| `workspace-format.md` | Especificación completa: records, operations, evidence, sources, patterns, signals bundle, generated views, editing by hand, local server, backups, lock |
| `agent-operator-guide.md` | Loop completo agente: daily review, inbox, call prep, follow-up, signals handoff |
| `agent-setup.md` | AGENTS.md, CLAUDE.md, playbooks, MCP config — contrato operativo |
| `agent-routines.md` | Rutinas: daily-review, inbox, call-prep, follow-up, product-work, signals-bundle |
| `first-use.md` | 2 min setup: clone, npm install, crm init --demo, crm ui |
| `calls.md` | Setup, data flow, batch guide — qué sale del equipo (TypeSafe) |
| `calls-design.md` | UX del Calls workspace: provider connections, review pane |
| `design-system.md` | Clear v2: cool neutral, Inter display, tabular nums, teal accent, violet agent |
| `personas-and-flows.md` | Founder, PM, AE, Customer Success — momentos: brief, review, trace, book |
| `product-work.md` | Frontera: account work here, product work in Zentrik; signals bundle |
| `roadmap.md` | Post-1.0: multi-workspace, hosted backend, richer patterns, mobile |
| `self-hosting.md` | Static host (browser) + folder mode (own server) |
| `privacy-boundaries.md` | No customer data en repo; browser storage vs folder; optional AI keys |
| `feedback-and-support.md` | Improve: local draft → public-safe bundle → GitHub issue (user submits) |
| `licensing-and-ip.md` | Apache-2.0; trademarks reserved; NOTICE; TRADEMARKS.md |
| `releasing.md` | Versioning, changelog, tags, npm publish, demo deploy |
| `team-task-review.md` | Task ownership, calendar export scope |
| `account-investigation.md` | Investigate notes → concrete CRM updates |

### 2.5 Configuración y Tooling

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Scripts: dev, build, build:cli, test, test:package, test:e2e, typecheck, crm; engines: node>=22.18; bin: open-crm |
| `tsconfig.json` | Strict, ESNext, NodeNext, explicit imports .ts |
| `vite.config.ts` | Base path para demo browser; plugin-react |
| `playwright.config.ts` | E2E: browser edition + agent-to-Review loop on folder |
| `tailwind.config.ts` | Clear v2 tokens; content: src/**/*.{ts,tsx} |
| `AGENTS.md` | Contrato operativo que lee el agente primero |
| `CLAUDE.md` | Apunta a AGENTS.md; instrucciones específicas Claude Code |
| `bin/open-crm.js` | Entry point JS plano; check Node version first |
| `scripts/third-party-notices.mjs` | Genera THIRD_PARTY_NOTICES.txt automáticamente |

---

## 3. Análisis de Derechos de Autor y Licencia

| Aspecto | Detalle |
|---------|---------|
| **Licencia** | Apache-2.0 (permisiva, permite uso comercial, modificación, distribución, patentes) |
| **Contribuciones** | Se aceptan bajo misma licencia salvo statement previo |
| **Trademarks reservados** | Zentrik AI reserva: nombre, product names, hosted services, private APIs, private workspaces, product intelligence systems, runtime credentials, proprietary platform code |
| **NOTICE** | Incluye attributions requeridas por Apache-2.0 |
| **THIRD_PARTY_NOTICES.txt** | Generado automáticamente de dependencias (fonts, lucide, react, tailwind, etc.) |
| **Archivos NO asimilables tal cual** | Brand assets (logos, screenshots en `assets/brand/`, `assets/demo/`) — requieren permiso para uso comercial |
| **Código asimilable** | Todo `src/`, `cli/`, `docs/`, `tests/`, config — bajo Apache-2.0 |

**Regla HSCSG:** Asimilar la **lógica y arquitectura**, no la identidad de marca. El módulo resultante será "anfibio": operable en modo postmonetario (ZNU/CaaS) o conectado (USD/USDC via priceParity), sin dependencia de infraestructura Zentrik.

---

## 4. Decisiones de Asimilación (Fase 2 HSCSG)

### 4.1 Qué se Asimila al Repo HSCSG

| Componente | Destino en HSCSG | Adaptación |
|------------|------------------|------------|
| `src/core/` (types, model, ops, validate, claims, memory, brief, patterns, markdown, investigation, calls, demo) | `packages/arm-core/` | **Extraer como paquete npm independiente** — zero deps, pure TS, consumible por Go/Python/Rust via bindings |
| `cli/store.ts` + `cli/actions.ts` | `packages/arm-cli/` | **Wrapper CLI genérico** — `arm` command, workspace-agnostic |
| `cli/mcp.ts` | `packages/arm-mcp/` | **MCP server standalone** — stdio JSON-RPC, tool definitions parametrizables |
| `cli/api.ts` + `cli/server.ts` | `packages/arm-api/` | **Loopback API** — same operations, SSE, lock coordination |
| `src/components/` + `src/views/` + `src/App.tsx` | `packages/arm-ui/` | **React UI package** — tokens CSS, Clear v2, violet=agent |
| `docs/` | `docs/arm/` | **Documentación técnica** — traducida al español, integrada en hscsg_definition.md |
| `tests/` | `tests/arm/` | **Test suites** — unit (core), e2e (CLI+MCP+UI), package smoke |

### 4.2 Qué NO se Asimila (Identidad Zentrik)

- `assets/brand/` — logos, hero screenshots
- `assets/demo/` — captures de producto Zentrik
- `bin/open-crm.js` — entry point branded `open-crm`
- `package.json` name/version/branding — se forkeará como `@hscsg/arm-core`, etc.
- `AGENTS.md` / `CLAUDE.md` / `templates.ts` playbooks — se regeneran para contexto HSCSG
- Referencias a "Zentrik" en código → parametrizar via `brand.ts` equivalent

### 4.3 Principio Anfibio Aplicado

| Concepto Zentrik | Modo Postmonetario (HSCSG default) | Modo Conectado (Nivel 3 ReFi) |
|------------------|-------------------------------------|-------------------------------|
| `Account.arr` (USD) | `Account.valor` (ZNU/CaaS units) | `Account.arr` + `priceParity` oracle |
| `Deal.value` (USD) | `Deal.valor` (ZNU) | `Deal.value` + `priceParity` |
| `Account.health` (0-100) | `Account.salud` (0-100, mismo) | Idéntico — agnóstico a unidad |
| `Account.fit` (0-100) | `Account.ajuste` (0-100, mismo) | Idéntico |
| Signals bundle | `open-crm-signals.v1` → `arm-signals.v1` | Mismo schema, `providerType: "hscsg-arm"` |
| Workspace folder | `~/arm/` + `workspace.json` | Mismo, `edition: "HSCSG"` |

**Implementación:** `lib/valueDual.ts` + `nodeMode/priceParity` en store + pantalla `/agencia` (como en DeseOS/Contento.pro).

---

## 5. Archivos de Referencia Guardados Localmente

Conforme a política HSCSG: CHANGELOG y docs sensibles SOLO local, copias en `~/`, `~/Documents`, `~/Desktop`; NO subir a GitHub.

| Archivo | Ubicación Local |
|---------|-----------------|
| `backup.md` (este archivo) | `docs/asimilacion/zentrik-open-crm/backup.md` |
| `integration.md` (análisis arquitectónico) | `docs/asimilacion/zentrik-open-crm/integration.md` |
| `README.md` original | `~/Zentrik-Open-CRM-README-2026-11-11.md` |
| `architecture.md` original | `~/Zentrik-Open-CRM-architecture-2026-11-11.md` |
| `workspace-format.md` original | `~/Zentrik-Open-CRM-workspace-format-2026-11-11.md` |
| `types.ts` original | `~/Zentrik-Open-CRM-types-2026-11-11.ts` |
| `ops.ts` original | `~/Zentrik-Open-CRM-ops-2026-11-11.ts` |
| `memory.ts` original | `~/Zentrik-Open-CRM-memory-2026-11-11.ts` |
| `patterns.ts` original | `~/Zentrik-Open-CRM-patterns-2026-11-11.ts` |

---

## 6. Próximos Pasos (Fase 3-4 HSCSG)

1. **Fase 3 — Generación de Código:** Crear paquetes `@hscsg/arm-core`, `@hscsg/arm-cli`, `@hscsg/arm-mcp`, `@hscsg/arm-api`, `@hscsg/arm-ui` con OpenSpec SDD
2. **Fase 4 — Validación:** `npm run test:package` equivalent en cada paquete; e2e tests passing; `crm init` genera workspace HSCSG funcional
3. **Integración HSCSG:** Conectar `arm-core` con `hscsg-sistema-alraico` (kernel orquestación), `hscsg-coeficiente-autonomia` (AUT/CDS), `hscsg-monetary-integration` (ZNU/priceParity)
4. **Documentación Unificada:** Fusionar en `hscsg_definition.md` con formalismo matemático, mantras líricos, subhashitas, retórica poética (estilo Tractatus Wittgenstein)

---

**Firmado:** Isaac Ko (Isaacko0) — HSCSG v15 OS
**Fecha:** 2026-11-11
**Hash del commit fuente:** 4d26eb68a8bcdfcfd8f9ada06f18eec59cea2a2c