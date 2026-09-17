# CloddsBot — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Terminal de Trading IA** multi-venue para gestionar posiciones en Polymarket y otros mercados de predicción, con interfaz conversacional (chat), dry-run seguro y auditoría completa (Ley III).

## LLM (mapa de subsistemas)
| Subsistema CloddsBot | Módulo Zeitnus | Acción |
|---|---|---|
| Skills (118 estrategias) | `src/core/lib/clodds.ts` | Nuevo: registry de estrategias |
| Multi-venue adapters | `src/core/lib/clodds.ts` | Nuevo: adapter pattern |
| WebChat UI | `src/app/screens/Clodds.tsx` | Nuevo: UI conversacional |
| Gateway CLI | extirpado | Binario npm global |
| 21 messaging platforms | extirpado | Infra externa |
| Bittensor mining | extirpado | Subnet ajeno |
| Token launches | extirpado | Pump.fun/Bags.fm ajenos |

## Principio anfibio
- **Conservado**: goal → strategy selection → execution → audit trail
- **Extirpado**: CLI global, 21 platforms, Bittensor, Pump.fun, Binance latency
- **Reinterpretado**: "AI trading terminal" → "Polymarket Strategy Console"

## Isomorfismo HSCSG
- Strategy = VIA (kernel protocol)
- Adapter = CaaS tier (venue-specific interface)
- Dry-run = Verificación triaxial (simulación antes de ejecución)
- Audit trail = LoopEngine γ-CARMIS logging
