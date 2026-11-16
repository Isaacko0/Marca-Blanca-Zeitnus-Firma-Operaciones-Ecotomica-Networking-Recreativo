# BACKUP: HILLCLIMB — HILLCLIMBING EN RECOMPENSAS VERIFICABLES PARA HSCSG/ZEITNUS

**Fecha asimilación:** 2026-11-09  
**Fuente:** https://github.com/rebase-energy/hillclimb (MIT License)  
**Metodología:** HSCSG v15 OS — 4 Fases + Sistema Alráico (G1-CARMIS)  
**Licencia:** MIT — compatible con open source HSCSG

---

## 1. QUÉ ES HILLCLIMB (RESUMEN TÉCNICO)

**hillclimb** = framework para **búsqueda de programas autónoma** que optimizan una **recompensa verificable** (score definido por el usuario).

| Componente | Descripción |
|------------|-------------|
| **Engine** | Núcleo Python que ejecuta búsquedas, gestiona runs, compara candidatos |
| **Problems** | Definición de tarea + **verificador** (función que retorna score 0-1 o float) |
| **Climbers** | Algoritmos de optimización: `greedy`, `gepa` (GEPA), `openevolve` (OpenEvolve), `random` |
| **Experiments** | Comparación controlada de múltiples climbers en mismo problem |
| **Catalog** | Problemas y climbers empaquetados en wheel (`hillclimb/_catalog/`) |
| **CLI + SDK** | `hillclimb run`, `hillclimb climber get`, `hc.run()` desde Python |

**Filosofía:** "Hillclimbing on verifiable rewards" — el score no es proxy, es **verificable** (código que se ejecuta y retorna métrica real).

---

## 2. MAPEO CONCEPTUAL HILLCLIMB ↔ HSCSG/ZEITNUS

| Concepto Hillclimb | Traducción HSCSG | Módulo/Sección |
|--------------------|------------------|----------------|
| **Verifiable Reward** | **Métrica Verificable** (CAC, ξ, FSI, IVC, PGS, realDependencyIndex) | `metrics.ts`, `entropicAuditor.ts`, `foodSovereigntyIndex.ts` |
| **Problem** | **Objetivo de Optimización** (ej: maximizar FSI, minimizar realDependencyIndex) | Hoja de Ruta §10, Objetivos por Fase |
| **Verifier** | **Auditoría** (SVD v2, Evidence Model, EntropicAuditor, CDS_Jurados) | `entropicAuditor.ts`, `evidence.ts`, `cds_jurados.ts` |
| **Climber** | **Estrategia de Optimización** (Autómata E²R, MILP, Heurísticas, GEPA) | `automaton.ts` (E²R), `nutritionalOptimizer.ts` (MILP) |
| **Experiment** | **Validación Empírica** (Fase 0 Proto-CO: 10 casos beta, 90 días) | Hoja de Ruta §10 Fase 0 |
| **Program Search** | **Síntesis de Código** (generar módulos FABSHIP, optimizadores, auditores) | Bloque 4 implementación |
| **Noise Band** | **Incertidumbre Soberana (σᵤ)** — varianza natural del score | `metrics.ts` (σᵤ) |
| **Champion** | **Mejor Candidato Verificado** (módulo deployado en producción) | Pipeline deploy + RAO |

---

## 3. FORMAS CONCRETAS EN QUE HILLCLIMB AYUDA A ZEITNUS MARCA BLANCA

### 3.1 Optimización Automática de Módulos Existentes (P0)
```python
# Ejemplo: Optimizar nutritionalOptimizer.ts MILP weights
# Problem: maximize FSI subject to ξ > 0.1, cycleClosure > 0.8
# Verifier: run nutritionalOptimizer → compute FSI + ξ → return score
# Climber: gepa (evolutionary prompt optimization) o openevolve (code evolution)
```

| Módulo HSCSG | Objetivo Optimización | Verificador (Reward) |
|--------------|----------------------|---------------------|
| `nutritionalOptimizer.ts` | Maximizar FSI + ξ | `entropicAuditor.ts` + `foodSovereigntyIndex.ts` |
| `entropicAuditor.ts` | Minimizar falsos positivos/negativos ξ | SVD v2 ground truth + CDS_Jurados review |
| `automaton.ts` (E²R) | Maximizar ΔAUT/costo, minimizar MJ Gate failures | `metrics.ts` (CAC, realDependencyIndex) |
| `fabshepNutricia.ts` | Maximizar nutritionalYield/kg input, minimizar energy | `nutritionalOptimizer.ts` + `entropicAuditor.ts` |
| `bioclimaticHabitat.ts` | Maximizar comfort passivo (0 energía activa) | SVD v2 sensors (temp, HR, CO2) |
| `evidence.ts` | Maximizar VERIFIED rate, minimizar contradiction | CDS_Jurados human review (gold standard) |

