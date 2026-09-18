# Libro Ecoaldeas Federadas v1.0 — Integración Zeitnus

**Fuente**: `Downloads/documentos HSCSG/Libro Ecoaldeas Federadas - v1.0.pdf`  
**Autor**: Cergio Monasterio  
**Colectivo**: Feria Conuquera Agroecológica  
**Páginas**: 47 | **Caracteres**: ~118K

---

## Resumen Ejecutivo

Este libro es el **manifiesto técnico-filosófico completo** del sistema que la Red de Intercambio Federada implementa en código. Es la "constitución" del proyecto: define el QUÉ, el PORQUÉ y el CÓMO de la moneda TQ, el crédito mutuo, la federación, la gobernanza, la tecnología soberana y la transición civilizatoria.

**Relación con repos existentes:**
- `red-de-intercambio-federada-isaacko` = Implementación técnica (Go, ESP32, Android, YugabyteDB)
- `Zeitnus-Firma-Operaciones-Ecotomica` = Adaptación React/TypeScript/Zustand (HSCSG v15 OS)
- Este libro = **Fuente de verdad filosófica y especificación funcional**

---

## Mapeo Concepto → Código (Isomorfismo Libro ↔ Zeitnus ↔ Red Federada)

| Concepto del Libro | Red Federada (Go) | Zeitnus (TS/React) | Estado en Zeitnus |
|---|---|---|---|
| **TQ = 1 kWh** | `currency_exchange.md` + `pricing.md` | `valueDual.ts` (anfibia) | ✅ Parcial (valueDual) |
| **5 Pilares Moneda Cero** | `currency_exchange.md` (Pilares 1-5) | `store.ts` (ZNU + limits) | ✅ Parcial |
| **Límite Simétrico ±500 TQ** | `currency_exchange.md` (simétrico) | `store.ts` (ZNU limits) | ✅ Parcial |
| **Confianza Progresiva** | `currency_exchange.md` (escalones) | `caas.ts` (tiers) | ✅ Parcial |
| **Catálogo Energético (ICE/Ecoinvent)** | `pricing.md` + `038_energy_realigned_catalog.sql` | `valueDual.ts` + `vitalTime.ts` | ❌ Falta |
| **Prohibición Cambiaria TQ≠Fiat** | `currency_exchange.md` (Cap 7) | `valueDual.ts` (nodeMode) | ✅ Parcial (nodeMode) |
| **Factor Conversión FC (Canasta)** | `currency_exchange.md` (FC) | `priceParity` en store | ✅ Parcial |
| **Piscina Global + Bilateral** | `federation.md` (piscinas) | `caas.ts` (streams) | ✅ Parcial |
| **Límites Globales/Bilaterales** | `federation.md` (3 capas) | `integral.ts` (CDS/OAD/ITC) | ❌ Falta |
| **Federación Productos (aprobación)** | `federation.md` (ProductProposal) | `integral.ts` (CDS/OAD) | ❌ Falta |
| **DEX Puente Externo** | `currency_exchange.md` (FC+DEX) | `valueDual.ts` (priceParity) | ✅ Parcial |
| **Autonomía Progresiva (cerrar escotilla)** | `federation.md` + `currency_exchange.md` | `loopEngine.ts` (γ-CARMIS) | ❌ Falta |
| **Governance 3 niveles + voto crypto** | `governance.md` + `federation_governance.md` | `democracy.ts` + `symbiosky.ts` | ✅ Parcial |
| **Tenencia Tierra (CLT/Usufructo)** | `governance.md` (Cap 14) | `base.ts` (BaseMaterial) | ❌ Falta |
| **Impuestos Automáticos + Fondo** | `currency_exchange.md` (Cap 15) | `caas.ts` (payouts) | ✅ Parcial |
| **Arquitectura Nodo (mTLS/Gossip/Yugabyte)** | `federation.md` (Arq 16) | `browserAgent.ts` + `nostrRelay.ts` | ❌ Falta |
| **Hardware ESP32 + POS Android + NFC** | `federation.md` (Cap 17) | `browserAgent.ts` (simulado) | ❌ Falta |
| **Soberanía Digital (Mesh/VoIP/Self-hosted)** | `federation.md` (Cap 18) | `nostrRelay.ts` + `agentMesh.ts` | ✅ Parcial |
| **Cross-Node (3 capas límites + BIN-NFC)** | `federation.md` (Cap 19) | `trustlines.ts` + `caas.ts` | ✅ Parcial |
| **Federación Productos (filtro estricto)** | `federation.md` (Cap 20) | `integral.ts` (CDS decide) | ❌ Falta |

---

## Contenido Crítico NO Implementado en Zeitnus (Gaps Prioritarios)

### 1. Catálogo Energético Completo (`pricing.md` → Zeitnus)
```typescript
// FALTA: energy_catalog.ts con:
// - ICE Database factors (MJ/kg por material)
// - Ecoinvent/Agribalyse integration
// - energy_total = direct + human + inputs + transport + amortization
// - Calcular precio = energy_total / 3.6 (MJ → TQ)
// - Productos compuestos: modelo de rendimiento automático
```

