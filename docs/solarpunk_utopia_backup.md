# Solarpunk Utopia — Backup de Asimilación

**Fuente**: `https://github.com/lizTheDeveloper/solarpunk_utopia`  
**Fecha**: 2026-09-18  
**Licencia**: MIT  
**Estrellas**: 42 | Forks: 4 | Commits: 295  
**Estado**: ✅ Production ready (28/31 sistemas completados)  
**Próximo**: Hardware deployment (Raspberry Pi APs, Android bridge nodes)  
**Futuro**: Multi-commune federation via NATS

---

## Resumen Ejecutivo

**Solarpunk Utopia** = Infraestructura de red mesh offline-first para economías de regalo regenerativas en comunas solarpunk. No es solo software — es herramienta para que comunidades coordinen ayuda mutua, compartan recursos, planifiquen permacultura y aprendan juntas **sin depender de plataformas corporativas ni infraestructura de internet**.

### Capacidades Principales (28/31 sistemas completados)

| Sistema | Función | Estado |
|---------|---------|--------|
| **DTN Bundle System** | Delay-Tolerant Networking para comunicación offline | ✅ |
| **ValueFlows** | Contabilidad de flujos de recursos (REA) | ✅ |
| **Mesh Networking** | Raspberry Pi APs + Android bridge nodes | ✅ Core |
| **AI Agents** | LLM backends (Anthropic, OpenAI, HF, Ollama, MLX) via httpx | ✅ |
| **Database** | aiosqlite (offline-first) | ✅ |
| **Mutual Aid Coordination** | Compartir comida, herramientas, habilidades | ✅ |
| **Permaculture Planning** | Planting/harvest calendars, work parties | ✅ |
| **Skill Sharing** | Teach/learn dentro de la comunidad | ✅ |
| **Resource Flow Tracking** | Accountability transparente | ✅ |
| **Offline-First Operation** | 100% autónomo sin internet | ✅ |

### Stack Tecnológico (Principio Anfibio Aplicado)

| Lógica Pura (Asimilar) | Infraestructura (NO Asimilar - Anfibio) |
|------------------------|------------------------------------------|
| ValueFlows accounting logic | Raspberry Pi AP hardware |
| DTN bundle protocol algorithms | Android bridge node firmware |
| Mesh routing protocols | LoRa/WiFi radio hardware |
| REA (Resource-Event-Agent) ontology | Physical mesh deployment |
| Mutual aid coordination algorithms | Hardware provisioning scripts |
| Skill/knowledge graph structures | NATS multi-commune federation |
| Permaculture calendar logic | Termux/Android-specific builds |
| Gift economy matching logic | Playwright auth setup (testing only) |

### Innovación Clave: LLM Backends Unificados (httpx-only)

Eliminaron dependencia `anthropic` (tokenizers/Rust/maturin) → **httpx puro** para TODOS los backends:
- Anthropic, OpenAI, HuggingFace, Ollama → httpx (funciona en Termux/Android)
- MLX → mlx-lm (Mac only)
- **Resultado**: 5MB vs 500MB deps, instalación segundos vs 10+ min, funciona en Android/Termux sin modificación

---

## Arquitectura Solarpunk (del README)

```
Comuna Solarpunk
├── Raspberry Pi Access Points (mesh local)
├── Android Bridge Nodes (gateway internet opcional)
├── DTN Bundle System (store-and-forward offline)
├── ValueFlows Ledger (REA accounting)
├── AI Agents (local LLM via Ollama/MLX)
├── Mutual Aid App (React + React Query)
├── Permaculture Planner (calendars, work parties)
├── Skill Share Platform (teach/learn)
└── Resource Tracker (accountability)
        │
        ▼
Multi-Commune Federation (NATS)
        │
        ▼
Red Global de Comunas Regenerativas
```

---

## Vision (del README)

> "We're building the infrastructure for regenerative gift economy communities. This isn't just software—it's a tool for communities to coordinate mutual aid, share resources, plan permaculture work, and learn together, all without depending on corporate platforms or internet infrastructure."

When this system works, communes can:
- ✅ Share surplus food before it spoils
- ✅ Lend tools and equipment easily
- ✅ Coordinate seasonal planting and harvests
- ✅ Teach and learn skills within the community
- ✅ Plan work parties and events
- ✅ Track resource flows for accountability
- ✅ Operate entirely offline and autonomously

**This is infrastructure for a better world. Let's build it together. 🌱**

---

## Estructura de Directorios Clave

```
solarpunk_utopia/
├── app/                    # FastAPI backend + React frontend
│   ├── llm/               # LLM backends unificados (httpx)
│   ├── api/               # REST API endpoints
│   ├── models/            # Pydantic models (ValueFlows, REA)
│   └── services/          # DTN, mesh, ValueFlows, AI agents
├── ai_inference_node/     # Nodo inferencia IA local
├── scripts/               # Provisioning, Termux compatibility, diagnostics
├── openspec/              # Propuestas y especificaciones vivas
├── tests/                 # Playwright + pytest (integration)
├── docs/                  # QUICKSTART, DEPLOYMENT, BUILD_STATUS
├── requirements.txt       # Python deps (httpx, FastAPI, etc.)
├── setup.sh               # Instalación universal (Termux compatible)
└── run_all_services.sh    # Orquestador todos los servicios
```

---

## Termux/Android Compatibility (Innovación Clave)

- **check_termux_compatibility.py**: Analiza requirements para dependencias Rust/compilación
- **find_termux_wheels.py**: Verifica wheels binarios en PyPI para ARM64/x86_64
- **check_rust_termux.sh**: Verifica Rust en Termux
- **setup.sh**: Estrategia `--only-binary :all:` primero, fallback a compilación
- **Resultado**: pydantic-core TIENE wheels para aarch64 → la mayoría instalaciones Termux **no necesitan Rust**

---

## Licencia y Ética

- **MIT License** — "Use this to build a better world!"
- **Built with ❤️ for regenerative gift economy communities**
- **Let's coordinate mutual aid without corporate platforms. Let's build solidarity infrastructure. Let's create the world we want to see. 🌱**