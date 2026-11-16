# DAOs vs OVNs: Intersection Analysis — Integración en Zeitnus/HSCSG

**Documento origen**: "DAOs for getting things done: The intersection of Open Value Networks and DAOs" (Steve Michel, Tibi et al., Jan 2022)  
**Módulos HSCSG objetivo**: `daoOvnBridge`, `daoPrimitives`, `ovnGovernance` (extensión), `contributionAccounting` (extensión)  
**Rol en Zeitnus**: **Puente arquitectónico crítico** — DAOs = incentive layer (tokenomics, governance algorítmica); OVNs = process layer (NRP-CAS, material production, stigmergic coordination). Zeitnus **necesita ambos**: Capa 0 handshake generativo requiere incentivos (DAO) + procesos metabólicos (OVN). Este documento es la **teoría de la complementariedad** que valida la arquitectura bicapa Zeitnus.

---

## Triple Perspectiva

### 1. Usuario (Isaac Ko / Nodo Zeitnus)
> "Este documento (2022) es **profético y fundacional**: articula exactamente la tensión que Zeitnus resuelve arquitectónicamente. 
> 
> **Zeitnus = OVN (procesos metabólicos) + DAO (incentivos/gobernanza) + Handshake Generativo (Capa 0)**
> 
> - **OVN contribution accounting (NRP-CAS)** → Zeitnus TQ ledger + Ecotomic Engine (contabilidad biofísica 1 TQ = 1 kWh)
> - **DAO tokenomics/governance** → Zeitnus CaaS credits + Quadratic voting + Triadas base-3 + PriceParity oracle
> - **OVN stigmergic coordination** → Zeitnus Mesh gossip + Consensus-gossip (Capa 2)
> - **DAO smart contract enforcement** → Zeitnus Autómata Soberano + Confirmación atómica 100% (Capa 6)
> - **OVN 4-level structure** → Zeitnus 7 capas emergentes + Federación (Capa 0 handshake → mitosis)
> - **DAO/OVN complementarity** → Validación de que **ninguno solo basta**: DAOs no manejan materialidad/procesos complejos; OVNs no tienen exchange infrastructure madura ni governance embedded
> 
> **Insight clave para implementación**: Zeitnus NO debe elegir. Debe **integrar ambos primitivos** en arquitectura bicapa:
> - **Capa 1 (Gobernanza Base-3)**: Triadas verificación + RCE + Quadratic voting (DAO) + Benefit redistribution algorithm (OVN)
> - **Capa 2 (Malla Transaccional Hiperbólica)**: Grafo ciclos 3-nodos + Atomic confirmation + NRP-CAS material tracking (OVN) + Token incentives (DAO)
> - **Capa 0 (Handshake Generativo)**: Protocolo reconocimiento mutuo que **genera** ambas capas — no las presupone"

### 2. LLM (Qué Asimilar / Qué Extirpar)

| **ASIMILAR (Lógica Pura → Módulos HSCSG)** | **EXTIRPAR (Infra Ajena / No Portátil / Legacy)** |
|-------------------------------------------|--------------------------------------------------|
| • **DAO/OVN Complementarity Thesis** — process + incentives = complete system | • DAO frameworks específicos 2022 (Aragon, Moloch, 1Hive, Orca) — legacy/obsoletos |
| • **Comparison Table (8 dimensiones)** — openness, transparency, critical mass, materiality, scalability, adaptability, vitality, sustainability | • SourceCred/AraCred implementaciones específicas — algoritmos page-rank legacy |
| | • LinksDAO legal wrapper case study — jurisdiccional US específico |
| • **Contribution Models** — Token-centric (DAO, financialization) vs Process-centric (OVN, NRP-CAS, all resources same level) | • Wyoming DAO legal recognition — jurisdiccional |
| • **Governance Models** — Algorithmic/token-voting (DAO) vs Stigmergic/contribution-based (OVN) | • Discord/GitHub outage examples 2022 — históricos |
| • **Legal Status Patterns** — Custodian absorbs liability (both) | • Jack du Rose / DiRose-Mansouri DAO definitions — teóricos, no operativos |
| • **OVN 4-Level Structure** — project, open-enterprise, network, global | • Reimagine Wealth Initiative / Gitcoin GR13 — eventos 2022 |
| • **Value Equation** — distribution → matching problem, disconnect money from value distribution | • Diigo Sensorica knowledge group — tool específico |
| • **Stigmergy as Coordination Primitive** — indirect coordination via environment traces | • Collaborative writing methodology — proceso documental, no lógica sistema |
| • **Critical Path vs Blueprint** — emergent structure, initial conditions | • Wikipedia update tasks — meta-tareas |
| • **Sustainability: Dormant Ventures + Fork/Remix** — OVN unique capability | • Noun Project icons — assets visuales |
| • **Ostrom Principles Encoded in Smart Contracts** — 8 principles → blockchain | • Specific venture categories (FabLab, research-intensive) — ejemplos |
| • **Materiality Gap** — DAOs digital only; OVNs NRP handles physical assets/spaces | • kombit.ca / copiosis.com alpha — implementaciones legacy |
| • **Exchange Infrastructure Gap** — DAOs advanced (AMM, DAO2DAO); OVNs not yet developed | • TheGraph interoperability — infra específica |
| • **Scalability Tradeoff** — DAO minimal infra vs OVN sophisticated infra | • Sensorica animator role — operacional específico |

