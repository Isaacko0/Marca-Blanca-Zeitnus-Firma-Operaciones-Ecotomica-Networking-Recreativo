# INTEGRACIÓN: REFLEXIÓN AUTONOMÍA ANFIBIA POSTMONETARIA → HSCSG v15 OS (Decisiones EBD + Especificaciones Técnicas)

**Fecha:** 2026-11-08  
**Fuente:** `docs/autonomia_anfibia_reflection_backup.md` (160ª integración)  
**Metodología:** EBD (Evidence-Based Design) — Cada decisión trazable a fuente usuario/análisis  
**Vasos comunicantes:** 18 activados (ver backup §4)

---

## 1. DECISIONES EBD (Evidence-Based Design) — REFLEXIÓN AUTONOMÍA ANFIBIA

| ID | Decisión | Justificación (Fuente) | Módulo Afectado | Prioridad |
|----|----------|------------------------|-----------------|-----------|
| **AAN-D1** | **Autonomía Anfibia = Principio Arquitectónico Central (no feature opcional)** | Usuario: "modelo de autonomía anfibio monetario postmonetario" + Análisis: dual vía dinero amortiguador + ecológico | `valueDual.ts`, `nodeMode`/`priceParity` en store, `boundaries.ts` | **P0** |
| **AAN-D2** | **TQ = Ancla Termodinámica Anti-Servidumbre (Capa 1 Soberana)** | Usuario: "servidumbre contratada implícita en el dinero" + Análisis: 1 TQ = 1 kWh inmutable = unidad no coercitiva | `src/core/state/tq.ts` (HARD CODED) | **P0** |
| **AAN-D3** | **ZNU Anfibia = Implementación Técnica "Dinero Amortiguador"** | Usuario: "recursos financieros de uso decreciente de dinero" + Análisis: nodeMode postmonetario/conectado | `src/core/state/znu.ts` | **P0** |
| **AAN-D4** | **Boundaries.ts = Escáner Matrioska 7 Capas (Detección Captura)** | Análisis: 7 capas (monetaria, laboral, info, legal, ecológica, psico, tech) → 19 reglas DENY | `src/core/lib/boundaries.ts` | **P0** |
| **AAN-D5** | **Evidence Model = Validador Anti-Seudoinovación/Propaganda/Estafa** | Usuario: "lo demás es efímero... degenerado en trabajo lábil, propaganda y estafa" + Análisis: Fact Bands, no confidence | `src/core/lib/evidence.ts` (IMPLEMENTADO) | **P0** |
| **AAN-D6** | **CDS + CDS_Jurados = Coordinación Horizontal Verificable (Anti-Captura)** | Usuario: "falta de coordinación horizontal... conformidad seudoinovadora" + Análisis: sorteo, anonimato, rotación, pesos acotados | `src/core/lib/cds_jurados.ts` + `src/core/lib/integral.ts` | **P0** |
| **AAN-D7** | **Symbiosky = Fluidez Adaptativa Sin Captura (Conviction Voting + Decay + Anti-Whale)** | Usuario: "fluidez adaptativa... fricción decreciente de coerción... sinergia sin captura" | `src/core/lib/symbiosky.ts` | **P0** |
| **AAN-D8** | **Autómata Soberano = Automatización Desmercantilizadora (E²R + MJ Gate)** | Usuario: "automatización... delegados a la física y la naturaleza... no trabajo lábil" + Leyes MJ | `src/core/lib/automaton.ts` + `src/core/state/automaton.ts` | **P0** |
| **AAN-D9** | **Mitosis + Handshake Capa 0 = Duplicabilidad Responsiva + Convergencia No-Coercitiva** | Usuario: "duplicabilidad responsiva... pseudoincompatible siempre colaboraré... compatibles converger sinergia" | `src/core/lib/propagationModels.ts` (handshake) + Zeitnus v15.1 | **P0** |
| **AAN-D10** | **RMR 7 Indicadores = Capacidad Ecológica/Comunal Medida (vs Gasto Monetario)** | Usuario: "métricas falsas: medir autonomía solo por gasto monetario y no por dependencia real" | `docs/ovn_hscsg_comparative_analysis_integration.md` + `/base` screen | **P0** |
| **AAN-D11** | **GoodType:luxury Redefinido = Calidad Vida Delegada a Física/Naturaleza/Automatización** | Usuario: "lujos serán el desafío aceptado de descubrir lujos para entornos armónicos delegados a la física y la naturaleza" | `src/core/lib/copiosis.ts` + `src/core/lib/solarpunk.ts` + `signalType.FREE` | **P0** |
| **AAN-D12** | **SignalType.FREE = Invitaciones Juego/Arte/Tecnología = Lujo No-Coercitivo** | Fos 2009 (passionnement teatralidad) + Usuario: "lujos... entornos armónicos" + FAL-D4 | `src/core/lib/signalTypes.ts` + `src/core/lib/stigmergicCoordination.ts` | **P0** |
| **AAN-D13** | **Modo Lucidez 2.0 = Transparencia Radical Activable = Anti-Propaganda** | Usuario: "propaganda... seudoinovación" + Análisis: toggle real, datos crudos + provenance | `src/app/screens/*.tsx` (lucidez-raw blocks) | **P0** |
| **AAN-D14** | **Fase 0 Proto-CO = Validación Empírica Anti-Romanticismo Postmonetario** | Análisis: "romanticismo postmonetario: subestimar necesidades monetarias transición" | Hoja de Ruta §10 Fase 0 | **P0** |
| **AAN-D15** | **Métricas Autónoma = CAC 13 vectores + IVC + PGS + RMR (NO solo gasto monetario)** | Usuario: "métricas falsas... dependencia real" + Análisis: 13 vectores + 7 RMR | `src/core/lib/metrics.ts` + `src/core/state/metrics.ts` | **P0** |
| **AAN-D16** | **Leyes MJ I-III = Constitución Ontológica Anti-Servidumbre** | Usuario: "metametafísica existencial... servidumbre y opresión vital" | `src/core/lib/automaton.ts` (evaluateMJGate) | **P0** |
| **AAN-D17** | **Pipeline Anidado 3 Capas = Fluidez Adaptativa / Reglas Revisables** | Usuario: "fluidez adaptativa: reglas revisables, no dogma" | `src/core/lib/pipeline.ts` + `src/core/lib/connector.ts` | **P0** |
| **AAN-D18** | **5 Puentes Permitidos = Sinergia Sin Captura / Colaboración Sin Absorción** | Usuario: "sinergia sin captura: colaborar sin absorber" + TQ-Gaia boundaries | `src/core/lib/boundaries.ts` (ALLOW rules) | **P0** |
| **AAN-D19** | **Talent Market + Colaberry + Learning Layers = Polímata Individual Creciente** | Usuario: "Polimata individualidad creciente... más capacidad juicio, no más dependencia expertos" | `src/core/lib/learningLayers.ts` + `src/core/lib/agentProfile.ts` + `src/core/lib/colaberry.ts` | **P1** |
| **AAN-D20** | **Glosario Operativo = Desambiguación Conceptual (Anti-Ambigüedad)** | Análisis: "adopción étnica, metametafísica, lo idéntico en lo diferente necesitan definiciones operativas" | Anexo A Glosario + EBD decisions | **P1** |

