'use client';

import React from 'react';

type Props = {
  url?: string;
  title?: string;
  className?: string;
};

/** يحدد مزوّد الرابط ويبني src مناسب للإ嵌اد */
function buildEmbedSrc(raw: string) {
  try {
    const u = new URL(raw);

    // Matterport
    if (u.hostname.includes('matterport.com')) {
      // الموديل يتواجد عادة في باراميتر m
      const m = u.searchParams.get('m') || '';
      if (m) {
        return {
          src: `https://my.matterport.com/show/?m=${encodeURIComponent(m)}&play=1&brand=0&mls=1`,
          allow:
            'vr; xr; accelerometer; magnetometer; gyroscope; autoplay; fullscreen',
        };
      }
      // fallback: استخدم الرابط كما هو
      return { src: raw, allow: 'autoplay; fullscreen' };
    }

    // PropVR (نستخدم الرابط كما هو — بدون SDK أو REST)
    if (u.hostname.includes('propvr.tech') || u.hostname.includes('propvr.ai')) {
      return { src: raw, allow: 'autoplay; fullscreen' };
    }

    // أي مزود آخر: iframe مباشر
    return { src: raw, allow: 'autoplay; fullscreen' };
  } catch {
    return { src: raw, allow: 'autoplay; fullscreen' };
  }
}

export default function Tour3D({ url, title = '3D Tour', className = '' }: Props) {
  if (!url) return null;

  const { src, allow } = buildEmbedSrc(url);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-[rgba(230,195,106,.35)] bg-black ${className}`}
    >
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow={allow}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
