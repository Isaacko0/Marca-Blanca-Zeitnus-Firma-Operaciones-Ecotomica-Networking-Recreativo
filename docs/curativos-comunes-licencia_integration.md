# Integración Licencia Curativos Comunes 1.0 — ALRAC/Zeitnus

**Fuente asimilada:** `docs/curativos-comunes-licencia_backup.md` — Licencia Curativos Comunes 1.0, Hackeo Cultural / Milpamérica, Noviembre 2026, CuC 1.0.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo` (Core ALRAC / Zeitnus, TypeScript puro, OpenSpec, 5 capas + Capa 0).

**Estado:** Propuesta de arquitectura (a implementar). La licencia es de terceros (Hackeo Cultural / Milpamérica); se asimila como especificación de licenciamiento de bienes comunes con corazón (Puedes/Siempre/Nunca/Derivados) y 4 cuidados-semilla opcionales (M, F, C, Q). Conecta con CVNT (valor no transaccional), desmercantilización (care_income), economía del común, TQ, ZNU, CaaS, autotrofia y límites duros de `boundaries.ts`.

---

## 1. Perspectiva USUARIO (qué quiere el nodo en su Cosateca)

El usuario del nodo quiere:

- **Un marco de licenciamiento de bienes comunes** que no sea propiedad intelectual de una persona o colectiva, sino una "milpa que cuidamos entre todas".
- **Corazón de la licencia con 4 partes obligatorias:** Puedes (permisos), Siempre (atribución, cambios, tecnologías usadas), Nunca (restricciones: dañar la tierra, violencia, IA corporativa, acumulación capitalista), Derivados (no privatización, reciprocidad).
- **4 cuidados-semilla opcionales:** Maíz (M) Compartir igual, Frijol (F) Sin algoritmos, Calabaza (C) Sin lucro, Quelite (Q) Autonomía.
- **Código de licencia legible:** #CurativosComunes + CuC-[Clave] 1.0 (ej. CuC-MFCQ 1.0).
- **Metadatos de publicación:** publicante, pueblo ancestral, territorio, fecha, licencia, cuidados, link.
- **Justicia comunitaria no punitiva:** al romper el acuerdo, detener el daño, reparar, evitar repetición, devolver como comunes; perder el permiso pero el común sigue vigente para las demás.
- **Tres piedras del comal** como preguntas hermenéuticas: ¿digno para personas-comunidades sin extraer ni acumular? ¿respetar territorios y espíritus? ¿cura de la Madre Tierra?
- **No es documento legal vinculante:** acuerdo entre personas y comunidades, justicia comunitaria no punitiva.
- **Incompatibilidad con extracción:** anti-capitalista, anti-colonial, no entrenar IA corporativa, no crecimiento económico sin fin.

Zeitnus/ALRAC le da la **máquina soberana**: TQ como unidad contable (1 kWh), ZNU como moneda anfibia, Leyes del Materialismo Jerárquico como límites duros, gobernanza holónica 1a1v, y límites duros en `boundaries.ts`.

---

## 2. Perspectiva LLM (qué asimilar / qué extirpar)

### 2.1 Asimilar (concepto → módulo Zeitnus/ALRAC)

| Concepto Curativos Comunes | Módulo Zeitnus/ALRAC destino | Observación |
|----------------------------|------------------------------|-------------|
| Corazón: Puedes / Siempre / Nunca / Derivados | `curativos-comunes-licencia.ts` (NUEVO) | Reglas base de todo material |
| Cuidados-semilla M, F, C, Q | `curativos-comunes-licencia.ts` | Reglas opcionales que se suman al corazón |
| Código CuC-[Clave] 1.0 + #CurativosComunes | `curativos-comunes-licencia.ts` | Identificador de licencia legible |
| Metadatos: publicante, pueblo ancestral, territorio, fecha, link | `curativos-comunes-licencia.ts` + `registrySystem.ts` | Registro de publicación |
| Justicia comunitaria no punitiva (detener daño, reparar, evitar repetición) | `curativos-comunes-licencia.ts` + `boundaries.ts` | Violación → pérdida de permiso, común sigue vigente |
| Tres piedras del comal (3 preguntas hermenéuticas) | `curativos-comunes-licencia.ts` | Interpretación ante duda |
| No es documento legal vinculante; acuerdo entre comunidades | `curativos-comunes-licencia.ts` | Licencia de publicación, no contrato estatal |
| Anti-capitalista, anti-colonial, no entrenar IA corporativa | `boundaries.ts` DENY | Límites duros contra extracción |
| Relación antes que propiedad; consentimiento de otra comunidad | `curativos-comunes-licencia.ts` + `registrySystem.ts` | Consentimiento como punto de partida |
| Inteligencia Ancestral vs IA corporativa | `curativos-comunes-licencia.ts` + `ia-auditable.ts` | Datos que cuidan, gobernanza incluida, código abierto |
| Kaitiakitanga (custodia en lugar de propiedad) | `propertyRegimeSystem.ts` | Non-Dominium, custodio temporal |
| Principios CARE, Local Contexts TK/BC, RAIL | `curativos-comunes-licencia.ts` | Gobernanza de datos indígenas, cuidado heredado a derivados |

### 2.2 Extirpar (infra ajena — regla de la skill)

| Infra a extirpar | Por qué | Qué se hace en su lugar |
|------------------|---------|-------------------------|
| Conversión a contrato legal vinculante estatal | El documento dice explícitamente que no es vinculante | Lógica pura de acuerdo entre comunidades, justicia no punitiva |
| Licencias propietarias o de restricción comercial estándar | La licencia es anti-acumulación, anti-capitalista | Reglas de relación no extractiva, cuidados-semilla |
| Entrenamiento de IA corporativa con los materiales | Prohibido explícitamente en "Nunca lo uses" | DENY en boundaries, F cuidado-semilla restringe IA local/comunitaria |
| Privatización de derivados | Prohibido en "Los derivados" | Derivados deben seguir siendo bienes comunes |
| Crecimiento económico sin fin | Prohibido en "Nunca lo uses" | Límite duro contra acumulación |

### 2.3 Módulos HSCSG/Zeitnus afectados

| Módulo | Aporte de Curativos Comunes |
|--------|-----------------------------|
| `src/core/lib/curativos-comunes-licencia.ts` | (NUEVO) Corazón Puedes/Siempre/Nunca/Derivados, cuidados-semilla M/F/C/Q, código CuC, metadatos, justicia comunitaria, tres piedras del comal |
| `src/core/state/curativos-comunes-licencia.ts` | (NUEVO) Estado de licencias, derivados, violaciones, reparaciones |
| `src/core/lib/boundaries.ts` | DENY: IA corporativa, acumulación capitalista, ecocidio, genocidio, extractivismo, violencia racista/clasista/colonial/patriarcal |
| `src/core/lib/registrySystem.ts` | Registro de publicaciones con metadatos (publicante, pueblo, territorio, fecha, link) |
| `src/core/lib/propertyRegimeSystem.ts` | Kaitiakitanga: custodia en lugar de propiedad, Non-Dominium |
| `src/core/lib/ia-auditable.ts` | Inteligencia Ancestral vs IA corporativa; datos que cuidan, gobernanza incluida |
| `src/core/lib/non-transactional-value.ts` | Bienes comunes sin transacción económica; valor observado sin recompensa |
| `src/core/lib/desmercantilizacion.ts` | care_income, ecological_credit; anti-acumulación |

---

## 3. Perspectiva HSCSG + CaaS (isomorfismo con las Leyes del Materialismo Jerárquico)

### Ley I — No dañar la base material ni a las personas
- Curativos Comunes: "Nunca lo uses para dañar la tierra, ecocidio, genocidio, extractivismo"; "Nunca lo uses para ejercer o promover violencia racista, clasista, colonial o patriarcal"; "La enfermedad es capitalismo y colonialismo".
- HSCSG: MJ Gate bloquea acciones que degraden base material; `boundaries.ts` DENY especulación y mercantilización.
- **Resonancia:** las restricciones "Nunca" son límites duros idénticos a la Ley I; no dañar la base material es condición previa para cualquier uso.

### Ley II — Ganarse la vida soberanizando (AUT × CDS)
- Curativos Comunes: "Personas y comunidades pueden incluirlo en su trabajo y cobrar para sostener su vida, no para acumular" (cuidado C Sin lucro); "Autonomía tecnológica: crear propias herramientas, infraestructura y gobernanza tecnológica".
- HSCSG: ZNU por beneficio neto, acceso por contribución (CaaS), AUT × CDS.
- **Resonancia:** sostener la vida sin acumular es isomórfico a acceso por contribución real, no por acumulación.

### Ley III — Lucidez, nunca engañar
- Curativos Comunes: "Menciona de dónde viene", "Menciona si hiciste cambios", "Aclara si usaste tecnologías digitales o IA"; "Tres piedras del comal" como preguntas hermenéuticas; "Cómo se lee e interpreta: ante cualquier duda, pregunta".
- HSCSG: RAO, Modo Lucidez, `currentSeeSystem.ts`, registros inmutables, transparencia y trazabilidad.
- **Resonancia:** atribución, cambios, tecnologías usadas y preguntas hermenéuticas son forms de lucidez y no engaño.

### CaaS (Comunidad como Servicio — acceso por contribución, no por dinero)
- Curativos Comunes: "Este permiso no tiene costo"; "cobrar para sostener su vida, no para acumular"; "relación antes que propiedad"; "consentimiento no es un trámite: es el punto de partida".
- HSCSG: CaaS-BM por AUT × CDS; membresía por nivel; acceso universal a servicios básicos.
- **Resonancia:** el acceso sin costo pero con responsabilidad de relación es isomórfico a CaaS por contribución real, no por pago monetario.

---

## 4. Tabla de mapeo isomórfico (Curativos Comunes → Zeitnus/ALRAC)

| Concepto Curativos Comunes | Entidad Zeitnus/ALRAC | Capa | Ley/CaaS | Estado |
|----------------------------|----------------------|------|----------|--------|
| Corazón: Puedes / Siempre / Nunca / Derivados | `curativos-comunes-licencia.ts` | Capa 4 | Ley III | **Pendiente** |
| Cuidado-semilla Maíz (M) Compartir igual | `curativos-comunes-licencia.ts` | Capa 4 | Ley III | **Pendiente** |
| Cuidado-semilla Frijol (F) Sin algoritmos | `curativos-comunes-licencia.ts` | Capa 4 | Ley I | **Pendiente** |
| Cuidado-semilla Calabaza (C) Sin lucro | `curativos-comunes-licencia.ts` | Capa 4 | Ley II | **Pendiente** |
| Cuidado-semilla Quelite (Q) Autonomía | `curativos-comunes-licencia.ts` | Capa 4 | Ley I | **Pendiente** |
| Código CuC-[Clave] 1.0 + #CurativosComunes | `curativos-comunes-licencia.ts` | Capa 4 | Ley III | **Pendiente** |
| Metadatos de publicación (publicante, pueblo, territorio, fecha, link) | `curativos-comunes-licencia.ts` + `registrySystem.ts` | Capa 4 | Ley III | **Pendiente** |
| Justicia comunitaria no punitiva (reparar, detener daño) | `curativos-comunes-licencia.ts` + `boundaries.ts` | Capa 0 | Ley I | **Pendiente** |
| Tres piedras del comal (3 preguntas hermenéuticas) | `curativos-comunes-licencia.ts` | Capa 0 | Ley III | **Pendiente** |
| No es documento legal vinculante; acuerdo entre comunidades | `curativos-comunes-licencia.ts` | Capa 0 | Ley III | **Pendiente** |
| Anti-capitalista, anti-colonial, no IA corporativa | `boundaries.ts` DENY | Capa 0 | Ley I | **Pendiente** |
| Kaitiakitanga: custodia en lugar de propiedad | `propertyRegimeSystem.ts` | Capa 1 | Ley I | **Pendiente** |
| Inteligencia Ancestral vs IA corporativa | `ia-auditable.ts` + `curativos-comunes-licencia.ts` | Capa 4 | Ley III | **Pendiente** |

---

## 5. Qué asimilar / qué extirpar (lista explícita)

| Asimilar (lógica pura, reimplementar en TS) | Extirpar (infra ajena, NO crear) |
|---------------------------------------------|----------------------------------|
| Corazón Puedes/Siempre/Nunca/Derivados con 4 partes obligatorias | Conversión a contrato legal vinculante estatal |
| 4 cuidados-semilla M/F/C/Q opcionales que se suman al corazón | Licencias propietarias o de restricción comercial estándar |
| Código CuC-[Clave] 1.0 legible y metadatos de publicación | Entrenamiento de IA corporativa con los materiales |
| Justicia comunitaria no punitiva (reparar, detener daño, común sigue vigente) | Privatización de derivados |
| Tres piedras del comal como preguntas hermenéuticas | Crecimiento económico sin fin |
| Relación antes que propiedad; consentimiento de otra comunidad como punto de partida | — |
| Inteligencia Ancestral (datos que cuidan, gobernanza incluida, código abierto) | — |
| No documento legal vinculante; acuerdo entre comunidades | — |

---

## 6. Vasos comunicantes cross-repo

| Módulo Zeitnus | Conexión Curativos Comunes | Vaso comunicante |
|----------------|----------------------------|------------------|
| `curativos-comunes-licencia.ts` | Corazón, cuidados-semilla, código CuC, metadatos, justicia comunitaria | `registrySystem.ts`, `propertyRegimeSystem.ts` |
| `registrySystem.ts` | Registro de publicaciones con metadatos (publicante, pueblo, territorio, fecha, link) | 4 registros separados |
| `propertyRegimeSystem.ts` | Kaitiakitanga: custodia en lugar de propiedad, Non-Dominium | Non-Dominium de bienes comunes |
| `boundaries.ts` | DENY: IA corporativa, acumulación, ecocidio, genocidio, extractivismo, violencia | Límites duros |
| `ia-auditable.ts` | Inteligencia Ancestral vs IA corporativa; datos que cuidan, gobernanza incluida | `regenerative-agent.ts`, `ia-auditable.ts` existentes |
| `non-transactional-value.ts` | Bienes comunes sin transacción; valor observado sin recompensa | CVNT especificación ya creada |
| `desmercantilizacion.ts` | care_income, ecological_credit; anti-acumulación | Desmercantilización |
| `caas.ts` | Acceso sin costo pero con responsabilidad de relación | Comunidad como Servicio |

---

## 7. Decisiones EBD (Evidencia-Basadas) — D1 a D14

| ID | Decisión | Evidencia primaria (del documento) | Módulo afectado |
|----|----------|-----------------------------------|-----------------|
| D1 | Corazón con 4 partes: Puedes, Siempre, Nunca, Derivados | "El corazón de esta licencia propone una forma de relacionarnos con los comunes, no una propiedad" | `curativos-comunes-licencia.ts` |
| D2 | 4 cuidados-semilla opcionales: M (Compartir igual), F (Sin algoritmos), C (Sin lucro), Q (Autonomía) | Tabla de cuidados-semilla en "Partes de la licencia" | `curativos-comunes-licencia.ts` |
| D3 | Código de licencia: #CurativosComunes + CuC-[Clave] 1.0 | "Cada material lleva el hashtag #CurativosComunes código CuC... Por ejemplo, 'CuC-MFCQ 1.0'" | `curativos-comunes-licencia.ts` |
| D4 | Metadatos obligatorios: publicante, pueblo ancestral, territorio, fecha, licencia, cuidados, link | "Cómo agregarlo a tu publicación" | `curativos-comunes-licencia.ts` + `registrySystem.ts` |
| D5 | Justicia comunitaria no punitiva: detener daño, reparar, evitar repetición, devolver como comunes; quien rompe pierde el permiso, común sigue vigente | "Si se rompe el acuerdo... perder el permiso; el común sigue vigente para las demás" | `curativos-comunes-licencia.ts` + `boundaries.ts` |
| D6 | Tres piedras del comal: 3 preguntas hermenéuticas para interpretación ante duda | "Tres piedras del comal... ¿digno para personas-comunidades? ¿respetar territorios y espíritus? ¿cura de la Madre Tierra?" | `curativos-comunes-licencia.ts` |
| D7 | No es documento legal vinculante; acuerdo entre personas y comunidades, justicia comunitaria no punitiva | "La licencia de Curativos Comunes no es un documento legal vinculante" | `curativos-comunes-licencia.ts` |
| D8 | Anti-capitalista y anti-colonial; "La enfermedad es capitalismo y colonialismo" | Principio 3 | `boundaries.ts` DENY |
| D9 | Nunca entrenar IA corporativa; IA comunitaria/Inteligencia Ancestral como alternativa | "Nunca lo uses... Para entrenar, ajustar o almacenar una inteligencia artificial corporativa"; Principio 8 | `boundaries.ts` DENY + `ia-auditable.ts` |
| D10 | Nunca crecimiento económico sin fin; no fines capitalistas de acumulación | "Nunca lo uses... Para fines capitalistas o de acumulación: crecimiento económico sin fin" | `boundaries.ts` DENY |
| D11 | Nunca dañar la tierra, ecocidio, genocidio, extractivismo; nunca violencia racista/clasista/colonial/patriarcal | "Nunca lo uses" | `boundaries.ts` DENY |
| D12 | Relación antes que propiedad; consentimiento de otra comunidad como punto de partida | Principio 5 y 6 | `curativos-comunes-licencia.ts` + `registrySystem.ts` |
| D13 | Derivados no se pueden privatizar; deben seguir siendo bienes comunes con licencia afín | "Los derivados: los derivados de este material no se pueden privatizar" | `curativos-comunes-licencia.ts` |
| D14 | Kaitiakitanga: custodia en lugar de propiedad; estados-nación, ejércitos y corporaciones no pueden usar (cuidado Q) | Cuidado-semilla Q Autonomía; raíces Kaitiakitanga License | `propertyRegimeSystem.ts` + `curativos-comunes-licencia.ts` |

---

## 8. KPIs y tests obligatorios

| Módulo | KPIs mínimos | Archivo de test |
|--------|-------------|-----------------|
| `curativos-comunes-licencia.ts` | Corazón Puedes/Siempre/Nunca/Derivados; 4 cuidados-semilla M/F/C/Q; código CuC válido; metadatos completos; derivados no privatizables; tres piedras del comal | `tests/curativos-comunes-licencia.test.ts` |
| `registrySystem.ts` | Registro de publicación con publicante, pueblo, territorio, fecha, link | `tests/registro-publicacion-cuc.test.ts` |
| `boundaries.ts` | DENY: IA corporativa, acumulación capitalista, ecocidio, genocidio, extractivismo, violencia, crecimiento sin fin | `tests/boundaries-curativos-comunes.test.ts` |
| `propertyRegimeSystem.ts` | Kaitiakitanga: custodia en lugar de propiedad, Non-Dominium, cuidado Q bloquea estados/corporaciones | `tests/kaitiakitanga-custodia.test.ts` |

**Regla de verificación:** `npx tsc --noEmit` 0 errores nuevos; `npm run build` OK.

---

## 9. Plan de implementación archivo por archivo

### Fase 3.1 — Spec OpenSpec (nueva)
1. `openspec/specs/alrac-tq-curativos-comunes-licencia.md` — corazón, cuidados-semilla, código CuC, metadatos, justicia comunitaria, tres piedras, límites duros

### Fase 3.2 — Tipos (`src/core/state/`)
- `src/core/state/curativos-comunes-licencia.ts`: `LicenciaCurativosComunes`, `CuidadoSemilla`, `CorazonLicencia`, `MetadatosPublicacion`, `Derivado`, `ViolacionAcuerdo`, `Reparacion`

### Fase 3.3 — Lógica pura (`src/core/lib/`)
- `curativos-comunes-licencia.ts`: `crearLicencia()`, `agregarCuidadoSemilla()`, `generarCodigoCuC()`, `validarMetadatos()`, `esUsoPermitido()`, `esUsoProhibido()`, `esDerivadoPrivatizable()`, `evaluarTresPiedrasDelComal()`, `procesarViolacion()`, `asignarReparacion()`
- `boundaries.ts`: DENY IA corporativa, acumulación, ecocidio, genocidio, extractivismo, violencia, crecimiento sin fin
- `propertyRegimeSystem.ts`: Kaitiakitanga, custodio temporal, cuidado Q
- `ia-auditable.ts`: distinguir IA corporativa (prohibida) de IA comunitaria/Inteligencia Ancestral (permitida con cuidados)
- No crear contrato legal vinculante; no permitir privatización de derivados; no permitir entrenamiento IA corporativa

### Fase 3.4 — Store (`src/core/state/store.ts`)
- Importar tipos y `makeCurativosComunesLicenciaState()`.
- Añadir `curativosComunesLicencia: CurativosComunesLicenciaState` a `AppState` y estado inicial de `create()`.
- Añadir acciones con `set((st) => ({ curativosComunesLicencia: {...st.curativosComunesLicencia, ...} }))`.
- Incluir `makeCurativosComunesLicenciaState()` en `resetAll()`.
- Incluir `curativosComunesLicencia: st.curativosComunesLicencia` en **ambas** ubicaciones de `partialize`.

### Fase 3.5 — Pruebas
- Tests unitarios para cada KPI de §8.
- `npx tsc --noEmit` (0 errores nuevos) y `npm run build`.

### Fase 3.6 — Documentación y commit
- Actualizar `README.md` y `CHANGELOG.md`.
- Commit: `feat: licencia Curativos Comunes 1.0 (corazón Puedes/Siempre/Nunca/Derivados, cuidados-semilla M/F/C/Q, código CuC, justicia comunitaria, tres piedras del comal) + docs/spec y TS puro`.
- Push a `origin asimilacion/ecc-hermes`.

---

## 10. Referencias

- `docs/curativos-comunes-licencia_backup.md` (texto completo de la licencia CuC 1.0)
- `docs/non-transactional-value-cvnt_backup.md` (CVNT, valor no transaccional)
- `openspec/specs/alrac-tq-desmercantilizacion.md` (care_income, ecological_credit, anti-acumulación)
- `openspec/specs/alrac-tq-economia-comunes.md` (excedentes reinvertidos, no dividendos)
- `docs/TQ_POSTLABOR_PROPOSAL.md` (TQ Stock/Flow Dual-Layer)
- `docs/ECOSYSTEM_REVENUE_SHARING.md` (4 círculos, CoRe)
- `src/core/lib/tq-types-extended.ts` (tipos core ALRAC)
- `src/core/lib/boundaries.ts` (límites duros)
- `src/core/lib/registrySystem.ts` (4 registros separados)
- `src/core/lib/propertyRegimeSystem.ts` (Non-Dominium, custodio temporal, Kaitiakitanga)
- `src/core/lib/ia-auditable.ts` (IA auditable, Inteligencia Ancestral)
- `src/core/lib/caas.ts` (Comunidad como Servicio)
- Raíces de la licencia: Declaración de Milpamérica, Kaitiakitanga License, Creative Commons, Local Contexts TK/BC, RAIL, Principios CARE, OIT 169, Declaración ONU Pueblos Indígenas, Ley México 2022 Patrimonio Cultural Pueblos Indígenas y Afromexicanos
- Principio Anfibio HSCSG: valueDual.ts + nodeMode/priceParity
