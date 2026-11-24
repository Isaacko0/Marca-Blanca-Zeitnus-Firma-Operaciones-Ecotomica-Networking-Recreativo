// src/core/lib/curativos-comunes-licencia.ts
// Licencia Curativos Comunes 1.0 — ALRAC/Zeitnus.
// Corazón: Puedes / Siempre / Nunca / Derivados.
// Cuidados-semilla: Maíz (M) Compartir igual, Frijol (F) Sin algoritmos,
// Calabaza (C) Sin lucro, Quelite (Q) Autonomía.
// Código: #CurativosComunes + CuC-[Clave] 1.0.
// Justicia comunitaria no punitiva. Tres piedras del comal.
// No es documento legal vinculante; acuerdo entre comunidades.
// NO permite privatización de derivados. NO permite entrenamiento de IA corporativa.
// NO permite acumulación capitalista ni crecimiento económico sin fin.

export type CuidadoSemilla = 'M' | 'F' | 'C' | 'Q';

export interface CorazonLicencia {
  puede: string[];           // permisos: copiar, compartir, enseñar, traducir, modificar, integrar, transformar, usar para defender y curar
  siempre: string[];         // atribución: origen, quien comparte, fecha, pueblo, territorio; aviso licencia; cambios; tecnologías/IA usadas
  nunca: string[];           // restricciones: dañar tierra, ecocidio, genocidio, extractivismo; acumulación capitalista; violencia racista/clasista/colonial/patriarcal; IA corporativa
  derivados: string[];       // no privatizar, seguir siendo bien común, licencia afín, accesible para comunidades y red CuC
}

export interface MetadatosPublicacion {
  publicante: string;        // persona, colectiva u organización
  puebloAncestral?: string;  // si aplica
  territorio: string;        // territorio desde el que se publica
  fecha: number;             // año de publicación
  licencia: string;          // código CuC
  cuidados: CuidadoSemilla[];
  link: string;              // link a la licencia completa
}

export interface LicenciaCurativosComunes {
  id: string;
  corazon: CorazonLicencia;
  cuidadosSemilla: CuidadoSemilla[];
  codigoCuC: string;         // ej. "CuC 1.0", "CuC-MFCQ 1.0"
  metadatos: MetadatosPublicacion;
  esVinculanteLegal: boolean; // siempre false
  fechaCreacion: number;
  esPublico: boolean;
}

export interface Derivado {
  id: string;
  licenciaOrigenId: string;
  tipo: 'traduccion' | 'libro' | 'investigacion' | 'video' | 'programa' | 'modelo_ia' | 'modelo_ia_ancestral' | 'otro';
  descripcion: string;
  esBienComun: boolean;      // siempre true
  licenciaAfin: string;      // licencia bajo la que se publica
  accesibleComunidades: boolean;
  fechaCreacion: number;
}

export interface ViolacionAcuerdo {
  id: string;
  licenciaId: string;
  tipo: 'ia_corporativa' | 'acumulacion_capitalista' | 'ecocidio' | 'genocidio' | 'extractivismo' | 'violencia' | 'crecimiento_sin_fin' | 'privatizacion_derivado' | 'otro';
  descripcion: string;
  quienRompe: 'publicante' | 'usuario';
  fecha: number;
  permisoPerdido: boolean;   // siempre true al detectar violación
  comunSigueVigente: boolean; // siempre true
}

export interface Reparacion {
  id: string;
  violacionId: string;
  accion: 'detener_daño' | 'recuperar_despojado' | 'evitar_repeticion' | 'devolver_comunes';
  descripcion: string;
  fecha: number;
}

export interface TresPiedrasDelComal {
  pregunta1: string; // ¿digno para personas-comunidades, sin extraer ni acumular?
  pregunta2: string; // ¿respetar territorios y espíritus?
  pregunta3: string; // ¿cura de la Madre Tierra?
}

const CUIDADOS_VALIDOS: CuidadoSemilla[] = ['M', 'F', 'C', 'Q'];

