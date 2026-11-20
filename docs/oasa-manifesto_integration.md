# Integración OASA Manifiesto — Regenerative Commons Protocol

**Fuente asimilada:** `docs/oasa-manifesto_backup.md` — Samuel Delesque, "From Commons to Commodities and Back: A Regenerative Commons Manifesto", 26 de diciembre de 2025. Todos los derechos de autor permanecen con el autor.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El manifiesto profundiza la filosofía y arquitectura de OASA/TDF ya parcialmente asimilada en `docs/oasa-tdf_economia_comunes_*` y `docs/oasa-tdf-governance-stack_integration.md`. Añade: principios regenerativos (50% tierra salvaje, 3 Rs, 7 generaciones), monitoreo tecnológico (eDNA, sensores, satélites, Open Forest Protocol, Guardians of Nature), modelos de prueba (Central Park Conservancy, Trust for Public Land), y el protocolo OASA como sistema operativo de civilización regenerativa.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Ver tierra regenerada, no especulada**: al menos 50% de cada proyecto como tierra salvaje/rewilded; policultivo de 5+ especies por 10m² y 20 por hectárea; agroforestería sintropica.
- **Ver agua retenida, no drenada**: swales, estanques, terraplenes; ciclo hidráulico completo (slow, spread, sink); humedales restaurados.
- **Ver biodiversidad medida, no afirmada**: eDNA de suelos y aguas, sensores de humedad/nutrientes, satélites, cámaras trampa; dashboard público tipo "digital twin" de la tierra.
- **Ver gobernancia con voz no humana**: Guardians of Nature con veto ecológico; decisiones evaluadas por impacto en 7 generaciones futuras.
- **Ver tokens sin especulación**: 1 $TDF = 1 noche/año para siempre; bonding curve de emisión única (no recompra por el emisor); no redimibles en moneda; valor ligado a uso, no a hype.
- **Ver capital catalítico sin interés**: préstamos al 0% o subvenciones recuperables; retorno medido en salud ecológica, no en dividendo compuesto.
- **Ver conocimiento abierto, no cerrado**: planes, código, lecciones aprendidas publicados; open-source como principio constitucional.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto manifiesto | Módulo Zeitnus/ALRAC destino | Observación |
|---------------------|------------------------------|-------------|
| 50% tierra salvaje / rewilding por proyecto | `tq-land.ts` (`regenerationIndex`, `landType='conservation'`) + `boundaries.ts` | Límite duro: conservación ≥ 50% |
| 3 Rs (Respect, Reciprocity, Relationship) | `tq-oasa.ts` (principios regenerativos) + `boundaries.ts` | Constitución del común |
| 7 generaciones (evaluación de impacto) | `tq-tdf.ts` + `tq-oasa.ts` (veto Guardians) | Límite intergeneracional |
| eDNA monitoreo biodiversidad | `regenerative-agent.ts` (dominio `biodiversity`) + `mel-crm.ts` (indicadores) | MRV científico |
| Sensores suelo/agua + satélites + OFP | `regenerative-agent.ts` (dominio `water`) + `celo-verifier.ts` (oráculo externo) | MRV transparente, auditado |
| Guardians of Nature (veto ecológico) | `tq-oasa.ts` (Guardians) + `governanceTriad.ts` | Veto sobre decisiones inconstitucionales |
| Tokens no-speculativos, bonding curve emisión única | `tq-oasa.ts` + `alrac-tq-economia-comunes` | Emisión única, no recompra por emisor |
| 1 $TDF = 1 noche/año, para siempre | `tq-oasa.ts` (use-rights) | Derecho de uso perpetuo, no consumible |
| Catalytic Capital (0% interés, recuperable) | `caas.ts` + `znu.ts` | Crédito mutuo sin usura |
| Transition Dividend (reembolso por superávit operativo) | `benefitRedistribution.ts` + `registrySystem.ts` | Reembolso sin interés compuesto |
| Conocimiento abierto (plans, code, lessons) | `registrySystem.ts` + `currentSeeSystem.ts` | Registro público, append-only |
| Modelos: Central Park Conservancy, TPL | `propertyRegimeSystem.ts` (custodio perpetuo) | Fideicomiso de tierra, inalienable |
| Humanos como especie clave (keystone) | `regenerative-agent.ts` (filosofía de dominio) | Principio rector, no módulo técnico |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Blockchain como motor de ejecución | Algunos contratos OASA son AGPL-1.0 / no abiertos | Lógica pura en TS; cadena solo como anclaje RAO opcional |
| Mercados de carbono especulativos | Riesgo de financiarización de la naturaleza | OFP como MRV transparente; créditos solo si no especulativos |
| IA autónoma sin veto humano | Guardianes pueden ser "AI-assisted" pero no autónomos | Humano en el bucle; veto ecológico humano primero |
| Código cerrado / secretos propietarios | Constitución OASA exige conocimiento abierto | Todo publicado; registro append-only |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del manifiesto OASA |
|--------|---------------------------|
| `src/core/lib/tq-land.ts` | Extender: `regenerationIndex`, tipo `conservation`, umbral 50% salvaje |
| `src/core/lib/tq-oasa.ts` | Extender: 3 Rs, 7 generaciones, veto Guardians, tokens no-speculativos |
| `src/core/lib/tq-tdf.ts` | Extender: proof of presence, 1 noche/año, Go-Live, transferibilidad post-hitos |
| `src/core/lib/regenerative-agent.ts` | Extender: dominios `water`, `biodiversity`, `soil`; eDNA, sensores, satélites |
| `src/core/lib/mel-crm.ts` | Extender: indicadores MEL, MRV, Open Forest Protocol, dashboard público |
| `src/core/lib/caas.ts` + `znu.ts` | Catalytic Capital, crédito sin interés, Transition Dividend |
| `src/core/lib/boundaries.ts` | DENY: especulación en tokens, recompra por emisor, interés compuesto, IA autónoma sin humano |
| `openspec/specs/alrac-tq-monitoring-mrv.md` | (NUEVA) Spec: monitoreo, eDNA, sensores, OFP, Guardians |
| `openspec/specs/alrac-tq-oasa-constitution.md` | (EXTIENDE espec existente) 3 Rs, 7 generaciones, conocimiento abierto |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Manifiesto: tierra como "bundle of relationships", no bundle of rights; 50% rewilded; Guardians con veto; 7 generaciones; no venta ni colateral.
- HSCSG: MJ Gate bloquea acciones que degraden base; `boundaries.ts` DENY contra especulación y extracción.
- **Resonancia:** el veto ecológico y el umbral de 7 generaciones se codifican como límites duros.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Manifiesto: tokens por uso, no por ganancia; catalytic capital sin interés; conocimiento abierto; humanos como especie clave que cuida.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el trabajo de restauración genera acceso y gobernanza; el capital catalítico se devuelve sin extraer.

