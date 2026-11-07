# OVNi 3.0 - IT, Next Gen NRP — Integración HSCSG/Zeitnus

**Fecha**: 2026-11-07  
**Backup**: `docs/ovni_3.0_it_next_gen_nrp_backup.md`  
**Origen**: Sensorica OVNi 3.0 IT/Next Gen NRP (Google Docs co-creation, en desarrollo)  
**Licencia**: Co-creation document, Content rules — ideas extraíbles libremente  
**Proyecto OVNi más avanzado 2026**: **Nondominium**  

---

## Tesis de Integración

OVNi 3.0 IT/Next Gen NRP es la **especificación técnica completa** para la infraestructura p2p que soporta el modelo OVN. Se posiciona como **Capa 4 (Infraestructura Metabólica) + Capa 3 (Operación Productiva - NRP-CAS core)** dentro de la arquitectura canónica Zeitnus de 5 capas.

**Componentes clave**:
- **NRP-CAS Next Gen** = Motor de contabilidad de contribuciones + transacciones (Capa 3)
- **p2p Infrastructure Stack** = Holochain + DIDs + VCs + ZK Proofs + Smart Contracts (Capa 4)
- **Interoperabilidad** = ValueFlows + Semantic Web + Network-to-network interfaces (Capa 3-4 bridge)
- **Genesis/Tokenization** = Protocolos de arranque de nuevos nodos OVN (Handshake generativo v1.0 → Mitosis)

**No es solo IT** — codifica gobernanza, modelo económico, identidad, reputación, distribución, contratos, ciclos de vida. Es la **implementación ejecutable** del modelo OVN.

---

## Mapeo Directo a Arquitectura Zeitnus (5 Capas)

| Capa Zeitnus | Componente OVNi 3.0 IT | Módulo HSCSG | Estado |
|--------------|------------------------|--------------|--------|
| **Capa 3: Operación Productiva** | NRP-CAS Core (Value Flows, REA, Contribution Accounting) | `nrpCasCore.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Contribution Assessment Protocol | `contributionAssessment.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Registries (Affiliates, Events, Ventures, Resources) | `registrySystem.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Needs/Offers Matching (Web of Needs + ValueFlows) | `needsOffersMatching.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Benefit Redistribution / Value Equation | `benefitRedistribution.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | p2p Stack (Holochain, DIDs, VCs, ZK Proofs) | `p2pInfrastructureStack.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Digital Identity (SSI, DIDs, VCs, Agent Profiles) | `digitalIdentitySystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Access Control (Permissionless, Credentials from Contributions) | `accessControlSystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Data Management (PODs, PSIaaS, Semantic Web) | `dataManagementSystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Physical Location Validation (FOAM, Geolocation) | `physicalLocationValidation.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Communication System (Holochat, Scuttlebutt, Dat) | `communicationSystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Network-to-Network Interfaces (Automated Bridges) | `networkToNetworkInterfaces.ts` | 🔄 Asimilar |
| **Capa 5: Transición Económica** | Genesis/Tokenization (Airdrop, Hatch, Bitcoin-style) | `genesisProtocol.ts` | 🔄 Asimilar |
| **Capa 5: Transición Económica** | Transaction Systems (Token/Non-token, Market/Non-market) | `transactionSystems.ts` | 🔄 Asimilar |
| **Capa 5: Transición Económica** | Distribution Systems (Merit, Non-binary, Solidarity) | `distributionSystems.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Governance & Consensus (Scope, Mechanisms) | `governanceConsensus.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Reputation System (Badges, Decay, Non-transferable) | `reputationSystem.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Smart Contracts (Ricardian, Upgradability, Security) | `smartContractSystem.ts` | 🔄 Asimilar |
| **Capa 1: Propósito/Límites** | Ethos/Trust/Trustworthiness by Design | `ethosTrustSystem.ts` | 🔄 Asimilar |
| **Capa 1: Propósito/Límites** | Legal Framework (Securities Laws, Partner State) | `legalFramework.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Lifecycle Management (DevOps, CI/CD) | `lifecycleManagement.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | UI/UX Development (Choice Architecture, Templates) | `uiuxSystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Behavioral/Motivational Snags (Debug via Choice Architecture) | `behavioralDebugging.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | AI-based Strategy / Prediction Markets | `aiStrategy.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Personal Working Space (Navigation, Breadcrumbs) | `personalWorkspace.ts` | 🔄 Asimilar |
| **Capa 5: Transición Económica** | Investment Interface (External Capital) | `investmentInterface.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Education / Solidarity (P2P Insurance) | `solidaritySystems.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Logs in NRP-CAS (Immutable Contribution Status) | `contributionLogs.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Fork/Remix at Resource Level | `forkRemixSystem.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Templates (Viral, Instructions, Branding, CC-BY-SA) | `templateSystem.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Collective Intelligence (Murmurations) | `collectiveIntelligence.ts` | 🔄 Asimilar |

---

## Decisiones EBD (Evidence-Based Decisions) — Derivadas de este Documento

