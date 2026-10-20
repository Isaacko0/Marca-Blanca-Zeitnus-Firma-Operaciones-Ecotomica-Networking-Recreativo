// openspec/specs/pmcrt.md
// OpenSpec: Prospectiva Metabolicocibernética Recípranárquica Transgeneracional

# SPEC: pmcrt
**Version:** 1.0.0
**Status:** Draft
**Capa:** 0 (Epistémica) + 1 (Contable-Física) + 2 (Interoperabilidad) + 3 (Membrana Fiat) + 4 (Aplicación)

---

## 1. RESUMEN EJECUTIVO

La **Prospectiva Metabolicocibernética Recípranárquica Transgeneracional (PMCRT)** es el método operativo por el cual una red de comunidades autónomas observa, coordina y regenera las condiciones materiales, sanitarias, cognitivas y organizativas que sostienen la vida.

Combina cinco componentes integrados:
- **Prospectiva:** Escenarios, señales tempranas, decisiones reversibles/irreversibles
- **Metabólica:** Balance de materiales/energía en unidades físicas (entradas, stocks, salidas, residuos, regeneración)
- **Cibernética:** Observar → Comparar → Corregir → Medir (Ley de Ashby: variedad requerida)
- **Recípranárquica:** Subsidiariedad, federación voluntaria, 1 persona = 1 voto, reglas Ostrom
- **Transgeneracional:** Evaluación 7 generaciones, preservar capacidad regenerativa, transmitir conocimiento

---

## 2. VECTOR DE ESTADO TERRITORIAL (9 dimensiones)

```typescript
interface TerritorialStateVector {
  water: WaterMetrics;           // W - m³, calidad, seguridad
  food: FoodMetrics;             // F - kcal, diversidad, autosuficiencia
  energy: EnergyMetrics;         // E - kWh balance, renovable, autonomía
  habitat: HabitatMetrics;       // H - m²/hab, reparaciones, resiliencia
  care: CareMetrics;             // C - cobertura efectiva, equidad, funcionalidad
  memory: MemoryMetrics;         // M - consentimientos, restauración, reproducibilidad
  biosphere: BiosphereMetrics;   // B - carbono suelo, biodiversidad, regeneración
  governance: GovernanceMetrics; // G - participación, concentración poder, CDS/ICS
  liquidity: LiquidityMetrics;   // L - fiat, ZNU, TQ, tiempo, reserva meses
  
  timestamp: number;
  nodeId: string;
}
```

**Dinámica:** `x_{t+1} = f(x_t, u_t, w_t)`
- `u_t`: decisiones/asignaciones (control)
- `w_t`: perturbaciones (sequía, epidemia, conflicto, shock)
- `f`: función de transición — calibrar en piloto

---

## 3. CICLO OPERATIVO PMCRT (5 Fases)

```
OBSERVACIÓN → DIAGNÓSTICO → DELIBERACIÓN → EJECUCIÓN → RETROALIMENTACIÓN
     ↑______________________________________________________________|
```

### Fase 1: OBSERVACIÓN TERRITORIAL
**Entrada:** Sensores, encuestas, censos, inventarios, laboratorio, archivo vivo
**Salida:** Vector estado `x_t` actualizado
**Frecuencia:** Continua (sensores) + Periódica (encuestas mensuales)

### Fase 2: DIAGNÓSTICO METABÓLICO-CIBERNÉTICO
**Procesamiento:**
- Balance metabólico por recurso (identidad: Entradas = Productos + Residuos + Emisiones + ΔStocks + Diff)
- Detección desviaciones vs límites planetarios/locales
- Dependencias críticas y vulnerabilidades
- Ratio variedad Ashby: `capacidad_respuesta / variedad_perturbaciones ≥ 1`
**Salida:** Informe con alertas, prioridades, opciones

### Fase 3: DELIBERACIÓN RECÍPRANÁRQUICA
**Mecanismo:**
- Propuestas surgen en nodo local (autonomía)
- Coordinación federada solo donde mejore resiliencia sin concentrar poder
- **Una persona, un voto** (ALRAC) — no ponderación tokens/aportaciones
- Consejo de Futuros: veto suspensivo con plazo, justificación pública, apelación
**Salida:** Asignaciones a 3 fondos + plan ejecución

