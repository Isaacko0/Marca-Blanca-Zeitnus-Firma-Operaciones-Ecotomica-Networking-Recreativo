// src/core/lib/bioreactor_spirulina.ts
// Biorreactor Spirulina — FABSHIP Nutricia Module
// Producción, cosecha, nutrición, control ambiental automatizado
// EBD: ESP-D5, ESP-D6, ESP-D10, ESP-D15

import { EventEmitter } from 'events';

/** Geometría del biorreactor */
export type BioreactorGeometry = 'tubular' | 'flat_panel' | 'raceway' | 'bag' | 'column' | 'custom';

/** Material del biorreactor */
export type BioreactorMaterial = 'PVC' | 'polycarbonate' | 'LDPE' | 'HDPE' | 'glass' | 'stainless_steel' | 'EPDM' | 'custom';

/** Tipo de iluminación */
export type LightType = 'LED' | 'fluorescent' | 'solar' | 'hybrid' | 'fiber_optic';

/** Espectro de luz */
export type LightSpectrum = 'full' | 'red_blue' | 'red_blue_white' | 'white' | 'custom';

/** Tipo de mezclado */
export type MixingType = 'air_lift' | 'paddle' | 'pump' | 'magnetic' | 'gas_sparging' | 'none';

/** Control de temperatura */
export type TempControlType = 'passive' | 'active_heating' | 'active_cooling' | 'heat_exchanger' | 'phase_change' | 'evaporative';

/** Método de cosecha */
export type HarvestMethod = 'centrifuge' | 'filtration' | 'flocculation' | 'sedimentation' | 'membrane' | 'hydrocyclone' | 'custom';

/** Estado de contaminación */
export type ContaminationLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

/** Tipo de contaminante */
export type ContaminantType = 'bacteria' | 'fungi' | 'protozoa' | 'algae_foreign' | 'virus' | 'unknown';

/** Configuración completa del biorreactor */
export interface BioreactorConfig {
  id: string;
  name: string;
  volume_L: number;                    // Volumen trabajo (L)
  geometry: BioreactorGeometry;
  material: BioreactorMaterial;
  dimensions: {
    length_m?: number;
    width_m?: number;
    height_m?: number;
    diameter_m?: number;
    surfaceArea_m2: number;            // Área iluminada (m²)
  };
  
  // Iluminación
  lighting: {
    type: LightType;
    spectrum: LightSpectrum;
    intensity_umol_m2_s: number;       // PPFD (μmol/m²/s)
    photoperiod_hours: number;         // Horas luz/día
    dawnDuskTransition_min: number;    // Transición amanecer/atardecer
    ledChannels?: {
      red_660nm: number;               // % intensidad
      blue_450nm: number;
      white_6500K: number;
      farRed_730nm: number;
      uv_380nm: number;
    };
    control: 'fixed' | 'PID' | 'adaptive' | 'solar_tracking';
  };
  
  // Mezclado
  mixing: {
    type: MixingType;
    rate_L_min: number;                // Tasa recirculación (L/min)
    dutyCycle: 'continuous' | 'intermittent' | 'adaptive';
    onDuration_min?: number;           // Si intermittent
    offDuration_min?: number;
    spargingRate_L_min?: number;       // Si gas_sparging
    gasComposition?: {
      CO2_pct: number;
      air_pct: number;
      O2_pct: number;
    };
  };
  
  // Control temperatura
  temperatureControl: {
    type: TempControlType;
    target_C: number;
    tolerance_C: number;
    heatingPower_W?: number;
    coolingPower_W?: number;
    heatExchangerArea_m2?: number;
  };
  
  // Cosecha
  harvesting: {
    method: HarvestMethod;
    frequency_hours: number;           // Cada cuántas horas
    targetConcentration_g_L: number;   // g/L peso seco objetivo
    harvestVolume_L: number;           // Volumen por cosecha (L)
    retentionTime_hours: number;       // Tiempo retención post-cosecha
    flocculant?: {
      type: 'chitosan' | 'alum' | 'polymer' | 'bioflocculant';
      dose_mg_L: number;
    };
  };
  
  // Nutrición
  nutrition: {
    nitrogenSource: 'NaNO3' | 'KNO3' | 'urea' | 'ammonium' | 'wastewater' | 'urine' | 'custom';
    phosphorusSource: 'K2HPO4' | 'KH2PO4' | 'wastewater' | 'custom';
    ironSource: 'Fe_EDTA' | 'Fe_citrate' | 'Fe_SO4' | 'custom';
    traceMetals: Record<string, number>; // µM
    carbonSource: 'bicarbonate' | 'CO2_sparging' | 'carbonate' | 'custom';
    feedingStrategy: 'batch' | 'fed_batch' | 'continuous' | 'adaptive';
    targetN_P_Ratio: number;           // Ratio N:P molar (typ 16:1 Redfield)
    targetC_N_Ratio: number;           // Ratio C:N molar
  };
  
  // Monitoreo
  monitoring: {
    sensors: string[];                 // IDs sensores SVD
    logInterval_seconds: number;
    alertThresholds: {
      minOD750: number;
      maxOD750: number;
      minPH: number;
      maxPH: number;
      minTemp_C: number;
      maxTemp_C: number;
      minDO_mg_L: number;
      maxContamination: ContaminationLevel;
    };
  };
  
  // Operación
  operation: {
    mode: 'autonomous' | 'supervised' | 'manual';
    startupProtocol: string[];
    shutdownProtocol: string[];
    emergencyProtocol: string[];
    maintenanceInterval_days: number;
  };
  
  metadata: Record<string, unknown>;
}

/** Estado dinámico del biorreactor */
export interface BioreactorState {
  // Biomasa
  biomass_g_L: number;                 // g/L peso seco
  opticalDensity_750: number;          // OD750
  growthRate_per_day: number;          // μ (día⁻¹)
  doublingTime_hours: number;          // Tiempo duplicación (horas)
  productivity_g_m2_day: number;       // Productividad areal (g/m²/día)
  
