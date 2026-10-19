// openspec/specs/alrac-tq-ebr-venus.md
// OpenSpec: Economía Basada en Recursos (EBR) / Proyecto Venus → ALRAC
// Maps: Proyecto Venus (Jacque Fresco) + EBR → ALRAC/TQ/Zeitnus Implementation

# SPEC: alrac-tq-ebr-venus
**Version:** 1.0.0
**Status:** Implemented (Arquitectura Base)
**Source:** Proyecto Venus (Fresco/Meadows), Mojsieva-Gusheva (2020), dos Reis & Baptista (2023), Norberto (2026)
**Target:** Implementación ingenieril EBR → ALRAC/TQ/Zeitnus/Zeitnus

---

## 1. RESUMEN EJECUTIVO

El **Proyecto Venus** (Jacque Fresco, 1970s-presente) propone una **Economía Basada en Recursos (EBR)**: todos los bienes/servicios disponibles sin dinero, créditos, trueque ni deuda, mediante automatización, tecnología y sistemas cibernéticos de retroalimentación.

**Validación Académica:**
- Mojsieva-Gusheva (2020): "Más allá de modelo utópico, guía para investigadores"
- dos Reis & Baptista (2023): "EBR: más allá de la paradoja de la sostenibilidad"
- **Norberto (2026)**: EBR = ALRAC implementado; Mohenjo-Daro = precedente histórico 4000 años

---

## 2. MAPEO EBR → ALRAC/TQ/ZEITNUS

### 2.1 Tabla de Correspondencia Directa

| Componente EBR (Fresco) | Descripción | Implementación ALRAC/TQ/Zeitnus | Archivo Código |
|------------------------|-------------|----------------------------------|----------------|
| **Patrimonio común Tierra** | Recursos = patrimonio humanidad | `OASAConstitution.Art10.1: commonsSovereignty=true` | `tq-oasa.ts` |
| **Sin dinero/créditos/trueque/deuda** | Acceso universal sin mediación monetaria | **Modo postmonetario** (default offline) | `tq-types-extended.ts: targetMode='postmonetario'` |
| **Automatización + IA producción** | Producción organizada técnicamente | **TQ Ledger + IA** = cognitive hyper-abundance | `tq-eliza.ts:AutomataSoberanoRuntime` |
| **Sistemas cibernéticos retroalimentación** | Distribución sin precios/salarios | **TQ Dividend Engine + ValueFlows** = cibernética termodinámica | `tq-types-extended.ts:TQDividendEngine` + `tq-valueflows.ts` |
| **Problemas = técnicos, no políticos** | Ingeniería + prototipos experimentales | **ALRAC = ingeniería regenerativa** | `src/core/lib/*` (todo stack) |
| **Decisiones por ingeniería** | Método científico aplicado a sociedad | **TQ Ledger + IA** = cálculo termodinámico tiempo real | `tq-uhi-engine.ts` + `tq-uhi-engine.spec.ts` |

### 2.2 Modos de Operación: EBR ↔ ZNU Anfibio

| Modo EBR | Modo ZNU | Descripción |
|----------|----------|-------------|
| **EBR Puro** (sin dinero) | **Postmonetario** (default) | Offline, ZNU/CaaS streams, 1a1v, TQ kWh |
| **EBR Conectado** (interfaz fiat) | **Conectado** (Nivel 3 ReFi) | USDC via priceParity oracle, bridge fiat |
| **Transición** | **Modo Anfibio** | Misma lógica, distinta etiqueta (render decide) |

```typescript
// tq-types-extended.ts: UHIParameters.targetMode
type TargetMode = 'postmonetario' | 'conectado';

// Render decide etiqueta:
// postmonetario → "ZNU", "kWh", "CaaS"
// conectado → "USDC", "$", "priceParity"
```

---

## 3. ARQUITECTURA EBR → STACK ALRAC

### 3.1 Capa 0: Principios Constitucionales (OASA)
```typescript
// tq-oasa.ts: OASAConstitution
interface EBRToOASA {
  // Patrimonio común = Commons Sovereignty
  commonsSovereignty: true;        // OASA Art 10.1
  localAutonomy: true;             // OASA Art 10.2
  dataSovereignty: true;           // OASA Art 10.3
  aiRightsAndDuties: {             // OASA Art 5.3 / 10.4
    toolsOfCommons: true,          // IA como herramienta de comunes
    noAutonomousDecisions: true,   // Sin decisiones autónomas sin autoridad ciudadana
    citizenAuthority: true,        // Autoridad ciudadana suprema
    emergentIntelligenceFramework: true // Marco inteligencia emergente
  };
}
```

