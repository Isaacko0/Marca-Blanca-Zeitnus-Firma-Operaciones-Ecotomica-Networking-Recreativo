# INTEGRACIÓN: HILLCLIMB → HSCSG/ZEITNUS MARCA BLANCA (Optimización Verificable Autónoma)

**Fecha:** 2026-11-09  
**Fuente:** `docs/hillclimb_backup.md` (163ª integración)  
**Metodología:** EBD (Evidence-Based Design) — Cada decisión trazable a fuente hillclimb + necesidades HSCSG  
**Licencia:** MIT (hillclimb) → Fork propio `Isaacko0/hillclimb-hscsg` (soberanía IAU-D20)

---

## 1. DECISIONES EBD (Evidence-Based Design) — HILLCLIMB INTEGRATION

| ID | Decisión | Justificación (Fuente) | Módulo Afectado | Prioridad |
|----|----------|------------------------|-----------------|-----------|
| **HCL-D1** | **Hillclimb = Motor de Optimización Verificable Oficial HSCSG** | hillclimb: "hillclimbing on verifiable rewards" + HSCSG: métricas verificables (CAC, ξ, FSI, IVC) | `src/hillclimb_adapter/` (nuevo) | **P0** |
| **HCL-D2** | **Fork Propio `Isaacko0/hillclimb-hscsg` (Soberanía Tecnológica IAU-D20)** | hillclimb MIT license + HSCSG regla: "soberanía tecnológica, no vendor lock-in" | GitHub fork + `src/hillclimb_adapter/` | **P0** |
| **HCL-D3** | **Problems HSCSG = Objetivos de Optimización con Verificadores Reales** | hillclimb Problems + Verifiers = HSCSG métricas ejecutables (no proxies) | `hillclimb_adapter/problems/` + `verifiers/` | **P0** |
| **HCL-D4** | **6 Problems Iniciales: FSI, ξ, CAC, Automaton, FABSHIP, Gobernanza** | Mapeo directo: cada problem ↔ métrica HSCSG crítica | `problems/fsi_optimization.py`, `xi_auditor_tuning.py`, etc. | **P0** |
| **HCL-D5** | **Verifiers = Llamadas Reales a Módulos HSCSG (TypeScript/Python Bridge)** | hillclimb verifiers ejecutan código real → scores verificables (anti-Goodhart) | `verifiers/*.py` → `child_process` TypeScript | **P0** |
| **HCL-D6** | **3 Climbers: GEPA (prompts), OpenEvolve (código), AutomatonE2R (nativo)** | GEPA para prompts, OpenEvolve para síntesis código, E²R nativo = coherencia | `climbers/gepa_hscsg.yaml`, `openevolve_hscsg.yaml`, `custom_automaton.py` | **P0** |
| **HCL-D7** | **Experimento Proto-CO = Validación Empírica Hillclimb (10 casos beta)** | hillclimb Experiments + HSCSG Fase 0 Proto-CO = validación científica rigurosa | `experiments/proto_co_validation.yaml` | **P0** |
| **HCL-D8** | **Anti-Reward Hacking: Verifiers Multi-Métrica + Evidence Model + CDS_Jurados** | hillclimb reward hacking risk + HSCSG: FSI+ξ+CAC+σᵤ + Fact Bands + CDS review | `verifiers/*.py` (composite scores) | **P0** |
| **HCL-D9** | **Síntesis de Código para Bloque 4 (9 módulos P0) via OpenEvolve** | hillclimb program synthesis + HSCSG Bloque 4 pendiente = aceleración 10x | `problems/fabshep_module_design.py` + `openevolve` | **P0** |
| **HCL-D10** | **Autómata E²R = Climber Nativo HSCSG (Coherencia Arquitectónica)** | Autómata Soberano ya implementa E²R Search = hillclimber natural | `custom_automaton.py` wrapper | **P0** |
| **HCL-D11** | **Champion Deployment = PR + RAO Audit + Production Metrics Feedback Loop** | hillclimb promotes champion → HSCSG: deploy verificado + métricas reales retroalimentan | `sdk/promote_champion.py` + RAO | **P0** |
| **HCL-D12** | **Budget Control: max_evaluations por Experimento (Costo Computacional Acotado)** | hillclimb budget flags + HSCSG: recursos FABSHIP locales, no cloud dependency | `runs/config.yaml` per experiment | **P0** |
| **HCL-D13** | **Matrioska Verifier = boundaries.ts detectMatrioskaCapture() en Loop** | hillclimb verifier + HSCSG matrioska 7 capas = detección captura en optimización | `verifiers/matrioska_verifier.py` | **P0** |
| **HCL-D14** | **Experimento €30/72h Optimizado por Hillclimb (GEPA + OpenEvolve)** | Zeitnus v15.1 handshake validation + hillclimb optimiza protocolo/hardware | `problems/kit72h_optimization.py` | **P1** |
| **HCL-D15** | **Gobernanza Policy Search: CDS_Jurados Weights + Symbiosky Params** | hillclimb optimiza parámetros gobernanza → verifier simula 1000 decisiones | `problems/governance_policy_search.py` | **P1** |
| **HCL-D16** | **Adapter Layer Delgado: TypeScript ↔ Python Bridge via child_process/WASM** | Integración mínima, sin dependencias pesadas, soberanía local | `hillclimb_adapter/bridge.ts` | **P0** |
| **HCL-D17** | **Catálogo HSCSG Extendido: Problems + Climbers empaquetados en wheel** | hillclimb catalog pattern → `hillclimb/_catalog/hscsg/` empaquetado | `hatch_build.py` + `catalog/` | **P1** |
| **HCL-D18** | **Documentación en BRIEF_EXHAUSTIVO v2.2 §23 "Hillclimb Integration"** | Trazabilidad completa EBD + specs técnicos | BRIEF v2.2 | **P0** |
| **HCL-D19** | **Reproducibilidad: Seeds Deterministas + Config YAML + RAO Trazabilidad** | hillclimb runs deterministas + HSCSG RAO append-only = auditoría completa | `runs/config.yaml` + RAO | **P0** |
| **HCL-D20** | **Zero Cloud Dependency: Todo Corre en Infraestructura FABSHIP Local** | hillclimb CLI/Python SDK local + HSCSG offline-first = soberanía total | Sin API keys externas requeridas | **P0** |

