# Backup FASE 1 — Kit del Salto + Kit Espejo (Cierra con Silvia)

**Fuente:** Archivos locales del vault usuario (PDFs, HTMLs, CSV, XLSX, ODS, TXT)
**Fecha extracción:** 29 octubre 2026
**Cluster temático:** Ventas high-ticket, prospección, CRM, diagnóstico de llamadas, Cierre Espejo
**Hash contenido:** `sha256:kit-salto-espejo-20261029`

---

## Resumen ejecutivo

Dos kits complementarios de **Silvia (Cierra con Silvia)** para closers high-ticket:

1. **Kit del Salto** — Diagnóstico de prospección: dónde buscas, a quién escribes, qué escribes, cuándo paras. Incluye "Atajo 2 min" para probar tu mensaje con ojos del creador (prompt para Claude/ChatGPT).
2. **Kit Espejo / Cierre Espejo** — Sistema CRM operativo conectado a Fathom + Calendar + Google Sheets + IA. Clasifica cada venta perdida en 3 fases: **Lectura** (no-show), **Reflejo** (no cerrada en llamada), **Sostén** (seguimiento sin cerrar). Entrega informes diarios/semanales con cuello de botella y próximos pasos.

**Objetivo compartido:** Que el closer deje de competir en bolsas saturadas y pase a escribir a creadores que solo él ve, con mensajes que demuestran investigación real, y tenga visibilidad total de dónde pierde ventas (con números, no sensaciones).

---

## Kit del Salto — Estructura completa (HTML + PDF)

### Hero + Diagnóstico (4 grupos, 10 checks)
**Insight 1 — Dónde buscas:** "Una oferta publicada la ven cientos de closers a la vez. Un creador al que encuentras tú, solo te ve a ti."
- Check: Busco en bolsas/grupos/comunidades de ofertas
- Check: Fuera de bolsas no sabría dónde encontrar creadores
- Check: Llega punto donde no encuentro más perfiles

**Insight 2 — Qué escribes:** "Tu mensaje le sirve a cualquiera. Por eso no contesta nadie."
- Check: Mando casi el mismo mensaje a todos
- Check: En primer mensaje ya pregunto si buscan closer
- Check: Hablo de mi experiencia, pero sin números

**Insight 3 — A quién escribes:**
- Check: Escribo a creadores sin mirar tráfico/llamadas de venta
- Check: Me quedo con primer creador que contesta, aunque no encaje nicho

**Insight 4 — Cuándo paras:**
- Check: Si no contestan al primer mensaje, paso al siguiente
- Check: No llevo registro de a quién escribí y cuándo

### Atajo 2 minutos — "Mira tu mensaje con ojos del creador"
**Prompt para Claude/ChatGPT:** Actúa como creador high-ticket que recibe decenas de mensajes/semana de closers. Diagnostica: 1) ¿Lo abres/contestas o es copia-pega? 2) Fallos: Genérico / Pide demasiado pronto / Sin investigación / Sin siguiente paso 3) Qué dice de ti sin que lo digas 4) ¿Merece tu tiempo? (tráfico + llamadas de venta)

### Puente — "¿Es el proyecto o eres tú?"
Testimonios de closers que cambiaron de proyecto y el techo viajó con ellas. Antes de cambiar proyecto, diagnosticar si el freno es la oferta o el proceso.

### Clase privada (Jueves 29 oct, 18:00 España)
**Entregables:**
- Guion flexible con microcierres (arregla Reflejo + Sostén)
- SOP nutrición pre-llamada (arregla Lectura/no-show)
- SOP "¿Tu oferta o tu proceso?" (cuello de botella volumétrico)
- **Bonus:** Analizador de llamadas (minuto exacto + origen objeción)

---

## Kit Espejo / Cierre Espejo — Sistema CRM Operativo

### 3 Fases del Cierre Espejo (Clasificación obligatoria)
| Fase | Momento | Resultado | Qué falla |
|------|---------|-----------|-----------|
| **LECTURA** | Antes de llamada | No show | Nutrición pre-llamada (SOP) |
| **REFLEJO** | Durante llamada | No cerrada | Guion flexible + microcierres |
| **SOSTÉN** | Precio + después | Seguimiento | Guion + mensajes seguimiento Silvia |
| **CERRADA** | — | Ninguna | — |

