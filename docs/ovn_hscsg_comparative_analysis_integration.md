# Análisis Comparativo OVN vs HSCSG → Integración en Zeitnus/HSCSG

**Documento origen**: Análisis comparativo original Isaac Ko (2026-11-07)  
**Módulos HSCSG objetivo**: `ovnHscsgBridge`, `metabolicAccounting`, `accessRights`, `careEconomy`, `transgenerationalContinuity`, `scarcityModeling`, `reputationSystem`, `governanceLayers`, `pilotValidation`  
**Rol en Zeitnus**: **Arquitectura de integración fundacional** — Define cómo OVN se integra COMO CAPA OPERATIVA dentro de HSCSG/Zeitnus, no como modelo económico rector. Establece: 5 capas integradas, RMR (Registro Metabólico), 10 vacíos críticos, secuencia 5 fases, piloto Cosateca.

---

## Triple Perspectiva

### 1. Usuario (Isaac Ko / Nodo Zeitnus)
> "Este documento es la **brújula arquitectónica** para Zeitnus. Define explícitamente:
> 
> **Qué SÍ integra de OVN**: Trazabilidad contribuciones (ITC), Referenciación conocimiento (OAD), Tareas/roles (COS), Modularización/Xtreme Manufacturing (OAD), Bienes comunes (Cosatecas), Solidaridad ante fallos.
> 
> **Qué ADAPTA profundamente**: Fluid equity → 4 registros separados (Contribución, Responsabilidad, Uso recursos, Beneficios económicos); Reputación → función limitada informativa; Democracia líquida → revocable/transparente/limitada; Custodios → fiduciaria/temporal/auditable; Empresas abiertas → subordinadas a autonomía.
> 
> **Qué RECHAZA**: Mercado destino universal, Equivalencia contribución=ingreso, Reputación como exclusión, Marca como legitimidad.
> 
> **Arquitectura 5 Capas Zeitnus**:
> 1. Propósito/Límites civilizatorios (Autonomía, Reciprocidad, Destrabajo, Continuidad ecológica)
> 2. Gobernanza/Conocimiento (CDS+OAD+FRS)
> 3. Operación productiva (COS+ITC+OVN adaptado)
> 4. Infraestructura metabólica (Cosatecas+AgriHoods+fab labs+energía+agua+vivienda+reparación)
> 5. Intercambio/Transición económica (Mercados, crédito mutuo, tanda, monetarios transitorios)
> 
> **Mecanismo Faltante Crítico**: **RMR (Registro Metabólico de Recursos)** — paralela a ITC. Registra flujos biofísicos (agua, energía, biomasa, nutrientes, materiales, capacidad productiva, tiempo trabajo, mantenimiento). Permite indicadores: Autonomía, Regeneración, Resiliencia, Destrabajo, Accesibilidad, Reparabilidad, Continuidad transgeneracional.
> 
> **10 Vacíos Críticos** que Zeitnus DEBE resolver:
> 1. Acceso universal independiente de productividad
> 2. Contabilidad ecológica metabólica completa (RMR)
> 3. Asignación recursos escasos con reglas explícitas
> 4. Economía del cuidado como infraestructura continuidad
> 4. Automatización que libere tiempo (no concentre control)
> 5. Conflictos valoración sin fórmulas deterministas
> 6. Controles contra captura poder (infraestructura, datos, algoritmos, decisiones)
> 7. Continuidad transgeneracional operativa (sucesión, reparación, memoria ecológica)
> 8. Escalabilidad validada empíricamente
> 9. Transición económica: monetario → acceso material
> 10. Acceso ≠ Contribución (derecho acceso incondicional)
> 
> **Secuencia 5 Fases + Piloto Cosateca** = Roadmap implementación Zeitnus v1.0"

### 2. LLM (Qué Asimilar / Qué Adaptar / Qué Rechazar)

