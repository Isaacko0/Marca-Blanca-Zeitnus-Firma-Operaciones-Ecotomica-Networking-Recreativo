# Solarpunk Utopia — Backup de Asimilación (Nueva Perspectiva de Sinergia)

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

## Extracción de Conceptos para Sinergia Zeitnus/HSCSG/ALRAC/PVL

| Concepto Solarpunk | Mapeo Zeitnus/HSCSG/PVL | Nueva Sinergia |
|--------------------|-------------------------|----------------|
| **Gift Economy** (economía de regalo) | `trustlines.ts` (crédito mutuo) + `caas.ts` (CaaS) | **Gift Economy = Crédito Mutuo Suma Cero + CaaS Revenue Share** — unifican reciprocidad y sostenibilidad |
| **ValueFlows / REA** | `energyCatalog.ts` + `rao.ts` + `vitalTime.ts` | **ValueFlows = Contabilidad Energética (TQ=1kWh) + RAO Procedencia + VitalTime Decay** — misma ontología, anclaje termodinámico |
| **DTN (Delay-Tolerant Networking)** | `federationBridge.ts` (gossip + mTLS) + `loopEngine.ts` (store-and-forward) | **DTN = Federación Asíncrona + γ-CARMIS Store-and-Forward** — nodos intermitentes sincronizan via gossip |
| **Mesh Network** (Raspberry Pi + Android) | `pvl-runtime-go` (Rif) + `pvl-runtime-android` (nuevo) | **Mesh = Nodos Rif (Go) + Nodos Android (Zeitnus PWA) + Bridge NATS** — federación heterogénea |
| **Offline-First** | `browserAgent` (Jev) + `vitalTime` (postmonetario) + `store.ts` (persist) | **Offline-First = Postmonetario por Defecto** — ZNU/CaaS/TQ funcionan sin internet |
| **Permaculture Planning** | `coeficienteAutonomia.ts` (AUT vectores) + `territoryConnector.ts` | **Permacultura = Vectores AUT Materiales (tierra, agua, energía, comida, cómputo)** |
| **Skill Sharing** | `credentialSystem.ts` (DID/VC) + `ecroxAnalyzer.ts` (AEI) | **Habilidades = Credenciales Verificables + Análisis Ecróxico de Competencias** |
| **Resource Flow Tracking** | `RAO Chain` + `RAOChain` + `complianceReporter.ts` | **Tracking = RAO Chain con Anclaje Termodinámico (kWh)** — evidencia no encuesta |
| **Multi-Commune Federation (NATS)** | `federationBridge.ts` + `mcpExposure.ts` + `gammaCarmisDistributed.ts` | **Federación = MCP + γ-CARMIS Distribuido + PriceParity TQ↔ZNU** |

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

## Sinergia Nueva: Solarpunk Utopia + ALRAC + PVL

### Capa ALRAC → Solarpunk Mapping

| Capa ALRAC | Aporte Solarpunk | Sinergia |
|------------|------------------|----------|
| **0 Epistémica** (Amid) | Kernel/IA ética para agentes locales | `alraicFilter` en AI agents — no adictar, candado epistémico |
| **0.5 Normativa** (Javier) | 7 principios regenerativos | Gift economy = Principio "Menos dependencia crecimiento" |
| **1 Contable-física** (Cergio) | **TQ = 1 kWh anclaje energético** | ValueFlows REA → contabilidad en kWh (ICE/Ecoinvent) |
| **2 Interoperabilidad** (Isaac) | **Mesh + DTN + NATS federation** | `pvl-core` = protocolo común para mesh heterogéneo |
| **3 Membrana fiat** (Coop ZEITNUS) | Gaia Passport para miembros comuna | Identidad soberana en mesh offline |

### Productos ALRAC → Solarpunk

