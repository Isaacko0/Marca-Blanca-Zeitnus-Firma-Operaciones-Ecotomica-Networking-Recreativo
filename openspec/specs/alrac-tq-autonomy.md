# TQ Autonomy Metrics Specification
## openspec/specs/alrac-tq-autonomy.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Métricas de autonomía nodal (% decisiones locales vs coordinación central)

---

## 1. Principio: Autonomía = Capacidad de Decidir Localmente

Un nodo soberano toma sus propias decisiones. La federación coordina, no dicta.

---

## 2. Métricas de Autonomía

### 2.1 Autonomía Decisional
```typescript
interface AutonomyMetrics {
  nodeId: string;
  period: { start: number; end: number };
  
  // Decisiones locales vs federadas
  localDecisions: number;           // Decisiones tomadas solo por nodo
  federatedDecisions: number;       // Decisiones requiriendo consenso federado
  autonomyRatio: number;            // localDecisions / (local + federated)
  
  // Tipos de decisiones
  decisionsByType: Record<DecisionType, DecisionStats>;
  
  // Soberanía recursos
  resourceControl: ResourceControl;
  
  // Timestamp
  computedAt: number;
}

type DecisionType = 
  | 'admission'        // Admisión miembros
  | 'production'       // Qué producir, cuánto
  | 'transaction'      // Transacciones TQ
  | 'governance'       // Cambios reglas nodo
  | 'land_use'         // Uso tierra
  | 'pool_participation' // Unirse/salir pools
  | 'emergency'        // γ-CARMIS response

interface DecisionStats {
  total: number;
  local: number;
  federated: number;
  autonomyRatio: number;
}

interface ResourceControl {
  land: number;           // % tierra controlada localmente
  energy: number;         // % capacidad energética propia
  water: number;          // % agua gestionada localmente
  compute: number;        // % cómputo local vs cloud
  data: number;           // % datos en servidor local
}
```

### 2.2 Función: `computeAutonomyMetrics(nodeId: string, period: Period): AutonomyMetrics`
```typescript
export function computeAutonomyMetrics(
  nodeId: string, 
  period: { start: number; end: number }
): AutonomyMetrics {
  const decisions = getDecisionsInPeriod(nodeId, period);
  const local = decisions.filter(d => !d.requiredFederatedConsensus).length;
  const federated = decisions.filter(d => d.requiredFederatedConsensus).length;
  
  const byType: Record<DecisionType, DecisionStats> = {};
  for (const type of DECISION_TYPES) {
    const typeDecisions = decisions.filter(d => d.type === type);
    const typeLocal = typeDecisions.filter(d => !d.requiredFederatedConsensus).length;
    byType[type] = {
      total: typeDecisions.length,
      local: typeLocal,
      federated: typeDecisions.length - typeLocal,
      autonomyRatio: typeDecisions.length > 0 ? typeLocal / typeDecisions.length : 1
    };
  }
  
  return {
    nodeId,
    period,
    localDecisions: local,
    federatedDecisions: federated,
    autonomyRatio: (local + federated) > 0 ? local / (local + federated) : 1,
    decisionsByType: byType,
    resourceControl: computeResourceControl(nodeId),
    computedAt: Date.now()
  };
}
```

### 2.3 Función: `computeResourceControl(nodeId: string): ResourceControl`
```typescript
function computeResourceControl(nodeId: string): ResourceControl {
  const node = getNode(nodeId);
  
  return {
    land: node.landRegistry.filter(l => l.stewardship.communityAgreement).length / 
          Math.max(node.landRegistry.length, 1),
    energy: node.energyCapacity.own / Math.max(node.energyCapacity.total, 1),
    water: node.waterSources.local / Math.max(node.waterSources.total, 1),
    compute: node.compute.local / Math.max(node.compute.total, 1),
    data: node.dataStorage.local / Math.max(node.dataStorage.total, 1)
  };
}
```

---

## 3. Umbrales de Alerta

| Métrica | Verde | Amarillo | Rojo |
|---------|-------|----------|------|
| autonomyRatio | > 0.8 | 0.5 - 0.8 | < 0.5 |
| land control | > 0.9 | 0.7 - 0.9 | < 0.7 |
| energy sovereignty | > 0.7 | 0.5 - 0.7 | < 0.5 |
| compute local | > 0.8 | 0.6 - 0.8 | < 0.6 |
| data local | > 0.9 | 0.7 - 0.9 | < 0.7 |

---

## 4. Integración con γ-CARMIS

Si `autonomyRatio` cae < 0.5 por 2 períodos consecutivos → trigger γ-CARMIS (pérdida de soberanía = sobrecarga estructural).

---

## 5. Validaciones

| Test | Expected |
|------|----------|
| Nodo 100% decisiones locales | autonomyRatio = 1.0 |
| Nodo 50/50 local/federado | autonomyRatio = 0.5 |
| Decisiones por tipo calculadas | Cada tipo tiene stats correctos |
| ResourceControl ∈ [0,1] | Todos los ratios válidos |
| Alerta autonomía < 0.5 | Trigger γ-CARMIS |

---

## 6. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `computeAutonomyMetrics()`, `computeResourceControl()` |
| `src/core/lib/alrac.ts` | `gammaCARMIS()` integra autonomyRatio |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 7. Criterios de Aceptación

- [ ] `computeAutonomyMetrics()` calcula ratio local/(local+federado)
- [ ] Decisiones categorizadas por 7 tipos
- [ ] ResourceControl: 5 recursos medidos
- [ ] Umbrales alerta definidos y funcionales
- [ ] Integración γ-CARMIS: autonomyRatio < 0.5 → trigger
- [ ] 0 errores TypeScript
- [ ] Tests: autonomía 1.0, 0.5, 0.0, resource control, γ-CARMIS trigger