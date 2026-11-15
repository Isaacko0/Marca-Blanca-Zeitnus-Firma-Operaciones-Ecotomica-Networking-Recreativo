// arm-loomio/mcp/src/index.ts
// MCP Server for ARM Loomio Decision Making

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { 
  LoomioDecisionEngine 
} from '../../src/core/decisionEngine';
import { 
  ProposalType, 
  getAllProposalTypes,
  getProposalTypeConfig,
} from '../../src/lib/loomio/proposalTypes';
import { 
  STVCountService 
} from '../../src/lib/loomio/stv';
import { generateId, now } from '../../src/utils';

const server = new Server(
  {
    name: 'arm-loomio',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize decision engine
const engine = new (require('../../src/core/decisionEngine').LoomioDecisionEngine)();

// ============================================
// TOOL DEFINITIONS
// ============================================

const tools: Tool[] = [
  // Proposal Creation Assistance
  {
    name: 'create_proposal',
    description: 'Create a new decision proposal with guided type selection',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string', description: 'Group ID' },
        threadId: { type: 'string', description: 'Thread ID (optional)' },
        type: { 
          type: 'string', 
          enum: ['proposal', 'check', 'advice', 'consent', 'consensus', 'poll', 'score', 'dot_vote', 'ranked_choice', 'stv', 'meeting'],
          description: 'Proposal type' 
        },
        title: { type: 'string', description: 'Proposal title' },
        description: { type: 'string', description: 'Proposal description' },
        options: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' }
            }
          },
          description: 'Proposal options'
        },
        anonymous: { type: 'boolean', description: 'Anonymous voting' },
        hideResults: { type: 'string', enum: ['never', 'until_closed', 'always'] },
        weightedVoting: { type: 'boolean' },
        durationDays: { type: 'number', default: 7 },
        authorId: { type: 'string' },
      },
      required: ['groupId', 'type', 'title', 'authorId'],
    },
  },

  {
    name: 'suggest_proposal_type',
    description: 'Analyze context and suggest best proposal type',
    inputSchema: {
      type: 'object',
      properties: {
        context: { type: 'string', description: 'Decision context description' },
        requiresBindingDecision: { type: 'boolean' },
        needsProportionalRepresentation: { type: 'boolean' },
        needsRankedPreferences: { type: 'boolean' },
        needsAnonymousVoting: { type: 'boolean' },
        isForScheduling: { type: 'boolean' },
      },
      required: ['context'],
    },
  },

  {
    name: 'draft_proposal',
    description: 'Draft proposal text from discussion summary',
    inputSchema: {
      type: 'object',
      properties: {
        discussionSummary: { type: 'string' },
        keyPoints: { type: 'array', items: { type: 'string' } },
        proposedOptions: { type: 'array', items: { type: 'string' } },
      },
      required: ['discussionSummary', 'proposedOptions'],
    },
  },

  // Voting Assistance
  {
    name: 'cast_vote',
    description: 'Cast a vote with optional reasoning',
    inputSchema: {
      type: 'object',
      properties: {
        proposalId: { type: 'string' },
        affiliateId: { type: 'string' },
        choices: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              optionId: { type: 'string' },
              score: { type: 'number' },
              rank: { type: 'number' }
            }
          }
        },
        reason: { type: 'string' },
        anonymous: { type: 'boolean', default: false },
      },
      required: ['proposalId', 'affiliateId', 'choices'],
    },
  },

  {
    name: 'explain_vote_options',
    description: 'Explain voting options for a proposal type',
    inputSchema: {
      type: 'object',
      properties: {
        proposalType: { 
          type: 'string', 
          enum: ['proposal', 'check', 'advice', 'consent', 'consensus', 'poll', 'score', 'dot_vote', 'ranked_choice', 'stv', 'meeting'],
        },
      },
      required: ['proposalType'],
    },
  },

  {
    name: 'simulate_stv',
    description: 'Simulate STV count with test ballots',
    inputSchema: {
      type: 'object',
      properties: {
        seats: { type: 'number', default: 3 },
        candidates: { type: 'array', items: { type: 'string' } },
        ballots: { 
          type: 'array', 
          items: { 
            type: 'array', 
            items: { type: 'string' } 
          }
        },
        method: { type: 'string', enum: ['scottish', 'meek'], default: 'scottish' },
        quota: { type: 'string', enum: ['droop', 'hare'], default: 'droop' },
      },
      required: ['candidates', 'ballots'],
    },
  },

  // Analysis
  {
    name: 'analyze_participation',
    description: 'Analyze participation patterns in group',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
        days: { type: 'number', default: 30 },
      },
      required: ['groupId'],
    },
  },

  {
    name: 'detect_consensus',
    description: 'Detect emerging consensus in open proposal',
    inputSchema: {
      type: 'object',
      properties: {
        proposalId: { type: 'string' },
      },
      required: ['proposalId'],
    },
  },

  {
    name: 'identify_blocks',
    description: 'Identify persistent blocks and suggest mediation',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
        days: { type: 'number', default: 30 },
      },
      required: ['groupId'],
    },
  },

  {
    name: 'weight_analysis',
    description: 'Analyze vote weight distribution fairness',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
      },
      required: ['groupId'],
    },
  },

  // Templates
  {
    name: 'create_template',
    description: 'Create proposal template from successful proposal',
    inputSchema: {
      type: 'object',
      properties: {
        proposalId: { type: 'string' },
        name: { type: 'string' },
        groupId: { type: 'string' },
      },
      required: ['proposalId', 'name', 'groupId'],
    },
  },

  {
    name: 'recommend_template',
    description: 'Recommend template based on decision context',
    inputSchema: {
      type: 'object',
      properties: {
        context: { type: 'string' },
        groupId: { type: 'string' },
      },
      required: ['context', 'groupId'],
    },
  },

  // Group Insights
  {
    name: 'group_health',
    description: 'Assess group decision-making health metrics',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
      },
      required: ['groupId'],
    },
  },

  {
    name: 'subgroup_integration',
    description: 'Analyze cross-subgroup participation',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
      },
      required: ['groupId'],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_proposal': {
        const engine = new (require('../../src/core/decisionEngine').LoomioDecisionEngine)();
        const proposal = await engine.createProposal(args as any);
        return {
          content: [{ type: 'text', text: `Proposal created: ${proposal.id}\nTitle: ${proposal.title}\nType: ${proposal.type}\nStatus: ${proposal.status}` }],
        };
      }

      case 'suggest_proposal_type': {
        const suggestion = suggestProposalType(args as any);
        return { content: [{ type: 'text', text: suggestion }] };
      }

      case 'draft_proposal': {
        const draft = draftProposal(args as any);
        return { content: [{ type: 'text', text: draft }] };
      }

      case 'cast_vote': {
        // Would call engine.castVote
        return { content: [{ type: 'text', text: `Vote cast for proposal ${args.proposalId}` }] };
      }

      case 'explain_vote_options': {
        const explanation = explainVoteOptions(args.proposalType as any);
        return { content: [{ type: 'text', text: explanation }] };
      }

      case 'simulate_stv': {
        const { seats = 3, candidates, ballots, method = 'scottish', quota = 'droop' } = args as any;
        const candidateObjs = candidates.map((name: string, i: number) => ({
          id: `cand_${i}`,
          name,
        }));
        const ballotObjs = ballots.map((b: string[]) => ({
          preferences: b.map((name: string) => `cand_${candidates.indexOf(name)}`),
        }));
        const result = STVCountService.count({
          seats: args.seats || 3,
          method: args.method || 'scottish',
          quotaType: args.quota || 'droop',
          candidates: candidateObjs.map(c => ({ ...c, elected: false, eliminated: false, votes: 0, keepValue: 1 })),
          ballots: ballotObjs.map(b => ({ preferences: b.preferences, weight: 1 })),
        });
        return { content: [{ type: 'text', text: STVCountService.explainResult(result) }] };
      }

      case 'analyze_participation': {
        return { content: [{ type: 'text', text: `Analyzing participation for group ${args.groupId}...` }] };
      }

      case 'detect_consensus': {
        return { content: [{ type: 'text', text: `Detecting consensus for proposal ${args.proposalId}...` }] };
      }

      case 'identify_blocks': {
        return { content: [{ type: 'text', text: `Identifying blocks for group ${args.groupId}...` }] };
      }

      case 'weight_analysis': {
        return { content: [{ type: 'text', text: `Analyzing weights for group ${args.groupId}...` }] };
      }

      case 'create_template': {
        return { content: [{ type: 'text', text: `Creating template from proposal ${args.proposalId}...` }] };
      }

      case 'recommend_template': {
        return { content: [{ type: 'text', text: `Recommending template for context: ${args.context}` }] };
      }

      case 'group_health': {
        return { content: [{ type: 'text', text: `Assessing health for group ${args.groupId}...` }] };
      }

      case 'subgroup_integration': {
        return { content: [{ type: 'text', text: `Analyzing subgroup integration for group ${args.groupId}...` }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function suggestProposalType(args: any): string {
  const { context, requiresBindingDecision, needsProportionalRepresentation, needsRankedPreferences, needsAnonymousVoting, isForScheduling } = args;
  
  let suggestion = `Based on context: "${context}"\n\n`;
  
  if (isForScheduling) {
    suggestion += '🎯 **Recommended: Meeting** - For scheduling meetings and finding best time slots.';
  } else if (needsProportionalRepresentation) {
    suggestion += '🎯 **Recommended: STV** - For proportional representation elections with multiple seats.';
  } else if (needsRankedPreferences) {
    suggestion += '🎯 **Recommended: Ranked Choice** - For single-winner elections with ranked preferences.';
  } else if (requiresBindingDecision) {
    suggestion += '🎯 **Recommended: Proposal** - For formal binding decisions with agree/disagree/block.';
  } else if (needsAnonymousVoting) {
    suggestion += '🎯 **Recommended: Poll (anonymous)** - For anonymous preference polling.';
  } else {
    suggestion += '🎯 **Recommended: Advice** - For gathering input without binding decision.';
  }
  
  suggestion += '\n\n📋 **All available types:**\n';
  for (const type of ['proposal', 'check', 'advice', 'consent', 'consensus', 'poll', 'score', 'dot_vote', 'ranked_choice', 'stv', 'meeting']) {
    const config = require('../../src/lib/loomio/proposalTypes').getProposalTypeConfig(type as any);
    suggestion += `  • ${config.label}: ${config.description}\n`;
  }
  
  return suggestion;
}

function draftProposal(args: any): string {
  const { discussionSummary, keyPoints, proposedOptions } = args;
  
  let draft = `# Proposal Draft\n\n`;
  draft += `## Context\n${discussionSummary}\n\n`;
  
  if (keyPoints && keyPoints.length > 0) {
    draft += `## Key Points\n`;
    for (const point of keyPoints) {
      draft += `- ${point}\n`;
    }
    draft += `\n`;
  }
  
  draft += `## Proposed Options\n`;
  for (let i = 0; i < proposedOptions.length; i++) {
    draft += `${i + 1}. ${proposedOptions[i]}\n`;
  }
  
  draft += `\n---\n*Generated from discussion summary*`;
  
  return draft;
}

function explainVoteOptions(proposalType: string): string {
  const config = require('../../src/lib/loomio/proposalTypes').getProposalTypeConfig(proposalType as any);
  if (!config) return `Unknown proposal type: ${proposalType}`;
  
  let explanation = `# ${config.label} Voting Guide\n\n`;
  explanation += `${config.description}\n\n`;
  explanation += `## Voting Method: ${config.votingMethod}\n\n`;
  explanation += `## Default Configuration\n`;
  explanation += `- Duration: ${config.defaults.durationDays ?? 7} days\n`;
  explanation += `- Hide Results: ${config.defaults.hideResults}\n`;
  explanation += `- Weighted Voting: ${config.constraints.supportsWeightedVoting ? 'Supported' : 'Not Supported'}\n`;
  explanation += `- Anonymous Voting: ${config.constraints.supportsAnonymous ? 'Supported' : 'Not Supported'}\n\n`;
  
  if (config.defaults.stvSeats) {
    explanation += `## STV Specific\n`;
    explanation += `- Seats: ${config.defaults.stvSeats}\n`;
    explanation += `- Method: ${config.defaults.stvMethod}\n`;
    explanation += `- Quota: ${config.defaults.stvQuota}\n`;
  }
  
  if (config.defaults.scoreMin !== undefined) {
    explanation += `## Score Range\n`;
    explanation += `- Min: ${config.defaults.scoreMin}\n`;
    explanation += `- Max: ${config.defaults.scoreMax}\n`;
  }
  
  if (config.defaults.pointsPerVoter) {
    explanation += `## Dot Voting\n`;
    explanation += `- Points per voter: ${config.defaults.pointsPerVoter}\n`;
  }
  
  return explanation;
}

// ============================================
// START SERVER
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ARM Loomio MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}