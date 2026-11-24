// src/core/lib/open-app-graphql-server.ts
// Repositorio open-app-graphql-server — Servidor GraphQL con plugin system — ALRAC/Zeitnus.
// Servidor GraphQL que soporta schemas como plugins para protocolos distribuidos (ssb, dat).
// Plugin económico (economic-sentences). Blobs vía ssb-serve-blobs.
// NO copia código fuente JavaScript del repositorio original. NO asume schemas no documentados.
// NO accede a despliegues externos. Licencia no verificada: precaución por defecto.

export type ProtocoloPlugin = 'ssb' | 'dat' | 'economic' | 'fs' | 'flumedb' | 'otro';
export type TipoSchema = 'query' | 'mutation' | 'subscription' | 'type';

export interface Plugin {
  id: string;
  nombre: string;
  protocolo: ProtocoloPlugin;
  schemaGraphQL?: string;
  esEconomico: boolean;
  registroFecha: number;
}

export interface SchemaGraphQL {
  id: string;
  pluginId: string;
  tipo: TipoSchema;
  definicion: string;
  fechaRegistro: number;
}

export interface Blob {
  id: string;
  identificadorContenido: string;   // content-addressable ID (sha256)
  tamano: number;                   // bytes
  origenPlugin: string;
  urlServicio: string;              // ej. localhost:7777/<id>
  fechaSubida: number;
}

export interface Capacidad {
  id: string;
  nombre: string;                   // ej. 'graphql_query', 'ssb_feed', 'dat_sync'
  pluginId: string;
  disponible: boolean;
}

interface RespuestaALRAC {
  usarCodigoFuente: boolean;
  reimplementarLogicaPura: boolean;
  verificarLicenciaAntesDeUsar: boolean;
  revisarSeguridadCodigoAbandonado: boolean;
  mapearCapasAAlRAC: boolean;
}

export interface EstadoServidor {
  plugins: Plugin[];
  schemas: SchemaGraphQL[];
  blobs: Blob[];
  capacidades: Capacidad[];
  puertoGraphQL: number;            // 4000 por defecto
  puertoBlobs: number;              // 7777 por defecto
  nodeVersionMinima: string;        // 'v8'
  esCodigoAbandonado: boolean;      // true si último commit > 2 años
  licenciaVerificada: boolean;      // false por defecto (no leída)
}

const PUERTO_GRAPHQL_DEFECTO = 4000;
const PUERTO_BLOBS_DEFECTO = 7777;
const NODE_VERSION_MINIMA = 'v8';
const AÑOS_ABANDONO = 2;
const MILESEGUNDOS_POR_AÑO = 365 * 24 * 60 * 60 * 1000;

const PROTOCOLOS_DISTRIBUIDOS: ProtocoloPlugin[] = ['ssb', 'dat', 'economic', 'fs', 'flumedb'];

let pluginCounter = 0;
function nextPluginId(): string {
  pluginCounter += 1;
  return `plugin-${Date.now()}-${pluginCounter}`;
}

let schemaCounter = 0;
function nextSchemaId(): string {
  schemaCounter += 1;
  return `schema-${Date.now()}-${schemaCounter}`;
}

let blobCounter = 0;
function nextBlobId(): string {
  blobCounter += 1;
  return `blob-${Date.now()}-${blobCounter}`;
}

let capacidadCounter = 0;
function nextCapacidadId(): string {
  capacidadCounter += 1;
  return `capacidad-${Date.now()}-${capacidadCounter}`;
}

/**
 * Crea una instancia del servidor GraphQL con puertos configurables.
 */
export function crearServidorGraphQL(
  puertoGraphQL: number = PUERTO_GRAPHQL_DEFECTO,
  puertoBlobs: number = PUERTO_BLOBS_DEFECTO,
): EstadoServidor {
  if (puertoGraphQL <= 0 || puertoGraphQL > 65535) {
    throw new Error('open-app-graphql-server: puertoGraphQL inválido');
  }
  if (puertoBlobs <= 0 || puertoBlobs > 65535) {
    throw new Error('open-app-graphql-server: puertoBlobs inválido');
  }
  return {
    plugins: [],
    schemas: [],
    blobs: [],
    capacidades: [],
    puertoGraphQL,
    puertoBlobs,
    nodeVersionMinima: NODE_VERSION_MINIMA,
    esCodigoAbandonado: false,
    licenciaVerificada: false,
  };
}

/**
 * Registra un plugin en el servidor. Valida que el protocolo sea conocido.
 */
