# Spec: Commitment Pooling Protocol (CPP) — Capa 2 ALRAC

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Para revisión y validación  
**Autores:** Isaac Ko (Isaacko0) — basado en definiciones canónicas Will Ruddick (@wor)  
**Fuentes primarias:**
- Will Ruddick: "CPP keeps obligation attached to particular commitments and particular issuers, then uses pools to make those commitments exchangeable"
- Will Ruddick: "Commitment Pooling Protocol is a coordination protocol abstracted in part from patterns of human social coordination, where autonomous agents can coordinate commitments, limits, exchange, authority, and shared memory without requiring a digital substrate"
- Sensorica/nondominium: NDO federation primitives (`NdoHardLink`, `Contribution`, `Agreement`)
- Feria Conuquera (Caracas): Implementación viva 10 años, 45 colectivos, 1 TQ = 1 kWh
- +Colonia (Uruguay): 515ha, US$500M, 97% renovables, demanda nativa Capa 2

---

## 1. CONTEXTO Y PROPÓSITO

### 1.1 Problema que Resuelve

La arquitectura ALRAC de 5 capas requiere una **Capa 2 de Interoperabilidad** que permita a nodos autónomos (𝕮) coordinar compromisos, límites, intercambio, autoridad y memoria compartida **sin requerir un sustrato digital único** ni absorción mutua.

> **Ruddick:** *"Add Commitment Pooling as the layer that makes specific productive commitments visible, curates what crosses boundaries, manages exposure, and connects TQ communities to other economic systems without requiring everyone to adopt TQ."*

### 1.2 Posicionamiento en Arquitectura ALRAC

| Capa | Nombre | Responsabilidad | CPP Role |
|------|--------|-----------------|----------|
| 0 | Epistémica | γ-CARMIS, PI, 𝕮, Triaxial | Meta-protocolo de coherencia |
| 0.5 | Normativa | 7 Principios, 5 Anti-reglas, CEL | Marcos de gobernanza pools |
| **1** | **Contable-Física** | **TQ = 1 kWh, ±500, mutual-credit bounded** | **Intra-nodo: cinta métrica reciprocidad local** |
| **2** | **Interoperabilidad** | **CPP (Commitment Pooling Protocol)** | **Inter-nodo: transducción compromisos entre sistemas** |
| 3 | Membrana Fiat | Zeitnus: Coop, Nómina, Tierra, Banco | Puente a rails fiat/ReFi |

**Distinción crítica TQ vs CPP (Ruddick):**

| Aspecto | TQ (Capa 1) | CPP (Capa 2) |
|---------|-------------|--------------|
| **Obligación** | Cuenta única community-wide | Adjunta a compromisos/emisores específicos |
| **Función** | Cinta métrica reciprocidad local | Interoperabilidad entre sistemas |
| **Alcance** | Intra-nodo | Inter-nodo / inter-sistema |
| **Tecnología** | Mínima (NFC offline, papel) | Agnóstica (EVM, Holochain, papel, etc.) |

---

## 2. ARQUITECTURA CPP

### 2.1 Principios de Diseño (Derivados de Ruddick + Nondominium)

1. **Offline-first / Substrate-agnostic**: No requiere sustrato digital — válido para NFC, papel, voz, QR, EVM, Holochain
2. **Commitment-centric**: La obligación vive en el compromiso específico, no en cuenta agregada
3. **Pool-based transduction**: Pools son funtores que transducen compromisos entre dominios sin absorción
4. **Curated boundaries**: "Curates what crosses boundaries, manages exposure" — gobernanza explícita de fronteras
5. **Issuer sovereignty**: Emisor específico retiene autoridad sobre sus compromisos
6. **Stigmergic attachment**: Surface of attachment (CapabilitySlot Nondominium) para capacidades imprevistas
7. **Federation-native**: Diseñado para integrarse con Nondominium `NdoHardLink`, `Contribution`, `Agreement`