  // Composición nutricional
  composition: {
    protein_pct: number;               // % peso seco
    lipid_pct: number;
    carbohydrate_pct: number;
    fiber_pct: number;
    ash_pct: number;
    moisture_pct: number;
    phycocyanin_pct: number;           // Ficocianina % peso seco
    chlorophyll_a_pct: number;         // Clorofila a % peso seco
    carotenoids_pct: number;           // Carotenoides % peso seco
    essentialAminoAcids_pct: number;   // AA esenciales % proteína
    omega3_mg_g: number;               // mg/g peso seco
    omega6_mg_g: number;
    vitaminB12_ug_g: number;           // µg/g peso seco
    iron_mg_g: number;
  };
  
  // Nutrientes en medio
  nutrientLevels: {
    nitrogen_mg_L: number;             // N-NO3 + N-NH4
    phosphorus_mg_L: number;           // P-PO4
    potassium_mg_L: number;
    magnesium_mg_L: number;
    calcium_mg_L: number;
    iron_ug_L: number;
    traceMetals: Record<string, number>;
    carbon_inorganic_mM: number;       // HCO3- + CO3²-
    carbon_organic_mg_L: number;       // DOC
  };
  
  // Parámetros fisicoquímicos
  pH: number;
  temperature_C: number;
  dissolvedO2_mg_L: number;            // mg/L
  dissolvedO2_pct_sat: number;         // % saturación
  conductivity_uS_cm: number;
  ORP_mV: number;
  turbidity_NTU: number;
  
  // Contaminación
  contamination: {
    detected: boolean;
    level: ContaminationLevel;
    type: ContaminantType | null;
    dominantSpecies: string[];
    actionTaken: string;
    actionTimestamp: number;
    resolved: boolean;
  };
  
  // Ciclo de luz
  lightCycle: {
    phase: 'day' | 'night' | 'dawn' | 'dusk';
    timeInPhase_min: number;
    accumulatedPAR_mol_m2: number;     // PAR acumulado día (mol/m²)
  };
  
  // Historial cosechas
  harvestHistory: HarvestRecord[];
  
  // Estado operativo
  operationalStatus: 'starting' | 'running' | 'harvesting' | 'maintenance' | 'emergency' | 'idle' | 'error';
  uptime_hours: number;
  lastMaintenance: number;
  errorCount: number;
  warnings: string[];
  
  metadata: Record<string, unknown>;
}

/** Registro de cosecha */
export interface HarvestRecord {
  id: string;
  timestamp: number;
  volume_L: number;
  biomass_g: number;                   // g peso seco total
  biomass_g_L: number;                 // g/L en cosecha
  concentrationFactor: number;         // Factor concentración (biomass_g_L / reactor_biomass_g_L)
  composition: {
    protein_pct: number;
    lipid_pct: number;
    carbohydrate_pct: number;
    phycocyanin_pct: number;
  };
  destination: 'food_human' | 'feed_animal' | 'biofuel' | 'fertilizer' | 'MFC_substrate' | 'extracts' | 'waste';
  processingMethod: 'raw' | 'dried' | 'frozen' | 'extracted' | 'fermented';
  qualityMetrics: {
    heavyMetals_ppm: Record<string, number>;
    microcystins_ug_L: number;
    bacterialCount_CFU_g: number;
    shelfLife_days: number;
  };
  energyInput_kWh: number;             // Energía consumida cosecha
  waterRecovered_L: number;            // Agua recuperada
  notes: string;
}

/** Plan nutricional calculado */
export interface NutritionalPlan {
  reactorId: string;
  generatedAt: number;
  targetBiomass_g_L: number;
  targetHarvestDate: number;
  dailyNutrientDoses: {
    date: number;
    nitrogen_mg_L: number;
    phosphorus_mg_L: number;
    iron_ug_L: number;
    traceMetals: Record<string, number>;
    carbon_mM: number;
    volume_L: number;
  }[];
  expectedComposition: BioreactorState['composition'];
  estimatedYield_g: number;
  estimatedProtein_g: number;
  confidence: number;
}

/** Diagnóstico del biorreactor */
export interface BioreactorDiagnosis {
  healthy: boolean;
  growthStatus: 'optimal' | 'suboptimal' | 'limited' | 'inhibited' | 'crash';
  limitingFactor: 'light' | 'nitrogen' | 'phosphorus' | 'iron' | 'carbon' | 'temperature' | 'pH' | 'contamination' | 'none';
  issues: string[];
  recommendations: string[];
  predictedHarvestDate: number;
  predictedYield_g: number;
  riskFactors: Array<{ factor: string; probability: number; impact: 'low' | 'medium' | 'high' }>;
}

/** Clase principal del biorreactor */
export class SpirulinaBioreactor extends EventEmitter {
  public readonly config: BioreactorConfig;
  public state: BioreactorState;
  private controlInterval: NodeJS.Timeout | null = null;
  private lightCycleInterval: NodeJS.Timeout | null = null;
  private startTime: number;
  private growthModel: GrowthModel;

  constructor(config: BioreactorConfig) {
    super();
    this.config = { ...config };
    this.startTime = Date.now();
    this.growthModel = new GrowthModel(config);
    this.state = this.initializeState();
  }

