export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL!,
} as const;