### Fase 4: EJECUCIÓN Y AUDITORÍA
**Controles:**
- Balances independientes: fiat, TQ (β_crit), energía física, especie, tiempo
- Trazabilidad RAO por asignación
- Auditoría termodinámica post-ejecución (kWh medidos)
- Separación: datos personales off-ledger, solo hashes en RAO
**Salida:** Registro auditado

### Fase 5: RETROALIMENTACIÓN Y TRANSMISIÓN
**Entrada:** Resultados vs objetivos, corrección políticas, memoria aprendizajes, revisión escenarios
**Salida:** `x_{t+1}`, escenarios revisados, lecciones documentadas

---

## 4. TRES FONDOS COMO SUBSISTEMAS METABÓLICOS

### 4.1 Fondo de Memoria: Preservar capacidad colectiva de aprender
**Función:** Continuidad funcional (Matema 7) + Reversibilidad (Matema 18)
| Subcomponente | Qué financia | Métricas |
|---------------|--------------|----------|
| Conocimiento abierto | Diseños, manuales, aprendizajes publicables | % docs licenciados, restauraciones probadas, procesos reproducibles |
| Memoria personal | Biografías, entrevistas (consentimiento) | Consentimientos vigentes, retiros atendidos, accesos controlados |
| Información reservada | Datos sensibles, clínicos | Off-ledger, solo hashes RAO, controles acceso/retirada |

**Regla apertura:** OAD = principio diseño abierto, no sustituto licencia. Cada producto lleva licencia explícita.
**Herencia reputación:** Atribución histórica conservada, NO conversión automática en moneda/poder/acceso.

---

### 4.2 Fondo de Cuidado: Prevenir antes de reparar
**Función:** Reducir muerte prematura evitable, ampliar cuidado, sostener salud
| Prioridad | Qué financia | Métricas |
|-----------|--------------|----------|
| 1. Prevención primaria | Equipos salud familiar (modelo Brasil) | % prevención real recibida, necesidades no satisfechas, tiempo derivación |
| 2. Detección temprana | Screening, derivación, acompañamiento | Hospitalizaciones evitables, evolución funcionalidad |
| 3. Determinantes sociales | Nutrición, actividad, salud mental, ambiente | Carga económica hogares, diferencias entre grupos |
| 4. Asistencia clínica | Profesionales cualificados, marco México (LGSC, LFPDPPP, COFEPRIS) | Acceso equitativo, no condicionado a pago |

**KPI principal NO = reducción edad biológica** (sin validación clínica). KPIs: funcionalidad, incidencia, calidad vida, supervivencia, equidad.

---

### 4.3 Fondo de Autotrofia: Reducir vulnerabilidad material
**Función:** Autonomía compatible regeneración (7 generaciones)
| Recurso | Métricas | Criterio éxito |
|---------|----------|----------------|
| Agua | % necesidades, calidad, continuidad, shocks | No degradar acuífero |
| Alimento | kcal/hab/día, diversidad, calidad, continuidad | No agotar suelo |
| Energía | Balance neto kWh, % renovable, autonomía | Regenerativo neto |
| Hábitat | m²/hab, reparaciones, mantenimiento | Reparable, local |
| Suelo/Bio | Carbono orgánico, biodiversidad, erosión | Regeneración neta |

**Principio:** No autosuficiencia que degrade acuífero, agote suelo o desplace costes ambientales.

---

## 5. GOBERNANZA TRES FONDOS

### 5.1 Definición auditable de excedente (3 magnitudes independientes)

| Magnitud | Definición | Verificación |
|----------|------------|--------------|
| Excedente financiero neto | Ingresos efectivos no comprometidos − gastos − obligaciones − mantenimiento − provisiones | Contabilidad fiat auditada |
| Balance energía/materiales | Producción − Consumo − Residuos − Emisiones − ΔStocks − Diff no explicada | Medición física |
| Liquidez TQ (β_crit) | Saldo TQ que alimenta β_crit (threshold 30%, rate 50%) | Ledger TQ, separado fiat |

**Reserva 6 meses:** Condición independiente con regla reposición. Si excedente fiat = 0, reparto % solo define distribución futura. Arranque: donaciones, especie, subvenciones comprometidas.

### 5.2 Reparto 15/50/35
Distribución fija del **excedente positivo definido**, con regla separada para reservas, déficit, años sin excedente.
- 15% → Fondo Memoria
- 50% → Fondo Cuidado  
- 35% → Fondo Autotrofia

