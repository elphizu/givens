import type { z } from 'zod';

import type { ModeType } from '@/types';
import type { PasteEnvelopeSchema, PasteEnvelopeSecretSchema } from '@/lib/crypto/validation';

export interface PastePayload {
  content: string;
  mode: ModeType;
}

export type PasteEnvelope = z.infer<typeof PasteEnvelopeSchema>;

export type PasteEnvelopeSecret = z.infer<typeof PasteEnvelopeSecretSchema>;

export interface EncryptedPaste {
  ciphertext: string;
  key: string;
}
