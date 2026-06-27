import { config } from 'dotenv';
import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { encryptPasteContent } from './src/lib/encryption';
import { pastes } from './src/lib/db/schema';

config();

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seeds = [
  {
    id: 'pst_demo_incident',
    mode: 'open',
    content:
      'Incident note\n\nRotated the staging Stripe webhook secret at 2026-06-27 09:30 UTC.\nOwner: platform-oncall\nNext step: remove the old value from Vercel after deploy.',
    expiresInMs: 3600_000,
  },
  {
    id: 'pst_demo_onboarding',
    mode: 'open',
    content:
      'Onboarding handoff\n\nTemporary dashboard invite for Priya expires tonight.\nUse the /admin/invites page and rotate the invite after first login.',
    burnToken: 'burn_token_abc',
    burnKey: 'burn_key_123',
    expiresInMs: 86400_000,
  },
  {
    id: 'pst_demo_recovery',
    mode: 'sealed',
    content:
      'Recovery note\n\nStore the offline recovery phrase in the safe deposit envelope.\nDo not paste production credentials into demos.',
    expiresInMs: 604800_000,
  },
] as const;

async function seed() {
  const rows = await Promise.all(
    seeds.map(async (sample) => {
      const encrypted = await encryptPasteContent({
        content: sample.content,
        mode: sample.mode,
      });

      return {
        id: sample.id,
        ciphertext: encrypted.ciphertext,
        burnToken: 'burnToken' in sample ? sample.burnToken : null,
        burnKey: 'burnKey' in sample ? sample.burnKey : null,
        expiresAt: new Date(Date.now() + sample.expiresInMs),
        key: encrypted.key,
      };
    }),
  );

  const seedIds = rows.map((row) => row.id);

  await db.delete(pastes).where(inArray(pastes.id, seedIds));
  await db.insert(pastes).values(rows.map(({ key: _key, ...row }) => row));
  console.warn(`Seeded ${seeds.length} pastes`);

  for (const row of rows) {
    const burnKey = row.burnKey ? `.${row.burnKey}` : '';
    console.warn(`/p/${row.id}#${row.key}${burnKey}`);
  }

  await client.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
