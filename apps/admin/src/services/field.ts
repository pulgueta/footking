import type { CreateField, Field } from "api/db";

import { api } from "@/lib/api";

export async function createField(fieldData: CreateField) {
  const request = await api.fields.$post({
    json: fieldData,
  });

  const createdField = await request.json();

  if (!createdField.field) {
    // TODO: Field with that name already exists, show toast
    return false;
  }

  return createdField;
}

export async function getOwnerFields(ownerId: Field["userId"]) {
  const request = await api.fields.$get({
    query: {
      ownerId,
    },
  });

  return await request.json();
}
