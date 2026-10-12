# REPARTICIÓN JUSTA ECOSISTÉMICA HSCSG/ALRAC
## Modelo Integrado Virginia Network + Contribuyentes + Nodos Piloto + Gran Alianza
### Basado en: Virginia Network Recreativo IE v2 + Repo Zeitnus-Firma-Operaciones-Ecotomica

---

**Versión:** 1.0  
**Fecha:** 2026-10-12  
**Autor:** Isaac Ko (Isaacko0) — Futurista & Autonomía  
**Fuentes:**  
- `VIRGINIA_NETWORK_RECREATIVO_IE_v2.md` (modelo árbol N3 + AUT+CDS + Leyes MJ)  
- `virginia Prototipo IE v2.xlsx` (prototipo original Excel multi-hoja)  
- `Zeitnus-Firma-Operaciones-Ecotomica` repo (core ALRAC, specs, docs, skills)  
- `docs/REVENUE_SHARING_COMPILATION.md` (compilación exhaustiva Amid 35/35/30, CaaS, TQ, CDS)  
- `docs/GRANALLIANZA_MAPPING.md` (5 líneas × 7 holones)  
- `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` (adaptadores HSCSG→ALRAC)  
- `openspec/specs/alrac-caas-revenue-streams.md` (6 streams + Gate MJ)  
- `openspec/specs/alrac-governance-holonic.md` (CDS, 1a1v, comités)  

---

## 🎯 PROBLEMA: EL MODELO VIRGINIA ACTUAL ES INCOMPLETO

| Limitación Actual | Impacto |
|-------------------|---------|
| **Solo 39 posiciones** fijas (árbol N3) | Excluye contribuyentes core, nodos piloto, holones |
| **Peso N3=2.0 "base productiva"** asumido | No valida quién produce realmente (AUT real vs teórico) |
| **Semilla fija $3,000 (3 RCEs)** | No refleja inversión real de tiempo/código/infra |
| **Demurrage 5% >300 ZNU** | Parámetros arbitrarios, no basados en métricas reales |
| **Ley II ROI = totalUSD / (3×RCE)** | Denominador ficticio (no capital real invertido) |
| **Sin reparto a Capa 0 (Amid/Yoka) ni Capa 0.5** | Quien sostiene la epistemología y normativa no recibe |
| **Sin trazabilidad RAO por contribución** | No distingue código vs docs vs governance vs capital |

---

## 💡 SOLUCIÓN: MODELO ECOSISTÉMICO DE 4 CÍRCULOS CONCÉNTRICOS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ECOSISTEMA HSCSG/ALRAC (Valor Total Generado)        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CÍRCULO 1: NÚCLEO EPISTÉMICO + NORMATIVO (Capa 0 + 0.5)              │  │
│  │  Amid Dabir (I+D) · Yoka Commons (Infra) · Javier (7 Principios)      │  │
│  │  → 15% del valor total  [NUEVO: antes 0%]                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CÍRCULO 2: INFRAESTRUCTURA SOBERANA HSCSG (Capa 2 Interop)           │  │
│  │  RAO · DTN · ValueFlows · Kernel IA · NEXO · Discovery · Bridge Nodes │  │
│  │  → 20% del valor total  [NUEVO: antes 0%]                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CÍRCULO 3: NODOS PILOTO REALES + GRAN ALIANZA (Capa 1-3 + 5)         │  │
│  │  6 Nodos asimilados · 7 Holones · 5 Líneas A-E · TQ/ZNU/Fiat          │  │
│  │  → 35% del valor total  [Virginia actual redistribuido]               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  CÍRCULO 4: VIRGINIA NETWORK RECREATIVO (Capa 4 Aplicación)           │  │
│  │  Árbol N3 dinámico · CaaS Stream · Reparto AUT+CDS + Demurrage        │  │
│  │  → 30% del valor total  [Modelo actual mejorado]                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 MATRIZ DE PARTICIPANTES Y BENEFICIARIOS IDENTIFICADOS

