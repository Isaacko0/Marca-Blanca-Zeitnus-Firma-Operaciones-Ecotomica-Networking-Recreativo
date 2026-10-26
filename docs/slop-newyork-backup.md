# Backup Local — Slop-Zeitnus-HSCSG-slop-newyork

**Fuente:** https://github.com/Isaacko0/Slop-Zeitnus-HSCSG-slop-newyork  
**Licencia:** MIT (Copyright 2026 Mr.doob)  
**Datos geográficos:** NYC Open Data + OpenStreetMap (ODbL)  
**Fecha de backup:** 2026-10-25  
**Estado:** Demo ciudad Zeitnus — simulación NYC con three.js / WebGPURenderer / TSL

## Estructura del repositorio (backup de referencia)

```
Slop-Zeitnus-HSCSG-slop-newyork/
├── .gitignore
├── LICENSE                 # MIT
├── README.md               # Documentación principal (8 líneas)
├── index.html              # Punto de entrada (320 líneas, 22.9 KB)
├── css/
│   └── style.css           # Estilos UI (Inter, Overpass, HUD, map controls)
├── js/
│   ├── main.js             # Bucle principal, inicialización WebGPURenderer
│   ├── nyc-geodata.js      # Datos geográficos Manhattan (125th St → Battery Park)
│   ├── city-config.js      # Configuración de ciudad
│   ├── tsl-materials.js    # Materiales TSL (Three.js Shading Language)
│   ├── trees.js            # Árboles procedurales
│   ├── actor-models.js     # Modelos de actores (personas, vehículos)
│   ├── vehicle-lights.js   # Luces de vehículos
│   ├── pedestrians.js      # Simulación peatones
│   ├── lighting.js         # Iluminación escena
│   ├── city-grid.js        # Grid de ciudad
│   ├── boroughs.js         # Barrios de Manhattan
│   ├── buildings.js        # Edificios
│   ├── fire-escapes.js     # Escaleras de incendios
│   ├── landmarks.js        # Puntos de referencia
│   ├── street-details.js   # Detalles de calle
│   ├── road-network.js     # Red vial
│   ├── road-paint.js       # Marcado vial
│   ├── traffic.js          # Tráfico vehicular
│   ├── pedestrian-system.js # Sistema de peatones
│   ├── pedestrian-routes.js # Rutas de peatones
│   ├── controllers.js      # Controladores de entrada
│   ├── touch-controls.js   # Controles táctiles
│   ├── gamepad-controls.js # Controles gamepad
│   ├── cameras.js          # 11 cámaras cinemáticas
│   ├── nyc-map.js          # Mapa interactivo Manhattan
│   ├── scene-culling.js    # Culling de escena
│   ├── post-processing.js  # Post-procesamiento
│   ├── audio-synthesis.js  # Síntesis de audio
│   ├── audio-events.js     # Eventos de audio
│   ├── audio-sources.js    # Fuentes de audio
│   ├── audio-acoustics.js  # Acústica
│   └── audio-system.js     # Sistema de audio
├── tests/
│   └── ...                 # Tests (pendiente de explorar)
└── tools/
    └── ...                 # Herramientas (pendiente de explorar)
```

## Características técnicas clave

- **Motor:** three.js (rama dev, vía jsDelivr), WebGPURenderer, TSL (Three.js Shading Language)
- **Mapa:** Manhattan completo (125th St a Battery Park), grid vial 29° este del norte verdadero
- **Navegación:** Persona, Coche, Ciclista, Helicóptero (tercera persona)
- **Cámaras:** 11 cámaras cinemáticas (Empire State 86th Deck, Bryant Park, Waterfront, Auto-Director Aerial, etc.)
- **Rendimiento:** 60 FPS objetivo, scene culling, post-procesamiento
- **Audio:** Síntesis de audio, eventos, fuentes, acústica, sistema integrado
- **UI:** HUD con iconos SVG (sprite 24×24), mapa interactivo fullscreen con búsqueda, brújula, zoom, GPS
- **Controles:** Teclado, táctil, gamepad

## Notas de licencia

- Código: MIT — reimplementable libremente en TypeScript/React
- Datos geográficos: ODbL (OpenStreetMap) + NYC Open Data — atribuir fuentes
- No hay conflicto de copyleft (no MPL-2.0, no AGPL-3.0)
