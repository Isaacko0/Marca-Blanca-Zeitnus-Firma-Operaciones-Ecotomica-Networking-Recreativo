# Integración Alianza Global de Interdependencias & Autonomías — GI3CF / GRID-GI3D / GI3

**Fuente asimilada:** `docs/alianza-global-gaia-gi3cf_backup.md` — Marco Global de Impacto, Innovación y Abundancia, Versión 1.4, 2026. Documento marco interno de la Alianza Global / Confederación Gaia-GEN.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). El documento describe un marco completo de gobernanza de impacto: taxonomía 7×16, matriz 16×3 (80 indicadores), 7 dimensiones transversales, GRID/GI3D (10 módulos), 4 Niveles de Confianza, 4 Niveles de Evidencia E0-E4, Índice GI3 = 0.50 I + 0.20 Q + 0.30 C, Pasaporte Gaia, 7 Insignias Especiales, 8 Bandas de Desarrollo, Sistema CoRe (9 capitales), marcos PASEO/OPAL, Holopedia, OriGen, Gaia GPS, Consejo de Custodia Gaia, y ciclo operativo de 10 pasos.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un perfil soberano y verificable** (Pasaporte Gaia) que registre identidad, capacidades, trayectoria, evidencias y reconocimientos sin depender de una autoridad central.
- **Clasificar su trabajo en una taxonomía común** (7 categorías, 16 subcategorías, especialidades abiertas) para que otros nodos puedan encontrarlo y colaborar.
- **Medir su impacto con un índice sintético** (GI3 = 0.50 I + 0.20 Q + 0.30 C) que nunca oculte el detalle granular del Tablero de Regeneración Integral (GRID/GI3D).
- **Hacer verificar sus resultados independientemente** (Niveles de Confianza 1-4, Consejo de Custodia Gaia, Niveles de Evidencia E0-E4), sin auto-validarse.
- **Registrar contribuciones multicapital** (Sistema CoRe, 9 capitales) con retribuciones monetarias y no monetarias.
- **Obtener reconocimientos verificables** (Insignias, 7 Insignias Especiales, 8 Bandas de Desarrollo) sin que se conviertan en certificaciones estatales automáticas.
- **Participar en una red fractal no jerárquica** (Nodos de cualquier escala: Individuo, Proyecto, Comunidad, BioHábitat, Biorregional, Nacional, Continental, Lingüístico, Global) sin que los nodos superiores tengan autoridad automática sobre los locales.
- **Usar infraestructura digital soberana** (Plataforma Central Gaia, QCORE, BeHolder, EVA, Holopedia, Gaia GPS, OriGen) con IA auditable y soberanía de datos (Fideicomiso de Datos, PASEO/OPAL).

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto GI3CF/Gaia | Módulo Zeitnus/ALRAC destino | Observación |
|---------------------|------------------------------|-------------|
| Taxonomía 7 categorías × 16 subcategorías + especialidades abiertas | `taxonomia-gaia.ts` (NUEVO) + `tq-types-extended.ts` | Clasificación de perfiles, proyectos, ofertas, necesidades, resultados |
| GRID/GI3D (10 módulos: identidad, clasificación, capacidades, necesidades, objetivos, actividades, evidencias, tablero regeneración, contribución ecosistema, trayectoria) | `grid-gi3d.ts` (NUEVO) + `registrySystem.ts` | Núcleo granular, no solo índice sintético |
| Índice GI3 = 0.50 I + 0.20 Q + 0.30 C con ICV ≥ 80% | `gi3-index.ts` (NUEVO) | Índice resumido que nunca reemplaza el detalle |
| 4 Niveles de Confianza + Consejo de Custodia Gaia | `niveles-confianza.ts` + `custodia-gaia.ts` (NUEVO) | Verificación independiente desde Nivel 2 |
| 4 Niveles de Evidencia E0-E4 | `niveles-evidencia.ts` (NUEVO) | Profundidad técnica de soportes |
| 7 dimensiones transversales de impacto | `dimensiones-trasversales.ts` (NUEVO) | Tipo de transformación sistémica |
| 7 Sistemas Integrales de la civilización Gaia | `sistemas-integrales.ts` (NUEVO) | Orientan inversión sistémica |
| Pasaporte Gaia + Visas Descentralizadas | `pasaporte-gaia.ts` (NUEVO) | Identidad soberana, credenciales, insignias |
| 7 Insignias Especiales + 8 Bandas de Desarrollo | `insignias-gaia.ts` + `bandas-desarrollo.ts` (NUEVO) | Reconocimientos sin conversión automática a certificación estatal |
| Sistema CoRe, 9 capitales, PASEO/OPAL | `core-redex.ts` (NUEVO) + `caas.ts` | 9 capitales operativos, 7 + 2 de reporte |
| Ciclo operativo 10 pasos | `ciclo-operativo.ts` (NUEVO) | Incorporación → clasificación → diagnóstico → compromisos → aprendizaje → ejecución → registro CoRe → verificación → GI3 → conexión |
| IA Auditable (Gaia GPS, EVA, Holopedia, OriGen) | `ia-auditable.ts` (NUEVO) | Datos verificables → procesos auditables → protocolos explícitos → IA |
| Fideicomiso de Datos (3 separaciones: datos personales, IP, bien común) | `fideicomiso-datos.ts` (NUEVO) | Soberanía de datos |
| Salvaguardas no negociables (no hacer daño, consentimiento, conflictos de interés, menores, rigor ético, saberes ancestrales, debido proceso) | `salvaguardas-gaia.ts` (NUEVO) + `boundaries.ts` | Límites duros |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Plataforma Central Gaia (MetaPlataforma Gaia Hub) como app específica | Infra de plataforma ajena | Lógica pura en TS; UI propia de HSCSG |
| Certificaciones estatales como conversión automática | El documento dice explícitamente que no se convierten automáticamente | Insignias y credenciales son reconocimientos verificables, no certificaciones estatales |
| Rankings lineales absolutos entre proyectos | El documento lo prohíbe explícitamente | Perfiles multidimensionales y evolución en el tiempo |
| Doble conteo cuando un proyecto pertenece a varios nodos | El documento lo prohíbe explícitamente | Distinción entre atribución directa y contribución compartida |
| IA que inventa evidencia o sustituye validación humana | El documento lo prohíbe explícitamente | IA asiste y sintetiza, nunca sustituye |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de GI3CF/Gaia |
|--------|---------------------|
| `src/core/lib/taxonomia-gaia.ts` | (NUEVO) Taxonomía 7×16, especialidades abiertas |
| `src/core/lib/grid-gi3d.ts` | (NUEVO) 10 módulos del tablero granular |
| `src/core/lib/gi3-index.ts` | (NUEVO) Fórmula GI3, ICV, componentes I/Q/C |
| `src/core/lib/niveles-confianza.ts` | (NUEVO) 4 niveles + Consejo de Custodia |
| `src/core/lib/niveles-evidencia.ts` | (NUEVO) E0-E4 |
| `src/core/lib/dimensiones-trasversales.ts` | (NUEVO) 7 dimensiones |
| `src/core/lib/sistemas-integrales.ts` | (NUEVO) 7 sistemas integrales |
| `src/core/lib/pasaporte-gaia.ts` | (NUEVO) Identidad soberana, credenciales, insignias |
| `src/core/lib/insignias-gaia.ts` | (NUEVO) 7 insignias especiales |
| `src/core/lib/bandas-desarrollo.ts` | (NUEVO) 8 bandas |
| `src/core/lib/core-redex.ts` | (NUEVO) CoRe, 9 capitales, PASEO/OPAL |
| `src/core/lib/ciclo-operativo.ts` | (NUEVO) 10 pasos |
| `src/core/lib/ia-auditable.ts` | (NUEVO) IA auditable, Gaia GPS, Holopedia, OriGen |
| `src/core/lib/fideicomiso-datos.ts` | (NUEVO) 3 separaciones de datos |
| `src/core/lib/salvaguardas-gaia.ts` | (NUEVO) Salvaguardas no negociables |
| `src/core/state/gi3cf.ts` | (NUEVO) Estado del marco GI3CF |
| `src/core/lib/boundaries.ts` | DENY: rankings absolutos, doble conteo, IA sustituta, certificación automática |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- GI3CF: principio de no hacer daño, salvaguardas no negociables, no neutralización de daños (GI3 alto no compensa daños graves), consentimiento y soberanía de datos, saberes ancestrales.
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** el principio de no neutralización de daños es un límite duro idéntico a la Ley I.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- GI3CF: acceso voluntario y universal, cada Actor define sus propios objetivos/metas/indicadores, autonomía de cada Nodo, gobierno policéntrico y holónico.
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** la autonomía de cada Nodo y la definición propia de compromisos son isomórficas al acceso por contribución real.

