# Spec: TQ ↔ CPP Bridge — Interface Capa 1↔2 ALRAC

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Complementario a `cpp-protocol.md`  
**Propósito:** Definir la transducción formal entre TQ (Capa 1: mutual-credit bounded) y CPP (Capa 2: commitment pooling interoperable)

---

## 1. PRINCIPIOS DE TRANSDUCCIÓN

### 1.1 Invariante Física Base

> **Ruddick + Feria Conuquera:** "1 TQ = 1 kWh"

Esta es la **única conversión dura** en el sistema. Todo lo demás deriva de esta invariante.

```
1 TQ ≡ 1 kWh (invariante física, no especulativa)
```

### 1.2 Separación de Responsabilidades (Ruddick)

| Capa | Responsabilidad | No hace |
|------|-----------------|---------|
| **TQ (1)** | Cinta métrica reciprocidad local, saldo community-wide | Gestión compromisos específicos, cruce fronteras |
| **CPP (2)** | Compromisos específicos emisor-basados, pools, intercambio | Contabilidad mutual-credit, demurrage, rotación |

### 1.3 Puente = Transducción Controlada

El bridge **no fusiona** las capas. Es una **membrana selectiva** que:
- Convierte compromisos TQ ↔ CPP bajo reglas explícitas
- Gestiona exposición (Ruddick: "manages exposure")
- Curación de fronteras (Ruddick: "curates what crosses boundaries")
- Mantiene invariante 1 TQ = 1 kWh en ambas direcciones

---

## 2. ARQUITECTURA DEL BRIDGE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TQ ↔ CPP BRIDGE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CAPA 1: TQ NETWORK                          CAPA 2: CPP POOLS             │
│  ┌─────────────────────────┐                 ┌─────────────────────────┐   │
│  │  Accounts: ±500 TQ     │                 │  Pools: commitments     │   │
│  │  Demurrage: 5%/mes     │                 │  ExchangeRules: rates   │   │
│  │  Rotation: 60 días     │                 │  Exposure: limits       │   │
│  │  Velocity: 30d         │                 │  Authority: governance  │   │
│  └───────────┬─────────────┘                 └───────────┬─────────────┘   │
│              │                                             │               │
│              ▼                                             ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    TRANSDUCTION ENGINE                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ tqToCpp      │  │ cppToTq      │  │ transduction │              │   │
│  │  │ (1:1 kWh)    │  │ (1:1 kWh)    │  │ Rules        │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ exposure     │  │ boundary     │  │ audit trail  │              │   │
│  │  │ mgmt         │  │ curation     │  │ (Nondominium)│              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ESPECIFICACIÓN TÉCNICA

### 3.1 Configuración Base (Hardcoded Invariante)

```typescript
// INVARIANTE: 1 TQ = 1 kWh = 1 unidad CPP base
const BASE_CONVERSION: ConversionFactor = {
  numerator: 1n,
  denominator: 1n,
};
```

### 3.2 TransductionRule — Reglas de Conversión Controlada

```typescript
interface TransductionRule {
  id: string;
  name: string;
  // Condición que dispara la transducción
  condition: 
    | 'commitment_expiry'      // Compromiso CPP expira → liquida en TQ
    | 'pool_threshold'         // Pool alcanza umbral → mueve a TQ
    | 'manual'                 // Curador/autoridad inicia
    | 'scheduled'              // Programa temporal (ej. fin de mes)
    | 'demurrage_trigger'      // Demurrage TQ libera → CPP pool
    | 'rotation_release';      // Rotación TQ libera → CPP pool
  
  fromLayer: 1 | 2;           // 1 = TQ, 2 = CPP
  toLayer: 1 | 2;
  
  // Factor de conversión (base 1:1, pero permite ajustes por riesgo/liquidez)
  conversionFactor: ConversionFactor;
  
  // Límites de seguridad
  maxAmountPerTx: bigint;
  maxAmountPerPeriod: bigint;
  periodDays: number;
  
  // Gobernanza
  requiresApproval: boolean;
  approverRole?: 'curator' | 'bank_curator' | 'dao' | 'consensus' | 'algorithm';
  requiredSignatures?: number;
  
  // Metadatos
  createdAt: Timestamp;
  createdBy: DID;
  active: boolean;
  description: string;
}
```

