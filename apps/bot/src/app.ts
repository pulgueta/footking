import "dotenv/config";

import { addKeyword, createBot, createFlow, createProvider } from "@builderbot/bot";
import { MongoAdapter } from "@builderbot/database-mongo";
import { MetaProvider } from "@builderbot/provider-meta";
import {
  getAvailableBookingHoursForDay,
  getBookingsFromField,
  getFieldByName,
  getFields,
} from "@footking/db/services";

import { stateKeys } from "./state";
import { fieldButtons, formatPrice } from "./utils";

const PORT = process.env.PORT ?? 3008;

export const welcomeFlow = addKeyword<MetaProvider, MongoAdapter>([
  "veo",
  "quiero reservar",
  "hola",
  "reservar",
  "reserva",
])
  .addAnswer("¡Hola! ¿Qué cancha te gustaría reservar?", {
    capture: true,
    buttons: await fieldButtons(),
  })
  .addAction(async (ctx, { flowDynamic }) => {
    const selectedField = ctx.body;
    const field = await getFieldByName(selectedField);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    const availability = await getAvailableBookingHoursForDay(field!.name, tomorrowString);

    console.log(availability);

    await flowDynamic(
      `${field?.name} tiene un costo de ${formatPrice(field?.hourlyRate)} la hora y tiene disponibilidad ${field?.availability}`,
    );
  });

// const registerFlow = addKeyword<Provider, Database>(utils.setEvent("REGISTER_FLOW"))
//   .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
//     await state.update({ name: ctx.body });
//   })
//   .addAnswer("What is your age?", { capture: true }, async (ctx, { state }) => {
//     await state.update({ age: ctx.body });
//   })
//   .addAction(async (_, { flowDynamic, state }) => {
//     await flowDynamic(
//       `${state.get("name")}, thanks for your information!: Your age: ${state.get("age")}`,
//     );
//   });

// const fullSamplesFlow = addKeyword<Provider, Database>(["samples", utils.setEvent("SAMPLES")])
//   .addAnswer(`💪 I'll send you a lot files...`)
//   .addAnswer(`Send image from Local`, { media: join(process.cwd(), "assets", "sample.png") })
//   .addAnswer(`Send video from URL`, {
//     media:
//       "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4",
//   })
//   .addAnswer(`Send audio from URL`, {
//     media: "https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3",
//   })
//   .addAnswer(`Send file from URL`, {
//     media: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   });

const main = async () => {
  const adapterFlow = createFlow([welcomeFlow]);
  const adapterProvider = createProvider(MetaProvider, {
    jwtToken: process.env.JWT_TOKEN,
    numberId: process.env.NUMBER_ID,
    verifyToken: process.env.VERIFY_TOKEN,
    version: process.env.VERSION,
  });

  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGO_DB_URI ?? "",
    dbName: process.env.MONGO_DB_NAME ?? "",
  });

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.post(
    "/v1/messages",
    handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body;
      await bot?.sendMessage(number, message, { media: urlMedia ?? null });
      return res.end("sended");
    }),
  );

  adapterProvider.server.post(
    "/v1/register",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot?.dispatch("REGISTER_FLOW", { from: number, name });
      return res.end("trigger");
    }),
  );

  adapterProvider.server.post(
    "/v1/samples",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot?.dispatch("SAMPLES", { from: number, name });
      return res.end("trigger");
    }),
  );

  adapterProvider.server.post(
    "/v1/blacklist",
    handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body;
      if (intent === "remove") bot?.blacklist.remove(number);
      if (intent === "add") bot?.blacklist.add(number);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    }),
  );

  httpServer(+PORT);
};

main();
