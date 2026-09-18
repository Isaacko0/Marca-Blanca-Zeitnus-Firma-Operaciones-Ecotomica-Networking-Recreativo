# ALRAC — Integración con Zeitnus + Rif + Sistema Alráico

**Fuente**: Documento `ALRAC_consortium_model.md` + análisis previos  
**Fecha**: 2026-09-18  
**Objetivo**: Mapear el modelo ALRAC a la arquitectura técnica existente (Zeitnus, Rif, PVL, LEF, Alráico)

---

## 1. MAPEO DE CAPAS ALRAC → ARQUITECTURA TÉCNICA

| Capa ALRAC | Dueño | Implementación Técnica Actual | Estado | Gaps Críticos |
|------------|-------|-------------------------------|--------|---------------|
| **0 · Epistémica** | Amid Dabir | `Sistema Alráico` (PDF) → `pvl-core/epistemology/` | 🔴 Especificación sola | `pvl-core` types TS/Go, compliance suite, AEI implementation |
| **0.5 · Normativa** | Javier | `7 principios + 5 anti-reglas` | 🟡 Documentado en LEF v1.0 | Formalizar en `pvl-core/governance/principles.ts/go` |
| **1 · Contable-física** | Cergio Monasterio | `Rif/internal/ledger/` + `energyCatalog.ts` | 🟡 Parcial (Go backend) | TQ ledger completo, catálogo ICE/Ecoinvent, NFC offline, límites ±500 TQ |
| **2 · Interoperabilidad** | Isaac / HSCSG v15 | `Zeitnus` (CaaS, AUT, RAO, Autómata) + `Rif` (federación, mTLS, gossip) | 🟡 Parcial (dos runtimes) | `federationBridge`, `priceParity` TQ↔ZNU 1:1, γ-CARMIS distribuido |
| **3 · Membrana fiat** | Cooperativa ZEITNUS | `Zeitnus/CaaS` + `trustlines` + `vesting` | 🔴 Solo diseño | Constitución legal, nómina, fideicomiso tierra, puente bancario regulado |

---

## 2. RESOLUCIÓN TQ vs ZNU (Contradicción Disuelta)

### Problema Original (Zeitnus)
- **ZNU**: Postulado 4 = caducidad (decay), reserva de valor, CaaS revenue share
- **Contradicción**: ¿Reserva de valor O caducidad? No puede ser ambos simultáneamente sin fractura (αʰ < κ)

### Solución ALRAC (Dos Instrumentos, Dos Funciones)

| Variable | TQ (Capa 1 - Rif) | ZNU (Capa 3 - Zeitnus Coop) |
|----------|-------------------|----------------------------|
| **Función** | Cinta métrica de reciprocidad | Reserva y puente fiat |
| **Acumulable** | **NO** — límites simétricos ±500, decay obligatorio | **SÍ** — reserva dentro de cooperativa |
| **Unidad** | 1 TQ = 1 kWh (termodinámico) | 1 ZNU = $0.02 USDC (priceParity) |
| **Cambio fiat/cripto** | **PROHIBIDO** (expulsión) | **PERMITIDO** (membrana fiat) |
| **Gobernanza** | Crédito mutuo bilateral + asamblea nodo | 1 asociado = 1 voto, cooperativa |
| **Caso de uso** | Intercambio diario, trueque energético, contabilidad reciprocidad | Ahorro, nómina, compra tierra, puente bancario |

### Implementación Técnica

```typescript
// pvl-core/economics/currencySeparation.ts/go

interface CurrencySeparation {
  // TQ: Capa 1 - Rif (Contable-física)
  TQ: {
    unit: 'kWh'
    backing: 'ICE/Ecoinvent/Agribalyse'
    limits: { floor: -500, ceiling: 500 }  // simétrico, configurable por tipo nodo
    decay: 'daily_rotation'  // vitalTimeRotate equivalent
    exchange: 'PROHIBITED'  // exchangeGuard.ts enforces
    governance: 'mutual_credit + assembly'
  }
  
  // ZNU: Capa 3 - Zeitnus Coop (Membrana fiat)
  ZNU: {
    unit: 'USDC_parity'
    backing: 'CaaS_revenue_share + productive_assets'
    limits: { floor: 0, ceiling: null }  // acumulable, sin techo duro
    decay: 'none'  // reserva de valor
    exchange: 'ALLOWED'  // priceParity oracle, DEX via CaaS
    governance: 'cooperative_1_member_1_vote'
  }
  
  // Membrana: ÚNICO punto de contacto
  membrane: {
    // ZNU puede comprar TQ para operaciones (ej: pagar proveedor en red TQ)
    // TQ NUNCA se convierte a ZNU/fiat
    direction: 'ZNU_to_TQ_only'
    rate: 'priceParity_FC'  // Factor Conversión = canasta_TQ(500) / canasta_Fiat
    audit: 'RAO_chain_of_custody'
  }
}
```

