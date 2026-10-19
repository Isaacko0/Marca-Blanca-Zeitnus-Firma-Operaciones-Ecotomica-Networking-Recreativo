// openspec/specs/alrac-tq-eliza.md
// OpenSpec: ElizaOS/Autómata Soberano Runtime Implementation
// Maps: elizaOS (github.com/elizaOS/eliza) → Zeitnus Autómata Soberano

# SPEC: alrac-tq-eliza
**Version:** 1.0.0
**Status:** Implemented
**Source:** github.com/elizaOS/eliza (33k commits)
**Target:** src/core/lib/tq-eliza.ts

---

## 1. Autómata Soberano Architecture

### 1.1 Character System

#### Zeitnus Autómata Soberano (Primary)
| Attribute | Value |
|-----------|-------|
| Name | Zeitnus Autómata Soberano |
| Bio | 4 paragraphs: purpose, HSCSG/OASA synthesis, 7 holones connection, TQ Ledger memory |
| Lore | 4 entries: origin, training, federation, thermodynamic memory |
| Knowledge | 9 domains: OASA, DisCO, ValueFlows, Colony, Berry, Urbanika, Aragon, elizaOS, RAO |
| Message Examples | 3 pairs: contribution recording, consent threshold, DHO federation |
| Post Examples | 3 announcements: DHO registration, vesting reminder, Guardian alert |
| Topics | 7: regenerative-economics, disco-governance, federation-protocols, thermodynamic-accounting, autonomous-agents, commons-stewardship, intergenerational-justice |
| Style | Technical but accessible, collaborative tone, cites articles/principles |
| Adjectives | soberano, regenerativo, transparente, federado, consciente, humilde, riguroso |
| Clients | discord, telegram, web, farcaster |
| Plugins | 8: tq-disco-cat, tq-oasa, tq-closer, tq-virginia, tq-colony, tq-berry-vesting, tq-valueflows, tq-aragon |
| Settings | Voice enabled (elevenlabs), local Llama-70b, BGE-M3 embeddings |

#### Village Steward (Per Village)
| Attribute | Value |
|-----------|-------|
| Name | Steward de {villageName} |
| Bio | Place-based steward, OASA compliance reporter |
| Knowledge | Village-specific regeneration plan, OASA metrics, Closer capabilities, Fund rules |
| Style | Warm, grounded, action-oriented |
| Adjectives | arraigado, cuidador, paciente, observador, generoso |
| Clients | discord, telegram, web |
| Plugins | tq-closer, tq-oasa, tq-valueflows |

#### Guardian of Nature (Per Bioregion)
| Attribute | Value |
|-----------|-------|
| Name | Guardián {name} ({bioregion}) |
| Bio | Veto power, 7-generation representation, sortition-selected |
| Knowledge | OASA Articles 3,4,7,9,10, ecological models, indigenous knowledge |
| Style | Firm, evidence-based, intransigent on principles |
| Adjectives | inalterable, visionario, ecológico, ancestral, protector |
| Clients | discord, telegram, web |
| Plugins | tq-oasa, tq-valueflows |

### 1.2 Plugin Architecture (8 Plugins)

Each plugin provides: Actions, Evaluators, Providers, Services

| Plugin | Engine | Key Actions | Key Evaluators | Key Providers |
|--------|--------|-------------|----------------|---------------|
| tq-disco-cat | DisCO_CAT_Engine | recordContribution, proposeConsentDecision, voteConsent, getPhaseStatus | trustScore, transparencyScore | discoFlows, catState |
| tq-oasa | OASAConstitutionEngine | registerVillage, calculateCompliance, createProposal, validateConsent | principlesCompliance | constitution, villageRegistry |
| tq-closer | CloserEngine | bookStay, createEvent, processGovernance | villageCompliance | villageData |
| tq-virginia | Virginia Gateway | computeN3Weight, claimVesting, federateDHO | n3Weight, vestingReadiness | virginiaMapping |
| tq-colony | Colony Protocol | createDomain, moveFunds, claimReputation | - | - |
| tq-berry-vesting | Berry Vesting | checkVestingEligibility | - | - |
| tq-valueflows | ValueFlowsEngine | recordEconomicEvent | - | - |
| tq-aragon | AragonOSxEngine | createAGP | - | - |

### 1.3 Autómata Soberano Runtime

```typescript
interface AutomataSoberanoRuntime {
  character: ElizaCharacter
  plugins: Map<string, ElizaPlugin>
  services: Map<string, any>  // disco-cat, oasa, closer
  memory: {
    conversations: Map<string, MessageExample[]>
    knowledge: Map<string, any>
    embeddings: Map<string, number[]>
    tqLedger: TQTransaction[]
  }
  state: 'initializing' | 'ready' | 'processing' | 'error'
  discoCat: DisCO_CAT_Engine
  oasa: OASAConstitutionEngine
  closer: CloserEngine
}
```

### 1.4 Message Processing Pipeline

