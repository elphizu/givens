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
    expiresAt: new Date(Date.now() + 3600_000),
  },
  {
    id: 'pst_seed002',
    ciphertext: 'U2FsdGVkX2AnotherExampleCipherTextHere222',
    burnToken: 'burn_token_abc',
    burnKey: 'burn_key_123',
    expiresAt: new Date(Date.now() + 86400_000),
  },
  {
    id: 'pst_seed003',
    ciphertext: 'Short',
    expiresAt: new Date(Date.now() + 604800_000),
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
