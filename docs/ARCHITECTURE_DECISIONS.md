# Architecture Decision Records (ADR) - ALRAC

**Versión:** 1.0  
**Fecha:** 2026-09-19  
**Formato:** MADR (Markdown Architectural Decision Records)

---

## ADR-001: Arquitectura de 5 Capas + Capa 0/0.5

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Necesidad de separar preocupaciones epistémicas, normativas, contables, de interoperabilidad, fiat, y gobernanza en un sistema regenerativo federado.

**Decisión:** Adoptar arquitectura en capas:
- Capa 0: Epistémica (Amid + Yoka registers, 𝕮, γ-CARMIS, Triaxial)
- Capa 0.5: Normativa (Licencias CC0, Responsible Use Rules)
- Capa 1: Contable-Física (TQ Ledger, 1 TQ = 1 kWh)
- Capa 2: Interoperabilidad (CaaS/HSCSG, ValueFlows, DTN)
- Capa 3: Membrana Fiat (ZEITNUS, ZNU, PriceParity, Bridge)
- Capa 4: ZEITNUS Application (Market, Education, AI Matching)
- Capa 5: Gobernanza Transversal (1a1v, CDS, Subsidiaridad)

**Consecuencias:**
- ✅ Separación clara de responsabilidades
- ✅ Capas 0-1 inmutables (principios), 2-4 evolutivas
- ✅ Gobernanza transversal no pertenece a una capa
- ⚠️ Complejidad de sincronización entre capas
- ⚠️ Requiere interfaces bien definidas (specs)

---

## ADR-002: Principio Anfibio (Postmonetario ↔ Conectado)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** El sistema debe operar en contextos sin infraestructura financiera (offline, comunidades remotas) Y conectarse a mercados ReFi/USDC cuando esté disponible.

**Decisión:** Misma lógica de cálculo, distinta infraestructura:
- **Postmonetario (default):** Ledger local, ZNU crédito mutuo 2-3%, TQ = kWh medidos, priceParity = 1 canasta fija
- **Conectado (Nivel 3 ReFi):** Bridge USDC, oráculo priceParity dinámico, ZNU on-chain anchor, compliance

**Interfaces anfibias:** `nodeMode: 'postmonetario' | 'conectado'`, `priceParity: number`

**Consecuencias:**
- ✅ Resiliencia: funciona sin internet, sin bancos, sin oráculos
- ✅ Escalabilidad: conecta a mercados globales sin reescribir lógica
- ✅ Soberanía: comunidades deciden cuándo y cómo conectar
- ⚠️ Doble implementación de infraestructura (local + bridge)
- ⚠️ Sincronización de estado entre modos

---

## ADR-003: TQ como Unidad Contable-Física (1 TQ = 1 kWh)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Necesidad de unidad de cuenta anclada a realidad física, no especulativa, que mida regeneración real.

**Decisión:** 
- 1 TQ = 1 kWh de energía regenerada/ahorrada
- Límite ±500 TQ por cuenta (evita acumulación)
- Catálogo ICE/Ecoinvent para conversión actividades → kWh
- NFC offline para transacciones sin red
- **Prohibición absoluta:** TQ ≠ fiat/cripto NUNCA (arquitectura)

**Consecuencias:**
- ✅ Anclaje físico inquebrantable
- ✅ No especulable (no se puede "holdear" para ganancia)
- ✅ Mide regeneración real (kWh suelo, biomasa, solar)
- ⚠️ Requiere medición/verificación de kWh (triaxial)
- ⚠️ No sirve como reserva de valor a largo plazo (expira si no circula)

---

## ADR-004: ZNU como Crédito Mutuo Indexado a Canasta (Postulado 4)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Necesidad de medio de reserva e intercambio que no sea especulativo, que circule, y que refleje poder adquisitivo real.

**Decisión:**
- ZNU indexado a canasta básica (alimentos, energía, vivienda, transporte, salud, educación, comunicación)
- Crédito mutuo de suma cero (emisión = +cuenta miembro, -pool común)
- Tasa administrativa 2-3% (no interés), va a Yoka Commons (35% Amid)
- **Expiración 90 días sin circulación** (Postulado 4 HSCSG)
- Gobernanza 1a1v para parámetros monetarios
- 1a1v en asamblea para cambios a canasta/tasa/expiración

