// openspec/specs/alrac-tq-bread.md
// OpenSpec: Bread Verification + Peer Endorsement Engine
// Maps: Bread verification methodology → TypeScript Implementation

# SPEC: alrac-tq-bread
**Version:** 1.0.0
**Status:** Implemented
**Source:** Bread verification, DisCO CAT, Virginia Network
**Target:** src/core/lib/tq-bread.ts

---

## 1. Bread Architecture

### 1.1 Endorsement Types

| Type | Description | Weight Multiplier | Use Case |
|------|-------------|-------------------|----------|
| skill | Technical/functional competence | 1.0 | Skill verification |
| contribution | Value delivered to community | 1.2 | Livelihood flow verification |
| trust | Relational trust, reliability | 1.5 | Governance participation |
| governance | Decision-making quality | 1.0 | Consent process |
| care | Reproductive/emotional labor | 1.3 | Care flow verification |
| technical | Specialized technical expertise | 1.1 | Infrastructure, code |

### 1.2 Endorsement Weight Calculation
```typescript
weight = min(1, endorser.cdsScore × typeMultiplier)
// CDS Score: 0-2 (from Bread profile)
// Type multipliers per table above
```

### 1.3 Profile Reputation (Composite)

| Component | Weight | Calculation |
|-----------|--------|-------------|
| CDS Score | 30% | min(1, cdsScore) × 0.3 |
| Endorsements Received | 25% | min(1, totalWeight/20) × 0.25 |
| Governance Participation | 20% | min(1, events/50) × 0.2 |
| Contribution Value | 15% | min(1, totalZNU/10000) × 0.15 |
| Verified Skills | 10% | min(1, skills/10) × 0.1 |

**Total Reputation:** Sum of components, clamped 0-1

### 1.4 Skill Verification

| Requirement | Threshold |
|-------------|-----------|
| Minimum endorsers | 3 |
| Average endorser CDS | ≥0.5 (quorumConfig.cdsThreshold) |
| Auto-verify when met | Yes |

---

## 2. Verification Requests (Quorum-Based)

### 2.1 Request Types

| Type | Purpose | Required Weight | Min Verifiers |
|------|---------|-----------------|---------------|
| vesting-claim | Virginia N3 vesting eligibility | 2.0 | 3 |
| contribution | Verify DisCO contribution | 1.0 | 3 |
| skill | Verify skill endorsement | 1.5 | 3 |
| governance-participation | Governance weight claim | 1.0 | 3 |
| n3-weight | N3 dynamic weight update | 2.0 | 3 |

### 2.2 Quorum Configuration
```typescript
interface BreadQuorumConfig {
  minVerifiers: 3,                    // Minimum 3 for Virginia N3
  cdsThreshold: 0.5,                  // Minimum CDS to verify
  diversityRequired: true,            // Different domains
  maxVerifiersPerDomain: 2,
  timeWindow: 86400000 * 7,           // 7 days
}
```

### 2.3 Verification Flow
1. Request created with required weight
2. Eligible verifiers auto-selected (CDS≥threshold, reputation≥0.4, active 30d)
3. Verifiers submit endorsements
4. Weight accumulated
5. Complete when weight ≥ required AND verifiers ≥ minVerifiers
6. Result applied based on type

---

## 3. Virginia N3 Vesting Integration

### 3.1 Vesting Claim Verification
```typescript
async verifyVestingClaim(n3NodeId):
  // 1. Select N2 verifiers via Bread (CDS-weighted)
  // 2. Create verification request (type: vesting-claim, requiredWeight: 2.0)
  // 3. Simulate verifier endorsements
  // 4. Output PeerVerification for Virginia:
  {
    votingN2Nodes: string[],      // Verifier DIDs
    positiveVotes: number,
    totalVotes: number,
    consensusWeight: number,      // Average endorsement weight
    quorumMet: boolean            // ≥3 verifiers
  }
```

### 3.2 Integration with Virginia Gateway
- Bread output → `VirginiaVestingGateway.peerVerification`
- Used in `computeN3Weight()` calculation
- Triggers `claimVesting()` when eligible

---

## 4. Network Analysis

### 4.1 Endorsement Graph
- Nodes: Profiles (DID, reputation, CDS)
- Edges: Confirmed endorsements (from→to, weight, type)

### 4.2 Centrality Metrics
| Metric | Calculation |
|--------|-------------|
| In-Degree | Count of incoming endorsements |
| Out-Degree | Count of outgoing endorsements |
| PageRank | Weighted by endorser reputation |

---

## 5. TypeScript Implementation Mapping

### 5.1 Core Engine: `BreadEngine`

#### Profile Management
```typescript
createProfile(did, displayName, initialCdsScore): BreadProfile
getProfile(did): BreadProfile
updateProfile(did, updates): boolean
updateCDSScore(did, score): void
getReputation(did): number
```