### 3.2 Síntesis de Código para Módulos Nuevos (Bloque 4)
```python
# hillclimb puede GENERAR código, no solo optimizar parámetros
# Problem: "Generate a FABSHIP module for spirulina bioreactor that maximizes protein yield per kWh"
# Verifier: compile TypeScript → run simulation → check protein_yield_kwh > threshold
# Climber: openevolve (evolves full Python/TS programs)
```

| Módulo Por Crear | Especificación Hillclimb |
|------------------|-------------------------|
| `svd.ts` (sensores cuánticos) | Magnetómetro + QRNG + biosensores → ξ confidence > 0.85 |
| `dietaryDiversityTracker.ts` | 15 NutrientCurrentSee + ValueFlows traceability |
| `nutriciaNegantropicaOrchestrator.ts` | runEpoch() integra 5 subsistemas + auditoría + gobernanza |
| `foodSovereigntyIndex.ts` | FSI 10 componentes + targets por fase + Evidence Model |

### 3.3 Validación Empírica Estructurada (Fase 0 Proto-CO)
```yaml
# experiments/proto_co_validation.yaml
problem: "Validate HSCSG Phase 0: 10 beta cases, 90 days, FSI > 30, ξ > 0"
climbers:
  - greedy (baseline: manual deployment)
  - gepa (optimiza prompts de onboarding Colaberry)
  - openevolve (evoluciona deployment scripts)
verifier: |
  def verify(run_id):
      metrics = collect_90_day_metrics(run_id)
      return {
          'FSI': metrics.FSI,
          'xi': metrics.xi, 
          'realDependencyIndex': metrics.realDependencyIndex,
          'servitude_reduction': metrics.servitude_and_death_reduction
      }
budget: max_evaluations=10 (one per beta case)
```

### 3.4 Búsqueda de Políticas de Gobernanza (CDS + Symbiosky)
```python
# Problem: Find CDS_Jurados weights (W_i) that maximize governance quality
# Verifier: simulate 1000 governance decisions → measure:
#   - decision_reversal_rate (low = good)
#   - evidence_VERIFIED_rate (high = good)  
#   - capture_events (matrioska violations = bad)
#   - autonomy_growth (ΔCAC over time)
```

### 3.5 Optimización de Experimento €30/72h (Zeitnus v15.1)
```python
# Problem: Optimize Kit 72H v2.0 for Spirulina handshake validation
# Variables: container_volume, LED_spectrum, sensor_type, Spirulina_strain, protocol_steps
# Verifier: run 72h experiment → check:
#   - verbalized_kwh_biomass_equivalence (binary: yes/no)
#   - biomass_growth_rate
#   - entropy_production (ξ)
# Climber: gepa (optimizes protocol text) + openevolve (optimizes hardware config)
```

---

## 4. ARQUITECTURA DE INTEGRACIÓN HILLCLIMB → HSCSG

### 4.1 Capa de Adaptación (Nueva)
```
src/hillclimb_adapter/
├── problems/           # Definiciones de problemas HSCSG como hillclimb Problems
│   ├── fsi_optimization.py
│   ├── xi_auditor_tuning.py
│   ├── automaton_e2r_params.py
│   ├── fabshep_module_design.py
│   ├── governance_policy_search.py
│   └── proto_co_validation.py
├── verifiers/          # Verificadores que usan infraestructura HSCSG
│   ├── fsi_verifier.py          # Llama foodSovereigntyIndex.ts + entropicAuditor.ts
│   ├── xi_verifier.py           # Llama entropicAuditor.ts + SVD v2
│   ├── cac_verifier.py          # Llama metrics.ts + realDependencyIndex
│   ├── servitude_verifier.py    # Combina CAC + ξ + FSI + mortality proxy
│   └── matrioska_verifier.py    # Llama boundaries.ts detectMatrioskaCapture()
├── climbers/           # Configuraciones de climbers para HSCSG
│   ├── gepa_hscsg.yaml      # GEPA con prompts específicos HSCSG
│   ├── openevolve_hscsg.yaml # OpenEvolve con TypeScript support
│   └── custom_automaton.py  # Climber que usa Autómata E²R nativo
├── sdk/                # Python SDK para lanzar desde HSCSG
│   ├── run_experiment.py
│   ├── compare_climbers.py
│   └── promote_champion.py
└── catalog/            # Catálogo hillclimb extendido con problemas HSCSG
    ├── problems/
    └── climbers/
```

