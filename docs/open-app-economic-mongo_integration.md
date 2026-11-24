# Integración Repositorios economic-sentences-graphql y open-app-mongo — ALRAC/Zeitnus

**Fuentes asimiladas:** `docs/open-app-economic-mongo_backup.md` — Metadatos de dos repos de la org open-app:
1. `economic-sentences-graphql`: Plugin GraphQL de ejemplo para open-app-graphql-server (dominio económico, JavaScript 100%, 12 commits, 1 contributor, abandonado 2019).
2. `open-app-mongo`: Conector ssb → MongoDB, licencia AGPL-3.0, JavaScript 100%, 1 commit, 1 contributor, abandonado 2019.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). **Limitación importante:** ambas asimilaciones se basan únicamente en metadatos de GitHub. No se ha accedido al código fuente interno. Toda la lógica TypeScript es reimplementación pura basada en hipótesis estructurales, no copia de código. Se respeta AGPL-3.0 de open-app-mongo: no se copia código, solo lógica pura.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Asimilar el plugin GraphQL económico** (economic-sentences-graphql) como referencia para capas de consulta económica en ALRAC/Zeitnus.
- **Asimilar el conector ssb → MongoDB** (open-app-mongo) como patrón de integración entre protocolos distribuidos (ssb) y bases de datos documentales.
- **Mapear ambos repos** a la arquitectura de 5 capas + Capa 0 de ALRAC/Zeitnus.
- **Conectar con conceptos ALRAC existentes:** TQ (unidad contable para frases económicas y operaciones de base de datos), ZNU (moneda anfibia), gobernanza holónica 1a1v, CaaS (comunidad como servicio), límites duros en `boundaries.ts`.
- **Respetar las licencias:** AGPL-3.0 de open-app-mongo (no copiar código); licencia no verificada de economic-sentences-graphql (precaución por defecto).

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto de los dos repos | Módulo Zeitnus/ALRAC destino | Observación |
|---------------------------|------------------------------|-------------|
| economic-sentences-graphql: plugin GraphQL de dominio económico | `open-app-economic-mongo.ts` + `tq.ts` | Frases económicas como datos GraphQL, TQ como unidad contable |
| open-app-mongo: `connect(sbot, messageType[, opts])(collection)` | `open-app-economic-mongo.ts` + `registrySystem.ts` | Conector protocolo-distribuido → base de datos documental |
| Opciones transform, gte, concurrency | `open-app-economic-mongo.ts` | Transformación de mensajes, filtro por timestamp, inserciones concurrentes |
| Devuelve instancia pull-abortable | `open-app-economic-mongo.ts` | Conexión interrumpible, control de flujo |
| ssb como protocolo de origen (mensajes) | `open-app-economic-mongo.ts` | Fuente distribuida de datos |
| Mongo como destino (colecciones) | `open-app-economic-mongo.ts` | Almacenamiento documental |
| economic-sentences-graphql: 12 commits, 1 branch, 1 contributor | `open-app-economic-mongo.ts` | Gobernanza unipersonal, historia corta |
| open-app-mongo: 1 commit, AGPL-3.0, 1 contributor | `open-app-economic-mongo.ts` + `boundaries.ts` | Licencia AGPL-3.0 verificada, precaución |
| JavaScript 100% en ambos | `open-app-economic-mongo.ts` | Entorno de ejecución, no copia de código |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Código fuente JavaScript de economic-sentences-graphql (schema/, index.js) | Licencia no verificada; infra de terceros | Lógica pura en TS, no copia de archivos .js |
| Código fuente JavaScript de open-app-mongo (src/, index.js) | Licencia AGPL-3.0; no se puede copiar sin cumplir la licencia | Lógica pura en TS, no copia de código AGPL |
| Paquetes npm de ambos repos | Infra de distribución ajena | Lógica de dominio reimplementada en TS |
| Servidor SSB y MongoDB específicos | Infra de despliegue externa | Interfaces de conector para protocolos distribuidos genéricos |
| Licencia AGPL-3.0 como contrato vinculante | Riesgo de incompatibilidad con ALRAC/Zeitnus | `boundaries.ts` DENY si hay conflicto |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de los dos repos |
|--------|-------------------------|
| `src/core/lib/open-app-economic-mongo.ts` | (NUEVO) Plugin GraphQL económico, conector ssb→Mongo, transform, gte, concurrency, pull-abortable |
| `src/core/state/open-app-economic-mongo.ts` | (NUEVO) Estado del plugin, conector, colecciones, mensajes, blobs |
| `src/core/lib/tq.ts` | Unidad contable (1 kWh) para frases económicas y operaciones de DB |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico de consultas |
| `src/core/lib/caas.ts` | Acceso por contribución, no por pago |
| `src/core/lib/registrySystem.ts` | Registro de plugins, schemas, colecciones, conexiones |
| `src/core/lib/boundaries.ts` | DENY: copia de código fuente, código AGPL sin cumplir licencia, licencia no verificada, código abandonado sin revisión |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Ambos repos: proyectos de 2018-2019, abandonados desde entonces; código sin mantenimiento puede representar deuda técnica y riesgos de seguridad.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** no reutilizar código abandonado sin revisión de seguridad es una forma de no dañar la base material.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Ambos repos: 1 contributor cada uno, gobernanza unipersonal, proyectos comunitarios sin mantenimiento activo.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** proyectos comunitarios con un solo mantenedor son isomórficos a soberanía por contribución real, no por corporación.

