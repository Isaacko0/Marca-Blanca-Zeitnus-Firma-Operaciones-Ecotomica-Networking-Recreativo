# Integración HSCSG: Brand Strategy Suite → Marca-Blanca
**Triple Perspectiva:** Usuario / LLM / HSCSG+CaaS
**Metodología:** Unified Assimilation Science v15

---

## 1. PERSPECTIVA USUARIO (Isaac Ko — Founding Dean)

### Objetivo
Tener un **Brand Workbench** único donde:
- Crear/editar BranDNA de cualquier marca (happpy.mba, Soul.MBA, clientes)
- Generar campañas completas con demos reales (Deck, IG, Stories, Diplomas)
- Mantener consistencia visual/voz across all touchpoints
- Exportar assets listos para producción (SVG, CSS, Markdown)

### Dolor Actual
- Brand DNA disperso en 3 dashboards separados
- Campañas manuales, inconsistentes, sin specs
- Voz diluida al delegar a equipo/IA
- Assets recreados desde cero cada vez

### Resultado Deseado
```
Brand Workbench
├── BranDNA Editor (visual + texto)
├── Campaign Composer (multi-agente IA)
├── Asset Library (SVG, CSS, specs)
├── Voice Playground (prueba tonos)
└── Export Hub (ZIP listo para producción)
```

---

## 2. PERSPECTIVA LLM (Agentes de Contento)

### Arquitectura Multi-Agente Requerida
```
CampaignComposer (Orquestador)
├── Agent 1: Entrevista (Carácter → Offer Stack → Mensaje → Campaign Map)
├── Agent 2: BranDNA (70 signos → 49 preguntas)
├── Agent 3: Offer Stack (4 ofertas + precios + escalera)
├── Agent 4: Mensaje (8 piezas + vocabulario + así/así no)
└── CampaignMap (6+ piezas, ritmo alternado, 7 piezas campaña)
```

### Contratos de Entrada/Salida por Agente

**Agent 1 — Entrevista**
```typescript
Input: { rawMaterial: string, mode: 'rapid' | 'full' }
Output: {
  character: CharacterSigns[],
  offerStack: Offer[],
  message: MessagePieces[],
  campaignMap: CampaignPiece[]
}
```

**Agent 2 — BranDNA**
```typescript
Input: { answers: Answer[49], existingDNA?: BranDNA }
Output: BranDNA { signature, villain, category, differentiator, brain: BrainSign[70] }
```

**Agent 3 — Offer Stack**
```typescript
Input: { brandDNA: BranDNA, pricingContext: PricingContext }
Output: OfferStack { offers: Offer[4], ladder: LadderStep[] }
```

**Agent 4 — Mensaje**
```typescript
Input: { brandDNA: BranDNA, offerStack: OfferStack }
Output: MessageKit { pieces: MessagePiece[8], vocabulary: VocabRules, doDont: DoDont[] }
```

**CampaignMap**
```typescript
Input: { messageKit: MessageKit, offerStack: OfferStack, rhythm: 'alternating' | 'clustered' }
Output: CampaignMap { pieces: CampaignPiece[6+], campaign: CampaignPiece[7] }
```

### Protocolo de Coordinación (ACP - Agent Communication Protocol)
- **filter:** Validación de esquema antes de pasar al siguiente agente
- **emit:** Eventos `agent.completed`, `agent.failed`, `workflow.paused`
- **state:** Persistencia en `store.brandWorkflow` con checkpoints

---

## 3. PERSPECTIVA HSCSG + CaaS (Sistema Alráico)

### Isomorfismo con Leyes del Sistema Alráico

| Ley Alráica | Implementación en Brand Suite |
|-------------|-------------------------------|
| **Ley I — Identidad** | `BranDNA` = huella única inmutable (70 signos = CDS) |
| **Ley II — Relación** | `VoiceEngine` = protocolo de comunicación (Voz = IE) |
| **Ley III — Transformación** | `CampaignComposer` = motor de transformación (IA × IE) |
| **CaaS** | `BrandCollateral` = contribución verificada (assets = RAO) |
| **ZNU** | `BrandAsset.render()` = modo anfibio (SVG/CSS/MD) |
| **CDS → OAD → COS → ITC → FRS** | Flujo: BranDNA → Voice → Campaign → Assets → Export |

