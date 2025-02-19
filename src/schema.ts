import z from "zod";

export const urlSchema = z.object({
  url: z.string().url(),
  domain: z.string().url(),
});

export type UrlSchema = z.infer<typeof urlSchema>;