| ID | Decisión | Justificación OVNi 3.0 IT | Implementación HSCSG |
|----|----------|---------------------------|----------------------|
| **D54** | **Holochain = Primary p2p Substrate** | "Best scalable option for Sensorica is Holochain on Holo" | `p2pInfrastructureStack.ts` con Holochain como default, pluggable architecture |
| **D55** | **Agent-Centric Architecture = Requisito Obligatorio** | "p2p infrastructure must be agent-centric (space for experimentation, easy protocol implementation)" | `agentCentricArchitecture.ts` — core design principle |
| **D56** | **Permissionless + Anonymous Participation = Obligatorio** | Criteria list: permissionless, anonymous participation allowed | `accessControlSystem.ts` — no barriers to entry |
| **D57** | **Embedded Governance (Smart Contracts) = Obligatorio** | "Provides embedded governance (smart contract capability)" | `smartContractSystem.ts` + `embeddedGovernance.ts` (OVNi Gov) |
| **D58** | **Self-Sovereign Identity (DIDs/VCs) = Standard** | DIDs (W3C), VCs, ZK proofs, SSI implementations (Sovrin, uPort) | `digitalIdentitySystem.ts` con DIDs/VCs/SSI como base |
| **D59** | **Identity = Access (not Control)** | "In OVN/OVNi identity should be understood as access... maximising economic freedom" | `accessControlSystem.ts` — Bitcoin-style minimal identity |
| **D60** | **Credentials Auto-constructed from Contributions** | "Access credentials automatically constructed from contribution/participation data" | `credentialSystem.ts` — portable credentials via NRP-CAS traces |
| **D61** | **Data Sovereignty + PSIaaS = Default** | "Irreversibly impossible to identify individual... PSIaaS with PODs" | `dataManagementSystem.ts` — PODs, user-controlled, linkable |
| **D62** | **Semantic Web = Interoperability Layer** | "Semantic web specifically designed to facilitate vocabulary definitions... stack-agnostic" | `semanticInteropLayer.ts` — RDF/SPARQL/OWL/SKOS para ValueFlows |
| **D63** | **ValueFlows = Shared Lexicon for NRP Interop** | "Cross-network & cross-NRP shared lexicon... critical requirements for usability" | `valueFlowsIntegration.ts` — resource types, units, exchanges, ledgers, agents |
| **D64** | **Registries = Dynamic, Consensus-based, Immutable History** | "Registries dynamic, based on consensus, unique at any point, history immutable" | `registrySystem.ts` — Affiliates, Events, Ventures, Resources con property regimes |
| **D65** | **Non-Dominium Property Regime = Native** | "Registry accepts resources under... nondominium. OVN = nondominium form of property" | `propertyRegimeSystem.ts` — nondominium como default para red |
| **D66** | **Contribution Assessment = Automated + Subjective Hybrid** | "Distinction between subjective evaluation and automated component (risk assessment)" | `contributionAssessment.ts` — confidence levels, proof-of-stake validation |
| **D67** | **Logs = Immutable Once Accepted by Redistribution Algorithm** | "No status associated with log... when become contribution... should become immutable" | `contributionLogs.ts` — claim → validated → immutable |
| **D68** | **Fork/Remix at Resource Level = Native UI Capability** | "Implement fork and remix capabilities at UI level... drag resources into category" | `forkRemixSystem.ts` — automatic process creation, history remix |
| **D69** | **Templates = Viral + CC-BY-SA + Branding + Family Grammar** | Elements: viral pointer, instructions, improvement, context, branding, licence, identity | `templateSystem.ts` — How-to family, cumulative best practices |
| **D70** | **Choice Architecture = Debug Behavioral Snags** | "Comprehensive review for behavioral/motivational snags... debug using choice architecture" | `behavioralDebugging.ts` — Thaler & Sunstein principles applied |
| **D71** | **Genesis = Handshake Generativo v1.0** | Bitcoin-style genesis: Initial Core Group → Custodian → OVN Core Group (4 stages) | `genesisProtocol.ts` — handshake generativo que crea nodo nuevo |
| **D72** | **Tokenization = Theoretical Foundation Required** | "Create theoretical foundation for use of tokens in OVN... complete list and compare alternatives" | `tokenizationFramework.ts` — no tokenizar sin fundamento teórico |
| **D73** | **Non-Binary Transaction Systems = Core** | Many-to-one (crowdfunding), one-to-many (redistribution), many-to-many (multi-agent) | `transactionSystems.ts` — non-binary como default, binary como caso especial |
| **D74** | **Non-Market Distribution = Primary** | First-come/first-served, equal sharing, weight, merit, random, majority | `distributionSystems.ts` — non-market primario, market bridge opcional |
| **D75** | **Solidarity Mechanisms = P2P Insurance (Restorative Justice)** | Viney Gupta: "insurance not identity... restorative justice" | `solidaritySystems.ts` — P2P insurance, Teambrella model |
| **D76** | **Trustworthiness by Design = Foundational** | "Develop needed technology and make it trustworthy by default... base development on fundamental values" | `ethosTrustSystem.ts` — trustworthiness built in, not bolted on |
| **D77** | **Legal Theory from Open Network Nature** | "OVNs not siloes... all investors can intervene... securities laws from time when open networks didn't exist" | `legalFramework.ts` — nova legal theory para open networks |
| **D78** | **Network-to-Network = Automated Bridges (No Human Factor)** | "Automate building/installing bridges... take out human factor... next level of p2p evolution" | `networkToNetworkInterfaces.ts` — ITTT/pseudocode based |
| **D79** | **Murmurations = Collective Intelligence Broadcast** | "JSON file with schema + data pulled by dynamic aggregators" | `collectiveIntelligence.ts` — Murmurations protocol |
| **D80** | **DevOps Lifecycle = Continuous High-Quality Delivery** | "Inspired by DevOps... shorten development life cycle, continuous high quality delivery" | `lifecycleManagement.ts` — CI/CD para OVNi |

---

## Módulos de Implementación Requeridos (Actualización Masiva a Pending-Implementations)

