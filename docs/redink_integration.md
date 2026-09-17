# RedInk — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un módulo de **Generación de Contenido Visual** para crear piezas de comunicación cultural (posters, carrusels, micro-contenido) usando descripciones y estilo consistente, anfibio (con/sin API).

## LLM (mapa de subsistemas)
| Subsistema RedInk | Módulo Zeitnus | Acción |
|---|---|---|
| Outline generator | `src/core/lib/visual.ts` | Nuevo: estructura visual multi-página |
| Cover generator | `src/core/lib/visual.ts` | Nuevo: cover con estilo consistente |
| Provider config | `src/core/lib/visual.ts` | Nuevo: multi-proveedor |
| Content copy API | `src/core/lib/visual.ts` | Nuevo: copy title/body/tags |
| Flask backend | extirpado | Zeitnus usa frontend Zustand |
| Vue frontend | extirpado | Zeitnus usa React |
| Docker | extirpado | Infra Docker |
| Gemini/APIs | extirpado | APIs externas |

## Principio anfibio
- **Conservado**: pipeline descripción → outline → generación → historial
- **Extirpado**: Flask, Vue, Docker, APIs externas, proveedores Xiaohongshu
- **Reinterpretado**: "Xiaohongshu post" → "Zeitnus Visual Piece"

## Isomorfismo HSCSG
- Piece visual = Proyecto Tekitl (entregable con timeline)
- Outline 5 páginas = estructura NEXO
- Cover + content = par coherente (marca HSCSG)
- Historial = audit trail (Ley III)
