# Integración Repositorio FounderOS — ALRAC/Zeitnus

**Fuente asimilada:** `docs/founderos-backup.md` — Metadatos del repositorio GitHub https://github.com/Bennettxai/FounderOS (single-operator business command center, Next.js 14 + SQLite, MIT, activo, 83 commits, 1.5k stars).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). **Limitación importante:** esta asimilación se basa únicamente en metadatos del repositorio GitHub (README, estructura de carpetas, stats). No se ha accedido al código fuente interno (.tsx, .ts, .css, schemas de SQLite, etc.). Toda la lógica TypeScript creada es reimplementación pura basada en hipótesis estructurales, no copia de código del repositorio original. Licencia MIT (permisiva, compatible con ALRAC/Zeitnus).

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un "business command center" para operador único:** una sola persona dirigiendo una empresa como departamentos IA-asistidos (comms, funnel, social, finances, agents, knowledge graph) desde un dashboard en vivo.
- **Departamentos como módulos independientes:** cada área del negocio opera como un departamento con sus propias pantallas, agentes, tareas, runs, crons, skills, workflows.
- **Knowledge graph (G-Brain / Optimal Engine):** base de conocimiento local con notas markdown, búsqueda semántica, motor óptimo de conocimiento.
- **Demo mode y modo real:** instalación lista para demostrar con datos de demo, o instalación en blanco para uso real.
- **Operador único con contraseña de seguridad:** acceso protegido para páginas de app y rutas API.
- **Crons, skills, workflows, deals, campaigns, drift:** automatización de operaciones del negocio.
- **Conectar con conceptos ALRAC existentes:** TQ (unidad contable para operaciones del negocio), ZNU (moneda anfibia), gobernanza holónica 1a1v (un solo operador), CaaS (comunidad como servicio / operador como servicio), límites duros en `boundaries.ts`.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto de FounderOS | Módulo Zeitnus/ALRAC destino | Observación |
|-----------------------|------------------------------|-------------|
| Single-operator business command center | `founderos.ts` + `caas.ts` | Un operador, múltiples departamentos, acceso por contribución |
| Departamentos IA-asistidos (comms, funnel, social, finances, agents, knowledge graph) | `founderos.ts` | Módulos departamentales independientes |
| Dashboard único en vivo | `founderos.ts` + `currentSeeSystem.ts` | Vista unificada de operaciones |
| Knowledge graph (G-Brain / Optimal Engine) | `founderos.ts` + `regenerative-agent.ts` | Base de conocimiento local, búsqueda semántica |
| Demo mode + modo real | `founderos.ts` | Instalación con datos de demo o en blanco |
| Crons, skills, workflows, deals, campaigns, drift | `founderos.ts` + `tq.ts` | Automatización de operaciones, unidad contable para cada acción |
| Operador único con contraseña | `founderos.ts` + `boundaries.ts` | Acceso protegido, un solo operador |
| Next.js 14 + SQLite + GladOS | `founderos.ts` | Stack de referencia, no copia de código |
| MIT license (permisiva) | `boundaries.ts` | Compatible con ALRAC/Zeitnus |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Código fuente Next.js/TypeScript de FounderOS | Infra de terceros, aunque MIT | Lógica pura en TS, UI propia de HSCSG |
| Base de datos SQLite específica | Infra de almacenamiento ajena | Interfaces de almacenamiento genéricas |
| GladOS codebase | Infra de plataforma ajena | Lógica de dominio reimplementada en TS |
| G-Brain CLI / pglite | Infra de conocimiento externa | Interfaz de knowledge graph propia |
| Sitio web founderos.sh | Infra externa no verificada | Referencia sin acceso al contenido |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de FounderOS |
|--------|---------------------|
| `src/core/lib/founderos.ts` | (NUEVO) Business command center, departamentos, dashboard, knowledge graph, crons, skills, workflows |
| `src/core/state/founderos.ts` | (NUEVO) Estado del command center, departamentos, agentes, tareas, runs |
| `src/core/lib/caas.ts` | Acceso por contribución, operador único |
| `src/core/lib/tq.ts` | Unidad contable para operaciones del negocio |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico |
| `src/core/lib/registrySystem.ts` | Registro de departamentos, skills, workflows |
| `src/core/lib/boundaries.ts` | DENY: copia de código fuente, acceso sin contraseña de operador |
| `src/core/lib/regenerative-agent.ts` | Knowledge graph, agentes regenerativos |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- FounderOS: operador único, acceso protegido por contraseña, departamentos que sirven al operador no al revés.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el operador como centro, no como explotación, es isomórfico a no dañar la base material de la persona.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- FounderOS: una persona dirige su empresa como departamentos IA-asistidos, sin depender de corporaciones.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el operador único que gana su vida soberanizando es isomórfico a acceso por contribución real.

