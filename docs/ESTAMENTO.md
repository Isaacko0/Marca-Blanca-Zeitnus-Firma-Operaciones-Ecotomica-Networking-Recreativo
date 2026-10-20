# ESTAMENTO — Decisiones Soberanas de la Asamblea HSCSG/ALRAC
## Versión 1.0.0 | 2026-10-20 | RAO:estamento:20261020:001

> **Principio:** Lo que decide la Asamblea no se hardcodea. Se parametriza, se versiona y se audita vía RAO.
> **Fuente de verdad:** `skills/hscsg/hscsg-asamblea-gobernanza/templates/asamblea-parametros.json` (single source of truth, semver, RAO anchor)
> **Código:** Importa desde `src/core/lib/assemblyConfig.ts` — hot-reload en dev, rebuild+deploy en prod.

---

## DECISIONES FUNDAMENTALES (D1-D8) — Requieren Votación Asamblearia

### D1. Porcentaje Fijo + Suelo Estatutario del Excedente Neto Fiat a los Tres Fondos
| Parámetro | Valor Actual | Rango Permitido | Nota |
|-----------|-------------|-----------------|------|
| `porcentajeFijoExcedenteFiat` | 0.10 (10%) | 0.05 – 0.30 | % del excedente neto fiat real |
| `sueloEstatutario` | 0.05 (5%) | ≤ porcentajeFijo | Inmodificable por Asamblea simple (requiere 77.7%) |
| `clausulaArranque.activa` | false | boolean | Se activa con primer contrato real (líneas A–E) |

**Base legal:** LGSC Art. 78 (reserva 10-20%), Art. 80 (educación ≥1%), Art. 81 (previsión social % Asamblea).
**Métrica vigilada:** Excedente anual a tres fondos (ZNU/año) ≥ 10,000 ZNU tras primer contrato.

---

### D2. Unidad de "Excedente" Sobre la que se Aplica el Porcentaje
| Enum `ExcessUnit` | Descripción | Implementación |
|-------------------|-------------|----------------|
| `fiat_neto` | Excedente neto contable en USD/MXN (realidad jurídica hoy) | **DEFAULT** — `caas.ts` streams `usdcIn` |
| `tq_beta_crit` | Exceso liquidez TQ detectado por β_crit (30% threshold, 50% rate) | Requiere `applyBetaCrit()` implementado en `tq.ts` |
| `kwh_termodinamico` | Excedente energético medido en kWh (LandRegistry + EnterpriseStaking) | Requiere sensores IoT + RAO termodinámico |

**Decisión:** Asamblea elige **una** unidad por período. `% fijo` solo auditable sobre unidad declarada.

---

### D3. Definición de "Miembro" para Acceso a Cuidado (Fondo Cuidado)
| Parámetro | Valor Actual | Justificación |
|-----------|-------------|---------------|
| `stakeZNUMinimo` | 20 | Tier CaaS 'Aprendiz' (stake ≥20, AUT≥0.2, CDS≥0.2) |
| `autMinimo` | 0.2 | Soberaniza base material (Ley II MJ) |
| `cdsMinimo` | 0.2 | Capacidad gobernanza distribuida |
| `requiereVerificacionTriaxial` | true | Ley III MJ — Lucidez obligatoria |

**Modelo Brasil:** Equipos salud familiar (médico, enfermera, auxiliar, 4-6 agentes comunitarios) reducen mortalidad evitable y desigualdades. Fondo Cuidado compra **equipos**, no solo clínicas.

---

### D4. Régimen de Herencia — Qué SÍ y Qué NO se Hereda
| Categoría | Activos | Base |
|-----------|---------|------|
| **SÍ hereda (patrimonio memorial)** | `obra`, `memoria`, `reputacion_erc8004`, `complete_data_package` | Matema 7 (reputación heredable), Matema 18 (Complete Data Package), ERC-8004 |
| **NO hereda (patrimonio monetario/vital)** | `hr_vital`, `znu`, `tq` | **INMUTABLE** — VITAL_TIME_SPEC §1.1 (hr_vital no heredable, muerte→pool), ZNU demurrage, TQ límites ±500 |

**Mecanismo:** Cláusula estatutos cooperativa trabajo asociado. Separación jurídica: patrimonio memorial ≠ patrimonio monetario.

---

