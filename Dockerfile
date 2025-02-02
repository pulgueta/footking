ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

FROM base AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-*.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build:api
RUN pnpm build:admin

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV="production"

WORKDIR /app

COPY --from=build /app/api/package*.json ./
COPY --from=build /app/api/dist ./dist


RUN pnpm install --prod

EXPOSE 3000

CMD [ "pnpm", "start" ]