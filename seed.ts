import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { pastes } from './src/lib/db/schema';

config();

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seeds = [
  {
    id: 'pst_seed001',
    ciphertext: 'U2FsdGVkX1+vupppZqHjKgExampleCipherText1',
    nonce: 'abc123nonce',
    algorithm: 'AES-256-GCM',
    expiresAt: new Date(Date.now() + 3600_000),
    burnAfterRead: false,
    sizeBytes: 42,
  },
  {
    id: 'pst_seed002',
    ciphertext: 'U2FsdGVkX2AnotherExampleCipherTextHere222',
    nonce: 'def456nonce',
    algorithm: 'AES-256-GCM',
    expiresAt: new Date(Date.now() + 86400_000),
    burnAfterRead: true,
    sizeBytes: 44,
  },
  {
    id: 'pst_seed003',
    ciphertext: 'Short',
    nonce: 'ghi789nonce',
    algorithm: 'AES-256-GCM',
    expiresAt: new Date(Date.now() + 604800_000),
    burnAfterRead: false,
    sizeBytes: 5,
  },
];

async function seed() {
  await db.insert(pastes).values(seeds);
  console.log(`Seeded ${seeds.length} pastes`);
  await client.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
