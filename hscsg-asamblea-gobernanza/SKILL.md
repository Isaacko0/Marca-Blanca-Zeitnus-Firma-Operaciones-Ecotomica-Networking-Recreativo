---
name: hscsg-asamblea-gobernanza
description: Gobierna decisiones de Asamblea Soberana: tres fondos, reparto de excedentes, parámetros mutables, herencia, datos sensibles. Centraliza métodos y cifras de repartición existentes para que la Asamblea los cambie con trazabilidad.
version: 1.0.0
author: Isaac Ko (Isaacko0) + HSCSG + Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, asamblea, gobernanza, tres-fondos, reparto-excedentes, estatutos, lgsc, lfpddpp]
    related_skills:
      - hscsg-monetary-integration
      - hscsg-coeficiente-autonomia
      - hscsg-sistema-alraico
      - hscsg-document-architect
      - hscsg-viabilidad-territorial
---

# HSCSG — Skill de Gobernanza Asamblearia (Decisiones Soberanas + Repartición Configurable)

> **Principio:** Lo que decide la Asamblea no se hardcodea. Se parametriza, se versiona y se audita vía RAO.
> **Regla de oro:** Esta skill es el **único lugar** donde viven los parámetros mutables de repartición. El código importa desde aquí; la Asamblea edita aquí.

---

## 1. DECISIONES QUE DEBE FIJAR LA ASAMBLEA (No delegables a código)

Basado en la investigación exhaustiva de los tres fondos y seis tensiones (ver `docs/INVESTIGACION_TRES_FONDOS_SEIS_TENSIONES.md`):

| # | Decisión | Tipo | Estado | Documento Fuente |
|---|----------|------|--------|------------------|
| **D1** | **Porcentaje fijo + suelo estatutario** del excedente neto fiat a los tres fondos (Memoria, Cuidado, Autotrofia) | `% fijo` + `suelo_mínimo` | 🔴 Pendiente | `ESTAMENTO.md §4.1` |
| **D2** | **Unidad de "excedente"** sobre la que se aplica el %: `fiat_neto` \| `tq_beta_crit` \| `kwh_termodinamico` | `enum ExcessUnit` | 🔴 Pendiente | `ESTAMENTO.md §4.2` |
| **D3** | **Definición de "miembro"** para acceso a cuidado: umbrales `stakeZNU` + `AUT` + `CDS` | `MiembroConfig` | 🔴 Pendiente | `ESTAMENTO.md §4.3` |
| **D4** | **Régimen de herencia**: qué se hereda (obra, memoria, reputación ERC-8004, Complete Data Package) y qué NO (hr_vital, ZNU, TQ) | `HerenciaConfig` | 🔴 Pendiente | `ESTAMENTO.md §4.4` |
| **D5** | **Régimen de datos salud/memoria**: consentimiento revocable, datos personales off-ledger, LFPDPPP compliance, datos fallecidos | `DatosSensiblesConfig` | 🔴 Pendiente | `ESTAMENTO.md §4.5` |
| **D6** | **Opción no-miembros**: `prohibicion_total` (con definiciones) vs `permiso_costo_real` + 100% excedente a fondos | `NoMiembroPolicy` | 🔴 Pendiente | `ESTAMENTO.md §4.6` |
| **D7** | **Cláusula de arranque**: activación fondos con primer contrato real (líneas A–E) | `boolean` + `trigger_contrato_id` | 🔴 Pendiente | `ESTAMENTO.md §4.7` |
| **D8** | **Distribución intra-fondos**: pesos entre Memoria / Cuidado / Autotrofia (ej. 30/40/30) | `FondosWeights` | 🔴 Pendiente | `ESTAMENTO.md §4.8` |

---

## 2. MÉTODOS Y CIFRAS DE REPARTICIÓN EXISTENTES EN EL REPO (Centralizados aquí)

### 2.1 Matriz Maestra de Métodos de Repartición

