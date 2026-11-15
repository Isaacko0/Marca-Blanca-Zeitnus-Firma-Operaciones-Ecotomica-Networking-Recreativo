// arm-loomio/tests/proposalTypes.test.ts
// Tests for Proposal Types System

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { 
  PROPOSAL_TYPES, 
  getProposalTypeConfig,
  getAllProposalTypes,
  getProposalTypesByCategory,
  validateProposalConfig,
  mergeConfig,
  getDefaultConfig,
  ProposalType,
  VotingMethod,
  HideResults,
  StanceReasonRequired,
} from '../src/lib/loomio/proposalTypes';

describe('Proposal Types System', () => {
  describe('Registry', () => {
    test('all 11 proposal types registered', () => {
      const types = getAllProposalTypes();
      assert.strictEqual(types.length, 11);
    });

    test('each type has required properties', () => {
      for (const type of getAllProposalTypes()) {
        assert.ok(type.key);
        assert.ok(type.label);
        assert.ok(type.description);
        assert.ok(type.votingMethod);
        assert.ok(type.defaults);
        assert.ok(type.constraints);
        assert.ok(type.icon);
        assert.ok(type.category);
        assert.ok(type.complexity);
      }
    });

    test('getProposalTypeConfig returns correct config', () => {
      const proposal = getProposalTypeConfig('proposal');
      assert.strictEqual(proposal.key, 'proposal');
      assert.strictEqual(proposal.label, 'Proposal');
      assert.strictEqual(proposal.votingMethod, 'consensus');
    });

    test('getAllProposalTypes returns all types', () => {
      const all = getAllProposalTypes();
      const expectedKeys = [
        'proposal', 'check', 'advice', 'consent', 'consensus',
        'poll', 'score', 'dot_vote', 'ranked_choice', 'stv', 'meeting'
      ];
      const actualKeys = all.map(t => t.key).sort();
      assert.deepStrictEqual(actualKeys, expectedKeys.sort());
    });

    test('getProposalTypesByCategory filters correctly', () => {
      const decisionTypes = getProposalTypesByCategory('decision');
      assert.ok(decisionTypes.length > 0);
      for (const t of decisionTypes) {
        assert.strictEqual(t.category, 'decision');
      }

      const electionTypes = getProposalTypesByCategory('election');
      for (const t of electionTypes) {
        assert.strictEqual(t.category, 'election');
      }
    });
  });

  describe('Proposal Type Details', () => {
    test('Proposal type - formal decision', () => {
      const p = PROPOSAL_TYPES.proposal;
      assert.strictEqual(p.votingMethod, 'consensus');
      assert.strictEqual(p.constraints.requiresOptions, false);
      assert.strictEqual(p.constraints.supportsWeightedVoting, true);
      assert.strictEqual(p.constraints.supportsAnonymous, true);
      assert.strictEqual(p.category, 'decision');
    });

    test('Check type - quick verification', () => {
      const p = PROPOSAL_TYPES.check;
      assert.strictEqual(p.votingMethod, 'majority');
      assert.strictEqual(p.defaults.durationDays, 3);
      assert.strictEqual(p.defaults.preventWeightedVoting, true);
      assert.strictEqual(p.category, 'consultation');
    });

    test('Advice type - consultation', () => {
      const p = PROPOSAL_TYPES.advice;
      assert.strictEqual(p.votingMethod, 'plurality');
      assert.strictEqual(p.defaults.stanceReasonRequired, 'required');
      assert.strictEqual(p.constraints.requiresOptions, true);
      assert.strictEqual(p.constraints.minOptions, 2);
    });

    test('Consent type - sociocracy', () => {
      const p = PROPOSAL_TYPES.consent;
      assert.strictEqual(p.votingMethod, 'consent');
      assert.strictEqual(p.defaults.stanceReasonRequired, 'required_for_block');
      assert.strictEqual(p.constraints.requiresOptions, false);
    });

    test('Consensus type - graduated', () => {
      const p = PROPOSAL_TYPES.consensus;
      assert.strictEqual(p.votingMethod, 'consensus');
      assert.strictEqual(p.defaults.stanceReasonRequired, 'required_for_disagree_or_block');
      assert.strictEqual(p.complexity, 'complex');
    });

    test('Poll type - multiple choice', () => {
      const p = PROPOSAL_TYPES.poll;
      assert.strictEqual(p.votingMethod, 'plurality');
      assert.strictEqual(p.constraints.requiresOptions, true);
      assert.strictEqual(p.constraints.minOptions, 2);
      assert.strictEqual(p.constraints.maxOptions, 20);
    });

    test('Score type - numeric rating', () => {
      const p = PROPOSAL_TYPES.score;
      assert.strictEqual(p.votingMethod, 'scoring');
      assert.ok(p.defaults.scoreMin !== undefined);
      assert.ok(p.defaults.scoreMax !== undefined);
      assert.strictEqual(p.constraints.supportsScoring, true);
    });

    test('Dot Vote type - point allocation', () => {
      const p = PROPOSAL_TYPES.dot_vote;
      assert.strictEqual(p.votingMethod, 'dot_voting');
      assert.ok(p.defaults.pointsPerVoter !== undefined);
      assert.strictEqual(p.constraints.supportsDotVoting, true);
      assert.strictEqual(p.constraints.supportsWeightedVoting, false);
    });

    test('Ranked Choice type - IRV', () => {
      const p = PROPOSAL_TYPES.ranked_choice;
      assert.strictEqual(p.votingMethod, 'irv');
      assert.strictEqual(p.constraints.supportsRankedChoices, true);
      assert.strictEqual(p.defaults.requireAllChoices, false);
    });

    test('STV type - proportional', () => {
      const p = PROPOSAL_TYPES.stv;
      assert.strictEqual(p.votingMethod, 'stv');
      assert.strictEqual(p.constraints.supportsStv, true);
      assert.ok(p.defaults.stvSeats !== undefined);
      assert.ok(p.defaults.stvMethod !== undefined);
      assert.ok(p.defaults.stvQuota !== undefined);
      assert.strictEqual(p.constraints.preventWeightedVoting, true);
    });

    test('Meeting type - scheduling', () => {
      const p = PROPOSAL_TYPES.meeting;
      assert.strictEqual(p.votingMethod, 'scheduling');
      assert.ok(p.defaults.meetingDuration !== undefined);
      assert.ok(p.defaults.timeZone !== undefined);
      assert.strictEqual(p.category, 'scheduling');
    });
  });

  describe('Config Validation', () => {
    test('validateProposalConfig - STV seats', () => {
      const errors = validateProposalConfig('stv', { stvSeats: 0 });
      assert.ok(errors.includes('STV seats must be >= 1'));
    });

    test('validateProposalConfig - STV candidates > seats', () => {
      const errors = validateProposalConfig('stv', { 
        stvSeats: 3,
        choiceCountMax: 3 
      });
      assert.ok(errors.some(e => e.includes('more candidates than seats')));
    });

    test('validateProposalConfig - Score range', () => {
      const errors = validateProposalConfig('score', { 
        scoreMin: 10, 
        scoreMax: 5 
      });
      assert.ok(errors.includes('Score min must be less than max'));
    });

    test('validateProposalConfig - Dot vote points', () => {
      const errors = validateProposalConfig('dot_vote', { 
        pointsPerVoter: 0 
      });
      assert.ok(errors.includes('Points per voter must be >= 1'));
    });

    test('validateProposalConfig - Choice counts', () => {
      const errors = validateProposalConfig('poll', { 
        choiceCountMin: 5,
        choiceCountMax: 3 
      });
      assert.ok(errors.includes('Choice count min cannot exceed max'));
    });

    test('validateProposalConfig - valid config passes', () => {
      const errors = validateProposalConfig('proposal', {
        durationDays: 14,
        hideResults: 'until_closed',
      });
      assert.strictEqual(errors.length, 0);
    });
  });

  describe('Config Merging', () => {
    test('mergeConfig - overrides defaults', () => {
      const merged = mergeConfig('proposal', {
        durationDays: 14,
        hideResults: 'never',
      });
      
      const defaults = getDefaultConfig('proposal');
      assert.strictEqual(merged.durationDays, 14);
      assert.strictEqual(merged.hideResults, 'never');
      // Other defaults preserved
      assert.strictEqual(merged.stanceReasonRequired, defaults.stanceReasonRequired);
    });

    test('mergeConfig - preserves unspecified defaults', () => {
      const merged = mergeConfig('score', {
        scoreMax: 50,
      });
      
      assert.strictEqual(merged.scoreMax, 50);
      assert.strictEqual(merged.scoreMin, 0); // default
      assert.strictEqual(merged.durationDays, 7); // default
    });

    test('getDefaultConfig returns copy', () => {
      const config1 = getDefaultConfig('proposal');
      const config2 = getDefaultConfig('proposal');
      
      config1.durationDays = 999;
      assert.strictEqual(config2.durationDays, 7); // Original unchanged
    });
  });

  describe('Enum Values', () => {
    test('ProposalType enum has all types', () => {
      const types = Object.values(ProposalType);
      assert.strictEqual(types.length, 11);
    });

    test('VotingMethod enum has all methods', () => {
      const methods = Object.values(VotingMethod);
      assert.ok(methods.length >= 9);
    });

    test('HideResults enum', () => {
      const values = Object.values(HideResults);
      assert.deepStrictEqual(values.sort(), ['always', 'never', 'until_closed'].sort());
    });

    test('StanceReasonRequired enum', () => {
      const values = Object.values(StanceReasonRequired);
      assert.ok(values.length === 4);
    });
  });
});