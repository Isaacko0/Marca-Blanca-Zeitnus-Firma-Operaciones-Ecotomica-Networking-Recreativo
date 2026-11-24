# Integración Repositorio open-app-graphql-server — ALRAC/Zeitnus

**Fuente asimilada:** `docs/open-app-graphql-server_backup.md` — Metadatos del repositorio GitHub https://github.com/open-app/open-app-graphql-server (servidor GraphQL con plugins para protocolos distribuidos ssb/dat, 2018-2019, JavaScript 100%, abandonado desde 2019).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). **Limitación importante:** esta asimilación se basa únicamente en metadatos del repositorio GitHub (README, estructura de carpetas, stats). No se ha accedido al código fuente interno (.js en src/, example/). Toda la lógica TypeScript creada es reimplementación pura basada en hipótesis estructurales, no copia de código del repositorio original. Se respeta la licencia del proyecto original (no verificada en esta asimilación).

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Asimilar la arquitectura de un servidor GraphQL con plugin system** como referencia para ALRAC/Zeitnus.
- **Mapear el patrón de plugins** (server([ssb, dat, economic])) a la arquitectura de extensibilidad de ALRAC/Zeitnus.
- **Extraer conceptos de protocolos distribuidos** (ssb/Secure Scuttlebutt, dat/Dat Project) como fuentes de datos descentralizadas.
- **Conectar con conceptos ALRAC existentes:** TQ (unidad contable para queries/operaciones), ZNU (moneda anfibia), gobernanza holónica 1a1v, CaaS (comunidad como servicio), límites duros en `boundaries.ts`.
- **Respetar la licencia** del proyecto original (no verificada; precaución por defecto).

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto de open-app-graphql-server | Módulo Zeitnus/ALRAC destino | Observación |
|-------------------------------------|------------------------------|-------------|
| Servidor GraphQL con plugin system | `open-app-graphql-server.ts` + `tq.ts` | Capa de consulta, unidad contable para operaciones |
| Plugins: ssb, dat, economic | `open-app-graphql-server.ts` | Fuentes de datos distribuidas como plugins intercambiables |
| server([ssb, dat, economic]) | `open-app-graphql-server.ts` | Composición de plugins, registro de capacidades |
| Blobs servidos desde localhost:7777/ (ssb-serve-blobs) | `open-app-graphql-server.ts` + `registrySystem.ts` | Almacenamiento de blobs, registro de recursos |
| economic-sentences-graphql como plugin de ejemplo | `open-app-graphql-server.ts` | Plugin económico, frases económicas como datos GraphQL |
| Planes: schema para fs, plugins con GraphQL + ssb + flumedb | `open-app-graphql-server.ts` | Extensibilidad hacia sistemas de archivos y bases de datos distribuidas |
| 67 commits, 22 branches, 1 contributor | `open-app-graphql-server.ts` | Gobernanza unipersonal, historia corta |
| Node v8+, JavaScript 100% | `open-app-graphql-server.ts` | Entorno de ejecución, no copia de código |
| README, package.json, index.js | `open-app-graphql-server.ts` | Documentación, dependencias, punto de entrada |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Código fuente JavaScript de src/ y example/ | Licencia no verificada; infra de terceros | Lógica pura en TS, no copia de archivos .js |
| Paquete npm open-app-graphql-server | Infra de distribución ajena | Lógica de dominio reimplementada en TS |
| Servidor SSB/Dat específico | Infra de protocolo externo | Interfaces de plugin para protocolos distribuidos genéricos |
| Sitio web o despliegue en localhost:4000/7777 | Infra de despliegue ajena | Configuración propia de HSCSG/Zeitnus |
| Licencia no verificada | Riesgo de incompatibilidad | `boundaries.ts` DENY si hay conflicto |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de open-app-graphql-server |
|--------|----------------------------------|
| `src/core/lib/open-app-graphql-server.ts` | (NUEVO) Servidor GraphQL con plugin system, protocolos distribuidos, blobs, registro de capacidades |
| `src/core/state/open-app-graphql-server.ts` | (NUEVO) Estado del servidor, plugins registrados, schemas, blobs, commits/branches |
| `src/core/lib/tq.ts` | Unidad contable (1 kWh) para queries y operaciones GraphQL |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico de consultas |
| `src/core/lib/caas.ts` | Acceso por contribución, no por pago |
| `src/core/lib/registrySystem.ts` | Registro de plugins, schemas, blobs, capacidades |
| `src/core/lib/boundaries.ts` | DENY: copia de código fuente, uso de código abandonado sin revisión, licencia no verificada |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- open-app-graphql-server: proyecto de 2018-2019, abandonado desde 2019; código sin mantenimiento puede representar deuda técnica y riesgos de seguridad.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** no reutilizar código abandonado sin revisión de seguridad es una forma de no dañar la base material.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- open-app-graphql-server: 1 contributor, gobernanza unipersonal, proyecto comunitario sin mantenimiento activo.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** un proyecto comunitario con un solo mantenedor es isomórfico a soberanía por contribución real, no por corporación.

