# CertPath

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-e0234e?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

**Plataforma full-stack para descubrir certificaciones tecnológicas, seguir roadmaps de carrera y gestionar tu propia formación.**
Cloud · Ciberseguridad · Redes · Linux · DevOps · IA · Desarrollo — España, Europa y mundial.

🔗 **Demo en vivo:** _pendiente de desplegar — la URL irá aquí_ · 💻 **Stack:** Next.js · NestJS · Prisma · PostgreSQL

> Proyecto personal full-stack (monorepo): herramienta real para planificar mi carrera en infraestructuras y ciberseguridad, y pieza central de mi portfolio.

## 📸 Pantallas

- **Inicio** — catálogo por categorías, estadísticas y roadmaps/certis destacadas.
- **Roadmap (vista Mapa)** — grafo 2D por secciones con nodos, conectores y estado por paso.
- **Ficha de certificación** — descripción, roles a los que prepara, salidas profesionales, competencias y logo.
- **Mi progreso** — seguimiento de certificaciones, roadmaps, lecturas y objetivos.

<!-- Capturas: sube docs/home.png, docs/roadmap.png y docs/cert.png y descomenta:
| Inicio | Roadmap | Ficha |
|:---:|:---:|:---:|
| ![Inicio](docs/home.png) | ![Roadmap](docs/roadmap.png) | ![Ficha](docs/cert.png) |
-->

---

## ✨ Qué hace

- **Catálogo de ~390 certificaciones y programas** con filtros (categoría, coste, nivel), buscador y fichas con descripción, roles a los que prepara, salidas profesionales y logo del fabricante.
- **27 roadmaps profesionales** agrupados por carrera y ordenados por dificultad, con **dos vistas**:
  - *Lista*: diagrama ramificado con espina central (estilo roadmap.sh).
  - *Mapa*: grafo 2D por secciones con nodos, conectores y estado por paso.
- **Seguimiento de progreso**: marca cada cert/paso (pendiente → en curso → hecho), con dashboard "Mi progreso".
- **Libros**: catálogo con **autocompletado por ISBN** (Google Books / Open Library), portada, lector **PDF/EPUB integrado**, progreso de lectura (estado + página) y enlace de compra (afiliado Amazon).
- **Recursos**: enlaces curados (normativa ENS/CCN-STIC, Microsoft Learn…).
- **Buscador global** (certis + roadmaps + libros).
- **Panel de administración** unificado: alta manual, importación masiva por JSON y gestión (buscar/borrar) de certis, libros y recursos.
- **Login** (panel privado) + **diseño responsive** con color semántico por dominio/nivel.

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | **Next.js 15** (App Router, React 19), **TypeScript**, **Tailwind CSS** |
| Backend | **NestJS 10**, **Prisma 6** |
| BD | **SQLite** (dev) · **PostgreSQL**-ready (prod) |
| Auth | JWT en cookie httpOnly + bcrypt |
| Infra | **Docker** + docker-compose, **GitHub Actions** (CI), Helmet, rate-limiting, validación (class-validator) |
| Tests | Jest (unitarios) + scaffold Playwright (E2E) |

## 🧱 Arquitectura (monorepo)

```
CertPath/
├─ apps/
│  ├─ web/      # Next.js (UI)
│  └─ api/      # NestJS + Prisma (REST API)
├─ infra/
│  └─ docker-compose.yml
├─ .github/workflows/ci.yml
├─ DEPLOY.md    # guía de despliegue
└─ ARCHITECTURE.md
```

El frontend consume una API REST desacoplada. Prisma abstrae la base de datos (cambiar de SQLite a Postgres es una línea). La importación de contenido va por endpoints protegidos con token, lo que permite crecer el catálogo **sin tocar código**.

## 🚀 Arrancar en local

Requisitos: Node 20+.

```bash
# API
cd apps/api
npm install
cp .env.example .env        # rellena IMPORT_TOKEN, ADMIN_*, AUTH_SECRET
npx prisma db push          # crea la BD SQLite
npm run start:prod          # http://localhost:4000/api

# Web (otra terminal)
cd apps/web
npm install
cp .env.example .env.local
npm run build && npm start   # http://localhost:3001
```

- **App:** http://localhost:3001
- **API health:** http://localhost:4000/api/health
- **Login:** `/login` (credenciales del `.env` del API)

## 🐳 Docker

```bash
docker compose -f infra/docker-compose.yml up --build
```

## ☁️ Despliegue

Guía paso a paso (Vercel + Railway + Neon) en **[DEPLOY.md](DEPLOY.md)**.

## 🧠 Decisiones de diseño destacadas

- **Datos como fuente, UI dirigida por datos**: roadmaps y diagramas se renderizan desde JSON; nada hardcodeado en la vista.
- **Fichas auto-enriquecidas**: si una cert no trae descripción/roles, se generan por dominio+nivel, garantizando que ninguna ficha quede vacía.
- **Resiliencia**: `safe()` en las llamadas del servidor + error boundaries → la UI no “revienta” si la API falla.
- **Seguridad**: Helmet, rate-limiting, validación de entrada, CORS configurable por entorno, secretos fuera del repo.

## 📋 Estado y siguientes pasos

- [x] Catálogo, roadmaps (Lista+Mapa), libros con lector, recursos, buscador, admin, progreso.
- [x] CRUD completo, SEO, Docker/CI, tests unitarios.
- [ ] Despliegue público (Vercel/Railway/Neon).
- [ ] Multiusuario + RBAC.
- [ ] Plan de estudio con objetivos y recordatorios.

---

_Construido por Samuel Aguilar — consultor IT, futuro arquitecto de infraestructuras y ciberseguridad._
