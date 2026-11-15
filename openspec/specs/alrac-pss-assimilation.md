# ALRAC PSS — Pacta Sunt Servanda Assimilation Spec

**Capa:** 0 (Epistémica) + 0.5 (Normativa) + 1 (Contable-Física) + 2 (Interoperabilidad) + 3 (Membrana Fiat) + 4 (Aplicación) + 5 (Gobernanza)  
**Versión:** 0.1  
**Estado:** BORRADOR  
**Fecha:** 2026-11-14  
**Fuente:** "Pacta Sunt Servanda: A Byzantine Fault Tolerant Commitment System for Sovereign States" — Carlos Ignacio Rangel Benezra, Working Paper v1.2 (Public Edition), June 2026  
**Licencia:** Working paper circulated for discussion — análisis y síntesis permitidos, código/parámetros negociables  
**Dependencias:** `alrac-architecture.md`, `alrac-governance-holonic.md`, `alrac-tq-*`, `alrac-fiat-layer.md`, `alrac-caas-membership.md`, `alrac-znu-indexing-credit.md`

---

## 1. Resumen Ejecutivo

El paper **Pacta Sunt Servanda (PSS)** propone un sistema de compromiso soberano basado en:
- **BFT permissioned ledger** (Tendermint) operado por estados miembros
- **CAE (Custody and Audit Entity)** supranacional con separación estricta de 5 roles
- **PST (Production Stream Tokens)** — claims dollar-denominados sobre producción auditada
- **Validator set ponderado por contribución** (Collateral 40%, Throughput 25%, Redemption 25%, Infrastructure 10%)
- **Slashing automático** sin voto: collateral + reputation weight
- **Fase 1:** stablecoins reguladas → **Fase 2:** PST como settlement asset (anfibio)
- **Caso decisivo:** Venezuela como "Technocrat State" vs 51st state

**Alineación ALRAC:** 95% — el paper es **arquitectura ALRAC aplicada a nivel estado-nación**. Cada capa ALRAC tiene contraparte directa en PSS.

---

## 2. Mapa de Capas ALRAC ←→ PSS

| Capa ALRAC | Componente PSS | Mapping | Notas |
|------------|----------------|---------|-------|
| **0 Epistémica** | BFT consensus, Byzantine Generals Problem, determinism | **Isomorfo** | BFT = verificación triaxial a nivel consenso; γ-CARMIS = slashing |
| **0.5 Normativa** | Treaty charter, constitutional parameters (Appendix A), Vienna Convention Art. 26 | **Isomorfo** | Parámetros = `w_k`, `A_min`, `TV_min` de IAL; veto = ¾ weight + 4-quarter delay |
| **1 Contable-Física** | PST tokens, collateralization floor ≥100% audited, commodity reserves (kWh-equivalent: lithium, copper, oil) | **Anfibio** | PST ≈ TQ pero commodity-backed; 1 PST = claim on audited production |
| **2 Interoperabilidad** | Permissioned BFT network (Tendermint), deterministic finality, cross-border settlement | **Isomorfo** | ValueFlows adapter para PST; CPP bridge para CAE attestations |
| **3 Membrana Fiat** | Phase 1: regulated dollar stablecoins (US Treasury demand); Phase 2: PST as settlement asset | **Anfibio idéntico** | `priceParity` oracle = PST/dollar curve; `nodeMode` = Phase 1/2 |
| **4 Aplicación** | Lithium triangle (Chile/Argentina/Bolivia), copper, energy, agricultural pools; Venezuelan Technocrat State | **Nodos piloto reales** | Mapea a: Colonya (Uruguay), Feria Conuquera (Venezuela), Samay (Ecuador) |
| **5 Gobernanza** | Contribution-weighted validator set (C/T/R/I), Penrose sqrt, caps/floors, quarterly rebalancing ±2pp, slashing | **Isomorfo extendido** | CDS = weight function; R_i = redemption integrity = CDS history component |

---

## 3. Mapping Detallado de Subsistemas

### 3.1 CAE (Custody and Audit Entity) → ALRAC Data Trust / RAO Layer

