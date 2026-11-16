/**
 * CLC / Cosmo-Local Credit — Types
 * HSCSG v15 OS — Type definitions for CLC module
 * Crédito cosmo-local para cooperativas
 */

export interface CLCState {
  circles: CLCircle[];
  activeCircleId: string | null;
  transactions: CLCTransaction[];
  lastUpdate: number | null;
}

export interface CLCircle {
  id: string;
  name: string;
  description: string;
  members: CLCMember[];
  creditLimit: number;
  interestRate: number;
  currency: 'ZNU' | 'TQ' | 'USD';
  status: 'forming' | 'active' | 'frozen' | 'dissolved';
  createdAt: number;
  updatedAt: number;
}

export interface CLCMember {
  id: string;
  circleId: string;
  name: string;
  creditScore: number;
  creditLimit: number;
  usedCredit: number;
  reputation: number;
  joinedAt: number;
  status: 'active' | 'inactive' | 'probation' | 'suspended';
}

export interface CLCTransaction {
  id: string;
  circleId: string;
  fromMemberId: string | null; // null = system mint
  toMemberId: string | null; // null = system burn
  amount: number;
  type: 'credit_issue' | 'credit_repay' | 'trade' | 'interest' | 'penalty' | 'reward';
  description: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export function makeCLCState(): CLCState {
  return {
    circles: [],
    activeCircleId: null,
    transactions: [],
    lastUpdate: Date.now(),
  };
}