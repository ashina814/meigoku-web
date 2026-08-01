// @ts-nocheck -- this Node verification script runs through tsx without Node typings in Astro's checker.
import { readFile } from "node:fs/promises";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "originless" && mode !== "pages-verification") {
  throw new Error("Usage: verify-built-public-metadata.ts <originless|pages-verification>");
}

const ok = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const root = process.cwd();
const output = (...segments: string[]) => path.join(root, "dist", ...segments);
const officialDescription = "冥獄城は、通話と交流を中心に、身分制度・役職・Land経済・複数の交流空間を持つDiscordコミュニティです。";
const oldPlaceholder = "【公開原稿確認中】";
const [index, join, tenka, notFound, robots, headers, sourceHeaders] = await Promise.all([
  readFile(output("index.html"), "utf8"),
  readFile(output("join", "index.html"), "utf8"),
  readFile(output("soul-reading", "result", "tenka", "index.html"), "utf8"),
  readFile(output("404.html"), "utf8"),
  readFile(output("robots.txt"), "utf8"),
  readFile(output("_headers"), "utf8"),
  readFile(path.join(root, "public", "_headers"), "utf8")
]);

const pages = [index, join, tenka, notFound];
pages.forEach((page, indexNumber) => {
  ok(page.includes('<meta name="robots" content="noindex, nofollow">'), `Page ${indexNumber} must remain noindex.`);
  ok(!page.includes(oldPlaceholder), `Page ${indexNumber} must not emit the old placeholder.`);
});
ok(notFound.includes(`<meta name="description" content="${officialDescription}">`), "The default description must be emitted by a page that uses it.");
ok(robots === "User-agent: *\nDisallow: /\n", "Verification robots.txt must disallow crawling.");
ok(headers === sourceHeaders, "Cloudflare _headers must be copied to dist unchanged.");

const origin = "https://meigoku-web.pages.dev";
if (mode === "originless") {
  pages.forEach((page, indexNumber) => {
    ok(!page.includes('rel="canonical"'), `Origin-less page ${indexNumber} must not emit a canonical URL.`);
    ok(!page.includes('property="og:url"'), `Origin-less page ${indexNumber} must not emit og:url.`);
    ok(!page.includes('property="og:image"'), `Origin-less page ${indexNumber} must not emit an absolute OGP image.`);
    ok(!page.includes('name="twitter:image"'), `Origin-less page ${indexNumber} must not emit an absolute Twitter image.`);
  });
} else {
  const expectMetadata = (page: string, pagePath: string, imagePath: string, name: string) => {
    const url = `${origin}${pagePath}`;
    const image = `${origin}${imagePath}`;
    ok(page.includes(`<link rel="canonical" href="${url}">`), `${name} must emit an absolute canonical URL.`);
    ok(page.includes(`<meta property="og:url" content="${url}">`), `${name} must emit an absolute og:url.`);
    ok(page.includes(`<meta property="og:image" content="${image}">`), `${name} must emit an absolute PNG OGP image.`);
    ok(page.includes(`<meta name="twitter:image" content="${image}">`), `${name} must emit an absolute PNG Twitter image.`);
  };

  expectMetadata(index, "/", "/og-default.png", "index");
  expectMetadata(join, "/join", "/og-default.png", "join");
  expectMetadata(tenka, "/soul-reading/result/tenka", "/images/diagnosis/og/og-soul-tenka.png", "tenka result");
}

console.log(`Built public metadata verification passed: ${mode}.`);