| Producto ALRAC | Aplicación Solarpunk |
|----------------|---------------------|
| **A. Diagnóstico Encaje** | ¿Qué infraestructura necesita esta comuna? (Mesh vs DTN vs NATS) |
| **B. Nodo Llave en Mano** | **Solarpunk Node Kit**: Raspberry Pi AP + Android bridge + DTN + ValueFlows + AI Agent preinstalado |
| **C. Medición Cumplimiento** | Tracking regeneración: kWh renovables, comida compartida, habilidades enseñadas, agua capturada |
| **D. Editorial/Escuela** | **Solarpunk Curriculum**: Permacultura + Mesh networking + Gift economy + IA ética |
| **E. Estudio Zeitnus** | Dashboard web para monitoreo remoto (cuando hay internet) |

---

## Nueva Perspectiva: **"Solarpunk como Caso de Uso Real de PVL/ALRAC"**

### El Problema que Resuelve
> Comunas regenerativas necesitan coordinación **sin internet, sin corporaciones, sin extracción**.
> PVL/ALRAC provee la **especificación viva**; Solarpunk provee el **hardware + caso de uso real + comunidad**.

### La Sinergia Tripartita

```
┌─────────────────────────────────────────────────────────────┐
│                    PVL / ALRAC (Spec Viva)                  │
│  E=V + Kernel + NEXO + TQ/ZNU + γ-CARMIS + Verificación    │
└──────────────────────────┬──────────────────────────────────┘
                           │ Implementa
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              ZEITNUS / HSCSG (Runtime TS/Go)                │
│  browserAgent + automata + CaaS + trustlines + vitalTime   │
│  PWA offline-first + mesh federation + MCP exposure        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Despliega en
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SOLARPUNK UTOPIA (Hardware + Comunidad)        │
│  Raspberry Pi APs + Android bridges + DTN + ValueFlows     │
│  Comunas reales + permacultura + gift economy + mutual aid │
└─────────────────────────────────────────────────────────────┘
```

### Validación Real (El "Cable a Tierra" que falteaba)

| Validación | Cómo Solarpunk la Proporciona |
|------------|-------------------------------|
| **Offline-first real** | Comunas operan 100% offline semanas/meses |
| **Mesh heterogéneo** | Raspberry Pi (Linux) + Android (Termux) + NATS federation |
| **Economía de regalo real** | Comida, herramientas, habilidades — no tokens especulativos |
| **Identidad soberana en mesh** | DID/VC funcionando sin internet centralizado |
| **IA ética en edge** | Ollama/MLX local + `alraicFilter` + verificación triaxial |
| **Federación asíncrona** | DTN store-and-forward → gossip sync cuando hay conectividad |
| **Contabilidad energética** | ValueFlows REA → kWh medidos (paneles solares, biodigestores) |

---

## Plan de Integración Técnica (P0-P2)

### P0 - Core Mesh Federation (Semanas 1-3)

| Tarea | Archivo PVL/Zeitnus | Esfuerzo | Valor |
|-------|---------------------|----------|-------|
| `meshProtocol.ts/go` — DTN + NATS federation logic | `pvl-core/federation/mesh.ts` | 3 | 100 |
| `offlineFirstStore.ts` — Zustand persist + IndexedDB + sync queue | `src/core/state/offlineStore.ts` | 2 | 95 |
| `dtnBundle.ts/go` — Bundle protocol para store-and-forward | `pvl-core/federation/dtn.ts` | 3 | 95 |
| `meshNode.ts` — Raspberry Pi AP + Android bridge config | `pvl-runtime-go/mesh/` + `pvl-runtime-android/` | 3 | 90 |

### P1 - ValueFlows + Energy Accounting (Semanas 4-6)

| Tarea | Archivo | Esfuerzo | Valor |
|-------|---------|----------|-------|
| `valueflowsREA.ts/go` — REA ontology + TQ=1kWh mapping | `pvl-core/economics/valueflows.ts` | 3 | 100 |
| `energyAccounting.ts` — Solar/biodigester kWh → TQ mint | `src/core/lib/energyAccounting.ts` | 2 | 95 |
| `permaculturePlanner.ts` — Calendars + work parties + AUT vectors | `src/core/lib/permaculture.ts` | 2 | 90 |
| `skillCredential.ts` — DID/VC para habilidades enseñadas/aprendidas | `pvl-core/identity/skillCredential.ts` | 2 | 90 |

