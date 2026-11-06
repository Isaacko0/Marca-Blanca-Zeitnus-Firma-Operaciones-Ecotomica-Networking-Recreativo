# Veritas Villages — Integración en Zeitnus/HSCSG

**Repo origen**: Artículo editorial (no código) — Asimilación de **patrones vivos** y **isomorfismos**  
**Módulo HSCSG objetivo**: `veritasVillages` (pantalla + estado + lógica)  
**Rol en Zeitnus**: **Potencial de órgano "Sistema Circulatorio + Gobernanza Contractual"** — comunidad real con infra off-grid, DAO quadratic voting, Bitcoin standard, hedge cross-jurisdicción. Candidata a **handshake generativo** con Zeitnus (Capa 0).

---

## Triple Perspectiva

### 1. Usuario (Isaac Ko / Nodo Zeitnus)
> "Quiero conectar Veritas Villages como **potencial de órgano real** en la red Zeitnus. Ya tienen: gobernanza algorítmica (DAO quadratic), infra off-grid (solar/agua/comida), Bitcoin standard, red cross-border (4 aldeas, 3 países), hedge político. Les falta: contabilidad biofísica (TQ=1kWh), producción metabólica densa (Spirulina/canutricio), mesh networking, destrabajo algorítmico, scorecard longevidad. El handshake generativo Zeitnus v2.0 les daría APIs TQ nativas para gobernar metabolismo, y a Zeitnus le daría un potencial de órgano 'circulatorio+gobernanza' ya operativo con 100+ familias."

**Casos de uso concretos**:
- Propietario Veritas opera Kit 72H Zeitnus → aprende a medir TQ en biomasa → su DAO vota autorizaciones de cosecha via API TQ
- Nodo Zeitnus (Zamora/Oaxaca) opera Kit Veritas → aprende quadratic voting DAO → su gov añade módulo quadratic voting para decisiones metabólicas
- Cross-village TQ ledger: 4 aldeas + nodos Zeitnus = red metabólica multi-jurisdicción

### 2. LLM (Qué Asimilar / Qué Extirpar)

| **ASIMILAR (Lógica Pura → Módulo HSCSG)** | **EXTIRPAR (Infra Ajena / No Portátil)** |
|-------------------------------------------|------------------------------------------|
| • DAO quadratic voting algorithm (100 tokens/año, costo n²) | • Estructura legal HOA/DAOs en jurisdicciones específicas (Panamá/CR/NI) |
| • Bitcoin standard enforcement logic (comercio debe aceptar BTC) | • Hipotecas vendedor BTC con interés negativo (producto financiero regulado) |
| • Off-grid infrastructure specs (solar, agua, residuos, comida) | • Tributación territorial por país (ley local, no lógica portable) |
| • Cross-village access protocol (club membership → services) | • Entidad legal Autris Group (OTC: AUTR, raise $30M, corporate) |
| • F.I.R.S.T. principles as governance constraints | • Due diligence legal/financiero (disclaimer: no asesoría) |
| • Incremental autonomy strategy (proof → ask) | • Nicaragua political risk assessment (Ortega confiscations) |
| • Real estate + community hybrid model | • US citizen tax complications (FEIE, worldwide income) |
| • Metrics: 100+ homes sold, $1.18M revenue, $44M assets | • Press release financials (no auditados) |

### 3. HSCSG + CaaS (Isomorfismo Leyes I/II/III + CaaS)

| Ley / Principio | Isomorfismo en Veritas Villages | Mapeo a Módulo HSCSG |
|----------------|--------------------------------|---------------------|
| **Ley I: No dañar base material/personas** | Infra off-grid = soberanía material (agua, energía, comida, residuos). No dependen de red estatal. DAO quadratic = no facción domina (protege minorías). | `veritasVillages.offGridSpecs` — specs como base material mínima por habitante. `veritasVillages.quadraticVoting` — protección minorías via intensidad preferencia. |
| **Ley II: Ganarse la vida soberanizando (AUT×CDS)** | Bitcoin standard = soberanía monetaria. Hipotecas -1.9% = incentivo ahorro/appreciation BTC. Cross-village hedge = redundancia jurisdiccional (CDS). F.I.R.S.T. = resiliencia + sostenibilidad = AUT. | `veritasVillages.bitcoinStandard` — moneda soberana CaaS. `veritasVillages.crossVillageHedge` — CDS multi-jurisdicción. `veritasVillages.firstPrinciples` — métricas AUT/CDS por aldea. |
| **Ley III: Lucidez, nunca engañar** | DAO transparent (blockchain voting). Quadratic voting = revela intensidad real (no solo señal). Incremental strategy = muestra resultados antes de prometer. Disclaimer financiero explícito. | `veritasVillages.daoTransparency` — append-only voting ledger. `veritasVillages.incrementalProof` — métricas verificables antes de pedir autonomía. |
| **CaaS: Acceso por contribución real** | Propiedad = membresía club → acceso servicios. Tokens/año = contribución gobernanza (no dinero). Quadratic cost = skin-in-the-game real. | `veritasVillages.caaSAccess` — tokens gobernanza = crédito CaaS. `veritasVillages.contributionMetrics` — votos emitidos, propuestas, participación. |

