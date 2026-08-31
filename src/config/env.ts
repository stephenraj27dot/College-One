import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://collegesguide.in"),
  NEXT_PUBLIC_APP_NAME: z.string().default("College Guide"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default("919629653312"),
  NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE: z
    .string()
    .default(
      "Hi College Guide Team, I need admission guidance and cutoff assistance for colleges in Tamil Nadu."
    ),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE:
    process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE,
});
