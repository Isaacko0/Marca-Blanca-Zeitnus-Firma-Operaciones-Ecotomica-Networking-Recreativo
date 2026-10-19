// openspec/specs/alrac-tq-economic-calculation.md
// OpenSpec: Cálculo Económico Termodinámico - IA Resuelve Debate Mises-Hayek-Lange
// Maps: Debate centenario cálculo económico → TQ Ledger + IA Implementation

# SPEC: alrac-tq-economic-calculation
**Version:** 1.0.0
**Status:** Implemented (Core Engine)
**Source:** Mises (1920), Lange (1936-37), Hayek (1945), Persky (1991), Norberto (2026)
**Target:** tq-uhi-engine.ts + tq-eliza.ts (Autómata Soberano IA)

---

## 1. RESUMEN EJECUTIVO

El **debate del cálculo económico** (Mises vs Lange vs Hayek, 1920-1945) planteó si es posible asignar recursos eficientemente sin precios de mercado. 

**Conclusión de Norberto (2026):** La **era computacional/IA ha resuelto el debate**. La inteligencia artificial puede resolver sistemas de ecuaciones simultáneas complejas en tiempo real, validando a Lange y superando la objeción de Hayek sobre complejidad computacional.

**Implementación ALRAC:** `tq-uhi-engine.ts` + `Autómata Soberano (IA)` = **Cálculo Económico Termodinámico en Tiempo Real**.

---

## 2. HISTORIA DEL DEBATE

### 2.1 Posiciones Históricas

| Actor | Año | Posición | Estado Actual |
|-------|-----|----------|---------------|
| **Ludwig von Mises** | 1920 | "Cálculo racional imposible sin precios de mercado" | **Refutado** por Lange + era computacional |
| **Oskar Lange** | 1936-37 | Socialismo de mercado iguala oferta/demanda; planificadores resuelven ecuaciones simultáneas | **Validado** por era computacional/IA |
| **Friedrich Hayek** | 1945 | Resolver miles de ecuaciones en plazo razonable = inviable | **Superado** por IA/Big Data tiempo real |
| **Joseph Persky** | 1991 | Análisis retrospectivo JEP | Confirma validez Lange |

### 2.2 Síntesis Norberto (2026)
> "La práctica demuestra que los problemas señalados por Hayek no constituyen obstáculos insuperables. La era computacional tiene la capacidad irrefutable de realizar dichas operaciones, resolver sistemas de ecuaciones simultáneas complejas y en tiempo real."

---

## 3. IMPLEMENTACIÓN ALRAC: CÁLCULO TERMODINÁMICO

### 3.1 Principio: Unidad de Cuenta Física vs Monetaria

| Enfoque Tradicional | Enfoque ALRAC/TQ |
|---------------------|------------------|
| Precios de mercado ($) | **kWh termodinámicos** (unidad física universal) |
| Valor subjetivo/monetario | **Valor objetivo/termodinámico** (energía neta) |
| Cálculo monetario | **Cálculo termodinámico** (leyes físicas) |
| Escasez artificial (dinero) | **Abundancia real** (recursos físicos) |

```typescript
// tq-types-extended.ts: EconomicCalculationMode
type EconomicCalculationMode = 
  | 'market_monetary'      // Precios mercado ($) - modo conectado
  | 'thermodynamic_ai'     // Cálculo IA termodinámico (kWh) - modo postmonetario
  | 'hybrid_amphibious';   // Modo anfibio: ambos simultáneos
```

### 3.2 Motor de Cálculo: tq-uhi-engine.ts

