# Backup Local — Trueque Descentralizado / Matchmaking de Productos y Servicios

**Fuente:** Conversación WhatsApp Isaac Flores ↔ Pepe Sevilla + documento adjunto (27/10/2026)  
**Autor:** Isaac Flores / Pepe Sevilla (contenido de chat + artículo sobre trueque, kibutzim y Red Global de Trueque)  
**Licencia:** Contenido de conversación privada + artículo informativo; conceptos y arquitectura reimplementables, atribución a los autores, no copia literal de código de terceros  
**Fecha de backup:** 2026-10-28  
**Estado:** Propuesta de plataforma de trueque descentralizado (matchmaking/Tinder de productos y servicios) con análisis de kibutzim, Red Global de Trueque (RGT) y algoritmos de matching multilateral

## Estructura del documento (backup de referencia)

```
Trueque Descentralizado — Matchmaking de Productos y Servicios
├── Conversación WhatsApp (Isaac Flores ↔ Pepe Sevilla, 27/10/2026)
│   ├── Isaac pide info de personas del KIBBUTZ y experiencia con trueque
│   ├── Pepe responde sobre experiencia kibutz y trueque descentralizado
│   ├── Isaac define: trueque descentralizado que no involucre solo 2 personas
│   └── Isaac propone nombre técnico: Matchmaking o "Tinder de productos y servicios"
├── Documento anexo (análisis técnico y experiencias)
│   ├── Experiencia de los kibutzim (propiedad común, registro central, distribución por necesidades)
│   ├── Problema del trueque: doble coincidencia de necesidades (double coincidence of wants)
│   ├── Soluciones de plataformas: ciclos multilateral, crédito mutuo, cadena con semilla, blockchain + reputación
│   ├── Red Global de Trueque (RGT) Argentina: créditos mutuos, dotación inicial 50 créditos, depreciación 12% anual, colapso 1999-2002
│   ├── Algoritmo de matchmaking: match 2 → ciclos 3 → crédito mutuo → cadenas más largas
│   └── Lecciones para plataforma: emitir contra valor real, limitar saldo, auditoría, depreciación, empezar pequeño
└── Reglas para plataforma de trueque
    ├── Confianza y reputación
    ├── Registro común (libro contable, créditos internos)
    ├── Masa crítica local (barrio, gremio, universidad)
    └── Créditos solo contra valor real entregado
```

## Conceptos clave identificados

| Concepto | Descripción | Relevancia para HSCSG/ALRAC |
|---|---|---|
| Doble coincidencia de necesidades | El trueque bilateral requiere que A tenga lo que B quiere y viceversa al mismo tiempo | El TQ y el crédito mutuo resuelven esto sin necesidad de coincidencia exacta |
| Trueque multilateral por ciclos | A→B, B→C, C→A (ciclos de 3 o más) | Isomorfo a flujos de contribución en red CaaS y TQ |
| Crédito mutuo / moneda comunitaria | Unidad interna de cuenta gastable con cualquier miembro | Análogo a TQ (1 TQ = 1 kWh) y a ZNU |
| Cadena con semilla | Alguien aporta sin recibir de inmediato, inicia cadena beneficiaria | Análogo a estaking inicial y a crédito social |
| Blockchain + reputación | Registro verificable de ofertas, matching y acuerdos | Análogo a RAO (append-only) + Boundaries.failClosed() |
| Depreciación de créditos (12% anual, RGT) | Desincentiva el ahorro, favorece circulación | Análogo a VitalTime decay y a límites de saldo ±500 TQ |
| Colapso RGT (1999-2002) | Emisión sin control → hiperinflación interna (hasta 166x en huevos) | Advertencia contra emisión sin respaldo en valor real |
| Masa crítica local | Empezar en comunidad/barrio/gremio antes de expandir | Principio anfibio: nodo piloto antes de federación |

## Notas de derechos de autor

Contenido de conversación privada + artículo informativo sobre experiencias históricas (kibutzim, RGT Argentina). No es software bajo licencia de terceros. Los conceptos, análisis y arquitectura propuesta son reimplementables. Atribución obligatoria a Isaac Flores y Pepe Sevilla por la conversación y al autor del documento anexo. No se copia texto literal extenso sin atribución.
