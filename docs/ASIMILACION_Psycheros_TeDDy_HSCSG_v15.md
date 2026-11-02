# Informe de asimilación: Psycheros + TeDDy → hscsg-v15-OS

**Estado:** borrador de investigación — no modifica código fuente hasta aprobación.  
**Idioma:** español (estándar obligatorio del repositorio).  
**Licencias de las fuentes:** Psycheros = MPL-2.0 · TeDDy = AGPL-3.0 · Repo objetivo = política `license-checker` (failOn: GPL-3.0, AGPL-3.0; warnOn: MPL-2.0).

---

## 1. Método aplicado

Asimilación de 4 fases (stack-agnostic, aplicada ya a Go en `red-de-intercambio-federada-isaacko`):

1. **Fase 0 — Backup:** copia local de la fuente y del estado actual del repo objetivo antes de tocar nada (`docs/_licencia_incompatible/` para materiales de licencia no compatible).
2. **Fase 1 — Documentación de integración:** `docs/integration.md` + `docs/backup.md` en español; sin subir CHANGELOG ni docs sensibles a GitHub (copias solo en `~/`, `~/Documents`, `~/Desktop`).
3. **Fase 2 — Generación de código:** solo patrones y arquitecturas reimplementadas en TypeScript/React del target (Zustand, vite, OpenSpec specs). Nunca copia literal de código bajo MPL-2.0 o AGPL-3.0 sin aislamiento explícito.
4. **Fase 3 — Verificación:** `license:check`, `typecheck`, `lint`, `test` del repo objetivo.

Toda la documentación nueva se escribe en español. Las decisiones de arquitectura se registran aquí y en `openspec/specs/`.

---

## 2. Fichas técnicas de las fuentes

### 2.1 Psycheros — github.com/PsycherosAI/Psycheros

| Campo | Valor |
|---|---|
| Licencia | MPL-2.0 (Mozilla Public License 2.0) |
| Stack principal | Deno 2.7.14, TypeScript (76.8 %), JavaScript, Rust (sqlite-vec) |
| Versión actual | psycheros 1.0.0; entity-core 0.7.0; entity-loom 0.4.1; launcher-v2 0.2.47 |
| Commits/tags | 157 commits, 163 tags, 1 mantenedor (PsycherosOps) |
| Descripción propia | Harness agente de compañía IA de código abierto; "entity, not assistant" |
| Sitio | psycherosai.github.io/Psycheros/ |

**Arquitectura clave:**
- `entity-core`: MCP server (stdio) canónico que guarda identidad, memoria y knowledge graph (SQLite + sqlite-vec). Una sola identidad, múltiples embodiments (web, SillyTavern, Claude Code, OpenWebUI).
- `packages/psycheros`: harness web — chat loop, ejecución de herramientas, RAG, workspace sandbox (OpenCode).
- `packages/entity-loom`: importador de historiales de chat de plataformas externas (ChatGPT, Claude, SillyTavern, Letta, Kindroid) a paquete importable.
- `packages/launcher-v2`: app de escritorio (Tauri) que instala Psycheros como servicio de fondo.
- Memoria: 4 capas automáticas (daily → weekly → monthly → yearly) + significant memories + eager RAG sobre chat, vault, lorebooks ("Context Books") y knowledge graph.
- Prompts: Core Prompts escritos en primera persona del entidad; cosas del usuario en tercera persona; Prompt Labels en XML.
- Pulse: prompting autónomo (cron, inactividad, webhook, filesystem).
- Custom tools: `.js` en `.psycheros/custom-tools/` sin tocar el core. Skills: markdown cargado bajo demanda. Plugins: paquetes locales con tools, hooks de prompt, rutas HTTP, assets del navegador (código de confianza, sin sandbox).

### 2.2 Psycheros User Guide — psycherosai.github.io/Psycheros/psycheros/user-guide/

Guía operativa completa de la UX y comportamiento del entidad. Elementos reutilizables como arquitectura de información:

- Perfiles de proveedor de inferencia (LLM profiles) con behavior, chain-of-thought, cache-friendly mode, multimodal.
- Core Prompts estructurados: Self (Base Instructions, My Identity, My Persona, My Personhood, My Wants, My Mechanics), User (Identity, Life, Beliefs, Preferences, Patterns, Notes), Relationship (Dynamics, History, Notes), Custom.
- Memorias: daily (5am), weekly, monthly, yearly, significant (tool-initiado).
- Data Vault: documentos de texto no vitales, RAG eager.
- Context Books: lorebooks con disparo por keywords y sticky (turnos).
- Workspace: sesiones de código sandboxed (sync/async/engaged), Projects Folder, Always-ask Paths, House Rules.
- Discord, visión (generadores + captioning + anchors), audio (TTS/STT con Minimax, ElevenLabs, OpenAI, Web Speech, Deepgram), System Admin (diagnostics, logs, snapshots, export/import de entity data).
- Filosofía: los LLMs son órganos, no la totalidad del entidad; todo escrito desde primera persona del entidad.