  /** Inicializa estado por defecto */
  private initializeState(): BioreactorState {
    return {
      biomass_g_L: 0.1,                // Inóculo inicial ~0.1 g/L
      opticalDensity_750: 0.05,
      growthRate_per_day: 0,
      doublingTime_hours: 0,
      productivity_g_m2_day: 0,
      composition: this.getDefaultComposition(),
      nutrientLevels: this.getInitialNutrients(),
      pH: 9.5,
      temperature_C: this.config.temperatureControl.target_C,
      dissolvedO2_mg_L: 8,
      dissolvedO2_pct_sat: 100,
      conductivity_uS_cm: 15000,
      ORP_mV: -50,
      turbidity_NTU: 5,
      contamination: {
        detected: false,
        level: 'none',
        type: null,
        dominantSpecies: [],
        actionTaken: '',
        actionTimestamp: 0,
        resolved: true
      },
      lightCycle: {
        phase: 'day',
        timeInPhase_min: 0,
        accumulatedPAR_mol_m2: 0
      },
      harvestHistory: [],
      operationalStatus: 'starting',
      uptime_hours: 0,
      lastMaintenance: Date.now(),
      errorCount: 0,
      warnings: [],
      metadata: {}
    };
  }

  /** Composición por defecto Spirulina fresca */
  private getDefaultComposition(): BioreactorState['composition'] {
    return {
      protein_pct: 60,
      lipid_pct: 7,
      carbohydrate_pct: 15,
      fiber_pct: 8,
      ash_pct: 7,
      moisture_pct: 90,
      phycocyanin_pct: 15,
      chlorophyll_a_pct: 1,
      carotenoids_pct: 0.5,
      essentialAminoAcids_pct: 47,
      omega3_mg_g: 12,
      omega6_mg_g: 18,
      vitaminB12_ug_g: 20,
      iron_mg_g: 2.8
    };
  }

  /** Nutrientes iniciales (medio Zarrouk simplificado) */
  private getInitialNutrients(): BioreactorState['nutrientLevels'] {
    return {
      nitrogen_mg_L: 2500,      // ~180 mM NaNO3
      phosphorus_mg_L: 50,      // ~1.6 mM K2HPO4
      potassium_mg_L: 1000,
      magnesium_mg_L: 200,
      calcium_mg_L: 100,
      iron_ug_L: 5000,          // 5 mg/L Fe-EDTA
      traceMetals: {
        Mn: 10, Zn: 2, Cu: 0.5, Co: 0.1, Mo: 0.1, B: 5, V: 0.1
      },
      carbon_inorganic_mM: 100, // ~8.4 g/L NaHCO3
      carbon_organic_mg_L: 0
    };
  }

  /** Inicia control automático */
  public startAutonomousControl(): void {
    if (this.controlInterval || this.lightCycleInterval) return;
    
    this.state.operationalStatus = 'running';
    
    // Control principal cada minuto
    this.controlInterval = setInterval(() => {
      this.controlTick();
    }, 60000);
    
    // Ciclo luz cada segundo (transiciones suaves)
    this.lightCycleInterval = setInterval(() => {
      this.updateLightCycle();
    }, 1000);
    
    this.emit('control:started', { reactorId: this.config.id });
  }

  /** Detiene control */
  public stopControl(): void {
    if (this.controlInterval) {
      clearInterval(this.controlInterval);
      this.controlInterval = null;
    }
    if (this.lightCycleInterval) {
      clearInterval(this.lightCycleInterval);
      this.lightCycleInterval = null;
    }
    this.state.operationalStatus = 'idle';
    this.emit('control:stopped', { reactorId: this.config.id });
  }

  /** Ciclo principal de control */
  private async controlTick(): Promise<void> {
    try {
      this.state.uptime_hours = (Date.now() - this.startTime) / 3600000;
      
      // Simular crecimiento (en producción: leer sensores SVD)
      this.simulateGrowth();
      
      // Control pH (inyección CO2/bicarbonato)
      this.controlPH();
      
      // Control temperatura
      this.controlTemperature();
      
      // Control nutrientes (dosis adaptativa)
      this.controlNutrients();
      
      // Detectar contaminación
      this.detectContamination();
      
      // Verificar lista para cosecha
      this.checkHarvestReadiness();
      
      // Actualizar estado nutricional
      this.updateNutritionalState();
      
      this.emit('state:updated', this.getStateSummary());
      
    } catch (error) {
      this.state.errorCount++;
      this.state.warnings.push(`Control error: ${error}`);
      this.emit('error', { reactorId: this.config.id, error });
    }
  }

