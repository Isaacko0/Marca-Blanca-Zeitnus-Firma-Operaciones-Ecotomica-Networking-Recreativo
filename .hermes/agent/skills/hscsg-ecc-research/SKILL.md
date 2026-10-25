---
name: hscsg-ecc-research
description: Investigación y lectura de specs OpenSpec antes de cambios
---
# Skill: Investigación ECC

Esta skill permite a Hermes agent investigar y leer las specs OpenSpec y la documentación del repositorio `hscsg-v15-OS` antes de realizar cambios, inspirado en `ecc-research-playbook` de ECC.

## Propósito

Antes de implementar cualquier cambio, Hermes debe entender el alcance leyendo las fuentes de verdad del repositorio:

- `openspec/specs/` — specs OpenSpec (fuente de verdad de la arquitectura ALRAC)
- `docs/` — documentación del repositorio
- `README.md` — descripción general del proyecto
- `.hermes/agent/` — configuración del agente Hermes
- `CHANGELOG.md` — historial de cambios (solo local, no subir a GitHub)

## Flujo de investigación

1. **Identificar specs relevantes:** Qué specs de `openspec/specs/` tocan el área de cambio.
2. **Leer specs:** Leer el contenido completo de las specs relevantes.
3. **Entender el alcance:** Qué archivos deben cambiar, qué capas ALRAC se afectan.
4. **Planificar:** Presentar un plan de cambios al miembro antes de implementar.
5. **Persistir:** Registrar la investigación en `memory/MEMORY.md`.

## Ejemplos de petición

- "Hermes, lee `alrac-architecture.md` y `alrac-governance.md` y planifica los cambios para añadir soporte ZNU."
- "Hermes, investiga qué specs tocan el área de memoria y resume los hallazgos."
- "Hermes, lee la spec `alrac-scheduled-jobs.md` y explica cómo funciona el ciclo de vida de los jobs."

## Salida de la investigación

Hermes presenta:
- Qué specs son relevantes
- Qué cambios se proponen
- Qué capas ALRAC se afectan
- Qué archivos deben editarse
- Riesgos y consideraciones de licencia
