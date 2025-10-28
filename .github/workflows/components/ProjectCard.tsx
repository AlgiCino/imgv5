'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import type { Project } from '@/lib/types';
import { t, tx } from '@/lib/i18n-utils';
import { formatAED, formatArea, formatBedrooms } from '@/lib/format';
import { useFavorites } from '@/lib/favorites';
import { useCompare } from '@/lib/compare';
import LuxuryButton from '@/components/ui/LuxuryButton';
import LazyImage from '@/components/ui/LazyImage';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  const locale = useLocale();
  const title = t(project.projectName, locale) || project.slug;
  const subtitle = tx(project.area, locale) || tx(project.location, locale) || tx(project.city, locale) || '';
  const img = project.heroImage || project.galleryImages?.[0];

  const price =
    project.minPriceAED && project.maxPriceAED && project.maxPriceAED > project.minPriceAED
      ? `${formatAED(project.minPriceAED, locale)} – ${formatAED(project.maxPriceAED, locale)}`
      : formatAED(project.minPriceAED ?? project.maxPriceAED, locale);

  const area =
    project.minAreaSqmt || project.maxAreaSqmt
      ? formatArea(project.minAreaSqmt, project.maxAreaSqmt, 'sqm', locale)
      : (project.minAreaSqft || project.maxAreaSqft)
      ? formatArea(project.minAreaSqft, project.maxAreaSqft, 'sqft', locale)
      : '—';

  const bedrooms = formatBedrooms(project.bedrooms, locale);

  const href = { pathname: `/${locale}/projects/${project.developer}/${project.slug}` } as const;

  const favorites = useFavorites();
  const compare = useCompare();
  const isCompared = compare.ids.includes(project.id || project.slug);

  // Simplified state
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...({ 
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: "easeOut" },
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false),
        className: "group relative flex flex-col justify-between rounded-2xl overflow-hidden border border-gold/30 bg-black/90 hover:shadow-[0_0_20px_rgba(107,90,43,0.2)] hover:border-gold-800 transition-all duration-200 h-[520px]"
      } as any)}
    >
      {/* Simple glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <Link href={href} className="block relative overflow-hidden">
        <div className="relative h-44 w-full overflow-hidden">
          {img ? (
            <>
              <LazyImage
                src={img}
                alt={title}
                width={400}
                height={176}
                className="h-44 w-full object-cover transition-all duration-200"
                style={{
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                }}
              />
              {/* Simple overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </>
          ) : (
            <div className="h-44 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-gold/30 text-4xl">🏢</div>
            </div>
          )}
        </div>
      </Link>

      {/* Simplified floating buttons */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {project.goldenVisaEligible ? (
          <span className="text-[10px] px-2 py-1 rounded-full bg-gold/30 text-gold border border-gold/40 shadow backdrop-blur-sm">
            {locale === 'ar' ? 'تأشيرة ذهبية' : 'Golden Visa'}
          </span>
        ) : null}
        
        <LuxuryButton
          aria-label="favorite"
          onClick={() => favorites.toggle(project.id || project.slug)}
          variant={favorites.has(project.id || project.slug) ? "secondary" : "outline"}
          size="sm"
          className="!h-9 !w-9 !p-0 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200"
        >
          <span style={{ color: favorites.has(project.id || project.slug) ? "#FFD700" : "#D4AF37" }}>
            ★
          </span>
        </LuxuryButton>
        
        <LuxuryButton
          aria-label="compare"
          onClick={() => isCompared ? compare.remove(project.id || project.slug) : compare.add(project.id || project.slug)}
          variant={isCompared ? "secondary" : "outline"}
          size="sm"
          className="!h-9 !w-9 !p-0 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200"
        >
          <span style={{ color: isCompared ? "#FFD700" : "#D4AF37" }}>
            ⚖️
          </span>
        </LuxuryButton>
      </div>

      <div className="flex flex-col justify-between h-[calc(100%-11rem)] p-4">
        <div>
          <Link href={href} className="block">
            <h3 className={`luxury-title text-lg gold-gradient-static luxury-text-shadow leading-snug line-clamp-2 hover:text-gold transition-colors duration-200 ${locale === 'ar' ? 'font-arabic' : 'font-display'}`}>
              {title}
            </h3>
            <p className={`mt-1 text-xs text-gray-400 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
              {subtitle}
            </p>
            <p className={`mt-3 text-sm text-gray-300 line-clamp-2 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
              {String(t(project.summary, locale) || t(project.description, locale) || '').slice(0, 140)}
            </p>
          </Link>
        </div>

        <div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-zinc-900/70 px-3 py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
              <div className="text-[10px] text-gray-400">{locale === 'ar' ? 'السعر' : 'Price'}</div>
              <div className="font-semibold text-white/90">{price || '—'}</div>
            </div>
            <div className="rounded-lg bg-zinc-900/70 px-3 py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
              <div className="text-[10px] text-gray-400">{locale === 'ar' ? 'المساحة' : 'Area'}</div>
              <div className="font-semibold text-white/90">{area}</div>
            </div>
            <div className="rounded-lg bg-zinc-900/70 px-3 py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
              <div className="text-[10px] text-gray-400">{locale === 'ar' ? 'الغرف' : 'Bedrooms'}</div>
              <div className="font-semibold text-white/90">{bedrooms}</div>
            </div>
          </div>

          <Link href={href} className="mt-4 block">
            <LuxuryButton
              variant="primary"
              size="md"
              fullWidth
              className={`${locale === 'ar' ? 'font-arabic' : 'font-sans'} hover:scale-[1.02] transition-transform duration-200`}
            >
              {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}