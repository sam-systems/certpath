# 🏛️ Cyber Knowledge Platform — Arquitectura N9/N10

> Plataforma de formación, certificaciones, roadmaps y gestión del conocimiento.
> Diseñada para crecer de **N6 (VPS) → N10 (hiperescala)** SIN reescribir el núcleo.
> (Nombre provisional — cámbialo cuando quieras.)

---

## 0. Principio rector

**Mismo código, distinta escala.** Empiezas barato (1 VPS, N6) y subes a Kubernetes multi-región (N9) cambiando *infraestructura*, no *lógica de negocio*. Esto se logra con **arquitectura hexagonal** (el dominio no sabe si la BD es local o un cluster).

---

## 1. Stack por capas

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENTE   Next.js 15 · React 19 · TS · Tailwind · shadcn ·    │
│            Framer Motion · PWA                                 │
└───────────────┬──────────────────────────────────────────────┘
                │ HTTPS / REST + GraphQL (BFF)
┌───────────────▼──────────────────────────────────────────────┐
│  API GATEWAY   Cloudflare (CDN + WAF + DDoS) → Nginx Ingress   │
└───────────────┬──────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────┐
│  BACKEND   NestJS (TS) · Hexagonal + Clean · CQRS · Event-Driven│
│            ├─ módulo certs    ├─ módulo roadmaps               │
│            ├─ módulo recursos ├─ módulo usuarios/progreso      │
│            ├─ módulo empleo   ├─ módulo IA (RAG)               │
│            └─ módulo admin                                     │
└──┬─────────────┬──────────────┬───────────────┬──────────────┘
   │             │              │               │
┌──▼───┐   ┌─────▼────┐   ┌─────▼──────┐  ┌──────▼───────┐
│Postgres│  │  Redis   │   │ OpenSearch │  │   Qdrant     │
│(datos) │  │(caché/cola)│ │(búsqueda)  │  │(vectores IA) │
└────────┘  └──────────┘   └────────────┘  └──────────────┘
   │