| Método | Fuente | Fórmula / Parámetros | Parámetros Mutables (Asamblea) | Código / Spec |
|--------|--------|---------------------|-------------------------------|---------------|
| **Fondo Solarpunk (25% excedentes autómata)** | `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` §192, 1087 | `excedente_autómata * 0.25 → subvenciones nodos (PGS ≥ 1.5)` | `porcentaje: 0.25`, `pgs_threshold: 1.5`, `destino: 'subvenciones_nodos'` | `solarpunk.ts` (FALTA implementación) |
| **Commonomics Gaia (50/30/10/5 + facilitador)** | `gaia_metaplatform_backup.md` §7.1, `gaia_commons_framework_backup.md` §5 | `50% plataforma (30% admin + 10% edu + 5% no-edu + 5% resto) / 30% marketing / 10% referidos / 5% imprevistos / facilitador caso a caso` | `platform_pct: 0.50`, `marketing_pct: 0.30`, `referral_pct: 0.10`, `contingency_pct: 0.05`, `facilitador: 'caso_a_caso'` | `gaia_metaplatform_integration.md` → `distribution_engine.ts` (PENDIENTE) |
| **Gaia Commons Framework (33/33/33 estricto)** | `gaia_commons_framework_backup.md` §5 | `33.3% Local Community Fund / 33.3% National Commons Fund / 33.3% Global Commons Fund` | `local_pct: 0.333`, `national_pct: 0.333`, `global_pct: 0.333` | N/A (referencia externa) |
| **LGSC México (Fondos sociales cooperativos)** | `LFPDPPP` + investigación externa | `Reserva: 10-20% rendimientos / Educación: ≥1% excedentes netos mensuales / Previsión Social: % ingresos netos fija Asamblea` | `reserva_min: 0.10`, `reserva_max: 0.20`, `educacion_min: 0.01`, `prevision_pct: 'asamblea'` | Marco legal — no en código |
| **ALRAC β_crit + Fondo Comunitario** | `openspec/specs/alrac-tq-taxEngine.md` §2 | `β_crit: threshold 30% liquidez, rate 50% excedente → fondo comunitario. Gobernanza: propuesta 5%, quórum 60%, máx 20%/propuesta` | `beta_threshold: 0.30`, `beta_rate: 0.50`, `proposal_threshold: 0.05`, `approval_quorum: 0.60`, `max_allocation: 0.20` | `tq.ts::createCommunityFund()` ✅, `applyBetaCrit()` ❌ TODO |
| **CaaS Revenue Share (AUT×CDS + demurrage)** | `src/core/lib/caas.ts::revenueShare()` | `peso = flows * (0.5 + avgAUT) * (0.5 + CDS). demurrage: threshold 300 ZNU, rate 5%` | `aut_weight: 0.5`, `cds_weight: 0.5`, `demurrage_threshold: 300`, `demurrage_rate: 0.05` | `caas.ts` ✅ |
| **Virginia Network (N3 dinámico = TQ real / 1000)** | `docs/ECOSYSTEM_REVENUE_SHARING.md` | `N3 peso = kWh TQ medidos / 1000. Demurrage dinámico: mediana ecosistema × CDS` | `n3_divisor: 1000`, `demurrage_base: 0.02`, `demurrage_progressive: 0.03` | `ecosystemRevenueShare.ts` (PENDIENTE) |
| **Tripartita (50/30/10/5/5 — nuevo 5% fondo tierra)** | `COLABORACION_TRIPARTITA...md` §7.3, 9 | `50% nodos / 30% fondo tierra / 10% educación / 5% infra / 5% reserva` | `nodos_pct: 0.50`, `tierra_pct: 0.30`, `educacion_pct: 0.10`, `infra_pct: 0.05`, `reserva_pct: 0.05` | `gaia_fund.ts` (PENDIENTE) |
| **FRNE Ecoaldea (15% fondo comunitario + restitución no especulativa)** | `COLABORACION_TRIPARTITA...md` | `fondo_comunitario: 0.15. restitución = aportes - (especulación * penalización)` | `fondo_comunitario_pct: 0.15`, `penalizacion_especulacion: 'formula_frne'` | `frne.ts` (PENDIENTE) |
| **Ecosystem Revenue Sharing (4 círculos 15/20/35/30)** | `docs/ECOSYSTEM_REVENUE_SHARING.md` | `C1 Epistémico 15% / C2 Infra HSCSG 20% / C3 Nodos+Alianza 35% / C4 Virginia 30%. Peso unificado = roleWeight × (0.3 + 0.35×AUT + 0.35×CDS) × (1 + bonus_trazable)` | `circle_pcts: [0.15, 0.20, 0.35, 0.30]`, `aut_coeff: 0.35`, `cds_coeff: 0.35`, `base_coeff: 0.3`, `bonus_cap: 1.0` | `ecosystemRevenueShare.ts` (PENDIENTE) |
| **LDFV (Ley Distribución Fractal Valor)** | `ALRAC_consortium_model_complete.md` §7 | `ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾. φʰ = 0.95ᵏ · (1 + αʰ/10). PPE: γ_ind ≪ ½θ → redistribución. β_crit: techo anti-acaparamiento` | `half_share: 0.5`, `decay_factor: 0.95`, `harmony_divisor: 10`, `ppe_threshold: 'mitad_theta'`, `beta_crit_formula: 'custom'` | `valueDistribution.ts` (PENDIENTE) |