| **ASIMILAR DIRECTO (Patrones OVN → Módulos HSCSG)** | **ADAPTAR PROFUNDAMENTE (OVN → Zeitnus Transformado)** | **RECHAZAR / NO IMPORTAR (Principios Incompatibles)** |
|-----------------------------------------------------|--------------------------------------------------------|------------------------------------------------------|
| • Registro trazable contribuciones → `ITC` | • Fluid equity → **4 registros separados** (`contributionRegistry`, `responsibilityRegistry`, `resourceUsageRegistry`, `economicBenefitRegistry`) | • Mercado como destino universal de producción |
| • Referenciación conocimiento → `OAD` + memoria transgeneracional | • Reputación → **función informativa limitada** (`reputationSystem.ts`: competencias, cumplimiento, experiencia contextual — NO puntuación global) | • Equivalencia contribución = ingreso |
| • Tareas/roles/responsabilidades → `COS` (tarea vs rol, custodia temporal) | • Democracia líquida → **delegación revocable/transparente/limitada** (`liquidDemocracy.ts`: derechos fundamentales inmunes) | • Reputación como mecanismo exclusión (acceso necesidades vitales) |
| • Modularización/Xtreme Manufacturing → `OAD` + `caasServiceTemplates` | • Custodios → **fiduciaria/temporal/auditable** (`custodianPattern.ts`: custodiar ≠ poseer) | • Marca como centro legitimidad |
| • Bienes comunes (proyecto/red/comunes) → `Cosatecas` + `commonsRegistry` | • Empresas abiertas → **subordinadas a autonomía** (`openEnterprise.ts`: ejecución transición, no propietaria infraestructura comunitaria) | |
| • Solidaridad ante fallos → distinguir negligencia/incertidumbre/aprendizaje | | |
| • 10 subsistemas infraestructura OVN → mapear a primitivos CaaS | | |
| • 3 sistemas Sensorica (contabilidad, reputación, roles) → `ITC`, `reputationSystem`, `roleSystem` | | |

### 3. HSCSG + CaaS (Isomorfismo Leyes I/II/III + CaaS — Arquitectura Integrada)

| Ley / Principio | Análisis OVN/HSCSG | Implementación Zeitnus |
|----------------|-------------------|------------------------|
| **Ley I: No dañar base material/personas** | OVN: custodios protegen infra, commons digitales low-maintenance. HSCSG: **Acceso universal incondicional** (derecho ≠ contribución). Vacío: reputación como exclusión. | `accessRights.ts` — derechos acceso incondicionales (agua, comida, vivienda, salud, conocimiento, herramientas esenciales). `custodianPattern.ts` — fiduciaria, temporal, auditable. `autonomyGuard.ts` — umbrales viabilidad física. |
| **Ley II: Ganarse la vida soberanizando (AUT×CDS)** | OVN: fluid equity = participación ingresos. HSCSG: **Autonomía material** (no ingresos). RMR = contabilidad metabólica. Destrabajo = tiempo liberado. Vacíos: teoría escasez material, economía cuidado, automatización liberadora. | `metabolicAccounting.ts` (RMR) — flujos biofísicos paralelos a ITC. `destrabajoOptimization.ts` — Min ∑H(t). `careEconomy.ts` — cuidados como infraestructura continuidad. `scarcityModeling.ts` — flujos físicos, límites ecológicos, priorización necesidad/disponibilidad/impacto. `automationGovernance.ts` — automatización libera tiempo, no concentra control. |
| **Ley III: Lucidez, nunca engañar** | OVN: transparencia radical, reputación participativa. HSCSG: **Reputación ≠ jerarquía moral**. Separar competencia técnica, cumplimiento, experiencia, poder decisión, derecho acceso. Vacío: conflictos valoración, poder/captura. | `reputationSystem.ts` — competencias técnicas, cumplimiento compromisos, experiencia contextual (NO puntuación global). `governanceTriads.ts` — base-3 verification, RCE. `powerControls.ts` — controles captura infraestructura/datos/algoritmos/decisiones. `valuationConflicts.ts` — resolución sin fórmulas deterministas valor humano. |
| **CaaS: Acceso por contribución real** | OVN: NRP-CAS = contribution accounting. HSCSG: **CaaS nativo** — earning/spending continuo, acceso universal incondicional separado de productividad. | `caasCredits.ts` — hybrid earning (OVN contrib + DAO incentives) + spending (acceso + token utility). `accessRights.ts` — capa base incondicional. `economicTransition.ts` — monetario → acceso material menos dependiente dinero. |

