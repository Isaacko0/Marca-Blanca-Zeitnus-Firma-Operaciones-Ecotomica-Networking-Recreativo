# Remotion — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un módulo de **Video Composición** para crear videos explicativos, documentales del colectivo y contenido audiovisual programáticamente, con timeline basado en frames y playback interactivo.

## LLM (mapa de subsistemas)
| Subsistema Remotion | Módulo Zeitnus | Acción |
|---|---|---|
| Composition API | `src/core/state/video.ts` | Nuevo: estado de composiciones |
| Frame-based animation | `src/core/lib/video.ts` | Nuevo: timeline/clips logic |
| Player component | `src/app/screens/Video.tsx` | Nuevo: UI con playback controls |
| Lambda/Vercel rendering | extirpado | Infra serverless ajena |
| Mediabunny | extirpado | Procesamiento pesado |
| @remotion/three | extirpado | Three.js ajeno |
| Editor Starter | extirpado | Editor visual ajeno |

## Principio anfibio
- **Conservado**: composition state → timeline → clips → playback toggle
- **Extirpado**: Lambda, Mediabunny, Three.js, Editor, Vercel
- **Isomorfismo**: Video composition ≈ Tekitl project (entregable con timeline)

## Isomorfismo HSCSG
- Composition = Proyecto (creación colaborativa)
- Frames = ZNU time units (decay natural)
- Clips = ValueFlows (intercambios registrados)
- Playback = audit trail reproducible