### 2.2 Componentes Core

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CPP ARCHITECTURE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │   ISSUER     │───▶│  COMMITMENT  │───▶│     POOL     │───▶│ EXCHANGE │  │
│  │  (DID/agent) │    │  (quantity,  │    │  (members,   │    │  RULES   │  │
│  │              │    │   unit,      │    │   commitments,│    │ (rate,   │  │
│  │              │    │   expiry,    │    │   exchange   │    │  curated,│  │
│  │              │    │   conditions)│    │   rules,     │    │  exposure)│  │
│  └──────────────┘    └──────────────┘    │   authority) │    └──────────┘  │
│                                           └──────────────┘                  │
│                                                  │                          │
│                                                  ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  BOUNDARY    │◀───│  EXPOSURE    │◀───│  AUTHORITY   │                  │
│  │  CURATION    │    │  MANAGEMENT  │    │  (governance)│                  │
│  │ (what crosses│    │ (limits per  │    │              │                  │
│  │  boundaries) │    │  member/pool)│    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                              │
│  OFFLINE-FIRST: NFC │ Paper │ Voice │ QR  ──▶  ONLINE: EVM │ Holochain    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ESPECIFICACIÓN TÉCNICA (TypeScript)

### 3.1 Tipos Fundamentales

```typescript
// ============ COMMITMENT ============
interface CPPCommitment {
  id: string;
  issuer: DID;                              // Emisor específico (NO cuenta única TQ)
  commitment: string;                       // Descripción legible humano
  quantity: bigint;                         // En unidades base (kWh, horas, kg, etc.)
  unit: 'kWh' | 'hours' | 'kg' | 'custom';
  expiry: Timestamp;                        // Límite temporal
  conditions: string[];                     // Condiciones de cumplimiento
  poolId?: PoolId;                          // Pool al que pertenece (opcional)
  // Nondominium federation fields:
  ndo_identity_hash?: ActionHash;           // Link a NDO si referencia recurso
  fulfillment_hash?: ActionHash;            // EconomicEvent que cumple el compromiso
  // Offline-first (Ruddick: "without requiring a digital substrate")
  offlineProof?: OfflineProof;              // Para operación NFC/papel/voz
}

interface OfflineProof {
  type: 'nfc' | 'paper' | 'voice' | 'qr';
  payload: string;                          // Datos serializados del compromiso
  signature: string;                        // Firma del emisor
  timestamp: Timestamp;
  witnesses?: DID[];                        // Testigos para validación social
}

// ============ POOL ============
type PoolId = string & { readonly __brand: unique symbol };

interface CPPPool {
  id: PoolId;
  name: string;
  members: DID[];                           // Participantes del pool
  commitments: CPPCommitment[];             // Compromisos pooled
  exchangeRules: ExchangeRule[];            // Reglas de intercambio entre pools
  exposureLimit: bigint;                    // Límite exposición por miembro
  authority: AuthorityConfig;               // Gobernanza del pool
  // Nondominium integration:
  ndo_identity_hash?: ActionHash;           // Pool asociado a NDO (opcional)
  // Ruddick: "curates what crosses boundaries, manages exposure"
  boundaryCuration: BoundaryRule[];         // Qué compromisos cruzan a otros pools/sistemas
  exposureManagement: ExposureLimit[];      // Límites por miembro/pool
}

// ============ EXCHANGE RULE ============
interface ExchangeRule {
  fromPool: PoolId;
  toPool: PoolId;
  rate: ConversionFactor;                   // Factor conversión (ej. 1 TQ = X kWh = Y USD)
  curated: boolean;                         // Curado por pool (gestiona qué cruza fronteras)
  createdAt: Timestamp;
  createdBy: DID;
  active: boolean;
}

interface ConversionFactor {
  numerator: bigint;
  denominator: bigint;
}

// ============ BOUNDARY CURATION (Ruddick: "curates what crosses boundaries") ============
interface BoundaryRule {
  id: string;
  sourcePool: PoolId;
  targetSystem: 'cpp_pool' | 'tq_network' | 'fiat_rail' | 'unyt_alliance' | 'custom';
  targetId: string;
  allowedCommitmentTypes: string[];
  requiresCuratorApproval: boolean;
  maxVolumePerPeriod: bigint;
  periodDays: number;
}

// ============ EXPOSURE MANAGEMENT (Ruddick: "manages exposure") ============
interface ExposureLimit {
  memberDid: DID;
  poolId: PoolId;
  maxExposure: bigint;
  currentExposure: bigint;
  alertThreshold: number;                   // % del límite para alerta (ej. 80%)
  hardLimit: boolean;                       // Si true, bloquea al alcanzar límite
}

// ============ AUTHORITY / GOVERNANCE ============
interface AuthorityConfig {
  type: 'single_curator' | 'multi_sig' | 'dao' | 'consensus' | 'algorithmic';
  curators: DID[];
  threshold?: number;
  daoAddress?: string;
  algorithmConfig?: Record<string, unknown>;
}
```

