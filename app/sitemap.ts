import type { MetadataRoute } from 'next';
import { toolsData } from '@/lib/tools-data';

// Served at /sitemap.xml (Next.js App Router). robots.txt references this URL.
function getBaseUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://smarttools.fun';
}

export const revalidate = 3600; // revalidate sitemap every hour

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacypolicy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/features/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  for (const tool of toolsData) {
    entries.push({
      url: `${baseUrl}/tools/${tool.id}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  return entries;
}
