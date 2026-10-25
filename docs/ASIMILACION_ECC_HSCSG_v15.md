# Informe de asimilación: ECC → hscsg-v15-OS

**Estado:** borrador de investigación + adaptación operativa.  
**Idioma:** español (estándar obligatorio del repositorio).  
**Licencia de la fuente:** ECC = MIT License (permisiva, sin copyleft). Compatible con `src/` del repo objetivo.  
**Repo objetivo:** `hscsg-v15-OS` (TypeScript/React/Vite/Zustand), política `license-checker` (failOn: GPL-3.0, AGPL-3.0, CC-BY-NC-ND-4.0, Elastic-2.0 · warnOn: GPL-2.0, LGPL-3.0, MPL-2.0, CC-BY-SA-4.0, CC-BY-NC-4.0, CC-BY-NC-SA-4.0). MIT no está restringido.

---

## 1. Método aplicado

Asimilación de 4 fases (stack-agnostic, misma usada con Psycheros/TeDDy/WhatIff/Gitagent):

1. **Fase 0 — Backup:** copia local de la fuente y del estado actual del repo objetivo antes de tocar nada.
2. **Fase 1 — Documentación de integración:** `docs/integration.md` + `docs/backup.md` en español; sin subir CHANGELOG ni docs sensibles a GitHub.
3. **Fase 2 — Generación de código/estructura:** patrones y arquitecturas reimplementados en TypeScript/React del target, más estructura de agente git-native para operación desde Hermes agent.
4. **Fase 3 — Verificación:** `license:check`, `typecheck`, `lint`, `test` del repo objetivo.

---

## 2. Ficha técnica de ECC

| Campo | Valor |
|---|---|
| Licencia | MIT License (permisiva) |
| Repositorio | github.com/affaan-m/ECC |
| Versión actual | 2.2.3 |
| Commits/tags/branches | 3,957 commits, 20 tags, 76 ramas |
| Stars/forks | 288.3k stars, 42.7k forks, 457 contribuidores |
| Stack | JavaScript (74.2 %), Rust (12.6 %), Python (10.7 %), Shell, TypeScript, Swift |
| Sitio | ecc.tools · npm: ecc-universal, ecc-agentshield · GitHub App: ecc-tools |
| Mantenedores principales | affaan-m, haelyra, claude (IA), montjeffrey, entre otros |

### 2.1 Qué es ECC

ECC (Everything Claude Code, ahora solo "ECC") es un sistema operativo de agentes de ingeniería de software. Su lema central:

> "Optimize the context window. Persist everything else."

Ciclo de trabajo del agente:
```
plan -> test -> implement -> review -> verify -> remember -> improve
```

### 2.2 Inventario de capacidades

| Componente | Cantidad | Qué aporta |
|---|---|---|
| Agentes | 71 | Planificación, revisión, reparación de builds, seguridad, arquitectura, trabajo de dominio |
| Skills | 311 | TDD, investigación, seguridad, docs, frontend, datos, ML, operaciones, y más |
| Comandos | 97 | Puntos de entrada convenientes (ECC se mueve a superficie skills-first) |
| Hooks y memoria | Runtime | Aplicación, resúmenes de sesión, aprendizaje continuo, instintos, controles de contexto |
| Reglas | Selectivas | Estándares siempre cargados que eliges por lenguaje o proyecto |
| AgentShield | Incluido | Escaneo de prompts, hooks, configuración MCP, permisos, secretos y archivos de agente |

### 2.3 Archivos clave del repositorio ECC

