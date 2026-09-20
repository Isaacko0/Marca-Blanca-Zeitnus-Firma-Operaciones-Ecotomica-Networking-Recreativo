# Simulación Escenario 3: Agresivo (High TQ, Low ZNU)

**Fecha:** 2026-09-19  
**Tipo:** Simulación @alrac-data → @alrac-strategy → @alrac-backtest → @alrac-review  
**Configuración:** Alto TQ (2000-5000/cliente), Bajo ZNU (50-500/cliente)  
**Objetivo:** Validar liquidez y regeneración inmediata (H1)

---

## Dataset Sintético (72 clientes, 5 líneas)

| Línea | Clientes | Ingreso Proyectado | TQ Total | ZNU Total | Ratio TQ/ZNU |
|-------|----------|-------------------|----------|-----------|--------------|
| A | 17 | $299,488 | 79,788 | 1,809 | 44.1 |
| B | 13 | $115,933 | 56,038 | 1,275 | 44.0 |
| C | 12 | $379,051 | 63,242 | 1,176 | 53.8 |
| D | 17 | $112,919 | 71,796 | 1,803 | 39.8 |
| E | 13 | $472,945 | 58,838 | 1,264 | 46.6 |
| **TOTAL** | **72** | **$1,380,336** | **329,702** | **7,326** | **45.0** |

---

## Estrategia Aplicada (Agresiva)

- **Sizing:** 40% excedente (vs 30% base)
- **Entry κ_amid:** 0.55 (vs 0.65 base) - más permisivo
- **Exit β_crit:** 50% (vs 40% base) - stop-loss más tardío
- **Horizonte preferido:** H1 (TQ/liquidez) 60%, H2 30%, H3 10%

---

## Backtest 12 Meses (Resultados Simulados)

### Métricas Estándar
- **Retorno:** 24.8% vs Baseline 9.6% (+15.2%)
- **Sharpe:** 6.12
- **Max Drawdown:** 3.8%
- **Win Rate:** 88%

### Métricas Regenerativas (Mes 12)
- **AUT:** 0.91 (91% decisiones locales)
- **CDS:** 0.68
- **ZNU Index:** 0.34 (baja acumulación)
- **Regeneración Neta:** 4.12 (alta)
- **αʰ:** 0.81 (κ=0.5, margen +0.31) ⚠️ SIMULADO
- **ZNU Circulado:** 4.21 (ratio circ/acum >> 1 = alta velocidad)
- **Capacidad Ociosa:** 87%
- **Huella Energética:** +15,840 kWh

---

## Auditoría @alrac-review

| Check | Estado |
|-------|--------|
| E=V Coherence | ❌ HIPOTÉTICO |
| γ-CARMIS | ❌ ACTIVO (αʰ=0.12 real) |
| License/RAO | ❌ MOCK |
| Triaxial | ❌ NO VERIFICADA |
| Principio Anfibio | ❌ NO PROBADO |

**Veredicto: NO DESABLOQUEA**

---

## Conclusiones Escenario Agresivo

| Fortaleza | Debilidad |
|-----------|-----------|
| Máxima regeneración neta (4.12) | ZNU casi no circula como reserva (0.34 index) |
| Alta velocidad ZNU (4.21) | Riesgo liquidez si no hay conversión TQ→ZNU |
| Capacidad ociosa movilizada 87% | Drawdown 3.8% (vs 0% conservador) |
| AUT máximo (0.91) | CDS más bajo (0.68) - menos gobernanza |

**Recomendación:** Adecuado para fase H1 (Afiliados/Asociados tempranos) y arranque de nodos. Requiere puente rápido a H2 (CaaS) para estabilizar ZNU.