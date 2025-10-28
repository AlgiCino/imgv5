// scripts/split-md-into-5.mjs
// Usage:
//   node scripts/split-md-into-5.mjs public/data/emaar.md public/data/emaar/_chunks 5
//
// يجزّئ Markdown إلى N أجزاء متقاربة الحجم حتى لو ما فيه عناوين H2.
// يحترم بلوكات الأكواد ``` .. ``` ولا يقسمها.

import fs from 'fs';
import path from 'path';

const input = process.argv[2] || 'public/data/emaar.md';
const outDir = process.argv[3] || 'public/data/emaar/_chunks';
const parts = Math.max(1, parseInt(process.argv[4] || '5', 10));

if (!fs.existsSync(input)) {
  console.error('Input MD not found:', input);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const raw = fs.readFileSync(input, 'utf8');

// 1) حوّل الملف إلى "بلوكات" آمنة: نفصل على سطر فارغ أو عنوان,
//    لكن لا نكسر بلوكات الأكواد الثلاثية.
const lines = raw.split(/\r?\n/);
let inFence = false;
let blocks = [];
let buff = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (/^\s*```/.test(line)) {
    // أضف السطر ثم بدّل حالة السور
    buff.push(line);
    inFence = !inFence;
    continue;
  }

  if (!inFence) {
    // بداية بلوك جديد عند عنوان أو سطر فارغ كبير
    if (/^#{1,6}\s+/.test(line)) {
      if (buff.length) {
        blocks.push(buff.join('\n'));
        buff = [];
      }
      buff.push(line);
      continue;
    }
    if (line.trim() === '' && buff.length > 0) {
      // نهاية منطقية لبلوك
      buff.push(line);
      blocks.push(buff.join('\n'));
      buff = [];
      continue;
    }
  }

  buff.push(line);
}
if (buff.length) blocks.push(buff.join('\n'));

// لو ما طلع ولا بلوك (نادر)، اعتبر الملف بلوك واحد
if (blocks.length === 0) blocks = [raw];

// 2) وزّع البلوكات على N أجزاء حسب الحجم الإجمالي
const totalChars = blocks.reduce((s, b) => s + b.length, 0);
const target = Math.ceil(totalChars / parts);

// تجميع جشِع: عبّي كل جزء حتى يقارب الهدف ثم انتقل
const buckets = Array.from({ length: parts }, () => []);
let i = 0, acc = 0;
for (const block of blocks) {
  if (acc >= target && i < parts - 1) {
    i++;
    acc = 0;
  }
  buckets[i].push(block);
  acc += block.length;
}

// تأكد أنه ما في جزء فاضي (انقل آخر بلوك من السابق إذا لزم)
for (let k = 0; k < buckets.length; k++) {
  if (buckets[k].length === 0 && k > 0) {
    const prev = buckets[k - 1];
    if (prev.length > 1) {
      buckets[k].push(prev.pop());
    }
  }
}

// 3) اكتب الأجزاء + فهرس
const index = [];
buckets.forEach((bucket, idx) => {
  const partNo = idx + 1;
  const file = path.join(outDir, `emaar.part-${String(partNo).padStart(2,'0')}.md`);
  const content = [
    `> Part ${partNo}/${parts} — Source: ${path.basename(input)}`,
    `> Size: ~${bucket.reduce((s,b)=>s+b.length,0)} chars`,
    `\n---\n`,
    bucket.join('\n')
  ].join('\n');
  fs.writeFileSync(file, content, 'utf8');
  index.push({
    part: partNo,
    file: file.replace(process.cwd() + '/', ''),
    approxSize: bucket.reduce((s,b)=>s+b.length,0)
  });
});

fs.writeFileSync(path.join(outDir, 'emaar.chunks.index.json'), JSON.stringify(index, null, 2));
console.log(`Split done → ${outDir}`);
console.table(index);