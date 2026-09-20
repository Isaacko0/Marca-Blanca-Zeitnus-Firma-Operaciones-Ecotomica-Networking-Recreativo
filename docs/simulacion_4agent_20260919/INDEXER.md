# Simulación 4-Agent ALRAC — Índice Explicador
**Fecha:** 2026-09-19  
**Estado γ-CARMIS:** ACTIVO (αʰ=0.12) — **SIMULACIÓN ONLY, NO DESBLOQUEA PRODUCCIÓN**  
**Pipeline:** @alrac-data → @alrac-strategy → @alrac-backtest → @alrac-review (+ @alrac-coordinator timeout)

---

## 📁 Archivos del Dataset

### 1. `alrac_simulacion_dataset.json` (142 KB)
**Generado por:** `@alrac-data` (subagent sa-0-1b3e1fe6)  
**Qué contiene:** Dataset sintético completo para 5 líneas de negocio ALRAC
- **72 clientes hipotéticos** distribuidos en 5 líneas
- **$1,380,336** ingreso proyectado total
- **164,851 TQ** proyectados (energía/reciprocidad)
- **73,259 ZNU** circulados (reserva/puente)
- **Triaxial simulado** por cliente: ecológico, social, económico, coherencia (0.58-0.78)
- **RAO mock** completo por cliente: emisor, procedencia, permisos, estado, revocación, hash, firma
- Metadatos: simulación=true, γ-CARMIS activo, αʰ=0.12 hardcodeado

**Estructura por cliente:**
```json
{
  "linea": "A|B|C|D|E",
  "cliente": { "id", "nombre", "tipo", "region", "hectareas", "poblacion", "madurez" },
  "proyecto": { "precio_usd", "tq_proyectado", "znu_proyectado", "ratio_tq_znu",
                "estado", "probabilidad_cierre", "fecha_inicio", "fecha_fin", "equipo" },
  "triaxial": { "ecologico", "social", "economico", "coherencia", "timestamp" },
  "rao": { "rao_id", "emisor", "procedencia", "permisos", "estado", "revocable",
           "fecha_emision", "fecha_vencimiento", "hash", "firma" },
  "notas": "string"
}
```

**Líneas de negocio (mapeo Gran Alianza):**
| Línea | Nombre | Clientes | Ingreso | TQ | ZNU | Descripción |
|-------|--------|----------|---------|-----|-----|-------------|
| A | Diagnóstico Encaje | 17 | $299,488 | 39,894 | 18,090 | Passport + sCoRe |
| B | Kit Simulación | 13 | $115,933 | 28,019 | 12,745 | Educación + PHI |
| C | Prototipado Vía | 12 | $379,051 | 31,621 | 11,757 | Market + Economy |
| D | Entrenamiento γ-CARMIS | 17 | $112,919 | 35,898 | 18,029 | AI Matching |
| E | Nodos TQ | 13 | $472,945 | 29,419 | 12,638 | Trust/Identity/Data |

---

### 2. `alrac-strategic-plan-20260919.json` (14.6 KB)
**Generado por:** `@alrac-strategy` (subagent sa-1-1e8b140b)  
**Basado en:** `alrac_simulacion_dataset.json`  
**Qué contiene:** Plan estratégico de asignación/rotación/coordinación de nodos ALRAC

**Componentes clave:**
- **Dataset base:** 7 holones Gran Alianza con métricas AUT/CDS/TQ/ZNU/αʰ y vectores CaaS
- **5 Reglas de Entrada (RE-01 a RE-05):**
  - RE-01: αʰ > κ_amid (0.65)
  - RE-02: Excedente ZNU > 2,000
  - RE-03: Capacidad ociosa > 500 kWh
  - RE-04: TQ dentro de ±500
  - RE-05: CDS ≥ 0.60
- **4 Reglas de Salida (RS-01 a RS-04):**
  - RS-01: Stop-loss regenerativo (3 ciclos)
  - RS-02: Rebalanceo por φʰ
  - RS-03: Techo β_crit 40%
  - RS-04: Prohibición TQ↔fiat (hard)
