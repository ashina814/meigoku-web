import { soulTypes, type SoulId } from "../data/brand";
import { activities, axes, easeLabels, soulQuestions, type Axis } from "../data/soul-reading";

export type SoulReadingResult = {
  soul: (typeof soulTypes)[number];
  rawNorm: Record<Axis, number>;
  displayNorm: Record<Axis, number>;
  easiest: string[];
  activityCards: (typeof activities)[number][];
  oneMonthWishes: (typeof activities)[number][];
};

const profiles: Record<SoulId, Record<Axis, number>> = {
  tenka: { start: 1, pick: .5, read: .25, deep: .25, self: .75, roam: .75 }, kyomei: { start: .25, pick: 1, read: .5, deep: .75, self: .25, roam: .5 }, shinen: { start: .25, pick: .75, read: .5, deep: 1, self: .5, roam: .25 }, enka: { start: .5, pick: .75, read: .5, deep: .25, self: 1, roam: .75 }, chouritsu: { start: .5, pick: .75, read: 1, deep: .5, self: .25, roam: .5 }, yoimi: { start: .25, pick: .5, read: 1, deep: .75, self: .25, roam: .25 }, junyu: { start: .5, pick: .5, read: .5, deep: .25, self: .5, roam: 1 }, kokumei: { start: .5, pick: .25, read: .25, deep: .75, self: 1, roam: .5 }
};
const tieBreak: Record<SoulId, string[]> = { tenka: ["events", "planning", "social", "streaming", "economy", "creation"], kyomei: ["social", "creation", "events", "planning", "streaming", "economy"], shinen: ["creation", "social", "streaming", "events", "planning", "economy"], enka: ["events", "social", "streaming", "creation", "planning", "economy"], chouritsu: ["planning", "social", "events", "creation", "economy", "streaming"], yoimi: ["creation", "streaming", "social", "events", "planning", "economy"], junyu: ["social", "economy", "events", "planning", "streaming", "creation"], kokumei: ["creation", "streaming", "economy", "social", "planning", "events"] };

export const calculateSoulReading = (answers: number[], chosenActivities: string[], oneMonth: string[]): SoulReadingResult => {
  const axesScore = Object.fromEntries(axes.map((axis) => [axis, 0])) as Record<Axis, number>;
  const types = Object.fromEntries(soulTypes.map((type) => [type.id, 0])) as Record<SoulId, number>;
  const ease = new Map<string, number>();
  answers.forEach((answer, index) => {
    const option = soulQuestions[index]?.options[answer];
    if (!option) return;
    types[option.primary] += 2; types[option.secondary] += 1; axesScore[option.axis2] += 2; axesScore[option.axis1] += 1;
    [...(option.ease ?? []), ...(option.entryEase ? [option.entryEase] : [])].forEach((id) => ease.set(id, (ease.get(id) ?? 0) + 1));
  });
  const rawNorm = Object.fromEntries(axes.map((axis) => [axis, Math.min(1, axesScore[axis] / 24)])) as Record<Axis, number>;
  // Display only: keep the shape legible without using this 24% floor for classification.
  const displayNorm = Object.fromEntries(axes.map((axis) => [axis, .24 + rawNorm[axis] * .76])) as Record<Axis, number>;
  const ranked = [...soulTypes].sort((a, b) => {
    const score = (id: SoulId) => types[id] - axes.reduce((sum, axis) => sum + Math.pow(profiles[id][axis] - rawNorm[axis], 2), 0);
    return score(b.id) - score(a.id);
  });
  const soul = ranked[0];
  const rankActivity = (id: string) => [oneMonth.includes(id) ? 0 : 1, tieBreak[soul.id].indexOf(id)];
  const activityCards = activities.filter((activity) => chosenActivities.includes(activity.id)).sort((a, b) => rankActivity(a.id).toString().localeCompare(rankActivity(b.id).toString()));
  return { soul, rawNorm, displayNorm, easiest: [...ease.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => easeLabels[id]), activityCards, oneMonthWishes: activities.filter((activity) => oneMonth.includes(activity.id)) };
};
