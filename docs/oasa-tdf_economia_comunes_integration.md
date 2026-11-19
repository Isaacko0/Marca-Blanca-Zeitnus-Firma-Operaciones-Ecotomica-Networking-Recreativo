# Integración OASA / TDF — Economía del Común Regenerativo

**Fuente asimilada:** `docs/oasa-tdf_economia_comunes_backup.md` — Samuel Delesque, "Rethinking Wealth: Economics of a Regenerative Commons", 27 de diciembre de 2025. Estudio de caso de Traditional Dream Factory (TDF) / red OASA (Alentejo, Portugal). Todos los derechos de autor permanecen con el autor; esta integración es análisis original derivado, no reproducción de la obra.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). Las specs existentes `alrac-tq-oasa` (Constitución, Implemented) y `alrac-tq-tdf` (Tres pistas de verificación, Implemented) cubren gobernanza y verificación; este documento cubre la **capa económica** que aún no tiene spec: curva de bonding, separación capital/operaciones, salida-a-los-comunes (exit-to-commons), ingresos diversificados y modelo macroeconómico.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Acceder a tierra y vivienda sin propiedad especulativa**: derecho de uso perpetuo sobre un bien común, sin título individual ni equity, protegido contra venta o extracción privada.
- **Pagar solo costes de operación, sin alquiler ni interés**: coste de estancia aproximado €18/persona/día (€4 servicios + €14 comida), sin markup de beneficio.
- **Pre-pagar acceso de por vida y recuperar su inversión al salir**: reventa de tokens $TDF a otro miembro; el dinero circula dentro de la comunidad, no sale del común.
- **Gobernar proporcionalmente a su participación real**: voto ponderado por Proof of Presence (noches efectivas en sitio), evitando dominio de ausentes/especuladores; capa de guarda ecológica (Council of Regeneration) que veta vulneraciones de principio.
- **Pertener a una red de aldeas regenerativas**: uso recíproco de tokens entre sitios, Federación con liquidez de experiencia y opciones; objetivo OASA de 100.000 ha bajo común.
- **Inversión con horizonte milenario**: retorno medido en suelo, agua, bosques, comunidad — no en dividendos trimestrales; capital paciente que se devuelve y se re-semilla en nuevos comunes.

HSCSG/Zeitnus le da la **máquina soberana offline-first** que hace esto real: TQ como unidad contable-anclada (1 TQ = 1 kWh), ZNU como moneda de transición anfibia, Leyes del Materialismo Jerárquico como límites duros, y gobernanza holónica 1a1v.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto OASA/TDF | Módulo Zeitnus/ALRAC destino | Observación |
|---|---|---|
| Tierra como común perpetuo, sin título individual | `src/core/lib/tq.ts` (`LandRegistryEntry`, `propertyRegimeSystem.ts`) | Non-Dominium como régimen por defecto; custodio temporal auditable |
| Derecho de uso perpetuo (1 token = 1 noche/año, no consumible) | `tq-oasa.ts` (use-rights), `tq-tdf.ts` (verificación de acceso) | Token como instrumento de uso, no de equity |
| Curva de bonding (Commons Market Maker) | Nueva spec `alrac-tq-economia-comunes` + `tq.ts`/`tq-caas.ts` | Precio algoritmático ligado a oferta, tope por capacidad de carga |
| Separación capital vs operaciones | `tq.ts` (TQ Ledger), `znu.ts`, `currentSeeSystem.ts` | Firewall contable: fondo de capital vs presupuesto operativo |
| Exit-to-commons (retirar deuda con capital comunitario) | `tq.ts`, `benefitRedistribution.ts`, `registrySystem.ts` | Extinción de deuda; bien libre de cargas en común |
| Proof of Presence (gobernanza ponderada por presencia) | `tq-tdf.ts` (pista social), `governanceTriad.ts`, `core/state/caas.ts` | CDS-weighted, participación real sobre peso token |
| Council of Regeneration (guarda ecológica con veto) | `tq-oasa.ts` (Guardians of Nature), `boundaries.ts` (DENY rules) | Veto ecológico como límite duro |
| Ingresos diversificados (tokens, estancias, eventos, producción in-situ) | `alrac-caas-revenue-streams.md`, `core/core/lib/caas.ts` | 6 streams + validación Gate MJ |
| 20% tokens por trabajo (sweat equity) | `contributionAccounting.ts`, `contributionAssessment.ts`, `registrySystem.ts` | Registro de contribución inmutable post-redistribución |
| No renta, no extracción, prohibición de dividendos | `boundaries.ts` (DENY rules), principio anfibio | Comisiones = 0, voto = 1, sin priceParity en TQ |
| Riesgo compartido, resiliencia, antifragilidad | `ALRAC_MASTER_INTEGRADO.md`, `simulacion_4agent_20260919` | Escenarios de estrés, capital paciente |