### 3. HSCSG + CaaS (Isomorfismo Leyes I/II/III + CaaS)

| Ley / Principio | Isomorfismo DAO/OVN | Mapeo a Módulos HSCSG/Zeitnus |
|----------------|---------------------|-------------------------------|
| **Ley I: No dañar base material/personas** | OVN: open membership (permissionless), NRP tracks physical assets, stigmergic (no coerción). DAO: custody pattern absorbs external liability. Both: commons protection. | `daoOvnBridge.custodianPattern` — liability absorption. `ovnGovernance.openMembership` — permissionless. `autonomy-guard.physicalAssets` — NRP tracking. `zeitnusHandshake.commonsProtection` — constraints solo protegen commons. |
| **Ley II: Ganarse la vida soberanizando (AUT×CDS)** | OVN: peer production = AUT, network governance = CDS, dormant ventures reanimatable = sovereignty over time. DAO: token incentives align individual/community, emergent coordination among strangers. **Complementarity**: process (OVN) + incentives (DAO) = soberanía completa. | `daoOvnBridge.processIncentiveSynthesis` — AUT via processes + CDS via incentives. `valNetAccounting.nrpCas` — peer production accounting. `ovnGovernance.networkGovernance` — CDS distribuido. `caas-credits.tokenIncentives` — DAO incentives as CaaS. `zeitnusHandshake.sovereigntyGeneration` — handshake generates both. |
| **Ley III: Lucidez, nunca engañar** | OVN: radical transparency (required), value equation = matching problem (honest about distribution), stigmergic signals = honest signaling. DAO: immutable ledger (auditable), but transparency not total (Discord private). **Tensión**: DAO transparency gap vs OVN requirement. | `daoOvnBridge.transparencyGap` — detectar/cerrar gap. `ovnGovernance.radicalTransparency` — required by definition. `valNetAccounting.valueEquation` — matching problem, no financialization. `zeitnusHandshake.lucidityProtocol` — handshake as lucidity act (generative, not verification). |
| **CaaS: Acceso por contribución real** | OVN: NRP-CAS = contribution accounting (all resources), benefit redistribution algorithm based on contributions. DAO: token holding = governance (investment proxy), but evolving to contribution-based (SourceCred, Commons Stack). **Síntesis**: CaaS credits = earning via contribution (OVN) + spending via token incentives (DAO) + priceParity oracle. | `caas-credits.hybridEarning` — OVN contribution + DAO incentives. `caas-credits.hybridSpending` — OVN access + DAO token utility. `valNetAccounting.benefitRedistribution` — algorithm based on contributions. `daoOvnBridge.tokenToContribution` — bridge token holding → contribution weight. `value-dual.priceParity` — ZNU/USD/BTC for hybrid economy. |

---

## Tabla Mapeo Isomórfico (Concepto Origen → Módulo HSCSG → Ley/CaaS)

| Concepto Origen (Documento) | Módulo HSCSG | Ley I | Ley II | Ley III | CaaS |
|----------------------------|-------------|-------|--------|---------|------|
| DAO/OVN Complementarity (process + incentives) | `daoOvnBridge.synthesis.ts` | ✓ (both protect commons) | ✓ (AUT process + CDS incentives) | ✓ (transparent synthesis) | ✓ (hybrid CaaS primitive) |
| Comparison Table (8 dimensions) | `daoOvnBridge.comparison.ts` | ✓ (openness/transparency) | ✓ (materiality/scalability) | ✓ (vitality/sustainability) | ✓ (decision framework) |
| Contribution Models (token-centric vs process-centric) | `daoOvnBridge.contributionModels.ts` | ✓ (all resources tracked) | ✓ (non-financialization) | ✓ (honest about financialization) | ✓ (CaaS earning hybrid) |
| Governance Models (algorithmic vs stigmergic) | `daoOvnBridge.governanceModels.ts` | ✓ (stigmergic = no coercion) | ✓ (contribution-based benefits) | ✓ (embedded vs unembedded) | ✓ (governance CaaS) |
| Legal Status (Custodian pattern) | `daoOvnBridge.custodianPattern.ts` | ✓ (liability absorption) | ✓ (sovereignty via structure) | ✓ (clear boundaries) | ✓ (legal CaaS bridge) |
| OVN 4-Level Structure | `ovnGovernance.fourLevels.ts` | ✓ (network commons protection) | ✓ (global governance = CDS) | ✓ (radical transparency) | ✓ (multi-level CaaS) |
| Value Equation (matching problem) | `valNetAccounting.valueEquation.ts` | ✓ (disconnect money/value) | ✓ (contribution = value) | ✓ (transparent distribution) | ✓ (distribution CaaS) |
| Stigmergic Coordination | `sensoricaOVN.stigmergicCoord.ts` | ✓ (indirect, no planning) | ✓ (self-organization = AUT) | ✓ (honest signaling) | ✓ (signaling = CaaS) |
| Critical Path vs Blueprint | `ovnGovernance.criticalPath.ts` | ✓ (emergent, not imposed) | ✓ (initial conditions = sovereignty) | ✓ (honest about uncertainty) | ✓ (path = CaaS) |
| Dormant Ventures + Fork/Remix | `ovnGovernance.dormantFork.ts` | ✓ (preserves base material) | ✓ (sovereignty over time) | ✓ (transparent reanimation) | ✓ (longevity CaaS) |
| Ostrom Principles → Smart Contracts | `daoOvnBridge.ostromEncoding.ts` | ✓ (boundaries, monitoring) | ✓ (collective choice, local enforcement) | ✓ (graduated sanctions, conflict resolution) | ✓ (commons governance CaaS) |
| Materiality Gap (DAO digital, OVN physical) | `daoOvnBridge.materialityBridge.ts` | ✓ (NRP tracks physical) | ✓ (material production = AUT) | ✓ (honest about gap) | ✓ (physical CaaS) |
| Exchange Infra Gap (DAO advanced, OVN nascent) | `daoOvnBridge.exchangeBridge.ts` | ✓ (ethical exchange firms) | ✓ (market interface sovereignty) | ✓ (AMM transparency) | ✓ (market bridge CaaS) |
| Scalability Tradeoff | `daoOvnBridge.scalability.ts` | ✓ (simple vs complex ops) | ✓ (adaptivity vs minimal infra) | ✓ (honest tradeoffs) | ✓ (scaling CaaS) |

