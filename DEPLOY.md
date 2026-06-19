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

## CI/CD
`.github/workflows/ci.yml` ejecuta en cada push/PR: build del API, typecheck+build del web,
tests, y build de las imágenes Docker.
