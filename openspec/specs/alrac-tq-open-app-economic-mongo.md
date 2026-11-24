// openspec/specs/alrac-tq-open-app-economic-mongo.md
// OpenSpec: Repositorios economic-sentences-graphql y open-app-mongo (org open-app)
// Plugin GraphQL de dominio económico + conector ssb → MongoDB.
// Protocolo distribuido (ssb) como origen, colección documental como destino.
// Opciones: transform, gte, concurrency. Instancia pull-abortable.
// Licencia AGPL-3.0 de open-app-mongo verificada; licencia no verificada de economic-sentences-graphql.
// Estado: Propuesta — TypeScript puro, sin copia de código fuente,
// sin acceso a servidores SSB/Mongo externos, AGPL-3.0 respetada (no se copia).

# SPEC: alrac-tq-open-app-economic-mongo
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Metadatos de https://github.com/open-app/economic-sentences-graphql y https://github.com/open-app/open-app-mongo (docs/open-app-economic-mongo_backup.md)
**Targets:** `src/core/lib/open-app-economic-mongo.ts`, `src/core/state/open-app-economic-mongo.ts`, `src/core/lib/boundaries.ts` (DENY)

---

## 1. Plugin GraphQL de dominio económico (economic-sentences-graphql)

Plugin de ejemplo para open-app-graphql-server. Expone frases o datos económicos como schema GraphQL. Sirve como referencia para capas de consulta económica en ALRAC/Zeitnus.

### 1.1 Características del plugin
- Dominio económico (frases económicas, datos de valor)
- Compatible con servidor GraphQL con plugin system
- JavaScript 100%, abandonado desde 2019

---

## 2. Conector ssb → MongoDB (open-app-mongo)

Conector que une mensajes de Secure Scuttlebot (ssb) a colecciones MongoDB.

### 2.1 API del conector

```
connect(sbot, messageType[, opts])(collection)
```

- `sbot`: instancia de scuttlebot (protocolo distribuido ssb)
- `messageType`: String o Array de tipos de mensaje a conectar
- `opts.transform`: función async para transformar contenido antes de insertar (filtro si callback con null)
- `opts.gte`: timestamp opcional para empezar a recibir mensajes (default Date.now())
- `opts.concurrency`: número de inserciones concurrentes (default 1 para mantener orden)
- `collection`: objeto de colección mongo

Devuelve instancia `pull-abortable` (permite `abort([err])` para detener la conexión).

### 2.2 Flujo de datos

```
ssb mensajes → [filtro por messageType] → [transform opcional] → [inserción mongo] → colección
                                    ↑                      ↑
                              filtro gte (fecha)      concurrency control
```

---

## 3. Interfaces técnicas

```typescript
interface PluginGraphQLEconomico {
  id: string;
  nombre: string;
  schemaGraphQL: string;       // definición del schema de frases económicas
  tipoDato: 'frase_economica' | 'valor_economico' | 'sentencia_economica' | 'otro';
  compatibleConServidorGraphQL: boolean;
  fechaRegistro: number;
}

interface OpcionesConector {
  messageType: string | string[];
  transform?: (contenido: unknown, cb: (err: Error | null, resultado?: unknown) => void) => void;
  gte?: number;                // timestamp, default Date.now()
  concurrency?: number;        // default 1
}

interface ColeccionMongo {
  id: string;
  nombre: string;
  baseDatos: string;
  mensajesConectados: number;
  ultimaSincronizacion?: number;
}

interface MensajeSSB {
  id: string;
  tipo: string;
  contenido: unknown;
  timestamp: number;
  clave: string;               // content-addressable key de ssb
  procesado: boolean;
}

interface InstanciaPullAbortable {
  id: string;
  abort: (err?: Error) => void;
  estaActiva: boolean;
}

interface ConexionSSBMongo {
  id: string;
  sbotId: string;
  coleccionId: string;
  opciones: OpcionesConector;
  instanciaAbortable: InstanciaPullAbortable;
  mensajesProcesados: number;
  errores: string[];
  fechaCreacion: number;
}

interface RespuestaALRAC {
  usarCodigoFuente: boolean;
  reimplementarLogicaPura: boolean;
  verificarLicenciaAntesDeUsar: boolean;
  revisarSeguridadCodigoAbandonado: boolean;
  respetarAGPL3: boolean;
  mapearCapasAAlRAC: boolean;
}

interface EstadoEconomicoMongo {
  pluginsGraphQL: PluginGraphQLEconomico[];
  colecciones: ColeccionMongo[];
  mensajesSSB: MensajeSSB[];
  conexiones: ConexionSSBMongo[];
  instanciasAbortables: InstanciaPullAbortable[];
}
```

---

## 4. Funciones

### 4.1 `crearPluginGraphQLEconomico(nombre, schemaGraphQL, tipoDato): PluginGraphQLEconomico`

Crea un plugin GraphQL de dominio económico.

### 4.2 `crearConectorSSBMongo(sbotId, coleccionId, opciones): ConexionSSBMongo`

