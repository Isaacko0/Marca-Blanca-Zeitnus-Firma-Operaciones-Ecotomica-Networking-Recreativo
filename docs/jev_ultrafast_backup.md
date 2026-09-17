# Jev Ultrafast — Backup Original

**Fuente**: https://github.com/browser-use/jev-ultrafast
**Licencia**: MIT
**Stack**: Python + TypeSafe API + Browser Harness (CDP)

## Descripción original
Browser agent ultrafast con espacio de acciones dinámico e indexado. Un goal en lenguaje natural → TypeSafe elige operación + target en una sola request → small LLM escribe texto solo para TYPE_TEXT.

## Componentes clave
- `jev_ultrafast/agent.py` — Loop completo del agente (predict → act → observe)
- `jev_ultrafast/model.py` — TypeSafe integration: action_space, choose, field_context, field_text
- `jev_ultrafast/browser.py` — Conexión CDP via Browser Harness, observe/act/fresh
- `jev_ultrafast/questions.py` — Instrucciones para policy dinámica (NEXT_ACTION, TARGET, TEXT_VALUE)
- `jev_ultrafast/snapshot.js` — DOM reader para elementos indexados
- `jev_ultrafast/demo.py` — Inspector local (puerto 8766)

## Action Space
Operaciones: CLICK, TYPE_TEXT, SELECT, SCROLL_UP, SCROLL_DOWN, WAIT, DONE, BLOCKED
Cada observación produce tabla indexada de elementos con operaciones soportadas por elemento.

## Flujo
page → element table → operation + target (TypeSafe) → execute → observe → repeat
- 1 TypeSafe request por paso (operation + target head específico)
- TYPE_TEXT invoca small LLM (DeepSeek/OpenAI-compatible) para valor del campo
- No site-specific scripts, no hardcoded field values

## Performance
- Zürich→London Google Flights: 7.1s (median 7.092s vs 9.450s anterior = 25% faster)
- Browser protocol calls: 101 vs 1,092 (90% reduction)
- Wikipedia article open: 2.798s
- Hotel search/filter: 1.896s

## Limits
- DONE requiere verificación independiente
- No shadow roots, frames, canvas, uploads, pop-up tabs, nested scrolling, arbitrary keyboard widgets
- Tests offline (no paid APIs)
