// openspec/specs/alrac-tq-colony.md
// OpenSpec: Colony Protocol Integration
// Maps: Colony Protocol (domains, pots, reputation, lazy consensus) → TypeScript Implementation

# SPEC: alrac-tq-colony
**Version:** 1.0.0
**Status:** Designed (Types in tq-types-extended.ts, Engine implementation pending)
**Source:** colony.io, Colony Protocol docs
**Target:** src/core/lib/tq-colony.ts (to be created)

---

## 1. Colony Architecture

### 1.1 Core Concepts

| Concept | Description | Zeitnus Mapping |
|---------|-------------|-----------------|
| Domain | Sub-organization with own pots/reputation | Virginia N2/N3 domains |
| Pot | Token pool with spending rules | Treasury, Ecosystem, Development, Emergency |
| Reputation | Non-transferable governance weight | N3 dynamic weight component |
| Lazy Consensus | Propose → Object → Execute (if no objection) | DisCO consent (80%) |
| Motion | Proposal to move funds/change rules | Snapshot proposal |
| Skill | Verified competence tag | Bread verified skills |

### 1.2 Colony Network Structure

```
Colony Network (Zeitnus Root)
├── N1 Root Domain (Network Governance)
│   ├── Pots: Network Treasury, Protocol Development
│   └── Reputation: Network stewards
├── N2 Sub-Domains (Coordination)
│   ├── Governance Domain
│   │   ├── Pots: Governance Operations
│   │   └── Reputation: Governance participants
│   ├── Ecosystem Domain
│   │   ├── Pots: Ecosystem Fund, Grants
│   │   └── Reputation: Ecosystem contributors
│   └── Tech Domain
│       ├── Pots: Infrastructure, R&D
│       └── Reputation: Technical contributors
└── N3 Project Domains (Production)
    ├── Regeneration Projects
    │   ├── Pots: Project Budget
    │   └── Reputation: Project contributors
    ├── Education Projects
    └── Infrastructure Projects
```

---

## 2. Domain Management

### 2.1 Domain Creation
```typescript
createDomain(name, parentDomainId, pots[]): Domain
// Pots created with: token, spending rules, recovery address
```

### 2.2 Domain Hierarchy
- N1: 1 root domain (network constitution)
- N2: 3-5 sub-domains (functional areas)
- N3: Unlimited project domains (created per project)

### 2.3 Domain Permissions
| Role | Permissions |
|------|-------------|
| Owner | All permissions, can transfer ownership |
| Admin | Manage pots, skills, reputation |
| Member | Create motions, claim reputation, vote |
| Evaluator | Verify reputation claims |

---

## 3. Pot Management

### 3.1 Pot Types

| Pot | Purpose | Token | Spending Rule |
|-----|---------|-------|---------------|
| Network Treasury | Protocol operations | ZNU | Multi-sig (3/5) |
| Ecosystem Fund | Grants, rewards | ZNU | Lazy consensus (7 days) |
| Development Fund | Infrastructure | ZNU | Lazy consensus (14 days) |
| Emergency Fund | Crisis response | ZNU | Guardian veto + 2/3 |
| Project Budget | Project operations | ZNU | Domain owner + 1 evaluator |

### 3.2 Pot Operations
```typescript
moveFunds(potId, amount, recipient, domainId): TxHash
// Requires: reputation ≥ minReputationForPotAccess
// Process: Create motion → Lazy consensus → Execute
```

### 3.3 Pot Recovery
- Recovery address: Multi-sig (N1 stewards)
- Time-lock: 30 days for treasury pots
- Emergency: Guardian veto can freeze

---

## 4. Reputation System

### 4.1 Reputation Types

| Type | Source | Decay | Use Case |
|------|--------|-------|----------|
| Governance | Consent decisions, voting | 5%/year | N2 weight |
| Technical | Code contributions, audits | 10%/year | N3 tech weight |
| Ecological | Verified regeneration milestones | 2%/year | N3 eco weight |
| Care | Care flow contributions | 15%/year | N1 weight |

### 4.2 Reputation Claim Flow
```typescript
claimReputation(domainId, skillId, amount, evidence):
  // 1. Submit claim with evidence
  // 2. Evaluators verify (7 days)
  // 3. If no dispute → reputation minted
  // 4. If disputed → Dispute resolution
```

### 4.3 Reputation → N3 Weight
```typescript
N3WeightComponent = colonyReputation × reputationToWeightMultiplier
// reputationToWeightMultiplier: configurable per domain
// minReputationForPotAccess: threshold for fund movement
```

---

## 5. Lazy Consensus (DisCO Alignment)

### 5.1 Process
```
1. Member creates motion (move funds, change rule, add skill)
2. Motion published to domain
3. Objection period: 7 days (configurable)
4. If no valid objection → Auto-execute
5. If objection → Escalate to Dispute Resolution
```

### 5.2 Objection Rules
- Valid objection: Reputation ≥ 1% domain reputation
- Must state reason and alternative
- Resolved via Dispute Resolution module

### 5.3 DisCO Consent Alignment
| Colony Lazy Consensus | DisCO Consent |
|----------------------|---------------|
| 7-day objection period | 80% consent threshold |
| Reputation-weighted | 1a1v + CDS weight |
| Auto-execute on silence | Integrate on consent |
| Dispute resolution | Block → Mediation |

---

## 6. Skills & Verification