---

## 2. ESPECIFICACIONES TÉCNICAS DE INTEGRACIÓN

### 2.1 Estructura de Directorios (`src/hillclimb_adapter/`)
```
src/hillclimb_adapter/
├── bridge.ts                    # TypeScript ↔ Python bridge (child_process + JSON)
├── problems/                    # Definiciones de Problems HSCSG
│   ├── __init__.py
│   ├── fsi_optimization.py      # Maximize FSI s.t. ξ > 0.1, cycleClosure > 0.8
│   ├── xi_auditor_tuning.py     # Minimize ξ false pos/neg rate
│   ├── cac_optimization.py      # Maximize ΔAUT/cost, minimize realDependencyIndex
│   ├── automaton_e2r_params.py  # Optimize E²R search params
│   ├── fabshep_module_design.py # Synthesize FABSHIP modules (OpenEvolve)
│   ├── governance_policy_search.py # Optimize CDS_Jurados W_i + Symbiosky params
│   ├── kit72h_optimization.py   # Optimize Kit 72H v2.0 for Spirulina handshake
│   └── proto_co_validation.py   # Phase 0: 10 beta cases, 90 days
├── verifiers/                   # Verificadores que llaman módulos HSCSG
│   ├── __init__.py
│   ├── base_verifier.py         # Abstract base: run_ts_module(), parse_score()
│   ├── fsi_verifier.py          # foodSovereigntyIndex.ts + entropicAuditor.ts
│   ├── xi_verifier.py           # entropicAuditor.ts + SVD v2 ground truth
│   ├── cac_verifier.py          # metrics.ts (CAC, realDependencyIndex, autonomyPerMonetaryUnit)
│   ├── servitude_verifier.py    # Composite: CAC + ξ + FSI + mortality proxy
│   ├── matrioska_verifier.py    # boundaries.ts detectMatrioskaCapture()
│   └── governance_verifier.py   # Simulate 1000 decisions → quality metrics
├── climbers/                    # Configuraciones de climbers para HSCSG
│   ├── gepa_hscsg.yaml          # GEPA: prompt optimization para Colaberry/onboarding
│   ├── openevolve_hscsg.yaml    # OpenEvolve: TypeScript code evolution
│   └── custom_automaton.py      # AutomatonE2RClimber (wrapper nativo)
├── experiments/                 # Experiments YAML (hillclimb format)
│   ├── fsi_optimization.yaml
│   ├── xi_auditor_tuning.yaml
│   ├── proto_co_validation.yaml
│   ├── kit72h_optimization.yaml
│   └── governance_policy_search.yaml
├── sdk/                         # Python SDK para lanzar desde HSCSG
│   ├── __init__.py
│   ├── run_experiment.py        # hillclimb run --experiment <name>
│   ├── compare_climbers.py      # hillclimb experiment report <run-id>
│   └── promote_champion.py      # Deploy champion → PR + RAO
├── catalog/                     # Catálogo hillclimb extendido HSCSG
│   ├── problems/
│   │   ├── fsi_optimization/    # problem.py + verifier.py
│   │   ├── xi_auditor_tuning/
│   │   └── ...
│   └── climbers/
│       ├── gepa_hscsg/
│       ├── openevolve_hscsg/
│       └── automaton_e2r/
└── hatch_build.py               # Empaqueta catálogo en wheel hillclimb
```