---

## 2. ESPECIFICACIONES TÉCNICAS ACCIONABLES

### 2.1 Boundaries.ts — Extensión: Escáner Matrioska 7 Capas (AAN-D4)

```typescript
// src/core/lib/boundaries.ts — EXTENDER DEFAULT_BOUNDARY_POLICY

// NUEVAS reglas DENY para capas matrioska no cubiertas por TQ-Gaia
const MATRIOSHKA_DENY_RULES = [
  // Capa Laboral
  'forced_labor_contracts',      // trabajo lábil coercitivo
  'time_theft_as_productivity',  // "tiempo ganado" = más trabajo
  'wage_dependency_traps',       // trampas dependencia salarial
  
  // Capa Informacional
  'propaganda_as_metrics',       // métricas vacías = propaganda
  'pseudoinnovation_signaling',  // seudoinovación como señal
  'scam_patterns',               // patrones estafa
  
  // Capa Institucional-Legal
  'permit_gatekeeping',          // permisos como coerción
  'property_enclosure',          // propiedad como cercamiento
  'administrative_coercion',     // coerción administrativa
  
  // Capa Ecológica Externalizada
  'unaccounted_waste',           // residuos no contabilizados
  'resource_depletion_external', // agotamiento externalizado
  'ecological_footprint_hidden', // huella oculta
  
  // Capa Psicológica-Cultural
  'conformity_enforcement',      // conformidad forzada
  'fear_based_compliance',       // cumplimiento por miedo
  'consumer_identity_imposition',// identidad consumista impuesta
  'obedience_training',          // entrenamiento obediencia
  
  // Capa Tecnológica
  'platform_dependency',         // dependencia plataformas
  'surveillance_creep',          // vigilancia rampante
  'black_box_governance',        // cajas negras gobernanza
];

// Reglas ALLOW existentes (2) + NUEVAS para matrioska
const MATRIOSHKA_ALLOW_RULES = [
  'tq_catalog_reference',        // existente
  'tq_visible_link',             // existente
  'ecological_capacity_sharing', // compartir capacidad ecológica
  'automation_transparency',     // transparencia automatización
  'governance_audit_trail',      // auditoría gobernanza
  'emergent_result_sharing',     // compartir resultados emergentes
  'non_coercive_collaboration',  // colaboración no coercitiva
];

// Función de detección captura matrioska
function detectMatrioskaCapture(action: Action, context: Context): MatrioskaViolation[] {
  const violations: MatrioskaViolation[] = [];
  
  for (const rule of MATRIOSHKA_DENY_RULES) {
    if (matchesRule(action, context, rule)) {
      violations.push({
        layer: getLayerForRule(rule), // 'monetaria' | 'laboral' | 'informacional' | 'institucional' | 'ecologica' | 'psicologica' | 'tecnologica'
        rule,
        severity: calculateSeverity(action, context, rule),
        timestamp: Date.now(),
        context: extractRelevantContext(context)
      });
    }
  }
  
  return violations;
}

// Integración con checkBoundaryViolation existente
function checkBoundaryViolation(violationType: string, context: any): BoundaryCheckResult {
  // ... lógica existente TQ-Gaia ...
  
  // NUEVO: escáner matrioska
  const matrioskaViolations = detectMatrioskaCapture(context.action, context);
  if (matrioskaViolations.length > 0) {
    return {
      allowed: false,
      violations: [...existingViolations, ...matrioskaViolations],
      matrioskaCapture: true,
      recommendedAction: 'reject_and_audit'
    };
  }
  
  return { allowed: true, violations: [] };
}
```