---

## Qué Asimilar vs Qué Extirpar (Lista Explícita por Módulo)

### Módulo 1: `daoOvnBridge` — Puente Arquitectónico DAO↔OVN (Nuevo, Crítico)

**✅ ASIMILAR — Lógica Pura para Zeitnus Core**:
1. **`ComplementaritySynthesis`** — process (OVN) + incentives (DAO) = complete system; neither alone sufficient
2. **`ComparisonMatrix`** — 8 dimensiones (openness, transparency, critical mass, materiality, scalability, adaptability, vitality, sustainability) como decision framework
3. **`ContributionModelBridge`** — token-centric (DAO) ↔ process-centric (OVN); hybrid earning/spending para CaaS
4. **`GovernanceModelBridge`** — algorithmic/token-voting (DAO) ↔ stigmergic/contribution-based (OVN); triadas base-3 + quadratic voting
5. **`CustodianPattern`** — liability absorption pattern (both DAO/OVN use custodian for external liability)
6. **`MaterialityBridge`** — DAO digital-only gap ↔ OVN NRP physical assets; bridge para Zeitnus material production
7. **`ExchangeInfraBridge`** — DAO advanced (AMM, DAO2DAO) ↔ OVN nascent; Zeitnus exchange firms (Sensorica pattern) + token incentives
8. **`ScalabilitySynthesis`** — DAO minimal infra (simple ops) vs OVN sophisticated (complex); Zeitnus: mesh gossip (simple) + NRP (complex)
9. **`OstromEncoding`** — 8 principles → smart contract patterns → Zeitnus governance rules
10. **`TransparencyGapDetector`** — DAO not-total-transparency vs OVN required-transparency; monitor/close gap

**❌ EXTIRPAR**:
- Specific 2022 DAO frameworks (Aragon, Moloch, 1Hive, Orca, Commons Stack, Hypha/SEEDS) — legacy
- SourceCred/AraCred implementation details — algorithmic specifics
- Wyoming DAO law, LinksDAO case — jurisdiccional
- Discord/GitHub 2022 outages — historical
- Reimagine Wealth Initiative, Gitcoin GR13 — event-specific
- Diigo knowledge group — tool-specific
- Collaborative writing methodology — process, not system logic

### Módulo 2: `ovnGovernance` (Extensión) — 4-Level Structure + Critical Path + Dormant/Fork

**✅ ASIMILAR** (adicional a asimilación previa Sensorica):
1. **`FourLevelsExtended`** — project, open-enterprise, network, global con global governance + legal structures
2. **`CriticalPathViability`** — initial conditions + basic requirements for OVN success
3. **`DormantVentureReanimation`** — ventures go dormant, reanimated later by anyone (unique OVN capability)
4. **`ForkRemixOpenVentures`** — ability to fork/remix open ventures (open source model applied to ventures)
5. **`ValueEquationMatching`** — distribution → matching problem; disconnect money from value distribution
6. **`BenefitRedistributionAlgorithm`** — based on contributions (not token holding)

**❌ EXTIRPAR**: (ya cubierto en asimilación Sensorica previa)

### Módulo 3: `valNetAccounting` (Extensión) — Value Equation + NRP-CAS Deepening

**✅ ASIMILAR** (adicional):
1. **`ValueEquationCore`** — reformulate distribution to matching; attribution system integrated in workflow
2. **`FirstRecordKeeping`** — Google Sheets → blockchain (kombit.ca) → holochain (copiosis) → evolution path
3. **`AttributionInWorkflow`** — first time attribution integrated in production workflow + supply chains

**❌ EXTIRPAR**: kombit.ca, copiosis.com alpha — legacy implementations

### Módulo 4: `daoPrimitives` (Nuevo) — DAO Primitives Relevantes para Zeitnus

