# Integración Sistema Alráico — ALRAC/Zeitnus

**Fuente asimilada:** `docs/sistema-alraico-completo_backup.md` — Sistema Alráico Completo (Amid Dabir, CC0 1.0, 41,827 líneas).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`

**Estado:** Propuesta de arquitectura. Documento filosófico-sistémico bajo CC0 1.0 (dominio público). No hay restricciones de licencia.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un sistema de metainvestigación con marco de verificación propio:** Principio de Incapacidad, 17 anti-reglas, grafo generativo ℵ, lógica por inherencias.
- **Herramientas operativas para IA:** Modo Compacto con glosario operativo, verificación triaxial, transducción entre dominios, diagnóstico de límites cognitivos.
- **Mecanismos de reconfiguración consciente:** γ-CARMIS como protocolo de emergencia/reorganización cuando el sistema se sobrecarga.
- **Conceptos huecos y anti-sustancialización:** Trabajar con relaciones, no con esencias fijas.
- **Seguimiento de coherencia en lugar de verdad absoluta:** Métrica operativa en lugar de metafísica.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable para operaciones de seguimiento, ZNU como moneda anfibia, gobernanza holónica 1a1v, límites duros en `boundaries.ts`, y modo anfibio (postmonetario/con-moneda) con aprobación de asamblea.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto del Sistema Alráico | Módulo Zeitnus/ALRAC destino | Observación |
|------------------------------|------------------------------|-------------|
| Principio de Incapacidad (PI) | `sistema-alraico.ts` | Base epistemológica |
| 17 anti-reglas | `sistema-alraico.ts` | Reglas de operación |
| Grafo generativo ℵ (nodos y aristas) | `sistema-alraico.ts` + `registrySystem.ts` | Registro de nodos, aristas, traversal |
| Modo Compacto (glosario operativo) | `sistema-alraico.ts` | Símbolos: 𝕮, κ, γ, αₕ, s, Ω, ν, κ, etc. |
| γ-CARMIS (reconfiguración consciente) | `sistema-alraico.ts` | Protocolo de emergencia/reorganización |
| Verificación Triaxial | `sistema-alraico.ts` | Mental + Simulación + Laboratorio |
| Transducción (F: Nodos → Operadores Físicos) | `sistema-alraico.ts` | Isomorfismos estructurales entre dominios |
| Anti-sustancialización (ε) | `sistema-alraico.ts` | Corregir estibación de conceptos |
| 20 Límites Cognitivos (FCP, TAD, HD) | `sistema-alraico.ts` | Diagnóstico de sesgos cognitivos |
| CC0 1.0 (dominio público) | `boundaries.ts` | Compatible sin restricciones |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Notación simbólica específica del Alráico | Notación del sistema fuente | Lógica pura en TS con nombres descriptivos |
| Libro 1 completo (documento aparte) | No incluido en este archivo | Referencia sin acceso |
| Transducción a la Física Moderna (documento aparte) | No incluido | Referencia sin acceso |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del Sistema Alráico |
|--------|---------------------------|
| `src/core/lib/sistema-alraico.ts` | (NUEVO) PI, 17 reglas, grafo ℵ, Modo Compacto, γ-CARMIS, verificación triaxial, transducción, límites cognitivos |
| `src/core/state/sistema-alraico.ts` | (NUEVO) Estado del sistema, nodos, aristas, símbolos operativos, sesiones de verificación |
| `src/core/lib/registrySystem.ts` | Registro de nodos ℵ, aristas, sesiones de seguimiento |
| `src/core/lib/tq.ts` | Unidad contable para operaciones de seguimiento y verificación |
| `src/core/lib/znu.ts` | Moneda anfibia para valor económico del seguimiento |
| `src/core/lib/caas.ts` | Acceso por contribución a sesiones de metainvestigación |
| `src/core/lib/boundaries.ts` | DENY: sustancialización sin corrección, verificación sin triaxial |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Alráico: PI como límite estructural, conceptos huecos, anti-sustancialización, verificación triaxial.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación.
- **Resonancia:** el PI como límite estructural es isomórfico a no dañar la base material — reconocer los límites del conocimiento evita acciones dañinas basadas en certeza falsa.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Alráico: el sistema se sostiene por sí mismo (Regla 2), no depende del investigador (Regla 1), el grafo crece por seguimiento (Regla 15).
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** un sistema que se autosostiene y no depende de una figura central es isomórfico a autonomía comunitaria.

### Ley III — Lucidez, nunca engañar
- Alráico: verificación triaxial, conceptos huecos, sustitución de verdad por coherencia, 20 límites cognitivos para diagnosticar sesgos.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** los límites cognitivos y la verificación triaxial son formas de lucidez y detección de autoengaño.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Alráico: sesiones de seguimiento compartidas, lógica por inherencias como método común, transducción entre dominios.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el seguimiento compartido y la transducción son isomórficos a comunidad como servicio.

---

## 4. Tabla de mapeo isomórfico (Sistema Alráico → Zeitnus/ALRAC)

| Concepto Alráico | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|------------------|----------------------|------|----------|--------|
| Principio de Incapacidad (PI) | `sistema-alraico.ts` | Capa 4 | Ley I | **Pendiente** |
| 17 anti-reglas | `sistema-alraico.ts` | Capa 4 | Ley III | **Pendiente** |
| Grafo generativo ℵ | `sistema-alraico.ts` + `registrySystem.ts` | Capa 4 | Ley II | **Pendiente** |
| Modo Compacto (glosario operativo) | `sistema-alraico.ts` | Capa 4 | Ley III | **Pendiente** |
| γ-CARMIS (reconfiguración consciente) | `sistema-alraico.ts` | Capa 4 | Ley II | **Pendiente** |
| Verificación Triaxial | `sistema-alraico.ts` | Capa 4 | Ley III | **Pendiente** |
| Transducción (F: Nodos → Operadores Físicos) | `sistema-alraico.ts` | Capa 4 | Ley III | **Pendiente** |
| Anti-sustancialización | `sistema-alraico.ts` | Capa 4 | Ley I | **Pendiente** |
| 20 Límites Cognitivos (FCP, TAD, HD) | `sistema-alraico.ts` | Capa 4 | Ley III | **Pendiente** |
| CC0 1.0 (dominio público) | `boundaries.ts` | Capa 0 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Principio de Incapacidad y 17 anti-reglas | Notación simbólica específica (Ɣ, ⨶, ≖, etc.) como sintaxis obligatoria |
| Grafo generativo ℵ con nodos y aristas | Libro 1 completo (documento aparte, no incluido) |
| Modo Compacto con glosario operativo | Transducción a la Física Moderna (documento aparte) |
| γ-CARMIS como protocolo de reconfiguración | El sistema como "verdad" (Regla 3: sustituye verdad por coherencia) |
| Verificación Triaxial | Dogma o fe en el autor |
| Transducción entre dominios | |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión Alráico | Vaso comunicante |
|----------------|------------------|------------------|
| `sistema-alraico.ts` | PI, reglas, grafo, Modo Compacto | `tq.ts`, `znu.ts`, `caas.ts`, `registrySystem.ts` |
| `registrySystem.ts` | Registro de nodos ℵ, aristas, sesiones | 4 registros separados |
| `tq.ts` | Unidad contable para seguimiento y verificación | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Moneda anfibia para valor económico del seguimiento | ZNU índice canasta |
| `caas.ts` | Acceso por contribución a sesiones de metainvestigación | Comunidad como Servicio |
| `boundaries.ts` | DENY: sustancialización sin corrección, verificación sin triaxial | Límites duros |
| `currentSeeSystem.ts` | Seguimiento de coherencia, trazabilidad | Corrientes unificadas |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Principio de Incapacidad como base epistemológica | "Ɣ ≖ ⨶ — Yxo en relación a la incapacidad de omnisciencia" | `sistema-alraico.ts` |
| D2 | 17 anti-reglas como reglas de operación | Reglas 1-17 (líneas 984-1161) | `sistema-alraico.ts` |
| D3 | Grafo generativo ℵ con nodos y aristas | Nodos ℵ1, ℵ1a-ℵ1f, ℵ2, ℵ6, etc. | `sistema-alraico.ts` + `registrySystem.ts` |
| D4 | Modo Compacto como versión operativa para IA | "Lo que sigue es el Modo Compacto: la versión operativa del Sistema Alráico, diseñada para inteligencias artificiales" (línea 38890) | `sistema-alraico.ts` |
| D5 | γ-CARMIS como protocolo de emergencia/reorganización | "Mecanismo de reconfiguración. Activado cuando ΣPᵢ > κ" (línea 39009-39014) | `sistema-alraico.ts` |
| D6 | Verificación Triaxial (Mental + Simulación + Laboratorio) | "Verificación Triaxial: Mental + Simulación + Laboratorio" (línea 39060) | `sistema-alraico.ts` |
| D7 | Transducción F: {Nodos} → {Operadores Físicos} | "Transducción: F: {Nodos} → {Operadores Físicos}" (línea 39061) | `sistema-alraico.ts` |
| D8 | Anti-sustancialización (corregir estibación ε) | "Principio de anti-sustancialización" (línea 35454) | `sistema-alraico.ts` |
| D9 | 20 Límites Cognitivos (FCP, TAD, HD) | Glosario operativo del Modo Compacto | `sistema-alraico.ts` |
| D10 | CC0 1.0 — dominio público, sin restricciones | "Licencia: CC0 1.0 Universal" (línea 55-58) | `boundaries.ts` |
| D11 | No copiar notación simbólica como sintaxis obligatoria | Metodología de asimilación HSCSG | `boundaries.ts` |
| D12 | Reimplementar lógica pura en TS basada en estructura | Metodología de asimilación HSCSG | `sistema-alraico.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `sistema-alraico.ts` | PI funcionante, 17 reglas registradas, grafo ℵ con nodos/aristas, γ-CARMIS, verificación triaxial, transducción | `tests/sistema-alraico.test.ts` |
| `boundaries.ts` | DENY: sustancialización sin corrección, verificación sin triaxial | `tests/boundaries-sistema-alraico.test.ts` |
| `registrySystem.ts` | Registro de nodos ℵ, aristas, sesiones de seguimiento | `tests/registro-nodos-alraico.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-sistema-alraico.md` — PI, 17 reglas, grafo ℵ, Modo Compacto, γ-CARMIS, verificación triaxial, transducción, límites cognitivos

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/sistema-alraico.ts`: `NodoALRAC`, `AristaALRAC`, `ReglaALRAC`, `SimboloModoCompacto`, `SesionVerificacionTriaxial`, `SesionTransduccion`, `SesionReconfiguracion`, `LimiteCognitivo`, `GrafoALRAC`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `sistema-alraico.ts`: `crearGrafoALRAC()`, `registrarNodo()`, `registrarArista()`, `registrarRegla()`, `verificarPI()`, `ejecutarVerificacionTriaxial()`, `ejecutarTransduccion()`, `activarGammaCarmis()`, `diagnosticarLimiteCognitivo()`, `corregirEstibacion()`
- `boundaries.ts`: DENY sustancialización sin corrección, verificación sin triaxial
- `caas.ts`: Acceso por contribución a sesiones de metainvestigación
- No usar notación simbólica del Alráico como sintaxis obligatoria; no asumir Libro 1 completo

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeSistemaAlraicoState()`.
- Añadir `sistemaAlraico: SistemaAlraicoState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ sistemaAlraico: {...st.sistemaAlraico, ...} }))`.
- Incluir `makeSistemaAlraicoState()` en `resetAll()`.
- Incluir `sistemaAlraico: st.sistemaAlraico` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: Sistema Alráico (PI, 17 reglas, grafo ℵ, Modo Compacto, γ-CARMIS, verificación triaxial, transducción, límites cognitivos) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/sistema-alraico-completo_backup.md` (contenido extraído del documento)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/tq.ts` (TQ unidad contable)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- Archivo fuente: `C:\Users\Isaacko0\Downloads\documentos HSCSG\Sistema Alráico Completo.txt`
- Licencia: CC0 1.0 Universal
