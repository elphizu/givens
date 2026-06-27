import { z } from 'zod';
import { type ModeType } from '@/types';

const ModeSchema = z.enum(['open', 'sealed']) satisfies z.ZodType<ModeType>;

export const PasteEnvelopeSchema = z.object({
  version: z.literal(1),
  mode: ModeSchema,
  salt: z.string(),
  nonce: z.string(),
  ciphertext: z.string(),
  x25519EphemeralPublicKey: z.string(),
  mlKemCiphertext: z.string().optional(),
});

export const PasteEnvelopeSecretSchema = z.object({
  version: z.literal(1),
  mode: ModeSchema,
  x25519SecretKey: z.string(),
  mlKemSecretKey: z.string().optional(),
});
