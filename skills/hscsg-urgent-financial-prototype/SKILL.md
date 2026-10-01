---
name: hscsg-urgent-financial-prototype
description: Deploy HSCSG Tool Forge CaaS Micro-SaaS to Vercel.
---

# HSCSG Urgent Financial Prototype — Deployment Skill

## Contexto
- **Origen**: Skilio "5 skills para ganar dinero" + HSCSG v15 OS
- **Modelo**: CaaS con 3 tiers: FREE (ads), PRO (ZNU burn), ENTERPRISE (Trustlines B2B)
- **MVP Tool #1**: QR 3D Generator (PNG/SVG/3MF/STL + Three.js preview)
- **Deploy**: GitHub + Vercel (sin Hostinger, solo free tiers)

## Acciones Completadas ✅

### 1. Auditoría Legal Completa
- `docs/LICENSE_AUDIT_ASIMILACIONES.md` — 133 fuentes auditadas
- `fuentes_indice.json` actualizado con campos `licencia`, `riesgo_legal`, `tipo_contenido`, `auditada`
- NC-ND movidos a `docs/_licencia_incompatible/`
- GPL/AGPL aislados para microservicios

### 2. Skill "Botón Rojo Monumental"
- Ubicación: `~/.hermes/skills/boton-rojo-monumental-auditoria-licencias/`
- 6 fases automatizadas

### 3. Asimilación Nieves (8 PDFs → 6 docs + 6 módulos TS)
- Polignac, Beal, Subset Sum, Ecuación Funcional, Turing-Scriven/Blindcoin

### 4. HSCSG Tool Forge — Prototipo Completo
```
tool-forge/
├── frontend/          # Next.js 14 - DEPLOYADO EN VERCEL
│   ├── src/app/page.tsx              # Landing SEO + CaaS Economy + AdSense
│   ├── src/app/tools/[slug]/page.tsx # Runner universal + 3D preview
│   ├── src/components/CaaSWallet.tsx # Wallet DID, ZNU/FRNE, Tier upgrade
│   ├── src/lib/caas-engine.ts        # Cliente CaaS (SSR-safe)
│   └── src/tools/qr-3d-generator.ts  # QR 3D logic
├── tool-forge-backend/  # Backend Edge Functions - PENDIENTE
└── .github/workflows/tool-forge.yml  # CI/CD completo
```

### 5. Deploy Frontend Exitoso
- **Production**: `https://frontend-junyryr7p-holosociocibersimbiogenesis.vercel.app`
- **Alias**: `https://frontend-rouge-eta-35.vercel.app`
- Build: ✅ PASS

## Pendientes ⚠️

### 1. Deploy Backend (Edge Functions)
```bash
cd /c/Users/Isaacko0/HSCSG_v15_OS/tool-forge-backend
vercel --prod
```
- Configurar `NEXT_PUBLIC_CAAS_API_URL=https://<backend>.vercel.app`

### 2. AdSense Submit (empezar YA, tarda 1-2 semanas)
```
URL: https://frontend-rouge-eta-35.vercel.app
```

### 3. Daily CaaS Tick Automation
- GitHub Action configurado (2AM UTC)
- Requiere `GITHUB_TOKEN` con repo scope

## Rollback HSCSG v15
Commit objective: `b9ea2eda (previo a `7c2ff34` - Skill work)
```bash
git reset --hard b9ea2ed
git push --force-with-lease origin main
```

## Nuevo Repo: "Zeitnus Firma Operaciones Ecotomica"
- Fork/clone de HSCSG v15 en nuevo repo GitHub
- Conectar a Vercel deploy existente
- Mantener solo código Tool Forge + economics

## Recomendaciones para Comunidad Happpy (Isaac Flores + Pepe Sevilla)

### 1. Integración Inmediata Happpy → Zeitnus
- **Happpy.mba** (4 niveles O/S/E/P) → Mapear a **ALRAC 4 Capas** (Diagnóstico/Nodo Llave/Medicinas/Estudio)
- **Regla 100** → **GNAP Task Chains** (100 días = 100 chains auto-ejecutables)
- **Imán de clientes** → **γ-CARMIS Preview** (detección fricción antes de ruptura)
- **Referidos** → **TQ Ledger reciprocidad** (35/35/30 split Amid/Yoka/Nodos)
- **Masterclass StorySelling + AI** → **CaaS Education Stream** (stream `education` en alrac-caas-revenue-streams)

### 2. Fernando Palacios / 72gross → Nodo Zeitnus
- **SofIA Asistente Cátedra** → **Motor Mental Zeitnus** (rol Asistente/Examinador = mentalAssistant/gammaCARMIS)
- **12 Áreas Golf** → **Template 12 Capas MJ Universal** (aplicable a cualquier org)
- **Diagnóstico 1a1 20min** → **γ-CARMIS Scanner** (herramienta operativa detección fricción)
- **NSL (Never Stop Learning)** → **GNAP Task Chains auto-mejora** (Capa 8 Sistémica)
- **Fricción invisible** → **Métrica EV_CORE** (entropía sistémica no contabilizada)

### 3. Prototipo 90 Días (Hit Rate 90%)
- **Semana 1-2**: Deploy QR 3D Generator (Vercel) + CaaS Wallet (ZNU)
- **Semana 3-4**: Integrar Pepe/Contento (BrandDNA + Soulmate) como canal distribución
- **Mes 2**: Activar Felipe Guarin (Feloguarin) → AI Agents + Zeitnus
- **Mes 3**: Monetary Integration (G1/Túmin/PAR + priceParity + ZNU canasta 2-3%)
- **KPIs**: Hit Rate 90% (primer cliente pagando día 90), AUT > 0.7, CDS > 0.8

### 4. Pleonasmo Resuelto para Happpy
> **"Happpy no inventa tu cliente. Lo revela en 4 niveles. Y te dice qué nivel habitas."**

≡ **"Contenido / Estar contenido"**
- **Contenido** = 4 niveles (O/S/E/P) fluyendo (scores, TQ ledger, γ-CARMIS)
- **Estar contenido** = Arquitectura (Regla 100 + Imán + Referidos) contiene sin traicionar

> Si cambias el nivel y el cliente sigue siendo el mismo → **no era tu cliente** = γ-CARMIS detectado: reconfiguración obligatoria antes de rupture.