---

## Tabla Mapeo Isomórfico (Concepto Análisis → Módulo Zeitnus → Ley/CaaS)

| Concepto Análisis | Módulo Zeitnus/HSCSG | Ley I | Ley II | Ley III | CaaS |
|------------------|---------------------|-------|--------|---------|------|
| **Arquitectura 5 Capas** | `zeitnusArchitecture.ts` (core) | ✓ | ✓ | ✓ | ✓ |
| **RMR (Registro Metabólico)** | `metabolicAccounting.ts` | ✓ | ✓✓ | ✓ | ✓ |
| **4 Registros Separados (Fluid Equity adaptado)** | `fourRegistries.ts` | ✓ | ✓ | ✓ | ✓ |
| **Reputación Función Limitada** | `reputationSystem.ts` | ✓ | ✓ | ✓✓ | ✓ |
| **Democracia Líquida Revocable** | `liquidDemocracy.ts` | ✓ | ✓ | ✓ | ✓ |
| **Custodios Fiduciarios** | `custodianPattern.ts` | ✓✓ | ✓ | ✓ | ✓ |
| **Empresas Abiertas Subordinadas** | `openEnterprise.ts` | ✓ | ✓ | ✓ | ✓ |
| **Acceso Universal Incondicional** | `accessRights.ts` | ✓✓ | ✓ | ✓ | ✓✓ |
| **Economía del Cuidado** | `careEconomy.ts` | ✓ | ✓✓ | ✓ | ✓ |
| **Modelado Escasez Material** | `scarcityModeling.ts` | ✓ | ✓✓ | ✓ | ✓ |
| **Gobernanza Automatización** | `automationGovernance.ts` | ✓ | ✓✓ | ✓✓ | ✓ |
| **Controles Poder/Captura** | `powerControls.ts` | ✓ | ✓ | ✓✓ | ✓ |
| **Continuidad Transgeneracional** | `transgenerationalContinuity.ts` | ✓ | ✓ | ✓ | ✓ |
| **Resolución Conflictos Valoración** | `valuationConflicts.ts` | ✓ | ✓ | ✓✓ | ✓ |
| **Transición Económica** | `economicTransition.ts` | ✓ | ✓ | ✓ | ✓✓ |
| **Piloto Cosateca Validación** | `pilotValidation.ts` | ✓ | ✓ | ✓ | ✓ |

---

## Qué Asimilar vs Qué Adaptar vs Qué Rechazar (Lista Explícita)

### ✅ ASIMILAR DIRECTO (11 Patrones)
1. `ContributionTracing` — ITC registra quién/qué/cuándo/proyecto/recursos/resultados
2. `KnowledgeReferencing` — OAD mantiene procedencia diseños/mejoras/adaptaciones
3. `TaskRoleSeparation` — COS: tarea (acción delimitada) vs rol (responsabilidades/facultades)
4. `ModularManufacturing` — Xtreme Manufacturing: modular, test-first, low-cost prototypes, short iterations, distributed teams, repairable, customizable, local fabrication
5. `CommonsClassification` — Cosatecas: contribuciones proyecto/red/bienes comunes
6. `FailureSolidarity` — compensar errores inevitables, distribuir riesgos (negligencia ≠ incertidumbre ≠ aprendizaje)
7. `ITC_OVN_Integration` — mapear Contribution Accounting System OVN → ITC HSCSG
8. `OAD_OVN_Integration` — mapear Open Source/Shared Designs → OAD
9. `COS_OVN_Integration` — mapear Roles/Tasks/Resource Planning → COS
10. `FRS_OVN_Integration` — mapear Evaluation/Reputation/Learning → FRS
11. `Cosatecas_OVN_Integration` — mapear Network Commons → Cosatecas + Comunes HSCSG

