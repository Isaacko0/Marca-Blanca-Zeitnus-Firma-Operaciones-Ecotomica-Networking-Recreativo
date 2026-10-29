# Integración: brief-ku ↔ HSCSG/ALRAC

**Fuente:** https://github.com/Adytm404/brief-ku (Adytm404)  
**Licencia:** Sin archivo LICENSE (sin licencia explícita; conceptos y arquitectura reimplementables, no copia literal)  
**Estado:** Fase 1 de asimilación (documentación de integración)  
**Fecha:** 2026-10-25

## Resumen

brief-ku es una skill para agentes de IA que convierte ideas de aplicación cortas o vagas en especificaciones completas listas para implementar (PRD, arquitectura, esquema de base de datos, especificación de API, autenticación, autorización, flujos de usuario, criterios de aceptación, casos límite, fases de desarrollo, tareas de implementación, trazabilidad de requisitos, requisitos de ciclo de vida de datos y operaciones en producción).

Esta skill se integra al marco HSCSG v15 OS como una **herramienta de especificación soberana** que alimenta al ciclo de desarrollo de Zeitnus/ALRAC, sin copia literal de código (no hay LICENSE explícito).

## Patrones identificados y mapeo a HSCSG/ALRAC

| Patrón brief-ku | Contraparte HSCSG/ALRAC | Capa ALRAC | Observación |
|---|---|---|---|
| Skill que convierte idea vaga en especificación | Generador de especificaciones OpenSpec | Capa 0 (AMID epistémica) | Isomorfo a la conversión de idea → especificación viviente |
| 5 etapas (entender→aclarar→recomendar→generar→planificar) | Ciclo de vida de especificación HSCSG | Capa 0 | Cada etapa = paso del ciclo de diseño soberano |
| Detección Plan mode / Build mode | Detección de modo de operación del nodo | Infraestructura | Nodo opera en modo planificación o implementación |
| Preguntas adaptivas multi-ronda | Descubrimiento de requisitos progresivo | Capa 0 | Cada ronda = verificación triaxial de requisitos |
| Modelo de estado (KNOWN/ASSUMED/UNKNOWN/NOT_REQUIRED) | Triaxial verificación (Mental/Sim/Lab) | Capa 0 | Estado de cada requisito verificado triaxialmente |
| Verificación de accesibilidad de rutas | Boundaries.failClosed() para rutas | Capa 2 | Cada ruta verificada contra registro, acceso, render, dependencias |
| TDD obligatorio (RED→GREEN→regresión) | LoopEngine γ-CARMIS tick | Capa 0 | Cada implementación = tick con verificación |
| Defaults (Web, Full functional, PostgreSQL, RBAC, REST) | Defaults anfibios HSCSG | Capa 3 | Defaults postmonetarios o conectados según modo |
| "No sé" → recomendación sensata | Principio de decisión soberana | Capa 5 | El operador soberano decide cuando hay ambigüedad |

## Especificaciones OpenSpec sugeridas

- `alrac-brief-ku-integration.md` — mapeo de la skill brief-ku al ciclo de especificaciones HSCSG/ALRAC
- `alrac-spec-generation-pipeline.md` — espec para pipeline de generación de especificaciones desde ideas vagas
- `alrac-route-verification.md` — espec para verificación de accesibilidad de rutas en el marco HSCSG

## Reglas de negocio identificadas

1. **No generar PRD completo antes de entender el producto** — requiere aclaración de requisitos críticos primero (análogo a Boundaries.failClosed(): no implementar sin límites verificados).
2. **Preguntas progresivas, no todo de una vez** — descubrimiento iterativo, cada ronda desbloquea la siguiente decisión arquitectónica.
3. **No técnico para preguntas, técnico internamente** — la interfaz con el usuario es en lenguaje sencillo; internamente se traducen a requisitos técnicos.
4. **Defaults cuando el usuario no sabe** — pero sin forzar decisiones técnicas que el usuario no entienda.
5. **TDD obligatorio en implementación** — ciclo RED → GREEN → pruebas de regresión antes de pasar al siguiente comportamiento.
6. **Verificación de cada ruta** — inventario completo, matriz de acceso por rol, matriz de verificación, excepciones documentadas.

## Referencias

- Repo: https://github.com/Adytm404/brief-ku (sin LICENSE explícito)
- SKILL.md: https://github.com/Adytm404/brief-ku/blob/main/SKILL.md
- README: https://github.com/Adytm404/brief-ku/blob/main/README.md
- Fuente original: https://github.com/Adytm404/skills

## Principio rector

El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
