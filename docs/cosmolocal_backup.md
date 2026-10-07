# Backup: Cosmo-Local Credit Documentation — Fuente Original

**Fecha:** 2026-10-06  
**Fuente:** https://docs.cosmolocal.credit/ (docs completos via llms-full.txt + páginas específicas)  
**Entidad:** Grassroots Economics Foundation (GEF) — Kilifi, Kenya  
**Contacto:** info@grassecon.org  

---

## Contenido Extraído Completo (246,365 chars)

### 1. Getting Started (Introduction)
- **Cosmo-Local Credit (CLC)**: Progressive web app para crear, descubrir, mantener, transferir e intercambiar activos digitales (vouchers redimibles) a través de Commitment Pools gobernados independientemente
- **App**: cosmolocal.credit — operada por GEF
- **GEF role**: Opera App e infraestructura, NO es emisor, Pool Steward, custodio, prestamista, garante, etc.
- **Responsabilidades**: Emisor = responsable de cumplimiento; Pool Steward = responsable de reglas del pool

### 2. Concepts and Vocabulary (Capas de Producto/Protocolo)

| Término | Significado |
|---------|-------------|
| **Cosmo-Local Credit (CLC)** | Familia de producto: CLC App, docs, trabajo commitment-pooling |
| **CLC App** | PWA en cosmolocal.credit, operada por GEF |
| **Commitment Pooling Protocol (CPP)** | Modelo reutilizable de curación, valoración, limitación, intercambio, gobernanza accountable |
| **Protocol v1.1.0** | Release verificado de smart-contracts públicos |
| **Commitment Pool** | Arreglo gobernado que cura activos, publica reglas, habilita intercambio |
| **`SwapPool`** | Contrato actual que mantiene inventario tokens y ejecuta swaps directos |
| **Proposed CLC governance token** | Diseño futuro en White Paper, no activo actual |
| **Proposed CLC Network Pool** | Diseño futuro de clearing/coordinación a nivel red |

#### Tokens, Vouchers, Offerings (4 Capas Separadas)
1. **Token contract & balances** — mechanics on-chain
2. **Voucher designation & published terms** — compromiso redimible bajo términos
3. **Offering records** — catálogo bienes/servicios asociados
4. **Issuer's real-world fulfillment** — desempeño real del emisor

#### Roles Accountable
| Role | Responsibility |
|------|----------------|
| **Issuer** | Publica y cumple compromiso voucher |
| **Holder** | Controla balance voucher |
| **Service Provider** | Persona pública; se vuelve issuer al publicar voucher |
| **Pool Steward** | Persona/coop/agencia/multisig accountable que publica/adminstra reglas Pool |
| **Pool Owner** | Address con poderes `SwapPool` owner (config, fees, withdrawal) |
| **Proxy Administrator** | Autoridad para upgrade proxied contract |
| **Dependency Controller** | Controla registry, limiter, quoter, oracle, fee policy, protocol-fee controller |
| **Catalog Moderator** | Operador App que corrige/oculta/restaura records catálogo |
| **Fee Recipient** | Address que recibe Pool/protocol fee |

### 3. Protocol v1.1.0 Overview

#### Component Map
- **GiftableToken** — ERC20 supply, minting, burning, optional-expiry
- **SwapPool** — Token vault + swap-settlement engine (curation, valuation, fee, limit, protocol-fee)
- **DecimalQuoter, RelativeQuoter, OracleQuoter** — Módulos valoración intercambiables
- **OracleRelay** — Relay feed externo para OracleQuoter
- **FeePolicy and Limiter** — Pair-fee rules + per-token Pool-balance limits
- **ProtocolFeeController** — Protocol-fee rate mutable, recipient, active state
- **TokenUniqueSymbolIndex, AccountsIndex, ContractRegistry** — Discovery components
- **CAT** — Account's ordered settlement-token preferences
- **SwapRouter** — Quote-only exact-input/output over multi-Pool path (no custody/execute)
- **Splitter, EthFaucet, PeriodSimple, RescueVault** — Supporting utilities

#### Deployment Pattern
- ERC-1967 proxy instances via Solady's `ERC1967Factory`
- Multiple instances share implementation, separate owners/config/storage
- Proxy admin separate from contract ownership
- EIP-165 support contract-specific

### 4. Governance Mechanics

