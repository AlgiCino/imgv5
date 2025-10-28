import { formatAED } from '@/lib/format';
import type { Project } from '@/lib/types';
import type { Locale } from '@/lib/i18n-utils';

// Server-side translation helper
function translateText(v?: {ar?:string; en?:string} | string, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v[locale] || v.en || v.ar || '';
}

export default function KeyStats({ 
  project, 
  locale = 'ar' 
}: { 
  project: Project; 
  locale?: Locale 
}) {
  const stats = [
    { 
      label: locale === 'ar' ? 'أقل سعر' : 'Min Price', 
      value: formatAED(project.minPriceAED, locale) 
    },
    { 
      label: locale === 'ar' ? 'أعلى سعر' : 'Max Price', 
      value: formatAED(project.maxPriceAED, locale) 
    },
    { 
      label: locale === 'ar' ? 'المساحة (قدم²)' : 'Area (ft²)', 
      value: project.minAreaSqft && project.maxAreaSqft 
        ? `${project.minAreaSqft} - ${project.maxAreaSqft}` 
        : '—' 
    },
    { 
      label: locale === 'ar' ? 'التسليم' : 'Delivery', 
      value: project.deliveryDate || '—' 
    },
    { 
      label: locale === 'ar' ? 'الخطة' : 'Plan', 
      value: translateText(project.paymentPlan, locale) || '—' 
    },
    { 
      label: locale === 'ar' ? 'الحالة' : 'Status', 
      value: translateText(project.projectStatus, locale) || '—' 
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 -mt-8 relative z-20">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl border border-gold/20 bg-black/60 p-4">
          <div className="text-xs text-gray-400">{s.label}</div>
          <div className="text-lg text-gold font-semibold mt-1">{s.value}</div>
        </div>
      ))}
    </div>
  );
}