### NRP-CAS Core + Contribution Accounting (Capa 3) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `nrpCasCore.ts` | Value Flows (evolved REA+NRP), contribution accounting, transaction logic | `valueFlowsIntegration.ts`, `reaIntegration.ts` | CRÍTICA |
| `contributionAccounting.ts` | Log claims → peer review → validation → immutable contribution | `contributionAssessment.ts`, `contributionLogs.ts` | CRÍTICA |
| `contributionAssessment.ts` | Hybrid: automated (risk-based confidence) + subjective (proof-of-stake) | `reputationSystem.ts`, `agentProfile.ts` | CRÍTICA |
| `contributionLogs.ts` | Claim status tracking: draft → claimed → validated → immutable | `benefitRedistribution.ts` | CRÍTICA |
| `valueEquation.ts` | Benefit redistribution algorithm (project-level, local fairness) | `benefitRedistribution.ts`, `fourRegistries.ts` | CRÍTICA |

### Registry System (Capa 3) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `registrySystem.ts` | Affiliates, Events, Ventures, Resources — dynamic, consensus-based, immutable history | `propertyRegimeSystem.ts`, `consensusMechanisms.ts` | CRÍTICA |
| `propertyRegimeSystem.ts` | Private, shared/communal, commons, nondominium (default for OVN) | `custodianPattern.ts`, `shareablePool.ts` | CRÍTICA |
| `resourceRegistry.ts` | Inventory on NRP-CAS, material/digital resources, metadata (location, dimensions, quality) | `physicalLocationValidation.ts`, `digitalIdentitySystem.ts` | ALTA |

### Needs/Offers + Matching (Capa 3) — **ALTA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `needsOffersMatching.ts` | Web of Needs + ValueFlows ontology, Production side (resources↔projects, agents↔projects) + Market side (products↔consumers) | `valueFlowsIntegration.ts`, `webOfNeedsProtocol.ts` | ALTA |
| `webOfNeedsProtocol.ts` | Conversation for Action: Planning → Identification → Negotiation → Actualization → Post-Actualization | `agreementProtocol.ts` | ALTA |
| `agreementProtocol.ts` | agr:proposes, agr:accepts, modification ontology, needs dependency | `smartContractSystem.ts` | ALTA |

### p2p Infrastructure Stack (Capa 4) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `p2pInfrastructureStack.ts` | Holochain primary, pluggable architecture (Ethereum, Hyperledger, Cosmos, Polkadot, etc.) | `holochainIntegration.ts`, `pluggableArchitecture.ts` | CRÍTICA |
| `holochainIntegration.ts` | Holo hosting, holo-REA compatibility, ValueFlows schemas at API boundary | `valueFlowsIntegration.ts` | CRÍTICA |
| `pluggableArchitecture.ts` | Component framework: Identity, Reputation, Transaction, Crowdsourcing, Voting, Crypto, Performance | `componentRegistry.ts` | ALTA |

### Digital Identity System (Capa 4) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `digitalIdentitySystem.ts` | SSI via DIDs (W3C) + VCs + ZK proofs. Sovrin/uPort implementations. Agent profiles with affiliations + reputation. | `didSystem.ts`, `vcSystem.ts`, `zkProofSystem.ts`, `agentProfile.ts` | CRÍTICA |
| `didSystem.ts` | Decentralised Identifiers: direct encrypted p2p channels, portable across transport/security contexts | `p2pInfrastructureStack.ts` | CRÍTICA |
| `vcSystem.ts` | Verifiable Credentials: claims with provable provenance/immutability, ZK proofs, qualified data exchange | `credentialSystem.ts` | CRÍTICA |
| `agentProfile.ts` | Digital identity representation + agency (AI-enhanced), affiliations/contexts, reputation dimensions | `reputationSystem.ts`, `portableReputation.ts` | ALTA |
| `credentialSystem.ts` | Auto-constructed from contribution data (NRP-CAS traces), portable, ZK-proof verifiable | `contributionAccounting.ts`, `zkProofSystem.ts` | ALTA |

### Access Control + Data Management (Capa 4) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `accessControlSystem.ts` | Permissionless, minimal identity (Bitcoin-style), credentials from contributions | `digitalIdentitySystem.ts`, `credentialSystem.ts` | CRÍTICA |
| `dataManagementSystem.ts` | PSIaaS: PODs (distributed/decentralised/hybrid), user-controlled, linkable (Linked Data), PQC encryption + DLT smart contracts | `podSystem.ts`, `semanticInteropLayer.ts`, `smartContractSystem.ts` | CRÍTICA |
| `podSystem.ts` | Personal Online Data Storage per user at physical location of choice, API-linked to apps, user-authorised | `accessControlSystem.ts` | CRÍTICA |
| `semanticInteropLayer.ts` | RDF/SPARQL/OWL/SKOS for vocabulary definitions, stack-agnostic, p2p interaction without single repository | `valueFlowsIntegration.ts` | ALTA |

### Physical Location + Communication (Capa 4) — **ALTA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `physicalLocationValidation.ts` | FOAM/Open Geolocation Standard, trustless location assessment across network | `geolocationSystem.ts`, `meshNetwork.ts` | ALTA |
| `geolocationSystem.ts` | Where physical things are, where processes take place | `resourceRegistry.ts`, `processManagement.ts` | ALTA |
| `communicationSystem.ts` | Holochat, Scuttlebutt, Dat. Many-to-many, sync+async+persistent, curated/filtered by affiliates/transparent AI | `meshSignals.ts`, `aiCuration.ts` | ALTA |
| `networkToNetworkInterfaces.ts` | Automated bridges (ITTT/pseudocode), repurpose functionality (methods/tools), not federation | `genesisProtocol.ts`, `mitosisProtocol.ts` | ALTA |

