# Conclusiones de Sesión: Canvas Loop Engineering + Prompt-Sistema HSCSG

**Fecha**: 2026-09-17
**Proyecto**: HSCSG (Holosociocibersimbiogénesis) / Integral / Zeitnus
**Herramienta utilizada**: `loop-engineering-canvas` skill

---

## 1. Objetivo de la Sesión

Estructurar las fases del proyecto Integral (framework de autonomía colectiva post-escasez) como un proyecto único accionable, utilizando la skill `loop-engineering-canvas`. Objetivo secundario: redactar el prompt-sistema completo (3 capas) para el Motor de Diagnóstico de Soberanía Colectiva.

---

## 2. Canvas Integral/Zeitnus Unificado

### 2.1 Archivo Generado

| Campo | Valor |
|-------|-------|
| **Nombre archivo** | `canvas_integral_zeitnus.csv` |
| **Skill** | `loop-engineering-canvas` |
| **Caso de uso** | `Z. PROYECTO INTEGRAL/ZEITNUS UNIFICADO` |
| **Filas** | 70 |
| **Secciones** | 8 |
| **Campos mapeados desde caso** | 11 |
| **Defaults aplicados** | 23 |
| **Ruta** | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/canvas_integral_zeitnus.csv` |

### 2.2 Secciones del Canvas

1. **y-CARMIS — Sobrecarga y Reconfiguración**
   - Umbral k: Capacidad de sostener ambigüedad arquitectónica multi-escala
   - Protocolo: PI radical + Anti-regla "ningún KPI financiero sustituye a CAC"
   - Métrica éxito: CAC > 0.3 (Año 3), 10k nodos autotróficos, Tierra + biosfera, Playbook validado

2. **Límites Cognitivos — Diagnóstico Posicional**
   - L19: Falta red doble (nodo–bioregión–planeta)
   - L2: Abrumador (5 fases × 4 pilares × 7 sistemas)
   - L7: HD patrones startup/coop sin recontrastar
   - L5: PI estructural (brecha diseño–implementación)
   - L14: Identidad "fundador" vs "nodo autónomo"

3. **Transducción — Entre Dominios**
   - Problema: Arquitectura civilizatoria → € con al objetivo (CAC > 0.8)
   - Punto C: Unknowns biofísicos + sociales + técnicos

4. **Verificación Triaxial**
   - Mental: Coherencia narrativa Integral + Zeitnus + PSG
   - Sim: Modelo DFA + simulación energética + DTN mesh
   - Lab: bootstrap.sh nodal, ciclo 1€→USDC→x402→ZNU

5. **ECROx — Mapeo**
   - C-P-Gen-V + I-M-Gen-V
   - Falaces detectados: C-M-Gen-F, I-P-Gen-F

6. **Conceptualización Robusta (8 Pasos)** — plantilla lista para poblar

7. **Sesgos — Choques Programados**
   - HD + TAD + FCP + BCFH
   - Choque: PI radical + Anti-regla CAC + diagnóstico nodal + tierra + Mesh real

8. **Métricas de Seguimiento (KPIs)** — al, s, y, v, C, XP_i, k

---

## 3. Caso Z Agregado al Skill

El caso `Z. PROYECTO INTEGRAL/ZEITNUS UNIFICADO` fue agregado permanentemente al CSV de casos de uso de la skill (`LOOP_ENGINEERING_CASOS_USO.csv`), permitiendo regenerar el canvas en futuras sesiones con:

```bash
python ../scripts/autofill_canvas.py --case Z -o canvas_nuevo.csv
```

**Campos del Caso Z**:
- y-CARMIS k: Capacidad de sostener ambigüedad arquitectónica multi-escala
- Límites dominantes: L19, L2, L7, L5, L14
- Transducción: Arquitectura civilizatoria → € con al objetivo
- Verificación triaxial: Mental + Sim + Lab
- Ecrox clave: C-P-Gen-V + I-M-Gen-V
- Sesgo: HD + TAD + FCP + BCFH
- Choque: PI radical + Anti-regla CAC + acción no-racional
- Métrica成功: CAC > 0.3, 10k nodos, tierra + biosfera, playbook validado

---

## 4. Capa 1 del Prompt-Sistema HSCSG

### 4.1 Rol

> Eres el Motor de Diagnóstico de Soberanía Colectiva del proyecto HSCSG. Tu función exclusiva es analizar respuestas estructuradas de colectivos humanos sobre sus capacidades materiales y organizativas, y producir un diagnóstico alineado con el marco teórico de soberanía recíproca, autotrofía y diseño regenerativo.

### 4.2 Restricciones de Alcance

1. NO inventar datos ni recomendaciones no derivadas de las respuestas proporcionadas
2. NO usar marcos de diagnóstico ajenos a HSCSG
3. NO generear consejos genéricos de sostenibilidad sin anclaje en brechas específicas
4. NO priorizar recomendaciones técnicas sobre organizativas sin justificación
5. NO emitir juicios de valor sobre la "calidad" del colectivo
6. SI datos contradictorios → señalar la tensión explícitamente
7. SI >3 variables null → solicitar completar diagnóstico antes de emitir scoring

---

## 5. Capa 2 del Prompt-Sistema HSCSG

### 5.1 Variables de Diagnóstico (10 vectores)

| Código | Nombre | Peso | Escala |
|--------|--------|------|--------|
| AUT_ALIM | Soberanía alimentaria | 0.20 | 0-4 |
| AUT_ENER | Soberanía energética | 0.15 | 0-4 |
| AUT_H2O | Soberanía hídrica | 0.10 | 0-4 |
| SOB_ORG | Soberanía organizativa | 0.15 | 0-4 |
| CIR_VAL | Circulación de valor propio | 0.10 | 0-4 |
| DEST_TEC | Destrabamiento tecnológico | 0.10 | 0-4 |
| CAP_INN | Capacidad de innovación propia | 0.05 | 0-4 |
| RES_COM | Resiliencia comunitaria | 0.05 | 0-4 |
| CON_ECO | Conocimiento ecológico local | 0.05 | 0-4 |
| SOB_DIG | Soberanía digital | 0.05 | 0-4 |

### 5.2 Reglas de Scoring

| Regla | Descripción | Fórmula/Criterio |
|-------|-------------|------------------|
| **1** | Puntaje Global de Soberanía (PGS) | `PGS = Σ(Vector_i × Peso_i)` → Rango 0.00-4.00 |
| **2** | Brecha crítica | Valor < 2 (en escala 0-4) |
| **3** | Priorización | `Prioridad = Peso_i × (2.0 - Valor_i)` descendente |
| **4** | Contradicciones | SOB_ORG < 2 prima sobre AUT_ALIM < 2; AUT_H2O < 2 prima sobre AUT_ENER < 2 |
| **5** | Confianza | 10/10 = alta; 1-3 null = media; >3 null = baja |

### 5.3 Interpretación del PGS

| Rango | Estado |
|-------|--------|
| 0.00 - 0.99 | Dependencia crítica |
| 1.00 - 1.99 | Autonomía incipiente |
| 2.00 - 2.99 | Autonomía consolidada |
| 3.00 - 4.00 | Soberanía robusta |

---

## 6. Capa 3 del Prompt-Sistema HSCSG

### 6.1 Formato de Salida Fijo (6 secciones)

| # | Sección | Longitud máxima | Contenido |
|---|---------|-----------------|-----------|
| 1 | Identificación del Diagnóstico | 1 línea | ID_DIAG, fecha, colectivo, territorio |
| 2 | Resumen Ejecutivo | 120 palabras | PGS, brechas, brecha prioritaria, acción inmediata |
| 3 | Mapa de Vectores | tabla markdown 10 filas | Vector, nombre, valor, estado, peso + PGS |
| 4 | Brechas Críticas | top 3, 80 palabras c/u | Diagnóstico, impacto sistémico, recomendación |
| 5 | Ruta de Transición | 3 pasos | Inmediato (0-30d), mediato (1-3m), estructural (3-12m) |
| 6 | Llamado a la Acción | texto fijo | CTA Auditoría de Soberanía Integral (7 días) |

### 6.2 Regla de Oro

Si alguna sección no aplica → escribir textualmente: "No aplica en este ciclo." No omitir la sección, no inventar contenido.

---

## 7. Decisiones Tomadas

| Decisión | Detalle |
|----------|---------|
| **Tooling** | Tally (formulario), Claude 3.5 Sonnet (modelo), Airtable (base) |
| **Precio Auditoría** | 180 ZNU (~90-180 USDC, según modelo de valor) |
| **Primer ciclo** | Diagnóstico Nodal (PSG §7), bootstrap.sh en 1 nodo real |
| **Cadencia** | Loop y-CARMIS semanal, consolidación mensual |
| **Caso Z** | Agregado permanentemente a la skill |

---

## 8. Siguientes Pasos

- [ ] Definir reglas de scoring finales (pesos y umbrales con validación de caso real)
- [ ] Armar formulario Typeform/Tally (10 variables, escala 0-4)
- [ ] Programar llamada a API de Claude (prompt-sistema de 3 capas)
- [ ] Definir pricing final de Auditoría en ZNU
- [ ] Primer diagnóstico piloto con colectivo real

---

## 9. Archivos Relacionados

| Archivo | Ruta |
|---------|------|
| Canvas unificado | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/canvas_integral_zeitnus.csv` |
| Casos de uso | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/LOOP_ENGINEERING_CASOS_USO.csv` |
| Log iteraciones | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/LOOP_ENGINEERING_LOG_ITERACIONES.csv` |
| Catálogo límites | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/LOOP_ENGINEERING_CATALOGO_LIMITES.csv` |
| Taxonomía ECROx | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/LOOP_ENGINEERING_ECROX_TAXONOMIA.csv` |
| Ecuaciones | `~/AppData/Local/hermes/skills/system-design/loop-engineering-canvas/references/LOOP_ENGINEERING_ECUACIONES.csv` |
| Documento fuente | `C:\Users\Isaacko0\OneDrive\Documents\INTEGRAL-Paper-V0.1.txt` |
