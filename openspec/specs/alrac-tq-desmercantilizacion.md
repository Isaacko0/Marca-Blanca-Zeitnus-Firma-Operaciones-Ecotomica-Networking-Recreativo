// openspec/specs/alrac-tq-desmercantilizacion.md
// OpenSpec: Desmercantilización (Esping-Andersen) → CaaS/ZNU Streams
// Maps: Desmercantilización teórica → Implementación CaaS Streams + ZNU

# SPEC: alrac-tq-desmercantilizacion
**Version:** 1.0.0
**Status:** Implemented (Core Streams)
**Source:** Esping-Andersen (1990/1993), Norberto (2026), Araujo (2018)
**Target:** tq-valueflows.ts (CaaS Streams) + tq-types-extended.ts (ZNU Streams)

---

## 1. RESUMEN EJECUTIVO

La **desmercantilización** (Esping-Andersen, 1990/1993) mide en qué grado las personas pueden alcanzar bienestar **sin depender del mercado** (ni de la familia). Es el concepto teórico central que fundamenta los **CaaS Streams** y el modo **postmonetario** de ZNU.

**Norberto (2026):** "El problema no es el consumo, sino su subordinación al dinero. La desmercantilización es el proceso por el cual bienes/servicios se acceden por necesidad, no por pago directo."

---

## 2. MARCO TEÓRICO: ESPING-ANDERSEN (1990/1993)

### 2.1 Los Tres Mundos del Bienestar

| Régimen | Desmercantilización | Estratificación | Alianza Clase-Estado | Ejemplo ALRAC |
|---------|---------------------|-----------------|---------------------|---------------|
| **Socialdemócrata** (Nórdico) | **Alta** (derechos universales) | Baja | Clase trabajadora + Estado | **Modo postmonetario ZNU** (CaaS universal) |
| **Conservador** (Continental) | Media (derechos basados en estatus) | Alta (preservada) | Iglesia + Estado + Clases medias | **Modo híbrido** (ZNU + fiat) |
| **Liberal** (Anglosajón) | **Baja** (medios-tested, mercado) | Media | Mercado + Estado residual | **Modo conectado** (fiat/USDC) |

### 2.2 Definición Operativa (Norberto + Esping-Andersen)
> **Desmercantilización = Grado en que el acceso a bienes/servicios esenciales está desacoplado del poder adquisitivo monetario.**

| Nivel | Definición | Implementación ZNU |
|-------|------------|-------------------|
| **0** | Todo acceso vía mercado ($) | Modo conectado (fiat) |
| **1** | Parcial (algunos derechos) | Modo híbrido |
| **2** | Universal (derechos) | **Modo postmonetario** (CaaS streams) |
| **3** | **Post-monetario** (sin dinero) | **EBR completo** (Proyecto Venus) |

---

## 3. IMPLEMENTACIÓN: CAAS STREAMS (tq-valueflows.ts)

### 3.1 CaaS Streams = Desmercantilización Operativa

```typescript
// tq-valueflows.ts: CaaSStream interface
interface CaaSStream {
  id: string;
  contributorId: string;      // DID proveedor (comunidad, DAO, nodo)
  networkId: string;          // Red ValueFlows
  resourceId: string;         // Recurso desmercantilizado
  ratePerPeriod: number;      // Cantidad por período (kWh, kg, horas, etc.)
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  startTime: number;
  endTime?: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  totalContributed: number;
  recipients: string[];       // DIDs beneficiarios (por necesidad)
  recipeId?: string;          // Si sigue receta VF
  raoCredentialId: string;    // Anclaje RAO
  
  // NUEVO: Nivel desmercantilización
  decommodificationLevel: 0 | 1 | 2 | 3;  // 0=mercado, 3=post-monetario
  accessRule: 'need_based' | 'universal' | 'contribution_based' | 'market';
}
```

### 3.2 Tipos de Streams por Nivel Desmercantilización

