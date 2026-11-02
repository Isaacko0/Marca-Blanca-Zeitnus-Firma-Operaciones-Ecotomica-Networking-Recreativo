# Backup FASE 1 — Renta Básica Exponencial (RBE) para Zeitnus / ALRAC

**Fuente:** `Renta_Basica_Exponencial_Zeitnus_ALRAC.md` (9,895 tokens, ~350 líneas)
**Tipo:** Propuesta teórico-técnica v0.1 — hipótesis de diseño
**Fecha:** 29 octubre 2026
**Repo referencia:** github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo
**Estado epistemológico:** Hipótesis de diseño; no capacidad implementada ni garantía de financiación

---

## Resumen ejecutivo

La **Renta Básica Exponencial (RBE)** es una arquitectura donde el *piso universal de seguridad material* crece a medida que crecen (y se verifican) las capacidades sostenibles de la red. "Exponencial" = regla de crecimiento compuesto sujeta a límites biofísicos, distribución justa, incertidumbre y corrección automática — **no** emisión sin respaldo.

**Cinco capas diferenciadas:**
1. **Garantía universal de necesidades** — acceso directo a bienes/servicios básicos (más eficiente/equitativo)
2. **Dividendo universal monetario/mutualista** — transferencia periódica individual sin prueba de empleo/productividad/mérito
3. **Dividendo de los comunes** — distribución de retornos verificables de recursos/infraestructura/conocimiento compartidos
4. **Participación adicional en prosperidad** — recompensas por contribuciones verificadas (ADICIONAL, no condiciona piso)
5. **Capa coordinación Zeitnus/ALRAC** — contabilidad, interoperabilidad, gobernanza, auditoría, simulación, conexión fiat/postmonetaria

**Tesis central:** Renta básica solo merece llamarse exponencial si su crecimiento representa aumento sostenible de capacidad de satisfacer necesidades, no solo aumento de unidades contables.

---

## Definición formal (Sección 2)

### 2.1 Regla exponencial responsable
```
d*_t+1 = d_t (1 + g*_t)           // tasa objetivo
d_t+1 = min{ d*_t+1, d_t(1 + ḡ_t), d^capacidad_t+1 }
```
- `g*_t`: tasa objetivo
- `ḡ_t`: máximo autorizado por gobernanza
- `d^capacidad`: máximo compatible con recursos líquidos, capacidad productiva, estabilidad precios, umbrales ecológicos
- **Si datos no respaldan aumento → mantener dividendo sin penalizar beneficiarios**

### 2.2 Universalidad
- Individual, no condicionado a hogar/empleo
- Periódico y previsible
- No sujeto a productividad, reputación, educación, adhesión ideológica
- Accesible con procedimientos proporcionales y privacidad
- Complementario (no sustitutivo automático) de apoyos específicos (discapacidad, cuidados, vivienda)

### 2.3 Qué crece exponencialmente (Tabla)
| Magnitud | Qué representa | ¿Debe crecer exponencialmente? |
|----------|----------------|--------------------------------|
| Unidades nominales (d_t) | Cantidad moneda/crédito | No necesariamente (puede ser inflación) |
| Poder adquisitivo real (r_t) | Bienes/servicios obtenibles | Solo si oferta sostenible lo permite |
| **Capacidad común (K_t)** | Producción, infraestructura, conocimiento, servicios | **Puede crecer compuesto en fases, con límites** |
| Autonomía material (A_t) | Capacidad efectiva vivir con seguridad y decisión | **Es el objetivo; no reducir a una sola cifra** |

---

## Arquitectura distributiva: 5 dividendos (Sección 3)

| Capa | Nombre | Principio clave |
|------|--------|-----------------|
| **A** | Garantía universal necesidades | Provisión directa donde exista capacidad; transferencias donde elección individual valiosa |
| **B** | Dividendo universal básico (DSI) | Hipótesis heredada (ej. 100 ZNU/mes) — **verificar definición, respaldo, reglas emisión** |
| **C** | Dividendo de los comunes | Retornos netos: energía comunitaria, suelo/infraestructura común, patentes abiertas, plataformas cooperativas, ahorro automatización, circularidad, servicios ecosistémicos (sin legitimar destrucción) |
| **D** | Participación adicional contribución | **Adicional** al piso. Métricas (AUT×CDS) requieren: qué mide, quién valida, normalización, cuidados no remunerados, apelación, impedir reputación → poder político |
| **E** | Fondo resiliencia y transición | Emergencias, mantenimiento, variaciones cosecha/energía, transición monedas, I+D, obligaciones futuras, recuperación ecológica — **NO distribuir como dividendo corriente** |