### 2.2 Bridge TypeScript ↔ Python (`bridge.ts`)
```typescript
// src/hillclimb_adapter/bridge.ts
import { spawn } from 'child_process';
import { promisify } from 'util';

interface HillclimbRequest {
  experiment: string;
  problem: string;
  climber: string;
  budget: { max_evaluations: number };
  config?: Record<string, any>;
}

interface HillclimbResult {
  champion: {
    code: string;           // TypeScript/Python code
    params: Record<string, any>;
    score: number;          // Verifiable reward (0-1 or float)
    metrics: Record<string, number>; // FSI, ξ, CAC, etc.
  };
  run_id: string;
  evaluations: number;
  metadata: {
    start_time: number;
    end_time: number;
    climber: string;
    problem: string;
  };
}

export async function runHillclimbExperiment(request: HillclimbRequest): Promise<HillclimbResult> {
  return new Promise((resolve, reject) => {
    const py = spawn('python', [
      '-m', 'hillclimb_adapter.sdk.run_experiment',
      '--experiment', request.experiment,
      '--problem', request.problem,
      '--climber', request.climber,
      '--budget', String(request.budget.max_evaluations),
      '--config', JSON.stringify(request.config || {})
    ], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let stdout = '', stderr = '';
    py.stdout.on('data', d => stdout += d.toString());
    py.stderr.on('data', d => stderr += d.toString());
    
    py.on('close', code => {
      if (code !== 0) return reject(new Error(`Hillclimb failed (${code}): ${stderr}`));
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch (e) {
        reject(new Error(`Invalid JSON from hillclimb: ${stdout}`));
      }
    });
  });
}

// Llamar módulo TypeScript desde Python verifier
export async function callTypeScriptModule(
  modulePath: string,
  functionName: string,
  args: any[]
): Promise<any> {
  const tsNode = spawn('npx', ['ts-node', '-e', `
    import { ${functionName} } from '${modulePath}';
    const args = ${JSON.stringify(args)};
    const result = await ${functionName}(...args);
    console.log(JSON.stringify(result));
  `], { cwd: process.cwd() });
  
  return new Promise((resolve, reject) => {
    let out = '';
    tsNode.stdout.on('data', d => out += d.toString());
    tsNode.on('close', code => code === 0 ? resolve(JSON.parse(out.trim())) : reject(new Error(out)));
  });
}
```

