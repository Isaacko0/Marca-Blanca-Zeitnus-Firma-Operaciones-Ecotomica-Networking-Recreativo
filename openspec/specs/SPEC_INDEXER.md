# SPEC INDEXER: ALRAC/TQ/Zeitnus Specification Catalog

## Overview
This index catalogs all OpenSpec specifications for the ALRAC/TQ/Zeitnus regenerative economics stack. Each spec maps external sources (OASA, DisCO, Closer, ElizaOS, ValueFlows, Aragon, etc.) to TypeScript implementations in `src/core/lib/`.

**Total Specs:** 41 (25 original + 12 external scraping + 4 Norberto assimilation)
**Implemented:** 27 (19 original + 4 Fase 1-2 + Pilot + 4 Norberto)
**Designed:** 4 (Fase 3+ pending implementation)

---

## Original ALRAC Specifications (25)

### **Capa 0: Epistémica / Normativa** (Originales)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 1 | `alrac-architecture.md` | Arquitectura 5 capas + capa 0/0.5 | ✅ Original |
| 2 | `alrac-governance.md` | Gobernanza, licencia, Yoka, piloto | ✅ Original |
| 3 | `alrac-revenue.md` | Reparto Amid, líneas A-E, Commonomics | ✅ Original |
| 4 | `alrac-convergence-nexo.md` | Convergencia Amid↔Yoka, NEXO sync | ✅ Original |

### **Capa 0.5: Normativa Extendida** (Nuevas - Asimilación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 5 | `cpp-protocol.md` | Commitment Pooling Protocol — Capa 2 Interoperabilidad | ✅ Nueva v0.1 |
| 6 | `tq-cpp-bridge.md` | Interface transducción Capa 1 (TQ) ↔ Capa 2 (CPP) | ✅ Nueva v0.1 |

### **Capa 1: Contable-Física (TQ)** (10 specs originales)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 7 | `alrac-tq-exchangeGuard.md` | Prohibición TQ↔fiat/cripto | ✅ Original |
| 8 | `alrac-tq-conversionFactor.md` | TQ↔ZNU conversion, priceParity | ✅ Original |
| 9 | `alrac-tq-productFederation.md` | Catálogo federado de productos | ✅ Original |
| 10 | `alrac-tq-crossNodePools.md` | Pools cross-node, staking | ✅ Original |
| 11 | `alrac-tq-governance.md` | Gobernanza TQ, parámetros | ✅ Original |
| 12 | `alrac-tq-land.md` | Registro tierra, uso, regeneración | ✅ Original |
| 13 | `alrac-tq-taxEngine.md` | Motor impositivo regenerativo | ✅ Original |
| 14 | `alrac-tq-nodeArchitecture.md` | Arquitectura nodo, health | ✅ Original |
| 15 | `alrac-tq-digitalSovereignty.md` | Soberanía digital, datos | ✅ Original |
| 16 | `alrac-tq-autonomy.md` | Métricas AUT, CDS, soberanía | ✅ Original |

### **Capa 2: Interoperabilidad (Nodos Piloto Reales)** (Nuevas - Asimilación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 17 | `colonya-integration.md` | Nodo piloto urbano 515ha Uruguay (Ala Este SAS) | ✅ Nueva v0.1 |
| 18 | `feria-conuquera-pilot.md` | Nodo vivo 10 años Caracas (validación empírica) | ✅ Nueva v0.1 |
| 19 | `samay-integration.md` | Nodo piloto 20 años Ecuador (Fundación Runakawsai) | ✅ Nueva v0.1 |
| 20 | `clc-cpp-integration.md` | Bridge CLC White Paper v0.8 → ALRAC Capa 2 | ✅ Nueva v0.1 |
| 21 | `archidiagram-integration.md` | Nodo piloto 60k arquitectos (ArchiMate 3.2, SketchUp) | ✅ Nueva v0.1 |
| 22 | `febhouse-integration.md` | Nodo piloto Febhouse Studio (3 plugins, 9 proyectos, 60k users) | ✅ Nueva v0.1 |
| 23 | `memegen-integration.md` | Nodo piloto cultural memegen.link (200+ templates, MIT, stateless) | ✅ Nueva v0.1 |

### **Capa 2: Interoperabilidad (CaaS/HSCSG)** (Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 24 | `alrac-caas-revenue-streams.md` | 6 streams, validación Gate MJ, CSA | ✅ Simulación |
| 25 | `alrac-caas-membership.md` | 3 niveles (Afiliados/Asociados/Núcleo), derechos, transiciones | ✅ Simulación |