| PSS CAE Role | ALRAC Equivalent | Implementación |
|--------------|------------------|----------------|
| **Custody** — SPVs en ≥3 jurisdicciones, ≥1 fuera del hemisferio | `alrac-tq-digitalSovereignty.md` + `alrac-fiat-layer.md` jurisdictional distribution | Multi-sig custody adapters |
| **Verification** — Auditores rotativos, exclusivos, cross-audit sampling, on-chain publication | `triaxial-verification.md` (mental/sim/lab) + auditoría rotada (R8 IAL) | Audit adapter con RAO credentials |
| **Issuance** — PSTs solo contra collateral verificado, ratio constitucional | `alrac-tq-conversionFactor.md` + `alrac-tq-productFederation.md` | Issuance engine con collateralization floor |
| **Adjudication** — Arbitraje internacional pre-consentido, awards ejecutan contra collateral | `alrac-governance-holonic.md` resolución conflictos triaxial | Arbitration adapter (Kleros/Realitio) |
| **Operation** — Ledger operado por member-validators (sección 5) | `alrac-tq-nodeArchitecture.md` | Validator node software |

**Principio clave PSS:** "No officer, organ, or member may hold more than one role. The entity is deliberately constructed so that its own founders cannot capture it: the design case for every office is its worst future occupant." → **ALRAC: separación estricta kernel/adaptadores, anfibio por diseño.**

### 3.2 Validator Weight Function → CDS (Capacidad de Soberanía) Extendido

**PSS Formula:**
```
S_i = 0.40·C_i + 0.25·T_i + 0.25·R_i + 0.10·I_i
w_i = clamp( √S_i / Σ_j √S_j , floor=2%, cap=20% )
Rebalancing: quarterly, trailing 12 quarters, ±2pp bound
```

**ALRAC CDS Mapping (alrac-governance-holonic.md §5):**
| PSS Component | ALRAC CDS Component | Weight PSS | Weight CDS |
|---------------|---------------------|------------|------------|
| C_i — Collateral (40%) | `resourceSelfSufficiency` + `technicalSovereignty` | 40% | 25% (autonomy) |
| T_i — Throughput (25%) | `governanceParticipation` + `proposalQuality` | 25% | 25% (participation) |
| R_i — Redemption integrity (25%) | `triaxialVerifications` + `raidCount` + `tqGenerated` | 25% | 30% (regenerative) + 20% (history) |
| I_i — Infrastructure (10%) | `localDecisionMaking` + `baseMaterialStewardship` | 10% | 25% (autonomy) |

**Diferencias clave:**
- PSS: square root (Penrose) → sub-linear power growth
- ALRAC CDS: linear weighted sum → pero con gates (CDS ≥ 0.6/0.7/0.8)
- **Convergencia:** PSS Penrose sqrt ≈ ALRAC `β_crit` anti-acaparamiento en dividendos TQ

**Innovación PSS para ALRAC:** 
- **R_i exponencial decay** (`λ=0.8`, ~5-quarter half-life) → memory mechanism para CDS history
- **±2pp quarterly bound** → anti-coup damping = rate limit institucional
- **Trailing 12 quarters** → suaviza ciclos commodity/políticos

### 3.3 PST (Production Stream Tokens) → TQ/ZNU Hibridación Anfibia

| PSS PST | ALRAC Equivalent |
|---------|------------------|
| Dollar-denominated claim on pooled audited production | **Anfibio:** Phase 1 = ZNU/USDC (Capa 3), Phase 2 = TQ-equivalent (Capa 1) |
| Collateralization floor ≥100% audited | `alrac-tq-conversionFactor.md` priceParity ≥ 1.0 |
| Redemption history → governance input (R_i) | `alrac-tq-autonomy.md` CDS regenerative component |
| Immutable redemption record on BFT ledger | `alrac-tq-valueflows.ts` REA accounting + `alrac-tq-closer-attestation.ts` |
| Issuance into regulated capital markets | `alrac-fiat-layer.md` Nivel 3 ReFi bridge |

**Phase 1 → Phase 2 transition = ALRAC Anfibio switch:**
- `nodeMode: 'connected'` (Phase 1: stablecoins, US Treasury demand)
- `nodeMode: 'postmonetario'` (Phase 2: PST as settlement, ZNU/CaaS)
- `priceParity` oracle = PST/dollar curve → `valueDual.ts` render decide etiqueta

### 3.4 Slashing Conditions → γ-CARMIS + TQ Penalties

