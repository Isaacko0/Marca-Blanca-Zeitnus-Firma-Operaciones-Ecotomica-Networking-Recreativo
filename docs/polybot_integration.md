# Polybot — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita una **Plataforma de Trading Cuantitativo** para ejecutar estrategias en Polymarket con ingestion de datos en tiempo real, analytics de replicación, y risk management multi-layer.

## LLM (mapa de subsistemas)
| Subsistema Polybot | Módulo Zeitnus | Acción |
|---|---|---|
| Executor Service | `src/core/lib/polybot.ts` | Nuevo: execution engine paper/live |
| Strategy Service | `src/core/lib/polybot.ts` | Nuevo: strategy runtime |
| Ingestor Service | `src/core/lib/polybot.ts` | Nuevo: trade ingestion → local store |
| Analytics Service | `src/core/lib/polybot.ts` | Nuevo: replication scoring |
| ClickHouse/Redpanda | extirpado | Infra pesada → SQLite/local store |
| Docker Compose | extirpado | Orquestación multi-servicio |
| Monitoring stack | extirpado | Grafana/Prometheus ajenos |
| Java/Spring Boot | extirpado | Runtime JVM |

## Principio anfibio
- **Conservado**: ingest → strategy → execute → analyze → replicate
- **Extirpado**: JVM, ClickHouse, Redpanda, Docker, Grafana, 5 microservicios
- **Reinterpretado**: "Java microservices" → "TypeScript unified engine"

## Isomorfismo HSCSG
- Ingestor = LoopEngine sensor input (data collection)
- Strategy = VIA protocol (execution logic)
- Executor = Automaton action (Ley I/II gate)
- Analytics = Verificación triaxial (replication scoring)
- AWARE fund = CaaS monetization (postmonetario)