---

## Modelo contable (Sección 4)

```
F_t+1 = F_t + Y_t + R_t + T_t - D_t - O_t
F_t: saldo fondo | Y_t: ingresos netos recurrentes | R_t: retornos activos comunes
T_t: transferencias externas | D_t = N_t·d_t: pagos universales | O_t: operación, mantenimiento, inversión, reservas
```

**Regla sostenibilidad:** `D_t + O_t ≤ Y_t + R_t + T_t + W_t` (W_t = retirada prudente reservas, con límites)

**Tres presupuestos separados obligatorios:**
1. **Monetario** — liquidez, obligaciones, entradas/salidas, reservas
2. **Real** — alimentos, energía, vivienda, servicios, horas trabajo, capacidad logística, cuellos botella
3. **Ecológico** — materiales, agua, emisiones, biodiversidad, regeneración, límites territoriales

**TQ Ledger:** Registra flujos físicos/energéticos — **NO confundir con medida universal de valor**. 1 TQ = 1 kWh expresa unidad energética específica; no convierte automáticamente cuidado, alimento, servicio médico o daño ecológico en intercambiables. Equivalencias requieren reglas sectoriales explícitas.

---

## Crecimiento sin inflación/escasez (Sección 5)

**Riesgo principal:** poder de compra crece más rápido que oferta → precios absorben beneficio.

**Regla actualización debe considerar:**
- Inflación canasta esencial local (no solo índice agregado)
- Disponibilidad física/calidad bienes esenciales
- Concentración proveedores / poder mercado
- Capacidad producción/logística
- Productividad sostenible (no solo monetaria)
- Saldo fondo + volatilidad ingresos
- Impactos ecológicos + resiliencia
- Distribución territorial oferta

**Regla conceptual crecimiento autorizado:**
```
g_t = clip( min(g_objetivo, g_fiscal, g_oferta, g_ecológico) - λ·π_t - μ·s_t, -g_pausa, g_max )
```
- `π_t`: desviación inflación esencial vs objetivo
- `s_t`: indicador normalizado escasez crítica
- `λ, μ`: parámetros publicados
- `clip`: limita a rango permitido
- **Plantilla de investigación, no regla producción-ready**

**Principio operativo:** Aumento dividendo debe acompañarse de plan expansión oferta / provisión pública para sectores donde demanda adicional presione precios.

---

## Exponencialidad real: automatización y costes marginales (Sección 6)

**Ciclo virtuoso hipotético:**
1. Inversión común → infraestructura productiva/regenerativa
2. Infraestructura reduce coste real proveer necesidad
3. Reducción medida y verificada
4. Parte reinvertida en mantenimiento/expansión
5. Parte aumenta dividendo universal / provisión garantizada
6. Seguridad material → participación en educación, cuidados, innovación, cooperación
7. Capacidad red aumenta (si límites materiales/ecológicos lo permiten)

**Ecuación capacidad agregada:**
```
K_t+1 = K_t + I_t - δK_t - L_t
I_t: inversión útil | δK_t: desgaste | L_t: pérdidas (fallos, externalidades, degradación)
```
**Capacidad solo crece si inversión útil > desgaste + pérdidas**

**Ahorro automatización:** neto de energía, materiales, mantenimiento, licencias, trabajo desplazado, costes transición, externalidades. **No toda automatización reduce coste social total.**

---

## Encaje en Zeitnus / ALRAC (Sección 7)

