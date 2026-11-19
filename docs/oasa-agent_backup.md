# RESPALDO DE FUENTE — OASA Agent (closerdao/oasa-agent)

## Identificación de la fuente

- **Título:** oasa-agent — Agente regenerativo con conocimiento de dominio especializado para sistemas ecológicos
- **Autor/Org:** closerdao (Closer), mantenedor closerearth
- **Repo:** https://github.com/closerdao/oasa-agent
- **Rama:** main
- **Tipo:** Servidor Node.js (Koa) + LLM integration + MongoDB (1 commit, "Init repo", Aug 4 2025)
- **Licencia:** MIT

## ⚖️ Aviso de derechos de autor

Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica. Todos los derechos de autor permanecen con closerdao/Closer. No se reclama autoría sobre la obra original.

## Qué es el repositorio

Agente regenerativo (prototipo, 1 commit) que expone una API REST para consultas sobre sistemas ecológicos y de gobernanza, con memoria persistente (MongoDB), integración LLM (OpenAI/Anthropic), y patrón de orchestrator de dominios (agua, biodiversidad, gobernanza, financiero).

## Stack

| Capa | Tecnología | Licencia |
|------|-----------|----------|
| Runtime | Node.js (>=18) | — |
| Framework | Koa + @koa/router + koa-bodyparser + koa-cors | MIT |
| LLM client | axios (OpenAI / Anthropic) | MIT |
| Base de datos | MongoDB + mongoose (Mongoose ODM) | MIT |
| Lenguaje | JavaScript | — |
| Despliegue | Docker + docker-compose | — |

## Arquitectura (lógica pura extraíble)

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| MemorySystem | `index.js` (clase) + `server.js` (MongoDB) | Almacenamiento unificado de conocimiento por dominio, patrones temporales, memoria episódica, conocimiento indígena |
| TranslationLayer | `index.js` + `server.js` | Detección de dominio por keywords, formateo de respuesta, traducción de datos de sensores |
| DomainOrchestrator | `index.js` (`DomainOrchestrator`) + `server.js` (`EnhancedDomainOrchestrator`) | Registro de dominios, integración de respuestas multi-dominio, detección y resolución de conflictos, registro de episodios |
| LLMService | `llm-service.js` | Llamada a LLM (OpenAI/Anthropic), prompts por dominio, resolución de conflictos vía LLM, análisis de datos de sensores |
| Servidor HTTP | `server.js` | Endpoints: `/api/query`, `/api/sensor-data`, `/api/insights`, `/api/knowledge`, `/api/llm/analyze`, `/health` |
| Dominios | agua, biodiversidad, gobernanza, financiero | Detección por keyword, interpretación de datos, recomendaciones |

## Endpoints API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/query` | POST | Consulta al agente con contexto ambiental opcional |
| `/api/sensor-data` | POST | Ingreso de datos de sensores (IoT) |
| `/api/insights` | GET | Obtener insights por dominio o todos |
| `/api/knowledge` | GET/POST | Leer/escribir conocimiento en memoria |
| `/api/llm/analyze` | POST | Análisis directo de texto vía LLM |
| `/health` | GET | Estado de DB y LLM |

## Patrones reutilizables (para Zeitnus/ALRAC)

- Memoria por dominio con contexto temporal (estaciones, ciclos diarios)
- Orchestrator de dominios con integración y resolución de conflictos
- Episodic memory (registro de acciones, dominios, resultados)
- LLM como capa de enriquecimiento de dominio (no como sustituto de lógica)
- Endpoints REST estandarizados para agente regenerativo
