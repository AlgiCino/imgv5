'use client';

import { useEffect, useState } from 'react';

type Slide = {
  videoLink: string;
  developer?: string;
  title?: string;
};

export default function OrbitCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!slides?.length) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides?.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {slides?.map((slide, index) => (
        <video
          key={index}
          src={slide.videoLink}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={index === active}
          loop
          muted
          playsInline
          preload="auto"
        />
      ))}

      {/* Text content */}
      <div className="absolute bottom-24 left-16 text-amber-100 max-w-lg transition-all duration-700">
        <p className="text-sm mb-2 opacity-80">{slides[active]?.developer}</p>
        <h2 className="text-5xl font-amiri font-bold leading-tight">
          {slides[active]?.title}
        </h2>
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
    </div>
  );
}
