# Spec: Límite Simétrico Estricto + Confianza Progresiva (Art 16)

**Fuente**: Reglamento Fedeco - Art 16 (Principio del Límite Simétrico y Confianza Progresiva) + Libro Ecoaldeas Federadas Cap 8-10
**Prioridad**: P0 (Crítico - invariante económica central: 1 TQ = 1 kWh + límite simétrico)
**Archivos Zeitnus**: `src/core/lib/symmetricLimits.ts`, `src/core/state/symmetricLimits.ts`, `src/core/state/store.ts` (extensión), `src/app/screens/SymmetricLimits.tsx`

---

## 1. Invariante Matemática Central

```typescript
// INVARIANTE INQUEBRANTABLE (Art 16.1 + Libro Cap 9)
// "El piso de crédito negativo y el techo de saldo positivo tienen idéntico valor absoluto"
// floor === -ceiling SIEMPRE

// Para CUALQUIER miembro/organización en CUALQUIER momento:
// symmetricLimit.floor + symmetricLimit.ceiling === 0
// symmetricLimit.ceiling === Math.abs(symmetricLimit.floor)
```

---

## 2. Modelo de Datos

```typescript
// src/core/state/symmetricLimits.ts

interface SymmetricLimit {
  floor: number;        // Límite negativo (capacidad de compra ética) - ej: -500
  ceiling: number;      // Límite positivo (techo anti-acaparamiento) - ej: +500
  
  // INVARIANTE: floor === -ceiling SIEMPRE
  get invariant(): boolean {
    return this.floor === -this.ceiling;
  }
  
  get absoluteValue(): number {
    return Math.abs(this.floor);
  }
}

type TierKey = 'aspirante' | 'provisional' | 'pleno' | 'proyecto' | 'organizacion';

interface TierLimits {
  [key: string]: SymmetricLimit;
}

interface ProgressiveTrustConfig {
  // Art 16.2: "Parametrización por Asamblea - montos numéricos establecidos y modificados mediante Acuerdo de Asamblea"
  tiers: TierLimits;
  
  // Art 16.3: "Escalamiento de Confianza - aumento de límites requiere evaluación méritos + votación aprobatoria"
  escalationRules: EscalationRule[];
  
  // Validación global: suma de todos los techos no puede exceder capacidad productiva real
  globalCeilingCap: number;        // TQ máximos en sistema (basado en base material real)
  globalFloorCap: number;          // TQ máximos en deuda (siempre = -globalCeilingCap)
}

const DEFAULT_TIER_LIMITS: TierLimits = {
  // Art 14.2: "Residente provisional recibe límite simétrico inicial parametrizado"
  aspirante:    { floor: -50,   ceiling: 50   },   // Acogida: familiarización TQ
  provisional:  { floor: -100,  ceiling: 100  },   // Integración: cayapas + aprendizaje
  pleno:        { floor: -500,  ceiling: 500  },   // Base: miembro pleno estándar
  proyecto:     { floor: -5000, ceiling: 5000 },   // Art 16.3: "adquisición aperos agrícolas, bombas agua"
  organizacion: { floor: -100000, ceiling: 100000 } // Multi-firma 3/3, servicios comunitarios
};

interface EscalationRule {
  fromTier: TierKey;
  toTier: TierKey;
  requirements: EscalationRequirement[];
  requiresAssemblyVote: boolean;
  voteThreshold: number;           // 0.75 mayoría calificada / 0.85 supermayoría
  autoApproveIfMet: boolean;       // false: siempre voto asamblea
}

interface EscalationRequirement {
  type: 'labor_performance' | 'project_viability' | 'community_benefit' | 'time_in_tier' | 'mentor_endorsement';
  metric: string;
  threshold: number;
  description: string;
}

const ESCALATION_RULES: EscalationRule[] = [
  {
    fromTier: 'aspirante',
    toTier: 'provisional',
    requirements: [
      { type: 'time_in_tier', metric: 'days', threshold: 7, description: 'Mínimo 7 días fase aspirante' },
      { type: 'labor_performance', metric: 'cayapas_completed', threshold: 1, description: 'Al menos 1 cayapa completada' },
      { type: 'mentor_endorsement', metric: 'signed_social_dna', threshold: 1, description: 'ADN Social firmado' }
    ],
    requiresAssemblyVote: false,  // Automático tras evaluación dept acogida
    voteThreshold: 0,
    autoApproveIfMet: true
  },
  {
    fromTier: 'provisional',
    toTier: 'pleno',
    requirements: [
      { type: 'time_in_tier', metric: 'days', threshold: 180, description: 'Mínimo 6 meses residencia provisional' },
      { type: 'labor_performance', metric: 'cayapa_compliance_rate', threshold: 0.9, description: '90% cumplimiento cayapas' },
      { type: 'community_benefit', metric: 'dept_reports_favorable', threshold: 2, description: 'Informes favorables convivencia + trabajo' },
      { type: 'mentor_endorsement', metric: 'mentor_approval', threshold: 1, description: 'Aprobación mentor asignado' }
    ],
    requiresAssemblyVote: true,   // Art 14.3: votación digital asamblea general
    voteThreshold: 0.75,          // mayoría calificada estatutaria
    autoApproveIfMet: false
  },
  {
    fromTier: 'pleno',
    toTier: 'proyecto',
    requirements: [
      { type: 'project_viability', metric: 'technical_memo_approved', threshold: 1, description: 'Memoria técnica aprobada dept correspondiente' },
      { type: 'community_benefit', metric: 'assembly_approved', threshold: 1, description: 'Proyecto aprobado en asamblea' },
      { type: 'labor_performance', metric: 'track_record', threshold: 12, description: '12 meses historial cumplimiento cayapas' }
    ],
    requiresAssemblyVote: true,   // Art 16.3: "requiere evaluación méritos productivos y votación aprobatoria"
    voteThreshold: 0.75,
    autoApproveIfMet: false
  },
  {
    fromTier: 'pleno',
    toTier: 'organizacion',
    requirements: [
      { type: 'community_benefit', metric: 'org_created_by_assembly', threshold: 1, description: 'Organización creada y ratificada en Asamblea General (Art 7.1)' },
      { type: 'project_viability', metric: 'multi_sig_configured', threshold: 3, description: 'Multi-firma 3/3 configurada (Art 7.3)' },
      { type: 'labor_performance', metric: 'collective_track_record', threshold: 24, description: '24 meses operación colectiva demostrada' }
    ],
    requiresAssemblyVote: true,
    voteThreshold: 0.85,          // Supermayoría para crear organización
    autoApproveIfMet: false
  }
];
```

