# Renta Compartida Exponencial (RCE) — Documento de Arquitectura

**Basado en**: Sistema Virginia Network + WhatMatters (Inteligencia Exponencial)  
**Fuente video**: https://www.youtube.com/watch?v=-atoASIq_Gw (Virginia Barco, 2026-07-27)  
**Hash**: `sha256:rce-virginia-whatmatters-2026-07-27`  
**Fecha**: 2026-11-03  
**Cluster**: Economía Colaborativa Exponencial, Gobernanza Algorítmica, Renta Ganada  
**Principio**: Anfibio (Postmonetario ZNU/CaaS ↔ Conectado USD/USDC vía priceParity)

---

## Resumen Ejecutivo

**Renta Compartida Exponencial (RCE)** = Nueva primitiva económica que fusiona:
1. **Virginia Network** (red de colaboración verificada, protocolo IE, árbol de coordinación)
2. **WhatMatters** (plataforma de coordinación masiva, hitos colaborativos, renta ganada)
3. **HSCSG v15 OS** (Principio Anfibio, CaaS/ZNU, gobernanza CDS, contabilidad triple RBE)

**Definición**: La RCE es un **ingreso ganado por resolución colaborativa de desafíos** (no subsidio pasivo), distribuido vía protocolo **Inteligencia Exponencial (IE)** sobre estructura arbórea 3→2 (cada nodo suma 2), con verificación IA+humana y distribución por posición en árbol.

**Diferencia clave vs UBI/RBI**: 
- UBI = subsidio pasivo, incondicional, estatal
- RBI (Renta Básica Exponencial) = dividendo por AUT, postmonetario
- **RCE = ingreso ganado por resolución colaborativa verificada**, protocolo IE, descentralizado

---

## 1. Fundamentos Teóricos (Virginia + WhatMatters)

### 1.1 Protocolo Inteligencia Exponencial (IE) — Virginia/WhatMatters

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **Semilla** | 3 personas | Grupo base de colaboración |
| **Factor crecimiento** | ×3 (cada uno suma 2) | 3 → 9 → 27 → 81 → 243 → 729... |
| **Paso 5** | 243 personas | Escala local/barrial |
| **Paso 10** | ~59,049 personas | Escala ciudad/estadio |
| **Paso 15** | ~14.3M personas | Escala nacional |
| **Paso 20** | ~3.4B personas | Escala planetaria (mitad población) |

**Fórmula**: `N(paso) = 3^paso` | `Total_acumulado(paso) = (3^(paso+1) - 3) / 2`

### 1.2 Estructura Arbórea (Árbol IE)

```
                    ┌─ Participante (hoja)
                    │
            ┌─ Nivel 1 (coordinador) ← Recompensa extra (verificación IA + soporte)
            │   ├─── Participante
            │   └── Participante
    ┌─ Nivel 2 (coordinador superior)
    │   ├─── Nivel 1
    │   └── Nivel 1
Raíz (tronco) ← Resultados agregados, certificación WhatMatters
```

**Reglas de coordinación**:
- Cada grupo de 3 acuerda **hitos** para obtener recompensa
- Coordinadores (ramas) verifican trabajo IA + presentan resultados al tronco
- WhatMatters certifica coordinación y aportes
- Recompensa = **Renta Compartida Exponencial** (no UBI)

### 1.3 Película IRE (Inteligencia Exponencial Relatada)

- Narrativa transmedia: cómo se alcanza nivel 20 por primera vez
- Desafíos abordados: cambio climático, salud mental laboral
- QR final → invitación a unirse al equipo activo
- Función: **onboarding narrativo masivo** → conversión a plataforma

---

## 2. Arquitectura RCE en HSCSG v15 OS

### 2.1 Mapeo a Vasos Comunicantes Existentes

| Concepto RCE | → Módulo HSCSG | Vaso Comunicante |
|--------------|----------------|------------------|
| **Protocolo IE (3→2)** | `virginia.network` | `virginia.ieProtocol` |
| **Árbol coordinación** | `virginia.tree` | `virginia.coordinationTree` |
| **Hitos colaborativos** | `virginia.milestones` | `virginia.collaborativeMilestones` |
| **Verificación IA+humana** | `virginia.verification` | `virginia.aiHumanVerification` |
| **Renta Compartida Exponencial** | `rbe.rce` | `rbe.distributeRCE` |
| **Certificación WhatMatters** | `poh.verification` | `poh.certifyCollaboration` |
| **Película IRE / Onboarding** | `contenido.captureIdea` + `story.engine` | `createStoryProject` |
| **Coordinadores (ramas)** | `caas.caasMembers` | `caas.addCoordinator` |
| **Recompensa extra coordinadores** | `caas.caasPayouts` | `caas.coordinatorBonus` |
| **Gobernanza árbol IE** | `delegacion` + `democracia` (CDS) | `delegacion.addDelegate` |
| **Contabilidad triple RCE** | `rbe` (3 presupuestos) | `rbe.raiseIntegralIssue` |
| **Financiamiento anfibio** | `caas` + `zeitnus` | `caas.setCaasStream` + `priceParity` |

