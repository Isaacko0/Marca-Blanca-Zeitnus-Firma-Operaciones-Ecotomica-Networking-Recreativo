/**
 * Control Laws in Aging and Longevity — Core Logic
 * Paper: Zhavoronkov & Mishra (2025) — arXiv:2406.04257v2
 * HSCSG v15 OS — Principio Anfibio (offline-first, dual-mode)
 * Pure logic, no side effects, fully typed
 */

export interface ViabilitySet {
  /** Safe operating bounds for physiological state variables */
  bounds: StateBounds;
  /** Hamilton-Jacobi PDE viability kernel computation */
  kernel: number[][][];
}

export interface StateBounds {
  /** Chronological age (years) */
  age: [number, number];
  /** Biological age (years) */
  bioAge: [number, number];
  /** Health capital index [0,1] */
  healthCapital: [number, number];
  /** Damage load (arbitrary units) */
  damageLoad: [number, number];
  /** Intervention capacity [0,1] */
  interventionCapacity: [number, number];
}

export interface VectorField {
  /** State vector: [age, bioAge, healthCapital, damageLoad, interventionCapacity] */
  state: number[];
  /** Time derivative dx/dt = f(x, u) */
  derivative: number[];
  /** Control input u(t) */
  control: number[];
  /** Lie bracket [f, g] for commutation analysis */
  lieBracket?: number[][];
}

export interface ControlCost {
  /** Economic cost of intervention (USD or ZNU) */
  economic: number;
  /** Biological cost: side effects, resource diversion */
  biological: number;
  /** Entropic cost: information/coordination overhead */
  entropic: number;
  /** Total control cost = weighted sum */
  total: number;
}

export interface Intervention {
  id: string;
  name: string;
  type: 'pharmacological' | 'lifestyle' | 'gene' | 'senolytic' | 'metabolic' | 'combination';
  /** Control vector g(x) for this intervention */
  controlVector: number[];
  /** Cost function parameters */
  costParams: ControlCostParams;
  /** Efficacy decay rate (per year) */
  decayRate: number;
  /** Minimum viable dosage/intensity */
  minIntensity: number;
  /** Maximum safe dosage/intensity */
  maxIntensity: number;
}

export interface ControlCostParams {
  economicWeight: number;
  biologicalWeight: number;
  entropicWeight: number;
  /** Non-linear scaling exponent */
  scalingExponent: number;
}

export interface CaseStudyResult {
  id: string;
  name: string;
  /** Initial state vector */
  x0: number[];
  /** Optimal control trajectory u*(t) */
  optimalControl: number[][];
  /** State trajectory x*(t) */
  stateTrajectory: number[][];
  /** Cost integral J = ∫ L(x,u) dt */
  totalCost: number;
  /** Lifespan extension (years) */
  lifespanGain: number;
  /** Healthspan extension (years) */
  healthspanGain: number;
  /** Feasibility flags */
  feasible: {
    economic: boolean;
    biological: boolean;
    entropic: boolean;
  };
}

export interface AgingControlConfig {
  /** Time horizon (years) */
  horizon: number;
  /** Discount rate for future costs */
  discountRate: number;
  /** Viability kernel tolerance */
  viabilityTol: number;
  /** Lie bracket computation precision */
  liePrecision: number;
  /** Amphibious mode: 'postmonetario' | 'conectado' */
  mode: 'postmonetario' | 'conectado';
  /** Price parity oracle for conectado mode */
  priceParity?: number; // ZNU per USD
}

/**
 * Default 5D physiological state bounds (from paper Table 1)
 */
export const DEFAULT_VIABILITY_BOUNDS: ViabilitySet = {
  bounds: {
    age: [0, 120],
    bioAge: [0, 150],
    healthCapital: [0, 1],
    damageLoad: [0, 100],
    interventionCapacity: [0, 1],
  },
  kernel: [], // Computed on demand via HJ-PDE
};

/**
 * Canonical interventions from paper Section 4
 */
