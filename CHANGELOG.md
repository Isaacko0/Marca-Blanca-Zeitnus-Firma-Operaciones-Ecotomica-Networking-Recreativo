# CHANGELOG — HSCSG v15 OS
## v15.25 — 2026-09-17 · Absorción HSCSG_v15_OS + 6 Módulos Multimedia/Agente

### Absorción de HSCSG_v15_OS (33 archivos únicos)
- `openspec/` — Specs OpenSpec SDD (vital-time-currency, nexo-architecture, kernel-protocol, triaxial-verification) + change add-vital-time-mode
- `src/core/lib/vitalTime*.ts` — Sistema VitalTime completo (vitalTime, vitalTimeTransduction, vitalTimeTriaxial)
- `src/core/lib/bt213KernelLimits.ts`, `humanArtificer.ts`, `kernelProtocol.ts`, `mk1Ontology.ts`, `viaProtocols.ts`, `hogueraAFPEnlace.ts` — Kernel v214 + VIAs
- `src/governance/vitalTimeInvariants.ts` — 100+ invariantes blindados
- `scripts/legal-safe-check.sh` — Workflow legal-safe
- `docs/ATTRIBUTIONS.md`, `BIO_THESIS_NEXO_ARCHITECTURE.md`, `INVESTIGACION_OBLINGER_CLG_HSCSG.md`, `LEGAL_SAFE_GUIDE.md`, `NEXO_ARCHITECTURE_SPEC.md`, `VITAL_TIME_CURRENCY_SPEC.md` — Documentación núcleo
- `.github/workflows/openspec-validate.yml` — CI para specs
- `.hermes/skills/hscsg-fractal-commit-fusion/SKILL.md` — Skill de fusión fractal
- `skills/hscsg/` — 6 skills HSCSG (asimilacion-ecosistemica, autotrofia-disenador, comunicacion-veraz, dual-context-engine, ingenieria-inversa-patrones-vivos, viabilidad-territorial)

### 6 Módulos Multimedia/Agente (asimilados)

#### 1. Story Engine · MuMuAINovel (novel creation assistant)
- `src/core/state/story.ts` + `src/core/lib/story.ts` — Proyectos narrativos, outlines 5 actos, capítulos
- `src/app/screens/Story.tsx` — UI narrativa
- Anfibio: sin ChromaDB, sin Docker, sin APIs externas → estado puro Zustand
- Isomorfismo: Proyecto Story ≈ Proyecto Tekitl (mismo ciclo de vida)
- Docs: `docs/mumuainovel_backup.md` + `docs/mumuainovel_integration.md`

#### 2. Visual Generator · RedInk (content generation)
- `src/core/state/visual.ts` + `src/core/lib/visual.ts` — Piezas visuales, páginas, copy
- `src/app/screens/Visual.tsx` — UI generación visual
- Anfibio: sin Flask, sin Vue, sin Docker → React + Zustand
- Isomorfismo: Piece visual = Proyecto Tekitl (entregable con timeline)
- Docs: `docs/redink_backup.md` + `docs/redink_integration.md`

#### 3. Avatar Live · PersonaLive (portrait animation)
- `src/core/state/avatar.ts` + `src/core/lib/avatar.ts` — Expresiones, streaming, consentimiento Ley III
- `src/app/screens/Avatar.tsx` — UI avatar animado
- Anfibio: sin CUDA, sin PyTorch, sin TensorRT → solo estado lógico
- Isomorfismo: Avatar estado = SoulState (deriva/anclada)
- Docs: `docs/personalive_backup.md` + `docs/personalive_integration.md`

#### 4. Agent Canvas · OpenHands (multi-agent control center)
- `src/core/state/agentCanvas.ts` + `src/core/lib/agentCanvas.ts` — Agentes, automations, audit trail
- `src/app/screens/AgentCanvas.tsx` — UI centro de control
- Anfibio: sin Electron, sin Docker, sin ACP → React puro
- Isomorfismo: Agent Canvas = extensión de Agentes.tsx + Automata.tsx
- Docs: `docs/openhands_backup.md` + `docs/openhands_integration.md`

