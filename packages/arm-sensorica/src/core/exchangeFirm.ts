// arm-sensorica/src/core/exchangeFirm.ts - Exchange Firm Pattern (Legal Interface)
import { 
  ExchangeFirm, 
  ExchangeFirmId, 
  LegalEntityRef, 
  Contract, 
  RevenueFlowConfig, 
  ComplianceConfig,
  OVNId,
  DualValue,
  Timestamp,
  Deliverable,
  LegalEntity,
  Contract as ContractType
} from '../types';

import { generateId, now } from '../utils';

// ============================================
// EXCHANGE FIRM REPOSITORY
// ============================================

export interface ExchangeFirmRepository {
  save(firm: ExchangeFirm): Promise<ExchangeFirm>;
  findById(id: ExchangeFirmId): Promise<ExchangeFirm | null>;
  findByOVN(ovnId: OVNId): Promise<ExchangeFirm[]>;
  findAll(): Promise<ExchangeFirm[]>;
  update(firm: ExchangeFirm): Promise<ExchangeFirm>;
  delete(id: ExchangeFirmId): Promise<boolean>;
}

export class InMemoryExchangeFirmRepository implements ExchangeFirmRepository {
  private firms: Map<string, ExchangeFirm> = new Map();
  private byOVN: Map<string, Set<string>> = new Map();

  async save(firm: ExchangeFirm): Promise<ExchangeFirm> {
    this.firms.set(firm.id as string, firm);
    this.addToIndex(this.byOVN, firm.representedOVN, firm.id);
    return firm;
  }

  async findById(id: ExchangeFirmId): Promise<ExchangeFirm | null> {
    return this.firms.get(id as string) || null;
  }

  async findByOVN(ovnId: OVNId): Promise<ExchangeFirm[]> {
    const ids = this.byOVN.get(ovnId as string) || new Set();
    return Array.from(ids).map(id => this.firms.get(id)!).filter(Boolean);
  }

  async findAll(): Promise<ExchangeFirm[]> {
    return Array.from(this.firms.values());
  }

  async update(firm: ExchangeFirm): Promise<ExchangeFirm> {
    this.firms.set(firm.id as string, firm);
    return firm;
  }

  async delete(id: ExchangeFirmId): Promise<boolean> {
    const firm = this.firms.get(id as string);
    if (!firm) return false;
    
    this.firms.delete(id as string);
    this.removeFromIndex(this.byOVN, firm.representedOVN, firm.id);
    return true;
  }

  private addToIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(value);
  }

  private removeFromIndex<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
    const set = map.get(key);
    if (set) {
      set.delete(value);
      if (set.size === 0) map.delete(key);
    }
  }
}

// ============================================
// EXCHANGE FIRM SERVICE
// ============================================

export interface ExchangeFirmService {
  createFirm(input: CreateFirmInput): Promise<ExchangeFirm>;
  addContract(firmId: ExchangeFirmId, contract: ContractInput): Promise<Contract>;
  updateContract(firmId: ExchangeFirmId, contract: Contract): Promise<Contract>;
  recordRevenue(input: RecordRevenueInput): Promise<void>;
  distributeToOVN(firmId: ExchangeFirmId): Promise<{ distributed: bigint; ovnAllocation: bigint; firmFee: bigint }>;
  getComplianceStatus(firmId: ExchangeFirmId): Promise<ComplianceStatus>;
}

export interface CreateFirmInput {
  legalEntity: LegalEntityRef;
  representedOVN: OVNId;
  revenueFlow: RevenueFlowConfig;
  compliance: ComplianceConfig;
}

export interface ContractInput {
  clientId: string;
  value: DualValue;
  startDate: Timestamp;
  endDate?: Timestamp;
  deliverables: Deliverable[];
}

export interface RecordRevenueInput {
  firmId: ExchangeFirmId;
  amount: DualValue;
  contractId: string;
  description: string;
}

export interface ComplianceStatus {
  firmId: ExchangeFirmId;
  kycCompliant: boolean;
  amlCompliant: boolean;
  lastAudit: Timestamp | null;
  nextAuditDue: Timestamp;
  issues: string[];
}

export class ExchangeFirmServiceImpl implements ExchangeFirmService {
  constructor(private repo: ExchangeFirmRepository) {}