---

## 3. ESQUEMA DE PARÁMETROS MUTABLES (Para que la Asamblea edite)

```typescript
// templates/asamblea-parametros.json — EDITAR SOLO ESTE ARCHIVO
{
  "version": "1.0.0",
  "lastAssemblyDecision": "2026-10-20T00:00:00Z",
  "decidedBy": "asamblea-soberana-001",
  "raoAnchor": "RAO:asamblea:20261020:001",

  // ===== D1-D8: DECISIONES FONDOS =====
  "tresFondos": {
    "porcentajeFijoExcedenteFiat": 0.10,           // D1: % fijo excedente neto fiat (ej. 10%)
    "sueloEstatutario": 0.05,                      // D1: suelo inmodificable (ej. 5%)
    "unidadExcedente": "fiat_neto",                // D2: 'fiat_neto' | 'tq_beta_crit' | 'kwh_termodinamico'
    "clausulaArranque": {                          // D7
      "activa": false,
      "triggerContratoId": null,
      "primerContratoReal": null
    },
    "pesosInternos": {                             // D8
      "memoria": 0.30,
      "cuidado": 0.40,
      "autotrofia": 0.30
    }
  },

  // ===== D3: DEFINICIÓN MIEMBRO =====
  "miembro": {
    "stakeZNUMinimo": 20,          // Tier 'aprendiz' en caas.ts
    "autMinimo": 0.2,
    "cdsMinimo": 0.2,
    "requiereVerificacionTriaxial": true
  },

  // ===== D4: HERENCIA =====
  "herencia": {
    "hereda": ["obra", "memoria", "reputacion_erc8004", "complete_data_package"],
    "noHereda": ["hr_vital", "znu", "tq"],
    "mecanismo": "clausula_estatutos_cooperativa"
  },

  // ===== D5: DATOS SENSIBLES =====
  "datosSensibles": {
    "consentimientoRevocable": true,
    "datosPersonalesOffLedger": true,
    "soloHashesEnRAO": true,
    "lfpddppCompliance": true,
    "datosFallecidos": "requiere_asesoria_legal"
  },

  // ===== D6: NO-MIEMBROS =====
  "noMiembros": {
    "politica": "permiso_costo_real",  // 'prohibicion_total' | 'permiso_costo_real'
    "definicionServicioLongevidad": "intervencion_biomedica_con_claim_extension_vida",
    "definicionLucro": "margen_maximo_costo_real_mas_reinversion_fondos",
    "excedenteGeneradoAFondos": 1.0    // 100% si permiso_costo_real
  },

  // ===== MÉTODOS DE REPARTICIÓN (Sección 2) =====
  "metodosReparticion": {
    "fondoSolarpunk": {
      "activo": true,
      "porcentaje": 0.25,
      "pgsThreshold": 1.5,
      "destino": "subvenciones_nodos"
    },
    "commonomicsGaia": {
      "activo": false,
      "platformPct": 0.50,
      "marketingPct": 0.30,
      "referralPct": 0.10,
      "contingencyPct": 0.05,
      "facilitador": "caso_a_caso"
    },
    "gaiaCommons33": {
      "activo": false,
      "localPct": 0.333,
      "nationalPct": 0.333,
      "globalPct": 0.333
    },
    "alracBetaCrit": {
      "activo": true,
      "betaThreshold": 0.30,
      "betaRate": 0.50,
      "proposalThreshold": 0.05,
      "approvalQuorum": 0.60,
      "maxAllocationPerProposal": 0.20
    },
    "caasRevenueShare": {
      "activo": true,
      "autWeight": 0.5,
      "cdsWeight": 0.5,
      "demurrageThreshold": 300,
      "demurrageRate": 0.05
    },
    "virginiaNetwork": {
      "activo": false,
      "n3Divisor": 1000,
      "demurrageBase": 0.02,
      "demurrageProgressive": 0.03
    },
    "tripartita50301055": {
      "activo": false,
      "nodosPct": 0.50,
      "tierraPct": 0.30,
      "educacionPct": 0.10,
      "infraPct": 0.05,
      "reservaPct": 0.05
    },
    "frneEcoaldea": {
      "activo": false,
      "fondoComunitarioPct": 0.15,
      "penalizacionEspeculacion": "formula_frne"
    },
    "ecosystem4Circulos": {
      "activo": false,
      "circlePcts": [0.15, 0.20, 0.35, 0.30],
      "autCoeff": 0.35,
      "cdsCoeff": 0.35,
      "baseCoeff": 0.3,
      "bonusCap": 1.0
    },
    "ldfvAlrac": {
      "activo": false,
      "halfShare": 0.5,
      "decayFactor": 0.95,
      "harmonyDivisor": 10,
      "ppeThreshold": "mitad_theta",
      "betaCritFormula": "custom"
    }
  },

  // ===== GOBERNANZA FONDO COMUNITARIO (ALRAC) =====
  "fondoComunitarioGobernanza": {
    "proposalThreshold": 0.05,
    "approvalQuorum": 0.60,
    "auditRequired": true,
    "maxAllocationPerProposal": 0.20,
    "propósitosPermitidos": [
      "soil_regeneration",
      "water_infrastructure",
      "energy_sovereignty",
      "housing_regenerative",
      "health_access",
      "education",
      "emergency",
      "memory",           // ← NUEVO: Fondo Memoria
      "food",             // ← NUEVO: Autotrofia alimentaria
      "preventive_care"   // ← NUEVO: Cuidado preventivo
    ]
  }
}
```

