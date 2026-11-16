// src/core/lib/inoculum.ts
// Inoculum Bank & Strain Management — HSCSG P0
// Gestión de cepas Geobacter/Shewanella, muestreo campo, reservas criogénicas
// EBD: ESP-D2, ESP-D6, ESP-D8, ESP-D11

import { EventEmitter } from 'events';

/** Especies soportadas */
export type StrainSpecies = 
  | 'Geobacter_sulfurreducens' 
  | 'Geobacter_metallireducens'
  | 'Shewanella_oneidensis' 
  | 'Shewanella_putrefaciens'
  | 'mixed_consortium';

/** Estado de una cepa en el banco */
export type StrainStatus = 'active' | 'reserve' | 'cryopreserved' | 'field_isolate' | 'contaminated' | 'lost';

/** Información completa de una cepa */
export interface StrainInfo {
  id: string;
  species: StrainSpecies;
  source: 'river_lerma' | 'river_santiago' | 'river_local' | 'lab_optimized' | 'commercial' | 'compost' | 'wastewater' | 'unknown';
  isolationDate: number;              // Timestamp aislamiento
  isolationLocation?: {
    lat: number;
    lng: number;
    description: string;
    waterBody: string;
    contaminationLevel: 'low' | 'medium' | 'high' | 'extreme';
  };
  voltagePotential_V: number;         // Voltaje máximo observado (V)
  currentDensity_mA_cm2: number;      // Densidad corriente (mA/cm²)
  powerDensity_mW_m2: number;         // Densidad potencia (mW/m²)
  coulombicEfficiency: number;        // Eficiencia coulombica (0-1)
  stabilityDays: number;              // Días funcionando sin re-inoculación
  substrateRange: SubstrateType[];    // Qué sustratos consume
  temperatureRange_C: [number, number]; // Rango temperatura óptima
  phRange: [number, number];          // Rango pH óptimo
  salinityTolerance_mM: number;       // Tolerancia salinidad (mM NaCl)
  doublingTime_hours: number;         // Tiempo duplicación (horas)
  cryopreserved: boolean;             // Tiene reserva en -80°C
  cryopreservationDate?: number;
  genomeSequenced: boolean;           // Secuenciado genoma completo
  metagenomicData?: string;           // Referencia datos metagenómicos
  notes: string;
  status: StrainStatus;
  lastViabilityTest: number;          // Timestamp última prueba viabilidad
  viabilityPct: number;               // % viabilidad (0-100)
  passageCount: number;               // Número de pasajes/subcultivos
  parentStrainId?: string;            // Cepa parental (si deriva)
  mutations?: string[];               // Mutaciones conocidas
  plasmids?: string[];                // Plásmidos conocidos
  antibioticResistance?: string[];    // Resistencias antibióticos
  tags: string[];                     // Etiquetas búsqueda
}

/** Sustrato — compartido con mfc.ts */
export type SubstrateType = 
  | 'acetate' | 'wastewater' | 'spirulina_lysate' | 'glucose' 
  | 'river_water' | 'urine' | 'organic_waste' | 'lactate' | 'propionate' | 'butyrate';

/** Cultura de reserva */
export interface ReserveCulture {
  id: string;
  strainId: string;
  volume_ml: number;
  concentration_cells_ml: number;     // Células/mL (estimado OD600)
  storageTemp_C: number;              // 4°C (nevera) | -20°C | -80°C (ultracongelador)
  medium: 'freshwater' | 'minimal' | 'rich' | 'cryoprotectant' | 'original';
  cryoprotectant?: 'glycerol_20' | 'DMSO_10' | 'glycerol_10_DMSO_5' | 'none';
  viabilityTested: number;            // Timestamp última prueba
  viabilityPct: number;               // % viabilidad
  backupLocation: string;             // "nevera_lab_1_A3" | "ultracongelador_2_B1" | "liofilizador"
  containerType: 'cryovial_2ml' | 'cryovial_5ml' | 'falcon_15ml' | 'falcon_50ml' | 'bag_100ml' | 'custom';
  replicateNumber: number;            // Réplica # (para redundancia)
  parentReserveId?: string;           // Reserva parental
  notes: string;
  createdAt: number;
  expiresAt?: number;                 // Fecha caducidad estimada
}