### Ley III — Lucidez, nunca engañar
- Manifiesto: dashboard público, eDNA, datos abiertos, "digitized commons", conocimiento publicado.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** todo flujo ecológico y de gobernanza es medible, público y verificable.

### CaaS (Comunidad como Servicio)
- Manifiesto: acceso por derecho de uso (token), no por renta; gobernanza por presencia y contribución, no por tenencia.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso y el poder se ganan con presencia real en la tierra.

---

## 4. Tabla de mapeo isomórfico (manifiesto OASA → Zeitnus/ALRAC)

| Concepto manifiesto | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|---------------------|----------------------|------|----------|--------|
| 50% tierra salvaje / rewilding | `tq-land.ts` `regenerationIndex ≥ 0.5`, tipo `conservation` | Capa 1 | Ley I | **Pendiente** |
| 3 Rs (Respect, Reciprocity, Relationship) | `tq-oasa.ts` principios regenerativos | Capa 0/1 | Ley I/II/III | **Pendiente** |
| 7 generaciones (impacto intergeneracional) | `tq-oasa.ts` + `tq-tdf.ts` veto Guardians | Capa 0 | Ley I | **Pendiente** |
| eDNA + sensores + satélites (MRV) | `regenerative-agent.ts` dominios water/biodiversity/soil | Capa 4 | Ley III | **Pendiente** |
| Open Forest Protocol (MRV forestal) | `mel-crm.ts` indicadores MEL + `celo-verifier.ts` | Capa 4 | Ley III | **Pendiente** |
| Guardians of Nature (veto ecológico) | `tq-oasa.ts` Guardians + `governanceTriad.ts` | Capa 0/1 | Ley I | **Pendiente** |
| Tokens no-speculativos, bonding curve única | `tq-oasa.ts` + `alrac-tq-economia-comunes` | Capa 5 | CaaS | Implementado (partial) |
| 1 $TDF = 1 noche/año, para siempre | `tq-oasa.ts` use-rights | Capa 4 | Ley III | Implementado (partial) |
| Catalytic Capital (0% interés, recuperable) | `caas.ts` + `znu.ts` | Capa 5 | Ley II | **Pendiente** |
| Transition Dividend (reembolso sin interés compuesto) | `benefitRedistribution.ts` | Capa 5 | Ley II | **Pendiente** |
| Conocimiento abierto (plans, code, lessons) | `registrySystem.ts` + `currentSeeSystem.ts` | Capa 4 | Ley III | **Pendiente** |
| Humanos como especie clave | Filosofía de dominio `regenerative-agent.ts` | Capa 0 | Ley II | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|-----------------------------------|
| Principios regenerativos (50% rewilded, 3 Rs, 7 generaciones) | Contratos blockchain de OASA como motor de ejecución |
| Monitoreo MRV (eDNA, sensores, satélites, OFP) | Mercados de carbono especulativos como financiación |
| Guardians of Nature con veto ecológico | IA autónoma sin veto humano en decisiones ecológicas |
| Tokens no-speculativos, bonding curve emisión única | Recompra de tokens por el emisor, liquidez especulativa |
| Catalytic Capital sin interés, Transition Dividend | Préstamos con interés compuesto, deuda usuraria |
| Conocimiento abierto, registro público | Código cerrado, secretos propietarios, techno-utopianismo |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión manifiesto | Vaso comunicante |
|----------------|---------------------|------------------|
| `tq-land.ts` | Regenerative Principles (50% wild, agroforestería) | RAO de tierra productiva + conservación |
| `tq-oasa.ts` | Constitución OASA (3 Rs, 7 generaciones, Guardians) | Veto ecológico + constitución del común |
| `regenerative-agent.ts` | Monitoreo (eDNA, sensores, satélites, hackathons) | Dominios water/biodiversity/soil + LLM |
| `mel-crm.ts` | Open Forest Protocol, indicadores MEL, dashboard | 4 registros + soberanía de datos |
| `caas.ts` + `znu.ts` | Catalytic Capital, crédito sin interés | Moneda anfibia postmonetaria/conectada |
| `benefitRedistribution.ts` | Transition Dividend, reembolso por superávit | Redistribución de beneficios (R4=20%) |
| `registrySystem.ts` | Conocimiento abierto, registro público | 4 registros separados, append-only |
| `boundaries.ts` | Límites duros (no especulación, no recompra, no interés) | DENY rules contra plataformas incompatibles |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D28

