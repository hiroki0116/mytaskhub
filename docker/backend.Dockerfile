FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/backend/package*.json ./packages/backend/

RUN npm ci

COPY . .

RUN npm run build:backend

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/common/package*.json ./packages/common/
COPY --from=builder /app/packages/backend/package*.json ./packages/backend/
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma

RUN npm ci --production7

EXPOSE 3001

CMD ["node", "packages/backend/dist/main.js"]