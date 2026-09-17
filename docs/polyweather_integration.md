# PolyWeather — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Oracle de Temperatura** para mercados de predicción climática, con datos de asentamiento verificables, consenso multi-modelo (DEB), y probabilidad calibrada para trading informado.

## LLM (mapa de subsistemas)
| Subsistema PolyWeather | Módulo Zeitnus | Acción |
|---|---|---|
| Weather Collector | `src/core/lib/polyweather.ts` | Nuevo: multi-source ingestion |
| DEB Engine | `src/core/lib/polyweather.ts` | Nuevo: Dynamic Error Blending |
| Probability Engine | `src/core/lib/polyweather.ts` | Nuevo: deb_normal buckets |
| Market Scanner | `src/core/lib/polyweather.ts` | Nuevo: model vs market diff |
| FastAPI web | `src/app/screens/PolyWeather.tsx` | Nuevo: UI dashboard |
| Telegram bot | extirpado | Canal externo |
| Docker services | extirpado | Infra multi-servicio |
| Onchain checkout | extirpado | Pagos Polygon |
| Browser extension | extirpado | Extensión ajena |

## Principio anfibio
- **Conservado**: observations → DEB consensus → calibrated probability → market diff
- **Extirpado**: Telegram, Docker, Redis, Polygon checkout, extension, paid features
- **Reinterpretado**: "weather intelligence" → "temperature oracle for prediction markets"

## Isomorfismo HSCSG
- DEB consensus = Verificación triaxial (multi-axis agreement)
- Settlement observations = Ley III (lucidez, datos verificables)
- Probability buckets = ZNU pricing (integer-degree buckets)
- Market diff = Arbitrage signal (PnL opportunity)