### 2.3 Verifier Base + FSI Verifier (Ejemplo)
```python
# src/hillclimb_adapter/verifiers/base_verifier.py
import subprocess
import json
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseVerifier(ABC):
    """Base class for HSCSG verifiers that call TypeScript modules."""
    
    def __init__(self, ts_bridge_path: str = "src/hillclimb_adapter/bridge.ts"):
        self.ts_bridge = ts_bridge_path
    
    async def call_ts(self, module: str, function: str, args: list) -> Any:
        """Call TypeScript module via ts-node bridge."""
        cmd = [
            "npx", "ts-node", "-e",
            f"import {{ {function} }} from '{module}'; "
            f"const args = {json.dumps(args)}; "
            f"const result = await {function}(...args); "
            f"console.log(JSON.stringify(result));"
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        if proc.returncode != 0:
            raise RuntimeError(f"TS call failed: {stderr.decode()}")
        return json.loads(stdout.decode().strip())
    
    @abstractmethod
    async def verify(self, candidate: Dict[str, Any]) -> Dict[str, float]:
        """Return dict with 'score' (main reward) + auxiliary metrics."""
        pass

# src/hillclimb_adapter/verifiers/fsi_verifier.py
class FSIVerifier(BaseVerifier):
    """Verifier for Food Sovereignty Index optimization."""
    
    async def verify(self, candidate: Dict[str, Any]) -> Dict[str, float]:
        # candidate contains: nutritional_optimizer_params, fabshep_config, etc.
        
        # 1. Deploy candidate config to test environment (or use simulation)
        result = await self.call_ts(
            "src/core/lib/foodSovereigntyIndex.ts",
            "calculateFSI",
            [candidate.get("community_state", {}), candidate.get("config", {})]
        )
        
        fsi = result.get("FSI", 0)
        components = result.get("components", {})
        xi = components.get("entropicEfficiency", 0)
        cycle_closure = components.get("cycleClosure", 0)
        
        # Hard constraints
        if xi < 0.1 or cycle_closure < 0.8:
            return {"score": 0.0, "FSI": fsi, "xi": xi, "constraint_violation": True}
        
        # Multi-objective score (geometric mean of normalized components)
        score = fsi / 100.0  # FSI 0-100 → 0-1
        
        return {
            "score": score,
            "FSI": fsi,
            "xi": xi,
            "cycle_closure": cycle_closure,
            "autonomy_caloric": components.get("autonomyCaloric", 0),
            "labor_reduction": components.get("laborReduction", 0)
        }

# src/hillclimb_adapter/verifiers/xi_verifier.py
class XVerifier(BaseVerifier):
    """Verifier for Entropic Auditor (ξ) tuning."""
    
    async def verify(self, candidate: Dict[str, Any]) -> Dict[str, float]:
        # candidate: auditor_params (sensor_weights, confidence_thresholds, etc.)
        result = await self.call_ts(
            "src/core/lib/entropicAuditor.ts",
            "performEntropicAudit",
            [candidate.get("community_state", {}), candidate.get("svd_sensors", {})]
        )
        
        audit = result.get("audit", {})
        xi = audit.get("xi", 0)
        confidence = audit.get("svdVerification", {}).get("xiConfidence", 0)
        passed = audit.get("svdVerification", {}).get("auditPassed", False)
        
        # Ground truth comparison (if available)
        ground_truth_xi = candidate.get("ground_truth_xi")
        error = abs(xi - ground_truth_xi) if ground_truth_xi else 0
        
        # Score: high xi + high confidence + low error
        score = (xi * 0.5) + (confidence * 0.3) + (max(0, 1 - error) * 0.2)
        
        return {
            "score": min(1.0, max(0.0, score)),
            "xi": xi,
            "confidence": confidence,
            "passed": passed,
            "error": error
        }
```

