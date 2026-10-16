# Asimilación Sinérgica: Shapiro (PLE/UHI/EAI/GAIA) → Zeitnus/ALRAC/TQ

> **Fecha**: 2026-10-15
> **Repositorio base**: `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`
> **Repositorios fuente**: `daveshap/UniversalHighIncome`, `daveshap/PostLaborEconomics`, `daveshap/PLE_Economic_Agency_Index`, `daveshap/GAIA_Initiative`
> **Licencias fuente**: CC0-1.0 (PostLaborEconomics), MIT (UniversalHighIncome, PLE_Economic_Agency_Index), MIT (GAIA_Initiative)
> **Respeto de derechos de autor**: Esta asimilación usa **conceptos, fórmulas y arquitecturas públicas** de los repositorios fuente (licencias permisivas). No reproduce texto protegido del whitepaper UHI v01.docx ni PDFs de Deep Research.

---

## 1. Mapa de Correspondencias Conceptuales

| Concepto Shapiro (Público) | Implementación Zeitnus/ALRAC | Archivo/Componente |
|---------------------------|------------------------------|-------------------|
| **Three-Bucket Identity** (wages, capital, transfers) | TQ Dual-Layer: Flow (wages/reciprocidad) + Stock (capital/dividendos) + Community Fund (transfers) | `tq.ts`, `tq-equity.ts`, `tq-dividend.ts` |
| **9 Income Streams** (UHI Simulator) | 9 Políticas de Dividendo TQ configurables | `tq-dividend.ts` → `DividendPolicy.distributionRule` |
| **Sovereign Wealth Fund (SWF)** | `RegionalDividendFund` (estilo Alaska) + `EquityPool` tipo `federal` | `tq-regional-dividend.ts`, `tq-equity-pools.ts` |
| **UBI** | Dividendo per-cápita híbrido (50% equity + 50% per-capita) | `tq-dividend.ts` → `hybrid` rule |
| **ESOP/Cooperative Profit Share** | `EquityPool` tipo `cooperative` + `governanceRights` | `tq-equity-pools.ts` |
| **Baby Bonds** | `TQShare.acquisitionType: 'grant'` + herencia intergeneracional | `tq-equity.ts` |
| **Data/AI Royalty** | `ProductiveAsset.type: 'data'` + `TQShare` en asset | `tq-equity.ts` |
| **Carbon/Commons Dividend** | `ProductiveAsset.type: 'water' | 'forest' | 'spectrum'` | `tq-equity.ts` |
| **Private Investment Returns** | `TQEquityAccount` personal shares en activos productivos | `tq-equity.ts` |
| **Demonetization/Deflation Gain** | `conversionFactor` actualizado por canasta ICE/Ecoinvent + poder adquisitivo | `tq.ts` → `conversionFactor()` |
| **Economic Agency Index (EAI)** | `AutonomyMetrics` extendido con `equityControl` + `transferDependence` | `tq.ts` → `computeAutonomyMetrics()` |
| **GAIA Initiative** | Gran Alianza por la Vida: Holón **GAIA** (ecosistema + articulación) | `docs/GRANALLIANZA_MAPPING.md` |
| **GATO Framework** | HSCSG v15 OS + ALRAC Governance (Capa 5) | `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` |

---

## 2. Mapeo Detallado: UHI Simulator → TQ Dual-Layer

### 2.1 Three-Bucket Identity → TQ Architecture

