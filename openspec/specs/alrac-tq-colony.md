// openspec/specs/alrac-tq-colony.md
// OpenSpec: Colony Protocol Integration
// Maps: Colony Protocol (domains, pots, reputation, lazy consensus) → TypeScript Implementation
// Solarpunk Utopia Integration: Bioregional governance, regenerative economics, mesh coordination

# SPEC: alrac-tq-colony
**Version:** 1.0.0
**Status:** Implemented
**Source:** colony.io, Colony Protocol docs
**Target:** src/core/lib/tq-colony.ts
**Solarpunk Utopia Context:** Bioregional DAOs, solar commons governance, regenerative resource allocation

---

## 1. Colony Architecture

### 1.1 Core Concepts

| Concept | Description | Zeitnus Mapping | Solarpunk Utopia Mapping |
|---------|-------------|-----------------|--------------------------|
| Domain | Sub-organization with own pots/reputation | Virginia N2/N3 domains | Bioregional DAO / Solar Commons |
| Pot | Token pool with spending rules | Treasury, Ecosystem, Development, Emergency | Solar Infrastructure Fund / Water Fund / Seed Fund |
| Reputation | Non-transferable governance weight | N3 dynamic weight component | Regenerative Contribution Score |
| Lazy Consensus | Propose → Object → Execute (if no objection) | DisCO consent (80%) | Do-Ocracy / Rough Consensus |
| Motion | Proposal to move funds/change rules | Snapshot proposal | Community Proposal |
| Skill | Verified competence tag | Bread verified skills | Regenerative Practitioner Certification |

### 1.2 Colony Network Structure (Solarpunk Utopia)

