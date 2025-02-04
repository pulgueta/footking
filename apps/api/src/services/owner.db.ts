import { db } from "@/db/config";
import type { CreateField, Field } from "@/db/schema";
import { fieldTable } from "@/db/schema";
import { deleteCacheKey, getCacheKey, setCacheKey } from "@/utils/cache";
import { cacheKeys } from "@/utils/cache-keys";

export async function getOwnerFields(ownerId: Field["userId"]) {
  const cachedFields = await getCacheKey<Field[]>(`${cacheKeys.fields}:${ownerId}`);

  if (cachedFields) {
    return cachedFields;
  }

  const fields = await db.query.fieldTable.findMany({
    where: (t, { eq }) => eq(t.userId, ownerId),
  });

  await setCacheKey(`${cacheKeys.fields}:${ownerId}`, fields);

  return fields;
}

export async function createField(fieldData: CreateField) {
  const field = await getFieldByName(fieldData.name);

  if (field?.name === fieldData.name) {
    return false;
  }

  const [createdField] = await db
    .insert(fieldTable)
    .values({
      ...fieldData,
      userId: "7BWmXI4GuZ",
    })
    .returning();

  await Promise.all([
    deleteCacheKey(cacheKeys.fields),
    deleteCacheKey(`${cacheKeys.fields}:${fieldData.userId}`),
  ]);

  return createdField;
}

export async function getFieldByName(name: Field["name"]) {
  const cachedField = await getCacheKey<Field>(`${cacheKeys.field}:${name}`);

  if (cachedField) {
    return cachedField;
  }

  const field = await db.query.fieldTable.findFirst({
    where: (t, { eq }) => eq(t.name, name),
  });

  if (field) {
    await setCacheKey(`${cacheKeys.field}:${name}`, field);
  }

  return field;
}
