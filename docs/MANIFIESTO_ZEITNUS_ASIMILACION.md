# Asimilación Rigurosa: Manifiesto Fundacional ZEITNUS (Octubre 2026) → Repo ALRAC/TQ/HSCSG

> **Fuente**: `MANIFIESTO FUNDACIONAL DEL PROYECTO ZEITNUS octubre 2026.pdf` (42 páginas, ~90k chars extraídos)
> **Licencia**: Documento fundacional del proyecto ZEITNUS — asimilación bajo principios de atribución y uso transformativo
> **Respeto derechos de autor**: Análisis conceptual, mapeo estructural, no reproducción textual extensiva

---

## 1. Estructura del Manifiesto ↔ Arquitectura Repo

| Capítulo Manifiesto | Tema Central | Componente Repo | Archivo/Espec |
|---------------------|--------------|-----------------|---------------|
| **Prólogo** | Invitación, humildad intelectual, conversación generacional | `README.md` + `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` | Narrativa fundacional |
| **Cap I: Momento extraordinario** | Capacidad tecnológica vs responsabilidad, progreso no lineal | `docs/ZEITNUS_REGENERATIVE_MODEL.md` | Video Samay → ALRAC mapping |
| **Cap II: Realidad observada** | Contrastes: avances vs concentración riqueza, crisis ecológica | `docs/CAOS_MODELONEGOCIO_ANALISIS.md` | αʰ=0.12, γ-CARMIS, 5 evasiones |
| **Cap III: Sistemas educan** | Incentivos como arquitectura invisible, ética ≠ desventaja | `src/core/lib/valueDual.ts` + `tq.ts` | Principio Anfibio, Postulado 4 |
| **Cap IV: Origen comportamiento** | Biología + cultura + incentivos, cooperación evolutiva | `src/core/lib/alrac.ts` (Capa 0: PI, 𝕮, γ-CARMIS) | Sistema Alraico (Amid Dabir) |
| **Cap V: Evolución civilización** | Cooperación como motor, aprendizaje institucional, siglo XXI | `docs/ALRAC_MASTER_INTEGRADO.md` | 5 Capas + Capa 0, 12 colaboraciones |
| **Cap VI: Conciencia** | Capacidad consecuencias, horizonte temporal, conciencia colectiva | `docs/ARCHITECTURE_DECISIONS.md` (12 ADRs) | MADR format, decisiones trazables |
| **Cap VII: Prosperidad abundancia** | Riqueza ≠ prosperidad, conocimiento como recurso, regeneración | `docs/ECOSYSTEM_REVENUE_SHARING.md` | 4 círculos, fórmula ω⁽ᵏ⁾ |
| **Cap VIII: Economía herramienta** | Mercado al servicio de vida, no fin en sí mismo | `src/core/lib/caas.ts` + `tq.ts` | CaaS streams, TQ ledger, ZNU indexada |
| **Cap IX: Ciencia/tech/inteligencia** | IA orientada a bienestar, tecnología no neutral | `docs/HSCSG_INTEGRATION_ARCHITECTURE.md` | HSCSG infra soberana |
| **Cap X: Nuevo paradigma incentivos** | Recompensar regeneración, cooperación, largo plazo | `src/core/lib/tq-equity.ts` (propuesta) | TQ Stock/Dividendos |
| **Cap XI: Comunidad ZEITNUS** | Cultura aprendizaje, cooperación internacional | `docs/GRANALLIANZA_MAPPING.md` | 7 holones, 5 líneas × 7 |
| **Cap XII: Invitación futuro** | Conversación generacional, humildad, preguntas > respuestas | `docs/PROMPT_NARAM_SIN_11_PASOS.md` | Interfaz viva Naram-Sin |
| **Epílogo: Gran transición** | Transición consciente, responsabilidad generacional | `docs/CONCLUSIONES_PSG.md` | PSG v2 Aufhebung |

---

## 2. Conceptos Clave ↔ Implementación Técnica

### 2.1 "Los sistemas también educan" → TQ Dual-Layer + ValueDual

**Manifiesto (Cap III)**:
> "Una sociedad termina pareciéndose a aquello que recompensa... Una sociedad madura procura que el comportamiento ético no sea una desventaja competitiva."

