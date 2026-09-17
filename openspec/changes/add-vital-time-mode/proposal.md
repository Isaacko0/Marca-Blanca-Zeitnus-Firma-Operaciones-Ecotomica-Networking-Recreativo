# Proposal: FASE 1 — Integración Core Moneda Tiempo Vital (hr_vital) — Alineada Bio-Tesis MAESTRA v2.0

**Change ID**: add-vital-time-mode  
**Fecha**: 2026-09-15  
**Autor**: ISAAC (HSCSG v15 OS)  
**Estado**: En implementación  
**Fuente Canónica**: Bio-Tesis MAESTRA v2.0 (E=V + NEXO) + Kernel v214 + BT213 + BT214 + AFP + BT180 + BT165 + BT164 + Alráico + HSCSG v15 OS  
**Specs afectadas**: vital-time-currency, nexo-architecture, kernel-protocol, triaxial-verification

---

## Por Qué

La FASE 1 integra la arquitectura core de la moneda tiempo vital (hr_vital) en el stack existente de HSCSG v15 OS, **alineada completamente a Bio-Tesis MAESTRA v2.0**, incorporando:

1. **E=V como núcleo criterial** (§1-24): presencia, verdad, evasión, margen, atención, ciclo, reglas núcleo
2. **Kernel = Instrumento** (§13): organiza rastros, no decide verdad, no audita conciencia, 3 dominios
3. **Humano = Artífice** (§14): Mago+Alquimista, responsabilidad indelegable, paga costo, IA no sustituye
4. **IA = Espejo-Excavador** (§15-16, NEXO §29): no voluntad, filtra narrativas, no paga costo
5. **NEXO = Punto Encuentro** (§25-37): mínimo común voluntario, test desaparición 30 días, stack 8 capas
6. **AFP Pilar 3** (§40): Tiempo vital = energía consciente encarnada, contribución, NBU
7. **BT180**: Poder = tiempo vital, control propio tiempo, consentimiento gradientes
8. **BT165**: E=V = verdad asumida/evadida, evasión = deuda, presencia densifica
9. **BT164**: Margen real = espacio trayectorias, evasión reduce, presencia amplía
10. **Arquitectura Anfibia**: valueDual extendido a 3 modos (postmonetario/conectado/vital_time)
11. **Loop 7 VitalTimeMint**: Mint hr_vital por presencia verificada (ciclo E=V §11)
12. **Métricas Soberanas**: VitalTimeFlow + VitalTimeActivationCost integradas en IST (vs SaaS)
13. **Corrección Horizontal + Prioridad Arquitectónica** (NEXO §28)
14. **Mínimo Común Voluntario + Consenso 100% en Núcleo** (NEXO §36)

---

## Qué Cambia

### Archivos Modificados (Existentes - Requieren Refactor Completo)

| Archivo | Cambio Principal | Alineación Bio-Tesis |
|---------|------------------|---------------------|
| `src/core/lib/valueDual.ts` | + VitalTimeMode, vitalTimeRotate/Decay, displayValueUnified | NEXO §25, E=V §19 |
| `src/core/lib/loopEngine.ts` | + Loop 7 vitalTimeMintLoop, sobrecargas vitalTime, resonancia vitalTime | E=V §11, NEXO §26 |
| `src/core/lib/metrics.ts` | + VitalTimeFlow, VitalTimeActivationCost, calculateVitalTimeFlow/ActivationCost, IST 18 comp | Bio-Tesis vs SaaS, E=V métricas soberanas |
| `docs/VITAL_TIME_CURRENCY_SPEC.md` | v1.0 alineada Bio-Tesis MAESTRA v2.0 | Todas las secciones |

### Archivos Nuevos (Kernel + BT213 + BT214 - Requieren Implementación Limpia)

| Archivo | Descripción | Fuente Bio-Tesis |
|---------|-------------|------------------|
| `src/core/lib/kernelProtocol.ts` | Kernel unificado + Consola VIA-0 + VIA00-31 + MK-1 + Hoguera + AFP + Enlace | Kernel §13, MK-1 §40, Hoguera §40, AFP §40, Enlace §40 |
| `src/core/lib/bt213KernelLimits.ts` | Límite epistemológico kernel (no audita conciencia, 3 dominios, dos dominios) | Kernel §13, BT213 |
| `src/core/lib/humanArtificer.ts` | Humano artífice Mago+Alquimista (responsabilidad indelegable, paga costo) | Humano §14 |
| `src/core/lib/mk1Ontology.ts` | Ontología MK-1 fractal (triada, geometría, consciencia) | MK-1 §40 |
| `src/core/lib/hogueraAFPEnlace.ts` | La Hoguera (fricción/presencia), AFP (3 pilares), El Enlace (7×3) | Hoguera §40, AFP §40, Enlace §40 |
| `src/core/lib/viaProtocols.ts` | 32 VIAs como tipos ejecutables | Kernel v214 |

### Archivos Vital Time Core (Requieren Refactor Completo - Eliminar Duplicados)

| Archivo | Refactor Requerido | Alineación |
|---------|-------------------|------------|
| `src/core/lib/vitalTime.ts` | **ELIMINAR DUPLICADOS**, tipos limpios VitalTimeNode + TriaxialProof | E=V §6, §13, §14, §19, AFP, BT180, BT165, BT164 |
| `src/core/lib/vitalTimeTriaxial.ts` | **ELIMINAR DUPLICADOS**, verifyTriaxial() limpio 3 ejes + BT213/BT214 | E=V §6, §11, §14, Kernel §13 |
| `src/core/lib/vitalTimeTransduction.ts` | **ELIMINAR DUPLICADOS MASIVOS**, transduceTQtoVitalTime/ToTQ limpios + validaciones | NEXO §36, E=V §24, §36 |
| `src/governance/vitalTimeInvariants.ts` | **ELIMINAR PROPIEDADES DUPLICADAS**, invariantes organizados por fuente | NEXO §28, §36, E=V §19 |

---

## Diseño Técnico (design.md)

Ver `openspec/changes/add-vital-time-mode/design.md` (actualizado)

---

## Tasks (tasks.md)

Ver `openspec/changes/add-vital-time-mode/tasks.md` (actualizado con refactor obligatorio)

---

## Validación

- [ ] `openspec validate --strict` pasa
- [ ] Tests triaxiales pasando (verifyTriaxial 3 nodos: YOKA, LAUTARO, ISAAC §23)
- [ ] LoopEngine runAlraicoTick() ejecuta Loop 7 sin errores
- [ ] TerritorialSovereigntyIndex calcula con 18 componentes (incluye vitalTimeAutonomy + kernelLimitsRespected + humanArtificerActive)
- [ ] Pre-commit legal-safe pasa
- [ ] Transducción F TQ↔hr_vital válida con αʰ≥0.6 + triaxial + kernel limits + responsabilidad + 2 dominios
- [ ] **TypeScript compila sin errores** (tsc --noEmit) — CRÍTICO: eliminar duplicados
- [ ] **Kernel limits respetados en todo código** (validateKernelOperation())
- [ ] **Humano artífice requerido** (humanTransform() firma responsabilidad)