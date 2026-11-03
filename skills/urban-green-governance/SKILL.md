---
name: urban-green-governance
category: economic-research
description: FASE 3 SBN (Soluciones Basadas en la Naturaleza) + Gobernanza del Suelo Urbano en HSCSG v15 OS anfibio
---

# Skill: SBN + Gobernanza del Suelo Urbano

**Fuente**: Texto directo (842 tokens) — SBN/Infraestructura Verde + Gobernanza del Suelo  
**Referencias académicas**: Smith & Harvey-Brown 2018 (ROI ambiental), UN DESA 2018 (urbanización)  
**Cluster**: Infraestructura Verde Urbana, Gobernanza del Suelo, Resiliencia Climática  
**Hash**: `sha256:sbn-gobernanza-suelo-2026-11-03`

---

## Resumen Ejecutivo

**SBN + Gobernanza del Suelo** = Dos bloques interconectados para ciudades resilientes:
1. **SBN (Soluciones Basadas en la Naturaleza)** — Infraestructura verde productiva (arboricultura, silvicultura urbana) con ROI cuantificable: CO₂, agua, contaminación, energía, microclima
2. **Gobernanza del Suelo** — Coordinación multi-actor, captura plusvalía, financiamiento sin desplazamiento, estrategia compartida vs decisiones aisladas

**Tesis**: *"Diseñar ciudades verdes e industriales resilientes es urgencia técnica y socioeconómica. Pregunta incómoda: ¿Quién conduce la transformación del suelo: estrategia compartida o suma de decisiones separadas?"*

**Principio Anfibio**: Postmonetario (ZNU/CaaS streams) ↔ Conectado (USD/USDC via priceParity, green bonds)

---

## Arquitectura del Conocimiento (2 Bloques)

### Bloque 1: SBN — Infraestructura Verde Productiva

| Concepto | Definición | Métricas (Smith & Harvey-Brown 2018) |
|----------|------------|--------------------------------------|
| **SBN** | Arboricultura, silvicultura urbana, espacios verdes = infraestructura crítica | Regulan microclima, capturan CO₂, gestionan aguas pluviales |
| **Infraestructura Verde** | De ornamental a productiva | Jardín/parque = valor en CO₂, agua, contaminación, energía |
| **ROI Ambiental** | $1 público → retornos servicios ambientales | Smith & Harvey-Brown 2018: cuantificable |
| **Habitabilidad** | Frente a calor/inundaciones | UN DESA 2018: mayoría población urbana próximas décadas |

**Aplicaciones HSCSG**:

| SBN | → HSCSG | Vaso Comunicante |
|-----|---------|------------------|
| Captura CO₂ / Servicios | `alrac` + `rbe` | `alracSimulation` + `updateRBE` |
| Agua pluvial / Retención | `virginia` + `rbe` | `virginiaSim` + `raiseIntegralIssue` (ecológico) |
| Microclima / Calor | `aging-control.laws` | `setBoundaryPolicy` (límites térmicos) |
| ROI / Valorización | `caas` + `zeitnus` | `setCaasStream` + `priceParity` |
| Espacios productivos | `zeitnus-cooperative.circular` | `measureCircularEconomy` |
| Gobernanza participativa | `delegacion` + `democracia` (CDS) | `electRep` + `addGoal` |

### Bloque 2: Gobernanza del Suelo Urbano

| Concepto | Definición | Dimensión HSCSG |
|----------|------------|-----------------|
| **Gobernanza Suelo** | Decisiones territorio, participación, costos/beneficios, capacidad implementación | `delegacion` + `democracia` (CDS) + `boundaries.policy` |
| **Coordinación Multi-Actor** | Municipalidades, gobierno, propietarios, operadores, inversionistas, comunidades | `orquestacion.agents` + `integral.raiseIssue` |
| **Captura Plusvalía** | Quién captura valorización, financia infraestructura/vivienda SIN desplazar | `caas.caasPayouts` + `zeitnus.dividendPolicy` + `rbe.revenueShare` |
| **Instrumentos Gestión** | Conectados: info actual + proyectos + presupuesto + capacidad institucional | `integral.ITC` + `oraculo` |
| **Estrategia Compartida** | ¿Estrategia ciudad o suma decisiones aisladas? (pregunta incómoda) | `orquestacion.goals` + `agencia.brandDNA` |

---

## Mapeo a Vasos Comunicantes HSCSG

