# Simulación Escenario 4: Single-Line Focus (Solo Línea A - Diagnóstico Encaje)

**Fecha:** 2026-09-19  
**Tipo:** Simulación enfocada en una línea  
**Configuración:** Solo Línea A, 50 clientes, TQ/ZNU balanceados  
**Objetivo:** Validar viabilidad de operación mono-línea

---

## Dataset Sintético (50 clientes, Solo Línea A)

| Línea | Clientes | Ingreso Proyectado | TQ Total | ZNU Total | Ratio TQ/ZNU |
|-------|----------|-------------------|----------|-----------|--------------|
| A | 50 | $880,000 | 118,000 | 53,000 | 2.23 |
| **TOTAL** | **50** | **$880,000** | **118,000** | **53,000** | **2.23** |

---

## Estrategia (Enfocada Línea A)

- **Entry κ_amid:** 0.60
- **Horizonte:** H1 40%, H2 50%, H3 10%
- **Especialización:** Passport + sCoRe únicamente

---

## Backtest 12 Meses

### Métricas Estándar
- **Retorno:** 15.2% vs Baseline 9.6% (+5.6%)
- **Sharpe:** 5.01
- **Max Drawdown:** 2.1%
- **Win Rate:** 92%

### Métricas Regenerativas
- **AUT:** 0.78
- **CDS:** 0.71
- **ZNU Index:** 0.56
- **Regeneración Neta:** 2.18
- **αʰ:** 0.75 ⚠️ SIMULADO
- **ZNU Circulado:** 1.89
- **Capacidad Ociosa:** 62%

---

## Auditoría: NO DESABLOQUEA (γ-CARMIS activo)

---

## Conclusión: Línea A sola genera flujo pero no ecosistema completo. Requiere B-E para resiliencia.