# TQ Product Federation Specification
## openspec/specs/alrac-tq-productFederation.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Catálogo energético ICE/Ecoinvent regionalizado para federación de productos

---

## 1. Concepto

Cada producto/servicio en la red ALRAC tiene una **huella energética** medida en kWh (≡ TQ).
El catálogo ICE/Ecoinvent regionalizado permite:
- Comparar productos cross-nodo
- Calcular costos energéticos reales
- Validar regeneración neta

---

## 2. Especificación Técnica

### 2.1 Interfaz: `ProductFederationEntry`
```typescript
interface ProductFederationEntry {
  id: string;                    // UUID único
  name: string;                  // Nombre producto/servicio
  category: ProductCategory;     // Categoría estandarizada
  energyFootprint: number;       // kWh totales (ciclo vida completo)
  energyBreakdown: EnergyBreakdown; // Desglose por fase
  region: string;                // Región producción (código ISO)
  iceCode: string;               // Código ICE/Ecoinvent
  ecoinventVersion: string;      // Versión base datos (ej: '3.10')
  lastUpdated: number;           // Timestamp
  verified: boolean;             // Verificado por RAO
  raoCredentialId?: string;      // Link a credencial RAO
}

type ProductCategory = 
  | 'food' | 'energy' | 'water' | 'housing' | 'transport' 
  | 'tools' | 'textiles' | 'health' | 'education' | 'other';

interface EnergyBreakdown {
  extraction: number;      // kWh extracción materia prima
  manufacturing: number;   // kWh manufactura
  transport: number;       // kWh transporte
  use: number;             // kWh uso operación
  endOfLife: number;       // kWh fin de vida
  total: number;           // Suma = energyFootprint
}
```

### 2.2 Función: `registerProductFederation(entry: ProductFederationEntry): RegistrationResult`
```typescript
export function registerProductFederation(entry: ProductFederationEntry): RegistrationResult {
  // Validaciones:
  // 1. energyFootprint === energyBreakdown.total
  // 2. iceCode existe en catálogo ICE/Ecoinvent versión especificada
  // 3. region coincide con nodo productor
  // 4. Si verified=true → requiere raoCredentialId válido
  
  return {
    success: true,
    productId: entry.id,
    timestamp: Date.now(),
    warnings: []
  };
}
```

### 2.3 Función: `queryProductFederation(filters: ProductFilters): ProductFederationEntry[]`
```typescript
interface ProductFilters {
  category?: ProductCategory;
  region?: string;
  maxEnergyFootprint?: number;
  verifiedOnly?: boolean;
  iceCode?: string;
}

export function queryProductFederation(filters: ProductFilters): ProductFederationEntry[] {
  // Consulta catálogo federado cross-nodo
  // Retorna entradas que coinciden con filtros
}
```

---

## 3. Catálogo ICE/Ecoinvent Regionalizado

### 3.1 Estructura Mínima por Región
| Región | Código | Base Datos | Productos Mínimos |
|--------|--------|------------|-------------------|
| México | MX | ICE 3.10 + Ecoinvent 3.10 | 50+ |
| Argentina | AR | ICE 3.10 + Ecoinvent 3.10 | 30+ |
| Colombia | CO | ICE 3.10 + Ecoinvent 3.10 | 30+ |
| Chile | CL | ICE 3.10 + Ecoinvent 3.10 | 25+ |

### 3.2 Ejemplos Entradas Catálogo
| Producto | Categoría | kWh (MX) | kWh (AR) | ICE Code |
|----------|-----------|----------|----------|----------|
| Maíz (kg) | food | 2.5 | 2.8 | ICE-01-001 |
| Panel solar 400W | energy | 1,200 | 1,350 | ICE-05-042 |
| Bomba agua solar | water | 800 | 900 | ICE-04-018 |
| Vivienda tierra 50m² | housing | 15,000 | 18,000 | ICE-06-003 |
| Bicicleta cargo | transport | 300 | 350 | ICE-07-012 |

---

## 4. Federación Cross-Nodo

### 4.1 Matching Oferta/Demanda
```
Nodo A (Gaia): Produce maíz → 2.5 kWh/kg (registrado RAO)
Nodo B (BioHabitats): Necesita maíz → consulta catálogo
Matching: productFederation.query({category: 'food', region: 'MX'})
→ Precio TQ = 2.5 TQ/kg (1 TQ = 1 kWh)
```

### 4.2 Validación Regeneración Neta
```typescript
function validateNetRegeneration(
  production: ProductFederationEntry[],
  consumption: ProductFederationEntry[]
): NetRegenerationResult {
  const produced = production.reduce((sum, p) => sum + p.energyFootprint, 0);
  const consumed = consumption.reduce((sum, c) => sum + c.energyFootprint, 0);
  
  return {
    netEnergy: produced - consumed,
    isRegenerative: produced > consumed,
    ratio: produced / consumed,
    timestamp: Date.now()
  };
}
```

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `registerProductFederation()`, `queryProductFederation()`, `validateNetRegeneration()` |
| `src/core/lib/rao.ts` | Verificación credencial RAO para `verified=true` |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] Catálogo ICE/Ecoinvent cargado para al menos 1 región (MX)
- [ ] `registerProductFederation()` valida energyFootprint = breakdown.total
- [ ] `registerProductFederation()` valida iceCode existe
- [ ] `queryProductFederation()` filtra por categoría, región, energía máx
- [ ] `validateNetRegeneration()` calcula balance neto correcto
- [ ] Integración RAO: `verified=true` requiere credencial válida
- [ ] 0 errores TypeScript
- [ ] Tests unitarios cubren registro, consulta, validación