### D5. Régimen de Datos Salud/Memoria — LFPDPPP 2025 Compliance
| Requisito | Implementación | Estado |
|-----------|----------------|--------|
| Consentimiento expreso escrito revocable | `consentimientoRevocable: true` + VC revocable (W3C) | ✅ Parametrizado |
| Datos sensibles off-ledger | `datosPersonalesOffLedger: true` + storage cifrado off-chain | ✅ Parametrizado |
| Solo hashes/punteros en RAO | `soloHashesEnRAO: true` | ✅ Parametrizado |
| Autoridad: Secretaría Anticorrupción | `lfpddppCompliance: true` | ✅ Marcado |
| Datos personas fallecidas | `datosFallecidos: "requiere_asesoria_legal"` | ⚠️ **PENDIENTE ASESORÍA** |
| Derechos ARCO operativos | Consentimiento revocable + off-ledger habilita acceso/rectificación/cancelación/oposición | ✅ Habilitado |

**Datos sensibles (LFPDPPP Art. 8):** Estado salud presente/futuro, información genética, creencias, opiniones políticas.

---

### D6. Política de No-Miembros — Alternativa a Prohibición Total
| Opción | Descripción | Parámetros |
|--------|-------------|------------|
| `prohibicion_total` | Venta servicios longevidad solo a miembros | Requiere definiciones precisas: "miembro", "servicio longevidad", "lucro" |
| `permiso_costo_real` | **DEFAULT** — No-miembros acceden a costo real + 100% excedente generado → tres fondos | `excedenteGeneradoAFondos: 1.0` |

**Definiciones si prohibición:**
- **Miembro:** `stakeZNU ≥ 20` + `AUT ≥ 0.2` + `CDS ≥ 0.2` + verificación triaxial
- **Servicio longevidad:** Intervención biomédica con claim extensión vida (FDA: no reconocida como indicación independiente)
- **Lucro:** Margen > costo real + reinversión fondos (no especulación)

**Modelo cooperativo comparado:** España ≥50% beneficios extracooperativos a reserva obligatoria; Uruguay 10% reserva operaciones no socios.

---

### D7. Cláusula de Arranque — Activación Fondos con Primer Contrato Real
| Campo | Valor | Significado |
|-------|-------|-------------|
| `activa` | false | Fondos **inactivos** hasta primer contrato |
| `triggerContratoId` | null | Se setea en Asamblea al firmar primer contrato líneas A–E |
| `primerContratoReal` | null | Referencia contrato activador |

**Estado actual:** README marca líneas A–E "Pendiente Paso II" → excedente fiat = 0. Fondos se activan **solo** con ingreso real.

---

### D8. Distribución Interna Entre los Tres Fondos (Pesos)
| Fondo | Peso Actual | Raciónale |
|-------|------------|-----------|
| `memoria` | 0.30 (30%) | Archivo vivo, biografías, consentimiento, restauración probada |
| `cuidado` | 0.40 (40%) | Equipos salud familiar, 12 indicadores, 4 exclusiones, prevención primaria |
| `autotrofia` | 0.30 (30%) | Secuencia crítica 7 gen: agua→alimento→energía→salud→hábitat, vector `food` explícito |

**Suma:** 1.0 (100%). Asamblea puede reponderar manteniendo suma = 1.

---

## PARÁMETROS DE MÉTODOS DE REPARTICIÓN EXISTENTES (Centralizados en `asamblea-parametros.json`)

### Métodos Activos por Defecto
1. **Fondo Solarpunk** — 25% excedentes autómata, PGS≥1.5 → subvenciones nodos
2. **ALRAC β_crit + Fondo Comunitario** — Threshold 30% liquidez, rate 50%, gobernanza 5%/60%/20%, nuevos propósitos: `memory`, `food`, `preventive_care`
3. **CaaS Revenue Share** — Pesos AUT×CDS 0.5/0.5, demurrage 300 ZNU / 5%

### Métodos Inactivos (Referencia / Activables por Asamblea)
- Commonomics Gaia (50/30/10/5 + facilitador)
- Gaia Commons 33/33/33 (Local/National/Global)
- Virginia Network (N3 = kWh/1000, demurrage dinámico)
- Tripartita 50/30/10/5/5 (5% fondo tierra)
- FRNE Ecoaldea (15% fondo comunitario + restitución no especulativa)
- Ecosystem 4 Círculos (15/20/35/30)
- LDFV Alrac (½·θ·(1+ι)·φʰ, PPE + β_crit)

---

## UMBRALES DE VOTACIÓN ASAMBLEARIA

| Tipo Decisión | Quórum | Umbral Aprobación | Ejemplos |
|---------------|--------|-------------------|----------|
| **Parámetros mutables** (D1-D3, D7-D8, % métodos) | 50% | 60% consent / 75% voto | % fondos, umbrales miembro, pesos internos |
| **Políticas estructurales** (D4 herencia, D5 datos, D6 no-miembros) | 60% | 75% | Régimen herencia, LFPDPPP, política no-miembros |
| **Cambios constitucionales** (Cuaternidad, Leyes MJ, Planos, Matemas) | 66% | **77.7%** | Modificar Matemas, Pilares, Leyes MJ (Gaia Commons) |
| **Emergencia Ley I MJ** (Santuario, β_crit trigger) | 33% | 50% + Autómata valida | Activación santuario, redistribución β_crit |