---

## Tabla Mapeo Isomórfico (Concepto Origen → Módulo HSCSG → Ley/CaaS)

| Concepto Veritas | Módulo HSCSG | Ley I | Ley II | Ley III | CaaS |
|-----------------|-------------|-------|--------|---------|------|
| DAO Quadratic Voting | `quadraticVoting.ts` | ✓ (no dominación) | ✓ (gobernanza soberana) | ✓ (transparencia intensidad) | ✓ (tokens = contribución) |
| Bitcoin Standard | `bitcoinStandard.ts` | ✓ (infra monetaria propia) | ✓ (soberanía monetaria) | ✓ (ledger público) | ✓ (BTC = unidad CaaS Nivel 3) |
| Off-Grid Specs | `offGridSpecs.ts` | ✓ (base material) | ✓ (autotrofía energética/alimentaria) | ✓ (specs verificables) | ✓ (recursos = créditos CaaS) |
| Cross-Village Club | `crossVillageClub.ts` | ✓ (redundancia) | ✓ (CDS multi-jurisdicción) | ✓ (reglas claras) | ✓ (acceso federado) |
| F.I.R.S.T. Principles | `firstPrinciples.ts` | ✓ (resiliencia = no daño) | ✓ (sostenibilidad = AUT) | ✓ (transparencia) | ✓ (KPIs CaaS) |
| Incremental Autonomy | `incrementalAutonomy.ts` | ✓ (evita confrontación) | ✓ (autonomía demostrada) | ✓ (prueba antes de promesa) | ✓ (reputación CaaS) |
| Negative Rate Mortgages | `negativeRateMortgage.ts` | ⚠ (producto financiero) | ✓ (incentivo ahorro BTC) | ✓ (términos claros) | ✓ (crédito bilateral) |

---

## Qué Asimilar vs Qué Extirpar (Lista Explícita)

### ✅ ASIMILAR — Lógica Pura para Módulo `veritasVillages`

1. **`QuadraticVotingEngine`** — Algoritmo: 100 tokens/año, costo voto = n², tally ponderado, anti-facción
2. **`BitcoinStandardEnforcer`** — Lógica: comercio registrado → debe aceptar BTC; validación on-chain (lightning address / BTCPay)
3. **`OffGridSpecs`** — Specs mínimas por habitante: kWh solar/día, L agua/día, kg residuos/semana, kcal comida/día
4. **`CrossVillageProtocol`** — Membership NFT/token → acceso servicios aldea hermana; sync de reputación/gobernanza
5. **`FirstPrinciplesIndex`** — 5 dimensiones (F/I/R/S/T) con métricas cuantificables por aldea
6. **`IncrementalAutonomyStrategy`** — Estado: Proof → Metrics → Ask → Negotiate → Charter; plantilla replicable
7. **`VeritasMetrics`** — KPIs: casas vendidas, residentes, revenue, assets, BTC treasury, off-grid %

### ❌ EXTIRPAR — No Va al Módulo (Documentar en `backup.md` solo)

1. Estructura legal específica por país (Panamá/CR/NI HOA laws)
2. Producto hipotecario BTC -1.9% (regulado, requiere licencia)
3. Tributación territorial (ley local, no lógica)
4. Entidad Autris Group (corporate, OTC, raise capital)
5. Risk assessment Nicaragua (político, no portable)
6. US citizen tax complications (jurisdicción específica)
7. Financial press releases (no auditados, marketing)

---

## Isomorfismo Detallado Leyes I/II/III + CaaS

### Ley I — No Dañar Base Material / Personas
**Veritas**: Infra off-grid = cada aldea produce su base material (energía solar, agua pozo/lluvia, comida huertos/tilapia, residuos compost). DAO quadratic = decisión colectiva no puede ser capturada por facción (protege base social). Cross-village = redundancia: si una jurisdicción falla, otras sostienen.
**HSCSG**: `offGridSpecs` define **mínimos vitales por habitante** (kWh, L, kcal, kg residuos) — umbral abajo del cual el nodo NO es viable. `quadraticVoting` garantiza **decisiones metabólicas** (cosecha, energía, agua) no dominadas por minoría intensa. `crossVillageClub` = **redundancia CDS** multi-nodo.

