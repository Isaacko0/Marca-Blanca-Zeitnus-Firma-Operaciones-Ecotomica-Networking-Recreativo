# ALRAC Fiat Layer Spec

**Capa:** 3 — Membrana Fiat (ZEITNUS)  
**Versión:** 1.0  
**Estado:** Draft  
**Fecha:** 2026-09-19  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir la **capa de interfaz fiat (USDC/USD)** del Consorcio ALRAC: bridge USDC, price parity oracle (Nivel 3 ReFi), niveles de conexión ReFi, y conversión anfibia ZNU↔USDC sin romper principios postmonetarios.

---

## 2. Niveles ReFi (Conectividad)

| Nivel | Nombre | Descripción | Infraestructura | Uso en ALRAC |
|-------|--------|-------------|-----------------|--------------|
| **Nivel 0** | Postmonetario Puro | Offline-first, solo ZNU/TQ, sin oráculo | Local ledger only | Default, resiliente |
| **Nivel 1** | Bridge Básico | USDC ↔ ZNU 1:1 via priceParity fijo | API simple, custodia propia | Proyectos piloto |
| **Nivel 2** | Bridge Dinámico | PriceParity via oráculo (Chainlink/Propio) | Oracle + multisig | Operación regular |
| **Nivel 3** | ReFi Completo | Oráculo certificado, compliance, seguros | Oracles Nivel 3 + legal entity | Producción escalada |

**Regla:** Un nodo opera en UN nivel a la vez. Transición requiere gobernanza 1a1v.

---

## 3. PriceParity Oracle (Nivel 3)

```typescript
interface PriceParityOracle {
  // Configuración
  level: 0 | 1 | 2 | 3;
  sources: OracleSource[];
  updateInterval: number;  // ms
  deviationThreshold: number;  // % máximo desviación entre fuentes
  
  // Estado
  currentParity: number;   // 1 ZNU = X USDC
  lastUpdate: number;
  confidence: number;      // 0-1
  status: 'healthy' | 'degraded' | 'offline';
}

interface OracleSource {
  name: string;
  type: 'chainlink' | 'custom' | 'cex' | 'dex' | 'reFi_certified';
  endpoint: string;
  weight: number;          // Peso en agregación (suma = 1.0)
  requiresAuth: boolean;
  lastPrice: number;
  lastUpdate: number;
  healthy: boolean;
}
```

### 3.1 Agregación (Mediana Ponderada)

```typescript
function calculatePriceParity(oracle: PriceParityOracle): number {
  const healthySources = oracle.sources.filter(s => s.healthy && s.lastPrice > 0);
  
  if (healthySources.length < 2) {
    throw new Error('Insufficient healthy oracle sources');
  }
  
  // Mediana ponderada (resistente a outliers)
  const sorted = healthySources.sort((a, b) => a.lastPrice - b.lastPrice);
  let cumulativeWeight = 0;
  const targetWeight = 0.5;
  
  for (const source of sorted) {
    cumulativeWeight += source.weight;
    if (cumulativeWeight >= targetWeight) {
      return source.lastPrice;
    }
  }
  
  return sorted[sorted.length - 1].lastPrice;  // fallback
}
```

### 3.2 Validación de Desviación

```typescript
function validateDeviation(oracle: PriceParityOracle): boolean {
  const prices = oracle.sources.filter(s => s.healthy).map(s => s.lastPrice);
  const median = calculatePriceParity(oracle);
  
  const maxDeviation = Math.max(...prices.map(p => Math.abs(p - median) / median));
  
  return maxDeviation <= oracle.deviationThreshold;  // default 5%
}
```

---

## 4. Bridge USDC ↔ ZNU

### 4.1 Operaciones Básicas

```typescript
interface BridgeOperation {
  id: string;
  type: 'mint_znu' | 'burn_znu' | 'deposit_usdc' | 'withdraw_usdc';
  from: string;           // RAO address
  to: string;             // RAO address
  amountZnu: number;
  amountUsdc: number;
  priceParity: number;    // Rate usado
  feeUsdc: number;        // Fee en USDC
  feeZnu: number;         // Fee en ZNU
  status: 'pending' | 'confirmed' | 'failed' | 'reverted';
  txHash?: string;        // On-chain (si Nivel 2/3)
  timestamp: number;
  approvedBy: string[];   // RAO approvers
}
```

### 4.2 Reglas de Conversión

```typescript
const BRIDGE_CONFIG = {
  // Fees
  mintFeeBps: 50,        // 0.5% mint ZNU (→ Yoka Commons)
  burnFeeBps: 30,        // 0.3% burn ZNU (→ Yoka Commons)
  depositFeeBps: 20,     // 0.2% deposit USDC
  withdrawFeeBps: 20,    // 0.2% withdraw USDC
  
  // Límites
  minAmountUsdc: 10,     // $10 mínimo
  maxAmountUsdc: 1_000_000,  // $1M máx por tx (configurable)
  dailyLimitUsdc: 5_000_000, // $5M/día por nodo
  
  // Slippage protection
  maxSlippageBps: 100,   // 1% máx desviación vs oracle
  
  // Compliance (Nivel 2/3)
  kycRequired: false,    // Nivel 0/1: false, Nivel 2/3: true
  amlCheck: false,
  sanctionsScreen: false
};
```

