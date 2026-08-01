// @ts-nocheck -- this build-time asset generator runs through tsx without Node typings in Astro's checker.
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { soulResultTypes } from "../src/data/soul-results";

const root = process.cwd();
const outputDirectory = path.join(root, "public", "images", "diagnosis", "og");
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character]!);
const splitLine = (value: string, length = 16) => {
  const characters = [...value];
  return Array.from({ length: Math.ceil(characters.length / length) }, (_, index) => characters.slice(index * length, (index + 1) * length).join(""));
};

const createBase = (name: string, line: string) => {
  const lineNodes = splitLine(line).slice(0, 3).map((part, index) => `<text x="620" y="${350 + index * 48}" class="line">${escapeXml(part)}</text>`).join("");
  return Buffer.from(`<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#07060a"/><stop offset=".52" stop-color="#241015"/><stop offset="1" stop-color="#07060a"/></linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="70%"><stop stop-color="#b81f22" stop-opacity=".42"/><stop offset="1" stop-color="#07060a" stop-opacity="0"/></radialGradient>
      <pattern id="grain" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#ece7dd" fill-opacity=".12"/><circle cx="9" cy="6" r=".5" fill="#ece7dd" fill-opacity=".09"/></pattern>
      <style>.mono{font-family:'JetBrains Mono',monospace;font-size:18px;letter-spacing:4px;fill:#948d99}.name{font-family:'Shippori Mincho','Yu Mincho',serif;font-size:64px;font-weight:600;letter-spacing:9px;fill:#fff9ed}.line{font-family:'Noto Sans JP','Yu Gothic',sans-serif;font-size:28px;fill:#f3d79b}.small{font-family:'Noto Sans JP','Yu Gothic',sans-serif;font-size:18px;fill:#b6b0b8;letter-spacing:2px}</style>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#glow)"/><rect width="1200" height="630" fill="url(#grain)" opacity=".18"/>
    <path d="M520 74V556" stroke="#e0b26a" stroke-opacity=".42"/><path d="M570 74H1128V556H570" fill="none" stroke="#e0b26a" stroke-opacity=".28"/>
    <text x="620" y="120" class="mono">MEIGOKU CASTLE / SOUL READING</text><text x="620" y="205" class="small">魂の診断</text><text x="620" y="294" class="name">${escapeXml(name)}</text>${lineNodes}
    <text x="620" y="510" class="small">冥獄城公式サイト</text><text x="620" y="545" class="small">SOUL READING / SHARED RESULT</text>
  </svg>`);
};

await mkdir(outputDirectory, { recursive: true });
const castleCrest = await readFile(path.join(root, "public", "images", "brand", "crest", "crest-castle.svg"));

for (const soul of soulResultTypes) {
  const soulCrest = await readFile(path.join(root, "public", "images", "brand", "crest", `crest-${soul.id}.svg`));
  const [castle, crest] = await Promise.all([
    sharp(castleCrest).resize(126, 126).png().toBuffer(),
    sharp(soulCrest).resize(260, 260).png().toBuffer()
  ]);
  await sharp(createBase(soul.name, soul.line))
    .composite([{ input: castle, left: 88, top: 72 }, { input: crest, left: 168, top: 212 }])
    .png()
    .toFile(path.join(outputDirectory, `og-soul-${soul.id}.png`));
}

console.log("Generated eight soul result OGP images.");