---

## FLUJO DE DECISIÓN (Protocolo Canónico)

```
1. PROPUESTA → Miembro (stake≥20) inicia con template `propuesta-decision-fundamental.md` o `propuesta-metodo-reparticion.md`
2. CONSULTA (7-30 días) → Publicación foro + notificación + Autómata simula impacto (`simulate_assembly_decision.py`)
3. CONSENTIMIENTO/VOTO → 1ª instancia consent-based / 2ª quórum 50%+75% / 3ª quórum 33%+50%
4. EJECUCIÓN → Actualiza `asamblea-parametros.json` (semver) + commit firmado + RAO anchor + deploy automático
5. AUDITORÍA → RAO credencial tipo `assembly_decision` + validación legal (`validate_legal_compliance.py`) + métricas 6 meses
```

---

## VALIDACIÓN LEGAL AUTOMÁTICA (Pre-Votación)

Ejecutar **antes** de someter a votación:
```bash
python skills/hscsg/hscsg-asamblea-gobernanza/scripts/validate_legal_compliance.py
```

Valida: LGSC Arts 78/80/81, LFPDPPP Arts 8/sensibles/ARCO/fallecidos, Estatutos cooperativa, Principios HSCSG inmutables (Leyes MJ, Matemas 7/16/18, Principio Anfibio).

**Solo propuestas con 0 fallos legales** pueden votarse.

---

## RAO ANCLAJE POR DECISIÓN

Cada decisión genera credencial RAO tipo `assembly_decision`:
```json
{
  "type": "assembly_decision",
  "decisionId": "PROP-ASAM-20261020-001",
  "parametersChanged": ["tresFondos.porcentajeFijoExcedenteFiat"],
  "previousValues": {"tresFondos.porcentajeFijoExcedenteFiat": 0.10},
  "newValues": {"tresFondos.porcentajeFijoExcedenteFiat": 0.15},
  "votes": {"did:hscsg:member1": {"weight": 1.2, "choice": "yes", "timestamp": "..."}},
  "quorumAchieved": true,
  "thresholdMet": true,
  "legalValidation": {"lgsc": true, "lfpddpp": true, "estatutos": true, "hscsg": true},
  "automatonSimulation": {"metricsBefore": {...}, "metricsAfter": {...}, "passed": true}
}
```

---

## PRÓXIMA ASAMBLEA — ÓRDEN DEL DÍA PROPUESTO

1. **D1** — Votar `porcentajeFijoExcedenteFiat` (recomendación: 10% con suelo 5%)
2. **D2** — Confirmar `unidadExcedente: fiat_neto` (única con realidad jurídica hoy)
3. **D3** — Ratificar definición miembro (stake≥20, AUT≥0.2, CDS≥0.2, triaxial)
4. **D4** — Aprobar régimen herencia (separación memorial/monetario inmutable)
5. **D5** — Validar LFPDPPP compliance (datos fallecidos → asesoría legal urgente)
6. **D6** — Elegir política no-miembros: `permiso_costo_real` (recomendado) vs `prohibicion_total`
7. **D7** — Definir trigger `clausulaArranque` al firmar primer contrato líneas A–E
8. **D8** — Confirmar pesos internos 30/40/30 (Memoria/Cuidado/Autotrofia)
9. **Activar métodos** — Confirmar Fondo Solarpunk, β_crit, CaaS Revenue Share como activos
10. **Extender FundAllocation.purpose** — Aprobar `memory`, `food`, `preventive_care` en fondo comunitario ALRAC

---

## VASOS COMUNICANTES

| Skill | Qué sincroniza |
|-------|----------------|
| `hscsg-monetary-integration` | Métodos reparto ↔ parámetros mutables; referentes → validación legal |
| `hscsg-coeficiente-autonomia` | AUT/CDS reales → validación umbrales D3; métricas equidad → simulación |
| `hscsg-sistema-alraico` | γ-CARMIS → revisión parámetros; LDFV → distribución fractal; β_crit → fondo comunitario |
| `hscsg-document-architect` | `ESTAMENTO.md` ↔ `asamblea-parametros.json` sincronizados; BRIEFS actualizados |
| `hscsg-viabilidad-territorial` | TerritorialSovereigntyIndex → KPIs revisión 6 meses |

---

*Documento vivo — Editar `asamblea-parametros.json` → commit + push → deploy automático → RAO anchor*
*Versión 1.0.0 | 2026-10-20 | Asamblea Soberana HSCSG/ALRAC*