### 2.2 Evidence Model — Extensión: Fact Bands para Matrioska (AAN-D5)

```typescript
// src/core/lib/evidence.ts — EXTENDER

// NUEVOS Fact Bands específicos matrioska
enum MatrioskaFactBand {
  VERIFIED_ECOLOGICAL = 'verified_ecological',       // Capacidad ecológica verificada SVD v2
  VERIFIED_AUTONOMY = 'verified_autonomy',           // AUT vector ≥ threshold
  VERIFIED_NON_COERCIVE = 'verified_non_coercive',   // CDS + Evidence Model pass
  VERIFIED_EMERGENT = 'verified_emergent',           // Resultado emergente validado
  PSEUDOINNOVATION = 'pseudoinnovation',             // Seudoinovación detectada
  PROPAGANDA_DETECTED = 'propaganda_detected',       // Propaganda en métricas/comms
  SCAM_PATTERN = 'scam_pattern',                     // Patrón estafa
  CAPTURE_INDICATOR = 'capture_indicator',           // Indicador captura gobernanza
  EXTERNALIZED_COST = 'externalized_cost',           // Costo externalizado (ecológico/social)
  MATRIOSHKA_VIOLATION = 'matrioska_violation',      // Violación capa matrioska
}

// Extender scoreEvidence para matrioska
function scoreEvidenceMatrioska(evidence: Evidence, context: MatrioskaContext): ScoredEvidence {
  const baseScore = scoreEvidence(evidence);
  
  // Penalizar si no hay verificación ecológica SVD v2
  if (!hasSVDVerification(evidence, context)) {
    baseScore.confidence *= 0.5;
    baseScore.band = MatrioskaFactBand.EXTERNALIZED_COST;
  }
  
  // Penalizar si hay captura matrioska
  const captureScore = detectMatrioskaCapture(evidence.action, context);
  if (captureScore.length > 0) {
    baseScore.confidence *= 0.3;
    baseScore.band = MatrioskaFactBand.MATRIOSHKA_VIOLATION;
    baseScore.detail = captureScore.map(v => `${v.layer}:${v.rule}`).join('; ');
  }
  
  // Bonificar si hay autonomía verificada
  if (hasAutonomyVerification(evidence, context)) {
    baseScore.confidence = Math.min(1.0, baseScore.confidence * 1.2);
    baseScore.band = MatrioskaFactBand.VERIFIED_AUTONOMY;
  }
  
  return baseScore;
}
```

