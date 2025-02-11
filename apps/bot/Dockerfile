ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine as deps

WORKDIR /app

RUN npm i -g pnpm

COPY package.json /app/package.json

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install

FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /app

RUN npm i -g pnpm

COPY --from=deps /app/node_modules /app/node_modules
COPY . /app

RUN pnpm build

FROM node:${NODE_VERSION}-alpine as runner

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]