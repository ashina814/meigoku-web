import { siteConfig } from "../data/site";

export function createPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${siteConfig.name}` : siteConfig.defaultTitle;
}

export function createCanonicalUrl(pathname: string): URL | undefined {
  if (!siteConfig.siteUrl) return undefined;
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return new URL(canonicalPath, siteConfig.siteUrl);
}
