# RESPALDO DE FUENTE — alrac-znu-espirulina-anchor.md

## Identificación de la fuente

- **Título:** alrac-znu-espirulina-anchor — Ancla del ZNU en espirulina y métrica Simbiodisc
- **Autor/origen:** Isaac (Zeitnus) · Consorcio ALRAC
- **Fecha:** 24 de noviembre de 2026
- **Versión:** Borrador v0.1
- **Tipo:** Especificación interna del ecosistema ALRAC / Zeitnus / HSCSG v15 OS
- **Estado:** Documento fuente interno (borrador, parámetros provisionales)

## ⚖️ Aviso de derechos de autor y estado del documento

Este documento es una especificación interna del ecosistema ALRAC / Zeitnus / HSCSG. Es un borrador v0.1 con parámetros provisionales. Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica en este repositorio. **No se reclama autoría ajena;** es un documento del propio ecosistema reproducido con el carácter de borrador que declara. Antes de cualquier implementación productiva, verificar contra los documentos fundacionales del Consorcio ALRAC y validar los parámetros provisionales.

## Texto completo de la fuente

# alrac-znu-espirulina-anchor

*Ancla del ZNU en espirulina y métrica Simbiodisc · Borrador v0.1 · 24 de noviembre de 2026 · Isaac (Zeitnus) · Consorcio ALRAC*

## 1. Propósito

Redefinir el ancla del ZNU (Capa 3) de la canasta básica a **capacidad verificada de espirulina**, y establecer **Simbiodisc** como la métrica que mide el avance del sistema hacia el destrabajo ético y el canutriciotranshumanismo, con un ciclo de retroalimentación permanente entre nodo y usuario.

## 2. Relación con las capas ALRAC

| Capa | Ancla | Función |
| --- | --- | --- |
| 1 · TQ | 1 kWh (sin cambios) | Costo físico y reciprocidad entre nodos. Invariante termodinámico (E=V). |
| 3 · ZNU | g PSE de espirulina (nuevo) | Unidad de autonomía nutricional. |
| Puente | Canasta básica | Solo conversión con el mundo fiat (modo conectado). |
| 5 · Gobernanza | Asamblea del nodo | Define umbrales, canasta de cuidado y reinversión. |

El TQ no cambia: así se conserva la interoperabilidad con la Red de Intercambio Federada y el ledger de saldo cero.

## 3. Ancla del ZNU

- **R3.1** La unidad de referencia es el **gramo de peso seco equivalente (g PSE)** de biomasa de espirulina producida bajo protocolo verificado.
- **R3.2** El ancla es de **capacidad, no de existencias**. El ledger registra compromisos de esfuerzo; el ZNU **no es redimible** en biomasa física.
- **R3.3** El protocolo PSE fija como mínimos: método de filtrado, porcentaje de materia seca, método de secado y, opcionalmente, ficocianina o clorofila como control. El detalle lo aprueba la asamblea.
- **R3.4** Solo cuentan terrarios con maduración verificada de 30 a 45 días de cultivo continuo (Derecho de Uso) y control de calidad: metales pesados, cianotoxinas y contaminación por otras cianobacterias.
- **R3.5** Se mantiene la expiración de 90 días del ZNU.
- **R3.6** El factor de canasta existe únicamente como puente en modo conectado.
- **R3.7** La espirulina es ancla de **nutrición biotecnológica y proteica**, no dieta total: aporta pocas calorías por ración y su vitamina B12 es mayormente pseudovitamina, no activa en humanos.

*Nota de escala (orden de magnitud, a verificar con el protocolo):* la espirulina seca ronda 4 kcal/g y 1 kWh equivale a unas 860 kcal, es decir, más de 200 g secos. Por eso la unidad práctica es el gramo y no un equivalente directo de 1 TQ.

## 4. Simbiodisc: panel de cuatro ejes

Simbiodisc es un **panel, no un número único**: un índice compuesto invita a optimizar la cifra y no lo que representa.

### 4.1 SD-T · Destrabajo

`SD-T = H_total / (personas × días de nutrición base cubiertos)`

- `H_total` incluye cultivo, mantenimiento, cosecha, verificación entre nodos y control de calidad.
- `SD-T_rel = SD-T / H_canasta`, donde `H_canasta` son las horas de trabajo asalariado necesarias para comprar la canasta de un día.
- Menor es mejor. Un valor menor que 1 indica que el nodo libera tiempo frente al mercado; si el valor sube, se activa una alerta.

### 4.2 SD-N · Nutrición

Ingesta verificada desde el inicio (t₀): g PSE por día, días continuos de consumo, lote de origen con resultado de calidad y diversidad de la dieta (para no medir solo espirulina).

### 4.3 SD-L · Longevidad provisional

- **Exposición acumulada desde t₀:** días de ingesta, dosis media, calidad de lotes. Se etiqueta como *exposición*, **no como biomarcador**.
- **Mediciones funcionales sencillas:** fuerza de agarre, frecuencia cardiaca en reposo, presión arterial, perímetro de cintura, horas y regularidad de sueño.
- **Reservado:** biomarcadores clínicos (glucosa o HbA1c, lípidos, PCR ultrasensible) cuando haya acceso a laboratorio. Encaja con el triaxial mental/simulación/laboratorio, con el último eje pendiente.
- **Línea base individual:** cada persona se compara contra su propio t₀. El panel muestra cambio, no ranking.

### 4.4 SD-F · Fricción de cuidado

Para cada ítem de cuidado: precio en TQ o ZNU, tiempo de puerta a boca, distancia al punto de entrega, pasos de preparación y tasa de abandono.

### 4.5 Reglas anti-distorsión