export const CANONICAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'metformin',
    name: 'Metformin',
    type: 'pharmacological',
    controlVector: [0, -0.02, 0.01, -0.05, 0.01],
    costParams: { economicWeight: 0.1, biologicalWeight: 0.3, entropicWeight: 0.2, scalingExponent: 1.2 },
    decayRate: 0.05,
    minIntensity: 500, // mg/day
    maxIntensity: 2000,
  },
  {
    id: 'rapamycin',
    name: 'Rapamycin',
    type: 'pharmacological',
    controlVector: [0, -0.05, 0.03, -0.1, 0.02],
    costParams: { economicWeight: 0.4, biologicalWeight: 0.5, entropicWeight: 0.3, scalingExponent: 1.5 },
    decayRate: 0.08,
    minIntensity: 1, // mg/week
    maxIntensity: 6,
  },
  {
    id: 'senolytic',
    name: 'Senolytic (D+Q)',
    type: 'senolytic',
    controlVector: [0, -0.1, 0.05, -0.2, 0.03],
    costParams: { economicWeight: 0.3, biologicalWeight: 0.4, entropicWeight: 0.25, scalingExponent: 1.3 },
    decayRate: 0.15,
    minIntensity: 1, // cycles/year
    maxIntensity: 4,
  },
  {
    id: 'exercise',
    name: 'Exercise (HIIT + Resistance)',
    type: 'lifestyle',
    controlVector: [0, -0.03, 0.04, -0.08, 0.05],
    costParams: { economicWeight: 0.05, biologicalWeight: 0.1, entropicWeight: 0.15, scalingExponent: 1.1 },
    decayRate: 0.02,
    minIntensity: 3, // sessions/week
    maxIntensity: 7,
  },
  {
    id: 'caloric_restriction',
    name: 'Caloric Restriction (15%)',
    type: 'metabolic',
    controlVector: [0, -0.04, 0.02, -0.06, 0.02],
    costParams: { economicWeight: -0.1, biologicalWeight: 0.2, entropicWeight: 0.1, scalingExponent: 1.0 },
    decayRate: 0.01,
    minIntensity: 0.85, // fraction of ad libitum
    maxIntensity: 0.95,
  },
  {
    id: 'combo_standard',
    name: 'Standard Combo (Metformin + Exercise + CR)',
    type: 'combination',
    controlVector: [0, -0.08, 0.06, -0.15, 0.07],
    costParams: { economicWeight: 0.05, biologicalWeight: 0.25, entropicWeight: 0.2, scalingExponent: 1.15 },
    decayRate: 0.04,
    minIntensity: 1,
    maxIntensity: 1,
  },
  {
    id: 'combo_aggressive',
    name: 'Aggressive Combo (Rapamycin + Senolytic + Exercise + CR)',
    type: 'combination',
    controlVector: [0, -0.18, 0.12, -0.35, 0.1],
    costParams: { economicWeight: 0.5, biologicalWeight: 0.6, entropicWeight: 0.4, scalingExponent: 1.4 },
    decayRate: 0.1,
    minIntensity: 1,
    maxIntensity: 1,
  },
];

/**
 * Compute Lie bracket [f, g] for vector fields f (drift) and g (control)
 * [f, g]_i = Σ_j (∂g_i/∂x_j * f_j - ∂f_i/∂x_j * g_j)
 */
export function computeLieBracket(
  drift: (x: number[]) => number[],
  control: (x: number[]) => number[],
  x: number[],
  eps = 1e-6
): number[][] {
  const n = x.length;
  const bracket: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  const f = drift(x);
  const g = control(x);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const xPlus = [...x];
      const xMinus = [...x];
      xPlus[j] += eps;
      xMinus[j] -= eps;

      const dg_dxj = (control(xPlus)[i] - control(xMinus)[i]) / (2 * eps);
      const df_dxj = (drift(xPlus)[i] - drift(xMinus)[i]) / (2 * eps);

      bracket[i][j] = dg_dxj * f[j] - df_dxj * g[j];
    }
  }
  return bracket;
}

