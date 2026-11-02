/**
 * Renta Básica Exponencial (RBE) — Core Logic
 * HSCSG v15 OS — Principio Anfibio (offline-first, dual-mode)
 * 5 Capas (A-E), 3 Presupuestos, Growth Controller, TQ Ledger
 * Pure logic, no side effects, fully typed
 */

export interface RBEConfig {
  /** Amphibious mode */
  mode: 'postmonetario' | 'conectado';
  /** Price parity oracle (ZNU per USD) */
  priceParity?: number;
  /** Growth controller parameters */
  growth: GrowthConfig;
  /** TQ Ledger parameters */
  tq: TQConfig;
  /** Validation mode */
  validation: 'strict' | 'lenient';
}

export interface GrowthConfig {
  /** Base growth rate (annual) */
  baseRate: number;
  /** Maximum growth rate cap */
  maxRate: number;
  /** Minimum growth rate floor */
  minRate: number;
  /** Regenerative capacity threshold for growth */
  capacityThreshold: number;
  /** Verification oracle address */
  verificationOracle?: string;
}

export interface TQConfig {
  /** Initial balance per member */
  initialBalance: number;
  /** Demurrage threshold (days) */
  demurrageThreshold: number;
  /** Demurrage rate (annual) */
  demurrageRate: number;
  /** Ice/Ecoinvent catalog integration */
  iceCatalog?: boolean;
  /** NFC offline support */
  nfcOffline?: boolean;
}

export interface RBEState {
  /** Layer A: Universal Dividend Floor */
  layerA: LayerAState;
  /** Layer B: Regenerative Capacity Dividend */
  layerB: LayerBState;
  /** Layer C: Verified Contribution Dividend */
  layerC: LayerCState;
  /** Layer D: Governance Participation Dividend */
  layerD: LayerDState;
  /** Layer E: Speculative/Innovation Dividend */
  layerE: LayerEState;
  /** Three budgets accounting */
  budgets: ThreeBudgetsState;
  /** Growth controller state */
  growth: GrowthState;
  /** TQ Ledger state */
  tq: TQState;
}

export interface LayerAState {
  /** Fixed universal floor (ZNU) */
  floor: number;
  /** Eligibility: all verified humans */
  eligibility: 'all_verified_humans';
  /** Payout frequency */
  frequency: 'monthly';
  /** Last payout timestamp */
  lastPayout: number;
  /** Total distributed this period */
  distributed: number;
}

export interface LayerBState {
  /** Variable dividend based on regenerative capacity */
  baseAmount: number;
  /** Current multiplier from capacity index */
  capacityMultiplier: number;
  /** Regenerative capacity index [0,1] */
  capacityIndex: number;
  /** Verified capacity contributions */
  contributions: CapacityContribution[];
  /** Last calculation timestamp */
  lastCalculation: number;
}

export interface CapacityContribution {
  id: string;
  memberId: string;
  type: 'ecological' | 'energy' | 'productive' | 'cooperative' | 'knowledge';
  amount: number; // ZNU equivalent
  verified: boolean;
  verificationProof?: string;
  timestamp: number;
}

export interface LayerCState {
  /** Contribution-based variable dividend */
  baseAmount: number;
  /** Verified contribution index */
  contributionIndex: number;
  /** Verified contributions log */
  contributions: VerifiedContribution[];
  /** Minimum threshold for eligibility */
  minThreshold: number;
}

export interface VerifiedContribution {
  id: string;
  memberId: string;
  type: 'labor' | 'capital' | 'knowledge' | 'care' | 'governance';
  hours?: number;
  valueZNU: number;
  verifiedBy: string;
  proofHash: string;
  timestamp: number;
}

export interface LayerDState {
  /** Governance participation dividend */
  baseAmount: number;
  /** Participation score [0,1] */
  participationScore: number;
  /** Governance activities */
  activities: GovernanceActivity[];
  /** Minimum participation for eligibility */
  minParticipation: number;
}

export interface GovernanceActivity {
  id: string;
  memberId: string;
  type: 'vote' | 'proposal' | 'jury' | 'delegation' | 'audit';
  weight: number;
  timestamp: number;
}