| Capa/componente | Función potencial en RBE | Validación necesaria |
|-----------------|--------------------------|---------------------|
| Capa epistémica | Definir afirmaciones que cuentan como evidencia | Procedencia, incertidumbre, revisión, límites inferencia |
| Capa normativa | Establecer derechos, reglas reparto, apelación | Compatibilidad legal, participación, protección derechos |
| TQ Ledger | Registrar flujos físicos/energéticos | Unidades, límites equivalencia, auditoría, prevención doble conteo |
| ZNU / capa monetaria | Unidad cuenta, crédito mutualista, instrumento intercambio | Emisión, redención, liquidez, convertibilidad, inflación, riesgo |
| CaaS / servicios | Financiar/coordinar servicios compartidos | Costes reales, demanda, calidad, capacidad provisión |
| Interoperabilidad | Conectar nodos sin obligar fusión | Protocolos, semántica, resolución conflictos, portabilidad |
| Gobernanza holónica | Decidir reglas, revisar resultados | Representación, transparencia, apelación, control captura |
| Aplicaciones/agentes | Presentar información, asistir decisiones | Explicabilidad, permisos humanos, seguridad, pruebas |

### 7.1 Distinción imprescindible: diseño vs código vs operación
- **Concepto:** idea/hipótesis
- **Especificación:** comportamiento definido formalmente
- **Implementación:** comportamiento en código
- **Prueba:** resultado reproducible test/simulación
- **Operación:** resultado observado en piloto real
- **Impacto:** cambio causal medido en bienestar, precios, resiliencia, ecología

**Simulación datos sintéticos valida modelo bajo supuestos; NO demuestra supuestos describen mundo real.**

### 7.2 Interoperabilidad anfibia
Cada instrumento necesita ficha propia: unidad/finalidad, emisor/autoridad, activos/respaldo, reglas creación/destrucción, convertibilidad/límites, riesgos liquidez, tratamiento contable/fiscal, protección usuario, resolución disputas.
- **TQ energético ≠ dinero automáticamente**
- **ZNU indexado canasta ≠ convertible automáticamente en canasta**
- **Saldo contable ≠ garantiza alimentos/energía disponibles**

---

## Universalidad vs contribución: resolver tensión (Sección 8)

**Propuesta:**
- Piso universal **NO condicionado** a productividad, reputación, educación, empleo remunerado, participación política
- Provisión necesidades esenciales **NO retirada** como castigo por desacuerdo/baja contribución
- Retornos adicionales **PUEDEN depender** de contribuciones verificadas, acuerdos voluntarios, participaciones activos comunes
- Obligaciones laborales/fiscales/convivencia → marcos jurídicos separados, **NO redefinen dignidad**
- Personas cuidadoras, discapacidad, formación, crisis → **NO tratadas como "improductivas"**

**Si AUT×CDS asigna excedentes → mantener FUERA del cálculo del derecho universal.**
De lo contrario: no es renta básica incondicional, sino ingreso mínimo condicionado o distribución reputacional.

---

## Gobernanza, garantías, prevención captura (Sección 9)

**Mecanismos mínimos (10):**
1. Fórmulas, parámetros, cambios versión públicos
2. Auditorías independientes flujos financieros/materiales/ecológicos
3. Separación funciones: propone / aprueba / ejecuta / audita
4. Registro conflictos interés + beneficiarios efectivos
5. Derecho explicación, corrección datos, apelación
6. Minimización datos personales; no vigilancia continua sustituto confianza
7. Límites poder grandes contribuyentes/nodos/tenedores activos
8. Representación beneficiarios + grupos afectados (incl. no participantes activos)
9. Procedimientos emergencia con fecha caducidad + revisión posterior
10. **Prohibición convertir puntaje contribución → ciudadanía segunda clase**

**Probar ante escenarios adversos:** captura fondo, colusión proveedores, manipulación métricas, inflación activos, pérdida conectividad, fallo nodo, fraude identidad, crisis alimentaria, desacuerdo comunidades.

---

## Programa validación: teoría → piloto (Sección 10)

| Fase | Descripción | Entregables |
|------|-------------|-------------|
| **0** | Auditoría semántica y código | Localizar specs vigentes (ingresos, ZNU, TQ, CaaS, fondos, gobernanza); distinguir reglas implementadas vs propuestas; resolver definiciones incompatibles; glosario versionado + mapa trazabilidad req→código→test→evidencia; **no habilitar emisión real hasta semántica cerrada** |
| **1** | Modelo contable mínimo | Población/elegibilidad, dividendo, fuentes ingresos/volatilidad, costes admin, reservas/compromisos, inflación canasta, oferta sectorial/límites ecológicos — **datos sintéticos marcados** |
| **2** | Simulación escenarios (10+) | Crecimiento bajo/base/alto, recesión, shock alimentos/energía, crecimiento demográfico, inflación oferta inelástica, automatización reduce costes, captura rentas, pérdida nodo, fraude datos, provisión directa vs transferencia, universal vs universal+adicional — **publicar supuestos, código, semillas, intervalos incertidumbre, resultados negativos** |
| **3** | Piloto limitado y reversible | Alcance territorial/temporal acotado, consentimiento informado, fondo límites pérdida + auditoría externa, no sustituir prestaciones sin evaluación jurídica/social, mecanismo quejas/apelación/salida, evaluación independiente antes de escalar |
| **4** | Escalamiento federado | Nodo nuevo no depende promesa rentabilidad agregada; balance local recursos/compromisos/riesgos/capacidad provisión; federación puede suspender/aislar nodo sin confiscar derechos básicos ni propagar insolvencia |

