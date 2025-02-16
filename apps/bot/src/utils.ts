import { getFieldByName, getFields } from "@footking/db/services";

export function formatPrice(price: number | undefined) {
  if (!price) {
    return "No disponible";
  }

  return new Intl.NumberFormat("es-CO", { currency: "COP", style: "currency" })
    .format(price)
    .replace(",00", "");
}

export async function fieldButtons() {
  const fields = await getFields();

  return fields.map((field) => ({
    body: field.name,
  }));
}

export async function daysAheadButtons(name: string) {
  const fieldDays = await getFieldByName(name);

  if (!fieldDays) {
    return [];
  }

  return fieldDays.daysToBookAhead;
}