### 2.2 Flujo RCE (End-to-End)

```
1. ONBOARDING IRE
   Usuario ve película IRE → QR → WhatMatters.pro → Crea perfil → Poh verification

2. FORMACIÓN GRUPO BASE (Semilla IE)
   3 personas se agrupan → Acuerdan desafío + hitos → Crean nodo IE nivel 0

3. EXPANSIÓN EXPONENCIAL (IE 3→2)
   Cada miembro recluta 2 → Grupos de 3 → Nivel 1 coordinador emerge
   Coordinador verifica IA + soporta rama → Recompensa extra (10-20%)

4. ACUERDO HITOS COLABORATIVOS
   Cada grupo de 3 define: qué, cuándo, cómo, métricas
   WhatMatters certifica acuerdo → Almacena en Poh/RAO

5. EJECUCIÓN Y VERIFICACIÓN
   IA monitorea progreso hitos → Coordinador valida → Humano audita muestra
   Resultado → Subido a tronco (raíz árbol)

6. DISTRIBUCIÓN RCE
   Renta = f(posición árbol, hitos cumplidos, verificación, coordinación)
   Modo anfibio: ZNU (postmonetario) + USD/USDC (conectado via priceParity)

7. REINVERSIÓN Y ESCALADO
   RCE ganada → Puede reinvertirse en nuevos desafíos (compound IE)
   Nivel 20 → Escala planetaria → Desafíos globales (clima, salud mental)
```

### 2.3 Fórmula RCE (Distribución por Árbol)

```
RCE_total(desafío) = Pool_financiamiento × Factor_éxito

Para cada nodo i en árbol:
  RCE_i = RCE_total × Peso_posición(i) × Factor_hitos(i) × Factor_verificación(i)

Donde:
  Peso_posición(hoja) = 1.0
  Peso_posición(coordinador_nivel_k) = 1.0 + 0.15 × k  (bonus 15% por nivel)
  Peso_posición(raíz) = 0 (solo agrega, no recibe)

  Factor_hitos(i) = Hitos_cumplidos(i) / Hitos_totales(i)  [0-1]
  Factor_verificación(i) = 1.0 si verificado IA+humano, 0.5 si solo IA, 0 si rechazado

Pool_financiamiento = 
  Modo postmonetario: CaaS_streams (suscripción ZNU) + revenue_share_AUT
  Modo conectado: Green bonds + land_value_capture + payment_ecosystem_services
```

---

## 3. Tipos de Datos (TypeScript)

