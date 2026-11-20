// openspec/specs/alrac-tq-edible-city.md
// OpenSpec: Edible City — Espacios Públicos Productivos y Agricultura Urbana
// Mapas: "Picking allowed", huertos urbanos, permacultura, planta destacada anual → TypeScript
// Estado: Propuesta — pendiente implementación
// Capa: 1 (Contable-Física) + Capa 4 (Interoperabilidad)

# SPEC: alrac-tq-edible-city
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** Edible City of Andernach, Germany (Urban Green Blue Grids 2022, ciudad de Andernach), docs/andernach-edible-city_backup.md
**Targets:** `src/core/lib/andernach-edible-city.ts`, `src/core/lib/tq-land.ts` (extensión), `src/core/state/tq.ts` (extensión)

---

## 1. Arquitectura de espacios públicos productivos

El modelo Andernach transforma espacio público ornamental en espacio productivo de acceso común, con múltiples funciones ecológicas, económicas y sociales.

| Elemento | Descripción | Destino técnico |
|----------|-------------|-----------------|
| Espacio público productivo | Huerto de vegetales/frutas en parque, rotonda, jardín, terreno baldío; acceso gratuito | `tq-land.ts` `landType='urban_agriculture'` |
| "Picking allowed" | Derecho de recoger y disfrutar sin título privado; bien común comestible | `propertyRegimeSystem.ts` Non-Dominium |
| Planta destacada anual | Cada año una planta con decenas de variedades (tomate 2010, frijol 2011, cebolla 2012, col 2013) | `andernach-edible-city.ts` `featuredPlantPerYear` |
| Permacultura sin pesticidas | Huerto Eich 14 ha, sin pesticidas, solo fertilizantes minerales | `tq-land.ts` tipo `permaculture`, `boundaries.ts` DENY |
| Participación ciudadana | Plantar, cuidar, cosechar; educación en estacionalidad | `contributionAccounting.ts` |
| Multifuncionalidad | Biodiversidad, ecología, economía, estética, bienestar; multi-sensorial | `mel-crm.ts` indicadores |
| Red conectada (CPUL opcional) | Vaso comunicante entre espacios productivos | `myconet-hive.ts` |

---

## 2. Especificación técnica

### 2.1 Interfaz: `EdibleSpace`

```typescript
interface EdibleSpace {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  areaHectares: number;
  type: 'community_garden' | 'orchard' | 'vegetable_patch' | 'permaculture' | 'edible_hedge' | 'flower_field';
  pickingAllowed: boolean;           // "Pflücken erlaubt"
  pesticideFree: boolean;            // Sin pesticidas sintéticos
  regenerationIndex: number;         // 0-1
  varietiesCount: number;            // Número de variedades cultivadas
  featuredPlantYear?: number;        // Año en que fue planta destacada
  featuredPlantName?: string;        // Nombre de la planta destacada
  citizenParticipants: number;       // Residentes participantes en plantación/cosecha
  raoCredentialId: string;
  isPublic: boolean;
  createdAt: number;
}
```

### 2.2 Función: `registerEdibleSpace(space: Omit<EdibleSpace, 'id' | 'createdAt'>): EdibleSpace`

- Valida `raoCredentialId` válido.
- `pickingAllowed` debe ser `true` para espacios del común comestible.
- `pesticideFree` debe ser `true` (límite duro).
- Marca `isPublic = true`.

### 2.3 Función: `setFeaturedPlantYear(year: number, plantName: string, varieties: number): FeaturedPlantRecord`

```typescript
interface FeaturedPlantRecord {
  year: number;
  plantName: string;
  varieties: number;          // Decenas de variedades
  purpose: 'promote_forgotten' | 'highlight_useful';
}
```

- Registra la planta destacada del año con su cantidad de variedades.
- Promueve cultivos olvidados y cultivos útiles.

### 2.4 Función: `calculateBiodiversityIndex(spaces: EdibleSpace[]): number`

- Índice de biodiversidad cultivada basado en variedades y tipos de espacio.
- Retorna valor en [0,1].

### 2.5 Función: `verifyPickingAllowed(spaceId: string): boolean`

- Verifica que el espacio permita recoger libremente.
- Rechaza espacios con acceso restringido ("Betreten verboten").

### 2.6 Reglas duras (boundaries.ts)

- `pesticideFree === true` siempre para espacios productivos del común.
- `pickingAllowed === true` para acceso común.
- DENY: especulación en tierra urbana productiva, acceso restringido, pesticidas sintéticos.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-land` (registro tierra kWh) | `EdibleSpace` extiende `LandRegistryEntry` con tipo `urban_agriculture` y `permaculture` |
| `alrac-tq-oasa` (Constitución) | 3 Rs, 7 generaciones aplicadas a espacios urbanos |
| `alrac-tq-mel-crm` (CRM MEL) | Indicadores de biodiversidad y premio Entente Florale |
| `alrac-tq-governance-verification` (voto) | Participación ciudadana como peso de presencia en huertos urbanos |
| `alrac-tq-myconet-stack` (Myconet Hive) | Red conectada de espacios productivos (CPUL opcional) |

---

## 4. Criterios de aceptación

- [ ] `registerEdibleSpace()` rechaza pesticidas y acceso restringido
- [ ] `setFeaturedPlantYear()` registra planta destacada con variedades
- [ ] `calculateBiodiversityIndex()` retorna valor en [0,1]
- [ ] `verifyPickingAllowed()` rechaza espacios sin acceso común
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// registerEdibleSpace
Input: { name: 'Huerto Eich', areaHectares: 14, type: 'permaculture', pickingAllowed: true, pesticideFree: true, varietiesCount: 50 }
Expected: espacio creado; pesticideFree=true; pickingAllowed=true
```

```typescript
// setFeaturedPlantYear
Input: year=2010, plantName='tomate', varieties=101
Expected: FeaturedPlantRecord con varieties=101; purpose='promote_forgotten'
```

```typescript
// verifyPickingAllowed
Input: space con pickingAllowed=false
Expected: false (acceso restringido no permitido en común comestible)
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `tq-land` | 1.0.0 | Registro de tierra productiva |
| `propertyRegimeSystem` | 1.0.0 | Non-Dominium para espacio público |
| `contributionAccounting` | 1.0.0 | Participación ciudadana |
| `mel-crm` | 1.0.0 | Indicadores de biodiversidad |
| `boundaries` | 1.0.0 | Límites duros (no pesticidas, no especulación) |

---

## 7. Referencias

- `docs/andernach-edible-city_backup.md` — Texto completo de la fuente
- Urban Green Blue Grids (2022): Edible City Andernach
- USE (2022): campo de girasoles frente a casas adosadas
- Daniel Stanke (2022): huerto permacultura Eich, 14 ha
- Ciudad de Andernach: https://www.andernach.de/stadt/essbare-stadt/
- CPUL (Continuous Productive Urban Landscape): concepto de red conectada
- Entente Florale: competencia internacional de calidad ambiental urbana
- `docs/andernach-edible-city_integration.md` (EBD D1-D12)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: espacios públicos productivos, picking allowed, permacultura, planta destacada anual |
