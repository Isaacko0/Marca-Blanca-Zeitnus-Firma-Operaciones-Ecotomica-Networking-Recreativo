# Spec OpenSpec: TQ Ledger — Capa 1 Contable-Física (ALRAC)

**Estado:** especificación técnica basada en implementación verificada  
**Licencia:** MIT (Zeitnus/HSCSG core)  
**Fuente:** `src/core/lib/tq.ts`, `src/core/lib/alrac.ts`  
**Atribución:** Isaac Ko / Isaacko0 — Consorcio ALRAC

## 1. ¿Qué es el TQ (Transducción Quántica)?

El TQ no es una moneda ni un activo financiero. Es una **unidad de medida contable-física** anclada a una constante termodinámica inmutable:

> **1 TQ = 1 kWh = 3.6 MJ**

El TQ mide energía física real incorporada en bienes y servicios. No es negociable, no es especulable, no se convierte a fiat/cripto dentro del sistema. Eradica la inflación de raíz: lo que cuesta 10 TQ hoy costará 10 TQ dentro de 50 o 100 años.

## 2. Especificación técnica verificada en código

### 2.1 TQAccount

```typescript
export interface TQAccount {
  id: string;
  nodeId: string;
  balance: number;              // -500 a +500 (límite de autonomía)
  memberId: string;             // DID miembro
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'frozen' | 'closed';
}
```

- Límite de balance: ±500 TQ (postulado de autonomía territorial)
- Estatus: activo, congelado, cerrado

### 2.2 TQTransaction

```typescript
export interface TQTransaction {
  id: string;
  from: string;
  to: string;
  type: 'reciprocity' | 'production' | 'regeneration';
  amount: number;
  productId?: string;
  timestamp: number;
  raoCredentialId: string;      // Anclaje termodinámico
  fromCurrency: 'TQ';
  toCurrency: 'TQ';
  // NO exchangeRate, NO fiatValue (prohibido por arquitectura)
}
```

- Tipos de transacción: reciprocidad, producción, regeneración
- Solo TQ-a-TQ: prohibido cualquier tipo de cambio o valor fiat asociado
- `raoCredentialId` ancla cada transacción al registro de procedencia (RAO)

### 2.3 TQNodeState

```typescript
export interface TQNodeState {
  nodeId: string;
  accounts: Map<string, TQAccount>;
  transactions: TQTransaction[];
  catalog: ProductFederationEntry[];
  pools: CrossNodePool[];
  lands: LandRegistryEntry[];
  assemblies: TQNodeAssembly;
  communityFund: CommunityFund;
  autonomyMetrics: AutonomyMetrics;
}
```

- `catalog`: fuente de verdad de precios del nodo (ProductFederationEntry[])
- `pools`: pozos de intercambio entre nodos
- `assemblies`: gobernanza del nodo (1a1v, CDS-weighted)

## 3. Prohibición cambiaria (archivo crítico)

### 3.1 verifyTQProhibition

```typescript
export function verifyTQProhibition(tx: TQTransaction): boolean {
  return (
    tx.fromCurrency === 'TQ' &&
    tx.toCurrency === 'TQ' &&
    ['reciprocity', 'production', 'regeneration'].includes(tx.type) &&
    !('exchangeRate' in tx) &&
    !('fiatValue' in tx) &&
    isValidTQAccount(tx.from) &&
    isValidTQAccount(tx.to)
  );
}
```

**Reglas hard-coded:**
1. `fromCurrency` debe ser `'TQ'`
2. `toCurrency` debe ser `'TQ'`
3. `type` debe ser `reciprocity | production | regeneration`
4. No puede tener propiedad `exchangeRate`
5. No puede tener propiedad `fiatValue`
6. Ambas cuentas deben ser válidas

### 3.2 blockArbitrageAttempt

```typescript
export function blockArbitrageAttempt(attempt: {
  from: TQAccount;
  to: { id: string; currency: 'USD' | 'MXN' | 'BTC' | 'ETH' | 'ZNU' };
  amount: number;
  proposedRate: number;
}): { blocked: true; reason: string; code: 'TQ_EXCHANGE_GUARD_BLOCKED'; timestamp: number; attempt: ... }
```

Bloquea explícitamente cualquier intento de arbitraje con USD, MXN, BTC, ETH o ZNU. Código de error: `TQ_EXCHANGE_GUARD_BLOCKED`.

