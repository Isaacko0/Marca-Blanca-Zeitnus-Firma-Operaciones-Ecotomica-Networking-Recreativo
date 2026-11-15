#!/usr/bin/env node
// arm-loomio/cli/src/index.ts
// CLI for Loomio Decision-Making

import { Command } from 'commander';
import { 
  LoomioDecisionEngine 
} from '../../src/core/decisionEngine';
import { 
  ProposalType, 
  getProposalTypeConfig,
  getAllProposalTypes,
} from '../../src/lib/loomio/proposalTypes';
import { 
  STVCountService 
} from '../../src/lib/loomio/stv';

const program = new Command();

program
  .name('arm-loomio')
  .description('ARM Loomio - Collaborative Decision Making CLI')
  .version('0.1.0');

// Global options
program
  .option('--group <groupId>', 'Group ID')
  .option('--thread <threadId>', 'Thread ID')
  .option('--proposal <proposalId>', 'Proposal ID')
  .option('--affiliate <affiliateId>', 'Affiliate ID')
  .option('--format <format>', 'Output format (json|table)', 'table');

// Initialize decision engine
const engine = new (require('../core/decisionEngine').LoomioDecisionEngine)();

// ============================================
// PROPOSAL COMMANDS
// ============================================

const proposalCmd = program.command('proposal').alias('p').description('Manage proposals');

