// openspec/specs/alrac-tq-regenerative-agent.md
// OpenSpec: Agente Regenerativo (OASA Agent)
// Mapas: MemorySystem, TranslationLayer, DomainOrchestrator, LLMService → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-regenerative-agent
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** closerdao/oasa-agent (index.js, server.js, llm-service.js, llm-integration.js)
**Targets:** `src/core/lib/regenerative-agent.ts`, `src/core/state/agent.ts`

---

## 1. Arquitectura del agente regenerativo

Un agente autónomo que responde consultas sobre sistemas ecológicos y de gobernanza, con memoria persistente por dominio, patrón temporal, y LLM como enriquecedor (no sustituto de lógica).

| Componente | Responsabilidad | Fuente |
|------------|-----------------|--------|
| MemorySystem | Almacenamiento unificado por dominio, patrones temporales, memoria episódica, conocimiento indígena | `index.js` `MemorySystem` |
| TranslationLayer | Detección de dominio por keywords, formateo, traducción de datos de sensores | `index.js` `TranslationLayer` |
| DomainOrchestrator | Registro de dominios, integración multi-dominio, resolución de conflictos, registro de episodios | `index.js` `DomainOrchestrator` |
| LLMService | Llamada a LLM (OpenAI/Anthropic), prompts por dominio, resolución de conflictos vía LLM | `llm-service.js` `LLMService` |

---

## 2. Especificación técnica

### 2.1 Interfaz: `DomainMemory`

```typescript
interface DomainMemory {
  unifiedKnowledgeStore: Record<string, Record<string, { value: unknown; timestamp: number; temporalContext?: unknown }>>
  temporalPatterns: Record<string, { pattern: unknown[]; duration: number; description: string }>
  episodicMemory: Array<{ action: string; domains: string[]; outcome: unknown; timestamp: number }>
  indigenousKnowledge: Record<string, unknown>
}
```

### 2.2 Función: `storeKnowledge(domain, key, value, temporalContext?)`

- Almacena valor con timestamp y contexto temporal opcional.

### 2.3 Función: `retrieveKnowledge(domain, key, temporalContext?)`

- Recupera valor; si hay contexto temporal y no coincide, retorna advertencia.

### 2.4 Función: `recordEpisode(action, domains, outcome, timestamp?)`

- Registra interacción/decision en memoria episódica.

### 2.5 Función: `registerTemporalPattern(name, pattern, duration, description)`

- Registra patrón de ciclo natural (ej. seasonal_cycle, diurnal_cycle).

### 2.6 Interfaz: `TranslationLayer`

```typescript
interface TranslationLayerResult {
  message: string
  insights: unknown[]
  recommendations: unknown[]
  domains: string[]
  timestamp: number
}
```

### 2.7 Función: `detectRelevantDomains(query): string[]`

- Detección por keywords: water/river/lake/rain → water; species/biodiversity/ecosystem/forest → biodiversity; decision/governance/stakeholder/community → governance; finance/investment/economic/capital → financial.
- Si no hay coincidencia, retorna todos los dominios.

### 2.8 Función: `processQuery(query, environmentalContext): TranslationLayerResult`

- Detecta dominios, procesa por DomainOrchestrator, formatea respuesta.

### 2.9 Función: `integrateDomainResponses(domainResponses): IntegratedResponse`

- Integra insights y recomendaciones de múltiples dominios.
- Detecta conflictos entre recomendaciones (ej. agua vs biodiversidad).
- Resuelve conflictos por prioridad (más alta gana).
- Ordena recomendaciones por prioridad descendente.

### 2.10 Reglas duras

- LLM es enriquecedor, nunca sustituto de lógica determinística.
- Memoria episódica es inmutable post-registro (append-only).
- Contextos temporales validan relevancia (estaciones, ciclos).

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-tdf` (gobernanza) | El agente puede responder consultas de gobernanza (dominio `governance`) |
| `alrac-tq-land` (registro tierra) | El agente interpreta datos de sensores de tierra (dominio `water`, `biodiversity`) |
| `alrac-tq-economia-comunes` | El agente responde consultas económicas del común (dominio `financial`) |
| `boundaries.ts` | El agente no puede recomendar acciones que vulneren límites duros (no extracción) |

---

## 4. Criterios de aceptación

- [ ] `storeKnowledge` / `retrieveKnowledge` funcionan por dominio con contexto temporal
- [ ] `detectRelevantDomains` clasifica queries correctamente
- [ ] `integrateDomainResponses` une insights de múltiples dominios
- [ ] Conflictos se resuelven por prioridad y se ordenan
- [ ] `recordEpisode` es append-only (inmutable)
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// store/retrieve knowledge
Input: storeKnowledge('water', 'ph_level', 7.2, {season: 'verano'})
Expected: retrieveKnowledge('water', 'ph_level', {season: 'verano'}) === 7.2
```

```typescript
// detect domains
Input: "¿Cómo está la calidad del agua del río?"
Expected: domains includes 'water'
```

```typescript
// integrate responses
Input: {water: {insights:['pH bajo'], recommendations:[{domain:'water', content:{text:'revisar', priority:3}}]}, biodiversity: {insights:[], recommendations:[{domain:'biodiversity', content:{text:'proteger', priority:5}}]}}
Expected: recommendations ordenadas: biodiversidad (5) antes que agua (3)
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `boundaries` | 1.0.0 | Límites duros (no recomendar extracción) |

---

## 7. Referencias

- `closerdao/oasa-agent/index.js`: https://github.com/closerdao/oasa-agent/blob/main/index.js
- `closerdao/oasa-agent/server.js`: https://github.com/closerdao/oasa-agent/blob/main/server.js
- `closerdao/oasa-agent/llm-service.js`: https://github.com/closerdao/oasa-agent/blob/main/llm-service.js
- `docs/oasa-tdf-governance-stack_integration.md` (EBD D17)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-19 | Propuesta inicial: agente regenerativo, memoria por dominio, LLM, conflictos |
