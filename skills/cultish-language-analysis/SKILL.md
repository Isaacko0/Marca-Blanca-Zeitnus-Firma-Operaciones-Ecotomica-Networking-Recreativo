---
name: cultish-language-analysis
category: research
description: FASE 3 Análisis lingüístico Cultish (Montell) en HSCSG v15 OS anfibio — detección patrones de influencia
---

# Skill: Análisis Lingüístico Cultish — The Language of Fanaticism (Amanda Montell)

**Fuente**: *Cultish: The Language of Fanaticism* — Amanda Montell, Harper Wave 2021/2024 (ISBN-13: 9780062993344)  
**Cluster**: Lenguaje, Poder, Fanatismo — Análisis lingüístico computacional de grupos de influencia  
**Método**: Extracción EPUB completa (465K chars, 6 partes, 30 caps, 71 archivos HTML)  
**Hash**: `sha256:cultish-montell-2024-harperwave`

---

## Resumen ejecutivo

**Cultish** = Investigación rigurosa sobre cómo el **lenguaje** (no "lavado de cerebro") opera como mecanismo central de influencia en grupos desde "sectas suicidas" (Jonestown, Heaven's Gate) hasta religiones controvertidas (Scientology), MLMs, fitness de culto (SoulCycle, CrossFit) y gurús redes sociales (Teal Swan, QAnon).

**Tesis central**: *"La conversión, el condicionamiento y la coerción ocurren mediante herramientas lingüísticas específicas y detectables: dicotomía nosotros/ellos, lenguaje cargado, clichés terminadores de pensamiento, renombramiento, code-switching manipulativo."*

**Hallazgo científico**: El "lavado de cerebro" es **pseudociencia** (Lifton, Barker, Moore); la susceptibilidad no proviene de debilidad mental sino de **idealismo, optimismo, búsqueda de pertenencia y sesgo de confirmación**. El lenguaje cultish funciona porque **resuena con necesidades humanas reales**.

---

## Arquitectura del conocimiento (6 partes, 30 capítulos)

### Parte 1: Repeat After Me... (Fundamentos)
| Cap | Concepto clave | Aplicación HSCSG |
|-----|----------------|------------------|
| i | 3HO (Kundalini) + CrossFit → lenguaje exclusivo = "no English reconocible" | `detectExclusiveLexicon()` |
| ii | Obsesión cultural + amígdala fight-or-flight → brainwashing = mito | `debunkBrainwashingMyth()` |
| iii | Soledad epidémica + paradoja elección + Asch conformity 75% | `assessVulnerabilityFactors()` |
| iv | Etimología "cult" (cultus) → espectro cultish vs binario | `classifyInfluenceSpectrum()` |
| v | Synanon (Game) + AA (HALT) → performatividad lenguaje | `analyzePerformativeLanguage()` |

### Parte 2: Jonestown + Heaven's Gate (Extremos destructivos)
| Cap | Concepto clave | Aplicación HSCSG |
|-----|----------------|------------------|
| i | Jonestown: Flavor Aid + cianuro; Jones code-switching maestro | `analyzeCodeSwitching()`, `detectEuphemisms()` |
| ii | Heaven's Gate: UFO + Star Trek Borg; sufijos -ody; Exit Statements | `detectRenamingPatterns()`, `analyzeThematicVocabulary()` |
| iii | **Conversión → Condicionamiento → Coerción** (3 fases operativas) | `stageInfluenceProcess()` |
|     | Us-vs-them (primer vector) | `detectUsVsThem()` |
|     | Jargón → camaradería → detecta disidentes | `measureJargonDensity()` |
|     | Renombramiento = shedding identity | `trackIdentityShedding()` |
|     | Loaded language: redefinición + eufemismos | `detectLoadedLanguage()` |
|     | Thought-terminating clichés (Lifton 1961) | `detectThoughtTerminatingCliches()` |
|     | Silencio forzado = no solidaridad | `measureCommunicationSuppression()` |
| iv | Voice of God bias (hombres blancos medianos) + Teal Swan | `assessAuthorityBias()`, `profileGuruLanguage()` |
| v | No brainwashing: Sapir-Whorf (influye ≠ determina) + confirmation bias + loss aversion | `assessCognitiveBiases()`, `calculateExitBarriers()` |

### Parte 3: Scientology + Children of God (Religiones controladoras)
| Cap | Concepto clave | Aplicación HSCSG |
|-----|----------------|------------------|
| i-ii | Scientology: personality test → bait-and-switch ($35→$100K+) | `analyzeBaitAndSwitch()` |
|     | Hubbardese: 3000+ entradas, redefinición términos técnicos | `detectTechnicalTermRedefinition()` |
|     | TR-L (Training Routine Lie), "pull it in", wog law | `detectThoughtTerminatingCliches()`, `detectVictimBlaming()` |
|     | Acronyms density: ack, cog, inval, eval, sup, R-factor... | `measureAcronymDensity()` |
| iii-iv | Performatividad religiosa (Eberle): ritual time vs 24/7 | `measureRitualTimeBoundary()` |
|     | Shambhala: "Why don't you sit with that?" = bastardización budista | `detectSpiritualBypassing()` |
| v-vi | Hubbardese → NXIVM copycat (suppressives, tech, DOS) | `detectDerivativeLanguages()` |
|     | Newspeak style: polisemia → definición única | `measureSemanticReduction()` |
|     | Copyrights agresivos + lawsuits vs defectores | `assessLegalAggressiveness()` |

### Parte 4: MLMs (Marketing multinivel)
| Concepto | Patrón lingüístico | Detector |
|----------|-------------------|----------|
| Love-bombing reclutamiento | "You're amazing", "This is your time" | `detectLoveBombing()` |
| Boss babe / hun / tribe | Insider vernacular | `detectInsiderVernacular()` |
| Clichés: "fake it till you make it" | Thought-terminating | `detectThoughtTerminatingCliches()` |
| Redefinición: "investment" ≠ gasto | Loaded language | `detectLoadedLanguage()` |
| Eufemismos: "sharing" = vender | Loaded language | `detectEuphemisms()` |
| Aislamiento: "negative Nellies" | Us-vs-them | `detectUsVsThem()` |
| Feminismo performativo | Performative language | `analyzePerformativeLanguage()` |

### Parte 5: Cult Fitness (SoulCycle, CrossFit, Lululemon)
| Concepto | Patrón lingüístico | Detector |
|----------|-------------------|----------|
| Ritual time: clip shoes → enter | Sacred/profane boundary | `measureRitualTimeBoundary()` |
| Chants: "You are strong/powerful/warrior" | Performative affirmations | `detectPerformativeAffirmations()` |
| Instructores = "prophets of sweat" | Guru language | `profileGuruLanguage()` |
| Public shaming Facebook | Coercion social | `detectSocialCoercion()` |
| Lululemon bags mantras | Environmental immersion | `detectEnvironmentalLanguage()` |

### Parte 6: Gurús Redes Sociales
| Gurú | Patrón | Detector |
|------|--------|----------|
| Teal Swan | SEO targeting depresión + "Tealisms" (Akashic + DSM) | `detectPseudoScientificLanguage()` |
| Dr. Joe Dispenza | Neurociencia + quantum mysticism | `detectPseudoScientificLanguage()` |
| QAnon | Gamificación (breadcrumbs, drops) + hashtags mantras | `detectGamifiedLanguage()` |
| Wellness influencers | "detox", "cleanse", "high vibration" | `detectWellnessEuphemisms()` |

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto Cultish | → Módulo HSCSG | Vaso comunicante |
|------------------|----------------|------------------|
| Espectro influencia (Hassan) | `boundaries.policy` | `setBoundaryPolicy(score)` |
| Conversión → Condicionamiento → Coerción | `aprender.challenges` + `orquestacion.agents` | `completeChallenge()` + `evaluateAction()` |
| Dicotomía nosotros/ellos | `caas.caasMembers` + `democracia.vote` | `addCaaSMember()` + `electRep()` |
| Lenguaje cargado (redefinición/eufemismos) | `contenido.captureIdea` + `aprender.challenges` | `captureIdea()` + `addChallenge()` |
| Clichés terminadores (TTCs) | `boundaries.policy` + `orquestacion.audit` | `setBoundaryRule()` + `logAudit()` |
| Renombramiento miembros | `caas.caasMembers` + `poh.identities` | `updateMemberIdentity()` |
| Code-switching manipulativo | `agencia.offerStack` + `contenido.captureIdea` | `reversePlan()` + `captureIdea()` |
| Sesgo confirmación + Aversión pérdidas | `agingControl.laws` + `caas.caasPayouts` | `runAgingControl()` + `runCaasPayout()` |
| Tiempo ritual vs cotidiano | `aprender.challenges` + `virginia.network` | `completeChallenge()` |
| Performatividad lenguaje | `contenido.captureIdea` + `agencia.brandDNA` | `captureIdea()` + `setBrandDNA()` |
| Guru profiling | `contenido.captureIdea` + `orquestacion.agents` | `captureIdea()` + `spawnAgent()` |
| Semantic reduction (Newspeak) | `boundaries.policy` | `setBoundaryRule()` |

---

## Decisiones de diseño EBD (Evidence-Based Design)

| ID | Decisión | Justificación científica |
|----|----------|-------------------------|
| **EBD-CTL-01** | Modelar influencia como **espectro continuo** (0-100) no binario | Montell: "cultishness falls on a spectrum"; Hassan continuum validado |
| **EBD-CTL-02** | **Lenguaje = mecanismo central** (no "brainwashing") | Barker (1016 Moonie subjects): 90% se van; brainwashing = pseudociencia (Moore, Lifton) |
| **EBD-CTL-03** | **Tres fases operativas**: Conversión → Condicionamiento → Coerción | Mapea a funnel medible; permite intervención temprana (conversión reversible) |
| **EBD-CTL-04** | **Dicotomía nosotros/ellos = primer vector** | Prerrequisito para todas las demás técnicas; detectable léxicamente (us vs them markers) |
| **EBD-CTL-05** | **Lenguaje cargado: 2 sub-tipos** (redefinición + eufemismos) | Efectos distintos: redefinición = altera cognición; eufemismos = altera valoración emocional |
| **EBD-CTL-06** | **Clichés terminadores = "semantic stop signs"** (Lifton 1961) | Bloquean pensamiento crítico; detectables por patrones léxicos fijos |
| **EBD-CTL-07** | **Renombramiento = marcador compromiso identitario** | Costo hundido lingüístico; irreversible sin pérdida cara (Frank Lyford 25 años después) |
| **EBD-CTL-08** | **Code-switching como trust-building manipulativo** | Jones: Pentecostal ↔ Socialista ↔ Filosófico; detectable por análisis estilométrico |
| **EBD-CTL-09** | **Tiempo ritual = frontera semántica** | "Sacred = set aside"; grupos saludables: frontera clara; opresivos: 24/7 sagrado |
| **EBD-CTL-10** | **Performatividad: lenguaje crea realidad** (Austin/Searle/Eberle) | Religious language "performs not informs"; verbos performativos detectables |
| **EBD-CTL-11** | **Susceptibilidad = idealismo + optimismo + pertenencia** | Barker: miembros más obedientes = inteligentes, idealistas, hijos de activistas |
| **EBD-CTL-12** | **Aversión pérdidas + Costo hundido = barrera salida** | Economía conductual (Kahneman/Tversky) explica retención; no "control mental" |
| **EBD-CTL-13** | **Voz autoridad = bias hombres blancos medianos** | "Voice of God" (Cronkite/Murrow); Lindy West critique; factor riesgo demográfico |
| **EBD-CTL-14** | **"Cult + time = religion" (Reza Aslan)** | Legitimidad temporal → implicaciones legales (1st Amendment, protección estado) |
| **EBD-CTL-15** | **Gurús redes = baja barrera + algoritmo amplifica** | Teal Swan SEO targeting depresión; escalabilidad viral vs comunas físicas |

---

## Validaciones DV (10 obligatorias)

| ID | Función | Input | Output | Criterio éxito |
|----|---------|-------|--------|----------------|
| **DV-CTL-01** | `detectUsVsThem(text)` | string | `{score, markers[], groups: {us:[], them:[]}}` | F1 > 0.85 en corpus anotado (Jonestown, Scientology, MLM, Fitness) |
| **DV-CTL-02** | `detectLoadedLanguage(text)` | string | `{redefinitions[], euphemisms[], density}` | Detecta "old soul"→negativo, "exiting vehicle"=suicidio, "investment"≠gasto |
| **DV-CTL-03** | `detectThoughtTerminatingCliches(text)` | string | `{cliches[], density, LiftonCategory}` | Cubre catálogo Lifton 1961 + New Age maxims ("Truth is a construct", "limiting beliefs") |
| **DV-CTL-04** | `detectRenaming(member, group)` | `{oldName, newName, group}` | `{pattern, suffix, commitmentScore}` | Sufijos -ody, Kaur/Singh, nombres sánscritos, scientology "clear/OT" |
| **DV-CTL-05** | `detectCodeSwitching(speaker, contexts)` | `{texts[], audiences[]}` | `{switches[], registerShifts[], trustBuildingScore}` | Jones: Pentecostal↔Socialista↔Filosófico; detectar por análisis estilométrico |
| **DV-CTL-06** | `measureRitualTimeBoundary(group)` | `{texts[], rituals[]}` | `{boundaryClarity, sacredDensity, profaneIntrusion}` | Saludable: frontera clara (vela/namaste); Opresivo: sagrado 24/7 |
| **DV-CTL-07** | `calculateInfluenceSpectrumScore(group)` | `{transparency, exitEase, leaderAccountability, exploitation}` | `0-100 (healthy→destructive)` | Hassan continuum validado; correlación con exit barriers reales |
| **DV-CTL-08** | `detectPerformativeLanguage(text)` | string | `{performativeVerbs[], authorityInvocations[], speechActs[]}` | Verbos: bless/curse/vow/declare/pronounce + "In the name of X" |
| **DV-CTL-09** | `assessExitBarriers(group)` | `{financial, social, psychological, legal, physical}` | `{barrierScores, dominantBarrier, exitDifficulty}` | MLMs: inventario; 3HO: nombre legal+PTSD; Heaven's Gate: muerte |
| **DV-CTL-10** | `analyzeGuruLanguage(guru)` | `{texts[], audiences[], biography}` | `{codeSwitchingFreq, loadedDensity, ttcFreq, performativeRatio, authorityBias}` | Perfil completo comparativo (Jones vs Applewhite vs Swan vs Glassman) |

---

## Estructura de archivos FASE 3 — PROPUESTA

```
src/core/lib/cultish-analysis.ts           # Detección pura: us-vs-them, loaded language, TTCs, renaming, code-switching, performative verbs, ritual time, guru profiling
src/core/lib/cultish-types.ts              # Tipos: InfluenceSpectrum, CultishMarker, ConversionStage, GuruProfile, ExitBarrier, RitualTimeBoundary
src/core/state/cultish.ts                  # Estado: detectedMarkers, influenceScore, groupProfiles, memberProfiles, linguisticFingerprints
src/core/state/hooks/cultish.ts            # Zustand store: análisis texto, scoring grupos, alertas, histórico, persistencia
src/app/screens/CultishAnalyzer.tsx        # Analizador: input texto → markers + score + recomendaciones + visualización
src/app/screens/CultishGroupProfile.tsx    # Perfil grupo: continuum score, exit barriers, guru profile, linguistic fingerprint
src/app/screens/CultishTimeline.tsx        # Timeline conversión→condicionamiento→coerción con marcadores temporales
src/app/layout/Aside.tsx                   # Nav item "cultishAnalyzer" (Brain, rose-400) → "/cultish-analyzer"
src/core/lib/i18n.ts                       # Claves ES/EN/PT para cultish.*
```

---

## Pitfalls descubiertos en investigación

| Pitfall | Regla de prevención |
|---------|---------------------|
| **Etiquetar "cult" binariamente** | Usar siempre `InfluenceSpectrum` (0-100); "cult" = peyorativo, no analítico |
| **Confundir brainwashing con influencia lingüística** | Brainwashing = pseudociencia; documentar siempre como "linguistic influence techniques" |
| **Ignorar susceptibilidad = idealismo** | Perfil de riesgo: idealistas, optimistas, buscadores pertenencia (NO "vulnerables/mentally ill") |
| **Subestimar code-switching** | Jones lo usó sistemáticamente; detectar por cambios registro por audiencia (estilometría) |
| **Tratar renombramiento como cosmético** | Renombramiento = costo hundido identitario; Frank Lyford 25 años después aún usa nombres monásticos |
| **Ignorar tiempo ritual** | Grupos saludables: frontera clara (vela/namaste/zapatos); opresivos: lenguaje sagrado 24/7 |
| **No medir barreras de salida** | Barreras ≠ "control mental"; son financieras (MLM inventario), sociales (3HO), físicas (Heaven's Gate) |
| **Confundir performatividad con retórica** | Verbos performativos (bless/vow/declare) + invocación autoridad = speech acts con consecuencias reales |
| **No detectar code-switching de gurús** | Jones cambió registro por audiencia; requiere análisis estilométrico multi-contexto |
| **Over-fitting a "sectas religiosas"** | Aplicar a MLMs, fitness, startups, influencers — mismos patrones lingüísticos |

---

## Conexión con módulos HSCSG existentes

- **Harvey (sales agent)** → `cultish-analysis` detecta love-bombing en discovery calls
- **Agencia (DeseOS/Contento.pro)** → `agencia.brandDNA` + `agencia.offerStack` usan loaded language éticamente
- **Offer Designer** → `cultish-analysis` valida que copy no use TTCs ni us-vs-them manipulativo
- **Zeitnus Cooperative** → `cultish-analysis` asegura gobernanza transparente (anti-TTCs, anti-us-vs-them)
- **ALRAC** → `cultish-analysis` detecta narrative capture en sistemas regenerativos
- **RBE/CaaS** → `cultish-analysis` valida que incentivos no exploten loss aversion / sunk cost
- **PoH/Kleros** → `cultish-analysis` detecta identity capture via renaming/credentialing
- **Aging Control** → `cultish-analysis` modela cómo lenguaje afecta health behaviors (wellness gurus)

---

## Próximos pasos (post-FASE 3)

1. **i18n keys** — Añadir claves `cultish.*` a `src/core/lib/i18n.ts` (ES/EN/PT)
2. **OpenSpec** — Generar `openspec/specs/cultish-analysis/openapi.yaml` (endpoints: /analyze, /group-profile, /guru-profile, /timeline, /exit-barriers)
3. **Corpus anotado** — Crear dataset evaluación (Jonestown, Scientology, MLM, Fitness, QAnon texts) para DV testing
4. **Modelo ML ligero** — Fine-tune classifier (DistilBERT/Spanish) para detección automática markers
5. **Integración Harvey** — Pipeline discovery → `cultish-analysis` flag para love-bombing/TTCs en prospectos
6. **Dashboard tiempo real** — Stream analysis de chats/comms organizacionales (boundaries alerting)

---

## Notas de propiedad intelectual

- **Libro original**: "Cultish: The Language of Fanaticism" — Amanda Montell, Harper Wave (HarperCollins), ISBN-13: 9780062993344
- **Asimilación**: Solo conceptos, arquitectura, patrones lingüísticos, hallazgos investigación — **NO** copiar texto textual
- **Uso**: Referencia para construir módulo análisis lingüístico en HSCSG v15 OS
- **Atribución**: "Basado en investigación lingüística de 'Cultish: The Language of Fanaticism' (Montell, 2021/2024)" en docs/skills
- **Fair use**: Análisis crítico, resumen, extracción patrones para herramienta detección
- **Licencia**: Código abierto bajo principios HSCSG; libro sigue copyright HarperCollins

---

*Skill generada: 2026-10-30 | HSCSG v15 OS | Principio Anfibio aplicado*