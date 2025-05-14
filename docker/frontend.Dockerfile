FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/frontend/package*.json ./packages/frontend/

RUN npm ci

COPY . .

RUN npm run build:frontend

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/common/package*.json ./packages/common/
COPY --from=builder /app/packages/frontend/package*.json ./packages/frontend/
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/frontend/.next ./packages/frontend/.next
COPY --from=builder /app/packages/frontend/public ./packages/frontend/public
COPY --from=builder /app/packages/frontend/next.config.ts ./packages/frontend/
COPY --from=builder /app/packages/frontend/package.json ./packages/frontend/

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@mytaskhub/frontend"]