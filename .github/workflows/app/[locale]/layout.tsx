import localFont from 'next/font/local'
import { getDictionary } from '@/lib/i18n'
import { i18n, Locale } from '@/lib/i18n-config'
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'

// This is now the root layout for each locale.
// It contains the <html> and <body> tags.

export const metadata: Metadata = {
  title: 'Imperium Gate',
  description: 'Luxury Real Estate in Dubai',
}

const inter = localFont({
  src: '../../public/fonts/Inter.ttf',
  variable: '--font-inter',
  display: 'swap',
})

const amiri = localFont({
  src: '../../public/fonts/Amiri.ttf',
  variable: '--font-amiri',
  display: 'swap',
})

const tajawal = localFont({
  src: '../../public/fonts/Tajawal.ttf',
  variable: '--font-tajawal',
  display: 'swap',
})

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${inter.variable} ${amiri.variable} ${tajawal.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
