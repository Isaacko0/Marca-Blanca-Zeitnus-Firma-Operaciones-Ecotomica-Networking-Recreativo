// src/core/lib/svd.ts
// SVD v2 — Sensores Químicos/Físicos Reales para Entropic Auditor (ξ)
// Extensión crítica para medición de terreno — EBD: ESP-D4, ESP-D10, ESP-D11
// Hardware soportado: pH, ORP, Voltaje (ADS1115), Temp (DS18B20), DO, OD, Conductividad, GPS, IMU

import { EventEmitter } from 'events';

/** Tipos de sensores soportados */
export type SensorType = 
  | 'pH' 
  | 'ORP' 
  | 'voltage' 
  | 'temperature' 
  | 'dissolvedOxygen' 
  | 'opticalDensity' 
  | 'conductivity' 
  | 'flowRate' 
  | 'ambientLight' 
  | 'humidity' 
  | 'atmosphericPressure' 
  | 'GPS' 
  | 'IMU';

/** Estado de calibración */
export type CalibrationStatus = 'valid' | 'expired' | 'unknown' | 'failed' | 'pending';

/** Configuración individual de sensor */
export interface SensorConfig {
  type: SensorType;
  id: string;
  name: string;
  enabled: boolean;
  
  // Hardware específico
  hardware: {
    model: string;
    interface: 'I2C' | 'SPI' | 'UART' | 'ADC' | 'GPIO' | 'USB' | 'BLE';
    address?: string;           // I2C address (ej. "0x48")
    pin?: number;               // GPIO pin
    channel?: number;           // ADC channel
    uartPort?: string;          // /dev/ttyUSB0
  };
  
  // Calibración
  calibration: {
    status: CalibrationStatus;
    lastCalibration: number;    // timestamp
    nextCalibrationDue: number; // timestamp
    parameters: Record<string, number>; // slope, offset, etc.
    referenceValues: number[];  // Valores de referencia usados
  };
  
  // Rangos
  range: {
    min: number;
    max: number;
    units: string;
    precision: number;          // Decimales significativos
  };
  
  // Filtros
  filtering: {
    enabled: boolean;
    type: 'moving_average' | 'kalman' | 'median' | 'none';
    windowSize: number;         // Muestras para media móvil
    outlierRejection: boolean;
    outlierThreshold: number;   // Desviaciones estándar
  };
  
  // Alarmas
  alarms: {
    enabled: boolean;
    min?: number;
    max?: number;
    rateOfChange?: number;      // Max cambio por segundo
  };
  
  // Metadatos
  location?: string;            // "MFC_1_anode" | "bioreactor_1" | "ambient"
  tags: string[];
  metadata: Record<string, unknown>;
}

/** Lectura individual de sensor */
export interface SensorReading {
  sensorId: string;
  sensorType: SensorType;
  timestamp: number;
  value: number;
  rawValue: number;             // Valor sin procesar
  units: string;
  quality: 'excellent' | 'good' | 'degraded' | 'failed';
  metadata: {
    temperature_C?: number;     // Temperatura compensación
    signalStrength?: number;    // RSSI, SNR, etc.
    calibrationApplied: boolean;
    filterApplied: boolean;
    flags: string[];            // "overrange", "underrange", "drift", "noise"
  };
}

/** Lectura completa del array SVD */
export interface SVDReading {
  timestamp: number;
  sensors: Record<string, SensorReading>;
  quality: 'excellent' | 'good' | 'degraded' | 'failed';
  metadata: {
    sensorUptime_hours: number;
    calibrationStatus: Record<string, CalibrationStatus>;
    environmentalConditions: {
      temperature_C: number;
      humidity_pct: number;
      light_lux: number;
      pressure_hPa: number;
    };
    systemHealth: {
      cpuTemp_C?: number;
      memoryUsage_pct?: number;
      diskUsage_pct?: number;
      networkLatency_ms?: number;
    };
  };
}

/** Diagnóstico de salud de sensores */
export interface SensorHealthReport {
  overallHealth: 'healthy' | 'degraded' | 'critical' | 'unknown';
  sensors: Record<string, {
    health: 'healthy' | 'degraded' | 'failed' | 'unknown';
    issues: string[];
    lastReading: SensorReading | null;
    driftDetected: boolean;
    noiseLevel: number;
    calibrationDue: boolean;
    uptime_hours: number;
  }>;
  recommendations: string[];
  criticalFailures: string[];
}

