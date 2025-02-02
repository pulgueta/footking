# syntax = docker/dockerfile:1

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install node modules
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store

FROM final as server

COPY --from=build /app/apps/api/* /app

RUN pnpm install

COPY --from=server . .

EXPOSE 3000
CMD [ "pnpm", "start" ]