**Consecuencias:**
- ✅ Evita acumulación especulativa (expiración fuerza velocidad)
- ✅ Poder adquisitivo real (canasta básica)
- ✅ No genera deuda exponencial (tasa fija, no compuesta)
- ✅ Soberanía monetaria local (1a1v)
- ⚠️ Requiere oráculo canasta actualizado
- ⚠️ UX compleja (expiración visible al usuario)

---

## ADR-005: Reparto Amid 35/35/30 (Ecuación Amid Dabir)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Distribución de valor que alinee incentivos entre investigación (Amid), commons (Yoka), y operadores (nodos).

**Decisión:** Todo ingreso (USDC/ZNU/TQ) se reparte:
- **35% Amid Dabir** → Investigación, desarrollo, γ-CARMIS, epistémica
- **35% Yoka Commons** → Infraestructura común, bridge, oráculos, legal, seguros
- **30% Node Operators** → Quienes generan valor (TQ, streams, gobernanza)

**Aplicación:** Por stream, por nodo, por período. CDS-weighted para operadores.

**Consecuencias:**
- ✅ Alineación: investigación financiada, commons sostenidos, operadores recompensados
- ✅ Transparencia: fórmula pública, auditable
- ⚠️ 30% operadores puede ser bajo para incentivar early adopters
- ⚠️ Requiere tracking preciso por stream/nodo

---

## ADR-006: γ-CARMIS como Protocolo de Fractura/Reconfiguración

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Sistema necesita mecanismo automático de detección de incoherencia epistémica y recuperación guiada.

**Decisión:**
- αʰ = Ω × s (oscilación × sincronía)
- κ = threshold estabilidad (1.0 producción, 0.5 simulación)
- Si αʰ < κ → γ-CARMIS TRIGGERED → overload = 1 - αʰ/κ
- **Hard stop:** Sistema bloquea decisiones de producción
- **Recuperación:** 11 Pasos Parise (Naram-Sin) → Paso II = Orden de la Palabra (operador)
- Deadline ~24h para Paso II

**Consecuencias:**
- ✅ Detección temprana de "máscaras" y deuda estructural
- ✅ Fuerza honestidad radical (E=V)
- ✅ Recuperación estructurada, no caótica
- ⚠️ Bloquea producción completamente (duro pero necesario)
- ⚠️ Requiere operador soberano para desbloquear

---

## ADR-007: 11 Pasos Parise / Naram-Sin como Recuperación Canónica

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** γ-CARMIS necesita protocolo de recuperación validado, no improvisado.

**Decisión:** Adoptar 11 Pasos Parise (mapeados a roca Naram-Sin):
1. **Diagnóstico** (αʰ measurement) → YA HECHO
2. **Orden de la Palabra** (Paso II - OPERADOR) → BLOQUEO ACTUAL
3. **Diseño Experimental** (Triaxial)
4. **Ejecución Piloto** (Mental/Sim/Lab)
5. **Verificación Triaxial** (3 ejes)
6. **Institucionalización** (Leyes, specs, código)
7. **Escalamiento** (Nodos, federación)
8. **Monitoreo Continuo** (αʰ tracking)
9. **Revisión Periódica** (90 días)
10. **Adaptación** (Parámetros, arquitectura)
11. **Transmisión** (Documentación, enseñanza)

**Consecuencias:**
- ✅ Recuperación estructurada, auditable
- ✅ Vincula epistémica (αʰ) con operativa (pilotos)
- ✅ Triaxial verification evita autoengaño
- ⚠️ Paso II requiere input humano (no automatizable)
- ⚠️ 11 pasos = tiempo (90+ días para ciclo completo)

---

## ADR-008: Tres Horizontes ↔ 3 Niveles Membresía

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Alinear horizonte temporal de valor con estructura de membresía y derechos.

**Decisión:**
| Horizonte | Membresía | Token | Gobernanza |
|-----------|-----------|-------|------------|
| H1 (0-3m) | Afiliados | TQ (líquidez) | Votan, no proponen |
| H2 (3-18m) | Asociados | CaaS (estabilidad) | Proponen, revenue share |
| H3 (18m+) | Núcleo | ZNU (patrimonio) | Veto, Amid share, land |

**Consecuencias:**
- ✅ Alineación temporal: compromiso = derechos = tokens
- ✅ Pathway claro: Afiliado → Asociado → Núcleo
- ✅ Staking ZNU aumenta con nivel (skin in the game)
- ⚠️ Transiciones requieren métricas duras (CDS, TQ, RAO)