#### Endorsement System
```typescript
createEndorsement(endorsement): BreadEndorsement
confirmEndorsement(endorsementId): boolean
disputeEndorsement(endorsementId, disputerDid, reason): boolean
revokeEndorsement(endorsementId, revokerDid): boolean
getEndorsementsFor(did): BreadEndorsement[]
getEndorsementsBy(did): BreadEndorsement[]
```

#### Skill Management
```typescript
addSkill(did, skill): BreadSkill
endorseSkill(did, skillId, endorserDid): boolean
// Auto-verify at 3+ endorsers with avg CDS ≥0.5
```

#### Verification Requests
```typescript
createVerificationRequest(request): BreadVerificationRequest
submitEndorsementForVerification(requestId, endorsement): boolean
getVerificationRequest(id): BreadVerificationRequest
getPendingVerificationsFor(did): BreadVerificationRequest[]
```

#### Virginia N3 Integration
```typescript
async verifyVestingClaim(n3NodeId): 
  { eligible, peerVerification: PeerVerification, weight }
```

#### Quorum Configuration
```typescript
updateQuorumConfig(config): void
getQuorumConfig(): BreadQuorumConfig
```

#### Network Analysis
```typescript
getEndorsementNetwork(): { nodes[], edges[] }
calculateCentrality(did): { inDegree, outDegree, pageRank }
```

#### Export
```typescript
exportData(): { profiles, endorsements, verificationRequests, quorumConfig }
```

---

## 6. Integration Points

### 6.1 DisCO CAT Engine
- Peer endorsements → CAT Trust layer
- CDS scores synced from Bread profiles
- Contributions synced: `syncContribution(DisCOContribution)`

### 6.2 Virginia Network
- `verifyVestingClaim()` → `PeerVerification` for Virginia
- N3 weight computation uses Bread reputation
- Vesting eligibility gated by Bread verification

### 6.3 Social Audit Engine
- CDS scores for panel selection
- Reputation for member eligibility
- Endorsement network for conflict detection

### 6.4 Snapshot Voting
- Reputation as VP component
- Verified skills as governance criteria

---

## 7. Acceptance Criteria

### 7.1 Endorsement System
- [ ] 6 endorsement types with correct multipliers
- [ ] Weight = endorser CDS × multiplier, capped at 1
- [ ] Status lifecycle: pending → confirmed/disputed/revoked
- [ ] Auto-confirm for high-reputation endorsers (>0.8)

### 7.2 Reputation Calculation
- [ ] 5 components with correct weights
- [ ] Clamped 0-1
- [ ] Updates on endorsement, skill, governance, contribution changes

### 7.3 Skill Verification
- [ ] Add skill with category, level 1-5
- [ ] Endorse skill increments endorser list
- [ ] Auto-verify at 3+ endorsers, avg CDS ≥0.5

### 7.4 Verification Requests
- [ ] 5 request types with correct thresholds
- [ ] Auto-select eligible verifiers (CDS≥0.5, reputation≥0.4, active 30d)
- [ ] Domain diversity (max 2 per domain)
- [ ] 7-day time window
- [ ] Complete when weight ≥ required AND verifiers ≥ 3

### 7.5 Virginia N3 Integration
- [ ] `verifyVestingClaim()` returns PeerVerification
- [ ] Consensus weight = average endorsement weight
- [ ] Quorum met = ≥3 verifiers

### 7.6 Network Analysis
- [ ] Endorsement graph export (nodes + edges)
- [ ] Centrality: in-degree, out-degree, PageRank

---

## 8. Test Vectors

### 8.1 Endorsement Creation
```typescript
Input: endorser CDS=0.8, type=contribution (1.2), endorsee=alice
Expected: weight = min(1, 0.8 × 1.2) = 0.96
```

### 8.2 Reputation Calculation
```typescript
Input: CDS=0.9, endorsements weight=15, governance=20 events, contributions=5000 ZNU, 5 verified skills
Expected: 
  CDS: 0.9×0.3 = 0.27
  Endorse: min(1,15/20)×0.25 = 0.1875
  Gov: min(1,20/50)×0.2 = 0.08
  Contrib: min(1,5000/10000)×0.15 = 0.075
  Skills: min(1,5/10)×0.1 = 0.05
  Total: 0.6625
```

### 8.3 Vesting Claim
```typescript
Input: n3NodeId, 3 verifiers with CDS [0.7, 0.8, 0.6]
Expected: 
  peerVerification = { votingN2Nodes: 3, positiveVotes: 3, totalVotes: 3, consensusWeight: 0.7, quorumMet: true }
  eligible: true (weight=2.1 ≥ 2.0)
```

---

## 9. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (BreadProfile, BreadEndorsement, PeerVerification) |
| `tq-disco-cat` | 1.0.0 | DisCO CAT integration (sync, CDS scores) |
| `tq-virginia` | 1.0.0 | Virginia gateway types (PeerVerification) |

---

## 10. References

- Bread Verification: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Bread section)
- DisCO CAT: https://manifesto.disco.coop
- Virginia Network: BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Virginia N3 section)

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: endorsements, reputation, skills, verification requests, Virginia N3 integration, network analysis |