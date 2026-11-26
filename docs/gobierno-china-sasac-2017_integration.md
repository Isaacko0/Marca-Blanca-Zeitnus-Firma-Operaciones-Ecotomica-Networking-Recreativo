# Integración SASAC 2017 — ALRAC/Zeitnus

**Fuente asimilada:** `docs/gobierno-china-sasac-2017_backup.md` — Notificación del Consejo de Estado de China, 国办发〔2017〕38号, 27 de abril de 2017.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`

**Estado:** Propuesta de arquitectura. Metadatos de primera página (título, número, fecha, destinatarios, cuerpo, SASAC como entidad emisora).

**Mapeo isomórfico:**
- SASAC (Comisión de Supervisión y Administración de Bienes Estatales) → Entidad de supervisión de activos estatales → `saac-supervision.ts` (Capa 5)
- Gestión basada en capital estatal (以管资本为主) → Modelo de supervisión por capital, no por operación directa → `capital-estatal-gestion.ts` (Capa 5)
- Oficina General del Consejo de Estado → Órgano de coordinación gubernamental → `consejo-estado-oficina.ts` (Capa 5)
- Notificación oficial (通知) → Instrumento de comunicación oficial → `notificacion-oficial.ts` (Capa 4)
- 14 páginas, contenido sobre reforma de funciones → Especificación pendiente de lectura completa

**Límites duros (boundaries.ts):**
- DENY: conversión automática de documentos chinos sin traducción verificada
- DENY: suposición de contenido de páginas no leídas (2-14)
- DENY: aplicación directa de normativa estatal china sin adaptación a ALRAC/Zeitnus

**Vasos comunicantes:** `saac-supervision.ts` ↔ `tq.ts` (TQ como unidad contable para supervisión), `caas.ts` (acceso por contribución)