---

## 3. PRODUCTOS ALRAC → MÓDULOS TÉCNICOS

### A. Diagnóstico de Encaje y Paz Operativa → `pvl-core/epistemology/`

| Entregable ALRAC | Módulo Técnico | Archivos Zeitnus/Rif |
|------------------|----------------|----------------------|
| **𝕮-Atlas** (7 modelos + αʰ + fractura) | `credoSet.ts` + `cognitiveLimits.ts` + `economicModels.ts` | `src/core/lib/economicModels.ts`, `rif/internal/economics/models.go` |
| **Encaje** (mapeo contexto → combinación) | `alraicFilter.ts` + `logicByInherence.ts` + `triDimClassification.ts` | `src/app/screens/AlraicoDiagnosis.tsx`, `rif/internal/diagnostics/` |
| **Desatasco** (AEI + 20 Límites + γ-CARMIS) | `ecroxAnalyzer.ts` + `gammaCarmis.ts` + `cognitiveLimits.ts` | `src/app/screens/GammaCARMISMonitor.tsx`, `rif/internal/carmis/` |

**Integración Zeitnus**: Nueva pantalla `/alraico/diagnosis` con:
- Input: descripción contexto comunidad/empresa
- Output: 𝕮-Atlas match + recomendación honesta ("no necesitan nodo TQ") + plan desatasco si aplica
- Candado epistémico: nunca diagnóstico clínico, derivación Nivel 5 obligatoria

### B. Nodo Llave en Mano → `pvl-runtime-go` + `pvl-cli`

| Componente | Implementación Rif | Zeitnus Frontend |
|------------|-------------------|------------------|
| Servidor mTLS | `rif/internal/server/mtls.go` | `FederationDashboard.tsx` (gestión certs) |
| Terminales ESP32/NFC | `rif/hardware/esp32/` + `rif/hardware/android/` | `HardwareProvisioning.tsx` (wizard config) |
| Catálogo energético | `rif/internal/energy/catalog.go` (ICE/Ecoinvent) | `EnergyCatalogEditor.tsx` (calibración local) |
| Plantillas asamblea/fideicomiso | `rif/internal/governance/templates/` | `GovernanceTemplates.tsx` (editor + export PDF) |

**PVL-CLI**: `pvl init mi-nodo --tipo=ecoaldea|cooperativa|municipio` → genera:
- `docker-compose.yml` (Go backend + React frontend + YugabyteDB + mTLS certs)
- `config.yaml` (parámetros TQ, límites, catálogo, gobernanza)
- `systemd` services / `install.sh` (1-click deploy)
- Documentación legal (estatutos, fideicomiso, asamblea constitutiva)

### C. Medición y Cumplimiento → `pvl-core/economics/` + `RAO`

| Concepto ALRAC | Implementación |
|----------------|----------------|
| **7 principios** | `principles.ts/go` — cada principio = métrica computable |
| **Catálogo energético** | `energyCatalog.ts/go` — ICE/Ecoinvent factors, 1 TQ = 1 kWh |
| **Evidencia: ledger TQ + RAO** | `rif/internal/ledger/tq_ledger.go` + `RAO` (Resource Accountability Object) |
| **Reporte automático** | `ComplianceReporter.ts` → genera reporte ESG desde ledger real (no encuestas) |

**Clientes objetivo**: Sector social mexicano, municipios, fondos impacto, cooperación internacional Vzla/Centroamérica
**Diferencial**: "Evidencia = libro contable con anclaje termodinámico, no encuesta"

