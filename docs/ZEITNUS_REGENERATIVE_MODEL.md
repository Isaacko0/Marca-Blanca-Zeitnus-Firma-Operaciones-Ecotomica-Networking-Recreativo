# Zeitnus + ALRAC: Modelo Regenerativo Aplicado (Basado en Video Samay Permacultura)
## Enterprise Staking + Tres Horizontes + Rentabilidad por Omisión + Turismo Regenerativo

---

## 🎯 **Traducción Video → Zeitnus/ALRAC**

| Concepto Video | Implementación Zeitnus/ALRAC |
|----------------|------------------------------|
| **OPEX Reduction** | `verifyTQProhibition()` + `conversionFactor` + internal loops (TQ→huerta→estiercol→suelo) |
| **Rentabilidad por Omisión** | `computeLandTQYield()` + `validateNetRegeneration()` = kWh ahorrados = TQ ganados |
| **Tres Horizontes** | Capa 1 TQ (corto) ↔ Capa 2 CaaS (medio) ↔ Capa 3 ZNU (largo/patrimonio) |
| **Enterprise Staking** | `crossNodePools` + `productFederation` = apilamiento TQ/ZNU/CaaS/Turismo |
| **Matriz Decisión** | `governance` + `taxEngine` (β_crit) + `autonomy` metrics |
| **CSA / Suscripción** | `caasStreams` (suscripción ZNU, revenue_share, b2b, afiliados_verdes, educacion) |
| **Turismo Regenerativo** | `nodeArchitecture` + `land` registry + `digitalSovereignty` (experiencias coherentes) |
| **Embajadores / Marca** | `rao` credentials + `credoSet` (credo del nodo) + `gammaCARMIS` (coherencia) |
| **Storytelling Honesto** | `RAOLog` (append-only) + `triaxialVerification` (mental+sim+lab) |

---

## 🏗️ **Implementación: Enterprise Staking en Zeitnus**

### **Stack de Apilamiento (Enterprise Staking)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    NODO ZEITNUS (Finca Regenerativa)           │
├─────────────────────────────────────────────────────────────────┤
│  HORIZONTE CORTO (Liquidez - Semanas/Meses)                    │
│  ├── Huerta Biointensiva (Market Garden) → TQ Production       │
│  ├── Microgreens / Hojas aromáticas → TQ inmediatos            │
│  ├── Gallinas pastoreo → Estiercol (kWh) + Huevos (TQ)        │
│  └── Visitas guiadas / Talleres → ZNU inmediatos (Turismo)    │
├─────────────────────────────────────────────────────────────────┤
│  HORIZONTE MEDIO (Estabilidad - 1-3 Años)                      │
│  ├── Frutales tempranos / Arbustos → TQ recurrentes            │
│  ├── Sistemas agroforestales jóvenes → Biomasa + Sombra        │
│  ├── Cercos vivos / Infraestructura hídrica → kWh retenidos   │
│  └── CSA / Suscripciones ZNU → Flujo recurrente               │
├─────────────────────────────────────────────────────────────────┤
│  HORIZONTE LARGO (Patrimonio - 5-30 Años)                      │
│  ├── Árboles maderables / Madera noble → ZNU reserves          │
│  ├── Suelo profundo / Carbono orgánico → TQ reserves (±500)   │
│  ├── Infraestructura hídrica profunda → kWh/año perpetuos     │
│  ├── Biodiversidad / Resiliencia climática → αʰ > κ permanente │
│  └── Marca personal / Embajadores → Red de nodos federados    │
└─────────────────────────────────────────────────────────────────┘
```

### **Apilamiento de Rubros (Enterprise Staking) - Flujo Real**

```typescript
// En src/core/lib/tq.ts - Agregar a TQNodeState
interface EnterpriseStakingStack {
  // Rubro 1: Huerta Biointensiva (Motor de Liquidez)
  marketGarden: {
    tqProductionPerM2: number;        // TQ/m²/mes
    cyclesPerYear: number;            // 6-12 ciclos
    znuRevenue: number;               // Ventas directas → ZNU
    biowasteToCompost: number;        // kWh → estiercol
  };
  
  // Rubro 2: Gallinas Pastoreo (Flujo Caja + Fertilidad)
  pasturedPoultry: {
    tqEggsPerWeek: number;            // TQ/huevo
    manureKwhPerMonth: number;        // kWh estiercol → compost
    pestControlValue: number;         // kWh ahorrados (control biológico)
    znuRevenue: number;               // Huevos + carne
  };
  
  // Rubro 3: Agroforestería (Patrimonio Largo)
  agroforestry: {
    treesPlanted: number;
    biomassKwhPerYear: number;        // Podas → compost + leña
    shadeValue: number;               // kWh ahorrados (riego)
    carbonSequestration: number;      // TQ reserves futuras
    timberZnuFuture: number;          // ZNU reserves 10-30 años
  };
  
