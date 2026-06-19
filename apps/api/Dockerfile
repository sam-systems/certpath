# ─── API (NestJS + Prisma) ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# node_modules completo (incluye CLI de Prisma para `db push` en arranque)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
EXPOSE 4000
# Crea/actualiza el esquema y arranca
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main"]