### D. Editorial y Escuela Alráica → `Zeitnus` + `Pepe Sevilla`

| Activo | Estado | Acción |
|--------|--------|--------|
| *El Dojo* (500 págs) | PDF en vault | Edición, ISBN, distribución, traducción EN/PT |
| *Ecoaldeas Federadas v1.0* | PDF + `libro_ecoaldeas_federadas_integration.md` | Publicar v1.1 con specs técnicas integradas |
| *Presentación ZEITNUS* | `PITCH.md` + `A1-PRESENTACION...` | Curso online modular (Pepe Sevilla platform) |
| **Escuela Alráica** | No existe | Curso: "Epistemología Operativa para Construcción de Mundos" — 12 módulos, certificación PVL |

### E. Estudio Zeitnus → Ya operativo
- Desarrollo web clientes locales
- Cashflow para financiar A-D
- Sin cambios arquitecturales

---

## 4. REPARTO: LEY DE DISTRIBUCIÓN FRACTAL DEL VALOR (LDFV) → CÓDIGO

### Fórmula ALRAC
```
ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾/10)
```

### Implementación en `pvl-core/economics/valueDistribution.ts/go`

```typescript
interface LDFV {
  // θ_generado: valor generado por capa k (medido en TQ/ZNU según capa)
  // ι: inversión en conocimiento (publicaciones, specs, docs, enseñanza)
  // αʰ⁽ᵏ⁾: armonía aportada por capa k (medida via triaxial verification)
  // k: índice capa (0=epistémica, 0.5=normativa, 1=contable, 2=interop, 3=membrana)
  
  calculateShare(layer: Layer, metrics: LayerMetrics): bigint {
    const half = metrics.thetaGenerated / 2n
    const knowledgeBonus = 1 + metrics.iota  // ι ≥ 0
    const harmonyFactor = Math.pow(0.95, layer.index) * (1 + metrics.alphaH / 10)
    return half * knowledgeBonus * harmonyFactor
  }
  
  // PPE (Protocolo Protección Explotación)
  // Si γ_ind ≪ ½θ_generado → explotación declarada → redistribución
  checkExploitation(individual: Member, layer: Layer): boolean {
    const gammaInd = individual.ligatureToInherent  // γ_ind
    const halfTheta = layer.thetaGenerated / 2n
    return gammaInd * 100n < halfTheta  // umbral configurable
  }
  
  // β_crit: techo anti-agujero-negro
  // Ningún socio puede acumular > β_crit del valor total
  checkBlackHole(member: Member, totalValue: bigint): boolean {
    const betaCrit = this.calculateBetaCrit(totalValue)
    return member.accumulatedValue > betaCrit
  }
}
```

### Integración con Zeitnus Existente

| Zeitnus Module | LDFV Mapping |
|----------------|--------------|
| `caas.ts` (revenue share) | θ_generado para Capa 3 (Membrana fiat) |
| `vitalTime.ts` (mint/decay) | θ_generado para Capa 2 (Interoperabilidad) |
| `trustlines.ts` (crédito mutuo) | θ_generado para Capa 1 (Contable-física) |
| `automata.ts` (skills, γ-CARMIS) | ι (inversión conocimiento) + αʰ (armonía) |
| `coeficienteAutonomia.ts` (AUT/CDS/ZNU) | Métricas de armonía por capa |

---

## 5. GOBERNANZA DE PAZ → ARQUITECTURA TÉCNICA

| Principio ALRAC | Implementación Técnica |
|-----------------|------------------------|
| **Contrato de no absorción** | `pvl-core/governance/noAbsorption.ts/go` — runtime validation: no layer can require another's currency/license/vocab |
| **Verificación Triaxial como árbitro** | `triaxialVerification.ts/go` — disputes resolved via `mental` (code review), `simulation` (integration tests), `laboratory` (real network) |
| **γ-CARMIS en lugar de divorcio** | `gammaCarmisDistributed.ts/go` — ΣPᵢ > κ_federado triggers coordinated reconfig, not exit |
| **Auditoría licencias primer entregable** | `LICENSE_AUDIT_ASIMILACIONES.md` + `legal-safe-check.sh` + pre-commit hook (ya existe en HSCSG) |

