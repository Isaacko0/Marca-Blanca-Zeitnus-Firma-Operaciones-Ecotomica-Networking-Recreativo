// openspec/specs/alrac-tq-non-transactional-value.md
// OpenSpec: Contabilidad de Valor No Transaccional (CVNT)
// Mapas: ContinuityRegistry, NonTransactionalEvent, ExternalityAssessment,
// CommonsStewardship, ContinuityDecisionEngine → TypeScript puro
// Estado: Propuesta — pendiente implementación (propuesta del usuario, no moneda nueva)
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica) + Capa 0 (Límites categóricos)

# SPEC: alrac-tq-non-transactional-value
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** Propuesta de usuario "Contabilidad de Valor No Transaccional (CVNT)" para ALRAC/Zeitnus (docs/non-transactional-value-cvnt_backup.md)
**Targets:** `src/core/lib/non-transactional-value.ts`, `src/core/state/non-transactional-value.ts`, `src/core/lib/tq-valueflows.ts` (extensión), `src/core/lib/boundaries.ts` (DENY categóricos)

---

## 1. Arquitectura de valor no transaccional

La propuesta distingue estrictamente 6 categorías que no deben confundirse:

| Categoría | Definición | ¿Genera deuda/crédito? |
|-----------|------------|------------------------|
| Valor observado | Medición de una condición (suelo, agua, biodiversidad) | No |
| Contribución atribuible | Acción de un agente registrada con evidencia | No (salvo que se acuerde) |
| Beneficio colectivo | Efecto positivo para la comunidad sin propietario | No |
| Derecho de acceso | Permiso para usar un bien común | No, es de uso |
| Derecho de propiedad | Título sobre un activo | Sí, pero excluido aquí para bienes comunes |
| Recompensa económica | Pago por servicio o contribución | Sí, pero separado del reconocimiento |

La propuesta **rechaza explícitamente crear una nueva moneda CVNT**. Los 5 componentes son infraestructura de registro y decisión, no de remuneración.

### 1.1 Los 4 dominios de continuidad

| Dominio | Qué registra | Pregunta clave |
|---------|-------------|----------------|
| Biológica y ecológica | Agua, suelo, biodiversidad, fertilidad, regeneración, resiliencia, capacidad de carga | ¿Qué condiciones de vida se mantienen o recuperan? |
| Social y relacional | Cuidados, confianza, cooperación, acompañamiento, resolución de conflictos, transmisión cultural | ¿Qué vínculos y capacidades colectivas se preservan? |
| Cognitiva | Conocimiento abierto, documentación, educación, memoria colectiva, investigación, saberes | ¿Qué conocimiento permanece disponible y se multiplica? |
| Sistémica | Mantenimiento preventivo, redundancia, autonomía, prevención de riesgos, capacidad de recuperación | ¿Qué catástrofes, dependencias y pérdidas se evitan? |

---

## 2. Especificación técnica

### 2.1 Interfaz: `ContinuityRecord`

```typescript
interface ContinuityRecord {
  id: string;
  domain: 'biological' | 'social' | 'cognitive' | 'systemic';
  indicator: string;           // ej. 'infiltracion_suelo', 'variedades_locales'
  valueBefore: number;
  valueAfter: number;
  unit: string;
  location?: string;
  raoCredentialId: string;     // procedencia de la medición
  confidence: number;          // 0-1 nivel de confianza
  uncertainty: string;         // descripción de incertidumbre
  timestamp: number;
  isPublic: boolean;           // registro público por defecto
}
```

### 2.2 Interfaz: `NonTransactionalEvent`

```typescript
interface NonTransactionalEvent {
  id: string;
  type: 'observation' | 'claim' | 'fulfillment';
  resourceId: string;          // recurso ValueFlows (land, water, knowledge, etc.)
  agentId?: string;            // opcional: no siempre hay agente reclamante
  description: string;
  avoidedHarm?: string;        // catástrofe evitada (contrafactual)
  evidence: string[];          // IDs de evidencias RAO
  timestamp: number;
  isPublic: boolean;
}
```

