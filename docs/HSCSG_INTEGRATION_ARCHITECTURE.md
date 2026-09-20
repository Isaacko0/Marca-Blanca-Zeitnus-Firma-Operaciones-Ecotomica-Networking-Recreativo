# HSCSG Integration Architecture

**Versión:** 1.0  
**Fecha:** 2026-09-19  
**Estado:** Draft  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir la arquitectura técnica de integración entre **HSCSG v15 OS** (infraestructura soberana: identidad, datos, confianza, intercambio, descubrimiento, coordinación) y **ALRAC/Zeitnus** (Consorcio de Transducción Soberana + Membrana Fiat ZEITNUS).

**Principio:** HSCSG no es "otra plataforma" — es **capa de infraestructura** que ALRAC consume via APIs, protocolos, y estándares abiertos.

---

## 2. Mapa de Capacidades HSCSG → ALRAC

| Capacidad HSCSG | Módulo HSCSG | Consumido por ALRAC | Integración |
|-----------------|--------------|---------------------|-------------|
| **Identidad Soberana** | RAO, Project Weave bridge | Gaia Passport, sCoRe, membresía | API REST + VC/VP |
| **Procedencia de Datos** | DTN, ValueFlows, Kernel | Data Trust, auditoría RAO, triaxial | Event sourcing + merkle proofs |
| **Confianza/Reputación** | Kernel, NEXO, CDS | CDS calculation, governance weight | Graph sync + periodic anchor |
| **Intercambio ValueFlows** | ValueFlows engine | CaaS streams, revenue split, TQ accounting | Native VF protocol |
| **Descubrimiento** | Discovery/Search, NEXO | Directorio, matching, AI Hub | Semantic search API |
| **Coordinación Distribuida** | Bridge nodes, DTN | Multi-node federation, cross-node pools | P2P + bridge relays |
| **Kernel IA** | Kernel (transparencia, sesgos) | Gaia AI, agent-readable claims | Local inference + audit log |
| **Destilación Conocimiento** | NEXO | Education, best practices, specs | Knowledge graph sync |

---

## 3. Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ALRAC / ZEITNUS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Passport/   │  │   CaaS       │  │   TQ/ZNU     │  │  Governance  │   │
│  │  sCoRe       │  │  Streams     │  │  Ledger      │  │  (CDS/1a1v)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │           │
│         ▼                 ▼                 ▼                 ▼           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ALRAC INTEGRATION LAYER                          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │ HSCSG       │ │ HSCSG       │ │ HSCSG       │ │ HSCSG       │  │   │
│  │  │ Identity    │ │ Data/Trust  │ │ ValueFlows  │ │ Coordination│  │   │
│  │  │ Adapter     │ │ Adapter     │ │ Adapter     │ │ Adapter     │  │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘  │   │
│  └─────────┼───────────────┼───────────────┼───────────────┼──────────┘   │
│            │               │               │               │              │
└────────────┼───────────────┼───────────────┼───────────────┼──────────────┘
             │               │               │               │
             ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HSCSG v15 OS                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ RAO /       │ │ DTN /       │ │ ValueFlows  │ │ Bridge      │           │
│  │ Project     │ │ ValueFlows  │ │ Engine      │ │ Nodes / DTN │           │
│  │ Weave       │ │ / NEXO      │ │             │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐                                           │
│  │ Kernel      │ │ Discovery/  │                                           │
│  │ (IA)        │ │ Search      │                                           │
│  └─────────────┘ └─────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Adaptadores (Integration Layer)

### 4.1 HSCSG Identity Adapter

```typescript
// ALRAC consume identidades HSCSG para Gaia Passport
interface HSCSGIdentityAdapter {
  // Resolver DID HSCSG → Perfil ALRAC
  resolveProfile(did: string): Promise<ALRACProfile>;
  
  // Verificar credencial RAO
  verifyCredential(rao: RAOCredential): Promise<VerificationResult>;
  
  // Emitir credencial ALRAC via HSCSG
  issueCredential(subject: string, claim: Claim): Promise<RAOCredential>;
  
  // Revocar credencial
  revokeCredential(raoId: string, reason: string): Promise<void>;
  
  // Obtener historial de confianza (CDS components)
  getTrustHistory(did: string): Promise<TrustEvent[]>;
}
```

