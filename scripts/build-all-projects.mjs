/**
 * Build a unified projects list from /public/data/* developer folders.
 * Output: /public/data/all_projects.json
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataRoot = path.join(root, 'public', 'data');
const outFile = path.join(dataRoot, 'all_projects.json');

function isDir(p){ try{ return fs.statSync(p).isDirectory(); }catch{ return false; } }
function isJson(p){ return p.toLowerCase().endsWith('.json'); }

function readJsonSafe(file){
  try{ const content = fs.readFileSync(file,'utf-8'); const j = JSON.parse(content); return Array.isArray(j)? j : [j]; }catch{ return []; }
}

function slugify(input){
  const base = (input||'').toString()
    .replace(/\.[^.]+$/, '')
    .replace(/[_\s]+/g,'-')
    .replace(/[^a-zA-Z0-9-]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-|-$/g,'')
    .toLowerCase();
  return base || 'project';
}

function pick(obj, keys){
  for(const k of keys){
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function toTitleCase(s){ return (s||'').toString().replace(/[-_]/g,' ').replace(/\b\w/g, c=>c.toUpperCase()).trim(); }

function collect(){
  const results = [];
  const devDirs = fs.readdirSync(dataRoot).map(name=> path.join(dataRoot, name)).filter(isDir);
  for(const dir of devDirs){
    const developer = toTitleCase(path.basename(dir));
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for(const e of entries){
      if (e.isFile() && isJson(e.name)){
        const items = readJsonSafe(path.join(dir, e.name));
        for(const p of items){
          const title = pick(p, ['projectName','title','name']);
          const videoLink = pick(p, ['videoLink','video','heroVideo']);
          const image = pick(p, ['image','heroImage','poster','thumbnail']);
          const price = pick(p, ['startingPrice','minPriceAED','price']);
          const bedrooms = pick(p, ['bedrooms']);
          const baseSlug = typeof p?.slug === 'string' && p.slug ? p.slug : (typeof title === 'string' ? title : e.name);
          const slug = slugify(baseSlug);
          results.push({ developer, slug, title, videoLink, image, price, bedrooms });
        }
      } else if (e.isDirectory()){
        const subdir = path.join(dir, e.name);
        const files = fs.readdirSync(subdir).filter(f=>isJson(f));
        for(const f of files){
          const items = readJsonSafe(path.join(subdir, f));
          for(const p of items){
            const title = pick(p, ['projectName','title','name']);
            const videoLink = pick(p, ['videoLink','video','heroVideo']);
            const image = pick(p, ['image','heroImage','poster','thumbnail']);
            const price = pick(p, ['startingPrice','minPriceAED','price']);
            const bedrooms = pick(p, ['bedrooms']);
            const baseSlug = typeof p?.slug === 'string' && p.slug ? p.slug : (typeof title === 'string' ? title : f);
            const slug = slugify(baseSlug);
            results.push({ developer, slug, title, videoLink, image, price, bedrooms });
          }
        }
      }
    }
  }
  return results;
}

function main(){
  if (!fs.existsSync(dataRoot)){
    console.error(`Data root not found: ${dataRoot}`);
    process.exit(1);
  }
  const all = collect();
  fs.writeFileSync(outFile, JSON.stringify(all, null, 2));
  console.log(`✅ Wrote ${all.length} projects to ${path.relative(root, outFile)}`);
}

main();