| PSS Slashing | ALRAC Equivalent |
|--------------|------------------|
| Failed redemption: R_i decay + collateral haircut + penalty margin | `γ-CARMIS` trigger + `alrac-tq-taxEngine.md` penalties |
| Liveness abuse (withholding): weight decay ∝ downtime | `alrac-governance-holonic.md` rotation compliance + CDS slash |
| Audit fraud: suspension to floor, collateral frozen | `triaxial-verification.md` audit failure → `NO_VERIFICADO` + CDS penalty |
| Double-signing: immediate suspension + maximal collateral penalty | BFT safety violation → `alrac-tq-exchangeGuard.md` prohibition |

**Clave:** "Penalties execute in code, without a vote. ... slashing destroys collateral immediately; the defector's tokens and sovereign curve reprice the same day" → **ALRAC: γ-CARMIS automático, sin veto posible (solo Núcleo puede vetar constitucionales/monetarias, no operativas).**

### 3.5 Constitutional Parameters (Appendix A) → ALRAC Config

| PSS Parameter | Value | ALRAC Equivalent | Spec Target |
|---------------|-------|------------------|-------------|
| Component weights (C/T/R/I) | 40/25/25/10 | CDS weights / IAL `w_k` | `alrac-governance-holonic.md`, `ial.ts` |
| Concentration transform | square root (Penrose) | `β_crit` anti-acaparamiento | `tq-dividend.ts`, `tq-types-extended.ts` |
| Weight cap | 20% (alt 16%) | CDS gate 0.8 / validator cap | `alrac-caas-membership.md` |
| Weight floor | 2% | Minimum participation threshold | `alrac-caas-membership.md` Afiliados |
| Rebalancing cadence | quarterly | Comité rotativo 3 meses | `alrac-governance-holonic.md` §7 |
| Trailing window | 12 quarters | CDS history window | `alrac-governance-holonic.md` §5 |
| Per-period weight bound | ±2pp | Rate limiting / anti-surge | `ial.ts` provisional thresholds |
| Redemption decay λ | 0.8 | CDS history decay | `alrac-governance-holonic.md` §5 |
| Finality threshold | ≥⅔ weight | BFT consensus / CDS veto | `alrac-governance-holonic.md` §4 |
| Fault tolerance | <⅓ weight | BFT liveness / γ-CARMIS | `alrac-governance-holonic.md` §4 |
| Constitutional amendment | ≥¾ weight + 4-quarter delay | Consentimiento + veto suspensivo | `alrac-governance-holonic.md` §4, §8 |
| Collateralization floor (PST) | treaty-set, ≥100% audited | TQ ancla 1 kWh / ZNU canasta | `alrac-tq-conversionFactor.md`, `alrac-znu-indexing-credit.md` |

---

## 4. Nodos Piloto PSS → ALRAC Pilot Nodes Mapping

| PSS Pilot | ALRAC Pilot Node | Complementariedad |
|-----------|------------------|-------------------|
| **Lithium triangle** (Chile/Argentina/Bolivia) — pooled CAE-audited lithium offtake | **Colonya** (Uruguay, 515ha urbano, Ala Este SAS) | Commodity-backed settlement + land registry |
| **Copper, energy, agricultural pools** (2033-2037) | **Feria Conuquera** (Caracas, 10 años vivo, validación empírica) | Mercado real + redes de trueque → PST commodity |
| **Venezuelan Technocrat State** — oil/gas/minerals en CAE, BFT node | **Samay** (Ecuador, 20 años, Fundación Runakawsai) | Recursos naturales + gobernanza comunitaria |
| **Phase 1: stablecoin settlement** (2027-2029) | **CLC-CPP** (White Paper v0.8 → ALRAC Capa 2) | Bridge fiat → postmonetario |
| **Phase 2: PST settlement** (early 2040s) | **Archidiagram** (60k arquitectos, ArchiMate/SketchUp) | Professional services settlement |

**Insight:** PSS pilot sequence (lithium → copper/energy/ag → Phase 2) = **ALRAC Fase 1-2-3 deployment** pero a escala estado-nación.

---

## 5. Auditoría de Licencias

| Fuente | Licencia | Acción |
|--------|----------|--------|
| PSS Working Paper v1.2 (SSRN) | Working paper — "circulated for discussion and comment", "parameter values are proposals for treaty negotiation, not conclusions" | **Análisis y síntesis permitidos**. Parámetros/arquitectura → especificación OpenSpec (domain público). Código de implementación → MIT/Apache. No hay código propietario en el paper. |
| Referencias (Nakamoto, Lamport, Castro/Liskov, BIS, etc.) | Académicas/estándares abiertos | Referenciar, no copiar texto extenso. |

