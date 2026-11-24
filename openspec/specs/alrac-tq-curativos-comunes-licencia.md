// openspec/specs/alrac-tq-curativos-comunes-licencia.md
// OpenSpec: Licencia Curativos Comunes 1.0 (Hackeo Cultural / Milpamérica)
// Corazón: Puedes / Siempre / Nunca / Derivados
// Cuidados-semilla: Maíz (M) Compartir igual, Frijol (F) Sin algoritmos,
// Calabaza (C) Sin lucro, Quelite (Q) Autonomía
// Código: #CurativosComunes + CuC-[Clave] 1.0
// Justicia comunitaria no punitiva; Tres piedras del comal;
// No es documento legal vinculante; acuerdo entre comunidades.
// Estado: Propuesta — TypeScript puro, sin contrato legal estatal,
// sin privatización de derivados, sin entrenamiento de IA corporativa.

# SPEC: alrac-tq-curativos-comunes-licencia
**Version:** 1.0.0 (propuesta)
**Status:** Propuesta — pendiente implementación en TypeScript puro
**Source:** Licencia Curativos Comunes 1.0, Hackeo Cultural / Milpamérica, Noviembre 2026, CuC 1.0 (docs/curativos-comunes-licencia_backup.md)
**Targets:** `src/core/lib/curativos-comunes-licencia.ts`, `src/core/state/curativos-comunes-licencia.ts`, `src/core/lib/boundaries.ts` (DENY), `src/core/lib/propertyRegimeSystem.ts` (Kaitiakitanga), `src/core/lib/ia-auditable.ts` (IA comunitaria vs corporativa)

---

## 1. Corazón de la licencia (4 partes obligatorias)

### 1.1 Puedes (permisos, sin costo)
- Copiar, compartir, enseñar, traducir a cualquier lengua, modificar para aprender, integrar al trabajo, transformar, usar para defender y curar el cuerpo, el territorio y el espíritu.
- Permiso sin costo, vigente mientras se respete el acuerdo.

### 1.2 Siempre (atribución y transparencia)
- Mencionar de dónde viene: nombre del material, quién lo comparte, fecha, pueblo y territorio.
- Mantener el aviso de la licencia con sus cuidados.
- Mencionar si se hicieron cambios o modificaciones.
- Aclarar si se usaron tecnologías digitales o IA y cuáles fueron los cuidados.

### 1.3 Nunca (restricciones absolutas)
- Dañar a la tierra, a sus pueblos o a las personas: ecocidio, genocidio, extractivismo.
- Fines capitalistas o de acumulación: crecimiento económico sin fin en un planeta con límites.
- Ejercer o promover violencia racista, clasista, colonial o patriarcal.
- Entrenar, ajustar o almacenar una inteligencia artificial corporativa.

### 1.4 Derivados (reciprocidad, no privatización)
- Los derivados no se pueden privatizar.
- Todo derivado (traducción, libro, investigación, video, programa, modelo de IA, y lo que ese modelo produce) debe seguir siendo un bien común.
- Publicarse con esta licencia u otra afín, accesible para las comunidades y la red CuC.

---

## 2. Cuidados-semilla opcionales (se suman al corazón)

| Clave | Nombre | Si se agrega | Si no se agrega |
|-------|--------|--------------|-----------------|
| M | Maíz - Compartir igual | Los derivados se comparten con esta misma licencia Curativos Comunes y los mismos cuidados-semilla. | Los derivados no pueden ser privatizados, pero se pueden publicar con otras licencias afines. |
| F | Frijol - Sin algoritmos | No se puede usar para desarrollar tecnologías comunitarias digitales ni modelos de IA locales. Se puede compartir en medios digitales. | Se puede usar para tecnologías de base comunitaria. IA corporativa restringida. |
| C | Calabaza - Sin lucro | El material y sus derivados no se pueden vender ni usar con fines de lucro. | Personas y comunidades pueden incluirlo en su trabajo y cobrar para sostener su vida, no para acumular. |
| Q | Quelite - Autonomía | Estados-nación, ejércitos y corporaciones no pueden usarlo ni crear derivados, ni por encargo ni mediante terceros. Personas y centros educativos mantienen su uso. | Todas pueden consultarlo y usarlo respetando el corazón y los cuidados añadidos. |

