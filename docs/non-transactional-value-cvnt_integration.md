# Integración Contabilidad de Valor No Transaccional (CVNT) — ALRAC/Zeitnus

**Fuente asimilada:** `docs/non-transactional-value-cvnt_backup.md` — Propuesta conceptual de valoración no transaccional para ALRAC/Zeitnus. Propuesta del usuario, no documento de terceros con derechos de autor externos.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). La propuesta del usuario es explícita: **no crear una nueva moneda CVNT**, sino una especificación `alrac-tq-non-transactional-value.md` con 5 componentes (`ContinuityRegistry`, `NonTransactionalEvent`, `ExternalityAssessment`, `CommonsStewardship`, `ContinuityDecisionEngine`) y una separación estricta entre 6 categorías (valor observado, contribución atribuible, beneficio colectivo, derecho de acceso, derecho de propiedad, recompensa económica). La propuesta conecta con specs existentes: `alrac-tq-valueflows` (observation/claim/fulfillment), `alrac-tq-desmercantilizacion` (care_income/ecological_dividend/ecological_credit), `alrac-tq-economia-comunes` (excedentes reinvertidos), `TQ_POSTLABOR_PROPOSAL` (TQ Stock/Flow Dual-Layer), `boundaries.ts` (límites duros), `registrySystem.ts` (4 registros separados).

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Reconocer valor sin transacción**: registrar que un bosque comunitario sigue produciendo condiciones de existencia (suelo, agua, biodiversidad) aunque nadie cobre TQ ni reclame créditos.
- **Documentar externalidades evitadas**: no hubo inundación porque se recuperó el suelo; no hubo desperdicio porque se compartieron herramientas; no hubo dependencia porque se desarrolló autonomía.
- **Separar estrictamente categorías**: valor observado ≠ contribución atribuible ≠ beneficio colectivo ≠ derecho de acceso ≠ derecho de propiedad ≠ recompensa económica.
- **Justificar decisiones colectivas sin deuda ni crédito**: demostrar que un bosque recupera infiltración justifica que la comunidad destine recursos a protegerlo, sin que el registrador sea propietario del agua.
- **Evitar mercantilizar la naturaleza**: no convertir el oxígeno del bosque en tokens; no confundir presencia con contribución; no condicionar el acceso a necesidades básicas a la productividad individual.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto propuesta CVNT | Módulo Zeitnus/ALRAC destino | Observación |
|-------------------------|------------------------------|-------------|
| Continuidad biológica y ecológica (agua, suelo, biodiversidad, fertilidad, resiliencia) | `continuity-registry.ts` + `tq-land.ts` (`landType='conservation'`, `regenerationIndex`) | Registro de condiciones que sostienen la vida |
| Continuidad social y relacional (cuidados, confianza, cooperación) | `continuity-registry.ts` + `contributionAccounting.ts` | Cuidado cotidiano sin reputación como requisito |
| Continuidad cognitiva (conocimiento abierto, documentación, educación) | `continuity-registry.ts` + `registrySystem.ts` | Conocimiento que se multiplica sin apropiación |
| Continuidad sistémica (mantenimiento preventivo, redundancia, autonomía) | `continuity-registry.ts` + `aut-autonomy.ts` | Capacidad de recuperación sin dependencia externa |
| NonTransactionalEvent (observaciones sin transferencia) | `tq-valueflows.ts` (tipo `observation`) + `non-transactional-value.ts` | Evento VF sin contraprestación |
| ExternalityAssessment (escenarios contrafactuales, evasión de daños) | `non-transactional-value.ts` | Documentar "no hubo inundación" |
| CommonsStewardship (derechos/responsabilidades sobre bienes comunes) | `propertyRegimeSystem.ts` (Non-Dominium, custodio temporal) | Custodia, no propiedad individual |
| ContinuityDecisionEngine (evidencia → decisión de protección) | `non-transactional-value.ts` + `governanceTriad.ts` | Asignación de recursos sin generar deuda |
| Separación 6 categorías (valor observado / contribución / beneficio / acceso / propiedad / recompensa) | `non-transactional-value.ts` + `boundaries.ts` | Límites duros contra confusión categórica |
| No nueva moneda CVNT | `boundaries.ts` DENY | Rechazar explícitamente tokenización como solución por defecto |
| RAO / CDS para procedencia y validación | `rao.ts` + `cds.ts` | Atribución sin reputación como requisito de legitimidad |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Nueva moneda/token CVNT | El usuario lo rechaza explícitamente; no hay necesidad | Lógica pura en TS, sin token |
| Tokens Presence/Sweat como medida de valor social | Riesgo de confundir presencia con contribución | Separar categorías; cuidado sin reputación como requisito |
| Remuneración ligada a productividad individual | Riesgo de coerción laboral en economía postmonetaria | Acceso a necesidades básicas separado de productividad |
| CDS como único legitimador de cuidado | Favorece resultados visibles sobre cuidado cotidiano | CDS como evidencia, no como condición de legitimidad |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de la propuesta CVNT |
|--------|-----------------------------|
| `src/core/lib/non-transactional-value.ts` | (NUEVO) ContinuityRegistry, NonTransactionalEvent, ExternalityAssessment, CommonsStewardship, ContinuityDecisionEngine |
| `src/core/lib/tq-valueflows.ts` | Extender: tipo `observation` para eventos sin transferencia; `fulfillment` sin contraprestación |
| `src/core/state/non-transactional-value.ts` | (NUEVO) Tipos y estado del registro de continuidad |
| `src/core/lib/boundaries.ts` | DENY: nueva moneda, confusión categórica (6 categorías), remuneración coactiva |
| `src/core/lib/propertyRegimeSystem.ts` | CommonsStewardship: custodio temporal, no propietario |
| `src/core/lib/contributionAccounting.ts` | Separar contribución atribuible de beneficio colectivo |
| `src/core/lib/boundaries.ts` | Límites duros: no tokenizar naturaleza, no confundir presencia con valor social |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- CVNT: reconocer condiciones que sostienen la vida sin apropiarlas; evitar convertir la naturaleza en mercancía; proteger bienes comunes sin generar deuda individual.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el reconocimiento no transaccional es una forma de no dañar: no extraer valor de lo que sostiene la vida.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- CVNT: autonomía y resiliencia sistémica son valor en sí mismas; el cuidado cotidiano tiene legitimidad sin acumular reputación.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** la continuidad sistémica (autonomía, redundancia) es parte del beneficio colectivo, no de la recompensa individual.

