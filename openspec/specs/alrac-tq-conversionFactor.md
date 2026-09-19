# TQ Conversion Factor Specification
## openspec/specs/alrac-tq-conversionFactor.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Calcular factor de conversión canasta TQ(500) / canasta Fiat

---

## 1. Definición

```
FC = canasta_TQ(500) / canasta_Fiat
```

Donde:
- **canasta_TQ(500)**: Valor en TQ de la canasta básica (500 TQ = límite máximo por cuenta)
- **canasta_Fiat**: Valor en moneda local (MXN, USD, EUR) de la misma canasta básica

---

## 2. Especificación Técnica

### 2.1 Función: `conversionFactor(basketTQ: number, basketFiat: number): ConversionFactor`
```typescript
interface ConversionFactor {
  factor: number;           // FC = basketTQ / basketFiat
  basketTQ: number;         // 500 TQ (límite máximo)
  basketFiat: number;       // Valor canasta en fiat (ej: 10,000 MXN)
  timestamp: number;
  region: string;           // Código región (ej: 'MX', 'AR', 'CO')
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

### 2.2 Función: `updateConversionFactor(region: string): Promise<ConversionFactor>`
```typescript
// Obtiene precios canasta básica de fuente externa (ICE/Ecoinvent/local)
// y recalcula FC
export async function updateConversionFactor(region: string): Promise<ConversionFactor> {
  const basketFiat = await fetchBasketPrice(region); // Precios bienes básicos
  return conversionFactor(500, basketFiat, region, 'ICE');
}
```

---

## 3. Canasta Básica (Regionalizada)

| Bien | Unidad | MX (MXN) | AR (ARS) | CO (COP) | Fuente |
|------|--------|----------|----------|----------|--------|
| Maíz | kg | 25 | 800 | 4,500 | ICE/Ecoinvent |
| Frijol | kg | 35 | 1,200 | 6,000 | ICE/Ecoinvent |
| Arroz | kg | 28 | 900 | 5,000 | ICE/Ecoinvent |
| Aceite | L | 45 | 1,500 | 8,000 | ICE/Ecoinvent |
| Azúcar | kg | 22 | 700 | 4,000 | ICE/Ecoinvent |
| Sal | kg | 15 | 500 | 2,500 | ICE/Ecoinvent |
| Huevos | docena | 40 | 1,300 | 7,000 | ICE/Ecoinvent |
| Leche | L | 25 | 800 | 4,500 | ICE/Ecoinvent |
| Pan | kg | 50 | 1,600 | 9,000 | ICE/Ecoinvent |
| Tortillas | kg | 20 | 650 | 3,500 | ICE/Ecoinvent |
| **Total canasta** | | **~3,000** | **~96,000** | **~540,000** | Calculado |

> **Nota**: Valores ejemplo. Implementación real usa API ICE/Ecoinvent regionalizada.

---

## 4. Uso en Sistema

### 4.1 Límite TQ ↔ Poder Adquisitivo
```
500 TQ = 1 canasta básica regional
→ 1 TQ = canasta_Fiat / 500 en poder adquisitivo real
```

### 4.2 Ancla Termodinámica
```
1 TQ = 1 kWh (físico)
FC = 500 TQ / canasta_Fiat
→ 1 kWh ≈ canasta_Fiat / 500 (puente termodinámico-económico)
```

### 4.3 Separación TQ/ZNU
| Métrica | TQ (Capa 1) | ZNU (Capa 3) |
|---------|-------------|--------------|
| Ancla | 1 TQ = 1 kWh | ZNU indexada canasta básica |
| Conversión | FC = 500/canasta_Fiat (solo referencia) | priceParity = 1 ZNU ≈ 1 USD |
| Uso | Contabilidad reciprocidad | Ahorro/crédito fiat |

---

## 5. Validaciones

| Test | Input | Expected |
|------|-------|----------|
| FC México | basketTQ=500, basketFiat=10000 | factor=0.05 |
| FC Argentina | basketTQ=500, basketFiat=500000 | factor=0.001 |
| Error basketFiat=0 | basketFiat=0 | throw Error |
| Error basketTQ≠500 | basketTQ=100 | throw Error |

---

## 6. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `conversionFactor()`, `updateConversionFactor()` |
| `src/core/lib/alrac.ts` | Integración con `simulateNode()` |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 7. Criterios de Aceptación

- [ ] `conversionFactor(500, 10000)` = { factor: 0.05, ... }
- [ ] `conversionFactor(500, 500000)` = { factor: 0.001, ... }
- [ ] Error si basketFiat ≤ 0
- [ ] Error si basketTQ ≠ 500
- [ ] `updateConversionFactor('MX')` obtiene precios ICE/Ecoinvent
- [ ] 0 errores TypeScript
- [ ] Tests unitarios cubren 4 casos