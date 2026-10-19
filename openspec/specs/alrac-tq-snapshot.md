// openspec/specs/alrac-tq-snapshot.md
// OpenSpec: Snapshot Parallel Voting Implementation
// Maps: snapshot.org strategies, spaces → TypeScript Implementation

# SPEC: alrac-tq-snapshot
**Version:** 1.0.0
**Status:** Implemented
**Source:** snapshot.org, snapshot.js strategies
**Target:** src/core/lib/tq-snapshot.ts

---

## 1. Snapshot Architecture

### 1.1 Space Configuration

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique space identifier |
| name | string | Display name |
| network | enum | mainnet/polygon/gnosis/arbitrum/optimism/base/testnet |
| symbol | string | Token symbol |
| domain | string | ENS domain |
| about | string | Description |
| avatar | string | IPFS image |
| skin | string | UI theme |
| filters | Filter[] | Proposal categorization |
| plugins | string[] | Integrated engines |
| members | string[] | DIDs of members |
| admins | string[] | DIDs of admins |
| validators | Validator[] | Voting power sources |
| strategies | StrategyConfig[] | VP calculation methods |

### 1.2 Validators (Voting Power Sources)

| Type | Description | Example |
|------|-------------|---------|
| erc20 | ERC-20 token balance | ZNU, VILLAGE token |
| erc721 | NFT ownership | Membership NFTs |
| erc1155 | Multi-token | Badge collections |
| custom | Custom contract | Reputation contract |
| tq-ledger | TQ Ledger production | sqrt(kWh) |
| disco-cat | DisCO CAT score | trust × transparency × participation |

### 1.3 Strategy Implementations (9)

| Strategy | Name | VP Calculation |
|----------|------|----------------|
| ERC20 Balance | erc20-balance-of | balanceOf(voter) / decimals |
| ERC20 with Balance | erc20-with-balance-of | balance with delegation |
| TQ Ledger | tq-ledger | sqrt(total kWh produced) × 10 |
| DisCO CAT | disco-cat | trustScore×0.4 + transparency×0.3 + participation×0.3 |
| OASA Compliance | oasa-compliance | (0.5 + compliance) × 1000 |
| Quadratic Voting | quadratic-voting | Voice credits budget |
| Conviction Voting | conviction-voting | stake × (1 - decay^time) |
| Holographic Consensus | holographic-consensus | base VP + predictor bonus |
| One Person One Vote | one-person-one-vote | 1 if member, 0 otherwise |

---

## 2. Proposal Lifecycle

### 2.1 States
```
pending → active → closed → executed
                ↓
            cancelled
```

### 2.2 Proposal Structure
```typescript
interface SnapshotProposal {
  id: string
  spaceId: string
  title: string
  body: string
  choices: string[]
  start: number          // Unix timestamp
  end: number            // Unix timestamp
  snapshot: number       // Block number or timestamp
  state: 'pending' | 'active' | 'closed' | 'executed' | 'cancelled'
  author: string
  votes: Map<string, SnapshotVote>
  scores: number[]       // Per choice
  totalVotes: number
  totalVoters: number
  quorum: number
  threshold: number
  executionPayloads: ExecutionPayload[]
  raoCredentialId: string
  linkedOASAArticle?: number
  linkedDisCOPrinciple?: number
}
```

### 2.3 Vote Structure
```typescript
interface SnapshotVote {
  voter: string
  choice: number          // Index in choices
  weight: number          // Total VP
  vp: number              // Alias for weight
  vpByStrategy: Record<string, number>  // Breakdown by strategy
  reason?: string
  timestamp: number
  signature: string
}
```

---

## 3. Preset Spaces for Zeitnus

### 3.1 Zeitnus Main Governance
- **Network**: Polygon
- **Symbol**: ZNU
- **Domain**: gov.zeitnus.org
- **Validators**: ZNU Token, TQ Ledger, DisCO CAT
- **Strategies**: TQ Ledger, DisCO CAT, OASA Compliance, 1a1v
- **Plugins**: tq-disco-cat, tq-oasa, tq-virginia, tq-aragon

### 3.2 Village Space (per village)
- **Network**: Gnosis
- **Symbol**: VILLAGE
- **Domain**: {villageId}.gov.closer.earth
- **Validators**: Village Token, OASA Compliance
- **Strategies**: ERC20, OASA Compliance, 1a1v
- **Plugins**: tq-closer, tq-oasa

### 3.3 DHO Space (per DHO)
- **Network**: Polygon
- **Symbol**: DHO
- **Domain**: {dhoId}.dho.zeitnus.org
- **Validators**: DisCO CAT, TQ Ledger
- **Strategies**: DisCO CAT, TQ Ledger, 1a1v
- **Plugins**: tq-disco-cat, tq-virginia, tq-berry-vesting

