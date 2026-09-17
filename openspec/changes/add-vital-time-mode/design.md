# Design: FASE 1 — Integración Core Moneda Tiempo Vital (Refactor Limpio)

**Change**: add-vital-time-mode  
**Fecha**: 2026-09-15  
**Principio**: Refactor completo eliminando duplicados, alineado a Bio-Tesis MAESTRA v2.0

---

## Arquitectura General (Limpia)

```
HSCSG v15 OS Stack (FASE 1 Refactor)
├── openspec/                          # Specs vivas OpenSpec (alineadas Bio-Tesis v2.0)
│   ├── specs/
│   │   ├── vital-time-currency.md     # Spec moneda tiempo vital
│   │   ├── nexo-architecture.md       # Spec arquitectura NEXO 8 capas
│   │   ├── kernel-protocol.md         # Spec kernel v214 + 32 VIAs
│   │   └── triaxial-verification.md   # Spec verificación triaxial
│   └── changes/add-vital-time-mode/   # Change FASE 1 (proposal+design+tasks)
├── src/core/lib/
│   ├── valueDual.ts                   # Anfibio: ZNU/USD/hr_vital (3 modos) ✅ REFACTOR
│   ├── loopEngine.ts                  # Loop 7 VitalTimeMint + Alráico ✅ REFACTOR
│   ├── metrics.ts                     # VitalTimeFlow + IST 18 comp ✅ REFACTOR
│   ├── vitalTime.ts                   # Tipos base LIMPIOS (sin duplicados) 🔴 REFACTOR CRÍTICO
│   ├── vitalTimeTriaxial.ts           # verifyTriaxial() LIMPIO 3 ejes 🔴 REFACTOR CRÍTICO
│   ├── vitalTimeTransduction.ts       # Transducción F LIMPIA 🔴 REFACTOR CRÍTICO
│   ├── kernelProtocol.ts              # Kernel unificado + VIA00-31 + Consola VIA-0 ✅ NUEVO
│   ├── bt213KernelLimits.ts           # Límite kernel BT213 ✅ NUEVO
│   ├── humanArtificer.ts              # Humano artífice BT214 ✅ NUEVO
│   ├── mk1Ontology.ts                 # MK-1 ontología fractal ✅ NUEVO
│   ├── hogueraAFPEnlace.ts            # La Hoguera, AFP, El Enlace ✅ NUEVO
│   └── viaProtocols.ts                # 32 VIAs ejecutables ✅ NUEVO
├── src/governance/
│   └── vitalTimeInvariants.ts         # Invariantes blindados organizados 🔴 REFACTOR CRÍTICO
├── src/core/state/
│   └── store.ts                       # + vitalTime en AppState 🔴 REQUERIDO
└── docs/
    ├── VITAL_TIME_CURRENCY_SPEC.md    # Spec v1.0 alineada Bio-Tesis
    └── BIO_THESIS_NEXO_ARCHITECTURE.md # Arquitectura NEXO documentada
```

---

## valueDual.ts — Arquitectura Anfibia 3 Modos (REFACTOR)

### Tipos
```typescript
export type ValueUnit = 'ZNU' | 'USD' | 'hr_vital'
export type NodeMode = 'postmonetario' | 'conectado' | 'vital_time'
```

### Funciones Clave (Principio Anfibio: misma lógica, render decide etiqueta)
- `displayValueUnified(amount, mode, parity)` — Render agnóstico a unidad
- `vitalTimeRotate(balance, protected, daysSinceActivity, rotationDays=30)` — Pool fijo=1
- `vitalTimeDecay(balance, ratePerDay, daysSinceActivity)` — 10%/año por inactividad
- `vitalTimeShare(balance, totalSupply)` — Fracción sobre pool fijo=1
- `vitalTimeConcentration(balance, totalSupply, threshold=0.05)` — Alerta concentración

---

## loopEngine.ts — Loop 7 VitalTimeMint + Alráico (REFACTOR)

### Loop 7: vitalTimeMintLoop()
```typescript
function vitalTimeMintLoop(st: AppState): Partial<AppState>
```
**Requiere**: `st.vitalTime.nodes` en AppState (store.ts)

