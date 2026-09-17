# Jev Ultrafast — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un **Browser Agent Nativo** para ejecutar tareas web automatizadas (scraping, form filling, navigation) sin depender de APIs externas, con auditoría completa (Ley III) y operación anfibia (online/offline con cache).

## LLM (mapa de subsistemas)
| Subsistema Jev | Módulo Zeitnus | Acción |
|---|---|---|
| Agent loop | `src/core/lib/browserAgent.ts` | Nuevo: loop predict→act→observe |
| TypeSafe choose | `src/core/lib/browserAgent.ts` | Adaptado: local policy + remote TypeSafe opcional |
| Browser Harness/CDP | extirpado | Infra pesada → simulado con fetch + DOM parser |
| field_text (small LLM) | `src/core/lib/browserAgent.ts` | Local: template-based text generation |
| Demo inspector | `src/app/screens/BrowserAgent.tsx` | Nuevo: UI para goals + history |
| snapshot.js (DOM reader) | extirpado | Browser-only → server-side simulation |

## Principio anfibio
- **Conservado**: goal → indexed actions → operation+target → execute → history (audit trail)
- **Extirpado**: Browser Harness, CDP, Chrome daemon, TypeSafe API obligatoria, DeepSeek API
- **Reinterpretado**: "browser agent" → "web task executor" con modo offline (cached selectors) y online (fetch real)

## Isomorfismo HSCSG
- Agent loop = LoopEngine tick (resonancia)
- Action space = CAC vectors (operaciones disponibles por estado)
- History = Audit trail (Ley III: lucidez, registro inmutable)
- DONE/BLOCKED = Verificación triaxial (éxito/bloqueo/evidencia)
- TypeSafe speculative fan-out = γ-CARMIS (múltiples cabezas de decisión)
