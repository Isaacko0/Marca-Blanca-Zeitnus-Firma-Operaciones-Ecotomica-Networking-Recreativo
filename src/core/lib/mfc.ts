// src/core/lib/mfc.ts
// MFC (Microbial Fuel Cell) Core Module — HSCSG P0
// Implementación basada en obra Gilberto Esparza (Plantas Nómadas, Autofotosíntesis)
// EBD: ESP-D1, ESP-D2, ESP-D3, ESP-D10, ESP-D11, ESP-D15

import { EventEmitter } from 'events';

/** Material del electrodo — afecta densidad corriente, costo, durabilidad */
export type ElectrodeMaterial = 'graphite' | 'carbon_cloth' | 'carbon_brush' | 'carbon_felt' | 'stainless_steel';

/** Tipo de membrana — afecta resistencia interna, crossover, costo */
export type MembraneType = 'nafion_117' | 'nafion_115' | 'ceramic' | 'none' | 'custom';

/** Fuente de inóculo — determina cepas, robustez, costo */
export type InoculumSource = 'river_sludge' | 'wastewater_sludge' | 'compost' | 'pure_culture' | 'commercial' | 'reserve_culture';

/** Sustrato alimentado al MFC */
export type SubstrateType = 'acetate' | 'wastewater' | 'spirulina_lysate' | 'glucose' | 'river_water' | 'urine' | 'organic_waste';

/** Estado de salud del MFC */
export type MFCHealth = 'starting' | 'active' | 'degrading' | 'dead' | 'reinoculating' | 'recovering';

/** Configuración completa del MFC */
export interface MFCConfig {
  id: string;
  name: string;
  electrodeMaterial: ElectrodeMaterial;
  electrodeArea_cm2: number;          // Área geométrica ánodo (cm²)
  membraneType: MembraneType;
  anodeCathodeDistance_cm: number;    // Distancia electrodos (cm)
  externalResistance_ohm: number;     // Resistencia externa fija (Ω)
  inoculumSource: InoculumSource;
  inoculumVolume_ml: number;          // Volumen inóculo inicial (mL)
  containerVolume_ml: number;         // Volumen cámara anódica (mL)
  operatingTemperature_C: number;     // Temperatura objetivo (°C)
  phTarget: number;                   // pH objetivo cámara anódica
  feedingInterval_hours: number;      // Intervalo alimentación (horas)
  substrateConcentration_mM: number;  // Concentración sustrato (mM)
  dataLogInterval_seconds: number;    // Intervalo logging (segundos)
}

/** Estado dinámico del MFC */
export interface MFCState {
  voltage_V: number;                  // Voltaje medido (V)
  current_mA: number;                 // Corriente (mA)
  power_mW: number;                   // Potencia instantánea (mW)
  powerDensity_mW_m2: number;         // Densidad potencia (mW/m² electrodo)
  coulombicEfficiency: number;        // Eficiencia coulombica (0-1)
  internalResistance_ohm: number;     // Resistencia interna (Ω)
  health: MFCHealth;
  lastFeeding: number;                // Timestamp última alimentación (ms)
  feedingCount: number;               // Total alimentaciones
  totalCharge_C: number;              // Carga total extraída (C)
  totalEnergy_J: number;              // Energía total extraída (J)
  uptime_hours: number;               // Horas funcionando
  inoculumAge_days: number;           // Edad inóculo (días)
  lastMaintenance: number;            // Timestamp último mantenimiento
  errorCount: number;                 // Contador errores sensores/comunicación
  metadata: Record<string, unknown>;  // Datos adicionales
}

/** Medición individual con timestamp */
export interface MFCMeasurement {
  timestamp: number;
  voltage_V: number;
  current_mA: number;
  power_mW: number;
  temperature_C?: number;
  ph?: number;
  orp_mV?: number;
  quality: 'excellent' | 'good' | 'degraded' | 'failed';
}

/** Diagnóstico de estado */
export interface MFCDiagnosis {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
  predictedLifetime_hours: number;
  criticalParameters: {
    voltage: boolean;
    internalResistance: boolean;
    coulombicEfficiency: boolean;
    temperature: boolean;
    ph: boolean;
  };
}