**Lógica** (respeta Kernel §13 + Humano §14):
1. Para cada nodo en `st.vitalTime.nodes`:
   - Calcula `daysSinceActivity`
   - Si `daysSinceActivity >= rotationDays` (default 30):
     - **Kernel §13**: Kernel NO decide mint, solo organiza rastros
     - **Humano §14**: Requiere verificación triaxial + 2 dominios + responsabilidad firmada
     - Si pasa: ejecuta `vitalTimeRotate()` → libera exceso, incrementa `triaxialVerificationCount`
     - Si no pasa: alerta `pendingVerifications` (kernel notifica, humano responde)
   - Si `daysSinceActivity > 7`: aplica `vitalTimeDecay()` + `evasionReducesMargin = true` (BT164)

### Integración Alráico
- `detectOverloads()`: agrega módulo `vitalTime` (nodos sin verificación reciente > 30d)
- `simulateReconfig()`: caso `vitalTime` → alerta (kernel notifica, humano artífice responde)
- `detectResonances()`: incluye métrica `vitalTime` en resonancias (αʰ > 0.8)
- `runAlraicoTick()`: ejecuta `vitalTimeMintLoop` en array `loops`

---

## metrics.ts — VitalTimeFlow + VitalTimeActivationCost + IST 18 comp (REFACTOR)

### VitalTimeFlow (30+ campos por fuente Bio-Tesis)
```typescript
interface VitalTimeFlow {
  // Base
  mensual: TimeAmount, anual: TimeAmount, autonomyHours, careHours, learningHours
  // Kernel §13 / BT213
  kernelLimitsRespected, twoDomainsIntegrated, noConsciousnessAudit
  // Humano §14 / BT214
  responsibilityAccepted, uncertaintyAcknowledged, translationSignatureUnique, betaPerpetuaMode
  // AFP §40
  consciousEnergyVerified, contributionHours, expandedAccessActive, nbuCoveredRate, ecoImpactScore
  // BT180 / E=V §10,§20
  controlsOwnTime, consentGradientsAvg, energyFromBelowRate, notForSaleCompliance
  // BT165 / E=V §2,§4,§8
  truthAssumedAvg, truthEvadedAvg, evasionLightensDetected, presenceDensifiesRate, peaceFromAssumptionRate
  // BT164 / E=V §9
  realMarginAvg, evasionReducesMarginRate, presenceExpandsMarginRate, extractionSequestersRate, thresholdRealAvg, lagRealAvg
  // Triaxial
  triaxialDailyRate, triaxialPassRate, witnessVerificationRate
  // Pool
  rotationCompliance, demurrageHealth, concentrationAlerts
}
```

### VitalTimeActivationCost (15+ campos)
Costos específicos por fuente: BT213 (kernel limits training, 2 dominios integration) + BT214 (responsibility ceremony, uncertainty workshop, translation signature, beta perpetua onboarding) + AFP (conscious energy calibration, contribution tracking, witness network, NBU baseline).

### IST Actualizado — Media Geométrica 18 Componentes
```typescript
// Agregar a cognitive:
kernelLimitsRespected: number  // Kernel §13 respetado
humanArtificerActive: number   // Humano §14 activo

// Agregar a economic:
vitalTimeAutonomy: number      // Horas vitales liberadas
vitalTimeDemurrageHealth: number // 1 - (decay/balance)
```

---

## vitalTime.ts — Tipos Base LIMPIOS (REFACTOR CRÍTICO: ELIMINAR DUPLICADOS)

