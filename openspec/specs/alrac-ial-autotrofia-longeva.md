# ALRAC IAL — Índice de Autotrofia Longeva

**Capa:** 1 (Contable-Física) + 5 (Gobernanza Transversal)  
**Versión:** 0.1  
**Estado:** BORRADOR  
**Fecha:** 2026-11-14  
**Autor:** ALRAC Coordinator (asimilación de documento maestro)  
**Dependencias:** `alrac-tq-*`, `alrac-governance-holonic.md`, Tiempo Vital (TV)

---

## 1. Propósito

Medir, por comunidad y por periodo, si una comunidad (nodo) se acerca a la **inmortalidad colectiva autotrófica en destrabajo ético de lujo transgeneracional**:

| Término | Definición operativa |
| --- | --- |
| **Autotrofia** | Producir localmente lo que se consume (energía, alimento, cuidado) |
| **Destrabajo** | Tiempo liberado de servidumbre (piso para-servil-vital) |
| **Lujo ético** | Excedente discrecional con huella neta ≤ 0 en las 4 capas FRS |
| **Transgeneracional** | Cada generación hereda ≥ la capacidad que recibió |
| **Inmortalidad (colectiva)** | Continuidad de la capacidad del colectivo, no de individuos |

El IAL **no es moneda ni se negocia**. Es una métrica de control, igual que TV. El TQ conserva su ancla (1 TQ = 1 kWh) y sirve como unidad de la dimensión A.

---

## 2. Fórmula

```
IAL = ( A · D · L )^(1/3) · T          ∈ [0, 1]
```

Producto y media geométrica a propósito: si un factor es 0, el IAL es 0 (sin compensación entre factores). T actúa como freno multiplicativo.

### 2.1 A — Autotrofia

```
A = Σ_k w_k · min(1, p_k / c_k)        k ∈ {energía, alimento, cuidado}
```

- `p_k`: producción local del periodo; `c_k`: consumo total del periodo.
- Energía en kWh (= TQ-equivalente); alimento en kcal convertidas a kWh; cuidado en horas de cuidado.
- Pesos por defecto `w_k = 1/3`. Cambiarlos requiere decisión del Consejo (ver §6).

### 2.2 D — Destrabajo

```
D = 1 − ( h_serv / h_disp )
```

- `h_serv`: horas de trabajo no elegido necesarias para cubrir la canasta básica (ZNU).
- `h_disp`: horas disponibles del periodo.
- Se publica por **comunidad**, nunca por persona (ver §5).
- Piso protegido: `D ≥ TV_min` (parámetro; valor a calibrar).

### 2.3 L — Lujo ético

```
L = E_etico / E_disc      (0 si E_disc = 0)
```

- `E_disc`: excedente discrecional del periodo (lo que queda tras cubrir canasta y fondos).
- `E_etico`: parte de `E_disc` cuyo FRS ≥ 0 en las cuatro capas (cuerpo, comunidad, biosfera, futuros), validado por pares.
- **Compuerta (el lujo no precede a la base):** si `A < A_min` o `D < TV_min`, entonces `L = 0`.

### 2.4 T — Transgeneracional

```
T = ( Π_i min(1, r_i) )^(1/n)          r_i = capacidad_actual_i / capacidad_recibida_i
```

Proxies `r_i` (mínimo 4, ver §3). Si hay menos de 4 medibles, T se marca **PROVISIONAL** y el IAL no activa decisiones de producción.

---

## 3. Proxies de T

| Proxy | Medida | Fuente |
| --- | --- | --- |
| **Suelo** | % materia orgánica o ha regeneradas | Muestreo del nodo |
| **Saber** | % de oficios críticos con ≥ 2 aprendices; docs publicados bajo OAD | Registro de nodo |
| **Bóveda** | Saldo real de fondos Memoria/Cuidado/Autotrofia por miembro, en kWh-eq | Multifirma |
| **Cuidado** | % de miembros con cuidado preventivo accesible | Comité de Cuidado |
| **Relevo (opcional)** | Ratio aprendices / maestros por oficio | Registro de nodo |