/**
 * Drift vector field f(x) — uncontrolled aging dynamics
 * dx/dt = f(x) from paper Eq. (3)
 */
export function agingDrift(x: number[]): number[] {
  const [age, bioAge, healthCapital, damageLoad, interventionCapacity] = x;

  // Chronological age always increases at rate 1
  const dAge = 1;

  // Biological age acceleration: Gompertz-like + damage coupling
  const bioAgeAccel = 0.08 * Math.exp(0.08 * bioAge) + 0.005 * damageLoad;
  const dBioAge = 1 + bioAgeAccel;

  // Health capital decay: exponential with damage coupling
  const healthDecay = 0.02 * Math.exp(0.05 * (1 - healthCapital)) + 0.001 * damageLoad;
  const dHealthCapital = -healthDecay * healthCapital;

  // Damage accumulation: linear + quadratic (autocatalytic)
  const damageAccum = 0.5 + 0.01 * damageLoad + 0.0001 * damageLoad * damageLoad;
  const dDamageLoad = damageAccum;

  // Intervention capacity decay: logistic with age
  const capacityDecay = 0.01 / (1 + Math.exp(-0.1 * (age - 60)));
  const dInterventionCapacity = -capacityDecay * interventionCapacity;

  return [dAge, dBioAge, dHealthCapital, dDamageLoad, dInterventionCapacity];
}

/**
 * Control vector field g_i(x) for intervention i
 * dx/dt = f(x) + Σ u_i * g_i(x)
 */
export function interventionControlVector(intervention: Intervention, x: number[]): number[] {
  const [, , healthCapital, damageLoad, interventionCapacity] = x;
  const baseVector = intervention.controlVector;

  // Scale by current capacity and health state
  const capacityFactor = Math.max(0.1, interventionCapacity);
  const healthFactor = Math.max(0.2, healthCapital);

  return baseVector.map((v, idx) => {
    if (idx === 0) return 0; // Age not directly controllable
    if (idx === 1) return v * capacityFactor * healthFactor; // BioAge
    if (idx === 2) return v * healthFactor; // HealthCapital
    if (idx === 3) return v * capacityFactor; // DamageLoad
    if (idx === 4) return v * 0.5; // InterventionCapacity (small feedback)
    return v;
  });
}

/**
 * Hamiltonian for optimal control: H(x, p, u) = p·f(x) + Σ u_i * p·g_i(x) - L(x, u)
 * Using Pontryagin's Maximum Principle
 */
export function computeHamiltonian(
  x: number[],
  p: number[], // Costate vector
  u: number[], // Control intensities
  interventions: Intervention[],
  config: AgingControlConfig
): number {
  const f = agingDrift(x);
  let H = 0;

  // p·f(x)
  for (let i = 0; i < x.length; i++) {
    H += p[i] * f[i];
  }

  // Σ u_i * p·g_i(x) - L(x, u)
  for (let i = 0; i < interventions.length; i++) {
    const g = interventionControlVector(interventions[i], x);
    let pg = 0;
    for (let j = 0; j < x.length; j++) {
      pg += p[j] * g[j];
    }
    H += u[i] * pg - runningCost(x, u[i], interventions[i], config);
  }

  return H;
}

/**
 * Running cost L(x, u) = economic + biological + entropic costs
 */
export function runningCost(
  x: number[],
  u: number,
  intervention: Intervention,
  config: AgingControlConfig
): number {
  const { economicWeight, biologicalWeight, entropicWeight, scalingExponent } = intervention.costParams;
  const [, , healthCapital, damageLoad, interventionCapacity] = x;

  // Economic cost: scales with intensity^exponent, modulated by mode
  const baseEconomic = economicWeight * Math.pow(u, scalingExponent);
  const economicCost = config.mode === 'conectado' && config.priceParity
    ? baseEconomic * config.priceParity // Convert to ZNU
    : baseEconomic; // Postmonetario: pure cost units

  // Biological cost: side effects increase with damage load and intensity
  const biologicalCost = biologicalWeight * u * (1 + 0.01 * damageLoad) * (2 - healthCapital);

  // Entropic cost: coordination/information overhead
  const entropicCost = entropicWeight * u * (1 + 0.1 * (1 - interventionCapacity));

  return economicCost + biologicalCost + entropicCost;
}