### Conectores requeridos (en orden)
1. **Fathom** — Graba/transcribe llamadas
2. **Google Calendar / Outlook** — Detecta no-shows, saca contacto/fecha reserva
3. **Google Sheets** — Escribe filas en CRM Espejo (pestaña "Llamadas")
4. **CRM empresa (opcional)** — HubSpot, Pipedrive, Attio, Close, Notion

### CRM Espejo (Google Sheets) — Estructura 6 pestañas
| Pestaña | Función | Quién escribe |
|---------|---------|---------------|
| **Llamadas** | Registro maestro (16 cols A-P + 4 cols R-U pagos) | IA (conector Sheets) o usuario (bloque para pegar) |
| **Hoy** | Informe día: llamadas, cierres, PIF/cuotas, cobrado, objeciones, motivos no cierre, no-shows, para mañana | Se calcula sola (fórmulas) |
| **Dónde fallo** | Cuello de botella semanal + qué arreglar + con qué entregable clase | Se calcula sola |
| **Pendientes** | No-shows + seguimientos abiertos con fecha próximo paso | Se calcula sola |
| **Las 8 fases** | Referencia: 10 momentos (Lectura 1, Reflejo 7, Sostén 2) | Estática |
| **Cómo usarla** | Instrucciones uso | Estática |

### Columnas "Llamadas" (16 + 4 pagos = 20 total)
| Col | Campo | Tipo |
|-----|-------|------|
| A | Fecha llamada (DD/MM/AAAA) | Requerido |
| B | Lead (nombre) | Requerido |
| C | Contacto (email/IG) | Del calendario/llamada |
| D | Origen (Reel/Historias/DM/Anuncio/Referido/Otro) | Si se sabe |
| E | Fecha reserva (DD/MM/AAAA) | Cuándo se creó evento |
| F | ¿Se presentó? (Sí/No) | Requerido |
| G | Resultado (Cerrada/Seguimiento/No cerrada/No show) | Requerido |
| H | Importe € (solo número, vacío si no cerró) | Requerido si cerró |
| I | Objeción final (texto corto) | Requerido si no cerró |
| J | Objeción real (Tiempo/Dinero/Valor/Ninguna) | Solo 3 reales |
| K | Fase donde se perdió (vacía → la rellena analizador clase) | **No tocar** |
| L | Nota llamada (vacía → la rellena analizador clase) | **No tocar** |
| M | Lo que falla: fase + problema en una frase (no solución) | Requerido |
| N | Próximo paso | Requerido si no cerró |
| O | Fecha próximo paso (DD/MM/AAAA) | Requerido si no cerró |
| P | Enlace Fathom | Requerido |
| R | Forma pago (PIF/Cuotas/Sin confirmar) | Vacío si no cerró |
| S | Detalle pago (cuotas: n×importe/frecuencia/cobradas; PIF: "Pago único") | |
| T | Cobrado € (PIF=total; cuotas=ya cobrado) | Solo número |
| U | Motivo no cierre (frase en No cerrada/Seguimiento/No show) | Vacío si cerró |

**Reglas CRM:**
- Col Q y fila 1 = se calculan/títulos → **NO TOCAR**
- Filas "EJEMPLO" no cuentan → preguntar si borrar
- Si llamada ya existe (mismo lead+fecha) → actualizar, no duplicar
- Si seguimiento/no-show resuelto → cambiar Resultado
- Releer lo escrito y avisar filas afectadas

### Forma de Pago (en cada venta cerrada)
- **PIF:** Pago único total
- **CUOTAS:** n cuotas × importe, cada X tiempo, primera cobrada S/N
- **SIN CONFIRMAR:** Si en llamada no queda claro → preguntar en informe, no deducir
- **Distingue:** VENDIDO (total contrato) vs COBRADO (entrado ya). En PIF = iguales; en cuotas ≠

### Las 3 Objeciones Reales (todo lo demás = humo)
| Objeción dicha | Real | Ejemplos |
|----------------|------|----------|
| "Me lo pienso" | **Dinero o Valor** | — |
| "Lo hablo con pareja/socio" | **Dinero** (persona no decide) | — |
| "No es el momento" | **Valor o Miedo** | — |
| "Mándame info" | **Valor** | — |

