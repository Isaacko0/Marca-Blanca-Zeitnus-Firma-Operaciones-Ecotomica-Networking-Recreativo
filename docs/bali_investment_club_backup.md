# Backup: Bali Investment Club Investor Portal (Zenodo 19343408)

## Información General

- **Registro Zenodo**: https://zenodo.org/records/19343408 (DOI: 10.5281/zenodo.19343408)
- **Versión**: v2 (Publicado 2026-03-29)
- **Autor**: Michael W.P. Wenas (ORCID: 0009-0005-8101-925X)
- **Tipo**: Journal article
- **Repositorio original**: https://github.com/michaelwpwenas/novokult (inactivo, suspendido)
- **Licencia**: No especificada en metadata (paper académico)
- **Estado**: Inactive development status en Zenodo

## Qué es el Paper

"Bali Investment Club Investor Portal Information System Utilizing OpenAI Artificial Intelligence (Web-Based)" — Sistema de información de portal de inversores para Bali Investment Club, utilizando IA de OpenAI (Codex y GPT-3 smart agents).

### Stack Tecnológico (del paper)

- **Frontend**: ReactJS (responsive, interactive UI)
- **Backend**: NodeJS + Express framework (web server, API requests)
- **Database**: MongoDB
- **AI**: OpenAI Codex + GPT-3 smart agents
- **Metodología**: Waterfall
- **Testing**: Usability testing (interface/UX), gray-box testing, user acceptance testing

### Arquitectura Descrita

```
Sistema:
├── Client Side: ReactJS framework
├── Server Side: NodeJS + Express
├── Database: MongoDB
├── AI Layer: OpenAI Codex + GPT-3 agents
└── Connection: Express manages NodeJS-MongoDB connection
```

### Flujo de Desarrollo (Waterfall)

1. **Planning & Design**: Data collection (interviews), DFD, ERD, implementation planning
2. **Implementation**: ReactJS frontend, NodeJS/Express backend, MongoDB, OpenAI integration
3. **Testing**: Usability (UI/UX), gray-box (system), user acceptance testing (company)

### Resultados Reportados

- Sistema desarrollado y probado que funciona "optimally"
- IA integrada con framework que refleja Bali Investment Club
- Portal de inversores operativo

### Referencias Citadas (Paper)

- Horner (2020) - New paradigm of global development
- Hong (2020) - Intelligent financial development based on AI
- Handayani (2020) - Indonesia kekurangan tenaga ahli AI
- Norhikmah (2016) - Monitoring dosen wali usando ASP.NET SignalR
- Piccoli & Pigni (2019) - Information systems for managers
- Rochaety (2017) - Sistem informasi manajemen
- Adh (2016) - Sistem pengolahan kuesioner laboratorium
- Pasek (2017) - Aplikasi manajemen UKM berbasis CodeIgniter + React JS
- Huang (2020) - Node.js core technology
- Chauhan (2019) - Review on MongoDB databases
- Sapnarianthi (2022) - Sistem informasi company profile Express framework

### Notas de Asimilación

- **Proyecto distinto de Novokult**: Este es un paper académico sobre un sistema comercial para Bali Investment Club, usando OpenAI API (cloud), no local LLM
- **Licencia incierta**: Paper académico, no código open-source; no hay repo activo accesible (GitHub suspendido)
- **Dependencia OpenAI**: Usa Codex/GPT-3 via API → contrario a principio local-first de Novokult/HSCSG
- **Valor para HSCSG**: Patrones de arquitectura React/Node/Express/MongoDB; metodología waterfall documentada; testing approach
- **Autor RAO**: Mismo autor que Novokult → vincular via `author RAO` en integration.md cross-repo

### Archivos Asociados

- PDF: `bali-investment-club-investor-portal-information-system-utilizing-openai-artificial-intelligence-web-based.pdf` (298.2 kB) en Zenodo
- DOI adicional: 10.7910/DVN/HTMXTV (dataset)
- DOI journal: 10.5281/zenodo.15796411