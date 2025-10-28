'use client';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import InternalPDFViewer from '../ui/InternalPDFViewer';
import LuxuryButton from "@/components/ui/LuxuryButton";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/effect-coverflow';

interface DocsBlockProps {
  brochureUrl?: string;
  galleryImages?: string[];
  projectName?: string;
}

export default function DocsBlock({ 
  brochureUrl, 
  galleryImages = [], 
  projectName = "المشروع" 
}: DocsBlockProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  // Combine brochure and gallery images
  const allImages = [
    ...(brochureUrl ? [{
      url: brochureUrl,
      type: 'brochure' as const,
      title: 'البروشور الرسمي'
    }] : []),
    ...galleryImages.map((img, index) => ({
      url: img,
      type: 'gallery' as const,
      title: `صورة ${index + 1}`
    }))
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="bg-gradient-to-br from-black/60 to-black/40 border border-gold/30 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-gold font-bold text-xl mb-2">معرض المشروع</div>
          <div className="text-gray-400">لا توجد صور أو مستندات متاحة للعرض</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-black/60 to-black/40 border border-gold/30 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-gold/20 bg-gradient-to-r from-gold/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gold font-bold text-xl mb-1 font-amiri">معرض {projectName}</div>
              <div className="text-gray-300 text-sm">
                {allImages.length} عنصر • صور عالية الجودة ومستندات
              </div>
            </div>
            <div className="flex gap-3">
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="rounded-lg text-sm font-semibold"
              >
                عرض كامل
              </LuxuryButton>
            </div>
          </div>
        </div>

        {/* Main Gallery */}
        <div className="p-6">
          <Swiper
            modules={[Navigation, Pagination, Thumbs, Zoom, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            thumbs={{ swiper: thumbsSwiper }}
            zoom={true}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className="main-gallery rounded-xl overflow-hidden"
            style={{ height: '400px' }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {allImages.map((item, index) => (
              <SwiperSlide key={index} className="relative group">
                <div className="swiper-zoom-container">
                  {item.type === 'brochure' ? (
                    <div className="w-full h-full bg-gradient-to-br from-gold/10 to-transparent rounded-lg border border-gold/20 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                          <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-gold font-bold text-lg mb-2">البروشور الرسمي</div>
                        <div className="text-gray-300 text-sm">متاح في العرض الكامل</div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Overlay with title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white font-semibold">{item.title}</div>
                  <div className="text-gray-300 text-sm">
                    {index + 1} من {allImages.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border border-gold/20">
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border border-gold/20">
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="px-6 pb-6">
            <Swiper
              modules={[Navigation, Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              breakpoints={{
                640: { slidesPerView: 6 },
                768: { slidesPerView: 8 },
                1024: { slidesPerView: 10 },
              }}
              watchSlidesProgress={true}
              className="thumbs-gallery"
            >
              {allImages.map((item, index) => (
                <SwiperSlide key={index} className="cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gold/50 transition-all duration-300">
                    {item.type === 'brochure' ? (
                      <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <LuxuryButton
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </LuxuryButton>
          </div>

          <div className="w-full h-full flex items-center justify-center p-4">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              zoom={true}
              initialSlide={activeIndex}
              className="w-full h-full"
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {allImages.map((item, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center">
                  <div className="swiper-zoom-container">
                    {item.type === 'brochure' ? (
                      <div className="max-w-2xl w-full bg-gradient-to-br from-gold/10 to-transparent rounded-lg border border-gold/20 p-12 text-center cursor-pointer hover:bg-gold/5 transition-all duration-300" onClick={() => {
                            setIsFullscreen(false);
                            setShowPDFViewer(true);
                          }}>
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-gold font-bold text-2xl mb-4">البروشور الرسمي</div>
                        <div className="text-gray-300">اضغط للعرض الداخلي المتقدم</div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Fullscreen Info */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="text-white font-semibold text-lg">
              {allImages[activeIndex]?.title}
            </div>
            <div className="text-gray-300">
              {activeIndex + 1} من {allImages.length} • استخدم الأسهم للتنقل • ESC للخروج
            </div>
          </div>
        </div>
      )}

      {/* Internal PDF Viewer */}
      {showPDFViewer && brochureUrl && (
        <InternalPDFViewer
          pdfUrl={brochureUrl}
          projectName={projectName}
          onClose={() => setShowPDFViewer(false)}
        />
      )}

      <style jsx global>{`
        .main-gallery .swiper-pagination-bullet {
          background: rgba(212, 175, 55, 0.3);
          opacity: 1;
        }
        .main-gallery .swiper-pagination-bullet-active {
          background: #d4af37;
        }
        .thumbs-gallery .swiper-slide-thumb-active .aspect-square {
          border-color: #d4af37 !important;
        }
      `}</style>
    </>
  );
}