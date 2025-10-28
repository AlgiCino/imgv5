import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Define an allowlist of trusted hostnames
const ALLOWED_DOMAINS = [
  // Contentful CDN domains
  'images.ctfassets.net',
  'videos.ctfassets.net',
  'assets.ctfassets.net',
  'downloads.ctfassets.net',
  'zoq5l15g49wj.cdn.contentful.com',
  // Video platforms
  'i.ytimg.com',
  'youtube.com',
  'vimeo.com',
  // Developer CDNs
  'cdn.properties.emaar.com',
  'properties.emaar.com',
  'sobharealty.com',
  'nakheel.com',
  // Cloud storage
  'res.cloudinary.com',
  'storage.googleapis.com',
  'firebasestorage.googleapis.com',
  // AWS S3
  's3.amazonaws.com',
  's3-us-west-2.amazonaws.com',
  's3-eu-west-1.amazonaws.com',
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const urlString = searchParams.get('url');

    if (!urlString) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    let url: URL;
    try {
      url = new URL(urlString);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Enforce HTTPS
    if (url.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 403 });
    }

    // Check against allowlist
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    const range = req.headers.get('range') || undefined;
    const upstream = await fetch(url.toString(), { headers: range ? { Range: range } : {}, redirect: 'follow' });

    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 });
    }

    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    const cl = upstream.headers.get('content-length') || undefined;
    const cr = upstream.headers.get('content-range') || undefined;

    return new NextResponse(upstream.body as any, {
      status: cr ? 206 : 200,
      headers: {
        'Content-Type': ct,
        ...(cl ? { 'Content-Length': cl } : {}),
        ...(cr ? { 'Content-Range': cr } : {}),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}