# RESPALDO DE FUENTE — TDF Game Guide (closerdao/tdf-game-guide)

## Identificación de la fuente

- **Título:** TDF Game Guide — Living rulebook of the Traditional Dream Factory
- **Autor:** samueldelesque (Samuel Delesque) y closerearth (Closer)
- **Repo:** https://github.com/closerdao/tdf-game-guide
- **Rama:** main
- **Tipo:** Documentación de gobernanza, roles, tokens y vida comunitaria (Markdown)
- **Licencia:** No declarada explícitamente en el README

## ⚖️ Aviso de derechos de autor

Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica. Todos los derechos de autor permanecen con Samuel Delesque, CloserDAO y los co-autores. No se reclama autoría sobre la obra original.

## Qué es el repositorio

Guía viva ("Game Guide") que gobierna el "juego" de TDF: un hábitat humano regenerativo. Describe roles, gobernanza, sistemas, tokens y reglas de la comunidad, evolucionando vía DAO. Es el documento de referencia operativa de TDF.

## Secciones y contenido clave

| Sección | Archivos | Contenido |
|---------|----------|-----------|
| Roles & Stakeholders | `02_roles-and-stakeholders/` | Citizen, Resident, Steward, Team Member, Guardian, Visitor, Volunteer |
| Governance | `03_governance/` | DAO, decision_process, oasa, enseada_sonhadora (legal entity) |
| Token System | `05_token-economy/` | $TDF, $Presence, $Sweat, Carrots, distribution, voting_weight |
| Community Living | `06_community-living/` | Ground rules |
| Land Stewardship | `07_land-stewardship/` | Monitoring, principles |

## Sistema de tokens (de `05_token-economy/`)

| Token | Propiedad | Rol |
|-------|-----------|-----|
| **$TDF** | Transferible | 1 token = 1 noche/año; voto base en DAO; no es equity ni seguridad financiera; 20% reservado para sweat |
| **$Presence** | No transferible, decay (~0.03%/día) | Registro de tiempo físico en tierra; voto ×1; roles BOOKING_PLATFORM_ROLE / BOOKING_MANAGER_ROLE lo crean |
| **$Sweat** | No transferible, decay (10% anual) | Trabajo/contribución (major projects, bounties); amplifica peso de voto; no otorga voto por sí solo |
| **Carrots** | Créditos de estancia no renovables | Para ciudadanos |

## Fórmula de peso de voto

```
Voting Power = $TDF + $Presence + $Sweat
```

Quorum: 500 $TDF equivalente. Aprobación: >50% de votos emitidos. OASA puede vetoar decisiones inconstitucionales.

## Roles de la comunidad

- **Citizens:** Miembros plenos con derechos de gobierno (subconjunto de token holders)
- **Residents:** Contribuyentes calificados (corto o largo plazo)
- **Stewards:** Aprendices inmersivos que co-gestionan áreas
- **Team Members:** Líderes operativos elegidos por el DAO (al menos 2 directores, fiduciarios de Enseada Sonhadora LDA)
- **Guardians:** Supervisión ecológica con poder de veto
- **Visitors/Volunteers:** Sin voto

## Entidad legal

**Enseada Sonhadora LDA** — entidad legal portuguesa para la tenencia de la tierra (25 ha, Alentejo).

## Relación con OASA

TDF es parte de la red OASA y sigue su constitución regenerativa. Decisiones clave (masterplan cambios, emisión de tokens, objetivos de regeneración) sujetas a la Asamblea General de OASA y guardianes de la naturaleza.

## Proceso de decisión DAO

1. Propuesta creada en `/governance`
2. Discusión comunitaria (1-2 semanas)
3. Voto ponderado en `/governance`
4. Veto de OASA si es inconstitucional
5. Ejecución por el Team con seguimiento de progreso