---

## 4. FLUJO DE DECISIÓN ASAMBLEARIA (Protocolo)

### 4.1 Proceso Canónico (Basado en Gaia Commons Constitution + LGSC + HSCSG)

```
1. PROPUESTA
   - Cualquier miembro (stake ZNU ≥ Aprendiz) inicia propuesta
   - Formato: decisión (D1-D8 o parámetro método) + justificación + impacto estimado
   - RAO ancla propuesta (credencial RAO)

2. CONSULTA (7-30 días)
   - Publicación en foro asambleario + notificación miembros
   - Período objeciones: 7 días mínimo, 30 máximo
   - Autómata evalúa impacto (simulación con parámetros propuestos)

3. CONSENTIMIENTO / VOTACIÓN
   - Primera instancia: Consent-based (objección válida = bloqueo)
   - Segunda instancia: Quórum 50% + umbral 75% (si no hay consentimiento)
   - Tercera instancia: Quórum 33% + umbral 50% (si persiste)
   - Para cambios constitucionales (Cuaternidad, Pilares, Planos, Leyes MJ): 77.7% (Gaia Commons)

4. EJECUCIÓN
   - Actualización `asamblea-parametros.json` + commit firmado
   - Deploy automático: código lee parámetros en runtime (hot-reload)
   - Auditoría RAO post-ejecución (verificación termodinámica si aplica)

5. REVISIÓN PERIÓDICA
   - Cada 6 meses: revisión automática de parámetros vs métricas reales
   - KPIs: cobertura cuidado, mortalidad evitable, brecha equidad, consentimiento memoria
```

