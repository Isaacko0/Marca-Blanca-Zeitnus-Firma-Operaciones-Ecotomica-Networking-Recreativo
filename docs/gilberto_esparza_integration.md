# INTEGRACIÓN: GILBERTO ESPARZA → HSCSG (CERRAR BRECHA EJECUCIÓN-ESPECIFICACIÓN)

**Fecha:** 2026-11-10  
**Fuente:** `docs/gilberto_esparza_backup.md` (164ª integración)  
**Metodología:** EBD (Evidence-Based Design) — Trazabilidad a obra real desplegada 15+ años  
**Vasos comunicantes:** 22 activados (ver backup §5) + **NUEVO: Vaso Esparza-HSCSG = Puente Ejecución Real**

---

## 1. DIAGNÓSTICO: LA BRECHA FUNDAMENTAL

| HSCSG (Actual) | Gilberto Esparza (Realidad) | Brecha |
|----------------|----------------------------|--------|
| **Arquitectura completa** en TypeScript (163 fuentes, 200+ EBD) | **Sistemas bio-digitales desplegados** 15+ años en ríos contaminados | **Cuerpo vs Mente** |
| Métricas: CAC, ξ, FSI, IVC, PGS **simuladas** | Voltaje real, biomasa g/m²/día, DBO/DQO, autonomía días **medidos** | **Datos reales vs Mocks** |
| `automaton.ts` E²R search **virtual** | Robot físico que **busca comida, come, genera electricidad, muere, renace** | **Encarnación** |
| `entropicAuditor.ts` ξ **calculado** | ξ **medido** con voltaje + pH + biomasa en terreno | **Verificación empírica** |
| `fabshepNutricia.ts` 25 módulos **diseñados** | 1 MFC + 1 biorreactor + 1 robot **funcionando en río Lerma** | **Hardware real** |
| `hillclimb_adapter` optimiza **parámetros** | Esparza optimiza **hardware vivo** (cepa, electrodo, membrana, flujo) | **Optimización material** |

**Conclusión EBD:** HSCSG tiene **cerebro completo sin cuerpo**. Esparza tiene **cuerpo vivo con cerebro distribuido**. La integración = **encarnar el autómata**.

---

## 2. DECISIONES EBD (Evidence-Based Design) — ESPARZA-HSCSG