/** Configuración completa del array SVD */
export interface SVDArrayConfig {
  sensors: SensorConfig[];
  samplingRate_hz: number;          // Frecuencia muestreo global (Hz)
  syncTolerance_ms: number;         // Tolerancia sincronización timestamps
  bufferSize: number;               // Tamaño buffer circular
  enableFusion: boolean;            // Fusionar lecturas relacionadas
  metadata: Record<string, unknown>;
}

/** Datos GPS */
export interface GPSData {
  latitude: number;
  longitude: number;
  altitude_m: number;
  accuracy_m: number;
  speed_m_s: number;
  heading_deg: number;
  satellites: number;
  fixQuality: 'none' | 'gps' | 'dgps' | 'rtk' | 'float_rtk';
  timestamp: number;
}

/** Datos IMU */
export interface IMUData {
  acceleration: { x: number; y: number; z: number }; // m/s²
  gyroscope: { x: number; y: number; z: number };    // rad/s
  magnetometer: { x: number; y: number; z: number }; // µT
  orientation: { roll: number; pitch: number; yaw: number }; // rad
  temperature_C: number;
  timestamp: number;
}

/** Clase principal del array SVD */
export class SVDArray extends EventEmitter {
  private config: SVDArrayConfig;
  private sensors: Map<string, SensorConfig> = new Map();
  private readingBuffer: SVDReading[] = [];
  private maxBufferSize: number;
  private samplingInterval: NodeJS.Timeout | null = null;
  private lastReadings: Map<string, SensorReading> = new Map();
  private sensorUptime: Map<string, number> = new Map();
  private startTime: number;
  private driftDetector: Map<string, number[]> = new Map(); // Historial para detección deriva

  constructor(config: SVDArrayConfig) {
    super();
    this.config = config;
    this.maxBufferSize = config.bufferSize;
    this.startTime = Date.now();
    
    // Registrar sensores
    for (const sensor of config.sensors) {
      this.sensors.set(sensor.id, sensor);
      this.sensorUptime.set(sensor.id, 0);
      this.driftDetector.set(sensor.id, []);
    }
  }

  /** Inicia muestreo continuo */
  public startSampling(): void {
    if (this.samplingInterval) return;
    
    const intervalMs = 1000 / this.config.samplingRate_hz;
    this.samplingInterval = setInterval(() => {
      this.sampleAll();
    }, intervalMs);
    
    this.emit('sampling:started', { rate: this.config.samplingRate_hz });
  }

  /** Detiene muestreo */
  public stopSampling(): void {
    if (this.samplingInterval) {
      clearInterval(this.samplingInterval);
      this.samplingInterval = null;
      this.emit('sampling:stopped');
    }
  }

  /** Muestrea todos los sensores habilitados */
  private async sampleAll(): Promise<void> {
    const readings: Record<string, SensorReading> = {};
    const timestamp = Date.now();
    
    for (const [id, sensor] of this.sensors) {
      if (!sensor.enabled) continue;
      
      try {
        const reading = await this.readSensor(sensor);
        readings[id] = reading;
        this.lastReadings.set(id, reading);
        this.sensorUptime.set(id, (this.sensorUptime.get(id) || 0) + (1000 / this.config.samplingRate_hz) / 3600);
        
        // Detectar deriva
        this.checkDrift(id, reading);
        
      } catch (error) {
        readings[id] = this.createFailedReading(id, sensor.type, error);
        this.emit('sensor:error', { sensorId: id, error });
      }
    }
    
    // Construir lectura completa
    const svdReading: SVDReading = {
      timestamp,
      sensors: readings,
      quality: this.assessOverallQuality(readings),
      metadata: this.buildMetadata(readings)
    };
    
    // Buffer circular
    this.readingBuffer.push(svdReading);
    if (this.readingBuffer.length > this.maxBufferSize) {
      this.readingBuffer.shift();
    }
    
    this.emit('reading', svdReading);
  }

