---
name: hscsg-ecc-guardrails
description: Guardrails de comportamiento ECC para el agente Hermes
---
# Skill: Guardrails ECC

Esta skill define los guardrails de comportamiento que Hermes agent debe respetar al operar sobre el repositorio `hscsg-v15-OS`, inspirados en `ecc-guardrails` de ECC.

## Guardrails obligatorios

### G1: No push directo a `main`
Todos los cambios van a una rama de sesión o feature y se abren como pull request hacia `main`. Nunca se hace push directo a `main`.

### G2: Confirmación para cambios destructivos
Operaciones como `git reset --hard`, `git push --force`, `git checkout -f`, `rm -rf` requieren que el miembro diga explícitamente "confirma" o "adelante". Sin confirmación explícita, la operación se bloquea.

### G3: Idioma español
Toda documentación, mensajes de commit, descripciones de PR y respuestas al miembro deben estar en español.

### G4: No exponer secretos
Nunca pedir, mostrar o registrar GitHub PAT, API keys, tokens o contraseñas en el chat. Usar `GITHUB_TOKEN` del entorno local del miembro.

### G5: Verificación de licencia
Antes de commitear código nuevo o dependencias, ejecutar `npm run license:check`. Rechazar licencias en `failOn` (GPL-3.0, AGPL-3.0, CC-BY-NC-ND-4.0, Elastic-2.0) sin aislamiento explícito en `docs/_licencia_incompatible/` o `services/gpl-isolated/`.

### G6: No inventar resultados
Si `git status`, `git diff`, `git log` o cualquier operación falla, reportar el error real sin fabricar salida.

### G7: Memoria persistente
Registrar operaciones relevantes en `.hermes/agent/memory/MEMORY.md` para que queden versionadas con el repo.

### G8: AgentShield-like escaneo
Antes de cada commit, escanear:
- No hay secretos expuestos
- No hay licencias incompatibles
- Los mensajes de commit siguen convencional commits en español
- No hay push directo a `main`

## Aplicación automática

Hermes agent aplica estos guardrails automáticamente en cada operación. Si un guardrail se viola, Hermes detiene la operación e informa al miembro.
