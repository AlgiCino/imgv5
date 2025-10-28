import { loadAllProjects } from './unifiedDataService';
import type { Project } from './types';

export async function getDevelopers(): Promise<{ developer: string; count: number }[]> {
  const map = new Map<string, number>();
  const allProjects = await loadAllProjects();
  for (const p of allProjects) {
    const key = p.developer ?? 'unknown';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([developer, count]) => ({ developer, count }))
    .sort((a, b) => a.developer.localeCompare(b.developer));
}

export async function getProjectsByDeveloper(developer: string): Promise<Project[]> {
  const key = developer || 'unknown';
  const allProjects = await loadAllProjects();
  return allProjects.filter((p) => (p.developer ?? 'unknown') === key);
}

export async function getProjectBySlug(
  developer: string,
  slug: string
): Promise<Project | undefined> {
  const key = developer || 'unknown';
  const allProjects = await loadAllProjects();
  return allProjects.find(
    (p) => (p.developer ?? 'unknown') === key && p.slug === slug
  );
}
