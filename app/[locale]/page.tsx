import { loadAllProjects } from '@/lib/unifiedDataService';
import { t } from '@/lib/i18n-utils';
import Hero from '@/components/home/Hero';
import OrbitCarousel from '@/components/home/OrbitCarousel';
import { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard';
import MediaSuspense from '@/components/ui/MediaSuspense';

type Locale = 'ar' | 'en';

export const generateMetadata = async ({ params }: any): Promise<Metadata> => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const title =
    locale === 'ar'
      ? 'بوابة الإمبراطورية العقارية - دبي'
      : 'Imperium Real Estate Gate - Dubai';
  const description =
    locale === 'ar'
      ? 'اكتشف أفخم العقارات في دبي، حيث تلتقي الفخامة بالاستثمار.'
      : "Discover Dubai's most luxurious properties, where opulence meets investment.";
  const ogImage =
    'https://ggfx-onebrokergroup.s3.eu-west-2.amazonaws.com/i/Homepage_Banner_Video2_8328_Bdd5c7_f31f1b5265.mp4';

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage }] },
  };
};

// ✅ تصحيح الخطأ فقط بدون المساس بالمحتوى
export default async function HomePage({ params }: any) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const all = (await loadAllProjects()) || [];

  const slides = all
    .filter((p) => typeof p.videoLink === 'string' && p.videoLink.toLowerCase().endsWith('.mp4'))
    .slice(0, 10)
    .map((p) => ({
      videoLink: p.videoLink || '',
      title:
        typeof p.projectName === 'string'
          ? p.projectName
          : (p.projectName?.[locale as Locale] || p.slug),
      developer: p.developer,
    }));

  return (
    <div className="w-full">
      <MediaSuspense type="video" height="100vh">
        <Hero
          locale={locale}
          titleAr="Imperium Gate — مختارات"
          subtitleAr="عقارات فاخرة منتقاة في دبي."
          titleEn="Imperium Gate — Featured"
          subtitleEn="Curated luxury properties in Dubai."
        />
      </MediaSuspense>

      {slides.length ? (
        <section className="mt-10">
          <MediaSuspense type="gallery" height="600px">
            <OrbitCarousel slides={slides} />
          </MediaSuspense>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-6 py-16 mt-12 md:mt-16">
        <div className="text-center mb-12">
          <h2 className={`luxury-title text-3xl md:text-4xl lg:text-5xl font-bold gold-gradient-static luxury-text-shadow ${locale === 'ar' ? 'font-display' : 'font-display'}`}>
            {locale === 'ar' ? 'مشاريع مختارة' : 'Featured Projects'}
          </h2>
          <p className={`luxury-subtitle mt-4 text-white/80 text-lg md:text-xl max-w-2xl mx-auto ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            {locale === 'ar' 
              ? 'اكتشف مجموعة منتقاة من أفخم العقارات في دبي'
              : 'Discover our curated selection of Dubai\'s most luxurious properties'
            }
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {all.slice(0, 12).map((p, index) => (
              <ProjectCard key={`${p.id || p.slug}-${index}`} project={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
