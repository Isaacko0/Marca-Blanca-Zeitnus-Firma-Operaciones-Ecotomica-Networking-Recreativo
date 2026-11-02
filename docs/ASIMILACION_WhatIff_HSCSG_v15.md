# Informe de asimilación: WhatIff (repo + Substack) → hscsg-v15-OS

**Estado:** borrador de investigación — no modifica código fuente hasta aprobación.  
**Idioma:** español (estándar obligatorio del repositorio).  
**Licencias de las fuentes:** WhatIff repo = Apache License 2.0 · Substack post = derechos de autor del autor (conceptos reimplementables, no copia literal de texto).  
**Repo objetivo:** política `license-checker` (failOn: GPL-3.0, AGPL-3.0, CC-BY-NC-ND-4.0, Elastic-2.0 · warnOn: GPL-2.0, LGPL-3.0, MPL-2.0, CC-BY-SA-4.0, CC-BY-NC-4.0, CC-BY-NC-SA-4.0). Apache-2.0 no está restringida.

---

## 1. Método aplicado

Asimilación de 4 fases (stack-agnostic, misma que la usada previamente con Psycheros/TeDDy y con Go en `red-de-intercambio-federada-isaacko`):

1. **Fase 0 — Backup:** copia local de la fuente y del estado actual del repo objetivo antes de tocar nada (`docs/_licencia_incompatible/` para material de licencia no compatible).
2. **Fase 1 — Documentación de integración:** `docs/integration.md` + `docs/backup.md` en español; sin subir CHANGELOG ni docs sensibles a GitHub (copias solo en `~/`, `~/Documents`, `~/Desktop`).
3. **Fase 2 — Generación de código:** solo patrones y arquitecturas reimplementadas en TypeScript/React del target (Zustand, vite, OpenSpec specs). Nunca copia literal de código bajo licencia restrictiva sin aislamiento explícito.
4. **Fase 3 — Verificación:** `license:check`, `typecheck`, `lint`, `test` del repo objetivo.

Toda la documentación nueva se escribe en español. Las decisiones de arquitectura se registran aquí y en `openspec/specs/`.

---

## 2. Fichas técnicas de las fuentes

### 2.1 WhatIff — github.com/theimaginaryfoundation/what-iff

| Campo | Valor |
|---|---|
| Licencia | Apache License 2.0 (permisiva, sin copyleft) |
| Stack backend | Go 1.27 · Gorilla Mux · Ent ORM · PostgreSQL 16 + pgvector · JWT auth · Zap |
| Stack frontend | Angular 22 · TypeScript 5 · Tailwind CSS 4 · RxJS · ngx-markdown |
| Proveedores de IA | OpenAI, Anthropic, Google (Gemini), Z.ai (GLM), Mistral, DeepSeek, Qwen, Xiaomi — BYO API keys |
| Versión actual | initial open-source release (Aug 2026), 838 commits, 229 branches, 0 tags |
| Mantenedores | LiminalDevving, entre otros |
| Sitio | whatiff.chat · Blog: imaginationfoundry.substack.com |

**Arquitectura clave (del README y estructura de directorios):**
- `cmd/api-server/`: punto de entrada de la API.
- `internal/agent/`: agente que usa herramientas, herramientas y procesamiento de archivos.
- `internal/agentjobs/`: trabajos de agente programados y en background (scheduler con distributed-lock-aware).
- `internal/auth/`: JWT, hash de contraseñas, utilidades de token.
- `internal/datastore/`: operaciones de BD (patrón repository sobre Ent ORM).
- `internal/handlers/`: handlers HTTP.
- `internal/memoryutil/`: helpers de memoria semántica.
- `internal/metering/`: seam de medición de uso (no-op en build open-source).
- `internal/middleware/`: auth, CORS, logging.
- `internal/providers/`: integraciones con proveedores de modelos.
- `internal/server/`: cableado y enrutado del servidor HTTP.
- `ent/schema/`: esquema de BD Ent (código generado no se compromete).
- `web/app/`: frontend Angular.
- `docs/`: arquitectura y referencia.
- `openapi.yaml`: especificación REST completa.