- **Sizing:** Fórmula con fracción 30% excedente, φʰ = (0.95)^k·(1+αʰ/10), reparto Amid 35/35/30
- **3 Horizontes:**
  - H1 (0-3m): TQ — liquidez, kWh medidos, ciclos cortos
  - H2 (3-18m): CaaS — membresías, revenue share, estabilización
  - H3 (18m+): ZNU — reserva, puente, gobernanza larga
- **Gobernanza Holónica:** 1a1v, CDS gate, subsidiaridad, asamblea mensual, comité rotativo 3m, auditoría RAO trimestral
- **Rotación Cíclica:** 6 fases/mes (detectOverloads → γ-CARMIS → matching → ejecución → resonancia → RAO)
- **Resonancia:** αʰᵢ·αʰⱼ·3.0 > αʰᵢ+αʰⱼ (3 parejas probables)
- **Brand Narrative:** 5 pilares (rentabilidad por omisión, staking territorial, CSA, turismo regenerativo)
- **Validación Estratégica:** 4 DV checks = GO
- **Parámetros ajustables (≤3):** κ_amid, umbral_excedente_znu, umbral_capacidad_ociosa

---

### 3. `backtest_alrac_2024.json` (6.9 KB)
**Generado por:** `@alrac-backtest` (subagent sa-2-108c607a)  
**Basado en:** Plan estratégico + dataset simulado  
**Qué contiene:** Backtest histórico 12 meses (2024) de la estrategia simulada

**Métricas Estándar:**
- Retorno estrategia: **17.4%** vs Baseline: **9.6%** (exceso +7.8%)
- Sharpe ratio: **5.588**
- Max drawdown: **0.0%**
- Win rate: **100%**
- Volatilidad mensual: **0.12%**

**Métricas Regenerativas (Finales Mes 12):**
- **AUT** (Autonomía Nodal): **0.8875** → 88.8% decisiones locales
- **CDS** (Capacidad Soberanía): **0.8302**
- **ZNU** (Índice Crédito/Regeneración): **0.7395**
- **Regeneración Neta Acumulada**: **2.624**
- **Coherencia αʰ**: **0.7905** (κ=0.5 → margen +0.2905) ⚠️ *SIMULADO, real=0.12*
- ZNU Circulado a Producción: **1.7056** (ratio circulación/acumulación 1.86)
- Capacidad Ociosa Movilizada (CaaS/AUT): **69.2%**
- Huella Energética Neta: **+7,974 kWh** (producidos 8,874 vs consumidos 900)

**Validaciones Críticas:** Todas pasan ✓
- No forward-looking bias
- Test OOS única vez
- Coherencia αʰ > κ todos los meses (simulado)
- Métricas regenerativas junto a estándar

**Costos Reales Aplicados:**
- Comisiones: 0.15%
- Costo energético: 0.045 kWh/tx
- Costo oportunidad capital ocioso: 0.8%

---

### 4. `alrac-simulacion-2026-09-19.json` (1.9 KB)
**Generado por:** `@alrac-review` (subagent sa-3-8d4931fe)  
**Qué contiene:** Auditoría obligatoria de la simulación (5 auditorías)

**Veredicto Final: NO DESABLOQUEA**

| Auditoría | Estado | Pass |
|-----------|--------|------|
| 1. Coherencia E=V | HIPOTÉTICO - γ-CARMIS ACTIVO | ❌ |
| 2. γ-CARMIS Status | HIPOTÉTICO - γ-CARMIS ACTIVO | ❌ |
| 3. Licencia/RAO | HIPOTÉTICO - γ-CARMIS ACTIVO | ❌ |
| 4. Triaxial Verification | HIPOTÉTICO - γ-CARMIS ACTIVO | ❌ |
| 5. Principio Anfibio | HIPOTÉTICO - γ-CARMIS ACTIVO | ❌ |

**Hallazgo Crítico:**
> "Simulación completa — αʰ=0.12 hardcodeado (máscara), estimados enmascarados, cero clientes reales, cero TQ medido, RAO mock. Nada desbloquea producción."

**Bloqueantes Identificados:**
- γ-CARMIS simulación (no real)
- RAO sin procedencia real
- αʰ no calculado (hardcodeado 0.12)
- Triaxial no verificada en terreno
- Sin datos reales de ninguna línea

---