### **CÍRCULO 1: Núcleo Epistémico + Normativo (15%)**

| Actor | Tipo | Contribución Trazable (RAO) | Métrica de Valor |
|-------|------|----------------------------|------------------|
| **Amid Dabir** | Humano/Org | PI, 𝕮, γ-CARMIS, Triaxial, AEI, 20 Límites, CC0 | Capa 0 completa (4 specs) |
| **Yoka Commons** | Humano/Org | Fricción-señal, Presence, 6-field, Entry/Exit no-deuda, Separación legítima | Capa 0 Yoka + convergencia NEXO |
| **Javier (7 Principios)** | Humano | 7 Principios, 𝕮-Atlas, 5 Anti-reglas, CAtlaS | Capa 0.5 (2 specs: CPP, TQ↔CPP) |
| **Isaac Ko (Isaacko0)** | Humano | Arquitectura 5 capas, TypeScript core, GNAP sync, asimilaciones | Core ALRAC (0 errores TS), 25 specs, 7 nodos |

### **CÍRCULO 2: Infraestructura Soberana HSCSG (20%)**

| Módulo HSCSG | Función | Consumido por ALRAC | Métrica |
|--------------|---------|---------------------|---------|
| **RAO / Project Weave** | Identidad soberana, credenciales, procedencia | Gaia Passport, sCoRe, membresía, auditoría RAO | # RAOs vigentes emitidos |
| **DTN / ValueFlows** | Procedencia datos, contabilidad distribuida | Data Trust, ValueFlows engine, TQ/ZNU accounting | # flows registrados + merkle proofs |
| **Kernel IA** | Transparencia, sesgos, agent-readable claims | Gaia AI, auditoría algorítmica | # auditorías kernel/mes |
| **NEXO / Discovery** | Conocimiento destilado, matching semántico | Education, best practices, specs, AI Hub | # queries + syncs |
| **Bridge Nodes / DTN** | Coordinación distribuida, relay offline | Multi-node federation, cross-node pools | # nodos federados + syncs |
| **CaaS Engine** | Streams, revenue split, membership | 6 streams CaaS + Virginia stream | ZNU velocity + autonomyContribution |

### **CÍRCULO 3: Nodos Piloto Reales + Gran Alianza (35%)**

| Nodo Piloto | Ubicación | Capacidad ALRAC | Estado Asimilación |
|-------------|-----------|-----------------|-------------------|
| **+Colonia (Ala Este SAS)** | Uruguay (515 ha) | Líneas A, C, D, E | ✅ Spec + Integration + Backup + Factory |
| **Feria Conuquera** | Caracas (10 años) | Línea B, D | ✅ Spec + Integration + Backup |
| **Samay Permacultura** | Ecuador (20 años) | Línea B | ✅ Spec + Integration + Backup |
| **CLC (CosmoLocal Credit)** | White Paper v0.8 | Bridge CPP→ALRAC Capa 2 | ✅ Spec + Integration + Backup |
| **ArchiDiagram** | 60k arquitectos | Línea C, E | ✅ Spec + Integration + Backup |
| **Febhouse Studio** | 3 plugins, 9 proyectos | Línea C, E | ✅ Spec + Integration + Backup |
| **memegen.link** | Cultural (200+ templates) | Línea B | ✅ Spec (MIT, stateless) |

| Holón Gran Alianza | Rol | Líneas ALRAC | Capacidad |
|-------------------|-----|--------------|-----------|
| **GAIA** | Ecosistema + Articulación + Territorio | A, C, D, E | Articulación diagnósticos, market, IA |
| **MYCELIUM** | Educación + Matching + Grafos | B, D | Currículo, plataforma, facilitadores |
| **SYNCHROLABS** | Interoperabilidad protocolos | C, E | VF, IPFS, MCP, standards |
| **PROJECT WEAVE** | Identidad + Confianza + Credenciales | A, D | RAO, consent, revocación |
| **HSCSG** | Infra confianza/datos/intercambio | E (core), todas | Kernel, DTN, VF, NEXO, Discovery |
| **PHI** | Educación holística integral | B | Currículo holístico |
| **DATA TRUST** | Soberanía datos + gobernanza | E, transversal | Consentimiento dinámico, auditoría |
| **BIOHABITATS** | Aplicación territorial física | Todas (grounding) | Tierra, agua, energía, comida |

