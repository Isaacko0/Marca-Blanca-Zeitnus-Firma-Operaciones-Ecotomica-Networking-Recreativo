# Spec: ITC — Integral Time Credits (Devguide Sección 3.4)

**Fuente:** Integral Devguide v0.1, Sección 3.4 — "ITC — Integral Time Credits (Proposed Core Modules)"  
*Nota: devguide numera 3.3=ITC, 3.4=COS, 3.5=FRS. Aquí sigo la arquitectura real: CDS→OAD→COS→ITC→FRS*
**Prioridad:** P1 (Contabilidad de contribución - "Credits are not money and cannot be transferred, traded, or accumulated indefinitely")
**Archivos Zeitnus:** `src/core/lib/itc.ts`, `src/core/state/itc.ts`, `src/app/screens/ITC.tsx`

---

## Principios Fundacionales (NON-NEGOTIABLES)

1. **No-transferibilidad**: `transferable: false` — campo arquitectónico, nunca policy
2. **Decay obligatorio**: Créditos decaen exponencialmente tras grace window
3. **Extinguishment no redemption**: Créditos se EXTINGUEN al acceso permanente, no se transfieren
4. **Valoración basada en trabajo real**: Ponderación skill × scarcity × ecological_sensitivity
5. **Política CDS-only**: ITC NO setea su propia policy — CDS lo hace via PolicySnapshot

---

## Módulos Mínimos Viables

### M1 — Labor Intake & Verification (Included)

```typescript
// src/core/lib/itc.ts

// Consume LaborEvent de COS (via COS_ITC_Interface)
// Verifica: verified=true, hours_verified > 0, skill_tier válido
// Emite: LaborEvent verificado → cola de ponderación

export interface VerifiedLaborEvent extends LaborEvent {
  // LaborEvent ya incluye verification_status, hours_verified, verified_by
  // ITC M1 solo filtra verified=true
  itc_ready: boolean;  // true si verified y hours_verified > 0
}
```

### M2 — Contribution Weighting (Included, Simplified)

```typescript
// Ponderación acotada: skill × scarcity × ecological_sensitivity
// White paper: weight = skill_factor × scarcity_factor × ecological_factor
// Acotado: max_total_multiplier (CDS policy)

export interface WeightingFactors {
  skill_factor: number;           // 1.0 (low) - 2.0 (expert) [CDS max_skill_factor]
  scarcity_factor: number;        // 1.0 - 1.5 [CDS max_scarcity_factor]
  ecological_factor: number;      // 1.0 - 1.3 [CDS max_ecological_factor]
  total_multiplier: number;       // product, bounded by max_total_multiplier
}

export function calculateWeight(
  skillTier: SkillTier,
  scarcitySignal: number,         // 0-1 from FRS/CDS
  ecologicalSensitivity: number,  // 0-1 from OAD design
  policy: ITCPolicySnapshot['weighting_limits']
): WeightingFactors {
  const skillMap: Record<SkillTier, number> = { low: 1.0, medium: 1.2, high: 1.5, expert: 2.0 };
  const skill_factor = Math.min(skillMap[skillTier], policy.max_skill_factor);
  const scarcity_factor = Math.min(1.0 + scarcitySignal * 0.5, policy.max_scarcity_factor);
  const ecological_factor = Math.min(1.0 + ecologicalSensitivity * 0.3, policy.max_ecological_factor);
  
  const total = skill_factor * scarcity_factor * ecological_factor;
  const total_multiplier = Math.min(total, policy.max_total_multiplier);
  
  return { skill_factor, scarcity_factor, ecological_factor, total_multiplier };
}

// Output: itc_weighted_hours = hours_verified × total_multiplier
//         itc_credits_issued = itc_weighted_hours (1 hour = 1 credit base)
```

### M3 — Time-Decay Engine (Included, Full Principle)

