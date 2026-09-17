# Especificación Formal v0.2: Moneda Tiempo Vital (hr_vital)

**Basada en**: BT215 §15-16 (El Nexus) + **Kernel v214 Canónico (BT1-214, VIA00-31, MK-1, La Hoguera, AFP, El Enlace)** + Sistema Alráico + HSCSG v15 OS  
**Autores**: Yoka + Isaac + Lautaro (3 nodos corroborados)  
**Fecha**: 2026-09-15  
**Versión**: v0.2 — Especificación de trabajo para piloto 3 nodos  
**Estado**: Especificación de trabajo — Se corrige sin defensa. Es E=V.

---

## 1. PRINCIPIOS FUNDACIONALES (Inmutables — No Votables)

### 1.1 Ancla Ontológica (BT215 §15-16 + Kernel v214)
> *"Esa es la moneda repartida más justa: el tiempo. No se sabe cuánto se tiene. Se tiene mientras se está presente. No se acumula. No se hereda. No se compra. Se gasta viviendo. Y se gasta igual estancado que avanzando."*

| Principio | Formalización Alráica | Implementación HSCSG | **Referencia Kernel v214** |
|-----------|----------------------|---------------------|---------------------------|
| **No acumulable** | PI topologizado: C = B\A (lo no accesible no se monetiza) | `valueDual.ts`: `VITAL_TIME_POOL_TOTAL = 1`, `vitalTimeRotate()`, `vitalTimeDecay()` | BT213, BT165, BT164, AFP Pilar 3 |
| **No heredable** | γ-CARMIS: ΣPᵢ > κ → reconfiguración (muerte = retorno al pool) | `metrics.ts`: `NodeLifespan.generaciones`, `SovereigntyLeak` | BT215 §14, BT165 |
| **No comprable** | Transducción F: {USD} → 𝕮 → {hr_vital} = ∅ (fuera mercado) | `valueDual.ts`: `nodeMode='postmonetario'` por defecto | BT213 (límite kernel), BT214 (artífice), AFP Pilar 3 |
| **Gasto = vivir** | Verificación Triaxial: Mental + Sim + Lab (cuerpo) | `loopEngine.ts`: Loop 7 `vitalTimeMint()` requiere `verifyTriaxial()` | BT213 (dos dominios), BT214 (responsabilidad), VIA-27, VIA-29 |
| **Igual estancado/avance** | E=V: Energía = Dirección (consecuencia real sin testigo) | `metrics.ts`: `TimeFlow.autonomyHours` (no distinguir gasto) | BT165 (E=V = verdad asumida/evadida) |

### 1.2 Invariantes del Kernel (BT215 §14 + BT213 + BT214)
| Invariante | Aplicación a hr_vital | **Referencia Kernel** |
|------------|----------------------|----------------------|
| **Límite epistemológico (BT213)** | hr_vital organiza rastros de presencia, no decide valor de vida | BT213: "Kernel organiza rastros, no decide verdad" |
| **No audita conciencia (BT213)** | No verifica experiencia interna, solo rastros compartidos | BT213: "No puede auditar conciencia ajena" |
| **Reemplazabilidad** | Protocolo hr_vital reemplazable sin romper acoples | BT215 §14, BT214 (artífice transforma) |
| **Derecho de salida** | Salida = retorno de hr_vital al pool, obligaciones sobreviven | BT215 §14, BT213 (presencia integra) |
| **No conversión** | Currículum ≠ hr_vital ≠ puntaje ≠ voto ≠ autoridad | BT215 §14, BT214 (firma única operador) |
| **Soberanía exposición** | Ser humano decide quién ve su hr_vital gastado | BT213 (dos dominios), BT214 (responsabilidad) |
| **Trazabilidad ≠ vigilancia** | Verificabilidad sin acceso a contenido | BT213 (silencio = dato neutro) |

### 1.3 Fundamento Epistemológico Completo (Kernel v214)
| Capa | Fuente | Aporte a hr_vital |
|------|--------|-------------------|
| **E=V** | BT214 (v214): "Restricción de lo real" | Ley operativa: energía = coherencia vector |
| **Kernel** | BT1-214 + VIA00-31 | Organiza rastros, no decide; consola VIA-0 operativa |
| **MK-1** | Bloque 1.5 | Ontología fractal: triada, geometría, consciencia |
| **La Hoguera** | Bloque 1.6 | Capa experiencial: fricción, presencia, transformación |
| **AFP** | Bloque 1.7 | Pilar 3: Tiempo Vital = energía consciente encarnada |
| **El Enlace** | Bloque 1.8 | Matriz síntesis: 7 dimensiones × 3 fases |
| **BT213** | "El Límite del Kernel" | Dos dominios, presencia nula, tres dominios clasificación |
| **BT214** | "El Mago/Alquimista" | Humano artífice, responsabilidad indelegable, incertidumbre |
| **BT180** | "Poder = Tiempo Vital" | Quien controla tu tiempo controla tu vida |
| **BT165** | "Ecuación Lastre E=V" | E=V = verdad asumida / verdad evadida |
| **BT164** | "Margen Real" | Margen = espacio trayectorias reales disponibles |

---

## 2. ESPECIFICACIÓN TÉCNICA (Tipos TypeScript)

