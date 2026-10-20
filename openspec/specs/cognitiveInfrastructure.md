# OpenSpec: Infraestructura Cognitiva para la Vejez en América Latina

**Versión:** 1.0.0 | **Fecha:** 2026-10-20 | **RAO:** `RAO:cognitiveInfrastructure:20261020:001`
**Estado:** Borrador operativo para revisión Asamblea
**Dependencias:** `pmcrt.md` (v1.1.0+), `canutriciotranshumanism.md` (v1.0.0+), `metabolicAccounting.md` (v1.0.0+), `photosyntheticRegeneration.md` (v1.0.0+)

---

## 1. RESUMEN EJECUTIVO

Esta especificación define la **Infraestructura Cognitiva como Bien Público** (agua/electricidad) para América Latina, operativizando el Ep.55 de Moisés Jáuregui-Sánchez (2026) en el marco **PMCRT/Zeitnus/ALRAC**. Establece:

1. **Arquitectura Edge AI + Federated Learning** offline-first, soberanía de neurodatos
2. **Métricas validadas** neuroplasticidad (hipocampo, FINGER), flow state, adaptación cultural
3. **Gobernanza VC** para consentimiento granular, herencia conocimiento abierto, no privilegio enhancement
4. **Modelo económico B2G** <$10/usuario/año via Credencial Salud Universal México 2026
5. **Integración Canutriciotranshumanismo**: Prevención → Curación → Mejora (orden estricto)

> **Principio rector (Matema 20/21):** *"La jubilación del dinero disociativo se materializa como soberanía cognitiva: fin de la extracción de neurodatos, inicio de la regeneración de la identidad."*

---

## 2. ARQUITECTURA TÉCNICA: EDGE AI + FEDERATED LEARNING

### 2.1 Stack Tecnológico

| Capa | Tecnología | Especificación |
|------|------------|----------------|
| **Dispositivo Edge** | Raspberry Pi 4 / Teléfono reciclado / NPU embebido | <20MB modelo INT8, <100ms inferencia, <10mJ/inferencia |
| **Modelo Base** | Transformer cuantizado (DistilBERT/MobileBERT) + LoRA adaptadores | Español + lenguas originarias (mixteco, náhuatl, quichua, etc.) |
| **Federated Learning** | Flower / PySyft / custom async FL | Round semanal, differential privacy ε≤1, dropout tolerante |
| **Almacenamiento** | SQLite cifrado (SQLCipher) + IPFS local para modelos | Off-ledger obligatorio, solo hashes en RAO |
| **Interfaz** | Voz (Whisper.cpp) + Gesto (MediaPipe) + AR (WebXR) + UI simplificada | WCAG 2.1 AA + presbiopía + motricidad fina |
| **Conectividad** | Offline-first, sync diferido (LoRaWAN / WiFi intermitente / USB-sneakernet) | 0 dependencia nube para inferencia |

### 2.2 Flujo de Datos (Privacidad by Design)

```
Usuario (Adulto Mayor) 
    ↓ Interacción voz/gesto/AR (local)
Dispositivo Edge (Modelo + Datos) 
    ↓ Inferencia local (neuroplasticidad, flow state, engagement)
Resultados + Gradientes locales (DP ε≤1)
    ↓ Round FL semanal (async, tolerante dropout)
Servidor FL Mínimo (Agregación FedAvg) 
    ↓ Modelo actualizado (hash en RAO)
Dispositivo Edge (Hot-reload modelo)
```

**Invariantes de Privacidad:**
- **Cero datos raw salen del dispositivo**: Solo gradientes DP + métricas agregadas
- **Consentimiento VC granular**: 4 categorías (neuroimaging, behavioral, linguistic, genomic)
- **Revocación ≤24h**: Borrado efectivo local + retiro hash RAO
- **Herencia**: Protocolos → OAD license; Datos personales → borrado post-mortem

---

## 3. MÉTRICAS OBLIGATORIAS (CognitiveInfrastructureMetrics)