### Ley III — Lucidez, nunca engañar
- Ambos repos: historial transparente en GitHub (12 commits y 1 commit respectivamente); API documentada en README.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** el API documentado y el historial público son formas de lucidez y trazabilidad.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Ambos repos: construidos para ecosistemas de apps abiertas e interoperables, sin modelo de monetización evidente.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso a APIs interoperables y conectores de datos es por contribución de la comunidad, no por pago.

---

## 4. Tabla de mapeo isomórfico (dos repos → Zeitnus/ALRAC)

| Concepto de los repos | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|-----------------------|----------------------|------|----------|--------|
| economic-sentences-graphql: plugin GraphQL económico | `open-app-economic-mongo.ts` | Capa 4 | Ley II | **Pendiente** |
| open-app-mongo: conector ssb → MongoDB | `open-app-economic-mongo.ts` | Capa 4 | Ley II | **Pendiente** |
| `connect(sbot, messageType[, opts])(collection)` | `open-app-economic-mongo.ts` | Capa 4 | Ley III | **Pendiente** |
| Opciones transform, gte, concurrency | `open-app-economic-mongo.ts` | Capa 4 | Ley III | **Pendiente** |
| Instancia pull-abortable | `open-app-economic-mongo.ts` | Capa 4 | Ley III | **Pendiente** |
| ssb como protocolo de origen | `open-app-economic-mongo.ts` | Capa 4 | Ley II | **Pendiente** |
| Mongo como destino (colecciones) | `open-app-economic-mongo.ts` | Capa 4 | Ley II | **Pendiente** |
| AGPL-3.0 de open-app-mongo | `boundaries.ts` DENY | Capa 0 | Ley I | **Pendiente** |
| Licencia no verificada de economic-sentences-graphql | `boundaries.ts` DENY | Capa 0 | Ley I | **Pendiente** |
| No copia de código fuente | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Plugin GraphQL de dominio económico | Código JavaScript de economic-sentences-graphql |
| Conector protocolo-distribuido → base de datos documental | Código JavaScript AGPL-3.0 de open-app-mongo |
| Patrón `connect(origen, tipo, opciones)(destino)` | Paquetes npm de ambos repos |
| Opciones de transform, filtro por timestamp, concurrency | Servidores SSB y MongoDB específicos |
| Conexión interrumpible (pull-abortable) | Licencia AGPL-3.0 como contrato vinculante |
| Frases económicas como datos GraphQL | Licencia no verificada como contrato vinculante |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión de los dos repos | Vaso comunicante |
|----------------|--------------------------|------------------|
| `open-app-economic-mongo.ts` | Plugin GraphQL económico + conector ssb→Mongo | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de plugins, schemas, colecciones, conexiones | 4 registros separados |
| `tq.ts` | Unidad contable para frases económicas y operaciones de DB | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico de consultas | ZNU índice canasta |
| `caas.ts` | Acceso por contribución, no por pago | Comunidad como Servicio |
| `boundaries.ts` | DENY copia de código, AGPL sin cumplir, licencia no verificada, código abandonado sin revisión | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (de los repos) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | economic-sentences-graphql es plugin GraphQL de ejemplo para open-app-graphql-server, dominio económico | Referenciado en README de open-app-graphql-server como "economic-sentences-graphql" | `open-app-economic-mongo.ts` + `tq.ts` |
| D2 | open-app-mongo conecta mensajes ssb a colecciones Mongo vía `connect(sbot, messageType[, opts])(collection)` | API documentada en README de open-app-mongo | `open-app-economic-mongo.ts` |
| D3 | Opciones: transform (async), gte (timestamp), concurrency (inserciones) | API documentada en README | `open-app-economic-mongo.ts` |
| D4 | Devuelve instancia pull-abortable (interrumpible) | "Returns a pull-abortable instance" | `open-app-economic-mongo.ts` |
| D5 | Ambos repos: JavaScript 100%, 1 contributor (luandro), abandonados (2018-2019) | Stats de GitHub | `open-app-economic-mongo.ts` |
| D6 | open-app-mongo: licencia AGPL-3.0 verificada | Badge y sección License en README | `boundaries.ts` DENY |
| D7 | economic-sentences-graphql: licencia no especificada | No description en About | `boundaries.ts` DENY |
| D8 | No copiar código fuente de ninguno de los dos repos | Regla de la skill: respetar derechos de autor | `boundaries.ts` DENY |
| D9 | Reimplementar lógica pura en TS basada en hipótesis estructurales | Metodología de asimilación HSCSG | `open-app-economic-mongo.ts` |
| D10 | Conectar con TQ, ZNU, CaaS existentes | Arquitectura ALRAC/Zeitnus | `tq.ts`, `znu.ts`, `caas.ts` |
| D11 | Código abandonado desde 2018-2019 requiere revisión de seguridad antes de usar | Últimos commits de 2019 | `boundaries.ts` DENY |
| D12 | ssb y MongoDB como extremos de un conector genérico | `connect(sbot, ...)(collection)` | `open-app-economic-mongo.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `open-app-economic-mongo.ts` | Plugin GraphQL económico registrado; conector ssb→Mongo con opciones transform/gte/concurrency; instancia pull-abortable; registro de colecciones y mensajes | `tests/open-app-economic-mongo.test.ts` |
| `boundaries.ts` | DENY: copia de código fuente, AGPL sin cumplir licencia, licencia no verificada, código abandonado sin revisión | `tests/boundaries-open-app-economic-mongo.test.ts` |
| `registrySystem.ts` | Registro de plugins GraphQL, conexiones ssb→Mongo, colecciones | `tests/registro-conectores-graphql.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-open-app-economic-mongo.md` — plugin GraphQL económico, conector ssb→Mongo, opciones transform/gte/concurrency, pull-abortable, límites de licencia

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/open-app-economic-mongo.ts`: `PluginGraphQL`, `ConectorSSBMongo`, `ColeccionMongo`, `MensajeSSB`, `OpcionesConector`, `EstadoEconomicoMongo`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `open-app-economic-mongo.ts`: `crearPluginGraphQLEconomico()`, `crearConectorSSBMongo()`, `conectarMensajesAColeccion()`, `aplicarTransform()`, `filtrarPorGTE()`, `configurarConcurrency()`, `crearInstanciaPullAbortable()`, `registrarColeccion()`, `respuestaALRAC()`
- `boundaries.ts`: DENY copia de código fuente, AGPL sin cumplir, licencia no verificada, código abandonado sin revisión
- No usar código JavaScript original; no asumir schemas GraphQL específicos; no acceder a servidores SSB/Mongo externos

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeOpenAppEconomicMongoState()`.
- Añadir `openAppEconomicMongo: OpenAppEconomicMongoState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ openAppEconomicMongo: {...st.openAppEconomicMongo, ...} }))`.
- Incluir `makeOpenAppEconomicMongoState()` en `resetAll()`.
- Incluir `openAppEconomicMongo: st.openAppEconomicMongo` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: repositorios open-app economic-sentences-graphql y open-app-mongo (plugin GraphQL económico, conector ssb→Mongo, límites de licencia AGPL-3.0) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/open-app-economic-mongo_backup.md` (metadatos de ambos repos)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- URL fuente 1: https://github.com/open-app/economic-sentences-graphql
- URL fuente 2: https://github.com/open-app/open-app-mongo
- Licencia AGPL-3.0 de open-app-mongo (verificada en página principal)