### 🔄 ADAPTAR PROFUNDAMENTE (5 Mecanismos Críticos)

#### 1. Fluid Equity → 4 Registros Separados
```typescript
// OVN: fluid equity = % participación ingresos futuros
// Zeitnus: CUATRO registros independientes
interface FourRegistries {
  contributionRegistry: ContributionRecord[];      // trabajo, conocimiento, recursos, servicios
  responsibilityRegistry: ResponsibilityRecord[];  // compromisos, obligaciones asumidas
  resourceUsageRegistry: ResourceUsageRecord[];    // consumo, disponibilidad, necesidades materiales
  economicBenefitRegistry: EconomicBenefitRecord[]; // ingresos, excedentes actividades comerciales
}
// REGLAS:
// - Contribución NO determina dignidad/derecho a existir
// - Responsabilidad NO determina superioridad personal
// - Uso recursos NO determina exclusión arbitraria
// - Beneficios económicos NO determinan acceso universal a lo indispensable
```

#### 2. Reputación → Función Informativa Limitada
```typescript
interface ReputationSystem {
  technicalCompetence: Map<Agent, CompetenceRecord[]>;     // competencias técnicas verificables
  commitmentFulfillment: Map<Agent, FulfillmentRecord[]>;  // cumplimiento compromisos
  contextualExperience: Map<Agent, ExperienceRecord[]>;    // experiencia contextual
  // NO: globalHumanValueScore, moralHierarchy, accessGate
}
```

#### 3. Democracia Líquida → Delegación Revocable/Transparente/Limitada
```typescript
interface LiquidDemocracy {
  delegation: DelegationRecord;      // revocable en cualquier momento
  transparency: TransparencyRecord;  // públicamente auditable
  scope: ScopeLimit;                 // limitado: decisiones técnicas/operativas
  // DERECHOS FUNDAMENTALES: inmunes a delegación/popularidad
  fundamentalRights: Immutable<FundamentalRight[]>;
}
```

#### 4. Custodios → Función Fiduciaria/Temporal/Auditable
```typescript
interface CustodianPattern {
  fiduciaryDuty: boolean;        // obligación fiduciaria estricta
  temporary: boolean;            // mandato temporal, renovable
  auditable: boolean;            // auditoría periódica obligatoria
  noAppropriation: boolean;      // custodiar ≠ poseer ≠ apropiarse
  communityRecall: RecallMechanism; // comunidad puede revocar
}
```

#### 5. Empresas Abiertas → Subordinadas a Autonomía
```typescript
interface OpenEnterprise {
  purpose: 'transition_execution' | 'autonomy_regeneration';  // subordinada a autonomía
  infrastructureOwnership: 'community';  // NO propietaria exclusiva infraestructura comunitaria
  marketIntermediary: 'optional';        // NO intermediaria obligatoria acceso medios vida
  subordination: SubordinationClause;    // cláusula subordinación explícita
}
```

### ❌ RECHAZAR / NO IMPORTAR (4 Principios Incompatibles)
1. **MarketAsUniversalDestination** — NO asumir que todo valor debe realizarse via venta
2. **ContributionEqualsIncome** — NO equivalencia automática contribución = ingreso monetario
3. **ReputationAsExclusion** — NO reputación como licencia para acceso necesidades vitales
4. **BrandAsLegitimacy** — NO marca/identidad comercial como centro de legitimidad

---

## Decisiones EBD (D1-D15) — Arquitectura Integrada