#### 5. Video Studio · Remotion (programmatic video)
- `src/core/state/video.ts` + `src/core/lib/video.ts` — Composiciones, clips, playback
- `src/app/screens/Video.tsx` — UI timeline de video
- Anfibio: sin Lambda, sin Mediabunny, sin Three.js → estado lógico
- Isomorfismo: Composition = Proyecto Tekitl (entregable con timeline)
- Docs: `docs/remotion_backup.md` + `docs/remotion_integration.md`

#### 6. Highlight Engine · AutoClip (AI video clipping)
- `src/core/state/highlight.ts` + `src/core/lib/highlight.ts` — Proyectos de video, highlights, export
- `src/app/screens/Highlight.tsx` — UI extracción de highlights
- Anfibio: sin APIs externas, sin GPU → estado puro
- Isomorfismo: Highlight project = Proyecto Tekitl
- Docs: `docs/autoclip_backup.md` (ya existía como autoclip_mvp en contexto)

### Integración
- `src/core/state/store.ts` — +6 state slices, +24 acciones, +6 lib imports
- `src/app/App.tsx` — +6 rutas (/story, /visual, /avatar, /canvas, /video, /highlight)
- `src/app/layout/Aside.tsx` — +6 nav items (BookOpen, Palette, User, Bot, Film, Scissors)
- `src/core/lib/i18n.ts` — +6 nav keys (ES/EN/PT)


Todas las entradas siguen el formato: versión, fecha, repos asimilados en ese paso, y estado de verificación.

---

## v15.24 — 2026-08-21 · Dump completo PerCon Flow / New Paradigm (F61–F114)

**Repos/documentos asimilados:** `docs/research_output/11_Brief_Cientifico_PerConFlow_Dump.md`, `docs/percon_flow_potentialism_integration_2.md`, `docs/percon_flow_patch_prosocial.md`, `docs/fuentes_indice.json` (F61–F114, total 114).

**Estado verificación:** Índice JSON válido (114 entradas, cierre íntegro). 54 fuentes nuevas del dump íntegro del hilo de Marcus Packard (grupos, plataformas new-paradigm, compassion-complex, anti-work, regenerative-finance, commons). Sin unión a grupos ajenos (solo metadatos de procedencia). Documents/scripts sin credenciales.

---

**Fuentes (9):** hilo ThomasPoetter [LABS] (WhatsApp/Telegram/Discord/FB/LinkedIn) + Google Doc *Clustering Platforms towards The New Paradigm* (40+ plataforms: CZ ECOSYSTEM, GAME-B, NEW ECONOMY COALITION, WELLBEING ECONOMY, THE GREAT TRANSITION INITIATIVE, GLOBAL TAPESTRY OF ALTERNATIVES, FAIRCOOP, COMMONS STACK, FUNDING THE COMMONS, Catalist, OpenCivics, The Next System Project, etc.) + sitios Catalist / Next System / OpenCivics+CommonsStack+FundingTheCommons+SchellingPoint / Global People Power / Commoners Catalog+Commonsverse+Commoning Spaces (Bollier) / Solaris France / General Strike Revolution+Revolutionary Peoples Manifesto / Our Free Society (filtrado). + The State of Communities Report 2026 (MUTUO) vía `hscsg-pdf-to-framework`.

**Mapeo HSCSG:**
- PerCon Flow / Potentialism = **nodo Puente** candidato en Hylo fork (social layer): la red de 40+ plataforms como índice de aliados.
- "Clúster convergente" valida **arquitectura anfibia** (cada modelo: postmonetario local ZNU + conexión USD opcional vía oráculo priceParity).
- Solaris / Commoning Spaces validan **modo offline/mesh** del Tejido (funciona sin internet).
- Our Free Society → mapeado a **Ley II MJ** ("conocimiento verificable") como contraejemplo de lo NO asimilable.

**Principio anfibio:** se asimila la *lógica de commoning* (CLT, timebanking, gift economies, plataformas cooperativas, monedas alternativas) y la *coordinación ReFi/web3* (conviction voting, bonding curves, public goods); se extirpa infra ajena (stablecoins externas, discords con paywalls de traducción, narrativa conspirativa sin evidencia).

