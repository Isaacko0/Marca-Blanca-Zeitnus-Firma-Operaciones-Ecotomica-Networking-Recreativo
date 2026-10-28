# 🔗 Integración: Analogical (Modern Ancients) — Descubrimiento Analógico
## Fase 1 — Mapeo a capas ALRAC / HSCSG

**Documento fuente:** `docs/analogical-modernancients-backup.md`  
**URL fuente:** http://analogical.modernancients.com/  
**Licencia:** No se encontró LICENSE explícita. Plataforma de Modern Ancients®.  
**Tratamiento:** Reimplementación del modelo conceptual de "geometría del pensamiento". Atribución a Modern Ancients®.

---

## Mapeo a capas ALRAC/HSCSG

| Concepto (Analogical) | Capa ALRAC | Mapeo HSCSG | Regla de negocio extraída |
|---|---|---|---|
| Point — observación situada que entra al mapa | Capa 4 — Observación | `Observation` entidad en grafo de conocimiento | `addObservation(fact, context, source)` |
| Edge — conexión entre puntos | Capa 4 — Relación | `Relationship` borde en grafo | `connect(obsA, obsB, relationshipType)` |
| Distance — distancia conceptual | Capa 4 — Métrica | `semanticDistance()` | Pondera fuerza de analogía |
| Cluster — agrupación de puntos | Capa 4 — Comunidad | `CommunityCluster` en red de conocimiento | `clusterByTheme()` |
| Intersection — cruce de disciplinas | Capa 4 — Interdisciplina | `disciplineIntersection()` | Mapea biología ↔ materiales ↔ etc. |
| Gap — lo que no conectamos | Capa 4 — Análisis de vacío | `gapAnalysis()` | Identifica oportunidades no exploradas |
| Anomaly — observación que rompe patrón | Capa 4 — Detección | `anomalyDetection()` | Señala hallazgos fuera del patrón |
| Map epistémico (Question → Evidence → Finding) | Capa 4 — Proceso | `epistemicPipeline()` | Question, Observation, Hypothesis, Analogy, Evidence, Validated finding, Expert interpretation |
| "Judgment stays with you" | Capa 0 — Soberanía | `humanJudgmentGate()` | La IA asiste, el humano decide |
| Flujo 6 pasos (Discover→Learn) | Capa 4 — Ciclo de descubrimiento | `discoveryCycle()` | Discover, Understand, Hypothesize, Translate, Mobilize, Learn |

---

## Reglas de negocio traducidas a interfaces ALRAC

```
1. addObservation(fact, context, source, discipline) -> ObservationId
   - Un hecho situado entra al mapa con su contexto y procedencia.
   - Cada observación tiene disciplina de origen.

2. connectObservations(obsA, obsB, relationshipType, strength) -> RelationshipId
   - Conecta dos observaciones con un tipo de relación y fuerza.
   - Tipos: analogy, evidence, contradiction, inspiration, mechanism.

3. semanticDistance(obsA, obsB) -> DistanceScore (0-1)
   - Mide proximidad conceptual entre observaciones.
   - Baja distancia = fuerte analogía potencial.

4. gapAnalysis(domain, coveredTopics) -> GapReport
   - Identifica temas no cubiertos en un dominio.
   - Señala "lo que no estamos conectando".

5. anomalyDetection(observation, pattern) -> AnomalyScore
   - Detecta observaciones que rompen el patrón establecido.
   - Alto score = hallazgo potencialmente disruptivo.

6. discoveryCycle(phase, input) -> Output
   - Fases: Discover, Understand, Hypothesize, Translate, Mobilize, Learn.
   - Cada fase produce outputs específicos para la siguiente.
```

---

## Reglas de verificación (verify triaxial)

| Verificación | Entrada | Salida | Acción si falla |
|---|---|---|---|
| `verifyAnalogyValidity` | sourceDomain, targetDomain, mapping | Validez de analogía | Marcar como "candidata", no probada |
| `verifyEvidenceSufficiency` | claim, evidence | Suficiencia de evidencia | Requerir más evidencia |
| `verifyHumanJudgment` | aiSuggestion, humanReview | Decisión final | Bloquear acción sin juicio humano |
| `verifyProvenanceChain` | observation, sourceChain | Cadena de procedencia | Rechazar observación sin origen |

---

### Notas de derechos de autor

El modelo "geometría del pensamiento" y el mapa epistémico son conceptos de Analogical (Modern Ancients®). Se reimplementan como especificaciones abiertas bajo ALRAC Capa 4 sin copia de código Next.js ni interfaz.