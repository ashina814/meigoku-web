import { parsePublicSiteUrl, resolveRobots } from "../lib/public-site-config";

const siteUrl = parsePublicSiteUrl(import.meta.env.PUBLIC_SITE_URL);
const indexable = import.meta.env.PUBLIC_SITE_INDEXABLE === "true";

export const siteConfig = {
  name: "冥獄城",
  defaultTitle: "冥獄城",
  defaultDescription: "冥獄城は、通話と交流を中心に、身分制度・役職・Land経済・複数の交流空間を持つDiscordコミュニティです。",
  defaultOgImage: "/og-default.png",
  // Only a validated, stable public HTTPS origin may be used for metadata.
  siteUrl,
  // A string copy keeps the public configuration safe for browser-side consumers.
  publicSiteUrl: siteUrl?.origin,
  // Indexing is never enabled without a valid stable public origin.
  robots: resolveRobots(indexable, siteUrl)
} as const;