### Vasos Comunicantes Obligatorios (Cross-Repo)

| Módulo Brand | Conecta con Módulo HSCSG | Protocolo |
|--------------|--------------------------|-----------|
| `BranDNA` | `hscsg-dna.ts` | `dna.encode()/decode()` |
| `VoiceEngine` | `zeitnus-ie.ts` | `ie.speak()/listen()` |
| `CampaignComposer` | `alrac-loop.ts` | `loop.execute()` |
| `BrandCollateral` | `rao-ledger.ts` | `rao.record()` |
| `SocialAssetSpecs` | `contento-specs.ts` | `specs.validate()` |
| `StoryBrandEngine` | `storybrand.ts` | `sb.render()` |

### Estructura de Módulos HSCSG (Nuevos)

```
src/core/
├── state/
│   ├── brand-color-system.ts      # Trío + semáforo + secundarios + crepúsculo
│   ├── brand-typography.ts        # Dual + roles + acentos + specs
│   ├── brand-dna.ts               # 70 signos + villain + signature + brain
│   ├── brand-voice.ts             # Arquetipo + rasgos + vocabulario + do/dont
│   ├── storybrand-engine.ts       # 7 pasos StoryBrand + alternatives
│   ├── social-asset-specs.ts      # Deck/Carrusel/Post/Stories/Diploma/Papel/Campaña
│   ├── brand-collateral.ts        # Assets generados + RAO + export
│   ├── multi-agent-wizard.ts      # 4 agentes + CampaignMap + ACP
│   └── brand-workflow.ts          # Estado workflow + checkpoints + ACP
├── lib/
│   ├── brand-color-system.ts      # Lógica pura: buildPalettes, renderColor, validate
│   ├── brand-typography.ts        # buildRoles, renderFont, getSpecs
│   ├── brand-dna.ts               # validateSigns, computeBrainScore, mergeAnswers
│   ├── brand-voice.ts             # buildArchetype, checkTone, filterVocabulary
│   ├── storybrand-engine.ts       # buildScript, renderOneLiner, validate
│   ├── social-asset-specs.ts      # buildSpecs, validateAsset, renderDemo
│   ├── brand-collateral.ts        # generateAssets, recordRAO, exportBundle
│   ├── multi-agent-wizard.ts      # runAgent, coordinate, checkpoints
│   └── brand-workflow.ts          # persistWorkflow, resume, emitEvents
└── components/
    ├── TriquetaSpinner.tsx        # 34s loop, 6 variantes SVG
    ├── BrandColorPicker.tsx       # Trío + semáforo + copy hex
    ├── BrandFontSelector.tsx      # Dual + roles + preview
    ├── VoicePlayground.tsx        # Prueba tonos + vocabulario
    ├── CampaignComposer.tsx       # Multi-agent wizard UI
    ├── AssetLibrary.tsx           # Grid SVG/CSS/MD + export
    └── BrandWorkbench.tsx         # Pantalla principal /brand-workbench
```

### CaaS — Contribuciones Verificadas (RAO)

Cada asset generado lleva procedencia:
```typescript
interface BrandRAO {
  assetId: string;           // hash del contenido
  origin: 'wizard' | 'manual' | 'import';
  author: { did: string; role: 'dean' | 'agent' | 'client' };
  brandDNA: BranDNAHash;     // vincula al BranDNA fuente
  voiceHash: VoiceHash;      // voz usada
  campaignMap: CampaignHash; // mapa campaña
  timestamp: ISO8601;
  signatures: Ed25519[];     // firma de autor + validador
}
```

### ZNU / Anfibio — Render Dual

Todos los componentes/asset exportan modo anfibio:
```typescript
interface AmphibiousRender {
  mode: 'postmonetario' | 'conectado';
  priceParity: number;        // 0.02 ZNU/USD default
  render: {
    svg: string;              // vector puro
    css: string;              // variables + clases
    markdown: string;         // doc + frontmatter
    json: BrandAssetJSON;     // datos estructurados
  }
}
```

---

## Mapeo Isomórfico Completo (Concepto → Módulo HSCSG)

