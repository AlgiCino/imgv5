"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LuxuryButton from '@/components/ui/LuxuryButton';

interface SectionNavProps {
  project?: any;
  locale?: string;
}

export default function SectionNav({ project, locale = 'ar' }: SectionNavProps) {
  const router = useRouter();
  const [availableSections, setAvailableSections] = useState<Array<{label: string, hash: string}>>([]);
  const isRtl = locale === 'ar';

  useEffect(() => {
    // Check which sections are available on the page
    const sections = [];
    
    // Always available sections
    if (document.querySelector('#overview')) {
      sections.push({ 
        label: isRtl ? "نظرة عامة" : "Overview", 
        hash: "#overview" 
      });
    }
    
    if (document.querySelector('#gallery')) {
      sections.push({ 
        label: isRtl ? "معرض الصور" : "Gallery", 
        hash: "#gallery" 
      });
    }
    
    if (document.querySelector('#tour3d')) {
      sections.push({ 
        label: isRtl ? "جولة 3D" : "3D Tour", 
        hash: "#tour3d" 
      });
    }
    
    if (document.querySelector('#video')) {
      sections.push({ 
        label: isRtl ? "الفيديو" : "Video", 
        hash: "#video" 
      });
    }
    
    if (document.querySelector('#map')) {
      sections.push({ 
        label: isRtl ? "الخريطة" : "Map", 
        hash: "#map" 
      });
    }
    
    if (document.querySelector('#amenities')) {
      sections.push({ 
        label: isRtl ? "المرافق" : "Amenities", 
        hash: "#amenities" 
      });
    }
    
    if (document.querySelector('#docs')) {
      sections.push({ 
        label: isRtl ? "البروشور" : "Brochure", 
        hash: "#docs" 
      });
    }
    
    if (document.querySelector('#insights')) {
      sections.push({ 
        label: isRtl ? "الإحصائيات" : "Insights", 
        hash: "#insights" 
      });
    }
    
    if (document.querySelector('#news')) {
      sections.push({ 
        label: isRtl ? "الأخبار" : "News", 
        hash: "#news" 
      });
    }
    
    if (document.querySelector('#developer-projects')) {
      sections.push({ 
        label: isRtl ? "مشاريع المطور" : "Developer Projects", 
        hash: "#developer-projects" 
      });
    }
    
    if (document.querySelector('#contact')) {
      sections.push({ 
        label: isRtl ? "تواصل" : "Contact", 
        hash: "#contact" 
      });
    }
    
    if (document.querySelector('#related')) {
      sections.push({ 
        label: isRtl ? "مشاريع مشابهة" : "Related Projects", 
        hash: "#related" 
      });
    }

    setAvailableSections(sections);
  }, [isRtl]);

  const handleClick = (hash: string) => {
    // Add smooth scrolling with offset for sticky header
    const element = document.querySelector(hash);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      router.push({ hash: hash } as any);
    }
  };

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <div className="section-nav">
      {availableSections.map((item) => (
        <LuxuryButton
          key={item.hash}
          variant="outline"
          size="sm"
          onClick={() => handleClick(item.hash)}
          className="text-xs"
        >
          {item.label}
        </LuxuryButton>
      ))}
    </div>
  );
}