#### Responsibility by Role
- **Voucher Issuers** — Gobiernan sus Offerings, identity, capacity, supply, valuation, expiry, presentment, fulfillment, geo, timing, fee, restriction, remedy
- **Pool Stewards** — Admission, asset curation, valuation, fees, limits, inventory, reserves, contributions, conflicts, provenance, config, pauses, upgrades, guarantees
- **Registry/service stewards** — Qué Pools/assets aparecen en registry, reglas/fees routing, monitoring, liquidity support
- **Users** — Deciden si Issuer/Voucher/Pool/quote/transacción aceptables y lawful

#### Accountable Governance Structures
Nonprofit, cooperative, community group, federation, company, multisig, public agency, institutional board, on-chain voting, hybrid

#### Technical Governance Options
- OpenZeppelin Governor + Tally
- Multisig approvals, cooperative resolutions, board decisions, public-agency mandates, hybrid

### 5. White Paper v0.8 (30 Sep 2026) — Authors: William O. Ruddick & Mohamed Sohail

#### Abstract
**CPP** = cómo Commitment Pools gobernados independientemente pueden curar compromisos redimibles, publicar exchange-rate methods y limits, mantener inventario, habilitar intercambio accountable

**Cosmo-local** = compartir estándares abiertos, software, conocimiento globalmente MANTENIENDO emisión, cumplimiento, gobernanza, accountability LOCAL

#### CPP Four Functions
1. **Curation** — decidir qué vouchers/assets admitir
2. **Valuation** — publicar método para Pool exchange rates/quotes
3. **Limitation** — aplicar Pool token-balance caps u otros risk controls
4. **Exchange** — mantener inventario y ejecutar Pool swaps bajo fees/bounds disclosed

#### Current Direct Pool Flow
1. Holder reviewa voucher, issuer, terms, Offerings
2. Pool admite assets soportados, publica config y autoridades responsables
3. Holder obtiene quote y autoriza direct Pool swap
4. `SwapPool` ejecuta on-chain swap settlement + Pool/protocol fees
5. Si holder elige "Redeem" → App prepara transfer a token owner (redemption presentment)
6. Issuer separadamente cumple promised fulfillment + discharge record

#### Proposed Design (No Desplegado)
- Multi-hop execution, HTLC/escrow routing, batch netting, shared insurance
- Proposed CLC governance token, CLC Network Pool
- Fee-credit mechanisms, network liquidity programs
- Proposed fee model: network rake from Pool fees + routing/service fees

#### Measurement Framework (Appendices A-C)
- **Event definitions**: O (outstanding), X (swaps), P (presentments), F (fulfilled), G (discharged)
- **Cohort-based**: FulfillmentRate, DischargeCompleteness, FulfillmentLatency, HoldingDuration
- **Velocity**: V_commit (commitment-discharge), V_swap (Pool swap activity)
- **Network revenue**: Proposed network rake + routing/service fees
- **KPIs**: Valid presentments, Fulfillment rate, Discharge completeness, Fulfillment latency, Holding duration, Outstanding eligible commitments, Pool swap volume, Pool inventory, Reserve adequacy, Limit utilization, Quote pass rate, Route execution rate, Guarantor recovery, Proposed network revenue, Governance timeliness

#### Launch Parameters (Ilustrativos)
- Quorum tiers: Q1 4%/50%, Q2 10%/60%, Q3 20%/66.7%
- Timelocks: T1 48h (Q1), T2 7d (Q2)

### 6. Historical Lineage — Sarafu Network
- Servicio previo a CLC App, evidencia sobre community currencies + commitment pooling
- Transición no transfirió todas las cuentas/wallets/tokens/pools/balances/obligaciones históricos
- Métricas históricas usan dataset Sarafu fechado, NO son current CLC usage

### 7. Terms of Service (Kenya Law)
- GEF opera App, no es issuer/Pool Steward/custodian/guarantor
- Usuario debe ser 18+, capacity contractual
- Wallet credentials = responsabilidad usuario
- Public blockchain = visible, permanent, irreversible
- Market listing ≠ endorsement/guarantee
- Disputas = leyes Kenya, courts Kenya

---

## Metadatos de Extracción
- **Método**: web_extract (Hermes) — 5 URLs en paralelo
- **Tokens totales**: ~250K chars (llms-full.txt + 4 páginas específicas)
- **Estructura**: Docusaurus/Vocs docs site
- **Versión White Paper**: v0.8 (30 Sep 2026)
- **Authors**: William O. Ruddick & Mohamed Sohail
- **Contact**: info@grassecon.org