### 2.3 ValueDual.ts — Principio Anfibio: Lujo Redefinido (AAN-D11)

```typescript
// src/core/lib/valueDual.ts — EXTENDER

// Redefinición de lujo postmonetario
interface LuxuryRedefinition {
  // Lujo NO = consumo ostentoso
  // Lujo = calidad de vida delegada a física/naturaleza/automatización
  
  physicalDelegation: {
    passiveHouse: boolean;           // Earthship 6 vectores → confort térmico pasivo
    renewableEnergyAutonomy: boolean; // Microgrid solar/H2 → energía "gratis" tras CAPEX
    waterCycleClosure: boolean;       // Captación/tratamiento/ciclo cerrado → agua "gratis"
    foodForestPerennial: boolean;     // Huerta regenerativa perenne → comida "gratis"
  };
  
  natureDelegation: {
    ecosystemServicesValued: boolean; // Servicios ecosistémicos contabilizados (RMR)
    biodiversityIndex: number;        // Índice biodiversidad local
    carbonSequestration: number;      // Secuestro carbono verificado
  };
  
  automationDelegation: {
    fabshepModulesActive: string[];   // Módulos FABSHIP operativos (cnc, biofab, etc.)
    laborHoursReduced: number;        // Horas trabajo lábil reducidas por automatización
    maintenanceAutomated: boolean;    // Mantenimiento predictivo automatizado
  };
  
  // Métrica compuesta: Lujo = Σ(delegaciones) / trabajo_lábil_restante
  luxuryIndex: number; // 0-100
}

// En displayValue: si nodeMode='postmonetario' y goodType='luxury'
// mostrar luxuryIndex + desglose delegaciones, NO precio NBR/USD
function displayLuxuryPostmonetary(luxury: LuxuryRedefinition, nodeMode: NodeMode): string {
  if (nodeMode === 'postmonetario') {
    return `🏆 Lujo Índice: ${luxury.luxuryIndex}/100\n` +
           `🏠 Física: ${formatDelegation(luxury.physicalDelegation)}\n` +
           `🌿 Naturaleza: ${formatDelegation(luxury.natureDelegation)}\n` +
           `🤖 Automatización: ${formatDelegation(luxury.automationDelegation)}`;
  }
  // Modo conectado: mostrar precio USD/USDC vía priceParity + luxuryIndex
  return `$${luxury.priceUSD} | Índice: ${luxury.luxuryIndex}`;
}
```

### 2.4 SignalTypes.ts — SignalType.FREE para Lujo No-Coercitivo (AAN-D12)

```typescript
// src/core/lib/signalTypes.ts — EXTENDER (ya existe en FAL-D4)

enum SignalType {
  TRACING = 'tracing',
  ALARM = 'alarm',
  PRIMING = 'priming',
  FREE = 'free',  // NUEVO: invitaciones juego/arte/tecnología/lujo armónico
}

// Definición semántica FREE
interface FreeSignal {
  type: 'invitation' | 'play' | 'art' | 'tech_exploration' | 'harmonic_luxury';
  inviter: string;           // ERC-8004 identity
  context: 'social' | 'learning' | 'production' | 'regeneration';
  coercionLevel: 0;          // SIEMPRE 0 = no coerción
  resourceCost: 'zero' | 'autonomy_credit'; // Costo en créditos autonomía (no dinero)
  emergentPotential: number; // 0-1: potencial resultado emergente
  adoptedEthically: boolean; // Usuario adopta éticamente resultado
}

// Integración con Stigmergic Coordination
function emitFreeSignal(signal: FreeSignal): StigmergicTrace {
  return {
    type: SignalType.FREE,
    payload: signal,
    timestamp: Date.now(),
    coordinates: getCurrentCoordinates(), // ubicación física/virtual
    // NO genera deuda, NO quema NBR, SOLO registra en RAO
    raoEntry: {
      type: 'free_signal',
      signal,
      verification: 'self_reported' // Lucidez: usuario reporta qué observó
    }
  };
}

// Lujo armónico = señal FREE con type='harmonic_luxury'
// Ej: invitación a usar sauna solar comunitaria, taller biofab, concierto en huerta
```