```
SHAPIRO (UHI)                    ZEITNUS/ALRAC (TQ)
┌─────────────────────────┐      ┌─────────────────────────┐
│ BUCKET 1: WAGES         │      │ CAPA FLUJO (TQ Account) │
│ - Residual wages        │  ──► │ - balance ±500 TQ       │
│ - Human provenance      │      │ - reciprocity/production│
│   premium ($3K floor)   │      │ - regeneration          │
├─────────────────────────┤      ├─────────────────────────┤
│ BUCKET 2: CAPITAL       │      │ CAPA STOCK (TQ Equity)  │
│ - SWF Dividend          │  ──► │ - TQEquityAccount       │
│ - ESOP/Co-op            │      │ - TQShare (fracción)    │
│ - Baby Bonds            │      │ - Dividendo TQ = kWh/año│
│ - Data/AI Royalty       │      │   → TQAccount.flow      │
│ - Carbon/Commons        │      │ - Sin límite ±500       │
│ - Private Investment    │      │ - Acumulable, heredable │
├─────────────────────────┤      ├─────────────────────────┤
│ BUCKET 3: TRANSFERS     │      │ COMMUNITY FUND +        │
│ - UBI                   │  ──► │ REGIONAL DIVIDEND FUND  │
│ - Social Insurance      │      │ - β_crit redistribution │
│                         │      │ - Per-cápita (Alaska)   │
└─────────────────────────┘      └─────────────────────────┘
```

### 2.2 9 Income Streams → Políticas de Dividendo TQ

| Stream UHI | Parámetros UHI | Política TQ Equivalente | Implementación |
|------------|----------------|-------------------------|----------------|
| **SWF Dividend** | `swfSeed`, `swfContribRate`, `swfReturnRate`, `swfSpendRule` | `RegionalDividendFund` + `EquityPool.federal` | `tq-regional-dividend.ts`, `tq-equity-pools.ts` |
| **UBI** | `ubiMonthly`, `ubiRampYears` | `DividendPolicy.distributionRule: 'hybrid'` (50% per-capita) | `tq-dividend.ts` |
| **ESOP/Co-op** | `esopGrowth`, cap $30K | `EquityPool.type: 'cooperative'`, `governance: 'harmony-weighted'` | `tq-equity-pools.ts` |
| **Baby Bonds** | `babyBondSeed`, `babyBondReturn`, `babyBondMaturity` | `TQShare.acquisitionType: 'grant'`, `transferable: true`, `vestingSchedule` | `tq-equity.ts` |
| **Data/AI Royalty** | `dataRoyaltyMax`, 8-yr ramp | `ProductiveAsset.type: 'data'`, `TQShare` fracción pública | `tq-equity.ts` |
| **Carbon/Commons** | `carbonBase`, `carbonGrowth` | `ProductiveAsset.type: 'water'|'forest'|'spectrum'`, municipal ownership | `tq-equity.ts` |
| **Private Investment** | `privateInvBase`, `privateInvGrowth` | `TQEquityAccount.personal` shares | `tq-equity.ts` |
| **Social Insurance** | GDP elasticity 0.25 | `CommunityFund` baseline allocation (always-on) | `tq.ts` → `CommunityFund` |
| **Demonetization** | `demonetRate` (35% max) | `conversionFactor` dinámico: FC = canasta_TQ(500)/canasta_Fiat_deflated | `tq.ts` → `updateConversionFactor()` |

### 2.3 Parámetros UHI → Configuración TQ

```typescript
// Mapeo directo de parámetros UHI → TQ DividendPolicy
interface UHIToTQMapping {
  // SWF → RegionalDividendFund / Federal EquityPool
  swfSeed: number;                    // → RegionalDividendFund.initialCapitalization
  swfContribRate: number;             // → DividendPolicy.reserveRatio (inverso: contribución = 1 - reserve)
  swfReturnRate: number;              // → Asset.expectedReturn (ProductiveAsset)
  swfSpendRule: number;               // → DividendPolicy.distributionRate
  
  // UBI → Hybrid Dividend (per-capita component)
  ubiMonthly: number;                 // → DividendPolicy.minDividendTQ (floor)
  ubiRampYears: number;               // → DividendPolicy.rampSchedule
  
  // ESOP → Cooperative EquityPool
  esopGrowth: number;                 // → EquityPool.dividendReinvestmentRatio + assetAcquisitionThreshold
  
  // Baby Bonds → Intergenerational Equity
  babyBondSeed: number;               // → TQShare.initialGrant (per newborn)
  babyBondMaturity: number;           // → TQShare.vestingYears
  
  // Data Royalty → Data Commons Asset
  dataRoyaltyMax: number;             // → ProductiveAsset.type: 'data'.totalAnnualKwh capacity
  
  // Carbon → Commons Asset
  carbonBase: number;                 // → ProductiveAsset.type: 'forest'.annualDividend
  carbonGrowth: number;               // → Asset.expectedReturn
  
  // Demonetization → Conversion Factor Dynamics
  demonetRate: number;                // → conversionFactor.factor adjustment (deflation index)
}
```