### Genesis + Tokenization + Transaction Systems (Capa 5) — **ALTA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `genesisProtocol.ts` | 4 stages: Initial Core Group Multisig → Custodian Multisig → Intermediate Contract → Core Group full control. Handshake generativo v1.0. | `custodianPattern.ts`, `smartContractSystem.ts`, `handshakeProtocol.ts` | ALTA |
| `tokenizationFramework.ts` | Theoretical foundation required. Tokens = discrete entities (quantify/proxy), keys/credentials, ownership. Compare alternatives. | `valueTheory.ts` (OVN 3.0), `currentSeeSystem.ts` | ALTA |
| `transactionSystems.ts` | Non-binary default: many-to-one (crowdfunding), one-to-many (redistribution), many-to-many (multi-agent). Binary as special case. | `distributionSystems.ts`, `valueEquation.ts` | ALTA |
| `distributionSystems.ts` | Non-market primary: FCFS, equal, weight, merit, random, majority. Market bridge optional. Merit-based, non-binary. | `caasCredits.ts`, `valueDual.ts` | ALTA |
| `solidaritySystems.ts` | P2P insurance (Teambrella), restorative justice (insurance > reputation), mutual aid | `reputationSystem.ts`, `caasCredits.ts` | MEDIA |

### Governance + Reputation + Smart Contracts (Capa 2) — **CRÍTICA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `governanceConsensus.ts` | Scope: physical location (network-wide), contribution validation (project-level). Mechanisms per NRP orthogonal dimension. | `networkGovernance.ts`, `projectGovernance.ts` (OVNi Gov) | CRÍTICA |
| `reputationSystem.ts` | Badges (open badges), auto-assigned from contribution behavior, non-transferable, decay over time | `contributionAccounting.ts`, `portableReputation.ts` | CRÍTICA |
| `smartContractSystem.ts` | Ricardian + smart contracts. Upgradability (EtherRouter+Resolver). Security (recovery mode, multi-sig, triggers). | `contractUpgradability.ts`, `contractSecurity.ts` (OVNi Gov) | CRÍTICA |

### Ethos + Trust + Legal (Capa 1) — **ALTA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `ethosTrustSystem.ts` | Trustworthiness by design. Values infused from start. Digital responsibility: literacy, security, privacy, trustworthy algorithms, transparency, human agency. | `universalValues.ts` (OVN 3.0), `accessRights.ts` | ALTA |
| `legalFramework.ts` | Securities laws may not apply (open networks, investors can intervene). Nova legal theory from open network observation. Partner state approach. | `regulatoryInterface.ts`, `accessRights.ts` | ALTA |

### UI/UX + Behavioral + Templates + Fork/Remix (Capa 4) — **MEDIA-ALTA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `uiuxSystem.ts` | Choice architecture (Thaler & Sunstein), optimal choices per context, carefully designed defaults, educational elements at UI level | `behavioralDebugging.ts`, `templateSystem.ts` | ALTA |
| `behavioralDebugging.ts` | Comprehensive review for snags, design charrette, debug using choice architecture principles | `uiuxSystem.ts` | MEDIA |
| `templateSystem.ts` | Viral (pointer to original), instructions, improvement todo, context, branding, CC-BY-SA, family grammar (How-to) | `processTemplates.ts`, `methodTemplates.ts` | ALTA |
| `forkRemixSystem.ts` | Drag resources into category → auto-create process with remixed contribution history. Multiple ways to remix. | `resourceRegistry.ts`, `contributionAccounting.ts` | ALTA |
| `personalWorkspace.ts` | Navigation, orientation, memory. Personal pheromones (breadcrumbs) in communal space. Shareable with others. | `agentProfile.ts`, `meshSignals.ts` | MEDIA |

### AI + Collective Intelligence + Lifecycle (Capa 2-4) — **MEDIA**

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `aiStrategy.ts` | Services analyzing OVN activity → strategic info for agents (projects, processes, resource flows) | `contributionAccounting.ts`, `predictionMarket.ts` | MEDIA |
| `predictionMarket.ts` | Augur-style, complemented by NRP-CAS contribution/participation data | `aiStrategy.ts`, `investmentInterface.ts` | BAJA |
| `collectiveIntelligence.ts` | Murmurations: JSON schema+data broadcast to dynamic aggregators. Collaborative knowledge management. | `semanticInteropLayer.ts`, `dataManagementSystem.ts` | MEDIA |
| `lifecycleManagement.ts` | DevOps: requirements, architecture, programming, testing, maintenance, change mgmt, CI, project mgmt, release | `p2pInfrastructureStack.ts`, `componentRegistry.ts` | MEDIA |

---

## Patrones de Asimilación Directa (1:1 con código)

