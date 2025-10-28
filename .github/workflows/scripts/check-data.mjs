// scripts/check-data.mjs
import fs from 'fs';
import path from 'path';
const dataRoot = path.join(process.cwd(),'public','data');

function walk(dir){
  return fs.readdirSync(dir).flatMap(n=>{
    const f = path.join(dir,n);
    const st = fs.statSync(f);
    return st.isDirectory()? walk(f): [f];
  });
}

if (!fs.existsSync(dataRoot)) {
  console.log('No public/data folder found.');
  process.exit(0);
}
const jsons = walk(dataRoot).filter(f=>f.endsWith('.json'));
let ok=0,bad=0;
for (const f of jsons){
  try { JSON.parse(fs.readFileSync(f,'utf-8')); ok++; }
  catch { console.error('Invalid JSON:', f); bad++; }
}
console.log(`Checked ${jsons.length} JSON files → valid: ${ok}, invalid: ${bad}`);
process.exit(bad?1:0);
