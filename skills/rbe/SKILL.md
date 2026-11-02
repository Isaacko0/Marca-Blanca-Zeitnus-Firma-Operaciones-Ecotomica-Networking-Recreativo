---
name: rbe
description: Use when implementing Renta Básica Exponencial (RBE) in HSCSG v15 OS. Provides 5-layer universal dividend, 3-budget accounting, growth controller, and TQ Ledger with amphibious mode.
category: economics
---

# Skill: Renta Básica Exponencial (RBE)

**Documento base**: `Renta_Basica_Exponencial_Zeitnus_ALRAC.md` (v0.1, 29 oct 2026)
**Módulo**: `src/core/lib/rbe.ts` + `src/core/state/rbe.ts` + `src/app/screens/RBE.tsx`
**Principio**: Anfibio (postmonetario ↔ conectado via priceParity)

## Capabilities

- **5 Capas de Dividendo Universal**:
  - Capa A: Piso universal fijo (100 ZNU/mes, todos humanos verificados PoH)
  - Capa B: Capacidad regenerativa variable (base 50 ZNU × multiplicador capacidad)
  - Capa C: Contribución verificada (base 30 ZNU, umbral mínimo 10)
  - Capa D: Participación en gobernanza (base 20 ZNU, score participación)
  - Capa E: Innovación/especulativo (pool 1000 ZNU, quadratic funding)

- **3 Presupuestos (Contabilidad Triple)**:
  - Monetario (ZNU/USD)
  - Real/Biofísico (kWh, ha, materiales)
  - Ecológico (kgCO₂, especies, regeneración)

- **Growth Controller**: Tasa de crecimiento exponencial compuesta sujeta a límites biofísicos
  - Tasa base: 5% anual, techo 20%, piso 1%
  - Umbral de capacidad regenerativa: 0.6
  - Verificación via oráculo externo

- **TQ Ledger**: Transducción Quántica (Capa 1 ALRAC)
  - Balance inicial: 1000 ZNU/miembro
  - Demurrage: 5% anual, threshold 30 días
  - Ice/Ecoinvent catalog integration
  - NFC offline support

- **Modo Anfibio**: Postmonetario (ZNU abstractos) ↔ Conectado (USD/ZNU via priceParity oráculo ReFi Nivel 3)

## Key Functions (from `lib/rbe.ts`)

```typescript
// Core dividend calculation
calculateTotalDividend(state, memberId, pohVerified) → { total, breakdown: {A,B,C,D,E} }

// Monthly payout processing
processMonthlyPayout(state, members, pohVerifiedMap, config) → { newState, payouts }

// Growth controller update
updateGrowthController(state, capacityIndex, config) → newState

// Layer operations
addCapacityContribution(state, contribution) → newState      // Layer B
addVerifiedContribution(state, contribution) → newState      // Layer C
addGovernanceActivity(state, activity) → newState            // Layer D
proposeInnovationProject(state, project) → newState          // Layer E
fundInnovationProject(state, projectId, amount, contributor) → newState

// Three-budget accounting
transferBetweenBudgets(state, fromLayer, toBudget, amount, description) → newState

// TQ Ledger
applyDemurrage(state, config) → newState
convertAmount(amount, fromMode, toMode, priceParity) → number
```

## State Shape (`state/rbe.ts`)

```typescript
interface RBEState {
  layerA: LayerAState        // floor, eligibility, frequency, lastPayout, distributed
  layerB: LayerBState        // baseAmount, capacityMultiplier, capacityIndex, contributions[]
  layerC: LayerCState        // baseAmount, contributionIndex, contributions[], minThreshold
  layerD: LayerDState        // baseAmount, participationScore, activities[], minParticipation
  layerE: LayerEState        // pool, projects[], allocation
  budgets: ThreeBudgetsState // monetary, real, ecological
  growth: GrowthState        // currentRate, targetRate, capacityIndex, verified, history[]
  tq: TQState                // balances Map, demurrageSchedule, transactions[], iceCache
}
```

## Screen Tabs (`app/screens/RBE.tsx`)

| Tab | Purpose |
|-----|---------|
| **Resumen** | KPIs globales, vista rápida 5 capas, growth, TQ, último pago |
| **Capas (A-E)** | Editor por capa: A config, B contribuciones, C verificadas, D gobernanza, E proyectos |
| **3 Presupuestos** | Tarjetas monetario/real/ecológico + transferencias entre presupuestos |
| **Control Crecimiento** | Parámetros growth controller + actualizador índice capacidad + historial |
| **TQ Ledger** | Balances, supply total, transacciones, demurrage, convertidor anfibio |
| **Pago Mensual** | Simulador pago masivo, desglose por capa, resultados último pago |
| **Configurar** | Presets, modo anfibio, priceParity, parámetros de capas |

## Amphibious Mode (Principio Anfibio)

```typescript
// Postmonetario: costes/dividendos en ZNU abstractos
mode: 'postmonetario'

// Conectado: dividendos económicos convertidos a ZNU via priceParity
mode: 'conectado', priceParity: 100  // 1 USD = 100 ZNU (oráculo ReFi Nivel 3)
```

