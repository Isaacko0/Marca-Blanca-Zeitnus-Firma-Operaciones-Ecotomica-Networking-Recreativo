# Integración Ancla ZNU en Espirulina + Métrica Simbiodisc — ALRAC/Zeitnus

**Fuente asimilada:** `docs/alrac-znu-espirulina-anchor_backup.md` — Especificación interna del Consorcio ALRAC, Borrador v0.1, 24 de noviembre de 2026. Autor: Isaac (Zeitnus).

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El documento es interno del propio ecosistema ALRAC/Zeitnus/HSCSG v15 OS. Es un borrador v0.1 con parámetros provisionales: protocolo PSE exacto, umbrales de fricción, reparto reinversión/tiempo liberado, comité de ética, estándar de "nutrición base cubierta", equivalencia energética — todos marcados como pendientes. No se implementan como definitivos, se especifican como lógica pura con marca de provisionalidad.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Redefinir el ancla del ZNU (Capa 3)** de la canasta básica a capacidad verificada de espirulina (g PSE — gramo de peso seco equivalente), manteniendo el TQ (Capa 1) inalterado en 1 kWh.
- **Una unidad de ancla de capacidad, no de existencias:** el ledger registra compromisos de esfuerzo; el ZNU no es redimible en biomasa física.
- **Un protocolo PSE (Peso Seco Equivalente)** con mínimos verificables: método de filtrado, porcentaje de materia seca, método de secado, control opcional de ficocianina/clorofila.
- **Control de calidad de terrarios:** maduración verificada 30-45 días, metales pesados, cianotoxinas, contaminación por otras cianobacterias.
- **Expiración de 90 días del ZNU** mantenida.
- **Factor de canasta solo como puente en modo conectado** (modo anfibio: postmonetario / conectado).
- **Simbiodisc como panel de 4 ejes (no número único):** SD-T (destrabajo), SD-N (nutrición), SD-L (longevidad provisional), SD-F (fricción de cuidado).
- **Reglas anti-distorsión:** horas desplazadas cuentan en H_total, costo kWh del TQ en todo reporte, estándar fijo de "nutrición base cubierta".
- **Ciclo de retroalimentación nodo-usuario (frontera móvil):** medir → bajar fricción → liberar tiempo → reinvertir → medir. Apoyo por ítem, no por fecha. Descuento de cuenta de la asamblea (suma cero). Subsidiar acceso, no conducta. Piso de equidad.
- **Automatización y destrabajo ético:** dividendo de destrabajo repartido como tiempo o crédito, no desempleo. Evaluación por costo energético y trabajo desplazado. Destrabajo ético si ningún nodo lo logra haciendo que otros trabajen más.
- **Horizonte de inmortalidad colectiva** declarado como horizonte, no indicador: longevidad saludable individual (SD-L) + continuidad del commons (nodos activos, protocolos replicados, relevo generacional, recuperación tras colapso).
- **Lujo sin exclusividad:** calidad, tiempo y abundancia, no acceso reservado.
- **Salvaguardas:** privacidad (datos de salud no en ledger), voluntariedad (sin consecuencias económicas individuales), consentimiento informado en intervenciones humanas, tope energético por nodo, revisión periódica.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto del documento | Módulo Zeitnus/ALRAC destino | Observación |
|------------------------|------------------------------|-------------|
| Ancla ZNU = g PSE de espirulina (capacidad, no existencias) | `znu-espirulina-anchor.ts` + `znu.ts` | Unidad de autonomía nutricional, no redimible en biomasa |
| Protocolo PSE (filtrado, materia seca, secado, ficocianina/clorofila) | `znu-espirulina-anchor.ts` | Mínimos verificables, aprobados por asamblea |
| Terrarios 30-45 días, control calidad (metales, cianotoxinas, cianobacterias) | `znu-espirulina-anchor.ts` | Derecho de Uso, control de calidad |
| ZNU expiración 90 días | `znu.ts` | Mantener expiración existente |
| Factor de canasta solo en modo conectado | `znu-espirulina-anchor.ts` + `znu.ts` | Principio Anfibio: postmonetario / conectado |
| Espirulina = nutrición proteica, no dieta total (B12 pseudovitamina) | `znu-espirulina-anchor.ts` | Limitación declarada |
| Simbiodisc panel 4 ejes (SD-T, SD-N, SD-L, SD-F) | `simbiodisc.ts` + `znu-espirulina-anchor.ts` | Índice compuesto, no número único |
| SD-T = H_total / (personas × días nutrición base) | `simbiodisc.ts` | Menor es mejor, alerta si sube |
| SD-T_rel = SD-T / H_canasta | `simbiodisc.ts` | Comparación con horas asalariadas |
| SD-N: g PSE/día, días continuos, lote origen, calidad, diversidad dieta | `simbiodisc.ts` | Ingesta verificada desde t₀ |
| SD-L: exposición acumulada, mediciones funcionales, línea base individual | `simbiodisc.ts` | No ranking, cambio vs t₀ |
| SD-F: precio TQ/ZNU, tiempo puerta a boca, distancia, pasos preparación, tasa abandono | `simbiodisc.ts` | Por ítem de cuidado |
| Reglas anti-distorsión (R4.1-R4.3) | `simbiodisc.ts` + `boundaries.ts` | H_total incluye desplazadas, kWh en reporte, estándar fijo |
| Ciclo retroalimentación (R5.1-R5.7) | `znu-espirulina-anchor.ts` + `caas.ts` | Frontera móvil, apoyo por ítem, cuenta asamblea suma cero |
| Dividendo de destrabajo (R6.1-R6.3) | `znu-espirulina-anchor.ts` + `caas.ts` | Tiempo o crédito para todos, evaluación energética |
| Horizonte inmortalidad colectiva (no indicador) | `znu-espirulina-anchor.ts` | Longevidad saludable + continuidad commons |
| Lujo sin exclusividad | `znu-espirulina-anchor.ts` | Calidad, tiempo, abundancia; no acceso reservado |
| Salvaguardas (privacidad, voluntariedad, consentimiento, tope energético, revisión) | `znu-espirulina-anchor.ts` + `boundaries.ts` | Datos salud no en ledger, sin consecuencias económicas |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Implementar protocolo PSE exacto como definitivo | Está marcado como pendiente en el documento | Lógica pura con marca de provisionalidad |
| Umbrales de fricción y periodo de adopción como definitivos | Pendientes de definir | Estructuras de datos con valores placeholder |
| Reparto reinversión/tiempo liberado (R6.1) como definitivo | Pendiente | Esquema de decisión, no valores fijos |
| Comité de ética como implementado | Pendiente | Interfaz para definición posterior |
| Estándar de "nutrición base cubierta" como definitivo | Pendiente | Definición estructurada sin valores |
| Equivalencia energética 1 kWh = 860 kcal = 200g secos como definitiva | "a verificar con el protocolo" | Nota de escala como referencia, no como regla |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del documento |
|--------|---------------------|
| `src/core/lib/znu-espirulina-anchor.ts` | (NUEVO) Ancla ZNU g PSE, protocolo PSE, terrarios, expiración 90 días, factor canata modo conectado, espirulina como nutrición proteica |
| `src/core/state/znu-espirulina-anchor.ts` | (NUEVO) Estado del ancla ZNU, terrarios, lotes, control calidad |
| `src/core/lib/simbiodisc.ts` | (NUEVO) Panel 4 ejes: SD-T, SD-N, SD-L, SD-F; reglas anti-distorsión; ciclo retroalimentación |
| `src/core/state/simbiodisc.ts` | (NUEVO) Estado del panel Simbiodisc, mediciones, alertas |
| `src/core/lib/znu.ts` | Extender: expiración 90 días, factor canata modo conectado, no redimible en biomasa |
| `src/core/lib/boundaries.ts` | DENY: ZNU redimible en biomasa física, cambiar TQ de 1 kWh, datos salud en ledger, consecuencias económicas por datos salud |
| `src/core/lib/caas.ts` | Acceso por contribución, subsidiar acceso no conducta, piso de equidad |
| `src/core/lib/tq.ts` | Invariante termodinámico 1 kWh, costo energético en reportes Simbiodisc |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- ZNU/espirulina: control de calidad (metales pesados, cianotoxinas), espirulina no es dieta total, B12 pseudovitamina, tope energético por nodo, datos salud no en ledger.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el control de calidad y las salvaguardas de privacidad son isomórficas a no dañar la base material.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- ZNU/espirulina: unidad de autonomía nutricional, capacidad no existencias, asamblea define umbrales, canasta de cuidado por asamblea, piso de equidad.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS, gobernanza 1a1v.
- **Resonancia:** la autonomía nutricional y la gobernanza por asamblea son isomórficas al acceso por contribución real.

