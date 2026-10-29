# Virginia × PMCRT — Cómo Funciona y Cuál es la Novedad
## Explicación del Pipeline de Anidación Fractal con Simbiosis Logarítmica

**Repositorio:** https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo  
**Rama:** feat/asimilacion-agencia-productizada-specs  
**Commits:** f51c073 (implementación), e96662f (filosofía/humor)  
**Spec:** alrac-virginia-pmcrt-fractal-nesting.md (spec 48)  
**Implementación:** src/core/lib/virginia-pmcrt-fractal-pipeline.ts  
**Idioma:** Español

---

## 1. Resumen Ejecutivo

Antes, **Virginia Network** y **PMCRT** (Prospectiva Metabolicocibernética Recíparanárquica Transgeneracional) existían como specs separadas en el repositorio Zeitnus. Este trabajo las une en un **pipeline operativo único**: una clase TypeScript (`VirginiaPmcrFractalPipeline`) que construye un árbol fractal de nodos, ejecuta un ciclo PMCRT completo en cada nivel, y propaga feedback entre niveles con una fuerza de simiosis que escala logarítmicamente.

No es solo documentación: es código ejecutable con **0 errores TypeScript**.

---

## 2. Cómo Funciona

### 2.1 Virginia Network (capas N1/N2/N3)

Virginia Network organiza la red en tres capas:

| Capa | Nombre | Propósito |
|------|--------|-----------|
| N1 | Root Domain | Gobernanza, constitución de la red |
| N2 | Sub Domain | Coordinación, CDS, reputación, consejos bioregionales |
| N3 | Project Domain | Generación TQ/ZNU, vesting, ejecución de proyectos |

Cada nodo N3 tiene un **peso dinámico** computado a partir de 6 factores:
1. TQ generado en kWh (60%) — producción termodinámica verificada
2. Hitos de autonomía (AUT) verificados (20%)
3. Verificación entre pares / Bread (10%)
4. Factor Urbanika = CDS × AUT (5%)
5. Reputación Colony (3%)
6. Progreso de vesting Berry (2%)

**Berry vesting:** 7 tranches en 42 meses que liberan ZNU gradualmente, condicionadas a hitos de autonomía y verificación par.

**DisCO 3 flujos:**
- Livelihood → N3 (producción energética / solar)
- Love → N2 (coordinación / gobernanza bioregional)
- Care → N1 (cuidado / comunidad)

### 2.2 PMCRT (ciclo de 5 fases por nodo)

Cada nivel de anidación ejecuta un ciclo PMCRT completo, autosimilar al del nivel padre:

| Fase | Nombre | Qué hace |
|------|--------|----------|
| 1 | Observación | Actualiza el vector estado 9D |
| 2 | Diagnóstico | Balance metabólico, ratio Ashby, umbral β_crit |
| 3 | Deliberación | 1 persona = 1 voto, Consejo de Futuros, fondos 15/50/35 |
| 4 | Ejecución | Berry vesting, DisCO flujos, auditoría termodinámica |
| 5 | Retroalimentación | x_{t+1}, escenarios revisados, transmisión transgeneracional |

**Vector estado 9D:** agua, alimento, energía, hábitat, cuidado, memoria, biosfera, gobernanza, liquidez.

**Fondos (15/50/35):** 15% Memoria, 50% Cuidado, 35% Autotrofia.

**Una persona, un voto (ALRAC):** ninguna ponderación por tokens o aportaciones.

### 2.3 Anidación Fractal

Este es el núcleo de la novedad. No hay una "capa central" que decida y los demás ejecuten. Cada nivel (N1, N2, N3, célula/operador) ejecuta su **propio ciclo PMCRT completo**, con su propio vector estado 9D, sus propios fondos y su propia proyección transgeneracional.

```
N1 Root (d=0) ── PMCRT completo ── Horizonte: 7 generaciones ── Simbiosis: 0.00
    │
    ├── N2 Sub (d=1) ── PMCRT completo ── Horizonte: 20 años ── Simbiosis: 0.50
    │       │
    │       ├── N3 Project (d=2) ── PMCRT completo ── Horizonte: 0-2 años ── Simbiosis: 0.79
    │       │       │
    │       │       └── Cell/Operator (d=3) ── PMCRT completo ── Horizonte: Inmediato ── Simbiosis: 1.00
    │       │
    │       └── N3 Project (d=2) ...
    │
    └── N2 Sub (d=1) ...
```

**Branching factor:** 3 (como Virginia Network: 3 N2 por cada N1, 3 N3 por cada N2). Árbol completo: 1 + 3 + 9 + 27 = 40 nodos.

### 2.4 Simbiosis Logarítmica

La fuerza del feedback entre niveles no es lineal. Se calcula como:

```
simbiosis(d) = ln(profundidad + 1) / ln(máxima profundidad + 1)
```

| Nivel | d | Simbiosis | Característica |
|-------|---|-----------|----------------|
| N1 Root | 0 | 0.00 | Escucha lenta, alcance global, no manda |
| N2 Sub | 1 | 0.50 | Coordinación bioregional |
| N3 Project | 2 | 0.79 | Ejecución operativa |
| Cell/Operator | 3 | 1.00 | Feedback máximo, inmediato, localizado |

**Atenuación entre niveles:** `1 - |desde - hasta| / (máxima + 1)`  
Salto de 1 nivel: 0.75 | Salto de 2 niveles: 0.50 | Salto de 3 niveles: 0.25

Cuando una célula detecta un problema, envía señal hacia arriba atenuada por la distancia. Cuando N1 emite una directriz, baja atenuada hacia los niveles profundos. La raíz no ordena; resuena.

