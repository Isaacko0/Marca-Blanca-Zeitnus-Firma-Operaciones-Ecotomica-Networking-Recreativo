# Monetary Integrations Log

Registro de integraciones monetarias aplicadas al documento HSCSG.

## v1.6 — Moneda PAR
- **Fecha:** 2026-06-30
- **Referente:** Moneda PAR (Bogotá, Colombia)
- **Principios extraídos:**
  - Trueque como infraestructura de soberanía vecinal
  - Crédito circular sin interés ni deuda perpetua
  - Bancos de tiempo como modelo de gobernanza comunitaria
  - Equivalencia 1:1 tiempo/servicio ↔ ZNU
- **Secciones modificadas:**
  - Introducción sección 14
  - Tabla de principios (agregada fila 7)
  - Sección 14.2 (trueque comunitario)
  - Métricas: Volumen de trueque ZCS, Índice de reciprocidad PAR, Deuda perpetua ZCS
  - Glosario: 4 términos nuevos
- **Documento resultante:** `modelo-negocio-objetivos-civilizatorios-hscsg.md` v1.6

## v1.x — Moneda Libre G1 y Túmin
- **Referentes:** Moneda Libre G1 (Francia, 2017) | Túmin (Espinal, México)
- **Principios extraídos:**
  - Creación monetaria democrática (G1) → Dividendo Soberano Inicial en ZCS
  - Circuito cerrado (Túmin) → ZCS como espacio económico dual
  - Gobernanza comunitaria de emisión (ambos) → Asambleas de nodos
  - Moneda no oficial ni obligatoria (Túmin) → Coexistencia provisional con moneda-Estado
- **Secciones modificadas:**
  - Sección 14 completa
  - Métricas: Cobertura ZCS, Velocidad de circulación, Demurrage, Brecha de fuga
  - Glosario: 8 términos monetarios

## Referentes pendientes de integración
- [ ] Bitcoin / Lightning Network
- [ ] Stablecoins soberanas
- [ ] Bancos de tiempo regionales
- [ ] Sistemas de crédito circular comunitario
- [ ] Monedas locales europeas/americanas

## v1.7 — Tres Fondos + Seis Tensiones + Métodos Repartición Centralizados (2026-10-20)
- **Fecha:** 2026-10-20
- **Referente:** Investigación exhaustiva repo Zeitnus (939 archivos, 504 Markdown) + evidencia externa (Chetty et al. JAMA 2016, Salud Familia Brasil, FDA geroscience, LGSC México, LFPDPPP 2025)
- **Principios extraídos:**
  - **Tres fondos separados** (Memoria, Cuidado, Autotrofia) con capas ontológicas distintas: muerte prematura evitable vs extensión vida sana validada vs continuidad memorial con consentimiento
  - **Herencia separada**: obra/memoria/reputación ERC-8004/Complete Data Package SÍ heredan; hr_vital/ZNU/TQ NO heredan (Matema 18, VITAL_TIME_CURRENCY_SPEC)
  - **Datos sensibles off-ledger**: LFPDPPP 2025 requiere consentimiento expreso revocable por escrito, autoridad Secretaría Anticorrupción, solo hashes/punteros en RAO inmutable
  - **Excedente sin unidad**: 4 tipos distintos (kWh termodinámico, TQ β_crit exceso liquidez, "excedentes autómata" 25% sin código, excedente neto fiat) → % fijo solo auditable sobre unidad declarada (ExcessUnit enum)
  - **No-miembros**: alternativa a prohibición total = permiso a costo real + 100% excedente generado a tres fondos (modelo cooperativo España ≥50% reserva extracooperativa, Uruguay 10% reserva no socios)
  - **OAD ≠ licencia**: Open Access Design = certificación diseño (Integral Collective); para conocimiento biomédico separar tres planos: conocimiento=licencia abierta, datos personales=nunca abiertos (solo agregados k-anonymity≥5), materiales/muestras=no publicados (MTA + Nagoya Protocol)
- **Métodos de repartición centralizados en `hscsg-asamblea-gobernanza/templates/asamblea-parametros.json` (single source of truth):**
  - Fondo Solarpunk (25% excedentes autómata, PGS≥1.5 → subvenciones nodos)
  - Commonomics Gaia (50/30/10/5 + facilitador caso a caso)
  - Gaia Commons Framework (33/33/33 estricto Local/National/Global)
  - ALRAC β_crit + Fondo Comunitario (threshold 30% liquidez, rate 50% excedente, gobernanza propuesta 5%/quórum 60%/máx 20% propuesta, nuevos propósitos: memory/food/preventive_care)
  - CaaS Revenue Share (pesos AUT×CDS 0.5/0.5, demurrage threshold 300 ZNU/rate 5%)
  - Virginia Network (N3 dinámico = kWh TQ medidos/1000, demurrage dinámico mediana ecosistema × CDS)
  - Tripartita HSCSG-Gaia-Ecoaldea (50/30/10/5/5 nuevo 5% fondo tierra)
  - FRNE Ecoaldea Raíces (15% fondo comunitario + restitución no especulativa = aportes - especulación×penalización)
  - Ecosystem Revenue Sharing 4 Círculos (Epistémico 15%/Infra HSCSG 20%/Nodos+Alianza 35%/Virginia 30%, peso unificado = roleWeight×(0.3+0.35×AUT+0.35×CDS)×(1+bonus_trazable))
  - LDFV Alrac (ω⁽ᵏ⁾ = ½·θ_generado⁽ᵏ⁾·(1+ι)·φʰ⁽ᵏ⁾, φʰ=0.95ᵏ·(1+αʰ/10), PPE γ_ind≪½θ→redistribución, β_crit techo anti-acaparamiento)
- **Secciones modificadas/creadas:**
  - Nueva skill `hscsg-asamblea-gobernanza` (decisión soberana + parámetros mutables versionados)
  - `src/core/lib/assemblyConfig.ts` + `types/asamblea.ts` (runtime configurable con hot-reload + MJ Gate validation)
  - `templates/asamblea-parametros.json` (single source of truth, semver, RAO anchor)
  - `scripts/simulate_assembly_decision.py` (simulación impacto métricas: excedente anual, cobertura cuidado, Gini, consentimiento memoria, excedente autotrofia)
  - `scripts/validate_legal_compliance.py` (validación LGSC Arts 78/80/81, LFPDPPP Arts 8/sensibles/ARCO, estatutos cooperativa, principios HSCSG inmutables)
  - Extensión `FundAllocation.purpose` en `openspec/specs/alrac-tq-taxEngine.md` + `src/core/lib/tq.ts` con `memory`, `food`, `preventive_care`
  - `docs/ESTAMENTO.md` (decisiones D1-D8 formales para Asamblea)
  - `docs/INVESTIGACION_TRES_FONDOS_SEIS_TENSIONES.md` (investigación completa citada)
- **Documento resultante:** Skill `hscsg-asamblea-gobernanza` v1.0.0 + actualización `hscsg-monetary-integration` v1.7
