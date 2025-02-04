import { boolean, object, string } from "zod";

export const loginSchema = object({
  phoneNumber: string().min(10).max(10),
  password: string().min(6),
  rememberMe: boolean().optional().default(false),
});