| Decisión | Fundamento (Análisis Comparativo) | Módulos Afectados |
|----------|-----------------------------------|-------------------|
| **D1**: OVN = Capa Operativa dentro de HSCSG (no modelo rector) | "Integrar OVN DENTRO de HSCSG... evita que arquitectura para distribuir valor económico defina límites propuesta objetivo superar esa dependencia" | `zeitnusArchitecture.ts` (Capa 3) |
| **D2**: Arquitectura 5 Capas = Estructura Canónica Zeitnus | Capa 1 Propósito → Capa 2 Gobernanza/Conocimiento → Capa 3 Operación → Capa 4 Infraestructura Metabólica → Capa 5 Transición Económica | `zeitnusArchitecture.ts` |
| **D3**: RMR (Registro Metabólico) = Paralelo a ITC, No Reemplazo | "ITC = quién contribuyó; RMR = qué recursos entraron/transformaron/consumieron/regeneraron. No reemplaza ITC. Lo complementa." | `metabolicAccounting.ts` + `ITC` integration |
| **D4**: 4 Registros Separados (Fluid Equity Adaptado) | Separar Contribución, Responsabilidad, Uso Recursos, Beneficios Económicos. Cada uno con límites claros qué NO determina. | `fourRegistries.ts` |
| **D5**: Reputación = Función Informativa (NO Puntuación Global) | "No debe convertirse en puntuación global del valor humano... separar competencia técnica, cumplimiento, experiencia contextual, poder decisión, derecho acceso." | `reputationSystem.ts` |
| **D6**: Democracia Líquida = Revocable/Transparente/Limitada/Inmunes Derechos | "Delegación revocable, transparente, limitada alcance. Derechos fundamentales no dependen de popularidad ni contribuciones acumuladas." | `liquidDemocracy.ts` |
| **D7**: Custodios = Fiduciaria/Temporal/Auditable/Recall Comunitario | "Custodiar no es poseer. Administrar recurso común no otorga derecho a apropiarse." | `custodianPattern.ts` |
| **D8**: Empresas Abiertas = Subordinadas a Autonomía/Regeneración | "No propietaria exclusiva infraestructura comunitaria. No intermediaria obligatoria acceso medios vida." | `openEnterprise.ts` |
| **D9**: Acceso Universal = Incondicional (Derecho ≠ Contribución) | "Persona sin contribuir (edad, discapacidad, enfermedad, cuidados) NO pierde acceso bienes comunes. Distinguir: derecho acceso, participación voluntaria, responsabilidad, reconocimiento." | `accessRights.ts` |
| **D10**: Economía Cuidado = Infraestructura Continuidad (No Servicio Residual) | "Cuidado infantil, mayores, alimentación, mantenimiento, acompañamiento, educación, transmisión cultural = infraestructura continuidad." | `careEconomy.ts` |
| **D11**: Modelado Escasez Material = Teoría Operativa Completa | "Qué producir, importar, regenerar, NO extraer. Límites materiales: agua, energía, alimentos, minerales, suelo, equipos, capacidad mantenimiento." | `scarcityModeling.ts` |
| **D12**: Automatización = Libera Tiempo (No Concentra Control) | "Garantizar que automatización libere tiempo y no concentre control." | `automationGovernance.ts` |
| **D13**: Controles Poder/Captura = Explícitos (Infraestructura, Datos, Algoritmos, Decisiones) | "Controles contra concentración infraestructura, datos, algoritmos, decisiones." | `powerControls.ts` |
| **D14**: Continuidad Transgeneracional = Operativa (Sucesión, Reparación, Memoria Ecológica) | "Protocolos sucesión, resiliencia, reparación, memoria transgeneracional. Continuidad no depende de que sobreviva quien sabe cómo funciona la máquina." | `transgenerationalContinuity.ts` |
| **D15**: Piloto Cosateca = Validación Empírica Arquitectura | "Inventario real herramientas + necesidades. Métrica: trabajo, gasto, dependencia, desperdicio evitado (sin trasladar costes)." | `pilotValidation.ts` |

