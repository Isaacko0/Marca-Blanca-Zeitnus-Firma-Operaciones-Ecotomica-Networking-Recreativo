# Polymarket LP Tool — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Gestor de Liquidez Pasiva** para optimizar recompensas de LP en Polymarket gestionando órdenes límite existentes, con pricing rules anfibios y anti-sniping.

## LLM (mapa de subsistemas)
| Subsistema LP Tool | Módulo Zeitnus | Acción |
|---|---|---|
| Simple Price Policy | `src/core/lib/lptool.ts` | Nuevo: coarse/fine tick pricing |
| Order Manager | `src/core/lib/lptool.ts` | Nuevo: cancel/replace/retry |
| Whitelist Manager | `src/core/lib/lptool.ts` | Nuevo: token+side filtering |
| Custom Rules | `src/core/lib/lptool.ts` | Nuevo: per-order pricing rules |
| Web Panel | `src/app/screens/LPTool.tsx` | Nuevo: UI dashboard |
| Telegram bot | extirpado | Canal externo |
| Rust WS core | extirpado | Infra WebSocket nativa |

## Principio anfibio
- **Conservado**: whitelist → filter → pricing → execution → monitoring
- **Extirpado**: Telegram, Rust WS, WebSocket channels, production Rust
- **Reinterpretado**: "liquidity rewards maximization" → "passive LP manager"

## Isomorfismo HSCSG
- Whitelist = CDS (curated set)
- Pricing rules = VIA protocols (deterministic logic)
- Anti-sniping = Ley I (no dañar base material via adverse selection)
- Order manager = LoopEngine tick (periodic reconciliation)