**Características documentadas:**
- Multi-provider chat: streaming, Markdown, múltiples sesiones, sidebar, renombrado inline, settings por chat.
- Semantic memory: memoria a largo plazo como vector embeddings (pgvector), recall por contexto de conversación, filtrado por fecha/ámbito/chat/contenido, merging y compactación con checkpoints.
- Personalities: personas reutilizables con system prompts y comportamiento personalizables, switch por chat o por defecto, documentos de referencia adjuntos.
- Rituals: plantillas de prompt reutilizables invocables con atajos de teclado, binding a personalidad, auto-enriquecimiento de mensajes con contexto.
- Tools & agents: file attachments (30+ tipos, búsqueda semántica sobre docs subidos), code interpreter, image generation, web search, Agents (trabajos programados y background con scheduler consciente de distributed locks), archivos generados por IA guardados de vuelta en la conversación.
- Integrations: conectores MCP remotos con activación por chat, webhook API tokens (almacenados como hash de una vía, auth bearer estático aislado de session JWTs), modos de trigger webhook (`user`, `assistant` write-only, `background` async agent trigger).
- Built for operators: OpenAPI spec, logging estructurado (Zap), Ent ORM con migraciones automáticas no destructivas, Docker & Docker Compose, GitHub Actions CI.

### 2.2 Substack — Using WhatIff to automate your life: meal planning and grocery lists

**Autor:** Gori (imaginationfoundry.substack.com) · **Fecha:** 18 Sep 2026 · **Serie:** primera de una serie sobre usar WhatIff para tareas ordinarias de la vida.

**Concepto central:** un **Scheduled Job** — pieza de trabajo recurrente y duradera con instrucciones propias, schedule, contexto y salida. No es solo un prompt; es un prompt que corre en schedule de forma repetible, inspeccionable y ajustable.

**Lo que hace el Job semanal de meal planning:**
- Planificar comidas de la semana entrante
- Considerar preferencias y restricciones
- Elegir o variar recetas
- Recolectar ingredientes necesarios
- Combinarlos en lista de compras
- Presentar el resultado en formato fácil de revisar

**Piezas componibles del flujo:**
1. **Job**: decide cuándo ocurre el trabajo y qué resultado producir.
2. **Skill de libro de recetas**: conocimiento reutilizable (ingredientes, pasos de preparación, sustituciones, porciones, categorías).
3. **Mode de cocina**: realidad del hogar (complejidad preferida, restricciones dietéticas, ingredientes no deseados, tamaños de porción, sensibilidad al presupuesto, sobras, organización de lista de compras).
4. **Memory**: lleva preferencias útiles adelante cuando se vuelven relevantes.
5. **Thread**: permanece disponible como workspace para cambios y preguntas durante la semana.

**Prompt de meal planning (Appendix del post):**
- Construir plan semanal de comidas y lista de compras.
- Usar biblioteca de recetas + contexto de thread reciente sobre ingredientes disponibles.
- Reglas: exactamente 3 recetas (1 involved de la librería, 1 easy de la librería, 1 nueva involved o easy), bias hacia reuso de ingredientes (perecederos, artículos vendidos en cantidades mayores a lo necesario), evitar ingredientes one-off specialty sin razón fuerte, no repetir comidas de contextos previos.
- Formato de salida: 1) Weekly menu (3 recetas etiquetadas involved/easy/new con razón), 2) Existing-library recipe ingredients (solo listas de ingredientes), 3) New recipe (receta completa: ingredientes y método), 4) Unified shopping list (combinado, deduplicado, agrupado por departamento: Produce, Meat/Seafood, Dairy/Refrigerated, Freezer, Dry Goods/Pantry, Bakery/Bread, Canned/Jarred/Sauces, Spices/Specialty), 5) Reuse/leftovers notes.
- General behavior: práctico, compacto, útil; no bloquear si falta contexto; no hacer follow-up questions en la salida; elegir entre opciones de sustitución para mejorar overlap de ingredientes.

**Patrón de personalización y continuidad:**
- Preferencias aprendidas de conversaciones pasadas (ej. "Add extra lemon here—you like things sour" proveniente de una discusión de cocina meses atrás).
- La personalización debe ser legible: inspeccionable, corregible, eliminable. No una "teoría privada misteriosa" del hogar.
- Trustworthy personalization = poder ver por qué el sistema cree algo, arreglarlo y seguir adelante.

**Boundary de aprobación (etapas de automatización):**
1. suggest → 2. explain → 3. prepare → 4. ask for approval → 5. execute.
- Nunca saltar de "suggest meals" a "agent ordena groceries silenciosamente".
- Con MCP integration, grocery delivery podría convertir la lista en comida que llega a la puerta, pero solo tras aprobación explícita.