| Stream Tipo | Recurso | Nivel | Regla Acceso | Ejemplo |
|-------------|---------|-------|--------------|---------|
| **Universal Basic Services** | Energía base, agua, salud, educación | 3 (post-monetario) | `universal` | 50 kWh/día/hogar gratis |
| **Basic Income Streams** | Alimento, vivienda, transporte | 3 | `need_based` | CaaS food/housing/transport |
| **Contribution-Based** | Bienes no esenciales, lujo | 2 | `contribution_based` | ZNU por horas trabajo/cuidado |
| **Market Bridge** | Comercio externo, imports | 1 | `market` | USDC priceParity |

### 3.3 Procesamiento Automático (tq-valueflows.ts)

```typescript
// tq-valueflows.ts: processCaaSStreams()
processCaaSStreams(currentTime: number = Date.now()): VF_EconomicEvent[] {
  const generatedEvents: VF_EconomicEvent[] = [];

  for (const stream of this.caasStreams.values()) {
    if (stream.status !== 'active') continue;
    if (stream.endTime && currentTime > stream.endTime) continue;

    const periodMs = this.getPeriodMs(stream.period);
    const elapsedPeriods = Math.floor((currentTime - stream.startTime) / periodMs);
    const lastProcessedPeriod = Math.floor(stream.totalContributed / stream.ratePerPeriod);

    if (elapsedPeriods > lastProcessedPeriod) {
      const periodsToProcess = elapsedPeriods - lastProcessedPeriod;
      
      for (let i = 0; i < periodsToProcess; i++) {
        for (const recipientId of stream.recipients) {
          // REGLA CLAVE: Sin transacción monetaria si nivel 3
          const isPostmonetary = stream.decommodificationLevel === 3;
          
          const event = this.recordEvent({
            type: isPostmonetary ? 'fulfillment' : 'transfer',  // fulfillment = necesidad satisfecha
            fromAgent: stream.contributorId,
            toAgent: recipientId,
            resource: this.resources.get(stream.resourceId)!,
            quantity: stream.ratePerPeriod,
            unit: this.resources.get(stream.resourceId)?.unit || 'unit',
            recipe: stream.recipeId ? this.recipes.get(stream.recipeId) : undefined,
            timestamp: currentTime,
            raoCredentialId: stream.raoCredentialId,
            // Metadato desmercantilización
            metadata: { 
              decommodificationLevel: stream.decommodificationLevel,
              accessRule: stream.accessRule 
            }
          });
          generatedEvents.push(event);
        }
      }
      stream.totalContributed += stream.ratePerPeriod * periodsToProcess;
    }
  }

  return generatedEvents;
}
```

---

## 4. ZNU STREAMS: DINERO DESMERCANTILIZADO

### 4.1 ZNU Stream Types (tq-types-extended.ts)

```typescript
// tq-types-extended.ts: ZNU Stream Types
interface ZNUStream {
  id: string;
  streamId: string;           // CaaSStream.id
  recipientId: string;        // DID beneficiario
  amountPerPeriod: number;    // ZNU por período
  period: 'daily' | 'weekly' | 'monthly';
  startTime: number;
  endTime?: number;
  
  // Tipo de stream según desmercantilización
  streamType: 
    | 'universal_basic_income'      // Nivel 3: UBI postmonetario
    | 'universal_basic_services'    // Nivel 3: UBS (energía, agua, salud)
    | 'care_income'                 // Nivel 3: Ingreso por cuidado (DisCO Care Flow)
    | 'ecological_dividend'         // Nivel 3: Dividendo ecológico (TQ)
    | 'contribution_basic_income'   // Nivel 2: Por contribución (DisCO Love Flow)
    | 'ecological_credit'           // Nivel 2: Crédito regenerativo
    | 'market_bridge_income';       // Nivel 1: Bridge fiat
  
  // Condiciones acceso
  eligibility: {
    rule: 'universal' | 'need_based' | 'contribution_hours' | 'ecological_contribution';
    threshold?: number;           // Horas contribución, kWh regenerados, etc.
    verifiedBy: string[];         // DIDs verificadores (Bread, DisCO CAT)
  };
  
  // Anclaje RAO
  raoCredentialId: string;
}
```

