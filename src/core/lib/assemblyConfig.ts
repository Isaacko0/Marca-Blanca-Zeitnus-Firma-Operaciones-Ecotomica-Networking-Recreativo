// HSCSG v15 OS — Runtime Assembly Configuration Loader
// Single source of truth for all mutable assembly parameters
// Código NO hardcodea parámetros: importa desde aquí (hot-reload en dev, rebuild en prod)

import type { AsambleaConfig } from './types/asamblea';

/**
 * Carga la configuración asamblearia desde el JSON versionado.
 * En desarrollo: hot-reload via Vite/import.meta.hot
 * En producción: incluido en bundle, requiere rebuild + deploy tras decisión asamblearia
 */
let _cachedConfig: AsambleaConfig | null = null;
let _configPromise: Promise<AsambleaConfig> | null = null;

export async function getAssemblyConfig(): Promise<AsambleaConfig> {
  if (_cachedConfig) return _cachedConfig;
  
  if (!_configPromise) {
    _configPromise = loadConfig();
  }
  
  _cachedConfig = await _configPromise;
  return _cachedConfig;
}

/**
 * Invalida cache para forzar recarga (útil tras decisión asamblearia en dev)
 */
export function invalidateAssemblyConfigCache(): void {
  _cachedConfig = null;
  _configPromise = null;
}

/**
 * Carga real del JSON (Vite maneja import de JSON nativamente)
 */
async function loadConfig(): Promise<AsambleaConfig> {
  try {
    // Vite/ESM: import directo de JSON
    const mod = await import('../../../assets/asamblea-parametros.json?raw');
    const config = JSON.parse(mod.default) as AsambleaConfig;
    
    // Validación básica de estructura
    validateConfigStructure(config);
    
    return config;
  } catch (error) {
    console.error('[AssemblyConfig] Error cargando configuración:', error);
    // Fallback a configuración por defecto segura
    return getDefaultConfig();
  }
}

/**
 * Validación mínima de estructura (no sustituye validate_legal_compliance.py)
 */
function validateConfigStructure(config: any): void {
  const requiredSections = [
    'tresFondos', 'miembro', 'herencia', 'datosSensibles', 
    'noMiembros', 'metodosReparticion', 'fondoComunitarioGobernanza'
  ];
  
  for (const section of requiredSections) {
    if (!config[section]) {
      throw new Error(`[AssemblyConfig] Sección requerida faltante: ${section}`);
    }
  }
  
  // Validar rangos críticos
  const tf = config.tresFondos;
  if (tf.porcentajeFijoExcedenteFiat < 0 || tf.porcentajeFijoExcedenteFiat > 1) {
    throw new Error('[AssemblyConfig] porcentajeFijoExcedenteFiat debe estar entre 0 y 1');
  }
  if (tf.sueloEstatutario > tf.porcentajeFijoExcedenteFiat) {
    throw new Error('[AssemblyConfig] sueloEstatutario no puede exceder porcentajeFijoExcedenteFiat');
  }
  
  const miembro = config.miembro;
  if (miembro.stakeZNUMinimo < 0 || miembro.autMinimo < 0 || miembro.cdsMinimo < 0) {
    throw new Error('[AssemblyConfig] Umbrales miembro no pueden ser negativos');
  }
}

/**
 * Configuración por defecto segura (solo si falla carga JSON)
 */
