'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageTransitionProps {
  children: ReactNode;
}

// Simplified page variants for smoother transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

// Optimized transition settings
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Header always visible; SplashScreen is handled in RootLayout */}
      <Header />
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ 
            minHeight: '100vh'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      <Footer />
    </>
  );
}