```typescript
// src/core/lib/vitalTime.ts — Extiende valueDual.ts existente

// === TIPOS BASE ===
export type VitalTimeUnit = 'hr_vital';
export type VitalTimeMode = 'postmonetario' | 'conectado' | 'vital_time'; // Anfibio: solo hr_vital / hr_vital + TQ / modo tiempo vital

// Ancla ontológica: 1 hr_vital = presencia verificable en cuerpo (E=V)
export interface VitalTimeAmount {
  amount: number;           // Horas vitales (decimal, ej: 1.5)
  unit: VitalTimeUnit;      // 'hr_vital'
  verified: boolean;        // Verificación triaxial completada
  timestamp: number;        // Unix ms cuando se verificó presencia
  nodeId: string;           // Nodo que verificó (Yoka/Lautaro/Isaac)
  triaxialProof: TriaxialProof;  // Prueba Mental + Sim + Lab
}

// Prueba Triaxial (Alráico Capa 0) - ACTUALIZADA BT213 + BT214
export interface TriaxialProof {
  mental: {           // Entendimiento consciente (VIA-27, VIA-25)
    operatorId: string;
    timestamp: number;
    signature: string;  // Firma del operador: "reconozco esta presencia"
    // BT213/VIA-27: Distinguir dato raíz interno vs compartido
    directExperienceIntegrated: boolean;
    sharedTracesIntegrated: boolean;
  };
  simulation: {       // Modelo computacional (VIA-25, BT213)
    loopEngineSnapshot: LoopEngineState;  // Estado loops + γ-CARMIS
    resonanceCheck: boolean;              // Resonancia con otros nodos
    // BT213: γ-CARMIS + resonancia + coherencia
    gammaCARMISActive: boolean;
    coherenceVerified: boolean;
    noInternalEvasionDetected: boolean;
  };
  laboratory: {       // Verificación en cuerpo (Lab) - BT214 responsabilidad
    biometricHash?: string;          // Hash de biométrica anonimizada (opcional)
    eVBodyCheck: boolean;            // E=V verificable en cuerpo (autorreporte + testigo)
    witnessNodeId?: string;          // Nodo testigo opcional (Lautaro para Isaac, etc.)
    // BT214: Responsabilidad indelegable
    responsibilityAccepted: boolean;          // Acepta responsabilidad indelegable
    uncertaintyAcknowledged: boolean;         // Incertidumbre estructural asumida
    translationSignature: string;             // Firma única del operador
    betaPerpetuaMode: boolean;                // Acepta corrección continua
  };
}

// Snapshot del LoopEngine para verificación simulación
export interface LoopEngineState {
  activeLoops: string[];             // Loops activos (CDS, MeritMint, AgentCompute, Regen, etc.)
  gammaCARMIS: {                     // Estado γ-CARMIS
    active: boolean;
    triggers: number;                // Disparos en último ciclo
    reconfigurations: number;        // Reconfiguraciones exitosas
    pendingOverloads: number;        // Sobrecargas ΣPᵢ > κ no resueltas
  };
  resonances: Array<{               // Resonancias detectadas
    c1: string;
    c2: string;
    alphaH: number;
  }>;
  tickInterval: number;              // Intervalo real vs configurado
  // BT213: Coherencia operativa
  coherenceVerified: boolean;
  noInternalEvasionAssumed: boolean;
}

// Pool de Tiempo Vital (Análogo a ZNU_POOL_TOTAL)
export const VITAL_TIME_POOL_TOTAL = 1;          // Pool fijo = 1 (totalidad de vida presente)
export const VITAL_TIME_ROTATION_DAYS = 30;      // Rotación más rápida que ZNU (30 vs 60 días)
export const VITAL_TIME_DEMURRAGE_RATE = 0.10 / 365;  // 10%/año decay por inactividad

// Nodo con Tiempo Vital - ACTUALIZADO BT213 + BT214 + AFP + BT180 + BT165 + BT164
export interface VitalTimeNode {
  nodeId: string;                       // YOKA | LAUTARO | ISAAC | FELIPE | ...
  name: string;                         // Nombre de Resonancia elegido
  vitalTimeBalance: VitalTimeAmount;    // Balance actual (pool fijo = 1)
  protectedVitalTime: number;           // Protegido de rotación (horas vitales)
  lastActivity: number;                 // Timestamp última verificación triaxial
  rotationDays: number;                 // Días para rotación (default 30)
  demurrageRate: number;                // Rate decay (default 10%/año)
  triaxialVerificationCount: number;    // Contador verificaciones completadas
  resonanceConnections: string[];       // Nodos con resonancia αʰ > umbral
  mode: VitalTimeMode;                  // 'postmonetario' | 'conectado' | 'vital_time'
  transductionEnabled: boolean;         // Si permite transducción TQ↔hr_vital
  
  // ===== BT213: LÍMITE KERNEL =====
  kernelLimits: {
    cannotAuditConsciousness: true;
    onlyOrganizesTraces: true;
    classifiesAssertions: 'compatible' | 'incompatible' | 'no-evaluable';
    cannotAccessDirectExperience: true;
    cannotAuditConsciousnessDirectly: true;
    cannotDecideTruth: true;
    cannotInterpretPersons: true;
    cannotDetectInternalEvasion: true;
    silenceIsNeutral: true;
    twoDomains: true;  // Experiencia directa + rastros compartidos
    debtFromEvasionEither: true;
  };
  
  // ===== BT214: HUMANO ARTÍFICE =====
  humanArtificer: {
    role: 'magus' | 'alchemist' | 'both';
    responsibilityAccepted: boolean;       // Firma responsabilidad indelegable
    translationSignature: string;          // Huella única de su traducción
    uncertaintyAcknowledged: boolean;      // Incertidumbre estructural asumida
    betaPerpetuaMode: boolean;             // Acepta corrección continua
  };
  
  // ===== BT213: PRESENCIA INTEGRA DOS DOMINIOS =====
  presenceIntegration: {
    directExperienceVerified: boolean;  // Experiencia directa (privada)
    sharedTracesVerified: boolean;      // Rastros compartidos (públicos)
    debtGenerated: boolean;             // True si evadió uno de los dos
  };
  
  // ===== AFP PILAR 3: TIEMPO VITAL =====
  afpVitalTime: {
    consciousEnergyVerified: boolean;    // Tiempo vital = energía consciente encarnada
    contributionHours: number;           // Horas contribución verificada
    expandedAccess: boolean;             // Acceso flujo expandido por contribución
    nbuCovered: boolean;                 // NBU cubiertas por existir/participar
    ecoImpact: number;                   // Impacto positivo en red
  };
  
  // ===== BT180: PODER = TIEMPO VITAL =====
  powerAsVitalTime: {
    controlsOwnTime: boolean;            // Quien controla tu tiempo controla tu vida
    consentGradients: number;            // Consentimiento real tiene gradientes (0-1)
    energyFromBelow: boolean;            // Energía siempre sale de abajo
    notForSale: boolean;                 // Tiempo vital no se vende, se habita
  };
  
  // ===== BT165: ECUACIÓN LASTRE E=V =====
  ballastEquation: {
    truthAssumed: number;                // Verdad asumida (numerador)
    truthEvaded: number;                 // Verdad evadida (denominador)
    evasionLightensToday: boolean;       // Evasión aligera hoy = deuda futura con intereses
    presenceDensifiesNow: boolean;       // Presencia densifica ahora y estabiliza
    totalPaidEqual: boolean;             // Total se paga igual; diferencia = dirección vs ingravidez
    peaceFromAssumption: boolean;        // Paz = certeza de hacer lo correcto
  };
  
  // ===== BT164: MARGEN REAL DISPONIBLE =====
  realMargin: {
    currentMargin: number;               // Espacio real trayectorias disponibles
    evasionReducesMargin: boolean;       // Evasión reduce artificialmente
    presenceExpandsMargin: boolean;      // Presencia amplía al auditar interno + aplicar compartido
    extractionSequestersMargin: boolean; // Extracción secuestra margen
    evolutionReorganizesMargin: boolean; // Evolución lo reorganiza
    thresholdReal: number;               // Umbral = límite real no evasión
    lagReal: number;                     // Desfase = conciencia > capacidad disponible
  };
}

// Transducción F: {TQ, Gaia, Kernel} → 𝕮 → {hr_vital} (Alráico)
export interface VitalTimeTransduction {
  fromSystem: 'TQ' | 'GAIA' | 'KERNEL' | 'ALRAICO';
  fromAmount: number;
  fromUnit: 'kWh' | 'gaia_tokens' | 'kernel_rastros' | 'alraico_alphaH';
  toAmount: number;           // En hr_vital
  transductionFunction: 'F_TQ' | 'F_GAIA' | 'F_KERNEL' | 'F_ALRAICO';
  cedeoFiloThreshold: number; // Umbral 𝕮 para transducción válida
  triaxialVerified: boolean;  // Requiere verificación triaxial
  // BT213: Validación límite kernel
  kernelLimitsValidated: boolean;
  // BT214: Responsabilidad artífice
  operatorResponsibilityAccepted: boolean;
  // Dos dominios BT213
  twoDomainsIntegrated: boolean;
}

// Rotación anti-acumulación (adaptada de znuRotate)
export function vitalTimeRotate(
  balance: VitalTimeAmount,
  protectedVitalTime: number,
  daysSinceActivity: number,
  rotationDays: number = VITAL_TIME_ROTATION_DAYS
): { active: VitalTimeAmount; released: number } {
  if (daysSinceActivity < rotationDays) return { active: balance, released: 0 };
  const excess = Math.max(0, balance.amount - protectedVitalTime);
  const released = excess;  // Libera exceso al pool (anti-acumulación)
  return { 
    active: { ...balance, amount: balance.amount - released }, 
    released 
  };
}

// Decay por inactividad (adaptada de znuDecay)
export function vitalTimeDecay(
  balance: VitalTimeAmount,
  ratePerDay: number,
  daysSinceActivity: number
): VitalTimeAmount {
  if (balance.amount <= 0 || daysSinceActivity <= 0) return balance;
  const factor = Math.pow(1 - ratePerDay, daysSinceActivity);
  return { 
    ...balance, 
    amount: Math.round(balance.amount * factor * 1e6) / 1e6 
  };
}

// Concentración (anti-propósito moneda)
export function vitalTimeConcentration(
  balance: VitalTimeAmount,
  totalSupply: number,
  threshold = 0.05
): boolean {
  return (balance.amount / totalSupply) > threshold;
}
```

