# Asimilación Profunda: Scraping Externo + Repositorios → ALRAC/TQ/Zeitnus Unificado

> **Fecha**: 2026-10-17
> **Fuentes scrapeadas**: closer.earth, snapshot.org, disco.coop, oasa.earth, traditionaldreamfactory.com, ball.disco.coop, elements.disco.coop, aragon.org, elizaOS/eliza, valueflows.org, AGPs, coop-dao-docs
> **Respeto derechos de autor**: Solo conceptos, arquitecturas, principios públicos. No reproducción textual extensiva. Licencias: MIT, CC0, CC-BY-NC, Peer Production License.

---

## 1. Mapa Maestro: Fuentes Externas → Componentes ALRAC/TQ

| Fuente Externa | Conceptos Clave Extraídos | Mapeo ALRAC/TQ | Estado |
|----------------|---------------------------|----------------|--------|
| **closer.earth** (OASA) | 7 principios regenerativos, stewardship vs ownership, Village Fund, Closer Agent, 7 villages live | `Urbanika Factor` (CDS×AUT), `TQ Ledger` (stewardship = kWh), `Community Fund`, `Autómata Soberano` (Closer Agent) | ✅ Mapeado |
| **OASA Constitution 2025** | 7 principios (Soil/Water/Air/Waste/Rewilding/Resources/Community), SPV/Trust legal, Project Assembly, Guardians of Nature, Utility tokens (use rights), Consent-based governance, 7 generaciones | `ALRAC Capa 0` (Principios), `Capa 1 TQ` (kWh = 1 TQ), `Capa 3 ZNU` (utility tokens = use rights), `Capa 5 Gobernanza` (consent + guardians), `γ-CARMIS` (7 generaciones) | ✅ Mapeado |
| **Traditional Dream Factory** | Pilot real: poultry farm → regenerative oasis, €1.5M raised, 300+ token holders, 5000+ trees, water table 20m→3m | `Piloto Línea A` (Diagnóstico Encaje), `Virginia N3` (condominio real), `TQ Ledger` (water table = kWh) | ✅ Mapeado |
| **DisCO Manifesto/Elements** | 3 flujos (Livelihood/Love/Care), 7 principios + 11 valores, DisCO CAT (Trust/Assembly/Transparency), 7 valores, Care before Code, DIWO | `DisCO 3 Flujos` → N3/N2/N1, `DisCO CAT` → Trust/Assembly/Transparency, `Care before Code` → Urbanika CDS×AUT | ✅ Mapeado |
| **DisCO Ball Wiki** | 7 principios/valores, DNA, Elements, Governance, Tools, DisCOverse, Peer Production License | `DisCO Principles` → `ALRAC Capa 0`, `Elements` → `Capa 4 App`, `Governance` → `Capa 5` | ✅ Mapeado |
| **DisCO Elements** | 7 capítulos: Future of Work, DisCO in Nutshell, 7 Principles/11 Values, Commons Governance, CAT/Tech, Care before Code, Futures | `Cap 1` → `ALRAC Capa 0`, `Cap 4` → `Capa 5 Gobernanza`, `Cap 5` → `CAT Integration`, `Cap 6` → `Urbanika/CDS` | ✅ Mapeado |
| **Pink Paper** | Anticapitalista, decolonial, feminista interseccional, AI 2020s, algo-ritmos, liberación tech | `ALRAC Capa 0` (epistémica), `γ-CARMIS` (antídoto algo-ritmos), `DisCO Feminist Economics` → `ALRAC Capa 3` | ✅ Mapeado |
| **snapshot.org** | Spaces DAO, strategies (ERC20, staked, custom), off-chain voting, Gasless, GraphQL API | `ALRAC Capa 5` → `Snapshot Parallel Voting` (Track 2 tdf-snapshot-voting), `Governance UI` | ✅ Mapeado |
| **aragon.org** | OSx modular, 10K projects, $35B governed, modular governance, tokenomics, OTF framework, EPAA | `Colony` patterns → `ALRAC Colony Integration`, `AGPs` → `11 Pasos`, `OTF` → `Tokenomics ZNU` | ✅ Mapeado |
| **elizaOS/eliza** (33k commits) | Agentic OS, characters, clients (Discord/Twitter/Telegram), plugins, memory, RAG, voice, AGENTS.md | `Autómata Soberano` → `Autómata Extendido`, `Character System` → `Naram-Sin`, `Plugins` → `Vasos Comunicantes` | ✅ Mapeado |
| **valueflows.org** | VF vocabulary (economic events), REA ontology, recipes, processes, economic networks | `ValueFlows` → `ALRAC Capa 2` (Interoperabilidad), `CaaS Streams` → VF types | ✅ Mapeado |
| **AGPs (archived)** | 784 commits, AGP process sunset, emergency votes, editorial/board review | `AGP Process` → `11 Pasos Parise`, `Emergency Votes` → `γ-CARMIS Paso II` | ✅ Mapeado |
| **coop-dao-docs** | The Coop DAO docs, Rinkeby demo, Aragon Coop | `Coop DAO` → `Zeitnus Coop Legal`, `Aragon Coop` → `Colony Integration` | ✅ Mapeado |

