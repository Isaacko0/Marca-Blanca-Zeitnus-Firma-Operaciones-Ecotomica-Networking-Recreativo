# src/hillclimb_adapter/sdk/run_experiment.py
"""
Run Hillclimb Experiment from HSCSG

CLI entry point: python -m hillclimb_adapter.sdk.run_experiment --experiment <name> --problem <name> --climber <name>
"""

import asyncio
import argparse
import json
import sys
from typing import Dict, Any
from ..bridge import hillclimbBridge


async def run_experiment(
    experiment: str,
    problem: str,
    climber: str,
    budget: int,
    timeout_hours: int = 4,
    config: Dict = None,
    seed: int = None
) -> Dict[str, Any]:
    """Run a hillclimb experiment and return champion result."""
    
    request = {
        "experiment": experiment,
        "problem": problem,
        "climber": climber,
        "budget": {"max_evaluations": budget, "timeout_hours": timeout_hours},
        "config": config or {},
        "seed": seed
    }
    
    print(f"Starting hillclimb experiment: {experiment}")
    print(f"  Problem: {problem}")
    print(f"  Climber: {climber}")
    print(f"  Budget: {budget} evaluations")
    print(f"  Timeout: {timeout_hours} hours")
    
    result = await hillclimbBridge.runExperiment(request)
    
    print(f"\nExperiment completed!")
    print(f"  Run ID: {result['metadata']['run_id']}")
    print(f"  Evaluations: {result['evaluations']}")
    print(f"  Champion Score: {result['champion']['score']:.4f}")
    print(f"  Champion Metrics: {result['champion']['metrics']}")
    
    return result


def main():
    parser = argparse.ArgumentParser(description="Run HSCSG Hillclimb Experiment")
    parser.add_argument("--experiment", required=True, help="Experiment name (e.g., hscsg_fsi_optimization)")
    parser.add_argument("--problem", required=True, help="Problem name (e.g., hscsg_fsi_optimization)")
    parser.add_argument("--climber", required=True, help="Climber name (greedy, gepa, openevolve, automaton_e2r)")
    parser.add_argument("--budget", type=int, required=True, help="Max evaluations")
    parser.add_argument("--timeout-hours", type=int, default=4, help="Timeout in hours")
    parser.add_argument("--config", type=str, help="JSON config string")
    parser.add_argument("--seed", type=int, help="Random seed")
    parser.add_argument("--output", type=str, help="Output JSON file path")
    
    args = parser.parse_args()
    
    config = json.loads(args.config) if args.config else None
    
    try:
        result = asyncio.run(run_experiment(
            experiment=args.experiment,
            problem=args.problem,
            climber=args.climber,
            budget=args.budget,
            timeout_hours=args.timeout_hours,
            config=config,
            seed=args.seed
        ))
        
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\nResult saved to {args.output}")
        else:
            print(json.dumps(result, indent=2))
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()