**Docs:** `docs/research_output/10_Brief_Cientifico_PerConFlow_Potentialism.md` · `docs/percon_flow_potentialism_integration.md` · (previo) `09_Brief_Cientifico_StateOfCommunities2026.md` + `State_of_Communities_2026_integration.md` (vía `hscsg-pdf-to-framework` `pdf2fw:state-of-communities-2026`).
**BRIEF:** fuentes 50→60 + §18.5 + vasos `[EBD-D1][LeyI|II|III][mj:CivilizacionesState]`.
**Índice:** `docs/fuentes_indice.json` F51–F60 (total 60).
**Verificación:** JSON válido (node) · sin build de frontend (solo docs + índice, no toca `src/`).

---

## v15.22 — 2026-08-19 · Asimilación community_ai-alliance + usdglo-celo (Glo Foundation)

**Repos asimilados:**
- `b3alliance/community_ai-alliance` (33 archivos, fork AI Alliance) → OS de comunidad federada abierta (grupos región/tema, CoC, gobernanza por PR). Isomorfo a `células`/`civilizaciones` + Hylo. Solo doc (markdown, sin módulo).
- `Glo-Foundation/usdglo-celo` (71 archivos) → USDGLO stablecoin con propósito (ReFi/UBI), contratos v1–v4. Roles MINTER/PAUSER/DENYLISTER + cap emisión + denylist.

**Módulos creados (usdglo):**
- `src/core/state/usdglo.ts` — tipos `UsdgloState` (oráculo priceParity, modo soberano/conectado, cap, denylist).
- `src/core/lib/usdglo.ts` — lógica pura (`canMint`, `mintHeadroom`, `isSovereign`, `denylistedActors`).
- `store.ts` — `usdglo` en AppState + 3 acciones (`setUsdgloMode`, `mintUsdglo`, `denylistUsdglo`).

**Principio anfibio:**
- ai-alliance: extirpado GitHub como sede única → almacenamiento HSCSG local + Nostr federation; conservado estructura de grupos/CoC.
- usdglo: extirpado red mainnet/Polygon/Celo + Defender/Hardhat; conservado patrón stablecoin con propósito como oráculo priceParity Nivel 3 ReFi (ZNU↔USD anfibio, `hscsg-monetary-integration`).

**Docs:** `docs/ai_alliance_backup.md` + `ai_alliance_integration.md` · `docs/usdglo_backup.md` + `usdglo_integration.md`.
**BRIEF:** fuentes 44→46 + 2 entradas en tabla de asimilaciones.
**Verificación:** build OK · 53/53 tests.

---

## v15.21 — 2026-08-18 · Asimilación ContentCreation-OS (CynthiaSalazarB)

**Repos asimilados:** `CynthiaSalazarB/ContentCreation-OS` (Python, 66 archivos) → co-pilot de contenido anfibio.
**Módulos creados:**
- `src/core/state/content.ts` — tipos `Idea`/`NewsItem`/`ContentState` (captura multi-puerta, brand-fit advisory, gate humano).
- `src/core/lib/content.ts` — lógica pura (`pendingIdeas`, `approvedIdeas`, `needsAngles` γ-CARMIS, `avgBrandFit`, `newsCount` rolling 30d).
- `src/app/screens/Contenido.tsx` + ruta `/contenido` + nav (PenLine) — Idea Bank con score + gate humano.
- `store.ts` — `content` en AppState + 4 acciones.
**Principio anfibio:** extirpado Notion, Telegram+GCP VM, Gemini, GitHub Action; conservado capture→score→ángulos→gate humano (Ley III MJ).
**Isomorfismo:** brandDNA (Agencia.tsx), MJ Gate, loopEngine idempotente, registry de módulos.
**Docs:** `docs/contentcreation_backup.md` + `docs/contentcreation_integration.md` (vasos `[EBD-D1][DV-01][repo:contentcreation][aut:LeyIII][alraico:loopEngine]`).
**Verificación:** build OK · 53/53 tests · preview `/contenido`=200.

---

## v15.20 — 2026-08-18 · Asimilación NVIDIA OO-Agents (NOOA)

