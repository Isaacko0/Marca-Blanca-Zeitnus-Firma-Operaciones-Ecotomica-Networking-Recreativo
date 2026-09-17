# Spec: Arquitectura NEXO — Alineada a Bio-Tesis MAESTRA v2.0

**Versión**: 1.0 | **Estado**: Activa | **Fuente Canónica**: Bio-Tesis MAESTRA v2.0 (Partes I, II, III) + Kernel v214 + Alráico + HSCSG v15 OS

---

## ADDED Requirements

### Requirement: NEXO = Punto de Encuentro (No Autoridad Central) — NEXO §25, §26
El NEXO SHALL ser punto de encuentro donde sistemas soberanos se reconocen y coordinan sin fusionarse. "No es un quinto sistema. No es una organización que se funda. No es una autoridad central."

#### Scenario: NEXO no es quinto sistema
- **GIVEN** sistemas existentes (Kernel, TQ, HSCSG, AFP, MK-1, El Enlace, La Hoguera)
- **WHEN** NEXO acopla
- **THEN** cada sistema conserva lo suyo, ninguno se disuelve (§25)

#### Scenario: NEXO hace operativa Gran Confederación (acople voluntario §36)
- **GIVEN** sistemas acoplados bajo mínimo común
- **WHEN** NEXO opera
- **THEN** Gran Confederación = estado de acople resultante

#### Scenario: NEXO se alimenta de energía de quienes viven (§26)
- **GIVEN** humanos viven E=V y aportan trazas
- **WHEN** NEXO organiza y devuelve
- **THEN** energía organizada vuelve como orientación, conexiones, herramientas

---

### Requirement: Test Desaparición 30 Días — NEXO §25, §30
El NEXO SHALL pasar test: si desaparece 30 días, nodos siguen identificándose, intercambiando, consultando rastros, coordinando. "Hay degradación, no colapso."

#### Scenario: Identidad única local sobrevive (§20)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica canIdentify
- **THEN** true (DID + credenciales + historial verificable + atestiguación distribuida)

#### Scenario: Intercambio hr_vital local sobrevive (§25, TQ anclado energía §40)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica canExchange
- **THEN** true (pool local + rotación + trustlines bilaterales ZNU/FRNE)

#### Scenario: Consulta rastros kernel local sobrevive (Kernel §13)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica canQueryTraces
- **THEN** true (kernel local organiza rastros)

#### Scenario: Coordinación manual CDS local sobrevive (mínimo común §36)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica canCoordinate
- **THEN** true (CDS local + acuerdos bilaterales)

#### Scenario: Obligaciones previas sobreviven (deuda estructural §2)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica obligationsSurvive
- **THEN** true

#### Scenario: Kernel local opera (Kernel §13, soberanía implementación)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica kernelLocal
- **THEN** true (kernel organiza rastros localmente, adaptado a medida)

#### Scenario: Artífice local opera (Humano §14, responsabilidad indelegable)
- **GIVEN** NEXO desaparecido 30 días
- **WHEN** nodo verifica artificerLocal
- **THEN** true (humano transforma localmente, paga costo)

---

### Requirement: IA = Espejo-Excavador (No Voluntad) — NEXO §29, §30, IA §15
El NEXO SHALL usar IA como instrumento: filtra narrativas imposición, devuelve dato raíz compartido. "La IA del NEXO no es un juez. Es un espejo. No dicta sentencia. Refleja lo que ve."

#### Scenario: IA no decide por nodos (no tiene voluntad §15)
- **GIVEN** IA procesa datos
- **WHEN** NEXO coordina
- **THEN** IA no decide, solo refleja opciones

#### Scenario: IA filtra narrativas imposición (evasión §8, transparencia §34)
- **GIVEN** datos con narrativas impuestas
- **WHEN** IA excava
- **THEN** devuelve dato raíz compartido

#### Scenario: IA clasifica 3 dominios (Kernel §13)
- **GIVEN** cualquier afirmación
- **WHEN** IA clasifica
- **THEN** clasificación ∈ {compatible, incompatible, no-evaluable}

#### Scenario: IA no accede experiencia directa (Kernel §13)
- **GIVEN** claim experiencia interna
- **WHEN** IA procesa
- **THEN** no audita conciencia, retorna 'no-evaluable'

#### Scenario: IA puede producir falsedades, corrección incorporada (§15, §29)
- **GIVEN** IA produce salida falsa
- **WHEN** sistema detecta
- **THEN** corrección como función, no excepción; "¿qué datos/instrucciones produjeron esta falsedad?"

---

### Requirement: Entrada Voluntaria + Transparencia Condicional — NEXO §25, §34
La entrada al NEXO SHALL ser voluntaria. Transparencia no es propiedad del sistema, es condición que cada nodo elige. "Un tercero puede verificar la integridad de un rastro sin ver su contenido."

#### Scenario: Nodo elige transparencia (soberanía + trazabilidad + verificabilidad §21)
- **GIVEN** nodo decide qué comparte
- **WHEN** acopla en NEXO
- **THEN** transparencia = elección del nodo