### Ley III — Lucidez, nunca engañar
- FounderOS: dashboard en vivo, modo demo vs real transparente, contraseña de operador, modo demo no llega a data/.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** la distinción demo/real y el acceso protegido son formas de lucidez y trazabilidad.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- FounderOS: departamentos como servicios IA-asistidos para el operador, conocimiento graph como servicio, crons/workflows como servicios automáticos.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** los departamentos como servicios para el operador son isomórficos a comunidad como servicio.

---

## 4. Tabla de mapeo isomórfico (FounderOS → Zeitnus/ALRAC)

| Concepto FounderOS | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|--------------------|----------------------|------|----------|--------|
| Single-operator business command center | `founderos.ts` | Capa 4 | CaaS | **Pendiente** |
| Departamentos IA-asistidos (comms, funnel, social, finances, agents, knowledge graph) | `founderos.ts` | Capa 4 | Ley II | **Pendiente** |
| Dashboard único en vivo | `founderos.ts` + `currentSeeSystem.ts` | Capa 4 | Ley III | **Pendiente** |
| Knowledge graph (G-Brain / Optimal Engine) | `founderos.ts` + `regenerative-agent.ts` | Capa 4 | Ley III | **Pendiente** |
| Demo mode + modo real | `founderos.ts` | Capa 4 | Ley III | **Pendiente** |
| Operador único con contraseña | `founderos.ts` + `boundaries.ts` | Capa 0 | Ley I | **Pendiente** |
| Crons, skills, workflows, deals, campaigns, drift | `founderos.ts` + `tq.ts` | Capa 4 | Ley II | **Pendiente** |
| Next.js 14 + SQLite + GladOS (referencia de stack) | `founderos.ts` | Capa 4 | Ley III | **Pendiente** |
| MIT license (permisiva) | `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Business command center para operador único | Código fuente Next.js/TypeScript de FounderOS |
| Departamentos como módulos IA-asistidos | Base de datos SQLite específica |
| Knowledge graph como servicio | GladOS codebase |
| Crons, skills, workflows como automatización | G-Brain CLI / pglite |
| Operador único con acceso protegido | Sitio web founderos.sh |
| MIT license como referencia de compatibilidad | Licencia como contrato vinculante (es permisiva, verificar) |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión FounderOS | Vaso comunicante |
|----------------|-------------------|------------------|
| `founderos.ts` | Business command center, departamentos | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de departamentos, skills, workflows | 4 registros separados |
| `tq.ts` | Unidad contable para operaciones de departamentos | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico del negocio | ZNU índice canasta |
| `caas.ts` | Acceso por contribución, operador único | Comunidad como Servicio |
| `regenerative-agent.ts` | Knowledge graph, agentes IA-asistidos | Agentes regenerativos existentes |
| `boundaries.ts` | DENY: copia de código, acceso sin contraseña | Límites duros |
| `currentSeeSystem.ts` | Dashboard en vivo, trazabilidad de operaciones | Corrientes unificadas |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del README) | Módulo afectado |
|----|----------|--------------------------------|-----------------|
| D1 | Business command center para operador único: una persona dirige empresa como departamentos IA-asistidos | "An open-source, single-operator business command center: run a one-person operated company as AI-assisted departments" | `founderos.ts` + `caas.ts` |
| D2 | Departamentos: comms, funnel, social, finances, agents, knowledge graph | README, sección About | `founderos.ts` |
| D3 | Dashboard único en vivo | "from one live dashboard" | `founderos.ts` + `currentSeeSystem.ts` |
| D4 | Knowledge graph G-Brain / Optimal Engine | "G-Brain is Optimal Engine everywhere it is shown" | `founderos.ts` + `regenerative-agent.ts` |
| D5 | Demo mode + modo real (GLADOS_DEFAULT_MODE=real) | "Filming mode off in Settings, or GLADOS_DEFAULT_MODE=real, gives the blank install" | `founderos.ts` |
| D6 | Operador único con contraseña de operador | "Settings → Security and set an operator password" | `founderos.ts` + `boundaries.ts` |
| D7 | Crons, skills, workflows, deals, campaigns, drift | "agents, tasks, runs, crons, skills, workflows, funnel, social, deals, campaigns, drift" | `founderos.ts` + `tq.ts` |
| D8 | Next.js 14 + SQLite, una base de datos, sobre GladOS | "Next.js 14 and one SQLite database, every GladOS screen" | `founderos.ts` |
| D9 | Licencia MIT (permisiva) | "MIT. See LICENSE" | `boundaries.ts` |
| D10 | Repositorio activo: 83 commits, última actividad 5 días atrás | Stats de GitHub | `founderos.ts` |
| D11 | No copiar código fuente del repositorio original | Regla de la skill: respetar derechos de autor | `boundaries.ts` DENY |
| D12 | Reimplementar lógica pura en TS basada en estructura | Metodología de asimilación HSCSG | `founderos.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `founderos.ts` | Command center con departamentos registrados; knowledge graph; demo/modo real; operador con contraseña; crons/skills/workflows | `tests/founderos.test.ts` |
| `boundaries.ts` | DENY: copia de código fuente, acceso sin contraseña de operador | `tests/boundaries-founderos.test.ts` |
| `registrySystem.ts` | Registro de departamentos, skills, workflows | `tests/registro-departamentos-founderos.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-founderos.md` — business command center, departamentos, dashboard, knowledge graph, crons/skills/workflows, operador único, límites MIT

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/founderos.ts`: `Departamento`, `Agente`, `Tarea`, `Run`, `Cron`, `Skill`, `Workflow`, `Deal`, `Campaign`, `Dashboard`, `KnowledgeGraph`, `Operador`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `founderos.ts`: `crearCommandCenter()`, `registrarDepartamento()`, `crearAgente()`, `registrarTarea()`, `ejecutarRun()`, `registrarCron()`, `registrarSkill()`, `registrarWorkflow()`, `activarModoDemo()`, `activarModoReal()`, `setearContrasenaOperador()`, `esAccesoAutorizado()`
- `boundaries.ts`: DENY copia de código fuente, acceso sin contraseña de operador
- `caas.ts`: Operador único como acceso por contribución
- No usar código Next.js/TypeScript original; no acceder a founderos.sh; no asumir schemas de SQLite

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeFounderosState()`.
- Añadir `founderos: FounderosState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ founderos: {...st.founderos, ...} }))`.
- Incluir `makeFounderosState()` en `resetAll()`.
- Incluir `founderos: st.founderos` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: repositorio FounderOS (business command center, departamentos IA-asistidos, knowledge graph, operador único, límites MIT) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/founderos-backup.md` (metadatos del repositorio GitHub)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- `src/core/lib/regenerative-agent.ts` (agentes regenerativos, knowledge graph)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- URL fuente: https://github.com/Bennettxai/FounderOS
- Sitio asociado: https://founderos.sh/ (no verificado)
- Licencia MIT: https://github.com/Bennettxai/FounderOS/blob/main/LICENSE
