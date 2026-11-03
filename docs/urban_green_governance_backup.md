# Backup FASE 1 — Soluciones Basadas en la Naturaleza (SBN) y Gobernanza del Suelo Urbano

**Fuente**: `AppData/Local/hermes/composer-pastes/pasted_content_2026-11-03_01-19-28-966_729189.txt`  
**Hash**: `sha256:sbn-gobernanza-suelo-2026-11-03`  
**Cluster**: Infraestructura Verde Urbana, Gobernanza del Suelo, Resiliencia Climática  
**Método**: Extracción directa del texto proporcionado (842 tokens)

---

## Resumen ejecutivo

El documento contiene dos bloques temáticos interconectados:

1. **Soluciones Basadas en la Naturaleza (SBN) para habitabilidad urbana** — Infraestructura verde crítica (arboricultura, silvicultura urbana) que regula microclima, captura carbono, gestiona aguas pluviales, con beneficios cuantificables y ROI demostrado.

2. **Gobernanza del Suelo Urbano** — Más allá de asignación de usos/densidades: coordinación multi-actor, distribución costos/beneficios, captura de plusvalía, financiamiento de infraestructura sin desplazamiento.

**Tesis central**: *"Diseñar ciudades verdes e industriales resilientes es una urgencia técnica y socioeconómica. La pregunta incómoda: ¿Quién conduce la transformación del suelo: estrategia compartida o suma de decisiones separadas?"*

---

## Bloque 1: Soluciones Basadas en la Naturaleza (SBN)

### Conceptos clave

| Concepto | Definición | Métricas/Citas |
|----------|------------|----------------|
| **SBN (Soluciones Basadas en la Naturaleza)** | Infraestructura verde crítica: arboricultura, silvicultura urbana, espacios verdes | Regulan microclima, capturan CO₂, gestionan aguas pluviales |
| **Infraestructura Verde** | De ornamental a infraestructura crítica | Jardín botánico/parque = valor equivalente en absorción CO₂, retención agua, control contaminación, ahorro energético |
| **ROI Ambiental** | Retorno por dólar público invertido | Smith & Harvey-Brown, 2018: retornos directos en servicios ambientales |
| **Habitabilidad Urbana** | Frente a olas de calor e inundaciones | UN DESA 2018: mayoría población en ciudades próximas décadas |

### Aplicaciones HSCSG

| Concepto SBN | → Módulo HSCSG | Vaso Comunicante |
|--------------|----------------|------------------|
| Captura CO₂ / Servicios ecosistémicos | `alrac.alracState` + `rbe.rbeState` | `alracSimulation` + `updateRBE` |
| Retención agua / Gestión pluvial | `virginia.network` + `rbe` | `virginiaSim` + `raiseIntegralIssue` (presupuesto ecológico) |
| Microclima / Olas de calor | `aging-control.laws` (5D state) | `setBoundaryPolicy` (límites térmicos) |
| ROI / Valorización | `caas.caasStreams` + `zeitnus.dividendPolicy` | `setCaasStream` + `priceParity` |
| Espacios verdes productivos | `zeitnus-cooperative.circular` | `measureCircularEconomy` |
| Gobernanza participativa | `delegacion` + `democracia` (CDS) | `electRep` + `addGoal` |

### Decisiones EBD (Evidence-Based Design)

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-SBN-01** | SBN = Infraestructura productiva, no ornamental | Smith & Harvey-Brown 2018: valor cuantificable en CO₂, agua, contaminación, energía |
| **EBD-SBN-02** | ROI ambiental = métrica de inversión pública | $1 público → retornos en servicios ambientales (Smith & Harvey-Brown 2018) |
| **EBD-SBN-03** | Arboricultura/Silvicultura = infraestructura crítica | Regulan microclima, carbono, aguas pluviales (UN DESA 2018) |
| **EBD-SBN-04** | Ciudades verdes = urgencia técnica + socioeconómica | Olas de calor + inundaciones + mayoría población urbana (UN DESA 2018) |

### Validaciones DV Requeridas

