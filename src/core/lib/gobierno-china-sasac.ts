// src/core/lib/gobierno-china-sasac.ts
// Repositorios SASAC (Consejo de Estado de China) — ALRAC/Zeitnus.
// Documentos oficiales de China sobre supervisión de activos estatales.
// NO copia código fuente del gobierno chino. Licencia no verificada.
// Todos los módulos son reimplementación pura en TypeScript basada en hipótesis estructurales.

export interface SasacDocumento {
  id: string;
  pais: 'china';
  numeroDocumento: string;       // ej. 国办发〔2017〕38号, 国办发〔2003〕28号
  fecha: number;                  // timestamp
  titulo: string;
  remitente: string;              // ej. 国务院办公厅
  destinatarios: string[];
  paginasTotales: number;
  paginasLeidas: number;          // siempre 1 en esta asimilación
  contenidoLeido: boolean;        // false si solo se leyó primera página
  licenciaVerificada: boolean;    // false por defecto
}

export interface SupervisionActivosStatales {
  id: string;
  documentoId: string;
  tipoSupervision: 'gestion_capital' | 'operacion_directa' | 'otro';
  entidadSupervisada: string;
  entidadSupervisora: string;     // ej. SASAC
  funciones: string[];
  fechaEfectiva: number;
}

export interface OficinaGeneralConsejoEstado {
  id: string;
  nombre: string;
  tipo: 'oficina_general';
  funciones: string[];            // comunicación oficial, notificaciones
  documentosEmitidos: string[];   // IDs de documentos emitidos
}

let sasacCounter = 0;
function nextSasacId(): string {
  sasacCounter += 1;
  return `sasac-${Date.now()}-${sasacCounter}`;
}

/**
 * Crea un registro de documento SASAC con metadatos de primera página.
 */
export function crearDocumentoSasac(
  datos: Omit<SasacDocumento, 'id'>,
): SasacDocumento {
  if (!datos.numeroDocumento || !datos.titulo || !datos.remitente) {
    throw new Error('gobierno-china-sasac: número, título y remitente son obligatorios');
  }
  if (datos.paginasLeidas > datos.paginasTotales) {
    throw new Error('gobierno-china-sasac: paginasLeidas no puede superar paginasTotales');
  }
  return {
    ...datos,
    id: nextSasacId(),
    licenciaVerificada: false,
  };
}

/**
 * Registra una función de supervisión de activos estatales.
 */
export function registrarSupervisionActivos(
  documentoId: string,
  tipo: SupervisionActivosStatales['tipoSupervision'],
  entidadSupervisada: string,
  entidadSupervisora: string,
  funciones: string[],
): SupervisionActivosStatales {
  return {
    id: nextSasacId(),
    documentoId,
    tipoSupervision: tipo,
    entidadSupervisada,
    entidadSupervisora,
    funciones: [...funciones],
    fechaEfectiva: Date.now(),
  };
}

/**
 * Crea una oficina general del Consejo de Estado.
 */
export function crearOficinaGeneralConsejoEstado(
  nombre: string,
  funciones: string[],
): OficinaGeneralConsejoEstado {
  return {
    id: nextSasacId(),
    nombre,
    tipo: 'oficina_general',
    funciones: [...funciones],
    documentosEmitidos: [],
  };
}

/**
 * Verifica si el contenido del documento está completamente leído.
 */
export function esContenidoCompleto(doc: SasacDocumento): boolean {
  return doc.paginasLeidas >= doc.paginasTotales && doc.contenidoLeido === true;
}

/**
 * Verifica si la licencia está verificada.
 */
export function esLicenciaVerificada(doc: SasacDocumento): boolean {
  return doc.licenciaVerificada === true;
}