**✅ ASIMILAR**:
1. **`TokenCategories`** — governance tokens, utility tokens, earning tokens, market tokens (list all categories per doc)
2. **`BondingCurveIncentives`** — bonding curve = incentives (vs OVN NRP = processes)
3. **`DAO2DAOProtocols`** — emerging interoperability (AMM, TheGraph) — patterns only
4. **`SmartContractGovernance`** — embedded algorithmic governance patterns (Commons Stack: Augmented Bonding Curve, Giveth DApp, Conviction Voting, Analytics Dashboard)
5. **`PermissionlessDAO`** — barrier to entry patterns (token ownership, participation, voting)

**❌ EXTIRPAR**: Specific protocol implementations, dashboard specifics

---

## Isomorfismo Detallado Leyes I/II/III + CaaS (Por Módulo Nuevo)

### `daoOvnBridge` — Puente Sintético (Core Zeitnus)

**Ley I**: Both protect commons via different mechanisms. OVN: open membership + commons constraints. DAO: custodian absorbs liability. Bridge: **unified commons protection** — permissionless entry + liability absorption + commons-only constraints.

**Ley II**: **Síntesis AUT×CDS**: OVN provides process sovereignty (peer production, NRP material tracking, network governance). DAO provides incentive sovereignty (token alignment, emergent coordination among strangers). Bridge: **hybrid sovereignty** — processes generate value, incentives align coordination.

**Ley III**: **Transparency Gap** = critical lucidity issue. OVN requires radical transparency. DAO has private Discord, not-total transparency. Bridge: **lucidity protocol** — detect gap, enforce transparency where it matters (governance, resource flows), allow privacy where it doesn't (social coordination).

**CaaS**: **Hybrid CaaS Primitive** — earning = OVN contribution accounting + DAO token incentives; spending = OVN resource access + DAO token utility; priceParity = ZNU/USD/BTC oracle for hybrid economy.

### `daoPrimitives` — Primitivos DAO Asimilados

**Ley I**: Token categories include governance (not financial), utility (access), earning (contribution) — **non-financial tokens protect base social** from financialization.

**Ley II**: Bonding curves = incentive design for AUT (align individual→collective). Permissionless DAO = CDS via low barrier entry.

**Ley III**: Smart contract governance = embedded, auditable rules. Conviction voting = skin-in-the-game (cost increases with conviction). Analytics dashboard = real-time feedback (lucidity).

**CaaS**: Token categories map to CaaS credit types: governance→voting credits, utility→access credits, earning→contribution credits, market→exchange credits.

---

## Vasos Comunicantes Cross-Repo (Módulo HSCSG ↔ Conexión ↔ Vaso Comunicante)

| Módulo HSCSG | Conexión DAO/OVN Document | Vaso Comunicante (Primitivo CaaS) |
|--------------|---------------------------|-----------------------------------|
| `daoOvnBridge.synthesis` | Complementarity thesis (process + incentives) | `zeitnus-handshake` (Capa 0 genera ambas capas) |
| `daoOvnBridge.comparison` | 8-dimension comparison matrix | `autonomy-guard` (viability thresholds) |
| `daoOvnBridge.contributionModels` | Token-centric vs process-centric | `caas-credits` (hybrid earning/spending) |
| `daoOvnBridge.governanceModels` | Algorithmic vs stigmergic | `governance-triads` (base-3 + quadratic) |
| `daoOvnBridge.custodianPattern` | Liability absorption (both) | `identity-rao` (custodian as RAO delegate) |
| `daoOvnBridge.materialityBridge` | DAO digital vs OVN physical (NRP) | `autonomy-guard.physicalAssets` + `valNetAccounting.nrpCas` |
| `daoOvnBridge.exchangeBridge` | DAO AMM/DAO2DAO vs OVN exchange firms | `zeitnusHandshake.marketBridge` (ethical exchange) |
| `daoOvnBridge.scalability` | Simple ops (DAO) vs complex (OVN) | `consensus-gossip` (simple mesh) + `pipeline-anidado` (complex) |
| `daoOvnBridge.ostromEncoding` | 8 principles → smart contracts | `governance-triads` (Ostrom → base-3 verification) |
| `daoOvnBridge.transparencyGap` | DAO partial vs OVN radical | `zeitnusHandshake.lucidityProtocol` (handshake as transparency act) |
| `ovnGovernance.fourLevelsExtended` | Project → Open-enterprise → Network → Global | `zeitnus-handshake.federation` (Capa 0 → mitosis) |
| `ovnGovernance.criticalPath` | Initial conditions for viability | `autonomy-guard.criticalPath` (readiness check) |
| `ovnGovernance.dormantFork` | Dormant ventures + fork/remix | `zeitnusHandshake.mitosisProtocol` (replication) |
| `ovnGovernance.valueEquation` | Matching problem, disconnect money | `valNetAccounting.valueEquation` + `value-dual` |
| `ovnGovernance.benefitRedistribution` | Contribution-based (not token) | `caas-credits.benefitRedistribution` |
| `valNetAccounting.valueEquationCore` | Attribution in workflow/supply chain | `zeitnusHandshake.attributionProtocol` |
| `daoPrimitives.tokenCategories` | Governance/utility/earning/market tokens | `caas-credits.tokenTypes` (4 credit types) |
| `daoPrimitives.bondingCurve` | Incentive design via bonding curves | `caas-credits.bondingCurveIncentives` |
| `daoPrimitives.dao2dao` | DAO2DAO, AMM, TheGraph patterns | `consensus-gossip.crossNetwork` (inter-network sync) |
| `daoPrimitives.smartContractGov` | Commons Stack patterns | `governance-triads.embeddedGovernance` |
| `daoPrimitives.permissionlessDAO` | Token ownership + participation + voting | `ovnGovernance.openMembership` + `daoOvnBridge.custodianPattern` |

