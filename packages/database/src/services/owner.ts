import { deleteCacheKey, getCacheKey, setCacheKey } from "../cache";
import { cacheKeys } from "../cache/cache-keys";
import { db } from "../index";
import type { CreateField, Field } from "../schema";
import { fieldTable } from "../schema";

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

export async function getFields() {
  const cachedFields = await getCacheKey<Field[]>(cacheKeys.fields);

  if (cachedFields) {
    return cachedFields;
  }

  const fields = await db.query.fieldTable.findMany({
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    columns: {
      address: true,
      name: true,
      availability: true,
      city: true,
      hourlyRate: true,
      state: true,
    },
  });

  await setCacheKey(cacheKeys.fields, fields);

  return fields;
}

export async function createField(fieldData: CreateField) {
  const field = await getFieldByName(fieldData.name);

  if (field?.name === fieldData.name) {
    return false;
  }

  const [createdField] = await db.insert(fieldTable).values(fieldData).returning();

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
