// openspec/specs/alrac-tq-disco-cat.md
// OpenSpec: DisCO CAT Engine Implementation
// Maps: DisCO Manifesto (7 Principles, 3 Flows, 4 Phases) → TypeScript Implementation

# SPEC: alrac-tq-disco-cat
**Version:** 1.0.0
**Status:** Implemented
**Source:** manifesto.disco.coop, elements.disco.coop, ball.disco.coop
**Target:** src/core/lib/tq-disco-cat.ts

---

## 1. DisCO Architecture (CAT: Confianza/Asamblea/Transparencia)

### 1.1 Three Flows (Value Circuits)

| Flow | Spanish | Virginia Layer | Purpose | Weight in N3 |
|------|---------|----------------|---------|--------------|
| Livelihood | Sustento | N3 | TQ/ZNU generation, productive work | 1.0 |
| Love | Amor | N2 | Coordination, CDS, governance, relationships | 0.3 |
| Care | Cuidado | N1 | Autogestión, reproductive labor, Urbanika | 0.1 |

**Flow-to-Virginia Mapping:**
```typescript
DISCO_FLOW_TO_VIRGINIA = {
  livelihood: 'N3',  // TQ/ZNU generation
  love: 'N2',        // Coordination/CDS
  care: 'N1'         // Autogestión/Urbanika
}
```

**Weight Multipliers:**
```typescript
DISCO_FLOW_WEIGHTS = {
  livelihood: { N3: 1.0, N2: 0.3, N1: 0.1 },
  love: { N3: 0.2, N2: 1.0, N1: 0.3 },
  care: { N3: 0.1, N2: 0.2, N1: 1.0 }
}
```

### 1.2 Seven DisCO Principles

| # | Principle | Description | Related |
|---|-----------|-------------|---------|
| 1 | Relationships Over Transactions | Prioritize human relationships over extractive transactions | 2, 3, 7 |
| 2 | Care Before Code | Care work recognized, valued, compensated before technical production | 1, 3, 5 |
| 3 | DIWO (Do It With Others) | Collaboration over competition, shared ownership, collective intelligence | 1, 4, 6 |
| 4 | Transparency & Open Culture | Radical transparency, open source by default | 3, 5, 7 |
| 5 | Diversity & Inclusion | Neurodiversity, cultural, gender diversity as strength | 2, 4, 6 |
| 6 | Federation Over Scale | Grow through federation of autonomous units, subsidiarity | 3, 5, 7 |
| 7 | Regenerative & Just | Ecological regeneration and social justice as core metrics | 1, 2, 6 |

### 1.3 DisCO Values

| Value | Description | Related Principles |
|-------|-------------|-------------------|
| Trust | Foundation of collaboration, built through reliability | 1, 4 |
| Reciprocity | Mutual exchange without immediate quid pro quo | 1, 3 |
| Autonomy | Self-governance at every level, subsidiarity | 3, 6 |
| Care | Attending to needs of self, others, planet | 2, 7 |
| Learning | Continuous collective learning, failure as data | 3, 4 |

### 1.4 DisCO Elements (8 Chapters)

| ID | Name | Category | Implementation |
|----|------|----------|----------------|
| cat-trust | Trust Layer (C) | governance | core |
| cat-assembly | Assembly Layer (A) | governance | core |
| cat-transparency | Transparency Layer (T) | economic | core |
| three-flows | Three Flows | economic | core |
| phases | DisCO Phases A-D | governance | core |
| cultural-protocols | Cultural Protocols | care | core |
| legal-wrapper | Legal Wrapper | legal | optional |
| ai-2020s | AI in 2020s | tech | experimental |

---

## 2. Four Phases (A-D) with Transition Criteria

### Phase A: Emergent (CO Emergente 1.0-1.99)
| Criterion | Target |
|-----------|--------|
| Min Members | 10 |
| Min Active Flows | 3 |
| Min Consent Decisions | 5 |
| Min Transparency Score | 0.6 |
| Virginia N3 Count | 3 |
| Avg N3 Weight | 0.8 |
| Vesting Completion Rate | 0.2 |

