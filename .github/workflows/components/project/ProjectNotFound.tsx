'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import LuxuryButton from '@/components/ui/LuxuryButton';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/lib/types';

interface ProjectNotFoundProps {
  developer: string;
  slug: string;
  developerProjects: Project[];
  otherProjects: Project[];
}

export default function ProjectNotFound({ developer, slug, developerProjects, otherProjects }: ProjectNotFoundProps) {
  const locale = useLocale();
  const devSuggestions = (developerProjects || []).slice(0, 6);
  const otherSuggestions = (otherProjects || []).slice(0, 6);

  const isArabic = locale === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-gold/20" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30">
              <span className="text-4xl">🏗️</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 gold-gradient-static luxury-text-shadow ${isArabic ? 'font-arabic' : 'font-display'}`}>
            {isArabic ? 'المشروع غير متوفر' : 'Project Not Available'}
          </h1>
          
          <p className={`text-xl text-gray-300 mb-4 max-w-2xl mx-auto ${isArabic ? 'font-arabic' : 'font-sans'}`}>
            {isArabic 
              ? `عذراً، لم نتمكن من العثور على المشروع "${slug}" للمطور "${developer}"`
              : `Sorry, we couldn't find the project "${slug}" by "${developer}"`
            }
          </p>

          <p className={`text-gray-400 mb-8 ${isArabic ? 'font-arabic' : 'font-sans'}`}>
            {isArabic 
              ? 'قد يكون المشروع قيد التحديث أو تم نقله. يرجى تصفح المشاريع البديلة أدناه.'
              : 'The project may be under update or has been moved. Please browse alternative projects below.'
            }
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/projects`}>
              <LuxuryButton 
                variant="primary" 
                size="lg"
                className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
              >
                {isArabic ? 'تصفح جميع المشاريع' : 'Browse All Projects'}
              </LuxuryButton>
            </Link>
            
            <Link href={`/${locale}/projects/${developer}`}>
              <LuxuryButton 
                variant="outline" 
                size="lg"
                className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
              >
                {isArabic ? `مشاريع ${developer}` : `${developer} Projects`}
              </LuxuryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Alternative Projects from Same Developer */}
      {devSuggestions.length > 0 && (
        <section className="py-16 border-t border-gold/20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-3xl font-bold mb-8 text-center gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'}`}>
              {isArabic ? `مشاريع أخرى من ${developer}` : `Other Projects by ${developer}`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devSuggestions.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alternative Projects from Other Developers */}
      {otherSuggestions.length > 0 && (
        <section className="py-16 border-t border-gold/20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-3xl font-bold mb-8 text-center gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'}`}>
              {isArabic ? 'مشاريع مقترحة' : 'Suggested Projects'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSuggestions.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 border-t border-gold/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-2xl font-bold mb-6 gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'}`}>
            {isArabic ? 'تحتاج مساعدة؟' : 'Need Help?'}
          </h2>
          
          <p className={`text-gray-300 mb-8 ${isArabic ? 'font-arabic' : 'font-sans'}`}>
            {isArabic 
              ? 'فريقنا جاهز لمساعدتك في العثور على المشروع المناسب'
              : 'Our team is ready to help you find the right project'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+971556628972">
              <LuxuryButton 
                variant="secondary" 
                size="md"
                className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
              >
                📞 {isArabic ? 'اتصل بنا' : 'Call Us'}
              </LuxuryButton>
            </a>
            
            <a href="https://wa.me/971556628972" target="_blank" rel="noopener noreferrer">
              <LuxuryButton 
                variant="secondary" 
                size="md"
                className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
              >
                💬 {isArabic ? 'واتساب' : 'WhatsApp'}
              </LuxuryButton>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
