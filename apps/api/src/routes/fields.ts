import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { db } from "@/db/config";
import { createFieldSchema, fieldTable } from "@/db/schema";
import { getOwnerFields } from "@/services/db";

const app = new Hono();

export const fieldRoutes = app
  .get("/:ownerId", async (c) => {
    const ownerId = c.req.param("ownerId");

    const fields = await getOwnerFields(Number(ownerId));

    return c.json({ fields });
  })
  .post("/", zValidator("json", createFieldSchema), async (c) => {
    const field = c.req.valid("json");

    const [createdField] = await db.insert(fieldTable).values(field).returning();

    return c.json({ message: "Field created", field: createdField });
  });
