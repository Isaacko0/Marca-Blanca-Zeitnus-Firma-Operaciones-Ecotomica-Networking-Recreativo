/**
 * Ruddick / GEF (Grassroots Economics Foundation) — Types
 * HSCSG v15 OS — Type definitions for Ruddick/GEF module
 * Community currency and mutual credit systems
 */

export interface RuddickState {
  communities: RuddickCommunity[];
  activeCommunityId: string | null;
  lastUpdate: number | null;
}

export interface RuddickCommunity {
  id: string;
  name: string;
  location: string;
  currency: RuddickCurrency;
  members: RuddickMember[];
  groups: RuddickGroup[];
  governance: RuddickGovernance;
  status: 'forming' | 'active' | 'paused' | 'dissolved';
  createdAt: number;
  updatedAt: number;
}

export interface RuddickCurrency {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  maxSupply: number | null;
  demurrageRate: number;
  backing: 'mutual_credit' | 'asset_backed' | 'fiat_pegged' | 'commodity';
}

export interface RuddickMember {
  id: string;
  communityId: string;
  name: string;
  balance: number;
  creditLimit: number;
  trustScore: number;
  contributions: RuddickContribution[];
  joinedAt: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface RuddickContribution {
  id: string;
  type: 'labor' | 'goods' | 'services' | 'knowledge' | 'care' | 'governance';
  value: number;
  description: string;
  verifiedBy: string[];
  timestamp: number;
}

export interface RuddickGroup {
  id: string;
  name: string;
  purpose: string;
  members: string[]; // member IDs
  treasury: number;
  rules: string[];
}

export interface RuddickGovernance {
  model: 'consensus' | 'majority' | 'quadratic' | 'delegated';
  proposalThreshold: number;
  quorum: number;
  votingPeriod: number;
  executionDelay: number;
}

export function makeRuddickState(): RuddickState {
  return {
    communities: [],
    activeCommunityId: null,
    lastUpdate: Date.now(),
  };
}