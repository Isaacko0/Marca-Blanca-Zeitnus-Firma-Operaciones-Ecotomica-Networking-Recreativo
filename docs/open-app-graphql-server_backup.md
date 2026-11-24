# RESPALDO DE FUENTE — Repositorio open-app-graphql-server (GitHub)

## Identificación de la fuente

- **Título:** Open App GraphQL Server
- **Autor/origen:** open-app (organización en GitHub)
- **URL:** https://github.com/open-app/open-app-graphql-server
- **Tipo:** Servidor GraphQL con arquitectura de plugins para protocolos distribuidos (ssb, dat)
- **Descripción:** "A simple server that supports GraphQL schemas as plugins. Made for building apps on top of distributed protocols such as ssb and dat. Used for an implementation of an Open App Ecosystem of interoperable APIs based on distributed protocols."
- **Estado del repositorio:** Último commit hace ~7 años (28 de mayo de 2019); rama master; 67 commits; 22 branches; 0 tags; 26 stars; 3 watchers; 0 forks; 1 contributor
- **Lenguajes:** JavaScript 100%
- **Contributors (1):** luandro
- **Estructura de carpetas:** example/, src/, archivos raíz: .gitignore, README.md, index.js, package-lock.json, package.json
- **Build/dependencias:** package.json, package-lock.json (npm/yarn), Node v8 o superior
- **Uso:** `npm i` && `npm run install-example`, `npm run dev` o `yarn dev`, servidor en http://localhost:4000/graphql
- **Instalación:** `npm i -S open-app-graphq-server` o `yarn add open-app-graphq-server`
- **API de plugins:** `server([ssb, dat, economic])` — arranca servidor SSB y cliente que alimenta capa GraphQL
- **Blobs:** servidos desde localhost:7777/ usando ssb-serve-blobs
- **Plugin de ejemplo:** economic-sentences-graphql (https://github.com/open-app/economic-sentences-graphql)
- **Planes:** Schema para fs; plugins que incluyan GraphQL schemas + ssb plugins + flumedb views
- **Licencia:** no especificada en la página principal (no se leyó LICENSE si existe)

## ⚖️ Aviso de derechos de autor y estado del documento

Este repositorio es código de terceros (organización open-app). No se ha accedido al código fuente interno (archivos .js en src/, example/, etc.). Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. **No se reclama autoría sobre el contenido;** no se ha copiado ningún archivo fuente del repositorio original. Antes de cualquier implementación productiva, verificar la licencia y respetar sus términos.

## Información extraída del repositorio (metadatos)

- Último commit: "added ssb-private and ssb-publish-graphql" por luandro, 28 de mayo de 2019 (hash 7a0518a51619c52a7c71e25c50becf549ee7bc21)
- 67 commits en master
- 22 branches, 0 tags
- 26 stars, 3 watchers, 0 forks
- 1 contributor: luandro
- Carpetas principales: example/, src/
- Archivos raíz: .gitignore, README.md, index.js, package-lock.json, package.json
- Tecnología detectada: JavaScript 100% (Node.js)
- Versión Node requerida: v8 o superior

## Limitaciones de esta asimilación

Esta asimilación se basa únicamente en la página principal del repositorio GitHub (metadatos, README, estructura de carpetas). **No se ha accedido al código fuente interno** (archivos .js de src/, example/, lógica de plugins, schemas GraphQL, etc.). Por lo tanto:

- No se conocen los schemas GraphQL específicos, resolutores, modelos de datos ni lógica de negocio.
- No se conoce el alcance funcional exacto más allá de lo descrito en el README (servidor GraphQL con plugins para ssb, dat, economic-sentences).
- No se conoce la licencia específica.
- Toda la lógica TypeScript creada a continuación es **reimplementación pura basada en hipótesis estructurales**, no copia de código del repositorio original.
