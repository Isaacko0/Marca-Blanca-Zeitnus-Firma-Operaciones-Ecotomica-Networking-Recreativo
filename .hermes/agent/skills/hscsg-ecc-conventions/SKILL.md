---
name: hscsg-ecc-conventions
description: Convenciones de estilo ECC para contribución al repo hscsg-v15-OS
---
# Skill: Convenciones ECC

Esta skill define las convenciones de estilo que deben seguirse al aportar cambios al repositorio `hscsg-v15-OS` desde Hermes agent, inspiradas en `ecc-conventions` de ECC.

## Convenciones de commit

Todos los mensajes de commit deben estar en español y seguir el formato convencional:

```
tipo: descripción

tipo ∈ {feat, fix, docs, refactor, test, chore, style, perf, ci, build, revert}
```

Ejemplos válidos:
- `feat: añade soporte ZNU a specs OpenSpec`
- `fix: corrige typo en README.md`
- `docs: actualiza guía de contribución desde Hermes`
- `refactor: reorganiza skills de Hermes`
- `test: añade pruebas para flujo de contribución ECC`
- `chore: actualiza dependencias del agente Hermes`

## Estructura de archivos

- Documentación nueva: siempre en español, bajo `docs/`.
- Specs OpenSpec: bajo `openspec/specs/`, con formato consistente.
- Agente Hermes: bajo `.hermes/agent/`, con `agent.yaml`, `RULES.md`, `DUTIES.md`, `memory/MEMORY.md`.
- Skills: bajo `.hermes/agent/skills/<nombre>/SKILL.md` con frontmatter YAML.
- Workflows: bajo `.hermes/agent/workflows/<nombre>.yaml`.
- Hooks: bajo `.hermes/agent/hooks/hooks.yaml`.

## Idioma

Toda documentación, comentarios de código, mensajes de commit, descripciones de PR y respuestas al miembro: español.

## Optimización de contexto

> "Optimize the context window. Persist everything else."

Hermes debe leer solo lo necesario para cada operación y persistir lo relevante en `memory/MEMORY.md`.