```typescript
interface CognitiveInfrastructureMetrics {
  // Cobertura y acceso (Prevención Universal)
  cognitive_coverage_pct: number;               // Target: ≥80% población >60
  rural_coverage_pct: number;                   // Target: ≥60% rural >60
  connectivity_independent_pct: number;         // Target: ≥90% offline-functional
  
  // Eficacia Clínica (Neuroplasticidad + FINGER)
  cognitive_decline_reduction_pct: number;      // Target: ≥20% vs baseline (2 años)
  hippocampal_volume_change_pct: number;        // Target: ≥+1% (PubMed 39012673)
  flow_state_achievement_rate: number;          // Target: ≥70% sesiones
  
  // Infraestructura Edge AI
  edge_device_density_per_1000: number;         // Target: ≥5 dispositivos/1000 hab>60
  model_inference_latency_ms: number;           // Target: <100ms
  federated_round_participation_pct: number;    // Target: ≥80% nodos
  model_freshness_days: number;                 // Target: ≤7 días
  
  // Gobernanza Datos (LFPDPPP 2025)
  data_locality_compliance_pct: number;         // Target: 100% (full edge)
  consent_revocation_rate_pct: number;          // Monitor: <5%/año
  cultural_adaptation_score: number;            // Target: ≥0.80 (semántica/narrativa)
  
  // Economía B2G
  cost_per_user_year_usd: number;               // Target: <$10
  public_health_integration: boolean;           // Target: true (Credencial Salud 2026)
}
```

---

## 4. JERARQUÍA CANUTRICIOTRANSHUMANISTA APLICADA

### 4.1 Prevención (Prioridad 1 — Universal, Incondicional)
| Aplicación | Recurso Edge AI | Población Objetivo | Métrica Éxito |
|------------|-----------------|-------------------|---------------|
| **Estimulación cognitiva adaptativa** | Modelo neuroplasticidad + flow state | **TODOS >60 años** (urbano/rural/indígena) | `cognitive_coverage_pct ≥80%`, `decline_reduction ≥20%` |
| **Detección temprana MCI** | Screening voice/behavioral offline | Comunidades sin acceso neurólogo | Sensibilidad ≥85%, Especificidad ≥90% |
| **Prevención aislamiento social** | Narrativas orales + juego colaborativo async | Adultos mayores solos / cuidadores | `flow_state ≥70%`, `engagement_sostenido ≥6 meses` |

### 4.2 Curación (Prioridad 2 — Patología Establecida)
| Aplicación | Recurso | Evidencia Requerida |
|------------|---------|---------------------|
| **Rehabilitación post-ACV** | BCI edge + neurofeedback + ejercicio | Ensayo fase 2 n≥200, `hippocampal_volume_change ≥+1%` |
| **Intervención MCI → Demencia** | Multimodal FINGER-adaptado (cognitivo+físico+social+nutricional) | `cognitive_decline_reduction ≥25%` vs control |

### 4.3 Mejora / Enhancement (Prioridad 3 — Condicional)
**Regla Inquebrantable (Matema 21.5):** *"No hay enhancement sin cobertura preventiva universal ≥80% territorial"*

| Aplicación | Condición Canutriciotranshumanista | Scorecard Mínimo |
|------------|-----------------------------------|------------------|
| **Optimización cognitiva supra-basal** | Prevención 100% territorial + Scorecard ≥85 | SCALING |
| **BCI para comunicación aumentada** | Solo terapéutico (locked-in, ELA) | PILOT (therapeutic_only) |
| **Neurofeedback executive function** | RECHAZADO si prevención <80% | REJECTED |

---

## 5. GOBERNANZA VC (CREDENCIALES VERIFICABLES)

### 5.1 Tipos de Credencial Requeridos

