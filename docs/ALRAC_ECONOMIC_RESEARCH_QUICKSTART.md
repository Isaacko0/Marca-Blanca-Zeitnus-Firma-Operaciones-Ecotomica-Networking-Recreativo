# Sistema ALRAC Economic Research — Guía Rápida

## 12 Skills Creadas (Categoría: economic-research)

### 4 Agentes Core + Revisor (Metodología Trading → Economía Regenerativa)

| Skill | Descripción | Trigger |
|-------|-------------|---------|
| `alrac-data` | Extrae y limpia datos mercado/territorio (TQ, ZNU, CaaS, RAO, macro) | "Investigar datos..." |
| `alrac-strategy` | Diseña lógica asignación/rotación/coordinación nodos ALRAC (≤3 parámetros) | "Diseñar estrategia..." |
| `alrac-backtest` | Ejecuta simulación histórica métricas estándar + regenerativas (αʰ, kWh, autonomía) | "Backtest..." |
| `alrac-review` | **CRÍTICO** Audita 5 puntos: overfit, lookahead, survival, costs, OOS — NO DESACTIVAR | "Revisar backtest..." |

### 8 Skills Dominio ALRAC/Zeitnus/HSCSG/Gran Alianza

| Skill | Dominio | Archivos Referencia Clave |
|-------|---------|---------------------------|
| `alrac-tq` | TQ ledger: 1 TQ=1kWh, ±500, ICE/Ecoinvent, NFC offline, prohibición cambiaria | `src/core/lib/tq.ts`, `docs/ALRAC_MASTER_INTEGRADO.md` §5, §12.1 |
| `alrac-znu` | ZNU: indexación canasta, crédito 2-3%, 1a1v, membrana fiat Capa 3 | `src/core/lib/znu.ts`, `docs/ALRAC_MASTER_INTEGRADO.md` §5, §12.5 |
| `alrac-casas` | CaaS/AUT: vectores contribución, trabajo verificado RAO, matching federado | `src/core/lib/casas.ts`, `docs/alrac_integration.md` isomorfismo |
| `alrac-rao` | RAO: 5 campos (identidad, emisor, procedencia, permisos, estado) + anclaje kWh | `src/core/lib/rao.ts`, `docs/ALRAC_MASTER_INTEGRADO.md` §7, §12.6 |
| `alrac-federated` | 7 holones Gran Alianza: Gaia, Mycelium, SynchroLabs, Project Weave, HSCSG, PHI, Data Trust, BioHabitats | `docs/alrac_integration.md`, `.gnap/agents.json` |
| `alrac-gran-alianza` | 7 experimentos + portafolio unificado "Digital Infrastructure for Regeneration" | `docs/ALRAC_MASTER_INTEGRADO.md` §12.6, §14 |
| `alrac-gnap` | GNAP cross-repo: `alrac-coordinator` sync Zeitnus ↔ HSCSG v15 OS | `.gnap/agents.json`, GNAP Spec |
| `alrac-economic-research` | Skill maestra: vista general + flujo trabajo + plantillas | Todas las anteriores |

---

## Flujo de Trabajo (Copiar-Pegar)

```bash
# 1. HIPÓTESIS (una oración con razón)
> Hipótesis: "Rotación mensual excedentes ZNU→producción porque flujos CaaS persiguen rendimiento trimestral"

# 2. SPLIT ANTES DE ESCRIBIR REGLA
> Train: 2020-2023 | Test OOS: 2024-YTD (NUNCA mirar)

# 3. EJECUTAR 4 AGENTES + REVISOR
> @alrac-data: extraer precios electricidad México 2020-2024 + canasta ZNU + transacciones TQ piloto
> @alrac-strategy: diseñar reglas entrada/salida/sizing con ≤3 parámetros
> @alrac-backtest: simular 2020-2024, métricas estándar + regenerativas (αʰ, kWh, autonomía)
> @alrac-review: auditar 5 puntos POR NOMBRE — overfit, lookahead, survival, costs, OOS

# 4. SI REVISOR MARCA ALGO → NO DISCUTIR, DOCUMENTAR PATRÓN FALLO
# 5. SI PASS TODO → Test OOS UNA VEZ al final
# 6. SI SOBREVIVE → Paper trading meses
# 7. REGISTRAR TODO (incluidas muertas) → Patrón fallos > patrón éxitos
```

---

## Archivos de Referencia Obligatorios (Leer Primero)

| Archivo | Qué Contiene |
|---------|--------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | **Documento maestro completo** — arquitectura 5 capas, colaboraciones 12.1-12.6, próximos pasos |
| `docs/alrac_integration.md` | Triple perspectiva Usuario/LLM/HSCSG + isomorfismo 30 filas + GNAP |
| `src/core/lib/alrac.ts` | 15+ funciones puras (computeHarmony, computeLDFVShare, verifyTQProhibition, simulateNode) |
| `src/core/state/alrac.ts` | 25+ interfaces TypeScript |
| `.gnap/agents.json` | Agente `alrac-coordinator` cross-repo |

---

## Próximos Pasos Inmediatos

```
☐ Instalar habilidades base:
   cd ~/.claude/skills
   git clone https://github.com/zubair-trabzada/ai-trading-claude.git     # skills/trade-*
   git clone https://github.com/tradermonty/claude-trading-skills.git    # skills/backtest-*, review-*

☐ Verificar skills ALRAC cargadas:
   claude-code mcp list | grep alrac

☐ Ejecutar primer ciclo completo:
   Hipótesis → @alrac-data → @alrac-strategy → @alrac-backtest → @alrac-review

☐ Registrar agente GNAP en AMBOS repos:
   Copiar .gnap/agents.json a Zeitnus_local/ y HSCSG_v15_OS_local/
   git add .gnap/agents.json && git commit -m "chore: alrac-coordinator GNAP agent" && git push

☐ PASO 0 BLOQUEANTE: Agendar conversación con Yoka (ALRAC = vehículo NEXO O capas coordinadas)
```

---

## Recordatorio Crítico

> **El revisor (alrac-review) es la única razón por la que el sistema funciona.**
> 
> Cuando marque algo: **NO DISCUTAS**. La única razón por la que existe es que querrás hacerlo.
> 
> "Catorce murieron y uno vivió" — el valor está en los 14 que murieron (patrón de fallos).
> 
> Una hermosa curva de equity es más a menudo evidencia de error que de ventaja.