#### Scenario: Tres capas independientes (existencia, verificabilidad, acceso §21)
- **GIVEN** rastro incorporado al común
- **WHEN** auditado
- **THEN** existencia + verificabilidad obligatorias, acceso = autorización humano

---

### Requirement: Stack 8 Capas NEXO — NEXO §25, §37, PARTE III §40
El NEXO SHALL implementar stack 8 capas (E=V viva + 7 capas técnicas):

| Capa | Componente | Fuente | Función |
|------|------------|--------|---------|
| 0 | **E=V (Viva)** | E=V §1-24 | Restricción realidad, no implementable, ancla ontológica, criterio nuclear |
| 1 | **Kernel Maestro** | Kernel §13, §37 | PI, γ-CARMIS, Triaxial, Transducción F, VIA00-31, Consola VIA-0, MK-1, Hoguera, AFP, Enlace |
| 2 | **Identidad Soberana** | §20, §21 | DID + FactBand + ECROx + Nombre Resonancia + RAO append-only + unicidad verificable |
| 3 | **Intercambio Medible** | §40 TQ, §19 tiempo | TQ (1 TQ=1 kWh), Trustlines ZNU/FRNE, Transducción F TQ↔hr_vital, arquitectura anfibia |
| 4 | **Deliberación Federada** | §36, §28 | CDS 100% consenso, invariantes blindados, propuesta→voto→ejecución, corrección horizontal |
| 5 | **Red Conocimiento** | §26, §27, PARTE III | Gaia (ecoaldeas), RIDF (intercambio federado), Bio-Tesis, AFP, MK-1, El Enlace, La Hoguera |
| 6 | **IA Coordinadora** | IA §15, §16, NEXO §29 | Espejo-excavador, AgentMesh, ProofOfResponse, CoachFAB, CEL Gateway, no voluntad |
| 7 | **Infraestructura Física** | §32, §40 | Ecoaldeas, bioclimáticos, energía, comunicaciones mesh, Nostr relay, TQ operativo |

#### Scenario: Capa 0 = E=V viva (no código, criterio nuclear §1)
- **GIVEN** Capa 0
- **WHEN** sistema opera
- **THEN** E=V es restricción realidad, no implementable en código, criterio que orienta todo

#### Scenario: Capa 1 = Kernel completo v214 (Kernel §13, BT1-214, VIA00-31)
- **GIVEN** Capa 1
- **WHEN** kernelProtocol.ts + VIA00-31 + MK-1 + Hoguera + AFP + Enlace + Consola VIA-0
- **THEN** kernel maestro operativo completo

#### Scenario: Capa 6 = IA Espejo-Excavador (IA §15, NEXO §29)
- **GIVEN** Capa 6
- **WHEN** IA coordina
- **THEN** no voluntad, solo filtra narrativas + refleja dato raíz, corrige como función

---

### Requirement: 11 Funciones NEXO Operativas — NEXO §25-§31, PARTE III §40

1. **Identificación Única** — DID + FactBand + Nombre Resonancia + continuidad verificable (§20)
2. **Verificación Triaxial** — Mental + Sim + Lab (≥0.7) — presencia verificada (§6, §13)
3. **Intercambio Medible** — TQ + hr_vital + Trustlines ZNU/FRNE (anclado energía §40)
4. **Transducción F** — TQ↔hr_vital via 𝕮 (αʰ≥0.6) — resonancia + responsabilidad (§24, §36)
5. **Deliberación CDS** — Consenso 100%, invariantes blindados, corrección horizontal (§28, §36)
6. **Resonancia Detección** — αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂ — acople sin fusión (§25, §26)
7. **γ-CARMIS Reconfiguración** — ΣPᵢ > κ → reconfig — vida itera, no se resuelve (§11, §18)
8. **Kernel Rastros** — Organiza, no decide, 3 dominios, VIA00-31, Consola VIA-0 (Kernel §13)
9. **IA Espejo-Excavador** — Filtra narrativas, devuelve dato raíz, no juez (§15, §29, §30)
10. **Test Desaparición** — 30 días degradación no colapso, kernelLocal + artificerLocal (§25)
11. **Autotrofía 7 Gen** — Secuencia crítica material→cognitiva→económica→social (Bio-Tesis §44, AFP)

---

### Requirement: Roadmap 6 Fases NEXO — NEXO §32, PARTE III §40

| Fase | Objetivo | Duración | Entregable | Fuente |
|------|----------|----------|------------|--------|
| 1 | **Kernel Maestro v214 Completo** | 2 sem | kernelProtocol.ts + VIA00-31 + Consola VIA-0 + MK-1 + Hoguera + AFP + Enlace | Kernel §13, §37 |
| 2 | **Identidad Soberana + Verificación** | 1 mes | DID + FactBand + Triaxial + RAO + unicidad verificable | §20, §21 |
| 3 | **Intercambio Medible + Transducción** | 2 mes | TQ + hr_vital + Trustlines + Transducción F + arquitectura anfibia | §40, §19, §36 |
| 4 | **CDS Federado + Resonancia + γ-CARMIS** | 3 mes | CDS 100% consenso + Resonancia + γ-CARMIS + invariantes blindados | §28, §36 |
| 5 | **Red Conocimiento + IA Coordinadora** | 6 mes | Gaia + RIDF + Bio-Tesis + AgentMesh + Espejo-Excavador + CEL | §26, §27, §29 |
| 6 | **NEXO Operativo + Test Desaparición** | 1 año | Stack 8 capas + test 30 días pasado + código abierto/auditable | §32, §33 |