---

## Métricas éxito: medir autonomía, no solo emisión (Sección 11)

| Dimensión | Métricas |
|-----------|----------|
| **Materiales** | % necesidades esenciales satisfechas, inseguridad alimentaria/energética/habitacional, tiempo espera/calidad servicios, poder adquisitivo real dividendo, variación precios canasta, acceso efectivo por grupos/territorios |
| **Económicas** | Ingresos recurrentes netos fondo, relación pagos/ingresos/reservas, coste admin/beneficiario, volatilidad flujos, concentración proveedores, deuda/obligaciones futuras/exposición convertibilidad |
| **Ecológicas** | Energía/materiales por unidad servicio, emisiones/contaminación, consumo/regeneración agua, salud suelo/biodiversidad, vida útil/reparación/reutilización infraestructura, desplazamiento impactos otros territorios |
| **Institucionales** | % reglas auditables, tiempo resolución apelaciones, errores/correcciones elegibilidad, concentración poder, confianza declarada/participación efectiva, incidentes privacidad/seguridad |

**Métrica compuesta recomendada:** **NO comprimir en puntuación opaca única**. Tablero multidimensional con **límites no compensables** (ej. aumento ingreso no "compensa" violación derechos grave o superación umbral ecológico crítico).

---

## Riesgos y objeciones (Sección 12) — 10+ abordados

1. **Inflación** → inversión oferta, competencia, provisión directa, límites crecimiento basados en datos
2. **Crecimiento exponencial imposible largo plazo** → régimen temporal, no ley universal
3. **Falta ingresos permanentes** → vincular pagos a ingresos verificables, retornos comunes, presupuesto explícito
4. **Confusión unidades** → contabilidad multidimensional, reglas conversión explícitas
5. **Dependencia reputación** → separar estrictamente piso universal y recompensas adicionales
6. **Captura política/económica** → auditoría, límites poder, representación, apelación, transparencia
7. **Vigilancia** → verificación menos invasiva posible, privacidad, alternativas, procedimientos recuperación
8. **Desplazamiento prestaciones** → complementariedad + evaluación distributiva
9. **Greenwashing contable** → indicadores físicos, líneas base, adicionalidad, revisión independiente
10. **Automatización sin reparto** → propiedad compartida, dividendos comunes, negociación, fondos transición

---

## Especificación mínima recomendada para repo (Sección 14)

**OpenSpec:** `alrac-universal-dividend`

### Entidades
- `DividendPolicy`: parámetros, periodicidad, versión, fecha vigencia
- `EligiblePerson`: elegibilidad mínima + método protección privacidad
- `DividendFund`: fuentes financiación, compromisos, reservas, auditoría
- `CapacityReport`: datos oferta, precios esenciales, límites ecológicos
- `DividendPayment`: periodo, cantidad, instrumento, estado, referencia auditoría
- `AppealCase`: reclamación, resolución, plazos, control acceso
- `CommonsReturn`: ingreso verificable, coste, reserva, parte distribuible

### Invariantes de seguridad (8)
1. Elegibilidad piso universal **NO depende** de AUT, CDS, empleo, puntuación reputacional
2. **Ninguna emisión** confundida con ingreso fiscal o producción real
3. Política pago **NO excede** límites presupuestarios aprobados sin excepción auditable
4. Cambio fórmula → versionado + fecha efectiva
5. Suspensión → motivo, alcance, duración, revisión, vía apelación
6. Saldos contables y bienes físicos → reportados **por separado**
7. Pruebas **NO usan datos reales personales** sin autorización/salvaguardas
8. Motor simulación → registra supuestos + distingue sintético vs observado

