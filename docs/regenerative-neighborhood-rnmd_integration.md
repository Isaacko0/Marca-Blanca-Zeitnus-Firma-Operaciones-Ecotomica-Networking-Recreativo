# Integración Regenerative Neighborhood Modular Design (RNMD) — RegenTribe

**Fuente asimilada:** `docs/regenerative-neighborhood-rnmd_backup.md` — RegenTribe collective, "Regenerative Neighborhood MODULAR DESIGN". Todos los derechos de autor permanecen con RegenTribe.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El RNMD aporta un marco modular de 4 capas (hardware, humanware, economy/exchangeware, software/My.Co.Net) para barrios regenerativos escalables. Se asimila como lógica de dominio pura; no se copia código ni assets de RegenTribe.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un marco modular para crear un barrio regenerativo**: 4 componentes (hardware, humanware, economía, software) replicables en cualquier lugar.
- **Satisfacer necesidades humanas**: individuales (salud, seguridad, aceptación, felicidad, creación, realización) y colectivas (conexión social, propósito, bienestar).
- **Resiliencia de recursos**: clima, alimento y suministro de agua; "resource resilience is freedom".
- **Una red global opt-in de apoyo mutuo**: barrios conectados, no aislados; intercambio de recursos y conocimientos.
- **Una aplicación con LLM integrada (My.Co.Net)**: asistente que apoye la gestión del barrio, no que reemplace el juicio humano.
- **Arquetipos claros de participación**: Vision Holder, Community Member, Service Provider, Resource Holder, Land Guardian, Collaborator.
- **Código abierto y crowd-sourced**: el marco se mejora por la comunidad; cualquiera puede contribuir.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto RNMD | Módulo Zeitnus/ALRAC destino | Observación |
|---------------|------------------------------|-------------|
| 4 módulos: hardware, humanware, economy, software | `src/core/lib/rnmd-*.ts` (4 módulos nuevos) | Lógica pura de dominio, no UI |
| Jerarquía de necesidades (individual, colectiva, naturaleza, propósito) | `rnmd-humanware.ts` + `rnmd-economy.ts` | Mapeo a CaaS y contribución |
| Arquetipos (Vision Holder, Community Member, Service Provider, Resource Holder, Land Guardian, Collaborator) | `propertyRegimeSystem.ts` (roles) + `rnmd-humanware.ts` | Roles con responsabilidades distintas |
| Sistemas de recursos resilientes (agua, comida, energía, aire, residuos) | `tq-land.ts` + `mel-crm.ts` (indicadores) | MRV de recursos |
| Red opt-in de apoyo mutuo | `registrySystem.ts` + `currentSeeSystem.ts` | 4 registros + corrientes unificadas |
| LLM integrada (My.Co.Net) | `regenerative-agent.ts` (dominio `financial`/`community`) | LLM como enriquecedor, no sustituto |
| Bienestar individual y colectivo | `rnmd-humanware.ts` | Métricas de bienestar, no solo económicas |
| Locations reales (Akumal, Tulum, Roatan, San Diego, Austin, etc.) | `registrySystem.ts` | Registro de barrios piloto |
| Open source / crowd-sourced | `registrySystem.ts` append-only | Conocimiento público, versionado |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| My.Co.Net (app específica) | Infra de software ajena | Lógica pura en TS; UI propia de HSCSG |
| Sitio web regentribe.org / TribesPlatform.app | Plataforma externa | Registro de ubicaciones como datos, no dependencia |
| Formularios de inscripción (Name, Email, archetype) | UI de captación | Modelos de datos de roles, no formularios HTML |
| Instagram / Twitter / mind map visual | Assets de marketing | No se asimilan; solo se documentan como referencias |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte del RNMD |
|--------|-----------------|
| `src/core/lib/rnmd-hardware.ts` | (NUEVO) Infraestructura física: vivienda wellness, sistemas de recursos resilientes |
| `src/core/lib/rnmd-humanware.ts` | (NUEVO) Capa humana: arquetipos, bienestar individual/colectivo, Ikigai |
| `src/core/lib/rnmd-economy.ts` | (NUEVO) Economía/intercambio: exchangeware, sostenibilidad productiva |
| `src/core/lib/rnmd-software.ts` | (NUEVO) Capa software: LLM integrada, My.Co.Net como lógica pura |
| `src/core/state/rnmd.ts` | (NUEVO) Estado del marco modular RNMD |
| `src/core/lib/regenerative-agent.ts` | Extender: dominio `community` para LLM integrada |
| `src/core/lib/mel-crm.ts` | Extender: indicadores de bienestar y resiliencia de recursos |
| `src/core/lib/boundaries.ts` | DENY: especulación inmobiliaria ("wellness realestate" como commodity), LLM autónoma sin humano |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- RNMD: sistemas de recursos resilientes (agua, comida, energía, aire, residuos); bienestar individual y colectivo; no especulación inmobiliaria.
- HSCSG: MJ Gate bloquea acciones que degraden base; `boundaries.ts` DENY contra especulación.
- **Resonancia:** "wellness realestate" no es commodity; es infraestructura de bienestar no especulable.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- RNMD: arquetipos con roles definidos; Resource Holder ofrece inversión; Land Guardian ofrece tierra; Collaborator expande el blueprint.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** la contribución real (tierra, habilidad, inversión ética) genera acceso y rol en el barrio.

