# Integración The Culture Hack Method — ALRAC/Zeitnus

**Fuente asimilada:** `docs/culture-hack-method_backup.md` — The Culture Hack Method, Culture Hack Labs, currículo de cambio sistémico liderado por narrativas (Narrative-Led Systems Change), 5 pasos + Introducción.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). La metodología es de terceros (Culture Hack Labs); se asimila como marco de intervención narrativa con 7 módulos (Introducción + 5 pasos + herramientas). Conecta con CDS (evidencia, reputación, deliberación), RAO (procedencia), gobernanza holónica, narrativa como infraestructura, onto-shift como cambio ontológico, y límites duros de `boundaries.ts`.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un marco de intervención narrativa** basado en Narrative-Led Systems Change: Justice plus Onto-Shift (demandas de justicia + cambio ontológico profundo).
- **Un proceso de 5 pasos:** Ask (Point of View), Listen (Listening Model, Narrative Communities), Understand (Attention/Network/Power, Language, Justice-Ontology axes, Window of Discourse), Recode (Narrative Strategy, Audiences, Objectives, reframe), Hack (medio, mensaje, Hacking Tree, logística, evaluación).
- **Identificar Narrative Communities** en el espacio narrativo mediante técnicas de escucha (big/small listening).
- **Mapear comunidades usando ejes Justicia-Ontología** para revelar patrones y posiciones.
- **Identificar la Window of Discourse** y dónde se quiere desplazar.
- **Desarrollar una estrategia narrativa:** audiencias, objetivos narrativos, reencuadre (reframe).
- **Elegir el medio adecuado** y traducir frames en palabras (verbos, adjetivos, sujetos).
- **Herramientas:** Community Mapping Tool, Hacking Tree (Media, Meme, Tone, Hack), logística, evaluación e iteración.
- **Metodo vivo (living method):** adaptable, no rígido, hecho para ser apropiado por cada usuario.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto Culture Hack | Módulo Zeitnus/ALRAC destino | Observación |
|-----------------------|------------------------------|-------------|
| Narrative-Led Systems Change: Justice plus Onto-Shift | `culture-hack-method.ts` (NUEVO) | Justicia + cambio ontológico como núcleo |
| 7 módulos: Introducción + Ask/Listen/Understand/Recode/Hack | `culture-hack-method.ts` + `registrySystem.ts` | Proceso estructurado, no lineal rígido |
| Point of View (POV) statement | `culture-hack-method.ts` | Contexto, objetivos, identidad, motivación, resultados deseados, métodos |
| Listening Model | `culture-hack-method.ts` | Transformar POV en modelo de escucha |
| Narrative Communities | `culture-hack-method.ts` + `registrySystem.ts` | Comunidades en el espacio narrativo |
| Big/small listening techniques | `culture-hack-method.ts` | Técnicas de recopilación y clasificación de datos |
| Attention, Network and Power analysis | `culture-hack-method.ts` | Análisis de comunidades narrativas |
| Language analysis | `culture-hack-method.ts` | Análisis de lenguaje, frames semánticos, metáforas conceptuales |
| Justice-Ontology axes mapping | `culture-hack-method.ts` | Mapeo con ejes de justicia y ontología |
| Window of Discourse | `culture-hack-method.ts` | Ubicación actual y desplazamiento deseado |
| Narrative Strategy: Audiences, Objectives, reframe | `culture-hack-method.ts` | Estrategia de intervención narrativa |
| Medio, mensaje, palabras (verbos, adjetivos, sujetos) | `culture-hack-method.ts` | Traducción de frames a palabras |
| Hacking Tree: Media, Meme, Tone, Hack | `culture-hack-method.ts` | Árbol de intervención |
| Logistics, Evaluation & Iteration | `culture-hack-method.ts` | Logística de la intervención, evaluación, iteración |
| Living method (método vivo, adaptable) | `culture-hack-method.ts` + `boundaries.ts` | No rígido, apropiable |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Plataforma web específica de culturehack.io | Infra de plataforma ajena | Lógica pura en TS; UI propia de HSCSG |
| Casos de estudio y documentarios de therules.org | Contenido externo no incluido | Referencias sin copiar contenido |
| Herramientas digitales específicas de Culture Hack Labs | Infra ajena | Reimplementación pura en TS como lógica de dominio |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de Culture Hack Method |
|--------|------------------------------|
| `src/core/lib/culture-hack-method.ts` | (NUEVO) 7 módulos, POV, Listening Model, Narrative Communities, ANP, Language, Justice-Ontology axes, Window of Discourse, Narrative Strategy, Hacking Tree |
| `src/core/state/culture-hack-method.ts` | (NUEVO) Estado del método, pasos, comunidades, ventanas de discurso, estrategias |
| `src/core/lib/cds.ts` | Evidencia, reputación, deliberación para comunidades narrativas |
| `src/core/lib/rao.ts` | Procedencia de narrativas y frames |
| `src/core/lib/registrySystem.ts` | Registro de comunidades narrativas, POV, estrategias |
| `src/core/lib/boundaries.ts` | DENY: manipulación narrativa sin justicia, onto-shift sin consentimiento, narrativas extractivas |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Culture Hack: "disrupt the core assumptions of capitalist modernity"; justicia antes que onto-shift; narrativas no extractivas.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** la justicia como prerequisito del onto-shift es isomórfica a no dañar la base material antes de intervenir.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Culture Hack: método vivo, auto-dirigido, apropiable; narrativa como herramienta de soberanía cultural.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el método vivo y autodirigido es isomórfico a soberanía por contribución real.

