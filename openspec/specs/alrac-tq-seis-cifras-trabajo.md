// openspec/specs/alrac-tq-seis-cifras-trabajo.md
// OpenSpec: Seis Cifras — Trabajo, Tiempo y Riqueza
// Diagnóstico de valor del trabajo (remunerado y no remunerado), carga total,
// salario efectivo y concentración de riqueza.
// Integración con CVNT, desmercantilización, TQ, ZNU, CaaS, autotrofia.
// Estado: Propuesta — TypeScript puro, sin nueva moneda, sin rankings absolutos,
// sin vigilancia laboral, sin mercantilización del cuidado.

# SPEC: alrac-tq-seis-cifras-trabajo
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Seis cifras centrales sobre trabajo, tiempo y riqueza (docs/trabajo-seis-cifras_backup.md)
**Targets:** `src/core/lib/seis-cifras-trabajo.ts`, `src/core/state/seis-cifras-trabajo.ts`, `src/core/lib/non-transactional-value.ts` (extensión), `src/core/lib/boundaries.ts` (DENY)

---

## 1. Las seis cifras centrales

| # | Cifra | Significado | Implicancia ALRAC |
|---|-------|-------------|-------------------|
| 1 | Sueño 20-25 años (7-8h nocturnas, esperanza ~73 años) | ~1/3 de la existencia es descanso biológico | Base material no negociable; derecho al descanso; acceso universal CaaS |
| 2 | Ventana laboral 42 años (20-63 años) | No toda la vida es productiva ni debe serlo | Límite del trabajo remunerado; no coaccionar más allá |
| 3 | Horas pagadas 65.000 (rango 60k-70k) = 7,5 años continuos | ~10% vida total, ~15% vida despierta | Trabajo reconocido; valor observado; TQ |
| 4 | Cuidados no remunerados 50.000-55.000h + desplazamientos 9.500h = 130.000h carga total (~30% vida consciente) | La carga amplia supera con creces las horas pagadas | Valor no transaccional (CVNT); tiempo soberano; reducción de jornada |
| 5 | Productividad $15-20/hora, captura 53-54%, salario efectivo $8-10/hora | El trabajador captura ~la mitad de su productividad | Participación del trabajo en el ingreso; desmercantilización |
| 6 | Patrimonio $300-500k (país rico) vs $8-10k (mediana global), ratio ~10x | Concentración pura de riqueza generada por el trabajo | ZNU crédito 2-3%; autotrofia; desigualdad estructural |

---

## 2. Interfaces técnicas

```typescript
interface HorasTrabajo {
  pagadas: number;           // 65.000 (rango 60k-70k)
  cuidadosNoRemunerados: number; // 50.000-55.000
  desplazamientos: number;   // 9.500
  total: number;             // 130.000
  rangoPagadas: { min: number; max: number };
}

interface ParticipacionLaboral {
  productividadHora: number; // 15-20 USD
  participacionIngreso: number; // 0.53-0.54
  salarioEfectivo: number;   // 8-10 USD
}

interface ConcentracionRiqueza {
  patrimonioPromedioPaisRico: number; // 300.000-500.000 USD
  medianaGlobalAdulto: number;        // 8.000-10.000 USD
  ratio: number;                      // ~10x
}

interface RespuestaALRAC {
  caasAccesoSinSalario: boolean;
  znuCreditoCompensacion: boolean;
  tqReconocimientoCuidados: boolean;
  cvntValorNoTransaccional: boolean;
  descansoComoContribucion: boolean;
}
```

---

## 3. Funciones

### 3.1 `diagnosticarSeisCifras(): SeisCifrasDiagnostico`

Retorna el diagnóstico completo con los valores por defecto del texto fuente:
- sueño: 20-25 años
- ventanaLaboral: 42 años (20-63)
- horasTrabajo: pagadas 65.000, cuidados 50.000-55.000, desplazamientos 9.500, total 130.000
- participacionLaboral: productividad 15-20, participación 0.53-0.54, salario efectivo 8-10
- concentracionRiqueza: patrimonio promedio rico 300.000-500.000, mediana global 8.000-10.000, ratio ~10

### 3.2 `calcularCargaTotal(pagadas, cuidados, desplazamientos): number`

Suma las tres componentes. Validar que no sea negativo.

### 3.3 `calcularSalarioEfectivo(productividad, participacionIngreso): number`

`salarioEfectivo = productividad × participacionIngreso`. Validar rangos razonables.

### 3.4 `calcularRatioConcentracion(patrimonioPromedio, medianaGlobal): number`

`ratio = patrimonioPromedio / medianaGlobal`. Validar que mediana > 0.