### 3.2 Puente TQ (Capa 1) ↔ CPP (Capa 2)

```typescript
interface CPPBridgeConfig {
  // Conversión base: 1 TQ = 1 kWh (definición Ruddick + Feria Conuquera)
  tqToCpp: ConversionFactor;                // 1 TQ → X unidades CPP (base kWh)
  cppToTq: ConversionFactor;                // X unidades CPP → 1 TQ
  // Gestión automática
  autoPooling: boolean;                     // Auto-move commitments to pools
  exposureManagement: boolean;              // Gestión límites exposición
  // Reglas de transducción
  transductionRules: TransductionRule[];
}

interface TransductionRule {
  id: string;
  name: string;
  condition: 'commitment_expiry' | 'pool_threshold' | 'manual' | 'scheduled';
  fromLayer: 1 | 2;                         // 1 = TQ, 2 = CPP
  toLayer: 1 | 2;
  conversionFactor: ConversionFactor;
  maxAmountPerTx: bigint;
  requiresApproval: boolean;
  approverRole?: string;
}
```

---

## 4. FUNCIONES PURAS (Lógica de Negocio)

### 4.1 Validación de Compromisos

```typescript
/** Crea un compromiso CPP válido */
function createCPPCommitment(params: {
  issuer: DID;
  commitment: string;
  quantity: bigint;
  unit: CPPCommitment['unit'];
  expiry: Timestamp;
  conditions: string[];
  poolId?: PoolId;
  ndo_identity_hash?: ActionHash;
}): CPPCommitment

/** Valida que un compromiso no haya expirado */
function isCommitmentValid(commitment: CPPCommitment, now: Timestamp): boolean

/** Calcula exposición actual de un miembro en un pool */
function calculateMemberExposure(
  pool: CPPPool,
  memberDid: DID,
  now: Timestamp
): bigint

/** Verifica si un miembro puede agregar compromiso sin exceder límite */
function canAddCommitment(
  pool: CPPPool,
  memberDid: DID,
  newCommitmentQuantity: bigint,
  now: Timestamp
): { allowed: boolean; reason?: string }
```

### 4.2 Intercambio entre Pools

```typescript
/** Aplica regla de intercambio entre pools */
function applyExchangeRule(
  rule: ExchangeRule,
  amount: bigint,
  fromPool: CPPPool,
  toPool: CPPPool
): { success: boolean; convertedAmount: bigint; reason?: string }
```

### 4.3 Operación Offline-First

```typescript
/** Genera prueba offline para compromiso (NFC/papel/voz) */
function generateOfflineProof(
  commitment: CPPCommitment,
  type: OfflineProof['type'],
  issuerPrivateKey: string
): OfflineProof

/** Verifica prueba offline */
function verifyOfflineProof(
  proof: OfflineProof,
  issuerPublicKey: string
): { valid: boolean; commitment?: CPPCommitment; reason?: string }
```

---

## 5. INTEGRACIÓN NONDOMINIUM

### 5.1 Mapeo PropertyRegime → Configuración CPP

| PropertyRegime | AuthorityConfig.type | BoundaryCuration por defecto |
|----------------|---------------------|------------------------------|
| **Nondominium** | `consensus` | Solo `contribution`, `use`, `maintenance` cruzan; requiere aprobación curador |
| **Commons** | `dao` | `access`, `contribution` cruzan libremente a pools partner |
| **Pool** | `multi_sig` (threshold=2) | `custody_transfer` a TQ network; requiere aprobación |
| **CommonPool** | `algorithmic` | `extraction` gestionada por algoritmo de cuotas |
| **Collective** | `multi_sig` | `ownership_transfer` solo entre miembros |
| **Public** | `dao` | `open_access` por defecto; curación transparente |
| **Private** | `single_curator` | Sin cruce por defecto; configurado por owner |

