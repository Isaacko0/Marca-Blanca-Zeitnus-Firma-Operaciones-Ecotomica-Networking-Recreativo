# DAOs vs OVNs: Intersection Analysis — Backup de Asimilación

**Fuente**: "DAOs for getting things done: The intersection of Open Value Networks and DAOs" por Steve Michel, Tibi et al. (Jan 16, 2022)  
**Contexto**: Documento colaborativo Sensorica/OVN comparando DAOs y OVNs  
**Fecha asimilación**: 2026-11-07  
**Licencia**: Contenido abierto Sensorica/OVN (fair use para análisis/asimilación)

---

## Resumen Ejecutivo

Documento fundacional (2022) que **compara sistemáticamente DAOs y OVNs** — dos paradigmas organizacionales emergentes para producción entre pares (CBPP). Escrito desde **dentro del ecosistema Sensorica/OVN** (Tibi = co-fundador Sensorica), con conocimiento profundo de ambos mundos.

**Tesis central**: DAOs y OVNs son **complementarios**, no competidores. DAOs = incentive-centric (tokenización); OVNs = process-centric (contabilidad contribución + NRP-CAS). Juntos cubren: incentivos + procesos sofisticados.

---

## Secciones Clave del Documento

### 1. Introduction to DAOs
- DAOs emergieron ~2017 (5 años antes del doc) como método organizar/financiar/administrar allocations en frameworks determinísticos
- **CBPP (Commons-Based Peer Production)** — Yochai Benkler — precede a DAOs, base para OVNs
- **Ostrom principles** (8) pueden codificarse en smart contracts (Rozas et al 2021)
- Tensión: VC libertarian DeFi vs "BlockChain Socialist" — pero dicotomía izquierda/derecha irrelevante; conflicto real = centralización/poder vs descentralización/libertad
- En p2p: no oposición individuo-comunidad; más autonomía refuerza comunidad

### 2. CBPP and OVN Overview
**Definición OVN** (OVN Wiki):
- **Social**: organización compleja, valores/normas reciprocidad/confianza emergen
- **Económica**: agentes colaboran abierta/transparente, beneficios proporción contribución
- **Sistema dinámico complejo**: estructura emergente (no impuesta), Critical Path = condiciones iniciales + requisitos básicos

**Genealogía OVN**:
- 2008-2010: Discovery Network model (Tibi)
- 2011: Sensorica fundada, modelo desarrollado (Tibi, Steve, Kurt, Bayle)
- Influencias: Verna Allee, Yochai Benkler, Michel Bauwens, Clay Shirky
- 2012: NRP-CAS influenciado por Bob Haugen (resource planning desde 1995)
- 2013: Yasir Siddiqui desarrolla framework OVN
- 2016: NOICE/Verdun project (segunda tentativa escalar OVN)
- Organizaciones similares: CoMakery, CollectiveOne, Scuttlebutt

**OVN Redressa Flaws CBPP**: Captura insostenible valor open source por corporate private interest → OVN captura y comparte internamente

**Arquitectura OVN (4 niveles)** [Yasir Siddiqui 2013]:
1. **Project-level** — permissionless, flat, stigmergic coordination
2. **Open-enterprise level** (inter-project) — ventures, exchange firms
3. **Network level** (inter-enterprise) — network commons, governance
4. **Global level** (inter-network) — global governance, legal structures

**Value Cycle + Value Equation** [Yasir Siddiqui 2014]:
- Reformula value distribution → matching problem
- Desconecta money/exchange value de value distribution
- Primera vez: attribution system integrado en production workflow + supply chains
- Implementaciones: Google Sheets → blockchain (kombit.ca) → holochain (copiosis.com alpha)

### 3. DAO Affordances
- DAOs desarrollan tools para CBPP: recording contributions, open source mechanisms
- **SourceCred** (promising): protocol algorithm → "Cred" score basado en value brought to project
- **AraCred**: page ranking algorithms para contributor score
- DAOs ≈ OVN specification basic form (pero ¿reemplazan legacy structures?)

