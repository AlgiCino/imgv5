# Imperium Gate Real Estate — Next.js 14 (App Router)

- لغتان: **ar / en** (العربية افتراضية).
- واجهة فاخرة (ذهبي/أسود/أبيض) + حركات Framer Motion.
- كل الوسائط داخل التطبيق (صور/فيديو/PDF/3D/خرائط) عبر Proxy داخلي.
- تحميل ديناميكي آمن لملفات **/public/data/** (يتجاهل JSON الفاسد).

## تشغيل

```bash
npm install
npm run dev
# إنتاج:
npm run build
npm start
```

## البنية
- `app/[locale]/projects/[developer]/[slug]/page.tsx`: صفحة المشروع الكاملة.
- `app/api/proxy/file/route.ts`: ممرّ لعرض الصور/الفيديو/PDF داخل نطاقك.
- `lib/unifiedDataService.ts`: تحميل كل JSON في `public/data/*/*/*.json` وإضافة اسم المطوّر من المسار.
- `components/project/*`: أقسام الصفحة.
- `components/ui/Modal.tsx`: مودال داخلي.
- `app/[locale]/admin/page.tsx`: لوحة إدارة بسيطة (إحصاءات + تحديث + رفع JSON في التطوير).

## .env.example

```env
OPENROUTER_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_SITE_URL=https://imperiumgate.com
```

ضع مفاتيحك في `.env.local`.

## مثال JSON
راجع `public/data/damac/altitude-de-grisogono/altitude-de-grisogono.json`.