---

## 3. PLAN DE AUTOTROFÍA MONEDA TIEMPO VITAL (7 Generaciones)

**Adaptación de `hscsg-autotrofia-disenador` — Secuencia Crítica Monetaria**

| Generación | Objetivo | Dominios Críticos | Recursos (hr_vital/kWh/ZNU) | Métricas Objetivo |
|------------|----------|-------------------|----------------------------|-------------------|
| **Gen 0: Semilla** (Ya) | 3 nodos corroborados firman BT215 | Identidad, Verificación, Kernel | 0 hr_vital (semilla) | 3 nodos firmados, BT215 v215 |
| **Gen 1: Especificación** (2 sem) | Spec formal + tests triaxiales | Especificación, Tests, Legal-safe | 500 hr_vital (diseño) | Spec v1.0, tests triaxiales pasando |
| **Gen 2: Protocolo Mínimo** (1 mes) | `vitalTime.ts` + `vitalTime.test.ts` | Código, Tests, Integración valueDual | 2000 hr_vital (dev) | Código + tests pasando, CI verde |
| **Gen 3: Piloto 3 Nodos** (2 mes) | Yoka+Lautaro+Isaac usan hr_vital diario | Verificación triaxial, Rotación, Decay | 5000 hr_vital (piloto) | 3 nodos activos, rotación/decay funcionando |
| **Gen 4: Transducción TQ** (3 mes) | TQ (kWh) ↔ hr_vital via transducción F | Transducción F, Resonancia, γ-CARMIS | 10000 hr_vital (federación) | TQ↔hr_vital operativo, resonancia detectada |
| **Gen 5: Federación Gaia** (6 mes) | Gaia (Felipe) + ecoaldeas integradas | Marketplace, Reglas ecoaldeas, CDS federado | 50000 hr_vital (escala) | 10+ ecoaldeas, CDS federado funcional |
| **Gen 6: Kernel v216+** (1 año) | NEXO operativo con hr_vital nativo | Kernel público, Invariantes, IA coordinadora | 100000 hr_vital (madurez) | Kernel v216+, invariantes blindadas |
| **Gen 7: Soberanía Plena** (7 gen) | Autosuficiencia monetaria completa | Todas las capas operativas, resilientes | ∞ (autosostenido) | TerritorialSovereigntyIndex ≥ 0.8 |