### 6.1 Skill Structure
```typescript
interface Skill {
  id: string
  name: string
  category: 'technical' | 'governance' | 'ecological' | 'care' | 'economic'
  level: 1-5
  verified: boolean
  evaluators: string[]  // DIDs
}
```

### 6.2 Skill Verification (Bread Integration)
- Bread verified skills → Colony skills auto-verified
- Minimum 3 Bread endorsers with avg CDS ≥ 0.5
- Colony evaluators can also verify

### 6.3 Skill-Gated Operations
| Operation | Required Skill | Level |
|-----------|---------------|-------|
| Move treasury funds | treasury-management | 3 |
| Create domain | domain-architecture | 4 |
| Verify reputation | reputation-evaluation | 3 |
| Guardian action | ecological-oversight | 5 |

---

## 7. TypeScript Implementation Mapping (Design)

### 7.1 Core Engine: `ColonyEngine`

```typescript
class ColonyEngine {
  // Network & Domains
  createDomain(config): Domain
  getDomain(id): Domain
  listDomains(): Domain[]
  
  // Pots
  createPot(domainId, config): Pot
  moveFunds(potId, amount, recipient): TxHash
  getPot(id): Pot
  
  // Reputation
  claimReputation(domainId, skillId, amount, evidence): ReputationClaim
  verifyReputationClaim(claimId, evaluatorDid, approve): boolean
  getReputation(did, domainId): number
  
  // Lazy Consensus
  createMotion(motion): Motion
  objectMotion(motionId, objectorDid, reason): boolean
  executeMotion(motionId): TxHash
  
  // Skills
  addSkill(domainId, skill): Skill
  verifySkill(skillId, evaluatorDid): boolean
  
  // Dispute Resolution
  raiseDispute(motionId, reason): Dispute
  resolveDispute(disputeId, resolution): boolean
  
  // Virginia Integration
  syncVirginiaMapping(): VirginiaColonyMapping
  getN3WeightContribution(nodeId): number
}
```

### 7.2 Virginia Mapping
```typescript
interface VirginiaColonyMapping {
  n1RootDomainId: string
  n2SubDomainIds: string[]          // governance, ecosystem, tech
  n3ProjectDomainIds: string[]      // regeneration, education, infrastructure
  n3FundDomainIds: string[]         // ecosystem, development, emergency
  reputationToWeightMultiplier: number  // 0.03 (3%)
  minReputationForPotAccess: number     // 500
}
```

---

## 8. Integration Points

### 8.1 Virginia Network
- N3 weight includes colonyReputation × 0.03
- Pot access gated by minReputationForPotAccess
- Domain hierarchy mirrors Virginia N1/N2/N3

### 8.2 DisCO CAT
- Consent decisions → Reputation claims
- Domain voting → Colony motions
- Pot balances → Transparency layer

### 8.3 Bread Engine
- Verified skills → Colony skills
- CDS scores → Reputation evaluator eligibility
- Peer endorsements → Reputation evidence

### 8.4 Snapshot Voting
- Motions mirrored as Snapshot proposals
- Reputation as VP component
- Execution payloads → Colony executeMotion()

### 8.5 Aragon OSx
- Colony domains ↔ Aragon OSx modules
- Pots ↔ Aragon treasury
- Reputation ↔ Aragon reputation module

---

## 9. Acceptance Criteria

### 9.1 Domain Hierarchy
- [ ] N1 root domain with network pots
- [ ] N2 sub-domains (governance, ecosystem, tech)
- [ ] N3 project domains created dynamically
- [ ] Parent-child relationships maintained

### 9.2 Pot Operations
- [ ] 5 pot types with correct rules
- [ ] moveFunds requires reputation threshold
- [ ] Lazy consensus with 7-day objection
- [ ] Emergency freeze via Guardian

### 9.3 Reputation
- [ ] 4 reputation types with decay rates
- [ ] Claim → Verify → Mint flow
- [ ] Dispute resolution integration
- [ ] N3 weight contribution (3%)

### 9.4 Lazy Consensus
- [ ] Motion creation with evidence
- [ ] Objection period configurable
- [ ] Auto-execute on silence
- [ ] Objection → Dispute resolution

### 9.5 Skills
- [ ] 5 skill categories
- [ ] Bread verification auto-sync
- [ ] Skill-gated operations

---

## 10. Test Vectors

### 10.1 Domain Creation
```typescript
Input: createDomain("Ecosystem", n1RootId, [ecosystemFund, grantsPot])
Expected: domainId, pots created, parent=n1RootId
```

### 10.2 Reputation Claim
```typescript
Input: claimReputation(ecosystemDomain, "regenerative-agriculture", 100, evidence)
Evaluator: approves after 7 days
Expected: reputation=100 added, N3 weight += 3
```

### 10.3 Lazy Consensus
```typescript
Input: moveFunds(ecosystemFund, 10000, projectX)
No objection in 7 days
Expected: Auto-executed, funds moved
```

---

## 11. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types |
| `tq-virginia` | 1.0.0 | Virginia mapping |
| `tq-disco-cat` | 1.0.0 | Consent alignment |
| `tq-bread` | 1.0.0 | Skill verification |
| `tq-snapshot` | 1.0.0 | Proposal mirroring |
| `tq-aragon` | 1.0.0 | OSx integration |

---

## 12. References

- Colony Protocol: https://colony.io/docs
- Colony Whitepaper: https://colony.io/whitepaper
- Lazy Consensus: https://docs.colony.io/lazy-consensus
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Colony integration)

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Spec design: Domain hierarchy, pots, reputation, lazy consensus, skills, Virginia mapping |