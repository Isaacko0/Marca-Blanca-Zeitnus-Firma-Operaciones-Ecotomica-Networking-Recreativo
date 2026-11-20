# Integración Edible City of Andernach — Espacios Públicos Productivos y Agricultura Urbana

**Fuente asimilada:** `docs/andernach-edible-city_backup.md` — Edible City of Andernach, Alemania (Urban Green Blue Grids 2022, USE 2022, Daniel Stanke 2022, ciudad de Andernach). Todos los derechos de autor permanecen con los titulares correspondientes.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). Andernach aporta el modelo de espacios públicos productivos ("picking allowed"), agricultura urbana multifuncional, biodiversidad alimentaria (101 variedades de tomate en 2010, luego frijoles, cebollas, coles), huerto de permacultura de 14 ha en Eich sin pesticidas, jardines escolares, participación ciudadana en plantación/cosecha, premio Entente Florale (oro), y el concepto CPUL (Continuous Productive Urban Landscape) como referencia de red conectada.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Espacios públicos productivos, no solo ornamentales**: huertos de vegetales y frutas en parques, rotondas, jardines de castillo, terrenos baldíos; "picking allowed" (recoger permitido).
- **Agricultura urbana multifuncional**: biodiversidad, ecología, economía local, estética, bienestar de residentes; multi-sensorial (vista, olfato, gusto).
- **Seguridad alimentaria local**: producción distribuida en toda la ciudad; si se consume en el centro, el distrito de Eich (14 ha permacultura) garantiza suministro continuo.
- **Participación ciudadana en plantación y cosecha**: educación en estacionalidad y horticultura; residentes como co-gestores, no solo consumidores pasivos.
- **Variedad y especies olvidadas**: cada año una planta destacada con decenas de variedades (tomate 2010, frijol 2011, cebolla 2012, col 2013); promoción de cultivos olvidados y útiles.
- **Red conectada de espacios productivos**: aunque Andernach no tiene espacios conectados como CPUL, el usuario quiere la opción de conectarlos (vaso comunicante entre huertos urbanos).
- **Medición y reconocimiento**: premio Entente Florale (oro) como validación externa de calidad ambiental y de vida.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto Andernach | Módulo Zeitnus/ALRAC destino | Observación |
|--------------------|------------------------------|-------------|
| Espacios públicos productivos (huertos urbanos, frutales, rotondas) | `tq-land.ts` (`landType='urban_agriculture'`) + nuevo `andernach-edible-city.ts` | Registro de tierra productiva urbana en kWh/año |
| "Picking allowed" (recoger permitido, acceso gratuito) | `propertyRegimeSystem.ts` (Non-Dominium, uso común) + `boundaries.ts` | Derecho de uso sin título, sin especulación |
| Huerto de permacultura Eich (14 ha, sin pesticidas, solo fertilizantes minerales) | `tq-land.ts` (`regenerationIndex`, tipo `permaculture`) | Límite duro: sin pesticidas sintéticos |
| Planta destacada por año con decenas de variedades | `andernach-edible-city.ts` (`featuredPlantPerYear`, `varietalDiversity`) | Registro anual de biodiversidad cultivada |
| Participación ciudadana (plantar, cuidar, cosechar) | `contributionAccounting.ts` + `registrySystem.ts` | Contribución registrada, sweat equity urbano |
| Jardines escolares, huertos móviles, playground natural | `mel-crm.ts` (indicadores educativos) + `tq-land.ts` | Educación ambiental como indicador MEL |
| Premio Entente Florale (oro) | `mel-crm.ts` (indicador de validación externa) | MRV de calidad ambiental y de vida |
| Concepto CPUL (red conectada de espacios productivos) | `myconet-hive.ts` + `currentSeeSystem.ts` | Vaso comunicante entre huertos urbanos (opcional, no obligatorio) |
| Multi-sensorial (vista, olfato, gusto) | `regenerative-agent.ts` (dominio `community`/`biodiversity`) | Evaluación cualitativa de experiencia sensorial |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Sitio web municipal andernach.de | Infra de comunicación ajena | Lógica pura en TS; registro de espacios como datos |
| Premios/concursos externos (Entente Florale) | Validación externa opcional | Indicador MEL opcional, no motor del sistema |
| CPUL como red física obligatoria | Concepto de diseño urbano, no infra de software | Vaso comunicante opcional vía Myconet Hive |
| Gestión municipal tradicional | Infra de gobierno local | Gobernanza holónica 1a1v de Zeitnus |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de Andernach |
|--------|---------------------|
| `src/core/lib/tq-land.ts` | Extender: `urban_agriculture`, `permaculture`, `regenerationIndex`, variedades por año |
| `src/core/lib/andernach-edible-city.ts` | (NUEVO) Espacios públicos productivos, "picking allowed", planta destacada anual |
| `src/core/lib/propertyRegimeSystem.ts` | Non-Dominium para espacios públicos productivos |
| `src/core/lib/contributionAccounting.ts` | Participation ciudadana como contribución registrable |
| `src/core/lib/mel-crm.ts` | Indicadores: biodiversidad cultivada, premio Entente Florale, jardines escolares |
| `src/core/lib/boundaries.ts` | DENY: pesticidas sintéticos, especulación en tierra urbana productiva, acceso restringido ("Betreten verboten") |
| `openspec/specs/alrac-tq-edible-city.md` | (NUEVA) Spec: espacios públicos productivos, agricultura urbana multifuncional |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Andernach: sin pesticidas en huerto Eich (solo fertilizantes minerales), biodiversidad, suelo sano, alimento gratuito para residentes.
- HSCSG: MJ Gate bloquea acciones que degraden suelo/biodiversidad; `boundaries.ts` DENY pesticidas sintéticos y acceso restringido.
- **Resonancia:** el modelo "picking allowed" sin químicos dañinos se codifica como límites duros.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Andernach: residentes participan en plantación/cosecha; el alimento es bien común, no mercancía; el distrito de Eich garantiza suministro.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** la contribución ciudadana (trabajo en huertos) genera acceso a alimento; el suministro se distribuye sin intermediarios especulativos.

