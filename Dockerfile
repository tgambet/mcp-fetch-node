FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest-10 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build 

RUN pnpm prune --prod

EXPOSE 8080

CMD ["node", "dist/main.js"]
