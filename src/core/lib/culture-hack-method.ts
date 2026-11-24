// src/core/lib/culture-hack-method.ts
// The Culture Hack Method — ALRAC/Zeitnus.
// Narrative-Led Systems Change: Justice plus Onto-Shift.
// 7 módulos: Introducción, Ask, Listen, Understand, Recode, Hack.
// Método vivo y adaptable. NO usa plataforma web externa. NO copia casos de estudio.
// Límites duros: no manipulación narrativa sin justicia, no onto-shift sin consentimiento,
// no narrativas extractivas.

export type ModuloMetodo =
  | 'introduccion'
  | 'ask'
  | 'listen'
  | 'understand'
  | 'recode'
  | 'hack';

export type TecnicaEscucha = 'big_listening' | 'small_listening';

export interface PuntoDeVista {
  id: string;
  contexto: string;
  objetivos: string[];
  identidad: string;
  motivacion: string;
  resultadosDeseados: string[];
  metodosCambio: string[];
}

export interface ModeloEscucha {
  id: string;
  puntoDeVistaId: string;
  tecnicas: TecnicaEscucha[];
  datosRecopilados: string[];
  comunidadesIdentificadas: string[];
}

export interface ComunidadNarrativa {
  id: string;
  nombre: string;
  espacioNarrativo: string;
  patrones: string[];
  posiciones: string[];
}

export interface AnalisisANP {
  id: string;
  comunidadId: string;
  atencion: string;
  red: string;
  poder: string;
  lenguaje: string;
}

export interface EjeJusticiaOntologia {
  id: string;
  comunidadId: string;
  ejeJusticia: string;
  ejeOntologia: string;
  patron: string;
  posicion: string;
}

export interface WindowDiscurso {
  id: string;
  ubicacionActual: string;
  desplazamientoDeseado: string;
  fundamento: string;
}

export interface EstrategiaNarrativa {
  id: string;
  audiencias: string[];
  objetivosNarrativos: string[];
  reencuadre: string;
}

export interface HackingTree {
  id: string;
  medio: string;
  meme: string;
  tono: string;
  hack: string;
  logistica: string;
  evaluacion: string;
}

export interface PasoMetodo {
  numero: number; // 1-5
  nombre: string;
  completado: boolean;
  evidenciaId?: string;
}

export interface CultureHackMethod {
  id: string;
  modulos: Map<ModuloMetodo, string>; // nombre del módulo
  pasos: PasoMetodo[];
  puntoDeVista?: PuntoDeVista;
  modeloEscucha?: ModeloEscucha;
  comunidades: Map<string, ComunidadNarrativa>;
  analizasANP: Map<string, AnalisisANP>;
  ejesJusticiaOntologia: Map<string, EjeJusticiaOntologia>;
  windowDiscurso?: WindowDiscurso;
  estrategiaNarrativa?: EstrategiaNarrativa;
  hackingTree?: HackingTree;
  fechaCreacion: number;
  esVivo: boolean; // siempre true
}

let methodIdCounter = 0;
function nextMethodId(): string {
  methodIdCounter += 1;
  return `chm-${Date.now()}-${methodIdCounter}`;
}

let entityIdCounter = 0;
function nextEntityId(): string {
  entityIdCounter += 1;
  return `chm-ent-${Date.now()}-${entityIdCounter}`;
}

const MODULOS_DEFECTO: Map<ModuloMetodo, string> = new Map([
  ['introduccion', 'Metacrisis, raíces culturales, poder de las narrativas, Justice plus Onto-Shift'],
  ['ask', 'Point of View: contexto, objetivos, identidad, motivación, resultados deseados, métodos de cambio'],
  ['listen', 'Listening Model, Narrative Communities, big/small listening'],
  ['understand', 'Attention, Network and Power, Language, Justice-Ontology axes, Window of Discourse'],
  ['recode', 'Narrative Strategy: Audiences, Narrative Objectives, reframe'],
  ['hack', 'Medio, mensaje, palabras, Hacking Tree (Media, Meme, Tone, Hack), Logistics, Evaluation & Iteration'],
]);

/**
 * Crea una instancia del método Culture Hack con los 7 módulos iniciales.
 * El método es vivo (esVivo = true) y adaptable.
 */
export function crearMetodo(): CultureHackMethod {
  return {
    id: nextMethodId(),
    modulos: new Map(MODULOS_DEFECTO),
    pasos: [],
    comunidades: new Map(),
    analizasANP: new Map(),
    ejesJusticiaOntologia: new Map(),
    fechaCreacion: Date.now(),
    esVivo: true,
  };
}

/**
 * Registra un paso del método (1-5: Ask, Listen, Understand, Recode, Hack).
 */
export function registrarPaso(
  metodo: CultureHackMethod,
  numero: PasoMetodo['numero'],
  nombre: string,
): PasoMetodo {
  if (numero < 1 || numero > 5) {
    throw new Error('culture-hack-method: número de paso debe estar entre 1 y 5');
  }
  const paso: PasoMetodo = {
    numero,
    nombre,
    completado: false,
  };
  metodo.pasos.push(paso);
  return paso;
}

