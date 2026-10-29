# Integración: Slop New York ↔ HSCSG/ALRAC

**Fuente:** https://github.com/Isaacko0/Slop-Zeitnus-HSCSG-slop-newyork  
**Licencia:** MIT (código) + ODbL (datos geográficos)  
**Estado:** Fase 1 de asimilación (documentación de integración)  
**Fecha:** 2026-10-25

## Resumen

Slop New York es una simulación de ciudad de Nueva York construida con three.js, WebGPURenderer y TSL. Permite explorar Manhattan a pie, en coche, bicicleta o helicóptero, con 11 cámaras cinemáticas, sistema de tráfico, peatones, audio espacial y mapa interactivo fullscreen.

Este documento registra los patrones arquitectónicos identificados y su posible reimplementación en el marco HSCSG v15 OS (Zeitnus/ALRAC), sin copia literal de código bajo licencia incompatible. Al ser MIT, los patrones son libremente reimplementables en TypeScript/React.

## Patrones identificados y mapeo a HSCSG/ALRAC

| Patrón Slop New York | Contraparte HSCSG/ALRAC | Capa ALRAC | Observación |
|---|---|---|---|
| WebGPURenderer + TSL shaders | Render pipeline soberano | Infraestructura | Pipeline de renderizado controlado, no dependiente de vendor |
| 11 cámaras cinemáticas | Vista multi-perspectiva | UI/UX | Cámara como entidad seleccionable (como región cerebral en NeuroArchitecture) |
| Grid vial Manhattan (29° offset) | Coordenadas normalizadas 0-1000 | Spatial | Isomorfo al mapa cerebral SVG (0-1000) |
| Actor-models (personas, vehículos) | Entidades con estado | Core | Actor como entidad con DID, balance TQ, estado activo/inactivo |
| Sistema de tráfico + peatones | Simulación de flujo | Simulación | Flux de entidades, reglas de colisión y prioridad |
| Audio sistema (síntesis, eventos, fuentes, acústica) | Audio espacial nodo | Infraestructura | Audio como servicio con raíces en nodos |
| Mapa interactivo fullscreen (búsqueda, brújula, GPS, zoom) | Panel lateral con búsqueda en tiempo real | UI | Isomorfo al panel de NeuroArchitecture (Mapa/Leyes/Tabla) |
| Scene culling + post-processing | Optimización de render | Infraestructura | Culling = Boundaries.failClosed() para render |
| Bucle principal (main.js) | LoopEngine tick central | Capa 0 | Bucle principal = γ-CARMIS tick |
| NYC geodata (125th St → Battery Park) | Datos territoriales georeferenciados | Spatial | Datos de ciudad como capa territorial |

## Reglas de negocio identificadas

1. **Cada entidad (actor/vehículo) tiene estado propio** — posición, velocidad, tipo, cámara asociada
2. **El tráfico tiene prioridad y reglas de colisión** — análogo a Boundaries.failClosed() en tránsito
3. **Las cámaras son seleccionables** — cada cámara ofrece una perspectiva diferente de la misma ciudad
4. **El mapa fullscreen permite teleportar** — click = cambio de contexto, análogo a seleccionar región cerebral
5. **El audio es espacial y reactivo** — fuentes de audio con acústica, eventos desencadenados

## Especificaciones OpenSpec sugeridas

- `alrac-slop-newyork-integration.md` — mapeo de patrones de simulación urbana a HSCSG/ALRAC
- `alrac-spatial-renderer.md` — espec para renderizador espacial soberano (WebGPU + TSL → TypeScript/React)
- `alrac-actor-system.md` — espec para sistema de actores con estado (entidades, DID, TQ balance)

## Referencias

- Repo: https://github.com/Isaacko0/Slop-Zeitnus-HSCSG-slop-newyork (MIT)
- Demo live: https://mrdoob.github.io/slop-newyork/
- three.js dev: https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/
- Geo: NYC Open Data + OpenStreetMap (ODbL)