```typescript
interface CognitiveInfrastructureVC {
  // Consentimiento informado neurocognitivo
  consent_vc: {
    type: 'NeurocognitiveConsentVC';
    subject_did: string;
    categories: [
      'neuroimaging',           // MRI/fNIRS/EEG hipocampal
      'behavioral',             // Patrones juego, reaction times, errors
      'linguistic',             // Corpus semántico, narrativas orales, lenguas originarias
      'genomic'                 // APOE, polimorfismos neuroplasticidad (opcional)
    ];
    expiry_days: 180;           // Re-consentimiento semestral (riesgo alto)
    revocation_triggers: [
      'adverse_cognitive_event',
      'unexpected_data_transfer',
      'cultural_misalignment_detected',
      'model_drift_significant'
    ];
    cultural_scope: string[];   // ['mexico_oaxaca_mixteco', 'colombia_andina', ...]
  };
  
  // Herencia terapéutica (conocimiento, NO privilegio)
  therapeutic_heritage_vc: {
    type: 'TherapeuticHeritageVC';
    protocol_hash: string;      // SHA256 protocolo completo (modelo, prompts, adaptación)
    license: 'CC-BY-4.0' | 'OAD-1.0';  // Conocimiento abierto
    enhancement_exclusion: true;       // NO genera privilegio enhancement
    assigned_to_fund: 'care' | 'memory';
  };
  
  // Inmortalidad digital / Longevidad (Matema 20: Difuntus)
  immortality_vc: {
    type: 'ImmortalityVC';
    subject_did: string;
    cognitive_continuity_claim: boolean;  // Reclamación continuidad identidad
    veto_suspensivo_futuros: boolean;     // Consejo Futuros 14 días
    repair_subcommittee_review: boolean;
    neural_substrate_preserved: boolean;  // Hipocampo + redes semánticas
  };
}
```

### 5.2 Reglas de Gobernanza (Matema 20/21)

| Regla | Descripción | Implementación |
|-------|-------------|----------------|
| **1p1v** | Una persona, un voto (no ponderado por tokens/stake/cognitivo) | `assemblyConfig.ts`: `voting: { method: '1p1v' }` |
| **Consejo Futuros veto suspensivo** | 14 días para objetar decisiones irreversibles (enhancement) | `assemblyConfig.ts`: `future_council: { veto_days: 14 }` |
| **Subcomité Reparación** | Obligatorio para enhancement cognitivo | `assemblyConfig.ts`: `repair_subcommittee: true` |
| **Consentimiento granular** | Por categoría neurodato, propósito, alcance cultural | `consent_vc.categories` enum |
| **Datos off-ledger** | Neurodatos cifrados local, solo hashes en RAO | `memory_fund.ts`: `storeOffLedger(encryptedData, raoHash)` |
| **Herencia obra/memoria/reputación** | Protocolos abiertos (OAD), CDP heredable, neurodatos NO heredables | `ESTAMENTO.md` D3, D7 |

---

## 6. MODELO ECONÓMICO B2G — INTEGRACIÓN 3 FONDOS PMCRT

### 6.1 Estructura de Costos (Target <$10/usuario/año)

| Componente | Costo Anual | Fuente Financiamiento | Fondo PMCRT |
|------------|-------------|----------------------|-------------|
| **Hardware Edge** (RPi 4 / teléfono reciclado + NPU) | $3.50 | Subvención hardware | **Autotrofia** (infraestructura) |
| **Desarrollo modelo base** (amortizado 5 años, 1M usuarios) | $1.20 | I+D abierto, convocatorias públicas | **Memoria** (I+D conocimiento) |
| **Servidor FL Mínimo** (compartido, 10k nodos) | $0.80 | Infraestructura compute federada | **Autotrofia** (compute) |
| **Adaptación cultural/lingüística** (por variante) | $1.50 | Lingüistas/antropólogos comunitarios | **Cuidado** (prevención cultural) |
| **Soporte técnico local** (promotoras/comunitarios) | $2.00 | Equipo salud familiar + agentes comunitarios | **Cuidado** (ops prevención) |
| **Gobernanza/VC/Auditoría** | $1.00 | Smart contracts + auditoría RAO | **Memoria** (gobernanza) |
| **TOTAL** | **$10.00** | **Distribución 3 fondos** | **30/40/30** |

