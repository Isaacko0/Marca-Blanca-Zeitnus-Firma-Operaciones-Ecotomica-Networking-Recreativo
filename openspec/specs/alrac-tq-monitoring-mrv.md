// openspec/specs/alrac-tq-monitoring-mrv.md
// OpenSpec: Monitoreo, Reporte y Verificación (MRV) del Común Regenerativo
// Mapas: eDNA, sensores, satélites, Open Forest Protocol, Guardians of Nature → TypeScript
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-monitoring-mrv
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** Samuel Delesque, "From Commons to Commodities and Back", 26 dic 2025 (docs/oasa-manifesto_backup.md); OASA Constitution Articles V.3, VI
**Targets:** `src/core/lib/monitoring-mrv.ts`, `src/core/lib/oasa-constitution.ts`, `src/core/state/monitoring.ts`

---

## 1. Arquitectura de monitoreo MRV

Cada proyecto de tierra del común despliega un stack de monitoreo para hacer la regeneración medible, pública y verificable — "digitized commons".

| Capa | Herramienta | Qué mide | Destino técnico |
|------|-----------|----------|-----------------|
| eDNA | Suelo y agua | Especies presentes (microbios a mamíferos), sin observación directa | `monitoring-mrv.ts` `recordEDNASample()` |
| Sensores IoT | Humedad, temperatura, nutrientes, nivel freático | Salud del suelo y ciclo del agua | `monitoring-mrv.ts` `recordSensorReading()` |
| Satélites | Cobertura vegetal, crecimiento estacional | Regeneración a escala de paisaje | `monitoring-mrv.ts` + `celo-verifier.ts` (oráculo externo) |
| Open Forest Protocol | MRV forestal, verificación de reforestación | Árboles plantados, supervivencia, secuestro de carbono | `mel-crm.ts` indicadores + `celo-verifier.ts` |
| Guardians of Nature | Veto ecológico sobre decisiones | Cumplimiento de regenerative Principles | `oasa-constitution.ts` `isGuardianVetoTriggered()` |
| Dashboard público | Visualización de todos los datos | Transparencia radical, "digital twin" de la tierra | `currentSeeSystem.ts` corrientes unificadas |

---

## 2. Especificación técnica

### 2.1 Interfaz: `MRVRecord`

```typescript
interface MRVRecord {
  id: string;
  projectId: string;          // ID del proyecto de tierra (ej. TDF 25 ha)
  type: 'edna' | 'sensor' | 'satellite' | 'ofp' | 'guardian';
  timestamp: number;
  location?: { lat: number; lng: number };
  data: Record<string, unknown>;
  raoCredentialId: string;    // Procedencia del dato (quién lo midió, cuándo)
  isPublic: boolean;          // Digitized commons: por defecto público
}
```

### 2.2 Función: `recordEDNASample(projectId, sampleData, raoId): MRVRecord`

- Registra muestra de eDNA de suelo/agua.
- Valida que `raoId` sea válido (procedencia del muestreo).
- Marca `isPublic = true` por defecto.

### 2.3 Función: `recordSensorReading(projectId, sensorType, values, raoId): MRVRecord`

- `sensorType`: 'soil_moisture' | 'water_level' | 'temperature' | 'nutrients' | 'weather'.
- Almacena lectura con timestamp y ubicación.

### 2.4 Función: `calculateRegenerationIndex(projectId): number` (0-1)

- Agrega indicadores: cobertura vegetal, biodiversidad (eDNA), humedad del suelo, secuestro de carbono.
- Retorna índice de regeneración del proyecto.

### 2.5 Función: `isGuardianVetoTriggered(proposalData, mrvData): { veto; reason }`

- Evalúa si una propuesta viola los regenerative Principles (ej. expansión agrícola sobre área rewilded, declive de suelo/pájaros).
- Retorna razón del veto si aplica.

### 2.6 Función: `evaluateSevenGenerations(decision, horizonYears): { impact; compliant }`

- Evalúa impacto de una decisión a 7 generaciones (~175-300 años).
- Rechaza si compromete capacidad futura de comunidades humanas o más-than-humanas.

---

## 3. Principios regenerativos codificados (OASA Constitution)

| Principio | Requisito | Implementación |
|-----------|-----------|----------------|
| Rewilding / biodiversidad | ≥ 50% tierra como wild/rewilded | `tq-land.ts` `regenerationIndex`, tipo `conservation` |
| Agua | Swales, ponds, terraces; slow/spread/sink | `monitoring-mrv.ts` sensores de agua |
| Agricultura regenerativa | 5+ especies por 10m², 20 por ha; food forests | `tq-land.ts` `verifyAgroforestryDensity()` |
| Conocimiento abierto | Planes, código, lecciones publicados | `registrySystem.ts` append-only, `isPublic = true` |
| Tokens no-speculativos | Sin retorno financiero, sin recompra por emisor | `boundaries.ts` DENY rules |

---

## 4. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-land` (registro tierra kWh) | `regenerationIndex` y tipo `conservation` se añaden a `LandRegistryEntry` |
| `alrac-tq-oasa` (Constitución) | 3 Rs, 7 generaciones, veto Guardians se extienden aquí |
| `alrac-tq-mel-crm` (CRM MEL) | Indicadores MEL usan los mismos datos MRV |
| `alrac-tq-governance-verification` (voto) | Guardians veto sobre propuestas DAO; proof of presence ligado a monitoreo de uso de tierra |
| `celo-verifier.ts` | OFP y satélites como oráculos externos de lectura (no escritura) |

---

## 5. Criterios de aceptación

- [ ] `recordEDNASample()` crea registro con RAO válido y `isPublic = true`
- [ ] `calculateRegenerationIndex()` retorna valor en [0,1]
- [ ] `isGuardianVetoTriggered()` detecta violación de área rewilded ≥ 50%
- [ ] `evaluateSevenGenerations()` rechaza decisiones que comprometen capacidad futura
- [ ] 0 errores TypeScript nuevos

---

## 6. Vectores de prueba

```typescript
// recordEDNASample
Input: projectId='tdf-25ha', sampleData={species:['Quercus suber','Mycelium']}, raoId='rao-edna-001'
Expected: MRVRecord con type='edna', isPublic=true, raoCredentialId='rao-edna-001'
```

```typescript
// isGuardianVetoTriggered
Input: proposal={expandAgricultureInto: 'wild_area_50pct'}, mrvData={rewildedPct: 50}
Expected: veto=true, reason='Violates rewilding floor (50%)'
```

---

## 7. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `tq-land` | 1.0.0 | Registro de tierra productiva |
| `tq-oasa` | 1.0.0 | Constitución y Guardians |
| `mel-crm` | 1.0.0 | Indicadores MEL |
| `celo-verifier` | 1.0.0 | Oráculo externo de lectura (OFP, satélites) |
| `boundaries` | 1.0.0 | Límites duros (no especulación, veto ecológico) |

---

## 8. Referencias

- `docs/oasa-manifesto_backup.md` — Manifiesto completo (sección Monitoring and Technology)
- OASA Constitution Article V.3 (Technology – Monitoring): https://oasa.earth/
- Open Forest Protocol: http://atlas.smartforests.net/en/logbooks/open-forest-protocol/
- SimplexDNA (eDNA): https://www.simplexdna.com/
- `docs/oasa-manifesto_integration.md` (EBD D21-D28)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: eDNA, sensores, satélites, OFP, Guardians, 7 generaciones, 3 Rs |
