# ALRAC CaaS Revenue Streams Spec

**Capa:** 2 — Interoperabilidad (CaaS/HSCSG)  
**Versión:** 1.0  
**Estado:** Draft  
**Fecha:** 2026-09-19  
**Autor:** ALRAC Coordinator (simulación autónoma)

---

## 1. Propósito

Definir la estructura, validación y ciclo de vida de los **CaaS Revenue Streams** (flujos de ingresos Community-as-a-Service) dentro del Consorcio ALRAC. Cada stream representa una línea de valor que genera ingresos en USDC/ZNU y alimenta el reparto Amid (35/35/30).

---

## 2. Tipos de Stream (CaaSStreamKey)

| Key | Nombre | Descripción | Toca Base Material |
|-----|--------|-------------|-------------------|
| `suscripcion` | Suscripción Base | Membresía recurrente (Núcleo/Asociados/Afiliados) | No |
| `revenue_share` | Revenue Share | Participación en ingresos de proyectos federados | Sí |
| `b2b` | B2B Services | Servicios a empresas/organizaciones externas | Sí |
| `afiliados_verdes` | Afiliados Verdes | Red de referidos y embajadores | No |
| `educacion` | Educación | Cursos, certificaciones, entrenamientos | Parcial |
| `csa_subscription` | CSA Subscription | Agricultura Sostenida por la Comunidad (riesgo compartido) | **Sí** |

---

## 3. Interfaz Canónica (TypeScript)

```typescript
export interface CaaSRevenueStream {
  // Identidad
  key: CaaSStreamKey;
  name: string;
  enabled: boolean;

  // Contexto de ingreso (Gate MJ)
  usdcIn: number;           // USD/USDC ingresados este período
  znuOut: number;           // ZNU emitidos/asignados este período
  touchesBaseMaterial: boolean;  // ¿Afecta base material (tierra, energía, agua)?

  // Métricas derivadas
  conversionRate: number;   // znuOut / usdcIn (priceParity implícita)
  velocity: number;         // Rotación ZNU por período
  autonomyContribution: number;  // Aporte a AUT nodal (0-1)

  // Gobernanza
  approvedBy: string[];     // RAO IDs de aprobadores
  lastAudit: number | null; // Timestamp última auditoría
  status: 'active' | 'paused' | 'pending_review' | 'closed';

  // Extensibilidad (Principio Anfibio)
  [key: string]: any;       // Permite campos específicos por stream (ej: CSA riskSharing)
}
```

---

## 4. Reglas de Validación (Gate MJ)

### 4.1 Pre-condiciones para `enabled: true`

```
✓ usdcIn > 0  (al menos 1 período con ingreso real)
✓ znuOut > 0  (emisión ZNU correspondiente)
✓ conversionRate dentro de [priceParity * 0.95, priceParity * 1.05]
✓ approvedBy.length ≥ 2 (mínimo 2 RAO vigentes)
✓ status === 'active'
✓ Si touchesBaseMaterial === true → requiere triaxial verification vigente
```

### 4.2 Post-condiciones (por período)

- `velocity` debe ser > 0.1 (ZNU circula, no acumula)
- `autonomyContribution` ≥ 0.3 (aportan a autonomía nodal)
- `lastAudit` ≤ 90 días (auditoría trimestral obligatoria)

---

## 5. Stream Específico: CSA Subscription (`csa_subscription`)

### 5.1 Campos Extendidos

```typescript
interface CSASubscriptionStream extends CaaSRevenueStream {
  key: 'csa_subscription';
  
  riskSharing: {
    abundanceMultiplier: number;      // 1.5x en abundancia (cosecha buena)
    scarcityBuffer: number;           // 0.7x en escasez (cosecha mala)
    communicationProtocol: string;    // 'weekly_transparent_report'
  };
  
  ambassadorProgram: {
    referralZnuBonus: number;         // ZNU por miembro referido
    ambassadorTier: 'bronze' | 'silver' | 'gold';
    benefits: string[];               // ['visitas_gratis', 'talleres', 'prioridad_cosecha']
  };
  
  transparency: {
    weeklyUpdate: boolean;            // Estado finca (abundancia/escasez)
    soilHealthReport: boolean;        // Métricas suelo (kWh, carbono)
    financialTransparency: boolean;   // OPEX, márgenes, reinversión
  };
  
  // Métricas CSA específicas
  harvestKwh: number;                 // kWh equivalentes cosechados
  memberCount: number;                // Familias suscritas
  hectaresManaged: number;            // Tierra bajo gestión regenerativa
}
```