```
Colony Network (Zeitnus Root = Solar Commons Charter)
├── N1 Root Domain (Network Governance = Solar Commons Council)
│   ├── Pots: Network Treasury, Protocol Development
│   └── Reputation: Network Stewards (Guardians of the Mesh)
├── N2 Sub-Domains (Coordination = Bioregional Councils)
│   ├── Governance Domain
│   │   ├── Pots: Governance Operations
│   │   └── Reputation: Governance Participants
│   ├── Ecosystem Domain
│   │   ├── Pots: Ecosystem Fund, Grants
│   │   └── Reputation: Regenerative Contributors
│   └── Tech Domain
│       ├── Pots: Solar Infrastructure, R&D
│       └── Reputation: Solar Engineers
└── N3 Project Domains (Production = Solar Villages)
    ├── Solar Array Projects
    │   ├── Pots: Array Budget, Maintenance
    │   └── Reputation: Solar Builders
    ├── Water Regeneration Projects
    └── Agroforestry Projects
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

### 2.3 Domain Permissions (Solarpunk Roles)
| Role | Permissions | Solarpunk Utopia Role |
|------|-------------|----------------------|
| Owner | All permissions, can transfer ownership | Charter Steward |
| Admin | Manage pots, skills, reputation | Council Facilitator |
| Member | Create motions, claim reputation, vote | Village Resident |
| Evaluator | Verify reputation claims | Peer Reviewer / Elder |

---

## 3. Pot Management

### 3.1 Pot Types

| Pot | Purpose | Token | Spending Rule | Solarpunk Use Case |
|-----|---------|-------|---------------|-------------------|
| Network Treasury | Protocol operations | ZNU | Multi-sig (3/5) | Solar Commons Reserve |
| Ecosystem Fund | Grants, rewards | ZNU | Lazy consensus (7 days) | Regeneration Grants |
| Development Fund | Infrastructure | ZNU | Lazy consensus (14 days) | Solar Array Construction |
| Emergency Fund | Crisis response | ZNU | Guardian veto + 2/3 | Disaster Response / Mesh Repair |
| Project Budget | Project operations | ZNU | Domain owner + 1 evaluator | Village Project Fund |

### 3.2 Pot Operations
```typescript
moveFunds(potId, amount, recipient, domainId): TxHash
// Requires: reputation ≥ minReputationForPotAccess
// Process: Create motion → Lazy consensus → Execute
```

### 3.3 Pot Recovery
- Recovery address: Multi-sig (N1 stewards = Charter Council)
- Time-lock: 30 days for treasury pots
- Emergency: Guardian veto can freeze (Mesh Guardian)

---

## 4. Reputation System

### 4.1 Reputation Types

| Type | Source | Decay | Use Case | Solarpunk Metric |
|------|--------|-------|----------|------------------|
| Governance | Consent decisions, voting | 5%/year | N2 weight | Assembly Participation |
| Technical | Code contributions, audits | 10%/year | N3 tech weight | Solar Engineering |
| Ecological | Verified regeneration milestones | 2%/year | N3 eco weight | Soil Carbon / Biodiversity |
| Care | Care flow contributions | 15%/year | N1 weight | Community Care Hours |

### 4.2 Reputation Claim Flow
```typescript
claimReputation(domainId, skillId, amount, evidence):
  // 1. Submit claim with evidence (photos, measurements, peer attestations)
  // 2. Evaluators verify (7 days = lunar cycle)
  // 3. If no dispute → reputation minted
  // 4. If disputed → Dispute resolution (mediation circle)
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
2. Motion published to domain (mesh broadcast)
3. Objection period: 7 days (configurable = lunar phase)
4. If no valid objection → Auto-execute
5. If objection → Escalate to Dispute Resolution (mediation circle)
```

### 5.2 Objection Rules
- Valid objection: Reputation ≥ 1% domain reputation
- Must state reason and alternative (constructive dissent)
- Resolved via Dispute Resolution module (mediation circle)

### 5.3 DisCO Consent Alignment
| Colony Lazy Consensus | DisCO Consent | Solarpunk Practice |
|----------------------|---------------|-------------------|
| 7-day objection period | 80% consent threshold | Lunar cycle review |
| Reputation-weighted | 1a1v + CDS weight | Merit + Care balance |
| Auto-execute on silence | Integrate on consent | Do-ocracy |
| Dispute resolution | Block → Mediation | Mediation circle |

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

### 6.2 Skill Categories (Solarpunk Utopia)

| Category | Skills | Verification Method |
|----------|--------|---------------------|
| Technical | Solar installation, mesh networking, battery systems | Bread + practical demo |
| Governance | Facilitation, mediation, charter stewardship | Peer endorsement + track record |
| Ecological | Soil regeneration, water harvesting, biodiversity | OASA milestone + peer review |
| Care | Childcare, eldercare, conflict resolution, health | Care flow tracking + community attestation |
| Economic | Circular design, gift economy, mutual credit | ValueFlows tracking + outcomes |

### 6.3 Skill Verification (Bread Integration)
- Bread verified skills → Colony skills auto-verified
- Minimum 3 Bread endorsers with avg CDS ≥ 0.5
- Colony evaluators can also verify (mesh peers)

### 6.4 Skill-Gated Operations (Solarpunk Permissions)
| Operation | Required Skill | Level | Solarpunk Context |
|-----------|---------------|-------|-------------------|
| Move treasury funds | treasury-management | 3 | Commons Steward |
| Create domain | domain-architecture | 4 | Bioregional Founder |
| Verify reputation | reputation-evaluation | 3 | Elder / Peer Reviewer |
| Guardian action | ecological-oversight | 5 | Mesh Guardian |

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

### 7.2 Virginia Mapping (Solarpunk)
```typescript
interface VirginiaColonyMapping {
  n1RootDomainId: string                    // "domain-root-zeitnus" = Solar Commons Charter
  n2SubDomainIds: string[]                  // governance, ecosystem, tech = Bioregional Councils
  n3ProjectDomainIds: string[]              // regeneration, education, infrastructure = Village Projects
  n3FundDomainIds: string[]                 // ecosystem, development, emergency = Solar/Water/Seed Funds
  reputationToWeightMultiplier: number      // 0.03 (3%)
  minReputationForPotAccess: number         // 500
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

### 8.6 Solarpunk Utopia
- Solar mesh node reputation → Colony reputation
- Energy production → Ecological reputation
- P2P energy trading → Economic reputation
- Community care → Care reputation

### 9.1 Domain Hierarchy
- [ ] N1 root domain with network pots (Solar Commons Reserve)
- [ ] N2 sub-domains (governance, ecosystem, tech = Bioregional Councils)
- [ ] N3 project domains created dynamically (Solar Villages)
- [ ] Parent-child relationships maintained

### 9.2 Pot Operations
- [ ] 5 pot types with correct rules (Solarpunk fund types)
- [ ] moveFunds requires reputation threshold
- [ ] Lazy consensus with 7-day objection (lunar cycle)
- [ ] Emergency freeze via Guardian (Mesh Guardian)

### 9.3 Reputation
- [ ] 4 reputation types with decay rates
- [ ] Claim → Verify → Mint flow
- [ ] Dispute resolution integration (mediation circle)
- [ ] N3 weight contribution (3%)

### 9.4 Lazy Consensus
- [ ] Motion creation with evidence
- [ ] Objection period configurable (7/14 days)
- [ ] Auto-execute on silence (do-ocracy)
- [ ] Objection → Dispute resolution (mediation circle)

### 9.5 Skills
- [ ] 5 skill categories (Solarpunk categories)
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

### 10.4 Solarpunk Skill Verification
```typescript
Input: addSkill(did, { name: "solar-installation", category: "technical", level: 4 })
Bread endorsers: 3 with avg CDS ≥ 0.5
Expected: skill.verified = true, Colony skill auto-verified
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
| `tq-solarpunk` | 1.0.0 | Solar mesh, regenerative metrics (Fase 4) |

---

## 12. References

- Colony Protocol: https://colony.io/docs
- Colony Whitepaper: https://colony.io/whitepaper
- Lazy Consensus: https://docs.colony.io/lazy-consensus
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Colony integration)
- Solarpunk Utopia: Solar mesh, bioregional governance, regenerative villages

---

## 13. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation with Solarpunk Utopia integration |