### Ley II — Ganarse la Vida Soberanizando (AUT × CDS)
**Veritas**: Bitcoin standard = unidad de cuenta soberana (no fiat). Hipotecas -1.9% = incentivo acumular BTC (ahorro soberano). F.I.R.S.T. = Resilience + Sustainability = AUT operacional. Cross-village = CDS geográfico (3 países).
**HSCSG**: `bitcoinStandard` = **CaaS Nivel 3 ReFi** (priceParity BTC/USD via oracle). `firstPrinciplesIndex` = **scorecard AUT/CDS por aldea** (0-100 cada dimensión). `incrementalAutonomy` = **estrategia replicable** para cualquier potencial de órgano Zeitnus: demuestra → pide.

### Ley III — Lucidez, Nunca Engañar
**Veritas**: DAO en blockchain = append-only, auditable. Quadratic voting = revela **intensidad real** (no solo preferencia). Incremental strategy = **muestra resultados** (Coronado sold out) antes de pedir autonomía. Disclaimer explícito en artículo.
**HSCSG**: `daoTransparency` = **ledger TQ append-only** para votos/gobernanza. `quadraticVoting` = **mecánica lucidez** (costo n² = skin-in-the-game real). `incrementalAutonomy` = **protocolo verificación** (métricas antes de promesas).

### CaaS — Acceso por Contribución Real
**Veritas**: Propiedad = membresía → acceso. 100 tokens/año = contribución gobernanza. Quadratic cost = **contribución ponderada por intensidad**.
**HSCSG**: `caaSAccess` = **tokens gobernanza = créditos CaaS** (earning: participar, proponer, votar; spending: acceder servicios cross-village). `contributionMetrics` = **RAO-attributed** (cada voto/acción = RAO:veritas:voto:...).

---

## Vasos Comunicantes Cross-Repo (Módulo HSCSG ↔ Conexión ↔ Vaso Comunicante)

| Módulo HSCSG | Conexión Veritas | Vaso Comunicante (Primitivo CaaS) |
|--------------|------------------|-----------------------------------|
| `governance-triads.ts` | DAO quadratic → Triadas base-3 verification | `governance-triads` (verificación triada + RCE) |
| `caas-credits.ts` | Tokens gobernanza = créditos CaaS | `caas-credits` (earning/spending quadratic votes) |
| `identity-rao.ts` | Propietario = identidad + RAO atributos | `identity-rao` (RAO:veritas:owner:...) |
| `value-dual.ts` | BTC standard + priceParity oracle | `value-dual` (ZNU/BTC/USD ternary) |
| `autonomy-guard.ts` | Off-grid specs = offline-first viability | `autonomy-guard` (umbrales viabilidad offline) |
| `consensus-gossip.ts` | Cross-village sync = gossip protocol | `consensus-gossip` (mesh sync aldeas + nodos Zeitnus) |
| `pipeline-anidado.ts` | Incremental autonomy = CDS→OAD→COS→ITC→FRS loop | `pipeline-anidado` (loop integral aplicado a autonomía) |
| `zeitnus-handshake.ts` | Handshake generativo: Veritas ↔ Zeitnus nodo | `zeitnus-handshake` (Capa 0: transformación mutua) |

---

## Decisiones EBD (D1-D8) con Evidencia Primaria

