// openspec/specs/alrac-tq-aragon.md
// OpenSpec: Aragon OSx Engine Implementation
// Maps: aragon.org OSx, AGPs, OTF → TypeScript Implementation

# SPEC: alrac-tq-aragon
**Version:** 1.0.0
**Status:** Implemented
**Source:** aragon.org, AGPs (archived), coop-dao-docs
**Target:** src/core/lib/tq-aragon.ts

---

## 1. Aragon OSx Architecture

### 1.1 Core Modules (6)

| Module | Version | Permissions | Dependencies |
|--------|---------|-------------|--------------|
| token-manager | 1.0.0 | mint, burn, vote, stake | voting, treasury |
| voting | 1.0.0 | create-proposal, vote, veto | token-manager |
| treasury | 1.0.0 | execute payment, allocate budget | token-manager, voting |
| vesting | 1.0.0 | claim, create-schedule | token-manager |
| reputation | 1.0.0 | claim, verify | token-manager |
| dispute-resolution | 1.0.0 | raise, mediate, decide | governance, treasury |

### 1.2 Governance Configuration

```typescript
governance: {
  type: 'holographic',  // Holographic Consensus
  parameters: {
    proposalThreshold: 1000,        // min tokens to propose
    votingPeriod: 604800000,        // 7 days
    quorum: 0.10,                   // 10% token supply
    majorityThreshold: 0.51,        // 51%
    holographicConsensus: {
      predictorStake: 10000,
      predictorReward: 0.1,
      challengerStake: 50000,
    },
    consentThreshold: 0.80,         // OASA-aligned decisions
    guardianVeto: true,             // OASA Guardians
  },
  plugins: ['voting', 'holographic-consensus', 'dispute-resolution']
}
```

### 1.3 Tokenomics

| Parameter | Value | Description |
|-----------|-------|-------------|
| Bonding Curve | sigmoid | Stable price discovery |
| Reserve Ratio | 0.1 | 10% reserve |
| Vesting Cliff | 1 year | Standard cliff |
| Emissions Rate | 5% annual | Continuous |
| Utility | governance, staking, fees, access, payments | Full utility |

### 1.4 Core Plugins

| Plugin | Type | Config |
|--------|------|--------|
| holographic-consensus | governance | enabled: true |
| conviction-voting | governance | decay: 0.95 |
| multisig-treasury | treasury | threshold: 3 |
| token-vesting | tokenomics | schedules: [] |
| reputation-weighted | governance | enabled: true |
| oasa-compliance | custom | principles: 7, guardians: true |

---

## 2. AGP Process (Aragon Governance Proposals)

### 2.1 AGP Lifecycle

| Status | Description | Transitions |
|--------|-------------|-------------|
| draft | Author writing | → review |
| review | Editorial + Board review | → vote |
| vote | Token holder voting | → approved/rejected |
| approved | Passed voting | → implemented |
| rejected | Failed voting | (terminal) |
| implemented | Executed on-chain | (terminal) |
| sunset | Expired/withdrawn | (terminal) |

### 2.2 Review Process

| Reviewer | Role | Criteria |
|----------|------|----------|
| Editorial | Clarity, formatting, completeness | Language, structure, references |
| Board | Strategic alignment, risk | Mission fit, legal, financial |

### 2.3 Categories

| Category | Description | Typical Threshold |
|----------|-------------|-------------------|
| governance | Protocol parameters, voting | 51% |
| treasury | Fund allocations, budgets | 51% |
| technical | Smart contract upgrades | 66% |
| ecosystem | Grants, partnerships | 51% |
| meta | Process changes | 66% |

---

## 3. OTF (Ownership Token Framework)

### 3.1 Criteria

| Criterion | Description | Verification |
|-----------|-------------|--------------|
| Enforceable Ownership | Legal rights enforceable on-chain/off-chain | Legal wrapper + on-chain |
| Value Accrual | Token captures protocol value | Buyback, staking, fees, governance |
| Verifiable Evidence | Auditable proof of ownership/value | On-chain + off-chain audit |

### 3.2 Token Types Supported

| Type | Description | OTF Compliant |
|------|-------------|---------------|
| ownership | Legal equity/share | Yes (with wrapper) |
| utility | Access/governance rights | Yes |
| governance | Voting power only | Partial |
| hybrid | Combination | Yes |

### 3.3 Evaluation Framework

#### Ownership Rights
1. Governance participation (on-chain, vote receipt)
2. Revenue share (treasury report, distribution tx)
3. Asset claim on dissolution (legal wrapper, court order)
4. Information access (transparent ledger, API)

#### Value Accrual Mechanisms
1. Buyback & burn (buyback volume, burn rate)
2. Staking yield (APY, staked ratio)
3. Fee discounts (fee savings, holder count)
4. Governance value (proposals passed, voter turnout)

#### Evidence Standards
1. On-chain verification (no auditor required)
2. Off-chain audit (auditor required)
3. Hybrid attestation (auditor required)

---

## 4. Coop DAO Integration

### 4.1 Legal Entities
- Cooperative (ICA principles)
- Association (non-profit)
- Foundation (purpose-driven)
- GmbH (German limited liability)
- LLC (US limited liability)

### 4.2 Governance Models
- General Assembly
- Board
- Sociocracy
- Holacracy
- Custom

### 4.3 Treasury
- Multi-sig (configurable threshold)
- Assets: crypto, fiat, real-estate, equipment, inventory, IP
- Budget: income/expenses/surplus/allocation

---

## 5. TypeScript Implementation Mapping

### 5.1 Core Engine: `AragonOSxEngine`

#### OSx Management
```typescript
getOSx(): AragonOSx
addModule(module): boolean
removeModule(name): boolean
getModule(name): AragonModule
listModules(): AragonModule[]
```

