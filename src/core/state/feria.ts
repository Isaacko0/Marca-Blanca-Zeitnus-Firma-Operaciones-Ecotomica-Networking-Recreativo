/**
 * Feria Conuquera — Types
 * HSCSG v15 OS — Type definitions for Feria Conuquera module
 * Mercado campesino/artesanal descentralizado
 */

export interface FeriaState {
  markets: FeriaMarket[];
  activeMarketId: string | null;
  vendors: FeriaVendor[];
  lastUpdate: number | null;
}

export interface FeriaMarket {
  id: string;
  name: string;
  location: string;
  schedule: MarketSchedule;
  vendors: string[]; // vendor IDs
  categories: MarketCategory[];
  currency: 'ZNU' | 'TQ' | 'USD' | 'mixed';
  status: 'planning' | 'active' | 'paused' | 'closed';
  createdAt: number;
  updatedAt: number;
}

export interface MarketSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'seasonal';
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export type MarketCategory = 'produce' | 'crafts' | 'food' | 'textiles' | 'tools' | 'seeds' | 'services' | 'other';

export interface FeriaVendor {
  id: string;
  name: string;
  contact: string;
  products: FeriaProduct[];
  stallSize: 'small' | 'medium' | 'large';
  rating: number;
  joinedAt: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface FeriaProduct {
  id: string;
  name: string;
  category: MarketCategory;
  price: number;
  currency: 'ZNU' | 'TQ' | 'USD';
  unit: string;
  stock: number;
  description: string;
  images: string[];
  organic: boolean;
  local: boolean;
}

export function makeFeriaState(): FeriaState {
  return {
    markets: [],
    activeMarketId: null,
    vendors: [],
    lastUpdate: Date.now(),
  };
}