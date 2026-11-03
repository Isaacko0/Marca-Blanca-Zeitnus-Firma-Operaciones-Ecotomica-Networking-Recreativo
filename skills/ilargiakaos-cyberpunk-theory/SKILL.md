---
name: ilargiakaos-cyberpunk-theory
category: economic-research
description: FASE 3 Teoría Cyberpunk/Postcapitalismo Ilargiakaos en HSCSG v15 OS anfibio
---

# Skill: Teoría Cyberpunk/Postcapitalismo Ilargiakaos

**Fuentes**: Libro "Las Sociedades de Conocimiento Científico-Tecnológicas" (Bobadilla, 2023, 190 págs) + 10 artículos (2024-2026) del colectivo Ilargiakaos/Sociología Inquieta/Revista Devenir/El Salto/Capítulo 73
**Autores**: Jose Manuel Bobadilla (@ilargiakaos) + Álvaro Soler + colaboradores
**Cluster**: Filosofía cyberpunk, sociología cibercapitalismo, tecnoanarquismo, postcapitalismo
**Hash**: `sha256:ilargiakaos-ecosystem-2025-2026`

---

## Resumen Ejecutivo

**Ilargiakaos Ecosystem** = Corpus teórico-práctico que articula una **crítica radical al cibercapitalismo** desde una **perspectiva anarquista/neo-anarquista**, proponiendo la **flexibilidad científico-tecnológica** como vía para desvincular la tecnociencia del capitalismo y orientarla al servicio de la vida.

**Tesis central**: *"La especie humana es un animal técnico (Ortega y Gasset) cuya tecnociencia ha sido subyugada por el capitalismo (Mumford). No hay neutralidad tecnológica, pero sí flexibilidad: la cultura orienta la técnica. La tercera vía es un neo-anarquismo que pone la tecnología al servicio de la vida (Bookchin), construyendo nuevos proyectos axiológicos colectivos (Corbí) para las ciberculturas."*

---

## Arquitectura del Conocimiento (3 Pilares + Transversales)

### Pilar 1: Antropología Técnica & No-Dualidad
| Concepto | Autor/Ref | Definición | HSCSG Mapping |
|----------|-----------|------------|---------------|
| **Animal técnico** | Ortega y Gasset | Especie humana adapta medio al sujeto via técnica | `caas.caasStreams` |
| **No dualidad humano-naturaleza** | Bakunin | Humanidad ES naturaleza; técnica = natural | `boundaries.policy` |
| **Indeterminación genética** | Corbí | "Qué" determinados, "cómo" indeterminados → PAC | `aprender.challenges` |
| **Proyecto Axiológico Colectivo (PAC)** | Corbí/Escobar | Estructura narrativa que orienta el hacer técnico | `orquestacion.goals` + `agencia.brandDNA` |
| **Flexibilidad científico-tecnológica** | Campillo/Tejo | Ciencia ciega axiológicamente; cultura orienta | `nodeMode` anfibio |

### Pilar 2: Crítica al Cibercapitalismo & Realismo Capitalista
| Concepto | Autor/Ref | Definición | HSCSG Mapping |
|----------|-----------|------------|---------------|
| **Realismo capitalista** | Mark Fisher | Atmósfera que impide pensar/actuar genuino | `boundaries.policy` |
| **Cibercapitalismo onlife** | Soler/Bobadilla | Capitalismo coloniza ciberespacio + vida biológica | `zeitnus-cooperative.riskProfile` |
| **Tecnomutantes** | Soler/Bobadilla | Sujetos híbridos carbono/silicio resisten desde hibridación | `caas.caasMembers` híbridos |
| **Carne vieja/nueva** | Soler/Bobadilla | Sujeto cartesiano vs cibernético (híbrido, hackeable) | `poh.identities` fluido |
| **Aceleracionismo (Land/CCRU)** | Nick Land | Capitalismo supera humano → postcapitalismo | `anti-accelerationism` |
| **Infección antropológica** | Bobadilla (2026) | Capitalismo infecta concepción de lo humano | `agencia.brandDNA` antídoto |