### Ley III — Lucidez, nunca engañar
- open-app-graphql-server: 67 commits, 22 branches, historial transparente en GitHub; plugin system explícito (ssb, dat, economic).
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** el plugin system explícito y el historial público de commits son formas de lucidez y trazabilidad.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- open-app-graphql-server: servidor GraphQL construido para un ecosistema de apps abiertas e interoperables, sin modelo de monetización evidente.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso a APIs interoperables es por contribución de la comunidad, no por pago.

---

## 4. Tabla de mapeo isomórfico (open-app-graphql-server → Zeitnus/ALRAC)

| Concepto open-app-graphql-server | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|----------------------------------|----------------------|------|----------|--------|
| Servidor GraphQL con plugin system | `open-app-graphql-server.ts` | Capa 4 | Ley II | **Pendiente** |
| Plugins ssb, dat, economic | `open-app-graphql-server.ts` | Capa 4 | Ley II | **Pendiente** |
| Composición server([plugins]) | `open-app-graphql-server.ts` | Capa 4 | Ley III | **Pendiente** |
| Blobs via ssb-serve-blobs | `open-app-graphql-server.ts` + `registrySystem.ts` | Capa 4 | Ley III | **Pendiente** |
| Plugin económico (economic-sentences) | `open-app-graphql-server.ts` + `tq.ts` | Capa 4 | Ley II | **Pendiente** |
| Planes: schema fs, GraphQL + ssb + flumedb | `open-app-graphql-server.ts` | Capa 4 | Ley II | **Pendiente** |
| 67 commits / 22 branches / 1 contributor | `open-app-graphql-server.ts` | Capa 4 | Ley II | **Pendiente** |
| Licencia no verificada | `boundaries.ts` DENY | Capa 0 | Ley I | **Pendiente** |
| No copia de código fuente | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Arquitectura de servidor GraphQL con plugin system | Código fuente JavaScript de src/ y example/ |
| Patrón de plugins (ssb, dat, economic) como fuentes distribuidas | Paquete npm open-app-graphql-server |
| Composición de plugins server([...]) | Servidor SSB/Dat específico |
| Registro de blobs y capacidades | Despliegue en localhost:4000/7777 |
| Plugin económico como ejemplo de dominio | Licencia como contrato vinculante (no verificada) |
| Extensibilidad hacia fs, flumedb, GraphQL | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión open-app-graphql-server | Vaso comunicante |
|----------------|----------------------------------|------------------|
| `open-app-graphql-server.ts` | Servidor GraphQL con plugin system | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de plugins, schemas, blobs, capacidades | 4 registros separados |
| `tq.ts` | Unidad contable para queries y operaciones GraphQL | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico de consultas | ZNU índice canasta |
| `caas.ts` | Acceso por contribución, no por pago | Comunidad como Servicio |
| `boundaries.ts` | DENY copia de código, código abandonado sin revisión, licencia no verificada | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D10