  /** Lee sensor individual — EN PRODUCCIÓN: bridge.ts → GPIO/I2C/SPI */
  private async readSensor(sensor: SensorConfig): Promise<SensorReading> {
    // TODO: Implementar drivers reales por tipo de sensor
    // Por ahora simulación realista para desarrollo
    
    const simulatedValue = this.simulateSensorValue(sensor);
    const rawValue = simulatedValue + (Math.random() - 0.5) * sensor.range.precision * 2;
    
    // Aplicar calibración
    const calibratedValue = this.applyCalibration(sensor, simulatedValue);
    
    // Aplicar filtro
    const filteredValue = this.applyFilter(sensor, calibratedValue);
    
    // Verificar alarmas
    const flags = this.checkAlarms(sensor, filteredValue);
    
    const quality = this.assessReadingQuality(sensor, filteredValue, flags);
    
    return {
      sensorId: sensor.id,
      sensorType: sensor.type,
      timestamp: Date.now(),
      value: filteredValue,
      rawValue,
      units: sensor.range.units,
      quality,
      metadata: {
        calibrationApplied: sensor.calibration.status === 'valid',
        filterApplied: sensor.filtering.enabled,
        flags
      }
    };
  }

  /** Simula valor realista por tipo de sensor */
  private simulateSensorValue(sensor: SensorConfig): number {
    const now = Date.now();
    const hour = (now / 3600000) % 24;
    const dayCycle = Math.sin((hour - 6) * Math.PI / 12); // Ciclo diurno
    
    switch (sensor.type) {
      case 'pH':
        // pH 6.5-8.5 típico MFC/biorreactor
        return 7.2 + dayCycle * 0.3 + (Math.random() - 0.5) * 0.1;
      
      case 'ORP':
        // ORP -200 a +200 mV anaerobio
        return -100 + dayCycle * 50 + (Math.random() - 0.5) * 30;
      
      case 'voltage':
        // Voltaje MFC 0-0.6V
        return 0.3 + dayCycle * 0.1 + (Math.random() - 0.5) * 0.05;
      
      case 'temperature':
        // Temperatura 20-35°C
        return 28 + dayCycle * 3 + (Math.random() - 0.5) * 0.5;
      
      case 'dissolvedOxygen':
        // DO 0-15 mg/L (fotosíntesis día)
        return Math.max(0, 5 + dayCycle * 8 + (Math.random() - 0.5) * 2);
      
      case 'opticalDensity':
        // OD750 0-2.0 (crecimiento)
        return 0.5 + (now / 86400000 % 1) * 1.0 + (Math.random() - 0.5) * 0.05;
      
      case 'conductivity':
        // Conductividad 1-5 mS/cm
        return 2.5 + (Math.random() - 0.5) * 0.5;
      
      case 'flowRate':
        // Flujo 0-100 mL/min
        return 50 + (Math.random() - 0.5) * 10;
      
      case 'ambientLight':
        // Luz 0-100000 lux
        return Math.max(0, dayCycle * 50000 + (Math.random() - 0.5) * 10000);
      
      case 'humidity':
        // Humedad 30-90%
        return 60 + (Math.random() - 0.5) * 20;
      
      case 'atmosphericPressure':
        // Presión 1013 ± 20 hPa
        return 1013 + (Math.random() - 0.5) * 10;
      
      case 'GPS':
        // GPS fijo (simulado)
        return 0; // Retorna objeto GPSData separado
      
      case 'IMU':
        // IMU estático (simulado)
        return 0; // Retorna objeto IMUData separado
      
      default:
        return 0;
    }
  }

  /** Aplica calibración lineal: y = slope * x + offset */
  private applyCalibration(sensor: SensorConfig, value: number): number {
    const { slope = 1, offset = 0 } = sensor.calibration.parameters;
    return value * slope + offset;
  }

  /** Aplica filtro configurado */
  private applyFilter(sensor: SensorConfig, value: number): number {
    if (!sensor.filtering.enabled || sensor.filtering.type === 'none') return value;
    
    const history = this.driftDetector.get(sensor.id) || [];
    history.push(value);
    if (history.length > sensor.filtering.windowSize) history.shift();
    
    switch (sensor.filtering.type) {
      case 'moving_average':
        return history.reduce((a, b) => a + b, 0) / history.length;
      case 'median':
        return [...history].sort((a, b) => a - b)[Math.floor(history.length / 2)];
      case 'kalman':
        // Kalman simplificado
        const prev = history[history.length - 2] || value;
        return 0.7 * prev + 0.3 * value;
      default:
        return value;
    }
  }