/** Muestra de campo */
export interface FieldSample {
  id: string;
  location: {
    lat: number;
    lng: number;
    altitude_m?: number;
    description: string;
    waterBody: string;
    accessNotes: string;
  };
  dateCollected: number;
  collectedBy: string;
  sampleType: 'sediment' | 'water' | 'biofilm' | 'sludge' | 'compost' | 'rhizosphere';
  volume_ml: number;
  inSituMeasurements: {
    temperature_C?: number;
    ph?: number;
    orp_mV?: number;
    conductivity_uS_cm?: number;
    dissolvedO2_mg_L?: number;
    odor?: string;
    color?: string;
  };
  voltageMeasured_V?: number;         // Voltaje in situ (MFC portátil)
  diversityIndex?: number;            // Shannon diversity (metagenómica)
  dominantSpecies?: string[];         // Especies dominantes (16S/seq)
  targetStrainsIsolated: string[];    // IDs cepas objetivo aisladas
  contaminationRisk: 'low' | 'medium' | 'high';
  storageConditions: {
    temp_C: number;
    timeToLab_hours: number;
    anaerobic: boolean;
  };
  labProcessing: {
    receivedAt: number;
    processedBy: string;
    enrichmentStarted: boolean;
    enrichmentMedium?: string;
    isolationMethod?: 'agar_plate' | 'roll_tube' | 'extinction_dilution' | 'MFC_enrichment';
    isolatesObtained: number;
  };
  notes: string;
  photos: string[];                   // Rutas fotos
  metadata: Record<string, unknown>;
}

/** Preparación de inóculo para MFC */
export interface InoculumPreparation {
  id: string;
  targetMFCIds: string[];
  strainIds: string[];
  totalVolume_ml: number;
  targetConcentration_cells_ml: number;
  actualConcentration_cells_ml: number;
  viabilityPct: number;
  substratePreConditioning: SubstrateType | 'none';
  preparationDate: number;
  preparedBy: string;
  qcPassed: boolean;
  qcNotes: string;
  assignedVolumes: Record<string, number>; // mfcId -> volume_ml
  metadata: Record<string, unknown>;
}

/** Banco de inóculos completo */
export interface InoculumBank {
  strains: Map<string, StrainInfo>;
  reserves: Map<string, ReserveCulture>;
  fieldSamples: Map<string, FieldSample>;
  preparations: Map<string, InoculumPreparation>;
  metadata: {
    totalStrains: number;
    activeStrains: number;
    cryopreservedStrains: number;
    fieldSamplesCollected: number;
    lastFieldExpedition: number;
    version: string;
  };
}

/** Configuración del banco */
export interface InoculumBankConfig {
  autoBackupInterval_hours: number;
  viabilityTestInterval_days: number;
  maxPassageCount: number;
  minViabilityPct: number;
  cryopreservationRequired: boolean;
  redundancyFactor: number;           // Mínimo réplicas por cepa
  metadataSchema: string[];
}

/** Clase principal del banco de inóculos */
export class InoculumBankManager extends EventEmitter {
  private strains: Map<string, StrainInfo> = new Map();
  private reserves: Map<string, ReserveCulture> = new Map();
  private fieldSamples: Map<string, FieldSample> = new Map();
  private preparations: Map<string, InoculumPreparation> = new Map();
  private config: InoculumBankConfig;
  private backupTimer: NodeJS.Timeout | null = null;

  constructor(config?: Partial<InoculumBankConfig>) {
    super();
    this.config = {
      autoBackupInterval_hours: 24,
      viabilityTestInterval_days: 30,
      maxPassageCount: 10,
      minViabilityPct: 70,
      cryopreservationRequired: true,
      redundancyFactor: 3,
      metadataSchema: ['source', 'project', 'experiment', 'operator'],
      ...config
    };
    this.startAutoBackup();
  }

  /** Inicia backup automático */
  private startAutoBackup(): void {
    this.backupTimer = setInterval(() => {
      this.backup();
    }, this.config.autoBackupInterval_hours * 3600000);
  }

  /** Detiene backup automático */
  public stopAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  // ==================== CEPAS (STRAINS) ====================