---

## 3. Mapeo: Economic Agency Index (EAI) → AutonomyMetrics Extendido

### 3.1 Fórmula EAI → Métrica Compuesta TQ

**EAI Original (Shapiro):**
```
EAI = (z(Earn) + z(Prop) - z(Transfer)) / √3
```

**Métrica Compuesta TQ (ALRAC):**
```typescript
interface ExtendedAutonomyMetrics extends AutonomyMetrics {
  // Componentes EAI mapeados a TQ
  earnedIncomeShare: number;        // → autonomyRatio (decisiones locales / total)
  propertyIncomeShare: number;      // → equityControl composite (land + energy + compute + water + robotics)
  transferIncomeShare: number;      // → transferDependence (CommunityFund received / total TQ flow)
  
  // EAI Score TQ
  tqEconomicAgencyIndex: number;    // (earnedIncomeShare + propertyIncomeShare - transferIncomeShare) / √3
  
  // Umbrales (adaptados de spec alrac-tq-autonomy.md)
  eaiThresholds: {
    high: 0.5;      // Verde: alta agencia económica
    medium: 0.0;    // Amarillo: dependencia mixta
    low: -0.5;      // Rojo: dependencia de transferencias
  };
}

export function computeTQEconomicAgencyIndex(nodeId: string, period: Period): ExtendedAutonomyMetrics {
  const base = computeAutonomyMetrics(nodeId, period);
  const equity = getEquityControl(nodeId);           // land, energy, compute, water, robotics
  const transfers = getTransferDependence(nodeId);   // CommunityFund + RegionalDividend received
  
  const earnedShare = base.autonomyRatio;                    // 0-1
  const propertyShare = equity.compositeScore;               // 0-1 (ponderado por αʰ)
  const transferShare = Math.min(1, transfers / max(base.totalTQFlow, 1)); // 0-1
  
  // Normalizar a z-scores aproximados (simplificación para toy model)
  const zEarn = (earnedShare - 0.5) * 2;      // centro en 0.5
  const zProp = (propertyShare - 0.3) * 2;    // centro en 0.3 (property típicamente menor)
  const zTrans = (transferShare - 0.3) * 2;   // centro en 0.3
  
  const eai = (zEarn + zProp - zTrans) / Math.sqrt(3);
  
  return {
    ...base,
    earnedIncomeShare: earnedShare,
    propertyIncomeShare: propertyShare,
    transferIncomeShare: transferShare,
    tqEconomicAgencyIndex: eai,
    eaiThresholds: { high: 0.5, medium: 0.0, low: -0.5 }
  };
}
```

### 3.2 Dashboard EAI → UI TQ `/alrac` Tab "Agencia Económica"

| Feature EAI Dashboard | Implementación TQ |
|----------------------|-------------------|
| Choropleth map (condados US) | Mapa nodos TQ (GeoJSON LandRegistry + Node locations) |
| Time-slider (1990-present) | Historical TQEquityAccount.dividendHistory + AutonomyMetrics period series |
| Tooltip: raw shares, decade change, rank | Tooltip: earnedShare, propertyShare, transferShare, EAI, rank entre nodos |
| Download eai.parquet | Export JSON/CSV: `ExtendedAutonomyMetrics` time series |

---

## 4. Mapeo: GAIA Initiative → Gran Alianza por la Vida

### 4.1 Correspondencia de Holones

