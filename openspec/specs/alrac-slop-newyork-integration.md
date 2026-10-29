# Spec OpenSpec: Integración Slop New York → HSCSG/ALRAC

**Estado:** borrador de integración  
**Licencia:** MIT (código fuente Slop) + MIT (Zeitnus/HSCSG core)  
**Fuente:** https://github.com/Isaacko0/Slop-Zeitnus-HSCSG-slop-newyork  
**Atribución:** Mr.doob / Isaacko0 — Slop New York demo

## 1. ¿Qué es Slop New York?

Simulación de ciudad de Nueva York construida con three.js, WebGPURenderer y TSL (Three.js Shading Language). Explora Manhattan a pie, en coche, bicicleta o helicóptero. 11 cámaras cinemáticas, sistema de tráfico, peatones, audio espacial, mapa interactivo fullscreen. 60 FPS objetivo.

## 2. Patrones reimplementables (no copia literal)

### 2.1 Renderizador espacial soberano

Patrón: WebGPURenderer + TSL shaders + importmap hacia three.js dev branch.  
Contraparte HSCSG: Pipeline de renderizado controlado, soberano, sin dependencia de vendor cerrado.  
Reimplementación: TypeScript/React con WebGPU o WebGL fallback, shaders TSL traducidos a GLSL/WGSL según target.

### 2.2 Sistema de actores con estado

Patrón: actor-models.js — cada actor (persona, coche, ciclista, helicóptero) tiene modelo 3D, estado, controlador.  
Contraparte HSCSG: Entidad con DID, balance TQ, estado activo/frozen/closed (como TQAccount).  
Reimplementación: Clase base `Actor` en TypeScript con ciclo de vida, estado sincronizable, RAO credential para procedencia.

### 2.3 Mapa interactivo con búsqueda y navegación

Patrón: nyc-map.js + fullmap-modal — mapa Manhattan con búsqueda de calles, brújula, zoom, GPS, teleport por click.  
Contraparte HSCSG: Panel lateral con búsqueda en tiempo real (como NeuroArchitecture.tsx), coordenadas normalizadas 0-1000.  
Reimplementación: Componente React con SVG/Canvas, coordenadas normalizadas, búsqueda filtrada, selección de región/entidad.

### 2.4 Bucle principal (LoopEngine)

Patrón: main.js — bucle de renderización, inicialización WebGPURenderer, gestión de módulos cargados en paralelo (modulepreload).  
Contraparte HSCSG: LoopEngine tick central, γ-CARMIS.  
Reimplementación: Bucle TypeScript con requestAnimationFrame o WebGPU present, módulos cargados dinámicamente, culling de escena.

### 2.5 Sistema de audio espacial

Patrón: audio-system.js — síntesis, eventos, fuentes, acústica.  
Contraparte HSCSG: Audio como servicio nodo, fuentes con raíces en nodos territoriales.  
Reimplementación: Web Audio API con nodos de audio espacial, eventos desencadenados por proximidad o estado.

## 3. Mapeo de capacidades a capas ALRAC

| Capacidad Slop | Capa ALRAC | Implementación TypeScript sugerida |
|---|---|---|
| WebGPURenderer + TSL | Infraestructura (Capa 0-2) | `src/core/lib/spatial-renderer.ts` |
| Actor-models + estado | Core state (Capa 1) | `src/core/state/actor.ts` |
| Tráfico + peatones | Simulación (Capa 4) | `src/core/lib/traffic-sim.ts` |
| Cámaras cinemáticas | UI/UX (Capa 4) | `src/app/screens/CinematicCamera.tsx` |
| Mapa interactivo | Spatial (Capa 2) | `src/app/screens/InteractiveMap.tsx` |
| Audio espacial | Infraestructura | `src/core/lib/spatial-audio.ts` |

## 4. Reglas de negocio traducidas

1. **Cada entidad tiene estado propio** → TQAccount con balance, memberId, status
2. **Tráfico con prioridad y colisión** → Boundaries.failClosed() para reglas de tránsito
3. **Cámaras seleccionables** → Vista multi-perspectiva, cada cámara = región de observación
4. **Click = teleport** → Selección de entidad/región, cambio de contexto
5. **Audio espacial reactivo** → Fuentes de audio ancladas a nodos, eventos por proximidad

## 5. Licencia y datos

- Código: MIT — reimplementable sin restricciones de copyleft
- Datos geográficos: ODbL (OpenStreetMap) + NYC Open Data — atribuir fuentes, no incluir datos crudos en repo Zeitnus sin verificar compatibilidad
- Dependencias three.js: servir desde CDN o empaquetar según términos de mrdoob/three.js

## 6. Verificación (Fase 3)

- [ ] `license:check` — MIT confirmado, sin conflictos
- [ ] `typecheck` — TypeScript compilado sin errores en módulos reimplementados
- [ ] `lint` — ESLint/Prettier aprobado
- [ ] `test` — Tests de unidad para sistema de actores, renderizador, mapa

## 7. Referencias

- https://github.com/Isaacko0/Slop-Zeitnus-HSCSG-slop-newyork (MIT)
- https://mrdoob.github.io/slop-newyork/ (demo live)
- https://github.com/mrdoob/three.js (three.js dev branch)
- NYC Open Data + OpenStreetMap (ODbL)

**Principio rector:** El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