export interface LayerEState {
  /** Speculative/innovation dividend (high risk, high reward) */
  pool: number;
  /** Active innovation projects */
  projects: InnovationProject[];
  /** Allocation algorithm */
  allocation: 'quadratic' | 'conviction' | 'hybrid';
}

export interface InnovationProject {
  id: string;
  name: string;
  description: string;
  requestedAmount: number;
  allocatedAmount: number;
  contributors: string[];
  status: 'proposed' | 'funded' | 'active' | 'completed' | 'failed';
  expectedReturn?: number;
  actualReturn?: number;
}

export interface ThreeBudgetsState {
  /** Budget 1: Monetary (ZNU/USD) */
  monetary: BudgetState;
  /** Budget 2: Real/biophysical (energy, materials, land) */
  real: BudgetState;
  /** Budget 3: Ecological (carbon, biodiversity, regeneration) */
  ecological: BudgetState;
}

export interface BudgetState {
  /** Total allocated */
  allocated: number;
  /** Total spent */
  spent: number;
  /** Remaining */
  remaining: number;
  /** Currency/unit */
  unit: 'ZNU' | 'kWh' | 'ha' | 'kgCO2' | 'species';
  /** Transactions log */
  transactions: BudgetTransaction[];
}

export interface BudgetTransaction {
  id: string;
  fromLayer: 'A' | 'B' | 'C' | 'D' | 'E';
  toBudget: 'monetary' | 'real' | 'ecological';
  amount: number;
  description: string;
  timestamp: number;
}

export interface GrowthState {
  /** Current growth rate */
  currentRate: number;
  /** Target growth rate */
  targetRate: number;
  /** Regenerative capacity index */
  capacityIndex: number;
  /** Verification status */
  verified: boolean;
  /** Last adjustment timestamp */
  lastAdjustment: number;
  /** History of rate changes */
  history: GrowthHistoryEntry[];
}

export interface GrowthHistoryEntry {
  timestamp: number;
  previousRate: number;
  newRate: number;
  reason: string;
  capacityIndex: number;
}

export interface TQState {
  /** Member balances */
  balances: Map<string, number>;
  /** Demurrage schedule */
  demurrageSchedule: DemurrageEntry[];
  /** Transaction log */
  transactions: TQTransaction[];
  /** Ice/Ecoinvent catalog cache */
  iceCache?: Map<string, ICEEntry>;
}

export interface DemurrageEntry {
  memberId: string;
  amount: number;
  dueDate: number;
  applied: boolean;
}

export interface TQTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'payout' | 'demurrage' | 'mint' | 'burn';
  layer?: 'A' | 'B' | 'C' | 'D' | 'E';
  timestamp: number;
  proofHash?: string;
}

export interface ICEEntry {
  id: string;
  name: string;
  category: string;
  co2ePerUnit: number;
  unit: string;
  source: 'ICE' | 'Ecoinvent';
  lastUpdated: number;
}

/** Default configuration */
export const DEFAULT_RBE_CONFIG: RBEConfig = {
  mode: 'postmonetario',
  priceParity: 100, // 100 ZNU = 1 USD
  growth: {
    baseRate: 0.05, // 5% annual
    maxRate: 0.20, // 20% cap
    minRate: 0.01, // 1% floor
    capacityThreshold: 0.6,
  },
  tq: {
    initialBalance: 1000,
    demurrageThreshold: 30,
    demurrageRate: 0.05,
    iceCatalog: true,
    nfcOffline: true,
  },
  validation: 'strict',
};

/** Default initial state */
export const INITIAL_RBE_STATE: RBEState = {
  layerA: {
    floor: 100, // 100 ZNU/month
    eligibility: 'all_verified_humans',
    frequency: 'monthly',
    lastPayout: 0,
    distributed: 0,
  },
  layerB: {
    baseAmount: 50,
    capacityMultiplier: 1.0,
    capacityIndex: 0.5,
    contributions: [],
    lastCalculation: 0,
  },
  layerC: {
    baseAmount: 30,
    contributionIndex: 0,
    contributions: [],
    minThreshold: 10,
  },
  layerD: {
    baseAmount: 20,
    participationScore: 0,
    activities: [],
    minParticipation: 5,
  },
  layerE: {
    pool: 1000,
    projects: [],
    allocation: 'hybrid',
  },
  budgets: {
    monetary: { allocated: 0, spent: 0, remaining: 0, unit: 'ZNU', transactions: [] },
    real: { allocated: 0, spent: 0, remaining: 0, unit: 'kWh', transactions: [] },
    ecological: { allocated: 0, spent: 0, remaining: 0, unit: 'kgCO2', transactions: [] },
  },
  growth: {
    currentRate: 0.05,
    targetRate: 0.05,
    capacityIndex: 0.5,
    verified: false,
    lastAdjustment: 0,
    history: [],
  },
  tq: {
    balances: new Map(),
    demurrageSchedule: [],
    transactions: [],
    iceCache: new Map(),
  },
};