### Pilar 3: Neo-Anarquismo & Tecnología Liberadora
| Concepto | Autor/Ref | Definición | HSCSG Mapping |
|----------|-----------|------------|---------------|
| **Ecoanarquismo** | Murray Bookchin | Tech al servicio de la vida, libera trabajo físico | `rbe` + `alrac` |
| **Tecnología ecológica** | Bookchin | Regenera biosfera + reduce trabajo alienado | `alrac.alracState` (triple contabilidad) |
| **Solidaridad/Ayuda mutua** | Malatesta/Bakunin | Primacía colectivo; individuo = producto sociedad | `delegacion` + `democracia` (CDS) |
| **Ciberfeminismo propositivo** | Sadie Plant | Comunicación en red, femenina, democrática | `colaberry.channels` no jerárquica |
| **Neoludismo crítico** | Chellis Glendinning | Rechazo tech destructiva; apropiación no capitalista | `boundaries.auditTriggers` |

### Transversales: Ficción/Cine como Análisis Estructural
| Obra | Análisis | HSCSG |
|------|----------|-------|
| Cronenberg (Crimes of the Future) | Cuerpo frontera porosa; tech reconfigura deseo | `aging-control.laws` |
| Blade Runner / ¿Sueñan androides? | Empatía frontera; animales eléctricos = estatus | `poh.identities` no binario |
| Small Soldiers | Juguetes chips militares = deseo postcapitalista latente | `contenido.captureIdea` |
| The Walking Dead / Postapocalipsis | "Día después revolución" (Malatesta) | `civilizaciones` horizontes |
| Cyberpunk (género) | Constructivismo distópico ata capitalismo+tech | `alrac.rao` procedencia imaginarios |

---

## Mapeo a Módulos HSCSG (Vasos Comunicantes)

| Ilargiakaos | → HSCSG | Vaso Comunicante |
|-------------|---------|------------------|
| Animal técnico / Hacer técnico | `caas.caasStreams` | `setCaasStream` |
| Flexibilidad científico-tecnológica | `nodeMode` (postmonetario/conectado) | `priceParity` = oráculo cultural |
| Proyecto Axiológico Colectivo (PAC) | `orquestacion.goals` + `agencia.brandDNA` | `addGoal` + `setBrandDNA` |
| Realismo capitalista (Fisher) | `boundaries.policy` | `setBoundaryPolicy` |
| Cibercapitalismo onlife | `zeitnus-cooperative.riskProfile.operativo` | `assessRiskProfile` |
| Tecnomutantes / Identidad híbrida | `poh.identities` + `identity.graph` | `includeHuman` no binario |
| Aceleracionismo vs Reapropiación | `alrac.alracState` + `virginia.network` | `alracSimulation` |
| Ecoanarquismo / Tech liberadora | `rbe` (3 presupuestos) + `alrac` (ecológica) | `raiseIntegralIssue` ecológico |
| Tech al servicio de la vida (Bookchin) | `caas.caasPayouts` + `zeitnus.dividendPolicy` | `runCaasPayout` |
| Ciberfeminismo red/democrático (Plant) | `colaberry.channels` | Arquitectura no jerárquica |
| Neoludismo crítico | `boundaries.policy.auditTriggers` | `tech_extractiva` trigger |
| Carne vieja/nueva / Sujeto cibernético | `poh.identities` + `caas.caasMembers` | Membresía fluida |
| Ficción distópica como prototipado | `contenido.captureIdea` + `story.engine` | `createStoryProject` |
| Postapocalipsis = día después revolución | `civilizaciones.civilizacionesState` | Horizontes postmonetarios |

---

## Decisiones EBD (Evidence-Based Design)

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-ILA-01** | No dualidad humano-tecnología en tipos | Libro Cap.1: Ortega+Bakunin — técnica es natural |
| **EBD-ILA-02** | PAC (Proyecto Axiológico Colectivo) como primitiva gobernanza | Libro Cap.2: Corbí — PAC completa indeterminación genética |
| **EBD-ILA-03** | Flexibilidad científico-tecnológica > Neutralidad | Libro Cap.1.3: Campillo/Tejo — ciencia ciega; cultura orienta |
| **EBD-ILA-04** | Realismo capitalista como boundary detectable | Artículo "Cibercapitalismo y tiempo": Fisher — atmósfera impide pensamiento |
| **EBD-ILA-05** | Tecnología al servicio de la vida (Bookchin) | Libro Cap.3.4: Bookchin — tech liberadora, no de supervivencia |
| **EBD-ILA-06** | Identidad fluida/hibrida (tecnomutantes, carne nueva) | Artículos "Tecnomutantes", "Carne vieja/nueva", "Cuerpos replicantes" |
| **EBD-ILA-07** | Anti-aceleracionismo = reapropiación "lo nuevo" | Artículo "Contra el aceleracionismo": Bobadilla/Soler vs Land/CCRU |
| **EBD-ILA-08** | Ciberfeminismo propositivo (red vs jerarquía) | Libro 1.4.1: Plant/Bañón — comunicación en red, democrática |
| **EBD-ILA-09** | Ficción distópica como prototipado de futuros a evitar | Libro 2.2: Cyberpunk = constructivismo distópico |
| **EBD-ILA-10** | Neoludismo crítico = auditoría tech extractiva | Libro 1.4.3: Glendinning — voces críticas vs destrucción neoliberal |