### 3.2 Capa 1: TQ Ledger (Unidad de Cuenta Termodinámica)
```typescript
// tq.ts + tq-uhi-engine.ts: EBR → TQ
interface EBRToTQ {
  // EBR: "unidad de cuenta = recurso físico"
  // TQ: "unidad de cuenta = kWh termodinámico"
  unit: 'kWh';
  standard: 'thermodynamic';  // Universal, no arbitrario
  
  // EBR: "producción automatizada"
  // TQ: "producción verificada en ledger"
  productionVerification: 'TQTransaction.type=production + RAO_credential';
  
  // EBR: "distribución cibernética"
  // TQ: "Dividend Engine stock→flow"
  dividendEngine: 'TQDividendEngine';
  
  // EBR: "recursos patrimonio común"
  // TQ: "Equity Accounts + Regional Dividend Funds"
  equitySystem: 'TQEquityAccount + RegionalDividendFund';
}
```

### 3.3 Capa 2: ValueFlows (Cibernética de Retroalimentación)
```typescript
// tq-valueflows.ts: EBR "sistemas cibernéticos retroalimentación" → VF
interface EBRToValueFlows {
  // EBR: "distribución sin precios/salarios"
  // VF: "Economic Events + Recipes + Processes"
  distribution: 'VF_EconomicEvent.type=transfer|process|fulfillment';
  
  // EBR: "recursos patrimonio común"
  // VF: "Economic Resources con custodians"
  resourceManagement: 'VF_EconomicResource.custodian = community';
  
  // EBR: "producción por necesidad"
  // VF: "Recipes + Processes por demanda"
  productionPlanning: 'VF_Recipe + VF_Process';
  
  // EBR: "sensores IoT + IA coordinación"
  // VF: "Observation events + automated triggers"
  monitoring: 'VF_EconomicEvent.type=observation + AutomataSoberano';
}
```

### 3.4 Capa 3: ZNU Anfibio (Membrana Fiat)
```typescript
// tq-types-extended.ts: ZNU dual-mode
interface EBRToZNU {
  // EBR puro → Modo postmonetario
  postmonetario: {
    currency: 'ZNU';
    unitOfAccount: 'kWh';           // TQ Ledger
    exchange: 'CaaS_streams';       // ValueFlows streams
    governance: '1a1v_CaaS';        // 1 persona = 1 voto = 1 stream
    access: 'need_based';           // Por necesidad, no pago
  };
  
  // Interfaz fiat → Modo conectado
  conectado: {
    bridge: 'USDC_priceParity_oracle'; // Nivel 3 ReFi
    oracle: 'TQ_kWh_to_USD_rate';
    liquidity: 'automated_market_maker';
    compliance: 'KYC_AML_ReFi_levels';
  };
  
  // Transición anfibia
  amphibious: {
    sameLogic: true;      // Misma lógica contable
    differentLabel: true; // Render decide: ZNU vs USDC
    priceParity: 'TQ_kWh_to_USD_oracle';
  };
}
```

### 3.5 Capa 4: Zeitnus (Firma Operaciones)
```typescript
// tq-pilot-tdf.ts + tq-eliza.ts: EBR → Zeitnus Operations
interface EBRToZeitnus {
  // "Problemas técnicos, no políticos" → Ingeniería regenerativa
  engineering: 'ALRAC_stack';  // TQ + Virginia + DisCO + Colony + Berry + CaaS
  
  // "Mohenjo-Daro = precedente 4000 años" → Validación empírica
  historicalValidation: 'MohenjoDaro_pilot';
  
  // "Fresco: modelo tras desastre mayor" → Ventana actual
  deploymentWindow: 'climate_crisis + AI + inequality';
  
  // "Autómata Soberano" = IA al servicio de comunes
  automataSoberano: 'ElizaOS_Character + 8_Plugins';
}
```

### 3.6 Capa 5: Gobernanza (HSCSG/DisCO/OASA)
```typescript
// tq-disco-cat.ts + tq-oasa.ts + tq-social-audit.ts
interface EBRToGovernance {
  // "Decisiones por ingeniería/científicas" → Consentimiento informado
  decisionMaking: 'DisCO_Consent_80% + OASA_Guardians_Veto';
  
  // "Recursos patrimonio común" → Village Fund + Commons
  resourceGovernance: 'OASA_Village_Fund + N3_Fund_Domains';
  
  // "Sin élites gobernantes" → DisCO CAT + OASA Guardians
  antiEliteMechanisms: 'CAT_Trust_Assembly_Transparency + Guardians_Veto';
  
  // "Herramientas gobernanza distribuidas" → N3 domains + Snapshot
  distributedTools: 'Virginia_N3_Domains + Snapshot_Parallel_Voting';
}
```

