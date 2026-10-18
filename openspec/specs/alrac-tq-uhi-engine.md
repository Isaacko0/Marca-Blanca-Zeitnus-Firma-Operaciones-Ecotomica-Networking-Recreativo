# TQ UHI Engine Specification
## openspec/specs/alrac-tq-uhi-engine.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger Extension  
**Función**: Motor determinístico que mapea 9 income streams del UHI Simulator (Shapiro) a 9 TQ DividendPolicies configurables, permitiendo simulaciones de escenarios post-labor dentro de la arquitectura ALRAC/TQ.

---

## 1. Definición del Problema

El UHI Simulator (UniversalHighIncome/simulations) modela la transición de ingresos familiares medianos bajo automatización usando 9 streams de ingresos. ALRAC/TQ necesita integrar este modelo como **políticas de dividendo TQ** ejecutables, manteniendo:
- Prohibición cambiaria (TQ ≠ fiat/cripto)
- Principio anfibio (postmonetario ↔ conectado)
- Anclaje termodinámico (1 TQ = 1 kWh)
- γ-CARMIS compliance

---

## 2. Especificación Técnica

### 2.1 Tipos Principales

#### `UHIParameters` — Configuración completa de simulación
```typescript
interface UHIParameters {
  // Horizonte de simulación
  endYear: number;                    // default: 2060
  
  // Dinámica de automatización
  automationPace: number;             // %/yr, default: 2.5
  baseGdpGrowth: number;              // % real, default: 2.0
  
  // SWF (Sovereign Wealth Fund)
  swfSeed: number;                    // $B, default: 100
  swfContribRate: number;             // % GDP, default: 1.5
  swfReturnRate: number;              // % nominal, default: 7.0
  swfSpendRule: number;               // % balance/yr, default: 3.0
  
  // UBI (Universal Basic Income)
  ubiMonthly: number;                 // $/adult/mo, default: 2000
  ubiRampYears: number;               // years, default: 12
  
  // Baby Bonds
  babyBondSeed: number;               // $, default: 5000
  babyBondReturn: number;             // %/yr, default: 7.0
  babyBondMaturity: number;           // years, default: 18
  
  // ESOP / Cooperative
  esopGrowth: number;                 // %/yr coverage expansion, default: 7.0
  
  // Data / AI Royalty
  dataRoyaltyMax: number;             // $/HH at full automation, default: 12000
  
  // Carbon / Commons Dividend
  carbonBase: number;                 // $/HH/yr, default: 900
  carbonGrowth: number;               // %/yr, default: 4.0
  
  // Private Investment
  privateInvBase: number;             // $/HH/yr, default: 4185
  privateInvGrowth: number;           // %/yr, default: 3.5
  
  // Demonetization / Deflation Gain
  demonetRate: number;                // % max cost reduction, default: 35
  
  // Revenue Source Toggles
  enableVAT: boolean;                 // +0.15 revenue factor
  enableAutomationLevy: boolean;      // +0.10 revenue factor
  enableWealthTax: boolean;           // +0.08 revenue factor
  
  // Intervention Toggles
  enableSWF: boolean;
  enableUBI: boolean;
  enableBabyBonds: boolean;
  enableESOP: boolean;
  enableDataRoyalty: boolean;
  enableCarbon: boolean;
  enableDemonetization: boolean;
  
  // TQ-specific target mode
  targetMode: 'postmonetario' | 'conectado';
}
```

#### `UHIResult` — Resultado de simulación
```typescript
interface UHIResult {
  parameters: UHIParameters;
  yearly: UHIYearlyResult[];
  summary: {
    medianHHIncome2060: number;
    medianHHIncome2060Effective: number;
    swfBalance2060: number;
    totalTQEquityGenerated: number;  // kWh/year capacity
    tqDividendPolicies: TQDividendPolicy[];
  };
}
```

### 2.2 Función Principal: `simulateUHI(params: UHIParameters): UHIResult`

**Algoritmo determinístico** (sin feedback loops entre streams, igual que UHI Simulator):

