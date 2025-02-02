ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

FROM base AS build

ENV NODE_ENV="development"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . .

WORKDIR /app/api

RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV="production"

WORKDIR /app

COPY --from=build /app/api/package*.json ./api/
COPY --from=build /app/api/dist ./api/dist

WORKDIR /app/api

RUN pnpm install --prod

EXPOSE 3000

CMD [ "pnpm", "start" ]