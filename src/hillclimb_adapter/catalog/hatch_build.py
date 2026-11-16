# src/hillclimb_adapter/catalog/hatch_build.py
"""
Hatch build configuration for hillclimb_adapter catalog.
Packages problems and climbers into hillclimb wheel.
"""

import os
from pathlib import Path

# Catalog structure
CATALOG_DIR = Path(__file__).parent
PROBLEMS_DIR = CATALOG_DIR / "problems"
CLIMBERS_DIR = CATALOG_DIR / "climbers"

def collect_catalog():
    """Collect all problems and climbers for packaging."""
    problems = {}
    climbers = {}
    
    # Collect problems
    for problem_file in PROBLEMS_DIR.glob("*.py"):
        if problem_file.name.startswith("__"):
            continue
        problem_name = problem_file.stem
        problems[problem_name] = str(problem_file.relative_to(CATALOG_DIR))
    
    # Collect climbers
    for climber_file in CLIMBERS_DIR.glob("*.yaml"):
        climber_name = climber_file.stem
        climbers[climber_name] = str(climber_file.relative_to(CATALOG_DIR))
    
    for climber_file in CLIMBERS_DIR.glob("*.py"):
        if climber_file.name.startswith("__") or climber_file.name == "custom_automaton.py":
            continue
        climber_name = climber_file.stem
        climbers[climber_name] = str(climber_file.relative_to(CATALOG_DIR))
    
    return {"problems": problems, "climbers": climbers}


if __name__ == "__main__":
    catalog = collect_catalog()
    print("Catalog collected:")
    print(f"  Problems: {list(catalog['problems'].keys())}")
    print(f"  Climbers: {list(catalog['climbers'].keys())}")