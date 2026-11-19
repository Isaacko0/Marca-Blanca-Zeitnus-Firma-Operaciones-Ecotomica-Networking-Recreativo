// openspec/specs/alrac-tq-economia-comunes.md
// OpenSpec: Capa Económica del Común Regenerativo (OASA / TDF)
// Maps: economía del común regenerativo (Delesque 2025) → implementación TypeScript Zeitnus/ALRAC
// Estado: Propuesta (a implementar)
// Capa: 5 (Transición Económica) + Capa 1 (Contable-Física TQ) + Capa 0 (Límites duros)

# SPEC: alrac-tq-economia-comunes
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** Delesque, S. "Rethinking Wealth: Economics of a Regenerative Commons", 27 dic 2025 (docs/oasa-tdf_economia_comunes_backup.md)
**Targets:** `src/core/lib/economia-comunes.ts`, `src/core/state/economia-comunes.ts`, `src/core/lib/tq.ts` (extensión), `src/core/lib/boundaries.ts` (DENY rules)

---

## 1. Arquitectura de la capa económica del común

El documento describe un modelo económico con cinco mecanismos distinguibles, cada uno mapeable a una parte del stack Zeitnus/ALRAC:

| Mecanismo | Descripción (fuente) | Destino técnico |
|---|---|---|
| Tierra como común perpetuo | Asociación suiza + SPV portuguesa; sin título individual; uso eterno; ingresos por disolución a causas regenerativas | `tq.ts` LandRegistry + `propertyRegimeSystem.ts` (Non-Dominium, custodio temporal) |
| Derecho de uso tokenizado | 1 $TDF = 1 noche/año, para siempre, no consumible; solo coste de operación (~€18/día), sin markup | `tq-oasa.ts` (use-rights), `tq-tdf.ts` |
| Curva de bonding (financiación continua) | Precio algoritmático ligado a oferta; €222 inicial → ~€420 capacidad plena; tope 18.600 tokens = noches-cama/año; inicialmente no transferibles | Nueva lógica `economia-comunes.ts` |
| Separación capital / operaciones | Fondo de capital (tokens + préstamos éticos + subvenciones) para tierra/infra; operaciones cubiertas por tasas de uso (≈ punto muerto 2025: €83k vs €86k) | `tq.ts` + `caas.ts` + `currentSeeSystem.ts` |
| Exit-to-commons | Token sales retiran deuda; €19k deuda → tokens en 2025; objetivo deuda cero, bien libre de cargas en común | `tq.ts` + `benefitRedistribution.ts` + `registrySystem.ts` |
| Sin renta / sin extracción | Prohibición de dividendos; excedentes reinvertidos; los inversores son los usuarios | `boundaries.ts` (DENY rules) |
| Ingresos diversificados | Tokens, estancias, eventos/retiros, producción in-situ (setas, agroforestería); €147k inversión capital 2025 | `alrac-caas-revenue-streams.md` (6 streams) |
| Trabajo reconocido | 20% de tokens a contribuyentes (sweat equity) | `contributionAccounting.ts` + `registrySystem.ts` |
| Gobernanza | Proof of Presence (voto por uso real) + Council of Regeneration (veto ecológico) | `tq-tdf.ts` + `tq-oasa.ts` + `boundaries.ts` |
| Horizonte milenario | Capital paciente, retorno en suelo/agua/bosques/comunidad; capital se devuelve y re-semilla | `ALRAC_MASTER_INTEGRADO.md` |

---

## 2. Especificación técnica

### 2.1 Interfaz: `BondingCurveParams`

```typescript
interface BondingCurveParams {
  basePriceEur: number;        // Precio base en € (TDF: 222)
  priceFullCapacityEur: number;// Precio en capacidad plena (TDF: ~420)
  maxSupplyTokens: number;     // Tope de oferta (TDF: 18.600 = noches-cama/año)
  currentSupply: number;       // Oferta en circulación
  currentPriceEur: number;     // Precio actual (TDF: ~256 a finales 2025)
  vestingBuildPhase: boolean;  // Tokens no transferibles durante la construcción
  milestonesReached: boolean;  // Hitos de financiación y construcción cumplidos
}
```

### 2.2 Función: `calculateBondingCurvePrice(params: BondingCurveParams): number`