/** Métricas entrópicas para ξ (Entropic Auditor) */
export interface EntropicMetrics {
  voltage_V: number;
  current_mA: number;
  power_mW: number;
  powerDensity_mW_m2: number;
  coulombicEfficiency: number;
  entropyProductionRate_J_K_s: number;  // J/K/s — tasa producción entropía
  xiContribution: number;               // Contribución a ξ global (0-1)
  thermodynamicEfficiency: number;      // Eficiencia termodinámica (0-1)
  exergyDestructionRate: number;        // Tasa destrucción exergía (W)
}

/** Preparación de inóculo para MFC */
export interface InoculumPreparation {
  strainIds: string[];
  totalVolume_ml: number;
  estimatedCellCount: number;
  viabilityPct: number;
  recommendedMFCIds: string[];
  preparationTimestamp: number;
  notes: string;
}

/** Clase principal MFC — encapsula lógica completa */
export class MFCModule extends EventEmitter {
  public readonly config: MFCConfig;
  public state: MFCState;
  private measurementHistory: MFCMeasurement[] = [];
  private maxHistoryLength = 10000;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private startTime: number;

  constructor(config: MFCConfig) {
    super();
    this.config = { ...config };
    this.startTime = Date.now();
    this.state = this.initializeState();
  }

  /** Inicializa estado por defecto */
  private initializeState(): MFCState {
    return {
      voltage_V: 0,
      current_mA: 0,
      power_mW: 0,
      powerDensity_mW_m2: 0,
      coulombicEfficiency: 0,
      internalResistance_ohm: this.config.externalResistance_ohm * 10, // Estimación inicial
      health: 'starting',
      lastFeeding: 0,
      feedingCount: 0,
      totalCharge_C: 0,
      totalEnergy_J: 0,
      uptime_hours: 0,
      inoculumAge_days: 0,
      lastMaintenance: Date.now(),
      errorCount: 0,
      metadata: {}
    };
  }

  /** Inicia monitoreo continuo */
  public startMonitoring(): void {
    if (this.monitoringInterval) return;
    
    this.monitoringInterval = setInterval(() => {
      this.tick();
    }, this.config.dataLogInterval_seconds * 1000);
    
    this.emit('monitoring:started', { mfcId: this.config.id });
  }

