import { loadAllProjects } from '@/lib/unifiedDataService';
import FavoritesClient from '@/components/favorites/FavoritesClient';

export default async function FavoritesPage(){
  const projects = (await loadAllProjects()) || [];
  return <FavoritesClient projects={projects} />;
}
