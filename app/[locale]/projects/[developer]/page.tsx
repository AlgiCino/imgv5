import { getProjectsByDeveloper } from '@/lib/projectService';
import { loadAllProjects } from '@/lib/unifiedDataService';
import ProjectCard from '@/components/ProjectCard';
import DeveloperProjectsNotFound from '@/components/project/DeveloperProjectsNotFound';
import type { Locale } from '@/lib/i18n-utils';
import type { Project } from '@/lib/types';

export default async function DeveloperProjectsPage({ params }: { params: Promise<{ locale: Locale; developer: string }> }) {
  const { locale, developer } = await params;
  const projects = await getProjectsByDeveloper(developer);
  if (!projects.length) {
    const all = await loadAllProjects();
    const otherProjects = (all || []).filter(p => p.developer !== developer && p.slug);
    return <DeveloperProjectsNotFound developer={developer} otherProjects={otherProjects} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gold-grad">
        {locale === 'ar' ? 'مشاريع' : 'Projects by'} {developer}
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {projects.map((p: Project, index: number) => (
          <ProjectCard key={`${p.id || p.slug}-${index}`} project={p} />
        ))}
      </div>
    </div>
  );
}
