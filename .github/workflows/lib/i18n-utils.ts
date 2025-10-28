"use client";
import { useParams } from 'next/navigation';

export type Locale = 'ar' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = (
  process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES ?? 'ar,en'
).split(',').map(s=>s.trim().toLowerCase()).filter(Boolean) as Locale[];

export function normalizeLocale(x?: string): Locale {
  return (x||'').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function t(v?: {ar?:string; en?:string} | string, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v[locale] || v.en || v.ar || '';
}

// Legacy alias
export const tx = t;

export function localizeField(value: any, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[locale] || value.en || value.ar || Object.values(value)[0] || '';
  }
  return String(value);
}