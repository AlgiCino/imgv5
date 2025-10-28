#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const companies = ['damac', 'emaar', 'nakheel', 'sobha'];
const dataDir = path.join(__dirname, '../public/data');

let totalFilesMoved = 0;
let totalDirsDeleted = 0;
let totalWarnings = 0;

function flattenCompanyData(company) {
  console.log(`\nProcessing ${company}...`);
  
  const companyDir = path.join(dataDir, company);
  if (!fs.existsSync(companyDir)) {
      console.warn(`⚠️  Company directory not found: ${companyDir}`);
      return;
  }

  const manifestPath = path.join(companyDir, 'projectManifest.json');
  let manifest = [];
  const slugSet = new Set();

  // Read existing manifest if it exists
  if (fs.existsSync(manifestPath)) {
      try {
          manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          // Build slug set from existing manifest
          manifest.forEach(item => slugSet.add(item.slug));
      } catch (e) {
          console.warn(`⚠️  Could not parse existing manifest for ${company}:`, e.message);
      }
  }

  const entries = fs.readdirSync(companyDir, { withFileTypes: true });
  
  for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '.' && entry.name !== '..' && entry.name !== '_chunks') {
          const projectDir = path.join(companyDir, entry.name);
          
          // Look for JSON files in this directory
          const jsonFiles = fs.readdirSync(projectDir)
              .filter(file => file.endsWith('.json') && file !== 'projectManifest.json');
          
          for (const jsonFile of jsonFiles) {
              const jsonPath = path.join(projectDir, jsonFile);
              const slug = path.parse(jsonFile).name;
              
              // Check for slug conflicts
              if (slugSet.has(slug)) {
                  console.warn(`⚠️  SLUG CONFLICT: ${slug} already exists in ${company} manifest!`);
                  console.warn(`   Conflicting files: ${jsonPath} and existing entry`);
                  totalWarnings++;
                  continue;
              }
              
              // Read and validate JSON
              try {
                  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                  
                  // Ensure slug matches filename
                  if (Array.isArray(jsonData) && jsonData.length > 0) {
                      jsonData[0].slug = slug;
                  } else if (jsonData && typeof jsonData === 'object') {
                      jsonData.slug = slug;
                  }
                  
                  // Ensure projectName exists (English)
                  let projectName = '';
                  if (Array.isArray(jsonData) && jsonData.length > 0) {
                      projectName = typeof jsonData[0].projectName === 'string' 
                          ? jsonData[0].projectName 
                          : jsonData[0].projectName?.en || slug;
                  } else if (jsonData && typeof jsonData === 'object') {
                      projectName = typeof jsonData.projectName === 'string' 
                          ? jsonData.projectName 
                          : jsonData.projectName?.en || slug;
                  }
                  
                  // Move file to company directory
                  const targetPath = path.join(companyDir, `${slug}.json`);
                  fs.renameSync(jsonPath, targetPath);
                  console.log(`  ✅ Moved: ${entry.name}/${jsonFile} → ${slug}.json`);
                  
                  // Add to manifest
                  manifest.push({
                      slug: slug,
                      projectName: projectName
                  });
                  slugSet.add(slug);
                  totalFilesMoved++;
                  
              } catch (e) {
                  console.warn(`  ⚠️  Error processing ${jsonPath}:`, e.message);
                  totalWarnings++;
              }
          }
          
          // Remove empty directory
          try {
              const remainingFiles = fs.readdirSync(projectDir);
              if (remainingFiles.length === 0) {
                  fs.rmdirSync(projectDir);
                  console.log(`  🗑️  Deleted empty directory: ${entry.name}`);
                  totalDirsDeleted++;
              }
          } catch (e) {
              console.warn(`  ⚠️  Could not delete directory ${projectDir}:`, e.message);
          }
      }
  }
  
  // Write updated manifest
  try {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`  💾 Updated manifest: ${manifest.length} projects`);
  } catch (e) {
      console.warn(`  ⚠️  Could not write manifest for ${company}:`, e.message);
  }
}

// Process each company
console.log('🚀 Starting data flattening process...\n');

for (const company of companies) {
  flattenCompanyData(company);
}

console.log(`\n📊 SUMMARY:`);
console.log(`   Files moved: ${totalFilesMoved}`);
console.log(`   Directories deleted: ${totalDirsDeleted}`);
console.log(`   Warnings: ${totalWarnings}`);

if (totalWarnings > 0) {
  console.log(`\n⚠️  ${totalWarnings} warnings encountered. Please check the output above.`);
  process.exit(1);
} else {
  console.log(`\n✅ Data flattening completed successfully!`);
  process.exit(0);
}
