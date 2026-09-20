# Comparative Analysis - 5 Escenarios de Simulación ALRAC

**Fecha:** 2026-09-19  
**Base:** Simulación original (Balanceado) + 4 escenarios nuevos  
**γ-CARMIS:** ACTIVO en todos (αʰ=0.12 real) — **NINGUNO DESBLOQUEA**

---

## Tabla Comparativa Consolidada

| Métrica | **Original (Balanceado)** | **Escenario 2: Conservador** | **Escenario 3: Agresivo** | **Escenario 4: Solo Línea A** | **Escenario 5: Multi-Nodo** |
|---------|---------------------------|------------------------------|---------------------------|-------------------------------|----------------------------|
| **Configuración TQ/ZNU** | Balanceado (2.2) | Bajo TQ / Alto ZNU (0.23) | Alto TQ / Bajo ZNU (45) | Solo Línea A (2.23) | Federado 3 nodos (balanceado) |
| **Retorno 12m** | 17.4% | 12.3% | 24.8% | 15.2% | 19.4% |
| **Sharpe** | 5.59 | 4.21 | 6.12 | 5.01 | 5.67 |
| **Max Drawdown** | 0.0% | 1.2% | 3.8% | 2.1% | 1.8% |
| **Win Rate** | 100% | 94% | 88% | 92% | 95% |
| **AUT (Autonomía)** | 0.89 | 0.82 | 0.91 | 0.78 | **0.88** |
| **CDS (Soberanía)** | 0.83 | 0.79 | 0.68 | 0.71 | **0.85** |
| **ZNU Index** | 0.74 | **0.89** | 0.34 | 0.56 | 0.78 |
| **Regeneración Neta** | 2.62 | 1.84 | **4.12** | 2.18 | 3.45 |
| **αʰ (simulado)** | 0.79 | 0.72 | 0.81 | 0.75 | 0.77 |
| **ZNU Velocity** | 1.86 | 0.94 | **4.21** | 1.89 | 2.34 |
| **Cap. Ociosa Movilizada** | 69% | 45% | **87%** | 62% | 73% |
| **Huella Energética (kWh)** | +7,974 | +4,210 | **+15,840** | +5,800 | +11,200 |

---

## Análisis por Dimensión

### 🏆 **Mejor Retorno Ajustado a Riesgo (Sharpe)**
1. **Escenario 3 Agresivo** (6.12) - pero drawdown 3.8%
2. **Escenario 5 Multi-Nodo** (5.67) - drawdown 1.8% ✅ **RECOMENDADO**
3. Original Balanceado (5.59) - drawdown 0%

### 🏆 **Mejor Autonomía (AUT)**
1. **Escenario 3 Agresivo** (0.91)
2. **Escenario 5 Multi-Nodo** (0.88)
3. Original Balanceado (0.89)

### 🏆 **Mejor Soberanía (CDS)**
1. **Escenario 5 Multi-Nodo** (0.85) - gobernanza cross-node
2. Original Balanceado (0.83)
3. Escenario 2 Conservador (0.79)

### 🏆 **Mejor Acumulación Patrimonio (ZNU Index)**
1. **Escenario 2 Conservador** (0.89) - acumulación ZNU
2. Escenario 5 Multi-Nodo (0.78)
3. Original Balanceado (0.74)

### 🏆 **Mejor Regeneración Neta (kWh/TQ)**
1. **Escenario 3 Agresivo** (4.12) - máxima regeneración física
2. **Escenario 5 Multi-Nodo** (3.45)
3. Original Balanceado (2.62)

### 🏆 **Mejor Velocidad Monetaria (ZNU Circulation)**
1. **Escenario 3 Agresivo** (4.21) - pero ZNU index bajo
2. **Escenario 5 Multi-Nodo** (2.34) - equilibrio
3. Original Balanceado (1.86)

### 🏆 **Mejor Movilización Capacidad Ociosa**
1. **Escenario 3 Agresivo** (87%)
2. **Escenario 5 Multi-Nodo** (73%)
3. Original Balanceado (69%)

---

## Recomendaciones por Perfil de Miembro

| Perfil Miembro | Escenario Recomendado | Razón |
|----------------|----------------------|-------|
| **Afiliados (H1 - Inicio)** | Escenario 3 Agresivo | Máxima liquidez TQ, regeneración inmediata, aprendizaje rápido |
| **Asociados (H2 - Estabilidad)** | **Escenario 5 Multi-Nodo** | Equilibrio AUT/CDS/ZNU, federación real, resiliencia |
| **Núcleo (H3 - Patrimonio)** | Escenario 2 Conservador | Acumulación ZNU, estabilidad, gobernanza madura |
| **Proyecto Mono-línea** | Escenario 4 Solo Línea A | Solo si diagnóstico es core business |
| **Red Completa** | **Escenario 5 Multi-Nodo** | Sinergias, cross-node pools, resiliencia distribuida |

---

## Hallazgos Críticos Transversales

### ✅ **Lo que FUNCIONA en simulación:**
1. **Pipeline 4-agent validado end-to-end** (data → strategy → backtest → review)
2. **Arquitectura 5 capas** soporta todos los escenarios
3. **Reparto Amid 35/35/30** consistente
4. **Principio Anfibio** no rompe lógica en ningún escenario
5. **Cross-node pools** (Escenario 5) generan valor emergente

### ❌ **Lo que NO FUNCIONA (γ-CARMIS bloquea):**
1. **αʰ simulado (0.72-0.81) ≠ αʰ real (0.12)** — brecha 6-7x
2. **Cero clientes reales** — todo sintético
3. **Cero TQ medido** — kWh no verificados triaxialmente
4. **RAO mock** — sin procedencia real
5. **Triaxial no ejecutada** — mental/sim/lab no corridos

---

## Conclusión Estratégica

**La simulación demuestra que la ARQUITECTURA FUNCIONA.**  
Los 5 escenarios producen métricas coherentes, el pipeline 4-agent opera, y los specs son consistentes.

**PERO γ-CARMIS NO SE DESACTIVA sin Paso II REAL.**

| Próximo Paso Real | Qué Desbloquea |
|-------------------|----------------|
| 1 cliente real + $1 real | γ-CARMIS → Paso III (Diseño Experimental) |
| 1 TQ medido (kWh) + triaxial | Validación Capa 1 TQ |
| 1 ZNU real circulando | Validación Capa 3 ZNU |
| 1 RAO vigente | Validación Identidad/Trust |
| Entidad legal constituida | Producción completa |

**La simulación es espejo; la realidad es el terreno.**