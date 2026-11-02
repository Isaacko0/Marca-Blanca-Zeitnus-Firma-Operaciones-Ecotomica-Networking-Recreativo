# Spec: CaaS ROI Calculator + SDS Tracker + Benchmarks 2026 + Proyección 36m

**Fuente**: Documento "Plataformas de Comunidades CaaS.txt" — Secciones: ROI Financiero (SDS formula, ROI integral, Benchmarks, Payback 12-18m)  
**Prioridad**: P0 (Crítico para justificación financiera y gobernanza)  
**Archivos Zeitnus**: `src/core/lib/caasROI.ts`, `src/core/state/caasROI.ts`, `src/app/screens/CaaSROI.tsx`

---

## 1. Modelo de Datos (State)

```typescript
// src/core/state/caasROI.ts

export interface CaasROIInputs {
  // === COSTES OPERATIVOS ===
  platformLicenseMonthly: number;        // USD/mes (licencia plataforma)
  managedServicesMonthly: number;        // USD/mes (agencia/moderación externa)
  moderationHoursMonthly: number;        // Horas/mes moderación interna
  moderationHourlyRate: number;          // USD/hora moderador interno
  
  // === VOLUMEN SOPORTE (Pre-CaaS baseline) ===
  monthlySupportTickets: number;         // Tickets/mes antes de CaaS
  ticketFullyLoadedCost: number;         // USD/ticket (agentes + infra + overhead fully loaded)
  
  // === DEFLEXIÓN (Post-CaaS) ===
  communitySearchesMonthly: number;      // Búsquedas/visitas hilos con solución indexada
  deflectionRate: number;                // 0-1 (benchmark: 14-45%)
  
  // === RETENCIÓN (LTV Lift) ===
  totalCustomers: number;                // Total clientes/miembros base
  annualChurnRate: number;               // 0-1 (churn anual actual)
  communityMemberChurnReduction: number; // 0-1 (reducción churn miembros comunidad vs no-miembros, benchmark 30-31%)
  avgCustomerLTV: number;                // USD (Lifetime Value promedio cliente)
  
  // === PIPELINE COMERCIAL (Aceleración) ===
  monthlyDeals: number;                  // Deals/mes en pipeline
  communityInfluencedDealRate: number;   // 0-1 (% deals influenciados por comunidad, benchmark 10-30%)
  dealCloseRateTraditional: number;      // 0-1 (close rate ventas tradicionales, benchmark 42%)
  dealCloseRateCommunity: number;        // 0-1 (close rate deals comunidad, benchmark 72%)
  avgDealSize: number;                   // USD (tamaño promedio deal)
  salesCycleDaysTraditional: number;     // Días ciclo ventas tradicional (benchmark 90+)
  salesCycleDaysCommunity: number;       // Días ciclo ventas comunidad (benchmark <90)
  
  // === CONFIGURACIÓN AVANZADA ===
  projectionMonths: number;              // Meses a proyectar (default 36)
  discountRate: number;                  // Tasa descuento anual para NPV (default 0.10)
  taxRate: number;                       // Tasa impositiva (default 0.25)
}

export interface CaasROIResult {
  // === SDS (Support Deflection Savings) ===
  sds: {
    grossSavingsAnnual: number;          // V_searches × R_deflection × C_ticket (anual)
    platformOverheadAnnual: number;      // E_platform_overhead (anual)
    netSavingsAnnual: number;            // Gross - Overhead (anual)
    monthlySavings: number;              // Net savings / 12
    paybackMonths: number;               // Meses para recuperar overhead
    deflectionRate: number;              // Tasa deflexión actual
    benchmarkDeflection: { good: [number, number]; excellent: [number, number] };
  };
  
  // === ROI INTEGRAL ===
  roi: {
    deflectionSavingsAnnual: number;     // Ahorro por deflexión (anual)
    retentionValueAnnual: number;        // Valor retención/LTV lift (anual)
    pipelineValueAnnual: number;         // Valor pipeline acelerado (anual)
    totalCostsAnnual: number;            // Costes totales (anual)
    totalBenefitsAnnual: number;         // Beneficios totales (anual)
    netAnnualValue: number;              // Neto anual (beneficios - costes)
    roiPercent: number;                  // ROI % = (Net / Costs) × 100
    paybackMonths: number;               // Payback total (meses)
    npv36Months: number;                 // NPV a 36 meses con discount rate
    irr: number | null;                  // IRR si calculable
  };
  
  // === BENCHMARKS 2026 ===
  benchmarks: {
    deflectionRate: { 
      current: number; 
      good: [number, number];           // [min, max] 
      excellent: [number, number]; 
      status: 'below' | 'good' | 'excellent';
    };
    annualRetentionRate: { 
      current: number; 
      good: [number, number]; 
      excellent: [number, number]; 
      status: 'below' | 'good' | 'excellent';
    };
    pipelineInfluenceRate: { 
      current: number; 
      good: [number, number]; 
      excellent: [number, number]; 
      status: 'below' | 'good' | 'excellent';
    };
    engagementRate: { 
      current: number; 
      good: number; 
      excellent: number; 
      status: 'below' | 'good' | 'excellent';
    };
    costPerActiveMember: { 
      current: number; 
      benchmark: number; 
      status: 'below' | 'good' | 'excellent';
    };
    ltvToCacRatio: { 
      current: number; 
      benchmark: number; 
      status: 'below' | 'good' | 'excellent';
    };
    moderatorBurnoutRisk: { 
      current: number; 
      benchmark: number; 
      status: 'below' | 'good' | 'excellent';
    };
  };
  
  // === PROYECCIÓN MENSUAL (36 meses) ===
  projection: MonthlyProjection[];
  
  // === METADATA ===
  calculatedAt: number;
  inputsHash: string;                    // Hash de inputs para detectar cambios
  version: string;                       // Versión del calculador
}

export interface MonthlyProjection {
  month: number;                         // 1-36
  // Costes
  platformCost: number;
  moderationCost: number;
  totalCosts: number;
  // Beneficios
  deflectionSavings: number;
  retentionValue: number;
  pipelineValue: number;
  totalBenefits: number;
  // Neto
  netMonthly: number;
  cumulativeNet: number;
  cumulativeROI: number;                 // % ROI acumulado
  // Flujo de caja
  cashFlow: number;
  discountedCashFlow: number;            // Con discount rate
  cumulativeNPV: number;
}

export interface CaasROIState {
  calculator: CaasROICalculator;
  currentResult: CaasROIResult | null;
  currentInputs: CaasROIInputs | null;
  history: CaasROIResult[];              // Últimos 12 cálculos
  lastCalculation: number | null;
  calculationInProgress: boolean;
  benchmarks: CaasROIBenchmarks;
}

export interface CaasROIBenchmarks {
  // Benchmarks mercado 2026 (del documento fuente)
  deflectionRate: { good: [number, number]; excellent: [number, number] };
  annualRetentionRate: { good: [number, number]; excellent: [number, number] };
  pipelineInfluenceRate: { good: [number, number]; excellent: [number, number] };
  engagementRate: { good: number; excellent: number };
  costPerActiveMember: { good: number; excellent: number };
  ltvToCacRatio: { good: number; excellent: number };
  moderatorBurnoutRisk: { good: number; excellent: number };
  reserveRunwayMonths: { good: number; excellent: number };
  demurrageHealth: { good: number; excellent: number };
}
```

