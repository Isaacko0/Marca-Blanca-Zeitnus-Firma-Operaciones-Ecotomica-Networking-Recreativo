# Backup: Novokult LLM

## Información General

- **Repositorio original**: https://code.thedingodaily.com/michaelwenas/novokult
- **Autor**: Michael W.P. Wenas (ORCID: 0009-0005-8101-925X)
- **Licencia**: Peer Production License (PPL) — copyfarleft
- **Estado**: v1.5.0 (activo, November 2026)
- **Fecha de clonación**: 2026-11-04
- **Commits**: 21 commits en main
- **Zenodo**: https://zenodo.org/records/23926885 (DOI: 10.5281/zenodo.23926885)
- **Sitio web**: https://novokult.neocities.org/
- **Repo anterior**: github.com/michaelwpwenas/novokult-llm (suspendido por razones políticas)

## Qué es Novokult

Novokult LLM es una aplicación de escritorio (Electron) que ejecuta un modelo de lenguaje grande (LLM) localmente en la máquina del usuario. Diseñada para organizadores, investigadores y escritores de izquierda. Una vez que el archivo del modelo está en la máquina, la redacción, análisis y chat permanecen allí.

### Stack Tecnológico

- **Runtime**: Electron 45.0.0 + Node.js 24.14.1
- **Frontend**: HTML/CSS/JS plano (sin framework UI externo)
- **Inferencia**: llama.cpp (llama-server) vía child process, bound a 127.0.0.1:8765
- **Almacenamiento**: IndexedDB vía Dexie.js (conversaciones, mensajes, sources library)
- **Búsqueda web**: DuckDuckGo (HTML/Lite), Mojeek, Marxists Internet Archive — routed through Tor
- **Tor**: Bundled Tor Expert Bundle (SOCKS 127.0.0.1:9250, ControlPort 9251) + external SOCKS / Orbot (Android)
- **Modelo**: GGUF (gemma-4-E4B-it-ultra-uncensored-heretic-Q4_K_M recomendado, 5.34 GB)
- **Empaquetado**: electron-builder (Windows NSIS/portable, Linux AppImage/deb, Android APK via Capacitor)
- **Licencias third-party**: llama.cpp (MIT), Tor (BSD), Electron (MIT), Capacitor (MIT), Dexie (Apache-2.0), marked (MIT), DOMPurify (MPL-2.0), html-to-image (MIT), IBM Plex/Oswald fonts (OFL-1.1)

### Arquitectura Core

```
novokult/
├── electron/              # Main process + preload bridge
│   ├── main.js            # Electron entry, llama-server lifecycle, Tor lifecycle, IPC
│   ├── llama.js           # llama-server spawn, logging, health checks
│   ├── modelDownload.js   # Hugging Face model download with SHA-256 verification
│   └── preload.js         # Context bridge (novokultNative)
├── www/                   # Renderer (shared Electron + Capacitor/Android)
│   ├── index.html         # Single-page app
│   ├── css/               # style.css, pages.css
│   ├── js/
│   │   ├── app.js         # Main app logic (modes, chat, settings, generation)
│   │   ├── engine.js      # EngineManager (llama-server OpenAI-compatible client)
│   │   ├── prompts.js     # System prompts: BASE, ANALYST, AGITATOR, WEB
│   │   ├── rag.js         # Sources Library: chunking, BM25 retrieval
│   │   ├── search.js      # SearchManager: Tor bridges, query gen, providers, page reading
│   │   ├── store.js       # Dexie/IndexedDB: conversations, messages, sources, settings
│   │   ├── ui.js          # DOM rendering, toasts, modals, context meter
│   │   ├── locales.js     # Countries, languages, locale context blocks
│   │   ├── model-download.js # Hugging Face download UI
│   │   ├── native-shim.js # Capacitor/Electron bridge normalization
│   │   ├── bridge.js      # Shared bridge interface
│   │   └── info.js        # Guide/Acknowledgements content
│   ├── vendor/            # Bundled third-party libs (offline-first)
│   ├── fonts/             # IBM Plex Sans/Mono, Oswald (self-hosted)
│   └── assets/            # Logos (aluxhim.png, copyfarleft.png)
├── src/
│   └── bridge.js          # esbuild → www/vendor/llama-bridge.js
├── resources/             # llama.cpp binaries + Tor binaries (NOT committed)
├── models/                # .gguf models (NOT committed)
├── legal/                 # Third-party license notices (generated at build)
├── patches/               # patch-package patches
├── scripts/               # collect-licenses.js
├── capacitor.config.json  # Capacitor config for Android
├── package.json
├── LICENSE                # PPL full text
└── README.md
```

### Funcionalidades Principales

**Cuatro Modos de Operación**:
1. **Analysis**: Examina eventos/textos via marco marxista (contradicciones, fuerzas de clase, base/superestructura, etapa histórica, crítica ideológica, implicaciones estratégicas)
2. **Agitprop**: Redacta volantes, consignas, discursos, hilos sociales, artículos, canciones, poemas, sketches, boletines de huelga para audiencia concreta
3. **Reasoning**: Nuevo modo analítico donde el modelo muestra su proceso de pensamiento interno antes de la respuesta final
4. **Free Chat**: Conversación general con el modelo

