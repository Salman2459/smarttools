/**
 * Shared env config. Use SITE_URL in .env.local / Vercel for your canonical URL.
 */

const PRODUCTION_URL = 'https://smarttools.fun';

/**
 * Canonical base URL for the site (sitemap, robots, absolute links).
 * Prefer SITE_URL; on Vercel production use PRODUCTION_URL so sitemap isn’t *.vercel.app.
 */
export function getBaseUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return PRODUCTION_URL;
}