**Repos asimilados:** `NVIDIA-NeMo/labs-OO-Agents` (NOOA, Apache 2.0, 1302 archivos) → capa agente-orobjeto.
**Módulos creados:**
- `src/core/state/nooa.ts` — tipos `NooaAgent`/`NooaState` (estado tipado, visibilidad, estrategia, self-extending).
- `src/core/lib/nooa.ts` — lógica pura (`visibleMethods`, `detectBlindAgents`, `reconfigBlindAgents` γ-CARMIS, `meshAutonomy`).
- `src/app/screens/OoAgents.tsx` + ruta `/oo-agents` + nav (Boxes) — pantalla viva.
- `store.ts` — `nooa` en AppState + 4 acciones.
**Principio anfibio:** extirpado `unifiedllm`/`nemo_relay` (NVIDIA), `nooa-cli`, `nooa-bench`; conservado modelo agente-orobjeto isomorfo a `agentMesh` + Leyes MJ.
**Docs:** `docs/nooa_backup.md` + `docs/nooa_integration.md` (vasos comunicantes `[EBD-D1][DV-01][repo:nooa][alraico:loopEngine][aut:LeyII]`).
**Verificación:** build OK · 53/53 tests · preview `/oo-agents`=200. Vercel CLI no autenticado (deploy manual pendiente).

---

## v15.19 — 2026-08-18 · Capa Científica: 8 Docs + 3 Skills + Fresco/RBE
- **8 Documentos Científico-Estratégicos (ADSOA-HSCSG)** en `docs/research_output/` (EBD + vasos comunicantes): Propuesta Investigación, Brief Estratégico, White Paper, EBD (D1-D8), Brief Científico, Memorándum Validación (**DV-01 a DV-04 APROBADAS**), Informe Factibilidad, Protocolo Comunicación.
- **loopEngine.ts** ✨ — orquestador nativo Sistema Alráico: 6 loops (cdsDecay, meritMint, agentCompute, regenMrv, nostrAudit, vecinalAccountability) + **γ-CARMIS** + **resonancia** (factor 3.0). 7/7 tests (`loopEngine.test.ts`).
- **Simulador.tsx** ✨ — Eje Simulación Verificación Triaxial (sliders Ω/s/κ, αʰ(t), stepper, sobrecargas/resonancias). **`/simulador` → 200 en Vercel.**
- **3 Skills** en `skills/`: `hscsg-repo-assimilation` (legacy) · `hscsg-scientific-papers` (protocolo papers) · `hscsg-unified-assimilation-science` (**maestra fusionada**: asimilación + ciencia + vasos comunicantes totales).
- **Fuentes RBE/Fresco** asimiladas (vía Ciencia, sin código nuevo): Yates 2014 *Crime, Criminality & Social Revolution* (UCLan, ideas de Jacque Fresco) + Leiva 2012 *Economía Monetaria y EBR* (U. Valparaíso). → `docs/fresco_rbe_backup.md` + `docs/fresco_rbe_integration.md`. **Fuentes primarias BRIEF: 39 → 41.**
- **BRIEF:** nueva sección 18 (Capa Científica & Vasos Comunicantes).
- **Verificado:** `npm run build` → exit 0 · `loopEngine.test.ts` → 7/7 · Vercel `/simulador` `/verificacion` `/nostr` `/agentes` → 200.

## v15.18 — 2026-08-08 · Copiaosis + i18n + fix persistencia Civilizaciones
- **Civilizaciones:** añadido **Copiaosis** (`https://copiosis.net/`) como flashcard ancha (ocupa 2 columnas, `wide: true`). Traducción ES/EN/PT en `i18n.ts`.
- **i18n nivel 2:** el selector ES/EN/PT-BR ahora traduce también el contenido interno de 7 módulos (Solarpunk, Civilizaciones, Células, Mundus, Soberanía, Integral, Life). ~170 claves nuevas en `i18n.ts`. Marcas (ZNU, CaaS, nombres de orgs) no se traducen.
- **Fix crítico Civilizaciones:** la pantalla iteraba `civilizaciones.links` (array **persistido** en localStorage), por lo que el seed nuevo (Copiaosis) no se reflejaba en navegadores con estado viejo. Ahora itera la **constante `CIVILIZATION_LINKS`** de `lib/civilizaciones.ts` (catálogo estático). Regla reforzada: los catálogos fijos NO deben leerse del store persistido.
- tsc/build OK, `/civilizaciones` → 200, Copiaosis confirmado en bundle de producción.

