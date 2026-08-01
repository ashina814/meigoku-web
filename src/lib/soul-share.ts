import type { SoulId } from "../data/brand";
import type { SoulResultText } from "../data/soul-results";

export const createSoulResultPath = (soulId: SoulId) => `/soul-reading/result/${soulId}`;

export const createSoulResultUrl = (soulId: SoulId, origin: string) =>
  new URL(createSoulResultPath(soulId), origin).href;

export const createSoulShareTitle = (result: Pick<SoulResultText, "name">) =>
  `私の魂型は「${result.name}」でした｜冥獄城 魂の診断`;

export const createSoulShareText = (result: Pick<SoulResultText, "name" | "line">) =>
  `私の魂型は「${result.name}」でした。\n\n${result.line}\n\n冥獄城｜魂の診断\n#魂の診断 #冥獄城`;