### RESUMEN DE UNA LLAMADA (formato obligatorio)
1. **Ficha:** prospecto, fecha, duración, qué se vendía, precio, resultado. Si cerró → forma pago (PIF/cuotas + detalle)
2. **Fase Cierre Espejo** (Lectura/Reflejo/Sostén) + frase llamada que justifica. Si cerró → dilo.
3. **Objeción:** qué dijo + real (Tiempo/Dinero/Valor)
4. **Próximo paso:** cuándo volver a escribir (fecha) + por qué, **sin redactar mensaje**
5. **CRM:** escribe/actualiza fila en hoja; si no conector → bloque FILAS PARA MI CRM. Si CRM empresa → nota al lead

### INFORME DIARIO (léase en 2 min)
1. Números día: agendadas, hechas (presentaron), no-show, cerradas, seguimiento, no cerradas, tasa cierre (cerradas/presentaron)
2. Dinero día: vendido (total contratos), cobrado hoy, ventas PIF vs cuotas, ticket medio
3. Ventas cerradas: 1 línea/venta (lead, importe, forma pago, origen lead)
4. Objeciones: 1 línea/llamada (frase textual + real). Al final: la que más se repite
5. Motivo no cierre: por llamada no cerrada/seguimiento → motivo 1 frase, fase (Reflejo/Sostén), frase justificativa
6. No-show: quién + hora
7. Para mañana: seguimientos/reagendas hoy/mañana (incluye días previos de hoja). **Sin redactar mensajes**
8. Comparado con semana: si hay datos 7 días → tasa cierre y show rate arriba/abajo media. Si no hay datos → saltar
9. CRM: si IA escribió → filas añadidas/actualizadas; si no → bloques FILAS PARA MI CRM + PAGOS PARA MI CRM. Recordar: todo en pestaña "Hoy"
**Si 0 llamadas día → 1 línea + saltar a apartado 7**

### INFORME SEMANAL
1. **Cuello de botella** (orden prioritario):
   - Show rate < 70% → **LECTURA** (no-show)
   - Tasa cierre < 25% + mayoría "No cerrada" → **REFLEJO**
   - Seguimientos > cerradas → **SOSTÉN**
   - Else → **VOLUMEN** (fases OK, faltan agendas)
2. Resumen: agendadas, presentaron, show rate, cerradas, tasa cierre, vendido, cobrado, PIF vs cuotas
3. Ventas perdidas por fase: Lectura / Reflejo / Sostén
4. No-show: quién, fecha/hora, patrones (día, hora, origen lead, días reserva→llamada)
5. Objeciones: cuenta Tiempo/Dinero/Valor + frase más repetida
6. Pendientes: cada no-show + seguimiento abierto con fecha escribir. **Sin redactar mensajes**
7. **Qué arreglar primero:** fase que más ventas costó + con qué entregable clase se arregla
8. CRM: filas añadidas/actualizadas; si no conector → bloque FILAS PARA MI CRM (incluye no-shows). Si CRM empresa → notas + cambios etapa propuestos

### Bloque FILAS PARA MI CRM (para pegar en Sheets)
16 columnas separadas por TAB, sin encabezados, 1 línea/llamada (incluye no-shows). En no-show: objeción vacía, próximo paso = "Mensaje para reagendar" + fecha mañana. Todo lead en Seguimiento → próximo paso + fecha obligatorios.

### Bloque PAGOS PARA MI CRM (separado, 4 cols R-U)
R Forma pago | S Detalle | T Cobrado € | U Motivo no cierre
Antes de cada línea → decir lead para saber fila. **No meter en bloque 16 cols** (col Q se calcula sola).

### LO QUE SE ENTREGA EN LA CLASE (29 oct, 18:00)
- Guion flexible con microcierres → arregla Reflejo + Sostén
- SOP nutrición pre-llamada → arregla Lectura
- SOP "¿Tu oferta o tu proceso?" → freno oferta vs proceso
- **Bonus:** Analizador llamadas (minuto exacto + origen objeción)

### AL FINAL DE CADA INFORME — Línea clase privada (según cuello botella)
- **LECTURA:** "El 29 octubre, Silvia entrega SOP nutrición pre-llamada para que la gente tenga motivo real para presentarse. Confírmala en tu calendario."
- **REFLEJO Y SOSTÉN:** "El 29 octubre, Silvia entrega guion flexible con microcierres para que objeciones no lleguen al precio, y analizador para ver minuto exacto donde se te escapa. Confírmala."
- **VOLUMEN:** "Tus fases funcionan, pero no generas lo que quieres. El 29 octubre, Silvia explica cómo llegó a +7k €/mes con 3 llamadas/día. Confírmala."

---

## Mapeo a HSCSG v15 OS (Principio Anfibio)