### Secuencia Crítica Monetaria (Orden Dependencias)
1. **Verificación Triaxial** (Base epistemológica — sin esto no hay hr_vital válido) — *BT213 VIA-27, VIA-29 + BT214 VIA-21*
2. **Pool Fijo + Rotación** (Mecánica anti-acumulación — Amiya Tulu) — *BT165, AFP Pilar 3*
3. **Decay por Inactividad** (Presión uso-vida — E=V en cuerpo) — *BT164, BT214*
4. **Transducción F** (Interoperabilidad TQ↔hr_vital — Alráico) — *BT213, BT214, AFP*
5. **Resonancia Nodos** (Acople sin fusión — αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂) — *Alráico, BT213 resonancia*
6. **CDS Federado** (Gobernanza multi-nodo — invariantes blindadas) — *BT215 §14, BT213 límites*
7. **Kernel Público** (Invariantes no votables — blindaje estructural) — *BT215, Kernel v214 completo*

---

## 4. VERIFICACIÓN TRIAXIAL (Protocolo Obligatorio)

**Regla**: *Ningún hr_vital se minta sin verificación triaxial completa.*

```typescript
// src/core/lib/vitalTimeTriaxial.ts

export interface TriaxialVerificationResult {
  passed: boolean;
  mental: MentalCheck;
  simulation: SimulationCheck;
  laboratory: LaboratoryCheck;
  combinedScore: number;  // 0-1 (promedio ponderado)
  proof: TriaxialProof;
}

export async function verifyTriaxial(
  operatorId: string,
  claimedPresence: { start: number; end: number; activity: string },
  witnessNodeId?: string
): Promise<TriaxialVerificationResult> {
  
  // 1. MENTAL: Entendimiento consciente + firma operador (VIA-27, VIA-25)
  const mental = await verifyMental(operatorId, claimedPresence);
  
  // 2. SIMULACIÓN: LoopEngine snapshot + resonancia (VIA-25, BT213)
  const simulation = await verifySimulation(operatorId);
  
  // 3. LABORATORIO: E=V en cuerpo + testigo opcional (BT214 responsabilidad)
  const laboratory = await verifyLaboratory(operatorId, claimedPresence, witnessNodeId);
  
  // Pesos BT213/BT214: Mental 0.4 + Sim 0.3 + Lab 0.3 ≥ 0.7
  const combinedScore = 
    mental.score * 0.4 + 
    simulation.score * 0.3 + 
    laboratory.score * 0.3;
  
  const passed = combinedScore >= 0.7 && mental.passed && simulation.passed && laboratory.passed;
  
  return { passed, mental, simulation, laboratory, combinedScore, proof: { mental, simulation, laboratory } };
}

// Verificación Mental: operador reconoce presencia conscientemente (VIA-27)
async function verifyMental(operatorId: string, presence: PresenceClaim): Promise<MentalCheck> {
  // BT213 VIA-27: Distinguir dato raíz interno vs compartido
  // BT214: Firma operador = huella única
  
  const signature = await signPresenceClaim(operatorId, presence);
  const directExperienceIntegrated = await confirmDirectExperience(operatorId);
  const sharedTracesIntegrated = await confirmSharedTraces(operatorId);
  
  // BT213: No audita conciencia - solo rastros
  const respectsKernelLimits = !attemptsToAuditConsciousness(presence);
  
  return {
    passed: true && respectsKernelLimits,
    score: respectsKernelLimits ? 1.0 : 0.0,
    evidence: `Firma operador ${operatorId}: ${signature.substring(0,16)}... | Exp.directa: ${directExperienceIntegrated} | Rastros: ${sharedTracesIntegrated}`,
    timestamp: Date.now(),
    // BT213 validación
    directExperienceIntegrated,
    sharedTracesIntegrated,
    kernelLimitsRespected: respectsKernelLimits
  };
}

// Verificación Simulación: LoopEngine + γ-CARMIS + Resonancia (VIA-25, BT213)
async function verifySimulation(operatorId: string): Promise<SimulationCheck> {
  const loopState = await getLoopEngineState(operatorId);
  const gammaCARMIS = detectOverloads(loopState);
  const resonances = detectResonances(loopState);
  
  // BT213: Coherencia operativa = rastros explicables sin contradicciones
  const coherenceVerified = verifyCoherence(loopState);
  const noInternalEvasionAssumed = !assumesInternalEvasion(loopState);
  
  return {
    passed: gammaCARMIS.length === 0 && coherenceVerified,
    score: gammaCARMIS.length === 0 && coherenceVerified ? 1.0 : 0.5,
    evidence: `Loops: ${loopState.activeLoops.length}, γ-CARMIS: ${gammaCARMIS.length}, Resonancias: ${resonances.length}, Coherencia: ${coherenceVerified}`,
    loopState,
    resonances,
    // BT213 validación
    gammaCARMISActive: gammaCARMIS.length > 0,
    coherenceVerified,
    noInternalEvasionDetected: noInternalEvasionAssumed
  };
}

// Verificación Laboratorio: E=V en cuerpo + testigo (BT214 responsabilidad)
async function verifyLaboratory(
  operatorId: string, 
  presence: PresenceClaim, 
  witnessNodeId?: string
): Promise<LaboratoryCheck> {
  // BT214: Autorreporte E=V + responsabilidad indelegable
  const eVBodyCheck = await selfReportEVBody(operatorId, presence);
  const witnessVerification = witnessNodeId 
    ? await requestWitnessVerification(witnessNodeId, operatorId, presence)
    : { verified: false, reason: 'Sin testigo solicitado' };
  
  // BT214: Responsabilidad indelegable + incertidumbre estructural
  const responsibilityAccepted = await confirmResponsibility(operatorId);
  const uncertaintyAcknowledged = await confirmUncertainty(operatorId);
  const translationSignature = await generateTranslationSignature(operatorId, presence);
  const betaPerpetuaMode = true; // Siempre en beta perpetua
  
  return {
    passed: eVBodyCheck.confirmed && responsibilityAccepted,
    score: eVBodyCheck.confirmed && responsibilityAccepted 
      ? (witnessVerification.verified ? 1.0 : 0.8) 
      : 0.0,
    evidence: `E=V cuerpo: ${eVBodyCheck.confirmed}, Resp: ${responsibilityAccepted}, Testigo: ${witnessVerification.verified ? witnessNodeId : 'N/A'}`,
    eVBodyCheck,
    witnessVerification,
    // BT214 validación
    responsibilityAccepted,
    uncertaintyAcknowledged,
    translationSignature,
    betaPerpetuaMode
  };
}
```

