# ATTRIBUTIONS.md — Registro de Fuentes Transformadas (Fair Use)

**Fecha**: 2026-09-13  
**Propósito**: Documentar fuentes externas usadas en análisis transformativos bajo fair use (investigación, comentario, crítica)

---

## Formato de Registro

| Campo | Descripción |
|-------|-------------|
| **Archivo HSCSG** | Archivo en repo que contiene la transformación |
| **Fuente Original** | Autor, título, URL, fecha acceso |
| **Tipo Uso** | `investigación` / `comentario` / `crítica` / `parodia` |
| **Transformación** | Qué se extrajo y cómo se re-expresó (conceptos, patrones, métricas) |
| **Límite Cita** | Máximo 90 chars textuales; resto parafraseado |
| **Atribución en Archivo** | Sí/No - dónde aparece la cita |

---

## Registros

### 1. Brian Oblinger — Community-Led Growth (CLG)
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/INVESTIGACION_OBLINGER_CLG_HSCSG.md` |
| **Fuente Original** | Brian Oblinger, `brianoblinger.com` (accedido 2026-09-12) |
| **Tipo Uso** | `investigación` + `comentario` |
| **Transformación** | Mapeo 3 pilares CLG → arquitectura HSCSG (Value→TerritorialSovereigntyIndex, Strategy→LoopEngine+CDS, AI→Principio Anfibio+Alráico); 8 gaps → 8 skills propuestas; testimonios parafraseados |
| **Límite Cita** | 0 chars textuales (testimonios parafraseados completamente) |
| **Atribución en Archivo** | Sí - tabla "Testimonios Públicos (Parafraseados)" con nombres, roles, empresas |

---

### 2. Yoka — Mundo Paralelo / AFP / Bio-Tesis
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/biotesis_yoka_integration.md`, `docs/filosofia_propria_yoka_integration.md`, `docs/el_enlace_yoka_fabio_integration.md` |
| **Fuente Original** | Yoka, *Mundo Paralelo — Camino al Costado del Mundo* (libro 85 capítulos), *El Arte de la Filosofía Propia* (AFP), corpus Bio-Tesis BT1-BT214 |
| **Tipo Uso** | `investigación` + `comentario` |
| **Transformación** | Conceptos extraídos: E=V, Kernel, 4 Capas, Excavadora GOOGLE-P0, Voz como axioma, Verificación Triaxial, RAO, FactBand, ECROx, αʰ, γ-CARMIS, 3 filtros posibilidad. Re-expresados en ontología HSCSG (AUT, CDS, ZNU, loops). |
| **Límite Cita** | Citas técnicas JSON/YAML en `biotesis_yoka_integration.md` (IDs YC-001 a YC-010) - son especificaciones técnicas derivadas, no texto narrativo |
| **Atribución en Archivo** | Sí - header del archivo menciona fuente |

---

### 3. Fabio F. Balbi — MK-1 (Modelo Ontológico para IA)
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/mk1_balbi_integration.md`, `hscsg_definition.md` (MK-1 referenciado) |
| **Fuente Original** | Fabio F. Balbi, MK-1 (documentos privados/vault) |
| **Tipo Uso** | `investigación` |
| **Transformación** | Triada roles (+/-/0), geometría sagrada, fractalidad, capas ontológicas, tiempo operativo → mapeados a `hscsg-sistema-alraico` (PI topologizado, 𝕮, Transducción F) y `hscsg_definition.md` MATHEMAs |
| **Límite Cita** | 0 chars textuales (conceptos re-expresados) |
| **Atribución en Archivo** | Sí - `hscsg_definition.md` §2.1, §152 |

---

### 4. Auravana / OneCommunity Global — SSS-PP-PE-001
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/auravana_*_integration.md` (si existen), `hscsg_definition.md` §6.1, `src/core/lib/metrics.ts` (364 celdas referenciadas) |
| **Fuente Original** | Auravana Standards, OneCommunity Global, SSS-PP-PE-001 (especificación societal abierta) |
| **Tipo Uso** | `investigación` |
| **Transformación** | 364 celdas base material referenciadas como checklist; Life Radius (15-20 min) → base biofísica; Revenue Demo → viabilidad financiera nodos piloto. NO copiada la especificación. |
| **Límite Cita** | 0 chars textuales (solo referencia numérica "364 celdas") |
| **Atribución en Archivo** | Sí - `hscsg_definition.md` §6.1, `metrics.ts` comentarios |

---

