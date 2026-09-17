# Prediction Markets Trading Bot Toolkits — Backup Original

**Fuente**: https://github.com/HarrierOnChain/Prediction-Markets-Trading-Bot-Toolkits
**Licencia**: MIT
**Stack**: Rust 1.70+ + Tokio + 20 venue repos

## Descripción original
Infraestructura de trading venue-agnostic para mercados de predicción. Un execution core + risk layer compartidos por 10 strategy bots. Venue adapter interface = 1 adapter por mercado (no rebuild por bot). 20 venues mapeados.

## Estrategias (10 bots)
1. Copy Trading
2. Polymarket-Kalshi Arbitrage
3. General Arbitrage
4. Whale Tracking
5. Sports Arbitrage
6. Spread Farming
7. Market Making
8. Order Flow Analysis
9. Momentum
10. Mean Reversion

## Arquitectura
- Engine core (Rust): order management, risk, execution
- Venue adapters: Polymarket, Kalshi, PredictIt, Manifold, etc.
- TUI interactivo + CLI
- Dry-run por defecto (enable_trading: false)
- Prebuilt binaries para Linux/macOS/Windows