const CORAZON_DEFECTO: CorazonLicencia = {
  puede: [
    'copiar', 'compartir', 'enseñar', 'traducir a cualquier lengua',
    'modificar para aprender', 'integrar al trabajo', 'transformar',
    'usar para defender y curar el cuerpo, el territorio y el espíritu',
  ],
  siempre: [
    'mencionar de dónde viene: nombre del material, quién lo comparte, fecha, pueblo y territorio',
    'mantener el aviso de la licencia con sus cuidados',
    'mencionar si se hicieron cambios o modificaciones',
    'aclarar si se usaron tecnologías digitales o IA y cuáles fueron los cuidados',
  ],
  nunca: [
    'dañar a la tierra, a sus pueblos o a las personas: ecocidio, genocidio, extractivismo',
    'fines capitalistas o de acumulación: crecimiento económico sin fin',
    'ejercer o promover violencia racista, clasista, colonial o patriarcal',
    'entrenar, ajustar o almacenar una inteligencia artificial corporativa',
  ],
  derivados: [
    'los derivados no se pueden privatizar',
    'todo derivado debe seguir siendo un bien común',
    'publicarse con esta licencia u otra afín',
    'accesible para las comunidades y la red CuC',
  ],
};

let licenciaIdCounter = 0;
function nextLicenciaId(): string {
  licenciaIdCounter += 1;
  return `cuc-${Date.now()}-${licenciaIdCounter}`;
}

function ordenarCuidados(cuidados: CuidadoSemilla[]): string {
  const orden: Record<CuidadoSemilla, number> = { M: 0, F: 1, C: 2, Q: 3 };
  return [...cuidados].sort((a, b) => orden[a] - orden[b]).join('');
}

/**
 * Crea una licencia Curativos Comunes con el corazón por defecto y los
 * cuidados-semilla indicados. Genera el código CuC correspondiente.
 */
export function crearLicencia(
  metadatos: Omit<MetadatosPublicacion, 'licencia' | 'cuidados'>,
  cuidadosSemilla: CuidadoSemilla[] = [],
): LicenciaCurativosComunes {
  // Validar cuidados duplicados o inválidos
  const cuidadosUnicos = [...new Set(cuidadosSemilla)];
  for (const c of cuidadosUnicos) {
    if (!CUIDADOS_VALIDOS.includes(c)) {
      throw new Error('curativos-comunes-licencia: cuidado-semilla inválido');
    }
  }

  const codigo = `CuC${ordenarCuidados(cuidadosUnicos) ? '-' + ordenarCuidados(cuidadosUnicos) : ''} 1.0`;

  return {
    id: nextLicenciaId(),
    corazon: { ...CORAZON_DEFECTO },
    cuidadosSemilla: cuidadosUnicos,
    codigoCuC: codigo,
    metadatos: {
      ...metadatos,
      licencia: codigo,
      cuidados: cuidadosUnicos,
    },
    esVinculanteLegal: false,
    fechaCreacion: Date.now(),
    esPublico: true,
  };
}

/**
 * Agrega un cuidado-semilla a una licencia existente.
 */
export function agregarCuidadoSemilla(
  licencia: LicenciaCurativosComunes,
  cuidado: CuidadoSemilla,
): LicenciaCurativosComunes {
  if (licencia.cuidadosSemilla.includes(cuidado)) {
    return licencia;
  }
  const nuevosCuidados = [...licencia.cuidadosSemilla, cuidado];
  const codigo = `CuC${ordenarCuidados(nuevosCuidados)} 1.0`;
  return {
    ...licencia,
    cuidadosSemilla: nuevosCuidados,
    codigoCuC: codigo,
    metadatos: { ...licencia.metadatos, licencia: codigo, cuidados: nuevosCuidados },
  };
}

/**
 * Valida que los metadatos de publicación estén completos.
 */
