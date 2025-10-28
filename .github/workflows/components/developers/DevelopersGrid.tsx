'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import { t } from '@/lib/i18n-utils';
import { getDeveloperCounts } from '@/lib/developerService';
import type { Project } from '@/lib/types';
import { makeProjectHref } from '@/lib/routing';
import { EmaarLogoIcon as EmaarLogo, DamacLogoIcon as DamacLogo, SobhaLogoIcon as SobhaLogo, NakheelLogoIcon as NakheelLogo } from '@/components/ui/icons';
import LuxuryButton from '@/components/ui/LuxuryButton';

type DeveloperGridProps = {
  developers: { developer: string; count: number }[];
};

const developerLogos: { [key: string]: React.ComponentType<{ className?: string }> } = {
  emaar: EmaarLogo,
  damac: DamacLogo,
  sobha: SobhaLogo,
  nakheel: NakheelLogo,
};

export default function DevelopersGrid({ developers }: DeveloperGridProps) {
  const locale = useLocale();

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {developers.map(({ developer, count }) => {
        const LogoComponent = developerLogos[developer.toLowerCase()];
        return (
          <Link
            key={developer}
            href={{ pathname: `/${locale}/projects/${developer}` }} // Corrected href
            className="block rounded-2xl border border-gold/20 p-6 bg-black/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition"
          >
            <div className="h-20 flex items-center justify-center mb-4">
              {LogoComponent ? (
                <LogoComponent className="h-12 w-auto" />
              ) : (
                <div className="h-16 w-16 bg-zinc-800 rounded-full mx-auto flex items-center justify-center text-gold font-bold">
                  {developer.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-gold font-bold text-lg text-center capitalize">{developer}</div>
            <div className="text-sm text-gray-400 mt-1 text-center">
              {count} {locale === 'ar' ? 'مشاريع' : 'projects'}
            </div>
            <LuxuryButton 
              variant="primary" 
              size="md" 
              className="mt-4 w-full inline-flex justify-center items-center rounded-xl font-semibold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              {locale === 'ar' ? 'عرض المشاريع' : 'View Projects'}
            </LuxuryButton>
          </Link>
        );
      })}
    </div>
  );
}
