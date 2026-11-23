// openspec/specs/alrac-tq-hscsg-salud-laboral.md
// OpenSpec: HSCSG Salud Laboral — las seis cifras como diagnóstico de condición humana en el trabajo
// 5 ejes estratégicos: diagnóstico de carga real, prevención y descanso, salarios y productividad,
// desigualdad patrimonial, visibilización del cuidado.
// Integración con CVNT, desmercantilización, TQ, ZNU, CaaS, autotrofia, seis-cifras-trabajo.
// Estado: Propuesta — TypeScript puro, sin nueva moneda, sin rankings absolutos,
// sin vigilancia laboral, sin mercantilización del cuidado.

# SPEC: alrac-tq-hscsg-salud-laboral
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** HSCSG como comisión de salud laboral — las seis cifras como diagnóstico de condición humana en el trabajo (docs/hscsg-salud-laboral_backup.md)
**Targets:** `src/core/lib/hscsg-salud-laboral.ts`, `src/core/state/hscsg-salud-laboral.ts`, `src/core/lib/seis-cifras-trabajo.ts` (reuso), `src/core/lib/boundaries.ts` (DENY)

---

## 1. Los 5 ejes estratégicos de HSCSG salud laboral

| Eje | Datos que lo sustentan | Uso concreto para HSCSG |
|-----|------------------------|-------------------------|
| **Diagnóstico de carga real** | 65.000 h remuneradas + 50.000–55.000 h no remuneradas + 9.500 h desplazamiento = ~130.000 h | Evaluaciones de riesgo que incluyan la jornada ampliada, no solo el puesto de trabajo |
| **Prevención y descanso** | 20–25 años de sueño; vida laboral de 42 años | Límites de jornada, pausas, políticas de desconexión como inversión en salud |
| **Salarios y productividad** | Productividad 15–20 USD/h; salario efectivo 8–10 USD/h; participación del trabajo 53–54% | Base cuantitativa para negociación salarial y financiamiento de bienestar |
| **Desigualdad patrimonial** | Mediana global 8.000–10.000 USD; promedio países ricos 300.000–500.000 USD | Vincular salud laboral con protección social y redistribución |
| **Visibilización del cuidado** | ~50.000–55.000 h trabajo doméstico y de cuidados no remunerado | Perspectiva de género y doble presencia en políticas de salud laboral |

---

## 2. Interfaces técnicas

```typescript
interface CargaTrabajo {
  pagadas: number;           // 65.000
  cuidadosNoRemunerados: number; // 50.000-55.000
  desplazamientos: number;   // 9.500
  total: number;             // 130.000
  porcentajeVidaConsciente: number; // ~30%
}

interface BrechaSalarial {
  productividadHora: number; // 15-20 USD
  salarioEfectivo: number;   // 8-10 USD
  participacionIngreso: number; // 0.53-0.54
  margenMejora: boolean;     // productividad > salario efectivo
}

interface ConcentracionRiqueza {
  patrimonioPromedioPaisRico: number; // 300.000-500.000 USD
  medianaGlobalAdulto: number;        // 8.000-10.000 USD
  ratio: number;                      // ~10x
  desigualdadEstructural: boolean;    // ratio > 5
}

interface RespuestaPoliticaHSCSG {
  limitesJornadaFundadosEnSueno: boolean;
  evaluacionCargaGlobal: boolean;
  negociacionSalarialConBaseProductividad: boolean;
  proteccionPatrimonialVinculadaSalud: boolean;
  cuidadosVisibilizadosPerspectivoGenero: boolean;
  accesoCaaSSinSalario: boolean;
}
```

---

## 3. Funciones

### 3.1 `diagnosticarCondicionHumana(): DiagnosticoHSCSG`

Retorna el diagnóstico completo con los valores de las seis cifras y los 5 ejes estratégicos evaluados.

### 3.2 `calcularCargaTotal(pagadas, cuidados, desplazamientos): CargaTrabajo`

Suma las tres componentes y calcula el porcentaje de la vida consciente (~30%).

### 3.3 `calcularBrechaProductividadSalarial(productividad, salarioEfectivo, participacion): BrechaSalarial`

Evalúa si existe margen real para mejorar salarios (productividad > salario efectivo).

### 3.4 `calcularRatioConcentracionRiqueza(patrimonioPromedio, medianaGlobal): ConcentracionRiqueza`

Calcula el ratio y detecta desigualdad estructural alta (ratio > 5).

### 3.5 `esSueñoBaseBiologica(horasSueñoDiarias, esperanzaVida): boolean`

Valida que el sueño sea ~1/3 de la existencia (7-8h nocturnas sobre esperanza ~73 años → 20-25 años).

### 3.6 `respuestaPoliticaHSCSG(diagnostico): RespuestaPoliticaHSCSG`

