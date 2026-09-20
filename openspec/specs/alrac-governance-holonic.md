# ALRAC Governance Spec

**Capa:** 5 — Gobernanza (Transversal)  
**Versión:** 1.0  
**Estado:** Draft  
**Fecha:** 2026-09-19  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir el modelo de **gobernanza holónica** del Consorcio ALRAC: 1a1v, CDS (Capacidad de Soberanía), subsidiaridad, asambleas, comités rotativos, vetos, y resolución de conflictos — transversal a las 5 capas.

---

## 2. Principios Fundamentales

| Principio | Descripción |
|-----------|-------------|
| **1a1v (Una Persona, Un Voto)** | Cada miembro verificado (RAO) = 1 voto. No ponderado por capital. |
| **CDS (Capacidad de Soberanía)** | Peso de voto modulado por participación, autonomía, y métricas reales. |
| **Subsidiaridad** | Decisiones al nivel más local posible. Solo escalan si afectan múltiples nodos. |
| **Consentimiento vs Mayoría** | Cambios nucleares = consentimiento (nadie objeta bloqueante). Operativos = mayoría cualificada. |
| **Rotación** | Poder rota. Comités rotan cada 3 meses. No cargos permanentes. |
| **Transparencia Radical** | Todas las votaciones, propuestas, y argumentos son públicos (Ley III MJ). |

---

## 3. Estructura de Gobernanza

```
┌─────────────────────────────────────────────────────────────┐
│                    ASAMBLEA GENERAL (1a1v)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Núcleo    │  │  Asociados  │  │  Afiliados  │         │
│  │  (veto)     │  │ (proponen)  │  │  (votan)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ COMITÉ     │  │ COMITÉ     │  │ COMITÉ     │
       │ TÉCNICO    │  │ ECONÓMICO  │  │ TERRITORIAL│
       │ (rotativo) │  │ (rotativo) │  │ (rotativo) │
       └────────────┘  └────────────┘  └────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   DATA TRUST /      │
                    │   AUDITORÍA RAO     │
                    │   (independiente)   │
                    └─────────────────────┘
```

---

## 4. Tipos de Decisión y Umbrales

| Tipo de Decisión | Quién Propone | Quién Vota | Umbral | Veto |
|------------------|---------------|------------|--------|------|
| **Constitucional** (cambiar capas, principios) | Núcleo | Todos (1a1v) | Consentimiento (0 objeciones bloqueantes) | Núcleo (unánime) |
| **Monetaria** (basket, tasa, expiración) | Núcleo + Data Trust | Núcleo + Asociados | 66% | Núcleo |
| **Estratégica** (nuevos holones, alianzas) | Cualquier Asociado | Núcleo + Asociados | 60% | Núcleo |
| **Operativa** (parámetros streams, fees) | Comités | Nivel afectado | 50%+1 | No |
| **Técnica** (specs, código, arquitectura) | Comité Técnico | Comité Técnico | Consenso técnico | No |
| **Territorial** (land use, biohabitats) | Comité Territorial | Miembros afectados | Consentimiento local | Local |

---

## 5. CDS (Capacidad de Soberanía) - Cálculo

```typescript
interface CDSComponents {
  // Participación (0-1)
  governanceParticipation: number;   // % asambleas asistidas, votos emitidos
  proposalQuality: number;           // Propuestas aceptadas / totales
  auditContribution: number;         // Auditorías realizadas / requeridas
  
  // Autonomía (0-1)
  localDecisionMaking: number;       // % decisiones locales vs escaladas
  resourceSelfSufficiency: number;   // % recursos propios vs externos
  technicalSovereignty: number;      // Infraestructura propia vs dependiente
  
  // Métricas Regenerativas (0-1)
  tqGenerated: number;               // kWh regenerados / capacidad
  znuCirculated: number;             // ZNU velocity personal
  baseMaterialStewardship: number;   // Cuidado tierra/agua/energía
  
  // Historial (0-1)
  raidCount: number;                 // Veces que pasó γ-CARMIS y recuperó
  triaxialVerifications: number;     // Verificaciones validadas
  raoUptime: number;                 // % tiempo RAO vigente
}

function calculateCDS(components: CDSComponents): number {
  const weights = {
    participation: 0.25,
    autonomy: 0.25,
    regenerative: 0.30,
    history: 0.20
  };
  
  const participation = (
    components.governanceParticipation * 0.4 +
    components.proposalQuality * 0.3 +
    components.auditContribution * 0.3
  );
  
  const autonomy = (
    components.localDecisionMaking * 0.4 +
    components.resourceSelfSufficiency * 0.3 +
    components.technicalSovereignty * 0.3
  );
  
  const regenerative = (
    components.tqGenerated * 0.4 +
    components.znuCirculated * 0.3 +
    components.baseMaterialStewardship * 0.3
  );
  
  const history = (
    Math.min(components.raidCount * 0.1, 0.3) +
    Math.min(components.triaxialVerifications * 0.05, 0.4) +
    components.raoUptime * 0.3
  );
  
  return (
    participation * weights.participation +
    autonomy * weights.autonomy +
    regenerative * weights.regenerative +
    history * weights.history
  );
}
```

