# Spec OpenSpec: Integración brief-ku → HSCSG/ALRAC

**Estado:** borrador de integración  
**Licencia:** Sin archivo LICENSE en el origen (conceptos y arquitectura reimplementables; no copia literal)  
**Fuente:** https://github.com/Adytm404/brief-ku (Adytm404)  
**Atribución:** Adytm404 — brief-ku skill

## 1. ¿Qué es brief-ku?

Skill para agentes de IA (formato SKILL.md) que convierte ideas de aplicación cortas o vagas en especificaciones completas listas para implementar. Incluye: PRD, recomendación de arquitectura y tecnología, esquema de base de datos, especificación de API, requisitos de autenticación/autorización/seguridad, flujos de usuario, criterios de aceptación, casos límite, fases de desarrollo, tareas de implementación, trazabilidad de requisitos y requisitos de ciclo de vida de datos y operaciones en producción.

Instalación: `npx skills add Adytm404/skills --skill brief-ku`

## 2. Cinco etapas del skill (mapeo a HSCSG/ALRAC)

| Etapa brief-ku | Contraparte HSCSG/ALRAC | Capa ALRAC | Descripción |
|---|---|---|---|
| 1. Entender la idea | Descubrimiento de requisitos | Capa 0 | Comprender el propósito de la aplicación |
| 2. Aclarar requisitos críticos | Verificación triaxial de límites | Capa 0 | Preguntas interactivas antes de especificar |
| 3. Recomendar arquitectura y tecnología | Selección de stack anfibio | Capa 2-3 | Stack según requisitos, no por defecto ciego |
| 4. Generar especificaciones | Generación OpenSpec viviente | Capa 0 | PRD + espec técnica + plan de implementación |
| 5. Preparar plan de desarrollo | Plan de ciclo de desarrollo | Capa 4 | Fases, tareas, hitos, verificación |

## 3. Modos de ejecución

### Plan Mode
- Descubrimiento de requisitos y resolución de ambigüedades críticas.
- Produce PRD, especificación técnica y plan de implementación.
- **No edita archivos de aplicación** ni ejecuta comandos destructivos.
- No evade restriciones de solo-lectura.
- Al terminar, pregunta al usuario si quiere cambiar a Build mode.

### Build Mode
- Completa descubrimiento y planificación suficientes para implementar de forma segura.
- Continúa directamente a la implementación sin otra confirmación.
- Ejecuta cambios de código, migraciones, verificación y pruebas relevantes.
- Pide al usuario solo cuando hay ambigüedad crítica, autorización externa, secreto, operación irreversible o dependencia no disponible.

### Unknown Mode
- Si no hay señal confiable de modo y la intención del usuario no está clara, pregunta:
  - "¿Qué debe suceder después de que la especificación esté lista?"
  - Opción 1: Plan y construir (recomendado)
  - Opción 2: Solo plan

## 4. Descubrimiento de requisitos (rondas adaptivas)

### Ronda 1 — Fundación
2-3 decisiones independientes que establecen dirección:
- Alcance de la aplicación: solo UI/prototipo o completamente funcional
- Plataforma: web, móvil, escritorio, solo API, etc.
- Nivel de entrega (si no se infiere): Prototipo, MVP, Producción-ready, Empresarial

### Checkpoint de planificación
Tras recibir respuestas de Ronda 1:
1. Actualizar el estado de requisitos.
2. Resumir la dirección seleccionada en 1-3 oraciones.
3. Identificar qué decisiones de producto o arquitectura importan ahora.
4. Preparar las siguientes preguntas desde esas dependencias.

### Ronda 2 — Forma del producto
2-5 preguntas adaptivas según Ronda 1:
- Usuarios objetivo y roles
- Flujo principal y características P0
- Comportamiento de cuenta y login
- Datos que deben persistir
- Reglas de negocio específicas

Si se seleccionó UI/prototipo: enfocar en páginas, interacciones, datos simulados, dirección visual, objetivos responsivos. No preguntar sobre backend salvo que el prototipo deba representarlo.

### Ronda 3+ — Detalle condicional
Después de cada conjunto de respuestas, actualizar estado y preguntar otra ronda solo si queda ambigüedad material:
- Pagos
- GPS, cámara, biometría, acceso nativo al dispositivo
- Integraciones de terceros
- Almacenamiento de archivos
- Multi-inquilino
- Ciclo de vida de datos sensibles
- Restricciones de despliegue
- Escala o requisitos de cumplimiento

## 5. Modelo de estado de requisitos

Internamente clasificar requisitos importantes como:
- `KNOWN` — conocido y confirmado
- `ASSUMED` — asumido (documentar la suposición)
- `UNKNOWN` — desconocido (requiere aclaración)
- `NOT_REQUIRED` — no requerido