---

## Validaciones DV (Design Validations)

| ID | Validación | Criterio Éxito |
|----|------------|----------------|
| **DV-ILA-01** | `detectCapitalistRealism(text, code)` → boolean | Detecta "no hay alternativa", "inevitabilidad tech", "mercado decide" |
| **DV-ILA-02** | `assessTechFlexibility(tech, culture)` → score 0-1 | Tech reorientable a cultura no capitalista (CRISPR → medicina vs armas) |
| **DV-ILA-03** | `buildPAC(community, values)` → PAC structure | Genera PAC con: valores, "cómo" actuar, orientación tech |
| **DV-ILA-04** | `simulateAntiAcceleration(future)` → divergence | Simula reapropiación "lo nuevo" vs aceleracionismo Land |
| **DV-ILA-05** | `assessEcoAnarchistTech(tech)` → {liberadora, extractiva, neutra} | Bookchin: libera trabajo? regenera biosfera? reduce alienación? |
| **DV-ILA-06** | `verifyHumanHybridIdentity(agent)` → {carbono, silicio, híbrido, fluido} | Poh extendido: no binario; tecnomutante = híbrido por defecto |
| **DV-ILA-07** | `extractPostcapitalistDesire(artifact)` → desire_map | Cronenberg, Blade Runner, Small Soldiers → deseos latentes |
| **DV-ILA-08** | `auditNeoludditeTrigger(tech_deployment)` → audit_entry | Glendinning: tech neoliberal = destrucción; trigger auditoría |
| **DV-ILA-09** | `measureCyberfeministComms(network)` → {red_score, jerarquia_score} | Plant: red (femenina, democrática) vs lineal (masculina, jerárquica) |
| **DV-ILA-10** | `simulatePostApocalypticDayAfter(scenario)` → governance_model | Malatesta: "día después revolución" → neo-anarquismo operativo |

---

## Estructura Archivos FASE 3 — PROPUESTA

```
src/core/lib/ilargiakaos-theory.ts           # Lógica pura: 10 funciones DV
src/core/lib/ilargiakaos-types.ts            # Tipos: TechnoMutant, CyberneticSubject, CapitalistRealism, PAC, Accelerationism, EcoAnarchistTech, PostcapitalistDesire
src/core/state/ilargiakaos.ts                # Estado: PAC activo, realismo detectado, identidad híbrida, deseos postcapitalistas, auditorías neoludistas
src/core/state/hooks/ilargiakaos.ts          # Zustand store persistente, migración v1→v2
src/app/screens/IlargiakaosTheoryDashboard.tsx  # Dashboard: realismo capitalista, PAC builder, simulador anti-aceleración, analizador deseos
src/app/screens/IlargiakaosCulturalAnalyzer.tsx # Analizador cultural: cine (Cronenberg), ficción (Blade Runner), cultura pop (Small Soldiers)
src/app/screens/IlargiakaosGovernance.tsx     # Gobernanza neo-anarquista: PAC builder, solidaridad, ecoanarquismo, ciberfeminismo
src/app/screens/IlargiakaosFutures.tsx        # Futuros: postapocalipsis, postcapitalismo, tecnomutantes, reapropiación lo nuevo
src/app/layout/Aside.tsx                      # Nav item "ilargiakaos" (icon: Brain/Cpu, color: cyan-400)
src/core/lib/i18n.ts                          # Claves ES/EN/PT para ilargiakaos.*
openspec/specs/ilargiakaos/openapi.yaml       # OpenSpec 3.0 endpoints
```