  /** Detiene monitoreo */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.emit('monitoring:stopped', { mfcId: this.config.id });
    }
  }

  /** Ciclo principal — llamado por monitoring interval */
  private async tick(): Promise<void> {
    try {
      const measurement = await this.measure();
      this.updateState(measurement);
      this.checkHealth();
      this.emit('measurement', measurement);
    } catch (error) {
      this.state.errorCount++;
      this.emit('error', { mfcId: this.config.id, error });
    }
  }

  /** Realiza medición completa — en producción llama a bridge.ts GPIO */
  public async measure(): Promise<MFCMeasurement> {
    // TODO: Implementar lectura real via bridge.ts (ADS1115, pH, ORP, temp)
    // Por ahora simulación realista para desarrollo
    const voltage = this.simulateVoltage();
    const current = voltage / (this.state.internalResistance_ohm / 1000); // mA
    const power = voltage * current; // mW
    
    const measurement: MFCMeasurement = {
      timestamp: Date.now(),
      voltage_V: voltage,
      current_mA: current,
      power_mW: power,
      quality: voltage > 0.1 ? 'good' : voltage > 0.01 ? 'degraded' : 'failed'
    };
    
    this.measurementHistory.push(measurement);
    if (this.measurementHistory.length > this.maxHistoryLength) {
      this.measurementHistory.shift();
    }
    
    return measurement;
  }

  /** Simulación realista de voltaje basada en estado */
  private simulateVoltage(): number {
    const baseVoltage = this.getBaseVoltageByHealth();
    const noise = (Math.random() - 0.5) * 0.02; // ±10mV ruido
    const feedingBoost = this.getFeedingBoost();
    const degradation = this.getDegradationFactor();
    
    return Math.max(0, baseVoltage * feedingBoost * degradation + noise);
  }

  private getBaseVoltageByHealth(): number {
    switch (this.state.health) {
      case 'starting': return 0.05 + Math.random() * 0.1;
      case 'active': return 0.3 + Math.random() * 0.3; // 0.3-0.6V típico
      case 'degrading': return 0.1 + Math.random() * 0.2;
      case 'dead': return Math.random() * 0.05;
      case 'reinoculating': return 0.01 + Math.random() * 0.05;
      case 'recovering': return 0.15 + Math.random() * 0.15;
      default: return 0;
    }
  }

  private getFeedingBoost(): number {
    const hoursSinceFeeding = (Date.now() - this.state.lastFeeding) / 3600000;
    if (hoursSinceFeeding < 1) return 1.2; // Pico post-alimentación
    if (hoursSinceFeeding < 6) return 1.05;
    if (hoursSinceFeeding > this.config.feedingInterval_hours * 1.5) return 0.7; // Hambriento
    return 1.0;
  }

  private getDegradationFactor(): number {
    if (this.state.uptime_hours < 24) return 1.0;
    if (this.state.uptime_hours < 168) return 0.98; // Primera semana
    if (this.state.uptime_hours < 720) return 0.9;  // Primer mes
    return 0.7; // Degradación larga duración
  }

  /** Actualiza estado interno con nueva medición */
  private updateState(measurement: MFCMeasurement): void {
    this.state.voltage_V = measurement.voltage_V;
    this.state.current_mA = measurement.current_mA;
    this.state.power_mW = measurement.power_mW;
    this.state.powerDensity_mW_m2 = (measurement.power_mW / this.config.electrodeArea_cm2) * 10000; // mW/m²
    this.state.uptime_hours = (Date.now() - this.startTime) / 3600000;
    this.state.inoculumAge_days = this.state.uptime_hours / 24;
    
    // Calcular resistencia interna dinámica
    if (measurement.current_mA > 0.01) {
      this.state.internalResistance_ohm = (measurement.voltage_V / measurement.current_mA) * 1000;
    }
    
    // Eficiencia coulombica (simplificada)
    const theoreticalMaxCurrent = this.estimateTheoreticalCurrent();
    this.state.coulombicEfficiency = theoreticalMaxCurrent > 0 
      ? Math.min(1, measurement.current_mA / theoreticalMaxCurrent) 
      : 0;
    
    // Acumular carga y energía
    const dt_hours = this.config.dataLogInterval_seconds / 3600;
    this.state.totalCharge_C += measurement.current_mA * dt_hours * 3.6; // mA*h → C
    this.state.totalEnergy_J += measurement.power_mW * dt_hours * 3.6; // mW*h → J
  }

  /** Estima corriente teórica máxima basada en sustrato */
  private estimateTheoreticalCurrent(): number {
    // Basado en: 1 mol e- = 96485 C, sustrato → e- según estequiometría
    // Acetato: CH3COO- + 2H2O → 2CO2 + 7H+ + 8e-
    const substrateMolarMass = 59; // acetato g/mol
    const electronsPerMole = 8;
    const faraday = 96485; // C/mol
    
    const substrateMolesPerHour = (this.config.substrateConcentration_mM / 1000) * 
                                  (this.config.containerVolume_ml / 1000) * 
                                  (3600 / this.config.feedingInterval_hours);
    
    return (substrateMolesPerHour * electronsPerMole * faraday) / 3600 * 1000; // mA
  }

  /** Verifica salud y actualiza estado */
  private checkHealth(): void {
    const prevHealth = this.state.health;
    
    if (this.state.voltage_V < 0.02 && this.state.uptime_hours > 24) {
      this.state.health = 'dead';
    } else if (this.state.voltage_V < 0.1 && this.state.uptime_hours > 48) {
      this.state.health = 'degrading';
    } else if (this.state.voltage_V > 0.25 && this.state.coulombicEfficiency > 0.3) {
      this.state.health = 'active';
    } else if (this.state.uptime_hours < 24) {
      this.state.health = 'starting';
    }
    
    if (prevHealth !== this.state.health) {
      this.emit('health:changed', { 
        mfcId: this.config.id, 
        from: prevHealth, 
        to: this.state.health 
      });
    }
  }

  /** Alimenta el MFC con sustrato */
  public async feed(substrate: SubstrateType, volume_ml?: number): Promise<void> {
    this.state.lastFeeding = Date.now();
    this.state.feedingCount++;
    this.state.metadata.lastSubstrate = substrate;
    this.state.metadata.lastFeedVolume = volume_ml || this.config.containerVolume_ml * 0.1;
    
    // En producción: llamar bridge.ts → bomba peristáltica
    this.emit('feeding', { 
      mfcId: this.config.id, 
      substrate, 
      volume_ml: volume_ml || this.config.containerVolume_ml * 0.1 
    });
  }

  /** Re-inocula el MFC (mitosis física) */
  public async reinoculate(source: InoculumSource, volume_ml: number, strainIds?: string[]): Promise<void> {
    const prevHealth = this.state.health;
    this.state.health = 'reinoculating';
    this.state.inoculumAge_days = 0;
    this.state.metadata.reinoculationSource = source;
    this.state.metadata.reinoculationVolume = volume_ml;
    this.state.metadata.reinoculationStrains = strainIds || [];
    this.state.metadata.reinoculationTimestamp = Date.now();
    
    // En producción: bridge.ts → bomba peristáltica + reservorio inóculo
    this.emit('reinoculation', { 
      mfcId: this.config.id, 
      source, 
      volume_ml, 
      strainIds 
    });
    
    // Simular recuperación
    setTimeout(() => {
      this.state.health = 'recovering';
      this.emit('health:changed', { mfcId: this.config.id, from: 'reinoculating', to: 'recovering' });
    }, 2000);
  }

  /** Diagnóstico completo */
  public diagnose(): MFCDiagnosis {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    const critical = {
      voltage: this.state.voltage_V > 0.2,
      internalResistance: this.state.internalResistance_ohm < this.config.externalResistance_ohm * 5,
      coulombicEfficiency: this.state.coulombicEfficiency > 0.3,
      temperature: true, // TODO: leer sensor real
      ph: true // TODO: leer sensor real
    };
    
    if (!critical.voltage) {
      issues.push(`Voltaje bajo: ${this.state.voltage_V.toFixed(3)}V`);
      recommendations.push('Verificar inóculo, sustrato, conexiones eléctricas');
    }
    if (!critical.internalResistance) {
      issues.push(`Resistencia interna alta: ${this.state.internalResistance_ohm.toFixed(0)}Ω`);
      recommendations.push('Reducir distancia electrodos, verificar membrana, limpiar electrodos');
    }
    if (!critical.coulombicEfficiency) {
      issues.push(`Eficiencia coulombica baja: ${(this.state.coulombicEfficiency * 100).toFixed(1)}%`);
      recommendations.push('Verificar contaminación, sustrato adecuado, condiciones anaerobias');
    }
    
    // Predicción vida útil basada en degradación
    let predictedLifetime = 0;
    if (this.state.health === 'active') {
      predictedLifetime = 720 - this.state.uptime_hours; // ~1 mes base
    } else if (this.state.health === 'degrading') {
      predictedLifetime = 168; // ~1 semana
    } else if (this.state.health === 'recovering') {
      predictedLifetime = 336; // ~2 semanas
    }
    
    return {
      healthy: Object.values(critical).every(v => v),
      issues,
      recommendations,
      predictedLifetime_hours: Math.max(0, predictedLifetime),
      criticalParameters: critical
    };
  }

  /** Obtiene métricas entrópicas para Entropic Auditor (ξ) */
  public getEntropicMetrics(): EntropicMetrics {
    const voltage = this.state.voltage_V;
    const current = this.state.current_mA;
    const power = this.state.power_mW;
    const powerDensity = this.state.powerDensity_mW_m2;
    const ce = this.state.coulombicEfficiency;
    
    // Tasa producción entropía: σ = J·∇(1/T) + Σ (μ_i/T)·J_i
    // Simplificado: σ ≈ P/T (potencia / temperatura absoluta)
    const tempK = this.config.operatingTemperature_C + 273.15;
    const entropyProductionRate = power / 1000 / tempK; // W/K = J/K/s
    
    // Contribución a ξ: normalizada vs máximo teórico
    const maxPowerDensity = 1000; // mW/m² techo práctico MFC
    const xiContribution = Math.min(1, powerDensity / maxPowerDensity) * ce;
    
    // Eficiencia termodinámica: ΔG/ΔH del sustrato
    const thermodynamicEfficiency = ce * 0.8; // Factor corrección pérdidas
    
    // Destrucción exergía: T0 * σ
    const T0 = 298.15; // Temperatura ambiente estándar (K)
    const exergyDestructionRate = T0 * entropyProductionRate; // W
    
    return {
      voltage_V: voltage,
      current_mA: current,
      power_mW: power,
      powerDensity_mW_m2: powerDensity,
      coulombicEfficiency: ce,
      entropyProductionRate_J_K_s: entropyProductionRate,
      xiContribution,
      thermodynamicEfficiency,
      exergyDestructionRate
    };
  }

  /** Obtiene historial de mediciones */
  public getHistory(limit?: number): MFCMeasurement[] {
    return limit ? this.measurementHistory.slice(-limit) : [...this.measurementHistory];
  }

  /** Exporta estado completo para persistencia */
  public exportState(): object {
    return {
      config: this.config,
      state: this.state,
      measurementCount: this.measurementHistory.length,
      lastMeasurement: this.measurementHistory[this.measurementHistory.length - 1] || null
    };
  }

  /** Limpieza al destruir */
  public destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
  }
}

