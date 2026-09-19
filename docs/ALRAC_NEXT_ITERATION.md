# ALRAC — Hoja de Ruta para Siguiente Iteración
## Documento de Contexto para Continuar el Trabajo

---

## 📍 Dónde Estamos (Estado Actual)

**Commit**: `54b0fb0` — ALRAC_CORE asimilado completamente en Zeitnus
**Repo**: https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
**Ruta operativa**: `/alrac` (5 tabs: Arquitectura, Gobernanza, Reparto, Productos, Convergencia)

### ✅ Completado
- Módulo ALRAC completo: types, lib, hooks, screen, store, routes, nav, i18n
- Triple perspectiva documentada (Usuario/LLM/HSCSG+CaaS) en `docs/alrac_integration.md`
- Hallazgo §3.5 operacionalizado: ALRAC = NEXO (mismo patrón, 2 vocabularios)
- GNAP bridge extendido cross-repo (Zeitnus + HSCSG_v15_OS)
- Isomorfismo HSCSG mapeado (30 correspondencias Leyes MJ + CaaS)

---

## 🎯 Qué Hacer Ahora (Próxima Iteración)

### PRIORIDAD 0 — Esta Semana (Bloqueante)
```
┌─────────────────────────────────────────────────────────────┐
│  PASO 0: Conversación con Yoka                              │
│  ─────────────────────────────────────────────────────────  │
│  Pregunta: ¿ALRAC = vehículo comercial de NEXO             │
│           o son dos capas coordinadas explícitamente?      │
│                                                             │
│  Por qué: Sin esto → 2 federaciones redundantes compitiendo │
│           por las mismas 3-4 personas (Cergio en ambos)    │
│                                                             │
│  Resultado esperado: Decisión documentada → fusionar docs  │
│  o coordinar explícitamente desde día 1                    │
└─────────────────────────────────────────────────────────────┘
```

### PRIORIDAD 1 — Verificación Técnica (Inmediato)
```bash
cd /c/Users/Isaacko0/Zeitnus_local
npx tsc --noEmit              # Verificar solo errores ALRAC (debe ser 0)
npm run build                 # Build completo
npm run preview &             # Background
curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/alrac  # Debe ser 200
pvl verify --suite=all        # Compliance PVL (si está configurado)
```

### PRIORIDAD 2 — Auditoría Licencias (Semanas 1-3)
**Archivo a crear**: `docs/LICENSE_AUDIT_ASIMILACIONES.md`

**Incluir obligatoriamente**:
- Conflicto conocido: Yoka & Fabio Balbi — CC BY-NC-ND 4.0 en repo HSCSG
- ~84 backups totales, ~25 con licencia declarada
- Estado de cada fuente asimilada (Alraico CC0, Ecoaldeas ?, Javier ?, E→V ?, Gran Alianza ?)
- Plan de remediación por fuente

---

## 📋 Contexto para Siguiente Documento de Trabajo

### Fuentes que Falzan Asimilar (para completar ALRAC)
| Fuente | Estado | Qué Aporta a ALRAC |
|---|---|---|
| **Sistema Alráico (Amid)** | Parcial (kernelProtocol, vitalTimeInvariants) | PI, 𝕮, γ-CARMIS, Triaxial, AEI, 20 Límites — **faltar: credoSet completo, AEI operable** |
| **Libro Ecoaldeas Federadas (Cergio)** | Parcial (energyCatalog, symmetricLimits, etc.) | TQ ledger, ±500, catálogo ICE/Ecoinvent, NFC offline — **faltar: exchangeGuard, conversionFactor, productFederation, crossNodePools, governance, land, taxEngine, nodeArchitecture, digitalSovereignty, autonomy** |
| **Investigación Javier** | Solo principios en ALRAC | 7 principios, 5 anti-reglas, 𝕮-Atlas — **faltar: comparación 7 modelos, 5 soluciones parciales que no funcionan** |
| **E→V / NEXO (Yoka)** | Asimilado como EV_CORE | Fricción, presencia, 6 campos, convergencia, consentimiento total — **faltar: NEXO P2P specs (identidad soberana, destilación conocimiento, consentimiento total)** |
| **Gran Alianza por la Vida** | Referenciada | Marco conceptual E→V/NEXO arriba, Experimento 2 Trusted Credential — **faltar: specs otros 4 experimentos (Passport, AI Matching, Educación, Territorio)** |

---

## 🔧 Trabajo Técnico Pendiente (Para Próxima Iteración)