---

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `zeitnusArchitecture` | • 5 capas instanciadas correctamente<br>• Flujo retroalimentación verificado (no cadena mando)<br>• Capa 1 define límites civilizatorios inmutables | `zeitnusArchitecture.test.ts` |
| `metabolicAccounting` (RMR) | • Registra: agua, energía, biomasa, nutrientes, materiales, capacidad productiva, tiempo trabajo, mantenimiento<br>• 7 indicadores: Autonomía, Regeneración, Resiliencia, Destrabajo, Accesibilidad, Reparabilidad, Continuidad transgeneracional<br>• Paralelo a ITC (no reemplaza) | `metabolicAccounting.test.ts` |
| `fourRegistries` | • 4 registros independientes con límites claros<br>• Contribución ≠ dignidad/derecho existir<br>• Responsabilidad ≠ superioridad<br>• Uso recursos ≠ exclusión arbitraria<br>• Beneficios económicos ≠ acceso universal | `fourRegistries.test.ts` |
| `reputationSystem` | • Competencias técnicas verificables<br>• Cumplimiento compromisos tracked<br>• Experiencia contextual registrada<br>• NO puntuación global valor humano<br>• NO gate acceso necesidades vitales | `reputationSystem.test.ts` |
| `liquidDemocracy` | • Delegación revocable en cualquier momento<br>• Transparencia pública auditable<br>• Alcance limitado (técnico/operativo)<br>• Derechos fundamentales inmunes | `liquidDemocracy.test.ts` |
| `custodianPattern` | • Deber fiduciario estricto<br>• Mandato temporal renovable<br>• Auditoría periódica obligatoria<br>• No apropiación (custodiar ≠ poseer)<br>• Recall comunitario funcional | `custodianPattern.test.ts` |
| `openEnterprise` | • Propósito: transition_execution \| autonomy_regeneration<br>• Infraestructura = comunitaria<br>• Intermediario mercado = opcional<br>• Cláusula subordinación explícita | `openEnterprise.test.ts` |
| `accessRights` | • Derechos incondicionales: agua, comida, vivienda, salud, conocimiento, herramientas esenciales<br>• Separados: derecho acceso, participación voluntaria, responsabilidad, reconocimiento<br>• Persona sin contribuir mantiene acceso | `accessRights.test.ts` |
| `careEconomy` | • Cuidado infantil, mayores, alimentación, mantenimiento, acompañamiento, educación, transmisión cultural registrados<br>• Infraestructura continuidad (no servicio residual)<br>• Sostenido por comunidad | `careEconomy.test.ts` |
| `scarcityModeling` | • Flujos físicos modelados<br>• Límites ecológicos definidos<br>• Priorización: necesidad, disponibilidad, impacto ecológico<br>• Qué producir/importar/regenerar/NO extraer | `scarcityModeling.test.ts` |
| `automationGovernance` | • Automatización libera tiempo (metric: horas humanas liberadas)<br>• NO concentra control (verificación distribución control)<br>• Garantías distribución equitativa tiempo liberado | `automationGovernance.test.ts` |
| `powerControls` | • Controles captura: infraestructura, datos, algoritmos, decisiones<br>• Auditoría periódica concentraciones poder<br>• Mecanismos dispersión/descentralización | `powerControls.test.ts` |
| `transgenerationalContinuity` | • Protocolos sucesión operativos<br>• Resiliencia/reparación documentada<br>• Memoria ecológica preservada<br>• Conocimiento local/ancestral integrado<br>• Protocolos recuperación post-interrupción | `transgenerationalContinuity.test.ts` |
| `valuationConflicts` | • Resolución sin fórmulas deterministas valor humano<br>• Mediación participativa<br>• Derechos fundamentales inmunes a valoración | `valuationConflicts.test.ts` |
| `economicTransition` | • Mecanismos: mercados, servicios, crédito mutuo, ahorro-inversión-tanda, monetarios transitorios<br>• Acceso bienes esenciales separado de productividad individual<br>• Transición: monetario → acceso material menos dependiente dinero | `economicTransition.test.ts` |
| `pilotValidation` (Cosateca) | • Inventario real herramientas + necesidades<br>• Registro aportaciones/recursos funcional<br>• Acceso verificable herramientas compartidas<br>• Mantenimiento infraestructura sostenible<br>• Diseños/conocimientos abiertos<br>• Decisiones revisables<br>• Métrica: trabajo/gasto/dependencia/desperdicio evitado (sin trasladar costes) | `pilotValidation.test.ts` |

---

## Plan Implementación (Secuencia 5 Fases + Piloto)

