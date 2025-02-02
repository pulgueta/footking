import { object, string } from "zod";

export const searchFieldSchema = object({
  ownerId: string(),
});