  /** Registra nueva cepa */
  public registerStrain(strain: Omit<StrainInfo, 'id' | 'lastViabilityTest' | 'viabilityPct' | 'passageCount' | 'status'> & { id?: string }): StrainInfo {
    const id = strain.id || `strain_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const fullStrain: StrainInfo = {
      ...strain,
      id,
      lastViabilityTest: Date.now(),
      viabilityPct: 100,
      passageCount: 0,
      status: 'active'
    };
    
    this.strains.set(id, fullStrain);
    this.emit('strain:registered', { strain: fullStrain });
    this.save();
    return fullStrain;
  }

  /** Obtiene cepa por ID */
  public getStrain(id: string): StrainInfo | undefined {
    return this.strains.get(id);
  }

  /** Busca cepas por criterios */
  public findStrains(criteria: Partial<Pick<StrainInfo, 'species' | 'source' | 'status' | 'tags'>>): StrainInfo[] {
    return Array.from(this.strains.values()).filter(strain => {
      if (criteria.species && strain.species !== criteria.species) return false;
      if (criteria.source && strain.source !== criteria.source) return false;
      if (criteria.status && strain.status !== criteria.status) return false;
      if (criteria.tags && criteria.tags.length > 0) {
        if (!criteria.tags.some(tag => strain.tags.includes(tag))) return false;
      }
      return true;
    });
  }

  /** Obtiene mejores cepas para MFC (ordenadas por voltaje potencial) */
  public getBestStrainsForMFC(count: number = 5, substrate?: SubstrateType): StrainInfo[] {
    let candidates = this.findStrains({ status: 'active' });
    
    if (substrate) {
      candidates = candidates.filter(s => s.substrateRange.includes(substrate));
    }
    
    return candidates
      .sort((a, b) => b.voltagePotential_V - a.voltagePotential_V)
      .slice(0, count);
  }

  /** Actualiza métricas de cepa tras experimento */
  public updateStrainMetrics(strainId: string, metrics: Partial<Pick<StrainInfo, 'voltagePotential_V' | 'currentDensity_mA_cm2' | 'powerDensity_mW_m2' | 'coulombicEfficiency' | 'stabilityDays'>>): void {
    const strain = this.strains.get(strainId);
    if (!strain) throw new Error(`Cepa no encontrada: ${strainId}`);
    
    Object.assign(strain, metrics);
    strain.lastViabilityTest = Date.now();
    this.emit('strain:updated', { strainId, metrics });
    this.save();
  }

  /** Incrementa contador de pasajes (subcultivo) */
  public incrementPassage(strainId: string): number {
    const strain = this.strains.get(strainId);
    if (!strain) throw new Error(`Cepa no encontrada: ${strainId}`);
    
    strain.passageCount++;
    if (strain.passageCount >= this.config.maxPassageCount) {
      strain.status = 'cryopreserved';
      this.emit('strain:maxPassageReached', { strainId, passageCount: strain.passageCount });
    }
    this.save();
    return strain.passageCount;
  }

  // ==================== RESERVAS (RESERVE CULTURES) ====================

  /** Crea reserva de cepa */
  public createReserve(reserve: Omit<ReserveCulture, 'id' | 'createdAt'> & { id?: string }): ReserveCulture {
    const id = reserve.id || `reserve_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const fullReserve: ReserveCulture = {
      ...reserve,
      id,
      createdAt: Date.now()
    };
    
    this.reserves.set(id, fullReserve);
    
    // Actualizar estado cepa
    const strain = this.strains.get(reserve.strainId);
    if (strain) {
      strain.cryopreserved = true;
      strain.cryopreservationDate = Date.now();
    }
    
    this.emit('reserve:created', { reserve: fullReserve });
    this.save();
    return fullReserve;
  }

  /** Obtiene reservas de una cepa */
  public getReservesForStrain(strainId: string): ReserveCulture[] {
    return Array.from(this.reserves.values()).filter(r => r.strainId === strainId);
  }

  /** Verifica viabilidad de reserva */
  public async testReserveViability(reserveId: string): Promise<{ viable: boolean; viabilityPct: number }> {
    const reserve = this.reserves.get(reserveId);
    if (!reserve) throw new Error(`Reserva no encontrada: ${reserveId}`);
    
    // TODO: Implementar test real (OD600, plating, qPCR, MFC test)
    // Simulación por ahora
    const viabilityPct = Math.max(0, reserve.viabilityPct - (Date.now() - reserve.viabilityTested) / 86400000 * 0.5);
    
    reserve.viabilityTested = Date.now();
    reserve.viabilityPct = viabilityPct;
    
    if (viabilityPct < this.config.minViabilityPct) {
      this.emit('reserve:viabilityLow', { reserveId, viabilityPct });
    }
    
    this.save();
    return { viable: viabilityPct >= this.config.minViabilityPct, viabilityPct };
  }