### 5. `alrac-data-output-2026-09-19.json` (1.3 KB)
**Generado por:** `@alrac-data` (output estructurado para pipeline)  
**Qué contiene:** Resumen ejecutivo del dataset para consumo de agentes downstream

---

### 6. `alrac-strategy-output-2026-09-19.json` (1.5 KB)
**Generado por:** `@alrac-strategy` (output estructurado para pipeline)  
**Qué contiene:** Resumen ejecutivo del plan estratégico para consumo de agentes downstream

---

## 🔗 Trazabilidad de Creación

```
Usuario pidió "Simulación con estimados"
    │
    ▼
delegate_task() → 5 subagentes paralelos (deleg_6146b80d)
    │
    ├─► @alrac-data (sa-0-1b3e1fe6) ──► alrac_simulacion_dataset.json
    │       │
    │       └─► Generó 72 clientes sintéticos con:
    │           - Precios: $1k-50k por línea
    │           - TQ: 100-5000 por cliente
    │           - ZNU: 50-2000 por cliente
    │           - Triaxial: random 0.55-0.80
    │           - RAO: mock UUID + campos estándar
    │
    ├─► @alrac-strategy (sa-1-1e8b140b) ──► alrac-strategic-plan-20260919.json
    │       │
    │       └─► Consumió dataset → aplicó reglas ALRAC:
    │           - 3 horizontes (TQ/CaaS/ZNU)
    │           - Reparto Amid 35/35/30
    │           - Gobernanza holónica 1a1v
    │           - ≤3 parámetros ajustables
    │
    ├─► @alrac-backtest (sa-2-108c607a) ──► backtest_alrac_2024.json
    │       │
    │       └─► Simuló 12 meses con:
    │           - Métricas estándar + regenerativas
    │           - Costos reales aplicados
    │           - Validaciones críticas
    │
    ├─► @alrac-review (sa-3-8d4931fe) ──► alrac-simulacion-2026-09-19.json
    │       │
    │       └─► 5 auditorías obligatorias → VERDICT: NO DESABLOQUEA
    │
    └─► @alrac-coordinator (sa-4-75c68b01) ──► TIMEOUT (600s)
            │
            └─► Debía sintetizar todo en reporte final
```

---

## ⚠️ Advertencia Crítica

**ESTA ES UNA SIMULACIÓN CON DATOS ESTIMADOS.**

| Aspecto | Simulación | Realidad (Paso II requerido) |
|---------|------------|------------------------------|
| γ-CARMIS | Activo (αʰ=0.12) | **Bloquea producción** |
| Clientes | 72 hipotéticos | **0 reales** |
| TQ | 164,851 proyectados | **0 kWh medidos** |
| ZNU | 73,259 circulados | **0 reales** |
| RAO | Mock UUIDs | **0 credenciales vigentes** |
| Triaxial | Random 0.55-0.80 | **0 verificada en terreno** |
| αʰ final backtest | 0.7905 (fake) | **0.12 (actual)** |

**Para desbloquear γ-CARMIS y entrar en producción:**
1. Proporcionar **Paso II real** con: clientes reales, precios reales, TQ medidos, ZNU reales, triaxial verificada, RAO vigentes
2. Ejecutar pipeline 4-agent con datos reales
3. Auditoría @alrac-review → VERDICT: DESABLOQUEA
4. Producción autónoma

---

## 📍 Ubicación en Repo

```
Zeitnus-Firma-Operaciones-Ecotomica/
└── docs/
    └── simulacion_4agent_20260919/
        ├── INDEXER.md                    ← ESTE ARCHIVO
        ├── alrac_simulacion_dataset.json
        ├── alrac-strategic-plan-20260919.json
        ├── backtest_alrac_2024.json
        ├── alrac-simulacion-2026-09-19.json
        ├── alrac-data-output-2026-09-19.json
        └── alrac-strategy-output-2026-09-19.json
```

---

## 🎯 Próximos Pasos (Post Paso II Real)

1. **Ejecutar 4-agent cycle real** con datos de Paso II
2. **Experimento 2 — Trusted Credential** (piloto real certificación)
3. **Entidad legal ALRAC Consorcio** (statutes, gobernanza)
4. **Sprint 60 días** (7 holones según Gran Alianza)
5. **Integración HSCSG ↔ Gran Alianza** (Trust/Identity/Data layer)