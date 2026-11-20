// src/core/lib/regen-knowledge-graph.ts
// Regen Knowledge Graph — AI Brain y Capa Semántica.
// Grafos tipados y recorribles con epistemic truth values.
// Lógica pura en TypeScript. No copia código de RegenTribe.

const PRECISION_SCALE = 1e18;

export interface TruthValue {
  level: number;              // 0-1
  method: 'llm-extraction' | 'human-verified' | 'vector-similarity' | 'community-consensus';
  confidence: number;         // 0-1
  lastUpdated: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'resource' | 'person' | 'neighborhood' | 'project' | 'document';
  properties: Record<string, unknown>;
  truthValue: TruthValue;
  source: string;
  timestamp: number;
}

export interface KnowledgeEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: 'uses' | 'produces' | 'depends-on' | 'located-in' | 'contributes-to' | 'similar-to';
  truthValue: TruthValue;
  weight: number;             // 0-1
  timestamp: number;
}

export interface KnowledgeGraph {
  nodes: Map<string, KnowledgeNode>;
  edges: Map<string, KnowledgeEdge>;
  history: Array<{ action: string; nodeId?: string; edgeId?: string; timestamp: number }>;
}

let kgIdCounter = 0;
function nextKgId(): string {
  kgIdCounter += 1;
  return `kg-${Date.now()}-${kgIdCounter}`;
}

/**
 * Crea un knowledge graph vacío.
 */
export function createKnowledgeGraph(): KnowledgeGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
    history: [],
  };
}

/**
 * Añade un nodo al grafo. Valida truthValue.level en [0,1].
 */
export function addKnowledgeNode(
  graph: KnowledgeGraph,
  node: Omit<KnowledgeNode, 'id'>,
): KnowledgeNode {
  if (node.truthValue.level < 0 || node.truthValue.level > 1) {
    throw new Error('regen-knowledge-graph: truthValue.level debe estar en [0,1]');
  }
  if (node.truthValue.confidence < 0 || node.truthValue.confidence > 1) {
    throw new Error('regen-knowledge-graph: truthValue.confidence debe estar en [0,1]');
  }

  const newNode: KnowledgeNode = {
    ...node,
    id: nextKgId(),
    timestamp: Date.now(),
  };
  graph.nodes.set(newNode.id, newNode);
  graph.history.push({ action: 'add-node', nodeId: newNode.id, timestamp: Date.now() });
  return newNode;
}

/**
 * Añade una arista entre dos nodos existentes.
 */
export function addKnowledgeEdge(
  graph: KnowledgeGraph,
  edge: Omit<KnowledgeEdge, 'id'>,
): KnowledgeEdge {
  if (!graph.nodes.has(edge.sourceNodeId)) {
    throw new Error(`regen-knowledge-graph: nodo origen no existe: ${edge.sourceNodeId}`);
  }
  if (!graph.nodes.has(edge.targetNodeId)) {
    throw new Error(`regen-knowledge-graph: nodo destino no existe: ${edge.targetNodeId}`);
  }
  if (edge.weight < 0 || edge.weight > 1) {
    throw new Error('regen-knowledge-graph: edge weight debe estar en [0,1]');
  }

  const newEdge: KnowledgeEdge = {
    ...edge,
    id: nextKgId(),
    timestamp: Date.now(),
  };
  graph.edges.set(newEdge.id, newEdge);
  graph.history.push({ action: 'add-edge', edgeId: newEdge.id, timestamp: Date.now() });
  return newEdge;
}

/**
 * Actualiza el valor de verdad epistémica de un nodo (inmutable, historial preservado).
 */
export function assignTruthValue(
  graph: KnowledgeGraph,
  nodeId: string,
  truthValue: TruthValue,
): boolean {
  const node = graph.nodes.get(nodeId);
  if (!node) return false;
  if (truthValue.level < 0 || truthValue.level > 1) {
    throw new Error('regen-knowledge-graph: truthValue.level debe estar en [0,1]');
  }

  const updated: KnowledgeNode = { ...node, truthValue, timestamp: Date.now() };
  graph.nodes.set(nodeId, updated);
  graph.history.push({
    action: 'assign-truth-value',
    nodeId,
    timestamp: Date.now(),
  });
  return true;
}

/**
 * Búsqueda semántica simplificada: score por solapamiento de etiquetas y propiedades.
 * Retorna nodos ordenados por relevancia, filtrados por umbral.
 */
export function semanticSearch(
  graph: KnowledgeGraph,
  query: string,
  threshold: number = 0.3,
): KnowledgeNode[] {
  const q = query.toLowerCase();
  const scored: Array<{ node: KnowledgeNode; score: number }> = [];

  for (const node of graph.nodes.values()) {
    let score = 0;
    const haystack = `${node.label} ${JSON.stringify(node.properties)}`.toLowerCase();
    const queryTerms = q.split(/\s+/).filter(Boolean);
    for (const term of queryTerms) {
      if (haystack.includes(term)) score += 1 / queryTerms.length;
    }
    // Ponderar por nivel de verdad epistémica
    score *= node.truthValue.level;
    if (score >= threshold) {
      scored.push({ node, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.node);
}

/**
 * Obtiene el historial inmutable del grafo.
 */
export function getGraphHistory(graph: KnowledgeGraph): Array<{ action: string; nodeId?: string; edgeId?: string; timestamp: number }> {
  return [...graph.history];
}