**Limitaciones DAOs por scalar type**:
- **Basic DAO (2016)**: virtual board of directors, flat, voting on proposals, multisig treasury
- **Creative guild freelancer DAOs**: tokens para account/incentivize, membership via token purchase
- **Complex DAOs**: 1Hive = swarms/working groups (staff-line), Orca = Pods (autonomous groupings)
- **Problema**: "projects that solve well defined problem/deliverables better use case for DAO than continuous services and production"
- **Legal wrapper necesario**: LinksDAO (incorporated company), Coops = closer match pero lack economic paradigm shift
- **Costos blockchain**: storage/computation cost prohibitive para operational costs comunitarios → necesitan IPFS, Substrate, Discord, centralized servers
- **Cita clave** (@JonathanHillis): "Blockchains are better immutable public ledgers, not more efficient databases. Ethereum is a better shared state computer, not a more performant CPU. DAOs are better for emergent coordination among strangers, not single-focused execution."

**Definiciones DAO**:
- Jack du Rose: "decentralized application which incentivises users to engage in activity which furthers its agreed business objectives by enabling them to work together without requiring them to trust one another"
- DiRose & Mansouri: "virtual entity comprised of large number of individual actors that respond according to well-defined set of rules... organized by broad social structure that constitutes 'governance'"
- **Realidad**: Discord hangouts + voting protocols + token economics; blockchain focus = governance/rules/incentives; real action en Discord channels
- **Convergencia**: DAOs adoptaron concepto OVN "Socializing work" en public channels

### 4. Are DAOs Parts or Missing Parts?
- DAOs = engineering approach: designing game to incentivize behavior
- OVNs = frame/model, no prescriben game específico; ventures pueden remix/create new game
- **OVN = ecosistema**: ventures interconnect íntimamente, valuables fluyen libremente
- **DAOs**: no real discussion sobre flow resources entre DAOs más allá de crypto tokens
- DAOs tienen underlying ecosystem: smart contract libraries, DAO2DAO protocols, AMMs, TheGraph — pero no structure para sophisticated project management, division of labor, accounting methodology

### 5. OVN and DAOs (Comparison Table - High Level)

| Dimension | DAO (Standard) | OVN |
|-----------|----------------|-----|
| **Openness** | Not necessary/always | Always, by definition. Cannot function well otherwise. |
| **Transparency** | Not total. Some ops secluded. Discord not public/default on-chain. | Required, transparent by definition. Cannot function well otherwise. |
| **Critical Mass** | No but membership drives | Minimum 50 affiliates to function well. |
| **Materiality** | Mostly digital production. Don't handle physical assets/processes. Exchange infra advanced, more governance embedded. | **Designed for material peer production**. NRP handles inventory material assets including physical spaces. Exchange infra not yet well developed, governance not yet embedded. |
| **Scalability** | Minimal infra to scale (simple ops). | Sophisticated infra needed (complex ops, physical+digital coordination). |
| **Adaptability** | Smart contracts immutable by default, forkable/upgradable via voting. | Driven by stigmergy, less dependent on planning/central decision-making → more adaptive. |
| **Vitality** | Engagement/quorum frequent problem. | Engagement problems. Animator role important, sometimes missing. |
| **Sustainability** | Less focus on processes. No language to model economic processes → processes happen outside DAO, info captured outside. | **10+ years existence**. Emphasis on processes/documentation → deposited info. Ventures can go dormant, reanimated later. Ability to fork/remix open ventures. |
| **Topology** | Workflow varies. | (pendiente) |

### 6. Contributions Comparison

| Aspecto | DAO | OVN |
|---------|-----|-----|
| **Tracking** | External tools | **NRP-CAS** (integrated) |
| **Model** | **Token-centric** → financialization of economy. Focus financial contributions. Subsumes all resources to financial capital. Transactional economic model. | **Process-centric**. NRP-CAS puts ALL resources same level: financial = time/talent = materials = space = equipment = social capital. **Non-transactional economic model** — amalgamation various contributions, transactions only at market level. |
| **Core** | Bonding curve = incentives | **NRP/REA ontology = processes** (production, etc.) |

### 7. Governance Comparison

