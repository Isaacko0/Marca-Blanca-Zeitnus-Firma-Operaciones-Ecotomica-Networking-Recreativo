# Síntesis: Virginia N3 Dinámico ↔ Urbanika Autogestión Vecinal ↔ Bread Verificación

> **Fuentes**: 
> - `ECOSYSTEM_REVENUE_SHARING.md` líneas 111-118 (limitación Virginia N3=2.0)
> - `docs/urbanika/Autogestion_Vecinal_backup.md` (modelo Urbanika condominios/web3)
> - `ECOSYSTEM_REVENUE_SHARING.md` referencia a verificación Bread por votación

---

## 1. El Problema: Peso N3 "Asumido" en Virginia Network

### Estado Actual (ECOSYSTEM_REVENUE_SHARING.md:117)
```markdown
| **N3 (27 hojas)** | Base productiva verificada | **2.0 → DINÁMICO** | `TQ_generado_real_kWh × CDS × AUT` |
```

**Limitación identificada**: El peso 2.0 para posiciones N3 (hojas productivas) es **hardcoded/asumido**, no emergente de medición real.

### Propuesta: Peso Dinámico Basado en Contribución Real
```typescript
// En lugar de peso fijo 2.0
const peso_N3_dinamico = (TQ_generado_real_kWh * CDS_nodo * AUT_nodo) / normalizador_ecosistema
```

---

## 2. Modelo Urbanika: Autogestión Vecinal + Web3 (Autogestion_Vecinal_backup.md)

### Concepto Central
> "Descentralizar la gestión de la ciudad. Imaginamos un futuro donde una ciudad es gestionada por sus vecindarios, y los vecindarios por sus bloques, y cada bloque por las casas que lo forman."

### Estructura de Gobernanza Urbanika
```
CIUDAD
  └── MUNICIPIO DAO
      └── CIUDAD DAO
          └── VECINDARIO DAO
              └── BLOQUE DAO
                  └── CASA/HOGAR
```

### Problema que Resuelve Urbanika
- **Condominios** = única unidad que *reconoce su necesidad* de mejorar coordinación
- **Juntas administrativas tradicionales** = opacas, corruptas, no representativas
- **Solución**: Web3 para transparencia, rendición de cuentas, gobernanza distribuida

### Paralelo con Virginia Network
| Virginia Network | Urbanika |
|------------------|----------|
| N1 (3 raíces) = Coordinación estratégica | Municipio/Ciudad DAO |
| N2 (9 ramas) = Puentes coord-producción | Vecindario DAO |
| **N3 (27 hojas) = Base productiva** | **Bloque/Casa = Unidad productiva real** |
| Peso 2.0 asumido | **Verificación real por participación/contribución** |

---

## 3. Modelo Bread: Verificación por Votación

### Referencia en ECOSYSTEM_REVENUE_SHARING.md
> "acercaría el modelo a la verificación de contribución que Bread hace por votación"

### Cómo Funciona Bread (contexto HSCSG)
- **Bread** = protocolo de verificación de contribución mediante **votación comunitaria**
- Los pares validan la contribución real de cada participante
- Peso emergente = consenso social, no asumido

### Aplicación a Virginia N3
```typescript
// Verificación estilo Bread para N3
interface N3Verification {
  contributorId: string;           // DID del nodo hoja
  tqGeneratedKwh: number;          // TQ real generado (medido)
  peerVotes: PeerVote[];           // Votos de pares N2/N1
  consensusWeight: number;         // 0-1, emerge de votación
  finalWeight: number;             // = baseWeight * consensusWeight
}

// PeerVote: N2 (ramas) votan sobre contribución real de N3 (hojas) que conectan
```

---

## 4. Arquitectura Integrada: Virginia Dinámico + Urbanika + Bread

### Flujo de Verificación de Contribución N3

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICACIÓN N3 DINÁMICA                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. MEDICIÓN REAL (TQ Ledger)                                   │
│     ├── N3 genera TQ via producción (solar, huerta, datos...)  │
│     ├── TQ_generado_real_kWh registrado en TQ Ledger (Capa 1)  │
│     └── Anclaje RAO: procedencia, emisor, permisos, estado    │
│                                                                 │
│  2. VERIFICACIÓN POR PARES (Estilo Bread)                       │
│     ├── N2 (ramas conectadas) revisan contribución N3          │
│     ├── Votación: "¿Este N3 aporta lo que declara?"            │
│     ├── consensusWeight = votos_positivos / total_votos        │
│     └── Quorum mínimo: 3 N2 conectados                         │
│                                                                 │
│  3. FACTOR URBANIKA (Autogestión Vecinal)                      │
│     ├── N3 = "Bloque/Casa" en terminología Urbanika            │
│     ├── CDS_nodo = cohesión social del bloque                  │
│     ├── AUT_nodo = autonomía productiva real                   │
│     └── factor_urbanika = CDS × AUT (0-1+)                     │
│                                                                 │
│  4. CÁLCULO PESO FINAL                                         │
│     peso_N3 = (TQ_kWh / TQ_promedio_ecosistema)                │
│              × consensusWeight (Bread)                         │
│              × factor_urbanika (Urbanika)                      │
│              × normalizador_global                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Implementación Técnica en Repo ALRAC/TQ

