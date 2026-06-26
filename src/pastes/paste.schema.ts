import { z } from 'zod';

export const createPasteSchema = z.object({
  ciphertext: z.string().min(1),
  expiresAt: z.iso.datetime(),
  burnAfterReading: z.boolean().optional().default(false),
});

export type CreatePasteInput = z.infer<typeof createPasteSchema>;