### 1. Completar Capa 1 (TQ) — Faltan 8 specs de Cergio
```typescript
// En src/core/lib/alrac.ts o nuevo src/core/lib/tq.ts
- exchangeGuard.ts          // Prohibición TQ≠Fiat/Cripto + auditoría expulsión
- conversionFactor.ts       // FC = canasta_TQ(500)/canasta_Fiat + DEX import/export
- productFederation.ts      // Federación Productos + Filtro Soberano
- crossNodePools.ts         // Piscinas Global/Bilaterales + aislamiento riesgo
- governance.ts             // 3 niveles + voto Ed25519 + umbrales
- land.ts                   // CLT / Usufructo / Coop + propiedad frutos trabajo
- taxEngine.ts              // Impuestos progresivos + Fondo Comunitario
- nodeArchitecture.ts       // mTLS + Gossip + YugabyteDB + 3 modos
- digitalSovereignty.ts     // Mesh/VoIP/Self-hosted + Forward Secrecy
- autonomy.ts               // Cerrar escotilla DEX al internalizar
```

### 2. Completar Capa 0 (Amid) — Sistema Alráico operable
```typescript
// En src/core/lib/alrac.ts
- credoSet operations        // Crear, fusionar, medir armonía αʰ = Ω·s
- gammaCARMIS protocol       // Detectar sobrecarga → reconfigurar obligatorio
- triaxialVerification       // Mental + Simulación + Lab → score ≥0.7
- integratedEcroticAnalyzer  // Diagnóstico ideas (AEI)
- cognitiveLimits map        // 20 límites con severidad
```

### 3. Especificar en OpenSpec SDD
```bash
# Crear specs en openspec/specs/
openspec/specs/alrac-architecture.md      # 4 capas + 0 + 0.5
openspec/specs/alrac-governance.md        # No absorción, Triaxial, γ-CARMIS, consentimiento total
openspec/specs/alrac-revenue.md           # Ecuación Amid, PPE, β_crit, capas
openspec/specs/alrac-convergence-nexo.md  # Mapeo ALRAC↔NEXO, Paso 0, coordinación
```

### 4. Agente GNAP `alrac-coordinator`
```json
// En .gnap/agents.json (AMBOS repos)
{
  "id": "alrac-coordinator",
  "name": "ALRAC Coordinator",
  "role": "ALRAC-NEXO Coordination",
  "type": "ai",
  "runtime": "hermes",
  "capabilities": ["alrac-nexo-sync", "license-audit", "pilot-tracking", "yoka-liaison"],
  "heartbeat_sec": 300,
  "status": "active",
  "reports_to": "isaac"
}
```

### 5. Piloto Experimento 2 — Trusted Credential (Semanas 4-8)
```typescript
// En src/core/lib/alrac.ts → ya existe createTrustedCredentialPilot()
// Siguiente: Implementar RAO verification flow
// - Verificar certificación real: quién emitió, cómo valida, si vigente, quién puede leerla
// - Cliente: Gran Alianza por la Vida (ya definido, terceros independientes)
// - Entregable: Demo funcional RAO + ledger TQ + catálogo energético
```

---

## 📁 Archivos Clave para Leer (Contexto Completo)

| Archivo | Qué Contiene | Por Qué Leerlo |
|---|---|---|
| `docs/alrac_integration.md` | **Triple perspectiva completa** + isomorfismo 30 filas + GNAP + próximos pasos | **Documento maestro** para entender todo |
| `docs/alrac_backup.md` | Documento original resumido + hallazgo §3.5 + arquitectura + reparto + gobernanza | Referencia del fuente |
| `src/app/screens/ALRAC.tsx` | Pantalla 5 tabs implementada | Ver qué está en UI vs qué falta |
| `src/core/lib/alrac.ts` | 15+ funciones puras | Ver lógica disponible vs qué falta |
| `src/core/state/alrac.ts` | 25+ interfaces TypeScript | Ver tipos completos |
| `.gnap/agents.json` | Agentes cross-repo | Ver coordinación GNAP actual |

---

## 🎯 Criterios de Éxito para Próxima Iteración

### Técnicos
- [ ] `npx tsc --noEmit` → 0 errores en archivos ALRAC
- [ ] `npm run build` → OK
- [ ] `curl 200` en `/alrac` + todas las tabs cargan datos
- [ ] `pvl verify --suite=all` → compliant

### Documentales
- [ ] `LICENSE_AUDIT_ASIMILACIONES.md` creado y cerrado
- [ ] Conversación con Yoka documentada (decisión: fusión vs coordinación)
- [ ] 4 specs OpenSpec ALRAC creadas