---

## 2. Calculadora Principal (CaasROICalculator)

```typescript
// src/core/lib/caasROI.ts

import type {
  CaasROIInputs, CaasROIResult, MonthlyProjection, CaasROIBenchmarks
} from '@core/state/caasROI';

export class CaasROICalculator {
  // Benchmarks mercado 2026 (extraídos del documento fuente)
  static readonly BENCHMARKS_2026: CaasROIBenchmarks = {
    deflectionRate: { good: [0.15, 0.25], excellent: [0.35, 0.45] },
    annualRetentionRate: { good: [0.65, 0.75], excellent: [0.85, 1.0] },
    pipelineInfluenceRate: { good: [0.10, 0.20], excellent: [0.30, 1.0] },
    engagementRate: { good: 0.034, excellent: 0.068 },
    costPerActiveMember: { good: 50, excellent: 25 },        // USD/mes
    ltvToCacRatio: { good: 3, excellent: 5 },
    moderatorBurnoutRisk: { good: 0.4, excellent: 0.2 },    // 0-1 (menor mejor)
    reserveRunwayMonths: { good: 6, excellent: 12 },
    demurrageHealth: { good: 0.3, excellent: 0.6 }           // 0-1 (mayor mejor)
  };

  calculate(inputs: CaasROIInputs): CaasROIResult {
    // Validar inputs
    this.validateInputs(inputs);
    
    const now = Date.now();
    const months = inputs.projectionMonths || 36;
    const discountRateMonthly = inputs.discountRate / 12 || 0.10 / 12;
    const taxRate = inputs.taxRate || 0.25;

    // ============================================================================
    // 1. SDS (Support Deflection Savings) - Fórmula empírica
    // SDS = (V_community_searches × R_deflection × C_ticket) - E_platform_overhead
    // ============================================================================
    
    const annualSearches = inputs.communitySearchesMonthly * 12;
    const grossSavingsAnnual = annualSearches * inputs.deflectionRate * inputs.ticketFullyLoadedCost;
    
    const annualPlatformCost = (inputs.platformLicenseMonthly + inputs.managedServicesMonthly) * 12;
    const annualModerationCost = inputs.moderationHoursMonthly * inputs.moderationHourlyRate * 12;
    const platformOverheadAnnual = annualPlatformCost + annualModerationCost;
    
    const netSavingsAnnual = grossSavingsAnnual - platformOverheadAnnual;
    const monthlySavings = netSavingsAnnual / 12;
    const paybackMonths = platformOverheadAnnual > 0 && monthlySavings > 0 
      ? Math.ceil(platformOverheadAnnual / monthlySavings) 
      : 0;

    // ============================================================================
    // 2. RETENTION VALUE (LTV Lift)
    // ============================================================================
    
    const churnReduction = inputs.annualChurnRate * inputs.communityMemberChurnReduction;
    const retainedCustomers = inputs.totalCustomers * churnReduction;
    const retentionValueAnnual = retainedCustomers * inputs.avgCustomerLTV * (1 - taxRate); // Post-tax
    
    // ============================================================================
    // 3. PIPELINE VALUE (Aceleración Comercial)
    // ============================================================================
    
    const annualDeals = inputs.monthlyDeals * 12;
    const communityDeals = annualDeals * inputs.communityInfluencedDealRate;
    const traditionalDeals = annualDeals * (1 - inputs.communityInfluencedDealRate);
    
    // Revenue incremental = (Community deals × close rate community - Traditional deals × close rate traditional) × avg deal size
    const communityRevenue = communityDeals * inputs.dealCloseRateCommunity * inputs.avgDealSize;
    const traditionalRevenue = traditionalDeals * inputs.dealCloseRateTraditional * inputs.avgDealSize;
    const pipelineValueAnnual = (communityRevenue - traditionalRevenue) * (1 - taxRate); // Post-tax incremental
    
    // ============================================================================
    // 4. TOTAL ROI
    // ============================================================================
    
    const totalCostsAnnual = platformOverheadAnnual;
    const totalBenefitsAnnual = netSavingsAnnual + retentionValueAnnual + pipelineValueAnnual;
    const netAnnualValue = totalBenefitsAnnual - totalCostsAnnual;
    const roiPercent = totalCostsAnnual > 0 ? (netAnnualValue / totalCostsAnnual) * 100 : 0;
    const paybackMonthsTotal = totalCostsAnnual > 0 && netAnnualValue > 0 
      ? Math.ceil((totalCostsAnnual / netAnnualValue) * 12) 
      : 0;
    
    // NPV 36 meses
    let npv36 = 0;
    for (let m = 1; m <= 36; m++) {
      const monthlyNet = netAnnualValue / 12;
      const discountFactor = Math.pow(1 + discountRateMonthly, m);
      npv36 += monthlyNet / discountFactor;
    }
    npv36 -= totalCostsAnnual; // Invertir costes iniciales en mes 0
    
    // IRR approximation (Newton-Raphson simplificado)
    const irr = this.approximateIRR(totalCostsAnnual, netAnnualValue, 36);
    
    // ============================================================================
    // 5. BENCHMARKS ASSESSMENT
    // ============================================================================
    
    const benchmarks = this.assessBenchmarks(inputs, {
      deflectionRate: inputs.deflectionRate,
      annualRetentionRate: 1 - inputs.annualChurnRate * (1 - inputs.communityMemberChurnReduction),
      pipelineInfluenceRate: inputs.communityInfluencedDealRate,
      engagementRate: 0, // Se calcula desde datos reales
      costPerActiveMember: 0, // Se calcula desde CaaS data
      ltvToCacRatio: 0, // Se calcula desde CaaS data
      moderatorBurnoutRisk: 0, // Se calcula desde CHI
      reserveRunwayMonths: 0, // Se calcula desde CaaS data
      demurrageHealth: 0 // Se calcula desde Integral data
    });
    
    // ============================================================================
    // 6. PROYECCIÓN MENSUAL (36 meses)
    // ============================================================================
    
    const projection = this.generateProjection(inputs, {
      monthlyDeflectionSavings: netSavingsAnnual / 12,
      monthlyRetentionValue: retentionValueAnnual / 12,
      monthlyPipelineValue: pipelineValueAnnual / 12,
      monthlyCosts: totalCostsAnnual / 12,
      discountRateMonthly,
      months
    });
    
    // ============================================================================
    // 7. RESULTADO FINAL
    // ============================================================================
    
    return {
      sds: {
        grossSavingsAnnual: Math.round(grossSavingsAnnual),
        platformOverheadAnnual: Math.round(platformOverheadAnnual),
        netSavingsAnnual: Math.round(netSavingsAnnual),
        monthlySavings: Math.round(monthlySavings),
        paybackMonths,
        deflectionRate: inputs.deflectionRate,
        benchmarkDeflection: this.BENCHMARKS_2026.deflectionRate
      },
      roi: {
        deflectionSavingsAnnual: Math.round(netSavingsAnnual),
        retentionValueAnnual: Math.round(retentionValueAnnual),
        pipelineValueAnnual: Math.round(pipelineValueAnnual),
        totalCostsAnnual: Math.round(totalCostsAnnual),
        totalBenefitsAnnual: Math.round(totalBenefitsAnnual),
        netAnnualValue: Math.round(netAnnualValue),
        roiPercent: Math.round(roiPercent * 100) / 100,
        paybackMonths: paybackMonthsTotal,
        npv36Months: Math.round(npv36),
        irr
      },
      benchmarks,
      projection,
      calculatedAt: now,
      inputsHash: this.hashInputs(inputs),
      version: '1.0.0'
    };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private validateInputs(inputs: CaasROIInputs): void {
    if (inputs.monthlySupportTickets < 0) throw new Error('monthlySupportTickets debe ser >= 0');
    if (inputs.ticketFullyLoadedCost < 0) throw new Error('ticketFullyLoadedCost debe ser >= 0');
    if (inputs.deflectionRate < 0 || inputs.deflectionRate > 1) throw new Error('deflectionRate debe estar entre 0 y 1');
    if (inputs.annualChurnRate < 0 || inputs.annualChurnRate > 1) throw new Error('annualChurnRate debe estar entre 0 y 1');
    if (inputs.communityMemberChurnReduction < 0 || inputs.communityMemberChurnReduction > 1) throw new Error('communityMemberChurnReduction debe estar entre 0 y 1');
    if (inputs.dealCloseRateTraditional < 0 || inputs.dealCloseRateTraditional > 1) throw new Error('dealCloseRateTraditional debe estar entre 0 y 1');
    if (inputs.dealCloseRateCommunity < 0 || inputs.dealCloseRateCommunity > 1) throw new Error('dealCloseRateCommunity debe estar entre 0 y 1');
    if (inputs.communityInfluencedDealRate < 0 || inputs.communityInfluencedDealRate > 1) throw new Error('communityInfluencedDealRate debe estar entre 0 y 1');
  }

  private assessBenchmarks(inputs: CaasROIInputs, calculated: Record<string, number>): CaasROIResult['benchmarks'] {
    const bm = this.BENCHMARKS_2026;
    const getStatus = (value: number, good: [number, number], excellent: [number, number], higherBetter = true) => {
      if (higherBetter) {
        if (value >= excellent[0]) return 'excellent';
        if (value >= good[0]) return 'good';
        return 'below';
      } else {
        if (value <= excellent[1]) return 'excellent';
        if (value <= good[1]) return 'good';
        return 'below';
      }
    };

    return {
      deflectionRate: { 
        current: inputs.deflectionRate, 
        good: bm.deflectionRate.good, 
        excellent: bm.deflectionRate.excellent,
        status: getStatus(inputs.deflectionRate, bm.deflectionRate.good, bm.deflectionRate.excellent, true)
      },
      annualRetentionRate: { 
        current: calculated.annualRetentionRate || (1 - inputs.annualChurnRate * (1 - inputs.communityMemberChurnReduction)), 
        good: bm.annualRetentionRate.good, 
        excellent: bm.annualRetentionRate.excellent,
        status: getStatus(calculated.annualRetentionRate || (1 - inputs.annualChurnRate * (1 - inputs.communityMemberChurnReduction)), bm.annualRetentionRate.good, bm.annualRetentionRate.excellent, true)
      },
      pipelineInfluenceRate: { 
        current: inputs.communityInfluencedDealRate, 
        good: bm.pipelineInfluenceRate.good, 
        excellent: bm.pipelineInfluenceRate.excellent,
        status: getStatus(inputs.communityInfluencedDealRate, bm.pipelineInfluenceRate.good, bm.pipelineInfluenceRate.excellent, true)
      },
      engagementRate: { 
        current: calculated.engagementRate || 0, 
        good: bm.engagementRate.good, 
        excellent: bm.engagementRate.excellent,
        status: getStatus(calculated.engagementRate || 0, [bm.engagementRate.good, 1], [bm.engagementRate.excellent, 1], true)
      },
      costPerActiveMember: { 
        current: calculated.costPerActiveMember || 0, 
        good: bm.costPerActiveMember.good, 
        excellent: bm.costPerActiveMember.excellent,
        status: getStatus(calculated.costPerActiveMember || 0, [bm.costPerActiveMember.good, 999], [bm.costPerActiveMember.excellent, 999], false)
      },
      ltvToCacRatio: { 
        current: calculated.ltvToCacRatio || 0, 
        good: bm.ltvToCacRatio.good, 
        excellent: bm.ltvToCacRatio.excellent,
        status: getStatus(calculated.ltvToCacRatio || 0, [bm.ltvToCacRatio.good, 999], [bm.ltvToCacRatio.excellent, 999], true)
      },
      moderatorBurnoutRisk: { 
        current: calculated.moderatorBurnoutRisk || 0, 
        good: bm.moderatorBurnoutRisk.good, 
        excellent: bm.moderatorBurnoutRisk.excellent,
        status: getStatus(calculated.moderatorBurnoutRisk || 0, [bm.moderatorBurnoutRisk.good, 1], [bm.moderatorBurnoutRisk.excellent, 1], false)
      }
    };
  }

  private generateProjection(
    inputs: CaasROIInputs, 
    monthly: { monthlyDeflectionSavings: number; monthlyRetentionValue: number; monthlyPipelineValue: number; monthlyCosts: number; discountRateMonthly: number; months: number }
  ): MonthlyProjection[] {
    const projection: MonthlyProjection[] = [];
    let cumulativeNet = 0;
    let cumulativeNPV = 0;
    
    for (let m = 1; m <= monthly.months; m++) {
      // Costes (asumimos constantes, se pueden hacer crecer con inflación)
      const platformCost = inputs.platformLicenseMonthly + inputs.managedServicesMonthly;
      const moderationCost = inputs.moderationHoursMonthly * inputs.moderationHourlyRate;
      const totalCosts = platformCost + moderationCost;
      
      // Beneficios (pueden crecer orgánicamente)
      const growthFactor = Math.pow(1.02, (m - 1) / 12); // 2% crecimiento anual compuesto
      const deflectionSavings = monthly.monthlyDeflectionSavings * growthFactor;
      const retentionValue = monthly.monthlyRetentionValue * growthFactor;
      const pipelineValue = monthly.monthlyPipelineValue * growthFactor;
      const totalBenefits = deflectionSavings + retentionValue + pipelineValue;
      
      const netMonthly = totalBenefits - totalCosts;
      cumulativeNet += netMonthly;
      const cumulativeROI = totalCosts * m > 0 ? (cumulativeNet / (totalCosts * m)) * 100 : 0;
      
      // Discounted cash flow
      const discountFactor = Math.pow(1 + monthly.discountRateMonthly, m);
      const discountedCashFlow = netMonthly / discountFactor;
      cumulativeNPV += discountedCashFlow;
      
      projection.push({
        month: m,
        platformCost,
        moderationCost,
        totalCosts,
        deflectionSavings: Math.round(deflectionSavings),
        retentionValue: Math.round(retentionValue),
        pipelineValue: Math.round(pipelineValue),
        totalBenefits: Math.round(totalBenefits),
        netMonthly: Math.round(netMonthly),
        cumulativeNet: Math.round(cumulativeNet),
        cumulativeROI: Math.round(cumulativeROI * 100) / 100,
        cashFlow: Math.round(netMonthly),
        discountedCashFlow: Math.round(discountedCashFlow),
        cumulativeNPV: Math.round(cumulativeNPV)
      });
    }
    
    return projection;
  }

  private approximateIRR(initialCost: number, annualNetValue: number, years: number): number | null {
    // IRR approximation: solve for r where NPV = 0
    // NPV = -initialCost + Σ(annualNetValue / (1+r)^t) = 0
    // Simplificación: si annualNetValue * years > initialCost, IRR > 0
    const totalReturns = annualNetValue * years;
    if (totalReturns <= initialCost) return null;
    
    // Aproximación: IRR ≈ (totalReturns/initialCost)^(1/years) - 1
    const ratio = totalReturns / initialCost;
    return Math.round((Math.pow(ratio, 1/years) - 1) * 10000) / 10000;
  }

  private hashInputs(inputs: CaasROIInputs): string {
    const str = JSON.stringify(inputs);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(36);
  }
}
```