| Patrón OVNi IT | Módulo HSCSG | Notas |
|----------------|--------------|-------|
| **Value Flows (REA+NRP evolved)** | `valueFlowsIntegration.ts` | GitHub: valueflows/valueflows |
| **Contribution Assessment Hybrid** | `contributionAssessment.ts` | Automated confidence + subjective proof-of-stake |
| **Registries (4 types)** | `registrySystem.ts` | Affiliates, Events, Ventures, Resources |
| **Property Regimes (4)** | `propertyRegimeSystem.ts` | Private, shared, commons, **nondominium default** |
| **Web of Needs + ValueFlows** | `needsOffersMatching.ts` | 5 phases Conversation for Action |
| **Holochain Primary + Pluggable** | `p2pInfrastructureStack.ts` | Agent-centric, permissionless, anonymous |
| **SSI (DIDs/VCs/ZK Proofs)** | `digitalIdentitySystem.ts` | W3C standards, Sovrin/uPort |
| **Credentials from Contributions** | `credentialSystem.ts` | NRP-CAS traces → portable credentials |
| **PSIaaS + PODs** | `dataManagementSystem.ts` | User-controlled, linkable, PQC+DLT |
| **Semantic Web Interop** | `semanticInteropLayer.ts` | RDF/SPARQL/OWL/SKOS, stack-agnostic |
| **FOAM Geolocation** | `physicalLocationValidation.ts` | Trustless location assessment |
| **Non-Binary Transactions** | `transactionSystems.ts` | Many-to-one, one-to-many, many-to-many |
| **Non-Market Distribution** | `distributionSystems.ts` | 6 mechanisms, market bridge optional |
| **P2P Insurance (Restorative)** | `solidaritySystems.ts` | Teambrella, insurance > reputation |
| **Genesis 4 Stages** | `genesisProtocol.ts` | Handshake generativo v1.0 |
| **Tokenization Theory-First** | `tokenizationFramework.ts` | No tokenizar sin fundamento |
| **Trustworthiness by Design** | `ethosTrustSystem.ts` | Values first, not business models |
| **Automated Network Bridges** | `networkToNetworkInterfaces.ts` | ITTT/pseudocode, no human factor |
| **Murmurations** | `collectiveIntelligence.ts` | JSON schema+data broadcast |
| **Fork/Remix UI Native** | `forkRemixSystem.ts` | Drag-drop → auto process creation |
| **Templates (Viral/CC-BY-SA)** | `templateSystem.ts` | How-to family grammar |
| **Choice Architecture Debug** | `behavioralDebugging.ts` | Thaler & Sunstein |
| **Personal Breadcrumbs** | `personalWorkspace.ts` | Pheromones in communal space |

---

## Adaptaciones Profundas (Requieren Rediseño para HSCSG)

| Concepto OVNi IT | Adaptación HSCSG | Razón |
|------------------|------------------|-------|
| **Holochain como única opción** | **Pluggable Architecture (Holochain default)** | HSCSG no se casa con un substrate; Capa 4 debe ser substrate-agnostic |
| **Tokenization como camino principal** | **Tokenization Theory-First + CaaS Credits (D2)** | Tokens solo si fundamento teórico lo justifica; CaaS híbridos como default |
| **Reputation con decay** | **Función Informativa Limitada (D5) — sin decay automático** | Reputación = transparencia competencias/cumplimiento/experiencia, no puntuación |
| **Genesis = token distribution** | **Genesis = Handshake Generativo (Capa 0)** | Arranque de nodo = handshake que cultiva compatibilidad, no airdrop |
| **Exchange Firm necesaria** | **Market Bridge Ético Opcional (DAO-absorbible)** | Intermediario solo si necesario, digital services sin intermediario |
| **Consensus scope limitado** | **Governance Triads (Capa 2) + Project Consensus (Capa 3)** | Consenso solo donde necesario; CDS/FRS/OAD en Capa 2 |
| **Legal = partner state only** | **Legal Framework + Regulatory Interface + Capa 1 Hard Limits** | Límites ecológicos/autonomía no negociables (Capa 1) |
| **Identity = DID/VC obligatorio** | **Identity = Access (Bitcoin-style minimal) + DID/VC opcional** | Minimal info principle; DID/VC para contextos que lo requieran |
| **Data = PSIaaS obligatorio** | **Data Sovereignty + PSIaaS como opción** | User control default; PSIaaS para quien lo necesite |

---

## Conceptos Rechazados (Incompatibles con HSCSG)

| Concepto OVNi IT | Por qué se rechaza en HSCSG |
|------------------|----------------------------|
| **Token-first architecture** | HSCSG: value-first (TQ/CaaS), tokens solo si fundamento teórico |
| **Reputation as gatekeeper** | HSCSG: reputación solo informativa, no transferible, no puntuación global |
| **Mandatory Exchange Firm** | HSCSG: Market Bridge opcional, DAO-absorbible |
| **Single p2p substrate lock-in** | HSCSG: pluggable architecture, substrate-agnostic Capa 4 |
| **Consensus for everything** | HSCSG: consensus solo donde necesario (scope), Capa 2 triads para meta-governance |
| **Legal vacuum acceptance** | HSCSG: Capa 1 define límites duros (ecológicos, autonomía, continuidad) |
| **Fixed identity (DID mandatory)** | HSCSG: fluid identity = access, minimal info, context-sensitive |
| **Centralized data lakes** | HSCSG: PODs user-controlled, decentralised, linkable |

---

## Vasos Comunicantes (Actualización Completa)

