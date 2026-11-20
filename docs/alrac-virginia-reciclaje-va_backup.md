# RESPALDO DE FUENTE — alrac-virginia-reciclaje-va — Reciclaje de Valor Agregado vía Sistema Virginia + USH

## Identificación de la fuente

- **Título:** alrac-virginia-reciclaje-va — Reciclaje de Valor Agregado vía Sistema Virginia + Universal Share Holding
- **Tipo:** Spec de diseño interno ALRAC (borrador v0.1)
- **Estado:** borrador v0.1 · parámetros PROVISIONALES · sin validación empírica
- **Capa ALRAC:** 3 (membrana fiat/ZNU) y 5 (gobernanza), con anclaje físico en Capa 1 (TQ)
- **Depende de:** `alrac-znu-indexing-credit`, `alrac-caas-revenue-streams`, `alrac-governance-holonic`, `alrac-tq-*`, `alrac-revenue`
- **Relacionada:** `alrac-ial-autotrofia-longeva` (IAL), `ECOSYSTEM_REVENUE_SHARING.md`
- **Fuente:** archivo proporcionado por el usuario (`Downloads/documentos HSCSG/alrac-virginia-reciclaje-va.md`)

## ⚖️ Aviso de derechos de autor y estado provisional

Este documento es un **borrador de diseño interno** del propio proyecto ALRAC/Zeitnus. Está marcado explícitamente como:

> **Estado:** borrador v0.1 · parámetros PROVISIONALES · sin validación empírica

> Lo marcado **[PROPUESTA]** es diseño nuevo de este spec; no existe aún en el repo.

> Antes de pasar a v0.2 hay que verificar: cifras (39 posiciones, 5 % demurrage, umbral 300 ZNU, pesos de nivel), nombres de funciones y firmas contra el repo.

Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. **No se reclama autoría sobre el contenido;** es un diseño interno del propio usuario/repo, reproducido aquí con el carácter de borrador provisional que el documento declara. Antes de cualquier uso productivo, verificar línea por línea contra `virginiaNetwork.ts`, `virginia.ts` y `VIRGINIA_NETWORK_RECREATIVO_IE_v2.md`.

## Texto completo de la fuente

# alrac-virginia-reciclaje-va — Reciclaje de Valor Agregado vía Sistema Virginia + Universal Share Holding

> **Estado:** borrador v0.1 · parámetros PROVISIONALES · sin validación empírica
> **Capa ALRAC:** 3 (membrana fiat/ZNU) y 5 (gobernanza), con anclaje físico en Capa 1 (TQ)
> **Depende de:** `alrac-znu-indexing-credit`, `alrac-caas-revenue-streams`, `alrac-governance-holonic`, `alrac-tq-*`, `alrac-revenue`
> **Relacionada:** `alrac-ial-autotrofia-longeva` (IAL), `ECOSYSTEM_REVENUE_SHARING.md`

---

## 0. Nota de verificación (leer primero)

La descripción del Sistema Virginia de la sección 2 proviene de un resumen del código (`virginiaNetwork.ts`, `virginia.ts`, `VIRGINIA_NETWORK_RECREATIVO_IE_v2.md`) que el autor pegó. **No fue contrastada línea por línea contra el repo.** Antes de pasar a v0.2 hay que verificar: cifras (39 posiciones, 5 % demurrage, umbral 300 ZNU, pesos de nivel), nombres de funciones y firmas.

Lo marcado **[PROPUESTA]** es diseño nuevo de este spec; no existe aún en el repo.

---

## 1. Propósito

Hacer explícito que Virginia ya contiene un primer mecanismo de reciclaje de valor agregado (el demurrage que vuelve al pool comunitario) y extenderlo en un ciclo completo, con un piso universal de participación (**Universal Share Holding, USH**) que evita que el reciclaje se concentre en las posiciones del árbol.

**Definición operativa de USH [PROPUESTA]:** cada miembro activo de la red tiene exactamente una participación igual, intransferible y no vendible en el flujo del Pool de reciclaje. Es custodia, no propiedad: da derecho al flujo, no a liquidación ni a herencia.

---

## 2. Sistema Virginia: estado actual (según resumen, por verificar)

| Elemento | Descripción |
|---|---|
| Módulo | Virginia Network Recreativo, Prototipo IE v2 |
| Árbol | 3 niveles, 39 posiciones: 3 (N1) → 9 (N2) → 27 (N3) |
| Capital semilla | RCE Plena = 1,000 USD por raíz; N2 = 1/3 RCE; N3 = 1 RCE |
| Modos | `nodeMode: 'postmonetario' \| 'conectado'`; `priceParity` default 1 ZNU = 10 USDC |
| Compliance | `checkVirginiaMJCompliance()`: Ley I automática (no toca base material), Ley II ROI ≥ 1, Ley III PGS real > 0; el reparto solo corre si `overall === 'ok'` |
| Reparto | `peso = levelWeight × (0.5 + avgAut) × (0.5 + cds)`; N3 pesa 2.0 |
| Demurrage | 5 % sobre el exceso de 300 ZNU, redistribuido al pool comunitario |
| Integración | `virginiaAsCaaSStream()`, key `virginia_network_recreativo`; slice `VirginiaState` con `SET_CONFIG`, `SET_MEMBER`, `TOGGLE_POSITION`, `REBUILD_TREE` |