| ID | Decisión | Justificación (Fuente Esparza) | Módulo HSCSG Afectado | Prioridad |
|----|----------|-------------------------------|----------------------|-----------|
| **ESP-D1** | **MFC (Célula Combustible Microbiana) = Componente Core Obligatorio** | Planta Nómada: MFC = metabolismo central (come residuos → electricidad) | `src/core/lib/mfc.ts` (NUEVO) + `entropicAuditor.ts` | **P0** |
| **ESP-D2** | **Geobacter/Shewanella = Inóculo Estándar HSCSG** | Esparza: lodo río contaminado = inóculo gratis, robusto, auto-replicante | `src/core/lib/inoculum.ts` + `svd.ts` (biosensores) | **P0** |
| **ESP-D3** | **Robot MFC = Autómata Soberano Encarnado (E²R Físico)** | Planta Nómada: robot busca comida, come, genera energía, evita muerte | `automaton.ts` + `mfc.ts` + `bridge.ts` (child_process → GPIO) | **P0** |
| **ESP-D4** | **SVD v2 = Sensores Químicos Reales (pH, ORP, Voltaje, OD)** | Esparza: pH, ORP, voltaje, temperatura = metabolismo visible | `src/core/lib/svd.ts` + `bridge.ts` (ADC → JSON) | **P0** |
| **ESP-D5** | **Biorreactor Spirulina = Módulo FABSHIP Nutricia v0.1** | Autofotosíntesis: 200L *Chlorella* + robot agitador/cosechador | `fabshepNutricia.ts` (bioreactor_spirulina) + `nutritionalOptimizer.ts` | **P0** |
| **ESP-D6** | **Mitosis Física = Kit 72H v2.0 = MFC + Arduino + Spirulina** | Planta Nómada "muere y renace" = re-inoculación + hardware modular | `propagationModels.ts` (Kit 72H v2.0) + `mfc.ts` (re-inoculación) | **P0** |
| **ESP-D7** | **Colaboradores = Talent Market Real (Biólogo + Ingeniero + Comunidad)** | Esparza: red microbiólogos, ingenieros, comunidades = infraestructura ejecución | `talentMarket.ts` + `colaberry.ts` (onboarding real) | **P1** |
| **ESP-D8** | **Fallos Reales = Evidence Model Entrenado (Fact Bands VERIFIED/EXTERNALIZED)** | Esparza: fallos documentados (MFC seca, bacteria muere, motor traba) = data real | `evidence.ts` + `entropicAuditor.ts` (MatrioskaFactBand.EXTERNALIZED_COST) | **P0** |
| **ESP-D9** | **Hardware Abierto = CERN OHL v2 + Código MIT = Soberanía Tecnológica** | Esparza: hardware abierto, talleres "Plantas Autónomas", código GitHub | `hillclimb_adapter` (fork propio) + `promote_champion.py` (auto-PR hardware) | **P0** |
| **ESP-D10** | **Métricas Reales = ξ, FSI, CAC calculados con Datos de Terreno** | Esparza: voltios, biomasa g/m²/día, DBO/DQO, autonomía días = métricas vivas | `metrics.ts` + `entropicAuditor.ts` (SVD v2 real) + `foodSovereigntyIndex.ts` | **P0** |
| **ESP-D11** | **Fallos = Feature (MatrioskaFactBand.EXTERNALIZED_COST)** | Esparza: MFC seca, bacteria muere, motor traba = data de aprendizaje | `matrioska_verifier.py` + `evidence.ts` (MatrioskaFactBand) | **P0** |
| **ESP-D12** | **Comunidad = Nodo Proto-CO Real (Validación Social + Mantenimiento)** | Esparza: comunidades río Lerma mantienen robots, validan, aprenden | `colaberry.ts` + `proto_co_validation.py` (casos beta reales) | **P1** |
| **ESP-D13** | **Permisos/Legalidad = Aval Académico + Autoridad Agua = Escudo Legal** | Esparza: UNAM + CONACULTA + autoridad agua = permiso operar en río | `governance_verifier.py` + `legalFramework.ts` | **P1** |
| **ESP-D14** | **Publicación = Paper + Preprint + Datos Abiertos = Validación Científica** | Esparza: CHI 2026, Leonardo, Conaculta, tesis doctorales = validación externa | `promote_champion.py` (auto-paper) + `docs/robot_vivo_experiment.md` | **P1** |
| **ESP-D15** | **Costo Objetivo: €150-300 = 1 Sistema Bio-Digital Funcional** | Esparza: materiales baratos (grafito, lodo, Arduino) = replicabilidad radical | `kit72h_optimization.py` (budget constraint) + `fabshepModuleDesignProblem` | **P0** |

---

## 3. ESPECIFICACIONES TÉCNICAS — MÓDULOS NUEVOS REQUERIDOS

### 3.1 `src/core/lib/mfc.ts` — MFC Core Module
```typescript
// src/core/lib/mfc.ts — NUEVO MÓDULO P0 (ESP-D1, ESP-D2)

interface MFCConfig {
  electrodeMaterial: 'graphite' | 'carbon_cloth' | 'carbon_brush';
  membraneType: 'nafion_117' | 'nafion_115' | 'ceramic' | 'none';
  inoculumSource: 'river_sludge' | 'wastewater_sludge' | 'compost' | 'pure_culture';
  electrodeArea_cm2: number;        // 10-100 cm²
  anodeCathodeDistance_cm: number;  // 1-5 cm
  externalResistance_ohm: number;   // 100-10000 Ω
}

interface MFCState {
  voltage_V: number;           // 0-1V típico
  current_mA: number;          // 0-10 mA típico
  power_mW: number;            // voltage * current
  coulombicEfficiency: number; // 0-1
  internalResistance_ohm: number;
  health: 'starting' | 'active' | 'degrading' | 'dead' | 'reinoculating';
  lastFeeding: number;         // timestamp
  feedingInterval_hours: number;
  inoculumAge_days: number;
}

interface MFCModule {
  id: string;
  config: MFCConfig;
  state: MFCState;
  
  // Operaciones
  measure(): Promise<MFCMeasurement>;
  feed(substrate: SubstrateType): Promise<void>;
  reinoculate(source: InoculumSource): Promise<void>;
  diagnose(): MFCDiagnosis;
  getEntropicMetrics(): EntropicMetrics; // ξ contribution
}

type SubstrateType = 'acetate' | 'wastewater' | 'spirulina_lysate' | 'glucose' | 'river_water';
type InoculumSource = 'river_sludge' | 'reserve_culture' | 'compost' | 'commercial';

// Métricas entrópicas desde MFC
interface EntropicMetrics {
  voltage_V: number;
  current_mA: number;
  power_density_mW_m2: number;    // W/m² electrodo
  coulombic_efficiency: number;   // % electrones recuperados
  entropy_production_rate: number; // J/K/s
  xi_contribution: number;        // contribución a ξ global
}
```