| Módulo OVNi IT | Conecta con | Tipo de Conexión |
|----------------|-------------|------------------|
| `nrpCasCore.ts` | `valueFlowsIntegration.ts`, `reaIntegration.ts`, `contributionAccounting.ts` | Core accounting |
| `contributionAccounting.ts` | `contributionAssessment.ts`, `contributionLogs.ts`, `benefitRedistribution.ts`, `credentialSystem.ts` | Pipeline contribuciones |
| `registrySystem.ts` | `propertyRegimeSystem.ts`, `resourceRegistry.ts`, `networkGovernance.ts` (OVNi Gov) | Estado de la red |
| `needsOffersMatching.ts` | `webOfNeedsProtocol.ts`, `agreementProtocol.ts`, `smartContractSystem.ts` | Coordinación producción |
| `p2pInfrastructureStack.ts` | `holochainIntegration.ts`, `pluggableArchitecture.ts`, `componentRegistry.ts` | Substrate |
| `digitalIdentitySystem.ts` | `didSystem.ts`, `vcSystem.ts`, `agentProfile.ts`, `credentialSystem.ts`, `accessControlSystem.ts` | Identidad → acceso |
| `dataManagementSystem.ts` | `podSystem.ts`, `semanticInteropLayer.ts`, `smartContractSystem.ts` | Datos → interop |
| `physicalLocationValidation.ts` | `geolocationSystem.ts`, `resourceRegistry.ts`, `meshNetwork.ts` | Ubicación física |
| `communicationSystem.ts` | `meshSignals.ts`, `aiCuration.ts`, `networkToNetworkInterfaces.ts` | Comunicación |
| `genesisProtocol.ts` | `custodianPattern.ts`, `handshakeProtocol.ts`, `mitosisProtocol.ts`, `smartContractSystem.ts` | Arranque nodo |
| `tokenizationFramework.ts` | `valueTheory.ts`, `currentSeeSystem.ts`, `caasCredits.ts` | Tokens → valor |
| `transactionSystems.ts` | `distributionSystems.ts`, `valueEquation.ts`, `caasCredits.ts` | Transacciones |
| `governanceConsensus.ts` | `networkGovernance.ts`, `projectGovernance.ts`, `governanceTriads.ts` | Gobernanza |
| `reputationSystem.ts` | `contributionAccounting.ts`, `portableReputation.ts`, `agentProfile.ts` | Reputación |
| `smartContractSystem.ts` | `contractUpgradability.ts`, `contractSecurity.ts`, `embeddedGovernance.ts` | Smart contracts |
| `ethosTrustSystem.ts` | `universalValues.ts`, `accessRights.ts`, `autonomyGuard.ts` | Ética/confianza |
| `legalFramework.ts` | `regulatoryInterface.ts`, `accessRights.ts` | Legal |
| `uiuxSystem.ts` | `behavioralDebugging.ts`, `templateSystem.ts`, `personalWorkspace.ts` | UX/Comportamiento |
| `forkRemixSystem.ts` | `resourceRegistry.ts`, `contributionAccounting.ts`, `templateSystem.ts` | Fork/Remix |
| `collectiveIntelligence.ts` | `semanticInteropLayer.ts`, `dataManagementSystem.ts`, `murmurationsProtocol.ts` | Inteligencia colectiva |

---

## KPIs de Validación (Fase 0 - OVNi IT Integration)

### NRP-CAS Core
- [ ] `nrpCasCore.ts`: ValueFlows schemas loaded, REA events processed, contribution accounting functional
- [ ] `contributionAccounting.ts`: Log creation → peer review (red flag) → validation → immutable status
- [ ] `contributionAssessment.ts`: Automated confidence calculation (60%→90% via hardware prototype validation), proof-of-stake subjective validation
- [ ] `contributionLogs.ts`: Status transitions tracked, immutability enforced post-redistribution
- [ ] `valueEquation.ts`: Project-level execution, local fairness notion, integration with 4 registries

### Registry System
- [ ] `registrySystem.ts`: 4 registry types CRUD, dynamic updates, consensus-based, immutable history
- [ ] `propertyRegimeSystem.ts`: 4 regimes functional, nondominium default for network resources
- [ ] `resourceRegistry.ts`: Inventory sync with NRP-CAS, material/digital metadata complete

### p2p Infrastructure
- [ ] `p2pInfrastructureStack.ts`: Holochain primary functional, pluggable component registry (Identity, Reputation, Transaction, Crowdsourcing, Voting, Crypto, Performance)
- [ ] `holochainIntegration.ts`: holo-REA API boundary schemas working, ValueFlows integration

### Digital Identity + Access
- [ ] `digitalIdentitySystem.ts`: DIDs created/resolved, VCs issued/verified, ZK proofs functional
- [ ] `credentialSystem.ts`: Auto-construction from NRP-CAS traces, portable, ZK-verifiable
- [ ] `accessControlSystem.ts`: Permissionless registration, minimal identity, Bitcoin-style access verified

### Data Management
- [ ] `dataManagementSystem.ts`: PSIaaS PODs created (distributed/decentralised/hybrid), user-controlled, Linked Data linkable
- [ ] `semanticInteropLayer.ts`: RDF/SPARQL/OWL/SKOS vocabulary definitions, stack-agnostic p2p interaction

### Physical + Communication
- [ ] `physicalLocationValidation.ts`: FOAM integration, trustless location assessment across network
- [ ] `communicationSystem.ts`: Many-to-many, sync+async+persistent, AI curation/filtering functional

### Genesis + Economics
- [ ] `genesisProtocol.ts`: 4 stages executed, handshake generativo v1.0 creates new functional node
- [ ] `transactionSystems.ts`: Non-binary transactions (3 types) functional, binary as special case
- [ ] `distributionSystems.ts`: 6 non-market mechanisms functional, market bridge optional
- [ ] `solidaritySystems.ts`: P2P insurance operational, restorative justice model

### Governance + Smart Contracts
- [ ] `governanceConsensus.ts`: Physical location consensus (network), contribution validation (project)
- [ ] `smartContractSystem.ts`: Ricardian + smart contracts, EtherRouter+Resolver upgradability, recovery mode multi-sig
- [ ] `reputationSystem.ts`: Badges auto-assigned, non-transferable, decay configurable

### UX + Behavioral + Templates
- [ ] `uiuxSystem.ts`: Choice architecture implemented, optimal choices per context, educational UI elements
- [ ] `behavioralDebugging.ts`: Snag review completed, design charrette executed, fixes deployed
- [ ] `templateSystem.ts`: Viral pointers, instructions, improvement tracking, CC-BY-SA, How-to family grammar
- [ ] `forkRemixSystem.ts`: Drag-drop resource merging → auto process creation with remixed history
- [ ] `personalWorkspace.ts`: Navigation/orientation/memory, breadcrumbs in communal space, shareable