### VitalTimeNode (UNA sola definición por campo)
```typescript
interface VitalTimeNode {
  // Base
  nodeId: string
  name: string
  vitalTimeBalance: VitalTimeAmount
  protectedVitalTime: number
  lastActivity: number
  rotationDays: number
  demurrageRate: number
  triaxialVerificationCount: number
  resonanceConnections: string[]
  mode: NodeMode
  transductionEnabled: boolean
  
  // Kernel §13 / BT213: Límite Kernel (UNA sola vez)
  kernelLimits: {
    cannotAuditConsciousness: true
    onlyOrganizesTraces: true
    classifiesAssertions: 'compatible' | 'incompatible' | 'no-evaluable'
    cannotAccessDirectExperience: true
    cannotDecideTruth: true
    cannotInterpretPersons: true
    cannotDetectInternalEvasion: true
    silenceIsNeutral: true
    twoDomains: true
    debtFromEvasionEither: true
  }
  
  // Humano §14 / BT214: Artífice (UNA sola vez)
  humanArtificer: {
    role: 'magus' | 'alchemist' | 'both'
    responsibilityAccepted: boolean
    translationSignature: string
    uncertaintyAcknowledged: boolean
    betaPerpetuaMode: boolean
  }
  
  // Kernel §13 / BT213: Presencia = 2 dominios integrados (UNA sola vez)
  presenceIntegration: {
    directExperienceVerified: boolean
    sharedTracesVerified: boolean
    debtGenerated: boolean
  }
  
  // AFP §40: Pilar 3 Tiempo Vital (UNA sola vez)
  afpVitalTime: {
    consciousEnergyVerified: boolean
    contributionHours: number
    expandedAccess: boolean
    nbuCovered: boolean
    ecoImpact: number
  }
  
  // BT180 / E=V §10,§20: Poder = Tiempo Vital (UNA sola vez)
  powerAsVitalTime: {
    controlsOwnTime: boolean
    consentGradients: number
    energyFromBelow: boolean
    notForSale: boolean
  }
  
  // BT165 / E=V §2,§4,§8: Ecuación Lastre (UNA sola vez)
  ballastEquation: {
    truthAssumed: number
    truthEvaded: number
    evasionLightensToday: boolean
    presenceDensifiesNow: boolean
    totalPaidEqual: boolean
    peaceFromAssumption: boolean
  }
  
  // BT164 / E=V §9: Margen Real (UNA sola vez)
  realMargin: {
    currentMargin: number
    evasionReducesMargin: boolean
    presenceExpandsMargin: boolean
    extractionSequestersMargin: boolean
    evolutionReorganizesMargin: boolean
    thresholdReal: number
    lagReal: number
  }
}
```

### TriaxialProof (Limpio, campos requeridos por eje)
```typescript
interface TriaxialProof {
  mental: {
    operatorId: string
    timestamp: number
    signature: string
    directExperienceIntegrated: boolean
    sharedTracesIntegrated: boolean
    kernelLimitsRespected: boolean
  }
  simulation: {
    loopEngineSnapshot: LoopEngineState
    resonanceCheck: boolean
    gammaCARMISActive: boolean
    coherenceVerified: boolean
    noInternalEvasionDetected: boolean
  }
  laboratory: {
    biometricHash?: string
    eVBodyCheck: boolean
    witnessNodeId?: string
    responsibilityAccepted: boolean
    uncertaintyAcknowledged: boolean
    translationSignature: string
    betaPerpetuaMode: boolean
  }
}
```

---

## vitalTimeTriaxial.ts — verifyTriaxial() LIMPIO (REFACTOR CRÍTICO)

### verifyTriaxial(operatorId, claimedPresence, witnessNodeId?)
```typescript
export async function verifyTriaxial(
  operatorId: string,
  claimedPresence: { start: number; end: number; activity: string },
  witnessNodeId?: string
): Promise<TriaxialVerificationResult>
```

**Eje Mental (0.4) — VIA-27, VIA-25**:
- Firma operador "reconozco esta presencia"
- `directExperienceIntegrated` + `sharedTracesIntegrated` (2 dominios Kernel §13)
- `kernelLimitsRespected`: no `attemptsToAuditConsciousness`

**Eje Simulación (0.3) — VIA-25, BT213**:
- LoopEngine snapshot + γ-CARMIS + resonancias
- `coherenceVerified` + `noInternalEvasionDetected` (coherencia operativa BT213)

**Eje Laboratorio (0.3) — BT214, Humano §14**:
- `eVBodyCheck` + testigo opcional (§21)
- `responsibilityAccepted` + `uncertaintyAcknowledged` + `translationSignature` + `betaPerpetuaMode`

**Score**: `combinedScore = mental*0.4 + sim*0.3 + lab*0.3 ≥ 0.7`

---

## vitalTimeTransduction.ts — Transducción F LIMPIA (REFACTOR CRÍTICO)

