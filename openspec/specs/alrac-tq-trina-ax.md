// openspec/specs/alrac-tq-trina-ax.md
// OpenSpec: trina-ax — Self-hosted Claude Code/Codex para equipos de empresa
// Estado: Propuesta — TypeScript puro, sin copia de código fuente,
// sin acceso al repositorio interno, licencia AGPL-3.0-only (verificar)

# SPEC: alrac-tq-trina-ax
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Metadatos del repositorio https://github.com/trina-app/trina-ax (docs/trina-ax_backup.md)
**Targets:** `src/core/lib/trina-ax.ts`, `src/core/state/trina-ax.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Arquitectura del Sistema de IA para Equipos

Un entorno auto-hospedado de Claude Code y Codex para equipos de empresa con habilidades compartidas, MCP, sesiones compartidas y permisos granulares.

### 1.1 Habilidades de equipo (team skills)

| Característica | Descripción |
|----------------|-------------|
| Compartidas | Habilidades disponibles para todo el equipo |
| Matriz antes/después | Documentación visual de mejoras (ej. ui-polish) |
| Por idioma | Soporte para múltiples idiomas (6+) |

### 1.2 MCP (Model Context Protocol)

| Característica | Descripción |
|----------------|-------------|
| Servidores MCP | Conexión de herramientas y datos externos |
| Sesiones con contexto | MCP integrado en sesiones de IA |

### 1.3 Sesiones de IA compartidas

| Característica | Descripción |
|----------------|-------------|
| Compartidas | Múltiples personas en la misma sesión |
| Por persona | Permisos granulares por usuario |

### 1.4 Permisos por carpeta de persona

| Característica | Descripción |
|----------------|-------------|
| Granularidad | Por carpeta y por persona |
| Control de acceso | Quién puede leer/escribir cada carpeta |

### 1.5 Despliegue autónomo

| Característica | Descripción |
|----------------|-------------|
| Docker | Contenedores para despliegue |
| CloudFormation | Infraestructura como código |
| SES inbound | Mailbox vía Amazon SES |

### 1.6 Gestión de documentos

| Característica | Descripción |
|----------------|-------------|
| Document management | Gestión de archivos en entorno IA |
| HWP | Soporte para formato de documento coreano |

---

## 2. Interfaces técnicas

```typescript
interface SkillEquipo {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'ui-polish' | 'document-management' | 'mcp' | 'otro';
  idioma: string;           // ko, en, ja, etc.
  matrizAntesDespues: boolean; // matriz antes/después documentada
  activo: boolean;
  fechaCreacion: number;
  fechaUltimaActualizacion: number;
}

interface ServidorMCP {
  id: string;
  nombre: string;
  url: string;
  tipo: 'filesystem' | 'github' | 'ses' | 'otro';
  activo: boolean;
  sesionesConectadas: string[]; // IDs de sesiones
  fechaRegistro: number;
}

interface SesionIA {
  id: string;
  nombre: string;
  tipo: 'individual' | 'compartida';
  participantes: string[]; // IDs de usuarios
  skillIds: string[];      // Skills activas en la sesión
  mcpServerIds: string[];  // Servidores MCP conectados
  estado: 'activa' | 'pausada' | 'finalizada';
  fechaInicio: number;
  fechaFin?: number;
  tqCosto: number;         // kWh consumidos (unidad contable TQ)
}

interface PermisoCarpeta {
  id: string;
  carpeta: string;
  usuarioId: string;
  permiso: 'leer' | 'escribir' | 'administrar';
  otorgadoPor: string;
  fechaOtorgamiento: number;
}

interface Documento {
  id: string;
  nombre: string;
  carpeta: string;
  tipo: 'texto' | 'hwp' | 'markdown' | 'otro';
  contenidoHash: string;   // hash del contenido
  propietarioId: string;
  fechaCreacion: number;
  fechaModificacion: number;
}

interface Despliegue {
  id: string;
  tipo: 'docker' | 'cloudformation' | 'ses';
  nombre: string;
  estado: 'planificado' | 'en_progreso' | 'completado' | 'fallido';
  fechaInicio: number;
  fechaFin?: number;
}

interface SesionCompartida {
  id: string;
  sesionId: string;
  anfitrionId: string;
  invitados: string[];     // IDs de usuarios invitados
  permisos: Map<string, 'leer' | 'escribir'>; // usuario → permiso
  activa: boolean;
}

