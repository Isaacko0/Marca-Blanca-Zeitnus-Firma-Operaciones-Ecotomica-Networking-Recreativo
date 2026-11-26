// src/core/lib/sistema-alraico.ts
// Sistema Alráico — Principio de Incapacidad, 17 reglas, grafo ℵ, Modo Compacto — ALRAC/Zeitnus.
// Documento filosófico-sistémico bajo CC0 1.0 (dominio público).
// NO copia notación simbólica como sintaxis obligatoria. Módulo de dominio puro en TypeScript.

export type NodoId = string;
export type AristaId = string;
export type ReglaId = string;
export type SesionId = string;

/** Principio de Incapacidad: expresión y su uso */
export type PIExpr = 'G_equiv_Omniscience' | 'Xi';

export interface ReglaALRAC {
  id: ReglaId;
  numero: number; // 1-17
  titulo: string;
  contenido: string;
  tipo: 'anti-regla';
  activa: boolean;
}

export interface NodoALRAC {
  id: NodoId;
  nombre: string;
  explicacion: string;
  sentencia?: string; // fórmula simbólica, opcional
  interpretacion?: string;
  nivel: number; // 1 = raíz, >1 = descomposición
  fechaCreacion: number;
}

export interface AristaALRAC {
  id: AristaId;
  origen: NodoId;
  destino: NodoId;
  tipo: 'expansion' | 'simplificacion' | 'derivacion' | 'implicacion';
  fechaCreacion: number;
}

export interface SimboloModoCompacto {
  simbolo: string;
  concepto: string;
  definicionTecnica: string;
  funcionEnProtocolo: string;
}

/** Sesión de verificación triaxial */
export interface SesionVerificacionTriaxial {
  id: SesionId;
  claim: string;
  ejeMental: boolean;        // coherencia lógica interna
  ejeSimulacion: boolean;    // capacidad de modelar fenómenos conocidos
  ejeLaboratorio?: boolean;  // verificación empírica (cuando aplica)
  verificada: boolean;
  fecha: number;
}

/** Sesión de transducción entre dominios */
export interface SesionTransduccion {
  id: SesionId;
  dominioOrigen: string;
  dominioDestino: string;
  setCredeofiloOrigen: string[]; // elementos de 𝕮 en origen
  isomorfismoIdentificado: string;
  operadoresFisicos: string[];   // resultado de F: {Nodos} → {Operadores Físicos}
  exitosa: boolean;
  fecha: number;
}

/** Sesión de reconfiguración consciente (γ-CARMIS) */
export interface SesionReconfiguracion {
  id: SesionId;
  motivo: string;           // ej. "ΣPᵢ > κ" (sobrecarga)
  estadoAnterior: 'estable' | 'sobrecargado';
  estadoPosterior: 'reorganizado' | 'estable';
  activada: boolean;
  fecha: number;
}

/** Límite cognitivo (FCP, TAD, HD, etc.) */
export interface LimiteCognitivo {
  id: string;
  codigo: string;           // ej. 'FCP', 'TAD', 'HD'
  nombre: string;
  descripcion: string;
  tipo: 'sesgo_cognitivo';
  detectado: boolean;
  fechaDeteccion?: number;
}

export interface EstadoSistemaAlraico {
  reglas: ReglaALRAC[];
  nodos: NodoALRAC[];
  aristas: AristaALRAC[];
  simbolosModoCompacto: SimboloModoCompacto[];
  sesionesVerificacion: SesionVerificacionTriaxial[];
  sesionesTransduccion: SesionTransduccion[];
  sesionesReconfiguracion: SesionReconfiguracion[];
  limitesCognitivos: LimiteCognitivo[];
}

let reglaCounter = 0;
let nodoCounter = 0;
let aristaCounter = 0;
let sesionVerifCounter = 0;
let sesionTransCounter = 0;
let sesionCarmisCounter = 0;
let limiteCounter = 0;

function nextReglaId(): ReglaId {
  reglaCounter += 1;
  return `regla-alraico-${Date.now()}-${reglaCounter}`;
}