### Fase 1: Protocolo Contribuciones (Semanas 1-3)
**Objetivo**: Adaptar registro/referenciación OVN a ITC
- `contributionTracing.ts` — registro aportaciones humanas, materiales, intelectuales, infraestructura
- `knowledgeReferencing.ts` — procedencia diseños/mejoras/adaptaciones
- **Sin conversión automática a créditos económicos**
- Validación: ITC registra genealogía completa diseño

### Fase 2: Gobernanza y Coordinación (Semanas 3-5)
**Objetivo**: Integrar tareas, roles, custodia, verificación, mediación, bifurcación en CDS/COS
- `taskRoleSeparation.ts` — tarea vs rol
- `custodianPattern.ts` — fiduciaria, temporal, auditable, recall
- `liquidDemocracy.ts` — delegación revocable/transparente/limitada
- `governanceTriads.ts` — base-3 verification + RCE
- `fourRegistries.ts` — 4 registros separados
- Validación: límites autoridad claros, mecanismos revocación funcionales

### Fase 3: Bienes Comunes Productivos (Semanas 5-7)
**Objetivo**: Conectar OAD con Cosatecas, herramientas, fab labs, producción local
- `commonsClassification.ts` — proyecto/red/bienes comunes
- `modularManufacturing.ts` — Xtreme Manufacturing patterns
- `cosatecaRegistry.ts` — licencias, mantenimiento, inventarios, reglas acceso
- `failureSolidarity.ts` — negligencia ≠ incertidumbre ≠ aprendizaje
- Validación: Cosateca operativa con herramientas compartidas, diseños abiertos

### Fase 4: Contabilidad Metabólica (Semanas 7-10)
**Objetivo**: Desarrollar RMR + vincular FRS
- `metabolicAccounting.ts` — RMR completo (7 flujos + 7 indicadores)
- `destrabajoOptimization.ts` — Min ∑H(t)
- `careEconomy.ts` — economía cuidado infraestructura continuidad
- `scarcityModeling.ts` — flujos físicos, límites ecológicos
- `automationGovernance.ts` — automatización libera tiempo
- `powerControls.ts` — controles captura poder
- `transgenerationalContinuity.ts` — protocolos sucesión, memoria ecológica
- `valuationConflicts.ts` — resolución sin fórmulas deterministas
- Validación: RMR paralelo a ITC, indicadores autonomía funcionando

### Fase 5: Economía Transición (Semanas 10-12)
**Objetivo**: Intercambio, servicios, crédito mutuo, tanda, financiación infraestructura
- `economicTransition.ts` — mercados, servicios, crédito mutuo, tanda
- `accessRights.ts` — acceso universal incondicional
- `reputationSystem.ts` — función informativa limitada
- `openEnterprise.ts` — subordinadas a autonomía
- Validación: acceso bienes esenciales separado de productividad individual

### Piloto Validación: Cosateca Comunitaria (Paralelo Fases 3-5)
**Objetivo**: Validar arquitectura empíricamente
- Inventario real herramientas + necesidades comunidad
- Métricas: trabajo/gasto/dependencia/desperdicio evitado (sin trasladar costes)
- Demostrar: registro funcional, acceso verificable, mantenimiento sostenible, diseños abiertos, decisiones revisables, autonomía material aumentada

---

## Vasos Comunicantes Cross-Repo