### Collective Intelligence + Lifecycle
- [ ] `collectiveIntelligence.ts`: Murmurations broadcast functional, dynamic aggregators pulling JSON
- [ ] `lifecycleManagement.ts`: DevOps pipeline operational, CI/CD for OVNi components

---

## Referencias a Documentos Fuente (para trazabilidad)

| Sección Backup | Módulo(s) HSCSG | Notas |
|----------------|-----------------|-------|
| Orientation (Nondominium, Consortium) | `genesisProtocol.ts`, `p2pInfrastructureStack.ts` | Nondominium = most advanced 2026 project |
| Funding Efforts | `investmentInterface.ts` | Grants, crowdfunding, Moloch DAOs |
| Methodology (New Considerations) | `p2pInfrastructureStack.ts`, `semanticInteropLayer.ts`, `digitalIdentitySystem.ts` | DLT, DIDs, VCs, ZK, AI, Patterns, Complexity, Interop |
| Todos (Criteria) | `p2pInfrastructureStack.ts`, `accessControlSystem.ts`, `digitalIdentitySystem.ts` | Agent-centric, permissionless, anonymous, SSI |
| High Level Ideas (dWeb Psychology) | `reputationSystem.ts`, `governanceConsensus.ts`, `behavioralDebugging.ts` | Tit-for-tat, reputation management, forgiveness |
| Scalability Trilemma | `p2pInfrastructureStack.ts`, `autonomyGuard.ts` | Scale, decentralization, security tradeoffs |
| State of the Art | `p2pInfrastructureStack.ts` | Holochain, Ethereum, Hyperledger, Tezos, Liquid, Polkadot, Cosmos |
| Application Level Requirements | `componentRegistry.ts`, `uiuxSystem.ts` | Pluggable components, UI levels |
| Current NRP (ValueFlows, REA) | `nrpCasCore.ts`, `valueFlowsIntegration.ts`, `reaIntegration.ts` | Core logic |
| Issues with Current NRP | `contributionAccounting.ts`, `contributionAssessment.ts` | GitHub issues → new requirements |
| Structured Interoperability | `valueFlowsIntegration.ts`, `semanticInteropLayer.ts`, `registrySystem.ts` | Cross-network lexicon, web API |
| OVN Genesis (All Options) | `genesisProtocol.ts`, `tokenizationFramework.ts` | Airdrop, Hatch, Bitcoin-style, 4 stages |
| Access Layer (Digital Identity) | `digitalIdentitySystem.ts`, `agentProfile.ts`, `credentialSystem.ts`, `accessControlSystem.ts` | SSI, DIDs, VCs, ZK, minimal identity |
| Trust/Accountability | `ethosTrustSystem.ts`, `reputationSystem.ts` | Literature references, game theory |
| Use Case Layer (Data Management) | `dataManagementSystem.ts`, `podSystem.ts`, `semanticInteropLayer.ts` | PSIaaS, PODs, data governance |
| Database (Server-client + Holochain) | `nrpCasCore.ts`, `holochainIntegration.ts` | SQLite vs Holo-REA API boundary |
| Physical Location (FOAM) | `physicalLocationValidation.ts`, `geolocationSystem.ts` | Trustless geolocation |
| Registries (4 types) | `registrySystem.ts`, `propertyRegimeSystem.ts`, `resourceRegistry.ts` | Inclusion/exclusion rules, nondominium |
| Needs/Offers (Web of Needs) | `needsOffersMatching.ts`, `webOfNeedsProtocol.ts`, `agreementProtocol.ts` | 5 phases, ValueFlows ontology |
| Prediction Market | `predictionMarket.ts`, `aiStrategy.ts` | Augur, NRP-CAS data complement |
| AI Strategy | `aiStrategy.ts` | EC incubator/accelerator |
| Personal Workspace | `personalWorkspace.ts` | Navigation, breadcrumbs, tension personal/collaborative |
| Investment | `investmentInterface.ts` | Impak, OpenCollective, CoBudget |
| Solidarity (P2P Insurance) | `solidaritySystems.ts` | Teambrella, restorative justice |
| Infrastructure Layer (Contracts) | `smartContractSystem.ts`, `contractUpgradability.ts`, `contractSecurity.ts` | Category primitives, Ricardian |
| Current-see for Use-Value | `currentSeeSystem.ts` (OVN 3.0) | Sensorica current-see doc |
| Transaction Systems | `transactionSystems.ts`, `distributionSystems.ts` | Token/non-token, market/non-market, non-binary |
| Communication System | `communicationSystem.ts`, `networkToNetworkInterfaces.ts` | Holochat, Scuttlebutt, Dat, automated bridges |
| Reputation System | `reputationSystem.ts`, `portableReputation.ts` | Badges, decay, non-transferable |
| Governance & Consensus | `governanceConsensus.ts` | Scope, mechanisms per NRP dimension |
| Protocol Layer (Contribution Assessment) | `contributionAssessment.ts` | Automated + subjective hybrid |
| Ledgers | `contributionLogs.ts`, `tqLedger.ts` | Time-stamped socioeconomic events |
| Lifecycle Management | `lifecycleManagement.ts` | DevOps inspired |
| Sensorica Core Capabilities | `nrpCasCore.ts`, `contributionAccounting.ts`, `governanceConsensus.ts` | Identity/reputation/participation, process orchestration, CAS |
| Legal (Securities Laws) | `legalFramework.ts` | Open networks ≠ siloes, nova legal theory |
| Ethos/Trust | `ethosTrustSystem.ts` | Ethics vs morals, trustworthiness by design, digital responsibility |
| UI/UX Development | `uiuxSystem.ts` | Open document reference |
| Network-to-Network | `networkToNetworkInterfaces.ts`, `genesisProtocol.ts`, `mitosisProtocol.ts` | Automated bridges, ITTT |
| Lists | `uiuxSystem.ts`, `behavioralDebugging.ts` | AI-filtered, choice architecture |
| Behavioral Snags | `behavioralDebugging.ts` | Comprehensive review, design charrette |
| Templates | `templateSystem.ts` | Viral, instructions, improvement, context, branding, CC-BY-SA, family grammar |
| Collective Intelligence | `collectiveIntelligence.ts`, `murmurationsProtocol.ts` | Murmurations JSON broadcast |
| Fork/Remix | `forkRemixSystem.ts` | UI-level, drag-drop, auto process creation |
| Logs in NRP-CAS | `contributionLogs.ts` | Claim → validated → immutable |
| Appendix A (Ostrom, Rheingold) | `governanceConsensus.ts`, `uiuxSystem.ts`, `networkToNetworkInterfaces.ts` | 8 principles, 13 wiki advice |