---

## 4. Bandas y Alertas (Provisionales)

| IAL | Estado | Acción |
| --- | --- | --- |
| < 0.20 | **Crítico** | Dispara protocolo γ-CARMIS del nodo |
| 0.20 – 0.40 | **Frágil** | Plan de recuperación del Consejo de Futuros |
| 0.40 – 0.70 | **Estable** | Seguimiento trimestral |
| > 0.70 | **Longevo** | Candidato a nodo de referencia / réplica |

**Alertas adicionales:** cualquier factor (A, D, L) < 0.10, o T < 0.80 dos periodos seguidos.

---

## 5. Requisitos (SHALL)

| ID | Requisito |
|----|-----------|
| **R1 — Periodicidad** | El IAL SHALL calcularse cada trimestre, a cargo del comité rotativo de 3 meses. |
| **R2 — Agregación mínima** | El sistema SHALL publicar solo agregados de comunidades con N ≥ 10 miembros; D y L no se miden ni se exponen por individuo. |
| **R3 — Consentimiento** | Todo dato personal usado para D SHALL ser opt-in y revocable. |
| **R4 — Verificación triaxial** | A, D y L SHALL verificarse en tres ejes (mental, simulación, laboratorio/terreno); un IAL sin verificación se publica como `NO_VERIFICADO`. |
| **R5 — Auditoría de L** | El valor de `E_etico` SHALL ser validado por pares con peso CDS; el autodeclarado no cuenta. |
| **R6 — Sin conversión** | El IAL no SHALL convertirse a TQ, ZNU ni fiat, ni usarse como colateral. |
| **R7 — Cambio de parámetros** | Modificar `w_k`, `A_min`, `TV_min` o las bandas SHALL requerir decisión del Consejo de Futuros con veto suspensivo. |
| **R8 — Anti-Goodhart** | Cada periodo se rota un proxy de T (auditoría sorpresa) y se compara contra el registro declarado. |

### Escenarios (Gherkin-style)

- **Dado** un nodo con A = 0.8, D = 0.7, L = 0.6, T = 0.9 **cuando** se calcula el IAL **entonces** IAL ≈ 0.68 (Estable).
- **Dado** un nodo con D < TV_min **cuando** se calcula **entonces** L = 0 y el IAL = 0, y se dispara alerta.
- **Dado** que el valor de L no ha sido validado por pares **cuando** se publica **entonces** el IAL se marca `NO_VERIFICADO`.

---

## 6. Integración

- **Fondos 15/50/35 (Memoria / Cuidado / Autotrofia):** se evalúa cada reparto por su efecto en el IAL (variación por unidad de excedente asignada).
- **γ-CARMIS:** el IAL en banda Crítico es un disparador adicional (ver §4).
- **Bono federado (TQ → 0):** se emite solo si `D ≥ TV_min` después de la emisión.
- **Anfibio:** el cálculo vive en el core y no depende del adaptador de liquidación (offline/conectado).

---

## 7. Pendientes Abiertos

1. Calibrar `A_min`, `TV_min`, bandas y `w_k` con un piloto real (FEDECO-TQ u otro nodo).
2. Definir la unidad exacta de "horas de cuidado" para A.
3. Decidir qué proxies de T son obligatorios en Nivel 0 (solo registro).
4. Implementación TypeScript: `src/core/lib/ial.ts` + pruebas de propiedad (monotonía, cero absorbente, tope de T).

---

## 8. Mapping Arquitectónico ALRAC

