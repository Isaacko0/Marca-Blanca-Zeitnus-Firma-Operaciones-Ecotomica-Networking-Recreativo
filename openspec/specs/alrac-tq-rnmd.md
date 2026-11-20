// openspec/specs/alrac-tq-rnmd.md
// OpenSpec: Regenerative Neighborhood Modular Design (RNMD)
// Mapas: hardware, humanware, economy/exchangeware, software/My.Co.Net → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-rnmd
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe collective, "Regenerative Neighborhood MODULAR DESIGN" (docs/regenerative-neighborhood-rnmd_backup.md)
**Targets:** `src/core/lib/rnmd-hardware.ts`, `src/core/lib/rnmd-humanware.ts`, `src/core/lib/rnmd-economy.ts`, `src/core/lib/rnmd-software.ts`, `src/core/state/rnmd.ts`

---

## 1. Arquitectura del marco modular RNMD

El RNMD es un framework de código abierto para crear barrios regenerativos, basado en 4 módulos intercambiables:

| Módulo | Qué contiene | Destino técnico |
|--------|-------------|-----------------|
| **hardware** | Vivienda wellness, sistemas de recursos resilientes (agua, comida, energía, aire, residuos) | `rnmd-hardware.ts` |
| **humanware** | Arquetipos de participación, bienestar individual/colectivo, Ikigai (propósito) | `rnmd-humanware.ts` |
| **economy / exchangeware** | Economía sostenible y productiva, intercambio de valor sin especulación | `rnmd-economy.ts` |
| **software / My.Co.Net** | Aplicación con LLM integrada, gestión de barrio | `rnmd-software.ts` |

Los 4 módulos operan bajo los mismos límites duros que el resto del repo: no especulación, no extracción, principio anfibio, soberanía de datos.

---

## 2. Especificación técnica

### 2.1 Interfaz: `RNMDModule`

```typescript
interface RNMDModule {
  id: string;
  name: 'hardware' | 'humanware' | 'economy' | 'software';
  status: 'planned' | 'active' | 'scaled';
  location?: string;
  raoCredentialId: string;    // Procedencia del módulo
  isPublic: boolean;          // Open source por defecto
  createdAt: number;
}
```

### 2.2 Interfaz: `Archetype`

```typescript
type ArchetypeKey =
  | 'vision-holder'
  | 'community-member'
  | 'service-provider'
  | 'resource-holder'
  | 'land-guardian'
  | 'collaborator';

interface Archetype {
  key: ArchetypeKey;
  label: string;
  role: string;               // Qué aporta al barrio
  requirements: string[];     // Requisitos para asumir el rol
  canVote: boolean;
  canPropose: boolean;
}
```

### 2.3 Interfaz: `ResourceSystem`

```typescript
type ResourceType = 'water' | 'food' | 'energy' | 'air' | 'waste';

interface ResourceSystem {
  type: ResourceType;
  resilient: boolean;         // ¿Cumple criterios de resiliencia?
  capacity: number;           // Capacidad instalada
  currentProduction: number;  // Producción actual
  lastMeasured: number;
}
```

### 2.4 Función: `registerHardwareModule(module: RNMDModule): RNMDModule`

- Valida que el módulo de hardware tenga `raoCredentialId` válido.
- Marca `isPublic = true` por defecto (open source).

### 2.5 Función: `registerArchetype(archetype: Archetype): Archetype`

- Registra uno de los 6 arquetipos RNMD.
- `land-guardian` y `vision-holder` tienen `canPropose = true`.
- `community-member` y `service-provider` tienen `canVote = true`.

### 2.6 Función: `registerResourceSystem(system: ResourceSystem): { compliant; missing }`

- Valida resiliencia de cada tipo de recurso (agua, comida, energía, aire, residuos).
- Retorna qué tipos faltan para alcanzar resiliencia completa.

### 2.7 Función: `assessWellbeing(individual: number, collective: number, nature: number, purpose: number): { score; level }`

- 4 dimensiones: individual, colectivo, conexión a naturaleza, creación con propósito.
- Cada una en escala 0-1; score promedio; nivel: bajo/medio/alto.

### 2.8 Función: `llmIntegratedApp(query: string, context: unknown): { enrichment; humanInLoop }`

- LLM como enriquecedor de consulta (estilo `regenerative-agent.ts`).
- `humanInLoop = true` siempre: el humano valida, la LLM no decide sola.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-land` (registro tierra kWh) | Sistemas de recursos resilientes se anclan a entradas de tierra |
| `alrac-tq-mel-crm` (CRM MEL) | Indicadores de bienestar y resiliencia de recursos |
| `alrac-tq-regenerative-agent` (agente) | Dominio `community` para LLM integrada |
| `alrac-tq-governance-verification` (voto) | Arquetipos con `canVote` / `canPropose` |
| `propertyRegimeSystem` (roles) | Arquetipos mapean a roles de custodio y miembro |
| `boundaries.ts` | DENY: especulación inmobiliaria, LLM autónoma |

---

## 4. Criterios de aceptación

- [ ] 4 módulos RNMD creados y tipados
- [ ] 6 arquetipos registrados con roles y permisos correctos
- [ ] `registerResourceSystem()` detecta recursos faltantes
- [ ] `assessWellbeing()` retorna score en [0,1] y nivel válido
- [ ] `llmIntegratedApp()` siempre tiene `humanInLoop = true`
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// registerArchetype
Input: { key: 'land-guardian', label: 'Guardián de Tierra', role: 'Ofrece tierra para el barrio', requirements: [], canVote: false, canPropose: true }
Expected: archetype.key === 'land-guardian'; canPropose === true
```

```typescript
// assessWellbeing
Input: individual=0.8, collective=0.6, nature=0.9, purpose=0.7
Expected: score = 0.75; level = 'alto'
```

```typescript
// registerResourceSystem
Input: { type: 'water', resilient: true, capacity: 10000, currentProduction: 8000 }
Expected: compliant = true; missing = []
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `propertyRegimeSystem` | 1.0.0 | Roles y custodio |
| `mel-crm` | 1.0.0 | Indicadores de bienestar |
| `regenerative-agent` | 1.0.0 | LLM como enriquecedor |
| `boundaries` | 1.0.0 | Límites duros (no especulación) |

---

## 7. Referencias

- `docs/regenerative-neighborhood-rnmd_backup.md` — Documento completo RNMD
- RegenTribe: https://www.regentribe.org
- TribesPlatform: https://www.TribesPlatform.app
- `docs/regenerative-neighborhood-rnmd_integration.md` (EBD D21-D30)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: marco modular 4 capas, arquetipos, sistemas de recursos, red opt-in, LLM integrada |
