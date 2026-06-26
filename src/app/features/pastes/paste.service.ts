import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pastes } from '@/lib/db/schema';
import { generateId } from '@/lib/ids';

import { type CreatePasteInput } from '@/app/features/pastes/paste.schema';

export const createPaste = async (data: CreatePasteInput) => {
  const id = generateId('pst');

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + data.expiresInSeconds * 1000);

  await db.insert(pastes).values({
    id,
    ciphertext: data.ciphertext,
    nonce: data.nonce,
    algorithm: data.algorithm,
    createdAt,
    expiresAt,
    burnAfterRead: data.burnAfterRead,
    sizeBytes: Buffer.byteLength(data.ciphertext),
  });

  return { id, createdAt: createdAt.toISOString(), expiresAt: expiresAt.toISOString() };
};

export const getPaste = async (id: string) => {
  const [paste] = await db.select().from(pastes).where(eq(pastes.id, id)).limit(1);
  return paste ?? null;
};

export const deletePaste = async (id: string) => {
  const [deleted] = await db.delete(pastes).where(eq(pastes.id, id)).returning();
  return deleted ?? null;
};
