# ALRAC CaaS Membership Spec

**Capa:** 2 — Interoperabilidad (CaaS/HSCSG)  
**Versión:** 1.0  
**Estado:** Draft  
**Fecha:** 2026-09-19  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir la estructura de **membresía CaaS** dentro del Consorcio ALRAC, incluyendo los 3 niveles de membresía (Tres Horizontes), derechos, obligaciones, y flujo de valor entre niveles.

---

## 2. Tres Horizontes ↔ 3 Niveles Membresía

| Horizonte | Nivel Membresía | Enfoque | Compromiso | Beneficios Core |
|-----------|----------------|---------|------------|-----------------|
| **H1 (0-3m)** | **Afiliados** | Liquidez / TQ | Bajo (mensual) | Acceso Market, TQ earnings, CSA básico |
| **H2 (3-18m)** | **Asociados** | Estabilidad / CaaS | Medio (trimestral) | Revenue share, gobernanza, staking ZNU |
| **H3 (18m+)** | **Núcleo** | Patrimonio / ZNU | Alto (anual + stake) | Gobernanza plena, veto, Amid share, land rights |

---

## 3. Interfaz Canónica

```typescript
export type CaaSTierKey = 'afiliados' | 'asociados' | 'nucleo';

export interface CaaSMembership {
  // Identidad
  memberId: string;           // RAO-verified identity
  tier: CaaSTierKey;
  joinedAt: number;           // Timestamp
  renewedAt: number;          // Última renovación
  
  // Stake & Compromiso
  znuStaked: number;          // ZNU en staking (0 para Afiliados)
  tqContributed: number;      // TQ aportados (kWh equivalentes)
  usdcContributed: number;    // USD/USDC aportados
  
  // Derechos activos
  rights: MembershipRights;
  
  // Métricas de participación
  participationScore: number; // 0-1 (votaciones, contribuciones, auditorías)
  autonomyIndex: number;      // AUT personal (0-1)
  
  // Estado
  status: 'active' | 'grace_period' | 'suspended' | 'exited';
  exitRequestedAt: number | null;
  
  // Historial
  tierHistory: TierTransition[];
}

export interface MembershipRights {
  // Gobernanza
  canVote: boolean;                    // 1a1v en asambleas
  canPropose: boolean;                 // Proponer cambios
  canVeto: boolean;                    // Veto (solo Núcleo)
  cdsWeight: number;                   // Peso en CDS (0-1)
  
  // Económicos
  revenueShareEligible: boolean;       // Participa en reparto 30%
  stakingRewards: boolean;             // Recibe rewards ZNU/TQ
  csaAccess: boolean;                  // Acceso CSA subscription
  tourismDiscount: number;             // % descuento turismo regenerativo
  
  // Técnicos
  apiAccess: string[];                 // ['read', 'write', 'admin']
  dataSovereigntyLevel: 'basic' | 'full' | 'admin';
  
  // Territoriales
  landUseRights: boolean;              // Derechos uso tierra (Núcleo)
  nodeHosting: boolean;                // Puede hostear nodo
}
```

---

## 4. Derechos por Nivel

| Derecho | Afiliados (H1) | Asociados (H2) | Núcleo (H3) |
|---------|----------------|----------------|-------------|
| `canVote` | ✅ | ✅ | ✅ |
| `canPropose` | ❌ | ✅ | ✅ |
| `canVeto` | ❌ | ❌ | ✅ |
| `cdsWeight` | 0.1 | 0.5 | 1.0 |
| `revenueShareEligible` | ❌ | ✅ | ✅ |
| `stakingRewards` | ❌ | ✅ | ✅ (2x) |
| `csaAccess` | ✅ (básico) | ✅ (full) | ✅ (priority) |
| `tourismDiscount` | 5% | 15% | 30% |
| `apiAccess` | ['read'] | ['read','write'] | ['read','write','admin'] |
| `dataSovereigntyLevel` | 'basic' | 'full' | 'admin' |
| `landUseRights` | ❌ | ❌ | ✅ |
| `nodeHosting` | ❌ | ✅ | ✅ |

---

## 5. Transiciones de Nivel (Tier Transitions)

### 5.1 Afiliados → Asociados (H1 → H2)
**Requisitos MÍNIMOS (todos obligatorios):**
```
✓ joinedAt ≥ 90 días (3 meses)
✓ participationScore ≥ 0.6
✓ tqContributed ≥ 500 TQ (kWh equivalentes)
✓ znuStaked ≥ 1,000 ZNU (stake mínimo)
✓ autonomyIndex ≥ 0.4
✓ 2 RAO vigentes como aval
✓ Aprobación asamblea simple (50%+1)
```

