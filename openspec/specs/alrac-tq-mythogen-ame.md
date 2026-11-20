// openspec/specs/alrac-tq-mythogen-ame.md
// OpenSpec: Mythogen AME — Affinity Mapping Engine & Field of Trust
// Mapas: Tri-Layered System (BODY / FIELD / SEED), Living Seed Patterns, Fields of Trust → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-mythogen-ame
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe tech-stack (Mythogen AME), docs/regen-tribe-org_backup.md
**Targets:** `src/core/lib/mythogen-ame.ts`, `src/core/state/regen-tribe.ts`

---

## 1. Arquitectura del motor de mapeo de afinidad

Mythogen AME hace legibles las dinámicas invisibles de la comunidad a través de un sistema tri-capa:

| Capa | Qué mapea | Propósito |
|------|-----------|-----------|
| **BODY** | Cuerpo físico, presencia, territorio, recursos | Dónde está la comunidad, qué ocupa |
| **FIELD** | Campo de confianza, relaciones, afinidad, redes | Cómo se conectan las personas |
| **SEED** | Patrones de semilla viva, potencial, crecimiento | Qué puede emerger y evolucionar |

---

## 2. Especificación técnica

### 2.1 Interfaz: `TrustField`

```typescript
interface TrustField {
  id: string;
  name: string;
  members: string[];           // IDs de personas en el campo
  trustLevel: number;          // 0-1, fuerza de confianza del campo
  layer: 'BODY' | 'FIELD' | 'SEED';
  properties: Record<string, unknown>;
  timestamp: number;
}
```

### 2.2 Interfaz: `LivingSeedPattern`

```typescript
interface LivingSeedPattern {
  id: string;
  name: string;
  description: string;
  layer: 'BODY' | 'FIELD' | 'SEED';
  activationConditions: string[]; // condiciones para que el patrón se active
  potential: number;              // 0-1, potencial de emergencia
  timestamp: number;
}
```

### 2.3 Función: `mapAffinity(personA: string, personB: string, context: unknown): { affinityScore; trustField }`

- Calcula el score de afinidad entre dos personas basado en contexto compartido.
- Asigna o actualiza un campo de confianza (TrustField).

### 2.4 Función: `detectTrustField(members: string[], layer: 'BODY' | 'FIELD' | 'SEED'): TrustField`

- Detecta o crea un campo de confianza para un grupo de miembros en una capa dada.

### 2.5 Función: `identifySeedPatterns(context: unknown): LivingSeedPattern[]`

- Identifica patrones de semilla viva en un contexto dado.
- Retorna patrones con su nivel de potencial de emergencia.

### 2.6 Función: `triLayeredAnalysis(communityId: string): { body; field; seed }`

- Ejecuta el análisis completo de las tres capas para una comunidad.
- Retorna el estado de BODY, FIELD y SEED con sus respectivos patrones y campos.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-rnmd` (humanware, arquetipos) | Los arquetipos RNMD son miembros en los campos de confianza |
| `alrac-tq-regen-knowledge-graph` | Los campos de confianza y patrones son nodos y aristas del grafo |
| `alrac-tq-genesis-agent` | Los vision holders reclutados (paso 2) forman campos de confianza iniciales |
| `propertyRegimeSystem.ts` | Los miembros con roles de custodio participan en campos de confianza |
| `boundaries.ts` | DENY: campos de confianza manipulados sin evidencia de interacción real |

---

## 4. Criterios de aceptación

- [ ] `mapAffinity()` retorna score en [0,1] y crea/actualiza TrustField
- [ ] `detectTrustField()` crea campo con capa válida (BODY/FIELD/SEED)
- [ ] `identifySeedPatterns()` retorna patrones con potencial en [0,1]
- [ ] `triLayeredAnalysis()` retorna estado completo de las 3 capas
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// mapAffinity
Input: personA='member-001', personB='member-002', context={sharedProjects: 3, hoursTogether: 50}
Expected: affinityScore en [0,1]; trustField.layer válido
```

```typescript
// triLayeredAnalysis
Input: communityId='barrio-001'
Expected: objeto con body, field, seed; cada capa con trustFields y seedPatterns
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `regen-knowledge-graph` | 1.0.0 | Campos y patrones como nodos del grafo |
| `propertyRegimeSystem` | 1.0.0 | Miembros con roles en la comunidad |
| `boundaries` | 1.0.0 | Límites duros (no confianza fabricada) |

---

## 7. Referencias

- `docs/regen-tribe-org_backup.md` — Tech-Stack: Mythogen AME
- `docs/regen-tribe-org_integration.md` (EBD D33, D44)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: Tri-Layered System, Fields of Trust, Living Seed Patterns |
