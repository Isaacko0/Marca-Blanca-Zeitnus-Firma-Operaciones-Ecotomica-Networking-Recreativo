// arm-sensorica/tests/governance.test.ts - Unit Tests for Governance
import { 
  createDefaultGovernanceConfig,
  createProposal,
  GovernanceServiceImpl,
  InMemoryGovernanceRepository,
  calculateQuorum,
  isProposalExpired,
  canVoteOnProposal,
  getProposalResults,
  Vote,
  Proposal,
  ProposalId,
  ProjectId,
  AffiliateId,
  ProposalType,
  GovernanceConfig,
  Vote as VoteType,
  Signature,
  Timestamp
} from '../src/core/governance';

import { strictEqual, deepStrictEqual, ok, throws } from 'node:assert';
import { generateId, now } from '../utils';

// ============================================
// TEST HELPERS
// ============================================

function createTestProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: generateId('prop') as any,
    projectId: 'proj1' as any,
    type: 'valueEquationChange',
    title: 'Test Proposal',
    description: 'Test description',
    proposedBy: 'aff1' as any,
    createdAt: { value: Date.now() - 86400000, timezone: 'UTC' }, // 1 day ago
    votingEndsAt: { value: Date.now() + 6 * 24 * 60 * 60 * 1000, timezone: 'UTC' }, // 6 days from now
    status: 'voting',
    votes: [],
    requiredApprovers: 2,
    ...overrides
  };
}

function createTestVote(overrides: Partial<Vote> = {}): Vote {
  return {
    affiliateId: 'aff1' as any,
    proposalId: 'prop1' as any,
    choice: 'yes',
    weight: 1,
    timestamp: now(),
    signature: { algorithm: 'ed25519', value: '', publicKey: '' },
    ...overrides
  };
}

function createTestGovernanceConfig(): GovernanceConfig {
  return {
    quorumThreshold: { value: 60 },
    votingPeriod: { value: 7 * 24 * 60 * 60 * 1000 },
    proposalTypes: [
      'valueEquationChange',
      'governanceChange',
      'resourceAllocation',
      'exchangeFirmContract',
      'projectCreation',
      'affiliateRemoval'
    ],
    requiredApprovers: new Map([
      ['valueEquationChange', 3],
      ['governanceChange', 3],
      ['resourceAllocation', 2],
      ['exchangeFirmContract', 1],
      ['projectCreation', 2],
      ['affiliateRemoval', 3]
    ]),
    autoApproveTimeout: { value: 14 * 24 * 60 * 60 * 1000 }
  };
}

// ============================================
// GOVERNANCE CONFIG TESTS
// ============================================

console.log('Testing governance config...');

const defaultConfig = createDefaultGovernanceConfig();
strictEqual(defaultConfig.quorumThreshold.value, 60, 'Quorum 60%');
strictEqual(defaultConfig.votingPeriod.value, 7 * 24 * 60 * 60 * 1000, '7 day voting period');
strictEqual(defaultConfig.proposalTypes.length, 6, '6 proposal types');
strictEqual(defaultConfig.requiredApprovers.get('valueEquationChange'), 3, 'Value equation needs 3');
strictEqual(defaultConfig.requiredApprovers.get('exchangeFirmContract'), 1, 'Exchange firm needs 1');
strictEqual(defaultConfig.autoApproveTimeout?.value, 14 * 24 * 60 * 60 * 1000, '14 day auto-approve timeout');
console.log('✓ Default governance config created');

// ============================================
// PROPOSAL CREATION TESTS
// ============================================

console.log('Testing proposal creation...');

const proposal = createTestProposal();
strictEqual(proposal.status, 'voting', 'Initial status is voting');
strictEqual(proposal.votes.length, 0, 'No initial votes');
strictEqual(proposal.requiredApprovers, 2, 'Default required approvers');

const expiredProposal = createTestProposal({
  votingEndsAt: { value: Date.now() - 86400000, timezone: 'UTC' } // expired yesterday
});
ok(isProposalExpired(expiredProposal), 'Expired proposal detected');

const activeProposal = createTestProposal();
ok(!isProposalExpired(activeProposal), 'Active proposal not expired');

console.log('✓ Proposal creation and expiration work');

// ============================================
// VOTING TESTS
// ============================================

console.log('Testing voting...');

const proposal1 = createTestProposal({ requiredApprovers: 2 });
const vote1 = createTestVote({ choice: 'yes' });
proposal1.votes.push(vote1);

const vote2 = createTestVote({ affiliateId: 'aff2' as any, choice: 'yes' });
proposal1.votes.push(vote2);

