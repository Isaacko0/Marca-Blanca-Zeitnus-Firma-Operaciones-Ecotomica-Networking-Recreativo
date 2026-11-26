# Integración SASAC 2003 — ALRAC/Zeitnus

**Fuente asimilada:** `docs/gobierno-china-sasac-2003_backup.md` — Notificación del Consejo de Estado de China, 国辦發〔2003〕28号, 25 de abril de 2003.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`

**Estado:** Propuesta de arquitectura. Metadatos de primera página (título, número, fecha, destinatarios, SASAC como entidad aprobada).

**Mapeo isomórfico:**
- SASAC (Comisión de Supervisión y Administración de Bienes Estatales del Consejo de Estado) → Entidad de supervisión de activos estatales → `gobierno-china-sasac.ts`
- Oficina General del Consejo de Estado → Órgano de distribución de normativa → `gobierno-china-sasac.ts`
- Notificación oficial (通知) → Instrumento de distribución oficial → `gobierno-china-sasac.ts`
- 15 páginas, contenido sobre SASAC institución especial → Especificación pendiente de lectura completa

**Límites duros (boundaries.ts):**
- DENY: conversión automática de documentos chinos sin traducción verificada
- DENY: suposición de contenido de páginas no leídas (2-15)
- DENY: aplicación directa de normativa estatal china sin adaptación a ALRAC/Zeitnus

**Vasos comunicantes:** `gobierno-china-sasac.ts` ↔ `tq.ts` (TQ como unidad contable para supervisión), `caas.ts` (acceso por contribución)