  async createFirm(input: CreateFirmInput): Promise<ExchangeFirm> {
    const firm: ExchangeFirm = {
      id: generateId('exf') as any,
      legalEntity: input.legalEntity,
      representedOVN: input.representedOVN,
      contracts: [],
      revenueFlow: input.revenueFlow,
      compliance: input.compliance
    };
    return this.repo.save(firm);
  }

  async addContract(firmId: ExchangeFirmId, input: ContractInput): Promise<Contract> {
    const firm = await this.repo.findById(firmId);
    if (!firm) throw new Error('Exchange firm not found');

    const contract: Contract = {
      id: generateId('ctr'),
      clientId: input.clientId,
      value: input.value,
      status: 'active',
      startDate: input.startDate,
      endDate: input.endDate,
      deliverables: input.deliverables
    };

    const newFirm = {
      ...firm,
      contracts: [...firm.contracts, contract]
    };

    await this.repo.update(newFirm);
    return contract;
  }

  async updateContract(firmId: ExchangeFirmId, contract: Contract): Promise<Contract> {
    const firm = await this.repo.findById(firmId);
    if (!firm) throw new Error('Exchange firm not found');

    const newContracts = firm.contracts.map(c => c.id === contract.id ? contract : c);
    const newFirm = { ...firm, contracts: newContracts };
    await this.repo.update(newFirm);
    return contract;
  }

  async recordRevenue(input: RecordRevenueInput): Promise<void> {
    // In real implementation, would record revenue and trigger distribution
    // based on revenueFlow config
  }

  async distributeToOVN(firmId: ExchangeFirmId): Promise<{ distributed: bigint; ovnAllocation: bigint; firmFee: bigint }> {
    const firm = await this.repo.findById(firmId);
    if (!firm) throw new Error('Exchange firm not found');

    // Calculate distribution based on revenue flow config
    // In real impl, would query accumulated revenue
    const totalRevenue = { postmonetario: 10000n, conectado: 500000n }; // placeholder
    
    const ovnAllocation = (totalRevenue.conectado * firm.revenueFlow.ovnAllocation.value) / 100n;
    const firmFee = (totalRevenue.conectado * firm.revenueFlow.exchangeFirmFee.value) / 100n;
    const distributed = totalRevenue.conectado - firmFee;

    return { distributed, ovnAllocation, firmFee };
  }

  async getComplianceStatus(firmId: ExchangeFirmId): Promise<ComplianceStatus> {
    const firm = await this.repo.findById(firmId);
    if (!firm) throw new Error('Exchange firm not found');

    return {
      firmId,
      kycCompliant: firm.compliance.kycRequired,
      amlCompliant: firm.compliance.amlRequired,
      lastAudit: null,
      nextAuditDue: { value: Date.now() + 365 * 24 * 60 * 60 * 1000, timezone: 'UTC' },
      issues: []
    };
  }
}

// ============================================
// EXCHANGE FIRM FACTORY
// ============================================

export interface CreateExchangeFirmInput {
  legalEntity: {
    id: string;
    name: string;
    jurisdiction: string;
    registrationNumber: string;
  };
  representedOVN: string;
  revenueFlow: {
    externalRevenueAccount: string;
    ovnAllocation: number; // percentage
    exchangeFirmFee: number; // percentage
    distributionTrigger: 'on-receipt' | 'periodic' | 'manual';
  };
  compliance: {
    kycRequired: boolean;
    amlRequired: boolean;
    reportingStandards: string[];
    auditFrequency: number; // milliseconds
  };
}

export function createExchangeFirm(input: CreateExchangeFirmInput): ExchangeFirm {
  return {
    id: generateId('exf') as any,
    legalEntity: {
      id: input.legalEntity.id as any,
      name: input.legalEntity.name,
      jurisdiction: input.legalEntity.jurisdiction,
      registrationNumber: input.legalEntity.registrationNumber
    },
    representedOVN: input.representedOVN as any,
    contracts: [],
    revenueFlow: {
      externalRevenueAccount: input.revenueFlow.externalRevenueAccount,
      ovnAllocation: { value: input.revenueFlow.ovnAllocation },
      exchangeFirmFee: { value: input.revenueFlow.exchangeFirmFee },
      distributionTrigger: input.revenueFlow.distributionTrigger
    },
    compliance: {
      kycRequired: input.compliance.kycRequired,
      amlRequired: input.compliance.amlRequired,
      reportingStandards: input.compliance.reportingStandards,
      auditFrequency: { value: input.compliance.auditFrequency }
    }
  };
}

