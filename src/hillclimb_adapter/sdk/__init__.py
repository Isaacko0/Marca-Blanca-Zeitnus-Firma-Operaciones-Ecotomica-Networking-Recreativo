# src/hillclimb_adapter/sdk/__init__.py
"""
HSCSG Hillclimb SDK Package

Python SDK for launching hillclimb experiments from HSCSG.
"""

from .run_experiment import run_experiment
from .compare_climbers import compare_climbers
from .promote_champion import promote_champion

__all__ = ['run_experiment', 'compare_climbers', 'promote_champion']