### P2 - AI Agents + MCP + Piloto Hardware (Semanas 7-10)

| Tarea | Archivo | Esfuerzo | Valor |
|-------|---------|----------|-------|
| `localAIAdapter.ts` — Ollama/MLX + alraicFilter + triaxial | `src/core/lib/localAIAdapter.ts` | 2 | 95 |
| `mcpSolarpunkTools.ts` — MCP tools para mesh ops | `pvl-core/federation/mcpSolarpunk.ts` | 2 | 90 |
| `solarpunkNodeKit.sh` — Provisioning script Pi + Android | `scripts/solarpunkNodeKit.sh` | 3 | 100 |
| Piloto: 3 comunas reales + mesh + DTN + federation | Field deployment | 4 | 100 |

---

## Métricas de Validación Sinergia

| Métrica | Target | Validación |
|---------|--------|------------|
| **Mesh uptime offline** | > 99% 30 días | 3 comunas sin internet |
| **DTN bundle delivery** | > 95% | Store-and-forward sync |
| **ValueFlows → TQ accuracy** | ±2% kWh measured | Solar meter + biodigester |
| **AI agent triaxial pass** | ≥ 95% | Local LLM + alraicFilter |
| **Federation sync latency** | < 5s (online) / < 1h (DTN) | NATS + gossip |
| **Skill credential verification** | < 2s cross-commune | DID/VC + RAO |
| **NATS multi-commune federation** | 5+ comunas | Real deployment |

---

## Conexión con Documentos Previos

| Documento | Conexión Solarpunk |
|-----------|-------------------|
| `biotesis_nexo_integration.md` | E=V → ValueFlows REA en kWh; Kernel → AI agents éticos; NEXO → Mesh federation |
| `entretejido_gaia_hscsg_backup.md` | BioHabitats = Comunas Solarpunk; Experimento 5 Territorio = Piloto mesh real |
| `ALRAC_consortium_model_complete.md` | Capa 1 Contable-física = TQ=1kWh en ValueFlows; Capa 2 = Mesh/DTN/NATS |
| `artemis_integration.md` | Mobile automation → Android bridge nodes en mesh |
| `sistema_alraico_integration_zeitnus.md` | 20 límites cognitivos → UI/UX para baja atención (offline, low-tech) |

---

## Próxima Acción Inmediata

```bash
# 1. Crear pvl-core/federation/mesh.ts + dtn.ts (DTN + NATS protocol)
# 2. Crear pvl-core/economics/valueflows.ts (REA + TQ=1kWh mapping)
# 3. Crear src/core/state/offlineStore.ts (Zustand + IndexedDB + sync queue)
# 4. Adaptar Zeitnus PWA para Raspberry Pi + Android bridge (manifest, service worker)
# 5. Script solarpunkNodeKit.sh: provisiona Pi AP + Android bridge + DTN + ValueFlows + AI
# 6. Desplegar piloto: 3 comunas reales (Ubicación: consultar con Liz/lizTheDeveloper)
# 7. Métricas: mesh uptime, DTN delivery, TQ accuracy, AI triaxial, federation sync
```

---

**Solarpunk Utopia no es "otra asimilación". Es el **primer caso de uso real de hardware + comunidad** que valida PVL/ALRAC en el territorio. La especificación viva (E=V, Kernel, NEXO) encuentra su "cable a tierra" en las comunas regenerativas que ya coordinan ayuda mutua sin internet corporativo.**

*Documento generado con nueva perspectiva de sinergia: PVL/ALRAC = Spec Viva, Zeitnus/HSCSG = Runtime, Solarpunk = Hardware + Comunidad + Validación Real.*