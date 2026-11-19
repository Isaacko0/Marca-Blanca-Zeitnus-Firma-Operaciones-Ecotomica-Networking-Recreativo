// openspec/specs/alrac-tq-mel-crm.md
// OpenSpec: CRM MEL y Soberanía de Datos (ASHA MEL)
// Mapas: base de datos local, 4 registros, soberanía por nación, vista dual → TypeScript
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-mel-crm
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** sepu85/asha-mel-crm (src/lib/db.ts, README.md, package.json)
**Targets:** `src/core/lib/mel-crm.ts`, `src/core/state/mel.ts`, `src/core/lib/registrySystem.ts` (extensión)

---

## 1. Arquitectura del CRM MEL

Sistema de Monitoreo, Evaluación y Aprendizaje para alianzas territoriales (10 naciones indígenas en el caso fuente). Offline-first, base de datos local, soberanía de datos por comunidad, vista dual (comunidad vs financiador).

| Capa | Tablas / Entidades | Propósito |
|------|-------------------|-----------|
| Stakeholders | nations, communities, organizations, contacts, funding_sources | Directorio de partes interesadas con soberanía por nación |
| Programs & Activities | programs, activities, participations | Seguimiento de programas y actividades (6 pilares Bioregional 2030) |
| MEL | indicators, measurements, narrative_reports | Indicadores (quant/qual), mediciones, reportes narrativos |
| Data Sovereignty | data_access_permissions | Permisos por nación (ver interno, compartir agregado, compartir detallado) |

---

## 2. Especificación técnica

### 2.1 Interfaz: `MelRecord` (4 registros separados)

```typescript
interface MelRegistries {
  contributions: ContributionRecord[]      // Registro 1: Contribución
  responsibilities: ResponsibilityRecord[] // Registro 2: Responsabilidad
  resourceUse: ResourceUseRecord[]         // Registro 3: Uso de recursos
  economicBenefits: EconomicBenefitRecord[]// Registro 4: Beneficios económicos
}
```

**Regla dura:** Los 4 registros están separados (no Fluid Equity). Pesos: R1=40%, R2=20%, R3=20%, R4=20%.

### 2.2 Interfaz: `Nation` (soberanía de datos)

```typescript
interface Nation {
  id: string
  name: string
  country: string
  populationEstimate: number
  territoryHectares: number
  dataSovereigntyFlags: {
    canViewInternal: boolean
    canShareAggregated: boolean
    canShareDetailed: boolean
  }
}
```

### 2.3 Función: `checkDataAccess(nationId, resourceType, resourceId, accessType): boolean`

- Valida si una nación puede ver/compartir un recurso según `data_access_permissions`.

### 2.4 Interfaz: `Indicator` y `Measurement`

```typescript
interface Indicator {
  id: string
  name: string
  type: 'quantitative' | 'qualitative'
  unit: string
  programId: string
  tocLevel: 'output' | 'outcome' | 'impact'
  indigenousDefined: boolean
  baselineValue: string
  targetValue: string
}

interface Measurement {
  id: string
  indicatorId: string
  value: string
  date: number
  source: string
  communityId: string
  nationId: string
}
```

### 2.5 Función: `recordMeasurement(indicatorId, value, date, source, communityId, nationId): Measurement`

- Registra medición; valida que la nación tenga permiso sobre el indicador.

### 2.6 Pilares del Plan Bioregional 2030

| Pilar | Descripción |
|-------|-------------|
| Gobernanza territorial | Gestión autónoma de territorios indígenas |
| Seguridad alimentaria | Producción y acceso a alimentos |
| Sustentos y bioeconomía | Actividades económicas regenerativas |
| Salud intercultural | Sistemas de salud tradicionales y modernos |
| Educación | Educación comunitaria e intercultural |
| Energía renovable | Energía limpia y descentralizada |

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-economia-comunes` (capa económica) | Los indicadores MEL miden resultados económicos del común |
| `alrac-tq-land` (registro tierra) | Las mediciones de territorio se vinculan a entradas de tierra |
| `caas.ts` (streams de ingreso) | Los 6 pilares mapean a streams de indicadores CaaS |
| `currentSeeSystem.ts` | Corrientes unificadas incluyen mediciones MEL |
| `boundaries.ts` | Soberanía de datos: DENY compartir detallado sin permiso |

---

## 4. Criterios de aceptación

- [ ] 4 registros separados (contribución, responsabilidad, uso recursos, beneficios)
- [ ] `checkDataAccess` respeta flags de soberanía por nación
- [ ] Indicadores distinguen quant/qual y nivel ToC
- [ ] `indigenousDefined` marca indicadores definidos por la comunidad
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// checkDataAccess
Input: nationId='n1', resourceType='measurement', resourceId='m1', accessType='canShareDetailed'
Expected: false (si no hay permiso registrado)
```

```typescript
// recordMeasurement
Input: indicatorId='i1', value='85', date=now, source='sensor-01', communityId='c1', nationId='n1'
Expected: Measurement creada; nation n1 tiene permiso sobre la medición
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `registrySystem` | 1.0.0 | 4 registros separados |
| `boundaries` | 1.0.0 | Soberanía de datos (DENY) |
| `currentSeeSystem` | 1.0.0 | Corrientes unificadas |

---

## 7. Referencias

- `sepu85/asha-mel-crm/src/lib/db.ts`: https://github.com/sepu85/asha-mel-crm/blob/main/src/lib/db.ts
- `sepu85/asha-mel-crm/README.md`: https://github.com/sepu85/asha-mel-crm/blob/main/README.md
- `docs/oasa-tdf-governance-stack_integration.md` (EBD D18)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-19 | Propuesta inicial: CRM MEL, 4 registros, soberanía de datos, 6 pilares |