### 5.2 NdoHardLink → BoundaryRule

```typescript
function ndoHardLinkToPoolRelation(link: {
  link_type: 'Component' | 'DerivedFrom' | 'Supersedes';
  from_ndo: ActionHash;
  to_ndo: ActionHash;
}): BoundaryRule
```

| NdoLinkType | BoundaryRule.allowedCommitmentTypes | requiresCuratorApproval |
|-------------|-------------------------------------|------------------------|
| `Component` | `['component_dependency']` | `false` |
| `DerivedFrom` | `['design_evolution']` | `false` |
| `Supersedes` | `['version_supersession']` | `true` |

### 5.3 CapabilitySlot para CPP

```typescript
interface CapabilitySlot {
  slotType: 'FabricationQueue' | 'GovernanceDAO' | 'UnytAgreement' | 'CustomApp';
  target: string;              // CPP Pool ID o NDO identity hash
  author: DID;
  attachedAt: Timestamp;
  trusted: boolean;            // Governance layer filtering
}
```

---

## 6. CASOS DE USO VALIDADOS

### 6.1 Feria Conuquera → +Colonia (Cross-border CPP)

**Escenario:** Productor de Feria Conuquera (Caracas) quiere exportar café a +Colonia (Uruguay)

```
Feria Conuquera (Capa 1: TQ kWh)          +Colonia (Capa 1: TQ kWh + Capa 3: USD/UYU)
       │                                          │
       ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│ CPP Pool: Alimentos│                    │ CPP Pool: Alimentos│
│ - 45 colectivos  │                    │ - Startups agro  │
│ - Compromisos:   │◀── ExchangeRule ──▶│ - Compromisos:   │
│   café 500kg/mes │   rate: 1:1 kWh    │   café 200kg/mes │
│ - BoundaryRule:  │   curated: true    │ - BoundaryRule:  │
│   allows export  │   exposure mgmt    │   allows import  │
└──────────────────┘                    └──────────────────┘
       │                                          │
       ▼                                          ▼
TQ Network (local)                      TQ Network + ZNU Credit + Fiat Bridge
```

**Flujo:**
1. Productor Feria crea `CPPCommitment`: "500kg café orgánico, expira 30 días, unidad kg"
2. Commitment entra a `Pool: Alimentos Feria` → `exposureManagement` verifica límite
3. `BoundaryRule` permite cruce a `+Colonia Pool: Alimentos` (curated: true)
4. `ExchangeRule` aplica rate 1:1 kWh (misma base energética)
5. +Colonia recibe commitment en su pool → puede pagar en TQ local o ZNU credit
6. Al cumplirse (entrega café), `fulfillment_hash` registra `EconomicEvent` en Nondominium
7. `Contribution` + `Agreement` en Nondominium redistribuyen beneficios (ZNU vesting)

### 6.2 Soulpreneurs (70k LATAM) → Feria Conuquera (Talento → Mercado)

**Escenario:** Emprendedor Soulpreneurs ofrece servicios de diseño de empaques a productores Feria

```
Soulpreneurs Hub MX/CO/PE/CL/AR          Feria Conuquera (Caracas)
       │                                          │
       ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│ CPP Pool: Talento│                    │ CPP Pool: Servicios│
│ - 70k contactos  │◀── ExchangeRule ──▶│ - 45 colectivos  │
│ - Compromisos:   │   rate: hours:kWh  │ - Compromisos:   │
│   diseño 20h/sem │   (valoración)     │   empaques 100/u │
└──────────────────┘                    └──────────────────┘
```

### 6.3 Nondominium NDO → CPP Pool (Resource-backed Commitments)

**Escenario:** NDO tipo `Physical` (herramienta CNC) en Nondominium genera commitments de uso en CPP pool

```
Nondominium NDO (CNC Machine)            CPP Pool: Herramientas Compartidas
       │                                          │
       ├─ NdoHardLink: Component ────────────────▶│
       ├─ Contribution (mantenimiento) ──────────▶│
       └─ Agreement (benefit redistribution) ───▶│
```

---

## 7. CONFIGURACIONES POR DEFECTO (Nodos Piloto)

### 7.1 Feria Conuquera (Caracas)

