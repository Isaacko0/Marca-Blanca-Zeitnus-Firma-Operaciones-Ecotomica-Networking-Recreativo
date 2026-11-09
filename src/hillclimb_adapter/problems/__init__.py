# src/hillclimb_adapter/problems/__init__.py
"""
HSCSG Hillclimb Problems Package

Problems define optimization objectives with verifiable rewards.
Each problem maps to a critical HSCSG metric.
"""

from .fsi_optimization import FSIOptimizationProblem
from .xi_auditor_tuning import XIAuditorTuningProblem
from .cac_optimization import CACOptimizationProblem
from .automaton_e2r_params import AutomatonE2RParamsProblem
from .fabshep_module_design import FABSHIPModuleDesignProblem
from .governance_policy_search import GovernancePolicySearchProblem
from .kit72h_optimization import Kit72HOptimizationProblem
from .proto_co_validation import ProtoCOValidationProblem

__all__ = [
    'FSIOptimizationProblem',
    'XIAuditorTuningProblem',
    'CACOptimizationProblem',
    'AutomatonE2RParamsProblem',
    'FABSHIPModuleDesignProblem',
    'GovernancePolicySearchProblem',
    'Kit72HOptimizationProblem',
    'ProtoCOValidationProblem',
]
