import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";

import { fieldRoutes } from "@/routes/fields";
import type { Session, User } from "@/utils/auth";
import { auth } from "@/utils/auth";

export const app = new Hono<{
  Variables: {
    user: User;
    session: Session;
  };
}>().basePath("/api");

app.use(
  "*",
  cache({
    cacheName: "footking-cache",
    cacheControl: "public, max-age=3600",
  }),
);

app.use(
  "/api/auth/**",
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL ?? ""],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);

    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);

  return next();
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export const routes = app.route("/fields", fieldRoutes);

const port = Number(process.env.PORT) ?? 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