/**
 * Total control cost for a trajectory (integral of running cost)
 */
export function computeTotalControlCost(
  trajectory: { state: number[]; controls: number[] }[],
  interventions: Intervention[],
  config: AgingControlConfig
): ControlCost {
  let economic = 0, biological = 0, entropic = 0;

  for (const step of trajectory) {
    for (let i = 0; i < interventions.length; i++) {
      const u = step.controls[i];
      const { economicWeight, biologicalWeight, entropicWeight, scalingExponent } = interventions[i].costParams;
      const [, , healthCapital, damageLoad, interventionCapacity] = step.state;

      economic += economicWeight * Math.pow(u, scalingExponent);
      biological += biologicalWeight * u * (1 + 0.01 * damageLoad) * (2 - healthCapital);
      entropic += entropicWeight * u * (1 + 0.1 * (1 - interventionCapacity));
    }
  }

  // Apply price parity if in conectado mode
  if (config.mode === 'conectado' && config.priceParity) {
    economic *= config.priceParity;
  }

  return { economic, biological, entropic, total: economic + biological + entropic };
}

/**
 * Viability kernel check: is state x within safe operating envelope?
 */
export function isViable(x: number[], bounds: StateBounds, tol = 0.01): boolean {
  const vars: (keyof StateBounds)[] = ['age', 'bioAge', 'healthCapital', 'damageLoad', 'interventionCapacity'];
  for (const v of vars) {
    const [min, max] = bounds[v];
    const val = v === 'age' ? x[0]
      : v === 'bioAge' ? x[1]
      : v === 'healthCapital' ? x[2]
      : v === 'damageLoad' ? x[3]
      : x[4];
    if (val < min - tol || val > max + tol) return false;
  }
  return true;
}

/**
 * Simulate controlled aging trajectory using forward Euler
 */
export function simulateTrajectory(
  x0: number[],
  controls: number[][],
  interventions: Intervention[],
  dt = 0.1,
  horizon = 30
): { state: number[]; controls: number[] }[] {
  const steps = Math.round(horizon / dt);
  const trajectory: { state: number[]; controls: number[] }[] = [];
  let x = [...x0];

  for (let step = 0; step <= steps; step++) {
    const u = controls[Math.min(step, controls.length - 1)] || Array(interventions.length).fill(0);

    // dx/dt = f(x) + Σ u_i * g_i(x)
    const f = agingDrift(x);
    const dx = [...f];

    for (let i = 0; i < interventions.length; i++) {
      const g = interventionControlVector(interventions[i], x);
      for (let j = 0; j < x.length; j++) {
        dx[j] += u[i] * g[j];
      }
    }

    trajectory.push({ state: [...x], controls: [...u] });

    // Euler step
    for (let j = 0; j < x.length; j++) {
      x[j] += dx[j] * dt;
    }

    // Clamp to viability bounds
    const bounds = DEFAULT_VIABILITY_BOUNDS.bounds;
    x[0] = Math.min(Math.max(x[0], bounds.age[0]), bounds.age[1]);
    x[1] = Math.min(Math.max(x[1], bounds.bioAge[0]), bounds.bioAge[1]);
    x[2] = Math.min(Math.max(x[2], bounds.healthCapital[0]), bounds.healthCapital[1]);
    x[3] = Math.min(Math.max(x[3], bounds.damageLoad[0]), bounds.damageLoad[1]);
    x[4] = Math.min(Math.max(x[4], bounds.interventionCapacity[0]), bounds.interventionCapacity[1]);
  }

  return trajectory;
}

/**
 * Compute lifespan and healthspan from trajectory
 */