// ============================================
// REVENUE DISTRIBUTION LOGIC
// ============================================

export interface RevenueDistributionResult {
  totalRevenue: DualValue;
  ovnAllocation: DualValue;
  firmFee: DualValue;
  distributedToAffiliates: DualValue;
  reserve: DualValue;
  timestamp: Timestamp;
}

export function calculateRevenueDistribution(
  firm: ExchangeFirm,
  totalRevenue: DualValue
): RevenueDistributionResult {
  const ovnPercent = firm.revenueFlow.ovnAllocation.value / 100;
  const firmFeePercent = firm.revenueFlow.exchangeFirmFee.value / 100;
  const reservePercent = 0.1; // 10% reserve

  const ovnAllocation = {
    postmonetario: totalRevenue.postmonetario * BigInt(Math.floor(ovnPercent * 10000)) / 10000n,
    conectado: totalRevenue.conectado * BigInt(Math.floor(ovnPercent * 10000)) / 10000n
  };

  const firmFee = {
    postmonetario: totalRevenue.postmonetario * BigInt(Math.floor(firmFeePercent * 10000)) / 10000n,
    conectado: totalRevenue.conectado * BigInt(Math.floor(firmFeePercent * 10000)) / 10000n
  };

  const reserve = {
    postmonetario: totalRevenue.postmonetario * BigInt(Math.floor(reservePercent * 10000)) / 10000n,
    conectado: totalRevenue.conectado * BigInt(Math.floor(reservePercent * 10000)) / 10000n
  };

  const distributedToAffiliates = {
    postmonetario: totalRevenue.postmonetario - firmFee.postmonetario - reserve.postmonetario,
    conectado: totalRevenue.conectado - firmFee.conectado - reserve.conectado
  };

  return {
    totalRevenue,
    ovnAllocation,
    firmFee,
    distributedToAffiliates,
    reserve,
    timestamp: { value: Date.now(), timezone: 'UTC' }
  };
}

// ============================================
// COMPLIANCE HELPERS
// ============================================

export interface ComplianceCheckResult {
  compliant: boolean;
  issues: string[];
  nextSteps: string[];
}

export function checkKYCCompliance(firm: ExchangeFirm): ComplianceCheckResult {
  const issues: string[] = [];
  const nextSteps: string[] = [];

  if (firm.compliance.kycRequired) {
    // In real impl, would check KYC records
    issues.push('KYC verification required for all affiliates');
    nextSteps.push('Implement KYC verification workflow');
  }

  return {
    compliant: issues.length === 0,
    issues,
    nextSteps
  };
}

export function checkAMLCompliance(firm: ExchangeFirm): ComplianceCheckResult {
  const issues: string[] = [];
  const nextSteps: string[] = [];

  if (firm.compliance.amlRequired) {
    issues.push('AML monitoring required for all transactions');
    nextSteps.push('Implement transaction monitoring system');
  }

  return {
    compliant: issues.length === 0,
    issues,
    nextSteps
  };
}

export function generateComplianceReport(firm: ExchangeFirm): string {
  const kyc = checkKYCCompliance(firm);
  const aml = checkAMLCompliance(firm);
  
  return `
Exchange Firm Compliance Report
================================
Firm: ${firm.legalEntity.name} (${firm.legalEntity.registrationNumber})
OVN: ${firm.representedOVN}
Generated: ${new Date().toISOString()}

KYC Compliance: ${kyc.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
${kyc.issues.map(i => `  - ${i}`).join('\n')}
${kyc.nextSteps.map(s => `  Next: ${s}`).join('\n')}

AML Compliance: ${aml.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
${aml.issues.map(i => `  - ${i}`).join('\n')}
${aml.nextSteps.map(s => `  Next: ${s}`).join('\n')}

Contracts: ${firm.contracts.length}
Revenue Flow: ${firm.revenueFlow.ovnAllocation.value}% to OVN, ${firm.revenueFlow.exchangeFirmFee.value}% firm fee
  `.trim();
}

import { generateId } from '../utils';