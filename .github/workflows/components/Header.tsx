"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function Header() {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale || "en";
  const [scrolled, setScrolled] = useState(false);
  const isRtl = locale === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    // Preserve the dynamic path structure
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-amber-400/30 shadow-lg"
          : "bg-transparent"
      }`}
      style={{ height: "var(--nav-h)" }}
    >
      {/* Glass morphism overlay when scrolled */}
      {scrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
      )}
      
      <nav className={`max-w-7xl mx-auto px-6 flex items-center justify-between h-full text-white relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Logo with Enhanced Golden Glow */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <Link 
            href={{ pathname: `/${locale}` }} 
            className={`transition-all duration-700 flex items-center gap-3 group ${isRtl ? 'font-amiri' : 'font-amiri'}`}
          >
            <div className="relative">
               <img 
                 src="/media/logo.png" 
                 alt="Imperium Gate" 
                 className={`transition-all duration-700 ${
                   scrolled ? 'h-8 w-8' : 'h-12 w-12'
                 } filter drop-shadow-lg group-hover:drop-shadow-2xl`}
               />
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
             </div>
             <span className={`${scrolled ? 'text-lg hidden md:block' : 'text-xl block'} font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-amber-300 group-hover:to-yellow-400 transition-all duration-300`}>
               Imperium Gate
             </span>
          </Link>
        </motion.div>

        {/* Navigation Links with Enhanced Styling */}
        <div className={`hidden lg:flex gap-8 ${isRtl ? 'flex-row-reverse font-amiri' : 'font-inter'}`}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, staggerChildren: 0.1 }}
            style={{ display: 'contents' }}
          >
          <Link 
            href={{ pathname: `/${locale}` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'الرئيسية' : 'Home'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/projects` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'المشاريع' : 'Projects'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/developers` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'المطورون' : 'Developers'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/favorites` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'المفضلة' : 'Favorites'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/compare` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'المقارنة' : 'Compare'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/ai-concierge` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'الذكاء الاصطناعي' : 'AI'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link 
            href={{ pathname: `/${locale}/contact` }} 
            className="relative group px-3 py-2 font-semibold text-white/90 hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">{isRtl ? 'تواصل معنا' : 'Contact'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          </motion.div>
        </div>

        {/* Language Toggle Button with Gold Styling */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={toggleLanguage}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 text-amber-300 hover:text-amber-200 hover:border-amber-400/50 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-yellow-500/30 transition-all duration-300 font-semibold backdrop-blur-sm ${isRtl ? 'font-amiri' : 'font-inter'}`}
          >
            {locale === 'ar' ? 'EN' : 'AR'} ↔
          </button>
        </motion.div>
      </nav>
    </header>
  );
}