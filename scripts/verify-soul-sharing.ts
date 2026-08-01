// @ts-nocheck -- this Node verification script runs through tsx without Node typings in Astro's checker.
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { soulResultTypes } from "../src/data/soul-results";
import { createSoulResultPath, createSoulResultUrl, createSoulShareText, createSoulShareTitle } from "../src/lib/soul-share";

const ok = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const root = process.cwd();
const ids = soulResultTypes.map((soul) => soul.id);

ok(soulResultTypes.length === 8, "Eight shared soul result pages must exist.");
ok(new Set(ids).size === 8, "Soul result IDs must be unique.");

for (const soul of soulResultTypes) {
  ok(Boolean(soul.name && soul.latin && soul.line && soul.first), `${soul.id} needs its formal result copy.`);
  ok(soul.body.length === 2 && soul.body.every(Boolean), `${soul.id} needs exactly two result paragraphs.`);
  const route = createSoulResultPath(soul.id);
  ok(route === `/soul-reading/result/${soul.id}`, `${soul.id} must use its fixed result route.`);
  ok(!/[?#]/.test(route) && !/(answers|scores|secondary)/.test(route), `${soul.id} route must not carry personal reading data.`);
  ok(createSoulShareTitle(soul).includes(soul.name), `${soul.id} share title must include its soul name.`);
  ok(createSoulShareText(soul).includes(soul.line), `${soul.id} share text must include its formal one-line copy.`);
  ok(createSoulResultUrl(soul.id, "https://example.invalid").endsWith(route), `${soul.id} share URL must only contain the fixed route.`);
  const imagePath = path.join(root, "public", "images", "diagnosis", "og", `og-soul-${soul.id}.png`);
  await access(imagePath);
  const metadata = await sharp(imagePath).metadata();
  ok(metadata.width === 1200 && metadata.height === 630, `${soul.id} OGP image must be 1200×630.`);
}

ok(!ids.includes("invalid" as (typeof ids)[number]), "Invalid IDs must not become generated result pages.");
const layout = await readFile(path.join(root, "src", "layouts", "BaseLayout.astro"), "utf8");
ok(layout.includes("ogImage = siteConfig.defaultOgImage"), "BaseLayout must retain its default OGP image.");
ok(layout.includes("og:image:width") && layout.includes("twitter:image:alt"), "BaseLayout must support per-page OGP metadata.");

console.log("Soul-sharing verification passed.");
