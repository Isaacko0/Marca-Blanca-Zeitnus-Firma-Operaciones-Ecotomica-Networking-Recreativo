# TQ Node Architecture Specification
## openspec/specs/alrac-tq-nodeArchitecture.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Especificaciones servidor mTLS + terminales ESP32/NFC offline

---

## 1. Arquitectura Nodo TQ

```
┌─────────────────────────────────────────────────────────────┐
│                    NODO TQ (ej: Gaia Node 01)               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    mTLS     ┌──────────────────────────┐ │
│  │  Terminales  │◄────────────►│      Servidor Nodo       │ │
│  │   ESP32/NFC  │              │  - Ledger TQ (±500)      │ │
│  │  (offline)   │              │  - Catálogo ICE/Ecoinvent│ │
│  └──────────────┘              │  - exchangeGuard         │ │
│        ▲                       │  - conversionFactor      │ │
│        │ sync periódica        │  - productFederation     │ │
│        ▼                       │  - crossNodePools        │ │
│  ┌──────────────┐              │  - governance (γ-CARMIS) │ │
│  │   Gateway    │◄────────────►│  - land registry         │ │
│  │  (opcional)  │   HTTPS      │  - taxEngine (β_crit)    │ │
│  └──────────────┘              └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Servidor Nodo (mTLS)

### 2.1 Especificaciones Mínimas
| Componente | Especificación |
|------------|----------------|
| CPU | ARM64 (Raspberry Pi 4+) o x86_64 |
| RAM | 4 GB mínimo, 8 GB recomendado |
| Storage | 64 GB SSD (ledger + catálogo + logs) |
| OS | Ubuntu Server 22.04 LTS / NixOS |
| Runtime | Node.js 20+ / Bun 1.0+ |
| TLS | mTLS obligatorio (certificados CA propia) |
| Puertos | 8443 (mTLS API), 9090 (metrics), 22 (SSH admin) |

### 2.2 API Endpoints (mTLS)
```typescript
// Ledger TQ
GET    /api/v1/tq/accounts/:accountId
POST   /api/v1/tq/transactions          // reciprocity, production, regeneration
GET    /api/v1/tq/accounts/:accountId/history

// Catálogo
GET    /api/v1/catalog/products
GET    /api/v1/catalog/products/:id
POST   /api/v1/catalog/products         // registerProductFederation

// Pools cross-nodo
GET    /api/v1/pools
POST   /api/v1/pools                    // createCrossNodePool
POST   /api/v1/pools/:id/transactions   // executeCrossNodeTransaction

// Gobernanza
GET    /api/v1/governance/proposals
POST   /api/v1/governance/proposals
POST   /api/v1/governance/proposals/:id/vote

// Tierras
GET    /api/v1/land
POST   /api/v1/land
PUT    /api/v1/land/:id/production

// Impuestos
GET    /api/v1/tax/beta-crit
GET    /api/v1/tax/fund
POST   /api/v1/tax/fund/proposals

// Métricas / Salud
GET    /metrics                         // Prometheus format
GET    /health                          // Liveness/readiness
```

### 2.3 mTLS Configuration
```yaml
# server.yaml
tls:
  cert_file: /etc/tq-node/certs/server.crt
  key_file: /etc/tq-node/certs/server.key
  ca_file: /etc/tq-node/certs/ca.crt
  verify_client: require_and_verify_client_cert
  min_version: "1.3"
```

---

## 3. Terminales ESP32/NFC (Offline-First)

### 3.1 Hardware
| Componente | Especificación |
|------------|----------------|
| MCU | ESP32-S3 (dual core, 240 MHz, 512 KB SRAM) |
| NFC | PN532 o RC522 (ISO 14443A) |
| Display | E-ink 2.9" (bajo consumo) o OLED 128x64 |
| Battery | LiPo 2000 mAh + solar charging |
| Storage | MicroSD 8 GB (logs offline) |
| Sensores | Temperatura, humedad, luz (opcional) |

### 3.2 Firmware (Rust/Embedded)
```rust
// Funciones core:
// 1. Leer tarjeta NFC (cuenta TQ)
// 2. Mostrar saldo ±500
// 3. Registrar transacción offline (cola local)
// 4. Sync periódica con servidor (cuando hay conectividad)
// 5. Verificar exchangeGuard local (no permite TQ→Fiat)

// Estados:
// - IDLE: esperando tarjeta
// - READING: leyendo NFC
// - CONFIRMING: mostrar detalles, botón confirmar
// - QUEUED: transacción en cola offline
// - SYNCING: sincronizando con servidor
// - ERROR: mostrar error, log SD
```

### 3.3 Protocolo Sync
```
Terminal                    Servidor
   │                          │
   ├─ HTTPS POST /sync ──────►│ (cuenta TQ + cola transacciones)
   │                          │
   │◄─ 200 OK {ack, server_time, catalog_delta} ──┤
   │                          │
   │  (aplica catálogo delta) │
   │                          │
```

---

## 4. Validaciones

| Test | Expected |
|------|----------|
| Servidor mTLS handshake | Certificado cliente verificado |
| API ledger CRUD | 200 OK, datos correctos |
| Terminal offline → queue | Transacción guardada en SD |
| Terminal online → sync | Cola vaciada, catálogo actualizado |
| exchangeGuard en terminal | Bloquea TQ→Fiat localmente |
| Certificado CA rotado | Renovación automática |

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | Server API handlers, terminal sync protocol |
| `firmware/esp32-nfc/` | Rust firmware (separado) |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] Servidor mTLS responde en 8443 con cert validado
- [ ] API ledger: CRUD cuentas, transacciones, historia
- [ ] API catálogo: consulta, registro, federación
- [ ] API pools: crear, transaccionar, rebalancear
- [ ] Terminal ESP32: lee NFC, muestra saldo, queue offline
- [ ] Sync periódico: vacía cola, actualiza catálogo
- [ ] exchangeGuard activo en terminal Y servidor
- [ ] 0 errores TypeScript