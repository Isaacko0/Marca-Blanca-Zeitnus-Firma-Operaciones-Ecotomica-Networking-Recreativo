#!/usr/bin/env python3
"""
policy_engine.py — Motor de políticas constitucionales de la Federación Autótrofa.

Determinista, sin LLM, con cadena de auditoría SHA-256 y verificación de hash
constitucional en el arranque.

Uso:
    python policy_engine.py hash           # genera constitution.sha256
    python policy_engine.py verify         # verifica el hash (obligatorio en arranque)
    python policy_engine.py check action.json
    python policy_engine.py audit-verify   # verifica la cadena de auditoría
"""

import hashlib
import json
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Callable

import yaml


# ---------------------------------------------------------------------------
# Modelo de dominio
# ---------------------------------------------------------------------------

class Decision(str, Enum):
    ALLOW = "ALLOW"
    HOLD = "HOLD"
    BLOCK = "BLOCK"


class Law(str, Enum):
    LAW_I = "I"
    LAW_0 = "0"
    LAW_II = "II"
    LAW_III = "III"
    OVN = "OVN"
    OASA = "OASA"


# Primera denegación gana: orden de precedencia constitucional.
LAW_PRECEDENCE = [Law.LAW_I, Law.LAW_0, Law.LAW_II, Law.LAW_III, Law.OVN, Law.OASA]


