# ALRAC Governance Specification
## openspec/specs/alrac-governance.md

---

## Overview
**Status**: Draft v1.0  
**Domain**: ALRAC Governance (Paz operativa, no poder)  
**Version**: 1.0.0

---

## 1. Nombre es Contrato

**Alrac** = sustrato relacional que el Sistema Alraico define como *"el invariante que asegura que el sistema nunca se convierta en otro instrumento de poder"*, nombrado en honor a la esposa de Amid Dabir.

> Usar ese nombre como razón social convierte la **paz en condición de existencia, no en eslogan**. Si el consorcio se vuelve instrumento de poder, traiciona su propio nombre.

---

## 2. Siete Principios (Javier) → Instrumentos ALRAC

| Principio | Instrumento en ALRAC |
|-----------|---------------------|
| Necesidades básicas garantizadas | Base Material / vectores AUT (HSCSG) |
| Mercados limitados reglas sociales/ecológicas | Prohibición cambiaria + techo ±500 TQ |
| Propiedad diversa | Fideicomiso comunitario indivisible + coop Zeitnus |
| Democracia económica | Asamblea nodo + jurados sorteados (CEL) |
| Impuestos progresivos / límites concentración | β_crit + fondo comunitario |
| Menos dependencia crecimiento | Postulado 4 + saldo cero |
| Planificación ecológica democrática | Catálogo energético + anclaje 1 TQ = 1 kWh |

---

## 3. Cinco Anti-Reglas (Javier) = Sesgos Alraicos

| Anti-Regla | Sesgo Alraico |
|------------|---------------|
| Solo más crecimiento | **TAD** — explotar demora acción/consecuencia |
| Solo nacionalizar | **HD** — cambiar dueño sin recontrastar modelo |
| Solo mercado verde | **FCP** — relato tranquilizador en vez de choque con lo inherente |
| Decrecimiento sin redistribución | **γ_ind ≪ ½θ_generado** — explotación (PPE) |
| Tecnología sin cambio social | **FCP** forma "tecnofix" |

> **Prueba de validez**: fuente externa (Javier) llega a los **mismos 5 diagnósticos** con vocabulario distinto → el marco alraico **transduce correctamente**.

---

## 4. Gobernanza de Paz

### 4.1 Contrato de No Absorción
Ninguna capa exige a otra su unidad, licencia o vocabulario.

### 4.2 Verificación Triaxial como Árbitro
Disputas técnicas se contrastan, no se votan:
1. **Mental** — coherencia lógica interna
2. **Simulación** — modelo computacional
3. **Laboratorio** — evidencia empírica física

### 4.3 γ-CARMIS / Consentimiento Total
Cuando tensión > κ → reconfiguración obligatoria antes de ruptura (mismo principio que NEXO para cambios de núcleo).

### 4.4 Escalera de Decisión (Gran Alianza)
```
1. Construir → 2. Integrar → 3. Asociarse → 4. Adoptar → 5. Co-crear → 6. Fusionar
```
> NO se empieza preguntando "¿qué plataforma gana?" sino "¿qué capacidad necesita el ecosistema?"

### 4.5 Auditoría Licencias = Primer Entregable
Vacío HSCSG (~84 backups, ~25 licencia declarada, conflicto CC BY-NC-ND 4.0 Yoka & Fabio Balbi) se cierra **antes** de invitar formalmente a nadie.

---

## 5. Reparto: Ecuación de Amid como Estatuto Financiero

```
ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
donde φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾ / 10)
```

- **½ del valor** → a quien lo generó
- **Resto** → se reparte entre capas que participaron, ponderado por **armonía (αʰ)** aportada
- **PPE (γ_ind ≈ ½θ_generado)** = cláusula auditoría automática contra explotación
- **β_crit** = techo anti-acaparamiento interno

> **Ventaja**: ética en la fórmula, no en la promesa. Si ALRAC y NEXO coordinan/fusionan, Yoka (y eventualmente Lautaro) entran en la misma tabla con mismo trato.

---

## 6. Hallazgo §3.5: ALRAC = NEXO (Mismo Patrón, 2 Vocabularios)

| Amid (Topológico) | Yoka (Experiencial/Somático) |
|-------------------|------------------------------|
| αʰ = Ω·s > κ | Ausencia fricción sostenida |
| γ-CARMIS (fractura/reconfig) | Consentimiento total |
| Verificación triaxial | Convergencia sin autoridad |
| Separación legítima | Separación legítima |

**Riesgo**: Construir ALRAC sin coordinar con Yoka = 2 federaciones redundantes compitiendo por Cergio, Isaac, Amid.

**Acción inmediata (Paso 0)**: Conversación con Yoka — ¿ALRAC = vehículo comercial NEXO o capas coordinadas?

---

## 7. Archivos de Referencia

| Archivo | Qué Contiene |
|---------|--------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §6 (Norma común), §8 (Reparto), §9 (Gobernanza), §3.5 (Hallazgo NEXO) |
| `docs/alrac_integration.md` | Isomorfismo 30 filas HSCSG ↔ ALRAC |
| `src/core/lib/alrac.ts` | computeHarmony, computeLDFVShare, gammaCARMIS, triaxialVerification |

---

## 8. Validaciones Críticas

- [ ] 7 principios mapeados a instrumentos ALRAC
- [ ] 5 anti-reglas = 5 sesgos alraicos (mapeo 1:1)
- [ ] Contrato no absorción explícito en código
- [ ] Verificación triaxial implementada como función
- [ ] γ-CARMIS implementado (trigger: αʰ < κ)
- [ ] Escalera decisión codificada (no votación simple)
- [ ] Reparto LDFV = fórmula Amid exacta
- [ ] Paso 0 Yoka documentado (fusión vs coordinación)