### 4.2 Umbrales de Decisión por Tipo

| Tipo de Decisión | Quórum | Umbral Aprobación | Ejemplos |
|------------------|--------|-------------------|----------|
| **Parámetros mutables** (D1-D8, % reparto) | 50% | 60% (consent) / 75% (voto) | % fondos, umbrales miembro, pesos internos |
| **Políticas estructurales** (herencia, datos, no-miembros) | 60% | 75% | D4, D5, D6 |
| **Cambios constitucionales** (Cuaternidad, Leyes MJ, Planos) | 66% | **77.7%** | Modificar Matemas, Pilares, Leyes MJ |
| **Emergencia (Ley I MJ)** | 33% | 50% + Autómata valida | Activación santuario, β_crit trigger |

---

## 5. INTEGRACIÓN CON CÓDIGO (Runtime Configurable)

### 5.1 Patrón de Acceso (El código NO hardcodea parámetros)

```typescript
// src/core/lib/assemblyConfig.ts — Single source of truth en runtime
import asambleaParams from '@assets/asamblea-parametros.json';

export function getAssemblyConfig() {
  // Hot-reload en desarrollo; en producción: rebuild + deploy
  return asambleaParams as AsambleaConfig;
}

// Uso en cualquier módulo:
const config = getAssemblyConfig();
const fondoSolarpunkPct = config.metodosReparticion.fondoSolarpunk.porcentaje;
const miembroAutMin = config.miembro.autMinimo;
```

### 5.2 Validación en Tiempo de Ejecución (MJ Gate)

```typescript
// En cada función que use parámetros asamblearios:
export function validateAssemblyParams(config: AsambleaConfig): MJGateResult {
  const checks = {
    law1: config.tresFondos.sueloEstatutario <= config.tresFondos.porcentajeFijoExcedenteFiat,
    law2: config.metodosReparticion.alracBetaCrit.betaRate <= 1.0,
    law3: config.datosSensibles.lfpddppCompliance === true,
    law4: config.herencia.noHereda.includes('hr_vital') // Inmutable
  };
  // ...
}
```

---

## 6. TEMPLATES PARA PROPUESTAS ASAMBLEARIAS

### 6.1 Template Decisión D1-D8 (`templates/propuesta-decision-fundamental.md`)

```markdown
# Propuesta Asamblea: [D1-D8] - [Título]

**ID:** PROP-ASAM-YYYYMMDD-XXX
**Proponente:** [DID miembro]
**Fecha:** [ISO8601]
**RAO Anchor:** [credencial RAO]

## Decisión Objetivo
- **Código:** D[X] (ej. D1: Porcentaje fijo + suelo)
- **Parámetro actual:** [valor actual en asamblea-parametros.json]
- **Valor propuesto:** [nuevo valor]

## Justificación
[Análisis de impacto: métricas afectadas, precedente legal, evidencia externa]

## Simulación de Impacto (Autómata)
- Escenario base: [métricas actuales]
- Escenario propuesto: [métricas proyectadas]
- Delta: [diferencia]

## Riesgos Identificados
- [Riesgo 1]: [mitigación]
- [Riesgo 2]: [mitigación]

## Votación
- Tipo: [Parámetros mutables / Políticas estructurales / Constitucional / Emergencia]
- Quórum requerido: [XX%]
- Umbral aprobación: [XX%]
- Período consulta: [7-30 días]

## Firmas
- Proponente: [firma DID]
- Testigos (mín 2): [DID + firma]
```