Precio algoritmático creciente con la oferta, acotado por `priceFullCapacityEur` y `maxSupplyTokens`. La curva no permite oversalir la capacidad física de carga del terreno y las instalaciones.

Validaciones:
- `currentSupply <= maxSupplyTokens` (no oversell)
- Precio monotonía creciente con `currentSupply`
- Durante `vestingBuildPhase`: transferibilidad = false

### 2.3 Interfaz: `CapitalVsOperationsBudget`

```typescript
interface CapitalVsOperationsBudget {
  capitalFundEur: number;      // Token sales + préstamos éticos + subvenciones (tierra, infra)
  operationsRevenueEur: number;// Tasas de uso, eventos, producción (operativo)
  operationsExpenseEur: number;// Mantenimiento, servicios, comida, salarios, seguros
  tokenFundsDivertedToOperations: number; // DEBE ser siempre 0 (firewall)
  debtRetiredEur: number;      // Deuda extinguida con capital comunitario (exit-to-commons)
  isOperationalSurplusReinvested: boolean;// Excedente operativo → tierra/comunidad
}
```

### 2.4 Función: `enforceCapitalOperationsFirewall(budget: CapitalVsOperationsBudget): { ok; violations }`

- `tokenFundsDivertedToOperations === 0` (capital no se come por operaciones)
- `operationsRevenueEur` cubre `operationsExpenseEur` en estado estable (income = expenses)
- Cualquier excedente se reinvierte, no se distribuye

### 2.5 Interfaz: `ExitToCommonsState`

```typescript
interface ExitToCommonsState {
  initialDebtEur: number;      // Hipoteca/préstamos puente iniciales
  debtRetiredEur: number;      // Deuda pagada con token sales
  debtConvertedToTokensEur: number; // Deuda convertida en tokens (TDF: €19k en 2025)
  remainingDebtEur: number;    // Objetivo: 0
  assetFreeOfEncumbrances: boolean; // Bien libre de cargas en común
  fallbackToConservationTrust: boolean; // Si quiebra, tierra va a común de conservación, no mercado
}
```

### 2.6 Función: `retireDebtWithCommunityCapital(tokenRevenueEur: number, state: ExitToCommonsState): ExitToCommonsState`

Aplica parte de los ingresos de tokens a extinguir deuda. Cuando `remainingDebtEur === 0`, el proyecto ha hecho exit-to-commons.

### 2.7 Interfaz: `CommonsMember` (derecho de uso)

```typescript
interface CommonsMember {
  did: string;                 // Identidad soberana (RAO)
  tokens: number;              // $TDF (derecho de uso, no equity)
  nightsPerYear: number;       // tokens × 1 noche, renovable anualmente
  proofOfPresenceNights: number; // Noches efectivas en sitio (ponderación de voto)
  isVested: boolean;           // Transferible solo tras hitos
  hasGovernanceVoice: boolean; // Miembro aceptado en el DAO
}
```

---

## 3. Principio Anfibio (modo de operación)

La lógica económica debe operar en dos nodos:

| Nodo | Moneda | Regla |
|---|---|---|
| Postmonetario (default, offline) | ZNU / CaaS | Acceso por contribución, sin tipo de cambio fiat |
| Conectado (Nivel 3 ReFi) | USD / USDC vía oráculo priceParity | Puente opcional, nunca motor de TQ |

**Regla dura (boundaries.ts):** TQ (1 TQ = 1 kWh) opera SOLO en modo postmonetario. `priceParity` aplica a ZNU, nunca a TQ. DENY rules: `gaia_price_negotiation`, `gaia_platform_commission`, `gaia_fiat_exchange`, `tq_buy_sell_fiat`, `tq_buy_sell_crypto`, `tq_commission`, `tq_price_negotiation`. Comisión = 0, voto = 1, balance base = 0.

---

## 4. Integración con specs existentes

