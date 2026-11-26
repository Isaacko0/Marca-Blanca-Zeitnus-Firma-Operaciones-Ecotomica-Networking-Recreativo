// openspec/specs/alrac-tq-founderos.md
// OpenSpec: FounderOS — Business Command Center para Operador Único
// Departamentos IA-asistidos (comms, funnel, social, finances, agents, knowledge graph)
// Dashboard único en vivo, crons/skills/workflows, operador único con contraseña
// Demo mode + modo real, licencia MIT, stack Next.js 14 + SQLite (referencia, no copia)
// Estado: Propuesta — TypeScript puro, sin copia de código fuente,
// sin acceso a founderos.sh, licencia MIT permisiva (verificar).

# SPEC: alrac-tq-founderos
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Metadatos del repositorio https://github.com/Bennettxai/FounderOS (docs/founderos-backup.md)
**Targets:** `src/core/lib/founderos.ts`, `src/core/state/founderos.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Arquitectura del Business Command Center

Un operador único dirige su empresa como departamentos IA-asistidos desde un dashboard único en vivo.

### 1.1 Departamentos IA-asistidos

| Departamento | Función |
|--------------|---------|
| comms | Comunicaciones |
| funnel | Embudo de ventas |
| social | Redes sociales |
| finances | Finanzas |
| agents | Agentes IA |
| knowledge graph | Base de conocimiento (G-Brain / Optimal Engine) |

### 1.2 Módulos operativos

| Módulo | Función |
|--------|---------|
| crons | Tareas programadas |
| skills | Habilidades de agentes |
| workflows | Flujos de trabajo automatizados |
| deals | Oportunidades de negocio |
| campaigns | Campañas |
| drift | Detección de desviación |

### 1.3 Modos de operación

| Modo | Descripción |
|------|-------------|
| Demo | Datos de demo en primera ejecución, no escriben en data/ |
| Real | Instalación en blanco, GLADOS_DEFAULT_MODE=real |

### 1.4 Seguridad

- Operador único con contraseña establecida en Settings → Security.
- La contraseña protege páginas de app y rutas API.

---

## 2. Interfaces técnicas

```typescript
interface Departamento {
  id: string;
  nombre: 'comms' | 'funnel' | 'social' | 'finances' | 'agents' | 'knowledge_graph';
  activo: boolean;
  agentes: string[];      // IDs de agentes asignados
  tareas: string[];       // IDs de tareas pendientes
  runs: string[];         // IDs de ejecuciones
  fechaUltimaActividad: number;
}

interface Agente {
  id: string;
  departamentoId: string;
  nombre: string;
  tipo: 'comms' | 'funnel' | 'social' | 'finances' | 'agents' | 'knowledge_graph';
  estado: 'activo' | 'inactivo' | 'ocupado';
  ultimaTarea?: string;
}

interface Tarea {
  id: string;
  departamentoId: string;
  agenteId?: string;
  nombre: string;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'fallida';
  tqCosto: number;        // kWh consumidos
  fechaCreacion: number;
  fechaCompletado?: number;
}

interface Run {
  id: string;
  tareaId: string;
  estado: 'ejecutando' | 'completado' | 'fallido';
  resultado?: string;
  fechaInicio: number;
  fechaFin?: number;
}

interface Cron {
  id: string;
  nombre: string;
  expresionCron: string;
  departamentoId: string;
  activo: boolean;
  ultimaEjecucion?: number;
}

interface Skill {
  id: string;
  nombre: string;
  departamentoId: string;
  descripcion: string;
  version: string;
  activo: boolean;
}

interface Workflow {
  id: string;
  nombre: string;
  departamentoId: string;
  pasos: string[];        // IDs de tareas en secuencia
  estado: 'borrador' | 'activo' | 'pausado';
  activo: boolean;
}

interface Deal {
  id: string;
  nombre: string;
  departamentoId: string; // finances
  valor: number;
  moneda: string;         // TQ o ZNU
  estado: 'abierto' | 'cerrado_ganado' | 'cerrado_perdido';
  fechaCreacion: number;
}

interface Campaign {
  id: string;
  nombre: string;
  departamentoId: string; // social
  objetivo: string;
  estado: 'planificada' | 'activa' | 'completada';
  fechaInicio: number;
  fechaFin?: number;
}

interface Drift {
  id: string;
  departamentoId: string;
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta';
  detectadoEn: number;
  resuelto: boolean;
}

interface KnowledgeGraph {
  id: string;
  nombre: string;
  notasMarkdown: string[]; // rutas de notas importadas
  embedded: boolean;       // gbrain --no-embed o con embeddings
  ultimaActualizacion: number;
}

interface Operador {
  id: string;
  nombre: string;
  contraseñaHash: string;  // nunca almacenar en texto plano
  accesoAutorizado: boolean;
  fechaUltimoAcceso?: number;
}

interface Dashboard {
  id: string;
  operadorId: string;
  departamentos: string[]; // IDs de departamentos visibles
  widgets: string[];       // IDs de widgets activos
  modo: 'demo' | 'real';
  fechaCreacion: number;
}