---

## 3. Estado de Límites por Miembro/Entidad

```typescript
// src/core/state/symmetricLimits.ts (continuación)

interface MemberLimitState {
  memberId: string;
  currentTier: TierKey;
  customLimit?: SymmetricLimit;     // override si asamblea aprueba caso a caso
  effectiveLimit: SymmetricLimit;   // calculado: customLimit || tierLimit
  currentBalance: number;           // saldo TQ actual
  creditUsed: number;               // cuánto del floor se ha usado (valor positivo)
  creditAvailable: number;          // floor - creditUsed (negativo = disponible)
  ceilingUsed: number;              // cuánto del ceiling se ha alcanzado (valor positivo)
  ceilingAvailable: number;         // ceiling - ceilingUsed
  
  // Historial escalaciones
  escalationHistory: EscalationRecord[];
  
  // Alertas
  alerts: LimitAlert[];
}

interface EscalationRecord {
  id: string;
  fromTier: TierKey;
  toTier: TierKey;
  requestedAt: number;
  approvedAt?: number;
  approvedBy: 'auto' | 'assembly';
  proposalId?: string;              // si requiere voto
  requirementsMet: boolean[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

interface LimitAlert {
  type: 'floor_warning' | 'floor_critical' | 'ceiling_warning' | 'ceiling_critical' | 'escalation_eligible';
  threshold: number;                // % del límite (ej: 80%, 95%)
  message: string;
  triggeredAt: number;
  acknowledged: boolean;
}

// === ESTADO GLOBAL DEL SISTEMA ===
interface GlobalLimitState {
  // Suma de todos los techos individuales = capacidad de extracción máxima
  totalCeilingSum: number;
  // Suma de todos los pisos individuales = capacidad de deuda máxima (siempre = -totalCeilingSum)
  totalFloorSum: number;
  
  // Capacidad productiva real (base material) - Art 16.1: "nadie puede extraer más valor del que está comprometido a retribuir"
  productiveCapacityTQ: number;     // calculado desde BaseMaterial (tierra, agua, energía, comida, herramientas, semillas)
  
  // Salud del sistema
  utilizationRate: number;          // totalCeilingSum / productiveCapacityTQ
  debtSaturation: number;           // |totalFloorSum| / productiveCapacityTQ
  
  // Alertas globales
  globalAlerts: GlobalLimitAlert[];
}

interface GlobalLimitAlert {
  type: 'capacity_exceeded' | 'debt_saturation' | 'tier_imbalance' | 'productive_gap';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  triggeredAt: number;
}
```

