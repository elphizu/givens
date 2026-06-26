import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const pastes = pgTable('pastes', {
  id: text('id').primaryKey(),
  ciphertext: text('ciphertext').notNull(),
  burnToken: text('burn_token'),
  burnKey: text('burn_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
