// src/core/lib/niveles-confianza.ts
// Niveles de Confianza (1-4) + Consejo de Custodia Gaia — ALRAC/Zeitnus.
// Verificación independiente: ningún Actor verifica sus propios resultados.

export type NivelConfianza = 1 | 2 | 3 | 4;

export interface SolicitudVerificacion {
  actorId: string;
  indicadorId: string;
  nivelSolicitado: NivelConfianza;
  evidencias: string[];          // IDs RAO
  fechaSolicitud: number;
}

export interface ResultadoVerificacion {
  solicitudId: string;
  nivelAsignado: NivelConfianza;
  aprobadoPorConsejoCustodia: boolean;
  observaciones?: string;
  fechaValidacion: number;
}

const NIVELES_CONFIANZA: Record<NivelConfianza, string> = {
  1: 'Auto-atestiguado (Declaración Propia)',
  2: 'Atestiguado por la Comunidad y Pares',
  3: 'Verificado por Embajador/a de Confianza Gaia',
  4: 'Certificado por Terceros Independientes',
};

let verifCounter = 0;
function nextVerifId(): string {
  verifCounter += 1;
  return `verif-${Date.now()}-${verifCounter}`;
}

export function listarNiveles(): Record<NivelConfianza, string> {
  return { ...NIVELES_CONFIANZA };
}

export function obtenerNombreNivel(nivel: NivelConfianza): string {
  return NIVELES_CONFIANZA[nivel];
}

/**
 * Evalúa si un nivel de confianza es válido para contar en el índice GI3.
 * Nivel 1 (auto-declarado) → Vᵢ = 0.
 * Niveles 2-3 requieren aprobación obligatoria del Consejo de Custodia Gaia.
 * Nivel 4 requiere autenticación de entidad externa + validación del Consejo.
 */
export function evaluarVerificacion(
  solicitud: SolicitudVerificacion,
): ResultadoVerificacion {
  const id = nextVerifId();

  if (solicitud.nivelSolicitado === 1) {
    return {
      solicitudId: id,
      nivelAsignado: 1,
      aprobadoPorConsejoCustodia: false,
      observaciones: 'Declaración propia sin verificación independiente. Vᵢ = 0.',
      fechaValidacion: Date.now(),
    };
  }

  if (solicitud.nivelSolicitado === 2 || solicitud.nivelSolicitado === 3) {
    if (!solicitud.aprobadoPorConsejoCustodia) {
      return {
        solicitudId: id,
        nivelAsignado: 1,
        aprobadoPorConsejoCustodia: false,
        observaciones: 'Nivel 2 o 3 requiere aprobación obligatoria del Consejo de Custodia Gaia. Degradado a Nivel 1.',
        fechaValidacion: Date.now(),
      };
    }
    return {
      solicitudId: id,
      nivelAsignado: solicitud.nivelSolicitado,
      aprobadoPorConsejoCustodia: true,
      fechaValidacion: Date.now(),
    };
  }

  if (solicitud.nivelSolicitado === 4) {
    // Nivel 4: entidad externa competente; el Consejo comprueba legitimidad, alcance y vigencia.
    return {
      solicitudId: id,
      nivelAsignado: 4,
      aprobadoPorConsejoCustodia: solicitud.aprobadoPorConsejoCustodia,
      observaciones: solicitud.aprobadoPorConsejoCustodia
        ? 'Certificación externa autenticada por el Consejo de Custodia Gaia.'
        : 'Certificación externa pendiente de validación del Consejo.',
      fechaValidacion: Date.now(),
    };
  }

  throw new Error('niveles-confianza: nivel de confianza inválido');
}

/**
 * El Consejo de Custodia Gaia revisa y valida obligatoriamente los procesos de verificación
 * de los Niveles 2 y 3, y comprueba la legitimidad de certificaciones de Nivel 4.
 * Gestiona conflictos de interés: todo miembro con vínculos al Actor evaluado debe recusarse.
 */
export function validarPorConsejoCustodia(
  resultado: ResultadoVerificacion,
  miembroTieneConflicto: boolean,
): ResultadoVerificacion {
  if (miembroTieneConflicto) {
    return {
      ...resultado,
      aprobadoPorConsejoCustodia: false,
      observaciones: (resultado.observaciones || '') + ' Recusado por conflicto de interés.',
      fechaValidacion: Date.now(),
    };
  }
  return {
    ...resultado,
    aprobadoPorConsejoCustodia: true,
    fechaValidacion: Date.now(),
  };
}
