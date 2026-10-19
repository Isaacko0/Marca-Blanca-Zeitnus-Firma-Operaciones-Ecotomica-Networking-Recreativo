// openspec/specs/alrac-tq-pilot-tdf.md
// OpenSpec: Traditional Dream Factory Pilot → Virginia N3 Integration
// Maps: TDF real-world pilot case → TypeScript Implementation

# SPEC: alrac-tq-pilot-tdf
**Version:** 1.0.0
**Status:** Implemented
**Source:** Traditional Dream Factory (water table 20m→3m, 5000 trees, €1.5M)
**Target:** src/core/lib/tq-pilot-tdf.ts

---

## 1. Pilot Case: Traditional Dream Factory

### 1.1 Baseline (Degraded State)
| Metric | Baseline | Unit | Status |
|--------|----------|------|--------|
| Water Table Depth | 20 | meters | Critical |
| Soil Carbon | 0.8 | tC/ha | Degraded |
| Tree Count | 120 | trees | Low |
| Biodiversity Index | 1.2 | Shannon | Low |
| Renewable Energy | 15 | % | Low |
| Waste Diversion | 20 | % | Low |
| Community Size | 15 | people | Small |
| Annual Income | 12,000 | EUR | Low |
| TQ Production | 5,000 | kWh/year | Minimal |

### 1.2 Targets (Regenerated State - OASA Compliant)
| Metric | Target | Unit | OASA Principle |
|--------|--------|------|----------------|
| Water Table Depth | 3 | meters | 2 (Water) |
| Soil Carbon | 3.0 | tC/ha | 1 (Soil) |
| Tree Count | 5,000 | trees | 5 (Rewilding) |
| Biodiversity Index | 3.5 | Shannon | 5 (Rewilding) |
| Renewable Energy | 100 | % | 6 (Resources) |
| Waste Diversion | 99 | % | 4 (Waste) |
| Community Size | 50 | people | 7 (Community) |
| Annual Income | 45,000 | EUR | 7 (Community) |
| TQ Production | 50,000 | kWh/year | 6 (Resources) |
| OASA Compliance | 0.85 | 0-1 | All |
| Transparency Score | 0.9 | 0-1 | 4 (Transparency) |

### 1.3 Budget: €1.5M Total

| Phase | Allocation | % | Funding Sources |
|-------|------------|---|-----------------|
| Onboarding | 50,000 | 3% | Village Fund, Community |
| Water Restoration | 400,000 | 27% | Regional Grant, Impact Investment |
| Reforestation | 600,000 | 40% | Village Fund, Grant |
| Soil Carbon | 250,000 | 17% | Grant, Community |
| Energy & Waste | 200,000 | 13% | Investment, Revenue |

**Funding Sources:**
- Village Fund Cohort 1: €500,000
- Regional Regeneration Grant: €400,000
- Impact Investment: €300,000
- Community Contributions: €200,000
- Ecosystem Revenue (Year 2+): €100,000

---

## 2. Pilot Timeline (2 Years, 5 Phases)

### Phase 1: Village Onboarding & Closer Attestation (Month 1)
| Milestone | OASA Principle | TDF Track | Target |
|-----------|----------------|-----------|--------|
| Land Title Verified | 6 | 1 | On-chain registry |
| Regeneration Plan Approved | 1 | 1 | 7 principles measurable |
| Stewardship Commitment Signed | 7 | 1 | All stewards |
| Open Books Published | 4 | 1 | 3 categories |
| Closer Agent Active | 6 | 1 | 4 capabilities |

### Phase 2: Water Table Restoration (Months 1-6)
| Milestone | OASA Principle | TDF Track | Target |
|-----------|----------------|-----------|--------|
| Keyline Design Complete | 2 | 3 | Topographic survey |
| Swales & Ponds Constructed | 2 | 3 | 5km swales, 3 ponds |
| Water Table ≤5m | 2 | 2 | Monitoring well |