---

## Decisiones EBD (D1-D8) con Evidencia Primaria

| Decisión | Evidencia Primaria (Documento) | Módulo Afectado |
|----------|-------------------------------|----------------|
| **D1: DAO/OVN complementarity = arquitectura bicapa Zeitnus** | "process + incentives. Developing one from the other is not the right approach... both approaches will lead to a model that corroborates reality to some degree. The starting point is important. DAOs and OVNs are complementary and should work together." | `daoOvnBridge.synthesis.ts` + `zeitnus-handshake.ts` (Capa 1 + Capa 2) |
| **D2: 8-dimension comparison = decision framework para viabilidad nodo** | Table: Openness, Transparency, Critical Mass, Materiality, Scalability, Adaptability, Vitality, Sustainability — con valores concretos DAO vs OVN | `daoOvnBridge.comparison.ts` + `autonomy-guard.ts` |
| **D3: Contribution model hybrid = CaaS earning/spending** | "At the core lies NRP-CAS... puts all resources on same level... non-transactional economic model" (OVN) vs "Token-centric... financialization of economy... transactional economic model" (DAO) | `daoOvnBridge.contributionModels.ts` + `caas-credits.ts` |
| **D4: Governance hybrid = triadas base-3 + quadratic + benefit redistribution** | DAO: "mostly embedded, algorithmic... token voting". OVN: "mostly unembedded... relies heavily on stigmergic... benefit redistribution algorithm based on contributions" | `daoOvnBridge.governanceModels.ts` + `governance-triads.ts` + `ovnGovernance.benefitRedistribution` |
| **D5: Custodian pattern = legal bridge para CaaS external interface** | "In both cases external liability is absorbed by the Custodian" (DAO Wyoming/US general partnership; OVN Canada non-registered association Quebec 2267) | `daoOvnBridge.custodianPattern.ts` + `identity-rao.ts` |
| **D6: Materiality bridge = NRP-CAS para Zeitnus physical production** | "Designed for material peer production. The NRP handles an inventory of material assets, including physical spaces." (OVN) vs "Mostly applied to digital production, do not handle physical assets and processes." (DAO) | `daoOvnBridge.materialityBridge.ts` + `valNetAccounting.nrpCas.ts` + `autonomy-guard.physicalAssets` |
| **D7: Exchange infra bridge = Sensorica exchange firms + DAO token incentives** | DAO: "exchange infrastructure is advanced and more governance is embedded" (AMM, DAO2DAO, TheGraph). OVN: "exchange infrastructure is not yet well developed". Sensorica: exchange firms (independent, liable for ethics/quality). | `daoOvnBridge.exchangeBridge.ts` + `sensoricaOVN.ventures.ts` + `zeitnusHandshake.marketBridge` |
| **D8: Ostrom 8 principles → Zeitnus governance rules (base-3 + RCE)** | "Each of Ostrom's CPR design principles is well within the solution space afforded by blockchains and DAOs" (Rozas et al 2021). OVN: "Clearly defined boundaries... congruence... collective choice... monitoring... graduated sanctions... conflict resolution... local enforcement... layers of nested enterprises." | `daoOvnBridge.ostromEncoding.ts` + `governance-triads.ts` (base-3 = nested enterprises) |

