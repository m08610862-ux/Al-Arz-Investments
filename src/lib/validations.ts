import * as z from "zod";

// =============================================================
// AUTHENTICATION SCHEMAS
// =============================================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// =============================================================
// PUBLIC WEBSITE SCHEMAS
// =============================================================

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});
