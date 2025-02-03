ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

FROM base AS deps

LABEL fly_launch_runtime="Node.js"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json .

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install 

FROM base AS build

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch 
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install 

COPY . .

RUN pnpm build --filter=api

FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV="production"

WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/node_modules .
COPY --from=build /app/dist .

EXPOSE 3000

CMD [ "pnpm", "start" ]