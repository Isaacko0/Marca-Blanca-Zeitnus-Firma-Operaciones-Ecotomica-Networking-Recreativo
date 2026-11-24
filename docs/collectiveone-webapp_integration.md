# Integración Repositorio CollectiveOneWebapp — ALRAC/Zeitnus

**Fuente asimilada:** `docs/collectiveone-webapp_backup.md` — Metadatos del repositorio GitHub https://github.com/CollectiveOne/CollectiveOneWebapp (aplicación web colectiva, 2018-2019, Java/Spring Boot + Vue, abandonado desde 2019).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). **Limitación importante:** esta asimilación se basa únicamente en metadatos del repositorio GitHub (estructura de carpetas, lenguajes, stats, contributors). No se ha accedido al código fuente interno (.java, .vue, migraciones SQL, etc.). Toda la lógica TypeScript creada es reimplementación pura basada en hipótesis estructurales, no copia de código del repositorio original. Se respeta la licencia LICENSE.md (contenido no leído).

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Asimilar la estructura arquitectónica** de una aplicación web colectiva (backend + frontend + migraciones de base de datos + testing) como referencia para ALRAC/Zeitnus.
- **Mapear las capas** (backend Java/Spring Boot, frontend Vue, db-migrations, testing) a la arquitectura de 5 capas + Capa 0 de ALRAC/Zeitnus.
- **Extraer patrones de organización** de un proyecto colectivo con 3 contributors, 1,420 commits y 35 branches (gobernanza ligera, historia larga).
- **Respetar la licencia LICENSE.md** del proyecto original (no copiar código, solo lógica pura reimplementada).
- **Conectar con conceptos ALRAC existentes:** TQ (unidad contable), ZNU (moneda anfibia), gobernanza holónica 1a1v, CaaS (comunidad como servicio), límites duros en `boundaries.ts`.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto del repo CollectiveOne | Módulo Zeitnus/ALRAC destino | Observación |
|---------------------------------|------------------------------|-------------|
| backend/ (Java, Spring Boot 2.0, TSQL) | `collectiveone-webapp.ts` + `tq.ts` | Lógica de servidor, unidad contable, persistencia |
| frontend/ (Vue 42.9%, JavaScript 9%) | `collectiveone-webapp.ts` + `caas.ts` | Interfaz de usuario, acceso por contribución |
| db-migrations/ | `collectiveone-webapp.ts` + `registrySystem.ts` | Migraciones de esquema, registro de cambios |
| testing/frontend/ | `collectiveone-webapp.ts` | Pruebas unitarias/integración |
| 1,420 commits, 35 branches, 3 contributors | `collectiveone-webapp.ts` | Historia de gobernanza ligera, contribución distribuida |
| LICENSE.md (contenido no leído) | `boundaries.ts` | DENY: uso incompatibles con la licencia original |
| compileAndCopyDev.sh, pom.xml | `collectiveone-webapp.ts` | Scripts de build, dependencias Maven |
| design/emails/ | `collectiveone-webapp.ts` | Notificaciones, comunicaciones |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Código fuente Java/Spring Boot | Licencia desconocida (LICENSE.md no leída); infra de terceros | Lógica pura en TS, no copia de clases .java |
| Componentes Vue | Infra de frontend ajena | Lógica de dominio en TS, UI propia de HSCSG |
| Migraciones SQL TSQL | Infra de base de datos ajena | Lógica de registro de cambios en TS |
| Sitio web www.collectiveone.org | Infra externa no verificada | Referencia sin acceso al contenido |
| Licencia LICENSE.md (desconocida) | Riesgo de incompatibilidad | `boundaries.ts` DENY si hay conflicto |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de CollectiveOneWebapp |
|--------|------------------------------|
| `src/core/lib/collectiveone-webapp.ts` | (NUEVO) Estructura de app web colectiva: backend, frontend, migraciones, testing, gobernanza ligera |
| `src/core/state/collectiveone-webapp.ts` | (NUEVO) Estado de la aplicación, commits, branches, contributors, carpetas |
| `src/core/lib/tq.ts` | Unidad contable (1 kWh) para persistencia y contabilidad |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico |
| `src/core/lib/caas.ts` | Acceso por contribución, no por pago |
| `src/core/lib/registrySystem.ts` | Registro de cambios, migraciones, historial |
| `src/core/lib/boundaries.ts` | DENY: incompatibilidad de licencia, copia de código fuente |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- CollectiveOne: proyecto de 2018-2019, abandonado desde 2019; código que ya no se mantiene puede representar deuda técnica y riesgos de seguridad.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** no reutilizar código abandonado sin revisión de seguridad es una forma de no dañar la base material.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- CollectiveOne: 3 contributors, gobernanza ligera, proyecto comunitario sin mantenimiento activo.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** un proyecto comunitario con pocos mantenedores es isomórfico a soberanía por contribución real, no por corporación.

### Ley III — Lucidez, nunca engañar
- CollectiveOne: 1,420 commits, 35 branches, historial transparente en GitHub.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** el historial público de commits es una forma de lucidez y trazabilidad.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- CollectiveOne: aplicación web colectiva construida por contribución de 3 personas, sin modelo de monetización evidente.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso a la aplicación es por contribución de la comunidad, no por pago.

---

## 4. Tabla de mapeo isomórfico (CollectiveOneWebapp → Zeitnus/ALRAC)

