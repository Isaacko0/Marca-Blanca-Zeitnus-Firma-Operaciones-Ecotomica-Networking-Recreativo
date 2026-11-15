// arm-loomio/tests/voteWeights.test.ts
// Tests for Vote Weight System

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { 
  parseVoteWeight,
  validateVoteWeight,
  validateBulkVoteWeights,
  isWeightedVotingAvailable,
  InMemoryVoteWeightRepository,
  VoteWeightService,
  WEIGHT_DECIMALS,
  WEIGHT_MULTIPLIER,
  MAX_WEIGHT,
  MIN_WEIGHT,
} from '../src/lib/loomio/voteWeights';

describe('Vote Weight System', () => {
  describe('parseVoteWeight', () => {
    test('parses valid integers', () => {
      assert.strictEqual(parseVoteWeight('1'), 1);
      assert.strictEqual(parseVoteWeight('5'), 5);
      assert.strictEqual(parseVoteWeight(10), 10);
    });

    test('parses valid decimals', () => {
      assert.strictEqual(parseVoteWeight('1.5'), 1.5);
      assert.strictEqual(parseVoteWeight('1.25'), 1.25);
      assert.strictEqual(parseVoteWeight('0.1'), 0.1);
    });

    test('rounds to 3 decimal places', () => {
      assert.strictEqual(parseVoteWeight('1.2345'), 1.235);
      assert.strictEqual(parseVoteWeight('1.2344'), 1.234);
      assert.strictEqual(parseVoteWeight('1.9999'), 2);
    });

    test('handles banker\'s rounding', () => {
      // 1.2345 should round to 1.235 (round half up)
      // JavaScript uses round half to even for .5 cases
      assert.strictEqual(parseVoteWeight('1.2345'), 1.235);
    });

    test('rejects negative weights', () => {
      assert.throws(() => parseVoteWeight('-1'), /cannot be negative/);
      assert.throws(() => parseVoteWeight('-0.5'), /cannot be negative/);
    });

    test('rejects weights over maximum', () => {
      assert.throws(() => parseVoteWeight('1000'), /cannot exceed/);
      assert.throws(() => parseVoteWeight('999.9991'), /cannot exceed/);
    });

    test('accepts maximum weight', () => {
      assert.strictEqual(parseVoteWeight('999.999'), 999.999);
    });

    test('accepts zero weight', () => {
      assert.strictEqual(parseVoteWeight('0'), 0);
      assert.strictEqual(parseVoteWeight('0.0'), 0);
    });

    test('rejects invalid input', () => {
      assert.throws(() => parseVoteWeight('abc'), /valid number/);
      assert.throws(() => parseVoteWeight(''), /valid number/);
      assert.throws(() => parseVoteWeight(NaN), /valid number/);
    });
  });

  describe('validateVoteWeight', () => {
    test('returns valid result for valid weights', () => {
      const result = validateVoteWeight('1.5');
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.normalizedWeight, 1.5);
      assert.strictEqual(result.errors.length, 0);
    });

    test('returns error for invalid weights', () => {
      const result = validateVoteWeight('abc');
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.length > 0);
      assert.strictEqual(result.normalizedWeight, undefined);
    });

    test('returns error for negative', () => {
      const result = validateVoteWeight('-1');
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('negative')));
    });

    test('returns error for over max', () => {
      const result = validateVoteWeight('1000');
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('exceed')));
    });
  });

  describe('validateBulkVoteWeights', () => {
    test('validates all weights in batch', () => {
      const inputs = [
        { affiliateId: 'user1', weight: '1' },
        { affiliateId: 'user2', weight: '1.5' },
        { affiliateId: 'user3', weight: '2' },
      ];
      
      const result = validateBulkVoteWeights(inputs);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.updated.length, 3);
      assert.strictEqual(result.failed.length, 0);
    });

    test('rejects entire batch if any invalid', () => {
      const inputs = [
        { affiliateId: 'user1', weight: '1' },
        { affiliateId: 'user2', weight: 'invalid' },
        { affiliateId: 'user3', weight: '2' },
      ];
      
      const result = validateBulkVoteWeights(inputs);
      
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.updated.length, 0);
      assert.strictEqual(result.failed.length, 1);
      assert.strictEqual(result.failed[0].affiliateId, 'user2');
    });

    test('rejects batch with negative weight', () => {
      const inputs = [
        { affiliateId: 'user1', weight: '1' },
        { affiliateId: 'user2', weight: '-1' },
      ];
      
      const result = validateBulkVoteWeights(inputs);
      
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.failed.length, 1);
    });

    test('normalizes weights in successful batch', () => {
      const inputs = [
        { affiliateId: 'user1', weight: '1.2345' }, // Should round to 1.235
        { affiliateId: 'user2', weight: '1.2344' }, // Should round to 1.234
      ];
      
      const result = validateBulkVoteWeights(inputs);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.updated[0].weight, 1.235);
      assert.strictEqual(result.updated[1].weight, 1.234);
    });
  });

  describe('isWeightedVotingAvailable', () => {
    test('available for proposal type', () => {
      const available = isWeightedVotingAvailable('proposal', false);
      assert.strictEqual(available, true);
    });

    test('not available for anonymous', () => {
      const available = isWeightedVotingAvailable('proposal', true);
      assert.strictEqual(available, false);
    });

    test('not available for check type', () => {
      const available = isWeightedVotingAvailable('check', false);
      assert.strictEqual(available, false);
    });

    test('not available for dot_vote', () => {
      const available = isWeightedVotingAvailable('dot_vote', false);
      assert.strictEqual(available, false);
    });

    test('not available for stv', () => {
      const available = isWeightedVotingAvailable('stv', false);
      assert.strictEqual(available, false);
    });
  });

  describe('InMemoryVoteWeightRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = new InMemoryVoteWeightRepository();
    });

    test('set and get weight', async () => {
      const weight = await repo.setWeight({
        affiliateId: 'user1',
        groupId: 'group1',
        weight: 1.5,
        setBy: 'admin1',
        setAt: Date.now(),
      });
      
      assert.strictEqual(weight.weight, 1.5);
      assert.strictEqual(weight.affiliateId, 'user1');
      assert.strictEqual(weight.groupId, 'group1');
      
      const retrieved = await repo.getWeight('user1', 'group1');
      assert.strictEqual(retrieved?.weight, 1.5);
    });

    test('update weight creates audit trail', async () => {
      await repo.setWeight({
        affiliateId: 'user1',
        groupId: 'group1',
        weight: 1,
        setBy: 'admin1',
        setAt: Date.now(),
      });
      
      await repo.setWeight({
        affiliateId: 'user1',
        groupId: 'group1',
        weight: 2,
        setBy: 'admin1',
        setAt: Date.now(),
      });
      
      const audit = await repo.getAuditTrail('group1', 'user1');
      assert.ok(audit.length >= 2);
      assert.strictEqual(audit[0].event, 'created');
      assert.strictEqual(audit[1].event, 'updated');
      assert.strictEqual(audit[1].previousWeight, 1);
      assert.strictEqual(audit[1].newWeight, 2);
    });

    test('delete weight', async () => {
      await repo.setWeight({
        affiliateId: 'user1',
        groupId: 'group1',
        weight: 1,
        setBy: 'admin1',
        setAt: Date.now(),
      });
      
      await repo.deleteWeight('user1', 'group1');
      const retrieved = await repo.getWeight('user1', 'group1');
      assert.strictEqual(retrieved, null);
      
      const audit = await repo.getAuditTrail('group1', 'user1');
      assert.ok(audit.some((a: any) => a.event === 'deleted'));
    });

    test('bulk set weights', async () => {
      const result = await repo.bulkSetWeights('group1', [
        { affiliateId: 'user1', groupId: 'group1', weight: 1, setBy: 'admin1', setAt: Date.now() },
        { affiliateId: 'user2', groupId: 'group1', weight: 2, setBy: 'admin1', setAt: Date.now() },
        { affiliateId: 'user3', groupId: 'group1', weight: 1.5, setBy: 'admin1', setAt: Date.now() },
      ]);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.updated.length, 3);
      
      const weights = await repo.getGroupWeights('group1');
      assert.strictEqual(weights.length, 3);
    });

    test('bulk set rejects invalid', async () => {
      const result = await repo.bulkSetWeights('group1', [
        { affiliateId: 'user1', groupId: 'group1', weight: -1, setBy: 'admin1', setAt: Date.now() },
      ]);
      
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.failed.length, 1);
    });

    test('get group weights', async () => {
      await repo.setWeight({ affiliateId: 'user1', groupId: 'group1', weight: 1, setBy: 'admin1', setAt: Date.now() });
      await repo.setWeight({ affiliateId: 'user2', groupId: 'group1', weight: 2, setBy: 'admin1', setAt: Date.now() });
      await repo.setWeight({ affiliateId: 'user3', groupId: 'group2', weight: 1, setBy: 'admin1', setAt: Date.now() });
      
      const group1Weights = await repo.getGroupWeights('group1');
      assert.strictEqual(group1Weights.length, 2);
    });

    test('get affiliate weights', async () => {
      await repo.setWeight({ affiliateId: 'user1', groupId: 'group1', weight: 1, setBy: 'admin1', setAt: Date.now() });
      await repo.setWeight({ affiliateId: 'user1', groupId: 'group2', weight: 2, setBy: 'admin1', setAt: Date.now() });
      
      const user1Weights = await repo.getAffiliateWeights('user1');
      assert.strictEqual(user1Weights.length, 2);
    });

    test('get audit trail', async () => {
      await repo.setWeight({ affiliateId: 'user1', groupId: 'group1', weight: 1, setBy: 'admin1', setAt: Date.now() });
      await repo.setWeight({ affiliateId: 'user1', groupId: 'group1', weight: 2, setBy: 'admin1', setAt: Date.now() });
      
      const audit = await repo.getAuditTrail('group1', 'user1');
      assert.ok(audit.length >= 2);
    });
  });

  describe('VoteWeightService', () => {
    let repo: any;
    let service: any;

    beforeEach(() => {
      repo = new InMemoryVoteWeightRepository();
      service = new VoteWeightService(repo);
    });

    test('getWeight returns default 1 for unset', async () => {
      const weight = await service.getWeight('user1', 'group1');
      assert.strictEqual(weight, 1);
    });

    test('setWeight validates and stores', async () => {
      const weight = await service.setWeight('user1', 'group1', 1.5, 'admin1');
      assert.strictEqual(weight.weight, 1.5);
    });

    test('setWeight rejects invalid', async () => {
      await assert.rejects(
        service.setWeight('user1', 'group1', -1, 'admin1'),
        /negative/
      );
    });

    test('bulkSetWeights validates all', async () => {
      const result = await service.bulkSetWeights('group1', [
        { affiliateId: 'user1', weight: 1 },
        { affiliateId: 'user2', weight: 2 },
      ], 'admin1');
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.updated.length, 2);
    });

    test('bulkSetWeights rejects batch with invalid', async () => {
      await assert.rejects(
        service.bulkSetWeights('group1', [
          { affiliateId: 'user1', weight: 1 },
          { affiliateId: 'user2', weight: -1 },
        ], 'admin1'),
        /Bulk weight validation failed/
      );
    });

    test('getAuditTrail', async () => {
      await service.setWeight('user1', 'group1', 1, 'admin1');
      await service.setWeight('user1', 'group1', 2, 'admin1');
      
      const audit = await service.getAuditTrail('group1', 'user1');
      assert.ok(audit.length >= 2);
    });

    test('getWeightDistribution calculates Gini', async () => {
      await service.setWeight('user1', 'group1', 1, 'admin1');
      await service.setWeight('user2', 'group1', 2, 'admin1');
      await service.setWeight('user3', 'group1', 3, 'admin1');
      
      const dist = await service.getWeightDistribution('group1');
      assert.strictEqual(dist.count, 3);
      assert.strictEqual(dist.total, 6);
      assert.strictEqual(dist.average, 2);
      assert.strictEqual(dist.min, 1);
      assert.strictEqual(dist.max, 3);
      assert.ok(dist.giniCoefficient >= 0 && dist.giniCoefficient <= 1);
    });

    test('getTotalWeight', async () => {
      await service.setWeight('user1', 'group1', 1, 'admin1');
      await service.setWeight('user2', 'group1', 2, 'admin1');
      
      const total = await service.getTotalWeight('group1');
      assert.strictEqual(total, 3);
    });
  });

  describe('Constants', () => {
    test('WEIGHT_DECIMALS is 3', () => {
      assert.strictEqual(WEIGHT_DECIMALS, 3);
    });

    test('WEIGHT_MULTIPLIER is 1000', () => {
      assert.strictEqual(WEIGHT_MULTIPLIER, 1000);
    });

    test('MAX_WEIGHT is 999.999', () => {
      assert.strictEqual(MAX_WEIGHT, 999.999);
    });

    test('MIN_WEIGHT is 0', () => {
      assert.strictEqual(MIN_WEIGHT, 0);
    });
  });
});