proposalCmd
  .command('create')
  .description('Create a new proposal')
  .requiredOption('--type <type>', 'Proposal type', (value) => {
    const types = getAllProposalTypes().map(t => t.key);
    if (!types.includes(value)) {
      throw new Error(`Invalid proposal type. Valid types: ${types.join(', ')}`);
    }
    return value;
  })
  .requiredOption('--title <title>', 'Proposal title')
  .option('--description <description>', 'Proposal description')
  .option('--options <options...>', 'Proposal options (name:description)')
  .option('--anonymous', 'Anonymous voting')
  .option('--hide-results <mode>', 'Hide results mode', 'until_closed')
  .option('--weighted-voting', 'Enable weighted voting')
  .option('--duration <days>', 'Duration in days', '7')
  .action(async (options) => {
    try {
      const proposal = await engine.createProposal({
        groupId: program.opts().group,
        threadId: program.opts().thread,
        type: options.type as any,
        title: options.title,
        description: options.description,
        options: options.options?.map((o: string) => {
          const [name, description] = o.split(':');
          return { name, description };
        }) || [],
        anonymous: options.anonymous,
        hideResults: options.hideResults as any,
        weightedVoting: options.weightedVoting,
        durationDays: parseInt(options.duration),
        authorId: program.opts().affiliate || 'cli-user',
      });
      console.log('Proposal created:', proposal.id);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

proposalCmd
  .command('list')
  .description('List proposals')
  .option('--status <status>', 'Filter by status')
  .option('--type <type>', 'Filter by type')
  .action(async (options) => {
    // Implementation
    console.log('Listing proposals...');
  });

proposalCmd
  .command('close')
  .requiredOption('--id <proposalId>', 'Proposal ID')
  .option('--reason <reason>', 'Close reason')
  .action(async (options) => {
    // Implementation
  });

proposalCmd
  .command('outcome')
  .requiredOption('--id <proposalId>', 'Proposal ID')
  .requiredOption('--decision <decision>', 'Decision (approved|rejected|blocked|consensus|deferred)')
  .requiredOption('--summary <summary>', 'Outcome summary')
  .option('--details <details>', 'Outcome details')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// VOTE COMMANDS
// ============================================

const voteCmd = program.command('vote').alias('v').description('Manage votes');

voteCmd
  .command('cast')
  .requiredOption('--proposal <proposalId>', 'Proposal ID')
  .requiredOption('--choice <choice>', 'Choice (optionId:score or optionId:rank)')
  .option('--reason <reason>', 'Vote reason')
  .option('--anonymous', 'Cast anonymous vote')
  .action(async (options) => {
    // Implementation
  });

voteCmd
  .command('result')
  .requiredOption('--proposal <proposalId>', 'Proposal ID')
  .option('--explain', 'Show STV explanation')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// TEMPLATE COMMANDS
// ============================================

const templateCmd = program.command('template').alias('t').description('Manage proposal templates');

templateCmd
  .command('create')
  .requiredOption('--type <type>', 'Proposal type')
  .requiredOption('--name <name>', 'Template name')
  .option('--description <description>', 'Template description')
  .action(async (options) => {
    // Implementation
  });

templateCmd
  .command('list')
  .option('--type <type>', 'Filter by type')
  .action(async (options) => {
    // Implementation
  });

templateCmd
  .command('publish')
  .requiredOption('--id <templateId>', 'Template ID')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// GROUP COMMANDS
// ============================================

const groupCmd = program.command('group').alias('g').description('Manage groups');

groupCmd
  .command('create')
  .requiredOption('--name <name>', 'Group name')
  .option('--description <description>', 'Group description')
  .option('--parent <parentId>', 'Parent group ID')
  .option('--handle <handle>', 'Group handle')
  .option('--private', 'Private group')
  .action(async (options) => {
    // Implementation
  });

groupCmd
  .command('invite')
  .requiredOption('--email <email>', 'Member email')
  .option('--role <role>', 'Member role', 'member')
  .option('--weight <weight>', 'Vote weight')
  .action(async (options) => {
    // Implementation
  });

groupCmd
  .command('weights')
  .option('--set <weights>', 'Set weights (affiliate:weight,...)')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// THREAD COMMANDS
// ============================================

const threadCmd = program.command('thread').alias('th').description('Manage threads');

threadCmd
  .command('create')
  .requiredOption('--title <title>', 'Thread title')
  .option('--description <description>', 'Thread description')
  .option('--private', 'Private thread')
  .action(async (options) => {
    // Implementation
  });

threadCmd
  .command('lock')
  .requiredOption('--id <threadId>', 'Thread ID')
  .option('--reason <reason>', 'Lock reason')
  .action(async (options) => {
    // Implementation
  });

threadCmd
  .command('unlock')
  .requiredOption('--id <threadId>', 'Thread ID')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// ANALYTICS COMMANDS
// ============================================

const analyticsCmd = program.command('analytics').alias('a').description('Decision analytics');

analyticsCmd
  .command('group')
  .requiredOption('--id <groupId>', 'Group ID')
  .option('--days <days>', 'Period in days', '30')
  .action(async (options) => {
    // Implementation
  });

analyticsCmd
  .command('health')
  .requiredOption('--id <groupId>', 'Group ID')
  .action(async (options) => {
    // Implementation
  });

analyticsCmd
  .command('patterns')
  .requiredOption('--id <groupId>', 'Group ID')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// STV COMMANDS
// ============================================

const stvCmd = program.command('stv').description('STV election tools');

stvCmd
  .command('simulate')
  .requiredOption('--seats <seats>', 'Number of seats', '3')
  .requiredOption('--candidates <candidates...>', 'Candidate names')
  .requiredOption('--ballots <ballots...>', 'Ballots (comma-separated preferences)')
  .option('--method <method>', 'STV method (scottish|meek)', 'scottish')
  .option('--quota <quota>', 'Quota type (droop|hare)', 'droop')
  .action(async (options) => {
    const candidates = options.candidates.map((name: string, i: number) => ({
      id: `cand_${i}`,
      name,
    }));

    const ballots = options.ballots.map((b: string) => ({
      preferences: b.split(',').map((name: string) => {
        const idx = options.candidates.indexOf(name.trim());
        return `cand_${idx}`;
      }).filter(Boolean),
    }));

    const result = STVCountService.count({
      seats: parseInt(options.seats),
      method: options.method as any,
      quotaType: options.quota as any,
      candidates: candidates.map((c, i) => ({
        id: c.id,
        name: c.name,
        elected: false,
        eliminated: false,
        votes: 0,
        keepValue: 1,
      })),
      ballots: ballots.map(b => ({ preferences: b.preferences, weight: 1 })),
    });

    console.log(STVCountService.explainResult(result));
  });

stvCmd
  .command('explain')
  .requiredOption('--proposal <proposalId>', 'Proposal ID')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// LEGAL COMMANDS
// ============================================

const legalCmd = program.command('legal').description('Legal terms management');

legalCmd
  .command('accept')
  .option('--version <version>', 'Terms version')
  .action(async (options) => {
    // Implementation
  });

legalCmd
  .command('status')
  .action(async (options) => {
    // Implementation
  });

// ============================================
// HELP
// ============================================

program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

program.parse(process.argv);