| Concepto Fuente | Módulo HSCSG | Archivo State | Archivo Lib | Componente |
|-----------------|--------------|---------------|-------------|------------|
| Trío color (Vacío/Aliento/Chispa) | `BrandColorSystem` | `brand-color-system.ts` | `brand-color-system.ts` | `BrandColorPicker` |
| Semáforo 5 estados | `BrandColorSystem` | `brand-color-system.ts` | `brand-color-system.ts` | `StatusPill` |
| Secundarios reservados | `BrandColorSystem` | `brand-color-system.ts` | `brand-color-system.ts` | — |
| Crepúsculo (welcome/retiro/cierre) | `BrandColorSystem` | `brand-color-system.ts` | `brand-color-system.ts` | — |
| Dual tipografía (Jost/Manrope) | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | `BrandFontSelector` |
| 8 roles tipográficos | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | — |
| Acentos (Newsreader/Plus Jakarta) | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | — |
| Espacio (escala 2-110) | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | `SpaceBars` |
| Sombra (4 niveles) | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | `ShadowGrid` |
| Movimiento (1 curva, 3 números) | `BrandTypography` | `brand-typography.ts` | `brand-typography.ts` | `MotionDemo` |
| Triqueta (6 variantes) | `TriquetaSpinner` | — | `triqueta-spinner.ts` | `TriquetaSpinner` |
| Componentes 14 (4 grupos) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `ComponentGallery` |
| Deck (6 láminas) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `DeckFrame` |
| Carrusel IG (5 tarjetas) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `CarouselFrame` |
| Post IG (1080x1080) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `PostFrame` |
| Stories (zona segura 70%) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `StoryFrame` |
| Diplomas (triqueta tinta) | `BrandCollateral` | `brand-collateral.ts` | `brand-collateral.ts` | `DiplomaFrame` |
| Papelería (cara/dorso) | `BrandCollateral` | `brand-collateral.ts` | `brand-collateral.ts` | `StationeryPair` |
| Campaña (7 piezas ritmo) | `SocialAssetSpecs` | `social-asset-specs.ts` | `social-asset-specs.ts` | `CampaignMap` |
| BranDNA (70 signos) | `BrandDNA` | `brand-dna.ts` | `brand-dna.ts` | `DNAEditor` |
| Villano (3 caras) | `BrandDNA` | `brand-dna.ts` | `brand-dna.ts` | `VillainCard` |
| Arquetipo voz (Decano) | `BrandVoice` | `brand-voice.ts` | `brand-voice.ts` | `VoicePlayground` |
| 5 rasgos tonales | `BrandVoice` | `brand-voice.ts` | `brand-voice.ts` | `TraitCard` |
| Vocabulario (propósito vs pasión) | `BrandVoice` | `brand-voice.ts` | `brand-voice.ts` | `VocabFilter` |
| Frases de firma (6) | `BrandVoice` | `brand-voice.ts` | `brand-voice.ts` | `QuoteCard` |
| Así/Así no | `BrandVoice` | `brand-voice.ts` | `brand-voice.ts` | `DoDontGrid` |
| StoryBrand 7 pasos | `StoryBrandEngine` | `storybrand-engine.ts` | `storybrand-engine.ts` | `StoryBrandCard` |
| Alternativas vs SOUL.MBA | `StoryBrandEngine` | `storybrand-engine.ts` | `storybrand-engine.ts` | `AlternativeCard` |
| One-liners (4 candidatos) | `StoryBrandEngine` | `storybrand-engine.ts` | `storybrand-engine.ts` | `OneLinerCard` |
| Roadmap assets (18 items) | `StoryBrandEngine` | `storybrand-engine.ts` | `storybrand-engine.ts` | `RoadmapTable` |
| Agent 1: Entrevista | `MultiAgentWizard` | `multi-agent-wizard.ts` | `multi-agent-wizard.ts` | `Agent1Entrevista` |
| Agent 2: BranDNA | `MultiAgentWizard` | `multi-agent-wizard.ts` | `multi-agent-wizard.ts` | `Agent2BranDNA` |
| Agent 3: Offer Stack | `MultiAgentWizard` | `multi-agent-wizard.ts` | `multi-agent-wizard.ts` | `Agent3OfferStack` |
| Agent 4: Mensaje | `MultiAgentWizard` | `multi-agent-wizard.ts` | `multi-agent-wizard.ts` | `Agent4Mensaje` |
| Campaign Map (6+7) | `MultiAgentWizard` | `multi-agent-wizard.ts` | `multi-agent-wizard.ts` | `CampaignMapUI` |
| ACP Protocol | `MultiAgentWizard` | `brand-workflow.ts` | `brand-workflow.ts` | `WorkflowMonitor` |

