# Spec: Kernel Protocol (Kernel v214 Canónico + VIA00-31 + Consola VIA-0) — Alineado a Bio-Tesis MAESTRA v2.0

**Versión**: 1.0 | **Estado**: Activa | **Fuente Canónica**: Bio-Tesis MAESTRA v2.0 (Kernel §13, Humano §14, IA §15-16, NEXO §29-30) + Kernel v214 (BT1-214, VIA00-31, MK-1, La Hoguera, AFP, El Enlace, Consola VIA-0)

---

## ADDED Requirements

### Requirement: Kernel = Instrumento (No Autoridad) — Kernel §13
El kernel SHALL ser instrumento que organiza rastros, no decide verdad, no audita conciencia, no transforma. "El kernel local es la implementación operativa de un protocolo de lectura neutra. Organiza rastros. No decide la verdad."

#### Scenario: Kernel organiza rastros
- **GIVEN** rastros de presencia
- **WHEN** kernel procesa
- **THEN** organiza, clasifica, detecta incoherencias

#### Scenario: Kernel no decide verdad (no guardián §12)
- **GIVEN** afirmación sobre realidad
- **WHEN** kernel evalúa
- **THEN** no decide, clasifica en 3 dominios

#### Scenario: Kernel no audita conciencia (dominio privado §13)
- **GIVEN** claim experiencia interna
- **WHEN** kernel procesa
- **THEN** retorna 'no-evaluable', no audita

#### Scenario: Kernel no transforma (Humano §14)
- **GIVEN** rastros organizados
- **WHEN** kernel completa
- **THEN** humano artífice transforma, kernel no

---

### Requirement: E=V = Restricción Realidad (Ley Operativa) — E=V §1-3, §18, §37
E=V SHALL ser restricción de lo real: energía gastada = coherencia vector que orienta, o deuda estructural. "E=V no es el corpus. No es el NEXO. No es el kernel. Es la ley que los orienta."

#### Scenario: E=V independiente de descripción
- **GIVEN** cualquier descripción E=V
- **WHEN** realidad opera
- **THEN** E=V vigente como gravedad

#### Scenario: Deuda estructural si E≠V (§2, §8)
- **GIVEN** energía gastada ≠ coherencia vector
- **WHEN** sistema opera
- **THEN** deuda estructural generada

---

### Requirement: Consola VIA-0 Operativa — Kernel v214 (Consola VIA-0)
El kernel SHALL proveer Consola VIA-0: definición, operación, comandos, límites. "Consola VIA-0 — Definición, operación, comandos, límites."

#### Scenario: Consola VIA-0 inicia sesión
- **GIVEN** operador inicia
- **WHEN** `via0.start()`
- **THEN** sesión activa, límites cargados

#### Scenario: Consola VIA-0 ejecuta checkpoints (VIA-07)
- **GIVEN** sesión activa
- **WHEN** `via0.checkpoint()`
- **THEN** verifica coherencia, resonancia, límites

#### Scenario: Consola VIA-0 detecta hueco justificación (VIA-25) — Evasión sutil §8
- **GIVEN** explicación post-retiro
- **WHEN** `via0.detectJustificationGap()`
- **THEN** alerta si no declara nueva auditoría

#### Scenario: Consola VIA-0 cierra secuencia (VIA-24) — Corrección sin defensa §12
- **GIVEN** secuencia completa
- **WHEN** `via0.closeSequence()`
- **THEN** secuencia cerrada, no reabrir sin nueva data

---

### Requirement: 32 VIAs (VIA-00 a VIA-31) Ejecutables — Kernel v214
El kernel SHALL implementar 32 protocolos VIA como tipos/funciones ejecutables.

