# Backup: memegen (jacebrowning/memegen) — Fuente Original

**Fecha:** 2026-10-07  
**Fuente:** https://github.com/jacebrowning/memegen (extracción web completa)  
**Entidad:** Jace Browning — memegen.link API  
**Licencia:** MIT License — Código abierto, compatible con Principio Anfibio  
**Estado:** Activo, 2,054 commits, v11.2 (dic 2025)

---

## 1. IDENTIDAD Y MISIÓN

| Atributo | Valor |
|----------|-------|
| **Nombre** | memegen — Meme Generator API |
| **URL Producción** | https://api.memegen.link / https://memegen.link |
| **Autor** | Jace Browning (@jacebrowning) |
| **Descripción** | "The free and open source API to generate memes" — API sin estado para generar memes programáticamente via URLs |
| **Licencia** | MIT (permisiva, compatible comercial) |
| **Stack** | Python 3.13, Sanic, Pillow, Poetry, pytest |
| **Deploy** | Heroku (Containerfile), CircleCI |
| **Métricas** | 1.8k ⭐, 22 watching, 249 forks, 2,054 commits |

---

## 2. ARQUITECTURA TÉCNICA

### 2.1 Estructura del Proyecto
```
memegen/
├── app/                    # Código principal
│   ├── __init__.py         # Factory Sanic app
│   ├── main.py             # Entry point
│   ├── config.py           # Configuración
│   ├── settings.py         # Settings (Pydantic BaseSettings)
│   ├── types.py            # Tipos (Pydantic models)
│   ├── helpers.py          # Utilidades generales
│   ├── models/             # Modelos de datos
│   ├── views/              # Endpoints HTTP
│   ├── utils/              # Utilidades imagen/URL
│   ├── static/             # Assets estáticos
│   └── tests/              # Tests (pytest)
├── templates/              # 200+ plantillas meme (directorios por template)
│   ├── <template_name>/    # Cada template: background.png, config.json
│   ├── _error/             # Templates error
│   └── _test/              # Templates test
├── fonts/                  # Fuentes TTF/OTF (Titillium, Kalam, Impact, Noto, HG Mincho)
├── scripts/                # Scripts utilitarios
├── docs/                   # Documentación
├── .circleci/              # CI/CD
├── Containerfile           # Docker/Podman
├── Procfile                # Heroku production
├── Procfile.dev            # Heroku development
├── pyproject.toml          # Poetry config
├── poetry.lock
├── Makefile                # Comandos desarrollo
├── CHANGELOG.md            # Historial versiones
├── CONTRIBUTING.md         # Guía contribución
├── LICENSE.txt             # MIT License
└── README.md               # Documentación principal
```

### 2.2 Stack Detallado
| Componente | Tecnología | Versión/Detalle |
|------------|------------|-----------------|
| **Web Framework** | Sanic | Async, alto rendimiento |
| **Image Processing** | Pillow (PIL) | Manipulación imágenes, texto, overlays |
| **Config** | Pydantic BaseSettings | Settings tipadas, env vars |
| **Dependency Mgmt** | Poetry 2.x | Lockfile, grupos dev/prod |
| **Testing** | pytest + pytest-describe | 200+ tests, coverage |
| **CI/CD** | CircleCI | Build, test, deploy Heroku |
| **Container** | Containerfile (Docker) | Multi-stage, Python 3.13 slim |
| **Deploy** | Heroku | Container registry, auto-scaling |
| **Fonts** | Google Fonts + custom | 7 familias, aliases |

### 2.3 API Design (URL-based, Stateless)
```
GET /images/<template>/<top_text>/<bottom_text>.<ext>
GET /images/custom/_/<filename>.<ext>?background=<url>
Query params: width, height, layout, style, font, color, center, scale
POST /images  (JSON body) → retorna URL generada
```

**Special Character Encoding:**
- `_` → espacio, `-` → espacio, `__` → `_`, `--` → `-`
- `~n` → newline, `~q` → `?`, `~a` → `&`, `~p` → `%`, `~h` → `#`, `~s` → `/`, `~b` → `\`, `~l` → `<`, `~g` → `>`, `''` → `"`

---

## 3. FUNCIONALIDADES CORE

### 3.1 Plantillas Predefinidas (200+)
Cada template en `templates/<name>/` contiene:
- `background.png` / `.jpg` / `.gif` / `.webp` (imagen base)
- `config.json` (metadatos: text positions, font, color, line spacing, etc.)

**Ejemplos:** `buzz`, `ds`, `pigeon`, `rollsafe`, `oprah`, `both`, `awkward`, `cheems`, `drake`, `distracted`, `expanding-brain`, `trade-offer`, etc.