```typescript
// Decay exponencial con grace window de inactividad
// CDS ratifica DecayRule (half-life, grace days, max annual fraction)

// DecayRule stored in CDS policy store, referenced by ITCAccount.active_decay_rule_id

export interface DecayRule {
  rule_id: string;
  half_life_days: number;             // exponential half-life beyond grace window
  inactivity_grace_days: number;      // no decay within this window after last contribution
  min_balance_protected: number;      // small protected floor
  max_annual_fraction: number;        // CDS safety bound (e.g. 0.5 = max 50%/year)
  ratified_at: number;
  ratified_by: ParticipantId[];
  supersedes: string | null;
  version: number;
}

export interface DecayCalculation {
  participant_id: ParticipantId;
  current_balance: number;
  last_contribution_at: number;
  last_decay_applied_at: number;
  rule: DecayRule;
  
  // Calculation
  days_since_contribution: number;
  days_in_grace: number;
  decayable_balance: number;
  decay_applied: number;
  new_balance: number;
  next_decay_at: number;
}

export function applyDecay(account: ITCAccount, now: number = Date.now()): DecayCalculation {
  const rule = getDecayRule(account.active_decay_rule_id);
  const daysSinceContribution = (now - account.last_contribution_at) / (1000 * 60 * 60 * 24);
  const daysSinceDecay = (now - account.last_decay_applied_at) / (1000 * 60 * 60 * 24);
  
  // Grace window: no decay if within grace period of last contribution
  if (daysSinceContribution <= rule.inactivity_grace_days) {
    return {
      participant_id: account.participant_id,
      current_balance: account.balance,
      last_contribution_at: account.last_contribution_at,
      last_decay_applied_at: account.last_decay_applied_at,
      rule,
      days_since_contribution: daysSinceContribution,
      days_in_grace: Math.min(daysSinceContribution, rule.inactivity_grace_days),
      decayable_balance: 0,
      decay_applied: 0,
      new_balance: account.balance,
      next_decay_at: account.last_contribution_at + rule.inactivity_grace_days * 24 * 60 * 60 * 1000
    };
  }
  
  // Decayable balance = balance - min_balance_protected
  const decayable = Math.max(0, account.balance - rule.min_balance_protected);
  
  // Exponential decay: balance * (0.5)^(days/half_life)
  // Applied incrementally since last decay
  const decayRate = Math.log(2) / rule.half_life_days;  // daily rate
  const decayFraction = 1 - Math.exp(-decayRate * daysSinceDecay);
  
  // Cap at max_annual_fraction
  const annualized = decayFraction * (365 / daysSinceDecay);
  const cappedFraction = Math.min(decayFraction, rule.max_annual_fraction / (daysSinceDecay / 365));
  
  const decayApplied = decayable * cappedFraction;
  const newBalance = account.balance - decayApplied;
  
  return {
    participant_id: account.participant_id,
    current_balance: account.balance,
    last_contribution_at: account.last_contribution_at,
    last_decay_applied_at: account.last_decay_applied_at,
    rule,
    days_since_contribution: daysSinceContribution,
    days_in_grace: rule.inactivity_grace_days,
    decayable_balance: decayable,
    decay_applied: decayApplied,
    new_balance: Math.max(rule.min_balance_protected, newBalance),
    next_decay_at: now + 24 * 60 * 60 * 1000  // daily recalculation
  };
}

// Scheduled job: run applyDecay for all accounts daily
// Updates ITCAccount: balance, total_decayed, last_decay_applied_at
// Emits ITCLedgerEntry type='itc_decayed'
```

### M4 — Access Valuation (Included)

```typescript
// Access cost = itc_access_cost from CertifiedDesign (simple_embodied method)
// Future methods: weighted_labor, lifecycle_inclusive, etc.

export interface AccessValuation {
  design_id: DesignId;
  design_version: string;
  item_id: string;                    // specific produced item instance
  access_cost_itc: number;            // credits required for permanent acquisition
  access_cost_method: string;         // 'simple_embodied' | future
  equivalence_band: EquivalenceBand | null;  // [DEFERRED] cross-node
  valid_at: number;
  valid_until: number | null;         // if design superseded
}

export function quoteAccessCost(designId: DesignId, version: string): AccessValuation {
  const design = getCertifiedDesign(designId, version);
  if (!design || design.status !== 'certified') {
    throw new Error('Design not certified - cannot quote access');
  }
  return {
    design_id: designId,
    design_version: version,
    item_id: '',  // filled when specific item allocated
    access_cost_itc: design.itc_access_cost,
    access_cost_method: design.itc_access_cost_method,
    equivalence_band: null,
    valid_at: Date.now(),
    valid_until: design.superseded_by ? Date.now() + 86400000 : null  // 1 day grace
  };
}
```

### M5 — Access Redemption / Extinguishment (Included)

