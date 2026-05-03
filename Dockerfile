FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

EXPOSE 4500

CMD ["npx", "tsx", "src/index.ts"]