### 3.3 Reglas Por Defecto (Nodos Piloto)

#### Feria Conuquera (Economía local pura TQ↔CPP)

```typescript
const feriaTransductionRules: TransductionRule[] = [
  {
    id: 'feria_tq_to_cpp_trueque',
    name: 'TQ → CPP (Trueque local miembros)',
    condition: 'manual',
    fromLayer: 1,
    toLayer: 2,
    conversionFactor: { numerator: 1n, denominator: 1n },
    maxAmountPerTx: 100n,
    maxAmountPerPeriod: 500n,
    periodDays: 7,
    requiresApproval: false,
    description: 'Miembros convierten saldo TQ a compromisos CPP para trueque específico',
  },
  {
    id: 'feria_cpp_to_tq_fulfillment',
    name: 'CPP → TQ (Cumplimiento compromiso)',
    condition: 'commitment_expiry',
    fromLayer: 2,
    toLayer: 1,
    conversionFactor: { numerator: 1n, denominator: 1n },
    maxAmountPerTx: 500n,
    maxAmountPerPeriod: 2000n,
    periodDays: 30,
    requiresApproval: true,
    approverRole: 'curator',
    description: 'Al cumplirse compromiso (entrega bienes), libera TQ al emisor',
  },
];
```

#### +Colonia (Economía mixta TQ↔CPP↔Fiat)

```typescript
const coloniaTransductionRules: TransductionRule[] = [
  {
    id: 'colonya_tq_to_cpp_innovation',
    name: 'TQ → CPP (Inversión en innovación)',
    condition: 'pool_threshold',
    fromLayer: 1,
    toLayer: 2,
    conversionFactor: { numerator: 1n, denominator: 1n },
    maxAmountPerTx: 1000n,
    maxAmountPerPeriod: 10000n,
    periodDays: 30,
    requiresApproval: true,
    approverRole: 'curator',
    description: 'Exceso TQ hogares → pool innovación startups/univ',
  },
  {
    id: 'colonya_cpp_to_tq_energy',
    name: 'CPP → TQ (Energía excedente)',
    condition: 'commitment_expiry',
    fromLayer: 2,
    toLayer: 1,
    conversionFactor: { numerator: 1n, denominator: 1n },
    maxAmountPerTx: 5000n,
    maxAmountPerPeriod: 50000n,
    periodDays: 30,
    requiresApproval: false,
    description: 'Energía solar excedente comprometida → TQ hogares',
  },
  {
    id: 'colonya_cpp_to_fiat_znu',
    name: 'CPP → ZNU Credit (Capa 3)',
    condition: 'commitment_expiry',
    fromLayer: 2,
    toLayer: 3,  // Capa 3 Zeitnus
    conversionFactor: { numerator: 12n, denominator: 100n }, // 1 TQ = $0.12 USD
    maxAmountPerTx: 50000n,
    maxAmountPerPeriod: 500000n,
    periodDays: 90,
    requiresApproval: true,
    approverRole: 'bank_curator',
    description: 'Compromisos productivos cumplidos → crédito ZNU indexado canasta',
  },
  {
    id: 'colonya_fiat_to_tq_investment',
    name: 'USD/UYU → TQ (Inversión externa)',
    condition: 'manual',
    fromLayer: 3,
    toLayer: 1,
    conversionFactor: { numerator: 100n, denominator: 12n }, // $0.12 = 1 TQ
    maxAmountPerTx: 1000000n,
    maxAmountPerPeriod: 10000000n,
    periodDays: 365,
    requiresApproval: true,
    approverRole: 'bank_curator',
    description: 'Inversión fiduciaria → TQ para desarrollo infraestructura',
  },
];
```

---

## 4. EXPOSURE MANAGEMENT (Ruddick: "manages exposure")

### 4.1 Definición

Exposure = **riesgo neto** que un miembro/pool asume al mantener compromisos no cumplidos.