## v15.17 — 2026-08-05 · Civilizaciones (horizontes postmonetarios)
- **Nuevo módulo `/civilizaciones`** (icono Compass) en la barra lateral: enlaces a Auravana, One Community, The Venus Project y Resource Based Economy (economía basada en recursos). Coherentes con CaaS.
- Tipos/lib/store/pantalla/nav/ruta. `docs/civilizaciones_sinergia.md`.
- tsc/build OK, `/civilizaciones` → 200.

## v15.16 — 2026-08-05 · Mundus editable + enlaces Origen IDETRA + fix Solarpunk
- **Mundus:** manifiesto editable (textarea, persistido) con texto default no impositivo ("Si te resuena… cuidamos porque podemos, no porque debamos"). Cada pilar muestra "Módulo Cosateca" + "Origen IDETRA" (enlaces reales sci-hive.com, terraformus.org, plann.us, temet.app) leídos de constante estática para no depender de localStorage.
- **Solarpunk fix:** las ofertas/necesidades ahora se listan (antes solo subía el contador). Listas "Ofertas activas" y "Necesidades activas".
- **Fix inputs:** clase `.inp` definida en global.css (texto visible en Solarpunk, Automat, CaaS, Colaberry, Orquestacion, Priorizar).

## v15.15 — 2026-08-05 · Mundus (Sci-Hive) + Life (GuiFV/life)
- **Mundus:** módulo `/mundus` asimilado de Sci-Hive datapoint "Mundus Live" (IDETRA). Manifiesto + círculo azul + pilares mapeados a módulos HSCSG. Circular Exchange = CaaS.
- **Life:** módulo `/life` asimilado de GuiFV/life (Django). Organizador personal con matriz Important×Urgent; costo reinterpretado en ZNU.
- `docs/scihive_mundus_*`, `docs/guifv_life_*` (backup + integración, triple perspectiva).
- 21 módulos, tsc/build OK, rutas `/mundus` `/life` → 200.

---

## v15.14 — 2026-08-05 · Deploy en Vercel
- **URL de producción:** https://hscsg-v15-os.vercel.app/
- **Config:** `vercel.json` (build `npm run build`, output `dist`, rewrite `/* → /index.html` para SPA/BrowserRouter) + `netlify.toml` (alternativa).
- **README/CHANGELOG:** añadido enlace de deploy y sección "Deploy (Vercel)".

---

## v15.13 — 2026-08-05 · Modo Lucidez (Ley III) + skill de asimilación
- **Modo Lucidez:** el botón de luna del Header ahora es un toggle real de transparencia radical (Ley III: *lucidez, nunca engañar*). Al activarse: invierte el tema a **diurno** (sol, `data-lucidez="on"` en `<html>`), muestra un **banner de Ley III** en el Layout, y revela bloques `.lucidez-raw` con **datos crudos y provenance** (ej. desglose de System Health y origen de señales FRS en `/integral`).
- **Implementación:** `store.ts` (`lucidez`, `toggleLucidez`, `setLucidez`, persistido + efecto en `document.documentElement`); `global.css` (bloque `[data-lucidez="on"]` + reglas `.lucidez-raw`/`.lucidez-banner`); `Header.tsx` (botón Moon↔Sun); `Layout.tsx` (banner); `Integral.tsx` (bloque crudo).
- **Seed de notificaciones:** `notifList` precargado con 5 ejemplos del nodo (CaaS, Vesting, Soberanía, Trustlines, Integral).
- **Skill `hscsg-repo-assimilation`:** incluida en `skills/hscsg-repo-assimilation/` (SKILL.md + `references/`: arquitectura, isomorfismos Ley MJ, scaffold de módulo, gotchas Vite/Windows). Respaldada en GitHub junto al proyecto.
- **Verificado:** tsc OK · build OK (1664 módulos) · rutas → 200.

