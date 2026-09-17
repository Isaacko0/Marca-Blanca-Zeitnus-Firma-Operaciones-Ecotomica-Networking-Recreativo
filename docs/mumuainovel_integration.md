# MuMuAINovel — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un módulo de **Creación Narrativa** que permita a colectivos generar historias, mitos fundacionales y contenido cultural de forma asistida, anfibia (con/sin API externa), respetando la Ley III (lucidez sobre qué es generado vs humano).

## LLM (mapa de subsistemas)
| Subsistema MuMu | Módulo Zeitnus | Acción |
|---|---|---|
| Projects API | `src/core/lib/story.ts` | Nuevo: gestión de proyectos narrativos |
| Chapters generator | `src/core/lib/story.ts` | Nuevo: generación de capítulos |
| Outlines | `src/core/lib/story.ts` | Nuevo: estructura de 5 actos |
| Embeddings/ChromaDB | extirpado | Vector DB pesado → reemplazado por búsqueda string en localStorage |
| Termux installer | extirpado | Infra Android externa |
| Frontend React | `src/app/screens/Story.tsx` | Nuevo: UI narrativa |
| docker-compose | extirpado | Infra Docker |

## Principio anfibio
- **Conservado**: capture de ideas → outline → capítulo → revisión humana (Ley III gate)
- **Extirpado**: ChromaDB, Docker, APIs externas, Termux
- **Reinterpretado**: "novela" → "story" → Zeitnus Story Engine

## Isomorfismo HSCSG
- Proyecto narrativo = Proyecto Tekitl (mismo ciclo de vida)
- Outline 5 actos = estructura NEXO (5 capas)
- Gate humano revisión = Ley III MJ (lucidez)