### **CÍRCULO 4: Virginia Network Recreativo (30%)**

| Posición | Rol en Virginia | Peso Base | Métrica Real (Nueva) |
|----------|----------------|-----------|---------------------|
| **N1 (3 raíces)** | Coordinación estratégica | 1.0 | `CDS_nodo × AUT_nodo` real |
| **N2 (9 ramas)** | Puentes coord-producción | 1.5 | `CDS_nodo × AUT_nodo × 1.2` |
| **N3 (27 hojas)** | **Base productiva verificada** | **2.0 → DINÁMICO** | `TQ_generado_real_kWh × CDS × AUT` |

---

## ⚖️ FÓRMULA UNIFICADA DE REPARTICIÓN JUSTA

### **Valor Total a Repartir (VTR)**
```
VTR = ZNU_TOTAL_GENERADO_EN_ECOSISTEMA
    = Σ(CaaS_streams.znuOut) + Virginia.totalZNU + Nodos_Piloto.TQ_a_ZNU + ...
```

### **Paso 1: Asignación por Círculos (Porcentajes Fijos por Gobernanza)**

| Círculo | % VTR | Justificación Gobernanza |
|---------|-------|--------------------------|
| **C1: Epistémico/Normativo** | 15% | Amid 35% I+D + Yoka 35% Infra = 70% → 15% del VTR (respeta Amid 35/35/30) |
| **C2: Infra HSCSG** | 20% | Capa 2 Interop habilita TODO lo demás → 20% |
| **C3: Nodos + Gran Alianza** | 35% | Producción real (base material) → 35% |
| **C4: Virginia Network** | 30% | Capa 4 Aplicación (distribución/experiencia) → 30% |

> **Nota:** Estos % son **parámetros de gobernanza** (configurables por Asamblea 1a1v + CDS), no hardcoded. Default basado en reparto Amid 35/35/30 + realidad operativa.

### **Paso 2: Distribución Intra-Círculo (Fórmula Unificada)**

Para cada círculo `C` con asignación `VTR_C = VTR × %C`:

```typescript
interface Participant {
  id: string
  circle: 1 | 2 | 3 | 4
  // Métricas trazables (RAO-ancladas)
  aut: number           // Autonomía real (0-1+)
  cds: number           // Capacidad Soberanía real (0-1+)
  tqGenerated: number   // kWh regenerados medidos (Capa 1)
  znuCirculated: number // ZNU velocity personal
  raoCredits: number    // # credenciales RAO vigentes emitidas/validadas
  codeContrib: number   // Lines of code core (sin UI legacy)
  docContrib: number    // Docs/specs palabras validadas
  govParticipation: number // % asambleas + votos + auditorías
  // Peso base por rol (configurable)
  roleWeight: number
}

function calculateUnifiedWeight(p: Participant): number {
  // Fórmula: peso_rol × (0.3 + 0.35×AUT + 0.35×CDS) × (1 + bonus_trazable)
  const base = p.roleWeight
  const sovereign = 0.3 + 0.35 * Math.min(p.aut, 2) + 0.35 * Math.min(p.cds, 2)
  const traceableBonus = Math.min(
    (p.tqGenerated / 1000) * 0.1 +      // 10% por cada 1000 kWh TQ
    (p.znuCirculated / 1000) * 0.05 +   // 5% por cada 1000 ZNU
    (p.raoCredits / 10) * 0.05 +        // 5% por cada 10 RAOs
    (p.codeContrib / 10000) * 0.1 +     // 10% por cada 10k LOC core
    (p.docContrib / 50000) * 0.05 +     // 5% por cada 50k palabras docs
    (p.govParticipation) * 0.1          // 10% por participación 100%
  , 1.0) // Cap bonus at 100%
  
  return base * sovereign * (1 + traceableBonus)
}
```