```typescript
// src/core/lib/rce-types.ts

export type IEProtocolStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export type IENodeRole = 'leaf' | 'coordinator' | 'root';

export type IENode = {
  id: string;                    // poh://did/...
  personId: string;              // Poh DID
  role: IENodeRole;
  level: number;                 // 0 = hoja, 1..20 = coordinador, 21 = raíz
  parentId?: string;             // Padre en árbol (null si raíz)
  childrenIds: string[];         // Hijos (max 2 para hojas, 3 para coordinadores)
  challengeId: string;           // Desafío asociado
  milestones: IEMilestone[];     // Hitos acordados
  verificationStatus: 'pending' | 'ai_verified' | 'human_verified' | 'rejected';
  aiVerificationScore: number;   // 0-1
  humanAuditSample: boolean;     // Muestreo aleatorio auditoría
  rceEarned: number;             // RCE ganada (ZNU/USD)
  rcePending: number;            // Pendiente verificación
  createdAt: number;
  updatedAt: number;
};

export type IEMilestone = {
  id: string;
  description: string;
  metric: string;                // Métrica medible (ej: "toneladas CO2 capturadas")
  target: number;
  current: number;
  deadline: number;              // Unix timestamp
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  verifiedBy: 'ai' | 'human' | 'both';
  evidenceHash: string;          // IPFS/Arweave hash evidencia
};

export type IEChallenge = {
  id: string;
  title: string;
  description: string;
  category: 'climate' | 'mental_health' | 'education' | 'employment' | 'social_security' | 'other';
  scope: 'local' | 'regional' | 'national' | 'global';
  treeRootId: string;            // Raíz árbol IE para este desafío
  totalParticipants: number;
  currentStep: IEProtocolStep;
  fundingPool: IEFundingPool;
  status: 'forming' | 'active' | 'completed' | 'archived';
  ireMovieQR?: string;           // Link película IRE + QR onboarding
  createdAt: number;
  updatedAt: number;
};

export type IEFundingPool = {
  postmonetario: {               // ZNU/CaaS
    znuAmount: number;
    caasStreams: string[];       // ['suscripcion', 'revenue_share', ...]
    priceParity: number;         // ZNU/USD oráculo
  };
  conectado: {                   // USD/USDC
    usdAmount: number;
    greenBonds: number;
    landValueCapture: number;
    paymentEcosystemServices: number;
  };
  totalUSD: number;              // Valor total unificado
  distributionRules: IEDistributionRules;
};

export type IEDistributionRules = {
  leafBaseWeight: number;           // 1.0
  coordinatorBonusPerLevel: number; // 0.15 (15% por nivel)
  rootWeight: number;               // 0.0
  milestoneCompletionFactor: boolean;
  verificationMultiplier: {         // 1.0 / 0.5 / 0.0
    aiOnly: number;
    humanVerified: number;
    rejected: number;
  };
  coordinatorExtraReward: number;   // 0.1-0.2 (10-20% extra)
};

export type RCEState = {
  // Estado global RCE en HSCSG
  challenges: Record<string, IEChallenge>;
  nodes: Record<string, IENode>;        // Todos los nodos IE (indexados por DID)
  trees: Record<string, IETree>;        // Árboles por desafío
  fundingPools: Record<string, IEFundingPool>;
  distributions: RCEDistribution[];     // Historial pagos RCE
  ireMovies: IREMovie[];                // Películas IRE producidas
  pohCertifications: PohCertification[];// Certificaciones WhatMatters
  globalMetrics: RCEGlobalMetrics;
};

export type IETree = {
  challengeId: string;
  rootId: string;                    // Nodo raíz (tronco)
  maxDepth: number;                  // Paso actual IE
  totalNodes: number;
  activeLeaves: number;
  coordinatorsByLevel: Record<number, number>;
  totalRCEDistributed: number;
  completionRate: number;            // % hitos completados
};

export type RCEDistribution = {
  id: string;
  challengeId: string;
  nodeId: string;
  amountZNU: number;
  amountUSD: number;
  period: { start: number; end: number };
  reason: 'milestone_completion' | 'coordinator_bonus' | 'verification_reward' | 'tree_completion';
  status: 'pending' | 'paid' | 'failed';
  txHash?: string;                   // Blockchain tx (modo conectado)
  createdAt: number;
};

export type IREMovie = {
  id: string;
  title: string;
  challengeIds: string[];            // Desafíos que aborda
  levelReached: IEProtocolStep;      // Nivel IE que narra
  qrCode: string;                    // QR onboarding WhatMatters
  viewers: number;
  conversions: number;               // Viewers → usuarios activos
  releaseDate: number;
  status: 'production' | 'released' | 'archived';
};

export type PohCertification = {
  did: string;
  challengeId: string;
  certificationType: 'collaboration' | 'coordination' | 'verification' | 'milestone_completion';
  level: IEProtocolStep;
  issuedAt: number;
  expiresAt?: number;
  evidenceHash: string;
};

export type RCEGlobalMetrics = {
  totalActiveChallenges: number;
  totalParticipants: number;
  totalRCEDistributedZNU: number;
  totalRCEDistributedUSD: number;
  avgTreeDepth: number;
  coordinatorRatio: number;          // coordinadores / participantes
  verificationRate: number;          // % nodos verificados humano
  challengeCompletionRate: number;   // % desafíos completados
  ireMovieConversions: number;       // viewers → participantes
};
```

---

## 4. Funciones Puras (Lógica RCE)