## 4. Factor de Conversión (FC) — única "escotilla" a fiat

Para interacción inevitable con fiat, el sistema usa un Factor de Conversión calculado matemáticamente sobre una canasta fija de 500 TQ, no especulativa.

```typescript
export interface ConversionFactor {
  factor: number;
  basketTQ: number;      // 500 (máximo del límite de cuenta)
  basketFiat: number;
  timestamp: number;
  region: string;
  source: 'ICE' | 'Ecoinvent' | 'local' | 'manual';
}

export function conversionFactor(
  basketTQ: number,
  basketFiat: number,
  region: string = 'MX',
  source: 'ICE' | 'Ecoinvent' | 'local' | 'manual' = 'local'
): ConversionFactor {
  if (basketFiat <= 0) throw new Error('Basket fiat must be > 0');
  if (basketTQ !== 500) throw new Error('TQ basket must be 500 (max account limit)');
  return {
    factor: basketTQ / basketFiat,
    basketTQ,
    basketFiat,
    timestamp: Date.now(),
    region,
    source
  };
}
```

- `basketTQ` debe ser exactamente 500 (límite de cuenta)
- `factor = 500 / basketFiat`
- Fuente: ICE Database, Ecoinvent, local o manual

```typescript
export async function updateConversionFactor(region: string): Promise<ConversionFactor> {
  const basketFiat = await fetchBasketPrice(region);
  return conversionFactor(500, basketFiat, region, 'ICE');
}
```

## 5. Product Federation — Catálogo Energético (ICE/Ecoinvent)

### 5.1 ProductFederationEntry

```typescript
export type ProductCategory =
  | 'food' | 'energy' | 'water' | 'housing' | 'transport'
  | 'tools' | 'textiles' | 'health' | 'education' | 'other';

export interface EnergyBreakdown {
  extraction: number;
  manufacturing: number;
  transport: number;
  use: number;
  endOfLife: number;
  total: number;
}

export interface ProductFederationEntry {
  id: string;
  name: string;
  category: ProductCategory;
  energyFootprint: number;
  energyBreakdown: EnergyBreakdown;
  region: string;
  iceCode: string;
  ecoinventVersion: string;
  lastUpdated: number;
  verified: boolean;
  raoCredentialId?: string;
}
```

- Precio = suma de 4 componentes objetivos: energía directa + insumos + trabajo + transporte
- Bases de datos científicas: ICE Database, Agribalyse, Ecoinvent
- Sin margen para descuentos arbitrarios (anti-dumping)
- `energyFootprint` debe ser igual a `energyBreakdown.total` (verificado en registro)

### 5.2 Precio Mínimo Obligatorio (Anti-Dumping)

El catálogo calcula un precio base fijo por producto. Ejemplo: pan artesanal = 12 TQ fijo, suma de subtotales (harina, levadura, electricidad, leña, trabajo). Prohibido vender por debajo del costo real incorporado.

## 6. Reglas de negocio fundamentales

| Regla | Implementación técnica |
|---|---|
| 1 TQ = 1 kWh = 3.6 MJ | Constante física, hard-coded en tipos |
| Prohibición cambiaria | `verifyTQProhibition()` hard-coded |
| Anti-dumping | Precio mínimo obligatorio en catálogo |
| Sin especulación | `blockArbitrageAttempt()` para fiat/cripto |
| Límite de cuenta | ±500 TQ |
| FC solo vía canasta 500 TQ | `conversionFactor(500, basketFiat, ...)` |
| Transacciones solo TQ-a-TQ | `fromCurrency: 'TQ'`, `toCurrency: 'TQ'` |
| Tipos de transacción | `reciprocity` \| `production` \| `regeneration` |

## 7. Liberdad fuera del TQ

El TQ solo fiscaliza lo que se transa en TQ. Fuera del sistema hay libertad absoluta: dólares, euros, criptomonedas, trueque privado. La comunidad no se mete en lo que se hace con otras monedas. Pero dentro de la plaza común (TQ), las reglas protegen el trabajo de todos: las cosas valen lo que la energía y el trabajo determinaron en el catálogo oficial.

## 8. Referencias

- `src/core/lib/tq.ts` — implementación completa (1332 líneas)
- `src/core/lib/alrac.ts` — γ-CARMIS, triaxial verification, credo sets
- Principio rector: "El código es territorio. La documentación es mapa. La verdad es el territorio." E=V.