| GAIA Initiative | Gran Alianza Holón | Rol ALRAC | Colaboración (§12 ALRAC_MASTER) |
|-----------------|-------------------|-----------|--------------------------------|
| **Global AI Agencies** | **GAIA** | Ecosistema + Articulación + Territorio | Líneas A, C, D, E |
| **GATO Framework** | **HSCSG** | Infra confianza/datos/intercambio | Línea E (core), transversal |
| **AI Policy/Safety (FLI, EU AI Act, SAFE)** | **SYNCHROLABS** | Interoperabilidad protocolos | Línea C, E |
| **National AI Commission** | **PROJECT WEAVE** | Identidad + Confianza + Credenciales | Línea A, D |
| **ITEC Corporate Governance** | **PHI** | Educación holística integral | Línea B |
| **UN IAEA for AI** | **DATA TRUST** | Soberanía datos + gobernanza | Línea E, transversal |
| **Senate Hearings (Altman, Marcus)** | **MYCELIUM** | Educación + Matching + Grafos | Línea B, D |

### 4.2 GAIA News → γ-CARMIS Triggers

| GAIA Event | ALRAC γ-CARMIS Equivalente | Acción |
|------------|---------------------------|--------|
| FLI Pause Letter (2023) | `γ-CARMIS trigger: αʰ < κ` por riesgo sistémico | Hard stop → Paso II: Reconfiguración gobernanza IA |
| EU AI Act Classification | `CredoSet` con `criticalThreshold` por risk tier | Verificación triaxial: mental/simulación/laboratorio |
| UN "IAEA for AI" | `FederalTQDividend` para gobernanza global IA | Fondo federal → dividendos per-cápita global |
| Schumer SAFE Framework | `innovationSafetyBalance` parameter en `DividendPolicy` | Equilibrio pace vs safety en automationLevel |

---

## 5. Integración Técnica: Archivos a Crear/Actualizar

### 5.1 Nuevos Archivos Core (Extensión TQ Post-Labor)

```
src/core/lib/
├── tq-equity.ts                 # ✅ YA CREADO en TQ_POSTLABOR_PROPOSAL.md
├── tq-dividend.ts               # ✅ YA CREADO
├── tq-equity-pools.ts           # ✅ YA CREADO
├── tq-regional-dividend.ts      # ✅ YA CREADO
├── tq-uhi-engine.ts             # NUEVO: Motor simulador UHI → TQ params
├── tq-eai-metrics.ts            # NUEVO: ExtendedAutonomyMetrics + EAI computation
├── tq-gaia-bridge.ts            # NUEVO: GAIA Initiative → Gran Alianza sync
└── tq-types-extended.ts         # ✅ Re-export unificado
```

### 5.2 Archivos a Actualizar

```
src/core/lib/
├── tq.ts                        # + import types, + EAI computation, + UHI parameter mapping
├── alrac.ts                     # + simulateNode() integra UHI engine + EAI
├── valueDual.ts                 # + render: UHI streams ↔ TQ dividend policies

src/core/state/
├── alrac.ts                     # + interfaces: UHIParams, EAIMetrics, GAIASync
├── store.ts                     # + slices: uhiSimulator, eaiDashboard, gaiaBridge
└── hooks/alrac.ts               # + selectores/actions: runUHISimulation(), computeEAI(), syncGAIA()

openspec/specs/
├── alrac-tq-uhi-engine.md       # Spec: UHI Simulator → TQ Parameter Mapping
├── alrac-tq-eai-metrics.md      # Spec: Economic Agency Index → TQ Autonomy
├── alrac-tq-gaia-bridge.md      # Spec: GAIA Initiative → Gran Alianza Sync
└── alrac-tq-postlabor-integration.md # Spec maestro: integración completa
```

### 5.3 Specs OpenSpec Detalladas