```typescript
const feriaCppConfig: CPPBridgeConfig = {
  tqToCpp: { numerator: 1n, denominator: 1n },    // 1 TQ = 1 kWh = 1 CPP unit
  cppToTq: { numerator: 1n, denominator: 1n },
  autoPooling: true,
  exposureManagement: true,
  transductionRules: [
    {
      id: 'feria_tq_to_cpp',
      name: 'TQ → CPP (trueque local)',
      condition: 'manual',
      fromLayer: 1,
      toLayer: 2,
      conversionFactor: { numerator: 1n, denominator: 1n },
      maxAmountPerTx: 100n,
      requiresApproval: false,
    },
  ],
};

const feriaPools: CPPPool[] = [
  {
    id: 'pool_alimentos',
    name: 'Alimentos Agroecológicos',
    members: [], // 45 colectivos DIDs
    commitments: [],
    exchangeRules: [],
    exposureLimit: 5000n,
    authority: { type: 'consensus', curators: [], threshold: 0.66 },
    boundaryCuration: [
      { id: 'export_alimentos', sourcePool: 'pool_alimentos', targetSystem: 'cpp_pool', targetId: 'colonya_alimentos', allowedCommitmentTypes: ['food', 'seeds', 'bioinputs'], requiresCuratorApproval: true, maxVolumePerPeriod: 10000n, periodDays: 30 },
    ],
    exposureManagement: [],
  },
  {
    id: 'pool_trueque_credito',
    name: 'Trueque y Crédito Mutuo Miembros',
    members: [], // Miembros registrados
    commitments: [],
    exchangeRules: [],
    exposureLimit: 2000n,
    authority: { type: 'consensus', curators: [], threshold: 0.8 },
    boundaryCuration: [],
    exposureManagement: [],
  },
];
```

### 7.2 +Colonia (Uruguay)

```typescript
const coloniaCppConfig: CPPBridgeConfig = {
  tqToCpp: { numerator: 1n, denominator: 1n },
  cppToTq: { numerator: 1n, denominator: 1n },
  autoPooling: true,
  exposureManagement: true,
  transductionRules: [
    {
      id: 'colonya_tq_to_cpp',
      name: 'TQ → CPP (innovación)',
      condition: 'pool_threshold',
      fromLayer: 1,
      toLayer: 2,
      conversionFactor: { numerator: 1n, denominator: 1n },
      maxAmountPerTx: 1000n,
      requiresApproval: true,
      approverRole: 'curator',
    },
    {
      id: 'colonya_cpp_to_fiat',
      name: 'CPP → USD/UYU (ZNU Credit)',
      condition: 'commitment_expiry',
      fromLayer: 2,
      toLayer: 3,  // Capa 3 Zeitnus
      conversionFactor: { numerator: 12n, denominator: 100n }, // 1 TQ = $0.12
      maxAmountPerTx: 50000n,
      requiresApproval: true,
      approverRole: 'bank_curator',
    },
  ],
};

const coloniaPools: CPPPool[] = [
  {
    id: 'pool_innovacion',
    name: 'Ecosistema Innovación (Startups + Univ + Inversores)',
    members: [], // 20 startups + 5 univ + 3 inversores
    commitments: [],
    exchangeRules: [],
    exposureLimit: 100000n,
    authority: { type: 'dao', curators: [], daoAddress: 'colonya_dao.eth' },
    boundaryCuration: [
      { id: 'innovacion_to_feria', sourcePool: 'pool_innovacion', targetSystem: 'cpp_pool', targetId: 'feria_servicios', allowedCommitmentTypes: ['tech_transfer', 'capacity_building'], requiresCuratorApproval: true, maxVolumePerPeriod: 50000n, periodDays: 90 },
    ],
    exposureManagement: [],
  },
  {
    id: 'pool_energia',
    name: 'Energía Renovable (97% matrix)',
    members: [], // Hogares + empresas
    commitments: [],
    exchangeRules: [],
    exposureLimit: 50000n,
    authority: { type: 'algorithmic', curators: [], algorithmConfig: { pricing: 'marginal_cost', curtailment: 'proportional' } },
    boundaryCuration: [
      { id: 'energia_export', sourcePool: 'pool_energia', targetSystem: 'fiat_rail', targetId: 'uy_grid', allowedCommitmentTypes: ['excess_solar', 'grid_services'], requiresCuratorApproval: false, maxVolumePerPeriod: 100000n, periodDays: 30 },
    ],
    exposureManagement: [],
  },
  {
    id: 'pool_cultura',
    name: 'Cultura y Entretenimiento (Puente BsAs-MVD)',
    members: [], // Artistas, venues, gastronomía
    commitments: [],
    exchangeRules: [],
    exposureLimit: 10000n,
    authority: { type: 'consensus', curators: [], threshold: 0.75 },
    boundaryCuration: [
      { id: 'cultura_feria', sourcePool: 'pool_cultura', targetSystem: 'cpp_pool', targetId: 'feria_cultura', allowedCommitmentTypes: ['cultural_exchange', 'artist_residency'], requiresCuratorApproval: true, maxVolumePerPeriod: 5000n, periodDays: 60 },
    ],
    exposureManagement: [],
  },
  {
    id: 'pool_alimentos',
    name: 'Alimentos y Agroecología',
    members: [], // Productores locales + import Feria
    commitments: [],
    exchangeRules: [],
    exposureLimit: 20000n,
    authority: { type: 'multi_sig', curators: [], threshold: 2 },
    boundaryCuration: [
      { id: 'alimentos_import_feria', sourcePool: 'pool_alimentos', targetSystem: 'cpp_pool', targetId: 'feria_alimentos', allowedCommitmentTypes: ['coffee', 'cacao', 'superfoods'], requiresCuratorApproval: true, maxVolumePerPeriod: 10000n, periodDays: 30 },
    ],
    exposureManagement: [],
  },
];
```