export function computeLifespanMetrics(trajectory: { state: number[] }[]): { lifespan: number; healthspan: number } {
  let lifespan = 0;
  let healthspan = 0;
  const healthThreshold = 0.5; // Health capital below this = end of healthspan

  for (let i = 1; i < trajectory.length; i++) {
    const dt = 0.1; // Fixed step
    const healthPrev = trajectory[i - 1].state[2];
    const healthCurr = trajectory[i].state[2];
    const bioAgeCurr = trajectory[i].state[1];

    lifespan += dt;
    if (healthPrev > healthThreshold || healthCurr > healthThreshold) {
      healthspan += dt;
    }

    // Death condition: bioAge > 120 or healthCapital < 0.1
    if (bioAgeCurr > 120 || healthCurr < 0.1) break;
  }

  return { lifespan, healthspan };
}

/**
 * Optimal control via direct transcription (simplified)
 * Returns optimal control sequence for given interventions
 */
export function computeOptimalControl(
  x0: number[],
  interventions: Intervention[],
  config: AgingControlConfig
): { controls: number[][]; trajectory: { state: number[]; controls: number[] }[]; cost: ControlCost } {
  const steps = Math.round(config.horizon / 0.1);
  const nInterventions = interventions.length;

  // Initialize with heuristic: proportional to control vector magnitude
  const controls: number[][] = Array.from({ length: steps }, () =>
    Array(nInterventions).fill(0).map((_, i) =>
      interventions[i].minIntensity + 0.3 * (interventions[i].maxIntensity - interventions[i].minIntensity)
    )
  );

  // Simple gradient descent on cost (placeholder for full PMP solver)
  let bestTrajectory = simulateTrajectory(x0, controls, interventions, 0.1, config.horizon);
  let bestCost = computeTotalControlCost(bestTrajectory, interventions, config).total;

  for (let iter = 0; iter < 50; iter++) {
    // Perturb each control
    for (let i = 0; i < nInterventions; i++) {
      for (let step = 0; step < steps; step += 10) {
        const testControls = controls.map((c, si) => si === step ? [...c] : c);
        testControls[step][i] = Math.min(
          interventions[i].maxIntensity,
          Math.max(interventions[i].minIntensity, testControls[step][i] * 1.1)
        );

        const testTraj = simulateTrajectory(x0, testControls, interventions, 0.1, config.horizon);
        const testCost = computeTotalControlCost(testTraj, interventions, config).total;

        if (testCost < bestCost) {
          bestCost = testCost;
          bestTrajectory = testTraj;
          controls[step][i] = testControls[step][i];
        }
      }
    }
  }

  return {
    controls: bestTrajectory.map(t => t.controls),
    trajectory: bestTrajectory,
    cost: computeTotalControlCost(bestTrajectory, interventions, config),
  };
}

/**
 * Run canonical case studies from paper Section 4
 */