#### `alrac-tq-uhi-engine.md` — Motor UHI→TQ
- **Función**: `mapUHIParamsToTQ(uhiParams: UHIParameters): TQDividendPolicy[]`
- **Valida**: 9 streams → 9 dividend policies, revenue factor → fiscal capacity
- **Tests**: Proactive/Reactive/Delayed/No Action presets reproducen outputs UHI

#### `alrac-tq-eai-metrics.md` — Índice Agencia Económica TQ
- **Función**: `computeTQEconomicAgencyIndex(nodeId, period): ExtendedAutonomyMetrics`
- **Valida**: EAI ∈ [-2, 2], correlación con autonomyRatio + equityControl
- **Tests**: Nodo con alta equity → EAI > 0.5; nodo solo transfers → EAI < -0.5

#### `alrac-tq-gaia-bridge.md` — Puente GAIA→Gran Alianza
- **Función**: `syncGAIAInitiative(gaiaNews: GAIANews[]): GranAlianzaAction[]`
- **Valida**: Cada news GAIA → action concreta (γ-CARMIS, CredoSet, FederalDividend)
- **Tests**: 7 news históricos GAIA → 7 actions verificables

---

## 6. Simulador UHI Integrado en `/alrac` (UI)

### 6.1 Arquitectura UI (Basada en UHI_Simulator.html)

```
Pantalla /alrac → Tab "Simulador Post-Labor"
├── Panel Izquierdo (Controles UHI)
│   ├── Automation Pace (0.5-5%/yr) → TQ: automationLevel(t) en simulateNode()
│   ├── GDP Growth (1-4%) → TQ: gdp(t) growth + automation boost
│   ├── Revenue Toggles (VAT, AutoLevy, WealthTax) → TQ: revenueFactor
│   ├── Intervention Toggles (9 streams) → TQ: DividendPolicy.enableStream[]
│   └── Parameter Sliders (14 params) → TQ: DividendPolicy params
├── Panel Central (Chart.js / Recharts)
│   ├── Stacked Area: 9 TQ Dividend Streams (colores UHI)
│   ├── Line: Total Effective TQ Income/HH (nominal + demonetization)
│   ├── Reference Line: Today's median ($83,730 → canasta_TQ equivalent)
│   └── Preset Buttons: Proactive/Reactive/Delayed/No Action
└── Panel Derecho (Métricas)
    ├── TQ Economic Agency Index (EAI) gauge
    ├── SWF Balance / TQ Equity Pool Total
    ├── Concentration Gini (TQ Equity)
    └── γ-CARMIS Status (αʰ, κ, overload)
```

### 6.2 Implementación Standalone (Siguiendo UHI_Simulator.html)

```html
<!-- docs/uhi-tq-simulator.html — Versión standalone zero-build -->
<!-- Basada en UHI_Simulator.html: vanilla JS + Chart.js CDN -->
<!-- Motor idéntico a uhi_simulator.jsx pero adaptado a TQ params -->
```

---

## 7. Pipeline de Datos: BEA CAINC7 → TQ ConversionFactor

### 7.1 Fuente: BEA SAINC7/CAINC7 (Público, sin paywall)

```typescript
// tq-bea-ingestion.ts (NUEVO - opcional, para conversionFactor real)
interface BEACAINC7Record {
  GeoFIPS: string;      // County code
  Year: number;
  LineCode: number;     // 3=Wages, 4=Div+Int+Rent, 9=Transfers
  DataValue: number;    // Thousands of dollars
}

// Fetch desde API BEA: https://apps.bea.gov/api/data/
// UserID requerido (gratuito)
async function fetchBEACAINC7(year: number, lineCodes: number[]): Promise<BEACAINC7Record[]> {
  const params = new URLSearchParams({
    UserID: process.env.BEA_API_KEY!,
    dataset: 'Regional',
    TableName: 'SAINC7',
    GeoFIPS: '05000-04999',  // All counties
    LineCode: lineCodes.join(','),
    Year: year.toString(),
    frequency: 'A'
  });
  const response = await fetch(`https://apps.bea.gov/api/data/?${params}`);
  return response.json();
}

