# ALRAC Revenue Specification
## openspec/specs/alrac-revenue.md

---

## Overview
**Status**: Draft v1.0  
**Domain**: ALRAC Business Model (4 líneas + Estudio Zeitnus)  
**Version**: 1.0.0

---

## 1. Motor de Caja Corta (Forner 12 formas IA)

Las "12 formas de ganar dinero con IA" = **motor de caja corta** que financia 4 líneas de fondo.

### Estrategias Forner Mapeadas a ALRAC
| # | Estrategia | Línea ALRAC que Financia |
|---|------------|--------------------------|
| 1 | Newsletters | D (Editorial/Escuela) |
| 2 | Web Apps | B (Nodo Llave en Mano) |
| 3 | Marketplaces | A (Diagnóstico Encaje) |
| 4 | Diseño | B (Nodo Llave en Mano) |
| 5 | Cursos | D (Editorial/Escuela) |
| 6 | Templates | D (Editorial/Escuela) |
| 7 | Consultoría | A (Diagnóstico) |
| 8 | Agency | E (Estudio Zeitnus) |
| 9 | Herramientas digitales | B (Nodo Llave en Mano) |
| 10 | Bots | A (Diagnóstico) |
| 11 | Contenido | D (Editorial/Escuela) |
| 12 | Automatizaciones | A (Diagnóstico) |

---

## 2. Cuatro Líneas de Negocio (A-D) + Estudio Zeitnus (E)

### A. Diagnóstico de Encaje y Paz Operativa — *Producto Ancla*
**"Paz" = αʰ > κ sostenido entre 𝕮 que no comparten creencias** (Amid) **o** ausencia de fricción sostenida (Yoka).

**Dos entregables:**
- **Encaje**: 𝕮-Atlas (Javier) diagnostica combinación de modelos para la comunidad — *incluso si la respuesta honesta es "no necesitan nada de esto"*
- **Desatasco**: AEI + 20 Límites + Protocolo Escalonado + γ-CARMIS para cooperativas fracturadas, conflictos de tierra, asambleas trabadas

**Clientes**: Cooperativas, ejidos, municipios, ONG, fondos impacto
**Financia**: Forner 3, 10, 12 (marketplaces, bots, automatizaciones)

---

### B. Nodo Llave en Mano
**Stack Cergio desplegable**: Servidor mTLS, terminales ESP32/NFC, catálogo energético calibrado, plantillas asamblea/fideicomiso. Instalación + mantenimiento anual.

**Componentes**:
- Hardware: ESP32 + NFC offline (sin internet)
- Software: Ledger TQ ±500, catálogo ICE/Ecoinvent regionalizado
- Gobernanza: Plantillas asamblea, fideicomiso comunitario
- Integración: RAO para auditoría procedencia

**Financia**: Forner 2, 4, 9 (web apps, diseño, herramientas digitales)

---

### C. Medición y Cumplimiento — *Línea con Cliente Presupuestado*
Cooperativas, ejidos, municipios, ONG obligados a reportar impacto. ALRAC vende reporte:
- **Marco**: 7 principios (Javier)
- **Método**: Catálogo energético + anclaje 1 TQ = 1 kWh
- **Evidencia**: Ledger TQ + RAO (infalsificable con anclaje termodinámico real)

**Clientes**: Cooperativas sector social México, gobiernos municipales, fondos impacto, cooperación internacional Venezuela/Centroamérica

---

### D. Editorial y Escuela Alraica
**Libros**: *El Dojo* (Amid), *Ecoaldeas Federadas* (Cergio), presentación Zeitnus, Documento Maestro E→V
**Falta**: Edición, distribución, traducción, curso estructurado
**Conecta**: Escuela de Pepe Sevilla (Happy/DeseOS)

**Financia**: Forner 1, 5, 6, 7, 8, 11

---

### E. Estudio Zeitnus
Desarrollo web clientes locales (Isaac). Flujo de caja que sostiene A–D mientras maduran.

---

## 3. Reparto: Ecuación LDFV

```
ω⁽ᵏ⁾ = ½ · θ_generado⁽ᵏ⁾ · (1 + ι) · φʰ⁽ᵏ⁾
φʰ⁽ᵏ⁾ = (0.95)ᵏ · (1 + αʰ⁽ᵏ⁾ / 10)
```

| Parámetro | Significado |
|-----------|-------------|
| θ_generado | Valor total generado por la transacción/servicio |
| ι | Inflación/ajuste temporal |
| φʰ | Factor armonía (decay 0.95^k + bonus αʰ/10) |
| αʰ | Armonía Ω·s (oscilación por sincronía) |
| k | Capa participante (0=epistémica, 1=contable, 2=interop, 3=fiat) |

**Cláusulas automáticas:**
- **PPE**: γ_ind ≈ ½θ_generado → auditoría automática explotación
- **β_crit**: Techo anti-acaparamiento interno

---

## 4. Validación 90 Días (Hito Crítico)

| Métrica | Objetivo |
|---------|----------|
| Primer cliente pagando Línea A | **Día 90** |
| Nodo TQ piloto funcionando | Semana 8-12 |
| LICENSE_AUDIT_ASIMILACIONES.md cerrado | Semana 3 |
| 4 cartas enviadas (Amid, Cergio, Javier, Pepe) | Semana 4 |

---

## 5. Archivos Referencia

| Archivo | Qué Contiene |
|---------|--------------|
| `docs/ALRAC_MASTER_INTEGRADO.md` | §7 (Qué vende), §8 (Reparto), §10 (Secuencia 90 días) |
| `src/core/lib/alrac.ts` | computeLDFVShare, computeHarmony, simulateNode |
| `docs/alrac_integration.md` | Isomorfismo: estrategias ↔ VIAs/CaaS tiers |

---

## 6. Validaciones Críticas

- [ ] 4 líneas + Estudio definidas con clientes claros
- [ ] Motor Forner mapeado a líneas
- [ ] Reparto LDFV = fórmula Amid exacta
- [ ] PPE y β_crit implementados como cláusulas automáticas
- [ ] Hito 90 días: primer cliente Línea A
- [ ] Separación TQ/ZNU por función (no compiten)