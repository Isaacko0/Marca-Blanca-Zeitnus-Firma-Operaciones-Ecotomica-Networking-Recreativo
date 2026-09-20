# ALRAC ZNU Indexing & Credit Spec

**Capa:** 3 — Membrana Fiat (ZEITNUS)  
**Versión:** 1.0  
**Estado:** Draft  
**Fecha:** 2026-09-19  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir el mecanismo de **indexación ZNU a canasta básica**, emisión de **crédito 2-3%**, **expiración por no circulación (Postulado 4)**, y gobernanza **1a1v** — el núcleo monetario postmonetario/anfibio del Consorcio ALRAC.

---

## 2. Principios Fundamentales

| Principio | Descripción |
|-----------|-------------|
| **Indexación Real** | 1 ZNU = poder adquisitivo de canasta básica definida (alimentos, energía, vivienda básica, transporte, salud) |
| **Crédito Mutuo** | ZNU se emite como crédito mutuo de suma cero (TQ-inspired), no como deuda fiduciaria |
| **Tasa 2-3%** | Costo administrativo/riesgo = 2-3% anual, NO interés usurario |
| **Expiración (Postulado 4)** | ZNU no circulado en 90 días → expira → regresa al pool común |
| **1a1v Gobernanza** | Cambios a parámetros monetarios requieren 1a1v en asamblea Núcleo+Asociados |
| **Anfibio** | Opera idéntico en postmonetario (ledger) y conectado (oráculo USDC) |

---

## 3. Canasta Básica de Referencia (ZNU Basket)

```typescript
interface ZNUBasket {
  // Composición (pesos = % gasto hogar base regenerativo)
  items: BasketItem[];
  lastUpdated: number;
  updatedBy: string;  // RAO
  version: number;
}

interface BasketItem {
  category: 'alimentos' | 'energia' | 'vivienda' | 'transporte' | 'salud' | 'educacion' | 'comunicacion';
  weight: number;           // % del total (suma = 1.0)
  unit: string;             // kg, kWh, m2, km, consulta, curso, GB
  referencePrice: number;   // Precio de referencia en USD/USDC (oráculo)
  localSource: boolean;     // ¿Producible localmente?
  regenerative: boolean;    // ¿Genera externalidad positiva?
}

// Canasta base (ejemplo - se actualiza trimestralmente)
const DEFAULT_BASKET: ZNUBasket = {
  items: [
    { category: 'alimentos', weight: 0.35, unit: 'kg', referencePrice: 2.50, localSource: true, regenerative: true },
    { category: 'energia', weight: 0.20, unit: 'kWh', referencePrice: 0.10, localSource: true, regenerative: true },
    { category: 'vivienda', weight: 0.20, unit: 'm2/mes', referencePrice: 15.00, localSource: true, regenerative: false },
    { category: 'transporte', weight: 0.10, unit: 'km', referencePrice: 0.15, localSource: false, regenerative: false },
    { category: 'salud', weight: 0.05, unit: 'consulta', referencePrice: 25.00, localSource: true, regenerative: true },
    { category: 'educacion', weight: 0.05, unit: 'curso', referencePrice: 50.00, localSource: true, regenerative: true },
    { category: 'comunicacion', weight: 0.05, unit: 'GB', referencePrice: 1.00, localSource: false, regenerative: false }
  ],
  lastUpdated: 0,
  updatedBy: '',
  version: 1
};
```

**Cálculo ZNU/USD:**
```
1 ZNU = Σ (weight_i * referencePrice_i)  = ~$4.85 USD (ejemplo)
PriceParity = 1 ZNU / $4.85 USD  (actualizado por oráculo Nivel 3 ReFi)
```

---

## 4. Emisión de Crédito (2-3%)

### 4.1 Mecanismo

```
NUEVO MIEMBRO / PROYECTO APROBADO
    │
    ▼
[Análisis capacidad productiva] → [Límite crédito = f(capacidad, historial, RAO)]
    │
    ▼
[Emisión ZNU] = Crédito mutuo de suma cero
    │
    ├─► Lado A: +ZNU en cuenta miembro (líquidez)
    └─► Lado B: -ZNU en pool común (reserva)
    │
    ▼
[Tasa administrativa 2-3% anual] → Se cobra en ZNU, va a Yoka Commons (35% Amid)
```

### 4.2 Fórmula de Límite

```typescript
function calculateCreditLimit(member: CaaSMembership, project: Project): number {
  const baseCapacity = member.tqContributed * 10;  // 1 TQ = 10 ZNU capacity
  const historyFactor = Math.min(member.participationScore * 2, 2.0);  // 0-2x
  const tierMultiplier = { afiliados: 0.5, asociados: 1.0, nucleo: 3.0 }[member.tier];
  const raoBonus = member.raoVerified ? 1.5 : 1.0;
  
  const limit = baseCapacity * historyFactor * tierMultiplier * raoBonus;
  
  // Cap absoluto por nivel
  const caps = { afiliados: 5_000, asociados: 50_000, nucleo: 500_000 };
  return Math.min(limit, caps[member.tier]);
}
```

### 4.3 Tasa 2-3% — No Interés

```typescript
const ADMIN_RATE = 0.025;  // 2.5% anual (configurable 1a1v)

// Aplicación mensual
function applyAdminFee(account: ZNUAccount): number {
  const monthlyRate = ADMIN_RATE / 12;
  const fee = account.balance * monthlyRate;
  account.balance -= fee;
  account.feesPaid += fee;
  // Fee va a pool Yoka Commons (35% Amid)
  return fee;
}
```

**Clave:** No es interés compuesto. Es fee fijo sobre balance promedio mensual. No genera deuda exponencial.

