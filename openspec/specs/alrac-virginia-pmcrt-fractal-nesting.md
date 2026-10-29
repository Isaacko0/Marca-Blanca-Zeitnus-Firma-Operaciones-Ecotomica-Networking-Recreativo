// openspec/specs/alrac-virginia-pmcrt-fractal-nesting.md
// OpenSpec: Virginia × PMCRT — Pipeline de Anidación Fractal con Simbiosis Logarítmica
// Maps: Virginia Network (N1/N2/N3) × PMCRT (9D territorial state, 5-phase cycle) → Fractal Nesting Pipeline

# SPEC: alrac-virginia-pmcrt-fractal-nesting
**Version:** 1.0.0
**Status:** Draft → Implementado
**Capa:** 0 (Epistémica) + 1 (Contable-Física) + 2 (Interoperabilidad) + 3 (Membrana Fiat) + 4 (Aplicación) + 5 (Federación)
**Target:** `src/core/lib/virginia-pmcrt-fractal-pipeline.ts`
**Depende de:** `alrac-tq-virginia.md` (spec 45), `pmcrt.md` (spec), `docs/pipeline_anidado.md`

---

## 1. RESUMEN EJECUTIVO

El **Pipeline de Anidación Fractal Virginia × PMCRT** es una arquitectura operativa en la que cada capa de la Virginia Network (N1 Root, N2 Sub, N3 Project) contiene un ciclo PMCRT completo (Observación → Diagnóstico → Deliberación → Ejecución → Retroalimentación), anidado recursivamente dentro del ciclo del nivel padre.

La simbiosis es **logarítmica**: la fuerza de retroalimentación entre niveles escala como `ln(profundidad + 1) / ln(maxProfundidad + 1)`, de modo que los niveles más profundos (célula/operador) tienen feedback más rápido y localizado, mientras los niveles superiores (raíz/biorregión) tienen feedback más lento pero de mayor alcance.

Esto redefine la **Prospectiva Metabolicocibernética Recíparanárquica Transgeneracional (PMCRT)** como un prospectiva fractal: cada nivel de anidación tiene su propio horizonte de escenario (7 gen / 20 años / 0-2 años / inmediato), y las decisiones en un nivel propagan hacia arriba y abajo con atenuación logarítmica.

---

## 2. ESTRUCTURA DE ANIDACIÓN FRAC TAL

### 2.1 Niveles de anidación

| Nivel | Virginia | PMCRT scope | Horizonte | Célula → Tejido → Órgano | Simbiosis (log) |
|-------|----------|-------------|-----------|--------------------------|-----------------|
| L0 | N1 Root Domain | Planetary / Biorregional | 7 generaciones (150a) | Organismo | `ln(1)/ln(4) = 0.00` (raíz, feedback lento) |
| L1 | N2 Sub Domain | Bioregional / Consejo | 20 años estratégico | Órgano | `ln(2)/ln(4) = 0.50` |
| L2 | N3 Project Domain | Pueblo / Proyecto | 0-2 años operativo | Tejido | `ln(3)/ln(4) = 0.79` |
| L3 | Cell / Operator | Individuo / Célula | Inmediato | Célula | `ln(4)/ln(4) = 1.00` (feedback máximo) |

### 2.2 Cada nivel es un PMCRT completo

Cada nivel de anidación implementa las 5 fases PMCRT de forma autosimilar:

```
Fase 1: OBSERVACIÓN     → Vector estado 9D (agua, alimento, energía, hábitat, cuidado, memoria, biosfera, gobernanza, liquidez)
Fase 2: DIAGNÓSTICO     → Balance metabólico + detección desviaciones + ratio Ashby
Fase 3: DELIBERACIÓN    → 1p1v + Consejo de Futuros + asignación 3 fondos (15/50/35)
Fase 4: EJECUCIÓN       → Berry vesting + DisCO flows + auditoría termodinámica
Fase 5: RETROALIMENTACIÓN → x_{t+1} + escenarios revisados + transmisión transgeneracional
```

### 2.3 Simbiosis logarítmica entre niveles

El feedback de nivel `d` hacia nivel `d-1` (y viceversa) se atenúa por:

