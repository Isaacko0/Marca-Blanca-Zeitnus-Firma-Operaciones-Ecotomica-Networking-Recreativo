# Backup Local — brief-ku (Adytm404)

**Fuente:** https://github.com/Adytm404/brief-ku  
**Autor:** Adytm404  
**Licencia:** NO hay archivo LICENSE en el repositorio (sin licencia explícita → conceptos y arquitectura reimplementables libres; no se copia texto ni código literal sin aislamiento explícito)  
**Fecha de backup:** 2026-10-25  
**Estado:** Skill de agente IA que convierte ideas de aplicación vagas o cortas en especificaciones listas para implementar

## Estructura del repositorio (backup de referencia)

```
brief-ku/
├── README.md    # 171 líneas (115 loc) · 6.7 KB
└── SKILL.md     # 2332 líneas (1665 loc) · 61 KB
```

## Metadatos del repositorio

- **Rama:** main (1 rama, 0 etiquetas)
- **Commits:** 6
- **Último commit:** f3dff1c — "feat: add adaptive discovery route checks and TDD" (Sep 8, 2026)
- **Autor del commit:** Adytm404
- **Stars:** 0 | **Watchers:** 0 | **Forks:** 0

## Comando de instalación

```bash
npx skills add Adytm404/skills --skill brief-ku
```

> Luego seleccionar el agente de IA cuando se solicite y reiniciar el agente para que detecte la skill.

## Funcionalidad principal (resumen)

brief-ku es una skill para agentes de IA (OpenCode, Codex, Claude Code, Cursor y otros compatibles con SKILL.md) que:

1. Entiende el propósito de la aplicación a partir de una idea corta o vaga.
2. Aclara requisitos importantes mediante preguntas interactivas adaptivas.
3. Recomienda una pila tecnológica adecuada.
4. Genera el PRD (Documento de Requisitos del Producto) y la especificación técnica.
5. Produce un plan de implementación listo para un agente de código.

## Características clave del skill

- **Cinco etapas:** entender → aclarar → recomendar arquitectura → generar especificaciones → preparar plan de desarrollo.
- **Detección de modo de ejecución:** Plan mode vs Build mode (según el agente host: OpenCode, Codex, Claude Code, Cursor).
- **Preguntas adaptivas multi-ronda:** fundación → checkpoint de planificación → forma del producto → detalles condicionales.
- **Verificación de accesibilidad de rutas:** inventario de rutas, matriz de acceso, matriz de verificación.
- **TDD obligatorio en Build mode:** ciclo RED → GREEN → pruebas de regresión en rebanadas verticales pequeñas.
- **Modelo de estado de requisitos:** KNOWN / ASSUMED / UNKNOWN / NOT_REQUIRED.
- **Manejo de "No sé":** permitir respuestas como "bebas", "terserah", "tidak tahu", "rekomendasikan", "pilihkan".
- **Idioma no técnico para preguntas:** explicar conceptos técnicos después de introducirlos.

## Notas de licencia

- No hay archivo LICENSE en el repositorio.
- Sin licencia explícita → se respetan los derechos de autor del autor (Adytm404).
- Solo se documentan conceptos, arquitectura y patrones; no se copia texto ni código literal del SKILL.md sin atribución explícita y aislamiento si corresponde.
