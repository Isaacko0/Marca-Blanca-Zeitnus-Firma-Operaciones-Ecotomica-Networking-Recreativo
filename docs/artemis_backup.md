# Artemis (Google) — Backup de Asimilación

**Fuente**: `https://github.com/google/artemis`  
**Fecha**: 2026-09-18  
**Licencia**: Apache-2.0  
**Estrellas**: 7.8k | Forks: 728 | Commits: 119

---

## Resumen Ejecutivo

**Artemis** es un agente de IA que convierte instrucciones en lenguaje natural en automatización Android confiable. Logra 99%+ success rate en AndroidWorld Benchmark.

### Capacidades Clave

1. **Automatización Android end-to-end** desde lenguaje natural
2. **Percepción multimodal** (visión + UI tree + accesibilidad)
3. **Integración con AI coding assistants** (Antigravity, Codex, Claude Code)
4. **MCP Server** para exposición como herramienta
5. **Android Studio Integration** (planeado)
6. **iOS expansion** (roadmap)
7. **On-device VLMs** (roadmap)
8. **Real-time duplex voice** (roadmap)

### Arquitectura Técnica

```
artemis/
├── artemis/           # Core Python package
│   ├── agent/         # Agent loop, planning, execution
│   ├── perception/    # Multimodal perception (UI tree, screenshot, accessibility)
│   ├── action/        # Action space, execution, verification
│   ├── memory/        # Flash history, incident tracking
│   └── verification/  # Two-gate checker, checkpoints
├── apps/              # Android apps (test apps, demo)
├── mcp_server/        # MCP server para AI assistants
├── packages/          # Shared packages (TypeScript/Python)
├── playground/        # Interactive playground
├── tests/             # Test suite + AndroidWorld benchmark
└── config/            # Configuration management
```

### Stack Tecnológico

- **Python 3.10+** (core)
- **TypeScript** (packages, MCP server)
- **Android** (UIAutomator, Accessibility Service, ADB)
- **uv** (package manager)
- **pytest** (testing)
- **Apache 2.0** license

### Integración con AI Assistants

- **MCP Server** expone herramientas Artemis a Claude Code, Codex, Antigravity
- **Structured action specifications** para LLM reliability
- **Flash history** compartida para contexto

---

## Extracción de Conceptos para Zeitnus/HSCSG

| Concepto Artemis | Mapeo Zeitnus/HSCSG | Valor |
|------------------|---------------------|-------|
| Natural language → Android actions | `browserAgent` (Jev) pero para móvil | Extender automatización a móvil |
| Multimodal perception (UI + vision) | `ecroxAnalyzer` + `temporalCubes` | Verificación triaxial móvil |
| Two-gate verification | `triaxialVerification` + `gammaCarmis` | Validación robusta |
| MCP Server | `pvl-core` MCP exposure | Federación de herramientas |
| Flash history / incidents | `RAO` (Resource Accountability Object) | Trazabilidad completa |
| AndroidWorld benchmark | `pvl-compliance` suite | Métricas objetivas |
| Action bursts / structured specs | `logicByInherence` + `alraicFilter` | Ejecución confiable |

---

## Archivos Clave para Asimilar (Principio Anfibio: Lógica sí, Infra no)

### Lógica Pura (Asimilar)
- `artemis/agent/` — Agent loop, planning, execution logic
- `artemis/perception/` — Multimodal perception algorithms
- `artemis/action/` — Action space definitions, execution logic
- `artemis/verification/` — Two-gate checker, checkpoint logic
- `artemis/memory/` — Flash history, incident tracking logic
- `packages/` — Shared types, action specifications

### Infraestructura (NO Asimilar - Anfibio)
- ADB/Android-specific runtime
- UIAutomator/Accessibility Service bindings
- Android app compilation/deployment
- Gradle/Android Studio integration
- Device farm / cloud testing infrastructure
- Python-specific packaging (uv, pip)

### Adaptación Requerida

1. **Portar lógica a TypeScript** para integración nativa en Zeitnus (React/TS/Zustand)
2. **Abstraer plataforma** — interfaz `MobileAutomationPlatform` con implementaciones Android/iOS/Web
3. **Integrar con `browserAgent` (Jev)** — unified automation interface
4. **Exponer via MCP** en `pvl-core` para federación
5. **Verificación triaxial** obligatoria para cada acción móvil