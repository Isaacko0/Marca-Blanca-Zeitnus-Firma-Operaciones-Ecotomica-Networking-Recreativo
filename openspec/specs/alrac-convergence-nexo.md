# ALRAC-NEXO Convergence Specification
## openspec/specs/alrac-convergence-nexo.md

---

## Overview
**Status**: Draft v1.0  
**Domain**: Coordinación/Fusión ALRAC ↔ NEXO (E→V)  
**Version**: 1.0.0  
**Bloqueante**: Paso 0 — Conversación con Yoka

---

## 1. Hallazgo Crítico §3.5

> **ALRAC y NEXO son el mismo patrón, descubierto dos veces independientemente.**

| Dimensión | Amid Dabir (Sistema Alraico) | Yoka (E→V / NEXO) |
|-----------|------------------------------|-------------------|
| **Vocabulario** | Topológico / Formal | Experiencial / Somático |
| **Unidad Básica** | 𝕮 (conjunto credeófilo) | Fricción / Presencia |
| **Estabilidad** | αʰ = Ω·s > κ | Ausencia fricción sostenida |
| **Fractura/Reconfig** | γ-CARMIS (sobrecarga > κ) | Consentimiento total |
| **Validación** | Verificación Triaxial (mental+sim+lab) | Convergencia sin autoridad |
| **Separación** | Separación legítima | Separación legítima |
| **Ética** | PI: incapacidad estructural | Zero Origin: nacemos en cero |

---

## 2. Coincidencia Estructural Verificada

**Yoka firma E→V**: *"No pido permiso para decirlo. No pido validación. No pido que me crean."*

**Amid (PI)**: *"Ningún observador puede acceder por completo a lo cognoscible; todo camino hacia el conocimiento atraviesa una zona de incapacidad estructural."*

**Mismo compromiso de fondo desde lógicas distintas**: La paz/ausencia-fricción como **condición de existencia**, no resultado negociable.

---

## 3. Riesgo de Duplicación No Coordinada

| Escenario | Consecuencia |
|-----------|--------------|
| **Construir ALRAC sin hablar con Yoka** | 2 federaciones redundantes compitiendo por las mismas 3-4 personas (Cergio, Isaac, Amid) |
| **Fusión sin protocolo** | Pérdida de vocabulario específico de cada enfoque |
| **Coordinación sin sincronización** | Desaparición de decisiones, drift semántico |

---

## 4. Paso 0: Conversación con Yoka (BLOQUEANTE)

**Esta semana**: ¿ALRAC = vehículo comercial NEXO **O** capas coordinadas explícitas?

### Opción A: FUSIÓN (ALRAC = Vehículo Comercial NEXO)
```
ALRAC_NEXO_UNIFICADO
├── Docs fusionados: alrac_nexo_unificado.md
├── Vocabulario unificado (mapeo 1:1 términos)
├── Una sola gobernanza (γ-CARMIS = Consentimiento Total)
├── Un solo repo / despliegue
└── Reparto LDFV incluye a Yoka (+ Lautaro eventualmente)
```

### Opción B: COORDINACIÓN (Capas Coordinadas Explícitas)
```
ALRAC ←→ NEXO (Protocolos Explícitos)
├── Sync semanal obligatorio
├── Decisiones compartidas (veto cruzado en núcleo)
├── Vocabularios respetados (traducción automática)
├── Repos separados, .gnap/agents.json sincronizado
└── Reparto LDFV: Yoka entra como Capa 0.5 (Normativa) con mismo trato
```

---

## 5. Protocolo de Coordinación (Si Opción B)

### 5.1 Sync Semanal
- **Cuándo**: Lunes 10:00 CDMX / 17:00 CET
- **Duración**: 30 min máx
- **Formato**: Standup 3 preguntas + 1 decisión
  1. ¿Qué decidió cada lado esta semana?
  2. ¿Qué necesita del otro?
  3. ¿Hay veto cruzado?
  4. Decisión de la semana

### 5.2 Veto Cruzado en Núcleo
| Decisión | Requiere Acuerdo |
|----------|-----------------|
| Cambio arquitectura 5 capas | SÍ (ambos) |
| Modificación γ-CARMIS / Consentimiento Total | SÍ (ambos) |
| Nueva capa / eliminación capa | SÍ (ambos) |
| Reparto LDFV parámetros | SÍ (ambos) |
| Licencias / open source | SÍ (ambos) |

### 5.3 Traducción Automática Vocabulario
| ALRAC (Amid) | NEXO (Yoka) | Puente |
|--------------|-------------|--------|
| αʰ > κ | Ausencia fricción | `harmonyThreshold` |
| γ-CARMIS | Consentimiento total | `reconfigurationTrigger` |
| Verificación triaxial | Convergencia | `triaxialConvergence` |
| Separación legítima | Separación legítima | `legitimateSeparation` |
| PI (Incapacidad) | Zero Origin | `structuralHumility` |

---

## 6. Licencia Audit (Prerrequisito)

**Conflicto conocido**: Material Yoka/Fabio Balbi bajo **CC BY-NC-ND 4.0** en repo HSCSG.

**Acción requerida** (antes de invitación formal):
1. Auditar todo material Yoka en HSCSG_v15_OS
2. Determinar: ¿permanece NC-ND? ¿se relicencia? ¿se mueve a repo aparte?
3. Documentar en `LICENSE_AUDIT_ASIMILACIONES.md`

---

## 7. GNAP Coordination Agent

```json
// .gnap/agents.json (YA DEPLOYED ambos repos)
{
  "id": "alrac-coordinator",
  "capabilities": [
    "alrac-nexo-sync",      // Este protocolo
    "license-audit",        // Cerrar LICENSE_AUDIT_ASIMILACIONES.md
    "pilot-tracking",       // Experimento 2 + Línea A
    "yoka-liaison"          // Enlace directo Yoka
  ]
}
```

---

## 8. Archivos Referencia

| Archivo | Qué Contiene |
|---------|--------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §3.5 (Hallazgo), §4 (Diagnóstico), §12.4 (Colaboración Yoka) |
| `docs/alrac_integration.md` | Isomorfismo, GNAP |
| `docs/E→V - Documento Maestro.md` | Fuente Yoka (local) |
| `.gnap/agents.json` | alrac-coordinator config |

---

## 9. Criterios de Decisión (Esta Semana)

| Criterio | Fusión (A) | Coordinación (B) |
|----------|------------|------------------|
| **Velocidad ejecución** | Más rápido (un repo) | Más lento (sync requerido) |
| **Preservación vocabulario** | Pierde especificidad | Mantiene ambos |
| **Riesgo legal licencias** | Menor (unificado) | Mayor (NC-ND persiste) |
| **Gobernanza** | Simple | Compleja (veto cruzado) |
| **Escalabilidad** | Mejor | Requiere protocolo robusto |

---

## 10. Próximos Pasos Inmediatos

```
☐ AGENDAR conversación con Yoka (ESTA SEMANA)
☐ Preparar mapeo vocabulario 1:1 (tabla §5.3)
☐ Llevar LICENSE_AUDIT_ASIMILACIONES.md a la conversación
☐ Decidir: A (fusión) O B (coordinación)
☐ Si A → merge docs en alrac_nexo_unificado.md
☐ Si B → firmar protocolo coordinación día 1
☐ Actualizar .gnap/agents.json con decisión
```