---

## 3. Código de licencia y metadatos

**Código:** `#CurativosComunes CuC-[Clave] 1.0`
- Ejemplo con 4 cuidados: `CuC-MFCQ 1.0`
- Ejemplo solo corazón: `CuC 1.0`

**Metadatos de publicación:**
- [Publicante]: nombre de persona, colectiva u organización
- [Pueblo Ancestral]: pueblo al que pertenece (si aplica)
- [Territorio]: territorio desde el que se publica
- [Fecha]: año de publicación
- [Licencia]: código CuC
- [Cuidados]: M/F/C/Q aplicados
- [Link]: link a la licencia completa (wiki.milpamerica.org/cuc)

---

## 4. Justicia comunitaria no punitiva

- Al romper el acuerdo: quien comparte y las comunidades con relación al saber pueden pedir que se detenga el daño y se repare, según sus propias formas de justicia comunitaria.
- Quien rompe el acuerdo (quien comparte o quien lo usa) pierde el permiso.
- El común sigue vigente para las demás.
- No se busca castigo sino justicia: detener el daño, recuperar lo despojado, evitar la repetición, devolver lo producido en forma de comunes.

---

## 5. Tres piedras del comal (preguntas hermenéuticas)

Ante cualquier duda de interpretación, aplicar:
1. ¿Lo que estoy publicando es digno para las personas-comunidades, sin extraer de ellas ni acumular a su costa?
2. ¿Lo que estoy publicando respeta a los territorios y a los espíritus que en ellos habitan?
3. ¿Lo que estoy publicando es cura de la Madre Tierra?

---

## 6. Naturaleza jurídica

- No es un documento legal vinculante.
- Es una licencia de publicación que parte del acuerdo entre personas y comunidades.
- Los conflictos se resuelven mediante procesos de justicia comunitaria no punitiva.
- Compatible con otras licencias de bienes comunes que respetan esta cosmología de lo común.
- No es una licencia Creative Commons; los derivados pueden publicarse con otras licencias afines.

---

## 7. Integración con specs ALRAC existentes

| Spec ALRAC | Punto de integración |
|------------|---------------------|
| `alrac-tq-economia-comunes` | Bienes comunes, excedentes reinvertidos, no dividendos; coherente con "no privatizar derivados" |
| `alrac-tq-desmercantilizacion` | care_income, ecological_credit; anti-acumulación, "cobrar para sostener la vida, no para acumular" |
| `TQ_POSTLABOR_PROPOSAL` | TQ Stock/Flow; valor no transaccional de los saberes comunes |
| `boundaries.ts` | DENY: IA corporativa, acumulación capitalista, ecocidio, genocidio, extractivismo, violencia, crecimiento sin fin |
| `propertyRegimeSystem.ts` | Kaitiakitanga: custodia en lugar de propiedad, Non-Dominium, cuidado Q (estado/corporación no pueden usar) |
| `ia-auditable.ts` | IA comunitaria/Inteligencia Ancestral (permitida con cuidados) vs IA corporativa (prohibida) |
| `registrySystem.ts` | Registro de publicaciones con metadatos (publicante, pueblo, territorio, fecha, link) |
| `non-transactional-value` | Bienes comunes sin transacción económica; valor observado sin recompensa |

---

## 8. Criterios de aceptación

- [ ] `crearLicencia()` genera corazón Puedes/Siempre/Nunca/Derivados
- [ ] `agregarCuidadoSemilla()` acepta M, F, C, Q y los suma al corazón
- [ ] `generarCodigoCuC()` produce formato válido (CuC 1.0, CuC-M 1.0, CuC-MFCQ 1.0)
- [ ] `validarMetadatos()` requiere publicante, territorio, fecha, link
- [ ] `esUsoPermitido()` valida permisos del Puedes con cuidados aplicados
- [ ] `esUsoProhibido()` detecta violaciones del Nunca (IA corporativa, acumulación, ecocidio, violencia, crecimiento sin fin)
- [ ] `esDerivadoPrivatizable()` retorna false siempre (derivados no se privatizan)
- [ ] `evaluarTresPiedrasDelComal()` retorna las 3 preguntas hermenéuticas
- [ ] `procesarViolacion()` registra violación, pierde permiso, común sigue vigente
- [ ] `boundaries.ts` DENY: IA corporativa, acumulación, ecocidio, genocidio, extractivismo, violencia, crecimiento sin fin
- [ ] 0 errores TypeScript nuevos