  /** Verifica alarmas */
  private checkAlarms(sensor: SensorConfig, value: number): string[] {
    const flags: string[] = [];
    if (!sensor.alarms.enabled) return flags;
    
    if (sensor.alarms.min !== undefined && value < sensor.alarms.min) {
      flags.push('underrange');
    }
    if (sensor.alarms.max !== undefined && value > sensor.alarms.max) {
      flags.push('overrange');
    }
    // Rate of change requeriría lectura anterior
    return flags;
  }

  /** Evalúa calidad de lectura individual */
  private assessReadingQuality(sensor: SensorConfig, value: number, flags: string[]): 'excellent' | 'good' | 'degraded' | 'failed' {
    if (flags.includes('overrange') || flags.includes('underrange')) return 'degraded';
    if (sensor.calibration.status !== 'valid') return 'degraded';
    if (value < sensor.range.min || value > sensor.range.max) return 'degraded';
    return 'excellent';
  }

  /** Detecta deriva del sensor */
  private checkDrift(sensorId: string, reading: SensorReading): void {
    const history = this.driftDetector.get(sensorId) || [];
    if (history.length < 100) return; // Necesita historial
    
    // Regresión lineal simple en ventana reciente
    const recent = history.slice(-100);
    const n = recent.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = recent.reduce((a, b) => a + b, 0);
    const xySum = recent.reduce((a, b, i) => a + b * i, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const driftPerHour = slope * 3600 * this.config.samplingRate_hz;
    
    // Umbral deriva: >1% rango por hora
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      const range = sensor.range.max - sensor.range.min;
      if (Math.abs(driftPerHour) > range * 0.01) {
        this.emit('sensor:drift', { sensorId, driftPerHour, threshold: range * 0.01 });
      }
    }
  }

  /** Evalúa calidad general del array */
  private assessOverallQuality(readings: Record<string, SensorReading>): 'excellent' | 'good' | 'degraded' | 'failed' {
    const qualities = Object.values(readings).map(r => r.quality);
    const failed = qualities.filter(q => q === 'failed').length;
    const degraded = qualities.filter(q => q === 'degraded').length;
    const total = qualities.length;
    
    if (failed > total * 0.2) return 'failed';
    if (failed > 0 || degraded > total * 0.3) return 'degraded';
    if (degraded > 0) return 'good';
    return 'excellent';
  }

  /** Construye metadata ambiental */
  private buildMetadata(readings: Record<string, SensorReading>) {
    const tempReading = Object.values(readings).find(r => r.sensorType === 'temperature');
    const humidityReading = Object.values(readings).find(r => r.sensorType === 'humidity');
    const lightReading = Object.values(readings).find(r => r.sensorType === 'ambientLight');
    const pressureReading = Object.values(readings).find(r => r.sensorType === 'atmosphericPressure');
    
    const calibrationStatus: Record<string, CalibrationStatus> = {};
    for (const [id, sensor] of this.sensors) {
      calibrationStatus[id] = sensor.calibration.status;
    }
    
    return {
      sensorUptime_hours: Math.max(...Array.from(this.sensorUptime.values())),
      calibrationStatus,
      environmentalConditions: {
        temperature_C: tempReading?.value || 25,
        humidity_pct: humidityReading?.value || 50,
        light_lux: lightReading?.value || 0,
        pressure_hPa: pressureReading?.value || 1013
      },
      systemHealth: {
        // TODO: Leer de sistema real
        cpuTemp_C: 45,
        memoryUsage_pct: 40,
        diskUsage_pct: 20,
        networkLatency_ms: 10
      }
    };
  }

  /** Crea lectura fallida */
  private createFailedReading(sensorId: string, type: SensorType, error: unknown): SensorReading {
    return {
      sensorId,
      sensorType: type,
      timestamp: Date.now(),
      value: NaN,
      rawValue: NaN,
      units: '',
      quality: 'failed',
      metadata: {
        calibrationApplied: false,
        filterApplied: false,
        flags: ['error', String(error)]
      }
    };
  }

  // ==================== API PÚBLICA ====================

  /** Obtiene última lectura completa */
  public getLatestReading(): SVDReading | null {
    return this.readingBuffer[this.readingBuffer.length - 1] || null;
  }