---

## 8. CRITERIOS DE VALIDACIÓN (PVL - OpenSpec)

### 8.1 Tests Unitarios Requeridos

```typescript
// cpp.test.ts
describe('CPP Protocol', () => {
  describe('Commitment', () => {
    it('creates valid commitment with all required fields', () => {});
    it('rejects expired commitment', () => {});
    it('generates valid offline proof for NFC', () => {});
    it('verifies offline proof correctly', () => {});
  });

  describe('Pool', () => {
    it('calculates member exposure correctly', () => {});
    it('enforces exposure limits (hard/soft)', () => {});
    it('applies exchange rules with correct conversion', () => {});
    it('curates boundary crossing per BoundaryRule', () => {});
  });

  describe('Bridge TQ↔CPP', () => {
    it('converts TQ to CPP units at 1:1 kWh base', () => {});
    it('applies transduction rules on commitment expiry', () => {});
    it('manages exposure across layers', () => {});
  });

  describe('Nondominium Integration', () => {
    it('maps PropertyRegime to default AuthorityConfig', () => {});
    it('converts NdoHardLink to BoundaryRule', () => {});
    it('enforces Nondominium capture resistance in CPP', () => {});
  });
});
```

### 8.2 Tests de Integración (Nodos Piloto)

```typescript
// integration.test.ts
describe('CPP Pilot Nodes', () => {
  it('Feria Conuquera: 45 colectivos TQ + 1 CPP pool trueque operational', () => {});
  it('+Colonia: 4 CPP pools (innovación, energía, cultura, alimentos) registered', () => {});
  it('Cross-border: Feria alimentos ↔ +Colonia alimentos exchange operational', () => {});
  it('GNAP: 3 agents (feria, colonia, alrac-core) heartbeat active', () => {});
  it('Nondominium: CapabilitySlot CPP pools attached to NDO identity', () => {});
});
```

### 8.3 Métricas de Éxito (90 días)

| Métrica | Target | Validación |
|---------|--------|------------|
| `cpp.ts` + `tq.ts` + `alrac.ts` compilando | `tsc --noEmit` = 0 errores | CI |
| Tests unitarios passing | 100% coverage core functions | `bun test` |
| Feria Conuquera node operational | 45 colectivos TQ accounts + 1 CPP pool | Métricas en vivo |
| +Colonia node bootstrapping | 4 CPP pools registrados + GNAP agent | Registro GNAP |
| Cross-border exchange | 1 exchangeRule Feria↔Colonia activa | Transacción test |
| OpenSpec compliance | `openspec/specs/cpp-protocol.md` PVL compliant | `spec-validator` |

