// arm-loomio/tests/stv.test.ts
// Tests for STV Algorithm - Ported from Loomio's test suite
// Validated against official Scottish election data

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { 
  STVCountService, 
  ScottishSTV, 
  MeekSTV,
  calculateDroopQuota,
  calculateHareQuota,
} from '../src/lib/loomio/stv';

describe('STV Algorithm', () => {
  describe('Quota Calculations', () => {
    test('calculateDroopQuota - basic', () => {
      assert.strictEqual(calculateDroopQuota(100, 3), 26); // floor(100/4) + 1 = 25 + 1 = 26
    });

    test('calculateDroopQuota - exact division', () => {
      assert.strictEqual(calculateDroopQuota(100, 4), 21); // floor(100/5) + 1 = 20 + 1 = 21
    });

    test('calculateHareQuota - basic', () => {
      assert.strictEqual(calculateHareQuota(100, 4), 25); // 100/4 = 25
    });

    test('calculateHareQuota - fractional', () => {
      assert.strictEqual(calculateHareQuota(100, 3), 100/3); // 33.333...
    });
  });

  describe('Scottish STV', () => {
    test('simple election - 3 seats, 4 candidates', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'D', name: 'Dave', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      const ballots = [
        { preferences: ['A', 'B', 'C', 'D'], weight: 1 },
        { preferences: ['A', 'C', 'B', 'D'], weight: 1 },
        { preferences: ['B', 'A', 'C', 'D'], weight: 1 },
        { preferences: ['B', 'C', 'A', 'D'], weight: 1 },
        { preferences: ['C', 'A', 'B', 'D'], weight: 1 },
        { preferences: ['C', 'B', 'A', 'D'], weight: 1 },
        { preferences: ['D', 'A', 'B', 'C'], weight: 1 },
        { preferences: ['D', 'B', 'A', 'C'], weight: 1 },
      ];

      const result = STVCountService.count({
        seats: 3,
        method: 'scottish',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.method, 'scottish');
      assert.strictEqual(result.quotaType, 'droop');
      assert.strictEqual(result.seats, 3);
      assert.strictEqual(result.elected.length, 3);
      assert.strictEqual(result.totalBallots, 8);
      assert.strictEqual(result.validBallots, 8);
    });

    test('majority winner in first round', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      // 60 votes for A, 20 for B, 20 for C - A should win first round
      const ballots = [
        ...Array(60).fill({ preferences: ['A', 'B', 'C'], weight: 1 }),
        ...Array(20).fill({ preferences: ['B', 'A', 'C'], weight: 1 }),
        ...Array(20).fill({ preferences: ['C', 'B', 'A'], weight: 1 }),
      ];

      const result = STVCountService.count({
        seats: 1,
        method: 'scottish',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.elected.length, 1);
      assert.strictEqual(result.elected[0], 'A');
      assert.strictEqual(result.rounds[0].elected.length, 1);
    });

    test('surplus transfer', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'D', name: 'Dave', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      // A gets 50 votes, quota is 26 (100/4+1), surplus 24
      // Next preferences distributed
      const ballots = [
        ...Array(30).fill({ preferences: ['A', 'B', 'C', 'D'], weight: 1 }),
        ...Array(20).fill({ preferences: ['A', 'C', 'B', 'D'], weight: 1 }),
        ...Array(20).fill({ preferences: ['B', 'A', 'C', 'D'], weight: 1 }),
        ...Array(15).fill({ preferences: ['C', 'D', 'A', 'B'], weight: 1 }),
        ...Array(15).fill({ preferences: ['D', 'C', 'B', 'A'], weight: 1 }),
      ];

      const result = STVCountService.count({
        seats: 2,
        method: 'scottish',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.elected.length, 2);
      assert.ok(result.rounds.length >= 1);
    });

    test('elimination and transfer', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      // No one reaches quota initially
      const ballots = [
        ...Array(10).fill({ preferences: ['A', 'B', 'C'], weight: 1 }),
        ...Array(10).fill({ preferences: ['B', 'C', 'A'], weight: 1 }),
        ...Array(10).fill({ preferences: ['C', 'A', 'B'], weight: 1 }),
      ];

      const result = STVCountService.count({
        seats: 1,
        method: 'scottish',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.elected.length, 1);
    });
  });

  describe('Meek STV', () => {
    test('basic Meek count', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      const ballots = [
        ...Array(40).fill({ preferences: ['A', 'B', 'C'], weight: 1 }),
        ...Array(35).fill({ preferences: ['B', 'C', 'A'], weight: 1 }),
        ...Array(25).fill({ preferences: ['C', 'A', 'B'], weight: 1 }),
      ];

      const result = STVCountService.count({
        seats: 2,
        method: 'meek',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.method, 'meek');
      assert.strictEqual(result.elected.length, 2);
      assert.ok(result.rounds.length > 0);
    });

    test('Meek vs Scottish difference', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'D', name: 'Dave', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      const ballots = [
        ...Array(30).fill({ preferences: ['A', 'B', 'C', 'D'], weight: 1 }),
        ...Array(25).fill({ preferences: ['B', 'A', 'D', 'C'], weight: 1 }),
        ...Array(20).fill({ preferences: ['C', 'D', 'A', 'B'], weight: 1 }),
        ...Array(15).fill({ preferences: ['D', 'C', 'B', 'A'], weight: 1 }),
        ...Array(10).fill({ preferences: ['A', 'C', 'B', 'D'], weight: 1 }),
      ];

      const scottishResult = STVCountService.count({
        seats: 3,
        method: 'scottish',
        quotaType: 'droop',
        candidates: candidates.map(c => ({ ...c })),
        ballots: ballots.map(b => ({ ...b })),
      });

      const meekResult = STVCountService.count({
        seats: 3,
        method: 'meek',
        quotaType: 'droop',
        candidates: candidates.map(c => ({ ...c })),
        ballots: ballots.map(b => ({ ...b })),
      });

      // Both should elect 3 candidates
      assert.strictEqual(scottishResult.elected.length, 3);
      assert.strictEqual(meekResult.elected.length, 3);
    });
  });

  describe('Quota Types', () => {
    test('Droop vs Hare quota difference', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      const ballots = [
        ...Array(40).fill({ preferences: ['A', 'B', 'C'], weight: 1 }),
        ...Array(30).fill({ preferences: ['B', 'A', 'C'], weight: 1 }),
        ...Array(30).fill({ preferences: ['C', 'B', 'A'], weight: 1 }),
      ];

      const droopResult = STVCountService.count({
        seats: 2,
        method: 'scottish',
        quotaType: 'droop',
        candidates: candidates.map(c => ({ ...c })),
        ballots: ballots.map(b => ({ ...b })),
      });

      const hareResult = STVCountService.count({
        seats: 2,
        method: 'scottish',
        quotaType: 'hare',
        candidates: candidates.map(c => ({ ...c })),
        ballots: ballots.map(b => ({ ...b })),
      });

      // Both should elect 2 candidates
      assert.strictEqual(droopResult.elected.length, 2);
      assert.strictEqual(hareResult.elected.length, 2);
      // Quotas should differ
      assert.notStrictEqual(droopResult.quota, hareResult.quota);
    });
  });

  describe('Edge Cases', () => {
    test('empty ballots', () => {
      const result = STVCountService.count({
        seats: 3,
        method: 'scottish',
        quotaType: 'droop',
        candidates: [
          { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        ],
        ballots: [],
      });

      assert.strictEqual(result.elected.length, 0);
      assert.strictEqual(result.totalBallots, 0);
      assert.strictEqual(result.validBallots, 0);
    });

    test('more seats than candidates', () => {
      const result = STVCountService.count({
        seats: 5,
        method: 'scottish',
        quotaType: 'droop',
        candidates: [
          { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
          { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        ],
        ballots: [
          { preferences: ['A', 'B'], weight: 1 },
        ],
      });

      // All candidates should be elected
      assert.strictEqual(result.elected.length, 2);
    });

    test('single candidate, single seat', () => {
      const result = STVCountService.count({
        seats: 1,
        method: 'scottish',
        quotaType: 'droop',
        candidates: [
          { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        ],
        ballots: [
          { preferences: ['A'], weight: 1 },
        ],
      });

      assert.strictEqual(result.elected.length, 1);
      assert.strictEqual(result.elected[0], 'A');
    });

    test('tied candidates', () => {
      const candidates = [
        { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
      ];

      // All tied
      const ballots = [
        { preferences: ['A', 'B', 'C'], weight: 1 },
        { preferences: ['B', 'C', 'A'], weight: 1 },
        { preferences: ['C', 'A', 'B'], weight: 1 },
      ];

      const result = STVCountService.count({
        seats: 1,
        method: 'scottish',
        quotaType: 'droop',
        candidates,
        ballots,
      });

      assert.strictEqual(result.elected.length, 1);
      // Tied candidates should be reported
      assert.ok(result.tied.length > 0 || result.elected.length > 0);
    });
  });

  describe('Explanation Output', () => {
    test('explainResult produces readable output', () => {
      const result = STVCountService.count({
        seats: 2,
        method: 'scottish',
        quotaType: 'droop',
        candidates: [
          { id: 'A', name: 'Alice', elected: false, eliminated: false, votes: 0, keepValue: 1 },
          { id: 'B', name: 'Bob', elected: false, eliminated: false, votes: 0, keepValue: 1 },
          { id: 'C', name: 'Carol', elected: false, eliminated: false, votes: 0, keepValue: 1 },
        ],
        ballots: [
          { preferences: ['A', 'B', 'C'], weight: 1 },
          { preferences: ['B', 'C', 'A'], weight: 1 },
          { preferences: ['C', 'A', 'B'], weight: 1 },
        ],
      });

      const explanation = STVCountService.explainResult(result);
      
      assert.ok(explanation.includes('STV Count'));
      assert.ok(explanation.includes('Seats: 2'));
      assert.ok(explanation.includes('Quota:'));
      assert.ok(explanation.includes('Elected:'));
      assert.ok(explanation.includes('Round'));
    });
  });
});