// Cálculo canasta básica real para conversionFactor
async function computeRealBasketFiat(region: string): Promise<number> {
  // 1. Obtener SAINC7 para condados en región
  // 2. Calcular ingreso per-cápita mediano
  // 3. Aplicar Regional Price Parities (RPP) para deflactar
  // 4. Retornar canasta_Fiat en moneda local
}
```

### 7.2 Integración con `conversionFactor()` Existente

```typescript
// En tq.ts - actualización de updateConversionFactor()
export async function updateConversionFactor(region: string): Promise<ConversionFactor> {
  // OPCIÓN A: BEA SAINC7 + RPP (real, requiere API key)
  // const basketFiat = await fetchRealBasketPrice(region);
  
  // OPCIÓN B: ICE/Ecoinvent regionalizado (actual, placeholder)
  const basketFiat = await fetchBasketPrice(region);
  
  // OPCIÓN C: UHI Demonetization adjustment
  // basketFiat = basketFiat * (1 - demonetizationGain)  // poder adquisitivo real
  
  return conversionFactor(500, basketFiat, region, 'ICE');
}
```

---

## 8. Validación Cruzada: Presets UHI → Escenarios TQ

| Preset UHI | Configuración TQ | Resultado Esperado (2060) |
|------------|------------------|---------------------------|
| **Proactive** | All streams enabled, revenueFactor=0.93, SWF seed=$100B | Median HH: ~$142K effective TQ income (≈142,577 UHI) |
| **Reactive** | SWF seed=0, contrib=0.8%, UBI ramp=18yr | Median HH: ~$95K effective (gap vs Proactive = bridge problem) |
| **Delayed** | Capital streams OFF, VAT/WealthTax OFF, UBI only | Median HH: ~$55K effective (transfer trap) |
| **No Action** | All interventions OFF | Median HH: ~$28K effective (deflationary death spiral) |

**Validación**: Ejecutar `simulateNode()` con parámetros UHI mapeados → comparar `effectiveTotal` vs UHI Simulator output.

---

## 9. Riesgos y Mitigaciones (Asimilación)

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Whitepaper UHI v01.docx no público** | Alta | Medio | Usar solo README/simulations/docs públicos (MIT/CC0). No acceder al .docx. |
| **PDFs Deep Research en PostLaborEconomics** | Alta | Bajo | Solo referenciar conceptos públicos en README/spec.md. No copiar PDFs. |
| **Parámetros UHI especulativos (demonetRate, dataRoyaltyMax)** | Media | Medio | Exponer como sliders configurables; documentar como "toy model assumptions". |
| **EAI requiere datos BEA API (UserID)** | Media | Bajo | `conversionFactor` usa placeholder ICE/Ecoinvent; BEA opcional para producción. |
| **GAIA Initiative = advocacy, no código** | Baja | Bajo | Mapear solo conceptos de gobernanza a γ-CARMIS/Gran Alianza. |
| **Divergencia NEXO (Yoka) vs GAIA** | Media | Alto | Paso 0 inmediato: conversación Yoka (§10 ALRAC_MASTER). |

---

## 10. Plan de Ejecución (90 Días — Extiende ALRAC_MASTER §10)

| Fase | Tiempo | Entregables | Validación |
|------|--------|-------------|------------|
| **Fase 0: Setup** | Semana 1 | `tq-uhi-engine.ts`, `tq-eai-metrics.ts`, `tq-gaia-bridge.ts` stubs | `tsc --noEmit` clean |
| **Fase 1: UHI Engine** | Semanas 2-4 | Mapeo 9 streams → DividendPolicy, presets Proactive/Reactive/Delayed/NoAction | Outputs median HH income ≈ UHI Simulator (±5%) |
| **Fase 2: EAI Metrics** | Semanas 4-6 | `ExtendedAutonomyMetrics`, choropleth nodos TQ, time-slider | EAI correlaciona con autonomyRatio (r > 0.7) |
| **Fase 3: GAIA Bridge** | Semanas 6-7 | `syncGAIAInitiative()`, 7 news históricos → 7 actions | γ-CARMIS triggers documentados |
| **Fase 4: UI Integration** | Semanas 7-10 | Tab "Simulador Post-Labor" en `/alrac`, standalone `uhi-tq-simulator.html` | Double-click HTML works, chart renders |
| **Fase 5: Data Pipeline** | Semanas 10-12 | BEA SAINC7 ingestion (opcional), conversionFactor real | `updateConversionFactor('MX')` usa datos reales |
| **Fase 6: Specs + Tests** | Semanas 12-14 | 4 specs OpenSpec, tests unitarios + E2E | `tsc --noEmit` clean, 80% coverage |
| **Fase 7: Docs + Sync** | Semanas 14-16 | `docs/TQ_POSTLABOR_INTEGRATION.md`, GNAP sync ambos repos | `alrac-coordinator` heartbeat OK |

---

## 11. Criterios de Éxito (KPIs Asimilación)

| Métrica | Target | Medición |
|---------|--------|----------|
| **Paridad UHI Simulator** | Median HH income 2060 ±5% vs UHI Proactive | `simulateNode(uhiParams).effectiveTotal` |
| **EAI Computation** | < 100ms por nodo, 10 años history | `computeTQEconomicAgencyIndex()` benchmark |
| **γ-CARMIS Integration** | 100% GAIA news → action mapping | 7/7 news históricos producen action válida |
| **UI Performance** | < 200ms re-render on param change | Chart.js/Recharts stacked area 35 years × 9 streams |
| **TypeScript Clean** | 0 errores en `src/core/lib/tq*.ts` | `npx tsc --noEmit \| grep tq` |
| **Spec Compliance** | 100% acceptance criteria passed | `alrac-spec-validator` pipeline |

---

## 12. Próximo Paso Inmediato

> **¿Iniciar Fase 1 (UHI Engine)?** Requiere:
> 1. Crear `src/core/lib/tq-uhi-engine.ts` con mapeo 9 streams → DividendPolicy
> 2. Implementar `simulateUHI(params: UHIParameters): UHIResult` determinístico
> 3. Tests: 4 presets reproducen outputs documentados en UHI Simulator README
> 4. Integrar en `simulateNode()` existente (`alrac.ts`)

**Confirmación requerida**: ¿Procedo con implementación Fase 1?

---

## 13. Colaboración Estratégica: Pepe Sevilla (DeseOS/ContenOS/Soul.MBA)

> **Nota**: Esta colaboración **no está dada por hecho** en el repo; se documenta aquí como dependencia estratégica explícita para la ejecución del plan.

### 13.1 Qué Aporta DeseOS/ContenOS

| Capacidad DeseOS | Mapeo a Plan Shapiro→TQ | Archivo/Componente |
|------------------|-------------------------|-------------------|
| **Arquitectura Anfibia (ZNU↔USD)** | `valueDual.ts` + `nodeMode`/`priceParity` → base para TQ Dual-Layer (Flow/Stock) | `src/core/lib/valueDual.ts` |
| **Pipeline Contenido P1→P11** | 11 módulos metodológicos → UI del Simulador Post-Labor (`/alrac` tab) | `src/modules/agencia/P1-P11` |
| **Auto-llenado BranDNA→VITCH** | Generación automática piezas → Motor escenarios UHI (presets Proactive/Reactive/Delayed) | `src/core/lib/vitch-generator.ts` |
| **Coach FAB (Happpy)** | Asistente IA integrado → Guía interactiva en Simulador TQ | `src/components/CoachFAB.tsx` |
| **Roles Creative/Operator** | Sidebar Motor/Crecimiento → Perfiles usuario Simulador (Policy Maker / Node Operator / Citizen) | `src/app/screens/ALRAC.tsx` |
| **Pagos/Pauta Anfibios** | Módulo facturación dual → `RegionalDividendFund` distribution + external commerce | `src/core/lib/tq-regional-dividend.ts` |

### 13.2 Integración Requerida (Fase 0 - Semana 1)

```typescript
// src/core/lib/deseos-bridge.ts (NUEVO - puente DeseOS → TQ Post-Labor)

