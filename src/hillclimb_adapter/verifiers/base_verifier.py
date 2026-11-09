# src/hillclimb_adapter/verifiers/base_verifier.py
"""
Base Verifier Class for HSCSG Hillclimb Integration

All verifiers call real HSCSG TypeScript modules via the bridge.
Returns verifiable scores (not proxies) with auxiliary metrics.
"""

import asyncio
import json
import subprocess
import sys
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass


@dataclass
class VerificationResult:
    """Result of a verification."""
    score: float                    # Main reward score (0-1 or float)
    metrics: Dict[str, float]       # Auxiliary metrics for analysis
    passed: bool = True             # Whether hard constraints passed
    details: Optional[Dict] = None  # Additional details
    error: Optional[str] = None     # Error message if failed


class BaseVerifier(ABC):
    """Abstract base class for HSCSG verifiers."""
    
    def __init__(self, ts_bridge_path: str = "src/hillclimb_adapter/bridge.ts"):
        self.ts_bridge_path = ts_bridge_path
        self._node_cmd = ['npx', 'ts-node', '--esm']
    
    async def call_ts(self, module: str, function: str, args: List[Any]) -> Any:
        """Call TypeScript module function via ts-node bridge."""
        # Escape module path for TypeScript import
        module_path = module.replace('\\', '/')
        if not module_path.startswith('.'):
            module_path = f'./{module_path}'
        
        # Build the TypeScript code to execute
        ts_code = f'''
import {{ {self._escape_import(function)} }} from '{module.replace('\\', '/')}';
const args = {json.dumps(args)};
try {{
    const result = await {self._escape_import(function)}(...args);
    console.log(JSON.stringify({{ success: true, data: result }}));
}} catch (e) {{
    console.log(JSON.stringify({{ success: false, error: e.message }}));
}}
'''
        cmd = [sys.executable, '-c', f'''
import subprocess, json, sys
proc = subprocess.run(
    ["npx", "ts-node", "--esm", "-e", {json.dumps(ts_code)}],
    cwd="{self._get_cwd()}",
    capture_output=True, text=True, timeout=120
)
if proc.returncode != 0:
    print(json.dumps({{success: False, error: proc.stderr}}))
else:
    print(proc.stdout.strip())
'''
        ]
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise RuntimeError(f"TS call failed: {stderr.decode()}")
        
        output = stdout.decode().strip()
        if not output:
            raise RuntimeError("Empty output from TS bridge")
        
        try:
            result = json.loads(output)
            if not result.get('success', False):
                raise RuntimeError(result.get('error', 'Unknown TS error'))
            return result.get('data')
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Invalid JSON from TS: {stdout[:500]}")
    
    def _escape_import(self, name: str) -> str:
        """Escape function name for TS import."""
        return name
    
    def _get_cwd(self) -> str:
        """Get working directory for subprocess."""
        import os
        return os.getcwd()
    
    @abstractmethod
    async def verify(self, candidate: Dict[str, Any]) -> VerificationResult:
        """Verify a candidate and return score + metrics."""
        pass
    
    def _make_result(self, score: float, metrics: Dict[str, float], 
                     passed: bool = True, details: Dict = None, error: str = None) -> VerificationResult:
        """Create a VerificationResult."""
        return VerificationResult(
            score=max(0.0, min(1.0, score)) if score <= 1.0 else score,
            metrics=metrics,
            passed=passed,
            details=details,
            error=error
        )
    
    def _hard_constraint_failed(self, metric_name: str, value: float, threshold: float) -> VerificationResult:
        """Create result for hard constraint failure."""
        return VerificationResult(
            score=0.0,
            metrics={metric_name: value, f'{metric_name}_threshold': threshold},
            passed=False,
            details={f'{metric_name}_violation': f'{value} < {threshold}'}
        )


# For environments without hillclimb installed, provide a minimal Candidate
class Candidate:
    """Minimal candidate representation."""
    def __init__(self, params: Dict[str, Any], metadata: Dict = None):
        self.params = params
        self.metadata = metadata or {}