### 5.2 Lógica de Riesgo Compartido

```
INGRESO MIEMBRO = basePrice * (abundanceMultiplier | scarcityBuffer)
    │
    ├─► Si harvestKwh ≥ expectedKwh * 1.2 → abundanceMultiplier (1.5x)
    ├─► Si harvestKwh ≤ expectedKwh * 0.8 → scarcityBuffer (0.7x)
    └─► Else → 1.0x (precio base)

ZNU EMITIDO = INGRESO MIEMBRO / priceParity
TQ GENERADO = harvestKwh (1 TQ = 1 kWh ancla)
```

---

## 6. Ciclo de Vida del Stream

```
CREATED → PENDING_REVIEW → ACTIVE → (PAUSED | CLOSED)
                │
                ▼
         [Gate MJ + 2 RAO + Triaxial si base material]
                │
                ▼
         ACTIVE → Periódico: velocity check, audit, autonomy check
                │
                ├─► PAUSED: si velocity < 0.1 por 2 períodos
                └─► CLOSED: si status closed o auditoría fallida 3x
```

---

## 7. Integración con Reparto Amid (35/35/30)

```typescript
function calculateStreamAmidSplit(stream: CaaSRevenueStream): RevenueSplit {
  const totalUsdc = stream.usdcIn;
  const totalZnu = stream.znuOut;
  
  return {
    amidDabir: totalUsdc * 0.35,      // 35% → Investigación/Desarrollo (Amid)
    yokaCommons: totalUsdc * 0.35,    // 35% → Commons/Infraestructura (Yoka)
    nodeOperators: totalUsdc * 0.30,  // 30% → Operadores nodales
    // En ZNU equivalente:
    amidDabirZnu: totalZnu * 0.35,
    yokaCommonsZnu: totalZnu * 0.35,
    nodeOperatorsZnu: totalZnu * 0.30
  };
}
```

---

## 8. Métricas de Salud (KPIs)

| KPI | Fórmula | Target | Alerta |
|-----|---------|--------|--------|
| **Velocity** | `znuOut / znuBalance` | > 0.1/período | < 0.05 → PAUSED |
| **Conversion Rate** | `znuOut / usdcIn` | ≈ priceParity ±5% | > ±10% → REVIEW |
| **Autonomy Contribution** | `streamAutonomy / nodeAutonomy` | ≥ 0.3 | < 0.2 → REVIEW |
| **Base Material Ratio** | `streamsWithBaseMaterial / totalStreams` | ≥ 0.4 | < 0.3 → ALERT |
| **Audit Freshness** | `now - lastAudit` | ≤ 90 días | > 120 días → PAUSED |

---

## 9. Principio Anfibio (Postmonetario ↔ Conectado)

| Modo | Comportamiento |
|------|----------------|
| **Postmonetario** (default offline) | `usdcIn = 0`, `priceParity = 1`, ZNU = crédito interno 2-3%, TQ = kWh medidos |
| **Conectado** (Nivel 3 ReFi) | `usdcIn > 0`, `priceParity` = oráculo USDC, ZNU = puente, TQ = kWh + USD equivalencia |

**La lógica de cálculo es idéntica; solo cambia la unidad de cuenta y el oráculo.**

---

## 10. Referencias

- `alrac-architecture.md` — Capa 2 definición
- `alrac-revenue.md` — Reparto Amid general
- `alrac-tq-conversionFactor.md` — TQ ↔ ZNU conversion
- `alrac-governance.md` — Gobernanza holónica, 1a1v, CDS
- `ZEITNUS_REGENERATIVE_MODEL.md` — CSA, Turismo, Brand mapping