import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'videos.ctfassets.net' },
      { protocol: 'https', hostname: 'assets.ctfassets.net' },
      { protocol: 'https', hostname: 'zoq5l15g49wj.cdn.contentful.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ]
  },
  
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname, '../../'),
};
export default nextConfig;
