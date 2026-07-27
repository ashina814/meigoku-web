export type RecruitmentState = "open" | "limited" | "closed" | "preparing";

export interface JoinConfig {
  recruitmentState: RecruitmentState;
  sessionTimes: string[];
  closedDays: string[];
  inviteUrl: string;
  applicationTemplate: string;
  lastReviewedAt: string;
}

export const joinConfig: JoinConfig = {
  recruitmentState: "preparing",
  sessionTimes: [],
  closedDays: [],
  inviteUrl: "",
  applicationTemplate: "",
  lastReviewedAt: ""
};

export const recruitmentMessages: Record<RecruitmentState, string> = {
  open: "入城受付中",
  limited: "入城受付を一部調整中",
  closed: "現在、入城受付を停止しています",
  preparing: "入城案内を準備しています"
};
