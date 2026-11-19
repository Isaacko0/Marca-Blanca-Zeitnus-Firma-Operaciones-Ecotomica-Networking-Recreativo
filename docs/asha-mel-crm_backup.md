# RESPALDO DE FUENTE — ASHA MEL CRM (sepu85/asha-mel-crm)

## Identificación de la fuente

- **Título:** ASHA MEL — Sacred Headwaters Alliance (Monitoring, Evaluation & Learning CRM)
- **Autor:** sepu85 (Gus)
- **Repo:** https://github.com/sepu85/asha-mel-crm
- **Rama:** main
- **Tipo:** Prototipo demo CRM y dashboard MEL (Next.js 16, TypeScript, SQLite, Leaflet)
- **Licencia:** MIT

## ⚖️ Aviso de derechos de autor

Este respaldo se conserva únicamente como material de referencia para análisis e integración arquitectónica. Todos los derechos de autor permanecen con sepu85. No se reclama autoría sobre la obra original. Software provisto libremente para organizaciones indígenas, ONG y socios en justicia ambiental y social.

## Qué es el repositorio

CRM ligero y dashboard de Monitoreo, Evaluación y Aprendizaje (MEL) para la Alianza de las Cabezas Sagradas del Amazonas (10 naciones indígenas entre Ecuador y Perú). Rastrea comunidades, programas, actividades, participantes e indicadores, con vista dual (comunidad vs financiador) y mapa interactivo.

## Stack

| Capa | Tecnología | Licencia |
|------|-----------|----------|
| Framework | Next.js 16 | MIT |
| UI | React 19 + Tailwind CSS 4 | MIT |
| Mapas | Leaflet 1.9 + react-leaflet 4 | BSD-2 |
| Gráficos | Recharts 3 | MIT |
| Base de datos | SQLite via better-sqlite3 (archivo local) | MIT |
| Lenguaje | TypeScript 5 | Apache-2.0 |

## Esquema de base de datos (`src/lib/db.ts`)

| Tabla | Propósito |
|-------|-----------|
| `nations` | Naciones indígenas (nombre, país, población, territorio ha) |
| `communities` | Comunidades (pertenecen a nación, coordenadas, población) |
| `organizations` | Organizaciones/ONG |
| `contacts` | Contactos (rol, email, teléfono, comunidad/nación/organización) |
| `funding_sources` | Fuentes de financiamiento (monto, moneda, fechas, estado) |
| `programs` | Programas (pilar del Plan Bioregional 2030, estado, fechas) |
| `activities` | Actividades (tipo, fecha, participantes, comunidad, programa) |
| `participations` | Participación de contactos en actividades |
| `indicators` | Indicadores MEL (tipo quant/qual, unidad, nivel ToC, definido por indígena) |
| `measurements` | Mediciones de indicadores (valor, fecha, fuente, comunidad, nación) |
| `narrative_reports` | Reportes narrativos (Most Significant Change, autor, idioma) |
| `data_access_permissions` | Permisos de acceso por nación (ver interno, compartir agregado, compartir detallado) |

## Pilares del Plan Bioregional 2030

1. Gobernanza territorial
2. Seguridad alimentaria
3. Sustentos y bioeconomía
4. Salud intercultural
5. Educación
6. Energía renovable

## Capas de datos de mapa (GeoJSON simulado, migrable a ArcGIS)

| Capa | Archivo | Descripción |
|------|---------|-------------|
| Territorios | `territories.json` | Polígonos de las 10 naciones |
| Comunidades | `communities.json` | Puntos con coordenadas reales |
| Actividades | `activities.json` | Puntos coloreados por pilar |
| Rutas de patrulla | `patrol_routes.json` | LíneaString de guardianes |

## API routes

| Ruta | Descripción |
|------|-------------|
| `src/app/api/geo/[layer]/route.ts` | GeoJSON por capa (territorios, comunidades, actividades, patrullas) |
| Otras rutas REST | naciones, programas, actividades, contactos, etc. |

## Patrones reutilizables (para Zeitnus/ALRAC)

- Base de datos local SQLite (offline-first, sin servidor externo)
- Modelo de soberanía de datos por nación (data sovereignty flags)
- Vista dual MEL (comunidad: indicadores definidos por indígena; financiador: marco cuantitativo)
- Mapa interactivo con capas togglables
- Migración a ArcGIS vía un cambio de endpoint (fetch en lugar de readFileSync)