  /** Obtiene historial */
  public getHistory(limit?: number): SVDReading[] {
    return limit ? this.readingBuffer.slice(-limit) : [...this.readingBuffer];
  }

  /** Obtiene última lectura de sensor específico */
  public getLastSensorReading(sensorId: string): SensorReading | undefined {
    return this.lastReadings.get(sensorId);
  }

  /** Obtiene configuración de sensor */
  public getSensorConfig(sensorId: string): SensorConfig | undefined {
    return this.sensors.get(sensorId);
  }

  /** Actualiza configuración de sensor */
  public updateSensorConfig(sensorId: string, updates: Partial<SensorConfig>): void {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) throw new Error(`Sensor no encontrado: ${sensorId}`);
    
    Object.assign(sensor, updates);
    this.emit('sensor:configUpdated', { sensorId, updates });
  }

  /** Calibra sensor con valor de referencia conocido */
  public calibrateSensor(sensorId: string, knownValue: number, referenceUnit: string = ''): boolean {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) throw new Error(`Sensor no encontrado: ${sensorId}`);
    
    const currentReading = this.lastReadings.get(sensorId);
    if (!currentReading || currentReading.quality === 'failed') {
      throw new Error(`No hay lectura válida para calibrar: ${sensorId}`);
    }
    
    // Calcular slope y offset (calibración 1-punto asume offset=0)
    const slope = knownValue / currentReading.rawValue;
    const offset = 0; // Para 2-puntos necesitaría otra referencia
    
    sensor.calibration = {
      ...sensor.calibration,
      status: 'valid',
      lastCalibration: Date.now(),
      nextCalibrationDue: Date.now() + 30 * 86400000, // 30 días
      parameters: { slope, offset },
      referenceValues: [knownValue]
    };
    
    this.emit('sensor:calibrated', { sensorId, slope, offset, knownValue });
    return true;
  }

  /** Calibración 2-puntos (más precisa) */
  public calibrateSensorTwoPoint(
    sensorId: string, 
    knownLow: number, 
    rawLow: number, 
    knownHigh: number, 
    rawHigh: number
  ): boolean {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) throw new Error(`Sensor no encontrado: ${sensorId}`);
    
    const slope = (knownHigh - knownLow) / (rawHigh - rawLow);
    const offset = knownLow - slope * rawLow;
    
    sensor.calibration = {
      ...sensor.calibration,
      status: 'valid',
      lastCalibration: Date.now(),
      nextCalibrationDue: Date.now() + 30 * 86400000,
      parameters: { slope, offset },
      referenceValues: [knownLow, knownHigh]
    };
    
    this.emit('sensor:calibrated', { sensorId, slope, offset, type: 'two-point' });
    return true;
  }

  /** Diagnóstico completo de salud */
  public diagnoseHealth(): SensorHealthReport {
    const sensors: SensorHealthReport['sensors'] = {};
    const recommendations: string[] = [];
    const criticalFailures: string[] = [];
    
    for (const [id, sensor] of this.sensors) {
      const lastReading = this.lastReadings.get(id);
      const uptime = this.sensorUptime.get(id) || 0;
      const history = this.driftDetector.get(id) || [];
      
      // Calcular ruido (desviación estándar últimas 100 lecturas)
      const recent = history.slice(-100);
      const noiseLevel = recent.length > 1 
        ? Math.sqrt(recent.reduce((a, b) => a + Math.pow(b - recent.reduce((x, y) => x + y, 0) / recent.length, 2), 0) / recent.length)
        : 0;
      
      // Detectar deriva
      let driftDetected = false;
      if (recent.length >= 50) {
        const n = recent.length;
        const xSum = (n * (n - 1)) / 2;
        const ySum = recent.reduce((a, b) => a + b, 0);
        const xySum = recent.reduce((a, b, i) => a + b * i, 0);
        const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;
        const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
        const driftPerHour = slope * 3600 * this.config.samplingRate_hz;
        const range = sensor.range.max - sensor.range.min;
        driftDetected = Math.abs(driftPerHour) > range * 0.01;
      }
      
      const calibrationDue = sensor.calibration.nextCalibrationDue < Date.now();
      
      let health: 'healthy' | 'degraded' | 'failed' | 'unknown' = 'unknown';
      const issues: string[] = [];
      
      if (!lastReading || lastReading.quality === 'failed') {
        health = 'failed';
        issues.push('Sin lecturas válidas');
        criticalFailures.push(`${sensor.name} (${id}): Fallo total`);
      } else if (lastReading.quality === 'degraded') {
        health = 'degraded';
        issues.push('Lecturas degradadas');
      } else if (driftDetected) {
        health = 'degraded';
        issues.push('Deriva detectada');
      } else if (calibrationDue) {
        health = 'degraded';
        issues.push('Calibración vencida');
      } else {
        health = 'healthy';
      }
      
      if (calibrationDue) recommendations.push(`Calibrar ${sensor.name} (${id})`);
      if (driftDetected) recommendations.push(`Investigar deriva en ${sensor.name} (${id})`);
      if (noiseLevel > (sensor.range.max - sensor.range.min) * 0.05) {
        recommendations.push(`Ruido alto en ${sensor.name} (${id}): ${noiseLevel.toFixed(4)}`);
      }
      
      sensors[id] = {
        health,
        issues,
        lastReading,
        driftDetected,
        noiseLevel,
        calibrationDue,
        uptime_hours: uptime
      };
    }
    
    // Salud general
    const healths = Object.values(sensors).map(s => s.health);
    let overallHealth: SensorHealthReport['overallHealth'] = 'healthy';
    if (healths.includes('failed')) overallHealth = 'critical';
    else if (healths.includes('degraded')) overallHealth = 'degraded';
    else if (healths.every(h => h === 'unknown')) overallHealth = 'unknown';
    
    return {
      overallHealth,
      sensors,
      recommendations,
      criticalFailures
    };
  }

  /** Exporta datos para Entropic Auditor (ξ) */
  public exportForEntropicAuditor(): object {
    const latest = this.getLatestReading();
    if (!latest) return { error: 'No hay lecturas disponibles' };
    
    const voltageReading = Object.values(latest.sensors).find(r => r.sensorType === 'voltage');
    const phReading = Object.values(latest.sensors).find(r => r.sensorType === 'pH');
    const orpReading = Object.values(latest.sensors).find(r => r.sensorType === 'ORP');
    const tempReading = Object.values(latest.sensors).find(r => r.sensorType === 'temperature');
    const odReading = Object.values(latest.sensors).find(r => r.sensorType === 'opticalDensity');
    const doReading = Object.values(latest.sensors).find(r => r.sensorType === 'dissolvedOxygen');
    const gpsReading = Object.values(latest.sensors).find(r => r.sensorType === 'GPS');
    const imuReading = Object.values(latest.sensors).find(r => r.sensorType === 'IMU');
    
    return {
      timestamp: latest.timestamp,
      voltage_V: voltageReading?.value || 0,
      voltage_quality: voltageReading?.quality || 'failed',
      ph: phReading?.value || 7,
      ph_quality: phReading?.quality || 'failed',
      orp_mV: orpReading?.value || 0,
      orp_quality: orpReading?.quality || 'failed',
      temperature_C: tempReading?.value || 25,
      temp_quality: tempReading?.quality || 'failed',
      opticalDensity_750: odReading?.value || 0,
      od_quality: odReading?.quality || 'failed',
      dissolvedOxygen_mg_L: doReading?.value || 0,
      do_quality: doReading?.quality || 'failed',
      gps: gpsReading ? { lat: 0, lng: 0, alt: 0 } : null, // TODO: extraer GPSData
      imu: imuReading ? { accel: {x:0,y:0,z:0}, gyro: {x:0,y:0,z:0} } : null, // TODO: extraer IMUData
      overallQuality: latest.quality,
      sensorUptime_hours: latest.metadata.sensorUptime_hours
    };
  }

  /** Serializa configuración */
  public toJSON(): string {
    return JSON.stringify({
      config: this.config,
      sensorCount: this.sensors.size,
      bufferSize: this.readingBuffer.length,
      startTime: this.startTime,
      exportedAt: Date.now()
    }, null, 2);
  }

  /** Limpieza */
  public destroy(): void {
    this.stopSampling();
    this.removeAllListeners();
  }
}