/**
 * Calculate total RBE dividend for a member
 */
export function calculateTotalDividend(
  state: RBEState,
  memberId: string,
  pohVerified: boolean
): { total: number; breakdown: DividendBreakdown } {
  if (!pohVerified) {
    return { total: 0, breakdown: { A: 0, B: 0, C: 0, D: 0, E: 0 } };
  }

  const breakdown: DividendBreakdown = {
    A: state.layerA.floor,
    B: state.layerB.baseAmount * state.layerB.capacityMultiplier,
    C: state.layerC.contributionIndex > state.layerC.minThreshold ? state.layerC.baseAmount : 0,
    D: state.layerD.participationScore > state.layerD.minParticipation ? state.layerD.baseAmount : 0,
    E: calculateLayerEAllocation(state, memberId),
  };

  const total = breakdown.A + breakdown.B + breakdown.C + breakdown.D + breakdown.E;

  return { total, breakdown };
}

export interface DividendBreakdown {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

/**
 * Calculate Layer E allocation for a member
 */
export function calculateLayerEAllocation(state: RBEState, memberId: string): number {
  const activeProjects = state.layerE.projects.filter(p => p.status === 'funded' || p.status === 'active');
  if (activeProjects.length === 0) return 0;

  // Quadratic funding allocation
  let memberContribution = 0;
  for (const project of activeProjects) {
    if (project.contributors.includes(memberId)) {
      memberContribution += project.allocatedAmount / Math.max(1, project.contributors.length);
    }
  }

  // Match from pool (simplified quadratic)
  const match = Math.sqrt(memberContribution * state.layerE.pool) * 0.1;
  return Math.min(match, state.layerE.pool / activeProjects.length);
}

/**
 * Update growth controller based on regenerative capacity
 */
export function updateGrowthController(
  state: RBEState,
  capacityIndex: number,
  config: RBEConfig
): RBEState {
  const newState = { ...state };
  newState.growth = { ...state.growth };
  newState.layerB = { ...state.layerB };

  newState.growth.capacityIndex = capacityIndex;
  newState.layerB.capacityIndex = capacityIndex;

  // Calculate new growth rate based on capacity
  const { baseRate, maxRate, minRate, capacityThreshold } = config.growth;
  let newRate = baseRate;

  if (capacityIndex > capacityThreshold) {
    // Exponential growth above threshold
    const excess = (capacityIndex - capacityThreshold) / (1 - capacityThreshold);
    newRate = baseRate + excess * (maxRate - baseRate);
  } else if (capacityIndex < 0.3) {
    // Decay below critical threshold
    newRate = Math.max(minRate, baseRate * (capacityIndex / 0.3));
  }

  newRate = Math.min(maxRate, Math.max(minRate, newRate));

  if (Math.abs(newRate - state.growth.currentRate) > 0.001) {
    newState.growth.history.push({
      timestamp: Date.now(),
      previousRate: state.growth.currentRate,
      newRate,
      reason: capacityIndex > capacityThreshold ? 'capacity_excess' : 'capacity_deficit',
      capacityIndex,
    });
    newState.growth.currentRate = newRate;
    newState.growth.targetRate = newRate;
    newState.growth.lastAdjustment = Date.now();
    newState.growth.verified = true;
  }

  // Update capacity multiplier for Layer B
  newState.layerB.capacityMultiplier = 1 + (capacityIndex - 0.5) * 2; // 0.5 index = 1.0x
  newState.layerB.lastCalculation = Date.now();

  return newState;
}

/**
 * Process monthly payout for all layers
 */
export function processMonthlyPayout(
  state: RBEState,
  members: string[],
  pohVerifiedMap: Map<string, boolean>,
  config: RBEConfig
): { newState: RBEState; payouts: Map<string, { total: number; breakdown: DividendBreakdown }> } {
  const newState = { ...state };
  newState.layerA = { ...state.layerA };
  newState.tq = { ...state.tq };
  newState.tq.balances = new Map(state.tq.balances);
  newState.tq.transactions = [...state.tq.transactions];

  const payouts = new Map<string, { total: number; breakdown: DividendBreakdown }>();

  for (const memberId of members) {
    const verified = pohVerifiedMap.get(memberId) || false;
    const { total, breakdown } = calculateTotalDividend(newState, memberId, verified);

    if (total > 0) {
      // Update TQ ledger
      const currentBalance = newState.tq.balances.get(memberId) || config.tq.initialBalance;
      newState.tq.balances.set(memberId, currentBalance + total);

      // Record transaction
      newState.tq.transactions.push({
        id: `tx_${Date.now()}_${memberId}`,
        from: 'RBE_SYSTEM',
        to: memberId,
        amount: total,
        type: 'payout',
        timestamp: Date.now(),
      });

      payouts.set(memberId, { total, breakdown });
    }
  }

  newState.layerA.lastPayout = Date.now();
  newState.layerA.distributed = Array.from(payouts.values()).reduce((sum, p) => sum + p.total, 0);

  return { newState, payouts };
}

/**
 * Add capacity contribution (Layer B)
 */
export function addCapacityContribution(
  state: RBEState,
  contribution: CapacityContribution
): RBEState {
  const newState = { ...state };
  newState.layerB = { ...state.layerB };
  newState.layerB.contributions = [...state.layerB.contributions, contribution];
  return newState;
}

/**
 * Add verified contribution (Layer C)
 */
export function addVerifiedContribution(
  state: RBEState,
  contribution: VerifiedContribution
): RBEState {
  const newState = { ...state };
  newState.layerC = { ...state.layerC };
  newState.layerC.contributions = [...state.layerC.contributions, contribution];

  // Update contribution index
  const memberContribs = newState.layerC.contributions.filter(c => c.memberId === contribution.memberId);
  const totalValue = memberContribs.reduce((sum, c) => sum + c.valueZNU, 0);
  newState.layerC.contributionIndex = totalValue / 1000; // Normalize

  return newState;
}

/**
 * Add governance activity (Layer D)
 */
export function addGovernanceActivity(
  state: RBEState,
  activity: GovernanceActivity
): RBEState {
  const newState = { ...state };
  newState.layerD = { ...state.layerD };
  newState.layerD.activities = [...state.layerD.activities, activity];

  // Update participation score
  const memberActivities = newState.layerD.activities.filter(a => a.memberId === activity.memberId);
  const totalWeight = memberActivities.reduce((sum, a) => sum + a.weight, 0);
  newState.layerD.participationScore = Math.min(1, totalWeight / 100);

  return newState;
}

/**
 * Propose innovation project (Layer E)
 */
export function proposeInnovationProject(
  state: RBEState,
  project: Omit<InnovationProject, 'id' | 'status' | 'allocatedAmount'>
): RBEState {
  const newState = { ...state };
  newState.layerE = { ...state.layerE };
  newState.layerE.projects = [
    ...state.layerE.projects,
    { ...project, id: `proj_${Date.now()}`, status: 'proposed', allocatedAmount: 0 }
  ];
  return newState;
}

/**
 * Fund innovation project (Layer E)
 */
export function fundInnovationProject(
  state: RBEState,
  projectId: string,
  amount: number,
  contributor: string
): RBEState {
  const newState = { ...state };
  newState.layerE = { ...state.layerE };
  newState.layerE.projects = state.layerE.projects.map(p => {
    if (p.id === projectId && p.status === 'proposed') {
      const newAllocated = p.allocatedAmount + amount;
      const newContributors = [...p.contributors, contributor];
      const newStatus = newAllocated >= p.requestedAmount ? 'funded' : 'proposed';
      return { ...p, allocatedAmount: newAllocated, contributors: newContributors, status: newStatus };
    }
    return p;
  });

  // Deduct from pool
  newState.layerE.pool = Math.max(0, state.layerE.pool - amount);

  return newState;
}

/**
 * Three-budget transaction
 */
export function transferBetweenBudgets(
  state: RBEState,
  fromLayer: 'A' | 'B' | 'C' | 'D' | 'E',
  toBudget: 'monetary' | 'real' | 'ecological',
  amount: number,
  description: string
): RBEState {
  const newState = { ...state };
  newState.budgets = { ...state.budgets };

  // Determine source budget based on layer
  const sourceBudget = fromLayer === 'A' || fromLayer === 'C' ? 'monetary'
    : fromLayer === 'B' ? 'real'
    : fromLayer === 'D' ? 'monetary'
    : 'ecological';

  const from = newState.budgets[sourceBudget];
  const to = newState.budgets[toBudget];

  if (from.remaining < amount) {
    throw new Error(`Insufficient funds in ${sourceBudget} budget`);
  }

  from.remaining -= amount;
  from.spent += amount;
  to.remaining += amount;
  to.allocated += amount;

  const transaction: BudgetTransaction = {
    id: `bt_${Date.now()}`,
    fromLayer,
    toBudget,
    amount,
    description,
    timestamp: Date.now(),
  };

  from.transactions.push(transaction);
  to.transactions.push(transaction);

  return newState;
}

/**
 * Apply demurrage to TQ balances
 */
export function applyDemurrage(state: RBEState, config: RBEConfig): RBEState {
  const newState = { ...state };
  newState.tq = { ...state.tq };
  newState.tq.balances = new Map(state.tq.balances);
  newState.tq.demurrageSchedule = [...state.tq.demurrageSchedule];
  newState.tq.transactions = [...state.tq.transactions];

  const now = Date.now();
  const rate = config.tq.demurrageRate / 365; // daily rate

  for (const [memberId, balance] of newState.tq.balances.entries()) {
    if (balance > config.tq.demurrageThreshold) {
      const demurrageAmount = balance * rate;
      newState.tq.balances.set(memberId, balance - demurrageAmount);

      newState.tq.transactions.push({
        id: `dem_${Date.now()}_${memberId}`,
        from: memberId,
        to: 'DEMURRAGE_SINK',
        amount: demurrageAmount,
        type: 'demurrage',
        timestamp: now,
      });

      newState.tq.demurrageSchedule.push({
        memberId,
        amount: demurrageAmount,
        dueDate: now + 86400000, // next day
        applied: true,
      });
    }
  }

  return newState;
}

/**
 * Convert monetary amounts between modes (amphibious)
 */
export function convertAmount(
  amount: number,
  fromMode: 'postmonetario' | 'conectado',
  toMode: 'postmonetario' | 'conectado',
  priceParity: number
): number {
  if (fromMode === toMode) return amount;
  if (fromMode === 'conectado' && toMode === 'postmonetario') {
    return amount * priceParity; // USD -> ZNU
  }
  return amount / priceParity; // ZNU -> USD
}

/**
 * Generate OpenAPI spec for RBE module
 */
export function generateOpenAPISpec(): string {
  return `
openapi: 3.0.3
info:
  title: RBE (Renta Básica Exponencial) API
  version: 1.0.0
  description: Universal dividend with 5 layers, 3 budgets, growth controller, TQ Ledger
servers:
  - url: http://localhost:3000/api/rbe
paths:
  /dividend/{memberId}:
    get:
      summary: Calculate total dividend for member
      parameters:
        - name: memberId
          in: path
          required: true
          schema: { type: string }
        - name: pohVerified
          in: query
          schema: { type: boolean, default: false }
      responses:
        '200':
          description: Dividend breakdown
  /payout/monthly:
    post:
      summary: Process monthly payout for all members
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [members]
              properties:
                members:
                  type: array
                  items: { type: string }
                pohVerified:
                  type: object
                  additionalProperties: { type: boolean }
      responses:
        '200':
          description: Payout results per member
  /growth/update:
    post:
      summary: Update growth controller with capacity index
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [capacityIndex]
              properties:
                capacityIndex:
                  type: number
                  minimum: 0
                  maximum: 1
      responses:
        '200':
          description: Updated growth state
  /layer/B/contribution:
    post:
      summary: Add regenerative capacity contribution
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CapacityContribution'
      responses:
        '200':
          description: Updated Layer B state
  /layer/C/contribution:
    post:
      summary: Add verified contribution
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VerifiedContribution'
      responses:
        '200':
          description: Updated Layer C state
  /layer/D/activity:
    post:
      summary: Add governance activity
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GovernanceActivity'
      responses:
        '200':
          description: Updated Layer D state
  /layer/E/project:
    post:
      summary: Propose innovation project
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InnovationProject'
      responses:
        '200':
          description: Created project
  /layer/E/fund:
    post:
      summary: Fund innovation project
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [projectId, amount, contributor]
              properties:
                projectId: { type: string }
                amount: { type: number }
                contributor: { type: string }
      responses:
        '200':
          description: Updated project
  /budgets/transfer:
    post:
      summary: Transfer between three budgets
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [fromLayer, toBudget, amount, description]
              properties:
                fromLayer: { type: string, enum: [A, B, C, D, E] }
                toBudget: { type: string, enum: [monetary, real, ecological] }
                amount: { type: number }
                description: { type: string }
      responses:
        '200':
          description: Updated budgets
  /tq/demurrage:
    post:
      summary: Apply demurrage to TQ balances
      responses:
        '200':
          description: Updated TQ state
  /tq/balance/{memberId}:
    get:
      summary: Get TQ balance for member
      parameters:
        - name: memberId
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Balance info
  /convert:
    post:
      summary: Convert amount between amphibious modes
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [amount, fromMode, toMode, priceParity]
              properties:
                amount: { type: number }
                fromMode: { type: string, enum: [postmonetario, conectado] }
                toMode: { type: string, enum: [postmonetario, conectado] }
                priceParity: { type: number }
      responses:
        '200':
          description: Converted amount

components:
  schemas:
    DividendBreakdown:
      type: object
      properties:
        A: { type: number }
        B: { type: number }
        C: { type: number }
        D: { type: number }
        E: { type: number }
      required: [A, B, C, D, E]

    CapacityContribution:
      type: object
      required: [id, memberId, type, amount, verified, timestamp]
      properties:
        id: { type: string }
        memberId: { type: string }
        type: { type: string, enum: [ecological, energy, productive, cooperative, knowledge] }
        amount: { type: number }
        verified: { type: boolean }
        verificationProof: { type: string }
        timestamp: { type: number }

    VerifiedContribution:
      type: object
      required: [id, memberId, type, valueZNU, verifiedBy, proofHash, timestamp]
      properties:
        id: { type: string }
        memberId: { type: string }
        type: { type: string, enum: [labor, capital, knowledge, care, governance] }
        hours: { type: number }
        valueZNU: { type: number }
        verifiedBy: { type: string }
        proofHash: { type: string }
        timestamp: { type: number }

    GovernanceActivity:
      type: object
      required: [id, memberId, type, weight, timestamp]
      properties:
        id: { type: string }
        memberId: { type: string }
        type: { type: string, enum: [vote, proposal, jury, delegation, audit] }
        weight: { type: number }
        timestamp: { type: number }

    InnovationProject:
      type: object
      required: [id, name, description, requestedAmount, contributors, status]
      properties:
        id: { type: string }
        name: { type: string }
        description: { type: string }
        requestedAmount: { type: number }
        allocatedAmount: { type: number }
        contributors: { type: array, items: { type: string } }
        status: { type: string, enum: [proposed, funded, active, completed, failed] }
        expectedReturn: { type: number }
        actualReturn: { type: number }

    BudgetTransaction:
      type: object
      properties:
        id: { type: string }
        fromLayer: { type: string }
        toBudget: { type: string }
        amount: { type: number }
        description: { type: string }
        timestamp: { type: number }

    TQTransaction:
      type: object
      properties:
        id: { type: string }
        from: { type: string }
        to: { type: string }
        amount: { type: number }
        type: { type: string, enum: [transfer, payout, demurrage, mint, burn] }
        layer: { type: string }
        timestamp: { type: number }
        proofHash: { type: string }

  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - ApiKeyAuth: []
`;
}