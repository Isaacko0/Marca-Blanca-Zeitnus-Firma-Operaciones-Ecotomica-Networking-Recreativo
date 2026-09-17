# Polymarket-bot — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Bot de Copy Trading Inteligente** que identifique Smart Money en Polymarket, filtre por métricas de calidad (win rate, profit factor, consistency), y ejecute copy trading con risk management de 6 capas.

## LLM (mapa de subsistemas)
| Subsistema PMBot | Módulo Zeitnus | Acción |
|---|---|---|
| Smart Money Finder | `src/core/lib/pmbot.ts` | Nuevo: leaderboard scan + filters |
| Copy Trade Executor | `src/core/lib/pmbot.ts` | Nuevo: fresh quotes + execution |
| Risk Engine (6 layers) | `src/core/lib/pmbot.ts` | Nuevo: daily/monthly/drawdown/total/streak/exposure |
| Arbitrage/DipArb | `src/core/lib/pmbot.ts` | Nuevo: fee-aware + sequential execution |
| Dashboard | `src/app/screens/PMBot.tsx` | Nuevo: UI real-time PnL + risk |
| Poly SDK | extirpado | SDK externo |
| Backtest harness | `src/core/lib/pmbot.ts` | Nuevo: JSONL replay local |
| RPC config | extirpado | Endpoint externo |

## Principio anfibio
- **Conservado**: find → filter → copy → risk → execute → monitor
- **Extirpado**: Poly SDK, Polygon RPC, hosted dashboard, Arabic docs
- **Reinterpretado**: "Smart Money copy trading" → "quality-filtered replication"

## Isomorfismo HSCSG
- Smart Money filter = CDS (consenso 60% WR + 1.5 PF + consistency)
- Risk layers = Leyes MJ (I: no dañar, II: soberanizar, III: lucidez)
- Exposure cap = AUT/CDS ratio (autonomía vs capital)
- Backtest = Verificación triaxial histórica (simulación)
- Circuit breaker = γ-CARMIS overload detection
