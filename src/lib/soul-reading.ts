import type { SoulId } from "../data/brand";
import { activities, axes, axisMaximums, easeLabels, easeTieOrder, soulQuestions, type Axis } from "../data/soul-reading";
import { soulResultTypes, type SoulResultText } from "../data/soul-results";

export type SoulReadingResult = { soul: SoulResultText; second: SoulResultText; typeScores: Record<SoulId, number>; primaryCounts: Record<SoulId, number>; rawNorm: Record<Axis, number>; displayNorm: Record<Axis, number>; easiest: string[]; activityCards: (typeof activities)[number][]; oneMonthWishes: (typeof activities)[number][]; showMix: boolean };
const tieBreak: Record<SoulId, string[]> = { tenka:["events","planning","social","streaming","economy","creation"], kyomei:["social","creation","events","planning","streaming","economy"], shinen:["creation","social","streaming","events","planning","economy"], enka:["events","social","streaming","creation","planning","economy"], chouritsu:["planning","social","events","creation","economy","streaming"], yoimi:["creation","streaming","social","events","planning","economy"], junyu:["social","economy","events","planning","streaming","creation"], kokumei:["creation","streaming","economy","social","planning","events"] };
export const shouldShowMix = (winnerScore: number, secondScore: number) => winnerScore - secondScore >= 0 && winnerScore - secondScore <= 2;
export const rankSoulTypes = (typeScores: Record<SoulId, number>, primaryCounts: Record<SoulId, number>, rawNorm: Record<Axis, number>) => {
  const distance = (type: SoulResultText) => axes.reduce((sum, axis) => sum + Math.pow(type.profile[axis] - rawNorm[axis], 2), 0);
  // Returning zero retains the fixed order of soulResultTypes as the final tiebreak.
  return [...soulResultTypes].sort((a, b) => typeScores[b.id] - typeScores[a.id] || primaryCounts[b.id] - primaryCounts[a.id] || distance(a) - distance(b));
};

export const calculateSoulReading = (answers: number[], chosenActivities: string[], oneMonth: string[]): SoulReadingResult => {
  const axesScore = Object.fromEntries(axes.map((axis) => [axis, 0])) as Record<Axis, number>;
  const typeScores = Object.fromEntries(soulResultTypes.map((type) => [type.id, 0])) as Record<SoulId, number>;
  const primaryCounts = Object.fromEntries(soulResultTypes.map((type) => [type.id, 0])) as Record<SoulId, number>;
  const inferredEase = new Map<string, number>(); let explicitEase: string | undefined;
  answers.forEach((answer, index) => {
    const option = soulQuestions[index]?.options[answer]; if (!option) return;
    typeScores[option.primary] += 2; typeScores[option.secondary] += 1; primaryCounts[option.primary] += 1; axesScore[option.axis2] += 2; axesScore[option.axis1] += 1;
    if (index === 11) explicitEase = option.entryEase;
    else (option.ease ?? []).forEach((id) => inferredEase.set(id, (inferredEase.get(id) ?? 0) + 1));
  });
  const rawNorm = Object.fromEntries(axes.map((axis) => [axis, Math.max(0, Math.min(1, axesScore[axis] / axisMaximums[axis]))])) as Record<Axis, number>;
  const displayNorm = Object.fromEntries(axes.map((axis) => [axis, .24 + rawNorm[axis] * .76])) as Record<Axis, number>;
  // Lexicographic classification: score, primary choices, profile distance among tied candidates, then fixed data order.
  const ranked = rankSoulTypes(typeScores, primaryCounts, rawNorm);
  const soul = ranked[0]; const second = ranked[1];
  const inferred = [...inferredEase.entries()].filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1] || easeTieOrder.indexOf(a[0] as typeof easeTieOrder[number]) - easeTieOrder.indexOf(b[0] as typeof easeTieOrder[number]))[0]?.[0];
  const easiest = [explicitEase, inferred].filter((id, index, ids): id is string => Boolean(id) && ids.indexOf(id) === index).map((id) => easeLabels[id]);
  const rankActivity = (id: string) => [oneMonth.includes(id) ? 0 : 1, tieBreak[soul.id].indexOf(id)] as const;
  const activityCards = activities.filter((activity) => chosenActivities.includes(activity.id)).sort((a, b) => rankActivity(a.id)[0] - rankActivity(b.id)[0] || rankActivity(a.id)[1] - rankActivity(b.id)[1]);
  return { soul, second, typeScores, primaryCounts, rawNorm, displayNorm, easiest, activityCards, oneMonthWishes: activities.filter((activity) => oneMonth.includes(activity.id)), showMix: shouldShowMix(typeScores[soul.id], typeScores[second.id]) };
};
