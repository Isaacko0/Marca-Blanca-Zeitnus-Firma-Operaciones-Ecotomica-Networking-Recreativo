# Integración Seis Cifras — Trabajo, Tiempo y Riqueza (ALRAC/Zeitnus)

**Fuente asimilada:** `docs/trabajo-seis-cifras_backup.md` — Seis cifras centrales sobre sueño, ventana laboral, horas de trabajo remunerado, trabajo de cuidados no remunerado, desplazamientos, productividad, salario efectivo y concentración de riqueza.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El texto ofrece seis cifras diagnósticas que conectan directamente con CVNT (valor no transaccional), desmercantilización (care_income), TQ (trabajo reconocido), ZNU (crédito 2-3%), CaaS (acceso por contribución) y autotrofia.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Visibilizar el trabajo no remunerado** (cuidados domésticos, 50.000–55.000 horas) como valor real, no como ausencia de actividad económica.
- **Reconocer la carga total de trabajo** (130.000 horas, ~30% de la vida consciente) incluyendo desplazamientos, no solo las horas pagadas.
- **Separar el valor observado del salario efectivo**: productividad $15-20/hora ≠ salario efectivo $8-10/hora (el trabajador captura ~53-54% del ingreso global).
- **Medir la concentración de riqueza** generada por el trabajo: ratio ~10x entre patrimonio medio país rico ($300-500k) y mediana global ($8-10k por adulto).
- **Defender la base biológica del sueño** (20-25 años, 1/3 de la existencia) como derecho no negociable, no como tiempo "perdido".
- **Cuestionar la ventana laboral de 42 años** como marco obligatorio: no toda la vida es productiva ni debe serlo.
- **Acceder a CaaS (Comunidad como Servicio)** sin que el acceso dependa del salario o la productividad individual.
- **Recibir ZNU/crédito** como compensación por la desigualdad estructural en la conversión salarial → patrimonio.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto de las seis cifras | Módulo Zeitnus/ALRAC destino | Observación |
|-----------------------------|------------------------------|-------------|
| Sueño 20-25 años (1/3 vida) | `seis-cifras-trabajo.ts` + `caas.ts` | Base biológica, derecho al descanso, acceso universal |
| Ventana laboral 42 años (20-63) | `seis-cifras-trabajo.ts` | Límite del trabajo remunerado, no toda la vida es productiva |
| 65.000 horas pagadas (60k-70k) | `seis-cifras-trabajo.ts` + `tq.ts` | Trabajo reconocido, valor observado |
| 50.000-55.000 horas cuidados no remunerados | `seis-cifras-trabajo.ts` + `non-transactional-value.ts` | Valor no transaccional, trabajo de cuidados |
| 9.500 horas desplazamientos | `seis-cifras-trabajo.ts` | Carga de trabajo amplia, costo de vida |
| 130.000 horas carga total (~30% vida consciente) | `seis-cifras-trabajo.ts` | Tiempo soberano, reducción de jornada |
| Productividad $15-20/hora, captura 53-54%, salario efectivo $8-10 | `seis-cifras-trabajo.ts` + `desmercantilizacion.ts` | Participación del trabajo en el ingreso, distribución |
| Patrimonio $300-500k (país rico) vs $8-10k (mediana global), ratio ~10x | `seis-cifras-trabajo.ts` + `znu.ts` + `aut-autonomy.ts` | Concentración de riqueza, ZNU crédito, autotrofia |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Conversión automática de horas de cuidado a salario monetario | Riesgo de mercantilizar el cuidado | Reconocimiento no transaccional (CVNT), no pago directo |
| Ranking de países por riqueza generada | Riesgo de estigmatización y comparación injusta | Perfiles multidimensionales, sin rankings absolutos |
| Uso de las cifras para vigilancia laboral o control de productividad | Riesgo de coerción | Diagnóstico informativo, nunca de control |
| Nueva moneda propia para "valor del trabajo" | Riesgo de duplicar ZNU/TQ | Lógica pura sobre specs existentes |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de las seis cifras |
|--------|---------------------------|
| `src/core/lib/seis-cifras-trabajo.ts` | (NUEVO) Diagnóstico de las seis cifras, carga total, salario efectivo, ratio de concentración |
| `src/core/state/seis-cifras-trabajo.ts` | (NUEVO) Estado del diagnóstico y respuestas ALRAC |
| `src/core/lib/non-transactional-value.ts` | Extender: trabajo de cuidados como valor no transaccional |
| `src/core/lib/caas.ts` | Acceso por contribución real, no por salario |
| `src/core/lib/znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad |
| `src/core/lib/tq.ts` | Trabajo reconocido, stock/capacidad productiva |
| `src/core/lib/boundaries.ts` | DENY: rankings absolutos, vigilancia laboral, mercantilización del cuidado |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Seis cifras: el sueño (20-25 años) es base biológica no negociable; el trabajo de cuidados sostiene la vida y no debe ser invisibilizado ni dañado; la carga total (130.000 horas) no debe exceder límites de dignidad.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el sueño y los cuidados son infraestructura de la vida, no tiempo "perdido" ni "inactivo".

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Seis cifras: la ventana laboral de 42 años no agota la vida; el acceso a necesidades no debe depender del salario efectivo ($8-10/hora) ni de la productividad individual; la riqueza concentrada (ratio ~10x) debe corregirse con ZNU y autotrofia.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el acceso por contribución real es isomórfico a rechazar que el salario sea la única puerta de entrada a la vida digna.

### Ley III — Lucidez, nunca engañar
- Seis cifras: separar productividad ($15-20) de salario efectivo ($8-10); separar horas pagadas (65.000) de carga total (130.000); separar patrimonio medio de mediana (riqueza vs concentración).
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** la lucidez exige no confundir el flujo salarial con el patrimonio acumulado, ni el trabajo pagado con el trabajo total.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Seis cifras: el trabajo de cuidados (50.000-55.000h) es contribución real; el acceso a CaaS no debe condicionarse al salario; el descanso es parte de la contribución.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** los cuidados y el descanso son contribuciones que dan derecho a acceso, sin requerir remuneración monetaria.

---

## 4. Tabla de mapeo isomórfico (seis cifras → Zeitnus/ALRAC)

| Concepto de las seis cifras | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|-----------------------------|----------------------|------|----------|--------|
| Sueño 20-25 años (1/3 vida) | `seis-cifras-trabajo.ts` + `caas.ts` | Capa 1 | Ley I | **Pendiente** |
| Ventana laboral 42 años | `seis-cifras-trabajo.ts` | Capa 4 | Ley II | **Pendiente** |
| 65.000 horas pagadas | `seis-cifras-trabajo.ts` + `tq.ts` | Capa 4 | Ley II | **Pendiente** |
| 50.000-55.000h cuidados no remunerados | `seis-cifras-trabajo.ts` + `non-transactional-value.ts` | Capa 4 | Ley I | **Pendiente** |
| 9.500h desplazamientos | `seis-cifras-trabajo.ts` | Capa 4 | Ley I | **Pendiente** |
| 130.000h carga total (~30% vida consciente) | `seis-cifras-trabajo.ts` | Capa 4 | Ley II | **Pendiente** |
| Productividad $15-20, captura 53-54%, salario $8-10 | `seis-cifras-trabajo.ts` + `desmercantilizacion.ts` | Capa 5 | Ley III | **Pendiente** |
| Patrimonio $300-500k vs $8-10k, ratio ~10x | `seis-cifras-trabajo.ts` + `znu.ts` + `aut-autonomy.ts` | Capa 5 | Ley II | **Pendiente** |
| No rankings, no vigilancia, no mercantilización cuidados | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Diagnóstico de las seis cifras (sueño, ventana laboral, horas pagadas, cuidados, desplazamientos, carga total, productividad/salario, concentración riqueza) | Nueva moneda propia para "valor del trabajo" |
| Cálculo de salario efectivo (productividad × participación laboral) | Rankings de países por riqueza generada |
| Cálculo de ratio de concentración (patrimonio medio / mediana global) | Vigilancia laboral o control de productividad individual |
| Trabajo de cuidados como valor no transaccional (CVNT) | Conversión automática de horas de cuidado a salario |
| Respuesta ALRAC: CaaS acceso, ZNU crédito, TQ reconocimiento | — |
| Límites duros contra mercantilización del cuidado y rankings absolutos | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión seis cifras | Vaso comunicante |
|----------------|----------------------|------------------|
| `seis-cifras-trabajo.ts` | Seis cifrasdiagnóstico | `tq.ts`, `znu.ts`, `caas.ts`, `non-transactional-value.ts` |
| `non-transactional-value.ts` | Trabajo de cuidados como valor observado sin transacción | CVNT especificación ya creada |
| `tq.ts` | Trabajo reconocido, stock de capacidad productiva | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad | ZNU índice de canasta |
| `caas.ts` | Acceso por contribución real, no por salario | Comunidada como Servicio |
| `desmercantilizacion.ts` | care_income, ecological_dividend, ecological_credit | Desmercantilización |
| `boundaries.ts` | DENY rankings absolutos, vigilancia, mercantilización cuidados | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del texto) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Sueño 20-25 años = 1/3 de la existencia, base biológica no negociable | "un ser humano promedio duerme entre 20 y 25 años... aproximadamente un tercio de su existencia" | `seis-cifras-trabajo.ts` + `caas.ts` |
| D2 | Ventana laboral 42 años (20-63), no toda la vida es productiva | "la ventana efectiva de participación laboral abarca unos 42 años, entre los 20 y los 63 años" | `seis-cifras-trabajo.ts` |
| D3 | Horas pagadas 65.000 (rango 60k-70k) = 7,5 años continuos, ~10% vida total, ~15% vida despierta | "las horas remuneradas efectivamente trabajadas... ascienden a unas 65.000 horas" | `seis-cifras-trabajo.ts` |
| D4 | Cuidados no remunerados 50.000-55.000h + desplazamientos 9.500h = carga total 130.000h (~30% vida consciente) | "trabajo doméstico y de cuidados no remunerado (unas 50.000–55.000 horas adicionales) y los desplazamientos laborales (unas 9.500 horas)... 130.000 horas" | `seis-cifras-trabajo.ts` + `non-transactional-value.ts` |
| D5 | Productividad $15-20/hora, participación laboral 53-54%, salario efectivo $8-10/hora | "productividad media de la hora humana ronda los 15–20 dólares... participación del trabajo en el ingreso global de 53–54 por ciento... salario efectivo global en 8–10 dólares por hora" | `seis-cifras-trabajo.ts` + `desmercantilizacion.ts` |
| D6 | Patrimonio promedio país rico $300-500k vs mediana global $8-10k, ratio ~10x = concentración de riqueza | "el trabajador promedio de un país rico acumula 300.000–500.000 dólares... la mediana global de riqueza por adulto apenas ronda los 8.000–10.000 dólares" | `seis-cifras-trabajo.ts` + `znu.ts` + `aut-autonomy.ts` |
| D7 | Trabajo de cuidados no se monetiza automáticamente; se reconoce como valor no transaccional | "trabajo doméstico y de cuidados no remunerado" | `non-transactional-value.ts` |
| D8 | No rankings absolutos de países ni comparación injusta | Principio HSCSG de no estigmatización | `boundaries.ts` DENY |
| D9 | No vigilancia laboral ni control de productividad individual | Principio de lucidez y dignidad | `boundaries.ts` DENY |
| D10 | Acceso a CaaS no condicionado al salario ni productividad individual | Principio CaaS de acceso por contribución real | `caas.ts` |
| D11 | ZNU/crédito como compensación estructural para reducir desigualdad salarial → patrimonio | Principio ZNU de crédito 2-3% e índice canasta | `znu.ts` |
| D12 | Descanso y sueño como contribución que da derecho a acceso, no como tiempo "perdido" | Principio Ley I de no dañar base material | `caas.ts` + `seis-cifras-trabajo.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `seis-cifras-trabajo.ts` | Seis cifras computadas correctamente; carga total = pagadas + cuidados + desplazamientos; salario efectivo = productividad × participación; ratio concentración = medio / mediana | `tests/seis-cifras-trabajo.test.ts` |
| `non-transactional-value.ts` | Trabajo de cuidados registrable como valor no transaccional sin agente reclamante obligatorio | `tests/non-transactional-value-cuidados.test.ts` |
| `caas.ts` | Acceso por contribución real, no por salario; descanso como contribución | `tests/caas-sin-salario.test.ts` |
| `znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad | `tests/znu-credito-desigualdad.test.ts` |
| `boundaries.ts` | DENY: rankings absolutos, vigilancia laboral, mercantilización cuidados | `tests/boundaries-seis-cifras.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-seis-cifras-trabajo.md` — seis cifras, diagnóstico, respuesta ALRAC, límites duros

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/seis-cifras-trabajo.ts`: `SeisCifrasDiagnostico`, `HorasTrabajo`, `ParticipacionLaboral`, `ConcentracionRiqueza`, `RespuestaALRAC`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `seis-cifras-trabajo.ts`: `diagnosticarSeisCifras()`, `calcularCargaTotal()`, `calcularSalarioEfectivo()`, `calcularRatioConcentracion()`, `esCuidadosInvisibles()`, `respuestaALRAC()`
- Extender `non-transactional-value.ts`: trabajo de cuidados como evento no transaccional
- `boundaries.ts`: DENY rankings, vigilancia, mercantilización cuidados
- No nueva moneda; no usar salario como única puerta de acceso; no permitir rankings absolutos

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeSeisCifrasTrabajoState()`.
- Añadir `seisCifrasTrabajo: SeisCifrasTrabajoState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ seisCifrasTrabajo: {...st.seisCifrasTrabajo, ...} }))`.
- Incluir `makeSeisCifrasTrabajoState()` en `resetAll()`.
- Incluir `seisCifrasTrabajo: st.seisCifrasTrabajo` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: seis cifras trabajo/tiempo/riqueza (diagnóstico, carga total, salario efectivo, concentración) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/trabajo-seis-cifras_backup.md` (texto completo de las seis cifras)
- `docs/non-transactional-value-cvnt_backup.md` (CVNT, valor no transaccional)
- `openspec/specs/alrac-tq-desmercantilizacion.md` (care_income, ecological_dividend, ecological_credit)
- `openspec/specs/alrac-tq-economia-comunes.md` (excedentes reinvertidos, no dividendos)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe)
- `src/core/lib/tq-types-extended.ts` (TQEquityAccount, Stock Layer)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- `src/core/lib/znu.ts` (ZNU índice canasta, crédito 2-3%)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
