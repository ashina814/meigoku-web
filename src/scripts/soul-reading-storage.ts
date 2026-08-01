import {
  parseSoulReadingProgress,
  serializeSoulReadingProgress,
  type SavedSoulReadingProgress
} from "../lib/soul-reading-progress";

export const soulReadingProgressStorageKey = "meigoku:soul-reading:progress:v1";

export type SoulReadingStorageChange =
  | { kind: "updated"; progress: SavedSoulReadingProgress }
  | { kind: "deleted" };

export function parseSoulReadingStorageChange(newValue: string | null): SoulReadingStorageChange | undefined {
  if (newValue === null) return { kind: "deleted" };
  const progress = parseSoulReadingProgress(newValue);
  return progress ? { kind: "updated", progress } : undefined;
}

export function loadSoulReadingProgress(): SavedSoulReadingProgress | undefined {
  try {
    const raw = window.localStorage.getItem(soulReadingProgressStorageKey);
    const progress = parseSoulReadingProgress(raw);
    if (!progress && raw) window.localStorage.removeItem(soulReadingProgressStorageKey);
    return progress;
  } catch {
    return undefined;
  }
}

export function saveSoulReadingProgress(progress: SavedSoulReadingProgress): boolean {
  try {
    window.localStorage.setItem(soulReadingProgressStorageKey, serializeSoulReadingProgress(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearSoulReadingProgress(): void {
  try {
    window.localStorage.removeItem(soulReadingProgressStorageKey);
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}
