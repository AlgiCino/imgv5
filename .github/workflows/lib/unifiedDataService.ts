// lib/unifiedDataService.ts
import type { Project } from './types';
import fs from 'fs';
import path from 'path';

function slugify(input: string): string {
  const base = (input || '').toString()
    .replace(/\.[^.]+$/, '') // drop extension
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return base || 'project';
}

function generateSlug(p: any, filename: string): string {
  if (typeof p?.slug === 'string' && p.slug.trim()) {
    return slugify(p.slug.trim());
  }
  const name = typeof p?.projectName === 'string'
    ? p.projectName
    : (typeof p?.projectName === 'object' ? (p.projectName.en || p.projectName.ar || '') : '');
  if (name && name.trim()) {
    return slugify(name.trim());
  }
  return slugify(filename);
}

// Server-only cache
let cachedProjects: Project[] | null = null;

function readJSONFile(filePath: string): any[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    if (Array.isArray(json)) return json;
    return [json];
  } catch {
    return [];
  }
}

function loadFromDeveloperDir(developerDir: string, developerName: string): Project[] {
  const results: Project[] = [];
  const entries = fs.readdirSync(developerDir, { withFileTypes: true });
  for (const entry of entries) {
    try {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        const filePath = path.join(developerDir, entry.name);
        const items = readJSONFile(filePath);
        items.forEach((p: any) => {
          const slug = generateSlug(p, entry.name);
          results.push({ ...p, developer: developerName, slug });
        });
      } else if (entry.isDirectory()) {
        const subdir = path.join(developerDir, entry.name);
        const canonical = path.join(subdir, `${entry.name}.json`);
        let items: any[] = [];
        if (fs.existsSync(canonical)) {
          items = readJSONFile(canonical);
        } else {
          const subentries = fs.readdirSync(subdir, { withFileTypes: true });
          for (const se of subentries) {
            if (se.isFile() && se.name.endsWith('.json')) {
              const fp = path.join(subdir, se.name);
              const read = readJSONFile(fp);
              read.forEach(p => {
                const slug = generateSlug(p, se.name);
                items.push({ ...p, slug });
              });
            }
          }
        }
        items.forEach((p: any) => {
          const slug = generateSlug(p, entry.name);
          results.push({ ...p, developer: developerName, slug });
        });
      }
    } catch {
      // Skip malformed files
    }
  }
  return results;
}

export async function loadAllProjects(): Promise<Project[]> {
  if (cachedProjects) return cachedProjects;
  const dataRoot = path.join(process.cwd(), 'public', 'data');
  const unifiedPath = path.join(dataRoot, 'all_projects.json');
  let projects: Project[] = [];

  // Prefer unified file if available
  try {
    if (fs.existsSync(unifiedPath)) {
      const unifiedItems = readJSONFile(unifiedPath) as any[];
      if (Array.isArray(unifiedItems) && unifiedItems.length > 0) {
        projects = unifiedItems as Project[];
        cachedProjects = normalizeProjects(projects);
        console.log(`✅ Loaded ${cachedProjects.length} projects from all_projects.json`);
        return cachedProjects;
      }
    }
  } catch {
    // Fall back to directory-based loading
  }

  // Fallback: read per-developer directories
  try {
    const devEntries = fs.readdirSync(dataRoot, { withFileTypes: true });
    for (const d of devEntries) {
      if (!d.isDirectory()) continue;
      const developerName = d.name;
      const developerDir = path.join(dataRoot, developerName);
      const items = loadFromDeveloperDir(developerDir, developerName);
      projects.push(...items);
    }
  } catch {
    // If directory missing or unreadable, leave projects empty
  }

  cachedProjects = normalizeProjects(projects);
  console.log(`✅ Loaded ${cachedProjects.length} projects from developer directories`);
  return cachedProjects;
}

// Normalize project data structure
function normalizeProjects(projects: any[]): Project[] {
  return projects.map(p => {
    const item: Project = { ...p };

    // Ensure slug exists
    if (!item.slug || typeof item.slug !== 'string' || !item.slug.trim()) {
      item.slug = generateSlug(item, (item as any)._sourceFile || 'project.json');
    }

    // Ensure projectName (used widely) exists; map from title if missing
    if (!item.projectName) {
      if (item.title !== undefined) {
        // title may be string or localized object; keep shape
        item.projectName = item.title as any;
      } else if (typeof (item as any).name === 'string') {
        item.projectName = (item as any).name;
      }
    }

    // Ensure heroImage exists; map from generic image field if available
    if (!item.heroImage && (item as any).image) {
      item.heroImage = (item as any).image as any;
    }
    
    // Normalize POIs (may be object with categories or array)
    if (item.mapPointsOfInterest) {
      if (Array.isArray(item.mapPointsOfInterest)) {
        // Already an array, just normalize the POI objects
        item.mapPointsOfInterest = item.mapPointsOfInterest.map((poi: any) => ({
          ...poi,
          category: typeof poi?.category === 'string' ? poi.category : undefined,
        }));
      } else if (typeof item.mapPointsOfInterest === 'object') {
        // Convert object with categories to array
        const poisArray: any[] = [];
        Object.entries(item.mapPointsOfInterest).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item: any) => {
              if (typeof item === 'string') {
                poisArray.push({
                  name: { en: item, ar: item },
                  category: category,
                  coordinates: null
                });
              } else if (typeof item === 'object') {
                poisArray.push({
                  ...item,
                  category: category
                });
              }
            });
          }
        });
        item.mapPointsOfInterest = poisArray;
      } else {
        // Fallback to empty array
        item.mapPointsOfInterest = [];
      }
    } else {
      // Ensure it's always an array
      item.mapPointsOfInterest = [];
    }
    
    // Normalize galleryImages to always be an array
    if (item.galleryImages) {
      if (typeof item.galleryImages === 'string') {
        // If it's a string, convert to empty array (placeholder text)
        item.galleryImages = [];
      } else if (!Array.isArray(item.galleryImages)) {
        // If it's not an array or string, default to empty array
        item.galleryImages = [];
      }
    } else {
      // Ensure it's always an array
      item.galleryImages = [];
    }
    
    // Normalize bedrooms - keep strings as-is, ensure arrays are arrays
    if (item.bedrooms !== undefined) {
      if (typeof item.bedrooms === 'string') {
        // Keep string as-is (already formatted)
      } else if (!Array.isArray(item.bedrooms)) {
        // If it's not an array or string, convert to undefined
        item.bedrooms = undefined;
      }
    }

    return item;
  });
}

export async function getProjectBySlug(dev: string, slug: string): Promise<Project | undefined> {
  const all = await loadAllProjects();
  return all.find(p => (p.developer === dev) && (p.slug === slug));
}

export async function getProjectsByDeveloper(dev: string): Promise<Project[]> {
  const allProjects = await loadAllProjects();
  return allProjects.filter(p => p.developer === dev);
}

export async function listDevelopers(): Promise<{ developer: string; count: number }[]> {
  const counts = new Map<string, number>();
  const allProjects = await loadAllProjects();
  for (const p of allProjects) {
    if (!p.developer) continue;
    counts.set(p.developer, (counts.get(p.developer) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([developer, count]) => ({ developer, count }));
}

// Server-only synchronous loader moved to a separate file to avoid
// bundling Node modules like 'fs' into client builds.