---

## 4. Lógica de Negocio (SymmetricLimitsEngine)

```typescript
// src/core/lib/symmetricLimits.ts

import { DEFAULT_TIER_LIMITS, ESCALATION_RULES, ProgressiveTrustConfig } from './symmetricLimitsConfig';
import type { SymmetricLimit, TierKey, MemberLimitState, EscalationRecord, LimitAlert, GlobalLimitState } from '@core/state/symmetricLimits';
import type { BaseMaterial, Member } from '@core/state/types';
import { autFromCAC } from './metrics'; // Coeficiente Autonomía

export class SymmetricLimitsEngine {
  private memberLimits: Map<string, MemberLimitState> = new Map();
  private globalState: GlobalLimitState;
  private config: ProgressiveTrustConfig;
  private baseMaterial: BaseMaterial;

  constructor(baseMaterial: BaseMaterial, config?: Partial<ProgressiveTrustConfig>) {
    this.baseMaterial = baseMaterial;
    this.config = {
      tiers: DEFAULT_TIER_LIMITS,
      escalationRules: ESCALATION_RULES,
      globalCeilingCap: this.calculateProductiveCapacity(baseMaterial),
      globalFloorCap: -this.calculateProductiveCapacity(baseMaterial),
      ...config
    };
    this.globalState = this.calculateGlobalState();
  }

  // === CÁLCULO CAPACIDAD PRODUCTIVA REAL (Base Material) ===
  
  // "Nadie puede extraer de la comunidad más valor del que está comprometido a retribuir con su esfuerzo"
  // Capacidad productiva = f(tierra, agua, energía, comida, herramientas, semillas)
  private calculateProductiveCapacity(base: BaseMaterial): number {
    // Fórmula basada en CAC vectors y autonomía real
    const aut = autFromCAC(this.calculateCACFromBase(base));
    // Capacidad TQ = autonomía * factor de escala (calibrado por asamblea)
    // Ej: si AUT=1.0 (autosuficiencia total) → capacidad = 5000 TQ (referencia)
    const baseCapacity = 5000; // TQ base para nodo autosuficiente
    return Math.floor(baseCapacity * aut);
  }

  private calculateCACFromBase(base: BaseMaterial): CACVectors {
    // Conversión base material → vectores CAC (ver metrics.ts)
    return {
      ALIM: base.comida_kg_dia * 2500,      // kcal/día per cápita estimado
      ENER: base.energia_kwh_dia,
      SALU: base.herramientas_fabship > 0 ? 1 : 0, // proxy
      HABI: base.tierra_ha * 1000,          // m2 construibles por ha
      PROD: base.herramientas_fabship
    };
  }

  // === INICIALIZACIÓN MIEMBRO ===
  
  initializeMember(memberId: string, initialTier: TierKey = 'aspirante'): MemberLimitState {
    const tierLimit = this.config.tiers[initialTier];
    if (!tierLimit) throw new Error(`Tier ${initialTier} no configurado`);
    
    // Verificar capacidad global antes de asignar
    const newGlobalCeiling = this.globalState.totalCeilingSum + tierLimit.ceiling;
    if (newGlobalCeiling > this.config.globalCeilingCap) {
      throw new Error(`Capacidad productiva excedida: ${newGlobalCeiling}/${this.config.globalCeilingCap} TQ`);
    }
    
    const state: MemberLimitState = {
      memberId,
      currentTier: initialTier,
      effectiveLimit: { ...tierLimit },
      currentBalance: 0,
      creditUsed: 0,
      creditAvailable: tierLimit.floor,      // negativo
      ceilingUsed: 0,
      ceilingAvailable: tierLimit.ceiling,
      escalationHistory: [],
      alerts: []
    };
    
    this.memberLimits.set(memberId, state);
    this.recalculateGlobalState();
    return state;
  }

  // === VALIDACIÓN TRANSACCIONES (Guarda invariante) ===
  
  // Se llama ANTES de cualquier transferencia TQ (caas.ts, trustlines.ts, solarpunk.ts)
  validateTransaction(memberId: string, amount: number): { allowed: boolean; reason?: string; newBalance: number } {
    const state = this.memberLimits.get(memberId);
    if (!state) return { allowed: false, reason: 'Miembro no inicializado en límites', newBalance: 0 };
    
    const newBalance = state.currentBalance + amount;
    const limit = state.effectiveLimit;
    
    // Verificar piso (débit)
    if (newBalance < limit.floor) {
      return { 
        allowed: false, 
        reason: `Excede límite simétrico piso: ${newBalance} < ${limit.floor} (disponible: ${state.creditAvailable})`,
        newBalance 
      };
    }
    
    // Verificar techo (crédit)
    if (newBalance > limit.ceiling) {
      return { 
        allowed: false, 
        reason: `Excede límite simétrico techo: ${newBalance} > ${limit.ceiling} (disponible: ${state.ceilingAvailable})`,
        newBalance 
      };
    }
    
    return { allowed: true, newBalance };
  }

  // Aplicar transacción validada
  applyTransaction(memberId: string, amount: number): boolean {
    const validation = this.validateTransaction(memberId, amount);
    if (!validation.allowed) return false;
    
    const state = this.memberLimits.get(memberId)!;
    state.currentBalance = validation.newBalance;
    
    // Actualizar contadores uso
    if (amount < 0) { // gasto/débito
      state.creditUsed += Math.abs(amount);
      state.creditAvailable = state.effectiveLimit.floor + state.creditUsed; // floor es negativo
    } else { // ingreso/crédito
      state.ceilingUsed += amount;
      state.ceilingAvailable = state.effectiveLimit.ceiling - state.ceilingUsed;
    }
    
    // Verificar alertas
    this.checkAlerts(memberId);
    
    // Verificar elegibilidad escalación
    this.checkEscalationEligibility(memberId);
    
    this.recalculateGlobalState();
    return true;
  }

  // === ESCALACIÓN DE TIER (Art 16.3) ===
  
  async requestEscalation(memberId: string, targetTier: TierKey, justification: string): Promise<EscalationRecord> {
    const state = this.memberLimits.get(memberId);
    if (!state) throw new Error('Miembro no encontrado');
    
    const currentTier = state.currentTier;
    const rule = this.config.escalationRules.find(r => r.fromTier === currentTier && r.toTier === targetTier);
    if (!rule) throw new Error(`Escalación ${currentTier} → ${targetTier} no permitida`);
    
    // Verificar requisitos
    const requirementsMet = await this.evaluateRequirements(memberId, rule.requirements);
    const allMet = requirementsMet.every(m => m);
    
    const record: EscalationRecord = {
      id: `esc_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      fromTier: currentTier,
      toTier: targetTier,
      requestedAt: Date.now(),
      approvedBy: rule.autoApproveIfMet && allMet ? 'auto' : 'assembly',
      requirementsMet,
      status: allMet && rule.autoApproveIfMet ? 'approved' : 'pending'
    };
    
    state.escalationHistory.push(record);
    
    if (record.status === 'approved') {
      await this.executeEscalation(memberId, targetTier);
    } else if (rule.requiresAssemblyVote) {
      // Crear propuesta en módulo democracia (symbiosky.ts / democracy.ts)
      record.proposalId = await this.createAssemblyProposal(memberId, targetTier, justification, rule.voteThreshold);
    }
    
    this.memberLimits.set(memberId, state);
    return record;
  }

  async processAssemblyVote(recordId: string, approved: boolean): Promise<void> {
    // Buscar record en todos los miembros
    for (const state of this.memberLimits.values()) {
      const record = state.escalationHistory.find(r => r.id === recordId);
      if (record) {
        if (approved) {
          await this.executeEscalation(state.memberId, record.toTier);
          record.status = 'approved';
          record.approvedAt = Date.now();
          record.approvedBy = 'assembly';
        } else {
          record.status = 'rejected';
        }
        this.memberLimits.set(state.memberId, state);
        return;
      }
    }
    throw new Error('Record de escalación no encontrado');
  }

  private async executeEscalation(memberId: string, newTier: TierKey): Promise<void> {
    const state = this.memberLimits.get(memberId);
    if (!state) throw new Error('Miembro no encontrado');
    
    const oldLimit = state.effectiveLimit;
    const newLimit = this.config.tiers[newTier];
    if (!newLimit) throw new Error(`Tier ${newTier} no configurado`);
    
    // Verificar capacidad global con nuevo límite
    const ceilingDelta = newLimit.ceiling - oldLimit.ceiling;
    const newGlobalCeiling = this.globalState.totalCeilingSum + ceilingDelta;
    
    if (newGlobalCeiling > this.config.globalCeilingCap) {
      throw new Error(`Escalación excede capacidad productiva global: ${newGlobalCeiling}/${this.config.globalCeilingCap}`);
    }
    
    // Ejecutar cambio
    state.currentTier = newTier;
    state.effectiveLimit = { ...newLimit };
    
    // Recalcular disponibles manteniendo balance actual
    state.creditAvailable = newLimit.floor + state.creditUsed;
    state.ceilingAvailable = newLimit.ceiling - state.ceilingUsed;
    
    // Verificar que balance actual sigue dentro de nuevos límites
    if (state.currentBalance < newLimit.floor || state.currentBalance > newLimit.ceiling) {
      // Revertir si balance fuera de rango
      state.currentTier = state.currentTier; // keep old
      state.effectiveLimit = oldLimit;
      throw new Error(`Balance actual ${state.currentBalance} fuera de nuevos límites [${newLimit.floor}, ${newLimit.ceiling}]`);
    }
    
    this.memberLimits.set(memberId, state);
    this.recalculateGlobalState();
  }

  // === ALERTAS AUTOMÁTICAS ===
  
  private checkAlerts(memberId: string): void {
    const state = this.memberLimits.get(memberId);
    if (!state) return;
    
    const limit = state.effectiveLimit;
    const balance = state.currentBalance;
    
    // Alertas piso (débit)
    const floorUsagePct = (state.creditUsed / Math.abs(limit.floor)) * 100;
    if (floorUsagePct >= 95 && !state.alerts.some(a => a.type === 'floor_critical' && !a.acknowledged)) {
      state.alerts.push({
        type: 'floor_critical',
        threshold: 95,
        message: `Crítico: 95% límite débito usado (${state.creditUsed}/${Math.abs(limit.floor)} TQ)`,
        triggeredAt: Date.now(),
        acknowledged: false
      });
    } else if (floorUsagePct >= 80 && !state.alerts.some(a => a.type === 'floor_warning' && !a.acknowledged)) {
      state.alerts.push({
        type: 'floor_warning',
        threshold: 80,
        message: `Advertencia: 80% límite débito usado`,
        triggeredAt: Date.now(),
        acknowledged: false
      });
    }
    
    // Alertas techo (crédito)
    const ceilingUsagePct = (state.ceilingUsed / limit.ceiling) * 100;
    if (ceilingUsagePct >= 95 && !state.alerts.some(a => a.type === 'ceiling_critical' && !a.acknowledged)) {
      state.alerts.push({
        type: 'ceiling_critical',
        threshold: 95,
        message: `Crítico: 95% límite crédito alcanzado (${state.ceilingUsed}/${limit.ceiling} TQ)`,
        triggeredAt: Date.now(),
        acknowledged: false
      });
    } else if (ceilingUsagePct >= 80 && !state.alerts.some(a => a.type === 'ceiling_warning' && !a.acknowledged)) {
      state.alerts.push({
        type: 'ceiling_warning',
        threshold: 80,
        message: `Advertencia: 80% límite crédito alcanzado`,
        triggeredAt: Date.now(),
        acknowledged: false
      });
    }
  }

  private checkEscalationEligibility(memberId: string): void {
    const state = this.memberLimits.get(memberId);
    if (!state) return;
    
    const currentTier = state.currentTier;
    const nextTierRule = this.config.escalationRules.find(r => r.fromTier === currentTier);
    if (!nextTierRule) return; // tier máximo
    
    // Verificar si cumple requisitos para próxima escalación
    this.evaluateRequirements(memberId, nextTierRule.requirements).then(met => {
      if (met.every(m => m) && !state.alerts.some(a => a.type === 'escalation_eligible' && !a.acknowledged)) {
        state.alerts.push({
          type: 'escalation_eligible',
          threshold: 100,
          message: `Elegible para escalar a ${nextTierRule.toTier}: cumple requisitos`,
          triggeredAt: Date.now(),
          acknowledged: false
        });
        this.memberLimits.set(memberId, state);
      }
    });
  }

  private async evaluateRequirements(memberId: string, requirements: EscalationRequirement[]): Promise<boolean[]> {
    // Implementar según tipo de requisito
    // Integrar con: cayapaEnforcement (labor_performance), admissionWorkflow (time_in_tier), 
    // departments (mentor_endorsement), projects (project_viability), democracy (assembly_approved)
    return requirements.map(() => true); // stub
  }

  // === ESTADO GLOBAL ===
  
  private recalculateGlobalState(): void {
    let totalCeiling = 0;
    let totalFloor = 0;
    
    for (const state of this.memberLimits.values()) {
      totalCeiling += state.effectiveLimit.ceiling;
      totalFloor += state.effectiveLimit.floor;
    }
    
    const productiveCapacity = this.calculateProductiveCapacity(this.baseMaterial);
    
    this.globalState = {
      totalCeilingSum: totalCeiling,
      totalFloorSum: totalFloor,
      productiveCapacityTQ: productiveCapacity,
      utilizationRate: productiveCapacity > 0 ? totalCeiling / productiveCapacity : 0,
      debtSaturation: productiveCapacity > 0 ? Math.abs(totalFloor) / productiveCapacity : 0,
      globalAlerts: this.generateGlobalAlerts(totalCeiling, totalFloor, productiveCapacity)
    };
  }

  private generateGlobalAlerts(ceiling: number, floor: number, capacity: number): GlobalLimitAlert[] {
    const alerts: GlobalLimitAlert[] = [];
    const utilization = capacity > 0 ? ceiling / capacity : 0;
    const debtSat = capacity > 0 ? Math.abs(floor) / capacity : 0;
    
    if (utilization > 1.0) {
      alerts.push({ type: 'capacity_exceeded', severity: 'critical', 
        message: `Capacidad productiva excedida: ${ceiling}/${capacity} TQ (${(utilization*100).toFixed(1)}%)`, triggeredAt: Date.now() });
    } else if (utilization > 0.8) {
      alerts.push({ type: 'capacity_exceeded', severity: 'warning', 
        message: `Capacidad productiva al ${(utilization*100).toFixed(1)}%`, triggeredAt: Date.now() });
    }
    
    if (debtSat > 1.0) {
      alerts.push({ type: 'debt_saturation', severity: 'critical', 
        message: `Saturación deuda: ${Math.abs(floor)}/${capacity} TQ`, triggeredAt: Date.now() });
    }
    
    // Verificar invariante global
    if (ceiling + floor !== 0) {
      alerts.push({ type: 'tier_imbalance', severity: 'critical', 
        message: `INVARIANTE ROTA: floor + ceiling = ${ceiling + floor} ≠ 0`, triggeredAt: Date.now() });
    }
    
    return alerts;
  }

  // === CONSULTAS ===
  
  getMemberState(memberId: string): MemberLimitState | undefined {
    return this.memberLimits.get(memberId);
  }

  getAllMemberStates(): MemberLimitState[] {
    return Array.from(this.memberLimits.values());
  }

  getGlobalState(): GlobalLimitState {
    return { ...this.globalState };
  }

  getTierLimit(tier: TierKey): SymmetricLimit {
    return this.config.tiers[tier];
  }

  updateBaseMaterial(newBase: BaseMaterial): void {
    this.baseMaterial = newBase;
    this.config.globalCeilingCap = this.calculateProductiveCapacity(newBase);
    this.config.globalFloorCap = -this.config.globalCeilingCap;
    this.recalculateGlobalState();
  }

  // Stubs
  private async createAssemblyProposal(memberId: string, targetTier: TierKey, justification: string, threshold: number): Promise<string> {
    return `prop_esc_${Date.now()}`;
  }
}
```

---

## 5. Integración con Store (Zustand)

```typescript
// En store.ts - agregar slice symmetricLimits