### transduceTQtoVitalTime (5 Validaciones Ordenadas)
```typescript
export function transduceTQtoVitalTime(
  tqAmount: number,
  operatorAlphaH: number,
  triaxialVerified: boolean,
  kernelLimitsValidated: boolean,
  operatorResponsibilityAccepted: boolean,
  twoDomainsIntegrated: boolean
): { vitalTime: number; valid: boolean; reason?: string }
```

**Validaciones en orden (arquitectura en capas)**:
1. `triaxialVerified` — Presencia verificada (E=V §6)
2. `kernelLimitsValidated` — Kernel §13 respetado
3. `operatorResponsibilityAccepted` — Humano §14 firma responsabilidad
4. `twoDomainsIntegrated` — Presencia integra 2 dominios (Kernel §13)
5. `operatorAlphaH >= 0.6` — Resonancia suficiente (NEXO §26)

### transduceVitalTimeToTQ (Validación extra: capacidad energética)
```typescript
export function transduceVitalTimeToTQ(
  vitalTimeAmount: number,
  operatorAlphaH: number,
  triaxialVerified: boolean,
  energyCapacityKWh: number,
  kernelLimitsValidated: boolean,
  operatorResponsibilityAccepted: boolean,
  twoDomainsIntegrated: boolean
)
```
**Extra**: `energyCapacityKWh >= vitalTimeAmount` (TQ anclado a energía real §40)

---

## vitalTimeInvariants.ts — Invariantes Blindados ORGANIZADOS (REFACTOR CRÍTICO)

### Estructura por Fuente (UNA sola propiedad por invariante)
```typescript
export const VITAL_TIME_INVARIANTS = {
  // E=V §19 - Ontológicas
  nonAccumulable: true,
  nonInheritable: true,
  nonPurchasable: true,
  nonConvertible: true,
  sovereigntyExposure: true,
  replaceability: true,
  rightOfExit: true,
  traceabilityNotSurveillance: true,
  existenceVerifiabilityAccessSeparation: true,
  
  // Kernel §13
  kernelEpistemologicalLimit: true,
  kernelNoConsciousnessAudit: true,
  kernelNoDecideTruth: true,
  kernelNoInterpretPersons: true,
  kernelNoSubstitutePresence: true,
  kernelNoDetectInternalEvasion: true,
  kernelClassifiesOnly: true,
  kernelSilenceNeutral: true,
  kernelTwoDomains: true,
  kernelDebtFromEvasionEither: true,
  kernelPresenceIntegrates: true,
  
  // Humano §14
  humanArtificerRole: true,
  humanResponsibilityNonDelegable: true,
  humanPaysCost: true,
  humanTransformsTraces: true,
  humanSignatureUnique: true,
  humanUncertaintyAcknowledged: true,
  humanBetaPerpetua: true,
  aiCannotHabitate: true,
  aiCannotPayCost: true,
  aiCannotTransform: true,
  aiCannotDecideForHuman: true,
  
  // AFP §40
  afpVitalTimeConsciousEnergy: true,
  afpVitalTimeContribution: true,
  afpNbuCovered: true,
  afpExpandedAccess: true,
  afpEcoImpact: true,
  
  // BT180
  powerIsVitalTime: true,
  controlsOwnTime: true,
  consentGradients: true,
  energyFromBelow: true,
  vitalTimeNotForSale: true,
  vitalTimeInhabited: true,
  
  // BT165
  ballastEquation: true,
  evasionLightensToday: true,
  presenceDensifies: true,
  totalPaidEqual: true,
  peaceFromAssumption: true,
  umbralInfoInsufficient: true,
  afpSustainsBallast: true,
  
  // BT164
  realMarginVariable: true,
  evasionReducesMargin: true,
  presenceExpandsMargin: true,
  extractionSequestersMargin: true,
  evolutionReorganizesMargin: true,
  thresholdReal: true,
  lagReal: true,
  relationalLagReal: true,
  
  // Parámetros FIJOS
  fixedParams: { poolTotal: 1, unit: 'hr_vital', ... } as const,
  
  // Parámetros AJUSTABLES (consenso 100% + triaxial)
  adjustableParams: { rotationDays, demurrageRate, transductionThresholds, triaxialWeights, triaxialPassThreshold } as const,
  
  governanceInvariants: { consensusThreshold: 1.0, triaxialRequiredForVote: true, ... } as const
} as const
```

---

## Kernel Protocol (Nuevos Archivos - Implementación Limpia)