---

## 9. ROADMAP POST-MVP

### 9.1 Fase 1: Core CPP + TQ Bridge (Semanas 1-4) ✅ EN CURSO
- [x] Spec OpenSpec `cpp-protocol.md`
- [x] Types `cpp.ts`, `tq.ts`, `alrac.ts`
- [ ] Tests unitarios 100%
- [ ] Nodos piloto Feria/+Colonia registrados en GNAP

### 9.2 Fase 2: Nondominium Federation Profunda (Semanas 5-8)
- [ ] `CapabilitySlot` implementation en Nondominium `zome_resource`
- [ ] `NDOToProcess` link activation (Layer 2)
- [ ] `Contribution` + `Agreement` wiring a CPP pools
- [ ] `FlowstaIdentity` CapabilitySlot para reputation portability

### 9.3 Fase 3: Unyt/ReFi Integration (Semanas 9-12)
- [ ] `UnytAgreement` CapabilitySlot → `EconomicAgreement` GovernanceRule
- [ ] RAVE validation as state transition precondition
- [ ] PPR↔RAVE provenance chain
- [ ] Reputation-derived credit limits (ZNU credit)

### 9.4 Fase 4: Federación Cono Sur Completa (Mes 4-12)
- [ ] 10+ nodos TQ federados via CPP/GNAP
- [ ] Soulpreneurs 70k pipeline → CPP pools talento
- [ ] ALRAC = Vehículo NEXO comercial (Paso 0 con Yoka)
- [ ] ZNU velocity > 0 autosustentable

---

## 10. REFERENCIAS Y CRUCE CON DOCUMENTOS

| Documento | Sección | Relación |
|-----------|---------|----------|
| `ASIMILACION_COMPLETA_NONDOMINIUM_TQ_CPP_HSCSG.md` | §6, §7 | Análisis completo + mapeo Nondominium↔ALRAC |
| `WillRuddick_TQ_CPP_Assimilation.md` | §1, §3, §5 | Definiciones canónicas Ruddick + validaciones |
| `MasColonia_HSCSG_Assimilation.md` | §3, §6 | +Colonia como nodo piloto Capa 1-3 |
| `openspec/specs/tq-cpp-bridge.md` | — | Spec interface Capa 1↔2 (complementario) |
| `openspec/specs/colonya-integration.md` | — | Integración +Colonia completa |
| `openspec/specs/feria-conuquera-pilot.md` | — | Nodo piloto Feria documentado |
| `src/core/lib/cpp.ts` | — | Implementación TypeScript (este spec) |
| `src/core/lib/tq.ts` | — | Implementación TQ Capa 1 |
| `src/core/lib/alrac.ts` | — | Tipos integrados 5 capas |

---

## 11. CITAS ANCLA

> **"TQ turns obligation into a single community-wide account balance. CPP keeps obligation attached to particular commitments and particular issuers, then uses pools to make those commitments exchangeable."** — Will Ruddick

> **"Commitment Pooling Protocol is a coordination protocol abstracted in part from patterns of human social coordination, where autonomous agents can coordinate commitments, limits, exchange, authority, and shared memory without requiring a digital substrate."** — Will Ruddick

> **"If it is working for them i would keep TQ as a local mutual-credit clearing system. Add Commitment Pooling as the layer that makes specific productive commitments visible, curates what crosses boundaries, manages exposure, and connects TQ communities to other economic systems without requiring everyone to adopt TQ."** — Will Ruddick

> **"Live → notice → articulate → build → live with it → notice again. The living relationships remain the reference implementation."** — Will Ruddick

> **"1 TQ = 1 kWh"** — Feria Conuquera (implementación viva 10 años, 45 colectivos)

> **Nondominium: "Uncapturable resource flows" = NDO + ValueFlows + Holochain** — Sensorica

---

> **Nota de spec:** Este documento sigue OpenSpec PVL (Provenance, Verification, Logic). La implementación TypeScript en `src/core/lib/cpp.ts` es la referencia ejecutable. Los nodos piloto Feria Conuquera y +Colonia son las implementaciones de referencia vivas (Ruddick: "living relationships remain the reference implementation").
>
> **La pala y el teclado están en tus manos. E=V.**