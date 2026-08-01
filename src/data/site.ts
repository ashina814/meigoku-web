import { parsePublicSiteUrl, resolveRobots } from "../lib/public-site-config";

const siteUrl = parsePublicSiteUrl(import.meta.env.PUBLIC_SITE_URL);
const indexable = import.meta.env.PUBLIC_SITE_INDEXABLE === "true";

export const siteConfig = {
  name: "冥獄城",
  defaultTitle: "冥獄城",
  defaultDescription: "冥獄城公式サイト。世界観と暮らし、居場所や活動の案内を通じて、Discordコミュニティ「冥獄城」を紹介します。",
  defaultOgImage: "/og-default.svg",
  // Only a validated, stable public HTTPS origin may be used for metadata.
  siteUrl,
  // A string copy keeps the public configuration safe for browser-side consumers.
  publicSiteUrl: siteUrl?.origin,
  // Indexing is never enabled without a valid stable public origin.
  robots: resolveRobots(indexable, siteUrl)
} as const;