| ID | Decisión | Evidencia primaria (del repositorio) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Servidor GraphQL con plugin system para protocolos distribuidos | "A simple server that supports GraphQL schemas as plugins" | `open-app-graphql-server.ts` |
| D2 | Plugins ssb, dat, economic como fuentes de datos | "server([ssb, dat, economic])" | `open-app-graphql-server.ts` |
| D3 | Blobs servidos desde localhost:7777/ via ssb-serve-blobs | "Blobs are served from localhost:7777/" | `open-app-graphql-server.ts` + `registrySystem.ts` |
| D4 | Plugin económico economic-sentences-graphql como ejemplo | "Check out economic-sentences-graphql for an example of how to make a plugin" | `open-app-graphql-server.ts` + `tq.ts` |
| D5 | Planes: schema para fs, plugins con GraphQL + ssb + flumedb views | "Plans: Schema to deal with fs; plugins with GraphQL schemas, ssb plugins, flumedb views" | `open-app-graphql-server.ts` |
| D6 | 1 contributor, 67 commits, 22 branches, abandonado desde 2019 | Stats del repositorio GitHub | `open-app-graphql-server.ts` |
| D7 | JavaScript 100%, Node v8+ | Lenguajes: JavaScript 100%; Works with Node v8 or higher | `open-app-graphql-server.ts` |
| D8 | Licencia no verificada | No se leyó LICENSE | `boundaries.ts` DENY |
| D9 | No copiar código fuente del repositorio original | Regla de la skill: respetar derechos de autor | `boundaries.ts` DENY |
| D10 | Reimplementar lógica pura en TS basada en estructura | Metodología de asimilación HSCSG | `open-app-graphql-server.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `open-app-graphql-server.ts` | Servidor GraphQL con plugin system; registro de plugins (ssb, dat, economic); composición server([...]); registro de blobs; plugin económico; planes de extensibilidad | `tests/open-app-graphql-server.test.ts` |
| `boundaries.ts` | DENY: copia de código fuente, código abandonado sin revisión, licencia no verificada | `tests/boundaries-open-app-graphql.test.ts` |
| `registrySystem.ts` | Registro de plugins, schemas, blobs, capacidades | `tests/registro-plugins-graphql.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-open-app-graphql-server.md` — servidor GraphQL, plugin system, protocolos distribuidos, blobs, planes de extensibilidad, límites de licencia

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/open-app-graphql-server.ts`: `ServidorGraphQL`, `Plugin`, `SchemaGraphQL`, `Blob`, `Capacidad`, `EstadoServidor`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `open-app-graphql-server.ts`: `crearServidorGraphQL()`, `registrarPlugin()`, `registrarSchema()`, `registrarBlob()`, `componerPlugins()`, `esPluginEconomico()`, `esProtocoloDistribuido()`, `respuestaALRAC()`
- `boundaries.ts`: DENY copia de código fuente, código abandonado sin revisión, licencia no verificada
- No usar código JavaScript original; no asumir schemas específicos; no acceder a despliegues externos

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeOpenAppGraphQLServerState()`.
- Añadir `openAppGraphQLServer: OpenAppGraphQLServerState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ openAppGraphQLServer: {...st.openAppGraphQLServer, ...} }))`.
- Incluir `makeOpenAppGraphQLServerState()` en `resetAll()`.
- Incluir `openAppGraphQLServer: st.openAppGraphQLServer` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: repositorio open-app-graphql-server (servidor GraphQL, plugin system, protocolos distribuidos, blobs, límites de licencia) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/open-app-graphql-server_backup.md` (metadatos del repositorio GitHub)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- URL fuente: https://github.com/open-app/open-app-graphql-server
- Plugin de ejemplo: https://github.com/open-app/economic-sentences-graphql (no leído)
