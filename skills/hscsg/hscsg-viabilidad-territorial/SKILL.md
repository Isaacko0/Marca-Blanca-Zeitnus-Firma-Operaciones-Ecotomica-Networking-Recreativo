---
name: hscsg-viabilidad-territorial
category: hscsg
version: 1.0.0
description: Valida autosuficiencia territorial 7 gen (AUT/CDS/ZNU).
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-viabilidad-territorial

**Validador de viabilidad territorial HSCSG** — Evalúa si una iniciativa/colectivo puede alcanzar autosuficiencia operativa en dominios críticos sin depender de actores externos.

---

## Principio: No validamos modelos de negocio — validamos capacidad de sostener la vida.
Métricas VC (TAM/SAM, MRR, CAC, LTV) = categoría de error en HSCSG.

---

## Entrada: `TerritorioInput` (alimento, agua, energía, salud, hábitat, gobernanza/CDS, comunicación, finanzas/ZNU, AUT, CDS, lucidez, gammaCARMIS, bioregión, generación, población)

## Criterios (Umbrales HSCSG)
| Dominio | Mínimo | Óptimo | Crítico |
|---------|--------|--------|---------|
| Alimento | 30% | 80%+ | 10% |
| Agua | 50% | 90%+ | 20% |
| Energía | 40% | 100% | 15% |
| Salud | 40% | 70%+ | 20% |
| Hábitat | 50% | 90%+ | 20% |
| CDS | 0.4 | 0.8+ | 0.2 |
| Comunicación | Mesh básico | Mesh+Nostr | Sin infra |
| ZNU | 30% | 80%+ | 10% |
| AUT | 0.3 | 0.6+ | 0.15 |
| Lucidez | true | true | false |

## Salida: `ViabilidadResult` (viable, nivel, score, brechas, recomendaciones, alertas γ-CARMIS)

## Pipeline HSCSG
1. Diagnóstico CAC → hscsg-viabilidad-territorial
2. Viable ≥ GERMINANDO → hscsg-autotrofia-diseñador
3. CDS < 0.3 → hscsg-orquestador-skills → CDS bootstrap
4. AUT < 0.3 → hscsg-coeficiente-autonomia
5. Lucidez=false → hscsg-sistema-alraico → γ-CARMIS

## Integración `src/core/lib/metrics.ts`
- TerritorialSovereigntyIndex (score maestro)
- ActivationCost (costo onboarding real)
- GerminationRate (semilla→célula viable)
- SovereigntyLeak (alertas tempranas)

## Referencias
hscsg_definition.md §1.2, §3 | src/core/lib/metrics.ts | src/core/lib/loopEngine.ts | skills/hscsg-sistema-alraico/ | skills/hscsg-coeficiente-autonomia/ | skills/hscsg-orquestador-skills/ | Auravana SSS-PP-PE-001