  // Rubro 4: Turismo Regenerativo (Experiencias de Alto Valor)
  regenerativeTourism: {
    visitsPerMonth: number;
    znuPerVisit: number;              // Precio experiencia
    workshopRevenue: number;          // Talleres cocina/siembra
    lodgingRevenue: number;           // Hospedaje rural
    ambassadorConversion: number;     // % visitantes → embajadores CSA
  };
  
  // Rubro 5: CSA / Suscripción (Riesgo Compartido)
  csaSubscription: {
    members: number;
    znuMonthlyPerMember: number;
    tqDeliveryPerMonth: number;       // Canasta TQ (verduras, huevos, frutas)
    riskSharing: boolean;             // Abundancia/escasez compartida
    ambassadorRate: number;           // % → embajadores
  };
  
  // Métricas Compuestas
  computeStackMetrics(): StackMetrics {
    return {
      // Rentabilidad por Omisión (Video)
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
      
      // Enterprise Staking Score
      stakingScore: this.computeStakingScore()
    };
  }
}
```

---

## 🌱 **Matriz de Decisión (Aplicada a Zeitnus)**

| Rubro | Inversión Inicial | Velocidad Caja | Margen Operativo | Función Ecológica | Score Zeitnus |
|-------|-------------------|----------------|------------------|-------------------|---------------|
| **Huerta Biointensiva** | Baja | Inmediata (semanas) | Alto (78%+) | Fertilidad, cobertura, polinizadores | ⭐⭐⭐⭐⭐ Motor liquidez |
| **Gallinas Pastoreo** | Media | Rápida (meses) | Medio-Alto | Estiercol, control plagas, laboreo | ⭐⭐⭐⭐⭐ Flujo + Fertilidad |
| **Agroforestería** | Alta | Lenta (años) | Bajo inicial → Alto futuro | Carbono, sombra, agua, biodiversidad | ⭐⭐⭐⭐ Patrimonio |
| **Turismo Regenerativo** | Media | Media | Muy Alto | Educación, embajadores, conexión | ⭐⭐⭐⭐⭐ Marca + ZNU |
| **CSA/ZNU Subscription** | Baja | Inmediata | Recurrente | Riesgo compartido, fidelidad | ⭐⭐⭐⭐⭐ Estabilidad |

---

## 🏨 **Turismo Regenerativo: Diseño de Experiencias (Video → Zeitnus)**

### **Principios (Video → Código)**
```typescript
// En src/core/lib/tq.ts - nodeArchitecture
interface RegenerativeTourismDesign {
  // Capacidad de Carga (Video: "Diseño = capacidad de carga, seguridad, baños, rutas")
  carryingCapacity: {
    maxVisitorsPerDay: number;
    maxVisitorsPerWeek: number;
    recoveryDaysBetweenGroups: number;
  };
  
  // Seguridad + Coherencia (Video: "experiencia coherente, no destrozar el lugar")
  safetyAndCoherence: {
    trails: Trail[];              // Rutas diseñadas
    sanitation: SanitationFacility[]; // Baños secos/compost
    emergencyPlan: EmergencyPlan;
    guideRatio: number;           // Guías por visitante
  };
  
  // Experiencias Ofrecidas (Video: visitas, cosecha, cocina, siembra, hospedaje)
  experiences: Experience[];
  
  // Métricas de Éxito (Video: "embajadores", "ingresos enormes", "educación")
  metrics: {
    znuRevenuePerMonth: number;
    ambassadorConversionRate: number;    // % → embajadores CSA
    csaSignupsPerVisit: number;
    educationHoursDelivered: number;
    visitorSatisfaction: number;         // NPS
    ecologicalImpactScore: number;       // Negativo = regeneración neta
  };
  
  // Validación (Video: "no destrozar el lugar al nombre del turismo")
  validateCoherence(): boolean {
    return this.ecologicalImpactScore > 0 && 
           this.visitorSatisfaction > 8 &&
           this.carryingCapacity.maxVisitorsPerDay < this.ecologicalCarryingCapacity;
  }
}
```

### **Experiencias Tipo (Mapeo Video → Zeitnus)**

| Experiencia Video | Producto Zeitnus | Precio (ZNU) | TQ Generados | Embajadores |
|-------------------|------------------|--------------|--------------|-------------|
| Visita guiada 2h | `experience_tour` | 50 ZNU | 50 TQ (educación) | 15% |
| Jornada cosecha 4h | `experience_harvest` | 120 ZNU | 120 TQ (trabajo verificado) | 30% |
| Taller cocina/fermentos | `experience_workshop` | 200 ZNU | 200 TQ (habilidad) | 40% |
| Siembra participativa | `experience_planting` | 80 ZNU | 80 TQ (trabajo) | 25% |
| Hospedaje 1 noche | `experience_lodging` | 300 ZNU | 300 TQ (estancia) | 50% |
| Retiro 3 días | `experience_retreat` | 1500 ZNU | 1500 TQ (inmersión) | 70% |

---

## 🤝 **CSA / Suscripción ZNU (Riesgo Compartido + Fidelidad)**

```typescript
// En src/core/lib/tq.ts - caasStreams ya existe, extender:
interface CSASubscriptionStream extends CaaSRevenueStream {
  key: 'csa_subscription';
  name: 'Suscripción CSA (Comunidad que Sostiene la Agricultura)';
  
