// src/core/lib/open-app-economic-mongo.ts
// Repositorios economic-sentences-graphql y open-app-mongo (org open-app) — ALRAC/Zeitnus.
// Plugin GraphQL de dominio económico + conector ssb → MongoDB.
// NO copia código fuente JavaScript de ninguno de los dos repos.
// open-app-mongo tiene licencia AGPL-3.0: se respeta (no se copia código).
// economic-sentences-graphql: licencia no verificada, precaución por defecto.
// Ambos repos abandonados (2018-2019): requiere revisión de seguridad antes de usar.

export type TipoDatoEconomico = 'frase_economica' | 'valor_economico' | 'sentencia_economica' | 'otro';

export interface PluginGraphQLEconomico {
  id: string;
  nombre: string;
  schemaGraphQL: string;
  tipoDato: TipoDatoEconomico;
  compatibleConServidorGraphQL: boolean;
  fechaRegistro: number;
}

export interface OpcionesConector {
  messageType: string | string[];
  transform?: (contenido: unknown, cb: (err: Error | null, resultado?: unknown) => void) => void;
  gte?: number;       // timestamp, default Date.now()
  concurrency?: number; // default 1
}

export interface ColeccionMongo {
  id: string;
  nombre: string;
  baseDatos: string;
  mensajesConectados: number;
  ultimaSincronizacion?: number;
}

export interface MensajeSSB {
  id: string;
  tipo: string;
  contenido: unknown;
  timestamp: number;
  clave: string;      // content-addressable key de ssb
  procesado: boolean;
}

export interface InstanciaPullAbortable {
  id: string;
  abort: (err?: Error) => void;
  estaActiva: boolean;
}

export interface ConexionSSBMongo {
  id: string;
  sbotId: string;
  coleccionId: string;
  opciones: OpcionesConector;
  instanciaAbortable: InstanciaPullAbortable;
  mensajesProcesados: number;
  errores: string[];
  fechaCreacion: number;
}

interface RespuestaALRAC {
  usarCodigoFuente: boolean;
  reimplementarLogicaPura: boolean;
  verificarLicenciaAntesDeUsar: boolean;
  revisarSeguridadCodigoAbandonado: boolean;
  respetarAGPL3: boolean;
  mapearCapasAAlRAC: boolean;
}

export interface EstadoEconomicoMongo {
  pluginsGraphQL: PluginGraphQLEconomico[];
  colecciones: ColeccionMongo[];
  mensajesSSB: MensajeSSB[];
  conexiones: ConexionSSBMongo[];
  instanciasAbortables: InstanciaPullAbortable[];
}

const CONCURRENCY_DEFECTO = 1;
const AÑOS_ABANDONO = 2;
const MILESEGUNDOS_POR_AÑO = 365 * 24 * 60 * 60 * 1000;

let pluginCounter = 0;
function nextPluginId(): string {
  pluginCounter += 1;
  return `plugin-${Date.now()}-${pluginCounter}`;
}

let conexionCounter = 0;
function nextConexionId(): string {
  conexionCounter += 1;
  return `conexion-${Date.now()}-${conexionCounter}`;
}

let mensajeCounter = 0;
function nextMensajeId(): string {
  mensajeCounter += 1;
  return `mensaje-${Date.now()}-${mensajeCounter}`;
}

let coleccionCounter = 0;
function nextColeccionId(): string {
  coleccionCounter += 1;
  return `coleccion-${Date.now()}-${coleccionCounter}`;
}

let abortCounter = 0;
function nextAbortId(): string {
  abortCounter += 1;
  return `abort-${Date.now()}-${abortCounter}`;
}

/**
 * Crea un plugin GraphQL de dominio económico.
 */
export function crearPluginGraphQLEconomico(
  nombre: string,
  schemaGraphQL: string,
  tipoDato: TipoDatoEconomico,
): PluginGraphQLEconomico {
  return {
    id: nextPluginId(),
    nombre,
    schemaGraphQL,
    tipoDato,
    compatibleConServidorGraphQL: true,
    fechaRegistro: Date.now(),
  };
}

/**
 * Crea una conexión entre scuttlebot y colección mongo.
 * Valida que las opciones sean correctas.
 */