## v15.12 — 2026-08-05 · Integral (9 repos del Integral Collective)
- **Asimilados:** `tairea/integral-phase-1`, `integral-whitepaper`, `integral-cds`, `integral-oad`, `integral-devguide`, `integral-cos`, `integral-decisions`, `integral-frs`, `integral-itc` → módulo **Integral · Loop** (`/integral`).
- **Filosofía:** sistema cooperativo postmonetario cibernéticamente coordinado. Loop cerrado CDS→OAD→COS→ITC→FRS→CDS como marco de planificación, reestructuración y retroalimentación entre componentes de HSCSG.
- **Backup previo:** `HSCSG_v15_OS_BACKUP_20260805_140212/`.
- **Documentos:** `docs/integral_backup.md` (índice de 9 repos), `docs/integral_integration.md` (triple perspectiva + mapeo a vectores HSCSG).
- **Lógica:** `src/core/lib/integral.ts` (`raiseIssue`, `ratifyDecision` append-only DR, `certifyDesign` ecoScore, `logLabor`, `awardCredits` con decay/no-transferible, `ingestSignal`, `diagnose`, `recommend`, `promoteRecommendation` — FRS advisory solo CDS decide, `systemHealth`).
- **Tipos:** `src/core/state/integral.ts`. **Store:** estado `integral` + 9 acciones. **Pantalla:** `src/app/screens/Integral.tsx` (mapa del loop, System Health, CDS/OAD/COS/ITC/FRS).
- **Verificado:** tsc OK · build OK (1664 módulos) · 17 rutas → 200.
- **Isomorfismo:** CDS↔Priorizar/Colectivo, OAD↔Solarpunk/Tekitl, ITC↔ZNU/CaaS (decay), COS↔Tekitl/Autómata, FRS↔Lucidez/Verificación/Colaberry, DR↔institutional memory. Leyes I/II/III respetadas.

## v15.11 — 2026-08-05 · Soberanía (sovereignty-hub + ui)
- **Asimilados:** `overkillkulture/sovereignty-hub` + `tairea/sovereignty-hub-ui` → módulo **Soberanía · 13 Pilares** (`/soberania`).
- **Backup previo:** `HSCSG_v15_OS_BACKUP_20260805_133739/`.
- **Documentos:** `docs/sovereignty_hub_backup.md`, `docs/sovereignty_hub_ui_backup.md`, `docs/sovereignty_integration.md`.
- **Lógica:** `src/core/lib/sovereignty.ts` (13 pilares × 7 capas × 3 fases = 273 puntos; `sovereigntyIndex`, `pillarPhase`, `weakestPillar`, `strongestPillar`, `patternTheoryScore`/Lucidez).
- **Tipos:** `src/core/state/sovereignty.ts`. **Store:** estado `sovereignty` + acciones `setSovereigntyAnswer`, `computePatternScore`. **Pantalla:** `src/app/screens/Soberania.tsx` (matriz 13×7 clicable, índice, pilar débil/fuerte, Leyes I/II/III, Pattern Theory).
- **Verificado:** tsc OK · build OK (1652 módulos) · 16 rutas → 200.
- **Isomorfismo:** pilares = base material (Ley I), 7 capas = escalera AUT (Ley II), Pattern Theory = Lucidez (Ley III).

## v15.10 — 2026-08-05 · Tekitl (Baruch4413/tekitl)
- **Asimilado:** `Baruch4413/tekitl` → módulo **Tekitl · Proyectos** (`/tekitl`).
- **Backup previo:** `HSCSG_v15_OS_BACKUP_20260805_123427/`.
- **Documentos:** `docs/tekitl_backup.md`, `docs/tekitl_integration.md`.
- **Lógica:** `src/core/lib/tekitl.ts` (FSM de etapas, roles/voluntarios, coins por endoso, timeline append-only, talentos/portafolio, `getPortfolio`).
- **Tipos:** `src/core/state/tekitl.ts`. **Store:** estado `tekitl` + 11 acciones. **Pantalla:** `src/app/screens/Tekitl.tsx`.
- **Verificado:** tsc OK · build OK (1640 módulos) · 15 rutas → 200.
- **Isomorfismo:** proyecto = unidad de AUT; coins = endoso post-facto; timeline inmutable = Ley III.

