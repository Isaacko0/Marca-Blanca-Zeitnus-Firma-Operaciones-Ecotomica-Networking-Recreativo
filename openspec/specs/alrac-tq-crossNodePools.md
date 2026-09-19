# TQ Cross-Node Pools Specification
## openspec/specs/alrac-tq-crossNodePools.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Pools de liquidez cross-nodo para federación multilateral

---

## 1. Concepto

Pools compartidos entre nodos para:
- Facilitar transacciones multilaterales (A→B→C→A)
- Buffer de reciprocidad temporal
- Soporte a proyectos conjuntos multi-nodo

---

## 2. Especificación Técnica

### 2.1 Interfaz: `CrossNodePool`
```typescript
interface CrossNodePool {
  id: string;                    // UUID único
  name: string;                  // Nombre pool (ej: 'Gaia-BioHabitats-Food')
  nodes: string[];               // Array de nodeIds participantes
  category: ProductCategory;     // Categoría productos en pool
  totalLiquidity: number;        // TQ totales en pool
  nodeContributions: Record<string, number>; // TQ aportados por nodo
  governance: PoolGovernance;    // Reglas gobernanza
  status: 'active' | 'paused' | 'closed';
  createdAt: number;
  updatedAt: number;
}

interface PoolGovernance {
  minNodes: number;              // Mínimo nodos para operar (default: 3)
  maxNodes: number;              // Máximo nodos (default: 10)
  rebalanceThreshold: number;    // % desviación para rebalanceo (default: 20%)
  exitNoticePeriod: number;      // Días aviso salida (default: 30)
  decisionRule: 'consensus' | 'majority' | 'harmony-weighted'; // Ponderado por αʰ
}
```

### 2.2 Función: `createCrossNodePool(config: PoolConfig): PoolResult`
```typescript
interface PoolConfig {
  name: string;
  nodes: string[];
  category: ProductCategory;
  initialContributions: Record<string, number>; // TQ por nodo
  governance?: Partial<PoolGovernance>;
}

export function createCrossNodePool(config: PoolConfig): PoolResult {
  // Validaciones:
  // 1. nodes.length >= governance.minNodes
  // 2. nodes.length <= governance.maxNodes
  // 3. Sum(initialContributions) > 0
  // 4. Cada nodo tiene saldo TQ >= contribution
  // 5. Todos nodos tienen αʰ > κ (paz operativa)
  
  return {
    success: true,
    poolId: generateId(),
    totalLiquidity: Object.values(config.initialContributions).reduce((a,b) => a+b, 0),
    timestamp: Date.now()
  };
}
```

### 2.3 Función: `executeCrossNodeTransaction(poolId: string, tx: CrossNodeTx): TxResult`
```typescript
interface CrossNodeTx {
  fromNode: string;
  toNode: string;
  productId: string;
  quantity: number;
  tqAmount: number;              // = quantity * product.energyFootprint
}

export function executeCrossNodeTransaction(poolId: string, tx: CrossNodeTx): TxResult {
  // 1. Verificar pool existe y está active
  // 2. Verificar fromNode y toNode son miembros del pool
  // 3. Verificar producto en pool.category
  // 4. Verificar pool tiene liquidez suficiente
  // 5. Ejecutar: debit fromNode, credit toNode en pool
  // 6. Registrar RAO credencial
  // 7. Trigger rebalance si nodeContributions desviado > threshold
}
```

### 2.4 Función: `rebalancePool(poolId: string): RebalanceResult`
```typescript
export function rebalancePool(poolId: string): RebalanceResult {
  // Rebalanceo ponderado por armonía (αʰ)
  // Nodos con mayor αʰ reciben mayor proporción de liquidez
  // φʰ = (0.95)^k · (1 + αʰ/10)
}
```

---

## 3. Ejemplo: Pool Gaia ↔ BioHabitats ↔ Mycelium (Alimentos)

```json
{
  "name": "TriAlianza-Food-MX",
  "nodes": ["gaia-node-01", "biohabitats-node-03", "mycelium-node-02"],
  "category": "food",
  "initialContributions": {
    "gaia-node-01": 200,
    "biohabitats-node-03": 150,
    "mycelium-node-02": 100
  },
  "governance": {
    "minNodes": 3,
    "maxNodes": 5,
    "rebalanceThreshold": 0.20,
    "exitNoticePeriod": 30,
    "decisionRule": "harmony-weighted"
  }
}
```

**Flujo típico**:
1. Gaia produce maíz (2.5 TQ/kg) → deposita 200 TQ en pool
2. BioHabitats necesita maíz para comunidad → retira 100 TQ del pool
3. Mycelium facilita logística → aporta 100 TQ, recibe fee 5 TQ
4. Pool rebalancea mensualmente por αʰ de cada nodo

---

## 4. Validaciones

| Test | Expected |
|------|----------|
| Pool con 2 nodos (min=3) | Error: minNodes not met |
| Contribución > saldo TQ nodo | Error: insufficient TQ balance |
| Nodo αʰ < κ | Error: node not in peace |
| Transacción nodo no miembro | Error: unauthorized node |
| Rebalanceo por αʰ | Nodos mayor armonía reciben más liquidez |

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `createCrossNodePool()`, `executeCrossNodeTransaction()`, `rebalancePool()` |
| `src/core/lib/alrac.ts` | Integración con `computeHarmony()` |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] `createCrossNodePool()` valida min/max nodos, contribuciones, αʰ > κ
- [ ] `executeCrossNodeTransaction()` ejecuta débito/crédito atómico
- [ ] `rebalancePool()` redistribuye por φʰ (armonía ponderada)
- [ ] Pool registra RAO credencial por transacción
- [ ] 0 errores TypeScript
- [ ] Tests unitarios: creación, transacción, rebalanceo, salida nodo