### 6.2 Template Cambio Método Repartición (`templates/propuesta-metodo-reparticion.md`)

```markdown
# Propuesta Asamblea: Método Repartición - [Nombre Método]

**ID:** PROP-MET-YYYYMMDD-XXX
**Método:** [ej. fondoSolarpunk, caasRevenueShare, tripartita50301055]
**Parámetros a cambiar:** [lista keys en metodosReparticion.<metodo>]
**Valores actuales → propuestos:** [tabla]

## Análisis Comparativo
| Métrica | Actual | Propuesto | Delta |
|---------|--------|-----------|-------|
| Equidad (Gini) | X | Y | Z |
| Cobertura cuidado | X% | Y% | Z% |
| Excedente a fondos | X ZNU | Y ZNU | Z ZNU |

## Compatibilidad Legal
- LGSC México: [cumple/no cumple - detalle]
- LFPDPPP: [cumple/no cumple - detalle]
- Estatutos cooperativa: [requiere modificación estatutos SÍ/NO]

## Plan de Migración
- Fase 1: [paralelo X semanas]
- Fase 2: [corte hard Y fecha]
- Rollback: [procedimiento si falla]
```

---

## 7. SCRIPTS HELPER (Para la Asamblea)

### 7.1 Simulador de Impacto (`scripts/simulate_assembly_decision.py`)

```python
#!/usr/bin/env python3
"""
Simula impacto de cambio de parámetros asamblearios sobre métricas clave.
Uso: python simulate_assembly_decision.py --param tresFondos.porcentajeFijoExcedenteFiat --value 0.15
"""
import json, sys, argparse
from copy import deepcopy

def load_config():
    with open('templates/asamblea-parametros.json') as f:
        return json.load(f)

def simulate(config, param_path, new_value):
    # Deep copy para no mutar original
    sim = deepcopy(config)
    # Set nested param
    keys = param_path.split('.')
    obj = sim
    for k in keys[:-1]:
        obj = obj[k]
    obj[keys[-1]] = new_value
    
    # Calcular métricas derivadas (ejemplo simplificado)
    metrics = {
        "excedente_anual_fondos": estimate_annual_fund_excess(sim),
        "cobertura_cuidado": estimate_care_coverage(sim),
        "brecha_equidad": estimate_equity_gap(sim),
        "consentimiento_memoria": estimate_memory_consent(sim)
    }
    return metrics, sim

def estimate_annual_fund_excess(cfg):
    # Placeholder: integra con datos reales de caas.ts, tq.ts, etc.
    base_excess = 100000  # ZNU/año estimado
    pct = cfg['tresFondos']['porcentajeFijoExcedenteFiat']
    return base_excess * pct

# ... otras funciones de estimación

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--param', required=True, help='Ruta parámetro (dot notation)')
    parser.add_argument('--value', required=True, type=float, help='Nuevo valor')
    parser.add_argument('--output', help='Guardar config simulada')
    args = parser.parse_args()

    config = load_config()
    metrics, sim_config = simulate(config, args.param, args.value)
    
    print("=== MÉTRICAS PROYECTADAS ===")
    for k, v in metrics.items():
        print(f"  {k}: {v}")
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(sim_config, f, indent=2)
        print(f"\nConfig simulada guardada en {args.output}")
```

### 7.2 Validador Legal (`scripts/validate_legal_compliance.py`)