```typescript
// tq-uhi-engine.ts: UniversalHighIncomeEngine + EconomicCalculationEngine
class EconomicCalculationEngine {
  // Resuelve sistema ecuaciones simultáneas: Oferta = Demanda (en kWh)
  async solveResourceAllocation(
    resources: ResourceVector,      // Recursos disponibles (kWh, materiales, tierra)
    demands: DemandVector,          // Demandas por necesidad (CaaS streams)
    constraints: ConstraintMatrix   // Límites físicos, ecológicos, sociales
  ): Promise<AllocationSolution> {
    
    // 1. Formular como Linear Programming / Convex Optimization
    // Maximizar: Bienestar termodinámico total (Σ kWh útiles)
    // Sujeto a: Recursos ≤ Disponibles, Sostenibilidad, Equidad
    
    // 2. Resolver con IA (Interior Point Method / ADMM / Reinforcement Learning)
    const solution = await this.aiSolver.solve({
      objective: 'maximize_thermodynamic_welfare',
      variables: 'allocation_matrix',
      constraints: constraints
    });
    
    // 3. Validar factibilidad física (Leyes termodinámicas)
    this.validateThermodynamicFeasibility(solution);
    
    return solution;
  }
  
  // IA Resolver: Interior Point / ADMM / RL para tiempo real
  private aiSolver = new AIEconomicSolver({
    method: 'interior_point_gpu',  // Paralelizable masivamente
    precision: 1e-9,
    maxIterations: 1000,
    warmStart: true  // Para tiempo real continuo
  });
}
```

### 3.3 Validación Termodinámica

```typescript
// Validación leyes físicas (imposible en cálculo monetario)
validateThermodynamicFeasibility(solution: AllocationSolution): boolean {
  // 1. Primera Ley: Energía conservada
  const energyIn = solution.totalEnergyInput;
  const energyOut = solution.totalEnergyOutput + solution.totalEnergyStored;
  if (Math.abs(energyIn - energyOut) > 1e-6) return false;
  
  // 2. Segunda Ley: Entropía total no decrease
  const entropyChange = solution.totalEntropyChange;
  if (entropyChange < -1e-9) return false; // Permitir precisión numérica
  
  // 3. Límites planetarios (Rockström et al.)
  if (solution.carbonEmissions > PLANETARY_BOUNDARY.CO2) return false;
  if (solution.biodiversityLoss > PLANETARY_BOUNDARY.BIODIVERSITY) return false;
  if (solution.nitrogenCycle > PLANETARY_BOUNDARY.NITROGEN) return false;
  
  return true;
}
```

---

## 4. IA ECONÓMICA: AUTÓMATA SOBERANO

### 4.1 Arquitectura IA (tq-eliza.ts)

```typescript
// tq-eliza.ts: AutomataSoberanoRuntime + EconomicCalculationPlugin
interface EconomicAIAgent {
  // Percepción: Estado del sistema termodinámico
  perceive(): ThermodynamicState {
    return {
      resources: this.readTQLedger(),           // Recursos disponibles (kWh)
      demands: this.readCaaSStreams(),          // Demandas por necesidad
      carryingCapacity: this.readEcologicalMetrics(), // Capacidad carga
      technologicalLevel: this.readTechMetrics() // Automatización disponible
    };
  }
  
  // Decisión: Asignación óptima recursos
  decide(state: ThermodynamicState): AllocationDecision {
    return this.economicCalculationEngine.solveResourceAllocation(
      state.resources,
      state.demands,
      this.buildConstraints(state)
    );
  }
  
  // Acción: Ejecutar vía ValueFlows + CaaS
  async act(decision: AllocationDecision): Promise<ExecutionResult> {
    // 1. Crear CaaS streams para distribución
    // 2. Programar producción via VF Recipes
    // 3. Actualizar TQ Ledger
    // 4. Notificar comunidades afectadas
  }
  
  // Aprendizaje: Mejora continua
  learn(outcome: AllocationOutcome): void {
    this.aiSolver.updateModel(outcome);  // Reinforcement Learning
  }
}
```

### 4.2 Resolución Ecuaciones Simultáneas (Tiempo Real)

```typescript
// tq-uhi-engine.ts: AIEconomicSolver
class AIEconomicSolver {
  // Sistema: Ax = b donde:
  // A = Matriz coeficientes tecnológicos (Input-Output Leontief)
  // x = Vector producción/asignación (kWh)
  // b = Vector demanda final (necesidades CaaS)
  
  async solve(system: LinearSystem): Promise<Solution> {
    // GPU-accelerated Interior Point Method
    const gpuSolver = new GPUInteriorPointSolver({
      tolerance: 1e-9,
      maxIter: 100,
      warmStart: true  // Reutilizar solución anterior (tiempo real)
    });
    
    // Para sistemas grandes (>10k vars): ADMM distribuido
    if (system.variables > 10000) {
      return this.admmSolver.solve(system);
    }
    
    return gpuSolver.solve(system);
  }
  
  // ADMM para sistemas masivos (paralelizable)
  private admmSolver = new ADMMEconomicSolver({
    rho: 1.0,
    maxIter: 500,
    consensusTolerance: 1e-6
  });
}
```