### 2.1 Limitaciones conocidas (de `ECOSYSTEM_REVENUE_SHARING.md`)

1. 39 posiciones fijas: no escala a una red de N miembros.
2. Semilla ficticia de 3,000 USD: el ROI y el reparto se calculan sobre capital no real.
3. Peso N3 = 2.0 asumido, sin validar contra AUT medido.
4. Cero reparto a Capa 0 / 0.5.

Este spec **no resuelve** (4); se coordina con el modelo de círculos concéntricos de ese documento (ver §9).

---

## 3. Alcance

**Dentro:** (a) medición del valor agregado real; (b) retención hacia el Pool; (c) tres canales de salida; (d) capa USH de dividendo igualitario; (e) topes anti-captura; (f) métricas y circuit breakers.

**Fuera:** reparto Amid 35/35/30 (`alrac-revenue`), fondos Memoria/Cuidado/Autotrofia (se define solo la interfaz, §7), conversión TQ↔fiat (prohibida), constitución legal.

---

## 4. Modelo [PROPUESTA]

### 4.1 Valor agregado

```
VA_i,t = ingresos_i,t (fiat + ZNU) − insumos_externos_i,t
```

Solo cuenta VA **real y auditable**. Un VA simulado nunca habilita reparto (regla consistente con el veredicto @alrac-review del repo: αʰ simulado ≠ αʰ real).

### 4.2 Alimentación del Pool Virginia

```
P_t = D_t + Σ_i  r_i · max(0, VA_i,t)
D_t = Σ_p 0.05 · max(0, B_p − 300)            # demurrage existente
r_i = r0 · (1 + λ · (1 − IAL_i))              # r0, λ provisionales
```

- `r0` inicial propuesto: 0.10; `λ`: 0.5; `r_i` acotado a [0.05, 0.20].
- Un nodo con IAL bajo (más dependiente de insumos externos) recicla más; uno autotrófico, menos.
- Si IAL aún no existe para el nodo, usar `r0`.

### 4.3 Salidas del Pool

```
φ_R + φ_C + φ_D = 1        (provisional: 0.40 / 0.20 / 0.40)
```

| Canal | Qué hace | Regla |
|---|---|---|
| φ_R Reinversión | Financia nodos con IAL bajo para cerrar lazos metabólicos | Prioridad por menor IAL; sin interés |
| φ_C Crédito mutuo | ZNU a 2–3 % (costo administrativo) | Reutiliza `alrac-znu-indexing-credit` |
| φ_D Dividendo universal | Pago igualitario a todos los miembros activos | `d = φ_D · P_t / N_activos` |

### 4.4 Capa USH

- Una participación por miembro activo, sin excepción de nivel ni posición.
- Se extingue al salir; el derecho vuelve al Pool (no se hereda ni se vende).
- El dividendo se paga en TQ/ZNU **no convertibles a fiat ni cripto**, y **caduca a los 90 días** (Postulado 4), por lo que debe circular o reinvertirse.
- Respeta el límite TQ ±500 por miembro; el excedente de dividendo se redirige a φ_R.

### 4.5 Relación con el árbol de 39 posiciones

El árbol Virginia queda como **capa de incentivo recreativa** encima del piso USH:

```
recibido_total_m = d  +  reparto_arbol_m
```

Para evitar que el árbol reproduzca jerarquía:

```
max_m(recibido_total) / min_m(recibido_total) ≤ ρ        (ρ provisional = 3)
```

Si se excede, el exceso del árbol se reasigna al Pool. Con esto el peso N3 = 2.0 deja de ser decisivo mientras no se valide contra AUT real.

---

## 5. Requisitos (SHALL)

1. El sistema SHALL calcular VA solo con datos reales; SHALL rechazar semillas ficticias como base de reparto.
2. El sistema SHALL ejecutar `checkVirginiaMJCompliance()` antes de cada ciclo; si `overall !== 'ok'`, SHALL NOT distribuir.
3. La suma de todas las salidas del Pool en un ciclo SHALL ser ≤ `P_t` (sin creación de valor).
4. El dividendo USH SHALL ser idéntico para todos los miembros activos.
5. Ningún pago USH SHALL ser convertible a fiat/cripto ni transferible fuera de la red.
6. El dividendo SHALL caducar a los 90 días y su remanente SHALL volver al Pool.
7. El ratio de captura SHALL mantenerse ≤ ρ en cada ciclo.
8. Todo ciclo SHALL registrar: VA por nodo, `r_i`, `P_t`, asignación por canal y `N_activos`, con trazabilidad ValueFlows.
9. Si αʰ < κ (γ-CARMIS activo), el sistema SHALL detener nuevas distribuciones hasta el Paso II del operador soberano.