### 5.1 Nuevos Tipos (extendiendo tq-types-extended.ts)

```typescript
// src/core/lib/tq-types-extended.ts — ADDITIONS

export interface N3DynamicWeight {
  nodeId: string;                    // N3 leaf node
  period: { start: number; end: number };
  
  // 1. Medición real TQ
  tqGeneratedKwh: number;            // TQ real generado en período
  tqGeneratedVerified: boolean;      // Verificado por RAO
  
  // 2. Verificación Bread (pares N2)
  peerVerification: {
    votingN2Nodes: string[];         // DIDs de N2 que votaron
    positiveVotes: number;
    totalVotes: number;
    consensusWeight: number;         // 0-1
    quorumMet: boolean;              // ≥3 N2 voters
  };
  
  // 3. Factor Urbanika (autogestión vecinal)
  urbanikaFactor: {
    cds: number;                     // Cohesión social del bloque (0-1+)
    aut: number;                     // Autonomía productiva (0-1+)
    composite: number;               // CDS × AUT
  };
  
  // 4. Peso final calculado
  finalWeight: number;               // Peso dinámico para reparto
  previousWeight: number;            // Para suavizado temporal
  updatedAt: number;
}

export interface N3VerificationProposal {
  id: string;
  n3NodeId: string;
  proposedWeight: number;
  proposerId: string;                // N2 node
  status: 'pending' | 'voting' | 'approved' | 'rejected';
  votes: Record<string, 'yes' | 'no' | 'abstain'>;
  createdAt: number;
  expiresAt: number;
}
```

### 5.2 Motor de Cálculo (nuevo archivo)

```typescript
// src/core/lib/tq-virginia-dynamic.ts

import type { N3DynamicWeight, N3VerificationProposal } from './tq-types-extended';
import type { TQNodeState } from './tq';

export function computeN3DynamicWeight(
  n3NodeId: string,
  nodeState: TQNodeState,
  period: { start: number; end: number }
): N3DynamicWeight {
  // 1. Obtener TQ real generado desde TQ Ledger
  const tqGenerated = getTQGeneratedInPeriod(n3NodeId, period);
  
  // 2. Obtener verificación Bread (pares N2)
  const peerVerification = getPeerVerification(n3NodeId, nodeState);
  
  // 3. Calcular factor Urbanika
  const urbanikaFactor = computeUrbanikaFactor(n3NodeId, nodeState);
  
  // 4. Calcular peso final
  const tqRatio = tqGenerated / getAverageTQPerN3(nodeState);
  const finalWeight = tqRatio 
    * peerVerification.consensusWeight 
    * urbanikaFactor.composite
    * ECOSYSTEM_NORMALIZER;
  
  // 5. Suavizado temporal (evitar volatilidad)
  const previousWeight = getPreviousWeight(n3NodeId);
  const smoothedWeight = 0.7 * finalWeight + 0.3 * previousWeight;
  
  return {
    nodeId: n3NodeId,
    period,
    tqGeneratedKwh: tqGenerated,
    tqGeneratedVerified: true,
    peerVerification,
    urbanikaFactor,
    finalWeight: smoothedWeight,
    previousWeight,
    updatedAt: Date.now()
  };
}

function computeUrbanikaFactor(n3NodeId: string, nodeState: TQNodeState) {
  // CDS = cohesión social (Urbanika: qué tan cohesionado está el bloque)
  const cds = getNodeCDS(n3NodeId, nodeState);
  
  // AUT = autonomía productiva (Urbanika: capacidad de autogestión)
  const aut = getNodeAutonomy(n3NodeId, nodeState);
  
  return { cds, aut, composite: cds * aut };
}

function getPeerVerification(n3NodeId: string, nodeState: TQNodeState) {
  // Obtener N2 conectados a este N3
  const connectedN2 = getConnectedN2Nodes(n3NodeId, nodeState);
  
  // Simular votación (en producción: propuesta real + votación)
  const votes = connectedN2.map(n2 => ({
    voterId: n2,
    vote: 'yes' as const,  // Basado en datos TQ Ledger
    weight: getNodeCDS(n2, nodeState)  // Peso del voto = CDS del N2
  }));
  
  const positiveWeight = votes.filter(v => v.vote === 'yes').reduce((s, v) => s + v.weight, 0);
  const totalWeight = votes.reduce((s, v) => s + v.weight, 0);
  
  return {
    votingN2Nodes: connectedN2,
    positiveVotes: votes.filter(v => v.vote === 'yes').length,
    totalVotes: votes.length,
    consensusWeight: totalWeight > 0 ? positiveWeight / totalWeight : 0,
    quorumMet: votes.length >= 3
  };
}
```

### 5.3 Integración en Fórmula de Reparto (ECOSYSTEM_REVENUE_SHARING.md)

