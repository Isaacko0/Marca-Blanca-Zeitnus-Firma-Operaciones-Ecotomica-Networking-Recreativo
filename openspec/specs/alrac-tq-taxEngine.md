# TQ Tax Engine Specification
## openspec/specs/alrac-tq-taxEngine.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Impuestos regenerativos (β_crit, fondo comunitario)

---

## 1. Principio: Impuestos = Regeneración, No Extracción

Los "impuestos" en ALRAC no financian estado, **financian regeneración de la base material**.

---

## 2. Dos Mecanismos

### 2.1 β_crit — Techo Anti-Acaparamiento Interno
```typescript
interface BetaCritConfig {
  threshold: number;        // % de liquidez total nodo (default: 30%)
  rate: number;             // % excedente redistribuido (default: 50%)
  frequency: 'daily' | 'weekly' | 'monthly';
}

function applyBetaCrit(nodeId: string, config: BetaCritConfig): BetaCritResult {
  const node = getNode(nodeId);
  const totalLiquidity = node.tqBalance + node.poolContributions;
  const threshold = totalLiquidity * config.threshold;
  
  if (node.tqBalance > threshold) {
    const excess = node.tqBalance - threshold;
    const redistributed = excess * config.rate;
    const retained = excess * (1 - config.rate);
    
    // Redistribuir a: fondo comunitario, pools cross-nodo, nodos deficitarios
    return {
      applied: true,
      excess,
      redistributed,
      retained,
      destinations: computeRedistributionDestinations(redistributed),
      timestamp: Date.now()
    };
  }
  return { applied: false };
}
```

### 2.2 Fondo Comunitario Regenerativo
```typescript
interface CommunityFund {
  id: string;
  nodeId: string;
  balance: number;              // TQ acumulados
  allocations: FundAllocation[];
  governance: FundGovernance;
}

interface FundAllocation {
  id: string;
  purpose: 'soil_regeneration' | 'water_infrastructure' | 'energy_sovereignty' 
         | 'housing_regenerative' | 'health_access' | 'education' | 'emergency';
  amount: number;
  status: 'proposed' | 'approved' | 'executing' | 'completed' | 'audited';
  raoCredentialId: string;      // Auditoría termodinámica
  approvedBy: string[];         // DIDs aprobadores (asamblea)
  createdAt: number;
  completedAt?: number;
}

interface FundGovernance {
  proposalThreshold: number;    // % fondo para proponer (default: 5%)
  approvalQuorum: number;       // % asamblea (default: 60%)
  auditRequired: boolean;       // Siempre true
  maxAllocationPerProposal: number; // % fondo (default: 20%)
}
```

---

## 3. Flujo Completo

```
1. Nodo acumula TQ > β_crit threshold (30% liquidez total)
2. applyBetaCrit() detecta excedente
3. 50% excedente → fondo comunitario
4. Asamblea propone asignación (ej: regeneración suelo)
5. Quórum 60% aprueba
6. Fondos liberados → proyecto con RAO credencial
7. Auditoría termodinámica post-ejecución
8. Resultado: kWh regenerados medidos
```

---

## 4. Validaciones

| Test | Expected |
|------|----------|
| Nodo 25% liquidez | β_crit no aplicado |
| Nodo 40% liquidez (threshold 30%) | β_crit aplicado, 50% excedente redistribuido |
| Propuesta fondo < 5% | Rechazada (threshold) |
| Propuesta > 20% fondo | Rechazada (max) |
| Asignación sin RAO | Rechazada |
| Auditoría post-ejecución falla | Fondo congelado, investigación |

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `applyBetaCrit()`, `createCommunityFund()`, `proposeAllocation()`, `auditAllocation()` |
| `src/core/lib/alrac.ts` | `computeLDFVShare()` (integra β_crit) |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] `applyBetaCrit()` detecta y redistribuye excedente > threshold
- [ ] Fondo comunitario requiere propuesta > 5%, quórum 60%, RAO obligatorio
- [ ] Máx 20% fondo por propuesta
- [ ] Auditoría termodinámica post-ejecución (kWh medidos)
- [ ] 0 errores TypeScript
- [ ] Tests unitarios: β_crit trigger, propuesta, aprobación, auditoría