export function registrarPlugin(
  estado: EstadoServidor,
  plugin: Omit<Plugin, 'id' | 'registroFecha'>,
): EstadoServidor {
  if (!PROTOCOLOS_DISTRIBUIDOS.includes(plugin.protocolo)) {
    throw new Error('open-app-graphql-server: protocolo de plugin no soportado');
  }
  const nuevoPlugin: Plugin = {
    ...plugin,
    id: nextPluginId(),
    registroFecha: Date.now(),
  };
  return {
    ...estado,
    plugins: [...estado.plugins, nuevoPlugin],
  };
}

/**
 * Registra un schema GraphQL asociado a un plugin existente.
 */
export function registrarSchema(
  estado: EstadoServidor,
  pluginId: string,
  tipo: TipoSchema,
  definicion: string,
): { estado: EstadoServidor; schema: SchemaGraphQL } {
  const pluginExiste = estado.plugins.some((p) => p.id === pluginId);
  if (!pluginExiste) {
    throw new Error('open-app-graphql-server: plugin no encontrado para registrar schema');
  }
  const schema: SchemaGraphQL = {
    id: nextSchemaId(),
    pluginId,
    tipo,
    definicion,
    fechaRegistro: Date.now(),
  };
  return {
    estado: { ...estado, schemas: [...estado.schemas, schema] },
    schema,
  };
}

/**
 * Registra un blob servido mediante ssb-serve-blobs.
 */
export function registrarBlob(
  estado: EstadoServidor,
  identificadorContenido: string,
  tamano: number,
  origenPlugin: string,
  urlServicio: string,
): { estado: EstadoServidor; blob: Blob } {
  if (tamano < 0) {
    throw new Error('open-app-graphql-server: tamaño de blob no puede ser negativo');
  }
  const blob: Blob = {
    id: nextBlobId(),
    identificadorContenido,
    tamano,
    origenPlugin,
    urlServicio,
    fechaSubida: Date.now(),
  };
  return {
    estado: { ...estado, blobs: [...estado.blobs, blob] },
    blob,
  };
}

/**
 * Composición de plugins: simula server([plugin1, plugin2, ...]).
 * Valida que todos los IDs existan antes de componer.
 */
export function componerPlugins(
  estado: EstadoServidor,
  pluginIds: string[],
): EstadoServidor {
  const faltantes = pluginIds.filter((id) => !estado.plugins.some((p) => p.id === id));
  if (faltantes.length > 0) {
    throw new Error(`open-app-graphql-server: plugins no encontrados: ${faltantes.join(', ')}`);
  }
  // En una implementación completa, aquí se montarían los schemas y capacidades
  // de los plugins seleccionados en el servidor GraphQL.
  return estado;
}

/**
 * Valida que un protocolo sea uno de los soportados (ssb, dat, etc.).
 */
export function esProtocoloDistribuido(protocolo: string): boolean {
  return PROTOCOLOS_DISTRIBUIDOS.includes(protocolo as ProtocoloPlugin);
}

/**
 * Detecta si un plugin es de dominio económico (ej. economic-sentences).
 */
export function esPluginEconomico(plugin: Plugin): boolean {
  return plugin.protocolo === 'economic' || plugin.esEconomico === true;
}

/**
 * Genera la respuesta del sistema ALRAC/Zeitnus ante el repositorio.
 * Siempre afirma precaución: no copiar código, reimplementar lógica pura,
 * verificar licencia, revisar seguridad de código abandonado.
 */
export function respuestaALRAC(): RespuestaALRAC {
  return {
    usarCodigoFuente: false,
    reimplementarLogicaPura: true,
    verificarLicenciaAntesDeUsar: true,
    revisarSeguridadCodigoAbandonado: true,
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
 * Marca la licencia como verificada o no.
 */
export function verificarLicencia(verificada: boolean): EstadoServidor | null {
  // Esta función opera sobre el estado; se deja como firma para claridad.
  // El llamador debe recuperar, mutar y devolver el estado.
  throw new Error('open-app-graphql-server: use el patrón get-mutar-set sobre el store');
}

/**
 * Construye el estado completo del servidor a partir de metadatos.
 */
export function construirEstadoServidor(
  plugins: Plugin[],
  schemas: SchemaGraphQL[],
  blobs: Blob[],
  capacidades: Capacidad[],
  puertoGraphQL: number,
  puertoBlobs: number,
  esCodigoAbandonado: boolean,
  licenciaVerificada: boolean,
): EstadoServidor {
  return {
    plugins,
    schemas,
    blobs,
    capacidades,
    puertoGraphQL,
    puertoBlobs,
    nodeVersionMinima: NODE_VERSION_MINIMA,
    esCodigoAbandonado,
    licenciaVerificada,
  };
}