| Concepto Kit | → Módulo HSCSG | Vaso comunicante |
|--------------|----------------|------------------|
| Diagnóstico prospección (4 grupos) | `capacidades.prospectingDiagnostic` | `toggleCapability` per group |
| Atajo prompt IA (2 min) | `agentCanvas.mirrorPrompt` | `spawnAgent` role=mirror |
| Cierre Espejo 3 fases | `caas.cierreEspejo` + `symbiosky.callAnalysis` | `symCastVote` (fase) + `symDecayTick` (seguimiento) |
| CRM Espejo (Sheets + Fathom + Cal) | `integral.crmEspejo` + `caas.crmConnectors` | `ingestIntegralSignal` (call data) + `runCaasPayout` (pagos) |
| Informes diario/semanal auto | `automaton.dailyReport` + `automaton.weeklyReport` | `heartbeat` loop + `proposeAction` |
| 3 objeciones reales (Tiempo/Dinero/Valor) | `boundaries.objectionTaxonomy` | `addBoundaryRule` per objection |
| Forma pago PIF/Cuotas | `caas.paymentTerms` | `runCaasPayout` filtered by `poh.identities` |
| Analizador llamadas (minuto exacto) | `symbiosky.callAnalyzer` (Bonus clase) | `symCastVote` per minute |
| Entregables clase (guion, SOPs, analizador) | `agentCanvas.classDeliverables` | `spawnAgent` per deliverable |

---

## Decisiones de diseño EBD

| ID | Decisión | Justificación |
|----|----------|---------------|
| **EBD-KIT-01** | Diagnóstico 4 grupos (Dónde/Quién/Qué/Cuándo) = taxonomía exhaustiva fuga prospección | "Una prospección solo se pierde en cuatro sitios" — cubre 100% superficie fuga |
| **EBD-KIT-02** | Atajo 2 min = prompt IA para testear mensaje ANTES de enviarlo | "No te lo reescribe a propósito. Te dice POR QUÉ falla" — evita quemar leads |
| **EBD-KIT-03** | 3 fases Cierre Espejo (Lectura/Reflejo/Sostén) = mutuamente excluyentes, cubren 100% pérdidas | No-show = antes; No cerrada = durante; Seguimiento = después; Cerrada = ninguna |
| **EBD-KIT-04** | Solo 3 objeciones reales (Tiempo/Dinero/Valor) — resto = humo | Reduce ruido cognitivo; mapea directo a SOPs clase (nutrición/guion/seguimiento) |
| **EBD-KIT-05** | CRM Espejo = Sheets (propio) + conectores IA (Fathom/Cal/Sheets/CRM) | Usuario dueño datos; IA opera, no almacena; funciona sin CRM empresa |
| **EBD-KIT-06** | Col K (Fase) y L (Nota) vacías → las rellena analizador clase | Separación clara: IA = diagnóstico; Analizador = análisis minuto exacto |
| **EBD-KIT-07** | PIF vs Cuotas distinguido siempre (VENDIDO ≠ COBRADO) | En cuotas, cobrado = cuotas ya pagadas; evita inflar métricas cobro |
| **EBD-KIT-08** | Informes terminan con línea clase privada según cuello botella | CTA contextualizada: no genérica, específica a lo que duele hoy/semana |
| **EBD-KIT-09** | "Sin redactar mensajes" en informes → los de Silvia se ven en clase | Evita dependencia; closer aprende a escribir, no copia plantillas |

---

## Validaciones DV requeridas

| ID | Validación | Criterio éxito |
|----|------------|----------------|
| **DV-KIT-01** | `diagnoseProspection(checks[10])` → grupo con más marks = fuga principal | 100% cobertura 4 grupos; 0 grupos vacíos |
| **DV-KIT-02** | `mirrorPrompt(bio, message)` → returns {verdict, faults[], selfSignal, worthTime} | Faults ⊆ {Genérico, PidePronto, SinInvestigación, SinSiguientePaso} |
| **DV-KIT-03** | `classifyCall(transcript)` → phase ∈ {Lectura, Reflejo, Sostén, Cerrada} + justific frase | 100% llamadas clasificadas; 0 sin fase |
| **DV-KIT-04** | `extractObjection(transcript)` → real ∈ {Tiempo, Dinero, Valor} + frase textual | 0 objeciones "Otro"; mapeo 100% a 3 reales |
| **DV-KIT-05** | `crmEspejo.writeRow(callData)` → row en Sheets cols A-U correctas | Conector Sheets: fila añadida/actualizada; sin conector: bloque TAB válido |
| **DV-KIT-06** | `dailyReport(callsToday)` → format 9 apartados, <2 min lectura | Incluye: números, dinero, cerradas, objeciones, motivos, no-shows, mañana, comparado, CRM |
| **DV-KIT-07** | `weeklyReport(callsWeek)` → cuello botella + qué arreglar + entregable clase | Cuello botella follows priority order; entregable matches phase |
| **DV-KIT-07** | `paymentTerms(call)` → PIF/Cuotas/SinConfirmar + detalle + cobrado | VENDIDO vs COBRADO correcto; PIF=total, cuotas=parcial |
| **DV-KIT-08** | `endOfReportLine(bottleneck)` → correct class CTA line | LECTURA→SOP nutrición; REFLEJO/SOSTÉN→Guion+Analizador; VOLUMEN→Clase completa |