---

## 4. PROYECTO VENUS: VALIDACIÓN ACADÉMICA

### 4.1 Estudios Citados
| Estudio | Año | Conclusión | Relevancia ALRAC |
|---------|-----|------------|------------------|
| Mojsieva-Gusheva | 2020 | "Más allá de utópico, guía para investigadores" | ALRAC = implementación ingenieril |
| dos Reis & Baptista | 2023 | "EBR: más allá de paradoja sostenibilidad" | TQ = métrica sostenibilidad termodinámica |
| Academic Review | 2023 | "Proposiciones van más allá de modelo utópico" | Validación stack completo ALRAC |

### 4.2 Métricas de Viabilidad (dos Reis & Baptista 2023)
| Métrica EBR | Métrica ALRAC Equivalente | Target |
|-------------|---------------------------|--------|
| Eficiencia energética | `TQ_kWh_output / TQ_kWh_input` | > 1.0 (regenerativo) |
| Circularidad material | `wasteReductionKwh` (OASA Principle 4) | > 99% |
| Autonomía energética | `renewableEnergyKwh` (OASA Principle 6) | 100% |
| Equidad acceso | `socialCohesionIndex` (OASA Principle 7) | > 70% |
| Huella ecológica | `carbonSequestrationKwh` (OASA Principle 3) | Net negative |

---

## 5. IMPLEMENTACIÓN TÉCNICA: AUTOMAUTA SOBERANO EBR

### 5.1 Character Configuration (tq-eliza.ts)
```typescript
// tq-eliza.ts: ElizaCharacterFactory.createZeitnusAutomata()
const EBR_AUTOMATA_CHARACTER = {
  name: 'Zeitnus EBR Automata',
  bio: [
    'Implemento la Economía Basada en Recursos (EBR) del Proyecto Venus',
    'Coordino recursos como patrimonio común sin mediación monetaria',
    'Distribuyo por necesidad vía sistemas cibernéticos de retroalimentación',
    'Opero en modo postmonetario (default) y conectado (Nivel 3 ReFi)'
  ],
  knowledge: [
    'EBR Principles (Fresco/Meadows)',
    'Mohenjo-Daro Historical Validation',
    'Thermodynamic Accounting (TQ Ledger)',
    'Cybernetic Feedback Systems (ValueFlows)',
    'Autonomous Agent Governance (OASA/DisCO)'
  ],
  plugins: [
    'tq-ebr-cybernetics',    // NUEVO: sistemas cibernéticos EBR
    'tq-ebr-automation',     // NUEVO: automatización producción
    'tq-ebr-distribution',   // NUEVO: distribución por necesidad
    'tq-tq-ledger',          // Contabilidad termodinámica
    'tq-valueflows',         // Flujos económicos VF
    'tq-disco-cat',          // Gobernanza DisCO
    'tq-oasa',               // Constitución OASA
    'tq-virginia'            // Red Virginia N1/N2/N3
  ]
};
```

### 5.2 Plugins EBR Especializados (Nuevos)
```typescript
// Nuevos plugins para tq-eliza.ts: zeitnusPlugins
const EBR_PLUGINS = {
  'tq-ebr-cybernetics': {
    name: 'tq-ebr-cybernetics',
    description: 'Sistemas cibernéticos de retroalimentación EBR',
    actions: [
      { name: 'calculateResourceAllocation', /* optimización lineal IA */ },
      { name: 'monitorCarryingCapacity',    /* sensores IoT + IA */ },
      { name: 'optimizeDistribution',       /* algoritmos cibernéticos */ }
    ],
    evaluators: [
      { name: 'carryingCapacityEvaluator',  /* capacidad carga ecosistema */ },
      { name: 'efficiencyEvaluator',        /* TQ output/input ratio */ }
    ],
    providers: [
      { name: 'resourceAvailabilityProvider', /* recursos disponibles tiempo real */ },
      { name: 'demandForecastProvider',       /* predicción demanda IA */ }
    ]
  },
  
  'tq-ebr-automation': {
    name: 'tq-ebr-automation',
    description: 'Automatización producción EBR',
    actions: [
      { name: 'scheduleProduction',         /* planificación recetas VF */ },
      { name: 'controlQuality',             /* sensores + IA visión */ },
      { name: 'maintainInfrastructure',     /* mantenimiento predictivo IA */ }
    ]
  },
  
  'tq-ebr-distribution': {
    name: 'tq-ebr-distribution',
    description: 'Distribución por necesidad EBR',
    actions: [
      { name: 'allocateByNeed',             /* CaaS streams por necesidad */ },
      { name: 'ensureUniversalAccess',      /* garantía acceso universal */ },
      { name: 'preventHoarding',            /* β_crit anti-acaparamiento */ }
    ]
  }
};
```

