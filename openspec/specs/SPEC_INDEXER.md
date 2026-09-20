# ALRAC Specs Indexer

**Versión:** 1.0  
**Fecha:** 2026-09-19  
**Total Specs:** 18 (4 originales + 10 Capa 1 TQ + 4 nuevas Capa 2-5)  
**Estado:** Todos en `openspec/specs/`

---

## 📋 Índice Completo por Capa

### **Capa 0: Epistémica / Normativa** (Originales)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 1 | `alrac-architecture.md` | Arquitectura 5 capas + capa 0/0.5 | ✅ Original |
| 2 | `alrac-governance.md` | Gobernanza, licencia, Yoka, piloto | ✅ Original |
| 3 | `alrac-revenue.md` | Reparto Amid, líneas A-E, Commonomics | ✅ Original |
| 4 | `alrac-convergence-nexo.md` | Convergencia Amid↔Yoka, NEXO sync | ✅ Original |

### **Capa 1: Contable-Física (TQ)** (10 specs originales)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 5 | `alrac-tq-exchangeGuard.md` | Prohibición TQ↔fiat/cripto | ✅ Original |
| 6 | `alrac-tq-conversionFactor.md` | TQ↔ZNU conversion, priceParity | ✅ Original |
| 7 | `alrac-tq-productFederation.md` | Catálogo federado de productos | ✅ Original |
| 8 | `alrac-tq-crossNodePools.md` | Pools cross-node, staking | ✅ Original |
| 9 | `alrac-tq-governance.md` | Gobernanza TQ, parámetros | ✅ Original |
| 10 | `alrac-tq-land.md` | Registro tierra, uso, regeneración | ✅ Original |
| 11 | `alrac-tq-taxEngine.md` | Motor impositivo regenerativo | ✅ Original |
| 12 | `alrac-tq-nodeArchitecture.md` | Arquitectura nodo, health | ✅ Original |
| 13 | `alrac-tq-digitalSovereignty.md` | Soberanía digital, datos | ✅ Original |
| 14 | `alrac-tq-autonomy.md` | Métricas AUT, CDS, soberanía | ✅ Original |

### **Capa 2: Interoperabilidad (CaaS/HSCSG)** (Nuevas - Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 15 | `alrac-caas-revenue-streams.md` | 6 streams, validación Gate MJ, CSA | ✅ Nueva |
| 16 | `alrac-caas-membership.md` | 3 niveles (Afiliados/Asociados/Núcleo), derechos, transiciones | ✅ Nueva |

### **Capa 3: Membrana Fiat (ZEITNUS)** (Nuevas - Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 17 | `alrac-znu-indexing-credit.md` | Canasta básica, crédito 2-3%, expiración Postulado 4, 1a1v | ✅ Nueva |
| 18 | `alrac-fiat-layer.md` | Bridge USDC, 4 niveles ReFi, priceParity oracle, anfibio | ✅ Nueva |

### **Capa 5: Gobernanza Transversal** (Nueva - Simulación)
| # | Archivo | Descripción | Estado |
|---|---------|-------------|--------|
| 19 | `alrac-governance-holonic.md` | 1a1v, CDS, subsidiaridad, comités rotativos, veto, triaxial | ✅ Nueva |

---

## 🔗 Trazabilidad de Creación

| Spec | Generado Por | Contexto |
|------|--------------|----------|
| 1-14 | Sesión previa (humano + asistente) | Specs fundacionales ALRAC |
| 15 | @alrac-coordinator (simulación) | Phase 1 Specs - CaaS Revenue Streams |
| 16 | @alrac-coordinator (simulación) | Phase 1 Specs - CaaS Membership |
| 17 | @alrac-coordinator (simulación) | Phase 1 Specs - ZNU Indexing & Credit |
| 18 | @alrac-coordinator (simulación) | Phase 1 Specs - Fiat Layer |
| 19 | @alrac-coordinator (simulación) | Phase 1 Specs - Governance Holonic |

---

## 📊 Cobertura por Capa ALRAC

```
CAPA 0: Epistémica          ████████████  (4 specs - Amid, Yoka, γ-CARMIS, Triaxial)
CAPA 0.5: Normativa         ████████      (incluida en architecture/governance)
CAPA 1: Contable-Física     ████████████████████  (10 specs - TQ completo)
CAPA 2: Interoperabilidad   ████████████  (2 specs - CaaS Streams + Membership)
CAPA 3: Membrana Fiat       ████████████  (2 specs - ZNU + Fiat Bridge)
CAPA 4: ZEITNUS             ████████      (incluida en ZNU/Fiat + revenue)
CAPA 5: Gobernanza          ████████████████  (1 spec - Holónica transversal)
```

---

## 🎯 Próximas Specs Sugeridas (Backlog)