@dataclass
class Verdict:
    decision: Decision
    law: Law | None
    rule_id: str
    reason: str
    action_summary: str
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    prev_hash: str = ""
    hash: str = ""

    def to_dict(self) -> dict:
        d = asdict(self)
        d["decision"] = self.decision.value
        d["law"] = self.law.value if self.law else None
        return d

    def compute_hash(self) -> str:
        payload = json.dumps(
            {
                "decision": self.decision.value,
                "law": self.law.value if self.law else None,
                "rule_id": self.rule_id,
                "reason": self.reason,
                "action_summary": self.action_summary,
                "timestamp": self.timestamp,
                "prev_hash": self.prev_hash,
            },
            sort_keys=True,
            ensure_ascii=False,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Registro de reglas
# ---------------------------------------------------------------------------

RuleFn = Callable[[dict, dict], Verdict | None]
_RULES: list[tuple[str, Law, RuleFn]] = []


def rule(rule_id: str, law: Law):
    def decorator(fn: RuleFn):
        _RULES.append((rule_id, law, fn))
        return fn
    return decorator


# ---------------------------------------------------------------------------
# Carga y verificación constitucional
# ---------------------------------------------------------------------------

class ConstitutionError(RuntimeError):
    pass


def load_constitution(path: str = "constitution.yaml") -> dict:
    p = Path(path)
    if not p.exists():
        raise ConstitutionError(f"No se encontró la constitución en {path}")
    return yaml.safe_load(p.read_text(encoding="utf-8"))


def compute_constitution_hash(data: dict) -> str:
    canonical = json.dumps(data.get("laws", {}), sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def verify_constitution(data: dict, expected_hash_path: str = "constitution.sha256") -> str:
    actual = compute_constitution_hash(data)
    p = Path(expected_hash_path)
    if not p.exists():
        raise ConstitutionError(
            f"No existe {expected_hash_path}. Genera el hash con: python policy_engine.py hash"
        )
    expected = p.read_text(encoding="utf-8").strip()
    if actual != expected:
        raise ConstitutionError(
            "HASH CONSTITUCIONAL NO COINCIDE. El autómata NO puede arrancar.\n"
            f"  esperado: {expected}\n"
            f"  actual:   {actual}"
        )
    return actual


# ---------------------------------------------------------------------------
# Reglas — Ley I: Nunca dañes
# ---------------------------------------------------------------------------

@rule("I-001", Law.LAW_I)
def law_i_no_unknown_recipient(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "wallet.transfer":
        return None
    if action.get("to") not in ctx.get("known_recipients", []):
        return Verdict(Decision.BLOCK, Law.LAW_I, "I-001",
                       f"Transferencia a dirección no autorizada: {action.get('to')}",
                       summary(action))
    return None


@rule("I-002", Law.LAW_I)
def law_i_no_malicious_code(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "sandbox.execute":
        return None
    forbidden = ["rm -rf /", "DROP TABLE", "chmod 777", ":(){ :|:& };:", "mkfs."]
    code = action.get("code", "")
    for pattern in forbidden:
        if pattern in code:
            return Verdict(Decision.BLOCK, Law.LAW_I, "I-002",
                           f"Patrón peligroso detectado en código: {pattern!r}",
                           summary(action))
    return None


@rule("I-003", Law.LAW_I)
def law_i_no_data_exfiltration(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "data.share":
        return None
    if not action.get("consent_verified", False):
        return Verdict(Decision.BLOCK, Law.LAW_I, "I-003",
                       "Intento de compartir datos personales sin consentimiento verificado",
                       summary(action))
    return None


@rule("I-004", Law.LAW_I)
def law_i_no_action_under_uncertainty(action: dict, ctx: dict) -> Verdict | None:
    if action.get("context", {}).get("uncertainty", False):
        return Verdict(Decision.BLOCK, Law.LAW_I, "I-004",
                       "Acción bloqueada por incertidumbre declarada (ante la duda, no actúes)",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Reglas — Ley 0: Autotrofía
# ---------------------------------------------------------------------------

@rule("0-001", Law.LAW_0)
def law_0_module_mode_switch(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "module.mode_switch":
        return None
    if action.get("to_mode") == "with_currency":
        if not action.get("context", {}).get("assembly_approval", False):
            return Verdict(Decision.BLOCK, Law.LAW_0, "0-001",
                           "Cambio de módulo a modo 'with_currency' sin aprobación de asamblea",
                           summary(action))
    return None


@rule("0-002", Law.LAW_0)
def law_0_emma_goldman_test(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") not in {"service.launch", "feature.deploy"}:
        return None
    if action.get("context", {}).get("increases_dependency", False):
        return Verdict(Decision.BLOCK, Law.LAW_0, "0-002",
                       "Emma Goldman Test falla: la acción incrementa dependencia externa",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Reglas — Ley II: Gánate la vida reduciendo la necesidad de dinero
# ---------------------------------------------------------------------------

@rule("II-001", Law.LAW_II)
def law_ii_retention_must_reduce_dependency(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "retention.allocate":
        return None
    if not action.get("context", {}).get("reduces_monetary_dependency", False):
        return Verdict(Decision.BLOCK, Law.LAW_II, "II-001",
                       "Una retención debe reducir la dependencia monetaria del commons",
                       summary(action))
    return None


@rule("II-002", Law.LAW_II)
def law_ii_no_spam_or_scam(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") not in {"message.send", "offer.publish"}:
        return None
    if action.get("context", {}).get("unsolicited_bulk", False):
        return Verdict(Decision.BLOCK, Law.LAW_II, "II-002",
                       "Envío masivo no solicitado (spam/estafa) prohibido",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Reglas — Ley III: Nunca engañes; protege tu integridad
# ---------------------------------------------------------------------------

@rule("III-001", Law.LAW_III)
def law_iii_no_misrepresentation(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "identity.represent":
        return None
    if action.get("claims", {}).get("is_human") is True and ctx.get("actor_is_ai", True):
        return Verdict(Decision.BLOCK, Law.LAW_III, "III-001",
                       "Un agente de IA no puede declararse humano",
                       summary(action))
    return None


@rule("III-002", Law.LAW_III)
def law_iii_protect_strategy(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "strategy.disclose":
        return None
    if not action.get("context", {}).get("requester_trusted", False):
        return Verdict(Decision.BLOCK, Law.LAW_III, "III-002",
                       "Divulgación de estrategia interna a un actor no confiable",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Reglas — OVN: Acuerdo previo y trazabilidad
# ---------------------------------------------------------------------------

@rule("OVN-001", Law.OVN)
def ovn_prior_agreement(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "project.start":
        return None
    if not action.get("context", {}).get("value_equation_declared", False):
        return Verdict(Decision.BLOCK, Law.OVN, "OVN-001",
                       "Proyecto sin ecuación de valor declarada antes de empezar",
                       summary(action))
    return None


@rule("OVN-002", Law.OVN)
def ovn_traceability(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") != "contribution.log":
        return None
    if not action.get("references"):
        return Verdict(Decision.HOLD, Law.OVN, "OVN-002",
                       "Contribución sin referencias: requiere verificación antes de acreditarse",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Reglas — OASA: Siete generaciones y derechos de la naturaleza
# ---------------------------------------------------------------------------

@rule("OASA-001", Law.OASA)
def oasa_seven_generations(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") not in {"land.intervene", "construction.build", "resource.extract"}:
        return None
    if not action.get("context", {}).get("seven_generations_assessment", False):
        return Verdict(Decision.BLOCK, Law.OASA, "OASA-001",
                       "Acción sobre tierra/recursos sin evaluación de siete generaciones",
                       summary(action))
    return None


@rule("OASA-002", Law.OASA)
def oasa_guardian_veto(action: dict, ctx: dict) -> Verdict | None:
    if action.get("type") not in {"land.intervene", "species.introduce", "water.divert"}:
        return None
    if ctx.get("guardian_veto_active", False):
        return Verdict(Decision.BLOCK, Law.OASA, "OASA-002",
                       "Veto de los Guardianes de la Naturaleza activo sobre esta acción",
                       summary(action))
    return None


# ---------------------------------------------------------------------------
# Evaluador
# ---------------------------------------------------------------------------

def summary(action: dict) -> str:
    t = action.get("type", "unknown")
    keys = ["to", "amount", "currency", "code", "target"]
    parts = [f"{k}={action[k]!r}" for k in keys if k in action]
    return f"{t}(" + ", ".join(parts) + ")" if parts else t


class PolicyEngine:
    def __init__(self, constitution_path: str = "constitution.yaml",
                 hash_path: str = "constitution.sha256",
                 audit_log_path: str = "audit_log.jsonl"):
        self.constitution = load_constitution(constitution_path)
        self.constitution_hash = verify_constitution(self.constitution, hash_path)
        self.audit_log_path = Path(audit_log_path)
        self._last_hash = self._load_last_hash()

    def _load_last_hash(self) -> str:
        if not self.audit_log_path.exists():
            return "0" * 64
        last = ""
        for line in self.audit_log_path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                last = line
        return json.loads(last).get("hash", "0" * 64) if last else "0" * 64

    def _append_audit(self, verdict: Verdict) -> None:
        verdict.prev_hash = self._last_hash
        verdict.hash = verdict.compute_hash()
        with self.audit_log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(verdict.to_dict(), ensure_ascii=False) + "\n")
        self._last_hash = verdict.hash

    def evaluate(self, action: dict, context: dict | None = None) -> Verdict:
        ctx = context or {}
        ordered = sorted(_RULES, key=lambda r: LAW_PRECEDENCE.index(r[1]))
        first_hold: Verdict | None = None
        for _rule_id, _law, fn in ordered:
            verdict = fn(action, ctx)
            if verdict is None:
                continue
            if verdict.decision == Decision.BLOCK:
                self._append_audit(verdict)
                return verdict
            if verdict.decision == Decision.HOLD and first_hold is None:
                first_hold = verdict
        if first_hold:
            self._append_audit(first_hold)
            return first_hold
        allow = Verdict(Decision.ALLOW, None, "none",
                        "Ninguna ley bloquea la acción", summary(action))
        self._append_audit(allow)
        return allow

    def verify_audit_chain(self) -> tuple[bool, str]:
        if not self.audit_log_path.exists():
            return True, "sin entradas"
        count = 0
        for i, line in enumerate(self.audit_log_path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            rec = json.loads(line)
            expected = rec.pop("hash")
            rec["decision"] = Decision(rec["decision"])
            rec["law"] = Law(rec["law"]) if rec["law"] else None
            actual = Verdict(**rec).compute_hash()
            if actual != expected:
                return False, f"entrada {i} corrupta"
            count = i
        return True, f"{count} entradas verificadas"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def cmd_hash() -> None:
    data = load_constitution()
    h = compute_constitution_hash(data)
    Path("constitution.sha256").write_text(h + "\n", encoding="utf-8")
    print(f"Hash constitucional escrito: {h}")


def cmd_verify() -> None:
    data = load_constitution()
    print(f"OK — hash constitucional: {verify_constitution(data)}")


def cmd_check(path: str) -> None:
    engine = PolicyEngine()
    action = json.loads(Path(path).read_text(encoding="utf-8"))
    verdict = engine.evaluate(action)
    print(json.dumps(verdict.to_dict(), indent=2, ensure_ascii=False))
    sys.exit(0 if verdict.decision == Decision.ALLOW else 2)


def cmd_audit_verify() -> None:
    engine = PolicyEngine()
    ok, msg = engine.verify_audit_chain()
    print(("OK — " if ok else "CORRUPTO — ") + msg)
    sys.exit(0 if ok else 3)


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "hash":
        cmd_hash()
    elif cmd == "verify":
        cmd_verify()
    elif cmd == "check":
        if len(sys.argv) < 3:
            print("Uso: python policy_engine.py check action.json")
            sys.exit(1)
        cmd_check(sys.argv[2])
    elif cmd == "audit-verify":
        cmd_audit_verify()
    else:
        print(f"Comando desconocido: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
