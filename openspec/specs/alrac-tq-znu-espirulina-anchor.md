// openspec/specs/alrac-tq-znu-espirulina-anchor.md
// OpenSpec: Ancla ZNU en Espirulina + Métrica Simbiodisc (ALRAC/Zeitnus)
// Redefine el ancla del ZNU (Capa 3) a capacidad verificada de espirulina (g PSE).
// Establece Simbiodisc como panel de 4 ejes: SD-T (destrabajo), SD-N (nutrición),
// SD-L (longevidad provisional), SD-F (fricción de cuidado).
// Ciclo de retroalimentación nodo-usuario (frontera móvil).
// Estado: Propuesta — TypeScript puro, borrador v0.1, parámetros provisionales,
// sin implementar protocolo PSE exacto como definitivo, sin umbrales fijos.

# SPEC: alrac-tq-znu-espirulina-anchor
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** alrac-znu-espirulina-anchor.md, Isaac (Zeitnus) / Consorcio ALRAC, Borrador v0.1, 24 nov 2026 (docs/alrac-znu-espirulina-anchor_backup.md)
**Targets:** `src/core/lib/znu-espirulina-anchor.ts`, `src/core/state/znu-espirulina-anchor.ts`, `src/core/lib/simbiodisc.ts`, `src/core/state/simbiodisc.ts`, `src/core/lib/znu.ts` (extensión), `src/core/lib/boundaries.ts` (DENY)

---

## 1. Ancla del ZNU en Espirulina (Capa 3)

La unidad de referencia del ZNU pasa de la canasta básica a **capacidad verificada de espirulina** medida en **g PSE** (gramo de peso seco equivalente de biomasa de espirulina producida bajo protocolo verificado).

### 1.1 Requisitos del ancla

| ID | Requisito | Descripción |
|----|-----------|-------------|
| R3.1 | Unidad de referencia | g PSE de biomasa de espirulina, protocolo verificado |
| R3.2 | Capacidad, no existencias | Ledger registra compromisos de esfuerzo; ZNU no redimible en biomasa física |
| R3.3 | Protocolo PSE mínimos | Método de filtrado, % materia seca, método de secado, ficocianina/clorofila opcional; asamblea aprueba detalle |
| R3.4 | Terrarios válidos | Maduración verificada 30-45 días cultivo continuo; control calidad: metales pesados, cianotoxinas, cianobacterias |
| R3.5 | Expiración | 90 días del ZNU (mantenida) |
| R3.6 | Factor de canata | Solo como puente en modo conectado |
| R3.7 | Alcance nutricional | Nutrición proteica/biotecnológica, no dieta total; pocas calorías por ración; B12 mayormente pseudovitamina |

---

## 2. Simbiodisc: Panel de Cuatro Ejes

Simbiodisc es un panel, no un número único. Cuatro ejes independientes.

### 2.1 SD-T · Destrabajo

```
SD-T = H_total / (personas × días de nutrición base cubiertos)
SD-T_rel = SD-T / H_canasta
```

- `H_total`: cultivo, mantenimiento, cosecha, verificación entre nodos, control de calidad.
- `SD-T_rel`: comparación con horas de trabajo asalariado para comprar la canasta de un día.
- Menor es mejor. Valor < 1 = nodo libera tiempo frente al mercado. Alerta si sube.

### 2.2 SD-N · Nutrición

Ingesta verificada desde t₀: g PSE por día, días continuos de consumo, lote de origen con resultado de calidad, diversidad de la dieta.

### 2.3 SD-L · Longevidad Provisional

- Exposición acumulada desde t₀: días de ingesta, dosis media, calidad de lotes (etiquetada como exposición, no biomarcador).
- Mediciones funcionales: fuerza de agarre, FC en reposo, presión arterial, perímetro cintura, horas y regularidad de sueño.
- Reservado: biomarcadores clínicos (glucosa/HbA1c, lípidos, PCR ultrasensible) con acceso a laboratorio.
- Línea base individual: cada persona vs su propio t₀. Cambio, no ranking.

