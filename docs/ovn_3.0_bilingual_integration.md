# OVN 3.0 - Versión Bilingüe — Integración HSCSG/Zeitnus

**Fecha**: 2026-11-07  
**Backup**: `docs/ovn_3.0_bilingual_backup.md`  
**Origen**: Sensorica OVN 3.0 (Google Docs co-creation, marzo 2019)  
**Licencia**: CC BY-NC-SA — ideas extraíbles libremente, no copiar texto para venta  

---

## Tesis de Integración

OVN 3.0 es el **documento fundacional del modelo organizativo** que se posiciona como **Capa 3 (Operación Productiva)** dentro de la arquitectura canónica Zeitnus de 5 capas. Proporciona:
- **Filosofía central**: crowdthinking + crowdsourcing optimizados via estigmergia
- **Modelo socioeconómico**: commons-based peer production de bienes materiales
- **Teoría del valor**: value sovereignty, current-sees, multivalue incentive system
- **Estructura organizativa**: Network + Custodian + Interfaces (Exchange Firms)
- **Consideraciones legales**: enfoque ecosistémico, multi-stakeholder, partner state

**No es el modelo económico rector de HSCSG** — es el motor de coordinación productiva que opera dentro de límites definidos por Capas 1-2 (Autonomía/Regeneración/Continuidad, Gobernanza/Conocimiento).

---

## Mapeo Directo a Arquitectura Zeitnus (5 Capas)