export function crearConectorSSBMongo(
  sbotId: string,
  coleccionId: string,
  opciones: OpcionesConector,
): ConexionSSBMongo {
  const concurrency = opciones.concurrency ?? CONCURRENCY_DEFECTO;
  if (concurrency < 1) {
    throw new Error('open-app-economic-mongo: concurrency debe ser >= 1');
  }
  const gte = opciones.gte ?? Date.now();

  const instancia: InstanciaPullAbortable = {
    id: nextAbortId(),
    abort: (err?: Error) => {
      instancia.estaActiva = false;
    },
    estaActiva: true,
  };

  return {
    id: nextConexionId(),
    sbotId,
    coleccionId,
    opciones: { ...opciones, concurrency, gte },
    instanciaAbortable: instancia,
    mensajesProcesados: 0,
    errores: [],
    fechaCreacion: Date.now(),
  };
}

/**
 * Inicia la conexión ssb → mongo y devuelve la instancia abortable.
 */
export function conectarMensajesAColeccion(
  conexion: ConexionSSBMongo,
): InstanciaPullAbortable {
  if (!conexion.instanciaAbortable.estaActiva) {
    throw new Error('open-app-economic-mongo: la conexión ya fue abortada');
  }
  return conexion.instanciaAbortable;
}

/**
 * Aplica la función de transformación opcional a un mensaje.
 * Retorna null si el mensaje se filtra (callback con null).
 */
export function aplicarTransform(
  mensaje: unknown,
  transform?: OpcionesConector['transform'],
): unknown | null {
  if (!transform) return mensaje;
  let resultado: unknown = null;
  let completado = false;
  transform(mensaje, (err, res) => {
    if (err) {
      completado = true;
      return;
    }
    resultado = res;
    completado = true;
  });
  if (!completado) {
    // Transform síncrona sin callback: retornar el mensaje original
    return mensaje;
  }
  return resultado;
}

/**
 * Filtra mensajes por timestamp (solo mensajes con timestamp >= gte).
 */
export function filtrarPorGTE(mensaje: MensajeSSB, gte: number): boolean {
  return mensaje.timestamp >= gte;
}

/**
 * Valida y retorna el nivel de concurrencia (default 1 para mantener orden de mensajes).
 */
export function configurarConcurrency(concurrency?: number): number {
  return concurrency ?? CONCURRENCY_DEFECTO;
}

/**
 * Crea una instancia pull-abortable independiente.
 */
export function crearInstanciaPullAbortable(): InstanciaPullAbortable {
  return {
    id: nextAbortId(),
    abort: () => {},
    estaActiva: true,
  };
}

/**
 * Registra una colección Mongo de destino.
 */
export function registrarColeccion(
  nombre: string,
  baseDatos: string,
): ColeccionMongo {
  return {
    id: nextColeccionId(),
    nombre,
    baseDatos,
    mensajesConectados: 0,
  };
}

/**
 * Genera la respuesta del sistema ALRAC/Zeitnus ante estos repositorios.
 * Siempre afirma precaución: no copiar código, reimplementar lógica pura,
 * verificar licencia, respetar AGPL-3.0, revisar seguridad de código abandonado.
 */
export function respuestaALRAC(): RespuestaALRAC {
  return {
    usarCodigoFuente: false,
    reimplementarLogicaPura: true,
    verificarLicenciaAntesDeUsar: true,
    revisarSeguridadCodigoAbandonado: true,
    respetarAGPL3: true,
    mapearCapasAAlRAC: true,
  };
}

/**
 * Determina si el código está abandonado (último commit hace más de 2 años).
 */
export function esCodigoAbandonado(fechaUltimoCommit: number): boolean {
  const ahora = Date.now();
  const añosTranscurridos = (ahora - fechaUltimoCommit) / MILESEGUNDOS_POR_AÑO;
  return añosTranscurridos > AÑOS_ABANDONO;
}

/**
 * Construye el estado completo a partir de metadatos de los dos repos.
 */
export function construirEstadoEconomicoMongo(
  pluginsGraphQL: PluginGraphQLEconomico[],
  colecciones: ColeccionMongo[],
  mensajesSSB: MensajeSSB[],
  conexiones: ConexionSSBMongo[],
  instanciasAbortables: InstanciaPullAbortable[],
): EstadoEconomicoMongo {
  return {
    pluginsGraphQL,
    colecciones,
    mensajesSSB,
    conexiones,
    instanciasAbortables,
  };
}
