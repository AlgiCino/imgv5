export function makeProjectHref(locale: string, developer: string, slug: string) {
  return { pathname: `/${locale}/projects/${developer}/${slug}` } as const;
}