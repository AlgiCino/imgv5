import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|mp4|webm|pdf|json)$/i;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // تخطّي الملفات العامة و Next internals و الـ API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // تحويل الجذر إلى اللغة الافتراضية
  if (pathname === '/') {
    const defaultLocale = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE?.split(',')[0].trim() || 'ar');
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  const isDev = process.env.NODE_ENV !== 'production';

  // DEV: اسمح بأي https للصور/الفيديو لحل المشاكل بسرعة
  // PROD: allowlist مضبوطة (وسّعها حسب الحاجة)
  const imgSrc = isDev
    ? "img-src 'self' data: blob: https:"
    : [
        "img-src 'self' data: blob:",
        // DAMAC (Contentful)
        'https://images.ctfassets.net',
        'https://videos.ctfassets.net',
        // Sobha
        'https://sobharealty.com',
        'https://*.sobharealty.com',
        // Emaar
        'https://cdn.properties.emaar.com',
        'https://properties.emaar.com',
        // Nakheel
        'https://*.nakheel.com',
        // S3/CDNs عامة
        'https://*.amazonaws.com',
        'https://cdn.jsdelivr.net',
      ].join(' ');

  const mediaSrc = isDev
    ? "media-src 'self' data: blob: https:"
    : [
        "media-src 'self' data: blob:",
        'https://videos.ctfassets.net',
        'https://cdn.properties.emaar.com',
        'https://*.nakheel.com',
        'https://*.amazonaws.com',
        'https://sobharealty.com',
        'https://*.sobharealty.com',
      ].join(' ');

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    imgSrc,
    mediaSrc,
    "font-src 'self' data:",
    "connect-src 'self' https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://api.mapbox.com https://maps.googleapis.com https://www.google-analytics.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://my.matterport.com https://view.propvr.tech https://storagecdn.propvr.tech",
    "worker-src 'self' blob:",
    'upgrade-insecure-requests',
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}
