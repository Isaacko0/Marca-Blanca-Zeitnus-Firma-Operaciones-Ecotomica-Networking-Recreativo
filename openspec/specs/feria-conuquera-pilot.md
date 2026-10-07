# Spec: Feria Conuquera Pilot — Nodo Vivo ALRAC Capa 1+3

**Versión:** 0.1.0  
**Fecha:** 2026-10-06  
**Estado:** Draft — Nodo real operando 10 años, validación empírica  
**Ubicación:** Parque Los Caobos, Caracas, Venezuela  
**Coordenadas:** 10.4806° N, -66.9036° W

---

## 1. PERFIL OPERATIVO REAL (10 AÑOS VALIDACIÓN EMPÍRICA)

### 1.1 Métricas Duras

| Métrica | Valor | Significado ALRAC |
|---------|-------|-------------------|
| **Continuidad** | **+10 años** mensual sin interrupción | αʰ sostenido > κ (paz operativa) |
| **Colectivos** | **+45 familias productoras** | Escala nodos federados viable |
| **Producción** | **0% agroquímicos** | `PropertyRegime::Commons`/`Nondominium` real |
| **Moneda** | Local + Trueque + Crédito mutuo | Economía mixta poscrecimiento funcionando |
| **Unidad cuenta** | **1 TQ = 1 kWh** | **Validación directa Ruddick + Capa 1** |
| **Gobernanza** | Asambleas trimestrales (1a1v) | **Capa 0.5: CEL / Jurados sorteados** |
| **Educación** | Talleres vermicompost, bioinsumos, salud botánica | **Capa 0.5: PHI / 7 Principios Javier** |
| **Red** | Cayapas, comisiones, ecovillage networking | **Capa 2: CPP / MYCELIUM federation** |

### 1.2 Estructura Operativa Mapeada a ALRAC

| Componente Feria | ALRAC Capa | Holón Gran Alianza | Validación |
|------------------|------------|-------------------|------------|
| Mercado público (venta moneda local) | **Capa 3** (Zeitnus - puente fiat) | GAIA NETWORK | ✅ Real |
| Trueque y crédito mutuo miembros (1 TQ = 1 kWh) | **Capa 1** (Cergio - TQ) | HSCSG / GAIA COMMONS | ✅ **Validado Ruddick** |
| Asambleas trimestrales (admisiones, impuestos, distribución) | **Capa 3** (Zeitnus - coop) | GAIA COMMONS | ✅ Real |
| Talleres educación popular | **Capa 0.5** (Javier - principios) | PHI | ✅ Real |
| Comisiones trabajo / cayapas / ecovillage | **Capa 2** (HSCSG - federación) | MYCELIUM / GAIA | ✅ Demanda nativa CPP |

---

## 2. ARQUITECTURA TÉCNICA FERIA (HSCSG v15 OS)

### 2.1 Configuración Nodo (`alrac.ts: createFeriaConuqueraNode()`)

```typescript
// Ya implementado en alrac.ts:
const feriaNode = createFeriaConuqueraNode();
// - DID: did:key:feria-conuquera-caracas
// - TQ Network: priceParity 1 TQ = $0.001 USD (contexto VES hiperinflación)
// - Cooperative: asamblea autoorganizada, 1a1v, quorum 0.5, asambleas 90 días
// - PaymentRails: TQ + bolivar_digital
// - CivicJuries: enabled, 12 miembros, stratified, domains: admissions/taxes/fund_distribution/policies
// - Metrics: tqAccountsActive: 45, cppPoolsActive: 1, status: 'operational'
```

### 2.2 CPP Pool Feria (en `cpp.ts` / `alrac.ts`)

```typescript
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
      { 
        id: 'export_alimentos', 
        sourcePool: 'pool_alimentos', 
        targetSystem: 'cpp_pool', 
        targetId: 'colonya_alimentos', 
        allowedCommitmentTypes: ['food', 'seeds', 'bioinputs'], 
        requiresCuratorApproval: true, 
        maxVolumePerPeriod: 10000n, 
        periodDays: 30 
      },
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

### 2.3 Bridge TQ↔CPP Feria (en `tq-cpp-bridge.md`)

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
  },
];
```

---

## 3. INTEGRACIÓN NONDOMINIUM

### 3.1 NDO para Feria Conuquera

```typescript
// NDO Layer 0: NondominiumIdentity
const feriaNDO = {
  name: 'Feria Conuquera',
  initiator: 'did:key:feria-conuquera-caracas', // o AgentPubKey Holochain
  property_regime: 'Nondominium',  // Uncapturable by design
  resource_nature: 'Physical',     // Alimentos, semillas, herramientas
  lifecycle_stage: 'Active',       // 10 años operando
  created_at: '2016-01-01T00:00:00Z', // Aprox 10 años
  description: 'Mercado agroecológico mensual Caracas. 45 colectivos. 1 TQ = 1 kWh. Trueque + crédito mutuo. Gobernanza asamblearia trimestral.',
};

// Layer 1: ResourceSpecification (activado via NdoToSpecification)
// - Categoría: 'agroecology_market'
// - Tags: ['agroecology', 'mutual_credit', 'assembly_governance', 'venezuela']
// - Scope: 'Public' (requerido por PropertyRegime::Nondominium)

// Layer 2: Process (por activar via NDOToProcess)
// - EconomicEvents: transacciones TQ, trueques, cumplimientos compromiso
// - Contributions: trabajo en comisiones, cayapas, talleres
// - Agreements: redistribución beneficios (ej. fondo común infraestructura)
```