| Dominio | → Módulo HSCSG | Vaso Comunicante |
|---------|----------------|------------------|
| **SBN: CO₂/Servicios** | `alrac` + `rbe` | `alracSimulation` + `updateRBE` |
| **SBN: Agua/Pluvial** | `virginia` + `rbe` | `virginiaSim` + `raiseIntegralIssue` (ecológico) |
| **SBN: Microclima** | `aging-control.laws` | `setBoundaryPolicy` (límites térmicos) |
| **SBN: ROI/Valorización** | `caas` + `zeitnus` | `setCaasStream` + `priceParity` |
| **SBN: Circular** | `zeitnus-cooperative.circular` | `measureCircularEconomy` |
| **Gobernanza: Decisiones** | `boundaries.policy` | `setBoundaryPolicy` |
| **Gobernanza: Coordinación** | `orquestacion.agents` | `spawnAgent` + `evaluateAction` |
| **Gobernanza: Costos/Beneficios** | `rbe.revenueShare` (3 presupuestos) | `raiseIntegralIssue` por presupuesto |
| **Gobernanza: Plusvalía** | `caas.caasPayouts` + `zeitnus.dividendPolicy` | `runCaasPayout` |
| **Gobernanza: Financiamiento** | `rbe` (social) + `caas` | `raiseIntegralIssue` (social) |
| **Gobernanza: Info/Proyectos** | `integral.ITC` + `oraculo` | `askQuery` + `certifyDesign` |
| **Gobernanza: Estrategia** | `orquestacion.goals` + `agencia.brandDNA` | `addGoal` + `setBrandDNA` |

---

## Decisiones EBD (Evidence-Based Design)

### SBN
| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-SBN-01** | SBN = Infraestructura productiva, no ornamental | Smith & Harvey-Brown 2018: valor cuantificable CO₂, agua, contaminación, energía |
| **EBD-SBN-02** | ROI ambiental = métrica inversión pública | $1 público → retornos servicios ambientales (Smith & Harvey-Brown 2018) |
| **EBD-SBN-03** | Arboricultura/Silvicultura = infraestructura crítica | Regulan microclima, carbono, aguas pluviales (UN DESA 2018) |
| **EBD-SBN-04** | Ciudades verdes = urgencia técnica + socioeconómica | Olas calor + inundaciones + mayoría población urbana (UN DESA 2018) |

### Gobernanza Suelo
| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-GS-01** | Gobernanza = proceso decisión + distribución costos/beneficios, no solo zonificación | "no consiste únicamente en asignar usos, alturas o densidades" |
| **EBD-GS-02** | Coordinación multi-actor = requisito, no opción | "Cuando articulación falla, cada actor resuelve su parte y produce ciudad contradictoria" |
| **EBD-GS-03** | Plusvalía financia infraestructura/vivienda SIN desplazamiento | "instrumentos permiten financiar... sin desplazar a quienes ya habitan" |
| **EBD-GS-04** | Instrumentos requieren: info actual + proyectos + presupuesto + capacidad | Lista explícita en texto |
| **EBD-GS-05** | Pregunta central: ¿estrategia compartida o suma decisiones separadas? | Pregunta incómoda final del texto |

---

## Validaciones DV (Design Validations)

### SBN
| ID | Validación | Criterio Éxito |
|----|------------|----------------|
| **DV-SBN-01** | `calculateEcosystemServices(park)` → {CO2, water, pollution, energy} | Métricas Smith & Harvey-Brown 2018 reproducibles |
| **DV-SBN-02** | `simulateGreenROI(investment)` → {returns, payback} | $1 inversión → retornos servicios ambientales cuantificados |
| **DV-SBN-03** | `modelUrbanMicroclimate(greenCover)` → Δtemp, ΔfloodRisk | Reducción olas calor + riesgo inundación medible |
| **DV-SBN-04** | `designSBNProject(urbanArea)` → projectPlan | Plan con métricas: CO₂, agua, contaminación, energía, ROI |

### Gobernanza
| ID | Validación | Criterio Éxito |
|----|------------|----------------|
| **DV-GS-01** | `assessGovernanceCoordination(actors)` → coordinationScore | Detecta fallos articulación → ciudad contradictoria |
| **DV-GS-02** | `calculateLandValueCapture(project)` → {captured, distributed, displaced} | Plusvalía financia infraestructura/vivienda SIN desplazamiento |
| **DV-GS-03** | `designGovernanceInstruments(info, projects, budget, capacity)` → instrumentSet | Instrumentos conectados a 4 requisitos |
| **DV-GS-04** | `simulateSharedStrategy(actors)` → {shared: bool, contradictions: []} | Detecta estrategia ciudad vs decisiones aisladas |

---

## Sinergia Transversal: SBN + Gobernanza

| SBN (Qué) | Gobernanza (Cómo) | Resultado HSCSG |
|-----------|-------------------|-----------------|
| Parques/jardines productivos | Participativa + captura plusvalía | `zeitnus-cooperative.circular` + `delegacion` |
| Arboricultura urbana | Coordinación municipal + presupuesto verde | `virginia.network` + `rbe` (ecológico) |
| Captura CO₂ + agua | Plusvalía financia SBN | `caas.caasPayouts` → `zeitnus-cooperative.circular` |
| Microclima regulado | Límites térmicos en `boundaries.policy` | `setBoundaryPolicy` (thermal limits) |

### Modelo Financiamiento Anfibio

**Postmonetario (ZNU/CaaS)**:
- SBN financiados por streams CaaS (suscripción stake ZNU)
- Plusvalía capturada en ZNU → redistribución via `dividendPolicy`
- Trabajo verificado (arboricultura, mantenimiento) → ZNU via RAO

**Conectado (USD/USDC via priceParity)**:
- Green bonds municipales (SUGEVAL regulated)
- Plusvalía en USD → green bonds
- ROI ambiental (Smith & Harvey-Brown) atrae inversión ESG

