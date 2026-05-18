/**
 * Shared env config. Use SITE_URL in .env.local / Vercel for your canonical URL.
 */

/** Hostname used in sitemap, robots, ads.txt, and canonical URLs */
export const SITE_DOMAIN = 'allinonetools.online';

const PRODUCTION_URL = `https://${SITE_DOMAIN}`;

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

/** Hostname from getBaseUrl() (no www), for ads.txt OWNERDOMAIN */
export function getSiteDomain() {
  try {
    return new URL(getBaseUrl()).hostname.replace(/^www\./i, '');
  } catch {
    return SITE_DOMAIN;
  }
}