### Ley III — Lucidez, nunca engañar
- RNMD: open source, crowd-sourced, blueprint público, mind map accesible.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** el marco es transparente; cualquiera puede auditar y contribuir.

### CaaS (Comunidad como Servicio)
- RNMD: red opt-in de apoyo mutuo; arquetipos de participación; economía productiva y sostenible.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso al barrio se gana con contribución, no con poder adquisitivo puro.

---

## 4. Tabla de mapeo isomórfico (RNMD → Zeitnus/ALRAC)

| Concepto RNMD | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|---------------|----------------------|------|----------|--------|
| Hardware (vivienda wellness, sistemas de recursos) | `rnmd-hardware.ts` | Capa 4 | Ley I | **Pendiente** |
| Humanware (arquetipos, bienestar, Ikigai) | `rnmd-humanware.ts` + `propertyRegimeSystem.ts` | Capa 5 | Ley II | **Pendiente** |
| Economy / exchangeware | `rnmd-economy.ts` + `caas.ts` | Capa 5 | CaaS | **Pendiente** |
| Software / My.Co.Net (LLM integrada) | `rnmd-software.ts` + `regenerative-agent.ts` | Capa 4 | Ley III | **Pendiente** |
| Sistemas de recursos resilientes (agua, comida, energía, aire, residuos) | `tq-land.ts` + `mel-crm.ts` | Capa 1/4 | Ley I | **Pendiente** |
| Red opt-in de apoyo mutuo | `registrySystem.ts` + `currentSeeSystem.ts` | Capa 4 | CaaS | **Pendiente** |
| Locations reales (pilotos) | `registrySystem.ts` | Capa 4 | Ley III | **Pendiente** |
| No especulación inmobiliaria | `boundaries.ts` DENY rules | Capa 0 | Ley I | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|-----------------------------------|
| Marco modular 4 capas (hardware/humanware/economy/software) | App My.Co.Net específica |
| Arquetipos de participación (6 roles) | Formularios de inscripción HTML |
| Sistemas de recursos resilientes | Infra de construcción física específica |
| Red opt-in de apoyo mutuo | Plataforma TribesPlatform.app como dependencia |
| LLM integrada como asistente | LLM autónoma sin veto humano |
| Open source / crowd-sourced blueprint | Assets de marketing (Instagram, Twitter, mind map visual) |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión RNMD | Vaso comunicante |
|----------------|---------------|------------------|
| `rnmd-hardware.ts` | Infraestructura física de barrio | `tq-land.ts` (tierra productiva + vivienda) |
| `rnmd-humanware.ts` | Arquetipos y bienestar | `propertyRegimeSystem.ts` (roles y custodio) |
| `rnmd-economy.ts` | Exchangeware, economía productiva | `caas.ts` (streams de intercambio) |
| `rnmd-software.ts` | LLM integrada (My.Co.Net) | `regenerative-agent.ts` (dominio community) |
| `mel-crm.ts` | Indicadores de bienestar y resiliencia | 4 registros + corrientes unificadas |
| `registrySystem.ts` | Locations reales, red de barrios | Registro público de proyectos piloto |
| `boundaries.ts` | No especulación inmobiliaria | DENY rules contra "wellness realestate" como commodity |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D34

