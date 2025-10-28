import StatsPanel from '@/components/admin/StatsPanel';
import UploadForm from '@/components/admin/UploadForm';
import { loadAllProjects, listDevelopers } from '@/lib/unifiedDataService';

export default async function AdminPage(){
  const all = await loadAllProjects();
  const counts = await listDevelopers();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gold-grad">لوحة الإدارة</h1>
      <StatsPanel total={(all || []).length} counts={counts || []} />
      <UploadForm />
    </div>
  );
}
