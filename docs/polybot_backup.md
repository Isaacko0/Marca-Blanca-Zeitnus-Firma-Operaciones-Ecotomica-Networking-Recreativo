# Polybot — Backup Original

**Fuente**: https://github.com/ent0n29/polybot
**Licencia**: MIT
**Stack**: Java 21 + Maven + Spring Boot + ClickHouse + Redpanda + Docker Compose

## Descripción original
Infraestructura de trading Polymarket multi-servicio: execution (paper/live), strategy runtime + market making, ingestion (ClickHouse + Redpanda), analytics + replication scoring. Foundation para AWARE fund.

## Servicios (5 microservicios)
1. `analytics-service` (puerto 8080) — quantitative analysis, replication metrics
2. `executor-service` (8081) — automated execution paper/live
3. `infrastructure-orchestrator-service` (8082) — coordination
4. `ingestor-service` (8083) — market/user trade ingestion → ClickHouse
5. `strategy-service` (8084) — strategy runtime, market making
6. `polybot-core` — shared library

## Stack
- ClickHouse (analytics DB) puerto 8123
- Redpanda (event streaming)
- Grafana + Prometheus + Alertmanager (monitoring)
- Docker Compose orchestration
- Research toolkit (Python) en `research/`

## Quick Start
```bash
./start-all-services.sh  # builds + starts all
curl localhost:8080/actuator/health  # verify
```