function getDefaultConfig(): AsambleaConfig {
  return {
    version: "1.0.0-fallback",
    lastAssemblyDecision: new Date().toISOString(),
    decidedBy: "system-fallback",
    raoAnchor: "RAO:fallback:system",
    
    tresFondos: {
      porcentajeFijoExcedenteFiat: 0.10,
      sueloEstatutario: 0.05,
      unidadExcedente: "fiat_neto",
      clausulaArranque: { activa: false, triggerContratoId: null, primerContratoReal: null },
      pesosInternos: { memoria: 0.30, cuidado: 0.40, autotrofia: 0.30 }
    },
    
    miembro: {
      stakeZNUMinimo: 20,
      autMinimo: 0.2,
      cdsMinimo: 0.2,
      requiereVerificacionTriaxial: true
    },
    
    herencia: {
      hereda: ["obra", "memoria", "reputacion_erc8004", "complete_data_package"],
      noHereda: ["hr_vital", "znu", "tq"],
      mecanismo: "clausula_estatutos_cooperativa"
    },
    
    datosSensibles: {
      consentimientoRevocable: true,
      datosPersonalesOffLedger: true,
      soloHashesEnRAO: true,
      lfpddppCompliance: true,
      datosFallecidos: "requiere_asesoria_legal"
    },
    
    noMiembros: {
      politica: "permiso_costo_real",
      definicionServicioLongevidad: "intervencion_biomedica_con_claim_extension_vida",
      definicionLucro: "margen_maximo_costo_real_mas_reinversion_fondos",
      excedenteGeneradoAFondos: 1.0
    },
    
    metodosReparticion: {
      fondoSolarpunk: { activo: true, porcentaje: 0.25, pgsThreshold: 1.5, destino: "subvenciones_nodos" },
      commonomicsGaia: { activo: false, platformPct: 0.50, marketingPct: 0.30, referralPct: 0.10, contingencyPct: 0.05, facilitador: "caso_a_caso" },
      gaiaCommons33: { activo: false, localPct: 0.333, nationalPct: 0.333, globalPct: 0.333 },
      alracBetaCrit: { activo: true, betaThreshold: 0.30, betaRate: 0.50, proposalThreshold: 0.05, approvalQuorum: 0.60, maxAllocationPerProposal: 0.20 },
      caasRevenueShare: { activo: true, autWeight: 0.5, cdsWeight: 0.5, demurrageThreshold: 300, demurrageRate: 0.05 },
      virginiaNetwork: { activo: false, n3Divisor: 1000, demurrageBase: 0.02, demurrageProgressive: 0.03 },
      tripartita50301055: { activo: false, nodosPct: 0.50, tierraPct: 0.30, educacionPct: 0.10, infraPct: 0.05, reservaPct: 0.05 },
      frneEcoaldea: { activo: false, fondoComunitarioPct: 0.15, penalizacionEspeculacion: "formula_frne" },
      ecosystem4Circulos: { activo: false, circlePcts: [0.15, 0.20, 0.35, 0.30], autCoeff: 0.35, cdsCoeff: 0.35, baseCoeff: 0.3, bonusCap: 1.0 },
      ldfvAlrac: { activo: false, halfShare: 0.5, decayFactor: 0.95, harmonyDivisor: 10, ppeThreshold: "mitad_theta", betaCritFormula: "custom" }
    },
    
    fondoComunitarioGobernanza: {
      proposalThreshold: 0.05,
      approvalQuorum: 0.60,
      auditRequired: true,
      maxAllocationPerProposal: 0.20,
      propositosPermitidos: [
        "soil_regeneration", "water_infrastructure", "energy_sovereignty",
        "housing_regenerative", "health_access", "education", "emergency",
        "memory", "food", "preventive_care"
      ]
    }
  };
}

/**
 * Helpers de acceso tipado para uso en código
 */
export function getTresFondosConfig() {
  return getAssemblyConfig().then(c => c.tresFondos);
}

export function getMiembroConfig() {
  return getAssemblyConfig().then(c => c.miembro);
}

export function getHerenciaConfig() {
  return getAssemblyConfig().then(c => c.herencia);
}

export function getDatosSensiblesConfig() {
  return getAssemblyConfig().then(c => c.datosSensibles);
}

export function getNoMiembrosConfig() {
  return getAssemblyConfig().then(c => c.noMiembros);
}

export function getMetodoReparticion(nombre: keyof AsambleaConfig['metodosReparticion']) {
  return getAssemblyConfig().then(c => c.metodosReparticion[nombre]);
}

export function getFondoComunitarioGobernanza() {
  return getAssemblyConfig().then(c => c.fondoComunitarioGobernanza);
}

/**
 * Validador MJ Gate para parámetros asamblearios
 * Se ejecuta en cada operación que use configuración asamblearia
 */
export interface MJGateResult {
  checks: Record<string, boolean>;
  overall: 'ok' | 'warn' | 'blocked';
  actionables: string[];
}