Genera la respuesta del sistema ALRAC/Zeitnus ante el diagnóstico HSCSG:
- límites de jornada fundados en el sueño
- evaluación de carga global
- negociación salarial con base en productividad
- protección patrimonial vinculada a salud
- cuidados visibilizados con perspectiva de género
- acceso a CaaS sin salario

---

## 4. Integración con CVNT y desmercantilización

- El trabajo de cuidados (50.000-55.000h) se registra como `NonTransactionalEvent` de tipo `observation` sin `agentId` obligatorio y sin contraprestación.
- Se clasifica como `valor_observado` o `beneficio_colectivo`, nunca como `recompensa_economica` automática.
- `care_income` (desmercantilización) se aplica como reconocimiento, no como salario.

---

## 5. Límites duros (boundaries.ts)

- DENY: rankings absolutos de países por salud/riqueza.
- DENY: vigilancia laboral o control de productividad individual.
- DENY: mercantilización automática de horas de cuidado a salario.
- DENY: nueva moneda propia HSCSG para "salud laboral" (usar ZNU/TQ existentes).
- DENY: condicionar acceso a CaaS al salario o productividad individual.
- DENY: tratar salud laboral solo como accidente/enfermedad profesional sin ver la carga ampliada.

---

## 6. Criterios de aceptación

- [ ] `diagnosticarCondicionHumana()` retorna los 5 ejes estratégicos con valores del texto
- [ ] `calcularCargaTotal()` = pagadas + cuidados + desplazamientos
- [ ] `calcularBrechaProductividadSalarial()` detecta margen de mejora (productividad > salario)
- [ ] `calcularRatioConcentracionRiqueza()` = promedio / mediana, detecta desigualdad > 5x
- [ ] `esSueñoBaseBiologica()` valida sueño como ~1/3 de la existencia
- [ ] `respuestaPoliticaHSCSG()` retorna todos los flags en true
- [ ] `boundaries.ts` DENY rankings, vigilancia, mercantilización cuidados, nueva moneda, salud solo como accidente
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// diagnosticarCondicionHumana
Input: (ninguno, usa valores de seis-cifras-trabajo)
Expected: 5 ejes estratégicos, sueño 20-25 años, ventana 42 años, pagadas 65.000, cuidados 50.000-55.000, desplazamientos 9.500, total ~130.000, productividad 15-20, salario 8-10, patrimonio rico 300.000-500.000, mediana 8.000-10.000, ratio ~10
```

```typescript
// calcularCargaTotal
Input: { pagadas: 65000, cuidados: 52500, desplazamientos: 9500 }
Expected: total 127000, porcentajeVidaConsciente ~30%
```

```typescript
// calcularBrechaProductividadSalarial
Input: { productividad: 17.5, salarioEfectivo: 9.0, participacion: 0.535 }
Expected: margenMejora = true (productividad > salario efectivo)
```

```typescript
// calcularRatioConcentracionRiqueza
Input: { patrimonioPromedio: 400000, medianaGlobal: 9000 }
Expected: ratio ~44.4, desigualdadEstructural = true
```

```typescript
// boundaries DENY
Input: rankingAbsoluto = true → Expected: error "Rankings absolutos prohibidos"
Input: vigilanciaLaboral = true → Expected: error "Vigilancia laboral prohibida"
Input: mercantilizarCuidados = true → Expected: error "Mercantilización de cuidados prohibida"
Input: nuevaMonedaHSCSG = true → Expected: error "Nueva moneda HSCSG prohibida"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `seis-cifras-trabajo` | 1.0.0 | Seis cifras base de diagnóstico |
| `non-transactional-value` | 1.0.0 | Valor no transaccional para cuidados |
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `caas` | 1.0.0 | Acceso por contribución |
| `znu` | 1.0.0 | Crédito 2-3%, índice canasta |
| `desmercantilizacion` | 1.0.0 | care_income, ecological_credit |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/hscsg-salud-laboral_backup.md` — Texto completo del documento HSCSG salud laboral
- `docs/trabajo-seis-cifras_backup.md` — Seis cifras base
- `docs/non-transactional-value-cvnt_backup.md` — CVNT especificación
- `openspec/specs/alrac-tq-desmercantilizacion.md` — Desmercantilización
- `openspec/specs/alrac-tq-economia-comunes.md` — Economía del común
- `docs/TQ_POSTLABOR_PROPOSAL.md` — TQ Stock/Flow Dual-Layer
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/znu.ts` — ZNU índice canasta
- `src/core/lib/seis-cifras-trabajo.ts` — Seis cifras diagnóstico

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-23 | Propuesta inicial: HSCSG salud laboral (5 ejes estratégicos, diagnóstico de condición humana, límites de jornada, carga total, brecha salarial, desigualdad patrimonial) + integración CVNT+desmercantilización+TQ+ZNU+CaaS, límites duros |
