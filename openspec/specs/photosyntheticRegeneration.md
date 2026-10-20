// openspec/specs/photosyntheticRegeneration.md
// OpenSpec: Regeneración Fotosimbiótica — Evidencia experimental y marco operativo

# SPEC: photosyntheticRegeneration
**Version:** 1.0.0
**Status:** Draft
**Capa:** 1 (Contable-Física) + 2 (Interoperabilidad) + 3 (Membrana Fiat) + 4 (Aplicación)

---

## 1. RESUMEN EJECUTIVO

La **Regeneración Fotosimbiótica** es la aplicación clínica y de biofabricación de microorganismos fotosintéticos (microalgas, cianobacterias, cloroplastos aislados) para resolver la hipoxia tisular, entregar factores de crecimiento, gestionar residuos metabólicos y habilitar la autotrofía humana progresiva.

**Evidencia ancla:**
- Aoki et al. 2024: Cloroplastos *Cyanidioschyzon merolae* en CHO-K1, PSII funcional ≥48h
- NCT03960164: *Chlamydomonas reinhardtii* en andamios dérmicos humanos, Fase 1, 90 días, regeneración completa, sin respuesta inmune adversa
- Gleizer et al. 2019: *E. coli* autótrofo completo (CO₂ → biomasa) vía Rubisco + Prk + evolución adaptativa

---

## 2. RECURSOS FOTOSIMBIÓTICOS (Catálogo)

| Recurso | Especie/Componente | Unidad | PSII_lifetime_days | Light_requirement | Immune_evasion | Clinical_phase |
|---------|-------------------|--------|-------------------|-------------------|----------------|----------------|
| `chloroplast_battery` | *C. merolae* cloroplastos aislados | Fv/Fm_days | 2 (ex vivo) / 6 (4°C almacenamiento) | surface / interstitial | PEGylated / CD47 | 0 |
| `photosynthetic_scaffold` | *C. reinhardtii* en hidrogel/andamio | cm² | 90+ (in vivo) | surface / fiber_optic | low_immunogenic_strain | 1 |
| `algal_biomass` | *Chlorella* BDH-1 / *Chlorococcum* | g/L | continuo (bioreactor) | bioreactor | encapsulated | 0 |
| `oxygen_service` | *Synechococcus* intramiocárdico | mmol O₂/min | agudo (minutos) | N/A (inyección directa) | encapsulated | 0 |

---

## 3. MÉTRICAS OBLIGATORIAS POR RECURSO

### 3.1 Chloroplast Battery (Cloroplastos aislados)
```typescript
interface ChloroplastBatteryMetrics {
  PSII_lifetime_days: number;           // ≥ 2 (actual) → target 7
  storage_stability_days_at_4C: number; // ≥ 6 (Percoll + almidón maíz)
  Fv_Fm_initial: number;                // ≥ 0.75
  Fv_Fm_after_storage: number;          // ≥ 0.65
  carbon_fixation_rate: number;         // mmol CO₂/gDW/h (target >0)
  ROS_scavenging_capacity: number;      // anti-oxidant equivalents
  lipidomic_plastoquinone_ratio: number; // estabilidad membrana
}
```

### 3.2 Photosynthetic Scaffold (Andamios con algas vivas)
```typescript
interface PhotosyntheticScaffoldMetrics {
  O2_production_rate_mmol_cm2_h: number;    // ≥ 0.5 (heridas)
  VEGF_secretion_rate_pg_cell_day: number;  // si ingenierada
  immune_response_score: number;            // 0-10 (0 = none)
  tissue_regeneration_rate_mm_day: number;  // ≥ 1 (dérmica)
  light_penetration_efficiency: number;     // % superficie → profundidad
  algal_viability_days_in_vivo: number;     // ≥ 90 (NCT03960164)
}
```

