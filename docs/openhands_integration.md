# OpenHands — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un panel de **Multi-Agente Canvas** donde el colectivo pueda lanzar y gestionar agentes autónomos, definir automations (flujos recurrentes), y mantener auditoría (Ley III) de todas las acciones de agentes.

## LLM (mapa de subsistemas)
| Subsistema OpenHands | Módulo Zeitnus | Acción |
|---|---|---|
| Agent Canvas UI | `src/app/screens/AgentCanvas.tsx` | Nuevo: panel multi-agente |
| Automation engine | `src/core/lib/automaton.ts` | Extender: automatizaciones |
| Multi-backend | extirpado | Infra Docker/VM |
| Skills catalog | `src/core/lib/skills.ts` | Nuevo: skills HSCSG |
| ACP protocol | extirpado | Protocolo ajeno |
| Electron desktop | extirpado | Desktop ajeno |
| TypeScript client | extirpado | Cliente HTTP |

## Principio anfibio
- **Conservado**: panel de agentes → automations → audit trail (Ley III)
- **Extirpado**: Electron, Docker, ACP, multi-backend
- **Isomorfismo**: Agent Canvas = extensión de `Agentes.tsx` + `Automata.tsx`

## Isomorfismo HSCSG
- Agent = SoulState (deriva/anclada)
- Automation = HeartbeatTask (cron/scheduled)
- Skill = VIA (protocolo Kernel)
- Audit = logBotAudit (inmutable, Ley III)