### Ley III — Lucidez, nunca engañar
- ZNU/espirulina: ZNU no es redimible en biomasa, espirulina no dieta total, B12 pseudovitamina, panel no número único, línea base individual no ranking, ingrediente autorreportado distinguido de verificado.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, transparencia y trazabilidad.
- **Resonancia:** la distinción entre capacidad y existencias, entre verificado y declarado, es isomórfica a la lucidez.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- ZNU/espirulina: subsidiar acceso no conducta, piso de equidad, canasta de cuidado por asamblea, apoyo por ítem no por fecha.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; acceso universal a servicios básicos.
- **Resonancia:** el acceso a nutrición y cuidado por contribución real, no por conducta individual.

---

## 4. Tabla de mapeo isomórfico (ZNU/espirulina + Simbiodisc → Zeitnus/ALRAC)

| Concepto del documento | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|------------------------|----------------------|------|----------|--------|
| Ancla ZNU = g PSE espirulina (capacidad, no existencias) | `znu-espirulina-anchor.ts` + `znu.ts` | Capa 3 | Ley II | **Pendiente** |
| Protocolo PSE (filtrado, materia seca, secado, control) | `znu-espirulina-anchor.ts` | Capa 3 | Ley III | **Pendiente** |
| Terrarios 30-45 días, control calidad | `znu-espirulina-anchor.ts` | Capa 3 | Ley I | **Pendiente** |
| ZNU expiración 90 días | `znu.ts` | Capa 3 | Ley III | **Pendiente** |
| Factor canata solo modo conectado | `znu-espirulina-anchor.ts` + `znu.ts` | Capa 3 | CaaS | **Pendiente** |
| Simbiodisc panel 4 ejes | `simbiodisc.ts` | Capa 4 | Ley II | **Pendiente** |
| SD-T destrabajo, SD-T_rel | `simbiodisc.ts` | Capa 4 | Ley II | **Pendiente** |
| SD-N nutrición, t₀, lote, diversidad | `simbiodisc.ts` | Capa 4 | Ley I | **Pendiente** |
| SD-L longevidad, línea base individual, no ranking | `simbiodisc.ts` | Capa 4 | Ley III | **Pendiente** |
| SD-F fricción cuidado | `simbiodisc.ts` | Capa 4 | Ley I | **Pendiente** |
| Reglas anti-distorsión R4.1-R4.3 | `simbiodisc.ts` + `boundaries.ts` | Capa 4 | Ley III | **Pendiente** |
| Ciclo retroalimentación R5.1-R5.7 | `znu-espirulina-anchor.ts` + `caas.ts` | Capa 5 | CaaS | **Pendiente** |
| Dividendo de destrabajo R6.1-R6.3 | `znu-espirulina-anchor.ts` + `caas.ts` | Capa 5 | Ley II | **Pendiente** |
| Horizonte inmortalidad colectiva | `znu-espirulina-anchor.ts` | Capa 5 | Ley III | **Pendiente** |
| Lujo sin exclusividad | `znu-espirulina-anchor.ts` | Capa 5 | Ley III | **Pendiente** |
| Salvaguardas privacidad, voluntariedad, consentimiento, tope energético | `znu-espirulina-anchor.ts` + `boundaries.ts` | Capa 0 | Ley I | **Pendiente** |
| LPF-1.0 federabilidad, paridad métrica kWh/g PSE | `znu-espirulina-anchor.ts` | Capa 5 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Ancla ZNU g PSE, protocolo PSE, terrarios, control calidad | Implementar protocolo PSE exacto como definitivo |
| Simbiodisc panel 4 ejes con fórmulas | Umbrales de fricción y periodo de adopción como definitivos |
| Reglas anti-distorsión, ciclo retroalimentación, dividendo destrabajo | Reparto reinversión/tiempo liberado como valores fijos |
| Salvaguardas privacidad, voluntariedad, tope energético | Comité de ética como implementado |
| Horizonte inmortalidad colectiva (no indicador) | Estándar de "nutrición base cubierta" como definitivo |
| LPF-1.0 federabilidad, paridad métrica | Equivalencia energética 1kWh=860kcal=200g como regla definitiva |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión ZNU/espirulina + Simbiodisc | Vaso comunicante |
|----------------|--------------------------------------|------------------|
| `znu-espirulina-anchor.ts` | Ancla ZNU g PSE, protocolo PSE, terrarios, expiración | `znu.ts`, `caas.ts`, `boundaries.ts` |
| `simbiodisc.ts` | Panel 4 ejes, reglas anti-distorsión, ciclo retroalimentación | `znu-espirulina-anchor.ts`, `tq.ts`, `caas.ts` |
| `znu.ts` | Expiración 90 días, factor canata modo conectado, no redimible | `znu-espirulina-anchor.ts` |
| `tq.ts` | Invariante 1 kWh, costo energético en reportes | `simbiodisc.ts` (R4.2) |
| `caas.ts` | Subsidiar acceso no conducta, piso de equidad, canasta cuidado | `znu-espirulina-anchor.ts` (R5.x) |
| `boundaries.ts` | DENY: ZNU redimible biomasa, TQ ≠ 1 kWh, datos salud en ledger | Límites duros |
| `registrySystem.ts` | Registro de terrarios, lotes, control calidad | 4 registros separados |
| `currentSeeSystem.ts` | Panel Simbiodisc visible, trazabilidad de mediciones | Corrientes unificadas |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D16

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Ancla ZNU = g PSE de espirulina (capacidad, no existencias), no redimible en biomasa | "R3.1... R3.2 El ancla es de capacidad, no de existencias... el ZNU no es redimible en biomasa física." | `znu-espirulina-anchor.ts` + `znu.ts` |
| D2 | TQ se mantiene en 1 kWh (invariante termodinámico) | "El TQ no cambia: así se conserva la interoperabilidad con la Red de Intercambio Federada" | `znu-espirulina-anchor.ts` + `tq.ts` |
| D3 | Protocolo PSE: filtrado, materia seca, secado, ficocianina/clorofila opcional; aprobado por asamblea | "R3.3 El protocolo PSE fija como mínimos: método de filtrado, porcentaje de materia seca, método de secado..." | `znu-espirulina-anchor.ts` |
| D4 | Terrarios 30-45 días maduración verificada, control calidad metales/cianotoxinas/cianobacterias | "R3.4 Solo cuentan terrarios con maduración verificada de 30 a 45 días... control de calidad" | `znu-espirulina-anchor.ts` |
| D5 | ZNU expiración 90 días mantenida | "R3.5 Se mantiene la expiración de 90 días del ZNU." | `znu.ts` |
| D6 | Factor de canata solo como puente en modo conectado | "R3.6 El factor de canasta existe únicamente como puente en modo conectado." | `znu-espirulina-anchor.ts` + `znu.ts` |
| D7 | Espirulina = nutrición proteica, no dieta total; B12 pseudovitamina | "R3.7 La espirulina es ancla de nutrición biotecnológica y proteica, no dieta total..." | `znu-espirulina-anchor.ts` |
| D8 | Simbiodisc = panel de 4 ejes (SD-T, SD-N, SD-L, SD-F), no número único | "Simbiodisc es un panel, no un número único" | `simbiodisc.ts` |
| D9 | SD-T = H_total / (personas × días nutrición base); SD-T_rel = SD-T / H_canasta; menor es mejor; alerta si sube | "4.1 SD-T · Destrabajo" | `simbiodisc.ts` |
| D10 | SD-N: g PSE/día, días continuos, lote origen, calidad, diversidad dieta desde t₀ | "4.2 SD-N · Nutrición" | `simbiodisc.ts` |
| D11 | SD-L: exposición acumulada (no biomarcador), mediciones funcionales, línea base individual, no ranking | "4.3 SD-L · Longevidad provisional" | `simbiodisc.ts` |
| D12 | SD-F: precio TQ/ZNU, tiempo puerta a boca, distancia, pasos preparación, tasa abandono | "4.4 SD-F · Fricción de cuidado" | `simbiodisc.ts` |
| D13 | Reglas anti-distorsión R4.1-R4.3 (H_total desplazadas, kWh en reporte, estándar fijo) | "4.5 Reglas anti-distorsión" | `simbiodisc.ts` + `boundaries.ts` |
| D14 | Ciclo retroalimentación R5.1-R5.7: apoyo por ítem no por fecha, cuenta asamblea suma cero, subsidiar acceso no conducta, piso equidad | "5. Ciclo de retroalimentación nodo-usuario" | `znu-espirulina-anchor.ts` + `caas.ts` |
| D15 | Dividendo de destrabajo R6.1-R6.3: tiempo/crédito para todos, evaluación energética, destrabajo ético | "6. Automatización y destrabajo ético" | `znu-espirulina-anchor.ts` + `caas.ts` |
| D16 | Salvaguardas: privacidad (datos salud no en ledger), voluntariedad, consentimiento, tope energético, revisión periódica | "9. Salvaguardas" | `znu-espirulina-anchor.ts` + `boundaries.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `znu-espirulina-anchor.ts` | Ancla ZNU g PSE, protocolo PSE, terrarios 30-45 días, expiración 90 días, no redimible, factor canata modo conectado | `tests/znu-espirulina-anchor.test.ts` |
| `simbiodisc.ts` | SD-T, SD-T_rel, SD-N, SD-L, SD-F calculados; reglas anti-distorsión; alerta SD-T > 1; ciclo retroalimentación | `tests/simbiodisc.test.ts` |
| `znu.ts` | Expiración 90 días, no redimible en biomasa, factor canata solo modo conectado | `tests/znu-espirulina-expiracion.test.ts` |
| `boundaries.ts` | DENY: ZNU redimible biomasa, TQ ≠ 1 kWh, datos salud en ledger, consecuencias económicas por datos salud | `tests/boundaries-znu-espirulina.test.ts` |
| `caas.ts` | Subsidiar acceso no conducta, piso de equidad, canasta cuidado por asamblea | `tests/caas-acceso-no-conducta.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-znu-espirulina-anchor.md` — ancla ZNU g PSE, protocolo PSE, Simbiodisc 4 ejes, ciclo retroalimentación, salvaguardas, LPF-1.0

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/znu-espirulina-anchor.ts`: `AnclaZNU`, `ProtocoloPSE`, `Terrario`, `LoteEspirulina`, `ControlCalidad`
- `src/core/state/simbiodisc.ts`: `PanelSimbiodisc`, `EjeSDT`, `EjeSDN`, `EjeSDL`, `EjeSDF`, `Medicion`, `Alerta`, `CicloRetroalimentacion`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `znu-espirulina-anchor.ts`: `crearAnclaZNU()`, `registrarProtocoloPSE()`, `registrarTerrario()`, `registrarLote()`, `registrarControlCalidad()`, `esZNURedimible()`, `estaExpirado()`, `esModoConectado()`
- `simbiodisc.ts`: `calcularSDT()`, `calcularSDTRel()`, `registrarIngestaSDN()`, `registrarMedicionSDL()`, `registrarItemCuidadoSDF()`, `activarAlertaSDT()`, `procesarCicloRetroalimentacion()`, `graduarItemCuidado()`
- `znu.ts`: Extender con expiración 90 días, factor canata modo conectado, no redimible
- `boundaries.ts`: DENY ZNU redimible biomasa, TQ ≠ 1 kWh, datos salud en ledger
- `caas.ts`: Subsidiar acceso no conducta, piso de equidad
- No implementar protocolo PSE exacto como definitivo; no valores fijos de umbrales; no comité de ética implementado

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeZnuEspirulinaAnchorState()`, `makeSimbiodiscState()`.
- Añadir `znuEspirulinaAnchor: ZnuEspirulinaAnchorState` y `simbiodisc: SimbiodiscState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ znuEspirulinaAnchor: {...}, simbiodisc: {...} }))`.
- Incluir `makeZnuEspirulinaAnchorState()` y `makeSimbiodiscState()` en `resetAll()`.
- Incluir ambos en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: ancla ZNU espirulina + métrica Simbiodisc (panel 4 ejes, ciclo retroalimentación, salvaguardas) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/alrac-znu-espirulina-anchor_backup.md` (texto completo del borrador v0.1)
- `src/core/lib/znu.ts` (ZNU moneda anfibia, expiración, factor canata)
- `src/core/lib/tq.ts` (TQ 1 kWh, invariante termodinámico)
- `src/core/lib/caas.ts` (Comunidad como Servicio, acceso por contribución)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- LPF-1.0 (Red de Intercambio Federada): federabilidad, paridad métrica kWh/g PSE
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
