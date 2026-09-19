# TQ Land Registry Specification
## openspec/specs/alrac-tq-land.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Registro de tierra productiva anclada a kWh reales

---

## 1. Principio: Tierra = Capacidad Productiva Medible

La tierra no es activo especulativo. Es **capacidad de generar kWh regenerativos** (alimento, energía, agua, hábitat).

---

## 2. Especificación Técnica

### 2.1 Interfaz: `LandRegistryEntry`
```typescript
interface LandRegistryEntry {
  id: string;                      // UUID
  nodeId: string;                  // Nodo propietario/custodio
  geometry: GeoJSON.Polygon;       // Límite físico
  areaHectares: number;
  landType: LandType;              // Clasificación productiva
  productiveCapacity: ProductiveCapacity; // kWh/año por tipo
  currentProduction: CurrentProduction;   // kWh/año actual
  regenerationIndex: number;       // 0-1 (1 = totalmente regenerativo)
  stewardship: StewardshipInfo;    // Quién cuida, cómo
  raoCredentialId: string;         // Credencial RAO anclaje termodinámico
  registeredAt: number;
  updatedAt: number;
}

type LandType = 
  | 'agriculture' | 'agroforestry' | 'silvopasture' | 'forest'
  | 'wetland' | 'aquaculture' | 'solar' | 'wind' | 'microhydro'
  | 'housing_earth' | 'community_infra' | 'conservation';

interface ProductiveCapacity {
  food_kWh_year: number;       // Alimento (kWh nutricionales)
  energy_kWh_year: number;     // Energía (eléctrica/térmica)
  water_kWh_year: number;      // Agua (bombeo/tratamiento = kWh)
  habitat_kWh_year: number;    // Vivienda tierra (embodied energy ahorrado)
  total_kWh_year: number;      // Suma
}

interface CurrentProduction {
  food_kWh_year: number;
  energy_kWh_year: number;
  water_kWh_year: number;
  habitat_kWh_year: number;
  total_kWh_year: number;
  lastMeasured: number;
}

interface StewardshipInfo {
  stewards: string[];          // DIDs custodios
  practices: string[];         // Prácticas regenerativas
  certifications: string[];    // Certificaciones (ej: EOV, ROC)
  communityAgreement: boolean; // Acuerdo comunidad local
}
```

### 2.2 Función: `registerLand(entry: LandRegistryEntry): LandResult`
```typescript
export function registerLand(entry: LandRegistryEntry): LandResult {
  // Validaciones:
  // 1. geometry válido, no overlap con otras entradas
  // 2. productiveCapacity basado en catálogo ICE/Ecoinvent regional
  // 3. regenerationIndex ∈ [0, 1]
  // 4. raoCredentialId válido (anclaje termodinámico)
  // 5. stewards son miembros válidos del nodo (cuentas TQ ±500, αʰ > κ)
}
```

### 2.3 Función: `updateLandProduction(landId: string, production: Partial<CurrentProduction>): UpdateResult`
```typescript
// Actualización periódica (estacional) con medición real
// Requiere verificación RAO (sensor certificado o auditoría humana)
```

### 2.4 Función: `computeLandTQYield(landId: string): TQYield`
```typescript
// Rendimiento TQ = currentProduction.total_kWh_year (1 TQ = 1 kWh)
// Este TQ puede depositarse en pool cross-nodo o usarse para reciprocidad
```

---

## 3. Anclaje Termodinámico (RAO)

Cada entrada de tierra **requiere** credencial RAO con:
- **Procedencia**: sensor certificado (IoT) O auditoría humana verificada
- **Anclaje**: kWh medidos físicamente
- **Estado**: activo | en_disputa | revocado

---

## 4. Ejemplo: Vivienda Tierra (BioHabitats)

```json
{
  "landType": "housing_earth",
  "areaHectares": 0.5,
  "productiveCapacity": {
    "habitat_kWh_year": 15000,  // Embodied energy ahorrado vs concreto
    "total_kWh_year": 15000
  },
  "currentProduction": {
    "habitat_kWh_year": 14200,
    "total_kWh_year": 14200
  },
  "regenerationIndex": 0.95,
  "stewardship": {
    "stewards": ["did:biohabitats:steward01"],
    "practices": ["tapia_pisada", "adobe", "techo_vivo"],
    "certifications": ["EOV-Verified"],
    "communityAgreement": true
  }
}
```

---

## 5. Validaciones

| Test | Expected |
|------|----------|
| Tierra sin RAO credencial | Rechazada |
| Overlap geometría | Rechazada |
| regenerationIndex > 1 | Rechazada |
| Steward no miembro nodo | Rechazada |
| Producción > capacidad | Warning (sobreexplotación) |

---

## 6. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `registerLand()`, `updateLandProduction()`, `computeLandTQYield()` |
| `src/core/lib/rao.ts` | Verificación credencial anclaje |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 7. Criterios de Aceptación

- [ ] Registro tierra valida geometría, RAO, stewards
- [ ] Capacidad productiva basada en catálogo ICE/Ecoinvent
- [ ] Actualización estacional con medición real
- [ ] Rendimiento TQ = kWh reales producidos
- [ ] 0 errores TypeScript
- [ ] Tests unitarios: registro, actualización, yield, overlap