'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import LazyImage from '@/components/ui/LazyImage';
import { formatAED, formatArea } from '@/lib/format';

interface RelatedCarouselProps {
  projects: Project[];
  currentProjectId?: string;
  locale: string;
}

export default function RelatedCarousel({ 
  projects, 
  currentProjectId, 
  locale 
}: RelatedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter out current project and limit to 6 related projects
  const relatedProjects = projects
    .filter(p => p.id !== currentProjectId)
    .slice(0, 6);

  if (relatedProjects.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === relatedProjects.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? relatedProjects.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-16 bg-black/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold gold-gradient-static luxury-text-shadow ${
            locale === 'ar' ? 'font-display' : 'font-display'
          }`}>
            {locale === 'ar' ? 'مشاريع ذات صلة' : 'Related Projects'}
          </h2>
          <p className={`mt-4 text-white/80 text-lg max-w-2xl mx-auto ${
            locale === 'ar' ? 'font-arabic' : 'font-sans'
          }`}>
            {locale === 'ar' 
              ? 'اكتشف المزيد من المشاريع المميزة'
              : 'Discover more exceptional projects'
            }
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {relatedProjects.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label={locale === 'ar' ? 'السابق' : 'Previous'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label={locale === 'ar' ? 'التالي' : 'Next'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / Math.min(relatedProjects.length, 3))}%)`,
                width: `${Math.max(relatedProjects.length, 3) * (100 / 3)}%`
              }}
            >
              {relatedProjects.map((project, index) => (
                <div 
                  key={project.id || project.slug}
                  className="w-1/3 px-3 flex-shrink-0"
                >
                  <Link 
                    href={`/${locale}/projects/${project.developer}/${project.slug}`}
                    className="block group"
                  >
                    <div className="glass-panel overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-gold">
                      {/* Project Image */}
                      <div className="relative h-64 overflow-hidden">
                        <LazyImage
                          src={project.images?.[0] || '/media/logo.png'}
                          alt={typeof project.projectName === 'string' 
                            ? project.projectName 
                            : (project.projectName?.[locale as 'ar' | 'en'] || project.slug)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-gold text-sm font-semibold">
                            {formatAED(project.startingPrice as number | undefined, (locale as 'ar' | 'en'))}
                          </span>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <h3 className={`text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors ${
                          locale === 'ar' ? 'font-display' : 'font-display'
                        }`}>
                          {typeof project.projectName === 'string'
                            ? project.projectName
                            : (project.projectName?.[locale as 'ar' | 'en'] || project.slug)}
                        </h3>
                        
                        <p className={`text-white/70 text-sm mb-3 ${
                          locale === 'ar' ? 'font-arabic' : 'font-sans'
                        }`}>
                          {project.developer}
                        </p>

                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
                            {locale === 'ar' ? 'المساحة:' : 'Area:'} {
                              (project.minAreaSqmt != null || project.maxAreaSqmt != null)
                                ? formatArea(project.minAreaSqmt, project.maxAreaSqmt, 'sqm', locale as 'ar' | 'en')
                                : formatArea(project.minAreaSqft, project.maxAreaSqft, 'sqft', locale as 'ar' | 'en')
                            }
                          </span>
                          <span className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
                            {locale === 'ar' ? 'غرف:' : 'Beds:'} {project.bedrooms || 'N/A'}
                          </span>
                        </div>

                        {/* Location */}
                        {project.location && (
                          <div className="mt-3 flex items-center text-white/60 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
                              {typeof project.location === 'string' 
                                ? project.location 
                                : (project.location?.[locale as 'ar' | 'en'] || '')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {relatedProjects.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(relatedProjects.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 3) === index
                      ? 'bg-gold scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
