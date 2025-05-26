FROM node:20.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/frontend/package*.json ./packages/frontend/

# huskyのインストールをスキップ
ENV HUSKY=0
ENV NPM_CONFIG_IGNORE_SCRIPTS=1
RUN npm ci

COPY . .

RUN npm run build:frontend

FROM node:20.18.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/common/package*.json ./packages/common/
COPY --from=builder /app/packages/frontend/package*.json ./packages/frontend/
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/frontend/.next ./packages/frontend/.next
COPY --from=builder /app/packages/frontend/public ./packages/frontend/public
COPY --from=builder /app/packages/frontend/next.config.ts ./packages/frontend/
COPY --from=builder /app/packages/frontend/package.json ./packages/frontend/

# huskyのインストールをスキップ
ENV HUSKY=0
ENV NPM_CONFIG_IGNORE_SCRIPTS=1
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@mytaskhub/frontend"]