### 3.4 Gran Alianza Federation
- **Network**: Mainnet
- **Symbol**: GAV
- **Domain**: gov.gran-alianza.vida
- **Validators**: GAV Token, OASA Guardians
- **Strategies**: Holographic Consensus, OASA Compliance, Conviction Voting
- **Plugins**: tq-oasa, tq-aragon, tq-virginia

---

## 4. TypeScript Implementation Mapping

### 4.1 Core Engine: `SnapshotEngine`

#### Space Management
```typescript
createSpace(space): SnapshotSpace
getSpace(id): SnapshotSpace
listSpaces(): SnapshotSpace[]
updateSpace(id, updates): boolean
```

#### Strategy Management
```typescript
registerStrategy(strategy): void
getStrategy(name): SnapshotStrategy
async calculateTotalVP(spaceId, voter, snapshot): { total, byStrategy }
```

#### Proposal Lifecycle
```typescript
createProposal(proposal): SnapshotProposal
async vote(proposalId, vote): boolean
closeProposal(proposalId): { passed, winningChoice, scores }
executeProposal(proposalId): boolean
getProposal(id): SnapshotProposal
listProposals(spaceId?, state?): SnapshotProposal[]
```

#### Preset Factories
```typescript
createZeitnusMainSpace(): SnapshotSpace
createVillageSpace(villageId, villageName): SnapshotSpace
createDHOSpace(dhoId, dhoName): SnapshotSpace
createGranAlianzaSpace(): SnapshotSpace
```

#### Engine Integration
```typescript
setTQLedgerTransactions(transactions): void
setDisCOEngine(engine): void
setOASAEngine(engine): void
```

---

## 5. Integration Points

### 5.1 TQ Ledger Strategy
- Inputs: TQTransaction[] (production only)
- VP = sqrt(sum kWh) × 10
- Reduces whale dominance via square root

### 5.2 DisCO CAT Strategy
- Inputs: DisCO_CAT_Engine
- VP = trustScore×0.4 + transparencyScore×0.3 + participationBonus×0.3
- Participation = consent decisions participated / 10 (capped)

### 5.3 OASA Compliance Strategy
- Inputs: OASAConstitutionEngine
- Finds voter's village
- VP = (0.5 + compliance) × 1000
- Non-village voters get base 100

### 5.4 Snapshot ↔ Virginia
- Virginia N3 weight → Snapshot VP component
- Snapshot proposals → Virginia governance actions
- Colony domain votes → Snapshot domain voting

---

## 6. Acceptance Criteria

### 6.1 Space Management
- [ ] Create space with all fields
- [ ] Validators support 6 types
- [ ] Strategies configurable per space
- [ ] Filters for proposal categorization

### 6.2 Strategy Implementations
- [ ] All 9 strategies implemented
- [ ] VP calculation returns numeric values
- [ ] Strategy params configurable
- [ ] Total VP = sum of strategy VPs

### 6.3 Proposal Lifecycle
- [ ] Create with choices, timing, quorum, threshold
- [ ] Vote validates timing, choice index, calculates VP
- [ ] Close checks quorum + threshold
- [ ] Execute only if passed

### 6.4 Preset Spaces
- [ ] 4 preset factories work
- [ ] Correct networks, validators, strategies
- [ ] Plugin integration declared

---

## 7. Test Vectors

### 7.1 VP Calculation
```typescript
Input: TQ Ledger: 10000 kWh produced by voter
Expected: VP = sqrt(10000) × 10 = 1000

Input: DisCO CAT: trust=0.8, transparency=0.9, participation=5 decisions
Expected: VP = (0.8×0.4 + 0.9×0.3 + 0.5×0.3) × 1000 = 740

Input: OASA Compliance: village compliance=0.85
Expected: VP = (0.5 + 0.85) × 1000 = 1350
```

### 7.2 Proposal Flow
```typescript
Input: Create proposal with 3 choices, 7-day voting, quorum=1000, threshold=0.51
Votes: 600 for choice 0, 300 for choice 1, 200 for choice 2
Expected: passed=true, winningChoice=0, scores=[600,300,200]
```

---

## 8. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (SnapshotSpace, SnapshotProposal, etc.) |
| `tq` | 1.0.0 | TQTransaction for TQ Ledger strategy |
| `tq-disco-cat` | 1.0.0 | DisCO CAT engine for strategy |
| `tq-oasa` | 1.0.0 | OASA engine for compliance strategy |

---

## 9. References

- Snapshot.js: https://github.com/snapshot-labs/snapshot.js
- Snapshot Strategies: https://docs.snapshot.org/docs/strategies
- Snapshot Spaces: https://snapshot.org/#/
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Governance section)

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: 9 strategies, space management, proposal lifecycle, 4 preset spaces, engine integration |