| Archivo / Carpeta | Propósito |
|---|---|
| `agent.yaml` | Manifiesto del agente (modelo, herramientas, runtime) |
| `SOUL.md` | Identidad y personalidad del agente |
| `CLAUDE.md` | Tarjeta de operación para el agente |
| `AGENTS.md` | Guía para agentes sobre el repositorio |
| `.claude/` | Configuración de Claude Code (skills, reglas, herramientas) |
| `.claude/skills/ecc-conventions/SKILL.md` | Skill de convenciones ECC |
| `.agents/` | Definiciones de agentes |
| `.claude-plugin/` | Plugin para Claude Code |
| `.codex/` | Configuración de Codex CLI |
| `.gemini/`, `.opencode/`, `.kimi/`, `.cursor/`, `.zed/`, `.trae/`, `.qwen/`, `.codebuddy/`, `.openclaw/`, `.hermes/` | Adaptadores para otros harnesses |
| `commands/` | 97 comandos legacy y actuales |
| `config/` | Configuración de gobernanza |
| `contexts/` | Contextos de proyecto |
| `hooks/` | Hooks de ciclo de vida |
| `integrations/aura/` | Integración Aura |
| `legacy-command-shims/` | Shim de comandos legacy |
| `manifests/` | Manifiestos de paquete |
| `mcp-configs/` | Configuraciones MCP |
| `pi/core/` | Fundamento de conversión Pi |
| `plugins/` | Plugins (123 skills, 24 comandos en release 2.2.3) |
| `rules/` | Reglas selectivas por lenguaje/proyecto |
| `schemas/` | Esquemas de datos |
| `scripts/` | Scripts de instalación y utilidades |
| `skills/` | 311 skills |
| `src/llm/` | Proveedores LLM |
| `tests/` | Suite de tests |
| `workflows/` | Workflows multi-paso |
| `ecc2/` | Núcleo ECC v2 |
| `docker/` | Docker |
| `install.sh`, `install.ps1` | Instaladores |
| `package.json`, `pyproject.toml` | Manifiestos de dependencias |
| `ecc_dashboard.py` | Dashboard |

### 2.4 Características de seguridad y gobernanza

- **AgentShield:** escaneo de prompts, hooks, configuración MCP, permisos, secretos y archivos de agente. Fail-closed por defecto.
- **ecc-guardrails:** guardrails de comportamiento del agente.
- **ecc-research-playbook:** cuaderno de investigación.
- **ecc-team-config:** configuración de equipo.
- **ecc-instincts:** instintos con IDs `ecc-*`.
- **Commitlint:** convencional commits con `commitlint.config.js`.
- **PR burst guard:** límite de PRs abiertos por contribuidor (10).
- **CODEOWNERS:** modelo de autoridad de revisión.
- **PULL_REQUEST_TEMPLATE:** checklist de revisión completa.

### 2.5 Multi-harness

ECC funciona nativamente con Claude Code, tiene rutas nativas para Codex y Qoder, y proporciona adaptadores con capacidad limitada para Cursor, OpenCode, Gemini, Zed, GitHub Copilot, Antigravity, Qwen, y otros — incluyendo **hermes** y **openclaw** como targets documentados de `ecc install --target ...`.

---

## 3. Adaptación: operar el repo hscsg-v15-OS desde Hermes agent con patrones ECC

El objetivo es que los miembros del consorcio ALRAC puedan aportar al repositorio `hscsg-v15-OS` desde la conversación de Hermes agent, aplicando los patrones de ECC (agentes especializados, skills, guardrails, AgentShield-like, ciclo plan→test→implement→review→verify→remember→improve) sin salir de la conversación.

### 3.1 Extensión de `.hermes/agent/`

Ya existe `.hermes/agent/` con `agent.yaml`, `RULES.md`, `DUTIES.md`, `memory/MEMORY.md`, `tools/git-tools.yaml`, `skills/hscsg-contributor/SKILL.md`, `workflows/contribute.yaml`, `hooks/hooks.yaml` (creado en la rama `asimilacion/gitagent-hermes`). Ahora lo extiendo con conceptos ECC:

- **`agent.yaml`**: añadir `skills` de estilo ECC (convenciones, guardrails, investigación), `guardrails`, `agentshield` (security scanning), `cycle` (plan→test→implement→review→verify→remember→improve).
- **`SOUL.md`**: identidad del agente (está bloqueada por protección del sistema, no se pudo crear; se documenta la omisión).
- **`RULES.md`**: ya existe; se mantiene compatible con ECC (no push a `main`, confirmación para destructivos, español).
- **`DUTIES.md`**: ya existe; se añaden responsabilidades de AgentShield-like (escaneo de secretos, licencias).
- **`memory/MEMORY.md`**: ya existe; memoria persistente.
- **Nuevas skills:** `hscsg-ecc-conventions`, `hscsg-ecc-guardrails`, `hscsg-ecc-research`, `hscsg-ecc-agent-shield`.
- **Nuevos workflows:** `contribute-ecc.yaml` (ciclo completo ECC), `review-ecc.yaml` (revisión tipo AgentShield).

