import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendOTPMessage(to: string, code: string) {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID ?? "")
    .verifications.create({
      channel: "sms",
      to: `+57${to}`,
      customCode: code,
    });

  return verification;
}