### 2.5 PropagationModels.ts — Handshake Generativo = Convergencia No-Coercitiva (AAN-D9)

```typescript
// src/core/lib/propagationModels.ts — EXTENDER (ya existe en Bloque 3)

// Handshake Generativo v2.0: compatibilidad como RESULTADO, no precondition
interface GenerativeHandshakeV2 {
  phase: 'bootstrap' | 'handshake' | 'sync' | 'autonomous';
  
  // Fase handshake: transformación estructural mutua (72h)
  handshake: {
    durationHours: 72;
    participants: [ERC8004Identity, ERC8004Identity]; // nodo padre + nodo candidato
    metrics: {
      // Compatibilidad se CULTIVA durante handshake
      structuralTransformation: TransformationMetric[];
      mutualRecognition: RecognitionProtocol;
      emergentCompatibility: number; // 0-1: resultado handshake
    };
    // Criterio éxito: verbalización kWh↔biomasa SIN explicación externa
    successCriterion: 'verbalized_equivalence_kwh_biomass_without_explanation';
  };
  
  // Mitosis: nodo hijo nace CON capacidad handshake
  mitosis: {
    childBornWith: {
      kit72h: Kit72Hv2;           // Recipiente 10L + LED + medidor + Spirulina
      handshakeCapability: true;  // Primer acto = handshake con padre
      autonomyVectors: AUTVector[]; // Medidos durante handshake
    };
    // Pseudoincompatibilidad → colaborar cuando condiciones se den
    // Incompatibilidad real → no fusionar, mantener puentes permitidos
    pseudoincompatibilityProtocol: {
      maintainBridges: boolean;     // 5 puentes permitidos activos
      collaborateWhenConditionsMet: Condition[];
      noForcedIntegration: true;
    };
  };
}

// Convergencia sinergia (usuario: "si en el fondo son compatibles no me rendiré en converger sinergia")
function convergeSynergy(nodeA: Node, nodeB: Node): ConvergenceResult {
  const handshakeResult = executeGenerativeHandshake(nodeA, nodeB);
  
  if (handshakeResult.emergentCompatibility > 0.7) {
    return {
      action: 'merge_synergy',
      bridges: ACTIVATE_ALL_BRIDGES, // 5 puentes permitidos
      sharedGovernance: createSharedCDS(nodeA, nodeB),
      sharedEconomy: createDualWalletSystem(nodeA, nodeB),
    };
  } else if (handshakeResult.emergentCompatibility > 0.3) {
    return {
      action: 'pseudoincompatible_collaborate',
      bridges: ACTIVATE_SELECTIVE_BRIDGES, // data + invitations + clearing
      conditions: handshakeResult.conditionsForFullConvergence,
    };
  }
  
  return {
    action: 'maintain_bridges_only',
    bridges: ['tq_catalog_reference', 'tq_visible_link'], // mínimos
  };
}
```

### 2.6 RMR + Metrics — 7 Indicadores vs Gasto Monetario (AAN-D10, AAN-D15)

```typescript
// src/core/lib/metrics.ts — EXTENDER

// RMR ya definido en FAL-D12, aquí integración con métricas autonomía
interface AutonomyMetrics {
  // 13 vectores CAC (incluye RMR 7)
  cacVectors: {
    ALIM: number; ENER: number; HABI: number; AGUA: number;
    SALU: number; PROD: number; GOBE: number; SOCI: number;
    FINA: number; CONO: number; PSIC: number; ESTE: number; RMR: number;
  };
  
  // Métricas compuestas
  CAC: number;           // media geométrica 13 vectores
  IVC: number;           // 1 - σᵤ×(1-η)×(1-ξ_norm)
  PGS: number;           // CAC × η_fed × ξ_colectivo
  
  // NUEVO: Dependencia Real vs Gasto Monetario
  realDependencyIndex: number;    // 0-1: dependencia real (no gasto)
  monetarySpendingRatio: number;  // gasto USD / ingreso USD (métrica legado)
  autonomyPerMonetaryUnit: number; // CAC / gasto monetario (eficiencia)
  
  // Validación: realDependencyIndex < 0.2 = autonomía real
  // NO usar monetarySpendingRatio como proxy de autonomía
}

function calculateRealDependencyIndex(node: Node): number {
  // Basado en: % necesidades cubiertas por capacidad local (RMR)
  // + % gobernanza autónoma (CDS maturity)
  // + % energía autónoma (AUT_ENER)
  // + % alimentación autónoma (AUT_ALIM)
  // NO basado en: gasto en USD, ahorro en USD, ingresos en USD
  
  const rmrScore = average(node.rmrIndicators);
  const cdsMaturity = node.cds.maturity;
  const energyAutonomy = node.cacVectors.ENER / 5.0;
  const foodAutonomy = node.cacVectors.ALIM / 5.0;
  
  return 1 - (rmrScore * 0.4 + cdsMaturity * 0.3 + energyAutonomy * 0.15 + foodAutonomy * 0.15);
}
```