### 3.5 `esCuidadosInvisibles(horasCuidados, horasPagadas): boolean`

Devuelve true si `horasCuidados > 0` y no hay registro de reconocimiento (no transaccional).

### 3.6 `respuestaALRAC(diagnostico): RespuestaALRAC`

Genera la respuesta del sistema ALRAC/Zeitnus:
- `caasAccesoSinSalario = true` (acceso no condicionado al salario)
- `znuCreditoCompensacion = true` (crédito para reducir desigualdad)
- `tqReconocimientoCuidados = true` (cuidados como trabajo reconocido)
- `cvntValorNoTransaccional = true` (cuidados como valor sin transacción)
- `descansoComoContribucion = true` (sueño/descanso como contribución)

---

## 4. Integración con CVNT y desmercantilización

- El trabajo de cuidados (50.000-55.000h) se registra como `NonTransactionalEvent` de tipo `observation` sin `agentId` obligatorio y sin contraprestación.
- Se clasifica como `valor_observado` o `beneficio_colectivo`, nunca como `recompensa_economica` automática.
- `care_income` (desmercantilización) se aplica como reconocimiento, no como salario.

---

## 5. Límites duros (boundaries.ts)

- DENY: rankings absolutos de países por riqueza generada.
- DENY: vigilancia laboral o control de productividad individual.
- DENY: mercantilización automática de horas de cuidado a salario.
- DENY: nueva moneda propia para "valor del trabajo" (usar ZNU/TQ existentes).
- DENY: condicionar acceso a CaaS al salario o productividad individual.

---

## 6. Criterios de aceptación

- [ ] `diagnosticarSeisCifras()` retorna las seis cifras con valores del texto
- [ ] `calcularCargaTotal()` = pagadas + cuidados + desplazamientos
- [ ] `calcularSalarioEfectivo()` = productividad × participación
- [ ] `calcularRatioConcentracion()` = promedio / mediana
- [ ] `esCuidadosInvisibles()` detecta cuidados sin reconocimiento
- [ ] `respuestaALRAC()` retorna todos los flags en true
- [ ] `boundaries.ts` DENY rankings, vigilancia, mercantilización cuidados, nueva moneda
- [ ] 0 errores TypeScript nuevos

---

## 7. Vectores de prueba

```typescript
// diagnosticarSeisCifras
Input: (ninguno, usa valores por defecto)
Expected: sueño 20-25 años, ventana 42 años, pagadas 65.000, cuidados 50.000-55.000, desplazamientos 9.500, total 130.000, productividad 15-20, participación 0.53-0.54, salario 8-10, patrimonio rico 300.000-500.000, mediana 8.000-10.000, ratio ~10
```

```typescript
// calcularCargaTotal
Input: { pagadas: 65000, cuidados: 52500, desplazamientos: 9500 }
Expected: 127000 (rango honesto cerca de 130.000)
```

```typescript
// calcularSalarioEfectivo
Input: { productividad: 17.5, participacion: 0.535 }
Expected: ~9.37 (rango 8-10)
```

```typescript
// calcularRatioConcentracion
Input: { patrimonioPromedio: 400000, medianaGlobal: 9000 }
Expected: ~44.4 (rango de concentración alta)
```

```typescript
// boundaries DENY
Input: rankingAbsoluto = true → Expected: error "Rankings absolutos prohibidos"
Input: vigilanciaLaboral = true → Expected: error "Vigilancia laboral prohibida"
Input: mercantilizarCuidados = true → Expected: error "Mercantilización de cuidados prohibida"
```

---

## 8. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `non-transactional-value` | 1.0.0 | Valor no transaccional para cuidados |
| `tq-types-extended` | 1.0.0 | Tipos core ALRAC |
| `caas` | 1.0.0 | Acceso por contribución |
| `znu` | 1.0.0 | Crédito 2-3%, índice canasta |
| `desmercantilizacion` | 1.0.0 | care_income, ecological_credit |
| `boundaries` | 1.0.0 | Límites duros |

---

## 9. Referencias

- `docs/trabajo-seis-cifras_backup.md` — Texto completo de las seis cifras
- `docs/non-transactional-value-cvnt_backup.md` — CVNT especificación
- `openspec/specs/alrac-tq-desmercantilizacion.md` — Desmercantilización
- `openspec/specs/alrac-tq-economia-comunes.md` — Economía del común
- `docs/TQ_POSTLABOR_PROPOSAL.md` — TQ Stock/Flow Dual-Layer
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/znu.ts` — ZNU índice canasta

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-22 | Propuesta inicial: seis cifras diagnóstico trabajo/tiempo/riqueza, integración CVNT+desmercantilización+TQ+ZNU+CaaS, límites duros |
