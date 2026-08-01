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
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isAnswerArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.length <= 12 && value.every((item) => Number.isInteger(item) && item >= 0 && item <= 3);
const isActivitySelection = (value: unknown): value is string[] =>
  isStringArray(value) && value.length <= 2 && isUnique(value) && value.every((id) => activityIds.has(id as (typeof activities)[number]["id"]));
const isFlaggedQuestionList = (value: unknown): value is number[] =>
  Array.isArray(value) && isUnique(value) && value.every((item) => Number.isInteger(item) && item >= 0 && item < 12);

export function isSoulReadingProgressExpired(updatedAt: string, now = new Date()): boolean {
  const timestamp = Date.parse(updatedAt);
  if (!Number.isFinite(timestamp)) return true;
  const elapsed = now.getTime() - timestamp;
  return elapsed < 0 || elapsed > SOUL_READING_PROGRESS_MAX_AGE_MS;
}

export function sanitizeSoulReadingProgress(input: unknown): SavedSoulReadingProgress | undefined {
  if (!isRecord(input)) return undefined;
  const expectedKeys = ["version", "updatedAt", "status", "screen", "index", "answers", "interests", "wishes", "flaggedQuestions"];
  if (Object.keys(input).length !== expectedKeys.length || !expectedKeys.every((key) => hasOwn(input, key))) return undefined;
  if (input.version !== SOUL_READING_PROGRESS_VERSION || typeof input.updatedAt !== "string") return undefined;
  if (new Date(input.updatedAt).toISOString() !== input.updatedAt) return undefined;
  if (!progressStatuses.includes(input.status as SoulReadingProgressStatus) || !progressScreens.includes(input.screen as SoulReadingProgressScreen)) return undefined;
  if (typeof input.index !== "number" || !Number.isInteger(input.index) || input.index < 0 || input.index > 13) return undefined;
  if (input.screen === "question" && input.index > 11) return undefined;
  if (input.screen === "interlude" && input.index !== 6) return undefined;
  if (input.screen === "pick" && input.index !== 12 && input.index !== 13) return undefined;
  if (["review", "reveal", "result"].includes(input.screen as SoulReadingProgressScreen) && input.index !== 13) return undefined;
  if (!isAnswerArray(input.answers) || !isActivitySelection(input.interests) || !isActivitySelection(input.wishes) || !isFlaggedQuestionList(input.flaggedQuestions)) return undefined;
  if (input.status === "completed" && (input.screen !== "result" || input.answers.length !== 12 || input.interests.length !== 2 || input.wishes.length !== 2)) return undefined;

  return {
    version: SOUL_READING_PROGRESS_VERSION,
    updatedAt: input.updatedAt,
    status: input.status as SoulReadingProgressStatus,
    screen: input.screen as SoulReadingProgressScreen,
    index: input.index,
    answers: [...input.answers],
    interests: [...input.interests],
    wishes: [...input.wishes],
    flaggedQuestions: [...input.flaggedQuestions]
  };
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