**Regla HSCSG:** Backups vault Obsidian → solo local, nunca GitHub público. Este paper no está en vault.

---

## 6. Estado γ-CARMIS y Paso II

**Análisis αʰ = Ω × s para PSS-asimilación:**

- **Ω (capacidad técnica):** Alta — BFT, tokenization, custody engineering maduros (mBridge, Tendermint, regulated stablecoins)
- **s (soberanía/disponibilidad):** Media-Alta — requiere tratado multiestatal, guarantor exchange (US), piloto lithium
- **κ (umbral producción):** 1.0 (producción real) vs 0.5 (simulación)

**Veredicto:** **αʰ < κ para implementación inmediata a nivel estado** — PSS es **arquitectura de tratado**, no código deployable hoy. Pero **αʰ > κ para asimilación especificación** — toda la arquitectura mapea a ALRAC specs existentes.

**Paso II para PSS:** Definir "cliente real de Línea A" = **tratado multilateral + piloto lithium CAE**. Triaxial: mental (este spec), simulación (agent-based model PSS params), lab/terreno (CAE custody test con lithium real).

---

## 7. Roadmap de Entrega (Asimilación PSS → ALRAC)

| Fase | Semanas | Entregable | Specs ALRAC Afectadas |
|------|---------|------------|------------------------|
| **1. Constitutional Parameters** | 1-2 | `alrac-pss-parameters.md` — Appendix A mapeado a config ALRAC | `alrac-governance-holonic.md`, `ial.ts`, `tq-types-extended.ts` |
| **2. CAE Architecture** | 2-3 | `alrac-cae-custody-audit.md` — 5 roles, multi-jurisdictional SPVs, auditor rotation | `alrac-tq-digitalSovereignty.md`, `alrac-fiat-layer.md`, `triaxial-verification.md` |
| **3. PST Token Design** | 3-4 | `alrac-pss-pst.md` — Phase 1/2 anfibio, collateralization, redemption history → governance | `alrac-tq-conversionFactor.md`, `alrac-tq-valueflows.ts`, `alrac-fiat-layer.md` |
| **4. Validator Weight Engine** | 4-5 | `alrac-pss-validator-weight.ts` — C/T/R/I + Penrose sqrt + caps/floors + ±2pp damping | `alrac-governance-holonic.md` CDS, `tq-dividend.ts`, `tq-types-extended.ts` |
| **5. Slashing & Incentives** | 5-6 | `alrac-pss-slashing.md` — conditions, automatic execution, curve repricing | `alrac-tq-taxEngine.md`, `alrac-governance-holonic.md` γ-CARMIS |
| **6. Venezuelan Technocrat State Spec** | 6-8 | `alrac-pss-venezuela.md` — national application, oil/gas/minerals custody, BFT node | `colonya-integration.md`, `feria-conuquera-pilot.md`, `samay-integration.md` |
| **7. Pilot Lithium Triangle** | 8-12 | `alrac-pss-lithium-pilot.md` — CAE custody, PST issuance, BFT settlement, slashing test | All pilot specs + `alrac-tq-pilot-tdf.ts` pattern |

---

## 8. Criterios de Éxito

- [ ] `tsc --noEmit` = 0 errores en core ALRAC + nuevos specs PSS
- [ ] `LICENSE_AUDIT_ASIMILACIONES.md` actualizado (PSS = working paper, domain público para specs)
- [ ] Paso II ejecutado para **piloto lithium** (αʰ > κ): CAE custody test + PST issuance + BFT settlement + slashing demo
- [ ] Mapping PSS→ALRAC documentado en `openspec/specs/` (7 nuevos specs)
- [ ] Backups solo local; nada sensible subido a GitHub
- [ ] **Integración anfibia verificada:** Phase 1 (stablecoin) ↔ Phase 2 (PST) switch via `nodeMode` + `priceParity` oracle

---

## 9. Referencias del Repo (Actualizadas)