### 2.4 Problem Definition (Ejemplo: FSI Optimization)
```python
# src/hillclimb_adapter/problems/fsi_optimization.py
from hillclimb import Problem
from hillclimb_adapter.verifiers.fsi_verifier import FSIVerifier

class FSIOptimizationProblem(Problem):
    """Maximize Food Sovereignty Index subject to entropic & circularity constraints."""
    
    def __init__(self, community_state: dict):
        super().__init__(
            name="hscsg_fsi_optimization",
            verifier=FSIVerifier(),
            # Search space: nutritional optimizer params + FABSHIP module selection
            param_space={
                "nutritional_optimizer": {
                    "caloric_weight": (0.1, 1.0),
                    "protein_weight": (0.1, 1.0),
                    "micronutrient_weight": (0.1, 1.0),
                    "diversity_weight": (0.0, 0.5),
                    "entropy_weight": (0.1, 1.0),
                    "labor_weight": (0.0, 0.5),
                    "monetary_weight": (0.0, 0.5)
                },
                "fabshep_modules": {
                    "greenhouse_bioclimatic": [True, False],
                    "aquaponics": [True, False],
                    "bioreactor_spirulina": [True, False],
                    "solar_dehydrator": [True, False],
                    "fermentation_chamber": [True, False]
                }
            }
        )
        self.community_state = community_state
    
    def get_initial_candidate(self) -> dict:
        """Baseline: current HSCSG defaults."""
        return {
            "nutritional_optimizer": {
                "caloric_weight": 0.3,
                "protein_weight": 0.25,
                "micronutrient_weight": 0.2,
                "diversity_weight": 0.1,
                "entropy_weight": 0.1,
                "labor_weight": 0.05
            },
            "fabshep_modules": {
                "greenhouse_bioclimatic": True,
                "aquaponics": True,
                "bioreactor_spirulina": True,
                "solar_dehydrator": True,
                "fermentation_chamber": True
            }
        }
```

### 2.5 Experiment YAML (Proto-CO Validation)
```yaml
# src/hillclimb_adapter/experiments/proto_co_validation.yaml
experiment: "hscsg_phase0_proto_co_validation"
description: "Validate HSCSG Phase 0: 10 beta cases, 90 days, FSI>30, xi>0, servitude reduction"
problem: "proto_co_validation"
climbers:
  - "greedy"              # Baseline: manual deployment
  - "gepa"                # Optimize Colaberry onboarding prompts
  - "openevolve"          # Evolve deployment scripts + configs
  - "automaton_e2r"       # Native Autómata E²R search
budget:
  max_evaluations: 10     # One per beta case
  timeout_hours: 2160     # 90 days
verifier: "proto_co_verifier"  # Composite: FSI + xi + realDependencyIndex + servitude reduction
config:
  beta_cases: 10
  duration_days: 90
  target_fsi: 30
  target_xi: 0.1
  max_real_dependency: 0.5
  min_servitude_reduction: 0.2
metadata:
  phase: "Phase_0_ProtoCO"
  hscsg_version: "v15.1"
  hillclimb_version: "0.8.1"
```

### 2.6 Custom Climber: Autómata E²R (Nativo HSCSG)
```python
# src/hillclimb_adapter/climbers/custom_automaton.py
from hillclimb import Climber, Candidate
from hillclimb_adapter.bridge import callTypeScriptModule
from typing import Dict, Any, List

class AutomatonE2RClimber(Climber):
    """Native HSCSG Autómata Soberano as a hillclimb climber.
    
    Implements EXPLORE → EXECUTE (MJ Gate) → REVIEW (SVD+RAO) → retroalimentar.
    """
    
    def __init__(self, community_state: dict):
        self.community_state = community_state
        self.automaton = None  # Lazy load via TS bridge
    
    async def initialize(self):
        """Load Autómata Soberano from HSCSG."""
        self.automaton = await callTypeScriptModule(
            "src/core/lib/automaton.ts",
            "createAutomaton",
            [self.community_state]
        )
    
    async def propose(self, problem_state: Dict[str, Any]) -> List[Candidate]:
        """EXPLORE phase: generate candidates via E²R tree search."""
        # Use Autómata's E²R search to generate diverse candidates
        candidates = await callTypeScriptModule(
            "src/core/lib/automaton.ts",
            "e2rSearch",
            [problem_state, {"budget": 20, "diversity": True}]
        )
        return [Candidate(params=c, metadata={"source": "e2r_search"}) for c in candidates]
    
    async def evaluate(self, candidate: Candidate) -> float:
        """EXECUTE (MJ Gate) + REVIEW (SVD+RAO) → score."""
        # MJ Gate check
        mj_result = await callTypeScriptModule(
            "src/core/lib/automaton.ts",
            "evaluateMJGate",
            [candidate.params, self.community_state]
        )
        if not mj_result.get("passed", False):
            return 0.0  # Hard constraint: MJ Gate failure = 0 score
        
        # Execute candidate → get metrics
        execution = await callTypeScriptModule(
            "src/core/lib/automaton.ts",
            "executePlan",
            [candidate.params, self.community_state]
        )
        
        # REVIEW: SVD + RAO → metrics
        metrics = await callTypeScriptModule(
            "src/core/lib/metrics.ts",
            "calculateAllMetrics",
            [execution, self.community_state]
        )
        
        # Multi-objective score: CAC + ξ + FSI - σᵤ
        score = (
            metrics.get("CAC", 0) * 0.3 +
            metrics.get("xi", 0) * 0.3 +
            metrics.get("FSI", 0) / 100 * 0.2 +
            (1 - metrics.get("sigma_u", 1)) * 0.2
        )
        return max(0.0, min(1.0, score))
    
    async def update(self, candidate: Candidate, score: float):
        """Retroalimentar: update Autómata memory + RAO."""
        await callTypeScriptModule(
            "src/core/lib/automaton.ts",
            "retroalimentar",
            [candidate.params, score, self.community_state]
        )
```

