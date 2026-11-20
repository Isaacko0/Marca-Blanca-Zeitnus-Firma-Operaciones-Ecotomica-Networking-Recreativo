// src/core/lib/andernach-edible-city.ts
// Edible City — Espacios Públicos Productivos y Agricultura Urbana.
// Lógica pura en TypeScript. No copia código ni assets de la ciudad de Andernach ni de terceros.

export type EdibleSpaceType =
  | 'community_garden'
  | 'orchard'
  | 'vegetable_patch'
  | 'permaculture'
  | 'edible_hedge'
  | 'flower_field';

export interface EdibleSpace {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  areaHectares: number;
  type: EdibleSpaceType;
  pickingAllowed: boolean;           // "Pflücken erlaubt" — acceso común para recoger
  pesticideFree: boolean;            // Sin pesticidas sintéticos (límite duro)
  regenerationIndex: number;         // 0-1
  varietiesCount: number;            // Número de variedades cultivadas
  featuredPlantYear?: number;        // Año en que fue planta destacada
  featuredPlantName?: string;
  citizenParticipants: number;       // Residentes participantes en plantación/cosecha
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}

export interface FeaturedPlantRecord {
  year: number;
  plantName: string;
  varieties: number;
  purpose: 'promote_forgotten' | 'highlight_useful';
}

let edibleIdCounter = 0;
function nextEdibleId(): string {
  edibleIdCounter += 1;
  return `edible-${Date.now()}-${edibleIdCounter}`;
}

/**
 * Registra un espacio público productivo comestible.
 * Reglas duras: pesticideFree=true, pickingAllowed=true, raoCredentialId válido.
 */
export function registerEdibleSpace(
  space: Omit<EdibleSpace, 'id' | 'createdAt'>,
): EdibleSpace {
  if (!space.raoCredentialId) {
    throw new Error('andernach-edible-city: raoCredentialId requerido');
  }
  if (!space.pesticideFree) {
    throw new Error('andernach-edible-city: espacio productivo del común debe ser libre de pesticidas');
  }
  if (!space.pickingAllowed) {
    throw new Error('andernach-edible-city: espacio del común debe permitir recoger (pickingAllowed)');
  }
  if (space.regenerationIndex < 0 || space.regenerationIndex > 1) {
    throw new Error('andernach-edible-city: regenerationIndex debe estar en [0,1]');
  }

  return {
    ...space,
    id: nextEdibleId(),
    createdAt: Date.now(),
    isPublic: true,
  };
}

/**
 * Registra la planta destacada de un año con sus variedades.
 */
export function setFeaturedPlantYear(
  year: number,
  plantName: string,
  varieties: number,
): FeaturedPlantRecord {
  if (varieties < 1) {
    throw new Error('andernach-edible-city: al menos 1 variedad requerida');
  }
  return {
    year,
    plantName,
    varieties,
    purpose: varieties >= 10 ? 'promote_forgotten' : 'highlight_useful',
  };
}

/**
 * Calcula el índice de biodiversidad cultivada de un conjunto de espacios.
 * Basado en variedades y tipos de espacio productivo.
 */
export function calculateBiodiversityIndex(spaces: EdibleSpace[]): number {
  if (spaces.length === 0) return 0;

  let score = 0;
  for (const space of spaces) {
    // Cada espacio contribuye según sus variedades y tipo productivo
    const typeWeight = space.type === 'permaculture' ? 1.2 : 1.0;
    const varietyFactor = Math.min(space.varietiesCount / 100, 1);
    score += typeWeight * (0.5 + 0.5 * varietyFactor);
  }
  return Math.min(Math.max(score / spaces.length, 0), 1);
}

/**
 * Verifica que un espacio permita recoger libremente (picking allowed).
 */
export function verifyPickingAllowed(space: EdibleSpace): boolean {
  return space.pickingAllowed && space.isPublic;
}

/**
 * Verifica que un espacio cumpla el estándar de permacultura (sin pesticidas).
 */
export function verifyPermacultureStandard(space: EdibleSpace): boolean {
  return space.pesticideFree && space.type === 'permaculture';
}

/**
 * Cuenta participantes ciudadanos totales en un conjunto de espacios.
 */
export function countCitizenParticipants(spaces: EdibleSpace[]): number {
  return spaces.reduce((sum, s) => sum + s.citizenParticipants, 0);
}