### kernelProtocol.ts
- `KernelProtocol` interface: cannot/can/twoDomains/threeDomains/coherence/truthLevels/nullPresence/silence
- `ConsolaVIA0` class: start/checkpoint/detectJustificationGap/closeSequence/getState
- `KernelLimits` constants (para validación en runtime)

### viaProtocols.ts
- 32 interfaces `VIA_XX` con `execute(input)` → `output`
- `VIA_REGISTRY` map + `executeVIA(viaId, input)`

### bt213KernelLimits.ts
- `KERNEL_EPISTEMIC_LIMIT` constants completos
- `validateKernelOperation(operation)` — Valida no viola límites

### humanArtificer.ts
- `HumanArtificer` interface: magus/alchemist/responsibility/transformation/uncertainty/betaPerpetua/aiLimitations
- `humanTransform(kernelTraces, operatorPresence, operatorIntent)` — Humano transforma rastros → dirección

---

## store.ts — Agregar vitalTime a AppState (REQUERIDO para loopEngine)

```typescript
// En AppState interface:
vitalTime: {
  nodes: Record<string, VitalTimeNode>
  staleAlerts: string[]
  pendingVerifications: string[]
}
```

---

## Validación Técnica (Criterios de Aceptación FASE 1)

| Criterio | Verificación |
|----------|--------------|
| **TypeScript compila sin errores** | `npx tsc --noEmit` exit code 0 🔴 CRÍTICO |
| Tests triaxiales pasan | `pnpm test` exit code 0 |
| OpenSpec validate pasa | `openspec validate --strict` exit code 0 |
| Pre-commit legal-safe pasa | `git commit` sin bloqueo |
| IST calcula 18 componentes | `calculateTerritorialSovereigntyIndex()` incluye nuevos |
| LoopEngine ejecuta Loop 7 | `runAlraicoTick()` incluye vitalTimeMintLoop |
| Transducción F válida | `transduceTQtoVitalTime(5, 0.7, true, true, true, true)` → valid=true |
| Kernel limits respetados | `validateKernelOperation()` no violations en código |
| Humano artífice requerido | `humanTransform()` firma responsabilidad |
| **Sin duplicados en vitalTime*.ts** | 0 propiedades duplicadas, 0 redeclaraciones 🔴 CRÍTICO |

---

## Traceabilidad Spec↔Código (Actualizada)

| Spec Requirement | Archivo Código | Función/Tipo |
|------------------|----------------|--------------|
| Pool fijo=1 (E=V §19) | valueDual.ts | VITAL_TIME_POOL_TOTAL = 1 |
| Rotación 30d (E=V §9) | valueDual.ts | vitalTimeRotate() |
| Decay 10%/año (E=V §8) | valueDual.ts | vitalTimeDecay() |
| Triaxial obligatoria (E=V §6) | vitalTimeTriaxial.ts | verifyTriaxial() |
| Mental 0.4 + Sim 0.3 + Lab 0.3 | vitalTimeTriaxial.ts | combinedScore weights |
| Transducción F αʰ≥0.6 (NEXO §36) | vitalTimeTransduction.ts | transduceTQtoVitalTime() |
| Kernel límites (Kernel §13) | bt213KernelLimits.ts | validateKernelOperation() |
| Humano artífice (Humano §14) | humanArtificer.ts | humanTransform() |
| Loop 7 VitalTimeMint (E=V §11) | loopEngine.ts | vitalTimeMintLoop() |
| VitalTimeFlow métricas (Bio-Tesis) | metrics.ts | calculateVitalTimeFlow() |
| IST 18 componentes (Soledad) | metrics.ts | calculateTerritorialSovereigntyIndex() |
| Test desaparición kernelLocal+artificerLocal (NEXO §25) | vitalTimeInvariants.ts | runDisappearanceTest() |
| Arquitectura Anfibia 3 modos (NEXO §25) | valueDual.ts | NodeMode = 'postmonetario'\|'conectado'\|'vital_time' |
| Corrección Horizontal (NEXO §28) | vitalTimeInvariants.ts | consensusThreshold=1.0 en núcleo |
| Mínimo Común Voluntario (NEXO §36) | vitalTimeInvariants.ts | divergenceLegitima = true |