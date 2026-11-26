/**
 * - /api/* est relayé vers le backend : le navigateur ne parle qu'au domaine
 *   du site (cookie admin same-site, plus de souci de CORS ni de "localhost").
 * - En-têtes de sécurité appliqués partout (Vercel comme Docker).
 */
const API = (process.env.API_INTERNAL_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Hôtes vers lesquels l'admin envoie les fichiers (URL présignées R2 / S3).
const UPLOAD_HOSTS =
  process.env.UPLOAD_CONNECT_SRC || 'https://*.r2.cloudflarestorage.com https://*.amazonaws.com';

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' : requis par les scripts inline de Next sans nonce.
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${UPLOAD_HOSTS}`,
  'frame-src https://www.youtube-nocookie.com https://player.vimeo.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API}/api/:path*` }];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
