import { db } from "@/db/config";
import type { Field } from "@/db/schema";
import { getCacheKey, setCacheKey } from "./cache";

export async function getOwnerFields(ownerId: Field["userId"]) {
  if (await getCacheKey<Field[]>(`fields:${ownerId}`)) {
    return getCacheKey<Field[]>(`fields:${ownerId}`);
  }

  const fields = await db.query.fieldTable.findMany({
    where: (t, { eq }) => eq(t.userId, ownerId),
  });

  await setCacheKey(`fields:${ownerId}`, fields);

  return fields;
}