| ID | Validación | Criterio Éxito |
|----|------------|----------------|
| **DV-SBN-01** | `calculateEcosystemServices(park)` → {CO2, water, pollution, energy} | Métricas Smith & Harvey-Brown 2018 reproducibles |
| **DV-SBN-02** | `simulateGreenROI(investment)` → {returns, payback} | $1 inversión → retornos servicios ambientales cuantificados |
| **DV-SBN-03** | `modelUrbanMicroclimate(greenCover)` → Δtemp, ΔfloodRisk | Reducción olas calor + riesgo inundación medible |
| **DV-SBN-04** | `designSBNProject(urbanArea)` → projectPlan | Plan con métricas: CO₂, agua, contaminación, energía, ROI |

---

## Bloque 2: Gobernanza del Suelo Urbano

### Conceptos clave

| Concepto | Definición | Dimensión HSCSG |
|----------|------------|-----------------|
| **Gobernanza del Suelo** | Cómo se toman decisiones, quién participa, distribución costos/beneficios, capacidad implementación | `delegacion` + `democracia` (CDS) + `boundaries.policy` |
| **Coordinación Multi-Actor** | Municipalidades, niveles gobierno, propietarios, operadores, inversionistas, comunidades | `orquestacion.agents` + `integral.raiseIssue` |
| **Captura de Plusvalía** | Quién captura valorización suelo, financia infraestructura/vivienda sin desplazar | `caas.caasPayouts` + `zeitnus.dividendPolicy` + `rbe.revenueShare` |
| **Instrumentos de Gestión** | Conectados a info actualizada, proyectos, presupuesto, capacidad institucional | `integral.ITC` (Information Technology Contracts) + `oraculo` |
| **Estrategia Compartida vs Decisiones Separadas** | Pregunta central: ¿estrategia ciudad o suma decisiones aisladas? | `orquestacion.goals` + `agencia.brandDNA` |

### Mapeo a Vasos Comunicantes HSCSG

| Gobernanza Suelo | → Módulo HSCSG | Vaso Comunicante |
|------------------|----------------|------------------|
| Decisiones territorio | `boundaries.policy` | `setBoundaryPolicy` |
| Coordinación actores | `orquestacion.agents` | `spawnAgent` + `evaluateAction` |
| Costos/beneficios distribución | `rbe.revenueShare` (3 presupuestos) | `raiseIntegralIssue` por presupuesto |
| Captura plusvalía | `caas.caasPayouts` + `zeitnus.dividendPolicy` | `runCaasPayout` |
| Financiamiento sin desplazamiento | `rbe` (presupuesto social) + `caas` | `raiseIntegralIssue` (presupuesto social) |
| Info actualizada/proyectos | `integral.ITC` + `oraculo` | `askQuery` + `certifyDesign` |
| Estrategia compartida | `orquestacion.goals` + `agencia.brandDNA` | `addGoal` + `setBrandDNA` |

### Decisiones EBD

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-GS-01** | Gobernanza = proceso decisión + distribución costos/beneficios, no solo zonificación | Texto: "no consiste únicamente en asignar usos, alturas o densidades" |
| **EBD-GS-02** | Coordinación multi-actor = requisito, no opción | "Cuando articulación falla, cada actor resuelve su parte y produce ciudad contradictoria" |
| **EBD-GS-03** | Plusvalía debe financiar infraestructura/vivienda SIN desplazamiento | "qué instrumentos permiten financiar... sin desplazar a quienes ya habitan" |
| **EBD-GS-04** | Instrumentos requieren: info actual + proyectos + presupuesto + capacidad institucional | Lista explícita en texto |
| **EBD-GS-05** | Pregunta central: ¿estrategia compartida o suma decisiones separadas? | Pregunta incómoda final del texto |

### Validaciones DV

| ID | Validación | Criterio Éxito |
|----|------------|----------------|
| **DV-GS-01** | `assessGovernanceCoordination(actors)` → coordinationScore | Detecta fallos articulación → ciudad contradictoria |
| **DV-GS-02** | `calculateLandValueCapture(project)` → {captured, distributed, displaced} | Plusvalía financia infraestructura/vivienda SIN desplazamiento |
| **DV-GS-03** | `designGovernanceInstruments(info, projects, budget, capacity)` → instrumentSet | Instrumentos conectados a 4 requisitos |
| **DV-GS-04** | `simulateSharedStrategy(actors)` → {shared: bool, contradictions: []} | Detecta si hay estrategia ciudad vs decisiones aisladas |

