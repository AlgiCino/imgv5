'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: string | number;
  height?: string | number;
  alt?: string;
  style?: React.CSSProperties;
}

export default function LazyVideo({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  width,
  height,
  alt = 'Video content',
  style
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setIsLoading(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isInView]);

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    setError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isInView && (
        <div 
          className="w-full h-full bg-gray-900/50 flex items-center justify-center"
          style={{ minHeight: height || '300px' }}
        >
          {poster ? (
            <img
              src={poster}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">🎬</div>
              <p>Video will load when visible</p>
            </div>
          )}
        </div>
      )}

      {isInView && (
        <>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-4">Loading video...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="text-center text-red-400">
                <div className="text-4xl mb-2">⚠️</div>
                <p>Failed to load video</p>
              </div>
            </motion.div>
          )}

          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            style={style}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          />
        </>
      )}
    </div>
  );
}