| Decisión | Evidencia Primaria (Artículo) | Módulo Afectado |
|----------|------------------------------|----------------|
| **D1: Quadratic voting = gobernanza base** | "Un solo voto cuesta 1 token, dos votos 4, tres 9... permite demostrar qué tan profundamente les importa" | `quadraticVoting.ts` |
| **D2: Bitcoin standard obligatorio = moneda soberana CaaS Nivel 3** | "Todo negocio comercial DEBE aceptar Bitcoin... Autris mantiene BTC en tesorería + minera solar" | `bitcoinStandard.ts`, `value-dual.ts` |
| **D3: Off-grid specs = umbral viabilidad CaaS (Ley I)** | "Infraestructura con capacidad off-grid: solar, agua natural, tratamiento desechos, producción comunitaria comida" | `offGridSpecs.ts`, `autonomy-guard.ts` |
| **D4: Cross-village club = CDS multi-jurisdicción (Ley II)** | "Ser propietario en una te convierte en miembro... te permite utilizar servicios de todas... hedge político" | `crossVillageClub.ts`, `consensus-gossip.ts` |
| **D5: F.I.R.S.T. = scorecard 5D cuantificable** | "Libertad, Independencia, Resiliencia, Sostenibilidad, Transparencia... en la práctica significa infra off-grid + cultura desacuerdo respetuoso" | `firstPrinciplesIndex.ts` |
| **D6: Incremental autonomy = estrategia replicable Zeitnus** | "La respuesta es siempre: muéstrennos dónde han hecho una. Veritas Villages es esa prueba... mostrar resultados primero y luego pedir más autonomía" | `incrementalAutonomy.ts`, `pipeline-anidado.ts` |
| **D7: Negative rate mortgage = crédito bilateral CaaS (con caveats)** | "Compradores que pagan en BTC no pagan intereses... les pagan 1.9%... apuesta a que BTC se revalorizará" | `negativeRateMortgage.ts` (aislado, documentado como experimental) |
| **D8: Nicaragua risk = exclusión CaaS por confiscación propiedad** | "Ortega-Murillo ha expulsado opositores, cerrado ONG, confiscado propiedades (UCA 2023)... lo opuesto a hogar seguro" | `autonomy-guard.ts` (jurisdicción NI = excluded de CaaS) |

---

## KPIs y Tests Obligatorios

| Módulo | KPIs Mínimos | Test File |
|--------|-------------|-----------|
| `quadraticVoting` | • 100 tokens/año distribuidos<br>• Costo n² exacto<br>• Tally ponderado correcto<br>• Anti-facción: facción 20% no domina 80% | `quadraticVoting.test.ts` |
| `bitcoinStandard` | • Comercio registrado → valida BTC acceptance<br>• Lightning address / BTCPay verification<br>• PriceParity oracle sync < 5min | `bitcoinStandard.test.ts` |
| `offGridSpecs` | • Specs mínimas/habitante definidas<br>• Umbral viabilidad: < mínimos → `autonomyGuard` bloquea<br>• Métricas reales vs specs tracking | `offGridSpecs.test.ts` |
| `crossVillageClub` | • Membership token → acceso 4 aldeas<br>• Reputación/gobernanza sync cross-village<br>• Hedge: 1 jurisdicción down → 3 operativas | `crossVillageClub.test.ts` |
| `firstPrinciplesIndex` | • 5 dimensiones 0-100 cada una<br>• Score agregado AUT/CDS<br>• Benchmark: Veritas Coronado ≥ 80/100 | `firstPrinciplesIndex.test.ts` |
| `incrementalAutonomy` | • Estado machine: Proof→Metrics→Ask→Negotiate→Charter<br>• Métricas verificables antes de Ask<br>• Plantilla replicable otros potenciales | `incrementalAutonomy.test.ts` |
| `zeitnusHandshake` (integración) | • Handshake v2.0: Veritas ↔ Zeitnus nodo<br>• Tests 1-5 pasan (ver `zeitnus-handshake.ts`)<br>• Transformación estructural mutua verificada | `zeitnusHandshake.integration.test.ts` |

---

## Plan Implementación Archivo por Archivo

### Fase 3.1 — Tipos (`src/core/state/veritasVillages.ts`)
```typescript
// Interfaces dominio (sin deps externas)
interface VeritasVillage {
  id: string; name: string; country: 'PA'|'CR'|'NI';
  coords: [number, number]; // lat, lng
  hectares: number; lotsTotal: number; lotsSold: number;
  offGridSpecs: OffGridSpecs; firstIndex: FirstPrinciplesIndex;
  dao: QuadraticVotingState; bitcoinStandard: BitcoinStandardState;
  crossVillageAccess: boolean; caasMetrics: CaasMetrics;
  autonomyStage: 'proof'|'metrics'|'ask'|'negotiate'|'charter';
  rao: RAO; // RAO:veritas:village:{id}:{timestamp}
}

interface OffGridSpecs {
  kwhSolarPerCapitaDay: number; litersWaterPerCapitaDay: number;
  kcalFoodPerCapitaDay: number; kgWastePerCapitaWeek: number;
  current: { kwh: number; water: number; food: number; waste: number };
}

interface QuadraticVotingState {
  tokensPerYear: 100; voteCost: (n: number) => n * n;
  proposals: Proposal[]; votes: Vote[]; tally: TallyResult;
}

interface FirstPrinciplesIndex {
  freedom: number; independence: number; resilience: number;
  sustainability: number; transparency: number; aggregate: number;
}
```