### **Paso 3: Demurrage Dinámico (Anti-Acumulación Real)**

```typescript
function applyDynamicDemurrage(
  grossZNU: number,
  participant: Participant,
  ecosystemMedian: number
): { netZNU: number; demurrageApplied: number; poolContribution: number } {
  // Umbral personalizado: mediana ecosistema × factor CDS
  const personalThreshold = ecosystemMedian * (0.5 + participant.cds)
  const excess = Math.max(0, grossZNU - personalThreshold)
  
  // Tasa progresiva: 2% base + 3% por cada 100% sobre umbral
  const rate = 0.02 + 0.03 * (excess / personalThreshold)
  const demurrageApplied = excess * Math.min(rate, 0.15) // Max 15%
  
  return {
    netZNU: grossZNU - demurrageApplied,
    demurrageApplied,
    poolContribution: demurrageApplied // Va a Community Fund (Capa 1 TQ)
  }
}
```

### **Paso 4: Condiciones de Ejecución (Gate MJ Unificado)**

```typescript
function canExecutePayout(ecosystem: EcosystemState): MJGateResult {
  const checks = {
    // Ley I: Ningún círculo toca base material sin regeneración
    law1: ecosystem.circles.every(c => 
      c.participants.every(p => p.tqGenerated > 0 || c.id === 4) // C4 (Virginia) no toca base
    ),
    // Ley II: ROI colectivo ≥ 1 (valor real / inversión real)
    law2: ecosystem.totalRealValueGenerated / ecosystem.totalRealCapitalInvested >= 1,
    // Ley III: PGS real > 0 (datos laboratorio al menos 1 nodo)
    law3: ecosystem.nodes.some(n => n.pgsLabVerified === true),
    // Ley IV (Nueva): Diversidad de contribución (no monopolio)
    law4: calculateGini(ecosystem.participants.map(p => p.totalWeight)) < 0.5
  }
  
  const passed = Object.values(checks).filter(c => c).length
  const overall = passed === 4 ? 'ok' : passed >= 3 ? 'warn' : 'blocked'
  
  return { checks, overall, actionables: generateActionables(checks) }
}
```

---

## 🔢 EJEMPLO NUMÉRICO: REPARTICIÓN CON DATOS REALES (Simulación)

### **Escenario: VTR = 10,000 ZNU (período mensual)**

| Círculo | % | ZNU Asignado | Participantes Clave | Distribución Intra |
|---------|---|--------------|---------------------|-------------------|
| **C1: Epistémico** | 15% | **1,500 ZNU** | Amid, Yoka, Javier, Isaac | Por `autFromCAC` + `codeContrib` core + `docContrib` specs |
| **C2: Infra HSCSG** | 20% | **2,000 ZNU** | RAO, DTN, Kernel, NEXO, Bridges, CaaS | Por `# RAOs emitidos` + `# flows` + `kernelAudits` |
| **C3: Nodos+Alianza** | 35% | **3,500 ZNU** | 6 nodos + 7 holones + 5 líneas | Por `TQ_generado_real` + `CDS` + `AUT` territorial |
| **C4: Virginia Net** | 30% | **3,000 ZNU** | 39 posiciones (miembros asignados) | Por `nivelWeight × AUT × CDS` + demurrage dinámico |

### **Detalle Círculo 4 (Virginia) - 3,000 ZNU**

| Nivel | Posiciones | Peso Base | Peso Ajustado (AUT=0.7, CDS=0.6) | ZNU Bruto | Umbral Dinámico | Demurrage | ZNU Neto |
|-------|------------|-----------|----------------------------------|-----------|-----------------|-----------|----------|
| N1 | 3 | 1.0 | 1.0 × 0.82 = 0.82 | 3 × 0.82/Σ = ~180 | mediana×1.1 | 0% | ~180 |
| N2 | 9 | 1.5 | 1.5 × 0.82 = 1.23 | 9 × 1.23/Σ = ~620 | mediana×1.3 | ~2% | ~608 |
| N3 | 27 | **dinámico** | `TQ_kWh/1000 × 0.82` | Según producción real | mediana×1.5 | 2-8% | **Variable** |