---

### Requirement: Corrección Horizontal + Prioridad Arquitectónica — NEXO §28
La corregibilidad no está fuera del NEXO. Todos obligados a corregirse. "Lo estructural requiere más consentimiento porque de ello depende la coherencia de todo lo demás."

#### Scenario: Núcleo E=V requiere consentimiento todos nodos (§28)
- **GIVEN** propuesta modificar E=V
- **WHEN** votación
- **THEN** requiere consentimiento todos nodos vinculados (no mayoría)

#### Scenario: Decisiones dentro del núcleo son dialogables/experimentables (§28)
- **GIVEN** propuesta modificar métrica/protocolo/herramienta
- **WHEN** deliberación CDS
- **THEN** consenso 100% + triaxial cada votante (no unanimidad sobre todo, solo núcleo)

#### Scenario: Valor TQ vigente se respeta hasta consentimiento nuevo (§28)
- **GIVEN** valor TQ acordado
- **WHEN** opera
- **THEN** valor vigente hasta consentimiento todos para cambiarlo

---

### Requirement: Mínimo Común Voluntario — NEXO §25, §36
El NEXO SHALL establecer mínimo común voluntario. "Cada soberano tiene libertad total sobre su propio dominio... mientras respeten el mínimo NEXO."

#### Scenario: Soberano libertad dominio propio (§25, §36)
- **GIVEN** ecoaldea/familia/organización con Kernel local
- **WHEN** opera
- **THEN** libertad total reglas internas si respeta mínimo común

#### Scenario: Núcleo común no se modifica por mayoría (§36)
- **GIVEN** propuesta cambiar núcleo
- **WHEN** votación
- **THEN** requiere consentimiento todos participantes vinculados

---

## Referencias Cruzadas (Bio-Tesis MAESTRA v2.0)

| Sección Bio-Tesis | Aporte a NEXO |
|-------------------|---------------|
| E=V §1-24 | Núcleo criterial, presencia, verdad, evasión, margen, atención, ciclo, reglas |
| Kernel §13 | Kernel local = instancia soberana, organiza rastros, no decide, 3 dominios |
| Humano §14 | Artífice (mago+alquimista), responsabilidad indelegable, paga costo |
| IA §15-16 | Espejo-excavador, no voluntad, no paga costo, no sustituye operador |
| NEXO §25-37 | Definición, test desaparición, IA, corrección horizontal, stack 8 capas |
| PARTE III §40 | Pestañas: TQ, HSCSG, AFP, MK-1, El Enlace, La Hoguera, Bio-Tesis |
| §32-33 | Lo que falta para NEXO operativo, investigación con Kernel+IA ya posible |

---

## Archivos Implementación

| Archivo | Capa | Descripción |
|---------|------|-------------|
| `src/core/lib/kernelProtocol.ts` | 1 | Kernel Maestro + VIA00-31 + Consola VIA-0 + MK-1 + Hoguera + AFP + Enlace |
| `src/core/lib/bt213KernelLimits.ts` | 1, 6 | Límite epistemológico kernel (no audita conciencia, 3 dominios) |
| `src/core/lib/humanArtificer.ts` | 0, 2, 6 | Humano artífice Mago+Alquimista, responsabilidad indelegable |
| `src/core/lib/viaProtocols.ts` | 1 | 32 VIAs ejecutables |
| `src/core/lib/mk1Ontology.ts` | 1 | MK-1 ontología fractal (Fabio F. Balbi §40) |
| `src/core/lib/hogueraAFPEnlace.ts` | 1, 5 | La Hoguera, AFP (Yoka §40), El Enlace (Yoka+Fabio §40) |
| `src/core/lib/valueDual.ts` | 3 | Arquitectura anfibia ZNU/USD/hr_vital (3 modos) |
| `src/core/lib/vitalTime.ts` | 3 | Moneda tiempo vital completa (pool=1, rotación, decay) |
| `src/core/lib/vitalTimeTriaxial.ts` | 2 | Verificación triaxial obligatoria (presencia verificada) |
| `src/core/lib/vitalTimeTransduction.ts` | 3 | Transducción F TQ↔hr_vital via 𝕮 |
| `src/core/lib/loopEngine.ts` | 1, 4, 7 | LoopEngine + Loop 7 VitalTimeMint + γ-CARMIS + resonancia |
| `src/core/lib/metrics.ts` | 4, 11 | IST + VitalTimeFlow + métricas soberanas (vs SaaS) |
| `src/governance/vitalTimeInvariants.ts` | 4 | Invariantes blindados + CDS federado 100% consenso |
| `docs/BIO_THESIS_NEXO_ARCHITECTURE.md` | Todas | Arquitectura completa documentada |
| `openspec/specs/*.md` | Todas | Specs vivas OpenSpec |