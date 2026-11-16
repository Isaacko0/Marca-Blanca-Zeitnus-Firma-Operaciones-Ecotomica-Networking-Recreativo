# OVNi 3.0 - IT, Next Gen NRP — Backup Completo

**Fecha de asimilación**: 2026-11-07  
**Fuente**: `Downloads/documentos HSCSG/OVNi 3.0 - IT, Next Gen NRP.bilingual.md`  
**Licencia**: Co-creation document, Content rules aplicables  
**Repositorio destino**: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo  
**Nota**: Documento en desarrollo, necesita limpieza periódica. Proyecto OVNi más avanzado 2026: **Nondominium**.

---

## Tabla de Contenidos

1. [Orientation](#orientation)
2. [Funding Efforts](#funding-efforts)
3. [Methodology](#methodology)
4. [Todos](#todos)
5. [Context of Application](#context-of-application)
6. [Development Methodology](#development-methodology)
7. [Some High Level Ideas](#some-high-level-ideas)
8. [The Scalability Trilemma](#the-scalability-trilemma)
9. [The State of the Art](#the-state-of-the-art)
10. [Application Level](#application-level)
    - [High Level General Requirements](#high-level-general-requirements)
    - [Current NRP Considerations](#current-nrp-considerations)
    - [Issues with Current NRP and Next Gen NRP](#issues-with-current-nrp-and-next-gen-nrp)
11. [Structured & Standardized Interoperability](#structured--standardized-interoperability)
12. [OVN Genesis](#ovn-genesis)
    - [Options](#options)
    - [Definitions](#definitions)
    - [Tokenization](#tokenization)
    - [Bitcoin Style Genesis](#bitcoin-style-genesis)
13. [Arbitration](#arbitration)
14. [Stack](#stack)
15. [Access Layer](#access-layer)
    - [Digital Identities](#digital-identities)
    - [Agent Profile](#agent-profile)
    - [Access](#access)
    - [Trust, Accountability, Robustness and Certification](#trust-accountability-robustness-and-certification)
16. [Use Case Layer](#use-case-layer)
    - [Data Management](#data-management)
    - [Database](#database)
    - [Physical Location Validation](#physical-location-validation)
    - [Geolocation](#geolocation)
    - [Registries](#registries)
    - [Needs/Offers Matching](#needsoffers-matching)
    - [Prediction Market](#prediction-market)
    - [AI-based Strategy](#ai-based-strategy)
    - [Personal Working Space](#personal-working-space)
    - [Investment](#investment)
    - [Solidarity Mechanisms](#solidarity-mechanisms)
    - [Education](#education)
17. [Infrastructure Layer](#infrastructure-layer)
    - [Contract](#contract)
    - [Current-see for Use-Value](#current-see-for-use-value)
    - [p2p Exchange System](#p2p-exchange-system)
    - [About Distribution Systems](#about-distribution-systems)
    - [Transaction System](#transaction-system)
    - [Token-based Transaction Systems](#token-based-transaction-systems)
    - [Non-token based Transaction Systems](#non-token-based-transaction-systems)
    - [Non-market-based Distribution Systems](#non-market-based-distribution-systems)
    - [Merit-based Distribution Systems](#merit-based-distribution-systems)
    - [Non-binary Transaction Systems](#non-binary-transaction-systems)
    - [Communication System](#communication-system)
    - [Reputation System](#reputation-system)
    - [Governance and Consensus](#governance-and-consensus)
18. [Protocol Layer](#protocol-layer)
    - [Contribution Assessment Protocol](#contribution-assessment-protocol)
    - [About Ledgers](#about-ledgers)
    - [Lifecycle Management](#lifecycle-management)
    - [Sensorica's Core Capabilities / Contributions](#sensoricas-core-capabilities--contributions)
19. [Legal Considerations](#legal-considerations)
20. [Ethos](#ethos)
    - [Trust](#trust)
21. [UI / UX Development](#ui--ux-development)
22. [Other Features](#other-features)
    - [Network-to-network Interfaces](#network-to-network-interfaces)
    - [Lists](#lists)
    - [Behavioral/motivational Snags](#behavioralmotivational-snags)
    - [Templates](#templates)
    - [Mote on Collective Intelligence](#mote-on-collective-intelligence)
    - [Manipulate Data at Resource Level](#manipulate-data-at-resource-level)
    - [Logs in the NRP-CAS](#logs-in-the-nrp-cas)
23. [List of p2p Projects](#list-of-p2p-projects)
24. [Appendix A - Some Terms of Reference](#appendix-a---some-terms-of-reference)
25. [Tim & Chas NRP Call Apr 3](#tim--chas-nrp-call-apr-3)
26. [Miscellaneous](#miscellaneous)

---

## Orientation {#orientation}

**Use this box to build shared understanding.**

**Log your contributions**: [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSeW4OigEN72aioByDVPw4ONBWjmmTo5UFD6B4fpYqBHtYNxdQ/viewform)

**Past contributions**: [HERE](http://nrp.sensorica.co/accounting/process/1114/)

**Where are we now?**
- Este documento está viejo y necesita revisión seria
- Nuestro proyecto OVNi más avanzado en 2026 es **Nondominium** ([sensorica.co/ventures/infrastructure/nondominium](https://www.sensorica.co/ventures/infrastructure/nondominium))
- Estructura necesita trabajo, dividir en componentes menores (ver Table of Contents)

**What Can You Do?**
1. Feed this doc to AI agent → review how Sensorica looked at Next Gen NRP years ago
2. Feed Nondominium to AI agent → compare with this doc, see progress
3. Turn into blog post of historical significance for Sensorica and OVN initiative
4. Save version, freeze in time, print PDF, place in archive folder
5. Create new version reflecting new development/thinking of Sensoricans
6. Produce short version for Holochain community and partners (new and historical)

**Formatting and structure suggestions**: Collaboration with [Holochain](https://holochain.org/) (open [Proposal to Holochain doc](https://docs.google.com/document/d/1DuU88pC5UOXLUhakAGfetcMjDKbsNTdMzQ-Da-Lo4F0/edit?usp=sharing)). Document used to coordinate between Sensorica and partners. Structure/format for easy understanding by partner organisations.

**Background**: Parte de esfuerzo long-standing para portar server-client NRP-CAS a infraestructura p2p. Budget creado, iniciativa linked to [NOICE](https://www.sensorica.co/ventures/4th-sector/NOICE).

**Consortium Structure**: Podemos crear consorcio cubriendo ángulos importantes para responder a funding calls.

| Components | Roles | Potential Partners |
|------------|-------|-------------------|
| Academia | Credibilidad, legitimidad, overview amplio, research coherente, analysis, impact assessment | p2pModels EC-funded project |
| Communities of practice | Aplicaciones concretas, real user cases, continuity, diffusion rate | Sensorica (8 años open innovation, peer production, IT infrastructure, governance, methodologies, IoT heavy industry/agriculture, scientific instruments, open science). Partner OuiShare Montreal en Verdun project (first participatory economy cluster). Bruxellium: Xavier, Pierre-Alexandre, Yannick |
| Technical expertise | Web dev, Legal, Finance/accounting, Insurance | HOLO/REA, Holochain, Valueflows |
| Other expertise | New economic models | P2P Foundation |
| Add more… | | http://openmaker.eu/, Internet of production alliance, OSSH, Partnership with p2pModels project [see Tibi] |

**Where to find possible partners**: internetscienceconference.eu, up2europe.eu, EU Projects Partner Search

**p2p platforms to look at**: Holochain (everything), FOAM (physical resource management), Steem (digital content), IOS, Dfinity (p2p cloud), afero.io (IoT), Verses (spatial web), Blockchains for social good

**How to frame the project**: supply chain problem solution, enabler emergent peer production, supporting new org forms, exit to economic freedom, thrive in dynamic complex world. Traditional framing emphasizes crowd; alternative: 4th Sector links open/collaborative networks with traditional orgs.

**Coordination on Discord**: [sensorica.co/forum/discord](https://www.sensorica.co/forum/discord)

---

## Funding Efforts {#funding-efforts}

- **Grants**: [Grant proposal to nlNet](https://paper.dropbox.com/doc/Value-distribution-for-communities-SrtMJNL3HUfYgqzgV3LHC)
- **Crowdfunding**: Ongoing efforts on [Mirror.xyz](https://mirror.xyz/sensorica.eth)
- **Moloch DAOs**: Crypto funding, Ethereum ecosystem

---

## Methodology {#methodology}

**Resources**: Doc lives in [this folder](https://drive.google.com/open?id=0BzrQyEif2HItclJZMmx6Tl93SmM). Background info on [OVN wiki](http://ovn.world/index.php?title=Main_Page). See also: OVN 3.0, OVNi 3.0 - Governance.

**Goals**: Revisit OVN infrastructure (OVNi) based on Sensorica experience + other groups + new theoretical development in peer production + web3/DAOs.

**New Considerations**:
- **Technological**: DLT, DID, Verifiable Credentials, ZK Proofs, Smart Contracts frameworks, AI. List/remix web3/DAO primitives with OVN primitives.
- **Methodological**: Patterns and Pattern Language — communicate OVNi design concepts across backgrounds, translate p2p paradigm to layman.
- **Economic**: Complex Dynamical Systems/Ecosystems, Complexity Science/Economics, Living Systems, Cryptoeconomic Networks, Game Theory, Behavioral Economics, Stigmergy, Social Intelligence, AI-enhanced Collective Intelligence.
- **Interoperability p2p**: network-to-network interfaces (Qasse et al 2019 classification), interoperability with traditional world (4th sector). Sidechains, Blockchain Routers, Smart Contracts, Industrial solutions (Cosmos, Polkadot, ICON, Aion, Wanchain, Blocknet, Interledger, ARK, Hyperledger Quilt, Metronome, Block Collide). Sharing smart contracts across blockchains and p2p protocols like Holochain.

**Participation**: Anyone in commons-based peer production (practitioner/open network/community) or high-level theoretical work (bridge theory-practice). Also individuals interested in exporting OVN model.

---

## Todos {#todos}

1. Organise Holochain group in Montreal (see [Holo-REA forum](https://forum.holachain.org/c/projects/holorea/84)). Tibi sets up event. Call JP into process.
2. Build list of criteria for choosing p2p infrastructure. Must be/have:
   - Agent-centric (space for experimentation, easy protocol implementation)
   - Permissionless (anyone can join, no permission needed)
   - Allow anonymous participation
   - Contextual digital identity and personal data portability
   - Connected to mainstream economy (open market mechanisms to trade assets externally)
   - Provides embedded governance (smart contract capability)
   - Provides solution to data privacy/security concerns (self-sovereign identity)

**Where is Holo-REA?**: [hrea.io](https://hrea.io/)

**Principles of p2p**: [Google Doc](https://docs.google.com/document/u/0/d/1BEKboorBlVRz7uaKxzWdl2R5qtXVOmPHeI9lEqZ6aEs/edit)

---

## Context of Application {#context-of-application}

See [OVN 3.0 document](https://docs.google.com/document/d/1QX2TK_UaQhSQubp01fByk6_Ruxae7pY8rJ_pWt2xut4/edit#heading=h.2yjay8kz4m9q)

---

## Development Methodology {#development-methodology}

**Phases**:
1. **Foundational** — designs logic underlying overall programme | consider Ethos and Trust
2. **Implementation** — trace a roadmap
3. **Operationalisation** — building right procedures, structures, culture | mentoring/coaching | dissemination

---

## Some High Level Ideas {#some-high-level-ideas}

### A Minimal Bottom-up P2P Economic System
[Google Doc](https://docs.google.com/document/d/1fNcmyzol72FctBbF3Nh8gLoRj6UbL9CnqLM2F7iuF2o/edit#)

### Agreement-Based Organization Proposals
[Enspiral Tales](https://medium.com/enspiral-tales/a-developmental-framework-for-agreement-based-organization-54298b128906)

### Product Ontology
[productontology.org](http://www.productontology.org/doc/Sweet_potato)

### Psychology of the dWeb: Incentives to Cooperate on Decentralized Internet
[Hackernoon](https://hackernoon.com/psychology-of-the-dweb-fe61039ob)

**Summary**:
- Reciprocity = incredibly strong ethic in humans
- Constant cooperation exploitable — one free-rider ruins it
- Anatol Rapoport: **Tit-for-Tat** — 1) Cooperate first interaction, 2) Copy other's prior move. Two peers using this always cooperate. Uncooperative peer incentivized to cooperate.
- Tit-for-tat doesn't work well in large groups (trade partners without fear)
- dWeb requires large groups
- Option: collective ethic of punishing those who harmed others
- Detecting cheaters not enough — must punish free-riders. Humans evolved to punish third-party bad actors, incur personal cost, experience pleasure correcting.
- Unique challenge: reputation management (Sybil attacks, white-washing)
- People won't free-ride if it incurs cost
- Revenge prone — bad actors hurt innocent to discredit punishers → regression
- Curb: require punisher to incur cost (caution: people don't mind small costs for punishing)
- Punishments should be local, not global across protocol
- Margin of error in bad-actor detection
- Convert bad actors: Forgiveness (generous tit-for-tat) — restore cooperation, extract mutual benefits

**Internet infrastructure**: 3 major datasets: routing info, naming info, trust anchors/CAs. WHOIS lesser. Future: decentralised naming, trust management, BGP route data management.

**Soul-bound tokens - decentralised society**: [summary](https://docs.google.com/document/d/1-kGJMclJhoKVKtyeKyoxPEbWHQmtSFj5CcSBhCCUZmE/edit?usp=sharing)

---

## The Scalability Trilemma {#the-scalability-trilemma}

Tradeoffs: decentralization, scalability, security. [Medium article](https://medium.com/@aakash_13214/the-scalability-trilemma-in-blockchain-75fb57f646df)

**Contextualization**:
- **Scale**: OVNs must operate global scale. Statistical stability + deterministic orgs in innovation/production/distribution → above critical scale. Every open venture: hundreds of contributors. OVNs leverage synergy (exchange resources, forkable, remixable). OVNi must support interaction between multiple open ventures. Scale = important factor, direct impact on process stability and economic potential. OVNs better at large scale.
- **Decentralization**: OVNs predicated on global economic freedom, human-centric economic system.
- **Security**: OVNs take economic responsibility → must be trusted and attack-resistant.

---

## The State of the Art {#the-state-of-the-art}

**Main p2p infrastructures**: Holochain, Ethereum, Hyperledger Fabric, Tezos, Liquid Network, Polkadot, Cosmos/Tendermint.

**Existing Web3 NRP functionality**: Coordinape Circles, Hats Protocol, Colony.

---

## Application Level {#application-level}

Highest layer in protocol stack. Three ways: Client-Server, Peer-to-Peer/serverless (Holochain, webRTC), Hybrid. P2P = hosts communicate directly, dynamic IPs, join/leave anytime. Example: BitTorrent.

### High Level General Requirements {#high-level-general-requirements}

Given rapid proliferation of component solutions in P2P ecosystem → consider "plug-and-play"/pluggable component framework. Elect component from another group, later replace or re-develop.

| Component | Functions | Existing Code/Available Solutions |
|-----------|-----------|-----------------------------------|
| Identity | | |
| Reputation | | |
| Transaction | | |
| Crowdsourcing (incl. fund-raising) | | Established platforms, opencollective.com |
| Voting | | Loomio, democracy.earth/sovereign |
| Cryptocurrency/blockchains | | Hyperledger fabric |
| Performance Management | Metrics definition/capture (manual/auto) as indicators progress, productivity, profitability | |

**Strategic Implementation Technology Choices**: React/Redux? Cassandra? Network databases (Neo4j, orientDB, GraphQL, Tinkerbot, Gremlin)? Data viz (d3.js)? Mobile UX strategy (PWA? Native? React-Native?)?

- Brent: Tinkerbot → Apache TinkerPop? Gremlin for faster SPARQL exploration. GraphQL as wrapper for DB queries. Efforts to write Gremlin in GraphQL paradigm.
- David: Node.js, TypeScript, Angular, React/React-Native for maximum portability.

**Development Process Configuration**: Requirements Definition (Use Cases vs User Stories), Analysis/Design Modeling (UML?), Code repos/collab tools (github), Testing/QA tools. UI for different user levels — all in one, educational elements at UI level help users become knowledgeable, pass to higher levels with more responsibility.

### Current NRP Considerations {#current-nrp-considerations}

Work out logic of NRP: **Value flows** — evolved from REA + NRP [GitHub](https://github.com/valueflows/valueflows). **REA model** evolved from Bill McCarthy's original [Wikipedia](https://en.wikipedia.org/wiki/Resources,_events,_agents_(accounting_model)).

Vocabulary and protocols: p2p/agent-centric perspective. Help build interoperable components. 2018 SXSW panel on p2p protocols (dat) [schedule.sxsw.com](https://schedule.sxsw.com/2018/events/PP73084).

**Minimal p2p ecosystem requirements** (by Bob): [Google Doc](https://docs.google.com/document/d/1fNcmyzol72FctBbF3Nh8gLoRj6UbL9CnqLM2F7iuF2o/edit#heading=h.3scqy3a7w6uv)

### Issues with Current NRP and Next Gen NRP {#issues-with-current-nrp-and-next-gen-nrp}

Tibi logged issues in [current NRP GitHub](https://github.com/valnet/valuenetwork/issues). Reveal current problems + improvements. Scan, sort, write as new requirements.

**Other ideas**: [Open ideas doc](https://docs.google.com/document/d/1pBKc6TS7Z0tTcTaZKAt-y8w8NY7W96rVbsev_1bVURw/edit#)

---

## Structured & Standardized Interoperability {#structured--standardized-interoperability}

Advantageous to develop cross-network & cross-NRP shared lexicon. See [valueflows project](https://valueflo.ws/).

**Reasons**:
1. Inclusivity → future implementations need transparent way to interface with NRPs including Next-gen. Shared protocol = low barrier to entry.
2. Network growing/overlapping with another → either new protocol per pair (absurdly costly) or totally unable. Shared standard = interact at no additional cost.
3. Shared interchange format → explore alternative implementations without migrating implementation-dependent data stores. Loss of data undermines confidence, financial impact. Minimize risk.
4. Shared lexicon up to date with evolving REA/OVN/NRP → reduces cost to learn/transfer skills. Human-language terminology can evolve at little cost.

**Work should include many parties** engaged in serious NRP development. Future: bring in REA originators (Bill McCarthy), ISO/IEC (ACCOUNTING AND ECONOMIC ONTOLOGY), other standards bodies, parties interested in value networks.

**Potential collaborators**: Bob & Lynn (original NRP authors), Valueflows, Freedom Co-op, more NRP projects, Bill McCarthy, ISO/IEC, Holo/REA, confoederatio.noblogs.org, pantheon.work, ledgerproject.eu (16 human-centric projects).

**Minimum requirements for usable standard** (leaner than ambitious goals). Implementation-level standard can leave placeholders for higher level parties. Critical requirements for next-gen NRP usability: define/agree with all parties to implement as web-based API:

**Resources and resource types**:
- Discoverable catalog of material resource types
- Essential properties identifying resource type
- Protocol for handling same/interchangeable resources as different types
- Disambiguate whose resource type definition referenced
- Converge on single type serving both networks
- Publish/discover resource synonyms interchangeable/converged
- Discoverable catalog of services (work, space, equipment)
- Protocol for publishing/discovery of resource availability/production capability
- Robust way to express units of measurement
- Consensus on unit exchange rates (currencies) and conversion factors

**Exchanges, transactions, contracts, trust**:
- Format for transfer requirements (costs/fees) in inter-network exchange: time constraints, unit of exchange, costs per unit, quantity-independent requirements
- Protocol for expressing commitments to fulfill requirements
- Format for ledgers: track actual transfers, determine if exchanges/commitments complete, estimate trust/reputation, kept by multiple parties tamper-evident, links to secure receipts, attribute entries to agents

**Agents**:
- Basic identity services (may link to third parties)
- Robustly express membership by linkage for aggregate agents (teams, projects, networks)
- Linkage from transaction subsystem → de-facto resume or calculate reputation carried network to network

**Semantic Web** promising candidate: open standards, software exists, little risk, transparency, clear path for future, facilitates vocabulary definitions, stack-agnostic operations, helps web apps interact p2p (no single repository).

---

## OVN Genesis {#ovn-genesis}

How do you start an OVN? Should we tokenize Sensorica using web3 tools? Currently engaging web3 orgs to offer open ventures incubated in Sensorica OVN as testing ground. Experimentation in smaller context → gather solutions for network-wide remix, prepare for next OVNi gen and moving Sensorica to p2ch tech.

**Genesis page on OVN wiki**: [ovn.world/index.php?title=Genesis](http://ovn.world/index.php?title=Genesis)

### Options {#options}
- Airdrop / reward
- Hatch
- Bitcoin style Genesis
- ICO
- Merkle Drop Launch (Trustlines Network example)

### Airdrop / Reward {#airdrop--reward}
Only applies to existing org with participation log or method to estimate past contributions. Compile past contributions → piechart of sweat equity. Mint tokens, distribute. % reserved for org as treasury (held by Custodian, can be DAO). % for partners/stakeholders. ERC20 on Ethereum mainnet → transferable, currency (reward contributions, access infrastructure), decision-making (holding, staking, meaningful contributions in ledger).

**What gives value to tokens?**
1. Redeemable in access to infrastructure/resources (e.g., Sensorica lab)
2. Distribution: wide airdrop → holders become stakeholders → price evolves on open market (trust, history, outreach)
3. Offer tokens to all fab labs/makerspaces — need story for perceived utility. OVNi infrastructure promise = good reason. Method to estimate tokens based on size, accomplishments, history, reputation, values, culture. % reserved, locked in smart contract controlled by Custodian/DAO. Filter must be well-designed, participatory. Release adds liquidity (deflationary). Friction with holders must be mitigated. New entity enters → demand created → system balances. Alternative: initial smart contract mints new tokens as entities enter, signed by multiple stakeholders. Problem: entities leave → economic constriction → token circulation stays same → inflation.

**Question**: scheme where volume controlled by usage? Stable tokens?

### Hatch {#hatch}
From Commons Stack (CS). CS uses "Hatch" not "Genesis". See [Hatch proposition from TEC](https://forum.tecommons.org/t/the-hatch-tl-dr/272), [What's in a Hatch](https://medium.com/commonsstack/whats-in-a-hatch-3799a398243a). April 2022: Sensoricans submitted proposal to Commons Stack Prize to tokenize Greens for Good venture. Strategy: work in restrictive context (open venture), not entire OVN. Testing phase with various web3 solutions.

### Bitcoin Style Genesis {#bitcoin-style-genesis}

**Definitions**:
- **Initial Core Group**: individuals creating new OVN, actively contribute. Role morphs into Core Group.
- **Custodian**: Legal entity providing custodial services. Normal mode: service provider, can provide arbitration. Not active role managing/shaping network. Most functionality → DAO, except physical assets (real estate) requiring traditional legal representation.
- **OVN Core Group**: Active affiliates filtered by Access to Benefits Algorithm for governance at network level.
- **Project Core Group**: Active affiliates filtered by Access to Benefits Algorithm for governance at project level.
- **Exchange Firm**: Legal entity providing Market interface, commercial activities. Can be absorbed by DAO (especially digital services).
- **Partners/Stakeholders**: Other orgs interfacing with OVN, providing essential service, benefiting from network.

### Tokenization {#tokenization}

**Creation of OVN Tokens**: Tokens = discrete entities, quantify quantifiable things, proxies for unquantifiable. Also represent keys/credentials (access), ownership/association.

**Theoretical foundation for tokens in OVN needed**. Complete list and compare alternatives (pros/cons).

**Example from Colony whitepaper**: Rationale — initiators not necessarily best to maintain/develop. Trust environment needed early, rooted in general purpose, not individual desires. Initial Core Group disappears into background, Custodian establishes trust environment for OVN Core Group to develop/take over. Hero entrepreneurs maintaining control via private property = recipe for corruption. Google's "don't be evil" meaningless. Traditional orgs instrumentalized outside initial purpose. Goal: purpose-driven, adaptable OVNs.

**OVN = p2p, open, transparent, decentralised, distributed**. DAO = different philosophy/culture. Bitcoin, Ethereum examples. Portions of OVN governance via smart contracts on decentralised p2p infrastructure with **nondominium property regime** (no one owns but anyone has access respecting rules).

**New OVN created using general_OVN_contract** by Initial Core Group. First entity = Custodian (oversees virtual/physical infrastructure, implements nondominium property regime, facilitates community building). Initial Core Group transfers power to Custodian → transfers to OVN itself.

**Tokens related to network development/maintenance and Custodian** = name_OVN_token. Initially generated during OVN distribution period. Functionality added as required (Colony's EtherRouter mechanism). Ability to add functionality powerful but could destroy trust → never lies with OVN developers, but with multisig contract (wider community → OVN Core Group + Custodian).

**Normal functioning**: name_OVN_token holders (OVN Core Group) validate reputation (Reputation Mining, Colony Section 7), custodial responsibilities (legal representation, coordination, mediation, nondominium implementation, infrastructure dev/maintenance). Permissioned functions on general OVN contract for fundamental parameters: early stages = Initial Core Group, creation = Custodian (arbitration), normal = OVN Core Group. Vote open to all name_OVN_token and reputation holders (OVN Core Group). Co-management includes updates to Ventures' contracts for open ventures incubated. OVN Core Group ensures due diligence (self or service providers) to avoid security weaknesses. Custodian = trust stewarding IT infrastructure (NRP etc), handling some access. Reputation in OVN Core Group via earning tokens completing tasks, admin/evaluative duties, reputation mining. Gradual handoff decision-making from Custodian to OVN Core Group. Mechanism undefined.

**Stage 1**: Initial Core Group Multisig in control — general OVN Contract functions permissioned to multisig address.

**Stage 2**: Custodian Multisig approval required — intermediate contract receives permissions, Custodian must sign off. Strong arbitration during launch, anchoring in trusted legal entity.

**Question**: Allow writing/deploying smart contracts that only become official if people engage? Function of OVN = series of smart contracts interacting, chained/networked in web of logical relations = composite smart contract, coherent, serves purpose. Addition only effective if affiliates engage meaningfully, hard linked to actual participation. Similar to Bitcoin longest chain rule.

**Stage 4**: Core Group fully controls network — intermediate contract removed, OVN Core Group direct control, no control by Initial Core Group or Custodian. Custodian might retain arbitration. Initial Core Group completely morphed into OVN Core Group.

### Arbitration {#arbitration}
*(Intro only — section marked for development)*

---

## Stack {#stack}

Orthogonal dimensions of p2p IT infrastructure for material peer production. Web3 existing stack. Further work: merge web3/DAO with OVN.

---

## Access Layer {#access-layer}

Applications as entry point for Web3 activities. Credentials and access distribution/management: Credentials/Use/Identity, Reputation. Web3 primitives: wallets as main entry point (DappRadar aggregator).

### Digital Identities {#digital-identities}

**Frame for identity in OVN**: Most ideas about identity = paradox of control/domination (birth cert, passport, SSN, driver's license = link physical you to gov interests). Opposite: anarchist paradigm. But these instruments mistaken for identity. Identity = psychological/social perspective (Wikipedia), not bureaucratic.

**In OVN/OVNi: identity = access**. How provide access to economic activity? Efficient, effective, humane, rewarding, enriching.

**Bitcoin Network**: no life info needed. Buy hardware, install software, plug in. Irrelevant who/where/culture. Sensorica = same principle of minimal information. OVN not about control, but **maximising economic freedom**.

**Contribute to open venture**: don't even need credentials. Benefits distributed based on work done (not promise), peer review validates. Don't need to demonstrate capability — doing it right counts. Like open source/Wikipedia.

**Emergent identity from contributions**: dimensions of reputation (quality, commitment, regularity). Used by peers/automated agents to improve economic activity (e.g., asked to contribute because record shows past performance). You decide if allow digital identity formation from activity (weigh pros/cons). Anonymity and digital identity formation = separate things. Can have identity as contributor while anonymous (not linking to physical you).

**Please propose definition of digital identity. Invite collaboration...**

#### Some Rants About Identity
- Credentials/access mistaken for identity. Bus: don't tell driver about self, just show ticket (credential = paid for ride).
- No one has access to our identities. Multiple identities shifting: father, employee, friend, artist.
- Identity vs persona: persona = semiotic construct, fabricated, can be misinterpreted.
- Physical you: strangers see body, associate effects of actions. Symbols (dress, hair, accessories) = persona. Don't know father/community/values.
- Physical you (genuine) based on life/circumstances. Personas (home, work, store, online). Credentials = features making people trust you in situation (enter building, drive car). Culture/family/profession irrelevant for driving.
- Passport: dual function (authorities find you, access services/benefits). Unique, associated with physical you (photo, signature, biometric). One-to-one relation.
- **Technology cannot have single point of authority/dependency**. Manage/switch between multiple digital identities, each with context-sensitive capabilities.

#### Current Work on Digital Identity
**NOTE**: Do not take for cash. Adapt to context.

Beyond passwords. Each agent: unique identity high confidence — Proof of identity, proof entitled to do something, accountable. Connect to digital traces → improved governance. Decentralised identity management tools. Eliminate single credential issuer. Work with anonymous pep networks.

Identity (you are who you say) + credentials (now you can do what you ask = access) + entitlement.

Universal Wallets. Secure biometric key solutions. Privacy: total control over data to agents.

Permissionless blockchains: ephemeral signing keys (hinders auditability/transparency). Explore anonymous credentials (Idemixer) — sign without disclosing identity, prevent linking transactions. Smart contracts verify strongly encrypted transactions. Zero-knowledge proofs, multi-party computation. Trade-offs efficiency/privacy, SGX fallback.

Self-sovereign identity: DIDs (W3C), public/private keys, ZK proofs. Implementations: Sovrin, uPort.

Identity (unique) vs member (location based). Identity-free approaches, automatic anonymisation, strengthening identity management.

User control: ease decision making, customization. Portability of personal data sets.

Three digital ID systems: (a) centralised, (b) third-party based, (c) self-sovereign.

Fundamental requirement: identities portable, people retain control over personal data (choose with whom shared, purposes). True decentralised = full control (real SSI). Guarantee unicity/singularity. Technical standards for interoperability: DID (Decentralised Identity Foundation).

**Challenges**:
- Control individual identity (refer, update, hide, prevent claiming). Access all individual data, retrieve claims.
- Open/transparent systems/algorithms for administering digital identities. Relevant info/services transportable, not held by single third-party.
- Wide adoption, easily accessible, connected services, scalable, real-time.
- Automated data governance to reduce costs. Metadata/data quality methods.
- Data cataloguing system for search/retrieval.
- Manage numerous datasets/requests while securing privacy, users as data owners.

**DIDs**: direct encrypted channel p2p communication, portable across transport/security context.
**VCs**: sets of claims about agent, provenance/immutability provable, optional assurances. ZK proofs.
**SSI**: implemented through DIDs/VCs. Infrastructure for 'qualified data' exchange (data sufficiently qualified for transaction commitment decision). Parties create policies for what data needed, assurances required.

**Roles in SSI ecosystem**: issue (issuer), store/provide (wallet), request/obtain (validation), revoke (revocation). Digital wallets respecting machine-readable policies, negotiate transactions, make commitment decisions.

**Possible outcomes using SSI**: Convenience, auto-fill webforms, no passwords (no spoofing/phishing), no spam, mutual authentication, more privacy, efficiency (lower validation costs/time), better UX (only qualified data exchanged).

**Distributed digital identity management**: Data sovereignty & SSI — irreversibly impossible to identify individual through reasonably likely means.

**Agent**: anything performing action, has agency. Individuals, groups, projects, networks, bots, machines (IoT). Verified, unique, secure, private, portable. Identities for individuals, resources (equipment, tools, spaces), AI agents.

**Self Sovereign Identity**: [GitHub](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2017/blob/master/topics-and-advance-readings/self-sovereign-identity-primer.md). Collaborative effort drafting standards (W3C DID draft, verifiable claims, DIF). Only infrastructure fulfilling SSI principles: Sovrin from Evernym.

**Ian Grigg**: Internet of Agreements, [An exploration of identity](http://www.r3cev.com/blog/2017/4/25/an-exploration-of-identity). identityinsurance.org.

**Viney Gupta**: Reputation enslaves people to scores, scam farms. Want restorative justice — if harmed, guaranteed made whole. Insurance > identity. Can deal with anonymous if trust insurers (corporate, not entitled to anonymity). Bad people = high premiums, very bad = uninsurable. [Twitter discussion](https://twitter.com/artbrock/status/977185632584806400).

**Tibi**: Need identity or uniqueness of agent? Machines analyze pattern of past activities → predict "Bob will do x". Process reports from other agents. Not mutually exclusive, complementary. Identity not as important as uniqueness of agent/avatar. Link individual-avatar hard, uniqueness enforced/guaranteed but obscured from public. [Twitter discussion](https://twitter.com/artbrock/status/980941076918714368).

**Develop DID Document**: defines entity's unique identity and verification means. Level of Assurance (LoA) score (high scores for critical processes). Solution: (i) Digitization Portal: generate/manage digital identities, (ii) Wallet App: user manages/controls identity, (iii) Integration API: communication with stakeholder systems.

**Christopher Allen**: User central to identity administration. Interoperability across locations with consent + true user control = user autonomy. SSI must be transportable (not locked to one site). Must allow ordinary users to make claims (personally identifying info, personal capability, group membership, info asserted by others).

**User sovereignty**: absolute privacy by default, absolute pseudonymity by default, strong open source encryption always, open/standard protocols/formats, "what not who" for authorization, revocable consent-based power structure.

**Tools**: SSI = digital record/container of identity transactions you control (cryptographically proving ownership, contract-based sharing). Move from fixed-identity to flexible/fluid "entitlements" for context-specific attribute-based identities. Enable portability of personal data sets, transfer/share with orgs of choice for purposes/conditions they decide/control.

### Agent Profile {#agent-profile}

Digital identity representation. Builds on identity considerations. Can have agency if enhanced with AI (act on behalf, sign contracts per predefined rules).

Profiles important for self-organisation: allow other agents/automated processes to evaluate agent wrt action/process.

Should contain: affiliations/contexts/orgs/networks agent operates in (assess organic reach beyond immediate zone). Should contain Reputation.

*To be developed... [Tibi to see with Joachim who works on digital identity](https://www.facebook.com/joachim.lohkamp)*

### Access {#access}

Access to resources (digital/physical). Related to participation. Requirement: permissionless.

See [Sensorica's Open Access project](https://docs.google.com/document/d/1Q1La5TT_uBpaUsYtU5lsNIj87ScmthFBefumSr1gq0A/edit#), [Blockchain access report paper](https://docs.google.com/document/d/1Ag1vgCsKa8Ma2hXbslrbS85zI42au1urAww12g1Tis8/edit#).

**Import info from docs above. Update according to latest shared understanding on access, credentials, digital identity.**

**Some ideas [Tibi]**: Access credentials auto-constructed from contribution/participation data if agent allows aggregation/association with digital identity. Portable credentials interpretable in other contexts. Example: Sensorica lab activity, 3D printer use → digital traces in NRP-CAS → 3D printing usage credentials recognized by other labs. Credentials associated with physical individual (if presents at another lab). Other context verifies credentials match requirements. Credentials credible/trustworthy (property derived from original context). Identity of place/extra info hidden (ZK proof). Context (Sensorica lab) as agent can have credentials for issuing credentials for accessing X or Y.

### Trust, Accountability, Robustness and Certification {#trust-accountability-robustness-and-certification}

**Trust in system**: security, privacy, robustness, guarantee of benefits.
**Trust as accountability**: reputation, planning, process management, access to benefits algorithms, governance. Game theory, behavioral economics.

**Important literature**: Roger Needham, Li Gong, Raphael Yahalom, Cathy Meadows (Cambridge Computer Lab) — modal logic, process algebras for trust in cryptographic protocols. Trust management (Matt Blaze, Angelos Keromytis). Research moved toward human-centric view. Fukuyama 1995 (trust). Lynne Zucker 1986 (sociological trust, rational choice). Tversky/Kahneman (behavioral economics: rationality limited, trustworthiness essential for reasonable transaction costs). Consumer trust in Internet commerce (Sirkka Jarvenpaa). Trust to Internet governance (Collibra, Erwin, Deloitte).

---

## Use Case Layer {#use-case-layer}

Atop protocol and infrastructure layers. Frontend users interact with directly. Example: Mirror uses Arweave storage, Ethereum for crypto payments to ENS addresses.

### Data Management {#data-management}

To do for Tibi: import info about decentralised data management (IPFS, MadeSafe). Digital resource management, process management.

**New value generation level**: platform as core production unit in data economy → data aggregators, p2p dynamics, incentives for data sharing. OVNs as attractors where people share data because system generates positive outcomes for individual/society.

Data sharing, docking, attachment automated. Protocols for sound data sharing. Link to incentives (usage in productive activities rewarded). Avoid data markets… build on stigmergy.

**Data sovereignty & access & SSI**: irreversibly impossible to identify individual through any means from activities.

**Data Management Plan needed**: storage, exploitation, access (generated by NRP/other apps). Default: agent's data private. User defines sharing/distribution (group or public). Permissions/licenses govern what others can do (public, confidential, classified). Context dictates data governance (collaborative endeavor → all data public, individual chooses interact or not, interaction = automatic irreversible sharing).

**Principles**: discoverability, accessibility, intelligibility, availability, usability, integrity, security.
- Storage/management at large scale
- Data governance model + interoperability mechanisms
- Data pre-processing + interoperability
- Storage with 'semantic cover' — semantic models for harmonisation
- Integration/harmonisation for data/services — lightweight architecture, big data analytics + ML
- Data catalogues to expose data/services
- SSI management approach — user control over data
- User-approved data migration (if not in commons)
- Security mechanisms - authenticated services (PSI: privacy, security, interoperability)

**Data governance**: exercising control over data ownership, access, usage decisions to reduce risks. Defining ownership, data relationships with AI models, access, formal contract selling, user consent, data stewards.

Standards/policies for data usage control + digital identity management = users in control.

Decentralised ecosystem with eventual centralised silos interconnected without compromising privacy/security/interoperability.

**PSIaaS** (Privacy-Security-Interoperability-as-a-Service): cloud computing service. Personal Online Data Storage (PODs) — distributed, decentralised, semi-decentralised, hybrid, or decentralised via DLT/blockchain. PSIaaS decentralizes via distributed database. Decentralised: preserving privacy in social networks, overcoming usability challenges. Linkable: Linked Data best practices for Semantic Web. Who Owns Data? Collector/storer/processor vs subject.

Separate PODs per unique user at physical location of choice. PODs linked to third-party apps via APIs (no interface difference). User data populates app only if user authorises via API (extent/time period). Permanent transfer to requesting DB under smart contract on ledger using DLT. User-controlled segregation from service providers' central DB protects privacy, impacts security/interoperability.

PODs security: PQC encryption & DLT smart contract for data transfer authorization. Semantics for interoperability.

**Data security**: Two techniques: anonymization/fragmenting information (stored/validated data) AND protecting information in circulation. Protection = safe sharing: dispersion of fragmented data, or techniques eliminating info from circulation (circulating only cryptographic references). Dispersion handling metadata, avoiding concentration in single agent, multiple authentication mechanisms "ring signatures" = additional safety layer.

**Other considerations**: Recovery of credentials, Delegation for accessing data, Onboarding (authorization/permissionless + credentials issuance), Inheritance/transfer of access/use rights to data/resources.

### Database {#database}

**For server-client NRP** (Bob):
Software on [GitHub](https://github.com/valnet/valuenetwork). Data model generated from [this code](https://github.com/valnet/valuenetwork/blob/master/valuenetwork/valueaccounting/models.py). Install on dev computer → sqlite database auto-generated. Instructions [here](https://github.com/valnet/valuenetwork/blob/master/docs/install.txt). Sloppy radial graph [here](http://nrp.sensorica.co/accounting/radial-graph/33/).

**For Holochain** (Pospi):
No pre-seeded database needed for Holo-REA. Data structures at API boundary covered by [this](https://lab.allmende.io/valueflows/vf-schemas/vf-graphql) for both Holo-REA and CommonsPub/Bonfire.

**Data lakes**: incorporating various data types/formats, managing heterogeneous sources, aligned with data governance model. Catalogues on top for search/retrieval. Cloud edge/fog storage, decentralised storage (IPFS), decentralised hosting (Holo).

### Physical Location Validation {#physical-location-validation}

(ex. FOME): Physical resource management, process management, transactions validation (Ethereum), entitlements management, flows, contribution validation (Sensorica), cocreation processes, redistribution of benefits.

### Geolocation {#geolocation}

Need to know where physical things are and where processes take place. Trustless way to assess location across network.

Example: [FOME.space](https://foam.space/) — Open Geolocation Standard. [YouTube](https://youtu.be/4TUzorWZW6Y)

### Registries {#registries}

Catalogues of important things: agents, resources (inventory), ventures. Come with rules for inclusion/exclusion and clear procedures.

Example: individual is affiliate of open venture (OVN) iff represented in Affiliates registry. Banning = excluding from Affiliate registry. Grave consequences → transparent rules/procedures.

Registries: dynamic, based on consensus, unique at any point, history immutable, establish current state (legitimate funding campaigns, active affiliates).

#### Affiliate / Agents Registry {#affiliate--agents-registry}
Public list of all OVN AFFILIATEs. Official list on NRP-CAS: [nrp.sensorica.co/accounting/agents/](http://nrp.sensorica.co/accounting/agents/). See [Organisational Structure doc](https://docs.google.com/document/d/1OytVGkt56a8gaWs64a6Ggj8Sg4WZqo6VDDK0GcH2Kvc/edit) for affiliation types. See [inclusion/exclusion rules from Sensorica](https://docs.google.com/document/d/1OW2Nc2HjJp7nugClK-eDb_LA_3H3ZSZcRkykrZVXxiQ/edit#heading=h.vvr8ruy841nh).

#### Events Registry {#events-registry}
Public list of current/future/past events using OVN brand name. Sensorica: stored in Main Coordination Tool, Facebook, Meetup. Event registry = Events page on main website [sensorica.co/events](https://www.sensorica.co/events). Inclusion/exclusion rules [here](https://docs.google.com/document/d/1tQXSUid9dvjz8IJ6sM-l77sinR3CPaR6y027lVrlEio/mobilebasic#h.sp0m7hteiyxt).

#### VENTURE Registry {#venture-registry}
Public list of current/past ventures hosted in OVN digital environment using brand name. Sensorica: different types, most popular = Open VENTURE [ovn.world/index.php?title=Venture](http://ovn.world/index.php?title=Venture). Examples on [Sensorica website](https://www.sensorica.co/projects) and NRP-CAS [nrp.sensorica.co/accounting/agents/projects](http://nrp.sensorica.co/accounting/agents/projects). Inclusion/exclusion [here](https://docs.google.com/document/d/1tQXSUid9dvjz8IJ6sM-l77sinR3CPaR6y027lVrlEio/mobilebasic#h.4fxa6qtksa2g).

#### RESSOURCE Registry {#ressource-registry}
Public list of resources available to all OVN affiliates (pool of shareables), some available to anyone (commons). Sensorica: all RESOURCES used by affiliates in PROCESSES in context of VENTURES listed in Inventory on NRP-CAS [nrp.sensorica.co/accounting/inventory/](http://nrp.sensorica.co/accounting/inventory/). Inclusion/exclusion [here](https://docs.google.com/document/d/1tQXSUid9dvjz8IJ6sM-l77sinR3CPaR6y027lVrlEio/mobilebasic#h.q4ogoelnit6w).

**Registry accepts RESOURCES under different property regimes**:
- Private property and derivatives (shared property, condominium)
- Shared or communal property
- Commons
- **Nondominium**

Shared material resources → pool of shareables, trust of one/multiple Custodians.
Shared digital assets → OVN's commons.
OVN (ventures + entire network) = nondominium form of property.

#### Digital Resources {#digital-resources}
Each asset: digital representation/profile + identifier. Principles: discoverability, accessibility, intelligibility, availability.

#### Material Resources {#material-resources}
Each asset: digital representation/profile + identifier. Contains ownership regime, access/use rules/procedures. Linked to accounting services. Scheduling (use/maintenance), availability. Metadata: location, physical dimensions, quality.

### Needs/Offers Matching {#needsoffers-matching}

Inspiration: [Web of Needs](https://drive.google.com/file/d/0BzrQyEif2HItakdvbUNOaWxKMVpIMEROSl9IeVBtc2tLdl9B/view). Draft with Value Flows Ontology + Web of Needs Agreements [here](https://docs.google.com/document/d/1MPjlYJWyNlLjCgCzPKUILkOx7C7I6jgjsW6e4dMCqG0/edit&sa=D). Previous discussion in rough drafts.

**Production side**: Matches Resources ↔ Projects/Processes/Activities, Agents ↔ Projects/Processes/Activities
**Market side**: Matches Products ↔ Consumers

Brent Shambaugh worked on this. TODO: review valueflo introduction + web of needs agreements protocol [here](https://groups.google.com/forum/?hl=en#topic/Sensorica/ARX7gXex9x8).

**Original Driving Ethos**: "Ideally, peer-to-peer economic platform will allow creation of virtual teams/companies connected to other virtual teams by means of their value networks." [bshambaugh.org/Master_17.html](http://bshambaugh.org/Master_17.html)

"Peer-to-peer = decentralised and distributed. No centralised orgs/servers. Each peer participates. Contribute or receive value. Sensorica value network: voluntarily join hierarchy with other peers for project, disband when complete." [valueflo.ws/introduction](https://www.valueflo.ws/introduction/cfa.html)

**Conversation for Action phases** (Web of Needs):
1. Planning: buyer/seller decide action for acquiring/selling
2. Identification: data interchange to establish one-to-one linkage
3. Negotiation: exchange info to achieve explicit mutual understanding/agreed goal (specification, quantity, pricing, delivery, financing, agents/third parties). Key triples: agr:proposes, agr:accepts. Affected by [modification ontology](https://github.com/researchstudio-sat/webofneeds/blob/master/webofneeds/won-vocab/src/main/resources/ontology/won_modification_ontology_v1.0.ttl). Depend on Needs [ontology](https://github.com/researchstudio-sat/webofneeds/blob/master/webofneeds/won-vocab/src/main/resources/ontology/won_ontology_v1.0.ttl).
4. Actualization: execution of negotiation results (seller produces/assembles, buyer transfers value)
5. Post-Actualization: warranty, after-sales service, post-sales financing, complaint handling, relationships

TODO: compare Conversation to Action states with WoN protocol. Continued [here](https://docs.google.com/document/d/1jlBMvPTote5nVM4GO3mB6FTiNTce4VktUHQK11n6RZM). Working with RESCAL [here](https://github.com/bshambaugh/rdfdataexperiments). [To be developed from scratch, based on Sensorica experience]

### Prediction Market {#prediction-market}
Helps agents decide how to invest assets in projects. Complemented by actual contribution/participation data from NRP-CAS. [To be developed from scratch] — see [Augur](http://www.augur.net/).

### AI-based Strategy {#ai-based-strategy}
Services analyzing activity on OVN, providing strategic info for agents about projects, processes, resource flows, helping decide where to contribute. See EC incubator/accelerator project.

### Personal Working Space {#personal-working-space}
From Mayssam: hard to find self when contributing sporadically. Need personal space tracking past activities, telling where to contribute now/what's important next.

Tension: personal working space vs working with others in same space (leverage social intelligence). Don't want silos breaking cohesion. Acknowledge natural tendency to seek corner (traditional institution). Encourage individual transformation → collaborative work culture. Personal corner remains. Desktop as separate space. Design personal workspace as part of IT architecture, with sharing/inviting feedback.

Fundamental need: navigation, orientation, memory (what did I do last time, where can I go now).

Alternative: personal pheromones (breadcrumbs) in communal space → bookmarks, access list of personal breadcrumbs.

### Investment {#investment}
Different from network-inherent crowdsourcing/participation. Interfaces with external environment providing additional resources to socioeconomic processes in exchange for equity, goods, services.

Examples: [Impak finance](https://www.impakfinance.com/home/), [opencollective.com](https://opencollective.com/learn-more) (crowdfunding based on transparency), [cobudget.co](http://cobudget.co/#/) from Enspiral.

### Solidarity Mechanisms {#solidarity-mechanisms}

#### P2P Insurance {#p2p-insurance}
[To be implemented from scratch] — see [Teambrella](https://teambrella.com/). [Investopedia article](https://www.investopedia.com/terms/p/peertopeer-p2p-insurance.asp). [insurepal.io](https://insurepal.io/).

**Viney Gupta**: Reputation enslaves to scores, scam farms. Want restorative justice — if harmed, guaranteed made whole. Insurance > identity. Deal with anonymous if trust insurers (corporate, not entitled to anonymity). Bad people = high premiums, very bad = uninsurable. [Twitter discussion](https://twitter.com/artbrock/status/977185632584806400).

### Education {#education}
*(Applications layer description + Protocol layer introduction — to be developed)*

---

## Infrastructure Layer {#infrastructure-layer}

Sits on top of protocol layer. Interoperable building blocks ("category primitives") highly reliable at specific task. In web3: series of smart contracts as backend of user cases at applications layer. Examples: Uniswap (swap assets), Arweave (decentralised storage), ENS (domain names as identity). Standalone apps limited; combined = lego bricks for web3 developers.

### Contract {#contract}
Develop Ricardian contracts and smart contracts. [Ricardian contracts](https://en.wikipedia.org/wiki/Ricardian_contract).

### Current-see for Use-Value {#current-see-for-use-value}
See [Sensorica current see doc](https://docs.google.com/document/d/1q9OBKHFsCg-M_dj_q6Kt6mEMxAqj9jxk_1u7vS5_TBY/edit#).

### p2p Exchange System {#p2p-exchange-system}
Cryptocurrencies and conversions to each other and fiat.

### About Distribution Systems {#about-distribution-systems}
Includes market and market-based distribution systems. Mission-critical → continuous availability, high performance, data protection/integrity.

#### Transaction System {#transaction-system}
Flow of things within network and across membranes. Two-way process: good goes one way, something of equivalent worth other way. Binary: two agents (individuals, projects, networks, AI agents, smart hardware). *To be developed...*

#### Token-based Transaction Systems {#token-based-transaction-systems}
Transactions mediated by tokens (intermediaries for exchange, quantitative valuation). Binary: good one way, tokens other way. Different from barter.

**Market-based valuations**: scarce things in market environment, well-defined supply/demand.
**Non-market-based valuations**: *To be developed...*

See: opencollective.com, cobudget.co (Enspiral).

**Discussions from FB**:
- **Chris Cook**: "No tokens will work. Period. Gigantic waste of resources." Context: 'Liberatory political project'. Digital tokens based on absolute property rights incompatible with analogue world.
- **Chris Cook**: Tokens = instruments (Ian Grigg's Ricardian contracts) connecting subject with object. Transactable objects within market rules (institutions). Conventional instruments = absolute property rights + time → binary absolutes: (a) infinite duration (equity), (b) finite duration (debt/derivatives). Binary nature = intractable conflict (equity vs debt, freehold vs leasehold). Tokens-as-Proofs = record PAST value transfer, nullity for real world. Tokens as promises of future value transfer = not enforceable by statute/judges (Anglo Rule of Law), but subject to interactive/mutual consensual agreements (French: contrats de societe — clubs, associations, African 'chamas'). [chamapesa.com](https://www.chamapesa.com/). Indefinite/undated duration of promises = simpler 'fuzzy' legal connections to real world. Complete political economy complementary to existing economy using only promises and protocols (like logical circuit from NAND gates).

#### Non-token based Transaction Systems {#non-token-based-transaction-systems}
Barter systems. *To be developed...*

#### Non-market-based Distribution Systems {#non-market-based-distribution-systems}
*To be developed...*
- First-come/first-served (vaccines, organs)
- Sharing equally (food distribution)
- Weight (% population or quantity)
- Merit (grants, contests)
- Random (US green card lottery, student housing)
- Majority

#### Merit-based Distribution Systems {#merit-based-distribution-systems}
*(Section header only)*

#### Non-binary Transaction Systems {#non-binary-transaction-systems}
- Many-to-one: Crowdfunding
- One-to-many: Redistribution of benefits based on Value Equation
- Many-to-many: Crowdfunding of multi-agent process
- Example: FairCoop - Faire coin

### Communication System {#communication-system}
See [OVN wiki](http://ovn.world/index.php?title=Communication). Working with [socialmediasquad.cc](http://www.socialmediasquad.cc/).

**Requirements**: high signal-to-noise, persistent, decentralized, censorship-proof, content filtering user-controlled, privacy/security, federated content.

#### Network Communication {#network-communication}
Hierarchical orgs = rigid pathways, compartmentalised info (top secret to public). Structure determines flow/processing. Well-designed = inefficient. Minimize noise (unwanted info). Limited capacity to process info. Rudimentary systems = paper = channeling/compartmentalizing made sense.

Open p2p = many-to-many → information overload.

**Principles**: Autonomy (no barriers to entry, affiliates encouraged to act for network benefit), Transparency (all affiliates access all communication), Openness (all affiliates communicate to any other).

**Corollaries/Requirements**: Topology = many-to-many. Time = sync + async + persistent. Relevancy = curated by affiliates or transparent AI, filtered by affiliates or transparent AI.

**Communication needs**: transfer info/knowledge, build rapport, build consensus, make decisions.

**Need reduced by**: good governance (rules of engagement known), good methodologies (what/when/how known), good IT infrastructure (everything in place), good culture (accustomed to environment).

**Restaurant kitchen analogy**: professional team, organized = only keywords for coordination. Everything in place (infrastructure), everyone knows task/coordination (methodology), knows allowed (governance). Poorly organized = noisy.

**New technologies**: [Holochat](https://youtu.be/ieHBTEhD5Gc)

#### Ecosystem Communication {#ecosystem-communication}
Networks engage surroundings like traditional companies. Corporate comms = one-to-many (info/ads). Internet → social media = exchange (public communicates to company and about company). Traditional company = single voice (PR function).

**Representation problem for networks**: Networks speak with many voices. All affiliates empowered to communicate about network, careful to specify not representing network/consensus. Only consensus output = network's view. Digital content stamped with tags (opinion, collaborative idea, network consensus).

Gosep network - distributed social network [Scuttlebut](https://github.com/ssbc/scuttlebot) (Bob works with them). [datproject.org](https://datproject.org/).

#### Incentivising Communication, Propagation and Curation
*(Section header only)*

### Reputation System {#reputation-system}
See [reputation on OVN wiki](http://ovn.world/index.php?title=Reputation). Key feature: regulates access to processes, benefits (e.g., create tasks in project). Not transferable between agents.

Public representation: badges (open badges). Automated system assigning badges based on past contribution behavior (quantity/quality).

**Proposed features**: Reputation decay in time? Ensures reputation = recent beneficial behavior.

**Sources**: [weboftrust.info](http://www.weboftrust.info/). Viney Gupta (same as above): insurance > reputation.

### Governance and Consensus {#governance-and-consensus}
When unexpected happens not in contract (smart contract). Work in [OVNi 3.0 - Governance doc](https://docs.google.com/document/d/1MWVZ8IonlHZGTigydxE2-rnhwZsSIikM_--NnwTmd2g/edit#). See Sensorica's work on [ethos](https://docs.google.com/document/d/1ryHd2nwko_4ax5I1DZX5W_vr_1QiBgSwMCtU8hZ1a2s/edit#).

General agreement among affiliates/agents that something is such and such.

**What needs consensus?** Not everything. Some things don't require network-wide consensus (scope of consensus). Some don't need consensus at all. See Arthur Brock's comments. See more on [Holochain](https://holochain.org/).

**Scope of consensus** (when needed):
- Physical location (all agents know where physical asset is now)
- Contribution validation (log of activity → contribution), limited to project (evaluation/redistribution decided at project level, local notion of fairness)

See orthogonal dimensions of NRP — protocol needed for each dimension with own consensus mechanisms.

**What type of consensus mechanisms for what?**

---

## Protocol Layer {#protocol-layer}

Underlying tech architecture (blockchain, Holochain, others). Public-private key cryptography.

**Web3 Primitives**: Layer 1 smart contract platforms (Bitcoin, Ethereum, Solana, Avalanche, Cosmos...). Some L1s have additional protocols (Lightning Network, Stacks on Bitcoin). Layer 2 scaling protocols (alleviate capacity limitations). Cross-chain bridges (highways for value movement).

**Best scalable option for Sensorica**: Holochain on Holo.

### Contribution Assessment Protocol {#contribution-assessment-protocol}
Similar to auditing. Description at application level. Distinction: subjective evaluation component vs automated component (assessing risk level).

**Example automated component**: Log has multiple dimensions validated elsewhere (hardware use, documentation, others contributed, agent reputation high). Dimensions → confidence level. Peers decide verify/assess based on confidence. Subjective evaluation as proof of stake (deters collusion). Smarter automated part triggers validation of high-risk components (e.g., "look at hardware prototype", skip documentation if high confidence). Component alone may increase confidence 60% → 90%. Peer validator decides where to spend efforts. Priority/importance of process also considered (related to stake in validation).

### About Ledgers {#about-ledgers}
Chain of time-stamped socioeconomic events. Immutable database.

### Lifecycle Management {#lifecycle-management}
OVNi lifecycle management (governance, development, maintenance). Encompasses: requirements management, software architecture, programming, testing, maintenance, change management, CI, project management, release management.

Inspired by DevOps: practices combining Dev + Ops → shorten development life cycle, continuous high-quality delivery.

### Sensorica's Core Capabilities / Contributions {#sensoricas-core-capabilities--contributions}
**[Tim]** Elements most essential for Sensorica:
- Affiliate/agent-centric identity, reputation, social participation (discovery, alignment, coalition-building, team formation, governance)
- Strategic elements of process management (coordination of action - button up emergent process orchestration)
- Collaborative, dynamic, parameterized, automated, intelligent CAS and related integrations, analytics, audit, other capabilities

---

## Legal Considerations {#legal-considerations}

### Expand on Securities Laws {#expand-on-securities-laws}
Might not apply to OVNs (test in court, but worth trying). Unlike public corporations, OVNs not siloes of economic activity — they're open. All investors can intervene at any moment. Securities laws created when open networks didn't exist. Could work out legal theory from this observation.

---

## Ethos {#ethos}

**Ethos**: defines ethical standards. Socially acceptable norms within Sensorica used to judge peer behavior.

**Ethics vs Morals**: Ethics = external standards from institutions/groups/culture (lawyers, police, doctors follow professional code regardless of feelings). Can be social system/framework for acceptable behavior. Morals = personal principles created/upheld by individuals (influenced by culture/society). [Source](https://www.diffen.com/difference/Ethics_vs_Morals).

See [Sensorica's Ethos doc](https://docs.google.com/document/d/1ryHd2nwko_4ax5I1DZX5W_vr_1QiBgSwMCtU8hZ1a2s/edit#).

**Propose a value framework**. See digital responsibility: literacy, security, privacy, trustworthy algorithms, transparency, human agency/centric.

Only if values lived end-to-end → indirect impact on resulting technologies — "trust by default" — trustworthiness elements built into system.

**Respecting socio-cultural dimensions**: Values infused from start to set up adhering ecosystem. Considerations at very beginning, infused every developmental step.

### Trust {#trust}
**Whitener et al. (1998)**: Trust = expectation/belief other party acts benevolently. Cannot control/force fulfillment → willingness to be vulnerable, risk. Dependency on other party → outcomes influenced by their actions.

Trust = relationship: trustee (giving party) acting in interest of trustor, without control possibility, dependency/vulnerability. Tool for unknown.

Trustworthiness = characteristic of trustee. Trust = belief bestowed by trustor.

Technology as trustee: must be trustworthy by design for user to believe positive outcomes. Programmers make technology trustworthy. Organization, incentive system, governance make process trustworthy. Users trust technology for outcomes + developers to keep it trustworthy.

Trust = foundation for every relationship, powerful force.

**2020 Edelman Trust Barometer Special Report**: trust in tech globally down 4% YoY. "Tech's halo effect fading, sector losing trust advantage at time when new technologies could put more doubts in minds of stakeholders if impact not presented balanced way — transparently, competently, ethically."

**Robert Bosch**: "I would rather lose money than trust."

Technology = enabler, not means to end.

Develop needed technology, make it "trustworthy by default" — trustworthiness elements built in.

Base development on fundamental values. Starting point not business models. First, propose value framework.

See digital responsibility: literacy, security, privacy, trustworthy algorithms, transparency, human agency/centric.

**Business models** based on openness, user-centricity, sovereignty, trust.

Trust positive at micro (likeable, increase adoption) and macro (society moves to p2p if emanates trustworthiness).

Trust becoming distributed, moving from traditional institutions.

Responsible behavior all along data life cycle = core of establishing trust in technology. Tools = not only tech stack result, but conceived from stack involving purpose, organization, technology, use cases — technology just one artifact.

**Brian Solis**: "Earning trust now becomes a strategy, like any other sales, marketing, or service strategy."

**Responsibility** = aim to 'do good' — focus on human individual. Digital world: responsibility linked to technology use (privacy protection, ethical/values-driven innovation, transparency in development, accountability).

---

## UI / UX Development {#ui--ux-development}
Open document: [Google Doc](https://docs.google.com/document/d/1h_B1qR3V4kjjzRVNttl_5vj6dc1fjIIwyKFiqe3dwxM/edit)

---

## Other Features {#other-features}

### Network-to-network Interfaces {#network-to-network-interfaces}
Sensorica experimented with formal bridges with other open communities/networks. Need to automate building/installing bridges. Remove human factor in establishing formal bridges. Next level of p2p evolution: forming networks → opening networks → connecting networks.

Discussed in reimagining wealth meeting (Vini, Lauren, Vincent/Trove). See [collaborative doc](https://docs.google.com/document/d/1f5f1neCXos8ix4BfQhmvnud8Cod_RaJIhpdmMfrHjug/edit).

Also need to repurpose functionality from other networks — flow not just data/info, but methods/tools. Not about federation requiring same software platforms. Some communities institutionally organized (permissioned). Open networks = permissionless, bridges by almost anyone.

**Potential problems**: cultural clashes, noise management, competition for attention, draining resources.

**Possible implementation**: Organization built on pseudocode. ITTT (If This Then That) as example of connecting organizations.

### Lists {#lists}
UIs use lists to present options. Contextualised. Traditional: Facets. List ≠ repository (exhaustive list of elements sharing common nature, used as reference: affiliates, resources). List feeds on repository for pertinent info in context.

Lists filtered on fly, algorithmically: agent profile, context (project/task/community), previous activities, current priorities, supply/demand of tasks. AI good for managing lists/options presented to agents at moment/context. Choices presented by AI must provide one-click access to rationale behind filter (transparency, recalibrate AI).

**From Patrick**: Residency/rotational model for doctors in training — circulated through departments to orient to larger hospital machine. Complexity of Sensorica platform = deterrent to newcomers. Designed to maximize choices. But more choices ≠ more freedom ([jam experiment](https://medium.com/@FlorentGeerts/the-jam-experiment-how-choice-overloads-makes-consumers-buy-less-d610f8c37b9b)). Find optimal number of choices per context to optimize engagement. Often = carefully designed defaults.

Fun activity: comprehensive review of Sensorica platform for behavioral/motivational snags, design charrette to classify problematic features, debug using choice architecture principles ([Thaler & Sunstein](https://www.economicshelp.org/blog/glossary/choice-architecture/)).

### Behavioral/Motivational Snags {#behavioralmotivational-snags}
*(Same as above — Patrick's suggestion for comprehensive review and design charrette)*

### Templates {#templates}
Digital assets shared across network. Intimately linked to processes/methods, same context. Provide structures for processes/activities, unify UX, increase interoperability within NRP. Suggested or imposed.

Sensorica developed various templates to formalize methods, make collaborative work more efficient. [Templates folder](https://drive.google.com/folderview?id=0BzrQyEif2HItOWNhOWI5NmItZmY1My00MWUyLTg2NTItNmRhMzU4OTYwMDFl).

**Functions**: Standardisation (better UX, high interoperability, high human resource mobility), Efficiency (cumulative best practices).

**Elements**:
- Viral: pointer to original on derived thing (trace back)
- Instructions: explain template, how to proceed (make copy, place properly)
- Improvement: todo list, propose improvements
- Context: proximal procedures/methods/templates
- Branding: carry OVN image
- Licence: access/use rights (usually CC-BY-SA)
- Identity: distinctive feature so everyone knows it's a template (family grammar, e.g., How-to family)
- Seen in context within process/method as suggestion/requirement for formatting

### Mote on Collective Intelligence {#mote-on-collective-intelligence}
Vincent (Lauren's friend): Use Murmurations to broadcast ventures/projects/digital assets to online dynamic aggregators: JSON file with schema + data, pulled by aggregators. Collaborative knowledge management tool.

### Manipulate Data at Resource Level {#manipulate-data-at-resource-level}
Implement fork and remix capabilities at UI level. Example: merging two resources → automatically creates process with all past contributions to mixed resources, output = newly created resource by remixing. Open source processes (fork/remix) not implemented in NRP.

Easy way: drag resources into category → backend manipulates database, creates new processes, remixes contribution history. Currently: citing resource only, data not in one place. Only remix via Citations/Uses relations by creating process. Alternative: browse inventory, pull resources into one category → process created automatically in background. More than one way = good.

### Logs in the NRP-CAS {#logs-in-the-nrp-cas}
Logs = claims for revenue or equity. Peer review process with red flag mechanism to validate/invalidate. But agents can always edit log. No status: when log = claim vs when become contribution (taken into benefit redistribution algorithm, officially accepted, should become immutable).

---

## List of p2p Projects {#list-of-p2p-projects}
- [dfinity.org](https://dfinity.org/)
- [holochain.org](https://holochain.org/)
- [confoederatio.noblogs.org/confoederatio-dtrade](https://confoederatio.noblogs.org/confoederatio-dtrade/)

---

## Appendix A - Some Terms of Reference {#appendix-a---some-terms-of-reference}

**Taxonomy of collaboration** (instructive):
- **Networking**: Signalling presence and interests
- **Coordination**: Sharing information and modifying activity for mutual benefit
- **Cooperation**: Coordination undertaken to achieve common purpose
- **Collaboration**: Networking + coordination + cooperation serving to enhance capacity of another by sharing risks, resources, responsibility, rewards

**Elinor Ostrom** (2010 Nobel): Successful "institutions of collective action" governing common pool resources marked by 8 design principles:
1. Group boundaries clearly defined
2. Rules for collective goods well matched to local needs/conditions
3. Most affected individuals can participate in modifying rules
4. Right of community members to devise own rules respected by external authorities
5. System for monitoring member behavior exists (community members undertake)
6. Graduated system of sanctions used
7. Community members access low-cost conflict resolution
8. For common pool resources part of larger systems: appropriation, provision, monitoring, enforcement, conflict resolution, governance organized in multiple layers of nested enterprises

**Howard Rheingold** (Net Smart: How to Thrive Online, MIT Press 2012) — Wiki advice for effective online collaboration:
1. Balance structure/freedom (not enough structure = paralyzing as too much)
2. Provide ways for contributors to communicate (IM, forums, freedom to structure)
3. Set epic goal (worth volunteering for)
4. Maximize self-election opportunities (communicate roles, encourage jump in where add value, model norms)
5. Set up decision-making institutions in advance (boot sector for wiki communities — avoid meta-discussions)
6. Make recent revisions visible, acknowledge exceptional contributors (leaderboards: recent + largest contributions)
7. Maintain index pages and navigation links
8. Fear inactivity more than mistakes
9. Provide personalized profile pages
10. Enlist entire community in security
11. Start with barn-raising (face-to-face social event, laptops, instruction, talk while building)
12. Encourage emergent leadership (explicitly describe/model as community service)
13. Document edits (short form summarizing what did, why)

Rheingold reviews 5 forms of mass collaboration: wikis, collective intelligence, virtual communities, crowdsourcing, social production.

---

## Tim & Chas NRP Call Apr 3 {#tim--chas-nrp-call-apr-3}
1. Develop design research plan to understand user requirements, inform current-state NRP concept
2. Create NRP update 'README' updating/reissuing regularly based on development progress
3. Index/map all existing docs, resources, systems for new affiliate onboarding
4. Draft network-wide communication calling for participation in NRP UX requirements gathering
5. Schedule individual/small group conversations based on responses
6. Decide types of information/color to obtain from interviews
7. Craft interview questions based on necessary/helpful information for development

---

## Miscellaneous {#miscellaneous}

### Tata's Doc {#tatas-doc}
See also [Tata's document](https://docs.google.com/document/d/1vlOoXhHIS2hSNysH7eP44X3yP990F0zHMV_rSztQGZs/edit?ts=5a7e28f7)

### Daniel Friedman {#daniel-friedman}
**Dealing with complexity**:
- Community: individual, teams, community, ecosystem
- Embodiment: structure, processes - stigmergy
- Accessibility: onboarding, relations, teams, impact
- Capacity: not just a tank, but capacity for resilience

---

## Interesting Organisations That Could Become Collaborators {#interesting-organisations-that-could-become-collaborators}
- [alkem.io](https://alkem.io)

---

## Signalization Tools {#signalization-tools}
- Symbol for process/status updates (milestones)
- Symbol for notes (reminders/short messages)
- Symbol for important information (attract attention)
- Symbol for ToDos (signal what collaborators can do)
- Alternatives box: enumerates possible solutions
- Reasoning box: presents arguments about choices
- Information box: tells how stuff works
- Growing consensus box: summary of section

---

**Note**: Terminology modified — "projects" → "ventures". NRP-CAS not adapted to this language change.