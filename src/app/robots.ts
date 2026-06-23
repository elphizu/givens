import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${env.siteUrl ?? 'http://localhost:3000'}/sitemap.xml`,
  };
}