---

## Integración Transversal: SBN + Gobernanza Suelo

### Sinergia Crítica

| SBN (Qué) | Gobernanza (Cómo) | Resultado HSCSG |
|-----------|-------------------|-----------------|
| Parques/jardines botánicos productivos | Gobernanza participativa + captura plusvalía | `zeitnus-cooperative.circular` + `delegacion` |
| Arboricultura urbana como infraestructura | Coordinación municipal + presupuesto verde | `virginia.network` + `rbe` (presupuesto ecológico) |
| Captura CO₂ + retención agua | Instrumentos captura plusvalía financian SBN | `caas.caasPayouts` → `zeitnus-cooperative.circular` |
| Microclima regulado | Límites térmicos en `boundaries.policy` | `setBoundaryPolicy` (thermal limits) |

### Modelo de Financiamiento Anfibio (Principio Anfibio)

```
Modo Postmonetario (ZNU/CaaS):
  - SBN financiados por streams CaaS (suscripción stake ZNU)
  - Plusvalía capturada en ZNU → redistribución via dividendPolicy
  - Trabajo verificado (arboricultura, mantenimiento) → ZNU via RAO

Modo Conectado (USD/USDC via priceParity):
  - Bonos verdes / green bonds (SUGEVAL regulated)
  - Plusvalía en USD → green bonds municipales
  - ROI ambiental cuantificado (Smith & Harvey-Brown) atrae inversión ESG
```

---

## Próximos Pasos (FASE 2-3)

### FASE 2: Skill `urban-green-governance`
- Documentar metodología + mapeo HSCSG + EBDs + DVs
- Incluir métricas Smith & Harvey-Brown 2018 como referencia
- Ruta: SBN productivas → Gobernanza participativa → Financiamiento anfibio

### FASE 3: Implementación Core
```
src/core/lib/urban-green-governance.ts           # Lógica: calculateEcosystemServices, simulateGreenROI, modelUrbanMicroclimate, assessGovernanceCoordination, calculateLandValueCapture, designGovernanceInstruments, simulateSharedStrategy
src/core/lib/urban-green-governance-types.ts     # Tipos: SBNProject, EcosystemServices, GreenROI, UrbanMicroclimate, GovernanceCoordination, LandValueCapture, GovernanceInstrument, SharedStrategy
src/core/state/urban-green-governance.ts         # Estado: sbnProjects, ecosystemServices, greenROI, urbanMicroclimate, governanceCoordination, landValueCapture, governanceInstruments, sharedStrategy
src/core/state/hooks/urban-green-governance.ts   # Zustand store persistente, migración v1→v2
src/app/screens/UrbanGreenDashboard.tsx          # Dashboard: SBN projects, ecosystem services, ROI, microclima, gobernanza
src/app/screens/UrbanGreenPlanner.tsx            # Planificador SBN: diseñar proyectos, calcular servicios, ROI
src/app/screens/SoilGovernanceDashboard.tsx      # Gobernanza suelo: coordinación, plusvalía, instrumentos, estrategia
src/app/screens/UrbanResilienceSimulator.tsx     # Simulador: microclima, inundaciones, olas calor, SBN scenarios
src/app/layout/Aside.tsx                         # Nav items: urbanGreen, soilGovernance
src/core/lib/i18n.ts                             # Claves ES/EN/PT
```

---

## Notas de Propiedad Intelectual

- **Fuente**: Texto proporcionado directamente (842 tokens) — autoría implícita en contenido LinkedIn/post
- **Citas académicas**: Smith & Harvey-Brown 2018 (referenciadas en texto original), UN DESA 2018
- **Asimilación**: Solo lógica, arquitectura, patrones, métricas — **NO** texto textual
- **Uso**: Referencia para construir módulo propio en HSCSG v15 OS
- **Atribución**: "Basado en análisis de SBN y Gobernanza del Suelo (Smith & Harvey-Brown 2018, UN DESA 2018)" en docs/skills
- **Licencia**: Asimilación bajo principios HSCSG (código abierto, atribución)

---

*Backup generado: 2026-11-03 | HSCSG v15 OS | Principio Anfibio aplicado*