### Pruebas esenciales (11)
- Población estable / cambiante
- Ingreso fondo negativo / volátil
- Inflación canasta > umbral
- Reservas insuficientes
- Interrupción conectividad
- Pago duplicado / rechazado
- Apelación aprobada + pago retroactivo
- Datos erróneos / desactualizados
- Intento condicionar dividendo a reputación
- Fallo proveedor esencial
- Discrepancia balance monetario vs físico

---

## Decisiones abiertas que NO deben esconderse (Sección 15)

1. ¿RBE en fiat, ZNU, crédito mutualista, provisión directa, combinación?
2. ¿Qué activos/ingresos concretos respaldan fondo?
3. ¿Qué % retornos comunes se reinvierte vs distribuye?
4. ¿Cómo se determina canasta esencial local y quién la revisa?
5. ¿Qué límites ecológicos **NO compensables** con crecimiento monetario?
6. ¿Qué pasa cuando cae capacidad productiva: reservas, mantener piso, activar provisión directa?
7. ¿Cómo evitar dividendo eleve rentas vivienda/precios por falta oferta?
8. ¿Protecciones contra identidad digital / proof-of-life → vigilancia?
9. ¿Qué prestaciones permanecen adicionales al dividendo universal?
10. ¿Cómo participan quienes reciben dividendo pero no pertenecen formalmente a red?

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto RBE | → Módulo HSCSG | Vaso comunicante |
|--------------|----------------|------------------|
| Capa A: Garantía necesidades | `caas.services` + `capacidades.provisioning` | `toggleCapability`, `runCaasPayout` |
| Capa B: Dividendo universal (DSI) | `caas.universalDividend` + `zeitnus.dividendPolicy` | `runCaasPayout` filtrado por `poh.identities` |
| Capa C: Dividendo comunes | `caas.commonsDividend` + `integral.commonsReturns` | `ingestIntegralSignal` (commons returns) |
| Capa D: Participación adicional | `caas.contributionRewards` + `symbiosky.reputation` | `symCastVote` + `symDecayTick` |
| Capa E: Fondo resiliencia | `caas.resilienceFund` + `zeitnus.transitionFund` | `priceParity` oracle + `automaton.proposeAction` |
| Modelo contable (3 presupuestos) | `integral.accounting` (monetario/real/ecológico) | `raiseIntegralIssue` per budget |
| TQ Ledger | `integral.tqLedger` | `priceParity` (TQ ↔ ZNU/fiat) |
| Crecimiento autorizado (g_t formula) | `zeitnus.growthController` | `automaton.evaluateAction` gate Ley I/II/III |
| Ciclo virtuoso automatización | `capacidades.automationSavings` → `commonsDividend` | `ingestIntegralSignal` (verified savings) |
| Gobernanza 10 mecanismos | `boundaries.governance` + `kleros.courts` | `addBoundaryRule`, `seatJuror` |
| Programa validación 4 fases | `agentCanvas.validationProgram` | `spawnAgent` per phase |
| Métricas multidimensionales | `integral.dashboard` (no compensable) | `raiseIntegralIssue` per dimension |
| OpenSpec `alrac-universal-dividend` | `openspec/specs/alrac-universal-dividend/` | Spec-driven development |

---

## Decisiones de diseño EBD

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-RBE-01** | 5 capas separadas (A-E) — NO un dividendo único | Evita confusión: piso universal ≠ recompensas contribución ≠ retornos comunes ≠ fondo resiliencia |
| **EBD-RBE-02** | Regla crecimiento `min(g*_t, ḡ_t, g_capacidad)` con `clip` | Hard limits: gobernanza, capacidad real, límites ecológicos |
| **EBD-RBE-03** | 3 presupuestos separados (monetario, real, ecológico) — **no compensables** | "Un aumento de ingreso no debe compensar estadísticamente violación derechos o umbral ecológico crítico" |
| **EBD-RBE-04** | TQ = unidad energética (1 TQ = 1 kWh) — NO medida universal valor | Paper: "no convierte por sí solo cualquier hora de cuidado, kg alimento, servicio médico o daño ecológico en intercambiables" |
| **EBD-RBE-05** | Piso universal **estrictamente separado** de AUT×CDS / contribución | "Si AUT×CDS asigna excedentes, mantener fuera del cálculo del derecho universal" |
| **EBD-RBE-06** | Programa validación 4 fases con datos sintéticos marcados | "No habilitar emisión real hasta que la semántica económica esté cerrada" |
| **EBD-RBE-07** | Métricas compuestas = tablero multidimensional con límites no compensables | "No comprimir todo en una única puntuación opaca" |
| **EBD-RBE-08** | 10 decisiones abiertas = parte de definición de justicia del sistema | "No son detalles administrativos menores. Son parte de la definición de justicia del sistema." |