### 6.2 Integración Credencial Salud Universal México 2026

```typescript
// API gob.mx/salud
interface SaludUniversalIntegration {
  endpoint: 'https://api.salud.gob.mx/v1/cognitive-stimulation';
  auth: 'VC_verifiable_credential';
  user_claims: {
    age: number;                    // ≥60
    location: string;               // municipio/código postal
    language: string;               // preferencia (es-MX, mixteco, náhuatl, etc.)
    accessibility: string[];        // ['voice', 'gesture', 'ar', 'high_contrast']
    consent_vc: string;             // VC firmada usuario
    cognitive_baseline: {           // Opcional: screening previo
      moca_score?: number;
      hippocampal_volume_ml?: number;
    };
  };
  response: {
    assigned_edge_node: string;     // DID nodo Edge
    model_version: string;          // hash modelo FL
    cultural_adaptation_id: string; // ID corpus semántico local
    federated_learning_schedule: string; // cron: "0 2 * * 0" (domingos 02:00)
    pilot_cohort_id?: string;       // Si en fase piloto
  };
}
```

---

## 7. REQUISITOS DE TEST (EVIDENCIA-BASADOS)

### 7.1 Tests Obligatorios para Merge a Main

| Test ID | Descripción | Evidencia Base | Criterio Aceptación |
|---------|-------------|----------------|---------------------|
| **TR-CI-01** | Caso Oaxaca Rural: scorecard ≥90 → SCALING | Ep.55 + FINGER + PubMed 39012673 | `evaluateCanutricioTranshumanismComprehensive` → `ready_for: 'scaling'` |
| **TR-CI-02** | Caso CDMX Enhancement: scorecard <70 → REJECTED | Matema 21.5 (prevención <80%) | `ready_for: 'rejected'`, blocker: `prevention_coverage <80%` |
| **TR-CI-03** | Edge autonomy ≥72h offline | Modelo INT8 <20MB, RPi 4 | `edge_autonomy_hours ≥ 72` en simulación |
| **TR-CI-04** | FL participation ≥80% con dropout 20% | Async FL tolerante | `federated_round_participation_pct ≥ 80` |
| **TR-CI-05** | Data locality 100% edge (cero nube) | LFPDPPP 2025 compliance | `data_locality_compliance_pct === 100` |
| **TR-CI-06** | Cultural adaptation ≥0.80 (corpus mixteco) | Validación lingüistas/antropólogos | `cultural_adaptation_score ≥ 0.80` |
| **TR-CI-07** | Flow state achievement ≥70% | Game design flow (Csikszentmihalyi) | `flow_state_achievement_rate ≥ 0.70` |
| **TR-CI-08** | Credencial Salud Universal API integration | gob.mx 2026 spec | `public_health_integration === true` |
| **TR-CI-09** | Cost <$10/usuario/año B2G | Modelo costos 6 componentes | `cost_per_user_year_usd ≤ 10` |
| **TR-CI-10** | Consentimiento VC revocable ≤24h | LFPDPPP 2025 | `withdrawal.max_time_hours ≤ 24` |

### 7.2 Ejecución Tests

```bash
# En repo Zeitnus:
npm test -- --testPathPattern="cognitiveInfrastructure"
# Casos de prueba:
# - Oaxaca Rural (Prevención): SCALING esperado ~90/100
# - CDMX Enhancement (Mejora): REJECTED esperado ~60/100
```

---

## 8. INTEGRACIÓN CON ESPECIFICACIONES EXISTENTES

| Spec | Integración | Archivos Afectados |
|------|-------------|-------------------|
| `pmcrt.md` | Nueva dimensión `cognitive_infrastructure` (11ª) en `TerritorialStateVector` | `src/core/lib/pmcrt.ts` |
| `canutriciotranshumanism.md` | Scorecard rebalanceado (100 pts), 11 nuevos indicadores | `src/core/lib/canutricioTranshumanism.ts` |
| `metabolicAccounting.md` | Cuenta `cognitive_infrastructure` (compute, neurodata, cultural capital) | `src/core/lib/materialBalance.ts` |
| `photosyntheticRegeneration.md` | Sinergia: O₂ fotosimbiótico → neuroplasticidad hipocampal | Casos combinados en tests |
| `solarpunk.ts` | `OfferExtended.resource_type: 'cognitive_stimulation'` | `src/core/lib/solarpunk.ts` |