### 3.3 Algal Biomass (Fotobiorreactores)
```typescript
interface AlgalBiomassMetrics {
  biomass_productivity_g_L_day: number;     // ≥ 1.5 (Chlorella)
  protein_content_percent: number;          // 50-60%
  omega3_content_mg_g: number;              // ≥ 200
  glucose_competition: boolean;             // false (BDH-1)
  pH_stabilization: boolean;                // true (consume lactato/amonio)
  FBS_reduction_percent: number;            // 50% (BDH-1)
  culture_longevity_multiplier: number;     // 3x (BDH-1)
}
```

---

## 4. APLICACIONES CLÍNICAS Y DE BIOFABRICACIÓN

### 4.1 Jerarquía Canutriciotranshumanista (Prevención → Curación → Mejora)

| Prioridad | Aplicación | Recurso | Evidencia | Scorecard Mínimo |
|-----------|------------|---------|-----------|------------------|
| **1. Prevención** | Úlceras diabéticas / pie diabético | `photosynthetic_scaffold` (*C. reinhardtii*) | NCT03960164 | 70 (pilot) |
| **1. Prevención** | Preservación órganos trasplante | `algal_biomass` (*Chlorella* peritoneal) | Rata páncreas >1 semana | 70 (pilot) |
| **2. Curación** | Infarto miocárdico agudo | `oxygen_service` (*Synechococcus* intramiocárdico) | Rata isquemia → función ↑ | 75 (pilot) |
| **2. Curación** | Heridas crónicas vasculares | `photosynthetic_scaffold` + VEGF | *C. reinhardtii* CRISPR VEGF | 75 (pilot) |
| **3. Mejora** | Biofabricación órganos 3D >500μm | `algal_biomass` + `chloroplast_battery` | *Chlorococcum* cardíaco 160μm | 85 (scaling) |
| **3. Mejora** | Organoides hiPSC fotosimbióticos | `chloroplast_battery` + ingeniería genética | Planimales IV.C | 85 (scaling) |
| **3. Mejora** | Soporte vital espacial / ambientes extremos | `photosynthetic_scaffold` + `algal_biomass` | Planimales II, IV.C | 85 (scaling) |

---

## 5. GOBERNANZA CANUTRICIOTRANSHUMANISTA ESPECÍFICA

### 5.1 Consentimiento VC Específico
```typescript
interface PhotosyntheticConsent extends DataRightsPlan['consent'] {
  vc_credential_id: string;
  categories: [
    'chloroplast_genomics',      // genoma cloroplástico
    'host_transcriptomics',      // RNA-seq huésped (6/24/48h)
    'isotope_metabolomics',      // ¹³C-bicarbonato tracing
    'CLEM_imaging',              // ultraestructura subcelular
    'immune_monitoring'          // C3a, C5a, citocinas
  ];
  expiry_days: 180;  // más frecuente por riesgo inmunológico
  revocation_triggers: [
    'adverse_immune_event',
    'loss_PSII_function',
    'unexpected_genomic_integration'
  ];
}
```

### 5.2 Herencia Específica
```typescript
interface PhotosyntheticInheritance extends DataRightsPlan['inheritance'] {
  chloroplast_protocols: 'open_license';      // aislamiento, almacenamiento, CLEM
  algal_strain_protocols: 'open_license';     // cultivo BDH-1, *Chlorococcum*, etc.
  CRISPR_constructs: 'open_license';          // Rubisco, Prk, LLO inducible, VEGF
  organoid_protocols: 'open_license';         // hiPSC + cloroplastos
  enhancement_organoids: 'no_privilege';      // organoides fotosimbióticos NO dan acceso preferente
  clinical_trial_data: 'aggregated_anonymous_only'; // datos pacientes → solo agregados
}
```

### 5.3 Consejo de Futuros — Criterios de Veto Específicos
```typescript
interface PhotosyntheticCouncilVeto extends TranshumanismGovernance['council_future_veto'] {
  veto_triggers: [
    'PSII_lifetime < 2 days in vivo',           // umbral metabólico
    'immune_response_score > 5',                // umbral seguridad
    'carbon_fixation_rate = 0 after 30 days',   // umbral autotrofía
    'genomic_integration_off_target > 0.1%',    // umbral seguridad genómica
    'light_requirement > surface_accessible'    // umbral factibilidad
  ];
  suspension_period_days: 60;  // más corto por riesgo clínico
  appeal_process: 'specialized_jury';  // biólogos + éticos + reguladores
}
```