**Lección clave:** la diferencia no es obtener una respuesta clever; es construir un workflow con el que se pueda vivir — que sepa por qué corre, reutilice las capacidades correctas, aplique preferencias estables, lleve contexto útil adelante, deje un thread de trabajo para cambios de la vida real, se inspeccione cuando algo falle, y crezca un permission boundary a la vez.

---

## 3. Análisis de derechos de autor y compatibilidad de licencias

### 3.1 Tabla de compatibilidad con el repo objetivo

| Fuente | Licencia | Tipo | Fallo `license-checker` del objetivo | Puede incluirse en `src/` del objetivo |
|---|---|---|---|---|
| Repo objetivo (hscsg-v15-OS) | — (propia HSCSG) | — | — | Sí |
| WhatIff repo | Apache-2.0 | Permisiva | No está en failOn ni warnOn | Sí — conceptos y patrones reimplementables libremente; código puede adaptarse manteniendo aviso Apache-2.0 si se copia literal |
| Substack post | Derechos de autor del autor (Gori / Imagination Foundry) | Contenido editorial | N/A (no es código) | Conceptos reimplementables; no copiar texto literal ni prompts íntegros sin atribución |

### 3.2 Reglas derivadas (no negociables)

1. **WhatIff Apache-2.0:** permisiva. Los conceptos (Scheduled Jobs, semantic memory con pgvector, personalities, rituals, agents, MCP connectors, webhooks) pueden reimplementarse en TypeScript sin obligación de abrir el código del objetivo. Si se copia código literal, debe conservarse el aviso de licencia Apache-2.0 y el copyright de los autores.
2. **Substack post:** los conceptos de flujo (Job + Skill + Mode + Memory + Thread, boundary de aprobación, personalización legible) son ideas, no expresión protegida. Se pueden reimplementar. El prompt del Appendix y el texto del post no deben copiarse literalmente en el repo sin atribución y sin permiso del autor.
3. **Documentación:** traducir/resumir al español sin copiar texto literal extenso; citar URLs fuente.

---

## 4. Extracción arquitectónica: qué se asimila de WhatIff

| Concepto WhatIff | Equivalente propuesto en hscsg-v15-OS | Capa ALRAC |
|---|---|---|
| Scheduled Job (duradero, recurrente, instrucciones + schedule + contexto + salida) | Trabajos programados de gobernanza (revisión CDS, expiración ZNU 90d, actas recurrentes) | Capa 5 (gobernanza transversal) |
| Semantic memory (pgvector, embeddings, merging + compactación con checkpoints) | Memoria del consorcio: actas, specs, contratos de datos con RAG y consolidación | Capa 0 (epistémica) + Capa 1 (TQ ledger) |
| Personalities (personas con system prompts, documentos de referencia) | Identity files de nodos/agentes HSCSG (primera persona, self/user/relationship) | Capa 0 + Capa 5 |
| Rituals (plantillas de prompt, binding a personalidad, atajos) | Core Prompts del nodo + custom tools registrados | Capa 0.5 (normativa) + Capa 3 |
| Agents (scheduled & background, distributed-lock-aware scheduler) | Ejecución autónoma de trabajos del nodo con bloqueo distribuido | Capa 5 |
| File attachments + búsqueda semántica (30+ tipos) | Vault de documentos del nodo con RAG sobre specs OpenSpec | Capa 2 (interoperabilidad) |
| Remote MCP connectors (activación por chat) | entity-core análogo: MCP server canónico del consorcio | Capa 0 + Capa 2 |
| Webhook API tokens (hash de una vía, scopes limitados) | Autenticación de nodos federados y endpoints de intercambio | Capa 3 (membrana fiat/zeitnus) |
| Multi-provider chat (BYO keys, modelo intercambiable) | Capa de inferencia del nodo agnóstica al proveedor | Capa 4 (aplicación) |
| Ent ORM + migraciones no destructivas + PostgreSQL | Persistencia del nodo con esquema versionado | Tooling del nodo |

---

## 5. Mapa de integración en el repo objetivo

El repo objetivo es `hscsg-v15-OS` (arquitectura 5 capas + capa 0 epistémica ALRAC, stack TS/React/Vite/Zustand, 354 docs en `docs/`, skills en `skills/`).