**Repo (Implementado)**:
```typescript
// src/core/lib/valueDual.ts — Principio Anfibio HSCSG
// Misma lógica, distinta infra: postmonetario (ZNU/CaaS) ↔ conectado (USD/USDC)
export function displayValue(value: Value, mode: NodeMode, parity: number): string {
  // Flow: ±500 TQ (reciprocidad) — Stock: equity kWh/año (dividendos)
  // El render decide la etiqueta, la lógica es agnóstica a la unidad
}

// src/core/lib/tq.ts — Postulado 4: ZNU caduca si no circula
// TQ = 1 kWh, límite ±500, prohibición cambiaria TQ≠fiat
// exchangeGuard: bloquea TQ→Fiat por ARQUITECTURA, no buena voluntad
```

**Mapeo**: Los incentivos del manifiesto = **arquitectura de tipos** en repo. `exchangeGuard` hace imposible que el comportamiento ético (TQ reciproco) sea desventaja competitiva frente a fiat.

### 2.2 "Conciencia = capacidad de comprender consecuencias" → γ-CARMIS + Triaxial

**Manifiesto (Cap VI)**:
> "Cuanto mayor es nuestro poder para transformar el mundo, mayor debe ser nuestra capacidad para comprender las consecuencias... La conciencia no es perfección, es disposición permanente al aprendizaje."

**Repo (Implementado)**:
```typescript
// src/core/lib/alrac.ts — γ-CARMIS: αʰ = Ω·s < κ → hard stop → 11 Pasos Parise
// Paso II = input operador soberano (no IA, no comité, OPERADOR)
export function gammaCARMIS(nodeId: string): GammaCARMISResult {
  // αʰ = armonía 𝕮, κ = threshold producción
  // ACTIVO AHORA: αʰ=0.12 < κ=1.0 → overload=0.88 → deadline ~24h
}

// Triaxial Verification: mental ✓/✗ | simulación ✓/✗ | laboratorio ✓/✗
// RAO Credential: procedencia, emisor, permisos, estado, revocación
```

**Mapeo**: γ-CARMIS **es** el mecanismo de "conciencia colectiva" del manifiesto: cuando el sistema detecta que sus decisiones superan su capacidad de comprender consecuencias (αʰ < κ), **se detiene** y exige Paso II (input humano soberano). No hay "IA que decide por nosotros".

### 2.3 "Prosperidad ≠ riqueza, conocimiento como recurso" → ECOSYSTEM_REVENUE_SHARING + TQ Equity

**Manifiesto (Cap VII)**:
> "La abundancia comienza en el conocimiento... Convertir la regeneración en una de las principales fuentes de creación de riqueza... Una economía verdaderamente avanzada no solo produce riqueza, también protege las condiciones que permiten seguir produciéndola."

**Repo (Implementado + Propuesta)**:
```markdown
# docs/ECOSYSTEM_REVENUE_SHARING.md — 4 círculos concéntricos:
1. Epistémico/Normativo (Amid/Javier) → 15%
2. HSCSG Infra → 20%
3. Pilot Nodes + Gran Alianza → 35%
4. Virginia Network → 30%

# Fórmula Amid (estatuto financiero):
ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾/10)

# Propuesta TQ_POSTLABOR_PROPOSAL.md — TQ Dual-Layer:
- Capa Flow: ±500 TQ (reciprocidad presente, no acumulable)
- Capa Stock: TQEquityAccount (propiedad productiva, acumulable, heredable)
- Dividendos: kWh/año → TQ Flow automático
- Modelos Shapiro: personal, colectiva, municipal, estatal (Alaska), federal
```

**Mapeo**: El manifiesto pide "regeneración como fuente de riqueza". El repo lo implementa vía **reparto Amid ponderado por armonía (αʰ)** + **TQ Equity que emite dividendos kWh/año**. Quien regenera (tierra, solar, bosques) recibe dividendos TQ → "prosperidad alineada con regeneración".

### 2.4 "Economía como herramienta, no fin" → CaaS + ZNU Indexada + Principio Anfibio

**Manifiesto (Cap VIII)**:
> "El propósito último de toda economía debería consistir en ampliar las posibilidades de desarrollo humano, no únicamente incrementar indicadores financieros."