### 2.2 Extirpar (infra ajena — regla de la skill de asimilación)

- Smart contracts / EVM / Solidity como infra de ejecución → la lógica se reimplementa en TypeScript puro; blockchain solo como capa opcional de transparencia/anclaje RAO, nunca como motor.
- Liquidez pool automática / mercado secundario abierto → se extirpa como infra financiera externa; la reventa entre miembros se modela como transferencia de derecho de uso sin extracción de tesoro del común.
- Cripto como fin en sí mismo → blockchain es medio (transparencia, programabilidad, accesibilidad global), no fin; el diseño económico está anclado en el mundo físico.
- Promesas de retorno especulativo / seguridad financiera → el token es utilitario, no valor mobiliario; se extirpa cualquier cláusula de dividendo o plusvalía.
- Oracle de precio fiat como motor de la lógica económica → TQ opera en modo postmonetario SOLO (sin conversión fiat); ZNU es el modo anfibio con priceParity oráculo (Nivel 3 ReFi). Nunca mezclar.

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de OASA/TDF |
|---|---|
| `src/core/lib/tq.ts` | Registro de tierra productiva (kWh/año), Non-Dominium, rendimiento TQ |
| `src/core/lib/propertyRegimeSystem.ts` | Custodio temporal, recall comunitario, forking con convergencia |
| `src/core/lib/tq-oasa.ts` | Constitución, 7 principios, use-rights, guarda ecológica con veto |
| `src/core/lib/tq-tdf.ts` | Verificación de 3 pistas, Proof of Presence, panel social |
| `src/core/lib/znu.ts` + `valueDual.ts` | Moneda de transición anfibia (postmonetario ↔ conectado USDC/USDC) |
| `src/core/lib/caas.ts` + `alrac-caas-revenue-streams.md` | Streams de ingreso, firewall capital/operaciones |
| `src/core/lib/contributionAccounting.ts` + `registrySystem.ts` | Sweat equity, 4 registros separados, contribución inmutable |
| `src/core/lib/boundaries.ts` | Límites duros: comisión 0, voto 1, no extracción, no especulación |
| `openspec/specs/alrac-tq-economia-comunes.md` | (NUEVA) Spec de la capa económica del común regenerativo |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- OASA: tierra "bloqueada" en fideicomiso para generaciones futuras; los ingresos por disolución van a causas regenerativas afines; fallback ante quiebra = transferencia a otro común de conservación, nunca mercado.
- HSCSG: MJ Gate bloquea acciones que degraden la base material; `boundaries.ts` codifica DENY rules (no extracción, no especulación, no price negotiation en TQ).
- **Resonancia:** ambos priorizan la conservación del bien base sobre cualquier retorno financiero.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- OASA: miembros financian la aldea pre-pagando uso; el retorno es vivir en el lugar, no dividendos; 20% de tokens por trabajo (sweat) reduce costes monetarios y profundiza vínculo con la tierra.
- HSCSG: ZNU por Beneficio Neto (Copiosis), acceso por contribución real (CaaS), AUT × CDS como coeficiente de autonomía.
- **Resonancia:** el trabajo y el uso real generan acceso; el capital no especulativo se convierte en infraestructura común.