```typescript
interface ExposureSnapshot {
  memberDid: DID;
  poolId: PoolId;
  timestamp: Timestamp;
  // Exposición en capa CPP (compromisos activos)
  cppExposure: bigint;
  // Exposición proyectada en capa TQ (si todos compromisos se liquidan)
  projectedTqExposure: bigint;
  // Límites configurados
  cppLimit: bigint;
  tqLimit: bigint;  // ±500 TQ por cuenta
  // Alertas
  cppAlertLevel: 'green' | 'yellow' | 'red';
  tqAlertLevel: 'green' | 'yellow' | 'red';
}
```

### 4.2 Cálculo de Exposición Proyectada

```typescript
function calculateProjectedTqExposure(
  pool: CPPPool,
  memberDid: DID,
  bridge: CPPBridgeConfig,
  now: Timestamp
): bigint {
  const activeCommitments = pool.commitments.filter(
    c => c.issuer === memberDid && isCommitmentValid(c, now)
  );
  
  return activeCommitments.reduce((sum, c) => {
    const cppAmount = c.quantity;
    const tqAmount = cppUnitsToTq(cppAmount, bridge);
    return sum + tqAmount;
  }, 0n);
}
```

### 4.3 Reglas de Gestión de Exposición

| Nivel | CPP Exposure | TQ Exposure Proyectada | Acción |
|-------|--------------|------------------------|--------|
| **Green** | < 50% límite | < 50% ±500 | Normal |
| **Yellow** | 50-80% | 50-80% | Alerta, no bloquea |
| **Red** | > 80% | > 80% | Bloquea nuevos compromisos (si hardLimit) |
| **Critical** | > 100% | > 100% | Requiere acción curador inmediata |

---

## 5. BOUNDARY CURATION (Ruddick: "curates what crosses boundaries")

### 5.1 Definición

Boundary Curation = **gobernanza explícita** de qué compromisos pueden cruzar entre:
- Pools CPP internos
- Pool CPP ↔ TQ Network local
- Pool CPP ↔ Fiat Rail (Capa 3)
- Pool CPP ↔ Unyt Alliance (ReFi)
- Pool CPP ↔ Pool CPP externo (otro nodo ALRAC)

### 5.2 BoundaryRule Extendida para Bridge

```typescript
interface BridgeBoundaryRule extends BoundaryRule {
  // Específico para bridge TQ↔CPP
  allowedDirections: ('tq_to_cpp' | 'cpp_to_tq' | 'both')[];
  // Validación de invariante
  enforceInvariant: boolean;  // Siempre true: 1 TQ = 1 kWh
  // Líquidez requerida
  minLiquidityTq: bigint;     // TQ network debe tener liquidez
  minLiquidityCpp: bigint;    // Pool CPP debe tener compromisos válidos
  // Auditoría
  auditTrail: boolean;        // Registra en Nondominium EconomicEvent
}
```

### 5.3 Matriz de Curación por Nodo

| Origen → Destino | Feria Conuquera | +Colonia | Soulpreneurs | Unyt/ReFi | Fiat Local |
|------------------|-----------------|----------|--------------|-----------|------------|
| **Feria TQ** | N/A | ✅ Alimentos (curated) | ✅ Servicios (curated) | ❌ | ✅ Bolívares (manual) |
| **Feria CPP** | N/A | ✅ Alimentos (curated) | ✅ Talento (curated) | ❌ | ❌ |
| **Colonia TQ** | ✅ Alimentos (curated) | N/A | ✅ Talento (curated) | ❌ | ✅ USD/UYU (bank) |
| **Colonia CPP** | ✅ Innovación (curated) | N/A | ✅ Talento (curated) | ✅ Unyt (dao) | ✅ ZNU Credit (bank) |

---

## 6. AUDIT TRAIL (Integración Nondominium)

Toda transducción bridge genera rastro auditable en Nondominium:

```typescript
interface BridgeAuditEvent {
  id: string;
  type: 'tq_to_cpp' | 'cpp_to_tq' | 'cpp_to_fiat' | 'fiat_to_tq';
  transductionRuleId: string;
  from: { layer: 1 | 2 | 3; poolId?: PoolId; accountDid?: DID };
  to: { layer: 1 | 2 | 3; poolId?: PoolId; accountDid?: DID };
  amount: { tq: bigint; cpp: bigint; fiat?: bigint; unit: string };
  conversionFactor: ConversionFactor;
  approval: {
    required: boolean;
    approverDid?: DID;
    signatures: string[];
    timestamp: Timestamp;
  };
  // Nondominium integration
  economicEventHash?: ActionHash;      // EconomicEvent en zome_gouvernance
  contributionHash?: ActionHash;       // Contribution si aplica
  agreementHash?: ActionHash;          // Agreement si redistribución beneficios
  pprHashes?: ActionHash[];            // PPRs generados
  timestamp: Timestamp;
}
```