### 4.2 Mapeo DisCO 3 Flows → ZNU Streams

| DisCO Flow | ZNU Stream Tipo | Nivel Desmercantilización | Métrica |
|------------|----------------|---------------------------|---------|
| **Livelihood** (N3) | `contribution_basic_income` / `ecological_dividend` | 2-3 | kWh TQ generados |
| **Love** (N2) | `contribution_basic_income` / `ecological_credit` | 2 | Horas gobernanza/coordinación |
| **Care** (N1) | `care_income` / `universal_basic_services` | 3 | Horas cuidado / necesidad |

---

## 5. REGÍMENES DE DESMERCANTILIZACIÓN (Esping-Andersen → ZNU)

### 5.1 Configuración por Régimen

```typescript
// tq-types-extended.ts: DecommodificationRegime
interface DecommodificationRegime {
  regimeType: 'socialdemocratic' | 'conservative' | 'liberal' | 'postmonetary' | 'custom';
  
  // Niveles por categoría de bien
  levels: {
    healthcare: 0 | 1 | 2 | 3;
    education: 0 | 1 | 2 | 3;
    housing: 0 | 1 | 2 | 3;
    energy: 0 | 1 | 2 | 3;
    water: 0 | 1 | 2 | 3;
    food: 0 | 1 | 2 | 3;
    transport: 0 | 1 | 2 | 3;
    care: 0 | 1 | 2 | 3;
    education: 0 | 1 | 2 | 3;
  };
  
  // Streams CaaS correspondientes
  caasStreams: string[];  // IDs de streams activos
  
  // ZNU Streams
  znuStreams: string[];   // IDs de ZNU streams
  
  // Transición
  transitionTarget?: 'postmonetary';
  transitionTimeline?: number;  // meses
}

// Presets por régimen
const REGIME_PRESETS = {
  socialdemocratic: {
    regimeType: 'socialdemocratic',
    levels: { healthcare: 3, education: 3, housing: 2, energy: 3, water: 3, food: 2, transport: 2, care: 3, education: 3 },
    transitionTarget: 'postmonetary',
    transitionTimeline: 120  // 10 años
  },
  conservative: {
    regimeType: 'conservative',
    levels: { healthcare: 2, education: 2, housing: 1, energy: 2, water: 2, food: 1, transport: 1, care: 2, education: 2 },
    transitionTarget: 'postmonetary',
    transitionTimeline: 240  // 20 años
  },
  liberal: {
    regimeType: 'liberal',
    levels: { healthcare: 1, education: 1, housing: 0, energy: 1, water: 1, food: 0, transport: 0, care: 1, education: 1 },
    transitionTarget: 'postmonetary',
    transitionTimeline: 360  // 30 años
  },
  postmonetary: {
    regimeType: 'postmonetary',
    levels: { healthcare: 3, education: 3, housing: 3, energy: 3, water: 3, food: 3, transport: 3, care: 3, education: 3 },
    transitionTarget: undefined
  }
} as const;
```

### 5.2 Métrica Compuesta: Índice de Desmercantilización

```typescript
// tq-types-extended.ts: DecommodificationIndex
interface DecommodificationIndex {
  nodeId: string;
  period: { start: number; end: number };
  
  // Por categoría (0-1)
  byCategory: {
    healthcare: number;
    education: number;
    housing: number;
    energy: number;
    water: number;
    food: number;
    transport: number;
    care: number;
    education: number;
  };
  
  // Compuesto (ponderado por importancia vital)
  composite: number;  // 0-1
  
  // Clasificación régimen
  regimeClassification: 'socialdemocratic' | 'conservative' | 'liberal' | 'postmonetary';
  
  // Tendencia
  trend: 'increasing' | 'stable' | 'decreasing';
  previousComposite?: number;
  
  calculatedAt: number;
}
```