---

## 5. CONTABILIDAD METABÓLICA ESPECÍFICA

### 5.1 Identidad de Balance para Fotobiorreactor
```
Entradas:
  - Luz (μmol fotones/m²/s) → energía
  - CO₂ (mmol/L) → carbono
  - H₂O (L) → medio
  - Nutrientes (N, P, K, trazas) → biomasa
  - Cloroplastos/algas inóculo (células/mL)

Salidas:
  - Biomasa algal (g/L) → producto
  - O₂ (mmol/L) → producto (oxigenación)
  - Metabolitos (lactato↓, amonio↓, pH estabilizado) → servicio
  - Factores crecimiento (VEGF, PDGF, SDF-1) → producto (si ingenierada)
  - Residuos: biomasa muerta, exudados
  - Emisiones: O₂ excedente, calor
  - ΔStocks: biomasa viva, cloroplastos funcionales
  - Diff_no_explicada: ≤ 5%
```

### 5.2 Cuentas Separadas (Extensión)
| Cuenta | Unidad | Qué registra |
|--------|--------|--------------|
| **Fotones** | μmol/m²/s | Luz incidente, absorbida, eficiencia cuántica |
| **Carbono inorgánico** | mmol CO₂/L | Disuelto, fijado, excretado |
| **Oxígeno disuelto** | mg/L / mmHg | Producido, consumido por huésped, difundido |
| **Biomasa viva** | g/L / células/mL | Algas, cloroplastos, células huésped |
| **Factores crecimiento** | pg/mL/día | VEGF, PDGF, SDF-1, otros |
| **Inmunogenicidad** | Score 0-10 | C3a, C5a, citocinas, histología |

---

## 6. LÍMITES PLANETARIOS Y REGENERACIÓN

| Límite Planetario | Impacto Fotosimbiótico | Métrica Contable |
|-------------------|------------------------|------------------|
| Cambio climático | Secuestro CO₂ biológico | `net_kg_CO2e < 0` (negativo = regeneración) |
| Integridad biosfera | Algas vs cultivos terrestres | `land_use_avoided_ha` |
| Agua dulce | Fotobiorreactores cerrados | `water_recycling_ratio > 0.9` |
| Flujos N/P | Algas consumen N/P residuales | `N_P_removal_kg_year` |
| Entidades novedosas | GMOs algales contenidos | `containment_level: physical/biological` |
| Uso de suelo | Vertical farming / bioreactores | `land_use_fraction < 0.01` |

**Regeneración neta obligatoria:** `EcologicalImpactScore > 0` para cualquier intervención enhancement.

---

## 7. IMPLEMENTACIÓN TÉCNICA PMCRT