/** Factory para crear MFCs estándar HSCSG */
export function createStandardMFC(id: string, name: string, variant: 'minimal' | 'standard' | 'research' = 'standard'): MFCModule {
  const configs: Record<string, Partial<MFCConfig>> = {
    minimal: {
      electrodeMaterial: 'graphite',
      electrodeArea_cm2: 25,
      membraneType: 'ceramic',
      anodeCathodeDistance_cm: 2,
      externalResistance_ohm: 1000,
      inoculumSource: 'river_sludge',
      inoculumVolume_ml: 100,
      containerVolume_ml: 500,
      operatingTemperature_C: 25,
      phTarget: 7.0,
      feedingInterval_hours: 24,
      substrateConcentration_mM: 20,
      dataLogInterval_seconds: 60
    },
    standard: {
      electrodeMaterial: 'graphite',
      electrodeArea_cm2: 50,
      membraneType: 'nafion_117',
      anodeCathodeDistance_cm: 1.5,
      externalResistance_ohm: 470,
      inoculumSource: 'river_sludge',
      inoculumVolume_ml: 200,
      containerVolume_ml: 1000,
      operatingTemperature_C: 30,
      phTarget: 7.0,
      feedingInterval_hours: 12,
      substrateConcentration_mM: 30,
      dataLogInterval_seconds: 30
    },
    research: {
      electrodeMaterial: 'carbon_cloth',
      electrodeArea_cm2: 100,
      membraneType: 'nafion_115',
      anodeCathodeDistance_cm: 1,
      externalResistance_ohm: 220,
      inoculumSource: 'pure_culture',
      inoculumVolume_ml: 500,
      containerVolume_ml: 2000,
      operatingTemperature_C: 35,
      phTarget: 7.2,
      feedingInterval_hours: 6,
      substrateConcentration_mM: 50,
      dataLogInterval_seconds: 10
    }
  };
  
  const config: MFCConfig = {
    id,
    name,
    ...configs[variant]
  } as MFCConfig;
  
  return new MFCModule(config);
}

/** Configuración por defecto para Kit 72H v2.0 (€30 mínima) */
export const KIT72H_MFC_CONFIG: Partial<MFCConfig> = {
  electrodeMaterial: 'graphite',
  electrodeArea_cm2: 20,      // 4 barras 10x1x0.5cm en paralelo
  membraneType: 'nafion_117',
  anodeCathodeDistance_cm: 2,
  externalResistance_ohm: 1000,
  inoculumSource: 'river_sludge',
  inoculumVolume_ml: 100,
  containerVolume_ml: 5000,   // Botella PET 5L
  operatingTemperature_C: 25,
  phTarget: 7.0,
  feedingInterval_hours: 24,
  substrateConcentration_mM: 10,
  dataLogInterval_seconds: 60
};