### 2.5 Graceful Degradation

Si un nodo falla, el pipeline no colapsa. El loop continúa con el último estado conocido del sistema anidado. Cada transición tiene hooks de verificación (Ley MJ III).

### 2.6 Interfaz TypeScript

```typescript
class VirginiaPmcrFractalPipeline {
  buildFractalTree(): Promise<FractalPipelineResult>
  runPmcrCycle(nodeId, phase, input): PMCRTCycleResult
  runFullPipeline(rootNodeId): Promise<FractalPipelineResult>
  propagateFeedback(signal, fromDepth, toDepth): FeedbackSignal
  computeSymbiosis(depth): number
  attenuateDecision(decision, from, to): PMCRTDecision
  projectTransgenerational(nodeId, generations): Promise<State>
  computeGlobalCoherence(nodes): number
}
```

Ejemplo de uso:
```typescript
const pipeline = createVirginiaPmcrFractalPipeline(DEFAULT_FRACTAL_TREE_CONFIG)
const result = await pipeline.runFullPipeline('zeitnus-root-n1')
// result.globalCoherence → 0-100
// result.allNodes → 40 nodos con sus vectores 9D
// result.feedbackLoops → señales propagadas entre niveles
// result.transgenerationalProjection → proyección 7 generaciones
```

---

## 3. Cuál es la Novedad

### 3.1 Primera unión operativa de Virginia × PMCRT

Antes existían specs independientes (`alrac-tq-virginia.md` y `pmcrt.md`). Ahora hay una implementación TypeScript que las ejecuta juntas como un solo sistema.

### 3.2 Cada nivel es un estado-nación en miniatura

No hay una "capa de decisión central" que baje órdenes. Cada nivel tiene su ciclo PMCRT completo, sus 3 fondos (15/50/35), su propio vector 9D y su propia proyección transgeneracional (7 generaciones).

### 3.3 Simbiosis logarítmica, no jerarquía

En lugar de "N1 manda a N3", el poder de feedback está invertido: la **célula (d=3) tiene la voz más fuerte y rápida**; la **raíz (d=0) tiene la voz más lenta y atenuada**. El diseño parece una pirámide, pero la punta está diseñada para no decir nada —eso es precisamente lo que lo hace funcionar.

### 3.4 Código ejecutable, no solo especificación

Es TypeScript real con **0 errores**. Puedes instanciar `VirginiaPmcrFractalPipeline`, construir el árbol, ejecutar ciclos, propagar feedback y obtener métricas de coherencia global.

### 3.5 Redefine la PMCRT

Deja de ser un modelo abstracto de "comunidades autónomas" y se convierte en una arquitectura de software con:
- Nodos con parent/child (red holónica)
- Peso dinámico N3 (6 factores Virginia)
- Cierre de ciclo entre percepción (FRS), decisión (CDS+matchmaker) y ejecución (OAD→COS→ITC)

---

## 4. Archivos del Repo

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| OpenSpec Spec 48 | `openspec/specs/alrac-virginia-pmcrt-fractal-nesting.md` | Especificación completa (interfaces TypeScript, 20 reglas de negocio VPM-01 a VPM-15, mapeo a 5 capas ALRAC) |
| Implementación | `src/core/lib/virginia-pmcrt-fractal-pipeline.ts` | Clase `VirginiaPmcrFractalPipeline` (~894 líneas, 0 errores TS) |
| Índice actualizado | `openspec/specs/SPEC_INDEXER.md` | Spec 48 agregada (total 45 specs) |
| Documento exhaustivo | `docs/VIRGINIA_PMCRT_FRACTAL_NESTING_CAMBIOS_EXHAUSTIVO.md` | Informe detallado de todos los cambios |
| Filosofía/humor | `docs/MANTRA_MATEMA_SUBSHAITA_VIRGINIA_PMCRT_HUMOR_AFILIATIVO.md` | Sistema filosófico de humor afiliativo (Tractatus + matemas + subshaitas) |

---

## 5. Enlaces de GitHub

| Recurso | Enlace |
|---------|--------|
| PR #11 (abierto, listo para review) | https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo/pull/11 |
| Commit implementación | f51c073 |
| Commit filosofía/humor | e96662f |
| Spec 48 en GitHub | https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo/blob/feat/asimilacion-agencia-productizada-specs/openspec/specs/alrac-virginia-pmcrt-fractal-nesting.md |
| Implementación TS en GitHub | https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo/blob/feat/asimilacion-agencia-productizada-specs/src/core/lib/virginia-pmcrt-fractal-pipeline.ts |
| Rama | https://github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo/tree/feat/asimilacion-agencia-productizada-specs |

---

## 6. Verificación

- **TypeScript:** `npx tsc --noEmit` → 0 errores en `virginia-pmcrt-fractal-pipeline.ts`
- **OpenSpec:** Spec 48 agregada al índice (total 45 specs, Fase 3 Advanced)
- **Licencia:** MIT (especificación propia, conceptos reimplementados sin copia de código existente)
- **Derechos de autor:** No se copió código fuente existente; especificación original bajo MIT

---

## 7. Qué Queda Pendiente

| Tarea | Estado |
|-------|--------|
| Tests unitarios específicos para el pipeline fractal | Pendiente (tests requeridos listados en el spec) |
| Pantalla `/pipeline-fractal` en el frontend | Pendiente |
| Integración con Virginia Gateway existente (`tq-virginia.ts`) | Pendiente (la especificación referencia el gateway pero no lo modifica) |
| Validación en piloto con nodo real | Pendiente |

---

**PR #11 está abierto y listo para revisión hacia `main`.**  
*El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.*