---

## 9. Vectores de prueba

```typescript
// crearLicencia
Input: { publicante: "Colectivo X", territorio: "Milpamérica", fecha: 2026, link: "wiki.milpamerica.org/cuc" }
Expected: licencia con corazón Puedes/Siempre/Nunca/Derivados, código "CuC 1.0", metadatos válidos
```

```typescript
// agregarCuidadoSemilla
Input: licencia, cuidado "M"
Expected: licencia con cuidado Maíz agregado, código "CuC-M 1.0"
```

```typescript
// esUsoProhibido
Input: { uso: "entrenar IA corporativa", cuidados: [] }
Expected: true (prohibido)
Input: { uso: "enseñar en escuela comunitaria", cuidados: ["Q"] }
Expected: false (permitido, escuela educativa mantiene uso con Q)
```

```typescript
// generarCodigoCuC
Input: cuidados ["M", "F", "C", "Q"]
Expected: "CuC-MFCQ 1.0"
Input: cuidados []
Expected: "CuC 1.0"
```

```typescript
// boundaries DENY
Input: entrenamientoIA = true → Expected: error "IA corporativa prohibida"
Input: acumulacionCapitalista = true → Expected: error "Acumulación capitalista prohibida"
Input: ecocidio = true → Expected: error "Ecocidio prohibido"
```

---

## 10. Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `registrySystem` | 1.0.0 | Registro de publicaciones con metadatos |
| `propertyRegimeSystem` | 1.0.0 | Kaitiakitanga, custodia, Non-Dominium |
| `boundaries` | 1.0.0 | Límites duros (sin IA corporativa, sin acumulación, sin ecocidio) |
| `ia-auditable` | 1.0.0 | IA comunitaria vs corporativa |
| `non-transactional-value` | 1.0.0 | Bienes comunes sin transacción |
| `desmercantilizacion` | 1.0.0 | care_income, ecological_credit |

---

## 11. Referencias

- `docs/curativos-comunes-licencia_backup.md` — Texto completo de la licencia CuC 1.0
- `docs/non-transactional-value-cvnt_backup.md` — CVNT especificación
- `openspec/specs/alrac-tq-desmercantilizacion.md` — Desmercantilización
- `openspec/specs/alrac-tq-economia-comunes.md` — Economía del común
- `docs/TQ_POSTLABOR_PROPOSAL.md` — TQ Stock/Flow Dual-Layer
- `docs/ECOSYSTEM_REVENUE_SHARING.md` — 4 círculos, CoRe
- `src/core/lib/tq-types-extended.ts` — Tipos core ALRAC
- `src/core/lib/boundaries.ts` — Límites duros
- `src/core/lib/registrySystem.ts` — 4 registros separados
- `src/core/lib/propertyRegimeSystem.ts` — Non-Dominium, custodio temporal, Kaitiakitanga
- `src/core/lib/ia-auditable.ts` — IA auditable, Inteligencia Ancestral
- `src/core/lib/caas.ts` — Comunidad como Servicio
- Raíces de la licencia: Declaración de Milpamérica, Kaitiakitanga License, Creative Commons, Local Contexts TK/BC, RAIL, Principios CARE, OIT 169, Declaración ONU Pueblos Indígenas, Ley México 2022

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-24 | Propuesta inicial: Licencia Curativos Comunes 1.0 (corazón Puedes/Siempre/Nunca/Derivados, cuidados-semilla M/F/C/Q, código CuC, justicia comunitaria, tres piedras del comal, límites duros) |
