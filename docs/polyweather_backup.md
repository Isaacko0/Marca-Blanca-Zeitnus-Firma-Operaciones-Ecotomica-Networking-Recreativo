# PolyWeather — Backup Original

**Fuente**: https://github.com/yangyuan-zhen/PolyWeather
**Licencia**: AGPL-3.0
**Stack**: Python 3.11 + FastAPI + Next.js 15 + React 19 + SQLite/Redis

## Descripción original
Weather intelligence stack para mercados de temperatura (Polymarket). Agrega observaciones METAR/TAF, forecasts (Open-Meteo, JMA AMeDAS, HKO), DEB (Dynamic Error Blending) para consenso horario, DEB normal probability engine para buckets de temperatura.

## Pipeline
1. Weather Collector → METAR, TAF, Open-Meteo, JMA AMeDAS, HKO, IMGW
2. DEB + Hourly Consensus → peak window detection
3. DEB Normal Engine → calibrated probability buckets P(T==τ)
4. Market Scan → model probability vs market implied probability
4. SSE realtime → Web dashboard + Telegram bot
5. Onchain checkout (Polygon USDC) + payments audit

## Features
- 51 ciudades monitorizadas (incluye Hong Kong CoWIN, Tokyo JMA, Shenzhen ZGSZ)
- Settlement-source-first observations
- TAF timing overlays
- Intraday analysis (meteorology headline + paths + evidence)
- Browser extension (lightweight lead-in)
- SQLite WAL + Redis Stream (event store)
- 7 Docker services: web, frontend, bot, collector, warmer, training_settlement, redis