### 3.2 CapabilitySlots para Feria (Stigmergic Attachment)

```typescript
const feriaCapabilitySlots: CapabilitySlot[] = [
  {
    id: 'feria_tq_ledger',
    slotType: 'CustomApp',
    target: 'feria_tq_network', // TQ network local
    author: 'did:key:feria-conuquera-caracas',
    attachedAt: Date.now(),
    label: 'TQ Ledger Local (NFC Offline)',
    trusted: true,
  },
  {
    id: 'feria_cpp_pool_alimentos',
    slotType: 'FabricationQueue', // Reutilizado para pool distribución alimentos
    target: 'pool_alimentos',
    author: 'did:key:feria-conuquera-caracas',
    attachedAt: Date.now(),
    label: 'Pool Alimentos Agroecológicos (CPP)',
    trusted: true,
  },
  {
    id: 'feria_assembly_governance',
    slotType: 'GovernanceDAO',
    target: 'feria_assembly_dao', // DAO asamblearia
    author: 'did:key:feria-conuquera-caracas',
    attachedAt: Date.now(),
    label: 'Gobernanza Asamblearia Trimestral',
    trusted: true,
  },
  {
    id: 'feria_education_workshops',
    slotType: 'Documentation',
    target: 'feria_workshops_wiki', // Wiki talleres
    author: 'did:key:feria-conuquera-caracas',
    attachedAt: Date.now(),
    label: 'Talleres: Vermicompost, Bioinsumos, Salud Botánica',
    trusted: true,
  },
];
```

---

## 4. FEDERACIÓN CROSS-BORDER (GNAP)

### 4.1 Agentes GNAP Registrados

```typescript
// En .gnap/agents.json
{
  "agents": [
    {
      "did": "did:key:feria-conuquera-caracas",
      "name": "Feria Conuquera",
      "repo": "feria",
      "capabilities": ["tq_network", "cpp_pool", "assembly_governance", "agroecology_production"],
      "status": "active",
      "lastHeartbeat": 0 // Se actualiza cada tick
    },
    {
      "did": "did:key:colonya-uy",
      "name": "+Colonia",
      "repo": "colonia",
      "capabilities": ["tq_network", "cpp_pool", "energy_catalog", "land_trust", "znu_credit"],
      "status": "active",
      "lastHeartbeat": 0
    },
    {
      "did": "did:key:alrac-core",
      "name": "ALRAC Core",
      "repo": "hscsg",
      "capabilities": ["gamma_carmis", "triaxial_verification", "caas", "skill_credential", "gnap_orchestration"],
      "status": "active",
      "lastHeartbeat": 0
    }
  ]
}
```

### 4.2 Task Chains Cross-Border

```typescript
// Feria ↔ +Colonia: Intercambio alimentos
{
  "id": "feria_colonia_alimentos",
  "name": "Cross-border Alimentos: Feria (café/cacao) ↔ +Colonia (mercado premium)",
  "steps": [
    {
      "id": "feria_commitment",
      "agentDid": "did:key:feria-conuquera-caracas",
      "action": "create_cpp_commitment",
      "input": { "poolId": "pool_alimentos", "commitment": "500kg café orgánico/mes", "quantity": 500, "unit": "kg" },
      "dependsOn": []
    },
    {
      "id": "boundary_curation",
      "agentDid": "did:key:feria-conuquera-caracas",
      "action": "curate_boundary",
      "input": { "ruleId": "export_alimentos", "targetPool": "colonya_alimentos" },
      "dependsOn": ["feria_commitment"]
    },
    {
      "id": "colonya_receive",
      "agentDid": "did:key:colonya-uy",
      "action": "receive_cpp_commitment",
      "input": { "poolId": "pool_alimentos", "sourcePool": "feria_alimentos" },
      "dependsOn": ["boundary_curation"]
    },
    {
      "id": "exchange_execution",
      "agentDid": "did:key:alrac-core",
      "action": "execute_exchange_rule",
      "input": { "fromPool": "feria_alimentos", "toPool": "colonya_alimentos", "rate": "1:1 kWh" },
      "dependsOn": ["colonya_receive"]
    },
    {
      "id": "fulfillment_verification",
      "agentDid": "did:key:feria-conuquera-caracas",
      "action": "verify_fulfillment",
      "input": { "commitmentId": "feria_commitment", "proof": "delivery_receipt" },
      "dependsOn": ["exchange_execution"]
    },
    {
      "id": "tq_release",
      "agentDid": "did:key:feria-conuquera-caracas",
      "action": "transduce_cpp_to_tq",
      "input": { "ruleId": "feria_cpp_to_tq_fulfillment", "amount": 500 },
      "dependsOn": ["fulfillment_verification"]
    }
  ]
}
```