### 5.3 Gobernanza recípranárquica
- **Una persona, un voto** (ALRAC) — no ponderación tokens/aportaciones
- Registros presencia/contribución acreditan participación, no poder político
- Consejo de Futuros: veto suspensivo (plazo, justificación pública, apelación)
- Horizontes explícitos: Operativo (0-2a), Estratégico (2-20a), Transgeneracional (20-150a/7gen)
- Datos personales off-ledger, consentimiento revocable, LFPDPPP 2025
- Bienes básicos NO condicionados a capacidad laboral/reputación/contribución

---

## 6. CONTABILIDAD METABÓLICA Y LÍMITES ECOLÓGICOS

### 6.1 Identidad balance material (obligatoria por proceso)

```
Entradas = Productos útiles + Residuos + Emisiones + ΔStocks + Diferencia no explicada
```

**Requisitos por receta:**
- Entradas/salidas en unidades físicas compatibles
- Pérdidas/residuos con destino previsto
- Emisiones/efectos ecológicos con metodología declarada
- Cantidades observadas vs planificadas separadas
- **Diferencia no explicada** — investigar si > tolerancia
- Metodología carbono declarada (kg CO₂e)

### 6.2 Cuentas separadas (NO intercambiables)

| Cuenta | Unidad | Qué registra |
|--------|--------|--------------|
| Energía | kWh | Consumo, generación, ahorro medido |
| Agua | m³ | Captación, disponibilidad, consumo, infiltración, recarga |
| Biomasa/Alimentos | kg/ton | Producción, consumo, existencias, pérdidas |
| Carbono | kg/ton CO₂e | Emisiones/remociones (metodología declarada) |
| Suelo/Biodiversidad | Indicadores | Calidad, estructura, cobertura, estado ecológico |
| Economía | Fiat/ZNU/TQ/tiempo | Saldos separados según reglas propias |

**Regla:** Indicadores físicos alimentan diagnóstico, **no se intercambian por conveniencia**.

### 6.3 Abundancia y escasez: proteger acceso básico

**Abundancia** = Capacidad satisfacer necesidades suficiente, equitativa, compatible con límites biofísicos.

**Escasez** tiene diagnósticos: Física, Estacional, Distributiva, Logística, Creada por reglas → respuestas distintas.

**Bienes esenciales (alimento, agua, cuidado básico):**
1. Asignación básica: Priorizar necesidades + disponibilidad + límites uso. **No** capacidad pago ni contribución como condición supervivencia.
2. Reparto riesgo: Participantes comparten variaciones, **siempre** protegiendo lo básico.

---

## 7. IMPLEMENTACIÓN TÉCNICA

### 7.1 Archivos núcleo

| Archivo | Función |
|---------|---------|
| `src/core/lib/pmcrt.ts` | Vector estado, ciclo 5 fases, diagnóstico metabólico |
| `src/core/lib/materialBalance.ts` | Identidad balance, validación recetas, cuentas separadas |
| `src/core/lib/threeFunds.ts` | Gobernanza 3 fondos, balances independientes, excedente auditable |
| `src/core/lib/applyBetaCrit.ts` | `applyBetaCrit()` real: atómico, RAO, anti-doble-gasto |
| `src/core/lib/ecologicalIndicators.ts` | Convención signo unificada (-1 a +1, >0 regeneración) |
| `src/core/lib/solarpunk.ts` | Matchmaking con validación recursos reales, reserva atómica |
| `src/core/lib/bt213KernelLimits.ts` | Límites epistemológicos kernel (BT213) |

### 7.2 Correcciones críticas

#### `applyBetaCrit()` real (antes TODO)
- Detecta exceso sobre threshold 30% liquidez
- Redistribuye 50% atómicamente a asignaciones aprobadas
- Trazabilidad RAO por transferencia
- Anti-doble-gasto + exchangeGuard
- Ancla RAO credential

#### Convención signo ecológico unificada
- **Antes:** `computeStackMetrics` >0 = regeneración, `validateTourismCoherence` <0 = regeneración
- **Ahora:** `ecologicalImpactScore` >0 = regeneración neta, <0 = degradación, =0 neutro
- Funciones: `normalizeEcologicalImpact()`, `regenerationRatioToImpactScore()`, `validateTourismCoherenceFixed()`

