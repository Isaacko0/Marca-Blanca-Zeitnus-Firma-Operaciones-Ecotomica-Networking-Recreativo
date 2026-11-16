// arm-sensorica/cli/src/index.ts - CLI Commands
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
  createDefaultCommonsRules
} from '@hscsg/arm-sensorica';

import { generateId, now, formatDualValue } from '@hscsg/arm-sensorica/utils';

import { Command } from 'commander';

const program = new Command();

program
  .name('arm-sensorica')
  .description('Sensorica OVN CLI - Open Value Network primitives for ARM')
  .version('0.1.0');

// ============================================
// CONTRIBUTION COMMANDS
// ============================================

program
  .command('contribution submit')
  .description('Submit a new contribution')
  .requiredOption('-p, --project <id>', 'Project ID')
  .requiredOption('-t, --type <type>', 'Contribution type (time|materials|capital|knowledge|space)')
  .requiredOption('-q, --quantity <value>', 'Quantity value')
  .requiredOption('-u, --unit <unit>', 'Unit (hours, units, USD, ZNU, etc.)')
  .option('-e, --evidence <uri>', 'Evidence URI')
  .option('-d, --description <text>', 'Description')
  .action(async (options) => {
    const contribution = createContribution({
      affiliateId: 'current-user', // would come from auth
      projectId: options.project,
      type: options.type as any,
      quantity: { value: BigInt(options.quantity), unit: options.unit },
      evidence: options.evidence ? [{
        type: 'document',
        uri: options.evidence,
        timestamp: { value: Date.now(), timezone: 'UTC' }
      }] : undefined,
      metadata: {
        description: options.description,
        tags: [],
        projectPhase: 'active'
      }
    });
    
    console.log('Contribution submitted:', contribution.id);
    console.log('Status: pending verification');
  });

program
  .command('contribution verify')
  .description('Verify or dispute a contribution')
  .requiredOption('-c, --contribution <id>', 'Contribution ID')
  .requiredOption('-a, --approve <boolean>', 'Approve or dispute')
  .option('-r, --reason <text>', 'Reason for dispute')
  .action(async (options) => {
    console.log(`Contribution ${options.contribution} ${options.approve === 'true' ? 'approved' : 'disputed'}`);
    if (!options.approve) console.log('Reason:', options.reason);
  });

// ============================================
// PROJECT COMMANDS
// ============================================

program
  .command('project create')
  .description('Create a new project')
  .requiredOption('-n, --name <name>', 'Project name')
  .requiredOption('-d, --description <text>', 'Description')
  .option('-r, --regime <type>', 'Property regime (private|public|commons|non-dominium)', 'commons')
  .action(async (options) => {
    const regime = createCommonsRegime([], createDefaultCommonsRules());
    const valueEquation = createDefaultValueEquationConfig(generateId('proj'));
    const governance = createDefaultGovernanceConfig();
    
    console.log('Project created:', {
      name: options.name,
      description: options.description,
      regime: options.regime,
      valueEquation: 'configured with defaults',
      governance: 'configured with defaults'
    });
  });

program
  .command('project join')
  .description('Join a project')
  .requiredOption('-p, --project <id>', 'Project ID')
  .action(async (options) => {
    console.log(`Joined project ${options.project}`);
  });

// ============================================
// DISTRIBUTION COMMANDS
// ============================================

program
  .command('distribution execute')
  .description('Execute dual-mode distribution')
  .requiredOption('-p, --project <id>', 'Project ID')
  .requiredOption('-m, --mode <mode>', 'Mode (postmonetario|conectado)')
  .requiredOption('-r, --revenue-postmonetario <value>', 'Revenue in postmonetario mode (ZNU)')
  .requiredOption('-r, --revenue-conectado <value>', 'Revenue in conectado mode (USD cents)')
  .action(async (options) => {
    // This would integrate with the actual distribution engine
    console.log('Executing distribution:', {
      project: options.project,
      mode: options.mode,
      revenue: {
        postmonetario: options.revenuePostmonetario,
        conectado: options.revenueConectado
      }
    });
  });

// ============================================
// GOVERNANCE COMMANDS
// ============================================

program
  .command('governance propose')
  .description('Propose a governance change')
  .requiredOption('-p, --project <id>', 'Project ID')
  .requiredOption('-t, --type <type>', 'Proposal type')
  .requiredOption('-T, --title <title>', 'Title')
  .requiredOption('-d, --description <text>', 'Description')
  .action(async (options) => {
    console.log('Governance proposal created:', options);
  });

