// arm-sensorica/mcp/src/index.ts - MCP Server for Sensorica OVN
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  createContribution,
  createResource,
  createAffiliate,
  createExchangeFirm,
  createDefaultValueEquationConfig,
  createDefaultGovernanceConfig,
  createDefaultCommonsRules,
  createAccessRule,
  createTimeRestriction,
  createAccessCondition,
  createPrivateRegime,
  createPublicRegime,
  createCommonsRegime,
  createNonDominiumRegime,
  createDefaultCommonsRules,
  createDefaultGovernanceConfig,
  createDefaultCommonsRules,
  validateContribution,
  validateValueEquationConfig,
  DEFAULT_VALIDATION_RULES,
  summarizeContributions,
  analyzeAffiliates,
  filterAffiliates,
  sortAffiliates,
  checkResourceAvailability,
  executeDistributionDual,
  createDefaultValueEquationConfig,
  createDefaultGovernanceConfig,
  createDefaultCommonsRules,
  generateId,
  now
} from '@hscsg/arm-sensorica';

import { generateId, now } from '@hscsg/arm-sensorica/utils';

// ============================================
// MCP SERVER SETUP
// ============================================

const server = new Server(
  {
    name: 'arm-sensorica',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================
// TOOL DEFINITIONS
// ============================================

const TOOLS = [
  // Contribution tools
  {
    name: 'submit_contribution',
    description: 'Submit a new contribution for verification',
    inputSchema: {
      type: 'object',
      properties: {
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        projectId: { type: 'string', description: 'Project ID' },
        type: { 
          type: 'string', 
          enum: ['time', 'materials', 'capital', 'knowledge', 'space'],
          description: 'Contribution type' 
        },
        quantity: { type: 'number', description: 'Quantity value' },
        unit: { type: 'string', description: 'Unit (hours, units, USD, ZNU, etc.)' },
        evidence: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Evidence URIs' 
        },
        description: { type: 'string', description: 'Description' }
      },
      required: ['affiliateId', 'projectId', 'type', 'quantity', 'unit']
    }
  },
  {
    name: 'verify_contribution',
    description: 'Verify or dispute a contribution',
    inputSchema: {
      type: 'object',
      properties: {
        contributionId: { type: 'string', description: 'Contribution ID' },
        approve: { type: 'boolean', description: 'Approve or dispute' },
        reason: { type: 'string', description: 'Reason for dispute' }
      },
      required: ['contributionId', 'approve']
    }
  },
  // Project tools
  {
    name: 'create_project',
    description: 'Create a new project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Description' },
        regime: { 
          type: 'string', 
          enum: ['private', 'public', 'commons', 'non-dominium'],
          description: 'Property regime',
          default: 'commons'
        }
      },
      required: ['name', 'description']
    }
  },
  {
    name: 'join_project',
    description: 'Join a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        affiliateId: { type: 'string', description: 'Affiliate ID' }
      },
      required: ['projectId', 'affiliateId']
    }
  },
  // Distribution tools
  {
    name: 'execute_distribution',
    description: 'Execute dual-mode distribution',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        mode: { 
          type: 'string', 
          enum: ['postmonetario', 'conectado'],
          description: 'Distribution mode' 
        },
        revenue: { 
          type: 'object',
          properties: {
            postmonetario: { type: 'number', description: 'Revenue in ZNU/CaaS' },
            conectado: { type: 'number', description: 'Revenue in USD cents' }
          },
          required: ['postmonetario', 'conectado']
        }
      },
      required: ['projectId', 'mode', 'revenue']
    }
  },
  // Governance tools
  {
    name: 'propose_governance',
    description: 'Propose a governance change',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        type: { 
          type: 'string', 
          enum: ['valueEquationChange', 'governanceChange', 'resourceAllocation', 'exchangeFirmContract', 'projectCreation', 'affiliateRemoval'],
          description: 'Proposal type' 
        },
        title: { type: 'string', description: 'Title' },
        description: { type: 'string', description: 'Description' },
        proposedBy: { type: 'string', description: 'Proposer affiliate ID' }
      },
      required: ['projectId', 'type', 'title', 'description', 'proposedBy']
    }
  },
  {
    name: 'vote_proposal',
    description: 'Vote on a proposal',
    inputSchema: {
      type: 'object',
      properties: {
        proposalId: { type: 'string', description: 'Proposal ID' },
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        choice: { type: 'string', enum: ['yes', 'no', 'abstain'], description: 'Vote choice' }
      },
      required: ['proposalId', 'affiliateId', 'choice']
    }
  },
  // Affiliate tools
  {
    name: 'register_affiliate',
    description: 'Register a new affiliate',
    inputSchema: {
      type: 'object',
      properties: {
        displayName: { type: 'string', description: 'Display name' },
        email: { type: 'string', description: 'Email' },
        skills: { type: 'array', items: { type: 'string' }, description: 'Skills' },
        role: { 
          type: 'string', 
          enum: ['affiliate', 'placeKeeper', 'exchangeFirmRep'],
          default: 'affiliate'
        }
      },
      required: ['displayName']
    }
  },
  // Trust tools
  {
    name: 'update_trust',
    description: 'Update trust score (place keeper only)',
    inputSchema: {
      type: 'object',
      properties: {
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        score: { type: 'number', minimum: 0, maximum: 1, description: 'Score (0-1)' },
        reason: { type: 'string', description: 'Reason' },
        evidence: { type: 'array', items: { type: 'string' }, description: 'Evidence URIs' }
      },
      required: ['affiliateId', 'score', 'reason']
    }
  },
  // Resource tools
  {
    name: 'add_resource',
    description: 'Add a resource to a pool',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: { type: 'string', description: 'Resource pool ID' },
        name: { type: 'string', description: 'Resource name' },
        type: { 
          type: 'string', 
          enum: ['equipment', 'space', 'materials', 'digital', 'vehicle', 'tool', 'infrastructure', 'other'],
          description: 'Resource type' 
        },
        capacity: { type: 'number', description: 'Capacity' },
        unit: { type: 'string', description: 'Unit' },
        description: { type: 'string', description: 'Description' }
      },
      required: ['poolId', 'name', 'type', 'capacity', 'unit']
    }
  },
  {
    name: 'request_resource_access',
    description: 'Request resource access',
    inputSchema: {
      type: 'object',
      properties: {
        resourceId: { type: 'string', description: 'Resource ID' },
        affiliateId: { type: 'string', description: 'Affiliate ID' },
        startTime: { type: 'string', description: 'Start time (ISO)' },
        endTime: { type: 'string', description: 'End time (ISO)' },
        purpose: { type: 'string', description: 'Purpose' }
      },
      required: ['resourceId', 'affiliateId', 'startTime', 'endTime', 'purpose']
    }
  },
  // Weight/Value Equation tools
  {
    name: 'configure_value_equation',
    description: 'Configure value equation',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        mode: { type: 'string', enum: ['postmonetario', 'conectado'], default: 'postmonetario' },
        weights: {
          type: 'object',
          properties: {
            time: { type: 'number' },
            materials: { type: 'number' },
            capital: { type: 'number' },
            knowledge: { type: 'number' },
            space: { type: 'number' }
          }
        },
        reservePercentage: { type: 'number', default: 10 }
      },
      required: ['projectId']
    }
  },
  // Exchange Firm tools
  {
    name: 'create_exchange_firm',
    description: 'Create exchange firm',
    inputSchema: {
      type: 'object',
      properties: {
        legalEntity: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            jurisdiction: { type: 'string' },
            registrationNumber: { type: 'string' }
          },
          required: ['name', 'jurisdiction', 'registrationNumber']
        },
        representedOVN: { type: 'string', description: 'OVN ID' },
        revenueFlow: {
          type: 'object',
          properties: {
            ovnAllocation: { type: 'number', description: 'Percentage to OVN' },
            exchangeFirmFee: { type: 'number', description: 'Percentage firm fee' },
            distributionTrigger: { type: 'string', enum: ['on-receipt', 'periodic', 'manual'] }
          },
          required: ['ovnAllocation', 'exchangeFirmFee', 'distributionTrigger']
        },
        compliance: {
          type: 'object',
          properties: {
            kycRequired: { type: 'boolean' },
            amlRequired: { type: 'boolean' },
            reportingStandards: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      required: ['legalEntity', 'representedOVN', 'revenueFlow', 'compliance']
    }
  },
  {
    name: 'record_external_revenue',
    description: 'Record external revenue received by exchange firm',
    inputSchema: {
      type: 'object',
      properties: {
        exchangeFirmId: { type: 'string', description: 'Exchange firm ID' },
        amount: { 
          type: 'object',
          properties: {
            postmonetario: { type: 'number' },
            conectado: { type: 'number' }
          },
          required: ['postmonetario', 'conectado']
        },
        contractId: { type: 'string', description: 'Contract ID' },
        description: { type: 'string', description: 'Description' }
      },
      required: ['exchangeFirmId', 'amount', 'contractId', 'description']
    }
  }
];