#### Permission System
```typescript
grantPermission(role, action, resource, conditions): void
revokePermission(role, action, resource): boolean
checkPermission(role, action, resource, context): boolean
```

#### AGP Process
```typescript
createAGP(author, title, description, category): AGP_Process
submitAGPForReview(agpId): boolean
voteOnAGP(agpId, voter, choice, weight, signature): boolean
finalizeAGP(agpId): { passed, yesWeight, noWeight, abstainWeight }
getAGP(id): AGP_Process
listAGPs(filters): AGP_Process[]
```

#### OTF Framework
```typescript
initializeOTF(): AragonOTF
evaluateTokenAgainstOTF(tokenData): { compliant, score, gaps }
getOTF(): AragonOTF
```

#### Coop DAO
```typescript
createCoopDAO(coop): CoopDAO
addCoopMember(coopName, member): boolean
createCoopBudget(coopName, period, income, expenses): CoopBudget
allocateCoopFunds(coopName, allocations): boolean
getCoopDAO(name): CoopDAO
listCoopDAOs(): CoopDAO[]
```

#### Bonding Curve
```typescript
calculateBondingCurvePrice(supply, reserve, curve): number
calculateTokensForReserve(reserveAmount, currentSupply, curve): number
// Supports: linear, exponential, logarithmic, sigmoid, custom
```

#### Vesting Schedules
```typescript
createVestingSchedule(beneficiary, tranches, cliff): AragonVesting
claimVesting(vesting, currentTime): { claimable, claimed, remaining }
```

#### Emissions
```typescript
calculateEmissions(currentSupply, emissions): number
// continuous, discrete, epoch-based
```

#### OASA Sync
```typescript
syncWithOASA(oasaEngine): void
// Aligns: consentThreshold, guardianVeto, oasa-compliance plugin
```

#### Export
```typescript
exportState(): { osx, agps, otf, coopDaos }
```

---

## 6. Integration Points

### 6.1 OASA Constitution
- `syncWithOASA()` aligns governance parameters
- Adds `oasa-compliance` plugin
- Guardian veto mapped to Aragon dispute resolution

### 6.2 DisCO CAT
- Consent threshold (80%) → Aragon consentThreshold
- Domain voting → Colony integration
- Transparency → Aragon dispute resolution evidence

### 6.3 Virginia Network
- N3 dynamic weight → Reputation-weighted voting
- Vesting schedules → Aragon vesting module
- Colony domains → Virginia N2/N3 mapping

### 6.4 Snapshot Voting
- Holographic consensus strategy
- AGP proposals mirrored to Snapshot
- Token voting power synced

---

## 7. Acceptance Criteria

### 7.1 OSx Modules
- [ ] 6 core modules with correct permissions
- [ ] Dependency resolution (no circular deps)
- [ ] Module add/remove with dependency checks

### 7.2 Governance
- [ ] Holographic consensus configured
- [ ] Consent threshold 80% for OASA decisions
- [ ] Guardian veto integrated
- [ ] Proposal threshold 1000 tokens

### 7.3 Tokenomics
- [ ] Sigmoid bonding curve calculation
- [ ] Vesting schedules with cliff
- [ ] 5% continuous emissions
- [ ] Full utility flags

### 7.4 AGP Process
- [ ] 7 statuses with correct transitions
- [ ] Editorial + Board review
- [ ] Voting with weight/signature
- [ ] Finalization with quorum/threshold

### 7.5 OTF
- [ ] 3 criteria with evaluation framework
- [ ] 4 token types supported
- [ ] 4 ownership rights, 4 value accrual, 3 evidence standards
- [ ] Token evaluation returns score + gaps

### 7.6 Coop DAO
- [ ] 5 legal entity types
- [ ] 5 governance models
- [ ] Multi-sig treasury with budget
- [ ] Budget allocation with approval

### 7.7 Bonding Curve
- [ ] 5 curve types implemented
- [ ] Price calculation correct
- [ ] Reserve calculation (binary search)

---

## 8. Test Vectors

### 8.1 Bonding Curve (Sigmoid)
```typescript
Input: supply=0, reserve=1000000, params={reserveRatio:0.1, maxSupply:1e9}
Expected: price = 100000 (reserveRatio * reserve)

Input: supply=500000000, reserve=1000000, params={reserveRatio:0.1, maxSupply:1e9, steepness:10, midpoint:0.5}
Expected: price ≈ 100000 * (1 + 0.5 * 9) = 550000
```

### 8.2 AGP Flow
```typescript
Input: createAGP("alice", "Treasury Allocation", "Move 100k to ecosystem", "treasury")
→ submitAGPForReview()
→ voteOnAGP(agpId, "bob", "yes", 5000, "sig")
→ finalizeAGP()
Expected: status=approved, yesWeight=5000
```

### 8.3 OTF Evaluation
```typescript
Input: tokenData={ type: 'hybrid', enforceableRights: ['Governance','Revenue share'], valueAccrual: ['Staking yield'], evidence: ['on-chain verification'] }
Expected: compliant=false, score=0.5, gaps=['Asset claim', 'Information access', 'Buyback&burn', 'Fee discounts', 'Governance value', 'Off-chain audit', 'Hybrid attestation']
```

---

## 9. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (AragonOSx, AGP_Process, OTF, CoopDAO) |
| `tq-oasa` | 1.0.0 | OASA Constitution sync |

---

## 10. References

- Aragon OSx: https://aragon.org/osx
- AGPs (Archived): https://github.com/aragon/AGPs
- Coop DAO Docs: https://github.com/aragon/coop-dao-docs
- OTF Framework: https://aragon.org/otf
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Aragon integration)

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: OSx modules, governance, tokenomics, AGPs, OTF, Coop DAO, bonding curves, vesting, emissions, OASA sync |