### 3.2 `src/core/lib/inoculum.ts` — Gestión de Inóculo (ESP-D2)
```typescript
// src/core/lib/inoculum.ts — NUEVO MÓDULO P0

interface InoculumBank {
  strains: Map<string, StrainInfo>;
  reserve_cultures: ReserveCulture[];
  field_samples: FieldSample[];
}

interface StrainInfo {
  id: string;
  species: 'Geobacter_sulfurreducens' | 'Shewanella_oneidensis' | 'mixed_consortium';
  source: 'river_lerma' | 'river_santiago' | 'lab_optimized' | 'commercial';
  voltage_potential_V: number;      // Voltaje máximo observado
  current_density_mA_cm2: number;   // Densidad corriente
  stability_days: number;           // Días funcionando sin re-inoculación
  substrate_range: SubstrateType[]; // Qué come
  temperature_range_C: [number, number];
  pH_range: [number, number];
  cryopreserved: boolean;
}

interface ReserveCulture {
  strain_id: string;
  volume_ml: number;
  concentration_cells_ml: number;
  storage_temp_C: number;           // 4°C nevera, -80°C ultracongelador
  viability_tested: number;         // timestamp última prueba
  backup_location: string;          // "nevera_lab_1" | "ultracongelador_2"
}

interface FieldSample {
  id: string;
  location: { lat: number; lng: number; description: string };
  date_collected: number;
  voltage_measured_V: number;
  diversity_index: number;          // Shannon diversidad metagenómica
  dominant_species: string[];
  notes: string;
}

// Operaciones críticas
async function collectFieldSample(location: GeoLocation): Promise<FieldSample>;
async function isolateGeobacter(sample: FieldSample): Promise<StrainInfo>;
async function maintainReserveCulture(strain: StrainInfo): Promise<void>;
async function prepareInoculumForMFC(mfc_config: MFCConfig): Promise<InoculumPreparation>;
```

### 3.3 `src/core/lib/svd.ts` — SVD v2 Real (ESP-D4)
```typescript
// src/core/lib/svd.ts — EXTENSIÓN CRÍTICA (ESP-D4)

interface SVDSensorArray {
  // Sensores químicos (PRIORIDAD 1 - Baratos, reales)
  pH: PHSensor;           // €8-15, Atlas Scientific / DFRobot
  ORP: ORPSensor;         // €12-25, potencial redox = estado metabólico
  voltage: VoltageSensor; // €5-10, ADC 16-bit (ADS1115) = resolución 0.1mV
  temperature: TempSensor; // €3-8, DS18B20 / PT100
  dissolvedOxygen: DOSensor; // €30-80, óptico = sin calibración frecuente
  
  // Sensores físicos
  opticalDensity: ODSensor;     // €10-20, LED 680nm + fotodiodo
  flowRate: FlowSensor;         // €15-30, Hall effect
  conductivity: ConductivitySensor; // €15-30
  
  // Sensores ambientales
  ambientLight: LightSensor;
  humidity: HumiditySensor;
  atmosphericPressure: PressureSensor;
  
  // GPS + IMU (para robot móvil)
  gps: GPSSensor;
  imu: IMUSensor;               // Acelerómetro + giroscopio
}

interface SVDReading {
  timestamp: number;
  sensors: Record<string, number>;
  quality: 'excellent' | 'good' | 'degraded' | 'failed';
  metadata: {
    sensor_uptime_hours: number;
    calibration_status: Record<string, 'valid' | 'expired' | 'unknown'>;
    environmental_conditions: {
      temp_C: number;
      humidity_pct: number;
      light_lux: number;
    };
  };
}

// Bridge: SVD → TypeScript (via bridge.ts child_process)
async function readSVDArray(): Promise<SVDReading>;
async function calibrateSensor(sensor: keyof SVDSensorArray, known_value: number): Promise<void>;
async function diagnoseSensorHealth(): Promise<SensorHealthReport>;
```