interface SymmetricLimitsState {
  engine: SymmetricLimitsEngine;
  memberStates: Map<string, MemberLimitState>;
  globalState: GlobalLimitState;
  
  // Acciones
  initializeMember: (memberId: string, tier?: TierKey) => MemberLimitState;
  validateTransaction: (memberId: string, amount: number) => ValidationResult;
  applyTransaction: (memberId: string, amount: number) => boolean;
  requestEscalation: (memberId: string, targetTier: TierKey, justification: string) => Promise<EscalationRecord>;
  processAssemblyVote: (recordId: string, approved: boolean) => Promise<void>;
  acknowledgeAlert: (memberId: string, alertIndex: number) => void;
  getMemberState: (memberId: string) => MemberLimitState | undefined;
  getGlobalState: () => GlobalLimitState;
  updateBaseMaterial: (base: BaseMaterial) => void;
  getTierLimit: (tier: TierKey) => SymmetricLimit;
}

interface ValidationResult {
  allowed: boolean;
  reason?: string;
  newBalance: number;
}
```

---

## 6. Pantalla SymmetricLimits.tsx

```tsx
// src/app/screens/SymmetricLimits.tsx

export function SymmetricLimitsScreen() {
  const { 
    memberStates, 
    globalState, 
    initializeMember, 
    validateTransaction, 
    applyTransaction,
    requestEscalation,
    processAssemblyVote,
    acknowledgeAlert,
    getTierLimit 
  } = useAppStore();

  const members = Array.from(memberStates.values());
  const tiers = ['aspirante', 'provisional', 'pleno', 'proyecto', 'organizacion'] as TierKey[];

  return (
    <div className="p-6 space-y-6">
      <Header title="Límites Simétricos + Confianza Progresiva" subtitle="Art 16 - floor = -ceiling SIEMPRE | Escalación por méritos + voto asamblea" />
      
      {/* Salud global del sistema */}
      <GlobalHealthCard 
        globalState={globalState}
        onUpdateBaseMaterial={updateBaseMaterial}
      />
      
      {/* Configuración tiers (parametrizable asamblea) */}
      <Card>
        <CardHeader title="Configuración Tiers (Parametrizable Asamblea)" />
        <CardContent>
          <TierConfigTable 
            tiers={tiers}
            limits={tiers.map(t => ({ tier: t, limit: getTierLimit(t) }))}
            onUpdate={updateTierLimit} // solo asamblea
          />
        </CardContent>
      </Card>

      {/* Estado por miembro */}
      <Card>
        <CardHeader title="Límites por Miembro" />
        <CardContent>
          <MemberLimitsTable 
            members={members}
            onRequestEscalation={requestEscalation}
            onAcknowledgeAlert={acknowledgeAlert}
            onViewHistory={viewEscalationHistory}
          />
        </CardContent>
      </Card>

      {/* Escalaciones pendientes */}
      <EscalationQueuePanel 
        onProcessVote={processAssemblyVote}
      />
    </div>
  );
}
```

---

## 7. Integración con Módulos Existentes

```typescript
// Puntos de integración obligatorios:

// 1. caas.ts (transacciones TQ) - ANTES de cualquier transferencia
function caasTransfer(from: string, to: string, amount: number): boolean {
  // Validar límite simétrico ORIGEN (débito)
  const fromValidation = symmetricLimits.validateTransaction(from, -amount);
  if (!fromValidation.allowed) return false;
  
  // Validar límite simétrico DESTINO (crédito)
  const toValidation = symmetricLimits.validateTransaction(to, amount);
  if (!toValidation.allowed) return false;
  
  // Aplicar en ambos
  symmetricLimits.applyTransaction(from, -amount);
  symmetricLimits.applyTransaction(to, amount);
  
  return true;
}

// 2. trustlines.ts (crédito mutuo bilateral) - validar límites antes de abrir línea
function openTrustline(a: string, b: string, creditGiven: number, creditReceived: number): boolean {
  // creditGiven = cuánto A presta a B (A aumenta su ceiling usage)
  // creditReceived = cuánto B puede deber a A (B aumenta su floor usage)
  const aVal = symmetricLimits.validateTransaction(a, creditGiven); // A da crédito → balance +creditGiven
  const bVal = symmetricLimits.validateTransaction(b, -creditReceived); // B recibe deuda → balance -creditReceived
  return aVal.allowed && bVal.allowed;
}

