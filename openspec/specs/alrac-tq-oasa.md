// openspec/specs/alrac-tq-oasa.md
// OpenSpec: OASA Constitution Engine Implementation
// Maps: OASA Constitution (11 Articles, 7 Principles) → TypeScript Implementation

# SPEC: alrac-tq-oasa
**Version:** 1.0.0
**Status:** Implemented
**Source:** oasa.earth/papers/oasa-constitution-2025
**Target:** src/core/lib/tq-oasa.ts

---

## 1. Constitutional Architecture

### 1.1 Articles (11)
| Article | Title | Implementation |
|---------|-------|----------------|
| 1 | Purpose and Scope | `createArticles()[0]` - Mission, Scope, Supremacy |
| 2 | Membership and Villages | `createArticles()[1]` - Village Definition, Admission, Rights |
| 3 | Regenerative Principles | `createArticles()[2]` - 7 Principles, Compliance, Reporting |
| 4 | Governance | `createArticles()[3]` - General Meeting, Project Assembly, Executive, Guardians |
| 5 | Technology and AI | `createArticles()[4]` - Digitized Commons, Utility Token, AI Rights |
| 6 | Economy | `createArticles()[5]` - Regenerative Economy, Token Use Rights, Legal Structures |
| 7 | Dispute Resolution | `createArticles()[6]` - Internal, Association, GM, Last Resort |
| 8 | Amendments | `createArticles()[7]` - Proposal, Guardian Review, Adoption Thresholds |
| 9 | Future Generations | `createArticles()[8]` - 175yr Horizon, Guardian Role, Intergenerational Justice |
| 10 | Sovereignty | `createArticles()[9]` - Commons, Local, Data, AI, Expression, Safety, Ecology |
| 11 | Dissolution | `createArticles()[10]` - Asset Protection, Data Preservation |

### 1.2 Seven Regenerative Principles (Metrics & Targets)

| Principle | Metrics | Targets | Measurement |
|-----------|---------|---------|-------------|
| 1. Soil | Soil Organic Carbon (tC/ha), Microbial Biomass (µg C/g), Water Infiltration (mm/hr) | 3.0, 500, 150 | Dry combustion, Chloroform fumigation, Double-ring infiltrometer |
| 2. Water | Water Table Depth (m), Water Quality Index, Aquifer Recharge (mm/yr) | ≤5.0, 90, 200 | Monitoring well, Multi-parameter sonde, Water balance model |
| 3. Air/Climate | Net Carbon Seq (tCO2e/ha/yr), Air Quality Index, Renewable Energy % | 10, 25, 100% | IPCC + soil cores, Low-cost sensors, Energy meters |
| 4. Waste | Landfill Diversion (%), Circular Material Rate (%), Waste per Capita (kg/yr) | 99, 80, 50 | Weight tracking, Material flow analysis, Per capita |
| 5. Rewilding | Species Richness (Shannon), Rewilded Area (%), Keystone Species | 3.5, 30%, 5 | eDNA + camera traps, GIS mapping, Camera traps |
| 6. Resources | Renewable Energy (%), Bioregional Sourcing (%), Embodied Carbon (kgCO2e/m²) | 100, 80, 150 | Energy meters, Supply chain audit, LCA |
| 7. Community | Participation Rate (%), Consent Ratio (%), Care Work (hrs/capita/week) | 70, 80, 10 | Assembly attendance, Decision records, Time-use survey |

### 1.3 Governance Structure

| Body | Composition | Thresholds | Responsibilities |
|------|-------------|------------|------------------|
| General Meeting | All token holders | Constitutional 66%, Legislative 55%, Executive 51% | Amendments, Legislation, Appointments, Fund allocations |
| Project Assembly | Village reps (1/50 residents) | Quorum 30%, Consent 80% | Operations, Coordination, Agent approvals, Plan reviews |
| Executive Teams | Elected, 2-year terms | Recallable 60% | Protocol maintenance, Fund deployment, Agent orchestration |
| Guardians of Nature | Sortition (ecologists/elders) | Veto power | Ecological integrity, Future generations representation |

### 1.4 Technology & AI Rights
- **Digitized Commons**: All code AGPL-3.0, infrastructure as commons
- **Utility Token**: Governance + use rights only, bonding curve adjustable by Assembly
- **Data Sovereignty**: Personal control, privacy by design, open source, no surveillance
- **AI Rights**: Tools of commons, no autonomous decisions, citizen authority, emergent intelligence framework

### 1.5 Economy
- **Regenerative Economy**: Value flows in thermodynamic units (kWh eq), no extraction
- **Token Use Rights**: Governance, Access, Staking, Fees, Resource access
- **Legal Structures**: Cooperatives, Associations, Foundations, Purpose LLCs, Community Land Trusts

---

## 2. TypeScript Implementation Mapping

### 2.1 Core Engine: `OASAConstitutionEngine`
```typescript
class OASAConstitutionEngine {
  // Constitution factory
  private createDefaultConstitution(): OASAConstitution
  private createArticles(): OASAArticle[]
  private createRegenerativePrinciples(): OASAPrinciple[]
  private createGovernance(): OASAGovernance
  private createTechnology(): OASATechnology
  private createEconomy(): OASAEconomy
  private createDisputeResolution(): OASADisputeResolution
  private createAmendments(): OASAAmendments
  private createFutureGenerations(): OASAFutureGenerations
  private createSovereignty(): OASASovereignty

  // Village management
  registerVillage(village: CloserVillage): { success, errors }
  getVillage(id): CloserVillage
  listVillages(): CloserVillage[]
  updateVillageMetrics(villageId, metrics): complianceScore

  // Agent management
  registerAgent(agent: CloserAgent): { success, errors }
  getAgent(id): CloserAgent

  // Village Fund
  createVillageFund(fund: OASAVillageFund): { success, errors }
  getFund(id): OASAVillageFund

  // Token economics
  calculateBondingCurvePrice(supply, reserve, params): price
  calculateTokenDistribution(villageId, contributionKwh): tokens

  // Governance operations
  createProposal(proposer, category, title, description): proposal
  validateConsent(votes, threshold): { passed, consentRatio, blocked }

  // Accessors
  getConstitution(): OASAConstitution
  getArticle(number): OASAArticle
  getPrinciple(number): OASAPrinciple
  getAllPrinciples(): OASAPrinciple[]
}
```

