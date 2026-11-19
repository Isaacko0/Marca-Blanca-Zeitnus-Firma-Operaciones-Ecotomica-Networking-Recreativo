# Integración Stack Gobernanza y Operación TDF / OASA / Closer

**Fuentes asimiladas (6 repos):**
1. `sepu85/tdf-snapshot-voting` — `docs/tdf-snapshot-voting_backup.md` (MIT)
2. `closerdao/closer-ui` — `docs/closer-ui_backup.md` (CC BY-NC 4.0 — NO comercial)
3. `closerdao/proof-of-presence` — `docs/proof-of-presence_backup.md` (MIT repo; contratos TDFToken/AdminFacet AGPL-1.0)
4. `closerdao/tdf-game-guide` — `docs/tdf-game-guide_backup.md` (sin licencia declarada)
5. `closerdao/oasa-agent` — `docs/oasa-agent_backup.md` (MIT)
6. `sepu85/asha-mel-crm` — `docs/asha-mel-crm_backup.md` (MIT)

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). Las specs existentes `alrac-tq-oasa` (Constitución), `alrac-tq-tdf` (3 pistas verificación), `alrac-tq-land` (registro tierra kWh) y la nueva `alrac-tq-economia-comunes` (capa económica) cubren el suelo, la economía y la constitución. Esta integración añade la **capa de gobernanza ejecutable, verificación de voto, proof of presence, tokens, agente regenerativo y CRM MEL** que faltan.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Verificar que su voto cuenta**: recompute independientemente su peso de voto ($TDF + staked + $Presence + $Sweat, todos ×1) directamente contra Celo, sin confiar en el backend de Closer.
- **Votar con peso real de participación**: presencia física en la tierra, trabajo (sweat) y tokens cuentan igualmente en la gobernanza; no solo quien tiene más tokens.
- **Probar presencia sin que sea transferible**: $Presence y $Sweat son no-transferibles, decay con el tiempo, y solo el sistema de booking/DAO puede mintirlos.
- **Gobernar dentro de límites ecológicos**: el DAO de TDF vota, pero OASA (guardianes de la naturaleza) puede vetar decisiones inconstitucionales o que rompan la regla "no decisión financiera".
- **Tener un agente regenerativo que responda consultas ecológicas y de gobernanza**: memoria por dominio (agua, biodiversidad, gobernanza, financiero), patrón temporal (estaciones, ciclos diarios), LLM como enriquecedor no sustituto.
- **Llevar un CRM/MEL local y soberano**: base de datos SQLite offline-first, soberanía de datos por comunidad/nación, vista dual (comunidad vs financiador), mapa de territorios.
- **No mezclar licencias incompatibles**: closer-ui es CC BY-NC 4.0 (no comercial) y varios contratos de proof-of-presence son AGPL-1.0 (copyleft fuerte) — su lógica se reimplementa en TypeScript puro, nunca se copia código.