**Herramientas de Soporte**:
- **Sources Library**: Carga .txt, .md, .html; chunking 800 chars/100 overlap; BM25 retrieval (top 4); cita como [S1]-[S4]
- **Web Search**: Off por defecto; DuckDuckGo HTML/Lite, Mojeek, Marxists Internet Archive; routed through Tor; query review UI; page reading con excerpt relevance
- **Locale Settings**: País, lugar, idioma de respuesta; localiza búsquedas (region + una query en idioma local)
- **Poster Export**: Formatos 1:1, 4:5, A4 via html-to-image
- **Data Export/Import**: JSON completo (conversaciones, mensajes, sources); settings NO exportados (model path, proxy config)
- **Offline-first**: Desktop app bloquea toda conexión excepto motor local (CSP + webRequest filter)

### Privacy & Threat Model

**Reduce riesgo**:
- Web search disabled by default; network monitoring confirma solo loopback socket
- Web searches solo a 3 proveedores + MIA through Tor
- Retrieved text labeled "untrusted"; model instructed to treat as evidence only, ignore embedded commands (prompt injection mitigation)
- Model downloads verified via pinned SHA-256 checksums

**No hace**:
- No local encryption: IndexedDB data unencrypted (full-disk encryption OS-level recommended)
- No vector embeddings: BM25 keyword matching only; no embedding/vector-search functions

### Licencias

- **Código propietario Novokult**: Peer Production License (PPL) — copyfarleft
  - Libre para commons y worker-owned cooperatives
  - Restringe explotación comercial por privately-owned businesses que profit from employee labor
  - Commercial use permitido SOLO si: worker-owned business/collective + all financial gain distributed among worker-owners
- **Third-party bundled**: Cada uno bajo su licencia original (MIT, Apache-2.0, BSD, MPL-2.0, OFL-1.1)
- **Modelo GGUF**: Gobernado por términos de sus publishers originales, separado del PPL de Novokult

### Distribución y Plataformas (v1.5.0)

| Plataforma | Paquete | Tamaño |
|------------|---------|--------|
| Windows | Installer (NSIS) | 195 MB |
| Windows | Portable | 164 MB |
| Linux | AppImage | 235 MB |
| Linux | Debian .deb | 186 MB |
| Android | APK | 69 MB |

Android port comparte UI codebase via Capacitor plugins (@capacitor/android, @jonit-dev/capacitor-tor, llama-cpp-capacitor). On-device mobile engine unfinished, no tested mobile release.

### Benchmarks (v1.5.0)

- Hardware test: Intel Core i5-12450HX (12 logical cores, 12.58 GB RAM)
- Model load: 7.2 seconds to healthy
- Prompt processing (36 tokens): 47.4 tokens/second
- Generation (128 tokens): 9.8 tokens/second
- CPU-only inference (no GPU acceleration in bundled build)

### Roadmap & Necesidades

1. Finishing/testing on-device Android engine (llama-cpp-capacitor)
2. Expanding translations and localized documentation
3. Implementing encryption for stored IndexedDB data
4. Consolidating license notices across all package formats
5. Securing independent professional security audit

### Referencias Teóricas (White Paper)

- Marx, *Grundrisse* (1857-1858): Machinery, general intellect, disposable time
- Panzieri, "Capitalist use of machinery": Machinery not neutral, shaped by capital
- Virno, "General intellect": Lives in living labor (shared linguistic/cognitive capacity)
- Kleiner, *Telekommunist Manifesto*: Peer-to-peer → client/server concentration; venture communism; copyfarleft/PPL
- Brecht, "Radio as apparatus of communication": Listeners should speak too
- Benjamin, "Author as producer": Readers into collaborators
- Trotsky, *Literature and Revolution*; Mally, *Culture of the Future* (Proletkult)
- Lenin, "What is to be done?": Agitation vs propaganda distinction
- Illich, *Tools for Conviviality*: Tools widening autonomy vs dependency
- Crawford, *Atlas of AI*; Dyer-Witheford et al., *Inhuman Power*; Pasquinelli, *Eye of the Master*

### Checksums SHA-256 (v1.5.0)

| Target | SHA-256 | Size |
|--------|---------|------|
| Novokult.LLM.Setup.1.5.0.exe | 4db561b0280034ec9f08f0ede2036b5f726506276ccd7466f6a796044d92e119 | 195 MB |
| Portable.Novokult.LLM.1.5.0.exe | 95d75d8bbcf373b7adfc78308b636b597610becda36dd484cf103cfcceac55af | 164 MB |
| gemma-4-E4B-it-ultra-uncensored-heretic-Q4_K_M.gguf | f9dbbe3bdf396f65aec4e801516a1b868a510d96225417a8aa06763e3c5b97dc | 5.34 GB |
| novokult-llm_1.5.0_amd64.deb | 4b77f17024a411931fbc4cbe0d31cc1062213f2e0dd643e4950a3ee3798b6093 | 186 MB |
| Novokult.LLM-1.5.0.AppImage | 0474a7719bc3e6c4c76b69fd0aa2652a468962dd13b9f97e399e5a4ab926a8a2 | 235 MB |
| novokult_llm_android-1.0.0.apk | 5bf9fb6cbaa104f98a5c4787cf8b2a291066a46cb4a655142a6a36fafa76f8a6 | 69 MB |