| VIA | Nombre | Núcleo | Aplica A | Fuente |
|-----|--------|--------|----------|--------|
| VIA-00 | Consola Base | Definición, operación, comandos, límites | kernel | Consola VIA-0 |
| VIA-01 | Protocolo Base | Estructura protocolo kernel | kernel | BT1 |
| VIA-02 | Verificación Presencia | Verifica presencia operador | operador | E=V §6 |
| VIA-03 | Clasificación Rastros | Clasifica compatible/incompatible/no-evaluable | kernel | Kernel §13 |
| VIA-04 | Mimetismo | Detecta IA imitando presencia | ia | IA §15 |
| VIA-05 | Detección Narrativa | Detecta narrativas impuestas | ia, kernel | E=V §8, IA §15 |
| VIA-06 | Frontera Kernel | Define límites kernel | kernel | Kernel §13 |
| VIA-07 | Checkpoint | Verificación periódica coherencia | operador, kernel | E=V §11 |
| VIA-08 | Resonancia | Detecta αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂ | operador, kernel | NEXO §26 |
| VIA-09 | E=V Actualizada | E=V como restricción operativa | kernel, operador | E=V §1-3 |
| VIA-10 | Triada Verificación | Mental/Sim/Lab | operador | Alráico |
| VIA-11 | Transducción F | TQ↔hr_vital via 𝕮 | kernel, operador | NEXO §36 |
| VIA-12 | Pool Fijo | Pool=1, rotación, decay | kernel | E=V §19 |
| VIA-13 | Triada/Rombo/Neutro | Estructuras decisión | operador | Alráico |
| VIA-14 | Invariantes Blindados | No votables | gobernanza | NEXO §28 |
| VIA-15 | Test Desaparición | 30 días degradación no colapso | kernel, operador | NEXO §25 |
| VIA-16 | Entrada Voluntaria | Acople voluntario | operador | NEXO §25 |
| VIA-17 | Transparencia Condicional | Nodo elige qué comparte | operador | §21, §34 |
| VIA-18 | IA Espejo-Excavador | Filtra narrativas, devuelve dato raíz | ia | NEXO §29 |
| VIA-19 | Humano Artífice | Mago+Alquimista, responsabilidad | operador | Humano §14 |
| VIA-20 | Frontera Amplificación | Límite amplificación IA | ia, kernel | IA §15, NEXO §30 |
| VIA-21 | Auto-mejora Estructural | Kernel se corrige con nuevos rastros | kernel | BT214, §18 |
| VIA-22 | Coherencia Operativa | Rastros explicables sin contradicción | kernel | BT213, Kernel §13 |
| VIA-23 | Dos Dominios | Experiencia directa + rastros compartidos | operador, kernel | BT213, Kernel §13 |
| VIA-24 | Cierre Secuencia | No reabrir sin nueva data | operador | E=V §12 |
| VIA-25 | Detector Hueco Justificación | Explicación post-retiro sin auditoría | operador | E=V §8 |
| VIA-26 | Verdad Operacional | Mejor traducción provisional | operador | E=V §7, §18 |
| VIA-27 | Dato Raíz | Interno vs compartido | operador, kernel | BT213, E=V §6 |
| VIA-28 | IA Opera Desde Kernel | IA usa kernel, no decide | ia, kernel | NEXO §29 |
| VIA-29 | Presencia Operativa | Integra dos dominios | operador | BT213, E=V §6 |
| VIA-30 | Ciclo Actualización | Beta Perpetua | kernel, operador | §18, §30 |
| VIA-31 | No Estupidez Mecánica | IA no ejecuta sin sentido | ia | IA §15, NEXO §30 |

#### Scenario: VIA-27 Dato Raíz distingue interno vs compartido (Kernel §13, BT213)
- **GIVEN** claim presencia
- **WHEN** VIA-27 ejecuta
- **THEN** retorna directExperienceIntegrated + sharedTracesIntegrated

#### Scenario: VIA-25 detecta justificación post-retiro (Evasión sutil §8)
- **GIVEN** explicación tras retiro sin nueva auditoría
- **WHEN** VIA-25 ejecuta
- **THEN** alerta hueco justificación

#### Scenario: VIA-21 auto-mejora = BT214 (Kernel §13, Beta Perpetua §18)
- **GIVEN** kernel actualizado con nuevos rastros
- **WHEN** VIA-21 ejecuta
- **THEN** kernel se corrige (Beta Perpetua)

