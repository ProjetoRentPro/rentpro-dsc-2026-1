FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

ENV npm_config_minimum_release_age=0

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

ENV npm_config_minimum_release_age=0

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