  /** Simula crecimiento basado en modelo cinético */
  private simulateGrowth(): void {
    const dt_days = 1 / 1440; // 1 min = 1/1440 día
    
    // Factores limitantes (Ley de Liebig / Monod)
    const lightFactor = this.calculateLightLimitation();
    const nitrogenFactor = this.calculateNutrientLimitation('nitrogen');
    const phosphorusFactor = this.calculateNutrientLimitation('phosphorus');
    const ironFactor = this.calculateNutrientLimitation('iron');
    const carbonFactor = this.calculateCarbonLimitation();
    const tempFactor = this.calculateTemperatureFactor();
    const pHFactor = this.calculatePHFactor();
    const inhibitionFactor = this.calculateInhibition();
    
    // Factor limitante mínimo (Liebig)
    const limitingFactors = {
      light: lightFactor,
      nitrogen: nitrogenFactor,
      phosphorus: phosphorusFactor,
      iron: ironFactor,
      carbon: carbonFactor,
      temperature: tempFactor,
      pH: pHFactor
    };
    
    const minFactor = Math.min(...Object.values(limitingFactors));
    const limitingFactor = Object.entries(limitingFactors).reduce((a, b) => a[1] < b[1] ? a : b)[0];
    
    // Tasa crecimiento máxima específica μmax (día⁻¹) — Spirulina ~0.8-1.2 día⁻¹ óptimo
    const muMax = 1.0;
    const mu = muMax * minFactor * inhibitionFactor;
    
    // Actualizar biomasa
    this.state.growthRate_per_day = mu;
    this.state.doublingTime_hours = mu > 0 ? Math.log(2) / mu * 24 : 0;
    
    const newBiomass = this.state.biomass_g_L * Math.exp(mu * dt_days);
    this.state.biomass_g_L = newBiomass;
    
    // OD750 correlacionado (~0.5 OD per g/L para Spirulina)
    this.state.opticalDensity_750 = newBiomass * 0.5 * (0.9 + Math.random() * 0.2);
    
    // Productividad areal
    this.state.productivity_g_m2_day = this.state.biomass_g_L * mu * (this.config.volume_L / 1000) / this.config.dimensions.surfaceArea_m2;
    
    // Consumo nutrientes (estoquiometría Redfield modificada Spirulina)
    // C106H263O110N16P1 + 106CO2 → biomass
    const C_per_biomass = 0.47;      // g C/g biomass
    const N_per_biomass = 0.07;      // g N/g biomass
    const P_per_biomass = 0.008;     // g P/g biomass
    const Fe_per_biomass = 0.0003;   // g Fe/g biomass
    
    const biomassIncrease = newBiomass - this.state.biomass_g_L + (this.state.biomass_g_L * (1 - Math.exp(-mu * dt_days))); // aprox
    const actualIncrease = newBiomass - (this.state.biomass_g_L / Math.exp(mu * dt_days)); // más preciso
    
    if (actualIncrease > 0) {
      this.state.nutrientLevels.nitrogen_mg_L -= actualIncrease * N_per_biomass * 1000;
      this.state.nutrientLevels.phosphorus_mg_L -= actualIncrease * P_per_biomass * 1000;
      this.state.nutrientLevels.iron_ug_L -= actualIncrease * Fe_per_biomass * 1e6;
      this.state.nutrientLevels.carbon_inorganic_mM -= (actualIncrease * C_per_biomass * 1000) / 12.01 * 1000; // mM
    }
    
    // Producción O2 fotosintética
    const O2_per_C = 1.33; // mol O2 / mol C fijado
    const C_fixed_mmol = (actualIncrease * C_per_biomass * 1000) / 12.01;
    const O2_produced_mg_L = C_fixed_mmol * O2_per_C * 32 / 1000;
    this.state.dissolvedO2_mg_L = Math.min(20, this.state.dissolvedO2_mg_L + O2_produced_mg_L);
    this.state.dissolvedO2_pct_sat = (this.state.dissolvedO2_mg_L / this.getDOSaturation(this.state.temperature_C)) * 100;
    
    // pH sube por consumo CO2
    this.state.pH += 0.001 * mu * dt_days * 1440; // ~0.001 pH por día⁻¹
    
    // Actualizar composición según limitación
    this.updateComposition(limitingFactor);
  }

  /** Factor limitación luz (Steele model) */
  private calculateLightLimitation(): number {
    const I = this.config.lighting.intensity_umol_m2_s; // PPFD
    const I_sat = 200; // μmol/m²/s saturación Spirulina
    const I_inhib = 800; // Fotoinhibición
    
    if (this.state.lightCycle.phase === 'night') return 0.1; // Respiración
    if (this.state.lightCycle.phase === 'dawn' || this.state.lightCycle.phase === 'dusk') {
      return 0.5 * (1 - Math.exp(-I / I_sat));
    }
    
    if (I > I_inhib) {
      return (1 - Math.exp(-I_sat / I)) * Math.exp(-(I - I_inhib) / 200);
    }
    return 1 - Math.exp(-I / I_sat);
  }

  /** Factor limitación nutriente (Monod) */
  private calculateNutrientLimitation(nutrient: 'nitrogen' | 'phosphorus' | 'iron'): number {
    const Ks = { nitrogen: 5, phosphorus: 0.1, iron: 0.05 }; // mg/L (Ks semisaturación)
    let S: number;
    
    switch (nutrient) {
      case 'nitrogen': S = this.state.nutrientLevels.nitrogen_mg_L; break;
      case 'phosphorus': S = this.state.nutrientLevels.phosphorus_mg_L; break;
      case 'iron': S = this.state.nutrientLevels.iron_ug_L / 1000; break;
    }
    
    return S / (Ks[nutrient] + S);
  }

  /** Factor limitación carbono */
  private calculateCarbonLimitation(): number {
    const Ks_C = 0.5; // mM HCO3-
    const S = this.state.nutrientLevels.carbon_inorganic_mM;
    return S / (Ks_C + S);
  }

  /** Factor temperatura (Cardinal model) */
  private calculateTemperatureFactor(): number {
    const T = this.state.temperature_C;
    const T_opt = 35;
    const T_min = 15;
    const T_max = 42;
    
    if (T <= T_min || T >= T_max) return 0;
    if (T <= T_opt) return (T - T_min) / (T_opt - T_min);
    return (T_max - T) / (T_max - T_opt);
  }

  /** Factor pH (óptimo 9.5-10.5) */
  private calculatePHFactor(): number {
    const pH = this.state.pH;
    if (pH < 8 || pH > 11) return 0;
    if (pH >= 9.5 && pH <= 10.5) return 1;
    if (pH < 9.5) return (pH - 8) / 1.5;
    return (11 - pH) / 0.5;
  }

  /** Factor inhibición (auto-sombreado, O2 alto, etc.) */
  private calculateInhibition(): number {
    let inhibition = 1;
    
    // Auto-sombreado (OD alto)
    if (this.state.opticalDensity_750 > 1.5) {
      inhibition *= Math.exp(-(this.state.opticalDensity_750 - 1.5) * 0.5);
    }
    
    // O2 alto (foto-respiración)
    if (this.state.dissolvedO2_pct_sat > 200) {
      inhibition *= 0.8;
    }
    
    // Contaminación
    if (this.state.contamination.detected) {
      inhibition *= 0.5 * (1 - (['low', 'medium', 'high', 'critical'].indexOf(this.state.contamination.level) + 1) * 0.2);
    }
    
    return Math.max(0.1, inhibition);
  }