### Ley III — Lucidez, nunca engañar
- GI3CF: transparencia y trazabilidad, 4 estados de la información (Auto-Declarado/Documentado/Verificado/Certificación Oficial), verificación independiente desde Nivel 2, no convertir declaración propia en hecho verificado.
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables.
- **Resonancia:** la distinción entre lo declarado y lo verificado es fundamental en ambos.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- GI3CF: entrada voluntaria y universal, cada Actor define sus propios compromisos, retribuciones monetarias y no monetarias vía CoRe, 9 capitales.
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel.
- **Resonancia:** la contribución y el reconocimiento son multicapital, no solo monetarios.

---

## 4. Tabla de mapeo isomórfico (GI3CF/Gaia → Zeitnus/ALRAC)

| Concepto GI3CF/Gaia | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|---------------------|----------------------|------|----------|--------|
| Taxonomía 7×16 + especialidades abiertas | `taxonomia-gaia.ts` | Capa 4 | Ley II | **Pendiente** |
| GRID/GI3D (10 módulos granulares) | `grid-gi3d.ts` + `registrySystem.ts` | Capa 4 | Ley III | **Pendiente** |
| Índice GI3 = 0.50 I + 0.20 Q + 0.30 C | `gi3-index.ts` | Capa 5 | Ley II | **Pendiente** |
| 4 Niveles de Confianza + Consejo de Custodia | `niveles-confianza.ts` + `custodia-gaia.ts` | Capa 0/1 | Ley III | **Pendiente** |
| 4 Niveles de Evidencia E0-E4 | `niveles-evidencia.ts` | Capa 4 | Ley III | **Pendiente** |
| 7 dimensiones transversales | `dimensiones-trasversales.ts` | Capa 4 | Ley II | **Pendiente** |
| 7 Sistemas Integrales | `sistemas-integrales.ts` | Capa 5 | Ley II | **Pendiente** |
| Pasaporte Gaia + Visas Descentralizadas | `pasaporte-gaia.ts` | Capa 4 | Ley III | **Pendiente** |
| 7 Insignias Especiales + 8 Bandas | `insignias-gaia.ts` + `bandas-desarrollo.ts` | Capa 4 | Ley II | **Pendiente** |
| CoRe: 9 capitales, PASEO/OPAL | `core-redex.ts` + `caas.ts` | Capa 5 | CaaS | **Pendiente** |
| Ciclo operativo 10 pasos | `ciclo-operativo.ts` | Capa 4 | Ley II | **Pendiente** |
| IA Auditable (Gaia GPS, EVA, Holopedia, OriGen) | `ia-auditable.ts` | Capa 4 | Ley III | **Pendiente** |
| Fideicomiso de Datos (3 separaciones) | `fideicomiso-datos.ts` | Capa 0/1 | Ley I/III | **Pendiente** |
| Salvaguardas no negociables | `salvaguardas-gaia.ts` + `boundaries.ts` | Capa 0 | Ley I | **Pendiente** |
| No rankings absolutos, no doble conteo | `boundaries.ts` DENY | Capa 0 | Ley I/III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO copiar) |
|---------------------------------------------|----------------------------------|
| Taxonomía 7×16, matriz 16×3 (80 indicadores), 7 dimensiones, 7 sistemas integrales | Plataforma Central Gaia como app específica |
| GRID/GI3D (10 módulos, granularidad, trazabilidad, verificabilidad) | Rankings lineales absolutos entre proyectos |
| Índice GI3 con ICV ≥ 80%, componentes I/Q/C, fórmulas Fᵢ/Eᵢ/Rᵢ/Vᵢ | Doble conteo cuando un proyecto pertenece a varios nodos |
| 4 Niveles de Confianza, Consejo de Custodia Gaia, 4 Niveles de Evidencia E0-E4 | Certificaciones estatales como conversión automática |
| Pasaporte Gaia, Visas Descentralizadas, 7 Insignias Especiales, 8 Bandas | IA que sustituye validación humana o inventa evidencia |
| CoRe: 9 capitales, PASEO/OPAL, Tesoro de los Comunes | Conversión automática de GI3 en asignación de capital |
| Ciclo operativo 10 pasos | — |
| IA Auditable (datos verificables → procesos auditables → protocolos → IA) | — |
| Fideicomiso de Datos (3 separaciones), PASEO/OPAL | — |
| Salvaguardas no negociables (no hacer daño, consentimiento, conflictos de interés, saberes ancestrales, debido proceso) | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión GI3CF/Gaia | Vaso comunicante |
|----------------|---------------------|------------------|
| `taxonomia-gaia.ts` | Taxonomía 7×16, especialidades abiertas | `tq-types-extended.ts` tipos de Actor/Nodo |
| `grid-gi3d.ts` | 10 módulos, granularidad, trazabilidad | `registrySystem.ts` (4 registros), `currentSeeSystem.ts` |
| `gi3-index.ts` | Fórmula GI3, ICV, componentes I/Q/C | `tq.ts` (TQ como unidad contable), `znu.ts` |
| `niveles-confianza.ts` + `custodia-gaia.ts` | Verificación independiente Niveles 2-4 | `rao.ts` (procedencia de evidencias) |
| `niveles-evidencia.ts` | E0-E4 | `tq-valueflows.ts` (eventos observation/claim/fulfillment) |
| `dimensiones-trasversales.ts` + `sistemas-integrales.ts` | Transformación sistémica, inversión sistémica | `caas.ts` (streams de impacto) |
| `pasaporte-gaia.ts` + `insignias-gaia.ts` + `bandas-desarrollo.ts` | Identidad soberana, credenciales, reconocimientos | `registrySystem.ts` (registro de identidades) |
| `core-redex.ts` | 9 capitales, PASEO/OPAL, retribución multicapital | `caas.ts` + `znu.ts` (moneda anfibia) |
| `ciclo-operativo.ts` | 10 pasos de evaluación continua | `tq-valueflows.ts` (trazabilidad de ciclos) |
| `ia-auditable.ts` | Gaia GPS, EVA, Holopedia, OriGen, IA auditable | `regenerative-agent.ts` (dominios existentes) |
| `fideicomiso-datos.ts` | 3 separaciones de datos | `boundaries.ts` (DENY confusión de datos) |
| `salvaguardas-gaia.ts` | Salvaguardas no negociables | `boundaries.ts` (DENY daños no divulgados) |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D22

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Taxonomía 7 categorías principales × 16 subcategorías + especialidades abiertas curadas | Sección 7, tabla D1-D7 | `taxonomia-gaia.ts` |
| D2 | Matriz 16×3: 1 Objetivo de Impacto por subcategoría, 5 indicadores orientativos por objetivo (80 totales) | Sección 8, T01-T16 | `taxonomia-gaia.ts` |
| D3 | 7 dimensiones transversales de impacto sistémico | Sección 9 | `dimensiones-trasversales.ts` |
| D4 | 7 Sistemas Integrales de la civilización Gaia | Sección 9.1 | `sistemas-integrales.ts` |
| D5 | GRID/GI3D: 10 módulos, granularidad sin agregación, trazabilidad, verificabilidad, temporalidad, contextualización | Sección 6.1-6.3 | `grid-gi3d.ts` |
| D6 | Índice GI3 = 0.50 I + 0.20 Q + 0.30 C, escala 0-100, ICV ≥ 80% para GI3 definitivo | Sección 11 | `gi3-index.ts` |
| D7 | Fórmula I = Σ(wᵢ × Rᵢ × Vᵢ) ÷ Σ wᵢ, donde Vᵢ = 1 solo con verificación independiente (Nivel 2-4) | Sección 11.1.C | `gi3-index.ts` |
| D8 | Fᵢ = cumplimiento, Eᵢ = efectividad ecológica/social/funcional, Rᵢ = (Fᵢ × Eᵢ) ÷ 100 | Sección 11.1.B | `gi3-index.ts` |
| D9 | 4 Niveles de Confianza (1 Auto-atestiguado, 2 Comunidad/Pares, 3 Embajador Gaia, 4 Terceros) validados por Consejo de Custodia | Sección 10.2 | `niveles-confianza.ts` + `custodia-gaia.ts` |
| D10 | 4 Niveles de Evidencia E0-E4 (20/40/60/80/100 pts orientativos) | Sección 10.4 | `niveles-evidencia.ts` |
| D11 | Componente Q: 5 dimensiones (Q1 coherencia 20%, Q2 gobernanza 20%, Q3 transparencia 20%, Q4 documentación 25%, Q5 integridad 15%) | Sección 11.2 | `gi3-index.ts` |
| D12 | Componente C: 5 dimensiones (C1 alianzas 20%, C2 formación 20%, C3 capitales a bienes comunes 20%, C4 documentación 20%, C5 replicación 20%) | Sección 11.3 | `gi3-index.ts` |
| D13 | Pasaporte Gaia: identidad soberana, credenciales, insignias, Visas Descentralizadas | Sección 12.1 | `pasaporte-gaia.ts` |
| D14 | 7 Insignias Especiales + 8 Bandas de Desarrollo (Semilla a Mundo) | Sección 12.3-12.4 | `insignias-gaia.ts` + `bandas-desarrollo.ts` |
| D15 | Sistema CoRe: 9 capitales operativos, vista sintética 7 + 2 divulgaciones (Material/Manufacturado, Ético) | Sección 13.1 | `core-redex.ts` |
| D16 | Marcos PASEO (participación/corresponsabilidad) y OPAL (licenciamiento PI, atribución justa) | Sección 13.1, 15.2 | `core-redex.ts` |
| D17 | Ciclo operativo 10 pasos (incorporación → clasificación → diagnóstico → compromisos → aprendizaje → ejecución → registro CoRe → verificación → GI3 → conexión) | Sección 17 | `ciclo-operativo.ts` |
| D18 | IA Auditable: datos verificables → procesos auditables → protocolos explícitos → IA; la IA asiste, nunca inventa evidencia ni sustituye validación humana | Sección 15.2 | `ia-auditable.ts` |
| D19 | Fideicomiso de Datos: 3 separaciones (datos personales, IP de desarrolladores, bien común) | Sección 15.2 | `fideicomiso-datos.ts` |
| D20 | Salvaguardas no negociables: no hacer daño, consentimiento/privacidad, conflictos de interés, menores, rigor ético salud, saberes ancestrales, debido proceso/apelación | Sección 16.2 | `salvaguardas-gaia.ts` + `boundaries.ts` |
| D21 | No rankings lineales absolutos; no doble conteo; no neutralización de daños (GI3 alto no compensa daños graves) | Sección 11.4.C | `boundaries.ts` DENY |
| D22 | Entrada voluntaria y universal; 4 estados de la información (Auto-Declarado/Documentado/Verificado/Certificación Oficial) | Sección 5.1 | `grid-gi3d.ts` + `niveles-confianza.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `taxonomia-gaia.ts` | 7 categorías, 16 subcategorías, especialidades abiertas, actor puede tener múltiples subcategorías | `tests/taxonomia-gaia.test.ts` |
| `grid-gi3d.ts` | 10 módulos, 4 estados de información, trazabilidad por dato | `tests/grid-gi3d.test.ts` |
| `gi3-index.ts` | GI3 = 0.50 I + 0.20 Q + 0.30 C; ICV ≥ 80% para definitivo; Vᵢ = 0 si Nivel 1 | `tests/gi3-index.test.ts` |
| `niveles-confianza.ts` | 4 niveles, Consejo de Custodia valida Niveles 2-3, Nivel 4 externo | `tests/niveles-confianza.test.ts` |
| `niveles-evidencia.ts` | E0-E4 con puntos orientativos 20/40/60/80/100 | `tests/niveles-evidencia.test.ts` |
| `pasaporte-gaia.ts` | Identidad soberana, credenciales verificadas, insignias, Visas Descentralizadas | `tests/pasaporte-gaia.test.ts` |
| `core-redex.ts` | 9 capitales, vista 7+2, PASEO/OPAL | `tests/core-redex.test.ts` |
| `boundaries.ts` | DENY: rankings absolutos, doble conteo, IA sustituta, certificación automática, GI3 compensa daños | `tests/boundaries-gi3cf.test.ts` |
| `ciclo-operativo.ts` | 10 pasos, ICV ≥ 80% para GI3 definitivo | `tests/ciclo-operativo.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK; rutas preview 200.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-gi3cf.md` — taxonomía, GRID/GI3D, índice GI3, niveles confianza/evidencia, pasaporte, insignias, CoRe, ciclo operativo, IA auditable, fideicomiso, salvaguardas

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/gi3cf.ts`: `Actor`, `Nodo`, `ObjetivoImpacto`, `Indicador`, `DimensionTransversal`, `SistemaIntegral`, `NivelConfianza`, `NivelEvidencia`, `ResultadoVerificado`, `Insignia`, `BandaDesarrollo`, `CapitalCoRe`, `PasaporteGaia`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `taxonomia-gaia.ts`: `registrarActor()`, `clasificarTaxonomia()`, `asignarEspecialidad()`
- `grid-gi3d.ts`: `crearModulo()`, `registrarDato()`, `rastrearOrigen()`, `marcarVerificado()`
- `gi3-index.ts`: `calcularGI3()`, `calcularICV()`, `calcularFi()`, `calcularEi()`, `calcularRi()`, `calcularVi()`
- `niveles-confianza.ts`: `asignarNivel()`, `validarConsejoCustodia()`
- `niveles-evidencia.ts`: `asignarNivelEvidencia()`
- `pasaporte-gaia.ts`: `crearPasaporte()`, `agregarInsignia()`, `agregarCredencialExterna()`
- `insignias-gaia.ts` + `bandas-desarrollo.ts`: `otorgarInsigniaEspecial()`, `asignarBanda()`
- `core-redex.ts`: `registrarAporteCapital()`, `acordarRetribucion()`
- `ciclo-operativo.ts`: `ejecutarPaso()` (1-10)
- `ia-auditable.ts`: `validarOrigenRecomendacion()`
- `fideicomiso-datos.ts`: `separarDatos()`
- `salvaguardas-gaia.ts`: `verificarSalvaguardas()`
- `boundaries.ts`: DENY rankings, doble conteo, IA sustituta, certificación automática
- No usar semillas ficticias, no convertir GI3 en capital automático, no permitir doble conteo

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeGi3cfState()`.
- Añadir `gi3cf: Gi3cfState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ gi3cf: {...st.gi3cf, ...} }))`.
- Incluir `makeGi3cfState()` en `resetAll()`.
- Incluir `gi3cf: st.gi3cf` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: marco GI3CF/Gaia (taxonomía, GRID/GI3D, índice GI3, niveles confianza/evidencia, pasaporte, insignias, CoRe, ciclo operativo) + docs/spec`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/alianza-global-gaia-gi3cf_backup.md` (texto completo del documento marco v1.4)
- `openspec/specs/alrac-tq-valueflows.md` (observation/claim/fulfillment, eventos REA)
- `openspec/specs/alrac-tq-desmercantilizacion.md` (CaaS Streams, ZNU)
- `openspec/specs/alrac-tq-economia-comunes.md` (excedentes reinvertidos, no dividendos)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe relación)
- `docs/CAOS_MODELONEGOCIO_ANALISIS.md` (γ-CARMIS, αʰ, κ, Paso II)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/currentSeeSystem.ts` (corrientes unificadas)
- `src/core/lib/regenerative-agent.ts` (dominios existentes para IA auditable)
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