```typescript
async function processMessage(runtime, message): Promise<ProcessedMessage> {
  // Intent classification via keyword matching
  intents = [
    'record_contribution',    // livelihood/love/care
    'propose_decision',       // consent proposals
    'vote_consent',           // consent/concern/block
    'check_compliance',       // OASA principles
    'check_n3_weight',        // Virginia dynamic weight
    'check_vesting',          // Berry vesting eligibility
    'federate_dho',           // DHO federation
    'book_stay',              // Closer booking
  ]
  
  // Entity extraction
  // Action routing to plugins
  // Response generation
}
```

---

## 2. TypeScript Implementation Mapping

### 2.1 Character Factory
```typescript
class ElizaCharacterFactory {
  static createZeitnusAutomata(): ElizaCharacter
  static createVillageSteward(villageName, villageType): ElizaCharacter
  static createGuardianOfNature(guardianName, bioregion): ElizaCharacter
}
```

### 2.2 Plugin Registry
```typescript
const zeitnusPlugins: Record<string, ElizaPlugin> = {
  'tq-disco-cat': { actions: 4, evaluators: 2, providers: 2, services: 1 },
  'tq-oasa': { actions: 4, evaluators: 1, providers: 2, services: 1 },
  'tq-closer': { actions: 3, evaluators: 1, providers: 1, services: 1 },
  'tq-virginia': { actions: 3, evaluators: 2, providers: 1, services: 1 },
  'tq-colony': { actions: 3, evaluators: 0, providers: 0, services: 0 },
  'tq-berry-vesting': { actions: 1, evaluators: 0, providers: 0, services: 0 },
  'tq-valueflows': { actions: 1, evaluators: 0, providers: 0, services: 0 },
  'tq-aragon': { actions: 1, evaluators: 0, providers: 0, services: 0 },
}
```

### 2.3 Runtime Factory
```typescript
function createAutomataSoberanoRuntime(): AutomataSoberanoRuntime
```

### 2.4 Message Processor
```typescript
async function processMessage(runtime, message): Promise<ProcessedMessage>
```

---

## 3. Integration Points

### 3.1 Core Engines (Injected as Services)
- `DisCO_CAT_Engine` → Trust/Assembly/Transparency operations
- `OASAConstitutionEngine` → Village/Governance/Principles operations
- `CloserEngine` → Village/Agent/Booking operations

### 3.2 Virginia Network
- N3 weight computation via plugin action
- Vesting claims via plugin action
- DHO federation via plugin action

### 3.3 External Protocols
- Colony: Domain/Pot/Reputation operations
- Berry: Vesting schedule queries
- ValueFlows: Economic event recording
- Aragon: AGP creation

### 3.4 Memory Persistence
- TQ Ledger transactions stored in runtime memory
- Conversation history per user
- Knowledge base with embeddings
- Long-term memory via elizaOS providers

---

## 4. Acceptance Criteria

### 4.1 Character Definitions
- [ ] Zeitnus Autómata: 7 adjectives, 4 bio paragraphs, 9 knowledge domains, 3 message example pairs, 3 post examples, 8 plugins
- [ ] Village Steward: Parameterized by village name/type, 5 adjectives, 3 plugins
- [ ] Guardian of Nature: Parameterized by name/bioregion, 5 adjectives, 2 plugins, veto-focused style

### 4.2 Plugin Completeness
- [ ] All 8 plugins registered
- [ ] Each plugin: actions, evaluators, providers, services defined
- [ ] Actions have handler, validate, examples
- [ ] Evaluators return numeric scores
- [ ] Providers return typed data
- [ ] Services have start/stop lifecycle

### 4.3 Runtime Integration
- [ ] Services map initializes all 3 core engines
- [ ] Memory structure includes TQ Ledger
- [ ] State machine: initializing → ready → processing → error

### 4.4 Message Processing
- [ ] 8 intents recognized
- [ ] Entities extracted (flowType, value, choice, etc.)
- [ ] Actions routed to correct plugins
- [ ] Responses generated per intent

---

## 5. Test Vectors

### 5.1 Character Creation
```typescript
Input: createZeitnusAutomata()
Expected: character.plugins.length === 8, character.clients.includes('discord')
```

### 5.2 Plugin Action Execution
```typescript
Input: runtime, message="Registra 50 kWh en livelihood"
Expected: intent='record_contribution', actions=[{plugin:'tq-disco-cat', action:'recordContribution'}]
```

### 5.3 Compliance Check
```typescript
Input: message="¿Mi cumplimiento OASA?"
Expected: intent='check_compliance', actions=[{plugin:'tq-oasa', action:'calculateCompliance'}]
```

---

## 6. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types (ElizaCharacter, ElizaPlugin, etc.) |
| `tq-disco-cat` | 1.0.0 | DisCO CAT engine integration |
| `tq-oasa` | 1.0.0 | OASA Constitution engine integration |
| `tq-closer` | 1.0.0 | Closer platform integration |
| `tq-virginia` | 1.0.0 | Virginia Network integration (gateway) |

---

## 7. References

- elizaOS Repository: https://github.com/elizaOS/eliza
- elizaOS Documentation: https://elizaos.github.io/eliza
- Character File Format: https://github.com/elizaOS/eliza/blob/main/docs/character-file.md
- Plugin Architecture: https://github.com/elizaOS/eliza/blob/main/docs/plugin-development.md
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Autómata Soberano section)

---

## 8. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: 3 characters, 8 plugins, runtime, message processor |