// CPP (Common Pool Protocol) Types
// Protocolo de piscinas comunes para recursos compartidos

export interface CPPState {
  pools: CPPPool[];
  activePoolId: string | null;
  lastUpdate: number | null;
}

export interface CPPPool {
  id: string;
  name: string;
  description: string;
  resourceType: 'compute' | 'storage' | 'bandwidth' | 'energy' | 'custom';
  totalCapacity: number;
  availableCapacity: number;
  members: CPPMember[];
  rules: CPPRule[];
  createdAt: number;
  updatedAt: number;
}

export interface CPPMember {
  address: string;
  contribution: number;
  share: number;
  joinedAt: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface CPPRule {
  id: string;
  type: 'allocation' | 'access' | 'governance';
  condition: string;
  action: string;
  enabled: boolean;
}

export function makeCPPState(): CPPState {
  return {
    pools: [],
    activePoolId: null,
    lastUpdate: Date.now(),
  };
}