### 4.2 HSCSG Data/Trust Adapter

```typescript
// Data Trust + Procedencia + Permisos
interface HSCSGDataTrustAdapter {
  // Registrar dato con procedencia completa
  registerData(data: DataPacket): Promise<DataReceipt>;
  
  // Verificar procedencia y permisos
  verifyProvenance(dataId: string, requester: string): Promise<AccessDecision>;
  
  // Auditar trail de un dato
  auditTrail(dataId: string): Promise<AuditTrail>;
  
  // Sincronizar estado (revocaciones, actualizaciones)
  syncState(since: number): Promise<StateDelta>;
}
```

### 4.3 HSCSG ValueFlows Adapter

```typescript
// Contabilidad TQ/ZNU + CaaS Streams via ValueFlows
interface HSCSGValueFlowsAdapter {
  // Crear flow TQ (kWh medidos)
  createTQFlow(flow: TQFlow): Promise<FlowReceipt>;
  
  // Crear flow ZNU (crédito mutuo)
  createZNUFlow(flow: ZNUFlow): Promise<FlowReceipt>;
  
  // Revenue split Amid (35/35/30) automático
  executeAmidSplit(period: Period): Promise<SplitResult>;
  
  // Obtener balance TQ/ZNU por cuenta
  getBalances(account: string): Promise<{ tq: number; znu: number }>;
  
  // Cross-node pool operations
  poolOperation(op: PoolOp): Promise<PoolResult>;
}
```

### 4.4 HSCSG Coordination Adapter

```typescript
// Federación multi-nodo, descubrimiento, bridge
interface HSCSGCoordinationAdapter {
  // Registrar nodo ALRAC en red HSCSG
  registerNode(node: ALRACNode): Promise<NodeRegistration>;
  
  // Descubrir nodos/servicios
  discover(query: DiscoveryQuery): Promise<DiscoveryResult>;
  
  // Cross-node TQ/ZNU sync
  syncCrossNode(poolId: string): Promise<SyncResult>;
  
  // Bridge relay para nodos offline (DTN)
  queueForRelay(message: RelayMessage): Promise<void>;
}
```

---

## 5. Protocolos de Comunicación

| Adaptador | Protocolo | Formato | Autenticación |
|-----------|-----------|---------|---------------|
| Identity | HTTPS + DIDComm | JSON-LD + VC/VP | DID auth (Ed25519) |
| Data/Trust | HTTPS + gRPC | Protobuf + Merkle proofs | RAO token |
| ValueFlows | WebSocket + VF protocol | JSON | Session key |
| Coordination | libp2p / DTN | CBOR | Noise protocol |

---

## 6. Flujo de Datos Clave

### 6.1 Gaia Passport Issuance (via HSCSG)

```
USUARIO → ALRAC Portal → Solicita Passport
    │
    ▼
ALRAC Identity Adapter → HSCSG RAO → Verifica credenciales existentes
    │
    ▼
[Crea/Actualiza RAO] → Emite VC (Passport + sCoRe claims)
    │
    ▼
HSCSG Kernel → Valida transparencia/sesgos → Ancla en NEXO
    │
    ▼
ALRAC recibe VC firmado → Almacena en Passport local → Sync a NEXO
```

### 6.2 CaaS Stream Revenue → Amid Split (via ValueFlows)

```
STREAM GENERA INGRESO (USDC/ZNU)
    │
    ▼
ALRAC CaaS Adapter → HSCSG ValueFlows → Registra flow entrada
    │
    ▼
[Calcula Amid 35/35/30] → Crea 3 flows salida (Amid, Yoka, Nodos)
    │
    ▼
HSCSG ValueFlows → Ejecuta atómicamente → Emite receipts
    │
    ▼
ALRAC actualiza balances locales → Notifica miembros (CDS-weighted)
```

