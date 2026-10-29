# Spec OpenSpec: Agencia de IA Productizada ↔ ALRAC/HSCSG

**Estado:** especificación de asimilación  
**Licencia:** MIT (Zeitnus/HSCSG core)  
**Fuente:** Video de Agustín Casorzo (@AguCasorzo), "Como Escalar tu Agencia de Marketing con Servicios Productizados Basados en IA y Automatizaciones" — https://www.youtube.com/watch?v=NMI7rj6zDYc  
**Asimilado por:** Hermes Agent, marco HSCSG v15 OS  
**Fecha:** 2026-10-25

---

## 1. Resumen ejecutivo del contenido

Agustín Casorzo (CEO de NinjaPerformance, ex-Google Premier Partner, +10M USD vendidos, 2.600+ agencias formadas en LatAm) presenta un modelo de agencia de marketing basado en **4 servicios productizados** escalables con IA:

| # | Servicio | Modelo de cobro | Entrega |
|---|----------|-----------------|---------|
| 1 | Sitios IA (webs con IA) | Setup + mensualidad | ~5 minutos con IA |
| 2 | Automatización de reseñas Google | Setup + mensualidad | Playbook estandarizado |
| 3 | Reactivación de base de datos | Setup + mensualidad (sin riesgo cliente) | Estrategia del semáforo |
| 4 | Funnels (compra de medios Meta/Google) | Setup + mensualidad | Playbook A-Z |

**Principio central:** Los servicios creativos tradicionales (logos, diseño web a medida, community manager) han sido desvalorizados por la IA. El valor ya no está en "hacer cosas bonitas" sino en **implementar IA en negocios** — cerrar la brecha entre lo que las empresas quieren y lo que saben hacer.

**Modelo operativo:** Tú vendes, asistentes virtuales (VA) implementan. Agencia = 1 persona + VA. Playbooks completos, diagramas, arquitectura técnica, plantillas, procesos estandarizados, landing de venta, guion de ventas, modelo de oferta.

**Fases del modelo:**
1. **Sistema comercial:** tráfico pago + orgánico, funnel de agencia, estrategia de contenido (IG/TikTok/YouTube)
2. **Implementación:** playbooks A-Z de cada servicio
3. **Escalamiento:** procesos estandarizados, contratación, delegación a VA

---

## 2. Isomorfismo Agencia Productizada ↔ ALRAC/HSCSG

| Concepto Agencia IA | Contraparte ALRAC/HSCSG | Capa ALRAC | Fundamento |
|---|---|---|---|
| Servicio productizado (estándar, repetible) | CaaS Revenue Stream | Capa 2 (Interoperabilidad) | Streams estándar, revenue split verificable |
| Setup + mensualidad (ingresos recurrentes) | TQ accounting + ZNU vesting | Capa 1 (TQ) + Capa 3 (Membrana) | Contabilidad física + crédito mutuo 2-3% |
| Playbook estandarizado | OpenSpec spec | Capa 0 (AMID) | Especificación viva, reproducible |
| Tú vendes + VA implementa | Automaton SOUL + Delegación líquida | Capa 0 | Stake ZNU por creencia, delegación de poder |
| Brecha implementación IA (Mark Cuban) | Boundaries.failClosed() + Triaxial | Capa 0 | Verificación mental/sim/lab, límites fail-closed |
| 4 servicios productizados | 4 Líneas de Negocio (A-E) o 6 streams CaaS | Capa 4 (Aplicación) | Líneas A: Diagnóstico, B: Kit Simulación, etc. |
| Funnel de agencia | Symbiosky (commit-reveal) + CaaS | Capa 2 | Convicción verificada, revenue share |
| Evento live (26-28 oct 2026) | Piloto holónico / Asamblea | Capa 5 (Gobernanza) | 1a1v, CDS-weighted, comités rotativos |
| Agencia = 1 persona + VA | Nodo autónomo (AUT) + Coeficiente de Autonomía | Capa 5 | Nodo soberano, mínimo coordinación central |

### 2.1 El "empleado puertas afuera" ↔ Automaton SOUL

