# Guía operativa: contribuir al repo hscsg-v15-OS desde Hermes agent con patrones ECC

**Origen:** adaptación de ECC (github.com/affaan-m/ECC, MIT) a hscsg-v15-OS, operando desde Hermes agent.  
**Estado:** borrador operativo.  
**Idioma:** español.

---

## 1. ¿Qué puedes hacer desde Hermes agent

Con la estructura de agente Hermes instalada en el repo y las skills de Hermes instaladas en tu perfil, cualquier miembro del consorcio ALRAC puede aportar al repositorio `hscsg-v15-OS` aplicando el ciclo de ECC:

```
plan -> test -> implement -> review -> verify -> remember -> improve
```

| Acción | Ejemplo de petición a Hermes |
|---|---|
| Planificar cambio | "Hermes, lee la spec `alrac-architecture.md` y planifica los cambios para añadir soporte a ZNU" |
| Ejecutar tests | "Hermes, ejecuta `npm test`, `npm run typecheck` y `npm run license:check` antes de cambios" |
| Implementar | "Hermes, crea una rama `feature/znu-soporte` y edita `openspec/specs/alrac-znu.md`" |
| Revisar diff | "Hermes, muestra el diff y escanea secretos y licencias (AgentShield-like)" |
| Verificar | "Hermes, ejecuta verificaciones finales antes de commitear" |
| Commitear | "Hermes, commitea con mensaje 'feat: añade soporte ZNU a specs OpenSpec'" |
| Abrir PR | "Hermes, abre un PR de `feature/znu-soporte` hacia `main`" |
| Recordar | "Hermes, registra esta operación en la memoria del agente" |
| Mejorar | "Hermes, sugiere mejoras al flujo basadas en el historial de memoria" |

---

## 2. El ciclo ECC adaptado a Hermes

### 2.1 Plan

Hermes lee las specs OpenSpec en `openspec/specs/`, los archivos de agente en `.hermes/agent/`, y entiende el alcance del cambio antes de tocar nada.

### 2.2 Test

Antes de cualquier implementación, Hermes ejecuta:
- `npm run license:check` (verificar licencias compatibles)
- `npm run typecheck` (verificar tipos TypeScript)
- `npm run lint` (verificar lint)
- `npm test` (verificar tests)

Si algo falla, Hermes lo reporta y no procede a implementar hasta que se resuelva.

### 2.3 Implement

Hermes edita, crea o elimina archivos en una rama de sesión creada desde `main`. Nunca trabaja directamente sobre `main`.

### 2.4 Review

Hermes muestra el diff al miembro para revisión. Opcionalmente ejecuta un escaneo tipo AgentShield:
- Buscar secretos expuestos (API keys, tokens, contraseñas)
- Verificar que no se introduzcan licencias incompatibles (AGPL-3.0, GPL-3.0, CC-BY-NC-ND-4.0)
- Verificar que los mensajes de commit sigan convencional commits en español

### 2.5 Verify

Hermes ejecuta las verificaciones finales (`license:check`, `typecheck`, `lint`, `test`) tras los cambios.

### 2.6 Remember

Hermes registra la operación en `.hermes/agent/memory/MEMORY.md`:
- Fecha, operación, rama, archivos, commit, PR
- Notas relevantes para operaciones futuras

### 2.7 Improve

Basado en el historial de memoria, Hermes sugiere mejoras al flujo (ej. nuevas skills, ajustes a reglas, specs faltantes).

---

## 3. Skills de Hermes disponibles (instaladas en tu perfil)

| Skill | Propósito |
|---|---|
| `hscsg-hermes-git-contributor` | Operaciones git básicas (status, diff, log, branch, edit, commit, pr_open) |
| `hscsg-ecc-conventions` | Convenciones de estilo ECC (convencional commits, español, estructura de archivos) |
| `hscsg-ecc-guardrails` | Guardrails de comportamiento (no push a `main`, confirmación para destructivos) |
| `hscsg-ecc-research` | Investigación y lectura de specs OpenSpec antes de cambios |
| `hscsg-ecc-agent-shield` | Escaneo de seguridad (secretos, licencias, permisos, archivos de agente) |
| `hscsg-ecc-hermes-contributor` | Operaciones git + patrones ECC integrados (ciclo completo) |

Si no están instaladas, pídele a Hermes que las cree o instálalas desde el catálogo de skills de Hermes.

---