---

## 3. Integración con Datos Reales (Auto-población desde sistemas)

```typescript
// src/core/lib/caasROIAutoPopulate.ts

import type { CaasROIInputs } from '@core/state/caasROI';

export class CaasROIAutoPopulate {
  // Auto-poblar inputs desde sistemas vivos (Integral, CaaS, CHI, Gamification)
  
  static async populateFromSystems(nodeId: string = 'local'): Promise<Partial<CaasROIInputs>> {
    const [integral, caas, chi, gamification] = await Promise.all([
      this.getIntegralData(nodeId),
      this.getCaaSData(nodeId),
      this.getCHIData(nodeId),
      this.getGamificationData(nodeId)
    ]);

    return {
      // Costes (desde CaaS config)
      platformLicenseMonthly: caas.platformLicenseMonthly || 149,      // Bettermode baseline
      managedServicesMonthly: caas.managedServicesMonthly || 0,
      moderationHoursMonthly: caas.moderationHoursMonthly || 20,
      moderationHourlyRate: caas.moderationHourlyRate || 25,
      
      // Volumen soporte (baseline histórico o estimado)
      monthlySupportTickets: integral.historicalTicketsMonthly || 500,
      ticketFullyLoadedCost: integral.ticketCost || 50,               // USD/ticket fully loaded
      
      // Deflexión (desde CHI + Integral signals)
      communitySearchesMonthly: chi.valueCreation.communityVisits || integral.estimatedMonthlyVisits || 10000,
      deflectionRate: chi.valueCreation.deflectionRate || 0.14,       // Baseline 14%
      
      // Retención (desde CHI + CaaS memberships)
      totalCustomers: caas.memberships?.length || 100,
      annualChurnRate: caas.annualChurnRate || 0.20,
      communityMemberChurnReduction: chi.participation.activeRatio > 0.5 ? 0.31 : 0.15, // Benchmark 31% si activa
      avgCustomerLTV: caas.avgCustomerLTV || 5000,
      
      // Pipeline (estimado o desde CRM si sincronizado)
      monthlyDeals: caas.monthlyDeals || 10,
      communityInfluencedDealRate: chi.valueCreation.advocacyActions > 0 ? 0.20 : 0.10,
      dealCloseRateTraditional: 0.42,    // Benchmark
      dealCloseRateCommunity: 0.72,      // Benchmark
      avgDealSize: caas.avgDealSize || 5000,
      salesCycleDaysTraditional: 120,
      salesCycleDaysCommunity: 60,
      
      // Configuración
      projectionMonths: 36,
      discountRate: 0.10,
      taxRate: 0.25
    };
  }

  // Generar inputs para escenario "Conservador / Realista / Optimista"
  static generateScenarios(baseInputs: CaasROIInputs): { conservative: CaasROIInputs; realistic: CaasROIInputs; optimistic: CaasROIInputs } {
    return {
      conservative: {
        ...baseInputs,
        deflectionRate: baseInputs.deflectionRate * 0.7,
        communityMemberChurnReduction: baseInputs.communityMemberChurnReduction * 0.7,
        communityInfluencedDealRate: baseInputs.communityInfluencedDealRate * 0.7,
        dealCloseRateCommunity: baseInputs.dealCloseRateCommunity * 0.9,
        platformLicenseMonthly: baseInputs.platformLicenseMonthly * 1.2,
        managedServicesMonthly: baseInputs.managedServicesMonthly * 1.2
      },
      realistic: baseInputs,
      optimistic: {
        ...baseInputs,
        deflectionRate: Math.min(baseInputs.deflectionRate * 1.3, 0.45),
        communityMemberChurnReduction: Math.min(baseInputs.communityMemberChurnReduction * 1.3, 0.40),
        communityInfluencedDealRate: Math.min(baseInputs.communityInfluencedDealRate * 1.3, 0.35),
        dealCloseRateCommunity: Math.min(baseInputs.dealCloseRateCommunity * 1.1, 0.80),
        platformLicenseMonthly: baseInputs.platformLicenseMonthly * 0.9,
        managedServicesMonthly: baseInputs.managedServicesMonthly * 0.9
      }
    };
  }

  // Stubs
  private static async getIntegralData(nodeId: string) { return {}; }
  private static async getCaaSData(nodeId: string) { return {}; }
  private static async getCHIData(nodeId: string) { return {}; }
  private static async getGamificationData(nodeId: string) { return {}; }
}
```

