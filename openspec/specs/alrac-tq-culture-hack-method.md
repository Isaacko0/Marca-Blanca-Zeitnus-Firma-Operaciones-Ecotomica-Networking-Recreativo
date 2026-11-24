// openspec/specs/alrac-tq-culture-hack-method.md
// OpenSpec: The Culture Hack Method (Culture Hack Labs)
// Narrative-Led Systems Change: Justice plus Onto-Shift
// 7 módulos: Introducción, Ask, Listen, Understand, Recode, Hack
// POV, Listening Model, Narrative Communities, ANP, Language,
// Justice-Ontology axes, Window of Discourse, Narrative Strategy,
// Hacking Tree (Media, Meme, Tone, Hack), Logistics, Evaluation & Iteration.
// Estado: Propuesta — TypeScript puro, sin plataforma web externa,
// sin casos de estudio copiados, método vivo y adaptable.

# SPEC: alrac-tq-culture-hack-method
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** The Culture Hack Method, Culture Hack Labs (https://www.culturehack.io/curriculum/the-culture-hack-method/)
**Targets:** `src/core/lib/culture-hack-method.ts`, `src/core/state/culture-hack-method.ts`, `src/core/lib/boundaries.ts` (DENY), `src/core/lib/cds.ts`, `src/core/lib/rao.ts`

---

## 1. Principios de diseño

1. **Justice plus Onto-Shift:** las demandas de justicia deben ir acompañadas de un cambio ontológico profundo (formas fundamentales de percibir, relacionarse y participar en el mundo).
2. **Método vivo (living method):** adaptable, no rígido, hecho para ser apropiado por cada usuario.
3. **Autodirigido:** currículo de aprendizaje autodirigido, 7 módulos.
4. **Sin plataforma web externa:** lógica pura en TS, UI propia de HSCSG.
5. **Sin casos de estudio copiados:** referencias sin copiar contenido externo.
6. **Narrativa como infraestructura:** las narrativas dan forma a sistemas y acciones.

---

## 2. Los 7 módulos

| Módulo | Contenido |
|--------|-----------|
| Introducción | Metacrisis y raíces culturales; poder de las narrativas; Justice plus Onto-Shift |
| Step 1: Ask | Point of View (POV): contexto, objetivos, identidad, motivación, resultados deseados, métodos de cambio |
| Step 2: Listen | Listening Model; Narrative Communities; big/small listening; recopilación y clasificación de datos |
| Step 3: Understand | Attention, Network and Power (ANP); Language; Justice-Ontology axes mapping; Window of Discourse |
| Step 4: Recode | Narrative Strategy: Audiences, Narrative Objectives, reframe |
| Step 5: Hack | Medio, mensaje, palabras (verbos, adjetivos, sujetos); Hacking Tree (Media, Meme, Tone, Hack); Logistics; Evaluation & Iteration |

---

## 3. Interfaces técnicas

```typescript
interface PuntoDeVista {
  id: string;
  contexto: string;
  objetivos: string[];
  identidad: string;
  motivacion: string;
  resultadosDeseados: string[];
  metodosCambio: string[];
}

interface ModeloEscucha {
  id: string;
  puntoDeVistaId: string;
  tecnicas: ('big_listening' | 'small_listening')[];
  datosRecopilados: string[];
  comunidadesIdentificadas: string[]; // IDs de Narrative Communities
}

interface ComunidadNarrativa {
  id: string;
  nombre: string;
  espacioNarrativo: string;
  patrones: string[];
  posiciones: string[];
}

interface AnalisisANP {
  id: string;
  comunidadId: string;
  atencion: string;
  red: string;
  poder: string;
  lenguaje: string;
}

interface EjeJusticiaOntologia {
  id: string;
  comunidadId: string;
  ejeJusticia: string;
  ejeOntologia: string;
  patron: string;
  posicion: string;
}

interface WindowDiscurso {
  id: string;
  ubicacionActual: string;
  desplazamientoDeseado: string;
  fundamento: string; // building on Justice plus onto-shift
}

interface EstrategiaNarrativa {
  id: string;
  audiencias: string[];
  objetivosNarrativos: string[];
  reencuadre: string; // reframe
}

interface HackingTree {
  id: string;
  medio: string;      // Hacking Tree: The Media
  meme: string;       // Hacking Tree: The Meme
  tono: string;       // Hacking Tree: The Tone
  hack: string;       // Hacking Tree: The Hack!
  logistica: string;  // Logistics of your Hack
  evaluacion: string; // Evaluation & Iteration
}

interface PasoMetodo {
  numero: number;     // 1-5 (Ask, Listen, Understand, Recode, Hack)
  nombre: string;
  completado: boolean;
  evidenciaId?: string;
}
```

---

## 4. Funciones

### 4.1 `crearMetodo(): CultureHackMethod`

Inicializa el método con los 7 módulos (Introducción + 5 pasos) como no completados.

### 4.2 `registrarPaso(numero, nombre): PasoMetodo`

Registra un paso del método (1-5).

### 4.3 `crearPuntoDeVista(contexto, objetivos, identidad, motivacion, resultadosDeseados, metodosCambio): PuntoDeVista`

Crea un POV statement con todos sus componentes.

### 4.4 `crearModeloEscucha(puntoDeVistaId, tecnicas, datosRecopilados): ModeloEscucha`

Transforma un POV en un modelo de escucha.

### 4.5 `identificarComunidadNarrativa(nombre, espacioNarrativo, patrones, posiciones): ComunidadNarrativa`

Identifica una comunidad en el espacio narrativo.

### 4.6 `analizarANP(comunidadId, atencion, red, poder, lenguaje): AnalisisANP`

Analiza Attention, Network, Power y Language de una comunidad.

### 4.7 `mapearEjesJusticiaOntologia(comunidadId, ejeJusticia, ejeOntologia, patron, posicion): EjeJusticiaOntologia`

Mapea una comunidad usando ejes de Justicia y Ontología.

### 4.8 `identificarWindowDiscurso(ubicacionActual, desplazamientoDeseado, fundamento): WindowDiscurso`

Identifica dónde está la Window of Discourse y hacia dónde se quiere desplazar.

### 4.9 `crearEstrategiaNarrativa(audiencias, objetivosNarrativos, reencuadre): EstrategiaNarrativa`

Desarrolla la estrategia narrativa.

### 4.10 `construirHackingTree(medio, meme, tono, hack, logistica, evaluacion): HackingTree`

Construye el árbol de intervención.

### 4.11 `evaluarEIterar(pasoId, evaluacion, iteracion): void`

Proceso de evaluación e iteración del método vivo.

### 4.12 `esMetodoVivo(): boolean`

Retorna true: el método es vivo y adaptable.

---

## 5. Integración con specs ALRAC existentes

| Spec ALRAC | Punto de integración |
|------------|---------------------|
| `alrac-tq-cds` | Evidencia, reputación, deliberación para comunidades narrativas |
| `alrac-tq-rao` | Procedencia de narrativas y frames |
| `boundaries.ts` | DENY: manipulación narrativa sin justicia, onto-shift sin consentimiento, narrativas extractivas |
| `registrySystem.ts` | Registro de POV, comunidades narrativas, estrategias |
| `currentSeeSystem.ts` | Visibilidad de Window of Discourse y proceso de reframe |
| `tq-types-extended.ts` | Tipos core ALRAC |

---

## 6. Límites duros (boundaries.ts)

- DENY: manipulación narrativa sin acompañamiento de justicia.
- DENY: onto-shift (cambio ontológico) sin consentimiento de las comunidades afectadas.
- DENY: narrativas extractivas que dañen la base material.
- DENY: rigidez del método (debe permanecer vivo y adaptable).

---

## 7. Criterios de aceptación

- [ ] `crearMetodo()` inicializa 7 módulos (Intro + 5 pasos)
- [ ] `crearPuntoDeVista()` crea POV con contexto, objetivos, identidad, motivación, resultados, métodos
- [ ] `crearModeloEscucha()` transforma POV en modelo de escucha
- [ ] `identificarComunidadNarrativa()` registra comunidad en espacio narrativo
- [ ] `analizarANP()` analiza atencion, red, poder, lenguaje
- [ ] `mapearEjesJusticiaOntologia()` mapea con ejes justicia/ontología
- [ ] `identificarWindowDiscurso()` registra ubicación y desplazamiento deseado
- [ ] `crearEstrategiaNarrativa()` crea estrategia con audiencias, objetivos, reframe
- [ ] `construirHackingTree()` construye árbol con medio, meme, tono, hack, logística, evaluación
- [ ] `evaluarEIterar()` permite evaluación e iteración
- [ ] `esMetodoVivo()` retorna true
- [ ] `boundaries.ts` DENY manipulación sin justicia, onto-shift sin consentimiento, narrativas extractivas
- [ ] 0 errores TypeScript nuevos

---

## 8. Vectores de prueba

```typescript
// crearPuntoDeVista
Input: { contexto: "crisis climática", objetivos: ["cambiar narrativa de la naturaleza"], identidad: "colectivo X", motivacion: "justicia ecológica", resultadosDeseados: ["cambio de política"], metodosCambio: ["educación", "arte"] }
Expected: POV creado con todos los campos
```

```typescript
// identificarWindowDiscurso
Input: { ubicacionActual: "naturaleza como recurso", desplazamientoDeseado: "naturaleza como pariente", fundamento: "Justice plus Onto-Shift" }
Expected: Window of Discurso creada
```

```typescript
// boundaries DENY
Input: manipulacionNarrativaSinJusticia = true → Expected: error "Manipulación narrativa sin justicia prohibida"
Input: ontoShiftSinConsentimiento = true → Expected: error "Onto-shift sin consentimiento prohibido"
Input: narrativaExtractiva = true → Expected: error "Narrativa extractiva prohibida"
```

---

## 9. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `cds` | 1.0.0 | Evidencia, reputación, deliberación |
| `rao` | 1.0.0 | Procedencia de narrativas y frames |
| `registrySystem` | 1.0.0 | Registro de POV, comunidades, estrategias |
| `boundaries` | 1.0.0 | Límites duros |
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `currentSeeSystem` | 1.0.0 | Corrientes unificadas |

---

## 10. Referencias

- `docs/culture-hack-method_backup.md` — Texto completo extraído de culturehack.io
- `openspec/specs/alrac-tq-cds.md` — CDS: evidencia, reputación, deliberación
- `openspec/specs/alrac-tq-rao.md` — RAO: procedencia, emisor, permisos, estado, revocación
- `docs/TQ_POSTLABOR_PROPOSAL.md` — TQ Stock/Flow Dual-Layer
- `docs/ECOSYSTEM_REVENUE_SHARING.md` — 4 círculos, CoRe
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/cds.ts` — CDS
- `src/core/lib/rao.ts` — RAO
- `src/core/lib/currentSeeSystem.ts` — Corrientes unificadas
- URL fuente: https://www.culturehack.io/curriculum/the-culture-hack-method/

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-24 | Propuesta inicial: The Culture Hack Method (7 módulos, Justice+Onto-Shift, POV, comunidades narrativas, Window of Discourse, estrategia, Hacking Tree) + docs/spec y TS puro |