| Módulo Zeitnus | Conexión Análisis OVN/HSCSG | Vaso Comunicante (Primitivo CaaS) |
|----------------|----------------------------|-----------------------------------|
| `zeitnusArchitecture` | 5 capas integradas | `governance-triads` (Capa 2), `caas-credits` (Capa 5) |
| `metabolicAccounting` | RMR paralelo a ITC | `identity-rao` (atribución), `value-dual` (ZNU/USD/BTC para flujos) |
| `fourRegistries` | Fluid equity adaptado | `caas-credits` (earning/spending por registro) |
| `reputationSystem` | Función informativa limitada | `governance-triads` (verificación competencias) |
| `liquidDemocracy` | Delegación revocable | `governance-triads` (base-3 decision making) |
| `custodianPattern` | Fiduciaria temporal | `identity-rao` (custodian RAO delegation) |
| `openEnterprise` | Subordinada autonomía | `zeitnus-handshake.marketBridge` (4th Sector) |
| `accessRights` | Incondicional | `autonomy-guard` (viabilidad base), `caas-credits` (base layer) |
| `careEconomy` | Infraestructura continuidad | `caas-credits` (time bank credits), `giftEconomyProtocols` |
| `scarcityModeling` | Teoría escasez material | `autonomy-guard` (umbrales físicos), `value-dual` (priceParity recursos) |
| `automationGovernance` | Automatización liberadora | `consensus-gossip` (coord distributed), `destrabajoOptimization` |
| `powerControls` | Anti-captura | `governance-triads` (RCE), `identity-rao` (audit trail) |
| `transgenerationalContinuity` | Memoria transgeneracional | `identity-rao` (atribución intergeneracional), `ontologyDistinction` |
| `valuationConflicts` | Resolución no-determinista | `governance-triads` (mediación base-3) |
| `economicTransition` | Monetario → material | `value-dual` (ZNU/USD/BTC), `caas-credits` (hybrid economy) |
| `pilotValidation` | Cosateca empírica | All primitives (integration test) |

---

## Referencias

**Documento Principal**: Análisis comparativo OVN vs HSCSG (Isaac Ko, 2026-11-07) — este backup

**Documentos Asimilados Previos (Base)**:
- `docs/ovn_economic_model_backup.md` + `_integration.md` — Modelo económico OVN completo
- `docs/sensorica_ovn_valnet_backup.md` + `_integration.md` — Sensorica/OVN/ValNet/Mikorizal ecosystem
- `docs/dao_ovn_intersection_backup.md` + `_integration.md` — DAO/OVN complementarity
- `docs/zeitnus_economic_model_integration.md` — Modelo económico Zeitnus v1.0 (7 capas, 4 fases)
- `docs/ZEITNUS_UMBRAL_72H_PARADIGMA_HABITADO.md` v15.1 — Handshake Generativo Capa 0
- `docs/scraped_ovn_references_backup.md` — Multitude Project, P2P Foundation, HBR, etc.
- `docs/ovn_framework_paper_backup.md` — OVN Framework Paper 2013 (Yasir/Tibi)
- `docs/sensorica_design_philosophy_backup.md` — Design Philosophy (Perpetual Things, Modular Architecture)
- `docs/sensorica_licensing_backup.md` — Licensing game theory, know-how economy
- `docs/franz_pearce_screw_case_study_backup.md` — FOSH DIT business model
- `docs/open_legolab_concept_backup.md` — Device-to-cloud standardization
- `docs/open_labonline_concept_backup.md` — Labonline networks (2011 precursor)

**Conceptos Teóricos Clave (Citados en Análisis)**:
- Ostrom, E. (1990) "Governing the Commons" — 8 design principles
- Benkler, Y. (2006) "The Wealth of Networks" — CBPP
- Bauwens, M. — P2P Theory, Max Hierarchy, Circulation of the Common
- Kostakis et al. — Design Global, Manufacture Local (DGML)
- Li & Seering (2019) — 5 community mechanisms
- Shirky — Coasian floor/ceiling
- Feldstein — Participation cost threshold
- Verna Allee — Value Networks
- Stafford Beer — Viable System Model (VSM)

---

## Notas de Asimilación (Copyright)

- **Documento origen**: Contenido original usuario (Isaac Ko) — asimilación completa autorizada
- **Fuentes OVN/Sensorica**: Previamente asimiladas bajo fair use / CC-BY-SA / licencias abiertas
- **Conceptos universales**: Ostrom, Benkler, Bauwens, Beer, VSM, CBPP, DGML, Coase, Shirky — dominio público
- **Implementación**: Patrones lógicos extraídos, no código copiado
- **Próximo paso inmediato**: **Fase 1 Implementación** — `contributionTracing.ts` + `knowledgeReferencing.ts` (ITC core) + `fourRegistries.ts` (fluid equity adaptado) + `taskRoleSeparation.ts` (COS)