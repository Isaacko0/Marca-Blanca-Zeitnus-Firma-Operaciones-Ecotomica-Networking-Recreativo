// src/core/lib/ial.ts
// IAL — Índice de Autotrofia Longeva
// Capa 1 + 5 | Depende: tq.ts, alrac-governance-holonic, valueDual.ts (anfibio), tiempo-vital
// Spec: alrac-ial-autotrofia-longeva.md (BORRADOR v0.1)

import type { TQTransaction } from './tq';

export type IALFactorKey = 'energia' | 'alimento' | 'cuidado';

export interface IALWeights {
  energia: number;   // default 1/3
  alimento: number;  // default 1/3
  cuidado: number;   // default 1/3
}

export interface IALAutotrofiaInput {
  produccion: Record<IALFactorKey, number>;  // p_k
  consumo: Record<IALFactorKey, number>;     // c_k
  pesos?: Partial<IALWeights>;
}

export interface IALDestrabajoInput {
  horasServidumbre: number;   // h_serv
  horasDisponibles: number;   // h_disp
  tvMin: number;              // TV_min (parámetro calibrado)
}

export interface IALLujoEticoInput {
  excedenteDiscrecional: number;  // E_disc
  excedenteEtico: number;         // E_etico (validado por pares, CDS)
  aMin: number;                   // A_min (compuerta)
  tvMin: number;                  // TV_min (compuerta)
  autotrofiaActual: number;       // A actual
  destrabajoActual: number;       // D actual
}

export interface IALTransgeneracionalInput {
  proxies: IALProxy[];  // mínimo 4 medibles
}

export interface IALProxy {
  id: string;
  nombre: 'suelo' | 'saber' | 'boveda' | 'cuidado' | 'relevo';
  capacidadActual: number;
  capacidadRecibida: number;
  medible: boolean;
}

export interface IALConfig {
  pesos: IALWeights;
  aMin: number;
  tvMin: number;
  bandas: IALBand[];
}

export interface IALBand {
  min: number;
  max: number;
  estado: 'critico' | 'fragil' | 'estable' | 'longevo';
  accion: string;
}

export interface IALResult {
  A: number;
  D: number;
  L: number;
  T: number;
  IAL: number;
  estado: IALBand['estado'];
  verificado: boolean;
  provisional: boolean;  // true si T tiene < 4 proxies medibles
  alertas: string[];
  timestamp: number;
  periodo: { inicio: number; fin: number };
  nodoId: string;
}

export interface IALVerification {
  mental: boolean;      // revisión mental/conceptual
  simulacion: boolean;  // simulación computacional
  laboratorio: boolean; // medición física/terreno
  paresValidaronL: boolean;  // R5
  auditoriaRotada: string;   // R8 - proxy auditado este periodo
}

// Configuración por defecto (hipótesis provisionales - calibrar en Paso II)
export const DEFAULT_IAL_CONFIG: IALConfig = {
  pesos: { energia: 1/3, alimento: 1/3, cuidado: 1/3 },
  aMin: 0.20,      // provisional
  tvMin: 0.30,     // provisional
  bandas: [
    { min: 0, max: 0.20, estado: 'critico', accion: 'Dispara protocolo γ-CARMIS del nodo' },
    { min: 0.20, max: 0.40, estado: 'fragil', accion: 'Plan de recuperación del Consejo de Futuros' },
    { min: 0.40, max: 0.70, estado: 'estable', accion: 'Seguimiento trimestral' },
    { min: 0.70, max: 1, estado: 'longevo', accion: 'Candidato a nodo de referencia / réplica' },
  ],
};

/**
 * Calcula factor A — Autotrofia
 * A = Σ_k w_k · min(1, p_k / c_k)
 * k ∈ {energía, alimento, cuidado}
 * Energía en kWh (= TQ-equivalente); alimento en kcal convertidas a kWh; cuidado en horas de cuidado.
 */
export function calculateAutotrofia(input: IALAutotrofiaInput, pesos: IALWeights): number {
  const { produccion, consumo } = input;
  const keys: IALFactorKey[] = ['energia', 'alimento', 'cuidado'];
  
  let sum = 0;
  for (const k of keys) {
    const p = produccion[k] ?? 0;
    const c = consumo[k] ?? 0;
    const ratio = c > 0 ? Math.min(1, p / c) : 0;
    sum += pesos[k] * ratio;
  }
  return Math.max(0, Math.min(1, sum));
}

/**
 * Calcula factor D — Destrabajo
 * D = 1 − (h_serv / h_disp)
 * Piso protegido: D ≥ TV_min
 */
export function calculateDestrabajo(input: IALDestrabajoInput): number {
  const { horasServidumbre, horasDisponibles, tvMin } = input;
  if (horasDisponibles <= 0) return tvMin;
  const raw = 1 - (horasServidumbre / horasDisponibles);
  return Math.max(tvMin, Math.min(1, raw));
}

/**
 * Calcula factor L — Lujo ético
 * L = E_etico / E_disc (0 si E_disc = 0)
 * Compuerta: si A < A_min o D < TV_min → L = 0
 */
export function calculateLujoEtico(input: IALLujoEticoInput): number {
  const { excedenteDiscrecional, excedenteEtico, aMin, tvMin, autotrofiaActual, destrabajoActual } = input;
  
  // Compuerta: el lujo no precede a la base
  if (autotrofiaActual < aMin || destrabajoActual < tvMin) {
    return 0;
  }
  
  if (excedenteDiscrecional <= 0) return 0;
  return Math.max(0, Math.min(1, excedenteEtico / excedenteDiscrecional));
}