### 2. Límite Simétrico Real (no solo ZNU)
```typescript
// FALTA en store.ts:
// symmetricLimits: { floor: -500, ceiling: 500 } // por miembro
// progressiveTrust: { tier1: 500, tier2: 1000, tier3: 5000, tierOrg: 100000 }
// symmetricEnforcement: floor === ceiling SIEMPRE
```

### 3. Prohibición Cambiaria Estricta
```typescript
// FALTA: exchangeGuard.ts
// - Block TQ ↔ Fiat/Crypto direct exchange
// - Only allow: Fiat → Tangible Goods → TQ (ingreso)
// - Only allow: TQ → Tangible Goods → Fiat (extracción)
// - Audit trail: expulsion permanente si violación
```

### 4. Factor de Conversión FC (Canasta Federada)
```typescript
// FALTA: conversionFactor.ts
// - basicBasketTQ: 500 (constante federada, solo cambia por consenso)
// - basicBasketFiat: { USD: 300, EUR: 280, ... } // configurable por nodo
// - FC = basicBasketTQ / basicBasketFiat
// - DEX: exportGoodsForFiat() / importGoodsForTQ()
// - ExternalPriceCalculator: audit FC vs reality
```

### 5. Federación de Productos (Filtro Soberano)
```typescript
// FALTA en integral.ts / productFederation.ts:
// - ProductProposal: broadcast via Gossip
// - LocalAssembly.approve/reject(product)
// - CompositeProductVerification: ALL ingredients must be approved
// - If ANY ingredient rejected → block entire product
// - Vegan/hygienist filters: automatic enforcement
```

### 6. Piscinas Separadas (Cross-Node Risk Isolation)
```typescript
// FALTA en caas.ts / crossNode.ts:
// - globalPool: multilateral, no counterpart_node filter
// - bilateralPools: Map<nodePair, {credit, debit, limit}>
// - routing: if bilateralActive → bilateral else → global
// - isolation: debt in NodeA pool ≠ affect NodeB pool
```

### 6. Gobernanza 3 Niveles + Voto Criptográfico
```typescript
// PARCIAL en democracy.ts / symbiosky.ts - FALTA:
// - GeneralAssembly (estructural), OrgAssembly (presupuesto), DeptAssembly (técnico)
// - Board separation (operativo vs constitutivo)
// - Ed25519 signed votes + immutable ledger
// - Configurable thresholds: 10% ops, 51% admin, 75-90% critical
// - NO passive consensus (si nadie objeta ≠ aprueba)
```

### 7. Tenencia de Tierra (CLT/Usufructo/Coop)
```typescript
// FALTA en base.ts / land.ts:
// - LandTenureType: CLT | Usufruct | Coop | Family
// - CLT: indivisible, inalienable, 99yr hereditary lease
// - Usufruct: reverts to community on exit
// - Coop: share = parcela, buyback at TQ effort value (no speculation)
// - Private property on FRUITS OF LABOR (house, tools, harvest, animals)
```

### 8. Impuestos Automáticos + Fondo Comunitario
```typescript
// PARCIAL en caas.ts - FALTA:
// - tax_rate configurable per tier/org (0.5% → 2%)
// - Auto-debit on every transaction → AssemblyAccount
// - Assembly CANNOT transfer to individuals (only Orgs/Depts)
// - Recurring services: obligatory/voluntary/benefits
// - Progressive rates: higher tier/volume = higher rate
```

### 9. Arquitectura Nodo Soberano (mTLS/Gossip/YugabyteDB)
```typescript
// PARCIAL en browserAgent/nostrRelay - FALTA:
// - Independent node: own DB (YugabyteDB/PostgreSQL)
// - mTLS mutual auth + peer registry (both must register)
// - Inbox + Gossip protocol (no DB invasion)
// - 3 modes: Internet / Intranet (OpenWrt+WireGuard+IPv6 ULA) / Hybrid
// - Ledger: double-entry + hash chain + Ed25519 + Forward Secrecy
```

### 10. Hardware Soberano (ESP32 + POS Android + NFC)
```typescript
// FALTA (simulado en browserAgent):
// - ESP32 terminals: Keypad/Web/Touch/Community (dual card)
// - NTAG424 DNA / DESFire EV3 (anti-cloning)
// - Android POS: Room DB offline, Server-Driven UI, NFC flows
// - BIN-style NFC: nodoOrigen:UID for cross-node
// - Multi-sig payments (2-of-3), QR polling, Community payment
// - Hardware binding (Chip ID eFuse), Forward Secrecy (ECDH+AES-256-GCM)
// - Demo mode (watermark), Haptic/DTMF feedback
```

### 11. Soberanía Digital (Mesh + Self-hosted + Forward Secrecy)
```typescript
// PARCIAL en nostrRelay/agentMesh - FALTA:
// - OpenWrt intranet + WireGuard mesh + IPv6 ULA
// - Offline-first: 100% functional without internet
// - Self-hosted: Matrix/XMPP, PeerTube, Gitea, BigBlueButton, VoIP
// - Forward Secrecy: ECDH + AES-256-GCM per message
// - Ed25519 auth (no passwords), Android Keystore/NVS secure
```

