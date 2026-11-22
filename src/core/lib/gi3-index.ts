// src/core/lib/gi3-index.ts
// Índice Gaia de Impacto e Innovación (GI3) — ALRAC/Zeitnus.
// GI3 = 0.50 × I + 0.20 × Q + 0.30 C.
// Umbral para GI3 definitivo: ICV ≥ 80% + 100% indicadores materiales críticos verificados.
// Nunca compensa daños graves (ver boundaries.ts).

export interface IndicadorComprometido {
  id: string;
  peso: number;                    // wᵢ
  lineaBase: number;
  meta: number;                    // Tᵢ
  resultadoObservado?: number;     // Xᵢ
  direccion: 'mas_es_mejor' | 'menos_es_mejor' | 'proporcion';
  limiteInferior?: number;
  limiteSuperior?: number;
  esMaterialCritico: boolean;
}

export interface ResultadoIndicador {
  indicadorId: string;
  fi: number;                      // 0-100 Grado de Cumplimiento
  ei: number;                      // 0-100 Efectividad Real
  ri: number;                      // Desempeño = (fi × ei) ÷ 100
  vi: number;                      // 0 o 1 Verificación independiente
  nivelConfianza: number;          // 1-4
  nivelEvidencia: number;          // 0-4
  consejoCustodiaAprobado: boolean;
}

export interface DetallesQ {
  q1: number; q2: number; q3: number; q4: number; q5: number;
}

export interface DetallesC {
  c1: number; c2: number; c3: number; c4: number; c5: number;
}

export interface CalculoGI3 {
  actorId: string;
  periodo: string;
  icv: number;                     // 0-100
  i: number;                       // 0-100
  q: number;                       // 0-100
  c: number;                       // 0-100
  gi3: number;                     // 0-100
  esDefinitivo: boolean;
  fechaCalculo: number;
  detalles: {
    q: DetallesQ;
    c: DetallesC;
  };
}

const PESO_I = 0.50;
const PESO_Q = 0.20;
const PESO_C = 0.30;
const UMBRAL_ICV_DEFINITIVO = 80;

function clamp0100(v: number): number {
  return Math.min(Math.max(v, 0), 100);
}

/**
 * Grado de Cumplimiento Fᵢ para un indicador.
 */
export function calcularFi(
  indicador: IndicadorComprometido,
  resultadoObservado: number,
): number {
  const { direccion, meta, lineaBase, limiteInferior, limiteSuperior } = indicador;

  if (direccion === 'mas_es_mejor') {
    if (meta <= 0) throw new Error('gi3-index: meta debe ser > 0 para dirección mas_es_mejor');
    return clamp0100((resultadoObservado / meta) * 100);
  }
  if (direccion === 'menos_es_mejor') {
    if (resultadoObservado <= meta) return 100;
    if (meta <= 0) throw new Error('gi3-index: meta debe ser > 0 para dirección menos_es_mejor');
    return clamp0100((meta / resultadoObservado) * 100);
  }
  if (direccion === 'proporcion') {
    if (!limiteInferior || !limiteSuperior) {
      throw new Error('gi3-index: proporcion requiere límites inferior y superior');
    }
    const rango = limiteSuperior - limiteInferior;
    if (rango <= 0) throw new Error('gi3-index: rango de proporción inválido');
    return clamp0100(100 * Math.min(1, Math.max(0, (resultadoObservado - limiteInferior) / rango)));
  }
  throw new Error('gi3-index: dirección inválida');
}

/**
 * Efectividad Real Eᵢ: 0-100, evalúa cumplimiento del propósito ecológico/social/funcional.
 */
export function calcularEi(efectividad: number): number {
  return clamp0100(efectividad);
}

/**
 * Desempeño del Indicador Rᵢ = (Fᵢ × Eᵢ) ÷ 100.
 */
export function calcularRi(fi: number, ei: number): number {
  return clamp0100((fi * ei) / 100);
}