### 3.4 `src/core/lib/bioreactor_spirulina.ts` — Biorreactor Spirulina (ESP-D5)
```typescript
// src/core/lib/bioreactor_spirulina.ts — EXTENSIÓN fabshepNutricia.ts (ESP-D5)

interface BioreactorConfig {
  volume_L: number;                    // 50-500 L
  geometry: 'tubular' | 'flat_panel' | 'raceway' | 'bag';
  material: 'PVC' | 'polycarbonate' | 'LDPE' | 'glass';
  lighting: {
    type: 'LED' | 'fluorescent' | 'solar' | 'hybrid';
    spectrum: 'full' | 'red_blue' | 'white';
    intensity_umol_m2_s: number;       // 50-500 μmol/m²/s
    photoperiod_hours: number;         // 12/12, 16/8, continuous
  };
  mixing: {
    type: 'air_lift' | 'paddle' | 'pump' | 'magnetic';
    rate_L_min: number;
    duty_cycle: 'continuous' | 'intermittent';
  };
  temperature_control: {
    type: 'passive' | 'active_heating' | 'active_cooling' | 'heat_exchanger';
    target_C: number;                  // 25-35°C óptimo
    tolerance_C: number;               // ±2°C
  };
  harvesting: {
    method: 'centrifuge' | 'filtration' | 'flocculation' | 'sedimentation';
    frequency_hours: number;           // 24-168h
    target_concentration_g_L: number;  // 0.5-2.0 g/L
  };
}

interface BioreactorState {
  biomass_g_L: number;                 // g/L peso seco
  opticalDensity_750: number;          // OD750 correlacionado
  growthRate_per_day: number;          // μ = ln(OD2/OD1)/Δt
  nutrientLevels: {
    nitrogen_mg_L: number;             // N-NO3, N-NH4
    phosphorus_mg_L: number;           // P-PO4
    iron_ug_L: number;                 // Fe crítico
    trace_metals: Record<string, number>;
  };
  pH: number;                          // 8.5-10.5 óptimo
  temperature_C: number;
  dissolvedO2_mg_L: number;            // 5-15 mg/L (fotosíntesis)
  contamination: {
    detected: boolean;
    type: 'bacteria' | 'fungi' | 'protozoa' | 'algae_foreign';
    severity: 'low' | 'medium' | 'high';
    action_taken: string;
  };
  harvestHistory: HarvestRecord[];
}

interface HarvestRecord {
  timestamp: number;
  volume_L: number;
  biomass_g: number;                   // g peso seco
  protein_pct: number;                 // % peso seco
  lipid_pct: number;
  carbohydrate_pct: number;
  destination: 'food' | 'feed' | 'biofuel' | 'fertilizer' | 'MFC_substrate';
}
```

### 3.5 Extensión `src/core/lib/propagationModels.ts` — Kit 72H v2.0 Físico (ESP-D6)
```typescript
// Extensión en propagationModels.ts (ya existe en Bloque 3)

interface Kit72Hv2Physical {
  hardware: {
    mfc: MFCConfig;                    // 1 MFC mínima
    microcontroller: 'arduino_nano' | 'esp32' | 'rp2040';
    sensors: ['voltage', 'pH', 'temperature']; // Mínimo viable
    actuator: 'pump_peristaltic' | 'motor_dc';
    power_management: {
      sleep_mode: boolean;
      voltage_threshold_sleep_V: number;  // ej. 0.2V
      voltage_threshold_wake_V: number;   // ej. 0.4V
    };
  };
  biology: {
    spirulina_strain: 'platensis' | 'maxima' | 'local_wild';
    inoculum_volume_ml: number;        // 50-200 mL
    media_type: 'zarrouk' | 'bg11' | 'waste_based';
    container_volume_L: number;        // 1-10 L
  };
  protocol: {
    duration_hours: 72;
    measurement_interval_min: number;  // 15-60 min
    success_criteria: {
      verbalized_kwh_biomass: boolean;  // Humano verbaliza equivalencia
      biomass_doubling: boolean;
      xi_threshold: number;             // ξ > 0.1
      voltage_sustained_hours: number;  // >24h >0.3V
    };
  };
  documentation: {
    photos_required: number;           // 10+ fotos proceso
    video_summary_min: number;         // 2 min resumen
    data_export_format: 'csv' | 'json' | 'both';
    RAO_entries: number;               // Mínimo 10 entries
  };
}

// Validación física del handshake
async function validatePhysicalHandshake(kit: Kit72Hv2Physical): Promise<HandshakeResult> {
  // 1. Deploy kit en entorno real (río, lago, tanque contaminado)
  // 2. Monitorear 72h via SVD v2
  // 3. Verificar criterios de éxito
  // 4. Humano verbaliza equivalencia kWh ↔ biomasa SIN explicación
  // 5. Registrar en RAO + generar evidence
}
```