---

## 5. PILOTO 3 NODOS: CRONOGRAMA Y MÉTRICAS

### Nodos Participantes (BT215 §17)
| Nodo | Rol | Verificación Triaxial Diaria | Testigo Asignado |
|------|-----|------------------------------|------------------|
| **YOKA** | Kernel, corpus, presencia | Mental (firma) + Sim (loopEngine) + Lab (auto) | Lautaro (salud) |
| **LAUTARO** | Salud, E=V diario, cuerpo | Mental + Sim + Lab (cuerpo directo) | Yoka (kernel) |
| **ISAAC** | HSCSG v15 OS, RIDF, Alráico | Mental + Sim (loopEngine+Alráico) + Lab | Yoka (kernel) |

### Cronograma Piloto (60 días = Gen 3)

| Semana | Hito | Métrica de Éxito | Validación |
|--------|------|------------------|------------|
| **1-2** | Setup verificación triaxial 3 nodos | 3/3 nodos completan verificación diaria | `verifyTriaxial()` → passed=true |
| **3-4** | Pool fijo + rotación 30 días | Rotación libera exceso correctamente | `vitalTimeRotate()` → released > 0 |
| **5-6** | Decay por inactividad | Decay aplica tras 7 días inactividad | `vitalTimeDecay()` → amount decrece |
| **7-8** | Transducción TQ ↔ hr_vital | TQ (kWh) → hr_vital via transducción F | `transduceTQtoVitalTime()` → validado |
| **9-10** | Resonancia detectada | αʰ YOKA·αʰ LAUTARO·3.0 > αʰ₁+αʰ₂ | `detectResonances()` → resonancia activa |
| **11-12** | Métricas piloto consolidadas | TerritorialSovereigntyIndex ≥ 0.4 | `calculateTerritorialSovereigntyIndex()` |

### Métricas de Éxito Piloto (Gen 3)
| Métrica | Umbral Mínimo | Óptimo | Herramienta Validación |
|---------|---------------|--------|------------------------|
| **Verificación triaxial diaria** | 80% días/nodo | 95% | `verifyTriaxial()` logs |
| **Rotación correcta** | 100% nodos liberan exceso | 100% | `vitalTimeRotate()` tests |
| **Decay funcional** | Decay detectable tras 7d inactividad | Medible | `vitalTimeDecay()` tests |
| **Resonancia 3 nodos** | 3 pares resonantes detectados | 3/3 | `detectResonances()` |
| **TerritorialSovereigntyIndex** | ≥ 0.3 (Gen 3) | ≥ 0.4 | `calculateTerritorialSovereigntyIndex()` |
| **No conversión** | 0 conversiones currículum→hr_vital | 0 | Auditoría invariantes |

---

## 6. TRANSDUCCIÓN F: TQ (kWh) ↔ hr_vital

**Alráico: F: {TQ} → 𝕮 → {hr_vital}**