### **Capa 3: Membrana Fiat (ZEITNUS)** (Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 26 | `alrac-znu-indexing-credit.md` | Canasta básica, crédito 2-3%, expiración Postulado 4, 1a1v | ✅ Simulación |
| 27 | `alrac-fiat-layer.md` | Bridge USDC, 4 niveles ReFi, priceParity oracle, anfibio | ✅ Simulación |

### **Capa 5: Gobernanza Transversal** (Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 28 | `alrac-governance-holonic.md` | 1a1v, CDS, subsidiaridad, comités rotativos, veto, triaxial | ✅ Simulación |

---

## New Specifications from External Scraping Assimilation (12)

### **Fase 1: Core Integration** (Weeks 1-3) ✅ Implemented
| # | Spec | Source | Target | Lines | Status |
|---|------|--------|--------|-------|--------|
| 29 | `alrac-tq-oasa.md` | OASA Constitution 2025 | `tq-oasa.ts` | ~750 | ✅ |
| 30 | `alrac-tq-disco-cat.md` | DisCO Manifesto/Elements/Ball | `tq-disco-cat.ts` | ~600 | ✅ |
| 31 | `alrac-tq-closer.md` | Closer Platform + OASA | `tq-closer.ts` | ~500 | ✅ |
| 32 | `alrac-tq-eliza.md` | elizaOS (33k commits) | `tq-eliza.ts` | ~1,000 | ✅ |
| 33 | `alrac-tq-valueflows.md` | ValueFlows REA Ontology | `tq-valueflows.ts` | ~600 | ✅ |
| 34 | `alrac-tq-aragon.md` | Aragon OSx, AGPs, OTF | `tq-aragon.ts` | ~600 | ✅ |

### **Fase 2: Verifiable Governance** (Weeks 3-4) ✅ Implemented
| # | Spec | Source | Target | Lines | Status |
|---|------|--------|--------|-------|--------|
| 35 | `alrac-tq-snapshot.md` | Snapshot.js Strategies | `tq-snapshot.ts` | ~650 | ✅ |
| 36 | `alrac-tq-tdf.md` | TDF 3-Track Methodology | `tq-tdf.ts` | ~800 | ✅ |
| 37 | `alrac-tq-bread.md` | Bread + DisCO CAT | `tq-bread.ts` | ~600 | ✅ |
| 38 | `alrac-tq-social-audit.md` | Social Audit + Engines | `tq-social-audit.ts` | ~900 | ✅ |
| 39 | `alrac-tq-closer-attestation.md` | Closer + TDF Track 1 | `tq-closer-attestation.ts` | ~750 | ✅ |

### **Pilot: Traditional Dream Factory** ✅ Implemented
| # | Spec | Source | Target | Lines | Status |
|---|------|--------|--------|-------|--------|
| 40 | `alrac-tq-pilot-tdf.md` | TDF Pilot Case | `tq-pilot-tdf.ts` | ~3,800 | ✅ |

### **Norberto Assimilation (4 New Specs)** ✅ Implemented
| # | Spec | Source | Target | Lines | Status |
|---|------|--------|--------|-------|--------|
| 41 | `alrac-tq-mohenjodaro.md` | Mohenjo-Daro Historical Validation | `tq-pilot-tdf.ts` + types | ~900 | ✅ |
| 42 | `alrac-tq-ebr-venus.md` | EBR/Proyecto Venus → ALRAC | `tq-eliza.ts` + `tq-uhi-engine.ts` | ~1,500 | ✅ |
| 43 | `alrac-tq-economic-calculation.md` | IA resuelve Mises-Hayek-Lange | `tq-uhi-engine.ts` + `tq-eliza.ts` | ~1,400 | ✅ |
| 44 | `alrac-tq-desmercantilizacion.md` | Esping-Andersen → CaaS/ZNU | `tq-valueflows.ts` + types | ~1,700 | ✅ |

### **Fase 3: Advanced Integration** 📋 Designed (Pending Implementation)
| # | Spec | Source | Target | Status |
|---|------|--------|--------|--------|
| 45 | `alrac-tq-virginia.md` | Virginia Network | `tq-virginia.ts` | 📋 |
| 46 | `alrac-tq-colony.md` | Colony Protocol | `tq-colony.ts` | 📋 |
| 47 | `alrac-tq-berry-vesting.md` | Berry Vesting | `tq-berry-vesting.ts` | 📋 |

---

## Complete Specification Catalog (48 Total)