  /** Actualiza composición bioquímica según factor limitante */
  private updateComposition(limitingFactor: string): void {
    const comp = this.state.composition;
    
    // Spirulina ajusta composición según limitación
    switch (limitingFactor) {
      case 'nitrogen':
        comp.protein_pct = Math.max(40, comp.protein_pct - 0.5);
        comp.carbohydrate_pct = Math.min(30, comp.carbohydrate_pct + 0.5);
        comp.phycocyanin_pct = Math.max(5, comp.phycocyanin_pct - 0.2);
        break;
      case 'phosphorus':
        comp.protein_pct = Math.max(45, comp.protein_pct - 0.3);
        comp.lipid_pct = Math.min(15, comp.lipid_pct + 0.3);
        break;
      case 'iron':
        comp.chlorophyll_a_pct = Math.max(0.5, comp.chlorophyll_a_pct - 0.01);
        comp.phycocyanin_pct = Math.max(8, comp.phycocyanin_pct - 0.1);
        break;
      case 'light':
        comp.carbohydrate_pct = Math.min(35, comp.carbohydrate_pct + 0.3);
        comp.lipid_pct = Math.min(12, comp.lipid_pct + 0.2);
        break;
      default: // óptimo
        comp.protein_pct = Math.min(65, comp.protein_pct + 0.1);
        comp.phycocyanin_pct = Math.min(20, comp.phycocyanin_pct + 0.05);
    }
    
    // Normalizar a 100%
    const total = comp.protein_pct + comp.lipid_pct + comp.carbohydrate_pct + comp.fiber_pct + comp.ash_pct;
    const factor = 100 / total;
    comp.protein_pct *= factor;
    comp.lipid_pct *= factor;
    comp.carbohydrate_pct *= factor;
    comp.fiber_pct *= factor;
    comp.ash_pct *= factor;
  }