### 4.2 Flujo de Trabajo Integrado
```
1. HSCSG define objetivo (ej: "FSI > 65 en Fase B")
   ↓
2. hillclimb_adapter crea Problem + Verifier
   ↓
3. Selecciona Climber (gepa/openevolve/automaton)
   ↓
4. hillclimb run --budget max_evaluations=50
   ↓
5. Engine ejecuta búsqueda autónoma:
   - Genera candidatos (código/parámetros)
   - Ejecuta verifier (llama módulos HSCSG via TypeScript/Python bridge)
   - Obtiene score verificable
   - Evoluciona/mejora
   ↓
6. Champion promovido → deploy en HSCSG (PR + RAO + RAO audit)
   ↓
7. Métricas reales en producción retroalimentan siguiente experimento
```

---

## 5. VENTAJAS ESTRATÉGICAS PARA ZEITNUS MARCA BLANCA

| Ventaja | Descripción | Impacto HSCSG |
|---------|-------------|---------------|
| **Optimización Continua** | Hillclimb corre 24/7 mejorando módulos | Módulos evolucionan sin intervención manual |
| **Verificación Real** | Scores no son proxy, son métricas HSCSG ejecutadas | Elimina Goodhart's Law ("cuando una métrica se vuelve objetivo...") |
| **Síntesis de Código** | Genera TypeScript/Python para módulos nuevos | Acelera Bloque 4 (9 módulos P0) 10x |
| **Comparación Científica** | Experiments = A/B testing riguroso de climbers | Decisiones EBD basadas en evidencia empírica |
| **Alineación Autómata** | Autómata E²R = climber nativo HSCSG | Coherencia arquitectónica total |
| **Open Source** | MIT license, community-driven | Compatible con "open source por arquitectura" (IAU-D10) |
| **Reproducibilidad** | Runs deterministas, seeds, config YAML | Trazabilidad RAO completa |

---

## 6. RIESGOS Y MITIGACIONES

| Riesgo | Mitigación HSCSG |
|--------|------------------|
| **Reward Hacking** (optimizar score sin mejorar realidad) | Verifiers usan **múltiples métricas compuestas** (FSI + ξ + CAC + σᵤ) + **Evidence Model** (Fact Bands) + **CDS_Jurados** review |
| **Overfitting a Benchmarks** | Experiments requieren **validación en producción** (Fase 0 Proto-CO 10 casos beta reales) |
| **Costo Computacional** | Budget controlado (`max_evaluations`), climbers eficientes (greedy baseline), run en infraestructura FABSHIP local |
| **Dependencia Externa** | Hillclimb MIT license → **fork propio** en `Isaacko0/hillclimb-hscsg` (soberanía tecnológica IAU-D20) |
| **Complejidad Integración** | Adapter layer delgado, TypeScript ↔ Python bridge via `child_process` o WASM |

---

## 7. PRÓXIMOS PASOS (SECUENCIA ESTRICTA)

1. **Fork hillclimb** → `Isaacko0/hillclimb-hscsg` (soberanía)
2. **Crear `src/hillclimb_adapter/`** con 6 problems + 5 verifiers + 3 climbers config
3. **Primer experimento:** `fsi_optimization` en `nutritionalOptimizer.ts` (budget: 20 evals)
4. **Validar champion** → deploy en HSCSG → medir FSI real en caso beta
5. **Escalar a 6 problems paralelos** (FSI, ξ, CAC, Automaton, FABSHIP, Gobernanza)
6. **Integrar en Autómata Soberano** como climber nativo (`AutomatonE2RClimber`)
7. **Documentar en BRIEF_EXHAUSTIVO v2.2** §23 "Hillclimb Integration"

---

## 8. REFERENCIAS

```
[H1] hillclimb GitHub: https://github.com/rebase-energy/hillclimb (MIT License)
[H2] Documentation: https://docs.hillclimb.sh/
[H3] GEPA Paper: "GEPA: Genetic-Pareto Optimization for Prompt Engineering" (2024)
[H4] OpenEvolve: "Open-Ended Evolution for Code Generation" (2024)
[H5] HSCSG v15 OS: TQ, ZNU, ξ, FSI, Evidence Model, CDS_Jurados, Autómata E²R, FABSHIP
```

---

**Nota:** Hillclimb es **herramienta de optimización verificable**, no AGI. Su poder está en la **búsqueda dirigida por métricas reales HSCSG**. La integración respeta soberanía: fork propio, verifiers locales, sin dependencia cloud.