### 2.3 Interfaz: `ExternalityAssessment`

```typescript
interface ExternalityAssessment {
  id: string;
  eventId: string;             // referencia al NonTransactionalEvent
  counterfactualScenario: string; // "lo que habría pasado sin la intervención"
  benefitType: 'flood_avoided' | 'waste_reduced' | 'disease_prevented' | 'dependency_reduced' | 'tradition_preserved' | 'other';
  magnitude: number;           // 0-1 magnitud estimada
  confidence: number;          // 0-1
  uncertaintyNotes: string;
  timestamp: number;
}
```

### 2.4 Interfaz: `CommonsStewardship`

```typescript
interface CommonsStewardship {
  id: string;
  commonsId: string;           // ID del bien común (bosque, agua, semilla)
  stewardId: string;           // custodio temporal (no propietario)
  responsibility: string[];    // qué debe mantener
  rights: string[];            // qué puede usar (derecho de acceso, no propiedad)
  revocable: boolean;          // siempre revocable por la comunidad
  timestamp: number;
}
```

### 2.5 Interfaz: `ContinuityDecision`

```typescript
interface ContinuityDecision {
  id: string;
  evidenceIds: string[];       // registros de continuidad que la justifican
  decisionType: 'protect' | 'allocate' | 'maintain' | 'prevent';
  targetCommons: string;       // bien común afectado
  resourcesAllocated: number;  // TQ/kWh o ZNU asignados (sin crear deuda)
  rationale: string;
  approvedBy: string[];        // DIDs del comité/gobernanza
  timestamp: number;
}
```

### 2.6 Función: `registerContinuity(record: Omit<ContinuityRecord, 'id'>): ContinuityRecord`

- Crea un registro de continuidad en uno de los 4 dominios.
- Valida `confidence` en [0,1].
- Marca `isPublic = true` por defecto (registro colectivo).

### 2.7 Función: `recordNonTransactionalEvent(event: Omit<NonTransactionalEvent, 'id'>): NonTransactionalEvent`

- Registra un evento ValueFlows de tipo `observation` sin contraprestación obligatoria.
- `agentId` es opcional: un evento puede no tener agente reclamante.
- Valida que no se confunda con recompensa económica.

### 2.8 Función: `assessExternalityAvoided(eventId, counterfactual, benefitType, magnitude, confidence): ExternalityAssessment`

- Documenta un daño evitado (inundación, desperdicio, enfermedad, dependencia, pérdida de tradición).
- Registra el escenario contrafactual y nivel de incertidumbre.

### 2.9 Función: `assignCommonsStewardship(commonsId, stewardId, responsibilities, rights): CommonsStewardship`

- Asigna custodia temporal sobre un bien común.
- `rights` son derechos de acceso, NO propiedad.
- `revocable = true` siempre.

### 2.10 Función: `makeContinuityDecision(evidenceIds, decisionType, targetCommons, resourcesAllocated, rationale, approvedBy): ContinuityDecision`

- Traduce evidencia de continuidad en decisión colectiva.
- **Regla fundamental:** una decisión de protección no genera deuda, crédito ni derecho de propiedad individual para quien registró la evidencia.

### 2.11 Función: `categorizeValue(value: unknown): ContinuityCategory`

- Clasifica un valor en una de las 6 categorías.
- **Límite duro:** rechaza confusión categórica (ej. tratar valor observado como recompensa económica).