### 7.1 Archivos a crear/modificar
| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/core/lib/pmcrt.ts` | EXTENDER | Añadir `PhotosynthesisMetrics` a `TerritorialStateVector` |
| `src/core/lib/canutricioTranshumanism.ts` | ACTUALIZAR | Scorecard con métricas fotosimbióticas |
| `src/core/lib/solarpunk.ts` | EXTENDER | `OfferExtended.resource_type` fotosimbióticos |
| `src/core/lib/materialBalance.ts` | EXTENDER | Balance fotobiorreactor |
| `openspec/specs/photosyntheticRegeneration.md` | CREAR | Este documento |
| `tests/photosyntheticRegeneration.test.ts` | CREAR | Tests casos NCT03960164, Aoki2024, Gleizer2019 |

### 7.2 Tests Requeridos
```typescript
// tests/photosyntheticRegeneration.test.ts
describe('Regeneración Fotosimbiótica', () => {
  test('Caso NCT03960164: scorecard ≥ 85 → scaling', () => {
    const proposal = createDermalScaffoldProposal();
    const result = evaluateCanutricioTranshumanismComprehensive(proposal, state, scenarios);
    expect(result.summary.ready_for).toBe('scaling');
    expect(result.overall.scorecard.total_score).toBeGreaterThanOrEqual(85);
  });

  test('Caso Aoki2024: chloroplast_battery PSII ≥ 2d → pilot', () => {
    const proposal = createCHO_K1_ChloroplastProposal();
    const result = evaluateCanutricioTranshumanismComprehensive(proposal, state, scenarios);
    expect(result.summary.ready_for).toBe('pilot');
  });

  test('Caso Gleizer2019: carbon_fixation > 0 → metabolic bonus', () => {
    const validation = validateTranshumanismMetabolic(proposal.metabolic_impact, state);
    expect(validation.blockers).not.toContain('carbon_fixation');
  });

  test('matchOffersNeeds: chloroplast_battery en cold_chain', () => {
    const matches = matchOffersNeeds(offers, needs);
    expect(matches.find(m => m.resource_type === 'chloroplast_battery')).toBeDefined();
  });
});
```

---

## 8. INDICADORES DE ÉXITO (Cuadro de Mando Fotosimbiótico)

| Dimensión | Indicador | Target | Frecuencia |
|-----------|-----------|--------|------------|
| **Metabólica** | `Chloroplast_PSII_lifetime_days` | ≥ 7 | continua |
| **Metabólica** | `Carbon_fixation_rate_mmol_gDW_h` | > 0 | semanal |
| **Cibernética** | `CLEM_monitoring_uptime` | ≥ 95% | diaria |
| **Cibernética** | `Retrograde_signaling_detected` | Boolean | por experimento |
| **Gobernanza** | `Clinical_trial_phase_advanced` | Fase 2 iniciada | anual |
| **Gobernanza** | `Immune_evasion_strategies_validated` | ≥ 2 | por recurso |
| **Cuidado** | `Hypoxic_wounds_healed_percent` | ≥ 80% | mensual |
| **Cuidado** | `Organ_preservation_extension_hours` | ≥ 168 | por órgano |
| **Autotrofía** | `Algal_biomass_food_supplement_kg_person_year` | ≥ 50 | anual |
| **Memoria** | `Genomic_integration_stability_offtarget` | < 0.1% | por línea |

---

## 9. REFERENCIAS PRIMARIAS (RAO-ancladas)

| RAO | Referencia | Tipo |
|-----|------------|------|
| `RAO:paper:aoki2024:001` | Aoki et al. 2024. Photosynthetic animal cells... | Paper |
| `RAO:paper:gleizer2019:001` | Gleizer et al. 2019. Conversion of E. coli... | Paper |
| `RAO:paper:matsunaga2018:001` | Matsunaga 2018. Planimal Cells... | Paper |
| `RAO:paper:goto2024:001` | Goto et al. 2024. Diamond knife notch... | Paper |
| `RAO:clinicaltrial:nct03960164:001` | NCT03960164. Photosynthetic Scaffolds... | Ensayo clínico |
| `RAO:integration:20261020:001` | Este documento | Integración |

---

## 10. VASOS COMUNICANTES

| Skill/Spec | Qué fluye |
|------------|-----------|
| `hscsg-asamblea-gobernanza` | Parámetros D9-D12: PSII_lifetime_target, immune_evasion_required, clinical_phase_gate |
| `hscsg-monetary-integration` | v1.9: cuentas fotones, carbono inorgánico, O₂ disuelto, biomasa viva |
| `hscsg-autotrofia-disenador` | 7 generaciones → horizonte autotrofía completa (fixación CO₂ nuclear) |
| `hscsg-viabilidad-territorial` | TerritorialSovereigntyIndex + dimensión Photosynthesis |
| `pmcrt.md` | Vector estado 10 dimensiones (W,F,E,H,C,M,B,G,L,**P**) |
| `metabolicAccounting.md` | Cuentas fotones, carbono inorgánico, O₂, biomasa, factores crecimiento |

---

> **"La fotosíntesis no es de las plantas. Es de la vida. La endosimbiosis nos enseñó que los reinos se prestan sus superpoderes. Ahora nos toca a nosotros ingeniar el préstamo, medir el interés, y devolver con regeneración."** — Matema 21.5