### 2.4 SD-F · Fricción de Cuidado

Por ítem de cuidado: precio en TQ o ZNU, tiempo de puerta a boca, distancia al punto de entrega, pasos de preparación, tasa de abandono.

### 2.5 Reglas Anti-Distorsión

| ID | Regla |
|----|-------|
| R4.1 | Horas de trabajo desplazadas fuera del nodo (insumos, sensores, equipos) cuentan en H_total |
| R4.2 | Todo reporte de Simbiodisc incluye costo en kWh del TQ |
| R4.3 | "Nutrición base cubierta" = estándar fijo; si cambia el denominador, se versiona la métrica |

---

## 3. Ciclo de Retroalimentación Nodo-Usuario (Frontera Móvil)

> medir → bajar fricción y trabajo → liberar tiempo → reinvertir en cuidado, investigación y automatización → medir

| ID | Regla |
|----|-------|
| R5.1 | Nodo reduce fricción de ítems de cuidado: precio, cercanía, presentación lista para usar, opción por defecto, compañía |
| R5.2 | Datos agregados (adopción, continuidad, mediciones funcionales, sin identidad) alimentan Simbiodisc y asamblea |
| R5.3 | Apoyo no caduca por fecha sino por ítem; frontera avanza, ciclo no se apaga |
| R5.4 | Descuento sale de cuenta de la asamblea (suma cero), no de alterar precios energéticos del TQ |
| R5.5 | Subsidia acceso, no conducta; rebaja igual para todos |
| R5.6 | Canasta de cuidado: asamblea la arma por beneficio demostrado por unidad de esfuerzo; espirulina es un ítem más |
| R5.7 | Piso de equidad: recursos donde la fricción es mayor, no donde los resultados son mejores |

---

## 4. Automatización y Destrabajo Ético

| ID | Regla |
|----|-------|
| R6.1 | Dividendo de destrabajo: horas ahorradas se reparten como tiempo o crédito para todos, no desempleo; asamblea fija reinversión vs liberación |
| R6.2 | Automatización evaluada por costo energético (TQ) y trabajo desplazado (R4.1) |
| R6.3 | Destrabajo ético: ningún nodo lo logra haciendo que otros trabajen más |

---

## 5. Salvaguardas

| ID | Salvaguarda |
|----|-------------|
| S1 | Privacidad: datos de salud personales no se escriben en el ledger (inmutable); quedan en dispositivo; red solo recibe agregados/atestaciones sin identidad |
| S2 | Voluntariedad: ningún dato de salud modifica límites de TQ ni crédito ZNU |
| S3 | Intervenciones en humanos: consentimiento informado, comité de ética, sin incentivos económicos por participar; derechos de esfuerzo solo laboratorio/cultivo |
| S4 | Limitación declarada: ingesta autorreportada es ruidosa; distinguir verificado (lotes, cosecha) de declarado |
| S5 | Tope energético por nodo, vía TQ |
| S6 | Revisión periódica de métricas por la asamblea |

---

## 6. Compatibilidad y Licencias

- LPF-1.0 (Red de Intercambio Federada): todo fork debe seguir siendo federable con el principal; paridad de métrica entre nodos para conciliar kWh y g PSE.
- LPF-1.0 prohíbe relicenciar o combinar con código propietario. Si código de la Red entra al repo Marca Blanca (MIT), revisar compatibilidad antes de copiarlo.
- Cambiar la unidad afecta `pricing.md`, `currency_exchange.md` y `PRINCIPIOS_INNEGOCIABLES.md` del repo de la Red.

---

## 7. Integración con specs ALRAC existentes