**Transition Actions:** Activate Colony pots, Enable Berry vesting, Register as pilot node

### Phase B: Consolidated (CO Consolidado 2.0-2.99)
| Criterion | Target |
|-----------|--------|
| Min Members | 50 |
| Min Active Flows | 10 |
| Min Consent Decisions | 20 |
| Min Transparency Score | 0.8 |
| Virginia N3 Count | 9 |
| Avg N3 Weight | 1.2 |
| Vesting Completion Rate | 0.5 |

**Transition Actions:** Activate N3→N3 mentoring, Enable ZNU emissions (Capa 3), Register as anchor node

### Phase C: Mature (CO Maduro ≥3.0)
| Criterion | Target |
|-----------|--------|
| Min Members | 100 |
| Min Active Flows | 20 |
| Min Consent Decisions | 50 |
| Min Transparency Score | 0.9 |
| Virginia N3 Count | 27 |
| Avg N3 Weight | 1.5 |
| Vesting Completion Rate | 0.8 |

**Transition Actions:** Activate multi-DHO federation, Sovereign ZNU emissions, Shared treasury

### Phase D: Federated (Federación Ontogenética ≥3.0 + η_fed)
| Criterion | Target |
|-----------|--------|
| Min Members | 200 |
| Min Active Flows | 50 |
| Min Consent Decisions | 100 |
| Min Transparency Score | 0.95 |
| Virginia N3 Count | 100 |
| Avg N3 Weight | 2.0 |
| Vesting Completion Rate | 0.9 |

**Transition Actions:** Full federation, Treaty + RAO sync + Treasury, Sovereign emissions

---

## 3. TypeScript Implementation Mapping

### 3.1 Core Engine: `DisCO_CAT_Engine`

#### C - CONFIANZA (Trust)
```typescript
// RAO Credentials (ERC-8004 + RAO)
addRAOCredential(memberDid, raoCredentialId): void

// CDS Scores
updateCDSScore(memberDid, score): void

// Peer Endorsements (Bread verification)
addPeerEndorsement(endorsement: PeerEndorsement): void

// Trust Score Calculation
// trustScore = RAO_presence(0.3) + avgCDS(0.4) + peer_endorsements(0.3)
getTrustScore(): number
```

#### A - ASAMBLEA (Governance)
```typescript
// Consent Decisions (80% threshold, 1a1v)
proposeConsentDecision(proposer, proposal): ConsentDecision
voteConsent(decisionId, voter, choice, raoCredentialId): boolean
integrateDecision(decisionId): boolean

// Domain Voting (Colony integration)
recordDomainVote(domainId, voter, choice, weight): void
```

#### T - TRANSPARENCIA (Transparency)
```typescript
// ValueFlows accounting
recordValueFlow(flow: ValueFlowRecord): void

// TQ Ledger sync
recordTQTransaction(tx: TQTransaction): void

// Vesting schedules per member
updateVestingSchedule(memberDid, tranches): void

// Colony pot balances
updatePotBalance(potId, balance): void

// Audit trail
addAuditEntry(entry): void
```

#### Three Flows Tracking
```typescript
recordContribution(contribution: DisCOContribution): void
getFlowContributions(flowType): DisCOContribution[]
getTotalFlowValue(flowType): number
getAllFlowsSummary(): { livelihood, love, care: { count, totalValue, verifiedCount } }
```

#### Phase Management
```typescript
getCurrentPhase(): DisCOPhase
evaluatePhaseTransition(): { canTransition, nextPhase, gaps }
transitionPhase(): boolean
```

#### Transparency Scoring
```typescript
getTransparencyScore(): number
// Factors: value flows coverage, vesting coverage, pot balances, TQ ledger, audit trail
```

#### Member Management
```typescript
addMember(did, cdsScore): void
removeMember(did): boolean
getMember(did): Member
getAllMembers(): Member[]
```