  /** Obtiene reservas viables para una cepa */
  public getViableReserves(strainId: string): ReserveCulture[] {
    return this.getReservesForStrain(strainId).filter(r => r.viabilityPct >= this.config.minViabilityPct);
  }

  // ==================== MUESTREO CAMPO (FIELD SAMPLING) ====================

  /** Registra muestra de campo */
  public registerFieldSample(sample: Omit<FieldSample, 'id'> & { id?: string }): FieldSample {
    const id = sample.id || `field_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const fullSample: FieldSample = {
      ...sample,
      id
    };
    
    this.fieldSamples.set(id, fullSample);
    this.emit('fieldSample:registered', { sample: fullSample });
    this.save();
    return fullSample;
  }

  /** Procesa muestra en laboratorio — inicia enriquecimiento */
  public async processFieldSample(sampleId: string, processing: Partial<FieldSample['labProcessing']>): Promise<void> {
    const sample = this.fieldSamples.get(sampleId);
    if (!sample) throw new Error(`Muestra no encontrada: ${sampleId}`);
    
    sample.labProcessing = {
      ...sample.labProcessing,
      ...processing,
      receivedAt: processing.receivedAt || Date.now()
    };
    
    this.emit('fieldSample:processed', { sample });
    this.save();
  }

  /** Registra cepas aisladas de muestra de campo */
  public registerIsolatesFromSample(sampleId: string, isolateIds: string[]): void {
    const sample = this.fieldSamples.get(sampleId);
    if (!sample) throw new Error(`Muestra no encontrada: ${sampleId}`);
    
    sample.targetStrainsIsolated.push(...isolateIds);
    this.emit('fieldSample:isolatesRegistered', { sampleId, isolateIds });
    this.save();
  }

  // ==================== PREPARACIÓN INÓCULO ====================

  /** Prepara inóculo para MFCs objetivo */
  public prepareInoculum(preparation: Omit<InoculumPreparation, 'id'> & { id?: string }): InoculumPreparation {
    const id = preparation.id || `prep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    // Validar cepas existen y son viables
    for (const strainId of preparation.strainIds) {
      const strain = this.strains.get(strainId);
      if (!strain) throw new Error(`Cepa no encontrada: ${strainId}`);
      if (strain.viabilityPct < this.config.minViabilityPct) {
        throw new Error(`Cepa ${strainId} viabilidad baja: ${strain.viabilityPct}%`);
      }
    }
    
    // Validar reservas disponibles
    for (const strainId of preparation.strainIds) {
      const viableReserves = this.getViableReserves(strainId);
      if (viableReserves.length === 0) {
        throw new Error(`Sin reservas viables para cepa: ${strainId}`);
      }
    }
    
    const fullPrep: InoculumPreparation = {
      ...preparation,
      id
    };
    
    this.preparations.set(id, fullPrep);
    
    // Incrementar pasajes de cepas usadas
    for (const strainId of preparation.strainIds) {
      this.incrementPassage(strainId);
    }
    
    this.emit('inoculum:prepared', { preparation: fullPrep });
    this.save();
    return fullPrep;
  }

  /** Obtiene preparación por ID */
  public getPreparation(id: string): InoculumPreparation | undefined {
    return this.preparations.get(id);
  }

  /** Obtiene preparaciones para MFC específico */
  public getPreparationsForMFC(mfcId: string): InoculumPreparation[] {
    return Array.from(this.preparations.values()).filter(p => p.targetMFCIds.includes(mfcId));
  }

  // ==================== EXPORT/IMPORT/BACKUP ====================

  /** Exporta banco completo */
  public exportBank(): InoculumBank {
    return {
      strains: new Map(this.strains),
      reserves: new Map(this.reserves),
      fieldSamples: new Map(this.fieldSamples),
      preparations: new Map(this.preparations),
      metadata: {
        totalStrains: this.strains.size,
        activeStrains: this.findStrains({ status: 'active' }).length,
        cryopreservedStrains: this.findStrains({ status: 'cryopreserved' }).length,
        fieldSamplesCollected: this.fieldSamples.size,
        lastFieldExpedition: this.getLastFieldExpedition(),
        version: '1.0.0'
      }
    };
  }