## 6. Verificación de accesibilidad de rutas (para apps web y APIs)

Crear inventario completo de rutas y verificar cada una en capas aplicables:

| Capa de verificación | Qué verificar |
|---|---|
| Registro de ruta | La ruta está registrada y tiene resultado HTTP esperado |
| Acceso por actor | Invitado, autenticado, sesión deshabilitada, rol específico |
| Render de página | Detección de errores de cliente |
| Navegación | Menús, enlaces, botones, navegación programática |
| Dependencias de datos | API, loader, server-action, dependencias de datos |
| Parámetros dinámicos | Registros faltantes, registros no autorizados |
| Límites de error | Error boundaries, navegación responsiva |
| Excepciones | Excepciones documentadas |

"Accesible" significa que la ruta produce su resultado definido para el actor actual. Un redireccionamiento de invitado a `/login`, un `403` esperado o un `404` documentado son resultados válidos. No significa que toda ruta devuelva `200` para todo usuario.

Especificaciones detalladas incluyen: Route Inventory, Route Access Matrix, Route Verification Matrix, excepciones documentadas.

## 7. TDD obligatorio en Build mode

Ciclo en rebanadas verticales pequeñas cuando hay herramientas de prueba disponibles:

```
Escribir una prueba de comportamiento que falle
Ejecutarla y confirmar RED
Escribir la implementación mínima
Ejecutarla y confirmar GREEN
Ejecutar pruebas de regresión relevantes
Continuar con el siguiente comportamiento
```

Las pruebas apuntan a costuras públicas: páginas del navegador, APIs HTTP, servicios públicos, restricciones de base de datos. No afirmar RED, GREEN o cobertura pasando sin ejecutar el comando correspondiente. Las verificaciones bloqueadas se reportan como `NOT_RUN` con el motivo concreto.

## 8. Defaults (usar solo cuando el usuario no provee preferencia y la elección no es crítica para el negocio)

| Elemento | Default |
|---|---|
| Plataforma | Aplicación web |
| Modo de entrega | Completamente funcional |
| UI | Responsiva |
| Arquitectura | Full stack |
| Base de datos | PostgreSQL |
| Autenticación | Email y contraseña |
| Autorización | RBAC cuando existen múltiples tipos de usuario |
| Estilo de API | REST |
| Despliegue | Cloud/VPS moderno |
| Línea base de seguridad | Prácticas comunes de seguridad web lista para producción |
| Zona horaria | Almacenar marcas de tiempo de forma consistente y definir zona horaria de negocio explícita |

No aplicar un default ciegamente cuando el entorno de despliegue o los requisitos de la aplicación sugieran una mejor opción.

## 9. Reglas de prioridad de instrucciones (cuando hay conflicto)

1. Instrucciones del sistema y restricciones nativas del host
2. Alcance y restricciones explícitos del usuario
3. Convenciones y arquitectura del proyecto existente
4. Requisitos confirmados
5. Suposiciones documentadas
6. Defaults de esta skill

Nunca reemplazar el stack o convenciones de un proyecto existente meramente porque esta skill tenga un default diferente.

## 9. Reglas "Never" (críticas)

- No abrumar a principiantes con jerga innecesaria.
- No evadir Plan mode, restricciones de solo-lectura, puertas de aprobación o permisos nativos del host.
- No detenerse tras presentar un plan en Build mode cuando se solicita implementación y no hay bloqueador.
- No afirmar que todas las rutas son accesibles sin un inventario completo de rutas y resultados de verificación registrados.
- No afirmar RED, GREEN o pruebas pasando cuando el comando correspondiente no se ejecutó con éxito.
- No pedir al usuario que elija tecnologías que no entiende cuando se puede hacer una recomendación segura.
- No inventar reglas de negocio críticas sin decirlo.
- No tratar botones ocultos del frontend como autorización.
- No almacenar contraseñas en texto plano.
- No codificar secretos (hardcode secrets).
- No exponer errores internos sensibles.
- No generar un PRD gigante antes de entender el producto real.
- No sobre-ingeniar aplicaciones simples.
- No asumir aplicación nativa móvil cuando el usuario no la solicitó.
- No afirmar que un prototipo es completamente funcional.

## 10. Referencias

- https://github.com/Adytm404/brief-ku (sin LICENSE explícito)
- https://github.com/Adytm404/brief-ku/blob/main/SKILL.md
- https://github.com/Adytm404/brief-ku/blob/main/README.md
- Fuente original: https://github.com/Adytm404/skills

**Principio rector:** El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
