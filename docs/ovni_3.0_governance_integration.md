# OVNi 3.0 - Governance — Integración HSCSG/Zeitnus

**Fecha**: 2026-11-07  
**Backup**: `docs/ovni_3.0_governance_backup.md`  
**Origen**: Sensorica OVNi 3.0 Governance (Google Docs co-creation)  
**Licencia**: CC BY-NC-SA / Content rules — ideas extraíbles libremente  

---

## Tesis de Integración

El documento OVNi 3.0 Governance proporciona la **arquitectura de gobernanza operativa** para la Capa 3 (Operación Productiva) de la arquitectura canónica Zeitnus de 5 capas. No es un modelo de gobernanza general para HSCSG — es el **motor de coordinación productiva** que opera dentro de los límites definidos por Capas 1-2 (Propósito/Límites, Gobernanza/Conocimiento).

**Posicionamiento**: OVN Governance = Capa 3 Zeitnus — subordinada a Autonomía/Regeneración/Continuidad (Capas 1-2), habilitada por Infraestructura Metabólica (Capa 4), transicionada por Economía (Capa 5).

---

## Mapeo Directo a Arquitectura Zeitnus (5 Capas)

| Capa Zeitnus | Componente OVNi 3.0 | Módulo HSCSG | Estado |
|--------------|---------------------|--------------|--------|
| **Capa 3: Operación Productiva** | Network Governance | `networkGovernance.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Project Governance | `projectGovernance.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Network of Networks | `federationGovernance.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Embedded Governance | `embeddedGovernance.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Stigmergic Governance | `stigmergicGovernance.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Value-based Incentives | `incentiveSystems.ts` | 🔄 Asimilar |
| **Capa 2: Gobernanza/Conocimiento** | Principle-Based Governance | `principleBasedGov.ts` | 🔄 Asimilar |
| **Capa 3: Operación Productiva** | Smart Contract Governance | `smartContractGov.ts` | 🔄 Asimilar |
| **Capa 1: Propósito/Límites** | Boundaries/Immune System | `boundarySystem.ts` | 🔄 Asimilar |

---

## Decisiones EBD (Evidence-Based Decisions) — Derivadas de este Documento

| ID | Decisión | Justificación OVNi 3.0 | Implementación HSCSG |
|----|----------|------------------------|----------------------|
| **D16** | **Gobernanza = Capa 3 (no Capa 1-2)** | OVN governance opera dentro de redes/proyectos, no define propósito ni límites ecológicos | `governanceTriads.ts` (Capa 2) separada de `networkGovernance.ts` (Capa 3) |
| **D17** | **Stigmergia = Capa 2 (Gobernanza embebida)** | "Governance is introduced to reduce transaction costs... guided by stigmergy, embedded in environment" | `stigmergicGovernance.ts` + `embeddedGovernance.ts` en Capa 2 |
| **D18** | **Governance OF vs THROUGH OVN** | Distinción fundamental: control externo vs automatización interna | Dos módulos separados: `governanceOfOVN.ts` + `governanceThroughOVN.ts` |
| **D19** | **Principle-Based → Project-Level Autonomy** | "Projects can self-select principles and rules" | `projectGovernance.ts` con `principleRegistry.ts` por proyecto |
| **D20** | **Smart Contracts = Formalización, no Sustitución** | "Rules formalized as smart contracts... guarantee machine readability" | `smartContractGov.ts` como capa de enforcement, no fuente de legitimidad |
| **D21** | **On-Chain vs Off-Chain = Arquitectura Híbrida** | "Large debate nowadays" — no resuelto en OVNi | `hybridGovArchitecture.ts` con delimitación explícita |
| **D22** | **Contract Upgradability = Obligatorio** | "OVN being continuously developed... upgrade path important" | `contractUpgradability.ts` patrón EtherRouter/Resolver adaptado |
| **D23** | **Contract Security = Recovery Mode Multi-Sig** | Colony pattern: whitelisted addresses, qualitative triggers | `contractSecurity.ts` con recovery mode y multi-sig approval |
| **D24** | **Governance Equations = Meta-Governance** | David H feedback: "governance equation must exist that represents the contract through which new governance equations are introduced" | `metaGovernance.ts` — governance de la gobernanza |
| **D25** | **CELL/Cluster/Federation = Estructura Fractal** | Network mapping: CELL → Cluster → Network → Network of Networks | `fractalGovernanceStructure.ts` con 4 niveles |
| **D26** | **Custodian = Fiduciario Temporal (no owner)** | "Custodian merely a service provider... most functionality absorbed into DAO" | `custodianPattern.ts` (ya en pending-implementations) reforzado |
| **D27** | **Exchange Firm = Interfaz Mercado (absorvible por DAO)** | "Legal entity providing interface with Market... can be absorbed by DAO" | `exchangeFirmProtocol.ts` + `marktBridge.ts` (ya en pending) |
| **D28** | **Role/Reputation Transportable** | "Roles and reputation need to be transportable across projects/networks" | `portableRoles.ts` + `portableReputation.ts` (Capa 3) |
| **D29** | **Embedded Governance = Unavoidable Rules** | "Embedded rules can be made unavoidable... decision making shifts to architecture" | `embeddedGovernance.ts` con hard/soft embedded rules |
| **D30** | **SEEDs Constitution/Game Plan = Patrón Referencia** | Constitution offchain → Game Plan onchain (theory of games + economic layer) | `constitutionGamePlanPattern.ts` para Zeitnus |
| **D31** | **Incentives > Rules** | "Instead of rules, create incentives or purposes to drive activity" | `incentiveSystems.ts` como primary, `ruleEnforcement.ts` como fallback |
| **D32** | **Stigmergic Governance = Few Principles + Environment** | "Governance can be emergent phenomena relying on very small number of principles" | `stigmergicGovernance.ts` con principios mínimos + environment properties |
| **D33** | **REA para Governance** | "REA used to model economic reality... use same structure to describe governance" | `reaGovernanceModel.ts` — Agents/Resources/Events para gobernanza |
| **D34** | **Complexity Governance = Required** | "Necessity to expand this... Complexity on OVN wiki" | `complexityGovernance.ts` — métricas complejidad + adaptive governance |
| **D35** | **Boundaries = Immune System** | "Governance should specify boundary conditions... immune system" | `boundarySystem.ts` + `immuneSystem.ts` (Capa 1) |

---

## Módulos de Implementación Requeridos (Fase 0 OVN Process Layer — Actualización)

### Nuevos módulos derivados de OVNi 3.0 Governance:

| Módulo | Descripción | Dependencias | Prioridad |
|--------|-------------|--------------|-----------|
| `networkGovernance.ts` | Custodian agreement, Exchange Firms, Access to Resources, Governance equations (network level), Role/Reputation system, Content management, Physical/virtual environment | `custodianPattern.ts`, `exchangeFirmProtocol.ts`, `portableRoles.ts`, `portableReputation.ts` | CRÍTICA |
| `projectGovernance.ts` | Benefit redistribution algorithms, Benefit redistribution Agreement, Governance equation (project level), Principle registry per project | `benefitRedistribution.ts`, `principleRegistry.ts` | CRÍTICA |
| `federationGovernance.ts` | Network of networks: contribution accounting interoperability, role/reputation transportable cross-network, content management cross-network, unified UX cross-network | `networkGovernance.ts`, `crossNetworkInterop.ts` | ALTA |
| `embeddedGovernance.ts` | Hard/soft embedded rules, self-enforcing agreements (smart contracts), physical/digital barriers, onchain/offchain architecture | `smartContractGov.ts`, `hybridGovArchitecture.ts` | CRÍTICA |
| `stigmergicGovernance.ts` | Minimal principles + environment properties, pheromone-like signals, convergence mechanisms (feedback maps, incentives, purpose communication, community aspect) | `meshSignals.ts` (Capa 2), `incentiveSystems.ts` | CRÍTICA |
| `incentiveSystems.ts` | Curren-see (Arthur Brock), game theory, gamification, token economy, positive/negative incentives, explanation-based | `valueDual.ts`, `caasCredits.ts` | ALTA |
| `principleBasedGov.ts` | Project self-selection of principles/rules, flexible valuation/payout per project, Smart Tokens/Wallets per group criteria | `projectGovernance.ts`, `tokenEngineering.ts` | ALTA |
| `smartContractGov.ts` | Deontic logic formalization, machine readability, coherence, general OVN contract + project instances + ERC20 token | `contractUpgradability.ts`, `contractSecurity.ts` | CRÍTICA |
| `contractUpgradability.ts` | EtherRouter + Resolver pattern, upgrade path without forcing, colony-inspired | `smartContractGov.ts` | CRÍTICA |
| `contractSecurity.ts` | Recovery mode, whitelisted addresses, multi-sig approval, qualitative/quantitative triggers | `smartContractGov.ts` | CRÍTICA |
| `metaGovernance.ts` | Governance equations for introducing new governance equations, voting categories (permitted/superuser/deferred), transaction type generation | `smartContractGov.ts` | ALTA |
| `fractalGovernanceStructure.ts` | 4 levels: CELL → Cluster → Network → Network of Networks, each with specific governance concerns | `networkGovernance.ts`, `federationGovernance.ts` | ALTA |
| `portableRoles.ts` / `portableReputation.ts` | Transportable across projects and networks, credential-based | `agentProfile.ts` (OVNi IT doc) | ALTA |
| `constitutionGamePlanPattern.ts` | Constitution (offchain ethos) → Game Plan (onchain game theory + economic layer) | `embeddedGovernance.ts`, `incentiveSystems.ts` | MEDIA |
| `reaGovernanceModel.ts` | Agents/Resources/Events applied to governance (Policy/Scheduling/Accountability layers) | `reaIntegration.ts` (base) | MEDIA |
| `complexityGovernance.ts` | Complexity metrics, adaptive governance based on system complexity | `complexityMetrics.ts` | BAJA |
| `boundarySystem.ts` / `immuneSystem.ts` | Boundary conditions, in/out regulation, immune system for network | `accessRights.ts` (Capa 1), `autonomyGuard.ts` | ALTA |
| `hybridGovArchitecture.ts` | Explicit on-chain vs off-chain delimitation, decision framework | `smartContractGov.ts`, `embeddedGovernance.ts` | ALTA |

---

## Patrones de Asimilación Directa (1:1 con código)

| Patrón OVNi | Módulo HSCSG | Notas |
|-------------|--------------|-------|
| Custodian Agreement | `custodianPattern.ts` | Ya en pending — reforzar con fiduciary/temporal/auditable/recall |
| Exchange Firm Mandate | `exchangeFirmProtocol.ts` | Ya en pending — añadir DAO absorption path |
| Benefit Redistribution Algorithm | `benefitRedistribution.ts` | Ya en pending — voting rights granted by algorithm |
| Role System (transportable) | `portableRoles.ts` | Nuevo — credential-based, cross-project |
| Reputation System (transportable) | `portableReputation.ts` | Nuevo — no global score, competencias/cumplimiento/experiencia |
| Governance Equations (network/project) | `governanceEquations.ts` | Nuevo — protocolos/estándares como equations |
| Stigmergic Coordination | `stigmergicCoordination.ts` | Ya en pending — añadir convergence mechanisms |
| Embedded Governance (hard/soft) | `embeddedGovernance.ts` | Nuevo — unavoidable rules via architecture |
| Constitution/Game Plan | `constitutionGamePlanPattern.ts` | Nuevo — SEEDs pattern para Zeitnus |
| REA for Governance | `reaGovernanceModel.ts` | Nuevo — Policy/Scheduling/Accountability layers |

---

## Adaptaciones Profundas (Requieren Rediseño para HSCSG)

| Concepto OVNi | Adaptación HSCSG | Razón |
|---------------|------------------|-------|
| **Fluid p2p Normative System** | **Normative System con límites Capa 1** | HSCSG requiere límites ecológicos/autonomía no negociables |
| **Reputation Mining (Colony)** | **Función Informativa Limitada (D5)** | No puntuación global — solo competencias/cumplimiento/experiencia |
| **Token-based Voting Rights** | **Acceso Incondicional (D9) + Gobernanza por Contribución** | Derecho ≠ Contribución; voto por stake en proyecto, no token |
| **Smart Contracts como Ley** | **Smart Contracts como Enforcement** | Legitimidad en Capa 1-2 (CDS/FRS/OAD), enforcement en Capa 3 |
| **Market Interface (Exchange Firm)** | **Market Bridge Ético (D5)** | Intermediario opcional, subordinado a autonomía/regeneración |
| **Network of Networks = Federación** | **Federación Fractal + Handshake Generativo** | Handshake Capa 0 genera compatibilidad, no la verifica |
| **On-chain/Off-chain Debate** | **Arquitectura Híbrida Explícita** | Delimitación clara: qué se automatiza, qué requiere deliberación humana |

---

## Conceptos Rechazados (Incompatibles con HSCSG)

| Concepto OVNi | Por qué se rechaza en HSCSG |
|---------------|----------------------------|
| **Token as Primary Governance Mechanism** | Tokens pueden concentrar poder; HSCSG usa contribución + stake en proyecto + derechos inmunes |
| **Reputation as Gatekeeper** | Reputación no transferible, no puntuación global — solo transparencia informativa |
| **Market as Universal Destination** | Mercado = interfaz opcional (Market Bridge), no destino universal |
| **Governance Equations as Universal Law** | Equations son protocolos de interoperabilidad Capa 3, no ley universal Capa 1-2 |
| **Custodian as Permanent Authority** | Custodian = fiduciario temporal, auditable, recall comunitario |
| **Unbounded Forking** | Forking permitido pero handshake generativo requiere convergencia (mitosis protocol) |

---

## Vasos Comunicantes con Otros Módulos (Actualización)

| Módulo OVNi Governance | Conecta con | Tipo de Conexión |
|------------------------|-------------|------------------|
| `networkGovernance.ts` | `custodianPattern.ts`, `exchangeFirmProtocol.ts`, `accessRights.ts` | Configuración + Permisos |
| `projectGovernance.ts` | `benefitRedistribution.ts`, `fourRegistries.ts`, `taskRoleSeparation.ts` | Ejecución + Distribución |
| `federationGovernance.ts` | `zeitnusFederation.ts`, `mitosisProtocol.ts`, `crossNetworkInterop.ts` | Federado + Handshake |
| `embeddedGovernance.ts` | `smartContractGov.ts`, `hybridGovArchitecture.ts`, `meshSignals.ts` | Enforcement + Señales |
| `stigmergicGovernance.ts` | `meshSignals.ts`, `incentiveSystems.ts`, `convergenceMechanisms.ts` | Señales + Incentivos |
| `incentiveSystems.ts` | `caasCredits.ts`, `valueDual.ts`, `prosumerProtocol.ts` | Créditos + Valor Dual |
| `principleBasedGov.ts` | `governanceTriads.ts`, `openIPProtocol.ts`, `collectiveIntelligence.ts` | Principios Capa 2 |
| `smartContractGov.ts` | `contractUpgradability.ts`, `contractSecurity.ts`, `metaGovernance.ts` | Stack Smart Contracts |
| `metaGovernance.ts` | `governanceTriads.ts` (CDS/FRS/OAD), `fractalGovernanceStructure.ts` | Meta-Gobernanza |

---

## KPIs de Validación (Fase 0)

- [ ] `networkGovernance.ts`: Custodian agreement CRUD, Exchange Firm mandate, Access control, Governance equations registry
- [ ] `projectGovernance.ts`: Benefit redistribution algorithm execution, Agreement enforcement, Principle registry per project
- [ ] `federationGovernance.ts`: Cross-network contribution accounting sync, Role/reputation portability test
- [ ] `embeddedGovernance.ts`: Hard embedded rule (smart contract) vs soft embedded rule (UI constraint) differentiation
- [ ] `stigmergicGovernance.ts`: Pheromone signal emit/receive, Convergence mechanism (feedback map + incentive bias)
- [ ] `incentiveSystems.ts`: Curren-see flow tracking, Positive/negative incentive effectiveness metrics
- [ ] `smartContractGov.ts`: General OVN contract deployment, Project instance deployment, ERC20 token integration
- [ ] `contractUpgradability.ts`: EtherRouter + Resolver pattern functional, Upgrade without forced migration
- [ ] `contractSecurity.ts`: Recovery mode entry/exit, Multi-sig approval, Trigger detection
- [ ] `metaGovernance.ts`: Governance equation for new governance equations, Voting categories implementation
- [ ] `portableRoles.ts` / `portableReputation.ts`: Cross-project transport verified, Credential format standardized
- [ ] `reaGovernanceModel.ts`: Agents/Resources/Events mapped to Policy/Scheduling/Accountability
- [ ] `boundarySystem.ts` / `immuneSystem.ts`: Boundary condition enforcement, Anomaly detection/response

---

## Referencias a Documentos Fuente (para trazabilidad)

| Sección Backup | Sección Integración | Notas |
|----------------|---------------------|-------|
| Stigmergy | `stigmergicGovernance.ts` | Future work → convergence mechanisms |
| Requirements → Coase/Benkler | `stigmergicGovernance.ts` + `networkGovernance.ts` | Transaction cost reduction = stigmergic coordination |
| Needs → Decentralize/Forking | `federationGovernance.ts` + `mitosisProtocol.ts` | Forking = mitosis capability |
| Formal Governance → Deontic Logic | `smartContractGov.ts` | Machine readability requirement |
| Contract Upgradability/Security | `contractUpgradability.ts` + `contractSecurity.ts` | Colony patterns directos |
| David H Feedback → Governance Equations | `metaGovernance.ts` | Meta-governance crítica |
| Network Mapping → CELL/Cluster | `fractalGovernanceStructure.ts` | 4 niveles fractales |
| Levels of Governance (3) | `networkGovernance.ts`, `projectGovernance.ts`, `federationGovernance.ts` | Mapeo 1:1 |
| Embedded Governance | `embeddedGovernance.ts` | Hard/soft, SEEDs pattern |
| Value-based Incentives | `incentiveSystems.ts` | Curren-see, game theory |
| Stigmergic Approach | `stigmergicGovernance.ts` | Few principles + environment |
| Economic Model + Governance | `reaGovernanceModel.ts` | REA para gobernanza |
| Boundaries | `boundarySystem.ts` + `immuneSystem.ts` | In/out, immune system |

---

## Próximos Pasos Inmediatos

1. **Implementar `networkGovernance.ts` + `projectGovernance.ts`** — base Capa 3 operativa
2. **Implementar `embeddedGovernance.ts` + `stigmergicGovernance.ts`** — motor de coordinación
3. **Implementar `smartContractGov.ts` + `contractUpgradability.ts` + `contractSecurity.ts`** — stack enforcement
4. **Implementar `federationGovernance.ts` + `fractalGovernanceStructure.ts`** — escalamiento
5. **Integrar con `benefitRedistribution.ts` (ya en pending) y `fourRegistries.ts` (D4)**
6. **Validar KPIs Fase 0 antes de pasar a Zeitnus Economic Model Fases 1-2**