```
PARA cada año desde BASE_YEAR (2025) hasta endYear:
  1. automationLevel = computeAutomationLevel(año, automationPace)
     - Fórmula logística: level = min(0.95, level + pace × (1+level) × (1-level))
  
  2. autoFromBase = max(0, (automationLevel - 0.05) / 0.95)
  
  3. gdp = computeGDP(año, baseGdpGrowth, automationLevel)
     - gdp(t) = gdp(t-1) × (1 + baseGdpGrowth/100 + automationLevel × 0.025)
  
  4. revenueFactor = computeRevenueFactor(params)
     - baseline 0.60 + VAT(0.15) + AutoLevy(0.10) + WealthTax(0.08), cap 1.0
  
  5. COMPUTA 9 STREAMS (independientes, sin feedback):
     a. wages = computeWages(autoFromBase)
        - wageMultiplier = max(0.04, 1 - autoFromBase × 0.96)
        - productivityPremium = 1 + autoFromBase × 0.3
        - floor $3,000
     
     b. socialInsurance = computeSocialInsurance(gdp, año)
        - BASE_SOCIAL_INSURANCE × (gdp/BASE_GDP)^0.25 × (1 + t × 0.005)
     
     c. swfDividend = computeSWFDividend(año, gdp, revenueFactor, swfParams)
        - contribution = contribRate × gdp × revenueFactor
        - balance acumula: balance(t-1) + contribution + returns - distribution
        - dividend = distribution / NUM_HH
     
     d. ubi = computeUBI(año, revenueFactor, ubiParams) [si enableUBI]
        - ramp = min(1, t / ubiRampYears)
        - ubi = ubiMonthly × 12 × 1.5 × ramp × revenueFactor
     
     e. esop = computeESOP(año, gdp, esopGrowth) [si enableESOP]
        - ramp = min(1, t / 5)
        - min($30K, $800 × (1+growth)^t × (gdp/BASE_GDP)^0.3 × ramp)
     
     f. babyBonds = computeBabyBonds(año, babyBondParams) [si enableBabyBonds]
        - 0 hasta maturity, luego maturedValue × return × cohortFraction
        - cohortFraction = min(1, (t - maturity) / 25)
     
     g. dataRoyalty = computeDataRoyalty(año, gdp, automationLevel, revenueFactor, max) [si enableDataRoyalty]
        - dataRoyaltyMax × autoFromBase × (gdp/BASE_GDP)^0.4 × revenueFactor × ramp(8yr)
     
     h. carbonDividend = computeCarbonDividend(año, carbonBase, carbonGrowth) [si enableCarbon]
        - carbonBase × (1+growth)^t × ramp(3yr)
     
     i. privateInvestment = computePrivateInvestment(año, gdp, privateInvParams)
        - privateInvBase × (1+growth)^t × (gdp/BASE_GDP)^0.2
  
  6. nominalTotal = suma de 9 streams
  
  7. demonetizationGain = computeDemonetizationGain(nominalTotal, autoFromBase, demonetRate) [si enableDemonetization]
     - costReduction = (demonetRate/100) × autoFromBase
     - purchasingPowerMultiplier = 1 / (1 - costReduction)
     - gain = nominalTotal × (purchasingPowerMultiplier - 1)
  
  8. effectiveTotal = nominalTotal + demonetizationGain
  
  9. REGISTRA UHIYearlyResult
```

### 2.3 Mapeo a TQ DividendPolicies: `mapUHIParamsToTQDividendPolicies(uhi): TQDividendPolicy[]`

| UHI Stream | TQ DividendPolicy | Distribution Rule | Node Target |
|------------|-------------------|-------------------|-------------|
| SWF Dividend | Federal RegionalDividendFund + EquityPool | pro-rata-equity | federal |
| UBI | Hybrid (CommunityFund + RegionalDividendFund) | hybrid (50/50) | federal |
| ESOP | EquityPool (Cooperative) | pro-rata-equity | cooperative-pool |
| Baby Bonds | TQEquityAccount (Intergeneracional) | pro-rata-equity (matured only) | federal |
| Data Royalty | ProductiveAsset(type:data) + EquityPool(Commons) | per-capita | data-commons-pool |
| Carbon Dividend | ProductiveAsset(type:forest/water) + RegionalDividendFund | per-capita | commons-pool |
| Private Investment | TQEquityAccount (Personal) | pro-rata-equity | personal |
| Social Insurance | CommunityFund | per-capita | community-fund |
| Demonetization | ConversionFactor adjustment | N/A | N/A |

---

## 3. Preset Scenarios (Validación)

### 3.1 Proactive (Default)
```typescript
{
  endYear: 2060, automationPace: 2.5, baseGdpGrowth: 2.0,
  swfSeed: 100, swfContribRate: 1.5, swfReturnRate: 7.0, swfSpendRule: 3.0,
  ubiMonthly: 2000, ubiRampYears: 12,
  babyBondSeed: 5000, babyBondReturn: 7.0, babyBondMaturity: 18,
  esopGrowth: 7.0, dataRoyaltyMax: 12000,
  carbonBase: 900, carbonGrowth: 4.0,
  privateInvBase: 4185, privateInvGrowth: 3.5,
  demonetRate: 35,
  enableVAT: true, enableAutomationLevy: true, enableWealthTax: true,
  enableSWF: true, enableUBI: true, enableBabyBonds: true,
  enableESOP: true, enableDataRoyalty: true, enableCarbon: true, enableDemonetization: true,
  targetMode: 'conectado'
}
```
**Expected**: Median HH Income 2060 ≈ $142,577 nominal (matches UHI Simulator S3 moderate)

### 3.2 Reactive
- SWF seed=0, contrib=0.8%, UBI ramp=18yr, babyBondSeed=2000
- **Expected**: ~$95K nominal (bridge problem visible)

### 3.3 Delayed
- Capital streams OFF (SWF, baby bonds, data royalty, ESOPs)
- VAT/WealthTax OFF, UBI ramp=22yr
- **Expected**: ~$55K nominal (transfer trap)

### 3.4 No Action
- All interventions OFF
- **Expected**: ~$28K nominal (deflationary death spiral)

