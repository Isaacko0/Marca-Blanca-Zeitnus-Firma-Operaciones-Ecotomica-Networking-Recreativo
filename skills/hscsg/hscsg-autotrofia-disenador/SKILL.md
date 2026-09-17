---
name: hscsg-autotrofia-disenador
category: hscsg
version: 1.0.0
description: Disena autotrofia territorial 7 generaciones.
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-autotrofia-disenador

**Disenador de autotrofia territorial** - Crea planes de autosuficiencia operativa para 7 generaciones cubriendo dominios criticos.

---

## Principio: La autotrofia no es "hacerlo todo uno mismo" - es **capacidad de sostener la vida localmente**.
No disenamos "negocios" - disenamos **ecosistemas de custodia**.

---

## Entrada: `ViabilidadResult` (de hscsg-viabilidad-territorial) + `TerritorioInput`

## Salida: `PlanAutotrofia`
```typescript
interface PlanAutotrofia {
  generaciones: 7;
  hitos: {
    gen: number;
    objetivo: string;
    dominios: string[];
    recursos: { horasVitales: number; kWh: number; znu: number };
    metricas: { AUT: number; CDS: number; cobertura: number };
  }[];
  secuenciaCritica: string[];
  resiliencia: { shocks: string[]; capacidadRegeneracion: number };
  replicabilidad: number;
}
```

## Secuencia Critica (Orden Dependencias Biofisicas)
1. **Agua** (captacion, almacenamiento, calidad)
2. **Alimento** (suelo, semillas endemicass, polinizadores, conservacion)
3. **Energia** (solar, eolica, biomasa, almacenamiento)
4. **Salud** (plantas medicinales, parteras, saberes, prevencion)
5. **Habitat** (bioclimatico, materiales locales, mantenimiento)
6. **Gobernanza/CDS** (deliberacion inevitable, transparencia, lucidez)
7. **Finanzas/ZNU** (trustlines, pool ZNU, demurrage, rotacion)
8. **Comunicacion** (mesh, Nostr relay, offline-first)

## Diferencia vs `hscsg-passive-income-architect` (ARCHIVADA)
| Aspecto | Passive Income (VC) | Autotrofia (HSCSG) |
|---------|---------------------|---------------------|
| Objetivo | Dinero sin trabajar | Vida sin dependencia |
| Metrica | $/mes pasivo | % necesidades cubiertas |
| Horizonte | Corto (ROI) | 7 generaciones |
| Riesgo | Mercado | Colapso biofisico |
| Escalabilidad | Infinite growth | Regeneracion territorial |

## Integracion
- TerritorialSovereigntyIndex para tracking
- ActivationCost para presupuesto real
- GerminationRate para validar hitos
- hscsg-coeficiente-autonomia para optimizacion AUT/CDS
- hscsg-sistema-alraico para gamma-CARMIS en cada hito

## Referencias
hscsg_definition.md | src/core/lib/metrics.ts | Auravana SSS-PP-PE-001 | Lovelock/Berg bioregionalismo | Bookchin municipalismo libertario