### 3.2 Personalización Avanzada
| Feature | Query Params | Descripción |
|---------|--------------|-------------|
| **Custom Dimensions** | `width=<int>`, `height=<int>` | Escala exacta con padding |
| **Alternate Layouts** | `layout=top` | Texto solo arriba |
| **Custom Fonts** | `font=<id>` | 7 fuentes + aliases (`thick`, `comic`, `he`, `jp`) |
| **Custom Colors** | `color=<hex>,<hex>` | Color por línea de texto |
| **Image Overlays** | `style=<image_url>`, `center`, `scale` | Overlay imagen externa |
| **Custom Backgrounds** | `background=<image_url>` | Imagen base externa |
| **Animated Output** | `.gif`, `.webp` | Si template animado o texto animado |
| **Timed Overlays** | `style=<url>` + timing | Overlays temporizados (nuevo 2026) |

### 3.3 Formatos de Salida
| Extensión | Uso |
|-----------|-----|
| `.png` | Default, máxima calidad |
| `.jpg` / `.jpeg` | Archivos menores, lossy |
| `.gif` | Fondos animados O texto animado en estático |
| `.webp` | Moderno, animado o estático, mejor compresión |

---

## 4. MODELO DE NEGOCIO (Inferido)

### 4.1 Revenue Streams
| Stream | Evidencia | Estado |
|--------|-----------|--------|
| **GitHub Sponsors** | Badge en README + `app.json` | Activo |
| **Buy Me a Coffee** | Link en README | Activo |
| **Heroku Costs** | `.github` config "Limit PRs for Heroku costs" | Coste operativo |
| **API Gratuita** | "Free and open source API" | Core value prop |

### 4.2 Cost Structure
- **Heroku hosting** (container, dynos, add-ons)
- **CircleCI** (build minutes)
- **Dominio** memegen.link / api.memegen.link
- **Tiempo desarrollo** (Jace Browning + contributors)

### 4.3 Lock-ins Identificados
| Lock-in | Tipo | Mitigación HSCSG |
|---------|------|------------------|
| **Heroku** | Platform | Containerfile → portable a cualquier K8s/VM |
| **Sanic** | Framework | API surface mínima → portable a FastAPI/Starlette |
| **Pillow** | Image lib | Abstraction layer → portable a ImageMagick/WASM |
| **Google Fonts** | CDN externo | Fuentes vendidas localmente en `fonts/` ✅ |
| **External image URLs** | `style=` / `background=` | Cache local + mesh/DTN para offline |

---

## 5. CONTRIBUTORS Y GOBERNANZA

| Métrica | Valor |
|---------|-------|
| **Contributors** | 20+ (ver GitHub Insights) |
| **Maintainer único** | Jace Browning (benevolent dictator) |
| **PR Process** | Issues → PR → Review → Merge |
| **Changelog** | Manual, semver (v11.2) |
| **License** | MIT — permisiva, sin CLA requerido |

---

## 6. TEMPLATES CATALOG (Muestra Representativa)

| Template | Estilos | Descripción |
|----------|---------|-------------|
| `ds` | `default`, `maga` | Doge / Shiba Inu |
| `pigeon` | - | Pigeon "Is this Photoshop?" |
| `rollsafe` | `top` | Roll Safe pointing head |
| `oprah` | animated | "You get a..." |
| `both` | - | "Why not both?" |
| `cheems` | - | Cheems doge |
| `drake` | - | Drake hotline bling |
| `distracted` | - | Distracted boyfriend |
| `expanding-brain` | - | Expanding brain |
| `trade-offer` | - | Trade offer meme |
| `custom` | - | Custom background via URL |

**Total estimado:** 200+ templates (ver `templates/` directory listing)

---

## 7. METADATOS DE EXTRACCIÓN

| Métrica | Valor |
|---------|-------|
| **URLs extraídas** | 4 (repo root, app/, templates/, README) |
| **Tokens totales** | ~25,897 chars |
| **Templates detectados** | 200+ directorios |
| **Commits** | 2,054 (main branch) |
| **Última actividad** | 3 horas ago (Oct 7, 2026) — dependabot markdown update |
| **Método** | web_extract (Hermes) — extracción estática GitHub |

---

## Principio Anfibio Aplicado

- ✅ **Backup local creado** (`docs/memegen_backup.md`) — Principio Anfibio HSCSG
- ✅ **Licencia MIT** — Compatible, no requiere extirpar infra legal
- ✅ **Código abierto** — Lógica pura asimilable, infra Heroku/CircleCI extirpable
- ✅ **Uso:** Solo para asimilación lógica pura → módulos HSCSG v15 OS