import type { ValueDual, NodeMode } from '@core/lib/valueDual';
import type { TQDividendPolicy, UHIParameters } from './tq-uhi-engine';

// 1. Reutilizar valueDual para render dual TQ Stock/Flow
export function renderTQValue(
  amount: number, 
  mode: NodeMode, 
  parity: number,
  layer: 'flow' | 'stock'
): ValueDual {
  // Flow: ±500 TQ (reciprocidad) — Stock: sin límite (equity kWh/año)
  const unit = layer === 'flow' ? 'TQ' : 'TQ-kWh/yr';
  return {
    amount,
    unit: mode === 'conectado' ? 'USD' : unit,
    display: mode === 'conectado' 
      ? `$${(amount * parity).toLocaleString()}`
      : `${amount.toLocaleString()} ${unit}`
  };
}

// 2. Mapear parámetros UHI → DeseOS BranDNA (ICP, Strategic Brain, escalera 5M)
export function mapUHIToBranDNA(uhi: UHIParameters): BranDNAConfig {
  return {
    icp: defineICPFromAutomationPace(uhi.automationPace),
    strategicBrain: defineStrategyFromRevenueToggles(uhi),
    escalera5M: mapIncomeStreamsToLadder(uhi.enabledStreams),
    nodeMode: uhi.targetMode // 'postmonetario' | 'conectado'
  };
}

