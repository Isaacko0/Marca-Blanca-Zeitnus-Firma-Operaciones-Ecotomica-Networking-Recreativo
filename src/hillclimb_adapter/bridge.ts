// src/hillclimb_adapter/bridge.ts
// TypeScript ↔ Python Bridge for Hillclimb Integration
// Uses child_process + JSON for zero-dependency communication

import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export interface HillclimbRequest {
  experiment: string;
  problem: string;
  climber: string;
  budget: { max_evaluations: number; timeout_hours?: number };
  config?: Record<string, any>;
  seed?: number;
}

export interface HillclimbResult {
  champion: {
    code: string;
    params: Record<string, any>;
    score: number;
    metrics: Record<string, number>;
  };
  run_id: string;
  evaluations: number;
  metadata: {
    start_time: number;
    end_time: number;
    climber: string;
    problem: string;
    seed?: number;
  };
}

export interface VerifierCall {
  module: string;
  function: string;
  args: any[];
}

export interface VerifierResult {
  success: boolean;
  data?: any;
  error?: string;
}

class Bridge extends EventEmitter {
  private pythonPath: string;
  private tsNodePath: string;

  constructor() {
    super();
    this.pythonPath = process.env.HILLCLIMB_PYTHON || 'python';
    this.tsNodePath = process.env.HILLCLIMB_TS_NODE || 'npx ts-node';
  }

  /**
   * Run a hillclimb experiment via Python SDK
   */
  async runExperiment(request: HillclimbRequest): Promise<HillclimbResult> {
    return new Promise((resolve, reject) => {
      const args = [
        '-m', 'hillclimb_adapter.sdk.run_experiment',
        '--experiment', request.experiment,
        '--problem', request.problem,
        '--climber', request.climber,
        '--budget', String(request.budget.max_evaluations),
        ...(request.budget.timeout_hours ? ['--timeout-hours', String(request.budget.timeout_hours)] : []),
        ...(request.seed ? ['--seed', String(request.seed)] : []),
        '--config', JSON.stringify(request.config || {})
      ];

      const proc = spawn(this.pythonPath, args, {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONPATH: `${process.cwd()}/src/hillclimb_adapter${process.platform === 'win32' ? ';' : ':'}${process.env.PYTHONPATH || ''}` }
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => { stdout += data.toString(); });
      proc.stderr?.on('data', (data) => { stderr += data.toString(); });

      proc.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Hillclimb experiment failed (exit ${code}): ${stderr}`));
        }
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (e) {
          reject(new Error(`Invalid JSON from hillclimb: ${stdout.substring(0, 500)}`));
        }
      });

      proc.on('error', (err) => reject(err));
    });
  }

  /**
   * Call a TypeScript module function from Python verifiers
   * Usage from Python: bridge.call_ts(module, function, args)
   */
  async callTypeScriptModule(modulePath: string, functionName: string, args: any[]): Promise<any> {
    // Resolve module path relative to project root
    const resolvedPath = modulePath.startsWith('.') ? modulePath : `./${modulePath}`;
    
    const code = `
      import { ${functionName} } from '${resolvedPath}';
      const args = ${JSON.stringify(args)};
      try {
        const result = await ${functionName}(...args);
        console.log(JSON.stringify({ success: true, data: result }));
      } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
      }
    `;

    return new Promise((resolve, reject) => {
      const proc = spawn('npx', ['ts-node', '-e', code], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_OPTIONS: '--experimental-specifier-resolution=node' }
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => { stdout += data.toString(); });
      proc.stderr?.on('data', (data) => { stderr += data.toString(); });

      proc.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`TS execution failed (${code}): ${stderr}`));
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (!result.success) {
            return reject(new Error(result.error || 'Unknown TS error'));
          }
          resolve(result.data);
        } catch (e) {
          reject(new Error(`Invalid JSON from TS: ${stdout.substring(0, 500)}`));
        }
      });

      proc.on('error', reject);
    });
  }

  /**
   * Run hillclimb CLI command directly
   */
  async runCLI(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
    return new Promise((resolve) => {
      const proc = spawn('hillclimb', args, {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (d) => stdout += d.toString());
      proc.stderr?.on('data', (d) => stderr += d.toString());

      proc.on('close', (code) => resolve({ stdout, stderr, code: code || 0 }));
      proc.on('error', (err) => resolve({ stdout, stderr, code: -1, error: err.message }));
    });
  }

  /**
   * Get hillclimb version
   */
  async getVersion(): Promise<string> {
    const { stdout } = await this.runCLI(['--version']);
    return stdout.trim();
  }

  /**
   * List available climbers/problems from catalog
   */
  async listCatalog(): Promise<{ climbers: string[]; problems: string[] }> {
    const { stdout } = await this.runCLI(['climber', 'list', '--catalog']);
    const climbers = stdout.trim().split('\n').filter(Boolean);
    
    const { stdout: stdout2 } = await this.runCLI(['problem', 'list', '--catalog']);
    const problems = stdout2.trim().split('\n').filter(Boolean);

    return { climbers, problems };
  }
}

// Singleton instance
export const hillclimbBridge = new Bridge();

// Convenience functions
export async function runHillclimbExperiment(request: HillclimbRequest): Promise<HillclimbResult> {
  return hillclimbBridge.runExperiment(request);
}

export async function callTypeScriptModule(modulePath: string, functionName: string, args: any[]): Promise<any> {
  return hillclimbBridge.callTypeScriptModule(modulePath, functionName, args);
}

export async function runHillclimbCLI(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return hillclimbBridge.runCLI(args);
}