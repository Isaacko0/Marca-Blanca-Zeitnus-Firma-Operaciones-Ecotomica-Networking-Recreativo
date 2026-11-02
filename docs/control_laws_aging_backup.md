# Backup FASE 1 — Control Laws in Aging and Longevity (Zhavoronkov & Mishra, 2026)

**Fuente:** `Control Laws in Aging and Longevity.pdf` (86,915 chars, ~1,500 líneas)
**Autores:** Alex Zhavoronkov (Insilico Medicine, Buck Institute) + Bud Mishra (NYU Courant)
**Fecha:** 7 julio 2026 | Target journal: *Aging (Impact Journals)*
**Licencia:** Preprint científico — asimilación arquitectónica bajo fair use
**Hash contenido:** `sha256:control-laws-aging-20261029`

---

## Resumen ejecutivo

Este paper propone un **marco control-teórico de la aging** que transforma la biología del envejecimiento de descriptiva a **prescriptiva**: define *qué intervención, a qué dosis y secuencia, bajo qué restricciones de seguridad, restaurará un estado biológico medido a una región funcional*. 

**Contribución central:** 
- **Aging = pérdida progresiva de controlabilidad segura**
- **Biological age = costo mínimo de control seguro de restauración funcional**
- **Drugs = vector fields en state space biológico** (no conmutativos → Lie brackets predicen que el orden determina outcome)

El framework produce: ranked targets, secuencias óptimas, protocolos safety-constrained, predicciones falsificables — directamente usables en drug discovery geroterapéutico.

---

## Arquitectura teórica completa

### 1. State Space Biológico (Biological State Space)
- **Latent state vector** `x(t) ∈ Rⁿ`: cell population, tissue, organ, subsystem, organism
- **Observation model:** `y(t) = h(x(t)) + ε(t)` — proyecciones ruidosas (transcriptomics, proteomics, metabolomics, epigenetics, imaging, clinical, functional)
- **Coordinates:** epigenetic, transcriptional, metabolic, mitochondrial, proteostatic, senescent, immune, regenerative, matrix, vascular, systemic-functional
- **Inferred** via structured representation learning from multi-omics + perturbational data

### 2. Functional Viability Set (Conjunto de Viabilidad Funcional)
```
V = { x : Fᵢ(x) ≥ θᵢ, ∀i }
```
- No "rejuvenecimiento" abstracto → **preservar/restaurar función segura**
- `Fᵢ`: métricas funcionales (glucose homeostasis, force generation, cognitive throughput, etc.)
- `θᵢ`: thresholds de viabilidad clínica

### 3. Dynamics & Control Inputs
- **Endogenous dynamics:** `ẋ = f(x) + w(t)` (drift + stochastic perturbations)
- **Control inputs u(t):** drugs, cell therapies, genetic perturbations, nutritional, exercise, surgery
- **Drug = vector field** `g(x)` on state space — state-dependent transformation operator
- **Non-commutativity:** `[gₐ, g_b](x) = Dg_b(x)gₐ(x) − Dgₐ(x)g_b(x)` — **Lie bracket** cuantifica que secuencia importa

### 4. Aging as Controllability Collapse
| Nivel | Descripción |
|-------|-------------|
| **Global controllability** | Reachability de cualquier estado youthful desde aged |
| **Local controllability** | Small reachable set cerca del estado actual |
| **Aging process** | Colapso progresivo: global → local → loss of even local controllability en dimensiones críticas |
| **Irreversible coordinates** | Colapsan reachable set permanentemente |

### 5. Biological Age = Minimum Safe Control Cost
```
Biological Age(x) = min_{u(·)} ∫₀ᵀ ||u(t)|| dt  s.t. x(T) ∈ V, safety constraints
```
- **Cost functional:** control effort + safety penalties + future controllability preservation
- **Value function:** V*(x) = optimal cost-to-go from state x
- **HJB equation:** `min_u { ∇V·(f+gu) + L(x,u) } = 0` con constraints

### 6. Modality-Aware Control Layer
- **Modalities:** pharmacologic, genetic, cellular, nutritional, exercise, surgical, environmental
- **Cada modality = subspace de control inputs** con constraints propios (delivery, toxicity, reversibility)
- **Cross-modality Lie brackets** → sequencing óptimo multi-modal

