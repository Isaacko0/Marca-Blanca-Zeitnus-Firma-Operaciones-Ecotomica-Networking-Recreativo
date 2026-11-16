# WhatMatters — Backup de Fuente

## Qué es WhatMatters
WhatMatters es una **infraestructura algorítmica de compensación multilateral de liquidez comercial** (Trade Credit Netting) diseñada para resolver la parálisis de liquidez en cadenas de valor (pymes, autónomos, profesionales y familias) mediante teoría de grafos y compensación atómica de ciclos cerrados de deudas cruzadas.

## Stack Tecnológico (Conceptual)
- **Frontend:** Progressive Web App (PWA) React + TypeScript + Tailwind CSS
- **Backend/Engine:** Motor de grafos en memoria (NetworkX / Neo4j / Memgraph) + API Node.js (Fastify/Express) o Python (FastAPI)
- **Base de Datos:** PostgreSQL (transaccional) + Grafo en memoria para cómputo intensivo
- **Notificaciones:** Web Push Protocol + Twilio/SendGrid
- **Autenticación:** Simple (email/PIN/biométrica) sin OAuth complejo en fase inicial

## Estructura Conceptual del Proyecto
```
WhatMatters/
├── Core Algorithm          # Cycle Finding (Johnson/Tarjan) optimizado a ciclos 3-5 nodos
├── Data Model              # Users, Obligations (edges), ClearingCycles (propuestas atómicas)
├── Atomic Confirmation     # Estado machine: PROPOSED → CONFIRMED/EXPIRED → EXTINGUISHED
├── Privacy Layer           # Enmascaramiento identidades, validación simétrica bilateral
├── Legal/Compliance        # Compensación civil Art. 1195 CC, no intermediación financiera
├── Governance Layer        # Árbol fractal base-3 (triadas de verificación humana)
└── Growth Mechanics        # Viral K>1 por incentivo de cobro real + percolación hiperbólica
```

## Licencia
Proyecto propietario WhatMatters / HSCSG. Código cerrado en fase de validación; documentación y specs abiertas bajo CC-BY-SA 4.0 para investigación.

## Origen de la Conversación Asimilada
Diálogo exhaustivo entre Isaac Ko (Isaacko0) y agente Hermes (2026-11-03) cubriendo:
1. Fundamento: Parábola del billete de 100 dólares → compensación multilateral
2. Propuesta bancaria: Sandbox regulatorio, banco como custodio + pasarela fiat
3. Validación micro: PWA + QR + acuerdos voluntarios, blindaje legal compensación civil
4. Pre-compensación algorítmica (ex "shadow clearing"): Mapeo en sombra + activación condicionada
5. Crecimiento hiperbólico: Combinatoria (N choose 3) + percolación + K>1 intrínseco
6. Arquitectura bicapa: Gobernanza base-3 + Malla transaccional hiperbólica
7. Inclusión personas físicas: Pasivos familiares, desahogo indirecto tesorería, convenios bienestar
8. Esquema 5 nodos: Empleado → Odontólogo → Taller → Imprenta → Empresa → Empleado
9. Análisis crítico: Riesgos bancarios, tributarios, fraude, disputas, asimetría flujos
10. Guión 3 min: Video continuidad WhatMatters, cierre emocional sin confrontar bancos
11. Brief + Spec técnico completo: Modelo datos, algoritmo, DB schema, pseudocódigo, QA

## Archivos Clave Generados en la Conversación
- `whatmatters_spec_tecnica.md` — Spec completa (modelo datos, algoritmo, DB, pseudocódigo, tests)
- `whatmatters_brief.md` — Brief ejecutivo reordenado (Parte I: Liquidez, Parte II: Gobernanza)
- Guión video 3 min (bloques 1-4 con cierre emocional)
- Análisis crítico exhaustivo