# MuMuAINovel — Backup Original

**Fuente**: https://github.com/xiamuceer-j/MuMuAINovel
**Versión**: v1.5.5
**Licencia**: GPL-3.0
**Stack**: Python 3.12 + FastAPI + React 18.3 + TypeScript 37.8%

## Descripción original
Asistente inteligente de creación de novelas con AI. Genera capítulos, gestiona proyectos, outline, y proporciona herramientas para escritura asistida con LLMs.

## Estructura clave
- `backend/` — FastAPI, endpoints para capítulos, memorias, outlines, proyectos
- `frontend/` — React + TypeScript UI
- `docker-compose.yml` — deployment completo

## Funcionalidades principales
1. Gestión de novelas/proyectos
2. Generación de outlines (5 páginas por defecto)
3. Escritura de capítulos con asistencia AI
4. Sistema de memorias (ChromaDB + embeddings)
5. Exportación multi-formato
6. Instalación Termux (Android)

## API endpoints
- `/api/projects` — CRUD proyectos
- `/api/chapters` — generación de capítulos
- `/api/outlines` — generación de outlines
- `/api/memories` — memoria semántica