---

## 3. ACTUALIZACIONES BRIEF EXHAUSTIVO (v2.2 Pendiente)

### 3.1 Sección 1.3 Genealogía — Nueva fila
| Fase | Nombre | Descripción | Estado |
|------|--------|-------------|--------|
| 2026-11-09 | **Hillclimb Integration** | Fork propio + Adapter layer + 6 Problems + 3 Climbers + Proto-CO Experiment → Optimización verificable autónoma | **Completado** |

### 3.2 Sección 2.3 Frameworks — Nueva fila
| Framework | Sección HSCSG | Aporte Operativo |
|-----------|---------------|------------------|
| **Hillclimb (rebase-energy)** | §23, Bloque 4, Hoja de Ruta | Motor optimización verificable: Problems (FSI, ξ, CAC, Automaton, FABSHIP, Gobernanza), Verifiers (módulos HSCSG reales), Climbers (GEPA, OpenEvolve, Autómata E²R nativo), Experiments (Proto-CO validation), Síntesis código (Bloque 4), Anti-reward hacking (multi-métrica + Evidence Model + CDS_Jurados) |

### 3.3 Sección 23 (NUEVA) — HILLCLIMB INTEGRATION: OPTIMIZACIÓN VERIFICABLE AUTÓNOMA
[Ver backup + specs técnicos completos arriba]

### 3.4 Anexo B Mapeo — Nueva fila
| Repo Origen | Módulo HSCSG | Archivo `lib/` | Archivo `state/` | Pantalla | Docs Integración |
|-------------|--------------|----------------|------------------|----------|------------------|
| **Hillclimb (rebase-energy)** | **Motor Optimización Verificable** | **`hillclimb_adapter/` (bridge, problems, verifiers, climbers, experiments, sdk, catalog)** | _(extend existing)_ | **`/verificacion`, `/automata`, `/base`, `/integral`, `/solarpunk`, `/circulos`** | **`hillclimb_backup.md`, `hillclimb_integration.md`** |

---

## 4. ENTREGABLES ACCIONABLES GENERADOS

