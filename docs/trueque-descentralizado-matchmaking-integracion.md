# Integración: Trueque Descentralizado / Matchmaking ↔ HSCSG/ALRAC

**Fuente:** Conversación WhatsApp Isaac Flores ↔ Pepe Sevilla + documento anexo sobre trueque descentralizado, kibutzim y Red Global de Trueque (27/10/2026)  
**Autor:** Isaac Flores / Pepe Sevilla  
**Licencia:** Contenido de conversación privada + artículo informativo; conceptos y arquitectura reimplementables, atribución obligatoria  
**Estado:** Fase 1 de asimilación (documentación de integración)  
**Fecha:** 2026-10-28

## Resumen

El documento analiza el trueque descentralizado como problema de matchmaking multilateral ("Tinder de productos y servicios") y extrae lecciones de dos experiencias históricas: los kibutzim (propiedad común, registro central, distribución por necesidades) y la Red Global de Trueque (RGT) Argentina (créditos mutuos, dotación inicial, depreciación, colapso por emisión descontrolada).

El núcleo del problema es la **doble coincidencia de necesidades**: el trueque bilateral falla porque requiere que A tenga lo que B quiere y B tenga lo que A quiere al mismo tiempo. Las soluciones analizadas son: ciclos multilateral (A→B→C→A), crédito mutuo/moneda comunitaria, cadenas con semilla, y blockchain + reputación.

Este documento mapea esos conceptos a las capas arquitectónicas ALRAC/HSCSG, donde el TQ Ledger, el CaaS, el RAO y el ICC ya implementan gran parte de esta lógica de forma técnica y verificable.

## Mapeo de conceptos a capas ALRAC/HSCSG

| Concepto del documento | Contraparte HSCSG/ALRAC | Capa ALRAC | Fundamento arquitectónico |
|---|---|---|---|
| Doble coincidencia de necesidades | TQ Ledger elimina necesidad de coincidencia exacta | Capa 1 | 1 TQ = 1 kWh, medida inmutable, no requiere contraparte directa |
| Crédito mutuo / moneda comunitaria | TQ + ZNU + CaaS revenue streams | Capa 1 / Capa 3 | Crédito social interno, cuenta comunitaria, emisión controlada |
| Trueque multilateral por ciclos | Flujos CaaS multirecíprocos, revenue split | Capa 2 | ValueFlows, contribución verificable, reparto Amid |
| Cadena con semilla | Staking inicial ZNU, apuesta por creencia | Capa 3 | Stake ZNU como crédito social inicial |
| Blockchain + reputación | RAO append-only + verificación triaxial | Capa 0 / Capa 2 | Procedencia, emisor, permiso, estado, revocación |
| Depreciación de créditos (12% anual) | VitalTime decay, límites de saldo ±500 TQ | Capa 1 | Desincentiva acumulación, favorece circulación |
| Colapso RGT por emisión sin control | verifyTQProhibition + blockArbitrageAttempt | Capa 1 | TQ ≠ fiat/cripto, emisión solo contra valor real |
| Masa crítica local | Nodo piloto, comunidad, gremio, universidad | Capa 5 | Principio anfibio: nodo autónomo antes de federación |
| Matchmaking como Tinder de productos | Mapa de ofertas y necesidades, grafo de intercambio | Capa 4 | Panel lateral NeuroArchitecture, búsqueda en tiempo real |
| Confianza y reputación | CDS (Cálculo de Confianza), verificación triaxial | Capa 0 / Capa 5 | Gobernanza holónica, reputación verificable |

## Reglas de negocio extraídas del documento

1. **El trueque bilateral falla por doble coincidencia** → El TQ y el crédito mutuo rompen este requisito permitiendo intermediación por valor común.
2. **Los créditos deben emitirse solo contra valor real entregado** → `verifyTQProhibition` y `blockArbitrageAttempt` en `src/core/lib/tq.ts` impiden emisión sin respaldo.
3. **Limitar saldo negativo y positivo de cada usuario** → Límite ±500 TQ en `TQAccount.balance`, Coeficiente de Autonomía.
4. **Registrar cada transacción de forma auditable** → RAO append-only, `TQTransaction` con `raoCredentialId`, verificación triaxial (mental/simulación/laboratorio).
5. **Usar depreciación suave o vencimiento para evitar acumulación especulativa** → `VitalTime` decay, límites de cuenta, expiración de créditos.
6. **Separar valor de referencia y emisión** → TQ como unidad contable (1 kWh), ZNU indexado a canasta, no emitir sin respaldo en bienes/servicios.
7. **Empezar en comunidad pequeña antes de expandir** → Nodo piloto, federación progresiva, subsidiariedad.

## Especificaciones OpenSpec sugeridas

- `alrac-trueque-matchmaking.md` — este documento de arquitectura
- `alrac-trueque-algoritmo-matchmaking.md` — algoritmo de ciclos, cadenas y crédito mutuo para matchmaking multilateral
- `alrac-trueque-creditos-mutuos.md` — especificación de créditos internos, dotación inicial, depreciación, límites de saldo
- `alrac-trueque-kibutz-rgt.md` — lecciones de kibutzim y RGT aplicadas a gobernanza y emisión de créditos

## Referencias

- Conversación WhatsApp Isaac Flores ↔ Pepe Sevilla, 27/10/2026 (contenido pegado)
- Documento anexo sobre kibutzim, RGT, double coincidence of wants, matchmaking multilateral
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)
- Principio rector: "El código es territorio. La documentación es mapa. La verdad es el territorio." E=V.
