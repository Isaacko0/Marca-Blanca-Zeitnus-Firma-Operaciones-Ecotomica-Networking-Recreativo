# Simulación Escenario 2: Conservador (Low TQ, High ZNU)

**Fecha:** 2026-09-19  
**Tipo:** Simulación @alrac-data → @alrac-strategy → @alrac-backtest → @alrac-review  
**Configuración:** Bajo TQ (50-200/cliente), Alto ZNU (500-2000/cliente)  
**Objetivo:** Validar estabilidad y acumulación de patrimonio (H3)

---

## Dataset Sintético (72 clientes, 5 líneas)

| Línea | Clientes | Ingreso Proyectado | TQ Total | ZNU Total | Ratio TQ/ZNU |
|-------|----------|-------------------|----------|-----------|--------------|
| A | 17 | $299,488 | 8,942 | 36,180 | 0.25 |
| B | 13 | $115,933 | 5,604 | 25,490 | 0.22 |
| C | 12 | $379,051 | 6,324 | 23,514 | 0.27 |
| D | 17 | $112,919 | 7,180 | 36,058 | 0.20 |
| E | 13 | $472,945 | 5,884 | 25,276 | 0.23 |
| **TOTAL** | **72** | **$1,380,336** | **33,934** | **146,518** | **0.23** |

---

## Estrategia Aplicada (Conservadora)

- **Sizing:** 20% excedente (vs 30% base)
- **Entry κ_amid:** 0.75 (vs 0.65 base) - más estricto
- **Exit β_crit:** 30% (vs 40% base) - stop-loss más temprano
- **Horizonte preferido:** H3 (ZNU/patrimonio) 60%, H2 30%, H1 10%

---

## Backtest 12 Meses (Resultados Simulados)

### Métricas Estándar
- **Retorno:** 12.3% vs Baseline 9.6% (+2.7%)
- **Sharpe:** 4.21
- **Max Drawdown:** 1.2%
- **Win Rate:** 94%

### Métricas Regenerativas (Mes 12)
- **AUT:** 0.82 (82% decisiones locales)
- **CDS:** 0.79
- **ZNU Index:** 0.89 (alta acumulación)
- **Regeneración Neta:** 1.84
- **αʰ:** 0.72 (κ=0.5, margen +0.22) ⚠️ SIMULADO
- **ZNU Circulado:** 0.94 (ratio circ/acum < 1 = acumulación)
- **Capacidad Ociosa:** 45%
- **Huella Energética:** +4,210 kWh

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

## Conclusiones Escenario Conservador

| Fortaleza | Debilidad |
|-----------|-----------|
| Alta acumulación ZNU (patrimonio) | Baja velocidad ZNU (acumulación > circulación) |
| Estabilidad financiera (drawdown 1.2%) | Regeneración neta menor (1.84 vs 2.62) |
| CDS alto (0.79) | αʰ simulado no refleja realidad |
| Buen para fase H3 (Núcleo) | No valida H1/H2 (liquidez/estabilidad) |

**Recomendación:** Adecuado para miembros Núcleo consolidados. Requiere trigger de circulación (expiración Postulado 4) para activar velocidad.