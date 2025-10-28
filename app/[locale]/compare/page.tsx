import { loadAllProjects } from '@/lib/unifiedDataService';
import CompareClient from '@/components/compare/CompareClient';
import { t } from '@/lib/i18n-utils';

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const allProjects = (await loadAllProjects()) || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gold-grad">
          {locale === 'ar' ? 'المقارنة' : 'Comparison'}
        </h1>
        <CompareClient allProjects={allProjects} />
      </div>
    </div>
  );
}