### 6.3 Multi-Node TQ Federation (via Coordination)

```
NODO A (productor TQ) → Cross-node pool → NODO B (consumidor TQ)
    │                          │                    │
    ▼                          ▼                    ▼
HSCSG Coordination        Bridge Node          HSCSG Coordination
Adapter (A)               (DTN relay)          Adapter (B)
    │                          │                    │
    └──────────────────────────┴────────────────────┘
                              │
                              ▼
                    ValueFlows sync atómico
                    TQ transfer verificado
                    Receipts en ambos nodos
```

---

## 7. Modo Anfibio en Integración

| Capacidad | Postmonetario (Offline) | Conectado (Online) |
|-----------|------------------------|-------------------|
| **Identity** | Local DID + VC offline | Sync a HSCSG network, anchor on-chain |
| **Data/Trust** | Local merkle log | Periodic anchor to HSCSG DTN |
| **ValueFlows** | Local ledger TQ/ZNU | Cross-node sync via bridge nodes |
| **Coordination** | Local discovery | Full P2P + DTN relay |
| **Kernel IA** | Local inference only | Federated learning (opt-in) |
| **NEXO** | Local knowledge graph | Sync to global NEXO |

**Código compartido:** `nodeMode` flag determina implementación interna.

---

## 8. Seguridad y Confianza

### 8.1 Modelo de Amenazas

| Amenaza | Mitigación HSCSG | Mitigación ALRAC |
|---------|------------------|------------------|
| Sybil attack | RAO + CDS + stake | CDS gate, participation req |
| Data tampering | Merkle proofs + DTN | Audit trail verification |
| Double spend TQ/ZNU | ValueFlows consensus | Local validation + cross-node audit |
| Oracle manipulation | Median weighted + deviation check | Multi-source + governance |
| Bridge hack | Multisig + timelocks | Emergency pause + insurance (Nivel 3) |

### 8.2 Auditoría Continua

```typescript
// Cada 24h (configurable)
async function continuousAudit(): Promise<AuditReport> {
  const checks = await Promise.all([
    verifyRAOIntegrity(),           // Identity
    verifyDataProvenance(),         // Data Trust
    verifyValueFlowsConsistency(),  // TQ/ZNU accounting
    verifyCrossNodeSync(),          // Federation
    verifyKernelTransparency(),     // IA bias audit
    verifyNEXOConsent()             // Consent vs majority
  ]);
  
  return { timestamp: Date.now(), checks, overall: checks.every(c => c.pass) };
}
```

---

## 9. Roadmap de Integración (Fases)

| Fase | Objetivo | Entregable | Validación |
|------|----------|------------|------------|
| **1. Adapters Core** | Identity + ValueFlows básicos | 2 adapters funcionales | Test unit + integration |
| **2. Data Trust** | Procedencia + permisos | DataTrust adapter | Pilot: credential flow |
| **3. Coordination** | Multi-node + discovery | Coordination adapter | Pilot: 3 nodes TQ sync |
| **4. Kernel IA** | Agent-readable claims | Kernel adapter | Pilot: Gaia AI matching |
| **5. NEXO Sync** | Knowledge distillation | NEXO adapter | Pilot: best practices sync |
| **6. Producción** | Todos adapters + anfibio | Integration layer completa | γ-CARMIS unblocked + real pilot |

---

## 10. Referencias

- `alrac-caas-revenue-streams.md` — Streams usan ValueFlows adapter
- `alrac-caas-membership.md` — Identidad usa Identity adapter
- `alrac-znu-indexing-credit.md` — Crédito usa ValueFlows + Data Trust
- `alrac-fiat-layer.md` — Bridge usa Coordination + ValueFlows
- `alrac-governance-holonic.md` — CDS usa Identity + Data Trust
- `ZEITNUS_REGENERATIVE_MODEL.md` — Mapping HSCSG capabilities
- `GRAN_ALIANZA_POR_LA_VIDA.md` — Contexto estratégico