### Phase 3: Reforestation & Rewilding (Months 2-12)
| Milestone | OASA Principle | TDF Track | Target |
|-----------|----------------|-----------|--------|
| 1,000 Trees Planted | 5 | 2 | Phase 1 |
| 3,000 Trees Planted | 5 | 2 | Phase 2 |
| 5,000 Trees Planted | 5 | 2 | Complete |
| Biodiversity Index ≥3.5 | 5 | 3 | eDNA + camera traps |

### Phase 4: Soil Carbon Sequestration (Months 3-24)
| Milestone | OASA Principle | TDF Track | Target |
|-----------|----------------|-----------|--------|
| Compost System Operational | 1 | 2 | 500 tons/year |
| Soil Carbon ≥1.5 tC/ha | 1 | 3 | Mid-term |
| Soil Carbon ≥3.0 tC/ha | 1 | 2 | OASA target |

### Phase 5: 100% Renewable Energy & Zero Waste (Months 4-18)
| Milestone | OASA Principle | TDF Track | Target |
|-----------|----------------|-----------|--------|
| Solar + Battery Installed | 6 | 2 | 50kW solar, 100kWh battery |
| Waste Diversion ≥90% | 4 | 3 | Composting, repair café |
| 100% Renewable, 99% Waste | 6 | 2 | OASA targets |

---

## 3. TypeScript Implementation Mapping

### 3.1 Core Engine: `PilotTDFEngine`

#### Constructor
```typescript
constructor(pilotConfig: PilotTDFCase)
// Initializes all 9 engines:
// - OASAConstitutionEngine
// - DisCO_CAT_Engine
// - CloserEngine
// - ValueFlowsEngine
// - SnapshotEngine
// - TDFEngine
// - BreadEngine
// - SocialAuditEngine
// - CloserAttestationEngine
```

#### Phase 1: Village Onboarding (TDF Track 1)
```typescript
async onboardVillage(villageData): 
  { villageId, attestationId, track1Passed }
// 1. CloserEngine.registerVillage()
// 2. CloserAttestationEngine.createVillageOnboardingAttestation()
// 3. Verify attestation
// 4. Run TDF Track 1 verification
```

#### Phase 2: DisCO CAT Initialization
```typescript
initializeDisCO(communityMembers: { did, cdsScore }[])
// Adds members to DisCO CAT + Bread profiles
```

#### Phase 3: Record Contributions (3 Flows)
```typescript
recordContribution(contribution: DisCOContribution)
// DisCO CAT + Bread sync + ValueFlows event
```

#### Phase 4: Consent Governance
```typescript
proposeAndVote(proposal, proposer, votes): ConsentDecision
// DisCO CAT consent decision + VF event
```

#### Phase 5: Regeneration Milestones (OASA Principles)
```typescript
async claimRegenerationMilestone(milestone):
  { attestationId, track1Passed }
// Closer Attestation + TDF verification + pilot metric update
```

#### Phase 6: Virginia N3 Vesting Claims
```typescript
async processVestingClaims(n3NodeIds[]):
  { nodeId, eligible, znuReleased }[]
// Bread verification → PeerVerification → Virginia claim
```

#### Phase 7: Snapshot Governance
```typescript
createGovernanceProposal(proposal): proposalId
// Snapshot proposal with OASA article linking
```

#### Phase 8: Social Audit (TDF Track 3)
```typescript
async runSocialAudit(subjectType, subjectId): SocialAuditReport
// Village Audit Panel rotation + 9 criteria evaluation
```

#### Phase 9: Full TDF Verification
```typescript
async runFullTDFVerification():
  { overallPassed, overallScore, trackResults, report }
// Complete 3-track verification with all engine data
```

#### Factory: Traditional Dream Factory Pilot
```typescript
static createTraditionalDreamFactoryPilot(): PilotTDFEngine
// Pre-configured with baseline, targets, timeline, budget
```

#### Report Generation
```typescript
generatePilotReport():
  { pilot, tdfVerification, discoSnapshot, breadNetwork, valueFlowsReport, snapshotProposals, recommendations }
```

---

## 4. Engine Integration Matrix