| Capa Zeitnus | Concepto OVN 3.0 | Módulo HSCSG | Estado |
|--------------|------------------|--------------|--------|
| **Capa 3: Operación Productiva** | OVN Organizational Model (Network, Custodian, Interfaces) | `ovnOrganizationalModel.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Value Theory (Value Sovereignty, Current-sees) | `valueTheory.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Motivation/Incentive Models (5 models) | `incentiveModels.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Crowdthinking/Crowdsourcing + Stigmergy | `crowdProcesses.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | P2P Social Dynamics (4 rules, 5 values) | `p2pSocialDynamics.ts` | 🔄 Asimilar |
| **Capa 1: Propósito/Límites** | Purpose-based Organizations | `purposeBasedOrg.ts` | 🔄 Asimilar |
| **Capa 1: Propósito/Límites** | Legal/Regulatory (Ecosystemic approach) | `legalFramework.ts` | 🔄 Asimilar |
| **Capa 4: Infraestructura Metabólica** | Digital Environment (UX/UI) | `digitalEnvironment.ts` | 🔄 Asimilar |
| **Capa 5: Transición Económica** | Propagation Models (Initiation ritual) | `propagationModels.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | IT Infrastructure (ref OVNi 3.0) | `itInfrastructure.ts` | 🔄 Asimilar |

---

## Decisiones EBD (Evidence-Based Decisions) — Derivadas de este Documento

| ID | Decisión | Justificación OVN 3.0 | Implementación HSCSG |
|----|----------|------------------------|----------------------|
| **D36** | **Crowdthinking + Crowdsourcing = Dual Core Process** | "Best model optimises crowdthinking and crowdsourcing. That model relies on stigmergy" | `crowdProcesses.ts` con dual engine: cognitive (thinking) + material (sourcing) |
| **D37** | **Stigmergia = Coordination Protocol (Capa 2)** | "Work must be done in same environment... stigmergic coordination using volatile signals" | `stigmergicCoordination.ts` (ya en pending) + `meshSignals.ts` como feromonas digitales |
| **D38** | **Value Sovereignty = Affiliates Decide Participation↔Distribution** | "Autonomous agents collectively decide in context how to link participation with distribution" | `valueSovereignty.ts` — no central authority, context-decided value equations |
| **D39** | **Current-sees = Universal Flow Language** | "Any symbolic system that organizes flows... we swim in non-monetary current-sees" | `currentSeeSystem.ts` — grades, credits, ratings, certifications, TQ, CaaS credits unificados |
| **D40** | **Multivalue Incentive System (5 models)** | Revenue/Equity/Utility/Reputation/Gift — todos coexisten, no single model | `incentiveModels.ts` con 5 tracks paralelos, user chooses per contribution |
| **D41** | **Fluid Equity = Investment Translation** | "Any contribution as form of investment translated into fluid equity" | `fluidEquity.ts` (ya en pending) — contribution → investment → equity fluida |
| **D42** | **Purpose-Based Org = Anti-Power-Grabbing** | "Purpose-based orgs exist to fulfill social function... avoid power grabbing mechanisms" | `purposeBasedOrg.ts` con anti-capture mechanisms (custodian temporal, recall, immune rights) |
| **D43** | **Network = Open, Not Agents** | "It is the network that is open" — affiliates can be anonymous, minimal info principle | `networkOpenness.ts` — open network, permissionless agents, Bitcoin-style minimal identity |
| **D44** | **4 Ecosystem Rules = Governance Constraints** | Keystone agents, trophic cascades, food-regulated pattern, diverse resilience | `ecosystemRules.ts` — hard constraints en Capa 1 (autonomy guard) |
| **D45** | **5 Universal Values = Ethical Baseline** | Care, honesty, responsibility, respect, fairness | `universalValues.ts` — embedded en todas las capas, no negociables |
| **D46** | **Stigmergy 4 Features = Signal Design** | Simplicity, specificity, predictability, automatism | `signalDesign.ts` — feromonas digitales con estas 4 propiedades |
| **D47** | **4 Pheromone Classes = Signal Types** | Tracing, Alarm, Priming/Triggering, Free/Signaling | `signalTypes.ts` — 4 tipos de señales mesh con semántica distinta |
| **D48** | **Convergence Mechanisms = Anti-Fragmentation** | Feedback maps, incentives, purpose communication, community aspect | `convergenceMechanisms.ts` — 4 mecanismos para reducir proliferación horizontal |
| **D49** | **Learning Layers = Adaptive Capacity** | Requisite variety, recursive/reflective, single/double loop | `learningLayers.ts` — autopoietic adaptation capacity |
| **D50** | **Anti-Rival Data = Commons Default** | "Data, information, knowledge are anti-rival and gain value through sharing" | `antiRivalCommons.ts` — default commons, artificial scarcity prohibited |
| **D51** | **Ecosystemic Legal Approach = Partner State** | "Estado DOIT adoptar actitud de estado partner... proceso inclusivo participativo" | `legalFramework.ts` — partner state methodology, p2p networks as regulatory partners |
| **D52** | **Initiation Ritual = Propagation Protocol** | "Initiation is a ritual, bundle of processes... distributed, not centralized" | `propagationModels.ts` — initiation ritual como handshake generativo v1.0 |
| **D53** | **OVN Structure = 3 Entities** | Network, Custodian, Interfaces (Exchange Firms + others) | `ovnStructure.ts` — 3 entidades core con responsabilidades definidas |

---

## Módulos de Implementación Requeridos

### Core Organizational Model (Capa 3)

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `ovnOrganizationalModel.ts` | Network + Custodian + Interfaces (Exchange Firms), affiliados, value sovereignty | `custodianPattern.ts`, `exchangeFirmProtocol.ts`, `networkOpenness.ts` | CRÍTICA |
| `valueTheory.ts` | Value sovereignty, relational theory, working definition, current-sees | `currentSeeSystem.ts`, `valueDual.ts` | CRÍTICA |
| `currentSeeSystem.ts` | Universal flow language: grades, credits, ratings, certifications, TQ, CaaS credits | `valueDual.ts`, `tqLedger.ts`, `caasCredits.ts` | CRÍTICA |
| `incentiveModels.ts` | 5 tracks: Revenue, Equity, Utility, Reputation, Gift — parallel, user-chosen per contribution | `benefitRedistribution.ts`, `fluidEquity.ts`, `caasCredits.ts`, `portableReputation.ts` | CRÍTICA |
| `fluidEquity.ts` | Contribution → investment → fluid equity translation, dynamic valuation | `contributionAccounting.ts`, `valueSystem.ts` | CRÍTICA |

### Crowd Processes + Stigmergy (Capa 2)

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `crowdProcesses.ts` | Dual engine: crowdthinking (cognitive) + crowdsourcing (material), shared understanding phase | `stigmergicCoordination.ts`, `collectiveIntelligence.ts` | CRÍTICA |
| `stigmergicCoordination.ts` | Volatile signals in shared environment, discoverable by peers, 4 signal types | `meshSignals.ts`, `signalDesign.ts`, `signalTypes.ts` | CRÍTICA |
| `signalDesign.ts` | 4 properties: simplicity, specificity, predictability, automatism | `meshSignals.ts` | ALTA |
| `signalTypes.ts` | Tracing, Alarm, Priming/Triggering, Free/Signaling — distinct semantics | `meshSignals.ts` | ALTA |
| `convergenceMechanisms.ts` | 4 mechanisms: feedback maps, incentive bias, purpose communication, community aspect | `incentiveSystems.ts`, `projectAnimators.ts` | ALTA |
| `p2pSocialDynamics.ts` | 4 ecosystem rules + 5 universal values as hard constraints | `autonomyGuard.ts`, `universalValues.ts` | ALTA |
| `learningLayers.ts` | Requisite variety, recursive/reflective, single/double loop for autopoietic adaptation | `complexityGovernance.ts`, `adaptiveSystems.ts` | MEDIA |

### Purpose & Legal (Capa 1)

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `purposeBasedOrg.ts` | Social function, money as means, anti-power-grabbing mechanisms | `custodianPattern.ts`, `governanceTriads.ts`, `immuneRights.ts` | CRÍTICA |
| `legalFramework.ts` | Ecosystemic approach, partner state, multi-stakeholder, p2p as regulatory partners | `accessRights.ts`, `regulatoryInterface.ts` | ALTA |
| `networkOpenness.ts` | Open network, permissionless agents, minimal info principle (Bitcoin-style) | `agentProfile.ts` (OVNi IT), `accessControl.ts` | ALTA |

### Digital & Propagation (Capas 4-5)

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `digitalEnvironment.ts` | UX/UI for stigmergic coordination, shared environment | `stigmergicCoordination.ts`, `meshSignals.ts` | MEDIA |
| `propagationModels.ts` | Initiation ritual as generative handshake v1.0, distributed propagation | `mitosisProtocol.ts`, `handshakeProtocol.ts` | ALTA |
| `itInfrastructure.ts` | Reference to OVNi 3.0 (separate doc) | `ovni3ITIntegration.ts` | MEDIA |

---

## Patrones de Asimilación Directa (1:1 con código)

| Patrón OVN 3.0 | Módulo HSCSG | Notas |
|----------------|--------------|-------|
| **Crowdthinking methodology** (60% shared understanding) | `collectiveIntelligence.ts` | Fase inicial building collective brain |
| **Crowdsourcing = pool of shareables** | `shareablePool.ts` (ya en pending) | Money, tools, equipment, materials |
| **Commons = shared memory/knowledge** | `commonsKnowledge.ts` | Anti-rival, gains value sharing |
| **Current-sees as flow language** | `currentSeeSystem.ts` | Unifica TQ, CaaS, ratings, certifications |
| **5 incentive models parallel** | `incentiveModels.ts` | User chooses per contribution context |
| **Fluid equity translation** | `fluidEquity.ts` | Contribution = investment |
| **Stigmergic signals (4 types)** | `signalTypes.ts` + `meshSignals.ts` | Tracing, Alarm, Priming, Free |
| **Convergence mechanisms (4)** | `convergenceMechanisms.ts` | Feedback, incentives, purpose, community |
| **Ecosystem rules (4)** | `ecosystemRules.ts` | Keystone, trophic cascades, food-regulated, resilience |
| **Universal values (5)** | `universalValues.ts` | Care, honesty, responsibility, respect, fairness |
| **Initiation ritual** | `propagationModels.ts` | Distributed, recipe-based, Ouishare drinks pattern |
| **OVN Structure (3 entities)** | `ovnOrganizationalModel.ts` | Network, Custodian, Interfaces |

---

## Adaptaciones Profundas (Requieren Rediseño para HSCSG)

| Concepto OVN 3.0 | Adaptación HSCSG | Razón |
|------------------|------------------|-------|
| **Fluid Equity como equity económico** | **4 Registros Separados (D4)** | Fluid equity mezcla contribution/responsibility/usage/benefits — separar en 4 registros |
| **Reputation-based incentives** | **Función Informativa Limitada (D5)** | No gatekeeping por reputación — solo transparencia competencias/cumplimiento/experiencia |
| **Exchange Firm como interface mercado** | **Market Bridge Ético (D5)** | Intermediario opcional, subordinado a autonomía/regeneración, DAO-absorbible |
| **Network openness = permissionless** | **Acceso Incondicional (D9) + Capa 3 permissioned** | Red abierta, pero gobernanza Capa 3 requiere stake en proyecto (Access to Benefits Algorithm) |
| **Legal = partner state approach** | **Partner State + Regulatory Interface** | Estado como socio, pero HSCSG define límites ecológicos no negociables (Capa 1) |
| **Purpose-based = social function** | **Propósito = Autonomía/Regeneración/Continuidad (Capa 1)** | Función social específica: reducir dependencia empleo/escasez/intercambio monetario |
| **Anti-power-grabbing mechanisms** | **Custodian fiduciario temporal + recall + immune rights** | Mecanismos concretos implementables, no solo intención |
| **Current-sees unificados** | **TQ=1kWh denominador universal (D1) + CaaS híbridos (D2)** | Current-sees → TQ ledger + CaaS credits con priceParity oracle |

---

## Conceptos Rechazados (Incompatibles con HSCSG)

| Concepto OVN 3.0 | Por qué se rechaza en HSCSG |
|------------------|----------------------------|
| **Market-based valuation como default** | HSCSG: non-market-based valuations primarios, market bridge solo interfaz opcional |
| **Reputation como currency/gatekeeper** | HSCSG: reputación solo informativa, no transferible, no puntuación global |
| **Fluid equity como único registro valor** | HSCSG: 4 registros separados (D4) — contribución, responsabilidad, uso recursos, beneficios |
| **Exchange firm necesaria para mercado** | HSCSG: Market Bridge opcional, DAO-absorbible, digital services sin intermediario |
| **Legal vacuum → partner state only** | HSCSG: límites ecológicos/autonomía no negociables (Capa 1) + regulatory interface |
| **Unbounded network growth** | HSCSG: viabilidad territorial 7 generaciones (AUT/CDS/ZNU) — límites biofísicos |
| **Crowdsourcing = resource pooling only** | HSCSG: crowdsourcing + crowdthinking dual, estigmergia coordina ambos |

---

## Vasos Comunicantes con Otros Módulos

| Módulo OVN 3.0 | Conecta con | Tipo de Conexión |
|----------------|-------------|------------------|
| `ovnOrganizationalModel.ts` | `custodianPattern.ts`, `exchangeFirmProtocol.ts`, `networkGovernance.ts` (OVNi Gov) | Estructura 3 entidades |
| `valueTheory.ts` | `valueDual.ts`, `tqLedger.ts`, `currentSeeSystem.ts` | Teoría valor → implementación |
| `currentSeeSystem.ts` | `tqLedger.ts`, `caasCredits.ts`, `reputationSystem.ts` | Lenguaje flujos unificado |
| `incentiveModels.ts` | `benefitRedistribution.ts`, `fluidEquity.ts`, `caasCredits.ts` | 5 tracks → distribución |
| `fluidEquity.ts` | `contributionAccounting.ts`, `valueSystem.ts`, `fourRegistries.ts` | Inversión → 4 registros |
| `crowdProcesses.ts` | `collectiveIntelligence.ts`, `stigmergicCoordination.ts` | Dual engine coordinación |
| `stigmergicCoordination.ts` | `meshSignals.ts`, `signalDesign.ts`, `signalTypes.ts`, `convergenceMechanisms.ts` | Señales + convergencia |
| `p2pSocialDynamics.ts` | `autonomyGuard.ts`, `universalValues.ts`, `ecosystemRules.ts` | Constraints Capa 1 |
| `purposeBasedOrg.ts` | `governanceTriads.ts`, `accessRights.ts`, `immuneRights.ts` | Propósito → gobernanza |
| `legalFramework.ts` | `regulatoryInterface.ts`, `accessRights.ts` | Legal → derechos |
| `propagationModels.ts` | `mitosisProtocol.ts`, `handshakeProtocol.ts`, `embryoNetworkIncubation.ts` | Propagación = mitosis |

---

## KPIs de Validación (Fase 0)

- [ ] `ovnOrganizationalModel.ts`: Network/Custodian/Interfaces CRUD, affiliados management, value sovereignty verification
- [ ] `valueTheory.ts`: Relational value theory operations, value sovereignty decision making
- [ ] `currentSeeSystem.ts`: 10+ current-see types registered, conversion/translation between types, TQ as universal denominator
- [ ] `incentiveModels.ts`: 5 tracks functional, user can select per contribution, distribution algorithms per track
- [ ] `fluidEquity.ts`: Contribution → investment → equity translation, dynamic valuation, 4 registries separation
- [ ] `crowdProcesses.ts`: Crowdthinking phase (shared understanding building), crowdsourcing pool operations, stigmergic coordination integration
- [ ] `stigmergicCoordination.ts`: Signal emit/receive, 4 signal types, discoverability in shared environment
- [ ] `signalDesign.ts`: 4 properties verified (simplicity, specificity, predictability, automatism)
- [ ] `signalTypes.ts`: Tracing, Alarm, Priming, Free — distinct semantics, appropriate responses
- [ ] `convergenceMechanisms.ts`: Feedback maps generated, incentive bias functional, purpose communication tracked, community health metrics
- [ ] `p2pSocialDynamics.ts`: 4 ecosystem rules enforced, 5 universal values embedded in all layers
- [ ] `learningLayers.ts`: Requisite variety measurement, recursive/reflective loops functional, single/double loop detection
- [ ] `purposeBasedOrg.ts`: Purpose statement immutable, anti-power-grabbing mechanisms active, money-as-means verified
- [ ] `legalFramework.ts`: Partner state methodology documented, regulatory interface functional, p2p as regulatory partners registered
- [ ] `networkOpenness.ts`: Permissionless agent registration, minimal info principle, Bitcoin-style access verified
- [ ] `propagationModels.ts`: Initiation ritual executes, distributed propagation, handshake generativo v1.0 functional

---

## Referencias a Documentos Fuente (para trazabilidad)

| Sección Backup | Módulo(s) HSCSG | Notas |
|----------------|-----------------|-------|
| Stigmergy (Future/Past Work) | `stigmergicCoordination.ts` | Convergence mechanisms needed |
| Methodology (Goals, Participation, Sources, Testing Grounds) | `crowdProcesses.ts`, `testingGrounds.ts` | OSE, Enspiral, Better Work Together, Open Coop as references |
| Philosophical: By Tibi (crowdthinking/crowdsourcing) | `crowdProcesses.ts`, `currentSeeSystem.ts`, `shareablePool.ts` | Core thesis: dual process optimization via stigmergy |
| Philosophical: P2P Social Dynamics | `p2pSocialDynamics.ts`, `ecosystemRules.ts`, `universalValues.ts` | 4 rules + 5 values = hard constraints |
| Philosophical: On Stigmergy | `signalDesign.ts`, `signalTypes.ts`, `convergenceMechanisms.ts` | 4 features, 4 classes, 4 mechanisms |
| Philosophical: Learning Layers | `learningLayers.ts`, `adaptiveSystems.ts` | Requisite variety, single/double loop |
| Abstract | `antiRivalCommons.ts`, `ecosystemicApproach.ts` | 4 observations, 3 problems |
| Socioeconomic Model (Assumptions) | `ovnOrganizationalModel.ts`, `infrastructureRequirements.ts` | Infrastructure requirements for self-org |
| OVN Organizational Model | `ovnOrganizationalModel.ts`, `networkOpenness.ts`, `purposeBasedOrg.ts` | 3 entities, open network, purpose-based |
| Value Theory | `valueTheory.ts`, `valueSovereignty.ts`, `currentSeeSystem.ts` | Relational theory, sovereignty, current-sees |
| Motivation/Incentive Models | `incentiveModels.ts`, `fluidEquity.ts` | 5 models + fluid equity |
| Structures | `ovnStructure.ts` | Network, Custodian, Interfaces |
| Legal/Regulatory | `legalFramework.ts`, `regulatoryInterface.ts` | Partner state, Lessig/Benkler/Murray/Vranaki |
| Propagation Models | `propagationModels.ts`, `mitosisProtocol.ts` | Initiation ritual = generative handshake |
| IT Infrastructure | `ovni3ITIntegration.ts` | Reference to separate OVNi 3.0 doc |

---

## Próximos Pasos Inmediatos

1. **Implementar `ovnOrganizationalModel.ts` + `valueTheory.ts` + `currentSeeSystem.ts`** — core Capa 3
2. **Implementar `incentiveModels.ts` + `fluidEquity.ts`** — motor económico Capa 3
3. **Implementar `crowdProcesses.ts` + `stigmergicCoordination.ts` + `signalTypes.ts`** — coordinación Capa 2
4. **Implementar `convergenceMechanisms.ts` + `p2pSocialDynamics.ts`** — anti-fragmentación + constraints
5. **Implementar `purposeBasedOrg.ts` + `legalFramework.ts`** — Capa 1 fundación
6. **Implementar `propagationModels.ts`** — handshake generativo v1.0 → mitosis protocol
7. **Integrar con OVNi 3.0 Governance modules** (network/project/federation governance)
8. **Validar KPIs Fase 0 antes de Zeitnus Economic Model Fases 1-2**