### 5.2 Asociados → Núcleo (H2 → H3)
**Requisitos MÍNIMOS (todos obligatorios):**
```
✓ joinedAt ≥ 540 días (18 meses)
✓ participationScore ≥ 0.8
✓ tqContributed ≥ 5,000 TQ
✓ znuStaked ≥ 10,000 ZNU
✓ autonomyIndex ≥ 0.7
✓ 3 RAO vigentes (incluye 1 Núcleo actual)
✓ Triaxial verification personal vigente
✓ Aprobación asamblea cualificada (66%+)
✓ Compromiso land/stake: 5 años mínimo
```

### 5.3 Degradación (cualquier dirección)
**Triggers automáticos:**
```
⚠ participationScore < 0.3 por 2 ciclos → grace_period (30 días)
⚠ znuStaked < mínimo nivel por 60 días → grace_period
⚠ autonomyIndex < 0.2 → revisión obligatoria
⚠ 3 auditorías fallidas → suspended → exit process
```

---

## 6. Staking ZNU por Nivel

```typescript
const STAKING_CONFIG = {
  afiliados: {
    minStake: 0,
    rewardRate: 0,           // Sin rewards directos
    lockupDays: 0,
    slashConditions: []
  },
  asociados: {
    minStake: 1_000,
    rewardRate: 0.03,        // 3% anual en ZNU
    lockupDays: 90,
    slashConditions: [
      'governance_absence_3_consecutive',
      'audit_failure',
      'base_material_damage'
    ]
  },
  nucleo: {
    minStake: 10_000,
    rewardRate: 0.06,        // 6% anual en ZNU (2x)
    lockupDays: 365,
    slashConditions: [
      'governance_absence_2_consecutive',
      'audit_failure',
      'base_material_damage',
      'veto_abuse',
      'triaxial_falsification'
    ]
  }
};
```

---

## 7. Reparto Amid por Nivel (35/35/30)

```typescript
function calculateMemberAmidShare(member: CaaSMembership, pool: AmidPool): MemberShare {
  const baseWeight = member.cdsWeight;  // 0.1 | 0.5 | 1.0
  const participationMultiplier = 1 + member.participationScore;  // 1.0 - 2.0
  const autonomyMultiplier = 1 + member.autonomyIndex;  // 1.0 - 2.0
  
  const finalWeight = baseWeight * participationMultiplier * autonomyMultiplier;
  
  return {
    amidDabir: pool.amidDabir * (finalWeight / pool.totalWeight),
    yokaCommons: pool.yokaCommons * (finalWeight / pool.totalWeight),
    nodeOperators: pool.nodeOperators * (finalWeight / pool.totalWeight),
    // En ZNU:
    amidDabirZnu: pool.amidDabirZnu * (finalWeight / pool.totalWeight),
    yokaCommonsZnu: pool.yokaCommonsZnu * (finalWeight / pool.totalWeight),
    nodeOperatorsZnu: pool.nodeOperatorsZnu * (finalWeight / pool.totalWeight)
  };
}
```

---

## 8. Exit Process (Salida Ordenada)

```
EXIT REQUESTED
    │
    ▼
[30 días notice] → [Liquidación stake] → [Transfer rights] → [Exit audit]
    │                    │                    │                │
    ▼                    ▼                    ▼                ▼
Grace period      ZNU unlocked         Vote transfer      RAO revocation
(30 días)         pro-rata             to successor       certificada
    │                    │                    │                │
    └────────────────────┴────────────────────┴────────────┘
                                  │
                                  ▼
                            MEMBER EXITED
                            (data archivada, RAO revocada)
```

---

## 9. Principio Anfibio

| Modo | Membresía | Stake | Rewards |
|------|-----------|-------|---------|
| **Postmonetario** | ZNU interno, TQ = kWh | ZNU virtual (ledger) | ZNU crédito 2-3% |
| **Conectado** | ZNU + USDC bridge | ZNU real (on-chain) | ZNU + USDC (oráculo) |

---

## 10. Referencias

- `alrac-caas-revenue-streams.md` — Streams que alimentan membresías
- `alrac-governance.md` — 1a1v, CDS, veto, asambleas
- `alrac-tq-staking.md` — Staking mechanics (Capa 1)
- `alrac-znu-indexing.md` — ZNU canasta, expiración (Capa 3)
- `ZEITNUS_REGENERATIVE_MODEL.md` — Tres Horizontes mapping