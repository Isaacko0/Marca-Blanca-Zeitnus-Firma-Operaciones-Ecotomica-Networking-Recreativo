// openspec/specs/alrac-tq-regen-vision.md
// OpenSpec: Regen Vision — Visualización 3D de Conocimiento
// Mapas: force-directed graph de estructuras de conocimiento → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad)

# SPEC: alrac-tq-regen-vision
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe tech-stack (Regen Vision), docs/regen-tribe-org_backup.md
**Targets:** `src/core/lib/regen-vision.ts`, `src/core/state/regen-tribe.ts`

---

## 1. Arquitectura de visualización 3D

Regen Vision crea visualizaciones interactivas de grafos dirigidos por fuerza (force-directed graph) que hacen visibles las ideas, personas y conexiones del ecosistema regenerativo.

| Entidad | Atributos | Propósito |
|---------|-----------|-----------|
| GraphNode | id, label, type, position (x,y,z), size, color, truthValue | Nodo visualizable en 3D |
| GraphEdge | id, source, target, weight, relationshipType, color | Arista visualizable en 3D |
| GraphLayout | algorithm, iterations, temperature, nodes, edges | Configuración del layout force-directed |
| CameraView | position, target, zoom | Vista de cámara para navegación 3D |

---

## 2. Especificación técnica

### 2.1 Interfaz: `GraphNode`

```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'neighborhood' | 'project' | 'resource' | 'concept';
  position: { x: number; y: number; z: number };
  size: number;          // tamaño visual (0-1)
  color: string;         // código de color hex
  truthValue: number;    // 0-1, valor de verdad epistémica
}
```

### 2.2 Interfaz: `GraphEdge`

```typescript
interface GraphEdge {
  id: string;
  source: string;        // id del nodo origen
  target: string;        // id del nodo destino
  weight: number;        // 0-1, fuerza de la conexión
  relationshipType: string;
  color: string;
}
```

### 2.3 Función: `buildForceDirectedGraph(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): { graphNodes; graphEdges; layout }`

- Convierte nodos y aristas del knowledge graph en formato de visualización 3D.
- Aplica algoritmo force-directed para calcular posiciones (x, y, z).
- Retorna nodos y aristas con posiciones calculadas.

### 2.4 Función: `calculateLayout(nodes: GraphNode[], edges: GraphEdge[], iterations: number): GraphLayout`

- Ejecuta iteraciones del algoritmo force-directed para estabilizar posiciones.
- Retorna layout con temperatura final y nodos posicionados.

### 2.5 Función: `filterByTruthValue(nodes: GraphNode[], minTruth: number): GraphNode[]`

- Filtra nodos por valor de verdad epistémica mínima.
- Útil para mostrar solo conocimiento confirmado.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-regen-knowledge-graph` | Nodos y aristas del grafo son la fuente de datos para visualización 3D |
| `alrac-tq-mythogen-ame` | Campos de confianza y patrones de semilla se visualizan como nodos con capas BODY/FIELD/SEED |
| `alrac-tq-genesis-agent` | Specs de desarrollo generadas son nodos en la visualización |
| `currentSeeSystem.ts` | Las corrientes unificadas alimentan el grafo de visualización |
| `boundaries.ts` | DENY: visualización de conocimiento cerrado o truth values manipulados |

---

## 4. Criterios de aceptación

- [ ] `buildForceDirectedGraph()` convierte nodos y aristas con posiciones (x,y,z)
- [ ] `calculateLayout()` estabiliza posiciones tras N iteraciones
- [ ] `filterByTruthValue()` retorna solo nodos con truthValue >= umbral
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// buildForceDirectedGraph
Input: nodes=[{id:'n1',label:'TDF',type:'neighborhood'}], edges=[{id:'e1',source:'n1',target:'n2',weight:0.8}]
Expected: graphNodes con position {x,y,z}; graphEdges con weight y color
```

```typescript
// filterByTruthValue
Input: nodes=[{truthValue:0.9},{truthValue:0.3}], minTruth=0.5
Expected: solo el nodo con truthValue 0.9
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `regen-knowledge-graph` | 1.0.0 | Fuente de nodos y aristas |
| `mythogen-ame` | 1.0.0 | Campos de confianza como nodos visualizables |
| `boundaries` | 1.0.0 | Límites duros (no visualizar conocimiento cerrado) |

---

## 7. Referencias

- `docs/regen-tribe-org_backup.md` — Tech-Stack: Regen Vision
- `docs/regen-tribe-org_integration.md` (EBD D34)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: force-directed graph, filtrado por truth value, layout 3D |