### 12. Autonomía Progresiva (Cerrar Escotilla DEX)
```typescript
// FALTA en loopEngine.ts / autonomy.ts:
// - onNewCapability(capability): sealExternalImport(capability)
// - trackDependencyReduction: fiatImports → 0 over time
// - CriticalMassDetection: when internalProduction ≥ threshold → sealDEX
// - NetworkEffect: geographic diversity = food security
// - Emancipation metric: fiatDependencyRatio → 0
```

---

## Plan de Integración (Orden de Prioridad)

| Fase | Tarea | Archivos Zeitnus | Esfuerzo | Valor |
|------|-------|------------------|----------|-------|
| **P0** | Catálogo Energético + Pricing | `src/core/lib/energyCatalog.ts`, `src/core/state/energy.ts` | 3 | 95 |
| **P0** | Límite Simétrico + Confianza Progresiva | `src/core/state/symmetricLimits.ts`, `store.ts` | 2 | 95 |
| **P0** | Prohibición Cambiaria + FC + DEX | `src/core/lib/exchangeGuard.ts`, `src/core/lib/conversionFactor.ts` | 3 | 95 |
| **P1** | Federación Productos + Filtro Soberano | `src/core/lib/productFederation.ts`, `src/app/screens/ProductFederation.tsx` | 2 | 90 |
| **P1** | Piscinas Separadas + Cross-Node | `src/core/lib/crossNodePools.ts`, `src/core/state/crossNode.ts` | 2 | 90 |
| **P1** | Gobernanza 3 Niveles + Voto Crypto | `src/core/lib/governance.ts`, `src/app/screens/Governance.tsx` | 3 | 90 |
| **P2** | Tenencia Tierra + Impuestos/Fondo | `src/core/state/land.ts`, `src/core/lib/taxEngine.ts` | 2 | 85 |
| **P2** | Arquitectura Nodo + Hardware Simulado | `src/core/lib/nodeArchitecture.ts`, `src/app/screens/NodeInfra.tsx` | 3 | 85 |
| **P2** | Soberanía Digital + Autonomía Progresiva | `src/core/lib/autonomy.ts`, `src/app/screens/Autonomy.tsx` | 2 | 85 |

---

## Archivos de Documentación a Crear/Actualizar

1. `docs/libro_ecoaldeas_federadas_integration.md` (este documento)
2. `docs/ENERGY_CATALOG_SPEC.md` (especificación completa ICE/Ecoinvent)
3. `docs/SYMMETRIC_LIMITS_SPEC.md` (límite simétrico + confianza progresiva)
4. `docs/EXCHANGE_PROHIBITION_SPEC.md` (prohibición cambiaria + FC + DEX)
5. `docs/PRODUCT_FEDERATION_SPEC.md` (federación productos + filtro soberano)
5. `docs/CROSS_NODE_POOLS_SPEC.md` (piscinas globales/bilaterales + aislamiento)
6. `docs/GOVERNANCE_3LEVELS_SPEC.md` (asambleas 3 niveles + voto crypto)
7. `docs/LAND_TENURE_SPEC.md` (CLT/Usufructo/Coop + propiedad frutos)
8. `docs/TAX_FUND_SPEC.md` (impuestos automáticos + fondo comunitario)
9. `docs/NODE_ARCHITECTURE_SPEC.md` (mTLS/Gossip/YugabyteDB + hardware)
10. `docs/DIGITAL_SOVEREIGNTY_SPEC.md` (Mesh/VoIP/Self-hosted + FS)
11. `docs/AUTONOMY_PROGRESSIVE_SPEC.md` (cerrar escotilla + efecto red)

---

## Próximos Pasos Inmediatos

1. **Crear specs** (documentos arriba) en `docs/`
2. **Implementar P0** (energyCatalog + symmetricLimits + exchangeGuard + conversionFactor)
3. **Wire en store.ts** (imports, state slices, actions, partialize)
4. **Crear screens** para cada módulo nuevo
5. **Actualizar App.tsx + Aside.tsx + i18n.ts**
6. **Verificar**: `npx tsc --noEmit` + `npm run build` + `curl 200` en nuevas rutas
7. **Commit + push** con mensaje referenciando libro como fuente

---

## Nota Final

> **Este libro no es documentación de apoyo. ES LA ESPECIFICACIÓN FUNCIONAL.**
> 
> Cada capítulo = un módulo o conjunto de módulos. Cada regla = una invariante en código.
> La "única regla inquebrantable" (1 TQ = 1 kWh + prohibición cambiaria + límite simétrico) = invariantes blindadas en `vitalTimeInvariants.ts` / `exchangeGuard.ts`.
> 
> **La implementación incompleta no es deuda técnica. Es infidelidad a la especificación.**

---

*Integración creada: Septiembre 2026*  
*Fuente: Libro Ecoaldeas Federadas v1.0 (Cergio Monasterio / Feria Conuquera Agroecológica)*  
*Repo destino: Zeitnus-Firma-Operaciones-Ecotomica (HSCSG v15 OS)*
