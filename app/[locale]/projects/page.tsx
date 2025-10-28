import { loadAllProjects } from '@/lib/unifiedDataService';
import type { Locale } from '@/lib/i18n-utils';
import Filters from '@/components/projects/Filters'; // Import Filters

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const all = loadAllProjects() || [];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10"> {/* Adjusted padding */}
      <h1 className="text-4xl font-extrabold text-gold mb-6">{locale === 'ar' ? 'كل المشاريع' : 'All Projects'}</h1>
      <Filters initial={await all} /> {/* Use Filters component */}
    </div>
  );
}