### Ley III — Lucidez, nunca engañar
- Andernach: "Pflücken erlaubt statt Betreten verboten" (recoger permitido en lugar de entrada prohibida); premio Entente Florale como validación pública; educación en estacionalidad.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros públicos de producción y participación.
- **Resonancia:** todo flujo de producción y acceso es público y verificable; nada se oculta tras muros.

### CaaS (Comunidad como Servicio)
- Andernach: acceso a alimento por derecho de uso común, no por compra; participación en cuidado como forma de membresía.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** el acceso al alimento se gana con contribución al cuidado común, no con poder adquisitivo.

---

## 4. Tabla de mapeo isomórfico (Andernach → Zeitnus/ALRAC)

| Concepto Andernach | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|--------------------|----------------------|------|----------|--------|
| Espacios públicos productivos (huertos, frutales, rotondas) | `tq-land.ts` `landType='urban_agriculture'` | Capa 1 | Ley I | **Pendiente** |
| "Picking allowed" (acceso gratuito, sin título) | `propertyRegimeSystem.ts` Non-Dominium | Capa 1 | Ley I/III | **Pendiente** |
| Huerto permacultura Eich (14 ha, sin pesticidas) | `tq-land.ts` tipo `permaculture`, `regenerationIndex` | Capa 1 | Ley I | **Pendiente** |
| Planta destacada anual + variedades | `andernach-edible-city.ts` `featuredPlantPerYear` | Capa 4 | Ley II | **Pendiente** |
| Participación ciudadana (plantar, cuidar, cosechar) | `contributionAccounting.ts` | Capa 3 | Ley II | **Pendiente** |
| Jardines escolares, educación en estacionalidad | `mel-crm.ts` indicadores educativos | Capa 4 | Ley III | **Pendiente** |
| Premio Entente Florale (oro) | `mel-crm.ts` indicador validación externa | Capa 4 | Ley III | **Pendiente** |
| Red conectada CPUL (opcional) | `myconet-hive.ts` | Capa 4 | CaaS | **Pendiente** |
| No pesticidas sintéticos | `boundaries.ts` DENY rules | Capa 0 | Ley I | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|-----------------------------------|
| Registro de espacios públicos productivos | Sitio web municipal, gestión directa de la ciudad |
| "Picking allowed" como derecho de uso común | Políticas de acceso restringido municipal |
| Huerto de permacultura sin pesticidas | Uso de pesticidas sintéticos, agroquímicos |
| Biodiversidad cultivada (variedades anuales) | Monocultivo industrial, semillas patentadas |
| Participación ciudadana como contribución | Trabajo asalariado municipal exclusivamente |
| Red conectada de espacios productivos (CPUL opcional) | Infra física de conexión obligatoria |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión Andernach | Vaso comunicante |
|----------------|---------------------|------------------|
| `tq-land.ts` | Espacios públicos productivos, permacultura Eich | RAO de tierra urbana productiva |
| `andernach-edible-city.ts` | "Picking allowed", planta destacada anual | Registro de acceso común y biodiversidad |
| `propertyRegimeSystem.ts` | Non-Dominium de espacios públicos | Custodio temporal, recall comunitario |
| `contributionAccounting.ts` | Participación ciudadana en plantación/cosecha | Contribución registrable, sweat urbano |
| `mel-crm.ts` | Biodiversidad, premio Entente Florale, jardines escolares | Indicadores MEL de calidad ambiental |
| `myconet-hive.ts` | Red conectada de espacios productivos (CPUL) | Vaso comunicante entre barrios/huertos |
| `boundaries.ts` | Sin pesticidas, sin especulación, sin acceso restringido | DENY rules contra agroquímicos y privatización |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D12

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Espacios públicos transformados en huertos de vegetales y frutas con acceso gratuito ("picking allowed") | "Andernach city has developed it's public green spaces as vegetable and fruit patches for all to freely pick" | `andernach-edible-city.ts`, `propertyRegimeSystem.ts` |
| D2 | Objetivo multifuncional: biodiversidad, ecología, economía, atracción urbana, bienestar de residentes; experiencia multi-sensorial | "enhance the biodiversity, ecology, economy and attraction to the city as well as the wellbeing of the residents" | `tq-land.ts`, `mel-crm.ts` |
| D3 | Premio Entente Florale (oro) por calidad de green environment y calidad de vida | "won a gold medal in the Entente Florale international competition" | `mel-crm.ts` |
| D4 | Planta destacada por año con decenas de variedades (tomate 2010, frijol 2011, cebolla 2012, col 2013); promoción de cultivos olvidados | "Each year a different type of plant is featured... tens of varieties" | `andernach-edible-city.ts` |
| D5 | Huerto de permacultura Eich: 14 ha, sin pesticidas, solo fertilizantes minerales; suministro continuo de productos frescos | "The suburb of Eich has established a 14 hectare permaculture garden which does not use pesticides" | `tq-land.ts`, `boundaries.ts` |
| D6 | Participación ciudadana en plantación, cuidado y cosecha; educación en estacionalidad y horticultura | "Residents are encouraged to participate in the planting, tending to and harvesting" | `contributionAccounting.ts` |
| D7 | Alimento fresco y saludable disponible para todos; suministro garantizado desde Eich si se consume el centro | "This ensures residents always have access to fresh produce" | `propertyRegimeSystem.ts`, `mel-crm.ts` |
| D8 | Conversión de Wechselbeete (camas de cambio costosas) a Staudenbeete (camas de plantas perennes sostenibles); rotondas Am Wasserturm y Johannesplatz | "Umgestaltung der kostenaufwändigen Wechselbeete in nachhaltige Staudenbeete" | `tq-land.ts`, `andernach-edible-city.ts` |
| D9 | Árboles frutales comestibles y estéticamente atractivos en Stadtgraben (almendro, durazno, níspero, peral espaldera) | "Im Bereich des Stadtgrabens wurde eine Vielzahl essbarer und ästhetisch ansprechender Gehölze gepflanzt" | `tq-land.ts` |
| D10 | Jardines escolares, playground natural en Miesenheim, huerto escolar móvil; educación en sostenibilidad | "Im Bereich der Grundschulen sind Schulgärten entstanden... naturnaher Erlebnisspielplatz" | `mel-crm.ts` |
| D11 | Espacios no conectados como CPUL, pero reflejan elementos del concepto (red opcional) | "Although the public spaces are not connected, as they would be with the CPUL concept" | `myconet-hive.ts` (opcional) |
| D12 | No pesticidas sintéticos; acceso público sin restricción de entrada ("Betreten verboten" → "Pflücken erlaubt") | "Pflücken erlaubt statt Betreten verboten" | `boundaries.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `tq-land.ts` (urban agriculture) | Registro de espacio productivo urbano; tipo `permaculture` rechaza pesticidas; `regenerationIndex` en [0,1] | `tests/tq-land-urban.test.ts` |
| `andernach-edible-city.ts` | Planta destacada anual con variedades; `pickingAllowed=true`; rechaza acceso restringido | `tests/andernach-edible-city.test.ts` |
| `propertyRegimeSystem.ts` | Non-Dominium para espacio público; rechaza título privado sobre huerto urbano | `tests/property-regime-urban.test.ts` |
| `contributionAccounting.ts` | Contribución ciudadana registrada (plantar/cosechar); sweat equity urbano | `tests/contribution-urban.test.ts` |
| `mel-crm.ts` | Indicador biodiversidad cultivada; premio Entente Florale opcional; jardines escolares contabilizados | `tests/mel-crm-urban.test.ts` |
| `boundaries.ts` | DENY: pesticidas sintéticos, especulación en tierra urbana, acceso restringido | `tests/boundaries-urban.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-edible-city.md` — espacios públicos productivos, "picking allowed", planta destacada anual, permacultura, multifuncionalidad

### Fase 3.2 — Tipos (`src/core/state/`)
- Extender `tq-types-extended.ts`: `UrbanAgricultureEntry`, `FeaturedPlant`, `EdibleCityParticipation`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `andernach-edible-city.ts`: `registerEdibleSpace()`, `setFeaturedPlantYear()`, `verifyPickingAllowed()`, `calculateBiodiversityIndex()`
- Extender `tq-land.ts`: `registerUrbanAgriculture()`, `verifyNoPesticides()`, `registerPermacultureGarden()`
- No importar web municipal; no usar gestión directa de ciudad; no copiar contenido de andernach.de

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeEdibleCityState()`.
- Añadir `edibleCity: EdibleCityState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ edibleCity: {...st.edibleCity, ...} }))`.
- Incluir `makeEdibleCityState()` en `resetAll()`.
- Incluir `edibleCity: st.edibleCity` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: Edible City Andernach (espacios públicos productivos, picking allowed, permacultura) + docs/spec`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/andernach-edible-city_backup.md` (texto completo de la fuente)
- Urban Green Blue Grids (2022): estudio de caso Edible City Andernach
- USE (2022): girasoles frente a casas adosadas
- Daniel Stanke (2022): huerto permacultura Eich, 14 ha
- Ciudad de Andernach: https://www.andernach.de/stadt/essbare-stadt/
- CPUL (Continuous Productive Urban Landscape): concepto de referencia para red conectada
- Entente Florale: competencia internacional de calidad ambiental urbana
- `docs/ALRAC_MASTER_INTEGRADO.md`, `docs/simulacion_4agent_20260919/COMPARATIVE_ANALYSIS.md`
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