Zeitnus/ALRAC le da la **máquina soberana offline-first**: TQ como unidad contable (1 TQ = 1 kWh), ZNU como moneda de transición anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros codificados en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto fuente | Repo origen | Módulo Zeitnus/ALRAC destino | Observación |
|---|---|---|---|
| Fórmula peso voto: TDF + staked TDF + Presence + Sweat (×1) | tdf-snapshot-voting | `tq-tdf.ts` (pista 2), `governanceTriad.ts` | Implementar `calculateVotingWeight(did)` |
| Config Snapshot (4 estrategias ×1, Celo 42220) | tdf-snapshot-voting | `tq-closer-attestation.ts` + nueva spec | `verify.mjs` → lógica TS pura, sin dependencias npm |
| Script verify.mjs (eth_call JSON-RPC a Celo) | tdf-snapshot-voting | `src/core/lib/celo-verifier.ts` | Pura llamada RPC, cero dependencias |
| Auditoría social rotativa (testigos humanos) | tdf-snapshot-voting | `governanceTriad.ts` (base-3 verificación) | CDS-weighted panel, rotación |
| Closer como plataforma de gobernanza (village, billing, staking gas-aware) | closer-ui | `tq-tdf.ts`, `caas.ts`, `registrySystem.ts` | Extirpar infra Next.js/Turbo; lógica pura en TS |
| Contratos TDF (ERC20 pausable, control transferencia DAO) | proof-of-presence | `tq.ts`, `propertyRegimeSystem.ts` | Reimplementar en TS, NO copiar Solidity AGPL-1.0 |
| PresenceToken / SweatToken (no transferible, decay exponencial) | proof-of-presence | `poh.ts` (proof of humanity/presence) + `contributionAccounting.ts` | Decay `balance = initial × (1-rate)^días` |
| Staking con liberación tras 1 año, depósitos ordenados | proof-of-presence | `tq.ts` (TQ Ledger), `registrySystem.ts` | `stakedBalanceOf`, `unlockedStake`, `lockedStake` |
| Booking-staking vinculación (reserva → stake del precio) | proof-of-presence | `tq-tdf.ts` (uso/estancia) | Stake vinculado a nights de estancia |
| Roles: Citizen, Resident, Steward, Team Member, Guardian | tdf-game-guide | `tq-tdf.ts`, `propertyRegimeSystem.ts` | Custodios temporales, recall comunitario |
| Proceso DAO (propuesta → discusión → voto → veto OASA → ejecución) | tdf-game-guide | `tq-tdf.ts`, `tq-oasa.ts` (Guardians veto) | Quorum 500 TDF, >50% aprobación |
| $TDF = 1 noche/año, no equity, no seguridad | tdf-game-guide + tdf-snapshot-voting | `tq-oasa.ts` (use-rights) | Reinforces spec existente |
| Agente regenerativo: memoria por dominio + LLM | oasa-agent | `src/core/lib/regenerative-agent.ts` | MemorySystem, TranslationLayer, DomainOrchestrator |
| Endpoints REST agente (/query, /sensor-data, /knowledge, /insights) | oasa-agent | Nueva pantalla o módulo de servicio | API REST para agente autónomo |
| CRM MEL: SQLite local, soberanía por nación, vista dual | asha-mel-crm | `registrySystem.ts`, `contributionAccounting.ts`, `currentSeeSystem.ts` | Offline-first, data sovereignty flags |
| Pilares Plan Bioregional 2030 (6 pilares) | asha-mel-crm | `caas.ts` (streams de indicadores) | Gobernanza territorial, alimentación, bioeconomía, salud, educación, energía |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Repo origen | Por qué | Qué se hace en su lugar |
|------------------|-------------|---------|------------------------|
| Next.js 16 + Turborepo + pnpm | closer-ui | Infra de frontend ajena; licencia CC BY-NC 4.0 no comercial | Lógica pura en TS; UI propia de HSCSG (React + Zustand + Tailwind) |
| Contratos Solidity / EVM / Celo | proof-of-presence | Blockchain como infra de ejecución; algunos contratos AGPL-1.0 (copyleft fuerte) | Lógica de tokens/staking/presence reimplementada en TS puro; Celo solo como fuente de lectura externa (oráculo/verificación) |
| Hardhat + OpenZeppelin upgradeable | proof-of-presence | Herramientas de desarrollo EVM | No se asimilan; se consumen direcciones de contrato como datos de entrada |
| MongoDB + mongoose | oasa-agent | Base de datos externa no soberana | SQLite local (como asha-mel-crm) o localStorage/indexedDB offline-first |
| Koa + axios server | oasa-agent | Servidor Node.js externo | Funciones TypeScript puras invocables desde el frontend/Zustand store |
| better-sqlite3 nativo | asha-mel-crm | Addon nativo (no portable a browser WASM fácilmente) | SQLite via `sql.js` (WASM) ya en dependencias del repo, o IndexedDB |
| Leaflet + react-leaflet | asha-mel-crm | Librería de mapas (BSD-2, OK) | Puede usarse; no es infra crítica |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del stack TDF/OASA/Closer |
|--------|----------------------------------|
| `src/core/lib/tq-tdf.ts` | Extender: peso de voto, staked balance, verify on-chain |
| `src/core/lib/tq-oasa.ts` | Extender: veto de Guardians, proceso DAO, límites constitucionales |
| `src/core/lib/poh.ts` | Extender: Presence/Sweat decay, no-transferible |
| `src/core/lib/celo-verifier.ts` | (NUEVO) Verificación on-chain vía eth_call, estilo verify.mjs |
| `src/core/lib/regenerative-agent.ts` | (NUEVO) Agente con memoria por dominio, LLM, conflictos |
| `src/core/lib/celo-verifier.ts` + `tq-closer-attestation.ts` | Closer Attestation RFC para votos verificables |
| `src/core/state/store.ts` | Agregar `governance`, `agent`, `crm` namespaces |
| `src/core/state/caas.ts` | Streams de ingreso e indicadores MEL (6 pilares) |
| `src/core/lib/boundaries.ts` | DENY rules: no AGPL código copiado, no CC-BY-NC comercial, no EVM como motor |
| `openspec/specs/alrac-tq-governance-verification.md` | (NUEVA) Spec: verificación de voto, peso, Snapshot |
| `openspec/specs/alrac-tq-presence-sweat.md` | (NUEVA) Spec: tokens no-transferibles con decay |
| `openspec/specs/alrac-tq-regenerative-agent.md` | (NUEVA) Spec: agente regenerativo, dominio, LLM |
| `openspec/specs/alrac-tq-mel-crm.md` | (NUEVA) Spec: CRM MEL, soberanía de datos |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- TDF: OASA veto sobre decisiones inconstitucionales; tierra en común perpetuo; los ingresos por disolución van a causas regenerativas.
- HSCSG: MJ Gate bloquea acciones que degraden la base; `boundaries.ts` DENY rules contra extracción y especulación.
- **Resonancia:** el veto ecológico de OASA se mapea a los límites duros de `boundaries.ts`.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- TDF: peso de voto = TDF + staked + Presence + Sweat; la presencia y el trabajo cuentan tanto como el capital token.
- HSCSG: ZNU por Beneficio Neto (Copiosis), acceso por contribución real (CaaS), AUT × CDS.
- **Resonancia:** la participación real (presencia física, trabajo) genera poder de decisión, no solo la tenencia de tokens.