### Ley III — Lucidez, nunca engañar
- OASA: gobernanza transparente, presupuestos abiertos, token como derecho de uso sin claim sobre valor de intercambio del suelo; "nunca hay markup de beneficio".
- HSCSG: RAO (procedencia, emisor, permisos, estado, revocación), Modo Lucidez, `currentSeeSystem.ts` (corrientes unificadas TQ/ZNU/USDC/CARE/REP_*).
- **Resonancia:** todo flujo es trazable; el token no oculta lo que representa.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- OASA: acceso a estancias por derecho de uso (token), no por renta; ingreso por contribución (sweat equity) reconocido con tokens.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel (Afiliados/Asociados/Núcleo); crédito mutuo 2-3% con expiración 90d.
- **Resonancia:** el acceso se gana con contribución, no se compra con poder adquisitivo puro.

---

## 4. Tabla de mapeo isomórfico (OASA/TDF → Zeitnus/ALRAC)

| Concepto fuente | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|---|---|---|---|---|
| Común perpetuo de tierra (25 ha, sin título) | `tq.ts` `LandRegistryEntry` + `propertyRegimeSystem.ts` | Capa 1 (TQ) | Ley I | Implementado (partial) |
| Derecho de uso perpetuo (1 token = 1 noche/año) | `tq-oasa.ts` (use-rights), `tq-tdf.ts` | Capa 4/5 | Ley III | Implementado (partial) |
| Curva de bonding (€222 → €420, tope 18.600 tokens) | Nueva spec `alrac-tq-economia-comunes` | Capa 5 | CaaS | **Pendiente** |
| Separación capital / operaciones | `tq.ts` + `caas.ts` + `currentSeeSystem.ts` | Capa 1 + 5 | Ley II | **Pendiente** |
| Exit-to-commons (extinguir deuda) | `tq.ts`, `benefitRedistribution.ts`, `registrySystem.ts` | Capa 1 | Ley I/II | **Pendiente** |
| Proof of Presence (voto por uso real) | `tq-tdf.ts` (pista social), `governanceTriad.ts` | Capa 5 | Ley III | Implementado (partial) |
| Council of Regeneration (veto ecológico) | `tq-oasa.ts` Guardians, `boundaries.ts` DENY | Capa 0/1 | Ley I | Implementado (partial) |
| 20% tokens por trabajo (sweat) | `contributionAccounting.ts`, `registrySystem.ts` | Capa 3 | Ley II | Implementado |
| Ingresos diversificados (6 streams) | `alrac-caas-revenue-streams.md`, `caas.ts` | Capa 5 | CaaS | Implementado |
| No renta / no extracción / no dividendos | `boundaries.ts` (DENY rules) | Capa 0/1 | Ley I/III | **Pendiente** |
| Horizonte milenario, retorno compuesto regenerativo | `ALRAC_MASTER_INTEGRADO.md`, `simulacion_4agent` | Capa 0 | Ley II | Implementado |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---|---|
| Curva de bonding matemática (precio = f(oferta), tope por capacidad de carga) | Contrato inteligente Commons Market Maker (Solidity/EVM) |
| Token $TDF como derecho de uso no consumible | Mercado secundario automático (liquidez pool) |
| Separación firewall capital vs operaciones | Oracle de precio fiat como motor económico en TQ |
| Exit-to-commons: extinción de deuda con capital comunitario | Promesas de retorno financiero / seguridad tipo valor mobiliario |
| Proof of Presence + Council of Regeneration con veto | DAO nativa cripto-first sin anclaje legal |
| Ingresos diversificados + sweat equity (20% tokens) | Extracción de dividendos, alquiler con markup, plusvalía del suelo |
| Riesgo compartido, deuda cero, fallback a común de conservación | Liquidación del activo por acreedores, ejecución hipotecaria |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión OASA/TDF | Vaso comunicante |
|---|---|---|
| `tq-oasa.ts` | Constitución OASA (11 artículos, 7 principios) | RAO de cumplimiento ecológico |
| `tq-tdf.ts` | 3 pistas de verificación TDF | Reporte de verificación con RAO |
| `tq-land.ts` (`alrac-tq-land.md`) | Registro de tierra productiva (kWh/año) | Anclaje termodinámico RAO |
| `tq-valueflows.ts` | Eventos económicos, flujos de valor | Contabilidad NRP-CAS / REA |
| `znu.ts` + `valueDual.ts` | Moneda de transición (postmonetario ↔ conectado) | PriceParity oráculo Nivel 3 ReFi |
| `caas.ts` | Streams de ingreso, 6 líneas | Firewall capital/operaciones |
| `boundaries.ts` | Límites duros (no extracción, comisión 0) | DENY rules contra plataformas incompatibles |
| `simulacion_4agent_20260919` | Escenarios de estrés macroeconómico | Validación de resiliencia |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D8

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|---|---|---|---|
| D1 | El precio del token sigue una curva de bonding algoritmática: €222 inicial, ~€420 en capacidad plena, ~€256 a finales de 2025; tope 18.600 tokens = noches-cama/año | "Bonding Curve Financing", €106.000 vendidos en 2025 | Nueva spec `alrac-tq-economia-comunes` + `tq.ts` |
| D2 | Separación estricta: fondos de token solo para capital (tierra, infraestructura) y deuda; operaciones cubiertas por tasas de uso (€83k ingresos vs €86k gastos en 2025, ≈ punto muerto) | "Separation of Capital and Operations" | `tq.ts` + `caas.ts` + `currentSeeSystem.ts` |
| D3 | Exit-to-commons: retirar deuda con compras de tokens; en 2025 €19k de deuda convertidos en tokens; objetivo deuda cero, bien libre de cargas | "Exit-to-Commons: Retiring Debt with Community Capital" | `tq.ts`, `benefitRedistribution.ts`, `registrySystem.ts` |
| D4 | Prohibición expresa de dividendos/extracción financiera; los excedentes se reinvierten en tierra y comunidad | "Aligning Incentives – No Rent, No Extraction" | `boundaries.ts` (DENY rules) |
| D5 | Gobernanza ponderada por Proof of Presence (noches efectivas), con Council of Regeneration con veto ecológico | "Community Governance via DAO" | `tq-tdf.ts` + `tq-oasa.ts` + `boundaries.ts` |
| D6 | 20% de tokens reservados a trabajo/contribución (sweat equity); 1 token = 1 noche/año, no consumible | "Multifaceted Revenue and Resilience" / "Tokenized Access Rights" | `contributionAccounting.ts` + `registrySystem.ts` |
| D7 | TQ opera solo en modo postmonetario (1 TQ = 1 kWh, sin tipo de cambio fiat); ZNU es el modo anfibio (USDC/USDC vía oráculo Nivel 3) | Principio Anfibio HSCSG + incompatibilidades TQ-Gaia | `valueDual.ts`, `znu.ts`, `boundaries.ts` |
| D8 | Red de aldeas con uso recíproco de tokens; objetivo 100.000 ha; horizonte de inversión milenario | "A Third Path" / "Investing for 1000 Years" | `tq-oasa.ts` + `ALRAC_MASTER_INTEGRADO.md` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|---|---|---|
| `tq.ts` (land registry) | Registro valida geometría, RAO, custodio; rendimiento TQ = kWh reales; rechaza overlap y regeneración > 1 | `tests/tq-land.test.ts` |
| Nueva spec economía comunes | Cálculo de curva de bonding (€222 → €420, tope 18.600); firewall capital/operaciones; exit-to-commons extingue deuda | `tests/economia-comunes.test.ts` |
| `tq-oasa.ts` | 11 artículos, 7 principios con métricas, veto del Council of Regeneration | `tests/tq-oasa.test.ts` (existente) |
| `tq-tdf.ts` | 3 pistas (35%/35%/30%), umbrales 80/75/70, Proof of Presence | `tests/tq-tdf.test.ts` (existente) |
| `boundaries.ts` | DENY: comisión ≠ 0, voto ≠ 1, priceParity en TQ, extracción de dividendos | `tests/boundaries.test.ts` |
| `contributionAccounting.ts` | 20% sweat equity, contribución inmutable post-redistribución, 4 registros separados | `tests/contribution-accounting.test.ts` |
| `znu.ts` + `valueDual.ts` | Anfibio: postmonetario por defecto + conectado con oráculo; nunca mezclar TQ con priceParity | `tests/znu-dual.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` debe pasar con 0 errores nuevos en los módulos tocados; `npm run build` debe completar; todas las rutas de preview deben devolver 200 (ver Fase 4 de la skill).

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (esta asimilación)
- Crear `openspec/specs/alrac-tq-economia-comunes.md` (ver abajo): curva de bonding, capital/operaciones, exit-to-commons, ingresos, macro, mapeo a TS, criterios de aceptación, vectores de prueba, dependencias, referencias.

