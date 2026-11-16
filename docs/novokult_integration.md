# Integración: Novokult LLM → HSCSG Marca Blanca

## Triple Perspectiva

### 1. Usuario: Qué quiere lograr en su nodo

El usuario de HSCSG Marca Blanca quiere:
- **LLM soberano local**: Ejecutar modelos de lenguaje en su propia máquina sin depender de APIs cloud (OpenAI, Anthropic, etc.)
- **Análisis materialista**: Herramientas para análisis marxista de coyuntura (contradicciones, fuerzas de clase, base/superestructura)
- **Agitprop automatizado**: Generar material de agitación y propaganda (volantes, discursos, consignas, boletines) con disciplina factual
- **Privacidad real**: Conversaciones y sources library NUNCA salen del dispositivo; web search opcional y solo via Tor
- **Offline-first por defecto**: La app bloquea toda conexión externa salvo motor local; network access OFF al arranque
- **Extensibilidad comunitaria**: Sources library propia (textos del movimiento), locale awareness para contexto local
- **Integración CaaS**: LLM compute como servicio comunitario (acceso por contribución, no suscripción)

### 2. LLM: Qué asimilar (lógica pura) y qué extirpar (infra ajena)

#### ASIMILAR - Lógica Pura (patrones isomórficos)

| Componente Novokult | Módulo HSCSG | Lógica a Extraer |
|---------------------|--------------|------------------|
| **Mode Engine** | `llm-modes.ts` | 4 modos: Analysis (marxist framework), Agitprop (agitation/propaganda distinction), Reasoning (CoT display), Free Chat |
| **Prompt Templates** | `llm-prompts.ts` | BASE + ANALYST + AGITATOR + WEB system prompts; materialist/dialectical/historical/fact-discipline constraints |
| **Sources Library (RAG)** | `llm-rag.ts` | Chunking (800/100), Unicode-aware tokenization, BM25 retrieval (top-k), [S#] citation injection |
| **Web Search + Tor** | `llm-search.ts` | Query generation (web + theory/Marxists.org), provider abstraction, Tor bridge adapters (mock/bundled/external/orbot), exit IP verification, page reading + relevant excerpt extraction |
| **Locale Context** | `llm-locale.ts` | Country/place/language settings → context block injection; region biasing (kl param); local-language query generation |
| **Conversation State** | `llm-conversation.ts` | Conversation CRUD, message history, context estimation (token counting), continuation after token limit, regeneration |
| **Settings & Config** | `llm-config.ts` | Adapter selection, model params (ctx, threads, temp, top-p, top-k, max-tokens), reasoning mode toggle, theme |
| **Data Portability** | `llm-data.ts` | Export/import JSON (conversations, messages, sources), clear all, settings excluded from export |
| **Poster Export** | `llm-poster.ts` | HTML-to-image rendering (1:1, 4:5, A4 formats) |
| **Model Management** | `llm-model.ts` | GGUF file selection, SHA-256 verification, bundled model discovery, download from Hugging Face |
| **Engine Abstraction** | `llm-engine.ts` | EngineManager: init, generate (streaming tokens + reasoning), trimHistory, estimateTokens, handlesThinking flag |

#### EXTIRPAR - Infraestructura Ajena (NO copiar)

| Componente | Razón | Alternativa HSCSG |
|------------|-------|-------------------|
| Electron main process | Runtime desktop-specific | Browser-native (WebLLM, WASM) o CaaS compute |
| Child process spawn (llama-server) | Node.js/OS-specific | `LlmEngine` interface + WASM fallback (llama.cpp WASM) o CaaS inference |
| IPC (ipcMain/preload) | Electron-specific | Direct function calls / Web Workers / CaaS RPC |
| Dexie/IndexedDB | Browser-specific storage | Zustand persist + localStorage/IndexedDB adapter (ya existe en HSCSG) |
| Capacitor/Android plugins | Mobile-specific | PWA + Service Worker; Android como target futuro |
| electron-builder packaging | Desktop packaging | Vite build + static hosting (GitHub Pages, IPFS, CaaS) |
| Bundled binaries (llama.cpp, Tor) | Native binaries | WASM modules o CaaS sidecar services |
| Tor Expert Bundle / SOCKS proxy | Network infrastructure | CaaS Tor gateway o browser-native Tor (Tor Browser) |
| Native file dialog (dialog.showOpenDialog) | Electron API | `<input type="file">` + File System Access API |
| Node.js crypto (SHA-256 verification) | Node.js | Web Crypto API (SubtleCrypto) |
| LocalStorage para settings | Browser API | Zustand persist (ya integrado) |
| DOMPurify/marked/hl-to-image | Bundled vendor libs | Instalar via npm; tree-shaking en build |
| IBM Plex/Oswald fonts (self-hosted) | Static assets | `@fontsource` npm packages o CaaS font CDN |

### 3. HSCSG + CaaS: Isomorfismo con Leyes I/II/III y CaaS

#### Ley I: No dañar base material / personas
- **Novokult**: "AI is machinery... rented from a few firms that see every prompt" → HSCSG: LLM como herramienta convivial (Illich), no servicio de renta
- **Mapeo**: `LlmEngine` corre en nodo usuario; datos (chats, sources) en `localStorage`/`IndexedDB` del usuario; cero telemetría
- **Soberanía de modelo**: Usuario elige `.gguf` propio; no vendor lock-in; `modelPath` configurable

#### Ley II: Ganarse la vida soberanizando = AUT × CDS
- **Novokult**: Self-hosted = control total; PPL = copyfarleft (commons/worker-owned only)
- **HSCSG**: `LlmModule` en nodo usuario; CaaS provee compute compartido opcional
- **Mapeo**:
  - `AUT` (Autonomía) = control de modelo, prompts, sources, privacy settings, hardware usage
  - `CDS` (Contribución Digital Soberana) = contribuir prompts, traducir locales, reportar bugs, operar nodo inference = `LLM_CREDITS`
  - `priceParity`: 1 LLM_CREDIT ≈ 1 USD via oráculo CaaS Nivel 3 ReFi
  - **Modo anfibio**: Lógica idéntica; render muestra ZNU (offline) o USD (online) para compute credits

#### Ley III: Lucidez, nunca engañar
- **Novokult**: Fact discipline ([VERIFY] markers), untrusted web labels, prompt injection mitigation, CoT display (Reasoning mode)
- **HSCSG**: `LlmEventLog` append-only; `LucidezMode` muestra raw prompts, CoT, retrieval sources, token counts, model params
- **Mapeo**: Cada generation → `LlmEvent` con `prompt`, `mode`, `retrieval`, `tokens`, `params`, `reasoning`, `finish_reason`, `timestamp`

#### CaaS: Comunidad como Servicio
- **Novokult**: Single-user desktop; no mesh
- **HSCSG**: `LlmMesh` red federada de nodos inference; model registry distribuido; prompt library compartida
- **Crédito CaaS**: Operar nodo inference (CPU/GPU) = gana `LLM_CREDITS`; consumir inference remoto = gasta
- **Fallback**: Modo offline (WebLLM/WASM) siempre funcional; modo online (CaaS) para modelos grandes / batch

## Tabla de Mapeo Isomórfico

| Novokult Concept | HSCSG Module | Ley I | Ley II | Ley III | CaaS |
|------------------|--------------|-------|--------|---------|------|
| Mode (Analysis/Agitprop/Reasoning/Free) | `LlmMode` | Soberano | AUT | Transparente | Prompt library mesh |
| System Prompt (BASE/ANALYST/AGITATOR/WEB) | `LlmPrompt` | Materialista | CDS | Lucidez | Versioned prompts |
| Sources Library (RAG/BM25) | `LlmRag` | Propio | AUT×CDS | Citable [S#] | Knowledge mesh |
| Web Search + Tor | `LlmSearch` | Privado | AUT | Untrusted labeled | Tor gateway CaaS |
| Locale Context | `LlmLocale` | Local | CDS | Contextual | Locale mesh |
| Conversation History | `LlmConversation` | Memoria | AUT | Append-only | Sync opt-in |
| Model (.gguf) | `LlmModel` | Material | AUT | Verifiable (SHA-256) | Model registry |
| Engine (llama-server) | `LlmEngine` | Compute | AUT×CDS | Observable | Compute mesh |
| Poster Export | `LlmPoster` | Output | CDS | Portable | Asset mesh |
| Data Export/Import | `LlmDataPortability` | Soberanía | AUT | Complete | Backup mesh |
| PPL License | `LlmLicense` | Copyfarleft | CDS | Enforced | License mesh |

## Qué Asimilar vs Qué Extirpar (Resumen)

### ✅ ASIMILAR (Lógica Pura → TypeScript/Zustand)
1. **Mode system**: 4 modos con system prompts diferenciados (materialist, dialectical, historical, fact-discipline)
2. **Prompt templates**: BASE + ANALYST + AGITATOR + WEB — parametrizables, versionables
3. **RAG/BM25**: Chunking configurables, Unicode tokenization (Latin/Cyrillic/Arabic + CJK/Thai bigrams), BM25 (k1=1.2, b=0.75), top-k retrieval
4. **SearchManager**: Query generation (web + theory), provider abstraction (DDG HTML/Lite, Mojeek, MIA, custom SearXNG), Tor bridge pattern (mock/bundled/external/orbot), exit IP verification (check.torproject.org), page reading + relevant excerpt extraction (BM25 re-ranking)
5. **Locale system**: 200+ countries, languages, region codes (kl), context block injection, local-language query generation
6. **Conversation management**: Create/load/delete, mode tracking, context estimation (token counting), continuation after token limit, regeneration, message merging
7. **Settings schema**: Adapter, modelPath, threads, ctx, maxTokens, temperature, topP, topK, reasoningMode, theme, torMode, search params, locale params
8. **Data portability**: ExportAll/ImportAll JSON (v1 schema), clearAll, settings excluded
9. **Poster export**: html-to-image rendering, aspect ratios (1:1, 4:5, A4)
10. **Model management**: GGUF path validation, SHA-256 verification, bundled model discovery, Hugging Face download with progress
11. **Engine abstraction**: EngineManager.init(), generate(streaming tokens + reasoning), trimHistory(), estimateTokens(), handlesThinking flag
12. **Prompt injection defense**: SPECIAL token stripping, sanitizeQuery (email/URL/phone/ID redaction), promptSafe
13. **Network log**: In-memory only (host+path, no query strings/bodies), max 500 entries
14. **Reasoning mode handling**: Two-pass generation (thinking → answer), thinking detection heuristics, `<|think|>` token injection

### ❌ EXTIRPAR (Infra Electron/Node/OS → No copiar)
1. Electron app lifecycle (app.whenReady, BrowserWindow, ipcMain)
2. Child process management (spawn llama-server, Tor, kill, port waiting)
3. Native IPC (preload bridge, contextBridge, novokultNative)
4. Electron session/webRequest CSP (block all non-local)
5. electron-builder packaging (NSIS, AppImage, deb, Capacitor)
6. Bundled binary management (resources/llama, resources/tor, binDir resolution)
6. Tor process management (bootstrap, control port, NEWNYM, cookie auth)
7. Capacitor/Android bridge (TorFetch, llama-cpp-capacitor, Orbot detection)
8. Native file dialogs (dialog.showOpenDialog)
9. Node.js fs/path/net modules
10. SHA-256 via Node crypto (→ Web Crypto API)
11. localStorage directo (→ Zustand persist)
12. Vendor libs en www/vendor/ (→ npm dependencies)

## Isomorfismo Leyes I/II/III + CaaS (Detalle)

### Ley I: No Dañar → LLM como Herramienta Convivial, No Renta
```
Novokult: "AI is machinery... most of it is rented" → HSCSG: LLM soberano por defecto
- Usuario no paga per-token/API call → Usuario contribuye (compute, prompts, sources) → Acceso total
- Datos en servidores vendor → Datos en nodo usuario (IndexedDB/Zustand)
- Vendor puede cambiar model/access sin aviso → Usuario posee .gguf; red CaaS no puede revocar modelo
- Prompt injection risk → promptSafe + sanitizeQuery + untrusted labeling obligatorio
```

### Ley II: AUT × CDS → LLM Compute Economy
```
Novokult: Self-hosted = infra cost (CPU/RAM) → HSCSG: Self-hosted = AUT; CaaS = CDS
- AUT: Modelo, prompts, sources, privacy, hardware threads, ctx size bajo control usuario
- CDS: Operar nodo inference, contribuir prompts, traducir locales, curar sources = LLM_CREDITS
- priceParity: 1 LLM_CREDIT ≈ 1 USD (oráculo CaaS Nivel 3 ReFi)
- Modo anfibio: Lógica idéntica; render muestra ZNU (offline) o USD (online) para compute
- Model registry: Distribuido; .gguf hashes como content-addressed identifiers
```

### Ley III: Lucidez → Transparencia Radical del Pensamiento
```
Novokult: Reasoning mode = CoT visible; fact discipline [VERIFY]; untrusted web labels → HSCSG: LlmEventLog + LucidezMode
- Cada generation → evento con: full prompt, mode, retrieval sources, reasoning trace, token counts, params, finish_reason
- LucidezMode en UI: muestra raw system prompt, user prompt, retrieved chunks [S#]/[W#], CoT, token budget
- Fact discipline: [VERIFY] markers propagados a UI; citation panel con source titles
- Auditoría: Cualquiera puede reproducir generation dada misma prompt + model + params + seed
```

### CaaS: Red Federada de Inference
```
Novokult: Single-user desktop → HSCSG: LlmMesh P2P
- Nodos comparten: Model registry (hashes), prompt library, locale contexts, source collections
- Consenso: Gossip para model availability; CRDT para prompt library edits; triadas para new model approval
- Incentivos: Hostear inference = ganar créditos; consumir inference = gastar
- Data gravity: Conversations/sources stay local; mesh = models + prompts + sources metadata
- Fallback: WebLLM/WASM siempre operativo (offline-first); CaaS para modelos > VRAM/RAM local
```

## Vasos Comunicantes Cross-Repo

| Módulo HSCSG | Conexión Novokult | Vaso Comunicante |
|--------------|-------------------|------------------|
| `caas-credits.ts` | LLM credits earning | `LlmInferenceNode` emite `CreditEarned` por tokens generated |
| `identity-rao.ts` | Conversation/Source → RAO | `LlmConversation` crea RAO al crear; `LlmSource` RAO al añadir |
| `governance-triads.ts` | Model approval | `LlmModelRegistry` usa triadas para aprobar nuevos modelos en mesh |
| `value-dual.ts` | Compute pricing | `LlmEngine` usa `valueDual(ZNU, USD)` para token cost display |
| `autonomy-guard.ts` | Offline LLM | `LlmModule` funciona sin red (WebLLM/WASM local) |
| `consensus-gossip.ts` | Model/prompt sync | `LlmMesh` propaga model hashes + prompt library via gossip |
| `auth-module.ts` | CaaS identity | `LlmMesh` auth via `AuthModule` para node registration |

## Decisiones EBD (D1-D8) Aplicadas a LLM

| D# | Decisión | Evidencia Primaria | Módulo Afectado |
|----|----------|-------------------|-----------------|
| D1 | LLM nativo CaaS (no wrapper API) | Novokult local-first = precedente | `llm-core.ts` |
| D2 | ACP por conversación (autonomous) | ADSOA: "autonomous controllability" | `llm-acp.ts` |
| D3 | DF replicado (conversation sync) | ADSOA: "several processes intercommunicated" | `llm-sync.ts` |
| D4 | Content Code semántico (LLM events) | IEICE 2016: "identifies message with content" | `llm-events.ts` |
| D5 | UV-PKI propia (model registry mesh) | ADSOA: "root-CA partitioned, uniqueness verified" | `llm-registry.ts` |
| D6 | Folio Structure (LLM transactions) | ADSOA: "identifies the transaction" | `llm-folio.ts` |
| D7 | Autonomous Guard (offline LLM) | ADS: "continue operating despite failure" | `llm-guard.ts` |
| D8 | Coordination Protocol (mesh inference) | ADSOA: "autonomous coordinability" | `llm-mesh.ts` |

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `llm-modes` | Mode switch < 10ms; prompt template correct per mode | `llm-modes.test.ts` |
| `llm-prompts` | Template rendering < 5ms; all 4 modes produce valid system prompts | `llm-prompts.test.ts` |
| `llm-rag` | Chunking 10KB text < 20ms; BM25 top-4 accuracy > 80% vs ground truth | `llm-rag.test.ts` |
| `llm-search` | Query gen < 500ms; Tor exit verify < 10s; page read < 5s; sanitize 100% | `llm-search.test.ts` |
| `llm-locale` | Context block injection < 10ms; 200+ countries; kl region mapping | `llm-locale.test.ts` |
| `llm-conversation` | CRUD < 10ms; context estimation < 5ms; continuation preserves CoT | `llm-conversation.test.ts` |
| `llm-config` | Settings validation; persistence round-trip; migration v1→v2 | `llm-config.test.ts` |
| `llm-data` | Export/import 100 conversations < 2s; schema v1 validation | `llm-data.test.ts` |
| `llm-poster` | Render 1:1/4:5/A4 < 3s; image quality acceptable | `llm-poster.test.ts` |
| `llm-model` | SHA-256 verify 5GB < 30s; bundled discovery < 100ms | `llm-model.test.ts` |
| `llm-engine` | Init < 5s (mock); generate streaming 10 t/s; trimHistory correct | `llm-engine.test.ts` |
| `llm-mesh` | Model registry gossip < 5s; prompt library CRDT merge | `llm-mesh.test.ts` |

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1: Core Types + State
```
src/core/state/llm.ts              # LlmState, LlmMode, LlmConversation, LlmMessage, LlmSource, LlmModel, LlmSettings, LlmEvent
src/core/state/llm.test.ts         # Type tests, makeLlmState() seed
```

### Fase 3.2: Lógica Pura (lib)
```
src/core/lib/llm-modes.ts          # 4 modos: Analysis, Agitprop, Reasoning, FreeChat + prompt templates
src/core/lib/llm-prompts.ts        # BASE, ANALYST, AGITATOR, WEB templates; param interpolation
src/core/lib/llm-rag.ts            # Chunking, Unicode tokenization, BM25 (k1=1.2, b=0.75), retrieval
src/core/lib/llm-search.ts         # SearchManager: query gen, providers, Tor bridges, page reading
src/core/lib/llm-locale.ts         # Countries, languages, kl regions, context blocks, local queries
src/core/lib/llm-conversation.ts   # CRUD, history, context estimation, continuation, regeneration
src/core/lib/llm-config.ts         # Settings schema, validation, migration, defaults
src/core/lib/llm-data.ts           # ExportAll/ImportAll JSON v1, clearAll, schema validation
src/core/lib/llm-poster.ts         # html-to-image rendering, aspect ratios
src/core/lib/llm-model.ts          # GGUF path, SHA-256 (Web Crypto), bundled discovery, HF download
src/core/lib/llm-engine.ts         # EngineManager: init, generate(stream), trimHistory, estimateTokens
src/core/lib/llm-mesh.ts           # Model registry gossip, prompt library CRDT, inference mesh
src/core/lib/llm-value.ts          # valueDual integration, priceParity, nodeMode
src/core/lib/llm-security.ts       # promptSafe, sanitizeQuery, SPECIAL stripping, untrusted labeling
```

### Fase 3.3: Store Integration
```
src/core/state/store.ts            # + llm: LlmState, actions, resetAll, partialize
```

### Fase 3.4: Pantallas + Nav
```
src/app/screens/LlmChat.tsx        # Main chat interface: modes, composer, messages, reasoning panel
src/app/screens/LlmSources.tsx     # Sources Library: add/upload/delete, BM25 test, chunk preview
src/app/screens/LlmSearch.tsx      # Web search config: providers, Tor modes, search review, net log
src/app/screens/LlmModels.tsx      # Model management: pick, download, verify, bundled, params
src/app/screens/LlmSettings.tsx    # Settings: engine, generation, search, locale, theme, network
src/app/screens/LlmPoster.tsx      # Poster export: compose, preview, render 1:1/4:5/A4
src/app/screens/LlmMesh.tsx        # Mesh status: models, prompts, nodes, credits, sync health
src/app/layout/Aside.tsx           # + LlmChat, LlmSources, LlmSearch, LlmModels, LlmSettings, LlmPoster, LlmMesh (icons: Bot, Library, Search, Cpu, Settings, Image, Network)
src/app/App.tsx                    # + routes /llm, /llm/sources, /llm/search, /llm/models, /llm/settings, /llm/poster, /llm/mesh
```

### Fase 3.5: i18n (ES/EN/PT - 200+ keys per screen)
```
src/i18n/locales/es/llm.json
src/i18n/locales/en/llm.json
src/i18n/locales/pt/llm.json
```

### Fase 3.6: PWA + WASM Engine
```
public/manifest.json               # PWA manifest (name: Novokult HSCSG, icons, offline)
public/sw.js                       # Service Worker: cache-first static, network-first API, WASM cache
vite.config.ts                     # + PWA plugin + WASM worker config (llama.cpp WASM)
src/workers/llm-worker.ts          # Web Worker para WASM inference (offload main thread)
```

### Fase 3.7: Tests KPI + Verificación
```
npm run test:llm                   # vitest run src/core/lib/llm-*.test.ts
npx tsc --noEmit                   # 0 errores
npm run build                      # build OK (genera dist/ con SW + WASM)
npm run preview                    # rutas /llm/* → HTTP 200; SW registered; WASM loads; offline works
```

## Referencias

- Novokult Repo: https://code.thedingodaily.com/michaelwenas/novokult
- Novokult Website: https://novokult.neocities.org/
- White Paper (Zenodo): https://zenodo.org/records/23926885 (DOI: 10.5281/zenodo.23926885)
- PPL License: https://spdx.org/licenses/PPL.html
- Kleiner, *Telekommunist Manifesto*: https://www.networkcultures.org/_uploads/#3notebook_telekommunist.pdf
- llama.cpp: https://github.com/ggml-org/llama.cpp
- GGUF Spec: https://github.com/ggml-org/ggml/blob/master/docs/gguf.md
- Tor Project: https://www.torproject.org/
- Dexie.js: https://dexie.org/
- BM25: Robertson & Zaragoza (2009) doi:10.1561/1500000019
- HSCSG Architecture: `skills/hscsg-repo-assimilation/references/hscsg-architecture.md`
- Principio Anfibio: `skills/hscsg-repo-assimilation/references/anfibio-assimilation.md`
- Value Dual Pattern: `skills/hscsg-repo-assimilation/references/value-dual-pattern.md`
- Clean-room assimilation pattern: `skills/hscsg-repo-assimilation/SKILL.md` (pitfalls section)