### 7. Five-Dimensional ODE Model (Core Demonstrator)
```
State variables (5): 
  x₁ = Epigenetic drift (methylation entropy)
  x₂ = Proteostatic collapse (misfolded protein load)  
  x₃ = Mitochondrial dysfunction (ROS/ATP ratio)
  x₄ = Senescent cell burden (SASP intensity)
  x₅ = Systemic inflammation (IL-6, TNF-α)

Dynamics: ẋ = f(x) + Σ gᵢ(x)uᵢ
Interventions (u): senolytics, epigenetic reprogramming, mitophagy inducers, proteostasis regulators, anti-inflammatories

Lie bracket derivation (analytic): [gᵢ, gⱼ] quantifies sequencing benefit
```

### 8. Implementation Architecture (Computational Pipeline)
```
1. State Inference → Multi-omics + clinical → latent x(t) (variational autoencoder / diffusion)
2. Dynamics Learning → Perturbational datasets (CRISPR, LINCS/CMap, drug-response) → f(x), gᵢ(x) (neural ODE / Koopman)
3. Viability Set Definition → Clinical thresholds Fᵢ(x) ≥ θᵢ per organ/system
4. Safety Constraints → Toxicity limits, off-target effects, irreversibility boundaries
5. Optimal Control Solver → HJB / MPC / RL → ranked targets, sequences, protocols
6. Validation → 20 falsifiable predictions + 3 translational case studies
```

### 9. Three Translational Case Studies
| Study | Condition | Interventions tested | Prediction |
|-------|-----------|---------------------|------------|
| **1. Type 2 Diabetes** | CGM-monitored glucose homeostasis | Metformin + exercise + SGLT2i sequencing | Lie bracket [exercise, metformin] > sum |
| **2. Sarcopenia** | Muscle force generation | Resistance training + senolytics + protein timing | Non-commutativity critical |
| **3. Neurodegeneration** | Cognitive throughput | Epigenetic reprogramming + mitophagy + anti-inflammatory | Irreversibility boundaries |

### 10. Twenty Falsifiable Predictions (Sample)
1. **Control-value reduction** predicts translational success better than Hallmark annotation or biomarker reversal alone
2. **Lie bracket magnitude** `[gₐ,g_b]` correlates with clinical combo superiority over monotherapy
3. **Local controllability retention** in aged tissue despite global loss → measurable via perturbation response
4. **Modality sequencing** (exercise → drug vs drug → exercise) produces measurably different state trajectories
5. **Safety-constrained optimal control** yields lower adverse event rates than greedy biomarker optimization
6. **Biological age (control cost)** correlates with functional decline better than epigenetic clocks
7. **Intervention vector field estimation** from perturbational data enables zero-shot combo prediction
... (14 more en Supplementary S1)

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto Paper | → Módulo HSCSG | Vaso comunicante |
|----------------|----------------|------------------|
| Biological state space `x(t)` | `integral.stateVector` + `caas.capacityVector` | `ingestIntegralSignal`, `toggleCapability` |
| Functional viability set `V` | `boundaries.viabilitySet` + `caas.sovereigntyFloor` | `setBoundaryPolicy`, `raiseIntegralIssue` |
| Vector fields `g(x)` (drugs) | `capacidades.interventions` + `symbiosky.proposals` | `spawnAgent` per intervention |
| Lie brackets `[gₐ,g_b]` | `agentMesh.nonCommutativity` + `automaton.sequencing` | `proposeAction` + `evaluateAction` |
| Minimum safe control cost | `caas.controlCost` + `zeitnus.dividendCost` | `runCaasPayout` + `priceParity` |
| Biological age = control cost | `caas.biologicalAge` + `poh.identityAge` | `includeHuman` + `renewIdentity` |
| Safety constraints | `boundaries.safetyConstraints` + `kleros.courtRules` | `addBoundaryRule`, `seatJuror` |
| Modality subspaces | `capacidades.modalitySpaces` + `agentCanvas.modality` | `toggleCapability` per modality |
| 5D ODE model | `integral.odeModel` + `automaton.stateEvolution` | `heartbeat` loop |
| Translational case studies | `agentCanvas.caseStudies` + `symbiosky.simulations` | `symCastVote` (simulation governance) |

---