### Ley III — Lucidez, nunca engañar
- Culture Hack: transparencia en frames, palabras, medios; Window of Discourse visible; evaluación e iteración.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** hacer visible la Window of Discourse y el proceso de reframe es una forma de lucidez narrativa.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Culture Hack: Narrative Communities, escucha comunitaria, intervención colectiva.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** las Narrative Communities son isomórficas a comunidades de contribución en CaaS.

---

## 4. Tabla de mapeo isomórfico (Culture Hack Method → Zeitnus/ALRAC)

| Concepto Culture Hack | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|-----------------------|----------------------|------|----------|--------|
| Justice plus Onto-Shift | `culture-hack-method.ts` | Capa 4 | Ley II | **Pendiente** |
| 7 módulos (Intro + 5 pasos) | `culture-hack-method.ts` | Capa 4 | Ley II | **Pendiente** |
| Point of View statement | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Listening Model | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Narrative Communities | `culture-hack-method.ts` + `registrySystem.ts` | Capa 4 | CaaS | **Pendiente** |
| Big/small listening | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Attention, Network and Power | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Language analysis | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Justice-Ontology axes | `culture-hack-method.ts` | Capa 4 | Ley II | **Pendiente** |
| Window of Discourse | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Narrative Strategy (Audiences, Objectives, reframe) | `culture-hack-method.ts` | Capa 5 | Ley II | **Pendiente** |
| Medio, mensaje, palabras | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Hacking Tree (Media, Meme, Tone, Hack) | `culture-hack-method.ts` | Capa 4 | Ley II | **Pendiente** |
| Logistics, Evaluation & Iteration | `culture-hack-method.ts` | Capa 4 | Ley III | **Pendiente** |
| Living method | `culture-hack-method.ts` + `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| 7 módulos del método (Intro, Ask, Listen, Understand, Recode, Hack) | Plataforma web de culturehack.io |
| Point of View, Listening Model, Narrative Communities | Casos de estudio y documentarios externos |
| ANP (Attention, Network, Power), Language analysis | Herramientas digitales específicas de Culture Hack Labs |
| Justice-Ontology axes, Window of Discourse | — |
| Narrative Strategy, Audiences, Objectives, reframe | — |
| Hacking Tree (Media, Meme, Tone, Hack), logística, evaluación | — |
| Método vivo, adaptable, apropiable | — |
| Límites duros contra narrativas extractivas y manipulación sin justicia | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión Culture Hack | Vaso comunicante |
|----------------|----------------------|------------------|
| `culture-hack-method.ts` | 7 módulos, POV, comunidades, ventana de discurso, estrategia | `registrySystem.ts`, `cds.ts`, `rao.ts` |
| `registrySystem.ts` | Registro de POV, comunidades narrativas, estrategias | 4 registros separados |
| `cds.ts` | Evidencia, reputación, deliberación para comunidades | CDS existente |
| `rao.ts` | Procedencia de narrativas y frames | RAO existente |
| `boundaries.ts` | DENY: manipulación narrativa sin justicia, onto-shift sin consentimiento, narrativas extractivas | Límites duros |
| `currentSeeSystem.ts` | Visibilidad de Window of Discourse y proceso de reframe | Corrientes unificadas |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Justicia plus Onto-Shift como núcleo: justicia + cambio ontológico profundo | "Justice plus Onto-Shift, which emphasizes that demands for justice must be paired with a deeper shift in ontologies" | `culture-hack-method.ts` |
| D2 | 7 módulos: Introducción + Ask + Listen + Understand + Recode + Hack | Estructura del currículo en la navegación | `culture-hack-method.ts` |
| D3 | Point of View statement: contexto, objetivos, identidad, motivación, resultados deseados, métodos | "craft a Point of View statement... context, goals... identity, motivation, desired outcomes, and methods of change" | `culture-hack-method.ts` |
| D4 | Listening Model: transformar POV en modelo de escucha, identificar Narrative Communities | "Transform your Point of View (POV) into a Listening Model, enabling you to identify Narrative Communities" | `culture-hack-method.ts` |
| D5 | Big/small listening techniques: recopilar y ordenar datos en Narrative Communities | "big and small listening techniques, collect relevant data and sort your data into Narrative Communities" | `culture-hack-method.ts` |
| D6 | ANP (Attention, Network, Power) + Language analysis | "analyse the Attention, Network and Power, as well as the Language" | `culture-hack-method.ts` |
| D7 | Justice-Ontology axes mapping para revelar patrones y posiciones | "Map the Communities using Justice-Ontology axes to reveal key patterns and positions" | `culture-hack-method.ts` |
| D8 | Window of Discourse: ubicación actual y desplazamiento deseado | "identify where the Window of Discourse sits and where we want to shift it" | `culture-hack-method.ts` |
| D9 | Narrative Strategy: Audiences, Objectives, reframe | "develop a Narrative Strategy: choose your Audiences, set your Narrative Objectives, and learn to reframe" | `culture-hack-method.ts` |
| D10 | Medio, mensaje, palabras (verbos, adjetivos, sujetos) | "choosing the right medium... translation of your new frames into words... verbs, adjectives and subjects" | `culture-hack-method.ts` |
| D11 | Hacking Tree: Media, Meme, Tone, Hack; Logistics; Evaluation & Iteration | Estructura de Step 5: Hack | `culture-hack-method.ts` |
| D12 | Living method: adaptable, no rígido, apropiable | "this is a living method and we invite you to make it your own" | `culture-hack-method.ts` + `boundaries.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `culture-hack-method.ts` | 7 módulos registrados; POV con contexto/objetivos/identidad/motivación/resultados/métodos; Listening Model; Narrative Communities identificadas; ANP y Language analizados; Justice-Ontology axes mapeados; Window of Discourse ubicada; Narrative Strategy con audiencias/objetivos/reframe; Hacking Tree con medio/mensaje/palabras | `tests/culture-hack-method.test.ts` |
| `registrySystem.ts` | Registro de POV, comunidades narrativas, estrategias narrativas | `tests/registro-narrativo-culture-hack.test.ts` |
| `boundaries.ts` | DENY: manipulación narrativa sin justicia, onto-shift sin consentimiento, narrativas extractivas | `tests/boundaries-culture-hack.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-culture-hack-method.md` — 7 módulos, POV, comunidades, ANP, lenguaje, Justice-Ontology, Window of Discourse, estrategia, Hacking Tree, límites duros

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/culture-hack-method.ts`: `CultureHackMethod`, `Modulo`, `PuntoDeVista`, `ModeloEscucha`, `ComunidadNarrativa`, `AnalisisANP`, `AnalisisLenguaje`, `EjeJusticiaOntologia`, `WindowDiscurso`, `EstrategiaNarrativa`, `HackingTree`, `Paso`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `culture-hack-method.ts`: `crearMetodo()`, `registrarPaso()`, `crearPuntoDeVista()`, `crearModeloEscucha()`, `identificarComunidadNarrativa()`, `analizarANP()`, `analizarLenguaje()`, `mapearEjesJusticiaOntologia()`, `identificarWindowDiscurso()`, `crearEstrategiaNarrativa()`, `construirHackingTree()`, `evaluarEIterar()`, `esMetodoVivo()`
- `boundaries.ts`: DENY manipulación narrativa sin justicia, onto-shift sin consentimiento, narrativas extractivas
- `cds.ts`: evidencia, reputación, deliberación para comunidades narrativas
- `rao.ts`: procedencia de narrativas y frames
- No crear plataforma web; no copiar casos de estudio externos; no rigidizar el método

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeCultureHackMethodState()`.
- Añadir `cultureHackMethod: CultureHackMethodState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ cultureHackMethod: {...st.cultureHackMethod, ...} }))`.
- Incluir `makeCultureHackMethodState()` en `resetAll()`.
- Incluir `cultureHackMethod: st.cultureHackMethod` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: The Culture Hack Method (7 módulos, Justice+Onto-Shift, POV, comunidades narrativas, Window of Discourse, estrategia, Hacking Tree) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/culture-hack-method_backup.md` (texto completo extraído de culturehack.io)
- `openspec/specs/alrac-tq-cds.md` (CDS: evidencia, reputación, deliberación)
- `openspec/specs/alrac-tq-rao.md` (RAO: procedencia, emisor, permisos, estado, revocación)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/cds.ts` (CDS)
- `src/core/lib/rao.ts` (RAO)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
- URL fuente: https://www.culturehack.io/curriculum/the-culture-hack-method/
