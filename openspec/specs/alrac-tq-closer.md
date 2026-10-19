// openspec/specs/alrac-tq-closer.md
// OpenSpec: Closer Platform Engine Implementation
// Maps: closer.earth + OASA Constitution → TypeScript Implementation

# SPEC: alrac-tq-closer
**Version:** 1.0.0
**Status:** Implemented
**Source:** closer.earth, oasa.earth
**Target:** src/core/lib/tq-closer.ts

---

## 1. Closer Platform Architecture

### 1.1 Village Onboarding (OASA Fund Criteria)

| Criterion | Requirement | Validation |
|-----------|-------------|------------|
| Land Title/Lease | ≥0.5 hectares, ≥49-year lease | On-chain registry check |
| Regeneration Plan | 7 OASA principles with measurable targets | Document analysis |
| Stewardship Commitment | Signed by required stewards | Signature verification |
| Open Books | Financial, Ecological, Governance public | URI + hash verification |
| Runs on Closer | Agent registered with 4+ capabilities | Platform API check |

### 1.2 Village Types

| Type | Description | Typical Size | Focus |
|------|-------------|--------------|-------|
| ecovillage | Regenerative settlement | 20-200 residents | Agriculture, rewilding |
| cohousing | Collaborative housing | 10-50 residents | Shared facilities, governance |
| regenerative-hub | Educational/commercial | 5-30 residents | Training, demonstration |
| retreat-center | Hospitality + regeneration | 10-100 guests | Healing, nature connection |

### 1.3 Agent Capabilities (9)

| Capability | Description | Required for Fund |
|------------|-------------|-------------------|
| bookings | Stay reservations, availability | Yes |
| events | Workshops, gatherings, courses | Yes |
| memberships | Community membership management | Yes |
| governance | Proposals, voting, consent decisions | Yes |
| tokens | Token operations, vesting, claims | Yes |
| learning | Courses, certifications, knowledge sharing | No |
| spaces | Physical space reservations | No |
| ai-mediation | Conflict resolution, facilitation | No |
| resource-tracking | Water, energy, waste monitoring | Yes |

**Required for Village Fund:** bookings, governance, tokens, resource-tracking

### 1.4 Village Fund (Cohort-based)

| Parameter | Value | Description |
|-----------|-------|-------------|
| Matching Pool | 70% of fees | Matches community contributions |
| Endowment Prizes | 30% of fees | Awards for milestones |
| Platform Fee | 1% | From all village transactions |
| Token Raise Type | governance-and-use-rights | Never equity |
| Follow-on Capital | Spring 2027 | Additional funding round |

---

## 2. TypeScript Implementation Mapping

### 2.1 Core Engine: `CloserEngine`

#### Village Management
```typescript
registerVillage(village: CloserVillage): { success, errors, villageId }
getVillage(id): CloserVillage
listVillages(): CloserVillage[]
updateVillageMetrics(villageId, metrics): complianceScore
getPrinciplesCompliance(villageId): Record<string, number>
```

#### Agent Management
```typescript
registerAgent(agent: CloserAgent): { success, errors, agentId }
getAgent(id): CloserAgent
listAgentsByVillage(villageId): CloserAgent[]
executeAgentAction(agentId, capability, params): Promise<{ success, result, error }>
```

#### Village Fund
```typescript
createVillageFund(fund: OASAVillageFund): { success, errors, fundId }
getFund(id): OASAVillageFund
listFunds(): OASAVillageFund[]
```

#### Token Economics
```typescript
calculateTokenAllocation(villageId, contributionKwh, complianceScore): 
  { governanceTokens, useRightTokens, total }

calculateBondingCurvePrice(supply, reserve, params): price
// Sigmoid: price = reserveRatio * (1 + sigmoid(normalized) * 9)
```

#### Fund Distribution
```typescript
calculateFundDistribution(fundId, platformFeesCollected):
  { matchingPool, endowmentPrizes, feeContribution }
```

#### Onboarding Flow
```typescript
onboardVillage({ village, agent?, fund? }): 
  { villageId, agentId?, fundId?, errors[] }
// Atomic: village + agent + fund in single call
```

#### Interoperability
```typescript
syncWithOASA(villageId, oasaMetrics): complianceScore
exportVillageData(villageId): { village, agents, fund, compliance }
```

### 2.2 Closer Agent Runtime (for ElizaOS)
```typescript
interface CloserAgentRuntime {
  agent: CloserAgent
  village: CloserVillage
  capabilities: Map<Capability, (params) => Promise<any>>
  memory: { conversations, knowledge, embeddings }
  state: 'idle' | 'processing' | 'error'
}

createCloserAgentRuntime(agent, village): CloserAgentRuntime
```

---