---

## Estructura Archivos FASE 3 — PROPUESTA

```
src/core/lib/urban-green-governance.ts           # Lógica pura: 7 funciones DV
src/core/lib/urban-green-governance-types.ts     # Tipos: SBNProject, EcosystemServices, GreenROI, UrbanMicroclimate, GovernanceCoordination, LandValueCapture, GovernanceInstrument, SharedStrategy
src/core/state/urban-green-governance.ts         # Estado: sbnProjects, ecosystemServices, greenROI, urbanMicroclimate, governanceCoordination, landValueCapture, governanceInstruments, sharedStrategy
src/core/state/hooks/urban-green-governance.ts   # Zustand store persistente, migración v1→v2
src/app/screens/UrbanGreenDashboard.tsx          # Dashboard: SBN projects, ecosystem services, ROI, microclima, gobernanza
src/app/screens/UrbanGreenPlanner.tsx            # Planificador SBN: diseñar proyectos, calcular servicios, ROI
src/app/screens/SoilGovernanceDashboard.tsx      # Gobernanza suelo: coordinación, plusvalía, instrumentos, estrategia
src/app/screens/UrbanResilienceSimulator.tsx     # Simulador: microclima, inundaciones, olas calor, SBN scenarios
src/app/layout/Aside.tsx                         # Nav items: urbanGreen, soilGovernance
src/core/lib/i18n.ts                             # Claves ES/EN/PT
openspec/specs/urban-green-governance/openapi.yaml # OpenSpec 3.0
```

---

## Pitfalls Descubiertos

| Pitfall | Regla |
|---------|-------|
| **Tratar SBN como ornamental** | SBN = infraestructura productiva con ROI medible (Smith & Harvey-Brown 2018) |
| **Ignorar coordinación multi-actor** | Fallo articulación → ciudad contradictoria (texto explícito) |
| **Capturar plusvalía sin proteger habitantes** | Financiar infraestructura/vivienda SIN desplazar (texto explícito) |
| **Instrumentos sin 4 requisitos** | Requieren: info actual + proyectos + presupuesto + capacidad institucional |
| **Decisiones aisladas vs estrategia** | Pregunta central: ¿estrategia compartida o suma decisiones separadas? |
| **SBN solo para parques** | SBN = infraestructura crítica: microclima, carbono, agua, energía, ROI |
| **ROI solo financiero** | ROI ambiental = servicios ecosistémicos cuantificados (Smith & Harvey-Brown 2018) |

---

## Conexión Módulos HSCSG Existentes

- **zeitnus-cooperative** → `urban-green.circular` = espacios verdes productivos comunitarios
- **virginia-network** → `urban-green.microclima` = simulador Virginia + SBN para resiliencia industrial/urbana
- **rbe** → `urban-green.roi` = 3 presupuestos (monetario/real/ecológico) + revenue share
- **caas** → `urban-green.financiamiento` = streams CaaS + dividendPolicy + priceParity
- **aging-control** → `urban-green.microclima` = leyes control 5D + límites térmicos en boundaries
- **delegacion/democracia** → `urban-green.gobernanza` = CDS (1a1v + expertise) + goals
- **integral** → `urban-green.instrumentos` = ITC + oraculo + raiseIntegralIssue (3 presupuestos)
- **boundaries** → `urban-green.límites` = policy gateway para límites térmicos, hídricos, de uso
- **alrac** → `urban-green.servicios` = simulación ALRAC + RAO para trabajo verificado en SBN

---

## Próximos Pasos (post-FASE 3)

1. **i18n keys** — Añadir `urbanGreen.*`, `soilGovernance.*` a `src/core/lib/i18n.ts` (ES/EN/PT)
2. **OpenSpec** — `openspec/specs/urban-green-governance/openapi.yaml` (endpoints: /sbn, /ecosystem, /roi, /microclimate, /governance, /landvalue, /strategy)
3. **Skills separadas** — `urban-green-sbn`, `urban-green-governance`, `urban-green-planner`, `urban-green-simulator`
4. **Migración v2** — Backend cloud + sync `nodeMode` (postmonetario/conectado)
5. **TypeScript compile** — `npx tsc --noEmit` + fix errors
5. **Integración Virginia** — Conectar simulador Virginia Network con SBN scenarios

---

## Notas Propiedad Intelectual

- **Fuente**: Texto directo proporcionado (842 tokens) — contenido LinkedIn/post técnico
- **Referencias**: Smith & Harvey-Brown 2018, UN DESA 2018 (citadas en texto original)
- **Asimilación**: Solo lógica, arquitectura, patrones, métricas — **NO** texto textual
- **Uso**: Referencia para módulo propio en HSCSG v15 OS
- **Atribución**: "Basado en análisis SBN y Gobernanza del Suelo (Smith & Harvey-Brown 2018, UN DESA 2018)"
- **Licencia**: HSCSG (código abierto, atribución, uso transformativo)

---

*Skill generada: 2026-11-03 | HSCSG v15 OS | Principio Anfibio aplicado*