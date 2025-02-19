FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest-10 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod && \
    chown -R node:node /app

USER node

COPY dist .

EXPOSE 8080

CMD ["node", "main.js"]