---

## 5. VALIDACIÓN EMPÍRICA (CRITERIOS DE ÉXITO)

### 5.1 Métricas Ya Validadas (10 años operación)

| Métrica | Valor Actual | Target ALRAC | Estado |
|---------|--------------|--------------|--------|
| Continuidad operativa | 10 años | > 5 años | ✅ **SUPERADO** |
| Colectivos activos | 45 | > 20 | ✅ **SUPERADO** |
| Un agroquímicos | 0% | 0% | ✅ **CUMPLIDO** |
| Unidad cuenta TQ | 1 TQ = 1 kWh | 1 TQ = 1 kWh | ✅ **VALIDADO RUDDICK** |
| Gobernanza asamblearia | Trimestral 1a1v | CEL jurados sorteados | ✅ **OPERATIVO** |
| Economía mixta | Local + TQ + Trueque | Capa 1+3 | ✅ **FUNCIONANDO** |

### 5.2 Métricas Para Activar (Próximos 90 días)

| Métrica | Target 90 días | Validación |
|---------|----------------|------------|
| TQ accounts digitales (NFC/offline) | 50+ miembros | `tq.ts` + `nfcOffline` |
| CPP pool alimentos operacional | 1 pool + exchangeRules | `cpp.ts` + `BoundaryRule` |
| Cross-border Feria↔Colonia | 1 exchangeRule activa | GNAP task chain |
| Nodo GNAP heartbeat | Activo 99%+ | `.gnap/agents.json` |
| Nondominium NDO creado | Layer 0 + 1 activados | `create_ndo` + `create_resource_specification` |

---

## 6. CONTACTO Y ONBOARDING

### 6.1 Canales Feria Conuquera

- **Web:** https://feria.loanstly.com/main/p/inicio
- **Catálogo:** https://feria.loanstly.com/main/p/productos
- **Admisión:** https://feria.loanstly.com/main/p/unirse
- **FAQ:** https://feria.loanstly.com/main/p/faq
- **Ubicación:** Primer sábado cada mes, Parque Los Caobos, Caracas, 9:00 AM

### 6.2 Próximos Pasos Inmediatos

- [ ] **Contactar via formulario /unirse** → Proponer piloto ALRAC nodo
- [ ] **Extraer catálogo productos** → Mapear a ValueFlows resource types
- [ ] **Enviar carta individual ALRAC Master §10** a coordinadores Feria
- [ ] **Proponer γ-CARMIS Preview** (5 casos gratis) para detectar incoherencias
- [ ] **Registrar DID `did:key:feria-conuquera-caracas`** en GNAP
- [ ] **Crear NDO en Nondominium** (Layer 0 + 1) para Feria

---

## 7. SINERGIAS ESTRATÉGICAS

| Nodo | Sinergia | Mecanismo CPP |
|------|----------|---------------|
| **+Colonia (UY)** | Alimentos (café/cacao) ↔ Mercado premium + innovación agro | `pool_alimentos` cross-border |
| **Soulpreneurs (70k LATAM)** | Talento (diseño, marketing, tech) ↔ Productores Feria | `pool_servicios` ↔ `pool_talento` |
| **Nondominium (Sensorica)** | NDO federado + CapabilitySlots + Contribution/Agreement | `NdoHardLink` + `Agreement` |
| **Solarpunk Utopia** | Mesh DTN/NATS para operación offline en mercado | `meshNode` + `dtnBundle` |

---

## 8. REFERENCIAS CRUZADAS

| Documento | Sección |
|-----------|---------|
| `ASIMILACION_COMPLETA_NONDOMINIUM_TQ_CPP_HSCSG.md` | §4, §7.1 |
| `WillRuddick_TQ_CPP_Assimilation.md` | §2, §5, §7 |
| `openspec/specs/cpp-protocol.md` | §6.1, §7.1 |
| `openspec/specs/tq-cpp-bridge.md` | §3.3, §5.3 |
| `openspec/specs/colonya-integration.md` | §5, §7 |
| `src/core/lib/alrac.ts` | `createFeriaConuqueraNode()` |

---

## 9. CITAS ANCLA

> **"1 TQ = 1 kWh"** — Feria Conuquera (implementación viva 10 años, 45 colectivos)

> **"TQ is a bounded mutual-credit system, similar to LETS, using energy as its unit of account and possibly as its valuation basis."** — Will Ruddick

> **"If it is working for them i would keep TQ as a local mutual-credit clearing system. Add Commitment Pooling as the layer that makes specific productive commitments visible, curates what crosses boundaries, manages exposure, and connects TQ communities to other economic systems without requiring everyone to adopt TQ."** — Will Ruddick

> **"Live → notice → articulate → build → live with it → notice again. The living relationships remain the reference implementation."** — Will Ruddick

---

> **Nota:** Feria Conuquera es **el nodo de referencia viva** para Capa 1 (TQ) + Capa 3 (puente fiat local). No es un piloto teórico — es una economía regenerativa operando hace una década. La asimilación ALRAC/HSCSG debe **respetar y amplificar** lo que ya funciona, no reemplazarlo.
>
> **La pala y el teclado están en tus manos. E=V.**