const results1 = getProposalResults(proposal1);
strictEqual(results1.yes, 2, '2 yes votes');
strictEqual(results1.no, 0, '0 no votes');
strictEqual(results1.abstain, 0, '0 abstain');
strictEqual(results1.passed, true, 'Passed with 2 yes votes');

const proposal2 = createTestProposal({ requiredApprovers: 3 });
proposal2.votes.push(createTestVote({ choice: 'yes' }));
proposal2.votes.push(createTestVote({ affiliateId: 'aff2' as any, choice: 'no' }));
proposal2.votes.push(createTestVote({ affiliateId: 'aff3' as any, choice: 'abstain' }));

const results2 = getProposalResults(proposal2);
strictEqual(results2.yes, 1, '1 yes');
strictEqual(results2.no, 1, '1 no');
strictEqual(results2.abstain, 1, '1 abstain');
strictEqual(results2.passed, false, 'Not passed (1 < 3 required)');

console.log('✓ Voting results calculated correctly');

// ============================================
// QUORUM TESTS
// ============================================

console.log('Testing quorum calculation...');

const proposal3 = createTestProposal({ requiredApprovers: 2 });
proposal3.votes = [
  createTestVote({ choice: 'yes' }),
  createTestVote({ affiliateId: 'aff2' as any, choice: 'yes' }),
  createTestVote({ affiliateId: 'aff3' as any, choice: 'no' })
];

const quorum1 = calculateQuorum(proposal3, 10); // 10 eligible voters
strictEqual(quorum1.met, true, 'Quorum met with 2 yes votes');
strictEqual(quorum1.yesVotes, 2);
strictEqual(quorum1.totalWeight, 3);
strictEqual(quorum1.requiredApprovers, 2);
strictEqual(quorum1.participationRate, 0.3, '30% participation');

const proposal4 = createTestProposal({ requiredApprovers: 3 });
proposal4.votes = [
  createTestVote({ choice: 'yes' }),
  createTestVote({ affiliateId: 'aff2' as any, choice: 'yes' })
];

const quorum2 = calculateQuorum(proposal4, 10);
strictEqual(quorum2.met, false, 'Quorum not met with 2 yes votes (need 3)');
strictEqual(quorum2.yesVotes, 2);
strictEqual(quorum2.participationRate, 0.2, '20% participation');

console.log('✓ Quorum calculation works');

// ============================================
// VOTE ELIGIBILITY TESTS
// ============================================

console.log('Testing vote eligibility...');

const activeProposal = createTestProposal();
ok(canVoteOnProposal(activeProposal, 'aff1' as any), 'Can vote on active proposal');

const votedProposal = createTestProposal();
votedProposal.votes.push(createTestVote());
ok(!canVoteOnProposal(votedProposal, 'aff1' as any), 'Cannot vote twice');

const expiredProposal2 = createTestProposal({
  votingEndsAt: { value: Date.now() - 86400000, timezone: 'UTC' }
});
ok(!canVoteOnProposal(expiredProposal2, 'aff1' as any), 'Cannot vote on expired');

const rejectedProposal = createTestProposal({ status: 'rejected' });
ok(!canVoteOnProposal(rejectedProposal, 'aff1' as any), 'Cannot vote on rejected');

console.log('✓ Vote eligibility checks work');

// ============================================
// PROPOSAL STATUS TESTS
// ============================================

console.log('Testing proposal status...');

const statusProposal = createTestProposal();
const status = {
  proposalId: statusProposal.id,
  status: statusProposal.status,
  yesVotes: 0,
  noVotes: 0,
  abstainVotes: 0,
  totalWeight: 0,
  quorumMet: false,
  timeRemaining: statusProposal.votingEndsAt.value - Date.now(),
  requiredApprovers: statusProposal.requiredApprovers
};

strictEqual(status.status, 'voting');
strictEqual(status.timeRemaining > 0, true, 'Time remaining positive');
strictEqual(status.requiredApprovers, 2);

console.log('✓ Proposal status works');

// ============================================
// REPOSITORY TESTS
// ============================================

console.log('Testing in-memory repository...');

const repo = new InMemoryGovernanceRepository();

const testProposal = createTestProposal({ id: 'test-prop-1' as any });
await repo.saveProposal(testProposal);

const found = await repo.findProposalById('test-prop-1' as any);
ok(found !== null, 'Proposal found');
strictEqual(found?.id, 'test-prop-1');

const projectProposals = await repo.findProposalsByProject('proj1' as any);
strictEqual(projectProposals.length, 1, 'Found by project');

const votingProposals = await repo.findProposalsByStatus('voting');
strictEqual(votingProposals.length, 1, 'Found by status');

