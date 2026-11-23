# Integración HSCSG Salud Laboral — las seis cifras como diagnóstico de condición humana en el trabajo

**Fuente asimilada:** `docs/hscsg-salud-laboral_backup.md` — Reinterpretación de HSCSG como comisión de salud laboral y análisis de las seis cifras como insumos estratégicos para diagnóstico, diseño de políticas y argumentación pública.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El documento conecta directamente con las seis cifras previas, CVNT (valor no transaccional), desmercantilización (care_income), TQ (trabajo reconocido), ZNU (crédito 2-3%), CaaS (acceso por contribución), autotrofia y límites duros de `boundaries.ts`.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un marco de salud laboral (HSCSG) que use las seis cifras como diagnóstico cuantitativo**, no como datos aislados.
- **Visibilizar la carga total de trabajo** (130.000 horas, ~30% de la vida consciente) como determinante de salud, incluyendo desplazamientos y cuidados no remunerados.
- **Defender el sueño (20-25 años, 1/3 de la vida)** como base biológica ineludible para límites de jornada y políticas de descanso.
- **Cuestionar la falacia de que “la vida es trabajo”**: las 65.000 horas pagadas son solo ~10% de la vida total; la política debe sostener su calidad, no multiplicar su cantidad.
- **Aportar base cuantitativa a la negociación salarial**: productividad $15-20/hora vs salario efectivo $8-10/hora (captura 53-54%) demuestra margen económico real para mejoras.
- **Vincular salud laboral con desigualdad patrimonial**: la mediana global de $8-10k vs $300-500k en países ricos muestra que el entorno institucional, no el esfuerzo individual, determina la conversión de salario en patrimonio.
- **Incorporar perspectiva de género y doble presencia** vía el trabajo de cuidados (50.000-55.000h no remunerados).
- **Acceso a CaaS (Comunidad como Servicio)** no condicionado al salario ni a la productividad individual.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto del documento HSCSG | Módulo Zeitnus/ALRAC destino | Observación |
|------------------------------|------------------------------|-------------|
| 5 ejes estratégicos (carga real, prevención/descanso, salarios/productividad, desigualdad patrimonial, visibilización del cuidado) | `src/core/lib/hscsg-salud-laboral.ts` (NUEVO) | Marco diagnóstico para políticas de salud laboral |
| Sueño 20-25 años como base biológica ineludible | `hscsg-salud-laboral.ts` + `caas.ts` | Límites de jornada, políticas de descanso, desconexión |
| Ventana laboral 42 años (20-63) | `hscsg-salud-laboral.ts` | Intervenciones preventivas en población activa |
| 65.000 horas pagadas (~10% vida total) | `hscsg-salud-laboral.ts` + `tq.ts` | Calidad de cada hora remunerada, no cantidad |
| 130.000 horas carga total (~30% vida consciente) | `hscsg-salud-laboral.ts` + `seis-cifras-trabajo.ts` | Evaluaciones de riesgo con jornada ampliada |
| Productividad $15-20 vs salario $8-10 (participación 53-54%) | `hscsg-salud-laboral.ts` + `desmercantilizacion.ts` | Base cuantitativa para negociación salarial |
| Patrimonio $300-500k vs $8-10k, ratio ~10x | `hscsg-salud-laboral.ts` + `znu.ts` + `aut-autonomy.ts` | Desigualdad estructural, protección patrimonial |
| Cuidados no remunerados 50.000-55.000h | `hscsg-salud-laboral.ts` + `non-transactional-value.ts` | Perspectiva de género, doble presencia, valor no transaccional |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Conversión automática de horas de cuidado a salario monetario | Riesgo de mercantilizar el cuidado | Reconocimiento no transaccional (CVNT), no pago directo |
| Rankings de países por riqueza o salud | Riesgo de estigmatización y comparación injusta | Perfiles multidimensionales, sin rankings absolutos |
| Vigilancia laboral o control de productividad individual | Riesgo de coerción | Diagnóstico informativo, nunca de control |
| Nueva moneda propia HSCSG para “salud laboral” | Riesgo de duplicar ZNU/TQ | Lógica pura sobre specs existentes |
| Tratar salud laboral solo como accidente/enfermedad profesional | El documento lo rechaza explícitamente | Modelo de carga ampliada y desigualdad estructural |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del documento HSCSG |
|--------|---------------------------|
| `src/core/lib/hscsg-salud-laboral.ts` | (NUEVO) 5 ejes estratégicos, diagnóstico de condición humana, límites de jornada, carga total, brecha salarial, ratio riqueza |
| `src/core/state/hscsg-salud-laboral.ts` | (NUEVO) Estado del diagnóstico HSCSG y respuestas de política |
| `src/core/lib/seis-cifras-trabajo.ts` | Reutilizar: seis cifras base (ya creadas) |
| `src/core/lib/non-transactional-value.ts` | Extender: cuidados como valor no transaccional |
| `src/core/lib/caas.ts` | Acceso por contribución real, no por salario |
| `src/core/lib/znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad |
| `src/core/lib/tq.ts` | Trabajo reconocido, stock de capacidad productiva |
| `src/core/lib/desmercantilizacion.ts` | care_income, ecological_credit |
| `src/core/lib/boundaries.ts` | DENY: rankings absolutos, vigilancia, mercantilización cuidados, nueva moneda |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- HSCSG: el sueño es base biológica no negociable; la carga total (130.000h) es determinante de salud; los cuidados no remunerados generan fatiga y estrés que deben prevenirse.
- HSCSG (repositorio): MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** proteger el descanso y limitar la jornada ampliada es isomórfico a no dañar la base material de las personas.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- HSCSG: la ventana laboral de 42 años no agota la vida; el acceso a necesidades no debe depender del salario efectivo ($8-10/hora); la riqueza concentrada (ratio ~10x) debe corregirse con ZNU y autotrofia.
- HSCSG (repositorio): ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** el acceso por contribución real es isomórfico a rechazar que el salario sea la única puerta de entrada a la vida digna y saludable.

### Ley III — Lucidez, nunca engañar
- HSCSG: separar productividad ($15-20) de salario efectivo ($8-10); separar horas pagadas (65.000) de carga total (130.000); separar patrimonio medio de mediana (riqueza vs concentración).
- HSCSG (repositorio): RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** la lucidez exige no confundir el flujo salarial con el patrimonio acumulado, ni el trabajo pagado con el trabajo total.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- HSCSG: el trabajo de cuidados (50.000-55.000h) es contribución real; el acceso a CaaS no debe condicionarse al salario; el descanso es parte de la contribución.
- HSCSG (repositorio): CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** los cuidados y el descanso son contribuciones que dan derecho a acceso, sin requerir remuneración monetaria.

---

## 4. Tabla de mapeo isomórfico (HSCSG salud laboral → Zeitnus/ALRAC)

| Concepto HSCSG | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|----------------|----------------------|------|----------|--------|
| 5 ejes estratégicos de salud laboral | `hscsg-salud-laboral.ts` | Capa 4 | Ley II | **Pendiente** |
| Sueño 20-25 años, límites de jornada | `hscsg-salud-laboral.ts` + `caas.ts` | Capa 1 | Ley I | **Pendiente** |
| Ventana laboral 42 años (20-63) | `hscsg-salud-laboral.ts` | Capa 4 | Ley II | **Pendiente** |
| 65.000h pagadas, calidad vs cantidad | `hscsg-salud-laboral.ts` + `tq.ts` | Capa 4 | Ley II | **Pendiente** |
| 130.000h carga total, jornada ampliada | `hscsg-salud-laboral.ts` + `seis-cifras-trabajo.ts` | Capa 4 | Ley I | **Pendiente** |
| Productividad $15-20 vs salario $8-10 | `hscsg-salud-laboral.ts` + `desmercantilizacion.ts` | Capa 5 | Ley III | **Pendiente** |
| Patrimonio $300-500k vs $8-10k, ratio ~10x | `hscsg-salud-laboral.ts` + `znu.ts` + `aut-autonomy.ts` | Capa 5 | Ley II | **Pendiente** |
| Cuidados no remunerados, perspectiva de género | `hscsg-salud-laboral.ts` + `non-transactional-value.ts` | Capa 4 | Ley I | **Pendiente** |
| No rankings, no vigilancia, no mercantilización | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| 5 ejes estratégicos HSCSG (carga real, prevención/descanso, salarios/productividad, desigualdad patrimonial, visibilización del cuidado) | Nueva moneda propia HSCSG |
| Diagnóstico de condición humana basado en las seis cifras | Rankings de países por salud/riqueza |
| Límites de jornada fundamentados en el sueño (1/3 vida) | Vigilancia laboral o control de productividad |
| Base cuantitativa para negociación salarial (productividad vs salario) | Conversión automática de cuidados a salario |
| Vinculación salud laboral ↔ desigualdad patrimonial | Tratar salud solo como accidente/enfermedad profesional |
| Respuesta ALRAC: CaaS acceso, ZNU crédito, TQ reconocimiento, CVNT valor no transaccional | — |
| Límites duros contra rankings absolutos y mercantilización del cuidado | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión HSCSG | Vaso comunicante |
|----------------|----------------|------------------|
| `hscsg-salud-laboral.ts` | 5 ejes estratégicos, diagnóstico HSCSG | `seis-cifras-trabajo.ts`, `tq.ts`, `znu.ts`, `caas.ts` |
| `seis-cifras-trabajo.ts` | Seis cifras base (sueño, ventana, horas, carga, productividad, riqueza) | Módulo HSCSG reutiliza sus valores |
| `non-transactional-value.ts` | Cuidados como valor no transaccional (CVNT) | Especificación CVNT ya creada |
| `tq.ts` | Trabajo reconocido, stock de capacidad productiva | TQ Stock/Flow Dual-Layer |
| `znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad patrimonial | ZNU índice de canasta |
| `caas.ts` | Acceso por contribución real, no por salario | Comunidad como Servicio |
| `desmercantilizacion.ts` | care_income, ecological_dividend, ecological_credit | Desmercantilización |
| `boundaries.ts` | DENY rankings absolutos, vigilancia, mercantilización cuidados, nueva moneda | Límites duros |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Sueño 20-25 años = base biológica ineludible; fundamenta límites de jornada y políticas de descanso | "el sueño como componente biológico ineludible... protección del derecho al descanso no es un lujo" | `hscsg-salud-laboral.ts` + `caas.ts` |
| D2 | Ventana laboral 42 años (20-63) = período crítico para intervenciones preventivas | "la vida laboral remunerada es una minoría de la vida total... 42 años son el período en que se concentran exposiciones a riesgos laborales" | `hscsg-salud-laboral.ts` |
| D3 | 65.000h pagadas = ~10% vida total; política debe sostener calidad, no multiplicar cantidad | "el trabajo remunerado ocupa una décima parte de la vida... asegurar que cada hora remunerada sea segura, saludable y digna" | `hscsg-salud-laboral.ts` + `tq.ts` |
| D4 | 130.000h carga total = determinante de salud; evaluaciones de riesgo con jornada ampliada | "el trabajo no remunerado y los desplazamientos añaden aproximadamente el doble de horas a la carga laboral visible" | `hscsg-salud-laboral.ts` + `seis-cifras-trabajo.ts` |
| D5 | Productividad $15-20 vs salario $8-10 (participación 53-54%) = margen económico real para mejoras | "el trabajador captura aproximadamente la mitad de lo que produce... existe margen económico real para mejorar remuneraciones" | `hscsg-salud-laboral.ts` + `desmercantilizacion.ts` |
| D6 | Patrimonio $300-500k vs $8-10k, ratio ~10x = entorno institucional determina conversión salario→patrimonio | "el entorno institucional —no el esfuerzo individual— determina en gran medida la conversión del salario en patrimonio" | `hscsg-salud-laboral.ts` + `znu.ts` + `aut-autonomy.ts` |
| D7 | Trabajo de cuidados 50.000-55.000h = perspectiva de género y doble presencia en políticas de salud laboral | "~50.000–55.000 h de trabajo doméstico y de cuidados no remunerado... incorporar la perspectiva de género y la doble presencia" | `hscsg-salud-laboral.ts` + `non-transactional-value.ts` |
| D8 | No rankings absolutos de países ni comparación injusta | Principio HSCSG de no estigmatización | `boundaries.ts` DENY |
| D9 | No vigilancia laboral ni control de productividad individual | Principio de lucidez y dignidad | `boundaries.ts` DENY |
| D10 | Acceso a CaaS no condicionado al salario ni productividad individual | Principio CaaS de acceso por contribución real | `caas.ts` |
| D11 | ZNU/crédito como compensación estructural para reducir desigualdad salarial → patrimonio | Principio ZNU de crédito 2-3% e índice canasta | `znu.ts` |
| D12 | Descanso y sueño como contribución que da derecho a acceso, no como tiempo "perdido" | Principio Ley I de no dañar base material | `caas.ts` + `hscsg-salud-laboral.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `hscsg-salud-laboral.ts` | 5 ejes estratégicos computados; carga total = pagadas + cuidados + desplazamientos; brecha salarial = productividad × (1 - participación); ratio concentración = medio / mediana; sueño como base biológica | `tests/hscsg-salud-laboral.test.ts` |
| `non-transactional-value.ts` | Cuidados no remunerados registrables como valor no transaccional sin agente reclamante obligatorio | `tests/non-transactional-value-cuidados.test.ts` |
| `caas.ts` | Acceso por contribución real, no por salario; descanso como contribución | `tests/caas-sin-salario.test.ts` |
| `znu.ts` | Crédito 2-3%, índice canasta para compensar desigualdad | `tests/znu-credito-desigualdad.test.ts` |
| `boundaries.ts` | DENY: rankings absolutos, vigilancia laboral, mercantilización cuidados, nueva moneda HSCSG | `tests/boundaries-hscsg.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-hscsg-salud-laboral.md` — 5 ejes estratégicos, seis cifras como diagnóstico, respuesta ALRAC, límites duros

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/hscsg-salud-laboral.ts`: `EjeEstrategico`, `DiagnosticoHSCSG`, `CargaTrabajo`, `BrechaSalarial`, `ConcentracionRiqueza`, `RespuestaPolitica`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `hscsg-salud-laboral.ts`: `diagnosticarCondicionHumana()`, `calcularCargaTotal()`, `calcularBrechaProductividadSalarial()`, `calcularRatioConcentracionRiqueza()`, `esSueñoBaseBiologica()`, `ejesEstrategicos()`, `respuestaPoliticaHSCSG()`
- Reutilizar `seis-cifras-trabajo.ts` para los valores base de las seis cifras
- `boundaries.ts`: DENY rankings, vigilancia, mercantilización cuidados, nueva moneda HSCSG
- No nueva moneda; no usar salario como única puerta de acceso; no permitir rankings absolutos

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeHscsgSaludLaboralState()`.
- Añadir `hscsgSaludLaboral: HscsgSaludLaboralState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ hscsgSaludLaboral: {...st.hscsgSaludLaboral, ...} }))`.
- Incluir `makeHscsgSaludLaboralState()` en `resetAll()`.
- Incluir `hscsgSaludLaboral: st.hscsgSaludLaboral` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: HSCSG salud laboral (5 ejes estratégicos, diagnóstico de condición humana, límites de jornada, carga total, brecha salarial, desigualdad patrimonial) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/hscsg-salud-laboral_backup.md` (texto completo del documento HSCSG salud laboral)
- `docs/trabajo-seis-cifras_backup.md` (seis cifras base)
- `docs/non-transactional-value-cvnt_backup.md` (CVNT, valor no transaccional)
- `openspec/specs/alrac-tq-desmercantilizacion.md` (care_income, ecological_dividend, ecological_credit)
- `openspec/specs/alrac-tq-economia-comunes.md` (excedentes reinvertidos, no dividendos)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe)
- `src/core/lib/tq-types-extended.ts` (TQEquityAccount, Stock Layer)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- `src/core/lib/znu.ts` (ZNU índice canasta, crédito 2-3%)
- `src/core/lib/seis-cifras-trabajo.ts` (seis cifras diagnóstico trabajo/tiempo/riqueza)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