// 3. solarpunk.ts (ofertas/necesidades) - validar antes de crear exchange
function doExchange(offerId: string, needId: string, znuAmount: number): boolean {
  const offer = getOffer(offerId);
  const need = getNeed(needId);
  // offer.from recibe znuAmount (crédito)
  // need.by paga znuAmount (débito)
  return symmetricLimits.applyTransaction(offer.from, znuAmount) && 
         symmetricLimits.applyTransaction(need.by, -znuAmount);
}

// 4. vesting.ts / caas.ts (payouts) - validar antes de distribuir
function runCaasPayout(baseZNU: number): void {
  const payouts = calculatePayouts(baseZNU);
  for (const payout of payouts) {
    if (!symmetricLimits.applyTransaction(payout.memberId, payout.amount)) {
      // Log alerta: miembro en límite, no puede recibir payout
      logAlert(`Payout bloqueado para ${payout.memberId}: límite simétrico alcanzado`);
    }
  }
}
```

---

## 8. Criterios de Aceptación (Definition of Done)

- [ ] Invariante `floor === -ceiling` blindada: imposible crear límite asimétrico
- [ ] 5 tiers configurables por asamblea (aspirante, provisional, pleno, proyecto, organizacion)
- [ ] Validación PRE-transacción en todos los módulos (caas, trustlines, solarpunk, vesting)
- [ ] Escalación: requisitos evaluados + voto asamblea (threshold configurable 75-85%)
- [ ] Capacidad productiva global calculada desde BaseMaterial (CAC vectors)
- [ ] Alertas automáticas: 80% warning, 95% critical (piso y techo)
- [ ] Escalation eligible alert cuando cumple requisitos
- [ ] Reversión automática si escalación dejaría balance fuera de nuevos límites
- [ ] Tests: invariante, validación transacciones, escalación auto/asamblea, capacidad global, alertas

---

## 9. Referencias Normativas

- **Art 16.1**: Simetría Estricta - "piso negativo y techo positivo tienen idéntico valor absoluto"
- **Art 16.1**: "Nadie puede extraer de la comunidad más valor del que está comprometido a retribuir con su esfuerzo"
- **Art 16.2**: Parametrización por Asamblea - "montos numéricos establecidos y modificados mediante Acuerdo de Asamblea"
- **Art 16.3**: Escalamiento de Confianza - "aumento de límites requiere evaluación méritos productivos y votación aprobatoria"
- **Art 14.2**: Residente provisional "recibe un límite simétrico inicial parametrizado en la plataforma"
- **Libro Ecoaldeas Federadas Cap 8-10**: 5 Pilares Moneda Cero, Límite Simétrico, Confianza Progresiva
- **vitalTimeInvariants.ts**: 1 TQ = 1 kWh = invariante termodinámica base