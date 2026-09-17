---
name: hscsg-comunicacion-veraz
category: hscsg
version: 1.0.0
description: Comunicacion sin manipulacion; transparencia radical.
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-comunicacion-veraz

**Comunicación veraz territorial** — Comunicación sin persuasión manipulativa; transparencia radical.

---

## Principio: No hacemos "marketing" — hacemos **comunicación veraz**.
"Marketing" = persuasion asimétrica. HSCSG = simetría informacional.

---

## Entrada: `PlanAutotrofia` + `TerritorioInput` + `ViabilidadResult`

## Salida: `KitComunicacionVeraz`
```typescript
interface KitComunicacionVeraz {
  narrativa: string;           // Qué somos, qué hacemos, por qué (sin hype)
  brechasPublicadas: string[]; // Lo que NO cubrimos aún (honestidad)
  metricasPublicas: {
    AUT: number; CDS: number; cobertura: number; generacion: number;
  };
  ritualesComunicacion: {
    asambleaSemanal: boolean;
    reporteMensual: boolean;
    auditoriaAnual: boolean;
  };
  canales: {
    meshLocal: boolean; nostrRelay: boolean; webOffline: boolean;
  };
  sinCTA: true;                // NO call-to-action manipulativos
  sinFOMO: true;               // NO fear of missing out
  sinEscasezArtificial: true;  // NO countdowns, cupos falsos
}
```

## Diferencia vs `hscsg-design-marketing-factory` (ARCHIVADA)
| Aspecto | Marketing Factory (VC) | Comunicación Veraz (HSCSG) |
|---------|------------------------|----------------------------|
| Objetivo | Convertir / Vender | Informar / Conectar |
| Métrica | CTR, CAC, ROAS | Confianza, resonancia, claridad |
| Técnicas | FOMO, escasez, urgency, social proof | Transparencia, brechas publicadas, métricas reales |
| Copywriting | Persuasión psicológica | Lenguaje llano, sin eufemismos |
| Diseño | Conversión | Legibilidad, accesibilidad |
| KPI | Leads, sales | Nodos resonantes, células viables |

## Reglas de Oro HSCSG
1. **Publica tus brechas** — Lo que no cubres es tan importante como lo que cubres
2. **Métricas reales, no vanidad** — AUT, CDS, % necesidades, no "usuarios registrados"
3. **Sin CTA manipulativos** — "Únete si resuena", no "Compra ahora"
4. **Offline-first** — La comunicación debe funcionar sin internet
5. **Bilingüe por defecto** — Español + lengua local/bioregión

## Integración
- `TerritorialSovereigntyIndex` como única métrica pública
- `hscsg-viabilidad-territorial` para validar claims
- `hscsg-sistema-alraico` para lucidez en comunicación (Ley III)
- Mesh/Nostr para distribución soberana

## Referencias
hscsg_definition.md (Ley III: Sin excepciones silenciosas) | src/core/lib/metrics.ts | Ivan Illich "Herramientas conviviales" | Bookchin "Remaking Society"