| # | Spec | Layer | Source | Target | Status |
|---|------|-------|--------|--------|--------|
| 1 | alrac-architecture.md | 0 | Original | - | ✅ |
| 2 | alrac-governance.md | 0 | Original | - | ✅ |
| 3 | alrac-revenue.md | 0 | Original | - | ✅ |
| 4 | alrac-convergence-nexo.md | 0 | Original | - | ✅ |
| 5 | cpp-protocol.md | 0.5 | Asimilación | - | ✅ |
| 6 | tq-cpp-bridge.md | 0.5 | Asimilación | - | ✅ |
| 7-16 | alrac-tq-*.md (10) | 1 | Original | tq.ts | ✅ |
| 17-23 | *-integration.md (7) | 2 | Asimilación | various | ✅ |
| 24-25 | alrac-caas-*.md (2) | 2 | Simulación | - | ✅ |
| 26-27 | alrac-znu-*.md (2) | 3 | Simulación | - | ✅ |
| 28 | alrac-governance-holonic.md | 5 | Simulación | - | ✅ |
| 29 | alrac-tq-oasa.md | 1+ | OASA Constitution | tq-oasa.ts | ✅ |
| 30 | alrac-tq-disco-cat.md | 1+ | DisCO Manifesto | tq-disco-cat.ts | ✅ |
| 31 | alrac-tq-closer.md | 1+ | Closer Platform | tq-closer.ts | ✅ |
| 32 | alrac-tq-eliza.md | 1+ | elizaOS | tq-eliza.ts | ✅ |
| 33 | alrac-tq-valueflows.md | 2 | ValueFlows REA | tq-valueflows.ts | ✅ |
| 34 | alrac-tq-aragon.md | 5 | Aragon OSx | tq-aragon.ts | ✅ |
| 35 | alrac-tq-snapshot.md | 5 | Snapshot.js | tq-snapshot.ts | ✅ |
| 36 | alrac-tq-tdf.md | 5 | TDF Methodology | tq-tdf.ts | ✅ |
| 37 | alrac-tq-bread.md | 5 | Bread + DisCO | tq-bread.ts | ✅ |
| 38 | alrac-tq-social-audit.md | 5 | Social Audit | tq-social-audit.ts | ✅ |
| 39 | alrac-tq-closer-attestation.md | 5 | Closer + TDF | tq-closer-attestation.ts | ✅ |
| 40 | alrac-tq-pilot-tdf.md | Pilot | TDF Case | tq-pilot-tdf.ts | ✅ |
| 41 | alrac-tq-mohenjodaro.md | 1+ | Mohenjo-Daro Historical | tq-pilot-tdf.ts + types | ✅ |
| 42 | alrac-tq-ebr-venus.md | 1+ | EBR/Proyecto Venus | tq-eliza.ts + tq-uhi-engine.ts | ✅ |
| 43 | alrac-tq-economic-calculation.md | 1+ | IA Economic Calculation | tq-uhi-engine.ts + tq-eliza.ts | ✅ |
| 44 | alrac-tq-desmercantilizacion.md | 2+ | Desmercantilización → CaaS | tq-valueflows.ts + types | ✅ |
| 45 | alrac-tq-virginia.md | 1+ | Virginia Network | tq-virginia.ts | 📋 |
| 46 | alrac-tq-colony.md | 1+ | Colony Protocol | tq-colony.ts | 📋 |
| 47 | alrac-tq-berry-vesting.md | 1+ | Berry Vesting | tq-berry-vesting.ts | 📋 |

---

## Implementation Status Summary

| Phase | Specs | Lines | Status |
|-------|-------|-------|--------|
| Original ALRAC | 25 | ~8,000 | ✅ Complete |
| Fase 1 Core Integration | 6 | ~4,050 | ✅ Complete |
| Fase 2 Verifiable Governance | 5 | ~3,700 | ✅ Complete |
| Pilot TDF | 1 | ~3,800 | ✅ Complete |
| **Norberto Assimilation** | **4** | **~5,500** | **✅ Complete** |
| Fase 3 Advanced | 3 | ~0 | 📋 Designed |
| **Total** | **44** | **~25,050** | **27/48 Implemented** |

---

## Dependency Graph

```
tq-types-extended.ts (Core Types - All Specs)
    │
    ├── Original TQ Specs (7-16) ◄────────────────────┐
    ├── Fase 1 Core (29-34) ◄─────────────────────────┤
    ├── Fase 2 Governance (35-39) ◄───────────────────┤
    └── Pilot (40) ◄──────────────────────────────────┘
           │
           ▼
    Fase 3 Advanced (41-43) 📋
```

---

## Cross-Spec Integration Matrix

| Integration | Specs Involved | Engines |
|-------------|----------------|---------|
| TDF 3-Track | 36, 39, 34, 35, 33, 31, 30, 29, 37, 38 | TDFEngine |
| Virginia N3 Weight | 29, 30, 31, 32, 33, 34, 37, 41, 42, 43 | VirginiaGateway |
| DisCO 3 Flows → Virginia | 30, 29, 41 | DisCO_CAT_Engine |
| Autómata Soberano | 32, 29, 30, 31, 33, 34, 35, 42, 43 | ElizaOS Runtime |
| Pilot TDF | All 1-40 | PilotTDFEngine |

