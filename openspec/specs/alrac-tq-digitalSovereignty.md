# TQ Digital Sovereignty Specification
## openspec/specs/alrac-tq-digitalSovereignty.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Soberanía de datos del nodo (RAO + DID)

---

## 1. Principio: Datos del Nodo = Propiedad del Nodo

Ninguna entidad externa (cloud, blockchain, corporación) tiene acceso a los datos del nodo sin consentimiento explícito.

---

## 2. Arquitectura Soberanía Digital

```
┌────────────────────────────────────────────────────────────┐
│                  NODO TQ (Soberano)                        │
├────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │   DID Core  │  │   RAO Log   │  │  Local Encryption  │ │
│  │  (did:tq:)  │  │  (append-only│  │  (AES-256-GCM)     │ │
│  │             │  │   immutable) │  │                    │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────┬──────────┘ │
│         │                │                    │            │
│         └────────────────┼────────────────────┘            │
│                          ▼                                 │
│              ┌─────────────────────┐                       │
│              │  Data Access Control │                      │
│              │  (ACL granular)      │                      │
│              └──────────┬──────────┘                       │
│                         │                                  │
│         ┌───────────────┼───────────────┐                 │
│         ▼               ▼               ▼                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │  Miembros  │ │  Federación│ │  Auditoría │            │
│  │  (read)    │ │  (selective)│ │  (RAO only) │            │
│  └────────────┘ └────────────┘ └────────────┘            │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Especificación Técnica

### 3.1 DID del Nodo (did:tq:)
```typescript
interface TQNodeDID {
  did: string;                    // did:tq:nodeId (ej: did:tq:gaia-node-01)
  controller: string[];           // DIDs controladores (stewards)
  verificationMethod: VerificationMethod[];
  authentication: string[];       // DIDs que pueden autenticar
  keyAgreement: string[];         // Para encriptación
  service: ServiceEndpoint[];     // Endpoints mTLS, sync
  createdAt: number;
  updatedAt: number;
}

interface VerificationMethod {
  id: string;                     // did:tq:node#key-1
  type: 'Ed25519VerificationKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;             // did:tq:node
  publicKeyMultibase: string;     // Clave pública multibase
}
```

### 3.2 RAO Log (Append-Only Inmutable)
```typescript
interface RAOLogEntry {
  id: string;                     // UUID
  type: 'transaction' | 'land' | 'catalog' | 'governance' | 'tax' | 'credential';
  payload: any;                   // Datos completos
  hash: string;                   // SHA-256(payload + prevHash)
  prevHash: string;               // Hash entrada anterior (cadena)
  signature: string;              // Firmado por node DID
  timestamp: number;
  raoCredentialId?: string;       // Si aplica
}

class RAOLog {
  // Append-only: solo addEntry(), getEntry(), verifyChain()
  // No delete, no update
  // Verificación: hash chain + firma DID
}
```

### 3.3 Control de Acceso (ACL Granular)
```typescript
interface DataACL {
  resource: string;               // Path recurso (ej: /tq/accounts, /land/registry)
  permissions: Permission[];
}

interface Permission {
  subject: string;                // DID (miembro, federado, auditor)
  actions: ('read' | 'write' | 'verify' | 'delegate')[];
  conditions?: AccessCondition[]; // Ej: time-range, purpose-limitation
  grantedAt: number;
  grantedBy: string;              // DID otorgante
  expiresAt?: number;
}

interface AccessCondition {
  type: 'time' | 'purpose' | 'jurisdiction';
  value: any;
}
```

---

## 4. Integración con Capas

| Capa | Acceso Datos Nodo | Control |
|------|-------------------|---------|
| **0 Epistémica** | Solo lectura (PI, γ-CARMIS) | Nodo decide qué compartir |
| **1 Contable (TQ)** | Lectura/escritura completa | Nodo soberano |
| **2 Interop (CaaS)** | Selectivo (matching federado) | ACL por propósito |
| **3 Fiat (Zeitnus)** | Solo auditoría RAO | Nodo controla qué ve |

---

## 5. Validaciones

| Test | Expected |
|------|----------|
| DID generado con claves Ed25519 + X25519 | Válido |
| RAO log append-only | No delete/update posible |
| Hash chain verificado | Integridad 100% |
| ACL granular por recurso/acción | Funciona |
| Encriptación local AES-256-GCM | Datos en reposo cifrados |
| Sync federado solo comparte ACL-permitido | No leak |

---

## 6. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `generateTQNodeDID()`, `RAOLog`, `DataACL` |
| `src/core/lib/rao.ts` | Verificación credenciales RAO |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 7. Criterios de Aceptación

- [ ] `generateTQNodeDID()` crea DID válido con claves
- [ ] `RAOLog.addEntry()` solo append, hash chain verificado
- [ ] `DataACL` controla read/write/verify/delegate por DID
- [ ] Encriptación local AES-256-GCM en reposo
- [ ] Sync cross-nodo respeta ACL (solo datos permitidos)
- [ ] 0 errores TypeScript
- [ ] Tests: DID, log chain, ACL, encriptación, sync