#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const companies = ['damac', 'emaar', 'nakheel', 'sobha'];
const dataDir = path.join(__dirname, '../public/data');

function fixCompanyManifest(company) {
  console.log(`\nFixing manifest for ${company}...`);
  
  const companyDir = path.join(dataDir, company);
  if (!fs.existsSync(companyDir)) {
    console.warn(`⚠️  Company directory not found: ${companyDir}`);
    return;
  }

  const manifestPath = path.join(companyDir, 'projectManifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.log(`  ℹ️  No manifest found for ${company}`);
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Filter out string entries and keep only objects with slug and projectName
    const fixedManifest = manifest
      .filter(item => typeof item === 'object' && item !== null && item.slug)
      .map(item => ({
        slug: item.slug,
        projectName: item.projectName || item.slug
      }));

    // Remove duplicates based on slug
    const uniqueManifest = [];
    const seenSlugs = new Set();
    
    for (const item of fixedManifest) {
      if (!seenSlugs.has(item.slug)) {
        seenSlugs.add(item.slug);
        uniqueManifest.push(item);
      }
    }

    // Write fixed manifest
    fs.writeFileSync(manifestPath, JSON.stringify(uniqueManifest, null, 2));
    console.log(`  ✅ Fixed manifest: ${uniqueManifest.length} projects`);
    
  } catch (e) {
    console.warn(`  ⚠️  Error fixing manifest for ${company}:`, e.message);
  }
}

// Process each company
console.log('🔧 Fixing project manifests...\n');

for (const company of companies) {
  fixCompanyManifest(company);
}

console.log(`\n✅ Manifest fixing completed!`);