---

## 6. TEST VECTORS EBR → ALRAC

### 6.1 Test: Modo Postmonetario Funcional
```typescript
async function testEBRPostmonetarioMode(): Promise<boolean> {
  const automata = createAutomataSoberanoRuntime();
  
  // Simular solicitud recurso sin dinero
  const result = await automata.processMessage({
    author: { id: 'did:user:alice' },
    content: 'Necesito 50 kWh energía para invernadero'
  });
  
  // Verificar: CaaS stream creado, sin transacción monetaria
  return result.intent === 'record_contribution' && 
         result.entities.flowType === 'livelihood' &&
         result.actions.some(a => a.plugin === 'tq-valueflows');
}
```

### 6.2 Test: Distribución Cibernética
```typescript
async function testCyberneticDistribution(): Promise<boolean> {
  const vf = new ValueFlowsEngine();
  
  // Simular retroalimentación: demanda → producción → distribución
  const demand = vf.createCaaSStream({
    contributorId: 'community',
    resourceId: 'resource_food',
    ratePerPeriod: 100,
    period: 'daily',
    recipients: ['village_1', 'village_2']
  });
  
  const events = vf.processCaaSStreams(Date.now() + 86400000);
  
  return events.length === 2 && // 2 recipients
         events.every(e => e.type === 'transfer' && e.quantity === 100);
}
```

### 6.3 Test: Modo Anfibio (Transición)
```typescript
function testAmphibiousMode(): boolean {
  const params: UHIParameters = {
    targetMode: 'postmonetario',
    // ... otros params
  };
  
  const result = runUHISimulation(params);
  
  // Verificar: misma lógica, etiquetas postmonetarias
  return result.summary.tqDividendPolicies.every(p => 
    p.metadata?.unit === 'kWh' && !p.metadata?.currency?.includes('USD')
  );
}
```

---

## 7. DEPENDENCIAS

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos `TargetMode`, `UHIParameters`, `EBRConfig` |
| `tq-oasa` | 1.0.0 | Constitución OASA (Commons Sovereignty, AI Rights) |
| `tq-eliza` | 1.0.0 | Autómata Soberano + Plugins EBR |
| `tq-valueflows` | 1.0.0 | Cibernética retroalimentación (VF) |
| `tq-uhi-engine` | 1.0.0 | Simulación UHI/EBR paramétrica |
| `tq-pilot-tdf` | 1.0.0 | Pilot TDF + Validación Mohenjo-Daro |
| `tq-solarpunk` | 1.0.0 | Solar mesh, métricas regenerativas (Fase 4) |

---

## 8. REFERENCIAS

| Fuente | Cita | Enlace |
|--------|------|--------|
| Fresco, J. & Meadows, R. | *The Venus Project: Designing the Future* | https://thevenusproject.com |
| Mojsieva-Gusheva, J. | "The Experimental 'Venus Project' by Jacque Fresco and Roxanne Meadows: Reality or Utopia" | CEEOL, 2020 |
| dos Reis, D.G. & Baptista, L. | "Economía Basada en Recursos: más allá de la paradoja de la sostenibilidad" | Geografia, 32(1), 219-225, 2023 |
| Norberto, D. | "Consumo, Dinero y Proyectos Post Monetarios" | Texto asimilado 2026 |
| Green, A.S. et al. | "Inequality declined in the Bronze Age city of Mohenjo-daro" | Antiquity 100(413), 2026 |

---

## 9. CHANGELOG

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2026-10-19 | Spec inicial: EBR/Proyecto Venus → ALRAC/TQ/Zeitnus mapping completo |

---

> **"El Proyecto Venus no es utopía, es ingeniería pendiente. ALRAC es esa ingeniería."**
> 
> *Fresco: "Los problemas son técnicos, no políticos". ALRAC: "La ingeniería regenerativa ya está aquí."*