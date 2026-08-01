export type RecruitmentState = "open" | "limited" | "closed" | "preparing";

export interface JoinConfig {
  recruitmentState: RecruitmentState;
  sessionTimes: readonly string[];
  closedWeekdays: readonly number[];
  inviteUrl: string;
  outOfHoursInterview: string;
  lastReviewedAt: string;
  timeZone: "Asia/Tokyo";
}

/**
 * Publicly approved participation settings. Do not store Discord IDs,
 * channel IDs, role IDs, or non-public URLs in this repository.
 */
export const joinConfig: JoinConfig = {
  recruitmentState: "open",
  sessionTimes: ["21:00", "22:00", "23:00"],
  closedWeekdays: [1, 4], // Monday / Thursday in JavaScript weekday numbering.
  inviteUrl: "https://discord.gg/gN6zZZwWx3",
  outOfHoursInterview: "30分単位で相談可能",
  lastReviewedAt: "2026-07-31",
  timeZone: "Asia/Tokyo"
};

export const recruitmentMessages: Record<RecruitmentState, string> = {
  open: "入城受付中",
  limited: "入城受付を一部調整中",
  closed: "現在、入城受付を停止しています",
  preparing: "入城案内を準備しています"
};

export const canShowInvite = (config = joinConfig) =>
  config.recruitmentState === "open" && Boolean(config.inviteUrl.trim());
