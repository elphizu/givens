import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pastes } from '@/lib/db/schema';

import { type CreatePasteInput } from '@/pastes/paste.schema';

export const createPaste = async (data: CreatePasteInput) => {
  const pasteId = crypto.randomUUID();
  const burnToken = crypto.randomUUID();
  const burnKey = data.burnAfterReading ? crypto.randomUUID() : null;

  await db.insert(pastes).values({
    id: pasteId,
    ciphertext: data.ciphertext,
    burnToken,
    burnKey,
    expiresAt: new Date(data.expiresAt),
  });

  return { pasteId, burnToken, burnKey };
};

export const getPaste = async (id: string, burnKey?: string | null) => {
  const [paste] = await db.select().from(pastes).where(eq(pastes.id, id)).limit(1);

  if (!paste) return null;

  if (paste.expiresAt <= new Date()) {
    await db.delete(pastes).where(eq(pastes.id, id));
    return null;
  }

  if (!paste.burnKey) {
    return { ciphertext: paste.ciphertext };
  }

  if (paste.burnKey !== burnKey) return null;

  await db.delete(pastes).where(eq(pastes.id, id));
  return { ciphertext: paste.ciphertext };
};

export const deletePaste = async (id: string, burnToken: string) => {
  const [deleted] = await db
    .delete(pastes)
    .where(and(eq(pastes.id, id), eq(pastes.burnToken, burnToken)))
    .returning();
  return deleted ?? null;
};
