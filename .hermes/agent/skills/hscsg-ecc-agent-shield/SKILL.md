---
name: hscsg-ecc-agent-shield
description: Escaneo de seguridad tipo AgentShield antes de commits
---
# Skill: AgentShield-like (Escaneo de seguridad)

Esta skill permite a Hermes agent ejecutar un escaneo de seguridad tipo AgentShield antes de commitear cambios al repositorio `hscsg-v15-OS`, inspirado en `AgentShield` de ECC.

## Qué escanea Hermes

Antes de cada commit, Hermes verifica:

### S1: Secretos expuestos
- GitHub PAT, API keys, tokens de acceso, contraseñas
- Cadenas que parezcan credenciales (ej. `sk-`, `ghp_`, `glpat-`, `xoxb-`)
- Archivos `.env` con valores reales (no `.env.example`)

### S2: Licencias incompatibles
- Código nuevo bajo licencias en `failOn` (GPL-3.0, AGPL-3.0, CC-BY-NC-ND-4.0, Elastic-2.0) sin aislamiento
- Dependencias nuevas con licencias restringidas
- Si se encuentra, el archivo debe aislarse en `docs/_licencia_incompatible/` o `services/gpl-isolated/`

### S3: Convenciones de commit
- Mensajes en español
- Formato `tipo: descripción` con tipo válido

### S4: Rama de destino
- No push directo a `main`
- Cambios en rama de sesión o feature

### S5: Archivos de agente
- No modificar `.hermes/agent/` de forma que rompa la operación del agente
- Mantener `agent.yaml`, `RULES.md`, `DUTIES.md` consistentes

## Resultado del escaneo

Hermes reporta:
- `LIMPIO`: no se encontraron problemas, se puede proceder al commit.
- `BLOQUEADO`: se encontraron problemas que impiden el commit; listar problemas y acciones correctivas.
- `ADVERTENCIA`: se encontraron problemas menores; el miembro decide si proceder.

## Ejemplo de salida

```
AgentShield-like escaneo: LIMPIO
- No se encontraron secretos expuestos
- No se encontraron licencias incompatibles
- Mensajes de commit siguen convencional commits en español
- Rama de destino: feature/znu-soporte (no main)
- Archivos de agente: sin cambios destructivos
```

Si se encuentra un problema:

```
AgentShield-like escaneo: BLOQUEADO
- Se encontró posible API key en archivo src/app/screens/X.tsx (línea 42)
- Acción correctiva: mover el valor a variable de entorno y añadir al .gitignore
- No se puede proceder al commit hasta resolver.
```