La lógica del dividendo es **idéntica**; solo cambia la unidad de cuenta económica.

## Hooks (`state/hooks/rbe.ts`)

```typescript
useRBEConfig        // config + setConfig, setMode, applyPreset
useRBEMode          // current mode
useLayerA..E        // each layer state
useBudgets          // three budgets
useGrowth           // growth controller state
useTQ               // TQ ledger state
usePohVerified      // PoH verified map
useMemberDividends  // cached dividend calculations
useLastPayout       // last monthly payout results
useRBEActions       // all mutation actions
useDividend(memberId) // selector for specific member
```

## Integration Points

| HSCSG Module | Connection |
|--------------|------------|
| `poh.identities` | `includeHuman` gate para elegibilidad Capa A |
| `caas.runCaasPayout` | `processMonthlyPayout` integra con CaaS revenue share |
| `zeitnus.dividendPolicy` | Growth controller ↔ dividend cost adjustment |
| `boundaries.safetyConstraints` | Growth controller capacity threshold = safety boundary |
| `symbiosky.reputation` | Layer D participation → credibility score |
| `integral.stigmergicSignals` | Capacity contributions → stigmergic signals |
| `agentCanvas.spawnAgent` | Growth controller optimizer agent |
| `alrac.universalDividend` | OpenSpec `alrac-universal-dividend` integration |

## Validation (DV)

| ID | Test | Success Criteria |
|----|------|------------------|
| DV-RBE-01 | `calculateTotalDividend(state, memberId, true)` | Returns breakdown with A=100, B≈50, C=30, D=20, E=variable |
| DV-RBE-02 | `calculateTotalDividend(state, memberId, false)` | Returns total=0 (PoH gate) |
| DV-RBE-03 | `processMonthlyPayout(members)` | Updates TQ balances, records transactions, updates layerA.lastPayout |
| DV-RBE-04 | `updateGrowthController(0.8)` | rate > baseRate (excess capacity → accelerated growth) |
| DV-RBE-05 | `updateGrowthController(0.2)` | rate = minRate (deficit → minimal growth) |
| DV-RBE-06 | `transferBetweenBudgets('B', 'real', 100, 'desc')` | monetary.spent+=100, real.allocated+=100 |
| DV-RBE-07 | `applyDemurrage()` | Balances > threshold reduced by daily rate, tx type='demurrage' |
| DV-RBE-08 | `convertAmount(100, 'conectado', 'postmonetario', 100)` | Returns 10000 (100 USD = 10000 ZNU) |
| DV-RBE-09 | `addCapacityContribution(member, 'ecological', 1000)` | LayerB.contributions.length++, capacityIndex updated |
| DV-RBE-10 | `fundInnovationProject(projId, 500, member)` | LayerE.pool-=500, project.allocated+=500, status→funded |

## Usage in Agents

```typescript
// Spawn agent for growth optimization
spawnAgent({
  role: 'growth-optimizer',
  task: 'Maximize regenerative capacity index while keeping growth rate < 15%',
  tools: ['rbe.updateGrowthController', 'rbe.addCapacityContribution', 'caas.runCaasPayout'],
  constraints: { maxGrowthRate: 0.15, minCapacityIndex: 0.6 }
})

// Monthly payout automation
spawnAgent({
  role: 'rbe-payout',
  schedule: 'monthly',
  task: 'Process RBE monthly payout for all PoH-verified members',
  tools: ['rbe.processMonthlyPayout', 'poh.identities'],
  constraints: { verifyPoH: true }
})
```

## Files to Modify

| File | Purpose |
|------|---------|
| `src/core/lib/rbe.ts` | Pure logic (no side effects) |
| `src/core/state/rbe.ts` | Types + `makeRBEState()` |
| `src/core/state/hooks/rbe.ts` | Zustand selectors |
| `src/app/screens/RBE.tsx` | 7-tab React screen |
| `src/app/layout/Aside.tsx` | Nav item `rbe` |
| `src/core/lib/i18n.ts` | ES/EN/PT labels |
| `src/core/state/store.ts` | Slice + persist + actions |

## OpenSpec

```yaml
# openspec/specs/rbe/
module: rbe
endpoints:
  /dividend/{memberId}: GET
  /payout/monthly: POST
  /growth/update: POST
  /layer/B/contribution: POST
  /layer/C/contribution: POST
  /layer/D/activity: POST
  /layer/E/project: POST
  /layer/E/fund: POST
  /budgets/transfer: POST
  /tq/demurrage: POST
  /tq/balance/{memberId}: GET
  /convert: POST
```

## References

- **Paper base**: `Renta_Basica_Exponencial_Zeitnus_ALRAC.md` (5 capas, 3 presupuestos, growth controller, TQ Ledger)
- **ALRAC integration**: `ALRAC_MASTER_INTEGRADO.md` → OpenSpec `alrac-universal-dividend`
- **Zeitnus model**: `ZEITNUS_REGENERATIVE_MODEL.md` → 3 presupuestos, growth controller
- **Vault**: `HSCSG/Renta_Basica_Exponencial.md` (análisis detallado)