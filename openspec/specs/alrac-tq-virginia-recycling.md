// openspec/specs/alrac-tq-virginia-recycling.md
// OpenSpec: Reciclaje de Valor Agregado vía Sistema Virginia + USH
// Mapas: VA real, Pool de reciclaje, tres salidas φ_R/φ_C/φ_D, USH, tope ρ, circuit breakers → TypeScript
// Estado: Propuesta — pendiente implementación (borrador v0.1 del documento fuente)
// Capa: 3 (membrana fiat/ZNU) + Capa 5 (gobernanza), anclaje Capa 1 (TQ)

# SPEC: alrac-tq-virginia-recycling
**Version:** 0.1.0 (propuesta — borrador del documento fuente, sin validación empírica)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** `docs/alrac-virginia-reciclaje-va_backup.md` (alrac-virginia-reciclaje-va, borrador v0.1)
**Targets:** `src/core/lib/virginia-recycling.ts`, `src/core/state/virginia.ts` (extensión), `src/core/lib/tq-virginia.ts` (extensión)

---

## 1. Arquitectura del ciclo de reciclaje

El Sistema Virginia ya tiene un mecanismo parcial de reciclaje (demurrage → pool comunitario). Este spec lo extiende a un ciclo completo:

| Componente | Función | Estado en repo |
|------------|---------|----------------|
| Valor agregado real VA_i,t = ingresos − insumos externos | Medición auditable; solo VA real habilita reparto | Faltante |
| Pool Virginia P_t = D_t + Σ r_i·max(0, VA_i,t) | Acumula demurrage + retención de nodos | Faltante |
| Tres salidas φ_R/φ_C/φ_D (0.40/0.20/0.40 provisional) | Reinversión, crédito mutuo, dividendo universal | Faltante |
| USH: 1 participación igual por miembro activo | Dividendo igualitario, intransferible, caduco 90d | Faltante |
| Tope anti-captura ρ ≤ 3 | max/min recibido_total; exceso → Pool | Faltante |
| Circuit breakers: compliance MJ + γ-CARMIS | Gate previo a cada distribución | Parcial (tq-virginia) |

---

## 2. Especificación técnica

### 2.1 Interfaz: `VirginiaRecyclingConfig`

```typescript
interface VirginiaRecyclingConfig {
  r0: number;            // 0.10 (provisional)
  lambdaIAL: number;     // 0.5 (provisional)
  rMin: number;          // 0.05
  rMax: number;          // 0.20
  phiR: number;          // 0.40
  phiC: number;          // 0.20
  phiD: number;          // 0.40
  demurrageRate: number; // 0.05 (existente en Virginia)
  demurrageFloorZNU: number; // 300 (existente)
  captureRatioMax: number;   // 3 (provisional)
  dividendExpiryDays: number; // 90 (Postulado 4)
}
```

### 2.2 Interfaz: `RecyclingCycleResult`

```typescript
interface RecyclingCycleResult {
  poolTotal: number;
  allocation: { reinvestment: number; credit: number; dividend: number };
  dividendPerMember: number;
  activeMembers: number;
  captureRatio: number;
  complianceOk: boolean;
  carmisBlocked: boolean;
}
```

### 2.3 Función: `calculateRealVA(ingresos: number, insumosExternos: number, auditable: boolean): number`

- Solo cuenta VA si `auditable === true`.
- Retorna `max(0, ingresos - insumosExternos)`.
- Lanza error si `auditable === false` (VA simulado nunca habilita reparto).

### 2.4 Función: `computeDemurragePool(balancesZNU: Record<string, number>): number`

- `D_t = Σ 0.05 × max(0, B_p - 300)` para cada balance ZNU.
- Retorna total de demurrage del ciclo.

### 2.5 Función: `computeRecyclingRate(ial: number, cfg: VirginiaRecyclingConfig): number`

- `r_i = r0 × (1 + λ × (1 - IAL_i))`, acotado a [rMin, rMax].
- Nodo con IAL bajo → recicla más; nodo autotrófico (IAL alto) → cerca del piso.

### 2.6 Función: `runVirginiaRecyclingCycle(state, cfg): RecyclingCycleResult`

- Verifica `checkVirginiaMJCompliance()` → si no `ok`, `complianceOk = false`, sin distribución.
- Verifica γ-CARMIS (αʰ < κ) → si activo, `carmisBlocked = true`, sin distribución.
- Calcula `P_t = D_t + Σ r_i × max(0, VA_i,t)`.
- Asigna: reinversión = φ_R × P_t, crédito = φ_C × P_t, dividendo = φ_D × P_t.
- `dividendPerMember = dividendo / N_activos`.
- Calcula `captureRatio = max(recibido_total) / min(recibido_total)`.
- Si `captureRatio > captureRatioMax`, el exceso del árbol se reasigna al Pool y `captureRatio` se recalcula.
- Valida `suma salidas ≤ P_t`.
- Registra en ValueFlows (trazabilidad).