#### `matchOffersNeeds()` extendido
- Validación: cantidad, unidad, ubicación, disponibilidad temporal, estado
- Prioridad: urgencia > proximidad > huella ecológica
- Reserva atómica con TTL (anti-doble-asignación)
- `getAvailableQuantity()` resta reservas activas

---

## 8. INDICADORES DE ÉXITO (Cuadro de mando)

| Dimensión | Indicadores prioritarios |
|-----------|--------------------------|
| **Memoria** | Consentimientos vigentes, retiros atendidos, archivos recuperables, docs reutilizados |
| **Cuidado** | Cobertura efectiva, necesidades no satisfechas, acceso equitativo, evolución funcional |
| **Autotrofia** | Cobertura necesidades básicas/recurso, continuidad suministro, estado ecológico |
| **Economía** | Excedente financiero auditado, saldos por unidad, asignaciones/gastos efectivos |
| **Gobernanza** | Participación, concentración poder, conflictos resueltos, decisiones revisadas |
| **Transgeneracional** | Escenarios evaluados, riesgos largo plazo, pasivos comprometidos, restauración ecológica |

**Regla:** Denominadores definidos, líneas base, periodicidad, responsables. Separar anticipatorios (agua, mantenimiento, cobertura) de tardíos (mortalidad evitable).

---

## 9. SECUENCIA IMPLEMENTACIÓN

| Fase | Objetivo | Validación |
|------|----------|------------|
| **Fase 0** | Alineación conceptual/normativa | Revisión legal México (LGSC, LFPDPPP 2025, COFEPRIS) |
| **Fase 1** | Diagnóstico/contabilidad prueba | Nodo piloto línea base, simulación sin comprometer recursos |
| **Fase 2** | Piloto Memoria + diseño otros | Fondo Memoria operativo, auditoría restauración, participación |
| **Fase 3** | Implementación + tests | Tests: applyBetaCrit, balance material, 3 fondos, exchangeGuard |
| **Fase 4** | Evaluación/replicación | Métricas Fase 1 vs 4, lecciones, decisión Asamblea |

---

## 10. TESTS REQUERIDOS

```typescript
// pmcrt.test.ts: vector estado, ciclo 5 fases, diagnóstico
// materialBalance.test.ts: identidad balance, validación recetas, cuentas separadas
// threeFunds.test.ts: balances independientes, excedente, gobernanza 1p1v
// tq.test.ts: applyBetaCrit real, FundAllocation, β_crit, exchangeGuard
// ecologicalIndicators.test.ts: convención signo unificada, validateTourismCoherenceFixed
// solarpunk.test.ts: matchOffersNeeds validación recursos, reserva atómica
// regeneration.test.ts: métricas regeneración, cuentas separadas
```

---

## 11. VASOS COMUNICANTES

| Skill | Qué fluye |
|-------|-----------|
| `hscsg-asamblea-gobernanza` | Decisiones D1-D8 + parámetros + métricas PMCRT |
| `hscsg-monetary-integration` | v1.8: principios PMCRT, cuentas separadas, abundancia/escasez |
| `hscsg-coeficiente-autonomia` | Vector x_t → AUT/CDS reales, métricas transgeneracionales |
| `hscsg-sistema-alraico` | γ-CARMIS + β_crit + BT213 + Matema 21 + vector estado |
| `hscsg-viabilidad-territorial` | TerritorialSovereigntyIndex con 9 dimensiones PMCRT |
| `hscsg-autotrofia-disenador` | 7 generaciones → horizonte transgeneracional operativo |

---

## 12. REFERENCIAS

- Matema 21: La Humildad Metabólica (`docs/MATEMA_21_HUMILDAD_METABOLICA.md`)
- Documento operativo completo: `docs/PMCRT_OPERATIONAL.md`
- Grimorio actualizado: `docs/MATEMAS_GRIMORIO.md` (21 matemas)
- BT213 Kernel Limits: `src/core/lib/bt213KernelLimits.ts`
- LFPDPPP 2025, LGSC México, COFEPRIS, Planetary Boundaries 2026 (Potsdam), UNEP 2024, OMS atención primaria

---

*OpenSpec viva — Sujeta a revisión asamblearia y validación en piloto*
*Versión 1.0.0 | 2026-10-20 | RAO: `RAO:pmcrt:20261020:001`*