```typescript
type ContinuityCategory =
  | 'valor_observado'
  | 'contribucion_atribuible'
  | 'beneficio_colectivo'
  | 'derecho_acceso'
  | 'derecho_propiedad'
  | 'recompensa_economica';
```

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-valueflows` (observation/claim/fulfillment) | `NonTransactionalEvent` usa tipo `observation` sin `fulfillment` obligatorio |
| `alrac-tq-desmercantilizacion` (care_income, ecological_dividend, ecological_credit) | Los dividendos ecológicos y créditos de cuidado son eventos no transaccionales asociados |
| `alrac-tq-economia-comunes` (excedentes reinvertidos, no dividendos) | Coherente: excedentes se reinvierten, no se distribuyen como recompensa |
| `TQ_POSTLABOR_PROPOSAL` (TQ Stock/Flow Dual-Layer) | La continuidad sistémica es Stock (capacidad productiva acumulable); los eventos son Flow (reciprocidad presente) |
| `boundaries.ts` | DENY: nueva moneda CVNT, confusión de las 6 categorías, remuneración coactiva |
| `propertyRegimeSystem.ts` | CommonsStewardship mapea a Non-Dominium, custodio temporal |
| `registrySystem.ts` | 4 registros separados aplicados a continuidad colectiva |

---

## 4. Criterios de aceptación

- [ ] `registerContinuity()` crea registro en 1 de 4 dominios con confidence [0,1]
- [ ] `recordNonTransactionalEvent()` permite `agentId` opcional (sin agente reclamante)
- [ ] `assessExternalityAvoided()` documenta escenario contrafactual con incertidumbre
- [ ] `assignCommonsStewardship()` asigna custodia temporal, no propiedad; `revocable = true`
- [ ] `makeContinuityDecision()` no genera deuda/crédito/propiedad para el registrador
- [ ] `categorizeValue()` asigna 1 de 6 categorías; rechaza confusión categórica
- [ ] `boundaries.ts` DENY: nueva moneda CVNT; confusión categórica; remuneración coactiva
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// registerContinuity
Input: { domain: 'biological', indicator: 'infiltracion_suelo', valueBefore: 20, valueAfter: 45, unit: 'mm/h', confidence: 0.85 }
Expected: registro creado con id, timestamp, isPublic=true, domain='biological'
```

```typescript
// recordNonTransactionalEvent
Input: { type: 'observation', resourceId: 'bosque_comunal_01', description: 'cuidado de bosque 20 años', avoidedHarm: 'erosion', evidence: ['rao-001'] }
Expected: evento creado sin agentId obligatorio, type='observation', sin contraprestación
```

```typescript
// categorizeValue
Input: { tipo: 'medicion de suelo', esRecompensa: false, esPropiedad: false }
Expected: categoria = 'valor_observado' (no 'recompensa_economica')
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core (TQ ±500, RAO) |
| `tq-valueflows` | 1.0.0 | Eventos `observation`/`claim`/`fulfillment` |
| `propertyRegimeSystem` | 1.0.0 | Non-Dominium, custodio temporal |
| `registrySystem` | 1.0.0 | 4 registros separados |
| `boundaries` | 1.0.0 | Límites duros (no nueva moneda, no confusión categórica) |
| `cds` + `rao` | 1.0.0 | CDS para evidencia, RAO para procedencia |

---

## 7. Referencias

- `docs/non-transactional-value-cvnt_backup.md` — Propuesta completa del usuario
- `openspec/specs/alrac-tq-valueflows.md` — ValueFlows REA (observation/claim/fulfillment)
- `openspec/specs/alrac-tq-desmercantilizacion.md` — care_income, ecological_dividend, ecological_credit
- `openspec/specs/alrac-tq-economia-comunes.md` — excedentes reinvertidos, no dividendos
- `docs/TQ_POSTLABOR_PROPOSAL.md` — TQ Stock/Flow Dual-Layer
- `src/core/lib/tq-types-extended.ts` — TQEquityAccount (Stock Layer)
- `src/core/lib/boundaries.ts` — límites duros
- `src/core/lib/propertyRegimeSystem.ts` — Non-Dominium, custodio temporal
- `src/core/lib/contributionAccounting.ts` — registro de contribución
- Principio de Reconocimiento No Transaccional (del documento fuente): "No todo lo valioso necesita convertirse en una deuda. No todo lo reconocido necesita convertirse en una recompensa. No todo lo que sostiene la vida necesita pasar por un mercado para merecer protección."

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-22 | Propuesta inicial: 5 componentes CVNT, 4 dominios de continuidad, 6 categorías separadas, rechazo explícito de nueva moneda |
