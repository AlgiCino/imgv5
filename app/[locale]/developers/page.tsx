import DevelopersGrid from '@/components/developers/DevelopersGrid';
import { t } from '@/lib/i18n-utils';
import { loadAllProjects } from '@/lib/unifiedDataService';

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale = 'en' } = await params;
  const projects = (await loadAllProjects()) || [];

  // ✅ إنشاء مصفوفة المطورين بصيغة مطابقة للتايب { developer, count }
  const developerCounts: Record<string, number> = {};

  for (const p of projects) {
    const dev = p.developer || 'Unknown';
    developerCounts[dev] = (developerCounts[dev] || 0) + 1;
  }

  const developers = Object.entries(developerCounts).map(([developer, count]) => ({
    developer,
    count,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gold-grad mb-8">
        {locale === 'ar' ? 'المطورون' : 'Developers'}
      </h1>
      <DevelopersGrid developers={developers} />
    </div>
  );
}