// 3. Generar escenarios UHI via auto-llenado VITCH
export function generateUHIScenariosViaVITCH(branDNA: BranDNAConfig): UHIScenario[] {
  // Usa motor VITCH de DeseOS para crear 4 presets: Proactive/Reactive/Delayed/NoAction
  return vitchEngine.generate(branDNA, ['proactive', 'reactive', 'delayed', 'noAction']);
}
```

### 13.3 Dependencias Críticas

| Dependencia | Estado | Acción Requerida |
|-------------|--------|------------------|
| `DeseOS_project1.zip` (Fuente) | ✅ Disponible (Pepe Sevilla / Soul.MBA) | Confirmar acceso y licencia MIT |
| `valueDual.ts` + `nodeMode`/`priceParity` | ✅ En `src/core/lib/` | Verificar compatibilidad con TQ Dual-Layer |
| Módulos P1-P11 (39 bundles) | ⏳ Pendiente migración | Fase 0: migrar a `src/modules/agencia/` |
| CoachFAB.tsx (Happpy) | ✅ Implementado en HSCSG | Adaptar a Simulador TQ (`/alrac`) |
| `vitch-generator.ts` (BranDNA→VITCH) | ⏳ Por extraer de DeseOS | Extraer de `DeseOS_extracted/src/modules/P5_VITCH/` |

### 13.4 Protocolo de Coordinación (Pepe Sevilla ↔ ALRAC)

1. **Acceso a fuente**: Confirmar `DeseOS_project1.zip` actualizado + licencia MIT explícita
2. **Mapeo técnico**: Sesión de trabajo (2h) para alinear `valueDual` ↔ `tq-equity/dividend`
3. **Migración P1-P11**: Definir qué módulos son core vs opcionales para Simulador TQ
4. **Testing conjunto**: Validar que presets UHI generados via VITCH coinciden con outputs esperados
5. **Deploy coordinado**: Vercel preview compartido para validación UX/UI

---

*Documento generado por asimilación rigurosa de repositorios públicos bajo licencias permisivas (MIT, CC0-1.0). Conceptos de economía post-trabajo, UHI Simulator, EAI Dashboard y GAIA Initiative mapeados a arquitectura ALRAC/TQ sin reproducir contenido protegido. Colaboración Pepe Sevilla (DeseOS/ContenOS/Soul.MBA) documentada como dependencia estratégica explícita, no asumida.*