---

## 4. Validaciones Obligatorias

| Test | Input | Expected |
|------|-------|----------|
| **Proactive 2060** | `simulateUHI(proactive)` | medianHHIncome2060 ≈ 142,577 ±5% |
| **Reactive 2060** | `simulateUHI(reactive)` | medianHHIncome2060 ≈ 95,000 ±5% |
| **Delayed 2060** | `simulateUHI(delayed)` | medianHHIncome2060 ≈ 55,000 ±5% |
| **NoAction 2060** | `simulateUHI(noAction)` | medianHHIncome2060 ≈ 28,000 ±5% |
| **Revenue Factor** | all enabled → 0.93; none → 0.60 | Exact match |
| **Automation Level** | 2025→0.05, 2060→~0.95 | Logistic curve |
| **Demonetization** | demonetRate=35, autoFromBase=1 → multiplier 1.538 | Exact formula |
| **TQ Mapping** | 9 streams → 9 DividendPolicies | Count + rules match table |
| **TypeScript** | `tsc --noEmit` | 0 errores en src/core/lib/tq*.ts |

---

## 5. Integración con Arquitectura ALRAC

### 5.1 En `simulateNode()` (alrac.ts)
```typescript
// Extender simulateNode para aceptar UHIParameters
export function simulateNode(config: NodeConfig & { uhiParams?: UHIParameters }): NodeSimulationResult {
  // ... existing logic ...
  
  if (config.uhiParams) {
    const uhiResult = simulateUHI(config.uhiParams);
    // Mapear uhiResult.yearly → TQNodeState.dividendPolicies
    // Actualizar TQEquityAccount.totalEquityKwhYear
    // Ejecutar dividendos vía executeDividends()
  }
  
  return result;
}
```

### 5.2 UI: `/alrac` tab "Simulador Post-Labor"
- Panel izquierdo: Controles UHIParameters (sliders + toggles)
- Panel central: Stacked area chart (9 streams + effective total)
- Panel derecho: Métricas TQ (EAI, SWF Balance, Equity Gini, γ-CARMIS)
- Preset buttons: Proactive / Reactive / Delayed / No Action
- Standalone: `docs/uhi-tq-simulator.html` (vanilla JS + Chart.js)

---

## 6. Archivos de Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq-uhi-engine.ts` | Motor principal (~710 líneas) |
| `src/core/lib/tq-types-extended.ts` | Tipos extendidos (~350 líneas) |
| `src/core/lib/tq.ts` | Re-exports + integración |
| `openspec/specs/alrac-tq-uhi-engine.md` | Este spec |
| `docs/uhi-tq-simulator.html` | Standalone UI (vanilla JS + Chart.js CDN) |

---

## 7. Criterios de Aceptación

- [ ] `simulateUHI(proactive).summary.medianHHIncome2060` ∈ [135K, 150K]
- [ ] `simulateUHI(reactive).summary.medianHHIncome2060` ∈ [90K, 100K]
- [ ] `simulateUHI(delayed).summary.medianHHIncome2060` ∈ [52K, 58K]
- [ ] `simulateUHI(noAction).summary.medianHHIncome2060` ∈ [26K, 30K]
- [ ] `validateAgainstUHISimulator()` retorna 4 presets con `passed: true`
- [ ] `mapUHIParamsToTQDividendPolicies()` genera 9 policies con rules correctas
- [ ] `tsc --noEmit` → 0 errores en `src/core/lib/tq*.ts`
- [ ] `tqDividendPolicies` en summary incluyen metadata completa por stream
- [ ] ConversionFactor dynamics: demonetization afecta `conversionFactor` via canasta_Fiat deflated

---

## 8. Referencias

- **UHI Simulator**: `daveshap/UniversalHighIncome/simulations/UHI_Simulator.html` + `uhi_simulator.jsx`
- **UHI README**: `daveshap/UniversalHighIncome/simulations/README.md` (spec.md completo)
- **Post-Labor Economics**: `daveshap/PostLaborEconomics` (conceptos Three-Bucket, 9 streams)
- **ALRAC TQ**: `src/core/lib/tq.ts` (Capa 1 existente)
- **TQ Post-Labor Proposal**: `docs/TQ_POSTLABOR_PROPOSAL.md` (Dual-Layer architecture)
- **Shapiro Assimilation**: `docs/SHAPIRO_PLE_ASIMILACION.md` (mapeo completo)

---

## 9. Próximos Pasos (Fase 2+)

1. **tq-eai-metrics.ts** — ExtendedAutonomyMetrics + tqEconomicAgencyIndex computation
2. **tq-gaia-bridge.ts** — GAIA Initiative → Gran Alianza sync
3. **UI Integration** — `/alrac` tab "Simulador Post-Labor" + standalone HTML
4. **BEA CAINC7 ingestion** — `conversionFactor` real-time via API
5. **DeseOS Bridge** — Migrar P1-P11 modules para UI generation (Pepe Sevilla collaboration)

---

*Spec v1.0 — Listo para implementación Fase 1. Validación automática via `validateAgainstUHISimulator()` integrada en test suite.*