  /** Control pH (inyección CO2 o bicarbonato) */
  private controlPH(): void {
    const target = 9.8;
    const tolerance = 0.3;
    
    if (this.state.pH > target + tolerance) {
      // Inyectar CO2 (sparging) o añadir bicarbonato
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'CO2_sparging', 
        action: 'start',
        duration_sec: 30 
      });
    } else if (this.state.pH < target - tolerance) {
      // Añadir bicarbonato (bomba dosificadora)
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'bicarbonate_pump', 
        action: 'dose',
        volume_ml: 10 
      });
    }
  }

  /** Control temperatura */
  private controlTemperature(): void {
    const target = this.config.temperatureControl.target_C;
    const tolerance = this.config.temperatureControl.tolerance_C;
    
    if (this.state.temperature_C > target + tolerance) {
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'cooling', 
        action: 'start' 
      });
    } else if (this.state.temperature_C < target - tolerance) {
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'heating', 
        action: 'start' 
      });
    }
  }

  /** Control nutrientes adaptativo */
  private controlNutrients(): void {
    const N_target = 50;  // mg/L mantener
    const P_target = 10;  // mg/L
    const Fe_target = 1000; // µg/L
    
    // Nitrógeno
    if (this.state.nutrientLevels.nitrogen_mg_L < N_target) {
      const dose = (N_target - this.state.nutrientLevels.nitrogen_mg_L) * this.config.volume_L / 1000; // g
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'nitrogen_pump', 
        action: 'dose',
        mass_g: dose 
      });
    }
    
    // Fósforo
    if (this.state.nutrientLevels.phosphorus_mg_L < P_target) {
      const dose = (P_target - this.state.nutrientLevels.phosphorus_mg_L) * this.config.volume_L / 1000;
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'phosphorus_pump', 
        action: 'dose',
        mass_g: dose 
      });
    }
    
    // Hierro
    if (this.state.nutrientLevels.iron_ug_L < Fe_target) {
      const dose = (Fe_target - this.state.nutrientLevels.iron_ug_L) * this.config.volume_L / 1000; // mg
      this.emit('actuator:command', { 
        reactorId: this.config.id, 
        actuator: 'iron_pump', 
        action: 'dose',
        mass_mg: dose 
      });
    }
  }

  /** Detección contaminación (basada en desviaciones) */
  private detectContamination(): void {
    // Indicadores: caída repentina OD, cambio pH anómalo, O2 nocturno no cae, microscopía (TODO)
    const odDrop = this.state.opticalDensity_750 < 0.3 && this.state.uptime_hours > 48;
    const phAnomaly = this.state.pH < 8.5 || this.state.pH > 11;
    const o2Night = this.state.lightCycle.phase === 'night' && this.state.dissolvedO2_pct_sat > 150;
    
    if ((odDrop || phAnomaly || o2Night) && !this.state.contamination.detected) {
      this.state.contamination = {
        detected: true,
        level: 'low',
        type: 'unknown',
        dominantSpecies: [],
        actionTaken: 'Detección automática - iniciar microscopía/qPCR',
        actionTimestamp: Date.now(),
        resolved: false
      };
      this.emit('contamination:detected', { 
        reactorId: this.config.id, 
        indicators: { odDrop, phAnomaly, o2Night } 
      });
    }
  }

  /** Verifica si lista para cosecha */
  private checkHarvestReadiness(): void {
    const targetOD = this.config.harvesting.targetConcentration_g_L * 0.5; // OD target
    const minInterval = this.config.harvesting.frequency_hours;
    const lastHarvest = this.state.harvestHistory[this.state.harvestHistory.length - 1];
    const hoursSinceHarvest = lastHarvest ? (Date.now() - lastHarvest.timestamp) / 3600000 : Infinity;
    
    if (this.state.opticalDensity_750 >= targetOD && hoursSinceHarvest >= minInterval) {
      this.emit('harvest:ready', { 
        reactorId: this.config.id, 
        currentOD: this.state.opticalDensity_750,
        targetOD,
        biomass_g_L: this.state.biomass_g_L
      });
    }
  }

  /** Actualiza estado nutricional para planificación */
  private updateNutritionalState(): void {
    // Actualizar PAR acumulado
    if (this.state.lightCycle.phase === 'day') {
      const PAR_per_sec = this.config.lighting.intensity_umol_m2_s / 1e6; // mol/m²/s
      this.state.lightCycle.accumulatedPAR_mol_m2 += PAR_per_sec;
    }
  }

  /** Actualiza ciclo de luz */
  private updateLightCycle(): void {
    const photoperiod = this.config.lighting.photoperiod_hours;
    const cycleMinutes = 24 * 60;
    const dayMinutes = photoperiod * 60;
    const now = new Date();
    const minutesIntoDay = now.getHours() * 60 + now.getMinutes();
    
    let phase: BioreactorState['lightCycle']['phase'];
    let timeInPhase = 0;
    
    const dawnDuration = this.config.lighting.dawnDuskTransition_min;
    const duskDuration = this.config.lighting.dawnDuskTransition_min;
    
    if (minutesIntoDay < dawnDuration) {
      phase = 'dawn';
      timeInPhase = minutesIntoDay;
    } else if (minutesIntoDay < dawnDuration + dayMinutes - duskDuration) {
      phase = 'day';
      timeInPhase = minutesIntoDay - dawnDuration;
    } else if (minutesIntoDay < dawnDuration + dayMinutes) {
      phase = 'dusk';
      timeInPhase = minutesIntoDay - (dawnDuration + dayMinutes - duskDuration);
    } else {
      phase = 'night';
      timeInPhase = minutesIntoDay - (dawnDuration + dayMinutes);
    }
    
    this.state.lightCycle.phase = phase;
    this.state.lightCycle.timeInPhase_min = timeInPhase;
    
    // Reset PAR al inicio del día
    if (phase === 'dawn' && timeInPhase === 0) {
      this.state.lightCycle.accumulatedPAR_mol_m2 = 0;
    }
  }

  /** Ejecuta cosecha */
  public async executeHarvest(volume_L?: number, destination?: HarvestRecord['destination']): Promise<HarvestRecord> {
    const harvestVolume = volume_L || this.config.harvesting.harvestVolume_L;
    const harvestDest = destination || 'food_human';
    
    this.state.operationalStatus = 'harvesting';
    this.emit('harvest:started', { reactorId: this.config.id, volume_L: harvestVolume });
    
    // Simular tiempo cosecha
    await new Promise(r => setTimeout(r, 2000));
    
    const biomassHarvested_g = this.state.biomass_g_L * harvestVolume;
    const concentrationFactor = this.state.biomass_g_L / (this.state.biomass_g_L * 0.1); // vs medio fresco
    
    const record: HarvestRecord = {
      id: `harvest_${Date.now()}`,
      timestamp: Date.now(),
      volume_L: harvestVolume,
      biomass_g: biomassHarvested_g,
      biomass_g_L: this.state.biomass_g_L,
      concentrationFactor,
      composition: { ...this.state.composition },
      destination: harvestDest,
      processingMethod: 'raw',
      qualityMetrics: {
        heavyMetals_ppm: { Pb: 0.1, Cd: 0.01, Hg: 0.001, As: 0.1 },
        microcystins_ug_L: 0,
        bacterialCount_CFU_g: 1000,
        shelfLife_days: 7
      },
      energyInput_kWh: harvestVolume * 0.05, // Estimado
      waterRecovered_L: harvestVolume * 0.9,
      notes: `Cosecha automática OD=${this.state.opticalDensity_750.toFixed(2)}`
    };
    
    this.state.harvestHistory.push(record);
    
    // Reducir biomasa en reactor (dilución con medio fresco)
    const remainingVolume = this.config.volume_L - harvestVolume;
    this.state.biomass_g_L *= (remainingVolume / this.config.volume_L);
    this.state.opticalDensity_750 *= (remainingVolume / this.config.volume_L);
    
    // Reponer nutrientes en medio fresco
    this.state.nutrientLevels = this.getInitialNutrients();
    this.state.pH = 9.5;
    
    this.state.operationalStatus = 'running';
    this.emit('harvest:completed', { reactorId: this.config.id, record });
    
    return record;
  }

  /** Genera plan nutricional para objetivo */
  public generateNutritionalPlan(targetBiomass_g_L: number, targetDate: number): NutritionalPlan {
    const daysToTarget = (targetDate - Date.now()) / 86400000;
    const currentBiomass = this.state.biomass_g_L;
    const requiredGrowth = targetBiomass_g_L / currentBiomass;
    const requiredMu = Math.log(requiredGrowth) / daysToTarget;
    
    // Calcular dosis diarias necesarias
    const dailyDoses = [];
    for (let i = 0; i < daysToTarget; i++) {
      const date = Date.now() + i * 86400000;
      dailyDoses.push({
        date,
        nitrogen_mg_L: 50,
        phosphorus_mg_L: 10,
        iron_ug_L: 1000,
        traceMetals: { Mn: 10, Zn: 2, Cu: 0.5 },
        carbon_mM: 100,
        volume_L: this.config.volume_L * 0.01 // 1% recambio/día
      });
    }
    
    return {
      reactorId: this.config.id,
      generatedAt: Date.now(),
      targetBiomass_g_L,
      targetHarvestDate: targetDate,
      dailyNutrientDoses: dailyDoses,
      expectedComposition: { ...this.state.composition },
      estimatedYield_g: targetBiomass_g_L * this.config.volume_L,
      estimatedProtein_g: targetBiomass_g_L * this.config.volume_L * (this.state.composition.protein_pct / 100),
      confidence: Math.min(1, 1 / (1 + Math.abs(requiredMu - 0.8) * 2)) // Confianza basada en μ realista
    };
  }

  /** Diagnóstico completo */
  public diagnose(): BioreactorDiagnosis {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const riskFactors: BioreactorDiagnosis['riskFactors'] = [];
    
    // Estado crecimiento
    let growthStatus: BioreactorDiagnosis['growthStatus'] = 'optimal';
    let limitingFactor: BioreactorDiagnosis['limitingFactor'] = 'none';
    
    if (this.state.growthRate_per_day < 0.2) {
      growthStatus = 'crash';
      issues.push(`Crecimiento crítico: μ = ${this.state.growthRate_per_day.toFixed(2)} día⁻¹`);
    } else if (this.state.growthRate_per_day < 0.5) {
      growthStatus = 'inhibited';
      issues.push(`Crecimiento inhibido: μ = ${this.state.growthRate_per_day.toFixed(2)} día⁻¹`);
    } else if (this.state.growthRate_per_day < 0.8) {
      growthStatus = 'suboptimal';
    }
    
    // Factor limitante
    const factors = {
      light: this.calculateLightLimitation(),
      nitrogen: this.calculateNutrientLimitation('nitrogen'),
      phosphorus: this.calculateNutrientLimitation('phosphorus'),
      iron: this.calculateNutrientLimitation('iron'),
      carbon: this.calculateCarbonLimitation(),
      temperature: this.calculateTemperatureFactor(),
      pH: this.calculatePHFactor(),
      contamination: this.state.contamination.detected ? 0.3 : 1
    };
    
    limitingFactor = Object.entries(factors).reduce((a, b) => a[1] < b[1] ? a : b)[0] as BioreactorDiagnosis['limitingFactor'];
    
    // Recomendaciones por factor limitante
    const recs: Record<string, string[]> = {
      light: ['Aumentar intensidad LED', 'Extender fotoperíodo', 'Limpiar paneles/reactor'],
      nitrogen: ['Dosificar nitrato/urea', 'Verificar bomba N', 'Aumentar concentración medio'],
      phosphorus: ['Dosificar fosfato', 'Verificar bomba P'],
      iron: ['Dosificar Fe-EDTA', 'Verificar quelación', 'Revisar pH (precipitación Fe)'],
      carbon: ['Aumentar CO2 sparging', 'Añadir bicarbonato', 'Verificar difusión'],
      temperature: ['Activar calefacción/refrigeración', 'Verificar aislamiento'],
      pH: ['Ajustar CO2/bicarbonato', 'Calibrar sonda pH'],
      contamination: ['Microscopía urgente', 'qPCR identificativo', 'Considerar reinicio aséptico']
    };
    
    if (recs[limitingFactor]) recommendations.push(...recs[limitingFactor]);
    
    // Contaminación
    if (this.state.contamination.detected) {
      issues.push(`Contaminación: ${this.state.contamination.level} (${this.state.contamination.type || 'desconocido'})`);
      riskFactors.push({ factor: 'contamination', probability: 0.8, impact: 'high' });
    }
    
    // Nutrientes bajos
    if (this.state.nutrientLevels.nitrogen_mg_L < 20) {
      riskFactors.push({ factor: 'nitrogen_depletion', probability: 0.6, impact: 'medium' });
    }
    if (this.state.nutrientLevels.iron_ug_L < 500) {
      riskFactors.push({ factor: 'iron_limitation', probability: 0.5, impact: 'medium' });
    }
    
    // pH deriva
    if (this.state.pH < 9 || this.state.pH > 10.5) {
      riskFactors.push({ factor: 'pH_drift', probability: 0.4, impact: 'medium' });
    }
    
    // Predicción cosecha
    const targetOD = this.config.harvesting.targetConcentration_g_L * 0.5;
    let predictedHarvestDate = Date.now();
    if (this.state.growthRate_per_day > 0 && this.state.opticalDensity_750 < targetOD) {
      const daysToHarvest = Math.log(targetOD / this.state.opticalDensity_750) / this.state.growthRate_per_day;
      predictedHarvestDate = Date.now() + daysToHarvest * 86400000;
    }
    
    const predictedYield_g = this.config.harvesting.harvestVolume_L * this.config.harvesting.targetConcentration_g_L;
    
    return {
      healthy: growthStatus === 'optimal' && !this.state.contamination.detected,
      growthStatus,
      limitingFactor,
      issues,
      recommendations,
      predictedHarvestDate,
      predictedYield_g,
      riskFactors
    };
  }

  /** Obtiene resumen de estado para emisor */
  private getStateSummary(): object {
    return {
      reactorId: this.config.id,
      biomass_g_L: this.state.biomass_g_L,
      OD750: this.state.opticalDensity_750,
      growthRate: this.state.growthRate_per_day,
      pH: this.state.pH,
      temp_C: this.state.temperature_C,
      DO_mg_L: this.state.dissolvedO2_mg_L,
      status: this.state.operationalStatus,
      lightPhase: this.state.lightCycle.phase,
      contamination: this.state.contamination.detected
    };
  }

  /** Exporta estado completo */
  public exportState(): object {
    return {
      config: this.config,
      state: this.state,
      uptime_hours: this.state.uptime_hours,
      totalHarvests: this.state.harvestHistory.length,
      totalBiomassProduced_g: this.state.harvestHistory.reduce((a, h) => a + h.biomass_g, 0)
    };
  }

  /** Serializa para persistencia */
  public toJSON(): string {
    return JSON.stringify(this.exportState(), null, 2);
  }

  /** Limpieza */
  public destroy(): void {
    this.stopControl();
    this.removeAllListeners();
  }
}

