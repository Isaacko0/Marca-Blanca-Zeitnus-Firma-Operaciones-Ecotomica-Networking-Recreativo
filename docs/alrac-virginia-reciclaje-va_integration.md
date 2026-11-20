# Integración alrac-virginia-reciclaje-va — Reciclaje de Valor Agregado + USH

**Fuente asimilada:** `docs/alrac-virginia-reciclaje-va_backup.md` — Spec de diseño interno ALRAC, borrador v0.1, provisional, sin validación empírica. Todos los derechos de autor permanecen con el autor del proyecto.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El documento extiende el Sistema Virginia ya implementado (`src/core/lib/tq-virginia.ts`, `src/core/state/virginia.ts`, `openspec/specs/alrac-tq-virginia.md`) con: medición de valor agregado real (VA), Pool de reciclaje, tres canales de salida (φ_R/φ_C/φ_D), capa Universal Share Holding (USH), topes anti-captura (ρ), y circuit breakers (γ-CARMIS, compliance MJ). Es un diseño [PROPUESTA] que no existe aún en el repo.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Reciclar valor agregado real, no simulado**: solo cuenta VA verificado (ingresos − insumos externos); semillas ficticias y αʰ simulado no habilitan reparto.
- **Un piso universal de participación (USH)**: cada miembro activo recibe exactamente el mismo dividendo, sin excepción de nivel ni posición en el árbol Virginia.
- **Evitar que el reciclaje se concentre en el árbol**: tope anti-captura ρ (provisional = 3) entre el miembro que más y el que menos recibe; el exceso vuelve al Pool.
- **Tres canales de salida del Pool**: reinversión sin interés a nodos con IAL bajo (φ_R), crédito mutuo ZNU 2–3% (φ_C), dividendo universal igualitario (φ_D).
- **Dividendo no convertible, caduco a 90 días**: pagado en TQ/ZNU, no a fiat/cripto, caduca (Postulado 4); el excedente vuelve al Pool; respeta límite TQ ±500.
- **Circuit breakers de seguridad**: compliance MJ (Ley I/II/III) debe estar `ok`; si γ-CARMIS activo (αʰ < κ), se detienen distribuciones hasta Paso II del operador soberano.
- **Trazabilidad completa**: cada ciclo registra VA por nodo, r_i, P_t, asignación por canal, N_activos, con trazabilidad ValueFlows.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto documento | Módulo Zeitnus/ALRAC destino | Observación |
|--------------------|------------------------------|-------------|
| Sistema Virginia: árbol 3×9×27, 39 posiciones, N3 peso 2.0 | `src/core/lib/tq-virginia.ts` (ya implementado) | Capa de incentivo recreativa encima de USH |
| Demurrage 5% sobre exceso de 300 ZNU → pool comunitario | `tq-virginia.ts` + `znu.ts` | Ya existe; integrar en P_t |
| checkVirginiaMJCompliance() (Ley I/II/III) | `tq-virginia.ts` + `boundaries.ts` | Gate antes de cada ciclo |
| VA_i,t = ingresos − insumos externos (real, auditable) | `src/core/lib/virginia-recycling.ts` (NUEVO) | Solo VA real habilita reparto |
| Pool Virginia P_t = D_t + Σ r_i·max(0,VA_i,t) | `virginia-recycling.ts` | D_t = demurrage existente |
| r_i = r0·(1+λ·(1−IAL_i)), acotado [0.05, 0.20] | `virginia-recycling.ts` + `ial-autotrofia` | Nodo autotrófico recicla menos |
| Tres salidas φ_R/φ_C/φ_D (0.40/0.20/0.40 provisional) | `virginia-recycling.ts` + `caas.ts` + `znu.ts` | φ_C reutiliza `alrac-znu-indexing-credit` |
| USH: 1 participación por miembro activo, intransferible, no vendible | `virginia-recycling.ts` + `registrySystem.ts` | Custodia, no propiedad; caduca 90 días |
| Dividendo igualitario d = φ_D·P_t/N_activos | `virginia-recycling.ts` | Mismo para todos |
| Tope anti-captura ρ ≤ 3 (max/min recibido_total) | `virginia-recycling.ts` + `boundaries.ts` | Exceso del árbol → Pool |
| Límite TQ ±500; excedente dividendo → φ_R | `tq.ts` + `virginia-recycling.ts` | Límite duro existente |
| γ-CARMIS: si αʰ < κ, detener distribuciones | `CAOS_MODELONEGOCIO_ANALISIS.md` + `boundaries.ts` | Circuit breaker |
| Trazabilidad ValueFlows por ciclo | `tq-valueflows.ts` | Registro inmutable de VA, r_i, P_t, asignaciones |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Semilla ficticia 3.000 USD | Capital no real; ROI y reparto sobre dinero inexistente | Rechazar como base de reparto (Req 1) |
| Peso N3 = 2.0 asumido sin validar contra AUT | No contrastado con realidad | Tope ρ lo neutraliza hasta validar |
| 39 posiciones fijas (no escala a N miembros) | Árbol rígido | USH da piso igualitario; árbol = incentivo recreativo opcional |
| Conversión TQ↔fiat | Prohibida por principio | Dividendo solo TQ/ZNU, no convertible |
| Reparto Amid 35/35/30 | Pertenece a `alrac-revenue`, fuera de alcance | Solo interfaz definida, no implementar |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del documento |
|--------|---------------------|
| `src/core/lib/virginia-recycling.ts` | (NUEVO) runVirginiaRecyclingCycle, VA, Pool, USH, tope ρ |
| `src/core/lib/tq-virginia.ts` | Extender: integrar demurrage D_t en P_t, exposar checkVirginiaMJCompliance |
| `src/core/state/virginia.ts` | Extender: agregar `recyclingPool`, `ushParticipation`, `cycleResults` |
| `src/core/lib/boundaries.ts` | DENY: semillas ficticias, TQ↔fiat conversión, dividendo > ±500, captura > ρ |
| `src/core/lib/ial-autotrofia.ts` | IAL_i para calcular r_i (dependencia externa) |
| `src/core/lib/caas.ts` + `znu.ts` | φ_C crédito mutuo 2–3%, ZNU canasta, caducidad 90d |
| `src/core/lib/tq-valueflows.ts` | Trazabilidad inmutable de cada ciclo |
| `openspec/specs/alrac-tq-virginia-recycling.md` | (NUEVA) Spec del ciclo de reciclaje + USH |
| `openspec/specs/alrac-tq-virginia.md` | Extender: documentar P_t, D_t, USH como capa sobre árbol |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Documento: VA real y auditable; compliance Ley I (no toca base material) como gate; dividendo no convertible evita extracción de valor fuera de la red.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY TQ↔fiat y especulación.
- **Resonancia:** el dividendo no convertible y caducable evita la acumulación extractiva; el compliance MJ es condición previa.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Documento: r_i inversamente proporcional a IAL (nodo autotrófico recicla menos); crédito mutuo ZNU 2–3%; USH da piso igualitario de participación.
- HSCSG: ZNU por beneficio neto (Copiosis), acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el nodo más autónomo necesita menos reciclaje; el piso USH garantiza participación sin depender de posición en el árbol.

