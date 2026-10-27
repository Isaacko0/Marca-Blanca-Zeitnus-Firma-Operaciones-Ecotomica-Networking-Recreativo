# Integración: Corpus Matemas IX–XIX ↔ HSCSG/ALRAC

**Fuente:** Vault Obsidian HSCSG (Isaac Ko) — Corpus_Matemas_IX-XIX ubanika cayapa.md  
**Autor:** Isaac Ko / Isaacko0  
**Licencia:** Contenido original del vault personal HSCSG (derechos de autor del autor; conceptos y arquitectura filosófica reimplementables, atribución obligatoria)  
**Estado:** Fase 1 de asimilación (documentación de integración)  
**Fecha:** 2026-10-25

## Resumen

El Corpus de Matemas IX–XIX es la síntesis filosófica y arquitectónica del sistema HSCSG v15 OS, fusionando Trueque TQ (ecoaldeas federadas), Canutriciotranshumanismo (CNTH), HSCSG, Proyecto ZEITNUS y el Manifiesto Cósmico de la Salvación Vecinal. Contiene matemas (sabiduría poética), subhashitas (apotegmas), apotegmas y códigas (códigos de conducta) organizados en 11 secciones.

Este documento mapea los conceptos filosóficos del corpus a las capas arquitectónicas ALRAC/HSCSG, sirviendo de base para la especificación OpenSpec correspondiente.

## Mapeo de conceptos a capas ALRAC/HSCSG

| Concepto del corpus | Contraparte HSCSG/ALRAC | Capa ALRAC | Fundamento arquitectónico |
|---|---|---|---|
| TQ como cinta métrica (1 TQ = 1 kWh = 3.6 MJ) | TQ Ledger Capa 1 contable-física | Capa 1 | Anclaje termodinámico inmutable, cero inflación |
| Prohibición cambiaria (membrana celular) | verifyTQProhibition + blockArbitrageAttempt | Capa 1 | TQ ≠ fiat/cripto, hard-coded en src/core/lib/tq.ts |
| Límite simétrico ±500 TQ | Límite de autonomía (AUT) | Capa 1 | Coeficiente de Autonomía, techo contra acaparamiento |
| Factor de Conversión = canasta básica | conversionFactor() con canasta 500 TQ | Capa 3 | Membrana fiat/ZEITNUS, no especulativa |
| DEX como traducción no traición | Puerta de comercio externo | Capa 3 | Bridge USDC / ReFi Nivel 3, anclado a canasta |
| Ledger = libro del abrazo (doble entrada, hash) | RAO append-only + TQ transacciones | Capa 1/2 | Procedencia, emisor, permiso, estado, revocación |
| NFC sin internet | Libreta de apuntes offline | Capa 2 | Soberanía de datos, funcionamiento sin conectividad |
| mTLS, Gossip, Ed25519 | Sistema inmune del santuario | Capa 2/5 | Criptografía como defensa contra censura |
| Asamblea con firma criptográfica | Gobernanza holónica 1a1v + CDS | Capa 5 | Consenso ponderado, veto Núcleo, comités rotativos |
| Cayapa como destrabajo ancestral | Protocolo de trabajo comunitario sin salario | Capa 4/5 | Antivirus contra plusvalía, pedagogía inmortal |
| Conuco como santuario adaptativo | Ecoaldea federada, territorio soberano | Capa 4/5 | Policultivo como sinergia, bahareque como OAD |
| ICC = evidencia × regeneración × memoria | Índice de Contribución Civilizatoria | Capa 0/5 | Métrica moral hecha auditable, no ranking de vanidad |
| Rituales de autotrofia (amanecer 1 kWh, día del cero) | Rituales de gobernanza y verificación | Capa 4/5 | Ritual como infraestructura del hábito |
| Resurrección de ancestros = infraestructura | Biblioteca viva, RAO inmutable | Capa 0/5 | Memoria colectiva como red de datos viva |
| Consciencia como ingeniería | Consciencia colectiva como institución que aprende | Capa 0/5 | IA sin valores vs inteligencia colectiva con dirección |
| Federación rizomática (no centro) | Holonic governance, subsidiaridad | Capa 5 | Nodos federados, voto con los pies, veto Núcleo |

## Reglas de negocio extraídas del corpus

1. **El TQ no es moneda, es medida:** 1 TQ = 1 kWh = 3.6 MJ. La energía no firma cheques sin fondos. Erradica la inflación de raíz.
2. **Prohibición cambiaria:** Lo que entra como valor físico nutre; lo que entra como especulación infecta. Implementada en código como verifyTQProhibition.
3. **Límite simétrico ±500:** Puedes recibir exactamente lo que estás dispuesto a devolver. Techo como anticuerpo contra el acaparamiento.
4. **Cayapa como destrabajo:** Existe antes del salario. El sol no cobra por calentar el barro; la cayapa no cobra por levantar la casa.
5. **Saldo cero como ética:** "Suma de saldos: cero. Suma de vínculos: incalculable." El día del cero verifica que nadie acumuló ni se ahogó.
6. **ICC como ontología:** Mide lo que dejas, no lo que tienes. Fórmula: ICC = evidencia × regeneración × memoria.
7. **Ritual como infraestructura:** Lo que la comunidad repite, la comunidad es. Ritual que no nutre es teatro.
8. **Resurrección como ingeniería:** Los muertos son nodos federados que nunca se desconectaron. Biblioteca viva presta abuelos.
9. **Consciencia como ingeniería:** Capacidad de comprender consecuencias. Firmware de la responsabilidad.
10. **Salvación vecinal:** El futuro se decide en la junta de barrio, no en la oficina. El ICC del terrícola promedio: cero contribuciones, infinitas quejas.

## Especificaciones OpenSpec sugeridas

- `alrac-corpus-matemas-ix-xix.md` — este documento de arquitectura filosófica
- `alrac-icc-spec.md` — especificación técnica del Índice de Contribución Civilizatoria (fórmula, verificación, trazabilidad)
- `alrac-tq-ledger-cayapa.md` — integración del TQ Ledger con el protocolo de cayapa como destrabajo (saldo cero, transacción en gesto)
- `alrac-rituales-autotrofia.md` — especificación de rituales de gobernanza (amanecer 1 kWh, asamblea de evidencia, día del cero)

## Referencias

- Fuente: Vault Obsidian HSCSG de Isaac Ko — `Corpus_Matemas_IX-XIX ubanika cayapa.md` (secciones IX a XIX)
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)
- Principio rector: "El código es territorio. La documentación es mapa. La verdad es el territorio." E=V.
