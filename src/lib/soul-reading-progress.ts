import { activities } from "../data/soul-reading";

export const SOUL_READING_PROGRESS_VERSION = 1 as const;
export const SOUL_READING_PROGRESS_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const progressScreens = ["question", "interlude", "pick", "review", "reveal", "result"] as const;
const progressStatuses = ["in-progress", "completed"] as const;
const activityIds = new Set(activities.map((activity) => activity.id));

export type SoulReadingProgressScreen = (typeof progressScreens)[number];
export type SoulReadingProgressStatus = (typeof progressStatuses)[number];

export type SavedSoulReadingProgress = {
  version: 1;
  updatedAt: string;
  status: SoulReadingProgressStatus;
  screen: SoulReadingProgressScreen;
  index: number;
  answers: number[];
  interests: string[];
  wishes: string[];
  flaggedQuestions: number[];
};

const hasOwn = (value: object, key: string) => Object.prototype.hasOwnProperty.call(value, key);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isUnique = <T>(values: readonly T[]) => new Set(values).size === values.length;
const isDenseArray = (value: unknown): value is unknown[] =>
  Array.isArray(value) && Array.from({ length: value.length }, (_, index) => hasOwn(value, String(index))).every(Boolean);
const isStringArray = (value: unknown): value is string[] =>
  isDenseArray(value) && value.every((item) => typeof item === "string");
const isAnswerArray = (value: unknown): value is number[] =>
  isDenseArray(value) && value.length <= 12 && value.every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 3);
const isActivitySelection = (value: unknown): value is string[] =>
  isStringArray(value) && value.length <= 2 && isUnique(value) && value.every((id) => activityIds.has(id as (typeof activities)[number]["id"]));
const isFlaggedQuestionList = (value: unknown): value is number[] =>
  isDenseArray(value) && isUnique(value) && value.every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item < 12);
const hasFinishedAnswers = (progress: Pick<SavedSoulReadingProgress, "answers" | "interests" | "wishes">) =>
  progress.answers.length === 12 && progress.interests.length === 2 && progress.wishes.length === 2;

export function isSoulReadingProgressExpired(updatedAt: string, now = new Date()): boolean {
  const timestamp = Date.parse(updatedAt);
  if (!Number.isFinite(timestamp)) return true;
  const elapsed = now.getTime() - timestamp;
  return elapsed < 0 || elapsed > SOUL_READING_PROGRESS_MAX_AGE_MS;
}

export function sanitizeSoulReadingProgress(input: unknown): SavedSoulReadingProgress | undefined {
  try {
    if (!isRecord(input)) return undefined;
    const expectedKeys = ["version", "updatedAt", "status", "screen", "index", "answers", "interests", "wishes", "flaggedQuestions"];
    if (Object.keys(input).length !== expectedKeys.length || !expectedKeys.every((key) => hasOwn(input, key))) return undefined;
    if (input.version !== SOUL_READING_PROGRESS_VERSION || typeof input.updatedAt !== "string") return undefined;
    const timestamp = Date.parse(input.updatedAt);
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString() !== input.updatedAt) return undefined;
    if (!progressStatuses.includes(input.status as SoulReadingProgressStatus) || !progressScreens.includes(input.screen as SoulReadingProgressScreen)) return undefined;
    if (typeof input.index !== "number" || !Number.isInteger(input.index) || input.index < 0 || input.index > 13) return undefined;
    if (!isAnswerArray(input.answers) || !isActivitySelection(input.interests) || !isActivitySelection(input.wishes) || !isFlaggedQuestionList(input.flaggedQuestions)) return undefined;

    const progress = {
      version: SOUL_READING_PROGRESS_VERSION,
      updatedAt: input.updatedAt,
      status: input.status as SoulReadingProgressStatus,
      screen: input.screen as SoulReadingProgressScreen,
      index: input.index,
      answers: [...input.answers],
      interests: [...input.interests],
      wishes: [...input.wishes],
      flaggedQuestions: [...input.flaggedQuestions]
    } satisfies SavedSoulReadingProgress;

    if (progress.screen === "question" && (progress.index > 11 || progress.answers.length < progress.index)) return undefined;
    if (progress.screen === "interlude" && (progress.index !== 6 || progress.answers.length < 6)) return undefined;
    if (progress.screen === "pick" && (progress.index === 12 ? progress.answers.length !== 12 : progress.index !== 13 || progress.answers.length !== 12 || progress.interests.length !== 2)) return undefined;
    if (["review", "reveal", "result"].includes(progress.screen) && (!hasFinishedAnswers(progress) || progress.index !== 13)) return undefined;

    // Legacy in-progress reveal/result states are normalized so a reload never reruns the reveal.
    if ((progress.screen === "reveal" || progress.screen === "result") && hasFinishedAnswers(progress)) {
      return { ...progress, status: "completed", screen: "result", index: 13 };
    }
    if (progress.status === "completed" && (progress.screen !== "result" || !hasFinishedAnswers(progress))) return undefined;
    if (progress.status === "in-progress" && progress.screen === "result") return undefined;
    return progress;
  } catch {
    return undefined;
  }
}

export function parseSoulReadingProgress(raw: string | null, now = new Date()): SavedSoulReadingProgress | undefined {
  if (!raw) return undefined;
  try {
    const progress = sanitizeSoulReadingProgress(JSON.parse(raw));
    return progress && !isSoulReadingProgressExpired(progress.updatedAt, now) ? progress : undefined;
  } catch {
    return undefined;
  }
}

export function serializeSoulReadingProgress(progress: SavedSoulReadingProgress): string {
  const sanitized = sanitizeSoulReadingProgress(progress);
  if (!sanitized) throw new Error("Cannot serialize invalid soul-reading progress.");
  return JSON.stringify(sanitized);
}