interface EstadoTrinaAx {
  skillsEquipo: SkillEquipo[];
  servidoresMCP: ServidorMCP[];
  sesionesIA: SesionIA[];
  permisosCarpeta: PermisoCarpeta[];
  documentos: Documento[];
  despliegues: Despliegue[];
  sesionesCompartidas: SesionCompartida[];
}
```

---

## 3. Funciones

### 3.1 `crearSistemaIAEquipo(nombreEquipo): EstadoTrinaAx`

Crea una instancia del sistema de IA auto-hospedado para un equipo.

### 3.2 `registrarSkillEquipo(estado, nombre, tipo, idioma, matrizAntesDespues): SkillEquipo`

Registra una habilidad de equipo compartida.

### 3.3 `registrarServidorMCP(estado, nombre, url, tipo): ServidorMCP`

Registra un servidor MCP para conexión de herramientas externas.

### 3.4 `crearSesionIA(estado, nombre, tipo, participantes): SesionIA`

Crea una sesión de IA (individual o compartida).

### 3.5 `compartirSesion(estado, sesionId, anfitrionId, invitados): SesionCompartida`

Comparte una sesión de IA con otros usuarios.

### 3.6 `establecerPermisoCarpeta(estado, carpeta, usuarioId, permiso): PermisoCarpeta`

Establece un permiso granular sobre una carpeta para un usuario.

### 3.7 `gestionarDocumento(estado, nombre, carpeta, tipo, propietarioId): Documento`

Gestiona un documento en el entorno de IA.

### 3.8 `desplegarDocker(estado, nombre): Despliegue`

Despliega un contenedor Docker para el sistema de IA.

### 3.9 `activarI18n(estado, idiomas: string[]): void`

Activa soporte para múltiples idiomas.

---

## 4. Integración con specs ALRAC existentes

| Spec ALRAC | Punto de integración |
|------------|---------------------|
| TQ (Capa 1) | Unidad contable para sesiones de IA (tqCosto) |
| ZNU (Capa 3) | Moneda anfibia para valor económico de sesiones IA |
| CaaS | Acceso por contribución a sesiones compartidas |
| registrySystem | Registro de skills de equipo, MCP servers, sesiones |
| boundaries | DENY: copia de código AGPL-3.0, acceso sin permisos de carpeta |
| currentSeeSystem | Sesiones de IA compartidas, trazabilidad |

---

## 5. Límites Duros (boundaries.ts)

- DENY: copia de código fuente TypeScript/Go de trina-ax bajo licencia AGPL-3.0-only.
- DENY: acceso a carpetas sin permiso explícito de la persona.
- DENY: asumir compatibilidad con protocolo cloud específico sin verificación MIT.
- DENY: despliegue sin evaluación de dependencia externa (Emma Goldman Test).

---

## 6. Criterios de aceptación

- [ ] `crearSistemaIAEquipo()` crea sistema con equipo vacío
- [ ] `registrarSkillEquipo()` registra skill con matriz antes/después
- [ ] `registrarServidorMCP()` registra servidor MCP activo
- [ ] `crearSesionIA()` crea sesión individual o compartida
- [ ] `compartirSesion()` comparte sesión con invitados y permisos
- [ ] `establecerPermisoCarpeta()` establece permiso granular por carpeta
- [ ] `gestionarDocumento()` gestiona documento con hash de contenido
- [ ] `desplegarDocker()` registra despliegue Docker
- [ ] `activarI18n()` activa idiomas soportados
- [ ] `boundaries.ts` DENY: copia de código AGPL-3.0, acceso sin permisos
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// crearSistemaIAEquipo
Input: { nombreEquipo: 'Equipo Alpha' }
Expected: sistema con equipo vacío, skills vacías, sesiones vacías
```

```typescript
// registrarSkillEquipo
Input: { nombre: 'ui-polish', tipo: 'ui-polish', idioma: 'ko', matrizAntesDespues: true }
Expected: skill creada con matrizAntesDespues=true, activo=true
```

```typescript
// establecerPermisoCarpeta
Input: { carpeta: '/documentos/finanzas', usuarioId: 'user-01', permiso: 'leer' }
Expected: permiso creado con tipo='leer', carpeta='/documentos/finanzas'
```

```typescript
// boundaries DENY
Input: copiarCodigoAGPL3 = true → Expected: error "Copia de código AGPL-3.0 prohibida"
Input: accesoSinPermisoCarpeta = true → Expected: error "Acceso sin permiso de carpeta prohibido"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) para sesiones de IA |
| `znu` | 1.0.0 | Moneda anfibia para valor económico (sesiones) |
| `caas` | 1.0.0 | Acceso por contribución, sesiones compartidas |
| `registrySystem` | 1.0.0 | Registro de skills, MCP, sesiones |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/trina-ax_backup.md` — Metadatos del repositorio GitHub
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/tq.ts` — TQ unidad contable
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/currentSeeSystem.ts` — Corrientes unificadas
- URL fuente: https://github.com/trina-app/trina-ax
- Sitio asociado: https://ax.trina.app/
- Licencia AGPL-3.0-only: https://github.com/trina-app/trina-ax/blob/main/LICENSE
- Protocolo cloud MIT: https://github.com/trina-app/trina-ax/blob/main/shared/src/cloud-protocol/LICENSE
