import {
  SOUL_READING_PROGRESS_MAX_AGE_MS,
  parseSoulReadingProgress,
  sanitizeSoulReadingProgress,
  serializeSoulReadingProgress,
  type SavedSoulReadingProgress
} from "../src/lib/soul-reading-progress";

const ok = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const now = new Date("2026-08-01T00:00:00.000Z");
const inProgress: SavedSoulReadingProgress = {
  version: 1,
  updatedAt: now.toISOString(),
  status: "in-progress",
  screen: "question",
  index: 5,
  answers: [0, 1, 2, 3, 0],
  interests: [],
  wishes: [],
  flaggedQuestions: [1, 3]
};
const completed: SavedSoulReadingProgress = {
  ...inProgress,
  status: "completed",
  screen: "result",
  index: 13,
  answers: Array.from({ length: 12 }, (_, index) => index % 4),
  interests: ["social", "events"],
  wishes: ["creation", "planning"]
};
const completedSerialized = serializeSoulReadingProgress(completed);

ok(parseSoulReadingProgress(serializeSoulReadingProgress(inProgress), now)?.index === 5, "A valid in-progress reading must parse.");
ok(parseSoulReadingProgress(completedSerialized, now)?.status === "completed", "A completed result must remain resumable.");
ok(parseSoulReadingProgress(completedSerialized, now)?.screen === "result", "A completed result must restore directly to the result screen.");
ok(!/(soul|score|axis|rawNorm|displayNorm)/i.test(completedSerialized.replace(/"(social|events|creation|planning)"/g, "")), "Saved progress must not contain a type, score, or axis value.");

const freshProgress = { ...inProgress, updatedAt: now.toISOString() };
ok(Boolean(parseSoulReadingProgress(serializeSoulReadingProgress(freshProgress), new Date(now.getTime() + SOUL_READING_PROGRESS_MAX_AGE_MS))), "Exactly thirty days old must remain resumable.");
ok(!parseSoulReadingProgress(serializeSoulReadingProgress(freshProgress), new Date(now.getTime() + SOUL_READING_PROGRESS_MAX_AGE_MS + 1)), "Older than thirty days must expire.");
ok(!parseSoulReadingProgress(serializeSoulReadingProgress(freshProgress), new Date(now.getTime() - 1)), "Future progress must not parse.");

const invalid = (input: unknown, label: string) => ok(!sanitizeSoulReadingProgress(input), `Invalid progress was accepted: ${label}`);
invalid({ ...inProgress, version: 2 }, "version");
invalid({ ...inProgress, screen: "start" }, "screen");
invalid({ ...inProgress, index: 12.5 }, "index");
invalid({ ...inProgress, index: 12 }, "question screen index");
invalid({ ...inProgress, answers: [0, 1, 2] }, "question answers before current index");
invalid({ ...inProgress, screen: "interlude", index: 6, answers: [0, 1, 2, 3, 0] }, "interlude requires six answers");
invalid({ ...inProgress, screen: "pick", index: 12, answers: Array.from({ length: 11 }, () => 0) }, "Q13 requires twelve answers");
invalid({ ...completed, status: "in-progress", screen: "review", wishes: ["creation"] }, "incomplete review");
invalid({ ...completed, status: "completed", screen: "review" }, "completed review screen");
invalid({ ...inProgress, answers: [4] }, "answer range");
invalid({ ...inProgress, answers: Array.from({ length: 13 }, () => 0) }, "answer count");
invalid({ ...inProgress, interests: ["unknown"] }, "activity id");
invalid({ ...inProgress, interests: ["social", "social"] }, "duplicate activity");
invalid({ ...inProgress, wishes: ["social", "events", "creation"] }, "three activities");
invalid({ ...completed, interests: ["social"] }, "incomplete completed progress");
invalid({ ...inProgress, flaggedQuestions: [2, 2] }, "duplicate flag");
invalid({ ...inProgress, flaggedQuestions: [12] }, "flag range");
invalid({ ...inProgress, updatedAt: "" }, "empty timestamp");
invalid({ ...inProgress, updatedAt: "not-a-date" }, "invalid timestamp");
invalid({ ...inProgress, scores: [99] }, "extra score data");
ok(!parseSoulReadingProgress("{not json", now), "Malformed JSON must not parse.");
const prototypePayload = JSON.parse(serializeSoulReadingProgress(inProgress));
Object.defineProperty(prototypePayload, "__proto__", { value: { polluted: true }, enumerable: true });
ok(!parseSoulReadingProgress(JSON.stringify(prototypePayload), now), "Unexpected prototype-shaped fields must not parse.");

const legacyReveal = { ...completed, status: "in-progress" as const, screen: "reveal" as const };
const normalizedReveal = sanitizeSoulReadingProgress(legacyReveal);
ok(normalizedReveal?.status === "completed" && normalizedReveal.screen === "result", "A reveal reload must normalize to the completed result.");

console.log("Soul-reading progress verification passed.");
