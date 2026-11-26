# Integración Repositorio trina-app/trina-ax — ALRAC/Zeitnus

**Fuente asimilada:** `docs/trina-ax_backup.md` — Metadatos del repositorio GitHub https://github.com/trina-app/trina-ax (self-hosted Claude Code/Codex para equipos, AGPL-3.0-only, activo, 11,343 commits, 492 stars).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`

**Estado:** Propuesta de arquitectura. **Limitación importante:** esta asimilación se basa únicamente en metadatos del repositorio GitHub (README, estructura de carpetas, stats). No se ha accedido al código fuente interno (.ts, .tsx, .go, etc.). Toda la lógica TypeScript creada es reimplementación pura basada en hipótesis estructurales, no copia de código del repositorio original. Licencia AGPL-3.0-only (copyleft fuerte — no se copia código).

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Auto-hospedaje de Claude Code y Codex para equipos de empresa:** una sola instalación da acceso a toda la empresa a asistentes de código de IA.
- **Habilidades de equipo (team skills):** habilidades compartidas entre miembros del equipo (ej. ui-polish con matriz antes/después).
- **MCP (Model Context Protocol):** conexión de herramientas y datos externos a las sesiones de IA.
- **Sesiones de IA compartidas (shared AI sessions):** múltiples personas en la misma sesión de IA.
- **Permisos por carpeta de persona (per-person folder permissions):** control de acceso granular por usuario y carpeta.
- **Gestión de documentos (document-management):** gestión de archivos dentro del entorno de IA.
- **Soporte HWP:** formato de documento coreano.
- **Despliegue autónomo:** Docker, CloudFormation, SES inbound mailbox.
- **Idiomas múltiples:** al menos 6 idiomas (ko, en, ja y otros).

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable para sesiones de IA, ZNU como moneda anfibia, gobernanza holónica 1a1v, límites duros en `boundaries.ts`, y modo anfibio (postmonetario/con-moneda) con aprobación de asamblea.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto de trina-ax | Módulo Zeitnus/ALRAC destino | Observación |
|----------------------|------------------------------|-------------|
| Self-hosted Claude Code/Codex para equipos | `trina-ax.ts` | Auto-hospedaje de IA empresarial |
| Habilidades de equipo (team skills) | `trina-ax.ts` + `registrySystem.ts` | Registro de skills compartidas |
| MCP (Model Context Protocol) | `trina-ax.ts` | Conexión de herramientas externas |
| Sesiones de IA compartidas | `trina-ax.ts` + `caas.ts` | Acceso por contribución a sesiones |
| Permisos por carpeta de persona | `trina-ax.ts` + `boundaries.ts` | Control de acceso granular |
| Gestión de documentos | `trina-ax.ts` | Gestión de archivos en entorno IA |
| Soporte HWP | `trina-ax.ts` | Formato de documento coreano |
| Despliegue Docker/CloudFormation/SES | `trina-ax.ts` | Infraestructura de despliegue autónomo |
| 6 idiomas | `trina-ax.ts` | Internacionalización |
| Licencia AGPL-3.0-only (copyleft fuerte) | `boundaries.ts` | DENY: copia de código AGPL-3.0 |
| Protocolo cloud MIT (permisiva) | `boundaries.ts` | Compatible con ALRAC/Zeitnus |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Código fuente TypeScript/Go de trina-ax | AGPL-3.0-only (copyleft fuerte) | Lógica pura en TS, UI propia de HSCSG |
| Protocolo cloud específico de trina-ax | Infra de plataforma ajena | Interfaz de protocolo propia |
| Sesiones MCP específicas | Infra de terceros | Interfaz de sesión propia |
| Sistema de permisos por carpeta específico | Infra de almacenamiento ajena | Interfaz de permisos genérica |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de trina-ax |
|--------|---------------------|
| `src/core/lib/trina-ax.ts` | (NUEVO) Self-hosted IA para equipos, skills, MCP, sesiones compartidas, permisos |
| `src/core/state/trina-ax.ts` | (NUEVO) Estado del sistema de IA empresarial, skills, sesiones, permisos |
| `src/core/lib/registrySystem.ts` | Registro de skills de equipo, MCP servers, sesiones |
| `src/core/lib/tq.ts` | Unidad contable para sesiones de IA (costo por token/sesión) |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico de sesiones IA |
| `src/core/lib/caas.ts` | Acceso por contribución a sesiones de IA compartidas |
| `src/core/lib/boundaries.ts` | DENY: copia de código AGPL-3.0, acceso sin permisos de carpeta |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- trina-ax: permisos por carpeta de persona, control de acceso granular, no engañar al usuario sobre capacidades de IA.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el control de acceso granular es isomórfico a no dañar la base material de cada persona.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- trina-ax: auto-hospedaje de IA, la empresa posee su propio sistema de IA, no depende de proveedores externos.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el auto-hospedaje soberano es isomórfico a autonomía comunitaria sin dependencia externa.

