# ALRAC Architecture Specification
## openspec/specs/alrac-architecture.md

---

## Overview
**Status**: Draft v1.0  
**Domain**: ALRAC (Consorcio de Transducción Soberana)  
**Version**: 1.0.0  
**Governance**: GNAP agent `alrac-coordinator` cross-repo sync (Zeitnus ↔ HSCSG v15 OS)

---

## 1. Five-Layer Architecture (Cero Absorción)

| Capa | Dueño | Aporte | Regla Innegociable |
|------|-------|--------|-------------------|
| **0 · Epistémica** | Amid Dabir (Sistema Alraico) | PI, 𝕮, γ-CARMIS, Verificación Triaxial, AEI, 20 Límites Cognitivos | CC0 permanente. Nunca diagnosticar clínicamente, nunca crear dependencia |
| **0.5 · Normativa** | Javier (Investigación 7 Principios) | 7 principios, 𝕮-Atlas, 5 anti-reglas | Ningún modelo universal; toda recomendación contextual |
| **1 · Contable-Física** | Cergio Monasterio (Ecoaldeas Federadas) | TQ = 1 kWh, límite ±500, catálogo ICE/Ecoinvent, NFC offline | **Prohibición cambiaria: TQ ≠ fiat/cripto NUNCA** |
| **2 · Interoperabilidad** | Isaac / HSCSG v15 | CaaS, AUT, RAO, autómata soberano, federación nodos | Autonomía total de cada nodo |
| **3 · Membrana Fiat** | Coop. Zeitnus | Personalidad jurídica, nómina, tierra, puente bancario | Valor respaldado por producción real; 1 asociado = 1 voto |

---

## 2. Dos Encajes Críticos

### 2.1 Zeitnus = Única Capa que Toca Fiat
```
Capa 3 (Zeitnus) ←→ Fiat
      ↑
      │ protege arquitectura
      ↓
Capa 1 (TQ) — Prohibición cambiaria ENFORZADA por arquitectura, no buena voluntad
```

### 2.2 Separación TQ / ZNU (Resuelve Contradicción HSCSG)
| Función | TQ (Capa 1) | ZNU (Capa 3) |
|---------|-------------|--------------|
| **Rol** | Cinta métrica reciprocidad | Reserva/puente fiat dentro coop |
| **Acumulación** | NO (Postulado 4: caduca si no circula) | SÍ (ahorro indexado canasta) |
| **Conversión** | Prohibida TQ→Fiat | Permitida ZNU↔Fiat (oráculo priceParity) |
| **Límite** | ±500 TQ por cuenta | Sin límite duro |

---

## 3. Isomorfismo HSCSG ↔ ALRAC

| HSCSG (Concepto) | ALRAC (Implementación) |
|------------------|------------------------|
| Estrategias | VIAs / CaaS tiers |
| Capas de riesgo | Leyes MJ |
| Dry-run | Verificación triaxial |
| Audit trail | γ-CARMIS |
| DEB consensus | Verificación triaxial |

---

## 4. GNAP Cross-Repo Synchronization

```json
// .gnap/agents.json (AMBOS repos)
{
  "id": "alrac-coordinator",
  "name": "ALRAC Coordinator",
  "role": "ALRAC-NEXO Coordination",
  "type": "ai",
  "runtime": "hermes",
  "capabilities": [
    "alrac-nexo-sync",
    "license-audit",
    "pilot-tracking",
    "yoka-liaison"
  ],
  "heartbeat_sec": 300,
  "status": "active",
  "reports_to": "isaac"
}
```

**Sync Obligatorio**:
- `docs/ALRAC_MASTER_INTEGRADO.md` ↔ `docs/alrac_integration.md`
- `openspec/specs/alrac-*.md` (4 specs) ambos repos
- `src/core/lib/alrac.ts` + `src/core/state/alrac.ts`
- `.gnap/agents.json` idéntico

---

## 5. Archivos de Referencia Implementación

| Archivo | Función |
|---------|---------|
| `src/core/lib/alrac.ts` | 15+ funciones puras (computeHarmony, computeLDFVShare, verifyTQProhibition, simulateNode) |
| `src/core/state/alrac.ts` | 25+ interfaces TypeScript |
| `src/core/lib/tq.ts` | Ledger TQ: exchangeGuard, conversionFactor, productFederation, crossNodePools |
| `src/core/lib/znu.ts` | Indexación canasta, crédito 2-3%, gobernanza 1a1v |
| `src/core/lib/casas.ts` | CaaS/AUT: vectores contribución, matching federado |
| `src/core/lib/rao.ts` | RAO: credencial, verificación, anclaje termodinámico |

---

## 6. Validaciones Críticas (No Romper)

- [ ] `npx tsc --noEmit` = 0 errores
- [ ] `npm run build` = OK
- [ ] `verifyTQProhibition()` bloquea cualquier TQ→Fiat
- [ ] `conversionFactor` calcula FC = canasta_TQ(500)/canasta_Fiat
- [ ] `exchangeGuard` previene arbitraje
- [ ] Capa 3 es ÚNICA que toca fiat
- [ ] Cada nodo soberano (autómata HSCSG)

---

## 7. Próximos Pasos (Ver `ALRAC_MASTER_INTEGRADO.md` §14)

- [ ] Implementar Capa 1 TQ: 10 specs faltantes
- [ ] Implementar Capa 0 Amid: 5 funciones núcleo
- [ ] Crear `LICENSE_AUDIT_ASIMILACIONES.md`
- [ ] Ejecutar 1er ciclo 4 agentes + revisor