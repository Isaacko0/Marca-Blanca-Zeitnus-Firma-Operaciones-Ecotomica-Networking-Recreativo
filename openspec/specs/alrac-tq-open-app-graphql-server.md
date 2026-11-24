// openspec/specs/alrac-tq-open-app-graphql-server.md
// OpenSpec: Repositorio open-app-graphql-server — Servidor GraphQL con plugin system
// Para protocolos distribuidos (ssb, dat). Plugin económico (economic-sentences).
// Blobs vía ssb-serve-blobs. Planes: schema fs, GraphQL + ssb + flumedb views.
// Estado: Propuesta — TypeScript puro, sin copia de código fuente,
// sin acceso a despliegues externos, licencia no verificada.

# SPEC: alrac-tq-open-app-graphql-server
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Metadatos del repositorio https://github.com/open-app/open-app-graphql-server (docs/open-app-graphql-server_backup.md)
**Targets:** `src/core/lib/open-app-graphql-server.ts`, `src/core/state/open-app-graphql-server.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Arquitectura de servidor GraphQL con plugin system

El servidor expone una capa GraphQL sobre protocolos distribuidos. Los plugins se componen como un array pasado al constructor: `server([plugin1, plugin2, ...])`.

### 1.1 Plugins identificados

| Plugin | Protocolo/dominio | Propósito |
|--------|-------------------|-----------|
| ssb | Secure Scuttlebutt | Red social distribuida, gossip, feeds |
| dat | Dat Project / Hypercore | Sincronización de archivos distribuidos |
| economic | economic-sentences-graphql | Frases/datos económicos como esquema GraphQL |

### 1.2 Blobs

Servidos desde `localhost:7777/` mediante `ssb-serve-blobs`. Cada blob tiene un identificador de contenido (content-addressable).

### 1.3 Planes de extensibilidad (desde el README)

- Schema para tratar con `fs` (sistema de archivos)
- Plugins que incluyan no solo GraphQL schemas sino también plugins ssb y vistas flumedb

---

## 2. Interfaces técnicas

```typescript
interface Plugin {
  id: string;
  nombre: string;
  protocolo: 'ssb' | 'dat' | 'economic' | 'fs' | 'flumedb' | 'otro';
  schemaGraphQL?: string;      // definición del schema si aplica
  esEconomico: boolean;        // si es plugin de dominio económico
  registroFecha: number;
}

interface SchemaGraphQL {
  id: string;
  pluginId: string;
  tipo: 'query' | 'mutation' | 'subscription' | 'type';
  definicion: string;
  fechaRegistro: number;
}

interface Blob {
  id: string;
  identificadorContenido: string;  // content-addressable ID (sha256)
  tamano: number;                   // bytes
  origenPlugin: string;             // plugin que generó el blob
  urlServicio: string;              // ej. localhost:7777/<id>
  fechaSubida: number;
}

interface Capacidad {
  id: string;
  nombre: string;                   // ej. 'graphql_query', 'ssb_feed', 'dat_sync'
  pluginId: string;
  disponible: boolean;
}