**Ubicaciones propuestas para la asimilación:**

1. `docs/integration/WhatIff-integration.md` — patrones de Scheduled Jobs, semantic memory, personalities, rituals, agents, MCP connectors (reimplementados en TS).
2. `docs/integration/WhatIff-mealplanning-flujo.md` — flujo componible Job + Skill + Mode + Memory + Thread adaptado a gobernanza ALRAC (solo descripción de proceso, sin copia literal del prompt del Substack).
3. `openspec/specs/` — nuevas specs o extensiones: `alrac-scheduled-jobs.md` (trabajos recurrentes de gobernanza), `alrac-semantic-memory.md` (memoria semántica del consorcio), `alrac-personalities-identities.md` (identity files), `alrac-mcp-connectors.md` (conectores MCP federados).
4. `src/core/lib/integralInterfaces.ts` (ya sin trackear) — candidato para interfaces de agentes y jobs programados del nodo.
5. `skills/` — nueva skill si el usuario lo aprueba.

**Especificaciones sin trackear (`??` en git status) que podrían absorber conceptos:**
Las mismas 17 specs del informe anterior (ADMISSION_WORKFLOW_SPEC, CAAS_*, CAYAPA_*, COMMUNITY_HEALTH_INDEX, DEPARTMENTS_STRUCTURE, EXCHANGE_PROHIBITION, INTEGRAL_*, SYMMETRIC_LIMITS) + 3 archivos de integración.

---

## 6. Riesgos y reglas de inclusión

| Riesgo | Mitigación |
|---|---|
| Copia literal del prompt del Appendix del Substack | Prohibido sin atribución; solo se describe el patrón, no se copia el texto. |
| Copia literal de código Apache-2.0 (WhatIff) sin aviso de licencia | Si se copia, conservar aviso Apache-2.0 y copyright en el archivo. |
| Subir CHANGELOG o docs sensibles a GitHub | Copias solo en `~/`, `~/Documents`, `~/Desktop`. |
| Confundir "asimilación de arquitectura" con "copia de expresión" | Se extraen patrones y flujos; la implementación se escribe en TS desde cero. |

---

## 7. Plan de ejecución (próximos pasos)

**Fase 0 (backup):** copiar el estado actual del repo y las dos fuentes ya leídas (guardadas en caché de Hermes) a `~/` antes de escribir código.

**Fase 1 (documentación):** crear `docs/integration/WhatIff-integration.md` y `docs/integration/WhatIff-mealplanning-flujo.md` en español, con citas a las URLs fuente y tabla de licencias.

**Fase 2 (código):** generar en TypeScript las interfaces de Scheduled Jobs, semantic memory, personalities y agents del nodo, respetando `lib/` (sin duplicar tipos — re-exportar desde `lib/`) y la regla `Aside.tsx + i18n + lucide` para pantallas nuevas.

**Fase 3 (verificación):** ejecutar `npm run license:check`, `npm run typecheck`, `npm run lint`, `npm test` del repo objetivo. Corregir fallos antes de marcar completo.

---

## 8. Decisiones pendientes (requieren tu input)

1. ¿Quieres que proceda a escribir los dos `docs/integration/*.md` y las specs OpenSpec derivadas de esta asimilación?
2. ¿Deseas que cree la rama `asimilacion/whatiff` antes de tocar archivos?
3. ¿Qué specs de las 17 sin trackear deben absorber primero los conceptos de Scheduled Jobs / semantic memory (WhatIff)?

---

## 9. Guardado como skill

Este trabajo de asimilación (método 4 fases, análisis de licencias Apache-2.0, mapa de integración HSCSG) es reutilizable. Ya se guardó como la skill `hscsg-external-repo-assimilation` (con warnings de lint por metadatos faltantes que se parcharon tras este informe).

**¿Quieres que guarde esta tarea específica de asimilación WhatIff en la skill?** Tú decides por tarea.

---

### Fuentes consultadas (texto íntegro leído)

1. https://github.com/theimaginaryfoundation/what-iff (README, estructura de directorios, licencia Apache-2.0)
2. https://imaginationfoundry.substack.com/p/using-whatiff-to-automate-your-life (post completo con Appendix de prompt de meal planning)
3. Repo objetivo local: `/c/Users/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (`.license-checkerrc`, `package.json`, `README.md`, git status)