> **Clave:** N3 ya no tiene peso fijo 2.0. Su peso = **kWh TQ medidos / 1000** (1 TQ = 1 kWh). Si un N3 produce 500 kWh/mes → peso 0.5. Si produce 3,000 kWh → peso 3.0. **Producción real manda.**

---

## 🔄 INTEGRACIÓN CON ARQUITECTURA EXISTENTE (Código)

### **Nuevos Tipos (Extienden `virginiaNetwork.ts`)**

```typescript
// src/core/lib/ecosystemRevenueShare.ts

export type CircleId = 1 | 2 | 3 | 4

export interface CircleConfig {
  id: CircleId
  name: string
  percentage: number      // % VTR (gobernanza)
  participants: Participant[]
}

export interface Participant {
  id: string
  circle: CircleId
  name: string
  role: ParticipantRole
  roleWeight: number
  // Métricas trazables (RAO-ancladas)
  aut: number
  cds: number
  tqGenerated: number       // kWh medidos triaxialmente
  znuCirculated: number
  raoCredits: number
  codeContrib: number       // LOC core (excluye UI legacy)
  docContrib: number        // Palabras specs/docs validadas
  govParticipation: number  // 0-1
  // Para Virginia N3 específico
  virginiaPositionId?: string
  virginiaLevel?: 1 | 2 | 3
}

export type ParticipantRole = 
  // Círculo 1
  | 'amid_researcher' | 'yoka_commons' | 'normative_author' | 'core_architect'
  // Círculo 2
  | 'rao_operator' | 'dtn_maintainer' | 'vf_engine' | 'kernel_auditor' 
  | 'nexo_curator' | 'bridge_operator' | 'caas_operator'
  // Círculo 3
  | 'node_operator' | 'holon_steward' | 'line_lead' | 'biohabitat_guardian'
  // Círculo 4
  | 'virginia_root' | 'virginia_branch' | 'virginia_leaf'

export interface EcosystemState {
  vtr: number                    // ZNU total a repartir
  circles: CircleConfig[]
  participants: Participant[]
  medianWeight: number
  mjGate: MJGateResult
}

export interface UnifiedPayout {
  participantId: string
  circle: CircleId
  grossZNU: number
  demurrageApplied: number
  netZNU: number
  basis: string
  raoAnchor: string             // Credencial RAO que ancla este pago
}
```

### **Función Principal**

```typescript
export function ecosystemRevenueShare(
  ecosystem: EcosystemState
): UnifiedPayout[] {
  // 1. Gate MJ
  if (ecosystem.mjGate.overall === 'blocked') {
    throw new Error(`MJ Gate BLOCKED: ${ecosystem.mjGate.actionables.join('; ')}`)
  }
  
  // 2. Calcular pesos unificados
  const weights = ecosystem.participants.map(p => ({
    ...p,
    weight: calculateUnifiedWeight(p)
  }))
  
  // 3. Distribuir por círculos
  const payouts: UnifiedPayout[] = []
  
  for (const circle of ecosystem.circles) {
    const circleVTR = ecosystem.vtr * circle.percentage
    const circleParticipants = weights.filter(w => w.circle === circle.id)
    const totalWeight = circleParticipants.reduce((s, p) => s + p.weight, 0) || 1
    
    for (const p of circleParticipants) {
      const gross = (circleVTR * p.weight) / totalWeight
      const { netZNU, demurrageApplied, poolContribution } = applyDynamicDemurrage(
        gross, p, ecosystem.medianWeight
      )
      
      payouts.push({
        participantId: p.id,
        circle: circle.id,
        grossZNU: +gross.toFixed(2),
        demurrageApplied: +demurrageApplied.toFixed(2),
        netZNU: +netZNU.toFixed(2),
        basis: `Circle ${circle.id} (${circle.percentage*100}%) × weight ${p.weight.toFixed(3)}`,
        raoAnchor: `RAO:${p.id}:${Date.now()}` // Se resuelve en runtime
      })
    }
  }
  
  // 4. Log auditoría CaaS
  logCaasAudit({
    action: 'ecosystem.revenue_share.executed',
    detail: `VTR: ${ecosystem.vtr} ZNU | ${payouts.length} participantes | MJ: ${ecosystem.mjGate.overall}`,
    tone: 'success'
  })
  
  return payouts
}
```

