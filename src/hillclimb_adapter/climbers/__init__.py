# src/hillclimb_adapter/climbers/__init__.py
"""
HSCSG Hillclimb Climbers Package

Climber configurations and custom climbers for HSCSG.
"""

from .custom_automaton import AutomatonE2RClimber

__all__ = ['AutomatonE2RClimber']