Casorzo critica a las agencias que actúan como "empleado puertas afuera" del cliente (hacen lo que el cliente pide sin criterio). En ALRAC/HSCSG, el **Automaton SOUL** es la contraparte: el agente tiene su propio stake ZNU, sus creencias programables (corteza prefrontal ~25 años), y delega poder líquido. No es un empleado sumiso; es un nodo soberano con piel en el juego.

### 2.2 Servicios a la medida ↔ Servicios productizados

| Servicios a la medida (no escalan) | Servicios productizados (escalan) | Mapeo ALRAC |
|---|---|---|
| Logo, branding, diseño gráfico | Sitio IA (5 min) | Custom ↔ Spec OpenSpec estandarizado |
| Community manager (carruseles) | Automatización reseñas Google | Bespoke ↔ Stream CaaS verificable |
| Sitio web tradicional (3 meses, parto) | Reactivación BD (semáforo) | Proyecto único ↔ Producto repetible |
| Videos corporativos | Funnels (compra de medios) | Artefacto ↔ Sistema con métrica |

La IA dejó sin valor los servicios creativos tradicionales. Lo que queda con valor es la **implementación** — cerrar la brecha entre IA y negocio. Esto es exactamente lo que `verifyTQProhibition` y `Boundaries.failClosed()` hacen en el código Zeitnus: límites técnicos que impiden el abuso y aseguran que el valor sea real, no especulativo.

---

## 3. Especificación técnica: Servicio Productizado como CaaS Stream

Cada uno de los 4 servicios se mapea a un **CaaS Revenue Stream** con las siguientes propiedades:

```
interface ProductizedService {
  id: string;                    // ej: 'sitios-ia', 'reseñas-google', 'reactivacion-bd', 'funnels'
  name: string;
  setupFee: number;              // TQ, cobro único por implementación
  monthlyFee: number;            // TQ/mes, ingreso recurrente
  deliveryTime: string;          // ej: '5 min' (sitios IA), 'playbook A-Z'
  vaDelegatable: boolean;        // true = VA puede implementar
  playbookUrl: string;           // OpenSpec spec del servicio
  caasStream: 'recurring' | 'transactional';
  znuStake: bigint;              // Stake ZNU del operador del nodo
  verificationStatus: 'verified' | 'pending';
}
```

### 3.1 Ingreso recurrente como TQ

El modelo "setup + mensualidad" se implementa en TQ:
- **Setup:** pago único en TQ por la implementación inicial (anclado a energía incorporada: horas de VA, uso de IA, etc.)
- **Mensualidad:** TQ recurrente por mantenimiento, monitoreo, optimización continua
- **Prohibición cambiaria:** todo en TQ, sin tipo de cambio fiat/cripto (`verifyTQProhibition`)
- **Factor de conversión:** solo vía canasta 500 TQ para salida a fiat si es necesario

### 3.2 Delegación a VA como Automaton SOUL

El modelo "tú vendes, VA implementa" es una implementación práctica de **delegación líquida**:
- El dueño de la agencia tiene stake ZNU en cada cliente (creencia de que el servicio genera valor)
- El VA ejecuta el playbook estandarizado (Automaton tick central)
- Cualquier disputa se resuelve mediante verificación triaxial (mental/sim/lab)

---

## 4. Especificación OpenSpec sugerida para el repo Zeitnus

Se recomienda crear en `openspec/specs/`:
- `alrac-agencia-productizada.md` — este documento
- `alrac-caas-stream-productizado.md` — espec de CaaS stream para servicios productizados IA
- `alrac-playbook-estandarizado.md` — formato de playbook reproducible (sitios IA, reseñas, reactivación, funnels)

## 5. Referencias

- Video: https://www.youtube.com/watch?v=NMI7rj6zDYc (Agustín Casorzo / Agencias IA, 2026-05-26, 1:10:15)
- Evento: https://www.EventoAgencias.com (26-28 oct 2026)
- Registro: https://link.agenciaprocedida.com/r?utm_source=youtube&utm_medium=descripcion&utm_campaign=dojo&utm_content=NMI7rj6zDYc
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)

---

**Principio rector:** El valor no está en hacer cosas bonitas, está en implementar IA en negocios que la necesitan. El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