  /** Serializa a JSON para persistencia */
  public toJSON(): string {
    return JSON.stringify({
      strains: Array.from(this.strains.entries()),
      reserves: Array.from(this.reserves.entries()),
      fieldSamples: Array.from(this.fieldSamples.entries()),
      preparations: Array.from(this.preparations.entries()),
      config: this.config,
      metadata: {
        totalStrains: this.strains.size,
        activeStrains: this.findStrains({ status: 'active' }).length,
        cryopreservedStrains: this.findStrains({ status: 'cryopreserved' }).length,
        fieldSamplesCollected: this.fieldSamples.size,
        lastFieldExpedition: this.getLastFieldExpedition(),
        exportedAt: Date.now(),
        version: '1.0.0'
      }
    }, null, 2);
  }

  /** Carga desde JSON */
  public static fromJSON(json: string): InoculumBankManager {
    const data = JSON.parse(json);
    const manager = new InoculumBankManager(data.config);
    
    manager.strains = new Map(data.strains);
    manager.reserves = new Map(data.reserves);
    manager.fieldSamples = new Map(data.fieldSamples);
    manager.preparations = new Map(data.preparations);
    
    return manager;
  }

  /** Backup interno */
  private save(): void {
    // En producción: escribir a archivo, base de datos, IPFS, etc.
    this.emit('bank:saved', { timestamp: Date.now() });
  }

  /** Backup completo (llamado por timer) */
  private backup(): void {
    const json = this.toJSON();
    // En producción: guardar en múltiples ubicaciones
    this.emit('bank:backup', { size: json.length, timestamp: Date.now() });
  }

  /** Obtiene timestamp última expedición */
  private getLastFieldExpedition(): number {
    let latest = 0;
    for (const sample of this.fieldSamples.values()) {
      if (sample.dateCollected > latest) latest = sample.dateCollected;
    }
    return latest;
  }

  /** Estadísticas del banco */
  public getStats(): object {
    const strainsBySpecies = new Map<string, number>();
    const strainsBySource = new Map<string, number>();
    const strainsByStatus = new Map<string, number>();
    
    for (const strain of this.strains.values()) {
      strainsBySpecies.set(strain.species, (strainsBySpecies.get(strain.species) || 0) + 1);
      strainsBySource.set(strain.source, (strainsBySource.get(strain.source) || 0) + 1);
      strainsByStatus.set(strain.status, (strainsByStatus.get(strain.status) || 0) + 1);
    }
    
    return {
      totalStrains: this.strains.size,
      strainsBySpecies: Object.fromEntries(strainsBySpecies),
      strainsBySource: Object.fromEntries(strainsBySource),
      strainsByStatus: Object.fromEntries(strainsByStatus),
      totalReserves: this.reserves.size,
      totalFieldSamples: this.fieldSamples.size,
      totalPreparations: this.preparations.size,
      cryopreservedCount: this.findStrains({ status: 'cryopreserved' }).length,
      activeCount: this.findStrains({ status: 'active' }).length,
      lastBackup: Date.now()
    };
  }

  /** Limpieza */
  public destroy(): void {
    this.stopAutoBackup();
    this.removeAllListeners();
  }
}

/** Instancia singleton global */
let globalInoculumBank: InoculumBankManager | null = null;

export function getInoculumBank(config?: Partial<InoculumBankConfig>): InoculumBankManager {
  if (!globalInoculumBank) {
    globalInoculumBank = new InoculumBankManager(config);
  }
  return globalInoculumBank;
}

export function setInoculumBank(bank: InoculumBankManager): void {
  globalInoculumBank = bank;
}

