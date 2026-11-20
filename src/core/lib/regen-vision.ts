// src/core/lib/regen-vision.ts
// Regen Vision — Visualización 3D de Conocimiento.
// Force-directed graph de estructuras de conocimiento regenerativo.
// Lógica pura en TypeScript. No copia código de RegenTribe.

import type { KnowledgeNode, KnowledgeEdge } from './regen-knowledge-graph';

export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'neighborhood' | 'project' | 'resource' | 'concept';
  position: { x: number; y: number; z: number };
  size: number;           // 0-1
  color: string;          // hex
  truthValue: number;     // 0-1
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;         // 0-1
  relationshipType: string;
  color: string;
}

export interface GraphLayout {
  algorithm: 'force-directed';
  iterations: number;
  temperature: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const TYPE_COLORS: Record<string, string> = {
  person: '#4A90E2',
  neighborhood: '#50C878',
  project: '#F5A623',
  resource: '#9013FE',
  concept: '#D0021B',
};

function hashToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash & 0xFFFFFF;
  return `#${h.toString(16).padStart(6, '0')}`;
}

/**
 * Convierte nodos y aristas del knowledge graph en formato de visualización 3D.
 * Aplica algoritmo force-directed simplificado para calcular posiciones (x,y,z).
 */
export function buildForceDirectedGraph(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
): { graphNodes: GraphNode[]; graphEdges: GraphEdge[]; layout: GraphLayout } {
  const graphNodes: GraphNode[] = nodes.map((n, i) => ({
    id: n.id,
    label: n.label,
    type: n.type,
    position: {
      x: (i % 10) * 5 - 25,
      y: Math.floor(i / 10) * 5 - 25,
      z: 0,
    },
    size: Math.min(Math.max(n.truthValue, 0.1), 1),
    color: TYPE_COLORS[n.type] ?? hashToColor(n.id),
    truthValue: n.truthValue,
  }));

  const graphEdges: GraphEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
    weight: e.weight,
    relationshipType: e.relationshipType,
    color: e.weight > 0.5 ? '#4A90E2' : '#888888',
  }));

  const layout = calculateLayout(graphNodes, graphEdges, 50);

  return { graphNodes, graphEdges, layout };
}

/**
 * Ejecuta iteraciones del algoritmo force-directed para estabilizar posiciones.
 */
export function calculateLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  iterations: number = 50,
): GraphLayout {
  // Fuerza de repulsión simple entre nodos
  const repulsion = 100;
  const attraction = 0.1;
  let temperature = 1;

  const pos = new Map<string, { x: number; y: number; z: number }>();
  for (const node of nodes) {
    pos.set(node.id, { ...node.position });
  }

  for (let iter = 0; iter < iterations; iter++) {
    const displacement = new Map<string, { x: number; y: number; z: number }>();
    for (const node of nodes) {
      displacement.set(node.id, { x: 0, y: 0, z: 0 });
    }

    // Repulsión: todos los nodos se alejan entre sí
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = pos.get(nodes[i].id)!;
        const b = pos.get(nodes[j].id)!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const force = (repulsion * repulsion) / dist;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        const fz = (force * dz) / dist;
        const da = displacement.get(a)!;
        const db = displacement.get(b)!;
        da.x += fx; da.y += fy; da.z += fz;
        db.x -= fx; db.y -= fy; db.z -= fz;
      }
    }

    // Atracción: nodos conectados se acercan
    for (const edge of edges) {
      const a = pos.get(edge.source)!;
      const b = pos.get(edge.target)!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const force = (dist * dist) / repulsion * edge.weight * attraction;
      const fx = (force * dx) / dist;
      const fy = (force * dy) / dist;
      const fz = (force * dz) / dist;
      const da = displacement.get(a)!;
      const db = displacement.get(b)!;
      da.x -= fx; da.y -= fy; da.z -= fz;
      db.x += fx; db.y += fy; db.z += fz;
    }

    // Aplicar desplazamientos con temperatura
    for (const node of nodes) {
      const d = displacement.get(node.id)!;
      const p = pos.get(node.id)!;
      p.x += d.x * temperature;
      p.y += d.y * temperature;
      p.z += d.z * temperature;
    }

    temperature *= 0.95;
  }

  const graphNodes: GraphNode[] = nodes.map((n) => {
    const p = pos.get(n.id)!;
    return {
      ...n,
      position: { x: p.x, y: p.y, z: p.z },
    };
  });

  return {
    algorithm: 'force-directed',
    iterations,
    temperature,
    nodes: graphNodes,
    edges,
  };
}

/**
 * Filtra nodos por valor de verdad epistémica mínima.
 */
export function filterByTruthValue(
  nodes: GraphNode[],
  minTruth: number,
): GraphNode[] {
  return nodes.filter((n) => n.truthValue >= minTruth);
}
