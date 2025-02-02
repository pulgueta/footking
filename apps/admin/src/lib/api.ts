import { hcWithType } from "api/hc";

export const { api } = hcWithType(process.env.PUBLIC_API_URL ?? "");