---

## 5. Expiración por No Circulación (Postulado 4 HSCSG)

> **"ZNU expira si no circula"** — Evita acumulación especulativa, fuerza velocidad de dinero regenerativo.

### 5.1 Reglas

```typescript
const EXPIRATION_CONFIG = {
  inactivityDays: 90,        // Sin tx entrantes/salientes
  gracePeriodDays: 30,       // Aviso antes de expirar
  minCirculationVelocity: 0.1,  // velocity mínima por período
  expirationAction: 'return_to_pool'  // | 'burn' | 'redistribute'
};
```

### 5.2 Algoritmo

```typescript
function checkExpiration(account: ZNUAccount, now: number): ExpirationResult {
  const daysSinceLastTx = (now - account.lastTransactionAt) / (1000 * 60 * 60 * 24);
  
  if (daysSinceLastTx < EXPIRATION_CONFIG.inactivityDays) {
    return { expired: false, daysRemaining: EXPIRATION_CONFIG.inactivityDays - daysSinceLastTx };
  }
  
  if (daysSinceLastTx < EXPIRATION_CONFIG.inactivityDays + EXPIRATION_CONFIG.gracePeriodDays) {
    return { 
      expired: false, 
      warning: true, 
      daysToExpire: EXPIRATION_CONFIG.inactivityDays + EXPIRATION_CONFIG.gracePeriodDays - daysSinceLastTx 
    };
  }
  
  // EXPIRADO
  const expiredAmount = account.balance;
  account.balance = 0;
  account.expiredTotal += expiredAmount;
  account.status = 'expired';
  
  // Regresar al pool común (Yoka Commons)
  return { 
    expired: true, 
    amount: expiredAmount, 
    action: 'returned_to_yoka_commons_pool' 
  };
}
```

### 5.3 Excepción: Staking Activo

```typescript
// ZNU en staking NO expira mientras el stake esté activo
function isProtectedFromExpiration(account: ZNUAccount): boolean {
  return account.stakedAmount > 0 && account.stakeStatus === 'active';
}
```

---

## 6. Gobernanza 1a1v (Parámetros Monetarios)

### 6.1 Parámetros Gobernados

| Parámetro | Valor Actual | Quién Propone | Quién Aprueba | Frecuencia |
|-----------|--------------|---------------|---------------|------------|
| `basketComposition` | Default | Núcleo + Data Trust | Asamblea 1a1v (66%) | Trimestral |
| `adminRate` | 2.5% | Amid Dabir | Asamblea 1a1v (66%) | Anual |
| `expirationDays` | 90 | Yoka Commons | Asamblea 1a1v (50%+1) | Anual |
| `creditLimitCaps` | Por nivel | Núcleo | Asamblea 1a1v (66%) | Semestral |
| `priceParityOracle` | Nivel 3 ReFi | Tech Council | Asamblea 1a1v (50%+1) | Según necesidad |

### 6.2 Proceso de Cambio

```
PROPUESTA → DISCUSIÓN (14 días) → VOTACIÓN 1a1v (7 días) → EJECUCIÓN (si pasa)
    │              │                    │                    │
    ▼              ▼                    ▼                    ▼
RAO + tier     Foro abierto        CDS-weighted        Smart contract /
≥ Asociado     argumentos          1a1v                ledger update
```

---

## 7. Modo Anfibio (Postmonetario ↔ Conectado)

| Aspecto | Postmonetario (Default) | Conectado (Nivel 3 ReFi) |
|---------|------------------------|--------------------------|
| **Ledger** | Local (offline-first) | Híbrido (local + on-chain anchor) |
| **PriceParity** | 1 ZNU = 1 canasta (fixed) | Oráculo USDC → ZNU dinámico |
| **Crédito** | Mutuo suma cero (TQ-anchored) | Mutuo + bridge USDC |
| **Tasa 2-3%** | ZNU interno | ZNU + USDC equivalente |
| **Expiración** | Ledger local | On-chain + local sync |
| **Gobernanza** | 1a1v local | 1a1v + snapshot off-chain |

**Lógica idéntica, distinta infraestructura.**

---

## 8. Integración TQ (1 TQ = 1 kWh)

```typescript
// ZNU se ancla a TQ via capacidad productiva
const ZNU_TQ_ANCHOR = {
  tqPerZnu: 10,        // 10 TQ (kWh) = 1 ZNU capacidad crédito
  minTqForCredit: 100, // Mínimo 100 TQ historial para acceso crédito
  regenerationBonus: 1.2  // Proyectos regenerativos +20% límite
};
```

---

## 9. Métricas de Salud Monetaria

| KPI | Fórmula | Target |
|-----|---------|--------|
| **Velocidad ZNU** | `txVolume / supply` | > 1.0/mes |
| **Ratio Circulación** | `circulating / totalSupply` | > 0.7 |
| **Expiración Rate** | `expired / supply` | < 0.05/mes |
| **Crédito/Impago** | `defaulted / issued` | < 0.02 |
| **PriceParity Deviation** | `|market - oracle| / oracle` | < 0.05 |
| **Autonomía Monetaria** | `localTx / totalTx` | > 0.8 |

---

## 10. Referencias

- `alrac-caas-revenue-streams.md` — Streams que generan ZNU
- `alrac-caas-membership.md` — Staking ZNU por nivel
- `alrac-tq-conversionFactor.md` — TQ ↔ ZNU conversion
- `alrac-governance.md` — 1a1v, CDS, asambleas
- `hscsg_definition.md` — Postulado 4, ZNU, canasta
- `ZEITNUS_REGENERATIVE_MODEL.md` — ZNU staking, anfibio