---

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `daoOvnBridge.synthesis` | • Process layer (OVN) + Incentive layer (DAO) both present<br>• Handshake generates both layers (not assumes)<br>• Neither layer functional alone (test isolation) | `daoOvnBridge.synthesis.test.ts` |
| `daoOvnBridge.comparison` | • 8 dimensions scored for any node<br>• Viability threshold: ≥6/8 dimensions met<br>• Materiality + Exchange infra = required for Zeitnus | `daoOvnBridge.comparison.test.ts` |
| `daoOvnBridge.contributionModels` | • Token-centric tracking (DAO)<br>• Process-centric tracking (OVN NRP-CAS)<br>• Hybrid earning: contribution + token incentives<br>• Hybrid spending: access + token utility | `daoOvnBridge.contributionModels.test.ts` |
| `daoOvnBridge.governanceModels` | • Algorithmic governance (smart contracts)<br>• Stigmergic coordination (signals)<br>• Quadratic voting (intensity-weighted)<br>• Benefit redistribution (contribution-based) | `daoOvnBridge.governanceModels.test.ts` |
| `daoOvnBridge.custodianPattern` | • Liability absorption verified<br>• Custodian RAO delegation<br>• External interface functional | `daoOvnBridge.custodianPattern.test.ts` |
| `daoOvnBridge.materialityBridge` | • NRP tracks physical assets/spaces<br>• Digital-only DAO gap detected<br>• Bridge: Zeitnus material production tracked | `daoOvnBridge.materialityBridge.test.ts` |
| `daoOvnBridge.exchangeBridge` | • Exchange firms (Sensorica pattern) operational<br>• DAO token incentives (AMM/bonding curve) integrated<br>• Ethical/quality standards gate enforced | `daoOvnBridge.exchangeBridge.test.ts` |
| `daoOvnBridge.scalability` | • Mesh gossip (simple ops) functional<br>• NRP-CAS (complex ops) functional<br>• Tradeoff documented and managed | `daoOvnBridge.scalability.test.ts` |
| `daoOvnBridge.ostromEncoding` | • 8 Ostrom principles → governance rules<br>• Base-3 verification = nested enterprises<br>• Graduated sanctions implemented | `daoOvnBridge.ostromEncoding.test.ts` |
| `daoOvnBridge.transparencyGap` | • DAO partial transparency detected<br>• OVN radical transparency enforced<br>• Gap closure protocol active | `daoOvnBridge.transparencyGap.test.ts` |
| **Extensiones Módulos Previos** | | |
| `ovnGovernance.fourLevelsExtended` | • 4 levels instantiable with global legal<br>• Critical path viability check<br>• Dormant venture reanimation works<br>• Fork/remix venture functional | `ovnGovernance.extended.test.ts` |
| `ovnGovernance.valueEquation` | • Matching problem formulation<br>• Money/value distribution disconnected<br>• Attribution in workflow verified | `ovnGovernance.valueEquation.test.ts` |
| `ovnGovernance.benefitRedistribution` | • Algorithm based on contributions (not tokens)<br>• Redistribution transparent and auditable | `ovnGovernance.benefitRedistribution.test.ts` |
| `valNetAccounting.valueEquationCore` | • Attribution integrated in production workflow<br>• Supply chain tracking functional | `valNetAccounting.valueEquationCore.test.ts` |
| `daoPrimitives.tokenCategories` | • 4 token types: governance, utility, earning, market<br>• Map to 4 CaaS credit types<br>• Non-financial tokens protected | `daoPrimitives.tokenCategories.test.ts` |
| `daoPrimitives.bondingCurve` | • Incentive alignment via bonding curve<br>• Individual→collective AUT verified | `daoPrimitives.bondingCurve.test.ts` |
| `daoPrimitives.dao2dao` | • Cross-network sync pattern functional<br>• AMM pattern for token exchange | `daoPrimitives.dao2dao.test.ts` |
| `daoPrimitives.smartContractGov` | • Commons Stack 4 components integrated<br>• Conviction voting skin-in-the-game<br>• Real-time analytics dashboard | `daoPrimitives.smartContractGov.test.ts` |
| `daoPrimitives.permissionlessDAO` | • Barrier-to-entry: token + participation + voting<br>• Custodian pattern for liability | `daoPrimitives.permissionlessDAO.test.ts` |

---

## Plan Implementación Archivo por Archivo

### Fase 3.1 — Tipos (`src/core/state/`)

**`daoOvnBridge.ts`** (NUEVO — Core Zeitnus)
```typescript
interface DAOOVNComplementarity {
  processLayer: OVNProcessLayer;      // NRP-CAS, stigmergic, 4-level, value equation
  incentiveLayer: DAOIncentiveLayer;  // tokenomics, algorithmic gov, bonding curves
  synthesis: HybridSovereignty;       // both generated by handshake (Capa 0)
}

interface ComparisonMatrix {
  openness: DimensionScore;           // OVN: always required; DAO: not necessary
  transparency: DimensionScore;       // OVN: required; DAO: not total
  criticalMass: DimensionScore;       // OVN: 50 affiliates; DAO: membership drives
  materiality: DimensionScore;        // OVN: designed for material; DAO: digital only
  scalability: DimensionScore;        // OVN: sophisticated infra; DAO: minimal
  adaptability: DimensionScore;       // OVN: stigmergic; DAO: immutable contracts
  vitality: DimensionScore;           // both: engagement problems
  sustainability: DimensionScore;     // OVN: 10+ years, dormant/fork; DAO: processes outside
}

interface ContributionModelBridge {
  tokenCentric: DAOContributionModel;     // financialization, transactional
  processCentric: OVNContributionModel;   // all resources same level, non-transactional
  hybrid: HybridContributionModel;        // CaaS earning/spending synthesis
}

interface GovernanceModelBridge {
  algorithmic: DAOGovernance;         // smart contracts, token voting, Commons Stack
  stigmergic: OVNGovernance;          // signals, interaction, true p2p
  hybrid: ZeitnusGovernance;          // triadas base-3 + quadratic + benefit redistribution
}

interface MaterialityBridge {
  digitalOnlyGap: boolean;            // DAO limitation detected
  nrpPhysicalTracking: NRPPhysicalAssets; // OVN capability
  zeitnusMaterialProduction: boolean; // Zeitnus requirement met
}
```

