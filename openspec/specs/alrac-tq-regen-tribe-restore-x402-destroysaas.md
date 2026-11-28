// openspec/specs/alrac-tq-regen-tribe-restore-x402-destroysaas.md
// OpenSpec: Regen Tribe — x402 + DestroySaaS + Economía Regenerativa (ALRAC/Zeitnus)
// Estado: Propuesta — TypeScript puro, síntesis de chat de Telegram (no código fuente)
// Fuente: docs/regen-tribe-restore-x402-destroysaas_backup.md

# SPEC: alrac-tq-regen-tribe-restore-x402-destroysaas
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — síntesis de chat de Telegram (Regen Tribe, Ian Tairea / genesis_zero_bot)
**Source:** Telegram REGEN Tribe collective network (10/03/2026 en adelante)

**Dominio:** Ingresos regenerativos, pagos agente-a-agente (x402), propiedad colectiva de software (DestroySaaS), clasificación de valor parasitario/esencial, metodología Pareto de actividades regenerativas, canales de comunicación soberanos.

**Conceptos clave:**

1. x402 — protocolo HTTP 402 para pagos máquina-a-máquina (USDC en Base/Solana/Polygon), pago por request, liquidación atómica, escrow para trabajos asíncronos, división de pagos, enrutamiento multi-cadena
2. DestroySaaS — propiedad colectiva de infraestructura de software, umbral $1K/mes → celda, competencia vía MVP, gobernanza LCA, comisión 5-10%
3. Clasificación S&P 500 — actividades parasitarias (~47%) vs esenciales (~53%), prioridades de aniquilación por tiers
4. Análisis del dinero — propiedades parasitarias a cortar (interés, deuda, especulación, inflación, crecimiento compuesto, control centralizado, privacidad inexistente, reserva fraccional) vs funciones útiles a conservar (unidad de cuenta, reserva de valor, medio de intercambio, portabilidad, escasez artificial)
5. Metodología Pareto — 7 dimensiones ponderadas (alineación regenerativa 30%, ingreso 25%, accesibilidad 15%, tiempo 10%, costo inicio 10%, escalabilidad 10%), cuadrantes GOLD/SILVER/BRONZE/CUT
6. Canales de comunicación — matriz de vigilancia/extracción de atención/cifrado/federación (Signal, Matrix, Nostr, Mastodon, Bluesky, Telegram, Discord, Instagram/TikTok/Facebook)
7. Economía de resistencia — sobreproducción, zero-copy en propiedad de tierra, activos comunitarios que crecen sin intervención, KPIs de abundancia

**Mapeo isomórfico ALRAC/Zeitnus:**

- x402 pago por request → medio de intercambio sin intermediación financiera (capa de pago atómico)
- DestroySaaS celda/propiedad colectiva → cooperativa de producción (COS), acceso por contribución (CaaS)
- Actividad parasitaria/esencial → clasificación de valor por alineación regenerativa
- Propiedades del dinero → unidad de cuenta/medio de intercambio/reserva de valor sin emisión de deuda
- Metodología Pareto → motor de decisión de actividades de ingreso regenerativo
- Canales de comunicación → capa de comunicación soberana, sin extracción de atención
- Economía de resistencia → red de intercambio federada, ZNU anfibia bajo presión externa

**Límites duros (boundaries.ts):**

- DENY: trabajo asalariado como única forma de organización económica
- DENY: valor de mercado como única unidad de contabilidad (TQ es alternativa)
- DENY: propiedad privada de medios de producción como modelo por defecto
- DENY: interés compuesto y creación de deuda como motor del sistema monetario interno
- DENY: extracción de atención como modelo de negocio en canales de comunicación

**Interfaces de integración (TypeScript puro, sin nuevas dependencias npm):**

- `regen-tribe-x402-restore.ts`: capa de pago por request, liquidación atómica, sin depender de facilitadores externos
- `regen-tribe-pareto.ts`: puntuación ponderada de actividades regenerativas con clasificación por cuadrantes
- `regen-tribe-money.ts`: funciones del dinero (unidad de cuenta, medio de intercambio, reserva de valor) sin emisión de deuda
- `regen-tribe-comms.ts`: inventario de canales de comunicación con nivel de extracción y vigilancia
- `cos-cooperativa.ts`: modelo de propiedad colectiva y acceso por contribución (vínculo con DestroySaaS)

**Limitación:** Síntesis conceptual basada en lectura del archivo de exportación local (~24.959 líneas). No se reproduce literalmente extensos pasajes del chat. Cifras citadas en el canal son de referencia, no auditadas empíricamente.