---

## 9. ROADMAP DE IMPLEMENTACIÓN

| Fase | Entregable | Responsable | Criterio Done |
|------|------------|-------------|---------------|
| **0** | Dictamen legal: LFPDPPP 2025 neurodatos, COFEPRIS SaMD, LGSC cooperativa datos | Legal/Asamblea | 3 dictámenes escritos |
| **1** | Dimensión I en TerritorialStateVector + métricas base | Dev PMCRT | Tests TR-CI-01 a TR-CI-04 pass |
| **2** | Fondo Memoria VC operacional + Diseño Cuidado/Autotrofía cognitiva | Dev Memoria + Dev Cuidado | Tests TR-CI-05, TR-CI-08 pass |
| **3** | Piloto 3 nodos (CDMX/Oaxaca/Chiapas) + B2G API gob.mx | Dev Core + Legal | Tests TR-CI-01 a TR-CI-10 pass |
| **4** | Evaluación federada + Decisión Asamblea D11-D16 | Asamblea | Métricas Fase 1 vs 4, decisión escalar |

---

## 10. REFERENCIAS (RAO Ancladas)

```bibtex
@article{JaureguiSanchez2026,
  title={Infraestructura Cognitiva para la Vejez en América Latina},
  author={Jáuregui-Sánchez, Moisés},
  journal={AIVerso / LinkedIn},
  year={2026},
  month={april},
  day={10},
  note={Ep.55 - Paradoja tecnológica envejecimiento AL, Edge AI, FL, diseño cultural}
}

@article{Neuroplasticity2024,
  title={Cognitive interventions increase hippocampal volume in older adults},
  author={PubMed 39012673},
  journal={Neurobiology of Aging},
  year={2024},
  note={Reversión atrofia edad relacionada, >65 años}
}

@study{FINGER2015,
  title={Finnish Geriatric Intervention Study to Prevent Cognitive Impairment and Disability (FINGER)},
  author={Ngandu et al.},
  institution={National Institute for Health and Welfare, Finland},
  year={2015},
  note={25-30% reducción deterioro cognitivo 2 años, multimodal}
}

@policy{CredencialSaludMexico2026,
  title={Decreto para crear el Servicio Universal de Salud - Credencialización personas 85+ años},
  author={Presidencia México / Claudia Sheinbaum},
  year={2026},
  month={april},
  day={13-30}
}

@article{FlowState1990,
  title={Flow: The Psychology of Optimal Experience},
  author={Csikszentmihalyi, M.},
  year={1990},
  note={Estado de flow: equilibrio desafío/habilidad, ajuste dinámico dificultad}
}

@doc{RAO:cognitiveInfrastructure:20261020:001,
  title={OpenSpec: Infraestructura Cognitiva para la Vejez en AL},
  version={1.0.0},
  date={2026-10-20},
  depends_on={RAO:pmcrt:20261020:002, RAO:canutriciotranshumanismo:20261020:001, RAO:photosyntheticRegeneration:20261020:001}
}
```

---

## 11. FIRMAS / APROBACIÓN

| Rol | Nombre/DID | Firma | Fecha |
|-----|------------|-------|-------|
| **Arquitecto PMCRT** | | | |
| **Líder Canutriciotranshumanismo** | | | |
| **Consejo Futuros (representante)** | | | |
| **Subcomité Reparación** | | | |
| **Asamblea (quórum ≥60%)** | | | |

> **Nota:** Este documento entra en vigor tras aprobación Asamblea y firma de 3/5 roles mínimos. Versión 1.0.0 = borrador para revisión.