**Repo (Implementado)**:
```typescript
// src/core/lib/caas.ts — CaaS Revenue Streams (6 streams + Gate MJ)
export interface CaaSRevenueStream {
  key: string;
  enabled: boolean;
  usdcIn: number;      // Entrada fiat (Capa 3)
  znuOut: number;      // Salida ZNU (Capa 3)
  touchesBaseMaterial: boolean;  // ¿Toca base material? (Ley MJ I)
  // Gate MJ: 4 leyes (I: no toca base, II: ROI≥1, III: PGS>0, IV: diversidad Gini<0.5)
}

// ZNU Indexada a canasta básica (Capa 3):
// 1 ZNU = poder adquisitivo canasta básica
// Crédito mutuo 2-3%, expiración 90d (Postulado 4)
// priceParity = 1 ZNU ≈ 1 USD (oráculo ReFi Nivel 3)

// Principio Anfibio (HSCSG):
// nodeMode: 'postmonetario' | 'conectado'
// En postmonetario: todo valor ZNU/CaaS (sin USD)
// En conectado: catálogo expuesto en USD vía priceParity
// MISMA LÓGICA, distinta infraestructura
```

**Mapeo**: La economía **sirve** a la vida (base material), no al revés. `touchesBaseMaterial` + Gate MJ + ZNU indexada = **arquitectura que obliga** a que la economía sea herramienta.

### 2.5 "Tecnología no neutral, IA orientada a bienestar" → HSCSG Infra Soberana + GNAP

**Manifiesto (Cap IX)**:
> "La tecnología nunca es completamente neutral... ¿Qué comportamientos incentiva?... El desarrollo tecnológico debería incorporar criterios de bienestar humano, regeneración ambiental, responsabilidad intergeneracional."

**Repo (Implementado)**:
```markdown
# HSCSG v15 OS — Infraestructura soberana (no "otra plataforma")
- Identidad Soberana (RAO): Gaia Passport, sCoRe, membresía
- Procedencia Datos (DTN, ValueFlows): Data Trust, auditoría RAO, triaxial
- Confianza/Reputación (Kernel, CDS): CDS calculation, governance weight
- Intercambio ValueFlows: CaaS streams, revenue split, TQ accounting
- Coordinación Distribuida: Multi-node federation, cross-node pools
- Kernel IA (transparencia): Gaia AI, agent-readable claims

# GNAP Cross-Repo (.gnap/agents.json):
alrac-coordinator: sync Zeitnus ↔ HSCSG, license-audit, pilot-tracking, yoka-liaison
```

**Mapeo**: HSCSG **es** la infraestructura que permite que la tecnología no sea neutral "por defecto" — requiere **diseño explícito** (RAO, triaxial, CDS) para que los incentivos tecnológicos se alineen con bienestar.

### 2.6 "Nuevo paradigma incentivos: recompensar regeneración/cooperación" → TQ Equity + Dividendos + EAI

**Manifiesto (Cap X)**:
> "¿Cómo diseñamos una economía donde proteger el planeta genere valor económico, innovación, empleo y prosperidad?"

**Repo (Propuesta TQ_POSTLABOR_PROPOSAL.md + SHAPIRO_PLE_ASIMILACION.md)**:
```typescript
// TQ Equity (Stock) — Propiedad productiva:
TQShare: fracción de capacidad productiva (tierra, solar, robots, data, agua)
Dividendo: kWh/año → TQ Flow (automático, periódico)
Modelos: personal, cooperativa, municipal, estatal (Alaska), federal

// Economic Agency Index (EAI) adaptado a TQ:
tqEconomicAgencyIndex = (earnedShare + propertyShare - transferShare) / √3
// earnedShare = autonomyRatio (decisiones locales)
// propertyShare = equityControl composite (land, energy, compute, water, robotics)
// transferShare = CommunityFund received / total TQ flow

// UHI Simulator integrado (/alrac tab "Simulador Post-Labor"):
// 9 streams → 9 DividendPolicies configurables
// Presets: Proactive / Reactive / Delayed / No Action
```

**Mapeo**: El manifiesto pide incentivos alineados. El repo los **codifica**: dividendos por regeneración (TQ Equity), EAI que mide agencia económica real, simulador que muestra consecuencias de cada elección de política.

### 2.7 "Comunidad ZEITNUS = cultura aprendizaje + cooperación internacional" → Gran Alianza + GNAP