---

## 7. TESTS DE VALIDACIÓN (PVL)

### 7.1 Invariante Física

```typescript
describe('TQ↔CPP Bridge Invariants', () => {
  it('1 TQ = 1 kWh = 1 CPP base unit ALWAYS', () => {
    const bridge = DEFAULT_CPP_BRIDGE_CONFIG;
    expect(tqToCppUnits(100n, bridge)).toBe(100n);
    expect(cppUnitsToTq(100n, bridge)).toBe(100n);
  });

  it('Bridge never violates 1:1 kWh invariant', () => {
    // Todas las transductionRules deben tener conversionFactor 1:1 para TQ↔CPP
    feriaTransductionRules
      .filter(r => (r.fromLayer === 1 && r.toLayer === 2) || (r.fromLayer === 2 && r.toLayer === 1))
      .forEach(r => {
        expect(r.conversionFactor.numerator).toBe(r.conversionFactor.denominator);
      });
  });
});
```

### 7.2 Exposición y Límites

```typescript
describe('Exposure Management', () => {
  it('blocks commitment when TQ exposure would exceed ±500', () => {
    const pool = createTestPool({ exposureLimit: 5000n });
    const member = 'did:test:member';
    const bridge = DEFAULT_CPP_BRIDGE_CONFIG;
    
    // Simular compromiso que proyectaría 600 TQ (> 500 límite)
    const commitment = createCPPCommitment({
      issuer: member,
      quantity: 600n,  // 600 kWh → 600 TQ proyectado
      unit: 'kWh',
      // ...
    });
    
    const result = canAddCommitment(pool, member, 600n, Date.now());
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('500');
  });
});
```

### 7.3 Curación de Fronteras

```typescript
describe('Boundary Curation', () => {
  it('allows curated cross-border exchange Feria↔Colonia alimentos', () => {
    const rule = feriaBoundaryRules.find(r => r.targetId === 'colonya_alimentos');
    expect(rule).toBeDefined();
    expect(rule?.allowedCommitmentTypes).toContain('food');
    expect(rule?.requiresCuratorApproval).toBe(true);
  });

  it('blocks non-curated cross-border exchange', () => {
    const rule = feriaBoundaryRules.find(r => r.targetId === 'unauthorized_pool');
    expect(rule).toBeUndefined(); // No rule = blocked by default
  });
});
```

---

## 8. MÉTRICAS DE SALUD DEL BRIDGE

| Métrica | Healthy | Warning | Critical |
|---------|---------|---------|----------|
| **Invariant violations** | 0 | 0 | > 0 |
| **Transduction success rate** | > 99% | 95-99% | < 95% |
| **Avg approval time** | < 1 hora | 1-24 horas | > 24 horas |
| **Exposure alerts (red)** | 0 | 1-5 | > 5 |
| **Cross-border volume 30d** | > 0 | = 0 | N/A |
| **Audit trail completeness** | 100% | 95-99% | < 95% |

---

## 9. REFERENCIAS CRUZADAS

| Documento | Sección |
|-----------|---------|
| `cpp-protocol.md` | Spec principal CPP (Capa 2) |
| `src/core/lib/cpp.ts` | Implementación Typescript |
| `src/core/lib/tq.ts` | Implementación TQ Capa 1 |
| `src/core/lib/alrac.ts` | Tipos integrados 5 capas |
| `ASIMILACION_COMPLETA_NONDOMINIUM_TQ_CPP_HSCSG.md` | §6.2, §6.3 |

---

> **Nota:** Este spec define la **membrana selectiva** entre Capa 1 y Capa 2. La invariante 1 TQ = 1 kWh es inquebrantable. Toda transducción respeta la separación de responsabilidades articulada por Will Ruddick: TQ = cinta métrica local, CPP = interoperabilidad global.
>
> **La pala y el teclado están en tus manos. E=V.**