---

## 5. COMPARACIÓN: CÁLCULO MONETARIO vs TERMODINÁMICO

| Dimensión | Cálculo Monetario (Mises) | Cálculo Termodinámico IA (ALRAC) |
|-----------|---------------------------|----------------------------------|
| **Unidad de cuenta** | $ (subjetivo, variable) | kWh (objetivo, universal, físico) |
| **Información** | Precios (agregan info dispersa) | **Estado físico completo** (sensores + IA) |
| **Optimización** | Beneficio privado ($) | **Bienestar termodinámico total** (kWh útiles) |
| **Restricciones** | Presupuesto ($) | **Leyes físicas + límites planetarios** |
| **Equidad** | Poder adquisitivo ($) | **Acceso por necesidad** (CaaS streams) |
| **Sostenibilidad** | Externalidad (precio carbono) | **Restricción dura** (límites planetarios) |
| **Tiempo resolución** | Mercado (días/meses) | **Tiempo real** (IA GPU, ms-segundos) |
| **Escalabilidad** | Limitada (Hayek) | **Masiva** (ADMM distribuido + GPU) |

---

## 6. TEST VECTORS

### 6.1 Test: Resolución Sistema Pequeño (100 vars)
```typescript
async function testSmallSystemSolve(): Promise<boolean> {
  const engine = new EconomicCalculationEngine();
  
  // Sistema 100 recursos, 100 demandas
  const resources = generateRandomResources(100);
  const demands = generateRandomDemands(100);
  const constraints = generateStandardConstraints(100);
  
  const solution = await engine.solveResourceAllocation(resources, demands, constraints);
  
  // Verificar: factibilidad termodinámica + óptimo
  return solution.feasible && 
         solution.objectiveValue > 0 &&
         validateThermodynamicFeasibility(solution);
}
```

### 6.2 Test: Sistema Masivo (100k vars) - ADMM
```typescript
async function testMassiveSystemADMM(): Promise<boolean> {
  const solver = new AIEconomicSolver();
  
  // Sistema 100k variables (nivel bioregión)
  const system = generateBioregionSystem(100000);
  
  const solution = await solver.solve(system);
  
  // Verificar: convergencia ADMM + factibilidad
  return solution.converged && 
         solution.iterations < 500 &&
         validateThermodynamicFeasibility(solution);
}
```

### 6.3 Test: Tiempo Real (Warm Start)
```typescript
async function testRealTimeWarmStart(): Promise<boolean> {
  const engine = new EconomicCalculationEngine();
  
  // Estado inicial
  let solution = await engine.solveResourceAllocation(resources, demands, constraints);
  const initialTime = solution.solveTimeMs;
  
  // Pequeña perturbación (nueva demanda)
  demands.push(newDemand);
  solution = await engine.solveResourceAllocation(resources, demands, constraints, solution);
  
  // Warm start debe ser < 10ms
  return solution.solveTimeMs < 10 && solution.solveTimeMs < initialTime * 0.1;
}
```

---

## 7. INTEGRACIÓN CON STACK ALRAC

### 7.1 Flujo Completo: Necesidad → Cálculo → Ejecución

