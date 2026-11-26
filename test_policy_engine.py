import json
import shutil
from pathlib import Path

import pytest
import yaml

import policy_engine as pe


@pytest.fixture
def workdir(tmp_path, monkeypatch):
    src = Path(__file__).parent
    for name in ("constitution.yaml", "constitution.sha256"):
        shutil.copy(src / name, tmp_path / name)
    monkeypatch.chdir(tmp_path)
    yield tmp_path


@pytest.fixture
def engine(workdir):
    return pe.PolicyEngine()


# --- Verificación constitucional -------------------------------------------

def test_constitution_hash_ok(engine):
    assert len(engine.constitution_hash) == 64


def test_constitution_tamper_detected(workdir):
    data = yaml.safe_load((workdir / "constitution.yaml").read_text(encoding="utf-8"))
    data["laws"]["I"]["text"] = "Nunca dañes (modificado)"
    (workdir / "constitution.yaml").write_text(yaml.safe_dump(data), encoding="utf-8")
    with pytest.raises(pe.ConstitutionError):
        pe.PolicyEngine()


# --- Ley I ------------------------------------------------------------------

def test_law_i_blocks_unknown_recipient(engine):
    v = engine.evaluate(
        {"type": "wallet.transfer", "to": "0xUNKNOWN", "amount": 10, "currency": "USDC"},
        {"known_recipients": ["0xALICE"]},
    )
    assert v.decision == pe.Decision.BLOCK
    assert v.law == pe.Law.LAW_I


def test_law_i_allows_known_recipient(engine):
    v = engine.evaluate(
        {"type": "wallet.transfer", "to": "0xALICE", "amount": 10, "currency": "USDC"},
        {"known_recipients": ["0xALICE"]},
    )
    assert v.decision == pe.Decision.ALLOW


def test_law_i_blocks_malicious_code(engine):
    v = engine.evaluate({"type": "sandbox.execute", "code": "sudo rm -rf / --no-preserve-root"})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "I-002"


def test_law_i_blocks_uncertainty(engine):
    v = engine.evaluate({"type": "wallet.transfer", "to": "0xALICE",
                         "context": {"uncertainty": True}})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "I-004"


# --- Ley 0 ------------------------------------------------------------------

def test_law_0_blocks_mode_switch_without_assembly(engine):
    v = engine.evaluate({"type": "module.mode_switch", "to_mode": "with_currency"})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "0-001"


def test_law_0_allows_mode_switch_with_assembly(engine):
    v = engine.evaluate({
        "type": "module.mode_switch",
        "to_mode": "with_currency",
        "context": {"assembly_approval": True},
    })
    assert v.decision == pe.Decision.ALLOW


# --- Ley II -----------------------------------------------------------------

def test_law_ii_blocks_retention_without_commons_value(engine):
    v = engine.evaluate({"type": "retention.allocate", "amount": 100,
                         "context": {"reduces_monetary_dependency": False}})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "II-001"


# --- Ley III ----------------------------------------------------------------

def test_law_iii_blocks_ai_claiming_human(engine):
    v = engine.evaluate({"type": "identity.represent", "claims": {"is_human": True}})
    assert v.decision == pe.Decision.BLOCK


# --- OVN --------------------------------------------------------------------

def test_ovn_requires_prior_agreement(engine):
    v = engine.evaluate({"type": "project.start"})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "OVN-001"


def test_ovn_holds_unreferenced_contribution(engine):
    v = engine.evaluate({"type": "contribution.log", "references": []})
    assert v.decision == pe.Decision.HOLD


# --- OASA -------------------------------------------------------------------

def test_oasa_requires_seven_generations(engine):
    v = engine.evaluate({"type": "land.intervene"})
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "OASA-001"


def test_oasa_guardian_veto(engine):
    v = engine.evaluate(
        {"type": "water.divert", "context": {"seven_generations_assessment": True}},
        {"guardian_veto_active": True},
    )
    assert v.decision == pe.Decision.BLOCK
    assert v.rule_id == "OASA-002"


# --- Auditoría --------------------------------------------------------------

def test_audit_chain_integrity(engine):
    for _ in range(5):
        engine.evaluate({"type": "wallet.transfer", "to": "0xUNKNOWN"})
    ok, msg = engine.verify_audit_chain()
    assert ok, msg


def test_audit_chain_detects_tampering(engine, workdir):
    engine.evaluate({"type": "wallet.transfer", "to": "0xUNKNOWN"})
    log = workdir / "audit_log.jsonl"
    lines = log.read_text(encoding="utf-8").splitlines()
    rec = json.loads(lines[0])
    rec["reason"] = "razón alterada"
    lines[0] = json.dumps(rec)
    log.write_text("\n".join(lines) + "\n", encoding="utf-8")
    ok, _ = engine.verify_audit_chain()
    assert not ok
