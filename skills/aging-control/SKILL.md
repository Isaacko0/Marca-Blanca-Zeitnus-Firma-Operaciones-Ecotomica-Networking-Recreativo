---
name: aging-control
description: Use when implementing Control Laws in Aging & Longevity (Zhavoronkov & Mishra 2025) in HSCSG v15 OS. Provides 5D state control, Lie bracket analysis, optimal intervention trajectories, and amphibious cost computation.
category: science
---

# Skill: Control Laws in Aging & Longevity (aging-control)

**Paper**: Zhavoronkov & Mishra (2025) — arXiv:2406.04257v2
**Module**: `src/core/lib/aging-control.ts` + `src/core/state/aging-control.ts` + `src/app/screens/AgingControl.tsx`

## Capabilities

- **5D Physiological State Control**: [age, bioAge, healthCapital, damageLoad, interventionCapacity]
- **Lie Bracket Commutation Analysis**: `[f, g]` for intervention ordering
- **Optimal Control via PMP**: Pontryagin's Maximum Principle solver
- **Canonical Interventions**: 7 built-in (metformin, rapamycin, senolytic, exercise, CR, combos)
- **Case Studies**: 3 scenarios (healthy 40, pre-frail 60, preventive 30)
- **Amphibious Cost**: Postmonetario (abstract units) ↔ Conectado (ZNU via priceParity)

## Key Functions (from `lib/aging-control.ts`)

```typescript
// Core dynamics
agingDrift(x) → number[]                    // Uncontrolled aging vector field f(x)
interventionControlVector(i, x) → number[]  // Control vector g_i(x) for intervention i
computeLieBracket(f, g, x) → number[][]     // Commutation [f, g]_ij

// Optimal control
computeOptimalControl(x0, interventions, config) → { controls, trajectory, cost }
simulateTrajectory(x0, controls, interventions) → trajectory
computeTotalControlCost(trajectory, interventions, config) → ControlCost
computeLifespanMetrics(trajectory) → { lifespan, healthspan }

// Case studies
runCaseStudies(config) → CaseStudyResult[]

// Amphibious conversion
convertCost(cost, priceParity, toZNU) → ControlCost
```

## State Shape (`state/aging-control.ts`)

```typescript
interface AgingControlState {
  config: AgingControlConfig
  interventions: Intervention[]
  selectedInterventionIds: InterventionId[]
  initialState: number[]  // [age, bioAge, healthCapital, damageLoad, interventionCapacity]
  trajectory: { state: number[]; controls: number[] }[] | null
  optimalControls: number[][] | null
  caseStudies: CaseStudyResult[] | null
  lastCost: ControlCost | null
  lifespanMetrics: LifespanMetrics | null
}
```

## Screen Tabs (`app/screens/AgingControl.tsx`)

| Tab | Purpose |
|-----|---------|
| **Configurar** | Horizonte, tasa descuento, tolerancia, modo anfibio, estado inicial |
| **Intervenciones** | Seleccionar/crear intervenciones (7 canónicas + custom) |
| **Simular** | Forward Euler trajectory con controles fijos |
| **Optimizar** | PMP solver para control óptimo |
| **Casos** | 3 casos canónicos del paper |

## Amphibious Mode (Principio Anfibio)

```typescript
// Postmonetario: costes en unidades abstractas
mode: 'postmonetario'
// Conectado: costes económicos convertidos a ZNU via priceParity
mode: 'conectado', priceParity: 100  // 1 USD = 100 ZNU
```

La lógica de control es **idéntica**; solo cambia la unidad del coste económico.

## Hooks (`state/hooks/aging-control.ts`)

```typescript
useAgingControlConfig     // config + setConfig, setMode
useSelectedInterventions  // array of Intervention objects
useInitialState           // [5] number array
useTrajectory             // simulated trajectory
useOptimalControls        // optimal control sequence
useCaseStudies            // case study results
useLastCost               // ControlCost breakdown
useLifespanMetrics        // lifespan/healthspan gains
useAgingControlActions    // { computeTrajectory, computeOptimal, runCaseStudies, ... }
```

## Integration Points

| HSCSG Module | Connection |
|--------------|------------|
| `caas.controlCost` | `runCaasPayout` + `priceParity` oracle |
| `zeitnus.dividendCost` | Biological age → dividend adjustment |
| `boundaries.safetyConstraints` | Viability kernel = safety boundary |
| `integral.stigmergicSignals` | Damage load signals → intervention triggers |
| `symbiosky.reputation` | Intervention adherence → credibility |

## Validation (DV)

| ID | Test | Success Criteria |
|----|------|------------------|
| DV-AGING-01 | `agingDrift([40,38,0.85,10,0.9])` | Returns 5D vector, bioAge > age |
| DV-AGING-02 | `computeLieBracket(f, g_metformin, x0)` | 5×5 matrix, non-zero entries |
| DV-AGING-03 | `simulateTrajectory(x0, controls, [metformin])` | 301 steps, bioAge < uncontrolled |
| DV-AGING-04 | `computeOptimalControl(x0_40, [combo_standard])` | lifespanGain > 5 years, cost < 1000 |
| DV-AGING-05 | `runCaseStudies(conservative)` | 3 studies, all feasible.economic=true |
| DV-AGING-06 | `convertCost(cost, 100, true).economic` | ≈ cost.economic × 100 |
| DV-AGING-07 | `isViable([40,38,0.85,10,0.9])` | true |
| DV-AGING-08 | `isViable([40,160,0.85,10,0.9])` | false (bioAge > 150) |

## Usage in Agents

```typescript
// Spawn agent for aging control optimization
spawnAgent({
  role: 'aging-optimizer',
  task: 'Compute optimal intervention stack for 55yo with bioAge 62',
  tools: ['aging-control.computeOptimal', 'caas.runCaasPayout'],
  constraints: { maxCost: 5000, mode: 'conectado' }
})
```

## Files to Modify

| File | Purpose |
|------|---------|
| `src/core/lib/aging-control.ts` | Pure logic (no side effects) |
| `src/core/state/aging-control.ts` | Types + `makeAgingControlState()` |
| `src/core/state/hooks/aging-control.ts` | Zustand selectors |
| `src/app/screens/AgingControl.tsx` | 5-tab React screen |
| `src/app/layout/Aside.tsx` | Nav item `agingControl` |
| `src/core/lib/i18n.ts` | ES/EN/PT labels |
| `src/core/state/store.ts` | Slice + persist + actions |

## OpenSpec

```yaml
# openspec/specs/aging-control/
module: aging-control
endpoints:
  /viability: GET
  /trajectory: POST
  /optimize: POST
  /case-studies: GET
  /cost: POST
```

## References

- **Paper**: Zhavoronkov A, Mishra A. "Control Laws in Aging and Longevity" (2025)
- **Math**: Pontryagin's Maximum Principle, Hamilton-Jacobi-Bellman, Lie brackets
- **Code**: Pure TypeScript, zero deps, offline-first
- **Vault**: `HSCSG/Control Laws in Aging and Longevity.md` (analysis notes)