### Fase 3.2 — Tipos (`src/core/state/`)
- Añadir tipos del dominio económico del común en `src/core/state/economia-comunes.ts` (o extender `tq-types-extended.ts`): `BondingCurveParams`, `CapitalVsOperationsBudget`, `ExitToCommonsState`, `RevenueStream`, `CommonsMember` con `proofOfPresence`.

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- Extender o crear `src/core/lib/economia-comunes.ts` con funciones puras: `calculateBondingCurvePrice(supply)`, `separateCapitalVsOperations()`, `retireDebtWithCommunityCapital()`, `isExtractionAllowed()` → siempre `false`.
- No importar infra original (no web3, no EVM, no smart contracts).

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeEconomiaComunesState()`.
- Añadir `economiaComunes: EconomiaComunesState` a `AppState` y al estado inicial de `create()`.
- Añadir acciones en interfaz e implementación con `set((st) => ({ economiaComunes: {...st.economiaComunes, ...} }))`.
- Incluir `economiaComunes: makeEconomiaComunesState()` en `resetAll()`.
- Incluir `economiaComunes: st.economiaComunes` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Escribir y ejecutar tests unitarios para cada KPI de la tabla §8.
- Ejecutar `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` (índice de módulos, espec añadida) y `CHANGELOG.md`.
- Commit: `feat: economia comunes OASA/TDF (curva bonding, capital/operaciones, exit-to-commons) + docs`.
- Push a `origin` (rama actual `asimilacion/ecc-hermes` o main según criterio del usuario).

---

## 10. Referencias

- Delesque, Samuel. "Rethinking Wealth: Economics of a Regenerative Commons", 27 dic 2025. (`docs/oasa-tdf_economia_comunes_backup.md`)
- OASA WhitePaper V1.2: https://oasa.earth/papers/OASA-Whitepaper-V1.2.pdf (citado en la fuente)
- OASA Constitution 2025: https://oasa.earth/papers/oasa-constitution-2025 (spec `alrac-tq-oasa`)
- Traditional Dream Factory: `docs/ECOSYSTEM_REVENUE_SHARING.md` (referenciada en `alrac-tq-tdf`)
- DisCO Manifesto: https://manifesto.disco.coop
- Closer Platform: https://closer.earth
- Ostrom, E. *Governing the Commons* (1990) — base teórica del común
- Specs existentes del repo: `alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-caas-revenue-streams.md`, `alrac-caas-membership.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- Metodología: skill `hscsg-repo-assimilation` (flujo de 4 fases, backup + integración, Leyes I/II/III, principio anfibio)
