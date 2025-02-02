import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";

import { GeoMiddleware, getGeo } from "hono-geo-middleware";

import { fieldRoutes } from "@/routes/fields";
import type { Session, User } from "@/utils/auth";
import { auth } from "@/utils/auth";
import { ratelimit } from "@/utils/cache";

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

app.onError((error, c) => c.json({ error: error.message }, 500));

app.use(
  "*",
  cors({
    origin: [process.env.FRONTEND_URL ?? ""],
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

app.use("*", GeoMiddleware());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.on(["POST", "GET", "PUT", "PATCH", "DELETE"], "*", async (c, next) => {
  const geo = getGeo(c);

  if (!geo.ip) {
    const exc = await ratelimit("127.0.0.1");

    if (exc) {
      return c.json({ error: "Rate limit exceeded" }, 429);
    }

    return next();
  }

  const exc = await ratelimit(geo.ip);

  if (exc) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }

  return next();
});

app.get("/auth/get-session", async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

export const routes = app.route("/fields", fieldRoutes);

const port = Number(process.env.PORT) ?? 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