### 2.7 Interfaz: `UshParticipation`

```typescript
interface UshParticipation {
  memberId: string;
  active: boolean;
  dividendBalance: number;      // TQ/ZNU pendiente
  lastDividendCycle: number;    // timestamp del último dividendo
  expiryDate: number;           // caducidad a 90 días
}
```

### 2.8 Función: `expireDividends(participations: UshParticipation[], now: number): { expiredAmount: number }`

- Cualquier saldo no usado a los 90 días vuelve al Pool.
- Retorna monto expirado.

### 2.9 Reglas duras (boundaries.ts)

- DENY: semillas ficticias como base de reparto.
- DENY: conversión TQ↔fiat en dividendos.
- DENY: dividendo por miembro > límite TQ ±500 (excedente → φ_R).
- DENY: captureRatio > captureRatioMax sin reasignación.

---

## 3. Integración con specs existentes

| Spec existente | Punto de integración |
|----------------|---------------------|
| `alrac-tq-virginia` (Virginia Gateway implementado) | `checkVirginiaMJCompliance()`, demurrage D_t, árbol 39 posiciones como incentivo recreativo |
| `alrac-znu-indexing-credit` (ZNU canasta, crédito 2–3%, expiración 90d) | φ_C crédito mutuo; caducidad de dividendos a 90d |
| `alrac-ial-autotrofia-longeva` (IAL factor) | `ial` para calcular `r_i` |
| `alrac-tq-*` (TQ Ledger, 1 kWh = 1 TQ, ±500) | Límite de saldo por miembro; excedente dividendo → φ_R |
| `ECOSYSTEM_REVENUE_SHARING.md` (4 círculos 15/20/35/30) | Coordinación de fondo (interfaz definida, no implementar reparto Amid) |
| `CAOS_MODELONEGOCIO_ANALISIS.md` (γ-CARMIS, αʰ, κ, Paso II) | Circuit breaker: si αʰ < κ, detener distribuciones |

---

## 4. Criterios de aceptación

- [ ] `calculateRealVA()` rechaza datos no auditables
- [ ] `computeDemurragePool()` = 5% sobre exceso de 300 ZNU
- [ ] `runVirginiaRecyclingCycle()` sin distribución si compliance !== 'ok'
- [ ] `runVirginiaRecyclingCycle()` sin distribución si γ-CARMIS activo
- [ ] `dividendPerMember` idéntico para todos los miembros activos
- [ ] `captureRatio ≤ captureRatioMax`; exceso reasignado al Pool
- [ ] Dividendos caducan a 90 días; remanente → Pool
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// calculateRealVA
Input: ingresos=1000, insumosExternos=300, auditable=true
Expected: 700

Input: ingresos=1000, insumosExternos=300, auditable=false
Expected: error (VA simulado no habilita reparto)
```

```typescript
// runVirginiaRecyclingCycle
Input: complianceOk=true, carmisBlocked=false, 5 miembros con VA>0, cfg por defecto
Expected: poolTotal > 0; allocation.reinvestment ≈ 40%; allocation.credit ≈ 20%; allocation.dividend ≈ 40%; dividendPerMember igual para los 5
```

```typescript
// capture ratio cap
Input: recibido_total = [100, 300], captureRatioMax=3
Expected: captureRatio = 3 (límite); si fuera [100, 400] → exceso de 100 reasignado al Pool
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-virginia` | 1.0.0 | Virginia Gateway, compliance MJ, demurrage |
| `tq-types-extended` | 1.0.0 | Tipos core (VirginiaState, TQ ±500) |
| `tq-valueflows` | 1.0.0 | Trazabilidad inmutable de ciclos |
| `znu` | 1.0.0 | ZNU canasta, crédito, caducidad |
| `ial-autotrofia` | 1.0.0 | IAL_i para r_i |
| `boundaries` | 1.0.0 | Límites duros (no fiat, no captura > ρ) |

---

## 7. Referencias

- `docs/alrac-virginia-reciclaje-va_backup.md` — Texto completo del spec borrador v0.1
- `docs/alrac-virginia-reciclaje-va_integration.md` — Integración completa (triple perspectiva, EBD D1-D14)
- `src/core/lib/tq-virginia.ts` — Virginia Gateway implementado
- `src/core/state/virginia.ts` — Virginia state slice
- `openspec/specs/alrac-tq-virginia.md` — Virginia Network Gateway spec
- `docs/ECOSYSTEM_REVENUE_SHARING.md` — 4 círculos, limitaciones Virginia
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` — γ-CARMIS, αʰ, κ, Paso II
- `openspec/specs/alrac-znu-indexing-credit.md` — ZNU, crédito, expiración 90d
- `openspec/specs/alrac-ial-autotrofia-longeva.md` — IAL

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-11-20 | Propuesta inicial basada en borrador v0.1 del documento fuente: VA real, Pool, tres salidas, USH, tope ρ, circuit breakers |
