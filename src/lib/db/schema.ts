import { integer, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const pastes = pgTable('pastes', {
  id: text('id').primaryKey(),
  ciphertext: text('ciphertext').notNull(),
  nonce: text('nonce').notNull(),
  algorithm: text('algorithm').notNull().default('AES-256-GCM'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  burnAfterRead: boolean('burn_after_read').notNull().default(false),
  sizeBytes: integer('size_bytes').notNull(),
});