### 2.7 Glosario Operativo — Desambiguación Conceptual (AAN-D20)

```markdown
# ANEXO A: GLOSARIO UNIFICADO — ENTRADAS NUEVAS (AAN-D20)

| Término | Definición Operativa | Sección | Fuente |
|---------|---------------------|---------|--------|
| **Autonomía Anfibia** | Capacidad de operar en modo postmonetario (default, offline, ZNU/CaaS) Y modo conectado (puente USD/USDC vía priceParity ReFi Nivel 3) SIN duplicar lógica de cálculo. Mismo `Value {amount, unit}`, render decide etiqueta. MJ Gate bloquea ventas externas ciegas. | §3, §11, §14, §20 | Usuario + DeseOS + Análisis |
| **Servidumbre Contratada Implícita** | Dependencia coercitiva emergente del uso de dinero fiduciario: deuda, alquiler, salario, permisos, escasez artificial. Medible via `realDependencyIndex` (no gasto monetario). | §1, §13 | Usuario |
| **Lujo Armónico** | Calidad de vida delegada a física (Earthship, microgrid), naturaleza (servicios ecosistémicos RMR) y automatización (FABSHIP). Métrica: `luxuryIndex` = Σ(delegaciones) / trabajo_lábil_restante. NO = consumo ostentoso. `goodType:luxury` + `signalType.FREE`. | §4, §14, §20 | Usuario + Fourier (FAL-D4) |
| **Trabajo Lábil** | Trabajo repetitivo, no creativo, coercitivo por necesidad monetaria. Objetivo: reducir a 0 vía automatización desmercantilizadora (Autómata + FABSHIP) + necesidades gratis (CaaS Tier 1). | §1, §10 | Usuario |
| **Pseudoincompatibilidad** | Diferencias superficiales (terminología, forma, ritmo) que NO impiden convergencia sinérgica. Protocolo: mantener puentes permitidos, colaborar cuando condiciones se den, no forzar integración. | §16, §20 | Usuario |
| **Incompatibilidad Real** | Diferencias fundamentales en Leyes MJ, principios ontológicos, límites duros (boundaries.ts DENY). Protocolo: no fusionar, mantener puentes mínimos (referencia + visible link). | §16, §17 | Análisis + Boundaries |
| **Matrioska-Sistema Exterior** | 7 capas de captura sistémica: Monetaria, Laboral, Informacional, Institucional-Legal, Ecológica Externalizada, Psicológica-Cultural, Tecnológica. Detectable via `boundaries.ts` escáner extendido. | §2, §17 | Análisis |
| **Metametafísica Existencial** | Indagación sobre condiciones ontológicas de existencia no servil. En HSCSG: operacionalizada via Leyes MJ I-III + Sistema Alráico G1-CARMIS + TQ ancla termodinámica. | §2 | Usuario |
| **Adopción Ética de Resultados Emergentes** | Validación via Evidence Model (Fact Bands VERIFIED_EMERGENT) + CDS_Jurados + Symbiosky conviction voting. NO adopción ciega, NO adopción por carisma. | §1, §9 | Usuario + Evidence Model |
| **Fricción Decreciente de Coerción** | Métrica: `coercionFrictionIndex` = (decisiones CDS unánimes + evidence VERIFIED + matrioska violations 0) / total decisiones. Target: tendencia decreciente. | §5 | Usuario |
| **Polímata Individual Creciente** | Individuo con capacidad de juicio transversal creciente (Autómata + Talent Market + Colaberry + Learning Layers), reduciendo dependencia de expertos centralizados. | §5 | Usuario |
| **Duplicabilidad Responsiva** | Cualquiera puede replicar núcleo (Kit 72H v2.0 + handshake generativo) en < 72h, con ciclos feedback < 28d (epoch), margen error acotado (fallos localizados). | §5 | Usuario + Zeitnus v15.1 |
```