interface EstadoServidor {
  plugins: Plugin[];
  schemas: SchemaGraphQL[];
  blobs: Blob[];
  capacidades: Capacidad[];
  puertoGraphQL: number;            // 4000 por defecto
  puertoBlobs: number;              // 7777 por defecto
  nodeVersionMinima: string;        // 'v8'
  esCodigoAbandonado: boolean;      // true si último commit > 2 años
  licenciaVerificada: boolean;      // false por defecto (no leída)
}
```

---

## 3. Funciones

### 3.1 `crearServidorGraphQL(puertoGraphQL?, puertoBlobs?): EstadoServidor`

Crea una instancia del servidor GraphQL con puertos configurables (4000 y 7777 por defecto).

### 3.2 `registrarPlugin(estado, plugin): EstadoServidor`

Registra un plugin en el servidor. Valida que el protocolo sea conocido.

### 3.3 `registrarSchema(estado, pluginId, tipo, definicion): SchemaGraphQL`

Registra un schema GraphQL asociado a un plugin.

### 3.4 `registrarBlob(estado, identificadorContenido, tamano, origenPlugin, urlServicio): Blob`

Registra un blob servido mediante ssb-serve-blobs.

### 3.5 `componerPlugins(estado, pluginIds): EstadoServidor`

Simula la composición `server([plugin1, plugin2, ...])`. Valida que todos existan.

### 3.6 `esProtocoloDistribuido(protocolo): boolean`

Valida que el protocolo sea uno de los soportados (ssb, dat, etc.).

### 3.7 `esPluginEconomico(plugin): boolean`

Detecta si un plugin es de dominio económico (ej. economic-sentences).

### 3.8 `respuestaALRAC(estado): RespuestaALRAC`

Genera la respuesta del sistema ALRAC/Zeitnus:
- `usarCodigoFuente = false` (no copiar código JS original)
- `reimplementarLogicaPura = true`
- `verificarLicenciaAntesDeUsar = true`
- `revisarSeguridadCodigoAbandonado = true`
- `mapearCapasAA LRAC = true`

---

## 4. Límites duros (boundaries.ts)

- DENY: copia de código fuente JavaScript del repositorio original (src/, example/).
- DENY: uso de código abandonado (último commit > 2 años, este repo es de 2019) sin revisión de seguridad.
- DENY: asumir compatibilidad de licencia sin leer LICENSE.
- DENY: acceder a despliegues externos (localhost:4000/7777 son ejemplos del README, no referencias de despliegue).
- DENY: inventar schemas GraphQL específicos no documentados en los metadatos.

---

## 5. Criterios de aceptación

- [ ] `crearServidorGraphQL()` crea instancia con puertos 4000/7777
- [ ] `registrarPlugin()` registra plugins ssb, dat, economic
- [ ] `registrarSchema()` registra schemas GraphQL asociados a plugins
- [ ] `registrarBlob()` registra blobs con identificador de contenido
- [ ] `componerPlugins()` valida que todos los plugins existan antes de componer
- [ ] `esProtocoloDistribuido()` valida ssb, dat y otros conocidos
- [ ] `esPluginEconomico()` detecta plugins de dominio económico
- [ ] `respuestaALRAC()` retorna todos los flags de precaución en true
- [ ] `boundaries.ts` DENY copia de código, código abandonado sin revisión, licencia no verificada
- [ ] 0 errores TypeScript nuevos

---

## 6. Vectores de prueba

```typescript
// crearServidorGraphQL
Input: { puertoGraphQL: 4000, puertoBlobs: 7777 }
Expected: servidor con puertoGraphQL=4000, puertoBlobs=7777, nodeVersionMinima='v8'
```

```typescript
// registrarPlugin
Input: servidor, { nombre: 'ssb', protocolo: 'ssb', esEconomico: false }
Expected: plugin registrado con id generado, protocolo='ssb'
```

```typescript
// registrarBlob
Input: servidor, { identificadorContenido: '&AWg5t0YSygakE2Ky9M338qoHC5p4GOqdwFvBU/6MpsY=.sha256', tamano: 1024, origenPlugin: 'ssb', urlServicio: 'localhost:7777/...' }
Expected: blob registrado con identificadorContenido, tamano, origenPlugin
```

```typescript
// esPluginEconomico
Input: { nombre: 'economic-sentences', protocolo: 'economic' }
Expected: true
Input: { nombre: 'ssb', protocolo: 'ssb' }
Expected: false
```

```typescript
// boundaries DENY
Input: copiarCodigoFuente = true → Expected: error "Copia de código fuente prohibida"
Input: codigoAbandonadoSinRevision = true → Expected: error "Código abandonado requiere revisión de seguridad"
Input: licenciaNoVerificada = true → Expected: error "Licencia no verificada, no usar"
```

---

## 7. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) para queries GraphQL |
| `znu` | 1.0.0 | Moneda anfibia para valor económico |
| `caas` | 1.0.0 | Acceso por contribución |
| `registrySystem` | 1.0.0 | Registro de plugins, schemas, blobs, capacidades |
| `boundaries` | 1.0.0 | Límites duros |

---

## 8. Referencias

- `docs/open-app-graphql-server_backup.md` — Metadatos del repositorio GitHub
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/tq.ts` — TQ unidad contable
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/caas.ts` — Comunidad como Servicio
- URL fuente: https://github.com/open-app/open-app-graphql-server
- Plugin de ejemplo: https://github.com/open-app/economic-sentences-graphql (no leído)
