// src/core/state/gi3cf.ts
// Estado del Marco Gaia de Impacto, Innovación y Contribución (GI3CF) — ALRAC/Zeitnus.
// Tipos y estado para taxonomía, GRID/GI3D, índice GI3, niveles de confianza/evidencia,
// pasaporte, insignias, CoRe, ciclo operativo, IA auditable, fideicomiso, salvaguardas.

export type CategoriaTaxonomia =
  | 'D1_Salud_Bienestar'
  | 'D2_Artes_Recreativas'
  | 'D3_Sistemas_Productivos_Finanzas'
  | 'D4_Gobernanza_Relaciones'
  | 'D5_Informacion_Educacion'
  | 'D6_Habitat_Gestion'
  | 'D7_Espiritualidad_Autorrealizacion';

export interface Subcategoria {
  id: string;            // ej. '1.1'
  nombre: string;
  categoria: CategoriaTaxonomia;
}

export interface Especialidad {
  id: string;
  nombre: string;
  subcategoriaId: string;
}

export interface ObjetivoImpacto {
  id: string;            // ej. 'T01'
  subcategoriaId: string;
  nombre: string;
  indicadoresReferencia: string[]; // 5 IDs de indicadores
}

export type EstadoInformacion = 'auto_declarado' | 'documentado' | 'verificado' | 'certificacion_oficial';

export type NivelConfianza = 1 | 2 | 3 | 4;
export type NivelEvidencia = 0 | 1 | 2 | 3 | 4;

export interface Actor {
  id: string;
  nombre: string;
  tipo: 'persona' | 'colectivo' | 'proyecto' | 'emprendimiento' | 'organizacion' | 'comunidad' | 'nodo';
  escalaNodo: 'individuo' | 'proyecto' | 'comunidad_virtual' | 'comunidad_biohub' | 'microlocal' | 'local_territorial' | 'biorregional' | 'nacional' | 'continental' | 'lingüistico' | 'global';
  categoriaPrincipal?: CategoriaTaxonomia;
  subcategorias: string[];      // IDs de subcategorías asociadas
  especialidades: string[];     // IDs de especialidades abiertas
  estadoInformacion: EstadoInformacion;
  lineaBase?: string;
  fechaIngreso: number;
  esPublico: boolean;
}

export interface DatoRegistro {
  id: string;
  moduloId: string;             // 1-10 del GRID/GI3D
  actorId: string;
  campo: string;
  valor: unknown;
  estado: EstadoInformacion;
  raoCredentialId?: string;     // procedencia de la evidencia
  nivelConfianza: NivelConfianza;
  nivelEvidencia: NivelEvidencia;
  fecha: number;
  periodo?: string;
  responsable?: string;
  verificadorId?: string;
  esPublico: boolean;
}

export interface DimensioneTransversal {
  id: number;                   // 1-7
  nombre: string;
  descripcion: string;
}

export interface SistemaIntegral {
  id: number;                   // 1-7
  nombre: string;
  descripcion: string;
}

export interface IndicadorComprometido {
  id: string;
  actorId: string;
  objetivoId: string;           // T01-T16
  nombre: string;
  lineaBase: number;
  meta: number;                 // Tᵢ
  peso: number;                 // wᵢ
  unidad: string;
  direccion: 'mas_es_mejor' | 'menos_es_mejor' | 'proporcion';
  limiteInferior?: number;
  limiteSuperior?: number;
  resultadoObservado?: number;  // Xᵢ
  esMaterialCritico: boolean;
}

export interface ResultadoIndicador {
  indicadorId: string;
  fi: number;                   // Grado de Cumplimiento 0-100
  ei: number;                   // Efectividad Real 0-100
  ri: number;                   // Desempeño (fi × ei) ÷ 100
  vi: number;                   // Verificación 0 o 1
  nivelConfianza: NivelConfianza;
  nivelEvidencia: NivelEvidencia;
  fechaVerificacion?: number;
  consejoCustodiaAprobado: boolean;
}

export interface CalculoGI3 {
  actorId: string;
  periodo: string;
  icv: number;                  // Índice de Cobertura de Verificación 0-100
  i: number;                    // Impactos y Resultados 0-100
  q: number;                    // Calidad e Integridad 0-100
  c: number;                    // Contribución al Ecosistema 0-100
  gi3: number;                  // Síntesis 0-100
  esDefinitivo: boolean;        // requiere ICV ≥ 80 y críticos verificados
  fechaCalculo: number;
  detalles: {
    q1: number; q2: number; q3: number; q4: number; q5: number;
    c1: number; c2: number; c3: number; c4: number; c5: number;
  };
}

export interface PasaporteGaia {
  actorId: string;
  identidadSoberana: boolean;
  credencialesExternas: Array<{
    institucion: string;
    fecha: number;
    vigencia: number;
    alcance: string;
    estado: 'declarada' | 'documento_recibido' | 'autenticidad_comprobada' | 'vigente_verificada' | 'expirada' | 'revocada' | 'no_verificable';
  }>;
  insignias: string[];
  visasDescentralizadas: string[];
  bandaDesarrollo: 'semilla' | 'germinacion' | 'brote' | 'arbusto' | 'arbol_grande' | 'bosque' | 'ecosistema' | 'mundo';
}

export interface AporteCapital {
  id: string;
  actorId: string;
  capital: 'financiero' | 'natural' | 'humano' | 'intelectual' | 'incidencia' | 'cultural' | 'energetico_espiritual' | 'material' | 'etico';
  cantidad: number;             // TQ/kWh o ZNU
  descripcion: string;
  paiseoNivel?: string;
  opalLicencia?: string;
  fecha: number;
}

export interface PasoCiclo {
  numero: number;               // 1-10
  nombre: string;
  completado: boolean;
  fechaCompletado?: number;
  evidenciaId?: string;
}

export interface Salvaguarda {
  id: number;                   // 1-7
  nombre: string;
  verificada: boolean;
  observaciones?: string;
}

export interface Gi3cfState {
  actores: Map<string, Actor>;
  subcategorias: Map<string, Subcategoria>;
  especialidades: Map<string, Especialidad>;
  objetivos: Map<string, ObjetivoImpacto>;
  registros: Map<string, DatoRegistro>;
  dimensiones: Map<number, DimensioneTransversal>;
  sistemasIntegrales: Map<number, SistemaIntegral>;
  indicadores: Map<string, IndicadorComprometido>;
  resultados: Map<string, ResultadoIndicador>;
  calculosGi3: Map<string, CalculoGI3>;
  pasaportes: Map<string, PasaporteGaia>;
  aportesCapital: Map<string, AporteCapital>;
  ciclos: Map<string, PasoCiclo[]>;
  salvaguardas: Map<number, Salvaguarda>;
}

export function makeGi3cfState(): Gi3cfState {
  return {
    actores: new Map(),
    subcategorias: new Map(),
    especialidades: new Map(),
    objetivos: new Map(),
    registros: new Map(),
    dimensiones: new Map(),
    sistemasIntegrales: new Map(),
    indicadores: new Map(),
    resultados: new Map(),
    calculosGi3: new Map(),
    pasaportes: new Map(),
    aportesCapital: new Map(),
    ciclos: new Map(),
    salvaguardas: new Map(),
  };
}