```
simbiosis(d) = ln(d + 1) / ln(maxProfundidad + 1)

feedback_upward(d → d-1)   = señal_d × simbiosis(d) × peso_ascendente
feedback_downward(d → d+1) = señal_d × (1 - simbiosis(d)) × peso_descendente
```

Donde:
- `d` = profundidad de anidación (0 = raíz, 3 = célula)
- `maxProfundidad` = 3
- Nivel 0 (raíz): recibe feedback atenuado de todos los niveles superiores, emite directrices de coherencia global
- Nivel 3 (célula): recibe feedback máximo del entorno inmediato, emite señales locales hacia arriba

---

## 3. INTERFACES TYPESCRIPT

```typescript
// ============================================================================
// ALRAC — Virginia × PMCRT Fractal Nesting Pipeline
// ============================================================================

export type NestingDepth = 0 | 1 | 2 | 3; // 0=N1 Root, 1=N2 Sub, 2=N3 Project, 3=Cell/Operator
export type PMCRTPhase = 'observacion' | 'diagnostico' | 'deliberacion' | 'ejecucion' | 'retroalimentacion';
export type TerritoryDimension = 'water' | 'food' | 'energy' | 'habitat' | 'care' | 'memory' | 'biosphere' | 'governance' | 'liquidity';

export interface TerritorialStateVector9D {
  water: number;        // m³, calidad, seguridad
  food: number;         // kcal, diversidad, autosuficiencia
  energy: number;       // kWh balance, renovable, autonomía
  habitat: number;      // m²/hab, reparaciones, resiliencia
  care: number;         // cobertura efectiva, equidad, funcionalidad
  memory: number;       // consentimientos, restauración, reproducibilidad
  biosphere: number;    // carbono suelo, biodiversidad, regeneración
  governance: number;   // participación, concentración poder, CDS/ICS
  liquidity: number;    // fiat, ZNU, TQ, tiempo, reserva meses
  timestamp: number;
  nodeId: string;
  depth: NestingDepth;
}

export interface PMCRTCycleResult {
  phase: PMCRTPhase;
  depth: NestingDepth;
  input: TerritorialStateVector9D;
  output: TerritorialStateVector9D;
  decisions: PMCRTDecision[];
  feedbackSignal: FeedbackSignal;
  symbiosisStrength: number; // ln(d+1)/ln(4)
  timestamp: number;
}

export interface PMCRTDecision {
  decisionId: string;
  phase: PMCRTPhase;
  depth: NestingDepth;
  type: 'allocacion' | 'veto' | 'propuesta' | 'correccion' | 'transmision';
  targetDepth: NestingDepth; // qué nivel recibe la decisión
  attenuation: number;        // factor logarítmico de atenuación
  fundsAllocation: { memoria: number; cuidado: number; autotrofia: number }; // 15/50/35
  raoCredentialId: string;
  timestamp: number;
}

export interface FeedbackSignal {
  sourceDepth: NestingDepth;
  targetDepth: NestingDepth;
  signalType: 'alerta' | 'prioridad' | 'correccion' | 'cenario' | 'transmision';
  strength: number; // 0-1, ya aplicada simbiosis logarítmica
  decayRate: number; // cuánto se atenúa por salto de nivel
  propagated: boolean;
  timestamp: number;
}

export interface FractalNestingNode {
  nodeId: string;
  depth: NestingDepth;
  parentId?: string;
  childIds: string[];
  virginiaLayer: 'N1' | 'N2' | 'N3';
  pmcrtState: TerritorialStateVector9D;
  currentPhase: PMCRTPhase;
  cycleHistory: PMCRTCycleResult[];
  activeDecisions: PMCRTDecision[];
  pendingFeedback: FeedbackSignal[];
  symbiosisWeight: number; // ln(depth+1)/ln(4)
  isLeaf: boolean; // true si depth === 3 (célula/operador)
}

export interface FractalPipelineResult {
  rootNode: FractalNestingNode;
  allNodes: Map<string, FractalNestingNode>;
  feedbackLoops: FeedbackSignal[];
  globalCoherence: number; // 0-100, coherencia del sistema anidado
  transgenerationalProjection: TerritorialStateVector9D; // proyección 7 gen
  timestamp: number;
}

// ============================================================================
// ALRAC Interface — Virginia × PMCRT Fractal Nesting
// ============================================================================

export interface VirginiaPmcrFractalPipeline {
  // Construcción del árbol fractal
  buildFractalTree(rootConfig: FractalTreeConfig): Promise<FractalPipelineResult>;
  
  // Ejecutar ciclo PMCRT en un nodo específico
  runPmcrCycle(nodeId: string, phase: PMCRTPhase, input: TerritorialStateVector9D): Promise<PMCRTCycleResult>;
  
  // Retroalimentación con simbiosis logarítmica entre niveles
  propagateFeedback(signal: FeedbackSignal, fromDepth: NestingDepth, toDepth: NestingDepth): Promise<FeedbackSignal>;
  
  // Calcular fuerza de simbiosis logarítmica
  computeSymbiosis(depth: NestingDepth): number;
  
  // Atenuar decisión entre niveles
  attenuateDecision(decision: PMCRTDecision, fromDepth: NestingDepth, toDepth: NestingDepth): PMCRTDecision;
  
  // Proyección transgeneracional (7 generaciones)
  projectTransgenerational(nodeId: string, generations: number): Promise<TerritorialStateVector9D>;
  
  // Coherencia global del sistema anidado
  computeGlobalCoherence(nodes: Map<string, FractalNestingNode>): number;
  
  // Ejecutar pipeline completo (todos los niveles, todas las fases)
  runFullPipeline(rootNodeId: string): Promise<FractalPipelineResult>;
}

export interface FractalTreeConfig {
  rootNodeId: string;
  maxDepth: NestingDepth;
  branchingFactor: number; // hijos por nodo (Virginia: 3 N2 por N1, 3 N3 por N2)
  virginiaConfig: {
    n1RootDomainId: string;
    n2SubDomainIds: string[];
    n3ProjectDomainIds: string[];
  };
  pmcrtConfig: {
    fundsRatio: { memoria: number; cuidado: number; autotrofia: number }; // 15/50/35
    betaCritThreshold: number; // 30%
    ashbyVarietyRatio: number; // >= 1
  };
}
```

