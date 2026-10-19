// openspec/specs/alrac-tq-social-audit.md
// OpenSpec: Social Audit Panel with CDS Rotation
// Maps: Social audit methodology → TypeScript Implementation

# SPEC: alrac-tq-social-audit
**Version:** 1.0.0
**Status:** Implemented
**Source:** Social audit best practices, DisCO CAT, OASA Constitution, Virginia Network
**Target:** src/core/lib/tq-social-audit.ts

---

## 1. Social Audit Architecture

### 1.1 Panel Structure

| Component | Specification |
|-----------|---------------|
| Panel Size | 5 (Village), 7 (DHO), 9 (Gran Alianza) |
| Rotation Interval | Quarterly (Village), Semi-annual (DHO), Annual (Gran Alianza) |
| Max Consecutive Terms | 2 (Village), 3 (DHO), 1 (Gran Alianza) |
| Cooling Period | 90 days (Village), 180 days (DHO), 365 days (Gran Alianza) |
| Selection Method | Hybrid (70% CDS-weighted + 30% lottery) |
| Chair Rotation | Yes (per rotation) |
| Domain Diversity | Max 2 members per Virginia N2 domain |

### 1.2 Member Eligibility
- Active in last 90 days
- CDS Score ≥ 0.4
- Reputation ≥ 0.3
- No unresolved conflicts of interest

### 1.3 Member Roles
| Role | Responsibilities |
|------|------------------|
| Chair | Leads audit, writes executive summary, signs report |
| Member | Evaluates criteria, collects evidence, votes on findings |
| Observer | Attends, no vote (for training) |
| Subject-Matter Expert | Evaluates specific criteria (ecological, technical) |

---

## 2. Audit Criteria (15 Criteria, 6 Categories)

### 2.1 Care (2 criteria, 25% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| Active Care Flow | care-flow-active | 15% | Score (care flow value/1000) | Yes |
| Care in Governance | care-recognized-in-governance | 10% | Score (0-1) | Partial |

### 2.2 Governance (3 criteria, 25% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| Consent Participation | consent-participation | 15% | Score (participation rate × 2) | Yes |
| No Stale Blocks | no-stale-blocks | 10% | Boolean (0 blocks >30d) | Yes |
| Transparency Score | transparency-score | 10% | Score (DisCO CAT transparency) | Yes |

### 2.3 Ecological (2 criteria, 30% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| OASA Principles Compliance | oasa-principles-compliance | 20% | Score (0-1) | Partial |
| Regenerative Improvement | regenerative-improvement | 10% | Score (vs baseline) | Expert |

### 2.4 Economic (2 criteria, 5% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| TQ Production Verified | tq-production-verified | 5% | Score (N3 weight/2.0) | Partial |
| Vesting Compliance | vesting-compliance | 5% | Boolean (can claim) | Partial |

### 2.5 Federation (2 criteria, 10% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| Federation Treaty Active | federation-treaty-active | 5% | Score (0-1) | Partial |
| RAO Sync Active | rao-sync-active | 5% | Score (0-1) | Partial |

### 2.6 Transparency (2 criteria, 5% weight)
| Criterion | ID | Weight | Measurement | Auto-evaluated |
|-----------|-----|--------|-------------|----------------|
| ValueFlows Complete | valueflows-complete | 5% | Score (0-1) | Partial |
| Audit Trail Current | audit-trail-current | 5% | Score (entries/week) | Partial |

---

## 3. Finding Severity & Recommendations

### 3.1 Severity Levels
| Severity | Score Threshold | Action Timeline |
|----------|-----------------|-----------------|
| Critical | <0.3 | Immediate (30 days) |
| Major | 0.3-0.5 | High (90 days) |
| Minor | 0.5-0.7 | Medium (180 days) |
| Info | >0.7 | Informational |

### 3.2 Recommendation Generation
Auto-generated per criterion based on severity and category:
- Care: Care flow tracking, N1 weight integration
- Governance: Participation targets, block resolution, publishing
- Ecological: OASA compliance ≥70%, measurable targets, quarterly monitoring
- Economic: TQ verification, vesting milestones
- Federation: Treaty execution, shared treasury
- Transparency: ValueFlows completion, weekly audit entries

---

## 4. Audit Lifecycle

### 4.1 States
```
scheduled → in-progress → review → completed
                    ↓
                appealed → under-review → upheld/overturned/dismissed
                    ↓
                closed
```

### 4.2 Process
1. **Schedule**: Create audit with panel, scope, subject
2. **Rotate Panel**: Select members via CDS-weighted/hybrid method
3. **Start**: Set startedAt timestamp
4. **Evaluate**: Each criterion evaluated (automated + panel)
5. **Complete**: Calculate weighted score, generate report
6. **Appeal** (optional): Independent review panel (3 higher-CDS members)
7. **Publish**: Public report with signatures

---

## 5. TypeScript Implementation Mapping

### 5.1 Core Engine: `SocialAuditEngine`

#### Panel Management
```typescript
createPanel(panel): SocialAuditPanel
getPanel(id): SocialAuditPanel
listPanels(): SocialAuditPanel[]
```

#### Panel Rotation
```typescript
selectPanelMembers(candidatePool, config): SocialAuditMember[]
// Methods: cds-weighted, lottery, hybrid
// Ensures domain diversity

rotatePanel(panelId, candidatePool): SocialAuditMember[]
// Respects cooling period, max terms, chair rotation
```