export function runCaseStudies(config: AgingControlConfig): CaseStudyResult[] {
  const results: CaseStudyResult[] = [];

  // Case 1: Healthy 40yo, standard combo
  const x0_1: number[] = [40, 38, 0.85, 10, 0.9];
  const interventions1 = [CANONICAL_INTERVENTIONS.find(i => i.id === 'combo_standard')!];
  const opt1 = computeOptimalControl(x0_1, interventions1, config);
  const metrics1 = computeLifespanMetrics(opt1.trajectory);
  results.push({
    id: 'case1_healthy_40',
    name: 'Healthy 40yo — Standard Combo',
    x0: x0_1,
    optimalControl: opt1.controls,
    stateTrajectory: opt1.trajectory.map(t => t.state),
    totalCost: opt1.cost.total,
    lifespanGain: metrics1.lifespan - 40,
    healthspanGain: metrics1.healthspan - 40,
    feasible: { economic: opt1.cost.economic < 1000, biological: true, entropic: true },
  });

  // Case 2: Pre-frail 60yo, aggressive combo
  const x0_2: number[] = [60, 68, 0.55, 45, 0.5];
  const interventions2 = [CANONICAL_INTERVENTIONS.find(i => i.id === 'combo_aggressive')!];
  const opt2 = computeOptimalControl(x0_2, interventions2, config);
  const metrics2 = computeLifespanMetrics(opt2.trajectory);
  results.push({
    id: 'case2_prefrail_60',
    name: 'Pre-frail 60yo — Aggressive Combo',
    x0: x0_2,
    optimalControl: opt2.controls,
    stateTrajectory: opt2.trajectory.map(t => t.state),
    totalCost: opt2.cost.total,
    lifespanGain: metrics2.lifespan - 20,
    healthspanGain: metrics2.healthspan - 15,
    feasible: { economic: opt2.cost.economic < 5000, biological: opt2.cost.biological < 100, entropic: true },
  });

  // Case 3: 30yo preventive, lifestyle only
  const x0_3: number[] = [30, 28, 0.95, 5, 0.95];
  const interventions3 = [
    CANONICAL_INTERVENTIONS.find(i => i.id === 'exercise')!,
    CANONICAL_INTERVENTIONS.find(i => i.id === 'caloric_restriction')!,
  ];
  const opt3 = computeOptimalControl(x0_3, interventions3, config);
  const metrics3 = computeLifespanMetrics(opt3.trajectory);
  results.push({
    id: 'case3_preventive_30',
    name: 'Preventive 30yo — Lifestyle Only',
    x0: x0_3,
    optimalControl: opt3.controls,
    stateTrajectory: opt3.trajectory.map(t => t.state),
    totalCost: opt3.cost.total,
    lifespanGain: metrics3.lifespan - 50,
    healthspanGain: metrics3.healthspan - 48,
    feasible: { economic: true, biological: true, entropic: true },
  });

  return results;
}

/**
 * Amphibious cost conversion: postmonetario units ↔ USD via priceParity
 */
export function convertCost(
  cost: ControlCost,
  priceParity: number,
  toZNU = true
): ControlCost {
  const factor = toZNU ? priceParity : 1 / priceParity;
  return {
    economic: cost.economic * factor,
    biological: cost.biological, // Biological cost is unit-agnostic
    entropic: cost.entropic, // Entropic cost is unit-agnostic
    total: cost.economic * factor + cost.biological + cost.entropic,
  };
}

/**
 * Generate OpenAPI-compatible spec for this module
 */
export function generateOpenAPISpec(): string {
  return `
openapi: 3.0.3
info:
  title: Aging Control Laws API
  version: 1.0.0
  description: Control-theoretic aging interventions (Zhavoronkov & Mishra 2025)
servers:
  - url: http://localhost:3000/api/aging-control
paths:
  /viability:
    get:
      summary: Check state viability
      parameters:
        - name: age
          in: query
          schema: {type: number}
        - name: bioAge
          in: query
          schema: {type: number}
        - name: healthCapital
          in: query
          schema: {type: number}
        - name: damageLoad
          in: query
          schema: {type: number}
        - name: interventionCapacity
          in: query
          schema: {type: number}
      responses:
        '200':
          description: Viability result
  /trajectory:
    post:
      summary: Simulate controlled trajectory
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                initialState: {type: array, items: {type: number}}
                controls: {type: array, items: {type: array, items: {type: number}}}
                horizon: {type: number}
      responses:
        '200':
          description: State trajectory
  /optimize:
    post:
      summary: Compute optimal control
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                initialState: {type: array, items: {type: number}}
                interventions: {type: array, items: {type: string}}
                config: {type: object}
      responses:
        '200':
          description: Optimal control + cost
  /case-studies:
    get:
      summary: Run canonical case studies
      responses:
        '200':
          description: 3 case study results
  /cost:
    post:
      summary: Compute control cost (amphibious)
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                trajectory: {type: array}
                mode: {type: string, enum: [postmonetario, conectado]}
                priceParity: {type: number}
      responses:
        '200':
          description: ControlCost object
`;
}