### 5. Gaia — Gaia Commons / Gaia Metaplatform
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/gaia_*_integration.md`, `docs/gaia_ecoaldeas_deep_integration.md`, `docs/gaia_metaplatform_integration.md` |
| **Fuente Original** | Gaia project (Felipe), Gaia Commons Constitution, Gaia Framework |
| **Tipo Uso** | `investigación` + `comentario` |
| **Transformación** | Patrones: piscina global multilateral + bilaterales optativos, consenso 100%, flexible payment 30/70, market commission + Commonomics, Weave Canal Funds. Re-expresados en `docs/federation.md`, `docs/federation_governance.md`, `hscsg-monetary-integration`. |
| **Límite Cita** | Tablas comparativas con columnas "Gaia §X" - referencias de sección, no texto copiado |
| **Atribución en Archivo** | Sí - columnas "Fuente Gaia" en tablas comparativas |

---

### 6. Breadchain — Breadchain Monorepo / Contracts
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/breadchain_*_integration.md` |
| **Fuente Original** | Breadchain (monorepo, contracts, design system, docs) |
| **Tipo Uso** | `investigación` |
| **Transformación** | ADRs extraídos como patrones: Restaking=CaaS Contribution Staking, CoopStable, Gnosis Pay, Crowdstaking. Mapeados a `hscsg-monetary-integration`, `valueDual.ts` (vesting, priceParity). |
| **Límite Cita** | Referencias ADR (ej. "ADR-BC-065") - no texto de ADR |
| **Atribución en Archivo** | Sí - tablas con columna "ADR Breadchain" |

---

### 7. Colony — Colony Network / SDK / Frontend
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/colony_*_integration.md` |
| **Fuente Original** | Colony (Network, Frontend, JS, SDK, gql) |
| **Tipo Uso** | `investigación` |
| **Transformación** | Patrones: reputation, domains/pots, vesting (ERC-8004), lazy evaluation. Mapeados a `hscsg-coeficiente-autonomia` (vesting), `hscsg-monetary-integration` (domains/pots). |
| **Límite Cita** | 0 chars textuales |
| **Atribución en Archivo** | Sí - header archivos |

---

### 8. Proyectos Urbanika / Urbanika Asimilados
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/urbanika/*.md` (archivos `_integration.md` únicamente) |
| **Fuente Original** | Urbanika projects: Autogestión Vecinal, DeFi Adoption IRL, Directorio Regen, Gobernanza Vecinal E5M, Nidori Catálogo, Positive Climate Bus, Web3 Governance Forum, deCreditScore |
| **Tipo Uso** | `investigación` |
| **Transformación** | Patrones de gobernanza vecinal, crédito social, directirios regenerativos, adopción DeFi local. Mapeados a `hscsg-viabilidad-territorial` (dominios: gobernanza, finanzas, comunicación). |
| **Límite Cita** | 0 chars textuales (solo backups movidos a local) |
| **Atribución en Archivo** | Sí - solo en archivos `_integration.md` que referencian fuente |

---

### 9. Trustlines Protocol / Vesting / Copiosis / Otros
| Campo | Valor |
|-------|-------|
| **Archivo HSCSG** | `docs/trustlines_integration.md`, `docs/vesting_integration.md`, `docs/copiosis_integration.md`, `docs/berryvesting_integration.md` |
| **Fuente Original** | Trustlines Protocol, BerryInvestor, Copiosis (NBR), ValueFlows |
| **Tipo Uso** | `investigación` |
| **Transformación** | Trustlines → credit mutual bilaterales ZNU; Vesting → ZNU vesting inmutable; Copiosis NBR → Net Benefit en ZNU; ValueFlows → grafo semántico post-lingüístico. Todos mapeados a `src/core/lib/valueDual.ts`, `src/core/lib/caas.ts`, `hscsg-monetary-integration`. |
| **Límite Cita** | 0 chars textuales |
| **Atribución en Archivo** | Sí - headers + referencias en código |

---

## Resumen de Cumplimiento

| Métrica | Valor |
|---------|-------|
| Archivos con atribución | 9/9 (100%) |
| Citas textuales >90 chars | 0 (solo especificaciones técnicas JSON en `biotesis_yoka_integration.md`) |
| Fuentes con licencia incompatible | 0 en repo (movidas a `~/HSCSG_Backups_Local/`) |
| Archivos `_backup.*` en repo | 0 (eliminados commit `52fda03`) |
| Carpeta `_licencia_incompatible/` en repo | 0 (eliminada) |

---

## Notas de Mantenimiento

1. **Al agregar nueva investigación transformativa**: Añadir entrada a esta tabla
2. **Al detectar cita >90 chars**: Parafrasear o mover a `fair use` documentado
3. **Revisión trimestral**: Verificar que `ATTRIBUTIONS.md` esté sincronizado con `docs/*.md`
3. **Script de validación**: `./scripts/legal-safe-check.sh` detecta citas largas automáticamente