| Entregable | Tipo | Prioridad | Estado |
|------------|------|-----------|--------|
| `docs/hillclimb_backup.md` | Backup hillclimb + análisis + mapeo | **P0** | ✅ Creado |
| `docs/hillclimb_integration.md` | Integración EBD + specs técnicos completos | **P0** | ✅ Creado (este archivo) |
| `src/hillclimb_adapter/bridge.ts` | TypeScript ↔ Python bridge (child_process + JSON) | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/problems/*.py` (6 problems) | FSI, ξ, CAC, Automaton, FABSHIP, Gobernanza, Proto-CO | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/verifiers/*.py` (7 verifiers) | FSI, ξ, CAC, Servitude, Matrioska, Gobernanza, Proto-CO | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/climbers/` (3 configs) | GEPA, OpenEvolve, Autómata E²R nativo | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/experiments/*.yaml` (5 experiments) | FSI, ξ, Proto-CO, Kit 72h, Gobernanza | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/sdk/*.py` (3 SDK) | run_experiment, compare_climbers, promote_champion | **P0** | 🔄 Pendiente |
| `src/hillclimb_adapter/catalog/` | Problems + Climbers empaquetados en wheel | **P1** | 🔄 Pendiente |
| Fork `Isaacko0/hillclimb-hscsg` | Soberanía tecnológica (MIT → fork propio) | **P0** | 🔄 Pendiente |
| `/verificacion` screen extend | Hillclimb experiment dashboard + champion metrics | **P1** | 🔄 Pendiente |
| `/automata` screen extend | Autómata E²R climber status + proposals | **P1** | 🔄 Pendiente |

---

## 5. VERIFICACIÓN CIENTÍFICA (TRAZABILIDAD EBD)

| Decisión | Fuente Hillclimb | Necesidad HSCSG | Validación Cruzada |
|----------|------------------|-----------------|-------------------|
| HCL-D1 | "verifiable rewards" | Métricas verificables HSCSG | CAC, ξ, FSI, IVC, σᵤ son ejecutables |
| HCL-D2 | MIT License | Soberanía IAU-D20 | Fork propio `Isaacko0/hillclimb-hscsg` |
| HCL-D3 | Problems + Verifiers | Anti-Goodhart (métricas reales) | Verifiers llaman módulos TS reales |
| HCL-D4 | 6 Problems iniciales | Cobertura métricas críticas | FSI, ξ, CAC, Automaton, FABSHIP, Gov |
| HCL-D5 | Verifiers ejecutan código | Scores no son proxies | TS bridge → módulos HSCSG reales |
| HCL-D6 | GEPA + OpenEvolve + Custom | Prompts + Código + Nativo | Cada climber para uso específico |
| HCL-D7 | Experiments | Validación empírica Fase 0 | 10 casos beta, 90 días, métricas reales |
| HCL-D8 | Reward hacking risk | Multi-métrica + Evidence + CDS | FSI+ξ+CAC+σᵤ + Fact Bands + CDS_Jurados |
| HCL-D9 | Program synthesis | Bloque 4 aceleración | OpenEvolve genera TS para 9 módulos P0 |
| HCL-D10 | Autómata E²R = climber | Coherencia arquitectónica | E²R Search = hillclimbing natural |
| HCL-D11 | Champion promotion | Deploy verificado + feedback | PR + RAO + métricas producción |
| HCL-D12 | Budget control | Recursos FABSHIP locales | max_evaluations + timeout local |
| HCL-D13 | Matrioska verifier | Detección captura en optimización | boundaries.ts en loop verifier |
| HCL-D14 | Kit 72h optimization | Zeitnus v15.1 experimento | GEPA + OpenEvolve optimizan protocolo |
| HCL-D15 | Governance search | CDS_Jurados + Symbiosky tuning | Simulación 1000 decisiones |
| HCL-D16 | Adapter delgado | Soberanía + simplicidad | child_process + JSON, sin deps pesadas |
| HCL-D17 | Catalog extendido | Distribución hillclimb nativa | wheel + `_catalog/hscsg/` |
| HCL-D18 | Docs BRIEF v2.2 | Trazabilidad completa | §23 nueva sección |
| HCL-D19 | Reproducibilidad | Seeds + YAML + RAO | Runs deterministas + auditoría |
| HCL-D20 | Zero cloud | Offline-first HSCSG | Sin API keys, todo local |

---

## 6. PRÓXIMOS PASOS (SECUENCIA ESTRICTA)

1. **Fork hillclimb** → `Isaacko0/hillclimb-hscsg` (GitHub)
2. **Crear `src/hillclimb_adapter/`** con estructura completa (bridge + 6 problems + 7 verifiers + 3 climbers + 5 experiments + SDK + catalog)
3. **Implementar bridge TS↔Python** (`bridge.ts` + `base_verifier.py`)
4. **Primer experimento:** `fsi_optimization` en `nutritionalOptimizer.ts` (budget: 20 evals, climber: GEPA)
5. **Validar champion** → deploy PR → medir FSI real en caso beta
6. **Escalar a 6 problems paralelos** + experiment Proto-CO (10 casos beta)
7. **Integrar Autómata E²R Climber nativo** en Autómata Soberano
8. **Actualizar BRIEF_EXHAUSTIVO v2.2** §23 + Commit + Push

---

**Nota derechos de autor:** hillclimb MIT License → fork propio compatible. Para uso interno HSCSG: integrar adapter layer, no modificar hillclimb core. Cero dependencias cloud, todo local en infraestructura FABSHIP.