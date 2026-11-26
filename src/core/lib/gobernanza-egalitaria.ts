// src/core/lib/gobernanza-egalitaria.ts
// Gobernanza Egalitaria — ALRAC/Zeitnus.
// Jerarquía de dominancia inversa (Christopher Boehm): el grupo suprime
// activamente a cualquier individuo que intente acumular poder o recursos
// sin aportar productivamente. No es ausencia de liderazgo, es liderazgo
// condicionado al aporte.
// NO permite jerarquía piramidal. NO permite poder sin contribución.

export type MetodoSupresion = 'ridiculo' | 'ostracismo' | 'exclusion' | 'votacion_colectiva';

export interface MecanismoSupresion {
  id: string;
  objetivo: string;
  tipoAcumulacion: 'poder' | 'recursos' | 'ambos';
  metodoSupresion: MetodoSupresion;
  aprobadoPorGrupo: boolean;   // 1a1v
  fecha: number;
  activo: boolean;
}

export interface DecisionColectiva {
  id: string;
  tema: string;
  votos: Array<{
    participanteId: string;
    voto: 'si' | 'no' | 'abstencion';
  }>;
  resultado: 'aprobado' | 'rechazado' | 'empate';
  fecha: number;
}

let supresionCounter = 0;
let decisionCounter = 0;

function nextSupresionId(): string {
  supresionCounter += 1;
  return `supresion-${Date.now()}-${supresionCounter}`;
}

function nextDecisionId(): string {
  decisionCounter += 1;
  return `decision-${Date.now()}-${decisionCounter}`;
}

/**
 * Aplica jerarquía de dominancia inversa: el grupo suprime a un individuo
 * que intenta acumular poder o recursos sin aportar. Requiere aprobación
 * colectiva (1a1v).
 */
export function aplicarJerarquiaDominanciaInversa(
  datos: Omit<MecanismoSupresion, 'id' | 'fecha' | 'activo'>,
): MecanismoSupresion {
  if (!datos.aprobadoPorGrupo) {
    throw new Error('gobernanza-egalitaria: la supresión requiere aprobación del grupo (1a1v)');
  }
  return {
    ...datos,
    id: nextSupresionId(),
    fecha: Date.now(),
    activo: true,
  };
}

/**
 * Registra una decisión colectiva con votos 1a1v.
 */
export function registrarDecisionColectiva(
  datos: Omit<DecisionColectiva, 'id' | 'fecha'>,
): DecisionColectiva {
  const votosSi = datos.votos.filter((v) => v.voto === 'si').length;
  const votosNo = datos.votos.filter((v) => v.voto === 'no').length;
  const votosAbst = datos.votos.filter((v) => v.voto === 'abstencion').length;
  const total = votosSi + votosNo + votosAbst;

  let resultado: DecisionColectiva['resultado'];
  if (total === 0) {
    resultado = 'empate';
  } else if (votosSi > votosNo) {
    resultado = 'aprobado';
  } else if (votosNo > votosSi) {
    resultado = 'rechazado';
  } else {
    resultado = 'empate';
  }

  return {
    ...datos,
    id: nextDecisionId(),
    fecha: Date.now(),
    resultado,
  };
}

/**
 * Suprime una acumulación de poder o recursos sin aporte productivo.
 * Wrapper sobre aplicarJerarquiaDominanciaInversa con validación de tipo.
 */
export function suprimirAcumulacionSinAporte(
  objetivo: string,
  tipoAcumulacion: MecanismoSupresion['tipoAcumulacion'],
  metodoSupresion: MetodoSupresion,
  aprobadoPorGrupo: boolean,
): MecanismoSupresion {
  return aplicarJerarquiaDominanciaInversa({
    objetivo,
    tipoAcumulacion,
    metodoSupresion,
    aprobadoPorGrupo,
  });
}

/**
 * Verifica si un mecanismo de supresión está activo.
 */
export function esSupresionActiva(mecanismo: MecanismoSupresion): boolean {
  return mecanismo.activo && mecanismo.aprobadoPorGrupo;
}

/**
 * Verifica si una decisión colectiva fue aprobada.
 */
export const decisionAprobada = (decision: DecisionColectiva): boolean =>
  decision.resultado === 'aprobado';