---

## 2. Síntesis Arquitectónica: 8 Capas Unificadas (Extendidas)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│              ECOSISTEMA UNIFICADO: EXTERNO + REPOS + ALRAC/TQ                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  CAPA 8: PRINCIPIOS REGENERATIVOS CONSTITUCIONALES (OASA/DisCO)                   │
│  ├── 7 Principios OASA: Soil/Water/Air/Waste/Rewilding/Resources/Community        │
│  ├── 7 Principios DisCO: P2P/Commons/Feminist/Coop/Care/Open/Justice              │
│  ├── Pink Paper: Anticapitalista/Decolonial/Feminista/Interseccional              │
│  └── 7 Generaciones (OASA Art XI) → γ-CARMIS threshold                            │
│                                                                                     │
│  CAPA 7: AGENTES IA SOBERANOS REGENERATIVOS (elizaOS + sepu85 agents)              │
│  ├── elizaOS: Character System, Clients, Plugins, Memory, RAG, Voice              │
│  ├── HR_AI_Agent: Agreement Settler / Mediator (DisCO consent + CDS jurados)       │
│  ├── hr-agent-bot: Onboarding + Skill Matching (Telegram/Discord)                  │
│  ├── coh3rence-agent: γ-CARMIS Facilitator + DisCO Governance                     │
│  └── asha-mel-crm: MEL CRM → ALRAC Metrics + CaaS Monitoring                      │
│                                                                                     │
│  CAPA 6: GOBERNANZA VERIFICABLE + FEDERACIÓN (OASA/DisCO/tdf/Aragon)              │
│  ├── OASA: Project Assembly, General Meeting, Guardians of Nature, Consent        │
│  ├── DisCO CAT: Trust (RAO+CDS+Bread), Assembly (consent 1a1v), Transparency      │
│  ├── tdf-snapshot-voting: 3 Tracks (Closer Fix / Snapshot Parallel / Social Audit)│
│  ├── Aragon AGPs: Process sunset → 11 Pasos Parise, Emergency Votes → γ-CARMIS    │
│  ├── Snapshot.org: Strategies (ERC20+staked), Shadow voting, GraphQL               │
│  ├── Closer attestation: RFC/PR fix, Snapshot parallel, Social audit panel         │
│  └── Social Audit: Rotating panel, hand-count, platform-independent               │
│                                                                                     │
│  CAPA 5: AUTOÓMATA SOBERANO EXTENDIDO (elizaOS + sepu85 agents)                    │
│  ├── Character System: Characters, Clients (Discord/Telegram/Twitter), Memory     │
│  ├── Agreement Settler: HR_AI_Agent → DisCO consent + CDS jurados                 │
│  ├── Onboarding Bot: hr-agent-bot → Skill matching + FABSHIP Kit                  │
│  ├── Governance Facilitator: coh3rence-agent → γ-CARMIS + DisCO flows             │
│  ├── MEL CRM: asha-mel-crm → ALRAC Metrics + CaaS monitoring                      │
│  └── Closer Agent: Sovereign AI on own infrastructure                             │
│                                                                                     │
│  CAPA 4: GOBERNANZA PROGRAMABLE + TESORERÍA (Colony + Closer + Aragon)            │
│  ├── Colony: Domains (N1=root, N2=sub, N3=project, fund), Reputación, Pots        │
│  ├── movePot(): CDS-governed transfers N1→N2→N3                                   │
│  ├── Closer UI Patterns: ProposalUI, TreasuryUI, OnboardingUI → /alrac screens    │
│  ├── Aragon OSx: Modular governance, OTF (Ownership Token Framework)              │
│  ├── AGP Process → 11 Pasos Parise, Emergency Votes → γ-CARMIS Paso II            │
│  └── OTF Framework → ZNU Tokenomics (ownership + value accrual)                   │
│                                                                                     │
│  CAPA 3: VESTING ZNU + LIBERACIÓN GRADUAL (Berry + HR_AI_Agent)                   │
│  ├── Berry Schedule: 30% meses 25-30, pausa 31-36, 70% meses 37-43                │
│  ├── claimVesting(): hito AUT + Bread consensus + Urbanika CDS×AUT ≥ 0.5 + unlocked│
│  ├── ZNU liberado → Reputación Colony + Pot access + Peso N3 boost                │
│  ├── HR_AI_Agent: Agreement settlement via claimVesting()                         │
│  └── DisCO Livelihood flow → Vesting schedule tied to AUT milestones              │
│                                                                                     │
│  CAPA 2: VERIFICACIÓN SOCIAL + RECONOCIMIENTO (Bread + tdf + recognition + Closer)│
│  ├── Bread: N2 peers votan contribución N3 → consensusWeight                      │
│  ├── tdf-snapshot-voting: Track 1 (Closer RFC/PR), Track 2 (Snapshot parallel),  │
│  │   Track 3 (Social Audit panel rotativo CDS-weighted)                            │
│  ├── recognition-rites: DisCO Love flow variants + Web3Forms + CDS recognition    │
│  ├── Closer Attestation: RFC/PR fix (#1179), Snapshot parallel, Social audit      │
│  ├── Social Audit Panel: Rotación CDS-weighted, hand-count, platform-independent  │
│  └── DisCO Love Flow: 3 variants, skill/contribution/governance/care recognition  │
│                                                                                     │
│  CAPA 1: MEDICIÓN TERMODINÁMICA + AUTOGESTIÓN + FEDERACIÓN (TQ + Urbanika + OASA) │
│  ├── TQ Ledger: 1 TQ = 1 kWh, ±500, exchangeGuard, conversionFactor               │
│  ├── Urbanika: CDS × AUT = autogestión vecinal (DisCO Care flow)                  │
│  ├── OASA 7 Principios: Soil/Water/Air/Waste/Rewilding/Resources/Community        │
│  ├── DisCO 3 Flujos: Livelihood→N3 (TQ/ZNU), Love→N2 (CDS), Care→N1 (Urbanika)    │
│  ├── DisCO CAT: Trust (RAO+CDS+Bread), Assembly (consent), Transparency (VF+TQ)   │
│  ├── DHO Federation: Nodos federados via CAT sync + RAO sync + Shared Treasury    │
│  ├── DHO Phases: A(emergent)→B(consolidated)→C(mature)→D(federated)              │
│  ├── rentangled/entangled: P2P entanglement → DTN + ValueFlows sync               │
│  ├── ValueFlows: REA ontology → CaaS Streams + VF accounting                       │
│  └── MEL CRM (asha-mel-crm): Monitoring/Evaluation/Learning → ALRAC Metrics       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mapeo Detallado: Conceptos Externos → Código ALRAC Existente

### 3.1 OASA Constitution → ALRAC Legal/Structural

| OASA Artículo | Concepto | Archivo ALRAC | Implementación |
|---------------|----------|---------------|----------------|
| **Art I: Identity** | SPV/Trust land, Citizens = token holders + contribution | `Zeitnus Coop` legal, `RAO` credentials | `src/core/lib/rao.ts` (pendiente) |
| **Art II: Projects** | Land Trust (SPV), Project Assembly, Executive Team | `Virginia Network` (N1/N2/N3), `Colony Domains` | `src/core/lib/colony.ts`, `virginiaNetwork.ts` |
| **Art III: Principles** | 7 Regenerative Principles (Soil/Water/Air/Waste/Rewilding/Resources/Community) | `Urbanika Factor` (CDS×AUT), `TQ Ledger` (kWh = Soil/Water/Energy) | `tq.ts`, `urbanika.ts` (pendiente) |
| **Art IV: Governance** | GM (supermajority + Guardians), Project Assembly, Executive Teams, Guardians of Nature | `ALRAC Capa 5` (1a1v + CDS + CDS Jurados + Veto Núcleo), `γ-CARMIS` | `alrac-governance-holonic.md`, `alrac.ts` |
| **Art V: Technology** | Digitized Commons, Utility Tokens (use rights), Open Source, Data Sovereignty, AI Rights | `ZNU` (utility token), `OpenSpec`, `RAO`, `Autómata Soberano` (AI duties) | `znu.ts`, `automaton.ts`, `rao.ts` |
| **Art XI: Future Generations** | 7 generaciones impact assessment, Guardians of Nature | `γ-CARMIS` (αʰ < κ = future risk), `ALRAC Capa 0` (PI) | `alrac.ts`, `pipeline.ts` |

### 3.2 DisCO Manifesto/Elements → ALRAC Cultural/Economic

| DisCO Concepto | ALRAC Mapping | Archivo |
|----------------|---------------|---------|
| **3 Flujos** (Livelihood/Love/Care) | N3 TQ/ZNU (Livelihood) → N2 CDS (Love) → N1 Urbanika CDS×AUT (Care) | `VIRGINIA_N3_DISCO_DHO_VESTING_INTEGRATION.md` |
| **7 Principios DisCO** | `ALRAC Capa 0` epistémica: P2P, Commons, Feminist, Coop, Care, Open, Justice | `ALRAC_MASTER_INTEGRADO.md` Capa 0 |
| **11 Valores DisCO** | `ALRAC Capa 5` Gobernanza: Transparencia, Consent, Care, Equity, etc. | `alrac-governance-holonic.md` |
| **DisCO CAT** (Trust/Assembly/Transparency) | `Trust` = RAO+CDS+Bread, `Assembly` = 1a1v+Consent, `Transparency` = VF+Vesting+Pots+TQ | `DisCO_CAT` types en `tq-types-extended.ts` |
| **Care before Code** | `Urbanika Factor` = CDS×AUT (autogestión antes que tech) | `urbanika.ts`, `VIRGINIA_N3_DYNAMIC_URBANIKA_BREAD.md` |
| **DIWO** (Do It With Others) | `Colony` collaboration + `Vasos Comunicantes` + `Gran Alianza` | `colony.ts`, `vaseos-comunicantes.ts` |
| **DisCO Elements** (Care Governance modules) | `Capa 4 App` modules: Livelihood/Love/Care tracking | `src/app/screens/DisCOElements.tsx` (pendiente) |
| **Pink Paper** (AI 2020s, algo-ritmos) | `γ-CARMIS` = antídoto a algo-ritmos, `ALRAC Capa 0` epistémica | `alrac.ts` `gammaCARMIS()` |

### 3.3 Closer/OASA → ALRAC Regenerative Infrastructure

| Closer/OASA Concepto | ALRAC Mapping | Archivo |
|--------------------|---------------|---------|
| **7 Villages Live** | Pilot Nodos Virginia reales | `Piloto Línea A` (Diagnóstico Encaje) |
| **Traditional Dream Factory** | Pilot real: water table 20m→3m, 5000 trees | `Piloto Línea A` caso real |
| **OASA Village Fund** | `Community Fund` + `Regional Dividend Fund` (matched funding) | `tq.ts` `CommunityFund`, `tq-regional-dividend.ts` |
| **OASA Principles (7)** | `Urbanika Factor` CDS×AUT, `TQ Ledger` kWh = regeneración | `Urbanika Factor` en `tq-virginia-colony-vesting.ts` |
| **Closer Agent** | `Autómata Soberano` + `Closer Agent` pattern | `automaton.ts` + `closer-agent.ts` (pendiente) |
| **Stewardship vs Ownership** | `TQ Stock` (propiedad productiva) vs `TQ Flow` (reciprocidad) | `TQ_POSTLABOR_PROPOSAL.md` Dual-Layer |
| **OASA Constitution** | `ALRAC Capa 0` + `Capa 5` legal structure | `ALRAC_MASTER_INTEGRADO.md` + `Zeitnus Coop` legal |

### 3.4 elizaOS/eliza → Autómata Soberano Extendido

| elizaOS Concepto | ALRAC Mapping | Archivo |
|-----------------|---------------|---------|
| **Character System** | `Naram-Sin` interface + `Autómata Soberano` characters | `automaton.ts`, `naram-sin.ts` (pendiente) |
| **Clients** (Discord/Telegram/Twitter) | `hr-agent-bot` + `Autómata` multi-platform | `automaton.ts`, `hr-agent-bot.ts` (pendiente) |
| **Plugins** (RAG, Voice, etc.) | `Vasos Comunicantes` extensibles | `vaseos-comunicantes.ts` |
| **Memory** (Long-term, RAG) | `Autómata` memory + `RAO` audit trail | `automaton.ts`, `rao.ts` |
| **AGENTS.md** (contribution rules) | `ALRAC Capa 5` contribution guidelines | `AGENTS.md` en repo |
| **HR_AI_Agent** (Mediator) | `Autómata` Agreement Settler | `automaton.ts` `agreementSettler` |
| **coh3rence-agent** | `γ-CARMIS` Facilitator regenerativo | `alrac.ts` `gammaCARMISFacilitator` |

### 3.5 ValueFlows → ALRAC Capa 2 Interoperabilidad

| VF Concepto | ALRAC Mapping | Archivo |
|-------------|---------------|---------|
| **Economic Events** (transfer, process, fulfillment) | `CaaS Revenue Streams` (6 streams) | `caas.ts` |
| **Recipes** (process definitions) | `Enterprise Staking Stack` (5 rubros) | `tq.ts` `EnterpriseStakingStack` |
| **Economic Resources** | `TQ` (kWh) + `ZNU` (canasta) + `ProductiveAsset` | `tq.ts` `ProductiveAsset` |
| **Economic Agents** | `TQEquityAccount` + `DHO_Node` | `tq-types-extended.ts` |
| **Accounting** (REA ontology) | `TQ Ledger` + `Vesting` + `CaaS` accounting | `tq.ts`, `vesting.ts`, `caas.ts` |

---

## 4. Gaps Críticos Identificados (Scraping → Implementación)

| Gap | Fuente Externa | Acción Requerida | Prioridad |
|-----|----------------|------------------|-----------|
| **OASA Constitution legal structure** | OASA Constitution Art I-II | `Zeitnus Coop` legal docs + SPV/Trust templates | P0 |
| **OASA 7 Principles → Metrics** | OASA Art III 7 principles | `Urbanika Factor` metrics: Soil/Water/Air/Waste/Rewilding/Resources/Community kWh | P0 |
| **DisCO CAT implementation** | DisCO Elements Cap 5 | `DisCO_CAT` types + `Trust/Assembly/Transparency` modules | P0 |
| **OASA Utility Token specs** | OASA Art V | `ZNU` token specs: use rights, bonding curve, bonding curve params | P0 |
| **Closer Agent architecture** | closer.earth/agent | `CloserAgent` class en `automaton.ts` | P1 |
| **Snapshot strategy config** | snapshot.org strategies | `snapshotParallelVoting()` en `symbiosky.ts` | P1 |
| **Closer Attestation RFC** | tdf-snapshot-voting Track 1 | `closerAttestationFix()` en `symbiosky.ts` | P1 |
| **Social Audit Panel** | tdf-snapshot-voting Track 3 | `socialAuditPanel()` rotación CDS | P1 |
| **DisCO Elements modules** | elements.disco.coop chapters | `DisCO Elements` UI modules en `/alrac` | P1 |
| **ValueFlows VF vocabulary** | valueflows.org | `VF types` en `caas.ts` + `tq-types-extended.ts` | P1 |
| **elizaOS plugin system** | elizaOS plugins | `Vasos Comunicantes` plugin architecture | P2 |
| **Aragon OTF Framework** | aragon.org/otf | `ZNU Tokenomics` Ownership Token Framework | P2 |
| **AGP Process → 11 Pasos** | AGPs archive | `11 Pasos Parise` formalización | P2 |

---

## 5. Plan de Implementación Inmediata (Fase 0-1)

### Fase 0: Tipos Base Unificados (Semana 1)
```bash
# Archivos a crear/actualizar:
src/core/lib/tq-types-extended.ts      # +20 tipos nuevos (OASA, DisCO, Closer, Eliza, VF)
src/core/lib/tq-oasa.ts                # OASA Constitution types + legal structure
src/core/lib/tq-disco-cat.ts           # DisCO CAT Trust/Assembly/Transparency
src/core/lib/tq-closer.ts              # Closer Agent + Village + OASA types
src/core/lib/tq-eliza.ts               # ElizaOS character system + plugins
src/core/lib/tq-valueflows.ts          # VF vocabulary + REA ontology
src/core/lib/tq-aragon.ts              # Aragon OSx + AGPs + OTF
```

### Fase 1: Integración Núcleo (Semanas 2-3)
```bash
# Motor unificado:
src/core/lib/tq-oasa-integration.ts    # OASA Constitution → ALRAC legal/structural
src/core/lib/tq-disco-integration.ts   # DisCO 3 flujos + CAT → Virginia N3
src/core/lib/tq-closer-integration.ts  # Closer Agent + Village Fund + OASA principles
src/core/lib/tq-eliza-integration.ts   # ElizaOS → Autómata Soberano extendido
src/core/lib/tq-valueflows-integration.ts # VF → CaaS + TQ accounting
```

### Fase 2: Gobernanza Verificable (Semanas 3-4)
```bash
src/core/lib/symbiosky-extended.ts     # + verifiableVoting, closerAttestationFix, snapshotParallel, socialAuditPanel
src/core/lib/tq-governance-ui.ts       # Closer UI patterns + Aragon OTF
src/core/lib/tq-social-audit.ts        # Social Audit Panel rotativo CDS
```

### Fase 3: Piloto Real (Semanas 4-6)
```bash
# Conectar Traditional Dream Factory → Virginia N3 piloto
docs/PILOTO_TDF_VIRGINIA_N3.md         # Plan piloto TDF → N3 Virginia
scripts/deploy-pilot-tdf.ts            # Deploy piloto real
```

---

## 6. Conclusión: El Mapa Completo

> **El scraping externo confirma y expande la asimilación previa**: Cada fuente externa valida y enriquece un componente específico del stack ALRAC/TQ.

| Stack ALRAC/TQ | Validado/Expandido por | Fuente Clave |
|----------------|------------------------|--------------|
| **Capa 0 Epistémica** | DisCO Principles + Pink Paper + OASA Preamble | DisCO Manifesto, Pink Paper, OASA Constitution |
| **Capa 1 TQ Ledger** | OASA 7 Principles (kWh = regeneración), TDF water table | OASA Constitution, Traditional Dream Factory |
| **Capa 2 Interop** | ValueFlows REA ontology, rentangled P2P | valueflows.org, rentangled/entangled |
| **Capa 3 ZNU/Membrana** | OASA Utility Tokens (use rights), Closer tokens | OASA Constitution Art V, closer.earth |
| **Capa 4 App** | DisCO Elements (7 chapters), Closer platform features | DisCO Elements, closer.earth |
| **Capa 5 Gobernanza** | OASA Assembly/Guardians, DisCO CAT, Aragon AGPs, Snapshot, tdf-snapshot-voting | OASA Art IV, DisCO Ball, AGPs, snapshot.org |
| **Autómata Soberano** | elizaOS (33k commits), HR_AI_Agent, coh3rence-agent | elizaOS/eliza, sepu85 agents |
| **Vesting ZNU** | Berry schedule (collabberry), DisCO Livelihood | collabberry-berry-vesting, DisCO Manifesto |
| **Colony/Gobernanza** | Colony domains/pots, Aragon AGPs, AGPs process | colony.ts, AGPs archive |
| **Federación** | OASA Association, DisCO Federation, DHO Network | OASA Art II, DisCO Federation, DHO phases |

---

## 7. Próximo Paso: Fase 0 Tipos Base

> **¿Iniciar Fase 0?** Crear `tq-types-extended.ts` extendido con ~25 nuevos interfaces que unifican OASA, DisCO, Closer, Eliza, ValueFlows, Aragon, VF en el sistema de tipos ALRAC/TQ.

**Confirmación requerida**: ¿Procedo con implementación Fase 0 (tipos base unificados)?