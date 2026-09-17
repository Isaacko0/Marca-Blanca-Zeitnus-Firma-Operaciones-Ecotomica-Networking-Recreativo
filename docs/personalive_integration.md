# PersonaLive — Integración Zeitnus

## Usuario (Zeitnus/HSCSG v15)
El nodo necesita un módulo de **Animación de Retratos** para crear avatares animados de los miembros del colectivo, preservando identidad (Ley III: deepfake ban = solo uso consentido propio) y funcionando offline-first.

## LLM (mapa de subsistemas)
| Subsistema PersonaLive | Módulo Zeitnus | Acción |
|---|---|---|
| Motion encoder | `src/core/lib/avatar.ts` | Nuevo: codificación de expresiones |
| Animation state | `src/core/state/avatar.ts` | Nuevo: estado del avatar |
| Web UI (Svelte) | `src/app/screens/Avatar.tsx` | Nuevo: UI React para avatares |
| CUDA/PyTorch | extirpado | Peso extremo → solo estado lógico |
| pretrained_weights | extirpado | Modelos externos |
| TensorRT | extirpado | Infra GPU |
| StreamDiffusion | extirpado | Difusión ajena |

## Principio anfibio
- **Conservado**: referencia de expresión → estado animado → render placeholder
- **Extirpado**: PyTorch, CUDA, TensorRT, StreamDiffusion, weights
- **Isomorfismo**: avatar estado vivo = agentMesh + NOOA (estado de agentes)

## Isomorfismo HSCSG
- Avatar estado = SoulState (deriva/anclada)
- Motion encoding =heartbeat del agente
- Reference image = identidad soberana (Ley III: lucidez, solo propio rostro consentido)