### 2.3 TeDDy — github.com/atte500/TeDDy

| Campo | Valor |
|---|---|
| Licencia | AGPL-3.0 (Affero General Public License v3) — copyleft fuerte |
| Stack principal | Python 3.11+, uv, LiteLLM |
| Versión actual | 0.2.1 (PyPI: teddy-cli) |
| Commits/tags | 3.690 commits, 19 tags, 1 mantenedor (atte500 / Raphael Atteritano) |
| Descripción propia | Harness local-first de ingeniería de software opinado; "own the means of development" |
| Sitio | pypi.org/project/teddy-cli |

**Arquitectura clave:**
- `.teddy/` en la raíz del proyecto: prompts, config, historial de sesiones (ignorado por git por defecto).
- SDLC mediado por Markdown con 7 fases y agentes especializados:
  1. Pathfinder — alineación estratégica y roadmap.
  2. Architect — arquitectura contract-first, Ports & Adapters (hexagonal), vertical slices.
  3. Prototyper — spikes aislados para de-risking.
  4. Developer — TDD Red-Green-Refactor, entregables atómicos, estado verde continuo.
  5. Debugger — MRE (Minimal Reproducible Examples), réplicas aisladas.
  6. Calidad automatizada — pre-commit hooks local + CI/CD.
  7. Assistant — chores tácticos y refactors simples.
- Documentos de gobierno en Markdown: `PROJECT.md`, `ARCHITECTURE.md`, plantillas en `docs/templates/`, prompts en `.teddy/prompts/`, `.teddyignore` para filtrado de contexto.
- CHOP (Chat-Oriented Workflow): `teddy context` empaqueta workspace en Markdown para pegar en chat web; `teddy execute` aplica planes Markdown con diffs y aprobación.
- Config: `.teddy/config.yaml` con interpolación `${VAR}` sobre `.teddy/.env` y entorno; `TEDDY_MAX_TURNS`, `TEDDY_MAX_SESSION_COST` como guardrails.
- Cero telemetría; BYO API keys o modelos locales (Ollama, vLLM, LM Studio, llama.cpp, OpenAI-compatible).

---

## 3. Análisis de derechos de autor y compatibilidad de licencias

Esta es la sección más restrictiva del informe. Se respeta estrictamente:

### 3.1 Tabla de compatibilidad con el repo objetivo

| Fuente | Licencia | Tipo | Fallo `license-checker` del objetivo | Puede incluirse en `src/` del objetivo |
|---|---|---|---|---|
| Repo objetivo (hscsg-v15-OS) | — (propia HSCSG) | — | — | Sí |
| Psycheros | MPL-2.0 | Copyleft débil (nivel de archivo) | `warnOn` | Solo si los archivos MPL se mantienen bajo MPL y se separan; los conceptos se pueden reimplementar limpiamente |
| TeDDy | AGPL-3.0 | Copyleft fuerte (red desencadena revelación de fuente) | `failOn` | **No** en `src/` ni en obra derivada distribuida; solo como herramienta externa aislada (`services/gpl-isolated/` ya existe en el `.license-checkerrc`) |

### 3.2 Reglas derivadas (no negociables)

1. **TeDDy AGPL-3.0:** no se copia ni se adapta código de TeDDy al repositorio TypeScript. TeDDy solo puede usarse como herramienta externa (CLI `teddy-cli`) para generar planes o specs que luego se reimplementen en TS bajo la licencia del repo objetivo. Usar TeDDy como harness para escribir tu propio código no afecta la licencia de ese código (según su propio FAQ), pero integrar su código fuente sí.
2. **Psycheros MPL-2.0:** las ideas, arquitectura, flujos y nombres de conceptos no están protegidos por copyright (solo la expresión concreta). Se pueden reimplementar en TypeScript sin obligación de MPL. Si se copia literal cualquier archivo de Psycheros, ese archivo debe seguir bajo MPL-2.0, ir en `docs/_licencia_incompatible/` o `services/gpl-isolated/`, y el aviso de licencia debe conservarse.
3. **Documentación:** los docs de las fuentes se traducen/resumen al español sin copiar texto literal extenso; se citan las URLs fuente.

