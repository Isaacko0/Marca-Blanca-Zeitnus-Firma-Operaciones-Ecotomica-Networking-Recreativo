# Poly Data — Backup Original

**Fuente**: https://github.com/warproxxx/poly_data
**Licencia**: GPL-3.0
**Stack**: Python 3.10+ + Polars + HyperSync (Envio) + Backtrader

## Descripción original
Pipeline para fetching, processing, analyzing Polymarket v2 trading data. Streams OrderFilled events desde CTF Exchange V2 en Polygon via Envio HyperSync, joins con metadata CLOB API, writes structured trades to CSV.

## Pipeline Stages
1. `update.py` — HyperSync stream → `data/orderFilled.csv` (raw events)
2. `poly_utils/process.py` — decode OrderFilled + CLOB join → `processed/trades.csv`
3. `poly_utils/markets.py` — fetch markets → `processed/markets.csv`
4. `Explore and Backtest.ipynb` — analysis notebook

## Data Files
- `data/orderFilled.csv` — raw events (transaction_hash, log_index, block_number, timestamp, maker, taker, token_id, price, size, side, fee)
- `processed/trades.csv` — enriched trades (USD amounts, BUY/SELL direction, token1/token2)
- `processed/markets.csv` — market metadata (question, outcomes, clobTokenIds, end_date)

## Features
- Resumable/incremental (checkpoint by block number)
- HyperSync API token required (free at envio.dev)
- Offline tests (pytest, no network)
- Backtrader integration for backtesting
- PROCESS_CHUNK_SIZE for memory-constrained machines

## Analysis Example
```python
import polars as pl
from poly_utils.utils import get_markets

trades_df = pl.read_csv("processed/trades.csv")
trader_df = trades_df.filter(pl.col("maker") == "0x...")
# Note: filter on maker (contract perspective), not taker
```
