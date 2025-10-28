#!/usr/bin/env node
/**
 * Imperium Gate – CSV -> JSON per-developer + projectManifest.json
 *
 * Usage:
 *   node scripts/ingest-projects-csv.mjs --input public/data/projects.csv [--outdir public/data] [--company em a ar|damac|nakheel|sobha] [--dry]
 *
 * ملاحظات:
 * - لا يعتمد على أي حزم خارجية (بارسر CSV مُضمّن).
 * - يطبّع الحقول (أسعار/مساحات أرقام، Bedrooms/PropertyTypes قوائم…)
 * - ينشئ ملف JSON لكل مشروع تحت public/data/<developer>/<slug>.json
 * - يُحدّث public/data/<developer>/projectManifest.json
 * - يحذف روابط 3D على sobha.cloud التي بلا ساب-دومين (مثال: https://sobha.cloud/… تُحذف، أما https://hartland2.sobha.cloud تُبقى)
 * - الأرقام دائمًا لاتينية. أسماء المشاريع تُحفظ بالإنجليزية وأيضًا العربية إن وُجدت.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const arg = (name, def = undefined) => {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return (v && !v.startsWith('--')) ? v : true;
};

const INPUT  = arg('--input', 'public/data/projects.csv');
const OUTDIR = arg('--outdir', 'public/data');
const ONLY   = arg('--company', null); // em a ar|damac|nakheel|sobha
const DRY    = !!arg('--dry', false);

const VALID_DEVS = new Set(['emaar','damac','nakheel','sobha']);

const ensureDir = p => fs.mkdirSync(p, { recursive: true });

function parseNumber(v) {
  if (v == null) return undefined;
  if (typeof v !== 'string') return Number(v);
  const n = v.replace(/[^\d.]/g, '');
  if (!n) return undefined;
  const num = Number(n);
  return Number.isFinite(num) ? num : undefined;
}

function slugify(enName, fallback = '') {
  const src = (enName || fallback || '').toString().trim().toLowerCase();
  return src
    .normalize('NFKD')
    .replace(/[^a-z0-9\s\-_/]/g, '')
    .replace(/[\s/_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** very small RFC4180-ish CSV parser (handles quotes, commas, newlines) */
function parseCSV(text) {
  const rows = [];
  let row = [], val = '';
  let i = 0, inQuotes = false;

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i+1] === '"') { val += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      val += c; i++; continue;
    }

    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(val); val = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(val); rows.push(row); row = []; val = ''; i++; continue; }

    val += c; i++;
  }
  row.push(val);
  rows.push(row);
  return rows;
}

function toArrayList(s) {
  if (!s) return [];
  return s
    .split(/[|,/;]+/).map(x => x.trim()).filter(Boolean);
}

function normalizeBedrooms(s) {
  // e.g. "Studio, 1BR, 2BR, 3BR" -> ["Studio",1,2,3]
  const out = [];
  for (const token of toArrayList(s)) {
    const m = token.match(/(\d+)/);
    if (/studio/i.test(token)) out.push('Studio');
    else if (m) out.push(Number(m[1]));
  }
  return out;
}

function normalizePropertyTypes(s) {
  const map = {
    apartment:'Apartment', apts:'Apartment', flat:'Apartment',
    villa:'Villa',
    townhouse:'Townhouse', th:'Townhouse',
    penthouse:'Penthouse', ph:'Penthouse',
    plot:'Plot',
    duplex:'Duplex',
    loft:'Loft',
  };
  const out = new Set();
  for (const token of toArrayList(s)) {
    const key = token.toLowerCase();
    out.add(map[key] || (token.charAt(0).toUpperCase()+token.slice(1)));
  }
  return Array.from(out);
}

function valid3DLink(url) {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const u = new URL(url);
    // قاعدة sobha.cloud: لا نحتفظ إن كانت الضيافة = sobha.cloud بلا ساب-دومين
    if (u.hostname.toLowerCase() === 'sobha.cloud') return false;
    return true;
  } catch { return false; }
}

function normalizeDeveloper(brand) {
  if (!brand) return undefined;
  const s = brand.toString().trim().toLowerCase();
  if (/emaar/.test(s)) return 'emaar';
  if (/damac/.test(s)) return 'damac';
  if (/nakheel/.test(s)) return 'nakheel';
  if (/sobha/.test(s)) return 'sobha';
  return undefined;
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj[k] != null && obj[k] !== '') out[k] = obj[k];
  return out;
}