### Ley III — Lucidez, nunca engañar
- TDF: verify.mjs recompute independiente del peso de voto; Snapshot firma cada voto con wallet; auditoría social rotativa.
- HSCSG: RAO (procedencia, emisor, permisos, estado, revocación), Modo Lucidez, `currentSeeSystem.ts`.
- **Resonancia:** todo flujo de gobernanza es recomputable e independiente; nada se toma por fe.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- TDF: acceso a estancia por token de uso; presencia y sweat ganados por contribución.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso y el poder se ganan con contribución real.

---

## 4. Tabla de mapeo isomórfico (stack TDF/OASA/Closer → Zeitnus/ALRAC)

| Concepto fuente | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|-----------------|----------------------|------|----------|--------|
| Peso de voto (TDF+staked+Presence+Sweat ×1) | `tq-tdf.ts` `calculateVotingWeight()` | Capa 5 | Ley II/III | **Pendiente** |
| Verificación on-chain (verify.mjs → Celo eth_call) | `celo-verifier.ts` + `tq-closer-attestation.ts` | Capa 4 | Ley III | **Pendiente** |
| Config Snapshot (4 estrategias ×1) | Nueva spec `alrac-tq-governance-verification` | Capa 5 | CaaS | **Pendiente** |
| PresenceToken (no transferible, decay exponencial) | `poh.ts` + `tq-tdf.ts` | Capa 1/4 | Ley II | **Pendiente** |
| SweatToken (no transferible, decay 10% anual) | `contributionAccounting.ts` | Capa 3 | Ley II | **Pendiente** |
| Staking 1 año, depósitos ordenados, stakedBalanceOf | `tq.ts` TQ Ledger + `registrySystem.ts` | Capa 1 | Ley II | **Pendiente** |
| TDF control transferencia por DAO | `propertyRegimeSystem.ts` + `boundaries.ts` | Capa 1 | Ley I/III | **Pendiente** |
| Roles Citizen/Resident/Steward/Team Member/Guardian | `propertyRegimeSystem.ts` (custodios, roles) | Capa 1/5 | Ley I | **Pendiente** |
| Proceso DAO + veto OASA | `tq-tdf.ts` + `tq-oasa.ts` Guardians | Capa 5 | Ley I | **Pendiente** |
| Agente regenerativo (memoria, dominio, LLM) | `regenerative-agent.ts` | Capa 4 | Ley II/III | **Pendiente** |
| CRM MEL (SQLite, soberanía nación, vista dual) | `registrySystem.ts` + `currentSeeSystem.ts` | Capa 4 | Ley I/II | **Pendiente** |
| No copiar código AGPL-1.0 / CC-BY-NC 4.0 | `boundaries.ts` DENY rules | Capa 0 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---|---|
| Fórmula de peso de voto ×1 | Contratos Solidity/EVM (Solidity, Hardhat, OpenZeppelin upgradeable) |
| Script verify.mjs re computar peso contra Celo | Web3.js/ethers.js como dependencia de runtime |
| Tokens no-transferibles con decay (Presence, Sweat) | MongoDB + mongoose (base de datos externa no soberana) |
| Staking con liberación tras 1 año | Koa server + axios (servidor Node externo) |
| Control de transferencia TDF por DAO | better-sqlite3 addon nativo (usar sql.js WASM o IndexedDB) |
| Roles de gobernanza y veto OASA | Next.js/Turbo/pnpm (frontend de closer-ui) |
| Agente con memoria por dominio + LLM | Código bajo licencia AGPL-1.0 o CC-BY-NC 4.0 (reimplementar patrón, no copiar) |
| CRM MEL con soberanía de datos por nación | Leaflet como dependencia crítica (BSD-2, OK usar) |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión fuente | Vaso comunicante |
|----------------|-----------------|------------------|
| `tq-tdf.ts` | TDF Game Guide (DAO, fórmula voto) | `calculateVotingWeight(did)` → peso en gobernanza |
| `tq-oasa.ts` | OASA Constitución (Guardians, veto) | Veto ecológico sobre propuestas DAO |
| `celo-verifier.ts` | tdf-snapshot-voting (verify.mjs) | eth_call a contratos Celo (TDF, Presence, Sweat, Staking) |
| `tq-closer-attestation.ts` | tdf-snapshot-voting (Track 1 Fix Closer) | Recibos de voto verificables a IPFS |
| `poh.ts` | proof-of-presence (PresenceToken) | Proof of presence no-transferible con decay |
| `contributionAccounting.ts` | proof-of-presence (SweatToken) + game-guide | Registro de contribución, sweat, 20% reserva |
| `registrySystem.ts` | asha-mel-crm (CRM MEL) | 4 registros separados, soberanía de datos |
| `currentSeeSystem.ts` | asha-mel-crm + todos | Corrientes unificadas (TQ, ZNU, USDC, CARE, REP_*) |
| `regenerative-agent.ts` | oasa-agent | Memoria por dominio, LLM, conflictos, insights |
| `caas.ts` | asha-mel-crm (6 pilares Bioregional) | Streams de indicadores MEL |
| `boundaries.ts` | Todas (licencias incompatibles) | DENY rules contra AGPL/CC-BY-NC comercial |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D20