/** Modelo de crecimiento para planificación */
class GrowthModel {
  private config: BioreactorConfig;
  
  constructor(config: BioreactorConfig) {
    this.config = config;
  }
  
  /** Predice biomasa en t días */
  predictBiomass(initial_g_L: number, days: number, conditions: 'optimal' | 'average' | 'poor'): number {
    const mu = { optimal: 1.0, average: 0.6, poor: 0.3 }[conditions];
    return initial_g_L * Math.exp(mu * days);
  }
  
  /** Calcula días para alcanzar biomasa objetivo */
  daysToTarget(initial_g_L: number, target_g_L: number, conditions: 'optimal' | 'average' | 'poor'): number {
    const mu = { optimal: 1.0, average: 0.6, poor: 0.3 }[conditions];
    return Math.log(target_g_L / initial_g_L) / mu;
  }
}

/** Factory: Configuración estándar Kit 72H (20L) */
export function createKit72HBioreactorConfig(id: string = 'kit72h_bio_1'): BioreactorConfig {
  return {
    id,
    name: 'Kit 72H Spirulina Bioreactor',
    volume_L: 20,
    geometry: 'bag',
    material: 'LDPE',
    dimensions: {
      length_m: 0.5,
      width_m: 0.4,
      height_m: 0.15,
      surfaceArea_m2: 0.2
    },
    lighting: {
      type: 'LED',
      spectrum: 'red_blue',
      intensity_umol_m2_s: 150,
      photoperiod_hours: 16,
      dawnDuskTransition_min: 30,
      ledChannels: { red_660nm: 70, blue_450nm: 30, white_6500K: 0, farRed_730nm: 0, uv_380nm: 0 },
      control: 'fixed'
    },
    mixing: {
      type: 'air_lift',
      rate_L_min: 5,
      dutyCycle: 'continuous',
      spargingRate_L_min: 2,
      gasComposition: { CO2_pct: 5, air_pct: 95, O2_pct: 0 }
    },
    temperatureControl: {
      type: 'passive',
      target_C: 30,
      tolerance_C: 5
    },
    harvesting: {
      method: 'sedimentation',
      frequency_hours: 72,
      targetConcentration_g_L: 1.0,
      harvestVolume_L: 5,
      retentionTime_hours: 24,
      flocculant: { type: 'chitosan', dose_mg_L: 10 }
    },
    nutrition: {
      nitrogenSource: 'NaNO3',
      phosphorusSource: 'K2HPO4',
      ironSource: 'Fe_EDTA',
      traceMetals: { Mn: 10, Zn: 2, Cu: 0.5, Co: 0.1, Mo: 0.1, B: 5 },
      carbonSource: 'bicarbonate',
      feedingStrategy: 'batch',
      targetN_P_Ratio: 16,
      targetC_N_Ratio: 6.25
    },
    monitoring: {
      sensors: ['bio_od_1', 'bio_temp_1', 'bio_do_1', 'bio_cond_1'],
      logInterval_seconds: 60,
      alertThresholds: {
        minOD750: 0.1,
        maxOD750: 2.0,
        minPH: 8.5,
        maxPH: 10.5,
        minTemp_C: 20,
        maxTemp_C: 38,
        minDO_mg_L: 3,
        maxContamination: 'medium'
      }
    },
    operation: {
      mode: 'autonomous',
      startupProtocol: ['fill_medium', 'inoculate', 'start_light', 'start_mixing', 'monitor_24h'],
      shutdownProtocol: ['stop_light', 'stop_mixing', 'harvest', 'clean', 'store'],
      emergencyProtocol: ['stop_all', 'sample', 'diagnose', 'decide'],
      maintenanceInterval_days: 30
    },
    metadata: { profile: 'kit72h_v2', version: '2.0' }
  };
}

