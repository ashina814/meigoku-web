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
console.log("Soul-reading verification passed.");