**`daoPrimitives.ts`** (NUEVO)
```typescript
interface DAOTokenCategories {
  governance: TokenSpec;    // voting weight, not financial
  utility: TokenSpec;       // access to services/products
  earning: TokenSpec;       // contribution rewards
  market: TokenSpec;        // tradable, exchange value
}

interface BondingCurveIncentives {
  curveType: 'linear'|'exponential'|'sigmoid'|'custom';
  alignmentMetric: number;        // individual→collective AUT
  skinInTheGame: boolean;         // cost increases with conviction
}

interface DAO2DAOPatterns {
  amm: boolean;              // Automated Market Makers for tokens
  thegraph: boolean;         // interoperability indexing
  crossNetworkSync: GossipSync; // pattern for cross-DAO sync
}

interface SmartContractGovernancePatterns {
  augmentedBondingCurve: boolean;  // Commons Stack: fundraising
  givethDApp: boolean;             // fund allocation
  convictionVoting: boolean;       // decision-making with skin-in-game
  analyticsDashboard: boolean;     // real-time feedback (cadCAD)
}
```

**Extender `ovnGovernance.ts`** (de asimilación Sensorica previa):
```typescript
// Añadir:
interface FourLevelsExtended {
  globalLegal: GlobalLegalStructures;  // permanent global, network level, enterprise level
  criticalPath: CriticalPathViability; // initial conditions + basic requirements
  dormantFork: DormantForkCapability;  // ventures dormant → reanimated, fork/remix
  valueEquation: ValueEquationMatching; // distribution → matching problem
  benefitRedistribution: BenefitAlgorithm; // contribution-based (not token)
}
```

**Extender `valNetAccounting.ts`** (de asimilación Sensorica previa):
```typescript
// Añadir:
interface ValueEquationCore {
  matchingProblem: boolean;           // reformulate distribution
  moneyValueDisconnect: boolean;      // disconnect money from value distribution
  attributionInWorkflow: boolean;     // integrated in production workflow + supply chains
  evolutionPath: 'sheets'|'blockchain'|'holochain'|'zeitnus'; // historical path
}
```

### Fase 3.2 — Lógica Pura (`src/core/lib/`)

**`daoOvnBridge.ts`**
- `synthesizeLayers(processLayer, incentiveLayer)` → HybridSovereignty (handshake generates)
- `scoreComparisonMatrix(node)` → 8-dimension viability score
- `bridgeContributionModels(daoContribs, ovnContribs)` → HybridContributionModel
- `bridgeGovernanceModels(daoGov, ovnGov)` → ZeitnusGovernance (triadas + quadratic + redistribution)
- `detectMaterialityGap(node)` → MaterialityBridge (NRP tracking required)
- `bridgeExchangeInfra(exchangeFirms, daoIncentives)` → MarketBridge
- `encodeOstromPrinciples()` → GovernanceRules (base-3 = nested enterprises)
- `detectTransparencyGap(node)` → TransparencyGapReport + closure protocol

**`daoPrimitives.ts`**
- `categorizeToken(token)` → DAOTokenCategories (governance/utility/earning/market)
- `designBondingCurve(alignmentTarget)` → BondingCurveIncentives
- `mapTokenToCaaSCredit(tokenCategory)` → CaaSCreditType (voting/access/contribution/exchange)
- `extractDAO2DAOPatterns()` → DAO2DAOPatterns (AMM, TheGraph, gossip sync)

**`ovnGovernance.ts`** (extender)
- `checkCriticalPathViability(node)` → CriticalPathViability
- `reanimateDormantVenture(ventureId)` → DormantForkCapability
- `forkRemixVenture(sourceVenture, newConfig)` → DormantForkCapability
- `formulateValueEquation(resources, contributions)` → ValueEquationMatching
- `calculateBenefitRedistribution(contributions)` → BenefitAlgorithm

**`valNetAccounting.ts`** (extender)
- `integrateAttributionInWorkflow(process, supplyChain)` → ValueEquationCore
- `traceEvolutionPath(currentImplementation)` → evolution path tracking

### Fase 3.3 — Store (`src/core/state/store.ts`)
- Import `daoOvnBridge`, `daoPrimitives` types + logic
- Extend `ovnGovernance`, `valNetAccounting` states
- Actions: `synthesizeLayers`, `scoreViability`, `bridgeContributions`, `bridgeGovernance`, `detectGaps`, `encodeOstrom`, `categorizeToken`, `designBondingCurve`, `checkCriticalPath`, `reanimateVenture`, `forkVenture`, `formulateValueEquation`, `calculateRedistribution`
- `resetAll`: incluye nuevos estados
- `partialize`: incluye nuevos estados (2 ubicaciones)

### Fase 3.4 — Pantallas (`src/app/screens/`)

**`DAOOVNBridge.tsx`** — Icon: `GitMerge` (synthesis) — **PANTALLA CORE ZEITNUS**
- Tabs: Síntesis (Process+Incentive) | Matriz Viabilidad (8 dim) | Contribuciones Híbridas | Gobernanza Híbrida | Gaps (Materialidad, Exchange, Transparencia) | Ostrom Encoding | Handshake Generativo

**`DAOPrimitives.tsx`** — Icon: `Coins` (tokens)
- Tabs: Categorías Token (4 tipos) | Bonding Curves | DAO2DAO Patterns | Smart Contract Gov | Permissionless DAO

