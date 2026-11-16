/**
 * Samay Permacultura — Types
 * HSCSG v15 OS — Type definitions for Samay permaculture module
 */

export interface SamayState {
  zones: SamayZone[];
  activeZoneId: string | null;
  lastUpdate: number | null;
}

export interface SamayZone {
  id: string;
  name: string;
  biome: 'tropical' | 'temperate' | 'arid' | 'mediterranean' | 'boreal';
  area: number;
  waterSources: WaterSource[];
  plants: SamayPlant[];
  animals: SamayAnimal[];
  structures: SamayStructure[];
  createdAt: number;
  updatedAt: number;
}

export interface WaterSource {
  id: string;
  type: 'spring' | 'well' | 'rainwater' | 'river' | 'pond';
  capacity: number;
  currentLevel: number;
  quality: 'potable' | 'irrigation' | 'greywater';
}

export interface SamayPlant {
  id: string;
  species: string;
  variety: string;
  plantedAt: number;
  harvestAt: number | null;
  zoneId: string;
  status: 'seedling' | 'growing' | 'flowering' | 'fruiting' | 'harvested' | 'dormant';
  yield: number;
}

export interface SamayAnimal {
  id: string;
  species: string;
  breed: string;
  count: number;
  zoneId: string;
  purpose: 'meat' | 'dairy' | 'eggs' | 'fiber' | 'labor' | 'companion';
  healthStatus: 'healthy' | 'sick' | 'pregnant' | 'recovering';
}

export interface SamayStructure {
  id: string;
  type: 'greenhouse' | 'coop' | 'barn' | 'shed' | 'fence' | 'irrigation' | 'compost' | 'custom';
  zoneId: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  builtAt: number;
}

export function makeSamayState(): SamayState {
  return {
    zones: [],
    activeZoneId: null,
    lastUpdate: Date.now(),
  };
}