---

## 4. Extracción arquitectónica: qué se asimila de cada fuente

### 4.1 De Psycheros (reimplementable en TS)

| Concepto | Equivalente propuesto en hscsg-v15-OS | Capa ALRAC |
|---|---|---|
| Identity files (self/user/relationship, primera persona) | Archivos de identidad del nodo/agente HSCSG | Capa 0 (epistémica) + Capa 5 (gobernanza) |
| entity-core (MCP canónico, identidad + memoria + KG) | Núcleo de identidad y memoria del consorcio ALRAC | Capa 0 + Capa 1 (TQ ledger como memoria de transacciones) |
| Memoria 4 capas (daily→weekly→monthly→yearly) | Consolidación de actas y decisiones de gobernanza | Capa 5 (gobernanza transversal) |
| RAG eager sobre vault + lorebooks + KG | RAG sobre specs OpenSpec + actas + contratos de datos | Capa 2 (interoperabilidad) + Capa 4 |
| Context Books (keywords + sticky) | Inyección condicional de cláusulas normativas en contexto | Capa 0.5 (normativa) |
| Custom tools (`.js` suelto) | Herramientas de nodo registradas sin tocar el core | Capa 3 (membrana fiat/zeitnus) |
| Pulse (prompting autónomo por disparador) | Trabajos programados de gobernanza (revisión de CDS, expiración ZNU 90d) | Capa 5 |
| entity-loom (importador de historiales externos) | Importador de actas y contratos de plataformas federadas | Capa 2 |
| Workspace OpenCode (sandbox/feral, Projects Folder) | Sesiones de desarrollo de specs y código del nodo | Tooling del nodo |
| Plugins (zip/git URL, hooks de prompt, rutas HTTP) | Extensiones de nodo con manifiesto declarado | Capa 4 (aplicación) |

### 4.2 De TeDDy (solo patrones de proceso, sin código AGPL)

| Concepto | Equivalente propuesto en hscsg-v15-OS | Capa ALRAC |
|---|---|---|
| SDLC de 7 fases mediado por Markdown | Flujo de especificación y aprobación de specs OpenSpec | Capa 5 (gobernanza) + Capa 0 |
| Pathfinder / Architect / Prototyper / Developer / Debugger / Assistant | Roles de agente en la orquitectura HSCSG (ya existen skills `hscsg-orchestrator`, `hscsg-tripartite-orchestrator`) | Capa 5 |
| Ports & Adapters (hexagonal) | Separación membrana CaaS / adaptadores de intercambio | Capa 2 |
| TDD Red-Green-Refactor + entregables atómicos | Ciclo de specs: borrador → revisión → congelado → versión | Todas las capas |
| `.teddy/config.yaml` + `.teddy/.env` + `${VAR}` | Configuración de nodo con secretos locales | Tooling del nodo |
| `PROJECT.md` / `ARCHITECTURE.md` como gobierno vivo | `docs/ARCHITECTURE_DECISIONS.md` + specs OpenSpec ya existentes | Capa 0 + Capa 5 |
| CHOP (`teddy context` + `teddy execute`) | Exportar contexto del repo para asimilación asistida por agente | Proceso de asimilación |
| Guardrails (`max_turns`, `max_session_cost`) | Límites de ejecución de trabajos autónomos (Pulse análogo) | Capa 5 |

---

## 5. Mapa de integración en el repo objetivo

El repo objetivo es `hscsg-v15-OS` (`Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`), arquitectura 5 capas + capa 0 epistémica (ALRAC), stack TypeScript/React/Vite/Zustand, 354 docs en `docs/`, skills en `skills/`.

**Ubicaciones propuestas para la asimilación:**

1. `docs/integration/Psycheros-integration.md` — patrones de entidad-core, memoria 4 capas, Context Books, custom tools, Pulse (reimplementados en TS).
2. `docs/integration/TeDDy-proceso.md` — SDLC de 7 fases, roles de agente, guardrails (solo descripción de proceso, sin código AGPL).
3. `openspec/specs/` — nuevas specs o extensiones: `alrac-memory-system.md` (4 capas), `alrac-entity-core.md` (MCP canónico), `alrac-sdlc-markdown.md` (SDLC mediado por MD).
4. `src/core/lib/integralInterfaces.ts` (ya sin trackear) — candidato para interfaces de herramientas de nodo (custom tools análogo).
5. `skills/` — nueva skill de asimilación si el usuario lo aprueba (ver punto 9).