/** Cepas estándar HSCSG (precargadas) */
export const STANDARD_HSCSG_STRAINS: Omit<StrainInfo, 'id' | 'lastViabilityTest' | 'viabilityPct' | 'passageCount' | 'status'>[] = [
  {
    species: 'Geobacter_sulfurreducens',
    source: 'river_lerma',
    isolationDate: Date.now() - 86400000 * 365, // Hace ~1 año
    isolationLocation: {
      lat: 20.5888,
      lng: -103.3494,
      description: 'Río Lerma, Jalisco - sedimentos anóxicos cerca descarga industrial',
      waterBody: 'Río Lerma',
      contaminationLevel: 'high'
    },
    voltagePotential_V: 0.55,
    currentDensity_mA_cm2: 1.2,
    powerDensity_mW_m2: 650,
    coulombicEfficiency: 0.75,
    stabilityDays: 120,
    substrateRange: ['acetate', 'wastewater', 'spirulina_lysate', 'glucose', 'lactate', 'propionate'],
    temperatureRange_C: [15, 40],
    phRange: [6.0, 8.0],
    salinityTolerance_mM: 200,
    doublingTime_hours: 8,
    cryopreserved: true,
    genomeSequenced: true,
    notes: 'Cepa referencia HSCSG. Aislada por Gilberto Esparza team. Alta densidad potencia, tolerante a contaminantes.',
    tags: ['reference', 'high-power', 'contaminant-tolerant', 'lerma', 'esparza']
  },
  {
    species: 'Geobacter_metallireducens',
    source: 'river_santiago',
    isolationDate: Date.now() - 86400000 * 180,
    isolationLocation: {
      lat: 20.6736,
      lng: -103.3447,
      description: 'Río Santiago, El Salto - biofilm en tubería descarga',
      waterBody: 'Río Santiago',
      contaminationLevel: 'extreme'
    },
    voltagePotential_V: 0.48,
    currentDensity_mA_cm2: 0.9,
    powerDensity_mW_m2: 420,
    coulombicEfficiency: 0.68,
    stabilityDays: 90,
    substrateRange: ['acetate', 'wastewater', 'glucose', 'lactate', 'ethanol'],
    temperatureRange_C: [20, 45],
    phRange: [5.5, 8.5],
    salinityTolerance_mM: 300,
    doublingTime_hours: 6,
    cryopreserved: true,
    genomeSequenced: true,
    notes: 'Cepa termotolerante, alta tolerancia salinidad. Ideal climas cálidos, agua salobre.',
    tags: ['thermotolerant', 'halotolerant', 'santiago', 'extreme-environment']
  },
  {
    species: 'Shewanella_oneidensis',
    source: 'lab_optimized',
    isolationDate: Date.now() - 86400000 * 730,
    isolationLocation: {
      lat: 19.4326,
      lng: -99.1332,
      description: 'Laboratorio CINVESTAV - cepa MR-1 optimizada',
      waterBody: 'Laboratorio',
      contaminationLevel: 'low'
    },
    voltagePotential_V: 0.35,
    currentDensity_mA_cm2: 0.6,
    powerDensity_mW_m2: 210,
    coulombicEfficiency: 0.60,
    stabilityDays: 60,
    substrateRange: ['acetate', 'lactate', 'glucose', 'spirulina_lysate', 'fumarate', 'DMSO'],
    temperatureRange_C: [25, 37],
    phRange: [6.5, 8.0],
    salinityTolerance_mM: 100,
    doublingTime_hours: 4,
    cryopreserved: true,
    genomeSequenced: true,
    notes: 'Cepa modelo MR-1. Crece rápido, metabolismo versátil. Buena para inicio rápido MFC.',
    tags: ['model-organism', 'fast-growth', 'versatile', 'MR-1', 'lab']
  },
  {
    species: 'mixed_consortium',
    source: 'river_local',
    isolationDate: Date.now() - 86400000 * 30,
    isolationLocation: {
      lat: 0,
      lng: 0,
      description: 'Consorcio enriquecido MFC local - agua residual doméstica',
      waterBody: 'Local wastewater',
      contaminationLevel: 'medium'
    },
    voltagePotential_V: 0.42,
    currentDensity_mA_cm2: 0.8,
    powerDensity_mW_m2: 340,
    coulombicEfficiency: 0.55,
    stabilityDays: 180,
    substrateRange: ['wastewater', 'organic_waste', 'urine', 'spirulina_lysate', 'acetate', 'glucose'],
    temperatureRange_C: [10, 35],
    phRange: [6.0, 8.5],
    salinityTolerance_mM: 150,
    doublingTime_hours: 12,
    cryopreserved: false,
    genomeSequenced: false,
    notes: 'Consorcio natural no definido. Robusto, adaptable, ideal aguas residuales reales. Requiere caracterización 16S.',
    tags: ['consortium', 'robust', 'wastewater', 'local', 'undefined']
  }
];