┌──▼───────────────────────────────────────────────────────────┐
│  BUS DE EVENTOS   Redis Streams (N7) → Kafka (N9+)            │
└──────────────────────────────────────────────────────────────┘
```

**Observabilidad (transversal):** OpenTelemetry → Prometheus (métricas) · Loki (logs) · Grafana (paneles) · Tempo (trazas).

---

## 2. Estructura de carpetas (monorepo)

```
cyber-knowledge-platform/
├─ apps/
│  ├─ web/                 # Next.js 15 (frontend + BFF)
│  └─ api/                 # NestJS (backend)
│     └─ src/
│        ├─ modules/
│        │  ├─ certifications/
│        │  │  ├─ domain/         # entidades, value objects, puertos
│        │  │  ├─ application/    # casos de uso (CQRS: commands/queries)
│        │  │  ├─ infrastructure/ # repos Postgres, adaptadores
│        │  │  └─ interface/      # controllers REST/GraphQL
│        │  ├─ roadmaps/
│        │  ├─ resources/
│        │  ├─ users/
│        │  ├─ jobs/              # bolsa de empleo
│        │  ├─ ai/                # RAG, búsqueda semántica
│        │  └─ admin/
│        ├─ shared/        # kernel común (errores, eventos, tipos)
│        └─ main.ts
├─ packages/
│  ├─ ui/                  # componentes shadcn compartidos
│  ├─ types/               # tipos compartidos web↔api
│  └─ config/              # eslint, tsconfig, tailwind
├─ infra/
│  ├─ docker/              # Dockerfiles + docker-compose (N6/N7)
│  ├─ k8s/                 # manifiestos / Helm charts (N8+)
│  └─ terraform/           # IaC cloud (N8+)
├─ .github/workflows/      # CI/CD
└─ turbo.json              # monorepo (Turborepo)
```

---

## 3. Modelo de dominio (entidades principales)

| Entidad | Campos clave | Relaciones |
|---------|-------------|------------|
| **Certification** | name, vendor, code, level, cost, price, url, prepHours, validity, skills[], demand | → Category, → Vendor, ↔ Roadmap |
| **Vendor** | name (Microsoft, AWS, Cisco…), logo, url | → Certification[] |
| **Category** | name (Cloud, Ciber, Redes…), domain | jerárquica |
| **Roadmap** | title, role, steps[], estMonths, cost, difficulty, salary, employability | ↔ Certification[] |
| **Resource** | type (artículo/PDF/vídeo/lab), title, url, source, tags[] | → Category |
| **User** | email, role, profile, mfaSecret | → Progress, → Goals |
| **Progress** | userId, certId, status, hours, credentialUrl, published | User↔Certification |
| **Job** | title, company, certsRequired[], salary, source, location | → Certification[] |
| **AuditLog** | actor, action, entity, before/after, ts (inmutable) | — |

---

## 4. APIs (núcleo)

```
GET    /certifications            (filtros: vendor, domain, level, cost)
GET    /certifications/:id
GET    /roadmaps           /roadmaps/:id
GET    /resources                 (búsqueda full-text → OpenSearch)
POST   /ai/search                 (búsqueda semántica → Qdrant + RAG)
POST   /ai/recommend              (recomendar certs según perfil)
POST   /ai/study-plan             (generar plan personalizado)
GET    /me/progress       POST /me/progress
GET    /jobs/trends               (certs/tecnologías más demandadas)
ADMIN  /admin/* (CRUD certs, recursos, empresas, categorías…)
```

Escritura vía **Commands** (CQRS), lectura vía **Queries** optimizadas. Cada cambio emite un **evento** (`CertificationCreated`, `ProgressUpdated`) → indexa en OpenSearch/Qdrant de forma asíncrona.

---

## 5. Módulo IA (RAG)

```
Documento/Cert → embeddings → Qdrant (vector DB)
Usuario pregunta → embedding → top-K similares (Qdrant)
            → contexto + pregunta → LLM (Claude) → respuesta citada
```

Usos: chatbot experto, búsqueda semántica, recomendador de certs, comparador, generador de planes de estudio, análisis de empleabilidad.

---

## 6. Seguridad (Zero Trust)

- **Identidad:** Keycloak (OIDC/OAuth2) · SSO · **MFA** · JWT corto + refresh.
- **Autorización:** **RBAC** (roles) + **ABAC** (atributos/contexto).
- **Datos:** cifrado en tránsito (TLS) y reposo (AES-256). Secretos en **Vault**.
- **Perímetro:** Cloudflare **WAF** + anti-DDoS + **CSP**.
- **App:** OWASP Top 10, validación (Zod/class-validator), rate-limiting.
- **Auditoría:** **logs inmutables** (append-only) de toda acción sensible.

---

## 7. DevOps / Infraestructura por nivel

| Nivel | Infra | Coste aprox. |
|-------|-------|--------------|
| **N6** | 1 VPS · docker-compose (Postgres+Redis+API+Web) | ~10 €/mes |
| **N7** | VPS/cloud · BD gestionada · Redis · CI/CD · observabilidad básica | ~30-80 €/mes |
| **N8** | Kubernetes · OpenSearch · CDN · réplicas | cientos €/mes |
| **N9** | K8s multi-región · Kafka · Vault · Grafana stack | miles €/mes |
| **N10** | Multi-cloud · edge global · BD distribuidas | grande (equipo) |

**CI/CD:** GitHub Actions → build → test → imagen Docker → deploy (Helm). **IaC:** Terraform.

---

## 8. Roadmap de desarrollo (fases)

| Fase | Entregable | Nivel |
|------|-----------|-------|
| **F1 — MVP** | Monorepo · Next + Nest · Postgres · CRUD certs/roadmaps · auth básica · seed de datos | N6 |
| **F2 — Producto** | Búsqueda (OpenSearch) · dashboard usuario · admin CRUD · Redis caché · Docker | N6/N7 |
| **F3 — IA** | Qdrant · RAG · recomendador · chatbot · planes de estudio | N7 |
| **F4 — Enterprise** | Keycloak+MFA · RBAC/ABAC · observabilidad · CI/CD · K8s · bolsa empleo | N8 |
| **F5 — Escala** | Kafka · multi-región · Vault · hardening · auditoría inmutable | N9 |
| **F6 — Big Tech** | Multi-cloud · edge · BD distribuidas (solo si la demanda lo exige) | N10 |

---

## 9. Nota honesta

- **F1-F3 son alcanzables y desplegables** (producto real, usable, barato).
- **F4-F6 requieren tiempo, infra de pago y, en N9/N10, un equipo.** No se "generan", se construyen y operan.
- La arquitectura de arriba está pensada para que **nunca tengas que reescribir el núcleo** al subir de nivel — solo cambias infraestructura.

**Siguiente paso recomendado:** construir **F1 (MVP)** verificado y desplegable, ya sobre esta arquitectura.