### Operativos
- [ ] Agente `alrac-coordinator` en GNAP ambos repos
- [ ] Cartas individuales enviadas a Amid, Cergio, Javier, Pepe
- [ ] Piloto Experimento 2 arrancado (RAO verification demo)

### Estratégicos
- [ ] Decisión clara: ALRAC = vehículo comercial NEXO **O** capas coordinadas
- [ ] Si fusión: mergear docs ALRAC + NEXO en uno solo
- [ ] Si coordinación: definir protocolo coordinación explícito día 1

---

## 💡 Ideas para Iteración Productiva (Más Allá de lo Mínimo)

### A. Dashboard ALRAC-NEXO Convergencia
- Visualizar en tiempo real: ¿qué capas ya coordinadas? ¿qué conflictos de licencia?
- Métrica: "Grado de convergencia ALRAC-NEXO" (0-100%)

### B. Simulador Reparto Amid
- Input: θ_generado por capa, αʰ medido, k (iteración)
- Output: ω⁽ᵏ⁾ por capa, visualización PPE/β_crit

### C. Protocolo 6 Campos (Yoka) → Formulario UI
- En `/alrac` tab Products → Línea A: formulario 6 campos para diagnóstico real
- Guarda en `alrac.diagnoses[]` con huella/rastro

### D. Experimento 2 → Módulo RAO Completo
- `src/core/lib/rao.ts` ya existe — extender para Trusted Credential
- Verificar: identidad + emisor + procedencia + permisos + estado
- Demo: certificación real → verificación RAO → resultado auditable

### E. TQ Ledger Operativo (Capa 1)
- Implementar `createTQAccount`, `createTQTransaction`, `verifyTQProhibition`
- UI en `/alrac` tab Architecture → Capa 1: cuentas demo, transacciones demo

---

## 🔄 Cómo Usar Este Documento

1. **Lee `docs/alrac_integration.md` primero** — tiene todo el contexto triplicado
2. **Ejecuta verificación técnica** (Prioridad 1) — confirma baseline
3. **Agenda conversación con Yoka** (Prioridad 0) — desbloquea todo lo demás
4. **Elige una pista técnica** (Capa 1 TQ, Capa 0 Amid, OpenSpec, GNAP agent, Piloto)
5. **Crea siguiente documento de trabajo** con lo que elegiste + hallazgos

---

## 📝 Plantilla para Siguiente Documento de Trabajo

```markdown
# [TÍTULO: ej. "Capa 1 TQ - Implementación Ledger + NFC Offline"]

## Contexto (de este doc)
- Qué se hizo: ALRAC_CORE asimilado, Capa 1 definida en tipos pero solo 2/10 specs implementadas
- Qué falta: exchangeGuard, conversionFactor, productFederation, crossNodePools, governance, land, taxEngine, nodeArchitecture, digitalSovereignty, autonomy

## Objetivo de Esta Iteración
[Ej: Implementar exchangeGuard + conversionFactor + UI demo en /alrac]

## Archivos a Tocar
- src/core/lib/tq.ts (nuevo) o src/core/lib/alrac.ts
- src/app/screens/ALRAC.tsx (tab Architecture → Capa 1 expandible)
- docs/alrac_integration.md (actualizar sección Capa 1)

## Criterios de Éxito
- [ ] TQ ledger opera: crear cuentas ±500, transacciones reciprocidad/producción/regeneración
- [ ] verifyTQProhibition bloquea cualquier intento TQ→Fiat
- [ ] conversionFactor calcula FC = canasta_TQ(500)/canasta_Fiat
- [ ] UI muestra cuentas demo + transacciones demo
- [ ] tsc --noEmit limpio + build OK + curl 200

## Riesgos / Bloqueadores
- Catálogo energético (ICE/Ecoinvent) — datos reales necesarios
- NFC offline — requiere hardware ESP32 para test real
- Prohibición cambiaria — validar que arquitectura la enfoca (Capa 3 ZEITNUS)

## Próximo Paso Natural
[Ej: crossNodePools + governance para federación multilateral]
```

---

## 🔗 Enlaces Útiles
- **Repo Zeitnus**: https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica
- **Repo HSCSG**: https://github.com/Isaacko0/HSCSG_v15_OS
- **GNAP Spec**: https://github.com/farol-team/gnap
- **Commit ALRAC**: https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica/commit/54b0fb0
- **ALRAC en vivo**: http://localhost:4173/alrac (tras `npm run preview`)

---

*Este documento está diseñado para ser leído completo y usarse como base para el siguiente ciclo de trabajo. Cada sección accionable tiene criterios de éxito claros y enlaces a archivos reales.*