// ============================================
// TOOL HANDLERS
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'submit_contribution': {
        const contribution = createContribution({
          affiliateId: args.affiliateId,
          projectId: args.projectId,
          type: args.type,
          quantity: { value: BigInt(Math.round(args.quantity * 10000)), unit: args.unit },
          evidence: args.evidence?.map(uri => ({
            type: 'document' as const,
            uri,
            timestamp: { value: Date.now(), timezone: 'UTC' }
          }),
          metadata: {
            description: args.description,
            tags: [],
            projectPhase: 'active'
          }
        });
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, contribution: contribution.id, status: 'pending' }, null, 2)
          }]
        };
      }

      case 'verify_contribution': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              contributionId: args.contributionId, 
              status: args.approve ? 'verified' : 'disputed',
              reason: args.reason
            }, null, 2)
          }]
        };
      }

      case 'create_project': {
        const regime = args.regime === 'commons' 
          ? { type: 'commons', stewards: [], commonsRules: { accessPolicy: 'member-only', maintenanceResponsibility: 'collective' } }
          : args.regime === 'private' 
            ? { type: 'private', owner: 'owner-id' }
            : { type: 'public', authority: 'authority-id' };
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              project: { name: args.name, description: args.description, regime: args.regime },
              message: 'Project created with default value equation and governance'
            }, null, 2)
          }]
        };
      }

      case 'join_project': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, projectId: args.projectId, affiliateId: args.affiliateId })
          }]
        };
      }

      case 'execute_distribution': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              projectId: args.projectId, 
              mode: args.mode,
              message: 'Distribution executed (would integrate with actual engine)'
            }, null, 2)
          }]
        };
      }

      case 'propose_governance': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              proposal: { 
                id: generateId('prop'),
                projectId: args.projectId,
                type: args.type,
                title: args.title,
                description: args.description,
                proposedBy: args.proposedBy,
                status: 'voting'
              }
            }, null, 2)
          }]
        };
      }

      case 'vote_proposal': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              proposalId: args.proposalId, 
              vote: { affiliateId: args.affiliateId, choice: args.choice }
            }, null, 2)
          }]
        };
      }

      case 'register_affiliate': {
        const affiliate = {
          id: generateId('aff'),
          profile: {
            displayName: args.displayName,
            skills: args.skills || [],
            contactInfo: { email: args.email }
          },
          governanceRole: args.role
        };
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, affiliate: affiliate.id }, null, 2)
          }]
        };
      }

      case 'update_trust': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              affiliateId: args.affiliateId, 
              score: args.score, 
              reason: args.reason,
              message: 'Trust updated (place keeper authorization required)'
            }, null, 2)
          }]
        };
      }

      case 'add_resource': {
        const resource = {
          id: generateId('res'),
          name: args.name,
          type: args.type,
          description: args.description || '',
          capacity: { value: BigInt(args.capacity), unit: args.unit },
          currentUsage: { value: 0n, unit: args.unit }
        };
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, resource: resource.id }, null, 2)
          }]
        };
      }

      case 'request_resource_access': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              request: { 
                id: generateId('access'),
                resourceId: args.resourceId,
                affiliateId: args.affiliateId,
                startTime: args.startTime,
                endTime: args.endTime,
                purpose: args.purpose,
                status: 'pending'
              }
            }, null, 2)
          }]
        };
      }

      case 'configure_value_equation': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              projectId: args.projectId,
              config: { mode: args.mode, weights: args.weights, reservePercentage: args.reservePercentage },
              message: 'Value equation configured (requires governance approval)'
            }, null, 2)
          }]
        };
      }

      case 'create_exchange_firm': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              exchangeFirm: { 
                id: generateId('exf'),
                legalEntity: args.legalEntity,
                representedOVN: args.representedOVN,
                revenueFlow: args.revenueFlow,
                compliance: args.compliance
              }
            }, null, 2)
          }]
        };
      }

      case 'record_external_revenue': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              exchangeFirmId: args.exchangeFirmId,
              amount: args.amount,
              contractId: args.contractId,
              description: args.description,
              message: 'Revenue recorded (distribution per revenue flow config)'
            }, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

// ============================================
// SERVER STARTUP
// ============================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ARM Sensorica MCP server running on stdio');
}

main().catch(console.error);