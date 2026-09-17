---
name: hscsg-asimilacion-ecosistemica
category: hscsg
version: 1.0.0
description: Asimila repos como organismos, no como activos.
author: Isaacko0 / Zeitnus / HSCSG + Hermes Agent
---

# hscsg-asimilacion-ecosistemica

**Asimilación ecosistémica de repositorios** — Trata repos externos como organismos vivos a integrar en el ecosistema HSCSG, no como "activos" a explotar.

---

## Principio: Asimilación = Simbiogénesis, no adquisición.
"El repositorio que se asimila muta; el que lo asimila también muta."

---

## Entrada: `RepoExternoInput`
```typescript
interface RepoExternoInput {
  url: string;
  tipo: 'KERNEL' | 'TOOL' | 'PROTOCOL' | 'GOVERNANCE' | 'ECONOMIC' | 'KNOWLEDGE';
  licencia: string;
  madurez: 'SEMILLA' | 'BROTE' | 'ARBOL' | 'BOSQUE';
  salud: { actividad: number; comunidad: number; documentacion: number; testeo: number };
  compatibilidadHSCSG: { AUT: number; CDS: number; ZNU: number; lucidez: number };
}
```

## Proceso: 4 Fases Simbióticas (adaptadas de hscsg-repo-assimilation)

### FASE 1: RECONOCIMIENTO (Semana 1-2)
- Clonar y habitar el repo (no "auditar")
- Ejecutar tests, leer issues, entender dolores
- Mapear a dominios HSCSG (alimento, agua, energía, salud, hábitat, gobernanza, comunicación, finanzas)
- Detectar: ¿Qué necesidad vital resuelve? ¿Qué patrones vivos encarna?

### FASE 2: DIGESTIÓN (Semana 2-4)
- Extraer LÓGICA PURA (extirpar infra ajena: Stripe, analytics, ads, tracking)
- Conservar solo lo que sirve a AUT/CDS/ZNU/lucidez
- Traducir a ontología HSCSG (tipos, métricas, loops)
- Documentar en `src/core/lib/` + `skills/hscsg-*`

### FASE 3: INTEGRACIÓN (Semana 4-6)
- Conectar a loopEngine (γ-CARMIS, resonancia, loops)
- Registrar en TerritorialSovereigntyIndex
- Establecer trustlines si aporte económico
- Spawn skill dedicada si nuevo dominio

### FASE 4: CO-EVOLUCIÓN (Continuo)
- Monitorear salud simbiótica (AUT/CDS del módulo integrado)
- γ-CARMIS si sobrecarga ΣPᵢ > κ
- Retorno al común: mejoras fluyen upstream si licencia permite
- Spawn hijo si madurez = BOSQUE

## Salida: `ResultadoAsimilacion`
```typescript
interface ResultadoAsimilacion {
  integrado: boolean;
  moduloHSCSG: string;           // ej: src/core/lib/nueva-capacidad.ts
  skillCreada: string | null;    // ej: hscsg-nueva-capacidad
  aporteAUT: number;             // Delta AUT del sistema
  aporteCDS: number;             // Delta CDS del sistema
  aporteZNU: number;             // Flow ZNU generado
  patronesVivosExtraidos: string[];
  deudaTecnica: string[];        // Qué requiere refactor futuro
  proximosPasos: string[];
}
```

## Diferencia vs `hscsg-repo-assimilation-pipeline` (ARCHIVADA)
| Aspecto | Pipeline VC | Asimilación Ecosistémica (HSCSG) |
|---------|-------------|----------------------------------|
| Metáfora | Adquisición / Activo | Simbiogénesis / Organismo |
| Objetivo | Extraer valor | Integrar capacidad vital |
| Limpieza | Quitar bugs | Extirpar infra ajena (dinero, tracking, control) |
| Métrica | LOC, features, ROI | AUT, CDS, ZNU flow, resiliencia |
| Resultado | Librería interna | Órgano funcional del autómata |
| Retorno | Propietario | Común (si licencia permite) |

## Principio Anfibio Aplicado
- Mismo repo opera en modo postmonetario (ZNU) o conectado (USDC via priceParity Nivel 3)
- Lógica de cálculo agnóstica; render decide etiqueta
- NO extirpar la lógica — solo la infra ajena

## Integración
- `hscsg-ingenieria-inversa-patrones-vivos` para extraer patrones
- `hscsg-viabilidad-territorial` para validar aporte
- `hscsg-sistema-alraico` para γ-CARMIS monitoreo
- `hscsg-orquestador-skills` para routing
- `src/core/lib/metrics.ts` para tracking

## Referencias
hscsg_definition.md (Principio Anfibio, §60.2) | hscsg-repo-assimilation (4 fases) | src/core/lib/loopEngine.ts | Lynn Margulis simbiogénesis | Auravana SSS-PP-PE-001