---

## Qué Asimilar vs Qué Extirpar

### ✅ ASIMILAR (Lógica pura, patrones, specs)
- Sistema de color trifásico + semáforo + crepúsculo
- Tipografía dual + 8 roles + acentos
- Triqueta (geometría + animación 34s + 6 variantes)
- Espacio (escala 2-110, margen 10%, rejilla 2px)
- Sombra (4 niveles, una luz arriba-izquierda)
- Movimiento (1 curva cubic-bezier, 3 números: 420ms/70ms/140-200ms)
- Componentes 14 en 4 grupos (specs puras)
- Specs sociales exactas (Deck/Carrusel/Post/Stories/Diploma/Papel/Campaña)
- BranDNA 70 signos + villain 3 caras + signature
- Voz: arquetipo + 5 rasgos + vocabulario estricto + do/dont + frases
- StoryBrand 7 pasos + alternativas + one-liners + roadmap
- Multi-agent wizard (4 agentes + Campaign Map + ACP)

### ❌ EXTIRPAR (Infraestructura ajena, datos demo, UI propietaria)
- Dashboards React completos (happpy/Soul/Contento)
- Estados demo hardcodeados (power 71, misiones 71%)
- Datos de usuario específicos (Pepe Sevilla, cohorte 04, fechas)
- CSS de dashboards (layout, sidebar, rail, cmd bar)
- Wizard UI de Contento (pasos, progress dots, chips)
- Fuentes embebidas en CSS (WOFF2 base64)
- Iconos Lucide embebidos
- Datos de cliente reales (Laura, cohorte 2025)
- Power level, misiones, checkpoints UI

---

## KPIs de Validación por Módulo

| Módulo | KPI Técnico | KPI Funcional |
|--------|-------------|---------------|
| `BrandColorSystem` | `renderColor()` 100% match Soul.MBA specs | `BrandColorPicker` copy hex → clipboard |
| `BrandTypography` | `buildRoles()` 8 roles exactos | `BrandFontSelector` preview live |
| `TriquetaSpinner` | 34s loop exacto, 6 variantes SVG | `TriquetaSpinner` 34s loop visual |
| `BrandDNA` | 70 signos + 3 caras villain | `DNAEditor` 70/70 completado |
| `BrandVoice` | Vocab filter bloquea "pasión" → sugiere "propósito" | `VoicePlayground` tono live |
| `StoryBrandEngine` | 7 pasos + 4 one-liners + 18 roadmap | `StoryBrandCard` render exacto |
| `SocialAssetSpecs` | 7 specs (Deck/Carrusel/Post/Stories/Diploma/Papel/Campaña) | `AssetLibrary` export ZIP |
| `MultiAgentWizard` | 4 agentes + ACP + checkpoints | `CampaignComposer` workflow completo |
| `BrandCollateral` | Export ZIP con RAO + SVG/CSS/MD | `ExportHub` bundle listo |

---

## Plan de Implementación (Archivo por Archivo)

### Fase 3.1 — Core Types & Libs (Semana 1)
```
1. src/core/state/brand-color-system.ts      # Types + buildPalettes + renderColor
2. src/core/state/brand-typography.ts        # Types + buildRoles + renderFont
3. src/core/state/brand-dna.ts               # Types + validateSigns + computeBrain
4. src/core/state/brand-voice.ts             # Types + buildArchetype + filterVocab
5. src/core/state/storybrand-engine.ts       # Types + buildScript + validate
6. src/core/state/social-asset-specs.ts      # Types + buildSpecs + validateAsset
7. src/core/state/brand-collateral.ts        # Types + generateAssets + exportBundle
8. src/core/state/multi-agent-wizard.ts      # Types + runAgent + coordinate
9. src/core/state/brand-workflow.ts          # Types + persistWorkflow + ACP
10. src/core/lib/brand-color-system.ts       # Lógica pura
11. src/core/lib/brand-typography.ts         # Lógica pura
12. src/core/lib/brand-dna.ts                # Lógica pura
13. src/core/lib/brand-voice.ts              # Lógica pura
14. src/core/lib/storybrand-engine.ts        # Lógica pura
15. src/core/lib/social-asset-specs.ts       # Lógica pura
16. src/core/lib/brand-collateral.ts         # Lógica pura
17. src/core/lib/multi-agent-wizard.ts       # Lógica pura
18. src/core/lib/brand-workflow.ts           # Lógica pura
```