| Capa | Componente IAL | Adaptador HSCSG |
|------|----------------|-----------------|
| **1 (Contable-Física)** | Factor A (Autotrofia) — kWh, kcal→kWh, horas cuidado | `tq.ts` (TQ = 1 kWh ancla), `valueDual.ts` (anfibio) |
| **1 (Contable-Física)** | Factor D (Destrabajo) — horas servidumbre vs disponibles | ZNU canasta básica (`alrac-znu-indexing-credit.md`) |
| **1 (Contable-Física)** | Factor L (Lujo ético) — excedente discrecional, FRS ≥ 0 | Reparto Amid 15/50/35 (`alrac-revenue.md`) |
| **5 (Gobernanza)** | Factor T (Transgeneracional) — proxies, rotación auditoría | `alrac-governance-holonic.md` (comités rotativos, CDS, veto) |
| **5 (Gobernanza)** | Requisitos R1–R8, Consejo de Futuros, veto suspensivo | Gobernanza holónica, 1a1v, CDS gates |
| **0 (Epistémica)** | Verificación triaxial (R4), Anti-Goodhart (R8) | Kernel HSCSG (sesgos expuestos), γ-CARMIS |

---

## 9. TypeScript Types (Target: `src/core/lib/ial.ts`)

```typescript
// src/core/lib/ial.ts
// IAL — Índice de Autotrofia Longeva
// Capa 1 + 5 | Depende: tq.ts, alrac-governance-holonic, tiempo-vital

export type IALFactorKey = 'energia' | 'alimento' | 'cuidado';

export interface IALWeights {
  energia: number;   // default 1/3
  alimento: number;  // default 1/3
  cuidado: number;   // default 1/3
}

export interface IALAutotrofiaInput {
  produccion: Record<IALFactorKey, number>;  // p_k
  consumo: Record<IALFactorKey, number>;     // c_k
  pesos?: Partial<IALWeights>;
}

export interface IALDestrabajoInput {
  horasServidumbre: number;   // h_serv
  horasDisponibles: number;   // h_disp
  tvMin: number;              // TV_min (parámetro calibrado)
}

export interface IALLujoEticoInput {
  excedenteDiscrecional: number;  // E_disc
  excedenteEtico: number;         // E_etico (validado por pares, CDS)
  aMin: number;                   // A_min (compuerta)
  tvMin: number;                  // TV_min (compuerta)
  autotrofiaActual: number;       // A actual
  destrabajoActual: number;       // D actual
}

export interface IALTransgeneracionalInput {
  proxies: IALProxy[];  // mínimo 4 medibles
}

export interface IALProxy {
  id: string;
  nombre: 'suelo' | 'saber' | 'boveda' | 'cuidado' | 'relevo';
  capacidadActual: number;
  capacidadRecibida: number;
  medible: boolean;
}

export interface IALConfig {
  pesos: IALWeights;
  aMin: number;
  tvMin: number;
  bandas: IALBand[];
}

export interface IALBand {
  min: number;
  max: number;
  estado: 'critico' | 'fragil' | 'estable' | 'longevo';
  accion: string;
}

export interface IALResult {
  A: number;
  D: number;
  L: number;
  T: number;
  IAL: number;
  estado: IALBand['estado'];
  verificado: boolean;
  provisional: boolean;  // true si T tiene < 4 proxies medibles
  alertas: string[];
  timestamp: number;
  periodo: { inicio: number; fin: number };
  nodoId: string;
}

export interface IALVerification {
  mental: boolean;      // revisión mental/conceptual
  simulacion: boolean;  // simulación computacional
  laboratorio: boolean; // medición física/terreno
  paresValidaronL: boolean;  // R5
  auditoriaRotada: string;   // R8 - proxy auditado este periodo
}

// Funciones puras (sin efectos colaterales)

export function calculateAutotrofia(input: IALAutotrofiaInput, pesos: IALWeights): number;
export function calculateDestrabajo(input: IALDestrabajoInput): number;
export function calculateLujoEtico(input: IALLujoEticoInput): number;
export function calculateTransgeneracional(input: IALTransgeneracionalInput): { T: number; provisional: boolean };
export function calculateIAL(
  A: number, D: number, L: number, T: number
): number;
export function evaluateIAL(
  autotrofia: IALAutotrofiaInput,
  destrabajo: IALDestrabajoInput,
  lujoEtico: IALLujoEticoInput,
  transgeneracional: IALTransgeneracionalInput,
  config: IALConfig
): IALResult;
export function verifyTriaxial(result: IALResult): IALVerification;
export function checkAlertas(result: IALResult, config: IALConfig): string[];
export function getBand(ial: number, bandas: IALBand[]): IALBand;
```

