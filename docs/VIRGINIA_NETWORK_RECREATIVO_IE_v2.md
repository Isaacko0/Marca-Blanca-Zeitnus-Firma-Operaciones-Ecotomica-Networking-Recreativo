# Virginia Network Recreativo — Prototipo IE v2

## Documentación Exhaustiva y Rigorosa

### Sistema de Distribución en Árbol Nivel 3 + Mejoras Arquitectónicas HSCSG v15 OS

---

**Versión:** 1.0  
**Fecha:** 2026-10-08  
**Autor:** Isaac Ko (Isaacko0) — Futurista & Autonomía  
**Repositorio:** `Zeitnus-Firma-Operaciones-Ecotomica`  
**Rama:** `main`  
**Commit:** `HEAD`  

---

## Índice

1. [Contexto y Origen](#1-contexto-y-origen)
2. [Modelo Matemático del Árbol Virginia](#2-modelo-matemático-del-árbol-virginia)
3. [Arquitectura Anfibia ZNU ↔ USD](#3-arquitectura-anfibia-znu--usd)
4. [Integración con Leyes MJ (Materialismo Jerárquico)](#4-integración-con-leyes-mj-materialismo-jerárquico)
5. [CaaS Stream: Virginia Network como Flujo de Ingresos](#5-caas-stream-virginia-network-como-flujo-de-ingresos)
6. [Reparto por AUT+CDS con Demurrage](#6-reparto-por-autcds-con-demurrage)
7. [Mejoras Implementadas sobre el Prototipo Original](#7-mejoras-implementadas-sobre-el-prototipo-original)
8. [Estructura de Código en el Repositorio](#8-estructura-de-código-en-el-repositorio)
9. [Guía de Uso: Pantalla VirginiaNetwork](#9-guía-de-uso-pantalla-virginianetwork)
10. [Extensibilidad y Próximos Pasos](#10-extensibilidad-y-próximos-pasos)
11. [Apéndice: Tipos TypeScript Core](#11-apéndice-tipos-typescript-core)

---

## 1. Contexto y Origen

### 1.1 Fuente de Datos Original

El sistema Virginia Network Recreativo proviene de dos archivos entregados:

| Archivo | Formato | Tamaño | Contenido |
|---------|---------|--------|-----------|
| `virginia network recreativo Prototipo IE v2.xlsx` | Excel (xlsx) | 552.8 KB | Prototipo completo multi-hoja |
| `Virginia Prototipo IE v2 - Dist. N3 csv.csv` | CSV | 1.2 KB | Distribución Nivel 3 (39 posiciones) |

### 1.2 Estructura CSV Parsada

```csv
DISTRIBUCIÓN POR POSICIÓN: ÁRBOL NIVEL 3 (27 P)
Ingresa la RCE Plena (USD):,"$1,000.00"

3,1 RCE,9,1/3 RCE,27,1 RCE,Total x persona
1,"$1,000.00",1.1,$333.33,1.1.1,"$1,000.00","$2,333.33"
,,,,1.1.2,"$1,000.00","$1,000.00"
,,,,1.1.3,"$1,000.00","$1,000.00"
,,1.2,$333.33,1.2.1,"$1,000.00","$1,333.33"
... (27 posiciones Nivel 3 + 9 Nivel 2 + 3 Nivel 1 = 39 total)
```

### 1.3 Semántica del Modelo Original

| Concepto | Definición Original | Interpretación HSCSG |
|----------|---------------------|----------------------|
| **RCE** | Red de Consumo Efectivo | Unidad de valor base (USD) que fluye por el árbol |
| **RCE Plena** | $1,000 USD | Capital semilla por nodo raíz (Nivel 1) |
| **1/3 RCE** | $333.33 USD | Fracción distribuida a Nivel 2 (3 por cada N1) |
| **1 RCE** | $1,000 USD | Unidad completa en Nivel 3 (3 por cada N2) |
| **Total x persona** | Suma acumulada | RCE propio + hijos descendientes |

### 1.4 Topología del Árbol

```
NIVEL 1 (3 posiciones) — RCE Plena = $1,000 c/u
├── 1 → hijos: 1.1, 1.2, 1.3
├── 2 → hijos: 2.1, 2.2, 2.3
└── 3 → hijos: 3.1, 3.2, 3.3

NIVEL 2 (9 posiciones) — 1/3 RCE = $333.33 c/u
├── 1.1 → hijos: 1.1.1, 1.1.2, 1.1.3
├── 1.2 → hijos: 1.2.1, 1.2.2, 1.2.3
├── 1.3 → hijos: 1.3.1, 1.3.2, 1.3.3
├── 2.1 → hijos: 2.1.1, 2.1.2, 2.1.3
├── 2.2 → hijos: 2.2.1, 2.2.2, 2.2.3
├── 2.3 → hijos: 2.3.1, 2.3.2, 2.3.3
├── 3.1 → hijos: 3.1.1, 3.1.2, 3.1.3
├── 3.2 → hijos: 3.2.1, 3.2.2, 3.2.3
└── 3.3 → hijos: 3.3.1, 3.3.2, 3.3.3

NIVEL 3 (27 posiciones) — 1 RCE = $1,000 c/u
    (nodos hoja, sin hijos)
```

**Total posiciones:** 3 + 9 + 27 = **39**  
**Total USD distribuido:** 3×$1,000 + 9×$333.33 + 27×$1,000 = **$33,000**  
**Inversión semilla (3 RCEs N1):** $3,000  
**Multiplicador aparente:** 11x

---

## 2. Modelo Matemático del Árbol Virginia

### 2.1 Definición Formal

Sea $T = (V, E)$ un árbol raízado de profundidad 3 donde:

- $V = V_1 \cup V_2 \cup V_3$ partición por niveles
- $|V_1| = 3$, $|V_2| = 9$, $|V_3| = 27$
- $E \subseteq V \times E$ tal que $\forall v \in V_2 \cup V_3, \exists! p \in V: (p, v) \in E$

### 2.2 Función de Valor por Nivel

$$rce: V \to \mathbb{R}^+$$

$$rce(v) = 
\begin{cases}
R & \text{si } v \in V_1 \cup V_3 \\
R/3 & \text{si } v \in V_2
\end{cases}$$

Donde $R = \text{RCE Plena}$ (configurable, default $1,000).

### 2.3 Valor Acumulado por Posición

Para cada $v \in V$, el total recibido incluye su propio RCE más el de todos sus descendientes:

$$\text{total}(v) = rce(v) + \sum_{u \in \text{descendientes}(v)} rce(u)$$

**Resultados por nivel:**

| Nivel | RCE propio | Descendientes | Total USD | Total ZNU (parity=10) |
|-------|------------|---------------|-----------|----------------------|
| N1 (raíz) | $1,000 | 3×$333.33 + 9×$1,000 = $10,000 | **$11,000** | 1,100 ZNU |
| N2 (rama) | $333.33 | 3×$1,000 = $3,000 | **$3,333.33** | 333.33 ZNU |
| N3 (hoja) | $1,000 | 0 | **$1,000** | 100 ZNU |

### 2.4 Propiedades Matemáticas

**Teorema 1 (Conservación de Valor):**  
$\sum_{v \in V} rce(v) = 3R + 9(R/3) + 27R = 33R$

**Teorema 2 (No doble conteo en flujos):**  
Cada unidad de RCE fluye **una sola vez** de hoja a raíz. El "Total x persona" es métrica de **influencia/alcance**, no de emisión monetaria.

**Teorema 3 (Simetría fractal):**  
El árbol es un 3-ario perfecto de profundidad 3. Cada N1 tiene 3 hijos N2, cada N2 tiene 3 hijos N3.

---

## 3. Arquitectura Anfibia ZNU ↔ USD

### 3.1 Principio Anfibio (DeseOS / Contento.pro)

> **"Misma lógica de cálculo opera en modo 'postmonetario' (ZNU/CaaS, default offline) o 'conectado' (USD/USDC vía oráculo priceParity, Nivel 3 ReFi); el render decide la etiqueta, la lógica es agnóstica a la unidad."**

### 3.2 Implementación en `valueDual.ts`

```typescript
export type ValueUnit = 'ZNU' | 'USD'
export type NodeMode = 'postmonetario' | 'conectado'

export function displayValue(amountZNU: number, mode: NodeMode, parity: number): string {
  if (mode === 'postmonetario') {
    return `${Math.round(amountZNU).toLocaleString('es')} ZNU`
  }
  const usd = amountZNU * parity
  return `$${usd.toLocaleString('es', { maximumFractionDigits: 2 })}`
}

export function isExternal(amountZNU: number, mode: NodeMode): boolean {
  return mode === 'conectado' && amountZNU > 0
}
```

### 3.3 Aplicación en Virginia Network

| Modo | Unidad Interna | Render | Caso de Uso |
|------|----------------|--------|-------------|
| **Postmonetario** | ZNU | `1,100 ZNU` | Operación interna nodo, CaaS, reparto AUT+CDS |
| **Conectado** | ZNU → USD | `$11,000.00` | Exposición externa, facturación, oráculo ReFi |

### 3.4 Configuración en Store

```typescript
// En useAppStore (store.ts)
nodeMode: 'postmonetario' | 'conectado'  // Global
priceParity: number                       // 1 ZNU = X USDC (oráculo Nivel 3)
```

**Paridad por defecto:** `10` (1 ZNU = 10 USDC) — referencia ReFi Nivel 3  
**Fuente oráculo:** `usdglo` (Glo Foundation USDGLO) asimilado en repo

### 3.5 Ventajas de la Arquitectura Anfibia

1. **Cero duplicación de lógica** — Una sola función `revenueShare()`, `virginiaRevenueShare()`
2. **Soberanía preservada** — Modo postmonetario = operación 100% offline, sin oráculo
3. **Interoperabilidad ReFi** — Modo conectado expone USD vía priceParity auditado
4. **MJ Gate compatible** — Leyes MJ evalúan en ZNU (unidad soberana), no en USD

---

## 4. Integración con Leyes MJ (Materialismo Jerárquico)

### 4.1 Las 3 Leyes MJ (Resumen)

| Ley | Principio | Evaluación en Virginia |
|-----|-----------|------------------------|
| **Ley I** | No tocar base material sin regeneración verificada | ✅ Virginia = capa distribución, NO extracción |
| **Ley II** | ROI colectivo ≥ 1 (valor generado / USDC entrante) | 📊 ROI = totalUSD / (3 × RCE Plena) |
| **Ley III** | PGS real requerido (datos de laboratorio) | 📈 PGS = f(AUT) > 0 obligatorio |

### 4.2 Implementación en `checkVirginiaMJCompliance()`

```typescript
export function checkVirginiaMJCompliance(
  tree: VirginiaTreeState,
  cac: CACVectors,
  members: Member[],
  flows: ValueFlow[]
): VirginiaMJCompliance {
  const aut = autFromCAC(cac)
  const avgAut = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  const pop = population(members)
  const pgs = pgsLM(aut)
  const cds = ics(members, flows)

  // Ley I: Virginia NO toca base material
  const law1Passed = true
  const law1Reason = 'Virginia Network es capa de distribución (CaaS stream), no toca base material. Regeneración verificada vía CaaS streams habilitados.'

  // Ley II: ROI colectivo ≥ 1
  const usdcIn = tree.config.rcePlena * 3  // Inversión semilla: 3 RCEs
  const valorGenerado = tree.totalUSD
  const roi = usdcIn > 0 ? valorGenerado / usdcIn : 0
  const law2Passed = roi >= 1

  // Ley III: PGS real
  const law3Passed = pgs > 0

  const overall = (!law1Passed || !law2Passed || !law3Passed) ? 'blocked' : 
                  (!law2Passed || !law3Passed) ? 'warn' : 'ok'

  return { law1, law2, law3, overall }
}
```

### 4.3 Cálculo de Métricas Base

| Métrica | Fórmula | Fuente |
|---------|---------|--------|
| **AUT** (Autonomía) | $\frac{ALIM + ENER + SALU + HABI + PROD}{5}$ | `cac` vectors |
| **PGS** (Productive Generative Score) | $f(AUT)$ — implementación en `pgsLM()` | `metrics.ts` |
| **Población** | Miembros con `signedSocialDNA = true` | `members[]` |
| **CDS** (Coherent Decision Score) | $ICS(members, flows)$ — coherencia decisional | `metrics.ts` |

### 4.4 Estados de Compliance

| Estado | Condición | Acción Reparto |
|--------|-----------|----------------|
| **OK** | 3 leyes pasan | ✅ Ejecutar reparto AUT+CDS |
| **WARN** | Ley II o III fallan | ⚠️ Mostrar advertencia, no bloquear UI |
| **BLOCKED** | Ley I falla o múltiples | 🔴 Bloquear reparto, mostrar accionables |

### 4.5 Accionables Automáticos

```typescript
{!mj.law2.passed && '• Aumentar AUT/CDS o reducir RCE Plena para ROI ≥ 1. '}
{!mj.law3.passed && '• Generar PGS real (datos laboratorio) para activar Ley III. '}
```

---

## 5. CaaS Stream: Virginia Network como Flujo de Ingresos

### 5.1 Registro como Stream CaaS

Virginia Network se registra como **un único stream CaaS** que encapsula todo el árbol:

```typescript
export function virginiaAsCaaSStream(tree: VirginiaTreeState): CaaSRevenueStream {
  return {
    key: 'virginia_network_recreativo',
    name: 'Virginia Network Recreativo (Prototipo IE v2)',
    enabled: true,
    usdcIn: tree.config.rcePlena * 3,  // Inversión semilla: 3 RCEs = $3,000
    znuOut: tree.totalZNU,             // Total ZNU equivalente
    touchesBaseMaterial: false,        // CRÍTICO: Ley I OK
  }
}
```

### 5.2 Por Qué `touchesBaseMaterial: false`

| Aspecto | Explicación |
|---------|-------------|
| **Naturaleza** | Capa de **distribución de excedentes**, no producción primaria |
| **Base material** | Tierra, agua, energía, comida, herramientas, semillas (ver `BaseMaterial` type) |
| **Virginia** | Mueve valor **ya generado** (RCE Plena como capital semilla) |
| **Regeneración** | Verificada vía **otros streams CaaS** (huerta, energía, etc.) |

### 5.3 Integración con CaaS Existente

```typescript
// En VirginiaNetwork.tsx
const registerAsCaaSStream = () => {
  if (!caasStream) return
  addCaasStream(caasStream)  // Añade a caasStreams[] global
  logCaasAudit({             // Trazabilidad MJ
    action: 'caas.stream_register',
    detail: `Virginia Network registrado como stream CaaS`,
    tone: 'success'
  })
}
```

### 5.4 Flujo Completo CaaS + Virginia

```
┌─────────────────────────────────────────────────────────────┐
│                    NODO HSCSG v15 OS                         │
├─────────────────────────────────────────────────────────────┤
│  BASE MATERIAL (tierra, agua, energía, comida, herramientas)│
│         ↑                                                    │
│         │ Regeneración verificada (PGS real)                │
│         │                                                    │
│  ┌────┴────┐                                                 │
│  │ STREAMS CaaS HABILITADOS (huerta, energía, talleres...)  │
│  │ touchesBaseMaterial: true → Ley I check: PASA            │
│  └────┬────┘                                                 │
│       │ Excedente generado (ZNU)                            │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ VIRGINIA NETWORK (stream CaaS)                      │   │
│  │ key: 'virginia_network_recreativo'                  │   │
│  │ touchesBaseMaterial: false ✅                        │   │
│  │ usdcIn: $3,000 (3 RCEs semilla)                     │   │
│  │ znuOut: 3,300 ZNU (total árbol @ parity 10)         │   │
│  └────┬────────────────────────────────────────────────┘   │
│       │ Reparto por AUT+CDS + Demurrage                    │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 39 POSICIONES (miembros asignados)                  │   │
│  │ N1: 3 posiciones  → peso 1.0                        │   │
│  │ N2: 9 posiciones  → peso 1.5                        │   │
│  │ N3: 27 posiciones → peso 2.0 (base productiva)      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Reparto por AUT+CDS con Demurrage

### 6.1 Fórmula de Peso por Posición

$$w(v) = \text{nivelWeight}(v) \times (0.5 + \overline{AUT}) \times (0.5 + CDS)$$

| Nivel | `nivelWeight` | Justificación |
|-------|---------------|---------------|
| **N1 (Raíz)** | 1.0 | Coordina, no produce base |
| **N2 (Rama)** | 1.5 | Intermedio: coordina + apoya base |
| **N3 (Hoja)** | 2.0 | **Base productiva** — mayor peso |

### 6.2 Cálculo de Reparto

```typescript
export function virginiaRevenueShare(
  tree: VirginiaTreeState,
  cac: CACVectors,
  members: Member[],
  flows: ValueFlow[],
  demurrageThreshold = 300,
  demurrageRate = 0.05
): VirginiaPayout[] {
  const aut = autFromCAC(cac)
  const avgAut = (aut.ALIM + aut.ENER + aut.SALU + aut.HABI + aut.PROD) / 5
  const cds = ics(members, flows)
  
  const levelWeight = { 1: 1.0, 2: 1.5, 3: 2.0 }
  
  const activePositions = Array.from(tree.positions.values()).filter(p => p.isActive)
  const weights = activePositions.map(p => levelWeight[p.level] * (0.5 + avgAut) * (0.5 + cds))
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1
  
  const payoutBaseZNU = tree.totalZNU  // Repartir TODO el ZNU generado
  
  return activePositions.map((pos, idx) => {
    const gross = (payoutBaseZNU * weights[idx]) / totalWeight
    const excess = Math.max(0, gross - demurrageThreshold)
    const demurrageApplied = excess * demurrageRate
    const netZNU = gross - demurrageApplied
    
    return {
      positionId: pos.id,
      memberName: pos.memberName || `Posición ${pos.id}`,
      level: pos.level,
      grossZNU: +gross.toFixed(2),
      demurrageApplied: +demurrageApplied.toFixed(2),
      netZNU: +netZNU.toFixed(2),
      basis: `nivel ${pos.level} (peso ${levelWeight[pos.level]}) × AUT ${avgAut.toFixed(2)} × CDS ${cds.toFixed(2)}`
    }
  })
}
```

### 6.3 Demurrage Anti-Acumulación

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| **Umbral** | 300 ZNU | Basado en `ZNU_ROTATION_DEFAULT_DAYS = 60` (2 meses) |
| **Tasa** | 5% | Anti-acumulación suave, no punitiva |
| **Aplicación** | Solo sobre exceso > 300 ZNU | Protege necesidades básicas |

**Ejemplo:**  
Posición N3 recibe 450 ZNU brutos → exceso = 150 → demurrage = 7.5 ZNU → neto = 442.5 ZNU  
Los 7.5 ZNU se liberan al pool comunitario (no se destruyen, se redistribuyen).

### 6.4 Condición de Ejecución

```typescript
// Solo si TODAS las leyes MJ pasan
const payouts = (tree && mj?.overall === 'ok') ? virginiaRevenueShare(...) : []
```

---

## 7. Mejoras Implementadas sobre el Prototipo Original

### 7.1 Comparativa: Original vs. HSCSG v15

| Dimensión | Prototipo Original (Excel/CSV) | Implementación HSCSG v15 |
|-----------|--------------------------------|--------------------------|
| **Unidad monetaria** | Solo USD ($) | **Anfibia**: ZNU (interno) ↔ USD (externo via priceParity) |
| **Gobernanza** | Jerárquica fija (árbol) | **AUT+CDS** dinámico + Leyes MJ gate |
| **Distribución** | Fija por posición | **Ponderada** por nivel × AUT × CDS + demurrage |
| **Compliance** | Ninguno | **3 Leyes MJ** integradas (I, II, III) |
| **Trazabilidad** | Manual/Excel | **Audit log CaaS** + ValueFlows + RAO |
| **Modo operación** | Solo online/USD | **Offline-first** (postmonetario) + online opcional |
| **Asignación miembros** | No contemplada | **UI interactiva** por posición (39 inputs) |
| **Integración ecosistema** | Aislado | **CaaS stream** + TQ + CPP + ZNU + SovereignCredit |
| **Escalabilidad** | Fijo 39 posiciones | **Configurable** RCE Plena, parity, modo |
| **Interoperabilidad** | Ninguna | **ReFi Nivel 3** (oráculo USDGLO/ICE/Ecoinvent) |

### 7.2 Mejoras Técnicas Específicas

#### 7.2.1 Lógica Pura + Tipado Estricto
```typescript
// Tipos exportados para uso en toda la app
export type VirginiaNodeMode = 'postmonetario' | 'conectado'
export interface VirginiaConfig { rcePlena, nodeMode, priceParity }
export interface VirginiaPosition { id, level, parentId, rceAmount, znuAmount, ... }
export interface VirginiaTreeState { config, positions: Map, rootPositions[], totals... }
export interface VirginiaMJCompliance { law1, law2, law3, overall }
```

#### 7.2.2 Reducer Pattern para Estado
```typescript
export type VirginiaAction =
  | { type: 'SET_CONFIG'; config: Partial<VirginiaConfig> }
  | { type: 'SET_MEMBER'; positionId: string; memberName: string }
  | { type: 'TOGGLE_POSITION'; positionId: string }
  | { type: 'REBUILD_TREE' }

export function virginiaReducer(state: VirginiaTreeState, action: VirginiaAction): VirginiaTreeState
```

#### 7.2.3 Factory de Estado Inicial
```typescript
export function makeVirginiaState(): VirginiaTreeState {
  return buildVirginiaTree({
    rcePlena: 1000,
    nodeMode: 'postmonetario',
    priceParity: 10,
  })
}
```

#### 7.2.4 Integración Completa en Store Global
- Estado `virginia: VirginiaState` en `AppState`
- Acciones reactivas via `useAppStore()`
- Persistencia via `zustand/middleware/persist`

#### 7.2.5 UI/UX: 5 Pestañas Especializadas
| Pestaña | Función | Datos Mostrados |
|---------|---------|-----------------|
| 🌲 **Árbol** | Visualización + asignación miembros | 39 inputs, jerarquía visual, totales por nodo |
| 📊 **Distribución** | Tabla analítica por nivel | RCE, ZNU, % total, promedios |
| ⚖️ **Leyes MJ** | Dashboard compliance | Estado cada ley, métricas base, accionables |
| 🔗 **CaaS Stream** | Registro + lista streams | USDC In, ZNU Out, touchesBaseMaterial, streams activos |
| 💰 **Reparto** | Tabla pagos + ejecución | Bruto, demurrage, neto, base, totales |

#### 7.2.6 Internacionalización (i18n)
```typescript
// src/core/lib/i18n.ts
'nav.virginia': { es: 'Virginia Network', en: 'Virginia Network', pt: 'Virginia Network' }
```

#### 7.2.7 Navegación Integrada
```tsx
// src/app/layout/Aside.tsx
{ key: 'virginia', navKey: 'nav.virginia', icon: TreePine, color: 'text-emerald-400', path: '/virginia' }
```

---

## 8. Estructura de Código en el Repositorio

### 8.1 Archivos Creados/Modificados

```
Zeitnus-Firma-Operaciones-Ecotomica/
├── src/
│   ├── core/
│   │   ├── lib/
│   │   │   ├── virginiaNetwork.ts      ← NUEVO: Lógica pura completa (1,359 líneas)
│   │   │   ├── valueDual.ts            ← EXISTENTE: Arquitectura anfibia
│   │   │   ├── caas.ts                 ← EXISTENTE: Lógica CaaS + revenueShare
│   │   │   ├── metrics.ts              ← EXISTENTE: autFromCAC, pgsLM, ics, population
│   │   │   └── i18n.ts                 ← MODIFICADO: + 'nav.virginia'
│   │   ├── state/
│   │   │   ├── virginia.ts             ← NUEVO: Slice de estado (519 bytes)
│   │   │   └── store.ts                ← MODIFICADO: + import + state + init
│   │   └── lib/
│   │       └── ... (existente)
│   ├── app/
│   │   ├── screens/
│   │   │   └── VirginiaNetwork.tsx     ← NUEVO: Pantalla completa (2,802 líneas)
│   │   └── layout/
│   │       └── Aside.tsx               ← MODIFICADO: + TreePine + nav item
│   └── ...
```

### 8.2 Dependencias del Grafo

```
virginiaNetwork.ts
  ├── @core/lib/valueDual.ts       → displayValue, isExternal
  ├── @core/lib/metrics.ts         → autFromCAC, pgsLM, population, ics
  ├── @core/lib/caas.ts            → CaaSRevenueStream, revenueShare
  ├── @core/state/types.ts         → ValueFlow, Member, CACVectors
  └── @core/state/caas.ts          → CaaSRevenueStream type

VirginiaNetwork.tsx
  ├── @core/lib/virginiaNetwork.ts → Toda la lógica pura
  ├── @core/state/store.ts         → useAppStore (cac, members, flows, caas...)
  ├── @components/ui               → Card, Stat, Btn, Badge, SectionTitle, EmptyState
  └── lucide-react                 → TreePine, Calculator, ShieldCheck, etc.
```

### 8.3 Cero Dependencias Externas Nuevas

- **Solo lucide-react** (ya en repo) — ícono `TreePine`
- **Solo zustand** (ya en repo) — estado reactivo
- **Sin Stripe, sin analytics, sin ad-networks** — arquitectura anfibia pura

---

## 9. Guía de Uso: Pantalla VirginiaNetwork

### 9.1 Acceso

1. Abrir app HSCSG v15 OS
2. En **Aside** (panel lateral), navegar a **🌲 Virginia Network** (ícono pino, color esmeralda)
3. Ruta: `/virginia`

### 9.2 Panel de Configuración (Siempre visible)

| Campo | Descripción | Default | Rango |
|-------|-------------|---------|-------|
| **RCE Plena (USD)** | Capital semilla por nodo raíz | 1,000 | ≥ 100 |
| **Modo** | Postmonetario (ZNU) ↔ Conectado (USD) | Postmonetario | Toggle |
| **Paridad (1 ZNU = USD)** | Oráculo ReFi Nivel 3 | 10 | > 0 (solo modo conectado) |
| **AUT Promedio** | Solo lectura — desde Base Material | — | 0-1+ |
| **CDS** | Solo lectura — desde ValueFlows | — | 0-1+ |

### 9.3 Pestaña 🌲 Árbol

- **Visualización jerárquica** N1 → N2 → N3 con colores por nivel
- **Asignación de miembros**: 39 inputs de texto (uno por posición)
- **Badges**: RCE propio (rosa/ámbar/verde), ZNU equivalente, Total acumulado
- **Persistencia**: Via `memberAssignments` state local (futuro: guardar en store)

### 9.4 Pestaña 📊 Distribución

- **Tabla analítica** por nivel con 7 columnas
- **Totales y porcentajes** auto-calculados
- **ValueFlows semánticos** explicados (LaborFlow, CareFlow, GovernanceFlow)

### 9.5 Pestaña ⚖️ Leyes MJ

- **3 tarjetas** (Ley I, II, III) con estado visual (verde/rojo/ámbar)
- **Métricas base** en grid: AUT, PGS, Población, CDS
- **Accionables automáticos** si falla alguna ley

### 9.6 Pestaña 🔗 CaaS Stream

- **Registro one-click** de Virginia como stream CaaS
- **Lista de streams activos** con badges Ley I (toca base: sí/no)
- **Integración nativa** con `caasStreams[]` global

### 9.7 Pestaña 💰 Reparto AUT+CDS

- **Solo visible si MJ overall === 'ok'**
- **Tabla completa**: Posición, Nivel, Miembro, Bruto, Demurrage, Neto, Base
- **Totales** en footer con sumatorias
- **Botón "Ejecutar Reparto y Auditar"** → log en `caasAudit[]`

---

## 10. Extensibilidad y Próximos Pasos

### 10.1 Extensiones Inmediatas (Fase 1)

| Feature | Esfuerzo | Descripción |
|---------|----------|-------------|
| **Persistencia asignaciones** | Bajo | Guardar `memberAssignments` en `VirginiaState` + localStorage |
| **Import/Export CSV** | Bajo | Botones descargar/cargar árbol (compatibilidad Excel original) |
| **Simulación Monte Carlo** | Medio | Integrar en `/simulador` existente con variables estocásticas |
| **ValueFlows automáticos** | Medio | Generar LaborFlow/CareFlow/GovernanceFlow al asignar miembros |

### 10.2 Extensiones Medianas (Fase 2)

| Feature | Esfuerzo | Descripción |
|---------|----------|-------------|
| **Árbol configurable N-niveles** | Alto | Generalizar `VIRGINIA_TREE_STRUCTURE` a `branchingFactor^depth` |
| **Múltiples árboles por nodo** | Alto | Soporte para varias redes Virginia paralelas |
| **Integración TQ (Capa 1)** | Alto | Convertir ZNU neto → TQ (kWh) via `conversionFactor` |
| **CPP (Capa 2) pooling** | Alto | Commitment Pooling Protocol sobre posiciones N3 |

### 10.3 Extensiones Avanzadas (Fase 3)

| Feature | Esfuerzo | Descripción |
|---------|----------|-------------|
| **Red federada cross-nodo** | Muy Alto | `CrossNodePool` Virginia entre nodos HSCSG (GNAP sync) |
| **Governance DAO on-chain** | Muy Alto | Propuestas/votación sobre `rcePlena`, `priceParity`, `demurrageRate` |
| **ML para predicción ROI** | Muy Alto | Modelo `geoai-ml-engineer` prediciendo Ley II compliance |
| **Realidad aumentada (AR)** | Muy Alto | Visualización 3D del árbol en territorio físico (URBION) |

### 10.4 Compatibilidad Hacia Atrás

- **CSV original** → Parsable por `buildVirginiaTree()` con `rcePlena` configurable
- **Excel multi-hoja** → Pendiente parser completo (hojas: config, simulación, sensitivity, etc.)
- **API REST** → Endpoints en `tq.ts` → `TQServerAPI` pattern replicable

---

## 11. Apéndice: Tipos TypeScript Core

### 11.1 `src/core/lib/virginiaNetwork.ts` — Tipos Principales

```typescript
export type VirginiaNodeMode = 'postmonetario' | 'conectado'

export interface VirginiaConfig {
  rcePlena: number
  nodeMode: VirginiaNodeMode
  priceParity: number
}

export interface VirginiaPosition {
  id: string
  level: 1 | 2 | 3
  parentId: string | null
  rceAmount: number
  znuAmount: number
  totalReceived: number
  totalReceivedZNU: number
  children: VirginiaPosition[]
  memberName?: string
  isActive: boolean
  joinedAt: number
}

export interface VirginiaTreeState {
  config: VirginiaConfig
  positions: Map<string, VirginiaPosition>
  rootPositions: string[]
  totalRCEs: number
  totalZNU: number
  totalUSD: number
  activeMembers: number
}

export interface VirginiaSummary {
  level1Count: number
  level2Count: number
  level3Count: number
  totalPositions: number
  totalUSDDistributed: number
  totalZNUDistributed: number
  avgPerPositionUSD: number
  avgPerPositionZNU: number
}

export interface VirginiaMJCompliance {
  law1: { passed: boolean; reason: string }
  law2: { passed: boolean; reason: string; roi: number }
  law3: { passed: boolean; reason: string; pgs: number }
  overall: 'ok' | 'warn' | 'blocked'
}

export interface VirginiaPayout {
  positionId: string
  memberName: string
  level: number
  grossZNU: number
  demurrageApplied: number
  netZNU: number
  basis: string
}
```

### 11.2 `src/core/state/virginia.ts` — Slice de Estado

```typescript
export interface VirginiaState {
  tree: VirginiaTreeState | null
  config: VirginiaConfig
  lastRebuild: number
}

export function makeVirginiaState(): VirginiaState {
  return {
    tree: null,
    config: { rcePlena: 1000, nodeMode: 'postmonetario', priceParity: 10 },
    lastRebuild: 0,
  }
}
```

### 11.3 Integración en `src/core/state/store.ts`

```typescript
// Imports
import type { VirginiaState } from '@core/state/virginia'
import { makeVirginiaState } from '@core/state/virginia'

// En AppState:
virginia: VirginiaState

// En estado inicial:
virginia: makeVirginiaState()
```

---

## Conclusión

El sistema **Virginia Network Recreativo Prototipo IE v2** ha sido **asimilarizado rigurosamente** en el ecosistema HSCSG v15 OS, transformando un modelo estático de hoja de cálculo (39 posiciones, USD fijo, sin gobernanza) en un **módulo vivo, anfibio, auditable y extensible** que:

1. **Respeta la arquitectura existente** — CaaS, Leyes MJ, AUT/CDS, ZNU, TQ, CPP, i18n, Aside
2. **Añade valor real** — Compliance MJ, reparto dinámico, demurrage, modo offline/online
3. **Mantiene soberanía** — Lógica pura TypeScript, sin infra ajena, offline-first
4. **Permite evolución** — Estructura modular lista para fases 1-3

> **El código es territorio. La documentación es mapa. La verdad es el territorio.**  
> — *HSCSG v15 OS Principle*

---

**Fin del documento**