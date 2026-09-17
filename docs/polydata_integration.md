# Poly Data — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita una **Base de Datos Histórica Local** de trades Polymarket para análisis cuantitativo, backtesting de estrategias, y replicación de Smart Money — todo offline-first sin APIs recurrentes.

## LLM (mapa de subsistemas)
| Subsistema Poly Data | Módulo Zeitnus | Acción |
|---|---|---|
| HyperSync Stream | `src/core/lib/polydata.ts` | Nuevo: incremental sync logic |
| OrderFilled Decode | `src/core/lib/polydata.ts` | Nuevo: event parsing |
| CLOB Join | `src/core/lib/polydata.ts` | Nuevo: market metadata enrichment |
| Trade Processor | `src/core/lib/polydata.ts` | Nuevo: USD amounts, BUY/SELL, tokens |
| Markets Fetch | `src/core/lib/polydata.ts` | Nuevo: market metadata cache |
| Backtrader | `src/core/lib/polydata.ts` | Nuevo: backtesting framework |
| CLI tools | `src/app/screens/PolyData.tsx` | Nuevo: UI para sync + query |
| HyperSync API | extirpado | API externa (token required) |
| Python/Polars | extirpado | Runtime ajeno → TS implementation |

## Principio anfibio
- **Conservado**: stream → decode → enrich → store → query → backtest
- **Extirpado**: HyperSync API, Python/Polars, Envio, Goldsky, GraphQL
- **Reinterpretado**: "Polymarket data retriever" → "local trade database + analytics"

## Isomorfismo HSCSG
- HyperSync stream = LoopEngine sensor (continuous ingestion)
- OrderFilled = ValueFlow (atomic trade record)
- CLOB join = Base Material join (metadata enrichment)
- Processed trades = PVSO (provenance-verified)
- Backtest = Verificación triaxial (simulación histórica)
- Local CSV/Parquet = Postmonetario storage (no cloud)