---

## 10. Property-Based Tests (vitest + fast-check)

```typescript
// tests/ial.property.test.ts
import { fc, test } from '@fast-check/vitest';
import { calculateIAL, calculateAutotrofia, calculateDestrabajo, calculateLujoEtico, calculateTransgeneracional } from '../src/core/lib/ial';

test.prop([fc.float({min: 0, max: 1}), fc.float({min: 0, max: 1}), fc.float({min: 0, max: 1}), fc.float({min: 0, max: 1})])
  ('monotonía: IAL no disminuye si cualquier factor aumenta', (a1, d1, l1, t1) => {
    const a2 = Math.max(a1, fc.float({min: a1, max: 1})),
          d2 = Math.max(d1, fc.float({min: d1, max: 1})),
          l2 = Math.max(l1, fc.float({min: l1, max: 1})),
          t2 = Math.max(t1, fc.float({min: t1, max: 1}));
    expect(calculateIAL(a2, d2, l2, t2)).toBeGreaterThanOrEqual(calculateIAL(a1, d1, l1, t1));
  });

test.prop([fc.float({min: 0, max: 1}), fc.float({min: 0, max: 1}), fc.float({min: 0, max: 1})])
  ('cero absorbente: si A=0 o D=0 o L=0 → IAL=0', (d, l, t) => {
    expect(calculateIAL(0, d, l, t)).toBe(0);
    expect(calculateIAL(d, 0, l, t)).toBe(0);
    expect(calculateIAL(d, l, 0, t)).toBe(0);
  });

test.prop([fc.float({min: 0, max: 1})])
  ('tope de T: T ∈ [0, 1] → IAL ≤ media geométrica de A,D,L', (t) => {
    const A = 0.8, D = 0.7, L = 0.6;
    const ial = calculateIAL(A, D, L, t);
    const geoMean = Math.pow(A * D * L, 1/3);
    expect(ial).toBeLessThanOrEqual(geoMean);
  });

test('compuerta L: si A < A_min o D < TV_min → L = 0', () => {
  const input = { excedenteDiscrecional: 100, excedenteEtico: 80, aMin: 0.5, tvMin: 0.4, autotrofiaActual: 0.3, destrabajoActual: 0.6 };
  expect(calculateLujoEtico(input)).toBe(0); // A < A_min
});

test('T provisional: < 4 proxies medibles → provisional = true', () => {
  const input = { proxies: [
    {id: '1', nombre: 'suelo', capacidadActual: 100, capacidadRecibida: 100, medible: true},
    {id: '2', nombre: 'saber', capacidadActual: 80, capacidadRecibida: 100, medible: true},
    {id: '3', nombre: 'boveda', capacidadActual: 90, capacidadRecibida: 100, medible: false}, // no medible
  ]};
  const { provisional } = calculateTransgeneracional(input);
  expect(provisional).toBe(true);
});
```

---

## 11. Referencias

- `alrac-architecture.md` — Capa 1 y 5 definición
- `alrac-governance-holonic.md` — Comités rotativos, CDS, veto, Consejo de Futuros
- `alrac-revenue.md` — Fondos 15/50/35, reparto Amid
- `alrac-znu-indexing-credit.md` — Canasta básica ZNU, h_serv
- `alrac-fiat-layer.md` — Anfibio, priceParity, Nivel 3 ReFi
- `openspec/specs/triaxial-verification.md` — Verificación triaxial (R4)
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` — γ-CARMIS, Paso II
- `src/core/lib/valueDual.ts` — Lógica anfibia (postmonetario ↔ conectado)

---

> **Nota de asimilación:** Este spec se deriva del documento maestro `alrac-ial-autotrofia-longeva.md` (BORRADOR v0.1). Todos los umbrales son **hipótesis provisionales** que se calibran con el primer piloto real (Paso II). La implementación TypeScript en `src/core/lib/ial.ts` es el siguiente paso (ver §7.4).