```typescript
// EXTINGUISHMENT: credits CEASE TO EXIST when permanently acquiring goods
// NOT transfer, NOT redemption - EXTINGUISHMENT = termination

export interface AccessRedemption {
  redemption_id: string;
  participant_id: ParticipantId;
  item_id: string;
  design_id: DesignId;
  design_version: string;
  access_type: 'permanent_acquisition' | 'shared_use';
  itc_extinguished: number;           // credits extinguished (0 for shared_use)
  valuation_ref: string;              // AccessValuation used
  redeemed_at: number;
  authorized_by: ParticipantId;       // Access Center operator
  location: string;                   // Access Center / Tool Library / Distribution Node
}

// Guard: account.balance >= itc_extinguished
// On permanent_acquisition:
//   - account.balance -= itc_extinguished
//   - account.total_redeemed += itc_extinguished
//   - account.last_access_at = now
//   - emit ITCLedgerEntry type='access_redeemed' amount=-itc_extinguished
// On shared_use:
//   - NO credit extinguishment
//   - log usage for FRS monitoring
//   - return deadline tracked separately

export function extinguishCredits(
  account: ITCAccount, 
  amount: number, 
  redemption: AccessRedemption
): ITCAccount {
  if (account.balance < amount) throw new Error('Insufficient credits');
  if (amount > 0 && redemption.access_type !== 'permanent_acquisition') {
    throw new Error('Credits only extinguished for permanent_acquisition');
  }
  return {
    ...account,
    balance: account.balance - amount,
    total_redeemed: account.total_redeemed + amount,
    last_access_at: redemption.redeemed_at,
    last_updated_at: Date.now()
  };
}
```

### M6 — Equity Monitoring (Deferred - but data structures ready)

```typescript
// FRS reads balance_distribution from ITC_FRS_Interface
// ITC provides: gini, max_balance_ratio, participation_rate
// CDS sets fairness_thresholds in ITCPolicySnapshot

export interface EquityMetrics {
  gini_coefficient: number;
  max_balance_ratio: number;      // max/median
  participation_rate: number;     // active_participants / total_participants
  need_adjustments_active: number;
  thresholds: {
    max_gini: number;
    max_balance_ratio: number;
    min_participation_rate: number;
  };
  violations: EquityViolation[];
}

export interface EquityViolation {
  type: 'gini_exceeded' | 'concentration_exceeded' | 'participation_low';
  severity: 'warning' | 'critical';
  value: number;
  threshold: number;
  detected_at: number;
}
```

### M7 — Ethics & Coercion Detection (Included, Minimal)

```typescript
// Detecta: coercion, preferential treatment for high-balance holders, role cornering
// Escala via FRS → CDS

export interface EthicsFlag {
  flag_id: string;
  flag_type: 'coercion' | 'preferential_treatment' | 'role_cornering' | 'credit_concentration';
  participant_id: ParticipantId;
  target_id: ParticipantId | null;
  description: string;
  evidence_refs: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_at: number;
  detected_by: 'ITC_M7' | 'FRS' | 'manual';
  status: 'open' | 'investigating' | 'escalated_to_frs' | 'resolved';
  frs_finding_ref: FindingId | null;
  cds_issue_ref: IssueId | null;
}

// Detection rules (simplified Phase 2):
// - coercion: labor_event where participant reports pressure (manual flag)
// - preferential_treatment: access_granted to high-balance holder bypassing queue
// - role_cornering: single participant holds >threshold of specialized skill tasks
// - credit_concentration: balance > max_credit_concentration (CDS policy)

export function scanEthicsFlags(
  accounts: Map<string, ITCAccount>,
  recentAccess: AccessRedemption[],
  recentLabor: LaborEvent[],
  policy: ITCPolicySnapshot['anti_coercion_rules']
): EthicsFlag[] {
  const flags: EthicsFlag[] = [];
  
  // Credit concentration
  for (const [pid, acc] of accounts) {
    if (acc.balance > policy.max_credit_concentration) {
      flags.push({
        flag_id: `eth_${Date.now()}_${pid}`,
        flag_type: 'credit_concentration',
        participant_id: pid,
        target_id: null,
        description: `Balance ${acc.balance} exceeds concentration threshold ${policy.max_credit_concentration}`,
        evidence_refs: [acc.account_id],
        severity: 'high',
        detected_at: Date.now(),
        detected_by: 'ITC_M7',
        status: 'escalated_to_frs',
        frs_finding_ref: null,
        cds_issue_ref: null
      });
    }
  }
  
  // Role cornering (simplified)
  if (policy.role_cornering_threshold) {
    // Analyze recentLabor for skill_tier concentration per participant
  }
  
  return flags;
}
```

### M8 — Policy Synchronization (Included)

