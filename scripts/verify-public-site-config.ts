// @ts-nocheck -- this Node verification script runs through tsx without Node typings in Astro's checker.
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { parsePublicSiteUrl, resolveRobots } from "../src/lib/public-site-config";

const ok = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const expectedOrigin = "https://meigoku-web.pages.dev";
const valid = parsePublicSiteUrl(expectedOrigin);
ok(valid?.href === `${expectedOrigin}/`, "A HTTPS root origin must be accepted and normalized.");

[
  "http://meigoku-web.pages.dev",
  "javascript:alert(1)",
  "https://user:password@meigoku-web.pages.dev",
  "https://meigoku-web.pages.dev/path",
  "https://meigoku-web.pages.dev/?query=1",
  "https://meigoku-web.pages.dev/#fragment"
].forEach((raw) => ok(!parsePublicSiteUrl(raw), `Invalid public URL must be rejected: ${raw}`));

ok(!parsePublicSiteUrl(), "An omitted public URL must fall back safely.");
ok(resolveRobots(true, valid) === "index, follow", "A valid indexable origin may enable indexing.");
ok(resolveRobots(false, valid) === "noindex, nofollow", "A non-indexable deployment must remain noindex.");
ok(resolveRobots(true, undefined) === "noindex, nofollow", "Indexing requires a valid public origin.");
ok(resolveRobots(false, undefined) === "noindex, nofollow", "An origin-less site must remain noindex.");

const root = process.cwd();
const [site, rawHeaders, envExample, deploymentDoc] = await Promise.all([
  readFile(path.join(root, "src", "data", "site.ts"), "utf8"),
  readFile(path.join(root, "public", "_headers"), "utf8"),
  readFile(path.join(root, ".env.example"), "utf8"),
  readFile(path.join(root, "docs", "deployment-cloudflare-pages.md"), "utf8")
]);
const headers = rawHeaders.replace(/\r\n/g, "\n");
const defaultOgImage = path.join(root, "public", "og-default.png");
await access(defaultOgImage);
const defaultOgMetadata = await sharp(defaultOgImage).metadata();
const officialDescription = "冥獄城は、通話と交流を中心に、身分制度・役職・Land経済・複数の交流空間を持つDiscordコミュニティです。";

ok(!site.includes("【公開原稿確認中】"), "The old placeholder description must not remain in site metadata.");
ok(site.includes(`defaultDescription: "${officialDescription}"`), "Site metadata must exactly match the approved public description.");
ok(site.includes('defaultOgImage: "/og-default.png"'), "General pages must use the default PNG OGP image.");
ok(defaultOgMetadata.format === "png", "The default OGP asset must be a PNG.");
ok(defaultOgMetadata.width === 1200 && defaultOgMetadata.height === 630, "The default OGP PNG must be 1200×630.");
ok(headers.includes("https://meigoku-web.pages.dev/*\n  X-Robots-Tag: noindex, nofollow"), "pages.dev production must be noindex.");
ok(headers.includes("https://:version.meigoku-web.pages.dev/*\n  X-Robots-Tag: noindex, nofollow"), "pages.dev previews must be noindex.");
["X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin", "X-Frame-Options: DENY", "Permissions-Policy: camera=(), microphone=(), geolocation=()"].forEach((header) => ok(headers.includes(header), `Missing required security header: ${header}`));
ok(!headers.includes("Content-Security-Policy"), "CSP must not be introduced in this change.");
ok(envExample.includes("PUBLIC_SITE_URL=https://meigoku-web.pages.dev") && envExample.includes("PUBLIC_SITE_INDEXABLE=false"), ".env.example must document the verification configuration.");
ok(deploymentDoc.includes("PUBLIC_SITE_URL=https://meigoku-web.pages.dev") && deploymentDoc.includes("PUBLIC_SITE_INDEXABLE=false"), "Cloudflare Pages configuration must be documented.");

console.log("Public site configuration verification passed.");