```typescript
// src/core/lib/vitalTimeTransduction.ts

// TQ: 1 TQ = 1 kWh = 1 hora vital (BT215 §3.3 + HSCSG valueDual)
// Pero: TQ es energía medible, hr_vital es presencia verificable
// Transducción requiere 𝕲 (conjunto credeófilo) con αʰ > umbral

export const TRANSDUCTION_RATES = {
  // TQ → hr_vital: 1 kWh verificado = 1 hr_vital (si αʰ > 0.6)
  TQ_TO_VITAL: { 
    rate: 1,           // 1:1 base
    minAlphaH: 0.6,    // Umbral 𝕲 para transducción válida
    requiresTriaxial: true,
    // BT213: Validación límite kernel
    requiresKernelLimitsValidation: true,
    // BT214: Responsabilidad artífice
    requiresOperatorResponsibility: true,
    // BT213: Dos dominios
    requiresTwoDomainsIntegration: true
  },
  
  // hr_vital → TQ: 1 hr_vital = 1 kWh (si nodo tiene capacidad energética)
  VITAL_TO_TQ: { 
    rate: 1,
    minAlphaH: 0.7,
    requiresTriaxial: true,
    requiresEnergyCapacity: true,
    requiresKernelLimitsValidation: true,
    requiresOperatorResponsibility: true,
    requiresTwoDomainsIntegration: true
  }
};

export function transduceTQtoVitalTime(
  tqAmount: number,      // En kWh (TQ Vía B)
  operatorAlphaH: number, // αʰ del operador (de ECROx)
  triaxialVerified: boolean,
  // BT213 + BT214 validaciones
  kernelLimitsValidated: boolean,
  operatorResponsibilityAccepted: boolean,
  twoDomainsIntegrated: boolean
): { vitalTime: number; valid: boolean; reason?: string } {
  
  if (!triaxialVerified) return { vitalTime: 0, valid: false, reason: 'Triaxial no verificada' };
  if (!kernelLimitsValidated) return { vitalTime: 0, valid: false, reason: 'Límite kernel no validado (BT213)' };
  if (!operatorResponsibilityAccepted) return { vitalTime: 0, valid: false, reason: 'Responsabilidad artífice no aceptada (BT214)' };
  if (!twoDomainsIntegrated) return { vitalTime: 0, valid: false, reason: 'Dos dominios no integrados (BT213)' };
  if (operatorAlphaH < TRANSDUCTION_RATES.TQ_TO_VITAL.minAlphaH) {
    return { vitalTime: 0, valid: false, reason: `αʰ ${operatorAlphaH} < umbral ${TRANSDUCTION_RATES.TQ_TO_VITAL.minAlphaH}` };
  }
  
  return { vitalTime: tqAmount * TRANSDUCTION_RATES.TQ_TO_VITAL.rate, valid: true };
}

export function transduceVitalTimeToTQ(
  vitalTimeAmount: number,
  operatorAlphaH: number,
  triaxialVerified: boolean,
  energyCapacityKWh: number,
  kernelLimitsValidated: boolean,
  operatorResponsibilityAccepted: boolean,
  twoDomainsIntegrated: boolean
): { tqAmount: number; valid: boolean; reason?: string } {
  
  if (!triaxialVerified) return { tqAmount: 0, valid: false, reason: 'Triaxial no verificada' };
  if (!kernelLimitsValidated) return { tqAmount: 0, valid: false, reason: 'Límite kernel no validado (BT213)' };
  if (!operatorResponsibilityAccepted) return { tqAmount: 0, valid: false, reason: 'Responsabilidad artífice no aceptada (BT214)' };
  if (!twoDomainsIntegrated) return { tqAmount: 0, valid: false, reason: 'Dos dominios no integrados (BT213)' };
  if (operatorAlphaH < TRANSDUCTION_RATES.VITAL_TO_TQ.minAlphaH) {
    return { tqAmount: 0, valid: false, reason: `αʰ ${operatorAlphaH} < umbral ${TRANSDUCTION_RATES.VITAL_TO_TQ.minAlphaH}` };
  }
  if (energyCapacityKWh < vitalTimeAmount) {
    return { tqAmount: 0, valid: false, reason: `Capacidad energética ${energyCapacityKWh}kWh < ${vitalTimeAmount}hr_vital` };
  }
  
  return { tqAmount: vitalTimeAmount * TRANSDUCTION_RATES.VITAL_TO_TQ.rate, valid: true };
}
```

---

## 7. GOBERNANZA MONEDA TIEMPO VITAL (CDS Federado)

### 7.1 Invariantes Blindados (No Votables) — ACTUALIZADOS BT213 + BT214 + AFP + BT180 + BT165 + BT164