- **R4.1** Las horas de trabajo desplazadas fuera del nodo (insumos, sensores, equipos) cuentan en `H_total`.
- **R4.2** Todo reporte de Simbiodisc incluye el costo en kWh del TQ, para que ningún nodo mejore su índice con gasto energético desproporcionado.
- **R4.3** "Nutrición base cubierta" se define con un estándar fijo; si cambia el denominador, se versiona la métrica.

## 5. Ciclo de retroalimentación nodo-usuario (frontera móvil)

> medir → bajar fricción y trabajo → liberar tiempo → reinvertir en cuidado, investigación y automatización → medir

- **R5.1** El nodo reduce la fricción de los ítems de cuidado: precio, cercanía, presentación lista para usar, opción por defecto, posibilidad de hacerlo en compañía.
- **R5.2** Los datos agregados de adopción, continuidad y mediciones funcionales, sin identidad, alimentan el Simbiodisc del nodo y orientan a la asamblea.
- **R5.3** El apoyo **no caduca por fecha sino por ítem**: cuando un ítem baja de su umbral de fricción y la adopción se sostiene, el apoyo se traslada al siguiente ítem más difícil. La frontera avanza y el ciclo no se apaga.
- **R5.4** El descuento sale de la **cuenta de la asamblea** (suma cero), no de alterar a mano los precios energéticos del TQ.
- **R5.5** Se subsidia **acceso, no conducta**: la rebaja es igual para todos y no depende de cómo se cuide cada persona.
- **R5.6** La canasta de cuidado la arma la asamblea por beneficio demostrado por unidad de esfuerzo. La espirulina es un ítem más; dormir, moverse y comer verduras cuentan con más respaldo que cualquier suplemento.
- **R5.7** Piso de equidad: los recursos se asignan donde la fricción es mayor, no donde los resultados son mejores.

**Escenario: graduación de un ítem.** Un ítem de cuidado alcanza su umbral de fricción y mantiene adopción estable durante el periodo fijado. La asamblea retira el apoyo específico y reasigna ese presupuesto al ítem con mayor fricción.

## 6. Automatización y destrabajo ético

- **R6.1 Dividendo de destrabajo.** Las horas que ahorra la automatización se reparten como tiempo o crédito para todos y no como desempleo de quien cultivaba. La asamblea fija de antemano qué parte se reinvierte y cuál se libera.
- **R6.2** La automatización se evalúa también por su costo energético (TQ) y por el trabajo desplazado (R4.1).
- **R6.3** El destrabajo es ético si ningún nodo lo logra haciendo que otros trabajen más.

**Escenario: automatizar un terrario.** Un sensor y control de temperatura y pH reduce horas de mantenimiento. `SD-T` baja, el consumo en kWh sube y las horas de fabricación del equipo se suman por R4.1. La mejora solo se valida si el balance neto sigue siendo favorable.

## 7. Horizonte: inmortalidad colectiva

Se declara como **horizonte**, no como indicador. Simbiodisc no afirma ni promete extensión de la vida. Se aproxima con dos conjuntos de indicadores:

1. **Longevidad saludable individual:** años de vida con función, vía SD-L.
2. **Continuidad del commons:** nodos activos a lo largo de los años, protocolos replicados por nodos independientes, relevo generacional (personas que operan los cultivos sin ser fundadoras) y tiempo de recuperación tras un colapso de cultivo.

## 8. Lujo sin exclusividad

El "lujo" del canutriciotranshumanismo se define como **calidad, tiempo y abundancia** (variedad culinaria, biodisponibilidad, personalización), no como acceso reservado. Criterio: si algo solo funciona como lujo porque otros no lo tienen, queda fuera.

## 9. Salvaguardas

1. **Privacidad.** Los datos de salud personales **no se escriben en el ledger**, que es inmutable. Se quedan en el dispositivo de cada persona; a la red solo suben agregados o atestaciones sin datos individuales.
2. **Voluntariedad y sin consecuencias económicas individuales.** Ningún dato de salud modifica límites de TQ ni crédito ZNU de una persona.
3. **Intervenciones en humanos** (células planimales, simbiosis alga-humano): consentimiento informado y comité de ética, y **sin incentivos económicos por participar**. Los derechos de esfuerzo por investigación aplican solo a laboratorio y cultivo.
4. **Limitación declarada.** La ingesta autorreportada es ruidosa; el spec distingue lo que se verifica (lotes, cosecha) de lo que se declara.
5. **Tope energético** por nodo, vía TQ.
6. **Revisión periódica** de las métricas por la asamblea, para detectar si Simbiodisc se vuelve un fin en sí mismo.

## 10. Compatibilidad y licencias

- La Red de Intercambio Federada (LPF-1.0) exige que todo fork siga siendo federable con el principal; se usa la **paridad de métrica** entre nodos para conciliar kWh y g PSE.
- La LPF-1.0 prohíbe relicenciar o combinar con código propietario. Si el código de la Red entra al repo Marca Blanca (MIT), revisar compatibilidad antes de copiarlo.
- Cambiar la unidad afecta `pricing.md`, `currency_exchange.md` y `PRINCIPIOS_INNEGOCIABLES.md` del repo de la Red.

## 11. Supuestos y pendientes

- **Supuesto:** Simbiodisc se calcula por persona con datos locales y se agrega al nodo, donde ocurre el ciclo. A confirmar.
- Protocolo PSE exacto y tolerancias.
- Umbrales de fricción por ítem y periodo de adopción sostenida.
- Reparto entre reinversión y tiempo liberado (R6.1).
- Composición y funcionamiento del comité de ética.
- Estándar de "nutrición base cubierta".
- Verificar con el protocolo la equivalencia energética de la nota de escala.