| ID | Decisión | Evidencia primaria (del documento RNMD) | Módulo afectado |
|----|----------|---------------------------------------|-----------------|
| D1-D20 | (previas: stack gobernanza TDF/OASA/Closer + manifiesto OASA: peso voto, verify on-chain, Snapshot, presence/sweat, staking, roles, DAO, agente, CRM, principios 3Rs, 7 generaciones, MRV) | `docs/oasa-tdf-governance-stack_integration.md`, `docs/oasa-manifesto_integration.md` | Múltiples |
| D21 | Marco modular 4 capas: hardware, humanware, economy/exchangeware, software/My.Co.Net | "hardware • humanware • economy • software" | 4 módulos `rnmd-*.ts` |
| D22 | Jerarquía de 3 necesidades: individual (salud, seguridad, aceptación, felicidad, creación, realización), colectiva, naturaleza (clima, alimento, agua resilientes) | "Hierarchy of needs I, II, III" | `rnmd-humanware.ts`, `mel-crm.ts` |
| D23 | 6 arquetipos: Vision Holder, Community Member, Service Provider, Resource Holder, Land Guardian, Collaborator | "archetype" list | `propertyRegimeSystem.ts`, `rnmd-humanware.ts` |
| D24 | Sistemas de recursos resilientes: agua, comida, energía, aire, residuos (♻️💧🍎⚡️🌬️) | "with resillient resource systems" | `tq-land.ts`, `mel-crm.ts` |
| D25 | Red opt-in de apoyo mutuo global | "opt in mutual support network" | `registrySystem.ts`, `currentSeeSystem.ts` |
| D26 | LLM integrada (My.Co.Net) como aplicación del barrio | "operates with an LLM integrated application" | `regenerative-agent.ts` (dominio community) |
| D27 | Bienestar individual y colectivo como métrica (no solo económica) | "individual well-being, collective well-being" | `rnmd-humanware.ts` |
| D28 | Open source y crowd-sourced: blueprint mejorado por la comunidad | "open source approach", "crowd and community sourced content" | `registrySystem.ts` append-only |
| D29 | No especulación inmobiliaria: "wellness realestate" no es commodity | "wellness realestate" como bienestar, no activo especulativo | `boundaries.ts` DENY |
| D30 | Locations reales como registros piloto: Akumal, Tulum, Roatan, San Diego, Austin, Quintana Roo, scout en 11 países | "Locations we have used..." / "scouting land" | `registrySystem.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `rnmd-hardware.ts` | Registro de sistemas de recursos (agua, comida, energía, aire, residuos); vivienda wellness no especulable | `tests/rnmd-hardware.test.ts` |
| `rnmd-humanware.ts` | 6 arquetipos definidos; bienestar individual/colectivo medible; Ikigai (propósito) | `tests/rnmd-humanware.test.ts` |
| `rnmd-economy.ts` | Exchangeware productivo; economía sostenible; no especulación | `tests/rnmd-economy.test.ts` |
| `rnmd-software.ts` | LLM como enriquecedor (no sustituto); dominio `community` operativo | `tests/rnmd-software.test.ts` |
| `mel-crm.ts` | Indicadores de bienestar y resiliencia de recursos; 4 registros | `tests/rnmd-mel-indicators.test.ts` |
| `boundaries.ts` | DENY: especulación inmobiliaria, LLM autónoma sin humano | `tests/boundaries-rnmd.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-rnmd.md` — marco modular 4 capas, arquetipos, sistemas de recursos, red opt-in, LLM integrada

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/rnmd.ts`: `RNMDModule`, `Archetype`, `ResourceSystem`, `WellbeingIndicator`, `MutualSupportNode`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `rnmd-hardware.ts`: `registerResourceSystem()`, `verifyResilience()` (agua, comida, energía, aire, residuos)
- `rnmd-humanware.ts`: `registerArchetype()`, `assessWellbeing()`, `computeIkigaiPath()`
- `rnmd-economy.ts`: `registerExchangeware()`, `assessEconomicSustainability()`
- `rnmd-software.ts`: `llmIntegratedApp()`, `communityDomain()` (LLM como enriquecedor)
- No importar My.Co.Net; no copiar UI de Regentribe; no usar LLM autónoma

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeRNMDState()`.
- Añadir `rnmd: RNMDState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ rnmd: {...st.rnmd, ...} }))`.
- Incluir `makeRNMDState()` en `resetAll()`.
- Incluir `rnmd: st.rnmd` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: marco modular RNMD (hardware, humanware, economy, software) + docs/spec`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/regenerative-neighborhood-rnmd_backup.md` (texto completo del documento RNMD)
- RegenTribe: https://www.regentribe.org
- TribesPlatform: https://www.TribesPlatform.app
- Contacto: hello@regenTribe.org, Grow@RegenTribe.org
- Specs existentes: `alrac-tq-oasa.md`, `alrac-tq-tdf.md`, `alrac-tq-land.md`, `alrac-tq-economia-comunes.md`, `alrac-tq-governance-verification.md`, `alrac-tq-presence-sweat.md`, `alrac-tq-regenerative-agent.md`, `alrac-tq-mel-crm.md`, `alrac-tq-monitoring-mrv.md`
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
