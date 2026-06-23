import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.siteUrl ?? 'http://localhost:3000';
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
