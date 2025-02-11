import { addKeyword } from "@builderbot/bot";
import { MongoAdapter } from "@builderbot/database-mongo";
import { MetaProvider } from "@builderbot/provider-meta";

import { Field } from "@footking/db/dist/schema";
import { getFields } from "@footking/db/dist/services";

import { stateKeys } from ".";

export const welcomeFlow = addKeyword<MetaProvider, MongoAdapter>([
  "veo",
  "quiero reservar",
  "hola",
  "reservar",
  "reserva",
])
  .addAnswer(
    "¡Hola! ¿Qué cancha te gustaría reservar?",
    { capture: false },
    async (_, { state }) => {
      const fields = await getFields();

      await state.update({ fields });
    },
  )
  .addAction(async (_, { state, flowDynamic }) => {
    const fields = state.get<Field[]>(stateKeys.fields);

    const availFieldsWithHours = fields.map((field) => ({
      name: field.name,
      hourlyRate: field.hourlyRate,
      hours: field.availability,
    }));

    await flowDynamic(`¡Claro! Estas son las canchas disponibles: ${availFieldsWithHours}`);
  });