| ID | Decisión | Evidencia primaria (del manifiesto) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1-D8 | (previas: economía comunes: bonding curve, capital/operaciones, exit-to-commons, límites duros, Proof of Presence, sweat 20%, anfibio TQ/ZNU, red 100.000 ha) | `docs/oasa-tdf_economia_comunes_backup.md` | Múltiples |
| D9-D20 | (previas: stack gobernanza TDF/OASA/Closer: peso voto, verify on-chain, Snapshot, presence/sweat decay, staking, roles, DAO, agente, CRM) | `docs/oasa-tdf-governance-stack_integration.md` | Múltiples |
| D21 | Al menos 50% de tierra de cada proyecto como wild/rewilded; regeneración de ecosistema como piso, no techo | "Regenerative Principle 5 (Rewilding & Biodiversity)" | `tq-land.ts`, `boundaries.ts` |
| D22 | Agroforestería y permacultura: 5+ especies por 10m², 20 por hectárea; tree crops / food forests | "Regenerative Principle" + TDF pilot | `tq-land.ts`, `caas.ts` |
| D23 | Water Retention Landscapes: swales, ponds, terraces; slow, spread, sink water | "Regenerative Principle 2 (Water)" | `tq-land.ts`, `regenerative-agent.ts` |
| D24 | eDNA monitoreo biodiversidad (suelo/agua); baseline inventarios; monitoreo anual | "Monitoring and Technology" + SimplexDNA | `regenerative-agent.ts`, `mel-crm.ts` |
| D25 | Sensores suelo/agua + satélites + Open Forest Protocol (MRV) | "Monitoring and Technology" + OFP | `regenerative-agent.ts`, `celo-verifier.ts` |
| D26 | Guardians of Nature con veto ecológico; decisiones no pueden overridear regenerative Principles | OASA Constitution Article V.3 + "Guardians of Nature" | `tq-oasa.ts`, `governanceTriad.ts` |
| D27 | Tokens no-speculativos: no promesas de retorno financiero; no redimibles en moneda; bonding curve emisión única (no recompra por emisor) | OASA Constitution Article VI (Economy) | `tq-oasa.ts`, `boundaries.ts` |
| D28 | 7 generaciones: todas las decisiones evaluadas por impacto intergeneracional; ninguna acción compromete capacidad futura | OASA Constitution + "we borrow it from our children" | `tq-oasa.ts`, `boundaries.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `tq-land.ts` | `regenerationIndex` válido [0,1]; tipo `conservation` ≥ 50% área; rechaza overlap y regeneración > 1 | `tests/tq-land-regeneration.test.ts` |
| `tq-oasa.ts` (principios) | 3 Rs codificados; veto Guardians operativo; 7 generaciones en evaluación de decisiones | `tests/tq-oasa-principles.test.ts` |
| `regenerative-agent.ts` | Dominios water/biodiversity/soil; eDNA baseline; integración multi-dominio; conflictos resueltos por prioridad | `tests/regenerative-agent-mrv.test.ts` |
| `mel-crm.ts` | Indicadores MEL (quant/qual, ToC level); `checkDataAccess` respeta soberanía; mediciones inmutables | `tests/mel-crm-mrv.test.ts` |
| `celo-verifier.ts` | Verify on-chain de peso de voto (ya implementado); OFP como oráculo externo de MRV forestal | `tests/celo-verifier-mrv.test.ts` |
| `caas.ts` + `znu.ts` | Catalytic Capital sin interés; Transition Dividend sin interés compuesto; ZNU anfibio | `tests/caas-catalytic.test.ts` |
| `boundaries.ts` | DENY: especulación en tokens, recompra por emisor, interés compuesto, IA autónoma sin humano | `tests/boundaries-oasa.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Specs OpenSpec (nuevas/extendidas)
1. `openspec/specs/alrac-tq-monitoring-mrv.md` — eDNA, sensores, satélites, OFP, Guardians, dashboard público
2. `openspec/specs/alrac-tq-oasa-constitution.md` — extender `alrac-tq-oasa` con 3 Rs, 7 generaciones, conocimiento abierto

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/monitoring.ts`: `MRVRecord`, `EDNASample`, `SensorReading`, `GuardianVeto`, `GenerationalImpact`
- Extender `tq-types-extended.ts`: `LandRegenerationIndex`, `CatalyticCapital`, `TransitionDividend`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `monitoring-mrv.ts`: `recordEDNASample()`, `recordSensorReading()`, `calculateRegenerationIndex()`, `isGuardianVetoTriggered()`
- `oasa-constitution.ts`: `evaluateSevenGenerations()`, `checkThreeRs()`, `isNonSpeculativeToken()`
- Extender `tq-land.ts`: `registerRewildedArea()`, `verifyAgroforestryDensity()`
- Extender `caas.ts` / `znu.ts`: `issueCatalyticCapital()`, `calculateTransitionDividend()`
- No importar web3/ethers; no copiar contratos Solidity; no usar IA autónoma sin humano

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `make*State()` de cada módulo.
- Añadir namespaces a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ ns: {...st.ns, ...} }))`.
- Incluir cada `make*State()` en `resetAll()`.
- Incluir cada namespace en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: manifiesto OASA (principios regenerativos, MRV, Guardians, 7 generaciones) + docs/specs`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/oasa-manifesto_backup.md` (texto completo del manifiesto)
- `docs/oasa-tdf_economia_comunes_backup.md` + `_integration.md` (capa económica previa)
- `docs/oasa-tdf-governance-stack_integration.md` (stack gobernanza previa)
- `openspec/specs/alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-tq-economia-comunes.md`
- `openspec/specs/alrac-tq-governance-verification.md`, `alrac-tq-presence-sweat.md`, `alrac-tq-regenerative-agent.md`, `alrac-tq-mel-crm.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- OASA Constitución: https://oasa.earth/
- SimplexDNA: https://www.simplexdna.com/
- Open Forest Protocol: http://atlas.smartforests.net/en/logbooks/open-forest-protocol/
- Central Park Conservancy: https://www.centralparknyc.org/governance
- Trust for Public Land: https://www.tpl.org/our-mission/lands
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