#### Audit Scheduling & Execution
```typescript
scheduleAudit(audit): SocialAudit
startAudit(auditId): boolean
async evaluateCriterion(auditId, criterion, evaluatorDid, evidence): AuditFinding
completeAudit(auditId, findings): SocialAuditReport
```

#### Automated Criterion Evaluation (15 criteria)
```typescript
// care-flow-active → DisCO CAT care flow
// care-recognized-in-governance → N1 weight integration check
// consent-participation → DisCO CAT consent decisions (90 days)
// no-stale-blocks → DisCO CAT blocked decisions >30d
// transparency-score → DisCO CAT transparency score
// oasa-principles-compliance → OASA engine village compliance
// regenerative-improvement → Baseline comparison
// tq-production-verified → Virginia N3 weight
// vesting-compliance → Virginia canClaimVesting()
// federation-treaty-active → DHO federation status
// rao-sync-active → RAO credential sync
// valueflows-complete → VF coverage
// audit-trail-current → DisCO CAT audit trail (7 days)
```

#### Report Generation
```typescript
generateReport(audit): SocialAuditReport
// Executive summary, overall score, findings, strengths/weaknesses,
// recommendations with priority/deadline, chair statement, signatures
```

#### Appeal Process
```typescript
submitAppeal(appeal): AuditAppeal
// Review panel: 3 members not on original, CDS >0.7

decideAppeal(appealId, decision, reviewerDid, reasoning): boolean
// upheld/overturned/dismissed
```

#### Preset Panels
```typescript
createVillageAuditPanel(): SocialAuditPanel
// 5 members, quarterly, 9 criteria

createDHOAuditPanel(): SocialAuditPanel
// 7 members, semi-annual, 5 criteria

createGranAlianzaAuditPanel(): SocialAuditPanel
// 9 members, annual, 6 criteria
```

---

## 6. Integration Points

### 6.1 DisCO CAT Engine (Primary Data Source)
- Care flow metrics
- Consent decision participation
- Stale block detection
- Transparency score
- Audit trail freshness

### 6.2 OASA Constitution Engine
- Village compliance scores
- 7 Principles metrics
- Guardian veto actions

### 6.3 Virginia Network
- N3 dynamic weight
- Vesting eligibility
- Federation treaty status
- RAO synchronization

### 6.4 ValueFlows Engine
- Economic event completeness
- Resource flow coverage

### 6.5 Bread Engine
- CDS scores for panel selection
- Reputation for eligibility
- Endorsement network for conflict detection

---

## 7. Acceptance Criteria

### 7.1 Panel Management
- [ ] 3 preset panels with correct sizes/intervals
- [ ] 3 selection methods (cds-weighted, lottery, hybrid)
- [ ] Domain diversity enforced (max 2/domain)
- [ ] Chair rotation per interval
- [ ] Cooling period respected
- [ ] Max consecutive terms enforced

### 7.2 Criterion Evaluation
- [ ] All 15 criteria implemented
- [ ] 6 categories with correct weights
- [ ] Automated evaluation for 8 criteria
- [ ] Expert evaluation for 3 criteria
- [ ] Panel evaluation for 4 criteria
- [ ] Severity assignment correct
- [ ] Recommendations auto-generated

### 7.3 Audit Lifecycle
- [ ] Schedule → Start → Evaluate → Complete
- [ ] Weighted score calculation
- [ ] Report with all sections
- [ ] Appeal process functional
- [ ] Public report with signatures

### 7.4 Preset Panels
- [ ] Village: 5 members, quarterly, 9 criteria
- [ ] DHO: 7 members, semi-annual, 5 criteria
- [ ] Gran Alianza: 9 members, annual, 6 criteria

---

## 8. Test Vectors

### 8.1 Panel Selection (Hybrid)
```typescript
Input: 20 candidates, CDS 0.3-1.0, reputation 0.2-0.9, panelSize=5
Expected: 5 members, 1 chair, domain diversity, CDS-weighted top 3 + lottery 2
```

### 8.2 Criterion Evaluation
```typescript
Input: DisCO CAT with care flow 500 ZNU, participation 60%, 2 stale blocks, transparency 0.85
Expected findings:
  care-flow-active: score=0.5, passed=true (threshold 0.3)
  consent-participation: score=1.0 (capped), passed=true
  no-stale-blocks: score=0.6, passed=false (2 blocks)
  transparency-score: score=0.85, passed=true
```

### 8.3 Overall Score
```typescript
Input: All 15 criteria evaluated with weights
Expected: overallScore = Σ(score × weight), overallPassed = all tracks pass thresholds
```

---

## 9. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tq-types-extended` | 1.0.0 | Core types |
| `tq-disco-cat` | 1.0.0 | Primary data source (8 criteria) |
| `tq-oasa` | 1.0.0 | OASA compliance (2 criteria) |
| `tq-virginia` | 1.0.0 | Virginia data (4 criteria) |
| `tq-valueflows` | 1.0.0 | VF completeness (1 criterion) |
| `tq-bread` | 1.0.0 | CDS scores for panel selection |

---

## 10. References

- Social Audit Best Practices: Social Audit Network, GRI
- DisCO CAT: https://manifesto.disco.coop
- OASA Constitution: https://oasa.earth/papers/oasa-constitution-2025
- BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md (Social Audit section)

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-10-18 | Initial implementation: panel rotation, 15 criteria, automated evaluation, appeal process, 3 preset panels |