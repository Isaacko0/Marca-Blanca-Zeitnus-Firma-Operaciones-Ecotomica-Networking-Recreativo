# Polymarket-bot (MrFadiAi) — Backup Original

**Fuente**: https://github.com/MrFadiAi/Polymarket-bot
**Licencia**: MIT
**Stack**: Node.js 18+ + TypeScript + Poly SDK + Dashboard

## Descripción original
Bot de trading automatizado para Polymarket con Smart Money strategy: encuentra mejores traders por PnL, filtra por win rate + consistencia, crea lista para copy trading automatizado.

## Features v3.2 (Sep 2026)
- 13 execution safety issues resueltos
- Fee-aware profits (taker fees + gas + min net-profit gate)
- Price-protected orders (worst-price caps from live order book)
- Sequential arb execution (YES/NO legs con unwind-on-partial-fill)
- Tighter DipArb hedging (timeout 60s, 20% stop-loss, 1:1 hedge)
- Fresh copy-trade quotes (>5s stale skipped, re-quote live book)
- Custom wallets gated (same WR/PnL/consistency filters)
- Exposure caps (30% total, per-market tracking)
- Configurable RPC (POLYGON_RPC_URL)
- Wallet circuit breaker (3 failures → 1h cooldown)
- Backtesting harness (JSONL order-book replay + fee/gas modeling)
- MATIC monitoring (5min gas balance check)
- Sizing floor + streak pause (6 straight losses → pause)

## Risk Management (6 Layers)
1. Daily loss limit (5%)
2. Monthly loss limit (15%)
3. Drawdown limit (25%)
4. Total loss halt (40%)
5. Loss-streak pause (6 consecutive losses)
6. Exposure cap (30% of capital)

## Strategies
- Arbitrage (fee-aware)
- DipArb (tight hedging)
- Copy Trading (Smart Money filtered)
- Market Making (delta-neutral)

## Dashboard
React-based dashboard con real-time PnL, risk status, trade history
