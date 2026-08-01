/**
 * Parses the one stable, public site origin that may be used in metadata.
 * Invalid configuration deliberately falls back to an origin-less, noindex site.
 */
export function parsePublicSiteUrl(raw?: string): URL | undefined {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    const isRootPath = url.pathname === "/";
    const hasCredentials = Boolean(url.username || url.password);

    if (url.protocol !== "https:" || hasCredentials || !isRootPath || url.search || url.hash) {
      return undefined;
    }

    return new URL(url.origin);
  } catch {
    return undefined;
  }
}

export function resolveRobots(indexable: boolean, siteUrl?: URL): "index, follow" | "noindex, nofollow" {
  return indexable && siteUrl ? "index, follow" : "noindex, nofollow";
}
