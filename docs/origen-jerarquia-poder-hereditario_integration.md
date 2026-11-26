# Integración Origen de la Jerarquía, Poder Hereditario y Acumulación sin Aporte Productivo — ALRAC/Zeitnus

**Fuente asimilada:** `docs/origen-jerarquia-poder-hereditario_backup.md` — Ensayo analítico sobre el origen antropológico de la jerarquía rígida, la monarquía hereditaria y la acumulación de riqueza sin aporte productivo, contrastando biología evolutiva con construcción social del poder.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El texto es un aporte del usuario (no documento de terceros con derechos de autor externos identificados). Conecta directamente con los límites duros de `boundaries.ts` contra acumulación sin aporte productivo, con el principio de no extraer valor sin contribución, con CaaS (acceso por contribución, no por posición), con TQ/ZNU como unidades contables que no premian la posición sanguínea, y con la gobernanza holónica 1a1v como alternativa a la pirámide de poder.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un marco arquitectónico que rechace la acumulación de riqueza sin aporte productivo** como principio de diseño del sistema ALRAC/Zeitnus.
- **Una alternativa a la pirámide de poder:** gobernanza holónica 1a1v, no jerarquía hereditaria ni mandato divino.
- **Separar el aporte a la sociedad de la acumulación de riqueza:** el sistema debe premiar contribución real, no proximidad sanguínea al centro del poder.
- **Límites duros contra el "líder que no aporta y solo exige":** el sistema debe poder identificar y bloquear la extracción de valor sin contribución.
- **Evidencia científica como base de diseño:** usar hallazgos de paleontología, antropología, genética y arqueología para fundamentar decisiones de arquitectura del sistema (no como decoración retórica).
- **El concepto de "jerarquía de dominancia inversa" de Christopher Boehm** como modelo de gobernanza: el grupo suprime activamente a quien intenta acumular poder o recursos sin aportar.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto del texto | Módulo Zeitnus/ALRAC destino | Observación |
|--------------------|------------------------------|-------------|
| Jerarquía de dominancia inversa (Boehm): el grupo suprime a quien acumula poder sin aportar | `gobernanza-egalitaria.ts` + `boundaries.ts` | Mecanismo de supresión de acumulación sin contribución |
| Revolución Neolítica: excedente agrícola → almacenamiento → acumulación sin trabajo | `excedente-acumulacion.ts` | Detección de excedente no asociado a trabajo productivo |
| Desconexión entre "aporte a la sociedad" y "acumulación de riqueza" | `contribucion-vs-acumulacion.ts` | Separación estricta de mérito y recompensa |
| Cuello de Botella del Cromosoma Y: monopolio de reproducción y riqueza por linaje | `linaje-poder-hereditario.ts` | Rechazo de transmisión de poder por sangre |
| Tumba de Varna (~4500 a.C.): desigualdad institucionalizada y hereditaria | `desigualdad-institucionalizada.ts` | Detección de acumulación por estatus, no por mérito |
| Escritura/contabilidad en Sumeria y Egipto: registro de deudas a templos/palacios | `contabilidad-poder.ts` | Trazabilidad de quién debe qué a quién |
| Código de Hammurabi: leyes que protegen a la elite, no igualdad | `leyes-clase-social.ts` | Rechazo de normas que institucionalizan desigualdad |
| Mandato divino: naturalizar la desigualdad mediante narrativa religiosa | `narrativa-poder.ts` | Rechazo de justificaciones ideológicas del poder sin aporte |
| Consecuencias: desnutrición de súbditos vs salud de élite, desvinculación mérito-recompensa | `consecuencias-jerarquia.ts` | Métricas de impacto de la desigualdad en el sistema |
| Conclusión: poder monárquico = tecnología social de control de recursos (5.000-6.000 años) | `tecnologia-social-control.ts` | Marco de diseño antijerárquico |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Jerarquía rígida como modelo de gobernanza | El texto la rechaza explícitamente como "invención cultural reciente" | Gobernanza holónica 1a1v, jerarquía de dominancia inversa |
| Acumulación de riqueza sin aporte productivo | El texto la identifica como el problema central | Límites duros en `boundaries.ts` contra extracción sin contribución |
| Poder hereditario por linaje sanguíneo | El texto lo documenta como invención cultural, no biológica | Acceso por contribución real (CaaS), no por posición sanguínea |
| Mandato divino como justificación del poder | El texto lo documenta como tecnología ideológica | Transparencia y trazabilidad (RAO, Modo Lucidez) |
| Ley que protege a la elite (Código de Hammurabi) | El texto la documenta como desigualdad institucionalizada | Leyes neutrales, iguales para todas las clases |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del texto |
|--------|-----------------|
| `src/core/lib/gobernanza-egalitaria.ts` | (NUEVO) Jerarquía de dominancia inversa, supresión de acumulación sin aporte |
| `src/core/state/gobernanza-egalitaria.ts` | (NUEVO) Estado de gobernanza igualitaria, mecanismos de supresión |
| `src/core/lib/excedente-acumulacion.ts` | (NUEVO) Detección de excedente no asociado a trabajo productivo |
| `src/core/lib/contribucion-vs-acumulacion.ts` | (NUEVO) Separación de mérito y recompensa |
| `src/core/lib/linaje-poder-hereditario.ts` | (NUEVO) Rechazo de transmisión de poder por sangre |
| `src/core/lib/desigualdad-institucionalizada.ts` | (NUEVO) Detección de acumulación por estatus |
| `src/core/lib/contabilidad-poder.ts` | (NUEVO) Trazabilidad de deudas a templos/palacios (quién debe qué a quién) |
| `src/core/lib/leyes-clase-social.ts` | (NUEVO) Rechazo de normas que institucionalizan desigualdad |
| `src/core/lib/narrativa-poder.ts` | (NUEVO) Rechazo de justificaciones ideológicas del poder sin aporte |
| `src/core/lib/consecuencias-jerarquia.ts` | (NUEVO) Métricas de impacto de la desigualdad |
| `src/core/lib/tecnologia-social-control.ts` | (NUEVO) Marco de diseño antijerárquico |
| `src/core/lib/boundaries.ts` | DENY: acumulación sin aporte, poder hereditario, mandato divino, leyes de clase |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Texto: el "líder que no aporta y solo exige" daña al grupo; la acumulación sin aporte daña la base material de la comunidad.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** bloquear la acumulación sin aporte productivo es una forma de no dañar la base material.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Texto: durante el 95% de la historia humana, las bandas igualitarias vivían de intercambio y cooperación; acumular era imposible y contraproducente.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS, gobernanza 1a1v.
- **Resonancia:** el acceso por contribución real es isomórfico a las bandas igualitarias donde no se acumulaba sin aportar.

