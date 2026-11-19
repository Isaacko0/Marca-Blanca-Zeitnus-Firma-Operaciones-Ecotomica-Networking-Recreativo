# RESPALDO DE FUENTE — Proof of Presence (closerdao/proof-of-presence)

## Identificación de la fuente

- **Título:** Proof of Presence — Contratos inteligentes TDF
- **Autor/Org:** closerdao (Closer), contribuyentes incluyendo arturictus, microHoffman, Zitzak, closerearth, bpolania, tintio, marceljay, fabianschu
- **Repo:** https://github.com/closerdao/proof-of-presence
- **Rama:** main
- **Tipo:** Contratos Solidity + Hardhat (TypeScript 54.5%, Solidity 43.9%, JavaScript 1.6%)
- **Licencia:** MIT para el repositorio en general, pero contratos clave bajo **AGPL-1.0** (TDFToken.sol, AdminFacet.sol) y **MIT** (PresenceToken.sol, SweatToken.sol, ERC20NonTransferableDecaying.sol, librerías)

## ⚖️ Aviso de derechos de autor y restricción de licencia

Los contratos bajo **AGPL-1.0** (copyleft fuerte) NO se copian en este repositorio. Bajo la regla de la skill de asimilación, se aíslan en `docs/_licencia_incompatible/` si fuera necesario y se reimplementan los patrones en TypeScript puro sin copiar código literal de Solidity. Los contratos MIT (PresenceToken, SweatToken, lógica de decay) pueden servir de referencia para reimplementación limpia.

## Qué es el repositorio

Contratos inteligentes de TDF desplegados en Celo (mainnet y Sepolia/testnet). Patrón Diamond (proxy actualizable) con facetas: staking, membresía, admin, booking (alojamiento), crowdsale. Tokens: TDF (transferible, gobernanza), Presence (no transferible, decay), Sweat (no transferible, decay), crowdsale/dynamic sale.

## Contratos clave y lógica pura (para reimplementar en TS)

| Contrato | Archivo | Licencia | Lógica pura extraíble |
|----------|---------|----------|----------------------|
| TDFToken | `src/ERC20/TDFToken.sol` | AGPL-1.0 | ERC20 pausable, control de transferencia por DAO (`isTokenTransferPermitted`), mint/burn solo DAO/owner |
| PresenceToken | `src/ERC20/PresenceToken.sol` | MIT | ERC20 no transferible con decay continuo (exponencial por día) |
| SweatToken | `src/ERC20/SweatToken.sol` | MIT | ERC20 no transferible con decay continuo (10% anual) |
| ERC20NonTransferableDecaying | `src/ERC20/ERC20NonTransferableDecaying.sol` | MIT | Clase base: decay `balance = initial * (1 - rate)^días`, mappings `lastDecayedBalance`/`lastDecayTimestamp`, no transfer/approve |
| StakingFacet | `src/diamond/facets/StakingFacet.sol` | AGPL-1.0 | Depositar/retirar/restakear stake con timed release (1 año), `stakedBalanceOf`, depósitos ordenados por timestamp |
| StakeLibV2 | `src/diamond/libraries/StakeLibV2.sol` | MIT | Librería de staking con cola ordenada (OrderedStakeLib), `handleBooking`/`handleCancelation` para staking vinculado a reservas |
| OrderedStakeLib | `src/diamond/libraries/OrderedStakeLib.sol` | MIT | Cola doble ordenada de depósitos con timestamp, `takeUntil` (liberación tras 1 año), `balanceFrom`/`balanceUntil` |
| MembershipFacet | `src/diamond/facets/MembershipFacet.sol` | MIT | Agregar/quitar miembros (`isMember`, `membersLength`), rol `MEMBERSHIP_MANAGER_ROLE` |
| AdminFacet | `src/diamond/facets/AdminFacet.sol` | AGPL-1.0 | Control de acceso basado en roles (AccessControl), pause/unpause, mint de tokens comunitarios, `isTokenTransferPermitted` |
| AppStorage | `src/diamond/libraries/AppStorage.sol` | MIT | Estructura de almacenamiento del Diamond: roles, bookings, staking, miembros, tesoro TDF |
| BookingFacet | `src/diamond/facets/BookingFacet.sol` | AGPL-1.0 | Reservas de alojamiento por año/día, check-in/check-out, cancelación, staking vinculado a booking, años de alojamiento |

## Lógica de dominio clave (resumen arquitectónico)

- **Voting weight (per FORMULA.md de tdf-snapshot-voting):** `TDF.balanceOf + Staking.stakedBalanceOf + Presence.balanceOf + Sweat.balanceOf` (todos ×1)
- **Presence decay:** exponencial, ~0.03%/día (~10% anual)
- **Sweat decay:** 10% anual
- **Staking:** depósito con liberación tras 1 año; `stakedBalanceOf` = balance total; `unlockedStake` = liberable; `lockedStake` = bloqueado
- **Booking-staking vinculación:** al hacer una reserva, se hace stake del precio; al cancelar, se mueve el stake; staking requerido = max balance de reservas futuras
- **Control de transferencia TDF:** solo DAO o owner pueden transferir fuera de casos exceptuados (mint, burn, tesorería, contrato mismo)
- **Roles:** DEFAULT_ADMIN_ROLE, MEMBERSHIP_MANAGER_ROLE, MINTER_ROLE, BOOKING_PLATFORM_ROLE, BOOKING_MANAGER_ROLE

## Despliegues

- Celo Alfajores (testnet) y mainnet, con direcciones documentadas en `deployments/`
- TDF treasury migration (mover permiso de transferencia de TDF a Safe tesorería) — deploy 008
