# src/hillclimb_adapter/verifiers/__init__.py
"""
HSCSG Hillclimb Verifiers Package

Verifiers that call real HSCSG TypeScript modules to compute verifiable rewards.
Each verifier returns a score (0-1 or float) plus auxiliary metrics.
"""

from .base_verifier import BaseVerifier
from .fsi_verifier import FSIVerifier
from .xi_verifier import XVerifier
from .cac_verifier import CACVerifier
from .servitude_verifier import ServitudeVerifier
from .matrioska_verifier import MatrioskaVerifier
from .governance_verifier import GovernanceVerifier
from .proto_co_verifier import ProtoCOVerifier

__all__ = [
    'BaseVerifier',
    'FSIVerifier',
    'XVerifier', 
    'CACVerifier',
    'ServitudeVerifier',
    'MatrioskaVerifier',
    'GovernanceVerifier',
    'ProtoCOVerifier',
]