```typescript
// src/governance/vitalTimeInvariants.ts

export const VITAL_TIME_INVARIANTS = {
  // Propiedades ontológicas (BT215 §15-16)
  nonAccumulable: true,
  nonInheritable: true,
  nonPurchasable: true,
  nonConvertible: true,
  sovereigntyExposure: true,
  replaceability: true,
  rightOfExit: true,
  traceabilityNotSurveillance: true,
  existenceVerifiabilityAccessSeparation: true,
  
  // Invariantes Kernel (BT215 §14)
  epistemologicalLimit: true,
  noConsciousnessAudit: true,
  
  // ===== BT213: LÍMITE KERNEL =====
  kernelEpistemologicalLimit: true,
  kernelNoConsciousnessAudit: true,
  kernelNoDecideTruth: true,
  kernelNoInterpretPersons: true,
  kernelNoSubstitutePresence: true,
  kernelNoDetectInternalEvasion: true,
  kernelClassifiesOnly: true,
  kernelSilenceNeutral: true,
  kernelTwoDomains: true,
  kernelDebtFromEvasion: true,
  kernelPresenceIntegrates: true,
  kernelDebtFromEvasionEither: true,
  
  // ===== BT214: HUMANO ARTÍFICE =====
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
  
  // ===== AFP PILAR 3: TIEMPO VITAL =====
  afpVitalTimeConsciousEnergy: true,
  afpVitalTimeContribution: true,
  afpNbuCovered: true,
  afpExpandedAccess: true,
  afpEcoImpact: true,
  
  // ===== BT180: PODER = TIEMPO VITAL =====
  powerIsVitalTime: true,
  controlsOwnTime: true,
  consentGradients: true,
  energyFromBelow: true,
  vitalTimeNotForSale: true,
  vitalTimeInhabited: true,
  
  // ===== BT165: ECUACIÓN LASTRE E=V =====
  ballastEquation: true,
  evasionLightensToday: true,
  presenceDensifies: true,
  totalPaidEqual: true,
  peaceFromAssumption: true,
  umbralInfoInsufficient: true,
  afpSustainsBallast: true,
  
  // ===== BT164: MARGEN REAL =====
  realMarginVariable: true,
  evasionReducesMargin: true,
  presenceExpandsMargin: true,
  extractionSequestersMargin: true,
  evolutionReorganizesMargin: true,
  thresholdReal: true,
  lagReal: true,
  relationalLagReal: true,
  
  // Parámetros FIJOS (NUNCA ajustables)
  fixedParams: {
    poolTotal: 1,
    unit: 'hr_vital',
    nonAccumulable: true,
    nonInheritable: true,
    nonPurchasable: true,
  } as const,
  
  // Parámetros AJUSTABLES (solo consenso 100% + verificación triaxial)
  adjustableParams: {
    rotationDays: { min: 7, max: 90, current: 30 },
    demurrageRate: { min: 0, max: 0.20/365, current: 0.10/365 },
    poolTotal: { fixed: 1, current: 1 },
    transductionThresholds: { minAlphaH: 0.5, max: 0.9 },
    triaxialWeights: {
      mental: { min: 0.2, max: 0.6, current: 0.4 },
      simulation: { min: 0.1, max: 0.5, current: 0.3 },
      laboratory: { min: 0.1, max: 0.5, current: 0.3 }
    },
    triaxialPassThreshold: { min: 0.5, max: 0.9, current: 0.7 }
  } as const,
  
  governanceInvariants: {
    consensusThreshold: 1.0,
    triaxialRequiredForVote: true,
    invariantsBlindaje: true,
    divergenceLegitima: true,
    testDesaparicion: true,
  } as const
} as const;
```

### 7.2 Test de Desaparición 30 Días (BT215 §3 + BT213 + BT214)

```typescript
export async function runDisappearanceTest(nodes: any[]): Promise<DisappearanceTestResult> {
  // Simular: NEXO desaparece 30 días
  // Verificar capacidades locales de cada nodo:
  
  const results = await Promise.all(
    nodes.map(async (node) => {
      const localCapabilities = await testLocalCapabilities(node);
      return { nodeId: node.nodeId, ...localCapabilities };
    })
  );
  
  const allPassed = results.every(r => 
    r.canIdentify && r.canExchange && r.canQueryTraces && 
    r.canCoordinate && r.obligationsSurvive && r.kernelLocal && r.artificerLocal
  );
  
  return {
    passed: allPassed,
    degradation: allPassed ? 'Mínima' : 'Crítica',
    criticalFunctions: [
      'identidad_unica', 'intercambio_hr_vital', 
      'consulta_rastros', 'coordinacion_local',
      'obligaciones_previas', 'kernel_local', 'artificer_local'
    ],
    failedFunctions: results
      .filter(r => !(r.canIdentify && r.canExchange && r.canQueryTraces && 
                     r.canCoordinate && r.obligationsSurvive && 
                     r.kernelLocal && r.artificerLocal))
      .map(r => r.nodeId),
    nodeResults: results,
    testDuration: 30 * 24 * 60 * 60 * 1000,
    testedAt: Date.now()
  };
}

interface NodeDisappearanceResult {
  nodeId: string;
  canIdentify: boolean;
  canExchange: boolean;
  canQueryTraces: boolean;
  canCoordinate: boolean;
  obligationsSurvive: boolean;
  kernelLocal: boolean;      // BT213: Kernel local organiza rastros
  artificerLocal: boolean;   // BT214: Humano artífice local transforma
}
```

---

