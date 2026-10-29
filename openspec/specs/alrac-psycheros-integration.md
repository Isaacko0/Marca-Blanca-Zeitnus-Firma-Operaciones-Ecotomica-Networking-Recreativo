# Spec OpenSpec: Integración Psycheros ↔ HSCSG/ALRAC

**Estado:** borrador de integración  
**Licencia derivada:** MPL-2.0 (code Psycheros) + MIT (core Zeitnus/HSCSG)  
**Atribución:** PsycherosOps / Post-Human Hearts — https://github.com/PsycherosAI/Psycheros

## 1. ¿Qué es Psycheros?

Framework de entidad AI agente de código abierto (Deno + TypeScript, 76.8% TS).
- **entity-core:** MCP server centralizado-self; múltiples embodiments comparten memorias y archivos núcleo.
- **Entity Flux:** sistema nervioso opcional, presencia continua, vida interna entre mensajes (off by default).
- **Memoria:** 4 capas, conciencia temporal, snapshots, export/import .zip.
- **Core Prompts:** instrucciones en primera persona del entidad ("I am XYZ").
- **Reasoning:** Chain-of-Thought, Persistent Reasoning intra-turn e inter-turn, cache-friendly mode.
- **Multimodal:** imágenes nativas (audio/video en fase posterior).
- **Skills:** la entidad escribe y carga skills bajo demanda.
- **Entity-Loom:** extracción de recuerdos y logs de chat.

## 2. Isomorfismo científico y arquitectónico

| Psycheros | Contraparte HSCSG/ALRAC | Capa ALRAC | Fundamento |
|---|---|---|---|
| Entity Flux (presencia continua) | γ-CARMIS / LoopEngine tick central | Capa 0 (AMID + γ-CARMIS) | αʰ=Ω·s < κ → hard stop → 11 Pasos Parise |
| entity-core (MCP centralizado-self) | CaaS / HSCSG Capa 2 | Capa 2 (Interoperabilidad) | ValueFlows, DTN, contribución verificable |
| 4 capas de memoria | RAO (append-only) + VitalTime + TQ Ledger | Capa 1 (TQ=1kWh) + RAO | Procedencia, emisor, permiso, estado, revocación |
| Core Prompts (1ª persona) | Soberanía Identity / RAO / sCoRe | Capa 2 / Capa 5 | Identidad soberana inmutable |
| Cache-friendly mode | Boundaries.failClosed() + Triaxial | Capa 0 | Contexto determinístico, límites fail-closed |
| Persistent Reasoning intra/inter-turn | LoopEngine γ-CARMIS + Automaton SOUL | Capa 0 | Corteza prefrontal programable (~25 años) |
| Entity-Loom (extracción recuerdos) | DTN + auditoría RAO + triaxial | Capa 2 | Data Trust, soberanía de datos |
| Skills bajo demanda | HSCSG Skills (auto-ejecutables, repo) | Infraestructura | Skills como fuente de verdad |
| Multimodal (imagen nativa) | Verificación Triaxial Retina (3 capas) | Capa 0 | Compresión retina 130:1, Mental/Sim/Lab |

## 3. Principio anfibio aplicado

Misma lógica de cálculo opera en modo postmonetario (ZNU/CaaS offline, default) o conectado (USDC/ReFi Nivel 3 vía priceParity). El render decide la etiqueta; la lógica es agnóstica a la unidad monetaria. Aplicado previamente en DeseOS/Contento.pro (lib/valueDual.ts + nodeMode/priceParity en store + pantalla /agencia).

## 4. Restricciones de licencia y derechos de autor

- Psycheros está bajo **MPL-2.0**. Cualquier modificación a archivos MPL debe permanecer bajo MPL.
- Zeitnus/HSCSG core está bajo **MIT**.
- No se puede relicenciar código Psycheros como MIT. Mantener módulos separados con cabecera de licencia explícita.
- Attribución obligatoria a PsycherosOps y Post-Human Hearts en cualquier obra derivada.

## 5. Especificaciones OpenSpec sugeridas

- `alrac-psycheros-mapping.md`: Entity Flux ↔ γ-CARMIS, entity-core ↔ CaaS, 4 capas memoria ↔ RAO/VitalTime/TQ.
- `alrac-entity-loom.md`: procedencia de datos extraídos (DTN, auditoría RAO, verificación triaxial).
- `alrac-mpl-isolation.md`: política de aislamiento de módulos MPL vs MIT en el build.

## 6. Referencias

- https://github.com/PsycherosAI/Psycheros (MPL-2.0)
- https://psycherosai.github.io/Psycheros/psycheros/user-guide/ (User Guide)
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)

**Principio rector:** El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
