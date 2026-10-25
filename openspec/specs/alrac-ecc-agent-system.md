# ALRAC ECC Agent System — Spec OpenSpec

**Capa:** 5 (Gobernanza transversal) + Tooling del nodo  
**Origen de patrón:** ECC (github.com/affaan-m/ECC, MIT) — 71 agentes, 311 skills, 97 comandos, hooks, memoria, AgentShield  
**Estado:** borrador  
**Idioma:** español.

---

## 1. Propósito

Definir el sistema de agentes del consorcio ALRAC operado desde Hermes agent, aplicando los patrones de ECC: agentes especializados, skills componibles, guardrails, escaneo de seguridad tipo AgentShield, memoria persistente, y el ciclo de trabajo plan→test→implement→review→verify→remember→improve.

## 2. Especificación

### 2.1 Ciclo de trabajo del agente

Cada operación del agente Hermes sobre el repositorio sigue las 7 etapas de ECC:

| Etapa | Acción | Salida |
|---|---|---|
| 1. Plan | Leer specs OpenSpec y entender el alcance | Plan de cambios |
| 2. Test | Ejecutar verificaciones previas (license, type, lint, test) | Estado verde confirmado |
| 3. Implement | Editar archivos en rama de sesión | Archivos modificados |
| 4. Review | Mostrar diff al miembro; escaneo AgentShield-like | Diff aprobado o rechazado |
| 5. Verify | Ejecutar verificaciones finales tras cambios | Estado verde final |
| 6. Remember | Registrar operación en `memory/MEMORY.md` | Memoria persistente versionada |
| 7. Improve | Sugerir mejoras al flujo basado en historial | Propuestas de mejora |

### 2.2 Agentes especializados (análogos a los 71 agentes de ECC)

| Agente | Responsabilidad |
|---|---|
| Pathfinder | Alinear cambios con la visión del consorcio y roadmap ALRAC |
| Architect | Diseñar specs OpenSpec y contratos de componente |
| Developer | Implementar cambios en TypeScript/React/Zustand |
| Reviewer | Revisar diffs y aplicar guardrails |
| Security (AgentShield-like) | Escanear secretos, licencias, permisos, archivos de agente |
| Tester | Ejecutar y validar tests |
| Memory | Registrar y consultar memoria persistente |
| Orchestrator | Coordinar el ciclo completo plan→test→implement→review→verify→remember→improve |

### 2.3 Skills componibles (análogas a las 311 skills de ECC)

| Skill | Propósito |
|---|---|
| `hscsg-ecc-conventions` | Convenciones de estilo (convencional commits, español, estructura) |
| `hscsg-ecc-guardrails` | Guardrails de comportamiento (no push a `main`, confirmación destructivos) |
| `hscsg-ecc-research` | Investigación y lectura de specs antes de cambios |
| `hscsg-ecc-agent-shield` | Escaneo de seguridad (secretos, licencias incompatibles) |
| `hscsg-contributor` | Operaciones git básicas |
| `hscsg-ecc-hermes-contributor` | Operaciones git + patrones ECC integrados |

### 2.4 Guardrails (análogos a ecc-guardrails)

| Guardrail | Descripción |
|---|---|
| No push a `main` | Todos los cambios van a ramas de sesión y se abren como PR |
| Confirmación para destructivos | `git reset --hard`, `git push --force`, `rm -rf` requieren `confirmar: true` |
| Idioma español | Documentación, commits, PR y respuestas en español |
| No exponer secretos | Nunca pedir, mostrar o registrar PAT, API keys o tokens |
| License check | Ejecutar `npm run license:check` antes de commitear código nuevo |
| Rechazo de licencias failOn | GPL-3.0, AGPL-3.0, CC-BY-NC-ND-4.0, Elastic-2.0 sin aislamiento |

### 2.5 Memoria persistente

- Almacenada en `.hermes/agent/memory/MEMORY.md`, versionada con el repo.
- Inspeccionable, corregible y eliminable por cualquier miembro.
- Registra: fecha, operación, rama, archivos, commit SHA, URL del PR, notas.

### 2.6 Escaneo de seguridad (AgentShield-like)

Antes de cada commit, Hermes verifica:
- No hay secretos expuestos (API keys, tokens, contraseñas, PAT)
- No hay licencias incompatibles en código nuevo (failOn)
- Los mensajes de commit siguen convencional commits en español
- No hay push directo a `main`

### 2.7 Interfaz TypeScript (propuesta)

```ts
export interface ECCCycleStage {
  nombre: 'plan' | 'test' | 'implement' | 'review' | 'verify' | 'remember' | 'improve';
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'bloqueado';
  salida?: string;
  evidencia?: string[];
}

export interface HermesECCOperation {
  etapa: ECCCycleStage['nombre'];
  accion: string;
  archivos?: string[];
  rama?: string;
  mensaje_commit?: string;
  pr_titulo?: string;
  pr_descripcion?: string;
  confirmar_destructivo?: boolean;
  agentshield_paso?: boolean;
}

export interface HermesECCResult {
  exitoso: boolean;
  operacion: HermesECCOperation;
  etapa_completada: ECCCycleStage['nombre'];
  salida: string;
  rama?: string;
  commit_sha?: string;
  pr_url?: string;
  memoria_registrada: boolean;
}
```

### 2.8 Archivos del agente Hermes (`.hermes/agent/`)

| Archivo | Contenido |
|---|---|
| `agent.yaml` | Modelo, herramientas, skills ECC, guardrails, agentshield, ciclo |
| `SOUL.md` | Identidad del agente (primera persona) |
| `RULES.md` | Reglas de comportamiento (compatibles con ECC) |
| `DUTIES.md` | Responsabilidades (incluye AgentShield-like) |
| `memory/MEMORY.md` | Memoria persistente de operaciones |
| `tools/git-tools.yaml` | Herramientas git declarativas |
| `skills/hscsg-contributor/SKILL.md` | Skill base de contribución |
| `skills/hscsg-ecc-conventions/SKILL.md` | Convenciones ECC |
| `skills/hscsg-ecc-guardrails/SKILL.md` | Guardrails ECC |
| `skills/hscsg-ecc-research/SKILL.md` | Investigación ECC |
| `skills/hscsg-ecc-agent-shield/SKILL.md` | Escaneo seguridad |
| `workflows/contribute.yaml` | Flujo base |
| `workflows/contribute-ecc.yaml` | Flujo ciclo completo ECC |
| `workflows/review-ecc.yaml` | Flujo de revisión tipo AgentShield |
| `hooks/hooks.yaml` | Hooks de ciclo de vida |

## 3. Relación con otras specs

- `alrac-hermes-git-workflow.md`: flujo base de contribución git desde Hermes.
- `alrac-entity-core.md`: identidad canónica del nodo (análoga a SOUL.md).
- `alrac-memory-4-capas.md`: consolidación de memoria del agente.
- `alrac-scheduled-jobs.md`: trabajos programados que el agente puede ejecutar.

## 4. Licencia

Patrón reimplementado de ECC (MIT). Implementación en TS y estructura de archivos originales de hscsg-v15-OS. Conservar aviso MIT si se copia código literal.