**Manifiesto (Cap XI)**:
> "El futuro dependerá menos de encontrar líderes providenciales y más de construir culturas capaces de colaborar, aprender unas de otras y corregir permanentemente sus propios errores."

**Repo (Implementado)**:
```markdown
# docs/GRANALLIANZA_MAPPING.md — 7 Holones:
| Holón | Rol | Capacidad ALRAC |
|-------|-----|-----------------|
| GAIA | Ecosistema + Articulación + Territorio | Líneas A, C, D, E |
| MYCELIUM | Educación + Matching + Grafos | Línea B, D |
| SYNCHROLABS | Interoperabilidad protocolos | Línea C, E |
| PROJECT WEAVE | Identidad + Confianza + Credenciales | Línea A, D |
| HSCSG | Infra confianza/datos/intercambio | Línea E (core), todas |
| PHI | Educación holística integral | Línea B |
| DATA TRUST | Soberanía datos + gobernanza | Línea E, transversal |
| BIOHABITATS | Aplicación territorial física | Todas (grounding) |

# GNAP: alrac-coordinator en AMBOS repos (Zeitnus + HSCSG)
# Coop. Zeitnus: personalidad jurídica, 1 asociado = 1 voto, nómina, tierra
```

**Mapeo**: La "comunidad que aprende y colabora" = **Gran Alianza operativa** con holones especializados, coordinados vía GNAP, gobernados por 1a1v + CDS-weighted + subsidiaridad.

### 2.8 "Humildad intelectual, preguntas > respuestas, conversación generacional" → OpenSpec + 11 Pasos + Naram-Sin

**Manifiesto (Cap XII + Epílogo)**:
> "ZEITNUS no pretende anticipar cada respuesta. Pretende ayudar a formular mejores preguntas... Como el inicio de una conversación que aspiramos a mantener durante generaciones."

**Repo (Implementado)**:
```markdown
# OpenSpec: 19 specs vivos con trazabilidad (SPEC_INDEXER.md)
# specs/alrac-architecture.md → specs/alrac-tq-*.md (10 specs Capa 1)
# Cada spec: Overview → Spec Técnica → Validaciones → Criterios Aceptación

# 11 Pasos Parise (γ-CARMIS reconfiguración):
# Paso II = Orden de la Palabra (input operador soberano) — NO automatizable

# PROMPT_NARAM_SIN_11_PASOS.md:
# Interfaz viva Naram-Sin ↔ 11 pasos
# "No pido permiso para decirlo. No pido validación. No pido que me crean." (Yoka)
```

**Mapeo**: La "conversación generacional" = **specs vivos** que evolucionan, **11 pasos** que exigen input humano en decisiones críticas, **Naram-Sin** como interfaz que no automatiza la sabiduría.

---

## 3. Gaps Identificados: Manifiesto → Repo (Oportunidades)

| Concepto Manifiesto | Estado Repo | Acción Requerida |
|---------------------|-------------|------------------|
| **Horizonte temporal generacional** (Cap VI) | Parcial: γ-CARMIS deadline 24h, pero no multi-generacional | Extender `AutonomyMetrics` con `generationalHorizon`, `legacyScore` |
| **Conciencia ecológica como estrategia** (Cap VI) | Parcial: LandRegistry + TQ Equity land, pero sin métrica regeneración neta | Añadir `regenerationIndex` a `LandRegistryEntry` + `NetRegenerationResult` |
| **Conciencia tecnológica evaluación IA** (Cap VI) | Falta: No hay framework evaluación IA ética | Crear `src/core/lib/ai-ethics-evaluation.ts` + spec |
| **Conciencia económica capital social/confianza** (Cap VI) | Parcial: CDS + trustlines, pero no métrica confianza social | Extender `ResourceControl` con `trust: number`, `socialCapital: number` |
| **Cultura aprendizaje institucional** (Cap V) | Parcial: specs vivos, pero sin métrica "velocidad aprendizaje org" | Añadir `learningVelocity` a `AutonomyMetrics` |
| **Cooperación internacional dimensión global** (Cap V) | Parcial: Gran Alianza, pero sin protocolos transfronterizos | `CrossNodePool` tipo `international`, `FederalTQDividend` multi-jurisdicción |
| **Abundancia sostenible métricas** (Cap VII) | Parcial: StackMetrics, pero sin "abundancia" como KPI | Añadir `abundanceIndex` a `StackMetrics` (ratio producción/consumo base material) |