## v15.9 — 2026-08-05 · Trustlines (trustlines-protocol/contracts)
- **Asimilado:** `trustlines-protocol/contracts` → módulo **Trustlines · Crédito** (`/trustlines`).
- **Backup previo:** `HSCSG_v15_OS_BACKUP_20260805_122034/`.
- **Documentos:** `docs/trustlines_backup.md`, `docs/trustlines_integration.md`.
- **Lógica:** `src/core/lib/trustlines.ts` (réplica de `DebtTracking` + `debitTransfer`, deuda bilateral simétrica, apertura de líneas).
- **Tipos:** `src/core/state/trustlines.ts`. **Store:** estado `trust` + 3 acciones. **Pantalla:** `src/app/screens/Trustlines.tsx`.
- **Verificado:** tsc OK · build OK (1622 módulos) · 14 rutas → 200.
- **Isomorfismo:** crédito mutuo sin emisor central = soberanía (Ley II); sin usura = Ley I.

## v15.8 — 2026-08-05 · Vesting (sepu85/collabberry-berry-vesting)
- **Asimilado:** `sepu85/collabberry-berry-vesting` → módulo **Vesting · ZNU** (`/vesting`).
- **Backup previo:** `HSCSG_v15_OS_BACKUP_20260805_120241/`.
- **Documentos:** `docs/berryvesting_backup.md`, `docs/berryvesting_integration.md`.
- **Lógica:** `src/core/lib/vesting.ts` (réplica fiel del contrato: `totalUnlocked`, `releasable`, `release`, `setBeneficiary` una vez, `canRenounce`, `buildBerrySchedule`).
- **Tipos:** `src/core/state/vesting.ts`. **Store:** estado `vesting` + 3 acciones. **Pantalla:** `src/app/screens/Vesting.tsx`.
- **Verificado:** tsc OK · build OK (1620 módulos) · 13 rutas → 200.
- **Isomorfismo:** vesting inmutable/no-drain ≈ Ley I; unlock por hitos ≈ Ley II; beneficiario auditable + renuncia ≈ Ley III.

## v15.1–v15.7 — 2026-08-05 · Asimilaciones base (paperclip, CaaS, Conway, Solarpunk×2, Eliza, prioritize)
- **Asimilados:** Paperclip→Orquestación · CaaS→CaaS · Conway→Autómata Soberano · liz+isaac Solarpunk→Solarpunk·Don · Eliza→Colaberry · ZiadJ/prioritize→Priorizar·Colectivo.
- **Documentos:** `docs/*_backup.md` + `docs/*_integration.md` para cada uno.
- **Módulos:** `/orquestacion`, `/caas`, `/automat`, `/solarpunk`, `/colaberry`, `/priorizar` (+ los del fork Cosateca OS: Home, Base, Lucidez, Colectivo, ZNU, Verificación, Automat).
- **Detalle:** ver `docs/automaton_backup_original.md`, `docs/CaaS_backup_original.md`, `docs/automaton_integration.md`, `docs/CaaS_integration.md`, `docs/colaberry_backup.md`, `docs/colaberry_integration.md`, `docs/prioritize_backup.md`, `docs/prioritize_integration.md`, `docs/solarpunk_integration.md`, `docs/solarpunk_liz_backup.md`, `docs/solarpunk_isaac_backup.md`.

## v15.0 — Fork inicial (Cosateca OS / Cosateca)
- Base del proyecto: marketing agency OS con 7 pantallas base (Home, Base Material, Lucidez, Colectivo, ZNU, Verificación, Automat).
- Stack: React 18 + TS + Vite + Zustand + Tailwind + lucide-react.
- `vite.config.ts` con aliases `@core`, `@app`, `@components`, `@shared`.

---

## Convenciones de verificación
- `tsc --noEmit` → 0 errores.
- `npm run build` → build de producción exitoso (conteo de módulos reportado).
- Rutas → todas responden HTTP 200 en preview (http://localhost:4173).
- Cada módulo asimilado deja: tipos en `src/core/state/`, lógica en `src/core/lib/`, acciones + estado en `store.ts`, pantalla en `src/app/screens/`, nav en `Aside.tsx`, ruta en `App.tsx`, y 2 docs en `docs/`.