## Decisiones de diseño EBD

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-AGE-01** | Aging = controllability loss (no damage accumulation) | Paper: "progressive collapse from global to merely local controllability" |
| **EBD-AGE-02** | Biological age = min safe control cost (no clock correlation) | Paper: "defines biological age as the minimum safe control cost required to maintain or restore function" |
| **EBD-AGE-03** | Drugs = vector fields; Lie brackets = sequencing value | Paper: "quantified by Lie brackets, predicts that intervention order determines outcome" |
| **EBD-AGE-04** | Functional viability set V = objetivo médico (no youthful ideal) | Paper: "goal of medicine is not to make every molecular feature identical to youth but to preserve or restore function safely" |
| **EBD-AGE-05** | Modality-aware control layer (subspaces + cross-brackets) | Paper: "each modality = subspace of control inputs with own constraints" |
| **EBD-AGE-06** | 5D ODE = minimal demonstrator (epigenetic, proteostatic, mitochondrial, senescent, inflammatory) | Paper: "five-dimensional ODE model with analytic Lie-bracket derivation" |
| **EBD-AGE-07** | 20 falsifiable predictions = validation contract | Paper: "twenty falsifiable predictions enumerated" |
| **EBD-AGE-08** | Control-value reduction > Hallmark annotation for translational success | Paper central claim: "control-value reduction predicts translational success better than Hallmark annotation or biomarker reversal alone" |

---

## Validaciones DV requeridas

| ID | Validación | Criterio éxito |
|----|------------|----------------|
| **DV-AGE-01** | `computeControlCost(x, V, interventions)` retorna costo mínimo + secuencia | Matches analytic solution for 5D ODE |
| **DV-AGE-02** | `lieBracket(gₐ, g_b)` cuantifica non-commutativity; signo = sequencing benefit | Positive bracket → sequence A→B better than B→A |
| **DV-AGE-03** | `estimateState(omics, clinical)` → latent x(t) con uncertainty bounds | Reconstruction error < threshold |
| **DV-AGE-04** | `defineViabilitySet(organ, clinicalThresholds)` → V convex, measurable | All Fᵢ(x) ≥ θᵢ verifiable |
| **DV-AGE-05** | `optimalSequence(interventions, V, safety)` → ranked sequences | Case study 1: exercise→metformin > metformin→exercise |
| **DV-AGE-06** | `biologicalAge(x)` = control cost; correlates with functional decline (r > 0.7) | Better than epigenetic clocks (r ~ 0.5) |
| **DV-AGE-07** | `modalitySubspace(modality)` → valid control inputs + constraints | No cross-modality contamination |
| **DV-AGE-08** | `simulateCaseStudy(case, protocol)` → state trajectory matches clinical data | T2D CGM: glucose time-in-range improvement predicted |

---

## Estructura de archivos FASE 3 propuesta

```
src/core/lib/aging-control.ts           # Lógica pura: stateSpace, vectorFields, lieBracket, viabilitySet, controlCost, optimalControl
src/core/lib/aging-ode.ts               # 5D ODE model + analytic Lie brackets
src/core/lib/aging-modalities.ts        # Modality subspaces, cross-modality brackets
src/core/lib/aging-case-studies.ts      # 3 translational case studies (T2D, sarcopenia, neurodegeneration)
src/core/lib/aging-predictions.ts       # 20 falsifiable predictions as testable predicates
src/core/state/aging.ts                 # Tipos: StateVector, VectorField, ViabilitySet, ControlCost, Modality, CaseStudy
src/core/state/hooks/aging.ts           # Selectores: useControlCost, useOptimalSequence, useBiologicalAge
src/core/state/store.ts                 # Integración: aging slice + actions + partialize
src/app/screens/AgingControl.tsx        # Pantalla: State Inference, Dynamics, Viability, Control, Predictions, Case Studies
src/app/layout/Aside.tsx                # Nav "Aging Control" + Route "/aging-control"
skills/aging-control/                   # 5 skills: state-inference, dynamics-learning, control-design, case-study, validation
```

---

## Conexión con RBE (Renta Básica Exponencial) y ALRAC

El framework proporciona **base científica cuantitativa** para:
- **RBE Capa 3 (Dividendo de los comunes):** `controlCost` savings → `commonsReturn` distribuible
- **RBE Capa 5 (Coordinación Zeitnus/ALRAC):** `biologicalAge` como input a `zeitnus.dividendPolicy`
- **ALRAC Nodos federados:** Cada nodo = `viabilitySet` local + `controlCost` budget
- **TQ Ledger:** `controlCost` en unidades energéticas (kWh) → `priceParity` oracle

---

## Próximos pasos

1. **FASE 3 core** — `aging-control.ts` (lógica pura completa)
2. **FASE 3 ODE** — `aging-ode.ts` con 5 variables + Lie brackets analíticos
3. **FASE 3 Modalities** — 6 subspaces + cross-brackets
4. **FASE 3 Case Studies** — 3 simulaciones ejecutables
5. **FASE 3 Predictions** — 20 predicates testables
6. **Pantalla AgingControl** — 6 tabs
7. **Skills** — 5 skills auto-ejecutables