---

## Pitfalls Descubiertos

| Pitfall | Regla |
|---------|-------|
| **Confundir neutralidad con flexibilidad** | Neutralidad = tech no tiene valores (FALSO); Flexibilidad = tech se adapta a cultura (VERDADERO) |
| **Atribuir males a la técnica** | Campillo: "se atribuye a la Técnica los males, eliminando responsabilidad de los hombres" |
| **Aceptar realismo capitalista como inevitable** | Fisher: es atmósfera condicionante, no ley física; detectable y rompible |
| **Binario humano/IA en identidad** | Tecnomutantes = híbridos por defecto; Poh extendido no binario |
| **Aceleracionismo como única salida** | Land/CCRU: capitalismo supera humano; Anti-aceleracionismo = reapropiar "lo nuevo" |
| **Ignorar ficción como análisis estructural** | Cyberpunk/Cronenberg/Blade Runner = prototipado de futuros a evitar/construir |
| **Neoludismo = anti-tech** | Glendinning: crítico vs destructiva; exige apropiación NO capitalista |
| **Ciberfeminismo = solo crítica** | Plant/Bañón: propositivo — comunicación en red, femenina, democrática |
| **Separar ecología de tecnología** | Bookchin: tech ecológica = al servicio de la vida, libera trabajo físico |
| **Postapocalipsis = fin** | Malatesta: "día después de la revolución" = inicio de neo-anarquismo operativo |

---

## Conexión Módulos HSCSG Existentes

- **zeitnus-cooperative** → `ilargiakaos.theory` = versión teórica/cultural del ecosistema cooperativo
- **aging-control** → `ilargiakaos.culturalAnalyzer` = Cronenberg = leyes control sobre cuerpo híbrido
- **rbe/alrac** → `ilargiakaos.governance` = ecoanarquismo Bookchin = triple contabilidad + tech liberadora
- **poh/kleros** → `ilargiakaos.theory` = identidad fluida, no cartesiana, tecnomutantes
- **boundaries** → `ilargiakaos.theory` = realismo capitalista detectable + neoludismo auditoría
- **colaberry** → `ilargiakaos.governance` = ciberfeminismo Plant = comunicación en red no jerárquica
- **contenido/story** → `ilargiakaos.culturalAnalyzer` = ficción como prototipado de futuros
- **civilizaciones** → `ilargiakaos.futures` = horizontes postmonetarios (Auravana, TVP, RBE)
- **offer-designer** → `ilargiakaos.culturalAnalyzer` = deseos postcapitalistas latentes en cultura
- **caas** → `ilargiakaos.theory` = animal técnico = vectores CaaS de adaptación

---

## Próximos Pasos (post-FASE 3)

1. **i18n keys** — Añadir `ilargiakaos.*` a `src/core/lib/i18n.ts` (ES/EN/PT)
2. **OpenSpec** — `openspec/specs/ilargiakaos/openapi.yaml` (endpoints: /realism, /pac, /acceleration, /identity, /desire, /audit, /comms, /futures)
3. **Skills separadas** — `ilargiakaos-theory-core`, `ilargiakaos-cultural-analyzer`, `ilargiakaos-governance`, `ilargiakaos-futures`
3. **Migración v2** — Backend cloud + sync `nodeMode`
4. **TypeScript compile** — `npx tsc --noEmit` + fix errors
5. **Integración CulturalAnalyzer** — Conectar con `contenido.captureIdea` + `story.engine`

---

## Notas Propiedad Intelectual

- **Libro**: Jose Manuel Bobadilla (@ilargiakaos), ISBN 978-84-685-7472-1, Bubok 2023 — **Solo lógica/arquitectura/patrones**. NO texto textual.
- **Artículos**: Coautoría Álvaro Soler + Jose Bobadilla + Sociología Inquieta/Revista Devenir/El Salto/Capítulo 73 — **Uso analítico transformativo**.
- **Atribución**: "Basado en corpus Ilargiakaos (Bobadilla/Soler, 2023-2026): libro 'Sociedades de Conocimiento...' + artículos cyberpunk/postcapitalismo"
- **Licencia**: HSCSG (código abierto, atribución, uso transformativo)

---

*Skill generada: 2026-10-30 | HSCSG v15 OS | Principio Anfibio aplicado*