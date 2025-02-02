ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

FROM base AS deps

LABEL fly_launch_runtime="Node.js"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-*.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

FROM base AS build

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-*.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY apps/api ./apps/api

RUN pnpm --filter=api run db:generate
RUN pnpm --filter=api run db:migrate
RUN pnpm --filter=api build

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV="production"

WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist

EXPOSE 3000

CMD [ "pnpm", "start" ]