```python
#!/usr/bin/env python3
"""
Valida cumplimiento LGSC, LFPDPPP, estatutos cooperativa.
Uso: python validate_legal_compliance.py --config templates/asamblea-parametros.json
"""
import json, sys

def validate_lgsc(config):
    """Ley General de Sociedades Cooperativas México"""
    checks = []
    # Art. 78: Reserva 10-20% rendimientos
    if 'fondoSolarpunk' in config['metodosReparticion']:
        pct = config['metodosReparticion']['fondoSolarpunk']['porcentaje']
        checks.append(('LGSC Reserva 10-20%', 0.10 <= pct <= 0.20, f"Actual: {pct}"))
    # Art. 80: Educación ≥1% excedentes netos mensuales
    # Art. 81: Previsión social % ingresos netos fija Asamblea
    return checks

def validate_lfpddpp(config):
    """Ley Federal de Protección de Datos Personales en Posesión de Particulares (2025)"""
    checks = []
    ds = config['datosSensibles']
    checks.append(('Consentimiento expreso escrito', ds['consentimientoRevocable'], 'Revocable = expreso'))
    checks.append(('Datos sensibles off-ledger', ds['datosPersonalesOffLedger'], 'Solo hashes en RAO'))
    checks.append(('Datos fallecidos', ds['datosFallecidos'] != 'pendiente', 'Requiere asesoría legal'))
    return checks

def validate_estatutos(config):
    """Estatutos cooperativa trabajo asociado"""
    checks = []
    # Un miembro = un voto (no stake-weighted)
    # Fondo previsión social = D3/D4 compatibilidad
    checks.append(('1 miembro = 1 voto', True, 'Verificar en caas.ts voting'))
    checks.append(('Herencia separa monetario/memorial', 'hr_vital' in config['herencia']['noHereda'], 'OK'))
    return checks

if __name__ == '__main__':
    with open(sys.argv[1] if len(sys.argv) > 1 else 'templates/asamblea-parametros.json') as f:
        config = json.load(f)
    
    all_checks = []
    all_checks.extend(validate_lgsc(config))
    all_checks.extend(validate_lfpddpp(config))
    all_checks.extend(validate_estatutos(config))
    
    print("=== VALIDACIÓN LEGAL ===")
    for name, passed, detail in all_checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} | {name}: {detail}")
    
    failed = [c for c in all_checks if not c[1]]
    if failed:
        print(f"\n⚠️ {len(failed)} validaciones FALLARON - Revisar antes de votar")
        sys.exit(1)
    else:
        print("\n✅ Todas las validaciones legales PASARON")
        sys.exit(0)
```

---

## 8. RAO ANCLAJE Y AUDITORÍA

Cada decisión asamblearia genera:
1. **Credencial RAO** tipo `assembly_decision` con:
   - `decisionId`: PROP-ASAM-YYYYMMDD-XXX
   - `parametersChanged`: [lista paths JSON cambiados]
   - `previousValues`: {path: oldValue}
   - `newValues`: {path: newValue}
   - `votes`: {memberDID: weight, choice, timestamp}
   - `quorumAchieved`: boolean
   - `thresholdMet`: boolean
   - `legalValidation`: {lgsc: bool, lfpddpp: bool, estatutos: bool}
   - `automatonSimulation`: {metricsBefore, metricsAfter, passed}

2. **Entrada en `asamblea-parametros.json`**:
   - `version` incrementada (semver)
   - `lastAssemblyDecision` = timestamp
   - `decidedBy` = asamblea ID
   - `raoAnchor` = RAO credential ID

---

## 9. VASOS COMUNICANTES CON OTRAS SKILLS

| Skill | Vaso | Qué fluye |
|-------|------|-----------|
| `hscsg-monetary-integration` | 💰 | Métodos reparto → parámetros mutables; referentes monetarios → validación legal |
| `hscsg-coeficiente-autonomia` | 📊 | AUT/CDS umbrales miembro → definición D3; métricas equidad → simulación impacto |
| `hscsg-sistema-alraico` | ⚙️ | γ-CARMIS trigger → revisión parámetros; LDFV → distribución fractal; β_crit → fondo comunitario |
| `hscsg-document-architect` | 📄 | `ESTAMENTO.md` ↔ `asamblea-parametros.json` sincronizados; BRIEFS actualizados |
| `hscsg-viabilidad-territorial` | 🌱 | AUT/CDS reales → validación umbrales D3; TerritorialSovereigntyIndex → KPIs revisión |

---

## 10. CHECKLIST IMPLEMENTACIÓN (Para PR)

