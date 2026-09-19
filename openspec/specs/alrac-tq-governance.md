# TQ Governance Specification
## openspec/specs/alrac-tq-governance.md

---

## Overview
**Status**: Draft v1.0  
**Capa**: 1 (Contable-Física) — TQ Ledger  
**Función**: Reglas de asamblea y gobernanza para nodos TQ

---

## 1. Principio: Autonomía Nodal Total

Cada nodo TQ es soberano en sus decisiones internas. La federación (Capa 2) coordina, no gobierna.

---

## 2. Asamblea Nodo TQ

### 2.1 Estructura
```typescript
interface TQNodeAssembly {
  nodeId: string;
  members: AssemblyMember[];      // Cuentas TQ activas (±500)
  proposals: AssemblyProposal[];
  decisions: AssemblyDecision[];
  quorum: number;                 // % cuentas para validez (default: 60%)
  votingRule: 'simple-majority' | 'harmony-weighted' | 'consensus';
}
```

### 2.2 Tipos de Propuestas
| Tipo | Descripción | Quórum | Regla Voto |
|------|-------------|--------|------------|
| **Admisión miembro** | Nueva cuenta TQ en nodo | 60% | Consenso |
| **Expulsión miembro** | Cuenta rompe reglas (αʰ < κ) | 75% | Armonía-ponderada |
| **Cambio gobernanza** | Modificar quórum, reglas | 75% | Consenso |
| **Proyecto conjunto** | Pool cross-nodo, infra compartida | 60% | Armonía-ponderada |
| **Emergencia γ-CARMIS** | Sobrecarga > κ, reconfiguración | 50% | Mayoría simple |

---

## 3. Votación Ponderada por Armonía

```typescript
function computeVoteWeight(member: AssemblyMember): number {
  // φʰ = (0.95)^k · (1 + αʰ/10)
  // k = 1 (Capa 1 TQ)
  const k = 1;
  const harmonyBonus = 1 + member.harmony / 10;
  const decay = Math.pow(0.95, k);
  return decay * harmonyBonus;
}

// Voto efectivo = voto_base (1) * peso_armonía
// Miembros con mayor αʰ tienen mayor influencia
```

---

## 4. γ-CARMIS en Gobernanza TQ

### 3.1 Trigger
```typescript
function checkGammaCARMISTrigger(nodeId: string): GammaCARMISResult {
  const node = getNode(nodeId);
  const overload = node.currentLoad / node.capacity;
  
  if (overload > node.kappa) {
    return {
      triggered: true,
      overload,
      kappa: node.kappa,
      requiredAction: 'reconfiguration',
      deadline: Date.now() + 24 * 60 * 60 * 1000 // 24h
    };
  }
  return { triggered: false };
}
```

### 3.2 Reconfiguración Obligatoria
Cuando γ-CARMIS se dispara:
1. **Congelación** transacciones nuevas (excepto emergencia)
2. **Asamblea extraordinaria** en 24h
3. **Opciones**: reducir carga, expandir capacidad, dividir nodo, federar excedente
4. **Decisión** vinculante (no opcional)

---

## 4. Validaciones

| Test | Expected |
|------|----------|
| Admisión miembro sin consenso | Rechazada |
| Expulsión con 70% (req 75%) | Rechazada |
| γ-CARMIS trigger → asamblea 24h | Ejecutada |
| Voto ponderado por αʰ | Mayor armonía = mayor peso |
| Quórum no alcanzado | Propuesta caduca |

---

## 5. Archivos Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/tq.ts` | `createTQAssembly()`, `submitProposal()`, `voteProposal()`, `checkGammaCARMIS()` |
| `src/core/lib/alrac.ts` | `gammaCARMIS()`, `computeHarmony()` |
| `openspec/specs/alrac-architecture.md` | Capa 1 specs |

---

## 6. Criterios de Aceptación

- [ ] Asamblea nodo creada con miembros válidos (±500 TQ, αʰ > κ)
- [ ] Propuestas tipadas con quórum y regla voto correctos
- [ ] Voto ponderado por φʰ = 0.95 * (1 + αʰ/10)
- [ ] γ-CARMIS trigger congela transacciones y convoca asamblea
- [ ] Reconfiguración decidida en 24h es vinculante
- [ ] 0 errores TypeScript
- [ ] Tests unitarios: admisión, expulsión, proyecto, emergencia