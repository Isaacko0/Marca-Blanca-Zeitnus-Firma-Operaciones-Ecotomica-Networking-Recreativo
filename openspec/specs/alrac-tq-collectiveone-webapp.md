// openspec/specs/alrac-tq-collectiveone-webapp.md
// OpenSpec: Repositorio CollectiveOneWebapp — Estructura de app web colectiva
// Backend (Java/Spring Boot 2.0), Frontend (Vue), db-migrations, testing.
// Gobernanza ligera: 3 contributors, 1,420 commits, 35 branches.
// Estado: Propuesta — TypeScript puro, sin copia de código fuente,
// sin acceso a www.collectiveone.org, licencia LICENSE.md por verificar.

# SPEC: alrac-tq-collectiveone-webapp
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Metadatos del repositorio https://github.com/CollectiveOne/CollectiveOneWebapp (docs/collectiveone-webapp_backup.md)
**Targets:** `src/core/lib/collectiveone-webapp.ts`, `src/core/state/collectiveone-webapp.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Estructura de capas de la aplicación

| Capa | Tecnología | Propósito en ALRAC |
|------|-----------|-------------------|
| backend | Java 44.6%, Spring Boot 2.0, TSQL 2.1% | Lógica de servidor, persistencia, unidad contable TQ |
| frontend | Vue 42.9%, JavaScript 9% | Interfaz de usuario, acceso por contribución (CaaS) |
| db-migrations | TSQL | Migraciones de esquema, registro de cambios |
| testing | frontend/ | Pruebas unitarias y de integración |

---

## 2. Metadatos de gobernanza

| Campo | Valor |
|-------|-------|
| Commits totales | 1,420 |
| Branches | 35 |
| Tags | 0 |
| Contributors | 3 (pepoospina, reverie-ss, sagarda7) |
| Último commit | 14 de junio de 2019 ("fixed bug in case member is null") |
| Stars | 15 |
| Watchers | 7 |
| Forks | 7 |
| Licencia | LICENSE.md (contenido no leído, por verificar) |
| Estado | Abandonado desde 2019 |

---

## 3. Interfaces técnicas

```typescript
interface CapaApp {
  nombre: 'backend' | 'frontend' | 'db-migrations' | 'testing';
  tecnologias: string[];
  porcentaje?: number; // % de código en el repo
}

interface Commit {
  hash: string;
  mensaje: string;
  autor: string;
  fecha: number;
  esUltimo: boolean;
}

interface Branch {
  nombre: string;
  esRamaPrincipal: boolean;
}

interface Contributor {
  nombre: string;
  usuarioGitHub: string;
  avatarUrl?: string;
}

interface LicenciaInfo {
  archivo: 'LICENSE.md';
  contenidoLeido: boolean; // siempre false en esta asimilación
  tipo?: string; // por verificar
  compatibleConALRAC: boolean; // por verificar
}

interface EstadoAppWeb {
  capas: CapaApp[];
  commits: Commit[];
  branches: Branch[];
  contributors: Contributor[];
  licencia: LicenciaInfo;
  esCodigoAbandonado: boolean; // true si último commit > 2 años
  fechaUltimoCommit: number;
}
```

---

## 4. Funciones

### 4.1 `registrarCapa(capa: Omit<CapaApp, 'porcentaje'>): CapaApp`

Registra una capa de la aplicación con sus tecnologías.

### 4.2 `registrarCommit(hash, mensaje, autor, fecha): Commit`

Registra un commit en el historial.

### 4.3 `registrarBranch(nombre, esRamaPrincipal): Branch`

Registra una branch del repositorio.

### 4.4 `registrarContributor(nombre, usuarioGitHub, avatarUrl?): Contributor`

Registra un contribuyente del proyecto.

### 4.5 `validarLicencia(contenidoLicencia?: string): LicenciaInfo`

Valida la licencia LICENSE.md. Si el contenido no se ha leído, marca `contenidoLeido = false` y `compatibleConALRAC = false` por defecto (precaución).

### 4.6 `esCodigoAbandonado(fechaUltimoCommit: number): boolean`

Determina si el código está abandonado (último commit hace más de 2 años).

### 4.7 `respuestaALRAC(estado: EstadoAppWeb): RespuestaALRAC`

Genera la respuesta del sistema ALRAC/Zeitnus ante el repositorio:
- `usarCodigoFuente = false` (no copiar código de terceros)
- `reimplementarLogicaPura = true`
- `verificarLicenciaAntesDeUsar = true`
- `revisarSeguridadCodigoAbandonado = true`
- `mapearCapasAA LRAC = true`

---

## 5. Límites duros (boundaries.ts)

- DENY: copia de código fuente Java/Vue/TSQL del repositorio original.
- DENY: uso de código abandonado (último commit > 2 años) sin revisión de seguridad.
- DENY: asumir compatibilidad de licencia sin leer LICENSE.md.
- DENY: acceso a www.collectiveone.org sin verificación.
- DENY: inventar funcionalidades específicas no documentadas en los metadatos.

---

## 6. Criterios de aceptación

- [ ] `registrarCapa()` registra 4 capas (backend, frontend, db-migrations, testing)
- [ ] `registrarCommit()` registra commits con hash, mensaje, autor, fecha
- [ ] `registrarBranch()` registra branches
- [ ] `registrarContributor()` registra 3 contributors
- [ ] `validarLicencia()` marca contenidoLeido = false si no se leyó LICENSE.md
- [ ] `esCodigoAbandonado()` retorna true para último commit de 2019
- [ ] `respuestaALRAC()` retorna todos los flags de precaución en true
- [ ] `boundaries.ts` DENY copia de código, uso de código abandonado sin revisión, licencia no verificada
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// registrarCapa
Input: { nombre: 'backend', tecnologias: ['Java', 'Spring Boot 2.0', 'TSQL'] }
Expected: capa registrada con nombre='backend', tecnologias=['Java', 'Spring Boot 2.0', 'TSQL']
```

```typescript
// esCodigoAbandonado
Input: fecha de 2019 (hace más de 2 años)
Expected: true
Input: fecha de 2026 (hace menos de 2 años)
Expected: false
```

```typescript
// validarLicencia
Input: (sin contenido de LICENSE.md)
Expected: { contenidoLeido: false, compatibleConALRAC: false }
```

```typescript
// boundaries DENY
Input: copiarCodigoFuente = true → Expected: error "Copia de código fuente prohibida"
Input: codigoAbandonadoSinRevision = true → Expected: error "Código abandonado requiere revisión de seguridad"
Input: licenciaNoVerificada = true → Expected: error "Licencia no verificada, no usar"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) |
| `znu` | 1.0.0 | Moneda anfibia |
| `caas` | 1.0.0 | Acceso por contribución |
| `registrySystem` | 1.0.0 | Registro de cambios y migraciones |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/collectiveone-webapp_backup.md` — Metadatos del repositorio GitHub
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/tq.ts` — TQ unidad contable
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/caas.ts` — Comunidad como Servicio
- URL fuente: https://github.com/CollectiveOne/CollectiveOneWebapp
- Sitio asociado: http://www.collectiveone.org/ (no verificado)