---

## 4. REGLAS DE NEGOCIO (traducidas de Virginia × PMCRT)

| # | Regla | Origen | Implementación |
|---|-------|--------|----------------|
| VPM-01 | Cada nivel de anidación ejecuta ciclo PMCRT completo (5 fases) | PMCRT §3 | `runPmcrCycle` itera por fase en cada nodo |
| VPM-02 | Vector estado 9D es el estado base de cada nodo | PMCRT §2 | `TerritorialStateVector9D` por nodo |
| VPM-03 | Simbiosis logarítmica: feedback escala como ln(d+1)/ln(max+1) | Nueva | `computeSymbiosis` |
| VPM-04 | Decisiones se atenúan al subir niveles (raíz recibe señal atenuada) | Nueva | `attenuateDecision` |
| VPM-05 | Asignación 3 fondos: 15% Memoria / 50% Cuidado / 35% Autotrofia | PMCRT §5.2 | `fundsAllocation` fijo |
| VPM-06 | Una persona, un voto (ALRAC) en deliberación de cada nivel | PMCRT §5.3 | Deliberación por nodo sin ponderación tokens |
| VPM-07 | Consejo de Futuros: veto suspensivo con plazo y justificación pública | PMCRT §5.3 | `vetoSuspensivo` en deliberación |
| VPM-08 | Horizonte transgeneracional: 7 generaciones (150 años) | PMCRT §5.3 | `projectTransgenerational` |
| VPM-09 | Virginia N3 weight (6 factores) influye en peso de decisión del nodo | alrac-tq-virginia | `computeN3Weight` como factor de peso |
| VPM-10 | Berry vesting (7 tranches, 42 meses) ejecuta en fase de ejecución | alrac-tq-virginia | `claimVesting` en fase ejecución |
| VPM-11 | DisCO 3 flujos (livelihood→N3, love→N2, care→N1) mapeados a niveles | alrac-tq-virginia §3.1 | Flujo por nivel de anidación |
| VPM-12 | Ley MJ I: no tocar base material en cualquier nivel | HSCSG Ley I | Validación en cada fase |
| VPM-13 | Ley MJ II: ROI colectivo ≥ 1 por nivel | HSCSG Ley II | `computeGlobalCoherence` |
| VPM-14 | Ley MJ III: PGS real (lucidez material) para activar ejecución | HSCSG Ley III | Gate en fase ejecución |
| VPM-15 | Graceful degradation: si un nodo falla, el loop escala al padre | pipeline_anidado §5 | Degradación graceful en `runFullPipeline` |