/** Factory: Configuración estándar HSCSG para Kit 72H v2.0 */
export function createKit72HSVDConfig(): SVDArrayConfig {
  const sensors: SensorConfig[] = [
    // Sensores críticos MFC (P0)
    {
      type: 'voltage',
      id: 'mfc_voltage_1',
      name: 'MFC Voltaje Principal',
      enabled: true,
      hardware: { model: 'ADS1115', interface: 'I2C', address: '0x48', channel: 0 },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [] },
      range: { min: 0, max: 1, units: 'V', precision: 0.001 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: 0.05, max: 0.8, rateOfChange: 0.1 },
      location: 'MFC_1',
      tags: ['mfc', 'critical', 'kit72h'],
      metadata: {}
    },
    {
      type: 'pH',
      id: 'mfc_ph_1',
      name: 'MFC pH Cámara Anódica',
      enabled: true,
      hardware: { model: 'pH-4502C', interface: 'ADC', pin: 34 }, // ESP32 ADC1_CH6
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: -5.7, offset: 21.3 }, referenceValues: [4.0, 7.0, 10.0] },
      range: { min: 0, max: 14, units: 'pH', precision: 0.01 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 5, outlierRejection: true, outlierThreshold: 2 },
      alarms: { enabled: true, min: 5.5, max: 8.5 },
      location: 'MFC_1_anode',
      tags: ['mfc', 'critical', 'kit72h', 'chemistry'],
      metadata: {}
    },
    {
      type: 'temperature',
      id: 'mfc_temp_1',
      name: 'MFC Temperatura',
      enabled: true,
      hardware: { model: 'DS18B20', interface: 'GPIO', pin: 4 }, // ESP32 GPIO4
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [0, 100] },
      range: { min: -10, max: 60, units: '°C', precision: 0.1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: 15, max: 40 },
      location: 'MFC_1',
      tags: ['mfc', 'critical', 'kit72h', 'thermal'],
      metadata: {}
    },
    // Sensores biorreactor Spirulina (P1)
    {
      type: 'opticalDensity',
      id: 'bio_od_1',
      name: 'Biorreactor OD750',
      enabled: true,
      hardware: { model: 'LED_680nm_PHOTODIODE', interface: 'ADC', pin: 35 },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [0, 1.0] },
      range: { min: 0, max: 3, units: 'OD750', precision: 0.001 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 5, outlierRejection: true, outlierThreshold: 2 },
      alarms: { enabled: true, min: 0.1, max: 2.5 },
      location: 'bioreactor_1',
      tags: ['bioreactor', 'spirulina', 'growth'],
      metadata: {}
    },
    {
      type: 'temperature',
      id: 'bio_temp_1',
      name: 'Biorreactor Temperatura',
      enabled: true,
      hardware: { model: 'DS18B20', interface: 'GPIO', pin: 5 },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [0, 100] },
      range: { min: -10, max: 60, units: '°C', precision: 0.1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: 20, max: 40 },
      location: 'bioreactor_1',
      tags: ['bioreactor', 'spirulina', 'thermal'],
      metadata: {}
    },
    // Sensores ambientales
    {
      type: 'ambientLight',
      id: 'amb_light_1',
      name: 'Luz Ambiente',
      enabled: true,
      hardware: { model: 'BH1750', interface: 'I2C', address: '0x23' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [] },
      range: { min: 0, max: 200000, units: 'lux', precision: 1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: false, outlierThreshold: 3 },
      alarms: { enabled: false },
      location: 'ambient',
      tags: ['ambient', 'light', 'photosynthesis'],
      metadata: {}
    },
    {
      type: 'GPS',
      id: 'gps_1',
      name: 'GPS Ubicación',
      enabled: true,
      hardware: { model: 'NEO-6M', interface: 'UART', uartPort: '/dev/ttyUSB0' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: {}, referenceValues: [] },
      range: { min: -90, max: 90, units: 'deg', precision: 0.000001 },
      filtering: { enabled: false, type: 'none', windowSize: 1, outlierRejection: false, outlierThreshold: 3 },
      alarms: { enabled: false },
      location: 'robot',
      tags: ['robot', 'navigation', 'kit72h'],
      metadata: {}
    }
  ];
  
  return {
    sensors,
    samplingRate_hz: 1,           // 1 Hz suficiente para procesos biológicos
    syncTolerance_ms: 100,
    bufferSize: 86400,            // 24h a 1 Hz
    enableFusion: true,
    metadata: { profile: 'kit72h_v2', version: '2.0' }
  };
}