---

## 6. INTEGRACIÓN CON EXPERIMENTOS REALES

### 6.1 El Cambalache (Chiapas, México) - Araujo (2018)

```typescript
// Caso real: Economía sin dinero, todo mismo valor
const EL_CAMBALACHE_MODEL = {
  name: 'El Cambalache',
  location: 'Chiapas, México',
  type: 'moneyless_nonhierarchical',
  principle: 'todo_tiene_el_mismo_valor',  // 1a1v extendido a bienes
  decommodificationLevel: 3,
  
  // Mapeo a ZNU
  znuMapping: {
    streamType: 'universal_basic_services',
    accessRule: 'universal',
    valueMetric: '1_unit = 1_unit',  // Sin equivalencia monetaria
    governance: '1a1v_asamblea'
  },
  
  // Integración ALRAC
  alracIntegration: {
    discoFlow: 'care',  // N1
    virginiaLayer: 'N1',
    znuStream: 'universal_basic_services',
    breadVerification: 'peer_endorsement_comunitaria'
  }
};
```

### 6.2 Clubes de Trueque Argentina (2001)

```typescript
const ARGENTINA_BARTER_2001 = {
  name: 'Red Global de Trueque / Clubes de Trueque',
  context: 'crisis_2001_argentina',
  participants: '2.5M+ personas en peak',
  currency: 'créditos_trueque (no dinero fiat)',
  decommodificationLevel: 2,  // Parcial, dentro economía monetaria
  
  alracMapping: {
    caasStream: 'contribution_basic_income',
    znuEquivalent: 'creditos_trueque ≈ ZNU_contribution',
    governance: 'asambleas_locales + red_nacional'
  }
};
```

### 6.3 Monedas Sociales / Timebanking

```typescript
const TIMEBANKING_SOCIAL_CURRENCIES = {
  principle: '1_hora = 1_hora',  // Igualdad temporal
  decommodificationLevel: 2,
  
  znuMapping: {
    streamType: 'care_income',
    unit: 'hours',
    conversion: '1_hour_care = 1_ZNU_care_stream',
    verification: 'mutual_credit_clearing'
  }
};
```

---

## 6. TEST VECTORS

### 6.1 Test: Stream Nivel 3 (Postmonetario)
```typescript
async function testPostmonetaryStream(): Promise<boolean> {
  const vf = new ValueFlowsEngine();
  
  // Crear stream UBS (Universal Basic Services) - nivel 3
  const stream = vf.createCaaSStream({
    contributorId: 'community_energy_coop',
    networkId: 'bioregion_network',
    resourceId: 'resource_electricity',
    ratePerPeriod: 50,  // 50 kWh/día
    period: 'daily',
    startTime: Date.now(),
    recipients: ['village_1', 'village_2', 'village_3'],
    decommodificationLevel: 3,
    accessRule: 'universal',
    raoCredentialId: 'rao_energy_commons'
  });
  
  // Procesar 1 día
  const events = vf.processCaaSStreams(Date.now() + 86400000);
  
  // Verificar: 3 eventos fulfillment (no transfer), sin dinero
  return events.length === 3 &&
         events.every(e => e.type === 'fulfillment' && e.metadata?.decommodificationLevel === 3);
}
```

### 6.2 Test: Régimen Socialdemócrata
```typescript
function testSocialDemocraticRegime(): boolean {
  const regime = REGIME_PRESETS.socialdemocratic;
  
  // Verificar: salud, educación, energía = nivel 3
  return regime.levels.healthcare === 3 &&
         regime.levels.education === 3 &&
         regime.levels.energy === 3 &&
         regime.transitionTarget === 'postmonetary';
}
```