/**
 * Verificación Vᵢ: 1 si hay verificación independiente (Nivel 2-4 aprobada por Consejo de Custodia),
 * 0 si solo declaración propia (Nivel 1) o validación rechazada/pendiente.
 */
export function calcularVi(
  nivelConfianza: number,
  consejoCustodiaAprobado: boolean,
): number {
  if (nivelConfianza >= 2 && consejoCustodiaAprobado) return 1;
  if (nivelConfianza === 4 && consejoCustodiaAprobado) return 1;
  return 0;
}

/**
 * Índice de Cobertura de Verificación ICV = [Σ(wᵢ × Vᵢ) ÷ Σ wᵢ] × 100.
 */
export function calcularICV(
  resultados: { peso: number; vi: number }[],
): number {
  const sumaPesos = resultados.reduce((acc, r) => acc + r.peso, 0);
  if (sumaPesos <= 0) return 0;
  const sumaPonderada = resultados.reduce((acc, r) => acc + r.peso * r.vi, 0);
  return clamp0100((sumaPonderada / sumaPesos) * 100);
}

/**
 * Componente I = Σ(wᵢ × Rᵢ × Vᵢ) ÷ Σ wᵢ.
 */
export function calcularI(
  resultados: { peso: number; ri: number; vi: number }[],
): number {
  const sumaPesos = resultados.reduce((acc, r) => acc + r.peso, 0);
  if (sumaPesos <= 0) return 0;
  const sumaPonderada = resultados.reduce((acc, r) => acc + r.peso * r.ri * r.vi, 0);
  return clamp0100(sumaPonderada / sumaPesos);
}

/**
 * Componente Q = 0.20 Q1 + 0.20 Q2 + 0.20 Q3 + 0.25 Q4 + 0.15 Q5.
 */
export function calcularQ(detalles: DetallesQ): number {
  return clamp0100(
    0.20 * detalles.q1 + 0.20 * detalles.q2 + 0.20 * detalles.q3 +
    0.25 * detalles.q4 + 0.15 * detalles.q5,
  );
}

/**
 * Componente C = 0.20 C1 + ... + 0.20 C5.
 */
export function calcularC(detalles: DetallesC): number {
  return clamp0100(
    0.20 * (detalles.c1 + detalles.c2 + detalles.c3 + detalles.c4 + detalles.c5),
  );
}

/**
 * Calcula GI3 completo.
 * Es definitivo solo si ICV ≥ 80 y todos los indicadores materiales críticos verificados.
 */
export function calcularGI3(
  actorId: string,
  periodo: string,
  resultadosIndicadores: { peso: number; ri: number; vi: number; esMaterialCritico: boolean }[],
  detallesQ: DetallesQ,
  detallesC: DetallesC,
): CalculoGI3 {
  const icv = calcularICV(
    resultadosIndicadores.map((r) => ({ peso: r.peso, vi: r.vi })),
  );
  const i = calcularI(resultadosIndicadores);
  const q = calcularQ(detallesQ);
  const c = calcularC(detallesC);

  const criticosNoVerificados = resultadosIndicadores.filter(
    (r) => r.esMaterialCritico && r.vi === 0,
  ).length;

  const esDefinitivo = icv >= UMBRAL_ICV_DEFINITIVO && criticosNoVerificados === 0;
  const gi3 = clamp0100(PESO_I * i + PESO_Q * q + PESO_C * c);

  return {
    actorId,
    periodo,
    icv,
    i,
    q,
    c,
    gi3,
    esDefinitivo,
    fechaCalculo: Date.now(),
    detalles: { q: detallesQ, c: detallesC },
  };
}

/**
 * Verifica si un GI3 definitivo compensa daños graves (regla de no neutralización).
 * Delegar a boundaries.ts para DENY si hay daños no divulgados.
 */
export function requiereRevisionPorDaños(
  tieneDañosNoDivulgados: boolean,
): boolean {
  return tieneDañosNoDivulgados;
}