### Ley III — Lucidez, nunca engañar
- Texto: el mandato divino naturaliza la desigualdad mediante narrativa religiosa; es una "tecnología ideológica".
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, transparencia y trazabilidad.
- **Resonancia:** desenmascarar las narrativas que justifican el poder sin aporte es una forma de lucidez.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Texto: el excedente agrícola permitió que algunos dejaran de trabajar y vivieran del trabajo de otros; eso es lo que se debe evitar.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; acceso universal a servicios básicos sin depender de posición sanguínea.
- **Resonancia:** el acceso por contribución real, no por herencia ni mandato, es isomórfico a las bandas cazadoras-recolectoras igualitarias.

---

## 4. Tabla de mapeo isomórfico (texto → Zeitnus/ALRAC)

| Concepto del texto | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|--------------------|----------------------|------|----------|--------|
| Jerarquía de dominancia inversa (Boehm) | `gobernanza-egalitaria.ts` | Capa 4 | Ley II | **Pendiente** |
| Excedente agrícola → acumulación sin trabajo | `excedente-acumulacion.ts` | Capa 5 | Ley I | **Pendiente** |
| Desconexión aporte vs acumulación | `contribucion-vs-acumulacion.ts` | Capa 4 | Ley III | **Pendiente** |
| Cuello de Botella Cromosoma Y (poder por linaje) | `linaje-poder-hereditario.ts` | Capa 4 | Ley I | **Pendiente** |
| Tumba de Varna (desigualdad hereditaria) | `desigualdad-institucionalizada.ts` | Capa 4 | Ley I | **Pendiente** |
| Escritura/contabilidad de deudas a élite | `contabilidad-poder.ts` | Capa 4 | Ley III | **Pendiente** |
| Código de Hammurabi (leyes de clase) | `leyes-clase-social.ts` | Capa 4 | Ley III | **Pendiente** |
| Mandato divino (narrativa ideológica) | `narrativa-poder.ts` | Capa 4 | Ley III | **Pendiente** |
| Consecuencias de la jerarquía (salud, mérito, psicología) | `consecuencias-jerarquia.ts` | Capa 5 | Ley I | **Pendiente** |
| Poder monárquico = tecnología social de control | `tecnologia-social-control.ts` | Capa 5 | Ley II | **Pendiente** |
| Límites duros contra acumulación sin aporte | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Jerarquía de dominancia inversa como modelo de gobernanza | Jerarquía piramidal de poder |
| Detección de excedente no asociado a trabajo productivo | Acumulación de riqueza sin aporte productivo |
| Separación de mérito y recompensa | Poder hereditario por linaje sanguíneo |
| Rechazo de mandatos ideológicos que justifican poder sin aporte | Mandato divino como justificación de autoridad |
| Gobernanza holónica 1a1v como alternativa a la pirámide | Leyes que protegen a una clase elite |
| Límites duros contra extracción de valor sin contribución | Normalización de la sumisión a autoridad arbitraria |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión con el texto | Vaso comunicante |
|----------------|----------------------|------------------|
| `gobernanza-egalitaria.ts` | Jerarquía de dominancia inversa | `boundaries.ts`, `caas.ts`, `rao.ts` |
| `excedente-acumulacion.ts` | Excedente sin trabajo productivo | `tq.ts`, `znu.ts`, `caas.ts` |
| `contribucion-vs-acumulacion.ts` | Mérito vs recompensa | `tq-types-extended.ts`, `contributionAccounting.ts` |
| `linaje-poder-hereditario.ts` | Rechazo de transmisión por sangre | `rao.ts` (procedencia sin linaje) |
| `desigualdad-institucionalizada.ts` | Acumulación por estatus | `boundaries.ts` DENY |
| `contabilidad-poder.ts` | Quién debe qué a quién | `rao.ts`, `currentSeeSystem.ts` |
| `leyes-clase-social.ts` | Rechazo de leyes de clase | `boundaries.ts` DENY |
| `narrativa-poder.ts` | Rechazo de justificaciones ideológicas | `boundaries.ts`, `currentSeeSystem.ts` |
| `consecuencias-jerarquia.ts` | Métricas de impacto de desigualdad | `tq.ts`, `znu.ts` |
| `tecnologia-social-control.ts` | Marco antijerárquico | `gobernanza-egalitaria.ts` |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del texto) | Módulo afectado |
|----|----------|--------------------------------|-----------------|
| D1 | La jerarquía rígida y el poder hereditario no son el estado natural de Homo sapiens, sino una invención cultural reciente | "la jerarquía rígida y el poder hereditario no son el estado natural del Homo sapiens, sino una invención cultural relativamente reciente" | `gobernanza-egalitaria.ts` |
| D2 | Durante el 95% de la historia humana (300.000-12.000 años atrás), las bandas igualitarias suprimían activamente a quien acumulaba poder sin aportar | "jerarquía de dominancia inversa... el grupo actuaba activamente para suprimir a cualquier individuo que intentara acumular poder o recursos" | `gobernanza-egalitaria.ts` |
| D3 | La Revolución Neolítica (10.000-12.000 años) creó el excedente agrícola, permitiendo almacenamiento y acumulación | "La agricultura permitió producir más comida de la que se consumía inmediatamente. A diferencia de un rebaño de gacelas, un granero puede ser robado, medido y acumulado." | `excedente-acumulacion.ts` |
| D4 | El excedente permitió que guerreros, administradores y sacerdotes dejaran de trabajar y vivieran del trabajo de otros | "Quienes controlaban el excedente dejaron de trabajar la tierra y comenzaron a vivir del trabajo de otros." | `excedente-acumulacion.ts` + `contribucion-vs-acumulacion.ts` |
| D5 | El Cuello de Botella del Cromosoma Y (5.000-7.000 años) es prueba biológica de monarquía y patriarcado hereditario | "la diversidad genética del cromosoma Y... se desplomó drásticamente... un número muy pequeño de hombres poderosos monopolizaba la reproducción y la riqueza" | `linaje-poder-hereditario.ts` |
| D6 | La Tumba de Varna (~4500 a.C.) es el primer hallazgo verificable de desigualdad institucionalizada y hereditaria | "el individuo no era enterrado con lo que 'ganó', sino con el estatus que heredó o adquirió por linaje" | `desigualdad-institucionalizada.ts` |
| D7 | La escritura se inventó para la contabilidad de deudas a templos/palacios, no para la poesía | "La escritura no se inventó para la poesía, sino para la contabilidad (registrar quién debía qué a los templos y palacios)." | `contabilidad-poder.ts` |
| D8 | El Código de Hammurabi protegía la propiedad de la elite y regulaba penas según clase social | "Las primeras leyes... no buscaban la igualdad, sino proteger la propiedad de la clase elite" | `leyes-clase-social.ts` |
| D9 | El mandato divino es una tecnología ideológica para naturalizar la desigualdad | "El propósito de este mito: Naturalizar la desigualdad. Si el poder es un regalo de los dioses o de la sangre..." | `narrativa-poder.ts` |
| D10 | La transición a estados jerárquicos tuvo consecuencias medibles: caída de estatura, desnutrición, desvinculación mérito-recompensa | "Los primeros esqueletos de agricultores y súbditos muestran una caída drástica en la estatura..." | `consecuencias-jerarquia.ts` |
| D11 | El poder monárquico es una tecnología social de control de recursos de ~5.000-6.000 años, no el "estado natural" del ser humano | "La propiedad privada hereditaria y el poder monárquico son, en esencia, tecnologías sociales de control de recursos que surgieron hace apenas unos 5.000 o 6.000 años" | `tecnologia-social-control.ts` |
| D12 | El sistema ALRAC/Zeitnus debe rechazar la acumulación de riqueza sin aporte productivo como principio de diseño | Conclusión del texto + principio HSCSG de no extraer valor sin contribución | `boundaries.ts` DENY |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `gobernanza-egalitaria.ts` | Jerarquía de dominancia inversa; supresión de acumulación sin aporte; gobernanza 1a1v | `tests/gobernanza-egalitaria.test.ts` |
| `excedente-acumulacion.ts` | Detección de excedente no asociado a trabajo productivo | `tests/excedente-acumulacion.test.ts` |
| `contribucion-vs-acumulacion.ts` | Separación de mérito y recompensa | `tests/contribucion-vs-acumulacion.test.ts` |
| `linaje-poder-hereditario.ts` | Rechazo de transmisión de poder por sangre | `tests/linaje-poder-hereditario.test.ts` |
| `desigualdad-institucionalizada.ts` | Detección de acumulación por estatus | `tests/desigualdad-institucionalizada.test.ts` |
| `contabilidad-poder.ts` | Trazabilidad de deudas a templos/palacios | `tests/contabilidad-poder.test.ts` |
| `leyes-clase-social.ts` | Rechazo de leyes que protegen a clase elite | `tests/leyes-clase-social.test.ts` |
| `narrativa-poder.ts` | Rechazo de justificaciones ideológicas del poder sin aporte | `tests/narrativa-poder.test.ts` |
| `consecuencias-jerarquia.ts` | Métricas de impacto de desigualdad (salud, mérito, psicología) | `tests/consecuencias-jerarquia.test.ts` |
| `tecnologia-social-control.ts` | Marco antijerárquico | `tests/tecnologia-social-control.test.ts` |
| `boundaries.ts` | DENY: acumulación sin aporte, poder hereditario, mandato divino, leyes de clase | `tests/boundaries-antijerarquia.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-antijerarquia-poder-hereditario.md` — jerarquía de dominancia inversa, excedente-acumulación, contribución vs acumulación, linaje, desigualdad institucionalizada, contabilidad de poder, leyes de clase, narrativa de poder, consecuencias, tecnología social de control, límites duros

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/gobernanza-egalitaria.ts`: `MecanismoSupresion`, `DecisionColectiva`, `Voto1a1v`
- `src/core/state/excedente-acumulacion.ts`: `Excedente`, `Almacenamiento`, `AcumulacionSinTrabajo`
- `src/core/state/contribucion-vs-acumulacion.ts`: `AporteProductivo`, `AcumulacionRiqueza`, `DesconexionMeritoRecompensa`
- `src/core/state/linaje-poder-hereditario.ts`: `Linaje`, `PoderHereditario`, `Monarquia`
- `src/core/state/desigualdad-institucionalizada.ts`: `DesigualdadHereditaria`, `EstatusVsMerito`
- `src/core/state/contabilidad-poder.ts`: `DeudaTemploPalacio`, `RegistroQuienDebeAQuien`
- `src/core/state/leyes-clase-social.ts`: `LeyClase`, `ProteccionElite`
- `src/core/state/narrativa-poder.ts`: `NarrativaIdeologica`, `MandatoDivino`
- `src/core/state/consecuencias-jerarquia.ts`: `ImpactoSalud`, `DesvinculacionMeritoRecompensa`, `PsicologiaSocial`
- `src/core/state/tecnologia-social-control.ts`: `TecnologiaControlRecursos`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `gobernanza-egalitaria.ts`: `aplicarJerarquiaDominanciaInversa()`, `suprimirAcumulacionSinAporte()`, `votar1a1v()`
- `excedente-acumulacion.ts`: `detectarExcedenteSinTrabajo()`, `registrarAlmacenamiento()`
- `contribucion-vs-acumulacion.ts`: `separarMeritoRecompensa()`, `esAcumulacionSinAporte()`
- `linaje-poder-hereditario.ts`: `rechazarTransmisionSangre()`, `esPoderHereditario()`
- `desigualdad-institucionalizada.ts`: `detectarAcumulacionEstatus()`, `esDesigualdadHereditaria()`
- `contabilidad-poder.ts`: `registrarDeudaTemploPalacio()`, `trazarQuienDebeAQuien()`
- `leyes-clase-social.ts`: `rechazarLeyClase()`, `esLeyProteccionElite()`
- `narrativa-poder.ts`: `rechazarMandatoDivino()`, `esJustificacionIdeologica()`
- `consecuencias-jerarquia.ts`: `medirImpactoDesigualdad()`, `detectarDesvinculacionMerito()`
- `tecnologia-social-control.ts`: `marcoAntijerarquico()`, `esTecnologiaControlRecursos()`
- `boundaries.ts`: DENY acumulación sin aporte, poder hereditario, mandato divino, leyes de clase
- No crear jerarquía piramidal; no permitir poder hereditario; no permitir acumulación sin contribución

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeGobernanzaEgalitariaState()`, `makeExcedenteAcumulacionState()`, etc.
- Añadir a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ ... }))`.
- Incluir todos los `make*State()` en `resetAll()`.
- Incluir todos los estados en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: origen de la jerarquía y poder hereditario (jerarquía de dominancia inversa, excedente-acumulación, contribución vs acumulación, límites duros antijerarquía) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/origen-jerarquia-poder-hereditario_backup.md` (texto completo del ensayo)
- Christopher Boehm, "jerarquía de dominancia inversa" (antropología de bandas cazadoras-recolectoras)
- Karmin et al., Nature / Genome Research (Cuello de Botella del Cromosoma Y, 5.000-7.000 años)
- Cultura de Varna (~4500 a.C.), Tumba 43 (desigualdad hereditaria)
- Sumeria y Egipto (~3500-3000 a.C.), escritura como contabilidad, Código de Hammurabi (~1750 a.C.)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/rao.ts` (procedencia sin linaje)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas, trazabilidad)
- `src/core/lib/caas.ts` (Comunidad como Servicio, acceso por contribución)
- `src/core/lib/tq.ts` (TQ 1 kWh, invariante termodinámico)
- `src/core/lib/znu.ts` (ZNU moneda anfibia)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