### Ley III — Lucidez, nunca engañar
- Documento: VA simulado ≠ VA real (veredicto @alrac-review); todo ciclo trazable en ValueFlows; dividendos iguales y públicos.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** nada se distribuye sin VA verificado; todo flujo es contabilizable públicamente.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Documento: USH da derecho al flujo por ser miembro activo, no por capital; dividendo caduca si no circula (fuerza circulación).
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; acceso por contribución real.
- **Resonancia:** la participación se gana con presencia y contribución, no con tenencia de capital.

---

## 4. Tabla de mapeo isomórfico (documento → Zeitnus/ALRAC)

| Concepto documento | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|--------------------|----------------------|------|----------|--------|
| VA_i,t real y auditable | `virginia-recycling.ts` `calculateRealVA()` | Capa 3 | Ley III | **Pendiente** |
| Pool Virginia P_t = D_t + Σ r_i·VA | `virginia-recycling.ts` `computePool()` | Capa 3/5 | Ley II | **Pendiente** |
| Demurrage 5% > 300 ZNU → Pool | `tq-virginia.ts` + `znu.ts` | Capa 3 | Ley I | Implementado (partial) |
| Tres salidas φ_R/φ_C/φ_D | `virginia-recycling.ts` + `caas.ts` + `znu.ts` | Capa 5 | CaaS | **Pendiente** |
| USH: 1 participación igual, intransferible | `virginia-recycling.ts` + `registrySystem.ts` | Capa 5 | Ley II/III | **Pendiente** |
| Dividendo caduco 90 días, TQ ±500 | `znu.ts` + `tq.ts` + `boundaries.ts` | Capa 3 | Ley III | **Pendiente** |
| Tope anti-captura ρ ≤ 3 | `virginia-recycling.ts` + `boundaries.ts` | Capa 5 | Ley I/II | **Pendiente** |
| Compliance MJ gate (`ok` solo) | `tq-virginia.ts` + `boundaries.ts` | Capa 0/1 | Ley I | Implementado (partial) |
| γ-CARMIS detiene si αʰ < κ | `CAOS_MODELONEGOCIO_ANALISIS.md` + `boundaries.ts` | Capa 0 | Ley I | Implementado (partial) |
| Trazabilidad ValueFlows por ciclo | `tq-valueflows.ts` | Capa 4 | Ley III | Implementado (partial) |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|-----------------------------------|
| Cálculo de VA real (ingresos − insumos externos) | Semilla ficticia 3.000 USD como base de reparto |
| Pool de reciclaje P_t con demurrage D_t | Conversión TQ↔fiat como motor |
| Tres salidas φ_R/φ_C/φ_D con pesos provisionales | Reparto Amid 35/35/30 (pertenece a alrac-revenue) |
| USH: dividendo igualitario, intransferible, caduco 90d | Peso N3 = 2.0 como regla definitiva (sin validar AUT) |
| Tope anti-captura ρ con reasignación al Pool | Árbol de 39 posiciones fijas como única capa de reparto |
| Circuit breakers compliance MJ + γ-CARMIS | Distribución sin gate de compliance |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión documento | Vaso comunicante |
|----------------|---------------------|------------------|
| `tq-virginia.ts` | Árbol Virginia, demurrage, compliance | D_t alimenta P_t; N3 peso como incentivo recreativo |
| `virginia-recycling.ts` | Ciclo de reciclaje completo, USH, tope ρ | Orquesta P_t, asignaciones, dividendos |
| `znu.ts` + `caas.ts` | ZNU canasta, crédito 2–3%, caducidad 90d | φ_C y dividendo USH en ZNU/TQ |
| `tq.ts` | Límite TQ ±500, unidad contable 1 kWh | Excedente dividendo → φ_R |
| `ial-autotrofia.ts` | IAL_i para calcular r_i | Nodo autotrófico recicla menos |
| `tq-valueflows.ts` | Trazabilidad inmutable de cada ciclo | Registro de VA, r_i, asignaciones |
| `boundaries.ts` | Límites duros (no fiat, no captura > ρ, no semillas ficticias) | DENY rules |
| `CAOS_MODELONEGOCIO_ANALISIS.md` | γ-CARMIS, αʰ < κ detiene distribuciones | Circuit breaker Capa 0 |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D14

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | VA real y auditable solo; semillas ficticias rechazadas como base de reparto | "Solo cuenta VA real y auditable. Un VA simulado nunca habilita reparto" | `virginia-recycling.ts` |
| D2 | Compliance MJ gate: `checkVirginiaMJCompliance()` debe ser `ok` antes de cada ciclo | Req 2 + tabla elemento Compliance | `tq-virginia.ts` + `boundaries.ts` |
| D3 | Suma de salidas del Pool ≤ P_t (sin creación de valor) | Req 3 | `virginia-recycling.ts` |
| D4 | Dividendo USH idéntico para todos los miembros activos | Req 4 + §4.4 | `virginia-recycling.ts` |
| D5 | Dividendo no convertible a fiat/cripto, no transferible fuera de la red | Req 5 + §4.4 | `boundaries.ts` + `virginia-recycling.ts` |
| D6 | Dividendo caduca a 90 días; remanente vuelve al Pool | Req 6 + Postulado 4 | `znu.ts` + `virginia-recycling.ts` |
| D7 | Ratio de captura ≤ ρ (provisional = 3); exceso del árbol → Pool | Req 7 + §4.5 | `virginia-recycling.ts` + `boundaries.ts` |
| D8 | Cada ciclo registra VA, r_i, P_t, asignación por canal, N_activos, trazabilidad ValueFlows | Req 8 + §8 | `tq-valueflows.ts` + `virginia-recycling.ts` |
| D9 | Si γ-CARMIS activo (αʰ < κ), detener nuevas distribuciones hasta Paso II | Req 9 + §10 | `boundaries.ts` + `CAOS_MODELONEGOCIO_ANALISIS.md` |
| D10 | Árbol Virginia (39 posiciones) = capa de incentivo recreativa encima de USH | §4.5 | `tq-virginia.ts` |
| D11 | r_i = r0·(1+λ·(1−IAL_i)), acotado [0.05, 0.20]; r0=0.10, λ=0.5 provisionales | §4.2 | `virginia-recycling.ts` + `ial-autotrofia` |
| D12 | Tres salidas: φ_R=0.40, φ_C=0.20, φ_D=0.40 (provisional) | §4.3 | `virginia-recycling.ts` + `caas.ts` |
| D13 | Demurrage 5% sobre exceso de 300 ZNU alimenta P_t | Tabla elemento Demurrage | `tq-virginia.ts` + `znu.ts` |
| D14 | USH participación se extingue al salir; vuelve al Pool (no hereda, no vende) | §4.4 | `registrySystem.ts` + `virginia-recycling.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `virginia-recycling.ts` | `calculateRealVA()` rechaza datos no auditables; `computePool()` = D_t + Σ r_i·VA; `runVirginiaRecyclingCycle()` respeta φ suma = 1 | `tests/virginia-recycling.test.ts` |
| `virginia-recycling.ts` (USH) | `d = φ_D·P_t/N_activos` idéntico para todos; caducidad 90d; TQ ±500 | `tests/virginia-recycling-ush.test.ts` |
| `virginia-recycling.ts` (tope ρ) | `captureRatio ≤ 3`; exceso del árbol reasignado al Pool | `tests/virginia-recycling-capture.test.ts` |
| `virginia-recycling.ts` (circuit breakers) | Compliance `!== ok` → sin distribución; γ-CARMIS activo → detener | `tests/virginia-recycling-breakers.test.ts` |
| `tq-virginia.ts` | Demurrage D_t = 5% > 300 ZNU → Pool; `checkVirginiaMJCompliance()` expuesto | `tests/tq-virginia-demurrage.test.ts` |
| `boundaries.ts` | DENY: semillas ficticias, TQ↔fiat, captura > ρ, dividendo > ±500 | `tests/boundaries-virginia.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-virginia-recycling.md` — ciclo de reciclaje, Pool, USH, tope ρ, circuit breakers, vectores de prueba

### Fase 3.2 — Tipos (`src/core/state/`)
- Extender `src/core/state/virginia.ts`: agregar `recyclingPool`, `ushParticipation`, `cycleHistory`, `cycleResult` a `VirginiaState`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `virginia-recycling.ts`: `calculateRealVA(ingresos, insumosExternos, auditable)`, `computeDemurragePool(balancesZNU)`, `computeRecyclingCycle(state, cfg)`, `applyCaptureRatioCap(receivedPerMember, rho)`, `expireDividends(participations, now)`, `isComplianceOk(state)`, `isCarmisBlocked(alphaH, kappa)`
- Extender `tq-virginia.ts`: integrar `getDemurragePool()` en `computeN3Weight` o como método separado; exposar `checkVirginiaMJCompliance()`
- No usar semillas ficticias; no convertir TQ↔fiat; no implementar reparto Amid

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeVirginiaRecyclingState()`.
- Añadir `virginiaRecycling: VirginiaRecyclingState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ virginiaRecycling: {...st.virginiaRecycling, ...} }))`.
- Incluir `makeVirginiaRecyclingState()` en `resetAll()`.
- Incluir `virginiaRecycling: st.virginiaRecycling` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: reciclaje de valor agregado Virginia + USH (Pool, tres salidas, tope ρ, circuit breakers) + docs/spec`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/alrac-virginia-reciclaje-va_backup.md` (texto completo del spec borrador v0.1)
- `src/core/lib/tq-virginia.ts` (Virginia Gateway implementado)
- `src/core/state/virginia.ts` (Virginia state slice)
- `openspec/specs/alrac-tq-virginia.md` (Virginia Network Gateway spec)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, limitaciones Virginia, círculos concéntricos)
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` (γ-CARMIS, αʰ, κ, Paso II)
- `openspec/specs/alrac-znu-indexing-credit.md` (ZNU canasta, crédito 2–3%, expiración 90d)
- `openspec/specs/alrac-ial-autotrofia-longeva.md` (IAL factor)
- `src/core/lib/tq-valueflows.ts` (trazabilidad)
- `src/core/lib/boundaries.ts` (límites duros)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