interface EstadoFounderos {
  departamentos: Departamento[];
  agentes: Agente[];
  tareas: Tarea[];
  runs: Run[];
  crons: Cron[];
  skills: Skill[];
  workflows: Workflow[];
  deals: Deal[];
  campaigns: Campaign[];
  drifts: Drift[];
  knowledgeGraphs: KnowledgeGraph[];
  operador: Operador | null;
  dashboard: Dashboard | null;
}
```

---

## 3. Funciones

### 3.1 `crearCommandCenter(operadorNombre, contraseña, modo): EstadoFounderos`

Crea una instancia del command center con un operador único y contraseña.

### 3.2 `registrarDepartamento(estado, nombre): Departamento`

Registra un nuevo departamento IA-asistido.

### 3.3 `crearAgente(estado, departamentoId, nombre, tipo): Agente`

Crea un agente asignado a un departamento.

### 3.4 `registrarTarea(estado, departamentoId, nombre, tqCosto): Tarea`

Registra una tarea con su costo en TQ (unidad contable).

### 3.5 `ejecutarRun(estado, tareaId): Run`

Ejecuta una tarea y registra el run con resultado.

### 3.6 `registrarCron(estado, nombre, expresionCron, departamentoId): Cron`

Registra una tarea programada.

### 3.7 `registrarSkill(estado, nombre, departamentoId, descripcion, version): Skill`

Registra una habilidad de agente.

### 3.8 `registrarWorkflow(estado, nombre, departamentoId, pasos): Workflow`

Registra un flujo de trabajo con secuencia de tareas.

### 3.9 `activarModoDemo(estado): Dashboard`

Activa el modo demo (datos de demo, no escriben en data/).

### 3.10 `activarModoReal(estado): Dashboard`

Activa el modo real (instalación en blanco).

### 3.11 `setearContrasenaOperador(operador, contraseña): Operador`

Establece la contraseña del operador (hash, nunca texto plano).

### 3.12 `esAccesoAutorizado(operador, contraseña): boolean`

Verifica si el operador tiene acceso autorizado.

### 3.13 `esModoDemo(dashboard): boolean`

Verifica si el dashboard está en modo demo.

---

## 4. Integración con specs ALRAC existentes

| Spec ALRAC | Punto de integración |
|------------|---------------------|
| TQ (Capa 1) | Unidad contable para operaciones de departamentos (tqCosto en tareas) |
| ZNU (Capa 3) | Moneda anfibia para deals y valor económico del negocio |
| CaaS | Acceso por contribución, operador único como servicio |
| registrySystem | Registro de departamentos, skills, workflows |
| boundaries | DENY: copia de código fuente, acceso sin contraseña de operador |
| regenerative-agent | Knowledge graph, agentes IA-asistidos |
| currentSeeSystem | Dashboard en vivo, trazabilidad de operaciones |

---

## 5. Límites Duros (boundaries.ts)

- DENY: copia de código fuente Next.js/TypeScript de FounderOS (app/, components/, founderos/, etc.).
- DENY: acceso a páginas de app o rutas API sin contraseña de operador válida.
- DENY: asumir compatibilidad con GladOS/G-Brain sin verificación.
- DENY: acceso a founderos.sh sin verificación.

---

## 6. Criterios de aceptación

- [ ] `crearCommandCenter()` crea command center con operador y contraseña
- [ ] `registrarDepartamento()` registra 6 departamentos (comms, funnel, social, finances, agents, knowledge_graph)
- [ ] `crearAgente()` crea agente asignado a departamento
- [ ] `registrarTarea()` registra tarea con tqCosto en kWh
- [ ] `ejecutarRun()` ejecuta tarea y registra run
- [ ] `registrarCron()`, `registrarSkill()`, `registrarWorkflow()` registran módulos operativos
- [ ] `activarModoDemo()` y `activarModoReal()` cambian modo del dashboard
- [ ] `setearContrasenaOperador()` y `esAccesoAutorizado()` gestionan acceso del operador
- [ ] `boundaries.ts` DENY: copia de código, acceso sin contraseña
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// crearCommandCenter
Input: { operadorNombre: 'Ana', contraseña: 'segura123', modo: 'demo' }
Expected: command center con operador, dashboard en modo demo, departamentos vacíos
```

```typescript
// registrarDepartamento
Input: { nombre: 'comms' }
Expected: departamento creado con nombre='comms', activo=true
```

```typescript
// registrarTarea
Input: { departamentoId: 'dep-01', nombre: 'enviar email', tqCosto: 5 }
Expected: tarea creada con tqCosto=5, estado='pendiente'
```

```typescript
// esAccesoAutorizado
Input: { operador: { contraseñaHash: 'hash123' }, contraseña: 'segura123' }
Expected: true (si el hash coincide)
Input: { contraseña: 'incorrecta' }
Expected: false
```

```typescript
// boundaries DENY
Input: copiarCodigoFuente = true → Expected: error "Copia de código fuente prohibida"
Input: accesoSinContrasena = true → Expected: error "Acceso sin contraseña de operador prohibido"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) para operaciones de departamentos |
| `znu` | 1.0.0 | Moneda anfibia para valor económico (deals) |
| `caas` | 1.0.0 | Acceso por contribución, operador único |
| `registrySystem` | 1.0.0 | Registro de departamentos, skills, workflows |
| `regenerative-agent` | 1.0.0 | Knowledge graph, agentes IA-asistidos |
| `currentSeeSystem` | 1.0.0 | Dashboard en vivo, corrientes unificadas |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/founderos-backup.md` — Metadatos del repositorio GitHub
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/tq.ts` — TQ unidad contable
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/regenerative-agent.ts` — Agentes regenerativos, knowledge graph
- `src/core/lib/currentSeeSystem.ts` — Corrientes unificadas
- URL fuente: https://github.com/Bennettxai/FounderOS
- Sitio asociado: https://founderos.sh/ (no verificado)
- Licencia MIT: https://github.com/Bennettxai/FounderOS/blob/main/LICENSE