function readCSV(filepath) {
  if (!fs.existsSync(filepath)) {
    console.error(`❌ Input not found: ${filepath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filepath, 'utf8');
  const rows = parseCSV(raw);
  if (!rows.length) {
    console.error('❌ CSV is empty');
    process.exit(1);
  }
  let header = rows[0];
  // تحذير: أحيانًا يكون في أول صف عنوان زائد (مثل projects_dedup_253)
  if (header.length === 1 && rows.length > 1) {
    // هذا نمط غير متوقّع — نستمر عادي
  }
  // اكتشاف صف عنوان زائد بوضوح
  if (header.length === 1 && /projects_dedup/i.test(header[0])) {
    // اسقطه وخذ الصف التالي كـ header
    header = rows[1];
    rows.splice(0, 2);
  } else {
    rows.splice(0, 1);
  }

  const items = rows.map((cols, idx) => {
    const row = {};
    header.forEach((h, i) => { row[h.trim()] = (cols[i] ?? '').trim(); });
    row.__row = idx+2; // رقم الصف التقريبي بعد العنوان
    return row;
  });
  return items;
}

function asNumberOrUndef(v) {
  const n = parseNumber(v);
  return n != null ? n : undefined;
}

function uniqueSlug(baseSlug, developerDir) {
  let s = baseSlug || 'project';
  let n = 1;
  while (fs.existsSync(path.join(developerDir, `${s}.json`))) {
    n++;
    s = `${baseSlug}-${n}`;
  }
  return s;
}

function buildProjectJSON(row) {
  // خرائط أعمدة CSV الشائعة
  const enName   = row['Project (EN)'] || row['Project'] || row['Name (EN)'] || row['Display Name'] || '';
  const arName   = row['Project (AR)'] || row['Arabic Name'] || '';
  const brand    = row['Brand'] || row['Developer'] || '';
  const slugCSV  = row['Slug'] || row['slug'] || '';
  const cityEn   = row['City (EN)'] || row['City'] || '';
  const areaEn   = row['Area (EN)'] || row['Area'] || '';
  const statusEn = row['Status (EN)'] || row['Status'] || '';
  const bedrooms = row['Bedrooms'] || '';
  const types    = row['Property Types'] || '';
  const minPrice = row['Min Price (AED)'] || row['MinPriceAED'] || '';
  const maxPrice = row['Max Price (AED)'] || row['MaxPriceAED'] || '';
  const minSqft  = row['Min Area (sqft)'] || row['MinAreaSqft'] || '';
  const maxSqft  = row['Max Area (sqft)'] || row['MaxAreaSqft'] || '';
  const handover = row['Delivery'] || row['Handover'] || '';
  const extLink  = row['Project Link'] || row['Link'] || '';
  const brochure = row['Brochure'] || row['Brochure PDF'] || '';
  const video    = row['Video'] || '';
  const tour3d   = row['3D Tour'] || '';
  const latCol   = row['lat'] || row['Lat'] || row['coords_lat'] || '';
  const lonCol   = row['lon'] || row['Lng'] || row['coords_lon'] || '';
  const dev = normalizeDeveloper(brand);

  return {
    id: slugCSV || slugify(enName),
    slug: slugCSV || slugify(enName),
    developer: dev,
    projectName: { en: enName || '', ar: arName || undefined },
    city: { en: cityEn || '' },
    area: { en: areaEn || '' },
    status: statusEn ? statusEn.toLowerCase() : undefined, // سنُطبّع لاحقًا إن لزم
    bedrooms: normalizeBedrooms(bedrooms),
    propertyTypes: normalizePropertyTypes(types),
    minPriceAED: asNumberOrUndef(minPrice),
    maxPriceAED: asNumberOrUndef(maxPrice),
    minAreaSqft: asNumberOrUndef(minSqft),
    maxAreaSqft: asNumberOrUndef(maxSqft),
    handover: handover || undefined,
    externalLink: extLink || undefined,
    brochurePdfLink: brochure && /\.pdf(\?|$)/i.test(brochure) ? brochure : undefined,
    videoLinks: toArrayList(video).filter(u => /^https?:\/\//i.test(u)),
    tour3DLinks: toArrayList(tour3d).filter(u => {
      if (!/^https?:\/\//i.test(u)) return false;
      try { return valid3DLink(u); } catch { return false; }
    }),
    // مكان لإضافة حقول لاحقًا (amenities/highlights/paymentPlan/galleryImages…)
    coords: (latCol || lonCol)
      ? [Number(latCol) || undefined, Number(lonCol) || undefined]
      : undefined,
    sourceRow: row.__row,
  };
}

function writeJSON(p, data) {
  if (DRY) return;
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function main() {
  console.log(`→ Reading CSV: ${INPUT}`);
  const rows = readCSV(INPUT);
  console.log(`→ Rows: ${rows.length}`);

  const perDev = { emar:0, emaar:0, damac:0, nakheel:0, sobha:0, skipped:0 };
  const manifests = { emaar:[], damac:[], nakheel:[], sobha:[] };
  const warnings = [];

  for (const row of rows) {
    const pj = buildProjectJSON(row);
    if (!pj.developer || !VALID_DEVS.has(pj.developer)) {
      perDev.skipped++; continue;
    }
    if (ONLY && pj.developer !== ONLY) { perDev.skipped++; continue; }

    const devDir = path.join(OUTDIR, pj.developer);
    ensureDir(devDir);

    // slug & filename
    let s = slugify(pj.slug || pj.projectName?.en || pj.id);
    if (!s) {
      warnings.push(`Row ${pj.sourceRow}: missing slug/name -> skipped`);
      perDev.skipped++; continue;
    }
    s = uniqueSlug(s, devDir);
    pj.slug = s;
    pj.id   = pj.id || s;

    // enforce phone/whatsapp
    pj.whatsapp = '+971556628972';
    pj.phone    = '+971556628972';

    // remove bad sobha.cloud 3D (already filtered), keep others as-is

    // write file
    const outPath = path.join(devDir, `${s}.json`);
    writeJSON(outPath, pj);

    // manifest
    manifests[pj.developer].push({
      slug: pj.slug,
      projectName: pj.projectName?.en || pj.slug
    });

    perDev[pj.developer] = (perDev[pj.developer] || 0) + 1;
  }

  // write manifests
  for (const dev of ['emaar','damac','nakheel','sobha']) {
    const mPath = path.join(OUTDIR, dev, 'projectManifest.json');
    // sort by name asc
    const sorted = manifests[dev].sort((a,b)=>a.projectName.localeCompare(b.projectName));
    writeJSON(mPath, sorted);
  }

  // report
  console.log('\n=== SUMMARY ===');
  console.table({
    emaar: perDev.emaar,
    damac: perDev.damac,
    nakheel: perDev.nakheel,
    sobha: perDev.sobha,
    skipped: perDev.skipped
  });
  if (warnings.length) {
    console.log('\nWARNINGS:');
    for (const w of warnings) console.log(' - ' + w);
  }
  console.log('\nDone.');
}

main();