/**
 * Crea un Point of View statement.
 */
export function crearPuntoDeVista(
  metodo: CultureHackMethod,
  datos: Omit<PuntoDeVista, 'id'>,
): PuntoDeVista {
  const pov: PuntoDeVista = {
    ...datos,
    id: nextEntityId(),
  };
  metodo.puntoDeVista = pov;
  return pov;
}

/**
 * Crea un Listening Model a partir de un POV.
 */
export function crearModeloEscucha(
  metodo: CultureHackMethod,
  datos: Omit<ModeloEscucha, 'id'>,
): ModeloEscucha {
  const modelo: ModeloEscucha = {
    ...datos,
    id: nextEntityId(),
  };
  metodo.modeloEscucha = modelo;
  return modelo;
}

/**
 * Identifica una comunidad narrativa en el espacio narrativo.
 */
export function identificarComunidadNarrativa(
  metodo: CultureHackMethod,
  datos: Omit<ComunidadNarrativa, 'id'>,
): ComunidadNarrativa {
  const comunidad: ComunidadNarrativa = {
    ...datos,
    id: nextEntityId(),
  };
  metodo.comunidades.set(comunidad.id, comunidad);
  return comunidad;
}

/**
 * Analiza Attention, Network, Power y Language de una comunidad.
 */
export function analizarANP(
  metodo: CultureHackMethod,
  comunidadId: string,
  atencion: string,
  red: string,
  poder: string,
  lenguaje: string,
): AnalisisANP {
  if (!metodo.comunidades.has(comunidadId)) {
    throw new Error('culture-hack-method: comunidad narrativa no encontrada');
  }
  const analisis: AnalisisANP = {
    id: nextEntityId(),
    comunidadId,
    atencion,
    red,
    poder,
    lenguaje,
  };
  metodo.analizasANP.set(analisis.id, analisis);
  return analisis;
}

/**
 * Mapea una comunidad usando ejes de Justicia y Ontología.
 */
export function mapearEjesJusticiaOntologia(
  metodo: CultureHackMethod,
  comunidadId: string,
  ejeJusticia: string,
  ejeOntologia: string,
  patron: string,
  posicion: string,
): EjeJusticiaOntologia {
  if (!metodo.comunidades.has(comunidadId)) {
    throw new Error('culture-hack-method: comunidad narrativa no encontrada');
  }
  const eje: EjeJusticiaOntologia = {
    id: nextEntityId(),
    comunidadId,
    ejeJusticia,
    ejeOntologia,
    patron,
    posicion,
  };
  metodo.ejesJusticiaOntologia.set(eje.id, eje);
  return eje;
}

/**
 * Identifica la Window of Discourse: ubicación actual y desplazamiento deseado.
 */
export function identificarWindowDiscurso(
  metodo: CultureHackMethod,
  ubicacionActual: string,
  desplazamientoDeseado: string,
  fundamento: string,
): WindowDiscurso {
  const window: WindowDiscurso = {
    id: nextEntityId(),
    ubicacionActual,
    desplazamientoDeseado,
    fundamento,
  };
  metodo.windowDiscurso = window;
  return window;
}

/**
 * Crea una estrategia narrativa: audiencias, objetivos, reframe.
 */
export function crearEstrategiaNarrativa(
  metodo: CultureHackMethod,
  audiencias: string[],
  objetivosNarrativos: string[],
  reencuadre: string,
): EstrategiaNarrativa {
  const estrategia: EstrategiaNarrativa = {
    id: nextEntityId(),
    audiencias,
    objetivosNarrativos,
    reencuadre,
  };
  metodo.estrategiaNarrativa = estrategia;
  return estrategia;
}

/**
 * Construye el Hacking Tree: medio, meme, tono, hack, logística, evaluación.
 */
export function construirHackingTree(
  metodo: CultureHackMethod,
  medio: string,
  meme: string,
  tono: string,
  hack: string,
  logistica: string,
  evaluacion: string,
): HackingTree {
  const tree: HackingTree = {
    id: nextEntityId(),
    medio,
    meme,
    tono,
    hack,
    logistica,
    evaluacion,
  };
  metodo.hackingTree = tree;
  return tree;
}

/**
 * Procesa evaluación e iteración de un paso (método vivo).
 */
export function evaluarEIterar(
  metodo: CultureHackMethod,
  pasoNumero: number,
  evaluacion: string,
  iteracion: string,
): void {
  const paso = metodo.pasos.find((p) => p.numero === pasoNumero);
  if (!paso) {
    throw new Error('culture-hack-method: paso no encontrado');
  }
  paso.completado = true;
  paso.evidenciaId = `eval-${Date.now()}`;
  // En una implementación completa, la evaluación e iteración se almacenarían
  // en el estado; aquí se registra la completación del paso.
  void evaluacion;
  void iteracion;
}

/**
 * Confirma que el método es vivo y adaptable.
 */
export function esMetodoVivo(): boolean {
  return true;
}
