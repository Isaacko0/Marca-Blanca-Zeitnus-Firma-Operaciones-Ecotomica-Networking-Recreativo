// src/core/lib/niveles-evidencia.ts
// Niveles de Profundidad de Evidencia (E0-E4) — ALRAC/Zeitnus.
// Miden la madurez técnica de soportes documentales o instrumentales.

export type NivelEvidencia = 0 | 1 | 2 | 3 | 4;

export interface AsignacionEvidencia {
  datoId: string;
  nivel: NivelEvidencia;
  descripcionSoporte: string;
  fechaAsignacion: number;
}

const NIVELES_EVIDENCIA: Record<NivelEvidencia, { nombre: string; puntosOrientativos: number; descripcion: string }> = {
  0: {
    nombre: 'Declaración narrativa sin soportes',
    puntosOrientativos: 20,
    descripcion: 'Afirmación sin documentos adjuntos.',
  },
  1: {
    nombre: 'Evidencia básica adjunta',
    puntosOrientativos: 40,
    descripcion: 'Fotografías fechadas, registros simples, enlaces o documentos iniciales.',
  },
  2: {
    nombre: 'Registros sistemáticos',
    puntosOrientativos: 60,
    descripcion: 'Registros consistentes, periódicos y trazables.',
  },
  3: {
    nombre: 'Contrastación documentada',
    puntosOrientativos: 80,
    descripcion: 'Contrastación de pares, comunidades beneficiarias o verificación en campo por terceros competentes.',
  },
  4: {
    nombre: 'Auditoría externa independiente',
    puntosOrientativos: 100,
    descripcion: 'Auditoría externa independiente, medición instrumental continua o certificación acreditada pertinente.',
  },
};

export function listarNiveles(): Record<NivelEvidencia, { nombre: string; puntosOrientativos: number; descripcion: string }> {
  return { ...NIVELES_EVIDENCIA };
}

export function obtenerNivel(nivel: NivelEvidencia) {
  return NIVELES_EVIDENCIA[nivel];
}

export function asignarNivelEvidencia(
  asignacion: Omit<AsignacionEvidencia, 'fechaAsignacion'>,
): AsignacionEvidencia {
  if (!NIVELES_EVIDENCIA[asignacion.nivel]) {
    throw new Error('niveles-evidencia: nivel de evidencia inválido');
  }
  return {
    ...asignacion,
    fechaAsignacion: Date.now(),
  };
}

export function puntosOrientativos(nivel: NivelEvidencia): number {
  return NIVELES_EVIDENCIA[nivel].puntosOrientativos;
}