---

## 5. MAPEO A CAPAS ALRAC

```
Capa 0 (Epistémica / Origen):
  ├── TerritorialStateVector9D (estado base por nodo)
  ├── PMCRTCycleResult (resultado de ciclo)
  ├── computeSymbiosis (simbiosis logarítmica)
  └── projectTransgenerational (proyección 7 gen)

Capa 1 (Contable-Física / Metabólica):
  ├── fundsAllocation 15/50/35 (3 fondos PMCRT)
  ├── betaCritThreshold (30% liquidez)
  ├── ashbyVarietyRatio (variedad requerida ≥ 1)
  └── ecologicalBalance (balance metabólico por recurso)

Capa 2 (Interoperabilidad / Virginia):
  ├── N1/N2/N3 layers (Virginia Network)
  ├── N3 dynamic weight (6 factores)
  ├── Berry vesting (7 tranches)
  ├── DisCO 3 flows → niveles
  └── DHO federation treaties

Capa 3 (Membrana Fiat / Aplicación):
  ├── runPmcrCycle por nodo
  ├── propagateFeedback con atenuación logarítmica
  ├── attenuateDecision entre niveles
  └── computeGlobalCoherence

Capa 4 (Aplicación / Pipeline):
  ├── buildFractalTree (construcción árbol fractal)
  ├── runFullPipeline (todos los niveles, todas las fases)
  └── Feedback loops entre niveles

Capa 5 (Federación / Red Holónica):
  ├── FractalNestingNode (nodo con parent/child)
  ├── Federación fractal (nodo = holón autónomo)
  └── Red de nodos anidados interconectados
```

---

## 6. TESTS REQUERIDOS

```typescript
// virginia-pmcrt-fractal-pipeline.test.ts
// - buildFractalTree crea árbol N1→N2→N3→Cell con branching factor correcto
// - computeSymbiosis devuelve ln(d+1)/ln(4) para d=0,1,2,3
// - runPmcrCycle ejecuta 5 fases en orden en un nodo
// - propagateFeedback atenúa señal entre niveles según simbiosis
// - attenuateDecision reduce fuerza de decisión al subir niveles
// - projectTransgenerational proyecta estado 7 generaciones adelante
// - computeGlobalCoherence devuelve 0-100 para mapa de nodos
// - runFullPipeline ejecuta pipeline completo y devuelve resultado coherente
// - Ley MJ gates bloquean ejecución si no se cumplen
// - Graceful degradation: nodo fallido no rompe el pipeline
```

---

## 7. VERIFICACIÓN (checklist)

- [ ] `buildFractalTree` implementado y probado (árbol N1→N2→N3→Cell)
- [ ] `computeSymbiosis` implementado y probado (ln(d+1)/ln(4))
- [ ] `runPmcrCycle` implementado (5 fases PMCRT por nodo)
- [ ] `propagateFeedback` implementado (simbiosis logarítmica entre niveles)
- [ ] `attenuateDecision` implementado (atenuación entre niveles)
- [ ] `projectTransgenerational` implementado (proyección 7 gen)
- [ ] `computeGlobalCoherence` implementado (coherencia 0-100)
- [ ] `runFullPipeline` implementado (pipeline completo)
- [ ] Fondos 15/50/35 aplicados en cada nivel
- [ ] Una persona, un voto en deliberación de cada nodo
- [ ] Consejo de Futuros con veto suspensivo
- [ ] Ley MJ I/II/III validados en cada fase
- [ ] Graceful degradation probado
- [ ] Typescript 0 errores (`npx tsc --noEmit`)

---

### Notas de derechos de autor

Esta especificación reimplementa conceptos de Virginia Network (spec 45), PMCRT (spec) y Pipeline Anidado (docs) como una nueva especificación OpenSpec bajo MIT. No copia código fuente existente. Los conceptos se atribuyen a las fuentes originales del repo Zeitnus.