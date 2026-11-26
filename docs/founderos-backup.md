# RESPALDO DE FUENTE — Repositorio FounderOS (GitHub)

## Identificación de la fuente

- **Título:** FounderOS — An open-source, single-operator business command center
- **Autor/origen:** Bennettxai (organización en GitHub)
- **URL:** https://github.com/Bennettxai/FounderOS
- **Sitio asociado:** https://founderos.sh/
- **Tipo:** Repositorio de aplicación web (dashboard de operaciones para operador único)
- **Descripción:** "An open-source, single-operator business command center: run a one-person operated company as AI-assisted departments (comms, funnel, social, finances, agents, and a knowledge graph) from one live dashboard."
- **Estado del repositorio:** Activo. Último commit hace 5 días (21 de noviembre de 2026); rama main; 83 commits; 5 branches; 2 tags; 1.5k stars; 17 watchers; 428 forks; 7 contributors
- **Lenguajes:** TypeScript 88.2%, CSS 9.5%, JavaScript 2.3%
- **Contributors (7):** Bennettxai, claude, brodyautomates, Alphanace, mind-g0, XJJelley, jessxdavid
- **Licencia:** MIT (permisiva)
- **Estructura de carpetas:** .github/workflows, app, archive, components, docs, founderos, y archivos raíz (incluye LICENSE, README.md)
- **Base tecnológica:** Next.js 14, una base de datos SQLite, construida sobre el codebase de GladOS (brodyautomates/glados d8daf67)
- **Departamentos/funcionalidades:** comms, funnel, social, finances, agents, knowledge graph (G-Brain / Optimal Engine), crons, skills, workflows, deals, campaigns, drift, Wizard projects, Optimal Engine store
- **Modo demo:** lib/demo/ construye demo-data/ en el primer arranque desde la v1 seed y la demo company (founderos.sh); modo real con GLADOS_DEFAULT_MODE=real da instalación en blanco
- **Desarrollo:** npm test, npm run typecheck, npm run build, npm run preview
- **Conocimiento opcional:** G-Brain CLI (github:garrytan/gbrain) con pglite, import de notas markdown
- **Seguridad:** Settings → Security, contraseña de operador para páginas de app y rutas API

## ⚖️ Aviso de derechos de autor y estado del documento

Este repositorio es código de terceros (Bennettxai / FounderOS) bajo licencia MIT. **No se ha accedido al código fuente interno** (archivos .tsx, .ts, .css, etc.). Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. **No se reclama autoría sobre el contenido;** no se ha copiado ningún archivo fuente del repositorio original. Antes de cualquier implementación productiva, verificar la licencia MIT y respetar sus términos.

## Información extraída del repositorio (metadatos y README)

- Último commit: "The final glass sweep as a test: every face rule and TSX element on t…" por Bennettxai y claude, 21 de noviembre de 2026 (hash e26392ca2558eca8287b09a48bd04060b4003fb5)
- 83 commits en main
- 5 branches, 2 tags
- 1.5k stars, 17 watchers, 428 forks
- 7 contributors: Bennettxai, claude, brodyautomates, Alphanace, mind-g0, XJJelley, jessxdavid
- Carpetas principales: .github/workflows, app, archive, components, docs, founderos
- Tecnologías detectadas: TypeScript 88.2%, CSS 9.5%, JavaScript 2.3%
- Base: Next.js 14 + SQLite (una base de datos), sobre GladOS codebase
- Departamentos: comms, funnel, social, finances, agents, knowledge graph
- Módulos: crons, skills, workflows, funnel, social, deals, campaigns, drift, Wizard projects, Optimal Engine store
- Licencia: MIT

## Limitaciones de esta asimilación

Esta asimilación se basa únicamente en la página principal del repositorio GitHub (metadatos, README, estructura de carpetas). **No se ha accedido al código fuente interno** (archivos .tsx, .ts, .css, lógica de departamentos, schemas de base de datos, etc.). Por lo tanto:

- No se conocen los componentes, modelos de datos, endpoints de API ni lógica de negocio específicos.
- No se conoce el alcance funcional exacto más allá de lo descrito en el README (departamentos IA-asistidos, dashboard único, knowledge graph).
- No se conoce la estructura interna de la base de datos SQLite ni las tablas.
- Toda la lógica TypeScript creada a continuación es **reimplementación pura basada en hipótesis estructurales**, no copia de código del repositorio original.
