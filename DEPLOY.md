# Despliegue de CertPath

Monorepo: `apps/web` (Next.js) + `apps/api` (NestJS + Prisma).

## Opción A — Docker (todo en una máquina/VPS)

```bash
# api + web (SQLite en volumen, cero config)
docker compose -f infra/docker-compose.yml up --build

# + Postgres + Adminer
docker compose -f infra/docker-compose.yml --profile full up --build
```

- Web: http://localhost:3000 · API: http://localhost:4000/api · Adminer: http://localhost:8080
- Variables de la API: define `IMPORT_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`
  (puedes ponerlas en un `.env` junto al compose).

## Opción B — Cloud gestionado (recomendado para el portfolio)

| Pieza | Servicio | Notas |
|-------|----------|-------|
| Web   | **Vercel** | Root `apps/web`. Variables: `NEXT_PUBLIC_API_URL`, `API_URL` (URL pública del API). |
| API   | **Railway / Render** | Root `apps/api`. Build `npm run build`, start `npm run start:prod`. |
| BD    | **Neon / Supabase (Postgres)** | Copia la `DATABASE_URL` al API. |

### Pasos para Postgres (producción)
1. En `apps/api/prisma/schema.prisma` cambia el datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. `DATABASE_URL` = cadena de Neon/Supabase.
3. `npx prisma db push` (crea las tablas) y reimporta datos con los scripts de `apps/api/scripts/`.

### Checklist de seguridad antes de producción
- [ ] `AUTH_SECRET` e `IMPORT_TOKEN` largos y aleatorios (no los de ejemplo).
- [ ] CORS: fija `ALLOWED_ORIGINS` al dominio real (ver `apps/api/src/main.ts`).
- [ ] `ADMIN_PASSWORD_HASH` generado con bcrypt (no contraseña en claro).
- [ ] HTTPS en web y API (lo dan Vercel/Railway por defecto).

## Migrar a Render (gratis) — antes de que caduque la prueba de Railway

El repo incluye un **blueprint** (`render.yaml`) listo para desplegar la API en el plan
gratuito de Render sin volver a configurarla a mano:

1. **render.com** → **New +** → **Blueprint** → conecta el repo `certpath`.
2. Render lee `render.yaml` y crea el servicio `certpath-api` (Docker, plan free, healthcheck `/api/health`).
3. Rellena los secretos (`DATABASE_URL` de Neon, `IMPORT_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `ALLOWED_ORIGINS`).
4. **Deploy.** La base de datos sigue en **Neon** (no se migra).
5. Actualiza en la **web** (Vercel/Railway) `NEXT_PUBLIC_API_URL` y `API_URL` a la nueva URL de Render, y ajusta `ALLOWED_ORIGINS` de la API al dominio de la web.

> El plan free de Render "duerme" tras ~15 min de inactividad (arranque en frío de ~30-60 s).
> Para evitarlo, un *cron* externo (p. ej. UptimeRobot) que haga ping a `/api/health` cada 10 min.

## CI/CD
`.github/workflows/ci.yml` ejecuta en cada push/PR: build del API, typecheck+build del web,
tests, y build de las imágenes Docker.
