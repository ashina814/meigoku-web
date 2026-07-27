import { siteConfig } from "../data/site";

export function createPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${siteConfig.name}` : siteConfig.defaultTitle;
}

export function createCanonicalUrl(pathname: string): URL | undefined {
  return siteConfig.siteUrl ? new URL(pathname, siteConfig.siteUrl) : undefined;
}
