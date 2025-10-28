'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import { t } from '@/lib/i18n-utils';
import type { Project } from '@/lib/types';
import { formatAED, formatArea, formatBedrooms } from '@/lib/format';
import { useCompare } from '@/lib/compare';
import { makeProjectHref } from '@/lib/routing';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { getDeveloperName } from '../../lib/utils/localization';

type CompareTableProps = {
  projects: Project[];
};

export default function CompareTable({ projects }: CompareTableProps) {
  const locale = useLocale();
  const { remove } = useCompare();

  if (projects.length === 0) {
    return (
      <p className="mt-8 text-gray-400">
        {locale === 'ar' ? 'لا توجد عناصر للمقارنة بعد.' : 'No items to compare yet.'}
      </p>
    );
  }

  const properties = [
    { key: 'developer', label: { ar: 'المطور', en: 'Developer' }, format: (p: Project) => getDeveloperName(p.developer, locale) },
    { key: 'area', label: { ar: 'المنطقة', en: 'Area' }, format: (p: Project) => t(p.area, locale) || t(p.location, locale) || t(p.city, locale) },
    { key: 'projectStatus', label: { ar: 'الحالة', en: 'Status' }, format: (p: Project) => t(p.projectStatus, locale) },
    { key: 'price', label: { ar: 'السعر', en: 'Price' }, format: (p: Project) => {
        const price =
          p.minPriceAED && p.maxPriceAED && p.maxPriceAED > p.minPriceAED
            ? `${formatAED(p.minPriceAED, locale)} – ${formatAED(p.maxPriceAED, locale)}`
            : formatAED(p.minPriceAED ?? p.maxPriceAED, locale);
        return price || '—';
      }
    },
    { key: 'size', label: { ar: 'المساحة', en: 'Area' }, format: (p: Project) => {
        const area =
          p.minAreaSqmt || p.maxAreaSqmt
            ? formatArea(p.minAreaSqmt, p.maxAreaSqmt, 'sqm', locale)
            : (p.minAreaSqft || p.maxAreaSqft)
            ? formatArea(p.minAreaSqft, p.maxAreaSqft, 'sqft', locale)
            : '—';
        return area;
      }
    },
    { key: 'bedrooms', label: { ar: 'الغرف', en: 'Bedrooms' }, format: (p: Project) => formatBedrooms(p.bedrooms, locale) },
    { key: 'paymentPlan', label: { ar: 'خطة الدفع', en: 'Payment Plan' }, format: (p: Project) => t(p.paymentPlan, locale) },
    { key: 'goldenVisaEligible', label: { ar: 'تأشيرة ذهبية', en: 'Golden Visa' }, format: (p: Project) => p.goldenVisaEligible ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No') },
    { key: 'brochurePdfLink', label: { ar: 'بروشور PDF', en: 'PDF Brochure' }, format: (p: Project) => p.brochurePdfLink ? (locale === 'ar' ? 'متاح' : 'Available') : (locale === 'ar' ? 'غير متاح' : 'Not Available') },
    { key: '3D_TourLink', label: { ar: 'جولة 3D', en: '3D Tour' }, format: (p: Project) => p['3D_TourLink'] ? (locale === 'ar' ? 'متاح' : 'Available') : (locale === 'ar' ? 'غير متاح' : 'Not Available') },
    { key: 'videoLink', label: { ar: 'فيديو', en: 'Video' }, format: (p: Project) => p.videoLink ? (locale === 'ar' ? 'متاح' : 'Available') : (locale === 'ar' ? 'غير متاح' : 'Not Available') },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              {locale === 'ar' ? 'الخاصية' : 'Property'}
            </th>
            {projects.map((p, index) => (
              <th key={`${p.id || p.slug}-${index}`} scope="col" className="px-6 py-3 relative">
                <div className="flex items-center justify-between">
                  <Link href={makeProjectHref(locale, p.developer || 'unknown', p.slug)} className="flex-grow">
                    <img src={p.heroImage || p.galleryImages?.[0] || '/media/logo.png'} alt={t(p.projectName, locale) || p.slug} className="w-16 h-16 object-cover rounded-full mx-auto mb-2" />
                    <div className="font-bold text-gold text-center">{t(p.projectName, locale) || p.slug}</div>
                  </Link>
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    onClick={() => remove(p.id || p.slug)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1 min-w-0"
                  >
                    ✕
                  </LuxuryButton>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {t(prop.label, locale)}
              </th>
              {projects.map((p, index) => (
                <td key={`${p.id || p.slug}-${index}`} className="px-6 py-4">
                  {prop.format(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