### Fase 3.2 — Lógica Pura (`src/core/lib/veritasVillages.ts`)
```typescript
// Funciones puras (makeVeritasVillagesState, helpers)
// - quadraticTally(votes, tokens) → weighted result
// - bitcoinStandardCheck(comercio) → boolean + lightning verification
// - offGridViability(specs, current) → boolean + deficits
// - firstPrinciplesScore(village) → 0-100 each + aggregate
// - crossVillageSync(villages[]) → merged reputation/governance
// - incrementalAutonomyNextStage(village, metrics) → stage
// - handshakeTransform(veritasPotential, zeitnusPotential) → transformed pair
```

### Fase 3.3 — Store (`src/core/state/store.ts`)
- Import types + logic
- `veritasVillages: VeritasVillagesState` en `AppState`
- Actions: `addVillage`, `updateVillage`, `castQuadraticVote`, `syncCrossVillage`, `advanceAutonomyStage`, `runHandshakeWithZeitnus`
- `resetAll`: `veritasVillages: makeVeritasVillagesState()`
- `partialize`: incluye `veritasVillages`

### Fase 3.4 — Pantalla (`src/app/screens/VeritasVillages.tsx`)
- **Icono lucide**: `Globe` (red global) + `Vote` (gobernanza) + `Bitcoin` (moneda) — usar `Globe` principal
- **Tabs**: Aldeas | Gobernanza (DAO) | Bitcoin | Off-Grid | Autonomía | Handshake
- **Cards**: Cada aldea con specs off-grid, firstIndex, DAO status, autonomy stage
- **Quadratic Voting UI**: 100 tokens, slider votos, costo n² dinámico, tally real-time
- **Bitcoin Standard**: Lista comercios, verificación lightning, priceParity display
- **Handshake Panel**: Seleccionar nodo Zeitnus → ejecutar handshake v2.0 → mostrar tests 1-5

### Fase 3.5 — Nav + Ruta
- `src/app/layout/Aside.tsx`: añadir `Globe` a imports lucide, item `{ key: 'veritas', label: 'Veritas Villages', icon: Globe, color: 'orange', path: '/veritas' }`
- `src/app/App.tsx`: import + `<Route path="veritas" element={<VeritasVillages/>} />`

### Fase 3.6 — Handshake Integration (`src/core/lib/zeitnusHandshake.ts` — extender)
- Añadir `veritasPotential` a tipos de potenciales de órgano
- `handshakeTransform(veritas, zeitnusNode)` → implementa **Fase 2 Sincronización Estructural**:
  - Veritas expone a Zeitnus: `POST /tq/gov/quadratic`, `GET /tq/crossVillage/reputation`, `POST /tq/bitcoin/priceParity`
  - Zeitnus expone a Veritas: `POST /tq/bio/harvest`, `GET /tq/bio/yield`, `POST /tq/canutricio/scorecard`
  - Tests integración 1-5 adaptados para Veritas

---

## Referencias

- **Artículo original**: https://gst.artofliberty.org/es/veritas-villages-comunidades-intencionales-libertarias-en-america-latina/
- **Veritas Villages web**: https://www.veritasvillages.com/
- **Autris Group (OTC: AUTR)**: Communiqués de presse (FY Jun 2025)
- **Tipolis** (free private cities consultancy): gobernanza Veritas + Próspera
- **Free Private Cities Conference 2026**: origen contacto
- **Voluntaryist.News / Art of Liberty Foundation**: publicación (Etienne de la Boetie2)
- **Zeitnus Handshake v2.0**: `docs/ZEITNUS_UMBRAL_72H_PARADIGMA_HABITADO.md` (Capa 0, tests 1-5)
- **HSCSG v15 OS**: `skill:hscsg-repo-assimilation` (flujo 4 fases, Leyes I/II/III, CaaS)

---

## Notas de Asimilación (Copyright)

- **Contenido editorial**: Fair use para análisis, crítica, investigación. No se copia texto extensivo — solo hechos, métricas, patrones lógicos.
- **No código**: Fuente no es repositorio de código. Asimilación = **patrones vivos** (quadratic voting, bitcoin standard, off-grid specs, cross-village protocol, incremental autonomy) convertidos a lógica pura TypeScript.
- **Datos financieros**: De comunicados prensa Autris (no auditados) → documentados como `claimed` no `verified`.
- **Risk Nicaragua**: Documentado como exclusión CaaS (D8) basado en reporte artículo (UCA 2023 confiscation). Verificación independiente recomendada.
- **Próximo paso**: Implementar módulo `veritasVillages` + handshake integration + verificar tsc/build/rutas 200.