---

## Validaciones DV requeridas

| ID | Validación | Criterio éxito |
|----|------------|----------------|
| **DV-RBE-01** | `computeDividend(population, fund, capacityReport)` → d_t respeta `min(g*, ḡ, g_capacidad)` | 0 violations en 1000 Monte Carlo runs |
| **DV-RBE-02** | `threeBudgets(monetary, real, ecological)` → balances no compensables | Ecological breach → hard stop independientemente de monetary surplus |
| **DV-RBE-03** | `tqLedger.record(flow)` → unidades energéticas verificables | No double-counting; audit trail completo |
| **DV-RBE-04** | `universalDividend(population)` → individual, periódico, no condicionado | 0 condicionalidad en eligibility check |
| **DV-RBE-05** | `commonsDividend(returns, reinvestmentRate)` → distribución transparente | Audit trail: source → reserve → distribution |
| **DV-RBE-06** | `growthController(inflation, scarcity, fund)` → g_t dentro de `clip` bounds | 0 out-of-bounds en stress tests |
| **DV-RBE-07** | `simulateScenario(scenario)` → trajectories distinguen sintético vs real | Synthetic flag preserved throughout |
| **DV-RBE-08** | `governance.check(mechanism)` → 10 mecanismos operativos | Independent audit passes all 10 |

---

## Estructura de archivos FASE 3 propuesta

```
src/core/lib/rbe.ts                    # Lógica pura: dividendPolicy, threeBudgets, growthController, commonsDividend
src/core/lib/rbe-accounting.ts         # Contabilidad 3 presupuestos (monetario, real, ecológico)
src/core/lib/rbe-tq.ts                 # TQ Ledger: energy flows, priceParity, audit
src/core/lib/rbe-governance.ts         # 10 mecanismos gobernanza, appeal, audit
src/core/lib/rbe-validation.ts         # 4-phase validation program, scenario simulation
src/core/state/rbe.ts                  # Tipos: DividendPolicy, DividendFund, CapacityReport, DividendPayment, AppealCase, CommonsReturn
src/core/state/hooks/rbe.ts            # Selectores: useDividend, useBudgets, useGrowthRate, useTQLedger
src/core/state/store.ts                # Integración: rbe slice + actions + resetAll + partialize
src/app/screens/RBE.tsx                # Pantalla 6 tabs: Dividendo, Presupuestos, TQ Ledger, Gobernanza, Validación, Config
src/app/layout/Aside.tsx               # Nav "RBE" + Route "/rbe"
skills/rbe/                            # 6 skills: dividend-design, budget-accounting, tq-ledger, governance, validation, simulation
```

---

## Conexión con Control Laws in Aging

- **Control cost savings** (automation, senolytics, etc.) → `commonsReturn` input para **Capa C**
- **Biological age = min safe control cost** → input a `zeitnus.dividendPolicy` (Capa B indexada a capacidad real)
- **Functional viability set V** → define **canasta esencial local** para Capa A
- **Lie bracket sequencing** → optimiza `I_t` (inversión útil) en ecuación `K_t+1 = K_t + I_t - δK_t - L_t`

---

## Próximos pasos

1. **FASE 3 core** — `rbe.ts` (lógica pura 5 capas + 3 presupuestos + growth controller)
2. **FASE 3 TQ Ledger** — `rbe-tq.ts` (energy flows + priceParity + audit)
3. **FASE 3 Governance** — `rbe-governance.ts` (10 mecanismos + appeal + audit)
4. **FASE 3 Validation** — `rbe-validation.ts` (4 fases + scenario simulation engine)
5. **Pantalla RBE** — 6 tabs
6. **Skills** — 6 skills auto-ejecutables
7. **OpenSpec** — `openspec/specs/alrac-universal-dividend/`