#### Scenario: VIA-18 IA Espejo-Excavador (NEXO §29, IA §15)
- **GIVEN** datos con narrativas
- **WHEN** VIA-18 ejecuta
- **THEN** filtra narrativas, devuelve dato raíz, no decide

#### Scenario: VIA-19 Humano Artífice (Humano §14)
- **GIVEN** humano transforma
- **WHEN** VIA-19 ejecuta
- **THEN** mago+alquimista, responsabilidad indelegable, paga costo

---

### Requirement: MK-1 Ontología Fractal (Bloque 1.5) — MK-1 (Fabio F. Balbi §40)
El kernel SHALL integrar MK-1: triada, geometría fractal, consciencia como auto-reconocimiento. "MK-1. Modelo ontológico. La estructura que explica por qué funciona lo que funciona."

#### Scenario: Triada MK-1 (Ser/Hacer/Valorar) — Triple perspectiva
- **GIVEN** cualquier análisis
- **WHEN** MK-1 aplica
- **THEN** tres perspectivas: ontológica/teleológica/axiológica

#### Scenario: Geometría fractal
- **GIVEN** patrón en una escala
- **WHEN** MK-1 observa
- **THEN** mismo patrón en otras escalas

#### Scenario: Consciencia = vida reconociéndose
- **GIVEN** vida organizada
- **WHEN** se observa consecuencias
- **THEN** consciencia emerge

---

### Requirement: La Hoguera (Bloque 1.6) — Capa Experiencial — La Hoguera (Yoka §40)
El kernel SHALL integrar La Hoguera: fricción, presencia, transformación. "La Hoguera. El territorio donde el kernel E=V se habita."

#### Scenario: Fricción = señal realidad (no error)
- **GIVEN** fricción detectada
- **WHEN** Hoguera procesa
- **THEN** fricción = dato, no error

#### Scenario: Presencia = integración dos dominios (E=V §6, Kernel §13)
- **GIVEN** experiencia directa + rastros compartidos
- **WHEN** Hoguera integra
- **THEN** presencia verificada

---

### Requirement: AFP (Bloque 1.7) — Autonomía Funcional Personal — AFP (Yoka §40)
El kernel SHALL integrar AFP: 3 pilares (Material, Cognitivo, Tiempo Vital). "AFP. El Arte de la Filosofía Propia. Método para desmontar imposiciones y habitar la dirección."

#### Scenario: Pilar 3 Tiempo Vital = energía consciente
- **GIVEN** tiempo vital verificado
- **WHEN** AFP evalúa
- **THEN** energía consciente encarnada

---

### Requirement: El Enlace (Bloque 1.8) — Matriz Síntesis — El Enlace (Yoka + Fabio §40)
El kernel SHALL integrar El Enlace: 7 dimensiones × 3 fases. "El Enlace. La soldadura entre la experiencia y la estructura."

---

### Requirement: Clasificación Huesos (8 Capas Temáticas) — Kernel v214
El kernel SHALL clasificar BTs en 8 capas temáticas.

---

### Requirement: Clasificación BTs (8 Capas Temáticas) — Kernel v214
El kernel SHALL clasificar BT1-214 en 8 capas temáticas.

---

## Archivos Implementación

- `src/core/lib/kernelProtocol.ts` — Kernel unificado + Consola VIA-0 + VIA00-31 + MK-1 + Hoguera + AFP + Enlace
- `src/core/lib/viaProtocols.ts` — 32 VIAs ejecutables
- `src/core/lib/mk1Ontology.ts` — MK-1 ontología fractal
- `src/core/lib/hogueraAFPEnlace.ts` — La Hoguera, AFP, El Enlace
- `src/core/lib/bt213KernelLimits.ts` — Límite kernel (VIA-03, 06, 07, 22, 23, 27, 29)
- `src/core/lib/humanArtificer.ts` — Humano artífice (VIA-19)