| Aspecto | DAO | OVN |
|---------|-----|-----|
| **Embedding** | Mostly embedded, algorithmic. Smart contracts, token voting (Commons Stack, Hypha/SEEDS). | **Mostly unembedded yet**. No barrier to embed more. Relies heavily on **stigmergy**, interaction, true p2p. |
| **Distribution** | Based on **token holding** (seen as investment). | Distributed as **benefit** through **benefit redistribution algorithm** based on **contributions**. |

### 8. Legal Status

| Jurisdicción | DAO | OVN (Sensorica) |
|--------------|-----|-----------------|
| **US** | Wyoming first to recognize DAO as legal entity. Often uncertain standing → functionally general partnership. | General partnership can be applied. |
| **Canada** | — | **Non-registered association** (Quebec Civil Code §2267). |
| **Liability** | External liability absorbed by Custodian. | External liability absorbed by Custodian. |

### 9. Conclusion
- Complementarity: **process + incentives**. Desarrollar uno desde otro = wrong approach (como explicar sistema solar con sol vs tierra en centro).
- **Achilles heel complementario**: DAOs over-dependence on tokens complementa OVNs CAS con 'map reduce' de network accounting complejo; OVNs stigmergic stack unburden DAOs from project execution/functional complexity.
- **Convergencia fuerte** hacia colaboración (Reimagine Wealth Initiative + Gitcoin GR13).

---

## Metodología Colaborativa (del documento)

**Proceso de escritura colaborativa** (tested/proven):
1. **Build Shared Understanding** (10-30% tiempo) — metalenguaje compartido, definiciones, contexto
2. **Clarifications** (ongoing) — Q&A, anticipar misunderstandings, no bias
3. **Research** (10-30%) — internet mining, Diigo Sensorica knowledge group
4. **Structure** (20-30%) — 3 capas: Thematic (what), Pragmatic (achieve), Logical/Emotional (prove/feel)
5. **Impact** (2-5%) — viral aspects, incentive mechanisms para key actors
6. **Style, Tone** (2-5%) — "report from blockchain Dark Forest: map terrain, dangers, way forward"
7. **Writing** (≤5% tiempo) — al final, solo forma, no goal/content/strategy

**Herramientas señalización**: process/status, notes, important info, ToDos, Alternatives, Reasoning, Information, Growing Consensus

---

## Referencias Citadas en Documento

- CBPP Wikipedia, Governing the Commons (Ostrom 1990)
- When Ostrom Meets Blockchain (Rozas, Tenorio-Fornés et al 2021)
- DisCO (disco.coop/manifesto) — Cooperative Feminist Economic DAO alternative
- Everything You Need to Know About DAOs (hackernoon)
- What Co-Ops and DAOs Can Learn From Each Other (fwb.help)
- DeepDAO Dashboard (150+ DAOs)
- Forbes: What are DAOs (Cathy Hackl 2021)
- The Permissionless DAO (Token Engineering Commons)
- Remote Voting in Age of Cryptography (MIT Law)
- Future of Governance Is In The Cloud (altgov.io)
- Is Future of Corporations Decentralised? (Poltorak 2021)
- Reinventing Commons Governance (Bollier 2021)
- Policy Proposals for Crypto Protocols (Schneider 2022)
- Sensorica OVN Q&A, OVN Value System, OVN Framework paper (Yasir/Tibi 2013)
- Composability in/between Organizations (boundaryless.io)

---

## Tags para Indexación

`dao` `ovn` `open-value-network` `cbpp` `commons-based-peer-production` `sensorica` `nrp-cas` `value-accounting` `stigmergy` `sourcecred` `aracred` `quadratic-voting` `commons-stack` `hypha` `seeds` `ostrom-principles` `elinoor-ostrom` `governing-the-commons` `dao2dao` `amm` `thegraph` `bonding-curve` `token-engineering` `financialization` `process-centric` `incentive-centric` `material-peer-production` `digital-peer-production` `reimagine-wealth` `gitcoin` `legal-wrapper` `custodian` `non-registered-association` `general-partnership` `wyoming-dao` `quebec-civil-code-2267` `collaborative-writing-methodology` `crowdthinking` `shared-understanding`