/**
 * Calcula factor T — Transgeneracional
 * T = ( Π_i min(1, r_i) )^(1/n)  donde r_i = capacidad_actual_i / capacidad_recibida_i
 * Mínimo 4 proxies medibles. Si < 4 → provisional = true
 */
export function calculateTransgeneracional(input: IALTransgeneracionalInput): { T: number; provisional: boolean } {
  const { proxies } = input;
  const medibles = proxies.filter(p => p.medible && p.capacidadRecibida > 0);
  
  if (medibles.length === 0) return { T: 0, provisional: true };
  
  const provisional = medibles.length < 4;
  const product = medibles.reduce((acc, p) => {
    const ratio = Math.min(1, p.capacidadActual / p.capacidadRecibida);
    return acc * ratio;
  }, 1);
  
  const T = Math.pow(product, 1 / medibles.length);
  return { T: Math.max(0, Math.min(1, T)), provisional };
}

/**
 * Calcula IAL = (A · D · L)^(1/3) · T
 * Media geométrica: si un factor es 0, IAL = 0 (sin compensación)
 * T actúa como freno multiplicativo
 */
export function calculateIAL(A: number, D: number, L: number, T: number): number {
  if (A <= 0 || D <= 0 || L <= 0) return 0;
  const geoMean = Math.pow(A * D * L, 1/3);
  return Math.max(0, Math.min(1, geoMean * T));
}

/**
 * Evalúa IAL completo con todos los inputs y configuración
 */
export function evaluateIAL(
  autotrofia: IALAutotrofiaInput,
  destrabajo: IALDestrabajoInput,
  lujoEtico: IALLujoEticoInput,
  transgeneracional: IALTransgeneracionalInput,
  config: IALConfig,
  nodoId: string,
  periodo: { inicio: number; fin: number }
): IALResult {
  const A = calculateAutotrofia(autotrofia, config.pesos);
  const D = calculateDestrabajo(destrabajo);
  
  // L needs A and D for compuerta
  const L = calculateLujoEtico({
    ...lujoEtico,
    aMin: config.aMin,
    tvMin: config.tvMin,
    autotrofiaActual: A,
    destrabajoActual: D,
  });
  
  const { T, provisional } = calculateTransgeneracional(transgeneracional);
  const IAL = calculateIAL(A, D, L, T);
  
  const estado = getBand(IAL, config.bandas).estado;
  const alertas = checkAlertas({ A, D, L, T, IAL, estado, provisional, verificado: false, alertas: [], timestamp: 0, periodo, nodoId }, config);
  
  return {
    A, D, L, T, IAL,
    estado,
    verificado: false,  // R4: requiere verificación triaxial
    provisional,
    alertas,
    timestamp: Date.now(),
    periodo,
    nodoId,
  };
}

/**
 * Obtiene la banda correspondiente al valor IAL
 */
export function getBand(ial: number, bandas: IALBand[]): IALBand {
  for (const band of bandas) {
    if (ial >= band.min && ial < band.max) return band;
  }
  // Edge case: ial === 1
  return bandas[bandas.length - 1];
}

/**
 * Verifica alertas adicionales (R4, R8, factor < 0.10, T < 0.80 dos periodos)
 */
export function checkAlertas(result: IALResult, config: IALConfig): string[] {
  const alertas: string[] = [];
  
  // Factores < 0.10
  if (result.A < 0.10) alertas.push('A < 0.10: Autotrofia crítica');
  if (result.D < 0.10) alertas.push('D < 0.10: Destrabajo crítico');
  if (result.L < 0.10) alertas.push('L < 0.10: Lujo ético crítico');
  
  // T < 0.80 (necesita historial de periodos previos - placeholder)
  // if (result.T < 0.80 && prevPeriodT < 0.80) alertas.push('T < 0.80 dos periodos seguidos');
  
  // Provisional T
  if (result.provisional) alertas.push('T PROVISIONAL: < 4 proxies medibles - IAL no activa decisiones de producción');
  
  // Banda crítica
  if (result.estado === 'critico') alertas.push('IAL en banda CRÍTICO: dispara γ-CARMIS');
  
  return alertas;
}

/**
 * Verificación triaxial (R4)
 * Debe ser llamada externamente tras evaluación
 */
export function verifyTriaxial(
  result: IALResult,
  mental: boolean,
  simulacion: boolean,
  laboratorio: boolean,
  paresValidaronL: boolean,
  auditoriaRotada: string
): IALVerification {
  return {
    mental,
    simulacion,
    laboratorio,
    paresValidaronL,
    auditoriaRotada,
  };
}

/**
 * Crea un resultado IAL marcado como verificado
 */
export function markVerified(result: IALResult, verification: IALVerification): IALResult {
  const allVerified = verification.mental && verification.simulacion && verification.laboratorio && verification.paresValidaronL;
  return {
    ...result,
    verificado: allVerified,
  };
}

/**
 * Valida que la configuración cumple requisitos básicos
 */
export function validateConfig(config: Partial<IALConfig>): string[] {
  const errors: string[] = [];
  if (config.pesos) {
    const sum = config.pesos.energia + config.pesos.alimento + config.pesos.cuidado;
    if (Math.abs(sum - 1) > 0.001) errors.push('Pesos deben sumar 1');
    if (config.pesos.energia < 0 || config.pesos.alimento < 0 || config.pesos.cuidado < 0) {
      errors.push('Pesos no pueden ser negativos');
    }
  }
  if (config.aMin !== undefined && (config.aMin < 0 || config.aMin > 1)) errors.push('aMin debe estar en [0,1]');
  if (config.tvMin !== undefined && (config.tvMin < 0 || config.tvMin > 1)) errors.push('tvMin debe estar en [0,1]');
  return errors;
}

// Re-export types for convenience
export type { TQTransaction } from './tq';