**`OVNGovernanceExtended.tsx`** — Icon: `GitBranch` (extendido)
- Tabs: 4 Niveles + Legal | Critical Path | Dormant/Fork | Value Equation | Benefit Redistribution

### Fase 3.5 — Nav + Rutas
- `src/app/layout/Aside.tsx`: añadir `GitMerge`, `Coins` a imports lucide
- Items: `{ key: 'dao-ovn-bridge', label: 'DAO↔OVN Bridge', icon: GitMerge, color: 'indigo', path: '/dao-ovn-bridge' }`, `{ key: 'dao-primitives', label: 'DAO Primitives', icon: Coins, color: 'amber', path: '/dao-primitives' }`
- `src/app/App.tsx`: 2 rutas nuevas

### Fase 3.6 — Handshake Integration (`src/core/lib/zeitnusHandshake.ts` — extender)

**Capa 1 (Gobernanza Base-3) ← DAO/OVN Synthesis**:
- `daoOvnBridge.synthesizeLayers()` genera ambas capas desde handshake
- Triadas base-3 = Ostrom "nested enterprises" (System 3 VSM)
- Quadratic voting = DAO token voting + OVN contribution-weighting
- Benefit redistribution = OVN algorithm + DAO incentive alignment

**Capa 2 (Malla Hiperbólica) ← Materiality + Exchange Bridge**:
- NRP-CAS physical tracking (OVN) + Mesh gossip (simple ops, DAO-like)
- Exchange firms (Sensorica) + AMM/bonding curves (DAO) = ethical market bridge
- Atomic confirmation 100% = DAO smart contract enforcement + OVN process verification

**Capa 0 (Handshake Generativo) ← Complementarity as Generative Act**:
- Handshake NO assumes layers exist — **generates them** via mutual transformation
- Process layer learns incentive alignment; Incentive layer learns process sophistication
- Critical path viability = handshake readiness check
- Mitosis replicates complementarity protocol (not just form)

---

## Referencias

**Documento Principal**:
- "DAOs for getting things done: The intersection of Open Value Networks and DAOs" — Steve Michel, Tibi et al., Jan 16, 2022 (Google Doc colaborativo Sensorica)

**Referencias Internas del Documento**:
- OVN Wiki: http://ovn.world / https://wiki.p2pfoundation.net/Open_Value_Network
- Sensorica: https://www.sensorica.co / https://wiki.p2pfoundation.net/Sensorica
- ValNet: https://github.com/valnet/valuenetwork / https://wiki.p2pfoundation.net/ValNet
- Mikorizal: https://mikorizal.org / https://wiki.p2pfoundation.net/Mikorizal_Software
- Ostrom Principles + Blockchain: Rozas, Tenorio-Fornés et al 2021 (https://medium.com/commonsstack/automating-ostrom-for-effective-dao-management-cfe7a7aea138)
- Commons Stack: Augmented Bonding Curve, Giveth DApp, Conviction Voting, Analytics Dashboard
- SourceCred / AraCred: https://sourcecred.io/docs/ / page ranking algorithms
- DisCO: https://disco.coop/manifesto/ (Cooperative Feminist Economic DAO)
- DeepDAO: https://deepdao.io (150+ DAOs dashboard)
- Bettermeans / Open Enterprise Manifesto (archive.org)
- Verna Allee Value Networks, Yochai Benkler CBPP, Michel Bauwens, Clay Shirky

**Asimilaciones Previas Relacionadas**:
- `docs/sensorica_ovn_valnet_backup.md` + `_integration.md` (Sensorica/OVN/ValNet/Mikorizal)
- `docs/ZEITNUS_UMBRAL_72H_PARADIGMA_HABITADO.md` v15.1 (Handshake Generativo Capa 0)
- `docs/veritas_villages_backup.md` + `_integration.md` (DAO quadratic voting, Bitcoin standard)

**Zeitnus Arquitectura**:
- Capa 0: Handshake Generativo (este documento valida la necesidad de ambas capas)
- Capa 1: Gobernanza Base-3 (Triadas + RCE + Quadratic + Redistribution)
- Capa 2: Malla Transaccional Hiperbólica (Ciclos 3-nodos + Atomic + NRP-CAS)
- CaaS Primitives: `caas-credits`, `governance-triads`, `value-dual`, `autonomy-guard`, `consensus-gossip`, `identity-rao`

---

## Notas de Asimilación (Copyright)

- **Documento colaborativo Sensorica**: Contenido abierto, fair use para análisis/asimilación. No se copia texto extensivo — solo hechos, frameworks, tablas comparativas, principios.
- **Citas textuales**: Mínimas, con atribución (ej. tablas comparativas, definiciones clave).
- **Conceptos universales**: Ostrom principles, stigmergy, CBPP, VSM, bonding curves, quadratic voting — dominio público / conocimiento compartido.
- **Implementaciones específicas 2022** (Aragon, Moloch, 1Hive, SourceCred, Wyoming DAO law): Documentadas como **legacy/histórico** — no se asimila código, solo patrones.
- **Próximo paso**: Implementar `daoOvnBridge` (core), `daoPrimitives`, extender `ovnGovernance`/`valNetAccounting` + handshake integration + verificar tsc/build/rutas 200.