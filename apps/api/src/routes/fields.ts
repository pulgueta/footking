import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createFieldSchema } from "@/db/schema";
import { searchFieldSchema } from "@/schemas";
import { createField, getOwnerFields } from "@/services/owner.db";

const app = new Hono();

export const fieldRoutes = app
  .get("/", zValidator("query", searchFieldSchema), async (c) => {
    const query = c.req.valid("query");

    const fields = await getOwnerFields(query.ownerId);

    return c.json(fields);
  })
  .post("/", zValidator("json", createFieldSchema), async (c) => {
    const field = c.req.valid("json");

    console.log(field);

    try {
      const createdField = await createField(field);

      return c.json({ message: "Field created", field: createdField });
    } catch (error) {
      console.error(error);

      return c.json({ message: "Field already exists" }, 400);
    }
  });