program
  .command('governance vote')
  .description('Vote on a proposal')
  .requiredOption('-p, --proposal <id>', 'Proposal ID')
  .requiredOption('-c, --choice <choice>', 'Choice (yes|no|abstain)')
  .action(async (options) => {
    console.log('Vote cast:', options);
  });

// ============================================
// AFFILIATE COMMANDS
// ============================================

program
  .command('affiliate register')
  .description('Register a new affiliate')
  .requiredOption('-n, --name <name>', 'Display name')
  .option('-e, --email <email>', 'Email')
  .option('-s, --skills <skills>', 'Comma-separated skills')
  .option('-r, --role <role>', 'Role (affiliate|placeKeeper|exchangeFirmRep)', 'affiliate')
  .action(async (options) => {
    const affiliate = createAffiliate({
      displayName: options.name,
      skills: options.skills?.split(',') || [],
      email: options.email,
      initialRole: options.role as any
    });
    console.log('Affiliate registered:', affiliate.id);
  });

program
  .command('affiliate list')
  .description('List affiliates')
  .option('-r, --role <role>', 'Filter by role')
  .option('-p, --project <id>', 'Filter by project')
  .action(async (options) => {
    console.log('Affiliates:', []);
  });

// ============================================
// TRUST COMMANDS
// ============================================

program
  .command('trust update')
  .description('Update trust score (place keeper only)')
  .requiredOption('-a, --affiliate <id>', 'Affiliate ID')
  .requiredOption('-s, --score <value>', 'Score (0-1)')
  .requiredOption('-r, --reason <text>', 'Reason')
  .action(async (options) => {
    console.log(`Trust updated for ${options.affiliate}: ${options.score}`);
    console.log('Reason:', options.reason);
  });

// ============================================
// RESOURCE COMMANDS
// ============================================

program
  .command('resource add')
  .description('Add a resource to a pool')
  .requiredOption('-p, --pool <id>', 'Resource pool ID')
  .requiredOption('-n, --name <name>', 'Resource name')
  .requiredOption('-t, --type <type>', 'Resource type')
  .requiredOption('-c, --capacity <value>', 'Capacity')
  .requiredOption('-u, --unit <unit>', 'Unit')
  .option('-d, --description <text>', 'Description')
  .action(async (options) => {
    const resource = createResource({
      name: options.name,
      type: options.type as any,
      description: options.description || '',
      capacity: { value: BigInt(options.capacity), unit: options.unit }
    });
    console.log('Resource added to pool:', options.pool, resource.id);
  });

program
  .command('resource access')
  .description('Request resource access')
  .requiredOption('-r, --resource <id>', 'Resource ID')
  .requiredOption('-s, --start <iso>', 'Start time (ISO)')
  .requiredOption('-e, --end <iso>', 'End time (ISO)')
  .requiredOption('-p, --purpose <text>', 'Purpose')
  .action(async (options) => {
    console.log('Access requested:', {
      resource: options.resource,
      start: options.start,
      end: options.end,
      purpose: options.purpose
    });
  });

// ============================================
// WEIGHTS COMMANDS
// ============================================

program
  .command('weights show')
  .description('Show value equation weights')
  .requiredOption('-p, --project <id>', 'Project ID')
  .action(async (options) => {
    console.log('Value equation weights for project:', options.project);
  });

program
  .command('weights set')
  .description('Set value equation weights')
  .requiredOption('-p, --project <id>', 'Project ID')
  .requiredOption('-t, --time <value>', 'Time weight')
  .requiredOption('-m, --materials <value>', 'Materials weight')
  .requiredOption('-c, --capital <value>', 'Capital weight')
  .requiredOption('-k, --knowledge <value>', 'Knowledge weight')
  .requiredOption('-s, --space <value>', 'Space weight')
  .action(async (options) => {
    console.log('Weights updated:', options);
  });

// ============================================
// GRATIFIERIA COMMANDS
// ============================================

program
  .command('gratifieria sync')
  .description('Sync with Gratifieria matchmaker')
  .requiredOption('-p, --project <id>', 'Project ID')
  .action(async (options) => {
    console.log('Syncing with Gratifieria...');
  });

// ============================================
// MATCHMAKER COMMANDS
// ============================================

program
  .command('matchmaker match')
  .description('Run matchmaker algorithm')
  .requiredOption('-p, --project <id>', 'Project ID')
  .action(async (options) => {
    console.log('Running matchmaker for project:', options.project);
  });

program
  .command('matchmaker weights')
  .description('Show matchmaker weights')
  .action(async () => {
    console.log('Matchmaker weights: category=1.0, location=0.8, time=0.6, quantity=0.7');
  });

// Parse and execute
program.parseAsync(process.argv).catch(console.error);