#### Snapshot Export
```typescript
snapshot(): {
  phase, members, trustScore, transparencyScore,
  flows: { livelihood, love, care: { count, totalValue } },
  consentDecisions: { proposed, approved, blocked, integrated },
  auditEntries
}
```

---

## 4. Integration Points

### 4.1 Bread Verification Engine
- Peer endorsements → `BreadEngine.createEndorsement()`
- CDS scores synced from Bread profiles
- Verification requests for vesting claims → `BreadEngine.verifyVestingClaim()`

### 4.2 Virginia Network
- Livelihood flow → N3 dynamic weight calculation
- Love flow → N2 coordination/CDS
- Care flow → N1 Urbanika autogestión
- Phase transitions trigger Virginia N3 count updates

### 4.3 Colony Protocol
- Domain voting integrated in Assembly layer
- Pot balances tracked in Transparency layer
- Reputation from Colony → CDS score component

### 4.4 ValueFlows
- Contributions recorded as Economic Events
- Recipes for production processes
- Resource accounting for 3 flows

### 4.5 Snapshot Voting
- `DisCOCATStrategy` for voting power calculation
- Trust Score × Transparency × Participation = VP

### 4.6 Social Audit
- Care flow activity → Track 3 criterion
- Consent participation → Track 3 criterion
- Stale blocks detection → Track 3 criterion
- Transparency score → Track 3 criterion

---

## 5. Acceptance Criteria

### 5.1 CAT Layers
- [ ] Trust: RAO credentials, CDS scores, peer endorsements, composite trust score
- [ ] Assembly: Consent decisions (propose/vote/integrate), 80% threshold, 1a1v, domain voting
- [ ] Transparency: ValueFlows, vesting schedules, pot balances, TQ ledger, audit trail

### 5.2 Three Flows
- [ ] Livelihood (N3): TQ/ZNU generation tracking
- [ ] Love (N2): Governance coordination tracking
- [ ] Care (N1): Autogestión/Urbanika tracking
- [ ] Flow-to-Virginia mapping correct
- [ ] Weight multipliers applied

### 5.3 Phase Transitions
- [ ] 4 phases with correct criteria
- [ ] Evaluation checks all criteria
- [ ] Gaps reported accurately
- [ ] Transition requires consent (configurable)

### 5.4 Transparency Scoring
- [ ] 5 factors weighted equally
- [ ] Score 0-1
- [ ] Updates on new data

---

## 6. Test Vectors

### 6.1 Contribution Recording
```typescript
Input: { memberId: "did:key:alice", flowType: "livelihood", value: 100, description: "Solar installation" }
Expected: Added to livelihood flow, Bread sync, VF event recorded
```

### 6.2 Consent Decision
```typescript
Input: proposer="alice", proposal="Increase transparency threshold to 85%"
Votes: alice=consent, bob=consent, carol=consent, dave=concern
Expected: status=approved (75% consent), integrated=true
```

### 6.3 Phase Transition
```typescript
State: 12 members, 5 active flows, 8 consent decisions, transparency=0.65, 3 N3 nodes
Expected: canTransition=false, gaps=["Members 12/50", "Active flows 5/10", "Transparency 0.65/0.8"]
```

---

## 7. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (DisCO_CAT, DisCOContribution, etc.) |
| `tq-bread` | 1.0.0 | Peer endorsement & verification |
| `tq-valueflows` | 1.0.0 | Economic event recording |
| `tq-virginia` | 1.0.0 | N3 weight integration |
| `tq-colony` | 1.0.0 | Domain voting & pots |

---

## 8. References

- DisCO Manifesto: https://manifesto.disco.coop
- DisCO Elements: https://elements.disco.coop
- DisCO Ball: https://ball.disco.coop
- DisCO Pink: https://pink.disco.coop
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Phases A-D criteria)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: CAT engine, 3 flows, 4 phases, 7 principles, transparency scoring |