| Pilot Phase | Primary Engines | TDF Track | Output |
|-------------|-----------------|-----------|--------|
| 1. Onboarding | Closer, CloserAttestation, TDF | 1 | Village + Attestation |
| 2. DisCO Init | DisCO CAT, Bread | - | Members + Profiles |
| 3. Contributions | DisCO CAT, Bread, ValueFlows | - | 3 Flows tracked |
| 4. Governance | DisCO CAT, ValueFlows | - | Consent decisions |
| 5. Milestones | CloserAttestation, TDF, OASA | 1 | Milestone attestations |
| 6. Vesting | Bread, Virginia | 2 | ZNU releases |
| 7. Snapshot Gov | Snapshot, OASA | 2 | Proposals |
| 8. Social Audit | SocialAudit, DisCO, OASA, Virginia, Bread | 3 | Audit report |
| 9. Full TDF | All 9 engines | 1+2+3 | Verification report |

---

## 5. Acceptance Criteria

### 5.1 Pilot Configuration
- [ ] Baseline matches TDF documented values
- [ ] Targets match OASA Principle targets
- [ ] 5 phases with correct milestones
- [ ] Budget €1.5M with 5 funding sources
- [ ] 2-year timeline

### 5.2 Phase 1 Onboarding
- [ ] Village registered in Closer
- [ ] Closer Attestation created (10 types supported)
- [ ] Attestation verified (3 signatures)
- [ ] TDF Track 1 runs and passes

### 5.3 DisCO Initialization
- [ ] Members added to DisCO CAT
- [ ] Bread profiles created with CDS scores
- [ ] Virginia N3 mapping ready

### 5.4 3 Flows Recording
- [ ] Contributions recorded in DisCO CAT
- [ ] Bread sync for reputation
- [ ] ValueFlows events created

### 5.5 Consent Governance
- [ ] Proposals created and voted
- [ ] Consent decisions integrated
- [ ] VF events for governance

### 5.6 Regeneration Milestones
- [ ] Closer Attestation per milestone
- [ ] TDF Track 1 verification
- [ ] Pilot metrics updated

### 5.7 Vesting Claims
- [ ] Bread verification with 3 N2 verifiers
- [ ] PeerVerification output for Virginia
- [ ] ZNU release recorded in VF

### 5.8 Social Audit
- [ ] Panel rotated (CDS-weighted hybrid)
- [ ] 9 criteria evaluated
- [ ] Report with recommendations

### 5.9 Full TDF Verification
- [ ] All 3 tracks execute
- [ ] Overall score calculated
- [ ] Overall pass = all tracks pass

---

## 6. Test Vectors

### 6.1 Pilot Creation
```typescript
Input: PilotTDFEngine.createTraditionalDreamFactoryPilot()
Expected: pilot.baseline.waterTableDepth === 20, pilot.targets.waterTableDepth === 3
```

### 6.2 Onboarding Flow
```typescript
Input: villageData with all valid fields
Expected: { villageId, attestationId, track1Passed: true }
```

### 6.3 Full Verification
```typescript
Input: await pilot.runFullTDFVerification()
Expected: { overallPassed: boolean, overallScore: number, trackResults: Map }
```

---

## 7. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types |
| `tq-oasa` | 1.0.0 | Constitution, principles, villages |
| `tq-disco-cat` | 1.0.0 | CAT, 3 flows, phases |
| `tq-closer` | 1.0.0 | Village, agent, fund |
| `tq-valueflows` | 1.0.0 | Economic events |
| `tq-snapshot` | 1.0.0 | Governance proposals |
| `tq-tdf` | 1.0.0 | 3-track verification |
| `tq-bread` | 1.0.0 | Peer endorsement, vesting |
| `tq-social-audit` | 1.0.0 | Panel rotation, criteria |
| `tq-closer-attestation` | 1.0.0 | Attestation creation |

---

## 8. References

- Traditional Dream Factory: ECOSYSTEM_REVENUE_SHARING.md:111-118
- OASA Constitution: https://oasa.earth/papers/oasa-constitution-2025
- DisCO Manifesto: https://manifesto.disco.coop
- Closer Platform: https://closer.earth
- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: pilot engine with 9 integrated engines, 5 phases, 18 milestones, Traditional Dream Factory factory |