### Dispute Resolution Flow (Código)

```typescript
// pvl-core/governance/disputeResolution.ts

async function resolveDispute(dispute: Dispute): Promise<Resolution> {
  // 1. Intentar resolución via γ-CARMIS local (reconfiguración)
  const carmisResult = await triggerLocalCARMIS(dispute.context)
  if (carmisResult.resolved) return carmisResult.resolution
  
  // 2. Escalar a Verificación Triaxial Distribuida
  const triaxial = await distributedTriaxialVerification({
    mental: () => crossCodeReview(dispute.codePaths),
    simulation: () => runIntegrationTests(dispute.testSuite),
    laboratory: () => deployTestnetAndObserve(dispute.scenario)
  })
  
  if (triaxial.isValid()) return triaxial.resolution
  
  // 3. γ-CARMIS Federado (reconfiguración coordinada)
  return await triggerFederatedCARMIS({
    nodes: dispute.involvedNodes,
    pressure: dispute.pressureVector,
    anchors: [priceParity, TQ_ZNU_parity, LEF_specs, Alraico_invariants]
  })
}
```

---

## 6. SECUENCIA 90 DÍAS → TAREAS TÉCNICAS CONCRETAS

### Semanas 1-3: Auditoría Licencias (Bloqueador)
```bash
# Ya existe en HSCSG: scripts/legal-safe-check.sh + pre-commit
# Tarea: Ejecutar sobre TODAS las asimilaciones (13 módulos + 7 bots + Jev + LEF + Alráico)
./scripts/legal-safe-check.sh --full --output=LICENSE_AUDIT_ASIMILACIONES.md
# Verificar: CC0 epistémica, MIT/Apache código, CC BY-NC-ND docs (conflicto), GPL bots
```

### Semanas 2-4: Cuatro Cartas (Comunicación Escalonada)
| Destinatario | Contenido Técnico | Canal |
|--------------|-------------------|-------|
| **Amid** | TQ/ZNU separation, ALRAC name, LDFV statute | `docs/ALRAC_for_Amid.md` + reunión |
| **Cergio** | Fiat membrane protects currency prohibition | `docs/ALRAC_for_Cergio.md` + demo Rif mTLS |
| **Javier** | Layer 0.5 spec, equal remuneration formula | `docs/ALRAC_for_Javier.md` |
| **Pepe** | Line D: editorial + school bridge | `docs/ALRAC_for_Pepe.md` + Zeitnus course module |

### Semanas 4-8: Piloto Línea A (Diagnóstico Encaje + Paz)
```typescript
// Objetivo: 1 cliente real, documentado end-to-end

// 1. Cliente llega a Zeitnus UI → /alraico/diagnosis
// 2. AlraicDiagnosis.tsx ejecuta:
//    - 𝕮-Atlas matching (economicModels.ts)
//    - CognitiveLimits detection (cognitiveLimits.ts)  
//    - AEI analysis (ecroxAnalyzer.ts)
//    - TriDimClassification (triDimClassification.ts)
// 3. Output: Recomendación honesta + Plan desatasco (si aplica)
// 4. Si procede → Nodo Llave en Mano (pvl init) → Deploy → 30 días operación
// 5. Métricas: αʰ > κ sostenido, γ-CARMIS triggers, client satisfaction
```

### Semanas 8-12: Constitución Legal + Primer Nodo TQ
```bash
# Legal: Cooperativa de trabajo asociado (México) / Sociedad Cooperativa (Venezuela)
# Estatutos incluyen: LDFV como reglamento financiero, 7 principios, 5 anti-reglas
# Primer nodo TQ: pvl init nodo-piloto --tipo=ecoaldea
# Deploy: VPS + ESP32 terminales + catálogo energético calibrado
# Validación: 10+ usuarios, 100+ transacciones TQ, αʰ > κ 30 días
```

---

## 7. RIESGOS CRÍTICOS (Análisis Alráico)