---

## Próximos Pasos Inmediatos (Orden de Ejecución Actualizado)

### **BLOQUE 1: NRP-CAS Core + Registries (Semanas 1-2) — CRÍTICO**
1. `nrpCasCore.ts` + `valueFlowsIntegration.ts` + `reaIntegration.ts`
2. `contributionAccounting.ts` + `contributionAssessment.ts` + `contributionLogs.ts`
3. `registrySystem.ts` + `propertyRegimeSystem.ts` + `resourceRegistry.ts`
4. `valueEquation.ts` + `benefitRedistribution.ts` (integración con 4 registries)

### **BLOQUE 2: p2p Infrastructure + Digital Identity (Semanas 2-3) — CRÍTICO**
5. `p2pInfrastructureStack.ts` + `holochainIntegration.ts` + `pluggableArchitecture.ts`
6. `digitalIdentitySystem.ts` + `didSystem.ts` + `vcSystem.ts` + `zkProofSystem.ts`
7. `agentProfile.ts` + `credentialSystem.ts` + `accessControlSystem.ts`

### **BLOQUE 3: Data + Physical + Communication (Semanas 3-4) — ALTA**
8. `dataManagementSystem.ts` + `podSystem.ts` + `semanticInteropLayer.ts`
9. `physicalLocationValidation.ts` + `geolocationSystem.ts`
10. `communicationSystem.ts` + `networkToNetworkInterfaces.ts`

### **BLOQUE 4: Genesis + Economics + Governance (Semanas 4-5) — ALTA**
11. `genesisProtocol.ts` + `tokenizationFramework.ts` (theory-first)
12. `transactionSystems.ts` + `distributionSystems.ts` + `solidaritySystems.ts`
13. `governanceConsensus.ts` + `reputationSystem.ts` + `smartContractSystem.ts`

### **BLOQUE 5: UX + Behavioral + Templates + AI (Semanas 5-6) — MEDIA-ALTA**
14. `uiuxSystem.ts` + `behavioralDebugging.ts` + `templateSystem.ts`
15. `forkRemixSystem.ts` + `personalWorkspace.ts`
16. `aiStrategy.ts` + `collectiveIntelligence.ts` + `lifecycleManagement.ts`

### **BLOQUE 6: Integración Capa 1 + Validación (Semana 6+) — CRÍTICO**
17. `ethosTrustSystem.ts` + `legalFramework.ts` + `universalValues.ts` + `accessRights.ts`
18. **Validación completa KPIs Fase 0** — todos los checkboxes verdes
19. **Commit + push + tag** con mensaje trazable
20. **Pasar a Zeitnus Economic Model Fases 1-2** (TQ-anchored synthesis)

---

## Notas de Implementación Críticas

1. **Principio Anfibio en TODO**: `valueDual.ts` + `nodeMode`/`priceParity` en store. Misma lógica opera en modo postmonetario (ZNU/CaaS offline default) o conectado (USD/USDC via oracle). El render decide la etiqueta.

2. **Handshake Generativo = Capa 0**: `genesisProtocol.ts` implementa handshake que **cultiva compatibilidad** (no la verifica). El nodo nuevo nace con capacidad de handshake; primer acto = handshake con nodo padre.

3. **Mitosis Protocol**: `genesisProtocol.ts` + `mitosisProtocol.ts` = replicación del protocolo de reconocimiento, no de la forma. Hijo hereda Kit 72H v2.0 + handshake capability.

4. **OVN = Capa 3 dentro de HSCSG**: Todos los módulos Capa 3 (`nrpCasCore`, `registrySystem`, `needsOffersMatching`, `benefitRedistribution`) son **subordinados a Capas 1-2** (autonomía/regeneración/continuidad, gobernanza/conocimiento).

5. **RMR Paralelo a ITC**: `metabolicAccounting.ts` (Capa 4) corre paralelo a `contributionAccounting.ts` (Capa 3). 7 flujos metabólicos + 7 indicadores autonomía.

6. **No duplicar tipos**: Types en `lib/` re-exportados. `src/core/lib/` = source of truth.

7. **Pantallas nuevas**: SIEMPRE `Aside.tsx` + `i18n` + `lucide` imports en Aside.

8. **Git Bash para venv**: `source venv/Scripts/activate` en Git Bash, no PowerShell.

9. **CHANGELOG/docs sensibles**: SOLO local, copias en `~/`, `~/Documents`, `~/Desktop`; NO subir a GitHub.

10. **Spanish-first mandatory**: Todo código, docs, UI en español. i18n keys ES/EN/PT.