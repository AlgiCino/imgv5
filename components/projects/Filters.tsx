'use client';
import { useMemo, useState } from 'react';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import { useLocale } from '@/lib/i18n-client';
import { t } from '@/lib/i18n-utils';
import LuxuryButton from '@/components/ui/LuxuryButton';

export default function Filters({ initial }: { initial: Project[] }) {
  const locale = useLocale();
  const [q, setQ] = useState('');
  const [dev, setDev] = useState<string>('');
  const [beds, setBeds] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  const filtered = useMemo(() => {
    return initial.filter(p => {
      const name = typeof p.projectName === 'string' ? p.projectName : (p.projectName?.[locale] || p.projectName?.en || '');
      const hitQ = !q || name.toLowerCase().includes(q.toLowerCase());
      const hitDev = !dev || (p.developer || '').toLowerCase() === dev.toLowerCase();
      const minOk = !min || (p.minPriceAED || 0) >= Number(min);
      const maxOk = !max || (p.maxPriceAED || 0) <= Number(max);
      const bedOk = !beds || (Array.isArray(p.bedrooms) && p.bedrooms.some(b => String(b) === beds));
      return hitQ && hitDev && minOk && maxOk && bedOk;
    });
  }, [initial, q, dev, min, max, beds, locale]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder={locale === 'ar' ? 'بحث' : 'Search'} value={q} onChange={e => setQ(e.target.value)} />
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder={locale === 'ar' ? 'مطوّر (damac…)' : 'Developer (damac…)'} value={dev} onChange={e => setDev(e.target.value)} />
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder={locale === 'ar' ? 'غرف (1/2/3)' : 'Beds (1/2/3)'} value={beds} onChange={e => setBeds(e.target.value)} />
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder={locale === 'ar' ? 'أدنى سعر (AED)' : 'Min price (AED)'} value={min} onChange={e => setMin(e.target.value)} />
        <input className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder={locale === 'ar' ? 'أقصى سعر (AED)' : 'Max price (AED)'} value={max} onChange={e => setMax(e.target.value)} />
        <LuxuryButton 
          variant="primary" 
          size="md" 
          className="rounded font-semibold" 
          onClick={() => { setQ(''); setDev(''); setBeds(''); setMin(''); setMax(''); }}
        >
          {locale === 'ar' ? 'مسح' : 'Clear'}
        </LuxuryButton>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 mt-8">
          {locale === 'ar' ? 'لا توجد مشاريع مطابقة.' : 'No matching projects found.'}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, index) => <ProjectCard key={`${p.id || p.slug}-${index}`} project={p} />)}
        </div>
      )}
    </div>
  );
}