## 4. Flujo de contribución recomendado (paso a paso)

1. **Pide a Hermes que investigue:** "Hermes, lee las specs relevantes y planifica el cambio."
2. **Pide tests previos:** "Hermes, ejecuta `license:check`, `typecheck`, `lint` y `test` antes de cambios."
3. **Pide una rama:** "Hermes, crea una rama `feature/mi-aporte` desde `main`."
4. **Pide la implementación:** "Hermes, edita los archivos necesarios."
5. **Pide revisión:** "Hermes, muestra el diff y ejecuta escaneo AgentShield-like."
6. **Pide verificación final:** "Hermes, ejecuta verificaciones tras los cambios."
7. **Pide commit:** "Hermes, commitea con mensaje en español."
8. **Pide PR:** "Hermes, abre un PR hacia `main`."
9. **Pide recordatorio:** "Hermes, registra la operación en la memoria del agente."

---

## 5. Reglas de seguridad (compatibles con ECC AgentShield)

| Regla | Justificación |
|---|---|
| Nunca push directo a `main` | Todos los cambios van por PR para revisión. |
| Cambios destructivos requieren confirmación explícita | `git reset --hard`, `git push --force`, `rm -rf` necesitan `confirmar: true`. |
| Nunca compartir GitHub PAT en el chat | Usa `GITHUB_TOKEN` en tu entorno local. |
| Todos los mensajes de commit en español | Estándar del repositorio. |
| Ejecutar `license:check` antes de commitear | Evita licencias incompatibles (failOn). |
| Escanear secretos antes de commit | AgentShield-like: no exponer claves, tokens, contraseñas. |

---

## 6. Estructura del agente Hermes en este repo

```
.hermes/agent/
├── agent.yaml          # Configuración extendida con conceptos ECC
├── SOUL.md             # Identidad (pendiente: bloqueado por protección del sistema)
├── RULES.md            # Reglas de comportamiento
├── DUTIES.md           # Responsabilidades
├── memory/
│   └── MEMORY.md       # Memoria persistente (git-commitada)
├── tools/
│   └── git-tools.yaml  # Herramientas git declarativas
├── skills/
│   ├── hscsg-contributor/        # Skill base de contribución
│   ├── hscsg-ecc-conventions/    # Convenciones ECC
│   ├── hscsg-ecc-guardrails/     # Guardrails ECC
│   ├── hscsg-ecc-research/       # Investigación ECC
│   └── hscsg-ecc-agent-shield/   # Escaneo seguridad (AgentShield-like)
├── workflows/
│   ├── contribute.yaml       # Flujo base de contribución
│   ├── contribute-ecc.yaml   # Flujo ciclo completo ECC
│   └── review-ecc.yaml       # Flujo de revisión tipo AgentShield
├── hooks/
│   └── hooks.yaml            # Hooks de ciclo de vida
└── knowledge/
    └── index.yaml            # Entradas de conocimiento
```

---

## 7. Ejemplos de interacción

```
Usuario: "Hermes, planifica el cambio para añadir soporte ZNU usando las specs OpenSpec"
Hermes: [lee specs, presenta plan]

Usuario: "Hermes, ejecuta license:check, typecheck, lint y test antes de cambios"
Hermes: [ejecuta verificaciones, reporta resultados]

Usuario: "Hermes, crea una rama feature/znu-soporte desde main"
Hermes: ✓ Rama creada

Usuario: "Hermes, edita openspec/specs/alrac-znu.md con el soporte ZNU"
Hermes: ✓ Archivo editado

Usuario: "Hermes, muestra el diff y escanea secretos y licencias"
Hermes: [muestra diff, reporta escaneo AgentShield-like limpio]

Usuario: "Hermes, ejecuta verificaciones finales y commitea con mensaje 'feat: añade soporte ZNU a specs OpenSpec'"
Hermes: [ejecuta verificaciones, commitea]

Usuario: "Hermes, abre un PR de feature/znu-soporte hacia main"
Hermes: ✓ PR abierto: #XXX

Usuario: "Hermes, registra la operación en la memoria del agente"
Hermes: ✓ Registrado en memory/MEMORY.md
```

---

## 8. Verificación

Antes de commitear cualquier cambio desde Hermes, ejecuta localmente:

```bash
npm run license:check
npm run typecheck
npm run lint
npm test
```

Si algo falla, pídele a Hermes que lo corrija antes de abrir el PR.
