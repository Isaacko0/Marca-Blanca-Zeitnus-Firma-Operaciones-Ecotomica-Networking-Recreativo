# src/hillclimb_adapter/sdk/compare_climbers.py
"""
Compare Hillclimb Climbers on HSCSG Problems

CLI: python -m hillclimb_adapter.sdk.compare_climbers --run-id <run_id>
"""

import asyncio
import argparse
import json
import sys
from ..bridge import hillclimbBridge


async def compare_climbers(run_id: str) -> Dict[str, Any]:
    """Get experiment report comparing climbers."""
    
    result = await hillclimbBridge.runCLI(["experiment", "report", run_id])
    
    if result["code"] != 0:
        raise RuntimeError(f"Comparison failed: {result['stderr']}")
    
    report = json.loads(result["stdout"])
    return report


def main():
    parser = argparse.ArgumentParser(description="Compare Hillclimb Climbers")
    parser.add_argument("--run-id", required=True, help="Experiment run ID")
    parser.add_argument("--output", type=str, help="Output JSON file")
    
    args = parser.parse_args()
    
    try:
        report = asyncio.run(compare_climbers(args.run_id))
        
        print(f"Experiment Report: {args.run_id}")
        print(f"  Problem: {report.get('problem', 'N/A')}")
        print(f"  Climbers tested: {report.get('climbers', [])}")
        print(f"  Best climber: {report.get('best_climber', 'N/A')}")
        print(f"  Best score: {report.get('best_score', 0):.4f}")
        
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"\nReport saved to {args.output}")
        else:
            print(json.dumps(report, indent=2))
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()