- `docs/ALRAC_MASTER_INTEGRADO.md` — arquitectura 5 capas, 12 colaboraciones
- `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` — 4 adaptadores técnicos
- `docs/GRANALLIANZA_MAPPING.md` — 5 líneas × 7 holones (añadir línea PSS: Soberanía/Compromiso)
- `docs/LICENSE_AUDIT_ASIMILACIONES.md` — matriz compatibilidad (añadir PSS row)
- `docs/ARCHITECTURE_DECISIONS.md` — ADR-013: PSS Constitutional Parameters, ADR-014: CAE Custody Model
- `openspec/specs/SPEC_INDEXER.md` — catálogo (añadir 7 specs PSS)
- `openspec/specs/alrac-governance-holonic.md` — CDS, weight function, slashing
- `openspec/specs/alrac-fiat-layer.md` — Anfibio Phase 1/2, priceParity
- `openspec/specs/alrac-tq-conversionFactor.md` — Collateralization floor, TQ↔ZNU
- `openspec/specs/triaxial-verification.md` — Verificación triaxial (R4 IAL, CAE audit)
- `src/core/lib/valueDual.ts` — Lógica anfibia (postmonetario ↔ conectado)
- `src/core/lib/ial.ts` — IAL bands, anti-Goodhart, provisional T

---

## 10. Specs Nuevos Propuestos (OpenSpec)

| # | Spec File | Capa | Source | Target | Estado |
|---|-----------|------|--------|--------|--------|
| 49 | `alrac-pss-parameters.md` | 0.5 | Appendix A Constitutional Parameters | `pss-parameters.ts` config | 📋 Diseñado |
| 50 | `alrac-cae-custody-audit.md` | 1+2 | CAE 5 roles, multi-jurisdictional | `cae-custody.ts`, `cae-audit.ts` | 📋 Diseñado |
| 51 | `alrac-pss-pst.md` | 1+3 | PST Phase 1/2 anfibio, collateralization | `pst-token.ts`, `pst-issuance.ts` | 📋 Diseñado |
| 52 | `alrac-pss-validator-weight.md` | 5 | C/T/R/I + Penrose sqrt + damping | `pss-validator-weight.ts` | 📋 Diseñado |
| 53 | `alrac-pss-slashing.md` | 1+5 | Slashing conditions, auto-execution | `pss-slashing.ts` | 📋 Diseñado |
| 54 | `alrac-pss-venezuela.md` | 4 | Technocrat State national application | `pss-venezuela.ts` (pilot) | 📋 Diseñado |
| 55 | `alrac-pss-lithium-pilot.md` | 2+4 | Lithium triangle pilot end-to-end | `pss-lithium-pilot.ts` (pilot) | 📋 Diseñado |

**Total specs tras asimilación PSS: 55 (48 previos + 7 nuevos)**

---

## 11. Convergencia Conceptual: PSS = ALRAC a Escala Estado-Nación

| Concepto | ALRAC (Comunidad/Nodo) | PSS (Estado/Tratado) |
|----------|------------------------|----------------------|
| **Unidad de cuenta** | TQ = 1 kWh (ancla física) | PST = claim on audited commodity production |
| **Gobernanza** | 1a1v + CDS + comités rotativos | Contribution-weighted validators + BFT consensus |
| **Memoria/Historial** | CDS history, RAID count, triaxial verifications | R_i exponential decay (redemption integrity) |
| **Penalidades** | γ-CARMIS, slashing TQ, CDS decay | Slashing collateral + weight + curve repricing |
| **Antiacaparamiento** | β_crit, Penrose sqrt en dividendos | Penrose sqrt en validator weight, caps 20% |
| **Rate limiting** | ±2pp quarterly IAL, CDS gates | ±2pp quarterly weight bound, 12-quarter trailing |
| **Anfibio** | ZNU/CaaS offline ↔ USDC/ReFi Nivel 3 | Phase 1 stablecoin ↔ Phase 2 PST settlement |
| **Verificación** | Triaxial (mental/sim/lab) | CAE audit rotation + cross-audit + on-chain publication |
| **Piloto** | Colonya, Feria Conuquera, Samay | Lithium triangle, Venezuelan Technocrat State |

**Conclusión:** PSS **valida empíricamente** la arquitectura ALRAC a escala soberana. Cada decisión de diseño ALRAC (anfibio, CDS, γ-CARMIS, triaxial, Penrose, rate limiting) tiene **paralelo independiente en PSS** — convergencia por restricciones físicas/matemáticas compartidas, no por copia.

---

> **Nota de asimilación:** Este spec deriva del paper PSS v1.2 (June 2026). Los parámetros Appendix A son **propuestas para negociación de tratado**, no conclusiones. La implementación TypeScript en `src/core/lib/pss-*.ts` requiere validación triaxial y Paso II (piloto lithium real). La lógica anfibia Phase 1/2 es **idéntica** a ALRAC `valueDual.ts` + `nodeMode` + `priceParity`.