```typescript
// En lugar de peso fijo 2.0 para N3:
const CIRCULO_4_VIRGINIA = {
  N1: { roles: 3, peso: (n) => n.cds * n.aut },           // CDS × AUT real
  N2: { roles: 9, peso: (n) => n.cds * n.aut * 1.2 },     // +20% puente
  N3: { roles: 27, peso: (n) => getN3DynamicWeight(n.id).finalWeight }  // DINÁMICO
};
```

---

## 6. Caso de Uso: Condominio Urbanika → Virginia N3

### Escenario
> Un condominio de 50 viviendas (Urbanika) instala paneles solares + huerta comunitaria + nodo de datos. Se registra como **N3 en Virginia Network**.

### Flujo
```
1. CONDOMINIO (Urbanika) → Se registra como N3 en Virginia
   ├── DID condominio (Project Weave / Gaia Passport)
   ├── CDS = 0.85 (alta cohesión: juntas mensuales, decisiones consensuadas)
   └── AUT = 0.90 (autonomía energética 80%, alimentaria 40%, datos 60%)

2. GENERACIÓN TQ REAL (3 meses)
   ├── Solar: 15,000 kWh → 15,000 TQ
   ├── Huerta: 2,000 kWh equivalente → 2,000 TQ  
   ├── Nodo datos: 500 kWh → 500 TQ
   └── TOTAL: 17,500 TQ/kWh en período

3. VERIFICACIÓN BREAD (Pares N2)
   ├── N2 "Vecindario Norte" revisa medidores + actas junta
   ├── N2 "Cooperativa Energética" audita producción solar
   ├── N2 "Red Datos Local" valida nodo datos
   ├── Votos: 3/3 positivos, peso CDS promedio 0.82
   └── consensusWeight = 1.0, quorumMet = true

4. CÁLCULO PESO N3 DINÁMICO
   ├── tqRatio = 17,500 / 12,000 (promedio ecosistema) = 1.46
   ├── consensusWeight = 1.0
   ├── urbanikaFactor = 0.85 × 0.90 = 0.765
   ├── finalWeight = 1.46 × 1.0 × 0.765 × 1.2 (normalizador) = 1.34
   └── (vs peso asumido 2.0 → más realista, basado en evidencia)

5. REPARTO ECOSISTÉMICO
   ├── Círculo 4 (Virginia) recibe 30% VTR
   ├── Intra-círculo: N3 peso 1.34 vs N2 1.2×CDS×AUT vs N1 CDS×AUT
   └── Distribución justa: quien más genera + verifica + se autogobierna, más recibe
```

---

## 7. Beneficios de la Integración

| Dimensión | Antes (Peso 2.0 Asumido) | Después (Dinámico + Urbanika + Bread) |
|-----------|--------------------------|----------------------------------------|
| **Justicia distributiva** | Arbitraria | Basada en contribución real medida |
| **Incentivos** | Ninguno para producir más | Producir + verificar + autogobernarse = más peso |
| **Resiliencia** | Frágil (gaming del peso) | Antifrágil (verificación pares + autogestión) |
| **Escalabilidad** | Limitada | Modelo fractal: condominio → vecindario → ciudad |
| **Filosofía** | Centralizado/asumido | **Urbanika**: "Ciudad gestionada por sus bloques" |

---

## 8. Próximos Pasos de Implementación

| Fase | Acción | Archivo |
|------|--------|---------|
| **1** | Añadir `N3DynamicWeight` + `N3VerificationProposal` a `tq-types-extended.ts` | `src/core/lib/tq-types-extended.ts` |
| **2** | Crear `tq-virginia-dynamic.ts` con motor de cálculo | `src/core/lib/tq-virginia-dynamic.ts` |
| **3** | Integrar en `computeN3Weight()` en `ECOSYSTEM_REVENUE_SHARING.md` fórmula | `docs/ECOSYSTEM_REVENUE_SHARING.md` |
| **4** | Spec OpenSpec: `alrac-tq-virginia-dynamic.md` | `openspec/specs/alrac-tq-virginia-dynamic.md` |
| **5** | Pilot: Condominio Urbanika real → N3 Virginia (coordinar con Humberto Besso) | Pilot tracking |

---

## 8. Conclusión: El Círculo se Cierra

> **Virginia N3 dinámico = Urbanika (autogestión vecinal) + Bread (verificación pares) + TQ (medición termodinámica)**

El peso 2.0 "asumido" era un **placeholder**. La solución real emerge de:
1. **TQ Ledger** → Medición termodinámica real (kWh)
2. **Bread** → Verificación social distribuida (votación pares)
3. **Urbanika** → Autogestión vecinal como factor de legitimidad (CDS × AUT)

**Virginia Network se convierte así en la capa de aplicación (Capa 4) que materializa la visión Urbanika: una ciudad donde cada bloque (N3) tiene peso proporcional a su contribución real verificada por sus pares (N2) y legitimada por su autogestión (CDS×AUT).**

---

*Documento de síntesis para integrar en `ECOSYSTEM_REVENUE_SHARING.md` y especificar en `alrac-tq-virginia-dynamic.md`.*