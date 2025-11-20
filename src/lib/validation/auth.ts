import { z } from "zod";

const email = z.string().email();
const password = z.string().min(8, "Password must be at least 8 characters");

export const registerSchema = z.object({
  name: z.string().min(2),
  email,
  password
});

export const loginSchema = z.object({
  email,
  password
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
