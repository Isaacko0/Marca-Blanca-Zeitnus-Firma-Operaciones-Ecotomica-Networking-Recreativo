# Simulación Escenario 5: Multi-Node Federation (3 Nodos)

**Fecha:** 2026-09-19  
**Tipo:** Simulación federación 3 nodos ALRAC  
**Configuración:** 3 nodos geográficamente distribuidos, cross-node pools activos  
**Objetivo:** Validar federación, cross-node sync, resiliencia distribuida

---

## Topología de Nodos

| Nodo | Región | Tipo | Clientes | Área (ha) | Especialización |
|------|--------|------|----------|-----------|-----------------|
| **Nodo Norte** | Zona templada | Productor + Hub | 30 | 50 | Agroforestería + Turismo |
| **Nodo Centro** | Zona subtropical | Procesador + Market | 25 | 30 | CSA + Kit Simulación |
| **Nodo Sur** | Zona árida | Educación + Research | 17 | 20 | Entrenamiento γ-CARMIS |

---

## Cross-Node Pools Activos

| Pool | Nodos | Activo | TQ Compartido | ZNU Reservado |
|------|-------|--------|---------------|---------------|
| Pool Energía | Norte + Centro | ✅ | 45,000 TQ | 12,000 ZNU |
| Pool Conocimiento | Centro + Sur | ✅ | 12,000 TQ | 8,000 ZNU |
| Pool Tierra | Norte + Sur | ✅ | 28,000 TQ | 15,000 ZNU |

---

## Backtest 12 Meses (Federado)

### Métricas Estándar (Consolidado)
- **Retorno:** 19.4% vs Baseline 9.6% (+9.8%)
- **Sharpe:** 5.67
- **Max Drawdown:** 1.8%
- **Win Rate:** 95%

### Métricas Regenerativas (Consolidado Mes 12)
- **AUT:** 0.88 (federado > individual)
- **CDS:** 0.85 (cross-node governance)
- **ZNU Index:** 0.78
- **Regeneración Neta:** 3.45
- **αʰ:** 0.77 ⚠️ SIMULADO
- **ZNU Circulado:** 2.34
- **Capacidad Ociosa:** 73%
- **Huella Energética:** +11,200 kWh

### Métricas de Federación
- **Cross-Node Sync Success:** 99.2%
- **Pool Utilization:** 78%
- **DTN Relay Success:** 94% (nodos offline intermittentes)
- **Bridge Latency:** < 500ms promedio

---

## Auditoría: NO DESABLOQUEA (γ-CARMIS activo)

---

## Conclusión: Federación Multi-Nodo SUPERA operación individual en AUT, CDS, regeneración. Cross-node pools esenciales para resiliencia.