```typescript
// ITC NO setea policy — CDS lo hace
// ITC Module 8: sincroniza con CDS policy snapshot

export interface ITCPolicySnapshot {
  // Current CDS-ratified parameters bounding ITC behavior
  weighting_limits: {
    max_skill_factor: number;
    max_scarcity_factor: number;
    max_ecological_factor: number;
    max_total_multiplier: number;
  };
  decay_rule: DecayRule;  // full rule inline for sync
  fairness_thresholds: {
    max_gini: number;
    max_balance_ratio: number;
    min_participation_rate: number;
  };
  access_policy: {
    equivalence_bands: EquivalenceBand[];
    need_adjustment_criteria: string;
  };
  anti_coercion_rules: {
    max_credit_concentration: number;
    role_cornering_threshold: number;
    preferential_treatment_detection: boolean;
  };
  snapshot_id: string;
  snapshot_at: number;
}

export function syncPolicy(): ITCPolicySnapshot {
  // Called on CDS policy change (via CDS_AllSystems_Interface.notify_dispatch)
  // Fetches active policies from CDS, builds snapshot, stores in ITC
  // All ITC modules read from this snapshot, not directly from CDS
}
```

### M9 — Ledger & Transparency (Included, Full Principle)

```typescript
// Append-only ledger: every credit change recorded
// ITCLedgerEntry schema (ver DATA_CONTRACTS_SPEC)

export function recordLedgerEntry(entry: Omit<ITCLedgerEntry, 'entry_id' | 'timestamp'>): ITCLedgerEntry {
  const fullEntry: ITCLedgerEntry = {
    ...entry,
    entry_id: `le_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    timestamp: Date.now()
  };
  // Append to ledger (immutable)
  // Update account balance
  // Emit signal for FRS if needed
  return fullEntry;
}
```

---

## Interfaces ITC (desde INTERFACES_SPEC)

```typescript
// ITC → FRS: get_credit_summary, get_ledger_entries, get_balance_distribution
// ITC → CDS: submit_adjustment_request, submit_capacity_flag
// ITC → COS: submit_valuation_signal
// CDS → ITC: get_itc_policy_snapshot (via CDS_AllSystems_Interface)
```

---

## Estado Actual en Zeitnus

| Función | Estado | Archivo |
|---|---|---|
| `awardCredits(participant, raw, ageDays, decayPerDay)` | ⚠️ Básica (decay simple) | `integral.ts:83-86` |
| `TimeCredit` interface | ⚠️ Array simple, NO ITCAccount + ITCLedgerEntry | `integral.ts:45-51` |
| Weighting | ❌ | FALTA |
| DecayRule CDS-ratificada | ❌ | FALTA |
| AccessValuation / Redemption | ❌ | FALTA |
| Ethics Detection M7 | ❌ | FALTA |
| PolicySync | ❌ | FALTA |
| Ledger append-only | ❌ | FALTA |

---

## Criterios de Aceptación

- [ ] `ITCAccount` por participante con decay config inline + `transferable: false`
- [ ] `ITCLedgerEntry` append-only con `raw_hours` + `weighted_credits` en labor entries
- [ ] `DecayRule` CDS-ratificada (half-life, grace, max_annual, min_protected)
- [ ] `applyDecay()` daily job con grace window + exponential decay + annual cap
- [ ] `WeightingFactors` = skill × scarcity × ecological, acotado por CDS policy
- [ ] `AccessValuation` desde `CertifiedDesign.itc_access_cost`
- [ ] `AccessRedemption` extinguishment (NO transfer) para permanent_acquisition
- [ ] `shared_use` = 0 credits extinguished, solo log usage
- [ ] `EthicsFlag` detection: concentration, coercion, role cornering, preferential
- [ ] `ITCPolicySnapshot` sync desde CDS (weighting, decay, fairness, access, anti-coercion)
- [ ] Interfaces ITC→FRS, ITC→CDS, ITC→COS, CDS→ITC implementadas
- [ ] Tests: decay calculation, weighting bounds, extinguishment guards, ethics scan

---

## Referencias Normativas

- **Devguide 3.4**: ITC Proposed Core Modules (M1, M2, M3, M4, M5, M7, M8, M9 included; M6 deferred)
- **Devguide 2.2**: "ITC reads from COS... maintains transparent append-only record... Module 7 detects ethical violations"
- **Devguide 4.3**: ITCAccount + ITCLedgerEntry schemas completos
- **Devguide 4.4**: 4 interfaces ITC (3 outbound, 1 inbound from CDS)
- **White Paper ITC**: Non-transferability, decay, weighting, access, ethics modules