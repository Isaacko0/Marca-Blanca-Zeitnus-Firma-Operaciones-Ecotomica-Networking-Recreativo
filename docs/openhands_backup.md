# OpenHands — Backup Original

**Fuente**: https://github.com/OpenHands/OpenHands
**Versión**: v1.19.0
**Licencia**: MIT
**Stack**: TypeScript 95.1% + JavaScript 4.1% + Python 0.2%

## Descripción original
Agent Canvas: centro de control para agentes de desarrollo. Ejecuta OpenHands, Claude Code, Codex, Gemini o cualquier agente ACP-compatible. Self-hosted, automaciones, multi-backend.

## Estructura clave
- `electron/` — app desktop
- `src/` — frontend React/TS
- `docs/` — documentación
- `config/` — configuración

## Funcionalidades principales
1. Agent Canvas UI (control center)
2. Multi-backend (local, Docker, VM, Cloud)
3. Automations (scheduled, webhook-triggered)
4. Multi-agent (ACP-compatible: OpenHands, Claude Code, Codex, Gemini)
5. Self-hosting stack
6. Desktop app (Electron)
7. Skills system (public skills catalog)

## Componentes
- Agent Server backend (Python SDK separado)
- Frontend Agent Canvas (este repo)
- TypeScript client
- Extensions (skills, automations)
