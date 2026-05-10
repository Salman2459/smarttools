import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const origin = new URL(baseUrl);
  const bareHost = origin.hostname.replace(/^www\./i, '');
  const site = (hostname: string) => `${origin.protocol}//${hostname}`;
  const sitemapUrls = [`${site(`www.${bareHost}`)}/sitemap.xml`, `${site(bareHost)}/sitemap.xml`];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
    ],
    sitemap: sitemapUrls,
  };
}