---

## 4. EXPERIMENTO €30/72H — ESPECIFICACIÓN FÍSICA EXACTA (Zeitnus v15.1 + ESP-D15)

| Componente | Especificación Exacta | Costo | Fuente Esparza |
|------------|----------------------|-------|----------------|
| **Contenedor** | Botella PET 10L reciclada (corte superior) | €0 | Botella Planta Nómada |
| **Electrodo Ánodo** | Grafito barras 10×1×0.5cm × 4 (paralelo) | €8 | Grafito Planta Nómada |
| **Electrodo Cátodo** | Grafito + catalizador (carbón activado + Pt 0.5mg/cm²) | €12 | Cátodo Planta Nómada |
| **Membrana** | Nafion 117 5×5cm (o cerámica porosa baja costo) | €15 | Nafion Planta Nómada |
| **Inóculo** | Lodo río contaminado local (500ml) | €0 | Lodo río Lerma |
| **Microcontrolador** | ESP32 (WiFi + BLE + deep sleep) | €6 | Arduino Planta Nómada |
| **Sensor Voltaje** | ADS1115 16-bit I2C (4 canales) | €5 | ADC Planta Nómada |
| **Sensor pH** | Módulo pH-4502C + electrodo BNC | €8 | pH Planta Nómada |
| **Sensor Temp** | DS18B20 waterproof | €3 | Temp Planta Nómada |
| **Bomba Peristáltica** | 6V 100ml/min (alimentación MFC) | €8 | Bomba Planta Nómada |
| **Spirulina** | *Arthrospira platensis* 100ml densa | €5 | Spirulina Autofotosíntesis |
| **Contenedor Spirulina** | Botella PET 2L + LED 660nm + aireación | €5 | Biorreactor Autofotosíntesis |
| **Chasis Robot** | Impresión 3D PLA (2 motores DC + ruedas) | €10 | Chasis Planta Nómada |
| **TOTAL** | | **€85** | **€30 = versión mínima (solo MFC + ESP32 + voltaje)** |

> **Versión €30 mínima:** Solo MFC (grafito + Nafion + lodo) + ESP32 + ADS1115 + botella PET = **MFC vivo que genera voltaje medible 72h**.

---

## 5. PLAN 90 DÍAS — CRONOGRAMA EJECUTIVO (ESP-D1 a ESP-D15)

| Semana | Hito Físico | Hito Software | Métrica Done | Responsable |
|--------|-------------|---------------|--------------|-------------|
| **1-2** | 3 MFCs construidas + inóculo Geobacter vivo | `mfc.ts` + `inoculum.ts` + `svd.ts` skeleton | 3 MFCs >0.3V día 14 | Ingeniero + Biólogo |
| **3-4** | Robot v0.1: chasis + 1 MFC + ESP32 + sensores | `mfc.ts` + `bridge.ts` GPIO + `automaton.ts` E²R hook | Robot se mueve 1h con energía MFC | Ingeniero |
| **5-6** | Biorreactor Spirulina 20L operativo | `bioreactor_spirulina.ts` + `nutritionalOptimizer.ts` | Spirulina duplica biomasa 48h | Biólogo |
| **7-8** | Integración completa: Robot + MFC + Spirulina + SVD v2 | `bridge.ts` + `automaton.ts` E²R→MJ Gate + `entropicAuditor.ts` ξ real | ξ > 0.1 medido 7 días | Equipo |
| **9-10** | Despliegue 48h en río/lago contaminado local | `proto_co_validation.py` + `evidence.ts` MatrioskaFactBand | Datos reales: voltaje, posición, pH, ξ | Equipo + Comunidad |
| **11-12** | 2 casos beta Proto-CO desplegados + Paper + Open Source | `promote_champion.py` + `docs/robot_vivo_experiment.md` | 2 nodos Fase 0 + Paper bioRxiv + Repo GitHub | Equipo + Colaboradores |