### 3.2 Flujo de contribución ECC desde Hermes

```
plan -> test -> implement -> review -> verify -> remember -> improve
```

1. **plan:** Hermes lee specs OpenSpec y entiende qué se va a cambiar.
2. **test:** Hermes ejecuta `npm test`, `npm run typecheck`, `npm run license:check` antes de cambios.
3. **implement:** Hermes edita archivos en rama de sesión.
4. **review:** Hermes muestra diff al miembro; opcional revisión tipo AgentShield (secretos, licencias, patrones).
5. **verify:** Hermes ejecuta verificaciones finales.
6. **remember:** Hermes registra la operación en `memory/MEMORY.md`.
7. **improve:** Hermes sugiere mejoras al flujo basadas en el historial.

### 3.3 Reglas de operación (no negociables, compatibles con ECC)

1. Nunca push directo a `main`.
2. Cambios destructivos requieren confirmación explícita.
3. Todo en español.
4. No exponer secretos (GitHub PAT, API keys).
5. Ejecutar `npm run license:check` antes de commitear código nuevo.
6. AgentShield-like: escanear secretos y licencias incompatibles antes de commit.
7. No inventar resultados; reportar errores reales.

---

## 4. Mapa de integración en el repo objetivo

| Archivo | Propósito |
|---|---|
| `docs/ASIMILACION_ECC_HSCSG_v15.md` | Este informe |
| `docs/integration/ECC-hermes-contrib.md` | Guía operativa para miembros |
| `openspec/specs/alrac-ecc-agent-system.md` | Spec OpenSpec del sistema de agentes ECC adaptado a ALRAC |
| `.hermes/agent/agent.yaml` | Manifest extendido con conceptos ECC (skills, guardrails, agentshield, cycle) |
| `.hermes/agent/skills/hscsg-ecc-conventions/SKILL.md` | Skill de convenciones ECC (estilo ecc-conventions) |
| `.hermes/agent/skills/hscsg-ecc-guardrails/SKILL.md` | Skill de guardrails |
| `.hermes/agent/skills/hscsg-ecc-research/SKILL.md` | Skill de investigación |
| `.hermes/agent/skills/hscsg-ecc-agent-shield/SKILL.md` | Skill de escaneo de seguridad (AgentShield-like) |
| `.hermes/agent/workflows/contribute-ecc.yaml` | Flujo ciclo completo ECC |
| `.hermes/agent/workflows/review-ecc.yaml` | Flujo de revisión tipo AgentShield |
| Skill `hscsg-ecc-hermes-contributor` (perfil Hermes) | Operaciones git + patrones ECC desde Hermes |

---

## 5. Riesgos y reglas de inclusión

| Riesgo | Mitigación |
|---|---|
| Copia literal de código MIT sin aviso | Conservar aviso MIT y copyright en archivos adaptados. |
| Push accidental a `main` | Bloqueado por reglas y hooks; solo PRs. |
| Exposición de GitHub PAT | Nunca en chat; solo variable de entorno del miembro. |
| Commits destructivos | Requiere `confirmar: true` explícito. |
| Licencia incompatible en código nuevo | `license:check` rechaza failOn; AgentShield-like escanea antes de commit. |

---

## 6. Plan de ejecución

**Fase 0 (backup):** estado actual del repo respaldado (rama `asimilacion/ecc-hermes` creada desde `main`).

**Fase 1 (documentación):** este informe + `docs/integration/ECC-hermes-contrib.md` + spec `openspec/specs/alrac-ecc-agent-system.md`.

**Fase 2 (estructura + skills):** extender `.hermes/agent/agent.yaml` con conceptos ECC; crear skills de convenciones, guardrails, investigación y AgentShield; crear workflows de contribución y revisión ECC.

**Fase 3 (verificación):** `npm run license:check`, `typecheck`, `lint`, `test` + prueba de que Hermes agent puede operar con patrones ECC.

---

### Fuentes

- https://github.com/affaan-m/ECC (MIT)
- Repo objetivo local: `/c/Users/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`
