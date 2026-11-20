// openspec/specs/alrac-tq-genesis-agent.md
// OpenSpec: Genesis AI Agent — Community Alchemy Guide (11 pasos)
// Mapas: agente AI en Telegram que guía vision holders → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 4 (Interoperabilidad) + Capa 5 (Transición Económica)

# SPEC: alrac-tq-genesis-agent
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** RegenTribe tech-stack (Genesis), docs/regen-tribe-org_backup.md
**Targets:** `src/core/lib/genesis-agent.ts`, `src/core/state/regen-tribe.ts`

---

## 1. Arquitectura del agente Genesis

Genesis es un agente AI que guía a los vision holders a través de la Community Alchemy Guide (11 pasos), captura ideas y las convierte en especificaciones de desarrollo. Opera como lógica pura; Telegram es solo un canal de entrada opcional.

**Los 11 pasos de la Community Alchemy Guide:**
01. Hone Your Community Vision
02. Recruit Your Ideal Members
03. Align on Agreements & Governance
04. Plan Business Models & Infrastructure
05. Acquire the Best Land
06. Identify Your Funding Needs
07. Strategize Your Marketing
08. Master Plan Sustainable Systems
09. Construct Physical Infrastructure
10. Activate Community Operations
11. Evaluate & Iterate

---

## 2. Especificación técnica

### 2.1 Interfaz: `AlchemyStep`

```typescript
interface AlchemyStep {
  stepNumber: number;          // 1-11
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  artifacts: string[];         // IDs de specs generadas en este paso
  completedAt?: number;
}
```

### 2.2 Interfaz: `DevelopmentSpec`

```typescript
interface DevelopmentSpec {
  id: string;
  projectId: string;
  stepOrigin: number;          // paso de la guía que generó esta spec
  title: string;
  content: string;
  raoCredentialId: string;     // procedencia de la idea
  version: number;
  createdAt: number;
}
```

### 2.3 Función: `runAlchemyStep(projectId: string, stepNumber: number, input: unknown): AlchemyStep`

- Ejecuta un paso de la Community Alchemy Guide para un proyecto.
- Valida que el paso sea 1-11 y que los pasos previos estén completos (o en progreso).
- Retorna el estado actualizado del paso.

### 2.4 Función: `captureIdea(projectId: string, idea: string, source: string): DevelopmentSpec`

- Captura una idea cruda y la convierte en una especificación de desarrollo estructurada.
- Asigna un RAO credential para trazabilidad de la idea.

### 2.5 Función: `generateDevelopmentSpec(ideaId: string): DevelopmentSpec`

- Transforma una idea capturada en una especificación completa con contenido, versión y metadatos.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-rnmd` (marco modular) | Los specs generados por Genesis alimentan los módulos hardware/humanware/economy/software |
| `alrac-tq-regen-knowledge-graph` | Las ideas y specs son nodos en el knowledge graph |
| `alrac-tq-mythogen-ame` | Los vision holders y sus afinidades alimentan el affinity mapping |
| `registrySystem.ts` | Los specs de desarrollo se registran como contribuciones (Registro 1) |
| `boundaries.ts` | DENY: agente AI autónomo sin validación humana en pasos críticos |

---

## 4. Criterios de aceptación

- [ ] `runAlchemyStep()` valida pasos 1-11 y dependencias entre pasos
- [ ] `captureIdea()` crea spec con RAO credential y versión
- [ ] `generateDevelopmentSpec()` retorna spec completo con contenido estructurado
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// runAlchemyStep
Input: projectId='barrio-001', stepNumber=1, input={vision: 'barrio regenerativo en Quintana Roo'}
Expected: step.status = 'in-progress'; step.stepNumber = 1
```

```typescript
// captureIdea
Input: projectId='barrio-001', idea='sistema de agua con swales', source='vision-holder-001'
Expected: spec.id generado; spec.raoCredentialId = 'vision-holder-001'; spec.version = 1
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core |
| `regen-knowledge-graph` | 1.0.0 | Las ideas se registran como nodos del grafo |
| `registrySystem` | 1.0.0 | Los specs son contribuciones registradas |
| `boundaries` | 1.0.0 | Límites duros (no IA autónoma sin humano) |

---

## 7. Referencias

- `docs/regen-tribe-org_backup.md` — Tech-Stack: Genesis Community AI Agent
- `docs/regen-tribe-org_integration.md` (EBD D32, D37, D42)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-20 | Propuesta inicial: agente Genesis, 11 pasos de alquimia, captura de ideas |
