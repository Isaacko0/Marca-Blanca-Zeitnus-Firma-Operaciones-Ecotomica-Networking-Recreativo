# Polymarket LP Tool — Backup Original

**Fuente**: https://github.com/lihanyu81/polymarket_lp_tool
**Licencia**: MIT (Python) / Rust experimental
**Stack**: Python 3.11 + Rust (tokio, reqwest, tokio-tungstenite)

## Descripción original
Tool para gestionar órdenes límite en Polymarket maximizando recompensas de liquidez. NO crea órdenes iniciales — solo gestiona órdenes abiertas existentes (keep/cancel/cancel+replace same size) basado en order book + reward half-width delta.

## Versión Python (mainline, production)
- `passive_liquidity/simple_price_policy.py` — pricing rules
- `run_passive_bot.py` — main loop
- `run_web_panel.py` — web dashboard
- Telegram bot commands: /status /orders /pnl /set_rule
- Whitelist per token+side
- Custom pricing rules via Telegram/Web/JSON

## Versión Rust (2.0, experimental)
- WebSocket-first (market/user channels)
- Anti-sniping: midpoint jump pause, EMA/median filtered midpoint, post-fill cooldown
- Risk monitoring framework
- FSM-based Telegram commands
- No web panel yet

## Pricing Rules
- Coarse tick (0.01/1.0): specific logic
- Fine tick (0.001/0.1): specific logic
- Other: keep, no adjustment