**CDS Gates:**
- `CDS ≥ 0.6` → Acceso a proponer cambios estratégicos
- `CDS ≥ 0.7` → Acceso a comité rotativo
- `CDS ≥ 0.8` → Elegible para Núcleo
- `CDS < 0.3` → Grace period, revisión obligatoria

---

## 6. Asamblea General

### 6.1 Frecuencia y Convocatoria

| Asamblea | Frecuencia | Convocada por | Quórum |
|----------|------------|---------------|--------|
| **Ordinaria** | Mensual | Comité rotativo | 20% miembros activos |
| **Extraordinaria** | Bajo demanda | 10% miembros o Núcleo | 30% miembros activos |
| **Constitucional** | Según necesidad | Núcleo unánime | 50% Núcleo + 30% Asociados |

### 6.2 Proceso de Propuesta

```
PROPUESTA (RAO + CDS≥0.6)
    │
    ▼
[Publicación 14 días] → [Discusión foro 7 días] → [Enmiendas 7 días] → [Votación 7 días]
    │                        │                        │                    │
    ▼                        ▼                        ▼                    ▼
Formato estándar      Argumentos a favor/    Versión final        1a1v + CDS weight
(título, tipo,        en contra, datos       incorpora            Resultado:
 impacto, costo,      de apoyo, alternativas  enmiendas            - Aprobada
  riesgos, RAO)                                                        - Rechazada
                                                                        - Bloqueada (veto)
```

### 6.3 Formato Estándar de Propuesta

```markdown
# PROPUESTA: [TÍTULO]

**Tipo:** Constitucional | Monetaria | Estratégica | Operativa | Técnica | Territorial
**Autor:** [RAO ID] (CDS: [score])
**Fecha:** [timestamp]
**Deadline Votación:** [timestamp]

## Resumen Ejecutivo
[2-3 líneas]

## Contexto y Justificación
[Por qué, datos de apoyo, alternativas consideradas]

## Impacto
- **Económico:** [ZNU/USDC/TQ afectados]
- **Técnico:** [Specs, código, infraestructura]
- **Social:** [Miembros afectados, derechos]
- **Territorial:** [Tierra, agua, energía]
- **Riesgos:** [Identificados, mitigaciones]

## Implementación
- **Fases:** [1, 2, 3...]
- **Responsables:** [RAO IDs]
- **Métricas de éxito:** [KPIs]
- **Rollback plan:** [Si falla]

## Análisis CDS
- **Autor CDS:** [score]
- **Afecta CDS gates:** [Sí/No]
- **Requiere CDS mínimo:** [threshold]

## Voto
- [ ] A favor
- [ ] En contra  
- [ ] Abstención
- [ ] OBJECIÓN BLOQUEANTE (solo tipo Constitucional/Monetaria, requiere fundamentación)
```

---

## 7. Comités Rotativos (3 meses)

### 7.1 Comité Técnico
- **Responsabilidad:** Specs, arquitectura, código, estándares, interoperabilidad
- **Composición:** 5-7 miembros (CDS ≥ 0.7, al menos 1 Núcleo)
- **Rotación:** 3 miembros salen, 3 entran cada 3 meses
- **Decisiones:** Consenso técnico (no votación)