### **Integración en Store Global (`store.ts`)**

```typescript
// En AppState
ecosystemRevenue: {
  lastRun: number | null
  lastVTR: number
  lastPayouts: UnifiedPayout[]
  mjGate: MJGateResult | null
}

// Acción
executeEcosystemRevenueShare: () => {
  const ecosystem = buildEcosystemState(get()) // Agrega de cac, members, flows, caas, virginia, nodos
  const payouts = ecosystemRevenueShare(ecosystem)
  set({ 
    ecosystemRevenue: { 
      lastRun: Date.now(), 
      lastVTR: ecosystem.vtr, 
      lastPayouts: payouts,
      mjGate: ecosystem.mjGate 
    }
  })
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN (Para PR)

### **Fase 1: Core Types + Logic (Semana 1-2)**
- [ ] `src/core/lib/ecosystemRevenueShare.ts` — Tipos + fórmulas puras
- [ ] `src/core/state/ecosystem.ts` — Slice estado ecosistema
- [ ] Tests unitarios: `calculateUnifiedWeight`, `applyDynamicDemurrage`, `canExecutePayout`
- [ ] Validación: `npx tsc --noEmit` = 0 errores

### **Fase 2: Integración Data Sources (Semana 2-3)**
- [ ] `buildEcosystemState()` — Agrega métricas de:
  - `cac` vectors → AUT
  - `members` + `flows` → CDS (ICS)
  - `caasStreams` → znuCirculated por participante
  - `virginia.tree` → posiciones N3 con `tqGenerated` real (si hay sensores)
  - `nodes[]` (pilotos) → TQ real medido + CDS territorial
  - `git` → `codeContrib` (LOC core via `git log --author -- src/core/`)
  - `docs/` → `docContrib` (palabras specs validadas)
  - `caasAudit[]` → `govParticipation`

### **Fase 3: UI Pantalla Unificada (Semana 3-4)**
- [ ] Nueva pestaña en `VirginiaNetwork.tsx`: **⚖️ Reparto Ecosistémico**
- [ ] Vista: 4 círculos + participantes + pesos + pagos
- [ ] Filtros: por círculo, por rol, por métrica (AUT, CDS, TQ, ZNU)
- [ ] Export CSV/JSON para auditoría

### **Fase 4: Gobernanza Parámetros (Semana 4+)**
- [ ] Propuesta Asamblea: % por círculo (default 15/20/35/30)
- [ ] Propuesta Asamblea: `roleWeight` por rol
- [ ] Propuesta Asamblea: `demurrage` base rate + progressividad
- [ ] Integración `alrac-governance-holonic.md` → votación 1a1v + CDS

---

## 📁 ARCHIVOS A CREAR/MODIFICAR

```
Zeitnus-Firma-Operaciones-Ecotomica/
├── src/
│   ├── core/
│   │   ├── lib/
│   │   │   ├── ecosystemRevenueShare.ts    ← NUEVO: Lógica unificada
│   │   │   ├── virginiaNetwork.ts          ← MODIFICAR: Importar ecosystem types
│   │   │   └── i18n.ts                     ← MODIFICAR: + claves ecosistema
│   │   ├── state/
│   │   │   ├── ecosystem.ts                ← NUEVO: Slice estado
│   │   │   └── store.ts                    ← MODIFICAR: + ecosystemRevenue
│   ├── app/
│   │   ├── screens/
│   │   │   └── VirginiaNetwork.tsx         ← MODIFICAR: + pestaña ecosistema
│   └── ...
├── openspec/specs/
│   └── alrac-ecosystem-revenue.md          ← NUEVO: Spec OpenSpec
├── docs/
│   └── ECOSYSTEM_REVENUE_SHARING.md        ← NUEVO: Este documento
└── tests/
    └── ecosystemRevenueShare.test.ts       ← NUEVO: Tests