| Spec ALRAC | Punto de integración |
|------------|---------------------|
| ZNU (Capa 3) | Ancla g PSE, expiración 90 días, factor canata modo conectado, no redimible |
| TQ (Capa 1) | Invariante 1 kWh, costo energético en reportes Simbiodisc (R4.2) |
| CaaS | Acceso por contribución, subsidiar acceso no conducta, piso de equidad |
| boundaries.ts | DENY: ZNU redimible biomasa, TQ ≠ 1 kWh, datos salud en ledger |
| registrySystem.ts | Registro de terrarios, lotes, control calidad |
| currentSeeSystem.ts | Panel Simbiodisc visible, trazabilidad de mediciones |

---

## 8. Criterios de aceptación

- [ ] `crearAnclaZNU()` crea ancla con g PSE, protocolo PSE, terrarios, expiración 90 días
- [ ] `esZNURedimibleEnBiomasa()` retorna false siempre
- [ ] `registrarTerrario()` valida maduración 30-45 días y control calidad
- [ ] `calcularSDT()` calcula H_total / (personas × días nutrición base)
- [ ] `calcularSDTRel()` calcula SD-T / H_canasta
- [ ] `registrarIngestaSDN()` registra g PSE/día, días continuos, lote, calidad, diversidad
- [ ] `registrarMedicionSDL()` registra mediciones funcionales, línea base individual
- [ ] `registrarItemCuidadoSDF()` registra precio, tiempo, distancia, pasos, tasa abandono
- [ ] `activarAlertaSDT()` activa si SD-T sube (valor ≥ 1 umbral)
- [ ] `procesarCicloRetroalimentacion()` ejecuta ciclo medir → bajar fricción → liberar → reinvertir → medir
- [ ] `graduarItemCuidado()` retira apoyo de ítem graduado y reasigna al de mayor fricción
- [ ] `boundaries.ts` DENY: ZNU redimible biomasa, TQ ≠ 1 kWh, datos salud en ledger, consecuencias económicas por datos salud
- [ ] 0 errores TypeScript nuevos

---

## 9. Vectores de prueba

```typescript
// crearAnclaZNU
Input: { unidad: 'g_PSE', protocoloPSE: { filtrado: 'malla_50um', materiaSeca: 8, secado: 'baja_temperatura' }, expiracionDias: 90 }
Expected: ancla creada con unidad='g_PSE', noRedimible=true, expiracionDias=90
```

```typescript
// calcularSDT
Input: { hTotal: 400, personas: 10, diasNutricionBase: 30 }
Expected: SD-T = 1.33 (400 / (10 × 30))
```

```typescript
// calcularSDTRel
Input: { sdt: 1.33, hCanasta: 2.0 }
Expected: SD-T_rel = 0.665 (menor que 1, libera tiempo)
```

```typescript
// activarAlertaSDT
Input: { sdtActual: 1.5, sdtAnterior: 1.2 }
Expected: alerta = true (subió)
```

```typescript
// boundaries DENY
Input: znuRedimibleBiomasa = true → Expected: error "ZNU no redimible en biomasa física"
Input: tqNoEsUnKwh = true → Expected: error "TQ debe mantenerse en 1 kWh"
Input: datosSaludEnLedger = true → Expected: error "Datos de salud no se escriben en el ledger"
```

---

## 10. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `znu` | 1.0.0 | ZNU moneda anfibia, expiración, no redimible |
| `tq` | 1.0.0 | TQ 1 kWh, costo energético |
| `caas` | 1.0.0 | Acceso por contribución, piso de equidad |
| `registrySystem` | 1.0.0 | Registro de terrarios, lotes, control calidad |
| `boundaries` | 1.0.0 | Límites duros |
| `currentSeeSystem` | 1.0.0 | Trazabilidad de mediciones Simbiodisc |

---

## 11. Referencias

- `docs/alrac-znu-espirulina-anchor_backup.md` — Texto completo del borrador v0.1
- `src/core/lib/znu.ts` — ZNU moneda anfibia
- `src/core/lib/tq.ts` — TQ 1 kWh invariante
- `src/core/lib/caas.ts` — Comunidad como Servicio
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/currentSeeSystem.ts` — Corrientes unificadas
- LPF-1.0 — Red de Intercambio Federada (federabilidad, paridad métrica)
