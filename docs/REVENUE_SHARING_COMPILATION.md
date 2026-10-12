# REPARTO DE GANANCIAS / REVENUE SHARING - COMPILACIÓN EXHAUSTIVA
## Zeitnus Firma Operaciones Ecotómicas / ALRAC Consorcio
### Documento generado automáticamente con fuentes explícitas del repositorio

---

## 📋 ÍNDICE

1. [Principio Amid 35/35/30 (Fuente Canónica)](#1-principio-amid-353530-fuente-canónica)
2. [Ecuación Amid Formal (ω⁽ᵏ⁾)](#2-ecuación-amid-formal-ω⁽ᵏ⁾)
3. [CaaS Revenue Streams - 6 Streams + Gate MJ](#3-caas-revenue-streams---6-streams--gate-mj)
4. [Reparto por Stream (calculateStreamAmidSplit)](#4-reparto-por-stream-calculatestreamamidsplit)
5. [Enterprise Staking / Zeitnus Regenerative Model](#5-enterprise-staking--zeitnus-regenerative-model)
6. [TQ Ledger - Conversión y Distribución](#6-tq-ledger---conversión-y-distribución)
7. [CSA Subscription - Riesgo Compartido](#7-csa-subscription---riesgo-compartido)
8. [Gobernanza Holónica - CDS Weighted](#8-gobernanza-holónica---cds-weighted)
9. [Principio Anfibio (Postmonetario ↔ Conectado)](#9-principio-anfibio-postmonetario--conectado)
10. [Matriz de Validación Cruzada](#10-matriz-de-validación-cruzada)

---

## 1. PRINCIPIO AMID 35/35/30 (FUENTE CANÓNICA)

### **Regla Fundamental**
> **Reparto Amid 35/35/30**: Amid Dabir (I+D) / Yoka Commons (Infra) / Nodos Operadores (CDS-weighted)

### **Fuentes Explícitas**

| # | Archivo | Línea/Sección | Contenido Exacto |
|---|---------|---------------|------------------|
| 1 | `README.md` | Tabla "Principios Fundamentales" | `Reparto Amid 35/35/30 | Amid Dabir (I+D) / Yoka Commons (Infra) / Nodos Operadores (CDS-weighted)` |
| 2 | `openspec/specs/alrac-revenue.md` | Spec completa | Definición formal del reparto Amid |
| 3 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 7 | `calculateStreamAmidSplit()` implementation |
| 4 | `src/core/lib/alrac.ts` | `calculateRevenueSplit()` | Función pura TypeScript |
| 5 | `src/core/state/alrac.ts` | `RevenueSplit` interface | Estructura tipada con `layers` array |
| 6 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Tabla "Reparto Amid" | Mapping a Enterprise Staking |
| 7 | `docs/GRANALLIANZA_MAPPING.md` | Sección 2 | Mapeo línea-holón con reparto |

### **Desglose de los 3 Destinatarios**

| Porción | Destinatario | Función | Gobernanza |
|---------|--------------|---------|------------|
| **35%** | **Amid Dabir** | Investigación & Desarrollo (I+D) | Capa 0 Epistémica |
| **35%** | **Yoka Commons** | Infraestructura Commons / Bienes Comunes | Capa 0 Yoka + Capa 0.5 Normativa |
| **30%** | **Nodos Operadores** | Operadores nodales (pesado por CDS) | Capa 1-5, distribuido por `CDS score` |

---

## 2. ECUACIÓN AMID FORMAL (ω⁽ᵏ⁾)

### **Fórmula Matemática**
```
ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾ / 10)
```

### **Parámetros**

| Símbolo | Nombre | Descripción | Rango |
|---------|--------|-------------|-------|
| `ω⁽ᵏ⁾` | Reparto capa k | Valor distribuido en capa k | ≥ 0 |
| `θ_generado⁽ᵏ⁾` | Theta generado | Valor total generado en capa k | ≥ 0 |
| `ι` (iota) | Incremento productivo | Factor de productividad marginal | ≥ 0 |
| `φʰ⁽ᵏ⁾` | Factor armonía | Peso por armonía αʰ y profundidad k | (0, 1.1] |
| `k` | Profundidad capa | 0=Epistémica, 0.5=Normativa, 1=TQ, 2=CaaS, 3=Fiat, 5=Gobernanza | 0-5 |
| `αʰ⁽ᵏ⁾` | Armonía capa k | αʰ = Ω·s (oscilación × sincronía) | [0, ∞) |

### **Fuentes Explícitas**

| # | Archivo | Función/Sección | Código Exacto |
|---|---------|-----------------|---------------|
| 1 | `src/core/lib/alrac.ts` | `calculateRevenueSplit()` | `const phi = Math.pow(0.95, k) * (1 + harmony / 10);` |
| 2 | `src/core/lib/alrac.ts` | `calculateRevenueSplit()` | `const total = 0.5 * thetaGenerated * (1 + iota) * phi;` |
| 3 | `src/core/lib/alrac.ts` | `calculateRevenueSplit()` | `const generatorShare = total * 0.5; const layersShare = total * 0.5;` |
| 4 | `src/core/state/alrac.ts` | `RevenueSplit` interface | `formula: 'ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾'` |
| 5 | `openspec/specs/alrac-revenue.md` | Spec completa | Definición formal con parámetros |
| 6 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 7 | `calculateStreamAmidSplit()` replica la lógica |

### **Interpretación de la Fórmula**

1. **½ · θ_generado**: La mitad del valor generado va al **generador directo** (quien produjo el trabajo/valor)
2. **½ · θ_generado · (1+ι) · φʰ**: La otra mitad se distribuye por **capas** según:
   - `(1+ι)`: Incremento por productividad marginal
   - `φʰ = (0.95)ᵏ · (1 + αʰ/10)`: Decay por profundidad de capa (0.95^k) + bonus por armonía (αʰ/10)

---

## 3. CAAS REVENUE STREAMS - 6 STREAMS + GATE MJ

### **Tipos de Stream (CaaSStreamKey)**

| Key | Nombre | Descripción | Toca Base Material |
|-----|--------|-------------|-------------------|
| `suscripcion` | Suscripción Base | Membresía recurrente (Núcleo/Asociados/Afiliados) | No |
| `revenue_share` | Revenue Share | Participación en ingresos de proyectos federados | **Sí** |
| `b2b` | B2B Services | Servicios a empresas/organizaciones externas | **Sí** |
| `afiliados_verdes` | Afiliados Verdes | Red de referidos y embajadores | No |
| `educacion` | Educación | Cursos, certificaciones, entrenamientos | Parcial |
| `csa_subscription` | CSA Subscription | Agricultura Sostenida por la Comunidad | **Sí** |

### **Interfaz Canónica (TypeScript)**

```typescript
// Fuente: openspec/specs/alrac-caas-revenue-streams.md - Sección 3
export interface CaaSRevenueStream {
  key: CaaSStreamKey;
  name: string;
  enabled: boolean;
  usdcIn: number;              // USD/USDC ingresados este período
  znuOut: number;              // ZNU emitidos/asignados este período
  touchesBaseMaterial: boolean;
  conversionRate: number;      // znuOut / usdcIn
  velocity: number;            // Rotación ZNU por período
  autonomyContribution: number; // Aporte a AUT nodal (0-1)
  approvedBy: string[];        // RAO IDs de aprobadores (mín 2)
  lastAudit: number | null;
  status: 'active' | 'paused' | 'pending_review' | 'closed';
  [key: string]: any;          // Extensibilidad (Principio Anfibio)
}
```

### **Gate MJ - Validación para `enabled: true`**

```
✓ usdcIn > 0  (al menos 1 período con ingreso real)
✓ znuOut > 0  (emisión ZNU correspondiente)
✓ conversionRate dentro de [priceParity * 0.95, priceParity * 1.05]
✓ approvedBy.length ≥ 2 (mínimo 2 RAO vigentes)
✓ status === 'active'
✓ Si touchesBaseMaterial === true → requiere triaxial verification vigente
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 2 | Tabla 6 streams con `touchesBaseMaterial` |
| 2 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 3 | Interfaz TypeScript completa |
| 3 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 4 | Gate MJ pre/post condiciones |
| 4 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 5 | CSA Subscription extendido |
| 5 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 7 | `calculateStreamAmidSplit()` |
| 6 | `src/core/state/caas.ts` | `CaaSRevenueStream` | Interface TypeScript extendida |

---

## 4. REPARTO POR STREAM (calculateStreamAmidSplit)

### **Implementación**

```typescript
// Fuente: openspec/specs/alrac-caas-revenue-streams.md - Sección 7
function calculateStreamAmidSplit(stream: CaaSRevenueStream): RevenueSplit {
  const totalUsdc = stream.usdcIn;
  const totalZnu = stream.znuOut;
  
  return {
    amidDabir: totalUsdc * 0.35,      // 35% → Investigación/Desarrollo (Amid)
    yokaCommons: totalUsdc * 0.35,    // 35% → Commons/Infraestructura (Yoka)
    nodeOperators: totalUsdc * 0.30,  // 30% → Operadores nodales
    // En ZNU equivalente:
    amidDabirZnu: totalZnu * 0.35,
    yokaCommonsZnu: totalZnu * 0.35,
    nodeOperatorsZnu: totalZnu * 0.30
  };
}
```

### **Distribución Nodos Operadores (30%) - Ponderada por CDS**

```typescript
// Fuente: src/core/lib/alrac.ts + openspec/specs/alrac-governance-holonic.md
// Cada nodo operador recibe: 30% * (CDS_nodo / Σ_CDS_todos_nodos)
function distributeToNodes(nodeOperatorsShare: number, nodes: NodeCDS[]): NodeShare[] {
  const totalCDS = nodes.reduce((sum, n) => sum + n.cds, 0);
  return nodes.map(n => ({
    nodeId: n.id,
    share: nodeOperatorsShare * (n.cds / totalCDS),
    cds: n.cds
  }));
}
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 7 | `calculateStreamAmidSplit()` completo |
| 2 | `src/core/state/alrac.ts` | `RevenueSplit.layers` | Array con 6 capas (amid, yoka, normative, accounting, interop, fiat) |
| 3 | `openspec/specs/alrac-governance-holonic.md` | Sección 5 | `calculateCDS()` - 4 componentes, pesos 0.25/0.25/0.30/0.20 |
| 4 | `src/core/lib/alrac.ts` | `calculateRevenueSplit()` | `generatorShare = total * 0.5; layersShare = total * 0.5` |

---

## 5. ENTERPRISE STAKING / ZEITNUS REGENERATIVE MODEL

### **Stack de Apilamiento (5 Rubros)**

| Rubro | Horizonte | Función | Métrica Principal |
|-------|-----------|---------|-------------------|
| **Huerta Biointensiva** | Corto (semanas) | Motor de liquidez | `tqProductionPerM2`, `znuRevenue` |
| **Gallinas Pastoreo** | Medio (meses) | Flujo caja + fertilidad | `tqEggsPerWeek`, `manureKwhPerMonth` |
| **Agroforestería** | Largo (años) | Patrimonio | `carbonSequestration`, `timberZnuFuture` |
| **Turismo Regenerativo** | Medio | Marca + ZNU alto valor | `znuPerVisit`, `ambassadorConversion` |
| **CSA/ZNU Subscription** | Corto/Medio | Estabilidad recurrente | `znuMonthlyPerMember`, `riskSharing` |

### **Métricas Compuestas (computeStackMetrics)**

```typescript
// Fuente: docs/ZEITNUS_REGENERATIVE_MODEL.md - Sección Implementation
computeStackMetrics(): StackMetrics {
  return {
    // Rentabilidad por Omisión (Video Samay)
    opexAvoided: this.marketGarden.biowasteToCompost + 
                 this.pasturedPoultry.manureKwhPerMonth + 
                 this.agroforestry.shadeValue,
    
    // Enterprise Staking (Apilamiento)
    stackedValuePerM2: (
      this.marketGarden.tqProductionPerM2 * 12 +
      this.pasturedPoultry.tqEggsPerWeek * 52 / this.totalArea +
      this.agroforestry.biomassKwhPerYear / this.totalArea
    ),
    
    // Tres Horizontes Balance
    liquidityRatio: (this.marketGarden.znuRevenue + this.pasturedPoultry.znuRevenue) / this.monthlyOpex,
    stabilityRatio: (this.csaSubscription.znuMonthlyPerMember * this.csaSubscription.members) / this.yearlyFixedCosts,
    patrimonyGrowth: this.agroforestry.timberZnuFuture / this.totalInvestment,
    
    // Enterprise Staking Score (0-100)
    stakingScore: this.computeStakingScore()
  };
}
```

### **Staking Score (Ponderado 25/25/25/25)**

```typescript
// Fuente: src/core/lib/tq.ts - computeStakingScore()
weights = {
  liquidity: 0.25,    // liquidityRatio / 2 (cap 1.0)
  stability: 0.25,    // stabilityRatio / 2 (cap 1.0)
  patrimony: 0.25,    // patrimonyRatio / 2 (cap 1.0)
  regeneration: 0.25  // regenerationRatio (cap 1.0)
}
// Score final = suma ponderada * 100
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 1 | Tabla mapping Video → Zeitnus/ALRAC |
| 2 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 2 | `EnterpriseStakingStack` interface completa |
| 3 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 3 | Matriz de decisión 5 rubros |
| 4 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 4 | Turismo regenerativo experiencias + pricing |
| 5 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 5 | CSA Subscription extendido |
| 6 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 6 | Marca personal + embajadores + storytelling |
| 7 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 7 | KPIs regenerativas (OPEX reduction, rentabilidad omisión, etc.) |
| 8 | `src/core/lib/tq.ts` | `EnterpriseStakingStack` | Implementación TypeScript completa |
| 9 | `src/core/lib/tq.ts` | `computeStackMetrics()` | Métricas compuestas |
| 10 | `src/core/lib/tq.ts` | `computeStakingScore()` | Score ponderado 4 dimensiones |

---

## 6. TQ LEDGER - CONVERSIÓN Y DISTRIBUCIÓN

### **Prohibición Cambiaria (Hard Constraint)**
```
TQ ≠ fiat/cripto NUNCA — por arquitectura, no buena voluntad
```
**Implementación**: `verifyTQProhibition()` bloquea cualquier transacción con `exchangeRate` o `fiatValue`

### **Conversion Factor (FC) - Solo para Import/Export DEX**
```
FC = canasta_TQ(500) / canasta_Fiat
```
- `canasta_TQ` = 500 TQ (límite máximo cuenta)
- `canasta_Fiat` = precio canasta básica regional (fuente ICE/Ecoinvent/local)
- **Solo usado en Capa 3 (Zeitnus) para bridge USDC**

### **Tipos de Transacción TQ Permitidos**
| Tipo | Descripción | Genera TQ |
|------|-------------|-----------|
| `reciprocity` | Intercambio mutuo entre cuentas | No (transferencia) |
| `production` | Producción nueva (kWh medidos) | **Sí** |
| `regeneration` | Regeneración neta (producido > consumido) | **Sí** |

### **Distribución TQ en Cross-Node Pools**
```typescript
// Fuente: src/core/lib/tq.ts - createCrossNodePool() + rebalancePool()
// Governance: harmony-weighted (φʰ = 0.95^k * (1 + αʰ/10))
// Rebalanceo ponderado por armonía
```

### **Fuentes Explícitas**

| # | Archivo | Sección/Función | Contenido |
|---|---------|-----------------|-----------|
| 1 | `openspec/specs/alrac-tq-exchangeGuard.md` | Sección 1 | Regla innegociable TQ ≠ fiat/cripto |
| 2 | `openspec/specs/alrac-tq-exchangeGuard.md` | Sección 2.1 | `verifyTQProhibition()` TypeScript |
| 3 | `openspec/specs/alrac-tq-exchangeGuard.md` | Sección 2.2 | `blockArbitrajeAttempt()` |
| 4 | `openspec/specs/alrac-tq-conversionFactor.md` | Spec completa | FC = canasta_TQ(500)/canasta_Fiat |
| 5 | `src/core/lib/tq.ts` | `verifyTQProhibition()` | Implementación completa |
| 6 | `src/core/lib/tq.ts` | `conversionFactor()` | Cálculo FC con validaciones |
| 7 | `src/core/lib/tq.ts` | `createCrossNodePool()` | Pools liquidez cross-nodo |
| 8 | `src/core/lib/tq.ts` | `rebalancePool()` | Rebalanceo φʰ-weighted |
| 9 | `openspec/specs/alrac-architecture.md` | Sección 2.2 | Tabla separación TQ/ZNU |

---

## 7. CSA SUBSCRIPTION - RIESGO COMPARTIDO

### **Lógica de Precio Dinámico**
```
INGRESO MIEMBRO = basePrice * (abundanceMultiplier | scarcityBuffer)
    │
    ├─► Si harvestKwh ≥ expectedKwh * 1.2 → abundanceMultiplier (1.5x)
    ├─► Si harvestKwh ≤ expectedKwh * 0.8 → scarcityBuffer (0.7x)
    └─► Else → 1.0x (precio base)

ZNU EMITIDO = INGRESO MIEMBRO / priceParity
TQ GENERADO = harvestKwh (1 TQ = 1 kWh ancla)
```

### **Campos Extendidos CSA**
```typescript
// Fuente: openspec/specs/alrac-caas-revenue-streams.md - Sección 5.1
interface CSASubscriptionStream extends CaaSRevenueStream {
  riskSharing: {
    abundanceMultiplier: number;      // 1.5x
    scarcityBuffer: number;           // 0.7x
    communicationProtocol: string;    // 'weekly_transparent_report'
  };
  ambassadorProgram: {
    referralZnuBonus: number;
    ambassadorTier: 'bronze' | 'silver' | 'gold';
    benefits: string[];
  };
  transparency: {
    weeklyUpdate: boolean;
    soilHealthReport: boolean;
    financialTransparency: boolean;
  };
}
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 5 | CSA Subscription extendido completo |
| 2 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 5.2 | Lógica riesgo compartido |
| 3 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 5 | CSA/ZNU Subscription mapping |
| 4 | `src/core/state/caas.ts` | `CaaSRevenueStream` | Extensión con campos CSA |

---

## 8. GOBERNANZA HOLÓNICA - CDS WEIGHTED

### **CDS (Capacidad de Soberanía) - Cálculo**

```typescript
// Fuente: openspec/specs/alrac-governance-holonic.md - Sección 5
function calculateCDS(components: CDSComponents): number {
  const weights = {
    participation: 0.25,    // gobernanzaParticipation, proposalQuality, auditContribution
    autonomy: 0.25,         // localDecisionMaking, resourceSelfSufficiency, technicalSovereignty
    regenerative: 0.30,     // tqGenerated, znuCirculated, baseMaterialStewardship
    history: 0.20           // raidCount, triaxialVerifications, raoUptime
  };
  // ... cálculo ponderado ...
  return score; // 0-1
}
```

### **CDS Gates (Accesos)**

| CDS Score | Acceso |
|-----------|--------|
| `≥ 0.6` | Proponer cambios estratégicos |
| `≥ 0.7` | Comité rotativo |
| `≥ 0.8` | Elegible para Núcleo |
| `< 0.3` | Grace period, revisión obligatoria |

### **Reparto Nodos Operadores (30% Amid) → Ponderado por CDS**
```typescript
nodeShare = 30% * (CDS_nodo / Σ_CDS_todos)
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `openspec/specs/alrac-governance-holonic.md` | Sección 2 | Principios: 1a1v, CDS, subsidiaridad, consentimiento |
| 2 | `openspec/specs/alrac-governance-holonic.md` | Sección 4 | Tipos decisión + umbrales (constitucional=consentimiento) |
| 3 | `openspec/specs/alrac-governance-holonic.md` | Sección 5 | `calculateCDS()` completo con 4 componentes |
| 4 | `openspec/specs/alrac-governance-holonic.md` | Sección 5 | CDS Gates tabla |
| 5 | `openspec/specs/alrac-governance-holonic.md` | Sección 6 | Asamblea general, proceso propuesta, formato estándar |
| 6 | `openspec/specs/alrac-governance-holonic.md` | Sección 7 | 3 comités rotativos (técnico, económico, territorial) |
| 7 | `openspec/specs/alrac-governance-holonic.md` | Sección 8 | Veto Núcleo (solo constitucional/monetario) |
| 8 | `src/core/state/alrac.ts` | `ALRACGovernance` | Interface con decisionLadder, licenseAudit |

---

## 9. PRINCIPIO ANFIBIO (POSTMONETARIO ↔ CONECTADO)

### **Definición**
> **Misma lógica de cálculo, distinta infraestructura**: Postmonetario (ZNU/CaaS offline, default) ↔ Conectado (USDC/USDC vía oráculo priceParity, Nivel 3 ReFi)

### **Comportamiento por Modo**

| Capacidad | Postmonetario (Offline) | Conectado (Online, Nivel 3 ReFi) |
|-----------|------------------------|----------------------------------|
| **Identity** | Local DID + VC offline | Sync a HSCSG network, anchor on-chain |
| **Data/Trust** | Local merkle log | Periodic anchor to HSCSG DTN |
| **ValueFlows** | Local ledger TQ/ZNU | Cross-node sync via bridge nodes |
| **Coordination** | Local discovery | Full P2P + DTN relay |
| **Kernel IA** | Local inference only | Federated learning (opt-in) |
| **NEXO** | Local knowledge graph | Sync to global NEXO |
| **Revenue Streams** | `usdcIn = 0`, `priceParity = 1` | `usdcIn > 0`, `priceParity` = oráculo USDC |
| **ZNU** | Crédito interno 2-3% | Puente fiat, 1 ZNU ≈ 1 USD |
| **TQ** | kWh medidos locales | kWh + USD equivalencia |

### **Implementación en Código**
```typescript
// Flag determina implementación interna
nodeMode: 'postmonetario' | 'conectado'
priceParity: number  // 1.0 en postmonetario, oráculo USDC en conectado
```

### **Fuentes Explícitas**

| # | Archivo | Sección | Contenido |
|---|---------|---------|-----------|
| 1 | `README.md` | Principios Fundamentales | "Principio Anfibio: Misma lógica, distinta infraestructura" |
| 2 | `openspec/specs/alrac-architecture.md` | Sección 2.1 | "Zeitnus = Única Capa que Toca Fiat" |
| 3 | `openspec/specs/alrac-caas-revenue-streams.md` | Sección 9 | Tabla modo postmonetario vs conectado |
| 4 | `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` | Sección 7 | Tabla modo anfibio por adaptador |
| 5 | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Sección 1 | Mapping video → Zeitnus con principio anfibio |
| 6 | `src/core/state/alrac.ts` | `FiatLayer` | `timeline.yearsBeforeSavings`, `bankingBridge` |

---

## 10. MATRIZ DE VALIDACIÓN CRUZADA

| Concepto | README | Specs OpenSpec | TypeScript Core | Docs Maestros | Simulaciones | Estado |
|----------|--------|----------------|-----------------|---------------|--------------|--------|
| Amid 35/35/30 | ✅ | ✅ (revenue.md) | ✅ (alrac.ts) | ✅ (ZEITNUS, GRANALLIANZA) | ✅ (5 escenarios) | **CONSISTENTE** |
| Ecuación ω⁽ᵏ⁾ | ❌ | ✅ (revenue.md) | ✅ (alrac.ts) | ❌ | ❌ | **CORE ONLY** |
| 6 CaaS Streams | ❌ | ✅ (caas-revenue) | ✅ (caas.ts) | ✅ (ZEITNUS) | ✅ (simulados) | **CONSISTENTE** |
| Gate MJ | ❌ | ✅ (caas-revenue) | ❌ | ❌ | ❌ | **SPEC ONLY** |
| CSA Risk Sharing | ❌ | ✅ (caas-revenue) | ✅ (caas.ts) | ✅ (ZEITNUS) | ❌ | **PARTIAL** |
| Enterprise Staking | ❌ | ❌ | ✅ (tq.ts) | ✅ (ZEITNUS) | ❌ | **CODE + DOCS** |
| TQ Exchange Guard | ✅ | ✅ (exchangeGuard) | ✅ (tq.ts) | ✅ (architecture) | ✅ | **CONSISTENTE** |
| Conversion Factor | ❌ | ✅ (conversionFactor) | ✅ (tq.ts) | ❌ | ❌ | **CORE + SPEC** |
| CDS Calculation | ❌ | ✅ (governance) | ❌ | ❌ | ✅ (AUT/CDS métricas) | **SPEC + SIM** |
| CDS Weighted 30% | ❌ | ✅ (governance) | ❌ | ✅ (GRANALLIANZA) | ✅ | **PARTIAL** |
| Principio Anfibio | ✅ | ✅ (architecture) | ⚠️ (flag implícito) | ✅ (HSCSG, ZEITNUS) | ❌ | **DOCS + SPEC** |

---

## 📁 ARCHIVOS FUENTE PRIMARIOS (Para Auditoría)

### **Specs OpenSpec (`openspec/specs/`)**
```
alrac-revenue.md                    # Reparto Amid, líneas A-E, motor Forner
alrac-caas-revenue-streams.md       # 6 streams, Gate MJ, CSA, Amid split por stream
alrac-tq-exchangeGuard.md           # Prohibición TQ↔fiat, verifyTQProhibition()
alrac-tq-conversionFactor.md        # FC = canasta_TQ(500)/canasta_Fiat
alrac-governance-holonic.md         # 1a1v, CDS, comités, veto, triaxial
alrac-architecture.md               # 5 capas, separación TQ/ZNU, GNAP sync
alrac-caas-membership.md            # 3 niveles, derechos, transiciones, CDS gates
alrac-znu-indexing-credit.md        # Canasta, crédito 2-3%, expiración, 1a1v
alrac-fiat-layer.md                 # Bridge USDC, 4 niveles ReFi, priceParity
alrac-governance.md                 # Gobernanza, licencia, Yoka, piloto
```

### **TypeScript Core (`src/core/`)**
```
lib/tq.ts              # TQ Ledger completo (~1060 líneas)
lib/alrac.ts           # 15+ funciones puras (calculateRevenueSplit, gammaCARMIS, etc.)
lib/caas.ts            # CaaS streams + CSA extendido
state/alrac.ts         # 25+ interfaces (ALRACState, RevenueSplit, ProductLine, etc.)
state/caas.ts          # CaaSRevenueStream extendido
state/store.ts         # AppState + updateALRAC/resetALRAC
hooks/alrac.ts         # Selectores + actions tipados
```

### **Documentos Maestros (`docs/`)**
```
ZEITNUS_REGENERATIVE_MODEL.md       # Video Samay → Enterprise Staking + 3 Horizontes + CSA + Turismo
GRANALLIANZA_MAPPING.md             # 5 líneas × 7 holones, sprint 60 días
HSCSG_INTEGRATION_ARCHITECTURE.md   # 4 adaptadores, flujos datos, roadmap
CAOS_MODELONEGOCIO_ANALISIS.md      # γ-CARMIS activo, Paso II, 5 evasiones
ALRAC_MASTER_INTEGRADO.md           # Arquitectura completa, 12 colaboraciones
simulacion_4agent_20260919/         # 5 escenarios + análisis comparativo
```

---

## ✅ CHECKLIST DE CUMPLIMIENTO (Para Validación)

- [ ] **Amid 35/35/30** presente en: README, specs, core, docs, simulaciones
- [ ] **Ecuación ω⁽ᵏ⁾** implementada en `src/core/lib/alrac.ts:calculateRevenueSplit()`
- [ ] **6 CaaS Streams** definidos en spec + interface TypeScript + docs
- [ ] **Gate MJ** validado en spec (pre/post condiciones)
- [ ] **CSA Subscription** con riesgo compartido (abundance/scarcity multipliers)
- [ ] **Enterprise Staking** 5 rubros + StackMetrics + StakingScore (0-100)
- [ ] **TQ Exchange Guard** bloquea 100% TQ→fiat/cripto (`verifyTQProhibition()`)
- [ ] **Conversion Factor** solo para DEX Capa 3 (FC = 500/basketFiat)
- [ ] **CDS Calculation** 4 componentes, pesos 0.25/0.25/0.30/0.20
- [ ] **CDS Gates** 0.6/0.7/0.8/0.3 umbrales documentados
- [ ] **Principio Anfibio** documentado en 5+ archivos, flag `nodeMode` en arquitectura
- [ ] **Cross-Node Pools** harmony-weighted (φʰ = 0.95^k · (1+αʰ/10))
- [ ] **PPE Clause** `verifyPPEClause()`: γ_ind ≈ ½θ_generado (anti-explotación)
- [ ] **β_crit Cap** `verifyBetaCrit()`: techo anti-acaparamiento interno

---

## 📝 NOTAS DE MANTENIMIENTO

1. **Fuente de verdad**: `openspec/specs/` (specs ejecutables) + `src/core/` (TypeScript válido)
2. **Documentos derivados**: `docs/` se actualizan tras cambios en specs/core
3. **Simulaciones**: Validan coherencia numérica, no definen reglas
4. **Versión**: Cada spec tiene `version: 1.0` o `0.1` - incrementar en breaking changes
5. **Trazabilidad**: `SPEC_INDEXER.md` mapea cada spec a capa, autor, contexto

---

*Documento generado: 2026-10-12 | Repo: Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo | Commit: dfb8f63*
*Última sincronización specs: 2026-10-07 (SPEC_INDEXER.md v2.1 - 25 specs)*
*Core ALRAC TypeScript: ✅ 0 errores (`npx tsc --noEmit`)*

---

**Licencia**: MIT (código) / CC0 (documentos) / OpenSpec (specs)
**Principio**: El código es territorio. La documentación es mapa. La verdad es el territorio.