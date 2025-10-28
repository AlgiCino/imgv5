'use client';
import { useCompare } from '@/lib/compare';
import { useParams } from 'next/navigation';
import { t } from '@/lib/i18n-utils';
import type { Project } from '@/lib/types';
import CompareTable from '@/components/compare/CompareTable';
import LuxuryButton from '@/components/ui/LuxuryButton';

type CompareClientProps = {
  allProjects: Project[]; // Now receives all projects as a prop
};

export default function CompareClient({ allProjects }: CompareClientProps) {
  const { ids, clear } = useCompare();
  const params = useParams();
  const locale = (params?.locale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const projectsToCompare = allProjects.filter(p => p.id ? ids.includes(p.id) : ids.includes(p.slug));

  return (
    <>
      {ids.length > 0 && (
        <LuxuryButton variant="outline" size="sm" onClick={clear}>
          {locale === 'ar' ? 'مسح الكل' : 'Clear All'}
        </LuxuryButton>
      )}
      {projectsToCompare.length === 0 ? (
        <p className="mt-8 text-gray-400">
          {locale === 'ar' ? 'لا توجد عناصر للمقارنة بعد.' : 'No items to compare yet.'}
        </p>
      ) : (
        <CompareTable projects={projectsToCompare} />
      )}
    </>
  );
}