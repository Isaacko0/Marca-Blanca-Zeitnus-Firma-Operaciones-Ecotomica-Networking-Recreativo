# README-INTEGRATION

## Qué es esto

Cinco archivos que convierten el repositorio en un sistema verificable:

- `constitution.yaml` — la constitución como dato
- `policy_engine.py` — el motor determinista que la hace ejecutable
- `test_policy_engine.py` — las verificaciones que la convierten en contrato
- `.hermes.md` — el contrato operativo de Hermes para la integración
- `INTEGRATION_MATRIX.md` — el registro de cada archivo que llega

## Puesta en marcha

```bash
pip install pyyaml pytest
python policy_engine.py hash       # genera constitution.sha256
python policy_engine.py verify     # debe imprimir OK
pytest test_policy_engine.py -v    # los 16 tests deben pasar
```

## Probar el motor manualmente

```bash
cat > /tmp/action.json <<'EOF'
{"type": "wallet.transfer", "to": "0xUNKNOWN", "amount": 10, "currency": "USDC"}
EOF
python policy_engine.py check /tmp/action.json
# → BLOCK por regla I-001
```

```bash
cat > /tmp/action2.json <<'EOF'
{"type": "module.mode_switch", "to_mode": "with_currency"}
EOF
python policy_engine.py check /tmp/action2.json
# → BLOCK por regla 0-001 (modo anfibio sin asamblea)
```

```bash
python policy_engine.py audit-verify
# → OK — N entradas verificadas
```

## Integración con Hermes

1. `cp .hermes.md ~/tu-repo/.hermes.md`
2. Instalar MCPs:
   ```bash
   hermes mcp install github
   hermes mcp install filesystem
   ```
3. Suscribir webhook para cada PR nuevo:
   ```bash
   hermes webhook subscribe github \
     --event pull_request.opened \
     --prompt "Sigue .hermes.md al pie de la letra: aplica las tres preguntas de integración, ejecuta policy_engine.py verify, actualiza INTEGRATION_MATRIX.md y publica el JSON de salida como comentario del PR."
   ```

## Regla de oro

Si `python policy_engine.py verify` falla, **no se integra nada**. Es la única
regla sin excepciones.
