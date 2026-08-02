import { readFile } from "node:fs/promises";
import path from "node:path";
import { soulResultTypes } from "../src/data/soul-results";
import { axisMaximums, axes, soulQuestions } from "../src/data/soul-reading";
import { calculateSoulReading, rankSoulTypes, shouldShowMix } from "../src/lib/soul-reading";

const equal = (actual: unknown, expected: unknown, message: string) => { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`); };
const ok = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
equal(axisMaximums, { start: 18, pick: 17, read: 17, deep: 18, self: 16, roam: 16 }, "Axis maxima must come from the question definitions.");
const canonicalProfiles = {
  tenka: { start: 1, pick: .5, read: .25, deep: .25, self: .75, roam: .75 },
  kyomei: { start: .25, pick: 1, read: .5, deep: .75, self: .25, roam: .5 },
  shinen: { start: .25, pick: .75, read: .5, deep: 1, self: .5, roam: .25 },
  enka: { start: .5, pick: .75, read: .5, deep: .25, self: 1, roam: .75 },
  chouritsu: { start: .5, pick: .75, read: 1, deep: .5, self: .25, roam: .5 },
  yoimi: { start: .25, pick: .5, read: 1, deep: .75, self: .25, roam: .25 },
  junyu: { start: .5, pick: .5, read: .5, deep: .25, self: .5, roam: 1 },
  kokumei: { start: .5, pick: .25, read: .25, deep: .75, self: 1, roam: .5 }
};

for (const type of soulResultTypes) {
  equal(type.profile, canonicalProfiles[type.id], `${type.id} profile must match the canonical values.`);
  const answers = soulQuestions.map((question) => {
    const primary = question.options.findIndex((option) => option.primary === type.id);
    return primary >= 0 ? primary : question.options.findIndex((option) => option.secondary === type.id);
  });
  equal(calculateSoulReading(answers, ["social", "events"], ["social", "events"]).soul.id, type.id, `${type.id} representative answers must classify as ${type.id}.`);
}

const zeroScores = Object.fromEntries(soulResultTypes.map((type) => [type.id, 0])) as Record<(typeof soulResultTypes)[number]["id"], number>;
const zeroAxes = Object.fromEntries(axes.map((axis) => [axis, 0])) as Record<(typeof axes)[number], number>;
equal(rankSoulTypes({ ...zeroScores, tenka: 10, kyomei: 10 }, { ...zeroScores, tenka: 4, kyomei: 3 }, zeroAxes)[0].id, "tenka", "Primary-soul count must break a total-score tie.");
equal(rankSoulTypes({ ...zeroScores, tenka: 10, kyomei: 10 }, { ...zeroScores, tenka: 3, kyomei: 3 }, { start: .3, pick: 1, read: .6, deep: .5, self: .2, roam: .4 })[0].id, "kyomei", "rawNorm/profile distance must break an exact score and primary-count tie.");

const explicitOnly = calculateSoulReading([...Array(11).fill(-1), 1], ["social", "events"], ["social", "events"]);
equal(explicitOnly.easiest, ["少人数から始められる"], "Q12 explicit entry condition must always be shown.");
const inferredExtra = calculateSoulReading([...Array(11).fill(0), 1], ["social", "events"], ["social", "events"]);
ok(inferredExtra.easiest.includes("少人数から始められる") && inferredExtra.easiest.includes("自分から一言置いてよい"), "A Q1–Q11 tag repeated at least twice must add exactly one inferred condition.");

equal(shouldShowMix(10, 8), true, "A two-point result gap must show mix copy.");
equal(shouldShowMix(10, 7), false, "A three-point result gap must not show mix copy.");

const root = process.cwd();
const [world, home, join, readingApp] = await Promise.all([
  readFile(path.join(root, "src", "pages", "world.astro"), "utf8"),
  readFile(path.join(root, "src", "pages", "index.astro"), "utf8"),
  readFile(path.join(root, "src", "pages", "join.astro"), "utf8"),
  readFile(path.join(root, "src", "components", "diagnosis", "SoulReadingApp.astro"), "utf8")
]);

ok(world.includes("評価サーバーとは"), "The world page must explain the evaluation server.");
["声の良さ", "コミュニケーション力", "浮上率", "鯖理解度"].forEach((criterion) => ok(world.includes(criterion), `The world page must name the public criterion: ${criterion}.`));
const evaluationLead = "冥獄城では、説明会または時間外面接を終えると、まず「亡霊」として城内へ入ります。その後、普段の通話や交流を通して、声の良さ、コミュニケーション力、浮上率、鯖理解度を見ながら、評価を経て魔人、さらに魔族へ進む仕組みです。";
ok(world.includes(evaluationLead), "The world page must use the approved evaluation-server explanation.");
ok(world.includes("説明会は、そこで合否を決める試験ではありません。"), "The world page must state that the orientation is not a pass/fail test.");
ok(world.includes("任意コンテンツ") && world.includes("提出も必要ありません"), "The world page must make the soul reading optional and submission-free.");
ok(home.includes(">魂の診断で遊ぶ<"), "The home CTA must frame the soul reading as play.");
ok(join.includes(">待ち時間に魂の診断で遊ぶ<"), "The join CTA must frame the soul reading as a waiting-time activity.");
ok(join.includes("任意のコンテンツで、入城や評価には影響せず、結果の提出も必要ありません。"), "The join page must explain that the soul reading is optional and unrelated to entry or evaluation.");
ok(readingApp.includes("説明会や時間外面接までの待ち時間にも遊べます。"), "The soul-reading start screen must mention that it can be played while waiting.");
console.log("Soul-reading verification passed.");