  // Video: "Si hay abundancia recibe más, si hay helada todos comprendemos"
  riskSharing: {
    abundanceMultiplier: number;      // 1.5x en abundancia
    scarcityBuffer: number;           // 0.7x en escasez
    communicationProtocol: string;    // Transparencia honesta (video)
  };
  
  // Video: "Embajadores = quien visita y se ensucia las manos"
  ambassadorProgram: {
    referralZnuBonus: number;         // ZNU por miembro referido
    ambassadorTier: 'bronze' | 'silver' | 'gold';
    benefits: string[];               // Visitas gratis, talleres, prioridad
  };
  
  // Video: "Transparencia honesta → confianza → fidelidad → suscripciones"
  transparency: {
    weeklyUpdate: boolean;            // Estado finca (abundancia/escasez)
    soilHealthReport: boolean;        // Métricas suelo (kWh, carbono)
    financialTransparency: boolean;   // OPEX, márgenes, reinversión
  };
}
```

---

## 🏷️ **Marca Personal + Embajadores + Storytelling Honesto**

### **RAO + Credo = Marca Personal del Nodo**
```typescript
// En src/core/lib/alrac.ts - Extender credoSet
interface NodeCredoBrand {
  credo: CredoSet;                    // αʰ = Ω·s > κ (coherencia)
  purpose: string;                    // "Regenerar suelo y comunidad"
  values: string[];                   // ["Transparencia", "Regeneración", "Soberanía"]
  
  // Storytelling Honesto (Video: "No inventar historia, reconocer lo que vive")
  transparentStorytelling: {
    weeklyLog: WeeklyLogEntry[];      // Avances + Dificultades (video: "cada dificultad")
    soilMetrics: SoilMetrics[];       // kWh, carbono, biodiversidad
    financialTransparency: FinancialReport; // OPEX, márgenes, reinversión
    noManipulation: boolean;          // No manipular emociones (video)
  };
  
  // Embajadores = Quienes visitan y se ensucian las manos
  ambassadors: Ambassador[];
}
```

---

## 📊 **Métricas Regenerativas (Video → KPIs Zeitnus)**

| Métrica Video | KPI Zeitnus | Fuente |
|---------------|-------------|--------|
| **OPEX Reduction** | `opexAvoided / totalOpex` | `taxEngine` + `land` |
| **Rentabilidad por Omisión** | `kwhAvoided / totalKwh` | `validateNetRegeneration()` |
| **Tres Horizontes Balance** | `liquidityRatio`, `stabilityRatio`, `patrimonyGrowth` | `EnterpriseStakingStack` |
| **Enterprise Staking Score** | `stackedValuePerM2` | `computeStackMetrics()` |
| **Embajadores** | `ambassadorConversionRate` | `regenerativeTourism` + `csaSubscription` |
| **Rentabilidad por Hectárea** | `netBenefitPerHectare` | `land.computeLandTQYield()` |
| **Agua Infiltrada** | `waterInfiltratedKwhSaved` | `land.productiveCapacity.water_kWh_year` |
| **Carbono Secuestrado** | `carbonSequesteredTq` | `agroforestry.carbonSequestration` |

---

## 🚀 **Próximos Pasos Inmediatos (Auto-ejecutables)**

```
☐ 1. Agregar EnterpriseStakingStack a src/core/lib/tq.ts
☐ 2. Agregar RegenerativeTourismDesign a nodeArchitecture spec
☐ 3. Extender caasStreams con CSASubscriptionStream
☐ 4. Agregar NodeCredoBrand a credoSet en alrac.ts
☐ 5. Crear métricas regenerativas en computeStackMetrics()
☐ 5. Actualizar computeAutonomyMetrics() con métricas video
☐ 6. Registrar en RAOLog: enterprise_staking_stack_created
☐ 7. Ejecutar 1er ciclo 4 agentes con hipótesis: "Enterprise Staking reduce OPEX 40% en 12 meses"
```

---

## 🔗 **Archivos a Modificar**

| Archivo | Cambio |
|---------|--------|
| `src/core/lib/tq.ts` | + `EnterpriseStakingStack`, `RegenerativeTourismDesign`, `CSASubscriptionStream` |
| `openspec/specs/alrac-tq-nodeArchitecture.md` | + Sección Turismo Regenerativo + Enterprise Staking |
| `openspec/specs/alrac-tq-governance.md` | + Matriz Decisión + CSA + Embajadores |
| `src/core/lib/alrac.ts` | + `NodeCredoBrand`, `transparentStorytelling` en `credoSet` |
| `docs/ALRAC_MASTER_INTEGRADO.md` | + Sección Enterprise Staking + Turismo Regenerativo |

---

*Integración completa Video Samay → Zeitnus/ALRAC. Listo para implementación.*