---

## 3. ACTUALIZACIONES BRIEF EXHAUSTIVO (v2.2 Pendiente)

### 3.1 Sección 1.3 Genealogía — Nueva fila
| Fase | Nombre | Descripción | Estado |
|------|--------|-------------|--------|
| 2026-11-08 | **Reflexión Autonomía Anfibia** | Usuario + análisis crítico → 20 decisiones EBD, mapeo matrioska, lujo redefinido, glosario operacional | **Completado** |

### 3.2 Sección 2.3 Frameworks — Nueva fila
| Framework | Sección HSCSG | Aporte Operativo |
|-----------|---------------|------------------|
| **Reflexión Autonomía Anfibia (Usuario)** | §20, §21, §22 | 20 EBD: Principio anfibio central, TQ ancla anti-servidumbre, ZNU implementación técnica, Boundaries=escáner matrioska, Evidence Model=anti-seudoinovación, CDS=horizontalidad verificable, Symbiosky=fluidez sin captura, Autómata=automatización desmercantilizadora, Mitosis=duplicabilidad responsiva, Handshake=convergencia no-coercitiva, RMR=capacidad ecológica medida, Lujo redefinido, SignalType.FREE, Glosario operacional |

### 3.3 Sección 20 (NUEVA) — REFLEXIÓN AUTONOMÍA ANFIBIA: FUNDAMENTO FILOSÓFICO-POLÍTICO
[Ver backup + integration completos]

### 3.4 Anexo A Glosario — 12 entradas nuevas (ver §2.7)

### 3.5 Anexo B Mapeo — Nueva fila
| Repo Origen | Módulo HSCSG | Archivo `lib/` | Archivo `state/` | Pantalla | Docs Integración |
|-------------|--------------|----------------|------------------|----------|------------------|
| **Reflexión Autonomía Anfibia (Usuario)** | **20 Decisiones EBD + Mapeo Matrioska + Glosario** | **Extensiones: boundaries.ts, evidence.ts, valueDual.ts, signalTypes.ts, propagationModels.ts, metrics.ts, AutonomiaAnfibiaCore.ts (nuevo)** | _(extend existing)_ | **`/base`, `/lucidez`, `/automata`, `/circulos`, `/solarpunk`, `/integral`, `/verificacion`** | **`autonomia_anfibia_reflection_backup.md`, `autonomia_anfibia_reflection_integration.md`** |

---

## 4. ENTREGABLES ACCIONABLES GENERADOS