/** Factory: Configuración completa investigación (higher rate, more sensors) */
export function createResearchSVDConfig(): SVDArrayConfig {
  const kitConfig = createKit72HSVDConfig();
  
  // Añadir sensores adicionales
  const additionalSensors: SensorConfig[] = [
    {
      type: 'ORP',
      id: 'mfc_orp_1',
      name: 'MFC ORP (Redox)',
      enabled: true,
      hardware: { model: 'ORP-4502C', interface: 'ADC', pin: 36 },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [220, 468] }, // mV vs Ag/AgCl
      range: { min: -500, max: 500, units: 'mV', precision: 1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: -300, max: 300 },
      location: 'MFC_1_anode',
      tags: ['mfc', 'chemistry', 'redox'],
      metadata: {}
    },
    {
      type: 'dissolvedOxygen',
      id: 'bio_do_1',
      name: 'Biorreactor Oxígeno Disuelto',
      enabled: true,
      hardware: { model: 'SensoLyt_OPTICAL', interface: 'UART', uartPort: '/dev/ttyUSB1' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [0, 100] }, // % saturación
      range: { min: 0, max: 20, units: 'mg/L', precision: 0.01 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: 2, max: 18 },
      location: 'bioreactor_1',
      tags: ['bioreactor', 'spirulina', 'photosynthesis'],
      metadata: {}
    },
    {
      type: 'conductivity',
      id: 'bio_cond_1',
      name: 'Biorreactor Conductividad',
      enabled: true,
      hardware: { model: 'EC_1.0', interface: 'ADC', pin: 39 },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [1413, 12880] }, // µS/cm
      range: { min: 0, max: 20000, units: 'µS/cm', precision: 1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: true, min: 500, max: 10000 },
      location: 'bioreactor_1',
      tags: ['bioreactor', 'nutrients', 'salinity'],
      metadata: {}
    },
    {
      type: 'IMU',
      id: 'imu_1',
      name: 'IMU Robot (Orientación/Movimiento)',
      enabled: true,
      hardware: { model: 'MPU6050', interface: 'I2C', address: '0x68' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: {}, referenceValues: [] },
      range: { min: -180, max: 180, units: 'deg', precision: 0.01 },
      filtering: { enabled: true, type: 'kalman', windowSize: 10, outlierRejection: true, outlierThreshold: 3 },
      alarms: { enabled: false },
      location: 'robot',
      tags: ['robot', 'navigation', 'orientation'],
      metadata: {}
    },
    {
      type: 'humidity',
      id: 'amb_hum_1',
      name: 'Humedad Ambiente',
      enabled: true,
      hardware: { model: 'SHT30', interface: 'I2C', address: '0x44' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [] },
      range: { min: 0, max: 100, units: '%', precision: 0.1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: false, outlierThreshold: 3 },
      alarms: { enabled: false },
      location: 'ambient',
      tags: ['ambient', 'humidity'],
      metadata: {}
    },
    {
      type: 'atmosphericPressure',
      id: 'amb_press_1',
      name: 'Presión Atmosférica',
      enabled: true,
      hardware: { model: 'BMP280', interface: 'I2C', address: '0x76' },
      calibration: { status: 'unknown', lastCalibration: 0, nextCalibrationDue: 0, parameters: { slope: 1, offset: 0 }, referenceValues: [] },
      range: { min: 800, max: 1200, units: 'hPa', precision: 0.1 },
      filtering: { enabled: true, type: 'moving_average', windowSize: 10, outlierRejection: false, outlierThreshold: 3 },
      alarms: { enabled: false },
      location: 'ambient',
      tags: ['ambient', 'pressure', 'weather'],
      metadata: {}
    }
  ];
  
  return {
    ...kitConfig,
    sensors: [...kitConfig.sensors, ...additionalSensors],
    samplingRate_hz: 10,          // 10 Hz para investigación
    bufferSize: 864000,           // 24h a 10 Hz
    metadata: { profile: 'research', version: '2.0' }
  };
}

/** Instancia singleton global */
let globalSVDArray: SVDArray | null = null;

export function getSVDArray(config?: SVDArrayConfig): SVDArray {
  if (!globalSVDArray && config) {
    globalSVDArray = new SVDArray(config);
  }
  return globalSVDArray!;
}

export function setSVDArray(array: SVDArray): void {
  globalSVDArray = array;
}