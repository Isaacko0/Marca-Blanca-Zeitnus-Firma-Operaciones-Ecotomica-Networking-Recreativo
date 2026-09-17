---
name: hscsg-ingenieria-inversa-patrones-vivos
category: hscsg
version: 1.0.0
description: Extrae patrones de sistemas vivos exitosos, no de startups.
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-ingenieria-inversa-patrones-vivos

**Ingeniería inversa de patrones vivos** — Extrae patrones de sistemas vivos exitosos (ecosistemas, organismos, comunidades ancestrales), no de startups VC.

---

## Principio: La naturaleza ya resolvió la autosuficiencia — nosotros solo la decodificamos.
No copiamos "modelos de negocio" — **asimilar patrones de vida**.

---

## Entrada: `SistemaVivoInput`
```typescript
interface SistemaVivoInput {
  tipo: 'ECOSISTEMA' | 'ORGANISMO' | 'COMUNIDAD_ANCESTRAL' | 'BIOREGION';
  nombre: string;
  ubicacion: string;
  longevidad: number; // años de existencia continua
  dominiosCubiertos: string[];
  patrones: PatronVivo[];
  metricas: { resiliencia: number; regeneracion: number; eficiencia: number };
}
```

## Salida: `PatronExtraido`
```typescript
interface PatronExtraido {
  principio: string;           // Principio generalizable (ej: "Almacenamiento distribuido")
  mecanismo: string;           // Cómo funciona biofísicamente
  condiciones: string[];       // Qué condiciones requiere
  transferibilidad: number;    // 0-1 (qué tan aplicable a otro territorio)
  adaptacion: string;          // Cómo adaptar sin perder esencia
  riesgo: string[];            // Qué puede salir mal
  metricasValidacion: string[]; // Cómo validar que funciona en nuevo contexto
}
```

## Fuentes de Patrones (Prioridad HSCSG)
1. **Ecosistemas maduros** (bosques, humedales, arrecifes) — ciclos cerrados, simbiosis
2. **Comunidades ancestrales** (ayllus, ejidos, commons alpinos, zapatistas, rojava) — gobernanza distribuida
3. **Organismos resilientes** (tardígrados, liquenes, micelio) — supervivencia extrema
4. **Biorregiones funcionales** (cuencas hidrográficas, corredores biológicos) — escala territorial

## Diferencia vs `hscsg-reverse-business-architect` (ARCHIVADA)
| Aspecto | Reverse Business (VC) | Patrones Vivos (HSCSG) |
|---------|----------------------|------------------------|
| Fuente | Startups unicornio | Sistemas vivos milenarios |
| Métrica | Revenue, growth, exit | Resiliencia, regeneración, longevidad |
| Pregunta | "Cómo monetizaron?" | "Cómo persistieron?" |
| Transferibilidad | Escalabilidad global | Adaptación bioregional |
| Riesgo | Mercado, competencia | Colapso biofísico, pérdida cultural |

## Integración
- `hscsg-autotrofia-disenador` usa patrones extraídos para hitos
- `hscsg-viabilidad-territorial` valida con métricas vivas
- `hscsg-sistema-alraico` para γ-CARMIS en transferencia
- Auravana SSS-PP-PE-001 (364 celdas) como checklist

## Referencias
Fritjof Capra "The Web of Life" | Lynn Margulis simbiogénesis | Elinor Ostrom commons | Auravana SSS-PP-PE-001 | Bioregionalismo (Berg, Lovelock) | Comunidades zapatistas/rojava