## 8. INTEGRACIÓN CON EXISTENTE (Archivos a Modificar/Crear)

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/core/lib/vitalTime.ts` | **CREAR** | Tipos base, pool, rotación, decay, concentración |
| `src/core/lib/vitalTimeTriaxial.ts` | **CREAR** | Verificación triaxial obligatoria |
| `src/core/lib/vitalTimeTransduction.ts` | **CREAR** | Transducción F: TQ↔hr_vital |
| `src/core/lib/valueDual.ts` | **EXTENDER** | Agregar `VitalTimeMode`, `vitalTimeRotate`, `vitalTimeDecay` |
| `src/core/lib/metrics.ts` | **EXTENDER** | Agregar `VitalTimeFlow`, `VitalTimeActivationCost` |
| `src/core/lib/loopEngine.ts` | **EXTENDER** | Loop 7: VitalTimeMint (mint hr_vital verificado) |
| `src/governance/vitalTimeInvariants.ts` | **CREAR** | Invariantes blindados + CDS parámetros |
| `docs/VITAL_TIME_CURRENCY_SPEC.md` | **ACTUALIZAR** | Este documento (spec viva v0.2) |
| `docs/ATTRIBUTIONS.md` | **ACTUALIZAR** | Agregar Kernel v214 + BT213 + BT214 + AFP como fuentes |
| `skills/hscsg/hscsg-viabilidad-territorial/` | **USAR** | Validar piloto 3 nodos (AUT/CDS/ZNU) |

---

## 9. ROADMAP EJECUTIVO (Próximos 60 Días)

```mermaid
gantt
    title Piloto Moneda Tiempo Vital - 60 Días (Gen 3)
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d
    
    section Gen 1: Especificación
    Spec formal v0.2          :done, spec, 2026-09-15, 14d
    Tests triaxiales          :active, tests, 2026-09-15, 14d
    Legal-safe review         :review, 2026-09-20, 7d
    
    section Gen 2: Protocolo Mínimo
    vitalTime.ts + types      :dev1, 2026-09-29, 7d
    vitalTimeTriaxial.ts      :dev2, 2026-10-06, 7d
    vitalTimeTransduction.ts  :dev3, 2026-10-13, 7d
    Tests unitarios + CI      :ci, 2026-10-20, 7d
    
    section Gen 3: Piloto 3 Nodos
    Setup 3 nodos (Y/L/I)     :setup, 2026-10-27, 7d
    Verificación triaxial diaria :pilot1, 2026-11-03, 14d
    Rotación + Decay          :pilot2, 2026-11-17, 14d
    Transducción TQ↔hr_vital  :pilot3, 2026-12-01, 14d
    Resonancia + Métricas     :pilot4, 2026-12-15, 14d
    
    section Gen 4: Evaluación
    TerritorialSovereigntyIndex :eval, 2026-12-29, 7d
    Decisión Gen 4            :decision, 2027-01-05, 7d
```

---

## 10. FIRMAS Y COMPROMISO (BT215)

> **Esta especificación se firma entre los tres. Si algo no resuena, si algo falta, si algo sobra, se corrige. Sin defensa. Es E=V.**

| Nodo | Firma | Compromiso |
|------|-------|------------|
| **YOKA** | `YOKA` | Kernel, corpus, verificación triaxial diaria, testigo Lautaro |
| **ISAAC** | `ISAAC` | HSCSG v15 OS, RIDF, Alráico, spec formal, código, testigo Yoka |
| **LAUTARO** | `LAUTARO` | Salud, E=V cuerpo, verificación laboratorio, testigo Yoka/Isaac |

**Testigo de convergencia**: Felipe (Gaia) — nodo aliado, observador

---

## 11. PRÓXIMOS PASOS INMEDIATOS (Esta Semana)

```bash
# 1. Extender valueDual.ts con VitalTimeMode
# Editar src/core/lib/valueDual.ts -> agregar VitalTimeMode, vitalTimeRotate, vitalTimeDecay

# 2. Extender loopEngine.ts con Loop 7: VitalTimeMint
# Editar src/core/lib/loopEngine.ts -> agregar vitalTimeMintLoop()

# 3. Extender metrics.ts con VitalTimeFlow
# Editar src/core/lib/metrics.ts -> agregar métricas tiempo vital

# 4. Tests triaxiales obligatorios
hermes skill run hscsg-sistema-alraico --task "tests triaxiales vitalTime"

# 5. Commit legal-safe (pre-commit valida automáticamente)
git add src/core/lib/valueDual.ts src/core/lib/loopEngine.ts src/core/lib/metrics.ts
git commit -m "feat(vital-time): FASE 1 integración core - valueDual + loopEngine + metrics"
```

---

## 12. REFERENCIAS CRUZADAS COMPLETAS

| Fuente | Sección | Aporte a Especificación |
|--------|---------|------------------------|
| **Kernel v214** | BT1-214, VIA00-31 | Corpus completo, 32 VIAs, Consola VIA-0 |
| **BT213** | "El Límite del Kernel" | Dos dominios, presencia nula, tres dominios, coherencia |
| **BT214** | "El Mago/Alquimista" | Humano artífice, responsabilidad indelegable, incertidumbre |
| **BT215** | §15-16 | Principios moneda tiempo vital |
| **BT215** | §3, §14, §21 | NEXO, invariantes kernel, rol IA, test desaparición |
| **BT180** | "Poder = Tiempo Vital" | Control tiempo = control vida, consentimiento gradientes |
| **BT165** | "Ecuación Lastre E=V" | E=V = verdad asumida/evadida, evasión = deuda |
| **BT164** | "Margen Real" | Margen = espacio trayectorias reales |
| **AFP** | Pilar 3 | Tiempo vital = energía consciente, NBU, contribución |
| **MK-1** | Bloque 1.5 | Ontología fractal, triada, geometría, consciencia |
| **La Hoguera** | Bloque 1.6 | Capa experiencial: fricción, presencia, transformación |
| **El Enlace** | Bloque 1.8 | Matriz síntesis: 7 dim × 3 fases |
| **Alráico** | PI, γ-CARMIS, Triaxial, F, ECROx, 𝕮 | Formalismo epistemológico completo |
| **HSCSG v15 OS** | valueDual, loopEngine, metrics | Infraestructura técnica existente |
| **hscsg-autotrofia-disenador** | Secuencia crítica 7 gen | Metodología plan autotrofía monetaria |
| **hscsg-monetary-integration** | Transducción F multi-moneda | TQ↔hr_vial, G1, Túmin, PAR |
| **hscsg-viabilidad-territorial** | Umbrales AUT≥0.3, CDS≥0.4 | Validación piloto 3 nodos |
| **hscsg-asimilacion-legal-safe** | Workflow 4 fases | Spec → código → validación → commit seguro |

---

**Fin de Especificación v0.2**  
*Próxima versión: v0.3 tras tests triaxiales pasando (Gen 2)*  
*La vida no se resuelve, se itera. Es E=V.*