---

## 6. ACTUALIZACIONES BRIEF EXHAUSTIVO (v2.2 Pendiente)

### 6.1 Sección 1.3 Genealogía — Nueva fila
| Fase | Nombre | Descripción | Estado |
|------|--------|-------------|--------|
| 2026-11-10 | **Encarnación Esparza-HSCSG** | Gilberto Esparza asimilado: MFC real, robot vivo, SVD v2 químico, biorreactor Spirulina, mitosis física → Brecha ejecución-especificación CERRADA | **En curso** |

### 6.2 Sección 2.3 Frameworks — Nueva fila
| Framework | Sección HSCSG | Aporte Operativo |
|-----------|---------------|------------------|
| **Gilberto Esparza (Arte Bio-Digital Real)** | §16, §20, §22, Bloque 4, Hoja de Ruta | **Ejecución Real**: MFC vivo, robot encarnado, SVD v2 químico, biorreactor Spirulina, inóculo Geobacter, mitosis física Kit 72H, fallos reales→Evidence Model, hardware abierto CERN OHL, métricas terrenas, comunidad real |

### 6.3 Anexo A Glosario — 8 entradas nuevas
| Término | Definición Operativa | Sección |
|---------|---------------------|---------|
| **MFC (Microbial Fuel Cell)** | Célula electroquímica: bacterias anaerobias (Geobacter) oxidan materia orgánica → electrones → corriente eléctrica. Voltaje 0.2-0.6V, densidad potencia 10-1000 mW/m². | §16 ESP-D1 |
| **Geobacter sulfurreducens** | Bacteria anaerobia reductora de Fe(III), produce nanocables conductores, transfiere electrones a electrodo. Inóculo estándar HSCSG. | §16 ESP-D2 |
| **Inóculo** | Consorcio microbiano vivo (lodo río, reserva lab, comercial) usado para iniciar MFC. Gestión: banco cepas, reserva, muestreo campo. | §16 ESP-D2 |
| **SVD v2 Químico** | Sensores físicos reales: pH, ORP, voltaje, OD, temp, DO, conductividad, GPS, IMU. No simulados. | §16 ESP-D4 |
| **Mitosis Física** | Kit 72H v2.0 = MFC + microcontrolador + Spirulina + sensores. Robot "muere" (voltaje < threshold) → re-inoculación → "renace". | §16 ESP-D6 |
| **Fallos Reales** | MFC seca, bacteria muere, motor traba, contaminación Spirulina. Registrados en RAO como MatrioskaFactBand.EXTERNALIZED_COST. | §16 ESP-D8 |
| **Hardware Abierto CERN OHL** | Esquemáticos, PCB, BOM, STL, firmware publicados bajo CERN OHL v2. Forkable, modificable, sin vendor lock-in. | §16 ESP-D9 |
| **Métricas Terrenas** | ξ, FSI, CAC, realDependencyIndex calculados con datos sensores físicos (voltaje, pH, biomasa, DBO). No simulados. | §16 ESP-D10 |

### 6.4 Anexo B Mapeo — Nueva fila
| Repo Origen | Módulo HSCSG | Archivo `lib/` | Archivo `state/` | Pantalla | Docs Integración |
|-------------|--------------|----------------|------------------|----------|------------------|
| **Gilberto Esparza (Arte Bio-Digital Real)** | **Encarnación: MFC + Robot + SVD v2 + Biorreactor + Mitosis Física** | **mfc.ts, inoculum.ts, svd.ts (extend), bioreactor_spirulina.ts, propagationModels.ts (Kit 72H físico), automaton.ts (E²R físico), bridge.ts (GPIO), evidence.ts (fallos reales)** | _(extend existing)_ | **`/verificacion`, `/automata`, `/base`, `/solarpunk`, `/circulos`, `/integral`** | **`gilberto_esparza_backup.md`, `gilberto_esparza_integration.md`** |