---

## 4. Pantalla CaaSROI.tsx

```tsx
// src/app/screens/CaaSROI.tsx

export function CaaSROIScreen() {
  const { 
    roiCalculator, 
    currentInputs, 
    currentResult, 
    calculateROI, 
    populateFromSystems,
    generateScenarios,
    benchmarks,
    history 
  } = useAppStore();

  const [activeScenario, setActiveScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');
  const [inputs, setInputs] = useState<CaasROIInputs>(currentInputs || DEFAULT_INPUTS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-calcular al cambiar inputs (debounced)
  useEffect(() => {
    const timer = setTimeout(() => calculateROI(inputs), 500);
    return () => clearTimeout(timer);
  }, [inputs, calculateROI]);

  const scenarioInputs = generateScenarios(inputs);
  const scenarioResult = currentResult; // Se recalcula automáticamente

  return (
    <div className="p-6 space-y-6">
      <Header title="CaaS ROI Calculator" subtitle="SDS + ROI Integral + Benchmarks 2026 + Proyección 36m + Escenarios" />
      
      {/* Scenario Selector */}
      <ScenarioSelector 
        active={activeScenario} 
        onChange={setActiveScenario}
        scenarioInputs={scenarioInputs}
      />

      {/* Inputs Panel - Collapsible Sections */}
      <InputsPanel 
        inputs={inputs} 
        onChange={setInputs}
        showAdvanced={showAdvanced}
        onToggleAdvanced={setShowAdvanced}
        benchmarks={benchmarks}
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Btn onClick={() => populateFromSystems().then(populated => setInputs(prev => ({ ...prev, ...populated })))} variant="secondary">
          🔄 Auto-poblar desde sistemas
        </Btn>
        <Btn onClick={() => setInputs(DEFAULT_INPUTS)} variant="ghost">
          ↩️ Resetear a defaults
        </Btn>
        <Btn onClick={() => calculateROI(inputs)} disabled={false}>
          🧮 Calcular ROI
        </Btn>
      </div>

      {/* Results - Key Metrics Cards */}
      {currentResult && (
        <>
          <ROIKeyMetricsCard result={currentResult} scenario={activeScenario} />
          
          {/* SDS Card */}
          <SDSDetailCard sds={currentResult.sds} />
          
          {/* ROI Breakdown */}
          <ROIBreakdownCard roi={currentResult.roi} />
          
          {/* Benchmarks */}
          <BenchmarksCard benchmarks={currentResult.benchmarks} />
          
          {/* Projection Chart */}
          <ProjectionChart36m data={currentResult.projection} />
          
          {/* Scenario Comparison */}
          <ScenarioComparisonCard 
            scenarios={scenarioInputs}
            results={scenarioResults}
            active={activeScenario}
          />
          
          {/* History */}
          <HistoryPanel history={history} />
        </>
      )}
    </div>
  );
}

// Componentes auxiliares
function ROIKeyMetricsCard({ result, scenario }: { result: CaasROIResult; scenario: string }) {
  const { sds, roi } = result;
  const isPositive = roi.roiPercent > 0;
  
  return (
    <Card title={`ROI Resumen (${scenario})`} className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard 
        label="SDS Neto Mensual" 
        value={`${(sds.monthlySavings/1000).toFixed(1)}k`} 
        color={sds.monthlySavings > 0 ? 'text-emerald-400' : 'text-rose-400'}
        sub={sds.paybackMonths > 0 ? `Payback: ${sds.paybackMonths}m` : 'Sin payback'}
      />
      <StatCard 
        label="ROI Anual" 
        value={`${roi.roiPercent.toFixed(1)}%`} 
        color={isPositive ? 'text-emerald-400' : 'text-rose-400'}
        sub={`NPV 36m: ${(roi.npv36Months/1000).toFixed(0)}k`}
      />
      <StatCard 
        label="Payback Total" 
        value={`${roi.paybackMonths}m`} 
        color={roi.paybackMonths > 0 && roi.paybackMonths <= 18 ? 'text-emerald-400' : 'text-amber-400'}
        sub={roi.paybackMonths > 18 ? '>18m (revisar)' : 'Óptimo <18m'}
      />
      <StatCard 
        label="Deflexión Actual" 
        value={`${(sds.deflectionRate*100).toFixed(1)}%`} 
        color={sds.deflectionRate >= 0.35 ? 'text-emerald-400' : sds.deflectionRate >= 0.15 ? 'text-amber-400' : 'text-rose-400'}
        sub={`Benchmark: ${(sds.benchmarkDeflection.good[0]*100).toFixed(0)}-${(sds.benchmarkDeflection.good[1]*100).toFixed(0)}%`}
      />
      <StatCard 
        label="IRR Estimado" 
        value={roi.irr ? `${(roi.irr*100).toFixed(1)}%` : 'N/A'} 
        color="text-sky-400"
        sub="Aproximado"
      />
    </Card>
  )
}

function ProjectionChart36m({ data }: { data: MonthlyProjection[] }) {
  // Chart usando recharts o similar
  // Líneas: Cumulative Net, Cumulative NPV, Monthly Net, Costs, Benefits
  // Anotaciones: Payback point, Break-even, ROI milestones
  return (
    <Card title="Proyección 36 Meses" className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={m => `M${m}`} />
          <YAxis />
          <Tooltip formatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Legend />
          <Line type="monotone" dataKey="cumulativeNet" name="Neto Acumulado" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="cumulativeNPV" name="NPV Acumulado" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="netMonthly" name="Neto Mensual" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="totalCosts" name="Costes" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
          <Line type="monotone" dataKey="totalBenefits" name="Beneficios" stroke="#10b981" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

---

## 5. Criterios de Aceptación

### SDS (Support Deflection Savings)
- [ ] Fórmula correcta: `(V_searches × R_deflection × C_ticket) - E_overhead`
- [ ] Inputs: communitySearchesMonthly, deflectionRate, ticketFullyLoadedCost, platformLicenseMonthly, managedServicesMonthly, moderationHoursMonthly, moderationHourlyRate
- [ ] Outputs: grossSavingsAnnual, platformOverheadAnnual, netSavingsAnnual, monthlySavings, paybackMonths
- [ ] Benchmark comparison: good 15-25%, excellent 35-45%

### Retention Value (LTV Lift)
- [ ] Fórmula: `totalCustomers × annualChurnRate × churnReduction × avgLTV × (1-tax)`
- [ ] churnReduction = annualChurnRate × communityMemberChurnReduction
- [ ] Benchmark churnReduction: 30-31% mejor retención

### Pipeline Value (Aceleración)
- [ ] Fórmula: `(communityDeals × closeRateCommunity - traditionalDeals × closeRateTraditional) × avgDealSize × (1-tax)`
- [ ] communityDeals = annualDeals × communityInfluencedDealRate
- [ ] Benchmarks: closeRateCommunity 72% vs closeRateTraditional 42%, pipeline influence 10-30%

### ROI Integral
- [ ] TotalBenefits = DeflectionSavings + RetentionValue + PipelineValue
- [ ] ROI% = (TotalBenefits - TotalCosts) / TotalCosts × 100
- [ ] Payback months = TotalCosts / (NetAnnualValue/12)
- [ ] NPV 36 meses con discount rate mensual
- [ ] IRR approximation

### Benchmarks 2026
- [ ] Deflection: good 15-25%, excellent 35-45%
- [ ] Retención anual: good 65-75%, excellent 85%+
- [ ] Pipeline influence: good 10-20%, excellent 30%+
- [ ] Engagement rate: good 3.4%, excellent 6.8%
- [ ] Cost/active member: good $50, excellent $25
- [ ] LTV/CAC: good 3x, excellent 5x
- [ ] Moderator burnout: good 0.4, excellent 0.2
- [ ] Status badges: below/good/excellent con colores

### Proyección 36 Meses
- [ ] 36 filas mensuales con: costs, benefits, net, cumulative, ROI%, NPV
- [ ] Growth factor 2% anual compuesto opcional
- [ ] Discounted cash flow con discount rate mensual
- [ ] Chart interactivo: cumulativeNet, cumulativeNPV, netMonthly, costs, benefits
- [ ] Anotaciones: payback point, break-even, ROI milestones

### Auto-población + Escenarios
- [ ] Auto-poblar desde Integral, CaaS, CHI, Gamification
- [ ] 3 escenarios: Conservador (0.7x), Realista (1.0x), Optimista (1.3x capped)
- [ ] Comparativa lado a lado de 3 escenarios
- [ ] Hash de inputs para detectar cambios y recalcular

### Integración Arquitectura
- [ ] Inputs auto-poblados desde CaaS config + CHI metrics + Integral signals
- [ ] Results → FRS signal_packet (weekly)
- [ ] Benchmarks status → CHI alerts (si below threshold)
- [ ] ROI metrics → CDS governance (quarterly review)

---

## Referencias Normativas

- **Documento fuente**: "Plataformas de Comunidades CaaS.txt" — Sección completa "Cómo se calcula el ROI financiero de CaaS" (2 versiones consistentes)
- **CaaS_integration.md**: CaaS-BM revenue streams, cost structure, MJ gate
- **COMMUNITY_HEALTH_INDEX_SPEC.md**: CHI metrics que alimentan ROI (deflectionRate, retention, etc.)
- **CAAS_GAMIFICATION_SPEC.md**: Gamification metrics que alimentan ROI (advocacyActions, engagementRate)
- **Integral Devguide v0.1**: ITC (rewards), FRS (signals), CDS (governance review)
- **Reglamento Fedeco**: Art 17 (impuestos/fondo), Art 16 (límite simétrico → sustainability)