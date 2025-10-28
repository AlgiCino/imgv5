'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Memoized timings for consistent animation sync
  const animationTimings = useMemo(
    () => ({
      logoDelay: 300,
      // Unified fade after 2.5s to guarantee removal and avoid header overlap
      fadeDelay: 2500,
      completeDelay: 2600,
      progressInterval: 45,
    }),
    []
  );

  // Simulated preloading with visual progress
  const preloadResources = useCallback(async () => {
    try {
      const totalSteps = 25;
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, animationTimings.progressInterval)
        );
        setLoadingProgress((i / totalSteps) * 100);
      }
      setIsPreloaded(true);
    } catch (error) {
      console.warn('⚠️ Resource preloading failed:', error);
      setIsPreloaded(true);
    }
  }, [animationTimings.progressInterval]);

  // Handle appearance and disappearance
  useEffect(() => {
    preloadResources();

    const logoTimer = setTimeout(() => setLogoVisible(true), animationTimings.logoDelay);

    // Fade out after a fixed 2.5s to ensure consistent removal
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, animationTimings.fadeDelay);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, animationTimings.completeDelay);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, animationTimings, preloadResources]);

  // Remove any secondary auto-fade logic; single timer above controls removal

  if (fadeOut) return null;

  return (
    <div
      className={`fixed inset-0 z-[40] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Liquid Gold Background — softened to avoid header flicker */}
      <div className="absolute inset-0 liquid-gold-bg pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-amber-900/20" />

        {/* Floating Gold Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-float-slow opacity-40 blur-sm will-change-transform"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full animate-float-medium opacity-30 blur-sm will-change-transform"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full animate-float-fast opacity-25 blur-sm will-change-transform"></div>
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-float-slow opacity-35 blur-sm will-change-transform"></div>
        <div className="absolute bottom-1/4 right-2/3 w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full animate-float-medium opacity-20 blur-sm will-change-transform"></div>

        {/* Gold Waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-shimmer-wave will-change-transform"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-amber-400 to-transparent animate-shimmer-wave-reverse will-change-transform"></div>
        </div>

        {/* Ambient Glow (lighter) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/5 via-amber-500/3 to-transparent rounded-full will-change-transform"></div>
      </div>

      {/* Logo & Text */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="mb-8 relative">
          <h1 className="text-6xl md:text-8xl font-amiri font-bold luxury-title-splash animate-shimmer-text text-amber-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
            إمبريوم جيت
          </h1>
          <h2 className="text-2xl md:text-3xl font-amiri font-light text-amber-200/90 mt-2 animate-fade-in-up">
            Imperium Gate
          </h2>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"></div>
      </div>

        <p className="text-lg md:text-xl font-light text-amber-200/80 mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Luxury Real Estate
        </p>

        {/* Progress bar */}
        <div className="w-32 h-1 bg-amber-900/30 rounded-full mx-auto overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        <div className="text-amber-300/70 text-sm font-light">{Math.round(loadingProgress)}%</div>
      </div>

      {/* Decorative Corners removed to prevent any residual glow over header */}

      {/* Preload critical assets (only existing files) */}
      <link rel="preload" as="font" href="/fonts/Amiri.ttf" type="font/ttf" crossOrigin="anonymous" />
    </div>
  );
}