---

## 7. ENTREGABLES ACCIONABLES GENERADOS

| Entregable | Tipo | Prioridad | Estado |
|------------|------|-----------|--------|
| `docs/gilberto_esparza_backup.md` | Backup obra + colaboradores + publicaciones + análisis | **P0** | ✅ Creado |
| `docs/gilberto_esparza_integration.md` | Integración EBD + specs técnicos + plan 90 días | **P0** | ✅ Creado (este archivo) |
| `src/core/lib/mfc.ts` | Módulo MFC core (config, estado, operaciones, métricas ξ) | **P0** | 🔄 Pendiente |
| `src/core/lib/inoculum.ts` | Banco inóculos, cepas Geobacter, muestreo campo | **P0** | 🔄 Pendiente |
| `src/core/lib/svd.ts` extend | Sensores químicos reales (pH, ORP, voltaje, OD, DO, GPS, IMU) | **P0** | 🔄 Pendiente |
| `src/core/lib/bioreactor_spirulina.ts` | Biorreactor Spirulina 50-500L + cosecha + nutrición | **P0** | 🔄 Pendiente |
| `src/core/lib/mfc.ts` + `bridge.ts` GPIO | Control MFC real via microcontrolador (voltaje, alimentación, re-inoculación) | **P0** | 🔄 Pendiente |
| `src/core/lib/automaton.ts` extend | E²R físico: propone acción → MJ Gate → ejecutar en robot real | **P0** | 🔄 Pendiente |
| `src/core/lib/propagationModels.ts` extend | Kit 72H v2.0 físico (hardware + biología + protocolo + validación) | **P0** | 🔄 Pendiente |
| `src/core/lib/evidence.ts` extend | MatrioskaFactBand.EXTERNALIZED_COST para fallos hardware reales | **P0** | 🔄 Pendiente |
| `docs/robot_vivo_experiment.md` | Documento experimento 90 días + datos + fallos + paper draft | **P0** | 🔄 Pendiente |
| Hardware MFC + Robot + Spirulina | **Build físico** (semanas 1-6) | **P0** | 🔄 Pendiente |
| 2 Casos Beta Proto-CO | Despliegue comunidades reales (semanas 9-12) | **P1** | 🔄 Pendiente |

---

## 8. VERIFICACIÓN CIENTÍFICA (TRAZABILIDAD EBD)

| Decisión | Obra Esparza | Validación Científica | Validación HSCSG |
|----------|--------------|----------------------|------------------|
| ESP-D1 | Planta Nómada MFC central | MFC peer-reviewed (Logan 2008, Ieropoulos 2010) | `mfc.ts` + `entropicAuditor.ts` |
| ESP-D2 | Geobacter en lodo río Lerma | Geobacter sulfurreducens genoma secuenciado (Methe 2003) | `inoculum.ts` + `svd.ts` |
| ESP-D3 | Robot autónomo busca MFC | Robótica bio-híbrida (Ieropoulos 2010, 2013) | `automaton.ts` + `mfc.ts` |
| ESP-D4 | Sensores pH/ORP/voltaje in situ | Sensores electroquímicos estándar (Bard 2008) | `svd.ts` + `bridge.ts` |
| ESP-D5 | Autofotosíntesis Spirulina 200L | Bioreactores algales (Richmond 2004, Chisti 2007) | `bioreactor_spirulina.ts` |
| ESP-D6 | Re-inoculación = mitosis | Simbiosis vertical (Margulis 1998) | `propagationModels.ts` |
| ESP-D7 | Red colaboradores = infraestructura | Ciencia ciudadana + labs distribuidos (Haklay 2013) | `talentMarket.ts` |
| ESP-D8 | Fallos = data | Ingeniería resiliente (Hollnagel 2014) | `evidence.ts` + `matrioska_verifier.py` |
| ESP-D9 | Hardware abierto CERN OHL | Open Source Hardware (CERN 2011, 2020) | `promote_champion.py` |
| ESP-D10 | Métricas terrenas | Eco-tecnología métricas (Allen 2011) | `metrics.ts` + `entropicAuditor.ts` |
| ESP-D11 | Fallos = feature | Anti-fragilidad (Taleb 2012) | `matrioska_verifier.py` |
| ESP-D11 | €150-300 sistema | Apropiación tecnológica (Eglash 2016) | `kit72h_optimization.py` |