| ID | Decisión | Evidencia primaria | Módulo afectado |
|----|----------|-------------------|-----------------|
| D1-D8 | (previas, economía comunes: bonding curve, capital/operaciones, exit-to-commons, límites duros, Proof of Presence, sweat 20%, anfibio TQ/ZNU, red 100.000 ha) | `docs/oasa-tdf_economia_comunes_backup.md` | Múltiples |
| D9 | Peso de voto = TDF.balanceOf + Staking.stakedBalanceOf + Presence.balanceOf + Sweat.balanceOf (todos ×1, Celo chainId 42220) | `tdf-snapshot-voting/FORMULA.md`, `tdf-game-guide/05_token-economy/voting_weight.md` | `tq-tdf.ts`, `celo-verifier.ts` |
| D10 | Config Snapshot: 4 estrategias ×1 (TDF erc20, staked TDF contract-call, Presence erc20, Sweat erc20); validación por Membersheep NFT pendiente | `tdf-snapshot-voting/snapshot-space-config.md` | Nueva spec `alrac-tq-governance-verification` |
| D11 | Presence decay exponencial ~0.03%/día (~90% retenido al año); no transferible; solo BOOKING_PLATFORM_ROLE/BOOKING_MANAGER_ROLE mintea | `proof-of-presence/src/ERC20/PresenceToken.sol`, `tdf-game-guide/05_token-economy/$presence.md` | `poh.ts` |
| D12 | Sweat decay 10% anual; no transferible; ganado por major projects/bounties; 20% de TDF reservado para sweat | `proof-of-presence/src/ERC20/SweatToken.sol`, `tdf-game-guide/05_token-economy/$sweat.md` | `contributionAccounting.ts` |
| D13 | Staking: depósito con liberación tras 1 año; depósitos ordenados por timestamp (OrderedStakeLib); `stakedBalanceOf` = balance total | `proof-of-presence/src/diamond/libraries/StakeLibV2.sol`, `OrderedStakeLib.sol` | `tq.ts`, `registrySystem.ts` |
| D14 | TDF: transferencia controlada por DAO (`isTokenTransferPermitted`); solo DAO/owner mintea/burn; pausable | `proof-of-presence/src/ERC20/TDFToken.sol`, `AdminFacet.sol` | `propertyRegimeSystem.ts`, `boundaries.ts` |
| D15 | Roles: Citizen (voto), Resident, Steward, Team Member (elegido, ≥2 directores), Guardian (veto ecológico), Visitor/Volunteer (sin voto) | `tdf-game-guide/02_roles-and-stakeholders/`, `03_governance/dao.md` | `propertyRegimeSystem.ts`, `tq-tdf.ts` |
| D16 | Proceso DAO: propuesta → discusión 1-2 sem → voto ponderado (quorum 500 TDF, >50%) → veto OASA → ejecución por Team | `tdf-game-guide/03_governance/dao.md` | `tq-tdf.ts`, `tq-oasa.ts` |
| D17 | Agente regenerativo: MemorySystem (dominios, patrones temporales, episódica), TranslationLayer (detección dominio), DomainOrchestrator (integración, conflictos), LLM como enriquecedor | `oasa-agent/index.js`, `server.js`, `llm-service.js` | `regenerative-agent.ts` |
| D18 | CRM MEL: SQLite local (offline-first), soberanía de datos por nación (data_access_permissions), vista dual comunidad/financiador, 6 pilares Bioregional 2030 | `asha-mel-crm/src/lib/db.ts`, `README.md` | `registrySystem.ts`, `currentSeeSystem.ts`, `caas.ts` |
| D19 | Licencia closer-ui CC BY-NC 4.0 (no comercial): NO copiar código ni assets; solo lógica pura de gobernanza/billing reimplementada en TS | `closer-ui/LICENCE.md` | `boundaries.ts` (DENY comercial) |
| D20 | Contratos AGPL-1.0 (TDFToken, AdminFacet, BookingFacet): NO copiar código Solidity; reimplementar patrón en TS limpio; Celo como fuente de lectura externa solo | `proof-of-presence/LICENSE`, cabeceras SPDX de contratos | `boundaries.ts` (DENY AGPL), `celo-verifier.ts` (solo lectura) |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `tq-tdf.ts` (voting weight) | `calculateVotingWeight()` = TDF + staked + Presence + Sweat; todos ×1; quorum 500 | `tests/tq-tdf-voting.test.ts` |
| `celo-verifier.ts` | Recompute peso de una dirección contra Celo mainnet (eth_call); cero dependencias npm; valida contra `verify.mjs` | `tests/celo-verifier.test.ts` |
| `poh.ts` (Presence decay) | `decayedAmount = initial × (1-rate)^días`; 0.03%/día; no-transferible | `tests/poh-presence.test.ts` |
| `contributionAccounting.ts` (Sweat) | Decay 10% anual; 20% sweat reserve; contribución inmutable post-redistribución | `tests/contribution-accounting.test.ts` |
| `tq.ts` (staking) | Depósito/retiro/restake; liberación tras 1 año; `stakedBalanceOf`, `unlockedStake`, `lockedStake` | `tests/tq-staking.test.ts` |
| `propertyRegimeSystem.ts` (roles) | Citizen/Resident/Steward/Team Member/Guardian; custodio temporal; recall comunitario | `tests/property-regime.test.ts` |
| `tq-oasa.ts` (veto) | Guardians veto sobre propuesta inconstitucional; quorum y umbrales OASA | `tests/tq-oasa.test.ts` (existente, extender) |
| `regenerative-agent.ts` | MemorySystem store/retrieve por dominio; DomainOrchestrator integra dominios; resuelve conflictos | `tests/regenerative-agent.test.ts` |
| `registrySystem.ts` (CRM MEL) | 4 registros separados; soberanía por nación; vista dual | `tests/registry-system-mel.test.ts` |
| `boundaries.ts` | DENY: código AGPL copiado, uso comercial CC-BY-NC, EVM como motor, priceParity en TQ | `tests/boundaries.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Specs OpenSpec (nuevas)
1. `openspec/specs/alrac-tq-governance-verification.md` — peso de voto, verify on-chain, config Snapshot, auditoría social
2. `openspec/specs/alrac-tq-presence-sweat.md` — tokens no-transferibles con decay, Presence/Sweat
3. `openspec/specs/alrac-tq-regenerative-agent.md` — agente regenerativo, memoria por dominio, LLM
4. `openspec/specs/alrac-tq-mel-crm.md` — CRM MEL, soberanía de datos, vista dual

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/governance.ts`: `VotingWeight`, `Proposal`, `Vote`, `GuardianVeto`, `DAOProcess`
- `src/core/state/agent.ts`: `DomainMemory`, `TemporalPattern`, `Episode`, `AgentInsight`
- `src/core/state/mel.ts`: `Nation`, `Community`, `Indicator`, `Measurement`, `DataAccessPermission`
- Extender `tq-types-extended.ts`: `PresenceBalance`, `SweatBalance`, `StakingDeposit`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `celo-verifier.ts`: `verifyVotingWeight(address)`, `eth_call` JSON-RPC (estilo verify.mjs, cero deps)
- `poh.ts`: `calculatePresenceDecay()`, `calculateSweatDecay()`, `isTransferable()` → false
- `staking.ts` (o extender `tq.ts`): `depositStake()`, `withdrawStake()`, `stakedBalanceOf()`, `unlockedStake()`, `lockedStake()`
- `regenerative-agent.ts`: `MemorySystem`, `TranslationLayer`, `DomainOrchestrator` (puros, sin MongoDB/Koa)
- `mel-crm.ts`: operaciones sobre 4 registros, permisos de soberanía, consultas MEL
- No importar web3/ethers; no copiar Solidity; no usar better-sqlite3 nativo

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `make*State()` de cada módulo.
- Añadir namespaces a `AppState` y estado inicial de `create()`.
- Añadir acciones en interfaz e implementación con `set((st) => ({ ns: {...st.ns, ...} }))`.
- Incluir cada `make*State()` en `resetAll()`.
- Incluir cada namespace en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Escribir y ejecutar tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` (índice de módulos, specs nuevas) y `CHANGELOG.md`.
- Commit: `feat: stack gobernanza TDF/OASA/Closer (voto, presence, sweat, staking, agente, CRM) + docs`.
- Push a `origin` (rama `asimilacion/ecc-hermes`).

---

## 10. Referencias

- `sepu85/tdf-snapshot-voting`: https://github.com/sepu85/tdf-snapshot-voting (MIT)
- `closerdao/closer-ui`: https://github.com/closerdao/closer-ui (CC BY-NC 4.0 — NO comercial)
- `closerdao/proof-of-presence`: https://github.com/closerdao/proof-of-presence (MIT repo; contratos AGPL-1.0)
- `closerdao/tdf-game-guide`: https://github.com/closerdao/tdf-game-guide
- `closerdao/oasa-agent`: https://github.com/closerdao/oasa-agent (MIT)
- `sepu85/asha-mel-crm`: https://github.com/sepu85/asha-mel-crm (MIT)
- Specs existentes: `alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-tq-economia-comunes.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- `docs/tdf-snapshot-voting_backup.md`, `docs/closer-ui_backup.md`, `docs/proof-of-presence_backup.md`, `docs/tdf-game-guide_backup.md`, `docs/oasa-agent_backup.md`, `docs/asha-mel-crm_backup.md`
- Ostrom, E. *Governing the Commons* (1990)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