```typescript
// src/core/lib/rce.ts

import type { ... } from './rce-types';

/**
 * Calcula distribución RCE para un árbol IE completo
 */
export function calculateRCEDistribution(
  tree: IETree,
  nodes: Record<string, IENode>,
  fundingPool: IEFundingPool,
  rules: IEDistributionRules
): RCEDistribution[] {
  const distributions: RCEDistribution[] = [];
  const poolUSD = fundingPool.totalUSD;
  
  // Recorrer árbol post-order (hojas → raíz)
  const nodesSorted = topologicalSort(tree, nodes);
  
  for (const nodeId of nodesSorted) {
    const node = nodes[nodeId];
    if (node.role === 'root') continue; // Raíz no recibe
    
    const positionWeight = calculatePositionWeight(node, rules);
    const milestoneFactor = calculateMilestoneFactor(node);
    const verificationFactor = calculateVerificationFactor(node);
    
    const share = poolUSD * positionWeight * milestoneFactor * verificationFactor;
    const shareZNU = share / fundingPool.postmonetario.priceParity;
    
    // Bonus coordinador
    let coordinatorBonus = 0;
    if (node.role === 'coordinator') {
      coordinatorBonus = share * rules.coordinatorExtraReward;
    }
    
    const totalUSD = share + coordinatorBonus;
    const totalZNU = shareZNU + coordinatorBonus / fundingPool.postmonetario.priceParity;
    
    distributions.push({
      id: `rce_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      challengeId: node.challengeId,
      nodeId: node.id,
      amountZNU: totalZNU,
      amountUSD: totalUSD,
      period: { start: node.updatedAt - 86400000, end: node.updatedAt }, // último día
      reason: node.role === 'coordinator' ? 'coordinator_bonus' : 'milestone_completion',
      status: 'pending',
      createdAt: Date.now(),
    });
  }
  
  return distributions;
}

function calculatePositionWeight(node: IENode, rules: IEDistributionRules): number {
  if (node.role === 'leaf') return rules.leafBaseWeight;
  if (node.role === 'coordinator') return rules.leafBaseWeight + rules.coordinatorBonusPerLevel * node.level;
  return rules.rootWeight;
}

function calculateMilestoneFactor(node: IENode): number {
  if (node.milestones.length === 0) return 0;
  const completed = node.milestones.filter(m => m.status === 'completed').length;
  return completed / node.milestones.length;
}

function calculateVerificationFactor(node: IENode, rules: IEDistributionRules): number {
  switch (node.verificationStatus) {
    case 'human_verified': return rules.verificationMultiplier.humanVerified;
    case 'ai_verified': return rules.verificationMultiplier.aiOnly;
    case 'rejected': return rules.verificationMultiplier.rejected;
    default: return 0; // pending
  }
}

function topologicalSort(tree: IETree, nodes: Record<string, IENode>): string[] {
  // Post-order: hojas primero, luego coordinadores, último raíz
  const visited = new Set<string>();
  const result: string[] = [];
  
  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = nodes[nodeId];
    for (const childId of node.childrenIds) visit(childId);
    result.push(nodeId);
  }
  
  visit(tree.rootId);
  return result;
}

/**
 * Simula crecimiento IE para proyección de escalado
 */
export function simulateIEGrowth(
  initialGroups: number,
  maxSteps: IEProtocolStep
): { step: IEProtocolStep; newNodes: number; cumulative: number; coordinators: number }[] {
  const results = [];
  let cumulative = initialGroups * 3; // paso 0: 3 por grupo
  let coordinators = 0;
  
  for (let step = 0; step <= maxSteps; step++) {
    if (step === 0) {
      results.push({ step: 0, newNodes: cumulative, cumulative, coordinators: 0 });
      continue;
    }
    
    // Cada nodo activo (hojas + coordinadores) suma 2
    const activeNodes = cumulative - coordinators; // solo hojas reclutan
    const newNodes = activeNodes * 2;
    cumulative += newNodes;
    
    // Nuevos coordinadores emergen cada 3 hojas (aprox)
    const newCoordinators = Math.floor(newNodes / 3);
    coordinators += newCoordinators;
    
    results.push({ step, newNodes, cumulative, coordinators });
  }
  
  return results;
}

/**
 * Valida estructura árbol IE (invariantes)
 */
