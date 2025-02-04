import { boolean, object, string } from "zod";

export const loginSchema = object({
  email: string().email().min(4),
  password: string().min(4),
  rememberMe: boolean().optional().default(false),
});