### 4.3 Mint ZNU (USDC → ZNU)

```typescript
function mintZnu(usdcAmount: number, oracle: PriceParityOracle, config: BridgeConfig): MintResult {
  // Validaciones
  if (usdcAmount < config.minAmountUsdc || usdcAmount > config.maxAmountUsdc) {
    throw new Error('Amount out of bounds');
  }
  
  const parity = oracle.currentParity;
  const expectedZnu = usdcAmount / parity;
  const feeUsdc = usdcAmount * config.mintFeeBps / 10000;
  const netUsdc = usdcAmount - feeUsdc;
  const znuAmount = netUsdc / parity;
  
  // Verificar slippage vs oracle
  const actualParity = netUsdc / znuAmount;
  const slippage = Math.abs(actualParity - parity) / parity * 10000;
  if (slippage > config.maxSlippageBps) {
    throw new Error('Slippage exceeds threshold');
  }
  
  return {
    znuAmount,
    feeUsdc,
    feeZnu: feeUsdc / parity,
    priceParityUsed: parity,
    actualParity,
    slippageBps: slippage
  };
}
```

### 4.4 Burn ZNU (ZNU → USDC)

```typescript
function burnZnu(znuAmount: number, oracle: PriceParityOracle, config: BridgeConfig): BurnResult {
  const parity = oracle.currentParity;
  const grossUsdc = znuAmount * parity;
  const feeUsdc = grossUsdc * config.burnFeeBps / 10000;
  const netUsdc = grossUsdc - feeUsdc;
  
  return {
    usdcAmount: netUsdc,
    feeUsdc,
    feeZnu: feeUsdc / parity,
    priceParityUsed: parity,
    grossUsdc
  };
}
```

---

## 5. Compliance por Nivel

| Requisito | Nivel 0 | Nivel 1 | Nivel 2 | Nivel 3 |
|-----------|---------|---------|---------|---------|
| KYC | ❌ | ❌ | ✅ | ✅ |
| AML | ❌ | ❌ | Básico | Completo |
| Sanctions Screen | ❌ | ❌ | ✅ | ✅ |
| Source of Funds | ❌ | ❌ | ❌ | ✅ |
| Custody | Self | Self | Multisig 2/3 | Qualified Custodian |
| Audit Trail | Local | Local | On-chain + Local | On-chain + Legal |
| Insurance | ❌ | ❌ | ❌ | ✅ (hasta $10M) |

---

## 6. Modo Anfibio - Lógica Unificada

```typescript
class FiatLayer {
  private oracle: PriceParityOracle;
  private config: BridgeConfig;
  private mode: 'postmonetario' | 'conectado';
  
  // MISMA INTERFAZ, distinta implementación interna
  async convertUsdcToZnu(usdc: number, rao: string): Promise<ConversionResult> {
    if (this.mode === 'postmonetario') {
      return this.localMint(usdc, rao);  // Ledger local, priceParity fijo
    }
    return this.bridgeMint(usdc, rao);   // Bridge real, oracle dinámico
  }
  
  async convertZnuToUsdc(znu: number, rao: string): Promise<ConversionResult> {
    if (this.mode === 'postmonetario') {
      return this.localBurn(znu, rao);   // Ledger local, crédito interno
    }
    return this.bridgeBurn(znu, rao);    // Bridge real, USDC real
  }
  
  // El cálculo de priceParity, fees, slippage ES IDÉNTICO
  // Solo cambia: dónde se guarda, cómo se valida, qué infraestructura usa
}
```

---

## 7. Métricas de Salud Bridge

| KPI | Fórmula | Target |
|-----|---------|--------|
| **Bridge Volume** | `Σ mint + burn (USDC)` | Creciente |
| **Parity Deviation** | `|bridge - oracle| / oracle` | < 0.5% |
| **Fee Revenue** | `Σ fees (USDC + ZNU)` | Cubre costos ops |
| **Failed Tx Rate** | `failed / total` | < 0.1% |
| **Liquidity Depth** | `USDC reserve / daily volume` | > 30 días |
| **Oracle Uptime** | `healthy updates / expected` | > 99.9% |

---

## 8. Referencias

- `alrac-znu-indexing-credit.md` — ZNU canasta, crédito, expiración
- `alrac-tq-conversionFactor.md` — TQ ↔ ZNU (ancla kWh)
- `alrac-governance.md` — 1a1v para cambios de nivel
- `ZEITNUS_REGENERATIVE_MODEL.md` — PriceParity, anfibio
- `alrac-caas-revenue-streams.md` — Streams que usan bridge