---

## 6. Escenarios

**E1 — Ciclo normal.** *Given* compliance `ok` y VA real > 0 en 5 nodos; *When* cierra el periodo; *Then* se forma `P_t`, se reparte 40/20/40 y todos los miembros reciben el mismo `d`.

**E2 — Nodo autotrófico.** *Given* nodo con IAL alto; *When* se calcula `r_i`; *Then* recicla cerca del piso 0.05, y no queda penalizado.

**E3 — Captura por el árbol.** *Given* una posición N3 con peso alto; *When* `recibido_total` excede ρ veces el mínimo; *Then* el exceso se reasigna al Pool.

**E4 — Compliance falla.** *Given* ROI < 1 (Ley II); *When* se intenta el ciclo; *Then* no hay distribución y se registra el motivo.

**E5 — Salida de miembro.** *Given* un miembro con dividendo sin caducar; *When* sale; *Then* su participación y saldo vuelven al Pool.

---

## 7. Interfaces [PROPUESTA]

```ts
export interface VirginiaRecyclingConfig {
  r0: number;            // 0.10
  lambdaIAL: number;     // 0.5
  rMin: number;          // 0.05
  rMax: number;          // 0.20
  phiR: number;          // 0.40
  phiC: number;          // 0.20
  phiD: number;          // 0.40
  demurrageRate: number; // 0.05   (existente)
  demurrageFloorZNU: number; // 300 (existente)
  captureRatioMax: number;   // 3
  dividendExpiryDays: number; // 90
}

export interface RecyclingCycleResult {
  poolTotal: number;
  allocation: { reinvestment: number; credit: number; dividend: number };
  dividendPerMember: number;
  activeMembers: number;
  captureRatio: number;
  complianceOk: boolean;
  carmisBlocked: boolean;
}

export function runVirginiaRecyclingCycle(
  state: VirginiaState,
  cfg: VirginiaRecyclingConfig
): RecyclingCycleResult;
```

Interfaz con fondos Memoria/Cuidado/Autotrofia: salida de φ_R puede alimentar el fondo de Autotrofia; la relación exacta con el reparto 15/50/35 queda abierta (§9).

---

## 8. Métricas

| Métrica | Fórmula | Lectura |
|---|---|---|
| Tasa de reciclaje | `TR = P_t / ΣVA` | Cuánto VA vuelve a circular |
| Velocidad del Pool | `v = salidas_t / saldo_pool` | Si baja de umbral, alerta γ-CARMIS |
| Ratio de captura | `RC = max/min recibido_total` | Debe ser ≤ ρ |
| Fuga | `VA_salido_en_fiat / ΣVA` | Riesgo de renta extractiva |
| Cobertura USH | `miembros_con_dividendo / N_activos` | Debe ser 1.0 |

---

## 9. Preguntas abiertas

1. **Árbol fijo vs. red de N miembros.** ¿Los 39 puestos pasan a ser capa de incentivo o se reemplazan por un árbol dinámico?
2. **Pool vs. círculos concéntricos.** ¿Cómo se coordina con el modelo 15/20/35/30 de `ECOSYSTEM_REVENUE_SHARING.md`, incluido el reparto a Capa 0/0.5?
3. **Pool vs. fondos 15/50/35.** ¿El Pool es etapa previa que los alimenta, o paralelo?
4. **Medición de VA sin contador central.** ¿Quién audita insumos externos y con qué evidencia?
5. **Calibración.** `r0`, `λ`, φ y ρ requieren piloto real (línea A).
6. **Validación del peso N3 = 2.0** contra AUT medido.

---

## 10. Riesgos

- **Legal:** un dividendo por participación puede interpretarse como valor o captación. Mitigación: derecho de acceso en una cooperativa de trabajo asociado, sin captar ahorro hasta tener 2–3 años de balance auditado.
- **Gaming del VA:** inflar insumos para bajar `r_i`. Mitigación: auditoría cruzada y reporte público de insumos.
- **Fuga en fiat:** dividendos no convertibles pueden frenar la adopción. Mitigación: ampliar la canasta de bienes y servicios aceptados dentro de la red.
- **Pérdida de incentivo:** el tope ρ puede desincentivar a quienes sostienen más. Mitigación: calibrar ρ con el piloto.

---

## 11. Trazabilidad

| Elemento | Fuente |
|---|---|
| Árbol, compliance, reparto, demurrage, CaaS | `virginiaNetwork.ts`, `virginia.ts`, `VIRGINIA_NETWORK_RECREATIVO_IE_v2.md` (por verificar) |
| Limitaciones | `ECOSYSTEM_REVENUE_SHARING.md` |
| ZNU, caducidad, crédito | `alrac-znu-indexing-credit` |
| IAL | `alrac-ial-autotrofia-longeva` |
| γ-CARMIS | `CAOS_MODELONEGOCIO_ANALISIS.md` |

*Borrador v0.1 — 2026-11-19*