| Spec existente | Punto de integración |
|---|---|
| `alrac-tq-oasa` (Constitución, 11 artículos, 7 principios) | Los 7 principios ecológicos sirven de métricas para el veto del Council of Regeneration y el valor subyacente del común |
| `alrac-tq-tdf` (3 pistas de verificación) | Pista 2 (on-chain): cumplimiento de tokenomics, vesting; Pista 3 (social): cuidado, gobernanza, impacto ecológico |
| `alrac-tq-land` (registro de tierra productiva, kWh/año) | La tierra del común es el activo productivo anclado a kWh reales (TQ = 1 kWh) |
| `alrac-caas-revenue-streams` (6 streams + Gate MJ) | Los ingresos diversificados de TDF mapean a los 6 streams CaaS |
| `alrac-caas-membership` (3 niveles) | Afiliados/Asociados/Núcleo del común OASA |

---

## 5. Criterios de aceptación

- [ ] Curva de bonding calculable: €222 inicial → ~€420 capacidad plena; tope 18.600 tokens
- [ ] Firewall capital/operaciones: `tokenFundsDivertedToOperations === 0` siempre
- [ ] Exit-to-commons: `remainingDebtEur` reducible a 0 con token sales; `assetFreeOfEncumbrances === true` al final
- [ ] No extracción: `isExtractionAllowed() === false`; dividendos denegados por `boundaries.ts`
- [ ] Proof of Presence: voto ponderado por noches efectivas, no solo por tokens
- [ ] Consejo de Regeneración: veto ecológico operativo sobre decisiones que vulneren los 7 principios
- [ ] Principio anfibio: TQ sin priceParity; ZNU con oráculo Nivel 3; no mezclar
- [ ] 0 errores TypeScript nuevos en módulos tocados
- [ ] Tests unitarios para cada función de §2

---

## 6. Vectores de prueba (test vectors)

### 6.1 Curva de bonding
```typescript
Input:  { basePriceEur: 222, priceFullCapacityEur: 420, maxSupplyTokens: 18600,
          currentSupply: 0, vestingBuildPhase: true, milestonesReached: false }
Expected: price = 222; transferable = false
```
```typescript
Input:  { ..., currentSupply: 18600, vestingBuildPhase: false, milestonesReached: true }
Expected: price ≈ 420; transferable = true
```

### 6.2 Firewall capital/operaciones
```typescript
Input:  { capitalFundEur: 106000, operationsRevenueEur: 83000, operationsExpenseEur: 86000,
          tokenFundsDivertedToOperations: 0 }
Expected: ok = true; operaciones ≈ punto muerto; capital intacto para infraestructura
```

### 6.3 Exit-to-commons
```typescript
Input:  { initialDebtEur: 50000, debtRetiredEur: 19000 (convertido en tokens) }
Expected: remainingDebtEur = 31000; tras más ventas de tokens → 0; assetFreeOfEncumbrances = true
```

### 6.4 Límites duros (boundaries)
```typescript
Input:  intento de comisión > 0 en TQ, o priceParity aplicado a TQ
Expected: DENY; operación rechazada
```

---

## 7. Dependencias

| Dependencia | Versión | Propósito |
|---|---|---|
| `tq-types-extended` | 1.0.0 | Tipos core (TQ = 1 kWh, ±500) |
| `tq-oasa` | 1.0.0 | Constitución y use-rights del común |
| `tq-tdf` | 1.0.0 | Verificación de 3 pistas y Proof of Presence |
| `tq-land` | 1.0.0 | Registro de tierra productiva anclada a kWh |
| `caas` | 1.0.0 | Streams de ingreso y firewall capital/operaciones |
| `boundaries` | 1.0.0 | Límites duros (no extracción, comisión 0, voto 1) |
| `valueDual` + `znu` | 1.0.0 | Principio anfibio postmonetario / conectado |

---

## 8. Referencias

- Delesque, Samuel. "Rethinking Wealth: Economics of a Regenerative Commons", 27 dic 2025. (`docs/oasa-tdf_economia_comunes_backup.md`)
- OASA WhitePaper V1.2: https://oasa.earth/papers/OASA-Whitepaper-V1.2.pdf
- OASA Constitution 2025: https://oasa.earth/papers/oasa-constitution-2025
- `docs/oasa-tdf_economia_comunes_integration.md` (triple perspectiva, mapeo isomórfico, EBD D1-D8)
- `openspec/specs/alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-caas-revenue-streams.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- Ostrom, E. *Governing the Commons* (1990)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-19 | Propuesta inicial: curva de bonding, firewall capital/operaciones, exit-to-commons, límites duros, principio anfibio, vectores de prueba |