Crea una conexión entre scuttlebot y colección mongo. Valida opciones.

### 4.3 `conectarMensajesAColeccion(conexion): InstanciaPullAbortable`

Inicia la conexión ssb → mongo. Devuelve instancia abortable.

### 4.4 `aplicarTransform(mensaje, transform): unknown | null`

Aplica la función de transformación opcional. Retorna null si el mensaje se filtra (callback con null).

### 4.5 `filtrarPorGTE(mensaje, gte): boolean`

Filtra mensajes por timestamp (solo mensajes con timestamp >= gte).

### 4.6 `configurarConcurrency(concurrency): number`

Valida y retorna el nivel de concurrencia (default 1 para mantener orden).

### 4.7 `crearInstanciaPullAbortable(id): InstanciaPullAbortable`

Crea una instancia que permite abortar la conexión.

### 4.8 `registrarColeccion(nombre, baseDatos): ColeccionMongo`

Registra una colección Mongo de destino.

### 4.9 `respuestaALRAC(): RespuestaALRAC`

Genera la respuesta del sistema ALRAC/Zeitnus con flags de precaución.

### 4.10 `esCodigoAbandonado(fechaUltimoCommit): boolean`

Determina si el código está abandonado (> 2 años).

---

## 5. Límites duros (boundaries.ts)

- DENY: copia de código fuente JavaScript de economic-sentences-graphql (schema/, index.js).
- DENY: copia de código fuente JavaScript de open-app-mongo (src/, index.js) — licencia AGPL-3.0.
- DENY: uso de código abandonado (ambos repos de 2018-2019) sin revisión de seguridad.
- DENY: asumir compatibilidad de licencia de economic-sentences-graphql (no verificada).
- DENY: asumir cumplimiento de AGPL-3.0 de open-app-mongo sin leer el texto completo de la licencia.
- DENY: acceder a servidores SSB o MongoDB externos sin verificación.

---

## 6. Criterios de aceptación

- [ ] `crearPluginGraphQLEconomico()` crea plugin con schema, tipo de dato, compatibilidad
- [ ] `crearConectorSSBMongo()` crea conexión con opciones validadas
- [ ] `conectarMensajesAColeccion()` devuelve instancia abortable activa
- [ ] `aplicarTransform()` aplica transformación o retorna null para filtrar
- [ ] `filtrarPorGTE()` filtra por timestamp correctamente
- [ ] `configurarConcurrency()` retorna 1 por defecto (orden de mensajes)
- [ ] `registrarColeccion()` registra colección con nombre y base de datos
- [ ] `respuestaALRAC()` retorna todos los flags de precaución en true (incluyendo respetarAGPL3)
- [ ] `boundaries.ts` DENY copia de código, AGPL sin cumplir, licencia no verificada, código abandonado sin revisión
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// crearPluginGraphQLEconomico
Input: { nombre: 'economic-sentences', schemaGraphQL: 'type Sentence { text String! }', tipoDato: 'frase_economica' }
Expected: plugin creado con id, compatibleConServidorGraphQL=true
```

```typescript
// crearConectorSSBMongo
Input: { sbotId: 'sbot-01', coleccionId: 'coleccion-posts', opciones: { messageType: 'add-post', concurrency: 1 } }
Expected: conexión creada con instanciaAbortable.estaActiva=true
```

```typescript
// aplicarTransform
Input: { contenido: { texto: 'hola' }, transform: función que devuelve mayúsculas }
Expected: resultado transformado (no null)
Input: { contenido: {}, transform: función que llama cb(null) }
Expected: null (mensaje filtrado)
```

```typescript
// filtrarPorGTE
Input: { mensaje: { timestamp: 1000 }, gte: 500 }
Expected: true
Input: { mensaje: { timestamp: 100 }, gte: 500 }
Expected: false
```

```typescript
// boundaries DENY
Input: copiarCodigoFuenteEconomicSentences = true → Expected: error "Copia de código fuente prohibida"
Input: copiarCodigoFuenteOpenAppMongo = true → Expected: error "Código AGPL-3.0: copia prohibida sin cumplir licencia"
Input: licenciaNoVerificada = true → Expected: error "Licencia no verificada, no usar"
Input: codigoAbandonadoSinRevision = true → Expected: error "Código abandonado requiere revisión de seguridad"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `tq` | 1.0.0 | Unidad contable (1 kWh) para frases económicas y operaciones de DB |
| `znu` | 1.0.0 | Moneda anfibia para valor económico |
| `caas` | 1.0.0 | Acceso por contribución |
| `registrySystem` | 1.0.0 | Registro de plugins, colecciones, conexiones |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/open-app-economic-mongo_backup.md` — Metadatos de ambos repos
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/tq.ts` — TQ unidad contable
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/caas.ts` — Comunidad como Servicio
- URL fuente 1: https://github.com/open-app/economic-sentences-graphql
- URL fuente 2: https://github.com/open-app/open-app-mongo
- Licencia AGPL-3.0 de open-app-mongo: https://github.com/open-app/open-app-mongo/blob/master/LICENCE