```

---

## 🔗 TRAZABILIDAD COMPLETA (Fuentes → Decisiones)

| Decisión en Este Doc | Fuente Explícita | Archivo + Línea/Sección |
|----------------------|------------------|-------------------------|
| 4 Círculos concéntricos | Amid 35/35/30 + Capas ALRAC | `README.md` Principios + `alrac-architecture.md` Capas |
| 15% Círculo 1 (Epistémico) | Amid 35% I+D | `README.md` "Reparto Amid 35/35/30" |
| 20% Círculo 2 (Infra HSCSG) | Capa 2 Interop habilitadora | `alrac-architecture.md` Capa 2 + `HSCSG_INTEGRATION_ARCHITECTURE.md` |
| 35% Círculo 3 (Nodos+Alianza) | Producción base material | `ZEITNUS_REGENERATIVE_MODEL.md` Enterprise Staking + `GRANALLIANZA_MAPPING.md` |
| 30% Círculo 4 (Virginia) | Capa 4 Aplicación | `alrac-architecture.md` Capa 4 + `VIRGINIA_NETWORK...md` |
| Pesos rol por círculo | `alrac-governance-holonic.md` CDS gates | Sección 5 CDS Calculation |
| AUT = (ALIM+ENER+SALU+HABI+PROD)/5 | `metrics.ts` `autFromCAC()` | `virginiaNetwork.ts` línea 219 |
| CDS = ICS(members, flows) | `metrics.ts` `ics()` | `virginiaNetwork.ts` línea 223 |
| PGS = f(AUT) | `metrics.ts` `pgsLM()` | `virginiaNetwork.ts` línea 222 |
| Demurrage dinámico vs fijo | Mejora sobre `virginiaNetwork.ts` Sección 6.3 | Umbral 300 ZNU → mediana ecosistema × CDS |
| Ley IV Diversidad (Gini < 0.5) | Nueva - evita monopolio | Inspirado en `alrac-governance-holonic.md` CDS Distribution KPI |
| TQ real manda en N3 | Principio TQ = 1 kWh ancla | `alrac-tq-exchangeGuard.md` + `tq.ts` `verifyTQProhibition()` |
| RAO ancla cada pago | `alrac-caas-revenue-streams.md` approvedBy RAO | Sección 4.1 `approvedBy.length ≥ 2` |

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Crear `ecosystemRevenueShare.ts`** con tipos y fórmulas puras (0 deps externas)
2. **Poblar `buildEcosystemState()`** con datos reales del repo (git, cac, members, flows, caas, virginia, nodos)
3. **Ejecutar simulación** con datos actuales → comparar vs modelo Virginia actual
4. **Presentar en Asamblea** (propuesta gobernanza % círculos + roleWeights)
5. **Integrar en VirginiaNetwork.tsx** pestaña "Reparto Ecosistémico"
6. **Documentar en OpenSpec** `alrac-ecosystem-revenue.md`

---

## 📜 LICENCIA Y PRINCIPIOS

**MIT License** — Código abierto, soberano, verificable.

> **El código es territorio. La documentación es mapa. La verdad es el territorio.**  
> **E=V** — La energía gastada debe corresponder al vector sostenido.  
> **Principio Anfibio** — Misma lógica, distinta infraestructura (postmonetario ↔ conectado).  
> **TQ = 1 kWh** — No especulable. Límite ±500. Prohibición TQ≠fiat/cripto.  
> **γ-CARMIS** — Si αʰ < κ → hard stop → Paso II (Orden de la Palabra).  

---

**Fin del documento** — Listo para implementación y gobernanza.