## 3. OASA Principles Compliance Scoring

### 3.1 Metric Mapping
```typescript
OASA_PRINCIPLE_TO_URBANIKA = {
  soil: 'soilRegenerationKwh',      // target: 3.0 tC/ha
  water: 'waterRetentionKwh',       // target: ≤5.0m depth
  air: 'carbonSequestrationKwh',    // target: 10 tCO2e/ha/yr
  waste: 'wasteReductionKwh',       // target: 99%
  rewilding: 'biodiversityIndex',   // target: 3.5 Shannon
  resources: 'renewableEnergyKwh',  // target: 100%
  community: 'socialCohesionIndex'  // target: 70%
}
```

### 3.2 Scoring Algorithm
```typescript
// For each principle with data:
// score = min(1, actual / target)  // except water (inverted)
// compliance = average of all principle scores
```

---

## 4. Integration Points

### 4.1 OASA Constitution Engine
- Village registration → `OASAConstitutionEngine.registerVillage()`
- Compliance scoring synced both ways
- Governance proposals via Closer Agent

### 4.2 DisCO CAT Engine
- Village members → DisCO members
- 3 flows tracked per village
- Consent decisions via Closer Agent governance capability

### 4.3 Virginia Network
- Village → N1 Root Domain
- Agent capabilities → N2/N3 domain operations
- Village Fund → N3 Fund Domain

### 4.4 Snapshot Voting
- Village space created via `SnapshotEngine.createVillageSpace()`
- Strategies: ERC20 + OASA Compliance + 1a1v
- Governance proposals submitted via Closer Agent

### 4.5 ValueFlows
- Village resource tracking → VF Economic Events
- Booking revenue → VF transfers
- Resource monitoring → VF observations

---

## 5. Acceptance Criteria

### 5.1 Village Onboarding
- [ ] Validates all 5 OASA Fund criteria
- [ ] Rejects invalid land size (<0.5ha)
- [ ] Rejects water table >50m without plan
- [ ] Requires valid domain
- [ ] Returns villageId on success

### 5.2 Agent Registration
- [ ] Validates village exists
- [ ] Checks capability validity (9 allowed)
- [ ] Validates infrastructure type (local/cloud/hybrid)
- [ ] Validates sovereignty type (full/shared/hosted)
- [ ] Returns agentId on success

### 5.3 Village Fund
- [ ] Validates all 5 criteria
- [ ] Enforces governance-and-use-rights token type
- [ ] Calculates matching pool (70%) and prizes (30%)
- [ ] Applies 1% platform fee contribution

### 5.4 Token Allocation
- [ ] Base rate: 100 tokens/kWh/year
- [ ] Compliance multiplier: 0.5x to 1.5x
- [ ] Split: 60% governance / 40% use rights
- [ ] Sigmoid bonding curve price calculation

### 5.5 Agent Actions
- [ ] All 9 capabilities implemented
- [ ] Returns structured result with IDs
- [ ] Validates agent has capability before execution

---

## 6. Test Vectors

### 6.1 Village Registration
```typescript
Input: { name: "Valle Ecovillage", location: {lat:37.3, lng:-5.9}, 
         landHectares: 10, type: "ecovillage", domain: "valle.closer.earth" }
Expected: success=true, villageId generated, compliance=0
```

### 6.2 Agent Registration
```typescript
Input: { villageId: "village_abc", name: "Valle Agent",
         capabilities: ["bookings","governance","tokens","resource-tracking"],
         infrastructure: "local", sovereignty: "full" }
Expected: success=true, agentId generated
```

### 6.3 Token Allocation
```typescript
Input: villageId, contributionKwh=50000, complianceScore=0.85
Expected: total=9250000, governance=5550000, useRights=3700000
// 50000 * 100 * (0.5+0.85) = 9,250,000 tokens
```

### 6.4 Bonding Curve Price
```typescript
Input: supply=100000, reserve=1000000, params={reserveRatio:0.1, maxSupply:1e9}
Expected: price ≈ 100000 * (1 + sigmoid(0.0001) * 9) ≈ 100000
```

---

## 7. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (CloserVillage, CloserAgent, OASAVillageFund) |
| `tq-oasa` | 1.0.0 | Constitution engine, principles compliance |
| `tq-disco-cat` | 1.0.0 | DisCO member/flow integration |
| `tq-valueflows` | 1.0.0 | Economic event recording |
| `tq-snapshot` | 1.0.0 | Governance space creation |

---

## 8. References

- Closer Platform: https://closer.earth
- OASA Constitution: https://oasa.earth/papers/oasa-constitution-2025
- Village Fund Whitepaper: closer.earth/fund
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Village Fund section)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: Village/Agent/Fund management, token economics, onboarding flow, OASA compliance scoring |