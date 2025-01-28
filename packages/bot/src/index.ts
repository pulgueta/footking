import { Twilio } from "twilio";

import { env } from "@/env";

const tw = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

interface CreateMessage {
  userMessage: string;
  userPhoneNumber: string;
}

export async function createMessage(data: CreateMessage) {
  const message = await tw.messages.create({
    body: data.userMessage,
    from: `whatsapp:+57${data.userPhoneNumber}`, // TODO: Change if data is set with or without country code
    to: "whatsapp:+15005550006", // TODO: Change to my Twilio number
  });

  return message;
}
