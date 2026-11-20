// openspec/specs/alrac-tq-regen-knowledge-graph.md
// OpenSpec: Regen Knowledge Graph — AI Brain y Capa Semántica
// Mapas: knowledge graph con LLM extraction, vector embeddings, epistemic truth values → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-regen-knowledge-graph
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe tech-stack (Regen Knowledge Graph), docs/regen-tribe-org_backup.md
**Targets:** `src/core/lib/regen-knowledge-graph.ts`, `src/core/state/regen-tribe.ts`

---

## 1. Arquitectura del knowledge graph semántico

El knowledge graph transforma documentos comunitarios en un grafo tipado y recorrible. Cada concepto y relación tiene un valor de verdad epistémica (epistemic truth value) que indica su nivel de confirmación.

| Entidad | Atributos clave | Propósito |
|---------|----------------|-----------|
| KnowledgeNode | id, label, type, properties, truthValue, source, timestamp | Concepto, recurso, persona, barrio |
| KnowledgeEdge | id, sourceNodeId, targetNodeId, relationshipType, truthValue, weight, timestamp | Relación entre nodos |
| TruthValue | level (0-1), method (llm-extraction / human-verified / vector-similarity), confidence, lastUpdated | Nivel de confianza epistémica |
| SemanticQuery | query, embeddingVector, results, threshold | Búsqueda semántica por similitud |

---

## 2. Especificación técnica

### 2.1 Interfaz: `TruthValue`

```typescript
interface TruthValue {
  level: number;         // 0-1 (0 = no verificado, 1 = confirmado)
  method: 'llm-extraction' | 'human-verified' | 'vector-similarity' | 'community-consensus';
  confidence: number;    // 0-1
  lastUpdated: number;   // timestamp
}
```

### 2.2 Interfaz: `KnowledgeNode`

```typescript
interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'resource' | 'person' | 'neighborhood' | 'project' | 'document';
  properties: Record<string, unknown>;
  truthValue: TruthValue;
  source: string;        // RAO o URL de origen
  timestamp: number;
}
```

### 2.3 Interfaz: `KnowledgeEdge`

```typescript
interface KnowledgeEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: 'uses' | 'produces' | 'depends-on' | 'located-in' | 'contributes-to' | 'similar-to';
  truthValue: TruthValue;
  weight: number;        // 0-1, fuerza de la relación
  timestamp: number;
}
```

### 2.4 Función: `addKnowledgeNode(node: Omit<KnowledgeNode, 'id'>): KnowledgeNode`

- Crea un nodo con ID generado y timestamp.
- Valida que `truthValue.level` esté en [0,1].

### 2.5 Función: `addKnowledgeEdge(edge: Omit<KnowledgeEdge, 'id'>): KnowledgeEdge`

- Crea una arista entre dos nodos existentes.
- Valida que `sourceNodeId` y `targetNodeId` existan en el grafo.

### 2.6 Función: `semanticSearch(query: string, threshold: number): KnowledgeNode[]`

- Búsqueda semántica por similitud de vectores (implementación pura, sin dependencia de base de datos de vectores externa).
- Retorna nodos cuyo score de similitud supere el umbral.

### 2.7 Función: `assignTruthValue(nodeId: string, truthValue: TruthValue): boolean`

- Actualiza el valor de verdad epistémica de un nodo.
- Registra el cambio como inmutable (append-only en historial).

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-rnmd` (marco modular) | Los nodos del knowledge graph representan módulos RNMD y sus relaciones |
| `alrac-tq-mel-crm` (CRM MEL) | Los indicadores MEL son nodos en el grafo con relaciones de medición |
| `alrac-tq-governance-verification` (voto) | Las propuestas y votos son nodos con relaciones de gobernanza |
| `currentSeeSystem.ts` | Las corrientes unificadas incluyen nodos y aristas del knowledge graph |
| `boundaries.ts` | DENY: conocimiento cerrado, truth values manipulados sin evidencia |

---

## 4. Criterios de aceptación

- [ ] `addKnowledgeNode()` crea nodo con ID, timestamp y truthValue válido
- [ ] `addKnowledgeEdge()` valida que ambos nodos existan antes de crear arista
- [ ] `semanticSearch()` retorna nodos ordenados por relevancia, filtrados por umbral
- [ ] `assignTruthValue()` es inmutable (historial de cambios preservado)
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// addKnowledgeNode
Input: { label: 'TDF', type: 'neighborhood', properties: { location: 'Portugal' }, truthValue: { level: 0.9, method: 'human-verified', confidence: 0.95 } }
Expected: nodo creado con id, timestamp, truthValue.level = 0.9
```

```typescript
// semanticSearch
Input: query='agua resiliente', threshold=0.7
Expected: nodos relacionados con agua, ordenados por similitud, score >= 0.7
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `currentSeeSystem` | 1.0.0 | Corrientes unificadas para nodos del grafo |
| `boundaries` | 1.0.0 | Límites duros (no conocimiento cerrado) |

---

## 7. Referencias

- `docs/regen-tribe-org_backup.md` — Tech-Stack: Regen Knowledge Graph
- `docs/regen-tribe-org_integration.md` (EBD D31, D44)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: knowledge graph semántico, epistemic truth values, búsqueda semántica |
