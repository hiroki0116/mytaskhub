FROM node:18-alpine

WORKDIR /app

# 必要な依存関係をインストール
RUN apk add --no-cache openssl

COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/backend/package*.json ./packages/backend/

RUN npm install

COPY . .

# Prismaクライアントの生成
RUN cd packages/backend && npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:dev", "--workspace=@mytaskhub/backend"]