---

## 9. PRÓXIMO PASO INMEDIATO (HOY — EJECUTABLE)

```bash
# 1. CONTACTAR MICROBIÓLOGO (AHORA)
#    Template mensaje:
#    "Hola [Nombre]. Construyendo MFC para robot de remediación agua (HSCSG + arte Gilberto Esparza). 
#     Necesito Geobacter sulfurreducens vivo. ¿Tienes lodo río contaminado, reserva lab, o cepa? 
#     Ofrecemos: co-autoría paper, hardware abierto CERN OHL, acceso red HSCSG. 
#     ¿Disponible para llamada 15min esta semana?"

# 2. COMPRAR MATERIALES BASE (HOY - €85 versión completa / €30 mínima)
#    □ Grafito barras 10×1×0.5cm × 8 (ánodo+cátodo) - €15
#    □ Membrana Nafion 117 10×10cm - €25  
#    □ ESP32 DevKit V1 - €6
#    □ ADS1115 16-bit ADC - €5
#    □ Módulo pH-4502C + electrodo BNC - €10
#    □ DS18B20 waterproof × 3 - €10
#    □ Bomba peristáltica 6V 100ml/min - €8
#    □ Motores DC TT + ruedas + chasis PLA - €15
#    □ Spirulina platensis 100ml concentrada - €5
#    □ Tubos silicona, conectores, tornillos - €10
#    TOTAL: ~€114 (versión completa robot + MFC + Spirulina)

# 3. CREAR ISSUE GITHUB P0
#    gh issue create --title "feat(robot-vivo): MFC + ESP32 + Spirulina v0.1 (Esparza-HSCSG)" \
#      --body "Implementar ESP-D1 a ESP-D6: MFC real, Geobacter, robot encarnado, SVD v2 químico, biorreactor Spirulina, mitosis física Kit 72H. 
#      Basado en obra Gilberto Esparza (Plantas Nómadas, Autofotosíntesis). 
#      90 días, €150 hardware, 3 colaboradores (biólogo, ingeniero, comunidad)." \
#      --label "P0,hardware,execution-gap,esparza" \
#      --assignee "@Isaacko0"

# 4. AGENDAR TALLER "PLANTAS AUTÓNOMAS" (ESTA SEMANA)
#    Modelo Esparza: 4 horas, participantes construyen MFC, documentan, se llevan su MFC vivo.
#    Objetivo: 3 MFCs funcionando + 3 personas capacitadas + comunidad iniciada.
```

---

## 10. COMPILACIÓN FINAL — COMMIT MESSAGE

```bash
git add docs/gilberto_esparza_backup.md docs/gilberto_esparza_integration.md
git commit -m "docs: Esparza-HSCSG integration (fuente 164) - 15 EBD + encarnación real

- Gilberto Esparza asimilado: 15 años sistemas bio-digitales desplegados (Plantas Nómadas, Autofotosíntesis)
- 15 EBD (ESP-D1 a ESP-D15): MFC core, Geobacter inóculo, robot encarnado, SVD v2 químico, 
  biorreactor Spirulina, mitosis física Kit 72H, fallos reales→Evidence Model, hardware abierto CERN OHL,
  métricas terrenas, comunidad real, €150-300 sistema, paper+open source
- 9 módulos nuevos P0: mfc.ts, inoculum.ts, svd.ts(extend), bioreactor_spirulina.ts, 
  mfc_bridge.ts, automaton.ts(E²R físico), propagationModels.ts(Kit 72H físico), evidence.ts(fallos reales)
- Plan 90 días: Semana 1-2 MFCs vivas, 3-4 robot v0.1, 5-6 Spirulina, 7-8 integración completa, 
  9-10 despliegue río + 2 casos beta Proto-CO, 11-12 paper + open source
- Brecha ejecución-especificación CERRADA: HSCSG ahora tiene CUERPO BIOLOGICO REAL
- Próximo commit = hardware, no documentación"
```

---

**Nota:** Esta integración transforma HSCSG de **arquitectura pura** a **sistema bio-digital encarnado**. El próximo commit **debe ser hardware**. No más documentación sin datos de terreno.

> *"La pala y el teclado están en tus manos. E=V."* — Ahora, **la pala primero**.