| Concepto CollectiveOne | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|------------------------|----------------------|------|----------|--------|
| backend/ (Java/Spring Boot 2.0) | `collectiveone-webapp.ts` | Capa 4 | Ley II | **Pendiente** |
| frontend/ (Vue) | `collectiveone-webapp.ts` | Capa 4 | Ley II | **Pendiente** |
| db-migrations/ | `collectiveone-webapp.ts` + `registrySystem.ts` | Capa 4 | Ley III | **Pendiente** |
| testing/frontend/ | `collectiveone-webapp.ts` | Capa 4 | Ley III | **Pendiente** |
| 1,420 commits / 35 branches / 3 contributors | `collectiveone-webapp.ts` | Capa 4 | Ley II | **Pendiente** |
| LICENSE.md | `boundaries.ts` DENY | Capa 0 | Ley I | **Pendiente** |
| pom.xml / compileAndCopyDev.sh | `collectiveone-webapp.ts` | Capa 4 | Ley III | **Pendiente** |
| No copia de código fuente | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Estructura de capas: backend, frontend, db-migrations, testing | Código fuente Java/Spring Boot |
| Patrones de gobernanza ligera (3 contributors, 1,420 commits) | Componentes Vue |
| Registro de cambios y migraciones de esquema | Migraciones SQL TSQL |
| Scripts de build (pom.xml, compileAndCopyDev.sh) | Sitio web www.collectiveone.org |
| Historia transparente de commits y branches | Licencia LICENSE.md como contrato vinculante |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión CollectiveOne | Vaso comunicante |
|----------------|------------------------|------------------|
| `collectiveone-webapp.ts` | Estructura de app web colectiva | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de cambios, migraciones, historial | 4 registros separados |
| `tq.ts` | Unidad contable para persistencia y contabilidad | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico | ZNU índice canasta |
| `caas.ts` | Acceso por contribución, no por pago | Comunidad como Servicio |
| `boundaries.ts` | DENY incompatibilidad de licencia, copia de código | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D10

| ID | Decisión | Evidencia primaria (del repositorio) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Estructura de 4 capas: backend, frontend, db-migrations, testing | Carpetas del repositorio | `collectiveone-webapp.ts` |
| D2 | Backend Java/Spring Boot 2.0 con TSQL | Lenguajes: Java 44.6%, TSQL 2.1%; pom.xml (Spring Boot 2.0) | `collectiveone-webapp.ts` + `tq.ts` |
| D3 | Frontend Vue + JavaScript | Lenguajes: Vue 42.9%, JavaScript 9% | `collectiveone-webapp.ts` + `caas.ts` |
| D4 | Gobernanza ligera: 3 contributors, 1,420 commits, 35 branches | Stats del repositorio GitHub | `collectiveone-webapp.ts` |
| D5 | Proyecto abandonado desde 2019 (último commit 14/06/2019) | Último commit: "fixed bug in case member is null" | `boundaries.ts` DENY (código sin mantenimiento) |
| D6 | Licencia LICENSE.md presente pero contenido no leído | Archivo LICENSE.md en raíz | `boundaries.ts` DENY (verificar antes de usar) |
| D7 | No copiar código fuente del repositorio original | Regla de la skill: respetar derechos de autor | `boundaries.ts` DENY |
| D8 | Reimplementar lógica pura en TS basada en estructura | Metodología de asimilación HSCSG | `collectiveone-webapp.ts` |
| D9 | Conectar con TQ, ZNU, CaaS existentes | Arquitectura ALRAC/Zeitnus | `tq.ts`, `znu.ts`, `caas.ts` |
| D10 | Historial público como trazabilidad | 1,420 commits públicos en GitHub | `registrySystem.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `collectiveone-webapp.ts` | 4 capas registradas; backend Java/Spring Boot; frontend Vue; db-migrations; testing; 3 contributors; 1,420 commits; 35 branches | `tests/collectiveone-webapp.test.ts` |
| `boundaries.ts` | DENY: copia de código fuente, incompatibilidad de licencia, uso de código abandonado sin revisión | `tests/boundaries-collectiveone.test.ts` |
| `registrySystem.ts` | Registro de commits, branches, contributors | `tests/registro-collectiveone.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-collectiveone-webapp.md` — estructura de capas, gobernanza ligera, migraciones, testing, límites de licencia

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/collectiveone-webapp.ts`: `CapaApp`, `Commit`, `Branch`, `Contributor`, `LicenciaInfo`, `EstadoAppWeb`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `collectiveone-webapp.ts`: `registrarCapa()`, `registrarCommit()`, `registrarBranch()`, `registrarContributor()`, `validarLicencia()`, `esCodigoAbandonado()`, `respuestaALRAC()`
- `boundaries.ts`: DENY copia de código fuente, incompatibilidad de licencia, uso de código abandonado sin revisión de seguridad
- No usar código Java/Vue/TSQL; no asumir funcionalidades específicas; no acceder a www.collectiveone.org

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeCollectiveoneWebappState()`.
- Añadir `collectiveoneWebapp: CollectiveoneWebappState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ collectiveoneWebapp: {...st.collectiveoneWebapp, ...} }))`.
- Incluir `makeCollectiveoneWebappState()` en `resetAll()`.
- Incluir `collectiveoneWebapp: st.collectiveoneWebapp` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: repositorio CollectiveOneWebapp (estructura de capas, gobernanza ligera, migraciones, límites de licencia) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/collectiveone-webapp_backup.md` (metadatos del repositorio GitHub)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- URL fuente: https://github.com/CollectiveOne/CollectiveOneWebapp
- Sitio asociado: http://www.collectiveone.org/ (no verificado)
