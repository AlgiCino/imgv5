// components/home/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LuxuryButton from '@/components/ui/LuxuryButton';

type Props = {
  titleAr: string;
  subtitleAr: string;
  titleEn: string;
  subtitleEn: string;
  locale: 'ar' | 'en';
};

export default function Hero({
  titleAr,
  subtitleAr,
  titleEn,
  subtitleEn,
  locale,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  
  const title = locale === 'ar' ? titleAr : titleEn;
  const subtitle = locale === 'ar' ? subtitleAr : subtitleEn;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Simple animation
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="relative h-screen min-h-[100svh] overflow-hidden">
      {/* Background layer (removed missing local video and poster) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      
      {/* Enhanced gradient overlay with animation */}
      <motion.div 
        {...({ className: "absolute inset-0 pointer-events-none" } as any)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            {...({ className: "absolute w-1 h-1 bg-gold rounded-full" } as any)}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex items-end pb-24 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className={`text-white max-w-3xl ${locale === 'ar' ? 'ml-auto' : ''}`}>
          <h1 
            className="luxury-title text-4xl md:text-6xl lg:text-7xl font-bold gold-gradient luxury-text-shadow"
            dir="auto"
          >
            <span className="font-display">{title}</span>
          </h1>
          
          <p className={`luxury-subtitle mt-6 text-white/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            {subtitle}
          </p>
          
          <div className="mt-8 flex gap-4">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(212,175,55,0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
                href={`/${locale}/projects`}
                className="gold-btn luxury-glow hover:animate-gold-pulse transition-all duration-300 will-change-transform"
              >
                {locale === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'}
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                borderColor: "#D4AF37"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
                href={`/${locale}/contact`}
                className="gold-outline luxury-border hover:luxury-glow transition-all duration-300 will-change-transform"
              >
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* No dynamic loading overlay needed; video is local and eager */}
    </section>
  );
}