### Fase 3.2 — Componentes + Store Integration (Semana 2)
```
19. src/core/state/store.ts                  # Imports + State + Actions + Initial + Persist
20. src/components/TriquetaSpinner.tsx       # 34s loop, 6 variantes
21. src/components/BrandColorPicker.tsx      # Trío + semáforo + copy
22. src/components/BrandFontSelector.tsx     # Dual + roles + preview
23. src/components/VoicePlayground.tsx       # Tono live + vocabulario
24. src/components/CampaignComposer.tsx      # Multi-agent wizard UI
25. src/components/AssetLibrary.tsx          # Grid + export ZIP
26. src/components/BrandWorkbench.tsx        # Pantalla /brand-workbench
```

### Fase 3.3 — Routing + i18n + Tests (Semana 3)
```
27. src/app/screens/BrandWorkbench.tsx       # Pantalla completa
28. src/app/Aside.tsx                        # Icono + ruta /brand-workbench
29. src/app/App.tsx                          # Ruta nueva
30. src/core/lib/i18n.ts                     # 200+ claves ES/EN/PT
31. src/core/lib/brand-color-system.test.ts  # 100% paletas Soul.MBA
32. src/core/lib/brand-typography.test.ts    # 8 roles + specs
33. src/core/lib/brand-dna.test.ts           # 70 signos + brain score
34. src/core/lib/brand-voice.test.ts         # Vocab filter + tono
35. src/core/lib/storybrand.test.ts          # 7 pasos + one-liners
36. src/core/lib/social-asset.test.ts        # 7 specs validación
37. src/core/lib/multi-agent.test.ts         # 4 agentes + ACP
38. src/core/lib/brand-collateral.test.ts    # Export ZIP + RAO
```

### Fase 3.4 — Verificación Final
```
- npx tsc --noEmit                          # 0 errores
- npm run build                             # Build exitoso
- npm run preview                           # HTTP 200 /brand-workbench
- npx vitest run                            # 100% tests pass
- Manual: crear BranDNA happpy.mba → generar campaña → export ZIP
```

---

## Checklist de Completitud (Definition of Done)

- [ ] 9 módulos state creados con `makeXState()` pattern
- [ ] 9 libs puras sin dependencias UI
- [ ] 7 componentes React funcionales
- [ ] Store integrado (imports, state, actions, initial, persist)
- [ ] Ruta `/brand-workbench` accesible desde Aside
- [ ] 200+ claves i18n ES/EN/PT
- [ ] 10 tests críticos pasando (100% coverage en libs puras)
- [ ] Build + preview + tests = 0 errores
- [ ] Demo end-to-end: BranDNA → Campaign → Export ZIP verificado
- [ ] Documentación actualizada en `docs/brand_workbench.md`

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Complejidad multi-agente ACP | Alta | Alto | Prototipar ACP primero en `brand-workflow.ts` solo |
| Triqueta 34s loop performance | Media | Bajo | `requestAnimationFrame` + `will-change: transform` |
| Export ZIP grande (>10MB) | Media | Medio | Streaming zip (JSZip stream) + lazy load assets |
| i18n 200+ claves mantenimiento | Media | Medio | Script auto-extract + CSV sync |
| Multi-agent wizard estado complejo | Alta | Alto | Checkpoints persistentes cada agente |
| Triqueta 6 variantes SVG sync | Baja | Medio | Single source: `triqueta-svg.ts` + variants config |
| VoiceEngine vocab filter false positives | Media | Medio | Lista blanca + testing extensivo |
| CaaS RAO firma Ed25519 | Media | Alto | Lib `noble-ed25519` + test vectors |

---

## Próxima Acción Inmediata

**Crear `src/core/state/brand-color-system.ts`** — punto de entrada más simple, valida el pattern `makeXState()` y establece la base para todos los módulos siguientes.

¿Procedo con la implementación fase 3.1?