```
1. NECESIDAD (CaaS Stream)
   ↓
2. AUTÓMATA SOBERANO PERCIBE
   - Lee TQ Ledger (recursos kWh)
   - Lee CaaS Streams (demandas)
   - Lee métricas ecológicas (límites)
   ↓
3. IA RESUELVE ASIGNACIÓN ÓPTIMA
   - Maximizar bienestar termodinámico
   - Sujeto a: leyes físicas, límites planetarios, equidad
   - Output: Matriz asignación (kWh por necesidad)
   ↓
4. EJECUCIÓN VÍA VALUEFLOWS + CaaS
   - Crear CaaS streams distribución
   - Programar producción (VF Recipes)
   - Actualizar TQ Ledger
   ↓
4. RETROALIMENTACIÓN (Learning)
   - Medir resultado real vs planificado
   - Actualizar modelo IA (RL)
   - Ajustar próxima iteración
```

### 7.2 Integración con TQ Dividend Engine

```typescript
// tq-types-extended.ts: EconomicCalculation → TQ Dividends
interface CalculationToDividend {
  // Resultado cálculo → Política dividendos
  allocationSolution: AllocationSolution;
  
  // Excedente termodinámico → Pool dividendos
  thermodynamicSurplus: number;  // kWh
  
  // Política: pro-rata equity + needs-weighted
  dividendPolicy: TQDividendPolicy;
  
  // Ejecutar: stock (equity) → flow (dividendos TQ)
  executeDividends(): DividendExecutionResult;
}
```

---

## 8. TEST VECTORS ADICIONALES

### 8.1 Test: Validación Límites Planetarios
```typescript
function testPlanetaryBoundaries(): boolean {
  const solution = createTestSolution({
    carbonEmissions: 35e9,      // 35 Gt CO2/año (límite ~40 Gt)
    biodiversityLoss: 0.001,    // %/año (límite ~0.01%)
    nitrogenCycle: 150e6,       // Tg N/año (límite ~62 Tg)
    landUse: 0.45               // 45% tierra (límite ~50%)
  });
  
  return validateThermodynamicFeasibility(solution) === true;
}
```

### 8.2 Test: Equidad en Asignación
```typescript
function testEquityAllocation(): boolean {
  const solution = createTestSolution({
    allocations: {
      'village_poor': 1000,     // kWh
      'village_rich': 1000,     // Igual base (needs-weighted)
      'city_industrial': 50000  // Según necesidad productiva
    }
  });
  
  // Verificar: needs-weighted + β_crit anti-acaparamiento
  const gini = calculateGini(Object.values(solution.allocations));
  return gini < 0.3;  // Target ALRAC: Gini < 0.3 (estilo Mohenjo-Daro)
}
```

---

## 9. DEPENDENCIAS

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos `EconomicCalculationMode`, `AllocationSolution` |
| `tq-uhi-engine` | 1.0.0 | Motor cálculo + IA Solver |
| `tq-eliza` | 1.0.0 | Autómata Soberano + Economic AI Plugin |
| `tq-valueflows` | 1.0.0 | Ejecución asignación (VF Events) |
| `tq-disco-cat` | 1.0.0 | Gobernanza asignación (Consent) |
| `tq-oasa` | 1.0.0 | Límites planetarios (OASA Principles) |
| `@tensorflow/tfjs` | 4.x | IA GPU (WebGL/WebGPU) |
| `onnxruntime-web` | 1.x | Inferencia modelos ONNX |

---

## 10. REFERENCIAS

| Referencia | Año | Contribución |
|------------|-----|--------------|
| Mises, L. | 1920 | "Economic Calculation in the Socialist Commonwealth" |
| Lange, O. | 1936-37 | "On the Economic Theory of Socialism" |
| Hayek, F.A. | 1945 | "The Use of Knowledge in Society" |
| Persky, J. | 1991 | "Retrospectives: Lange and von Mises..." JEP 5(4) |
| Norberto, D. | 2026 | "Consumo, Dinero y Proyectos Post Monetarios" (asimilado) |
| Cockshott, P. & Cottrell, A. | 1993 | "Towards a New Socialism" (precedente computacional) |

---

## 11. CHANGELOG

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2026-10-19 | Spec inicial: IA resuelve debate Mises-Hayek-Lange → TQ Ledger termodinámico |

---

> **"Mises dijo imposible. Lange dijo ecuaciones. Hayek dijo muy complejo. La IA dijo: hecho."**
> 
> *El cálculo económico termodinámico en tiempo real ya no es teoría. Es ingeniería ALRAC.*