### 2.2 Legal Templates (Exportable)
```typescript
OASA_LEGAL_TEMPLATES = {
  cooperativeBylaws: string,      // ICA principles, mission lock, guardian seats
  associationStatutes: string,    // Non-profit, tripartite board, treasury multisig
  purposeLLC: string,             // Mission lock 75%+guardian, non-transferable units
  communityLandTrust: string,     // 99yr lease, resale formula CPI+improvements
}
```

---

## 3. Integration Points

### 3.1 Urbanika Metrics Mapping
```typescript
OASA_PRINCIPLE_TO_URBANIKA = {
  soil: 'soilRegenerationKwh',
  water: 'waterRetentionKwh',
  air: 'carbonSequestrationKwh',
  waste: 'wasteReductionKwh',
  rewilding: 'biodiversityIndex',
  resources: 'renewableEnergyKwh',
  community: 'socialCohesionIndex'
}
```

### 3.2 Closer Platform Integration
- Village onboarding → `CloserEngine.registerVillage()`
- Agent registration → `CloserEngine.registerAgent()`
- Village Fund → `CloserEngine.createVillageFund()`
- Compliance scoring → `CloserEngine.updateVillageMetrics()`

### 3.3 DisCO CAT Integration
- 7 Principles → DisCO Principle 7 (Regenerative & Just)
- Governance → DisCO Assembly (consent-based)
- Transparency → DisCO Transparency layer
- Legal wrappers → DisCO Legal Wrapper (Principle 7)

### 3.4 Virginia Network Integration
- Village → N1 Root Domain
- Village members → N2 Sub-domains
- Projects → N3 Project Domains
- Fund → N3 Fund Domains

### 3.5 Aragon OSx Integration
- Governance parameters synced via `AragonOSxEngine.syncWithOASA()`
- OASA compliance plugin added to OSx modules
- Guardian veto mapped to Aragon dispute resolution

---

## 4. Acceptance Criteria

### 4.1 Constitution Completeness
- [ ] All 11 Articles with sections implemented
- [ ] 7 Principles with ≥3 metrics each, targets, measurement methods
- [ ] Governance bodies with correct thresholds
- [ ] Technology/AI rights encoded
- [ ] Dispute resolution 4-tier ladder
- [ ] Amendment process with guardian review
- [ ] Future generations 175yr horizon
- [ ] Sovereignty declarations (5 dimensions)

### 4.2 Village Onboarding
- [ ] Land title/lease validation (≥0.5ha, ≥49yr lease)
- [ ] Regeneration plan validation (7 principles covered)
- [ ] Stewardship commitment (signatures)
- [ ] Open books (3 categories)
- [ ] Closer platform (agent + 4 capabilities)
- [ ] Compliance scoring (0-1 per principle)

### 4.3 Token Economics
- [ ] Sigmoid bonding curve calculation
- [ ] Token allocation: 60% governance / 40% use rights
- [ ] Compliance multiplier (0.5x to 1.5x)
- [ ] Village Fund distribution: 70% matching / 30% prizes / 1% fees

### 4.4 Legal Templates
- [ ] Cooperative bylaws (ICA + OASA)
- [ ] Association statutes (non-profit + treasury)
- [ ] Purpose LLC (mission lock + guardian veto)
- [ ] Community Land Trust (99yr lease + CPI resale)

---

## 5. Test Vectors

### 5.1 Village Registration
```typescript
Input: { name: "Ecovillage Valle", landHectares: 10, waterTableDepth: 8, domain: "valle.closer.earth" }
Expected: success=true, villageId generated, compliance=0
```

### 5.2 Compliance Calculation
```typescript
Input: { soilRegenerationKwh: 2.5, waterRetentionKwh: 4, carbonSequestrationKwh: 8, wasteReductionKwh: 95, biodiversityIndex: 3.0, renewableEnergyKwh: 80, socialCohesionIndex: 65 }
Expected: compliance ≈ 0.78
```

### 5.3 Bonding Curve
```typescript
Input: supply=100000, reserve=1000000, params={reserveRatio:0.1, maxSupply:1e9, slope:'sigmoid'}
Expected: price ≈ reserveRatio * (1 + sigmoid * 9)
```

---

## 6. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core type definitions |
| `tq-closer` | 1.0.0 | Village/Agent platform integration |
| `tq-disco-cat` | 1.0.0 | DisCO governance integration |
| `tq-aragon` | 1.0.0 | OSx governance sync |

---

## 7. References

- OASA Constitution 2025: https://oasa.earth/papers/oasa-constitution-2025
- Closer Platform: https://closer.earth
- DisCO Manifesto: https://manifesto.disco.coop
- Urbanika Autogestión: docs/urbanika/Autogestion_Vecinal_backup.md
- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: Constitution engine, legal templates, village/agent/fund management, token economics, governance ops |