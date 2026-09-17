# CloddsBot — Backup Original

**Fuente**: https://github.com/alsk1992/CloddsBot
**Licencia**: MIT
**Stack**: Node.js 22+ + TypeScript 5.3 + 21 messaging platforms

## Descripción original
Terminal de trading AI personal para mercados de predicción, crypto spot, futuros perpetuos, token launches y Bittensor subnet mining. Powered by Claude con 118+ estrategias de trading, whale tracking, arbitraje, copy trading, DCA bots.

## Funcionalidades principales
1. 118+ estrategias listas (latencia Binance-Polymarket, Penny Clipper, DCA, Smart Routing)
2. 10 mercados de predicción + 7 exchanges de futuros
3. Solana integration (Jupiter, Pump.fun, Raydium, Orca, Bags.fm)
4. EVM chains (Robinhood, Base, ETH, Arbitrum, Optimism, Polygon)
5. 21 canales de mensajería (Telegram, Discord, WhatsApp, etc.)
6. WebChat integrado en localhost:18789
7. Bittensor subnet mining (TAO)
8. Token launch participation (Pump.fun, Bags.fm)

## Instalación
```bash
npm install -g https://github.com/alsk1992/CloddsBot/releases/latest/download/clodds.tgz
clodds onboard
```

## Arquitectura
- CLI gateway + WebChat UI
- Skills system (121+ skills para trading)
- Multi-venue adapter pattern
- Dry-run mode por defecto