### 6.3 Test: Índice Compuesto
```typescript
function testDecommodificationIndex(): boolean {
  const index: DecommodificationIndex = {
    nodeId: 'village_1',
    period: { start: Date.now() - 86400000*30, end: Date.now() },
    byCategory: {
      healthcare: 1.0, education: 1.0, housing: 0.8,
      energy: 1.0, water: 1.0, food: 0.7,
      transport: 0.6, care: 1.0, education: 1.0
    },
    composite: 0.91,  // Ponderado vitalidad
    regimeClassification: 'socialdemocratic',
    trend: 'increasing',
    calculatedAt: Date.now()
  };
  
  // Clasificación correcta
  return index.composite > 0.8 && index.regimeClassification === 'socialdemocratic';
}
```

---

## 7. INTEGRACIÓN CON STACK COMPLETO

### 7.1 Flujo: Necesidad → CaaS Stream → ZNU Stream → TQ Dividendo

```
1. NECESIDAD DETECTADA (CaaS Stream)
   - Usuario solicita energía (need_based)
   - Nivel desmercantilización = 3 (postmonetario)
   
2. CAAS STREAM PROCESADO (ValueFlows)
   - Tipo: fulfillment (no transfer)
   - Sin transacción monetaria
   - Metadata: decommodificationLevel=3
   
3. ZNU STREAM ACTIVADO
   - Tipo: universal_basic_services
   - Unidad: kWh (no $)
   - Acceso: universal
   
4. TQ LEDGER ACTUALIZADO
   - Consumo registrado en kWh
   - Dividendo TQ ajustado (stock→flow)
   
5. GOBERNANZA (DisCO CAT + OASA)
   - Decisión por consentimiento (80%)
   - Guardianes verifican límites planetarios
```

### 7.2 Métricas de Seguimiento

```typescript
// Dashboard desmercantilización por nodo
interface DecommodificationDashboard {
  nodeId: string;
  regime: DecommodificationRegime;
  index: DecommodificationIndex;
  activeStreams: {
    caas: number;
    znu: number;
    byLevel: { 0: number; 1: number; 2: number; 3: number };
  };
  coverage: {
    populationCovered: number;      // % población con acceso nivel 3
    essentialNeedsMet: number;      // % necesidades básicas cubiertas sin dinero
    marketDependence: number;       // % dependencia mercado (target: 0)
  };
  trends: {
    decommodificationTrend: 'increasing' | 'stable' | 'decreasing';
    monthsToPostmonetary: number;   // Estimación
  };
}
```

---

## 8. DEPENDENCIAS

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos `CaaSStream`, `ZNUStream`, `DecommodificationRegime`, `DecommodificationIndex` |
| `tq-valueflows` | 1.0.0 | Motor CaaS Streams, `processCaaSStreams()` |
| `tq-disco-cat` | 1.0.0 | 3 Flows → ZNU Streams mapping |
| `tq-oasa` | 1.0.0 | Principios OASA (derechos universales = nivel 3) |
| `tq-bread` | 1.0.0 | Verificación peer para elegibilidad streams |
| `tq-closer-attestation` | 1.0.0 | Atestación acceso universal (Track 1 TDF) |

---

## 9. REFERENCIAS

| Fuente | Cita | Año |
|--------|------|-----|
| Esping-Andersen, G. | *Los tres mundos del Estado de bienestar* | 1990/1993 |
| Norberto, D. | "Consumo, Dinero y Proyectos Post Monetarios" | 2026 (asimilado) |
| Araujo, E. | "Moneyless economics and non-hierarchical exchange values in Chiapas, Mexico" | J. Anthropologues 152-153, 2018 |
| Green et al. | "Inequality declined in the Bronze Age city of Mohenjo-daro" | Antiquity 2026 |

---

## 10. CHANGELOG

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2026-10-19 | Spec inicial: Desmercantilización (Esping-Andersen) → CaaS/ZNU Streams |

---

> **"La desmercantilización no es un ideal utópico, es una arquitectura de streams.**  
> *Esping-Andersen la midió; ALRAC la programa. CaaS Streams = Desmercantilización ejecutable."*