---

## Estructura de archivos FASE 3 propuesta

```
src/core/lib/kit-salto.ts              # Diagnóstico prospección (4 grupos, 10 checks), Atajo prompt IA
src/core/lib/kit-espejo.ts             # Cierre Espejo: 3 fases, 3 objeciones, clasificación llamada
src/core/lib/kit-crm.ts                # CRM Espejo: writeRow, readSheet, dailyReport, weeklyReport, paymentTerms
src/core/lib/kit-connectors.ts         # Conectores: Fathom, Calendar, Sheets, CRM empresa
src/core/state/kit.ts                  # Tipos: ProspectionCheck, MirrorPrompt, CallPhase, ObjectionReal, CierreEspejoPhase, CRMRow, DailyReport, WeeklyReport
src/core/state/hooks/kit.ts            # Selectores: useDiagnosis, useMirrorPrompt, useCallClassification, useDailyReport, useWeeklyReport
src/core/state/store.ts                # Integración: kit slice + actions + resetAll + partialize
src/app/screens/KitSalto.tsx           # Pantalla: Diagnóstico (checks), Atajo (prompt), Puente, Clase CTA
src/app/screens/KitEspejo.tsx          # Pantalla: CRM (Llamadas/Hoy/Dónde fallo/Pendientes), Informes, Conectores
src/app/layout/Aside.tsx               # Nav "Kit Salto" + "Kit Espejo" + Routes "/kit-salto", "/kit-espejo"
skills/kit-salto/                      # 2 skills: prospection-diagnosis, mirror-prompt
skills/kit-espejo/                     # 3 skills: cierre-espejo, crm-espejo, call-analysis
```

---

## Conexión con Harvey + PoH/Kleros + RBE

- **Harvey (sales agent)** → `kit-salto.diagnosis` = versión ligera de Harvey.discover/profile/write/send; `kit-espejo.callAnalysis` ≈ Harvey.handle inbound
- **PoH/Kleros (identity + courts)** → `kit-espejo.crm` filtrado por `poh.identities` (solo humanos verificados cierran); disputas pagos → `kleros.courts`
- **RBE (universal dividend)** → `kit-espejo.paymentTerms` PIF/Cuotas compatibles con `caas.runCaasPayout` + `zeitnus.dividendPolicy`; `poh.identities` gate para elegibilidad
- **Control Laws Aging** → `kit-espejo.callAnalyzer` (minuto exacto objeción) ≈ `aging-control.lieBracket` sequencing: orden intervenciones = orden microcierres en llamada

---

## Próximos pasos (FASE 3)

1. **FASE 3 core** — `kit-salto.ts` (diagnosis + mirrorPrompt) + `kit-espejo.ts` (3 fases + 3 objeciones + classification)
2. **FASE 3 CRM** — `kit-crm.ts` (Sheets write/read, daily/weekly reports, paymentTerms, paymentBlocks)
3. **FASE 3 Conectores** — `kit-connectors.ts` (Fathom, Calendar, Sheets, CRM empresa adapters)
4. **FASE 3 Pantallas** — `KitSalto.tsx` (Diagnóstico interactivo + Atajo prompt copy), `KitEspejo.tsx` (CRM tabs + Informes + Conectores status)
5. **FASE 3 Skills** — 5 skills auto-ejecutables
6. **Integración Harvey** — Reutilizar `harvey-discovery.ts` + `harvey-email.ts` para prospección fuera de bolsas
7. **OpenSpec** — `openspec/specs/kit-salto-espejo/`