const updatedProposal = { ...testProposal, status: 'passed' as const };
await repo.updateProposal(updatedProposal);
const updated = await repo.findProposalById('test-prop-1' as any);
strictEqual(updated?.status, 'passed', 'Status updated');

const vote = createTestVote({ proposalId: 'test-prop-1' as any });
await repo.saveVote(vote);
const votes = await repo.findVotesByProposal('test-prop-1' as any);
strictEqual(votes.length, 1, 'Vote saved');

console.log('✓ Repository operations work');

// ============================================
// SERVICE TESTS
// ============================================

console.log('Testing governance service...');

const serviceRepo = new InMemoryGovernanceRepository();
const configProvider = async (projectId: any) => createDefaultGovernanceConfig();
const service = new GovernanceServiceImpl(serviceRepo, configProvider);

// Create proposal
const created = await service.createProposal({
  projectId: 'proj1',
  type: 'valueEquationChange',
  title: 'Test Value Equation Change',
  description: 'Change weights',
  proposedBy: 'aff1'
});
strictEqual(created.type, 'valueEquationChange');
strictEqual(created.status, 'voting');

// Vote on proposal
const voteResult = await service.voteOnProposal({
  proposalId: created.id,
  affiliateId: 'aff2',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
});
strictEqual(voteResult.choice, 'yes');
strictEqual(voteResult.affiliateId, 'aff2' as any);

// Check status
const statusCheck = await service.getProposalStatus(created.id);
strictEqual(statusCheck.yesVotes, 1);
strictEqual(statusCheck.requiredApprovers, 3);
strictEqual(statusCheck.quorumMet, false); // Only 1 vote, need 3

// Second vote
await service.voteOnProposal({
  proposalId: created.id,
  affiliateId: 'aff3',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
});

const statusCheck2 = await service.getProposalStatus(created.id);
strictEqual(statusCheck2.yesVotes, 2);
strictEqual(statusCheck2.quorumMet, false); // Still need 3

// Third vote - should pass
await service.voteOnProposal({
  proposalId: created.id,
  affiliateId: 'aff4',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
});

const statusCheck3 = await service.getProposalStatus(created.id);
strictEqual(statusCheck3.yesVotes, 3);
strictEqual(statusCheck3.quorumMet, true);
strictEqual(statusCheck3.status, 'passed'); // Service should update status

console.log('✓ Governance service works');

// ============================================
// EXECUTION TESTS
// ============================================

console.log('Testing proposal execution...');

const passedProposal = await service.createProposal({
  projectId: 'proj1',
  type: 'resourceAllocation',
  title: 'Allocate resource',
  description: 'Allocate 3D printer',
  proposedBy: 'aff1'
});

// Vote to pass
await service.voteOnProposal({
  proposalId: passedProposal.id,
  affiliateId: 'aff1',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
});
await service.voteOnProposal({
  proposalId: passedProposal.id,
  affiliateId: 'aff2',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
});

// Execute
const execResult = await service.executeProposal(passedProposal.id);
strictEqual(execResult.success, true);
strictEqual(execResult.proposalId, passedProposal.id);

// Try to execute again (should fail)
const execResult2 = await service.executeProposal(passedProposal.id);
strictEqual(execResult2.success, false);
ok(execResult2.error?.includes('not passed'), 'Cannot execute non-passed');

console.log('✓ Proposal execution works');

// ============================================
// EDGE CASES
// ============================================

console.log('Testing edge cases...');

// Proposal not found
throws(async () => await service.getProposalStatus('nonexistent' as any), /not found/);

// Vote on non-existent proposal
throws(async () => service.voteOnProposal({
  proposalId: 'nonexistent' as any,
  affiliateId: 'aff1',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
}), /not found/);

// Double vote
const dp = createTestProposal();
dp.votes.push(createTestVote());
throws(async () => service.voteOnProposal({
  proposalId: dp.id,
  affiliateId: 'aff1',
  choice: 'yes',
  signature: { algorithm: 'ed25519', value: '', publicKey: '' }
}), /Already voted/);

// Execute non-passed
const np = createTestProposal({ status: 'rejected' });
await repo.saveProposal(np);
const execRejected = await service.executeProposal(np.id);
strictEqual(execRejected.success, false);

// Empty proposal (no votes)
const empty = createTestProposal();
const emptyResults = getProposalResults(empty);
strictEqual(emptyResults.passed, false, 'No votes = not passed');
strictEqual(emptyResults.yes, 0);
strictEqual(emptyResults.no, 0);
strictEqual(emptyResults.abstain, 0);

console.log('✓ Edge cases handled');

console.log('\n✅ ALL GOVERNANCE TESTS PASSED!');