| Riesgo ALRAC | Límite/Sesgo | Mitigación Técnica |
|--------------|--------------|-------------------|
| **Capa 3 capta ahorro prematuro** | TAD (latencia acción→consecuencia) | Hardcode en estatutos: "Función financiera habilitada tras 2 años + balance auditado + asamblea 2/3" |
| **TQ = 1 kWh no validado empíricamente** | FCP (salto B→D, relato vs choque I) | Piloto 30 días con medición real: kWh medidos vs TQ contados, publicar datos abiertos |
| **Arquitectura sin nodo funcionando** | Límite 18 (solución existe no se toma) + HD (dogma "arquitectura primero") | **Regla dura**: No código nuevo en capas 0-2 sin nodo piloto operativo. Métrica: `nodes_in_production > 0` |
| **Amid no valida Capa 0** | PI (incapacidad estructural) — solo Amid puede validar epistemología | CC0 permanente + "nunca diagnosticar" — Amid firma `EPISTEMIC_VALIDATION.md` por versión |
| **Captura por capital en Capa 3** | HD (cambiar dueño sin recontrastar modelo) | 1 asociado = 1 voto, fideicomiso indivisible, β_crit hardcoded, no equity |

---

## 8. MÉTRICAS DE ÉXITO ALRAC (90 días)

| Métrica | Target | Verificación |
|---------|--------|--------------|
| `LICENSE_AUDIT_ASIMILACIONES.md` | Completo, 0 conflictos CC BY-NC-ND | `legal-safe-check.sh` pass |
| `pvl-core` types (TS+Go) | 15 módulos core compilando | `tsc --noEmit` + `go build` |
| `federationBridge` | Zeitnus UI ↔ Rif node TQ↔ZNU | Integration test pass |
| `γ-CARMIS distribuido` | Trigger + reconfig coordinada | Chaos test: inject pressure, verify reconfig |
| Piloto Línea A | 1 cliente, diagnóstico + plan documentado | Case study publicado |
| Nodo TQ operativo | 10+ usuarios, 30 días, αʰ > κ | Ledger TQ + métricas triaxial |
| Constitución legal | Cooperativa registrada, estatutos LDFV | Documento notarial |

---

## 9. CONEXIÓN CON DOCUMENTOS PREVIOS

| Documento Previo | Conexión ALRAC |
|------------------|----------------|
| `sistema_alraico_integration_zeitnus.md` | Capa 0 (Epistémica) = fuente de `pvl-core/epistemology/` |
| `incompatibilidades_zeitnus_rif_alraico.md` | Diagnóstico PI → justifica **federación via protocolo (Capa 2)**, no merge |
| `libro_ecoaldeas_federadas_integration.md` | Capa 1 (Contable-física) = specs LEF v1.0 implementadas en Rif |
| `PITCH.md` | Capa 3 (Membrana fiat) = narrativa cliente/activista para Zeitnus Coop |
| `hscsg-next-steps-orchestrator` (P5 LEF specs) | 13 specs LEF = backlog Capa 1 + Capa 2 |

---

## 10. PRÓXIMA ACCIÓN INMEDIATA

```bash
# 1. Crear repo pvl-spec (público, governance PVL)
# 2. Mover pvl-core types desde documentos a código:
#    - credoSet.ts/go
#    - cognoscible.ts/go  
#    - hollowConcept.ts/go
#    - gammaCarmis.ts/go
#    - cognitiveLimits.ts/go
#    - triaxialVerification.ts/go
#    - alraicFilter.ts/go
#    - logicByInherence.ts/go
#    - currencySeparation.ts/go (TQ vs ZNU)
#    - valueDistribution.ts/go (LDFV)
#    - noAbsorption.ts/go
#    - disputeResolution.ts/go
# 3. CI: pvl verify --suite=topology,credo,carmis,epistemology,economics,governance
# 4. Ejecutar legal-safe-check.sh --full
# 5. Redactar 4 cartas (Amid, Cergio, Javier, Pepe) con specs técnicas adjuntas
```

---

**El modelo ALRAC no es "otra capa de arquitectura". Es la **transducción F** que hace que Zeitnus, Rif, LEF, Alráico y la cooperativa ZEITNUS sean **implementaciones fieles de la misma especificación viva**, cada una en su capa, sin absorción, con ética en la fórmula.**

*Documento generado desde `ALRAC_consortium_model.md` + integración con arquitectura técnica existente.*