export function validateIETree(tree: IETree, nodes: Record<string, IENode>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 1. Raíz existe
  if (!nodes[tree.rootId]) errors.push('Root node not found');
  
  // 2. Cada nodo (excepto raíz) tiene padre
  for (const [id, node] of Object.entries(nodes)) {
    if (id !== tree.rootId && !node.parentId) {
      errors.push(`Node ${id} has no parent`);
    }
  }
  
  // 3. Hijos consistentes
  for (const [id, node] of Object.entries(nodes)) {
    for (const childId of node.childrenIds) {
      const child = nodes[childId];
      if (!child) errors.push(`Child ${childId} of ${id} not found`);
      else if (child.parentId !== id) errors.push(`Child ${childId} parent mismatch`);
    }
  }
  
  // 4. Factor 3→2: cada nodo (excepto raíz) tiene 1 padre + max 2 hijos (hojas) o 3 (coordinador)
  for (const [id, node] of Object.entries(nodes)) {
    const maxChildren = node.role === 'coordinator' ? 3 : 2;
    if (node.childrenIds.length > maxChildren) {
      errors.push(`Node ${id} has ${node.childrenIds.length} children, max ${maxChildren} for role ${node.role}`);
    }
  }
  
  // 5. Profundidad coherente con step
  const maxDepth = Math.max(...Object.values(nodes).map(n => n.level));
  if (maxDepth !== tree.maxDepth) {
    errors.push(`Tree maxDepth ${tree.maxDepth} != actual max level ${maxDepth}`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Calcula métricas de salud del árbol IE
 */
export function calculateIETreeHealth(tree: IETree, nodes: Record<string, IENode>): {
  completionRate: number;
  verificationRate: number;
  coordinatorEfficiency: number;
  fundingUtilization: number;
  growthVelocity: number;
} {
  const allNodes = Object.values(nodes);
  const leaves = allNodes.filter(n => n.role === 'leaf');
  const coordinators = allNodes.filter(n => n.role === 'coordinator');
  
  // Completion rate: hitos completados / totales
  const totalMilestones = allNodes.reduce((sum, n) => sum + n.milestones.length, 0);
  const completedMilestones = allNodes.reduce((sum, n) => 
    sum + n.milestones.filter(m => m.status === 'completed').length, 0);
  const completionRate = totalMilestones > 0 ? completedMilestones / totalMilestones : 0;
  
  // Verification rate: % nodos verificado humano
  const humanVerified = allNodes.filter(n => n.verificationStatus === 'human_verified').length;
  const verificationRate = allNodes.length > 0 ? humanVerified / allNodes.length : 0;
  
  // Coordinator efficiency: hitos coordinados / coordinadores
  const coordinatedMilestones = coordinators.reduce((sum, c) => 
    sum + c.milestones.filter(m => m.status === 'completed').length, 0);
  const coordinatorEfficiency = coordinators.length > 0 ? coordinatedMilestones / coordinators.length : 0;
  
  // Funding utilization: RCE distribuido / pool
  // (requiere funding pool - placeholder)
  const fundingUtilization = 0.5;
  
  // Growth velocity: nuevos nodos por día (últimos 30 días)
  const recentNodes = allNodes.filter(n => n.createdAt > Date.now() - 30*86400000).length;
  const growthVelocity = recentNodes / 30;
  
  return { completionRate, verificationRate, coordinatorEfficiency, fundingUtilization, growthVelocity };
}
```

---

## 5. Estado y Hooks (Zustand)

```typescript
// src/core/state/rce.ts
import type { RCEState, IEChallenge, IENode, IEMilestone, IEChallenge, IEProtocolStep, ... } from '@core/lib/rce-types';

export const INITIAL_RCE_STATE: RCEState = {
  challenges: {},
  nodes: {},
  trees: {},
  fundingPools: {},
  distributions: [],
  ireMovies: [],
  pohCertifications: [],
  globalMetrics: {
    totalActiveChallenges: 0,
    totalParticipants: 0,
    totalRCEDistributedZNU: 0,
    totalRCEDistributedUSD: 0,
    avgTreeDepth: 0,
    coordinatorRatio: 0,
    verificationRate: 0,
    challengeCompletionRate: 0,
    ireMovieConversions: 0,
  },
};

export const RCE_STORAGE_KEY = 'rce_v1';
export const RCE_ACHIEVEMENTS = [
  { id: 'first_group', name: 'Semilla IE', description: 'Primer grupo de 3 formado', icon: '🌱', threshold: 1 },
  { id: 'step_5', name: 'Nivel 5 Alcanzado', description: '243 personas coordinadas', icon: '🌳', threshold: 1 },
  { id: 'step_10', name: 'Estadio Lleno', description: '60,000 personas', icon: '🏟️', threshold: 1 },
  { id: 'coordinator', name: 'Coordinador IE', description: 'Primera vez como rama', icon: '🌿', threshold: 1 },
  { id: 'rce_earned', name: 'Primera RCE', description: 'Ingreso ganado colaborando', icon: '💰', threshold: 1 },
  { id: 'tree_complete', name: 'Desafío Resuelto', description: 'Árbol IE completo', icon: '✅', threshold: 1 },
  { id: 'ire_viewer', name: 'Espectador IRE', description: 'Vio película completa', icon: '🎬', threshold: 1 },
];

// src/core/state/hooks/rce.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_RCE_STATE, RCE_STORAGE_KEY, RCE_ACHIEVEMENTS } from '@core/state/rce';
import { calculateRCEDistribution, simulateIEGrowth, validateIETree, calculateIETreeHealth } from '@core/lib/rce';

export const useRCEStore = create<RCEState & RCActions>()(
  persist((set, get) => ({
    ...INITIAL_RCE_STATE,
    
    // Challenges
    createChallenge: (challenge: Omit<IEChallenge, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = `ch_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const newChallenge = { ...challenge, id, createdAt: Date.now(), updatedAt: Date.now() };
      set(s => ({ challenges: { ...s.challenges, [id]: newChallenge }, updatedAt: Date.now() }));
      return newChallenge;
    },
    
    // IE Nodes (participantes)
    addNode: (node: Omit<IENode, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = `node_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const newNode = { ...node, id, createdAt: Date.now(), updatedAt: Date.now() };
      set(s => ({ nodes: { ...s.nodes, [id]: newNode }, updatedAt: Date.now() }));
      return newNode;
    },
    
    updateNodeMilestone: (nodeId: string, milestoneId: string, updates: Partial<IEMilestone>) =>
      set(s => ({
        nodes: { ...s.nodes, [nodeId]: { 
          ...s.nodes[nodeId], 
          milestones: s.nodes[nodeId].milestones.map(m => m.id === milestoneId ? { ...m, ...updates } : m),
          updatedAt: Date.now()
        }},
        updatedAt: Date.now(),
      })),
    
    // Verification
    verifyNode: (nodeId: string, status: 'ai_verified' | 'human_verified' | 'rejected', aiScore?: number) =>
      set(s => ({
        nodes: { ...s.nodes, [nodeId]: { 
          ...s.nodes[nodeId], 
          verificationStatus: status,
          aiVerificationScore: aiScore ?? s.nodes[nodeId].aiVerificationScore,
          updatedAt: Date.now()
        }},
        updatedAt: Date.now(),
      })),
    
    // RCE Distribution
    distributeRCE: (challengeId: string) => {
      const { challenges, nodes, trees, fundingPools } = get();
      const challenge = challenges[challengeId];
      const tree = trees[challengeId];
      const pool = fundingPools[challengeId];
      if (!challenge || !tree || !pool) return [];
      
      const distributions = calculateRCEDistribution(tree, nodes, pool, pool.distributionRules);
      
      set(s => ({
        distributions: [...s.distributions, ...distributions],
        globalMetrics: {
          ...s.globalMetrics,
          totalRCEDistributedUSD: s.globalMetrics.totalRCEDistributedUSD + distributions.reduce((sum, d) => sum + d.amountUSD, 0),
          totalRCEDistributedZNU: s.globalMetrics.totalRCEDistributedZNU + distributions.reduce((sum, d) => sum + d.amountZNU, 0),
        },
        updatedAt: Date.now(),
      }));
      return distributions;
    },
    
    // IRE Movie
    addIREMovie: (movie: Omit<IREMovie, 'id' | 'viewers' | 'conversions' | 'createdAt'>) => {
      const id = `ire_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const newMovie = { ...movie, id, viewers: 0, conversions: 0, createdAt: Date.now() };
      set(s => ({ ireMovies: [...s.ireMovies, newMovie], updatedAt: Date.now() }));
      return newMovie;
    },
    
    recordIREConversion: (movieId: string) =>
      set(s => ({
        ireMovies: s.ireMovies.map(m => m.id === movieId ? { ...m, viewers: m.viewers + 1, conversions: m.conversions + 1 } : m),
        globalMetrics: { ...get().globalMetrics, ireMovieConversions: get().globalMetrics.ireMovieConversions + 1 },
      })),
    
    // Poh Certification
    certifyCollaboration: (cert: Omit<PohCertification, 'issuedAt'>) => {
      const newCert = { ...cert, issuedAt: Date.now() };
      set(s => ({ pohCertifications: [...s.pohCertifications, newCert], updatedAt: Date.now() }));
    },
    
    // Tree Health
    recalculateTreeHealth: (challengeId: string) => {
      const { trees, nodes } = get();
      const tree = trees[challengeId];
      if (!tree) return;
      const health = calculateIETreeHealth(tree, nodes);
      set(s => ({
        trees: { ...s.trees, [challengeId]: { ...tree, ...health } },
        updatedAt: Date.now(),
      }));
    },
    
    // IE Growth Simulation
    simulateGrowth: (initialGroups: number, maxSteps: IEProtocolStep) => simulateIEGrowth(initialGroups, maxSteps),
    
    // Validation
    validateTree: (challengeId: string) => {
      const { trees, nodes } = get();
      return validateIETree(trees[challengeId], nodes);
    },
    
    // Reset
    reset: () => set(INITIAL_RCE_STATE),
  })),
  {
    name: RCE_STORAGE_KEY,
    storage: createJSONStorage(() => localStorage),
    partialize: (s) => ({
      challenges: s.challenges,
      nodes: s.nodes,
      trees: s.trees,
      fundingPools: s.fundingPools,
      distributions: s.distributions.slice(-1000),
      ireMovies: s.ireMovies,
      pohCertifications: s.pohCertifications,
      globalMetrics: s.globalMetrics,
    }),
    version: 1,
  })
);
```

---

## 6. Pantallas (React/TSX)

### 6.1 RCEDashboard.tsx — Dashboard Principal
```tsx
// src/app/screens/RCEDashboard.tsx
// Métricas globales: desafíos activos, participantes, RCE distribuida, salud árboles, conversiones IRE
// Gráficos: crecimiento IE (3^n), distribución RCE por árbol, health score
// Acciones rápidas: nuevo desafío, ver árbol, simular crecimiento
```

### 6.2 RCEChallengeTree.tsx — Visualizador Árbol IE
```tsx
// src/app/screens/RCEChallengeTree.tsx
// D3.js/React-flow: visualización interactiva árbol IE
// Nodos coloreados por rol (hoja/coordinador/raíz) y verificación
// Click nodo → detalle hitos, verificación, RCE ganada
// Zoom/pan, filtro por nivel, búsqueda por DID
```

### 6.3 RCEMilestoneBuilder.tsx — Constructor Hitos
```tsx
// src/app/screens/RCEMilestoneBuilder.tsx
// Interfaz para grupos de 3: definir hitos, métricas, deadlines
// Plantillas por categoría (clima, salud mental, educación)
// Validación IA tiempo real: "¿Es medible? ¿Es alcanzable?"
```

### 6.4 RCEVerification.tsx — Verificación IA+Humana
```tsx
// src/app/screens/RCEVerification.tsx
// Dashboard coordinadores: cola verificación, muestreo aleatorio
// IA muestra evidencia + score → coordinador aprueba/rechaza
// Auditoría humana: muestreo aleatorio 10%, doble verificación
```

### 6.5 RCEIREOnboarding.tsx — Onboarding Película IRE
```tsx
// src/app/screens/RCEIREOnboarding.tsx
// Reproductor película IRE + QR WhatMatters al final
// Tracking: viewers, tiempo visto, conversión QR → registro
// Comentarios timestamped, compartir en redes
```

### 6.5 RCEGrowthSimulator.tsx — Simulador Crecimiento IE
```tsx
// src/app/screens/RCEGrowthSimulator.tsx
// Inputs: grupos iniciales, pasos máximos
// Output: tabla + gráfico 3^n, proyección coordinadores, tiempo estimado
// Escenarios: optimista/pesimista/realista (factor reclutamiento 1.5-2.5)
```

---

## 7. Integración Navegación/i18n

```tsx
// src/app/layout/Aside.tsx — Nav items
{ key: 'rce', navKey: 'nav.rce', icon: TreePine, color: 'text-emerald-400', path: '/rce' },
{ key: 'ire', navKey: 'nav.ire', icon: Film, color: 'text-amber-400', path: '/ire' },

// src/core/lib/i18n.ts — Claves ES/EN/PT
'nav.rce': { es: 'Renta Compartida Exponencial', en: 'Exponential Shared Income', pt: 'Renda Compartilhada Exponencial' },
'nav.ire': { es: 'Película IRE', en: 'IRE Movie', pt: 'Filme IRE' },
'title.rce': { es: 'Renta Compartida Exponencial', en: 'Exponential Shared Income', pt: 'Renda Compartilhada Exponencial' },
'title.ire': { es: 'Película IRE - Inteligencia Exponencial', en: 'IRE Movie - Exponential Intelligence', pt: 'Filme IRE - Inteligência Exponencial' },
// ... claves para dashboard, árbol, hitos, verificación, película, simulador
```

---

## 8. OpenSpec (API RCE)

```yaml
# openspec/specs/rce/openapi.yaml
openapi: 3.0.3
info:
  title: RCE API - Renta Compartida Exponencial
  version: 1.0.0
  description: API para protocolo Inteligencia Exponencial (IE) y distribución RCE
servers:
  - url: https://api.whatmatters.pro/v1
    description: Production
paths:
  /challenges:
    get: { summary: Listar desafíos IE }
    post: { summary: Crear desafío, requestBody: { content: { application/json: { schema: { $ref: '#/components/schemas/IEChallengeInput' } } } } }
  /challenges/{id}/tree:
    get: { summary: Obtener árbol IE completo }
  /nodes/{id}/verify:
    post: { summary: Verificar nodo (IA+humano) }
  /nodes/{id}/milestones:
    patch: { summary: Actualizar hito }
  /distributions:
    get: { summary: Historial distribuciones RCE }
    post: { summary: Ejecutar distribución para desafío }
  /ire/movies:
    get: { summary: Películas IRE }
    post: { summary: Registrar película }
  /ire/movies/{id}/convert:
    post: { summary: Registrar conversión QR }
  /simulate/growth:
    post: { summary: Simular crecimiento IE }
  /health/tree/{challengeId}:
    get: { summary: Salud árbol IE }
components:
  schemas:
    IEChallengeInput: { type: object, properties: { title: {type:string}, description:{type:string}, category:{type:string,enum:[climate,mental_health,education,employment,social_security,other]}, scope:{type:string,enum:[local,regional,national,global]}, fundingPool:{$ref:'#/components/schemas/IEFundingPool'} } }
    # ... resto schemas
```

---

## 9. Principio Anfibio Aplicado

| Modo | Financiamiento | Distribución | Verificación | Gobernanza |
|------|----------------|--------------|--------------|------------|
| **Postmonetario** | CaaS streams (suscripción ZNU, revenue share AUT) | RCE en ZNU, CaaS payouts | IA local + auditoría humana local | CDS 1a1v + expertise, mandatos revocables |
| **Conectado** | Green bonds, land value capture, PES, green bonds municipales | USD/USDC via `priceParity` oráculo ReFi N3 | IA cloud + auditoría humana remota + blockchain tx | CDS + verificación on-chain (Poh/RAO) |

**Puente**: `priceParity` oráculo ReFi Nivel 3 (ZNU ↔ USD/USDC)  
**Migración**: `nodeMode` en store + sync backend opcional

---

## 10. Roadmap Implementación

| Fase | Entregable | Criterio Éxito |
|------|------------|----------------|
| **F1** | Tipos + Lógica pura (`rce-types.ts`, `rce.ts`) | `npx tsc --noEmit` clean, 100% coverage tests unitarios |
| **F2** | Estado + Hooks (`rce.ts`, `hooks/rce.ts`) | Zustand persist, migración v1→v2, 20 selectors |
| **F3** | Dashboard + Árbol IE (`RCEDashboard`, `RCEChallengeTree`) | D3 render 10k nodos @60fps, zoom/pan fluido |
| **F4** | Hitos + Verificación (`RCEMilestoneBuilder`, `RCEVerification`) | IA score > 0.85 correlación humano, auditoría 10% |
| **F5** | IRE Onboarding + Simulador | Conversión QR > 15%, simulador preciso ±5% |
| **F6** | Integración Poh/RAO + CaaS | Certificación end-to-end, pago anfibio verificado |
| **F7** | OpenSpec + Tests E2E | `npx tsc --noEmit` clean, 80% coverage E2E |
| **F8** | Deploy + Monitoreo | SLO: 99.9% uptime, p99 < 200ms, error rate < 0.1% |

---

## 11. Referencias y Atribución

- **Video original**: Virginia Barco, "Presentación WhatMatters", YouTube 2026-07-27, https://www.youtube.com/watch?v=-atoASIq_Gw
- **Sistema Virginia Network**: Ya asimilado en HSCSG (repositorio integrado)
- **Protocolo IE**: Concepto original Virginia Barco / WhatMatters
- **Película IRE**: Producción WhatMatters (en desarrollo)
- **HSCSG v15 OS**: Principio Anfibio, CaaS/ZNU, RBE, CDS, Poh/RAO
- **Referencias académicas**: Smith & Harvey-Brown 2018 (ROI ambiental), UN DESA 2018 (urbanización), Fisher 2016 (realismo capitalista), Bookchin (ecoanarquismo), Corbí (PAC), Malatesta (ayuda mutua)

---

## 12. Licencia y Propiedad Intelectual

- **Conceptos IE/RCE/WhatMatters**: Propiedad de Virginia Barco / WhatMatters — **Uso transformativo** para arquitectura HSCSG
- **Código HSCSG**: Licencia MIT / Apache 2.0 (según repo)
- **Atribución obligatoria**: "Basado en protocolo Inteligencia Exponencial (IE) de Virginia Barco / WhatMatters"
- **Uso comercial**: Requiere acuerdo con WhatMatters / Virginia Barco

---

*Documento generado: 2026-11-03 | HSCSG v15 OS | Principio Anfibio | Arquitectura RCE v1.0*