export function validarMetadatos(
  metadatos: Omit<MetadatosPublicacion, 'licencia' | 'cuidados'>,
): { valido: boolean; faltantes: string[] } {
  const faltantes: string[] = [];
  if (!metadatos.publicante?.trim()) faltantes.push('publicante');
  if (!metadatos.territorio?.trim()) faltantes.push('territorio');
  if (!metadatos.fecha || metadatos.fecha <= 0) faltantes.push('fecha');
  if (!metadatos.link?.trim()) faltantes.push('link');
  return { valido: faltantes.length === 0, faltantes };
}

/**
 * Evalúa si un uso está permitido según el corazón y los cuidados-semilla.
 * Retorna true si el uso está dentro de "Puedes" y no viola "Nunca".
 */
export function esUsoPermitido(
  uso: string,
  licencia: LicenciaCurativosComunes,
): boolean {
  if (esUsoProhibido(uso, licencia)) return false;
  // Los permisos del corazón son amplios; si no está prohibido, está permitido
  // sujeto a los cuidados-semilla (ej. Q bloquea estados/corporaciones).
  return true;
}

/**
 * Detecta si un uso viola las restricciones "Nunca" del corazón.
 */
export function esUsoProhibido(
  uso: string,
  licencia: LicenciaCurativosComunes,
): boolean {
  const u = uso.toLowerCase();
  const prohibiciones = [
    'ia corporativa', 'inteligencia artificial corporativa',
    'entrenar', 'ajustar', 'almacenar una inteligencia artificial corporativa',
    'acumulación', 'acumular', 'crecimiento económico sin fin',
    'ecocidio', 'genocidio', 'extractivismo',
    'violencia racista', 'violencia clasista', 'violencia colonial', 'violencia patriarcal',
    'dañar a la tierra', 'dañar a sus pueblos',
  ];
  return prohibiciones.some((p) => u.includes(p));
}

/**
 * Determina si un derivado puede ser privatizado.
 * Regla del corazón: los derivados nunca se pueden privatizar.
 */
export function esDerivadoPrivatizable(): boolean {
  return false;
}

/**
 * Retorna las tres preguntas hermenéuticas del comal para interpretación ante duda.
 */
export function evaluarTresPiedrasDelComal(): TresPiedrasDelComal {
  return {
    pregunta1:
      '¿Lo que estoy publicando es digno para las personas-comunidades, sin extraer de ellas ni acumular a su costa?',
    pregunta2:
      '¿Lo que estoy publicando respeta a los territorios y a los espíritus que en ellos habitan?',
    pregunta3:
      '¿Lo que estoy publicando es cura de la Madre Tierra?',
  };
}

/**
 * Procesa una violación del acuerdo. Quien rompe pierde el permiso;
 * el común sigue vigente para las demás.
 */
export function procesarViolacion(
  licenciaId: string,
  tipo: ViolacionAcuerdo['tipo'],
  descripcion: string,
  quienRompe: ViolacionAcuerdo['quienRompe'],
): ViolacionAcuerdo {
  return {
    id: `viol-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    licenciaId,
    tipo,
    descripcion,
    quienRompe,
    fecha: Date.now(),
    permisoPerdido: true,
    comunSigueVigente: true,
  };
}

/**
 * Asigna una acción de reparación tras una violación.
 * Justicia comunitaria no punitiva: detener daño, recuperar, evitar repetición, devolver como comunes.
 */
export function asignarReparacion(
  violacionId: string,
  accion: Reparacion['accion'],
  descripcion: string,
): Reparacion {
  return {
    id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    violacionId,
    accion,
    descripcion,
    fecha: Date.now(),
  };
}

/**
 * Verifica si el cuidado Quelite (Q) bloquea el uso por estados-nación, ejércitos o corporaciones.
 */
export function cuidadoQBloqueaEntidad(
  entidad: 'estado_nacion' | 'ejercito' | 'corporacion' | 'persona' | 'centro_educativo',
  licencia: LicenciaCurativosComunes,
): boolean {
  if (!licencia.cuidadosSemilla.includes('Q')) return false;
  return entidad === 'estado_nacion' || entidad === 'ejercito' || entidad === 'corporacion';
}