### Ley III — Lucidez, nunca engañar
- CVNT: separación estricta de 6 categorías; escenarios contrafactuales con niveles de incertidumbre; no confundir valor observado con recompensa.
- HSCSG: RAO (procedencia, emisor, permisos, estado, revocación), Modo Lucidez, `currentSeeSystem.ts`.
- **Resonancia:** todo reconocimiento no transaccional es trazable (RAO) y transparente (Modo Lucidez), pero no genera deuda.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- CVNT: bienes comunes, cuidados, confianza, conocimiento abierto son patrimonio de continuidad colectiva; acceso por necesidad, no por productividad.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; acceso universal a servicios básicos.
- **Resonancia:** el acceso a necesidades básicas permanece separado de la demostración de productividad individual.

---

## 4. Tabla de mapeo isomórfico (propuesta CVNT → Zeitnus/ALRAC)

| Concepto propuesta | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|--------------------|----------------------|------|----------|--------|
| ContinuityRegistry | `non-transactional-value.ts` + `tq-land.ts` | Capa 1/4 | Ley I | **Pendiente** |
| NonTransactionalEvent | `tq-valueflows.ts` (tipo observation) | Capa 4 | Ley III | **Pendiente** |
| ExternalityAssessment | `non-transactional-value.ts` | Capa 4 | Ley II | **Pendiente** |
| CommonsStewardship | `propertyRegimeSystem.ts` (Non-Dominium) | Capa 1 | Ley I | **Pendiente** |
| ContinuityDecisionEngine | `non-transactional-value.ts` + `governanceTriad.ts` | Capa 5 | Ley II | **Pendiente** |
| 6 categorías separadas | `non-transactional-value.ts` + `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |
| No nueva moneda CVNT | `boundaries.ts` DENY | Capa 0 | Ley III | **Pendiente** |
| RAO/CDS para procedencia | `rao.ts` + `cds.ts` | Capa 4 | Ley III | Implementado (partial) |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Registro de continuidad biológica, social, cognitiva, sistémica | Nueva moneda o token CVNT |
| Eventos no transaccionales (observation sin fulfillment) | Tokens como medida de valor social |
| Evaluación de externalidades evitadas (contrafactuales) | Remuneración ligada a productividad individual |
| Stewardship de bienes comunes (custodia, no propiedad) | CDS como único legitimador del cuidado |
| Motor de decisiones de protección (evidencia → asignación) | Confusión entre las 6 categorías |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión propuesta CVNT | Vaso comunicante |
|----------------|-------------------------|------------------|
| `non-transactional-value.ts` | 5 componentes CVNT | RAO/CDS para procedencia y validación |
| `tq-valueflows.ts` | Eventos `observation`/`claim`/`fulfillment` sin transferencia | Corrientes unificadas `currentSeeSystem.ts` |
| `propertyRegimeSystem.ts` | CommonsStewardship (custodio temporal) | Non-Dominium de bienes comunes |
| `contributionAccounting.ts` | Separar contribución de beneficio colectivo | Registro de contribución inmutable |
| `boundaries.ts` | 6 categorías separadas; no nueva moneda | DENY rules contra mercantilización |
| `registrySystem.ts` | 4 registros separados aplicados a continuidad | Registro público de continuidad colectiva |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D10

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | No crear nueva moneda CVNT; especificación con 5 componentes en su lugar | "Yo no crearía una nueva moneda CVNT. Crearía una especificación" | `boundaries.ts` DENY |
| D2 | ContinuityRegistry: 4 dominios (biológica, social, cognitiva, sistémica) | "Cuatro registros complementarios: A-D" | `non-transactional-value.ts` |
| D3 | NonTransactionalEvent: observaciones y acontecimientos sin transferencia económica | ValueFlows tipos `observation`, `claim`, `fulfillment` | `tq-valueflows.ts` + `non-transactional-value.ts` |
| D4 | ExternalityAssessment: escenarios contrafactuales, evidencia, niveles de incertidumbre | "documentar relaciones causales, escenarios contrafactuales, evidencia y niveles de incertidumbre" | `non-transactional-value.ts` |
| D5 | CommonsStewardship: derechos, responsabilidades, protección; custodia no propiedad | "custodia, no propiedad individual" | `propertyRegimeSystem.ts` |
| D6 | ContinuityDecisionEngine: evidencia → decisiones de protección y asignación de recursos | "traducción de evidencia en decisiones de protección y asignación de recursos" | `non-transactional-value.ts` + `governanceTriad.ts` |
| D7 | Separación estricta de 6 categorías: valor observado, contribución atribuible, beneficio colectivo, derecho de acceso, derecho de propiedad, recompensa económica | "separación estricta entre: Valor observado. Contribución atribuible. Beneficio colectivo. Derecho de acceso. Derecho de propiedad. Recompensa económica." | `non-transactional-value.ts` + `boundaries.ts` |
| D8 | Reconocimiento no implica monetización, remuneración ni apropiación individual | "el reconocimiento de una contribución no implica necesariamente su monetización, remuneración o apropiación individual" | `boundaries.ts` DENY |
| D9 | Acceso a necesidades básicas separado de productividad individual | "El acceso universal a necesidades básicas debe permanecer separado de la demostración de productividad individual" | `caas.ts` + `znu.ts` |
| D10 | Cuidado cotidiano no requiere reputación para tener legitimidad | "El cuidado cotidiano, por ejemplo, no debería depender de acumular reputación para tener legitimidad" | `cds.ts` + `contributionAccounting.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `non-transactional-value.ts` | ContinuityRegistry registra 4 dominios; NonTransactionalEvent sin transferencia; ExternalityAssessment con incertidumbre; CommonsStewardship sin propietario individual | `tests/non-transactional-value.test.ts` |
| `tq-valueflows.ts` | Tipo `observation` soporta eventos sin contraprestación; `fulfillment` sin transferencia | `tests/tq-valueflows-observation.test.ts` |
| `propertyRegimeSystem.ts` | CommonsStewardship: custodio temporal, rechaza propietario individual sobre bien común | `tests/commons-stewardship.test.ts` |
| `boundaries.ts` | DENY: nueva moneda CVNT; confusión de las 6 categorías; remuneración coactiva | `tests/boundaries-non-transactional.test.ts` |
| `registrySystem.ts` | Registro público de continuidad colectiva, append-only | `tests/registry-continuity.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-non-transactional-value.md` — 5 componentes, 6 categorías, 4 dominios de continuidad, circuit breakers categóricos

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/non-transactional-value.ts`: `ContinuityRecord`, `NonTransactionalEvent`, `ExternalityAssessment`, `CommonsStewardshipRecord`, `ContinuityDecision`, `ContinuityCategory` (6 categorías)

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `non-transactional-value.ts`: `registerContinuity()`, `recordNonTransactionalEvent()`, `assessExternalityAvoided()`, `assignCommonsStewardship()`, `makeContinuityDecision()`, `categorizeValue()` (asigna a una de las 6 categorías, rechaza confusión)
- Extender `tq-valueflows.ts`: soporte para evento `observation` sin `fulfillment` asociado obligatorio
- No crear moneda; no usar tokens para valor social; no condicionar acceso básico a productividad

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeNonTransactionalValueState()`.
- Añadir `nonTransactionalValue: NonTransactionalValueState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ nonTransactionalValue: {...st.nonTransactionalValue, ...} }))`.
- Incluir `makeNonTransactionalValueState()` en `resetAll()`.
- Incluir `nonTransactionalValue: st.nonTransactionalValue` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: contabilidad de valor no transaccional CVNT (5 componentes, 6 categorías) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/non-transactional-value-cvnt_backup.md` (propuesta completa del usuario)
- `openspec/specs/alrac-tq-valueflows.md` (ValueFlows REA: observation/claim/fulfillment)
- `openspec/specs/alrac-tq-desmercantilizacion.md` (care_income, ecological_dividend, ecological_credit, CaaS Streams)
- `openspec/specs/alrac-tq-economia-comunes.md` (excedentes reinvertidos, no dividendos)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `src/core/lib/tq-types-extended.ts` (TQEquityAccount, Stock Layer)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/propertyRegimeSystem.ts` (Non-Dominium, custodio temporal)
- `src/core/lib/contributionAccounting.ts` (registro de contribución)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/cds.ts` + `rao.ts` (CDS, procedencia)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