export async function validateAssemblyParamsMJGate(): Promise<MJGateResult> {
  const config = await getAssemblyConfig();
  const checks: Record<string, boolean> = {};
  const actionables: string[] = [];
  
  // Ley I: No dañar base material
  checks.law1_baseMaterial = 
    config.tresFondos.pesosInternos.autotrofia > 0 &&
    config.metodosReparticion.alracBetaCrit.activo;
  if (!checks.law1_baseMaterial) {
    actionables.push('Ley I: Autotrofia debe ser >0 y β_crit activo para proteger base material');
  }
  
  // Ley II: Trabajo soberaniza (AUT/CDS umbrales)
  checks.law2_soberaniaTrabajo = 
    config.miembro.autMinimo >= 0.2 &&
    config.miembro.cdsMinimo >= 0.2;
  if (!checks.law2_soberaniaTrabajo) {
    actionables.push('Ley II: Umbrales AUT/CDS miembro deben ser ≥0.2 para soberanizar base');
  }
  
  // Ley III: Lucidez (verificación triaxial)
  checks.law3_lucidez = config.miembro.requiereVerificacionTriaxial;
  if (!checks.law3_lucidez) {
    actionables.push('Ley III: Verificación triaxial obligatoria para membresía');
  }
  
  // Ley IV (nueva): Diversidad de contribución (Gini < 0.5)
  // Se valida en runtime con métricas reales, aquí solo parámetros que la favorecen
  checks.law4_diversidad = 
    config.metodosReparticion.caasRevenueShare.demurrageRate > 0 &&
    config.metodosReparticion.alracBetaCrit.betaRate > 0;
  if (!checks.law4_diversidad) {
    actionables.push('Ley IV: Demurrage y β_crit deben estar activos para evitar monopolio');
  }
  
  // Inmutables: hr_vital NO heredable
  checks.inmutable_hr_vital_no_heredable = 
    config.herencia.noHereda.includes('hr_vital');
  if (!checks.inmutable_hr_vital_no_heredable) {
    actionables.push('INMUTABLE: hr_vital DEBE estar en noHereda (Matema 18, VITAL_TIME_SPEC)');
  }
  
  // Inmutables: ZNU/TQ no heredables
  checks.inmutable_znu_tq_no_heredables = 
    config.herencia.noHereda.includes('znu') &&
    config.herencia.noHereda.includes('tq');
  if (!checks.inmutable_znu_tq_no_heredables) {
    actionables.push('INMUTABLE: ZNU y TQ DEBEN estar en noHereda (demurrage, límites ±500)');
  }
  
  // LFPDPPP: datos sensibles off-ledger
  checks.lfpddpp_off_ledger = 
    config.datosSensibles.datosPersonalesOffLedger &&
    config.datosSensibles.soloHashesEnRAO &&
    config.datosSensibles.consentimientoRevocable;
  if (!checks.lfpddpp_off_ledger) {
    actionables.push('LFPDPPP: Datos sensibles requieren off-ledger + hashes RAO + consentimiento revocable');
  }
  
  const passedCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.keys(checks).length;
  
  let overall: 'ok' | 'warn' | 'blocked';
  if (passedCount === totalCount) overall = 'ok';
  else if (passedCount >= totalCount - 1) overall = 'warn';
  else overall = 'blocked';
  
  return { checks, overall, actionables };
}

/**
 * Helper síncrono para uso en código que ya tiene config cargada
 */
export function validateAssemblyParamsMJGateSync(config: AsambleaConfig): MJGateResult {
  // Misma lógica pero síncrona
  const checks: Record<string, boolean> = {};
  const actionables: string[] = [];
  
  checks.law1_baseMaterial = 
    config.tresFondos.pesosInternos.autotrofia > 0 &&
    config.metodosReparticion.alracBetaCrit.activo;
  if (!checks.law1_baseMaterial) actionables.push('Ley I: Autotrofia >0 y β_crit activo');
  
  checks.law2_soberaniaTrabajo = 
    config.miembro.autMinimo >= 0.2 && config.miembro.cdsMinimo >= 0.2;
  if (!checks.law2_soberaniaTrabajo) actionables.push('Ley II: AUT/CDS ≥0.2');
  
  checks.law3_lucidez = config.miembro.requiereVerificacionTriaxial;
  if (!checks.law3_lucidez) actionables.push('Ley III: Triaxial obligatoria');
  
  checks.law4_diversidad = 
    config.metodosReparticion.caasRevenueShare.demurrageRate > 0 &&
    config.metodosReparticion.alracBetaCrit.betaRate > 0;
  if (!checks.law4_diversidad) actionables.push('Ley IV: Demurrage + β_crit activos');
  
  checks.inmutable_hr_vital_no_heredable = config.herencia.noHereda.includes('hr_vital');
  if (!checks.inmutable_hr_vital_no_heredable) actionables.push('INMUTABLE: hr_vital no heredable');
  
  checks.inmutable_znu_tq_no_heredables = 
    config.herencia.noHereda.includes('znu') && config.herencia.noHereda.includes('tq');
  if (!checks.inmutable_znu_tq_no_heredables) actionables.push('INMUTABLE: ZNU/TQ no heredables');
  
  checks.lfpddpp_off_ledger = 
    config.datosSensibles.datosPersonalesOffLedger &&
    config.datosSensibles.soloHashesEnRAO &&
    config.datosSensibles.consentimientoRevocable;
  if (!checks.lfpddpp_off_ledger) actionables.push('LFPDPPP: off-ledger + hashes + consent revocable');
  
  const passedCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.keys(checks).length;
  
  let overall: 'ok' | 'warn' | 'blocked';
  if (passedCount === totalCount) overall = 'ok';
  else if (passedCount >= totalCount - 1) overall = 'warn';
  else overall = 'blocked';
  
  return { checks, overall, actionables };
}