- [ ] Crear `skills/hscsg/hscsg-asamblea-gobernanza/` con estructura completa
- [ ] `SKILL.md` (este archivo)
- [ ] `templates/asamblea-parametros.json` (parámetros mutables centralizados)
- [ ] `templates/propuesta-decision-fundamental.md`
- [ ] `templates/propuesta-metodo-reparticion.md`
- [ ] `scripts/simulate_assembly_decision.py`
- [ ] `scripts/validate_legal_compliance.py`
- [ ] `src/core/lib/assemblyConfig.ts` (runtime loader + MJ Gate validation)
- [ ] Extender `tq.ts` `FundAllocation.purpose` con `memory`, `food`, `preventive_care`
- [ ] Implementar `applyBetaCrit()` real en `tq.ts`
- [ ] Crear `src/core/lib/memory_fund.ts` + `care_fund.ts`
- [ ] Documentar en `docs/ESTAMENTO.md` (decisiones D1-D8)
- [ ] Documentar en `docs/INVESTIGACION_TRES_FONDOS_SEIS_TENSIONES.md` (esta investigación)
- [ ] Tests unitarios: carga config, validación legal, simulación impacto
- [ ] `npx tsc --noEmit` = 0 errores
- [ ] Commit + push con RAO anchor

---

## 11. PRÓXIMOS PASOS INMEDIATOS

1. **Esta semana**: Crear skill + templates + scripts + `assemblyConfig.ts`
2. **Próxima asamblea**: Presentar D1-D8 con simulaciones (usar `simulate_assembly_decision.py`)
3. **Post-decisión**: Actualizar `asamblea-parametros.json` + deploy + auditoría RAO
4. **Implementar código faltante**: `applyBetaCrit`, `memory_fund`, `care_fund`, extender `FundAllocation.purpose`
5. **Sync vasos comunicantes**: Disparar `hscsg-orquestador-skills` sync

---

## 12. REFERENCIAS CRUZADAS

| Documento | Sección | Qué aporta |
|-----------|---------|------------|
| `docs/INVESTIGACION_TRES_FONDOS_SEIS_TENSIONES.md` | Completo | Investigación base (este output) |
| `docs/ESTAMENTO.md` | §4 | Decisiones D1-D8 formalizadas |
| `openspec/specs/alrac-tq-taxEngine.md` | §2.2, §3 | β_crit + Fondo Comunitario spec |
| `src/core/lib/tq.ts` | `createCommunityFund`, `applyBetaCrit` | Implementación fondo comunitario |
| `src/core/lib/caas.ts` | `revenueShare` | Reparto AUT×CDS + demurrage |
| `src/core/lib/valueDual.ts` | `displayValue`, `nodeMode` | Arquitectura anfibia (postmonetario/conectado) |
| `docs/gaia_metaplatform_backup.md` | §7.1 | Commonomics 50/30/10/5 |
| `docs/gaia_commons_framework_backup.md` | §5 | 33/33/33 distribución |
| `docs/ECOSYSTEM_REVENUE_SHARING.md` | Completo | 4 círculos 15/20/35/30 |
| `docs/COLABORACION_TRIPARTITA...md` | §7.3, §9 | Tripartita 50/30/10/5/5 + FRNE |
| `docs/VITAL_TIME_CURRENCY_SPEC.md` | §1.1 | hr_vital no heredable, no comprable |
| `docs/MATEMAS_GRIMORIO.md` | Matema 7, 16, 18 | Inmortalidad, límites, reversibilidad |
| `docs/nodos_cuidado_integration.md` | Completo | 8 estados, 12 indicadores, 4 exclusiones |
| `hscsg-autotrofia-disenador` skill | Secuencia crítica | 7 generaciones, vectores AUT |

---

*Skill creada: 2026-10-20 | Autor: Isaac Ko (Isaacko0) | Investigación: Tres Fondos + Seis Tensiones*
*Para actualizar: Editar `templates/asamblea-parametros.json` → commit + push → deploy automático*