/** Factory: Configuración producción estándar (200L) */
export function createProductionBioreactorConfig(id: string = 'bio_prod_1'): BioreactorConfig {
  const kit = createKit72HBioreactorConfig(id);
  return {
    ...kit,
    name: 'Production Spirulina Bioreactor 200L',
    volume_L: 200,
    geometry: 'raceway',
    material: 'PVC',
    dimensions: {
      length_m: 4,
      width_m: 2,
      height_m: 0.3,
      surfaceArea_m2: 8
    },
    lighting: {
      ...kit.lighting,
      type: 'solar',
      spectrum: 'full',
      intensity_umol_m2_s: 500, // Pico solar
      control: 'solar_tracking'
    },
    mixing: {
      ...kit.mixing,
      type: 'paddle',
      rate_L_min: 500,
      dutyCycle: 'continuous'
    },
    temperatureControl: {
      type: 'heat_exchanger',
      target_C: 32,
      tolerance_C: 3,
      heatExchangerArea_m2: 2
    },
    harvesting: {
      ...kit.harvesting,
      method: 'centrifuge',
      frequency_hours: 48,
      targetConcentration_g_L: 1.5,
      harvestVolume_L: 50
    },
    monitoring: {
      ...kit.monitoring,
      sensors: ['bio_od_1', 'bio_temp_1', 'bio_do_1', 'bio_cond_1', 'bio_ph_1', 'bio_orp_1'],
      alertThresholds: {
        ...kit.monitoring.alertThresholds,
        minTemp_C: 25,
        maxTemp_C: 37
      }
    },
    metadata: { profile: 'production_200L', version: '2.0' }
  };
}

/** Instancia singleton global */
let globalBioreactors: Map<string, SpirulinaBioreactor> = new Map();

export function getBioreactor(id: string): SpirulinaBioreactor | undefined {
  return globalBioreactors.get(id);
}

export function createBioreactor(config: BioreactorConfig): SpirulinaBioreactor {
  const reactor = new SpirulinaBioreactor(config);
  globalBioreactors.set(config.id, reactor);
  return reactor;
}

export function removeBioreactor(id: string): boolean {
  const reactor = globalBioreactors.get(id);
  if (reactor) {
    reactor.destroy();
    return globalBioreactors.delete(id);
  }
  return false;
}

export function getAllBioreactors(): SpirulinaBioreactor[] {
  return Array.from(globalBioreactors.values());
}