### Ley III — Lucidez, nunca engañar
- trina-ax: skills con matriz antes/después, transparencia de capacidades, permisos explícitos por carpeta.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** la matriz antes/después y los permisos explícitos son formas de lucidez y trazabilidad.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- trina-ax: skills de equipo como servicio compartido, sesiones de IA como servicio, MCP como servicio de conexión.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** las skills y sesiones de equipo como servicios son isomórficas a comunidad como servicio.

---

## 4. Tabla de mapeo isomórfico (trina-ax → Zeitnus/ALRAC)

| Concepto trina-ax | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|-------------------|----------------------|------|----------|--------|
| Self-hosted Claude Code/Codex para equipos | `trina-ax.ts` | Capa 4 | CaaS | **Pendiente** |
| Habilidades de equipo (team skills) | `trina-ax.ts` + `registrySystem.ts` | Capa 4 | Ley II | **Pendiente** |
| MCP (Model Context Protocol) | `trina-ax.ts` | Capa 4 | Ley III | **Pendiente** |
| Sesiones de IA compartidas | `trina-ax.ts` + `caas.ts` | Capa 4 | Ley II | **Pendiente** |
| Permisos por carpeta de persona | `trina-ax.ts` + `boundaries.ts` | Capa 0 | Ley I | **Pendiente** |
| Gestión de documentos | `trina-ax.ts` | Capa 4 | Ley III | **Pendiente** |
| Despliegue Docker/CloudFormation/SES | `trina-ax.ts` | Capa 4 | Ley III | **Pendiente** |
| 6 idiomas (i18n) | `trina-ax.ts` | Capa 4 | Ley III | **Pendiente** |
| AGPL-3.0-only (copyleft fuerte) | `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |
| Protocolo cloud MIT (permisiva) | `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Auto-hospedaje de IA para equipos | Código fuente TypeScript/Go de trina-ax (AGPL-3.0) |
| Habilidades de equipo compartidas | Protocolo cloud específico de trina-ax |
| Sesiones de IA compartidas | Sistema de sesiones MCP específico |
| Permisos por carpeta de persona | Sistema de permisos por carpeta específico |
| Gestión de documentos en entorno IA | Código bajo licencia AGPL-3.0-only |
| Despliegue autónomo Docker/CloudFormation | Licencia AGPL-3.0 como contrato vinculante |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión trina-ax | Vaso comunicante |
|----------------|-------------------|------------------|
| `trina-ax.ts` | Self-hosted IA para equipos, skills, MCP | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de skills de equipo, MCP servers, sesiones | 4 registros separados |
| `tq.ts` | Unidad contable para sesiones de IA | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico de sesiones IA | ZNU índice canasta |
| `caas.ts` | Acceso por contribución a sesiones compartidas | Comunidad como Servicio |
| `boundaries.ts` | DENY: copia de código AGPL-3.0, acceso sin permisos | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del README) | Módulo afectado |
|----|----------|--------------------------------|-----------------|
| D1 | Auto-hospedaje de Claude Code/Codex para equipos de empresa | "Self-hosted Claude Code and Codex with your company files" | `trina-ax.ts` + `caas.ts` |
| D2 | Habilidades de equipo compartidas | "team skills" | `trina-ax.ts` + `registrySystem.ts` |
| D3 | MCP para conectar herramientas externas | "MCP" | `trina-ax.ts` |
| D4 | Sesiones de IA compartidas | "shared AI sessions" | `trina-ax.ts` + `caas.ts` |
| D5 | Permisos por carpeta de persona | "per-person folder permissions" | `trina-ax.ts` + `boundaries.ts` |
| D6 | Gestión de documentos y soporte HWP | "document-management", "hwp" | `trina-ax.ts` |
| D7 | Despliegue autónomo Docker/CloudFormation/SES | Carpetas docker, mailbox-ses | `trina-ax.ts` |
| D8 | 6 idiomas soportados | Topics y commits de internacionalización | `trina-ax.ts` |
| D9 | Licencia AGPL-3.0-only (copyleft fuerte) | "AGPL-3.0-only" | `boundaries.ts` DENY |
| D10 | Protocolo cloud MIT (permisiva) | "The cloud protocol is MIT" | `boundaries.ts` |
| D11 | No copiar código fuente del repositorio original | Regla de la skill: respetar derechos de autor AGPL-3.0 | `boundaries.ts` DENY |
| D12 | Reimplementar lógica pura en TS basada en estructura | Metodología de asimilación HSCSG | `trina-ax.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `trina-ax.ts` | Sistema de IA para equipos con skills registradas, sesiones MCP, permisos por carpeta, despliegue autónomo | `tests/trina-ax.test.ts` |
| `boundaries.ts` | DENY: copia de código AGPL-3.0, acceso sin permisos de carpeta | `tests/boundaries-trina-ax.test.ts` |
| `registrySystem.ts` | Registro de skills de equipo, MCP servers, sesiones | `tests/registro-skills-trina-ax.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-trina-ax.md` — self-hosted IA para equipos, skills, MCP, sesiones compartidas, permisos, despliegue autónomo, límites AGPL-3.0

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/trina-ax.ts`: `SkillEquipo`, `ServidorMCP`, `SesionIA`, `PermisoCarpeta`, `Documento`, `Despliegue`, `SesionCompartida`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `trina-ax.ts`: `crearSistemaIAEquipo()`, `registrarSkillEquipo()`, `registrarServidorMCP()`, `crearSesionIA()`, `compartirSesion()`, `establecerPermisoCarpeta()`, `gestionarDocumento()`, `desplegarDocker()`, `activarI18n()`
- `boundaries.ts`: DENY copia de código AGPL-3.0, acceso sin permisos de carpeta
- `caas.ts`: Acceso por contribución a sesiones de IA compartidas
- No usar código AGPL-3.0 original; no asumir schemas de MCP específicos

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeTrinaAxState()`.
- Añadir `trinaAx: TrinaAxState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ trinaAx: {...st.trinaAx, ...} }))`.
- Incluir `makeTrinaAxState()` en `resetAll()`.
- Incluir `trinaAx: st.trinaAx` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: repositorio trina-ax (self-hosted IA para equipos, skills de equipo, MCP, sesiones compartidas, permisos por carpeta, límites AGPL-3.0) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/trina-ax_backup.md` (metadatos del repositorio GitHub)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- URL fuente: https://github.com/trina-app/trina-ax
- Sitio asociado: https://ax.trina.app/
- Licencia AGPL-3.0-only: https://github.com/trina-app/trina-ax/blob/main/LICENSE
- Protocolo cloud MIT: https://github.com/trina-app/trina-ax/blob/main/shared/src/cloud-protocol/LICENSE
