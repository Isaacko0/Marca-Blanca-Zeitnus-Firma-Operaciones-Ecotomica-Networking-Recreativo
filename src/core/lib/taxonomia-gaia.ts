// src/core/lib/taxonomia-gaia.ts
// Taxonomía Gaia: 7 categorías principales, 16 subcategorías, especialidades abiertas.
// Clasificación de perfiles, proyectos, ofertas, necesidades y resultados.

export type CategoriaTaxonomia =
  | 'D1_Salud_Bienestar'
  | 'D2_Artes_Recreativas'
  | 'D3_Sistemas_Productivos_Finanzas'
  | 'D4_Gobernanza_Relaciones'
  | 'D5_Informacion_Educacion'
  | 'D6_Habitat_Gestion'
  | 'D7_Espiritualidad_Autorrealizacion';

export interface Subcategoria {
  id: string;            // ej. '1.1', '3.2'
  nombre: string;
  categoria: CategoriaTaxonomia;
}

export interface Especialidad {
  id: string;
  nombre: string;
  subcategoriaId: string;
}

export interface ActorClasificacion {
  actorId: string;
  categoriaPrincipal?: CategoriaTaxonomia;
  subcategorias: string[];   // IDs asociadas (múltiples permitidas)
  especialidades: string[];  // IDs abiertas, curadas con equivalencias
}

const CATEGORIAS: Record<CategoriaTaxonomia, string> = {
  D1_Salud_Bienestar: 'Salud y Bienestar',
  D2_Artes_Recreativas: 'Artes y Actividades Recreativas',
  D3_Sistemas_Productivos_Finanzas: 'Sistemas Productivos y Finanzas',
  D4_Gobernanza_Relaciones: 'Gobernanza y Relaciones Humanas',
  D5_Informacion_Educacion: 'Información y Educación',
  D6_Habitat_Gestion: 'Planificación y Gestión del Hábitat',
  D7_Espiritualidad_Autorrealizacion: 'Espiritualidad y Autorrealización',
};

const SUBCATEGORIAS: Subcategoria[] = [
  { id: '1.1', nombre: 'Medicina y Nutrición', categoria: 'D1_Salud_Bienestar' },
  { id: '1.2', nombre: 'Deporte, Ejercicio y Terapias Manuales', categoria: 'D1_Salud_Bienestar' },
  { id: '1.3', nombre: 'Salud Psicoemocional y Desarrollo Personal', categoria: 'D1_Salud_Bienestar' },
  { id: '2.1', nombre: 'Arte y Oficios Artesanales', categoria: 'D2_Artes_Recreativas' },
  { id: '2.2', nombre: 'Actividades Recreativas y Turismo', categoria: 'D2_Artes_Recreativas' },
  { id: '3.1', nombre: 'Producción y Logística', categoria: 'D3_Sistemas_Productivos_Finanzas' },
  { id: '3.2', nombre: 'Sistemas de Intercambio y Finanzas', categoria: 'D3_Sistemas_Productivos_Finanzas' },
  { id: '4.1', nombre: 'Gobernanza, Incidencia Política y Justicia', categoria: 'D4_Gobernanza_Relaciones' },
  { id: '4.2', nombre: 'Cuidado Social y Bienestar Comunitario', categoria: 'D4_Gobernanza_Relaciones' },
  { id: '5.1', nombre: 'Educación, Aprendizaje e Investigación', categoria: 'D5_Informacion_Educacion' },
  { id: '5.2', nombre: 'Medios, Comunicación y TIC', categoria: 'D5_Informacion_Educacion' },
  { id: '6.1', nombre: 'Infraestructura y Vivienda', categoria: 'D6_Habitat_Gestion' },
  { id: '6.2', nombre: 'Agricultura y Recursos Naturales', categoria: 'D6_Habitat_Gestion' },
  { id: '6.3', nombre: 'Restauración y Conservación de la Naturaleza', categoria: 'D6_Habitat_Gestion' },
  { id: '7.1', nombre: 'Autorrealización y Desarrollo Interior', categoria: 'D7_Espiritualidad_Autorrealizacion' },
  { id: '7.2', nombre: 'Realidades Sutiles y Leyes Cósmicas / Universales', categoria: 'D7_Espiritualidad_Autorrealizacion' },
];

let especialidadCounter = 0;
const especialidadesPorNombre = new Map<string, Especialidad>();

export function listarCategorias(): Record<CategoriaTaxonomia, string> {
  return { ...CATEGORIAS };
}

export function listarSubcategorias(): Subcategoria[] {
  return [...SUBCATEGORIAS];
}

export function obtenerSubcategoria(id: string): Subcategoria | undefined {
  return SUBCATEGORIAS.find((s) => s.id === id);
}

export function obtenerSubcategoriasPorCategoria(categoria: CategoriaTaxonomia): Subcategoria[] {
  return SUBCATEGORIAS.filter((s) => s.categoria === categoria);
}

/**
 * Registra una especialidad abierta con deduplicación por nombre (equivalencias).
 * No permite duplicados: mismo nombre → mismo ID.
 */
export function registrarEspecialidad(nombre: string, subcategoriaId: string): Especialidad {
  const normalizado = nombre.trim().toLowerCase();
  const existente = especialidadesPorNombre.get(normalizado);
  if (existente) {
    return existente;
  }
  especialidadCounter += 1;
  const esp: Especialidad = {
    id: `esp-${Date.now()}-${especialidadCounter}`,
    nombre: nombre.trim(),
    subcategoriaId,
  };
  especialidadesPorNombre.set(normalizado, esp);
  return esp;
}

export function obtenerEspecialidad(id: string): Especialidad | undefined {
  for (const esp of especialidadesPorNombre.values()) {
    if (esp.id === id) return esp;
  }
  return undefined;
}

export function clasificarActor(
  clasificacion: ActorClasificacion,
): ActorClasificacion {
  // Validar subcategorías existentes
  for (const subId of clasificacion.subcategorias) {
    if (!obtenerSubcategoria(subId)) {
      throw new Error(`taxonomia-gaia: subcategoría inexistente '${subId}'`);
    }
  }
  // Validar especialidades existentes
  for (const espId of clasificacion.especialidades) {
    if (!obtenerEspecialidad(espId)) {
      throw new Error(`taxonomia-gaia: especialidad inexistente '${espId}'`);
    }
  }
  return { ...clasificacion };
}