---

## File Locations

```
Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo/
├── src/core/lib/
│   ├── tq.ts                    # Base TQ types (Original Specs 7-16)
│   ├── tq-types-extended.ts     # Extended types (All Specs)
│   ├── tq-oasa.ts               # Spec 29 ✅
│   ├── tq-disco-cat.ts          # Spec 30 ✅
│   ├── tq-closer.ts             # Spec 31 ✅
│   ├── tq-eliza.ts              # Spec 32 ✅
│   ├── tq-valueflows.ts         # Spec 33 ✅
│   ├── tq-aragon.ts             # Spec 34 ✅
│   ├── tq-snapshot.ts           # Spec 35 ✅
│   ├── tq-tdf.ts                # Spec 36 ✅
│   ├── tq-bread.ts              # Spec 37 ✅
│   ├── tq-social-audit.ts       # Spec 38 ✅
│   ├── tq-closer-attestation.ts # Spec 39 ✅
│   ├── tq-pilot-tdf.ts          # Spec 40 ✅
│   ├── tq-virginia.ts           # Spec 45 📋
│   ├── tq-colony.ts             # Spec 46 📋
│   └── tq-berry-vesting.ts      # Spec 47 📋
└── openspec/specs/
    ├── SPEC_INDEXER.md          # This file
    ├── alrac-architecture.md    # Spec 1
    ├── alrac-governance.md      # Spec 2
    ├── alrac-revenue.md         # Spec 3
    ├── alrac-convergence-nexo.md # Spec 4
    ├── cpp-protocol.md          # Spec 5
    ├── tq-cpp-bridge.md         # Spec 6
    ├── alrac-tq-exchangeGuard.md # Spec 7
    ├── alrac-tq-conversionFactor.md # Spec 8
    ├── alrac-tq-productFederation.md # Spec 9
    ├── alrac-tq-crossNodePools.md # Spec 10
    ├── alrac-tq-governance.md   # Spec 11
    ├── alrac-tq-land.md         # Spec 12
    ├── alrac-tq-taxEngine.md    # Spec 13
    ├── alrac-tq-nodeArchitecture.md # Spec 14
    ├── alrac-tq-digitalSovereignty.md # Spec 15
    ├── alrac-tq-autonomy.md     # Spec 16
    ├── colonya-integration.md   # Spec 17
    ├── feria-conuquera-pilot.md # Spec 18
    ├── samay-integration.md     # Spec 19
    ├── clc-cpp-integration.md   # Spec 20
    ├── archidiagram-integration.md # Spec 21
    ├── febhouse-integration.md  # Spec 22
    ├── memegen-integration.md   # Spec 23
    ├── alrac-caas-revenue-streams.md # Spec 24
    ├── alrac-caas-membership.md # Spec 25
    ├── alrac-znu-indexing-credit.md # Spec 26
    ├── alrac-fiat-layer.md      # Spec 27
    ├── alrac-governance-holonic.md # Spec 28
    ├── alrac-tq-oasa.md              # Spec 29
    ├── alrac-tq-disco-cat.md         # Spec 30
    ├── alrac-tq-closer.md            # Spec 31
    ├── alrac-tq-eliza.md             # Spec 32
    ├── alrac-tq-valueflows.md        # Spec 33
    ├── alrac-tq-aragon.md            # Spec 34
    ├── alrac-tq-snapshot.md          # Spec 35
    ├── alrac-tq-tdf.md               # Spec 36
    ├── alrac-tq-bread.md             # Spec 37
    ├── alrac-tq-social-audit.md      # Spec 38
    ├── alrac-tq-closer-attestation.md # Spec 39
    ├── alrac-tq-pilot-tdf.md         # Spec 40
    ├── alrac-tq-mohenjodaro.md       # Spec 41
    ├── alrac-tq-ebr-venus.md         # Spec 42
    ├── alrac-tq-economic-calculation.md # Spec 43
    ├── alrac-tq-desmercantilizacion.md # Spec 44
    ├── alrac-tq-virginia.md          # Spec 45
    ├── alrac-tq-colony.md            # Spec 46
    └── alrac-tq-berry-vesting.md     # Spec 47
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 4.0.0 | 2026-10-19 | Added 4 Norberto assimilation specs (Mohenjo-Daro, EBR/Venus, Economic Calculation, Desmercantilización), total 48 specs |
| 3.0.0 | 2026-10-18 | Added 12 new specs from external scraping assimilation (Fase 1-2 + Pilot), updated catalog to 43 total specs |
| 2.1 | 2026-10-07 | Original catalog with 25 specs |