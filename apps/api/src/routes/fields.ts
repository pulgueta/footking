import { createFieldSchema } from "@footking/db/schemas";
import { createField, getFields, getOwnerFields } from "@footking/db/services";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { searchFieldSchema } from "@/schemas";

const app = new Hono();

export const fieldRoutes = app
  .get("/", zValidator("query", searchFieldSchema), async (c) => {
    const query = c.req.valid("query");

    const fields = await getOwnerFields(query.ownerId);

    return c.json(fields);
  })
  .get("/all", async (c) => {
    const fields = await getFields();

    return c.json(fields);
  })
  .post("/", zValidator("json", createFieldSchema), async (c) => {
    const field = c.req.valid("json");

    try {
      const createdField = await createField(field);

      return c.json({ message: "Field created", field: createdField });
    } catch (error) {
      console.error(error);

      return c.json({ message: "An error ocurred" }, 400);
    }
  });