| Entregable | Tipo | Prioridad | Estado |
|------------|------|-----------|--------|
| `docs/autonomia_anfibia_reflection_backup.md` | Backup texto usuario + análisis crítico | **P0** | ✅ Creado |
| `docs/autonomia_anfibia_reflection_integration.md` | Integración EBD + specs técnicos + glosario | **P0** | ✅ Creado (este archivo) |
| `src/core/lib/boundaries.ts` extend: `MATRIOSHKA_DENY_RULES` (21 reglas) + `detectMatrioskaCapture()` | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/evidence.ts` extend: `MatrioskaFactBand` + `scoreEvidenceMatrioska()` | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/valueDual.ts` extend: `LuxuryRedefinition` + `displayLuxuryPostmonetary()` | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/signalTypes.ts` extend: `SignalType.FREE` semántica completa | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/propagationModels.ts` extend: `GenerativeHandshakeV2` + `convergeSynergy()` | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/metrics.ts` extend: `realDependencyIndex` + `autonomyPerMonetaryUnit` | Código P0 | **P0** | 🔄 Pendiente |
| `src/core/lib/autonomiaAnfibiaCore.ts` (NUEVO) — Módulo central orquestador | Código P0 | **P0** | 🔄 Pendiente |
| `/lucidez` screen: bloques `lucidez-raw` matrioska capture alerts | UI P0 | **P0** | 🔄 Pendiente |
| `/verificacion` screen: `realDependencyIndex` dashboard | UI P1 | **P1** | 🔄 Pendiente |
| `/solarpunk` screen: `luxuryIndex` display postmonetario | UI P1 | **P1** | 🔄 Pendiente |

---

## 5. VERIFICACIÓN CIENTÍFICA (TRAZABILIDAD EBD)

| Decisión | Fuente Usuario | Fuente Análisis | Validación Cruzada HSCSG |
|----------|----------------|-----------------|--------------------------|
| AAN-D1 | "autonomía anfibia monetario postmonetario" | Núcleo propuesta | valueDual.ts + nodeMode + boundaries.ts |
| AAN-D2 | "servidumbre contratada implícita en el dinero" | Libertad material vs formal | TQ 1kWh inmutable + MJ Gate |
| AAN-D3 | "recursos financieros uso decreciente dinero" | Capa anfibia técnica | ZNU nodeMode postmonetario/conectado |
| AAN-D4 | "matrioska-sistema exterior... 7 capas" | 7 capas detectadas | boundaries.ts 19 DENY + 21 MATRIOSHKA DENY |
| AAN-D5 | "propaganda y estafa... trabajo lábil" | Anti-seudoinovación | Evidence Model Fact Bands + Score Schelling |
| AAN-D6 | "falta coordinación horizontal... conformidad" | Horizontalidad verificable | CDS_Jurados (sorteo, anonimato, rotación) |
| AAN-D7 | "fluidez adaptativa... sinergia sin captura" | Conviction voting + decay | Symbiosky implementado |
| AAN-D8 | "automatización delegada a física/naturaleza" | Desmercantilización | Autómata E²R + MJ Gate + FABSHIP |
| AAN-D9 | "duplicabilidad... pseudoincompatible colaborar... compatibles converger" | Mitosis + handshake | Zeitnus v15.1 Capa 0 generativo |
| AAN-D10 | "métricas falsas... dependencia real" | RMR vs gasto monetario | CAC 13 + RMR 7 + realDependencyIndex |
| AAN-D11 | "lujos... delegados a física/naturaleza/automatización" | Lujo redefinido | goodType:luxury + luxuryIndex + signalType.FREE |
| AAN-D12 | "entornos armónicos... no coercitivo" | Signal FREE | Stigmergic coordination + RAO |
| AAN-D13 | "propaganda... seudoinovación" | Modo Lucidez 2.0 | lucidez-raw blocks + Evidence Model |
| AAN-D14 | "romanticismo postmonetario" | Fase 0 Proto-CO | 10 casos beta, 90 días, experimento €30/72h |
| AAN-D15 | "autonomía solo por gasto monetario" | Métricas compuestas | CAC + IVC + PGS + RMR (no USD) |
| AAN-D16 | "metametafísica existencial... servidumbre" | Leyes MJ I-III | Constitución autómata + G1-CARMIS |
| AAN-D17 | "reglas revisables, no dogma" | Pipeline 3 capas | Pipeline anidado + Conector Flujo |
| AAN-D18 | "colaborar sin absorber" | 5 puentes permitidos | Boundaries ALLOW rules |
| AAN-D19 | "Polimata individual creciente" | Talent Market + Learning | Bloque 2-3 implementado |
| AAN-D20 | "adopción étnica, metametafísica, lo idéntico en lo diferente" | Glosario operativo | Anexo A 12 entradas nuevas |

---

## 6. PRÓXIMOS PASOS (SECUENCIA ESTRICTA)

1. **Implementar 9 extensiones código P0** (listadas en §4) — Bloque 4 parcial
2. **Crear `src/core/lib/autonomiaAnfibiaCore.ts`** — Orquestador central (importa boundaries, evidence, valueDual, signalTypes, propagationModels, metrics)
3. **Actualizar BRIEF_EXHAUSTIVO a v2.2** — Integrar §20, §21, §22, glosario, mapeo
4. **Validar Fase 0 Proto-CO** — 10 casos beta usan `realDependencyIndex` + `luxuryIndex` + matrioska scanner
5. **Commit + Push** — Mensaje: "feat(autonomia-anfibia): 20 EBD + matrioska scanner + lujo redefinido + glosario operacional"

---

**Nota derechos de autor:** Texto original del usuario (Isaac Ko) + análisis crítico derivado. Ambos propiedad intelectual del autor. Para uso interno HSCSG: integrar decisiones EBD y código. No se reproducen textos de terceros con copyright.