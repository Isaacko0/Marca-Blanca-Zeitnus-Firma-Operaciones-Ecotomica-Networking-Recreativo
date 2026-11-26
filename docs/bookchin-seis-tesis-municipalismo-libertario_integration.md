# Integración Bookchin — Seis tesis sobre municipalismo libertario — ALRAC/Zeitnus

**Fuente asimilada:** `docs/bookchin-seis-tesis-municipalismo-libertario_backup.md` — Documento teórico/político de Murray Bookchin sobre municipalismo libertario.

**Repositorio destino:** `Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo`

**Estado:** Propuesta de arquitectura. Documento teórico, no código fuente.

**Mapeo isomórfico (6 tesis):**
1. Municipalismo libertario → Gobernanza local holónica, asambleas del nodo
2. Confederalismo municipal → Red de Intercambio Federada (nodos confederados)
3. Ecología social → Ley I: no degradar base material, límites duros
4. Asamblea popular → Asamblea del nodo (Capa 5 gobernanza)
5. Ética complementaria → CaaS: acceso por contribución, membresía por nivel
6. Dual poder → CaaS como estructura paralela al estado-nación

**Límites duros (boundaries.ts):**
- DENY: centralismo estatal como única forma de organización
- DENY: dominación de la naturaleza como modelo económico

**Vasos comunicantes:** `bookchin-seis-tesis-municipalismo-libertario.ts` ↔ `registrySystem.ts` (registro de municipios/nodos), `caas.ts` (acceso por contribución), `boundaries.ts` (límites ecológicos)

**KPIs:** `listarTesisBookchin()` retorna 6 tesis; `obtenerTesisPorNumero()` funciona para 1-6; `tesisCentralBookchin()` retorna síntesis; 0 errores TypeScript.