### 7.2 Comité Económico
- **Responsabilidad:** Parámetros monetarios, streams, reparto Amid, bridge, priceParity
- **Composición:** 5-7 miembros (CDS ≥ 0.6, al menos 1 Núcleo, 1 Data Trust)
- **Rotación:** Igual
- **Decisiones:** Mayoría 60% (monetario) / 50%+1 (operativo)

### 7.3 Comité Territorial
- **Responsabilidad:** Land use, biohabitats, CSA, turismo, regeneración física
- **Composición:** 5-7 miembros (CDS ≥ 0.6, al menos 1 con landUseRights)
- **Rotación:** Igual
- **Decisiones:** Consentimiento local (afectados directos)

---

## 8. Veto (Solo Núcleo)

### 8.1 Cuándo Aplica
- Propuestas Constitucionales
- Propuestas Monetarias
- Cambios a principios fundacionales (E=V, Postulado 4, 1a1v)

### 8.2 Proceso de Veto

```
VETO EMITIDO (Núcleo unánime)
    │
    ▼
[Fundamentación obligatoria] → [Publicación 7 días] → [Mediación 14 días] → [Resolución]
    │                              │                       │                  │
    ▼                              ▼                       ▼                  ▼
Por escrito:                 Foro abierto:            Facilitador:        - Retiro veto
- Qué principio viola        Argumentos              Mediador neutral    - Modificación
- Qué daño causa             a favor/en contra       + comité rotativo   - Escalada a
- Alternativa propuesta      + datos                 + 1 Núcleo no       asamblea
                                                                   vetante
                                                                  - Veto sostenido
```

### 8.3 Límite de Veto
- Máx 2 vetos por Núcleo por año
- Veto abusivo (3+ vetos rechazados en mediación) → slash stake + revisión CDS

---

## 9. Resolución de Conflictos (Triaxial)

```
CONFLICTO DETECTADO
    │
    ▼
[Intento resolución local] → [Comité afectado] → [Mediación CDS] → [Arbitraje Kleros/Realitio] → [Ejecución]
    │                         │                    │                     │                  │
    ▼                         ▼                    ▼                     ▼                  ▼
Diálogo directo          Facilitador         Peso CDS de           Oráculo externo      Smart contract /
(48h)                    comité (7d)          cada parte (14d)    (si >$10k o         ledger update
                                                     principios)       (21d)
```

---

## 10. Auditoría RAO (Independiente)

### 10.1 Función
- Verificar vigencia RAO de todos los miembros
- Auditar procesos de votación (integridad, 1a1v)
- Certificar resultados de asambleas
- Detectar: sybil attacks, vote buying, CDS manipulation

### 10.2 Frecuencia
- **Continua:** Monitoreo automático (alertas)
- **Mensual:** Reporte de salud gobernanza
- **Trimestral:** Auditoría profunda + certificación
- **Event-driven:** Post asamblea extraordinaria/constitucional

---

## 11. Métricas de Salud Gobernanza

| KPI | Fórmula | Target |
|-----|---------|--------|
| **Participation Rate** | `votantes / elegibles` | > 0.6 |
| **Proposal Success Rate** | `aprobadas / totales` | 0.3 - 0.7 |
| **Veto Rate** | `vetos / propuestas constitucionales` | < 0.2 |
| **Mediation Success** | `resueltas mediación / totales` | > 0.8 |
| **CDS Distribution** | `Gini(CDS scores)` | < 0.4 |
| **Rotation Compliance** | `rotaciones a tiempo / programadas` | 1.0 |
| **Audit Pass Rate** | `auditorías limpias / totales` | > 0.95 |

---

## 12. Referencias

- `alrac-architecture.md` — Capa 5 definición
- `alrac-caas-membership.md` — Derechos por nivel, CDS gates
- `alrac-znu-indexing-credit.md` — Gobernanza 1a1v parámetros monetarios
- `alrac-fiat-layer.md` — Gobernanza cambio nivel ReFi
- `hscsg_definition.md` — 1a1v, CDS, subsidiaridad, Ley III MJ
- `ZEITNUS_REGENERATIVE_MODEL.md` — Gobernanza narrativa