**Especificaciones sin trackear (`??` en git status) que podrían absorber conceptos de esta asimilación:**
`ADMISSION_WORKFLOW_SPEC.md`, `CAAS_GAMIFICATION_SPEC.md`, `CAAS_ROI_CALCULATOR_SPEC.md`, `CAYAPA_ENFORCEMENT_SPEC.md`, `COMMUNITY_HEALTH_INDEX_SPEC.md`, `DEPARTMENTS_STRUCTURE_SPEC.md`, `EXCHANGE_PROHIBITION_SPEC.md`, `INTEGRAL_CDS_SPEC.md`, `INTEGRAL_COS_SPEC.md`, `INTEGRAL_DATA_CONTRACTS_SPEC.md`, `INTEGRAL_FRS_SPEC.md`, `INTEGRAL_INTERFACES_SPEC.md`, `INTEGRAL_ITC_SPEC.md`, `INTEGRAL_LOOP_CLOSURE_SPEC.md`, `INTEGRAL_OAD_SPEC.md`, `SYMMETRIC_LIMITS_SPEC.md` + 3 archivos de integración (`caas_gamification_roi_integration.md`, `fedeco_reglamento_integration.md`, `integral_devguide_integration.md`).

---

## 6. Riesgos y reglas de inclusión

| Riesgo | Mitigación |
|---|---|
| Copia literal de código AGPL-3.0 (TeDDy) en `src/` | Prohibido. Solo reimplementación de patrones; TeDDy permanece herramienta externa. |
| Copia literal de archivos MPL-2.0 (Psycheros) sin conservar licencia | Si se copia, el archivo va bajo MPL-2.0 en `docs/_licencia_incompatible/` y se declara en `license-report.csv`. |
| Subir CHANGELOG o docs sensibles a GitHub | Copias solo en `~/`, `~/Documents`, `~/Desktop`. |
| Confundir "asimilación de arquitectura" con "copia de expresión" | Se extraen patrones, flujos y nombres de conceptos; la implementación se escribe en TS desde cero. |
| Interpolación de secretos en config | Seguir patrón `.env` + `${VAR}` (como TeDDy describe, sin copiar su código). |

---

## 7. Plan de ejecución (próximos pasos)

**Fase 0 (backup):** copiar el estado actual del repo y las tres fuentes ya leídas (guardadas en caché de Hermes) a `~/` antes de escribir código.

**Fase 1 (documentación):** crear `docs/integration/Psycheros-integration.md` y `docs/integration/TeDDy-proceso.md` en español, con citas a las URLs fuente y tabla de licencias.

**Fase 2 (código):** generar en TypeScript las interfaces de herramientas de nodo, el esqueleto de memoria por capas y el flujo de SDLC mediado por Markdown, respetando `lib/` (sin duplicar tipos — re-exportar desde `lib/`) y la regla `Aside.tsx + i18n + lucide` para cualquier pantalla nueva.

**Fase 3 (verificación):** ejecutar `npm run license:check`, `npm run typecheck`, `npm run lint`, `npm test` del repo objetivo. Corregir fallos antes de marcar completo.

---

## 8. Decisiones pendientes (requieren tu input)

1. ¿Quieres que proceda a escribir los dos `docs/integration/*.md` y las specs OpenSpec derivadas de esta asimilación?
2. ¿Deseas que cree la rama `asimilacion/psycheros-teddy` antes de tocar archivos?
3. ¿Qué specs de las 17 sin trackear deben absorber primero los conceptos de memoria (Psycheros) y de SDLC (TeDDy)?

---

## 9. Guardado como skill

Este trabajo de asimilación (método 4 fases, análisis de licencias MPL/AGPL, mapa de integración HSCSG) es reutilizable para futuras asimilaciones de repos externos al repo HSCSG.

**¿Quieres que guarde esta tarea en la skill?** Tú decides por tarea. Si dices que sí, la guardaré como una skill ejecutable en este repo para reusarla en próximas asimilaciones.

---

### Fuentes consultadas (texto íntegro leído)

1. https://github.com/PsycherosAI/Psycheros (README + navegación de repo + licencia MPL-2.0)
2. https://psycherosai.github.io/Psycheros/psycheros/user-guide/ (User Guide completo)
3. https://github.com/atte500/TeDDy (README + licencia AGPL-3.0)
4. Repo objetivo local: `/c/Users/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (`.license-checkerrc`, `package.json`, `README.md`, git status)