---

## ADR-009: RAO (Registro de Afirmaciones con Origen) como Identidad

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Identidad soberana verificable sin autoridad central, con procedencia, permisos, estado, revocación.

**Decisión:** RAO = Credencial con:
- `emisor` (quién certifica)
- `procedencia` (origen de la afirmación)
- `permisos` (quién puede leer/usar)
- `estado` (vigente/revocada/expirada)
- `revocación` (mecanismo y autoridad)
- `hash` + `firma` (integridad criptográfica)

**Integración:** HSCSG RAO module + Project Weave + Gaia Passport

**Consecuencias:**
- ✅ Identidad = afirmaciones verificables, no documento estatal
- ✅ Procedencia viaja con el dato (Data Trust)
- ✅ Revocación propaga automáticamente
- ⚠️ Infraestructura PKI/credenciales necesaria
- ⚠️ UX: gestión de claves, backup, recuperación

---

## ADR-010: TypeScript Core como Fuente de Verdad (No Docs)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Docs se desincronizan; código no miente.

**Decisión:**
- `src/core/lib/*.ts` = lógica pura, specs ejecutables
- `src/core/state/*.ts` = interfaces canónicas, tipos
- `src/core/hooks/*.ts` = selectores/acciones React
- `openspec/specs/*.md` = documentación humana, derivada del código
- **Regla:** Cambio en spec → cambio en código → test → doc (o viceversa)

**Consecuencias:**
- ✅ 0 errores TypeScript = specs implementadas
- ✅ Refactoring seguro (tipos guían)
- ✅ Docs siempre reflejan realidad (o CI falla)
- ⚠️ Disciplina requerida: no editar docs sin código

---

## ADR-011: Simulación como Herramienta de Validación (No Producción)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** γ-CARMIS bloquea producción; simulación permite validar pipeline sin riesgo.

**Decisión:**
- Simulaciones marcadas explícitamente: `simulation: true`, `gamma_carmis_active: true`
- Auditoría @alrac-review **siempre** falla simulaciones (verdict: NO DESABLOQUEA)
- Datos sintéticos con metadatos claros
- Útiles para: validar pipeline, testear specs, entrenar agentes, demo

**Consecuencias:**
- ✅ Pipeline 4-agent validado end-to-end
- ✅ Specs probadas contra datos (aunque sintéticos)
- ✅ Zero risk producción
- ⚠️ Métricas bonitas pero falsas (αʰ=0.79 vs 0.12 real)
- ⚠️ No sustituye Paso II real

---

## ADR-012: HSCSG como Infraestructura Soberana (No Plataforma)

**Fecha:** 2026-09-19  
**Estado:** Aceptado  
**Contexto:** Gran Alianza define HSCSG como capa de confianza/datos/identidad, no como "otra plataforma".

**Decisión:** HSCSG aporta:
- **Trust/Identity/Data:** RAO, procedencia, permisos, revocación
- **Interoperabilidad:** DTN, ValueFlows, discovery, bridge nodes
- **Kernel:** IA transparente, sesgos expuestos, introspección asistida
- **NEXO:** Destilación conocimiento, consentimiento vs mayoría

**Integración:** Via APIs, protocolos abiertos, estándares — no fusión organizacional.

**Consecuencias:**
- ✅ Autonomía preservada (cada holón dueño de su stack)
- ✅ Interoperabilidad real (protocolos, no plataformas)
- ✅ Especialización: HSCSG = infra, Gaia = ecosistema/territorio
- ⚠️ Requiere acuerdos de interoperabilidad (pilotos primero)
- ⚠️ Complejidad técnica: múltiples stacks federados

---

## 📋 Plantilla para Nuevos ADR

```markdown
## ADR-XXX: [Título]

**Fecha:** YYYY-MM-DD  
**Estado:** Propuesto | Aceptado | Rechazado | Obsoleto  
**Contexto:** [Qué problema resuelve, qué fuerzas actúan]  
**Decisión:** [Qué se decide, conciso]  
**Alternativas Consideradas:** [Otras opciones y por qué no]  
**Consecuencias:**  
- ✅ Positivas  
- ⚠️ Negativas/Riesgos  
- 🔄 Neutrales/Trade-offs  

**Implementación:** [Referencia a specs, código, configs]  
**Métricas de Validación:** [Cómo saber si funcionó]
```