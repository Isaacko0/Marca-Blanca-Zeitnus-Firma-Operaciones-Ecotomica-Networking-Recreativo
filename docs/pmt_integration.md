# Prediction Markets Trading Bot Toolkits — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Motor de Estrategias Multi-Venue** para ejecutar bots de trading en Polymarket y otros mercados, con risk layer compartido, dry-run obligatorio y venue adapters intercambiables.

## LLM (mapa de subsistemas)
| Subsistema PMT | Módulo Zeitnus | Acción |
|---|---|---|
| Engine core | `src/core/lib/pmt.ts` | Nuevo: core engine + risk layer |
| Venue adapters | `src/core/lib/pmt.ts` | Nuevo: PolymarketAdapter, KalshiAdapter, etc. |
| Strategy bots (10) | `src/core/lib/pmt.ts` | Nuevo: registry de strategies |
| TUI/CLI | `src/app/screens/PMT.tsx` | Nuevo: UI dashboard |
| Rust toolchain | extirpado | Compilación nativa |
| Prebuilt binaries | extirpado | Distribución binaria |
| Telegram bot | extirpado | Canal externo |

## Principio anfibio
- **Conservado**: engine → adapters → strategies → risk → execution
- **Extirpado**: Rust toolchain, binaries, 20 venue repos, Telegram, hosted service
- **Reinterpretado**: "venue-agnostic" → "adapter pattern per venue"

## Isomorfismo HSCSG
- Engine = LoopEngine (orchestrator)
- Adapters = CaaS tiers (interfaces per venue)
- Strategies = VIAs (protocolos específicos)
- Risk layer = Ley I/II MJ (no dañar base, soberanizar)
- Dry-run = Verificación triaxial simulada