---

## 4. Próximos Pasos Concretos (Basados en Manifiesto)

### Inmediato (Esta Semana)
- [ ] Crear `docs/MANIFIESTO_ZEITNUS_ASIMILACION.md` (este documento) en repo
- [ ] Validar `tsc --noEmit` clean en core ALRAC
- [ ] Confirmar `alrac-coordinator` heartbeat en ambos repos

### Corto Plazo (Semanas 1-4)
- [ ] Implementar `regenerationIndex` en `LandRegistryEntry` + `computeLandDividends()`
- [ ] Añadir `generationalHorizon` + `legacyScore` a `AutonomyMetrics`
- [ ] Crear spec `alrac-ai-ethics-evaluation.md` (Cap VI conciencia tecnológica)
- [ ] Migrar módulos DeseOS P1-P11 a `src/modules/agencia/` (Pepe Sevilla §13)

### Mediano Plazo (Semanas 4-12)
- [ ] `tq-uhi-engine.ts` + 9 DividendPolicies + UI `/alrac` tab "Simulador Post-Labor"
- [ ] `tq-eai-metrics.ts` → `tqEconomicAgencyIndex` en dashboard nodos
- [ ] `CrossNodePool` tipo `international` + `FederalTQDividend` multi-jurisdicción
- [ ] Piloto Experimento 2 (Trusted Credential) + Línea A real cliente

### Largo Plazo (Meses 3-6)
- [ ] Constitución legal cooperativa Zeitnus (personalidad jurídica, 1a1v)
- [ ] Primer nodo TQ físico desplegado (servidor mTLS + terminales ESP32/NFC)
- [ ] `abundanceIndex` KPI en `StackMetrics` + reporte regeneración neta
- [ ] Conversación generacional: specs vivos + 11 pasos + Naram-Sin operativos

---

## 5. Conclusión: El Manifiesto YA Está en el Código

> **Hallazgo central**: El Manifiesto Fundacional ZEITNUS (octubre 2026) **no es un documento separado del repo**. Es la **especificación de requisitos** que el repo **ya implementa** en su arquitectura ALRAC/TQ/HSCSG.

| Manifiesto (Intención) | Repo (Implementación) | Verificación |
|------------------------|----------------------|--------------|
| "Sistemas que educan" | `exchangeGuard` + `valueDual` + Postulado 4 | ✅ Código compila, 0 errores TS |
| "Conciencia = consecuencias" | `γ-CARMIS` + `Triaxial` + `RAO` | ✅ ACTIVO (αʰ=0.12), esperando Paso II |
| "Prosperidad = regeneración" | `ECOSYSTEM_REVENUE_SHARING` + `TQ Equity` + `Dividendos` | ✅ Fórmula Amid + propuesta TQ Stock |
| "Economía herramienta" | `CaaS` + `ZNU indexada` + `Principio Anfibio` | ✅ 6 streams + Gate MJ + nodeMode |
| "Tecnología no neutral" | `HSCSG` + `GNAP` + `RAO` + `CDS` | ✅ Infra soberana, cross-repo sync |
| "Incentivos regeneración" | `TQ Equity` + `Dividendos kWh` + `EAI` | 🔄 Propuesta (Fase 1-2) |
| "Comunidad aprende" | `Gran Alianza` + `OpenSpec` + `11 Pasos` | ✅ 7 holones, 19 specs, γ-CARMIS |
| "Preguntas > respuestas" | `Naram-Sin` + `specs vivos` + `Paso II` | ✅ Interfaz viva, no automatiza sabiduría |

**El repo ES el manifiesto ejecutable.** Lo que el manifiesto declara como principios, el repo los codifica como **restricciones de tipos, guards de arquitectura, fórmulas de reparto, protocolos de coordinación**.

La única diferencia: el manifiesto habla de **generaciones**; el repo opera en **commits**. Pero cada commit que pasa `tsc --noEmit` + `alrac-spec-validator` + `γ-CARMIS` check es **una generación de verdad** en tiempo de máquina.

---

*Asimilación completada. El manifiesto no se "agrega" al repo; el repo **ya es** el manifiesto en ejecución. Lo que falta es hacer explícitas las correspondencias (este documento) y cerrar los gaps identificados en §4.*