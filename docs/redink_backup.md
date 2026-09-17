# RedInk — Backup Original

**Fuente**: https://github.com/HisMax/RedInk
**Versión**: v1.4.1
**Licencia**: CC BY-NC-SA 4.0 (con opción comercial)
**Stack**: Python 3.11 + Flask + Vue 3 + TypeScript

## Descripción original
Generador de imágenes y texto para Xiaohongshu (Red). A partir de una frase, genera outline, cover page y páginas de contenido con estilo consistente usando Gemini/Nano Banana Pro.

## Estructura clave
- `backend/` — Flask, generadores multi-proveedor (OpenAI compatible, Gemini)
- `frontend/` — Vue 3 UI
- `docker/` — deployment
- `scripts/` — start scripts multi-plataforma

## Funcionalidades principales
1. Generación de outline inteligente (5 páginas default)
2. Cover page generation con estilo personalizado
3. Batch content generation (hasta 15 concurrentes)
4. Proveedores de texto y imagen configurables
5. Historial con exportación ZIP
6. Content copy (título, cuerpo, tags)

## API endpoints
- `/api/generate` — generación completa
- `/api/outline` — solo outline
- `/api/image` — generación de imagen
- `/api/content` — generación de texto
- `/api/history` — historial de generaciones