function nextNodoId(): NodoId {
  nodoCounter += 1;
  return `nodo-alraico-${Date.now()}-${nodoCounter}`;
}

function nextAristaId(): AristaId {
  aristaCounter += 1;
  return `arista-alraico-${Date.now()}-${aristaCounter}`;
}

function nextSesionVerifId(): SesionId {
  sesionVerifCounter += 1;
  return `verif-alraico-${Date.now()}-${sesionVerifCounter}`;
}

function nextSesionTransId(): SesionId {
  sesionTransCounter += 1;
  return `trans-alraico-${Date.now()}-${sesionTransCounter}`;
}

function nextSesionCarmisId(): SesionId {
  sesionCarmisCounter += 1;
  return `carmis-alraico-${Date.now()}-${sesionCarmisCounter}`;
}

function nextLimiteId(): string {
  limiteCounter += 1;
  return `limite-alraico-${Date.now()}-${limiteCounter}`;
}

/**
 * Crea una instancia del Sistema Alráico con el Principio de Incapacidad
 * y las 17 anti-reglas base.
 */
export function crearSistemaAlraico(): EstadoSistemaAlraico {
  const reglasBase: ReglaALRAC[] = [
    { id: nextReglaId(), numero: 1, titulo: 'El sistema no depende del investigador', contenido: 'El investigador sigue, no inventa.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 2, titulo: 'El sistema debe ser falseable y autosostenible', contenido: 'Debe responder a condiciones, concatenarse con sus principios, sin contradicciones internas.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 3, titulo: 'Sustitución de "verdad" por "seguimiento de coherencia"', contenido: 'Trabaja con líneas y puntos lógicos, no con verdad absoluta.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 4, titulo: 'Conceptos huecos', contenido: 'Palabras/símbolos sin significado fijo, definidos por interacción.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 5, titulo: 'Uso simultáneo de razón y sentidos, sin ser conclusivos', contenido: 'Ni razón ni sentidos son fiables solos; se usan sin autoridad final.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 6, titulo: 'Independencia del punto de vista del autor', contenido: 'El sistema no depende del autor.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 7, titulo: 'Las ciencias exactas y la lógica son sugerencias, no fuentes de verdad', contenido: 'Se usan como apoyo, no se les somete.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 8, titulo: 'La filosofía es apoyo, no fundamento', contenido: 'Posturas filosóficas como contexto, no base.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 9, titulo: 'El orden lo da el sistema, no la tradición', contenido: 'El sistema descubre su propio orden.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 10, titulo: 'Cuestionamientos e hipótesis son alternos al sistema', contenido: 'El sistema responde por sí mismo a su tiempo.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 11, titulo: 'Ciencias humanas y biología son apoyo, no fundamento', contenido: 'Contexto, no cimiento.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 12, titulo: 'Las citas de textos son alternas al sistema', contenido: 'No son prueba ni fundamento.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 13, titulo: 'Todo lo alterno es asistencia (método Li)', contenido: 'Asistencia, no sistema.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 14, titulo: 'Las teorías de irresolubles deben ser respondidas', contenido: 'Genio malvado de Descartes, Russell, simulación, solipsismo, eterno retorno.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 15, titulo: 'No inventar caminos, solo seguir y construir el grafo', contenido: 'El grafo crece por seguimiento, no por imposición.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 16, titulo: 'La lógica por inherencias es el sistema de seguimiento', contenido: 'Método principal de seguimiento.', tipo: 'anti-regla', activa: true },
    { id: nextReglaId(), numero: 17, titulo: 'El sistema debe poder expresarse en otras palabras', contenido: 'Cualquier agente puede seguirlo y reformularlo.', tipo: 'anti-regla', activa: true },
  ];

  const simbolosBase: SimboloModoCompacto[] = [
    { simbolo: 'B', concepto: 'Espacio cognoscible', definicionTecnica: 'Topología (τ₈) no compacta', funcionEnProtocolo: 'Marco de referencia total' },
    { simbolo: 'A', concepto: 'Subespacio cognitivo', definicionTecnica: 'Subconjunto localmente compacto de B', funcionEnProtocolo: 'Espacio operativo del observador' },
    { simbolo: 'C', concepto: 'Incapacidad', definicionTecnica: 'C = B \\ A, denso en B', funcionEnProtocolo: 'Límite estructural inevitable' },
    { simbolo: 'PI', concepto: 'Principio de Incapacidad', definicionTecnica: '∀γ ∈ P(a,bᵢ), γ ∩ C ≠ ∅', funcionEnProtocolo: 'Base epistemológica' },
    { simbolo: '𝕮', concepto: 'Conjunto Credeófilo', definicionTecnica: 'Crecimiento/decrecimiento/oscilación/finitud/logística', funcionEnProtocolo: 'Unidad relacional básica del sistema' },
    { simbolo: 'κ', concepto: 'Umbral crítico', definicionTecnica: 'Punto de transición de fase', funcionEnProtocolo: 'Activación de reconfiguración' },
    { simbolo: 'γ-CARMIS', concepto: 'Mecanismo de reconfiguración', definicionTecnica: 'Activado cuando ΣPᵢ > κ', funcionEnProtocolo: 'Protocolo de emergencia consciente (reinicio/reorganización)' },
    { simbolo: 'FCP', concepto: 'Facilidad Cognitiva Patológica', definicionTecnica: 'Salto B → D evitando confrontar I', funcionEnProtocolo: 'Sesgo por evitación de incapacidad' },
    { simbolo: 'TAD', concepto: 'Tolerancia Ambiental Disfuncional', definicionTecnica: 'Explotar demora entre acción y consecuencia', funcionEnProtocolo: 'Sesgo por latencia de retroalimentación' },
    { simbolo: 'HD', concepto: 'Herencia Degenerativa', definicionTecnica: 'Decisiones basadas en dogmas/memoria desconectada', funcionEnProtocolo: 'Patrón de sesgo epistémico' },
  ];

  return {
    reglas: reglasBase,
    nodos: [],
    aristas: [],
    simbolosModoCompacto: simbolosBase,
    sesionesVerificacion: [],
    sesionesTransduccion: [],
    sesionesReconfiguracion: [],
    limitesCognitivos: [],
  };
}

/**
 * Registra un nodo en el grafo generativo ℵ.
 */
export function registrarNodo(
  estado: EstadoSistemaAlraico,
  nombre: string,
  explicacion: string,
  nivel: number,
  sentencia?: string,
  interpretacion?: string,
): NodoALRAC {
  const nodo: NodoALRAC = {
    id: nextNodoId(),
    nombre,
    explicacion,
    sentencia,
    interpretacion,
    nivel,
    fechaCreacion: Date.now(),
  };
  return {
    ...estado,
    nodos: [...estado.nodos, nodo],
  };
}

/**
 * Registra una arista entre dos nodos del grafo.
 */
export function registrarArista(
  estado: EstadoSistemaAlraico,
  origen: NodoId,
  destino: NodoId,
  tipo: AristaALRAC['tipo'],
): AristaALRAC {
  const origenExiste = estado.nodos.some((n) => n.id === origen);
  const destinoExiste = estado.nodos.some((n) => n.id === destino);
  if (!origenExiste || !destinoExiste) {
    throw new Error('sistema-alraico: nodo de origen o destino no encontrado');
  }
  const arista: AristaALRAC = {
    id: nextAristaId(),
    origen,
    destino,
    tipo,
    fechaCreacion: Date.now(),
  };
  return {
    ...estado,
    aristas: [...estado.aristas, arista],
  };
}

/**
 * Ejecuta una verificación triaxial de un claim.
 */
export function ejecutarVerificacionTriaxial(
  estado: EstadoSistemaAlraico,
  claim: string,
  ejeMental: boolean,
  ejeSimulacion: boolean,
  ejeLaboratorio?: boolean,
): SesionVerificacionTriaxial {
  const sesion: SesionVerificacionTriaxial = {
    id: nextSesionVerifId(),
    claim,
    ejeMental,
    ejeSimulacion,
    ejeLaboratorio,
    verificada: ejeMental && ejeSimulacion && (ejeLaboratorio !== undefined ? ejeLaboratorio : true),
    fecha: Date.now(),
  };
  return {
    ...estado,
    sesionesVerificacion: [...estado.sesionesVerificacion, sesion],
  };
}

/**
 * Ejecuta una transducción entre dominios (F: {Nodos} → {Operadores Físicos}).
 */
export function ejecutarTransduccion(
  estado: EstadoSistemaAlraico,
  dominioOrigen: string,
  dominioDestino: string,
  setCredeofiloOrigen: string[],
  isomorfismoIdentificado: string,
  operadoresFisicos: string[],
): SesionTransduccion {
  const sesion: SesionTransduccion = {
    id: nextSesionTransId(),
    dominioOrigen,
    dominioDestino,
    setCredeofiloOrigen: [...setCredeofiloOrigen],
    isomorfismoIdentificado,
    operadoresFisicos: [...operadoresFisicos],
    exitosa: operadoresFisicos.length > 0,
    fecha: Date.now(),
  };
  return {
    ...estado,
    sesionesTransduccion: [...estado.sesionesTransduccion, sesion],
  };
}

/**
 * Activa el mecanismo de reconfiguración consciente (γ-CARMIS).
 */
export function activarGammaCarmis(
  estado: EstadoSistemaAlraico,
  motivo: string,
): SesionReconfiguracion {
  const sesion: SesionReconfiguracion = {
    id: nextSesionCarmisId(),
    motivo,
    estadoAnterior: 'sobrecargado',
    estadoPosterior: 'reorganizado',
    activada: true,
    fecha: Date.now(),
  };
  return {
    ...estado,
    sesionesReconfiguracion: [...estado.sesionesReconfiguracion, sesion],
  };
}

/**
 * Registra un límite cognitivo detectado (FCP, TAD, HD, etc.).
 */
export function registrarLimiteCognitivo(
  estado: EstadoSistemaAlraico,
  codigo: string,
  nombre: string,
  descripcion: string,
): LimiteCognitivo {
  const limite: LimiteCognitivo = {
    id: nextLimiteId(),
    codigo,
    nombre,
    descripcion,
    tipo: 'sesgo_cognitivo',
    detectado: true,
    fechaDeteccion: Date.now(),
  };
  return {
    ...estado,
    limitesCognitivos: [...estado.limitesCognitivos, limite],
  };
}

/**
 * Corrige una estibación (sustancialización indebida de un concepto).
 */
export function corregirEstibacion(
  estado: EstadoSistemaAlraico,
  conceptoSustancializado: string,
  relacionCorregida: string,
): EstadoSistemaAlraico {
  // La corrección de estibación se registra como una arista de simplificación
  // desde el concepto sustancializado hacia su configuración relacional.
  return {
    ...estado,
    nodos: estado.nodos.map((n) =>
      n.nombre === conceptoSustancializado
        ? { ...n, explicacion: `${n.explicacion} [corregido: ${relacionCorregida}]` }
        : n,
    ),
  };
}

/**
 * Verifica si el Principio de Incapacidad está activo en el sistema.
 */
export function verificarPI(estado: EstadoSistemaAlraico): boolean {
  return estado.reglas.some((r) => r.numero === 1 && r.activa === true);
}

/**
 * Obtiene todas las reglas activas.
 */
export function listarReglasActivas(estado: EstadoSistemaAlraico): ReglaALRAC[] {
  return estado.reglas.filter((r) => r.activa);
}

/**
 * Obtiene los símbolos del Modo Compacto por función de protocolo.
 */
export function obtenerSimbolosPorFuncion(
  estado: EstadoSistemaAlraico,
  funcion: string,
): SimboloModoCompacto[] {
  return estado.simbolosModoCompacto.filter((s) =>
    s.funcionEnProtocolo.includes(funcion),
  );
}