### Capa 2 - Completar CaaS
- [ ] `alrac-caas-payouts.md` — Distribución, schedules, automación
- [ ] `alrac-caas-audit.md` — Auditoría trimestral, métricas, RAO
- [ ] `alrac-caas-interop.md` — APIs, protocolos, Mycelium/SynchroLabs sync

### Capa 3 - Completar Fiat/ZNU
- [ ] `alrac-znu-governance.md` — 1a1v parámetros, oráculo, basket updates
- [ ] `alrac-znu-expiration.md` — Postulado 4 implementation detail
- [ ] `alrac-bridge-security.md` — Multisig, timelocks, emergency pause

### Capa 4 - ZEITNUS Specific
- [ ] `alrac-zeitnus-tokenomics.md` — ZNU/TQ/USDC dynamics
- [ ] `alrac-zeitnus-compliance.md` — KYC/AML por nivel ReFi
- [ ] `alrac-zeitnus-insurance.md` — Seguros, coverage, claims

### Capa 5 - Gobernanza Detalle
- [ ] `alrac-governance-committees.md` — Detalle comités rotativos
- [ ] `alrac-governance-conflicts.md` — Triaxial, Kleros, mediación detail
- [ ] `alrac-governance-rao-audit.md` — Auditoría RAO automática

### Capa 0/0.5 - Fundacional
- [ ] `alrac-credo-set.md` — 𝕮 formation, αʰ calculation
- [ ] `alrac-gamma-carmis.md` — Protocolo fractura/reconfiguración
- [ ] `alrac-triaxial.md` — Mental/Sim/Lab verification
- [ ] `alrac-cognitive-limits.md` — Límites cognitivos, bias registry

---

## 📁 Estructura de Directorios

```
Zeitnus-Firma-Operaciones-Ecotomica/
├── openspec/
│   └── specs/
│       ├── alrac-architecture.md
│       ├── alrac-governance.md
│       ├── alrac-revenue.md
│       ├── alrac-convergence-nexo.md
│       ├── alrac-tq-exchangeGuard.md
│       ├── alrac-tq-conversionFactor.md
│       ├── alrac-tq-productFederation.md
│       ├── alrac-tq-crossNodePools.md
│       ├── alrac-tq-governance.md
│       ├── alrac-tq-land.md
│       ├── alrac-tq-taxEngine.md
│       ├── alrac-tq-nodeArchitecture.md
│       ├── alrac-tq-digitalSovereignty.md
│       ├── alrac-tq-autonomy.md
│       ├── alrac-caas-revenue-streams.md
│       ├── alrac-caas-membership.md
│       ├── alrac-znu-indexing-credit.md
│       ├── alrac-fiat-layer.md
│       └── alrac-governance-holonic.md
│
├── docs/
│   ├── simulacion_4agent_20260919/
│   │   ├── INDEXER.md
│       ├── alrac_simulacion_dataset.json
│       ├── alrac-strategic-plan-20260919.json
│       ├── backtest_alrac_2024.json
│       ├── alrac-simulacion-2026-09-19.json
│       ├── alrac-data-output-2026-09-19.json
│       └── alrac-strategy-output-2026-09-19.json
│   ├── ZEITNUS_REGENERATIVE_MODEL.md
│   ├── ALRAC_MASTER_INTEGRADO.md
│   ├── CAOS_MODELONEGOCIO_ANALISIS.md
│   ├── LICENSE_AUDIT_ASIMILACIONES.md
│   └── PROMPT_NARAM_SIN_11_PASOS.md
│
└── src/core/
    ├── lib/
    │   ├── tq.ts
    │   └── alrac.ts
    ├── state/
    │   ├── alrac.ts
    │   ├── caas.ts
    │   └── store.ts
    └── hooks/
        └── alrac.ts
```

---

## ✅ Validación Cruzada

| Verificación | Estado |
|--------------|--------|
| Todas las specs tienen header estándar (capa, versión, fecha, autor) | ✅ |
| Referencias cruzadas entre specs funcionan | ✅ |
| TypeScript interfaces consistentes con specs | ✅ (core lib/state) |
| Principio Anfibio documentado en specs relevantes | ✅ (CaaS, ZNU, Fiat) |
| Gobernanza 1a1v/CDS consistente | ✅ (Governance + Membership) |
| Reparto Amid 35/35/30 en specs económicas | ✅ (Revenue, CaaS, Membership) |
| γ-CARMIS/Postulado 4 referenciados | ✅ (Architecture, ZNU, Governance) |

---

## 📝 Notas de Mantenimiento

1. **Versionado:** Cada spec tiene `version: 1.0` - incrementar en cambios breaking
2. **Authorship:** Originales = humano+asistente; Nuevas = @alrac-coordinator (simulación)
3. **Ubicación:** Todas en `openspec/specs/` - no mover sin actualizar referencias
4. **Índice:** Este archivo se actualiza con cada nueva spec
5. **Git:** Commits atómicos por spec o batch lógico