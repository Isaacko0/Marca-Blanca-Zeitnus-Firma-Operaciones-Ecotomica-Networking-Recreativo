// openspec/specs/alrac-tq-presence-sweat.md
// OpenSpec: Tokens No-Transferibles con Decay (Presence / Sweat)
// Mapas: PresenceToken, SweatToken, ERC20NonTransferableDecaying → TypeScript puro
// Estado: Propuesta — pendiente implementación
// Capa: 1 (Contable-Física) + Capa 4 (Interoperabilidad)

# SPEC: alrac-tq-presence-sweat
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript
**Source:** closerdao/proof-of-presence (src/ERC20/PresenceToken.sol, SweatToken.sol, ERC20NonTransferableDecaying.sol); closerdao/tdf-game-guide (05_token-economy/$presence.md, $sweat.md)
**Targets:** `src/core/lib/poh.ts`, `src/core/lib/contributionAccounting.ts` (extensión), `src/core/state/poh.ts` (nuevo)

---

## 1. Arquitectura de tokens no-transferibles con decay

$Presence y $Sweat son tokens no-transferibles con decay continuo. Su balance visible decae exponencialmente con el tiempo; solo cambian por mint/burn autorizados.

| Token | Transferible | Decay | ¿Quién mintea? | Rol en gobernanza |
|-------|-------------|-------|----------------|-------------------|
| $Presence | NO | ~0.03%/día (≈10%/año) | BOOKING_PLATFORM_ROLE, BOOKING_MANAGER_ROLE | Peso de voto ×1 |
| $Sweat | NO | 10%/año | Equipo (Team Members, Residents, bounty) | Amplifica peso de voto ×1 |

---

## 2. Especificación técnica

### 2.1 Interfaz: `DecayTokenState`

```typescript
interface DecayTokenState {
  address: string          // did del titular
  nonDecayedBalance: bigint // balance sin decay (mint acumulado - burn)
  lastDecayTimestamp: number // timestamp del último recálculo
  lastDecayedBalance: bigint // balance decayado calculado por última vez
  isHolder: boolean
  decayRatePerDay: number   // tasa de decay por día (scaled)
}
```

### 2.2 Función: `calculateDecayForDays(amount: bigint, daysAgo: number, decayRatePerDay: number): bigint`

Fórmula: `amount × (1 - decayRatePerDay)^díasAgo`
- `daysAgo == 0` → retorna `amount`
- Usa aritmética de punto fijo para precisión (estilo Solidity `FixedPointMathLib`)

### 2.3 Función: `calculateDecayedBalance(state: DecayTokenState, now: number): bigint`

- `passedDays = floor((now - lastDecayTimestamp) / 86400)`
- Retorna `calculateDecayForDays(lastDecayedBalance, passedDays, decayRatePerDay)`

### 2.4 Función: `mint(state, account, amount, daysAgo): DecayTokenState`

- Recalcula `lastDecayedBalance` hasta ahora
- Añade `calculateDecayForDays(amount, daysAgo)` al balance decayado
- Actualiza `lastDecayTimestamp = now`
- Incrementa `nonDecayedBalance` por `amount`

### 2.5 Función: `burn(state, account, burnData: {amount, daysAgo}[]): { finalBalance, state }`

- Suma `amount` y `decayedAmount = calculateDecayForDays(amount, daysAgo)` de cada entrada
- Recalcula `finalBalance = calculateDecayedBalance(state, now)`
- Si `decayedAmountToBurn > finalBalance` (diferencia > tolerancia de redondeo) → error
- Decrementa `nonDecayedBalance` y `lastDecayedBalance`

### 2.6 Reglas duras (boundaries.ts)

- `transferAllowed === false` (no transferible)
- `approveAllowed === false` (no approvals)
- `mintAllowedBy` solo roles autorizados (booking platform, manager, team)
- `burnAllowedBy` solo roles autorizados

---

## 3. Interoperabilidad con el peso de voto

| Token | Peso en voto | Fuente |
|-------|-------------|--------|
| $TDF | ×1 | `balanceOf` (transferible) |
| Staked TDF | ×1 | `stakedBalanceOf` (staking contract) |
| $Presence | ×1 | `calculateDecayedBalance()` |
| $Sweat | ×1 | `calculateDecayedBalance()` |

Total: `weight = tdf + staked + presence + sweat`

---

## 4. Criterios de aceptación

- [ ] `calculateDecayForDays(amount, 0, rate) === amount`
- [ ] `calculateDecayForDays(amount, 365, 0.03%/día) ≈ amount × 0.90`
- [ ] `mint` recalcula decay antes de añadir
- [ ] `burn` con `daysAgo` distinto calcula correctamente el decayed amount a quemar
- [ ] `transfer()` y `approve()` lanzan error (no permitidos)
- [ ] 0 errores TypeScript nuevos

---

## 5. Vectores de prueba

```typescript
// Presence decay: 100 tokens, 365 días, 0.03%/día
Input: amount=100e18, daysAgo=365, decayRatePerDay=0.0003
Expected: ≈ 89.6e18 (≈90% retenido)
```

```typescript
// Sweat decay: 100 tokens, 365 días, 10%/año → 0.0274%/día equivalente
Input: amount=100e18, daysAgo=365, annualDecay=10%
Expected: ≈ 90e18
```

---

## 6. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `tq-types-extended` | 1.0.0 | Tipos core (bigint, direcciones) |
| `contributionAccounting` | 1.0.0 | Registro de contribución (sweat) |
| `boundaries` | 1.0.0 | Límites duros (no transferible) |

---

## 7. Referencias

- `closerdao/proof-of-presence/src/ERC20/ERC20NonTransferableDecaying.sol`: https://github.com/closerdao/proof-of-presence/blob/main/src/ERC20/ERC20NonTransferableDecaying.sol
- `closerdao/proof-of-presence/src/ERC20/PresenceToken.sol`: https://github.com/closerdao/proof-of-presence/blob/main/src/ERC20/PresenceToken.sol
- `closerdao/proof-of-presence/src/ERC20/SweatToken.sol`: https://github.com/closerdao/proof-of-presence/blob/main/src/ERC20/SweatToken.sol
- `closerdao/tdf-game-guide/05_token-economy/$presence.md`: https://github.com/closerdao/tdf-game-guide/blob/main/05_token-economy/$presence.md
- `closerdao/tdf-game-guide/05_token-economy/$sweat.md`: https://github.com/closerdao/tdf-game-guide/blob/main/05_token-economy/$sweat.md
- `docs/oasa-tdf-governance-stack_integration.md` (EBD D11, D12)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-19 | Propuesta inicial: tokens no-transferibles con decay, Presence y Sweat |
