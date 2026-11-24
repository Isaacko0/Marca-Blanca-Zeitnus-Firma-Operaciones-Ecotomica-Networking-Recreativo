# RESPALDO DE FUENTE — Repositorios economic-sentences-graphql y open-app-mongo (GitHub)

## 1. economic-sentences-graphql

- **Título:** economic-sentences-graphql
- **Autor/origen:** open-app (organización en GitHub)
- **URL:** https://github.com/open-app/economic-sentences-graphql
- **Tipo:** Plugin GraphQL de ejemplo para open-app-graphql-server (dominio económico)
- **Estado del repositorio:** Último commit hace ~8 años (7 de febrero de 2019, versión 1.0.4); rama master; 12 commits; 1 branch; 0 tags; 4 stars; 4 watchers; 0 forks; 1 contributor
- **Lenguajes:** JavaScript 100%
- **Contributors (1):** luandro
- **Estructura de carpetas:** schema/, archivos raíz: .gitignore, README.md, index.js, package.json
- **Descripción:** No description, website, or topics provided.

## 2. open-app-mongo

- **Título:** open-app-mongo
- **Autor/origen:** open-app (organización en GitHub)
- **URL:** https://github.com/open-app/open-app-mongo
- **Tipo:** Conector que une mensajes de Secure Scuttlebot (ssb) a colecciones MongoDB
- **Descripción:** "Connect ssb messages to mongo collections." API: `connect(sbot, messageType[, opts])(collection)`. Forked and modified ssb-mongo-connect. Licencia AGPL-3.0.
- **Estado del repositorio:** Último commit hace ~7 años (29 de abril de 2019); rama master; 1 commit; 1 branch; 0 tags; 0 stars; 2 watchers; 0 forks; 1 contributor
- **Lenguajes:** JavaScript 100%
- **Contributors (1):** luandro
- **Estructura de carpetas:** src/, archivos raíz: .gitignore, .travis.yml, LICENCE, README.md, index.js
- **API:** `connect(sbot, messageType[, opts])(collection)` — conecta mensajes de scuttlebot de tipo `messageType` a la colección mongo `collection`. Opciones: `transform`, `gte`, `concurrency`. Devuelve instancia pull-abortable.
- **Licencia:** AGPL-3.0 (verificada en la página principal)

## ⚖️ Aviso de derechos de autor y estado del documento

Ambos repositorios son código de terceros (organización open-app). open-app-mongo tiene licencia AGPL-3.0 explícita. **No se ha accedido al código fuente interno** (archivos .js de src/, schema/, index.js, etc.). Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. **No se reclama autoría sobre el contenido;** no se ha copiado ningún archivo fuente de estos repositorios originales. Antes de cualquier implementación productiva, verificar las licencias y respetar sus términos (en particular AGPL-3.0 para open-app-mongo).

## Información extraída (metadatos)

| Campo | economic-sentences-graphql | open-app-mongo |
|-------|---------------------------|----------------|
| Último commit | 7 feb 2019 (1.0.4) | 29 abr 2019 (Forked and modified ssb-mongo-connect) |
| Commits | 12 | 1 |
| Branches | 1 | 1 |
| Tags | 0 | 0 |
| Stars | 4 | 0 |
| Watchers | 4 | 2 |
| Forks | 0 | 0 |
| Contributors | 1 (luandro) | 1 (luandro) |
| Lenguajes | JavaScript 100% | JavaScript 100% |
| Licencia | No especificada | AGPL-3.0 |
| Última actividad | ~8 años | ~7 años |

## Limitaciones de esta asimilación

Esta asimilación se basa únicamente en metadatos de GitHub (README, estructura de carpetas, stats). **No se ha accedido al código fuente interno** (.js de schema/, src/, index.js). Por lo tanto:

- No se conocen los schemas GraphQL específicos de economic-sentences-graphql.
- No se conoce la lógica interna de `connect()` de open-app-mongo más allá de la firma documentada en el README.
- No se conocen las dependencias exactas de package.json.
- Toda la lógica TypeScript creada a continuación es **reimplementación pura basada en hipótesis estructurales**, no copia de código del repositorio original.
- Se respeta AGPL-3.0 para open-app-mongo: no se copia código, solo lógica pura reimplementada.
